import React, { act } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createRoot } from "react-dom/client";

jest.mock("react-router-dom", () => ({
  Link: ({ to, children, onClick, ...props }) => (
    <a href={to} {...props} onClick={(event) => { event.preventDefault(); onClick?.(event); }}>{children}</a>
  ),
}));
jest.mock("@/lib/tripContext", () => ({ setTripContext: jest.fn() }));

import TripCustomizationSection from "./TripCustomizationSection";
import { setTripContext } from "@/lib/tripContext";

const render = (element) => {
  const container = document.createElement("div");
  container.innerHTML = renderToStaticMarkup(element);
  return container;
};

test.each([
  ["es", "Personaliza tu viaje", "/contacto", "los itinerarios no son cerrados"],
  ["en", "Personalise your trip", "/en/contact", "itineraries are not set in stone"],
  ["fr", "Personnalisez votre voyage", "/fr/contact", "les itinéraires ne sont pas figés"],
])("explains personalisation and links to contact with trip context in %s", (lang, label, path, message) => {
  const page = render(<TripCustomizationSection routeId="tourDesiertoAtlas45" lang={lang} />);
  const section = page.querySelector("section");
  const cta = page.querySelector("a");
  expect(section.textContent).toContain(message);
  expect(cta.textContent).toBe(label);
  expect(cta.getAttribute("href")).toBe(`${path}?trip=tourDesiertoAtlas45`);
  expect(section.getAttribute("aria-labelledby")).toBe(page.querySelector("h2").id);
  expect(page.querySelectorAll("li")).toHaveLength(4);
  expect(cta.classList.contains("w-full")).toBe(true);
  expect(cta.classList.contains("min-h-12")).toBe(true);
  expect(cta.classList.contains("motion-reduce:transition-none")).toBe(true);
});

test("keeps the selected trip in the existing contact flow", () => {
  global.IS_REACT_ACT_ENVIRONMENT = true;
  const container = document.createElement("div");
  const root = createRoot(container);
  try {
    act(() => root.render(<TripCustomizationSection routeId="tourDesiertoAtlas45" />));
    act(() => container.querySelector("a").click());
    expect(setTripContext).toHaveBeenCalledWith(["tourDesiertoAtlas45"]);
  } finally {
    act(() => root.unmount());
    delete global.IS_REACT_ACT_ENVIRONMENT;
  }
});

test("can be reused without a trip identifier", () => {
  const page = render(<TripCustomizationSection />);
  expect(page.querySelector("a").getAttribute("href")).toBe("/contacto");
});
