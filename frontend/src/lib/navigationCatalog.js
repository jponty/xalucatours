import { ROUTES, SUPPORTED_LANGS, STANDALONE_PATHS, pathFor } from "./routes";
import { POSTS } from "./blog";
import { MENU_TREE } from "./menu";
import SEO from "./seoMeta";
import { TRIP_PROGRAMS } from "./tripPrograms";
import { metaAllLangs } from "./programMeta";
import { lookupHub, lookupProgram, hubLabel, SECTIONS } from "./programNav";

const T = (es, en, fr) => ({ es, en, fr });
export const NAV_CATEGORIES = {
  overview: T("Inicio y catálogos", "Home & catalogues", "Accueil et catalogues"),
  tourSouth: SECTIONS.tourSouth.label,
  tourFull: SECTIONS.tourFull.label,
  tourNorth: SECTIONS.tourNorth.label,
  tourShort: SECTIONS.tourShort.label,
  tourAdventure: SECTIONS.tourAdventure.label,
  departures: T("Salidas especiales", "Special departures", "Départs spéciaux"),
  planning: T("Planificación y contacto", "Planning & contact", "Préparation et contact"),
  inspiration: T("Marruecos e información práctica", "Morocco & practical information", "Maroc et informations pratiques"),
  company: T("Sobre Xaluca Tours", "About Xaluca Tours", "À propos de Xaluca Tours"),
  blog: T("Blog y artículos", "Blog & articles", "Blog et articles"),
  tools: T("Experiencias y herramientas", "Experiences & tools", "Expériences et outils"),
  administration: T("Administración", "Administration", "Administration"),
  other: T("Otras páginas", "Other pages", "Autres pages"),
};

export const NAV_TYPES = {
  page: T("Página", "Page", "Page"),
  collection: T("Colección", "Collection", "Collection"),
  hub: T("Ruta · Hub", "Route · Hub", "Circuit · Hub"),
  program: T("Programa de viaje", "Travel programme", "Programme de voyage"),
  article: T("Artículo", "Article", "Article"),
  restricted: T("Acceso restringido", "Restricted access", "Accès restreint"),
};

const GROUP_ROUTES = {
  overview: ["home", "toursLanding", "catalog", "archive", "navigationMap"],
  planning: ["appointment", "planTrip", "planner", "precios", "vuelos", "fastTrack", "tourBespoke", "contact"],
  inspiration: ["practicalInfo", "morocco", "whatToSee", "whenToTravel", "southTimeline", "galeria"],
  company: ["about", "whatWeDo", "events", "opiniones", "feedback"],
  tools: ["asistente", "juego", "concurso", "favorites"],
  departures: ["tourUpcoming", "upcomingDepartures", "tourFinDeAno2025"],
  blog: ["blog"],
};

const menuLabels = {};
const collectLabels = (nodes) => nodes.forEach((node) => {
  if (node.routeId && node.label) menuLabels[node.routeId] = node.label;
  collectLabels(node.children || []);
  collectLabels(node.items || []);
  collectLabels(node.groups || []);
});
collectLabels(MENU_TREE);

const categoryFor = (id, slug) => {
  const explicit = Object.entries(GROUP_ROUTES).find(([, ids]) => ids.includes(id))?.[0];
  if (explicit) return explicit;
  if (SECTIONS[id] && id !== "toursLanding") return id;
  // URL families also cover programmes that have not yet been linked in a hub.
  if (slug.startsWith("viajes/escapadas/")) return "tourShort";
  if (slug.startsWith("viajes/norte/")) return "tourNorth";
  if (slug.startsWith("viajes/aventura/")) return "tourAdventure";
  if (slug.startsWith("viajes/gransur/") || slug === "viajes/atlas-desierto-fez") return "tourFull";
  const known = lookupProgram(id)?.section || lookupHub(id)?.section;
  if (known && NAV_CATEGORIES[known]) return known;
  if (slug.startsWith("viajes/")) return "tourSouth";
  // A new registered route must always appear, even before it is categorised.
  return "other";
};

