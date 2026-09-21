import React, { act, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import axios from "axios";
import VirtualAssistantWidget from "./VirtualAssistantWidget";
import { assistantAvailable, identifyForAssistant, loadAssistantGuide } from "@/lib/assistantApi";
import { createVoiceRecorder, transcribeVoice } from "@/lib/voiceDictation";

jest.mock("axios");
// CRA's Jest 27 cannot resolve this conditional Radix subpath by itself.
jest.mock("@radix-ui/primitive/is-development", () => jest.requireActual("../../node_modules/@radix-ui/primitive/dist/internal/is-development.true.js"), { virtual: true });
let mockLang = "es";
jest.mock("@/contexts/LanguageContext", () => ({ pick: (obj, lang) => obj[lang] || obj.es, useLanguage: () => ({ lang: mockLang }) }));
jest.mock("react-router-dom", () => ({
  Link: ({ to, children, onClick, ...props }) => <a href={to} {...props} onClick={event => { event.preventDefault(); onClick?.(event); }}>{children}</a>,
  useLocation: () => ({ pathname: "/asistente" }),
}));
jest.mock("@/components/EditableText", () => ({ as: Tag = "span", defaults }) => <Tag>{defaults.es}</Tag>);
jest.mock("@/components/InternationalPhoneInput", () => ({ __esModule: true,
  default: ({ value, onValueChange, testId, required, id, countryPortalContainer }) => <input id={id} type="tel" value={value} onChange={event => onValueChange(event.target.value)} data-testid={testId} data-portal={countryPortalContainer?.dataset.testid} required={required} />,
  isValidInternationalPhone: value => /^\+\d{9,15}$/.test(value),
}));
jest.mock("@/lib/assistantApi", () => ({ ...jest.requireActual("@/lib/assistantApi"), assistantAvailable: jest.fn(), identifyForAssistant: jest.fn(), loadAssistantGuide: jest.fn() }));
jest.mock("@/lib/voiceDictation", () => ({ ...jest.requireActual("@/lib/voiceDictation"), createVoiceRecorder: jest.fn(), transcribeVoice: jest.fn() }));

function Harness() {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef(null);
  return <><button ref={triggerRef} onClick={() => setOpen(true)} data-testid="test-assistant-trigger">Open assistant</button><VirtualAssistantWidget open={open} onOpenChange={setOpen} triggerRef={triggerRef} /></>;
}

const guide = (overrides = {}) => ({
  title: "Elige qué quieres conocer",
  description: "Consulta la información publicada por Xaluca Tours.",
  options: [{ id: "trips", label: "Nuestros viajes", selection: { language: "es", topic: "trips" } }],
  sources: [], selection: { language: "es" },
  pagination: { page: 1, pages: 1, previous: null, next: null }, handoff: false,
  ...overrides,
});
const deferred = () => {
  let resolve, reject;
  const promise = new Promise((onResolve, onReject) => { resolve = onResolve; reject = onReject; });
  return { promise, resolve, reject };
};
let container, root, storageWrite;
const originalResize = global.ResizeObserver;
const get = id => document.querySelector(`[data-testid="${id}"]`);
const click = async id => act(async () => get(id).click());
const change = async (id, value) => act(async () => {
  const field = get(id);
  Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set.call(field, value);
  field.dispatchEvent(new Event("input", { bubbles: true }));
});
const open = () => click("test-assistant-trigger");
const fillIdentity = async () => {
  await change("assistant-full_name", "  Test Traveller  ");
  await change("assistant-email", "  traveller@example.com  ");
  await change("assistant-phone", "+34612345678");
};
const identify = async () => {
  await fillIdentity(); await click("assistant-consent"); await click("assistant-identify");
};
const expectContact = (path = "/contacto") => {
  expect(get("assistant-contact-team")).not.toBeNull();
  expect(get("assistant-contact-team").getAttribute("href")).toBe(path);
  expect(document.querySelectorAll('[data-testid="assistant-contact-team"]')).toHaveLength(1);
};
const expectNoFreeform = () => {
  const dialog = get("virtual-assistant-widget");
  expect(dialog.querySelector('textarea, [name="message"], [contenteditable="true"]')).toBeNull();
  expect(get("assistant-question")).toBeNull();
  expect(get("assistant-send")).toBeNull();
  expect(dialog.querySelector('button[aria-label^="Dictar"]')).toBeNull();
  expect(dialog.textContent).not.toContain("Dictar");
  expect(createVoiceRecorder).not.toHaveBeenCalled();
  expect(transcribeVoice).not.toHaveBeenCalled();
};

beforeEach(async () => {
  global.IS_REACT_ACT_ENVIRONMENT = true;
  global.ResizeObserver = class { observe() {} unobserve() {} disconnect() {} };
  window.matchMedia = jest.fn(() => ({ matches: true }));
  Element.prototype.scrollIntoView = jest.fn();
  Object.defineProperty(window, "crypto", { configurable: true, value: require("crypto").webcrypto });
  window.history.replaceState({}, "", "/asistente?utm_source=assistant-test&email=not-for-attribution@example.com");
  mockLang = "es";
  assistantAvailable.mockReset().mockResolvedValue(true);
  identifyForAssistant.mockReset().mockResolvedValue({ token: "memory-only-test-token" });
  loadAssistantGuide.mockReset().mockResolvedValue(guide());
  createVoiceRecorder.mockReset(); transcribeVoice.mockReset(); axios.post.mockReset();
  localStorage.clear(); sessionStorage.clear();
  storageWrite = jest.spyOn(Storage.prototype, "setItem");
  container = document.createElement("div"); document.body.appendChild(container); root = createRoot(container);
  await act(async () => root.render(<Harness />));
});
afterEach(async () => {
  await act(async () => root.unmount()); container.remove();
  storageWrite.mockRestore(); global.ResizeObserver = originalResize;
  delete global.IS_REACT_ACT_ENVIRONMENT;
});

test("opens on demand with identity, permanent contact and no freeform input or guide request", async () => {
  expect(get("virtual-assistant-widget")).toBeNull();
  expect(assistantAvailable).not.toHaveBeenCalled();
  await open();
  expect(get("virtual-assistant-widget").getAttribute("aria-modal")).toBe("true");
  expect(document.activeElement).toBe(get("assistant-close"));
  expect(get("assistant-identity-form")).not.toBeNull();
  expect(get("assistant-phone").dataset.portal).toBe("assistant-country-layer");
  expect(get("assistant-pref-both").checked).toBe(true);
  expect(get("assistant-finish")).toBeNull();
  expectContact(); expectNoFreeform();
  expect(identifyForAssistant).not.toHaveBeenCalled();
  expect(loadAssistantGuide).not.toHaveBeenCalled();
  await click("assistant-close");
  expect(get("virtual-assistant-widget")).toBeNull();
  await act(async () => new Promise(requestAnimationFrame));
  await act(async () => new Promise(requestAnimationFrame));
  expect(document.activeElement).toBe(get("test-assistant-trigger"));
});

test("requires every identity field and privacy consent, even for email-only preference", async () => {
  await open(); await click("assistant-identify");
  expect(document.querySelectorAll('[role="alert"]')).toHaveLength(4);
  expect(identifyForAssistant).not.toHaveBeenCalled();
  await fillIdentity(); await click("assistant-pref-email"); await click("assistant-identify");
  expect(identifyForAssistant).not.toHaveBeenCalled();
  await click("assistant-consent"); await change("assistant-phone", "bad-phone"); await click("assistant-identify");
  expect(identifyForAssistant).not.toHaveBeenCalled();
  await change("assistant-phone", "+34612345678"); await change("assistant-email", "not-an-email"); await click("assistant-identify");
  expect(identifyForAssistant).not.toHaveBeenCalled();
  await change("assistant-email", "  traveller@example.com  "); await click("assistant-identify");
  expect(identifyForAssistant).toHaveBeenCalledTimes(1);
  const [payload, signal] = identifyForAssistant.mock.calls[0];
  expect(payload).toEqual(expect.objectContaining({ full_name: "Test Traveller", email: "traveller@example.com", phone: "+34612345678", privacy_consent: true, preferred_contact: ["email"], language: "es", capture_type: "assistant", source_path: "/asistente", source_route_id: "asistente" }));
  expect(payload.submission_id).toMatch(/^[a-f0-9-]{36}$/);
  expect(payload.source_url).toContain("utm_source=assistant-test");
  expect(payload.source_url).not.toContain("not-for-attribution");
  expect(payload).not.toHaveProperty("newsletter_consent", true);
  expect(signal).toBeInstanceOf(AbortSignal);
  expect(get("assistant-identity-form")).toBeNull();
  expect(loadAssistantGuide).toHaveBeenCalledWith("memory-only-test-token", { language: "es" }, expect.any(AbortSignal));
  expect(get("assistant-option-trips").textContent).toContain("Nuestros viajes");
  expect(get("assistant-finish")).not.toBeNull();
  expect(axios.post).not.toHaveBeenCalled();
  expectContact(); expectNoFreeform();
});

test("retrying failed identification reuses its submission ID and keeps entered details", async () => {
  identifyForAssistant.mockRejectedValueOnce(Object.assign(new Error("failed"), { status: 503 }));
  await open(); await identify();
  expect(get("assistant-full_name").value).toContain("Test Traveller");
  expect(get("assistant-consent").checked).toBe(true);
  expect(document.querySelector('[role="alert"]')).not.toBeNull();
  expect(loadAssistantGuide).not.toHaveBeenCalled();
  expectContact(); expectNoFreeform();
  await click("assistant-close"); await open(); await click("assistant-identify");
  expect(identifyForAssistant).toHaveBeenCalledTimes(2);
  expect(identifyForAssistant.mock.calls[1][0].submission_id).toBe(identifyForAssistant.mock.calls[0][0].submission_id);
  expect(get("assistant-option-trips")).not.toBeNull();
});

test("selection buttons navigate and Back restores the previous guide without a request", async () => {
  const request = { language: "es", topic: "trips" };
  loadAssistantGuide.mockResolvedValueOnce(guide()).mockResolvedValueOnce(guide({ title: "Duración del viaje", description: "Selecciona los días.", selection: request,
    options: [{ id: "four-days", label: "4 días", selection: { ...request, duration: 3 } }] }));
  await open(); await identify(); await click("assistant-option-trips");
  expect(loadAssistantGuide).toHaveBeenNthCalledWith(2, "memory-only-test-token", request, expect.any(AbortSignal));
  expect(get("virtual-assistant-widget").textContent).toContain("Duración del viaje");
  expect(get("assistant-option-four-days")).not.toBeNull();
  expectContact(); expectNoFreeform();
  await click("assistant-back");
  expect(get("assistant-option-trips")).not.toBeNull();
  expect(get("assistant-option-four-days")).toBeNull();
  expect(loadAssistantGuide).toHaveBeenCalledTimes(2);
  expect(loadAssistantGuide.mock.calls.every(([, body]) => !Object.hasOwn(body, "message"))).toBe(true);
});

test("pagination follows the server's previous/next selections and restart loads the root", async () => {
  const first = { language: "es", topic: "trips", duration: 6, page: 1 };
  const second = { ...first, page: 2 };
  const pageOne = guide({ title: "Programas · página 1", selection: first, options: [], pagination: { page: 1, pages: 2, previous: null, next: second } });
  const pageTwo = guide({ title: "Programas · página 2", selection: second, options: [], pagination: { page: 2, pages: 2, previous: first, next: null } });
  loadAssistantGuide.mockResolvedValueOnce(pageOne).mockResolvedValueOnce(pageTwo).mockResolvedValueOnce(pageOne).mockResolvedValueOnce(guide());
  await open(); await identify(); await click("assistant-page-next");
  expect(loadAssistantGuide.mock.calls[1][1]).toEqual(second);
  expect(get("virtual-assistant-widget").textContent).toContain("Programas · página 2");
  await click("assistant-page-previous");
  expect(loadAssistantGuide.mock.calls[2][1]).toEqual(first);
  await click("assistant-restart");
  expect(loadAssistantGuide.mock.calls[3][1]).toEqual({ language: "es" });
  expect(get("assistant-option-trips")).not.toBeNull();
  expect(get("assistant-back") === null || get("assistant-back").disabled).toBe(true);
  expect(identifyForAssistant).toHaveBeenCalledTimes(1);
  expectContact();
});

test("renders all published content as plain text and filters unsafe or malformed citations", async () => {
  const safeSource = { id: "es:enduro:day:2", title: "Enduro <script>bad()</script>", path: "/viajes/enduro_aventura/programa_3n_4d", excerpt: "<img src=x onerror=bad()>Etapa por las dunas." };
  loadAssistantGuide.mockResolvedValueOnce(guide({ title: "<b>Programa publicado</b>", description: "<em>Consulta las etapas</em>", options: [{ id: "safe", label: "<img src=x onerror=bad()>Detalles", selection: { language: "es", topic: "trips" } }], sources: [safeSource,
    { id: "bad", title: "External", path: "https://evil.example", excerpt: "Do not render" },
    { id: "private", title: "Private", path: "/admin#settings", excerpt: "Do not render" },
    { id: "malformed", title: "Object", path: "/info", excerpt: {} } ] }));
  await open(); await identify();
  const dialog = get("virtual-assistant-widget");
  expect(dialog.textContent).toContain("<b>Programa publicado</b>");
  expect(dialog.textContent).toContain("<em>Consulta las etapas</em>");
  expect(dialog.textContent).toContain("<img src=x onerror=bad()>");
  expect(dialog.querySelector("img, script, b, em")).toBeNull();
  expect(dialog.querySelectorAll("article")).toHaveLength(1);
  expect(dialog.querySelector("article a").getAttribute("href")).toBe(safeSource.path);
  expect(dialog.textContent).not.toContain("Do not render");
  expectContact(); expectNoFreeform();
});

test("a guide handoff presents the published explanation and always offers the team", async () => {
  loadAssistantGuide.mockResolvedValueOnce(guide({ title: "Habla con nuestro equipo", description: "Nuestro equipo te ayudará con precios y disponibilidad.", options: [], sources: [], handoff: true }));
  await open(); await identify();
  expect(get("virtual-assistant-widget").textContent).toContain("Nuestro equipo te ayudará con precios y disponibilidad.");
  expect(get("virtual-assistant-widget").querySelectorAll("article")).toHaveLength(0);
  expectContact(); expectNoFreeform();
  await click("assistant-contact-team");
  expect(get("virtual-assistant-widget")).toBeNull();
});

test.each([503, 429])("guide failure %s preserves the previous view and retries the failed selection", async status => {
  loadAssistantGuide.mockResolvedValueOnce(guide()).mockRejectedValueOnce(Object.assign(new Error("private failure details"), { status })).mockResolvedValueOnce(guide({ title: "Viajes disponibles", options: [] }));
  await open(); await identify(); await click("assistant-option-trips");
  expect(document.querySelector('[role="alert"]')).not.toBeNull();
  expect(get("virtual-assistant-widget").textContent).not.toContain("private failure details");
  expect(get("assistant-option-trips")).not.toBeNull();
  expectContact(); expectNoFreeform();
  await click("assistant-guide-retry");
  expect(loadAssistantGuide.mock.calls[2][1]).toEqual(loadAssistantGuide.mock.calls[1][1]);
  expect(get("virtual-assistant-widget").textContent).toContain("Viajes disponibles");
  expect(document.querySelector('[role="alert"]')).toBeNull();
});

test("initial guide errors retain an authenticated retry and permanent contact", async () => {
  loadAssistantGuide.mockRejectedValueOnce(new Error("failed"));
  await open(); await identify();
  expect(get("assistant-identity-form")).toBeNull();
  expect(get("assistant-guide-retry")).not.toBeNull();
  expect(get("assistant-finish")).not.toBeNull();
  expectContact(); expectNoFreeform();
  await click("assistant-guide-retry");
  expect(loadAssistantGuide.mock.calls[1][1]).toEqual({ language: "es" });
  expect(get("assistant-option-trips")).not.toBeNull();
});

test("malformed guide responses show a retry without rendering fabricated content", async () => {
  loadAssistantGuide.mockResolvedValueOnce({ title: { unsafe: true }, options: [], selection: { language: "es" } });
  await open(); await identify();
  expect(get("assistant-guide-retry")).not.toBeNull();
  expect(get("assistant-step-title")).toBeNull();
  expect(document.querySelector('[role="alert"]')).not.toBeNull();
  expectContact(); expectNoFreeform();
  await click("assistant-guide-retry");
  expect(get("assistant-option-trips")).not.toBeNull();
});

test("expired authentication restores the identity gate and starts a new root after identification", async () => {
  loadAssistantGuide.mockResolvedValueOnce(guide()).mockRejectedValueOnce(Object.assign(new Error("expired"), { status: 401 }));
  await open(); await identify(); await click("assistant-option-trips");
  expect(get("assistant-option-trips")).toBeNull();
  expect(get("assistant-identity-form")).not.toBeNull();
  expect(get("assistant-finish")).toBeNull();
  expect(document.querySelector('[role="alert"]').textContent).toContain("sesión ha caducado");
  expectContact();
  await identify();
  expect(loadAssistantGuide.mock.calls[2][1]).toEqual({ language: "es" });
  expect(get("assistant-option-trips")).not.toBeNull();
});

test("contact remains available while checking availability, saving identity and loading the guide", async () => {
  const status = deferred(), session = deferred(), selection = deferred();
  assistantAvailable.mockReturnValueOnce(status.promise);
  identifyForAssistant.mockReturnValueOnce(session.promise);
  loadAssistantGuide.mockReturnValueOnce(selection.promise);
  await open();
  expect(get("assistant-identity-form")).toBeNull();
  expectContact(); expectNoFreeform();
  await act(async () => status.resolve(true));
  await identify();
  expect(get("assistant-identify").disabled).toBe(true);
  expectContact();
  await act(async () => session.resolve({ token: "memory-only-test-token" }));
  expect(get("assistant-identity-form")).toBeNull();
  expect(get("assistant-finish")).not.toBeNull();
  expectContact(); expectNoFreeform();
  await act(async () => selection.resolve(guide()));
  expectContact();
});

test("closing aborts a pending guide request and ignores its late content", async () => {
  const response = deferred();
  loadAssistantGuide.mockReturnValueOnce(response.promise);
  await open(); await identify();
  const signal = loadAssistantGuide.mock.calls[0][2];
  await click("assistant-close");
  expect(signal.aborted).toBe(true);
  expect(get("virtual-assistant-widget")).toBeNull();
  await act(async () => response.resolve(guide({ title: "Stale private guide" })));
  expect(document.body.textContent).not.toContain("Stale private guide");
});

test("closing during identification aborts it, preserves retry details and ignores a late token", async () => {
  const response = deferred();
  identifyForAssistant.mockReturnValueOnce(response.promise);
  await open(); await identify();
  const [payload, signal] = identifyForAssistant.mock.calls[0];
  await click("assistant-close");
  expect(signal.aborted).toBe(true);
  await act(async () => response.resolve({ token: "stale-token" }));
  expect(loadAssistantGuide).not.toHaveBeenCalled();
  await open();
  expect(get("assistant-full_name").value).toContain("Test Traveller");
  expect(get("assistant-consent").checked).toBe(true);
  await click("assistant-identify");
  expect(identifyForAssistant.mock.calls[1][0].submission_id).toBe(payload.submission_id);
  expect(loadAssistantGuide.mock.calls[0][0]).toBe("memory-only-test-token");
});

test("pending selections disable navigation but leave contact and Finish usable", async () => {
  const response = deferred();
  loadAssistantGuide.mockResolvedValueOnce(guide()).mockReturnValueOnce(response.promise);
  await open(); await identify(); await click("assistant-option-trips");
  expect(get("assistant-option-trips").disabled).toBe(true);
  expect(get("assistant-back").disabled).toBe(true);
  expect(get("assistant-restart").disabled).toBe(true);
  expect(get("assistant-finish").disabled).toBe(false);
  expect(get("assistant-guided-flow").getAttribute("aria-busy")).toBe("true");
  expectContact();
  const signal = loadAssistantGuide.mock.calls[1][2];
  await click("assistant-finish");
  expect(signal.aborted).toBe(true);
  await act(async () => response.resolve(guide({ title: "Discard this pending result" })));
  await open();
  expect(get("assistant-identity-form")).not.toBeNull();
  expect(get("virtual-assistant-widget").textContent).not.toContain("Discard this pending result");
});

test("unavailability offers permanent contact and retry without collecting identity or querying", async () => {
  assistantAvailable.mockResolvedValueOnce(false);
  await open();
  expect(get("assistant-identity-form")).toBeNull();
  expect(get("virtual-assistant-widget").textContent).toContain("no está disponible");
  expect(identifyForAssistant).not.toHaveBeenCalled();
  expect(loadAssistantGuide).not.toHaveBeenCalled();
  expectContact(); expectNoFreeform();
  const retry = [...get("virtual-assistant-widget").querySelectorAll("button")].find(button => button.textContent === "Volver a intentar");
  await act(async () => retry.click());
  expect(get("assistant-identity-form")).not.toBeNull();
  expect(assistantAvailable).toHaveBeenCalledTimes(2);
  expectContact();
});

test("finishing clears identity and guide state and uses a new submission ID without persistent storage", async () => {
  loadAssistantGuide.mockResolvedValueOnce(guide({ title: "Selección privada de prueba" }));
  await open(); await identify();
  const firstId = identifyForAssistant.mock.calls[0][0].submission_id;
  await click("assistant-finish"); await open();
  expect(get("assistant-full_name").value).toBe("");
  expect(get("assistant-email").value).toBe("");
  expect(get("assistant-phone").value).toBe("");
  expect(get("assistant-consent").checked).toBe(false);
  expect(get("virtual-assistant-widget").textContent).not.toContain("Selección privada de prueba");
  expect(get("assistant-finish")).toBeNull();
  await identify();
  expect(identifyForAssistant.mock.calls[1][0].submission_id).not.toBe(firstId);
  expect(storageWrite).not.toHaveBeenCalled();
  expect(localStorage.length).toBe(0);
  expect(sessionStorage.length).toBe(0);
});

test.each([["en", "Virtual Assistant", "Contact our team"], ["fr", "Assistant virtuel", "Contacter notre équipe"]])("the %s identity and guide requests use the current language", async (lang, title, contact) => {
  mockLang = lang; await open();
  const dialog = get("virtual-assistant-widget");
  expect(document.getElementById(dialog.getAttribute("aria-labelledby")).textContent).toBe(title);
  expect(get("assistant-contact-team").textContent).toContain(contact);
  expectContact(`/${lang}/contact`);
  await identify();
  expect(identifyForAssistant.mock.calls[0][0].language).toBe(lang);
  expect(loadAssistantGuide.mock.calls[0][1]).toEqual({ language: lang });
  expectNoFreeform();
});

test("changing language clears guide history and loads the root in the new language", async () => {
  loadAssistantGuide.mockResolvedValueOnce(guide()).mockResolvedValueOnce(guide({ title: "Duración del viaje", selection: { language: "es", topic: "trips" } })).mockResolvedValueOnce(guide({ title: "Explore our trips", selection: { language: "en" } }));
  await open(); await identify(); await click("assistant-option-trips");
  mockLang = "en";
  await act(async () => root.render(<Harness />));
  expect(loadAssistantGuide.mock.calls[2][1]).toEqual({ language: "en" });
  expect(get("virtual-assistant-widget").textContent).toContain("Explore our trips");
  expect(get("assistant-back") === null || get("assistant-back").disabled).toBe(true);
  expect(identifyForAssistant).toHaveBeenCalledTimes(1);
  expectContact("/en/contact");
});

test("changing language aborts a pending selection and ignores its late result", async () => {
  const response = deferred();
  loadAssistantGuide.mockResolvedValueOnce(guide()).mockReturnValueOnce(response.promise).mockResolvedValueOnce(guide({ title: "Choisissez votre voyage", selection: { language: "fr" } }));
  await open(); await identify(); await click("assistant-option-trips");
  const signal = loadAssistantGuide.mock.calls[1][2];
  mockLang = "fr";
  await act(async () => root.render(<Harness />));
  expect(signal.aborted).toBe(true);
  expect(loadAssistantGuide.mock.calls[2][1]).toEqual({ language: "fr" });
  await act(async () => response.resolve(guide({ title: "Respuesta antigua en español" })));
  expect(get("assistant-step-title").textContent).toBe("Choisissez votre voyage");
  expect(get("assistant-back").disabled).toBe(true);
  expectContact("/fr/contact");
});
