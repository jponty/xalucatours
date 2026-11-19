"""Short-lived, single-flight cache for expensive public database snapshots."""

import asyncio
import time


class PublicSnapshotCache:
    def __init__(self, ttl_seconds=5):
        self.ttl_seconds = ttl_seconds
        self._entries = {}
        self._lock = asyncio.Lock()

    async def get(self, key, loader):
        now = time.monotonic()
        entry = self._entries.get(key)
        if entry and now < entry[0]:
            return entry[1]
        # Hold the lock while loading: different large snapshots must not be
        # materialized concurrently on a small API instance.
        async with self._lock:
            now = time.monotonic()
            entry = self._entries.get(key)
            if entry and now < entry[0]:
                return entry[1]
            value = await loader()
            self._entries[key] = (time.monotonic() + self.ttl_seconds, value)
            return value

    def invalidate(self, *keys):
        for key in keys:
            self._entries.pop(key, None)
