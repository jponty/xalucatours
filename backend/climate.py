"""Public, fixed-location weather proxy. No visitor data is sent to providers.

MET Norway: hourly model estimates, not station observations.
NASA POWER: monthly historical averages, never used as current weather.
"""
import asyncio
import calendar
import logging
import math
import os
from dataclasses import dataclass
from datetime import datetime, timedelta, timezone
from email.utils import parsedate_to_datetime

import httpx
from fastapi import Response

LOG = logging.getLogger(__name__)
UTC = timezone.utc
MET_URL = "https://api.met.no/weatherapi/locationforecast/2.0/compact"
NASA_URL = "https://power.larc.nasa.gov/api/temporal/monthly/point"
NORMAL_START, NORMAL_END = 1991, 2020
DESTINATIONS = (
    ("merzouga", "Merzouga", 31.0995, -4.0128),
    ("arfoud", "Arfoud", 31.4361, -4.2328),
    ("ouarzazate", "Ouarzazate", 30.9189, -6.8934),
    ("dades", "Boumalne Dades", 31.3725, -5.9888),
    ("zagora", "Zagora", 30.3314, -5.8372),
    ("marrakech", "Marrakech", 31.6295, -7.9811),
    ("atlas", "Alto Atlas · Imlil", 31.1357, -7.9194),
)
REGION_POINTS = (
    ("sahara", "Merzouga", 31.0995, -4.0128),
    ("marrakech", "Marrakech", 31.6295, -7.9811),
    ("atlas", "Imlil", 31.1357, -7.9194),
    ("north", "Chefchaouen", 35.1688, -5.2636),
    ("coast", "Essaouira", 31.5085, -9.7595),
)


def utcnow():
    return datetime.now(UTC)


def iso(value):
    return value.isoformat().replace("+00:00", "Z")


def instant(value):
    return datetime.fromisoformat(value.replace("Z", "+00:00")).astimezone(UTC)


def number(value, low=-100, high=100):
    if isinstance(value, bool) or not isinstance(value, (int, float)):
        return None
    return float(value) if math.isfinite(value) and low <= value <= high else None


def apparent_temperature(temp, humidity, wind_ms):
    """BOM/Steadman non-radiation approximation, wind at 10 m (m/s)."""
    if None in (temp, humidity, wind_ms):
        return None
    vapour = humidity / 100 * 6.105 * math.exp(17.27 * temp / (237.7 + temp))
    return round(temp + .33 * vapour - .70 * wind_ms - 4, 1)


def normalize_forecast(raw, now):
    properties = raw["properties"]
    units = properties["meta"]["units"]
    if units.get("air_temperature") != "celsius" or units.get("wind_speed") != "m/s":
        raise ValueError("Unexpected weather units")
    rows = [(instant(item["time"]), item["data"]) for item in properties["timeseries"]]
    stamp, data = min(rows, key=lambda item: abs((item[0] - now).total_seconds()))
    if abs(stamp - now) > timedelta(minutes=90):
        raise ValueError("No current forecast hour")
    details = data["instant"]["details"]
    temp = number(details.get("air_temperature"))
    if temp is None:
        raise ValueError("Missing temperature")
    humidity = number(details.get("relative_humidity"), 0, 100)
    wind = number(details.get("wind_speed"), 0, 150)
    horizon = [(t, number(d["instant"]["details"].get("air_temperature")))
               for t, d in rows if stamp <= t <= stamp + timedelta(hours=24)]
    # Don't label an incomplete provider horizon as a 24-hour range.
    temps = [v for _, v in horizon if v is not None]
    complete = horizon and horizon[-1][0] >= stamp + timedelta(hours=23) and len(temps) >= 8
    symbol = data.get("next_1_hours", {}).get("summary", {}).get("symbol_code")
    if not symbol:
        symbol = data.get("next_6_hours", {}).get("summary", {}).get("symbol_code")
    updated = instant(properties["meta"]["updated_at"])
    if now - updated > timedelta(hours=24):
        raise ValueError("Forecast model too old")
    return {
        "temperature": temp, "feels_like": apparent_temperature(temp, humidity, wind),
        "humidity": humidity, "wind_kmh": round(wind * 3.6, 1) if wind is not None else None,
        "symbol": symbol, "high": max(temps) if complete else None,
        "low": min(temps) if complete else None, "valid_at": iso(stamp),
        "updated_at": iso(updated), "model_old": now - updated > timedelta(hours=12),
    }


