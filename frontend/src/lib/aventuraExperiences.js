// Adventure experiences + editorial + brand pillars for /viajes/aventura.
// Focus: enduro, trekking, 4x4, bivouacs, oasis, nomad life, Dakar experience.

export const AVENTURA_EXPERIENCES = [
  {
    id: "enduro-desierto",
    icon: "Bike",
    accent: "#C16542",
    level: { es: "Intenso · piloto experimentado", en: "Intense · experienced rider", fr: "Intense · pilote expérimenté" },
    duration: { es: "5 – 8 días", en: "5 – 8 days", fr: "5 – 8 jours" },
    type: { es: "Moto enduro", en: "Enduro motorcycle", fr: "Moto enduro" },
    image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1800&q=85",
    title: { es: "Enduro por el desierto",        en: "Desert enduro",            fr: "Enduro dans le désert" },
    blurb: {
      es: "Pilotar una enduro entre dunas y pistas infinitas del Sahara — velocidad, silencio e inmensidad.",
      en: "Ride an enduro between dunes and endless Saharan tracks — speed, silence and immensity.",
      fr: "Pilotez une enduro entre dunes et pistes infinies du Sahara — vitesse, silence et immensité.",
    },
  },
  {
    id: "trekking-atlas",
    icon: "Mountain",
    accent: "#5A6B4F",
    level: { es: "Medio · buena forma física", en: "Medium · good fitness", fr: "Moyen · bonne condition" },
    duration: { es: "4 – 7 días", en: "4 – 7 days", fr: "4 – 7 jours" },
    type: { es: "Trekking", en: "Trekking", fr: "Trekking" },
    image: "https://images.unsplash.com/photo-1542401886-65d6c61db217?auto=format&fit=crop&w=1800&q=85",
    title: { es: "Trekking por el Alto Atlas", en: "High Atlas trekking", fr: "Trekking dans le Haut Atlas" },
    blurb: {
      es: "Senderos serpenteantes, pueblos bereberes y picos nevados. Toubkal, Aït Bouguemez y valles secretos.",
      en: "Winding paths, Berber villages and snowy peaks. Toubkal, Aït Bouguemez and secret valleys.",
      fr: "Sentiers sinueux, villages berbères et sommets enneigés. Toubkal, Aït Bouguemez et vallées secrètes.",
    },
  },
  {
    id: "expediciones-4x4",
    icon: "Truck",
    accent: "#A07042",
    level: { es: "Accesible · todos los niveles", en: "Accessible · all levels", fr: "Accessible · tous niveaux" },
    duration: { es: "3 – 9 días", en: "3 – 9 days", fr: "3 – 9 jours" },
    type: { es: "4x4 off-road", en: "4x4 off-road", fr: "4x4 tout-terrain" },
    image: "https://images.unsplash.com/photo-1547234935-80c7145ec969?auto=format&fit=crop&w=1800&q=85",
    title: { es: "Expediciones 4x4", en: "4x4 expeditions", fr: "Expéditions 4x4" },
    blurb: {
      es: "Pistas perdidas del Anti-Atlas, gargantas inmensas y oasis dormidos — todo en 4x4 con chófer-guía.",
      en: "Forgotten Anti-Atlas tracks, vast gorges and sleeping oases — all in 4x4 with private driver-guide.",
      fr: "Pistes oubliées de l'Anti-Atlas, gorges immenses et oasis endormies — en 4x4 avec chauffeur-guide.",
    },
  },
  {
    id: "bivouacs-sahara",
    icon: "Tent",
    accent: "#D4A373",
    level: { es: "Suave · todos los públicos", en: "Soft · all audiences", fr: "Doux · tous publics" },
    duration: { es: "1 – 3 noches", en: "1 – 3 nights", fr: "1 – 3 nuits" },
    type: { es: "Bivouac", en: "Bivouac", fr: "Bivouac" },
    image: "https://images.unsplash.com/photo-1542401886-65d6c61db217?auto=format&fit=crop&w=1800&q=85",
    title: { es: "Noches en bivouacs del Sahara", en: "Nights in Sahara bivouacs", fr: "Nuits en bivouacs du Sahara" },
    blurb: {
      es: "Cenas bereberes a la luz del fuego, té de menta y noches bajo la Vía Láctea en tiendas caïdal.",
      en: "Berber dinners by firelight, mint tea and Milky-Way nights in caïdal tents.",
      fr: "Dîners berbères à la lueur du feu, thé à la menthe et nuits sous la Voie lactée en tentes caïdal.",
    },
  },
  {
    id: "oasis-kasbahs",
    icon: "Palmtree",
    accent: "#7C8B5C",
    level: { es: "Cultural · todos los públicos", en: "Cultural · all audiences", fr: "Culturel · tous publics" },
    duration: { es: "3 – 5 días", en: "3 – 5 days", fr: "3 – 5 jours" },
    type: { es: "Ruta cultural", en: "Cultural route", fr: "Route culturelle" },
    image: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=1800&q=85",
    title: { es: "Rutas por oasis y kasbahs", en: "Oasis & kasbah routes", fr: "Routes des oasis et kasbahs" },
    blurb: {
      es: "Drâa, Skoura y Aït Benhaddou. Palmerales centenarios, kasbahs de pisé y aldeas perdidas.",
      en: "Drâa, Skoura and Aït Benhaddou. Century-old palm groves, earthen kasbahs and forgotten villages.",
      fr: "Drâa, Skoura et Aït Benhaddou. Palmeraies centenaires, kasbahs en pisé et villages oubliés.",
    },
  },
  {
    id: "experiencias-nomadas",
    icon: "Flame",
    accent: "#B95C3A",
    level: { es: "Inmersiva · sensibilidad cultural", en: "Immersive · cultural sensitivity", fr: "Immersive · sensibilité culturelle" },
    duration: { es: "2 – 4 días", en: "2 – 4 days", fr: "2 – 4 jours" },
    type: { es: "Experiencia humana", en: "Human experience", fr: "Expérience humaine" },
    image: "https://images.unsplash.com/photo-1570133435536-7ececf000ef6?auto=format&fit=crop&w=1800&q=85",
    title: { es: "Experiencias nómadas", en: "Nomadic experiences", fr: "Expériences nomades" },
    blurb: {
      es: "Convive con familias nómadas del Sahara: ordeñar cabras, cocinar al fuego y leer las estrellas.",
      en: "Live with Saharan nomad families: milk goats, cook over fire and read the stars.",
      fr: "Vivez avec des familles nomades du Sahara : traire les chèvres, cuisiner au feu et lire les étoiles.",
    },
  },
  {
    id: "campamentos-dunas",
    icon: "Sparkles",
    accent: "#E0A352",
    level: { es: "Premium · confort en el desierto", en: "Premium · desert comfort", fr: "Premium · confort au désert" },
    duration: { es: "1 – 3 noches", en: "1 – 3 nights", fr: "1 – 3 nuits" },
    type: { es: "Glamping desierto", en: "Desert glamping", fr: "Glamping désert" },
    image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1800&q=85",
    title: { es: "Campamentos en dunas", en: "Dune camps", fr: "Campements sur dunes" },
    blurb: {
      es: "Tiendas privadas con cama king, baño completo y cena cinco estrellas en el corazón de Erg Chigaga.",
      en: "Private tents with king-size beds, en-suite bathroom and five-star dinner in the heart of Erg Chigaga.",
      fr: "Tentes privées avec lit king-size, salle de bain complète et dîner cinq étoiles au cœur de l'Erg Chigaga.",
    },
  },
  {
    id: "dakar-experience",
    icon: "Trophy",
    accent: "#1F2A44",
    level: { es: "Extremo · piloto avanzado", en: "Extreme · advanced rider", fr: "Extrême · pilote avancé" },
    duration: { es: "7 – 10 días", en: "7 – 10 days", fr: "7 – 10 jours" },
    type: { es: "Rally raid", en: "Rally raid", fr: "Rallye raid" },
    image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1800&q=85",
    title: { es: "Aventura Dakar Experience", en: "Dakar Experience adventure", fr: "Aventure Dakar Experience" },
    blurb: {
      es: "Réplica de tramos míticos del Dakar marroquí: navegación con roadbook, asistencia mecánica y bivouac.",
      en: "Replica of mythical stages of the Moroccan Dakar: roadbook navigation, mechanical support and bivouac.",
      fr: "Réplique d'étapes mythiques du Dakar marocain : navigation au roadbook, assistance mécanique et bivouac.",
    },
  },
];

