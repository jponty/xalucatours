// Side-menu data — Spanish-first nav (no /es/ prefix in the URL, since ES is primary market).

export const MENU_TREE = [
  {
    id: "home",
    routeId: "home",
    label: { es: "Inicio", en: "Home", fr: "Accueil" },
  },
  {
    id: "appointment",
    routeId: "appointment",
    label: { es: "Cita previa", en: "Book an appointment", fr: "Prendre rendez-vous" },
  },
  {
    id: "tours",
    label: { es: "Viajes a Marruecos", en: "Morocco tours", fr: "Voyages au Maroc" },
    children: [
      {
        id: "catalog",
        routeId: "catalog",
        label: { es: "Catálogo", en: "Catalogue", fr: "Catalogue" },
        children: [
          { id: "all",        routeId: "toursLanding",       label: { es: "Todos los viajes",     en: "All tours",           fr: "Tous les voyages" } },
          { id: "south",      routeId: "tourSouth",          label: { es: "Sur de Marruecos",     en: "Southern Morocco",    fr: "Sud du Maroc" } },
          { id: "full",       routeId: "tourFull",           label: { es: "Marruecos al completo",en: "Full Morocco",        fr: "Maroc intégral" } },
          { id: "short",      routeId: "tourShort",          label: { es: "Escapadas cortas",     en: "Short escapes",       fr: "Escapades courtes" } },
          { id: "north",      routeId: "tourNorth",          label: { es: "Norte de Marruecos",   en: "Northern Morocco",    fr: "Nord du Maroc" } },
          { id: "departures", routeId: "upcomingDepartures", label: { es: "Próximas salidas",     en: "Upcoming departures", fr: "Prochains départs" } },
          { id: "adventure",  routeId: "tourAdventure",      label: { es: "Aventura",             en: "Adventure",           fr: "Aventure" } },
        ],
      },
      {
        id: "bespoke",
        routeId: "tourBespoke",
        label: { es: "Viajes a medida", en: "Tailor-made tours", fr: "Voyages sur mesure" },
      },
    ],
  },
  {
    id: "about-cluster",
    label: { es: "Sobre nosotros", en: "About us", fr: "À propos" },
    children: [
      { id: "team",   routeId: "about",     label: { es: "Equipo",                 en: "The team",             fr: "L'équipe" } },
      { id: "wwd",    routeId: "whatWeDo",  label: { es: "¿Qué hacemos?",          en: "What we do",           fr: "Ce que nous faisons" } },
      { id: "wts",    routeId: "whatToSee", label: { es: "¿Qué ver en Marruecos?", en: "What to see in Morocco", fr: "Que voir au Maroc" } },
      { id: "events", routeId: "events",    label: { es: "Incentivos",             en: "Incentives",            fr: "Incentives" } },
    ],
  },
  {
    id: "morocco",
    routeId: "morocco",
    label: { es: "Marruecos", en: "Morocco", fr: "Maroc" },
  },
  {
    id: "contact",
    routeId: "contact",
    label: { es: "Contacto", en: "Contact", fr: "Contact" },
  },
];