def normalize_normals(raw):
    parameters = raw["properties"]["parameter"]
    units = raw["parameters"]
    keys = ("T2M_MAX_AVG", "T2M_MIN_AVG")
    if any(units[key]["units"] != "C" for key in keys):
        raise ValueError("Unexpected climate units")
    months = []
    for index in range(1, 13):
        totals, days = [0., 0.], 0
        for year in range(NORMAL_START, NORMAL_END + 1):
            stamp = f"{year}{index:02d}"
            high, low = (number(parameters[key].get(stamp)) for key in keys)
            if high is None or low is None or high < low:
                raise ValueError("Incomplete climate averages")
            weight = calendar.monthrange(year, index)[1]
            totals[0] += high * weight
            totals[1] += low * weight
            days += weight
        months.append({"month": index, "high": round(totals[0] / days, 1), "low": round(totals[1] / days, 1)})
    return {"months": months, "period": f"{NORMAL_START}–{NORMAL_END}",
            "grid_elevation": raw.get("geometry", {}).get("coordinates", [0, 0, None])[2]}


@dataclass
class Entry:
    raw: dict | None = None
    checked_at: datetime | None = None
    retry_at: datetime | None = None
    modified: str | None = None
    failed: bool = False


class ClimateService:
    def __init__(self):
        self.cache = {}
        self.locks = {}
        self.semaphore = asyncio.Semaphore(3)

    async def fetch(self, provider, point, client):
        key = (provider, point[0])
        async with self.locks.setdefault(key, asyncio.Lock()):
            entry = self.cache.setdefault(key, Entry())
            now = utcnow()
            if entry.retry_at and now < entry.retry_at:
                return entry
            headers = {}
            if entry.modified and provider == "met":
                headers["If-Modified-Since"] = entry.modified
            params = {"lat": point[2], "lon": point[3]} if provider == "met" else {
                "latitude": point[2], "longitude": point[3], "community": "RE", "format": "JSON",
                "parameters": "T2M_MAX_AVG,T2M_MIN_AVG",
                "start": NORMAL_START, "end": NORMAL_END,
            }
            response = None
            try:
                async with self.semaphore:
                    response = await client.get(MET_URL if provider == "met" else NASA_URL,
                                                params=params, headers=headers)
                if response.status_code == 304 and entry.raw:
                    raw = entry.raw
                else:
                    response.raise_for_status()
                    raw = response.json()
                # Validate before replacing a good cached response.
                (normalize_forecast(raw, now) if provider == "met" else normalize_normals(raw))
                entry.raw, entry.checked_at, entry.failed = raw, now, False
                entry.modified = response.headers.get("Last-Modified", entry.modified)
                deadline = now + (timedelta(minutes=15) if provider == "met" else timedelta(days=7))
                if provider == "met" and response.headers.get("Expires"):
                    deadline = parsedate_to_datetime(response.headers["Expires"]).astimezone(UTC)
                entry.retry_at = max(now + timedelta(minutes=1), deadline)
            except (httpx.HTTPError, ValueError, KeyError, TypeError, IndexError):
                entry.failed = True
                delay = timedelta(minutes=5)
                if response is not None and response.status_code in (403, 429):
                    delay = timedelta(hours=1)
                    retry = response.headers.get("Retry-After", "")
                    try:
                        delay = max(delay, timedelta(seconds=int(retry)) if retry.isdigit()
                                    else parsedate_to_datetime(retry).astimezone(UTC) - now)
                    except (ValueError, TypeError):
                        pass
                entry.retry_at = now + delay
                LOG.warning("Climate provider unavailable: %s/%s", provider, point[0])
            return entry

    async def report(self, provider):
        points = DESTINATIONS if provider == "met" else REGION_POINTS
        ua = os.getenv("WEATHER_USER_AGENT", "XalucaToursClimate/1.0 (https://xalucatours.com/contacto; xalucatours@xaluca.com)")
        async with httpx.AsyncClient(timeout=15, follow_redirects=True,
                                     headers={"User-Agent": ua, "Accept": "application/json"}) as client:
            entries = await asyncio.gather(*(self.fetch(provider, point, client) for point in points))
        now, items = utcnow(), []
        for point, entry in zip(points, entries):
            item = {"id": point[0], "name": point[1], "status": "unavailable"}
            try:
                max_age = timedelta(hours=24) if provider == "met" else timedelta(days=30)
                if not entry.raw or not entry.checked_at or now - entry.checked_at > max_age:
                    raise ValueError("Cache expired")
                data = normalize_forecast(entry.raw, now) if provider == "met" else normalize_normals(entry.raw)
                item.update(data, checked_at=iso(entry.checked_at),
                            status="stale" if entry.failed or data.get("model_old") else "ok")
            except (ValueError, KeyError, TypeError, IndexError):
                pass
            items.append(item)
        return {"source": "MET Norway" if provider == "met" else "NASA POWER",
                "timezone": "Africa/Casablanca", "generated_at": iso(now), "locations": items}


service = ClimateService()


def register_climate_routes(router):
    @router.get("/climate/current")
    async def current_weather(response: Response):
        response.headers["Cache-Control"] = "public, max-age=60"
        return await service.report("met")

    @router.get("/climate/normals")
    async def climate_normals(response: Response):
        response.headers["Cache-Control"] = "public, max-age=300"
        return await service.report("nasa")
