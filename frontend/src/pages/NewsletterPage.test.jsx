import React from "react";
import { createRoot } from "react-dom/client";
import { act } from "react";
import NewsletterPage from "./NewsletterPage";
import { pathFor, resolvePath } from "@/lib/routes";
import { getSeoMeta } from "@/lib/seoMeta";
import { seoImageForRoute } from "@/lib/seoImages";

jest.mock("react-router-dom", () => ({ Link: ({ to, children, ...props }) => <a href={to} {...props}>{children}</a> }));
jest.mock("@/contexts/LanguageContext", () => ({
  useLanguage: () => ({ lang: "es" }),
  pick: (copy, lang) => copy[lang] || copy.es,
}));
jest.mock("@/components/EditableImage", () => ({ alt = "", className }) => <img alt={alt} className={className} />);
jest.mock("@/components/HeroMonogram", () => () => null);
jest.mock("@/components/NewsletterSignup", () => () => <section id="newsletter" data-testid="shared-newsletter-signup">Formulario compartido</section>);
jest.mock("@/components/slotScope", () => ({ SlotScope: ({ children }) => children }));

let root;
let container;

beforeEach(() => {
  global.IS_REACT_ACT_ENVIRONMENT = true;
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(async () => {
  await act(async () => root.unmount());
  container.remove();
  delete global.IS_REACT_ACT_ENVIRONMENT;
});

test("the editorial landing reuses the shared signup and links its CTAs", async () => {
  await act(async () => root.render(<NewsletterPage />));
  expect(container.querySelector('[data-testid="newsletter-page"]')).not.toBeNull();
  expect(container.querySelector('[data-testid="newsletter-hero-cta"]').getAttribute("href")).toBe("#newsletter");
  expect(container.querySelectorAll('[data-testid="shared-newsletter-signup"]')).toHaveLength(1);
  expect(container.querySelector('[data-testid="newsletter-about-cta"]').getAttribute("href")).toBe("/equipo");
  expect(container.textContent).toContain("¿Qué encontrarás en nuestra newsletter?");
  expect(container.textContent).toContain("Menos correos. Más ganas de viajar.");
  expect(container.textContent).toContain("Especialistas en Marruecos");
});

test.each([
  ["es", "/newsletter"],
  ["en", "/en/newsletter"],
  ["fr", "/fr/newsletter"],
])("the %s newsletter route is registered with SEO metadata", (lang, url) => {
  expect(pathFor(lang, "newsletter")).toBe(url);
  expect(resolvePath(url)).toMatchObject({ lang, routeId: "newsletter" });
  expect(getSeoMeta("newsletter", lang).title).toContain("Xaluca Tours");
  expect(seoImageForRoute("newsletter")).toContain("blog.jpg");
});
