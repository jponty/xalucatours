"""Create a read-only Supabase media backup and migration inventory.

The command exports every public ``mirror_*`` table, inventories every object
in the configured Supabase Storage bucket, downloads an optional byte-for-byte
backup, and records media usage in CMS slots/galleries and source code.

The output belongs under ``.migration-backups/`` (ignored by Git) because the
database exports can contain personal data.
"""

from __future__ import annotations

import argparse
import concurrent.futures
import hashlib
import json
import mimetypes
import os
import re
import shutil
import struct
import sys
import threading
import urllib.error
import urllib.parse
import urllib.request
import zipfile
from collections import defaultdict, deque
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, Iterable, Iterator, List, Optional, Set, Tuple


BACKEND_DIR = Path(__file__).resolve().parent
PROJECT_DIR = BACKEND_DIR.parent
DEFAULT_DUMP = Path.home() / "Desktop" / "trip-curator-8-test_database_dump_20260730_210450.zip"
MEDIA_EXTENSIONS = {
    ".avif", ".gif", ".jpeg", ".jpg", ".m4a", ".mov", ".mp3", ".mp4",
    ".ogg", ".png", ".svg", ".webm", ".webp", ".wav",
}
CODE_EXTENSIONS = {
    ".css", ".html", ".js", ".json", ".jsx", ".md", ".py", ".scss",
    ".ts", ".tsx", ".yaml", ".yml",
}
URL_RE = re.compile(r"https?://[^\s\"'`<>)}\]]+")
API_FILE_RE = re.compile(r"/api/files/([^?\"'`<>)}\]]+)")
LOCK = threading.Lock()


def load_env(path: Path) -> None:
    for raw in path.read_text(encoding="utf-8").splitlines():
        line = raw.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        os.environ.setdefault(key.strip(), value.strip().strip('"').strip("'"))


def utc_now() -> str:
    return datetime.now(timezone.utc).isoformat()


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


class SupabaseReader:
    def __init__(self) -> None:
        self.url = os.environ["SUPABASE_URL"].rstrip("/")
        self.key = os.environ["SUPABASE_SERVICE_ROLE_KEY"]
        self.bucket = os.environ.get("SUPABASE_STORAGE_BUCKET", "xaluca")

    def request_json(
        self,
        url: str,
        method: str = "GET",
        payload: Optional[dict] = None,
        headers: Optional[dict] = None,
        timeout: int = 120,
    ) -> Tuple[Any, Any]:
        request_headers = {
            "apikey": self.key,
            "Authorization": "Bearer " + self.key,
        }
        request_headers.update(headers or {})
        data = None
        if payload is not None:
            data = json.dumps(payload).encode("utf-8")
            request_headers["Content-Type"] = "application/json"
        request = urllib.request.Request(
            url, data=data, headers=request_headers, method=method
        )
        with urllib.request.urlopen(request, timeout=timeout) as response:
            body = response.read()
            return (json.loads(body) if body else None), response.headers

    def table_names(self) -> List[str]:
        data, _ = self.request_json(
            self.url + "/rest/v1/",
            headers={"Accept": "application/openapi+json"},
        )
        return sorted(
            name for name in data.get("definitions", {}) if name.startswith("mirror_")
        )

    def export_table(self, table: str, page_size: int = 1000) -> List[dict]:
        rows: List[dict] = []
        offset = 0
        while True:
            page, _ = self.request_json(
                "%s/rest/v1/%s?select=*" % (self.url, urllib.parse.quote(table)),
                headers={
                    "Range": "%d-%d" % (offset, offset + page_size - 1),
                    "Prefer": "count=exact",
                },
            )
            page = page or []
            rows.extend(page)
            if len(page) < page_size:
                break
            offset += page_size
        return rows

    def list_bucket_objects(self) -> List[dict]:
        objects: List[dict] = []
        queue: deque[str] = deque([""])
        seen_dirs: Set[str] = set()
        endpoint = "%s/storage/v1/object/list/%s" % (
            self.url,
            urllib.parse.quote(self.bucket, safe=""),
        )
        while queue:
            prefix = queue.popleft().strip("/")
            if prefix in seen_dirs:
                continue
            seen_dirs.add(prefix)
            offset = 0
            while True:
                page, _ = self.request_json(
                    endpoint,
                    method="POST",
                    payload={
                        "prefix": prefix,
                        "limit": 1000,
                        "offset": offset,
                        "sortBy": {"column": "name", "order": "asc"},
                    },
                )
                page = page or []
                for entry in page:
                    name = entry.get("name")
                    if not name:
                        continue
                    full_path = "/".join(part for part in (prefix, name) if part)
                    if entry.get("id") is None and not entry.get("metadata"):
                        queue.append(full_path)
                    else:
                        objects.append({**entry, "storage_path": full_path})
                if len(page) < 1000:
                    break
                offset += 1000
        objects.sort(key=lambda item: item["storage_path"])
        return objects

    def public_url(self, storage_path: str) -> str:
        encoded = "/".join(
            urllib.parse.quote(part, safe="") for part in storage_path.split("/")
        )
        return "%s/storage/v1/object/public/%s/%s" % (
            self.url,
            urllib.parse.quote(self.bucket, safe=""),
            encoded,
        )

    def download(self, storage_path: str, destination: Path) -> Tuple[str, int, str]:
        encoded = "/".join(
            urllib.parse.quote(part, safe="") for part in storage_path.split("/")
        )
        url = "%s/storage/v1/object/authenticated/%s/%s" % (
            self.url,
            urllib.parse.quote(self.bucket, safe=""),
            encoded,
        )
        request = urllib.request.Request(
            url,
            headers={
                "apikey": self.key,
                "Authorization": "Bearer " + self.key,
            },
        )
        destination.parent.mkdir(parents=True, exist_ok=True)
        temporary = destination.with_name(destination.name + ".part")
        digest = hashlib.sha256()
        size = 0
        with urllib.request.urlopen(request, timeout=300) as response, temporary.open("wb") as out:
            content_type = response.headers.get_content_type() or "application/octet-stream"
            while True:
                chunk = response.read(1024 * 1024)
                if not chunk:
                    break
                out.write(chunk)
                digest.update(chunk)
                size += len(chunk)
        temporary.replace(destination)
        return digest.hexdigest(), size, content_type


