"""Generate lib/extraPois.js — new gazetteer POIs (coords + aliases) and their
3-card copy (ES from CSV, EN/FR auto-translated) for the Imperial Cities circuit.
"""
import asyncio
import csv
import json
import os
import re
from pathlib import Path
from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parent
load_dotenv(ROOT / ".env")
KEY = os.environ["EMERGENT_LLM_KEY"]
CSV_PATH = ROOT / "_poi_cards2.csv"
OUT_PATH = ROOT.parent / "frontend" / "src" / "lib" / "extraPois.js"

# id -> dict(punto, kind, lat, lng, name_en, name_fr, aliases)
TABLE = {
    "hassan2-mosque":   dict(punto="Mezquita Hassan II", kind="site", lat=33.6083, lng=-7.6325,
                             en="Hassan II Mosque", fr="Mosquée Hassan II",
                             aliases=["hassan ii", "mezquita hassan ii", "hassan ii mosque", "mosquee hassan ii"]),
    "oudayas":          dict(punto="Kasbah de los Oudayas", kind="kasbah", lat=34.0247, lng=-6.8367,
                             en="Kasbah of the Udayas", fr="Kasbah des Oudayas",
                             aliases=["oudaias", "oudayas", "kasbah des oudaias", "kasbah de los oudayas", "kasbah des oudayas"]),
    "torre-hassan":     dict(punto="Torre Hassan", kind="site", lat=34.0241, lng=-6.8222,
                             en="Hassan Tower", fr="Tour Hassan",
                             aliases=["torre hassan", "hassan tower", "tour hassan"]),
    "mausoleo-mohammed-v": dict(punto="Mausoleo Mohammed V", kind="site", lat=34.0238, lng=-6.8214,
                             en="Mausoleum of Mohammed V", fr="Mausolée Mohammed V",
                             aliases=["mausoleo de mohammed v", "mausoleum of mohammed v", "mausolee mohammed v", "mausoleo mohammed v"]),
    "chellah":          dict(punto="Chellah", kind="site", lat=34.0066, lng=-6.8203,
                             en="Chellah", fr="Chellah",
                             aliases=["chellah", "chella"]),
    "bab-al-mansour":   dict(punto="Bab al Mansour", kind="site", lat=33.8932, lng=-5.5639,
                             en="Bab al-Mansour", fr="Bab al-Mansour",
                             aliases=["bab al mansour", "bab mansour", "bab el mansour"]),
    "moulay-ismail-mausoleo": dict(punto="Mausoleo de Moulay Ismail", kind="site", lat=33.8895, lng=-5.5648,
                             en="Mausoleum of Moulay Ismail", fr="Mausolée de Moulay Ismaïl",
                             aliases=["mausoleo de moulay ismail", "mausoleum of moulay ismail", "mausolee de moulay ismail", "moulay ismail"]),
    "heri-es-souani":   dict(punto="Heri es Souani", kind="site", lat=33.8772, lng=-5.5606,
                             en="Heri es-Souani", fr="Heri es-Souani",
                             aliases=["heri es souani", "heri es-souani"]),
    "habs-qara":        dict(punto="Habs Qara", kind="site", lat=33.8930, lng=-5.5660,
                             en="Habs Qara", fr="Habs Qara",
                             aliases=["habs qara", "habs kara"]),
    "medina-fez":       dict(punto="Medina de Fez", kind="town", lat=34.0654, lng=-4.9730,
                             en="Medina of Fez", fr="Médina de Fès",
                             aliases=["fez el-bali", "fes el-bali", "fez el bali", "fes el bali", "medina de fez", "medina de fes"]),
    "chouara":          dict(punto="Curtiduría Chouara", kind="market", lat=34.0658, lng=-4.9697,
                             en="Chouara Tannery", fr="Tannerie Chouara",
                             aliases=["chouara", "curtiduria chouara", "tenerias", "tenerias tradicionales", "tanneries"]),
    "qarawiyyin":       dict(punto="Universidad Al-Qarawiyyin", kind="site", lat=34.0648, lng=-4.9734,
                             en="Al-Qarawiyyin University", fr="Université Al-Qarawiyyin",
                             aliases=["al-qarawiyyin", "qarawiyyin", "al qaraouiyine", "universidad al-qarawiyyin", "qaraouiyine"]),
    "cedros-atlas":     dict(punto="Bosques de Cedros", kind="mountain", lat=33.4233, lng=-5.1700,
                             en="Cedar Forests", fr="Forêts de cèdres",
                             aliases=["bosques de cedros", "bosque de cedros", "cedros gigantes", "cedar forests", "forets de cedres", "cedres geants"]),
    "azrou":            dict(punto="Azrou", kind="town", lat=33.4342, lng=-5.2214,
                             en="Azrou", fr="Azrou", aliases=["azrou"]),
    "khenifra":         dict(punto="Khenifra", kind="town", lat=32.9357, lng=-5.6686,
                             en="Khenifra", fr="Khénifra", aliases=["khenifra"]),
    "beni-mellal":      dict(punto="Beni Mellal", kind="town", lat=32.3394, lng=-6.3608,
                             en="Beni Mellal", fr="Beni Mellal", aliases=["beni mellal"]),
    "jemaa-el-fna":     dict(punto="Djemaa el-Fna", kind="market", lat=31.6258, lng=-7.9891,
                             en="Jemaa el-Fna Square", fr="Place Jemaa el-Fna",
                             aliases=["djemaa el-fna", "jemaa el-fna", "djemaa el fna", "jemaa el fna", "jamaa el fna", "plaza djemaa el-fna"]),
    "medina-marrakech": dict(punto="Medina de Marrakech", kind="town", lat=31.6295, lng=-7.9811,
                             en="Medina of Marrakech", fr="Médina de Marrakech",
                             aliases=["medina de marrakech"]),
    "koutoubia":        dict(punto="Mezquita Koutoubia", kind="site", lat=31.6242, lng=-7.9931,
                             en="Koutoubia Mosque", fr="Mosquée Koutoubia",
                             aliases=["koutoubia", "alminar de la koutoubia", "koutoubia minaret", "minaret de la koutoubia"]),
    "bahia-palace":     dict(punto="Palacio Bahía", kind="site", lat=31.6217, lng=-7.9836,
                             en="Bahia Palace", fr="Palais de la Bahia",
                             aliases=["palacio de la bahia", "bahia palace", "palais de la bahia", "palacio bahia"]),
    "zocos-marrakech":  dict(punto="Zocos de Marrakech", kind="market", lat=31.6305, lng=-7.9886,
                             en="Souks of Marrakech", fr="Souks de Marrakech",
                             aliases=["zocos de marrakech", "zoco de marrakech", "souks de marrakech"]),
    "farmacia-bereber": dict(punto="Farmacia bereber", kind="market", lat=31.6270, lng=-7.9860,
                             en="Berber Pharmacy", fr="Pharmacie berbère",
                             aliases=["farmacia bereber", "berber pharmacy", "pharmacie berbere"]),
    "majorelle":        dict(punto="Jardín Majorelle", kind="site", lat=31.6417, lng=-7.9999,
                             en="Majorelle Garden", fr="Jardin Majorelle",
                             aliases=["jardin majorelle", "jardines majorelle", "majorelle", "majorelle garden"]),
    # ===== Batch 2 — remaining circuits =====
    # Essaouira
    "medina-essaouira": dict(punto="Medina de Essaouira", kind="town", lat=31.5125, lng=-9.7700,
                             en="Medina of Essaouira", fr="Médina d'Essaouira",
                             aliases=["medina de essaouira", "medina de esauira"]),
    "murallas-essaouira": dict(punto="Murallas de Essaouira", kind="site", lat=31.5130, lng=-9.7720,
                             en="Ramparts of Essaouira", fr="Remparts d'Essaouira",
                             aliases=["murallas de essaouira", "murallas de esauira", "remparts d'essaouira"]),
    "playa-essaouira":  dict(punto="Playa de Essaouira", kind="viewpoint", lat=31.5050, lng=-9.7650,
                             en="Essaouira Beach", fr="Plage d'Essaouira",
                             aliases=["playa de essaouira", "plage d'essaouira"]),
    "puerto-essaouira": dict(punto="Puerto pesquero de Essaouira", kind="market", lat=31.5095, lng=-9.7735,
                             en="Essaouira Fishing Port", fr="Port de pêche d'Essaouira",
                             aliases=["puerto pesquero de essaouira", "puerto pesquero", "puerto de essaouira", "port de peche"]),
    "skala-essaouira":  dict(punto="Skala de la Kasbah", kind="site", lat=31.5142, lng=-9.7730,
                             en="Skala of the Kasbah", fr="Skala de la Kasbah",
                             aliases=["skala de la kasbah", "skala"]),
    "islas-purpurarias": dict(punto="Islas Purpurarias", kind="viewpoint", lat=31.4980, lng=-9.7820,
                             en="Purpuraires Islands", fr="Îles Purpuraires",
                             aliases=["islas purpurarias", "islas purpurarias", "iles purpuraires"]),
    # Norte
    "mdiq":             dict(punto="M'diq", kind="town", lat=35.6840, lng=-5.3260,
                             en="M'diq", fr="M'diq", aliases=["m'diq", "mdiq", "m diq"]),
    "medina-asilah":    dict(punto="Medina de Asilah", kind="town", lat=35.4650, lng=-6.0350,
                             en="Medina of Asilah", fr="Médina d'Asilah",
                             aliases=["medina de asilah"]),
    "murallas-asilah":  dict(punto="Murallas portuguesas de Asilah", kind="site", lat=35.4660, lng=-6.0370,
                             en="Portuguese Walls of Asilah", fr="Remparts portugais d'Asilah",
                             aliases=["murallas portuguesas de asilah", "murallas portuguesas", "murallas de asilah"]),
    "medina-tetuan":    dict(punto="Medina de Tetuán", kind="town", lat=35.5710, lng=-5.3700,
                             en="Medina of Tetouan", fr="Médina de Tétouan",
                             aliases=["medina de tetuan", "medina de tetuán"]),
    "monumentos-aleman": dict(punto="Monumentos del Alemán", kind="site", lat=35.5760, lng=-5.3680,
                             en="The German's Monuments", fr="Monuments de l'Allemand",
                             aliases=["monumentos del aleman", "monumentos del alemán"]),
    "uta-hammam":       dict(punto="Plaza Uta el-Hammam", kind="site", lat=35.1688, lng=-5.2636,
                             en="Uta el-Hammam Square", fr="Place Uta el-Hammam",
                             aliases=["plaza uta el-hammam", "uta el-hammam", "uta el hammam"]),
    "ras-el-maa":       dict(punto="Ras el-Maa", kind="viewpoint", lat=35.1720, lng=-5.2570,
                             en="Ras el-Maa Waterfall", fr="Cascade Ras el-Maa",
                             aliases=["ras el-maa", "ras el maa", "cascada ras el-maa"]),
    # Saghro / Anti-Atlas / South
    "saghro":           dict(punto="Djebel Saghro", kind="mountain", lat=31.0500, lng=-5.9000,
                             en="Jbel Saghro", fr="Jbel Saghro",
                             aliases=["djebel saghro", "jbel saghro", "jebel saghro", "saghro"]),
    "nkob":             dict(punto="N'Kob", kind="village", lat=30.8770, lng=-5.8830,
                             en="N'Kob", fr="N'Kob", aliases=["n'kob", "nkob", "n kob"]),
    "tafraoute":        dict(punto="Tafraoute", kind="town", lat=29.7200, lng=-8.9750,
                             en="Tafraoute", fr="Tafraoute", aliases=["tafraoute", "tafraout"]),
    "aknioun":          dict(punto="Aknioun", kind="village", lat=31.0800, lng=-5.7500,
                             en="Aknioun", fr="Aknioun", aliases=["aknioun"]),
    "amskar":           dict(punto="Amskar", kind="village", lat=31.1200, lng=-5.7000,
                             en="Amskar", fr="Amskar", aliases=["amskar"]),
    "tisserdimine":     dict(punto="Tisserdimine", kind="village", lat=31.0900, lng=-4.5000,
                             en="Tisserdimine", fr="Tisserdimine", aliases=["tisserdimine"]),
    "rekam":            dict(punto="Rekam", kind="village", lat=31.0500, lng=-4.3000,
                             en="Rekam", fr="Rekam", aliases=["rekam"]),
    "oued-remlia":      dict(punto="Oued Remlia", kind="site", lat=31.0000, lng=-4.1000,
                             en="Oued Remlia", fr="Oued Remlia", aliases=["oued remlia", "remlia"]),
    "ouzina":           dict(punto="Ouzina", kind="dunes", lat=30.9000, lng=-3.9500,
                             en="Ouzina", fr="Ouzina", aliases=["ouzina"]),
    "minas-mfis":       dict(punto="Minas de M'Fis", kind="site", lat=31.1500, lng=-4.1500,
                             en="M'Fis Mines", fr="Mines de M'Fis",
                             aliases=["minas de m'fis", "m'fis", "mfis", "minas de mfis"]),
    "fezzou":           dict(punto="Fezzou", kind="village", lat=31.2000, lng=-4.4000,
                             en="Fezzou", fr="Fezzou", aliases=["fezzou"]),
    "oasis-fezzou":     dict(punto="Oasis de Fezzou", kind="palm", lat=31.2050, lng=-4.4050,
                             en="Fezzou Oasis", fr="Oasis de Fezzou", aliases=["oasis de fezzou"]),
    "pozos-jorf":       dict(punto="Pozos de Jorf", kind="site", lat=31.4900, lng=-4.3900,
                             en="Jorf Khettara Wells", fr="Puits de Jorf",
                             aliases=["pozos de jorf", "khettaras de jorf", "jorf"]),
    "chott-merzouga":   dict(punto="Chott de Merzouga", kind="viewpoint", lat=31.1500, lng=-4.0500,
                             en="Merzouga Chott", fr="Chott de Merzouga",
                             aliases=["chott de merzouga", "dayet srji", "lago dayet srji"]),
    "chott-maider":     dict(punto="Chott Lac Maider", kind="viewpoint", lat=31.0000, lng=-4.6000,
                             en="Maider Chott", fr="Chott du Maïder",
                             aliases=["chott lac maider", "lac maider", "maider"]),
    "mercado-rissani":  dict(punto="Mercado de Rissani", kind="market", lat=31.2800, lng=-4.2650,
                             en="Rissani Market", fr="Marché de Rissani",
                             aliases=["mercado de rissani", "zoco de rissani", "souk de rissani"]),
    # Dades / M'Goun
    "mirador-dades":    dict(punto="Mirador del Dadès", kind="viewpoint", lat=31.4950, lng=-5.9050,
                             en="Dades Viewpoint", fr="Belvédère du Dadès",
                             aliases=["mirador del dades", "mirador del dadès"]),
    "valle-dades":      dict(punto="Valle del Dadès", kind="valley", lat=31.4000, lng=-5.9500,
                             en="Dades Valley", fr="Vallée du Dadès",
                             aliases=["valle del dades", "valle del dadès"]),
    "gargantas-mgoun":  dict(punto="Gargantas del M'Goun", kind="gorges", lat=31.5500, lng=-6.4000,
                             en="M'Goun Gorges", fr="Gorges du M'Goun",
                             aliases=["gargantas del m'goun", "gargantas del mgoun", "gargantas del m goun"]),
    # Ouarzazate
    "atlas-studios":    dict(punto="Atlas Studios", kind="site", lat=30.8950, lng=-6.9450,
                             en="Atlas Film Studios", fr="Studios Atlas",
                             aliases=["atlas studios", "estudios de cine", "atlas film studios"]),
    "kasbah-taourirt":  dict(punto="Kasbah de Taourirt", kind="kasbah", lat=30.9200, lng=-6.9000,
                             en="Taourirt Kasbah", fr="Kasbah de Taourirt",
                             aliases=["kasbah de taourirt", "taourirt"]),
    "kasbah-meteorite": dict(punto="Kasbah Hotel Meteorite", kind="hotel", lat=31.1000, lng=-4.0100,
                             en="Kasbah Hotel Meteorite", fr="Kasbah Hôtel Météorite",
                             aliases=["kasbah hotel meteorite", "hotel meteorite", "meteorite"]),
    "tizi-ntichka":     dict(punto="Tizi n'Tichka", kind="viewpoint", lat=31.2900, lng=-7.3800,
                             en="Tizi n'Tichka Pass", fr="Col du Tizi n'Tichka",
                             aliases=["tizi n'tichka", "tizi ntichka", "puerto de tizi n'tichka"]),
    # Middle Atlas
    "parque-khenifra":  dict(punto="Parque Nacional de Khenifra", kind="mountain", lat=32.8500, lng=-5.5000,
                             en="Khenifra National Park", fr="Parc national de Khénifra",
                             aliases=["parque nacional de khenifra"]),
}


