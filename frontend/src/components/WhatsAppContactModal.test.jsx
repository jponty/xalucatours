import React, { act } from "react";
import { createRoot } from "react-dom/client";

jest.mock("react-router-dom", () => ({
  Link: ({ to, children, ...props }) => <a href={to} {...props}>{children}</a>,
  useLocation: () => ({ pathname: "/" }),
}));
jest.mock("@/contexts/LanguageContext", () => ({
  useLanguage: () => ({ lang: "es" }),
  pick: (copy, lang) => copy[lang] || copy.es,
}));
jest.mock("@/components/ui/dialog", () => ({
  Dialog: ({ open, children }) => open ? <div>{children}</div> : null,
  DialogContent: ({ children, "data-testid": testId }) => <div data-testid={testId}>{children}</div>,
  DialogClose: ({ children }) => <>{children}</>,
  DialogTitle: ({ children }) => <h2>{children}</h2>,
  DialogDescription: ({ children }) => <div>{children}</div>,
}));
jest.mock("@/components/InternationalPhoneInput", () => () => null);
jest.mock("@/components/LeadSubmissionSuccess", () => () => null);

import WhatsAppContactModal, { requestWhatsAppContact } from "./WhatsAppContactModal";
import { WHATSAPP_URL } from "./WhatsAppIcon";

let container, root;
const continueToChat = () => act(() => container.querySelector('[data-testid="whatsapp-contact-continue"]').click());

beforeEach(() => {
  global.IS_REACT_ACT_ENVIRONMENT = true;
  jest.spyOn(window, "open").mockImplementation(() => null);
  jest.spyOn(window, "requestAnimationFrame").mockImplementation((callback) => { callback(); return 0; });
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
  act(() => root.render(<WhatsAppContactModal />));
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
  jest.restoreAllMocks();
  delete global.IS_REACT_ACT_ENVIRONMENT;
});

test("the default contact opens the new Business number", () => {
  expect(WHATSAPP_URL).toBe("https://wa.me/34626049676");
  act(() => requestWhatsAppContact());
  continueToChat();
  expect(window.open).toHaveBeenCalledWith(WHATSAPP_URL, "_blank", "noopener,noreferrer");
});

test("sharing preserves its message and the next default contact resets to Business", () => {
  const shareUrl = "https://wa.me/?text=Descubre%20este%20viaje";
  act(() => requestWhatsAppContact(shareUrl));
  continueToChat();
  expect(window.open).toHaveBeenLastCalledWith(shareUrl, "_blank", "noopener,noreferrer");
  act(() => window.dispatchEvent(new CustomEvent("xaluca:open-whatsapp-contact")));
  continueToChat();
  expect(window.open).toHaveBeenLastCalledWith(WHATSAPP_URL, "_blank", "noopener,noreferrer");
});

test("ordinary contact links keep their modal flow", () => {
  const anchor = document.createElement("a");
  anchor.href = WHATSAPP_URL;
  container.appendChild(anchor);
  act(() => anchor.click());
  expect(window.open).not.toHaveBeenCalled();
  continueToChat();
  expect(window.open).toHaveBeenCalledWith(WHATSAPP_URL, "_blank", "noopener,noreferrer");
});
