from fastapi import FastAPI, APIRouter, HTTPException, UploadFile, File, Response
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import asyncio
import httpx
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr, field_validator
from typing import List, Optional, Dict
import uuid
from datetime import datetime, timezone, timedelta

from storage import init_storage, put_object, get_object


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI(title="Xaluca Tours API")
api_router = APIRouter(prefix="/api")


# ---------- Models ----------
class ContactRequest(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    full_name: str
    email: EmailStr
    phone: Optional[str] = None
    travel_dates: Optional[str] = None
    party_size: Optional[str] = None
    journey_interest: Optional[str] = None
    message: str
    language: Optional[str] = "en"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class ContactRequestCreate(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=120)
    email: EmailStr
    phone: Optional[str] = Field(default=None, max_length=40)
    travel_dates: Optional[str] = Field(default=None, max_length=120)
    party_size: Optional[str] = Field(default=None, max_length=40)
    journey_interest: Optional[str] = Field(default=None, max_length=120)
    message: str = Field(..., min_length=4, max_length=4000)
    language: Optional[str] = "en"


# ---------- Trip Planner ----------
class TripPlannerRequest(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    # contact
    full_name: str
    email: EmailStr
    phone: Optional[str] = None
    # itinerary
    date_mode: str = "range"            # "range" | "exact" | "flexible"
    start_date: Optional[str] = None    # ISO yyyy-mm-dd
    end_date: Optional[str] = None
    flexible_month: Optional[str] = None
    travellers_adults: int = 2
    travellers_children: int = 0
    accommodation: str = "superior"     # "basic" | "superior" | "premium"
    activities: List[str] = Field(default_factory=list)
    notes: Optional[str] = None
    language: Optional[str] = "es"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class TripPlannerCreate(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=120)
    email: EmailStr
    phone: Optional[str] = Field(default=None, max_length=40)
    date_mode: str = Field(default="range", pattern="^(range|exact|flexible)$")
    start_date: Optional[str] = Field(default=None, max_length=20)
    end_date: Optional[str] = Field(default=None, max_length=20)
    flexible_month: Optional[str] = Field(default=None, max_length=40)
    travellers_adults: int = Field(default=2, ge=1, le=40)
    travellers_children: int = Field(default=0, ge=0, le=20)
    accommodation: str = Field(default="superior", pattern="^(basic|superior|premium)$")
    activities: List[str] = Field(default_factory=list, max_length=20)
    notes: Optional[str] = Field(default=None, max_length=4000)
    language: Optional[str] = "es"


# ---------- Routes ----------
@api_router.get("/")
async def root():
    return {"service": "Xaluca Tours", "status": "ok"}


@api_router.post("/contact-requests", response_model=ContactRequest)
async def create_contact_request(payload: ContactRequestCreate):
    obj = ContactRequest(**payload.model_dump())
    doc = obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.contact_requests.insert_one(doc)
    return obj


@api_router.get("/contact-requests", response_model=List[ContactRequest])
async def list_contact_requests():
    rows = await db.contact_requests.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)
    for r in rows:
        if isinstance(r.get('created_at'), str):
            try:
                r['created_at'] = datetime.fromisoformat(r['created_at'])
            except ValueError:
                pass
    return rows


@api_router.post("/trip-planner", response_model=TripPlannerRequest)
async def create_trip_planner(payload: TripPlannerCreate):
    # Sanitize activity list (strip + cap length per item)
    activities = [a.strip()[:60] for a in (payload.activities or []) if a and a.strip()]
    obj = TripPlannerRequest(**{**payload.model_dump(), "activities": activities})
    doc = obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.trip_planner_requests.insert_one(doc)
    return obj


@api_router.get("/trip-planner", response_model=List[TripPlannerRequest])
async def list_trip_planner():
    rows = await db.trip_planner_requests.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)
    for r in rows:
        if isinstance(r.get('created_at'), str):
            try:
                r['created_at'] = datetime.fromisoformat(r['created_at'])
            except ValueError:
                pass
    return rows


# ---------- Climate proxy (Open-Meteo) ----------
# Lightweight in-process TTL cache; data only changes meaningfully day to day.
_climate_cache = {"data": None, "ts": None}
_CLIMATE_CACHE_TTL = timedelta(hours=6)

CLIMATE_ZONES = [
    {"id": "atlas",  "lat": 31.358,  "lng": -5.987},   # Boumalne Dades
    {"id": "sahara", "lat": 31.0995, "lng": -4.0128},  # Merzouga / Erg Chebbi
]


