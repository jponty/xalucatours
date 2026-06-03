"""Generator: reads the POI cards CSV (Spanish), auto-translates each
title/description to EN + FR via Emergent LLM, and writes
frontend/src/lib/poiCardCopy.js (POI_CARD_COPY) for points that already
have a gallery in the codebase. New places (no gallery yet) are reported.
"""
import asyncio
import csv
import json
import os
import re
from collections import OrderedDict
from pathlib import Path
from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parent
load_dotenv(ROOT / ".env")
KEY = os.environ["EMERGENT_LLM_KEY"]

CSV_PATH = ROOT / "_poi_cards2.csv"
OUT_PATH = ROOT.parent / "frontend" / "src" / "lib" / "poiCardCopy.js"

# CSV "Punto" -> list of EXISTING gallery code keys to apply the 3 cards to.
MAPPING = {
    "Aït Ben Haddou": ["aitben"],
    "Amanecer sobre las dunas": ["sunrise-dune"],
    "Anti-Atlas": ["antiatlas"],
    "Asilah": ["asilah"],
    "Boumalne Dades": ["boumalne-mercado"],
    "Boutaghrar": ["boutaghrar"],
    "Cabo Espartel": ["cabospartel"],
    "Canteras de fósiles marinos": ["canteras-fosiles", "fossils"],
    "Casablanca": ["casablanca"],
    "Chefchaouen": ["chefchaouen"],
    "Cordillera del Alto Atlas": ["atlas"],
    "Desierto de Agafay": ["agafay"],
    "Erg Chebbi": ["chebbi"],
    "Errachidia": ["errachidia"],
    "Erfoud": ["erfoud"],
    "Fez": ["fez"],
    "Gargantas del Dadès": ["dades", "gorges-dades"],
    "Gargantas del Todra": ["todra", "gorges-todra"],
    "Gran duna del Erg Chebbi": ["erg-chebbi-duna"],
    "Grutas de Hércules": ["grutashercules"],
    "Hassi Labied": ["hassi-labied"],
    "Hotel Xaluca Dades": ["xaluca-dades"],
    "Ifrane": ["ifrane"],
    "Kasbah Hotel Tombouctou": ["kasbah-tombouctou"],
    "Kasbah Hotel Xaluca": ["kasbah-xaluca", "kasbah-xaluca-erfoud"],
    "Khamlia": ["khamlia"],
    "Macizo del M'Goun": ["mgoun"],
    "Marrakech": ["marrakech"],
    "Meknès": ["meknes"],
    "Merdani": ["merdani"],
    "Merzouga": ["merzouga"],
    "Midelt": ["midelt"],
    "Mirador del desierto": ["mirador-desierto"],
    "Montañas del Rif": ["rif"],
    "Monte Toubkal": ["toubkal"],
    "Moulay Idriss": ["moulayidriss"],
    "Música Gnawa": ["khamlia-gnawa"],
    "Oasis del picnic": ["oasis-picnic"],
    "Ouarzazate": ["ouarzazate"],
    "Pistas del Rally Dakar": ["dakar-tracks"],
    "Pizzería Des Dunes": ["des-dunes"],
    "Rabat": ["rabat"],
    "Rissani": ["rissani", "rissani-mercado"],
    "Sidi Ali": ["sidiali"],
    "Tánger": ["tanger"],
    "Tetuán": ["tetuan"],
    "Tinerhir": ["tinerhir", "tinerhir-palm"],
    "Valle del Drâa": ["draa"],
    "Valle del Ziz": ["ziz", "valle-ziz"],
    "Volubilis": ["volubilis"],
    "Zagora": ["zagora"],
    "Bivouac de Luxe": ["bivouac-luxe"],
    # --- newly mapped existing galleries (Fase 1 expansion) ---
    "Essaouira": ["essaouira"],
    "Cascadas de Ouzoud": ["ouzoud"],
    "Valle de las Rosas": ["valle-rosas", "rosevalley"],
    "Patas de Mono": ["monkey-fingers"],
    "Akchour": ["akchour"],
    "Kem Kem": ["kemkem"],
    "Mirador del Valle del Ziz": ["mirador-ziz"],
    "Hotel Xaluca Spa Aguelmame Sidi Ali": ["sidiali"],
}


