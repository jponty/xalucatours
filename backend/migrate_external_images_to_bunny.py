"""Copy inventoried external images to Bunny without changing frontend URLs.

The default invocation is a read-only validation. Pass ``--apply`` to download
eligible images, upload them under content-addressed paths, and download them
again through Bunny Storage to verify the complete SHA-256. The generated map
is the rollback-safe input for a later, separate source-rewrite step.
"""

from __future__ import annotations

import argparse
import concurrent.futures
import hashlib
import json
import mimetypes
import os
import threading
import urllib.parse
import urllib.request
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from audit_media_backup import dimensions, sniff_mime
from migrate_media_to_bunny import BunnyStorage, load_env, safe_local_path


BACKEND_DIR = Path(__file__).resolve().parent
PROJECT_DIR = BACKEND_DIR.parent
DEFAULT_WORKDIR = PROJECT_DIR / ".migration-backups" / "external-bunny-20260805"
STATE_LOCK = threading.Lock()


def utc_now() -> str:
    return datetime.now(timezone.utc).isoformat()


def read_json(path: Path, default: Any = None) -> Any:
    if not path.exists():
        return default
    return json.loads(path.read_text(encoding="utf-8"))


def write_json_atomic(path: Path, value: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_name(path.name + ".tmp")
    temporary.write_text(
        json.dumps(value, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    temporary.replace(path)


def sha256_file(path: Path) -> tuple[str, int]:
    digest = hashlib.sha256()
    size = 0
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
            size += len(chunk)
    return digest.hexdigest(), size


def extension_for(mime: str, source_url: str) -> str:
    known = {
        "image/jpeg": "jpg",
        "image/png": "png",
        "image/webp": "webp",
        "image/avif": "avif",
        "image/gif": "gif",
    }
    if mime in known:
        return known[mime]
    guessed = mimetypes.guess_extension(mime or "") or Path(
        urllib.parse.urlsplit(source_url).path
    ).suffix
    return guessed.lstrip(".") or "bin"


def download(record: dict, objects_root: Path) -> dict:
    url = record["url"]
    url_hash = hashlib.sha256(url.encode("utf-8")).hexdigest()
    temporary_path = objects_root / "_downloads" / url_hash
    temporary_path.parent.mkdir(parents=True, exist_ok=True)
    partial = temporary_path.with_name(temporary_path.name + ".part")
    request = urllib.request.Request(
        url,
        headers={"User-Agent": "Xaluca-Media-Migration/1.0"},
    )
    digest = hashlib.sha256()
    size = 0
    with urllib.request.urlopen(request, timeout=120) as response, partial.open("wb") as output:
        response_mime = response.headers.get_content_type() or "application/octet-stream"
        while True:
            chunk = response.read(1024 * 1024)
            if not chunk:
                break
            output.write(chunk)
            digest.update(chunk)
            size += len(chunk)
    partial.replace(temporary_path)
    mime = sniff_mime(temporary_path, response_mime)
    if not mime.startswith("image/"):
        temporary_path.unlink(missing_ok=True)
        raise ValueError(f"External URL did not return an image ({mime})")
    extension = extension_for(mime, url)
    external_id = record.get("external_id") or url_hash[:16]
    storage_path = (
        f"xaluca/external/{record['provider']}/"
        f"{external_id}-{digest.hexdigest()[:16]}.{extension}"
    )
    final_path = safe_local_path(objects_root, storage_path)
    final_path.parent.mkdir(parents=True, exist_ok=True)
    if final_path.exists():
        existing_hash, existing_size = sha256_file(final_path)
        if existing_hash != digest.hexdigest() or existing_size != size:
            raise ValueError(f"Content-addressed local collision: {storage_path}")
        temporary_path.unlink(missing_ok=True)
    else:
        temporary_path.replace(final_path)
    width, height = dimensions(final_path)
    return {
        "url": url,
        "provider": record["provider"],
        "external_id": record.get("external_id"),
        "storage_path": storage_path,
        "local_path": str(final_path.relative_to(objects_root)),
        "sha256": digest.hexdigest(),
        "size": size,
        "mime": mime,
        "width": width,
        "height": height,
        "uses": record.get("uses") or [],
        "downloaded_at": utc_now(),
    }


def upload_and_verify(bunny: BunnyStorage, item: dict, objects_root: Path) -> dict:
    storage_path = item["storage_path"]
    expected_hash = item["sha256"]
    expected_size = item["size"]
    remote_hash, remote_size, existed = bunny.remote_hash(storage_path)
    action = "reused" if existed and remote_hash == expected_hash else "uploaded"
    if action == "uploaded":
        bunny.upload(
            storage_path,
            safe_local_path(objects_root, item["local_path"]),
            item["mime"],
        )
        remote_hash, remote_size, _ = bunny.remote_hash(storage_path)
    verified = remote_hash == expected_hash and remote_size == expected_size
    return {
        **item,
        "status": "verified" if verified else "mismatch",
        "action": action,
        "remote_sha256": remote_hash,
        "remote_size": remote_size,
        "verified_at": utc_now() if verified else None,
    }


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--workdir", type=Path, default=DEFAULT_WORKDIR)
    parser.add_argument("--provider", choices=("pexels",), default="pexels")
    parser.add_argument("--workers", type=int, default=6)
    parser.add_argument("--apply", action="store_true")
    args = parser.parse_args()
    if not 1 <= args.workers <= 12:
        parser.error("--workers must be between 1 and 12")

    load_env(BACKEND_DIR / ".env")
    workdir = args.workdir.resolve()
    inventory_path = workdir / "external-image-inventory.json"
    inventory = read_json(inventory_path, {}) or {}
    records = [
        item for item in inventory.get("images", [])
        if item.get("provider") == args.provider
        and item.get("migration_decision") == "ready_for_verified_copy"
    ]
    dry_run = {
        "generated_at": utc_now(),
        "provider": args.provider,
        "eligible_urls": len(records),
        "unique_source_paths": len({item.get("source_path") for item in records}),
        "all_reachable": all(item.get("probe", {}).get("status") == "reachable" for item in records),
        "apply_requested": args.apply,
    }
    write_json_atomic(workdir / f"{args.provider}-copy-dry-run.json", dry_run)
    print(json.dumps(dry_run, indent=2), flush=True)
    if not records or not dry_run["all_reachable"]:
        print("Dry-run failed; no upload attempted.", flush=True)
        return 1
    if not args.apply:
        print("Dry-run complete. Re-run with --apply to copy and verify.", flush=True)
        return 0

    objects_root = workdir / "objects"
    state_path = workdir / f"{args.provider}-copy-state.json"
    state = read_json(state_path, {}) or {}
    bunny = BunnyStorage()

    pending = [record for record in records if state.get(record["url"], {}).get("status") != "verified"]
    with concurrent.futures.ThreadPoolExecutor(max_workers=args.workers) as pool:
        downloads = {pool.submit(download, record, objects_root): record for record in pending}
        completed = 0
        for future in concurrent.futures.as_completed(downloads):
            record = downloads[future]
            try:
                downloaded = future.result()
                result = upload_and_verify(bunny, downloaded, objects_root)
            except Exception as exc:
                result = {
                    "url": record["url"],
                    "provider": record["provider"],
                    "uses": record.get("uses") or [],
                    "status": "error",
                    "error": f"{type(exc).__name__}: {exc}",
                }
            with STATE_LOCK:
                state[record["url"]] = result
                write_json_atomic(state_path, state)
            completed += 1
            if completed % 25 == 0 or result["status"] != "verified":
                verified = sum(item.get("status") == "verified" for item in state.values())
                errors = sum(item.get("status") == "error" for item in state.values())
                print(f"progress={completed}/{len(pending)} verified={verified} errors={errors}", flush=True)

    verified_items = [item for item in state.values() if item.get("status") == "verified"]
    summary = {
        "completed_at": utc_now(),
        "eligible_urls": len(records),
        "verified_urls": len(verified_items),
        "unique_verified_objects": len({item["storage_path"] for item in verified_items}),
        "verified_bytes": sum(item["size"] for item in verified_items),
        "errors": sum(item.get("status") == "error" for item in state.values()),
        "mismatches": sum(item.get("status") == "mismatch" for item in state.values()),
    }
    write_json_atomic(workdir / f"{args.provider}-copy-summary.json", summary)
    cdn_url = (os.environ.get("BUNNY_CDN_URL") or "").rstrip("/")
    mapping = [
        {
            "from": item["url"],
            "to": f"{cdn_url}/{item['storage_path']}",
            "storage_path": item["storage_path"],
            "sha256": item["sha256"],
            "uses": item.get("uses") or [],
        }
        for item in sorted(verified_items, key=lambda value: value["url"])
    ]
    write_json_atomic(workdir / f"{args.provider}-rewrite-map.json", mapping)
    print(json.dumps(summary, indent=2), flush=True)
    return 0 if summary["verified_urls"] == len(records) else 2


if __name__ == "__main__":
    raise SystemExit(main())