@api_router.get("/climate/current-month")
async def climate_current_month():
    """Return average max/min temperatures for the **current calendar month**
    based on last year's archived data from Open-Meteo (very stable + truly
    representative of what the traveller will find). Cached for 6 hours."""
    now = datetime.now(timezone.utc)
    if _climate_cache["data"] and _climate_cache["ts"] and (now - _climate_cache["ts"]) < _CLIMATE_CACHE_TTL:
        return _climate_cache["data"]

    # Build same-month-range from last year. End at last day of that month.
    year_last = now.year - 1
    month = now.month
    start = datetime(year_last, month, 1, tzinfo=timezone.utc)
    # First day of next month minus 1 day
    if month == 12:
        end = datetime(year_last, 12, 31, tzinfo=timezone.utc)
    else:
        end = datetime(year_last, month + 1, 1, tzinfo=timezone.utc) - timedelta(days=1)
    start_s = start.strftime("%Y-%m-%d")
    end_s = end.strftime("%Y-%m-%d")

    async def fetch_zone(client: httpx.AsyncClient, zone):
        url = (
            "https://archive-api.open-meteo.com/v1/archive"
            f"?latitude={zone['lat']}&longitude={zone['lng']}"
            f"&start_date={start_s}&end_date={end_s}"
            "&daily=temperature_2m_max,temperature_2m_min&timezone=auto"
        )
        r = await client.get(url, timeout=10.0)
        r.raise_for_status()
        d = r.json().get("daily") or {}
        maxs = [v for v in (d.get("temperature_2m_max") or []) if v is not None]
        mins = [v for v in (d.get("temperature_2m_min") or []) if v is not None]
        if not maxs or not mins:
            return None
        return {
            "id": zone["id"],
            "day": round(sum(maxs) / len(maxs)),
            "night": round(sum(mins) / len(mins)),
            "samples": len(maxs),
        }

    try:
        async with httpx.AsyncClient() as client:
            results = await asyncio.gather(*[fetch_zone(client, z) for z in CLIMATE_ZONES])
        if any(r is None for r in results):
            raise HTTPException(status_code=502, detail="incomplete-upstream-data")
        payload = {
            "source": "open-meteo-archive",
            "fetched_at": now.isoformat(),
            "reference_month": start.strftime("%Y-%m"),
            "zones": {r["id"]: {"day": r["day"], "night": r["night"], "samples": r["samples"]} for r in results},
        }
        _climate_cache["data"] = payload
        _climate_cache["ts"] = now
        return payload
    except httpx.HTTPError as exc:
        raise HTTPException(status_code=502, detail=f"upstream-error: {exc}")


# ---------- Image slots (admin inline editing) ----------
# Stored in collection `image_slots` as a single document per slot id
# (e.g. "home.hero.0") with { url, alt, source, updated_at }.
ALLOWED_MIME = {"image/jpeg", "image/png", "image/webp", "image/avif"}
MAX_UPLOAD_BYTES = 8 * 1024 * 1024  # 8 MB


class SlotPayload(BaseModel):
    # url is optional so the same endpoint can update metadata-only
    # (alt_i18n / caption_i18n) without touching the image itself,
    # and can also persist a "cleared" state (url=None + cleared=True).
    url: Optional[str] = Field(default=None, max_length=2000)
    alt: Optional[str] = Field(default=None, max_length=300)
    alt_i18n: Optional[Dict[str, str]] = None
    caption_i18n: Optional[Dict[str, str]] = None
    cleared: Optional[bool] = None
    source: Optional[str] = Field(default=None, max_length=40)


@api_router.get("/slots/{slot_id}")
async def get_slot(slot_id: str):
    doc = await db.image_slots.find_one({"_id": slot_id}, {"_id": 0})
    if not doc:
        return {"slot_id": slot_id, "url": None, "exists": False}
    return {"slot_id": slot_id, "exists": True, **doc}


@api_router.get("/slots")
async def list_image_slots():
    """List every image slot ever set — used by the /admin dashboard."""
    cursor = db.image_slots.find({}, {"updated_at": 0})
    items = []
    async for d in cursor:
        items.append({
            "slot_id": d.pop("_id"),
            "url":     d.get("url"),
            "alt":     d.get("alt"),
            "source":  d.get("source", "external"),
        })
    return {"slots": items}


@api_router.put("/slots/{slot_id}")
async def put_slot(slot_id: str, payload: SlotPayload):
    # Selective update: only fields explicitly provided are written, so
    # editing alt_i18n doesn't blow away the url, and vice versa.
    update: Dict = {"updated_at": datetime.now(timezone.utc).isoformat()}
    payload_dict = payload.model_dump(exclude_unset=True)
    for key in ("url", "alt", "alt_i18n", "caption_i18n", "cleared", "source"):
        if key in payload_dict:
            update[key] = payload_dict[key]
    # If a fresh image URL is being set, the slot is no longer "cleared".
    if "url" in update and update.get("url"):
        update["cleared"] = False
    await db.image_slots.update_one(
        {"_id": slot_id},
        {"$set": update},
        upsert=True,
    )
    doc = await db.image_slots.find_one({"_id": slot_id}, {"_id": 0})
    return {"slot_id": slot_id, "exists": True, **(doc or {})}


@api_router.delete("/slots/{slot_id}")
async def clear_slot(slot_id: str):
    """Mark a slot as explicitly cleared (url=None, cleared=True) so the
    frontend renders the empty placeholder instead of the original fallback.
    The document is preserved so any persisted metadata (alt_i18n, caption_i18n)
    survives a future re-upload."""
    update = {
        "url": None,
        "cleared": True,
        "updated_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.image_slots.update_one(
        {"_id": slot_id},
        {"$set": update},
        upsert=True,
    )
    return {"slot_id": slot_id, "url": None, "cleared": True}