def parse_csv():
    groups = OrderedDict()
    with open(CSV_PATH, newline="", encoding="utf-8") as f:
        for row in csv.DictReader(f):
            p = (row["Punto"] or "").strip()
            t = (row["Título"] or "").strip()
            d = (row["Descripción"] or "").strip()
            if not p:
                continue
            groups.setdefault(p, []).append((t, d))
    return groups


async def translate_batch(strings):
    from emergentintegrations.llm.chat import LlmChat, UserMessage
    payload = json.dumps(strings, ensure_ascii=False)
    system = (
        "You are a professional translator for a premium Moroccan travel agency website. "
        "Translate faithfully from Spanish, preserving marketing tone, proper nouns and place names. "
        "Return ONLY strict JSON, no markdown."
    )
    prompt = (
        "Translate each Spanish string in this JSON array into English and French.\n"
        'Return a JSON array of objects in the SAME order, each like {"en":"...","fr":"..."}.\n\n'
        f"{payload}"
    )
    chat = LlmChat(api_key=KEY, session_id=f"poi-gen-{os.urandom(4).hex()}", system_message=system).with_model("openai", "gpt-4o-mini")
    resp = await chat.send_message(UserMessage(text=prompt))
    m = re.search(r"\[.*\]", resp, re.S)
    data = json.loads(m.group(0))
    if len(data) != len(strings):
        raise ValueError(f"len mismatch {len(data)} vs {len(strings)}")
    return data


async def build_translations(unique_strings):
    out = {}
    BATCH = 10
    items = list(unique_strings)
    for i in range(0, len(items), BATCH):
        chunk = items[i:i + BATCH]
        for attempt in range(3):
            try:
                res = await translate_batch(chunk)
                for s, r in zip(chunk, res):
                    out[s] = {"en": str(r.get("en", "")).strip(), "fr": str(r.get("fr", "")).strip()}
                print(f"  translated {i+len(chunk)}/{len(items)}")
                break
            except Exception as e:
                print(f"  batch {i} attempt {attempt+1} failed: {e}")
                if attempt == 2:
                    raise
                await asyncio.sleep(2)
    return out


def js_str(s):
    return '"' + s.replace("\\", "\\\\").replace('"', '\\"') + '"'


def trio(es, tr):
    en = tr.get(es, {}).get("en") or es
    fr = tr.get(es, {}).get("fr") or es
    return f"T({js_str(es)}, {js_str(en)}, {js_str(fr)})"


async def main():
    groups = parse_csv()
    uniq = OrderedDict()
    for p, cards in groups.items():
        if p not in MAPPING:
            continue
        for (t, d) in cards:
            uniq.setdefault(t, None)
            uniq.setdefault(d, None)
    mapped = [p for p in groups if p in MAPPING]
    unmapped = [p for p in groups if p not in MAPPING]
    print(f"Mapped points: {len(mapped)} | unique strings: {len(uniq)}")
    tr = await build_translations(uniq.keys())

    keyed = OrderedDict()
    for p, cards in groups.items():
        if p not in MAPPING:
            continue
        block = cards[:3]
        for key in MAPPING[p]:
            keyed[key] = block

    lines = [
        "/* AUTO-GENERATED — do not edit by hand.",
        "   New 3-card title/description copy for each point of interest, provided by the",
        "   client (ES) and auto-translated to EN/FR. Applied as an override in",
        "   LandmarkCarousel, keyed by the gallery code key (cityProfiles token,",
        "   landmarkGalleries id, or placeGalleries gazetteer id). */",
        "",
        "const T = (es, en, fr) => ({ es, en, fr });",
        "",
        "export const POI_CARD_COPY = {",
    ]
    for key, block in keyed.items():
        lines.append(f"  {js_str(key)}: [")
        for (t, d) in block:
            lines.append("    {")
            lines.append(f"      title: {trio(t, tr)},")
            lines.append(f"      description: {trio(d, tr)},")
            lines.append("    },")
        lines.append("  ],")
    lines += ["};", "", "export default POI_CARD_COPY;", ""]
    OUT_PATH.write_text("\n".join(lines), encoding="utf-8")
    print(f"Wrote {OUT_PATH} with {len(keyed)} keys")
    print(f"UNMAPPED ({len(unmapped)}):")
    for u in unmapped:
        print("   -", u)


if __name__ == "__main__":
    asyncio.run(main())
