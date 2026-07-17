/* ============================================================
   tripFinder.js — deterministic ranking for the Home trip finder.
   ------------------------------------------------------------
   100% deterministic (no AI, no randomness). Scores the REAL
   Xaluca circuits (lib/planner/plannerTrips) against the user's
   Home-search criteria and returns the best matches:
     • origin city (Spain)   → ease of access (direct-flight signal)
     • travel month          → season fit (lib/bestTimeData styles)
     • approximate duration  → day-count bucket (primary signal)
   Only ever surfaces EXISTING trips — never invents routes.
============================================================ */
import { XALUCA_TRIPS, TRIP_BY_ROUTE, tripImage } from "@/lib/planner/plannerTrips";
import { DEST_BY_ID } from "@/lib/planner/plannerData";
import { SPAIN_ORIGINS } from "@/lib/flights";
import { TRAVEL_STYLES } from "@/lib/bestTimeData";
import { getFromPrice } from "@/lib/pricing";
import { getProgramTiers } from "@/lib/programPricing";

const T = (es, en, fr) => ({ es, en, fr });
export const tt = (obj, lang) => (obj && (obj[lang] ?? obj.es)) || "";

/* ---- Origin cities (España). Reuses the /vuelos catalogue + "Otra". ---- */
export const ORIGIN_OPTIONS = [
  ...SPAIN_ORIGINS.map((o) => ({ id: o.id, name: o.city })),
  { id: "otra", name: T("Otra ciudad", "Other city", "Autre ville") },
];

/* Well-connected Moroccan airports (direct flights) per Spanish origin — a
   LIGHT convenience signal, not a hard filter (every trip stays reachable via
   a connection). Trip.entry values in use are: marrakech · fez · tanger ·
   ouarzazate · errachidia (the last two are never direct → need a connection). */
const ORIGIN_DIRECT = {
  mad: ["marrakech", "fez", "tanger", "casablanca", "agadir", "nador", "oujda"],
  bcn: ["marrakech", "fez", "tanger", "casablanca", "nador", "agadir"],
  agp: ["marrakech", "fez", "tanger", "nador", "casablanca"],
  vlc: ["marrakech", "fez", "tanger", "nador"],
  svq: ["marrakech", "tanger", "fez"],
  bio: ["marrakech", "tanger"],
  alc: ["marrakech", "fez", "tanger", "nador"],
  pmi: ["marrakech", "tanger"],
};

/* ---- Month options: Enero 2026 … Diciembre 2027 + "Soy flexible" ---- */
const MONTH_NAMES = {
  es: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
  en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  fr: ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"],
};
export const FLEXIBLE_LABEL = T("Soy flexible", "I'm flexible", "Je suis flexible");
export const buildMonthOptions = (lang) => {
  const out = [];
  for (const year of [2026, 2027]) {
    for (let m = 1; m <= 12; m += 1) {
      out.push({ value: `${year}-${m}`, month: m, year, label: `${MONTH_NAMES[lang][m - 1]} ${year}` });
    }
  }
  return out;
};
export const monthName = (monthValue, lang) => {
  if (!monthValue || monthValue === "flexible") return "";
  const m = Number(monthValue.split("-")[1]);
  return MONTH_NAMES[lang][m - 1] || "";
};

/* ---- Duration buckets ---- */
export const DURATION_BUCKETS = [
  { id: "2-3",   label: T("2–3 días", "2–3 days", "2–3 jours"),     min: 2,  max: 3 },
  { id: "4-5",   label: T("4–5 días", "4–5 days", "4–5 jours"),     min: 4,  max: 5 },
  { id: "6-7",   label: T("6–7 días", "6–7 days", "6–7 jours"),     min: 6,  max: 7 },
  { id: "8-10",  label: T("8–10 días", "8–10 days", "8–10 jours"),  min: 8,  max: 10 },
  { id: "11-14", label: T("11–14 días", "11–14 days", "11–14 jours"), min: 11, max: 14 },
  { id: "15+",   label: T("15+ días", "15+ days", "15+ jours"),     min: 15, max: 99 },
];

