/* ============================================================
   destinationKeywords.js
   ----
   Dynamic, content-aware destination index that powers the
   "Selección Pexels" tab in the image-edit uploader.

   HOW IT WORKS
   1. Candidates come from the site's own structured data — the
      curated `DESTINATIONS` catalogue (already trilingual + grouped
      by category) plus a small `EXTRA` list for headline places that
      recur across itineraries but aren't in the catalogue
      (Casablanca, Merzouga, Skoura).
   2. Relevance is computed by scanning ALL itinerary content
      (sur / norte / marruecos / escapadas itineraries, the day-by-day
      hubs, day landmarks and city descriptions) and counting how often
      each destination name appears. The more an itinerary mentions a
      place, the higher it ranks. Add or edit an itinerary and the
      ranking updates automatically on the next build — no manual list
      to maintain.
   3. Each destination maps to an optimised English Pexels query
      (English is best-indexed on Pexels) so the galleries return
      high-quality, on-topic Morocco photography.

   The heavy corpus scan is memoised and only runs the first time the
   tab is opened.
============================================================ */
import { DESTINATIONS, CATEGORIES } from "@/lib/destinations";
import { DAY_LANDMARKS } from "@/lib/dayLandmarks";
import { SUR_ITINERARIES } from "@/lib/surItineraries";
import { NORTE_ITINERARIES } from "@/lib/norteItineraries";
import { MARRUECOS_ITINERARIES } from "@/lib/marruecosItineraries";
import { ESCAPADAS_ITEMS } from "@/lib/escapadasItineraries";
import * as HUBS from "@/lib/itineraryHubs";

/* Headline destinations featured across the itineraries that are not in
   the "Qué ver" catalogue. Kept tiny + curated so categories stay clean. */
const EXTRA = [
  { id: "casablanca", category: "imperial", name: { es: "Casablanca", en: "Casablanca", fr: "Casablanca" } },
  { id: "merzouga",   category: "desierto", name: { es: "Merzouga",   en: "Merzouga",   fr: "Merzouga" } },
  { id: "skoura",     category: "oasis",    name: { es: "Skoura",     en: "Skoura",     fr: "Skoura" } },
];

/* Optimised Pexels search queries (English + "Morocco" for best hits).
   Anything not listed falls back to `${name.en} Morocco`. */
const QUERY_OVERRIDES = {
  marrakech:  "Marrakech Morocco",
  fez:        "Fes Morocco medina",
  rabat:      "Rabat Morocco",
  tanger:     "Tangier Morocco",
  chefchaouen:"Chefchaouen blue city Morocco",
  ouarzazate: "Ouarzazate kasbah Morocco",
  aitben:     "Ait Benhaddou kasbah Morocco",
  ergchebbi:  "Erg Chebbi Sahara dunes Morocco",
  dades:      "Dades Valley Morocco",
  todra:      "Todra Gorge Morocco",
  volubilis:  "Volubilis Roman ruins Morocco",
  meknes:     "Meknes Morocco",
  asilah:     "Asilah Morocco",
  tetuan:     "Tetouan Morocco",
  agadir:     "Agadir Morocco beach",
  dakhla:     "Dakhla Morocco lagoon",
  tafraoute:  "Tafraoute Anti-Atlas Morocco",
  legzira:    "Legzira beach Morocco",
  ouzoud:     "Ouzoud waterfalls Morocco",
  ifrane:     "Ifrane Morocco",
  draa:       "Draa Valley palm grove Morocco",
  rissani:    "Rissani Morocco market",
  tamegroute: "Tamegroute Morocco",
  essaouira:  "Essaouira Morocco",
  casablanca: "Casablanca Hassan II mosque Morocco",
  merzouga:   "Merzouga desert dunes Morocco",
  skoura:     "Skoura palm grove kasbah Morocco",
};

const pexelsQuery = (id, en) => QUERY_OVERRIDES[id] || `${en} Morocco`;

/* Build a single lowercase searchable corpus from every itinerary source. */
const buildCorpus = () => {
  try {
    return JSON.stringify([
      DAY_LANDMARKS,
      SUR_ITINERARIES,
      NORTE_ITINERARIES,
      MARRUECOS_ITINERARIES,
      ESCAPADAS_ITEMS,
      Object.values(HUBS || {}),
      DESTINATIONS.map((d) => d.description),
    ]).toLowerCase();
  } catch {
    return "";
  }
};

/* Count non-overlapping case-insensitive occurrences of any of `names`. */
const countOccurrences = (corpus, names) => {
  let total = 0;
  for (const raw of names) {
    const needle = (raw || "").toLowerCase().trim();
    if (needle.length < 3) continue;
    let from = 0;
    let idx;
    while ((idx = corpus.indexOf(needle, from)) !== -1) {
      total += 1;
      from = idx + needle.length;
    }
  }
  return total;
};

let _index = null;

const buildIndex = () => {
  const corpus = buildCorpus();
  const seen = new Set();
  const index = [];
  const candidates = [
    ...DESTINATIONS.map((d) => ({ id: d.id, category: d.category, name: d.name })),
    ...EXTRA,
  ];
  for (const d of candidates) {
    if (!d || !d.id || seen.has(d.id)) continue;
    seen.add(d.id);
    const en = (d.name && (d.name.en || d.name.es)) || d.id;
    index.push({
      id: d.id,
      category: CATEGORIES[d.category] ? d.category : "cultura",
      name: d.name,
      query: pexelsQuery(d.id, en),
      count: countOccurrences(corpus, [d.name?.es, d.name?.en, d.name?.fr]),
    });
  }
  return index;
};

/* Public API — returns destinations grouped by category, ordered by total
   relevance, with items sorted by relevance (occurrence count) then name. */
export const getDestinationGroups = (lang = "es") => {
  if (!_index) _index = buildIndex();
  const groups = new Map();
  for (const item of _index) {
    if (!groups.has(item.category)) groups.set(item.category, []);
    groups.get(item.category).push({
      id: item.id,
      label: (item.name && (item.name[lang] || item.name.es)) || item.id,
      query: item.query,
      count: item.count,
    });
  }
  const out = [];
  for (const [category, items] of groups.entries()) {
    items.sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
    out.push({
      category,
      label: (CATEGORIES[category]?.label?.[lang]) || category,
      color: CATEGORIES[category]?.color || "#C16542",
      items,
      total: items.reduce((sum, i) => sum + i.count, 0),
    });
  }
  out.sort((a, b) => b.total - a.total || a.label.localeCompare(b.label));
  return out;
};
