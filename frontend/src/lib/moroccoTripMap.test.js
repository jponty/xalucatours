import { buildMoroccoTripMapIndex, tripsForMapSelection } from "./moroccoTripMap";
import { TRIP_PROGRAMS } from "./tripPrograms";

test("indexes every registered trip from its published itinerary", () => {
  const trips = buildMoroccoTripMapIndex();
  expect(trips).toHaveLength(Object.keys(TRIP_PROGRAMS).length);
  expect(trips.filter((trip) => !trip.zones.length).map((trip) => trip.routeId)).toEqual([]);
  const crossCountry = trips.find((trip) => trip.routeId === "tourTangerRak910");
  expect(crossCountry.zones).toEqual(expect.arrayContaining(["rif", "imperial", "kasbahs", "sahara"]));
  expect(crossCountry.places).toEqual(expect.arrayContaining(["tanger", "chefchaouen", "ergchebbi", "marrakech"]));
});

test("changes in itinerary destinations update region matches", () => {
  const base = TRIP_PROGRAMS.tourEnduroAventura34;
  const modified = { ...base.program, meta: { ...base.program.meta, es: { ...base.program.meta.es, quick_places: "Tánger · Chefchaouen" } }, days: [] };
  const [trip] = buildMoroccoTripMapIndex({ tourEnduroAventura34: { program: modified, variant: base.variant } });
  expect(trip.zones).toContain("rif");
  expect(tripsForMapSelection([trip], { type: "zone", id: "rif" })).toHaveLength(1);
});
