// Route registry + helpers for language-based URLs.
// Each routeId maps to one trilingual slug. Home has empty slug.

export const SUPPORTED_LANGS = ["es", "en", "fr"];
export const DEFAULT_LANG = "es";

export const ROUTES = {
  home:           { es: "",                          en: "",                          fr: "" },
  appointment:    { es: "cita-previa",               en: "book-appointment",          fr: "prendre-rendez-vous" },

  tourBespoke:    { es: "viajes/a-medida",           en: "tours/tailor-made",         fr: "voyages/sur-mesure" },

  // Catalog
  tourAll:        { es: "viajes/catalogo",           en: "tours/catalogue",           fr: "voyages/catalogue" },
  tourSouth:      { es: "viajes/sur-de-marruecos",   en: "tours/southern-morocco",    fr: "voyages/sud-du-maroc" },
  tourFull:       { es: "viajes/marruecos-al-completo", en: "tours/full-morocco",     fr: "voyages/maroc-integral" },
  tourShort:      { es: "viajes/escapadas-cortas",   en: "tours/short-escapes",       fr: "voyages/escapades-courtes" },
  tourNorth:      { es: "viajes/norte-de-marruecos", en: "tours/northern-morocco",    fr: "voyages/nord-du-maroc" },
  tourFeatured:   { es: "viajes/destacados",         en: "tours/featured",            fr: "voyages/incontournables" },
  tourAdventure:  { es: "viajes/aventura",           en: "tours/adventure",           fr: "voyages/aventure" },

  // About cluster
  about:          { es: "sobre-nosotros",            en: "about-us",                  fr: "a-propos" },
  whatWeDo:       { es: "que-hacemos",               en: "what-we-do",                fr: "ce-que-nous-faisons" },
  whatToSee:      { es: "que-ver-en-marruecos",      en: "what-to-see-in-morocco",    fr: "que-voir-au-maroc" },
  events:         { es: "eventos-incentivos",       en: "events-incentives",         fr: "evenements-incentives" },

  hotels:         { es: "nuestros-hoteles",          en: "our-hotels",                fr: "nos-hotels" },
  morocco:        { es: "marruecos",                 en: "morocco",                   fr: "maroc" },
  contact:        { es: "contacto",                  en: "contact",                   fr: "contact" },
};

/* Build a URL for a given language + routeId */
export const pathFor = (lang, routeId = "home") => {
  const safeLang = SUPPORTED_LANGS.includes(lang) ? lang : DEFAULT_LANG;
  const slug = ROUTES[routeId]?.[safeLang] ?? "";
  return slug ? `/${safeLang}/${slug}` : `/${safeLang}`;
};

/* Given a pathname, return { lang, routeId, slug } */
export const resolvePath = (pathname) => {
  const clean = (pathname || "/").replace(/^\/+|\/+$/g, "");
  const parts = clean.split("/").filter(Boolean);
  const langCandidate = parts[0];
  const lang = SUPPORTED_LANGS.includes(langCandidate) ? langCandidate : null;
  const rest = lang ? parts.slice(1).join("/") : parts.join("/");

  if (!rest) return { lang, routeId: "home", slug: "" };

  for (const [routeId, slugs] of Object.entries(ROUTES)) {
    for (const l of SUPPORTED_LANGS) {
      if (slugs[l] && slugs[l] === rest) {
        return { lang: lang || l, routeId, slug: rest };
      }
    }
  }
  return { lang, routeId: null, slug: rest };
};

/* When the user switches language, rewrite the current URL into the new lang */
export const rewriteForLang = (pathname, newLang) => {
  if (!SUPPORTED_LANGS.includes(newLang)) return pathname;
  const { routeId } = resolvePath(pathname);
  if (routeId) return pathFor(newLang, routeId);
  return `/${newLang}`;
};
