/* ============================================================
   dayLandmarkCatalog.js
   ----
   Single, deduplicated catalog of every CURATED "punto de interés del
   día" used on the day maps (Mapa del día / Puntos de interés del día).

   Source = DAY_LANDMARKS (lib/dayLandmarks) — the hand-curated, day-by-day
   list of locations (Erg Chebbi, Khamlia, Hassi Labied, Mirador del Valle
   del Ziz, Canteras de fósiles marinos, …). Each location's "Galería del
   lugar" cards come from LANDMARK_GALLERIES (lib/landmarkGalleries), keyed
   by the same landmark `id`.

   Global CMS slots per location (one source of truth, synced everywhere
   the day map renders it — see DayRouteMap / LandmarkCarousel):
       name        → landmark.${id}.name
       blurb       → landmark.${id}.blurb
       card image  → landmark.${id}.gallery.${i}
       card title  → landmark.${id}.gallery.${i}.title
       card desc   → landmark.${id}.gallery.${i}.desc
============================================================ */
import { DAY_LANDMARKS } from "@/lib/dayLandmarks";
import { LANDMARK_GALLERIES } from "@/lib/landmarkGalleries";

const EMPTY = { es: "", en: "", fr: "" };

/* Global slots for a location's own info (name + blurb). */
export const landmarkInfoSlots = (id) => ({
  name: `landmark.${id}.name`,
  blurb: `landmark.${id}.blurb`,
});

/* Global slots for one "Galería del lugar" card of a location. */
export const landmarkCardSlots = (id, i) => ({
  image: `landmark.${id}.gallery.${i}`,
  title: `landmark.${id}.gallery.${i}.title`,
  desc: `landmark.${id}.gallery.${i}.desc`,
});

/* Deduped catalog (one record per landmark id, in day/itinerary order). */
export const LANDMARK_CATALOG = (() => {
  const byId = new Map();
  Object.entries(DAY_LANDMARKS).forEach(([routeId, list]) => {
    (list || []).forEach((l) => {
      if (byId.has(l.id)) return;
      const cards = (LANDMARK_GALLERIES[l.id] || []).map((c) => ({
        image: c.src || "",
        title: c.title || l.name || EMPTY,
        desc: c.description || l.blurb || EMPTY,
      }));
      byId.set(l.id, {
        id: l.id,
        kind: l.kind,
        name: l.name || EMPTY,
        blurb: l.blurb || EMPTY,
        routeId,
        cards,
      });
    });
  });
  return Array.from(byId.values());
})();

export default LANDMARK_CATALOG;
