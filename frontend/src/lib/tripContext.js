/* ============================================================
   tripContext.js
   ----
   Resolve a trip routeId → display info for the "trip in context"
   banner (planner / appointment / contact flows).

   Resolution order (so ANY itinerary the team adds shows up
   automatically, with no manual edits to the banner):
     1. ALL_TRIPS catalog (rich: title, nights, image, region).
     2. TRIP_PROGRAMS registry (every program page's data) — derives
        title + duration + hero image from the SAME source the trip
        page renders, via programMeta.
   Returns null when the routeId matches no real trip.
============================================================ */
import { ALL_TRIPS } from "@/lib/allTripsCatalog";
import { getTripProgram } from "@/lib/tripPrograms";
import { metaAllLangs } from "@/lib/programMeta";
import { tripHeroImage } from "@/lib/tripHero";
import { pick } from "@/contexts/LanguageContext";

const DAYS = { es: "días", en: "days", fr: "jours" };

export const getTripParam = () => {
  if (typeof window === "undefined") return null;
  return new URLSearchParams(window.location.search).get("trip");
};

/* Read one or several routeIds from the URL:
   ?trips=a,b,c (preferred for collections) or ?trip=a (single). */
export const getTripParams = () => {
  if (typeof window === "undefined") return [];
  const sp = new URLSearchParams(window.location.search);
  const multi = sp.get("trips");
  if (multi) return multi.split(",").map((s) => s.trim()).filter(Boolean);
  const single = sp.get("trip");
  return single ? [single] : [];
};

export const resolveTripContext = (routeId, lang) => {
  if (!routeId) return null;

  // 1 · Catalog (Home "every trip" source of truth)
  const cat = ALL_TRIPS.find((x) => x.routeId === routeId);
  if (cat) {
    return {
      routeId,
      title: pick(cat.title, lang),
      durationLabel: `${cat.nights + 1} ${pick(DAYS, lang)}`,
      image: cat.image || null,
      region: cat.region || null,
    };
  }

  // 2 · Program registry (covers every trip page automatically)
  const reg = getTripProgram(routeId);
  if (reg && reg.program) {
    const { program, variant } = reg;
    return {
      routeId,
      title: pick(metaAllLangs(program, variant, "title"), lang),
      durationLabel: program.duration ? pick(program.duration, lang) : "",
      image: tripHeroImage(routeId) || pick(metaAllLangs(program, variant, "hero_image"), lang) || null,
      region: program.region || null,
    };
  }

  return null;
};

export default resolveTripContext;
