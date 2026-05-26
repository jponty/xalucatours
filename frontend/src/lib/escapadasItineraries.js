// Short escapes for /viajes/escapadas. Each escape is paired with a
// preceding editorial block that sets cultural / scenic context.

export const ESCAPADAS_ITEMS = [
  {
    id: "desierto",
    eyebrow: { es: "Escapadas por Marruecos", en: "Morocco short escapes", fr: "Escapades au Maroc" },
    title:   { es: "Escápate al desierto de Marruecos", en: "Escape to the Moroccan desert", fr: "Évadez-vous dans le désert marocain" },
    duration:{ es: "3 días / 2 noches", en: "3 days / 2 nights", fr: "3 jours / 2 nuits" },
    image: "https://images.unsplash.com/photo-1542401886-65d6c61db217?auto=format&fit=crop&w=2200&q=85",
    accent: "#C16542",
    stages: [
      { es: "Erfoud",         en: "Erfoud",         fr: "Erfoud" },
      { es: "Erg Chebbi",     en: "Erg Chebbi",     fr: "Erg Chebbi" },
      { es: "Noche estrellas",en: "Starlit night",  fr: "Nuit étoilée" },
      { es: "Alto Atlas",     en: "High Atlas",     fr: "Haut Atlas" },
      { es: "Valles Imazighen", en: "Imazighen valleys", fr: "Vallées imazighen" },
    ],
    body: {
      es: [
        "¿Quieres desconectar unos días y vivir una experiencia mágica?",
        "Te proponemos una escapada al desierto de dunas más cercano a Europa: el Erg Chebbi, situado en el sur de Marruecos.",
        "La ruta comienza en Erfoud, conocida como «la puerta del desierto», donde nos adentraremos en el Sahara en un vehículo 4x4 con chófer.",
        "Las tradiciones ancestrales de sus gentes, los mercados locales, los colores del desierto y una noche bajo las estrellas convertirán esta experiencia en algo inolvidable.",
        "Posteriormente continuaremos hacia la Cordillera del Alto Atlas, atravesando valles, gargantas y poblados Imazighen donde el tiempo parece haberse detenido.",
      ],
      en: [
        "Want to disconnect for a few days and live something truly magical?",
        "We propose an escape to the closest dune desert to Europe: the Erg Chebbi, in southern Morocco.",
        "The route begins in Erfoud, known as «the gate of the desert», where we head into the Sahara in a 4x4 with private driver.",
        "Ancestral traditions, local markets, desert colours and a night under the stars turn this experience into something unforgettable.",
        "We then continue across the High Atlas range, crossing valleys, gorges and Imazighen villages where time seems to have stopped.",
      ],
      fr: [
        "Envie de déconnecter quelques jours et vivre une expérience magique ?",
        "Nous vous proposons une escapade vers le désert de dunes le plus proche de l'Europe : l'Erg Chebbi, dans le sud du Maroc.",
        "L'itinéraire débute à Erfoud, « porte du désert », où nous pénétrons dans le Sahara en 4x4 avec chauffeur.",
        "Les traditions ancestrales, les marchés locaux, les couleurs du désert et une nuit sous les étoiles rendent cette expérience inoubliable.",
        "Nous poursuivons ensuite vers la cordillère du Haut Atlas, à travers vallées, gorges et villages imazighen où le temps semble s'être arrêté.",
      ],
    },
  },
  {
    id: "alto-atlas",
    eyebrow: { es: "Escapadas por Marruecos", en: "Morocco short escapes", fr: "Escapades au Maroc" },
    title:   { es: "Escápate al Alto Atlas marroquí", en: "Escape to the Moroccan High Atlas", fr: "Évadez-vous dans le Haut Atlas marocain" },
    duration:{ es: "4 días / 3 noches", en: "4 days / 3 nights", fr: "4 jours / 3 nuits" },
    image: "https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=2200&q=85",
    accent: "#5A6B4F",
    stages: [
      { es: "Boumalne Dades",  en: "Boumalne Dades",  fr: "Boumalne Dadès" },
      { es: "Poblados Imazighen", en: "Imazighen villages", fr: "Villages imazighen" },
      { es: "Grutas nómadas", en: "Nomad caves",     fr: "Grottes nomades" },
      { es: "Anti-Atlas",     en: "Anti-Atlas",      fr: "Anti-Atlas" },
      { es: "Valle del Drâa", en: "Drâa valley",     fr: "Vallée du Drâa" },
      { es: "Ouarzazate",     en: "Ouarzazate",      fr: "Ouarzazate" },
    ],
    body: {
      es: [
        "¿Quieres desconectar unos días y descubrir la cultura Amazigh?",
        "Te proponemos una escapada a la cordillera del Alto Atlas, en el sur de Marruecos.",
        "La ruta comienza en Boumalne Dades y continúa en vehículo 4x4 recorriendo pequeños poblados Imazighen donde el tiempo parece haberse detenido.",
        "Atravesaremos valles, gargantas y montañas, visitando incluso familias nómadas que todavía habitan en grutas del Atlas.",
        "La experiencia continúa cruzando el Anti-Atlas y recorriendo el Valle del Draa hasta regresar a Ouarzazate.",
        "Una escapada auténtica que no dejará indiferente a ningún viajero.",
      ],
      en: [
        "Want a few days to disconnect and discover Amazigh culture?",
        "We propose an escape to the High Atlas range in southern Morocco.",
        "The route starts in Boumalne Dades and continues by 4x4 through small Imazighen villages where time seems to have stopped.",
        "We cross valleys, gorges and mountains, even visiting nomad families who still live in caves of the Atlas.",
        "The experience continues across the Anti-Atlas and along the Drâa Valley before returning to Ouarzazate.",
        "An authentic short escape that no traveller leaves unmoved by.",
      ],
      fr: [
        "Envie de quelques jours pour déconnecter et découvrir la culture Amazigh ?",
        "Nous vous proposons une escapade dans la cordillère du Haut Atlas, au sud du Maroc.",
        "L'itinéraire débute à Boumalne Dadès et se poursuit en 4x4 à travers de petits villages imazighen où le temps semble s'être arrêté.",
        "Nous traversons vallées, gorges et montagnes, visitant même des familles nomades qui habitent encore dans les grottes de l'Atlas.",
        "L'expérience continue à travers l'Anti-Atlas et le long de la Vallée du Drâa avant de revenir à Ouarzazate.",
        "Une escapade authentique qui ne laisse aucun voyageur indifférent.",
      ],
    },
  },
  {
    id: "fez",
    eyebrow: { es: "Escapadas por Marruecos", en: "Morocco short escapes", fr: "Escapades au Maroc" },
    title:   { es: "Escápate a la ciudad de Fez", en: "Escape to the city of Fez", fr: "Évadez-vous dans la ville de Fès" },
    duration:{ es: "3 días / 2 noches", en: "3 days / 2 nights", fr: "3 jours / 2 nuits" },
    image: "https://images.unsplash.com/photo-1604940500627-d3f44d1d21c6?auto=format&fit=crop&w=2200&q=85",
    accent: "#A07042",
    stages: [
      { es: "Fez · Medina",     en: "Fez · Medina",     fr: "Fès · Médina" },
      { es: "Madrasas",         en: "Madrasas",         fr: "Médersas" },
      { es: "Curtiduría",       en: "Tannery",          fr: "Tannerie" },
      { es: "Meknès",           en: "Meknès",           fr: "Meknès" },
    ],
    body: {
      es: [
        "Fez es, sin duda, la más auténtica de las Ciudades Imperiales de Marruecos y está considerada la capital cultural y espiritual del país.",
        "Su Medina está reconocida como una de las mejor conservadas del mundo árabe.",
        "Además, esta escapada permite descubrir Meknés, una ciudad imperial más tranquila pero igualmente fascinante, también declarada Patrimonio Mundial por la UNESCO.",
      ],
      en: [
        "Fez is, without doubt, the most authentic of Morocco's imperial cities and is considered the cultural and spiritual capital of the country.",
        "Its Medina is recognised as one of the best preserved in the Arab world.",
        "This escape also lets you discover Meknès, a quieter but equally fascinating imperial city, also declared a UNESCO World Heritage site.",
      ],
      fr: [
        "Fès est sans aucun doute la plus authentique des cités impériales du Maroc et est considérée comme la capitale culturelle et spirituelle du pays.",
        "Sa Médina est reconnue comme l'une des mieux conservées du monde arabe.",
        "Cette escapade permet aussi de découvrir Meknès, cité impériale plus calme mais tout aussi fascinante, également inscrite au Patrimoine Mondial de l'UNESCO.",
      ],
    },
  },
  {
    id: "marrakech",
    eyebrow: { es: "Escapadas por Marruecos", en: "Morocco short escapes", fr: "Escapades au Maroc" },
    title:   { es: "Escápate a la ciudad de Marrakech", en: "Escape to the city of Marrakech", fr: "Évadez-vous dans la ville de Marrakech" },
    duration:{ es: "3 días / 2 noches", en: "3 days / 2 nights", fr: "3 jours / 2 nuits" },
    image: "https://images.unsplash.com/photo-1570133435536-7ececf000ef6?auto=format&fit=crop&w=2200&q=85",
    accent: "#D97742",
    stages: [
      { es: "Marrakech",      en: "Marrakech",      fr: "Marrakech" },
      { es: "Jemaa el-Fna",   en: "Jemaa el-Fna",   fr: "Jemaa el-Fna" },
      { es: "Gran zoco",      en: "Grand souk",     fr: "Grand souk" },
      { es: "Desierto de Agafay", en: "Agafay desert", fr: "Désert d'Agafay" },
      { es: "Noche bajo estrellas", en: "Starlit night", fr: "Nuit sous les étoiles" },
    ],
    body: {
      es: [
        "Te presentamos un combinado perfecto entre la mágica «Ciudad Roja» y la zona desértica de Agafay.",
        "Por un lado, Marrakech, con su famosa Plaza Jemaa el-Fna, su gran zoco y sus bulliciosas callejuelas llenas de palacios, jardines y talleres artesanales.",
        "Por otro lado, Agafay, conocido como el «Desierto Marrakchi», situado a los pies del Atlas y perfecto para disfrutar de una noche bajo las estrellas lejos del bullicio de la ciudad.",
      ],
      en: [
        "A perfect pairing between the magical «Red City» and the Agafay desert.",
        "On one hand Marrakech, with its famous Jemaa el-Fna square, its grand souk and bustling alleys full of palaces, gardens and artisan workshops.",
        "On the other hand Agafay, known as the «Marrakchi desert», at the foot of the Atlas — perfect to enjoy a night under the stars away from the city's buzz.",
      ],
      fr: [
        "Une combinaison parfaite entre la magique « Ville Rouge » et le désert d'Agafay.",
        "D'un côté Marrakech, avec sa célèbre place Jemaa el-Fna, son grand souk et ses ruelles animées pleines de palais, de jardins et d'ateliers d'artisans.",
        "De l'autre Agafay, le « désert marrakchi », au pied de l'Atlas — parfait pour une nuit sous les étoiles loin de l'effervescence de la ville.",
      ],
    },
  },
  {
    id: "tanger",
    eyebrow: { es: "Escapadas por Marruecos", en: "Morocco short escapes", fr: "Escapades au Maroc" },
    title:   { es: "Escápate a la ciudad de Tánger", en: "Escape to the city of Tangier", fr: "Évadez-vous dans la ville de Tanger" },
    duration:{ es: "4 días / 3 noches", en: "4 days / 3 nights", fr: "4 jours / 3 nuits" },
    image: "https://images.unsplash.com/photo-1547234935-80c7145ec969?auto=format&fit=crop&w=2200&q=85",
    accent: "#3A4A5F",
    stages: [
      { es: "Tánger",       en: "Tangier",      fr: "Tanger" },
      { es: "Asilah",       en: "Asilah",       fr: "Asilah" },
      { es: "Tetuán",       en: "Tetouan",      fr: "Tétouan" },
      { es: "Chefchaouen",  en: "Chefchaouen",  fr: "Chefchaouen" },
    ],
    body: {
      es: [
        "Para quienes desean una primera toma de contacto con Marruecos, proponemos esta escapada por el norte del país.",
        "La ruta incluye pueblos costeros como Asilah, en la costa atlántica, o Tetuán, en la costa mediterránea, además del famoso «pueblo azul» de Chefchaouen.",
        "Una combinación perfecta entre cultura, mar, montaña y tradición.",
      ],
      en: [
        "For those wishing a first introduction to Morocco, this short escape across the north of the country is ideal.",
        "The route includes coastal towns such as Asilah on the Atlantic, Tetouan on the Mediterranean, and the famous «blue town» of Chefchaouen.",
        "A perfect blend of culture, sea, mountain and tradition.",
      ],
      fr: [
        "Pour qui souhaite une première découverte du Maroc, cette escapade dans le nord du pays est idéale.",
        "L'itinéraire inclut des villages côtiers comme Asilah sur l'Atlantique, Tétouan sur la Méditerranée, et le célèbre « village bleu » de Chefchaouen.",
        "Un mélange parfait de culture, de mer, de montagne et de tradition.",
      ],
    },
  },
];

