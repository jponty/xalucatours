/* ============================================================
   allTripsCatalog.js
   ----
   Single source of truth for the "Every trip we offer" section
   on the Home page. Each entry maps a registered routeId from
   `lib/routes.js` to a card with region / duration / pace tags
   so the user can filter the full catalog at a glance.

   Adding a new program later is a one-line append here — the
   Home section reads from this array and rebuilds the grid.

   Pace scale (subjective travel intensity):
     - calmo:        2-3 nights, one base, minimal driving
     - equilibrado:  4-6 nights, two/three bases, moderate driving
     - intenso:      7+ nights, multiple regions, long driving days

   Region (matches the marketing regions, NOT geographical):
     - sur · norte · completo · escapadas · aventura · eventos
============================================================ */

import { IMG } from "./imageBank";

const i18n = (es, en, fr) => ({ es, en, fr });

/* Per-route MASTER images (unique, relevant photos sourced from Unsplash by
   destination/title). These are the reference images for each route; the
   Hero and every listing inherit them via lib/tripHero.js. */
const ROUTE_IMAGES = {
  tourAtlasDesierto45: "https://images.unsplash.com/photo-1581080565335-47b4b5e7abf1?ixid=M3w5NjI2MDV8MHwxfHNlYXJjaHwxfHxBaXQlMjBCZW5oYWRkb3UlMjBrYXNiYWglMjBNb3JvY2NvfGVufDF8MHx8fDE3ODA0MzU3MTZ8MA&ixlib=rb-4.1.0&w=1600&q=80&fit=crop&fm=jpg&auto=format",
  tourAtlasDesierto56: "https://images.unsplash.com/photo-1527960299979-ae13298358b6?ixid=M3w5NjI2MDV8MHwxfHNlYXJjaHwxfHxrYXNiYWglMjByb2FkJTIwRGFkZXMlMjBNb3JvY2NvfGVufDF8MHx8fDE3ODA0MzU3MTd8MA&ixlib=rb-4.1.0&w=1600&q=80&fit=crop&fm=jpg&auto=format",
  tourAtlasDesierto67: "https://images.unsplash.com/photo-1553523291-8bac4d75344d?ixid=M3w5NjI2MDV8MHwxfHNlYXJjaHwxfHxUb2RyYSUyMGdvcmdlJTIwTW9yb2Njb3xlbnwxfDB8fHwxNzgwNDM1NzE3fDA&ixlib=rb-4.1.0&w=1600&q=80&fit=crop&fm=jpg&auto=format",
  tourDesiertoAtlas67: "https://images.unsplash.com/photo-1548364504-57247d6f96bb?ixid=M3w5NjI2MDV8MHwxfHNlYXJjaHwxfHxTYWhhcmElMjBkdW5lcyUyME1vcm9jY28lMjBzdW5yaXNlfGVufDF8MHx8fDE3ODA0MzU3MTh8MA&ixlib=rb-4.1.0&w=1600&q=80&fit=crop&fm=jpg&auto=format",
  tourMarrakechErg45: "https://images.unsplash.com/photo-1597212618440-806262de4f6b?ixid=M3w5NjI2MDV8MHwxfHNlYXJjaHwxfHxLb3V0b3ViaWElMjBNYXJyYWtlY2glMjBNb3JvY2NvfGVufDF8MHx8fDE3ODA0MzU3MTl8MA&ixlib=rb-4.1.0&w=1600&q=80&fit=crop&fm=jpg&auto=format",
  tourMarrakechErg56: "https://images.unsplash.com/photo-1559586616-361e18714958?ixid=M3w5NjI2MDV8MHwxfHNlYXJjaHwxfHxFcmclMjBDaGViYmklMjBkdW5lcyUyME1vcm9jY298ZW58MXwwfHx8MTc4MDQzNTcxOXww&ixlib=rb-4.1.0&w=1600&q=80&fit=crop&fm=jpg&auto=format",
  tourMarrakechErg67: "https://images.unsplash.com/photo-1597662786834-8eea85ad4841?ixid=M3w5NjI2MDV8MHwxfHNlYXJjaHwxfHxBdGxhcyUyMG1vdW50YWlucyUyMHNub3clMjBNb3JvY2NvfGVufDF8MHx8fDE3ODA0MzU3MjB8MA&ixlib=rb-4.1.0&w=1600&q=80&fit=crop&fm=jpg&auto=format",
  tourMarrakechLoop34: "https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?ixid=M3w5NjI2MDV8MHwxfHNlYXJjaHwyfHxNYXJyYWtlY2glMjBtZWRpbmElMjBNb3JvY2NvfGVufDF8MHx8fDE3ODA0MzU3MjF8MA&ixlib=rb-4.1.0&w=1600&q=80&fit=crop&fm=jpg&auto=format",
  tourMarrakechLoop45: "https://images.unsplash.com/photo-1511185307590-3c29c11275ca?ixid=M3w5NjI2MDV8MHwxfHNlYXJjaHwyfHxNZXJ6b3VnYSUyMGRlc2VydCUyMGR1bmVzJTIwTW9yb2Njb3xlbnwxfDB8fHwxNzgwNDM1NzIxfDA&ixlib=rb-4.1.0&w=1600&q=80&fit=crop&fm=jpg&auto=format",
  tourMarrakechLoop56: "https://images.unsplash.com/photo-1597823262196-cc7e878d73ce?ixid=M3w5NjI2MDV8MHwxfHNlYXJjaHwyfHxBdGxhcyUyMGJlcmJlciUyMHZpbGxhZ2UlMjBNb3JvY2NvfGVufDF8MHx8fDE3ODA0MzU3MjJ8MA&ixlib=rb-4.1.0&w=1600&q=80&fit=crop&fm=jpg&auto=format",
  tourMarrakechLoop67: "https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?ixid=M3w5NjI2MDV8MHwxfHNlYXJjaHwxfHxEcmFhJTIwdmFsbGV5JTIwcGFsbSUyMGdyb3ZlJTIwTW9yb2Njb3xlbnwxfDB8fHwxNzgwNDM1NzIzfDA&ixlib=rb-4.1.0&w=1600&q=80&fit=crop&fm=jpg&auto=format",
  tourMarrakechEss45: "https://images.unsplash.com/photo-1624802746702-60ca95bdb605?ixid=M3w5NjI2MDV8MHwxfHNlYXJjaHwxfHxFc3Nhb3VpcmElMjBwb3J0JTIwTW9yb2Njb3xlbnwxfDB8fHwxNzgwNDM1NzI0fDA&ixlib=rb-4.1.0&w=1600&q=80&fit=crop&fm=jpg&auto=format",
  tourFezRak67: "https://images.unsplash.com/photo-1527338611623-4e242563220a?ixid=M3w5NjI2MDV8MHwxfHNlYXJjaHw0fHxGZXolMjBtZWRpbmElMjBNb3JvY2NvfGVufDF8MHx8fDE3ODA0MzU3MjR8MA&ixlib=rb-4.1.0&w=1600&q=80&fit=crop&fm=jpg&auto=format",
  tourFezRak78: "https://images.unsplash.com/photo-1613506021358-356ee3885696?ixid=M3w5NjI2MDV8MHwxfHNlYXJjaHwxfHxGZXolMjB0YW5uZXJ5JTIwTW9yb2Njb3xlbnwxfDB8fHwxNzgwNDM1NzI1fDA&ixlib=rb-4.1.0&w=1600&q=80&fit=crop&fm=jpg&auto=format",
  tourMarrakechFez67: "https://images.unsplash.com/photo-1760681556332-c7b60e649332?ixid=M3w5NjI2MDV8MHwxfHNlYXJjaHwxfHxNb3JvY2NhbiUyMHJpYWQlMjBjb3VydHlhcmR8ZW58MXwwfHx8MTc4MDQzNTcyNnww&ixlib=rb-4.1.0&w=1600&q=80&fit=crop&fm=jpg&auto=format",
  tourMarrakechFez89: "https://images.unsplash.com/photo-1650709042954-960b207eda51?ixid=M3w5NjI2MDV8MHwxfHNlYXJjaHwxfHxWb2x1YmlsaXMlMjBSb21hbiUyMHJ1aW5zJTIwTW9yb2Njb3xlbnwxfDB8fHwxNzgwNDM1NzI2fDA&ixlib=rb-4.1.0&w=1600&q=80&fit=crop&fm=jpg&auto=format",
  tourMarrakechFez910: "https://images.unsplash.com/photo-1729442045650-8753bd2e6d93?ixid=M3w5NjI2MDV8MHwxfHNlYXJjaHwxfHxBdGxhcyUyMG1vdW50YWluJTIwcm9hZCUyME1vcm9jY298ZW58MXwwfHx8MTc4MDQzNTcyN3ww&ixlib=rb-4.1.0&w=1600&q=80&fit=crop&fm=jpg&auto=format",
  tourTangerRak89: "https://images.unsplash.com/photo-1569383746724-6f1b882b8f46?ixid=M3w5NjI2MDV8MHwxfHNlYXJjaHwxfHxDaGVmY2hhb3VlbiUyMGJsdWUlMjBjaXR5JTIwTW9yb2Njb3xlbnwxfDB8fHwxNzgwNDM1NzI4fDA&ixlib=rb-4.1.0&w=1600&q=80&fit=crop&fm=jpg&auto=format",
  tourTangerRak910: "https://images.unsplash.com/flagged/photo-1555169048-3c4845cfcf1c?ixid=M3w5NjI2MDV8MHwxfHNlYXJjaHwxfHxDaGVmY2hhb3VlbiUyMGJsdWUlMjBzdHJlZXQlMjBNb3JvY2NvfGVufDF8MHx8fDE3ODA0MzU3Mjh8MA&ixlib=rb-4.1.0&w=1600&q=80&fit=crop&fm=jpg&auto=format",
  tourCiudadesImperiales45: "https://images.unsplash.com/photo-1737921650058-200b00360ada?ixid=M3w5NjI2MDV8MHwxfHNlYXJjaHwxfHxIYXNzYW4lMjB0b3dlciUyMFJhYmF0JTIwTW9yb2Njb3xlbnwxfDB8fHwxNzgwNDM1NzI5fDA&ixlib=rb-4.1.0&w=1600&q=80&fit=crop&fm=jpg&auto=format",
  tourCiudadesImperiales67: "https://images.unsplash.com/photo-1538230575309-59dfc388ae36?ixid=M3w5NjI2MDV8MHwxfHNlYXJjaHwxfHxDYXNhYmxhbmNhJTIwSGFzc2FuJTIwSUklMjBtb3NxdWUlMjBNb3JvY2NvfGVufDF8MHx8fDE3ODA0MzU3Mjl8MA&ixlib=rb-4.1.0&w=1600&q=80&fit=crop&fm=jpg&auto=format",
  tourCiudadesImperialesRif67: "https://images.unsplash.com/photo-1564507004663-b6dfb3c824d5?ixid=M3w5NjI2MDV8MHwxfHNlYXJjaHwyfHxDaGVmY2hhb3VlbiUyMG1lZGluYSUyME1vcm9jY298ZW58MXwwfHx8MTc4MDQzNTczMHww&ixlib=rb-4.1.0&w=1600&q=80&fit=crop&fm=jpg&auto=format",
  tourCiudadesImperialesRif78: "https://images.unsplash.com/photo-1515386474292-47555758ef2e?ixid=M3w5NjI2MDV8MHwxfHNlYXJjaHwyfHxUZXRvdWFuJTIwbWVkaW5hJTIwTW9yb2Njb3xlbnwxfDB8fHwxNzgwNDM1NzMxfDA&ixlib=rb-4.1.0&w=1600&q=80&fit=crop&fm=jpg&auto=format",
  tourTangerFez45: "https://images.unsplash.com/photo-1654022945053-f61ac2bf839a?ixid=M3w5NjI2MDV8MHwxfHNlYXJjaHwxfHxUYW5naWVyJTIwTW9yb2NjbyUyMGNvYXN0fGVufDF8MHx8fDE3ODA0MzU3MzF8MA&ixlib=rb-4.1.0&w=1600&q=80&fit=crop&fm=jpg&auto=format",
  tourTangerFez56: "https://images.unsplash.com/photo-1701676639172-421b5e0b148b?ixid=M3w5NjI2MDV8MHwxfHNlYXJjaHwzfHxDaGVmY2hhb3VlbiUyMGFsbGV5JTIwTW9yb2Njb3xlbnwxfDB8fHwxNzgwNDM1NzMyfDA&ixlib=rb-4.1.0&w=1600&q=80&fit=crop&fm=jpg&auto=format",
  tourFezTanger56: "https://images.unsplash.com/photo-1768213469879-bd3358bc8aa2?ixid=M3w5NjI2MDV8MHwxfHNlYXJjaHwxfHxGZXolMjByb29mdG9wcyUyME1vcm9jY298ZW58MXwwfHx8MTc4MDQzNTczMnww&ixlib=rb-4.1.0&w=1600&q=80&fit=crop&fm=jpg&auto=format",
  tourFezTanger67: "https://images.unsplash.com/photo-1536237717235-0acadb345d8c?ixid=M3w5NjI2MDV8MHwxfHNlYXJjaHw0fHxBc2lsYWglMjBNb3JvY2NvfGVufDF8MHx8fDE3ODA0MzU3MzN8MA&ixlib=rb-4.1.0&w=1600&q=80&fit=crop&fm=jpg&auto=format",
  tourEscapadaMarrakech23: "https://images.unsplash.com/photo-1531230689007-0b32d7a7c33e?ixid=M3w5NjI2MDV8MHwxfHNlYXJjaHwzfHxKZW1hYSUyMGVsJTIwRm5hJTIwTWFycmFrZWNoJTIwTW9yb2Njb3xlbnwxfDB8fHwxNzgwNDM1NzM0fDA&ixlib=rb-4.1.0&w=1600&q=80&fit=crop&fm=jpg&auto=format",
  tourEscapadaRakAgafay34: "https://images.unsplash.com/photo-1489573280374-2e193c63726c?ixid=M3w5NjI2MDV8MHwxfHNlYXJjaHw0fHxBZ2FmYXklMjBkZXNlcnQlMjBNb3JvY2NvfGVufDF8MHx8fDE3ODA0MzU3MzV8MA&ixlib=rb-4.1.0&w=1600&q=80&fit=crop&fm=jpg&auto=format",
  tourEscapadaRakErgRak23: "https://images.unsplash.com/photo-1689322366136-4740ee40d932?ixid=M3w5NjI2MDV8MHwxfHNlYXJjaHwxfHxTYWhhcmElMjBzdW5zZXQlMjBjYW1lbCUyME1vcm9jY298ZW58MXwwfHx8MTc4MDQzNTczNXww&ixlib=rb-4.1.0&w=1600&q=80&fit=crop&fm=jpg&auto=format",
  tourEscapadaRakErgRak34: "https://images.unsplash.com/photo-1624802294472-4dc449c1c127?ixid=M3w5NjI2MDV8MHwxfHNlYXJjaHwyfHxIaWdoJTIwQXRsYXMlMjB2aWxsYWdlJTIwTW9yb2Njb3xlbnwxfDB8fHwxNzgwNDM1NzM2fDA&ixlib=rb-4.1.0&w=1600&q=80&fit=crop&fm=jpg&auto=format",
  tourEscapadaFez23: "https://images.unsplash.com/flagged/photo-1555169048-5c540765a212?ixid=M3w5NjI2MDV8MHwxfHNlYXJjaHwyfHxGZXolMjBibHVlJTIwZ2F0ZSUyME1vcm9jY298ZW58MXwwfHx8MTc4MDQzNTczN3ww&ixlib=rb-4.1.0&w=1600&q=80&fit=crop&fm=jpg&auto=format",
  tourEscapadaFez34: "https://images.unsplash.com/photo-1534273006427-1686266049b7?ixid=M3w5NjI2MDV8MHwxfHNlYXJjaHwxfHxNb3JvY2NhbiUyMHBvdHRlcnklMjBjcmFmdHN8ZW58MXwwfHx8MTc4MDQzNTczN3ww&ixlib=rb-4.1.0&w=1600&q=80&fit=crop&fm=jpg&auto=format",
  tourEscapadaAtlas34: "https://images.unsplash.com/photo-1539790721942-75e9e9840c0c?ixid=M3w5NjI2MDV8MHwxfHNlYXJjaHw1fHxIaWdoJTIwQXRsYXMlMjBrYXNiYWglMjBNb3JvY2NvfGVufDF8MHx8fDE3ODA0MzU3Mzh8MA&ixlib=rb-4.1.0&w=1600&q=80&fit=crop&fm=jpg&auto=format",
  tourEscapadaDesierto34: "https://images.unsplash.com/photo-1769537145747-ff380b863f49?ixid=M3w5NjI2MDV8MHwxfHNlYXJjaHwxfHxFcmclMjBDaGViYmklMjBzdW5yaXNlJTIwTW9yb2Njb3xlbnwxfDB8fHwxNzgwNDM1NzM5fDA&ixlib=rb-4.1.0&w=1600&q=80&fit=crop&fm=jpg&auto=format",
  tourEnduroAventura45: "https://images.unsplash.com/photo-1545167496-31b3aa75296c?ixid=M3w5NjI2MDV8MHwxfHNlYXJjaHwxfHxtb3RvcmN5Y2xlJTIwZGVzZXJ0JTIwTW9yb2Njb3xlbnwxfDB8fHwxNzgwNDM1NzM5fDA&ixlib=rb-4.1.0&w=1600&q=80&fit=crop&fm=jpg&auto=format",
  tourEnduroAventura67: "https://images.unsplash.com/photo-1535191059345-c16453b851b2?ixid=M3w5NjI2MDV8MHwxfHNlYXJjaHwxfHxtb3RvcmJpa2UlMjBTYWhhcmElMjBkdW5lcyUyME1vcm9jY298ZW58MXwwfHx8MTc4MDQzNTc0MHww&ixlib=rb-4.1.0&w=1600&q=80&fit=crop&fm=jpg&auto=format",
  tourFinDeAno2025: "https://images.unsplash.com/photo-1697666326566-a405766d995f?ixid=M3w5NjI2MDV8MHwxfHNlYXJjaHwxfHxkZXNlcnQlMjBjYW1wJTIwbmlnaHQlMjBzdGFycyUyME1vcm9jY298ZW58MXwwfHx8MTc4MDQzNTc0MHww&ixlib=rb-4.1.0&w=1600&q=80&fit=crop&fm=jpg&auto=format",
  tourDesiertoAtlas45: "https://images.unsplash.com/photo-1731169243672-9f935e40b6c8?ixid=M3w5NjI2MDV8MHwxfHNlYXJjaHwxfHxFcmclMjBDaGViYmklMjBjYW1lbCUyME1vcm9jY298ZW58MXwwfHx8MTc4MDQzNTc2M3ww&ixlib=rb-4.1.0&w=1600&q=80&fit=crop&fm=jpg&auto=format",
  tourMarrakechEss67: "https://images.unsplash.com/photo-1624802704371-c76faa34c3a0?ixid=M3w5NjI2MDV8MHwxfHNlYXJjaHwyfHxFc3Nhb3VpcmElMjBNb3JvY2NvfGVufDF8MHx8fDE3ODA0MzU3NjR8MA&ixlib=rb-4.1.0&w=1600&q=80&fit=crop&fm=jpg&auto=format",
};

