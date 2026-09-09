import { TRIP_PROGRAMS } from "./tripPrograms";
import { metaAllLangs } from "./programMeta";
import { lookupProgram, SECTIONS } from "./programNav";
import { ROUTES, pathFor } from "./routes";
import { getTripPackingNotes } from "./tripPackingNotes";

const familyPath = (routeId) => ROUTES[routeId]?.es?.split("/").slice(0, -1).join("/");
const tripSection = (routeId) => lookupProgram(routeId)?.section
  // A newly added duration may not yet be listed in its hub. Use the
  // collection of an existing sibling from that same programme family.
  || Object.keys(TRIP_PROGRAMS).filter((id) => id.replace(/\d+$/, "") === routeId.replace(/\d+$/, ""))
    .map((id) => lookupProgram(id)?.section).find(Boolean)
  || "toursLanding";

// An index, not another content store: programmes, titles, categories and
// packing notes are all resolved from the same sources as the trip pages.
// Keep alternate programme URLs: their editable notes have their own slots.
export const buildPracticalTripIndex = () => Object.entries(TRIP_PROGRAMS)
  .filter(([routeId]) => ROUTES[routeId] && getTripPackingNotes(routeId)?.length)
  .map(([routeId, { program, variant }]) => ({
    routeId,
    title: metaAllLangs(program, variant, "title"),
    duration: program.duration,
    days: program.days.length,
    places: metaAllLangs(program, variant, "quick_places"),
    section: tripSection(routeId),
    reference: familyPath(routeId).replace(/^viajes\//, "").replace(/\//g, " › ").replace(/[_-]/g, " "),
    notes: getTripPackingNotes(routeId),
  }));

const localized = (value, lang) => value?.[lang] || value?.es || "";
export const normalizePracticalSearch = (value) => String(value || "")
  .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  .toLowerCase().replace(/[_/·→–—-]+/g, " ");

export const filterPracticalTrips = (trips, { query = "", section = "all", lang = "es" } = {}) => {
  const normalized = normalizePracticalSearch(query);
  const duration = normalized.match(/\b(\d+)\s*(?:dias?|days?|jours?)\b/);
  const terms = normalized.replace(/\b\d+\s*(?:dias?|days?|jours?)\b/, "").split(/\s+/).filter(Boolean);
  return trips.filter((trip) => {
    if (section !== "all" && trip.section !== section) return false;
    if (duration && trip.days !== Number(duration[1])) return false;
    const searchable = normalizePracticalSearch([
      ...Object.values(trip.title), localized(trip.duration, lang),
      ...Object.values(trip.places), localized(SECTIONS[trip.section]?.label, lang),
      pathFor("es", trip.routeId),
    ].join(" "));
    return terms.every((term) => searchable.includes(term));
  }).sort((a, b) => localized(a.title, lang).localeCompare(localized(b.title, lang), lang, { numeric: true })
    || localized(a.duration, lang).localeCompare(localized(b.duration, lang), lang, { numeric: true })
    || a.routeId.localeCompare(b.routeId));
};