def parse_csv():
    groups = {}
    with open(CSV_PATH, newline="", encoding="utf-8") as f:
        for row in csv.DictReader(f):
            p = (row["Punto"] or "").strip()
            if not p:
                continue
            groups.setdefault(p, []).append(((row["Título"] or "").strip(), (row["Descripción"] or "").strip()))
    return groups


async def translate_batch(strings):
    from emergentintegrations.llm.chat import LlmChat, UserMessage
    system = ("You are a professional translator for a premium Moroccan travel agency website. "
              "Translate faithfully from Spanish, preserving marketing tone and proper nouns. Return ONLY strict JSON.")
    prompt = ("Translate each Spanish string in this JSON array into English and French.\n"
              'Return a JSON array of objects in the SAME order, each {"en":"...","fr":"..."}.\n\n'
              + json.dumps(strings, ensure_ascii=False))
    chat = LlmChat(api_key=KEY, session_id=f"extra-{os.urandom(4).hex()}", system_message=system).with_model("openai", "gpt-4o-mini")
    resp = await chat.send_message(UserMessage(text=prompt))
    data = json.loads(re.search(r"\[.*\]", resp, re.S).group(0))
    if len(data) != len(strings):
        raise ValueError("len mismatch")
    return data


async def build_tr(strings):
    out = {}
    items = list(strings)
    for i in range(0, len(items), 10):
        chunk = items[i:i + 10]
        for a in range(3):
            try:
                for s, r in zip(chunk, await translate_batch(chunk)):
                    out[s] = {"en": str(r.get("en", "")).strip(), "fr": str(r.get("fr", "")).strip()}
                print(f"  {i+len(chunk)}/{len(items)}")
                break
            except Exception as e:
                print("retry", e)
                if a == 2:
                    raise
                await asyncio.sleep(2)
    return out


