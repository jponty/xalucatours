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

import RuletaPromo from "./RuletaPromo";
import manifest from "../../public/supabase-images.json";

test.each([
  ["es", "descuentos exclusivos en tratamientos de spa"],
  ["en", "discounts exclusively on spa treatments"],
  ["fr", "réductions exclusivement sur les soins du spa"],
])("home only advertises spa discounts in %s", (lang, expected) => {
  mockLang = lang;
  const page = document.createElement("div");
  page.innerHTML = renderToStaticMarkup(<RuletaPromo />);
  expect(page.textContent).toContain(expected);
  expect(page.querySelector('[data-testid="home-ruleta-cta"]')).not.toBeNull();
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