def document(row: dict) -> dict:
    value = row.get("data", row)
    if isinstance(value, str):
        try:
            value = json.loads(value)
        except json.JSONDecodeError:
            return row
    return value if isinstance(value, dict) else row


def walk(value: Any, path: str = "") -> Iterator[Tuple[str, Any]]:
    if isinstance(value, dict):
        for key, child in value.items():
            child_path = "%s.%s" % (path, key) if path else str(key)
            yield from walk(child, child_path)
    elif isinstance(value, list):
        for index, child in enumerate(value):
            yield from walk(child, "%s[%d]" % (path, index))
    else:
        yield path, value


def storage_path_from_value(value: str, reader: SupabaseReader) -> Optional[str]:
    if not isinstance(value, str):
        return None
    if value.startswith("xaluca/") and not value.startswith("xaluca://"):
        return urllib.parse.unquote(value.split("?", 1)[0])
    match = API_FILE_RE.search(value)
    if match:
        return urllib.parse.unquote(match.group(1).split("?", 1)[0])
    markers = [
        "/storage/v1/object/public/%s/" % reader.bucket,
        "/storage/v1/object/authenticated/%s/" % reader.bucket,
    ]
    for marker in markers:
        if marker in value:
            return urllib.parse.unquote(value.split(marker, 1)[1].split("?", 1)[0])
    return None


def provider(url: str) -> str:
    host = urllib.parse.urlparse(url).netloc.lower()
    if "unsplash.com" in host:
        return "unsplash"
    if "pexels.com" in host:
        return "pexels"
    if "mux.com" in host:
        return "mux"
    if "youtube.com" in host or "youtu.be" in host or "ytimg.com" in host:
        return "youtube"
    if "supabase" in host:
        return "supabase"
    if "emergent" in host:
        return "emergent"
    return host or "relative"


