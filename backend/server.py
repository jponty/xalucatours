from fastapi import FastAPI, APIRouter, HTTPException, UploadFile, File, Form, Response, Header
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import re
import logging
import asyncio
import httpx
import hashlib
from io import BytesIO
from PIL import Image
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr, field_validator
from typing import List, Optional, Dict
import uuid
from datetime import datetime, timezone, timedelta

from storage import init_storage, put_object, get_object


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# On-disk cache for transformed image variants (resize / webp / avif).
IMG_CACHE_DIR = ROOT_DIR / "img_cache"
IMG_CACHE_DIR.mkdir(exist_ok=True)

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI(title="Xaluca Tours API")
api_router = APIRouter(prefix="/api")



# ----------------------------------------------------------
#  Admin gate — single shared password protecting /admin.
#  Secret lives in backend .env; a short-lived HMAC-signed token
#  is issued on login and verified on protected access. No user
#  accounts — just one access password.
# ----------------------------------------------------------
import hmac as _hmac
import hashlib as _hashlib
import base64 as _base64
import json as _json
import time as _time

ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD")
ADMIN_TOKEN_SECRET = os.environ.get("ADMIN_TOKEN_SECRET", "")
ADMIN_TOKEN_TTL = 7 * 24 * 3600  # 7 days

EMERGENT_LLM_KEY = os.environ.get("EMERGENT_LLM_KEY")


def _admin_sign(raw: str) -> str:
    return _hmac.new(ADMIN_TOKEN_SECRET.encode(), raw.encode(), _hashlib.sha256).hexdigest()


def make_admin_token() -> str:
    payload = {"scope": "admin", "exp": int(_time.time()) + ADMIN_TOKEN_TTL}
    raw = _base64.urlsafe_b64encode(_json.dumps(payload).encode()).decode().rstrip("=")
    return f"{raw}.{_admin_sign(raw)}"


def verify_admin_token(token: str) -> bool:
    if not token or "." not in token or not ADMIN_TOKEN_SECRET:
        return False
    try:
        raw, sig = token.rsplit(".", 1)
        if not _hmac.compare_digest(sig, _admin_sign(raw)):
            return False
        padded = raw + "=" * (-len(raw) % 4)
        payload = _json.loads(_base64.urlsafe_b64decode(padded.encode()))
        return payload.get("scope") == "admin" and int(payload.get("exp", 0)) > _time.time()
    except Exception:
        return False


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
    source_route_id: Optional[str] = None
    source_path: Optional[str] = None
    source_label: Optional[str] = None
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
    source_route_id: Optional[str] = Field(default=None, max_length=120)
    source_path: Optional[str] = Field(default=None, max_length=300)
    source_label: Optional[str] = Field(default=None, max_length=300)
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
    regions: List[str] = Field(default_factory=list)
    selected_trips: List[str] = Field(default_factory=list)
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
    regions: List[str] = Field(default_factory=list, max_length=20)
    selected_trips: List[str] = Field(default_factory=list, max_length=50)
    activities: List[str] = Field(default_factory=list, max_length=20)
    notes: Optional[str] = Field(default=None, max_length=4000)
    language: Optional[str] = "es"


# ---------- Program brochure download (lead-gated) ----------
# Default link used for every trip page for now. Each route can be assigned
# its own brochure URL in the future by adding an entry to PROGRAM_DOWNLOAD_LINKS
# (keyed by the frontend routeId) — the endpoint resolves per-route first,
# then falls back to the default.
DEFAULT_PROGRAM_DOWNLOAD_URL = os.environ.get("DEFAULT_PROGRAM_DOWNLOAD_URL", "https://xalucatours.com/")
PROGRAM_DOWNLOAD_LINKS: Dict[str, str] = {}


def resolve_program_download_url(route_id: Optional[str]) -> str:
    return PROGRAM_DOWNLOAD_LINKS.get(route_id or "", DEFAULT_PROGRAM_DOWNLOAD_URL)


