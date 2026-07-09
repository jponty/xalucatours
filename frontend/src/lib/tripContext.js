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

/* ------------------------------------------------------------------
   Session-persisted planning context.
   The trip a visitor arrives with (from a trip page's "Solicitar
   información" CTA) is remembered for the WHOLE browser session, so it
   stays pre-selected in the detailed planner even after they navigate
   away from the ?trip= URL — until they change/remove it themselves.
------------------------------------------------------------------ */
const SESSION_KEY = "xaluca.tripContext";

const readSession = () => {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.sessionStorage.getItem(SESSION_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr.filter(Boolean) : [];
  } catch {
    return [];
  }
};

/* Persist the trip(s) being planned for the rest of the session. An
   empty list clears the context (equivalent to the user removing it). */
export const setTripContext = (routeIds) => {
  if (typeof window === "undefined") return;
  try {
    const arr = (Array.isArray(routeIds) ? routeIds : [routeIds]).filter(Boolean);
    if (arr.length) window.sessionStorage.setItem(SESSION_KEY, JSON.stringify(arr));
    else window.sessionStorage.removeItem(SESSION_KEY);
  } catch {
    /* storage unavailable (private mode / quota) — silently ignore */
  }
};

export const clearTripContext = () => setTripContext([]);

const readUrlParams = () => {
  if (typeof window === "undefined") return [];
  const sp = new URLSearchParams(window.location.search);
  const multi = sp.get("trips");
  if (multi) return multi.split(",").map((s) => s.trim()).filter(Boolean);
  const single = sp.get("trip");
  return single ? [single] : [];
};

/* Read one or several routeIds for the current planning context.
   Priority: a fresh ?trip=/?trips= URL param (arrival from a trip page)
   wins; otherwise fall back to the session-persisted selection so the
   choice survives in-site navigation across the whole session. */
export const getTripParams = () => {
  const url = readUrlParams();
  return url.length ? url : readSession();
};

export const getTripParam = () => getTripParams()[0] || null;

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
