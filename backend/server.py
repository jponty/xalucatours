from fastapi import FastAPI, APIRouter, HTTPException, UploadFile, File
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
    url: str = Field(..., min_length=4, max_length=2000)
    alt: Optional[str] = Field(default=None, max_length=300)
    source: Optional[str] = Field(default="external", max_length=40)


@api_router.get("/slots/{slot_id}")
async def get_slot(slot_id: str):
    doc = await db.image_slots.find_one({"_id": slot_id}, {"_id": 0})
    if not doc:
        return {"slot_id": slot_id, "url": None}
    return {"slot_id": slot_id, **doc}


@api_router.put("/slots/{slot_id}")
async def put_slot(slot_id: str, payload: SlotPayload):
    doc = {
        "url": payload.url,
        "alt": payload.alt,
        "source": payload.source or "external",
        "updated_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.image_slots.update_one(
        {"_id": slot_id},
        {"$set": doc},
        upsert=True,
    )
    return {"slot_id": slot_id, **doc}


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

    UPLOAD_DIR_LOCAL = ROOT_DIR / "uploads"
    UPLOAD_DIR_LOCAL.mkdir(exist_ok=True)

    ext = {
        "image/jpeg": "jpg",
        "image/png": "png",
        "image/webp": "webp",
        "image/avif": "avif",
    }[file.content_type]
    safe_slot = "".join(c for c in slot_id if c.isalnum() or c in "._-")[:60] or "slot"
    filename = f"{safe_slot}-{uuid.uuid4().hex[:10]}.{ext}"
    target = UPLOAD_DIR_LOCAL / filename
    target.write_bytes(data)

    public_url = f"/api/uploads/{filename}"
    doc = {
        "url": public_url,
        "alt": None,
        "source": "upload",
        "updated_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.image_slots.update_one(
        {"_id": slot_id},
        {"$set": doc},
        upsert=True,
    )
    return {"slot_id": slot_id, **doc, "filename": filename}


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

# Serve uploaded files under /api/uploads so they pass through the ingress
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
