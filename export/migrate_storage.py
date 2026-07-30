"""Xaluca Tours — Object Storage -> Supabase migration (hash-aware, resumable).

Modes:
  scan     : existence-only census (cheap HEAD/stream). Reports existing/missing.
  migrate  : full pipeline. For every ACTIVE file in Mongo `files`:
               1. download master from Emergent, compute src SHA-256 + size
               2. check destination (200=EXISTS / 404|not_found=MISSING / else=ERROR)
               3. EXISTS+identical  -> SKIPPED_IDENTICAL
                  EXISTS+different   -> CONFLICT (NEVER overwritten, logged)
                  MISSING            -> upload (x-upsert=false) then re-verify size+SHA-256
               4. corrupt source     -> CORRUPT_SOURCE ; hard errors -> FAILED (retried)
             Resumable via a JSONL ledger; never deletes anything on Emergent.

Outputs (in /app/export/out/):
  storage_manifest.jsonl   (live, one row per object, resumable ledger)
  storage_manifest.csv     (final)
  storage_manifest.json    (final)
  conflicts.json           (hash mismatches, not overwritten)
  errors.json              (failed/corrupt)
  storage_report.json      (counts + totals)
"""
import os, re, sys, csv, json, time, hashlib, threading, argparse
from urllib.parse import quote
from datetime import datetime, timezone
from concurrent.futures import ThreadPoolExecutor, as_completed

sys.path.insert(0, "/app/backend")

ENV = open("/app/backend/.env").read()
def ev(k):
    m = re.search(rf"^{k}=(\S+)", ENV, re.M)
    return m.group(1).strip('"') if m else None
for _l in ENV.splitlines():
    _l = _l.strip()
    if _l and not _l.startswith("#") and "=" in _l:
        _k, _v = _l.split("=", 1)
        os.environ.setdefault(_k.strip(), _v.strip().strip('"'))

import requests
from pymongo import MongoClient
from storage import get_object, put_object

MONGO_URL = ev("MONGO_URL"); DB_NAME = ev("DB_NAME")
SB_URL = ev("SUPABASE_URL"); SB_KEY = ev("SUPABASE_SERVICE_ROLE_KEY")
BUCKET = ev("SUPABASE_STORAGE_BUCKET") or "xaluca"

OUT = "/app/export/out"
os.makedirs(OUT, exist_ok=True)
LEDGER = os.path.join(OUT, "storage_manifest.jsonl")

def now(): return datetime.now(timezone.utc).isoformat()
def sha256(b): return hashlib.sha256(b).hexdigest()
def enc(path): return "/".join(quote(p, safe="") for p in path.split("/"))
def pub_url(path): return f"{SB_URL}/storage/v1/object/public/{BUCKET}/{enc(path)}"
def is_active(f): return str(f.get("is_deleted")).strip().lower() not in ("true", "1")

def dest_state(path, want_hash):
    """(state, sha, size). state EXISTS|MISSING. Non-200/not-found -> raise."""
    r = requests.get(pub_url(path), timeout=120, stream=not want_hash)
    if r.status_code == 200:
        if want_hash:
            return "EXISTS", sha256(r.content), len(r.content)
        n = int(r.headers.get("Content-Length") or 0)
        r.close()
        return "EXISTS", None, n
    body = (r.text or "").lower()
    if r.status_code in (400, 404) and (r.status_code == 404 or "not_found" in body or "not found" in body):
        return "MISSING", None, None
    raise RuntimeError(f"Supabase HTTP {r.status_code}: {r.text[:200]}")

def upload(path, data, ct):
    """Upload WITHOUT overwriting (x-upsert=false)."""
    url = f"{SB_URL}/storage/v1/object/{BUCKET}/{enc(path)}"
    headers = {
        "apikey": SB_KEY, "Authorization": f"Bearer {SB_KEY}",
        "Content-Type": ct or "application/octet-stream",
        "x-upsert": "false",
        "cache-control": "public, max-age=31536000, immutable",
    }
    last = None
    for attempt in range(4):
        try:
            resp = requests.post(url, headers=headers, data=data, timeout=300)
            if resp.status_code in (200, 201):
                return
            if resp.status_code == 409:
                raise RuntimeError("EXISTS_RACE")  # created meanwhile
            last = RuntimeError(f"upload {resp.status_code}: {resp.text[:160]}")
        except Exception as e:
            last = e
        time.sleep(0.8 * (attempt + 1))
    raise last