@api_router.post("/slots/{slot_id}/upload")
async def upload_slot_image(slot_id: str, file: UploadFile = File(...)):
    if file.content_type not in ALLOWED_MIME:
        raise HTTPException(
            status_code=415,
            detail=f"Unsupported file type: {file.content_type}. Use JPG, PNG, WEBP or AVIF.",
        )
    data = await file.read()
    if len(data) > MAX_UPLOAD_BYTES:
        raise HTTPException(status_code=413, detail="File exceeds 8 MB limit.")

    ext = {
        "image/jpeg": "jpg",
        "image/png": "png",
        "image/webp": "webp",
        "image/avif": "avif",
    }[file.content_type]
    safe_slot = "".join(c for c in slot_id if c.isalnum() or c in "._-")[:60] or "slot"
    storage_path = f"xaluca/slots/{safe_slot}/{uuid.uuid4().hex}.{ext}"

    try:
        result = put_object(storage_path, data, file.content_type)
    except Exception as exc:
        logger.exception("Emergent storage upload failed")
        raise HTTPException(status_code=502, detail=f"storage-upload-failed: {exc}")

    canonical_path = result.get("path", storage_path)
    public_url = f"/api/files/{canonical_path}"

    doc = {
        "url": public_url,
        "alt": None,
        "source": "emergent-objstore",
        "storage_path": canonical_path,
        "original_filename": file.filename,
        "content_type": file.content_type,
        "size": result.get("size", len(data)),
        "updated_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.image_slots.update_one(
        {"_id": slot_id},
        {"$set": doc},
        upsert=True,
    )
    # Bookkeeping collection for global listing / soft-delete in the future.
    await db.files.insert_one({
        "id": str(uuid.uuid4()),
        "slot_id": slot_id,
        "storage_path": canonical_path,
        "original_filename": file.filename,
        "content_type": file.content_type,
        "size": doc["size"],
        "is_deleted": False,
        "created_at": doc["updated_at"],
    })
    return {"slot_id": slot_id, **doc}


@api_router.post("/library/upload")
async def upload_library_images(files: List[UploadFile] = File(...)):
    """Bulk-upload images directly into the CMS library.
    The files are NOT bound to any slot — editors browse them later
    from the library picker and reuse them across pages."""
    if not files:
        raise HTTPException(status_code=400, detail="No files provided.")
    if len(files) > 30:
        raise HTTPException(status_code=400, detail="Máximo 30 archivos por lote.")

    ext_map = {
        "image/jpeg": "jpg", "image/png": "png",
        "image/webp": "webp", "image/avif": "avif",
    }
    uploaded: List[Dict] = []
    skipped: List[Dict] = []
    now_iso = datetime.now(timezone.utc).isoformat()

    for f in files:
        if f.content_type not in ALLOWED_MIME:
            skipped.append({"filename": f.filename, "reason": f"unsupported-type:{f.content_type}"})
            continue
        data = await f.read()
        if len(data) > MAX_UPLOAD_BYTES:
            skipped.append({"filename": f.filename, "reason": "too-large"})
            continue
        ext = ext_map[f.content_type]
        storage_path = f"xaluca/library/{uuid.uuid4().hex}.{ext}"
        try:
            result = put_object(storage_path, data, f.content_type)
        except Exception as exc:
            logger.exception("Bulk upload — storage put failed for %s", f.filename)
            skipped.append({"filename": f.filename, "reason": f"storage-error:{exc}"})
            continue
        canonical_path = result.get("path", storage_path)
        record = {
            "id": str(uuid.uuid4()),
            "slot_id": None,
            "storage_path": canonical_path,
            "original_filename": f.filename,
            "content_type": f.content_type,
            "size": result.get("size", len(data)),
            "is_deleted": False,
            "tags": ["library"],
            "created_at": now_iso,
        }
        await db.files.insert_one(record)
        uploaded.append({
            "id": record["id"],
            "url": f"/api/files/{canonical_path}",
            "storage_path": canonical_path,
            "original_filename": f.filename,
            "content_type": f.content_type,
            "size": record["size"],
        })

    return {"uploaded": uploaded, "skipped": skipped, "count": len(uploaded)}


class FileUpdate(BaseModel):
    original_filename: Optional[str] = Field(default=None, max_length=200)
    tags: Optional[List[str]] = Field(default=None, max_length=20)


@api_router.patch("/files/{file_id}")
async def update_file_metadata(file_id: str, payload: FileUpdate):
    """Rename + retag a library file. Only mutable fields are accepted."""
    update: Dict = {}
    if payload.original_filename is not None:
        name = payload.original_filename.strip()[:200]
        if not name:
            raise HTTPException(status_code=400, detail="Filename cannot be empty.")
        update["original_filename"] = name
    if payload.tags is not None:
        # Lowercase, trim, dedupe, cap each tag.
        norm = []
        seen = set()
        for t in payload.tags:
            if not isinstance(t, str):
                continue
            tt = t.strip().lower()[:30]
            if tt and tt not in seen:
                seen.add(tt)
                norm.append(tt)
        update["tags"] = norm
    if not update:
        raise HTTPException(status_code=400, detail="No editable fields provided.")
    update["updated_at"] = datetime.now(timezone.utc).isoformat()

    res = await db.files.update_one({"id": file_id, "is_deleted": {"$ne": True}}, {"$set": update})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="File not found.")
    doc = await db.files.find_one({"id": file_id}, {"_id": 0})
    return doc


