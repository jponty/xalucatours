import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

jest.mock("react-router-dom", () => ({
  Link: ({ to, children, ...props }) => <a href={to} {...props}>{children}</a>,
}));
jest.mock("@/contexts/LanguageContext", () => ({
  useLanguage: () => ({ lang: "es" }),
  pick: (copy, lang) => copy[lang] || copy.es,
}));

import NavigationMapPage from "./NavigationMapPage";
import { buildNavigationCatalog } from "@/lib/navigationCatalog";

describe("navigation map links", () => {
  const renderPage = () => {
    const container = document.createElement("div");
    container.innerHTML = renderToStaticMarkup(<NavigationMapPage />);
    return container;
  };

  test("opens every page title, language URL and breadcrumb in a protected new tab", () => {
    const page = renderPage();
    const catalog = buildNavigationCatalog();
    const expectedLinks = catalog.reduce((total, entry) => total + entry.urls.length + 1, 1);
    const links = page.querySelectorAll('a:not([href^="#"])');
    expect(links).toHaveLength(expectedLinks);
    for (const link of links) {
      expect(link.getAttribute("target")).toBe("_blank");
      expect(link.getAttribute("rel").split(" ")).toEqual(expect.arrayContaining(["noopener", "noreferrer"]));
      expect(link.getAttribute("aria-describedby")).toBe("nav-new-tab-hint");
    }
    expect(page.querySelector("#nav-new-tab-hint").textContent).toContain("nueva pestaña");
  });

  test("keeps the in-page index shortcut in the current tab", () => {
    const page = renderPage();
    const shortcut = page.querySelector('a[href="#navigation-index"]');
    expect(shortcut).not.toBeNull();
    expect(shortcut.getAttribute("target")).toBeNull();
    expect(page.querySelectorAll('[data-nav-url="/admin"]')).toHaveLength(1);
  });

  test("every Fin de Año title and language link opens the 2026 page in a new tab", () => {
    const page = renderPage();
    const links = [...page.querySelectorAll("a")];
    const yearLinks = links.filter((link) => /(?:findeano|newyear|nouvelan)2026/.test(link.getAttribute("href")));
    expect(yearLinks).toHaveLength(4); // Page title plus ES, EN and FR URLs.
    expect(yearLinks.map((link) => link.getAttribute("href"))).toEqual(expect.arrayContaining([
      "/findeano2026", "/en/newyear2026", "/fr/nouvelan2026",
    ]));
    for (const link of yearLinks) expect(link.getAttribute("target")).toBe("_blank");
    for (const link of links) expect(link.getAttribute("href")).not.toMatch(/(?:findeano|newyear|nouvelan)2025/);
  });
});
