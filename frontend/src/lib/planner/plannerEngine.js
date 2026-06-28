/* ============================================================
   plannerEngine.js — deterministic viability + recommendation
   engine for /planner. Pure functions, no randomness, no API.
   It can ONLY rank existing Xaluca circuits (plannerTrips) and
   reason about distance/time via plannerData.
============================================================ */
import { DEST_BY_ID, driveBetween } from "@/lib/planner/plannerData";
import { XALUCA_TRIPS } from "@/lib/planner/plannerTrips";

const tri = (es, en, fr) => ({ es, en, fr });

/* Nearest-neighbour ordering of selected destinations from the entry. */
const orderStops = (ids, entryId) => {
  const pool = [...new Set(ids)].filter((id) => DEST_BY_ID[id]);
  if (pool.length <= 1) return pool;
  const start = entryId && DEST_BY_ID[entryId] && pool.includes(entryId) ? entryId : pool[0];
  const ordered = [start];
  const remaining = pool.filter((id) => id !== start);
  let cur = start;
  while (remaining.length) {
    let best = 0, bestD = Infinity;
    remaining.forEach((id, i) => {
      const { km } = driveBetween(cur, id);
      if (km < bestD) { bestD = km; best = i; }
    });
    cur = remaining.splice(best, 1)[0];
    ordered.push(cur);
  }
  return ordered;
};

const legSum = (orderedIds, entryId, exitId) => {
  const chain = [];
  if (entryId && DEST_BY_ID[entryId] && orderedIds[0] !== entryId) chain.push(entryId);
  chain.push(...orderedIds);
  if (exitId && DEST_BY_ID[exitId] && chain[chain.length - 1] !== exitId) chain.push(exitId);
  let h = 0, km = 0;
  for (let i = 0; i < chain.length - 1; i++) {
    const d = driveBetween(chain[i], chain[i + 1]);
    h += d.h; km += d.km;
  }
  return { h: Math.round(h * 10) / 10, km: Math.round(km) };
};

/* Minimum recommended days for the raw user selection. */
export const estimateMinDays = (destIds, entryId, exitId) => {
  const ordered = orderStops(destIds, entryId);
  const { h, km } = legSum(ordered, entryId, exitId);
  const count = ordered.length;
  const driveDays = h / 5;          // ~5h comfortable driving per active day
  const dwell = 0.55 * count;       // time actually enjoyed at each place
  let minDays = Math.ceil(driveDays + dwell) + 1; // +1 arrival/acclimatisation
  minDays = Math.max(2, minDays);
  return { minDays, driveH: h, km, ordered, count };
};

export const viability = (input) => {
  const { interests = [], entry, exit, days } = input;
  if (!interests.length) {
    return { level: "yellow", minDays: Math.max(3, days || 0), driveH: 0, km: 0, ordered: [] };
  }
  const est = estimateMinDays(interests, entry, exit);
  const D = Number(days) || 0;
  const r = est.minDays ? D / est.minDays : 1;
  let level = "red";
  if (r >= 1.1) level = "green";
  else if (r >= 0.95) level = "yellow";
  else if (r >= 0.78) level = "orange";
  return { ...est, level };
};

const PACE_ORDER = ["muy-relajado", "relajado", "equilibrado", "intenso"];
/* trip pace authored as relajado|equilibrado|intenso; map muy-relajado→relajado */
const tripPaceIndex = (p) => PACE_ORDER.indexOf(p === "relajado" ? "relajado" : p);

export const scoreTrip = (trip, input) => {
  const { entry, exit, days, interests = [], themes = [], tripType } = input;
  const D = Number(days) || trip.days;

  const matchedDest = interests.filter((id) => trip.stops.includes(id));
  const destScore = interests.length ? matchedDest.length / interests.length : 0.6;

  const daysScore = 1 - Math.min(1, Math.abs(trip.days - D) / 5);

  const matchedThemes = themes.filter((id) => trip.themes.includes(id));
  const themeScore = themes.length ? matchedThemes.length / themes.length : 0.6;

  const entryOk = trip.entry === entry;
  const entryScore = !entry || entry === "otro" ? 0.5 : entryOk ? 1 : 0.15;

  let exitOk, exitScore;
  if (tripType === "same") { exitOk = trip.loop; exitScore = trip.loop ? 1 : 0.2; }
  else if (!exit || exit === "otro") { exitOk = false; exitScore = 0.5; }
  else { exitOk = trip.exit === exit; exitScore = exitOk ? 1 : 0.15; }

  const pIdx = PACE_ORDER.indexOf(input.pace);
  const tIdx = tripPaceIndex(trip.pace);
  const paceOk = pIdx === tIdx;
  const paceScore = paceOk ? 1 : Math.abs(pIdx - tIdx) === 1 ? 0.6 : 0.25;

  const raw =
    0.30 * destScore + 0.22 * daysScore + 0.16 * themeScore +
    0.14 * entryScore + 0.10 * exitScore + 0.08 * paceScore;
  const score = Math.round(raw * 100);

  const missing = interests.filter((id) => !trip.stops.includes(id));
  return {
    score,
    matched: {
      entry: entryOk, exit: exitOk, days: Math.abs(trip.days - D) <= 1,
      destinations: matchedDest, themes: matchedThemes, pace: paceOk,
    },
    missing,
  };
};

