import React, { act } from "react";
import { createRoot } from "react-dom/client";
import axios from "axios";
import ExitIntentModal from "./ExitIntentModal";
import { createVoiceRecorder, dictationAvailable, supportsDictation, transcribeVoice } from "@/lib/voiceDictation";

let mockLang = "es";
jest.mock("axios", () => ({ post: jest.fn() }));
jest.mock("@/components/EditableText", () => ({ children }) => <>{children}</>);
jest.mock("react-router-dom", () => ({ useLocation: () => ({ pathname: "/" }) }));
jest.mock("@/contexts/LanguageContext", () => ({
  useLanguage: () => ({ lang: mockLang }),
  pick: (copy, lang) => copy[lang] || copy.es,
}));
jest.mock("@/lib/routes", () => ({ resolvePath: () => ({ routeId: "home" }) }));
jest.mock("@/components/InternationalPhoneInput", () => ({
  __esModule: true,
  default: ({ name, value, onValueChange, testId }) => (
    <input name={name} value={value} onChange={(event) => onValueChange(event.target.value)} data-testid={testId} />
  ),
  isValidInternationalPhone: (value) => /^\+\d{9,15}$/.test(value),
}));
jest.mock("@/components/LeadSubmissionSuccess", () => () => <p>Solicitud recibida</p>);
jest.mock("@/lib/voiceDictation", () => ({
  ...jest.requireActual("@/lib/voiceDictation"),
  supportsDictation: jest.fn(),
  dictationAvailable: jest.fn(),
  createVoiceRecorder: jest.fn(),
  transcribeVoice: jest.fn(),
}));