@api_router.delete("/files/{file_id}")
async def delete_file(file_id: str):
    """Soft-delete a library file. The bytes stay in Emergent storage
    (no delete API) but the record is hidden from listings."""
    res = await db.files.update_one(
        {"id": file_id},
        {"$set": {"is_deleted": True, "deleted_at": datetime.now(timezone.utc).isoformat()}},
    )
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="File not found.")
    return {"id": file_id, "deleted": True}


@api_router.post("/files/{file_id}/replace")
async def replace_file_bytes(file_id: str, file: UploadFile = File(...)):
    """Upload new bytes for an existing library record. The previous
    storage path stays untouched (storage has no delete API) and the
    record is updated to point at the new object."""
    if file.content_type not in ALLOWED_MIME:
        raise HTTPException(
            status_code=415,
            detail=f"Unsupported file type: {file.content_type}.",
        )
    data = await file.read()
    if len(data) > MAX_UPLOAD_BYTES:
        raise HTTPException(status_code=413, detail="File exceeds 8 MB limit.")

    record = await db.files.find_one({"id": file_id, "is_deleted": {"$ne": True}})
    if not record:
        raise HTTPException(status_code=404, detail="File not found.")

    ext_map = {"image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/avif": "avif"}
    ext = ext_map[file.content_type]
    storage_path = f"xaluca/library/{uuid.uuid4().hex}.{ext}"
    result: Dict = {}
    try:
        result = put_object(storage_path, data, file.content_type)
    except Exception as exc:
        logger.exception("Replace — storage put failed")
        raise HTTPException(status_code=502, detail=f"storage-upload-failed: {exc}")

    canonical_path = result.get("path", storage_path)
    now_iso = datetime.now(timezone.utc).isoformat()
    await db.files.update_one(
        {"id": file_id},
        {"$set": {
            "storage_path": canonical_path,
            "content_type": file.content_type,
            "size": result.get("size", len(data)),
            "original_filename": file.filename or record.get("original_filename"),
            "updated_at": now_iso,
        }},
    )
    return {
        "id": file_id,
        "url": f"/api/files/{canonical_path}",
        "storage_path": canonical_path,
        "original_filename": file.filename or record.get("original_filename"),
        "content_type": file.content_type,
        "size": result.get("size", len(data)),
    }


@api_router.get("/library/tags")
async def list_library_tags():
    """Distinct tag list — used by the picker for filter chips."""
    pipeline = [
        {"$match": {"is_deleted": {"$ne": True}}},
        {"$unwind": "$tags"},
        {"$group": {"_id": "$tags", "count": {"$sum": 1}}},
        {"$sort": {"count": -1, "_id": 1}},
        {"$limit": 60},
    ]
    rows = await db.files.aggregate(pipeline).to_list(60)
    return {"tags": [{"name": r["_id"], "count": r["count"]} for r in rows if r.get("_id")]}


# ----------------------------------------------------------
#  Pexels integration
#  ----
#  Search + import stock photography from Pexels into the local
#  library. The API key lives ONLY here (read from .env via
#  os.environ) — the browser never sees it. Three endpoints:
#    GET  /api/pexels/search?query=...&page=1&per_page=24
#    GET  /api/pexels/curated?page=1&per_page=24
#    POST /api/pexels/import {"pexels_id": 123}
#  The import endpoint downloads the original, stores it in the
#  same object storage as user uploads, and writes a `db.files`
#  record tagged ["library","pexels"] with a nested `pexels`
#  attribution object (photographer name + urls + pexels id).
# ----------------------------------------------------------
PEXELS_API_KEY = os.environ.get("PEXELS_API_KEY", "").strip()
PEXELS_BASE = "https://api.pexels.com/v1"


async def _pexels_get(path: str, params: Dict | None = None) -> Dict:
    if not PEXELS_API_KEY:
        raise HTTPException(status_code=503, detail="Pexels API key not configured.")
    headers = {"Authorization": PEXELS_API_KEY}
    async with httpx.AsyncClient(timeout=httpx.Timeout(15.0, connect=5.0)) as cx:
        try:
            r = await cx.get(f"{PEXELS_BASE}{path}", headers=headers, params=params)
        except httpx.HTTPError as exc:
            raise HTTPException(status_code=502, detail=f"Pexels request failed: {exc}")
    if r.status_code == 429:
        raise HTTPException(status_code=429, detail="Pexels rate limit exceeded — try again later.")
    if r.status_code >= 400:
        raise HTTPException(status_code=502, detail=f"Pexels error {r.status_code}: {r.text[:200]}")
    return r.json()


