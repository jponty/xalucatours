import React, { act } from "react";
import { createRoot } from "react-dom/client";
import fs from "fs";
import path from "path";
import { TRIP_PROGRAMS } from "@/lib/tripPrograms";
import { pathFor, resolvePath } from "@/lib/routes";
import { setTripContext } from "@/lib/tripContext";
import TripFloatingActions, { TripFloatingProvider, TripFloatingSlot } from "./TripFloatingActions";

jest.mock("react-router-dom", () => ({ Link: ({ to, children, ...props }) => <a href={to} {...props}>{children}</a> }));
jest.mock("@/lib/tripContext", () => ({ setTripContext: jest.fn() }));
jest.mock("./JourneyChronology", () => ({ ChronologyButton: () => <button data-testid="journey-chronology-fab">Cronología</button> }));

describe.each([320, 768, 1024, 1366, 1920])("trip conversion dock at %ipx", (width) => {
  let root, container, hero, bottom, observers;
  let originalMedia, originalResize, originalWidth;
  const get = (id) => document.querySelector(`[data-testid="${id}"]`);
  const render = (props = {}, audio = false) => act(() => root.render(
    <TripFloatingProvider>
      <TripFloatingActions routeId="tourAtlasDesierto67" lang="es" hasChronology {...props} />
      <TripFloatingSlot name="audio">{audio && <div data-testid="test-audio">Audio</div>}</TripFloatingSlot>
    </TripFloatingProvider>
  ));
  const scroll = (nextBottom) => act(() => {
    bottom = nextBottom;
    window.dispatchEvent(new Event("scroll"));
    jest.advanceTimersByTime(20);
  });
  beforeEach(() => {
    global.IS_REACT_ACT_ENVIRONMENT = true;
    jest.useFakeTimers();
    originalMedia = window.matchMedia;
    originalResize = global.ResizeObserver;
    originalWidth = window.innerWidth;
    window.innerWidth = width;
    window.matchMedia = jest.fn(() => ({ matches: width <= 1024, addEventListener: jest.fn(), removeEventListener: jest.fn() }));
    observers = [];
    global.ResizeObserver = class {
      constructor(callback) { this.callback = callback; this.elements = []; observers.push(this); }
      observe(element) { this.elements.push(element); }
      disconnect() { this.disconnected = true; }
    };
    hero = document.createElement("section");
    hero.dataset.testid = "program-hero";
    bottom = 600;
    hero.getBoundingClientRect = () => ({ bottom });
    container = document.createElement("div");
    document.body.append(hero, container);
    root = createRoot(container);
    jest.clearAllMocks();
  });
  afterEach(() => {
    act(() => root.unmount());
    hero.remove(); container.remove();
    document.body.style.overflow = "";
    document.body.removeAttribute("data-scroll-locked");
    global.ResizeObserver = originalResize;
    window.matchMedia = originalMedia;
    window.innerWidth = originalWidth;
    jest.useRealTimers();
    delete global.IS_REACT_ACT_ENVIRONMENT;
  });

  test("starts hidden, opens only beyond the hero, and hides again on return", () => {
    render();
    expect(get("trip-contact-reveal").dataset.visible).toBe("false");
    expect(get("trip-contact-reveal").hasAttribute("inert")).toBe(true);
    expect(get("trip-contact-cta").tabIndex).toBe(-1);
    scroll(1);
    expect(get("trip-contact-reveal").dataset.visible).toBe("false");
    scroll(-1);
    expect(get("trip-contact-reveal").dataset.visible).toBe("true");
    expect(get("trip-contact-cta").tabIndex).toBe(0);
    scroll(100);
    expect(get("trip-contact-reveal").dataset.visible).toBe("false");
  });

  test("retains the dock, audio and contact when resizing between desktop and mobile", () => {
    render({}, true);
    scroll(-1);
    for (const nextWidth of [1920, 390, 1366, 768]) {
      act(() => {
        window.innerWidth = nextWidth;
        window.dispatchEvent(new Event("resize"));
        jest.advanceTimersByTime(20);
      });
      expect(get("trip-floating-dock").contains(get("test-audio"))).toBe(true);
      expect(get("trip-contact-reveal").dataset.visible).toBe("true");
      expect(document.querySelectorAll('[data-testid="journey-chronology-fab"]')).toHaveLength(1);
    }
    act(() => root.render(<div>Non-trip page</div>));
    expect(get("trip-floating-dock")).toBeNull();
    expect(document.documentElement.style.getPropertyValue("--trip-floating-clearance")).toBe("");
    expect(observers.every((observer) => observer.disconnected)).toBe(true);
  });

  test("re-evaluates the real hero boundary after layout changes and resets for another trip", () => {
    render(); scroll(-1);
    bottom = 80;
    act(() => {
      observers.find((item) => item.elements.includes(hero)).callback();
      jest.advanceTimersByTime(20);
    });
    expect(get("trip-contact-reveal").dataset.visible).toBe("false");
    scroll(-1);
    render({ routeId: "tourDesiertoAtlas45" });
    expect(get("trip-contact-reveal").dataset.visible).toBe("false");
    expect(get("trip-contact-cta").getAttribute("href")).toContain("trip=tourDesiertoAtlas45");
  });

  test("audio precedes chronology, which precedes contact, in the same layout flow", () => {
    render({}, true);
    scroll(-1);
    const audio = get("test-audio");
    const chronology = get("journey-chronology-fab");
    const contact = get("trip-contact-card");
    expect(get("trip-floating-dock").contains(audio)).toBe(true);
    expect(audio.compareDocumentPosition(chronology) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(chronology.compareDocumentPosition(contact) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    render({}, false);
    expect(get("test-audio")).toBeNull();
    expect(get("trip-contact-reveal").dataset.visible).toBe("true");
  });

  test("reserves the measured height, including changes in text/audio/control heights", async () => {
    render();
    const dock = get("trip-floating-dock");
    const observer = observers.find((item) => item.elements.includes(dock));
    for (const height of [160, 240, 180]) {
      dock.getBoundingClientRect = () => ({ height });
      await act(async () => observer.callback());
      expect(document.documentElement.style.getPropertyValue("--trip-floating-clearance")).toBe(`${height}px`);
    }
  });

  test("yields to custom dialogs, Radix dialogs, menus and focused form fields", async () => {
    render(); scroll(-1);
    await act(async () => { document.body.style.overflow = "hidden"; });
    expect(get("trip-floating-dock").hasAttribute("inert")).toBe(true);
    await act(async () => { document.body.style.overflow = ""; });
    expect(get("trip-floating-dock").dataset.blocked).toBe("false");
    await act(async () => { document.body.setAttribute("data-scroll-locked", "1"); });
    expect(get("trip-floating-dock").dataset.blocked).toBe("true");
    await act(async () => { document.body.removeAttribute("data-scroll-locked"); });
    const field = document.createElement("input"); container.append(field);
    act(() => field.focus());
    expect(get("trip-floating-dock").dataset.blocked).toBe("true");
    act(() => field.blur());
    expect(get("trip-floating-dock").dataset.blocked).toBe("false");
  });

  test.each(["es", "en", "fr"])("preserves the exact trip in the %s contact URL and session", (lang) => {
    render({ lang }); scroll(-1);
    const cta = get("trip-contact-cta");
    expect(cta.getAttribute("href")).toBe(`${pathFor(lang, "contact")}?trip=tourAtlasDesierto67`);
    cta.addEventListener("click", (e) => e.preventDefault());
    act(() => cta.click());
    expect(setTripContext).toHaveBeenCalledWith(["tourAtlasDesierto67"]);
  });

  test("a trip without chronology still gets contact, without a broken chronology button", () => {
    render({ hasChronology: false }); scroll(-1);
    expect(get("journey-chronology-fab")).toBeNull();
    expect(get("trip-contact-reveal").dataset.visible).toBe("true");
  });
});

test("all registered trip pages use the shared template and retain correct contact targets", () => {
  const src = path.resolve(__dirname, "..");
  const routes = fs.readFileSync(path.join(src, "lib/routeComponents.js"), "utf8");
  for (const routeId of Object.keys(TRIP_PROGRAMS)) {
    const component = routes.match(new RegExp(`\\b${routeId}:\\s*(\\w+)`))?.[1];
    expect(component).toBeTruthy();
    const pageImport = routes.match(new RegExp(`import\\s+${component}\\s+from\\s+["']([^"']+)`))?.[1]
      || [...routes.matchAll(/import\s*\{([^}]+)\}\s*from\s*["']([^"']+)/g)]
        .find((match) => match[1].split(",").some((name) => name.trim() === component))?.[2];
    if (!pageImport) throw new Error(`Missing page import for ${routeId}: ${component}`);
    const page = fs.readFileSync(path.join(src, pageImport.replace("@/", "") + ".jsx"), "utf8");
    expect(page).toMatch(/<ProgramTemplate\b/);
    expect(page).toContain("showJourneyChronology");
    for (const lang of ["es", "en", "fr"]) expect(resolvePath(pathFor(lang, routeId)).routeId).toBe(routeId);
  }
  expect(fs.readFileSync(path.join(src, "components/ProgramTemplate.jsx"), "utf8")).toContain("<TripFloatingActions");
  expect(fs.readFileSync(path.join(src, "pages/FinDeAno2026Page.jsx"), "utf8")).toContain("<TripFloatingActions");
});
