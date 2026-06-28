/* ============================================================
   plannerData.js — geographic + thematic knowledge base for the
   /planner intelligent route recommender.

   100% deterministic. Real coordinates, curated driving legs
   (hours + km) for the famous Moroccan connections, haversine
   fallback for any other pair. No randomness — the engine can
   only ever recommend EXISTING Xaluca circuits (lib/planner/
   plannerTrips.js); this file just lets it reason about distance,
   viability and natural connections.
============================================================ */
const T = (es, en, fr) => ({ es, en, fr });

/* Marker types map to TripRouteMap's legend colors. */
export const AIRPORT_IDS = [
  "marrakech", "fez", "casablanca", "tanger",
  "ouarzazate", "errachidia", "agadir",
];

/* Every node the planner knows (cities/airports + destinations).
   `select:true` → offered as a checkbox in Step 4 "¿Qué quieres descubrir?". */
export const DESTINATIONS = [
  // ---- Imperial cities & coast (also airports) ----
  { id: "marrakech",   name: T("Marrakech", "Marrakech", "Marrakech"),               lat: 31.63, lng: -7.99, type: "city",   region: "centro", themes: ["ciudades-imperiales", "cultura", "gastronomia", "lujo", "relax", "familia"], select: true },
  { id: "fez",         name: T("Fez", "Fez", "Fès"),                                 lat: 34.04, lng: -5.00, type: "city",   region: "norte",  themes: ["ciudades-imperiales", "cultura", "gastronomia"], select: true },
  { id: "casablanca",  name: T("Casablanca", "Casablanca", "Casablanca"),            lat: 33.57, lng: -7.59, type: "city",   region: "costa",  themes: ["ciudades-imperiales", "cultura", "costa"], select: true },
  { id: "tanger",      name: T("Tánger", "Tangier", "Tanger"),                       lat: 35.77, lng: -5.80, type: "city",   region: "norte",  themes: ["costa", "cultura", "ciudades-imperiales"], select: true },
  { id: "rabat",       name: T("Rabat", "Rabat", "Rabat"),                           lat: 34.02, lng: -6.83, type: "city",   region: "costa",  themes: ["ciudades-imperiales", "cultura", "costa"], select: true },
  { id: "meknes",      name: T("Meknès", "Meknes", "Meknès"),                        lat: 33.89, lng: -5.55, type: "city",   region: "norte",  themes: ["ciudades-imperiales", "cultura"], select: true },
  { id: "essaouira",   name: T("Essaouira", "Essaouira", "Essaouira"),               lat: 31.51, lng: -9.77, type: "city",   region: "costa",  themes: ["costa", "relax", "gastronomia", "cultura"], select: true },
  { id: "agadir",      name: T("Agadir", "Agadir", "Agadir"),                        lat: 30.42, lng: -9.60, type: "city",   region: "costa",  themes: ["costa", "relax", "familia"], select: true },
  { id: "chefchaouen", name: T("Chefchaouen", "Chefchaouen", "Chefchaouen"),         lat: 35.17, lng: -5.26, type: "city",   region: "norte",  themes: ["cultura", "fotografia", "naturaleza", "montana", "relax"], select: true },
  { id: "tetuan",      name: T("Tetuán", "Tetouan", "Tétouan"),                      lat: 35.58, lng: -5.37, type: "city",   region: "norte",  themes: ["cultura", "costa"], select: false },
  { id: "volubilis",   name: T("Volubilis", "Volubilis", "Volubilis"),              lat: 34.07, lng: -5.55, type: "unesco", region: "norte",  themes: ["cultura", "ciudades-imperiales", "fotografia"], select: true },
  { id: "akchour",     name: T("Akchour", "Akchour", "Akchour"),                     lat: 35.23, lng: -5.16, type: "gorge",  region: "norte",  themes: ["naturaleza", "montana", "trekking", "aventura"], select: false },
  { id: "capespartel", name: T("Cabo Espartel", "Cape Spartel", "Cap Spartel"),      lat: 35.79, lng: -5.92, type: "city",   region: "norte",  themes: ["costa", "fotografia"], select: false },

  // ---- Atlas & oases ----
  { id: "altoatlas",   name: T("Alto Atlas (Imlil)", "High Atlas (Imlil)", "Haut Atlas (Imlil)"), lat: 31.14, lng: -7.92, type: "city", region: "atlas", themes: ["montana", "atlas", "trekking", "naturaleza", "aventura"], select: true },
  { id: "ourika",      name: T("Valle de Ourika", "Ourika Valley", "Vallée de l'Ourika"),         lat: 31.30, lng: -7.66, type: "city", region: "atlas", themes: ["montana", "atlas", "naturaleza", "relax"], select: false },
  { id: "medioatlas",  name: T("Medio Atlas (Ifrane)", "Middle Atlas (Ifrane)", "Moyen Atlas (Ifrane)"), lat: 33.53, lng: -5.11, type: "city", region: "atlas", themes: ["naturaleza", "montana"], select: true },
  { id: "sidiali",     name: T("Aguelmane Sidi Ali", "Aguelmane Sidi Ali", "Aguelmane Sidi Ali"), lat: 33.06, lng: -4.99, type: "lake", region: "atlas", themes: ["naturaleza", "montana", "relax"], select: true },
  { id: "aitbenhaddou",name: T("Aït Ben Haddou", "Aït Ben Haddou", "Aït Ben Haddou"),             lat: 31.05, lng: -7.13, type: "unesco", region: "sur", themes: ["kasbahs", "fotografia", "cultura"], select: true },
  { id: "ouarzazate",  name: T("Ouarzazate", "Ouarzazate", "Ouarzazate"),                         lat: 30.92, lng: -6.91, type: "kasbah", region: "sur", themes: ["kasbahs", "cultura", "fotografia"], select: true },
  { id: "skoura",      name: T("Skoura", "Skoura", "Skoura"),                                     lat: 31.06, lng: -6.55, type: "kasbah", region: "sur", themes: ["oasis", "kasbahs", "naturaleza"], select: true },
  { id: "dades",       name: T("Valle del Dadès", "Dadès Valley", "Vallée du Dadès"),             lat: 31.36, lng: -5.98, type: "gorge", region: "sur", themes: ["naturaleza", "kasbahs", "montana", "fotografia"], select: true },
  { id: "todra",       name: T("Gargantas del Todra", "Todra Gorges", "Gorges du Todra"),         lat: 31.59, lng: -5.59, type: "gorge", region: "sur", themes: ["naturaleza", "montana", "aventura", "fotografia"], select: true },

  // ---- Sahara ----
  { id: "errachidia",  name: T("Errachidia", "Errachidia", "Errachidia"),                       lat: 31.93, lng: -4.42, type: "city", region: "desierto", themes: ["desierto", "oasis"], select: false },
  { id: "erfoud",      name: T("Erfoud", "Erfoud", "Erfoud"),                                     lat: 31.43, lng: -4.23, type: "market", region: "desierto", themes: ["desierto", "oasis"], select: true },
  { id: "rissani",     name: T("Rissani", "Rissani", "Rissani"),                                  lat: 31.28, lng: -4.26, type: "market", region: "desierto", themes: ["desierto", "cultura", "gastronomia"], select: true },
  { id: "ergchebbi",   name: T("Erg Chebbi · Merzouga", "Erg Chebbi · Merzouga", "Erg Chebbi · Merzouga"), lat: 31.10, lng: -3.98, type: "desert", region: "desierto", themes: ["desierto", "fotografia", "aventura", "lujo", "relax"], select: true },
  { id: "zagora",      name: T("Zagora", "Zagora", "Zagora"),                                     lat: 30.33, lng: -5.84, type: "desert", region: "desierto", themes: ["desierto", "oasis"], select: true },
  { id: "mhamid",      name: T("M'Hamid", "M'Hamid", "M'Hamid"),                                  lat: 29.83, lng: -5.72, type: "desert", region: "desierto", themes: ["desierto", "aventura"], select: true },
  { id: "ergchigaga",  name: T("Erg Chigaga", "Erg Chigaga", "Erg Chigaga"),                      lat: 29.99, lng: -6.05, type: "desert", region: "desierto", themes: ["desierto", "aventura", "fotografia", "lujo"], select: true },
];

