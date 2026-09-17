import React, { act } from "react";
import { createRoot } from "react-dom/client";
import axios from "axios";
import fs from "fs";
import path from "path";
import HomeDictationWidget from "./HomeDictationWidget";
import { TripFloatingProvider, TripFloatingSlot } from "./TripFloatingActions";
import { dictationAvailable, supportsDictation } from "@/lib/voiceDictation";
import { createLiveVoiceRecorder } from "@/lib/liveVoiceDictation";

jest.mock("axios");
// CRA's Jest 27 does not resolve conditional package subpath exports.
jest.mock("@radix-ui/primitive/is-development", () => jest.requireActual("../../node_modules/@radix-ui/primitive/dist/internal/is-development.true.js"), { virtual: true });
let mockLang = "es";
jest.mock("@/contexts/LanguageContext", () => ({ pick: (obj, lang) => obj[lang] || obj.es, useLanguage: () => ({ lang: mockLang }) }));
jest.mock("react-router-dom", () => ({ Link: ({ to, children, ...props }) => <a href={to} {...props}>{children}</a> }));
jest.mock("@/components/EditableText", () => ({ as: Tag = "span", defaults }) => <Tag>{defaults.es}</Tag>);
jest.mock("./JourneyChronology", () => ({ ChronologyButton: () => null }));
jest.mock("@/components/InternationalPhoneInput", () => ({ __esModule: true,
  default: ({ value, onValueChange, testId, required, id, countryPortalContainer }) => <input id={id} type="tel" value={value} onChange={event => onValueChange(event.target.value)} data-testid={testId} data-portal={countryPortalContainer?.dataset.testid} required={required} />,
  isValidInternationalPhone: value => /^\+\d{9,15}$/.test(value),
}));
jest.mock("@/lib/voiceDictation", () => ({ ...jest.requireActual("@/lib/voiceDictation"), supportsDictation: jest.fn(), dictationAvailable: jest.fn() }));
jest.mock("@/lib/liveVoiceDictation", () => ({ createLiveVoiceRecorder: jest.fn() }));

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
  <HomeDictationWidget />
  <TripFloatingSlot name="audio"><button data-testid="audio-control">Audio</button></TripFloatingSlot>
</TripFloatingProvider>));
beforeEach(async () => {
  global.IS_REACT_ACT_ENVIRONMENT = true;
  global.ResizeObserver = class { observe() {} unobserve() {} disconnect() {} };
  mockLang = "es";
  supportsDictation.mockReturnValue(false);
  dictationAvailable.mockResolvedValue(true);
  createLiveVoiceRecorder.mockReset();
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
  expect(get("home-dictation-trigger").querySelector(".home-dictation-trigger-label").getAttribute("aria-hidden")).toBe("true");
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

test("closing during dictation cancels the shared recorder and ignores subsequent transcripts", async () => {
  supportsDictation.mockReturnValue(true);
  const recording = { stop: jest.fn(), cancel: jest.fn() };
  createLiveVoiceRecorder.mockResolvedValue(recording);
  await click("home-dictation-trigger");
  await act(async () => get("home-dictation-modal").querySelector('button[aria-label^="Dictar"]').click());
  expect(createLiveVoiceRecorder).toHaveBeenCalledTimes(1);
  const options = createLiveVoiceRecorder.mock.calls[0][0];
  await act(async () => options.onTranscript("Quiero descubrir Marruecos"));
  expect(get("dictation-message").value).toContain("descubrir Marruecos");
  expect(get("dictation-next").disabled).toBe(true);
  await click("home-dictation-close");
  expect(recording.cancel).toHaveBeenCalledTimes(1);
  expect(options.signal.aborted).toBe(true);
  await act(async () => options.onTranscript("Texto tardío"));
  expect(get("dictation-form")).toBeNull();
  expect(axios.post).not.toHaveBeenCalled();
});

test("the shared two-step flow validates, retains the story and submits one home-attributed lead", async () => {
  await click("home-dictation-trigger");
  await change("dictation-message", "    ");
  await click("dictation-next");
  expect(get("dictation-full_name")).toBeNull();
  await change("dictation-message", "Un viaje cultural por Marruecos de siete días.");
  await click("dictation-next");
  expect(get("dictation-phone").dataset.portal).toBe("home-dictation-country-layer");
  await click("dictation-pref-phone");
  expect(get("dictation-pref-phone-detail").dataset.portal).toBe("home-dictation-country-layer");
  await click("dictation-pref-phone");
  await click("dictation-back");
  expect(get("dictation-message").value).toContain("siete días");
  await click("dictation-next");
  await change("dictation-full_name", "Prueba Xaluca");
  await change("dictation-email", "test@example.com");
  await click("dictation-pref-email");
  await change("dictation-pref-email-detail", "test@example.com");
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

test.each([ ["en", "Your trip, in your own words."], ["fr", "Votre voyage, avec vos mots."] ])("%s widget and modal use the shared translated title", async (lang, title) => {
  mockLang = lang; await render();
  expect(get("home-dictation-trigger").textContent).toBe(title);
  expect(get("home-dictation-trigger").getAttribute("aria-label")).toBe(title);
  await click("home-dictation-trigger");
  const dialog = get("home-dictation-modal");
  expect(document.getElementById(dialog.getAttribute("aria-labelledby")).textContent).toBe(title);
});

test("the floating entry is only mounted by Home; contact continues to use the shared form", () => {
  const base = path.resolve(__dirname, "..");
  expect(fs.readFileSync(path.join(base, "pages/HomePage.jsx"), "utf8")).toContain("<HomeDictationWidget />");
  expect(fs.readFileSync(path.join(base, "components/FormTabs.jsx"), "utf8")).toContain("<DictationForm");
  expect(fs.readFileSync(path.join(base, "components/Layout.jsx"), "utf8")).not.toContain("HomeDictationWidget");
});
