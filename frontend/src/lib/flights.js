/* ============================================================
   flights.js
   ------------------------------------------------------------
   Conexiones aéreas España ↔ Marruecos para la página /vuelos.
   Estructura preparada para ampliarse fácilmente:
   - Añade nuevos orígenes (Madrid, Valencia, Málaga, Sevilla,
     Bilbao…) como objetos en FLIGHT_ORIGINS.
   - Añade nuevos destinos dentro de `destinations` de cada origen.
   Enlaces directos a FlightConnections.
============================================================ */

export const FLIGHT_ORIGINS = [
  {
    id: "bcn",
    city: { es: "Barcelona", en: "Barcelona", fr: "Barcelone" },
    code: "BCN",
    airport: {
      es: "Aeropuerto Josep Tarradellas Barcelona-El Prat",
      en: "Josep Tarradellas Barcelona-El Prat Airport",
      fr: "Aéroport Josep Tarradellas Barcelone-El Prat",
    },
    destinations: [
      {
        id: "fez",
        code: "FEZ",
        city: { es: "Fez", en: "Fez", fr: "Fès" },
        airport: { es: "Aeropuerto de Fez-Saiss", en: "Fès–Saïss Airport", fr: "Aéroport de Fès-Saïss" },
        desc: {
          es: "Capital espiritual y cultural de Marruecos, hogar de la medina medieval más viva del mundo.",
          en: "Morocco's spiritual and cultural capital, home to the world's liveliest medieval medina.",
          fr: "Capitale spirituelle et culturelle du Maroc, abritant la médina médiévale la plus vivante du monde.",
        },
        url: "https://www.flightconnections.com/es/vuelos-desde-bcn-a-fez",
      },
      {
        id: "rak",
        code: "RAK",
        city: { es: "Marrakech", en: "Marrakesh", fr: "Marrakech" },
        airport: { es: "Aeropuerto de Marrakech-Menara", en: "Marrakesh Menara Airport", fr: "Aéroport de Marrakech-Ménara" },
        desc: {
          es: "La ciudad roja: zocos, palacios, jardines y la mítica plaza Jemaa el-Fna.",
          en: "The red city: souks, palaces, gardens and the legendary Jemaa el-Fnaa square.",
          fr: "La ville rouge : souks, palais, jardins et la mythique place Jemaa el-Fna.",
        },
        url: "https://www.flightconnections.com/es/vuelos-desde-bcn-a-rak",
      },
      {
        id: "rba",
        code: "RBA",
        city: { es: "Rabat", en: "Rabat", fr: "Rabat" },
        airport: { es: "Aeropuerto de Rabat-Salé", en: "Rabat–Salé Airport", fr: "Aéroport de Rabat-Salé" },
        desc: {
          es: "La capital del Reino, entre la kasbah de los Oudayas, la Torre Hassan y el Atlántico.",
          en: "The Kingdom's capital, between the Kasbah of the Udayas, the Hassan Tower and the Atlantic.",
          fr: "La capitale du Royaume, entre la kasbah des Oudayas, la tour Hassan et l'Atlantique.",
        },
        url: "https://www.flightconnections.com/es/vuelos-desde-bcn-a-rba",
      },
      {
        id: "tng",
        code: "TNG",
        city: { es: "Tánger", en: "Tangier", fr: "Tanger" },
        airport: { es: "Aeropuerto de Tánger-Ibn Battouta", en: "Tangier Ibn Battuta Airport", fr: "Aéroport de Tanger-Ibn Battouta" },
        desc: {
          es: "La puerta del estrecho de Gibraltar, cruce único entre el Mediterráneo y el Atlántico.",
          en: "The gateway to the Strait of Gibraltar, a unique crossroads between Mediterranean and Atlantic.",
          fr: "La porte du détroit de Gibraltar, carrefour unique entre Méditerranée et Atlantique.",
        },
        url: "https://www.flightconnections.com/es/vuelos-desde-bcn-a-tng",
      },
      {
        id: "erh",
        code: "ERH",
        city: { es: "Errachidia", en: "Errachidia", fr: "Errachidia" },
        airport: { es: "Aeropuerto de Errachidia-Moulay Ali Cherif", en: "Moulay Ali Cherif Airport", fr: "Aéroport d'Errachidia-Moulay Ali Cherif" },
        desc: {
          es: "Puerta del sureste sahariano y acceso natural a las dunas del Erg Chebbi.",
          en: "Gateway to the Saharan southeast and the natural access to the dunes of Erg Chebbi.",
          fr: "Porte du sud-est saharien et accès naturel aux dunes de l'Erg Chebbi.",
        },
        url: "https://www.flightconnections.com/es/vuelos-desde-bcn-a-erh",
      },
    ],
  },
];

/* Próximos orígenes de salida (fase 2) — solo informativo en la UI. */
export const UPCOMING_ORIGINS = ["Madrid", "Valencia", "Málaga", "Sevilla", "Bilbao"];
