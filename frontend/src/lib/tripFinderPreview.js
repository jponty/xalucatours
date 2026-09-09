import { TRIP_PROGRAMS } from "@/lib/tripPrograms";
import { metaAllLangs } from "@/lib/programMeta";
import { nodeName, tt } from "@/lib/tripFinder";
import { SOUTH_TRIPS, NORTH_TRIPS, FULL_TRIPS, SHORT_TRIPS } from "@/lib/homeCarousels";

// Reuse the catalogue's trip-specific summaries instead of duplicating copy.
// Programmes and itinerary stops also cover future additions to the finder.
const summaries = new Map();
[...SOUTH_TRIPS, ...NORTH_TRIPS, ...FULL_TRIPS, ...SHORT_TRIPS].forEach((trip) => {
  if (!summaries.has(trip.routeId)) summaries.set(trip.routeId, trip.summary);
});

export const tripFinderPreview = (trip, lang) => {
  const entry = TRIP_PROGRAMS[trip.routeId];
  const stops = [...new Set(trip.stops || [])];
  const highlights = stops.filter((id) => id !== trip.entry && id !== trip.exit)
    .slice(0, 4).map((id) => nodeName(id, lang));
  const destinations = highlights.length ? highlights : stops.map((id) => nodeName(id, lang)).slice(0, 4);
  const route = [nodeName(trip.entry, lang), ...highlights, nodeName(trip.exit, lang)]
    .filter((name, index, all) => name && all.indexOf(name) === index).join(" · ");
  const fallback = {
    es: `${trip.days} días para descubrir Marruecos a través de ${route}. Un recorrido para vivir sus paisajes y su cultura de cerca.`,
    en: `${trip.days} days discovering Morocco through ${route}. A journey to experience its landscapes and culture up close.`,
    fr: `${trip.days} jours pour découvrir le Maroc à travers ${route}. Un voyage pour vivre ses paysages et sa culture de près.`,
  };
  const description = tt(summaries.get(trip.routeId), lang)
    || (entry ? tt(metaAllLangs(entry.program, entry.variant, "subtitle"), lang) : "");
  return { description: description || tt(fallback, lang), destinations };
};
