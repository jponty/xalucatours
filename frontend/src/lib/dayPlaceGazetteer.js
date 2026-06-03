/* ============================================================
   dayPlaceGazetteer.js
   ----
   Derives the "Puntos de interés del día" (Day Map landmarks)
   EXCLUSIVELY from the day's own itinerary description text.

   Rule (applied globally to every program / itinerary):
     • Only show a place if it is explicitly named in `day.body`
       (the day's narrative description).
     • Never show airports (no airport lives in this gazetteer).
     • Transit-hub cities (e.g. Casablanca) that appear only inside
       a flight / connection context are NOT shown — they are not
       part of the ground route actually travelled that day. The
       same city IS shown when the text actually visits it (e.g.
       "visita de Casablanca …" with no flight context).

   Each match is geolocated from the gazetteer below and (when a
   matching CITY_PROFILES entry exists) enriched with its trilingual
   blurb + 3-card gallery, so the rich Tier-1 map experience renders
   consistently on every page.
============================================================ */
import { CITY_PROFILES } from "@/lib/cityProfiles";
import { buildPlaceGallery, ALIAS_PROFILE } from "@/lib/placeGalleries";
import { EXTRA_POIS } from "@/lib/extraPois";
import { EXTRA_POI_IMAGES } from "@/lib/extraPoiImages";

const T = (es, en, fr) => ({ es, en, fr });

