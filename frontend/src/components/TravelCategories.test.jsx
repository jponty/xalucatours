import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

let mockLang = "es";
jest.mock("react-router-dom", () => ({
  Link: ({ to, children, ...props }) => <a href={to} {...props}>{children}</a>,
}));
jest.mock("@/contexts/LanguageContext", () => ({
  useLanguage: () => ({ lang: mockLang }),
  pick: (copy, lang) => typeof copy === "string" ? copy : copy?.[lang] || copy?.es,
}));
jest.mock("@/components/EditableText", () => ({ as: Tag = "span", defaults, className }) => (
  <Tag className={className}>{defaults?.[mockLang] || defaults?.es}</Tag>
));
jest.mock("@/components/CategoryImageCarousel", () => ({ images, alt }) => <img src={images[0]} alt={alt} />);
jest.mock("@/components/XalucaLogoBadge", () => () => null);
jest.mock("@/components/TripPriceDisclosure", () => () => null);
jest.mock("@/components/ImageContactBubble", () => () => null);
jest.mock("@/components/StyleTestimonial", () => () => null);
jest.mock("@/lib/chatbase", () => ({ openChatbaseAssistant: jest.fn() }));

import TravelCategories from "./TravelCategories";
import { TRAVEL_CATEGORIES } from "@/lib/data";
import { UPCOMING_DEPARTURES } from "@/lib/upcomingDepartures";
import { pathFor } from "@/lib/routes";

test.each(["es", "en", "fr"])("home departure uses the shared trip destination and preserves category navigation in %s", (lang) => {
  mockLang = lang;
  const page = document.createElement("div");
  page.innerHTML = renderToStaticMarkup(<TravelCategories />);
  const departure = UPCOMING_DEPARTURES[0];
  const category = TRAVEL_CATEGORIES.find((item) => item.slug === "group-departures");
  const card = page.querySelector('[data-testid="category-card-group-departures"]');
  const cta = card.querySelector(`[data-testid="category-departure-cta-${departure.id}"]`);

  expect(card.textContent).toContain(category.region[lang]);
  expect(card.textContent).toContain(category.summary[lang]);
  expect(cta.closest("li").textContent).toContain(departure.badge[lang]);
  expect(cta.closest("li").textContent).toContain(departure.dates[lang]);
  expect(cta.getAttribute("href")).toBe(pathFor(lang, departure.tripRouteId));
  if (lang === "es") expect(cta.getAttribute("href")).toBe("/findeano2026");
  expect(cta.textContent).toBe({ es: "Ver viaje", en: "View trip", fr: "Voir le voyage" }[lang]);
  expect(cta.className).toContain("min-h-11");
  expect(cta.className).toContain("sm:w-auto");
  expect(page.querySelectorAll('[data-testid^="category-departure-cta-"]')).toHaveLength(1);
  expect(page.querySelectorAll('[data-testid^="category-card-"]')).toHaveLength(TRAVEL_CATEGORIES.length);
  expect(card.querySelector('[data-testid="category-cta-group-departures"]').getAttribute("href"))
    .toBe(pathFor(lang, category.routeId));
  expect(card.querySelector('[data-testid="category-plan-group-departures"]').getAttribute("href"))
    .toBe(pathFor(lang, "planTrip"));
});
