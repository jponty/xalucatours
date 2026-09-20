import React, { act } from "react";
import { createRoot } from "react-dom/client";
import axios from "axios";
import NewsletterSignup from "./NewsletterSignup";
import FounderContactModal from "./FounderContactModal";
import DownloadProgramModal from "./DownloadProgramModal";
import FastTrackPage from "@/pages/FastTrackPage";
import ConcursoPage from "@/pages/ConcursoPage";
import FeedbackPage from "@/pages/FeedbackPage";

jest.mock("axios", () => ({ post: jest.fn() }));
jest.mock("sonner", () => ({ toast: { success: jest.fn(), error: jest.fn() } }));
jest.mock("react-router-dom", () => ({ Link: ({ to, children, ...rest }) => <a href={to} {...rest}>{children}</a>, useLocation: () => ({ pathname: "/contacto" }) }));
jest.mock("@/contexts/LanguageContext", () => ({ useLanguage: () => ({ lang: "es" }), pick: obj => obj?.es || "" }));
jest.mock("@/components/EditableText", () => ({ as: Tag = "span", defaults }) => <Tag>{defaults?.es}</Tag>);
jest.mock("@/components/Img", () => () => null);
jest.mock("@/lib/leadCapture", () => ({ useLeadCapture: type => () => ({ capture_type: type, source_path: "/contacto", submission_id: "00000000-0000-4000-8000-000000000001" }) }));
jest.mock("@/lib/supabaseImages", () => ({ loadSupabaseImages: async () => ({ contest: { id: "test", open: true, prizes: [] } }) }));
jest.mock("@/components/ui/dialog", () => ({
  Dialog: ({ open, children }) => open ? <div>{children}</div> : null,
  DialogContent: ({ children }) => <div>{children}</div>,
  DialogTitle: ({ children }) => <h2>{children}</h2>,
  DialogDescription: ({ children }) => <div>{children}</div>,
  DialogHeader: ({ children }) => <div>{children}</div>,
}));
jest.mock("@/components/InternationalPhoneInput", () => ({ __esModule: true,
  default: ({ id, name, value, onValueChange, testId, required }) => <input id={id} name={name} type="tel" value={value} onChange={e => onValueChange(e.target.value)} data-testid={testId} required={required} />,
  isValidInternationalPhone: value => /^\+\d{9,15}$/.test(value),
}));

let root, container;
const get = id => document.querySelector(`[data-testid="${id}"]`);
const change = async (id, value) => act(async () => {
  const input = get(id);
  Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set.call(input, value);
  input.dispatchEvent(new Event("input", { bubbles: true }));
});
const click = async id => act(async () => get(id).click());
const submitNewsletter = async () => act(async () => get("newsletter-form").dispatchEvent(new Event("submit", { bubbles: true, cancelable: true })));

beforeEach(() => {
  global.IS_REACT_ACT_ENVIRONMENT = true;
  window.scrollTo = jest.fn();
  axios.post.mockReset(); axios.post.mockResolvedValue({ data: {} });
  container = document.createElement("div"); document.body.appendChild(container); root = createRoot(container);
});
afterEach(() => { act(() => root.unmount()); container.remove(); delete global.IS_REACT_ACT_ENVIRONMENT; });

test.each([
  ["newsletter", <NewsletterSignup />],
  ["founder-contact", <FounderContactModal open onOpenChange={() => {}} />],
  ["founder-contact", <FounderContactModal open contactType="team" initialRecipient="noemi" onOpenChange={() => {}} />],
  ["download", <DownloadProgramModal open onClose={() => {}} />],
  ["fast-track", <FastTrackPage />],
  ["concurso", <ConcursoPage />],
  ["feedback", <FeedbackPage />],
])("%s requires both primary fields and has no duplicated preference fields", async (prefix, element) => {
  await act(async () => root.render(element));
  const group = get(`${prefix}-pref-group`);
  const form = group.closest("form");
  expect(get(`${prefix}-pref-both`).checked).toBe(true);
  expect(group.querySelectorAll("input")).toHaveLength(2);
  expect(form.querySelectorAll('input[type="email"]')).toHaveLength(1);
  expect(form.querySelectorAll('input[type="tel"]')).toHaveLength(1);
  for (const type of ["email", "tel"]) expect(form.querySelector(`input[type="${type}"]`).required).toBe(true);
  await click(`${prefix}-pref-email`);
  expect(get(`${prefix}-pref-both`).checked).toBe(false);
  expect(get(`${prefix}-pref-email`).checked).toBe(true);
  expect(form.querySelector('input[type="email"]').required).toBe(true);
  expect(form.querySelector('input[type="tel"]').required).toBe(true);
  expect(group.querySelectorAll("input")).toHaveLength(2);
});

const fillNewsletter = async () => {
  await act(async () => root.render(<NewsletterSignup />));
  await change("newsletter-first-name", "Ana"); await change("newsletter-last-name", "García");
  await change("newsletter-email", "ANA@example.com"); await change("newsletter-phone", "+34612345678");
  await click("newsletter-consent");
};
test.each(["both", "email"])("newsletter saves %s with both details and independent consent", async option => {
  await fillNewsletter(); await click(`newsletter-pref-${option}`); await submitNewsletter();
  expect(axios.post.mock.calls[0][1]).toMatchObject({ email: "ana@example.com", phone: "+34612345678", preferred_contact: option === "both" ? ["email", "phone"] : ["email"], consent: true });
  expect(container.textContent).toContain("Suscripción confirmada");
});
test.each(["email", "phone"])("newsletter rejects empty %s even if Email only is selected", async field => {
  await fillNewsletter(); await click("newsletter-pref-email"); await change(`newsletter-${field}`, ""); await submitNewsletter();
  expect(axios.post).not.toHaveBeenCalled(); expect(get("newsletter-error")).not.toBeNull();
});
test("newsletter renders structured server errors safely without losing data", async () => {
  await fillNewsletter();
  axios.post.mockRejectedValueOnce({ response: { data: { detail: [{ loc: ["body", "phone"], msg: "required" }] } } });
  await submitNewsletter();
  expect(get("newsletter-error").textContent).toContain("No hemos podido confirmar");
  expect(get("newsletter-email").value).toBe("ANA@example.com");
});
