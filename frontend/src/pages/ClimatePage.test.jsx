import React, { act } from "react";
import { createRoot } from "react-dom/client";
import ClimatePage from "./ClimatePage";
import { REGIONS, SEASONS } from "@/lib/bestTimeData";
import { pathFor, resolvePath } from "@/lib/routes";
import { seoImageForRoute } from "@/lib/seoImages";
import { skyCondition, temperature, climateDate } from "@/lib/climateCopy";

let mockLang = "es", mockWeather, mockNormals;
jest.mock("@/contexts/LanguageContext", () => ({
  useLanguage: () => ({ lang: mockLang }), pick: (value, lang) => typeof value === "string" ? value : value?.[lang],
}));
jest.mock("react-router-dom", () => ({ Link: ({ to, children, ...rest }) => <a href={to} {...rest}>{children}</a> }));
jest.mock("@/hooks/useClimate", () => ({ __esModule: true, default: (kind) => kind === "current" ? mockWeather : mockNormals }));
jest.mock("@/components/EditableImage", () => ({ __esModule: true, default: ({ fallback, alt }) => <img src={fallback} alt={alt} /> }));
jest.mock("@/components/HeroMonogram", () => () => null);
jest.mock("@/components/SectionNav", () => () => null);

let container, root;
const render = () => act(async () => root.render(<ClimatePage />));
beforeEach(() => {
  global.IS_REACT_ACT_ENVIRONMENT = true;
  mockLang = "es";
  mockWeather = { data: { locations: ["merzouga", "arfoud", "ouarzazate", "dades", "zagora", "marrakech", "atlas"].map(id => ({
    id, name: id, status: "ok", temperature: 24, feels_like: 25, symbol: "clearsky_day", high: 30, low: 19,
    wind_kmh: 12, humidity: 42, valid_at: "2026-09-18T12:00:00Z", updated_at: "2026-09-18T11:00:00Z", checked_at: "2026-09-18T12:10:00Z",
  })) }, loading: false, refresh: jest.fn() };
  mockNormals = { data: { locations: REGIONS.map(r => ({ id: r.id, name: r.id, status: "ok", period: "1991–2020",
    months: Array.from({ length: 12 }, (_, n) => ({ month: n + 1, high: 20 + n, low: 10 + n })) })) }, loading: false, refresh: jest.fn() };
  container = document.createElement("div"); document.body.appendChild(container); root = createRoot(container);
});
afterEach(async () => { await act(async () => root.unmount()); container.remove(); delete global.IS_REACT_ACT_ENVIRONMENT; });

test.each(["es", "en", "fr"])("%s route, shared content, weather and links", async lang => {
  mockLang = lang; await render();
  expect(resolvePath(pathFor(lang, "climate")).routeId).toBe("climate");
  expect(seoImageForRoute("climate")).toContain("whenToTravel.jpg");
  expect(container.querySelectorAll(".climate-weather-card")).toHaveLength(7);
  expect(container.querySelectorAll("time")).toHaveLength(21);
  expect(container.textContent).toContain(REGIONS[0].body[lang]);
  for (const season of SEASONS) expect(container.textContent).toContain(season.activities[lang]);
  const links = [...container.querySelectorAll('a[href^="/"]')].map(a => a.getAttribute("href"));
  expect(links).toContain(pathFor(lang, "whenToTravel"));
  expect(links).toContain(pathFor(lang, "planTrip"));
  expect(links.every(href => Boolean(resolvePath(href).routeId))).toBe(true);
  expect(container.textContent).not.toContain("undefined");
});

test("all regions and months reuse the same recommendation data; keyboard tabs work", async () => {
  await render();
  for (const region of REGIONS) {
    await act(async () => container.querySelector(`#climate-tab-${region.id}`).click());
    expect(container.querySelector('[role="tabpanel"]').textContent).toContain(region.best.es);
    expect(container.querySelector('[role="tabpanel"]').textContent).toContain(region.body.es);
    for (let month = 0; month < 12; month++) {
      await act(async () => container.querySelectorAll(".climate-months button")[month].click());
      expect(container.querySelector(".climate-normals").textContent).toContain(`${20 + month} °C`);
    }
  }
  await act(async () => container.querySelector('[role="tab"][aria-selected="true"]').dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true })));
  expect(document.activeElement.id).toBe("climate-tab-sahara");
});

test("partial unavailable and stale weather are labelled, with no fake values", async () => {
  mockWeather.data.locations[0] = { id: "merzouga", name: "Merzouga", status: "unavailable" };
  mockWeather.data.locations[1].status = "stale";
  await render();
  expect(container.querySelector('[data-testid="weather-merzouga"]').textContent).toContain("Datos no disponibles");
  expect(container.querySelector('[data-testid="weather-merzouga"]').textContent).not.toContain("°C");
  expect(container.querySelector('[data-testid="weather-arfoud"]').textContent).toContain("actualización pendiente");
});

test("loading and outage retry states do not prevent seasonal planning", async () => {
  mockWeather.data = null; mockWeather.loading = true; mockNormals.data = null;
  await render();
  expect(container.textContent).toContain("Consultando datos meteorológicos");
  expect(container.textContent).toContain(REGIONS[0].body.es);
  mockWeather.loading = false; await render();
  await act(async () => container.querySelector(".climate-refresh").click());
  expect(mockWeather.refresh).toHaveBeenCalledTimes(1);
  expect(container.querySelectorAll(".climate-weather-card")).toHaveLength(0);
});

test("weather symbols and invalid values are safe", () => {
  for (const [symbol, kind] of [["clearsky_night", "clear"], ["heavysnow", "snow"], ["lightrainshowersandthunder_day", "thunder"], ["sleet", "sleet"], [null, "unknown"]]) {
    expect(skyCondition(symbol).kind).toBe(kind);
  }
  expect(temperature(null)).toBe("—"); expect(temperature(NaN)).toBe("—"); expect(temperature(0)).toBe("0 °C");
  expect(climateDate("invalid")).toBe("—");
});
