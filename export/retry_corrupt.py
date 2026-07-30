"""Targeted retry of the objects that failed as CORRUPT_SOURCE, to tell
transient connection errors apart from genuine source corruption. Uploads
any that download OK, then re-verifies SHA-256."""
import os, re, sys, time, hashlib, json
from urllib.parse import quote
sys.path.insert(0, "/app/backend")
ENV = open("/app/backend/.env").read()
for _l in ENV.splitlines():
    _l=_l.strip()
    if _l and not _l.startswith("#") and "=" in _l:
        k,v=_l.split("=",1); os.environ.setdefault(k.strip(), v.strip().strip('"'))
def ev(k):
    m=re.search(rf"^{k}=(\S+)",ENV,re.M); return m.group(1).strip('"') if m else None
import requests
from storage import get_object
SB_URL=ev("SUPABASE_URL"); SB_KEY=ev("SUPABASE_SERVICE_ROLE_KEY"); BUCKET=ev("SUPABASE_STORAGE_BUCKET") or "xaluca"
def sha(b): return hashlib.sha256(b).hexdigest()
def enc(p): return "/".join(quote(x,safe="") for x in p.split("/"))
def pub(p): return f"{SB_URL}/storage/v1/object/public/{BUCKET}/{enc(p)}"

paths=[r["storage_path"] for r in json.load(open("/app/export/out/errors.json"))]
print("retrying", len(paths), "objects\n")
for p in paths:
    ok=False; err=None
    for attempt in range(6):
        try:
            data,ct=get_object(p); ok=True; break
        except Exception as e:
            err=str(e)[:100]; time.sleep(2.0*(attempt+1))
    if not ok:
        print(f"STILL FAILING (likely truly corrupt/unreadable at source): {p}\n   {err}")
        continue
    s=sha(data); n=len(data)
    # check dest
    r=requests.get(pub(p),timeout=90)
    if r.status_code==200 and sha(r.content)==s:
        print(f"OK (already in Supabase, identical): {p}  size={n}")
        continue
    # upload
    url=f"{SB_URL}/storage/v1/object/{BUCKET}/{enc(p)}"
    up=requests.post(url,headers={"apikey":SB_KEY,"Authorization":f"Bearer {SB_KEY}","Content-Type":ct or "application/octet-stream","x-upsert":"false","cache-control":"public, max-age=31536000, immutable"},data=data,timeout=300)
    v=requests.get(pub(p),timeout=90)
    verified = v.status_code==200 and sha(v.content)==s
    print(f"RECOVERED + UPLOADED: {p}  size={n}  upload_status={up.status_code}  verified={verified}")
