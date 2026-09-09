import { buildNavigationCatalog, filterNavigationCatalog, NAV_CATEGORIES, NAV_TYPES } from "./navigationCatalog";
import { ROUTES, SUPPORTED_LANGS, STANDALONE_PATHS, pathFor, resolvePath } from "./routes";
import { POSTS } from "./blog";
import { TRIP_PROGRAMS } from "./tripPrograms";
import { metaAllLangs } from "./programMeta";

const entries = buildNavigationCatalog();
const paths = entries.flatMap((entry) => entry.urls.map((url) => url.path));

describe("complete navigation map", () => {
  test("covers every registered page, every article and every standalone URL in all languages", () => {
    const expected = new Set([
      ...Object.keys(ROUTES).flatMap((id) => SUPPORTED_LANGS.map((lang) => pathFor(lang, id))),
      ...POSTS.flatMap((post) => SUPPORTED_LANGS.map((lang) => `${pathFor(lang, "blog")}/${post.slug}`)),
      ...Object.values(STANDALONE_PATHS),
    ]);
    expect([...paths].sort()).toEqual([...expected].sort());
    expect(new Set(paths).size).toBe(paths.length);
    expect(new Set(entries.map((entry) => entry.id)).size).toBe(entries.length);
  });

  test("resolves all registered links and includes /nav itself", () => {
    for (const entry of entries.filter((entry) => ROUTES[entry.id])) {
      for (const { lang, path } of entry.urls) expect(resolvePath(path)).toMatchObject({ routeId: entry.id, lang });
    }
    for (const lang of SUPPORTED_LANGS) expect(resolvePath(pathFor(lang, "navigationMap"))).toMatchObject({ routeId: "navigationMap", lang });
    expect(paths).toContain("/nav");
    expect(paths).toContain("/en/nav");
    expect(paths).toContain("/fr/nav");
  });

  test("retains all programme URLs, deriving titles and durations from the original content", () => {
    for (const [id, { program, variant }] of Object.entries(TRIP_PROGRAMS)) {
      const entry = entries.find((item) => item.id === id);
      expect(entry.type).toBe("program");
      expect(entry.title.es).toContain(metaAllLangs(program, variant, "title").es.replace(/[.]+$/, ""));
      expect(entry.title.es).toContain(program.duration.es);
    }
    expect(paths).toContain("/viajes/marrakech_ergchebbi_marrakech/programa_3n_4d");
    expect(paths).toContain("/viajes/escapadas/rak_erg_rak/programa_3n_4d");
    expect(paths).toContain("/viajes/errachidia-atlas-fez/programa_5n_6d");
    expect(paths.filter((path) => path === "/proximas_salidas")).toHaveLength(1);
  });

  test("provides translated titles, categories and page types for every entry", () => {
    for (const entry of entries) {
      expect(NAV_CATEGORIES[entry.category]).toBeDefined();
      expect(NAV_TYPES[entry.type]).toBeDefined();
      for (const lang of SUPPORTED_LANGS) expect(entry.title[lang]?.trim()).toBeTruthy();
    }
    expect(entries.find((entry) => entry.id === "tourEscapadaRakErgRak34").category).toBe("tourShort");
    expect(entries.find((entry) => entry.id === "tourFezSidialiOzz78").category).toBe("tourFull");
    expect(entries.find((entry) => entry.id === "tourFezTanger67").category).toBe("tourNorth");
    expect(entries.find((entry) => entry.id === "admin").type).toBe("restricted");
  });

  test("finds names and complete URLs, ignoring accents and separators", () => {
    expect(filterNavigationCatalog(entries, { query: "Tánger" })).toEqual(filterNavigationCatalog(entries, { query: "tanger" }));
    expect(filterNavigationCatalog(entries, { query: "/viajes/desierto_atlas/programa_4n_5d" }).map((entry) => entry.id)).toEqual(["tourDesiertoAtlas45"]);
    expect(filterNavigationCatalog(entries, { query: "https://xalucatravel.com/viajes/desierto_atlas/programa_4n_5d#journey-chronology" }).map((entry) => entry.id)).toEqual(["tourDesiertoAtlas45"]);
    expect(filterNavigationCatalog(entries, { query: "noche-en-erg-chebbi" }).some((entry) => entry.type === "article")).toBe(true);
    expect(filterNavigationCatalog(entries, { query: "no-matching-url-xyz" })).toEqual([]);
    expect(filterNavigationCatalog(entries, { query: "  " })).toHaveLength(entries.length);
  });

  test("combines category and language filters without hiding standalone pages", () => {
    const north = filterNavigationCatalog(entries, { category: "tourNorth", language: "fr" });
    expect(north.length).toBeGreaterThan(0);
    expect(north.every((entry) => entry.category === "tourNorth" && entry.urls.length === 1 && entry.urls[0].lang === "fr")).toBe(true);
    expect(filterNavigationCatalog(entries, { category: "administration", language: "en" })[0].urls[0].path).toBe("/admin");
  });

  test("automatically includes a future route, even without menu or category metadata", () => {
    ROUTES.testFuturePage = { es: "pagina-futura", en: "future-page", fr: "page-future" };
    try {
      expect(buildNavigationCatalog().find((entry) => entry.id === "testFuturePage")).toMatchObject({ category: "other", urls: [
        { lang: "es", path: "/pagina-futura" }, { lang: "en", path: "/en/future-page" }, { lang: "fr", path: "/fr/page-future" },
      ] });
    } finally { delete ROUTES.testFuturePage; }
  });
});
