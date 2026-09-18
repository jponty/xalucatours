import React, { act } from "react";
import { createRoot } from "react-dom/client";
import axios from "axios";
import DictationForm from "./DictationForm";

jest.mock("axios");
jest.mock("@/contexts/LanguageContext", () => ({ pick: obj => obj.es, useLanguage: () => ({ lang: "es" }) }));
jest.mock("@/components/EditableText", () => ({ as: Tag = "span", defaults }) => <Tag>{defaults.es}</Tag>);
jest.mock("@/components/LeadSubmissionSuccess", () => () => <p data-testid="success">Recibido</p>);
jest.mock("@/components/InternationalPhoneInput", () => ({ __esModule: true,
  default: ({ value, onValueChange, testId, required, id }) => <input id={id} type="tel" value={value} onChange={event => onValueChange(event.target.value)} data-testid={testId} required={required} />,
  isValidInternationalPhone: value => /^\+\d{9,15}$/.test(value),
}));
jest.mock("@/lib/voiceDictation", () => ({ ...jest.requireActual("@/lib/voiceDictation"), supportsDictation: () => false }));

let container, root;
const get = id => container.querySelector(`[data-testid="${id}"]`);
const click = async id => act(async () => get(id).click());
const change = async (id, value) => act(async () => {
  const element = get(id);
  const proto = element.tagName === "TEXTAREA" ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
  Object.getOwnPropertyDescriptor(proto, "value").set.call(element, value);
  element.dispatchEvent(new Event("input", { bubbles: true }));
});
const submit = async () => act(async () => get("dictation-form").dispatchEvent(new Event("submit", { bubbles: true, cancelable: true })));
beforeEach(async () => {
  global.IS_REACT_ACT_ENVIRONMENT = true;
  window.history.replaceState({}, "", "/contacto?trip=tourAtlasDesierto67");
  window.matchMedia = jest.fn(() => ({ matches: true }));
  Element.prototype.scrollIntoView = jest.fn();
  axios.post.mockReset(); axios.post.mockResolvedValue({ data: {} });
  Object.defineProperty(window, "crypto", { configurable: true, value: require("crypto").webcrypto });
  container = document.createElement("div"); document.body.appendChild(container); root = createRoot(container);
  await act(async () => root.render(<DictationForm />));
});
afterEach(() => { act(() => root.unmount()); container.remove(); window.history.replaceState({}, "", "/"); delete global.IS_REACT_ACT_ENVIRONMENT; });

test("step one only asks for a story with all ten optional prompts", () => {
  expect(container.querySelectorAll("textarea")).toHaveLength(1);
  expect(container.querySelectorAll('input:not([type="hidden"]), select')).toHaveLength(0);
  expect(container.querySelectorAll("ul li")).toHaveLength(10);
  expect(container.textContent).toContain("No necesitas seguir ningún orden");
  expect(container.querySelectorAll('button[aria-label^="Dictar"]')).toHaveLength(1);
  expect(container.innerHTML).not.toMatch(/assemblyai/i);
});

test("prevents advancing on empty/whitespace message and preserves all values when going back", async () => {
  await change("dictation-message", "    "); await submit();
  expect(get("dictation-full_name")).toBeNull();
  expect(container.textContent).toContain("entre 4 y 4000");
  await change("dictation-message", "Un viaje en familia al Atlas."); await click("dictation-next");
  await change("dictation-full_name", "Ana García"); await click("dictation-back");
  expect(get("dictation-message").value).toBe("Un viaje en familia al Atlas.");
  await click("dictation-next");
  expect(get("dictation-full_name").value).toBe("Ana García");
  expect(axios.post).not.toHaveBeenCalled();
});

test("requires contact method, independent contact details and privacy; sends one contextual lead", async () => {
  await change("dictation-message", "Del 12 al 18 de octubre, dos adultos, cultura y desierto."); await click("dictation-next");
  await change("dictation-full_name", "Ana García"); await change("dictation-email", "ana@example.com");
  await submit(); expect(axios.post).not.toHaveBeenCalled();
  await click("dictation-pref-email"); await click("dictation-pref-phone");
  expect(get("dictation-pref-email-detail").value).toBe("");
  expect(get("dictation-pref-phone-detail").value).toBe("");
  await submit(); expect(axios.post).not.toHaveBeenCalled();
  await change("dictation-pref-email-detail", "respuesta@example.com");
  await change("dictation-pref-phone-detail", "+34699123456");
  await click("dictation-consent"); await click("dictation-submit");
  expect(axios.post).toHaveBeenCalledTimes(1);
  const [url, data] = axios.post.mock.calls[0];
  expect(url).toMatch(/\/api\/contact-requests$/);
  expect(data).toEqual(expect.objectContaining({ capture_type: "dictation", related_trip_id: "tourAtlasDesierto67",
    email: "ana@example.com", preferred_contact_email: "respuesta@example.com", preferred_contact_phone: "+34699123456", privacy_consent: true }));
  expect(data.source_url).toContain("/contacto?trip=tourAtlasDesierto67");
  expect(data.message).toContain("dos adultos");
  expect(data.travel_dates).toBeNull();
  expect(data.party_size).toBeNull();
  expect(data.submission_id).toBeTruthy();
  expect(get("success")).not.toBeNull();
});