def dimensions(path: Path) -> Tuple[Optional[int], Optional[int]]:
    try:
        with path.open("rb") as handle:
            head = handle.read(32)
            if head.startswith(b"\x89PNG\r\n\x1a\n"):
                return struct.unpack(">II", head[16:24])
            if head[:6] in (b"GIF87a", b"GIF89a"):
                return struct.unpack("<HH", head[6:10])
            if head.startswith(b"RIFF") and head[8:12] == b"WEBP":
                kind = head[12:16]
                if kind == b"VP8X":
                    return (
                        1 + int.from_bytes(head[24:27], "little"),
                        1 + int.from_bytes(head[27:30], "little"),
                    )
                if kind == b"VP8L":
                    bits = int.from_bytes(head[21:25], "little")
                    return (bits & 0x3FFF) + 1, ((bits >> 14) & 0x3FFF) + 1
                if kind == b"VP8 " and head[23:26] == b"\x9d\x01\x2a":
                    width, height = struct.unpack("<HH", head[26:30])
                    return width & 0x3FFF, height & 0x3FFF
            if head.startswith(b"\xff\xd8"):
                handle.seek(2)
                while True:
                    marker_start = handle.read(1)
                    if not marker_start:
                        break
                    if marker_start != b"\xff":
                        continue
                    marker = handle.read(1)
                    while marker == b"\xff":
                        marker = handle.read(1)
                    if not marker or marker in (b"\xd8", b"\xd9"):
                        continue
                    length_raw = handle.read(2)
                    if len(length_raw) != 2:
                        break
                    length = struct.unpack(">H", length_raw)[0]
                    if marker[0] in {0xC0, 0xC1, 0xC2, 0xC3, 0xC5, 0xC6, 0xC7, 0xC9, 0xCA, 0xCB, 0xCD, 0xCE, 0xCF}:
                        payload = handle.read(5)
                        if len(payload) == 5:
                            height, width = struct.unpack(">HH", payload[1:5])
                            return width, height
                        break
                    handle.seek(max(0, length - 2), 1)
    except (OSError, struct.error):
        pass
    return None, None


def sniff_mime(path: Path, fallback: Optional[str] = None) -> str:
    try:
        with path.open("rb") as handle:
            head = handle.read(32)
    except OSError:
        return fallback or "application/octet-stream"
    if head.startswith(b"\xff\xd8"):
        return "image/jpeg"
    if head.startswith(b"\x89PNG\r\n\x1a\n"):
        return "image/png"
    if head[:6] in (b"GIF87a", b"GIF89a"):
        return "image/gif"
    if head.startswith(b"RIFF") and head[8:12] == b"WEBP":
        return "image/webp"
    if len(head) >= 12 and head[4:8] == b"ftyp" and b"avif" in head[8:24]:
        return "image/avif"
    if head.startswith(b"ID3") or head[:2] in {b"\xff\xfb", b"\xff\xf3", b"\xff\xf2"}:
        return "audio/mpeg"
    return fallback or mimetypes.guess_type(path.name)[0] or "application/octet-stream"


def safe_destination(root: Path, storage_path: str) -> Path:
    destination = (root / storage_path).resolve()
    root_resolved = root.resolve()
    if root_resolved not in destination.parents:
        raise ValueError("Unsafe storage path: " + storage_path)
    return destination


def download_public(url: str, destination: Path) -> dict:
    request = urllib.request.Request(url, headers={"User-Agent": "Xaluca-Media-Audit/1.0"})
    destination.parent.mkdir(parents=True, exist_ok=True)
    temporary = destination.with_name(destination.name + ".part")
    digest = hashlib.sha256()
    size = 0
    with urllib.request.urlopen(request, timeout=300) as response, temporary.open("wb") as out:
        content_type = response.headers.get_content_type() or "application/octet-stream"
        while True:
            chunk = response.read(1024 * 1024)
            if not chunk:
                break
            out.write(chunk)
            digest.update(chunk)
            size += len(chunk)
    temporary.replace(destination)
    width, height = dimensions(destination)
    return {
        "url": url,
        "backup_path": str(destination),
        "sha256": digest.hexdigest(),
        "size": size,
        "mime": sniff_mime(destination, content_type),
        "width": width,
        "height": height,
        "status": "downloaded",
    }