export const TRIP_REGIONS = [
  { id: "all",        label: i18n("Todos",               "All",                 "Tous") },
  { id: "sur",        label: i18n("Sur · Desierto",      "South · Desert",      "Sud · Désert") },
  { id: "norte",      label: i18n("Norte · Ciudades",    "North · Cities",      "Nord · Cités") },
  { id: "completo",   label: i18n("Marruecos integral",  "Full Morocco",        "Maroc intégral") },
  { id: "escapadas",  label: i18n("Escapadas cortas",    "Short escapes",       "Escapades courtes") },
  { id: "aventura",   label: i18n("Aventura",            "Adventure",           "Aventure") },
  { id: "eventos",    label: i18n("Eventos",             "Events",              "Événements") },
];

export const TRIP_PACES = [
  { id: "any",          label: i18n("Cualquier ritmo", "Any pace",      "Toute intensité") },
  { id: "calmo",        label: i18n("Relajado",        "Relaxed",        "Détendu") },
  { id: "equilibrado",  label: i18n("Equilibrado",     "Balanced",       "Équilibré") },
  { id: "intenso",      label: i18n("Intenso",         "Intense",        "Intense") },
];

export const TRIP_DURATIONS = [
  { id: "any",          label: i18n("Cualquier duración", "Any duration",    "Toute durée") },
  { id: "weekend",      label: i18n("2-3 noches",         "2-3 nights",      "2-3 nuits") },
  { id: "week",         label: i18n("4-6 noches",         "4-6 nights",      "4-6 nuits") },
  { id: "long",         label: i18n("7-10 noches",        "7-10 nights",     "7-10 nuits") },
];

