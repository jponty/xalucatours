"""Export the image state stored in Supabase for the static React frontend.

The Supabase service key stays in ``backend/.env``. The
generated manifest contains only public image URLs and CMS metadata, so it is
safe to serve from ``frontend/public``.
"""

from __future__ import annotations

import asyncio
import json
import os
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import quote

from dotenv import load_dotenv
from supabase_db import SupabaseDatabase


BACKEND_DIR = Path(__file__).resolve().parent
PROJECT_DIR = BACKEND_DIR.parent
OUTPUT_PATH = PROJECT_DIR / "frontend" / "public" / "supabase-images.json"

load_dotenv(BACKEND_DIR / ".env")


def public_image_url(value: str | None) -> str | None:
    """Convert a legacy /api/files path into its public Supabase URL."""
    if not value or not isinstance(value, str):
        return value
    marker = "/api/files/"
    if marker not in value:
        return value
    storage_path = value.split(marker, 1)[1].split("?", 1)[0]
    project_url = os.environ["SUPABASE_URL"].rstrip("/")
    bucket = quote(os.environ.get("SUPABASE_STORAGE_BUCKET", "xaluca"), safe="")
    encoded_path = "/".join(quote(part, safe="") for part in storage_path.split("/"))
    return f"{project_url}/storage/v1/object/public/{bucket}/{encoded_path}"


def storage_path_from_url(value: str | None) -> str | None:
    if not value or not isinstance(value, str) or "/api/files/" not in value:
        return None
    return value.split("/api/files/", 1)[1].split("?", 1)[0]


def decode_jsonb(value):
    return json.loads(value) if isinstance(value, str) else value


def parse_datetime(value):
    if not value:
        return None
    try:
        parsed = datetime.fromisoformat(str(value).replace("Z", "+00:00"))
        return parsed if parsed.tzinfo else parsed.replace(tzinfo=timezone.utc)
    except ValueError:
        return None


def public_contest(data):
    if not data or not data.get("active"):
        return None
    now = datetime.now(timezone.utc)
    starts_at = parse_datetime(data.get("starts_at"))
    ends_at = parse_datetime(data.get("ends_at"))
    prizes = [prize for prize in (data.get("prizes") or []) if prize.get("enabled")]
    awarded = sum(int(prize.get("awarded") or 0) for prize in prizes)
    cap = int(data.get("max_prizes_total") or 0)
    is_open = not (
        (starts_at and starts_at > now)
        or (ends_at and ends_at < now)
        or (cap and awarded >= cap)
    )
    return {
        "id": data.get("id"),
        "slug": data.get("slug"),
        "name": data.get("name"),
        "open": is_open,
        "one_entry_per_email": bool(data.get("one_entry_per_email", True)),
        "prizes": [
            {
                "id": prize.get("id"),
                "label": prize.get("label"),
                "short": prize.get("short") or prize.get("label"),
                "color": prize.get("color"),
                "is_grand": bool(prize.get("is_grand")),
            }
            for prize in prizes
        ],
    }


async def export_images() -> None:
    database = SupabaseDatabase()
    try:
        slot_docs = await database.image_slots.find({}).sort("_id", 1).to_list(10000)
        gallery_docs = await database.day_galleries.find({}).sort("_id", 1).to_list(20000)
        file_docs = await database.files.find({}).to_list(10000)
        contest_docs = await database.contests.find({}).sort("updated_at", -1).to_list(1000)
    finally:
        await database.close()

    slot_rows = [{"id": doc.get("_id"), "data": doc} for doc in slot_docs]
    gallery_rows = [{"id": doc.get("_id"), "data": doc} for doc in gallery_docs]
    file_rows = [{"id": doc.get("_id") or doc.get("id"), "data": doc} for doc in file_docs]
    contest_rows = [{"id": doc.get("_id") or doc.get("id"), "data": doc} for doc in contest_docs]

    usage_terms: dict[str, set[str]] = {}
    slots = []
    for row in slot_rows:
        data = decode_jsonb(row["data"]) or {}
        storage_path = data.get("storage_path") or storage_path_from_url(data.get("url"))
        if storage_path:
            usage_terms.setdefault(storage_path, set()).update(
                value for value in (row["id"], data.get("alt")) if value
            )
        slots.append(
            {
                "slot_id": row["id"],
                "url": public_image_url(data.get("url")),
                "alt": data.get("alt"),
                "alt_i18n": data.get("alt_i18n"),
                "cleared": bool(data.get("cleared")),
                "updated_at": data.get("updated_at"),
            }
        )

    galleries = []
    for row in gallery_rows:
        data = decode_jsonb(row["data"]) or {}
        for image in data.get("images") or []:
            if not isinstance(image, dict):
                continue
            storage_path = storage_path_from_url(image.get("url"))
            if storage_path:
                usage_terms.setdefault(storage_path, set()).update(
                    value for value in (row["id"], image.get("alt")) if value
                )
        images = [
            {
                **image,
                "url": public_image_url(image.get("url")),
            }
            for image in (data.get("images") or [])
            if isinstance(image, dict)
        ]
        galleries.append(
            {
                "key": row["id"],
                "images": images,
                "updated_at": data.get("updated_at"),
            }
        )

    library = []
    for row in file_rows:
        data = decode_jsonb(row["data"]) or {}
        storage_path = data.get("storage_path")
        if not storage_path or data.get("is_deleted"):
            continue
        library.append(
            {
                "id": data.get("id") or row["id"],
                "url": public_image_url(f"/api/files/{storage_path}"),
                "storage_path": storage_path,
                "original_filename": data.get("original_filename"),
                "content_type": data.get("content_type"),
                "size": data.get("size"),
                "slot_id": data.get("slot_id"),
                "tags": data.get("tags") or [],
                "created_at": data.get("created_at"),
                "pexels": data.get("pexels"),
                "unsplash": data.get("unsplash"),
                "search_text": " ".join(sorted(usage_terms.get(storage_path, set()))),
            }
        )
    library.sort(key=lambda item: item.get("created_at") or "", reverse=True)
    contest = next(
        (
            public_contest(decode_jsonb(row["data"]) or {})
            for row in contest_rows
            if (decode_jsonb(row["data"]) or {}).get("active")
        ),
        None,
    )

    manifest = {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "source": "supabase",
        "project_url": os.environ["SUPABASE_URL"].rstrip("/"),
        "bucket": os.environ.get("SUPABASE_STORAGE_BUCKET", "xaluca"),
        "slots": slots,
        "galleries": galleries,
        "library": library,
        "contest": contest,
    }

    temporary_path = OUTPUT_PATH.with_suffix(".json.tmp")
    temporary_path.write_text(
        json.dumps(manifest, ensure_ascii=False, separators=(",", ":")),
        encoding="utf-8",
    )
    temporary_path.replace(OUTPUT_PATH)
    print(
        f"Exported {len(slots)} image slots, {len(galleries)} galleries and "
        f"{len(library)} library images "
        f"to {OUTPUT_PATH}"
    )


if __name__ == "__main__":
    asyncio.run(export_images())
