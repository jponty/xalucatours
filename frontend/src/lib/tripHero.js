/* ============================================================
   tripHero.js
   ----
   Single source of truth for a trip's MASTER image ("Hero Image").

   The MASTER reference image of every route is the one defined for
   its card in the Home "Todos los viajes" catalog (lib/allTripsCatalog
   → `image`). That same image:
     • is the default for the trip's Hero on its detail page,
     • drives every other card/listing/recommendation of that trip,
     • is shared through ONE global CMS slot `trip.${routeId}.hero`.

   Because the slot is global (no page/language prefix) and keyed by
   the stable `routeId`, editing the image anywhere updates it
   everywhere automatically and bidirectionally — one master image
   per trip, no duplicates, no cross-page inconsistencies.
============================================================ */
import { ALL_TRIPS } from "@/lib/allTripsCatalog";

export const tripHeroSlot = (routeId) => `trip.${routeId}.hero`;

/* Per-trip MASTER text slot (title, summary, tag, duration, route…). Shared by
   every card linking to the same trip page so editing copy anywhere keeps it in
   sync site-wide, mirroring the master image behaviour. */
export const tripTextSlot = (routeId, field) => `trip.${routeId}.${field}`;

/* Aggregate listing routes that map MANY distinct cards to a SINGLE page
   (e.g. all upcoming group departures share one route). These must NOT
   collapse to a single shared master image, so cards for them keep their
   own per-card slot instead of the trip-master slot. */
const AGGREGATE_ROUTES = new Set(["upcomingDepartures"]);

/* Whether a routeId should resolve to the shared per-trip MASTER image slot.
   Every card linking to the same real trip page shares `trip.${routeId}.hero`,
   so editing it anywhere updates every appearance bidirectionally. */
export const usesTripMaster = (routeId) =>
  Boolean(routeId) && !AGGREGATE_ROUTES.has(routeId);

/* routeId → master reference image (the Home catalog card image). */
const HERO_IMAGE_BY_ROUTE = ALL_TRIPS.reduce((map, trip) => {
  if (trip && trip.routeId && trip.image) map[trip.routeId] = trip.image;
  return map;
}, {});

/* The master default image for a route (used as the shared fallback by
   the Hero and every listing, so all appearances match from the start). */
export const tripHeroImage = (routeId) => HERO_IMAGE_BY_ROUTE[routeId] || null;

export default tripHeroSlot;
