import React, { act } from "react";
import { createRoot } from "react-dom/client";

let mockLang = "es";
// CRA's Jest resolver predates Radix's package subpath exports.
jest.mock("@radix-ui/primitive/is-development", () => ({ IS_DEVELOPMENT: true }), { virtual: true });
jest.mock("@/contexts/LanguageContext", () => ({
  useLanguage: () => ({ lang: mockLang }),
  pick: (copy, lang) => copy[lang] || copy.es,
}));
jest.mock("react-router-dom", () => ({
  Link: ({ to, children, ...props }) => <a href={to} {...props}>{children}</a>,
}));
jest.mock("@/components/EditableSection", () => ({
  E: ({ as: Tag = "span", defaults, className, id }) => <Tag id={id} className={className}>{defaults[mockLang] || defaults.es}</Tag>,
}));
jest.mock("@/components/EditableText", () => ({ as: Tag = "span", defaults, className }) => <Tag className={className}>{defaults[mockLang] || defaults.es}</Tag>);
jest.mock("@/components/slotScope", () => ({ SlotScope: ({ children }) => children, useSlotId: (id) => id }));
jest.mock("@/components/SectionNav", () => () => null);
jest.mock("@/components/EditableImage", () => () => null);
jest.mock("@/components/YouTubeHeroBackground", () => ({ videoId, endSeconds, posterSrc, posterTestId, children }) => (
  <div data-testid="contact-video" data-video-id={videoId} data-end-seconds={endSeconds}>
    {posterSrc ? <img data-testid={posterTestId} src={posterSrc} alt="" /> : null}
    {children}
  </div>
));
jest.mock("@/components/HeroMonogram", () => () => null);
jest.mock("@/components/TripContextBanner", () => () => null);
jest.mock("@/components/CalendlyEmbed", () => ({ CalendlyEmbed: () => null, useCalendlyScript: () => {} }));
jest.mock("@/components/BookingSession", () => () => <div>Booking session</div>);
jest.mock("@/components/ContactOptionsInfoModal", () => () => null);
jest.mock("@/components/ContactForm", () => () => <form data-testid="quick-form" />);
jest.mock("@/components/PlannerForm", () => () => <form data-testid="detailed-form" />);
jest.mock("@/components/DictationForm", () => () => <form data-testid="dictated-form" />);

import ContactPage from "@/pages/ContactPage";
import { MOROCCO_HERO_POSTER } from "@/lib/heroVideo";
import FormTabs from "./FormTabs";

let container, root;
const originalMatchMedia = window.matchMedia;
const originalScrollIntoView = Element.prototype.scrollIntoView;
const get = (id) => container.querySelector(`[data-testid="${id}"]`);
const render = async (element) => act(async () => root.render(element));
const click = async (id) => act(async () => get(id).click());

