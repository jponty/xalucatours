/* ============================================================
   tripHighlights.js
   ----
   Resolves a trip's "Lugares destacados" (highlights) exactly as the
   detail page does — reading the SAME program/variant meta through
   `metaAllLangs` — and returns it as a clean array of place names so a
   card-level marquee can mirror the page 1:1.
============================================================ */
import { metaAllLangs } from "@/lib/programMeta";
import { getTripProgram } from "@/lib/tripPrograms";

/* Returns an array of highlighted place names for a routeId in `lang`
   (falls back to ES, then EN). Empty array when the route has no
   registered program (e.g. hubs, editorial routes). */
export const getTripHighlights = (routeId, lang = "es") => {
  const entry = getTripProgram(routeId);
  if (!entry) return [];
  const all = metaAllLangs(entry.program, entry.variant, "highlights");
  const raw = all[lang] || all.es || all.en || "";
  return raw
    .split("·")
    .map((s) => s.trim())
    .filter(Boolean);
};

export default getTripHighlights;
