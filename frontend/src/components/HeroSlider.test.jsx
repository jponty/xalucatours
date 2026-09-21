import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

let mockLang = "es";
jest.mock("react-router-dom", () => ({
  Link: ({ to, children, ...props }) => <a href={to} {...props}>{children}</a>,
}));
jest.mock("@/contexts/LanguageContext", () => ({ useLanguage: () => ({ lang: mockLang }) }));
jest.mock("@/components/EditableText", () => ({ as: Tag = "span", defaults, className }) => (
  <Tag className={className}>{defaults[mockLang] || defaults.es}</Tag>
));
jest.mock("@/components/HeroMonogram", () => () => <div data-testid="hero-monogram" />);
jest.mock("@/components/IdealTripWizard", () => ({ requestIdealTripWizard: jest.fn() }));
jest.mock("@/components/YouTubeHeroBackground", () => ({ videoId, endSeconds, children }) => (
  <div data-testid="shared-video" data-video-id={videoId} data-end-seconds={endSeconds}>{children}</div>
));

import HeroSlider from "./HeroSlider";
import { MOROCCO_HERO_VIDEO } from "@/lib/heroVideo";
import { pathFor } from "@/lib/routes";
import { CONTACT } from "@/lib/data";

const render = () => {
  const container = document.createElement("div");
  container.innerHTML = renderToStaticMarkup(<HeroSlider />);
  return container;
};

test.each(["es", "en", "fr"])("the %s Home reuses the same bounded video as Contact without changing its CTAs", (lang) => {
  mockLang = lang;
  const page = render();
  const get = id => page.querySelector(`[data-testid="${id}"]`);
  expect(get("shared-video").dataset.videoId).toBe(MOROCCO_HERO_VIDEO.videoId);
  expect(get("shared-video").dataset.endSeconds).toBe("275");
  expect(MOROCCO_HERO_VIDEO.videoId).toBe("hVvEISFw9w0");
  expect(page.querySelector("video")).toBeNull();
  expect(get("hero-cta-primary").getAttribute("href")).toBe(pathFor(lang, "planTrip"));
  expect(get("hero-cta-tours").getAttribute("href")).toBe(pathFor(lang, "toursLanding"));
  expect(get("hero-cta-secondary").getAttribute("href")).toBe("#categories");
  expect(get("hero-cta-assistant").tagName).toBe("BUTTON");
  expect(get("hero-cta-ideal-trip").tagName).toBe("BUTTON");
  expect(get("hero-phone").getAttribute("href")).toBe(`tel:${CONTACT.phoneRaw}`);
  expect(get("hero-email").getAttribute("href")).toBe(`mailto:${CONTACT.email}`);
  expect(get("hero-logo")).not.toBeNull();
  expect(get("hero-monogram")).not.toBeNull();
  expect(page.querySelector("h1").textContent).not.toBe("");
});

test("preserves the poster and clipping for loading, reduced-motion and autoplay fallback", () => {
  const page = render();
  const poster = page.querySelector('[data-testid="hero-video-poster"]');
  expect(poster.getAttribute("loading")).toBe("eager");
  expect(poster.getAttribute("alt")).toBe("");
  expect(poster.classList.contains("object-cover")).toBe(true);
  expect(page.querySelector('[data-testid="hero-bg-video"]').classList.contains("overflow-hidden")).toBe(true);
  expect(page.querySelector('[data-testid="hero-bg-video"]').classList.contains("pointer-events-none")).toBe(true);
});
