/* ============================================================
   allTripsCatalog.js
   ----
   Single source of truth for the "Every trip we offer" section
   on the Home page. Each entry maps a registered routeId from
   `lib/routes.js` to a card with region / duration / pace tags
   so the user can filter the full catalog at a glance.

   Adding a new program later is a one-line append here — the
   Home section reads from this array and rebuilds the grid.

   Pace scale (subjective travel intensity):
     - calmo:        2-3 nights, one base, minimal driving
     - equilibrado:  4-6 nights, two/three bases, moderate driving
     - intenso:      7+ nights, multiple regions, long driving days

   Region (matches the marketing regions, NOT geographical):
     - sur · norte · completo · escapadas · aventura · eventos
============================================================ */

import { IMG } from "./imageBank";

const i18n = (es, en, fr) => ({ es, en, fr });

export const TRIP_REGIONS = [
  { id: "all",        label: i18n("Todos",               "All",                 "Tous") },
  { id: "sur",        label: i18n("Sur · Desierto",      "South · Desert",      "Sud · Désert") },
  { id: "norte",      label: i18n("Norte · Ciudades",    "North · Cities",      "Nord · Cités") },
  { id: "completo",   label: i18n("Marruecos integral",  "Full Morocco",        "Maroc intégral") },
  { id: "escapadas",  label: i18n("Escapadas cortas",    "Short escapes",       "Escapades courtes") },
  { id: "aventura",   label: i18n("Aventura",            "Adventure",           "Aventure") },
  { id: "eventos",    label: i18n("Eventos",             "Events",              "Événements") },
];

export const TRIP_PACES = [
  { id: "any",          label: i18n("Cualquier ritmo", "Any pace",      "Toute intensité") },
  { id: "calmo",        label: i18n("Relajado",        "Relaxed",        "Détendu") },
  { id: "equilibrado",  label: i18n("Equilibrado",     "Balanced",       "Équilibré") },
  { id: "intenso",      label: i18n("Intenso",         "Intense",        "Intense") },
];

export const TRIP_DURATIONS = [
  { id: "any",          label: i18n("Cualquier duración", "Any duration",    "Toute durée") },
  { id: "weekend",      label: i18n("2-3 noches",         "2-3 nights",      "2-3 nuits") },
  { id: "week",         label: i18n("4-6 noches",         "4-6 nights",      "4-6 nuits") },
  { id: "long",         label: i18n("7-10 noches",        "7-10 nights",     "7-10 nuits") },
];

const durationBucket = (nights) =>
  nights <= 3 ? "weekend" : nights <= 6 ? "week" : "long";

// `mk` is a tiny helper to keep entries compact and consistent.
const mk = ({ routeId, region, pace, nights, image, title, summary }) => ({
  routeId,
  region,
  pace,
  nights,
  durationBucket: durationBucket(nights),
  image,
  title:   typeof title   === "string" ? i18n(title, title, title) : title,
  summary: typeof summary === "string" ? i18n(summary, summary, summary) : summary,
});

