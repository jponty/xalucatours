import { ALL_TRIPS } from "./allTripsCatalog";
import { TRIP_PROGRAMS } from "./tripPrograms";
import { metaAllLangs } from "./programMeta";
import { DESTINATIONS } from "./planner/plannerData";
import { ROUTES } from "./routes";

// Tourist zones are geographic groupings of the existing destination catalogue,
// never a second, manually maintained list of trips.
export const MAP_ZONES = [
  { id: "rif", label: { es: "Rif y norte", en: "Rif and north", fr: "Rif et nord" }, center: [-6.15, 35.35], destinations: ["tanger", "tetuan", "chefchaouen", "akchour", "capespartel"] },
  { id: "imperial", label: { es: "Ciudades imperiales", en: "Imperial cities", fr: "Cités impériales" }, center: [-6.6, 33.7], destinations: ["fez", "meknes", "volubilis", "rabat", "casablanca"] },
  { id: "atlantic", label: { es: "Costa atlántica", en: "Atlantic coast", fr: "Côte atlantique" }, center: [-9.2, 32.2], destinations: ["essaouira", "agadir"] },
  { id: "atlas", label: { es: "Marrakech y Atlas", en: "Marrakech and Atlas", fr: "Marrakech et Atlas" }, center: [-7.0, 32.65], destinations: ["marrakech", "altoatlas", "ourika", "medioatlas", "sidiali"] },
  { id: "kasbahs", label: { es: "Ruta de las kasbahs", en: "Kasbah route", fr: "Route des kasbahs" }, center: [-6.45, 30.45], destinations: ["aitbenhaddou", "ouarzazate", "skoura", "dades", "todra"] },
  { id: "sahara", label: { es: "Sáhara y oasis", en: "Sahara and oases", fr: "Sahara et oasis" }, center: [-5.3, 30.15], destinations: ["errachidia", "erfoud", "rissani", "ergchebbi", "zagora", "mhamid", "ergchigaga"] },
];

// Match the real itinerary text, not the catalog's single marketing region.
// These aliases only reconcile common names for destinations already in the
// planner's geographic dictionary (e.g. Merzouga = Erg Chebbi).
const ALIASES = {
  fez: ["fes", "fez"], tanger: ["tanger", "tangier"], tetuan: ["tetuan", "tetouan"],
  meknes: ["meknes", "mequinez"], ergchebbi: ["erg chebbi", "merzouga"],
  aitbenhaddou: ["ait ben haddou", "ait benhaddou", "ait benhadou"],
  dades: ["dades", "boumalne"], todra: ["todra", "todgha", "tinghir", "tinerhir"],
  altoatlas: ["alto atlas", "high atlas", "haut atlas", "imlil", "toubkal"],
  medioatlas: ["medio atlas", "middle atlas", "moyen atlas", "ifrane"],
  sidiali: ["sidi ali", "aguelmane"], erfoud: ["erfoud", "arfoud"],
  ergchigaga: ["erg chigaga", "erg chegaga"],
};

export const normalizeMapText = (value) => String(value || "").normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

const destinationNames = Object.fromEntries(DESTINATIONS.map((destination) => [
  destination.id,
  [...new Set([...(ALIASES[destination.id] || []), ...Object.values(destination.name)].map(normalizeMapText))],
]));
const catalogByRoute = new Map(ALL_TRIPS.map((trip) => [trip.routeId, trip]));

export function buildMoroccoTripMapIndex(programs = TRIP_PROGRAMS) {
  return Object.entries(programs).filter(([routeId]) => ROUTES[routeId]).map(([routeId, { program, variant }]) => {
    const catalog = catalogByRoute.get(routeId);
    const meta = (field) => metaAllLangs(program, variant, field);
    // Published route stops are read from the programme itself. Changing a day
    // or its destination updates region results on the next build.
    const itinerary = normalizeMapText([
      ...["quick_places", "place", "highlights", "airports"].map((field) => meta(field).es),
      ...(program.days || []).flatMap((day) => [day.title?.es, day.route_id]),
    ].join(" "));
    const places = DESTINATIONS.filter((destination) =>
      (destinationNames[destination.id] || []).some((name) => name && (` ${itinerary} `).includes(` ${name} `))
    ).map((destination) => destination.id);
    const zones = MAP_ZONES.filter((zone) => places.some((place) => zone.destinations.includes(place))).map((zone) => zone.id);
    return {
      routeId, places, zones,
      title: catalog?.title || meta("title"),
      duration: program.duration || catalog?.duration,
      summary: catalog?.summary || meta("subtitle"),
      image: catalog?.image || meta("hero_image").es,
    };
  });
}

export const tripsForMapSelection = (trips, selection) => trips.filter((trip) => trip.zones.includes(selection?.id));
