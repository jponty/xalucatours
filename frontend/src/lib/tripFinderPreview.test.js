import { tripFinderPreview } from "./tripFinderPreview";
import { XALUCA_TRIPS } from "./planner/plannerTrips";
import { TRIP_PROGRAMS } from "./tripPrograms";
import { metaAllLangs } from "./programMeta";
import { nodeName, tt } from "./tripFinder";
import { pathFor } from "./routes";
import { SOUTH_TRIPS, NORTH_TRIPS, FULL_TRIPS, SHORT_TRIPS } from "./homeCarousels";

describe.each(["es", "en", "fr"])("finder previews in %s", (lang) => {
  test.each(XALUCA_TRIPS.map((trip) => [trip.routeId, trip]))("%s has its own description, real destinations and a registered destination URL", (routeId, trip) => {
    const preview = tripFinderPreview(trip, lang);
    const entry = TRIP_PROGRAMS[routeId];
    expect(preview.description.length).toBeGreaterThan(30);
    expect(preview.description).not.toMatch(/undefined|null|\.\.\./);
    expect(pathFor(lang, routeId)).not.toBe("/");
    expect(preview.destinations.length).toBeGreaterThan(0);
    expect(preview.destinations.length).toBeLessThanOrEqual(4);
    expect(new Set(preview.destinations).size).toBe(preview.destinations.length);
    preview.destinations.forEach((name) => {
      expect(trip.stops.map((id) => nodeName(id, lang))).toContain(name);
    });
    const catalogueTrip = [...SOUTH_TRIPS, ...NORTH_TRIPS, ...FULL_TRIPS, ...SHORT_TRIPS].find((item) => item.routeId === routeId);
    if (catalogueTrip?.summary) expect(preview.description).toBe(tt(catalogueTrip.summary, lang));
    else if (entry) expect(preview.description).toBe(tt(metaAllLangs(entry.program, entry.variant, "subtitle"), lang));
    else {
      expect(preview.description).toContain(String(trip.days));
      expect(preview.description).toContain(nodeName(trip.entry, lang));
      expect(preview.description).toContain(nodeName(trip.exit, lang));
    }
  });
});
