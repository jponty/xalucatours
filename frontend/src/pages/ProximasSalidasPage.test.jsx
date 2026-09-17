import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

jest.mock("react-router-dom", () => ({
  Link: ({ to, children, ...props }) => <a href={to} {...props}>{children}</a>,
}));
jest.mock("@/contexts/LanguageContext", () => ({
  useLanguage: jest.fn(() => ({ lang: "es" })),
  pick: (copy, lang) => typeof copy === "string" ? copy : copy?.[lang] || copy?.es,
}));
jest.mock("@/components/EditableImage", () => ({ fallback, alt }) => <img src={fallback} alt={alt} />);
jest.mock("@/components/ContactForm", () => () => <form aria-label="Contact" />);
jest.mock("@/components/JourneyPageSections", () => ({
  JourneyHero: ({ place, title }) => <header><p>{place}</p><h1>{title}</h1></header>,
  StickyNav: ({ items }) => <nav>{items.map((item) => <a key={item.id} href={`#${item.id}`}>{item.label}</a>)}</nav>,
  CommunityCta: () => <section id="community" />,
}));

import ProximasSalidasPage from "./ProximasSalidasPage";
import { useLanguage } from "@/contexts/LanguageContext";
import { UPCOMING_DEPARTURES } from "@/lib/upcomingDepartures";
import { UPCOMING_TRIPS } from "@/lib/homeCarousels";
import { TRAVEL_CATEGORIES } from "@/lib/data";

describe("published group departures", () => {
  test("only publishes the existing New Year 2027 itinerary across previews", () => {
    expect(UPCOMING_DEPARTURES.map((departure) => departure.id)).toEqual(["nye-2026"]);
    expect(UPCOMING_TRIPS.map((trip) => trip.id)).toEqual(["nye-2026"]);
    const [departure] = UPCOMING_DEPARTURES;
    expect(departure.badge.es).toBe("Año Nuevo 2027");
    expect(departure.dates.es).toBe("27 Dic 2026 – 01 Ene 2027");
    expect(departure.price).toBe(1980);
    expect(TRAVEL_CATEGORIES.find((category) => category.slug === "group-departures").departures).toEqual([
      { label: departure.badge, dates: departure.dates, spots: departure.spots },
    ]);
  });

  test.each(["es", "en", "fr"])("%s hub shows one departure without empty season filters", (lang) => {
    useLanguage.mockReturnValue({ lang });
    const page = document.createElement("div");
    page.innerHTML = renderToStaticMarkup(<ProximasSalidasPage />);
    expect(page.querySelectorAll('[data-testid^="departure-card-"]')).toHaveLength(1);
    const card = page.querySelector('[data-testid="departure-card-nye-2026"]');
    expect(card.textContent).toContain(UPCOMING_DEPARTURES[0].badge[lang]);
    expect(card.textContent).toContain(UPCOMING_DEPARTURES[0].dates[lang]);
    expect(page.querySelector('[data-testid="upcoming-filters"]')).toBeNull();
    expect(page.querySelector('a[href="#filters"]')).toBeNull();
    expect(card.querySelector('[data-testid="departure-cta-reserve-nye-2026"]').getAttribute("href")).toBe("#form");
    expect(page.querySelector("#form form")).not.toBeNull();
  });
});
