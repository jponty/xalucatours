import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import Header from "./Header";
import { BrandMark } from "./BrandMark";

let mockLang = "es";
jest.mock("react-router-dom", () => ({
  Link: ({ to, children, ...props }) => <a href={to} {...props}>{children}</a>,
}));
jest.mock("@/contexts/LanguageContext", () => ({
  useLanguage: () => ({ lang: mockLang, t: key => key }),
  pick: (copy, lang) => copy[lang] || copy.es,
}));
jest.mock("@/contexts/FavoritesContext", () => ({ useFavorites: () => ({ count: 0 }) }));
jest.mock("./SideMenu", () => ({ SideMenu: () => null }));
jest.mock("./TopInfoBar", () => () => null);
jest.mock("@/components/EditModeFAB", () => () => null);
jest.mock("@/components/PlanTripInfoModal", () => () => null);
jest.mock("@/components/WhatsAppContactModal", () => ({ requestWhatsAppContact: jest.fn() }));
jest.mock("@/components/EditableText", () => ({ defaults, slot, ...props }) => {
  const { multiline, ...rest } = props;
  return <span data-slot={slot} {...rest}>{defaults[mockLang] || defaults.es}</span>;
});

const render = element => {
  const container = document.createElement("div");
  container.innerHTML = renderToStaticMarkup(element);
  return container;
};

test.each([
  ["es", "Contacto", "/contacto"],
  ["en", "Contact", "/en/contact"],
  ["fr", "Contact", "/fr/contact"],
])("the %s header links directly to contact instead of an appointment modal", (lang, label, href) => {
  mockLang = lang;
  const page = render(<Header />);
  const link = page.querySelector('[data-testid="header-contact-button"]');
  expect(link.tagName).toBe("A");
  expect(link.textContent).toBe(label);
  expect(link.getAttribute("href")).toBe(href);
  expect(link.getAttribute("aria-label")).toBe(label);
  expect(link.hasAttribute("aria-haspopup")).toBe(false);
  expect(link.querySelector('[data-slot="header.cta_contact"]')).not.toBeNull();
  expect(link.classList.contains("inline-flex")).toBe(true);
  expect(link.className).not.toMatch(/hidden/);
  expect(page.querySelector('[data-testid="header-appointment-button"]')).toBeNull();
  expect(page.querySelector('[data-slot="header.cta_appointment"]')).toBeNull();
  expect(page.querySelector('[data-testid="header-enquire-button"]').getAttribute("aria-haspopup")).toBe("dialog");
});

test("compact branding is restricted to the header and retains the home link and accessible name", () => {
  mockLang = "es";
  const page = render(<Header />);
  const brand = page.querySelector('[data-testid="brand-mark"]');
  expect(brand.getAttribute("href")).toBe("/");
  expect(brand.getAttribute("aria-label")).toContain("Xaluca Tours");
  expect(brand.querySelector('[data-slot="brand.first"]').parentElement.classList.contains("sm:inline-flex")).toBe(true);
  expect(brand.querySelector('[data-testid="brand-tagline"]').classList.contains("xl:inline-flex")).toBe(true);
  const normal = render(<BrandMark />);
  expect(normal.querySelector('[data-slot="brand.first"]').parentElement.classList.contains("hidden")).toBe(false);
  expect(normal.querySelector('[data-testid="brand-tagline"]').classList.contains("lg:inline-flex")).toBe(true);
});
