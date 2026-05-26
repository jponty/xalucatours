// Hub configurations for the 3 new Sur itinerary hubs.
// Each hub renders intro + list of duration options.
// The individual programme detail pages are not built yet — option CTAs land on the contact form.

const COMMON_NIGHTS = {
  "4n5d": { es: "4 noches · 5 días", en: "4 nights · 5 days", fr: "4 nuits · 5 jours" },
  "5n6d": { es: "5 noches · 6 días", en: "5 nights · 6 days", fr: "5 nuits · 6 jours" },
  "6n7d": { es: "6 noches · 7 días", en: "6 nights · 7 days", fr: "6 nuits · 7 jours" },
  "7n8d": { es: "7 noches · 8 días", en: "7 nights · 8 days", fr: "7 nuits · 8 jours" },
};

export const HUB_MARRAKECH_ERG = {
  id: "marrakech-erg",
  hero: {
    image: "https://images.unsplash.com/photo-1542401886-65d6c61db217?auto=format&fit=crop&w=2400&q=85",
    eyebrow: { es: "Viajes por el Sur de Marruecos", en: "Southern Morocco journeys", fr: "Voyages au Sud du Maroc" },
    place: { es: "Marrakech · Atlas · Erg Chebbi", en: "Marrakech · Atlas · Erg Chebbi", fr: "Marrakech · Atlas · Erg Chebbi" },
    title: {
      es: "Marrakech – Erg Chebbi.",
      en: "Marrakech – Erg Chebbi.",
      fr: "Marrakech – Erg Chebbi.",
    },
    subtitle: {
      es: "De la ciudad roja a las dunas más cercanas a Europa — el alma del sur de Marruecos en una sola ruta.",
      en: "From the red city to Europe's closest dunes — the soul of southern Morocco on one route.",
      fr: "De la ville rouge aux dunes les plus proches de l'Europe — l'âme du sud du Maroc en un seul itinéraire.",
    },
  },
  intro: {
    overline: { es: "Marrakech – Erg Chebbi", en: "Marrakech – Erg Chebbi", fr: "Marrakech – Erg Chebbi" },
    title: { es: "Un viaje auténtico para conocer el sur.", en: "An authentic journey through the south.", fr: "Un voyage authentique pour découvrir le sud." },
    body: {
      es: [
        "Marrakech – Erg Chebbi es un viaje de lo más auténtico para conocer el sur del país.",
        "Esta ruta nos despierta en Marrakech, una ciudad llena de colores, salpicada de artesanos y artistas, de plazas maravillosas, de aromas que marcarán nuestro recuerdo.",
        "De la ciudad, saldremos con un 4x4 hacia el Alto Atlas, descubriendo los paisajes a nuestro paso, deteniéndonos a contemplar su belleza, a conversar con los aldeanos, a disfrutar sin prisas de sus pueblos perdidos, de sus gargantas inmensas.",
        "Dejaremos atrás las montañas para llegar al Desierto del Erg Chebbi, un espectáculo para los sentidos: interminables dunas y ese halo que desprenden los lugares mágicos nos permitirá pasar una noche inolvidable bajo las estrellas.",
        "El camino nos lleva por lugares tan originales como los poblados de Rissani, con su mercado ancestral entre muchos otros…",
      ],
      en: [
        "Marrakech – Erg Chebbi is one of the most authentic journeys to uncover the south of the country.",
        "The route wakes us up in Marrakech, a city full of colour, sprinkled with artisans and artists, with marvellous squares and aromas that will mark our memory.",
        "From the city we set off by 4x4 to the High Atlas, discovering the landscapes along the way, stopping to admire their beauty, to chat with villagers, to enjoy unhurried the forgotten villages and the vast gorges.",
        "We leave the mountains behind to reach the Erg Chebbi Desert — a feast for the senses: endless dunes and the halo of magical places will let us spend an unforgettable night under the stars.",
        "The road takes us through places as original as the village of Rissani with its ancestral market and many others…",
      ],
      fr: [
        "Marrakech – Erg Chebbi est l'un des voyages les plus authentiques pour découvrir le sud du pays.",
        "L'itinéraire nous réveille à Marrakech, ville pleine de couleurs, parsemée d'artisans et d'artistes, aux places merveilleuses, aux parfums qui marqueront notre mémoire.",
        "Depuis la ville, nous partons en 4x4 vers le Haut Atlas, découvrant les paysages au fil de la route, s'arrêtant pour contempler leur beauté, parler avec les villageois, savourer sans hâte ses villages perdus et ses gorges immenses.",
        "Nous laissons les montagnes derrière nous pour atteindre le désert de l'Erg Chebbi, un spectacle pour les sens : dunes infinies et halo magique pour une nuit inoubliable sous les étoiles.",
        "La route nous emmène par des lieux aussi originaux que Rissani et son marché ancestral, parmi tant d'autres…",
      ],
    },
  },
  options: {
    overline: { es: "Opciones de viaje Marrakech – Erg Chebbi", en: "Marrakech – Erg Chebbi options", fr: "Options Marrakech – Erg Chebbi" },
    title: { es: "Elige tu travesía.", en: "Choose your route.", fr: "Choisissez votre itinéraire." },
    body: {
      es: "Elige entre las distintas opciones en función de los días disponibles que tengas para realizar este viaje.",
      en: "Pick between the options depending on how many days you have for this journey.",
      fr: "Choisissez parmi les options selon le nombre de jours disponibles pour ce voyage.",
    },
    group_a: { es: "Marrakech → Erg Chebbi", en: "Marrakech → Erg Chebbi", fr: "Marrakech → Erg Chebbi" },
    group_b: { es: "Erg Chebbi → Marrakech", en: "Erg Chebbi → Marrakech", fr: "Erg Chebbi → Marrakech" },
  },
  programs: [
    { id: "me-4-5", direction: "a", nights: "4n5d", accent: "#C16542",
      image: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=1800&q=85",
      blurb: { es: "Viaje de 4 noches y 5 días desde Marrakech hasta el desierto del Erg Chebbi.",
               en: "4-night/5-day journey from Marrakech to the Erg Chebbi desert.",
               fr: "Voyage de 4 nuits et 5 jours de Marrakech au désert de l'Erg Chebbi." } },
    { id: "me-5-6", direction: "a", nights: "5n6d", accent: "#D97742",
      image: "https://images.unsplash.com/photo-1542401886-65d6c61db217?auto=format&fit=crop&w=1800&q=85",
      blurb: { es: "Viaje de 5 noches y 6 días desde Marrakech hasta el desierto del Erg Chebbi.",
               en: "5-night/6-day journey from Marrakech to the Erg Chebbi desert.",
               fr: "Voyage de 5 nuits et 6 jours de Marrakech au désert de l'Erg Chebbi." } },
    { id: "me-6-7", direction: "a", nights: "6n7d", accent: "#A07042",
      image: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1800&q=85",
      blurb: { es: "Viaje de 6 noches y 7 días desde Marrakech hasta el desierto del Erg Chebbi.",
               en: "6-night/7-day journey from Marrakech to the Erg Chebbi desert.",
               fr: "Voyage de 6 nuits et 7 jours de Marrakech au désert de l'Erg Chebbi." } },
    { id: "me-7-8", direction: "a", nights: "7n8d", accent: "#D4A373",
      image: "https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1800&q=85",
      blurb: { es: "Viaje de 7 noches y 8 días desde Marrakech hasta el desierto del Erg Chebbi.",
               en: "7-night/8-day journey from Marrakech to the Erg Chebbi desert.",
               fr: "Voyage de 7 nuits et 8 jours de Marrakech au désert de l'Erg Chebbi." } },
    { id: "em-4-5", direction: "b", nights: "4n5d", accent: "#5A6B4F",
      image: "https://images.unsplash.com/photo-1604940500627-d3f44d1d21c6?auto=format&fit=crop&w=1800&q=85",
      blurb: { es: "Viaje de 4 noches y 5 días desde Errachidia hasta Marrakech.",
               en: "4-night/5-day journey from Errachidia to Marrakech.",
               fr: "Voyage de 4 nuits et 5 jours d'Errachidia à Marrakech." } },
    { id: "em-5-6", direction: "b", nights: "5n6d", accent: "#7C8B5C",
      image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1800&q=85",
      blurb: { es: "Viaje de 5 noches y 6 días desde Errachidia hasta Marrakech.",
               en: "5-night/6-day journey from Errachidia to Marrakech.",
               fr: "Voyage de 5 nuits et 6 jours d'Errachidia à Marrakech." } },
    { id: "em-6-7", direction: "b", nights: "6n7d", accent: "#A07042",
      image: "https://images.unsplash.com/photo-1570133435536-7ececf000ef6?auto=format&fit=crop&w=1800&q=85",
      blurb: { es: "Viaje de 6 noches y 7 días desde Errachidia hasta Marrakech.",
               en: "6-night/7-day journey from Errachidia to Marrakech.",
               fr: "Voyage de 6 nuits et 7 jours d'Errachidia à Marrakech." } },
    { id: "em-7-8", direction: "b", nights: "7n8d", accent: "#3A4A5F",
      image: "https://images.unsplash.com/photo-1547234935-80c7145ec969?auto=format&fit=crop&w=1800&q=85",
      blurb: { es: "Viaje de 7 noches y 8 días desde Errachidia hasta Marrakech.",
               en: "7-night/8-day journey from Errachidia to Marrakech.",
               fr: "Voyage de 7 nuits et 8 jours d'Errachidia à Marrakech." } },
  ],
};

