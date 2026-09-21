import React, { act } from "react";
import { createRoot } from "react-dom/client";
import axios from "axios";
import fs from "fs";
import path from "path";
import GlobalDictationWidget from "./GlobalDictationWidget";
import ContactDetailsCard from "./ContactDetailsCard";
import { TripFloatingProvider, TripFloatingSlot } from "./TripFloatingActions";
import { createVoiceRecorder, dictationAvailable, supportsDictation, transcribeVoice } from "@/lib/voiceDictation";
import { ROUTES, SUPPORTED_LANGS, pathFor } from "@/lib/routes";
import { TRIP_PROGRAMS } from "@/lib/tripPrograms";

jest.mock("axios");
// CRA's Jest 27 does not resolve conditional package subpath exports.
jest.mock("@radix-ui/primitive/is-development", () => jest.requireActual("../../node_modules/@radix-ui/primitive/dist/internal/is-development.true.js"), { virtual: true });
let mockLang = "es";
let mockPath = "/";
jest.mock("@/contexts/LanguageContext", () => ({ pick: (obj, lang) => obj[lang] || obj.es, useLanguage: () => ({ lang: mockLang }) }));
jest.mock("react-router-dom", () => ({
  Link: ({ to, children, ...props }) => <a href={to} {...props}>{children}</a>,
  useLocation: () => ({ pathname: mockPath }),
}));
jest.mock("@/components/EditableText", () => ({ as: Tag = "span", defaults }) => <Tag>{defaults.es}</Tag>);
jest.mock("./JourneyChronology", () => ({ ChronologyButton: () => null }));
jest.mock("@/components/InternationalPhoneInput", () => ({ __esModule: true,
  default: ({ value, onValueChange, testId, required, id, countryPortalContainer }) => <input id={id} type="tel" value={value} onChange={event => onValueChange(event.target.value)} data-testid={testId} data-portal={countryPortalContainer?.dataset.testid} required={required} />,
  isValidInternationalPhone: value => /^\+\d{9,15}$/.test(value),
}));
jest.mock("@/lib/voiceDictation", () => ({ ...jest.requireActual("@/lib/voiceDictation"), supportsDictation: jest.fn(), dictationAvailable: jest.fn(), createVoiceRecorder: jest.fn(), transcribeVoice: jest.fn() }));

let container, root;
const originalResize = global.ResizeObserver;
const get = id => document.querySelector(`[data-testid="${id}"]`);
const click = async id => act(async () => get(id).click());
const change = async (id, value) => act(async () => {
  const element = get(id);
  const proto = element.tagName === "TEXTAREA" ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
  Object.getOwnPropertyDescriptor(proto, "value").set.call(element, value);
  element.dispatchEvent(new Event("input", { bubbles: true }));
});
const render = async () => act(async () => root.render(<TripFloatingProvider>
  <ContactDetailsCard showContactCta testIdPrefix="home-contact" />
  <GlobalDictationWidget />
  <TripFloatingSlot name="audio"><button data-testid="audio-control">Audio</button></TripFloatingSlot>
</TripFloatingProvider>));
beforeEach(async () => {
  global.IS_REACT_ACT_ENVIRONMENT = true;
  global.ResizeObserver = class { observe() {} unobserve() {} disconnect() {} };
  mockLang = "es";
  mockPath = "/";
  supportsDictation.mockReturnValue(false);
  dictationAvailable.mockResolvedValue(true);
  createVoiceRecorder.mockReset();
  transcribeVoice.mockReset();
  window.history.replaceState({}, "", "/");
  window.matchMedia = jest.fn(() => ({ matches: true }));
  Element.prototype.scrollIntoView = jest.fn();
  axios.post.mockReset(); axios.post.mockResolvedValue({ data: {} });
  Object.defineProperty(window, "crypto", { configurable: true, value: require("crypto").webcrypto });
  container = document.createElement("div"); document.body.appendChild(container); root = createRoot(container);
  await render();
});
afterEach(async () => {
  await act(async () => root.unmount()); container.remove();
  global.ResizeObserver = originalResize;
  delete global.IS_REACT_ACT_ENVIRONMENT;
});

