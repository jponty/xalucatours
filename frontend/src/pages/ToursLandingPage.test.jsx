import React, { act } from "react";
import { createRoot } from "react-dom/client";

let mockLang = "es";
const mockNavigate = jest.fn();
const mockFavorite = jest.fn();
const mockAction = jest.fn();
jest.mock("react-router-dom", () => ({
  Link: ({ to, children, ...props }) => <a href={to} {...props} onClick={(event) => { event.preventDefault(); mockNavigate(to); }}>{children}</a>,
}));
jest.mock("@/contexts/LanguageContext", () => ({
  useLanguage: () => ({ lang: mockLang }),
  pick: (copy, lang) => copy?.[lang] || copy?.es || "",
}));
jest.mock("@/contexts/FavoritesContext", () => ({
  useFavorites: () => ({ isFavorite: () => false, toggleFavorite: mockFavorite }),
}));
jest.mock("@/components/FromPrice", () => ({ testid }) => <span data-testid={testid}>Desde 815 €</span>);
jest.mock("@/components/EditableImage", () => ({ slot, fallback, alt }) => <img data-slot={slot} src={fallback} alt={alt} />);
jest.mock("@/components/XalucaLogoBadge", () => ({ testid }) => <span data-testid={testid}>Xaluca</span>);
jest.mock("@/components/slotScope", () => ({ SlotScope: ({ children }) => <>{children}</> }));
jest.mock("@/components/TripCardActions", () => ({ testidBase }) => <button data-testid={`${testidBase}-test-action`} onClick={mockAction}>Acción</button>);
jest.mock("@/components/SectionNav", () => () => null);
jest.mock("@/components/ContactForm", () => () => null);
jest.mock("@/components/ToursVideoSection", () => () => null);
jest.mock("@/components/ToursRegionMap", () => () => null);
jest.mock("@/components/ImageContactBubble", () => () => null);
jest.mock("@/components/IdealTripWizard", () => () => null);
jest.mock("@/components/WhatsAppContactModal", () => ({ requestWhatsAppContact: jest.fn() }));

import ToursLandingPage from "./ToursLandingPage";
import HomeAllTripsCatalog from "@/components/HomeAllTripsCatalog";
import { ALL_TRIPS } from "@/lib/allTripsCatalog";
import { TRIPS } from "@/lib/tripsData";
import { pathFor } from "@/lib/routes";
import { tripHeroSlot } from "@/lib/tripHero";
import { catalogueTripPreview } from "@/lib/catalogueTripPreview";
import { getTripProgram } from "@/lib/tripPrograms";
import { metaAllLangs } from "@/lib/programMeta";

let container, root, originalScrollTo, originalMatchMedia;
const get = (id) => container.querySelector(`[data-testid="${id}"]`);
const click = (id) => act(() => get(id).click());
const cards = (prefix) => [...container.querySelectorAll(`[data-testid^="${prefix}"]`)];

beforeEach(() => {
  mockLang = "es";
  jest.clearAllMocks();
  global.IS_REACT_ACT_ENVIRONMENT = true;
  originalScrollTo = window.scrollTo;
  originalMatchMedia = window.matchMedia;
  window.scrollTo = jest.fn();
  window.matchMedia = jest.fn(() => ({ matches: true }));
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
  window.scrollTo = originalScrollTo;
  window.matchMedia = originalMatchMedia;
  delete global.IS_REACT_ACT_ENVIRONMENT;
});

test("all explorer and departure cards have the shared extension and keep their existing destinations", () => {
  act(() => root.render(<ToursLandingPage />));
  expect(cards("trip-card-")).toHaveLength(TRIPS.length);
  for (const trip of TRIPS) {
    const prefix = `trip-${trip.id}`;
    expect(get(`${prefix}-details`).textContent).toContain(trip.summary.es);
    expect(get(`${prefix}-details-cta`).getAttribute("href")).toBe(get(`trip-cta-${trip.id}`).getAttribute("href"));
    expect(get(`trip-card-${trip.id}`).dataset.expanded).toBe("false");
  }
  expect(cards("proxima-card-")).toHaveLength(4);
  for (let i = 0; i < 4; i++) {
    expect(get(`proxima-${i}-description`).textContent.length).toBeGreaterThan(60);
    expect(get(`proxima-${i}-details-cta`).getAttribute("href")).toBe(get(`proxima-cta-${i}`).getAttribute("href"));
  }
  click("trip-sahara-soul-more");
  expect(get("trip-card-sahara-soul").dataset.expanded).toBe("true");
  click("trip-fav-sahara-soul");
  expect(mockFavorite).toHaveBeenCalledWith("sahara-soul");
  expect(mockNavigate).not.toHaveBeenCalled();
  click("trip-sahara-soul-details-cta");
  expect(mockNavigate).toHaveBeenCalledWith("/contacto");
});

