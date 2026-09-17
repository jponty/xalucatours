import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { CalendlyEmbed, CALENDLY_PHONE } from "./CalendlyEmbed";

test("passes page and trip attribution to Calendly without personal query data", () => {
  global.IS_REACT_ACT_ENVIRONMENT = true;
  window.history.replaceState({}, "", "/contacto?trip=tourAtlasDesierto45&email=private@example.com");
  window.Calendly = { initInlineWidget: jest.fn() };
  const element = document.createElement("div"); document.body.appendChild(element);
  const root = createRoot(element);
  act(() => root.render(<CalendlyEmbed url={CALENDLY_PHONE} />));
  const url = new URL(window.Calendly.initInlineWidget.mock.calls[0][0].url);
  expect(url.searchParams.get("utm_source")).toBe("xaluca-web");
  expect(url.searchParams.get("utm_term")).toBe("tourAtlasDesierto45");
  expect(url.searchParams.get("utm_content")).toContain("/contacto?trip=tourAtlasDesierto45");
  expect(url.href).not.toMatch(/private|email/);
  act(() => root.unmount()); element.remove();
  delete window.Calendly; delete global.IS_REACT_ACT_ENVIRONMENT;
});