class ProgramDownloadRequest(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    first_name: str
    last_name: str
    email: EmailStr
    phone: str
    newsletter: bool = False
    privacy_accepted: bool = True
    route_id: Optional[str] = None
    program_title: Optional[str] = None
    download_url: str
    language: Optional[str] = "es"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class ProgramDownloadCreate(BaseModel):
    first_name: str = Field(..., min_length=1, max_length=80)
    last_name: str = Field(..., min_length=1, max_length=80)
    email: EmailStr
    phone: str = Field(..., min_length=4, max_length=40)
    newsletter: bool = False
    privacy_accepted: bool
    route_id: Optional[str] = Field(default=None, max_length=120)
    program_title: Optional[str] = Field(default=None, max_length=200)
    language: Optional[str] = "es"

    @field_validator("privacy_accepted")
    @classmethod
    def _privacy_must_be_accepted(cls, v: bool) -> bool:
        if not v:
            raise ValueError("privacy_accepted must be true")
        return v


# ---------- Routes ----------
@api_router.get("/")
async def root():
    return {"service": "Xaluca Tours", "status": "ok"}


class AdminLoginBody(BaseModel):
    password: str = Field(..., max_length=200)


@api_router.post("/admin/login")
async def admin_login(body: AdminLoginBody):
    """Verify the shared admin password and issue a signed access token."""
    if not ADMIN_PASSWORD:
        raise HTTPException(status_code=500, detail="Admin no configurado")
    if not _hmac.compare_digest(body.password, ADMIN_PASSWORD):
        raise HTTPException(status_code=401, detail="Contraseña incorrecta")
    return {"token": make_admin_token()}


@api_router.get("/admin/verify")
async def admin_verify(authorization: str = Header(default="")):
    """Validate an admin token (sent as `Authorization: Bearer <token>`)."""
    token = authorization[7:].strip() if authorization.startswith("Bearer ") else ""
    if not verify_admin_token(token):
        raise HTTPException(status_code=401, detail="Sesión no válida")
    return {"ok": True}


# ---------- Global pricing (centralised, admin-editable) ----------
# Stored as a single document {_id:"pricing"} in collection `config`.
# Only the PRICE NUMBERS are overridden here; labels/season defs live
# in the frontend lib/pricing.js config. Empty doc → frontend defaults.
class PricingTier(BaseModel):
    people: int = Field(..., ge=1, le=20)
    low: int = Field(..., ge=0, le=100000)
    high: int = Field(..., ge=0, le=100000)


class PricingPayload(BaseModel):
    model_config = ConfigDict(extra="ignore")
    tiers: List[PricingTier] = Field(..., min_length=1, max_length=12)
    currency: Optional[str] = Field(default="EUR", max_length=8)


@api_router.get("/pricing")
async def get_pricing():
    doc = await db.config.find_one({"_id": "pricing"}, {"_id": 0})
    return doc or {}


@api_router.put("/pricing")
async def put_pricing(payload: PricingPayload, authorization: str = Header(default="")):
    token = authorization[7:].strip() if authorization.startswith("Bearer ") else ""
    if not verify_admin_token(token):
        raise HTTPException(status_code=401, detail="Sesión no válida")
    update = {
        "tiers": [t.model_dump() for t in payload.tiers],
        "currency": payload.currency or "EUR",
        "updated_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.config.update_one({"_id": "pricing"}, {"$set": update}, upsert=True)
    doc = await db.config.find_one({"_id": "pricing"}, {"_id": 0})
    return doc or {}


# ---------- CMS export / import (sync content between environments) ----------
# All editable content (image slots, text slots, global pricing) lives in
# MongoDB. Image binaries live in the SHARED object storage, so syncing the DB
# records alone is enough to move edits from preview → production without a
# database redeploy. Export is read-only/public (content is already public);
# import WRITES and is admin-protected.
def _jsonable_doc(doc):
    """Make a Mongo doc JSON-safe: keep the string _id, ISO-format datetimes."""
    if not doc:
        return doc
    out = {}
    for k, v in doc.items():
        out[k] = v.isoformat() if isinstance(v, datetime) else v
    return out


class CmsImportPayload(BaseModel):
    model_config = ConfigDict(extra="ignore")
    image_slots: List[dict] = Field(default_factory=list)
    text_slots: List[dict] = Field(default_factory=list)
    pricing: Optional[dict] = None
    wipe: bool = False  # when true, clear the slot collections before importing


@api_router.get("/cms/export")
async def cms_export():
    image_slots = await db.image_slots.find({}).to_list(10000)
    text_slots = await db.text_slots.find({}).to_list(10000)
    pricing = await db.config.find_one({"_id": "pricing"})
    return {
        "version": 1,
        "exported_at": datetime.now(timezone.utc).isoformat(),
        "counts": {"image_slots": len(image_slots), "text_slots": len(text_slots)},
        "image_slots": [_jsonable_doc(d) for d in image_slots],
        "text_slots": [_jsonable_doc(d) for d in text_slots],
        "pricing": _jsonable_doc(pricing),
    }


@api_router.post("/cms/import")
async def cms_import(payload: CmsImportPayload, authorization: str = Header(default="")):
    token = authorization[7:].strip() if authorization.startswith("Bearer ") else ""
    if not verify_admin_token(token):
        raise HTTPException(status_code=401, detail="Sesión no válida")

    now = datetime.now(timezone.utc).isoformat()
    result = {"image_slots": 0, "text_slots": 0, "pricing": False, "wiped": payload.wipe}

    if payload.wipe:
        await db.image_slots.delete_many({})
        await db.text_slots.delete_many({})

    for doc in payload.image_slots:
        sid = doc.get("_id")
        if not sid:
            continue
        update = {k: v for k, v in doc.items() if k != "_id"}
        if update.get("url"):
            update["url"] = _relativize_url(update["url"])  # keep domain-independent
        update["updated_at"] = now
        await db.image_slots.update_one({"_id": sid}, {"$set": update}, upsert=True)
        result["image_slots"] += 1

    for doc in payload.text_slots:
        sid = doc.get("_id")
        if not sid:
            continue
        update = {k: v for k, v in doc.items() if k != "_id"}
        update["updated_at"] = now
        await db.text_slots.update_one({"_id": sid}, {"$set": update}, upsert=True)
        result["text_slots"] += 1

    if payload.pricing:
        pdoc = {k: v for k, v in payload.pricing.items() if k != "_id"}
        pdoc["updated_at"] = now
        await db.config.update_one({"_id": "pricing"}, {"$set": pdoc}, upsert=True)
        result["pricing"] = True

    return {"ok": True, "imported": result}



@api_router.post("/contact-requests", response_model=ContactRequest)
async def create_contact_request(payload: ContactRequestCreate):
    obj = ContactRequest(**payload.model_dump())
    doc = obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.contact_requests.insert_one(doc)
    return obj


@api_router.get("/contact-requests", response_model=List[ContactRequest])
async def list_contact_requests(authorization: str = Header(default="")):
    token = authorization[7:].strip() if authorization.startswith("Bearer ") else ""
    if not verify_admin_token(token):
        raise HTTPException(status_code=401, detail="Unauthorized")
    rows = await db.contact_requests.find({}, {"_id": 0}).sort("created_at", -1).to_list(2000)
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
    regions = [r.strip()[:40] for r in (payload.regions or []) if r and r.strip()]
    selected_trips = [s.strip()[:80] for s in (payload.selected_trips or []) if s and s.strip()]
    obj = TripPlannerRequest(**{**payload.model_dump(), "activities": activities, "regions": regions, "selected_trips": selected_trips})
    doc = obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.trip_planner_requests.insert_one(doc)
    return obj


@api_router.get("/trip-planner", response_model=List[TripPlannerRequest])
async def list_trip_planner(authorization: str = Header(default="")):
    token = authorization[7:].strip() if authorization.startswith("Bearer ") else ""
    if not verify_admin_token(token):
        raise HTTPException(status_code=401, detail="Unauthorized")
    rows = await db.trip_planner_requests.find({}, {"_id": 0}).sort("created_at", -1).to_list(2000)
    for r in rows:
        if isinstance(r.get('created_at'), str):
            try:
                r['created_at'] = datetime.fromisoformat(r['created_at'])
            except ValueError:
                pass
    return rows


@api_router.post("/program-downloads", response_model=ProgramDownloadRequest)
async def create_program_download(payload: ProgramDownloadCreate):
    url = resolve_program_download_url(payload.route_id)
    obj = ProgramDownloadRequest(**payload.model_dump(), download_url=url)
    doc = obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.program_downloads.insert_one(doc)
    return obj


@api_router.get("/program-downloads", response_model=List[ProgramDownloadRequest])
async def list_program_downloads(authorization: str = Header(default="")):
    token = authorization[7:].strip() if authorization.startswith("Bearer ") else ""
    if not verify_admin_token(token):
        raise HTTPException(status_code=401, detail="Unauthorized")
    rows = await db.program_downloads.find({}, {"_id": 0}).sort("created_at", -1).to_list(2000)
    for r in rows:
        if isinstance(r.get('created_at'), str):
            try:
                r['created_at'] = datetime.fromisoformat(r['created_at'])
            except ValueError:
                pass
    return rows


# ---------- Lead deletion (admin only) ----------
async def _delete_lead(collection, lead_id: str, authorization: str):
    token = authorization[7:].strip() if authorization.startswith("Bearer ") else ""
    if not verify_admin_token(token):
        raise HTTPException(status_code=401, detail="Unauthorized")
    res = await collection.delete_one({"id": lead_id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Lead not found")
    return {"deleted": True, "id": lead_id}


@api_router.delete("/contact-requests/{lead_id}")
async def delete_contact_request(lead_id: str, authorization: str = Header(default="")):
    return await _delete_lead(db.contact_requests, lead_id, authorization)


@api_router.delete("/trip-planner/{lead_id}")
async def delete_trip_planner(lead_id: str, authorization: str = Header(default="")):
    return await _delete_lead(db.trip_planner_requests, lead_id, authorization)


@api_router.delete("/program-downloads/{lead_id}")
async def delete_program_download(lead_id: str, authorization: str = Header(default="")):
    return await _delete_lead(db.program_downloads, lead_id, authorization)



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
MAX_UPLOAD_BYTES = 20 * 1024 * 1024  # 20 MB (originals are compressed server-side)

# ---------- Automatic image optimisation on upload ----------
# Every image uploaded through the CMS is resized (max width) and
# re-encoded to WebP for fast web delivery, without the editor having
# to optimise anything manually.
from io import BytesIO as _BytesIO
from PIL import Image as _PILImage, ImageOps as _PILImageOps

MAX_IMAGE_WIDTH = 2000   # px — downscale anything wider, never upscale
WEBP_QUALITY = 80        # sweet spot: visually lossless, light files
_EXT_BY_MIME = {"image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/avif": "avif"}


def _slug_tag(raw: Optional[str]) -> str:
    """Normalise a free-form folder/tag name into a clean, filterable tag.
    e.g. 'Marrakech 2026 ' -> 'marrakech-2026'. Returns '' when empty."""
    s = (raw or "").strip().lower()
    s = re.sub(r"\s+", "-", s)
    s = re.sub(r"[^a-z0-9._-]", "", s)
    return s[:40]


def optimize_image(data: bytes, content_type: str):
    """Resize (to MAX_IMAGE_WIDTH) and convert to WebP (quality 80).

    Returns (out_bytes, out_content_type, out_ext). Falls back to the
    original bytes/type if the image cannot be processed (e.g. an AVIF
    without the decode plugin) so an upload never fails because of
    optimisation."""
    fallback_ext = _EXT_BY_MIME.get(content_type, "bin")
    try:
        img = _PILImage.open(_BytesIO(data))
        img = _PILImageOps.exif_transpose(img)  # honour camera orientation
        has_alpha = img.mode in ("RGBA", "LA") or (img.mode == "P" and "transparency" in img.info)
        img = img.convert("RGBA" if has_alpha else "RGB")
        resized = False
        if img.width > MAX_IMAGE_WIDTH:
            new_h = max(1, round(img.height * MAX_IMAGE_WIDTH / img.width))
            img = img.resize((MAX_IMAGE_WIDTH, new_h), _PILImage.LANCZOS)
            resized = True
        buf = _BytesIO()
        img.save(buf, format="WEBP", quality=WEBP_QUALITY, method=6)
        out = buf.getvalue()
        # If we didn't need to resize and WebP isn't smaller, keep the
        # original to avoid bloating already-optimised assets.
        if not resized and len(out) >= len(data):
            return data, content_type, fallback_ext
        return out, "image/webp", "webp"
    except Exception as exc:
        logger.warning(f"image optimize skipped ({content_type}): {exc}")
        return data, content_type, fallback_ext



def _relativize_url(url):
    """Strip scheme+host from URLs that point at our own `/api/...` paths so
    image slots are DOMAIN-INDEPENDENT across environments (preview ↔
    production). Storing an absolute URL with the origin baked in breaks the
    image when the same record is served from another domain — the frontend
    <img> then errors out and reverts to its code fallback. External stock
    CDNs (images.unsplash.com, images.pexels.com, …) are left untouched."""
    if not url or not isinstance(url, str):
        return url
    m = re.match(r"^https?://[^/]+(/api/.*)$", url, re.IGNORECASE)
    return m.group(1) if m else url


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
    if doc.get("url"):
        doc["url"] = _relativize_url(doc["url"])
    return {"slot_id": slot_id, "exists": True, **doc}


@api_router.get("/slots/{slot_id}/usage")
async def slot_usage(slot_id: str):
    """Given a slot, find every OTHER slot across the site that renders the
    same image (matched by storage_path or url). Powers the 'Usada en' panel
    inside the Image Editor so editors see where a photo lives before changing
    it. Returns the current slot first (is_current=True), then the rest."""
    doc = await db.image_slots.find_one({"_id": slot_id}, {"_id": 0})
    if not doc or not (doc.get("url") or doc.get("storage_path")):
        return {"slot_id": slot_id, "count": 0, "slots": []}

    storage_path = doc.get("storage_path")
    url = doc.get("url")

    conditions = []
    if storage_path:
        conditions.append({"storage_path": storage_path})
        conditions.append({"url": {"$regex": f"/{re.escape(storage_path)}$"}})
    if url:
        conditions.append({"url": url})
    if not conditions:
        return {"slot_id": slot_id, "count": 0, "slots": []}

    cursor = db.image_slots.find(
        {"$or": conditions},
        {"_id": 1, "url": 1, "updated_at": 1, "source": 1},
    )
    docs = await cursor.to_list(500)
    slots = [
        {
            "slot_id": d["_id"],
            "url": d.get("url"),
            "source": d.get("source"),
            "updated_at": d.get("updated_at"),
            "is_current": d["_id"] == slot_id,
        }
        for d in docs
    ]
    # Current slot first, then by slot id for stable ordering.
    slots.sort(key=lambda s: (not s["is_current"], s["slot_id"]))
    return {"slot_id": slot_id, "count": len(slots), "slots": slots}


@api_router.get("/slots")
async def list_image_slots():
    """List every image slot ever set — used by the /admin dashboard."""
    cursor = db.image_slots.find({}, {"updated_at": 0}).limit(10000)
    items = []
    async for d in cursor:
        items.append({
            "slot_id":  d.pop("_id"),
            "url":      _relativize_url(d.get("url")),
            "alt":      d.get("alt"),
            "alt_i18n": d.get("alt_i18n"),
            "cleared":  bool(d.get("cleared")),
            "source":   d.get("source", "external"),
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
    # Persist our own image URLs as domain-independent relative paths.
    if "url" in update and update.get("url"):
        update["url"] = _relativize_url(update["url"])
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
        raise HTTPException(status_code=413, detail="File exceeds 20 MB limit.")

    sha = hashlib.sha256(data).hexdigest()
    size_original = len(data)
    # Optimise: resize to max width + convert to WebP before storing.
    data, ctype, ext = optimize_image(data, file.content_type)
    safe_slot = "".join(c for c in slot_id if c.isalnum() or c in "._-")[:60] or "slot"
    storage_path = f"xaluca/slots/{safe_slot}/{uuid.uuid4().hex}.{ext}"

    try:
        result = await asyncio.to_thread(put_object, storage_path, data, ctype)
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
        "content_type": ctype,
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
        "content_type": ctype,
        "size": doc["size"],
        "sha256": sha,
        "size_original": size_original,
        "is_deleted": False,
        "created_at": doc["updated_at"],
    })
    return {"slot_id": slot_id, **doc}


@api_router.post("/library/upload")
async def upload_library_images(
    files: List[UploadFile] = File(...),
    tag: Optional[str] = Form(None),
):
    """Bulk-upload images directly into the CMS library.
    The files are NOT bound to any slot — editors browse them later
    from the library picker and reuse them across pages.

    When `tag` is provided (e.g. a folder name from a folder import),
    every uploaded image is grouped under that normalised tag so the
    whole batch can be filtered together in the library."""
    if not files:
        raise HTTPException(status_code=400, detail="No files provided.")
    if len(files) > 30:
        raise HTTPException(status_code=400, detail="Máximo 30 archivos por lote.")

    folder_tag = _slug_tag(tag)
    base_tags = ["library"] + ([folder_tag] if folder_tag else [])

    uploaded: List[Dict] = []
    skipped: List[Dict] = []
    duplicates: List[Dict] = []
    now_iso = datetime.now(timezone.utc).isoformat()

    for f in files:
        if f.content_type not in ALLOWED_MIME:
            skipped.append({"filename": f.filename, "reason": f"unsupported-type:{f.content_type}"})
            continue
        data = await f.read()
        if len(data) > MAX_UPLOAD_BYTES:
            skipped.append({"filename": f.filename, "reason": "too-large"})
            continue

        # Duplicate detection: hash the ORIGINAL bytes (content + size).
        sha = hashlib.sha256(data).hexdigest()
        existing = await db.files.find_one(
            {"sha256": sha, "size_original": len(data), "is_deleted": {"$ne": True}}
        )
        if not existing:  # fall back to hash-only (older records lacked size_original)
            existing = await db.files.find_one({"sha256": sha, "is_deleted": {"$ne": True}})
        if existing:
            # Already in the gallery — never store again. If a tag was
            # requested, just add this image to that group.
            tag_added = False
            if folder_tag and folder_tag not in (existing.get("tags") or []):
                await db.files.update_one({"id": existing["id"]}, {"$addToSet": {"tags": folder_tag}})
                tag_added = True
            duplicates.append({
                "filename": f.filename,
                "existing_id": existing.get("id"),
                "url": f"/api/files/{existing.get('storage_path')}",
                "tag_added": tag_added,
            })
            continue

        data, ctype, ext = optimize_image(data, f.content_type)
        storage_path = f"xaluca/library/{uuid.uuid4().hex}.{ext}"
        try:
            result = await asyncio.to_thread(put_object, storage_path, data, ctype)
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
            "content_type": ctype,
            "size": result.get("size", len(data)),
            "sha256": sha,
            "size_original": len(data),
            "is_deleted": False,
            "tags": list(base_tags),
            "created_at": now_iso,
        }
        await db.files.insert_one(record)
        uploaded.append({
            "id": record["id"],
            "url": f"/api/files/{canonical_path}",
            "storage_path": canonical_path,
            "original_filename": f.filename,
            "content_type": ctype,
            "size": record["size"],
        })

    return {
        "uploaded": uploaded,
        "skipped": skipped,
        "duplicates": duplicates,
        "count": len(uploaded),
    }


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
        raise HTTPException(status_code=413, detail="File exceeds 20 MB limit.")

    record = await db.files.find_one({"id": file_id, "is_deleted": {"$ne": True}})
    if not record:
        raise HTTPException(status_code=404, detail="File not found.")

    sha = hashlib.sha256(data).hexdigest()
    size_original = len(data)
    data, ctype, ext = optimize_image(data, file.content_type)
    storage_path = f"xaluca/library/{uuid.uuid4().hex}.{ext}"
    result: Dict = {}
    try:
        result = await asyncio.to_thread(put_object, storage_path, data, ctype)
    except Exception as exc:
        logger.exception("Replace — storage put failed")
        raise HTTPException(status_code=502, detail=f"storage-upload-failed: {exc}")

    canonical_path = result.get("path", storage_path)
    now_iso = datetime.now(timezone.utc).isoformat()
    await db.files.update_one(
        {"id": file_id},
        {"$set": {
            "storage_path": canonical_path,
            "content_type": ctype,
            "size": result.get("size", len(data)),
            "sha256": sha,
            "size_original": size_original,
            "original_filename": file.filename or record.get("original_filename"),
            "updated_at": now_iso,
        }},
    )
    return {
        "id": file_id,
        "url": f"/api/files/{canonical_path}",
        "storage_path": canonical_path,
        "original_filename": file.filename or record.get("original_filename"),
        "content_type": ctype,
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
        result = await asyncio.to_thread(put_object, storage_path, data, content_type)
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
#  Pexels BULK FILL
#  ----
#  Populate many image slots at once with contextually relevant
#  Pexels photos. One API search per UNIQUE query (downloads of the
#  actual image bytes come from images.pexels.com and do NOT count
#  against the Pexels API rate limit). Distinct photos are spread
#  across slots that share a query. Stores RELATIVE /api/files/...
#  URLs so images survive host changes.
# ----------------------------------------------------------
class BulkFillItem(BaseModel):
    slot_id: str = Field(..., max_length=300)
    query: str = Field(..., max_length=200)
    alt: Optional[str] = Field(default=None, max_length=300)
    alt_i18n: Optional[Dict[str, str]] = None


class BulkFillRequest(BaseModel):
    items: List[BulkFillItem]
    orientation: str = Field(default="landscape", pattern="^(landscape|portrait|square)$")
    force: bool = True
    per_page: int = 40


@api_router.post("/pexels/bulk-fill")
async def pexels_bulk_fill(payload: BulkFillRequest):
    """Batch-import Pexels images into many image slots."""
    from collections import defaultdict
    by_query: Dict[str, List[BulkFillItem]] = defaultdict(list)
    for it in payload.items:
        by_query[it.query.strip()].append(it)

    results: List[Dict] = []
    ext_map = {"image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/avif": "avif"}

    for query, items in by_query.items():
        # One search per unique query
        try:
            raw = await _pexels_get("/search", {
                "query": query,
                "per_page": max(len(items) + 4, min(payload.per_page, 80)),
                "orientation": payload.orientation,
            })
        except HTTPException as exc:
            for it in items:
                results.append({"slot_id": it.slot_id, "ok": False, "error": f"search-failed: {exc.detail}"})
            continue

        photos = raw.get("photos") or []
        if not photos:
            for it in items:
                results.append({"slot_id": it.slot_id, "ok": False, "error": "no-results", "query": query})
            continue

        for idx, it in enumerate(items):
            if not payload.force:
                existing = await db.image_slots.find_one({"_id": it.slot_id})
                if existing and existing.get("url") and not existing.get("cleared"):
                    results.append({"slot_id": it.slot_id, "ok": True, "skipped": True})
                    continue

            photo = photos[idx % len(photos)]
            src = photo.get("src") or {}
            dl_url = src.get("large2x") or src.get("large") or src.get("original")
            if not dl_url:
                results.append({"slot_id": it.slot_id, "ok": False, "error": "no-src"})
                continue
            try:
                async with httpx.AsyncClient(timeout=httpx.Timeout(60.0, connect=10.0), follow_redirects=True) as cx:
                    dl = await cx.get(dl_url)
                if dl.status_code != 200:
                    raise RuntimeError(f"download status {dl.status_code}")
                data = dl.content
                content_type = (dl.headers.get("content-type") or "image/jpeg").split(";")[0].strip()
                ext = ext_map.get(content_type, "jpg")
                storage_path = f"xaluca/library/pexels_{photo.get('id')}_{uuid.uuid4().hex[:8]}.{ext}"
                result = await asyncio.to_thread(put_object, storage_path, data, content_type)
                canonical_path = result.get("path", storage_path)
                public_url = f"/api/files/{canonical_path}"
                now_iso = datetime.now(timezone.utc).isoformat()
                attribution = {
                    "pexels_id": photo.get("id"),
                    "photographer": photo.get("photographer", ""),
                    "photographer_url": photo.get("photographer_url", ""),
                    "pexels_url": photo.get("url", ""),
                    "alt": photo.get("alt", ""),
                }
                await db.files.insert_one({
                    "id": str(uuid.uuid4()),
                    "slot_id": it.slot_id,
                    "storage_path": canonical_path,
                    "original_filename": f"Pexels · {attribution['photographer'] or photo.get('id')}.{ext}",
                    "content_type": content_type,
                    "size": result.get("size", len(data)),
                    "is_deleted": False,
                    "tags": ["library", "pexels", "bulk-fill"],
                    "source": "pexels",
                    "pexels": attribution,
                    "created_at": now_iso,
                })
                slot_update = {
                    "url": public_url,
                    "alt": it.alt or photo.get("alt") or query,
                    "source": "pexels",
                    "cleared": False,
                    "pexels": attribution,
                    "updated_at": now_iso,
                }
                if it.alt_i18n:
                    slot_update["alt_i18n"] = it.alt_i18n
                await db.image_slots.update_one({"_id": it.slot_id}, {"$set": slot_update}, upsert=True)
                results.append({"slot_id": it.slot_id, "ok": True, "url": public_url, "pexels_id": photo.get("id"), "query": query})
            except Exception as exc:  # noqa: BLE001
                logger.exception("bulk-fill failed for %s", it.slot_id)
                results.append({"slot_id": it.slot_id, "ok": False, "error": str(exc)[:160], "query": query})

    ok = sum(1 for r in results if r.get("ok"))
    return {"total": len(results), "ok": ok, "failed": len(results) - ok, "results": results}



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
    summary = {
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
    # Some endpoints (single photo) already carry location inline.
    inline_loc = _format_location(p.get("location"))
    if inline_loc:
        summary["location"] = inline_loc
    return summary


# Location is NOT returned by /search/photos — only by the single-photo
# endpoint. We fetch it per id, cache it in-memory (dedupes across pages /
# repeat searches), and attach it to each result. Missing/None locations are
# cached too so we never re-hit the API for photos without geodata.
_unsplash_loc_cache: Dict[str, Optional[Dict]] = {}


def _format_location(loc: Optional[Dict]) -> Optional[Dict]:
    """Build a clean, display-ready location dict, or None when absent."""
    loc = loc or {}
    name = (loc.get("name") or "").strip() or None
    city = (loc.get("city") or "").strip() or None
    country = (loc.get("country") or "").strip() or None
    display = name or ", ".join([x for x in (city, country) if x]) or None
    if not display:
        return None
    out = {"display": display}
    if city:
        out["city"] = city
    if country:
        out["country"] = country
    return out


async def _unsplash_location(photo_id: str) -> Optional[Dict]:
    if not photo_id:
        return None
    # 1) hot in-memory cache
    if photo_id in _unsplash_loc_cache:
        return _unsplash_loc_cache[photo_id]
    # 2) persistent cache (survives restarts, dedupes across all sessions &
    #    time — so each photo's location costs at most ONE Unsplash call ever)
    doc = await db.unsplash_locations.find_one({"_id": photo_id})
    if doc is not None:
        loc = doc.get("location")
        _unsplash_loc_cache[photo_id] = loc
        return loc
    # 3) fetch from Unsplash (single-photo endpoint carries location)
    try:
        detail = await _unsplash_get(f"/photos/{photo_id}")
    except HTTPException:
        # Rate-limited or transient — do NOT cache so we can retry later.
        return None
    result = _format_location((detail or {}).get("location"))
    _unsplash_loc_cache[photo_id] = result
    try:
        await db.unsplash_locations.update_one(
            {"_id": photo_id},
            {"$set": {"location": result, "cached_at": datetime.now(timezone.utc).isoformat()}},
            upsert=True,
        )
    except Exception as exc:
        logger.debug("unsplash location cache write failed: %s", exc)
    return result


async def _attach_locations(summaries: List[Dict]) -> None:
    """Fetch & attach location to each summary that doesn't already have one,
    with bounded concurrency to respect Unsplash rate limits."""
    sem = asyncio.Semaphore(8)

    async def fill(s: Dict):
        if s.get("location"):
            return
        async with sem:
            loc = await _unsplash_location(s.get("id"))
        if loc:
            s["location"] = loc

    targets = [s for s in summaries if not s.get("location")]
    if targets:
        await asyncio.gather(*[fill(s) for s in targets])


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
    photos = [_unsplash_summary(p) for p in results]
    await _attach_locations(photos)
    return {
        "page": page,
        "per_page": per_page,
        "total_results": (raw.get("total", len(results)) if isinstance(raw, dict) else len(results)),
        "next_page": page < total_pages,
        "photos": photos,
    }


@api_router.get("/unsplash/featured")
async def unsplash_featured(page: int = 1, per_page: int = 24):
    """Recent/featured editorial feed — default state of the Unsplash tab."""
    per_page = max(1, min(per_page, 30))
    page = max(1, page)
    raw = await _unsplash_get("/photos", {"page": page, "per_page": per_page, "order_by": "popular"})
    items = raw if isinstance(raw, list) else []
    photos = [_unsplash_summary(p) for p in items]
    await _attach_locations(photos)
    return {
        "page": page,
        "per_page": per_page,
        "total_results": len(items),
        "next_page": len(items) >= per_page,   # Unsplash /photos doesn't expose total
        "photos": photos,
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
        result = await asyncio.to_thread(put_object, storage_path, data, content_type)
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


class UsageBatchBody(BaseModel):
    ids: List[str] = Field(default_factory=list)


@api_router.post("/files/usage-batch")
async def files_usage_batch(body: UsageBatchBody):
    """Returns usage info for many files in a SINGLE request.
    The library picker calls this once for all visible thumbnails instead
    of firing one request per image (which used to saturate the browser
    connection pool and freeze search). Output: {usage: {file_id: {count, slots}}}."""
    ids = [i for i in (body.ids or []) if i][:300]
    if not ids:
        return {"usage": {}}

    files = await db.files.find({"id": {"$in": ids}}, {"_id": 0, "id": 1, "storage_path": 1}).to_list(len(ids))
    id_to_path = {f["id"]: f.get("storage_path") for f in files if f.get("storage_path")}
    if not id_to_path:
        return {"usage": {fid: {"count": 0, "slots": []} for fid in ids}}

    # One pass over all image slots; match each file by storage_path or URL suffix.
    all_slots = await db.image_slots.find(
        {"$or": [{"url": {"$exists": True}}, {"storage_path": {"$exists": True}}]},
        {"_id": 1, "url": 1, "storage_path": 1, "source": 1, "updated_at": 1},
    ).to_list(5000)

    usage = {fid: {"count": 0, "slots": []} for fid in ids}
    for fid, sp in id_to_path.items():
        suffix = f"/{sp}"
        matched = [
            {"slot_id": s["_id"], "url": s.get("url"), "source": s.get("source"), "updated_at": s.get("updated_at")}
            for s in all_slots
            if s.get("storage_path") == sp or (s.get("url") or "").endswith(suffix)
        ]
        usage[fid] = {"count": len(matched), "slots": matched}
    return {"usage": usage}



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
async def download_file(
    path: str,
    w: Optional[int] = None,
    fmt: Optional[str] = None,
    accept: str = Header(default=""),
):
    """Public proxy that streams an object from Emergent storage.
    Used by <img src="/api/files/..."> tags in the CMS — no auth needed
    because CMS images are part of the public site content.

    Optional on-the-fly optimisation (responsive + modern formats):
      • ?w=640        → downscale to <= 640px wide (aspect preserved)
      • ?fmt=webp     → re-encode as WebP
      • ?fmt=avif     → re-encode as AVIF
      • ?fmt=auto     → negotiate via the request Accept header
                        (WebP preferred for fast encode + broad support)
    Transformed variants are content-addressed and cached on disk, then
    served with a long immutable Cache-Control for aggressive caching.
    Passthrough (no w/fmt) keeps the original bytes — zero regression."""
    # ---- Fast path: original bytes, unchanged behaviour ----
    if not w and not fmt:
        try:
            # get_object uses blocking `requests`; offload to a thread so a
            # burst of <img> requests can't block the event loop and freeze
            # other API calls (e.g. the library search box).
            data, content_type = await asyncio.to_thread(get_object, path)
        except Exception as exc:
            logger.warning("Emergent storage fetch failed for %s: %s", path, exc)
            raise HTTPException(status_code=404, detail="File not found")
        return Response(
            content=data,
            media_type=content_type,
            headers={"Cache-Control": "public, max-age=86400"},
        )

    # ---- Resolve target format ----
    accept_l = (accept or "").lower()
    target = None
    if fmt == "avif":
        target = "avif"
    elif fmt == "webp":
        target = "webp"
    elif fmt == "auto":
        # Prefer WebP (fast encode + ~97% support); only AVIF if WebP unsupported.
        if "image/webp" in accept_l:
            target = "webp"
        elif "image/avif" in accept_l:
            target = "avif"

    # ---- Snap width to a small set of buckets to maximise cache hits ----
    width = None
    if w and w > 0:
        buckets = [320, 480, 640, 768, 960, 1280, 1600, 1920, 2400]
        width = next((b for b in buckets if b >= w), buckets[-1])

    # ---- Disk cache lookup ----
    ext = target or "orig"
    key = hashlib.sha1(f"{path}|{width}|{ext}".encode("utf-8")).hexdigest()
    cache_file = IMG_CACHE_DIR / f"{key}.{ext}"
    mime_map = {"avif": "image/avif", "webp": "image/webp"}
    long_cache = {"Cache-Control": "public, max-age=31536000, immutable"}
    if cache_file.exists():
        return Response(
            content=cache_file.read_bytes(),
            media_type=mime_map.get(target, "image/jpeg"),
            headers=long_cache,
        )

    # ---- Fetch original + transform ----
    try:
        data, content_type = await asyncio.to_thread(get_object, path)
    except Exception as exc:
        logger.warning("Emergent storage fetch failed for %s: %s", path, exc)
        raise HTTPException(status_code=404, detail="File not found")

    try:
        img = Image.open(BytesIO(data))
        img.load()
        # Downscale only (never upscale) to preserve sharpness.
        if width and img.width > width:
            new_h = max(1, round(img.height * width / img.width))
            img = img.resize((width, new_h), Image.LANCZOS)

        save_fmt = {"avif": "AVIF", "webp": "WEBP"}.get(target)
        out = BytesIO()
        if save_fmt in ("WEBP", "AVIF"):
            if img.mode not in ("RGB", "RGBA"):
                img = img.convert("RGBA" if "A" in img.getbands() else "RGB")
            save_kwargs = {"quality": 80}
            if save_fmt == "AVIF":
                save_kwargs["speed"] = 6   # keep encode latency reasonable
            img.save(out, format=save_fmt, **save_kwargs)
            out_mime = mime_map[target]
        else:
            # Resize-only, keep original format.
            orig_fmt = (img.format or "JPEG")
            if orig_fmt.upper() == "JPEG" and img.mode != "RGB":
                img = img.convert("RGB")
            img.save(out, format=orig_fmt)
            out_mime = content_type
            ext = "orig"
            cache_file = IMG_CACHE_DIR / f"{key}.{ext}"

        result = out.getvalue()
        try:
            cache_file.write_bytes(result)
        except Exception as exc:
            logger.debug("img cache write failed: %s", exc)
        return Response(content=result, media_type=out_mime, headers=long_cache)
    except Exception as exc:
        # Anything Pillow can't handle (SVG, corrupt, etc.) → original bytes.
        logger.debug("img transform fallback for %s: %s", path, exc)
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


@api_router.delete("/text_slots/{slot_id}")
async def delete_text_slot(slot_id: str, lang: Optional[str] = None):
    """Reset a text slot back to its code default.

    - With ?lang=<es|en|fr>: removes only that language. If no languages
      remain afterwards, the document is deleted entirely.
    - Without lang: removes the whole slot document.
    Always returns the resulting values ({} when the slot no longer exists).
    """
    if lang:
        doc = await db.text_slots.find_one({"_id": slot_id})
        values = (doc or {}).get("values") or {}
        values.pop(lang, None)
        if values:
            await db.text_slots.update_one(
                {"_id": slot_id},
                {"$set": {"values": values, "updated_at": datetime.now(timezone.utc).isoformat()}},
            )
            return {"slot_id": slot_id, "values": values}
        await db.text_slots.delete_one({"_id": slot_id})
        return {"slot_id": slot_id, "values": {}}

    await db.text_slots.delete_one({"_id": slot_id})
    return {"slot_id": slot_id, "values": {}}


@api_router.get("/text_slots")
async def list_text_slots():
    """Return every saved text slot as a dict {slot_id: values}. Used by
    the frontend to hydrate copy without one request per slot on first
    render."""
    cursor = db.text_slots.find({}, {"updated_at": 0}).limit(10000)
    items: Dict[str, Dict[str, Optional[str]]] = {}
    async for doc in cursor:
        slot_id = doc.get("_id")
        if slot_id:
            items[slot_id] = doc.get("values") or {}
    return {"slots": items}


# ----------------------------------------------------------
# CMS autotranslation (ES -> EN/FR) via Emergent LLM key
# ----------------------------------------------------------
LANG_NAMES = {"es": "Spanish", "en": "English", "fr": "French"}


class TranslateBody(BaseModel):
    text: str = Field(..., max_length=6000)
    source: str = "es"
    targets: List[str] = Field(default_factory=lambda: ["en", "fr"])


@api_router.post("/translate")
async def translate_text(body: TranslateBody):
    """Translate a short CMS string from `source` into each of `targets`.
    Returns { "translations": { "en": "...", "fr": "..." } }. One LLM call
    returns all targets as JSON to keep latency low."""
    text = (body.text or "").strip()
    targets = [t for t in body.targets if t in ("en", "fr", "es") and t != body.source]
    if not text or not targets:
        return {"translations": {}}
    if not EMERGENT_LLM_KEY:
        raise HTTPException(503, "Translation service not configured")

    from emergentintegrations.llm.chat import LlmChat, UserMessage

    target_desc = ", ".join(f'"{t}" ({LANG_NAMES[t]})' for t in targets)
    json_shape = ", ".join(f'"{t}": "..."' for t in targets)
    system = (
        "You are a professional translator for a premium Moroccan travel agency website. "
        "Translate faithfully, preserving the marketing tone, proper nouns, place names and "
        "inline punctuation. Do not add or remove information. "
        "Return ONLY a strict JSON object, no markdown, no commentary."
    )
    prompt = (
        f"Source language: {LANG_NAMES.get(body.source, body.source)}.\n"
        f"Translate the text into: {target_desc}.\n"
        f"Return strictly a JSON object like {{{json_shape}}}.\n\n"
        f"TEXT:\n{text}"
    )
    try:
        chat = LlmChat(
            api_key=EMERGENT_LLM_KEY,
            session_id=f"cms-translate-{uuid.uuid4().hex}",
            system_message=system,
        ).with_model("openai", "gpt-4o-mini")
        resp = await chat.send_message(UserMessage(text=prompt))
    except Exception as e:
        logger.error(f"translate failed: {e}")
        raise HTTPException(502, "Translation provider error")

    out: Dict[str, str] = {}
    try:
        m = re.search(r"\{.*\}", resp, re.S)
        data = _json.loads(m.group(0)) if m else {}
        for t in targets:
            val = data.get(t)
            if val:
                out[t] = str(val).strip()
    except Exception as e:
        logger.error(f"translate parse failed: {e} | raw={resp[:200]}")
    return {"translations": out}



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


# Guarantee CMS data (image/text slots, pricing, etc.) is NEVER served stale.
# Without this, the published site can hand a browser a cached /api/slots or
# /api/text_slots response, making freshly-saved edits appear to "revert" on
# refresh or on another device. Image binaries under /api/files & /api/uploads
# keep their own long cache for performance.
@app.middleware("http")
async def no_store_for_dynamic_api(request, call_next):
    response = await call_next(request)
    path = request.url.path
    if path.startswith("/api/") and not (
        path.startswith("/api/files/") or path.startswith("/api/uploads/")
    ):
        response.headers["Cache-Control"] = "no-store, no-cache, must-revalidate, max-age=0"
        response.headers["Pragma"] = "no-cache"
        response.headers["Expires"] = "0"
    return response

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
    # Index for fast duplicate detection on the library/files collection.
    try:
        await db.files.create_index("sha256")
    except Exception as exc:
        logger.error("files.sha256 index creation failed: %s", exc)
