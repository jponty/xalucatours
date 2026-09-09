import { ROUTES, pathFor, resolvePath, redirectForPath, rewriteForLang } from "./routes";
import { buildNavigationCatalog } from "./navigationCatalog";
import { describeSlot } from "@/components/SlotUsagePanel";

const routeId = "tourFinDeAno2025";
const publicPaths = {
  es: "/findeano2026",
  en: "/en/newyear2026",
  fr: "/fr/nouvelan2026",
};

describe("Fin de Año 2026 navigation", () => {
  test.each(Object.entries(publicPaths))("all %s links resolve to the current edition", (lang, path) => {
    expect(pathFor(lang, routeId)).toBe(path);
    expect(resolvePath(path)).toMatchObject({ lang, routeId });
    expect(resolvePath(`${path}/`)).toMatchObject({ lang, routeId });
    expect(rewriteForLang(publicPaths.es, lang)).toBe(path);
    expect(redirectForPath(path)).toBeNull();
  });

  test("the master navigation index lists only 2026 URLs and titles", () => {
    const entry = buildNavigationCatalog().find((item) => item.id === routeId);
    expect(entry.category).toBe("departures");
    expect(entry.urls).toEqual(Object.entries(publicPaths).map(([lang, path]) => ({ lang, path })));
    for (const title of Object.values(entry.title)) {
      expect(title).toContain("2026");
      expect(title).not.toContain("2025");
    }
    for (const slugs of Object.values(ROUTES)) {
      for (const slug of Object.values(slugs)) expect(slug).not.toMatch(/(?:findeano|newyear|nouvelan)2025/);
    }
  });

  test.each([
    ["/findeano2025", publicPaths.es],
    ["/en/newyear2025", publicPaths.en],
    ["/fr/nouvelan2025", publicPaths.fr],
  ])("keeps %s only as an inbound redirect", (oldPath, newPath) => {
    expect(redirectForPath(oldPath)).toBe(newPath);
    expect(redirectForPath(`${oldPath}/`)).toBe(newPath);
    expect(resolvePath(oldPath).routeId).toBeNull();
    expect(buildNavigationCatalog().flatMap((entry) => entry.urls.map((url) => url.path))).not.toContain(oldPath);
  });

  test.each(["findeano", "findeano-2026", "findeano2026", "findeano2025"])("image editor links from %s slots use the new URL", (prefix) => {
    expect(describeSlot(`${prefix}.hero.bg`)).toMatchObject({
      href: publicPaths.es,
      pageLabel: "Fin de Año 2026",
    });
  });

  test("the backend email URL registry agrees with every public language URL", () => {
    const fs = require("fs");
    const path = require("path");
    const gazetteer = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../../../backend/trip_gazetteer.json"), "utf8"));
    expect(gazetteer[routeId].path).toEqual(ROUTES[routeId]);
  });
});
