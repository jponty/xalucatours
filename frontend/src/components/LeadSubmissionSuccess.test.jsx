import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

jest.mock("react-router-dom", () => ({
  Link: ({ to, children, ...props }) => <a href={to} {...props}>{children}</a>,
}));
jest.mock("@/contexts/LanguageContext", () => ({
  useLanguage: () => ({ lang: "es" }),
  pick: (copy, lang) => copy[lang] || copy.es,
}), { virtual: true });
jest.mock("@/lib/routes", () => ({
  pathFor: (_lang, route) => ({ home: "/", archive: "/archivo", appointment: "/citaprevia" }[route]),
}), { virtual: true });

import LeadSubmissionSuccess from "./LeadSubmissionSuccess";

describe("LeadSubmissionSuccess", () => {
  test("shows the confirmation copy and all three Spanish destinations", () => {
    const html = renderToStaticMarkup(
      <LeadSubmissionSuccess />,
    );

    expect(html).toContain("¡Recibido! Te respondemos en 24–48 h.");
    expect(html).toContain("24–48 horas");
    expect(html).toContain('href="/"');
    expect(html).toContain('href="/archivo"');
    expect(html).toContain('href="/citaprevia"');
    expect(html).toContain("Volver al inicio");
    expect(html).toContain("Ver todos los viajes");
    expect(html).toContain("Reservar cita previa");
  });
});
