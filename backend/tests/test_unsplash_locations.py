"""Regression test for the Unsplash 429 fix.

Guarantees a single search/featured response never makes more than
UNSPLASH_LOC_MAX_FETCHES new single-photo location calls, while still
attaching every location that is already cached for free.
"""
import asyncio
import types
from unittest.mock import AsyncMock

import server


def _run(coro):
    return asyncio.get_event_loop().run_until_complete(coro)


def test_attach_locations_caps_api_calls(monkeypatch):
    # 24 photos, none cached -> only the first 6 should hit the API.
    photos = [{"id": f"id{i}"} for i in range(24)]

    # No persistent cache hits.
    fake_find = AsyncMock(return_value=None)
    monkeypatch.setattr(server.db, "unsplash_locations",
                        types.SimpleNamespace(find_one=fake_find, update_one=AsyncMock()))
    # Clear hot cache so nothing is pre-cached.
    server._unsplash_loc_cache.clear()

    calls = {"n": 0}

    async def fake_get(path, params=None):
        calls["n"] += 1
        return {"location": {"name": f"Place {path}"}}

    monkeypatch.setattr(server, "_unsplash_get", fake_get)

    _run(server._attach_locations(photos))

    assert calls["n"] == server.UNSPLASH_LOC_MAX_FETCHES == 6
    with_loc = [p for p in photos if p.get("location")]
    assert len(with_loc) == 6  # only the budgeted ones got a location


def test_cached_locations_are_free(monkeypatch):
    # All 24 photos already in the persistent cache -> ZERO API calls,
    # yet every photo still receives its location.
    photos = [{"id": f"c{i}"} for i in range(24)]
    server._unsplash_loc_cache.clear()

    async def fake_find_one(q):
        return {"_id": q["_id"], "location": {"display": "Cached City"}}

    monkeypatch.setattr(server.db, "unsplash_locations",
                        types.SimpleNamespace(find_one=fake_find_one, update_one=AsyncMock()))

    calls = {"n": 0}

    async def fake_get(path, params=None):
        calls["n"] += 1
        return {}

    monkeypatch.setattr(server, "_unsplash_get", fake_get)

    _run(server._attach_locations(photos))

    assert calls["n"] == 0  # cache hits cost no quota
    assert all(p.get("location") for p in photos)
