"""Fetch 3 color Pexels photos per new POI and write lib/extraPoiImages.js."""
import json
import os
import time
import urllib.parse
import urllib.request
from pathlib import Path
from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parent
load_dotenv(ROOT / ".env")
KEY = os.environ["PEXELS_API_KEY"]
OUT = ROOT.parent / "frontend" / "src" / "lib" / "extraPoiImages.js"

# id -> (primary query, fallback query)
QUERIES = {
    "hassan2-mosque": ("Hassan II Mosque Casablanca", "Casablanca Morocco mosque"),
    "oudayas": ("Kasbah Oudayas Rabat", "Rabat Morocco kasbah"),
    "torre-hassan": ("Hassan Tower Rabat", "Rabat Morocco monument"),
    "mausoleo-mohammed-v": ("Mausoleum Mohammed V Rabat", "Rabat Morocco mausoleum"),
    "chellah": ("Chellah Rabat", "Rabat Morocco ruins"),
    "bab-al-mansour": ("Bab Mansour Meknes", "Meknes Morocco gate"),
    "moulay-ismail-mausoleo": ("Moulay Ismail Mausoleum Meknes", "Meknes Morocco palace"),
    "heri-es-souani": ("Heri es Souani Meknes", "Meknes Morocco granary"),
    "habs-qara": ("Meknes medina Morocco", "Meknes Morocco"),
    "medina-fez": ("Fez medina Morocco", "Fes Morocco old city"),
    "chouara": ("Chouara tannery Fez", "Fes tannery leather"),
    "qarawiyyin": ("Al Quaraouiyine Fez", "Fes Morocco mosque courtyard"),
    "cedros-atlas": ("cedar forest Atlas Morocco", "cedar forest mountains"),
    "azrou": ("Azrou Morocco", "Middle Atlas Morocco town"),
    "khenifra": ("Khenifra Morocco", "Middle Atlas Morocco landscape"),
    "beni-mellal": ("Beni Mellal Morocco", "Morocco countryside town"),
    "jemaa-el-fna": ("Jemaa el Fna Marrakech", "Marrakech square night"),
    "medina-marrakech": ("Marrakech medina", "Marrakech souk alley"),
    "koutoubia": ("Koutoubia mosque Marrakech", "Marrakech mosque minaret"),
    "bahia-palace": ("Bahia Palace Marrakech", "Marrakech palace tilework"),
    "zocos-marrakech": ("Marrakech souk market", "Moroccan market spices"),
    "farmacia-bereber": ("Moroccan spices apothecary", "Moroccan herbs spices market"),
    "majorelle": ("Majorelle Garden Marrakech", "Majorelle blue garden"),
}


def search(q, n=6):
    url = "https://api.pexels.com/v1/search?" + urllib.parse.urlencode({"query": q, "per_page": n, "orientation": "landscape"})
    req = urllib.request.Request(url, headers={"Authorization": KEY, "User-Agent": "Mozilla/5.0 (XalucaBot)"})
    with urllib.request.urlopen(req, timeout=20) as r:
        return json.load(r).get("photos", [])


def pick3(pid):
    primary, fallback = QUERIES[pid]
    photos = search(primary)
    if len(photos) < 3:
        photos += search(fallback)
    seen, urls = set(), []
    for p in photos:
        if p["id"] in seen:
            continue
        seen.add(p["id"])
        urls.append(p["src"]["large"])
        if len(urls) == 3:
            break
    return urls


def main():
    result = {}
    for pid in QUERIES:
        try:
            urls = pick3(pid)
            result[pid] = urls
            print(pid, len(urls))
        except Exception as e:
            print("ERR", pid, e)
            result[pid] = []
        time.sleep(0.4)

    lines = ["/* AUTO-GENERATED — 3 color Pexels photos per new POI (Imperial Cities batch). */",
             "", "export const EXTRA_POI_IMAGES = {"]
    for pid, urls in result.items():
        if not urls:
            continue
        lines.append(f'  "{pid}": [')
        for u in urls:
            lines.append(f'    "{u}",')
        lines.append("  ],")
    lines += ["};", "", "export default EXTRA_POI_IMAGES;", ""]
    OUT.write_text("\n".join(lines), encoding="utf-8")
    print("Wrote", OUT, "with", len([k for k, v in result.items() if v]), "POIs")


if __name__ == "__main__":
    main()
