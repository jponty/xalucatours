// Itineraries + editorial blocks for the /viajes/nortedemarruecos gateway page.
// Focused on the cultural & landscape north of Morocco: imperial cities,
// Rif mountains, blue town of Chefchaouen and Mediterranean coast.

export const NORTE_ITINERARIES = [
  {
    id: "ciudades-imperiales",
    slug: "ciudades-imperiales",
    link: "tourNorteCiudadesImperiales",
    eyebrow: { es: "Viajes al Norte de Marruecos", en: "Northern Morocco journeys", fr: "Voyages au Nord du Maroc" },
    title:   { es: "Ciudades imperiales",   en: "Imperial cities",   fr: "Cités impériales" },
    duration:{ es: "6 días / 5 noches", en: "6 days / 5 nights", fr: "6 jours / 5 nuits" },
    image: "https://images.unsplash.com/photo-1597212618440-806262de4f6b?auto=format&fit=crop&w=2200&q=85",
    accent: "#A07042",
    stages: [
      { es: "Fez",        en: "Fez",        fr: "Fès" },
      { es: "Meknès",     en: "Meknès",     fr: "Meknès" },
      { es: "Volubilis",  en: "Volubilis",  fr: "Volubilis" },
      { es: "Rabat",      en: "Rabat",      fr: "Rabat" },
      { es: "Marrakech",  en: "Marrakech",  fr: "Marrakech" },
    ],
    body: {
      es: [
        "Marruecos posee un extraordinario legado histórico y arquitectónico que puede descubrirse a través de sus famosas ciudades imperiales.",
        "Para quienes desean realizar una inmersión en el Marruecos más cultural y disponen de pocos días, esta ruta se centra en la zona norte del país para descubrir algunos de sus tesoros más emblemáticos.",
        "A lo largo del viaje, los viajeros descubrirán antiguas medinas, monumentos históricos, mercados tradicionales y ciudades llenas de historia, donde cada rincón refleja siglos de cultura y tradición marroquí.",
      ],
      en: [
        "Morocco holds an extraordinary historical and architectural legacy that can be uncovered through its famous imperial cities.",
        "For travellers who want a deep cultural immersion in just a few days, this route focuses on the north of the country to reveal some of its most emblematic treasures.",
        "Throughout the journey, travellers will discover ancient medinas, historical monuments, traditional markets and cities steeped in history, where every corner mirrors centuries of Moroccan culture and tradition.",
      ],
      fr: [
        "Le Maroc possède un extraordinaire héritage historique et architectural que l'on découvre à travers ses célèbres cités impériales.",
        "Pour ceux qui souhaitent une immersion culturelle profonde en peu de jours, cet itinéraire se concentre sur le nord du pays afin de révéler certains de ses trésors les plus emblématiques.",
        "Tout au long du voyage, les voyageurs découvriront d'anciennes médinas, des monuments historiques, des marchés traditionnels et des villes chargées d'histoire, où chaque recoin reflète des siècles de culture et de tradition marocaines.",
      ],
    },
  },
  {
    id: "fez-tanger",
    slug: "fez-tanger",
    link: "tourNorteTangerFez",
    eyebrow: { es: "Viajes al Norte de Marruecos", en: "Northern Morocco journeys", fr: "Voyages au Nord du Maroc" },
    title:   { es: "Fez – Tánger",   en: "Fez – Tangier",   fr: "Fès – Tanger" },
    duration:{ es: "7 días / 6 noches", en: "7 days / 6 nights", fr: "7 jours / 6 nuits" },
    image: "https://images.unsplash.com/photo-1547234935-80c7145ec969?auto=format&fit=crop&w=2200&q=85",
    accent: "#3A4A5F",
    stages: [
      { es: "Fez",          en: "Fez",          fr: "Fès" },
      { es: "Meknès",       en: "Meknès",       fr: "Meknès" },
      { es: "Volubilis",    en: "Volubilis",    fr: "Volubilis" },
      { es: "Chefchaouen",  en: "Chefchaouen",  fr: "Chefchaouen" },
      { es: "Tetuán",       en: "Tetouan",      fr: "Tétouan" },
      { es: "Tánger",       en: "Tangier",      fr: "Tanger" },
    ],
    body: {
      es: [
        "Te proponemos un viaje por el norte de Marruecos visitando algunas de las ciudades imperiales más fascinantes del país, así como parte de las costas mediterránea y atlántica.",
        "La ruta también incluye Chefchaouen, el famoso «pueblo azul» situado en la cordillera del Rif, uno de los lugares más mágicos y fotogénicos de Marruecos.",
        "En pocos días, el viaje combina mar, montaña y ciudades llenas de cultura, ofreciendo una experiencia completa del norte marroquí.",
      ],
      en: [
        "We invite you on a journey through northern Morocco, visiting some of the country's most fascinating imperial cities, alongside parts of the Mediterranean and Atlantic coasts.",
        "The route also includes Chefchaouen, the famous «blue town» nestled in the Rif mountains — one of the most magical and photogenic places in Morocco.",
        "In just a few days, the journey blends sea, mountain and culturally rich cities, offering a complete experience of the Moroccan north.",
      ],
      fr: [
        "Nous vous proposons un voyage dans le nord du Maroc à la découverte de certaines des cités impériales les plus fascinantes du pays, ainsi que d'une partie des côtes méditerranéenne et atlantique.",
        "L'itinéraire inclut également Chefchaouen, le célèbre « village bleu » niché dans la cordillère du Rif — l'un des lieux les plus magiques et photogéniques du Maroc.",
        "En quelques jours, le voyage mêle mer, montagne et villes pleines de culture, offrant une expérience complète du nord marocain.",
      ],
    },
  },
];

