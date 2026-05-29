/* ============================================================
   juegoData.js — dataset for the /juego interactive explorer
   ------------------------------------------------------------
   Trilingual catalogue of selectable Moroccan places + the
   gamification model (categories, levels/badges). All data is
   static; user progress lives in localStorage on the client.
============================================================ */

const T = (es, en, fr) => ({ es, en, fr });

/* Region ids shared with the region map (north, imperial, coast,
   atlas, sahara, south). Used for "regiones completadas". */
export const REGION_LABELS = {
  north: T("Norte de Marruecos", "Northern Morocco", "Nord du Maroc"),
  imperial: T("Ciudades Imperiales", "Imperial Cities", "Cités Impériales"),
  coast: T("Costa Atlántica", "Atlantic Coast", "Côte Atlantique"),
  atlas: T("Atlas y valles", "Atlas & valleys", "Atlas & vallées"),
  sahara: T("Desierto del Sáhara", "Sahara Desert", "Désert du Sahara"),
  south: T("Sur de Marruecos", "Southern Morocco", "Sud du Maroc"),
};

export const REGION_ORDER = ["north", "imperial", "coast", "atlas", "sahara", "south"];

/* Categories — order defines the on-page section order. */
export const CATEGORIES = [
  { id: "regions", icon: "Map", name: T("Regiones", "Regions", "Régions") },
  { id: "cities", icon: "Building2", name: T("Ciudades", "Cities", "Villes") },
  { id: "villages", icon: "Castle", name: T("Pueblos y Kasbahs", "Villages & Kasbahs", "Villages & Kasbahs") },
  { id: "deserts", icon: "Sun", name: T("Desiertos", "Deserts", "Déserts") },
  { id: "mountains", icon: "Mountain", name: T("Montañas y Valles", "Mountains & Valleys", "Montagnes & Vallées") },
  { id: "beaches", icon: "Waves", name: T("Playas y Costa", "Beaches & Coast", "Plages & Côte") },
  { id: "monuments", icon: "Landmark", name: T("Monumentos e Historia", "Monuments & History", "Monuments & Histoire") },
  { id: "attractions", icon: "Camera", name: T("Atracciones Turísticas", "Tourist Attractions", "Attractions Touristiques") },
  { id: "experiences", icon: "Sparkles", name: T("Experiencias Clave", "Key Experiences", "Expériences Clés") },
];

