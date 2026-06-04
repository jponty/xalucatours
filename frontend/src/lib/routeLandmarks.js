/* ============================================================
   routeLandmarks.js
   ----
   Resolves, for a given itinerary day, the SAME ordered list of
   "places" (landmarks) that the Day-Map renders — and therefore the
   same "Galería del lugar" carousels. This mirrors the exact tier
   logic in DayRouteMap so the gallery ids (and their CMS slots) match
   1:1:

     Tier 1 — deriveDayPlaces(day) finds ≥ 1 named place
              landmark.id = gazetteer id · gallery = buildPlaceGallery
     Tier 2 — resolveDayRoute returns ≥ 2 waypoints
              landmark.id = `${routeId}-${profileKey}-${idx}` · gallery = profile.gallery
     Tier 3 — single anchor stay with a CITY_PROFILES profile
              landmark.id = `${routeId}-${profileKey}-stay` · gallery = profile.gallery

   Used by the "Visual Trip Summary" route gallery to reference the
   existing Galería-del-lugar images (no new images, no duplicate
   records) in real itinerary order: by day → by place → by card.
============================================================ */
import { resolveDayRoute } from "@/lib/dayRouteResolver";
import { deriveDayPlaces } from "@/lib/dayPlaceGazetteer";
import { CITY_PROFILES } from "@/lib/cityProfiles";
import { DAY_LANDMARKS } from "@/lib/dayLandmarks";
import { LANDMARK_GALLERIES } from "@/lib/landmarkGalleries";

/* Mirror of DayRouteMap.waypointToLandmark. */
const waypointToLandmark = (w, idx, routeId) => {
  const profileKey = w[4];
  const profile = profileKey ? CITY_PROFILES[profileKey] : null;
  if (!profile) return null;
  return {
    id: `${routeId}-${profileKey}-${idx}`,
    poiKey: profileKey,
    kind: profile.kind,
    name: profile.name,
    gallery: profile.gallery,
  };
};

/**
 * Resolve the ordered landmarks (with their 3-card galleries) for a day,
 * exactly as the Day-Map / Galería del lugar would.
 * @param {object} day  – program day { route_id, body, title, ... }
 * @param {string} lang – active language ("es" | "en" | "fr")
 * @returns {Array<{id,name,kind,gallery}>}
 */
export const resolveDayLandmarks = (day, lang = "es") => {
  if (!day || !day.route_id) return [];

  // Tier 0 — CURATED day landmarks (lib/dayLandmarks). These take priority in
  // the Day-Map, so the route gallery must mirror them 1:1 (same points, same
  // order, same `landmark.${id}.gallery` slots) — never omitting a curated POI.
  const curated = DAY_LANDMARKS[day.route_id];
  if (curated && curated.length) {
    return curated.map((l) => ({
      id: l.id,
      poiKey: l.id,
      slotBase: `landmark.${l.id}`,
      kind: l.kind,
      name: l.name,
      gallery: LANDMARK_GALLERIES[l.id] || [],
    }));
  }

  // Tier 1 — named places in the day's own description.
  const landmarks = deriveDayPlaces(day, lang);
  if (landmarks.length > 0) return landmarks;

  // Tier 2 — polyline waypoints (only those with a profile yield a gallery).
  const waypoints = resolveDayRoute(day.route_id);
  if (waypoints.length >= 2) {
    return waypoints
      .map((w, i) => waypointToLandmark(w, i, day.route_id))
      .filter(Boolean);
  }

  // Tier 3 — single anchor stay with a profile.
  if (waypoints.length === 1) {
    const w = waypoints[0];
    const profileKey = w[4];
    const profile = profileKey ? CITY_PROFILES[profileKey] : null;
    if (profile) {
      return [{
        id: `${day.route_id}-${profileKey}-stay`,
        poiKey: profileKey,
        kind: profile.kind,
        name: profile.name,
        gallery: profile.gallery,
      }];
    }
  }

  return [];
};

/**
 * Build the full-journey gallery cells for a whole programme, in real
 * itinerary order (by day → by place → by Galería-del-lugar card).
 * Each cell references the EXISTING, GLOBAL place-gallery CMS slot
 * (`poi.${poiKey}.gallery.${i}`) so any edit made in the Galería del lugar
 * — on this or any other page — is reflected automatically here.
 *
 * @param {Array} days – program.days
 * @param {string} lang
 * @returns {Array<{slot,src,caption}>}
 */
export const buildRouteGalleryCells = (days, lang = "es") => {
  if (!Array.isArray(days)) return [];
  const cells = [];
  // Dedupe by the place's GLOBAL gallery base (the exact slot prefix the
  // Galería del lugar uses): a highlight repeated across days contributes its
  // photos & texts ONLY at its first appearance in itinerary order.
  const seen = new Set();
  days.forEach((day) => {
    const landmarks = resolveDayLandmarks(day, lang);
    landmarks.forEach((lm) => {
      const poiKey = lm.poiKey || lm.id;
      // Mirror LandmarkCarousel.galleryBase exactly so slots match 1:1:
      //   curated landmark → `landmark.${id}.gallery`
      //   gazetteer place  → `poi.${poiKey}.gallery`
      const galleryBase = lm.slotBase ? `${lm.slotBase}.gallery` : `poi.${poiKey}.gallery`;
      // Dedupe by the bare place id (without the landmark./poi. prefix) so the
      // SAME place referenced on a curated day and a derived day collapses into
      // a single appearance — guaranteeing each highlight shows up only once.
      const placeId = galleryBase.replace(/^(landmark|poi)\./, "").replace(/\.gallery$/, "");
      if (seen.has(placeId)) return; // already shown earlier in the route
      seen.add(placeId);
      const gallery = Array.isArray(lm.gallery) ? lm.gallery : [];
      // Single GLOBAL "place name" slot shared by every image of this place,
      // so the overlay always shows the highlight's name (Marrakech, Aït Ben
      // Haddou…) — never a per-card title or filename — and stays in sync
      // across pages. Curated landmarks reuse the SAME `landmark.${id}.name`
      // slot the Day-Map edits; gazetteer places use `poi.${poiKey}.name`.
      const nameSlot = lm.slotBase ? `${lm.slotBase}.name` : `poi.${poiKey}.name`;
      gallery.forEach((card, i) => {
        cells.push({
          // Same GLOBAL slot the LandmarkCarousel uses → shared everywhere.
          slot: `${galleryBase}.${i}`,
          src: card.src,
          // The visible overlay text = the highlight/place name (one source).
          caption: lm.name || null,
          nameSlot,
        });
      });
    });
  });
  return cells;
};

export default resolveDayLandmarks;
