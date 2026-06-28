/* ============================================================
   plannerTrips.js — the ONLY routes the planner can recommend.
   Every entry maps to a REAL Xaluca circuit (routeId resolves to
   an existing trip page, price via FromPrice and master image via
   tripHero). Derived from the curated catalog in lib/homeCarousels.

   Shape:
     routeId  → registered route (link / price / image)
     name     → trilingual display title
     days     → total days  ·  nights = days - 1
     entry/exit → airport/city ids (Steps 1 & 2)
     loop     → starts & ends in the same city
     stops    → ordered destination ids (the real itinerary spine)
     themes   → travel themes covered
     pace     → relajado | equilibrado | intenso
============================================================ */
import { tripHeroImage } from "@/lib/tripHero";
import { SOUTH_TRIPS, NORTH_TRIPS, FULL_TRIPS, SHORT_TRIPS } from "@/lib/homeCarousels";

const T = (es, en, fr) => ({ es, en, fr });

export const XALUCA_TRIPS = [
  /* ---- Sur · Atlas + Desierto ---- */
  {
    routeId: "tourAtlasDesierto67", days: 7, entry: "ouarzazate", exit: "errachidia", loop: false,
    name: T("Ouarzazate · Atlas · Erg Chebbi", "Ouarzazate · Atlas · Erg Chebbi", "Ouarzazate · Atlas · Erg Chebbi"),
    stops: ["ouarzazate", "aitbenhaddou", "skoura", "dades", "todra", "ergchebbi", "rissani"],
    themes: ["desierto", "kasbahs", "atlas", "oasis", "fotografia"], pace: "equilibrado",
  },
  {
    routeId: "tourAtlasDesierto56", days: 6, entry: "ouarzazate", exit: "errachidia", loop: false,
    name: T("Atlas · Desierto · Errachidia", "Atlas · Desert · Errachidia", "Atlas · Désert · Errachidia"),
    stops: ["ouarzazate", "aitbenhaddou", "dades", "todra", "ergchebbi"],
    themes: ["desierto", "kasbahs", "atlas"], pace: "equilibrado",
  },
  {
    routeId: "tourDesiertoAtlas56", days: 6, entry: "errachidia", exit: "ouarzazate", loop: false,
    name: T("Errachidia · Erg Chebbi · Atlas", "Errachidia · Erg Chebbi · Atlas", "Errachidia · Erg Chebbi · Atlas"),
    stops: ["errachidia", "ergchebbi", "rissani", "todra", "dades", "ouarzazate", "aitbenhaddou"],
    themes: ["desierto", "kasbahs", "atlas"], pace: "equilibrado",
  },

  /* ---- Grandes travesías Norte ↔ Sur ---- */
  {
    routeId: "tourMarrakechFez67", days: 7, entry: "marrakech", exit: "fez", loop: false,
    name: T("Marrakech → Fez · Ruta compacta", "Marrakech → Fez · Compact route", "Marrakech → Fès · Itinéraire compact"),
    stops: ["marrakech", "aitbenhaddou", "dades", "ergchebbi", "fez"],
    themes: ["ciudades-imperiales", "desierto", "kasbahs", "atlas", "cultura"], pace: "intenso",
  },
  {
    routeId: "tourMarrakechFez78", days: 8, entry: "marrakech", exit: "fez", loop: false,
    name: T("Marrakech · Atlas · Erg Chebbi · Fez", "Marrakech · Atlas · Erg Chebbi · Fez", "Marrakech · Atlas · Erg Chebbi · Fès"),
    stops: ["marrakech", "aitbenhaddou", "ouarzazate", "dades", "todra", "ergchebbi", "sidiali", "fez"],
    themes: ["ciudades-imperiales", "desierto", "kasbahs", "atlas", "cultura"], pace: "equilibrado",
  },
  {
    routeId: "tourMarrakechFez89", days: 9, entry: "marrakech", exit: "fez", loop: false,
    name: T("Marrakech a Fez por el Medio Atlas", "Marrakech to Fez via Middle Atlas", "Marrakech à Fès par le Moyen Atlas"),
    stops: ["marrakech", "aitbenhaddou", "ouarzazate", "dades", "todra", "ergchebbi", "sidiali", "medioatlas", "fez"],
    themes: ["ciudades-imperiales", "desierto", "kasbahs", "atlas", "naturaleza", "cultura"], pace: "equilibrado",
  },
  {
    routeId: "tourMarrakechFez910", days: 10, entry: "marrakech", exit: "fez", loop: false,
    name: T("Marrakech · Sahara · Fez — Ruta extendida", "Marrakech · Sahara · Fez — Extended route", "Marrakech · Sahara · Fès — Itinéraire prolongé"),
    stops: ["marrakech", "aitbenhaddou", "ouarzazate", "dades", "todra", "ergchebbi", "sidiali", "volubilis", "meknes", "fez"],
    themes: ["ciudades-imperiales", "desierto", "atlas", "kasbahs", "cultura", "oasis"], pace: "equilibrado",
  },
  {
    routeId: "tourFezRak910", days: 10, entry: "fez", exit: "marrakech", loop: false,
    name: T("Fez · Atlas · Erg Chebbi · Marrakech", "Fez · Atlas · Erg Chebbi · Marrakech", "Fès · Atlas · Erg Chebbi · Marrakech"),
    stops: ["fez", "medioatlas", "sidiali", "ergchebbi", "todra", "dades", "ouarzazate", "aitbenhaddou", "marrakech"],
    themes: ["ciudades-imperiales", "desierto", "atlas", "kasbahs", "cultura"], pace: "equilibrado",
  },
  {
    routeId: "tourGransurTangerRak", days: 12, entry: "tanger", exit: "marrakech", loop: false,
    name: T("Tánger · Chefchaouen · Fez · Sahara · Marrakech", "Tangier · Chefchaouen · Fez · Sahara · Marrakech", "Tanger · Chefchaouen · Fès · Sahara · Marrakech"),
    stops: ["tanger", "chefchaouen", "fez", "volubilis", "sidiali", "ergchebbi", "todra", "dades", "ouarzazate", "aitbenhaddou", "marrakech"],
    themes: ["ciudades-imperiales", "desierto", "costa", "cultura", "kasbahs", "atlas"], pace: "equilibrado",
  },

  /* ---- Norte · Ciudades imperiales & Rif ---- */
  {
    routeId: "tourCiudadesImperiales45", days: 5, entry: "fez", exit: "fez", loop: true,
    name: T("Ciudades imperiales · Fez · Meknès · Volubilis", "Imperial cities · Fez · Meknes · Volubilis", "Cités impériales · Fès · Meknès · Volubilis"),
    stops: ["fez", "meknes", "volubilis"],
    themes: ["ciudades-imperiales", "cultura", "fotografia"], pace: "relajado",
  },
  {
    routeId: "tourCiudadesImperialesRif67", days: 7, entry: "fez", exit: "tanger", loop: false,
    name: T("Ciudades imperiales & Rif", "Imperial cities & Rif", "Cités impériales & Rif"),
    stops: ["fez", "meknes", "volubilis", "chefchaouen", "tetuan", "tanger"],
    themes: ["ciudades-imperiales", "cultura", "costa", "fotografia"], pace: "equilibrado",
  },
  {
    routeId: "tourTangerFez45", days: 5, entry: "tanger", exit: "fez", loop: false,
    name: T("Tánger · Chefchaouen · Fez", "Tangier · Chefchaouen · Fez", "Tanger · Chefchaouen · Fès"),
    stops: ["tanger", "chefchaouen", "akchour", "fez"],
    themes: ["cultura", "naturaleza", "costa", "fotografia"], pace: "equilibrado",
  },
  {
    routeId: "tourTangerFez56", days: 6, entry: "tanger", exit: "fez", loop: false,
    name: T("Tánger · Tetuán · Chefchaouen · Fez", "Tangier · Tetouan · Chefchaouen · Fez", "Tanger · Tétouan · Chefchaouen · Fès"),
    stops: ["tanger", "tetuan", "chefchaouen", "volubilis", "fez"],
    themes: ["cultura", "costa", "ciudades-imperiales", "fotografia"], pace: "equilibrado",
  },
  {
    routeId: "tourFezTanger67", days: 7, entry: "fez", exit: "tanger", loop: false,
    name: T("Fez · Volubilis · Chefchaouen · Tánger", "Fez · Volubilis · Chefchaouen · Tangier", "Fès · Volubilis · Chefchaouen · Tanger"),
    stops: ["fez", "volubilis", "chefchaouen", "tetuan", "tanger", "capespartel"],
    themes: ["cultura", "ciudades-imperiales", "costa", "fotografia"], pace: "equilibrado",
  },

  /* ---- Escapadas cortas ---- */
  {
    routeId: "tourEscapadaDesierto34", days: 4, entry: "errachidia", exit: "errachidia", loop: true,
    name: T("Escapada al Erg Chebbi", "Erg Chebbi escape", "Escapade à l'Erg Chebbi"),
    stops: ["errachidia", "ergchebbi", "rissani", "erfoud"],
    themes: ["desierto", "oasis", "fotografia", "aventura"], pace: "relajado",
  },
  {
    routeId: "tourEscapadaAtlas34", days: 4, entry: "marrakech", exit: "marrakech", loop: true,
    name: T("Escapada al Alto Atlas", "High Atlas escape", "Escapade au Haut Atlas"),
    stops: ["marrakech", "altoatlas", "ourika"],
    themes: ["montana", "atlas", "trekking", "naturaleza", "relax"], pace: "relajado",
  },
  {
    routeId: "tourEscapadaFez", days: 4, entry: "fez", exit: "fez", loop: true,
    name: T("Escapada a Fez", "Fez escape", "Escapade à Fès"),
    stops: ["fez", "volubilis", "meknes"],
    themes: ["ciudades-imperiales", "cultura", "gastronomia"], pace: "relajado",
  },
  {
    routeId: "tourEscapadaMarrakech", days: 4, entry: "marrakech", exit: "marrakech", loop: true,
    name: T("Escapada a Marrakech", "Marrakech escape", "Escapade à Marrakech"),
    stops: ["marrakech", "ourika"],
    themes: ["ciudades-imperiales", "cultura", "relax", "gastronomia", "lujo"], pace: "relajado",
  },
  {
    routeId: "tourEscapadaTanger", days: 4, entry: "tanger", exit: "tanger", loop: true,
    name: T("Escapada a Tánger", "Tangier escape", "Escapade à Tanger"),
    stops: ["tanger", "capespartel", "chefchaouen"],
    themes: ["costa", "cultura", "fotografia", "relax"], pace: "relajado",
  },
];

export const TRIP_BY_ROUTE = XALUCA_TRIPS.reduce((m, t) => ((m[t.routeId] = t), m), {});

/* Master image resolver with graceful fallbacks:
   1) tripHero master (Home "Todos los viajes" catalog),
   2) Home carousels curated image,
   3) a beautiful neutral Morocco shot so the card is never empty. */
const CATALOG_IMG = [...SOUTH_TRIPS, ...NORTH_TRIPS, ...FULL_TRIPS, ...SHORT_TRIPS]
  .reduce((m, t) => (t && t.routeId && t.image ? ((m[t.routeId] = t.image), m) : m), {});
const DEFAULT_IMG = "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=1600&q=85";

export const tripImage = (routeId) => tripHeroImage(routeId) || CATALOG_IMG[routeId] || DEFAULT_IMG;

export default XALUCA_TRIPS;
