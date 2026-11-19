import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

jest.mock("@/lib/leadCapture", () => ({ useLeadCapture: () => () => ({ capture_type: "magic_lamp", source_path: "/" }) }));
jest.mock("@/components/InternationalPhoneInput", () => ({ __esModule: true, default: () => <input type="tel" required />, isValidInternationalPhone: () => true }));

let mockLang = "es";
jest.mock("react-router-dom", () => ({
  Link: ({ to, children, ...props }) => <a href={to} {...props}>{children}</a>,
}));
jest.mock("@/contexts/LanguageContext", () => ({
  useLanguage: () => ({ lang: mockLang }),
  pick: (copy, lang) => copy[lang] || copy.es,
}));

import RuletaPromo from "./RuletaPromo";
import manifest from "../../public/supabase-images.json";

test.each([
  ["es", "detalle de bienvenida"],
  ["en", "welcome gift"],
  ["fr", "cadeau de bienvenue"],
])("home magic lamp keeps the gift a surprise in %s", (lang, expected) => {
  mockLang = lang;
  const page = document.createElement("div");
  page.innerHTML = renderToStaticMarkup(<RuletaPromo />);
  expect(page.textContent).toContain(expected);
  expect(page.textContent.toLowerCase()).not.toMatch(/sorteo|random prize|tirage au sort/);
  expect(page.textContent).not.toContain(lang === "es" ? "té a la menta" : lang === "en" ? "mint tea" : "thé à la menthe");
  expect(page.textContent).toContain(lang === "es" ? "Descubrir mi regalo" : lang === "en" ? "Discover my gift" : "Découvrir mon cadeau");
  expect(page.querySelector('[data-testid="magic-lamp-form"]')).not.toBeNull();
  expect(page.querySelector('[data-testid="concurso-wheel"]')).toBeNull();
});

test("offline contest snapshot keeps 15 prizes, with only 10% and 15% Spa discounts", () => {
  expect(manifest.contest.prizes).toHaveLength(15);
  const discounts = manifest.contest.prizes.filter(prize => prize.label.es.includes("%"));
  expect(discounts).toHaveLength(2);
  expect(discounts.map(prize => prize.short.es)).toEqual(["−10% Spa", "−15% Spa"]);
  for (const prize of discounts) {
    for (const lang of ["es", "en", "fr"]) {
      expect(prize.label[lang]).toContain("Spa");
      expect(prize.short[lang]).toContain("Spa");
    }
  }
  expect(JSON.stringify(discounts)).not.toMatch(/futura reserva|future booking|future réservation/);
});
