/* ============================================================
   dayLandmarkCatalog.js
   ----
   UNIFIED catalog of every "punto de interés del día" editable from /admin,
   covering ALL itineraries. Two sources are merged so that whatever the day
   map renders is manageable from one place:

   1) CURATED landmarks (lib/dayLandmarks → DAY_LANDMARKS)
        - The hand-curated desert route (Erg Chebbi, Khamlia, Hassi Labied,
          Mirador del Valle del Ziz, Canteras de fósiles marinos, …).
        - Galería del lugar from LANDMARK_GALLERIES.
        - GLOBAL slot prefix: `landmark.${id}` (name + blurb + gallery).

   2) GAZETTEER places (lib/dayPlaceGazetteer → GAZETTEER)
        - The places auto-detected from each day's description text on every
          OTHER itinerary (Atlas, Norte, Imperiales, Marrakech↔Fez, …).
        - Galería del lugar from buildPlaceGallery / CITY_PROFILES.
        - GLOBAL slot prefix: `poi.${poiKey}` (gallery only — the day-map
          name is taken from the gazetteer entry).

   Each record carries its own `prefix`, so the same editor works for both.
============================================================ */
import { DAY_LANDMARKS } from "@/lib/dayLandmarks";
import { LANDMARK_GALLERIES } from "@/lib/landmarkGalleries";
import { GAZETTEER } from "@/lib/dayPlaceGazetteer";
import { buildPlaceGallery, ALIAS_PROFILE } from "@/lib/placeGalleries";
import { CITY_PROFILES } from "@/lib/cityProfiles";

const EMPTY = { es: "", en: "", fr: "" };

/* Global slots for a location's own info (name + blurb). Only meaningful for
   curated landmarks (gazetteer day-map names are not globally editable). */
export const infoSlots = (prefix) => ({
  name: `${prefix}.name`,
  blurb: `${prefix}.blurb`,
});

/* Global slots for one "Galería del lugar" card. */
export const cardSlots = (prefix, i) => ({
  image: `${prefix}.gallery.${i}`,
  title: `${prefix}.gallery.${i}.title`,
  desc: `${prefix}.gallery.${i}.desc`,
});

const toCards = (gallery, fallbackName, fallbackBlurb) =>
  (Array.isArray(gallery) ? gallery : []).map((c) => ({
    image: c.src || "",
    title: c.title || fallbackName || EMPTY,
    desc: c.description || fallbackBlurb || EMPTY,
  }));

/* ---- 1) Curated day landmarks (desert route) ---- */
const buildCurated = () => {
  const byId = new Map();
  Object.values(DAY_LANDMARKS).forEach((list) => {
    (list || []).forEach((l) => {
      if (byId.has(l.id)) return;
      byId.set(l.id, {
        uid: `lm-${l.id}`,
        id: l.id,
        kind: l.kind,
        name: l.name || EMPTY,
        blurb: l.blurb || EMPTY,
        prefix: `landmark.${l.id}`,
        hasInfo: true,
        group: "Ruta del desierto · curado",
        cards: toCards(LANDMARK_GALLERIES[l.id], l.name, l.blurb),
      });
    });
  });
  return Array.from(byId.values());
};

/* ---- 2) Gazetteer places (every other itinerary, auto-detected) ---- */
const poiKeyFor = (e) => e.profileKey || ALIAS_PROFILE[e.id] || e.id;

const buildGazetteer = () => {
  const byKey = new Map();
  GAZETTEER.forEach((entry) => {
    const poiKey = poiKeyFor(entry);
    if (byKey.has(poiKey)) return;
    const profile = entry.profileKey ? CITY_PROFILES[entry.profileKey] : null;
    const name = entry.name || (profile && profile.name) || EMPTY;
    const blurb = entry.blurb || (profile && profile.blurb) || EMPTY;
    byKey.set(poiKey, {
      uid: `poi-${poiKey}`,
      id: poiKey,
      kind: entry.kind,
      name,
      blurb,
      prefix: `poi.${poiKey}`,
      hasInfo: false,
      group: "Itinerarios · automático",
      cards: toCards(buildPlaceGallery(entry), name, blurb),
    });
  });
  // Tier-2/3 waypoint profiles not auto-detected in any day text but still
  // rendered on day maps (their gallery slot is `poi.${profileKey}.gallery`).
  Object.entries(CITY_PROFILES).forEach(([key, profile]) => {
    if (byKey.has(key)) return;
    byKey.set(key, {
      uid: `poi-${key}`,
      id: key,
      kind: profile.kind,
      name: profile.name || EMPTY,
      blurb: profile.blurb || EMPTY,
      prefix: `poi.${key}`,
      hasInfo: false,
      group: "Itinerarios · automático",
      cards: toCards(profile.gallery, profile.name, profile.blurb),
    });
  });
  return Array.from(byKey.values()).sort((a, b) =>
    (a.name.es || a.id).localeCompare(b.name.es || b.id, "es")
  );
};

/* Curated first (in day order), then gazetteer (alphabetical). */
export const LANDMARK_CATALOG = [...buildCurated(), ...buildGazetteer()];

export default LANDMARK_CATALOG;