def _photo_summary(p: Dict) -> Dict:
    src = p.get("src") or {}
    return {
        "id": p.get("id"),
        "width": p.get("width", 0),
        "height": p.get("height", 0),
        "thumb_url":  src.get("medium") or src.get("small") or src.get("tiny"),
        "preview_url": src.get("large") or src.get("medium"),
        "photographer": p.get("photographer", ""),
        "photographer_url": p.get("photographer_url", ""),
        "pexels_url": p.get("url", ""),
        "avg_color": p.get("avg_color"),
        "alt": p.get("alt", ""),
    }


@api_router.get("/pexels/search")
async def pexels_search(query: str, page: int = 1, per_page: int = 24, locale: Optional[str] = None):
    """Proxy search → Pexels v1/search. Returns a CMS-shaped response."""
    if not query.strip():
        raise HTTPException(status_code=400, detail="Empty query.")
    per_page = max(1, min(per_page, 80))   # Pexels max is 80
    page = max(1, page)
    params: Dict = {"query": query.strip(), "page": page, "per_page": per_page}
    if locale:
        params["locale"] = locale
    raw = await _pexels_get("/search", params)
    photos = [_photo_summary(p) for p in raw.get("photos") or []]
    return {
        "page": raw.get("page", page),
        "per_page": raw.get("per_page", per_page),
        "total_results": raw.get("total_results", len(photos)),
        "next_page": bool(raw.get("next_page")),
        "photos": photos,
    }


@api_router.get("/pexels/curated")
async def pexels_curated(page: int = 1, per_page: int = 24):
    """Curated feed — used as the default state of the Pexels tab
    before the editor types a query."""
    per_page = max(1, min(per_page, 80))
    page = max(1, page)
    raw = await _pexels_get("/curated", {"page": page, "per_page": per_page})
    photos = [_photo_summary(p) for p in raw.get("photos") or []]
    return {
        "page": raw.get("page", page),
        "per_page": raw.get("per_page", per_page),
        "total_results": len(photos),
        "next_page": bool(raw.get("next_page")),
        "photos": photos,
    }


class PexelsImportRequest(BaseModel):
    pexels_id: int = Field(..., gt=0)



@api_router.post("/pexels/import")
async def pexels_import(payload: PexelsImportRequest):
    """Download the Pexels original, store it in our object storage,
    insert a `db.files` library record with full attribution, and
    return the same shape the bulk-upload endpoint returns so the
    frontend can treat it like any other library asset."""
    # 1. Get authoritative photo metadata
    photo = await _pexels_get(f"/photos/{payload.pexels_id}")
    src = photo.get("src") or {}
    original_url = src.get("original")
    if not original_url:
        raise HTTPException(status_code=502, detail="Pexels photo has no `original` URL.")

    # 2. Download the original file
    async with httpx.AsyncClient(timeout=httpx.Timeout(60.0, connect=10.0), follow_redirects=True) as cx:
        try:
            dl = await cx.get(original_url)
        except httpx.HTTPError as exc:
            raise HTTPException(status_code=502, detail=f"Image download failed: {exc}")
    if dl.status_code != 200:
        raise HTTPException(status_code=502, detail=f"Image download status {dl.status_code}")
    data = dl.content
    if len(data) > MAX_UPLOAD_BYTES * 3:   # Pexels originals can be big — be lenient
        raise HTTPException(status_code=413, detail="Original image exceeds size cap.")

    # Pexels originals are JPEGs. We still sniff the content-type header.
    content_type = (dl.headers.get("content-type") or "image/jpeg").split(";")[0].strip()
    ext_map = {"image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/avif": "avif"}
    ext = ext_map.get(content_type, "jpg")

    # 3. Upload to object storage (same path convention as bulk-upload)
    storage_path = f"xaluca/library/pexels_{photo.get('id')}_{uuid.uuid4().hex[:8]}.{ext}"
    try:
        result = put_object(storage_path, data, content_type)
    except Exception as exc:
        logger.exception("Pexels import — storage put failed")
        raise HTTPException(status_code=502, detail=f"storage-upload-failed: {exc}")
    canonical_path = result.get("path", storage_path)

    # 4. Persist file record with Pexels attribution
    now_iso = datetime.now(timezone.utc).isoformat()
    attribution = {
        "pexels_id": photo.get("id"),
        "photographer": photo.get("photographer", ""),
        "photographer_url": photo.get("photographer_url", ""),
        "pexels_url": photo.get("url", ""),
        "alt": photo.get("alt", ""),
    }
    record = {
        "id": str(uuid.uuid4()),
        "slot_id": None,
        "storage_path": canonical_path,
        "original_filename": f"Pexels · {attribution['photographer'] or photo.get('id')}.{ext}",
        "content_type": content_type,
        "size": result.get("size", len(data)),
        "is_deleted": False,
        "tags": ["library", "pexels"],
        "source": "pexels",
        "pexels": attribution,
        "created_at": now_iso,
    }
    await db.files.insert_one(record)

    return {
        "id": record["id"],
        "url": f"/api/files/{canonical_path}",
        "storage_path": canonical_path,
        "original_filename": record["original_filename"],
        "content_type": content_type,
        "size": record["size"],
        "source": "pexels",
        "pexels": attribution,
    }