export const AVENTURA_EDITORIAL = [
  {
    id: "merzouga",
    image: "https://images.unsplash.com/photo-1542401886-65d6c61db217?auto=format&fit=crop&w=2200&q=85",
    eyebrow: { es: "Capital de la aventura", en: "Capital of adventure", fr: "Capitale de l'aventure" },
    title: { es: "El desierto de Merzouga", en: "The Merzouga desert", fr: "Le désert de Merzouga" },
    body: {
      es: [
        "Merzouga, situada en el sureste de Marruecos, es uno de los destinos más impresionantes para los amantes de la aventura.",
        "Este pequeño pueblo a las puertas del Erg Chebbi alberga algunos de los paisajes desérticos más espectaculares del mundo.",
        "Las dunas infinitas, las pistas abiertas y los horizontes interminables convierten este entorno en el escenario perfecto para vivir experiencias extremas y auténticas.",
      ],
      en: [
        "Merzouga, in south-eastern Morocco, is one of the most striking destinations for adventure lovers.",
        "This small town at the gates of the Erg Chebbi shelters some of the most spectacular desert landscapes in the world.",
        "Endless dunes, open tracks and unbroken horizons turn this terrain into the perfect stage for extreme, authentic experiences.",
      ],
      fr: [
        "Merzouga, dans le sud-est du Maroc, est l'une des destinations les plus saisissantes pour les amoureux d'aventure.",
        "Ce petit village aux portes de l'Erg Chebbi abrite certains des paysages désertiques les plus spectaculaires du monde.",
        "Les dunes infinies, les pistes ouvertes et les horizons sans fin font de ce territoire la scène parfaite pour des expériences extrêmes et authentiques.",
      ],
    },
  },
  {
    id: "enduro-marruecos",
    image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=2200&q=85",
    eyebrow: { es: "Viajes de aventura por Marruecos", en: "Adventure journeys in Morocco", fr: "Voyages d'aventure au Maroc" },
    title: { es: "Enduro por Marruecos", en: "Enduro across Morocco", fr: "Enduro à travers le Maroc" },
    body: {
      es: [
        "Si te apasiona la aventura, el mundo del motor, la adrenalina y los paisajes abiertos e infinitos, te proponemos una ruta por el sur de Marruecos para vivir durante varios días la experiencia de pilotar una moto de enduro como los auténticos pilotos dakarianos.",
        "Cruzar dunas, pistas de tierra, oasis y caminos remotos del desierto se convierte en una experiencia llena de emoción y libertad.",
        "Las sensaciones que vivirás son difíciles de describir: velocidad, silencio, inmensidad y aventura en estado puro.",
      ],
      en: [
        "If you love adventure, motors, adrenaline and wide open landscapes, we propose a route through southern Morocco to spend several days riding an enduro motorcycle like a true Dakar pilot.",
        "Crossing dunes, dirt tracks, oases and remote desert paths becomes an experience charged with emotion and freedom.",
        "The sensations are hard to describe: speed, silence, immensity and adventure in its purest form.",
      ],
      fr: [
        "Si vous aimez l'aventure, le moteur, l'adrénaline et les paysages infinis, nous vous proposons un parcours dans le sud du Maroc pour vivre plusieurs jours l'expérience de piloter une moto enduro comme un véritable pilote du Dakar.",
        "Traverser dunes, pistes de terre, oasis et chemins reculés du désert devient une expérience pleine d'émotion et de liberté.",
        "Les sensations sont difficiles à décrire : vitesse, silence, immensité et aventure à l'état pur.",
      ],
    },
  },
  {
    id: "tu-aventura",
    image: "https://images.unsplash.com/photo-1570133435536-7ececf000ef6?auto=format&fit=crop&w=2200&q=85",
    eyebrow: { es: "Agencia a medida", en: "Tailor-made agency", fr: "Agence sur mesure" },
    title: {
      es: "Tu aventura 100% personalizada",
      en: "Your adventure, 100% tailor-made",
      fr: "Votre aventure 100% sur mesure",
    },
    body: {
      es: [
        "Marruecos es un país hecho para la aventura.",
        "Para quienes buscan adrenalina, libertad y sensaciones extremas, recorrer el desierto en moto de enduro es una de las formas más emocionantes de descubrir este territorio único.",
        "Una experiencia desafiante, intensa y profundamente inolvidable.",
        "Conducir una moto a través del Sahara es mucho más que una ruta: es una conexión directa con la inmensidad del paisaje y la sensación de libertad absoluta.",
      ],
      en: [
        "Morocco is a country built for adventure.",
        "For those seeking adrenaline, freedom and extreme sensations, crossing the desert on an enduro bike is one of the most thrilling ways to uncover this unique land.",
        "A challenging, intense and deeply unforgettable experience.",
        "Riding through the Sahara is far more than a route: it is a direct connection to the immensity of the landscape and the feeling of absolute freedom.",
      ],
      fr: [
        "Le Maroc est un pays fait pour l'aventure.",
        "Pour ceux qui cherchent adrénaline, liberté et sensations extrêmes, parcourir le désert en moto enduro est l'une des manières les plus exaltantes de découvrir ce territoire unique.",
        "Une expérience exigeante, intense et profondément inoubliable.",
        "Conduire une moto à travers le Sahara est bien plus qu'un parcours : c'est une connexion directe à l'immensité du paysage et au sentiment de liberté absolue.",
      ],
    },
  },
];

