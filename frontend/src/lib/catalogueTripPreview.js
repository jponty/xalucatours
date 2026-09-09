import { pick } from "@/contexts/LanguageContext";
import { getTripProgram } from "@/lib/tripPrograms";
import { metaAllLangs } from "@/lib/programMeta";
import { getTripHighlights } from "@/lib/tripHighlights";

// Read the description already published on the itinerary, without maintaining
// another set of marketing texts. Keep complete paragraphs, never ellipses.
export const catalogueTripPreview = (trip, lang) => {
  const entry = getTripProgram(trip.routeId);
  let description = "";
  if (entry) {
    const paragraphs = pick(metaAllLangs(entry.program, entry.variant, "description"), lang);
    if (Array.isArray(paragraphs)) {
      for (const paragraph of paragraphs.filter((text) => typeof text === "string" && text.trim())) {
        if (description.length >= 130 || (description && description.length + paragraph.length > 380)) break;
        description = [description, paragraph].filter(Boolean).join(" ");
      }
    } else if (typeof paragraphs === "string") description = paragraphs;
  }
  return {
    description: description || pick(trip.summary, lang),
    destinations: [...new Set(getTripHighlights(trip.routeId, lang))].slice(0, 4),
  };
};