# ----------------------------------------------------------
#  Unsplash integration
#  ----
#  Mirrors the Pexels integration. Three endpoints:
#    GET  /api/unsplash/search?query=...&page=1&per_page=24
#    GET  /api/unsplash/featured?page=1&per_page=24
#    POST /api/unsplash/import {"unsplash_id": "abc123"}
#
#  Unsplash API guidelines REQUIRE us to ping `links.download_location`
#  whenever a photo is "downloaded for use". We do this from the backend
#  immediately before persisting the asset (and after the actual file
#  fetch, since we don't want to count failed imports).
#
#  Attribution is appended with UTM params per Unsplash branding guide:
#  `?utm_source=<APP>&utm_medium=referral`.
# ----------------------------------------------------------
UNSPLASH_ACCESS_KEY = os.environ.get("UNSPLASH_ACCESS_KEY", "").strip()
UNSPLASH_APP_NAME   = os.environ.get("UNSPLASH_APP_NAME", "xaluca_tours").strip()
UNSPLASH_BASE       = "https://api.unsplash.com"
UNSPLASH_UTM        = f"?utm_source={UNSPLASH_APP_NAME}&utm_medium=referral"


async def _unsplash_get(path: str, params: Dict | None = None) -> Dict | List:
    if not UNSPLASH_ACCESS_KEY:
        raise HTTPException(status_code=503, detail="Unsplash access key not configured.")
    headers = {
        "Authorization": f"Client-ID {UNSPLASH_ACCESS_KEY}",
        "Accept-Version": "v1",
    }
    async with httpx.AsyncClient(timeout=httpx.Timeout(15.0, connect=5.0)) as cx:
        try:
            r = await cx.get(f"{UNSPLASH_BASE}{path}", headers=headers, params=params)
        except httpx.HTTPError as exc:
            raise HTTPException(status_code=502, detail=f"Unsplash request failed: {exc}")
    if r.status_code == 403:
        # Unsplash returns 403 when the hourly rate limit is hit
        raise HTTPException(status_code=429, detail="Unsplash rate limit exceeded — try again later.")
    if r.status_code >= 400:
        raise HTTPException(status_code=502, detail=f"Unsplash error {r.status_code}: {r.text[:200]}")
    return r.json()


def _unsplash_summary(p: Dict) -> Dict:
    urls  = p.get("urls")  or {}
    user  = p.get("user")  or {}
    links = (user.get("links") or {})
    return {
        "id": p.get("id"),
        "width":  p.get("width", 0),
        "height": p.get("height", 0),
        "thumb_url":   urls.get("small"),
        "preview_url": urls.get("regular"),
        "photographer":     user.get("name") or user.get("username") or "Unsplash",
        "photographer_url": (links.get("html") or "https://unsplash.com") + UNSPLASH_UTM,
        "unsplash_url": (p.get("links") or {}).get("html", "") + UNSPLASH_UTM,
        "avg_color":  p.get("color"),
        "alt":        p.get("alt_description") or p.get("description") or "",
    }


@api_router.get("/unsplash/search")
async def unsplash_search(query: str, page: int = 1, per_page: int = 24):
    """Proxy search → Unsplash /search/photos."""
    if not query.strip():
        raise HTTPException(status_code=400, detail="Empty query.")
    per_page = max(1, min(per_page, 30))   # Unsplash max is 30
    page = max(1, page)
    raw = await _unsplash_get("/search/photos", {"query": query.strip(), "page": page, "per_page": per_page})
    results = (raw.get("results") or []) if isinstance(raw, dict) else []
    total_pages = raw.get("total_pages", 1) if isinstance(raw, dict) else 1
    return {
        "page": page,
        "per_page": per_page,
        "total_results": (raw.get("total", len(results)) if isinstance(raw, dict) else len(results)),
        "next_page": page < total_pages,
        "photos": [_unsplash_summary(p) for p in results],
    }


@api_router.get("/unsplash/featured")
async def unsplash_featured(page: int = 1, per_page: int = 24):
    """Recent/featured editorial feed — default state of the Unsplash tab."""
    per_page = max(1, min(per_page, 30))
    page = max(1, page)
    raw = await _unsplash_get("/photos", {"page": page, "per_page": per_page, "order_by": "popular"})
    items = raw if isinstance(raw, list) else []
    return {
        "page": page,
        "per_page": per_page,
        "total_results": len(items),
        "next_page": len(items) >= per_page,   # Unsplash /photos doesn't expose total
        "photos": [_unsplash_summary(p) for p in items],
    }


class UnsplashImportRequest(BaseModel):
    unsplash_id: str = Field(..., min_length=1, max_length=64)


