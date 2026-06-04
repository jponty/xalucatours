/* ============================================================
   poiZones.js
   ----
   Geographic zoning for every "punto destacado" (landmark / POI) used by
   the /galeria page. Each catalog record (curated landmark id OR gazetteer
   poiKey) is mapped to one Moroccan tourist zone so the gallery can group
   them by region and sort alphabetically within each zone.

   The mapping is keyed by the catalog record `id`:
     - curated landmarks → their landmark id (e.g. "hassi-labied")
     - gazetteer places  → their poiKey (e.g. "chebbi", "marrakech")
   Both the gazetteer original id and its profileKey are included where they
   differ, so lookups never miss. Anything unmapped falls into "otros".
============================================================ */

const T = (es, en, fr) => ({ es, en, fr });

/* Ordered list of zones (drives section order on the page). */
export const ZONES = [
  { id: "norte",      label: T("Norte y Rif", "North & Rif", "Nord et Rif") },
  { id: "costa",      label: T("Costa Atlántica", "Atlantic Coast", "Côte Atlantique") },
  { id: "imperiales", label: T("Ciudades Imperiales y Atlas Medio", "Imperial Cities & Middle Atlas", "Villes Impériales et Moyen Atlas") },
  { id: "marrakech",  label: T("Marrakech y Alto Atlas", "Marrakech & High Atlas", "Marrakech et Haut Atlas") },
  { id: "ouarzazate", label: T("Ouarzazate, Kasbahs y Valle del Dadès", "Ouarzazate, Kasbahs & Dadès Valley", "Ouarzazate, Kasbahs et Vallée du Dadès") },
  { id: "sahara",     label: T("Sáhara y Tafilalet", "Sahara & Tafilalet", "Sahara et Tafilalet") },
  { id: "antiatlas",  label: T("Anti-Atlas y Saghro", "Anti-Atlas & Saghro", "Anti-Atlas et Saghro") },
  { id: "otros",      label: T("Otros lugares", "Other places", "Autres lieux") },
];

