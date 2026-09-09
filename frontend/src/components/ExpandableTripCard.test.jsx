import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { createPortal } from "react-dom";

jest.mock("react-router-dom", () => ({ Link: ({ to, children, ...props }) => <a href={to} {...props}>{children}</a> }));
jest.mock("@/contexts/LanguageContext", () => ({ pick: (copy, lang) => copy[lang] || copy.es }));
import ExpandableTripCard from "./ExpandableTripCard";

test("a portalled price/share dialog retains its own Escape handling while a card is expanded", () => {
  global.IS_REACT_ACT_ENVIRONMENT = true;
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
    delete global.IS_REACT_ACT_ENVIRONMENT;
  }
});
