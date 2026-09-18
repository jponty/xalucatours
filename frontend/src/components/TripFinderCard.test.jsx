import React, { act } from "react";
import { createRoot } from "react-dom/client";

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  Link: ({ to, children, onClick, ...props }) => <a href={to} {...props} onClick={(event) => {
    onClick?.(event);
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
import { getTripParams, resolveTripContext, setTripContext } from "@/lib/tripContext";

const trip = XALUCA_TRIPS.find(({ routeId }) => routeId === "tourMarrakechFez67");
const images = ["/day-one.jpg", "/day-two.jpg", "/day-three.jpg"];
let container, root, mockToggleFavorite, originalMatchMedia;
const get = (suffix) => container.querySelector(`[data-testid="trip-finder-${suffix}-${trip.routeId}"]`);
const carouselControl = (suffix) => container.querySelector(`[data-testid="trip-finder-carousel-${trip.routeId}-${suffix}"]`);
const activeImage = () => get("carousel").querySelector("img");
const click = (element) => act(() => element.click());
const pointer = (type, pointerType = "mouse", target = get("image-link")) => act(() => {
  const event = new MouseEvent(type, { bubbles: true, relatedTarget: document.body });
  Object.defineProperty(event, "pointerType", { value: pointerType });
  target.dispatchEvent(event);
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
  window.sessionStorage.clear();
  mockToggleFavorite = jest.fn();
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
  act(() => root.render(<TripFinderCard trip={trip} images={images} chip="Recomendado" lang="es" favorite={false} onToggleFavorite={mockToggleFavorite} />));
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
  window.sessionStorage.clear();
  window.matchMedia = originalMatchMedia;
  jest.useRealTimers();
  delete global.IS_REACT_ACT_ENVIRONMENT;
});

test("opens a connected panel on mouse hover, preserving the original card and its links", () => {
  expect(get("more").getAttribute("aria-expanded")).toBe("false");
  expect(get("details").hasAttribute("inert")).toBe(true);
  expect(get("details-cta").tabIndex).toBe(-1);
  expect(get("details-contact-cta").tabIndex).toBe(-1);
  pointer("pointerover");
  expect(get("card").dataset.expanded).toBe("true");
  expect(get("details").getAttribute("aria-hidden")).toBe("false");
  expect(get("details").hasAttribute("inert")).toBe(false);
  expect(get("details-cta").tabIndex).toBe(0);
  expect(get("details-contact-cta").tabIndex).toBe(0);
  expect(container.querySelector("h3").textContent).toBe(tt(trip.name, "es"));
  expect(get("price").textContent).toContain("1.135 €");
  expect(get("card").textContent).toContain("6 noches · 7 días");
  expect(activeImage().getAttribute("src")).toBe(images[0]);
  expect([...container.querySelectorAll("a")].filter((link) => link !== get("details-contact-cta"))
    .every((link) => link.getAttribute("href") === pathFor("es", trip.routeId))).toBe(true);
  expect(get("details-contact-cta").getAttribute("href")).toBe(`/contacto?trip=${trip.routeId}`);
  expect(container.querySelector("a a, a button")).toBeNull();
  pointer("pointerout");
  expect(get("card").dataset.expanded).toBe("true");
  act(() => jest.advanceTimersByTime(160));
  expect(get("card").dataset.expanded).toBe("false");
});

test("a touch pointer on a desktop does not simulate hover; the accessible disclosure still works", () => {
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

test("starts expanded on mobile/tablet, without a disclosure or extra interaction", () => {
  window.matchMedia.mockReturnValue({ matches: false });
  act(() => root.render(<TripFinderCard key="mobile" trip={trip} images={images} lang="es" onToggleFavorite={mockToggleFavorite} />));
  expect(get("more")).toBeNull();
  expect(get("card").dataset.expanded).toBe("true");
  expect(get("details").getAttribute("aria-hidden")).toBe("false");
  expect(get("details").hasAttribute("inert")).toBe(false);
  expect(get("details-cta").tabIndex).toBe(0);
  expect(get("details-contact-cta").tabIndex).toBe(0);
  touch("touchstart", 250, 100);
  touch("touchend", 100, 110);
  expect(activeImage().getAttribute("src")).toBe(images[1]);
  expect(get("card").dataset.expanded).toBe("true");
  click(get("details-cta"));
  expect(mockNavigate).toHaveBeenCalledWith(pathFor("es", trip.routeId));
});

test("hovering the title or price alone does not open the panel on desktop", () => {
  pointer("pointerover", "mouse", get("main-link"));
  pointer("pointerover", "mouse", get("price"));
  expect(get("card").dataset.expanded).toBe("false");
  pointer("pointerover");
  pointer("pointerover", "mouse", get("details-cta"));
  expect(get("card").dataset.expanded).toBe("true");
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

test("the information CTA replaces stale context and never opens the trip programme", () => {
  setTripContext(["tourAtlasDesierto67"]);
  pointer("pointerover");
  const cta = get("details-contact-cta");
  expect(cta.textContent).toBe("Solicitar información");
  expect(cta.classList.contains("bg-[#C16542]")).toBe(true);
  expect(cta.classList.contains("hover:bg-[#2C2621]")).toBe(true);
  expect(get("details-cta").classList.contains("bg-[#2C2621]")).toBe(true);
  expect(get("details-cta").classList.contains("hover:bg-[#C16542]")).toBe(true);
  cta.focus();
  pointer("pointerout");
  act(() => jest.advanceTimersByTime(200));
  expect(get("card").dataset.expanded).toBe("true");
  click(cta);
  expect(mockNavigate).toHaveBeenCalledTimes(1);
  expect(mockNavigate).toHaveBeenCalledWith(`/contacto?trip=${trip.routeId}`);
  expect(getTripParams()).toEqual([trip.routeId]);
  expect(mockToggleFavorite).not.toHaveBeenCalled();
});

test.each([
  [320, false], [390, false], [820, false], [1024, false], [1366, true],
])("every finder result preserves its existing contact context at %i px", (width, desktop) => {
  window.matchMedia.mockReturnValue({ matches: desktop });
  for (const candidate of XALUCA_TRIPS) {
    act(() => root.render(<TripFinderCard key={`${width}-${candidate.routeId}`} trip={candidate}
      images={images} lang="es" onToggleFavorite={mockToggleFavorite} />));
    const query = (suffix) => container.querySelector(`[data-testid="trip-finder-${suffix}-${candidate.routeId}"]`);
    if (desktop) click(query("more"));
    const cta = query("details-contact-cta");
    expect(query("details").hasAttribute("inert")).toBe(false);
    expect(cta.tabIndex).toBe(0);
    expect(cta.getAttribute("href")).toBe(`/contacto?trip=${encodeURIComponent(candidate.routeId)}`);
    expect(query("details-cta").getAttribute("href")).toBe(pathFor("es", candidate.routeId));
    click(cta);
    expect(getTripParams()).toEqual([candidate.routeId]);
    const context = resolveTripContext(getTripParams()[0], "es");
    expect(context?.routeId).toBe(candidate.routeId);
    expect(context?.title).toBeTruthy();
    expect(container.querySelector("a a, a button")).toBeNull();
  }
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
  expect(get("details-contact-cta").getAttribute("href")).toBe(`${pathFor(lang, "contact")}?trip=${trip.routeId}`);
  expect(get("details-contact-cta").textContent).toBe(lang === "en" ? "Request information" : "Demander des informations");
  expect(get("description").textContent.length).toBeGreaterThan(40);
  expect(get("fav").getAttribute("aria-pressed")).toBe("true");
});

test("one-image cards retain the preview without unnecessary carousel controls", () => {
  act(() => root.render(<TripFinderCard trip={trip} images={[images[0]]} lang="es" onToggleFavorite={mockToggleFavorite} />));
  expect(carouselControl("next")).toBeNull();
  click(get("more"));
  expect(get("card").dataset.expanded).toBe("true");
});
