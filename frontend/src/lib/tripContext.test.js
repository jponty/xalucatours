jest.mock("react-router-dom", () => ({}));

import { pick } from "@/contexts/LanguageContext";
import { XALUCA_TRIPS, tripImage } from "@/lib/planner/plannerTrips";
import { getTripParams, resolveTripContext, setTripContext } from "./tripContext";

afterEach(() => {
  window.sessionStorage.clear();
  window.history.replaceState({}, "", "/");
  jest.restoreAllMocks();
});

test.each(["es", "en", "fr"])("finder hubs reuse the catalogue's title and image in %s", (lang) => {
  const trip = XALUCA_TRIPS.find(({ routeId }) => routeId === "tourGransurTangerRak");
  const context = resolveTripContext(trip.routeId, lang);
  expect(context.routeId).toBe(trip.routeId);
  expect(context.title).toBe(pick(trip.name, lang));
  expect(context.image).toBe(tripImage(trip.routeId));
  expect(context.durationLabel).toBe(`12 ${{ es: "días", en: "days", fr: "jours" }[lang]}`);
});

test("a new contact URL takes priority over an earlier selection", () => {
  setTripContext(["tourAtlasDesierto67"]);
  window.history.replaceState({}, "", "/contacto?trip=tourGransurTangerRak");
  expect(getTripParams()).toEqual(["tourGransurTangerRak"]);
  expect(resolveTripContext(getTripParams()[0], "es")?.routeId).toBe("tourGransurTangerRak");
});

test("contact URLs retain the trip even when session storage is unavailable", () => {
  jest.spyOn(Storage.prototype, "setItem").mockImplementation(() => { throw new Error("Storage unavailable"); });
  expect(() => setTripContext(["tourGransurTangerRak"])).not.toThrow();
  window.history.replaceState({}, "", "/contacto?trip=tourGransurTangerRak");
  expect(getTripParams()).toEqual(["tourGransurTangerRak"]);
});

test.each(["unknown-route", "__proto__", "constructor", null])("does not invent context for %s", (routeId) => {
  expect(resolveTripContext(routeId, "es")).toBeNull();
});
