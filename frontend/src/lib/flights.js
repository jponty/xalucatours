/* ============================================================
   flights.js
   ------------------------------------------------------------
   Conexiones aéreas España ↔ Marruecos para la página /vuelos.

   Estructura DRY y fácilmente ampliable:
   - MOROCCO_DESTINATIONS: catálogo único de destinos marroquíes.
   - SPAIN_ORIGINS: ciudades de salida españolas (código IATA).
   - FLIGHT_ORIGINS se genera combinando ambos; la URL de
     FlightConnections sigue el patrón
       vuelos-desde-{origen}-a-{destino}   (códigos IATA en minúscula)

   Para ampliar:
   · Nuevo destino  → añade un objeto a MOROCCO_DESTINATIONS.
   · Nuevo origen   → añade un objeto a SPAIN_ORIGINS.
============================================================ */

export const MOROCCO_DESTINATIONS = [
  {
    id: "fez", code: "FEZ",
    city: { es: "Fez", en: "Fez", fr: "Fès" },
    airport: { es: "Aeropuerto de Fez-Saiss", en: "Fès–Saïss Airport", fr: "Aéroport de Fès-Saïss" },
    desc: {
      es: "Capital espiritual y cultural de Marruecos, hogar de la medina medieval más viva del mundo.",
      en: "Morocco's spiritual and cultural capital, home to the world's liveliest medieval medina.",
      fr: "Capitale spirituelle et culturelle du Maroc, abritant la médina médiévale la plus vivante du monde.",
    },
  },
  {
    id: "rak", code: "RAK",
    city: { es: "Marrakech", en: "Marrakesh", fr: "Marrakech" },
    airport: { es: "Aeropuerto de Marrakech-Menara", en: "Marrakesh Menara Airport", fr: "Aéroport de Marrakech-Ménara" },
    desc: {
      es: "La ciudad roja: zocos, palacios, jardines y la mítica plaza Jemaa el-Fna.",
      en: "The red city: souks, palaces, gardens and the legendary Jemaa el-Fnaa square.",
      fr: "La ville rouge : souks, palais, jardins et la mythique place Jemaa el-Fna.",
    },
  },
  {
    id: "rba", code: "RBA",
    city: { es: "Rabat", en: "Rabat", fr: "Rabat" },
    airport: { es: "Aeropuerto de Rabat-Salé", en: "Rabat–Salé Airport", fr: "Aéroport de Rabat-Salé" },
    desc: {
      es: "La capital del Reino, entre la kasbah de los Oudayas, la Torre Hassan y el Atlántico.",
      en: "The Kingdom's capital, between the Kasbah of the Udayas, the Hassan Tower and the Atlantic.",
      fr: "La capitale du Royaume, entre la kasbah des Oudayas, la tour Hassan et l'Atlantique.",
    },
  },
  {
    id: "tng", code: "TNG",
    city: { es: "Tánger", en: "Tangier", fr: "Tanger" },
    airport: { es: "Aeropuerto de Tánger-Ibn Battouta", en: "Tangier Ibn Battuta Airport", fr: "Aéroport de Tanger-Ibn Battouta" },
    desc: {
      es: "La puerta del estrecho de Gibraltar, cruce único entre el Mediterráneo y el Atlántico.",
      en: "The gateway to the Strait of Gibraltar, a unique crossroads between Mediterranean and Atlantic.",
      fr: "La porte du détroit de Gibraltar, carrefour unique entre Méditerranée et Atlantique.",
    },
  },
  {
    id: "erh", code: "ERH",
    city: { es: "Errachidia", en: "Errachidia", fr: "Errachidia" },
    airport: { es: "Aeropuerto de Errachidia-Moulay Ali Cherif", en: "Moulay Ali Cherif Airport", fr: "Aéroport d'Errachidia-Moulay Ali Cherif" },
    desc: {
      es: "Puerta del sureste sahariano y acceso natural a las dunas del Erg Chebbi.",
      en: "Gateway to the Saharan southeast and the natural access to the dunes of Erg Chebbi.",
      fr: "Porte du sud-est saharien et accès naturel aux dunes de l'Erg Chebbi.",
    },
  },
  {
    id: "cmn", code: "CMN",
    city: { es: "Casablanca", en: "Casablanca", fr: "Casablanca" },
    airport: { es: "Aeropuerto Mohammed V", en: "Mohammed V International Airport", fr: "Aéroport Mohammed V" },
    desc: {
      es: "La capital económica del país: patrimonio Art Déco y la monumental Mezquita Hassan II frente al Atlántico.",
      en: "The country's economic capital: Art Deco heritage and the monumental Hassan II Mosque facing the Atlantic.",
      fr: "La capitale économique du pays : patrimoine Art déco et la monumentale mosquée Hassan II face à l'Atlantique.",
    },
  },
  {
    id: "aga", code: "AGA",
    city: { es: "Agadir", en: "Agadir", fr: "Agadir" },
    airport: { es: "Aeropuerto de Agadir-Al Massira", en: "Agadir–Al Massira Airport", fr: "Aéroport d'Agadir-Al Massira" },
    desc: {
      es: "Sol y playa en la costa atlántica del sur, puerta de entrada al Souss y al valle del Paraíso.",
      en: "Sun and beach on the southern Atlantic coast, gateway to the Souss and Paradise Valley.",
      fr: "Soleil et plage sur la côte atlantique du sud, porte d'entrée du Souss et de la vallée du Paradis.",
    },
  },
  {
    id: "ozz", code: "OZZ",
    city: { es: "Ouarzazate", en: "Ouarzazate", fr: "Ouarzazate" },
    airport: { es: "Aeropuerto de Ouarzazate", en: "Ouarzazate Airport", fr: "Aéroport de Ouarzazate" },
    desc: {
      es: "La «puerta del desierto» y capital del cine, base para las kasbahs, Aït Benhaddou y el valle del Drâa.",
      en: "The 'gateway to the desert' and film capital, base for the kasbahs, Aït Benhaddou and the Drâa valley.",
      fr: "La « porte du désert » et capitale du cinéma, base pour les kasbahs, Aït Benhaddou et la vallée du Drâa.",
    },
  },
  {
    id: "ndr", code: "NDR",
    city: { es: "Nador", en: "Nador", fr: "Nador" },
    airport: { es: "Aeropuerto de Nador-El Aroui", en: "Nador El Aroui International Airport", fr: "Aéroport de Nador-El Aroui" },
    desc: {
      es: "Ciudad mediterránea del noreste, junto a la laguna de Marchica y las playas del Rif oriental.",
      en: "Mediterranean city of the northeast, beside the Marchica lagoon and the beaches of the eastern Rif.",
      fr: "Ville méditerranéenne du nord-est, au bord de la lagune de Marchica et des plages du Rif oriental.",
    },
  },
  {
    id: "oud", code: "OUD",
    city: { es: "Oujda", en: "Oujda", fr: "Oujda" },
    airport: { es: "Aeropuerto de Oujda-Angads", en: "Oujda Angads Airport", fr: "Aéroport d'Oujda-Angads" },
    desc: {
      es: "La gran ciudad del este, cruce de culturas junto a la frontera argelina y la región oriental.",
      en: "The great eastern city, a crossroads of cultures by the Algerian border and the Oriental region.",
      fr: "La grande ville de l'est, carrefour de cultures près de la frontière algérienne et de l'Oriental.",
    },
  },
  {
    id: "ttu", code: "TTU",
    city: { es: "Tetuán", en: "Tetouan", fr: "Tétouan" },
    airport: { es: "Aeropuerto de Tetuán-Saniat R'mel", en: "Tétouan Saniat R'mel Airport", fr: "Aéroport de Tétouan-Saniat R'mel" },
    desc: {
      es: "La «paloma blanca» del norte, con su medina andalusí Patrimonio de la Humanidad junto al Mediterráneo.",
      en: "The northern 'white dove', with its UNESCO-listed Andalusian medina beside the Mediterranean.",
      fr: "La « colombe blanche » du nord, avec sa médina andalouse classée à l'UNESCO au bord de la Méditerranée.",
    },
  },
  {
    id: "vil", code: "VIL",
    city: { es: "Dajla", en: "Dakhla", fr: "Dakhla" },
    airport: { es: "Aeropuerto de Dajla", en: "Dakhla Airport", fr: "Aéroport de Dakhla" },
    desc: {
      es: "Paraíso del Sáhara atlántico, spot mundial de kitesurf entre laguna turquesa y dunas infinitas.",
      en: "An Atlantic Sahara paradise, a world kitesurf spot between a turquoise lagoon and endless dunes.",
      fr: "Paradis du Sahara atlantique, spot mondial de kitesurf entre lagune turquoise et dunes infinies.",
    },
  },
];

