// Side-menu data — Spanish-first nav per the brief, with trilingual labels.
// Each leaf is either { routeId } (resolves to a URL) or { anchor } (scrolls within home).

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
        label: { es: "Catálogo", en: "Catalogue", fr: "Catalogue" },
        children: [
          { id: "all",       routeId: "tourAll",       label: { es: "Todos los viajes",       en: "All tours",        fr: "Tous les voyages" } },
          { id: "south",     routeId: "tourSouth",     label: { es: "Sur de Marruecos",       en: "Southern Morocco", fr: "Sud du Maroc" } },
          { id: "full",      routeId: "tourFull",      label: { es: "Marruecos al completo",  en: "Full Morocco",     fr: "Maroc intégral" } },
          { id: "short",     routeId: "tourShort",     label: { es: "Escapadas cortas",       en: "Short escapes",    fr: "Escapades courtes" } },
          { id: "north",     routeId: "tourNorth",     label: { es: "Norte de Marruecos",     en: "Northern Morocco", fr: "Nord du Maroc" } },
          { id: "featured",  routeId: "tourFeatured",  label: { es: "Viajes destacados",      en: "Featured tours",   fr: "Voyages phares" } },
          { id: "adventure", routeId: "tourAdventure", label: { es: "Aventura",               en: "Adventure",        fr: "Aventure" } },
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
      { id: "about",     routeId: "about",     label: { es: "Sobre nosotros",         en: "About us",             fr: "À propos" } },
      { id: "wwd",       routeId: "whatWeDo",  label: { es: "¿Qué hacemos?",          en: "What we do",           fr: "Ce que nous faisons" } },
      { id: "wts",       routeId: "whatToSee", label: { es: "¿Qué ver en Marruecos?", en: "What to see in Morocco", fr: "Que voir au Maroc" } },
      { id: "events",    routeId: "events",    label: { es: "Eventos & incentivos",   en: "Events & incentives",  fr: "Événements & incentives" } },
    ],
  },
  {
    id: "hotels",
    routeId: "hotels",
    label: { es: "Nuestros hoteles", en: "Our hotels", fr: "Nos hôtels" },
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
