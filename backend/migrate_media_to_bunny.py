"""Copy the verified Supabase media backup to Bunny Storage byte-for-byte.

The default invocation is a read-only dry-run. ``--apply`` uploads objects and
downloads them again through Bunny Storage's authenticated API to compare the
complete SHA-256. Progress is persisted after every completed object, making
the migration safe to interrupt and resume.
"""

from __future__ import annotations

import argparse
import concurrent.futures
import hashlib
import json
import os
import threading
import time
import urllib.error
import urllib.parse
import urllib.request
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, Iterable, Optional


BACKEND_DIR = Path(__file__).resolve().parent
PROJECT_DIR = BACKEND_DIR.parent
DEFAULT_BACKUP = PROJECT_DIR / ".migration-backups" / "phase1-20260731"
STATE_LOCK = threading.Lock()


def load_env(path: Path) -> None:
    for raw in path.read_text(encoding="utf-8").splitlines():
        line = raw.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        os.environ.setdefault(key.strip(), value.strip().strip('"').strip("'"))


def utc_now() -> str:
    return datetime.now(timezone.utc).isoformat()


def sha256_file(path: Path) -> tuple[str, int]:
    digest = hashlib.sha256()
    size = 0
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
            size += len(chunk)
    return digest.hexdigest(), size


def read_json(path: Path, default: Any = None) -> Any:
    if not path.exists():
        return default
    return json.loads(path.read_text(encoding="utf-8"))