export const SPAIN_ORIGINS = [
  { id: "bcn", code: "BCN", city: { es: "Barcelona", en: "Barcelona", fr: "Barcelone" } },
  { id: "mad", code: "MAD", city: { es: "Madrid", en: "Madrid", fr: "Madrid" } },
  { id: "agp", code: "AGP", city: { es: "Málaga", en: "Málaga", fr: "Malaga" } },
  { id: "vlc", code: "VLC", city: { es: "Valencia", en: "Valencia", fr: "Valence" } },
  { id: "svq", code: "SVQ", city: { es: "Sevilla", en: "Seville", fr: "Séville" } },
  { id: "bio", code: "BIO", city: { es: "Bilbao", en: "Bilbao", fr: "Bilbao" } },
  { id: "alc", code: "ALC", city: { es: "Alicante", en: "Alicante", fr: "Alicante" } },
  { id: "pmi", code: "PMI", city: { es: "Palma de Mallorca", en: "Palma de Mallorca", fr: "Palma de Majorque" } },
];

const fcUrl = (originCode, destCode) =>
  `https://www.flightconnections.com/es/vuelos-desde-${originCode.toLowerCase()}-a-${destCode.toLowerCase()}`;

/* Generated origin → destinations list consumed by the page. */
export const FLIGHT_ORIGINS = SPAIN_ORIGINS.map((origin) => ({
  ...origin,
  destinations: MOROCCO_DESTINATIONS.map((dest) => ({
    ...dest,
    url: fcUrl(origin.code, dest.code),
  })),
}));
