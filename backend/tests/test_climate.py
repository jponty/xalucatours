import asyncio
from datetime import datetime, timedelta, timezone
from email.utils import format_datetime

import httpx
import pytest
from fastapi import APIRouter, FastAPI
from fastapi.testclient import TestClient

import climate

NOW = datetime(2026, 9, 18, 12, 20, tzinfo=timezone.utc)


def forecast():
    rows = []
    for hour in range(36):
        rows.append({"time": climate.iso(NOW.replace(minute=0) + timedelta(hours=hour)), "data": {
            "instant": {"details": {"air_temperature": 20 + hour % 10, "relative_humidity": 50, "wind_speed": 2}},
            "next_1_hours": {"summary": {"symbol_code": "clearsky_day"}},
        }})
    return {"properties": {"meta": {"updated_at": climate.iso(NOW - timedelta(hours=1)),
            "units": {"air_temperature": "celsius", "wind_speed": "m/s"}}, "timeseries": rows}}


def normals():
    return {"properties": {"parameter": {
        "T2M_MAX_AVG": {f"{year}{month:02d}": 19 + month for year in range(1991, 2021) for month in range(1, 13)},
        "T2M_MIN_AVG": {f"{year}{month:02d}": 4 + month for year in range(1991, 2021) for month in range(1, 13)},
    }}, "parameters": {key: {"units": "C"} for key in ("T2M_MAX_AVG", "T2M_MIN_AVG")},
        "header": {"range": "2001–2020"}, "geometry": {"coordinates": [-4, 31, 700]}}


@pytest.fixture(autouse=True)
def clock(monkeypatch):
    monkeypatch.setattr(climate, "utcnow", lambda: NOW)


def test_weather_units_current_hour_and_next_day_range():
    data = climate.normalize_forecast(forecast(), NOW)
    assert data["temperature"] == 20
    assert data["valid_at"] == "2026-09-18T12:00:00Z"
    assert data["wind_kmh"] == 7.2
    assert data["humidity"] == 50
    assert data["high"] == 29 and data["low"] == 20
    assert data["feels_like"] == pytest.approx(18.4, abs=.1)
    assert not data["model_old"]


def test_missing_optional_values_are_not_zero_and_no_partial_24h_range():
    raw = forecast()
    raw["properties"]["timeseries"] = raw["properties"]["timeseries"][:2]
    raw["properties"]["timeseries"][0]["data"]["instant"]["details"].pop("relative_humidity")
    result = climate.normalize_forecast(raw, NOW)
    assert result["feels_like"] is None and result["humidity"] is None
    assert result["high"] is None and result["low"] is None


def test_expired_model_or_invalid_units_never_shown_as_current():
    with pytest.raises(ValueError):
        climate.normalize_forecast(forecast(), NOW + timedelta(days=3))
    raw = forecast()
    raw["properties"]["meta"]["units"]["air_temperature"] = "fahrenheit"
    with pytest.raises(ValueError):
        climate.normalize_forecast(raw, NOW)


def test_normals_are_daily_averages_not_extreme_temperatures():
    raw = normals()
    data = climate.normalize_normals(raw)
    assert len(data["months"]) == 12 and data["period"] == "1991–2020"
    assert data["months"][0] == {"month": 1, "high": 20., "low": 5.}
    raw["properties"]["parameter"]["T2M_MIN_AVG"]["199101"] = -999
    with pytest.raises(ValueError):
        climate.normalize_normals(raw)


def test_cache_expires_conditional_requests_and_single_flight():
    async def check():
        service, calls = climate.ClimateService(), []
        modified = format_datetime(NOW - timedelta(hours=1), usegmt=True)
        async def handler(request):
            calls.append(request)
            return httpx.Response(200 if len(calls) == 1 else 304, json=forecast(), headers={
                "Expires": format_datetime(NOW + timedelta(minutes=45), usegmt=True), "Last-Modified": modified})
        async with httpx.AsyncClient(transport=httpx.MockTransport(handler)) as client:
            await asyncio.gather(*(service.fetch("met", climate.DESTINATIONS[0], client) for _ in range(6)))
            assert len(calls) == 1
            entry = service.cache[("met", "merzouga")]
            assert entry.retry_at == NOW + timedelta(minutes=45)
            entry.retry_at = NOW
            await service.fetch("met", climate.DESTINATIONS[0], client)
            assert len(calls) == 2 and calls[-1].headers["if-modified-since"] == modified
            assert entry.raw == forecast() and not entry.failed
    asyncio.run(check())


@pytest.mark.parametrize("status", [403, 429, 500])
def test_outage_backoff_prevents_provider_hammering(status):
    async def check():
        service, calls = climate.ClimateService(), []
        def handler(request):
            calls.append(request)
            return httpx.Response(status, headers={"Retry-After": "7200"})
        async with httpx.AsyncClient(transport=httpx.MockTransport(handler)) as client:
            first = await service.fetch("met", climate.DESTINATIONS[0], client)
            await service.fetch("met", climate.DESTINATIONS[0], client)
            assert first.failed and first.raw is None and len(calls) == 1
            assert first.retry_at >= NOW + timedelta(minutes=5)
            if status in (403, 429):
                assert first.retry_at == NOW + timedelta(hours=2)
    asyncio.run(check())


def test_api_partial_failure_stale_data_and_all_fixed_destinations(monkeypatch):
    service = climate.ClimateService()
    async def fetch(provider, point, client):
        if point[0] == "arfoud":
            return climate.Entry(failed=True)
        return climate.Entry(raw=forecast() if provider == "met" else normals(), checked_at=NOW,
                             failed=point[0] == "atlas")
    monkeypatch.setattr(service, "fetch", fetch)
    monkeypatch.setattr(climate, "service", service)
    app, router = FastAPI(), APIRouter(prefix="/api")
    climate.register_climate_routes(router)
    app.include_router(router)
    client = TestClient(app)
    result = client.get("/api/climate/current")
    assert result.status_code == 200
    items = {item["id"]: item for item in result.json()["locations"]}
    assert len(items) == 7
    assert items["merzouga"]["status"] == "ok"
    assert items["atlas"]["status"] == "stale"
    assert items["arfoud"]["status"] == "unavailable" and "temperature" not in items["arfoud"]
    assert len(client.get("/api/climate/normals").json()["locations"]) == 5


def test_cached_data_beyond_max_age_is_hidden(monkeypatch):
    service = climate.ClimateService()
    async def fetch(provider, point, client):
        return climate.Entry(raw=forecast(), checked_at=NOW - timedelta(days=2))
    monkeypatch.setattr(service, "fetch", fetch)
    result = asyncio.run(service.report("met"))
    assert all(item["status"] == "unavailable" for item in result["locations"])