describe("ExitIntentModal contact names", () => {
  let container;
  let root;
  const field = (testId) => document.querySelector(`[data-testid="exit-intent-${testId}"]`);
  const fill = (testId, value) => {
    act(() => {
      const element = field(testId);
      const prototype = element.tagName === "TEXTAREA" ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
      Object.getOwnPropertyDescriptor(prototype, "value").set.call(element, value);
      element.dispatchEvent(new Event("input", { bubbles: true }));
    });
  };
  const open = () => {
    act(() => root.render(<ExitIntentModal />));
    act(() => document.dispatchEvent(new MouseEvent("mouseout", { clientY: 0, relatedTarget: null })));
    expect(field("modal")).not.toBeNull();
  };
  const fillValidForm = () => {
    fill("name", "Joan");
    fill("last-name", "Pont");
    fill("email", "joan@example.com");
    fill("phone", "+34612345678");
    act(() => field("privacy").click());
  };
  const submit = async () => {
    await act(async () => field("form").dispatchEvent(new Event("submit", { bubbles: true, cancelable: true })));
  };

  beforeEach(() => {
    Object.defineProperty(window, "crypto", { configurable: true, value: require("crypto").webcrypto });
    global.IS_REACT_ACT_ENVIRONMENT = true;
    jest.useFakeTimers();
    mockLang = "es";
    axios.post.mockReset();
    axios.post.mockResolvedValue({ data: { id: "test-lead" } });
    supportsDictation.mockReturnValue(false);
    dictationAvailable.mockResolvedValue(true);
    createVoiceRecorder.mockReset();
    transcribeVoice.mockReset();
    window.sessionStorage.clear();
    window.localStorage.clear();
    window.sessionStorage.setItem("xaluca:exit-intent-started", String(Date.now() - 11_000));
    document.body.style.overflow = "";
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => root.unmount());
    container.remove();
    jest.useRealTimers();
    window.sessionStorage.clear();
    window.localStorage.clear();
    delete global.IS_REACT_ACT_ENVIRONMENT;
  });

  test.each([
    ["es", "Nombre *", "Apellido(s) *"],
    ["en", "First name *", "Last name *"],
    ["fr", "Prénom *", "Nom de famille *"],
  ])("shows separate required fields with matching styles in %s", (lang, firstLabel, lastLabel) => {
    mockLang = lang;
    open();
    const first = field("name");
    const last = field("last-name");
    expect(first.labels[0].textContent).toBe(firstLabel);
    expect(last.labels[0].textContent).toBe(lastLabel);
    expect(first.required).toBe(true);
    expect(last.required).toBe(true);
    expect(first.checkValidity()).toBe(false);
    expect(last.checkValidity()).toBe(false);
    expect(first.autocomplete).toBe("given-name");
    expect(last.autocomplete).toBe("family-name");
    expect(first.className).toBe(last.className);
    expect(first.closest("label").parentElement.className).toContain("sm:grid-cols-2");
  });

  test.each([
    ["name", ""], ["last-name", ""], ["name", "   "], ["last-name", "   "],
  ])("does not submit when %s is empty or whitespace (%j)", async (testId, value) => {
    open();
    fillValidForm();
    fill(testId, value);
    await submit();
    expect(axios.post).not.toHaveBeenCalled();
    expect(field("error").textContent).toBe("Introduce tu nombre y tus apellidos.");
    expect(field("success")).toBeNull();
  });

  test("sends both names together through the existing contact API, preserving compound names", async () => {
    open();
    fillValidForm();
    fill("name", "  María José  ");
    fill("last-name", "  García de la Cruz  ");
    await submit();
    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(axios.post).toHaveBeenCalledWith(expect.stringMatching(/\/api\/contact-requests$/), expect.objectContaining({

      email: "joan@example.com",
      journey_interest: "exit-intent",
      preferred_contact: ["email", "phone"],
      phone: "+34612345678",
      source_path: "/",
    }));
    expect(field("success")).not.toBeNull();
  });

  test("adds the optional editable message to the same lead submission", async () => {
    open();
    fillValidForm();
    fill("message", "Quiero conocer Fez y Chefchaouen en familia.");
    await submit();
    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(axios.post.mock.calls[0][1].message).toContain("Quiero conocer Fez y Chefchaouen en familia.");
    expect(axios.post.mock.calls[0][1].message).toContain("Solicitud desde modal de intención de salida.");
  });

  test("reuses dictation and adds the transcript to the editable message only after stopping", async () => {
    supportsDictation.mockReturnValue(true);
    const audio = new Blob(["recorded audio"]);
    createVoiceRecorder.mockResolvedValue({ stop: jest.fn().mockResolvedValue(audio), cancel: jest.fn() });
    transcribeVoice.mockResolvedValue("Queremos recorrer el norte de Marruecos.");
    open();
    await act(async () => Promise.resolve());

    const voice = field("message-voice");
    const dictate = voice.querySelector('button[aria-label^="Dictar"]');
    expect(dictate).not.toBeNull();
    await act(async () => dictate.click());
    expect(field("message").value).toBe("");
    expect(transcribeVoice).not.toHaveBeenCalled();
    expect(field("submit").disabled).toBe(true);

    const stop = [...voice.querySelectorAll("button")].find((button) => button.textContent === "Detener y transcribir");
    await act(async () => stop.click());
    expect(transcribeVoice).toHaveBeenCalledWith(audio, "es", expect.any(AbortSignal));
    expect(field("message").value).toBe("Queremos recorrer el norte de Marruecos.");
    expect(field("submit").disabled).toBe(false);

    fill("message", "Texto revisado por el usuario.");
    expect(field("message").value).toBe("Texto revisado por el usuario.");
  });

  test("validates each independent name length without truncating", async () => {
    open();
    fillValidForm();
    fill("name", "A".repeat(121));
    fill("last-name", "B".repeat(60));
    await submit();
    expect(axios.post).not.toHaveBeenCalled();
    expect(field("error").textContent).toContain("120 caracteres");
  });

  test("keeps consent mandatory", async () => {
    open();
    fillValidForm();
    act(() => field("privacy").click());
    await submit();
    expect(axios.post).not.toHaveBeenCalled();
    expect(field("error").textContent).toBe("Debes aceptar la política de privacidad.");
  });

  test("preserves both fields after a failed request and does not confirm success", async () => {
    axios.post.mockRejectedValue(new Error("Test failure"));
    open();
    fillValidForm();
    await submit();
    expect(field("success")).toBeNull();
    expect(field("error").textContent).toBe("No se pudo enviar la solicitud. Inténtalo de nuevo.");
    expect(field("name").value).toBe("Joan");
    expect(field("last-name").value).toBe("Pont");
    expect(window.localStorage.getItem("xaluca:exit-intent-converted")).toBeNull();
  });
});
