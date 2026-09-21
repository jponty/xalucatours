import React, { act } from "react";
import { createRoot } from "react-dom/client";
import axios from "axios";

jest.mock("axios", () => ({ post: jest.fn() }));
jest.mock("@/components/EditableText", () => ({ children }) => <>{children}</>);
jest.mock("react-router-dom", () => ({ useLocation: () => ({ pathname: "/contacto" }) }));
jest.mock("@/contexts/LanguageContext", () => ({
  useLanguage: () => ({ lang: "es" }),
  pick: (copy, lang) => copy[lang] || copy.es,
}));
jest.mock("@/lib/leadCapture", () => ({
  useLeadCapture: () => () => ({
    capture_type: "whatsapp_business",
    source_url: "https://xalucatours.com/contacto?utm_source=home",
    source_path: "/contacto",
    source_route_id: "contact",
    source_label: "Contacto",
    submission_id: "00000000-0000-4000-8000-000000000001",
  }),
}));
jest.mock("@/components/ui/dialog", () => ({
  Dialog: ({ open, children }) => open ? <div>{children}</div> : null,
  DialogContent: ({ children, "data-testid": testId }) => <div data-testid={testId}>{children}</div>,
  DialogTitle: ({ children }) => <h2>{children}</h2>,
  DialogDescription: ({ children }) => <div>{children}</div>,
}));
jest.mock("@/components/InternationalPhoneInput", () => ({
  __esModule: true,
  default: ({ name, value, onValueChange, testId, required, countryPortalContainer }) => (
    <input
      name={name}
      value={value}
      onChange={(event) => onValueChange(event.target.value)}
      data-testid={testId}
      data-portal-ready={countryPortalContainer ? "true" : "false"}
      required={required}
    />
  ),
  isValidInternationalPhone: (value) => /^\+\d{9,15}$/.test(value),
}));

import WhatsAppContactModal, { requestWhatsAppContact } from "./WhatsAppContactModal";
import { WHATSAPP_URL } from "./WhatsAppIcon";

describe("mandatory WhatsApp Business lead gate", () => {
  let container;
  let root;
  let popup;

  const field = (testId) => document.querySelector(`[data-testid="${testId}"]`);
  const fill = (testId, value) => {
    act(() => {
      const element = field(testId);
      Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set.call(element, value);
      element.dispatchEvent(new Event("input", { bubbles: true }));
    });
  };
  const open = (url = WHATSAPP_URL) => {
    act(() => requestWhatsAppContact(url));
    expect(field("whatsapp-contact-modal")).not.toBeNull();
  };
  const fillValidForm = () => {
    fill("whatsapp-contact-first-name", "Joan");
    fill("whatsapp-contact-last-name", "Pont");
    fill("whatsapp-contact-email", "joan@example.com");
    fill("whatsapp-contact-phone", "+34612345678");
    act(() => field("whatsapp-contact-privacy").click());
  };
  const submit = async () => {
    await act(async () => field("whatsapp-contact-form").dispatchEvent(new Event("submit", { bubbles: true, cancelable: true })));
  };

  beforeEach(() => {
    global.IS_REACT_ACT_ENVIRONMENT = true;
    axios.post.mockReset();
    axios.post.mockResolvedValue({ data: { id: "lead-1" } });
    popup = { opener: window, closed: false, location: { replace: jest.fn() }, close: jest.fn() };
    jest.spyOn(window, "open").mockReturnValue(popup);
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

  test("requires every requested field and never opens WhatsApp first", async () => {
    open();
    for (const testId of ["whatsapp-contact-first-name", "whatsapp-contact-last-name", "whatsapp-contact-email", "whatsapp-contact-phone", "whatsapp-contact-privacy"]) {
      expect(field(testId).required).toBe(true);
    }
    await submit();
    expect(axios.post).not.toHaveBeenCalled();
    expect(window.open).not.toHaveBeenCalled();
    expect(field("whatsapp-contact-error").textContent).toContain("Completa nombre");
  });

  test("saves one classified lead with its source before opening the Business chat", async () => {
    expect(WHATSAPP_URL).toBe("https://wa.me/34626049676");
    open();
    fillValidForm();
    await submit();

    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(axios.post).toHaveBeenCalledWith(expect.stringMatching(/\/api\/contact-requests$/), expect.objectContaining({
      capture_type: "whatsapp_business",
      first_name: "Joan",
      last_name: "Pont",

      email: "joan@example.com",
      phone: "+34612345678",
      privacy_consent: true,
      preferred_contact: ["email", "phone"],
      source_url: "https://xalucatours.com/contacto?utm_source=home",
      source_path: "/contacto",
    }));
    expect(window.open).toHaveBeenCalledWith("", "_blank");
    expect(popup.opener).toBeNull();
    expect(popup.location.replace).toHaveBeenCalledWith(WHATSAPP_URL);
    expect(field("whatsapp-contact-modal")).toBeNull();
  });

  test("does not open WhatsApp when the lead cannot be saved", async () => {
    axios.post.mockRejectedValue(new Error("network error"));
    open();
    fillValidForm();
    await submit();

    expect(popup.close).toHaveBeenCalledTimes(1);
    expect(popup.location.replace).not.toHaveBeenCalled();
    expect(field("whatsapp-contact-modal")).not.toBeNull();
    expect(field("whatsapp-contact-error").textContent).toContain("No hemos podido guardar");
    expect(field("whatsapp-contact-first-name").value).toBe("Joan");
  });

  test("rejects an invalid international phone before opening a tab", async () => {
    open();
    fillValidForm();
    fill("whatsapp-contact-phone", "+34");
    await submit();
    expect(axios.post).not.toHaveBeenCalled();
    expect(window.open).not.toHaveBeenCalled();
    expect(field("whatsapp-contact-error").textContent).toContain("teléfono válido");
  });

  test("globally intercepts ordinary WhatsApp links even if they carry the former bypass marker", () => {
    const anchor = document.createElement("a");
    anchor.href = WHATSAPP_URL;
    anchor.dataset.whatsappDirect = "true";
    document.body.appendChild(anchor);
    act(() => anchor.click());
    expect(field("whatsapp-contact-modal")).not.toBeNull();
    expect(window.open).not.toHaveBeenCalled();
    anchor.remove();
  });

  test("preserves the exact requested WhatsApp URL until the lead is saved", async () => {
    const requestedUrl = "https://wa.me/34626049676?text=Quiero%20informaci%C3%B3n";
    open(requestedUrl);
    fillValidForm();
    await submit();
    expect(popup.location.replace).toHaveBeenCalledWith(requestedUrl);
  });

  test("renders the phone country layer outside the scrolling form body", () => {
    open();
    expect(field("whatsapp-contact-country-layer")).not.toBeNull();
    expect(field("whatsapp-contact-phone").dataset.portalReady).toBe("true");
  });
});
