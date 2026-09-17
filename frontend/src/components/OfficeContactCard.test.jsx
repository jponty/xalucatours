import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

let mockLang = "es";
jest.mock("@/components/EditableSection", () => ({
  E: ({ as: Tag = "span", defaults, className }) => <Tag className={className}>{defaults[mockLang]}</Tag>,
}));

import OfficeContactCard from "./OfficeContactCard";

const renderCard = () => {
  const container = document.createElement("div");
  container.innerHTML = renderToStaticMarkup(<OfficeContactCard />);
  return container.querySelector('[data-testid="contact-office-card"]');
};

describe("Sabadell office contact card", () => {
  beforeEach(() => { mockLang = "es"; });

  test("shows the requested copy and complete office address", () => {
    const card = renderCard();
    expect(card.querySelector("h3").textContent).toBe("En nuestras oficinas");
    expect(card.querySelector("p").textContent).toBe("Visítanos en nuestras oficinas de Sabadell y habla personalmente con nuestro equipo para empezar a planificar tu próxima aventura por Marruecos.");
    const address = card.querySelector("address").textContent;
    for (const line of ["Xaluca Tours", "Calle Latorre, 52", "08201 Sabadell, Barcelona", "España"]) {
      expect(address).toContain(line);
    }
  });

  test("links to the supplied Google Maps location and the same destination in Waze", () => {
    const card = renderCard();
    const maps = card.querySelector('[data-testid="contact-office-google-maps"]');
    const waze = card.querySelector('[data-testid="contact-office-waze"]');
    expect(maps.getAttribute("href")).toBe("https://maps.app.goo.gl/sDqBMWwyJcTmLTZQ9");
    expect(maps.textContent).toBe("Cómo llegar con Google Maps");
    expect(waze.textContent).toBe("Cómo llegar con Waze");
    const url = new URL(waze.getAttribute("href"));
    expect(url.origin).toBe("https://www.waze.com");
    expect(url.pathname).toBe("/ul");
    expect(url.searchParams.get("q")).toBe("Calle Latorre, 52, 08201 Sabadell, Barcelona, España");
    expect(url.searchParams.get("ll")).toBe("41.5391383,2.1110407");
    expect(url.searchParams.get("navigate")).toBe("yes");
    for (const link of [maps, waze]) {
      expect(link.getAttribute("target")).toBe("_blank");
      expect(link.getAttribute("rel")).toBe("noopener noreferrer");
      expect(link.classList.contains("w-full")).toBe(true);
      expect(link.classList.contains("min-w-0")).toBe(true);
    }
  });

  test.each([
    ["es", "En nuestras oficinas", "Cómo llegar con Google Maps", "Cómo llegar con Waze"],
    ["en", "At our offices", "Directions with Google Maps", "Directions with Waze"],
    ["fr", "Dans nos bureaux", "Itinéraire avec Google Maps", "Itinéraire avec Waze"],
  ])("supports the %s site language", (lang, title, google, waze) => {
    mockLang = lang;
    const card = renderCard();
    for (const text of [title, google, waze]) expect(card.textContent).toContain(text);
  });
});