const durationBucket = (nights) =>
  nights <= 3 ? "weekend" : nights <= 6 ? "week" : "long";

// `mk` is a tiny helper to keep entries compact and consistent.
const mk = ({ routeId, region, pace, nights, image, title, summary }) => ({
  routeId,
  region,
  pace,
  nights,
  durationBucket: durationBucket(nights),
  image: ROUTE_IMAGES[routeId] || image,
  title:   typeof title   === "string" ? i18n(title, title, title) : title,
  summary: typeof summary === "string" ? i18n(summary, summary, summary) : summary,
});

/* ---------- Catalog ---------- */
export const ALL_TRIPS = [
  // ── Sur · Atlas → Desierto / Desierto → Atlas ──
  mk({ routeId: "tourAtlasDesierto45", region: "sur", pace: "equilibrado", nights: 4, image: IMG.dunes,
    title: i18n("Atlas → Desierto · 4 noches", "Atlas → Desert · 4 nights", "Atlas → Désert · 4 nuits"),
    summary: i18n("Ouarzazate, Aït Benhaddou y bivouac en Erg Chebbi.", "Ouarzazate, Aït Benhaddou and an Erg Chebbi bivouac.", "Ouarzazate, Aït Benhaddou et bivouac à l'Erg Chebbi.") }),
  mk({ routeId: "tourAtlasDesierto56", region: "sur", pace: "equilibrado", nights: 5, image: IMG.kasbahArch,
    title: i18n("Atlas → Desierto · 5 noches", "Atlas → Desert · 5 nights", "Atlas → Désert · 5 nuits"),
    summary: i18n("Ruta de las kasbahs, Dadès y dos noches en las dunas.", "Kasbah route, Dadès and two nights in the dunes.", "Route des kasbahs, Dadès et deux nuits dans les dunes.") }),
  mk({ routeId: "tourAtlasDesierto67", region: "sur", pace: "intenso", nights: 6, image: IMG.atlasMisty,
    title: i18n("Atlas → Desierto · 6 noches", "Atlas → Desert · 6 nights", "Atlas → Désert · 6 nuits"),
    summary: i18n("Versión extendida con Skoura y Todra.", "Extended with Skoura and Todra.", "Version étendue avec Skoura et Todra.") }),
  mk({ routeId: "tourDesiertoAtlas45", region: "sur", pace: "equilibrado", nights: 4, image: IMG.camelCaravan,
    title: i18n("Desierto → Atlas · 4 noches", "Desert → Atlas · 4 nights", "Désert → Atlas · 4 nuits"),
    summary: i18n("Empezar por las dunas, terminar en Marrakech.", "Start in the dunes, end in Marrakech.", "Commencer par les dunes, finir à Marrakech.") }),
  mk({ routeId: "tourDesiertoAtlas67", region: "sur", pace: "intenso", nights: 6, image: IMG.dunesRocky,
    title: i18n("Desierto → Atlas · 6 noches", "Desert → Atlas · 6 nights", "Désert → Atlas · 6 nuits"),
    summary: i18n("Erg Chebbi, gargantas del Todra y Aït Benhaddou.", "Erg Chebbi, Todra gorges and Aït Benhaddou.", "Erg Chebbi, gorges du Todra et Aït Benhaddou.") }),

  // ── Sur · Marrakech → Erg Chebbi (linear) ──
  mk({ routeId: "tourMarrakechErg45", region: "sur", pace: "equilibrado", nights: 4, image: IMG.koutoubia,
    title: i18n("Marrakech → Erg Chebbi · 4 noches", "Marrakech → Erg Chebbi · 4 nights", "Marrakech → Erg Chebbi · 4 nuits"),
    summary: i18n("Cruce clásico del Atlas en cuatro días.", "Classic Atlas crossing in four days.", "Traversée classique de l'Atlas en quatre jours.") }),
  mk({ routeId: "tourMarrakechErg56", region: "sur", pace: "equilibrado", nights: 5, image: IMG.dunes,
    title: i18n("Marrakech → Erg Chebbi · 5 noches", "Marrakech → Erg Chebbi · 5 nights", "Marrakech → Erg Chebbi · 5 nuits"),
    summary: i18n("Versión cómoda con dos noches en Erg Chebbi.", "Comfortable version with two Erg Chebbi nights.", "Version confortable avec deux nuits à l'Erg Chebbi.") }),
  mk({ routeId: "tourMarrakechErg67", region: "sur", pace: "intenso", nights: 6, image: IMG.atlasSnowy,
    title: i18n("Marrakech → Erg Chebbi · 6 noches", "Marrakech → Erg Chebbi · 6 nights", "Marrakech → Erg Chebbi · 6 nuits"),
    summary: i18n("Sumando Skoura, Dadès y palmeral.", "Adds Skoura, Dadès and palm grove.", "Avec Skoura, Dadès et palmeraie.") }),

  // ── Sur · Loop Marrakech (round-trip) ──
  mk({ routeId: "tourMarrakechLoop34", region: "sur", pace: "calmo", nights: 3, image: IMG.kasbahGate,
    title: i18n("Loop Marrakech · 3 noches", "Marrakech Loop · 3 nights", "Boucle Marrakech · 3 nuits"),
    summary: i18n("Ida y vuelta corta al desierto desde Marrakech.", "Short desert round-trip from Marrakech.", "Aller-retour court au désert depuis Marrakech.") }),
  mk({ routeId: "tourMarrakechLoop45", region: "sur", pace: "equilibrado", nights: 4, image: IMG.dunes,
    title: i18n("Loop Marrakech · 4 noches", "Marrakech Loop · 4 nights", "Boucle Marrakech · 4 nuits"),
    summary: i18n("La opción más vendida — equilibrada y completa.", "Our best-seller — balanced and complete.", "Notre best-seller — équilibré et complet.") }),
  mk({ routeId: "tourMarrakechLoop56", region: "sur", pace: "equilibrado", nights: 5, image: IMG.atlasValley,
    title: i18n("Loop Marrakech · 5 noches", "Marrakech Loop · 5 nights", "Boucle Marrakech · 5 nuits"),
    summary: i18n("Sin prisa, con margen para improvisar paradas.", "Unhurried, with room to improvise stops.", "Sans hâte, avec marge pour improviser.") }),
  mk({ routeId: "tourMarrakechLoop67", region: "sur", pace: "intenso", nights: 6, image: IMG.atlasSnowy,
    title: i18n("Loop Marrakech · 6 noches", "Marrakech Loop · 6 nights", "Boucle Marrakech · 6 nuits"),
    summary: i18n("Versión extendida con valle del Drâa.", "Extended with the Drâa valley.", "Version étendue avec la vallée du Drâa.") }),

  // ── Sur · Marrakech ↔ Essaouira ──
  mk({ routeId: "tourMarrakechEss45", region: "sur", pace: "equilibrado", nights: 4, image: IMG.essaouiraPort,
    title: i18n("Marrakech & Essaouira · 4 noches", "Marrakech & Essaouira · 4 nights", "Marrakech & Essaouira · 4 nuits"),
    summary: i18n("Medina imperial + puerto atlántico de Essaouira.", "Imperial medina + Atlantic port of Essaouira.", "Médina impériale + port atlantique d'Essaouira.") }),
  mk({ routeId: "tourMarrakechEss67", region: "sur", pace: "intenso", nights: 6, image: IMG.essaouiraPort,
    title: i18n("Marrakech & Essaouira · 6 noches", "Marrakech & Essaouira · 6 nights", "Marrakech & Essaouira · 6 nuits"),
    summary: i18n("Versión amplia con Sidi Kaouki y argán.", "Wider version with Sidi Kaouki and argan.", "Version étendue avec Sidi Kaouki et argan.") }),

  // ── Gran Sur · Fez ↔ Marrakech ──
  mk({ routeId: "tourFezRak67",  region: "completo", pace: "intenso", nights: 6, image: IMG.medinaPeople,
    title: i18n("Fez → Marrakech · 6 noches", "Fez → Marrakech · 6 nights", "Fès → Marrakech · 6 nuits"),
    summary: i18n("Imperial → cedros del Atlas → desierto → Marrakech.", "Imperial → Atlas cedars → desert → Marrakech.", "Impérial → cèdres → désert → Marrakech.") }),
  mk({ routeId: "tourFezRak78",  region: "completo", pace: "intenso", nights: 7, image: IMG.riadFountain,
    title: i18n("Fez → Marrakech · 7 noches", "Fez → Marrakech · 7 nights", "Fès → Marrakech · 7 nuits"),
    summary: i18n("Mismo recorrido con margen para artesanos.", "Same route with time for artisans.", "Même itinéraire avec du temps pour les artisans.") }),
  mk({ routeId: "tourMarrakechFez67", region: "completo", pace: "intenso", nights: 6, image: IMG.riadInterior,
    title: i18n("Marrakech → Fez · 6 noches", "Marrakech → Fez · 6 nights", "Marrakech → Fès · 6 nuits"),
    summary: i18n("Sentido inverso, cerrando en Fez.", "Reverse direction, closing in Fez.", "Sens inverse, finissant à Fès.") }),
  mk({ routeId: "tourMarrakechFez89", region: "completo", pace: "intenso", nights: 8, image: IMG.kasbahArch,
    title: i18n("Marrakech → Fez · 8 noches", "Marrakech → Fez · 8 nights", "Marrakech → Fès · 8 nuits"),
    summary: i18n("Versión amplia con Sidi Ali y Volúbilis.", "Wider with Sidi Ali and Volubilis.", "Étendu avec Sidi Ali et Volubilis.") }),
  mk({ routeId: "tourMarrakechFez910", region: "completo", pace: "intenso", nights: 9, image: IMG.atlasValley,
    title: i18n("Marrakech → Fez · 9 noches", "Marrakech → Fez · 9 nights", "Marrakech → Fès · 9 nuits"),
    summary: i18n("La travesía más completa que hacemos.", "Our most comprehensive crossing.", "Notre traversée la plus complète.") }),

  // ── Gran Sur · Tánger ↔ Marrakech ──
  mk({ routeId: "tourTangerRak89",  region: "completo", pace: "intenso", nights: 8, image: IMG.chefBlueCity,
    title: i18n("Tánger → Marrakech · 8 noches", "Tangier → Marrakech · 8 nights", "Tanger → Marrakech · 8 nuits"),
    summary: i18n("Del estrecho al Sáhara — el país entero.", "From the strait to the Sahara — the whole country.", "Du détroit au Sahara — tout le pays.") }),
  mk({ routeId: "tourTangerRak910", region: "completo", pace: "intenso", nights: 9, image: IMG.chefAlley,
    title: i18n("Tánger → Marrakech · 9 noches", "Tangier → Marrakech · 9 nights", "Tanger → Marrakech · 9 nuits"),
    summary: i18n("Versión amplia incluyendo Chefchaouen.", "Wider, including Chefchaouen.", "Version étendue avec Chefchaouen.") }),

  // ── Norte · Ciudades Imperiales ──
  mk({ routeId: "tourCiudadesImperiales45", region: "norte", pace: "equilibrado", nights: 4, image: IMG.medinaPeople,
    title: i18n("Ciudades imperiales · 4 noches", "Imperial cities · 4 nights", "Cités impériales · 4 nuits"),
    summary: i18n("Fez, Mequinez, Salé y Rabat con tres artesanos.", "Fez, Meknès, Salé and Rabat with three artisans.", "Fès, Meknès, Salé et Rabat avec trois artisans.") }),
  mk({ routeId: "tourCiudadesImperiales67", region: "norte", pace: "intenso", nights: 6, image: IMG.riadFountain,
    title: i18n("Ciudades imperiales · 6 noches", "Imperial cities · 6 nights", "Cités impériales · 6 nuits"),
    summary: i18n("Sumando Volúbilis, Moulay Idriss y Casablanca.", "Adds Volubilis, Moulay Idriss and Casablanca.", "Avec Volubilis, Moulay Idriss et Casablanca.") }),
  mk({ routeId: "tourCiudadesImperialesRif67", region: "norte", pace: "intenso", nights: 6, image: IMG.chefBlueCity,
    title: i18n("Ciudades imperiales + Rif · 6 noches", "Imperial cities + Rif · 6 nights", "Cités impériales + Rif · 6 nuits"),
    summary: i18n("Combinación con Chefchaouen y Tetuán.", "Combined with Chefchaouen and Tetouan.", "Combiné avec Chefchaouen et Tétouan.") }),
  mk({ routeId: "tourCiudadesImperialesRif78", region: "norte", pace: "intenso", nights: 7, image: IMG.chefStreet,
    title: i18n("Ciudades imperiales + Rif · 7 noches", "Imperial cities + Rif · 7 nights", "Cités impériales + Rif · 7 nuits"),
    summary: i18n("Versión completa con dos noches en Chefchaouen.", "Full version with two Chefchaouen nights.", "Version complète avec deux nuits à Chefchaouen.") }),

  // ── Norte · Tánger ↔ Fez ──
  mk({ routeId: "tourTangerFez45", region: "norte", pace: "equilibrado", nights: 4, image: IMG.chefCourtyard,
    title: i18n("Tánger → Fez · 4 noches", "Tangier → Fez · 4 nights", "Tanger → Fès · 4 nuits"),
    summary: i18n("Estrecho, Tetuán y descenso a Fez.", "Strait, Tetouan and descent to Fez.", "Détroit, Tétouan et descente à Fès.") }),
  mk({ routeId: "tourTangerFez56", region: "norte", pace: "equilibrado", nights: 5, image: IMG.chefAlley,
    title: i18n("Tánger → Fez · 5 noches", "Tangier → Fez · 5 nights", "Tanger → Fès · 5 nuits"),
    summary: i18n("Con noche extra en Chefchaouen.", "Adds an extra Chefchaouen night.", "Avec une nuit extra à Chefchaouen.") }),
  mk({ routeId: "tourFezTanger56", region: "norte", pace: "equilibrado", nights: 5, image: IMG.medinaPeople,
    title: i18n("Fez → Tánger · 5 noches", "Fez → Tangier · 5 nights", "Fès → Tanger · 5 nuits"),
    summary: i18n("Sentido inverso terminando en el estrecho.", "Reverse, ending at the strait.", "Sens inverse, finissant au détroit.") }),
  mk({ routeId: "tourFezTanger67", region: "norte", pace: "intenso", nights: 6, image: IMG.chefStreet,
    title: i18n("Fez → Tánger · 6 noches", "Fez → Tangier · 6 nights", "Fès → Tanger · 6 nuits"),
    summary: i18n("Versión extendida con Asilah.", "Extended with Asilah.", "Version étendue avec Asilah.") }),

  // ── Escapadas cortas ──
  mk({ routeId: "tourEscapadaMarrakech23", region: "escapadas", pace: "calmo", nights: 2, image: IMG.koutoubia,
    title: i18n("Marrakech · 2 noches", "Marrakech · 2 nights", "Marrakech · 2 nuits"),
    summary: i18n("Fin de semana en la ciudad roja.", "A weekend in the red city.", "Un week-end dans la ville rouge.") }),
  mk({ routeId: "tourEscapadaRakAgafay34", region: "escapadas", pace: "calmo", nights: 3, image: IMG.dunesRocky,
    title: i18n("Marrakech + Agafay · 3 noches", "Marrakech + Agafay · 3 nights", "Marrakech + Agafay · 3 nuits"),
    summary: i18n("Medina + desierto pedregoso a las puertas de Marrakech.", "Medina + stone desert at the gates of Marrakech.", "Médina + désert de pierre aux portes de Marrakech.") }),
  mk({ routeId: "tourEscapadaRakErgRak23", region: "escapadas", pace: "calmo", nights: 2, image: IMG.dunes,
    title: i18n("Loop Marrakech · 2 noches", "Marrakech Loop · 2 nights", "Boucle Marrakech · 2 nuits"),
    summary: i18n("La escapada al Sáhara más rápida posible.", "The quickest Sahara escape we offer.", "L'escapade au Sahara la plus rapide.") }),
  mk({ routeId: "tourEscapadaRakErgRak34", region: "escapadas", pace: "calmo", nights: 3, image: IMG.camelCaravan,
    title: i18n("Loop Marrakech · 3 noches", "Marrakech Loop · 3 nights", "Boucle Marrakech · 3 nuits"),
    summary: i18n("Tres días: medina, montaña y dunas.", "Three days: medina, mountain and dunes.", "Trois jours : médina, montagne et dunes.") }),
  mk({ routeId: "tourEscapadaFez23", region: "escapadas", pace: "calmo", nights: 2, image: IMG.medinaPeople,
    title: i18n("Fez · 2 noches", "Fez · 2 nights", "Fès · 2 nuits"),
    summary: i18n("Una inmersión corta en la medina más viva del mundo.", "A short dive into the world's liveliest medina.", "Une courte immersion dans la médina la plus vivante au monde.") }),
  mk({ routeId: "tourEscapadaFez34", region: "escapadas", pace: "calmo", nights: 3, image: IMG.riadInterior,
    title: i18n("Fez · 3 noches", "Fez · 3 nights", "Fès · 3 nuits"),
    summary: i18n("Cuatro días con un día completo de artesanos.", "Four days with a full artisans day.", "Quatre jours avec une journée artisans.") }),
  mk({ routeId: "tourEscapadaAtlas34", region: "escapadas", pace: "calmo", nights: 3, image: IMG.atlasMisty,
    title: i18n("Alto Atlas · 3 noches", "High Atlas · 3 nights", "Haut Atlas · 3 nuits"),
    summary: i18n("Tres días entre kasbahs y aldeas bereberes.", "Three days among kasbahs and Berber villages.", "Trois jours parmi kasbahs et villages berbères.") }),
  mk({ routeId: "tourEscapadaDesierto34", region: "escapadas", pace: "calmo", nights: 3, image: IMG.dunes,
    title: i18n("Desierto express · 3 noches", "Desert express · 3 nights", "Désert express · 3 nuits"),
    summary: i18n("Directos al Erg Chebbi para los que tienen poco tiempo.", "Straight to Erg Chebbi when time is tight.", "Directement à l'Erg Chebbi quand le temps presse.") }),

  // ── Aventura · Enduro ──
  mk({ routeId: "tourEnduroAventura45", region: "aventura", pace: "equilibrado", nights: 4, image: IMG.dunesRocky,
    title: i18n("Enduro Sahara · 4 noches", "Sahara enduro · 4 nights", "Enduro Sahara · 4 nuits"),
    summary: i18n("Pistas del Drâa en moto enduro, grupo reducido.", "Drâa tracks on enduro bikes, small group.", "Pistes du Drâa en moto enduro, petit groupe.") }),
  mk({ routeId: "tourEnduroAventura67", region: "aventura", pace: "intenso", nights: 6, image: IMG.dunes,
    title: i18n("Enduro Sahara · 6 noches", "Sahara enduro · 6 nights", "Enduro Sahara · 6 nuits"),
    summary: i18n("Expedición larga incluyendo Erg Chebbi.", "Long expedition including Erg Chebbi.", "Expédition longue incluant l'Erg Chebbi.") }),

  // ── Eventos ──
  mk({ routeId: "tourFinDeAno2025", region: "eventos", pace: "equilibrado", nights: 5, image: IMG.camelDunes,
    title: i18n("Fin de año 2026 en el desierto", "New Year's Eve 2026 in the desert", "Réveillon 2026 dans le désert"),
    summary: i18n("Cena bereber, fuego y campanadas bajo las estrellas.", "Berber dinner, firelight and bells under the stars.", "Dîner berbère, feu et cloches sous les étoiles.") }),
];
