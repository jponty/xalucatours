"""Create a PRIVATE Supabase bucket 'xaluca-export' and upload the 3MB export
package there (NOT the public 'xaluca' bucket). Verifies it is NOT publicly
readable and IS readable with the service_role key."""
import os, re, sys, hashlib, requests
from datetime import datetime, timezone
sys.path.insert(0, "/app/backend")
ENV = open("/app/backend/.env").read()
def ev(k):
    m = re.search(rf"^{k}=(\S+)", ENV, re.M); return m.group(1).strip('"') if m else None
SB_URL = ev("SUPABASE_URL"); SB_KEY = ev("SUPABASE_SERVICE_ROLE_KEY")
PRIV = "xaluca-export"
H = {"apikey": SB_KEY, "Authorization": f"Bearer {SB_KEY}"}

pkg = "/app/export/xaluca_export_package.tgz"
data = open(pkg, "rb").read()
sha = hashlib.sha256(data).hexdigest()
ts = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")
key = f"exports/xaluca_export_package_{ts}.tgz"
print(f"package size={len(data)} sha256={sha}")

# 1. create private bucket (idempotent)
r = requests.post(f"{SB_URL}/storage/v1/bucket", headers=H,
                  json={"name": PRIV, "id": PRIV, "public": False}, timeout=60)
print("create bucket:", r.status_code, r.text[:160])

# 2. upload package
up = requests.post(f"{SB_URL}/storage/v1/object/{PRIV}/{key}",
                   headers={**H, "Content-Type": "application/gzip", "x-upsert": "true"},
                   data=data, timeout=300)
print("upload:", up.status_code, up.text[:160])

# 3. verify NOT public
pub = requests.get(f"{SB_URL}/storage/v1/object/public/{PRIV}/{key}", timeout=60)
print("public GET (expect NOT 200):", pub.status_code)

# 4. verify readable WITH service_role, and integrity
auth = requests.get(f"{SB_URL}/storage/v1/object/{PRIV}/{key}", headers=H, timeout=120)
ok = auth.status_code == 200 and hashlib.sha256(auth.content).hexdigest() == sha
print("authenticated GET:", auth.status_code, "| integrity_ok:", ok)
print("\nDEST (private, requires key):")
print(f"  {SB_URL}/storage/v1/object/{PRIV}/{key}")
