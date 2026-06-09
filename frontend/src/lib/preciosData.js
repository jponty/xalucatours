/* ============================================================
   Pricing-page packages — the 4 travel styles compared.
   ------------------------------------------------------------
   • Each package maps to one of the home trip lists so its
     "Desde €X por persona" is computed from the SAME pricing
     system used across the site (global matrix + per-program
     tariffs, both editable from the /admin "Precios" tab).
   • All copy is trilingual and rendered through <EditableText>
     (CMS-editable). The defaults below are the fallbacks.
============================================================ */
import { SOUTH_TRIPS, FULL_TRIPS, SHORT_TRIPS, NORTH_TRIPS } from "@/lib/homeCarousels";

export const PRICING_PACKAGES = [
  {
    slug: "magic-south",
    number: "01",
    trips: SOUTH_TRIPS,
    recommended: true,
    title: { es: "La magia del Sur", en: "The magic of the South", fr: "La magie du Sud" },
    meta: {
      es: "Sáhara · Atlas · Kasbahs — 4 a 6 días",
      en: "Sahara · Atlas · Kasbahs — 4 to 6 days",
      fr: "Sahara · Atlas · Kasbahs — 4 à 6 jours",
    },
    description: {
      es: "Adéntrate en las dunas doradas del Erg Chebbi entre kasbahs de adobe y noches de jaima bajo un cielo infinito de estrellas.",
      en: "Venture into the golden dunes of Erg Chebbi, between adobe kasbahs and camp nights under an endless starlit sky.",
      fr: "Plongez dans les dunes dorées de l'Erg Chebbi, entre kasbahs d'adobe et nuits sous les étoiles.",
    },
    inclusions: [
      { es: "Alojamiento en hoteles Xaluca y campamento de lujo", en: "Stays in Xaluca hotels & a luxury desert camp", fr: "Hébergement en hôtels Xaluca et campement de luxe" },
      { es: "Vehículo 4x4 privado con chófer local", en: "Private 4x4 with a local chauffeur", fr: "4x4 privé avec chauffeur local" },
      { es: "Media pensión (desayuno y cena)", en: "Half board (breakfast & dinner)", fr: "Demi-pension (petit-déjeuner et dîner)" },
      { es: "Excursión en dromedario al atardecer", en: "Sunset camel ride into the dunes", fr: "Balade à dos de dromadaire au coucher du soleil" },
      { es: "Asistencia 24/7 durante todo el viaje", en: "24/7 assistance throughout your trip", fr: "Assistance 24/7 pendant tout le voyage" },
    ],
  },
  {
    slug: "north-to-south",
    number: "02",
    trips: FULL_TRIPS,
    recommended: false,
    title: { es: "Marruecos de norte a sur", en: "Morocco from north to south", fr: "Le Maroc du nord au sud" },
    meta: {
      es: "Tánger → Sáhara — 6 a 10 días",
      en: "Tangier → Sahara — 6 to 10 days",
      fr: "Tanger → Sahara — 6 à 10 jours",
    },
    description: {
      es: "El gran viaje: de las medinas imperiales del norte a la inmensidad del desierto, atravesando el Atlas y los valles del sur.",
      en: "The grand journey: from the imperial medinas of the north to the vast desert, across the Atlas and the southern valleys.",
      fr: "Le grand voyage : des médinas impériales du nord à l'immensité du désert, à travers l'Atlas.",
    },
    inclusions: [
      { es: "Recorrido panorámico completo de país", en: "Full panoramic country crossing", fr: "Traversée panoramique complète du pays" },
      { es: "Guías oficiales en las ciudades imperiales", en: "Official guides in the imperial cities", fr: "Guides officiels dans les villes impériales" },
      { es: "Todos los traslados y vehículo 4x4 privado", en: "All transfers & private 4x4", fr: "Tous les transferts et 4x4 privé" },
      { es: "Noches de contraste: riad histórico y desierto", en: "Contrasting nights: historic riad & desert", fr: "Nuits de contraste : riad historique et désert" },
      { es: "Media pensión y asistencia permanente", en: "Half board & permanent assistance", fr: "Demi-pension et assistance permanente" },
    ],
  },
  {
    slug: "short-escapes",
    number: "03",
    trips: SHORT_TRIPS,
    recommended: false,
    title: { es: "Escapadas cortas", en: "Short escapes", fr: "Escapades courtes" },
    meta: {
      es: "Desconexión exprés — 2 a 4 días",
      en: "Express getaway — 2 to 4 days",
      fr: "Évasion express — 2 à 4 jours",
    },
    description: {
      es: "Perfectas para un fin de semana largo. Vive la intensidad de Marruecos —medina, desierto o Atlas— en pocos días, sin renunciar a nada.",
      en: "Ideal for a long weekend. Feel the intensity of Morocco —medina, desert or Atlas— in just a few days.",
      fr: "Parfaites pour un week-end prolongé. Vivez l'intensité du Maroc en quelques jours seulement.",
    },
    inclusions: [
      { es: "Traslados desde y hasta el aeropuerto", en: "Airport transfers in & out", fr: "Transferts aéroport aller-retour" },
      { es: "Alojamiento boutique seleccionado", en: "Hand-picked boutique accommodation", fr: "Hébergement boutique sélectionné" },
      { es: "Ruta optimizada para pocos días", en: "Route optimised for short trips", fr: "Itinéraire optimisé pour courts séjours" },
      { es: "Desayuno tradicional incluido", en: "Traditional breakfast included", fr: "Petit-déjeuner traditionnel inclus" },
      { es: "Flexibilidad total de horarios", en: "Full flexibility on timings", fr: "Flexibilité totale des horaires" },
    ],
  },
  {
    slug: "northern-morocco",
    number: "04",
    trips: NORTH_TRIPS,
    recommended: false,
    title: { es: "La riqueza del Norte", en: "The riches of the North", fr: "La richesse du Nord" },
    meta: {
      es: "Fez · Chefchaouen · Tánger — 4 a 8 días",
      en: "Fez · Chefchaouen · Tangier — 4 to 8 days",
      fr: "Fès · Chefchaouen · Tanger — 4 à 8 jours",
    },
    description: {
      es: "El encanto azul de Chefchaouen, la milenaria medina de Fez y la brisa mediterránea de Tánger en una ruta culta y luminosa.",
      en: "The blue charm of Chefchaouen, the ancient medina of Fez and the Mediterranean breeze of Tangier.",
      fr: "Le charme bleu de Chefchaouen, la médina millénaire de Fès et la brise méditerranéenne de Tanger.",
    },
    inclusions: [
      { es: "Ruta por las ciudades imperiales del norte", en: "Tour of the northern imperial cities", fr: "Circuit des villes impériales du nord" },
      { es: "Alojamiento en riads auténticos", en: "Stays in authentic riads", fr: "Hébergement en riads authentiques" },
      { es: "Visitas guiadas exclusivas en la medina", en: "Exclusive guided visits in the medina", fr: "Visites guidées exclusives dans la médina" },
      { es: "Vehículo privado con conductor", en: "Private vehicle with driver", fr: "Véhicule privé avec chauffeur" },
      { es: "Atención personalizada de principio a fin", en: "Personalised care from start to finish", fr: "Accompagnement personnalisé de bout en bout" },
    ],
  },
];