/* Accent-insensitive, lowercase normaliser. */
const norm = (s) =>
  (s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

const escapeRx = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/* Words that signal a place is only a flight / connection mention. */
const FLIGHT_WORDS = [
  "aeropuerto", "aeroport", "airport", "vuelo", "vuelos", "vol ", "flight",
  "conexion", "connection", "correspondance", "enlace", "escala", "layover",
];
const FLIGHT_WINDOW = 55;

const isFlightContext = (text, idx) => {
  const from = Math.max(0, idx - FLIGHT_WINDOW);
  const window = text.slice(from, idx + FLIGHT_WINDOW);
  return FLIGHT_WORDS.some((w) => window.includes(w));
};

/* ---- The gazetteer -----------------------------------------
   { id, kind, name, lat, lng, aliases[], profileKey?, hub?, blurb? }
   aliases are pre-normalised (lowercase, no accents).            */
export const GAZETTEER = [
  // ---- North & coast (towns) ----
  { id: "tanger", kind: "town", name: T("Tánger", "Tangier", "Tanger"), lat: 35.7595, lng: -5.8340, profileKey: "tanger", aliases: ["tanger"] },
  { id: "tetuan", kind: "town", name: T("Tetuán", "Tetouan", "Tétouan"), lat: 35.5784, lng: -5.3683, profileKey: "tetuan", aliases: ["tetuan", "tetouan"] },
  { id: "asilah", kind: "town", name: T("Asilah", "Asilah", "Asilah"), lat: 35.4658, lng: -6.0349, profileKey: "asilah", aliases: ["asilah"] },
  { id: "chefchaouen", kind: "town", name: T("Chefchaouen", "Chefchaouen", "Chefchaouen"), lat: 35.1716, lng: -5.2696, profileKey: "chefchaouen", aliases: ["chefchaouen", "chaouen"] },
  { id: "rabat", kind: "town", name: T("Rabat", "Rabat", "Rabat"), lat: 34.0209, lng: -6.8416, profileKey: "rabat", aliases: ["rabat"] },
  { id: "casablanca", kind: "town", name: T("Casablanca", "Casablanca", "Casablanca"), lat: 33.5731, lng: -7.5898, profileKey: "casablanca", hub: true, aliases: ["casablanca"] },

  // ---- Imperial & Middle Atlas ----
  { id: "fez", kind: "town", name: T("Fez", "Fez", "Fès"), lat: 34.0331, lng: -5.0003, profileKey: "fez", aliases: ["fez", "fes", "fes-el bali", "fez-el bali"] },
  { id: "meknes", kind: "town", name: T("Meknès", "Meknes", "Meknès"), lat: 33.8935, lng: -5.5547, profileKey: "meknes", aliases: ["meknes"] },
  { id: "volubilis", kind: "site", name: T("Volubilis", "Volubilis", "Volubilis"), lat: 34.0731, lng: -5.5556, profileKey: "volubilis", aliases: ["volubilis"] },
  { id: "moulayidriss", kind: "town", name: T("Moulay Idriss", "Moulay Idriss", "Moulay Idriss"), lat: 34.0547, lng: -5.5225, aliases: ["moulay idriss"] },
  { id: "ifrane", kind: "town", name: T("Ifrane", "Ifrane", "Ifrane"), lat: 33.5228, lng: -5.1106, profileKey: "ifrane", aliases: ["ifrane"] },
  { id: "midelt", kind: "town", name: T("Midelt", "Midelt", "Midelt"), lat: 32.6852, lng: -4.7450, aliases: ["midelt"] },

  // ---- Marrakech zone ----
  { id: "marrakech", kind: "town", name: T("Marrakech", "Marrakech", "Marrakech"), lat: 31.6295, lng: -7.9811, profileKey: "marrakech", aliases: ["marrakech"] },
  { id: "essaouira", kind: "town", name: T("Essaouira", "Essaouira", "Essaouira"), lat: 31.5125, lng: -9.7700, profileKey: "essaouira", aliases: ["essaouira"] },
  { id: "agafay", kind: "dunes", name: T("Desierto de Agafay", "Agafay desert", "Désert d'Agafay"), lat: 31.3500, lng: -8.1500, profileKey: "agafay", aliases: ["agafay"] },
  { id: "imlil", kind: "village", name: T("Imlil", "Imlil", "Imlil"), lat: 31.1395, lng: -7.9211, aliases: ["imlil"] },
  { id: "ouzoud", kind: "viewpoint", name: T("Cascadas de Ouzoud", "Ouzoud Waterfalls", "Cascades d'Ouzoud"), lat: 32.0155, lng: -6.7197, aliases: ["ouzoud"] },

  // ---- High Atlas & ranges ----
  { id: "altoatlas", kind: "mountain", name: T("Cordillera del Alto Atlas", "High Atlas range", "Chaîne du Haut Atlas"), lat: 31.4000, lng: -6.5000, aliases: ["alto atlas", "haut atlas", "high atlas"] },
  { id: "antiatlas", kind: "mountain", name: T("Anti-Atlas", "Anti-Atlas", "Anti-Atlas"), lat: 29.9000, lng: -8.5000, aliases: ["anti-atlas", "anti atlas"] },
  { id: "toubkal", kind: "mountain", name: T("Monte Toubkal", "Mount Toubkal", "Mont Toubkal"), lat: 31.0633, lng: -7.9097, aliases: ["toubkal"] },
  { id: "mgoun", kind: "mountain", name: T("Macizo del M'Goun", "M'Goun massif", "Massif du M'Goun"), lat: 31.5172, lng: -6.4144, aliases: ["mgoun", "m'goun", "m goun"] },
  { id: "rif", kind: "mountain", name: T("Montañas del Rif", "Rif Mountains", "Montagnes du Rif"), lat: 35.1000, lng: -4.9000, aliases: ["rif"] },

  // ---- Ouarzazate axis ----
  { id: "ouarzazate", kind: "town", name: T("Ouarzazate", "Ouarzazate", "Ouarzazate"), lat: 30.9189, lng: -6.8934, profileKey: "ouarzazate", aliases: ["ouarzazate"] },
  { id: "aitben", kind: "kasbah", name: T("Aït Ben Haddou", "Aït Ben Haddou", "Aït Ben Haddou"), lat: 31.0470, lng: -7.1295, profileKey: "aitben", aliases: ["ait ben haddou", "ait benhaddou", "aitbenhaddou"] },
  { id: "skoura", kind: "palm", name: T("Palmeral de Skoura", "Skoura palm grove", "Palmeraie de Skoura"), lat: 31.0612, lng: -6.5544, profileKey: "skoura", aliases: ["skoura"] },
  { id: "boumalne", kind: "town", name: T("Boumalne Dades", "Boumalne Dades", "Boumalne Dadès"), lat: 31.3580, lng: -5.9870, aliases: ["boumalne"] },
  { id: "boutaghrar", kind: "village", name: T("Boutaghrar", "Boutaghrar", "Boutaghrar"), lat: 31.5230, lng: -6.0440, aliases: ["boutaghrar"] },
  { id: "tinerhir", kind: "town", name: T("Tinerhir", "Tinerhir", "Tinerhir"), lat: 31.5147, lng: -5.5331, aliases: ["tinerhir", "tineghir"] },
  { id: "todra", kind: "gorges", name: T("Gargantas del Todra", "Todra Gorges", "Gorges du Todra"), lat: 31.5847, lng: -5.5894, profileKey: "todra", aliases: ["todra"] },
  { id: "dadesgorges", kind: "gorges", name: T("Gargantas del Dadès", "Dades Gorges", "Gorges du Dadès"), lat: 31.4900, lng: -5.9050, aliases: ["gargantas del dades", "gorges du dades", "dades gorges", "dades gorge"] },
  { id: "rosevalley", kind: "valley", name: T("Valle de las Rosas", "Rose Valley", "Vallée des Roses"), lat: 31.2400, lng: -6.2300, aliases: ["valle de las rosas", "vallee des roses", "rose valley", "valle de la rosa"] },

  // ---- Sahara / Tafilalet axis ----
  { id: "erfoud", kind: "town", name: T("Erfoud", "Erfoud", "Erfoud"), lat: 31.4358, lng: -4.2380, profileKey: "erfoud", aliases: ["erfoud"] },
  { id: "errachidia", kind: "town", name: T("Errachidia", "Errachidia", "Errachidia"), lat: 31.9314, lng: -4.4244, profileKey: "errachidia", aliases: ["errachidia"] },
  { id: "rissani", kind: "market", name: T("Rissani", "Rissani", "Rissani"), lat: 31.2820, lng: -4.2620, profileKey: "rissani", aliases: ["rissani"] },
  { id: "merzouga", kind: "town", name: T("Merzouga", "Merzouga", "Merzouga"), lat: 31.0992, lng: -4.0136, aliases: ["merzouga"] },
  { id: "ergchebbi", kind: "dunes", name: T("Erg Chebbi", "Erg Chebbi", "Erg Chebbi"), lat: 31.1100, lng: -3.9700, profileKey: "chebbi", aliases: ["erg chebbi", "chebbi"] },
  { id: "khamlia", kind: "music", name: T("Khamlia", "Khamlia", "Khamlia"), lat: 31.0470, lng: -3.9750, profileKey: "khamlia", aliases: ["khamlia"] },
  { id: "merdani", kind: "village", name: T("Merdani", "Merdani", "Merdani"), lat: 31.1900, lng: -3.9300, profileKey: "merdani", aliases: ["merdani"] },
  { id: "zizvalley", kind: "valley", name: T("Valle del Ziz", "Ziz Valley", "Vallée du Ziz"), lat: 31.6500, lng: -4.3500, aliases: ["valle del ziz", "vallee du ziz", "ziz valley"] },
  { id: "fossils", kind: "fossils", name: T("Canteras de fósiles marinos", "Marine fossil quarries", "Carrières de fossiles marins"), lat: 31.3500, lng: -4.1900, aliases: ["canteras de fosiles", "fossil", "fosiles marinos", "fossiles marins", "marine fossil"] },

  // ---- Drâa / Zagora ----
  { id: "draavalley", kind: "valley", name: T("Valle del Drâa", "Draa Valley", "Vallée du Drâa"), lat: 30.4500, lng: -5.8413, aliases: ["valle del draa", "draa valley", "vallee du draa"] },
  { id: "zagora", kind: "town", name: T("Zagora", "Zagora", "Zagora"), lat: 30.3325, lng: -5.8378, aliases: ["zagora"] },

  // ---- Tangier-area sights ----
  { id: "cabospartel", kind: "viewpoint", name: T("Cabo Espartel", "Cape Spartel", "Cap Spartel"), lat: 35.7920, lng: -5.9213, aliases: ["cabo espartel", "cape spartel", "cap spartel"] },
  { id: "grutashercules", kind: "site", name: T("Grutas de Hércules", "Hercules' Caves", "Grottes d'Hercule"), lat: 35.7570, lng: -5.9380, aliases: ["grutas de hercules", "grottes d'hercule", "hercules cave", "hercule"] },

  // ---- Hotels & desert camps (overnight / meal stops named in text) ----
  { id: "xaluca-dades", kind: "hotel", name: T("Hotel Xaluca Dades", "Hotel Xaluca Dades", "Hôtel Xaluca Dadès"), lat: 31.3500, lng: -5.9700,
    blurb: T("Hotel-kasbah a 1.612 m con piscina climatizada, hammam y vistas al Alto Atlas.",
             "Kasbah-hotel at 1,612 m with heated pool, hammam and High Atlas views.",
             "Hôtel-kasbah à 1 612 m, piscine chauffée, hammam et vue sur le Haut Atlas."),
    aliases: ["xaluca dades", "hotel xaluca dades"] },
  { id: "kasbah-xaluca-erfoud", kind: "hotel", name: T("Kasbah Hotel Xaluca", "Kasbah Hotel Xaluca", "Kasbah Hôtel Xaluca"), lat: 31.4358, lng: -4.2300,
    blurb: T("Kasbah-hotel en Erfoud, «la Puerta del Desierto», con piscina, jardines y servicios wellness.",
             "Kasbah-hotel in Erfoud, «the Gateway to the Desert», with pool, gardens and wellness.",
             "Kasbah-hôtel à Erfoud, « la Porte du Désert », piscine, jardins et bien-être."),
    aliases: ["kasbah hotel xaluca", "kasbah xaluca"] },
  { id: "kasbah-tombouctou", kind: "hotel", name: T("Kasbah Hotel Tombouctou", "Kasbah Hotel Tombouctou", "Kasbah Hôtel Tombouctou"), lat: 31.0800, lng: -4.0100,
    blurb: T("Kasbah-hotel a pie de las dunas del Erg Chebbi, con piscina y hammam frente al desierto.",
             "Kasbah-hotel at the foot of the Erg Chebbi dunes, with pool and hammam facing the desert.",
             "Kasbah-hôtel au pied des dunes de l'Erg Chebbi, piscine et hammam face au désert."),
    aliases: ["kasbah hotel tombouctou", "hotel tombouctou", "tombouctou"] },
  { id: "bivouac-luxe", kind: "camp", name: T("Bivouac de Luxe", "Luxury Bivouac", "Bivouac de Luxe"), lat: 31.0900, lng: -3.9700,
    blurb: T("Campamento en haimas en el corazón de las dunas del Erg Chebbi: cena bajo las estrellas.",
             "Jaima camp in the heart of the Erg Chebbi dunes: dinner under the stars.",
             "Campement en jaimas au cœur des dunes de l'Erg Chebbi : dîner sous les étoiles."),
    aliases: ["bivouac de luxe", "bivouac", "haimas", "jaimas"] },
  // New monuments / sub-POIs (coords + aliases) — see extraPois.js.
  ...EXTRA_POIS,
];

const buildLandmark = (entry) => {
  const profile = entry.profileKey && CITY_PROFILES[entry.profileKey];
  const pexels = EXTRA_POI_IMAGES[entry.id];
  const gallery = pexels
    ? pexels.map((src) => ({ src, title: entry.name, description: entry.blurb }))
    : buildPlaceGallery(entry);
  return {
    id: entry.id,
    // Stable, page/language-independent point-of-interest key so the SAME
    // place shares one global CMS record (cards/images/texts) across every
    // trip page. Prefer the CITY_PROFILES key; fall back to the gazetteer id.
    poiKey: entry.profileKey || ALIAS_PROFILE[entry.id] || entry.id,
    lat: entry.lat,
    lng: entry.lng,
    kind: entry.kind,
    name: entry.name || (profile && profile.name),
    blurb: entry.blurb || (profile && profile.blurb) || null,
    // Every POI is guaranteed a 3-card "Galería del lugar" so its drawer
    // always opens — Pexels photos for new POIs, else profile/curated/thematic.
    gallery,
  };
};

/**
 * Derive the Day Map points strictly from the day's description.
 * @param {object} day  – program day with a trilingual `body`.
 * @param {string} lang – active language (es | en | fr).
 * @returns {Array} landmarks ordered by their appearance in the text.
 */
export const deriveDayPlaces = (day, lang = "es") => {
  if (!day || !day.body) return [];
  const raw = day.body[lang] || day.body.es || "";
  if (!raw) return [];
  const text = norm(raw);

  const found = [];
  const seen = new Set();

  for (const g of GAZETTEER) {
    let best = -1;
    let anyMatch = false;
    let flightOnly = true;

    for (const alias of g.aliases) {
      const rx = new RegExp(`(^|[^a-z0-9])${escapeRx(alias)}([^a-z0-9]|$)`, "g");
      let m;
      while ((m = rx.exec(text)) !== null) {
        anyMatch = true;
        const idx = m.index + m[1].length;
        if (best === -1 || idx < best) best = idx;
        if (!isFlightContext(text, idx)) flightOnly = false;
        if (rx.lastIndex <= m.index) rx.lastIndex = m.index + 1;
      }
    }

    if (!anyMatch) continue;
    if (g.hub && flightOnly) continue; // transit-only hub → not part of the route
    if (seen.has(g.id)) continue;
    seen.add(g.id);
    found.push({ entry: g, index: best });
  }

  found.sort((a, b) => a.index - b.index);
  return found.map(({ entry }) => buildLandmark(entry));
};
