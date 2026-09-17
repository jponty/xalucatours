import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import fs from "fs";
import path from "path";
import { TRIP_PROGRAMS } from "@/lib/tripPrograms";
import { pathFor } from "@/lib/routes";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocation } from "react-router-dom";
import TripCustomizationSection from "./TripCustomizationSection";

// Keep the real page, template, itinerary data and customization section.
// Isolate unrelated maps, media, editors and forms from this rendering audit.
jest.mock("react-router-dom", () => ({
  Link: ({ to, children, ...props }) => <a href={to} {...props}>{children}</a>,
  useLocation: jest.fn(),
}));
jest.mock("@/contexts/LanguageContext", () => ({
  ...jest.requireActual("@/contexts/LanguageContext"),
  useLanguage: jest.fn(),
}));
jest.mock("@/lib/tripContext", () => ({ setTripContext: jest.fn() }));
jest.mock("@/contexts/FavoritesContext", () => ({
  useFavorites: () => ({ isFavorite: () => false, toggleFavorite: jest.fn() }),
}));
jest.mock("./EditableSection", () => ({ useSlotId: (slot) => slot }));
jest.mock("./EditableText", () => ({ defaults, as: Tag = "span", className }) => (
  <Tag className={className}>{defaults?.[require("@/contexts/LanguageContext").useLanguage().lang]}</Tag>
));
jest.mock("./EditableImage", () => () => null);
jest.mock("./BestMonthFab", () => ({ COPY: { fab: {} } }));
jest.mock("./JourneyPageSections", () => ({ StickyNav: () => null }));
jest.mock("./DayRouteMap", () => ({ DayRouteMap: () => null }));
jest.mock("./DayGallery", () => ({ DayGallery: () => null }));
jest.mock("./TripOverview", () => ({ TripOverview: () => null }));
jest.mock("./ProgramFlipbook", () => () => null);
jest.mock("./TripRouteMap", () => ({ TripRouteMap: () => null }));
jest.mock("./ContactForm", () => () => null);
jest.mock("./HubPeerNav", () => () => null);
jest.mock("./RelatedJourneys", () => () => null);
jest.mock("./TripPostcards", () => () => null);
jest.mock("./HeroMonogram", () => () => null);
jest.mock("./DayImageGallery", () => ({ DayImageGallery: () => null }));
jest.mock("./DayTravelNotes", () => () => null);
jest.mock("./DayTestimonial", () => () => null);
jest.mock("./DayCultureCTA", () => () => null);
jest.mock("./PricingSection", () => () => null);
jest.mock("./FromPrice", () => () => null);
jest.mock("./DownloadProgramModal", () => () => null);
jest.mock("./WhatsAppContactModal", () => ({ requestWhatsAppContact: jest.fn() }));
jest.mock("./VideoSection", () => () => null);
jest.mock("./JourneyChronology", () => () => <section data-testid="journey-chronology" />);
jest.mock("./TripFloatingActions", () => () => null);
jest.mock("./JourneyStoryPostcard", () => () => <section data-testid="journey-story-postcard" />);
jest.mock("./FavoriteButton", () => () => null);

const src = path.resolve(__dirname, "..");
const routeSource = fs.readFileSync(path.join(src, "lib/routeComponents.js"), "utf8");
const routeIds = [...Object.keys(TRIP_PROGRAMS), "tourFinDeAno2025"];

// Resolve the router's real page imports, including named exports and aliases.
function pageFor(routeId) {
  const name = routeSource.match(new RegExp(`\\b${routeId}:\\s*(\\w+)`))?.[1];
  if (!name) throw new Error(`Missing route component: ${routeId}`);
  const defaultImport = routeSource.match(new RegExp(`import\\s+${name}\\s+from\\s+["']([^"']+)`));
  const namedImport = [...routeSource.matchAll(/import\s*\{([^}]+)\}\s*from\s*["']([^"']+)/g)]
    .find((match) => match[1].split(",").some((entry) => entry.trim() === name));
  const modulePath = defaultImport?.[1] || namedImport?.[2];
  if (!modulePath) throw new Error(`Missing page import: ${name}`);
  const pageModule = require(path.join(src, modulePath.replace("@/", "")));
  return defaultImport ? pageModule.default : pageModule[name];
}

test("the audit includes all 67 individual routes, including the special departure", () => {
  expect(routeIds).toHaveLength(67);
  expect(new Set(routeIds).size).toBe(67);
});

describe.each(["es", "en", "fr"])("customization rollout in %s", (lang) => {
  test.each(routeIds)("%s has exactly the approved section, in the correct position", (routeId) => {
    useLanguage.mockReturnValue({ lang });
    useLocation.mockReturnValue({ pathname: pathFor(lang, routeId) });
    const Page = pageFor(routeId);
    const container = document.createElement("div");
    container.innerHTML = renderToStaticMarkup(<Page />);
    const sections = container.querySelectorAll('[data-testid="trip-customization"]');
    expect(sections).toHaveLength(1);
    expect(sections[0].previousElementSibling.dataset.testid).toBe(
      routeId === "tourFinDeAno2025" ? "findeano-hero" : "program-description"
    );

    const reference = document.createElement("div");
    reference.innerHTML = renderToStaticMarkup(<TripCustomizationSection routeId={routeId} lang={lang} />);
    expect(sections[0].outerHTML).toBe(reference.firstElementChild.outerHTML);
    expect(sections[0].querySelector("a").getAttribute("href"))
      .toBe(`${pathFor(lang, "contact")}?trip=${routeId}`);
  });
});