test("opens only on demand, uses the real shared form and closes with Escape or the close button", async () => {
  expect(get("home-dictation-modal")).toBeNull();
  expect(get("dictation-form")).toBeNull();
  expect(get("home-dictation-trigger").getAttribute("aria-haspopup")).toBe("dialog");
  expect(get("home-dictation-trigger").getAttribute("aria-label")).toBe("Tu viaje, con tus palabras.");
  expect(get("home-dictation-trigger").textContent).toBe("");
  expect(get("home-dictation-trigger").querySelector("svg").getAttribute("aria-hidden")).toBe("true");
  await click("home-dictation-trigger");
  expect(get("home-dictation-modal").getAttribute("aria-modal")).toBe("true");
  expect(get("dictation-form")).not.toBeNull();
  expect(get("home-dictation-modal").querySelectorAll("ul li")).toHaveLength(10);
  expect(get("home-dictation-modal").innerHTML).not.toMatch(/assemblyai/i);
  expect(document.activeElement).toBe(get("home-dictation-close"));
  expect(get("home-dictation-dock").dataset.blocked).toBe("true");
  await act(async () => document.activeElement.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true })));
  expect(get("home-dictation-modal")).toBeNull();
  expect(get("dictation-form")).toBeNull();
  await act(async () => new Promise(requestAnimationFrame));
  await act(async () => new Promise(requestAnimationFrame));
  expect(document.activeElement).toBe(get("home-dictation-trigger"));
  await click("home-dictation-trigger");
  await click("home-dictation-close");
  expect(get("home-dictation-modal")).toBeNull();
  expect(document.body.hasAttribute("data-scroll-locked")).toBe(false);
});

