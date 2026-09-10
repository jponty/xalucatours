import React, { act } from "react";
import { createRoot } from "react-dom/client";
import SeoHead from "./SeoHead";

test("canonical and social metadata use the public origin without tracking parameters or fragments", () => {
  global.IS_REACT_ACT_ENVIRONMENT = true;
  const container = document.createElement("div");
  const root = createRoot(container);
  const previousPath = window.location.href;
  const staticCanonical = document.createElement("link");
  staticCanonical.rel = "canonical";
  staticCanonical.href = "https://xalucatravel.com/";
  document.head.appendChild(staticCanonical);
  try {
    window.history.replaceState({}, "", "/contacto?trip=example&utm_source=test#contact-form");
    act(() => root.render(<SeoHead title="Contacto" description="Contacta con Xaluca Tours" lang="es" />));
    expect(document.head.querySelectorAll('link[rel="canonical"]')).toHaveLength(1);
    expect(document.head.querySelector('link[rel="canonical"]').href).toBe("https://xalucatravel.com/contacto");
    expect(document.head.querySelector('meta[property="og:url"]').content).toBe("https://xalucatravel.com/contacto");
    expect(document.head.querySelector('meta[property="og:image"]').content).toMatch(/^https:\/\/xalucatravel\.com\//);
  } finally {
    act(() => root.unmount());
    container.remove();
    staticCanonical.remove();
    window.history.replaceState({}, "", previousPath);
    delete global.IS_REACT_ACT_ENVIRONMENT;
  }
});
