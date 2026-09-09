import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { createPortal } from "react-dom";

jest.mock("react-router-dom", () => ({ Link: ({ to, children, ...props }) => <a href={to} {...props}>{children}</a> }));
jest.mock("@/contexts/LanguageContext", () => ({ pick: (copy, lang) => copy[lang] || copy.es }));
import ExpandableTripCard from "./ExpandableTripCard";

test("a portalled price/share dialog retains its own Escape handling while a card is expanded", () => {
  global.IS_REACT_ACT_ENVIRONMENT = true;
  const originalMatchMedia = window.matchMedia;
  window.matchMedia = jest.fn(() => ({ matches: true }));
  const container = document.createElement("div");
  const portal = document.createElement("div");
  document.body.append(container, portal);
  const root = createRoot(container);
  const onEscape = jest.fn();
  window.addEventListener("keydown", onEscape);
  try {
    act(() => root.render(
      <ExpandableTripCard title="Un viaje" href="/viajes" description="Su descripción" lang="es" testIdPrefix="test-trip">
        <h3>Un viaje</h3>
        {createPortal(<div role="dialog"><button>Cerrar</button></div>, portal)}
      </ExpandableTripCard>
    ));
    act(() => container.querySelector('[data-testid="test-trip-more"]').click());
    const card = container.querySelector("article");
    expect(card.dataset.expanded).toBe("true");
    act(() => portal.querySelector("button").dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true })));
    expect(onEscape).toHaveBeenCalledTimes(1);
    expect(card.dataset.expanded).toBe("true");
    const cta = container.querySelector('[data-testid="test-trip-details-cta"]');
    cta.focus();
    act(() => cta.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true })));
    expect(onEscape).toHaveBeenCalledTimes(1);
    expect(card.dataset.expanded).toBe("false");
    expect(document.activeElement).toBe(container.querySelector('[data-testid="test-trip-more"]'));
  } finally {
    act(() => root.unmount());
    window.removeEventListener("keydown", onEscape);
    container.remove();
    portal.remove();
    window.matchMedia = originalMatchMedia;
    delete global.IS_REACT_ACT_ENVIRONMENT;
  }
});

describe("responsive card interaction", () => {
  let root, container, media, listener, originalMatchMedia;
  const get = (suffix) => container.querySelector(`[data-testid="responsive-${suffix}"]`);
  const render = () => act(() => root.render(
    <ExpandableTripCard title="Marruecos" description="Todo el itinerario, sin cortes." href="/viajes" lang="es" testIdPrefix="responsive">
      <div data-trip-card-image=""><img alt="El viaje" src="/trip.jpg" /></div>
      <h3>Marruecos</h3>
    </ExpandableTripCard>
  ));
  const pointer = (type, target = container.querySelector("img")) => act(() => {
    const event = new MouseEvent(type, { bubbles: true, relatedTarget: document.body });
    Object.defineProperty(event, "pointerType", { value: "mouse" });
    target.dispatchEvent(event);
  });
  const resize = (matches) => act(() => { media.matches = matches; listener(); });

  beforeEach(() => {
    jest.useFakeTimers();
    global.IS_REACT_ACT_ENVIRONMENT = true;
    originalMatchMedia = window.matchMedia;
    media = {
      matches: true,
      addEventListener: jest.fn((event, callback) => { listener = callback; }),
      removeEventListener: jest.fn(),
    };
    window.matchMedia = jest.fn(() => media);
    container = document.createElement("div");
    document.body.append(container);
    root = createRoot(container);
  });
  afterEach(() => {
    act(() => root.unmount());
    container.remove();
    window.matchMedia = originalMatchMedia;
    jest.useRealTimers();
    delete global.IS_REACT_ACT_ENVIRONMENT;
  });

  test.each([
    [320, true, true], [390, false, true], [768, true, true],
    [1024, true, true], [1366, false, true], [1366, true, false],
  ])("width %i, fine hover %s: initially expanded = %s", (width, fineHover, expanded) => {
    media.matches = width >= 1025 && fineHover;
    render();
    expect(window.matchMedia).toHaveBeenCalledWith("(min-width: 1025px) and (hover: hover) and (pointer: fine)");
    expect(get("card").dataset.expanded).toBe(String(expanded));
    expect(get("details").hasAttribute("inert")).toBe(!expanded);
    expect(get("details-cta").tabIndex).toBe(expanded ? 0 : -1);
    if (expanded) {
      expect(get("more")).toBeNull();
      pointer("pointerover");
      pointer("pointerout");
      act(() => jest.advanceTimersByTime(200));
      act(() => get("details-cta").dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true })));
      expect(get("card").dataset.expanded).toBe("true");
    }
  });

  test("responds to orientation/viewport changes and clears stale hover state", () => {
    render();
    pointer("pointerover", container.querySelector("h3"));
    expect(get("card").dataset.expanded).toBe("false");
    pointer("pointerover");
    expect(get("card").dataset.expanded).toBe("true");
    pointer("pointerout");
    resize(false);
    act(() => jest.advanceTimersByTime(200));
    expect(get("card").dataset.expanded).toBe("true");
    expect(get("more")).toBeNull();
    resize(true);
    expect(get("card").dataset.expanded).toBe("false");
    expect(get("more")).not.toBeNull();
    act(() => root.render(null));
    expect(media.removeEventListener).toHaveBeenCalledWith("change", listener);
  });

  test("a responsive change preserves a focused CTA instead of hiding keyboard focus", () => {
    media.matches = false;
    render();
    get("details-cta").focus();
    resize(true);
    expect(document.activeElement).toBe(get("details-cta"));
    expect(get("details").hasAttribute("inert")).toBe(false);
  });
});
