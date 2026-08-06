/* ============================================================
   seoMeta.js — per-route SEO copy (title + meta description),
   trilingual (es/en/fr). Consumed by <SeoHead> in LocalizedRouter
   so every page sets its own <title>, <meta description>, canonical
   and hreflang. Social crawlers (no JS) fall back to the static
   defaults baked into public/index.html.

   Keep titles ≲ 60 chars and descriptions ≲ 160 chars.
============================================================ */

const T = (es, en, fr) => ({ es, en, fr });
const BRAND = "Xaluca Tours";

// Brand default — used for any route without an explicit entry
// (e.g. individual trip programmes), keeping messaging consistent.
export const DEFAULT_SEO = {
  title: T(
    "Xaluca Tours · Viajes a medida por Marruecos",
    "Xaluca Tours · Tailor-made journeys across Morocco",
    "Xaluca Tours · Voyages sur mesure au Maroc"
  ),
  description: T(
    "Viaja de otra manera. Más de 30 años creando viajes personalizados e inolvidables por Marruecos — del desierto del Sáhara a las ciudades imperiales.",
    "Travel differently. Over 30 years crafting personalised, unforgettable journeys across Morocco — from the Sahara desert to the imperial cities.",
    "Voyagez autrement. Plus de 30 ans de voyages personnalisés et inoubliables au Maroc — du Sahara aux villes impériales."
  ),
};

// title helper: append the brand unless it's the home page.
const withBrand = (label) => ({
  es: `${label.es} · ${BRAND}`,
  en: `${label.en} · ${BRAND}`,
  fr: `${label.fr} · ${BRAND}`,
});