def write_json_atomic(path: Path, value: Any) -> None:
    temporary = path.with_name(path.name + ".tmp")
    temporary.write_text(
        json.dumps(value, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    temporary.replace(path)


def safe_local_path(objects_root: Path, storage_path: str) -> Path:
    destination = (objects_root / storage_path).resolve()
    root = objects_root.resolve()
    if destination != root and root not in destination.parents:
        raise ValueError("Unsafe storage path: " + storage_path)
    return destination


class BunnyStorage:
    def __init__(self) -> None:
        self.endpoint = os.environ["BUNNY_STORAGE_ENDPOINT"].rstrip("/")
        self.zone = os.environ["BUNNY_STORAGE_ZONE"].strip()
        self.key = os.environ["BUNNY_STORAGE_API_KEY"]
        if not self.endpoint or not self.zone or not self.key:
            raise RuntimeError("Incomplete Bunny Storage configuration")

    def url(self, storage_path: str) -> str:
        encoded = "/".join(
            urllib.parse.quote(part, safe="")
            for part in storage_path.strip("/").split("/")
        )
        return f"{self.endpoint}/{urllib.parse.quote(self.zone, safe='')}/{encoded}"

    def request(self, storage_path: str, method: str, data=None, content_type=None):
        headers = {"AccessKey": self.key}
        if content_type:
            headers["Content-Type"] = content_type
        request = urllib.request.Request(
            self.url(storage_path), data=data, headers=headers, method=method
        )
        return urllib.request.urlopen(request, timeout=300)

    def remote_hash(self, storage_path: str) -> tuple[Optional[str], int, bool]:
        digest = hashlib.sha256()
        size = 0
        try:
            with self.request(storage_path, "GET") as response:
                while True:
                    chunk = response.read(1024 * 1024)
                    if not chunk:
                        break
                    digest.update(chunk)
                    size += len(chunk)
            return digest.hexdigest(), size, True
        except urllib.error.HTTPError as exc:
            if exc.code == 404:
                return None, 0, False
            raise

    def upload(self, storage_path: str, local_path: Path, content_type: str) -> None:
        # The largest audited object is below 8 MB, so bounded in-memory
        # uploads avoid urllib's ambiguous handling of file-like request bodies.
        with self.request(
            storage_path,
            "PUT",
            data=local_path.read_bytes(),
            content_type=content_type or "application/octet-stream",
        ) as response:
            response.read()


def validate_local(manifest: list[dict], objects_root: Path) -> dict:
    valid: list[dict] = []
    missing: list[dict] = []
    mismatches: list[dict] = []
    total_bytes = 0
    for item in manifest:
        storage_path = item["storage_path"]
        local_path = safe_local_path(objects_root, storage_path)
        if not local_path.is_file():
            missing.append({"storage_path": storage_path, "reason": "missing"})
            continue
        actual_hash, actual_size = sha256_file(local_path)
        if actual_hash != item.get("sha256") or actual_size != item.get("size"):
            mismatches.append({
                "storage_path": storage_path,
                "expected_sha256": item.get("sha256"),
                "actual_sha256": actual_hash,
                "expected_size": item.get("size"),
                "actual_size": actual_size,
            })
            continue
        valid.append(item)
        total_bytes += actual_size
    return {
        "valid": valid,
        "missing": missing,
        "mismatches": mismatches,
        "total_bytes": total_bytes,
    }


def migrate_one(
    bunny: BunnyStorage,
    item: dict,
    objects_root: Path,
    previous: Optional[dict],
) -> dict:
    storage_path = item["storage_path"]
    expected_hash = item["sha256"]
    expected_size = item["size"]
    if (
        previous
        and previous.get("status") == "verified"
        and previous.get("sha256") == expected_hash
        and previous.get("size") == expected_size
    ):
        return {**previous, "action": "skipped_verified"}

    started = time.monotonic()
    attempts = int((previous or {}).get("attempts") or 0) + 1
    try:
        remote_hash, remote_size, existed = bunny.remote_hash(storage_path)
        action = "reused" if existed and remote_hash == expected_hash else "uploaded"
        if action == "uploaded":
            local_path = safe_local_path(objects_root, storage_path)
            bunny.upload(storage_path, local_path, item.get("mime") or "application/octet-stream")
            remote_hash, remote_size, _ = bunny.remote_hash(storage_path)
        verified = remote_hash == expected_hash and remote_size == expected_size
        return {
            "storage_path": storage_path,
            "status": "verified" if verified else "mismatch",
            "action": action,
            "sha256": remote_hash,
            "expected_sha256": expected_hash,
            "size": remote_size,
            "expected_size": expected_size,
            "attempts": attempts,
            "verified_at": utc_now() if verified else None,
            "elapsed_seconds": round(time.monotonic() - started, 3),
        }
    except Exception as exc:  # Persist the individual failure and keep going.
        return {
            "storage_path": storage_path,
            "status": "error",
            "action": "failed",
            "expected_sha256": expected_hash,
            "expected_size": expected_size,
            "attempts": attempts,
            "error": f"{type(exc).__name__}: {exc}",
            "elapsed_seconds": round(time.monotonic() - started, 3),
        }


def summarize(state: Dict[str, dict], expected: int) -> dict:
    statuses: Dict[str, int] = {}
    actions: Dict[str, int] = {}
    verified_bytes = 0
    for result in state.values():
        status = result.get("status", "unknown")
        action = result.get("action", "unknown")
        statuses[status] = statuses.get(status, 0) + 1
        actions[action] = actions.get(action, 0) + 1
        if status == "verified":
            verified_bytes += int(result.get("size") or 0)
    return {
        "expected_objects": expected,
        "recorded_objects": len(state),
        "remaining_objects": expected - statuses.get("verified", 0),
        "verified_bytes": verified_bytes,
        "statuses": statuses,
        "actions": actions,
    }


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--backup", type=Path, default=DEFAULT_BACKUP)
    parser.add_argument("--apply", action="store_true")
    parser.add_argument("--workers", type=int, default=4)
    args = parser.parse_args()
    if not 1 <= args.workers <= 16:
        parser.error("--workers must be between 1 and 16")

    load_env(BACKEND_DIR / ".env")
    backup = args.backup.resolve()
    manifest = [
        item for item in read_json(backup / "media-manifest.json", [])
        if item.get("in_bucket")
    ]
    objects_root = backup / "objects"
    local = validate_local(manifest, objects_root)
    dry_run = {
        "generated_at": utc_now(),
        "objects": len(manifest),
        "valid_local_objects": len(local["valid"]),
        "total_bytes": local["total_bytes"],
        "missing": local["missing"],
        "hash_or_size_mismatches": local["mismatches"],
        "ready": not local["missing"] and not local["mismatches"],
    }
    write_json_atomic(backup / "bunny-migration-dry-run.json", dry_run)
    print(json.dumps({key: value for key, value in dry_run.items() if key not in {"missing", "hash_or_size_mismatches"}}, indent=2))
    if not dry_run["ready"]:
        print("Dry-run failed; no upload attempted.", file=os.sys.stderr)
        return 1
    if not args.apply:
        print("Dry-run complete. Re-run with --apply to migrate.")
        return 0

    bunny = BunnyStorage()
    state_path = backup / "bunny-migration-state.json"
    state: Dict[str, dict] = read_json(state_path, {}) or {}
    completed = 0
    with concurrent.futures.ThreadPoolExecutor(max_workers=args.workers) as pool:
        futures = {
            pool.submit(
                migrate_one,
                bunny,
                item,
                objects_root,
                state.get(item["storage_path"]),
            ): item["storage_path"]
            for item in local["valid"]
        }
        for future in concurrent.futures.as_completed(futures):
            storage_path = futures[future]
            result = future.result()
            with STATE_LOCK:
                state[storage_path] = result
                write_json_atomic(state_path, state)
            completed += 1
            if completed % 100 == 0 or result.get("status") != "verified":
                summary = summarize(state, len(manifest))
                print(
                    f"progress={completed}/{len(manifest)} "
                    f"verified={summary['statuses'].get('verified', 0)} "
                    f"errors={summary['statuses'].get('error', 0)} "
                    f"mismatches={summary['statuses'].get('mismatch', 0)}",
                    flush=True,
                )

    summary = summarize(state, len(manifest))
    summary["completed_at"] = utc_now()
    write_json_atomic(backup / "bunny-migration-summary.json", summary)
    print(json.dumps(summary, indent=2))
    return 0 if summary["remaining_objects"] == 0 else 2


if __name__ == "__main__":
    raise SystemExit(main())
