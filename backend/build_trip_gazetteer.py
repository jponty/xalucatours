"""One-off generator: parse the frontend catalog + route registry into a
backend JSON gazetteer (routeId -> {title:{es,en,fr}, path:{es,en,fr}}).

Run from /app/backend:  python build_trip_gazetteer.py
Re-run whenever frontend trips/routes change.
"""
import json
import re
from pathlib import Path

FRONT = Path(__file__).resolve().parent.parent / "frontend" / "src" / "lib"
CATALOG = (FRONT / "allTripsCatalog.js").read_text(encoding="utf-8")
ROUTES = (FRONT / "routes.js").read_text(encoding="utf-8")

# --- titles: mk({ routeId: "x", ... title: i18n("es","en","fr"), ... }) ---
gaz = {}
mk_re = re.compile(r'routeId:\s*"([^"]+)"[\s\S]*?title:\s*i18n\(\s*"((?:[^"\\]|\\.)*)"\s*,\s*"((?:[^"\\]|\\.)*)"\s*,\s*"((?:[^"\\]|\\.)*)"\s*\)')
for m in mk_re.finditer(CATALOG):
    rid, es, en, fr = m.groups()
    gaz[rid] = {"title": {"es": es, "en": en, "fr": fr}, "path": {}}

# --- paths: routeId:{ es: "slug", en: "slug", fr: "slug" } ---
path_re = re.compile(r'(\w+)\s*:\s*\{\s*es:\s*"([^"]*)"\s*,\s*en:\s*"([^"]*)"\s*,\s*fr:\s*"([^"]*)"\s*\}')
all_paths = {}
for m in path_re.finditer(ROUTES):
    rid, es, en, fr = m.groups()
    all_paths[rid] = {"es": es, "en": en, "fr": fr}

for rid in gaz:
    if rid in all_paths:
        gaz[rid]["path"] = all_paths[rid]

out = Path(__file__).resolve().parent / "trip_gazetteer.json"
out.write_text(json.dumps(gaz, ensure_ascii=False, indent=2), encoding="utf-8")
print(f"Wrote {len(gaz)} trips -> {out}")
missing = [r for r, v in gaz.items() if not v["path"]]
if missing:
    print("WARNING: no path for:", missing)
