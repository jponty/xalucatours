"""One-way mirror of MongoDB + Emergent Object Storage into Supabase.

MongoDB and Emergent Object Storage remain the PRIMARY / live system. This
module copies, on demand from /admin, a COMPLETE snapshot into Supabase:

  * Postgres: one table per Mongo collection -> mirror_<collection>
      (id text PK, data jsonb, updated_at timestamptz)
  * Storage:  every image object, uploaded to a PUBLIC bucket under the
      SAME path it uses in Emergent (e.g. xaluca/slots/.../uuid.jpg)

Nothing here writes back to Mongo/Emergent except a tiny local bookkeeping
collection (`supabase_synced_objects`) that makes the image sync resumable.
"""

from __future__ import annotations

import os
import re
import json
import asyncio
import logging
from datetime import datetime, timezone

from storage import get_object

logger = logging.getLogger(__name__)

# Site content — always mirrored.
CONTENT_COLLECTIONS = [
    "text_slots", "image_slots", "files", "day_galleries", "contests",
    "config", "app_settings", "library_locations", "image_slot_registry",
    "text_slot_registry", "remote_image_registry", "unsplash_locations",
    "program_downloads",
]
# Personal data — mirrored ONLY when include_personal_data is requested.
PERSONAL_COLLECTIONS = ["contest_participants", "contact_requests", "trip_planner_requests"]

_FILES_URL_RE = re.compile(r"^(?:https?://[^/]+)?/api/files/(.+?)(?:\?.*)?$", re.IGNORECASE)

_client = None          # cached Supabase client (Storage)
_pool = None            # cached asyncpg pool (Postgres)
_JOB = None             # in-process live job snapshot


# ---------------- configuration (read lazily so .env is loaded first) ----------------
def project_url():
    return os.environ.get("SUPABASE_URL")


def _service_key():
    return os.environ.get("SUPABASE_SERVICE_ROLE_KEY")


def _db_url():
    return os.environ.get("SUPABASE_DB_URL")


def bucket_name():
    return os.environ.get("SUPABASE_STORAGE_BUCKET", "xaluca")


def is_configured() -> bool:
    return bool(project_url() and _service_key() and _db_url())


def is_running() -> bool:
    return bool(_JOB and _JOB.get("running"))


# ---------------- helpers ----------------
def _now() -> str:
    return datetime.now(timezone.utc).isoformat()


def _json_safe(v):
    from bson import ObjectId
    if isinstance(v, ObjectId):
        return str(v)
    if isinstance(v, datetime):
        return v.isoformat()
    if isinstance(v, dict):
        return {k: _json_safe(x) for k, x in v.items()}
    if isinstance(v, (list, tuple)):
        return [_json_safe(x) for x in v]
    if isinstance(v, bytes):
        return v.decode("utf-8", "replace")
    return v


def _table_for(coll: str) -> str:
    return "mirror_" + re.sub(r"[^a-z0-9_]", "_", coll.lower())


# ---------------- Supabase Storage (sync client -> run in a thread) ----------------
def _sb():
    global _client
    if _client is None:
        from supabase import create_client
        _client = create_client(project_url(), _service_key())
    return _client


def ensure_bucket():
    c = _sb()
    name = bucket_name()
    try:
        existing = c.storage.list_buckets()
        names = set()
        for b in existing or []:
            n = getattr(b, "name", None)
            if n is None and isinstance(b, dict):
                n = b.get("name")
            if n:
                names.add(n)
    except Exception as exc:
        logger.warning("supabase list_buckets failed: %s", exc)
        names = set()
    if name not in names:
        c.storage.create_bucket(name, options={"public": True})


def upload_object(path: str, data: bytes, content_type: str):
    c = _sb()
    c.storage.from_(bucket_name()).upload(
        path=path,
        file=data,
        file_options={
            "content-type": content_type or "application/octet-stream",
            "upsert": "true",
            "cache-control": "31536000",
        },
    )


# ---------------- Supabase Postgres (asyncpg via transaction pooler) ----------------
async def _get_pool():
    global _pool
    if _pool is None:
        import asyncpg
        _pool = await asyncpg.create_pool(
            _db_url(),
            statement_cache_size=0,   # REQUIRED for the transaction pooler
            min_size=1, max_size=4, command_timeout=120,
        )
    return _pool


async def _ensure_table(conn, table):
    await conn.execute(
        f'CREATE TABLE IF NOT EXISTS "{table}" ('
        f'id text PRIMARY KEY, data jsonb NOT NULL, '
        f'updated_at timestamptz NOT NULL DEFAULT now())'
    )


async def _upsert_batch(conn, table, batch):
    await conn.executemany(
        f'INSERT INTO "{table}" (id, data, updated_at) '
        f'VALUES ($1, $2::jsonb, now()) '
        f'ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data, updated_at = now()',
        batch,
    )


