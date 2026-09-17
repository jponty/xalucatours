import { captureContext } from "./leadCapture";

jest.mock("@/lib/routes", () => ({ resolvePath: path => ({ routeId: path.startsWith("/viajes/") ? "tourAtlasDesierto45" : "contact" }) }));
jest.mock("@/lib/tripContext", () => ({ resolveTripContext: id => id.startsWith("tour") ? { title: "Atlas y Desierto" } : null }));

test("keeps the trip and page without collecting sensitive query parameters", () => {
  window.history.replaceState({}, "", "/contacto?trip=tourAtlasDesierto45&email=private@example.com&token=secret&utm_source=home");
  const context = captureContext("quick_contact");
  expect(context.capture_type).toBe("trip_information");
  expect(context.related_trip_title).toBe("Atlas y Desierto");
  expect(context.source_url).toContain("trip=tourAtlasDesierto45");
  expect(context.source_url).toContain("utm_source=home");
  expect(context.source_url).not.toMatch(/private|secret/);
});

test("preserves form type and detects a trip page even without query params", () => {
  window.history.replaceState({}, "", "/viajes/atlas_desierto/programa_4n_5d");
  expect(captureContext("exit_intent")).toMatchObject({ capture_type: "exit_intent", related_trip_id: "tourAtlasDesierto45" });
});

test("does not invent a trip for generic contact", () => {
  window.history.replaceState({}, "", "/contacto");
  expect(captureContext("quick_contact")).toMatchObject({ capture_type: "quick_contact", related_trip_id: null });
});
