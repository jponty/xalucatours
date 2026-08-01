"""Populate Supabase's canonical media registry from a Phase 1 backup.

The importer is deliberately conservative:

* it never deletes or moves Storage objects;
* it consolidates identical bytes and repeated provider IDs into one asset;
* it preserves every physical path in asset metadata;
* it creates usages only from authoritative CMS records; and
* it is idempotent, using deterministic UUIDs and existing-row checks.

Run without ``--apply`` to generate and validate the import plan first.
"""

from __future__ import annotations

import argparse
import json
import os
import re
import urllib.parse
import urllib.request
import uuid
from collections import defaultdict
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, Iterable, List, Optional, Tuple


BACKEND_DIR = Path(__file__).resolve().parent
PROJECT_DIR = BACKEND_DIR.parent
DEFAULT_BACKUP = PROJECT_DIR / ".migration-backups" / "phase1-20260731"
UUID_NAMESPACE = uuid.UUID("54df5b03-bcb1-4bea-936a-a0ea7db29391")
PEXELS_RE = re.compile(r"^pexels_(\d+)_")
UNSPLASH_RE = re.compile(r"^unsplash_(.+)_[0-9a-f]{8}\.[^.]+$", re.I)
API_FILES_RE = re.compile(r"/api/files/([^?#]+)")
STORAGE_PUBLIC_RE = re.compile(r"/storage/v1/object/(?:public|authenticated)/[^/]+/(.+)")


def load_env(path: Path) -> None:
    for raw in path.read_text(encoding="utf-8").splitlines():
        line = raw.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        os.environ.setdefault(key.strip(), value.strip().strip('"').strip("'"))


def read_json(path: Path) -> Any:
    return json.loads(path.read_text(encoding="utf-8"))


