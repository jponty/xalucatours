import React, { act } from "react";
import { createRoot } from "react-dom/client";
import GenericErrorMessage, { errorToastMessage } from "./GenericErrorMessage";

global.IS_REACT_ACT_ENVIRONMENT = true;

test.each(["es", "en", "fr", "unknown"])("generic error has an accessible email link in %s", async lang => {
  const container = document.createElement("div");
  const root = createRoot(container);
  await act(async () => root.render(<GenericErrorMessage lang={lang} />));
  const link = container.querySelector("a");
  expect(link.textContent).toBe("xalucatours@xaluca.com");
  expect(link.getAttribute("href")).toBe("mailto:xalucatours@xaluca.com");
  expect(container.textContent).not.toContain("undefined");
  await act(async () => root.unmount());
});

test("specific server instructions are preserved instead of replaced by generic copy", () => {
  const detail = "Ya has participado con este correo electrónico.";
  expect(errorToastMessage(detail)).toBe(detail);
});

test.each([undefined, null, "", "  ", [{ msg: "Invalid email" }]])("missing or structured details use a render-safe fallback: %p", detail => {
  expect(React.isValidElement(errorToastMessage(detail))).toBe(true);
});
