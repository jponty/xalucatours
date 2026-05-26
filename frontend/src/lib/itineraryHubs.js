// Hub configurations for the 3 new Sur itinerary hubs.
// Each hub renders intro + list of duration options.
// The individual programme detail pages are not built yet — option CTAs land on the contact form.

const COMMON_NIGHTS = {
  "4n5d": { es: "4 noches · 5 días", en: "4 nights · 5 days", fr: "4 nuits · 5 jours" },
  "5n6d": { es: "5 noches · 6 días", en: "5 nights · 6 days", fr: "5 nuits · 6 jours" },
  "6n7d": { es: "6 noches · 7 días", en: "6 nights · 7 days", fr: "6 nuits · 7 jours" },
  "7n8d": { es: "7 noches · 8 días", en: "7 nights · 8 days", fr: "7 nuits · 8 jours" },
  "8n9d": { es: "8 noches · 9 días", en: "8 nights · 9 days", fr: "8 nuits · 9 jours" },
  "9n10d":{ es: "9 noches · 10 días", en: "9 nights · 10 days", fr: "9 nuits · 10 jours" },
};

export const HUB_ATLAS_DESIERTO = {
  id: "atlas-desierto",
  hero: {
    image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=2400&q=85",
    eyebrow: { es: "Viajes por el Sur de Marruecos", en: "Southern Morocco journeys", fr: "Voyages au Sud du Maroc" },
    place: { es: "Ouarzazate · Alto Atlas · Erg Chebbi · Errachidia", en: "Ouarzazate · High Atlas · Erg Chebbi · Errachidia", fr: "Ouarzazate · Haut Atlas · Erg Chebbi · Errachidia" },
    title: { es: "Atlas – Desierto.", en: "Atlas – Desert.", fr: "Atlas – Désert." },
    subtitle: { es: "Cordillera del Atlas y dunas del Erg Chebbi — la travesía clásica del sur.", en: "Atlas range and Erg Chebbi dunes — the classic southern crossing.", fr: "Cordillère de l'Atlas et dunes de l'Erg Chebbi — la traversée classique du sud." },
  },
  intro: {
    overline: { es: "Atlas – Desierto", en: "Atlas – Desert", fr: "Atlas – Désert" },
    title: { es: "De las cumbres del Atlas a las dunas del Sahara.", en: "From Atlas summits to Sahara dunes.", fr: "Des sommets de l'Atlas aux dunes du Sahara." },
    body: {
      es: ["De Ouarzazate al Erg Chebbi atravesando la cordillera del Alto Atlas, sus pueblos imazighen, valles, oasis y gargantas espectaculares."],
      en: ["From Ouarzazate to the Erg Chebbi across the High Atlas range — its Imazighen villages, valleys, oases and spectacular gorges."],
      fr: ["D'Ouarzazate à l'Erg Chebbi à travers la cordillère du Haut Atlas — ses villages imazighen, vallées, oasis et gorges spectaculaires."],
    },
  },
  options: {
    overline: { es: "Opciones de viaje Atlas – Desierto", en: "Atlas – Desert options", fr: "Options Atlas – Désert" },
    title: { es: "Elige tu travesía.", en: "Choose your route.", fr: "Choisissez votre itinéraire." },
    body: {
      es: "Elige entre las distintas opciones en función de los días disponibles que tengas para realizar este viaje.",
      en: "Pick between the options depending on how many days you have for this journey.",
      fr: "Choisissez parmi les options selon le nombre de jours disponibles pour ce voyage.",
    },
    group_a: { es: "Atlas + Desierto", en: "Atlas + Desert", fr: "Atlas + Désert" },
    group_b: { es: "Desierto + Atlas", en: "Desert + Atlas", fr: "Désert + Atlas" },
  },
  programs: [
    { id: "ad-4-5", direction: "a", nights: "4n5d", accent: "#C16542", image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1800&q=85",
      link: "tourAtlasDesierto45",
      blurb: { es: "Viaje de 4 noches y 5 días por la cordillera del Atlas marroquí y el desierto de dunas del Erg Chebbi en el desierto del Sahara en Marruecos.",
               en: "4-night/5-day journey through the Atlas range and the Erg Chebbi dunes in the Sahara desert.",
               fr: "Voyage de 4 nuits et 5 jours par la cordillère de l'Atlas marocain et les dunes de l'Erg Chebbi dans le Sahara." } },
    { id: "ad-5-6", direction: "a", nights: "5n6d", accent: "#D97742", image: "https://images.unsplash.com/photo-1542401886-65d6c61db217?auto=format&fit=crop&w=1800&q=85",
      blurb: { es: "Viaje de 5 noches y 6 días por la cordillera del Atlas marroquí y el desierto de dunas del Erg Chebbi en el desierto del Sahara en Marruecos.",
               en: "5-night/6-day journey through the Atlas range and the Erg Chebbi dunes in the Sahara desert.",
               fr: "Voyage de 5 nuits et 6 jours par la cordillère de l'Atlas et les dunes de l'Erg Chebbi dans le Sahara." } },
    { id: "ad-6-7", direction: "a", nights: "6n7d", accent: "#A07042", image: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1800&q=85",
      blurb: { es: "Viaje de 6 noches y 7 días por la cordillera del Atlas marroquí y el desierto de dunas del Erg Chebbi en el desierto del Sahara en Marruecos.",
               en: "6-night/7-day journey through the Atlas range and the Erg Chebbi dunes in the Sahara desert.",
               fr: "Voyage de 6 nuits et 7 jours par la cordillère de l'Atlas et les dunes de l'Erg Chebbi dans le Sahara." } },
    { id: "da-4-5", direction: "b", nights: "4n5d", accent: "#5A6B4F", image: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=1800&q=85",
      blurb: { es: "Viaje de 4 noches y 5 días por el desierto de dunas del Erg Chebbi en el desierto del Sáhara y la cordillera del Atlas marroquí.",
               en: "4-night/5-day journey through the Erg Chebbi dunes in the Sahara and the Atlas range.",
               fr: "Voyage de 4 nuits et 5 jours par les dunes de l'Erg Chebbi dans le Sahara et la cordillère de l'Atlas." } },
    { id: "da-5-6", direction: "b", nights: "5n6d", accent: "#7C8B5C", image: "https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1800&q=85",
      blurb: { es: "Viaje de 5 noches y 6 días por el desierto de dunas del Erg Chebbi en el desierto del Sáhara y la cordillera del Atlas marroquí.",
               en: "5-night/6-day journey through the Erg Chebbi dunes in the Sahara and the Atlas range.",
               fr: "Voyage de 5 nuits et 6 jours par les dunes de l'Erg Chebbi dans le Sahara et la cordillère de l'Atlas." } },
    { id: "da-6-7", direction: "b", nights: "6n7d", accent: "#3A4A5F", image: "https://images.unsplash.com/photo-1570133435536-7ececf000ef6?auto=format&fit=crop&w=1800&q=85",
      blurb: { es: "Viaje de 6 noches y 7 días por el desierto de dunas del Erg Chebbi en el desierto del Sáhara y la cordillera del Atlas marroquí.",
               en: "6-night/7-day journey through the Erg Chebbi dunes in the Sahara and the Atlas range.",
               fr: "Voyage de 6 nuits et 7 jours par les dunes de l'Erg Chebbi dans le Sahara et la cordillère de l'Atlas." } },
  ],
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

/* ============================================================
   /viajes/gransur/* — Hubs intermedios desde la página
   /viajes/marruecos (Gran Sur de Marruecos).
   Cada hub muestra opciones de duración agrupadas por dirección.
============================================================ */

const T = (es, en, fr) => ({ es, en, fr });
const BLURB_FR = (n, d) => (origen, destino) => T(
  `Viaje de ${n} noches y ${d} días desde ${origen} hasta ${destino}.`,
  `${n}-night/${d}-day journey from ${origen} to ${destino}.`,
  `Voyage de ${n} nuits et ${d} jours de ${origen} à ${destino}.`,
);
const BLURB_SIDI = (n, d) => (origen, destino) => T(
  `Viaje de ${n} noches y ${d} días desde ${origen} hasta ${destino} pasando por el lago Aguelmame Sidi Ali.`,
  `${n}-night/${d}-day journey from ${origen} to ${destino} via the Aguelmame Sidi Ali lake.`,
  `Voyage de ${n} nuits et ${d} jours de ${origen} à ${destino} en passant par le lac Aguelmame Sidi Ali.`,
);
const BLURB_KASBAH = (n, d) => (origen, destino) => T(
  `Viaje de ${n} noches y ${d} días desde ${origen} hasta ${destino} recorriendo la ruta de las mil kasbahs.`,
  `${n}-night/${d}-day journey from ${origen} to ${destino} along the route of a thousand kasbahs.`,
  `Voyage de ${n} nuits et ${d} jours de ${origen} à ${destino} par la route des mille kasbahs.`,
);

export const HUB_GRANSUR_FEZ_RAK = {
  id: "gransur-fez-rak",
  hero: {
    image: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=2400&q=85",
    eyebrow: T("Viajes por todo Marruecos", "Journeys across Morocco", "Voyages à travers le Maroc"),
    place: T("Fez · Atlas · Erg Chebbi · Marrakech", "Fez · Atlas · Erg Chebbi · Marrakech", "Fès · Atlas · Erg Chebbi · Marrakech"),
    title: T("Gran Sur · Fez – Marrakech.", "Grand South · Fez – Marrakech.", "Grand Sud · Fès – Marrakech."),
    subtitle: T(
      "De la medina más antigua del mundo árabe a la ciudad roja — el sur de Marruecos en una sola travesía.",
      "From the oldest medina in the Arab world to the red city — southern Morocco in one crossing.",
      "De la plus ancienne médina du monde arabe à la ville rouge — le sud du Maroc en une seule traversée.",
    ),
  },
  intro: {
    overline: T("Gran Sur · Fez – Marrakech", "Grand South · Fez – Marrakech", "Grand Sud · Fès – Marrakech"),
    title: T("Una travesía cinematográfica del norte imperial al sur sahariano.", "A cinematic crossing from the imperial north to the Saharan south.", "Une traversée cinématographique du nord impérial au sud saharien."),
    body: {
      es: [
        "Gran Sur · Fez – Marrakech es la travesía clásica para descubrir lo mejor de Marruecos en un solo viaje.",
        "La ruta arranca en Fez, cuya medina patrimonio UNESCO es el laberinto vivo más fascinante del mundo árabe, y cruza el Medio Atlas con sus bosques de cedros y sus pueblos bereberes.",
        "Desde Erfoud nos adentramos en el Erg Chebbi, un mar de dunas de 150 metros, donde dormiremos en bivouac de lujo bajo un cielo absolutamente estrellado.",
        "Tras la ruta de las mil kasbahs y el imponente Aït Benhaddou, atravesaremos el Alto Atlas por el puerto de Tizi n'Tichka para terminar en Marrakech, la ciudad roja.",
      ],
      en: [
        "Grand South · Fez – Marrakech is the classic crossing to discover the best of Morocco in a single journey.",
        "The route starts in Fez — its UNESCO medina is the most fascinating living labyrinth in the Arab world — and crosses the Middle Atlas with its cedar forests and Berber villages.",
        "From Erfoud we enter the Erg Chebbi, a sea of 150-metre dunes, sleeping in a luxury bivouac under an absolute starry sky.",
        "After the route of a thousand kasbahs and the imposing Aït Benhaddou, we cross the High Atlas via the Tizi n'Tichka pass to finish in Marrakech, the red city.",
      ],
      fr: [
        "Grand Sud · Fès – Marrakech est la traversée classique pour découvrir le meilleur du Maroc en un seul voyage.",
        "L'itinéraire débute à Fès — sa médina UNESCO est le labyrinthe vivant le plus fascinant du monde arabe — et traverse le Moyen Atlas avec ses forêts de cèdres et ses villages berbères.",
        "Depuis Erfoud, nous entrons dans l'Erg Chebbi, une mer de dunes de 150 mètres, pour dormir en bivouac de luxe sous un ciel étoilé absolu.",
        "Après la route des mille kasbahs et l'imposant Aït Benhaddou, nous traversons le Haut Atlas par le col Tizi n'Tichka pour terminer à Marrakech, la ville rouge.",
      ],
    },
  },
  options: {
    overline: T("Opciones de viaje del Gran Sur de Marruecos desde Fez hasta Marrakech", "Grand South of Morocco options from Fez to Marrakech", "Options Grand Sud du Maroc, de Fès à Marrakech"),
    title: T("Elige tu travesía.", "Choose your route.", "Choisissez votre itinéraire."),
    body: T(
      "Elige entre las distintas opciones en función de los días disponibles que tengas para realizar este viaje.",
      "Pick between the options depending on how many days you have for this journey.",
      "Choisissez parmi les options selon le nombre de jours disponibles pour ce voyage.",
    ),
    group_a: T("Fez → Marrakech", "Fez → Marrakech", "Fès → Marrakech"),
    group_b: T("Marrakech → Fez", "Marrakech → Fez", "Marrakech → Fès"),
  },
  programs: [
    { id: "fr-6-7",  direction: "a", nights: "6n7d",  accent: "#C16542", image: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=1800&q=85", blurb: BLURB_FR(6,7)("Fez","Marrakech") },
    { id: "fr-7-8",  direction: "a", nights: "7n8d",  accent: "#D97742", image: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1800&q=85", blurb: BLURB_FR(7,8)("Fez","Marrakech") },
    { id: "fr-8-9",  direction: "a", nights: "8n9d",  accent: "#A07042", image: "https://images.unsplash.com/photo-1542401886-65d6c61db217?auto=format&fit=crop&w=1800&q=85", blurb: BLURB_FR(8,9)("Fez","Marrakech") },
    { id: "fr-9-10", direction: "a", nights: "9n10d", accent: "#D4A373", image: "https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1800&q=85", link: "tourFezRak910", blurb: BLURB_FR(9,10)("Fez","Marrakech") },
    { id: "rf-6-7",  direction: "b", nights: "6n7d",  accent: "#5A6B4F", image: "https://images.unsplash.com/photo-1570133435536-7ececf000ef6?auto=format&fit=crop&w=1800&q=85", link: "tourMarrakechFez67",  blurb: BLURB_FR(6,7)("Marrakech","Fez") },
    { id: "rf-7-8",  direction: "b", nights: "7n8d",  accent: "#7C8B5C", image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1800&q=85", link: "tourMarrakechFez78",  blurb: BLURB_FR(7,8)("Marrakech","Fez") },
    { id: "rf-8-9",  direction: "b", nights: "8n9d",  accent: "#A07042", image: "https://images.unsplash.com/photo-1604940500627-d3f44d1d21c6?auto=format&fit=crop&w=1800&q=85", link: "tourMarrakechFez89",  blurb: BLURB_FR(8,9)("Marrakech","Fez") },
    { id: "rf-9-10", direction: "b", nights: "9n10d", accent: "#3A4A5F", image: "https://images.unsplash.com/photo-1547234935-80c7145ec969?auto=format&fit=crop&w=1800&q=85", link: "tourMarrakechFez910", blurb: BLURB_FR(9,10)("Marrakech","Fez") },
  ],
};

export const HUB_GRANSUR_FEZ_SIDIALI_RAK = {
  id: "gransur-fez-sidiali-rak",
  hero: {
    image: "https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=2400&q=85",
    eyebrow: T("Viajes por todo Marruecos", "Journeys across Morocco", "Voyages à travers le Maroc"),
    place: T("Fez · Medio Atlas · Sidi Ali · Erg Chebbi · Marrakech", "Fez · Middle Atlas · Sidi Ali · Erg Chebbi · Marrakech", "Fès · Moyen Atlas · Sidi Ali · Erg Chebbi · Marrakech"),
    title: T("Gran Sur + Medio Atlas.", "Grand South + Middle Atlas.", "Grand Sud + Moyen Atlas."),
    subtitle: T(
      "La travesía clásica ampliada con el Medio Atlas y el lago Aguelmame Sidi Ali — más profundidad, más contrastes.",
      "The classic crossing extended with the Middle Atlas and Aguelmame Sidi Ali lake — more depth, more contrasts.",
      "La traversée classique enrichie du Moyen Atlas et du lac Aguelmame Sidi Ali — plus de profondeur, plus de contrastes.",
    ),
  },
  intro: {
    overline: T("Fez – Sidi Ali – Marrakech", "Fez – Sidi Ali – Marrakech", "Fès – Sidi Ali – Marrakech"),
    title: T("El Medio Atlas se suma a la gran travesía.", "The Middle Atlas joins the great crossing.", "Le Moyen Atlas rejoint la grande traversée."),
    body: {
      es: [
        "Una versión más amplia y serena de la ruta clásica Fez – Marrakech.",
        "Se incorpora el Medio Atlas con su bosque de cedros gigantes, los pueblos de Azrou e Ifrane y el espectacular lago Aguelmame Sidi Ali, oasis alpino a 2.000 metros de altitud.",
        "El recorrido sigue después hacia el Erg Chebbi, la ruta de las mil kasbahs, el Alto Atlas y, finalmente, Marrakech.",
      ],
      en: [
        "A broader, more serene version of the classic Fez – Marrakech route.",
        "It adds the Middle Atlas with its giant cedar forest, the villages of Azrou and Ifrane and the spectacular Aguelmame Sidi Ali lake — an alpine oasis at 2,000 metres.",
        "The route then continues toward the Erg Chebbi, the route of a thousand kasbahs, the High Atlas and finally Marrakech.",
      ],
      fr: [
        "Une version plus ample et plus sereine de la route classique Fès – Marrakech.",
        "S'y ajoute le Moyen Atlas avec sa forêt de cèdres géants, les villages d'Azrou et Ifrane et le spectaculaire lac Aguelmame Sidi Ali, oasis alpin à 2 000 mètres.",
        "Le parcours continue ensuite vers l'Erg Chebbi, la route des mille kasbahs, le Haut Atlas et enfin Marrakech.",
      ],
    },
  },
  options: {
    overline: T("Opciones de viaje del Gran Sur de Marruecos y Medio Atlas desde Fez hasta Marrakech", "Grand South + Middle Atlas options from Fez to Marrakech", "Options Grand Sud + Moyen Atlas, Fès à Marrakech"),
    title: T("Elige tu travesía.", "Choose your route.", "Choisissez votre itinéraire."),
    body: T(
      "Elige entre las distintas opciones en función de los días disponibles que tengas para realizar este viaje.",
      "Pick between the options depending on how many days you have for this journey.",
      "Choisissez parmi les options selon le nombre de jours disponibles pour ce voyage.",
    ),
    group_a: T("Fez → Sidi Ali → Marrakech", "Fez → Sidi Ali → Marrakech", "Fès → Sidi Ali → Marrakech"),
    group_b: T("Marrakech → Sidi Ali → Fez", "Marrakech → Sidi Ali → Fez", "Marrakech → Sidi Ali → Fès"),
  },
  programs: [
    { id: "fsm-7-8",  direction: "a", nights: "7n8d",  accent: "#5A6B4F", image: "https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1800&q=85", blurb: BLURB_SIDI(7,8)("Fez","Marrakech") },
    { id: "fsm-8-9",  direction: "a", nights: "8n9d",  accent: "#7C8B5C", image: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1800&q=85", blurb: BLURB_SIDI(8,9)("Fez","Marrakech") },
    { id: "fsm-9-10", direction: "a", nights: "9n10d", accent: "#A07042", image: "https://images.unsplash.com/photo-1542401886-65d6c61db217?auto=format&fit=crop&w=1800&q=85", blurb: BLURB_SIDI(9,10)("Fez","Marrakech") },
    { id: "msf-7-8",  direction: "b", nights: "7n8d",  accent: "#C16542", image: "https://images.unsplash.com/photo-1570133435536-7ececf000ef6?auto=format&fit=crop&w=1800&q=85", blurb: BLURB_SIDI(7,8)("Marrakech","Fez") },
    { id: "msf-8-9",  direction: "b", nights: "8n9d",  accent: "#D97742", image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1800&q=85", blurb: BLURB_SIDI(8,9)("Marrakech","Fez") },
    { id: "msf-9-10", direction: "b", nights: "9n10d", accent: "#3A4A5F", image: "https://images.unsplash.com/photo-1547234935-80c7145ec969?auto=format&fit=crop&w=1800&q=85", blurb: BLURB_SIDI(9,10)("Marrakech","Fez") },
  ],
};

export const HUB_GRANSUR_OUARZA_FEZ = {
  id: "gransur-ouarzazate-sidiali-fez",
  hero: {
    image: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=2400&q=85",
    eyebrow: T("Viajes por todo Marruecos", "Journeys across Morocco", "Voyages à travers le Maroc"),
    place: T("Ouarzazate · Alto Atlas · Sahara · Sidi Ali · Fez", "Ouarzazate · High Atlas · Sahara · Sidi Ali · Fez", "Ouarzazate · Haut Atlas · Sahara · Sidi Ali · Fès"),
    title: T("Alto Atlas – Desierto – Fez.", "High Atlas – Desert – Fez.", "Haut Atlas – Désert – Fès."),
    subtitle: T(
      "De las cumbres del Atlas al laberinto de Fez, atravesando el Sahara y el oasis alpino de Sidi Ali.",
      "From the Atlas summits to the labyrinth of Fez, crossing the Sahara and the Sidi Ali alpine oasis.",
      "Des sommets de l'Atlas au labyrinthe de Fès, en traversant le Sahara et l'oasis alpine de Sidi Ali.",
    ),
  },
  intro: {
    overline: T("Ouarzazate – Sidi Ali – Fez", "Ouarzazate – Sidi Ali – Fez", "Ouarzazate – Sidi Ali – Fès"),
    title: T("Una ruta inversa, del Atlas hacia el norte imperial.", "A reverse route, from the Atlas to the imperial north.", "Un itinéraire inversé, de l'Atlas vers le nord impérial."),
    body: {
      es: [
        "La ruta arranca en Ouarzazate, capital del cine y puerta del Sahara, y se adentra en la ruta de las mil kasbahs hasta el Erg Chebbi.",
        "Tras la noche en el desierto, ascendemos al Medio Atlas con parada obligada en el lago Aguelmame Sidi Ali y el bosque de cedros gigantes.",
        "El viaje culmina en Fez, donde la medina viva más grande del mundo nos espera con sus zocos, sus tenerías y sus madrasas.",
      ],
      en: [
        "The route starts in Ouarzazate, capital of cinema and gateway to the Sahara, threading the route of a thousand kasbahs to the Erg Chebbi.",
        "After the desert night, we climb into the Middle Atlas with a mandatory stop at the Aguelmame Sidi Ali lake and the giant cedar forest.",
        "The journey culminates in Fez, where the world's largest living medina awaits with its souks, tanneries and madrasas.",
      ],
      fr: [
        "L'itinéraire débute à Ouarzazate, capitale du cinéma et porte du Sahara, et s'engage sur la route des mille kasbahs jusqu'à l'Erg Chebbi.",
        "Après la nuit au désert, nous montons dans le Moyen Atlas avec un arrêt obligatoire au lac Aguelmame Sidi Ali et à la forêt de cèdres géants.",
        "Le voyage culmine à Fès, où la plus grande médina vivante au monde nous attend avec ses souks, ses tanneries et ses médersas.",
      ],
    },
  },
  options: {
    overline: T("Opciones de viaje del Alto Atlas desde Ouarzazate hasta Fez", "High Atlas options from Ouarzazate to Fez", "Options Haut Atlas, Ouarzazate à Fès"),
    title: T("Elige tu travesía.", "Choose your route.", "Choisissez votre itinéraire."),
    body: T(
      "Elige entre las distintas opciones en función de los días disponibles que tengas para realizar este viaje.",
      "Pick between the options depending on how many days you have for this journey.",
      "Choisissez parmi les options selon le nombre de jours disponibles pour ce voyage.",
    ),
    group_a: T("Ouarzazate → Sidi Ali → Fez", "Ouarzazate → Sidi Ali → Fez", "Ouarzazate → Sidi Ali → Fès"),
    group_b: T("Fez → Sidi Ali → Ouarzazate", "Fez → Sidi Ali → Ouarzazate", "Fès → Sidi Ali → Ouarzazate"),
  },
  programs: [
    { id: "of-5-6", direction: "a", nights: "5n6d", accent: "#A07042", image: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1800&q=85", blurb: BLURB_SIDI(5,6)("Ouarzazate","Fez") },
    { id: "of-6-7", direction: "a", nights: "6n7d", accent: "#D97742", image: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=1800&q=85", blurb: BLURB_SIDI(6,7)("Ouarzazate","Fez") },
    { id: "of-7-8", direction: "a", nights: "7n8d", accent: "#C16542", image: "https://images.unsplash.com/photo-1542401886-65d6c61db217?auto=format&fit=crop&w=1800&q=85", blurb: BLURB_SIDI(7,8)("Ouarzazate","Fez") },
    { id: "fo-5-6", direction: "b", nights: "5n6d", accent: "#5A6B4F", image: "https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1800&q=85", blurb: BLURB_SIDI(5,6)("Fez","Ouarzazate") },
    { id: "fo-6-7", direction: "b", nights: "6n7d", accent: "#7C8B5C", image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1800&q=85", blurb: BLURB_SIDI(6,7)("Fez","Ouarzazate") },
    { id: "fo-7-8", direction: "b", nights: "7n8d", accent: "#3A4A5F", image: "https://images.unsplash.com/photo-1570133435536-7ececf000ef6?auto=format&fit=crop&w=1800&q=85", blurb: BLURB_SIDI(7,8)("Fez","Ouarzazate") },
  ],
};

export const HUB_GRANSUR_TANGER_RAK = {
  id: "gransur-tanger-rak",
  hero: {
    image: "https://images.unsplash.com/photo-1570133435536-7ececf000ef6?auto=format&fit=crop&w=2400&q=85",
    eyebrow: T("Viajes por todo Marruecos", "Journeys across Morocco", "Voyages à travers le Maroc"),
    place: T("Tánger · Chefchaouen · Fez · Sahara · Marrakech", "Tangier · Chefchaouen · Fez · Sahara · Marrakech", "Tanger · Chefchaouen · Fès · Sahara · Marrakech"),
    title: T("Tánger – Marrakech.", "Tangier – Marrakech.", "Tanger – Marrakech."),
    subtitle: T(
      "Del Mediterráneo al desierto y del azul de Chefchaouen al rojo de Marrakech — la travesía más larga y completa.",
      "From the Mediterranean to the desert, from Chefchaouen blue to Marrakech red — the longest, most complete crossing.",
      "De la Méditerranée au désert, du bleu de Chefchaouen au rouge de Marrakech — la traversée la plus longue et complète.",
    ),
  },
  intro: {
    overline: T("Tánger – Marrakech", "Tangier – Marrakech", "Tanger – Marrakech"),
    title: T("La travesía total: norte, desierto y sur.", "The total crossing: north, desert and south.", "La traversée totale : nord, désert et sud."),
    body: {
      es: [
        "Una travesía completa que recorre Marruecos de norte a sur por la mítica ruta de las mil kasbahs.",
        "Comenzamos en Tánger, cruce de civilizaciones; continuamos hasta Chefchaouen, el pueblo azul del Rif, y descendemos a Fez para sumergirnos en la medina más antigua del mundo árabe.",
        "Después del Medio Atlas y el cedro gigante, el desierto del Erg Chebbi nos regala una noche bajo las estrellas.",
        "Cerramos en Marrakech, la ciudad roja, tras atravesar las gargantas del Todra, el Dades, Aït Benhaddou y el Alto Atlas por Tizi n'Tichka.",
      ],
      en: [
        "A full crossing of Morocco from north to south along the mythical route of a thousand kasbahs.",
        "We begin in Tangier, crossroads of civilisations; continue to Chefchaouen, the blue town of the Rif, and descend to Fez to enter the oldest medina in the Arab world.",
        "After the Middle Atlas and giant cedars, the Erg Chebbi desert grants us a night under the stars.",
        "We close in Marrakech, the red city, after crossing the Todra and Dades gorges, Aït Benhaddou and the High Atlas via Tizi n'Tichka.",
      ],
      fr: [
        "Une traversée complète du Maroc, du nord au sud, par la mythique route des mille kasbahs.",
        "Nous commençons à Tanger, carrefour des civilisations ; continuons jusqu'à Chefchaouen, la ville bleue du Rif, et descendons à Fès pour plonger dans la plus ancienne médina du monde arabe.",
        "Après le Moyen Atlas et les cèdres géants, le désert de l'Erg Chebbi nous offre une nuit sous les étoiles.",
        "Nous terminons à Marrakech, la ville rouge, après les gorges du Todra et du Dadès, Aït Benhaddou et le Haut Atlas par Tizi n'Tichka.",
      ],
    },
  },
  options: {
    overline: T("Opciones de viaje de la ruta de las mil kasbahs desde Tánger hasta Marrakech", "Route of a thousand kasbahs options from Tangier to Marrakech", "Options route des mille kasbahs, Tanger à Marrakech"),
    title: T("Elige tu travesía.", "Choose your route.", "Choisissez votre itinéraire."),
    body: T(
      "Elige entre las distintas opciones en función de los días disponibles que tengas para realizar este viaje.",
      "Pick between the options depending on how many days you have for this journey.",
      "Choisissez parmi les options selon le nombre de jours disponibles pour ce voyage.",
    ),
    group_a: T("Tánger → Marrakech", "Tangier → Marrakech", "Tanger → Marrakech"),
  },
  programs: [
    { id: "tr-8-9",  direction: "a", nights: "8n9d",  accent: "#3A4A5F", image: "https://images.unsplash.com/photo-1547234935-80c7145ec969?auto=format&fit=crop&w=1800&q=85", blurb: BLURB_KASBAH(8,9)("Tánger","Marrakech") },
    { id: "tr-9-10", direction: "a", nights: "9n10d", accent: "#5A7F9C", image: "https://images.unsplash.com/photo-1570133435536-7ececf000ef6?auto=format&fit=crop&w=1800&q=85", blurb: BLURB_KASBAH(9,10)("Tánger","Marrakech") },
  ],
};
