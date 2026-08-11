import { IMG } from "@/lib/imageBank";

export const HOME_HELP_COPY = {
  eyebrow: {
    es: "Encuentra tu viaje",
    en: "Find your journey",
    fr: "Trouvez votre voyage",
  },
  title: {
    es: "¿En qué podemos ayudarte?",
    en: "How can we help you?",
    fr: "Comment pouvons-nous vous aider ?",
  },
  intro: {
    es: "Elige la forma en que te gustaría descubrir Marruecos y accede directamente a los viajes que mejor encajan contigo.",
    en: "Choose how you would like to discover Morocco and go straight to the journeys that best suit you.",
    fr: "Choisissez comment vous souhaitez découvrir le Maroc et accédez directement aux voyages qui vous correspondent.",
  },
};

export const HOME_HELP_OPTIONS = [
  {
    routeId: "tourSouth",
    image: IMG.dunes,
    label: {
      es: "Descubrir el Sur de Marruecos",
      en: "Discover Southern Morocco",
      fr: "Découvrir le Sud du Maroc",
    },
    detail: {
      es: "Sáhara, kasbahs y Alto Atlas",
      en: "Sahara, kasbahs and High Atlas",
      fr: "Sahara, kasbahs et Haut Atlas",
    },
  },
  {
    routeId: "tourNorth",
    image: IMG.chefBlueCity,
    label: {
      es: "Descubrir el Norte de Marruecos",
      en: "Discover Northern Morocco",
      fr: "Découvrir le Nord du Maroc",
    },
    detail: {
      es: "Ciudades imperiales, Rif y Mediterráneo",
      en: "Imperial cities, the Rif and the Mediterranean",
      fr: "Villes impériales, Rif et Méditerranée",
    },
  },
  {
    routeId: "tourFull",
    image: IMG.atlasSnowy,
    label: {
      es: "Recorrer Marruecos de norte a sur",
      en: "Travel across Morocco from north to south",
      fr: "Parcourir le Maroc du nord au sud",
    },
    detail: {
      es: "Los grandes circuitos por todo el país",
      en: "Grand tours across the whole country",
      fr: "Les grands circuits à travers tout le pays",
    },
  },
  {
    routeId: "tourShort",
    image: IMG.koutoubia,
    label: {
      es: "Ver las Escapadas",
      en: "View short escapes",
      fr: "Voir les escapades",
    },
    detail: {
      es: "Marruecos en pocos días, sin renunciar a lo esencial",
      en: "Morocco in a few days, without missing the essentials",
      fr: "Le Maroc en quelques jours, sans renoncer à l'essentiel",
    },
  },
  {
    routeId: "toursLanding",
    image: IMG.riadFountain,
    label: {
      es: "Explorar todos los viajes",
      en: "Explore all journeys",
      fr: "Explorer tous les voyages",
    },
    detail: {
      es: "Compara todas las rutas y encuentra la tuya",
      en: "Compare every route and find yours",
      fr: "Comparez tous les itinéraires et trouvez le vôtre",
    },
  },
];