/* Driving spine stats for an existing trip. */
export const tripStats = (trip) => {
  let h = 0, km = 0;
  for (let i = 0; i < trip.stops.length - 1; i++) {
    const d = driveBetween(trip.stops[i], trip.stops[i + 1]);
    h += d.h; km += d.km;
  }
  const hpd = trip.days ? h / trip.days : 0;
  let intensity = "equilibrado";
  if (hpd < 1.6) intensity = "relajado";
  else if (hpd >= 3.4) intensity = "intenso";
  return { driveH: Math.round(h * 10) / 10, km: Math.round(km), nights: trip.days - 1, intensity, hpd };
};

/* Map nodes for TripRouteMap: [{day,lat,lng,type,name}]. */
export const tripRouteNodes = (trip) =>
  trip.stops
    .map((id, i) => {
      const d = DEST_BY_ID[id];
      if (!d) return null;
      return { day: i + 1, lat: d.lat, lng: d.lng, type: d.type, name: d.name };
    })
    .filter(Boolean);

export const recommend = (input) => {
  const ranked = XALUCA_TRIPS
    .map((trip) => ({ trip, ...scoreTrip(trip, input) }))
    .sort((a, b) => b.score - a.score || Math.abs(a.trip.days - (input.days || a.trip.days)) - Math.abs(b.trip.days - (input.days || b.trip.days)));
  return { ranked, top: ranked[0] || null };
};

/* Templated "expert advisor" smart notices. */
export const buildWarnings = (input, rec) => {
  const out = [];
  const v = viability(input);
  const top = rec?.top;
  const D = Number(input.days) || 0;
  const nm = (id) => DEST_BY_ID[id]?.name || tri(id, id, id);

  if (v.level === "orange" || v.level === "red") {
    out.push({
      id: "comfort", tone: "warn",
      text: tri(
        `Con tu selección, este viaje sería mucho más cómodo en ${v.minDays} días (has indicado ${D}).`,
        `With your selection, this trip would be far more comfortable in ${v.minDays} days (you chose ${D}).`,
        `Avec votre sélection, ce voyage serait bien plus confortable en ${v.minDays} jours (vous avez indiqué ${D}).`,
      ),
    });
  }

  if (top && top.trip.days > D && D > 0) {
    const diff = top.trip.days - D;
    out.push({
      id: "moredays", tone: "info",
      text: tri(
        `Con ${diff} día${diff > 1 ? "s" : ""} más harías la ruta completa "${top.trip.name.es}" sin prisas.`,
        `With ${diff} more day${diff > 1 ? "s" : ""} you'd complete "${top.trip.name.en}" at an easy pace.`,
        `Avec ${diff} jour${diff > 1 ? "s" : ""} de plus, vous feriez l'itinéraire complet "${top.trip.name.fr}" sans hâte.`,
      ),
    });
  }

  // Off-route selected destinations
  if (top && top.missing.length) {
    top.missing.slice(0, 2).forEach((id) => {
      out.push({
        id: `missing-${id}`, tone: "info",
        text: tri(
          `${nm(id).es} queda fuera de la ruta natural de este viaje; lo reservaríamos como extensión.`,
          `${nm(id).en} sits off this trip's natural route; we'd add it as an extension.`,
          `${nm(id).fr} se trouve hors de l'itinéraire naturel ; nous l'ajouterions en extension.`,
        ),
      });
    });
  }

  // Entry optimization toward the desert
  const desertWanted = (input.interests || []).some((id) => DEST_BY_ID[id]?.region === "desierto")
    || (input.themes || []).includes("desierto");
  if (desertWanted && input.entry === "marrakech") {
    out.push({
      id: "entry-desert", tone: "tip",
      text: tri(
        "Si aterrizas en Errachidia en lugar de Marrakech, te plantas casi en el desierto y ahorras varias horas de carretera.",
        "If you fly into Errachidia instead of Marrakech, you land almost at the desert's door and save hours of driving.",
        "Si vous atterrissez à Errachidia plutôt qu'à Marrakech, vous êtes presque au désert et économisez des heures de route.",
      ),
    });
  }

  // North combo nudge
  const north = (input.interests || []).filter((id) => DEST_BY_ID[id]?.region === "norte");
  if (north.length && !(input.interests || []).includes("chefchaouen") && D >= 5) {
    out.push({
      id: "add-chaouen", tone: "tip",
      text: tri(
        "Con un día más podrías visitar también Chefchaouen, la ciudad azul del Rif.",
        "With one more day you could also visit Chefchaouen, the Rif's blue city.",
        "Avec un jour de plus, vous pourriez aussi visiter Chefchaouen, la ville bleue du Rif.",
      ),
    });
  }

  return out.slice(0, 4);
};

export const VIABILITY_META = {
  green:  { dot: "#2E7D52", label: tri("Excelente", "Excellent", "Excellent") },
  yellow: { dot: "#C9A227", label: tri("Posible", "Possible", "Possible") },
  orange: { dot: "#C16542", label: tri("Muy intenso", "Very intense", "Très intense") },
  red:    { dot: "#B23A3A", label: tri("No recomendado", "Not recommended", "Non recommandé") },
};
