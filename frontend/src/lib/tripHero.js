/* ============================================================
   tripHero.js
   ----
   Single source of truth for a trip's MASTER image ("Hero Image").

   Every visual that represents a specific trip — the Hero of its
   detail page, its card in the home "Todos los viajes" catalog, the
   trips carousel, peer/recommendation cards, the escapada hero, etc.
   — references the SAME global CMS slot:

        trip.${routeId}.hero

   Because the slot is global (no page/language prefix) and keyed by
   the stable `routeId`, editing the image anywhere updates it
   everywhere automatically and bidirectionally — one master image
   per trip, no duplicates, no cross-page inconsistencies.
============================================================ */
export const tripHeroSlot = (routeId) => `trip.${routeId}.hero`;

export default tripHeroSlot;
