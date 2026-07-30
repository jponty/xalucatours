"""Dry-run: full SHA-256 (origin+dest), sizes, final URL and result
(MISSING/IDENTICAL/DIFFERENT) for representative objects. Uploads NOTHING.

Also probes a guaranteed-missing key to learn Supabase's real 'not found'
HTTP status, and reports live counts (active files / existing / missing sample).
"""
import os, re, sys, hashlib, asyncio, requests
from urllib.parse import quote

sys.path.insert(0, "/app/backend")

ENV = open("/app/backend/.env").read()
def ev(k):
    m = re.search(rf"^{k}=(\S+)", ENV, re.M)
    return m.group(1).strip('"') if m else None

for _line in ENV.splitlines():
    _line = _line.strip()
    if _line and not _line.startswith("#") and "=" in _line:
        _k, _v = _line.split("=", 1)
        os.environ.setdefault(_k.strip(), _v.strip().strip('"'))

from motor.motor_asyncio import AsyncIOMotorClient
from storage import get_object

MONGO_URL = ev("MONGO_URL"); DB_NAME = ev("DB_NAME")
SB_URL = ev("SUPABASE_URL")
BUCKET = ev("SUPABASE_STORAGE_BUCKET") or "xaluca"

def sha256(b): return hashlib.sha256(b).hexdigest()

def enc(path):
    # percent-encode every segment (handles spaces, accents, #, ?, &, etc.)
    return "/".join(quote(part, safe="") for part in path.split("/"))

def dest_url(path):
    # key inside bucket == full storage_path (already begins with 'xaluca/')
    return f"{SB_URL}/storage/v1/object/public/{BUCKET}/{enc(path)}"

def head_existing(path):
    """Return (state, dest_sha, dest_size). state in EXISTS/MISSING.
    Any non-200/404 HTTP status is an ERROR (raised), never 'missing'."""
    r = requests.get(dest_url(path), timeout=90)
    if r.status_code == 200:
        return "EXISTS", sha256(r.content), len(r.content)
    if r.status_code in (400, 404):
        # Supabase public endpoint returns 400 w/ {"error":"not_found"} OR 404.
        body = (r.text or "").lower()
        if r.status_code == 404 or "not_found" in body or "not found" in body:
            return "MISSING", None, None
    raise RuntimeError(f"Supabase HTTP {r.status_code}: {r.text[:200]}")

def is_active(f):
    v = f.get("is_deleted")
    return str(v).strip().lower() not in ("true", "1")

async def main():
    db = AsyncIOMotorClient(MONGO_URL)[DB_NAME]

    # ---- 0. probe a guaranteed-missing key ----
    probe = "xaluca/__export_probe__/does-not-exist-xyz.bin"
    try:
        state, _, _ = head_existing(probe)
        print(f"[probe] missing-key '{probe}' -> {state}")
    except Exception as e:
        print(f"[probe] missing-key raised (unexpected status): {e}")
    print()

    # ---- 1. live counts ----
    total = await db.files.count_documents({})
    active = 0
    async for f in db.files.find({}, {"is_deleted": 1}):
        if is_active(f):
            active += 1
    print(f"files docs total={total} active={active} (inactive={total-active})")
    print(f"supabase_synced_objects bookkeeping={await db.supabase_synced_objects.count_documents({})}")
    print()

    # ---- 2. representative samples: full detail ----
    picks = []
    for pref, n in (("xaluca/library/", 2), ("xaluca/slots/", 2), ("xaluca/day-galleries/", 1)):
        async for f in db.files.find({"storage_path": {"$regex": "^" + re.escape(pref)}}).limit(n):
            picks.append(f)

    for i, f in enumerate(picks, 1):
        sp = f["storage_path"]
        print(f"--- SAMPLE {i} ---")
        print(f"storage_path : {sp}")
        print(f"final URL    : {dest_url(sp)}")
        try:
            data, ct = await asyncio.to_thread(get_object, sp)
            s_sha, s_sz = sha256(data), len(data)
        except Exception as e:
            print(f"SOURCE ERROR : {str(e)[:120]}")
            print()
            continue
        try:
            state, d_sha, d_sz = head_existing(sp)
        except Exception as e:
            print(f"DEST CHECK ERROR: {str(e)[:120]}")
            print()
            continue
        result = state if state == "MISSING" else ("IDENTICAL" if d_sha == s_sha else "DIFFERENT")
        print(f"origin  size={s_sz:>10}  sha256={s_sha}")
        if state == "EXISTS":
            print(f"dest    size={d_sz:>10}  sha256={d_sha}")
        else:
            print(f"dest    size={'—':>10}  sha256=—")
        print(f"RESULT       : {result}")
        print()

asyncio.run(main())
