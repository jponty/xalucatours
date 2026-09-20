import React, { act } from "react";
import { createRoot } from "react-dom/client";
import axios from "axios";
import { toast } from "sonner";
import ContactForm from "./ContactForm";
import PlannerForm from "./PlannerForm";

jest.mock("axios");
jest.mock("sonner", () => ({ toast: { success: jest.fn(), error: jest.fn() } }));
jest.mock("react-router-dom", () => ({ Link: ({ children, to, ...rest }) => <a href={to} {...rest}>{children}</a>, useLocation: () => ({ pathname: "/contacto" }) }));
jest.mock("@/contexts/LanguageContext", () => ({ pick: obj => obj?.es || "", useLanguage: () => ({ lang: "es", t: key => key }) }));
jest.mock("@/components/EditableText", () => ({ as: Tag = "span", defaults }) => <Tag>{defaults?.es || ""}</Tag>);
jest.mock("@/components/EditableImage", () => () => null);
jest.mock("@/components/FromPrice", () => () => null);
jest.mock("@/components/slotScope", () => ({ SlotScope: ({ children }) => children, useSlotId: value => value }));
jest.mock("@/lib/voiceDictation", () => ({ ...jest.requireActual("@/lib/voiceDictation"), supportsDictation: () => false }));
jest.mock("@/components/InternationalPhoneInput", () => ({ __esModule: true,
  default: ({ value, onValueChange, testId, required }) => <input type="tel" value={value} onChange={event => onValueChange(event.target.value)} data-testid={testId} required={required} />,
  isValidInternationalPhone: value => value.startsWith("+") && require("libphonenumber-js").isPossiblePhoneNumber(value),
}));

const forms = [
  { kind: "quick", Form: ContactForm, name: "contact-input-name", email: "contact-input-email", phone: "contact-input-phone", message: "contact-input-message", pref: "contact-pref", form: "contact-form" },
  { kind: "detailed", Form: PlannerForm, name: "full-name", email: "email", phone: "phone", message: "notes", pref: "planner-pref", form: "plan-trip-form" },
];
let container, root;
const get = id => container.querySelector(`[data-testid="${id}"]`);
const click = async id => act(async () => get(id).click());
const change = async (id, value) => act(async () => {
  const field = get(id);
  const proto = field.tagName === "TEXTAREA" ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
  Object.getOwnPropertyDescriptor(proto, "value").set.call(field, value);
  field.dispatchEvent(new Event("input", { bubbles: true }));
});
const submit = async id => act(async () => get(id).dispatchEvent(new Event("submit", { bubbles: true, cancelable: true })));

beforeEach(() => {
  global.IS_REACT_ACT_ENVIRONMENT = true;
  Object.defineProperty(window, "crypto", { configurable: true, value: require("crypto").webcrypto });
  window.history.replaceState({}, "", "/contacto");
  window.scrollTo = jest.fn();
  window.matchMedia = jest.fn(() => ({ matches: false, addEventListener: jest.fn(), removeEventListener: jest.fn() }));
  axios.post.mockReset(); axios.post.mockResolvedValue({ data: {} });
  toast.error.mockClear();
  global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => ({}) });
  container = document.createElement("div"); document.body.appendChild(container); root = createRoot(container);
});
afterEach(() => { act(() => root.unmount()); container.remove(); delete global.IS_REACT_ACT_ENVIRONMENT; });

describe.each(forms)("$kind contact submission", config => {
  const fill = async methods => {
    await act(async () => root.render(<config.Form />));
    await change(config.name, "Ana García");
    await change(config.message, "Queremos conocer Marruecos en familia.");
    await change(config.email, "ana@example.com");
    await change(config.phone, "+34612345678");
    expect(get(config.pref + "-both").checked).toBe(true);
    if (methods.length === 1) await click(config.pref + "-email");
    expect(get(config.pref + "-group").querySelectorAll("input")).toHaveLength(2);
    expect(get(config.pref + "-details")).toBeNull();
  };
  const request = () => config.kind === "quick" ? axios.post.mock.calls[0]?.[1] : JSON.parse(global.fetch.mock.calls[0]?.[1].body || "null");

  test.each([["email"], ["email", "phone"]].map(methods => [methods.join(" + "), methods]))("%s reaches the same confirmation and stores usable contact data", async (_label, methods) => {
    await fill(methods);
    expect(get(config.email).required).toBe(true);
    expect(get(config.form).checkValidity()).toBe(true);
    await submit(config.form);
    expect(container.textContent).toContain("¡Recibido! Te respondemos en 24–48 h.");
    expect(get("lead-success-home").getAttribute("href")).toBe("/");
    expect(request()).toMatchObject({
      email: "ana@example.com", phone: "+34612345678", preferred_contact: methods,
      source_path: "/contacto",
    });
  });

  test("a structured validation error leaves the form intact and displays safe text", async () => {
    await fill(["email", "phone"]);
    const detail = [{ type: "value_error", loc: ["body", "email"], msg: "Invalid email", input: "" }];
    axios.post.mockRejectedValueOnce({ response: { data: { detail } } });
    global.fetch.mockResolvedValueOnce({ ok: false, status: 422, json: async () => ({ detail }) });
    await submit(config.form);
    expect(get(config.form)).not.toBeNull();
    expect(get(config.name).value).toBe("Ana García");
    expect(get(config.phone).value).toContain("612");
    if (config.kind === "quick") expect(typeof toast.error.mock.calls[0]?.[0]).toBe("string");
    else expect(container.querySelector('[role="alert"]').textContent).not.toContain("[object Object]");
    await submit(config.form);
    expect(container.textContent).toContain("¡Recibido! Te respondemos en 24–48 h.");
  });
});
