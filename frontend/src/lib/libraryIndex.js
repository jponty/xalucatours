/* ============================================================
   libraryIndex.js
   ----
   Builds the Destination Media Library index from the SAME unified
   catalog that powers the day maps / /galeria (LANDMARK_CATALOG) plus
   the reverse POI→trips index. This is ONLY an index of which locations
   exist and which itineraries reference them — the Library stores its
   own independent gallery server-side (`library_locations`) and never
   touches the curated itinerary galleries (image_slots).

   `seedImages` are the location's DEFAULT programmatic gallery URLs
   (code constants, NOT the editor's curated CMS selections) used purely
   to seed a brand-new Library entry so it is never empty.
============================================================ */
import LANDMARK_CATALOG from "@/lib/dayLandmarkCatalog";
import { tripsForPoi } from "@/lib/poiTripIndex";

const pickStr = (o) => (o && (o.es || o.en || o.fr)) || "";

export const buildLibraryIndex = () => {
  const seen = new Set();
  return LANDMARK_CATALOG.reduce((acc, p) => {
    if (!p.id || seen.has(p.id)) return acc;   // a curated id can also exist as a gazetteer poiKey
    seen.add(p.id);
    const trips = tripsForPoi(p.id) || [];
    const cards = Array.isArray(p.cards) ? p.cards : [];
    acc.push({
      id: p.id,
      name: p.name || { es: "", en: "", fr: "" },
      kind: p.kind || "",
      zone: p.zone || "otros",
      group: p.group || "",
      lat: typeof p.lat === "number" ? p.lat : null,
      lng: typeof p.lng === "number" ? p.lng : null,
      trips: trips.map((t) => ({ routeId: t.routeId, title: t.title })),
      seedImages: cards.map((c) => c.image).filter(Boolean).slice(0, 40),
      seedCaptions: cards.map((c) => pickStr(c.title)).slice(0, 40),
    });
    return acc;
  }, []);
};

export default buildLibraryIndex;
