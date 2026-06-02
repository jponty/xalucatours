/* ============================================================
   dayNarrativeGallery.js
   ----
   Builds the "Galería del día – El recorrido en imágenes" as a
   visual narration of the day, derived EXCLUSIVELY from the day's
   own itinerary description (`day.body`).

   Global rule (applies to every program / itinerary, no exceptions)
   -----------------------------------------------------------------
   • Exactly 10 images per day gallery.
   • Images appear in the SAME chronological order the itinerary
     unfolds (sequence of places, landscapes, activities, monuments,
     villages, cities, lodging and experiences actually visited).
   • Only elements EXPLICITLY named in the day's description are
     used. Nothing is invented or added.
   • Airports and flight-only transit hubs are never shown.
   • Each caption is the NAME ONLY of the place / activity / point
     shown — no descriptions, no marketing, no long titles.
   • If fewer than 10 distinct points are named, the most relevant
     points repeat (with a different image) to complete the 10,
     always respecting the chronological order.

   Everything is CMS-editable downstream (image + caption per slot).
============================================================ */
import { IMG as I } from "@/lib/imageBank";

const T = (es, en, fr) => ({ es, en, fr });

/* Accent-insensitive lowercase normaliser. */
const norm = (s) =>
  (s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

const escapeRx = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/* ---- Thematic image groups (verified Moroccan photo bank) ----
   Each point maps to a small set so repeats look different. */
const DESERT  = [I.dunes, I.camelDunes, I.dunesRocky];
const CAMELS  = [I.camelCaravan, I.camelDunes, I.desertWoman];
const SUNSET  = [I.dunes, I.camelDunes, I.desertWoman];
const KASBAH  = [I.kasbahArch, I.kasbahGate];
const ATLAS   = [I.atlasMisty, I.atlasSnowy, I.atlasValley, I.atlasVillage];
const VALLEY  = [I.atlasValley, I.atlasMisty];
const OASIS   = [I.atlasValley, I.riadInterior];
const GORGE   = [I.atlasMisty, I.dunesRocky];
const ROCKY   = [I.dunesRocky, I.camelDunes];
const MARKET  = [I.marketBaskets];
const MEDINA  = [I.medinaPeople];
const MARRAK  = [I.koutoubia, I.medinaPeople];
const RIAD    = [I.riadFountain, I.riadInterior];
const BLUE    = [I.chefBlueCity, I.chefAlley, I.chefCourtyard, I.chefStreet];
const COAST   = [I.essaouiraPort];
const VILLAGE = [I.atlasVillage, I.desertWoman];

/* Words that signal a place is only a flight / connection mention. */
const FLIGHT_WORDS = [
  "aeropuerto", "aeroport", "airport", "vuelo", "vol ", "flight",
  "conexion", "connexion", "connection", "correspondance", "escala", "layover",
];
const FLIGHT_WINDOW = 55;
const isFlightContext = (text, idx) => {
  const from = Math.max(0, idx - FLIGHT_WINDOW);
  const win = text.slice(from, idx + FLIGHT_WINDOW);
  return FLIGHT_WORDS.some((w) => win.includes(w));
};

/* ============================================================
   LEXICON — every recognisable "point" of an itinerary day.
   { id, name (name-only caption), imgs[], aliases[] (normalised),
     hub? (flight-only transit cities excluded when in flight ctx) }
============================================================ */
export const NARRATIVE_LEXICON = [
  /* ---------------- PLACES · North & coast ---------------- */
  { id: "tanger", name: T("Tánger", "Tangier", "Tanger"), imgs: COAST.concat(MEDINA), aliases: ["tanger"] },
  { id: "tetuan", name: T("Tetuán", "Tetouan", "Tétouan"), imgs: MEDINA, aliases: ["tetuan", "tetouan"] },
  { id: "asilah", name: T("Asilah", "Asilah", "Asilah"), imgs: COAST, aliases: ["asilah"] },
  { id: "chefchaouen", name: T("Chefchaouen", "Chefchaouen", "Chefchaouen"), imgs: BLUE, aliases: ["chefchaouen", "chaouen"] },
  { id: "akchour", name: T("Cascadas de Akchour", "Akchour Waterfalls", "Cascades d'Akchour"), imgs: VALLEY, aliases: ["akchour"] },
  { id: "rabat", name: T("Rabat", "Rabat", "Rabat"), imgs: MEDINA, aliases: ["rabat"] },
  { id: "casablanca", name: T("Casablanca", "Casablanca", "Casablanca"), imgs: MEDINA, hub: true, aliases: ["casablanca"] },
  { id: "cabospartel", name: T("Cabo Espartel", "Cape Spartel", "Cap Spartel"), imgs: COAST, aliases: ["cabo espartel", "cape spartel", "cap spartel"] },
  { id: "grutashercules", name: T("Grutas de Hércules", "Hercules' Caves", "Grottes d'Hercule"), imgs: COAST, aliases: ["grutas de hercules", "grottes d'hercule", "hercules cave", "hercule"] },

  /* ---------------- PLACES · Imperial & Middle Atlas ---------------- */
  { id: "fez", name: T("Fez", "Fez", "Fès"), imgs: MEDINA, aliases: ["fez", "fes", "fes el bali"] },
  { id: "meknes", name: T("Meknès", "Meknes", "Meknès"), imgs: KASBAH.concat(MEDINA), aliases: ["meknes"] },
  { id: "volubilis", name: T("Volubilis", "Volubilis", "Volubilis"), imgs: VALLEY, aliases: ["volubilis"] },
  { id: "moulayidriss", name: T("Moulay Idriss", "Moulay Idriss", "Moulay Idriss"), imgs: VILLAGE, aliases: ["moulay idriss"] },
  { id: "ifrane", name: T("Ifrane", "Ifrane", "Ifrane"), imgs: ATLAS, aliases: ["ifrane"] },
  { id: "midelt", name: T("Midelt", "Midelt", "Midelt"), imgs: ATLAS, aliases: ["midelt"] },

  /* ---------------- PLACES · Marrakech zone ---------------- */
  { id: "marrakech", name: T("Marrakech", "Marrakech", "Marrakech"), imgs: MARRAK, aliases: ["marrakech"] },
  { id: "jemaa", name: T("Plaza Jemaa el-Fna", "Jemaa el-Fna square", "Place Jemaa el-Fna"), imgs: MARRAK, aliases: ["jemaa", "jamaa", "djemaa", "jemaa el-fna", "jamaa el fna", "djemaa el-fna", "fna"] },
  { id: "koutoubia", name: T("Koutoubia", "Koutoubia", "Koutoubia"), imgs: [I.koutoubia, I.atlasSnowy], aliases: ["koutoubia"] },
  { id: "bahia", name: T("Palacio de la Bahía", "Bahia Palace", "Palais de la Bahia"), imgs: [I.riadFountain, I.riadInterior], aliases: ["bahia", "palacio de la bahia", "palais de la bahia"] },
  { id: "saadies", name: T("Tumbas Saadíes", "Saadian Tombs", "Tombeaux Saadiens"), imgs: [I.riadInterior, I.kasbahArch], aliases: ["saadies", "saadian", "tumbas saadies", "tombeaux saadiens"] },
  { id: "benyoussef", name: T("Medersa Ben Youssef", "Ben Youssef Madrasa", "Médersa Ben Youssef"), imgs: [I.riadInterior, I.medinaPeople], aliases: ["ben youssef", "ben youssouf"] },
  { id: "majorelle", name: T("Jardín Majorelle", "Majorelle Garden", "Jardin Majorelle"), imgs: [I.riadFountain, I.riadInterior], aliases: ["majorelle"] },
  { id: "menara", name: T("Jardines de la Menara", "Menara Gardens", "Jardins de la Ménara"), imgs: [I.riadFountain], aliases: ["menara"] },
  { id: "riad", name: T("Riad", "Riad", "Riad"), imgs: RIAD, aliases: ["riad"] },
  { id: "essaouira", name: T("Essaouira", "Essaouira", "Essaouira"), imgs: COAST, aliases: ["essaouira"] },
  { id: "agafay", name: T("Desierto de Agafay", "Agafay Desert", "Désert d'Agafay"), imgs: ROCKY, aliases: ["agafay"] },
  { id: "imlil", name: T("Imlil", "Imlil", "Imlil"), imgs: ATLAS, aliases: ["imlil"] },
  { id: "ouzoud", name: T("Cascadas de Ouzoud", "Ouzoud Waterfalls", "Cascades d'Ouzoud"), imgs: VALLEY, aliases: ["ouzoud"] },

  /* ---------------- PLACES · Ranges ---------------- */
  { id: "altoatlas", name: T("Alto Atlas", "High Atlas", "Haut Atlas"), imgs: ATLAS, aliases: ["alto atlas", "haut atlas", "high atlas"] },
  { id: "antiatlas", name: T("Anti-Atlas", "Anti-Atlas", "Anti-Atlas"), imgs: ATLAS, aliases: ["anti-atlas", "anti atlas"] },
  { id: "toubkal", name: T("Monte Toubkal", "Mount Toubkal", "Mont Toubkal"), imgs: ATLAS, aliases: ["toubkal"] },
  { id: "mgoun", name: T("Macizo del M'Goun", "M'Goun Massif", "Massif du M'Goun"), imgs: ATLAS, aliases: ["mgoun", "m'goun", "m goun"] },
  { id: "rif", name: T("Montañas del Rif", "Rif Mountains", "Montagnes du Rif"), imgs: ATLAS, aliases: ["rif"] },

  /* ---------------- PLACES · Ouarzazate axis ---------------- */
  { id: "ouarzazate", name: T("Ouarzazate", "Ouarzazate", "Ouarzazate"), imgs: KASBAH, aliases: ["ouarzazate"] },
  { id: "aitben", name: T("Aït Ben Haddou", "Aït Ben Haddou", "Aït Ben Haddou"), imgs: KASBAH, aliases: ["ait ben haddou", "ait benhaddou", "aitbenhaddou", "ait-ben-haddou"] },
  { id: "skoura", name: T("Palmeral de Skoura", "Skoura Palm Grove", "Palmeraie de Skoura"), imgs: OASIS, aliases: ["skoura"] },
  { id: "boumalne", name: T("Boumalne Dades", "Boumalne Dades", "Boumalne Dadès"), imgs: VALLEY, aliases: ["boumalne"] },
  { id: "boutaghrar", name: T("Boutaghrar", "Boutaghrar", "Boutaghrar"), imgs: VILLAGE, aliases: ["boutaghrar"] },
  { id: "tinerhir", name: T("Tinerhir", "Tinerhir", "Tinerhir"), imgs: OASIS, aliases: ["tinerhir", "tineghir"] },
  { id: "todra", name: T("Gargantas del Todra", "Todra Gorges", "Gorges du Todra"), imgs: GORGE, aliases: ["todra", "todgha"] },
  { id: "dadesgorges", name: T("Gargantas del Dadès", "Dades Gorges", "Gorges du Dadès"), imgs: GORGE, aliases: ["gargantas del dades", "gorges du dades", "dades gorges", "dades gorge"] },
  { id: "dades", name: T("Valle del Dadès", "Dades Valley", "Vallée du Dadès"), imgs: VALLEY, aliases: ["dades", "dadès", "valle del dades", "vallee du dades"] },
  { id: "rosevalley", name: T("Valle de las Rosas", "Rose Valley", "Vallée des Roses"), imgs: VALLEY, aliases: ["valle de las rosas", "vallee des roses", "rose valley", "valle de la rosa"] },
  { id: "monkeypaws", name: T("Las «Patas de Mono»", "The «Monkey Paws»", "Les « Pattes de Singe »"), imgs: GORGE, aliases: ["patas de mono", "monkey paws", "monkey fingers", "dedos de mono", "doigts de singe", "pattes de singe"] },

  /* ---------------- PLACES · Sahara / Tafilalet ---------------- */
  { id: "erfoud", name: T("Erfoud", "Erfoud", "Erfoud"), imgs: KASBAH.concat(DESERT), aliases: ["erfoud"] },
  { id: "errachidia", name: T("Errachidia", "Errachidia", "Errachidia"), imgs: OASIS, aliases: ["errachidia"] },
  { id: "rissani", name: T("Rissani", "Rissani", "Rissani"), imgs: MARKET, aliases: ["rissani"] },
  { id: "merzouga", name: T("Merzouga", "Merzouga", "Merzouga"), imgs: DESERT, aliases: ["merzouga"] },
  { id: "ergchebbi", name: T("Erg Chebbi", "Erg Chebbi", "Erg Chebbi"), imgs: DESERT, aliases: ["erg chebbi", "chebbi", "gran erg"] },
  { id: "khamlia", name: T("Khamlia", "Khamlia", "Khamlia"), imgs: VILLAGE, aliases: ["khamlia"] },
  { id: "merdani", name: T("Merdani", "Merdani", "Merdani"), imgs: VILLAGE, aliases: ["merdani"] },
  { id: "mfis", name: T("Minas de M'Fis", "M'Fis Mines", "Mines de M'Fis"), imgs: ROCKY, aliases: ["m'fis", "mfis", "minas de mfis", "mines de mfis"] },
  { id: "zizvalley", name: T("Valle del Ziz", "Ziz Valley", "Vallée du Ziz"), imgs: OASIS, aliases: ["valle del ziz", "vallee du ziz", "ziz valley", "del ziz", "du ziz"] },
  { id: "khettaras", name: T("Khettaras del Tafilalet", "Tafilalet Khettaras", "Khettaras du Tafilalet"), imgs: OASIS, aliases: ["khettaras", "khettara"] },

  /* ---------------- PLACES · Drâa / Zagora ---------------- */
  { id: "draavalley", name: T("Valle del Drâa", "Draa Valley", "Vallée du Drâa"), imgs: OASIS, aliases: ["valle del draa", "draa valley", "vallee du draa", "del draa", "du draa"] },
  { id: "zagora", name: T("Zagora", "Zagora", "Zagora"), imgs: DESERT, aliases: ["zagora"] },

  /* ---------------- EXPERIENCES & ACTIVITIES ---------------- */
  { id: "dakar", name: T("Pista del Dakar", "Dakar Rally Track", "Piste du Dakar"), imgs: ROCKY, aliases: ["rally dakar", "rallye dakar", "dakar", "pistas", "piste"] },
  { id: "poblados", name: T("Poblados del desierto", "Desert Villages", "Villages du désert"), imgs: VILLAGE, aliases: ["poblados", "villages", "pueblos del desierto"] },
  { id: "nomadas", name: T("Nómadas del desierto", "Desert Nomads", "Nomades du désert"), imgs: CAMELS, aliases: ["nomadas", "nomades", "nomads"] },
  { id: "fosiles", name: T("Canteras de Fósiles Marinos", "Marine Fossil Quarries", "Carrières de Fossiles Marins"), imgs: ROCKY, aliases: ["canteras de fosiles", "fosiles marinos", "fossiles marins", "marine fossil", "fossil quarr", "yacimientos de fosiles", "fosiles de erfoud"] },
  { id: "picnic", name: T("Picnic", "Picnic", "Pique-nique"), imgs: OASIS, aliases: ["picnic", "pique-nique", "pique nique"] },
  { id: "oasis", name: T("Oasis", "Oasis", "Oasis"), imgs: OASIS, aliases: ["oasis"] },
  { id: "todoterreno", name: T("Ruta en 4x4", "4x4 Drive", "Route en 4x4"), imgs: ROCKY, aliases: ["4x4", "todoterreno", "tout-terrain"] },
  { id: "dromedarios", name: T("Dromedarios", "Camels", "Dromadaires"), imgs: CAMELS, aliases: ["dromedarios", "dromedario", "dromadaire", "camellos", "camels", "camel"] },
  { id: "puestasol", name: T("Puesta de sol", "Sunset", "Coucher de soleil"), imgs: SUNSET, aliases: ["puesta de sol", "atardecer", "coucher de soleil", "sunset"] },
  { id: "amanecer", name: T("Amanecer en el desierto", "Desert Sunrise", "Lever du soleil au désert"), imgs: SUNSET, aliases: ["amanecer", "salida del sol", "lever de soleil", "lever du soleil", "sunrise", "cita con el amanecer"] },
  { id: "estrellas", name: T("Noche bajo las estrellas", "Night Under the Stars", "Nuit sous les étoiles"), imgs: DESERT, aliases: ["bajo las estrellas", "sous les etoiles", "under the stars", "estrellas"] },
  { id: "bivouac", name: T("Bivouac", "Bivouac", "Bivouac"), imgs: [I.camelCaravan, I.dunes, I.camelDunes], aliases: ["bivouac", "vivac", "haimas", "jaimas", "haima", "jaima"] },
  { id: "gnawa", name: T("Música Gnawa", "Gnawa Music", "Musique Gnawa"), imgs: MEDINA, aliases: ["gnawa", "gnaoua"] },
  { id: "te", name: T("Té a la menta", "Mint Tea", "Thé à la menthe"), imgs: RIAD, aliases: ["te a la menta", "the a la menthe", "mint tea", "te tradicional", "te beduino"] },
  { id: "hammam", name: T("Hammam", "Hammam", "Hammam"), imgs: RIAD, aliases: ["hammam", "hamman"] },
  { id: "piscina", name: T("Piscina", "Pool", "Piscine"), imgs: RIAD, aliases: ["piscina", "piscine", "pool"] },
  { id: "quads", name: T("Quads", "Quad Biking", "Quads"), imgs: ROCKY, aliases: ["quads", "quad"] },
  { id: "zocos", name: T("Zocos", "Souks", "Souks"), imgs: MARKET, aliases: ["zoco", "zocos", "souk", "souks"] },
  { id: "artesania", name: T("Artesanía", "Craftsmanship", "Artisanat"), imgs: [I.marketBaskets, I.medinaPeople], aliases: ["tejedores", "alfombras", "artesania", "artesanos", "babuchas", "babouches", "tintoreros", "joyeros", "artisan"] },
  { id: "farmacia", name: T("Farmacia bereber", "Berber Pharmacy", "Pharmacie berbère"), imgs: [I.marketBaskets], aliases: ["farmacia bereber", "pharmacie berbere", "berber pharmacy"] },
  { id: "mercado", name: T("Mercado", "Market", "Marché"), imgs: MARKET, aliases: ["mercado", "marche", "market"] },
  { id: "mirador", name: T("Mirador", "Viewpoint", "Mirador"), imgs: [I.atlasMisty, I.dunesRocky], aliases: ["mirador", "viewpoint"] },
  { id: "senderismo", name: T("Senderismo", "Trekking", "Randonnée"), imgs: ATLAS, aliases: ["senderismo", "trekking", "randonnee", "caminata", "caminaremos", "caminar"] },
  { id: "medina", name: T("Medina", "Medina", "Médina"), imgs: MEDINA, aliases: ["medina"] },
  { id: "kasbah", name: T("Kasbah", "Kasbah", "Kasbah"), imgs: KASBAH, aliases: ["kasbah", "ksar"] },
  { id: "palmeral", name: T("Palmeral", "Palm Grove", "Palmeraie"), imgs: OASIS, aliases: ["palmeral", "palmeraie", "palm grove"] },
];

/* ---- Hotels & bivouac proper names (named lodging in text) ----
   Matched with priority so the specific lodging caption wins over
   the generic "Bivouac" / "Hammam" entries. */
const LODGING = [
  { id: "lodge-xaluca-dades", name: T("Hotel Xaluca Dades", "Hotel Xaluca Dades", "Hôtel Xaluca Dadès"), imgs: RIAD, aliases: ["xaluca dades", "hotel xaluca dades"] },
  { id: "lodge-kasbah-xaluca", name: T("Kasbah Hotel Xaluca", "Kasbah Hotel Xaluca", "Kasbah Hôtel Xaluca"), imgs: KASBAH.concat(RIAD), aliases: ["kasbah hotel xaluca", "kasbah xaluca"] },
  { id: "lodge-tombouctou", name: T("Kasbah Hotel Tombouctou", "Kasbah Hotel Tombouctou", "Kasbah Hôtel Tombouctou"), imgs: KASBAH.concat(RIAD), aliases: ["kasbah hotel tombouctou", "hotel tombouctou", "tombouctou"] },
  { id: "lodge-bivouac-luxe", name: T("Bivouac de Luxe", "Luxury Bivouac", "Bivouac de Luxe"), imgs: [I.camelCaravan, I.dunes], aliases: ["bivouac de luxe", "bivouac de luxue"] },
  { id: "lodge-belle-etoile", name: T("Bivouac La Belle Étoile", "Bivouac La Belle Étoile", "Bivouac La Belle Étoile"), imgs: [I.camelCaravan, I.dunes], aliases: ["belle etoile", "la belle etoile"] },
];

/* Full match set: lodging first so a proper-named camp beats generic. */
const ALL_ENTRIES = [...LODGING, ...NARRATIVE_LEXICON];

/* Find the first occurrence index of any alias of an entry. */
const firstIndex = (text, aliases) => {
  let best = -1;
  let flightOnly = true;
  for (const alias of aliases) {
    const rx = new RegExp(`(^|[^a-z0-9])${escapeRx(alias)}([^a-z0-9]|$)`, "g");
    let m;
    while ((m = rx.exec(text)) !== null) {
      const idx = m.index + m[1].length;
      if (best === -1 || idx < best) best = idx;
      if (!isFlightContext(text, idx)) flightOnly = false;
      if (rx.lastIndex <= m.index) rx.lastIndex = m.index + 1;
    }
  }
  return { best, flightOnly };
};

/**
 * Build the day's narrative gallery (exactly 10 images, ordered).
 * @param {object} day  – program day with trilingual `title` + `body`.
 * @returns {Array<{src,caption,kind}>}
 */
export const buildDayNarrativeGallery = (day) => {
  if (!day) return [];
  const titleEs = (day.title && day.title.es) || "";
  const bodyEs = (day.body && day.body.es) || "";
  // Order is driven by the day's narrative BODY (the real chronological
  // sequence). The title is only a fallback when no body text exists.
  const text = norm(bodyEs.trim() ? bodyEs : titleEs);
  if (!text.trim()) return [];

  // 1) Collect every explicitly-named point with its first index.
  const found = [];
  for (const e of ALL_ENTRIES) {
    const { best, flightOnly } = firstIndex(text, e.aliases);
    if (best === -1) continue;
    if (e.hub && flightOnly) continue; // transit-only city (flight context) → skip
    found.push({ entry: e, index: best });
  }

  // 2) De-overlap: when a lodging proper-name and a generic entry occupy the
  //    same position, the lodging (listed first, lower array order) wins. We
  //    keep all distinct ids but drop a generic "bivouac"/"hammam" if a more
  //    specific lodging at a near position exists.
  const hasLodgingNear = (genericId, idx) =>
    found.some((f) => f.entry.id.startsWith("lodge-") && Math.abs(f.index - idx) < 40 &&
      ((genericId === "bivouac" && f.entry.id.includes("bivouac")) ||
       (genericId === "bivouac" && f.entry.id.includes("etoile"))));
  const filtered = found.filter((f) => {
    if (f.entry.id === "bivouac" && hasLodgingNear("bivouac", f.index)) return false;
    return true;
  });

  // 3) Order chronologically by appearance in the text.
  filtered.sort((a, b) => a.index - b.index);

  if (filtered.length === 0) return [];

  // 4) Materialise into image cells, padding/repeating to exactly 10.
  const usage = new Map(); // id -> how many times used (for image rotation)
  const cell = (entry) => {
    const n = usage.get(entry.id) || 0;
    usage.set(entry.id, n + 1);
    const imgs = entry.imgs && entry.imgs.length ? entry.imgs : DESERT;
    return { src: imgs[n % imgs.length], caption: entry.name, kind: entry.kind || "ruta" };
  };

  const ordered = filtered.map((f) => f.entry);
  const cells = [];

  if (ordered.length >= 10) {
    for (let i = 0; i < 10; i++) cells.push(cell(ordered[i]));
  } else {
    // First pass: one image per named point (chronological).
    for (const e of ordered) cells.push(cell(e));
    // Fill remaining slots by repeating points in order (distributed),
    // each repeat using the point's next alternative image.
    let i = 0;
    while (cells.length < 10) {
      cells.push(cell(ordered[i % ordered.length]));
      i++;
    }
  }

  return cells.slice(0, 10);
};

export default buildDayNarrativeGallery;