async def _mirror_collection(db, coll, job):
    pool = await _get_pool()
    table = _table_for(coll)
    total = await db[coll].count_documents({})
    job["db"][coll] = {"total": total, "done": 0}
    async with pool.acquire() as conn:
        await _ensure_table(conn, table)
        batch = []
        async for doc in db[coll].find({}):
            _id = str(doc.get("_id"))
            batch.append((_id, json.dumps(_json_safe(doc), ensure_ascii=False, default=str)))
            if len(batch) >= 500:
                await _upsert_batch(conn, table, batch)
                job["db"][coll]["done"] += len(batch)
                batch = []
        if batch:
            await _upsert_batch(conn, table, batch)
            job["db"][coll]["done"] += len(batch)


# ---------------- image path collection ----------------
def _extract_paths(obj, out):
    if isinstance(obj, str):
        m = _FILES_URL_RE.match(obj)
        if m:
            out.add(m.group(1))
    elif isinstance(obj, dict):
        for v in obj.values():
            _extract_paths(v, out)
    elif isinstance(obj, (list, tuple)):
        for v in obj:
            _extract_paths(v, out)


async def _collect_paths(db):
    """Every storage object referenced anywhere: the files library master list
    plus any /api/files/... path embedded in slots/galleries/config."""
    paths = set()
    ctmap = {}
    async for f in db.files.find({}, {"storage_path": 1, "content_type": 1}):
        sp = f.get("storage_path")
        if sp:
            paths.add(sp)
            if f.get("content_type"):
                ctmap[sp] = f["content_type"]
    for coll in ("image_slots", "day_galleries", "config", "app_settings", "remote_image_registry"):
        async for doc in db[coll].find({}):
            _extract_paths(doc, paths)
    return paths, ctmap


async def _sync_one(db, path, content_type, force, job):
    st = job["storage"]
    try:
        if not force:
            ex = await db.supabase_synced_objects.find_one({"_id": path}, {"_id": 1})
            if ex:
                st["skipped"] += 1
                st["done"] += 1
                return
        data, ct = await asyncio.to_thread(get_object, path)
        ct = content_type or ct or "application/octet-stream"
        last = None
        for attempt in range(3):
            try:
                await asyncio.to_thread(upload_object, path, data, ct)
                last = None
                break
            except Exception as exc:
                last = exc
                await asyncio.sleep(0.6 * (attempt + 1))
        if last:
            raise last
        await db.supabase_synced_objects.update_one(
            {"_id": path},
            {"$set": {"synced_at": _now(), "size": len(data), "content_type": ct}},
            upsert=True,
        )
        st["uploaded"] += 1
        st["done"] += 1
    except Exception as exc:
        st["errors"] += 1
        st["done"] += 1
        st["last_error"] = f"{path}: {str(exc)[:200]}"
        logger.warning("supabase storage sync failed for %s: %s", path, exc)


# ---------------- persistence + status ----------------
async def _persist(db, job):
    try:
        await db.supabase_sync_state.update_one(
            {"_id": "job"}, {"$set": dict(job)}, upsert=True
        )
    except Exception as exc:
        logger.debug("persist job state failed: %s", exc)


async def get_status(db):
    if _JOB is not None:
        return dict(_JOB)
    doc = await db.supabase_sync_state.find_one({"_id": "job"})
    if doc:
        doc.pop("_id", None)
        return doc
    return {"running": False, "never_run": True}


# ---------------- orchestration ----------------
async def run_sync(db, include_personal=False, do_db=True, do_storage=True, force=False):
    global _JOB
    concurrency = int(os.environ.get("SUPABASE_SYNC_CONCURRENCY", "4"))
    _JOB = {
        "running": True,
        "phase": "starting",
        "started_at": _now(),
        "finished_at": None,
        "error": None,
        "include_personal": bool(include_personal),
        "force": bool(force),
        "db": {},
        "storage": {"total": 0, "done": 0, "uploaded": 0, "skipped": 0, "errors": 0, "last_error": None},
    }
    job = _JOB
    await _persist(db, job)
    try:
        if do_db:
            job["phase"] = "db"
            collections = list(CONTENT_COLLECTIONS)
            if include_personal:
                collections += PERSONAL_COLLECTIONS
            for coll in collections:
                await _mirror_collection(db, coll, job)
                await _persist(db, job)

        if do_storage:
            job["phase"] = "storage"
            await asyncio.to_thread(ensure_bucket)
            paths, ctmap = await _collect_paths(db)
            paths = sorted(paths)
            job["storage"]["total"] = len(paths)
            await _persist(db, job)
            sem = asyncio.Semaphore(concurrency)
            counter = {"n": 0}

            async def worker(p):
                async with sem:
                    await _sync_one(db, p, ctmap.get(p), force, job)
                    counter["n"] += 1
                    if counter["n"] % 25 == 0:
                        await _persist(db, job)

            await asyncio.gather(*(worker(p) for p in paths))
            await _persist(db, job)

        job["phase"] = "done"
        job["running"] = False
        job["finished_at"] = _now()
    except Exception as exc:
        logger.exception("supabase sync failed")
        job["phase"] = "error"
        job["running"] = False
        job["error"] = str(exc)[:400]
        job["finished_at"] = _now()
    finally:
        await _persist(db, job)
        snapshot = dict(job)
        _JOB = None   # release the in-process guard; status falls back to the persisted doc
    return snapshot
