/* ============================================================
   dayRouteResolver.js
   ----
   Resolves a day's route into a list of geo-located waypoints
   suitable for rendering a per-day Leaflet map.

   Tier order:
     1) DAY_ROUTES[route_id]          – explicit hand-curated route
     2) Parsed from `route_id` string – tokens matched against
                                        the city dictionary below
     3) null                          – stationary day / missing data

   Tuple format: [name, lat, lng, kind]
     kind ∈ "start" | "stop" | "overnight" | "end"
============================================================ */

import { DAY_ROUTES } from "@/lib/dayRoutes";

/* ---- Token → coordinates dictionary -----------------------
   Keys are the lower-case substrings expected inside a route_id.
   Tuple format: [displayName, lat, lng, defaultKind].
   Order of fallbacks: longer keys first (we sort by length when
   matching to avoid e.g. "rak" colliding with "marrakech"). */
const CITY_TABLE = {
  // North & coast
  "tanger":        ["Tánger", 35.7595, -5.8340, "stop"],
  "chefchaouen":   ["Chefchaouen", 35.1716, -5.2696, "stop"],
  "tetuan":        ["Tetuán", 35.5784, -5.3683, "stop"],
  "tetouan":       ["Tetuán", 35.5784, -5.3683, "stop"],
  "asilah":        ["Asilah", 35.4658, -6.0349, "stop"],
  "akchour":       ["Akchour", 35.1900, -5.1900, "stop"],
  "rabat":         ["Rabat", 34.0209, -6.8416, "stop"],
  "casablanca":    ["Casablanca", 33.5731, -7.5898, "stop"],
  "casa":          ["Casablanca", 33.5731, -7.5898, "stop"],

  // Imperial cities & central
  "fez":           ["Fez", 34.0331, -5.0003, "stop"],
  "fes":           ["Fez", 34.0331, -5.0003, "stop"],
  "meknes":        ["Meknès", 33.8935, -5.5547, "stop"],
  "volubilis":     ["Volubilis", 34.0731, -5.5556, "stop"],

  // Marrakech zone
  "marrakech":     ["Marrakech", 31.6295, -7.9811, "stop"],
  "rak":           ["Marrakech", 31.6295, -7.9811, "stop"],
  "agafay":        ["Agafay", 31.3500, -8.1500, "stop"],
  "essaouira":     ["Essaouira", 31.5125, -9.7700, "stop"],

  // Atlas
  "ifrane":        ["Ifrane", 33.5228, -5.1106, "stop"],
  "sidiali":       ["Aguelmane Sidi Ali", 33.0367, -5.0119, "stop"],
  "imlil":         ["Imlil", 31.1395, -7.9211, "stop"],
  "toubkal":       ["Toubkal", 31.0633, -7.9097, "stop"],
  "atlas":         ["Atlas", 31.5300, -7.4000, "stop"],
  "mgoun":         ["M'Goun", 31.5172, -6.4144, "stop"],
  "antiatlas":     ["Anti-Atlas", 29.9000, -8.5000, "stop"],

  // South / Ouarzazate axis
  "ouarzazate":    ["Ouarzazate", 30.9189, -6.8934, "stop"],
  "ozz":           ["Ouarzazate", 30.9189, -6.8934, "stop"],
  "ouarza":        ["Ouarzazate", 30.9189, -6.8934, "stop"],
  "aitben":        ["Aït Ben Haddou", 31.0470, -7.1295, "stop"],
  "aitbenhaddou":  ["Aït Ben Haddou", 31.0470, -7.1295, "stop"],
  "skoura":        ["Skoura", 31.0612, -6.5544, "stop"],
  "dades":         ["Boumalne Dades", 31.3580, -5.9870, "stop"],
  "todra":         ["Gargantas del Todra", 31.5847, -5.5894, "stop"],
  "tinerhir":      ["Tinerhir", 31.5147, -5.5331, "stop"],
  "draa":          ["Valle del Drâa", 30.3325, -5.8413, "stop"],
  "zagora":        ["Zagora", 30.3325, -5.8413, "stop"],

  // Sahara axis
  "erfoud":        ["Erfoud", 31.4358, -4.2380, "stop"],
  "errachidia":    ["Errachidia", 31.9314, -4.4244, "stop"],
  "rissani":       ["Rissani", 31.2820, -4.2620, "stop"],
  "khamlia":       ["Khamlia", 31.0470, -3.9750, "stop"],
  "merdani":       ["Merdani", 31.1900, -3.9300, "stop"],
  "ziz":           ["Valle del Ziz", 31.6500, -4.3500, "stop"],
  "chebbi":        ["Erg Chebbi", 31.0995, -4.0128, "stop"],
  "ergchebbi":     ["Erg Chebbi", 31.0995, -4.0128, "stop"],
  "merzouga":      ["Merzouga", 31.0995, -4.0128, "stop"],
  "kemkem":        ["Kem Kem", 31.0500, -4.2000, "stop"],
  "dunes":         ["Erg Chebbi · dunas", 31.0995, -4.0128, "stop"],
  "oasis":         ["Oasis", 31.2000, -4.0800, "stop"],
  "momia":         ["Momia bereber", 31.3000, -4.1500, "stop"],
  "fossils":       ["Canteras de fósiles", 31.3500, -4.1900, "stop"],
};