/* id / poiKey → zone id */
export const ZONE_OF = {
  // ---- Norte y Rif ----
  tanger: "norte", tetuan: "norte", asilah: "norte", chefchaouen: "norte",
  akchour: "norte", rif: "norte", cabospartel: "norte", grutashercules: "norte",
  mdiq: "norte", "medina-asilah": "norte", "medina-tetuan": "norte",
  "murallas-asilah": "norte", "uta-hammam": "norte", "ras-el-maa": "norte",
  "monumentos-aleman": "norte",

  // ---- Costa Atlántica ----
  rabat: "costa", casablanca: "costa", essaouira: "costa", chellah: "costa",
  "hassan2-mosque": "costa", oudayas: "costa", "torre-hassan": "costa",
  "mausoleo-mohammed-v": "costa", "medina-essaouira": "costa",
  "murallas-essaouira": "costa", "skala-essaouira": "costa",
  "puerto-essaouira": "costa", "playa-essaouira": "costa",
  "islas-purpurarias": "costa",

  // ---- Ciudades Imperiales y Atlas Medio ----
  fez: "imperiales", meknes: "imperiales", volubilis: "imperiales",
  moulayidriss: "imperiales", ifrane: "imperiales", midelt: "imperiales",
  sidiali: "imperiales", azrou: "imperiales", "cedros-atlas": "imperiales",
  khenifra: "imperiales", "parque-khenifra": "imperiales", "beni-mellal": "imperiales",
  "medina-fez": "imperiales", chouara: "imperiales", qarawiyyin: "imperiales",
  "bab-al-mansour": "imperiales", "heri-es-souani": "imperiales",
  "habs-qara": "imperiales", "moulay-ismail-mausoleo": "imperiales",

  // ---- Marrakech y Alto Atlas ----
  marrakech: "marrakech", agafay: "marrakech", imlil: "marrakech",
  toubkal: "marrakech", atlas: "marrakech", altoatlas: "marrakech",
  ouzoud: "marrakech", mgoun: "marrakech", "gargantas-mgoun": "marrakech",
  "tizi-ntichka": "marrakech", "jemaa-el-fna": "marrakech", koutoubia: "marrakech",
  majorelle: "marrakech", "bahia-palace": "marrakech", "medina-marrakech": "marrakech",
  "zocos-marrakech": "marrakech", "farmacia-bereber": "marrakech",

  // ---- Ouarzazate, Kasbahs y Valle del Dadès ----
  ouarzazate: "ouarzazate", aitben: "ouarzazate", skoura: "ouarzazate",
  boumalne: "ouarzazate", boutaghrar: "ouarzazate", tinerhir: "ouarzazate",
  todra: "ouarzazate", dades: "ouarzazate", dadesgorges: "ouarzazate",
  rosevalley: "ouarzazate", draa: "ouarzazate", draavalley: "ouarzazate",
  zagora: "ouarzazate", "atlas-studios": "ouarzazate", "kasbah-taourirt": "ouarzazate",
  "kasbah-meteorite": "ouarzazate", "mirador-dades": "ouarzazate",
  "valle-dades": "ouarzazate", "gorges-todra": "ouarzazate", "tinerhir-palm": "ouarzazate",
  "xaluca-dades": "ouarzazate",

  // ---- Sáhara y Tafilalet ----
  erfoud: "sahara", errachidia: "sahara", rissani: "sahara", merzouga: "sahara",
  ergchebbi: "sahara", chebbi: "sahara", khamlia: "sahara", merdani: "sahara",
  zizvalley: "sahara", ziz: "sahara", fossils: "sahara", kemkem: "sahara",
  "valle-ziz": "sahara", "mirador-ziz": "sahara", "hassi-labied": "sahara",
  khettaras: "sahara", "des-dunes": "sahara", "erg-chebbi-duna": "sahara",
  "sunrise-dune": "sahara", "oasis-picnic": "sahara", "rissani-mercado": "sahara",
  "mercado-rissani": "sahara", "khamlia-gnawa": "sahara", "canteras-fosiles": "sahara",
  "erfoud-fossils": "sahara", "dakar-tracks": "sahara", "errachidia-airport": "sahara",
  "kasbah-xaluca": "sahara", "kasbah-xaluca-erfoud": "sahara",
  "kasbah-tombouctou": "sahara", "bivouac-luxe": "sahara",
  "chott-merzouga": "sahara", "chott-maider": "sahara", fezzou: "sahara",
  "oasis-fezzou": "sahara", "minas-mfis": "sahara", "pozos-jorf": "sahara",
  "oued-remlia": "sahara", ouzina: "sahara",

  // ---- Anti-Atlas y Saghro ----
  antiatlas: "antiatlas", saghro: "antiatlas", nkob: "antiatlas",
  tafraoute: "antiatlas", aknioun: "antiatlas", amskar: "antiatlas",
  tisserdimine: "antiatlas", rekam: "antiatlas",
};

/* Coordinate fallback for any unmapped record — keeps the gallery exhaustive
   without orphans. Rough latitude/longitude buckets for Morocco. */
const zoneByCoord = (lat, lng) => {
  if (typeof lat !== "number" || typeof lng !== "number") return "otros";
  if (lat >= 34.8) return "norte";
  if (lat >= 33.0 && lng <= -6.7) return "costa";        // Rabat/Casa belt
  if (lat >= 32.3) return "imperiales";                   // Fez/Meknès/Middle Atlas
  if (lng <= -8.6) return "costa";                        // Essaouira coast
  if (lng <= -3.7 && lat <= 31.4) return "sahara";        // Merzouga/Tafilalet
  if (lat <= 30.6) return "ouarzazate";                   // Drâa / Zagora
  if (lng >= -5.6) return "sahara";
  return "ouarzazate";
};

export const zoneForPoi = (id, lat, lng) =>
  ZONE_OF[id] || zoneByCoord(lat, lng);

export default ZONES;