_lock = threading.Lock()
_done = {}   # path -> row (resume cache)

def load_ledger():
    if not os.path.exists(LEDGER):
        return
    with open(LEDGER) as fh:
        for line in fh:
            line = line.strip()
            if not line:
                continue
            try:
                row = json.loads(line)
                _done[row["storage_path"]] = row
            except Exception:
                pass

def write_row(row):
    with _lock:
        with open(LEDGER, "a") as fh:
            fh.write(json.dumps(row, ensure_ascii=False) + "\n")
        _done[row["storage_path"]] = row

def process(f, coll):
    sp = f["storage_path"]
    ct = f.get("content_type")
    # resume: skip already-finalized rows (identical or verified upload)
    prev = _done.get(sp)
    if prev and prev.get("action") in ("SKIPPED_IDENTICAL", "UPLOADED_VERIFIED"):
        return prev["action"]
    row = {
        "storage_path": sp, "dest_url": pub_url(sp),
        "content_type": ct, "is_deleted": not is_active(f),
        "created_at": f.get("created_at"), "checked_at": now(),
        "src_size": None, "src_sha256": None,
        "dest_size": None, "dest_sha256": None,
        "action": None, "verified": False, "note": None,
    }
    try:
        try:
            data, src_ct = get_object(sp)
        except Exception as e:
            row["action"] = "CORRUPT_SOURCE"; row["note"] = str(e)[:180]
            write_row(row); return row["action"]
        row["src_sha256"] = sha256(data); row["src_size"] = len(data)
        if not ct:
            row["content_type"] = ct = src_ct
        state, d_sha, d_sz = dest_state(sp, want_hash=True)
        if state == "EXISTS":
            row["dest_sha256"] = d_sha; row["dest_size"] = d_sz
            if d_sha == row["src_sha256"]:
                row["action"] = "SKIPPED_IDENTICAL"; row["verified"] = True
            else:
                row["action"] = "CONFLICT"; row["note"] = "hash differs; NOT overwritten"
        else:
            upload(sp, data, ct)
            v_state, v_sha, v_sz = dest_state(sp, want_hash=True)
            row["dest_sha256"] = v_sha; row["dest_size"] = v_sz
            if v_state == "EXISTS" and v_sha == row["src_sha256"] and v_sz == row["src_size"]:
                row["action"] = "UPLOADED_VERIFIED"; row["verified"] = True
            else:
                row["action"] = "UPLOAD_VERIFY_FAILED"
                row["note"] = f"post-verify mismatch state={v_state}"
    except Exception as e:
        row["action"] = "FAILED"; row["note"] = str(e)[:180]
    write_row(row)
    return row["action"]

def collect_active(db):
    files = []
    for f in db.files.find({}, {"storage_path": 1, "content_type": 1, "is_deleted": 1, "created_at": 1}):
        if f.get("storage_path") and is_active(f):
            files.append(f)
    # de-dup by storage_path (keep first)
    seen = set(); uniq = []
    for f in files:
        if f["storage_path"] in seen:
            continue
        seen.add(f["storage_path"]); uniq.append(f)
    return uniq

