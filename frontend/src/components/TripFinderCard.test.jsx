import React, { act } from "react";
import { createRoot } from "react-dom/client";

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  Link: ({ to, children, ...props }) => <a href={to} {...props} onClick={(event) => {
    event.preventDefault();
    mockNavigate(to);
  }}>{children}</a>,
}));
jest.mock("@/contexts/LanguageContext", () => ({ pick: (copy, lang) => copy[lang] || copy.es }));
jest.mock("@/components/FromPrice", () => ({
  FromPrice: ({ testid }) => <button data-testid={testid}>Desde 1.135 € · por persona</button>,
}));
jest.mock("@/components/Img", () => ({
  Img: ({ priority, ...props }) => <img {...props} alt={props.alt} loading={priority ? "eager" : "lazy"} />,
}));
jest.mock("@/components/XalucaLogoBadge", () => () => null);

import TripFinderCard from "./TripFinderCard";
import { XALUCA_TRIPS } from "@/lib/planner/plannerTrips";
import { pathFor } from "@/lib/routes";
import { tt } from "@/lib/tripFinder";

const trip = XALUCA_TRIPS.find(({ routeId }) => routeId === "tourMarrakechFez67");
const images = ["/day-one.jpg", "/day-two.jpg", "/day-three.jpg"];
let container, root, mockToggleFavorite, originalMatchMedia;
const get = (suffix) => container.querySelector(`[data-testid="trip-finder-${suffix}-${trip.routeId}"]`);
const carouselControl = (suffix) => container.querySelector(`[data-testid="trip-finder-carousel-${trip.routeId}-${suffix}"]`);
const activeImage = () => get("carousel").querySelector("img");
const click = (element) => act(() => element.click());
const pointer = (type, pointerType = "mouse") => act(() => {
  const event = new MouseEvent(type, { bubbles: true, relatedTarget: document.body });
  Object.defineProperty(event, "pointerType", { value: pointerType });
  get("card").dispatchEvent(event);
});
const touch = (type, x, y) => act(() => {
  const event = new Event(type, { bubbles: true, cancelable: true });
  Object.defineProperty(event, type === "touchstart" ? "touches" : "changedTouches", { value: [{ clientX: x, clientY: y }] });
  get("image-link").dispatchEvent(event);
});

beforeEach(() => {
  jest.useFakeTimers();
  global.IS_REACT_ACT_ENVIRONMENT = true;
  originalMatchMedia = window.matchMedia;
  window.matchMedia = jest.fn(() => ({ matches: true }));
  mockNavigate.mockClear();
  mockToggleFavorite = jest.fn();
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
  act(() => root.render(<TripFinderCard trip={trip} images={images} chip="Recomendado" lang="es" favorite={false} onToggleFavorite={mockToggleFavorite} />));
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
  window.matchMedia = originalMatchMedia;
  jest.useRealTimers();
  delete global.IS_REACT_ACT_ENVIRONMENT;
});

test("opens a connected panel on mouse hover, preserving the original card and its links", () => {
  expect(get("more").getAttribute("aria-expanded")).toBe("false");
  expect(get("details").hasAttribute("inert")).toBe(true);
  expect(get("details-cta").tabIndex).toBe(-1);
  pointer("pointerover");
  expect(get("card").dataset.expanded).toBe("true");
  expect(get("details").getAttribute("aria-hidden")).toBe("false");
  expect(get("details").hasAttribute("inert")).toBe(false);
  expect(get("details-cta").tabIndex).toBe(0);
  expect(container.querySelector("h3").textContent).toBe(tt(trip.name, "es"));
  expect(get("price").textContent).toContain("1.135 €");
  expect(get("card").textContent).toContain("6 noches · 7 días");
  expect(activeImage().getAttribute("src")).toBe(images[0]);
  expect([...container.querySelectorAll("a")].every((link) => link.getAttribute("href") === pathFor("es", trip.routeId))).toBe(true);
  expect(container.querySelector("a a, a button")).toBeNull();
  pointer("pointerout");
  expect(get("card").dataset.expanded).toBe("true");
  act(() => jest.advanceTimersByTime(160));
  expect(get("card").dataset.expanded).toBe("false");
});

