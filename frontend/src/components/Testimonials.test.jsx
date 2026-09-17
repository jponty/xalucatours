import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import Testimonials from "./Testimonials";

jest.mock("@/contexts/LanguageContext", () => ({
  useLanguage: () => ({ lang: "es" }),
  pick: (copy, lang) => copy[lang] || copy.es,
}));

const items = [1, 2, 3].map(id => ({
  id, name: `Viajero ${id}`, quote: { es: "Un viaje inolvidable." }, trip: { es: "Marruecos" },
}));
const render = props => {
  const container = document.createElement("div");
  container.innerHTML = renderToStaticMarkup(<Testimonials testid="reviews" items={items} {...props} />);
  return container;
};

test("keeps the reviews action inside the section and after the entire card grid", () => {
  const page = render({ footer: <a href="/opiniones">Ver todas las opiniones</a> });
  const section = page.querySelector("section");
  const footer = section.querySelector('[data-testid="reviews-footer"]');
  expect(footer.previousElementSibling.querySelectorAll("article")).toHaveLength(3);
  expect(footer.parentElement.lastElementChild).toBe(footer);
  expect(footer.querySelector("a").getAttribute("href")).toBe("/opiniones");
  expect(footer.classList.contains("mt-10")).toBe(true);
  expect(footer.classList.contains("md:mt-12")).toBe(true);
  expect(section.classList.contains("py-20")).toBe(true);
  expect(section.classList.contains("md:py-28")).toBe(true);
  expect(footer.className).not.toMatch(/absolute|overflow-hidden|-mt-/);
});

test.each(["full", "compact"])("leaves sections without an action unchanged (%s)", variant => {
  const page = render({ variant });
  expect(page.querySelectorAll("article")).toHaveLength(3);
  expect(page.querySelector('[data-testid="reviews-footer"]')).toBeNull();
});

test("does not render an orphaned action for an empty review section", () => {
  const page = render({ items: [], footer: <a href="/opiniones">Ver todas las opiniones</a> });
  expect(page.innerHTML).toBe("");
});