test("all catalogue cards, including those beyond the first 12, retain images, prices and direct itinerary links", () => {
  act(() => root.render(<ToursLandingPage />));
  expect(cards("home-all-trips-card-")).toHaveLength(12);
  click("all-trips-view-all");
  expect(cards("home-all-trips-card-")).toHaveLength(ALL_TRIPS.length);
  for (const trip of ALL_TRIPS) {
    const prefix = `home-all-trips-${trip.routeId}`;
    const card = get(`home-all-trips-card-${trip.routeId}`);
    expect(card.querySelector("h3").textContent).toBe(trip.title.es);
    expect(card.querySelector("img").getAttribute("data-slot")).toBe(tripHeroSlot(trip.routeId));
    expect(card.querySelector("img").getAttribute("src")).toBe(trip.image);
    expect(get(`${prefix}-details-cta`).getAttribute("href")).toBe(pathFor("es", trip.routeId));
    expect(get(`home-all-trips-from-${trip.routeId}`).textContent).toContain("815 €");
    expect(get(`${prefix}-details`).hasAttribute("inert")).toBe(true);
    expect(get(`${prefix}-description`).textContent.length).toBeGreaterThan(20);
  }
  const routeId = ALL_TRIPS[0].routeId;
  click(`home-all-trips-${routeId}-more`);
  expect(get(`home-all-trips-card-${routeId}`).dataset.expanded).toBe("true");
  click(`home-all-trips-${routeId}-test-action`);
  expect(mockAction).toHaveBeenCalledTimes(1);
  expect(mockNavigate).not.toHaveBeenCalled();
  click(`home-all-trips-${routeId}-details-cta`);
  expect(mockNavigate).toHaveBeenCalledWith(pathFor("es", routeId));
});

test("catalogue and explorer filters still operate independently, with expandable results", () => {
  act(() => root.render(<ToursLandingPage />));
  click("region-chip-north");
  expect(cards("trip-card-")).toHaveLength(TRIPS.filter((trip) => trip.region === "north").length);
  expect(cards("home-all-trips-card-")).toHaveLength(12);
  click("all-trips-filter-region-norte");
  expect(cards("home-all-trips-card-")).toHaveLength(ALL_TRIPS.filter((trip) => trip.region === "norte").length);
  for (const card of cards("home-all-trips-card-")) expect(card.querySelector("button[aria-controls]")).not.toBeNull();
});

test("does not enable extensions in other pages that reuse the catalogue without opting in", () => {
  act(() => root.render(<HomeAllTripsCatalog initialLimit={12} />));
  expect(cards("home-all-trips-card-")).toHaveLength(12);
  expect(container.querySelectorAll("button[aria-controls]")).toHaveLength(0);
});

test("mobile/tablet shows every extension immediately, including new and filtered catalogue results", () => {
  window.matchMedia.mockReturnValue({ matches: false });
  act(() => root.render(<ToursLandingPage />));
  const assertVisible = () => {
    const allCards = [...cards("trip-card-"), ...cards("home-all-trips-card-"), ...cards("proxima-card-")];
    for (const card of allCards) {
      expect(card.dataset.expanded).toBe("true");
      expect(card.querySelector("[data-trip-card-image]")).not.toBeNull();
      expect(card.querySelector('[role="region"]').hasAttribute("inert")).toBe(false);
      expect(card.querySelector('[data-testid$="-details-cta"]').tabIndex).toBe(0);
      expect(card.querySelector("button[aria-controls]")).toBeNull();
    }
  };
  assertVisible();
  click("all-trips-view-all");
  expect(cards("home-all-trips-card-")).toHaveLength(ALL_TRIPS.length);
  assertVisible();
  click("region-chip-north");
  click("all-trips-filter-region-norte");
  assertVisible();
  act(() => cards("trip-card-")[0].querySelector('[data-testid$="-details-cta"]').click());
  expect(mockNavigate).toHaveBeenCalledWith("/contacto");
});

test.each(["en", "fr"])("keeps localized panel labels and matching destinations in %s", (lang) => {
  mockLang = lang;
  act(() => root.render(<ToursLandingPage />));
  const routeId = ALL_TRIPS[0].routeId;
  const cta = get(`home-all-trips-${routeId}-details-cta`);
  expect(cta.getAttribute("href")).toBe(pathFor(lang, routeId));
  expect(cta.textContent).toContain(lang === "en" ? "View full itinerary" : "Voir le programme complet");
});

test.each(["es", "en", "fr"])("catalogue previews reuse complete itinerary paragraphs in %s", (lang) => {
  for (const trip of ALL_TRIPS) {
    const preview = catalogueTripPreview(trip, lang);
    const entry = getTripProgram(trip.routeId);
    const description = entry ? metaAllLangs(entry.program, entry.variant, "description")[lang] : null;
    expect(preview.description).not.toMatch(/undefined|null|\.\.\./);
    expect(preview.description.length).toBeGreaterThan(20);
    if (Array.isArray(description) && description.length) {
      expect(description.join(" ").startsWith(preview.description)).toBe(true);
    } else if (!entry) expect(preview.description).toBe(trip.summary[lang]);
    expect(preview.destinations.length).toBeLessThanOrEqual(4);
  }
});