/* ---------- Catalog ---------- */
export const ALL_TRIPS = [
  // ── Sur · Atlas → Desierto / Desierto → Atlas ──
  mk({ routeId: "tourAtlasDesierto45", region: "sur", pace: "equilibrado", nights: 4, image: IMG.dunes,
    title: i18n("Atlas → Desierto · 4 noches", "Atlas → Desert · 4 nights", "Atlas → Désert · 4 nuits"),
    summary: i18n("Ouarzazate, Aït Benhaddou y bivouac en Erg Chebbi.", "Ouarzazate, Aït Benhaddou and an Erg Chebbi bivouac.", "Ouarzazate, Aït Benhaddou et bivouac à l'Erg Chebbi.") }),
  mk({ routeId: "tourAtlasDesierto56", region: "sur", pace: "equilibrado", nights: 5, image: IMG.kasbahArch,
    title: i18n("Atlas → Desierto · 5 noches", "Atlas → Desert · 5 nights", "Atlas → Désert · 5 nuits"),
    summary: i18n("Ruta de las kasbahs, Dadès y dos noches en las dunas.", "Kasbah route, Dadès and two nights in the dunes.", "Route des kasbahs, Dadès et deux nuits dans les dunes.") }),
  mk({ routeId: "tourAtlasDesierto67", region: "sur", pace: "intenso", nights: 6, image: IMG.atlasMisty,
    title: i18n("Atlas → Desierto · 6 noches", "Atlas → Desert · 6 nights", "Atlas → Désert · 6 nuits"),
    summary: i18n("Versión extendida con Skoura y Todra.", "Extended with Skoura and Todra.", "Version étendue avec Skoura et Todra.") }),
  mk({ routeId: "tourDesiertoAtlas45", region: "sur", pace: "equilibrado", nights: 4, image: IMG.camelCaravan,
    title: i18n("Desierto → Atlas · 4 noches", "Desert → Atlas · 4 nights", "Désert → Atlas · 4 nuits"),
    summary: i18n("Empezar por las dunas, terminar en Marrakech.", "Start in the dunes, end in Marrakech.", "Commencer par les dunes, finir à Marrakech.") }),
  mk({ routeId: "tourDesiertoAtlas67", region: "sur", pace: "intenso", nights: 6, image: IMG.dunesRocky,
    title: i18n("Desierto → Atlas · 6 noches", "Desert → Atlas · 6 nights", "Désert → Atlas · 6 nuits"),
    summary: i18n("Erg Chebbi, gargantas del Todra y Aït Benhaddou.", "Erg Chebbi, Todra gorges and Aït Benhaddou.", "Erg Chebbi, gorges du Todra et Aït Benhaddou.") }),

  // ── Sur · Marrakech → Erg Chebbi (linear) ──
  mk({ routeId: "tourMarrakechErg45", region: "sur", pace: "equilibrado", nights: 4, image: IMG.koutoubia,
    title: i18n("Marrakech → Erg Chebbi · 4 noches", "Marrakech → Erg Chebbi · 4 nights", "Marrakech → Erg Chebbi · 4 nuits"),
    summary: i18n("Cruce clásico del Atlas en cuatro días.", "Classic Atlas crossing in four days.", "Traversée classique de l'Atlas en quatre jours.") }),
  mk({ routeId: "tourMarrakechErg56", region: "sur", pace: "equilibrado", nights: 5, image: IMG.dunes,
    title: i18n("Marrakech → Erg Chebbi · 5 noches", "Marrakech → Erg Chebbi · 5 nights", "Marrakech → Erg Chebbi · 5 nuits"),
    summary: i18n("Versión cómoda con dos noches en Erg Chebbi.", "Comfortable version with two Erg Chebbi nights.", "Version confortable avec deux nuits à l'Erg Chebbi.") }),
  mk({ routeId: "tourMarrakechErg67", region: "sur", pace: "intenso", nights: 6, image: IMG.atlasSnowy,
    title: i18n("Marrakech → Erg Chebbi · 6 noches", "Marrakech → Erg Chebbi · 6 nights", "Marrakech → Erg Chebbi · 6 nuits"),
    summary: i18n("Sumando Skoura, Dadès y palmeral.", "Adds Skoura, Dadès and palm grove.", "Avec Skoura, Dadès et palmeraie.") }),

  // ── Sur · Loop Marrakech (round-trip) ──
  mk({ routeId: "tourMarrakechLoop34", region: "sur", pace: "calmo", nights: 3, image: IMG.kasbahGate,
    title: i18n("Loop Marrakech · 3 noches", "Marrakech Loop · 3 nights", "Boucle Marrakech · 3 nuits"),
    summary: i18n("Ida y vuelta corta al desierto desde Marrakech.", "Short desert round-trip from Marrakech.", "Aller-retour court au désert depuis Marrakech.") }),
  mk({ routeId: "tourMarrakechLoop45", region: "sur", pace: "equilibrado", nights: 4, image: IMG.dunes,
    title: i18n("Loop Marrakech · 4 noches", "Marrakech Loop · 4 nights", "Boucle Marrakech · 4 nuits"),
    summary: i18n("La opción más vendida — equilibrada y completa.", "Our best-seller — balanced and complete.", "Notre best-seller — équilibré et complet.") }),
  mk({ routeId: "tourMarrakechLoop56", region: "sur", pace: "equilibrado", nights: 5, image: IMG.atlasValley,
    title: i18n("Loop Marrakech · 5 noches", "Marrakech Loop · 5 nights", "Boucle Marrakech · 5 nuits"),
    summary: i18n("Sin prisa, con margen para improvisar paradas.", "Unhurried, with room to improvise stops.", "Sans hâte, avec marge pour improviser.") }),
  mk({ routeId: "tourMarrakechLoop67", region: "sur", pace: "intenso", nights: 6, image: IMG.atlasSnowy,
    title: i18n("Loop Marrakech · 6 noches", "Marrakech Loop · 6 nights", "Boucle Marrakech · 6 nuits"),
    summary: i18n("Versión extendida con valle del Drâa.", "Extended with the Drâa valley.", "Version étendue avec la vallée du Drâa.") }),

  // ── Sur · Marrakech ↔ Essaouira ──
  mk({ routeId: "tourMarrakechEss45", region: "sur", pace: "equilibrado", nights: 4, image: IMG.essaouiraPort,
    title: i18n("Marrakech & Essaouira · 4 noches", "Marrakech & Essaouira · 4 nights", "Marrakech & Essaouira · 4 nuits"),
    summary: i18n("Medina imperial + puerto atlántico de Essaouira.", "Imperial medina + Atlantic port of Essaouira.", "Médina impériale + port atlantique d'Essaouira.") }),
  mk({ routeId: "tourMarrakechEss67", region: "sur", pace: "intenso", nights: 6, image: IMG.essaouiraPort,
    title: i18n("Marrakech & Essaouira · 6 noches", "Marrakech & Essaouira · 6 nights", "Marrakech & Essaouira · 6 nuits"),
    summary: i18n("Versión amplia con Sidi Kaouki y argán.", "Wider version with Sidi Kaouki and argan.", "Version étendue avec Sidi Kaouki et argan.") }),

  // ── Gran Sur · Fez ↔ Marrakech ──
  mk({ routeId: "tourFezRak67",  region: "completo", pace: "intenso", nights: 6, image: IMG.medinaPeople,
    title: i18n("Fez → Marrakech · 6 noches", "Fez → Marrakech · 6 nights", "Fès → Marrakech · 6 nuits"),
    summary: i18n("Imperial → cedros del Atlas → desierto → Marrakech.", "Imperial → Atlas cedars → desert → Marrakech.", "Impérial → cèdres → désert → Marrakech.") }),
  mk({ routeId: "tourFezRak78",  region: "completo", pace: "intenso", nights: 7, image: IMG.riadFountain,
    title: i18n("Fez → Marrakech · 7 noches", "Fez → Marrakech · 7 nights", "Fès → Marrakech · 7 nuits"),
    summary: i18n("Mismo recorrido con margen para artesanos.", "Same route with time for artisans.", "Même itinéraire avec du temps pour les artisans.") }),
  mk({ routeId: "tourMarrakechFez67", region: "completo", pace: "intenso", nights: 6, image: IMG.riadInterior,
    title: i18n("Marrakech → Fez · 6 noches", "Marrakech → Fez · 6 nights", "Marrakech → Fès · 6 nuits"),
    summary: i18n("Sentido inverso, cerrando en Fez.", "Reverse direction, closing in Fez.", "Sens inverse, finissant à Fès.") }),
  mk({ routeId: "tourMarrakechFez89", region: "completo", pace: "intenso", nights: 8, image: IMG.kasbahArch,
    title: i18n("Marrakech → Fez · 8 noches", "Marrakech → Fez · 8 nights", "Marrakech → Fès · 8 nuits"),
    summary: i18n("Versión amplia con Sidi Ali y Volúbilis.", "Wider with Sidi Ali and Volubilis.", "Étendu avec Sidi Ali et Volubilis.") }),
  mk({ routeId: "tourMarrakechFez910", region: "completo", pace: "intenso", nights: 9, image: IMG.atlasValley,
    title: i18n("Marrakech → Fez · 9 noches", "Marrakech → Fez · 9 nights", "Marrakech → Fès · 9 nuits"),
    summary: i18n("La travesía más completa que hacemos.", "Our most comprehensive crossing.", "Notre traversée la plus complète.") }),

  // ── Gran Sur · Tánger ↔ Marrakech ──
  mk({ routeId: "tourTangerRak89",  region: "completo", pace: "intenso", nights: 8, image: IMG.chefBlueCity,
    title: i18n("Tánger → Marrakech · 8 noches", "Tangier → Marrakech · 8 nights", "Tanger → Marrakech · 8 nuits"),
    summary: i18n("Del estrecho al Sáhara — el país entero.", "From the strait to the Sahara — the whole country.", "Du détroit au Sahara — tout le pays.") }),
  mk({ routeId: "tourTangerRak910", region: "completo", pace: "intenso", nights: 9, image: IMG.chefAlley,
    title: i18n("Tánger → Marrakech · 9 noches", "Tangier → Marrakech · 9 nights", "Tanger → Marrakech · 9 nuits"),
    summary: i18n("Versión amplia incluyendo Chefchaouen.", "Wider, including Chefchaouen.", "Version étendue avec Chefchaouen.") }),

  // ── Norte · Ciudades Imperiales ──
  mk({ routeId: "tourCiudadesImperiales45", region: "norte", pace: "equilibrado", nights: 4, image: IMG.medinaPeople,
    title: i18n("Ciudades imperiales · 4 noches", "Imperial cities · 4 nights", "Cités impériales · 4 nuits"),
    summary: i18n("Fez, Mequinez, Salé y Rabat con tres artesanos.", "Fez, Meknès, Salé and Rabat with three artisans.", "Fès, Meknès, Salé et Rabat avec trois artisans.") }),
  mk({ routeId: "tourCiudadesImperiales67", region: "norte", pace: "intenso", nights: 6, image: IMG.riadFountain,
    title: i18n("Ciudades imperiales · 6 noches", "Imperial cities · 6 nights", "Cités impériales · 6 nuits"),
    summary: i18n("Sumando Volúbilis, Moulay Idriss y Casablanca.", "Adds Volubilis, Moulay Idriss and Casablanca.", "Avec Volubilis, Moulay Idriss et Casablanca.") }),
  mk({ routeId: "tourCiudadesImperialesRif67", region: "norte", pace: "intenso", nights: 6, image: IMG.chefBlueCity,
    title: i18n("Ciudades imperiales + Rif · 6 noches", "Imperial cities + Rif · 6 nights", "Cités impériales + Rif · 6 nuits"),
    summary: i18n("Combinación con Chefchaouen y Tetuán.", "Combined with Chefchaouen and Tetouan.", "Combiné avec Chefchaouen et Tétouan.") }),
  mk({ routeId: "tourCiudadesImperialesRif78", region: "norte", pace: "intenso", nights: 7, image: IMG.chefStreet,
    title: i18n("Ciudades imperiales + Rif · 7 noches", "Imperial cities + Rif · 7 nights", "Cités impériales + Rif · 7 nuits"),
    summary: i18n("Versión completa con dos noches en Chefchaouen.", "Full version with two Chefchaouen nights.", "Version complète avec deux nuits à Chefchaouen.") }),

  // ── Norte · Tánger ↔ Fez ──
  mk({ routeId: "tourTangerFez45", region: "norte", pace: "equilibrado", nights: 4, image: IMG.chefCourtyard,
    title: i18n("Tánger → Fez · 4 noches", "Tangier → Fez · 4 nights", "Tanger → Fès · 4 nuits"),
    summary: i18n("Estrecho, Tetuán y descenso a Fez.", "Strait, Tetouan and descent to Fez.", "Détroit, Tétouan et descente à Fès.") }),
  mk({ routeId: "tourTangerFez56", region: "norte", pace: "equilibrado", nights: 5, image: IMG.chefAlley,
    title: i18n("Tánger → Fez · 5 noches", "Tangier → Fez · 5 nights", "Tanger → Fès · 5 nuits"),
    summary: i18n("Con noche extra en Chefchaouen.", "Adds an extra Chefchaouen night.", "Avec une nuit extra à Chefchaouen.") }),
  mk({ routeId: "tourFezTanger56", region: "norte", pace: "equilibrado", nights: 5, image: IMG.medinaPeople,
    title: i18n("Fez → Tánger · 5 noches", "Fez → Tangier · 5 nights", "Fès → Tanger · 5 nuits"),
    summary: i18n("Sentido inverso terminando en el estrecho.", "Reverse, ending at the strait.", "Sens inverse, finissant au détroit.") }),
  mk({ routeId: "tourFezTanger67", region: "norte", pace: "intenso", nights: 6, image: IMG.chefStreet,
    title: i18n("Fez → Tánger · 6 noches", "Fez → Tangier · 6 nights", "Fès → Tanger · 6 nuits"),
    summary: i18n("Versión extendida con Asilah.", "Extended with Asilah.", "Version étendue avec Asilah.") }),

  // ── Escapadas cortas ──
  mk({ routeId: "tourEscapadaMarrakech23", region: "escapadas", pace: "calmo", nights: 2, image: IMG.koutoubia,
    title: i18n("Marrakech · 2 noches", "Marrakech · 2 nights", "Marrakech · 2 nuits"),
    summary: i18n("Fin de semana en la ciudad roja.", "A weekend in the red city.", "Un week-end dans la ville rouge.") }),
  mk({ routeId: "tourEscapadaRakAgafay34", region: "escapadas", pace: "calmo", nights: 3, image: IMG.dunesRocky,
    title: i18n("Marrakech + Agafay · 3 noches", "Marrakech + Agafay · 3 nights", "Marrakech + Agafay · 3 nuits"),
    summary: i18n("Medina + desierto pedregoso a las puertas de Marrakech.", "Medina + stone desert at the gates of Marrakech.", "Médina + désert de pierre aux portes de Marrakech.") }),
  mk({ routeId: "tourEscapadaRakErgRak23", region: "escapadas", pace: "calmo", nights: 2, image: IMG.dunes,
    title: i18n("Loop Marrakech · 2 noches", "Marrakech Loop · 2 nights", "Boucle Marrakech · 2 nuits"),
    summary: i18n("La escapada al Sáhara más rápida posible.", "The quickest Sahara escape we offer.", "L'escapade au Sahara la plus rapide.") }),
  mk({ routeId: "tourEscapadaRakErgRak34", region: "escapadas", pace: "calmo", nights: 3, image: IMG.camelCaravan,
    title: i18n("Loop Marrakech · 3 noches", "Marrakech Loop · 3 nights", "Boucle Marrakech · 3 nuits"),
    summary: i18n("Tres días: medina, montaña y dunas.", "Three days: medina, mountain and dunes.", "Trois jours : médina, montagne et dunes.") }),
  mk({ routeId: "tourEscapadaFez23", region: "escapadas", pace: "calmo", nights: 2, image: IMG.medinaPeople,
    title: i18n("Fez · 2 noches", "Fez · 2 nights", "Fès · 2 nuits"),
    summary: i18n("Una inmersión corta en la medina más viva del mundo.", "A short dive into the world's liveliest medina.", "Une courte immersion dans la médina la plus vivante au monde.") }),
  mk({ routeId: "tourEscapadaFez34", region: "escapadas", pace: "calmo", nights: 3, image: IMG.riadInterior,
    title: i18n("Fez · 3 noches", "Fez · 3 nights", "Fès · 3 nuits"),
    summary: i18n("Cuatro días con un día completo de artesanos.", "Four days with a full artisans day.", "Quatre jours avec une journée artisans.") }),
  mk({ routeId: "tourEscapadaAtlas34", region: "escapadas", pace: "calmo", nights: 3, image: IMG.atlasMisty,
    title: i18n("Alto Atlas · 3 noches", "High Atlas · 3 nights", "Haut Atlas · 3 nuits"),
    summary: i18n("Tres días entre kasbahs y aldeas bereberes.", "Three days among kasbahs and Berber villages.", "Trois jours parmi kasbahs et villages berbères.") }),
  mk({ routeId: "tourEscapadaDesierto34", region: "escapadas", pace: "calmo", nights: 3, image: IMG.dunes,
    title: i18n("Desierto express · 3 noches", "Desert express · 3 nights", "Désert express · 3 nuits"),
    summary: i18n("Directos al Erg Chebbi para los que tienen poco tiempo.", "Straight to Erg Chebbi when time is tight.", "Directement à l'Erg Chebbi quand le temps presse.") }),

  // ── Aventura · Enduro ──
  mk({ routeId: "tourEnduroAventura45", region: "aventura", pace: "equilibrado", nights: 4, image: IMG.dunesRocky,
    title: i18n("Enduro Sahara · 4 noches", "Sahara enduro · 4 nights", "Enduro Sahara · 4 nuits"),
    summary: i18n("Pistas del Drâa en moto enduro, grupo reducido.", "Drâa tracks on enduro bikes, small group.", "Pistes du Drâa en moto enduro, petit groupe.") }),
  mk({ routeId: "tourEnduroAventura67", region: "aventura", pace: "intenso", nights: 6, image: IMG.dunes,
    title: i18n("Enduro Sahara · 6 noches", "Sahara enduro · 6 nights", "Enduro Sahara · 6 nuits"),
    summary: i18n("Expedición larga incluyendo Erg Chebbi.", "Long expedition including Erg Chebbi.", "Expédition longue incluant l'Erg Chebbi.") }),

  // ── Eventos ──
  mk({ routeId: "tourFinDeAno2025", region: "eventos", pace: "equilibrado", nights: 5, image: IMG.camelDunes,
    title: i18n("Fin de año 2026 en el desierto", "New Year's Eve 2026 in the desert", "Réveillon 2026 dans le désert"),
    summary: i18n("Cena bereber, fuego y campanadas bajo las estrellas.", "Berber dinner, firelight and bells under the stars.", "Dîner berbère, feu et cloches sous les étoiles.") }),
];