def controlled_external_urls() -> List[Tuple[str, str, str]]:
    records: List[Tuple[str, str, str]] = []
    hero_source = (PROJECT_DIR / "frontend" / "src" / "components" / "HeroSlider.jsx").read_text(encoding="utf-8")
    for url in URL_RE.findall(hero_source):
        if "image.mux.com" in url:
            records.append(("mux-poster", url.rstrip(";,"), "mux/hero-video-poster.jpg"))

    intro_source = (PROJECT_DIR / "frontend" / "src" / "components" / "MoroccoIntroVideo.jsx").read_text(encoding="utf-8")
    intro_match = re.search(r'const VIDEO_ID = "([A-Za-z0-9_-]+)"', intro_source)
    if intro_match:
        video_id = intro_match.group(1)
        records.extend([
            ("youtube-thumbnail", "https://i.ytimg.com/vi/%s/maxresdefault.jpg" % video_id, "youtube/%s-maxres.jpg" % video_id),
            ("youtube-thumbnail-fallback", "https://i.ytimg.com/vi/%s/hqdefault.jpg" % video_id, "youtube/%s-hq.jpg" % video_id),
        ])

    gallery_source = (PROJECT_DIR / "frontend" / "src" / "components" / "MoroccoVideos.jsx").read_text(encoding="utf-8")
    for video_id in re.findall(r'^\s+id: "([A-Za-z0-9_-]+)"', gallery_source, re.MULTILINE):
        records.append((
            "youtube-thumbnail",
            "https://img.youtube.com/vi/%s/hqdefault.jpg" % video_id,
            "youtube/%s-hq.jpg" % video_id,
        ))
    return records


def scan_code_references() -> List[dict]:
    records: List[dict] = []
    roots = [PROJECT_DIR / "frontend" / "src", PROJECT_DIR / "backend"]
    for root in roots:
        for path in sorted(root.rglob("*")):
            if not path.is_file() or path.suffix.lower() not in CODE_EXTENSIONS:
                continue
            if any(part in {"node_modules", "img_cache", "__pycache__"} for part in path.parts):
                continue
            try:
                text = path.read_text(encoding="utf-8")
            except UnicodeDecodeError:
                continue
            for line_number, line in enumerate(text.splitlines(), 1):
                for match in URL_RE.finditer(line):
                    url = match.group(0).rstrip(".,;:")
                    records.append({
                        "url": url,
                        "provider": provider(url),
                        "file": str(path.relative_to(PROJECT_DIR)),
                        "line": line_number,
                    })
    return records