// Editorial narrative blocks (full-width essays) for the Norte page.
export const NORTE_EDITORIAL = [
  {
    id: "riqueza-belleza",
    image: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=2200&q=85",
    eyebrow: { es: "El alma del Norte", en: "The soul of the North", fr: "L'âme du Nord" },
    title: {
      es: "La riqueza y belleza del norte de Marruecos",
      en: "The richness and beauty of northern Morocco",
      fr: "La richesse et la beauté du Nord du Maroc",
    },
    body: {
      es: [
        "Marruecos es una tierra de misterio y encanto, con una cultura e historia fascinantes que esperan ser descubiertas.",
        "Las ciudades imperiales representan algunos de los lugares más bellos e icónicos del país y ofrecen a los viajeros una mirada única al pasado de Marruecos.",
        "Desde la grandiosa arquitectura de las ciudades imperiales hasta las laberínticas calles de Fez, estos destinos históricos están llenos de tesoros ocultos esperando ser explorados.",
        "Las ciudades imperiales son una auténtica ventana al pasado. Están llenas de historia, tradición y vida, permitiendo descubrir una manera de vivir profundamente ligada a la identidad marroquí.",
        "Las cuatro ciudades imperiales albergan algunas de las arquitecturas más impresionantes del mundo árabe y ofrecen además la oportunidad de experimentar la gastronomía marroquí, sus mercados tradicionales y su vibrante vida cultural en todo su esplendor.",
      ],
      en: [
        "Morocco is a land of mystery and charm, with a fascinating culture and history waiting to be discovered.",
        "The imperial cities are among the country's most beautiful and iconic places, offering travellers a unique window into Morocco's past.",
        "From the grand architecture of the imperial cities to the labyrinthine streets of Fez, these historical destinations are full of hidden treasures to be explored.",
        "The imperial cities are a true gateway to the past. Filled with history, tradition and life, they reveal a way of living deeply tied to Moroccan identity.",
        "The four imperial cities hold some of the most impressive architectures of the Arab world, and offer the opportunity to experience Moroccan cuisine, its traditional markets and its vibrant cultural life in full bloom.",
      ],
      fr: [
        "Le Maroc est une terre de mystère et de charme, avec une culture et une histoire fascinantes qui attendent d'être découvertes.",
        "Les cités impériales représentent certains des lieux les plus beaux et emblématiques du pays, et offrent aux voyageurs un regard unique sur le passé du Maroc.",
        "De la grandiose architecture des cités impériales aux ruelles labyrinthiques de Fès, ces destinations historiques regorgent de trésors cachés à explorer.",
        "Les cités impériales sont une véritable fenêtre sur le passé : remplies d'histoire, de tradition et de vie, elles dévoilent un art de vivre profondément lié à l'identité marocaine.",
        "Les quatre cités impériales abritent certaines des architectures les plus impressionnantes du monde arabe, et offrent l'occasion de découvrir la gastronomie marocaine, ses marchés traditionnels et sa vie culturelle vibrante dans toute leur splendeur.",
      ],
    },
  },
  {
    id: "ciudades-historicas",
    image: "https://images.unsplash.com/photo-1570133435536-7ececf000ef6?auto=format&fit=crop&w=2200&q=85",
    eyebrow: { es: "Mosaico del Norte", en: "Northern mosaic", fr: "Mosaïque du Nord" },
    title: {
      es: "Ciudades históricas y destinos emblemáticos",
      en: "Historic cities and emblematic destinations",
      fr: "Villes historiques et destinations emblématiques",
    },
    body: {
      es: [
        "Tanto Fez, Meknès, Volubilis, Chefchaouen, Tetuán y Tánger destacan por ser ciudades únicas, cada una con una personalidad propia.",
        "Desde su impresionante arquitectura hasta sus vibrantes zocos y plazas llenas de vida, estos destinos representan una parada imprescindible para cualquier viajero interesado en descubrir la cultura, la historia y la esencia auténtica de Marruecos.",
        "Cada ciudad ofrece una experiencia diferente: desde la espiritualidad y tradición de Fez hasta el ambiente mediterráneo y cosmopolita de Tánger, pasando por la serenidad azul de Chefchaouen o las ruinas históricas de Volubilis.",
      ],
      en: [
        "Fez, Meknès, Volubilis, Chefchaouen, Tetouan and Tangier all stand out as unique cities, each with its own personality.",
        "From their striking architecture to their lively souks and squares full of life, these destinations are an essential stop for any traveller eager to discover the culture, history and authentic essence of Morocco.",
        "Each city offers a different experience — from the spirituality and tradition of Fez to the Mediterranean, cosmopolitan air of Tangier, the blue serenity of Chefchaouen and the historical ruins of Volubilis.",
      ],
      fr: [
        "Fès, Meknès, Volubilis, Chefchaouen, Tétouan et Tanger se distinguent comme des villes uniques, chacune dotée de sa propre personnalité.",
        "De leur architecture impressionnante à leurs souks vibrants et leurs places pleines de vie, ces destinations constituent un arrêt incontournable pour tout voyageur désireux de découvrir la culture, l'histoire et l'essence authentique du Maroc.",
        "Chaque ville offre une expérience différente — de la spiritualité et de la tradition de Fès à l'atmosphère méditerranéenne et cosmopolite de Tanger, en passant par la sérénité bleue de Chefchaouen ou les ruines historiques de Volubilis.",
      ],
    },
  },
];

