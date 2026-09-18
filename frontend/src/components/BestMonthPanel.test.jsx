import React, { act } from "react";
import { createRoot } from "react-dom/client";
import BestMonthPanel, { BestMonthButton, COPY, routeToRegion } from "./BestMonthFab";
import { ROUTES, pathFor } from "@/lib/routes";
import { REGIONS } from "@/lib/bestTimeData";

let mockPath = "/viajes/nortedemarruecos";
let mockLang = "es";
jest.mock("react-router-dom", () => ({
  Link: ({ to, children, ...props }) => <a href={to} {...props}>{children}</a>,
  useLocation: () => ({ pathname: mockPath }),
}));
jest.mock("@/contexts/LanguageContext", () => ({
  pick: (copy, lang) => copy?.[lang] || copy?.es,
  useLanguage: () => ({ lang: mockLang }),
}));

let container, root;
const get = id => container.querySelector(`[data-testid="${id}"]`);
const render = () => act(async () => root.render(<>
  <main><section><BestMonthButton /></section></main>
  <BestMonthPanel />
</>));
beforeEach(() => {
  global.IS_REACT_ACT_ENVIRONMENT = true;
  mockLang = "es";
  mockPath = "/viajes/nortedemarruecos";
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
});
afterEach(async () => {
  await act(async () => root.unmount());
  container.remove();
  delete global.IS_REACT_ACT_ENVIRONMENT;
});

test.each(Object.keys(ROUTES).filter(routeToRegion))(
  "%s still opens the same regional recommendations, with no floating launcher",
  async routeId => {
    mockPath = pathFor("es", routeId);
    await render();
    const button = get("best-month-trigger");
    expect(button.closest("main section")).not.toBeNull();
    expect(button.className).not.toMatch(/\b(fixed|sticky|absolute)\b/);
    expect(button.getAttribute("aria-haspopup")).toBe("dialog");
    expect(get("best-month-fab")).toBeNull();
    expect(get("best-month-panel-root").getAttribute("aria-hidden")).toBe("true");
    await act(async () => button.click());
    expect(get("best-month-panel-root").getAttribute("aria-hidden")).toBe("false");
    const region = REGIONS.find(item => item.id === routeToRegion(routeId));
    expect(get("best-month-region-name").textContent).toBe(region.name.es);
    expect(get("best-month-cta-plan").getAttribute("href")).toBe("/planifica-tu-viaje");
    expect(get("best-month-cta-guide").getAttribute("href")).toBe("/cuando-viajar");
    expect(document.body.style.overflow).toBe("hidden");
    await act(async () => get("best-month-close").click());
    expect(get("best-month-panel-root").getAttribute("aria-hidden")).toBe("true");
    expect(document.body.style.overflow).toBe("");
  }
);

test.each(["es", "en", "fr"])("preserves %s labels and localized links", async lang => {
  mockLang = lang;
  mockPath = pathFor(lang, "tourNorth");
  await render();
  expect(get("best-month-trigger").textContent).toBe(COPY.fab[lang]);
  await act(async () => get("best-month-trigger").click());
  expect(get("best-month-cta-guide").getAttribute("href")).toBe(pathFor(lang, "whenToTravel"));
  expect(get("best-month-cta-plan").getAttribute("href")).toBe(pathFor(lang, "planTrip"));
});

test("route changes close the panel and refresh the region without adding a floating button", async () => {
  await render();
  await act(async () => get("best-month-trigger").click());
  mockPath = pathFor("es", "tourSouth");
  await render();
  expect(get("best-month-panel-root").getAttribute("aria-hidden")).toBe("true");
  expect(document.body.style.overflow).toBe("");
  expect(get("best-month-fab")).toBeNull();
});

test("unrelated pages still have no recommendations panel", async () => {
  mockPath = "/";
  await act(async () => root.render(<BestMonthPanel />));
  expect(container.innerHTML).toBe("");
});
