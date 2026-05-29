"""Phase 1 (heroes): fill the 11 itinerary-hub hero backgrounds
(JourneyHero, slot `<page>.hero.bg`) with Morocco Pexels images.
"""
import json
import urllib.request

API = "http://localhost:8001"

# es route path -> (query, trilingual alt)
HUBS = {
    "viajes/sur/atlas_desierto": ("Ait Benhaddou kasbah Morocco golden hour", ("Atlas y desierto, Marruecos", "Atlas and desert, Morocco", "Atlas et désert, Maroc")),
    "viajes/sur/desierto_atlas": ("Erg Chebbi Sahara sand dunes Morocco", ("Desierto y Atlas, Marruecos", "Desert and Atlas, Morocco", "Désert et Atlas, Maroc")),
    "viajes/sur/marrakech_ergchebbi": ("Atlas mountains road Morocco desert", ("Marrakech a Erg Chebbi", "Marrakech to Erg Chebbi", "Marrakech à Erg Chebbi")),
    "viajes/ergchebbi_marrakech": ("Sahara desert camp Erg Chebbi Morocco", ("Erg Chebbi a Marrakech", "Erg Chebbi to Marrakech", "Erg Chebbi à Marrakech")),
    "viajes/marrakech_ergchebbi_marrakech": ("Marrakech Koutoubia desert Morocco", ("Marrakech · Erg Chebbi · Marrakech", "Marrakech · Erg Chebbi · Marrakech", "Marrakech · Erg Chebbi · Marrakech")),
    "viajes/sur/marrakech_essaouira": ("Essaouira port fortress Morocco coast", ("Marrakech y Essaouira", "Marrakech and Essaouira", "Marrakech et Essaouira")),
    "viajes/sur/errachidia-atlas-fez": ("High Atlas mountains Fes Morocco", ("Errachidia · Atlas · Fez", "Errachidia · Atlas · Fez", "Errachidia · Atlas · Fès")),
    "viajes/atlas-desierto-fez": ("Fes medina Atlas Morocco", ("Atlas · Desierto · Fez", "Atlas · Desert · Fez", "Atlas · Désert · Fès")),
    "viajes/gransur/rak-fez": ("Morocco Sahara desert grand tour landscape", ("Gran sur: Marrakech a Fez", "Grand south: Marrakech to Fez", "Grand sud : Marrakech à Fès")),
    "viajes/escapadas/rak_erg_rak": ("Marrakech Sahara dunes camel Morocco", ("Escapada al desierto", "Desert escape", "Escapade dans le désert")),
    "viajes/aventura/enduro": ("enduro motorcycle desert dunes Morocco", ("Aventura enduro, Marruecos", "Enduro adventure, Morocco", "Aventure enduro, Maroc")),
}

items = []
for path, (query, alt) in HUBS.items():
    slot = path.replace("/", ".") + ".hero.bg"
    es, en, fr = alt
    items.append({"slot_id": slot, "query": query, "alt": es,
                  "alt_i18n": {"es": es, "en": en, "fr": fr}})

payload = {"items": items, "orientation": "landscape", "force": True, "per_page": 20}
req = urllib.request.Request(f"{API}/api/pexels/bulk-fill",
                            data=json.dumps(payload).encode(),
                            headers={"Content-Type": "application/json"}, method="POST")
with urllib.request.urlopen(req, timeout=400) as r:
    out = json.load(r)
print("TOTAL", out["total"], "OK", out["ok"], "FAILED", out["failed"])
for res in out["results"]:
    if not res.get("ok"):
        print("  FAIL", res["slot_id"], res.get("error"))
    else:
        print("  OK", res["slot_id"])