// City highlights chip-list for the Norte page.
export const NORTE_CITIES = [
  { id: "fez",         label: { es: "Fez",         en: "Fez",         fr: "Fès" },         hint: { es: "Espiritualidad & tradición", en: "Spirituality & tradition", fr: "Spiritualité & tradition" } },
  { id: "meknes",      label: { es: "Meknès",      en: "Meknès",      fr: "Meknès" },      hint: { es: "Murallas imperiales",         en: "Imperial walls",          fr: "Remparts impériaux" } },
  { id: "volubilis",   label: { es: "Volubilis",   en: "Volubilis",   fr: "Volubilis" },   hint: { es: "Ruinas romanas",              en: "Roman ruins",             fr: "Ruines romaines" } },
  { id: "chefchaouen", label: { es: "Chefchaouen", en: "Chefchaouen", fr: "Chefchaouen" }, hint: { es: "Serenidad azul",              en: "Blue serenity",           fr: "Sérénité bleue" } },
  { id: "tetuan",      label: { es: "Tetuán",      en: "Tetouan",     fr: "Tétouan" },     hint: { es: "Medina andalusí",             en: "Andalusian medina",       fr: "Médina andalouse" } },
  { id: "tanger",      label: { es: "Tánger",      en: "Tangier",     fr: "Tanger" },      hint: { es: "Mediterráneo cosmopolita",    en: "Cosmopolitan Mediterranean", fr: "Méditerranée cosmopolite" } },
];
