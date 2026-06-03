/* ============================================================
   poiCatalog.js
   ----
   Single, deduplicated catalog of EVERY "punto destacado" (point of
   interest) used across all itineraries and day maps of the site.

   Sources merged (union), keyed by the stable `poiKey`:
     • GAZETTEER (lib/dayPlaceGazetteer)   — Tier-1 places named in day text.
     • CITY_PROFILES (lib/cityProfiles)    — Tier-2/3 waypoint/stay profiles.

   Each POI exposes its REPRESENTATIVE ("main") card = gallery card index 0,
   whose global CMS slots are exactly the ones rendered everywhere:
       image       → poi.${poiKey}.gallery.0
       title       → poi.${poiKey}.gallery.0.title
       description → poi.${poiKey}.gallery.0.desc

   Editing those from /admin therefore syncs the POI's main image, title
   and description across every page, route, map, card and gallery where
   that same POI appears — one source of truth per POI.
============================================================ */
import { GAZETTEER } from "@/lib/dayPlaceGazetteer";
import { buildPlaceGallery, ALIAS_PROFILE } from "@/lib/placeGalleries";
import { CITY_PROFILES } from "@/lib/cityProfiles";

const EMPTY = { es: "", en: "", fr: "" };

/* Stable point-of-interest key (same logic as buildLandmark / waypoints). */
export const poiKeyForEntry = (e) => e.profileKey || ALIAS_PROFILE[e.id] || e.id;

/* Global CMS slots for a POI's representative (main) card. */
export const poiSlots = (poiKey) => ({
  image: `poi.${poiKey}.gallery.0`,
  title: `poi.${poiKey}.gallery.0.title`,
  desc: `poi.${poiKey}.gallery.0.desc`,
});

const makePoi = ({ poiKey, kind, name, gallery }) => {
  const g = (Array.isArray(gallery) ? gallery : []).slice(0, 3);
  const cards = g.map((c) => ({
    image: c.src || "",
    title: c.title || name || EMPTY,
    desc: c.description || EMPTY,
  }));
  const main = cards[0] || { image: "", title: name || EMPTY, desc: EMPTY };
  return {
    poiKey,
    kind: kind || "site",
    name: name || EMPTY,
    // The 3 "Galería del lugar" cards, each with its own default image/title/desc.
    cards,
    // Representative (main) card — used for the block thumbnail/header.
    defaultImage: main.image,
    defaultTitle: main.title,
    defaultDesc: main.desc,
  };
};

/* Build the deduped union. Gazetteer first (richest: names + galleries),
   then any CITY_PROFILES key not yet covered. */
export const POI_CATALOG = (() => {
  const byKey = new Map();

  for (const entry of GAZETTEER) {
    const poiKey = poiKeyForEntry(entry);
    if (byKey.has(poiKey)) continue;
    const profile = entry.profileKey ? CITY_PROFILES[entry.profileKey] : null;
    byKey.set(
      poiKey,
      makePoi({
        poiKey,
        kind: entry.kind,
        name: entry.name || (profile && profile.name),
        gallery: buildPlaceGallery(entry),
      })
    );
  }

  for (const [key, profile] of Object.entries(CITY_PROFILES)) {
    if (byKey.has(key)) continue;
    byKey.set(
      key,
      makePoi({
        poiKey: key,
        kind: profile.kind,
        name: profile.name,
        gallery: profile.gallery,
      })
    );
  }

  return Array.from(byKey.values()).sort((a, b) =>
    (a.name.es || a.poiKey).localeCompare(b.name.es || b.poiKey, "es")
  );
})();

export default POI_CATALOG;