export const HUB_MARRAKECH_LOOP = {
  id: "marrakech-loop",
  hero: {
    image: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=2400&q=85",
    eyebrow: { es: "Viajes por el Sur de Marruecos", en: "Southern Morocco journeys", fr: "Voyages au Sud du Maroc" },
    place: { es: "Marrakech · Atlas · Erg Chebbi · Marrakech", en: "Marrakech · Atlas · Erg Chebbi · Marrakech", fr: "Marrakech · Atlas · Erg Chebbi · Marrakech" },
    title: {
      es: "Marrakech – Erg Chebbi – Marrakech.",
      en: "Marrakech – Erg Chebbi – Marrakech.",
      fr: "Marrakech – Erg Chebbi – Marrakech.",
    },
    subtitle: {
      es: "Una ruta circular para descubrir en profundidad el sur de Marruecos saliendo y regresando a la ciudad roja.",
      en: "A circular route to discover southern Morocco in depth, leaving from and returning to the red city.",
      fr: "Un itinéraire circulaire pour découvrir en profondeur le sud du Maroc, au départ et au retour de la ville rouge.",
    },
  },
  intro: {
    overline: { es: "Marrakech – Erg Chebbi – Marrakech", en: "Marrakech – Erg Chebbi – Marrakech", fr: "Marrakech – Erg Chebbi – Marrakech" },
    title: { es: "Circular por el corazón del sur.", en: "A loop through the heart of the south.", fr: "Une boucle au cœur du sud." },
    body: {
      es: [
        "Marrakech – Erg Chebbi – Marrakech es una ruta diseñada para descubrir en profundidad el sur de Marruecos.",
        "El viaje comienza en Marrakech y continúa atravesando el Alto Atlas en vehículo 4x4, recorriendo pueblos bereberes, valles, oasis y gargantas espectaculares.",
        "La ruta permite disfrutar del paisaje sin prisas, conversar con aldeanos locales y descubrir el ritmo auténtico del Marruecos más tradicional.",
        "El desierto del Erg Chebbi ofrece una de las experiencias más memorables del viaje: una noche bajo las estrellas rodeados de dunas infinitas y silencio absoluto, antes de regresar a Marrakech.",
      ],
      en: [
        "Marrakech – Erg Chebbi – Marrakech is a circular route designed to discover southern Morocco in depth.",
        "The journey starts in Marrakech and continues across the High Atlas by 4x4, threading Berber villages, valleys, oases and spectacular gorges.",
        "The route lets you enjoy the landscape unhurried, chat with local villagers and discover the authentic rhythm of traditional Morocco.",
        "The Erg Chebbi desert delivers one of the most memorable moments of the trip: a night under the stars surrounded by endless dunes and absolute silence, before returning to Marrakech.",
      ],
      fr: [
        "Marrakech – Erg Chebbi – Marrakech est un itinéraire circulaire conçu pour découvrir en profondeur le sud du Maroc.",
        "Le voyage débute à Marrakech et continue à travers le Haut Atlas en 4x4, traversant villages berbères, vallées, oasis et gorges spectaculaires.",
        "L'itinéraire permet de profiter du paysage sans hâte, de discuter avec les villageois et de découvrir le rythme authentique du Maroc traditionnel.",
        "Le désert de l'Erg Chebbi offre l'un des moments les plus mémorables du voyage : une nuit sous les étoiles entouré de dunes infinies et d'un silence absolu, avant de regagner Marrakech.",
      ],
    },
  },
  options: {
    overline: { es: "Opciones de viaje Marrakech – Erg Chebbi – Marrakech", en: "Marrakech loop options", fr: "Options Marrakech – Erg Chebbi – Marrakech" },
    title: { es: "Elige tu travesía.", en: "Choose your route.", fr: "Choisissez votre itinéraire." },
    body: {
      es: "Elige entre las distintas opciones en función de los días disponibles que tengas para realizar este viaje.",
      en: "Pick between the options depending on how many days you have for this journey.",
      fr: "Choisissez parmi les options selon le nombre de jours disponibles pour ce voyage.",
    },
    group_a: { es: "Marrakech → Erg Chebbi → Marrakech", en: "Marrakech → Erg Chebbi → Marrakech", fr: "Marrakech → Erg Chebbi → Marrakech" },
  },
  programs: [
    { id: "mem-5-6", direction: "a", nights: "5n6d", accent: "#C16542",
      image: "https://images.unsplash.com/photo-1542401886-65d6c61db217?auto=format&fit=crop&w=1800&q=85",
      blurb: { es: "Viaje de 5 noches y 6 días desde Marrakech hasta el desierto del Erg Chebbi y de vuelta a Marrakech.",
               en: "5-night/6-day journey from Marrakech to the Erg Chebbi desert and back to Marrakech.",
               fr: "Voyage de 5 nuits et 6 jours de Marrakech au désert de l'Erg Chebbi et retour à Marrakech." } },
    { id: "mem-6-7", direction: "a", nights: "6n7d", accent: "#D97742",
      image: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1800&q=85",
      blurb: { es: "Viaje de 6 noches y 7 días desde Marrakech hasta el desierto del Erg Chebbi y de vuelta a Marrakech.",
               en: "6-night/7-day journey from Marrakech to the Erg Chebbi desert and back to Marrakech.",
               fr: "Voyage de 6 nuits et 7 jours de Marrakech au désert de l'Erg Chebbi et retour à Marrakech." } },
    { id: "mem-7-8", direction: "a", nights: "7n8d", accent: "#A07042",
      image: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=1800&q=85",
      blurb: { es: "Viaje de 7 noches y 8 días desde Marrakech hasta el desierto del Erg Chebbi y de vuelta a Marrakech.",
               en: "7-night/8-day journey from Marrakech to the Erg Chebbi desert and back to Marrakech.",
               fr: "Voyage de 7 nuits et 8 jours de Marrakech au désert de l'Erg Chebbi et retour à Marrakech." } },
  ],
};