test("keeps other floating controls in the same stack and yields to blocking UI", async () => {
  const dock = get("home-dictation-dock");
  expect(dock.contains(get("audio-control"))).toBe(true);
  expect(get("audio-control").compareDocumentPosition(get("home-dictation-trigger")) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  await act(async () => { document.body.style.overflow = "hidden"; });
  expect(dock.hasAttribute("inert")).toBe(true);
  await act(async () => { document.body.style.overflow = ""; });
  expect(dock.dataset.blocked).toBe("false");
});

test("closing during dictation cancels the shared recorder without sending audio", async () => {
  supportsDictation.mockReturnValue(true);
  const recording = { stop: jest.fn(), cancel: jest.fn() };
  createVoiceRecorder.mockResolvedValue(recording);
  await click("home-dictation-trigger");
  await act(async () => get("home-dictation-modal").querySelector('button[aria-label^="Dictar"]').click());
  expect(createVoiceRecorder).toHaveBeenCalledTimes(1);
  const options = createVoiceRecorder.mock.calls[0][0];
  expect(options).not.toHaveProperty("onTranscript");
  expect(get("dictation-message").value).toBe("");
  expect(get("dictation-next").disabled).toBe(true);
  await click("home-dictation-close");
  expect(recording.cancel).toHaveBeenCalledTimes(1);
  expect(options.signal.aborted).toBe(true);
  expect(get("dictation-form")).toBeNull();
  expect(transcribeVoice).not.toHaveBeenCalled();
  expect(axios.post).not.toHaveBeenCalled();
});

test("the modal keeps recording local and adds editable text only after stopping", async () => {
  supportsDictation.mockReturnValue(true);
  const audio = new Blob(["recorded audio"]);
  createVoiceRecorder.mockResolvedValue({ stop: jest.fn().mockResolvedValue(audio), cancel: jest.fn() });
  transcribeVoice.mockResolvedValue("Quiero viajar en familia por Marruecos.");
  await click("home-dictation-trigger");
  await change("dictation-message", "Una semana.");
  await act(async () => get("home-dictation-modal").querySelector('button[aria-label^="Dictar"]').click());
  expect(get("dictation-message").value).toBe("Una semana.");
  expect(transcribeVoice).not.toHaveBeenCalled();
  const stop = [...get("home-dictation-modal").querySelectorAll("button")].find(button => button.textContent === "Detener y transcribir");
  await act(async () => stop.click());
  expect(transcribeVoice).toHaveBeenCalledTimes(1);
  expect(transcribeVoice).toHaveBeenCalledWith(audio, "es", expect.any(AbortSignal));
  expect(get("dictation-message").value).toBe("Una semana.\nQuiero viajar en familia por Marruecos.");
  expect(get("dictation-next").disabled).toBe(false);
  await change("dictation-message", "Texto revisado.");
  expect(get("dictation-message").value).toBe("Texto revisado.");
  expect(axios.post).not.toHaveBeenCalled();
});

test("the contact card opens the shared two-step flow, validates and submits one home-attributed lead", async () => {
  await click("home-contact-card-dictation");
  expect(document.querySelectorAll('[data-testid="home-dictation-modal"]')).toHaveLength(1);
  expect(document.querySelectorAll('[data-testid="dictation-form"]')).toHaveLength(1);
  await change("dictation-message", "    ");
  await click("dictation-next");
  expect(get("dictation-first_name")).toBeNull();
  await change("dictation-message", "Un viaje cultural por Marruecos de siete días.");
  await click("dictation-next");
  expect(get("dictation-phone").dataset.portal).toBe("home-dictation-country-layer");
  expect(get("dictation-pref-both").checked).toBe(true);
  expect(get("dictation-pref-phone-detail")).toBeNull();
  await click("dictation-back");
  expect(get("dictation-message").value).toContain("siete días");
  await click("dictation-next");
  await change("dictation-first_name", "Prueba"); await change("dictation-last_name", "Xaluca");
  await change("dictation-email", "test@example.com");
  await click("dictation-pref-email");
  await change("dictation-phone", "+34612345678");
  await click("dictation-submit");
  expect(axios.post).not.toHaveBeenCalled();
  await click("dictation-consent");
  await click("dictation-submit");
  expect(axios.post).toHaveBeenCalledTimes(1);
  expect(axios.post.mock.calls[0][0]).toMatch(/\/api\/contact-requests$/);
  expect(axios.post.mock.calls[0][1]).toEqual(expect.objectContaining({ capture_type: "dictation", source_path: "/", source_route_id: "home", privacy_consent: true }));
  expect(get("lead-success-home")).not.toBeNull();
  get("lead-success-home").addEventListener("click", event => event.preventDefault());
  await click("lead-success-home");
  expect(get("home-dictation-modal")).toBeNull();
});

test("the inline CTA opens without navigation and restores focus to the correct entry point", async () => {
  const url = window.location.href;
  await click("home-contact-card-dictation");
  expect(window.location.href).toBe(url);
  expect(get("home-dictation-modal")).not.toBeNull();
  expect(document.activeElement).toBe(get("home-dictation-close"));
  await click("home-dictation-close");
  await act(async () => new Promise(requestAnimationFrame));
  await act(async () => new Promise(requestAnimationFrame));
  expect(get("home-dictation-modal")).toBeNull();
  expect(document.activeElement).toBe(get("home-contact-card-dictation"));
  await click("home-dictation-trigger");
  await click("home-dictation-close");
  await act(async () => new Promise(requestAnimationFrame));
  await act(async () => new Promise(requestAnimationFrame));
  expect(document.activeElement).toBe(get("home-dictation-trigger"));
});

test.each([ ["en", "Your trip, in your own words."], ["fr", "Votre voyage, avec vos mots."] ])("%s widget and modal use the shared translated title", async (lang, title) => {
  mockLang = lang; await render();
  expect(get("home-dictation-trigger").textContent).toBe("");
  expect(get("home-dictation-trigger").getAttribute("aria-label")).toBe(title);
  await click("home-dictation-trigger");
  const dialog = get("home-dictation-modal");
  expect(document.getElementById(dialog.getAttribute("aria-labelledby")).textContent).toBe(title);
});

test("the entry is mounted once by the public layout; contact keeps the same shared form", () => {
  const base = path.resolve(__dirname, "..");
  expect(fs.readFileSync(path.join(base, "pages/HomePage.jsx"), "utf8")).not.toContain("HomeDictationWidget");
  expect(fs.readFileSync(path.join(base, "components/FormTabs.jsx"), "utf8")).toContain("<DictationForm");
  expect(fs.readFileSync(path.join(base, "components/Layout.jsx"), "utf8").match(/<GlobalDictationWidget\s*\/>/g)).toHaveLength(1);
});

const details = new Set([...Object.keys(TRIP_PROGRAMS), "tourFinDeAno2025", "tourErrAtlasFez56"]);
test.each(Object.keys(ROUTES))("%s has the correct global widget visibility in every language", async routeId => {
  for (const lang of SUPPORTED_LANGS) {
    mockLang = lang;
    mockPath = pathFor(lang, routeId);
    await render();
    if (details.has(routeId)) {
      expect(get("home-dictation-trigger")).toBeNull();
      expect(get("home-dictation-dock")).toBeNull();
      expect(get("home-dictation-modal")).toBeNull();
    } else {
      expect(document.querySelectorAll('[data-testid="home-dictation-trigger"]')).toHaveLength(1);
      expect(get("home-dictation-trigger").textContent).toBe("");
      expect(get("home-dictation-dock").contains(get("audio-control"))).toBe(true);
    }
  }
});

test.each(["/findeano2025", "/en/newyear2025", "/fr/nouvelan2025", "/viajes/desierto_atlas/programa_4n_5d/"])(
  "also excludes redirects and trailing-slash trip URLs: %s", async pathname => {
    mockPath = pathname; await render();
    expect(get("home-dictation-trigger")).toBeNull();
  }
);

test("dynamic editorial pages still have the global widget", async () => {
  mockPath = "/blog/preparar-un-viaje"; await render();
  expect(get("home-dictation-trigger")).not.toBeNull();
});

test("navigation closes the modal, cancels recording and removes the dock on trip details", async () => {
  supportsDictation.mockReturnValue(true);
  const recording = { cancel: jest.fn(), stop: jest.fn() };
  createVoiceRecorder.mockResolvedValue(recording);
  mockPath = "/contacto"; await render();
  await click("home-dictation-trigger");
  await act(async () => get("home-dictation-modal").querySelector('button[aria-label^="Dictar"]').click());
  mockPath = "/viajes/desierto_atlas/programa_4n_5d"; await render();
  expect(recording.cancel).toHaveBeenCalledTimes(1);
  expect(transcribeVoice).not.toHaveBeenCalled();
  expect(get("home-dictation-modal")).toBeNull();
  expect(get("home-dictation-trigger")).toBeNull();
  expect(document.body.hasAttribute("data-scroll-locked")).toBe(false);
  mockPath = "/opiniones"; await render();
  expect(get("home-dictation-trigger")).not.toBeNull();
  await click("home-dictation-trigger");
  expect(get("dictation-message").value).toBe("");
});

test("non-home submissions retain the actual origin and trip context through the shared form", async () => {
  mockPath = "/contacto";
  window.history.replaceState({}, "", "/contacto?trip=tourMarrakechFez67");
  await render(); await click("home-dictation-trigger");
  await change("dictation-message", "Un viaje cultural por Marruecos de siete días.");
  await click("dictation-next");
  await change("dictation-first_name", "Prueba"); await change("dictation-last_name", "Xaluca");
  await change("dictation-email", "test@example.com");
  await click("dictation-pref-email");
  await change("dictation-phone", "+34612345678");
  await click("dictation-consent");
  await click("dictation-submit");
  expect(axios.post).toHaveBeenCalledTimes(1);
  expect(axios.post.mock.calls[0][1]).toEqual(expect.objectContaining({
    capture_type: "dictation", source_path: "/contacto", source_route_id: "contact", related_trip_id: "tourMarrakechFez67",
  }));
});