// Editorial blocks introducing each escape (same order as ESCAPADAS_ITEMS).
export const ESCAPADAS_EDITORIAL = [
  {
    id: "intro-desierto",
    image: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=2200&q=85",
    eyebrow: { es: "Xaluca Tours · Tu aventura a medida", en: "Xaluca Tours · Tailor-made", fr: "Xaluca Tours · Sur mesure" },
    title: { es: "Tu aventura 100% personalizada", en: "Your adventure, 100% tailor-made", fr: "Votre aventure 100% sur mesure" },
    body: {
      es: [
        "En el desierto marroquí el tiempo parece haberse detenido.",
        "Las interminables dunas de arena, los oasis y las antiguas kasbahs crean un escenario completamente alejado del ritmo acelerado de las grandes ciudades.",
        "Durante siglos, viajeros de todo el mundo han llegado hasta este rincón remoto del Sahara en busca de tranquilidad, aventura y desconexión.",
        "Ya sea que busques relajarte o vivir una experiencia intensa, el desierto marroquí ofrece una combinación única de hospitalidad, paisajes infinitos y autenticidad.",
      ],
      en: [
        "In the Moroccan desert time seems to have stopped.",
        "Endless sand dunes, oases and ancient kasbahs create a setting completely removed from the frenetic pace of the big cities.",
        "For centuries, travellers from all over the world have reached this remote corner of the Sahara seeking calm, adventure and disconnection.",
        "Whether you want to relax or live something intense, the Moroccan desert offers a unique blend of hospitality, infinite landscapes and authenticity.",
      ],
      fr: [
        "Dans le désert marocain, le temps semble s'être arrêté.",
        "Les dunes de sable infinies, les oasis et les anciennes kasbahs créent un décor totalement éloigné du rythme effréné des grandes villes.",
        "Depuis des siècles, des voyageurs du monde entier rejoignent ce coin reculé du Sahara en quête de calme, d'aventure et de déconnexion.",
        "Que vous cherchiez à vous détendre ou à vivre une expérience intense, le désert marocain offre un mélange unique d'hospitalité, de paysages infinis et d'authenticité.",
      ],
    },
  },
  {
    id: "intro-atlas",
    image: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=2200&q=85",
    eyebrow: { es: "El espinazo de Marruecos", en: "Morocco's backbone", fr: "L'échine du Maroc" },
    title: { es: "El Alto Atlas marroquí", en: "The Moroccan High Atlas", fr: "Le Haut Atlas marocain" },
    body: {
      es: [
        "La cordillera del Alto Atlas es una de las regiones más impresionantes y variadas de Marruecos.",
        "Sus montañas atraviesan el centro del país y ofrecen infinitas oportunidades para descubrir paisajes espectaculares, pueblos bereberes y antiguas rutas caravaneras.",
        "Desde las tradicionales construcciones de adobe de Aït Ben Haddou hasta ciudades como Ouarzazate, esta región combina cultura, naturaleza y autenticidad en cada rincón.",
      ],
      en: [
        "The High Atlas range is one of Morocco's most striking and varied regions.",
        "Its mountains run across the centre of the country and offer endless opportunities to discover spectacular landscapes, Berber villages and ancient caravan routes.",
        "From the traditional earthen architecture of Aït Ben Haddou to cities like Ouarzazate, this region blends culture, nature and authenticity in every corner.",
      ],
      fr: [
        "La cordillère du Haut Atlas est l'une des régions les plus impressionnantes et variées du Maroc.",
        "Ses montagnes traversent le centre du pays et offrent d'innombrables occasions de découvrir des paysages spectaculaires, des villages berbères et d'anciennes routes caravanières.",
        "Des constructions traditionnelles en pisé d'Aït Ben Haddou aux villes comme Ouarzazate, cette région mêle culture, nature et authenticité à chaque détour.",
      ],
    },
  },
  {
    id: "intro-fez",
    image: "https://images.unsplash.com/photo-1604940500627-d3f44d1d21c6?auto=format&fit=crop&w=2200&q=85",
    eyebrow: { es: "Patrimonio cultural", en: "Cultural heritage", fr: "Patrimoine culturel" },
    title: { es: "Fez, capital cultural y espiritual", en: "Fez, cultural and spiritual capital", fr: "Fès, capitale culturelle et spirituelle" },
    body: {
      es: [
        "Fez es una de las ciudades más ricas en historia y cultura de todo Marruecos.",
        "Su Medina, declarada Patrimonio de la Humanidad por la UNESCO, está considerada como una de las ciudades medievales mejor conservadas del mundo.",
        "Fundada en el siglo IX, Fez se convirtió rápidamente en uno de los principales centros culturales, religiosos y comerciales del norte de África.",
        "Hoy en día, sigue siendo famosa por sus mezquitas, madrasas, mercados tradicionales y la curtiduría más grande del mundo, donde todavía se utilizan técnicas ancestrales para trabajar el cuero.",
      ],
      en: [
        "Fez is one of the richest cities in history and culture in all of Morocco.",
        "Its Medina, declared a UNESCO World Heritage site, is considered one of the best-preserved medieval cities in the world.",
        "Founded in the 9th century, Fez quickly became one of the leading cultural, religious and commercial centres of North Africa.",
        "Today it remains famous for its mosques, madrasas, traditional markets and the largest tannery in the world, where ancestral leather techniques are still in use.",
      ],
      fr: [
        "Fès est l'une des villes les plus riches en histoire et en culture de tout le Maroc.",
        "Sa Médina, classée au Patrimoine Mondial de l'UNESCO, est considérée comme l'une des cités médiévales les mieux préservées au monde.",
        "Fondée au IXe siècle, Fès est rapidement devenue l'un des principaux centres culturels, religieux et commerciaux d'Afrique du Nord.",
        "Elle reste célèbre aujourd'hui pour ses mosquées, ses médersas, ses marchés traditionnels et la plus grande tannerie au monde, où les techniques ancestrales du cuir sont encore en usage.",
      ],
    },
  },
  {
    id: "intro-marrakech",
    image: "https://images.unsplash.com/photo-1570133435536-7ececf000ef6?auto=format&fit=crop&w=2200&q=85",
    eyebrow: { es: "Ciudad Roja", en: "Red City", fr: "Ville Rouge" },
    title: { es: "Marrakech, la Ciudad Roja", en: "Marrakech, the Red City", fr: "Marrakech, la Ville Rouge" },
    body: {
      es: [
        "Marrakech es una ciudad vibrante, llena de vida, color y energía.",
        "Sus mercados laberínticos, palacios, jardines y mezquitas crean una atmósfera única difícil de encontrar en otro lugar del mundo.",
        "La Plaza Jemaa el-Fna, corazón de la ciudad, reúne músicos, puestos de comida, narradores y artesanos en un espectáculo constante de cultura y tradición.",
      ],
      en: [
        "Marrakech is a vibrant city, full of life, colour and energy.",
        "Its labyrinthine markets, palaces, gardens and mosques create an atmosphere hard to find anywhere else in the world.",
        "Jemaa el-Fna square, the city's heart, gathers musicians, food stalls, storytellers and artisans in a constant spectacle of culture and tradition.",
      ],
      fr: [
        "Marrakech est une ville vibrante, pleine de vie, de couleur et d'énergie.",
        "Ses marchés labyrinthiques, ses palais, ses jardins et ses mosquées créent une atmosphère unique difficile à retrouver ailleurs.",
        "La place Jemaa el-Fna, cœur de la ville, rassemble musiciens, étals de cuisine, conteurs et artisans dans un spectacle constant de culture et de tradition.",
      ],
    },
  },
  {
    id: "intro-tanger",
    image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=2200&q=85",
    eyebrow: { es: "Entre dos mares", en: "Between two seas", fr: "Entre deux mers" },
    title: { es: "Tánger y el norte de Marruecos", en: "Tangier and northern Morocco", fr: "Tanger et le nord du Maroc" },
    body: {
      es: [
        "Tánger es una histórica ciudad situada en la costa norte de Marruecos, entre el Mediterráneo y el Atlántico.",
        "Su mezcla cultural, su proximidad con Europa y su ambiente cosmopolita la convierten en uno de los destinos más especiales del país.",
        "La ciudad destaca por sus playas, mercados, cafeterías históricas y arquitectura llena de influencias internacionales.",
      ],
      en: [
        "Tangier is a historic city on the northern coast of Morocco, between the Mediterranean and the Atlantic.",
        "Its cultural blend, proximity to Europe and cosmopolitan air make it one of the country's most special destinations.",
        "The city stands out for its beaches, markets, historic cafés and architecture rich in international influences.",
      ],
      fr: [
        "Tanger est une ville historique sur la côte nord du Maroc, entre la Méditerranée et l'Atlantique.",
        "Son mélange culturel, sa proximité avec l'Europe et son atmosphère cosmopolite en font l'une des destinations les plus particulières du pays.",
        "La ville se distingue par ses plages, ses marchés, ses cafés historiques et son architecture aux multiples influences internationales.",
      ],
    },
  },
];