export const HUB_MARRAKECH_ESSAOUIRA = {
  id: "marrakech-essaouira",
  hero: {
    image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=2400&q=85",
    eyebrow: { es: "Viajes por el Sur de Marruecos", en: "Southern Morocco journeys", fr: "Voyages au Sud du Maroc" },
    place: { es: "Marrakech · Essaouira", en: "Marrakech · Essaouira", fr: "Marrakech · Essaouira" },
    title: {
      es: "Marrakech – Essaouira.",
      en: "Marrakech – Essaouira.",
      fr: "Marrakech – Essaouira.",
    },
    subtitle: {
      es: "De la ciudad roja a la perla del Atlántico — un combinado entre dos lugares imprescindibles de Marruecos.",
      en: "From the red city to the Atlantic pearl — a pairing of two Moroccan essentials.",
      fr: "De la ville rouge à la perle de l'Atlantique — une combinaison de deux incontournables du Maroc.",
    },
  },
  intro: {
    overline: { es: "Marrakech – Essaouira – Marrakech", en: "Marrakech – Essaouira – Marrakech", fr: "Marrakech – Essaouira – Marrakech" },
    title: { es: "Dos almas, un mismo viaje.", en: "Two souls, one journey.", fr: "Deux âmes, un seul voyage." },
    body: {
      es: [
        "Te presentamos un combinado entre dos lugares imprescindibles en Marruecos.",
        "Por un lado, la famosísima Marrakech, con su inigualable Plaza Djemaa el Fna, su gran Zoco donde perderse en sus bulliciosas callejuelas repletas de palacios y jardines, talleres de artesanía y locales de última moda.",
        "Por otro lado Essaouira «la Perla del Atlántico». Una bella población de pescadores donde pasear, relajarse… también declarada Patrimonio de la Humanidad por la Unesco.",
      ],
      en: [
        "A two-city pairing of two essentials of Morocco.",
        "On one hand, the famous Marrakech, with its unrivalled Jemaa el-Fna square and grand souk to get lost in — bustling alleys filled with palaces, gardens, artisan workshops and trendy boutiques.",
        "On the other hand Essaouira, «the Pearl of the Atlantic». A beautiful fishing town to stroll and relax — also a UNESCO World Heritage site.",
      ],
      fr: [
        "Une combinaison de deux incontournables du Maroc.",
        "D'un côté la célèbre Marrakech, avec son incomparable place Jemaa el-Fna et son grand souk où se perdre — ruelles animées remplies de palais, jardins, ateliers d'artisans et boutiques tendance.",
        "De l'autre Essaouira « la Perle de l'Atlantique » — ravissante ville de pêcheurs où flâner et se détendre, également classée Patrimoine Mondial de l'UNESCO.",
      ],
    },
  },
  options: {
    overline: { es: "Opciones de viaje Marrakech – Essaouira – Marrakech", en: "Marrakech – Essaouira options", fr: "Options Marrakech – Essaouira" },
    title: { es: "Elige tu travesía.", en: "Choose your route.", fr: "Choisissez votre itinéraire." },
    body: {
      es: "Elige entre las distintas opciones en función de los días disponibles que tengas para realizar este viaje.",
      en: "Pick between the options depending on how many days you have for this journey.",
      fr: "Choisissez parmi les options selon le nombre de jours disponibles pour ce voyage.",
    },
    group_a: { es: "Marrakech ↔ Essaouira", en: "Marrakech ↔ Essaouira", fr: "Marrakech ↔ Essaouira" },
  },
  programs: [
    { id: "mes-4-5", direction: "a", nights: "4n5d", accent: "#3A4A5F",
      image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1800&q=85",
      blurb: { es: "Viaje de 4 noches y 5 días desde Marrakech hasta Essaouira.",
               en: "4-night/5-day journey from Marrakech to Essaouira.",
               fr: "Voyage de 4 nuits et 5 jours de Marrakech à Essaouira." } },
    { id: "mes-6-7", direction: "a", nights: "6n7d", accent: "#5A7F9C",
      image: "https://images.unsplash.com/photo-1570133435536-7ececf000ef6?auto=format&fit=crop&w=1800&q=85",
      blurb: { es: "Viaje de 6 noches y 7 días desde Marrakech hasta Essaouira.",
               en: "6-night/7-day journey from Marrakech to Essaouira.",
               fr: "Voyage de 6 nuits et 7 jours de Marrakech à Essaouira." } },
  ],
};

export { COMMON_NIGHTS };