const fillContact = async () => {
  await change("dictation-full_name", "Ana García");
  await change("dictation-email", "ana@example.com");
  await click("dictation-pref-email");
  await change("dictation-pref-email-detail", "respuesta@example.com");
  await click("dictation-consent");
};

test("optional range and traveller counts survive step navigation and reach the existing contact request", async () => {
  await change("dictation-message", "Queremos recorrer Marruecos en familia.");
  await click("dictation-next");
  const fields = get("dictation-optional-trip-details");
  expect(fields.querySelectorAll("input[required]")).toHaveLength(0);
  await change("dictation-start-date", "2026-10-12");
  await change("dictation-end-date", "2026-10-18");
  expect(get("dictation-trip-duration").textContent).toContain("7 días de viaje");
  await change("dictation-adults", "2");
  await change("dictation-children", "1");
  expect(get("dictation-travellers-total").textContent).toBe("Total · 3");
  await click("dictation-back");
  await click("dictation-next");
  expect(get("dictation-adults").value).toBe("2");
  expect(get("dictation-start-date").value).toBe("2026-10-12");
  await fillContact();
  await click("dictation-submit");
  expect(axios.post.mock.calls[0][1]).toMatchObject({
    travel_dates: "Rango: 2026-10-12 → 2026-10-18",
    party_size: "Adultos: 2 · Niños: 1 · Total: 3",
  });
});

test.each([
  ["exact", "dictation-exact-date", "2026-11-14", "Día concreto: 2026-11-14"],
  ["flexible", "dictation-flex-month", "2027-03", "Mes flexible: 2027-03"],
])("only sends the active %s date mode, with month and year preserved", async (mode, field, value, expected) => {
  await change("dictation-message", "Nos gustaría conocer las ciudades imperiales.");
  await click("dictation-next");
  await change("dictation-start-date", "2026-10-12");
  await change("dictation-end-date", "2026-10-18");
  await click(`dictation-date-mode-${mode}`);
  expect(get("dictation-start-date")).toBeNull();
  if (mode === "flexible") expect(get(field).type).toBe("month");
  await change(field, value);
  await fillContact();
  await click("dictation-submit");
  expect(axios.post.mock.calls[0][1].travel_dates).toBe(expected);
});

test("clearing optional fields submits no assumed dates or traveller count", async () => {
  await change("dictation-message", "Buscamos un viaje por el desierto.");
  await click("dictation-next");
  await change("dictation-adults", "2");
  await change("dictation-children", "0");
  expect(get("dictation-travellers-total").textContent).toBe("Total · 2");
  await change("dictation-adults", "");
  await change("dictation-children", "");
  await change("dictation-start-date", "2026-10-12");
  await click("dictation-date-mode-flexible");
  expect(get("dictation-travellers-total").textContent).toBe("Total · —");
  await fillContact();
  await click("dictation-submit");
  expect(axios.post.mock.calls[0][1]).toMatchObject({ travel_dates: null, party_size: null });
});

test("failed send retains the story and reuses the submission identity on retry", async () => {
  axios.post.mockRejectedValueOnce(new Error("offline"));
  await change("dictation-message", "Un viaje cultural de siete días."); await click("dictation-next");
  await change("dictation-full_name", "Ana García"); await change("dictation-email", "ana@example.com");
  await click("dictation-pref-email"); await change("dictation-pref-email-detail", "reply@example.com");
  await click("dictation-consent"); await click("dictation-submit");
  expect(get("success")).toBeNull();
  expect(get("dictation-message").value).toBe("Un viaje cultural de siete días.");
  expect(container.textContent).toContain("No hemos podido enviar");
  await click("dictation-submit");
  expect(axios.post.mock.calls[1][1].submission_id).toBe(axios.post.mock.calls[0][1].submission_id);
  expect(get("success")).not.toBeNull();
});