def run_scan(db, workers):
    files = collect_active(db)
    print(f"[scan] active files: {len(files)}", flush=True)
    res = {"EXISTS": 0, "MISSING": 0, "ERROR": 0}
    errs = []
    cnt = {"n": 0}
    lk = threading.Lock()
    def one(f):
        sp = f["storage_path"]
        try:
            state, _, _ = dest_state(sp, want_hash=False)
            with lk:
                res[state] += 1
        except Exception as e:
            with lk:
                res["ERROR"] += 1
                if len(errs) < 50:
                    errs.append(f"{sp}: {str(e)[:120]}")
        with lk:
            cnt["n"] += 1
            if cnt["n"] % 500 == 0:
                print(f"[scan] {cnt['n']}/{len(files)} -> {dict(res)}", flush=True)
    with ThreadPoolExecutor(max_workers=workers) as ex:
        list(ex.map(one, files))
    print(f"[scan] DONE total={len(files)} {dict(res)}", flush=True)
    if errs:
        print("[scan] sample errors:", flush=True)
        for e in errs[:10]:
            print("   ", e, flush=True)
    json.dump({"total": len(files), **res, "sample_errors": errs, "at": now()},
              open(os.path.join(OUT, "storage_scan.json"), "w"), indent=2, ensure_ascii=False)

def run_migrate(db, workers):
    load_ledger()
    files = collect_active(db)
    print(f"[migrate] active files: {len(files)} | resume ledger rows: {len(_done)}", flush=True)
    tally = {}
    cnt = {"n": 0}
    lk = threading.Lock()
    def one(f):
        action = process(f, "files")
        with lk:
            tally[action] = tally.get(action, 0) + 1
            cnt["n"] += 1
            if cnt["n"] % 100 == 0:
                print(f"[migrate] {cnt['n']}/{len(files)} -> {dict(tally)}", flush=True)
    with ThreadPoolExecutor(max_workers=workers) as ex:
        list(ex.map(one, files))
    print(f"[migrate] DONE {dict(tally)}", flush=True)
    finalize(files)

def finalize(files):
    rows = [_done[f["storage_path"]] for f in files if f["storage_path"] in _done]
    # CSV
    cols = ["storage_path", "dest_url", "content_type", "is_deleted", "created_at",
            "src_size", "src_sha256", "dest_size", "dest_sha256", "action", "verified", "note"]
    with open(os.path.join(OUT, "storage_manifest.csv"), "w", newline="") as fh:
        w = csv.DictWriter(fh, fieldnames=cols, extrasaction="ignore")
        w.writeheader()
        for r in rows:
            w.writerow(r)
    json.dump(rows, open(os.path.join(OUT, "storage_manifest.json"), "w"),
              indent=2, ensure_ascii=False)
    conflicts = [r for r in rows if r["action"] == "CONFLICT"]
    errors = [r for r in rows if r["action"] in ("FAILED", "CORRUPT_SOURCE", "UPLOAD_VERIFY_FAILED")]
    json.dump(conflicts, open(os.path.join(OUT, "conflicts.json"), "w"), indent=2, ensure_ascii=False)
    json.dump(errors, open(os.path.join(OUT, "errors.json"), "w"), indent=2, ensure_ascii=False)
    tally = {}
    src_bytes = dest_bytes = 0
    for r in rows:
        tally[r["action"]] = tally.get(r["action"], 0) + 1
        src_bytes += r.get("src_size") or 0
        if r.get("verified"):
            dest_bytes += r.get("dest_size") or 0
    report = {
        "generated_at": now(), "bucket": BUCKET, "project": SB_URL,
        "total_objects": len(rows), "actions": tally,
        "src_bytes_total": src_bytes, "verified_dest_bytes_total": dest_bytes,
        "pending": len(files) - len(rows),
        "conflicts": len(conflicts), "errors": len(errors),
    }
    json.dump(report, open(os.path.join(OUT, "storage_report.json"), "w"), indent=2, ensure_ascii=False)
    print("[report]", json.dumps(report, ensure_ascii=False), flush=True)

if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("mode", choices=["scan", "migrate", "finalize"])
    ap.add_argument("--workers", type=int, default=int(os.environ.get("MIG_WORKERS", "8")))
    args = ap.parse_args()
    db = MongoClient(MONGO_URL)[DB_NAME]
    if args.mode == "scan":
        run_scan(db, args.workers)
    elif args.mode == "migrate":
        run_migrate(db, args.workers)
    else:
        load_ledger()
        finalize(collect_active(db))