def js(s):
    return '"' + s.replace("\\", "\\\\").replace('"', '\\"') + '"'


def trio(es, tr):
    return f"T({js(es)}, {js(tr.get(es,{}).get('en') or es)}, {js(tr.get(es,{}).get('fr') or es)})"


async def main():
    groups = parse_csv()
    missing = [m["punto"] for m in TABLE.values() if m["punto"] not in groups]
    if missing:
        print("WARNING missing in CSV:", missing)
    uniq = []
    for m in TABLE.values():
        for (t, d) in groups.get(m["punto"], [])[:3]:
            uniq += [t, d]
    uniq = list(dict.fromkeys(uniq))
    print(f"strings: {len(uniq)}")
    tr = await build_tr(uniq)

    L = ["/* AUTO-GENERATED — new Day-Map POIs (gazetteer + 3-card copy).",
         "   Imperial Cities circuit batch. ES from client CSV, EN/FR auto-translated.",
         "   Images fall back to thematic-by-kind until Pexels photos are wired. */",
         "", "const T = (es, en, fr) => ({ es, en, fr });", "", "export const EXTRA_POIS = ["]
    for pid, m in TABLE.items():
        cards = groups.get(m["punto"], [])[:3]
        blurb = trio(cards[0][1], tr) if cards else "T(\"\",\"\",\"\")"
        al = ", ".join(js(a) for a in m["aliases"])
        L.append(f"  {{ id: {js(pid)}, kind: {js(m['kind'])}, lat: {m['lat']}, lng: {m['lng']},")
        L.append(f"    name: T({js(m['punto'])}, {js(m['en'])}, {js(m['fr'])}),")
        L.append(f"    blurb: {blurb},")
        L.append(f"    aliases: [{al}] }},")
    L += ["];", "", "export const EXTRA_POI_CARDS = {"]
    for pid, m in TABLE.items():
        cards = groups.get(m["punto"], [])[:3]
        if not cards:
            continue
        L.append(f"  {js(pid)}: [")
        for (t, d) in cards:
            L.append("    {")
            L.append(f"      title: {trio(t, tr)},")
            L.append(f"      description: {trio(d, tr)},")
            L.append("    },")
        L.append("  ],")
    L += ["};", "", "export default EXTRA_POIS;", ""]
    OUT_PATH.write_text("\n".join(L), encoding="utf-8")
    print("Wrote", OUT_PATH, "POIs:", len(TABLE))


if __name__ == "__main__":
    asyncio.run(main())
