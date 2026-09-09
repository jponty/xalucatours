import { buildPracticalTripIndex, filterPracticalTrips } from "./practicalTravelInfo";
import { TRIP_PROGRAMS } from "./tripPrograms";
import { getTripPackingNotes } from "./tripPackingNotes";
import { pathFor, resolvePath } from "./routes";
import { metaAllLangs } from "./programMeta";

const trips = buildPracticalTripIndex();

describe("practical information hub", () => {
  test("includes every programme with its original notes, without copying the data", () => {
    expect(trips.map((trip) => trip.routeId).sort()).toEqual(Object.keys(TRIP_PROGRAMS).sort());
    expect(new Set(trips.map((trip) => trip.routeId)).size).toBe(trips.length);
    for (const trip of trips) {
      const { program, variant } = TRIP_PROGRAMS[trip.routeId];
      expect(trip.notes).toBe(getTripPackingNotes(trip.routeId));
      expect(trip.duration).toBe(program.duration);
      expect(trip.title).toEqual(metaAllLangs(program, variant, "title"));
      expect(trip.title.es).toBeTruthy();
      expect(trip.notes.length).toBeGreaterThan(0);
      for (const lang of ["es", "en", "fr"]) {
        expect(resolvePath(pathFor(lang, trip.routeId))).toMatchObject({ routeId: trip.routeId, lang });
      }
    }
  });

  test("finds destinations with or without accents and combines them with duration", () => {
    const accented = filterPracticalTrips(trips, { query: "Tánger 5 días" });
    expect(accented.length).toBeGreaterThan(0);
    expect(filterPracticalTrips(trips, { query: "tanger 5 dias" })).toEqual(accented);
    expect(accented.every((trip) => trip.duration.es.includes("5 días"))).toBe(true);
  });

  test("filters collections and derives the collection of unlisted durations from their siblings", () => {
    const crossing = filterPracticalTrips(trips, { section: "tourFull" });
    expect(crossing.some((trip) => trip.routeId === "tourFezSidialiOzz78")).toBe(true);
    expect(crossing.every((trip) => trip.section === "tourFull")).toBe(true);
    expect(trips.some((trip) => trip.section === "toursLanding")).toBe(false);
  });

  test("retains alternate URLs so their route-specific editable notes remain accessible", () => {
    const routes = trips.map((trip) => trip.routeId);
    expect(routes).toContain("tourMarrakechLoop34");
    expect(routes).toContain("tourEscapadaRakErgRak34");
    expect(filterPracticalTrips(trips, { query: "fez_sidiali programa_4n_5d" }).some((trip) => trip.routeId === "tourEscapadaFezSidiali45")).toBe(true);
  });

  test("returns no unrelated recommendations for an empty result", () => {
    expect(filterPracticalTrips(trips, { query: "zz-no-matching-destination" })).toEqual([]);
    expect(filterPracticalTrips(trips, { section: "tourNorth", query: "Enduro" })).toEqual([]);
    expect(filterPracticalTrips(trips, { query: "  " })).toHaveLength(trips.length);
  });

  test("registers the practical hub in every language", () => {
    expect(pathFor("es", "practicalInfo")).toBe("/info");
    for (const lang of ["es", "en", "fr"]) {
      expect(resolvePath(pathFor(lang, "practicalInfo"))).toMatchObject({ routeId: "practicalInfo", lang });
    }
  });
});