const SEO = {
  home: DEFAULT_SEO,

  planner: {
    title: withBrand(T("Planificador inteligente de viajes", "Smart Morocco trip planner", "Planificateur de voyage intelligent")),
    description: T(
      "Diseña tu viaje por Marruecos en minutos: indica días, llegada, salida e intereses y nuestro planificador te recomienda la mejor ruta entre los circuitos reales de Xaluca Tours.",
      "Design your Morocco trip in minutes: set your days, arrival, departure and interests and our planner recommends the best route among Xaluca Tours' real circuits.",
      "Concevez votre voyage au Maroc en quelques minutes : indiquez vos jours, arrivée, départ et envies, notre planificateur recommande le meilleur itinéraire parmi les circuits réels de Xaluca Tours."
    ),
  },

  appointment: {
    title: withBrand(T("Cita previa · Diseña tu viaje", "Book an appointment · Plan your trip", "Prendre rendez-vous · Planifiez votre voyage")),
    description: T(
      "Reserva una cita gratuita con nuestros especialistas y diseña tu viaje a medida por Marruecos, planificado a tu ritmo, intereses y estilo.",
      "Book a free appointment with our specialists and design your tailor-made Morocco trip, planned around your pace, interests and style.",
      "Réservez un rendez-vous gratuit avec nos spécialistes et concevez votre voyage sur mesure au Maroc, à votre rythme et selon vos envies."
    ),
  },

  fastTrack: {
    title: withBrand(T("Fast Track · Planificación prioritaria", "Fast Track · Planificación prioritaria", "Fast Track · Planificación prioritaria")),
    description: T(
      "Activa Fast Track por 150 € y accede a una planificación prioritaria y personalizada. Importe no reembolsable, deducible íntegramente si reservas el viaje.",
      "Activa Fast Track por 150 € y accede a una planificación prioritaria y personalizada. Importe no reembolsable, deducible íntegramente si reservas el viaje.",
      "Activa Fast Track por 150 € y accede a una planificación prioritaria y personalizada. Importe no reembolsable, deducible íntegramente si reservas el viaje."
    ),
  },

  feedback: {
    title: withBrand(T("Comparte tu experiencia", "Share your experience", "Partagez votre expérience")),
    description: T(
      "Comparte tu experiencia con Xaluca Tours por escrito o mediante una grabación de voz. Tu opinión nos ayuda a mejorar cada viaje.",
      "Share your Xaluca Tours experience in writing or with a voice recording. Your feedback helps us improve every journey.",
      "Partagez votre expérience Xaluca Tours par écrit ou par message vocal. Votre avis nous aide à améliorer chaque voyage."
    ),
  },

  southTimeline: {
    title: withBrand(T("Mejor época para viajar al sur de Marruecos", "Best time to visit southern Morocco", "Meilleure saison pour le sud du Maroc")),
    description: T(
      "Guía mes a mes del clima, las temperaturas y las mejores experiencias para viajar al sur de Marruecos, el Atlas y el desierto.",
      "A month-by-month guide to climate, temperatures and the best experiences in southern Morocco, the Atlas and the desert.",
      "Guide mois par mois du climat, des températures et des meilleures expériences dans le sud du Maroc, l’Atlas et le désert."
    ),
  },

  toursLanding: {
    title: withBrand(T("Nuestros viajes por Marruecos", "Our Morocco tours", "Nos voyages au Maroc")),
    description: T(
      "Explora todos nuestros viajes por Marruecos: desierto del Sáhara, Atlas, ciudades imperiales, costa atlántica y rutas a medida.",
      "Explore all our Morocco tours: the Sahara desert, the Atlas, imperial cities, the Atlantic coast and fully tailor-made routes.",
      "Découvrez tous nos voyages au Maroc : désert du Sahara, Atlas, villes impériales, côte atlantique et circuits sur mesure."
    ),
  },

  catalog: {
    title: withBrand(T("Catálogo de viajes", "Trip catalogue", "Catalogue de voyages")),
    description: T(
      "Catálogo completo de viajes por Marruecos con itinerarios día a día, mapas interactivos y precios. Encuentra tu ruta ideal con Xaluca Tours.",
      "Full Morocco trip catalogue with day-by-day itineraries, interactive maps and pricing. Find your ideal route with Xaluca Tours.",
      "Catalogue complet de voyages au Maroc : itinéraires jour par jour, cartes interactives et tarifs. Trouvez votre circuit idéal."
    ),
  },

  archive: {
    title: withBrand(T("Archivo completo de viajes", "Complete trip archive", "Archives complètes des voyages")),
    description: T(
      "Consulta todos los viajes de Xaluca Tours en una tabla con duración, precios por temporada y acceso directo a cada itinerario.",
      "Browse every Xaluca Tours journey in one table with duration, seasonal pricing and direct access to each itinerary.",
      "Consultez tous les voyages Xaluca Tours dans un tableau avec durée, tarifs saisonniers et accès direct à chaque itinéraire."
    ),
  },

  precios: {
    title: withBrand(T("Precios y tarifas", "Pricing", "Tarifs")),
    description: T(
      "Consulta los precios de nuestros viajes a medida por Marruecos. Tarifas transparentes por temporada y nivel de alojamiento.",
      "See the pricing for our tailor-made Morocco trips. Transparent rates by season and accommodation level.",
      "Consultez les tarifs de nos voyages sur mesure au Maroc. Prix transparents par saison et niveau d'hébergement."
    ),
  },

  opiniones: {
    title: withBrand(T("Opiniones de viajeros", "Traveller reviews", "Avis des voyageurs")),
    description: T(
      "Lee las opiniones reales de viajeros que han vivido Marruecos con Xaluca Tours. Experiencias auténticas, personalizadas e inolvidables.",
      "Read genuine reviews from travellers who experienced Morocco with Xaluca Tours. Authentic, personalised, unforgettable journeys.",
      "Lisez les avis authentiques de voyageurs ayant vécu le Maroc avec Xaluca Tours. Des expériences personnalisées et inoubliables."
    ),
  },

  vuelos: {
    title: withBrand(T("Vuelos a Marruecos", "Flights to Morocco", "Vols vers le Maroc")),
    description: T(
      "Directorio de vuelos y conexiones a Marruecos para preparar tu viaje. Encuentra las mejores rutas hacia tu destino con Xaluca Tours.",
      "Directory of flights and connections to Morocco to plan your trip. Find the best routes to your destination with Xaluca Tours.",
      "Répertoire des vols et correspondances vers le Maroc pour préparer votre voyage. Trouvez les meilleures liaisons avec Xaluca Tours."
    ),
  },

  tourUpcoming: {
    title: withBrand(T("Próximas salidas", "Upcoming departures", "Prochains départs")),
    description: T(
      "Descubre nuestras próximas salidas a Marruecos con fechas confirmadas. Plazas limitadas para vivir el desierto y las ciudades imperiales.",
      "Discover our upcoming Morocco departures with confirmed dates. Limited places to experience the desert and the imperial cities.",
      "Découvrez nos prochains départs au Maroc à dates confirmées. Places limitées pour vivre le désert et les villes impériales."
    ),
  },

  tourSouth: {
    title: withBrand(T("Sur de Marruecos y el desierto", "Southern Morocco & the desert", "Sud du Maroc et le désert")),
    description: T(
      "Viajes por el sur de Marruecos: el Alto Atlas, las gargantas del Dadès y el Todra y las dunas del Sáhara en Erg Chebbi.",
      "Tours of southern Morocco: the High Atlas, the Dadès and Todra gorges and the Sahara dunes of Erg Chebbi.",
      "Voyages dans le sud du Maroc : le Haut Atlas, les gorges du Dadès et du Todra et les dunes du Sahara à Erg Chebbi."
    ),
  },

  tourFull: {
    title: withBrand(T("Marruecos al completo", "The complete Morocco", "Le Maroc au complet")),
    description: T(
      "Grandes rutas que recorren Marruecos de norte a sur: ciudades imperiales, montañas del Atlas y el desierto del Sáhara en un solo viaje.",
      "Grand routes crossing Morocco north to south: imperial cities, the Atlas mountains and the Sahara desert in a single journey.",
      "Grands circuits traversant le Maroc du nord au sud : villes impériales, montagnes de l'Atlas et désert du Sahara en un seul voyage."
    ),
  },
};

export const getSeoMeta = (routeId, lang = "es") => {
  const entry = (routeId && SEO[routeId]) || DEFAULT_SEO;
  const pickLang = (o) => (o && (o[lang] || o.es)) || "";
  return {
    title: pickLang(entry.title),
    description: pickLang(entry.description),
  };
};

export default SEO;
