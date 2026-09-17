import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

let mockLang = "es";
jest.mock("react-router-dom", () => ({
  Link: ({ to, children, ...props }) => <a href={to} {...props}>{children}</a>,
}));
jest.mock("@/contexts/LanguageContext", () => ({
  useLanguage: () => ({ lang: mockLang }),
  pick: (copy, lang) => copy[lang] || copy.es,
}));
jest.mock("@/components/EditableImage", () => ({ slot, fallback, alt, sizes, className }) => (
  <img data-slot={slot} src={fallback} alt={alt} sizes={sizes} className={className} />
));

import FeaturedDepartureBanner from "./FeaturedDepartureBanner";
import { UPCOMING_DEPARTURES } from "@/lib/upcomingDepartures";

const render = () => {
  const container = document.createElement("div");
  container.innerHTML = renderToStaticMarkup(<FeaturedDepartureBanner />);
  return container;
};

test.each([
  ["es", "Viaje destacado", "Fin de Año en Marruecos", "Ver viaje", "/findeano2026"],
  ["en", "Featured journey", "New Year's Eve in Morocco", "View trip", "/en/newyear2026"],
  ["fr", "Voyage à la une", "Réveillon au Maroc", "Voir le voyage", "/fr/nouvelan2026"],
])("shows the featured departure and correct CTA in %s", (lang, eyebrow, title, cta, href) => {
  mockLang = lang;
  const page = render();
  const banner = page.querySelector("section");
  const link = page.querySelector("a");
  const departure = UPCOMING_DEPARTURES.find(trip => trip.id === "nye-2026");
  expect(banner.textContent).toContain(eyebrow);
  expect(page.querySelector("h2").textContent).toBe(title);
  expect(banner.getAttribute("aria-labelledby")).toBe(page.querySelector("h2").id);
  expect(banner.textContent).toContain(departure.dates[lang]);
  expect(banner.textContent).toContain(departure.badge[lang]);
  expect(link.textContent).toBe(cta);
  expect(link.getAttribute("href")).toBe(href);
  expect(page.querySelectorAll("a")).toHaveLength(1);
});

test("reuses the trip's editable photograph and keeps the CTA responsive and accessible", () => {
  mockLang = "es";
  const page = render();
  const image = page.querySelector('[data-slot="findeano.hero.bg"]');
  expect(image).not.toBeNull();
  expect(image.classList.contains("object-cover")).toBe(true);
  const link = page.querySelector("a");
  expect(link.classList.contains("min-h-12")).toBe(true);
  expect(link.classList.contains("w-full")).toBe(true);
  expect(link.classList.contains("sm:w-fit")).toBe(true);
  expect(link.classList.contains("motion-reduce:transition-none")).toBe(true);
  expect(page.querySelector('[role="dialog"]')).toBeNull();
});