test("a touch pointer does not open on hover; the disclosure opens and closes on tap", () => {
  pointer("pointerover", "touch");
  expect(get("card").dataset.expanded).toBe("false");
  click(get("more"));
  expect(get("card").dataset.expanded).toBe("true");
  pointer("pointerout", "touch");
  act(() => jest.advanceTimersByTime(200));
  expect(get("card").dataset.expanded).toBe("true");
  click(get("more"));
  expect(get("card").dataset.expanded).toBe("false");
  expect(mockNavigate).not.toHaveBeenCalled();
});

test("does not hover-expand when the device has no fine hover pointer", () => {
  window.matchMedia.mockReturnValue({ matches: false });
  pointer("pointerover");
  expect(get("card").dataset.expanded).toBe("false");
});

test("supports keyboard disclosure and Escape restores focus instead of hiding it", () => {
  get("more").focus();
  click(get("more"));
  get("details-cta").focus();
  act(() => get("details-cta").dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true })));
  expect(get("card").dataset.expanded).toBe("false");
  expect(document.activeElement).toBe(get("more"));
});

test("keeps a hovered panel open if the keyboard focus moves into it", () => {
  pointer("pointerover");
  get("details-cta").focus();
  pointer("pointerout");
  act(() => jest.advanceTimersByTime(200));
  expect(get("card").dataset.expanded).toBe("true");
  click(get("details-cta"));
  expect(mockNavigate).toHaveBeenCalledWith(pathFor("es", trip.routeId));
});

test("carousel arrows, pricing and favourites do not navigate or alter the card content", () => {
  click(carouselControl("next"));
  expect(activeImage().getAttribute("src")).toBe(images[1]);
  expect(activeImage().getAttribute("loading")).toBe("lazy");
  click(carouselControl("previous"));
  expect(activeImage().getAttribute("src")).toBe(images[0]);
  click(get("fav"));
  click(get("price"));
  expect(mockToggleFavorite).toHaveBeenCalledWith(trip.routeId);
  expect(mockNavigate).not.toHaveBeenCalled();
  expect(get("card").dataset.expanded).toBe("false");
});

test("horizontal swipe changes the image and suppresses accidental image-link navigation", () => {
  touch("touchstart", 250, 100);
  touch("touchend", 100, 110);
  expect(activeImage().getAttribute("src")).toBe(images[1]);
  click(get("image-link"));
  expect(mockNavigate).not.toHaveBeenCalled();
  act(() => jest.advanceTimersByTime(500));
  click(get("image-link"));
  expect(mockNavigate).toHaveBeenCalledWith(pathFor("es", trip.routeId));
});

test("vertical scrolling does not change the carousel image", () => {
  touch("touchstart", 200, 200);
  touch("touchend", 180, 40);
  expect(activeImage().getAttribute("src")).toBe(images[0]);
  expect(mockNavigate).not.toHaveBeenCalled();
});

test.each(["en", "fr"])("renders localized disclosure, descriptions and destination URLs in %s", (lang) => {
  act(() => root.render(<TripFinderCard trip={trip} images={images} lang={lang} favorite onToggleFavorite={mockToggleFavorite} />));
  click(get("more"));
  expect(get("details-cta").getAttribute("href")).toBe(pathFor(lang, trip.routeId));
  expect(get("details-cta").textContent).toContain(lang === "en" ? "View full itinerary" : "Voir le programme complet");
  expect(get("description").textContent.length).toBeGreaterThan(40);
  expect(get("fav").getAttribute("aria-pressed")).toBe("true");
});

test("one-image cards retain the preview without unnecessary carousel controls", () => {
  act(() => root.render(<TripFinderCard trip={trip} images={[images[0]]} lang="es" onToggleFavorite={mockToggleFavorite} />));
  expect(carouselControl("next")).toBeNull();
  click(get("more"));
  expect(get("card").dataset.expanded).toBe("true");
});