// Same 4 brand pillars — slightly tweaked language for adventure context.
export const AVENTURA_PILLARS = [
  {
    id: "attention",
    icon: "Headphones",
    title: { es: "Atención personalizada 24/7", en: "Personal 24/7 attention", fr: "Attention personnalisée 24/7" },
    body: {
      es: "Estamos disponibles las 24 horas del día, los 365 días del año, para ayudarte antes, durante y después de tu aventura en Marruecos.",
      en: "We are available 24 hours a day, 365 days a year — before, during and after your Moroccan adventure.",
      fr: "Disponibles 24 heures sur 24, 365 jours par an — avant, pendant et après votre aventure au Maroc.",
    },
  },
  {
    id: "tailor",
    icon: "Pencil",
    title: { es: "Viajes 100% personalizados", en: "100% tailor-made trips", fr: "Voyages 100% personnalisés" },
    body: {
      es: "Diseñamos cada experiencia totalmente a medida según tu nivel, disponibilidad y tipo de aventura que deseas vivir.",
      en: "Every experience is fully tailor-made to your level, availability and the kind of adventure you want to live.",
      fr: "Chaque expérience est entièrement sur mesure selon votre niveau, votre disponibilité et le type d'aventure souhaité.",
    },
  },
  {
    id: "quality",
    icon: "Award",
    title: { es: "Máxima calidad asegurada", en: "Top-tier quality assured", fr: "Qualité maximale garantie" },
    body: {
      es: "Todos los hoteles, campamentos y actividades han sido seleccionados personalmente por nuestro equipo para garantizar la mejor experiencia posible.",
      en: "Every hotel, camp and activity has been hand-picked by our team to guarantee the best possible experience.",
      fr: "Tous les hôtels, campements et activités ont été sélectionnés personnellement par notre équipe pour garantir la meilleure expérience possible.",
    },
  },
  {
    id: "guarantee",
    icon: "ShieldCheck",
    title: { es: "Garantía Grup Xaluca", en: "Grup Xaluca guarantee", fr: "Garantie Grup Xaluca" },
    body: {
      es: "Contamos con hoteles y campamentos propios en el sur de Marruecos, ofreciendo un servicio integral y una experiencia completamente personalizada.",
      en: "We run our own hotels and camps in southern Morocco, delivering a complete service and a fully personalised experience.",
      fr: "Nous gérons nos propres hôtels et campements dans le sud du Maroc, offrant un service intégral et une expérience entièrement personnalisée.",
    },
  },
];
