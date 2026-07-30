"""MongoDB full export for Xaluca Tours.

Produces (in /app/export/out/mongodb/):
  dump/                    -> native `mongodump` BSON + metadata (indexes+options)
  json/<collection>.json   -> human-readable JSON (extended) per collection
  indexes.json             -> every index of every collection
  validators.json          -> JSON-schema validators / collection options
  counts.json              -> document count per collection (incl. empty)
  SUMMARY.md               -> totals
Includes ALL collections (empty ones too), personal data and internal ones.
"""
import os, re, json, subprocess
from datetime import datetime, timezone
from pymongo import MongoClient
from bson import json_util

ENV = open("/app/backend/.env").read()
def ev(k):
    m = re.search(rf"^{k}=(\S+)", ENV, re.M)
    return m.group(1).strip('"') if m else None

MONGO_URL = ev("MONGO_URL"); DB_NAME = ev("DB_NAME")
OUT = "/app/export/out/mongodb"
os.makedirs(os.path.join(OUT, "json"), exist_ok=True)

def now(): return datetime.now(timezone.utc).isoformat()

cli = MongoClient(MONGO_URL)
db = cli[DB_NAME]
colls = sorted(db.list_collection_names())

# 1. native mongodump (BSON + metadata carries indexes & options/validators)
dump_dir = os.path.join(OUT, "dump")
os.makedirs(dump_dir, exist_ok=True)
print("[mongodump] running...", flush=True)
r = subprocess.run(["mongodump", "--uri", MONGO_URL, "--db", DB_NAME,
                    "--out", dump_dir], capture_output=True, text=True)
print("[mongodump] rc=", r.returncode, (r.stderr or "")[-300:], flush=True)

# 2. per-collection JSON + indexes + validators + counts
indexes = {}; validators = {}; counts = {}
for c in colls:
    counts[c] = db[c].count_documents({})
    # indexes
    indexes[c] = db[c].index_information()
    # collection options (validators, etc.)
    opts = {}
    for ci in db.list_collections(filter={"name": c}):
        opts = ci.get("options", {})
    validators[c] = opts
    # dump docs as extended JSON
    docs = list(db[c].find({}))
    with open(os.path.join(OUT, "json", f"{c}.json"), "w") as fh:
        fh.write(json_util.dumps(docs, indent=2))
    print(f"[json] {c:32s} docs={counts[c]}", flush=True)

json.dump(indexes, open(os.path.join(OUT, "indexes.json"), "w"),
          indent=2, default=str)
json.dump(validators, open(os.path.join(OUT, "validators.json"), "w"),
          indent=2, default=str)
json.dump(counts, open(os.path.join(OUT, "counts.json"), "w"), indent=2)

total = sum(counts.values())
with open(os.path.join(OUT, "SUMMARY.md"), "w") as fh:
    fh.write(f"# MongoDB export — {DB_NAME}\n\nGenerated: {now()}\n\n")
    fh.write(f"Collections: {len(colls)} · Total documents: {total}\n\n")
    fh.write("| Collection | Documents | Indexes | Has validator |\n|---|---:|---:|---|\n")
    for c in colls:
        fh.write(f"| {c} | {counts[c]} | {len(indexes[c])} | "
                 f"{'yes' if validators[c].get('validator') else 'no'} |\n")
print(f"[done] {len(colls)} collections, {total} docs", flush=True)
