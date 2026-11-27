import { rankTrips, topTrips } from "./tripFinder";

describe("trip finder duration filter", () => {
  test("2–3 days never recommends longer journeys", () => {
    const results = rankTrips({ durationId: "2-3" });
    expect(results.every(({ trip }) => trip.days >= 2 && trip.days <= 3)).toBe(true);
    expect(topTrips({ durationId: "2-3" })).toHaveLength(0);
  });

  test("4–5 days only returns trips in that range", () => {
    const results = rankTrips({ durationId: "4-5" });
    expect(results.length).toBeGreaterThan(0);
    expect(results.every(({ trip }) => trip.days >= 4 && trip.days <= 5)).toBe(true);
  });
});