beforeEach(() => {
  global.IS_REACT_ACT_ENVIRONMENT = true;
  mockLang = "es";
  window.history.replaceState({}, "", "/contacto?trip=tourFezRak910#contact-form");
  window.matchMedia = jest.fn(() => ({ matches: false }));
  Element.prototype.scrollIntoView = jest.fn();
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(async () => {
  await act(async () => root.unmount());
  container.remove();
  window.matchMedia = originalMatchMedia;
  Element.prototype.scrollIntoView = originalScrollIntoView;
  window.history.replaceState({}, "", "/");
  delete global.IS_REACT_ACT_ENVIRONMENT;
});

test.each([
  ["es", "Elige cómo quieres contactar con nosotros", "escoge libremente", "Todas las solicitudes llegan al mismo equipo de especialistas en viajes a Marruecos de Xaluca Tours."],
  ["en", "Choose how you would like to contact us", "choose whichever option", "All enquiries reach the same team of Morocco travel specialists at Xaluca Tours."],
  ["fr", "Choisissez comment vous souhaitez nous contacter", "choisissez librement", "Toutes les demandes arrivent à la même équipe de spécialistes des voyages au Maroc de Xaluca Tours."],
])("the %s introduction explains free choice and the shared team before any contact options", async (lang, title, choice, team) => {
  mockLang = lang;
  await render(<ContactPage />);
  const introduction = get("contact-introduction");
  expect(introduction.querySelector("h2").textContent).toBe(title);
  expect(introduction.getAttribute("aria-labelledby")).toBe(introduction.querySelector("h2").id);
  expect(introduction.textContent).toContain(choice);
  expect(introduction.textContent).toContain(team);
  for (const id of ["contact-details-card", "contact-form-access", "contact-phone-link", "form-tabs"]) {
    expect(introduction.compareDocumentPosition(get(id)) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  }
});

test("the two choices appear immediately below the unchanged contact details", async () => {
  await render(<ContactPage />);
  expect(get("contact-details-card").nextElementSibling).toBe(get("contact-form-access"));
  expect(get("contact-card-phone").getAttribute("href")).toBe("tel:+34937268366");
  expect(get("contact-card-email").getAttribute("href")).toBe("mailto:xalucatours@xaluca.com");
  expect(get("contact-access-quick").textContent).toContain("consulta rápida");
  expect(get("contact-access-detailed").textContent).toContain("fechas, preferencias y necesidades");
  expect(get("contact-access-quick-cta").textContent).toBe("Contacto rápido");
  expect(get("contact-access-detailed-cta").textContent).toBe("Planificar mi viaje");
  expect(get("contact-form-access").classList.contains("grid-cols-1")).toBe(true);
  expect(get("contact-form-access").classList.contains("sm:grid-cols-2")).toBe(true);
});

test("each CTA opens and focuses the correct form, preserves the trip and supports repeat clicks", async () => {
  await render(<ContactPage />);
  for (const id of ["quick", "detailed", "detailed", "quick"]) {
    await click(`contact-access-${id}-cta`);
    expect(get(`form-tab-${id}`).getAttribute("aria-selected")).toBe("true");
    expect(get(`${id}-form`)).not.toBeNull();
    expect(document.activeElement).toBe(get(`form-tab-${id}`));
    expect(window.location.search).toBe("?trip=tourFezRak910");
    expect(Element.prototype.scrollIntoView).toHaveBeenLastCalledWith({ behavior: "smooth", block: "start" });
  }
  await click("form-tab-appointment");
  expect(get("form-tab-appointment").getAttribute("aria-selected")).toBe("true");
  await click("contact-access-quick-cta");
  expect(get("quick-form")).not.toBeNull();
});

test("the contact hero exposes all five responsive actions and opens each existing form", async () => {
  await render(<ContactPage />);
  const hero = get("contact-hero");
  expect(get("contact-video").dataset.videoId).toBe("hVvEISFw9w0");
  expect(get("contact-video").dataset.endSeconds).toBe("275");
  expect(get("contact-video-poster").getAttribute("src")).toBe(MOROCCO_HERO_POSTER);
  expect(hero.querySelector('[data-testid="hero-cta-book"]').getAttribute("href")).toBe("#booking");
  expect(hero.querySelector('[data-testid="hero-cta-call"]').getAttribute("href")).toBe("tel:+34937268366");
  expect(hero.textContent).toContain("Contacto rápido");
  expect(hero.textContent).toContain("Planificación detallada");
  expect(hero.textContent).toContain("Dictado");

  for (const id of ["quick", "detailed", "dictation"]) {
    const cta = get(`hero-cta-${id}`);
    expect(cta.getAttribute("aria-controls")).toBe("contact-forms");
    await click(`hero-cta-${id}`);
    expect(get(`form-tab-${id}`).getAttribute("aria-selected")).toBe("true");
    expect(document.activeElement).toBe(get(`form-tab-${id}`));
    expect(Element.prototype.scrollIntoView).toHaveBeenLastCalledWith({ behavior: "smooth", block: "start" });
  }
});

test("respects reduced motion when jumping to a form", async () => {
  window.matchMedia = jest.fn(() => ({ matches: true }));
  await render(<ContactPage />);
  await click("contact-access-quick-cta");
  expect(Element.prototype.scrollIntoView).toHaveBeenCalledWith({ behavior: "instant", block: "start" });
});

test.each([
  ["en", "Quick contact", "Detailed planning", "Plan my trip"],
  ["fr", "Contact rapide", "Planification détaillée", "Planifier mon voyage"],
])("the %s page offers translated choices", async (lang, quick, detailed, cta) => {
  mockLang = lang;
  await render(<ContactPage />);
  expect(get("contact-access-quick").querySelector("h3").textContent).toBe(quick);
  expect(get("contact-access-detailed").querySelector("h3").textContent).toBe(detailed);
  expect(get("contact-access-detailed-cta").textContent).toBe(cta);
});

test("FormTabs retains its standalone default and tab switching on other pages", async () => {
  await render(<FormTabs defaultTab="quick" />);
  expect(get("quick-form")).not.toBeNull();
  await click("form-tab-detailed");
  expect(get("detailed-form")).not.toBeNull();
  expect(get("quick-form")).toBeNull();
});

test.each(["es", "en", "fr"])("contact help links remain on the internal assistant page in %s", async (lang) => {
  mockLang = lang;
  await render(<ContactPage />);
  for (const id of ["contact-help-link", "support-open-page"]) {
    expect(get(id).getAttribute("href")).toBe("/asistente");
    expect(get(id).getAttribute("target")).toBeNull();
  }
  expect(container.querySelector('a[href*="chatbase.co"]')).toBeNull();
});

test("both pages share the five ordered tabs and an accessible dictation panel", async () => {
  for (const element of [<ContactPage />, <FormTabs defaultTab="detailed" />]) {
    await render(element);
    const tabs = [...get("form-tabs").querySelectorAll('[role="tablist"] [role="tab"]')];
    expect(tabs.map(tab => tab.textContent)).toEqual(["Planificación detallada", "Contacto rápido", "Dictado", "Asistente Virtual", "Cita previa"]);
    await click("form-tab-dictation");
    expect(get("dictated-form")).not.toBeNull();
    const active = get("form-tab-dictation");
    const panel = get("form-tab-panel-dictation");
    expect(active.getAttribute("aria-controls")).toBe(panel.id);
    expect(panel.getAttribute("aria-labelledby")).toBe(active.id);
  }
});