@api_router.post("/unsplash/import")
async def unsplash_import(payload: UnsplashImportRequest):
    """Download the Unsplash photo, store it locally, and write a
    library record with full attribution. Triggers Unsplash's
    `download_location` endpoint as required by the API guidelines."""
    # 1. Get the photo (authoritative metadata + download_location link)
    photo = await _unsplash_get(f"/photos/{payload.unsplash_id}")
    urls  = photo.get("urls") or {}
    links = photo.get("links") or {}
    raw_url = urls.get("raw") or urls.get("full") or urls.get("regular")
    if not raw_url:
        raise HTTPException(status_code=502, detail="Unsplash photo has no usable URL.")

    # Cap delivered dimension to keep storage sane (Unsplash raw can be 6000px+).
    fetch_url = f"{raw_url}&w=2400&q=85&fm=jpg&auto=compress" if "?" in raw_url else f"{raw_url}?w=2400&q=85&fm=jpg&auto=compress"

    # 2. Download the resized JPEG
    async with httpx.AsyncClient(timeout=httpx.Timeout(60.0, connect=10.0), follow_redirects=True) as cx:
        try:
            dl = await cx.get(fetch_url)
        except httpx.HTTPError as exc:
            raise HTTPException(status_code=502, detail=f"Image download failed: {exc}")
    if dl.status_code != 200:
        raise HTTPException(status_code=502, detail=f"Image download status {dl.status_code}")
    data = dl.content
    if len(data) > MAX_UPLOAD_BYTES * 3:
        raise HTTPException(status_code=413, detail="Image exceeds size cap.")
    content_type = (dl.headers.get("content-type") or "image/jpeg").split(";")[0].strip()

    # 3. Trigger the Unsplash download_location ping (mandatory per API ToS).
    #    Fire-and-forget: log on failure but never block the import.
    dl_loc = links.get("download_location")
    if dl_loc:
        try:
            await _unsplash_get(dl_loc.replace(UNSPLASH_BASE, ""))
        except Exception as exc:
            logger.warning("Unsplash download_location ping failed: %s", exc)

    # 4. Upload to object storage
    storage_path = f"xaluca/library/unsplash_{photo.get('id')}_{uuid.uuid4().hex[:8]}.jpg"
    try:
        result = put_object(storage_path, data, content_type)
    except Exception as exc:
        logger.exception("Unsplash import — storage put failed")
        raise HTTPException(status_code=502, detail=f"storage-upload-failed: {exc}")
    canonical_path = result.get("path", storage_path)

    # 5. Persist library record with attribution
    user = photo.get("user") or {}
    user_links = user.get("links") or {}
    attribution = {
        "unsplash_id": photo.get("id"),
        "photographer":     user.get("name") or user.get("username") or "Unsplash",
        "photographer_url": (user_links.get("html") or "https://unsplash.com") + UNSPLASH_UTM,
        "unsplash_url":     (links.get("html") or "") + UNSPLASH_UTM,
        "alt": photo.get("alt_description") or photo.get("description") or "",
    }
    now_iso = datetime.now(timezone.utc).isoformat()
    record = {
        "id": str(uuid.uuid4()),
        "slot_id": None,
        "storage_path": canonical_path,
        "original_filename": f"Unsplash · {attribution['photographer']}.jpg",
        "content_type": content_type,
        "size": result.get("size", len(data)),
        "is_deleted": False,
        "tags": ["library", "unsplash"],
        "source": "unsplash",
        "unsplash": attribution,
        "created_at": now_iso,
    }
    await db.files.insert_one(record)

    return {
        "id": record["id"],
        "url": f"/api/files/{canonical_path}",
        "storage_path": canonical_path,
        "original_filename": record["original_filename"],
        "content_type": content_type,
        "size": record["size"],
        "source": "unsplash",
        "unsplash": attribution,
    }


@api_router.get("/files/{file_id}/usage")
async def file_usage(file_id: str):
    """Returns every slot whose stored image URL points at this file.
    Used by the library picker to show 'Usada en N páginas' before
    delete/replace, so editors don't break live pages by accident."""
    record = await db.files.find_one({"id": file_id}, {"_id": 0})
    if not record:
        raise HTTPException(status_code=404, detail="File not found.")
    storage_path = record.get("storage_path")
    if not storage_path:
        return {"file_id": file_id, "count": 0, "slots": []}

    # Match either by explicit storage_path field (uploads from /slots/{id}/upload)
    # or by URL containing the storage path (library reuse via PUT /slots/{id}).
    cursor = db.image_slots.find(
        {"$or": [
            {"storage_path": storage_path},
            {"url": {"$regex": f"/{storage_path}$"}},
        ]},
        {"_id": 1, "url": 1, "updated_at": 1, "source": 1},
    )
    docs = await cursor.to_list(500)
    slots = [
        {
            "slot_id": d["_id"],
            "url": d.get("url"),
            "source": d.get("source"),
            "updated_at": d.get("updated_at"),
        }
        for d in docs
    ]
    return {"file_id": file_id, "count": len(slots), "slots": slots}


