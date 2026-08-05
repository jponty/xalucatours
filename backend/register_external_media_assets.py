"""Register verified code-owned Bunny images in Supabase's media registry.

This importer is idempotent and never modifies an existing media asset. It
uses deterministic UUIDs and stores code locations as ``media_usages``. When a
provider ID is already owned by a different byte variant, the ID is retained
in metadata rather than violating the registry's unique provider constraint.
"""

from __future__ import annotations

import argparse
import json
import uuid
from collections import Counter
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from import_media_registry import SupabaseRest, load_env


BACKEND_DIR = Path(__file__).resolve().parent
PROJECT_DIR = BACKEND_DIR.parent
DEFAULT_WORKDIR = PROJECT_DIR / ".migration-backups" / "external-bunny-20260805"
UUID_NAMESPACE = uuid.UUID("2a5101bb-351c-45dd-b7cb-08b67eef670f")


def read_json(path: Path) -> Any:
    return json.loads(path.read_text(encoding="utf-8"))


def write_json(path: Path, value: Any) -> None:
    path.write_text(
        json.dumps(value, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )


def fetch_all(client: SupabaseRest, table: str, fields: str) -> list[dict]:
    rows: list[dict] = []
    offset = 0
    while True:
        page = client.request(
            f"/{table}?select={fields}&offset={offset}&limit=1000"
        ) or []
        rows.extend(page)
        if len(page) < 1000:
            return rows
        offset += 1000


def build_plan(workdir: Path, existing_assets: list[dict]) -> dict:
    state = read_json(workdir / "pexels-copy-state.json")
    verified = sorted(
        (item for item in state.values() if item.get("status") == "verified"),
        key=lambda item: item["url"],
    )
    existing_provider_keys = {
        (str(row.get("source")), str(row.get("external_id")))
        for row in existing_assets
        if row.get("external_id") is not None
    }
    new_id_counts = Counter(str(item.get("external_id")) for item in verified)
    claimed_new_keys: set[tuple[str, str]] = set()
    now = datetime.now(timezone.utc).isoformat()
    assets = []
    usages = []
    provider_ids_in_metadata = 0

    for item in verified:
        asset_id = str(uuid.uuid5(UUID_NAMESPACE, "asset:" + item["storage_path"]))
        external_id = str(item.get("external_id")) if item.get("external_id") else None
        provider_key = ("pexels", external_id) if external_id else None
        can_claim_provider_id = bool(
            provider_key
            and provider_key not in existing_provider_keys
            and provider_key not in claimed_new_keys
            and new_id_counts[external_id] == 1
        )
        registry_external_id = external_id if can_claim_provider_id else None
        if can_claim_provider_id:
            claimed_new_keys.add(provider_key)
        elif external_id:
            provider_ids_in_metadata += 1
        assets.append({
            "id": asset_id,
            "storage_path": item["storage_path"],
            "sha256": item["sha256"],
            "source": "pexels",
            "external_id": registry_external_id,
            "original_filename": Path(item["storage_path"]).name,
            "mime_type": item.get("mime"),
            "size_bytes": item.get("size"),
            "width": item.get("width"),
            "height": item.get("height"),
            "attribution": {
                "provider": "pexels",
                "external_id": external_id,
                "source_url": item["url"],
            },
            "metadata": {
                "migration": "external-bunny-20260805",
                "provider_external_id": external_id,
                "original_url": item["url"],
                "code_owned": True,
            },
            "migrated_at": item.get("verified_at") or now,
        })
        for use in item.get("uses") or []:
            identity = f"usage:{asset_id}:{use['file']}:{use['line']}"
            usages.append({
                "id": str(uuid.uuid5(UUID_NAMESPACE, identity)),
                "asset_id": asset_id,
                "owner_type": "code_reference",
                "owner_id": use["file"],
                "position": int(use["line"]),
                "metadata": {
                    "source_field": "url_literal",
                    "original_url": item["url"],
                    "storage_path": item["storage_path"],
                },
            })

    return {
        "generated_at": now,
        "summary": {
            "assets": len(assets),
            "usages": len(usages),
            "provider_ids_in_column": sum(row["external_id"] is not None for row in assets),
            "provider_ids_preserved_in_metadata_only": provider_ids_in_metadata,
            "duplicate_asset_ids": len(assets) - len({row["id"] for row in assets}),
            "duplicate_storage_paths": len(assets) - len({row["storage_path"] for row in assets}),
            "duplicate_sha256": len(assets) - len({row["sha256"] for row in assets}),
            "duplicate_usage_ids": len(usages) - len({row["id"] for row in usages}),
        },
        "assets": assets,
        "usages": usages,
    }


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--workdir", type=Path, default=DEFAULT_WORKDIR)
    parser.add_argument("--apply", action="store_true")
    args = parser.parse_args()
    load_env(BACKEND_DIR / ".env")
    client = SupabaseRest()
    existing_assets = fetch_all(
        client, "media_assets", "id,storage_path,sha256,source,external_id"
    )
    plan = build_plan(args.workdir.resolve(), existing_assets)
    write_json(args.workdir / "pexels-registry-plan.json", plan)
    print(json.dumps(plan["summary"], indent=2))
    summary = plan["summary"]
    invalid = (
        summary["duplicate_asset_ids"]
        + summary["duplicate_storage_paths"]
        + summary["duplicate_sha256"]
        + summary["duplicate_usage_ids"]
    )
    if invalid:
        print("Registry plan failed uniqueness validation.")
        return 1
    if not args.apply:
        print("Dry-run complete. Re-run with --apply to register assets.")
        return 0

    inserted_assets = client.insert_missing("media_assets", plan["assets"])
    inserted_usages = client.insert_missing("media_usages", plan["usages"])
    remote_asset_ids = client.existing_ids("media_assets")
    remote_usage_ids = client.existing_ids("media_usages")
    expected_asset_ids = {row["id"] for row in plan["assets"]}
    expected_usage_ids = {row["id"] for row in plan["usages"]}
    result = {
        "inserted_assets": inserted_assets,
        "inserted_usages": inserted_usages,
        "assets_missing_after_insert": len(expected_asset_ids - remote_asset_ids),
        "usages_missing_after_insert": len(expected_usage_ids - remote_usage_ids),
    }
    write_json(args.workdir / "pexels-registry-result.json", result)
    print(json.dumps(result, indent=2))
    return 0 if not result["assets_missing_after_insert"] and not result["usages_missing_after_insert"] else 2


if __name__ == "__main__":
    raise SystemExit(main())