def write_json(path: Path, value: Any) -> None:
    path.write_text(
        json.dumps(value, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )


def document(row: dict) -> dict:
    value = row.get("data", row)
    if isinstance(value, str):
        try:
            value = json.loads(value)
        except json.JSONDecodeError:
            return row
    return value if isinstance(value, dict) else row


def storage_path(value: Any) -> Optional[str]:
    if not isinstance(value, str) or not value:
        return None
    value = urllib.parse.unquote(value)
    if value.startswith("xaluca/"):
        return value.split("?", 1)[0]
    match = API_FILES_RE.search(value)
    if match:
        return match.group(1).split("?", 1)[0]
    match = STORAGE_PUBLIC_RE.search(value)
    if match:
        return match.group(1).split("?", 1)[0]
    return None


def provider_identity(item: dict) -> Tuple[str, Optional[str]]:
    basename = Path(item["storage_path"]).name
    pexels = PEXELS_RE.match(basename)
    if pexels:
        return "pexels", pexels.group(1)
    unsplash = UNSPLASH_RE.match(basename)
    if unsplash:
        return "unsplash", unsplash.group(1)
    source = item.get("source") or "upload"
    if source == "manual":
        source = "upload"
    metadata = item.get("source_metadata") or {}
    if (metadata.get("pexels") or {}).get("pexels_id") is not None:
        return "pexels", str(metadata["pexels"]["pexels_id"])
    unsplash_meta = metadata.get("unsplash") or {}
    external_id = unsplash_meta.get("id") or unsplash_meta.get("unsplash_id")
    return source, str(external_id) if external_id is not None else None


class UnionFind:
    def __init__(self, size: int) -> None:
        self.parent = list(range(size))

    def find(self, index: int) -> int:
        while self.parent[index] != index:
            self.parent[index] = self.parent[self.parent[index]]
            index = self.parent[index]
        return index

    def union(self, left: int, right: int) -> None:
        left_root, right_root = self.find(left), self.find(right)
        if left_root != right_root:
            self.parent[right_root] = left_root


def canonical_rank(item: dict, used_paths: set[str]) -> tuple:
    path = item["storage_path"]
    return (
        path in used_paths,
        "/library/" in path,
        (item.get("mime") or "") in {"image/avif", "image/webp"},
        int(item.get("width") or 0) * int(item.get("height") or 0),
        int(item.get("size") or 0),
        path,
    )


def make_usage(
    asset_id: str,
    owner_type: str,
    owner_id: str,
    position: Optional[int],
    original_path: str,
    original_url: Optional[str],
    source_table: str,
    source_field: str,
    extra: Optional[dict] = None,
) -> dict:
    metadata = {
        "original_storage_path": original_path,
        "original_url": original_url,
        "source_table": source_table,
        "source_field": source_field,
    }
    metadata.update(extra or {})
    identity = json.dumps(
        [asset_id, owner_type, owner_id, position, source_table, source_field],
        separators=(",", ":"),
        ensure_ascii=False,
    )
    return {
        "id": str(uuid.uuid5(UUID_NAMESPACE, "usage:" + identity)),
        "asset_id": asset_id,
        "owner_type": owner_type,
        "owner_id": owner_id,
        "position": position,
        "metadata": metadata,
    }


def build_plan(backup: Path) -> dict:
    manifest = [item for item in read_json(backup / "media-manifest.json") if item.get("in_bucket")]
    by_path = {item["storage_path"]: item for item in manifest}
    tables = backup / "supabase-tables"
    slot_rows = read_json(tables / "mirror_image_slots.json")
    gallery_rows = read_json(tables / "mirror_day_galleries.json")
    location_rows = read_json(tables / "mirror_library_locations.json")

    authoritative: List[dict] = []
    unresolved: List[dict] = []

    for row in slot_rows:
        data = document(row)
        url = data.get("url")
        path = storage_path(url) or storage_path(data.get("storage_path"))
        if path in by_path:
            authoritative.append({
                "owner_type": "image_slot", "owner_id": str(row.get("id") or data.get("_id")),
                "position": None, "path": path, "url": url,
                "source_table": "mirror_image_slots", "source_field": "url",
                "extra": {"alt": data.get("alt"), "declared_source": data.get("source")},
            })
        elif path:
            unresolved.append({"table": "mirror_image_slots", "id": row.get("id"), "path": path, "url": url})

    for row in gallery_rows:
        data = document(row)
        owner_id = str(row.get("id") or data.get("_id"))
        for position, image in enumerate(data.get("images") or []):
            if not isinstance(image, dict):
                continue
            url = image.get("url")
            path = storage_path(url) or storage_path(image.get("storage_path"))
            if path in by_path:
                authoritative.append({
                    "owner_type": "day_gallery", "owner_id": owner_id,
                    "position": position, "path": path, "url": url,
                    "source_table": "mirror_day_galleries", "source_field": f"images[{position}]",
                    "extra": {"caption": image.get("caption"), "declared_source": image.get("source")},
                })
            elif path:
                unresolved.append({"table": "mirror_day_galleries", "id": owner_id, "position": position, "path": path, "url": url})

    for row in location_rows:
        data = document(row)
        owner_id = str(row.get("id") or data.get("_id"))
        for position, image in enumerate(data.get("images") or []):
            if not isinstance(image, dict):
                continue
            url = image.get("url")
            path = storage_path(url) or storage_path(image.get("storage_path"))
            if path in by_path:
                authoritative.append({
                    "owner_type": "library_location", "owner_id": owner_id,
                    "position": position, "path": path, "url": url,
                    "source_table": "mirror_library_locations", "source_field": f"images[{position}]",
                    "extra": {"caption": image.get("caption"), "declared_source": image.get("source")},
                })
            elif path:
                unresolved.append({"table": "mirror_library_locations", "id": owner_id, "position": position, "path": path, "url": url})

    used_paths = {usage["path"] for usage in authoritative}
    union = UnionFind(len(manifest))
    first_sha: Dict[str, int] = {}
    first_provider: Dict[Tuple[str, str], int] = {}
    for index, item in enumerate(manifest):
        sha = item["sha256"]
        if sha in first_sha:
            union.union(index, first_sha[sha])
        else:
            first_sha[sha] = index
        source, external_id = provider_identity(item)
        if external_id:
            key = (source, external_id)
            if key in first_provider:
                union.union(index, first_provider[key])
            else:
                first_provider[key] = index

    components: Dict[int, List[dict]] = defaultdict(list)
    for index, item in enumerate(manifest):
        components[union.find(index)].append(item)

    assets: List[dict] = []
    path_to_asset: Dict[str, str] = {}
    provider_collisions: List[dict] = []
    for members in components.values():
        canonical = max(members, key=lambda value: canonical_rank(value, used_paths))
        identities = sorted({provider_identity(member) for member in members if provider_identity(member)[1]})
        sources = sorted({provider_identity(member)[0] for member in members})
        source, external_id = provider_identity(canonical)
        if identities:
            source, external_id = identities[0]
        hashes = sorted({member["sha256"] for member in members})
        if len(hashes) > 1:
            provider_collisions.append({
                "source": source, "external_id": external_id, "sha256_values": hashes,
                "paths": sorted(member["storage_path"] for member in members),
            })
        component_identity = "|".join(sorted(member["storage_path"] for member in members))
        asset_id = str(uuid.uuid5(UUID_NAMESPACE, "asset:" + component_identity))
        source_metadata = canonical.get("source_metadata") or {}
        pexels = source_metadata.get("pexels") or {}
        unsplash = source_metadata.get("unsplash") or {}
        alt = pexels.get("alt") or unsplash.get("alt")
        attribution = pexels or unsplash or None
        original_filename = source_metadata.get("original_filename") or Path(canonical["storage_path"]).name
        metadata = {
            "alternate_storage_paths": sorted(member["storage_path"] for member in members if member is not canonical),
            "all_storage_paths": sorted(member["storage_path"] for member in members),
            "physical_object_count": len(members),
            "all_sha256": hashes,
            "detected_sources": sources,
            "supabase_bucket": os.environ.get("SUPABASE_STORAGE_BUCKET", "xaluca"),
        }
        asset = {
            "id": asset_id,
            "storage_path": canonical["storage_path"],
            "sha256": canonical["sha256"],
            "source": source,
            "external_id": external_id,
            "original_filename": original_filename,
            "mime_type": canonical.get("mime"),
            "size_bytes": canonical.get("size"),
            "width": canonical.get("width"),
            "height": canonical.get("height"),
            "alt_i18n": {"default": alt} if alt else None,
            "attribution": attribution,
            "focal_point": None,
            "metadata": metadata,
            "migrated_at": None,
        }
        assets.append(asset)
        for member in members:
            path_to_asset[member["storage_path"]] = asset_id

    usages: List[dict] = []
    for use in authoritative:
        usages.append(make_usage(
            path_to_asset[use["path"]], use["owner_type"], use["owner_id"],
            use["position"], use["path"], use["url"], use["source_table"],
            use["source_field"], use.get("extra"),
        ))
    for item in manifest:
        library_id = item.get("library_record_id")
        if library_id:
            usages.append(make_usage(
                path_to_asset[item["storage_path"]], "media_library", str(library_id), None,
                item["storage_path"], item.get("current_url"), "mirror_files", "storage_path",
                {"in_library": bool(item.get("in_library"))},
            ))

    assets.sort(key=lambda value: value["storage_path"])
    usages = sorted({usage["id"]: usage for usage in usages}.values(), key=lambda value: value["id"])
    canonical_ids = {asset["id"] for asset in assets}
    broken_usages = [usage["id"] for usage in usages if usage["asset_id"] not in canonical_ids]
    duplicate_asset_ids = len(assets) - len(canonical_ids)
    duplicate_storage_paths = len(assets) - len({asset["storage_path"] for asset in assets})
    duplicate_sha256 = len(assets) - len({asset["sha256"] for asset in assets})
    provider_keys = [
        (asset["source"], asset["external_id"])
        for asset in assets if asset["external_id"] is not None
    ]
    duplicate_provider_keys = len(provider_keys) - len(set(provider_keys))
    production_unresolved = [
        item for item in unresolved
        if not str(item.get("id") or "").startswith("test-usage.")
    ]
    return {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "source_backup": str(backup),
        "summary": {
            "physical_objects": len(manifest),
            "canonical_assets": len(assets),
            "consolidated_physical_duplicates": len(manifest) - len(assets),
            "authoritative_cms_usages": len(authoritative),
            "library_usages": sum(1 for usage in usages if usage["owner_type"] == "media_library"),
            "total_usages": len(usages),
            "unresolved_internal_references": len(unresolved),
            "unresolved_production_references": len(production_unresolved),
            "provider_id_multi_hash_components": len(provider_collisions),
            "broken_asset_references": len(broken_usages),
            "duplicate_asset_ids": duplicate_asset_ids,
            "duplicate_storage_paths": duplicate_storage_paths,
            "duplicate_sha256": duplicate_sha256,
            "duplicate_provider_keys": duplicate_provider_keys,
        },
        "unresolved_internal_references": unresolved,
        "provider_id_multi_hash_components": provider_collisions,
        "assets": assets,
        "usages": usages,
    }


class SupabaseRest:
    def __init__(self) -> None:
        self.url = os.environ["SUPABASE_URL"].rstrip("/") + "/rest/v1"
        self.key = os.environ["SUPABASE_SERVICE_ROLE_KEY"]

    def request(self, path: str, method: str = "GET", payload: Any = None, headers: Optional[dict] = None) -> Any:
        request_headers = {"apikey": self.key, "Authorization": "Bearer " + self.key}
        request_headers.update(headers or {})
        data = None
        if payload is not None:
            data = json.dumps(payload, ensure_ascii=False).encode("utf-8")
            request_headers["Content-Type"] = "application/json"
        request = urllib.request.Request(self.url + path, data=data, headers=request_headers, method=method)
        with urllib.request.urlopen(request, timeout=180) as response:
            body = response.read()
            return json.loads(body) if body else None

    def existing_ids(self, table: str, page_size: int = 1000) -> set[str]:
        result: set[str] = set()
        offset = 0
        while True:
            rows = self.request(
                f"/{table}?select=id&order=id&offset={offset}&limit={page_size}"
            ) or []
            result.update(str(row["id"]) for row in rows)
            if len(rows) < page_size:
                return result
            offset += page_size

    def insert_missing(self, table: str, rows: Iterable[dict], batch_size: int = 200) -> int:
        existing = self.existing_ids(table)
        pending = [row for row in rows if row["id"] not in existing]
        for offset in range(0, len(pending), batch_size):
            self.request(
                f"/{table}", method="POST", payload=pending[offset:offset + batch_size],
                headers={"Prefer": "return=minimal"},
            )
        return len(pending)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--backup", type=Path, default=DEFAULT_BACKUP)
    parser.add_argument("--apply", action="store_true")
    args = parser.parse_args()
    load_env(BACKEND_DIR / ".env")
    plan = build_plan(args.backup.resolve())
    plan_path = args.backup / "media-registry-import-plan.json"
    write_json(plan_path, plan)
    print(json.dumps(plan["summary"], ensure_ascii=False, indent=2))
    print("Plan:", plan_path)
    summary = plan["summary"]
    validation_failures = (
        summary["broken_asset_references"]
        + summary["duplicate_asset_ids"]
        + summary["duplicate_storage_paths"]
        + summary["duplicate_sha256"]
        + summary["duplicate_provider_keys"]
        + summary["unresolved_production_references"]
    )
    if validation_failures:
        print("ERROR: the plan failed referential validation", file=os.sys.stderr)
        return 1
    if not args.apply:
        print("Dry-run only. Re-run with --apply after reviewing the plan.")
        return 0
    client = SupabaseRest()
    inserted_assets = client.insert_missing("media_assets", plan["assets"])
    inserted_usages = client.insert_missing("media_usages", plan["usages"])
    remote_asset_ids = client.existing_ids("media_assets")
    remote_usage_ids = client.existing_ids("media_usages")
    planned_asset_ids = {row["id"] for row in plan["assets"]}
    planned_usage_ids = {row["id"] for row in plan["usages"]}
    verification = {
        "inserted_assets": inserted_assets,
        "inserted_usages": inserted_usages,
        "remote_assets": len(remote_asset_ids),
        "remote_usages": len(remote_usage_ids),
        "planned_assets_missing_remotely": len(planned_asset_ids - remote_asset_ids),
        "planned_usages_missing_remotely": len(planned_usage_ids - remote_usage_ids),
        "unexpected_remote_assets": len(remote_asset_ids - planned_asset_ids),
        "unexpected_remote_usages": len(remote_usage_ids - planned_usage_ids),
    }
    write_json(args.backup / "media-registry-import-result.json", verification)
    print(json.dumps(verification, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
