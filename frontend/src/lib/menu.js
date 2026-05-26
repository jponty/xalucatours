// Side-menu data — Spanish-first nav (no /es/ prefix in the URL, since ES is primary market).
// The `tours` node uses a `groups` schema (museum-style sectioned navigation)
// while the other nodes keep the simple `children` schema.

export const MENU_TREE = [
  {
    id: "home",
    routeId: "home",
    label: { es: "Inicio", en: "Home", fr: "Accueil" },
    icon: "home",
  },
  {
    id: "appointment",
    routeId: "appointment",
    label: { es: "Cita previa", en: "Book an appointment", fr: "Prendre rendez-vous" },
    icon: "calendar-clock",
  },
  {
    id: "tours",
    label: { es: "Nuestros viajes", en: "Our journeys", fr: "Nos voyages" },
    icon: "compass",
    // Top-level link to catalog landing (rendered as a header CTA when expanded).
    routeIdHeader: "catalog",
    headerLabel: { es: "Ver todos los viajes", en: "See all tours", fr: "Voir tous les voyages" },
    groups: [
      {
        id: "by-region",
        label: { es: "Destinos por región", en: "Destinations by region", fr: "Destinations par région" },
        icon: "map-pin",
        items: [
          { id: "south", routeId: "tourSouth", icon: "sun",       label: { es: "Sur de Marruecos",      en: "Southern Morocco", fr: "Sud du Maroc" } },
          { id: "full",  routeId: "tourFull",  icon: "globe-2",   label: { es: "Marruecos al completo", en: "Full Morocco",     fr: "Maroc intégral" } },
          { id: "north", routeId: "tourNorth", icon: "mountain",  label: { es: "Norte de Marruecos",    en: "Northern Morocco", fr: "Nord du Maroc" } },
          { id: "short", routeId: "tourShort", icon: "wind",      label: { es: "Escapadas cortas",      en: "Short escapes",    fr: "Escapades courtes" } },
        ],
      },
      {
        id: "by-format",
        label: { es: "Experiencias y formatos", en: "Experiences & formats", fr: "Expériences & formats" },
        icon: "sparkles",
        items: [
          { id: "adventure",  routeId: "tourAdventure",      icon: "mountain-snow",  label: { es: "Viajes de aventura", en: "Adventure travel", fr: "Voyages d'aventure" } },
          { id: "bespoke",    routeId: "tourBespoke",        icon: "scissors",       label: { es: "Viajes a medida",    en: "Tailor-made tours", fr: "Voyages sur mesure" } },
          { id: "departures", routeId: "upcomingDepartures", icon: "calendar-days", label: { es: "Próximas salidas",   en: "Upcoming departures", fr: "Prochains départs" } },
        ],
      },
    ],
  },
  {
    id: "about-cluster",
    label: { es: "Sobre nosotros", en: "About us", fr: "À propos" },
    icon: "users",
    children: [
      { id: "team",   routeId: "about",     label: { es: "Equipo",                 en: "The team",               fr: "L'équipe" } },
      { id: "wwd",    routeId: "whatWeDo",  label: { es: "¿Qué hacemos?",          en: "What we do",             fr: "Ce que nous faisons" } },
      { id: "wts",    routeId: "whatToSee", label: { es: "¿Qué ver en Marruecos?", en: "What to see in Morocco", fr: "Que voir au Maroc" } },
      { id: "events", routeId: "events",    label: { es: "Incentivos",             en: "Incentives",             fr: "Incentives" } },
    ],
  },
  {
    id: "morocco",
    routeId: "morocco",
    label: { es: "Marruecos", en: "Morocco", fr: "Maroc" },
    icon: "landmark",
  },
  {
    id: "contact",
    routeId: "contact",
    label: { es: "Contacto", en: "Contact", fr: "Contact" },
    icon: "mail",
  },
];
