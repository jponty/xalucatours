import React, { act } from "react";
import { createRoot } from "react-dom/client";
import ContactForm from "./ContactForm";
import PlannerForm from "./PlannerForm";
import DictationForm from "./DictationForm";
import { createVoiceRecorder, dictationAvailable, transcribeVoice } from "@/lib/voiceDictation";

jest.mock("react-router-dom", () => ({ Link: ({ children, to, ...rest }) => <a href={to} {...rest}>{children}</a>, useLocation: () => ({ pathname: "/contacto" }) }));
jest.mock("@/contexts/LanguageContext", () => ({
  pick: obj => obj?.es || "", useLanguage: () => ({ lang: "es", t: key => key }),
}));
jest.mock("@/components/EditableText", () => ({ as: Tag = "span", defaults, className }) => <Tag className={className}>{defaults?.es || ""}</Tag>);
jest.mock("@/components/EditableImage", () => () => null);
jest.mock("@/components/FromPrice", () => () => null);
jest.mock("@/components/slotScope", () => ({ SlotScope: ({ children }) => children, useSlotId: value => value }));
jest.mock("@/lib/leadCapture", () => ({ useLeadCapture: () => () => ({}) }));
jest.mock("@/lib/tripContext", () => ({ resolveTripContext: () => null, getTripParams: () => [], setTripContext: () => {} }));
jest.mock("@/components/InternationalPhoneInput", () => ({ __esModule: true, default: () => <input type="tel" />, isValidInternationalPhone: () => true }));
jest.mock("@/components/FormExtras", () => ({ WhatHappensNext: () => null, ContactPreference: () => null, TripDurationSummary: () => null }));
jest.mock("@/components/LeadSubmissionSuccess", () => () => null);
jest.mock("@/lib/voiceDictation", () => ({ ...jest.requireActual("@/lib/voiceDictation"), supportsDictation: () => true,
  dictationAvailable: jest.fn(), createVoiceRecorder: jest.fn(), transcribeVoice: jest.fn() }));

let container, root;
beforeEach(() => {
  global.IS_REACT_ACT_ENVIRONMENT = true;
  dictationAvailable.mockResolvedValue(false);
  createVoiceRecorder.mockReset();
  transcribeVoice.mockReset();
  container = document.createElement("div"); document.body.appendChild(container);
  root = createRoot(container);
});

test.each([
  ["Contacto rápido", ContactForm, "contact-input-message"],
  ["Planificación detallada", PlannerForm, "notes"],
  ["Dictado", DictationForm, "dictation-message"],
])("%s only transcribes after stopping the recording", async (_name, Form, testId) => {
  dictationAvailable.mockResolvedValue(true);
  const audio = new Blob(["complete recording"]);
  createVoiceRecorder.mockResolvedValue({ stop: jest.fn().mockResolvedValue(audio), cancel: jest.fn() });
  transcribeVoice.mockResolvedValue("Quiero visitar Marruecos en familia.");
  await act(async () => root.render(<Form />));
  const field = container.querySelector(`[data-testid="${testId}-voice"]`);
  const textarea = field.querySelector("textarea");
  const initial = textarea.value;
  await act(async () => field.querySelector('button[aria-label^="Dictar"]').click());
  expect(createVoiceRecorder).toHaveBeenCalledTimes(1);
  expect(createVoiceRecorder.mock.calls[0][0]).not.toHaveProperty("onTranscript");
  expect(transcribeVoice).not.toHaveBeenCalled();
  expect(textarea.value).toBe(initial);
  expect(field.textContent).toContain("Al detener, el audio se envía");
  const stop = [...field.querySelectorAll("button")].find(button => button.textContent === "Detener y transcribir");
  await act(async () => stop.click());
  expect(transcribeVoice).toHaveBeenCalledTimes(1);
  expect(transcribeVoice).toHaveBeenCalledWith(audio, "es", expect.any(AbortSignal));
  expect(textarea.value).toContain("Quiero visitar Marruecos en familia.");
  expect(textarea.readOnly).toBe(false);
});
afterEach(() => { act(() => root.unmount()); container.remove(); delete global.IS_REACT_ACT_ENVIRONMENT; });

const changeInput = async (selector, value) => {
  const input = container.querySelector(selector);
  await act(async () => {
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set.call(input, value);
    input.dispatchEvent(new Event("input", { bubbles: true }));
  });
  expect(input.value).toBe(value);
};

test("quick contact offers dictation exclusively on the trip message", async () => {
  await act(async () => root.render(<ContactForm />));
  const field = container.querySelector('[data-testid="contact-input-message-voice"]');
  expect(field.querySelector("button").type).toBe("button");
  for (const name of ["name", "party", "message"]) {
    const input = container.querySelector(`[data-testid="contact-input-${name}"]`);
    expect(container.querySelector(`label[for="${input.id}"]`)).not.toBeNull();
  }
  expect(container.querySelectorAll('button[aria-label^="Dictar"]')).toHaveLength(1);
  expect(container.querySelectorAll('[data-testid$="-voice"]')).toHaveLength(1);
  expect(container.innerHTML).not.toMatch(/assemblyai/i);
  expect(container.querySelector("label button")).toBeNull();
  expect(container.querySelector('[data-testid="contact-input-email"]').type).toBe("email");
  expect(container.querySelector('[data-testid="contact-submit-button"]').disabled).toBe(false);
  await changeInput('[data-testid="contact-input-name"]', "Laura García");
  await changeInput('[data-testid="contact-input-party"]', "2 adultos");
});

test("detailed planning offers dictation exclusively on notes, including flexible dates mode", async () => {
  await act(async () => root.render(<PlannerForm />));
  expect(container.querySelectorAll('button[aria-label^="Dictar"]')).toHaveLength(1);
  const flexible = [...container.querySelectorAll("button")].find(button => button.textContent === "Mes flexible");
  await act(async () => flexible.click());
  const field = container.querySelector('[data-testid="notes-voice"]');
  expect(field.querySelector("button").type).toBe("button");
  for (const name of ["full-name", "notes", "flex-month"]) {
    const input = container.querySelector(`[data-testid="${name}"]`);
    expect(container.querySelector(`label[for="${input.id}"]`)).not.toBeNull();
  }
  expect(container.querySelectorAll('button[aria-label^="Dictar"]')).toHaveLength(1);
  expect(container.querySelectorAll('[data-testid$="-voice"]')).toHaveLength(1);
  expect(container.innerHTML).not.toMatch(/assemblyai/i);
  expect(container.querySelector("label button")).toBeNull();
  expect(container.querySelector('[data-testid="notes"]').maxLength).toBe(3000);
  expect(container.querySelector('[data-testid="plan-trip-submit"]').disabled).toBe(false);
  await changeInput('[data-testid="full-name"]', "Laura García");
  await changeInput('[data-testid="flex-month"]', "Octubre 2026");
});