export const ESCAPADAS_PILLARS = [
  {
    id: "attention",
    icon: "Headphones",
    title: { es: "Atención personalizada 24/7", en: "Personal 24/7 attention", fr: "Attention personnalisée 24/7" },
    body: {
      es: "Estamos disponibles las 24 horas del día, los 365 días del año, para ayudarte antes, durante y después de tu viaje.",
      en: "We are available 24 hours a day, 365 days a year — before, during and after your trip.",
      fr: "Disponibles 24h/24, 365 jours par an — avant, pendant et après votre voyage.",
    },
  },
  {
    id: "tailor",
    icon: "Pencil",
    title: { es: "Viajes 100% personalizados", en: "100% tailor-made trips", fr: "Voyages 100% personnalisés" },
    body: {
      es: "Diseñamos experiencias totalmente adaptadas a tu disponibilidad, preferencias y tipo de viaje.",
      en: "Every experience is fully tailored to your availability, preferences and travel style.",
      fr: "Chaque expérience est entièrement adaptée à votre disponibilité, vos préférences et votre style de voyage.",
    },
  },
  {
    id: "quality",
    icon: "Award",
    title: { es: "Máxima calidad asegurada", en: "Top-tier quality assured", fr: "Qualité maximale garantie" },
    body: {
      es: "Todos los hoteles y actividades han sido seleccionados personalmente por nuestro equipo para garantizar la mejor experiencia posible.",
      en: "Every hotel and activity has been personally chosen by our team to guarantee the best possible experience.",
      fr: "Tous les hôtels et activités ont été choisis personnellement par notre équipe pour garantir la meilleure expérience possible.",
    },
  },
  {
    id: "guarantee",
    icon: "ShieldCheck",
    title: { es: "Garantía Grup Xaluca", en: "Grup Xaluca guarantee", fr: "Garantie Grup Xaluca" },
    body: {
      es: "Disponemos de hoteles y propiedades propias en el sur de Marruecos, ofreciendo un servicio integral y completamente personalizado.",
      en: "We run our own hotels and properties in southern Morocco, delivering an integral and fully personalised service.",
      fr: "Nous gérons nos propres hôtels et propriétés dans le sud du Maroc, pour un service intégral et entièrement personnalisé.",
    },
  },
];
