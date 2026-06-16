/* ============================================================
   deriveTripRoute — builds a full-journey overview route for the
   "El recorrido completo" map when a program has no hand-curated
   `route`. One node per day is resolved from that day's own data
   (narrative places + parsed day route_id), so every itinerary
   gets a map that reflects its real stops — never a shared/generic
   one.

   Output node shape matches the curated `route` used by
   TripRouteMap:  { day, lat, lng, type, name:{es,en,fr} }
============================================================ */
import { resolveDayRoute } from "@/lib/dayRouteResolver";
import { deriveDayPlaces } from "@/lib/dayPlaceGazetteer";

/* Map a gazetteer "kind" to a TripRouteMap legend "type". */
const KIND_TO_TYPE = {
  town: "city",
  city: "city",
  dunes: "desert",
  camp: "desert",
  kasbah: "kasbah",
  market: "market",
  fossils: "market",
  gorges: "gorge",
  valley: "gorge",
  site: "unesco",
  palm: "city",
  village: "city",
  viewpoint: "city",
  mountain: "city",
  music: "city",
  hotel: "city",
  lake: "lake",
};

/* Kinds that typically represent where a day ends (overnight / lodging). */
const DEST_KINDS = new Set(["town", "dunes", "kasbah", "village", "camp", "hotel"]);

const asTri = (s) => ({ es: s, en: s, fr: s });

/**
 * Derive a per-day overview route from a program's days.
 * @param {object} program  – program with a `days` array.
 * @returns {Array<{day:number, lat:number, lng:number, type:string, name:object}>}
 */
export function deriveTripRoute(program) {
  if (!program || !Array.isArray(program.days)) return [];

  const nodes = [];
  const usedCoords = new Set();

  program.days.forEach((day, i) => {
    const dayNum = day.day_number || i + 1;
    let anchor = null;

    // 1) Places named in the day's own narrative (trilingual + kind).
    const places = deriveDayPlaces(day, "es");
    if (places.length) {
      const dest = [...places].reverse().find((p) => DEST_KINDS.has(p.kind));
      const p = dest || places[places.length - 1];
      anchor = { name: p.name, lat: p.lat, lng: p.lng, kind: p.kind };
    }

    // 2) Fallback: parse the day route_id token stream.
    if (!anchor) {
      const wp = resolveDayRoute(day.route_id);
      if (wp.length) {
        const last = wp[wp.length - 1]; // [name, lat, lng, kind, profileKey]
        anchor = { name: asTri(last[0]), lat: last[1], lng: last[2], kind: "town" };
      }
    }

    if (!anchor || anchor.lat == null || anchor.lng == null) return;

    // Nudge exact-duplicate positions (multi-night stays) so each day's
    // marker stays visible on the map.
    let { lat, lng } = anchor;
    let key = `${lat.toFixed(3)}|${lng.toFixed(3)}`;
    let jitter = 0;
    while (usedCoords.has(key)) {
      jitter += 1;
      lat = anchor.lat + 0.013 * jitter;
      lng = anchor.lng + 0.013 * jitter;
      key = `${lat.toFixed(3)}|${lng.toFixed(3)}`;
    }
    usedCoords.add(key);

    nodes.push({
      day: dayNum,
      lat,
      lng,
      type: KIND_TO_TYPE[anchor.kind] || "city",
      name: anchor.name,
    });
  });

  return nodes;
}

export default deriveTripRoute;