/* Trip themes → seasonal travel-style ids (bestMonths live in bestTimeData). */
const THEME_TO_STYLE = {
  desierto: "desert", oasis: "desert",
  atlas: "hiking", montana: "hiking", trekking: "hiking", naturaleza: "hiking",
  "ciudades-imperiales": "cities", cultura: "cities", gastronomia: "cities",
  costa: "beach",
  lujo: "luxury",
  fotografia: "photography",
};
const STYLE_MONTHS = TRAVEL_STYLES.reduce((m, s) => ((m[s.id] = s.bestMonths), m), {});

/* Entry / exit city display name. */
export const nodeName = (id, lang) => tt(DEST_BY_ID[id]?.name, lang) || id;

/* ------------------------------------------------------------------
   Price helpers — 100% derived from the REAL configured tariffs.
   `tripFromPrice` mirrors <FromPrice>: per-program tariff when present,
   otherwise the live global pricing tiers. Never a hardcoded value.
------------------------------------------------------------------ */
export const tripFromPrice = (routeId, pricing) => {
  const tiers = getProgramTiers(routeId) || (pricing && pricing.tiers) || null;
  if (!tiers) return null;
  return getFromPrice({ tiers });
};

/* Real min/max "from" price across the whole published catalogue, rounded
   OUTWARD to the nearest 10 so the full range always covers every trip.
   Recomputed automatically whenever a trip / its price changes. */
export const priceBounds = (pricing) => {
  const vals = XALUCA_TRIPS
    .map((t) => tripFromPrice(t.routeId, pricing))
    .filter((n) => typeof n === "number" && n > 0);
  if (!vals.length) return { min: 0, max: 0 };
  const lo = Math.floor(Math.min(...vals) / 10) * 10;
  const hi = Math.ceil(Math.max(...vals) / 10) * 10;
  return { min: lo, max: hi === lo ? lo + 10 : hi };
};

/* ------------------------------------------------------------------
   Rank every trip against the criteria. Returns [{ trip, score,
   reasons[] }] sorted best-first (stable). Reasons drive the UI chip.
------------------------------------------------------------------ */
export const rankTrips = ({ originId, monthValue, durationId, priceMin, priceMax, pricing }) => {
  const month = monthValue && monthValue !== "flexible" ? Number(monthValue.split("-")[1]) : null;
  const directSet =
    originId && originId !== "otra" && ORIGIN_DIRECT[originId] ? new Set(ORIGIN_DIRECT[originId]) : null;
  const bucket = durationId ? DURATION_BUCKETS.find((b) => b.id === durationId) : null;
  const usePriceFilter = typeof priceMin === "number" && typeof priceMax === "number";

  return XALUCA_TRIPS.map((trip, idx) => {
    let score = 0;
    const reasons = [];
    const from = tripFromPrice(trip.routeId, pricing);

    // 1) Duration (primary). Exact bucket match dominates; near-miss softens.
    if (bucket) {
      if (trip.days >= bucket.min && trip.days <= bucket.max) {
        score += 100;
        reasons.push("duration");
      } else {
        const dist = trip.days < bucket.min ? bucket.min - trip.days : trip.days - bucket.max;
        score += Math.max(0, 40 - dist * 20); // 1 off → +20, ≥2 off → 0
      }
    }

    // 2) Season fit for the chosen month.
    if (month) {
      const styles = [...new Set(trip.themes.map((t) => THEME_TO_STYLE[t]).filter(Boolean))];
      if (styles.length) {
        const fits = styles.filter((s) => STYLE_MONTHS[s]?.includes(month));
        const ratio = fits.length / styles.length;
        score += Math.round(ratio * 50);
        if (ratio >= 0.5) reasons.push("season");
      }
    }

    // 3) Origin — easy access from the chosen Spanish city (light signal).
    if (directSet) {
      if (directSet.has(trip.entry)) {
        score += 20;
        reasons.push("origin");
      }
    } else if (originId === "otra" && ["marrakech", "fez", "tanger"].includes(trip.entry)) {
      score += 8;
    }

    return { trip, score, reasons, idx, from };
  })
    .filter((r) => !usePriceFilter || (typeof r.from === "number" && r.from >= priceMin && r.from <= priceMax))
    .sort((a, b) => b.score - a.score || a.idx - b.idx);
};

export const topTrips = (criteria, limit = 6) => rankTrips(criteria).slice(0, limit);

export { TRIP_BY_ROUTE, tripImage };
