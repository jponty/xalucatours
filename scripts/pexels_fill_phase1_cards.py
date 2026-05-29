"""Phase 1 (cards): fill the 40 trip catalog cards + planner reco covers
with destination-specific Morocco Pexels images via /api/pexels/bulk-fill.

Run: python3 /app/scripts/pexels_fill_phase1_cards.py
"""
import json
import urllib.request

API = "http://localhost:8001"
for line in open("/app/frontend/.env"):
    if line.startswith("REACT_APP_BACKEND_URL=_disabled"):
        API = line.split("=", 1)[1].strip()

# routeId -> (destination-specific Morocco query, trilingual alt title)
TRIPS = {
    "tourAtlasDesierto45": ("Ait Benhaddou kasbah Morocco", ("Atlas y desierto, Marruecos", "Atlas and desert, Morocco", "Atlas et désert, Maroc")),
    "tourAtlasDesierto56": ("Dades valley kasbah Morocco", ("Valle del Dadès, Marruecos", "Dades valley, Morocco", "Vallée du Dadès, Maroc")),
    "tourAtlasDesierto67": ("Todra gorge Morocco", ("Gargantas del Todra, Marruecos", "Todra gorges, Morocco", "Gorges du Todra, Maroc")),
    "tourDesiertoAtlas45": ("Erg Chebbi sand dunes Morocco", ("Dunas de Erg Chebbi, Marruecos", "Erg Chebbi dunes, Morocco", "Dunes de l'Erg Chebbi, Maroc")),
    "tourDesiertoAtlas67": ("Sahara desert camel caravan Morocco", ("Caravana en el Sáhara, Marruecos", "Sahara camel caravan, Morocco", "Caravane au Sahara, Maroc")),
    "tourMarrakechErg45": ("Atlas mountains road Morocco", ("Montañas del Atlas, Marruecos", "Atlas mountains, Morocco", "Montagnes de l'Atlas, Maroc")),
    "tourMarrakechErg56": ("Erg Chebbi dunes sunset Morocco", ("Atardecer en Erg Chebbi, Marruecos", "Erg Chebbi sunset, Morocco", "Coucher de soleil Erg Chebbi, Maroc")),
    "tourMarrakechErg67": ("Skoura palm grove oasis Morocco", ("Palmeral de Skoura, Marruecos", "Skoura palm grove, Morocco", "Palmeraie de Skoura, Maroc")),
    "tourMarrakechLoop34": ("Sahara desert dunes Morocco", ("Desierto del Sáhara, Marruecos", "Sahara desert, Morocco", "Désert du Sahara, Maroc")),
    "tourMarrakechLoop45": ("Erg Chebbi desert camp Morocco", ("Campamento en el desierto, Marruecos", "Desert camp, Morocco", "Campement dans le désert, Maroc")),
    "tourMarrakechLoop56": ("Atlas mountains valley Morocco", ("Valle del Atlas, Marruecos", "Atlas valley, Morocco", "Vallée de l'Atlas, Maroc")),
    "tourMarrakechLoop67": ("Draa valley palm Morocco", ("Valle del Drâa, Marruecos", "Draa valley, Morocco", "Vallée du Drâa, Maroc")),
    "tourMarrakechEss45": ("Essaouira port Morocco", ("Puerto de Essaouira, Marruecos", "Essaouira port, Morocco", "Port d'Essaouira, Maroc")),
    "tourMarrakechEss67": ("Essaouira beach medina Morocco", ("Essaouira, Marruecos", "Essaouira, Morocco", "Essaouira, Maroc")),
    "tourFezRak67": ("Fes medina Morocco", ("Medina de Fez, Marruecos", "Fez medina, Morocco", "Médina de Fès, Maroc")),
    "tourFezRak78": ("Fes tannery leather Morocco", ("Curtidurías de Fez, Marruecos", "Fez tanneries, Morocco", "Tanneries de Fès, Maroc")),
    "tourMarrakechFez67": ("Marrakech medina Morocco", ("Medina de Marrakech, Marruecos", "Marrakech medina, Morocco", "Médina de Marrakech, Maroc")),
    "tourMarrakechFez89": ("Volubilis roman ruins Morocco", ("Volúbilis, Marruecos", "Volubilis, Morocco", "Volubilis, Maroc")),
    "tourMarrakechFez910": ("Morocco landscape desert mountains", ("Paisaje de Marruecos", "Morocco landscape", "Paysage du Maroc")),
    "tourTangerRak89": ("Tangier Morocco coast", ("Tánger, Marruecos", "Tangier, Morocco", "Tanger, Maroc")),
    "tourTangerRak910": ("Chefchaouen blue city Morocco", ("Chefchaouen, Marruecos", "Chefchaouen, Morocco", "Chefchaouen, Maroc")),
    "tourCiudadesImperiales45": ("Rabat Morocco kasbah", ("Rabat, Marruecos", "Rabat, Morocco", "Rabat, Maroc")),
    "tourCiudadesImperiales67": ("Meknes Bab Mansour Morocco", ("Mequinez, Marruecos", "Meknes, Morocco", "Meknès, Maroc")),
    "tourCiudadesImperialesRif67": ("Chefchaouen blue streets Morocco", ("Ciudades imperiales y Rif, Marruecos", "Imperial cities and Rif, Morocco", "Cités impériales et Rif, Maroc")),
    "tourCiudadesImperialesRif78": ("Chefchaouen blue medina Morocco", ("Chefchaouen, Marruecos", "Chefchaouen, Morocco", "Chefchaouen, Maroc")),
    "tourTangerFez45": ("Tetouan medina Morocco", ("Tetuán, Marruecos", "Tetouan, Morocco", "Tétouan, Maroc")),
    "tourTangerFez56": ("Chefchaouen blue alley Morocco", ("Chefchaouen, Marruecos", "Chefchaouen, Morocco", "Chefchaouen, Maroc")),
    "tourFezTanger56": ("Fes medina rooftops Morocco", ("Medina de Fez, Marruecos", "Fez medina, Morocco", "Médina de Fès, Maroc")),
    "tourFezTanger67": ("Asilah Morocco white town", ("Asilah, Marruecos", "Asilah, Morocco", "Asilah, Maroc")),
    "tourEscapadaMarrakech23": ("Marrakech Jemaa el Fna Morocco", ("Marrakech, Marruecos", "Marrakech, Morocco", "Marrakech, Maroc")),
    "tourEscapadaRakAgafay34": ("Agafay desert Morocco", ("Desierto de Agafay, Marruecos", "Agafay desert, Morocco", "Désert d'Agafay, Maroc")),
    "tourEscapadaRakErgRak23": ("Sahara sand dunes Morocco", ("Dunas del Sáhara, Marruecos", "Sahara dunes, Morocco", "Dunes du Sahara, Maroc")),
    "tourEscapadaRakErgRak34": ("camel trekking desert Morocco", ("Trekking en camello, Marruecos", "Camel trekking, Morocco", "Trekking à dos de chameau, Maroc")),
    "tourEscapadaFez23": ("Fes medina Morocco artisan", ("Medina de Fez, Marruecos", "Fez medina, Morocco", "Médina de Fès, Maroc")),
    "tourEscapadaFez34": ("Fes pottery artisans Morocco", ("Artesanos de Fez, Marruecos", "Fez artisans, Morocco", "Artisans de Fès, Maroc")),
    "tourEscapadaAtlas34": ("High Atlas Berber village Morocco", ("Alto Atlas bereber, Marruecos", "High Atlas Berber, Morocco", "Haut Atlas berbère, Maroc")),
    "tourEscapadaDesierto34": ("Erg Chebbi desert dunes Morocco", ("Desierto de Erg Chebbi, Marruecos", "Erg Chebbi desert, Morocco", "Désert de l'Erg Chebbi, Maroc")),
    "tourEnduroAventura45": ("motorcycle desert offroad Morocco", ("Enduro en el desierto, Marruecos", "Desert enduro, Morocco", "Enduro dans le désert, Maroc")),
    "tourEnduroAventura67": ("enduro motorcycle Sahara dunes", ("Enduro en el Sáhara, Marruecos", "Sahara enduro, Morocco", "Enduro au Sahara, Maroc")),
    "tourFinDeAno2025": ("Sahara desert camp night stars", ("Noche en el desierto, Marruecos", "Desert night, Morocco", "Nuit dans le désert, Maroc")),
}

items = []
for rid, (query, alt) in TRIPS.items():
    es, en, fr = alt
    alt_i18n = {"es": es, "en": en, "fr": fr}
    items.append({"slot_id": f"home.all-trips.{rid}", "query": query, "alt": es, "alt_i18n": alt_i18n})
    items.append({"slot_id": f"plan-recos.{rid}.cover", "query": query, "alt": es, "alt_i18n": alt_i18n})

payload = {"items": items, "orientation": "landscape", "force": True, "per_page": 30}
req = urllib.request.Request(
    f"{API}/api/pexels/bulk-fill",
    data=json.dumps(payload).encode(),
    headers={"Content-Type": "application/json"},
    method="POST",
)
with urllib.request.urlopen(req, timeout=600) as r:
    out = json.load(r)
print("TOTAL", out["total"], "OK", out["ok"], "FAILED", out["failed"])
for res in out["results"]:
    if not res.get("ok"):
        print("  FAIL", res["slot_id"], res.get("error"))
