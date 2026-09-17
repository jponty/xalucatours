import React, { act } from "react";
import { createRoot } from "react-dom/client";
import ExitIntentModal from "./ExitIntentModal";

jest.mock("axios", () => ({ post: jest.fn() }));
// CRA's Jest resolver predates Radix's package subpath exports.
jest.mock("@radix-ui/primitive/is-development", () => ({ IS_DEVELOPMENT: true }), { virtual: true });
jest.mock("react-router-dom", () => ({ useLocation: () => ({ pathname: "/" }) }));
jest.mock("@/contexts/LanguageContext", () => ({
  useLanguage: () => ({ lang: "es" }),
  pick: (copy, lang) => copy[lang] || copy.es,
}));
jest.mock("@/lib/routes", () => ({ resolvePath: () => ({ routeId: "home" }) }));
jest.mock("@/components/LeadSubmissionSuccess", () => () => null);

let container, root, originalResizeObserver, originalScrollIntoView;
const get = (suffix) => document.querySelector(`[data-testid="exit-intent-${suffix}"]`);
const click = async (element) => act(async () => element.click());

beforeEach(async () => {
  global.IS_REACT_ACT_ENVIRONMENT = true;
  jest.useFakeTimers();
  window.sessionStorage.clear();
  window.localStorage.clear();
  window.sessionStorage.setItem("xaluca:exit-intent-started", String(Date.now() - 11_000));
  originalResizeObserver = global.ResizeObserver;
  originalScrollIntoView = HTMLElement.prototype.scrollIntoView;
  global.ResizeObserver = class { observe() {} unobserve() {} disconnect() {} };
  HTMLElement.prototype.scrollIntoView = jest.fn();
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
  await act(async () => root.render(<ExitIntentModal />));
  await act(async () => document.dispatchEvent(new MouseEvent("mouseout", { clientY: 0, relatedTarget: null })));
  await act(async () => jest.advanceTimersByTime(50));
  expect(get("modal")).not.toBeNull();
});

afterEach(async () => {
  await act(async () => root.unmount());
  container.remove();
  global.ResizeObserver = originalResizeObserver;
  HTMLElement.prototype.scrollIntoView = originalScrollIntoView;
  jest.useRealTimers();
  window.sessionStorage.clear();
  window.localStorage.clear();
  delete global.IS_REACT_ACT_ENVIRONMENT;
});

test("country choices share the modal layer but sit outside its clipping/scrolling panel", async () => {
  await click(get("phone-country"));
  const popover = get("phone-country-popover");
  expect(popover).not.toBeNull();
  expect(get("backdrop").contains(popover)).toBe(true);
  expect(get("modal").contains(popover)).toBe(false);
  expect(popover.querySelector('[role="listbox"]').style.maxHeight).toContain("--radix-popover-content-available-height");
  expect(document.activeElement).toBe(get("phone-country-search"));
});

test("searching and selecting a country updates the prefix and leaves the form open", async () => {
  await click(get("phone-country"));
  await act(async () => {
    const search = get("phone-country-search");
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set.call(search, "Morocco");
    search.dispatchEvent(new Event("input", { bubbles: true }));
  });
  const option = [...get("phone-country-popover").querySelectorAll('[role="option"]')]
    .find((item) => item.textContent.includes("Marruecos"));
  expect(option).toBeDefined();
  await click(option);
  expect(get("phone-country-popover")).toBeNull();
  expect(get("phone-country").textContent).toContain("Marruecos");
  expect(get("phone-country").textContent).toContain("+212");
  expect(get("modal")).not.toBeNull();
  await act(async () => jest.advanceTimersByTime(50));
  expect(document.activeElement).toBe(get("phone-country"));
});

test("Escape dismisses only the selector before dismissing its parent modal", async () => {
  await click(get("phone-country"));
  await act(async () => get("phone-country-search").dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true, cancelable: true })));
  expect(get("phone-country-popover")).toBeNull();
  expect(get("modal")).not.toBeNull();
  await act(async () => jest.advanceTimersByTime(50));
  await act(async () => get("phone-country").dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true, cancelable: true })));
  expect(get("modal")).toBeNull();
  expect(document.body.style.overflow).not.toBe("hidden");
});