/* Tokens to drop when parsing (program prefixes, verbs, generic words). */
const SKIP_TOKENS = new Set([
  "arrival", "return", "discover", "medina", "stay", "rest",
  "transfer", "trk", "ad", "da", "ci", "ci45", "ci67",
  "cirf", "cirf67", "cirf78", "tf", "tf45", "tf56", "ft",
  "ft67", "msf", "msf78", "msf89", "msf910", "fzs", "fzs78",
  "fzs89", "fzs910", "ozf", "ozf56", "ozf67", "ozf78",
  "ozz56", "ozz67", "ozz78", "trk89", "desierto34", "atlas34",
  "enduro", "enduro67",
  "d1", "d2", "d3", "d4", "d5", "d6", "d7", "d8", "d9",
  "p", "n", "v", "the", "el", "la",
]);

/* Token aliases that should remap to canonical city keys. */
const ALIASES = {
  "tan":   "tanger",
  "tet":   "tetuan",
  "ait":   "aitben",
  "ben":   "aitben",
  "haddou":"aitben",
};

/* Sort city keys longest-first so we match "marrakech" before "rak". */
const CITY_KEYS = Object.keys(CITY_TABLE).sort((a, b) => b.length - a.length);

/** Try to resolve a single token to a city tuple. */
const tokenToCity = (raw) => {
  const t = (raw || "").toLowerCase().trim();
  if (!t || SKIP_TOKENS.has(t)) return null;
  if (CITY_TABLE[t]) return CITY_TABLE[t];
  const alias = ALIASES[t];
  if (alias && CITY_TABLE[alias]) return CITY_TABLE[alias];
  // Loose contains check — for tokens like "ergchebbi" inside a compound segment.
  for (const key of CITY_KEYS) {
    if (t.includes(key)) return CITY_TABLE[key];
  }
  return null;
};

/** Parse a `route_id` into a list of waypoint tuples by token matching. */
const parseRouteIdToWaypoints = (routeId) => {
  if (!routeId) return [];
  const tokens = routeId.toLowerCase().split(/[-_]/);
  const resolved = [];
  const seen = new Set();

  for (const tok of tokens) {
    const match = tokenToCity(tok);
    if (!match) continue;
    const key = `${match[1]}|${match[2]}`;
    if (seen.has(key)) continue;
    seen.add(key);
    resolved.push(match);
  }

  if (resolved.length === 0) return [];

  // Tag first / last with semantic kinds for the polyline renderer.
  const out = resolved.map((c, i) => {
    let kind = "stop";
    if (i === 0) kind = "start";
    else if (i === resolved.length - 1) kind = "overnight";
    return [c[0], c[1], c[2], kind];
  });

  return out;
};

/* Public API ----------------------------------------------- */

/**
 * Resolve a day's route into waypoints.
 * @param {string} routeId – the `day.route_id` from program data
 * @returns {Array<[name, lat, lng, kind]>}
 */
export const resolveDayRoute = (routeId) => {
  // Tier 1 — explicit curated data
  const curated = DAY_ROUTES?.[routeId];
  if (curated && curated.length > 0) return curated;

  // Tier 2 — parsed from route_id token stream
  return parseRouteIdToWaypoints(routeId);
};

/** True when the resolver found at least 2 waypoints (drawable polyline). */
export const hasDrawableRoute = (routeId) => resolveDayRoute(routeId).length >= 2;

/** True when only one waypoint is known – treat as a "stationary day". */
export const hasSingleAnchor = (routeId) => resolveDayRoute(routeId).length === 1;