const cleanTitle = (value) => (value || "").replace(/\s*·\s*Xaluca Tours$/, "").replace(/[.]+$/, "");
const slugTitle = (slug) => slug.split("/").slice(slug.includes("/") ? 1 : 0).join(" · ")
  .replace(/programa_(\d+)n_(\d+)d/, "$1 noches · $2 días").replace(/[_-]/g, " ")
  .replace(/^./, (letter) => letter.toUpperCase());

function routeTitle(id, lang) {
  const trip = TRIP_PROGRAMS[id];
  if (trip) {
    const title = cleanTitle(metaAllLangs(trip.program, trip.variant, "title")[lang]);
    const duration = trip.program.duration?.[lang] || trip.program.duration?.es;
    return [title, duration].filter(Boolean).join(" · ");
  }
  const hub = lookupHub(id)?.hub;
  return (hub && hubLabel(hub, lang)) || menuLabels[id]?.[lang]
    || cleanTitle(SEO[id]?.title?.[lang]) || slugTitle(ROUTES[id]?.[lang] || ROUTES[id]?.es || id);
}

// Enumerate the router, rather than maintaining a second list of page URLs.
// Identical aliases share one entry; alternate itinerary URLs remain distinct.
export function buildNavigationCatalog() {
  const entries = [];
  const seen = new Set();
  for (const [id, slugs] of Object.entries(ROUTES)) {
    const urls = SUPPORTED_LANGS.map((lang) => ({ lang, path: pathFor(lang, id) }))
      .filter(({ path }) => !seen.has(path));
    if (!urls.length) continue;
    urls.forEach(({ path }) => seen.add(path));
    entries.push({
      id, urls,
      title: Object.fromEntries(SUPPORTED_LANGS.map((lang) => [lang, routeTitle(id, lang)])),
      category: categoryFor(id, slugs.es),
      type: TRIP_PROGRAMS[id] || /\/programa_/.test(slugs.es) ? "program"
        : lookupHub(id) || /Hub$/.test(id) ? "hub"
        : SECTIONS[id] && id !== "toursLanding" ? "collection" : "page",
    });
  }
  for (const post of POSTS) {
    const urls = SUPPORTED_LANGS.map((lang) => ({ lang, path: `${pathFor(lang, "blog")}/${post.slug}` }))
      .filter(({ path }) => !seen.has(path));
    urls.forEach(({ path }) => seen.add(path));
    if (urls.length) entries.push({ id: `blog:${post.slug}`, title: post.title, urls, category: "blog", type: "article" });
  }
  for (const [id, path] of Object.entries(STANDALONE_PATHS)) {
    if (seen.has(path)) continue;
    seen.add(path);
    entries.push({ id, title: T("Administración · Xaluca Tours", "Administration · Xaluca Tours", "Administration · Xaluca Tours"),
      urls: [{ lang: null, path }], category: "administration", type: "restricted" });
  }
  return entries;
}

const normalize = (text) => String(text).normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  .toLowerCase().replace(/[_/·→–—-]+/g, " ");

export function filterNavigationCatalog(entries, { query = "", category = "all", language = "all" } = {}) {
  const terms = normalize(query).split(/\s+/).filter(Boolean);
  let requestedPath = query.trim().startsWith("/") ? query.trim() : "";
  if (/^https?:\/\//i.test(query.trim())) {
    try { requestedPath = new URL(query.trim()).pathname; } catch { /* Treat an incomplete URL as text. */ }
  }
  requestedPath = requestedPath.split(/[?#]/)[0].replace(/\/$/, "").toLowerCase();
  return entries.filter((entry) => {
    const haystack = normalize([...Object.values(entry.title), ...Object.values(NAV_CATEGORIES[entry.category]),
      ...Object.values(NAV_TYPES[entry.type]), ...entry.urls.map(({ path }) => path)].join(" "));
    const matches = requestedPath
      ? entry.urls.some(({ path }) => path.toLowerCase().includes(requestedPath))
      : terms.every((term) => haystack.includes(term));
    return (category === "all" || entry.category === category) && matches;
  }).map((entry) => ({ ...entry, urls: entry.urls.filter(({ lang }) => language === "all" || !lang || lang === language) }))
    .filter((entry) => entry.urls.length);
}
