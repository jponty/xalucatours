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
