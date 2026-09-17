import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

let mockLang = "es";
jest.mock("@/contexts/LanguageContext", () => ({
  useLanguage: () => ({ lang: mockLang }),
  pick: (copy, lang) => copy[lang] || copy.es,
}));
jest.mock("react-router-dom", () => ({
  Link: ({ to, children, ...props }) => <a href={to} {...props}>{children}</a>,
}));
jest.mock("@/components/EditableText", () => ({ as: Tag = "span", defaults, id }) => <Tag id={id}>{defaults[mockLang] || defaults.es}</Tag>);

import ContactDetailsCard from "./ContactDetailsCard";
import HomeTrustStrip from "./HomeTrustStrip";
import { CONTACT } from "@/lib/data";
import { HOME_HELP_OPTIONS } from "@/lib/homeHelpOptions";
import { pathFor } from "@/lib/routes";
import { WHATSAPP_URL } from "./WhatsAppIcon";

const render = (component) => {
  const container = document.createElement("div");
  container.innerHTML = renderToStaticMarkup(component);
  return container;
};

describe("shared direct contact card", () => {
  beforeEach(() => { mockLang = "es"; });

  test("appears immediately after the complete Home help section, without changing its links", () => {
    const page = render(<HomeTrustStrip />);
    const help = page.querySelector('[data-testid="home-help-options"]');
    const card = page.querySelector('[data-testid="home-contact-details-card"]');
    expect(help.nextElementSibling).toBe(card);
    expect(page.querySelectorAll('[data-testid="home-contact-details-card"]')).toHaveLength(1);
    expect(help.textContent).toContain("¿En qué podemos ayudarte?");
    expect([...help.querySelectorAll("a")].map((link) => link.getAttribute("href"))).toEqual(
      HOME_HELP_OPTIONS.map((option) => pathFor("es", option.routeId))
    );
  });

  test.each(["contact", "home-contact"])("keeps %s phone and email links tied to the shared contact data", (prefix) => {
    const page = render(<ContactDetailsCard testIdPrefix={prefix} />);
    expect(page.querySelector("h3").textContent).toBe("Xaluca Tours");
    const phone = page.querySelector(`[data-testid="${prefix}-card-phone"]`);
    const email = page.querySelector(`[data-testid="${prefix}-card-email"]`);
    expect(phone.getAttribute("href")).toBe(`tel:${CONTACT.phoneRaw}`);
    expect(phone.textContent).toContain("937 268 366");
    expect(email.getAttribute("href")).toBe(`mailto:${CONTACT.email}`);
    expect(email.textContent).toContain(CONTACT.email);
    expect(page.querySelectorAll("a")).toHaveLength(2);
    expect(page.querySelector(`[data-testid="${prefix}-card-cta"]`)).toBeNull();
    expect(page.querySelector(`[data-testid="${prefix}-card-whatsapp"]`)).toBeNull();
  });

  test.each([
    ["es", "Contacta con nosotros", "/contacto"],
    ["en", "Contact us", "/en/contact"],
    ["fr", "Contactez-nous", "/fr/contact"],
  ])("the %s home contact card includes the responsive contact CTA", (lang, label, href) => {
    mockLang = lang;
    const card = render(<HomeTrustStrip />).querySelector('[data-testid="home-contact-details-card"]');
    const cta = card.querySelector('[data-testid="home-contact-card-cta"]');
    expect(cta.textContent).toBe(label);
    expect(cta.getAttribute("href")).toBe(href);
    expect(cta.classList.contains("w-full")).toBe(true);
    expect(cta.classList.contains("sm:w-auto")).toBe(true);
    expect(card.querySelectorAll("a")).toHaveLength(4);
    expect(card.querySelector('[data-testid="home-contact-card-phone"]').getAttribute("href")).toBe(`tel:${CONTACT.phoneRaw}`);
    expect(card.querySelector('[data-testid="home-contact-card-email"]').getAttribute("href")).toBe(`mailto:${CONTACT.email}`);
  });

  test.each([
    ["es", "Habla con nosotros por WhatsApp"],
    ["en", "Chat with us on WhatsApp"],
    ["fr", "Échangez avec nous sur WhatsApp"],
  ])("the %s home WhatsApp CTA opens the shared chat directly", (lang, label) => {
    mockLang = lang;
    const card = render(<HomeTrustStrip />).querySelector('[data-testid="home-contact-details-card"]');
    const contact = card.querySelector('[data-testid="home-contact-card-cta"]');
    const whatsapp = card.querySelector('[data-testid="home-contact-card-whatsapp"]');
    expect(contact.nextElementSibling).toBe(whatsapp);
    expect(whatsapp.textContent).toBe(label);
    expect(whatsapp.getAttribute("href")).toBe(WHATSAPP_URL);
    expect(whatsapp.getAttribute("href")).toBe("https://wa.me/34626049676");
    expect(whatsapp.getAttribute("target")).toBe("_blank");
    expect(whatsapp.getAttribute("rel")).toBe("noopener noreferrer");
    // The global WhatsApp handler must leave this direct-chat link alone.
    expect(whatsapp.dataset.whatsappDirect).toBe("true");
    expect(whatsapp.classList.contains("w-full")).toBe(true);
    expect(whatsapp.classList.contains("max-w-full")).toBe(true);
    expect(whatsapp.classList.contains("bg-[#15803D]")).toBe(true);
    expect(whatsapp.classList.contains("hover:bg-[#166534]")).toBe(true);
    expect(whatsapp.classList.contains("text-white")).toBe(true);
    expect(whatsapp.querySelector("svg").getAttribute("fill")).toBe("currentColor");
    expect(whatsapp.querySelector("svg").getAttribute("viewBox")).toBe("0 0 24 24");
    expect(whatsapp.querySelector("svg").classList.contains("h-5")).toBe(true);
    expect(contact.classList.contains("bg-[#C16542]")).toBe(true);
    expect(whatsapp.parentElement.classList.contains("sm:flex-wrap")).toBe(true);
  });

  test.each([
    ["es", "Datos de contacto de Xaluca Tours", "Contacto directo", "Teléfono"],
    ["en", "Xaluca Tours contact details", "Direct contact", "Phone"],
    ["fr", "Coordonnées de Xaluca Tours", "Contact direct", "Téléphone"],
  ])("supports the %s labels", (lang, label, eyebrow, phone) => {
    mockLang = lang;
    const card = render(<ContactDetailsCard />).querySelector("aside");
    expect(card.getAttribute("aria-label")).toBe(label);
    expect(card.textContent).toContain(eyebrow);
    expect(card.textContent).toContain(phone);
  });
});
