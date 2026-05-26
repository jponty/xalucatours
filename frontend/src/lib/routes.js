// Route registry + helpers for language-aware URLs.
// - Spanish is the primary market → no prefix at root: /viajes, /citaprevia, /contacto …
// - English & French keep a language prefix: /en/tours, /fr/voyages …

export const SUPPORTED_LANGS = ["es", "en", "fr"];
export const PREFIXED_LANGS  = ["en", "fr"];     // only these add a /<lang> URL prefix
export const DEFAULT_LANG    = "es";

export const ROUTES = {
  home:               { es: "",                          en: "",                         fr: "" },
  appointment:        { es: "citaprevia",                en: "book-appointment",         fr: "prendre-rendez-vous" },

  // Catalogue cluster
  toursLanding:       { es: "viajes",                    en: "tours",                    fr: "voyages" },
  catalog:            { es: "catalogo",                  en: "catalogue",                fr: "catalogue" },
  tourSouth:          { es: "viajes/surdemarruecos",     en: "tours/southern-morocco",   fr: "voyages/sud-du-maroc" },
  tourDesiertoAtlas67:{ es: "viajes/desierto_atlas/programa_6n_7d", en: "tours/desert-atlas/program-6n-7d", fr: "voyages/desert-atlas/programme-6n-7j" },
  tourDesiertoAtlas56:{ es: "viajes/desierto_atlas/programa_5n_6d", en: "tours/desert-atlas/program-5n-6d", fr: "voyages/desert-atlas/programme-5n-6j" },
  tourDesiertoAtlas45:{ es: "viajes/desierto_atlas/programa_4n_5d", en: "tours/desert-atlas/program-4n-5d", fr: "voyages/desert-atlas/programme-4n-5j" },
  tourAtlasDesierto45:{ es: "viajes/atlas_desierto/programa_4n_5d", en: "tours/atlas-desert/program-4n-5d", fr: "voyages/atlas-desert/programme-4n-5j" },
  tourAtlasDesierto56:{ es: "viajes/atlas_desierto/programa_5n_6d", en: "tours/atlas-desert/program-5n-6d", fr: "voyages/atlas-desert/programme-5n-6j" },
  tourAtlasDesierto67:{ es: "viajes/atlas_desierto/programa_6n_7d", en: "tours/atlas-desert/program-6n-7d", fr: "voyages/atlas-desert/programme-6n-7j" },
  tourAtlasDesiertoHub:{ es: "viajes/sur/atlas_desierto", en: "tours/south/atlas-desert", fr: "voyages/sud/atlas-desert" },
  tourMarrakechErgHub: { es: "viajes/sur/marrakech_ergchebbi", en: "tours/south/marrakech-ergchebbi", fr: "voyages/sud/marrakech-ergchebbi" },
  tourMarrakechLoopHub:{ es: "viajes/marrakech_ergchebbi_marrakech", en: "tours/marrakech-ergchebbi-marrakech", fr: "voyages/marrakech-ergchebbi-marrakech" },
  tourMarrakechEssHub: { es: "viajes/sur/marrakech_essaouira", en: "tours/south/marrakech-essaouira", fr: "voyages/sud/marrakech-essaouira" },
  tourUpcoming:       { es: "proximas_salidas", en: "upcoming-departures", fr: "prochains-departs" },
  tourFull:           { es: "viajes/marruecos",          en: "tours/full-morocco",       fr: "voyages/maroc-integral" },
  tourShort:          { es: "viajes/escapadas",          en: "tours/short-escapes",      fr: "voyages/escapades-courtes" },
  tourNorth:          { es: "viajes/nortedemarruecos",   en: "tours/northern-morocco",   fr: "voyages/nord-du-maroc" },
  tourAdventure:      { es: "viajes/aventura",           en: "tours/adventure",          fr: "voyages/aventure" },
  upcomingDepartures: { es: "proximas_salidas",          en: "upcoming-departures",      fr: "prochains-departs" },
  tourBespoke:        { es: "viajesamedida",             en: "tailor-made-tours",        fr: "voyages-sur-mesure" },

  // About cluster
  about:              { es: "equipo",                    en: "team",                     fr: "equipe" },
  whatWeDo:           { es: "quehacemos",                en: "what-we-do",               fr: "ce-que-nous-faisons" },
  whatToSee:          { es: "que-ver-en-Marruecos",      en: "what-to-see-in-morocco",   fr: "que-voir-au-maroc" },
  events:             { es: "incentivos",                en: "incentives",               fr: "incentives" },

  morocco:            { es: "marruecos",                 en: "morocco",                  fr: "maroc" },
  contact:            { es: "contacto",                  en: "contact",                  fr: "contact" },
};

/* Build a URL for a given language + routeId.
   Spanish lives at the root, EN/FR live under /<lang>/<slug>. */
export const pathFor = (lang, routeId = "home") => {
  const safeLang = SUPPORTED_LANGS.includes(lang) ? lang : DEFAULT_LANG;
  const slug = ROUTES[routeId]?.[safeLang] ?? "";

  if (safeLang === DEFAULT_LANG) {
    return slug ? `/${slug}` : "/";
  }
  return slug ? `/${safeLang}/${slug}` : `/${safeLang}`;
};

/* Given a pathname, identify { lang, routeId, slug }. */
export const resolvePath = (pathname) => {
  const clean = (pathname || "/").replace(/^\/+|\/+$/g, "");
  const parts = clean.split("/").filter(Boolean);

  const langCandidate = parts[0];
  const isPrefixed = PREFIXED_LANGS.includes(langCandidate);
  const lang = isPrefixed ? langCandidate : DEFAULT_LANG;
  const rest = isPrefixed ? parts.slice(1).join("/") : parts.join("/");

  if (!rest) return { lang, routeId: "home", slug: "" };

  for (const [routeId, slugs] of Object.entries(ROUTES)) {
    if (slugs[lang] === rest) {
      return { lang, routeId, slug: rest };
    }
  }
  return { lang, routeId: null, slug: rest };
};

/* Re-write the current path into a different language, preserving the page. */
export const rewriteForLang = (pathname, newLang) => {
  if (!SUPPORTED_LANGS.includes(newLang)) return pathname;
  const { routeId } = resolvePath(pathname);
  if (routeId) return pathFor(newLang, routeId);
  return pathFor(newLang, "home");
};
