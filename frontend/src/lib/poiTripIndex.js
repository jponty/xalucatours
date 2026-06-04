/* ============================================================
   poiTripIndex.js
   ----
   Reverse index: "punto destacado" → trips that include it.

   A place is considered part of a trip when it surfaces on that
   trip's Day-Map (i.e. it is returned by resolveDayLandmarks for
   any of the program's days). This is the SAME resolution the day
   maps and the route gallery use, so the result matches exactly
   what the traveller sees on the itinerary.

   Keyed by the bare place id (no `landmark.`/`poi.` prefix), which
   equals the catalog record `id` used on /galeria:
     - curated landmark → landmark id
     - gazetteer place  → poiKey
============================================================ */

import { ALL_PROGRAMS } from "@/lib/programs";
import { resolveDayLandmarks } from "@/lib/routeLandmarks";
import { ALL_TRIPS } from "@/lib/allTripsCatalog";

const TRIP_BY_ROUTE = {};
ALL_TRIPS.forEach((t) => {
  TRIP_BY_ROUTE[t.routeId] = t;
});

const placeIdOf = (lm) =>
  lm.slotBase ? lm.slotBase.replace(/^landmark\./, "") : lm.poiKey || lm.id;

let _index = null;

const buildIndex = () => {
  const map = {}; // placeId -> Set(routeId)
  ALL_PROGRAMS.forEach((prog) => {
    // Only index programs that exist in the public catalog (valid links).
    if (!prog.routeId || !TRIP_BY_ROUTE[prog.routeId]) return;
    const seen = new Set(); // dedupe per program
    (prog.days || []).forEach((day) => {
      resolveDayLandmarks(day).forEach((lm) => {
        const placeId = placeIdOf(lm);
        if (!placeId || seen.has(placeId)) return;
        seen.add(placeId);
        (map[placeId] = map[placeId] || new Set()).add(prog.routeId);
      });
    });
  });
  return map;
};

const getIndex = () => _index || (_index = buildIndex());

/** Returns the catalog trip entries whose itinerary includes the place. */
export const tripsForPoi = (poiId) => {
  const set = getIndex()[poiId];
  if (!set) return [];
  return [...set].map((rid) => TRIP_BY_ROUTE[rid]).filter(Boolean);
};

export default tripsForPoi;