/* The full catalogue. Each place: id, cat, region, name, optional coords. */
export const PLACES = [
  // ---- Regiones (macro) ----
  { id: "rg-north", cat: "regions", region: "north", coords: [35.17, -5.27], name: REGION_LABELS.north },
  { id: "rg-imperial", cat: "regions", region: "imperial", coords: [34.03, -5.0], name: REGION_LABELS.imperial },
  { id: "rg-coast", cat: "regions", region: "coast", coords: [31.51, -9.77], name: REGION_LABELS.coast },
  { id: "rg-atlas", cat: "regions", region: "atlas", coords: [31.3, -7.6], name: REGION_LABELS.atlas },
  { id: "rg-sahara", cat: "regions", region: "sahara", coords: [31.1, -4.0], name: REGION_LABELS.sahara },
  { id: "rg-south", cat: "regions", region: "south", coords: [30.42, -6.9], name: REGION_LABELS.south },

  // ---- Ciudades ----
  { id: "ci-marrakech", cat: "cities", region: "imperial", coords: [31.63, -7.99], name: T("Marrakech", "Marrakech", "Marrakech") },
  { id: "ci-fez", cat: "cities", region: "imperial", coords: [34.03, -5.0], name: T("Fez", "Fez", "Fès") },
  { id: "ci-meknes", cat: "cities", region: "imperial", coords: [33.89, -5.55], name: T("Meknès", "Meknes", "Meknès") },
  { id: "ci-rabat", cat: "cities", region: "imperial", coords: [34.02, -6.83], name: T("Rabat", "Rabat", "Rabat") },
  { id: "ci-casablanca", cat: "cities", region: "coast", coords: [33.57, -7.59], name: T("Casablanca", "Casablanca", "Casablanca") },
  { id: "ci-tanger", cat: "cities", region: "north", coords: [35.76, -5.83], name: T("Tánger", "Tangier", "Tanger") },
  { id: "ci-chefchaouen", cat: "cities", region: "north", coords: [35.17, -5.26], name: T("Chefchaouen", "Chefchaouen", "Chefchaouen") },
  { id: "ci-tetuan", cat: "cities", region: "north", coords: [35.57, -5.37], name: T("Tetuán", "Tetouan", "Tétouan") },
  { id: "ci-ouarzazate", cat: "cities", region: "south", coords: [30.92, -6.91], name: T("Ouarzazate", "Ouarzazate", "Ouarzazate") },
  { id: "ci-agadir", cat: "cities", region: "coast", coords: [30.42, -9.6], name: T("Agadir", "Agadir", "Agadir") },
  { id: "ci-essaouira", cat: "cities", region: "coast", coords: [31.51, -9.76], name: T("Essaouira", "Essaouira", "Essaouira") },
  { id: "ci-merzouga", cat: "cities", region: "sahara", coords: [31.1, -3.98], name: T("Merzouga", "Merzouga", "Merzouga") },

  // ---- Pueblos y Kasbahs ----
  { id: "vk-aitbenhaddou", cat: "villages", region: "south", coords: [31.05, -7.13], name: T("Aït Ben Haddou", "Aït Ben Haddou", "Aït Ben Haddou") },
  { id: "vk-imlil", cat: "villages", region: "atlas", coords: [31.14, -7.92], name: T("Imlil", "Imlil", "Imlil") },
  { id: "vk-tinghir", cat: "villages", region: "south", coords: [31.51, -5.53], name: T("Tinghir", "Tinghir", "Tinghir") },
  { id: "vk-skoura", cat: "villages", region: "south", coords: [31.06, -6.55], name: T("Oasis de Skoura", "Skoura Oasis", "Oasis de Skoura") },
  { id: "vk-boumalne", cat: "villages", region: "south", coords: [31.36, -5.99], name: T("Boumalne Dadès", "Boumalne Dades", "Boumalne Dadès") },
  { id: "vk-moulayidriss", cat: "villages", region: "imperial", coords: [34.05, -5.52], name: T("Moulay Idriss", "Moulay Idriss", "Moulay Idriss") },
  { id: "vk-asilah", cat: "villages", region: "north", coords: [35.46, -6.03], name: T("Asilah", "Asilah", "Asilah") },
  { id: "vk-telouet", cat: "villages", region: "atlas", coords: [31.29, -7.24], name: T("Kasbah de Telouet", "Telouet Kasbah", "Kasbah de Télouet") },

  // ---- Desiertos ----
  { id: "de-ergchebbi", cat: "deserts", region: "sahara", coords: [31.1, -4.0], name: T("Erg Chebbi", "Erg Chebbi", "Erg Chebbi") },
  { id: "de-ergchigaga", cat: "deserts", region: "sahara", coords: [29.92, -5.95], name: T("Erg Chigaga", "Erg Chigaga", "Erg Chigaga") },
  { id: "de-agafay", cat: "deserts", region: "south", coords: [31.42, -8.2], name: T("Desierto de Agafay", "Agafay Desert", "Désert d'Agafay") },
  { id: "de-zagora", cat: "deserts", region: "sahara", coords: [30.33, -5.84], name: T("Zagora", "Zagora", "Zagora") },
  { id: "de-draa", cat: "deserts", region: "sahara", coords: [30.0, -6.0], name: T("Hamada del Drâa", "Drâa Hamada", "Hamada du Drâa") },

  // ---- Montañas y Valles ----
  { id: "mo-toubkal", cat: "mountains", region: "atlas", coords: [31.06, -7.92], name: T("Monte Toubkal", "Mount Toubkal", "Mont Toubkal") },
  { id: "mo-dades", cat: "mountains", region: "south", coords: [31.55, -5.9], name: T("Valle del Dadès", "Dadès Valley", "Vallée du Dadès") },
  { id: "mo-todra", cat: "mountains", region: "south", coords: [31.59, -5.6], name: T("Gargantas del Todra", "Todra Gorges", "Gorges du Todra") },
  { id: "mo-ourika", cat: "mountains", region: "atlas", coords: [31.36, -7.75], name: T("Valle del Ourika", "Ourika Valley", "Vallée de l'Ourika") },
  { id: "mo-draavalley", cat: "mountains", region: "south", coords: [30.6, -6.3], name: T("Valle del Drâa", "Drâa Valley", "Vallée du Drâa") },
  { id: "mo-mgoun", cat: "mountains", region: "atlas", coords: [31.5, -6.42], name: T("Macizo del M'Goun", "M'Goun Massif", "Massif du M'Goun") },
  { id: "mo-ifrane", cat: "mountains", region: "atlas", coords: [33.53, -5.11], name: T("Cedros de Ifrane", "Ifrane Cedars", "Cèdres d'Ifrane") },
  { id: "mo-rif", cat: "mountains", region: "north", coords: [34.9, -4.9], name: T("Montañas del Rif", "Rif Mountains", "Montagnes du Rif") },

  // ---- Playas y Costa ----
  { id: "be-essaouira", cat: "beaches", region: "coast", coords: [31.5, -9.78], name: T("Playa de Essaouira", "Essaouira Beach", "Plage d'Essaouira") },
  { id: "be-agadir", cat: "beaches", region: "coast", coords: [30.41, -9.6], name: T("Playa de Agadir", "Agadir Beach", "Plage d'Agadir") },
  { id: "be-legzira", cat: "beaches", region: "coast", coords: [29.55, -10.07], name: T("Playa de Legzira", "Legzira Beach", "Plage de Legzira") },
  { id: "be-taghazout", cat: "beaches", region: "coast", coords: [30.54, -9.71], name: T("Taghazout (surf)", "Taghazout (surf)", "Taghazout (surf)") },
  { id: "be-saidia", cat: "beaches", region: "north", coords: [35.09, -2.23], name: T("Saïdia (Mediterráneo)", "Saïdia (Mediterranean)", "Saïdia (Méditerranée)") },
  { id: "be-dakhla", cat: "beaches", region: "coast", coords: [23.71, -15.93], name: T("Dakhla", "Dakhla", "Dakhla") },

  // ---- Monumentos e Historia ----
  { id: "mn-volubilis", cat: "monuments", region: "imperial", coords: [34.07, -5.55], name: T("Volubilis (romano)", "Volubilis (Roman)", "Volubilis (romain)") },
  { id: "mn-koutoubia", cat: "monuments", region: "imperial", coords: [31.624, -7.993], name: T("Mezquita Koutoubia", "Koutoubia Mosque", "Mosquée Koutoubia") },
  { id: "mn-feselbali", cat: "monuments", region: "imperial", coords: [34.06, -4.98], name: T("Medina de Fez el Bali", "Fez el Bali medina", "Médina de Fès el-Bali") },
  { id: "mn-saadies", cat: "monuments", region: "imperial", coords: [31.618, -7.989], name: T("Tumbas Saadíes", "Saadian Tombs", "Tombeaux saadiens") },
  { id: "mn-bahia", cat: "monuments", region: "imperial", coords: [31.621, -7.983], name: T("Palacio Bahía", "Bahia Palace", "Palais de la Bahia") },
  { id: "mn-babmansour", cat: "monuments", region: "imperial", coords: [33.892, -5.564], name: T("Bab Mansour (Meknès)", "Bab Mansour (Meknes)", "Bab Mansour (Meknès)") },
  { id: "mn-bouinania", cat: "monuments", region: "imperial", coords: [34.064, -4.978], name: T("Medersa Bou Inania", "Bou Inania Madrasa", "Médersa Bou Inania") },
  { id: "mn-skala", cat: "monuments", region: "coast", coords: [31.513, -9.772], name: T("Murallas de Essaouira", "Essaouira ramparts", "Remparts d'Essaouira") },

  // ---- Atracciones Turísticas ----
  { id: "at-jemaaelfna", cat: "attractions", region: "imperial", coords: [31.626, -7.989], name: T("Plaza Jemaa el-Fna", "Jemaa el-Fna square", "Place Jemaa el-Fna") },
  { id: "at-majorelle", cat: "attractions", region: "imperial", coords: [31.641, -8.003], name: T("Jardín Majorelle", "Majorelle Garden", "Jardin Majorelle") },
  { id: "at-zocos", cat: "attractions", region: "imperial", coords: [31.63, -7.985], name: T("Zocos de Marrakech", "Marrakech souks", "Souks de Marrakech") },
  { id: "at-curtidurias", cat: "attractions", region: "imperial", coords: [34.066, -4.972], name: T("Curtidurías de Fez", "Fez tanneries", "Tanneries de Fès") },
  { id: "at-ouzoud", cat: "attractions", region: "atlas", coords: [32.0, -6.72], name: T("Cascadas de Ouzoud", "Ouzoud Waterfalls", "Cascades d'Ouzoud") },
  { id: "at-hercules", cat: "attractions", region: "north", coords: [35.76, -5.93], name: T("Cuevas de Hércules", "Hercules Caves", "Grottes d'Hercule") },
  { id: "at-atlasstudios", cat: "attractions", region: "south", coords: [30.91, -6.92], name: T("Atlas Studios (cine)", "Atlas Film Studios", "Studios de cinéma Atlas") },
  { id: "at-dayetaoua", cat: "attractions", region: "atlas", coords: [33.62, -5.0], name: T("Lago Dayet Aoua", "Dayet Aoua Lake", "Lac Dayet Aoua") },

  // ---- Experiencias Clave (no map coords) ----
  { id: "ex-bivouac", cat: "experiences", region: "sahara", name: T("Noche en bivouac en el desierto", "Night in a desert bivouac", "Nuit en bivouac dans le désert") },
  { id: "ex-camel", cat: "experiences", region: "sahara", name: T("Ruta en dromedario", "Camel ride", "Balade à dos de dromadaire") },
  { id: "ex-medina", cat: "experiences", region: "imperial", name: T("Tour por la medina", "Medina tour", "Visite de la médina") },
  { id: "ex-4x4", cat: "experiences", region: "sahara", name: T("Ruta en 4x4 por el desierto", "4x4 desert route", "Route en 4x4 dans le désert") },
  { id: "ex-oasis", cat: "experiences", region: "south", name: T("Visita a un oasis", "Visit to an oasis", "Visite d'une oasis") },
  { id: "ex-berbertea", cat: "experiences", region: "atlas", name: T("Té con una familia bereber", "Tea with a Berber family", "Thé avec une famille berbère") },
  { id: "ex-sunrise", cat: "experiences", region: "sahara", name: T("Amanecer sobre las dunas", "Sunrise over the dunes", "Lever de soleil sur les dunes") },
  { id: "ex-hammam", cat: "experiences", region: "imperial", name: T("Hammam tradicional", "Traditional hammam", "Hammam traditionnel") },
  { id: "ex-trek", cat: "experiences", region: "atlas", name: T("Senderismo en el Atlas", "Trekking in the Atlas", "Randonnée dans l'Atlas") },
  { id: "ex-cooking", cat: "experiences", region: "imperial", name: T("Clase de cocina marroquí", "Moroccan cooking class", "Cours de cuisine marocaine") },
  { id: "ex-surf", cat: "experiences", region: "coast", name: T("Surf en la costa atlántica", "Surf on the Atlantic coast", "Surf sur la côte atlantique") },
  { id: "ex-sandboard", cat: "experiences", region: "sahara", name: T("Sandboard en las dunas", "Sandboarding the dunes", "Sandboard sur les dunes") },
];