def scan_local_assets() -> List[dict]:
    records: List[dict] = []
    roots = [PROJECT_DIR / "frontend" / "public", PROJECT_DIR / "frontend" / "src" / "assets"]
    for root in roots:
        if not root.exists():
            continue
        for path in sorted(root.rglob("*")):
            if not path.is_file() or path.suffix.lower() not in MEDIA_EXTENSIONS:
                continue
            width, height = dimensions(path)
            records.append({
                "path": str(path.relative_to(PROJECT_DIR)),
                "sha256": sha256_file(path),
                "mime": sniff_mime(path),
                "size": path.stat().st_size,
                "width": width,
                "height": height,
            })
    return records


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", type=Path)
    parser.add_argument("--download-objects", action="store_true")
    parser.add_argument("--workers", type=int, default=8)
    parser.add_argument("--mongo-dump", type=Path, default=DEFAULT_DUMP)
    parser.add_argument(
        "--legacy-base-url",
        default="https://xaluca-tours-api.onrender.com",
    )
    args = parser.parse_args()

    load_env(BACKEND_DIR / ".env")
    reader = SupabaseReader()
    stamp = datetime.now().strftime("%Y%m%d-%H%M%S")
    output = (args.output or PROJECT_DIR / ".migration-backups" / ("phase1-" + stamp)).resolve()
    tables_dir = output / "supabase-tables"
    tables_dir.mkdir(parents=True, exist_ok=True)
    print("Output:", output, flush=True)

    tables: Dict[str, List[dict]] = {}
    for table in reader.table_names():
        rows = reader.export_table(table)
        tables[table] = rows
        (tables_dir / (table + ".json")).write_text(
            json.dumps(rows, ensure_ascii=False, separators=(",", ":")),
            encoding="utf-8",
        )
        print("Exported %-36s %d" % (table, len(rows)), flush=True)

    dump_record = None
    legacy_files_by_path: Dict[str, dict] = {}
    if args.mongo_dump.exists():
        dump_dir = output / "source-dump"
        dump_dir.mkdir(parents=True, exist_ok=True)
        copied_dump = dump_dir / args.mongo_dump.name
        shutil.copy2(args.mongo_dump, copied_dump)
        dump_record = {
            "path": str(copied_dump.relative_to(output)),
            "size": copied_dump.stat().st_size,
            "sha256": sha256_file(copied_dump),
        }
        try:
            with zipfile.ZipFile(copied_dump) as archive:
                legacy_files = json.loads(archive.read("files.json"))
            legacy_files_by_path = {
                item["storage_path"]: item
                for item in legacy_files
                if item.get("storage_path") and not item.get("is_deleted")
            }
        except (KeyError, ValueError, zipfile.BadZipFile):
            legacy_files_by_path = {}
        print("Preserved MongoDB dump", copied_dump.name, flush=True)

    usages: Dict[str, List[dict]] = defaultdict(list)
    external_db: List[dict] = []
    unresolved_relative: List[dict] = []
    files_by_path: Dict[str, dict] = {}

    for table, rows in tables.items():
        for row in rows:
            doc = document(row)
            record_id = str(doc.get("_id") or doc.get("id") or row.get("id") or "")
            if table == "mirror_files":
                storage_path = doc.get("storage_path")
                if storage_path and not doc.get("is_deleted"):
                    files_by_path[storage_path] = doc
            for field, value in walk(doc):
                if not isinstance(value, str):
                    continue
                storage_path = storage_path_from_value(value, reader)
                if storage_path:
                    usages[storage_path].append({
                        "table": table,
                        "record_id": record_id,
                        "field": field,
                    })
                if value.startswith("http://") or value.startswith("https://"):
                    external_db.append({
                        "url": value,
                        "provider": provider(value),
                        "table": table,
                        "record_id": record_id,
                        "field": field,
                    })
                elif value.startswith("/api/uploads/") or value.startswith("/uploads/"):
                    unresolved_relative.append({
                        "value": value,
                        "table": table,
                        "record_id": record_id,
                        "field": field,
                    })

    bucket_objects = reader.list_bucket_objects()
    bucket_paths = {item["storage_path"] for item in bucket_objects}
    candidate_paths = sorted(bucket_paths | set(files_by_path) | set(usages))
    print("Bucket objects:", len(bucket_paths), flush=True)

    manifest_by_path: Dict[str, dict] = {}
    for storage_path in candidate_paths:
        file_doc = files_by_path.get(storage_path, {})
        legacy_doc = legacy_files_by_path.get(storage_path, {})
        meta = next(
            (item for item in bucket_objects if item["storage_path"] == storage_path),
            {},
        )
        source = file_doc.get("source") or (
            "pexels" if file_doc.get("pexels") else "unsplash" if file_doc.get("unsplash") else "manual"
        )
        manifest_by_path[storage_path] = {
            "storage_path": storage_path,
            "current_url": reader.public_url(storage_path),
            "sha256": file_doc.get("sha256"),
            "previous_dump_sha256": legacy_doc.get("sha256"),
            "mime": file_doc.get("content_type") or (meta.get("metadata") or {}).get("mimetype"),
            "size": file_doc.get("size") or (meta.get("metadata") or {}).get("size"),
            "width": None,
            "height": None,
            "source": source,
            "source_metadata": {
                "pexels": file_doc.get("pexels"),
                "unsplash": file_doc.get("unsplash"),
                "migrated_from": file_doc.get("migrated_from"),
                "original_filename": file_doc.get("original_filename"),
            },
            "library_record_id": file_doc.get("id") or file_doc.get("_id"),
            "in_library": storage_path in files_by_path,
            "in_bucket": storage_path in bucket_paths,
            "usages": usages.get(storage_path, []),
            "backup_status": "not_requested",
            "hash_matches_library": None,
            "hash_matches_previous_dump": None,
        }

    if args.download_objects:
        objects_root = output / "objects"
        total = len(bucket_paths)
        completed = 0

        def backup_one(storage_path: str) -> Tuple[str, dict]:
            destination = safe_destination(objects_root, storage_path)
            expected = manifest_by_path[storage_path].get("sha256")
            if destination.exists():
                actual_hash = sha256_file(destination)
                actual_size = destination.stat().st_size
                mime = sniff_mime(destination, manifest_by_path[storage_path].get("mime"))
                status = "reused"
            else:
                actual_hash, actual_size, mime = reader.download(storage_path, destination)
                status = "downloaded"
            mime = sniff_mime(destination, mime)
            width, height = dimensions(destination)
            previous_hash = manifest_by_path[storage_path].get("previous_dump_sha256")
            return storage_path, {
                "sha256": actual_hash,
                "size": actual_size,
                "mime": mime,
                "width": width,
                "height": height,
                "backup_status": status,
                "hash_matches_library": None if not expected else actual_hash.lower() == str(expected).lower(),
                "hash_matches_previous_dump": (
                    None
                    if not previous_hash
                    else actual_hash.lower() == str(previous_hash).lower()
                ),
                "backup_path": str(destination.relative_to(output)),
            }

        errors: List[dict] = []
        with concurrent.futures.ThreadPoolExecutor(max_workers=max(1, args.workers)) as executor:
            futures = {executor.submit(backup_one, path): path for path in sorted(bucket_paths)}
            for future in concurrent.futures.as_completed(futures):
                path = futures[future]
                try:
                    storage_path, result = future.result()
                    manifest_by_path[storage_path].update(result)
                except Exception as exc:  # preserve audit progress and report every failure
                    manifest_by_path[path]["backup_status"] = "error"
                    manifest_by_path[path]["backup_error"] = repr(exc)
                    errors.append({"storage_path": path, "error": repr(exc)})
                completed += 1
                if completed % 100 == 0 or completed == total:
                    print("Backed up %d/%d objects" % (completed, total), flush=True)
        (output / "download-errors.json").write_text(
            json.dumps(errors, ensure_ascii=False, indent=2), encoding="utf-8"
        )

    legacy_upload_manifest: List[dict] = []
    legacy_by_value: Dict[str, List[dict]] = defaultdict(list)
    for item in unresolved_relative:
        legacy_by_value[item["value"]].append(item)
    for value, value_usages in sorted(legacy_by_value.items()):
        url = args.legacy_base_url.rstrip("/") + "/" + value.lstrip("/")
        destination = output / "legacy-uploads" / Path(value).name
        try:
            if destination.exists():
                width, height = dimensions(destination)
                result = {
                    "url": url,
                    "backup_path": str(destination),
                    "sha256": sha256_file(destination),
                    "size": destination.stat().st_size,
                    "mime": sniff_mime(destination),
                    "width": width,
                    "height": height,
                    "status": "reused",
                }
            elif args.download_objects:
                result = download_public(url, destination)
            else:
                result = {"url": url, "status": "not_requested"}
            result["backup_path"] = (
                str(destination.relative_to(output)) if destination.exists() else None
            )
            result["legacy_path"] = value
            result["usages"] = value_usages
            legacy_upload_manifest.append(result)
        except Exception as exc:
            legacy_upload_manifest.append({
                "legacy_path": value,
                "url": url,
                "status": "error",
                "error": repr(exc),
                "usages": value_usages,
            })

    controlled_external_manifest: List[dict] = []
    for kind, url, relative_path in controlled_external_urls():
        destination = output / "controlled-external" / relative_path
        try:
            if destination.exists():
                width, height = dimensions(destination)
                result = {
                    "url": url,
                    "backup_path": str(destination),
                    "sha256": sha256_file(destination),
                    "size": destination.stat().st_size,
                    "mime": sniff_mime(destination),
                    "width": width,
                    "height": height,
                    "status": "reused",
                }
            elif args.download_objects:
                result = download_public(url, destination)
            else:
                result = {"url": url, "status": "not_requested"}
            result["backup_path"] = (
                str(destination.relative_to(output)) if destination.exists() else None
            )
            result["kind"] = kind
            controlled_external_manifest.append(result)
        except Exception as exc:
            controlled_external_manifest.append({
                "kind": kind,
                "url": url,
                "status": "error",
                "error": repr(exc),
            })

    code_references = scan_code_references()
    direct_code_media = [
        item
        for item in code_references
        if re.search(
            r"images\.(?:unsplash|pexels)\.com|image\.mux\.com|stream\.mux\.com|"
            r"img\.youtube\.com|youtube(?:-nocookie)?\.com/embed|"
            r"customer-assets\.emergentagent\.com|storage/v1/object",
            item["url"],
            re.IGNORECASE,
        )
    ]
    local_assets = scan_local_assets()
    manifest = list(manifest_by_path.values())
    manifest.sort(key=lambda item: item["storage_path"])
    (output / "media-manifest.json").write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    (output / "external-references-database.json").write_text(
        json.dumps(external_db, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    (output / "external-references-code.json").write_text(
        json.dumps(code_references, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    (output / "direct-media-code.json").write_text(
        json.dumps(direct_code_media, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    (output / "unresolved-relative-media.json").write_text(
        json.dumps(unresolved_relative, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    (output / "legacy-upload-manifest.json").write_text(
        json.dumps(legacy_upload_manifest, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    (output / "controlled-external-media.json").write_text(
        json.dumps(controlled_external_manifest, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    (output / "local-assets.json").write_text(
        json.dumps(local_assets, ensure_ascii=False, indent=2), encoding="utf-8"
    )

    active_unsplash_occurrences = [
        item
        for item in external_db
        if item["provider"] == "unsplash"
        and item["table"] in {"mirror_image_slots", "mirror_day_galleries"}
    ]
    active_unsplash = {item["url"] for item in active_unsplash_occurrences}
    used_without_library = sorted(set(usages) - set(files_by_path))
    missing_from_bucket = sorted((set(files_by_path) | set(usages)) - bucket_paths)
    test_only_missing = sorted(
        path
        for path in missing_from_bucket
        if usages.get(path)
        and all(
            str(usage.get("record_id", "")).startswith("test-usage.")
            for usage in usages[path]
        )
    )
    stale_metadata_missing = sorted(
        path
        for path in missing_from_bucket
        if usages.get(path)
        and all(usage.get("field") == "storage_path" for usage in usages[path])
        and path not in test_only_missing
    )
    required_missing = sorted(
        set(missing_from_bucket) - set(test_only_missing) - set(stale_metadata_missing)
    )
    hash_mismatches = sorted(
        item["storage_path"]
        for item in manifest
        if item.get("hash_matches_library") is False
    )
    backup_errors = sorted(
        item["storage_path"] for item in manifest if item.get("backup_status") == "error"
    )
    legacy_upload_errors = [
        item["legacy_path"]
        for item in legacy_upload_manifest
        if item.get("status") == "error"
    ]
    controlled_external_errors = [
        item["url"]
        for item in controlled_external_manifest
        if item.get("status") == "error"
    ]
    summary = {
        "generated_at": utc_now(),
        "supabase_project_url": reader.url,
        "bucket": reader.bucket,
        "table_counts": {name: len(rows) for name, rows in tables.items()},
        "active_library_records": len(files_by_path),
        "bucket_objects": len(bucket_paths),
        "manifest_entries": len(manifest),
        "used_storage_paths": len(usages),
        "used_without_library_count": len(used_without_library),
        "used_without_library": used_without_library,
        "active_unsplash_reference_count": len(active_unsplash),
        "active_unsplash_occurrence_count": len(active_unsplash_occurrences),
        "active_unsplash_references": sorted(active_unsplash),
        "database_external_reference_count": len(external_db),
        "code_external_reference_count": len(code_references),
        "direct_code_media_occurrence_count": len(direct_code_media),
        "direct_code_media_unique_count": len({item["url"] for item in direct_code_media}),
        "local_asset_count": len(local_assets),
        "unresolved_relative_media_count": len(unresolved_relative),
        "legacy_upload_backup_count": len(legacy_upload_manifest),
        "legacy_upload_backup_errors": legacy_upload_errors,
        "controlled_external_media_count": len(controlled_external_manifest),
        "controlled_external_media_errors": controlled_external_errors,
        "missing_from_bucket_count": len(missing_from_bucket),
        "missing_from_bucket": missing_from_bucket,
        "test_only_missing_count": len(test_only_missing),
        "test_only_missing": test_only_missing,
        "stale_metadata_missing_count": len(stale_metadata_missing),
        "stale_metadata_missing": stale_metadata_missing,
        "required_missing_count": len(required_missing),
        "required_missing": required_missing,
        "hash_mismatch_count": len(hash_mismatches),
        "hash_mismatches": hash_mismatches,
        "backup_error_count": len(backup_errors),
        "backup_errors": backup_errors,
        "mongo_dump": dump_record,
        "bucket_backup_complete": not backup_errors
        and all(
            item.get("backup_status") in {"downloaded", "reused"}
            for item in manifest
            if item["in_bucket"]
        ),
        "complete": not required_missing
        and not hash_mismatches
        and not backup_errors
        and not legacy_upload_errors
        and not controlled_external_errors,
    }
    (output / "summary.json").write_text(
        json.dumps(summary, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    print(json.dumps(summary, ensure_ascii=False, indent=2), flush=True)
    print("Audit complete:", output, flush=True)
    return 0 if summary["complete"] else 2


if __name__ == "__main__":
    sys.exit(main())
