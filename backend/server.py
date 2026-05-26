from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import asyncio
import httpx
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
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


app.include_router(api_router)

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