export const DEST_BY_ID = DESTINATIONS.reduce((m, d) => ((m[d.id] = d), m), {});

/* Airports / entry-exit cities offered in Steps 1 & 2. */
export const AIRPORTS = [
  ...AIRPORT_IDS.map((id) => ({ id, name: DEST_BY_ID[id].name, lat: DEST_BY_ID[id].lat, lng: DEST_BY_ID[id].lng })),
  { id: "otro", name: T("Otro", "Other", "Autre"), lat: null, lng: null },
];
export const AIRPORT_BY_ID = AIRPORTS.reduce((m, a) => ((m[a.id] = a), m), {});

/* Travel themes (Step 5). icon = lucide-react component name (mapped in UI). */
export const THEMES = [
  { id: "desierto",           label: T("Desierto", "Desert", "Désert"),                         icon: "Sun" },
  { id: "ciudades-imperiales",label: T("Ciudades imperiales", "Imperial cities", "Cités impériales"), icon: "Landmark" },
  { id: "cultura",            label: T("Cultura", "Culture", "Culture"),                        icon: "BookOpen" },
  { id: "naturaleza",         label: T("Naturaleza", "Nature", "Nature"),                       icon: "Leaf" },
  { id: "montana",            label: T("Montaña", "Mountains", "Montagne"),                     icon: "Mountain" },
  { id: "atlas",              label: T("Atlas", "Atlas", "Atlas"),                              icon: "MountainSnow" },
  { id: "kasbahs",            label: T("Kasbahs", "Kasbahs", "Kasbahs"),                        icon: "Castle" },
  { id: "oasis",              label: T("Oasis", "Oases", "Oasis"),                              icon: "Palmtree" },
  { id: "costa",              label: T("Costa", "Coast", "Côte"),                               icon: "Waves" },
  { id: "fotografia",         label: T("Fotografía", "Photography", "Photographie"),            icon: "Camera" },
  { id: "gastronomia",        label: T("Gastronomía", "Food", "Gastronomie"),                   icon: "UtensilsCrossed" },
  { id: "aventura",           label: T("Aventura", "Adventure", "Aventure"),                    icon: "Compass" },
  { id: "trekking",           label: T("Trekking", "Trekking", "Trekking"),                     icon: "Footprints" },
  { id: "relax",              label: T("Relax", "Relax", "Détente"),                            icon: "Flower" },
  { id: "lujo",               label: T("Lujo", "Luxury", "Luxe"),                               icon: "Gem" },
  { id: "familia",            label: T("Viaje en familia", "Family trip", "Voyage en famille"), icon: "Users" },
];
export const THEME_BY_ID = THEMES.reduce((m, t) => ((m[t.id] = t), m), {});