export const TOTAL_PLACES = PLACES.length;

/* Levels / badges — unlocked by overall exploration percentage. */
export const LEVELS = [
  {
    id: "beginner", min: 0, icon: "Footprints", color: "#8C7B6B",
    name: T("Explorador Principiante", "Beginner Explorer", "Explorateur Débutant"),
    blurb: T("Tu aventura marroquí acaba de empezar.", "Your Moroccan adventure has just begun.", "Votre aventure marocaine ne fait que commencer."),
  },
  {
    id: "curious", min: 10, icon: "Compass", color: "#5A7F9C",
    name: T("Viajero Curioso", "Curious Traveller", "Voyageur Curieux"),
    blurb: T("Empiezas a descubrir los tesoros del país.", "You're starting to uncover the country's treasures.", "Vous commencez à découvrir les trésors du pays."),
  },
  {
    id: "atlas", min: 30, icon: "Mountain", color: "#5A6B4F",
    name: T("Aventurero del Atlas", "Atlas Adventurer", "Aventurier de l'Atlas"),
    blurb: T("Las montañas y los valles ya no tienen secretos.", "The mountains and valleys hold no more secrets.", "Les montagnes et vallées n'ont plus de secrets."),
  },
  {
    id: "desert", min: 50, icon: "Tent", color: "#C16542",
    name: T("Nómada del Desierto", "Desert Nomad", "Nomade du Désert"),
    blurb: T("Has cruzado las dunas y dormido bajo las estrellas.", "You've crossed the dunes and slept under the stars.", "Vous avez traversé les dunes et dormi sous les étoiles."),
  },
  {
    id: "conqueror", min: 75, icon: "Flag", color: "#A0432B",
    name: T("Conquistador de Marruecos", "Conqueror of Morocco", "Conquérant du Maroc"),
    blurb: T("Pocos rincones se te resisten ya.", "Few corners resist you now.", "Peu de recoins vous résistent désormais."),
  },
  {
    id: "legend", min: 100, icon: "Trophy", color: "#B8860B",
    name: T("Leyenda de Marruecos", "Legend of Morocco", "Légende du Maroc"),
    blurb: T("Lo has visto todo. Eres una leyenda viajera.", "You've seen it all. You're a travelling legend.", "Vous avez tout vu. Vous êtes une légende du voyage."),
  },
];

/* Resolve the achieved level + the next one to unlock, from a percentage. */
export const resolveLevel = (pct) => {
  let idx = 0;
  for (let i = 0; i < LEVELS.length; i += 1) {
    if (pct >= LEVELS[i].min) idx = i;
  }
  const current = LEVELS[idx];
  const next = idx < LEVELS.length - 1 ? LEVELS[idx + 1] : null;
  return { index: idx, current, next };
};
