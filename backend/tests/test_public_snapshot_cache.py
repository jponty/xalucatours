"""Offline checks for bounded, single-flight public snapshots."""

import asyncio

import pytest

from public_snapshot_cache import PublicSnapshotCache


@pytest.fixture
def anyio_backend():
    return "asyncio"


@pytest.mark.anyio
async def test_parallel_requests_share_one_load():
    cache = PublicSnapshotCache(ttl_seconds=30)
    calls = 0

    async def load():
        nonlocal calls
        calls += 1
        await asyncio.sleep(0.01)
        return {"items": [1, 2, 3]}

    results = await asyncio.gather(*(cache.get("manifest", load) for _ in range(40)))
    assert calls == 1
    assert all(result == results[0] for result in results)


@pytest.mark.anyio
async def test_expired_or_invalidated_snapshot_reloads():
    cache = PublicSnapshotCache(ttl_seconds=0)
    calls = 0

    async def load():
        nonlocal calls
        calls += 1
        return calls

    assert await cache.get("manifest", load) == 1
    assert await cache.get("manifest", load) == 2
    cache.ttl_seconds = 30
    assert await cache.get("manifest", load) == 3
    cache.invalidate("manifest")
    assert await cache.get("manifest", load) == 4


@pytest.mark.anyio
async def test_failed_load_is_not_cached():
    cache = PublicSnapshotCache(ttl_seconds=30)
    calls = 0

    async def load():
        nonlocal calls
        calls += 1
        if calls == 1:
            raise RuntimeError("temporary failure")
        return "ok"

    with pytest.raises(RuntimeError):
        await cache.get("manifest", load)
    assert await cache.get("manifest", load) == "ok"
    assert calls == 2