/* Curated real driving legs — hours + km. Symmetric (a|b === b|a). */
const LEGS = {
  "marrakech|aitbenhaddou": [3.5, 185], "marrakech|ouarzazate": [4, 200],
  "aitbenhaddou|ouarzazate": [0.5, 30], "ouarzazate|skoura": [0.75, 40],
  "skoura|dades": [1.25, 95], "ouarzazate|dades": [2, 160], "dades|todra": [1.5, 90],
  "todra|erfoud": [2, 120], "erfoud|rissani": [0.5, 22], "erfoud|ergchebbi": [0.75, 55],
  "rissani|ergchebbi": [0.6, 40], "todra|ergchebbi": [3, 200], "ergchebbi|errachidia": [1.5, 120],
  "errachidia|erfoud": [1, 80], "errachidia|sidiali": [2.5, 175], "sidiali|fez": [3, 215],
  "errachidia|fez": [5.5, 350], "marrakech|fez": [8, 530], "marrakech|essaouira": [2.5, 190],
  "marrakech|altoatlas": [1.5, 65], "marrakech|ourika": [1, 45], "altoatlas|ourika": [1.25, 55],
  "fez|chefchaouen": [4, 200], "fez|volubilis": [1, 70], "fez|meknes": [0.75, 60],
  "meknes|volubilis": [0.5, 33], "chefchaouen|tanger": [2, 110], "chefchaouen|tetuan": [1.25, 65],
  "tetuan|tanger": [1, 60], "tanger|capespartel": [0.4, 15], "chefchaouen|akchour": [0.5, 30],
  "tanger|fez": [4.5, 300], "fez|medioatlas": [1, 65], "medioatlas|errachidia": [3, 230],
  "medioatlas|sidiali": [1.5, 110], "marrakech|zagora": [6.5, 360], "zagora|mhamid": [1.5, 95],
  "mhamid|ergchigaga": [1.5, 60], "ouarzazate|zagora": [2.5, 165], "casablanca|marrakech": [2.5, 240],
  "casablanca|rabat": [1, 90], "rabat|fez": [2.5, 200], "casablanca|fez": [3.5, 290],
  "rabat|meknes": [2, 140], "agadir|marrakech": [2.5, 250], "agadir|essaouira": [2.5, 175],
  "tanger|tetuan": [1, 60], "tanger|chefchaouen": [2, 110], "volubilis|chefchaouen": [3, 160],
};

export const haversineKm = (a, b) => {
  if (!a || !b || a.lat == null || b.lat == null) return 0;
  const R = 6371, toRad = (x) => (x * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat), dLng = toRad(b.lng - a.lng);
  const s = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return Math.round(2 * R * Math.asin(Math.sqrt(s)));
};

export const nodeCoord = (id) => DEST_BY_ID[id] || AIRPORT_BY_ID[id] || null;

/* Driving estimate between two node ids → { h, km }. */
export const driveBetween = (aId, bId) => {
  if (aId === bId) return { h: 0, km: 0 };
  const key = `${aId}|${bId}`, rev = `${bId}|${aId}`;
  const leg = LEGS[key] || LEGS[rev];
  if (leg) return { h: leg[0], km: leg[1] };
  const km = haversineKm(nodeCoord(aId), nodeCoord(bId));
  const roadKm = Math.round(km * 1.28); // crow-flies → real road factor
  return { h: Math.round((roadKm / 62) * 10) / 10, km: roadKm }; // ~62 km/h average
};

export default DESTINATIONS;
