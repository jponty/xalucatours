"""Dry-run sample: show destination URLs + validate SHA-256 conflict logic
for 3-5 representative objects BEFORE the full migration. Uploads nothing."""
import os, re, sys, hashlib, asyncio, requests
sys.path.insert(0, "/app/backend")

ENV = open("/app/backend/.env").read()
def ev(k):
    m = re.search(rf"^{k}=(\S+)", ENV, re.M)
    return m.group(1).strip('"') if m else None

# Load .env into the process environment so storage.init_storage() sees the key.
for _line in ENV.splitlines():
    _line = _line.strip()
    if _line and not _line.startswith("#") and "=" in _line:
        _k, _v = _line.split("=", 1)
        os.environ.setdefault(_k.strip(), _v.strip().strip('"'))

from motor.motor_asyncio import AsyncIOMotorClient
from storage import get_object

MONGO_URL = ev("MONGO_URL"); DB_NAME = ev("DB_NAME")
SB_URL = ev("SUPABASE_URL"); SB_KEY = ev("SUPABASE_SERVICE_ROLE_KEY")
BUCKET = ev("SUPABASE_STORAGE_BUCKET") or "xaluca"

def sha256(b): return hashlib.sha256(b).hexdigest()

def dest_url(path):
    # key inside bucket == full storage_path (already begins with 'xaluca/')
    return f"{SB_URL}/storage/v1/object/public/{BUCKET}/{path}"

def head_existing(path):
    """Return (exists, dest_bytes_sha, dest_size) for an object already in Supabase."""
    url = dest_url(path)
    r = requests.get(url, timeout=60)
    if r.status_code == 200:
        return True, sha256(r.content), len(r.content)
    return False, None, None

async def main():
    db = AsyncIOMotorClient(MONGO_URL)[DB_NAME]
    # representative: 2 library, 2 slots, 1 day-gallery
    picks = []
    for pref, n in (("xaluca/library/", 2), ("xaluca/slots/", 2), ("xaluca/day-galleries/", 1)):
        async for f in db.files.find({"storage_path": {"$regex": "^" + re.escape(pref)}}).limit(n):
            picks.append(f)
    print(f"{'#':<3}{'storage_path':<60}{'src_size':>10} {'src_sha256 (first16)':<20} exists  match")
    for i, f in enumerate(picks, 1):
        sp = f["storage_path"]
        try:
            data, ct = await asyncio.to_thread(get_object, sp)
            s_sha, s_sz = sha256(data), len(data)
        except Exception as e:
            print(f"{i:<3}{sp:<60}  SOURCE ERROR: {str(e)[:60]}")
            continue
        exists, d_sha, d_sz = head_existing(sp)
        match = ("—" if not exists else ("IDENTICAL" if d_sha == s_sha else "DIFFERENT"))
        print(f"{i:<3}{sp:<60}{s_sz:>10} {s_sha[:16]:<20} {str(exists):<7} {match}")
        print(f"    -> DEST URL: {dest_url(sp)}")
        if exists and d_sha != s_sha:
            print(f"    !! CONFLICT: dest_sha={d_sha[:16]} size={d_sz} (would be logged, NOT overwritten)")

asyncio.run(main())