@api_router.get("/files")
async def list_files(limit: int = 60, skip: int = 0, q: Optional[str] = None, tag: Optional[str] = None):
    """Lists every previously-uploaded image (most recent first) for the
    CMS image-library picker. Soft-deleted files are excluded. Supports
    a simple case-insensitive substring search on the original filename
    or slot id via `q`."""
    limit = max(1, min(int(limit or 60), 200))
    skip = max(0, int(skip or 0))

    query: Dict = {"is_deleted": {"$ne": True}}
    if q:
        safe = q.strip()[:80]
        # Escape regex special chars to avoid injection / parser errors.
        import re
        safe_re = re.escape(safe)
        query["$or"] = [
            {"original_filename": {"$regex": safe_re, "$options": "i"}},
            {"slot_id": {"$regex": safe_re, "$options": "i"}},
            {"tags": {"$regex": safe_re, "$options": "i"}},
        ]
    if tag:
        query["tags"] = tag.strip().lower()[:30]

    cursor = (
        db.files
        .find(query, {"_id": 0})
        .sort("created_at", -1)
        .skip(skip)
        .limit(limit + 1)  # one extra to detect "has more"
    )
    items_raw = await cursor.to_list(limit + 1)
    has_more = len(items_raw) > limit
    items_raw = items_raw[:limit]

    items = [
        {
            "id": it.get("id"),
            "url": f"/api/files/{it['storage_path']}",
            "storage_path": it["storage_path"],
            "original_filename": it.get("original_filename"),
            "content_type": it.get("content_type"),
            "size": it.get("size"),
            "slot_id": it.get("slot_id"),
            "tags": it.get("tags") or [],
            "created_at": it.get("created_at"),
        }
        for it in items_raw
        if it.get("storage_path")
    ]

    total = await db.files.count_documents(query)
    return {"items": items, "total": total, "has_more": has_more, "limit": limit, "skip": skip}


@api_router.get("/files/{path:path}")
async def download_file(path: str):
    """Public proxy that streams an object from Emergent storage.
    Used by <img src="/api/files/..."> tags in the CMS — no auth needed
    because CMS images are part of the public site content."""
    data: bytes = b""
    content_type: str = "application/octet-stream"
    try:
        data, content_type = get_object(path)
    except Exception as exc:
        logger.warning("Emergent storage fetch failed for %s: %s", path, exc)
        raise HTTPException(status_code=404, detail="File not found")
    return Response(
        content=data,
        media_type=content_type,
        headers={"Cache-Control": "public, max-age=86400"},
    )


# ---------- Text slots (admin inline editing) ----------
# Stored in collection `text_slots` as a single document per slot id
# (e.g. "home.hero.title") with { values: {es, en, fr}, updated_at }.
# Values is a language map; missing languages fall back to the placeholder
# default rendered client-side.
class TextSlotPayload(BaseModel):
    values: Dict[str, Optional[str]] = Field(
        default_factory=dict,
        description="Language code → text (e.g. {'es': '...', 'en': '...', 'fr': '...'})",
    )

    @field_validator("values")
    @classmethod
    def _trim_and_limit(cls, v: Dict[str, Optional[str]]):
        out: Dict[str, Optional[str]] = {}
        for lang, txt in (v or {}).items():
            if not isinstance(lang, str) or len(lang) > 5:
                raise ValueError(f"Invalid language code: {lang}")
            if txt is None:
                out[lang] = None
                continue
            if not isinstance(txt, str):
                raise ValueError("Text value must be a string")
            # Cap to a safe length per language — long enough for paragraphs
            t = txt.replace("\r\n", "\n").replace("\r", "\n")
            if len(t) > 5000:
                raise ValueError("Text exceeds 5000 characters")
            out[lang] = t
        return out


@api_router.get("/text_slots/{slot_id}")
async def get_text_slot(slot_id: str):
    doc = await db.text_slots.find_one({"_id": slot_id}, {"_id": 0})
    if not doc:
        return {"slot_id": slot_id, "values": {}}
    return {"slot_id": slot_id, **doc}


@api_router.put("/text_slots/{slot_id}")
async def put_text_slot(slot_id: str, payload: TextSlotPayload):
    doc = {
        "values": payload.values,
        "updated_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.text_slots.update_one(
        {"_id": slot_id},
        {"$set": doc},
        upsert=True,
    )
    return {"slot_id": slot_id, **doc}


@api_router.get("/text_slots")
async def list_text_slots():
    """Return every saved text slot as a dict {slot_id: values}. Used by
    the frontend to hydrate copy without one request per slot on first
    render."""
    cursor = db.text_slots.find({}, {"updated_at": 0})
    items: Dict[str, Dict[str, Optional[str]]] = {}
    async for doc in cursor:
        slot_id = doc.get("_id")
        if slot_id:
            items[slot_id] = doc.get("values") or {}
    return {"slots": items}


app.include_router(api_router)

# Serve legacy uploaded files under /api/uploads for backward compatibility
# with images uploaded before the Emergent Object Storage migration. New
# uploads go straight to object storage and are served via /api/files/.
UPLOAD_DIR = ROOT_DIR / "uploads"
UPLOAD_DIR.mkdir(exist_ok=True)
app.mount("/api/uploads", StaticFiles(directory=str(UPLOAD_DIR)), name="uploads")

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()


@app.on_event("startup")
async def startup_storage():
    """Pre-warm the Emergent object storage session at startup."""
    try:
        init_storage()
    except Exception as exc:
        # Don't crash the app — uploads will surface a 502 if storage is down,
        # but every other endpoint stays available.
        logger.error("Emergent object storage init failed: %s", exc)
