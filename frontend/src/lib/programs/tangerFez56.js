// Tánger → Fez · 5 nights / 6 days · Tánger · Asilah · Tetuán · Akchour · Chefchaouen · Meknes · Volubilis · Fez
const T = (es, en, fr) => ({ es, en, fr });

const DAY_01 = {
  route_id: "tf56-tanger-asilah",
  id: "tf56-d1",
  image: "https://images.unsplash.com/photo-1597212618440-806262de4f6b?auto=format&fit=crop&w=2000&q=85",
  accent: "#3A4A5F",
  title: T(
    "Tánger · Cabo Espartel · Grutas de Hércules · Asilah",
    "Tangier · Cape Spartel · Caves of Hercules · Asilah",
    "Tanger · Cap Spartel · Grottes d'Hercule · Asilah",
  ),
  body: {
    es: "Llegada por la mañana a Tánger. Dependiendo de la época del año puede existir diferencia horaria. Tras el control de pasaportes y la recogida de equipajes, encuentro con el chófer que acompañará al grupo durante el recorrido. La ruta comienza en Cabo Espartel, el punto donde convergen las aguas del mar Mediterráneo y el océano Atlántico. Posteriormente visitaremos las famosas Grutas de Hércules. Continuación hacia Asilah, una de las poblaciones costeras más encantadoras del norte de Marruecos. La medina de Asilah está rodeada por murallas construidas por los portugueses en el siglo XV. Sus calles blancas decoradas con murales artísticos y sus puertas históricas convierten la ciudad en un destino ideal para amantes de la fotografía y la cultura. Durante el paseo libre podremos descubrir Bab Homar («Puerta Tierra»), Bab el Bahar («Puerta del Mar»), Bab Kasbah, las murallas portuguesas y playas y rincones históricos junto al Atlántico. Alojamiento en riad dentro de la medina.",
    en: "Morning arrival in Tangier (time difference depending on the season). After passport control and luggage pickup, we meet the driver who will accompany the group throughout the route. We start at Cape Spartel, where the Mediterranean and the Atlantic meet, followed by the famous Caves of Hercules. We continue to Asilah, one of the most charming coastal towns in northern Morocco. The Asilah medina is surrounded by 15th-century Portuguese ramparts. Its white-washed streets adorned with artistic murals and its historic gates make Asilah an ideal destination for photography and culture lovers. On a free walk we discover Bab Homar (the «Land Gate»), Bab el Bahar (the «Sea Gate»), Bab Kasbah, the Portuguese ramparts, and historic spots along the Atlantic. Overnight in a medina riad.",
    fr: "Arrivée le matin à Tanger (décalage horaire possible). Après les formalités, rencontre avec le chauffeur qui nous accompagnera tout au long du parcours. Visite du Cap Spartel, où la Méditerranée rejoint l'Atlantique, puis des célèbres Grottes d'Hercule. Route vers Asilah, l'une des plus charmantes villes côtières du nord. Sa médina est ceinte de remparts portugais du XVe siècle. Ses ruelles blanches ornées de fresques et ses portes historiques en font une destination idéale pour les amateurs de photographie et de culture. Découverte libre de Bab Homar (« porte de terre »), Bab el Bahar (« porte de la mer »), Bab Kasbah, des remparts portugais et de la côte atlantique. Nuit en riad de la médina.",
  },
  culture: [
    {
      title: T("Asilah · murallas portuguesas", "Asilah · Portuguese ramparts", "Asilah · remparts portugais"),
      body: T(
        "Conquistada en 1471 por Portugal, sus murallas blancas construidas sobre el Atlántico se conservan intactas y dialogan cada agosto con su célebre festival internacional de muralismo.",
        "Captured by Portugal in 1471, its white ramparts overlooking the Atlantic remain intact and dialogue each August with the famous international mural festival.",
        "Conquise par le Portugal en 1471, ses remparts blancs face à l'Atlantique sont intacts et dialoguent chaque août avec son célèbre festival international de fresques.",
      ),
    },
  ],
};

const DAY_02 = {
  route_id: "tf56-tetuan",
  id: "tf56-d2",
  image: "https://images.unsplash.com/photo-1597212618440-806262de4f6b?auto=format&fit=crop&w=2000&q=85",
  accent: "#3A4A5F",
  title: T("Tetuán · La Paloma Blanca", "Tetouan · the White Dove", "Tétouan · la Colombe Blanche"),
  body: {
    es: "Después del desayuno salida hacia Tetuán, conocida como «La Paloma Blanca». Visita guiada de la medina, declarada Patrimonio de la Humanidad por la UNESCO. Durante el recorrido podremos apreciar la fuerte influencia andalusí heredada de la época del Protectorado español. Cena y alojamiento en riad dentro de la medina u hotel 4★.",
    en: "After breakfast, drive to Tetouan, known as «the White Dove». Guided tour of the UNESCO-listed medina, where we can appreciate the strong Andalusian influence inherited from the Spanish Protectorate. Dinner and overnight in a medina riad or 4★ hotel.",
    fr: "Après le petit-déjeuner, route vers Tétouan, surnommée « la Colombe Blanche ». Visite guidée de la médina, inscrite UNESCO. On y apprécie la forte influence andalouse héritée du Protectorat espagnol. Dîner et nuit en riad de la médina ou hôtel 4★.",
  },
  culture: [
    {
      title: T("Tetuán · UNESCO", "Tetouan · UNESCO", "Tétouan · UNESCO"),
      body: T(
        "Su medina, declarada Patrimonio Mundial en 1997, es la más auténticamente andalusí de Marruecos.",
        "Its medina, UNESCO-listed since 1997, is the most authentically Andalusian in Morocco.",
        "Sa médina, inscrite UNESCO en 1997, est la plus authentiquement andalouse du Maroc.",
      ),
    },
  ],
};

const DAY_03 = {
  route_id: "tf56-akchour-chefchaouen",
  id: "tf56-d3",
  image: "https://images.unsplash.com/photo-1597212618440-806262de4f6b?auto=format&fit=crop&w=2000&q=85",
  accent: "#5A7F9C",
  title: T("Chefchaouen · Akchour", "Chefchaouen · Akchour", "Chefchaouen · Akchour"),
  body: {
    es: "Salida hacia Chefchaouen, situada entre las montañas Tisouka y Megou, en plena cordillera del Rif. Durante el trayecto realizaremos una parada en las Cascadas de Akchour para disfrutar del paisaje y realizar fotografías. Llegada a Chefchaouen, el famoso «pueblo azul», donde realizaremos una visita guiada recorriendo sus lugares más emblemáticos: Plaza Uta el-Hammam, Gran Mezquita, Kasbah del siglo XVII y sus jardines, Plaza Makhzen, Bab el-Ansar y Fuente Ras el-Maa. Por la tarde tiempo libre para pasear junto al riachuelo y descubrir el barrio tradicional de los lavaderos de Sebbanin. Cena y alojamiento en riad dentro de la medina.",
    en: "Departure for Chefchaouen, set between the Tisouka and Megou mountains in the heart of the Rif. On the way we stop at the Akchour Waterfalls to enjoy the landscape and take photos. Arrival in Chefchaouen, the famous «blue town», for a guided walk through its most emblematic places: Uta el-Hammam square, Grand Mosque, 17th-century Kasbah and its gardens, Makhzen square, Bab el-Ansar and Ras el-Maa fountain. Free time in the afternoon to stroll along the stream and discover the traditional Sebbanin laundry quarter. Dinner and overnight in a medina riad.",
    fr: "Départ pour Chefchaouen, lovée entre les montagnes Tisouka et Megou, au cœur du Rif. En route, arrêt aux cascades d'Akchour pour profiter du paysage et faire des photos. Arrivée à Chefchaouen, le célèbre « village bleu », pour une visite guidée : place Uta el-Hammam, Grande Mosquée, Kasbah du XVIIe siècle et ses jardins, place Makhzen, Bab el-Ansar et fontaine Ras el-Maa. Après-midi libre pour flâner le long du ruisseau et découvrir le quartier des lavoirs traditionnels de Sebbanin. Dîner et nuit en riad de la médina.",
  },
  culture: [
    {
      title: T("Chefchaouen · ciudad azul", "Chefchaouen · the blue city", "Chefchaouen · la ville bleue"),
      body: T(
        "Fundada en 1471 como bastión contra los portugueses. El característico añil cubre fachadas y callejuelas desde los años 30: tradición sefardí y simbolismo espiritual.",
        "Founded in 1471 as a stronghold against the Portuguese. The signature indigo has covered façades and alleys since the 1930s — a Sephardic tradition with spiritual meaning.",
        "Fondée en 1471 comme bastion contre les Portugais. L'indigo emblématique recouvre façades et ruelles depuis les années 1930 — tradition sépharade au sens spirituel.",
      ),
    },
  ],
};

const DAY_04 = {
  route_id: "tf56-volubilis-meknes-fez",
  id: "tf56-d4",
  image: "https://images.unsplash.com/photo-1597212618440-806262de4f6b?auto=format&fit=crop&w=2000&q=85",
  accent: "#5A6B4F",
  title: T(
    "Volubilis · Moulay Idriss · Meknes · Fez",
    "Volubilis · Moulay Idriss · Meknes · Fez",
    "Volubilis · Moulay Idriss · Meknès · Fès",
  ),
  body: {
    es: "Salida temprano hacia Meknes. Durante el trayecto visitaremos Volubilis, el yacimiento arqueológico romano más importante de Marruecos: arco de triunfo, capitolio, Casa de Baco y antiguos mosaicos romanos. También pasaremos por Moulay Idriss, ciudad santa y centro espiritual del país. Llegada a Meknes, una de las ciudades imperiales más monumentales de Marruecos. Visita guiada de la ciudad y de sus principales monumentos: Bab al Mansour, medina histórica, murallas imperiales y monumentos religiosos. Tras la visita continuación hacia Fez. Cena y alojamiento en riad dentro de la medina u hotel 4★. Este es el último día de vehículo con chófer.",
    en: "Early departure to Meknes. On the way we visit Volubilis, Morocco's most important Roman archaeological site — triumphal arch, capitolium, House of Bacchus and Roman mosaics. We pass through Moulay Idriss, a holy city and major spiritual centre. Arrival in Meknes, one of Morocco's most monumental imperial cities. Guided tour of its main monuments: Bab al Mansour, the historic medina, imperial walls and religious landmarks. After the visit we continue to Fez. Dinner and overnight in a medina riad or 4★ hotel. This is the last day of driver service.",
    fr: "Départ matinal vers Meknès. En route, visite de Volubilis, le site archéologique romain le plus important du Maroc — arc de triomphe, capitole, maison de Bacchus et mosaïques romaines. Passage par Moulay Idriss, ville sainte et centre spirituel du pays. Arrivée à Meknès, l'une des cités impériales les plus monumentales du Maroc. Visite guidée de ses monuments principaux : Bab al Mansour, médina historique, remparts impériaux et monuments religieux. Route vers Fès. Dîner et nuit en riad de la médina ou hôtel 4★. Dernier jour de service chauffeur.",
  },
  culture: [
    {
      title: T("Volubilis · UNESCO", "Volubilis · UNESCO", "Volubilis · UNESCO"),
      body: T(
        "Capital de la provincia romana de Mauretania Tingitana en el siglo I a.C. Sus mosaicos están entre los mejor conservados del Magreb.",
        "Capital of the Roman province of Mauretania Tingitana in the 1st c. BC. Its mosaics are among the best-preserved in the Maghreb.",
        "Capitale de la province romaine de Maurétanie Tingitane au Ier s. av. J.-C. Ses mosaïques figurent parmi les mieux conservées du Maghreb.",
      ),
    },
  ],
};

const DAY_05 = {
  route_id: "tf56-fez-medina",
  id: "tf56-d5",
  image: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=2000&q=85",
  accent: "#C16542",
  title: T(
    "Fez · la capital cultural de Marruecos",
    "Fez · Morocco's cultural capital",
    "Fès · capitale culturelle du Maroc",
  ),
  body: {
    es: "Hoy descubriremos Fez el-Bali, la antigua medina de Fez y una de las mejor conservadas del mundo árabe. Acompañados por un guía local recorreremos sus laberínticas callejuelas medievales repletas de talleres artesanales, mezquitas, palacios, escuelas coránicas y zocos tradicionales. Fez es considerada la ciudad imperial más espiritual y cultural de Marruecos. La visita se realiza completamente a pie, ya que en esta medina declarada Patrimonio de la Humanidad por la UNESCO está prohibido el acceso de vehículos. Durante la jornada conoceremos cómo se organizan sus barrios tradicionales alrededor de mezquita, fuente, hammam, horno y escuela coránica. También visitaremos las famosas tenerías tradicionales y algunos miradores panorámicos de la ciudad. Cena y alojamiento en riad dentro de la medina u hotel 4★.",
    en: "Today we discover Fez el-Bali, the ancient medina of Fez — one of the best-preserved in the Arab world. With a local guide we walk medieval alleys packed with artisan workshops, mosques, palaces, Koranic schools and traditional souks. Fez is the country's most spiritual and cultural imperial city. The visit is entirely on foot — vehicles are forbidden in this UNESCO medina. We see how traditional neighbourhoods are organised around mosque, fountain, hammam, oven and Koranic school. We also visit the traditional tanneries and climb to a panoramic viewpoint. Dinner and overnight in a medina riad or 4★ hotel.",
    fr: "Aujourd'hui, découverte de Fès el-Bali, l'ancienne médina de Fès — l'une des mieux conservées du monde arabe. Avec un guide local, nous parcourons les ruelles médiévales pleines d'ateliers artisanaux, mosquées, palais, écoles coraniques et souks traditionnels. Fès est considérée comme la ville impériale la plus spirituelle et culturelle du pays. La visite se fait entièrement à pied — les véhicules y sont interdits. Visite des tanneries traditionnelles et montée à un mirador panoramique. Dîner et nuit en riad de la médina ou hôtel 4★.",
  },
  culture: [
    {
      title: T("Al-Qarawiyyin · universidad más antigua del mundo", "Al-Qarawiyyin · world's oldest university", "Al-Qarawiyyin · plus ancienne université du monde"),
      body: T(
        "Fundada en 859 d.C. por Fátima al-Fihri. UNESCO y Guinness la reconocen como la universidad más antigua del mundo todavía en funcionamiento.",
        "Founded in 859 CE by Fatima al-Fihri. UNESCO and Guinness recognise it as the world's oldest continuously operating university.",
        "Fondée en 859 par Fatima al-Fihri. UNESCO et Guinness la reconnaissent comme la plus ancienne université au monde toujours en activité.",
      ),
    },
  ],
};

const DAY_06 = {
  route_id: "tf56-return",
  id: "tf56-d6",
  image: "https://images.unsplash.com/photo-1597212618440-806262de4f6b?auto=format&fit=crop&w=2000&q=85",
  accent: "#5C5248",
  title: T("Regreso desde Fez", "Return from Fez", "Retour depuis Fès"),
  body: {
    es: "A la hora acordada, recogida en el riad u hotel y traslado al aeropuerto de Fez para tomar el vuelo de regreso.",
    en: "At the agreed time, pick-up at the riad or hotel and transfer to Fez airport for the return flight.",
    fr: "À l'heure convenue, prise en charge au riad ou à l'hôtel et transfert à l'aéroport de Fès pour le vol retour.",
  },
  culture: [],
};

export const PROGRAM_TF_56 = {
  routeId: "tourTangerFez56",
  duration_key: "tf5n6d",
  duration: T("5 noches / 6 días", "5 nights / 6 days", "5 nuits / 6 jours"),
  prices: { low: 1090, mid: 1290, high: 1490, premium: 1690 },
  meta: {
    es: {
      title: "Tánger – Asilah – Fez.",
      eyebrow_prefix: "Circuito · Norte de Marruecos",
      place: "Tánger · Asilah · Chefchaouen · Fez",
      subtitle: "Una escapada por el norte añadiendo las murallas portuguesas de Asilah a las ciudades imperiales y al Rif.",
      hero_image: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=2400&q=85",
      airports: "Entrada Tánger · Salida Fez",
      quick_airports: "Tánger / Fez",
      quick_places: "Tánger · Asilah · Tetuán · Akchour · Chefchaouen · Volubilis · Meknes · Fez",
      highlights: "Cabo Espartel · Asilah · Chefchaouen · Volubilis · Fez el-Bali",
      description_title: "Norte de Marruecos con un toque atlántico.",
      description: [
        "Una completa escapada por el norte de Marruecos visitando algunas de las Ciudades Imperiales y parte de las costas mediterránea y atlántica.",
        "Asilah suma sus murallas portuguesas del siglo XV y sus murales artísticos a Chefchaouen, Tetuán, Meknès y Fez.",
        "Mar, montaña y ciudades llenas de cultura, historia y tradición en una sola ruta.",
      ],
    },
    en: {
      title: "Tangier – Asilah – Fez.",
      eyebrow_prefix: "Circuit · Northern Morocco",
      place: "Tangier · Asilah · Chefchaouen · Fez",
      subtitle: "A northern escape adding the Portuguese ramparts of Asilah to the imperial cities and the Rif.",
      hero_image: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=2400&q=85",
      airports: "In Tangier · Out Fez",
      quick_airports: "Tangier / Fez",
      quick_places: "Tangier · Asilah · Tetouan · Akchour · Chefchaouen · Volubilis · Meknes · Fez",
      highlights: "Cape Spartel · Asilah · Chefchaouen · Volubilis · Fez el-Bali",
      description_title: "Northern Morocco with an Atlantic touch.",
      description: [
        "A complete northern escape, visiting some of the Imperial Cities and parts of both the Mediterranean and Atlantic coasts.",
        "Asilah adds its 15th-century Portuguese ramparts and artistic murals to Chefchaouen, Tetouan, Meknes and Fez.",
        "Sea, mountain and cities full of culture, history and tradition in one route.",
      ],
    },
    fr: {
      title: "Tanger – Asilah – Fès.",
      eyebrow_prefix: "Circuit · Nord du Maroc",
      place: "Tanger · Asilah · Chefchaouen · Fès",
      subtitle: "Une escapade au nord qui ajoute les remparts portugais d'Asilah aux cités impériales et au Rif.",
      hero_image: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=2400&q=85",
      airports: "Arrivée Tanger · Sortie Fès",
      quick_airports: "Tanger / Fès",
      quick_places: "Tanger · Asilah · Tétouan · Akchour · Chefchaouen · Volubilis · Meknès · Fès",
      highlights: "Cap Spartel · Asilah · Chefchaouen · Volubilis · Fès el-Bali",
      description_title: "Le nord du Maroc avec une touche atlantique.",
      description: [
        "Une escapade complète au nord du Maroc, avec certaines cités impériales et la côte méditerranéenne et atlantique.",
        "Asilah ajoute ses remparts portugais du XVe siècle et ses fresques à Chefchaouen, Tétouan, Meknès et Fès.",
        "Mer, montagne et villes pleines de culture, d'histoire et de tradition en un seul itinéraire.",
      ],
    },
  },
  route: [
    { day: 1, lat: 35.7595, lng: -5.8340, type: "airport", name: T("Tánger · Aeropuerto", "Tangier · Airport", "Tanger · Aéroport") },
    { day: 1, lat: 35.7956, lng: -5.9376, type: "city",    name: T("Cabo Espartel · Grutas de Hércules", "Cape Spartel · Caves of Hercules", "Cap Spartel · Grottes d'Hercule") },
    { day: 1, lat: 35.4651, lng: -6.0349, type: "city",    name: T("Asilah · murallas portuguesas", "Asilah · Portuguese ramparts", "Asilah · remparts portugais") },
    { day: 2, lat: 35.5728, lng: -5.3725, type: "unesco",  name: T("Tetuán · medina UNESCO", "Tetouan · UNESCO medina", "Tétouan · médina UNESCO") },
    { day: 3, lat: 35.2330, lng: -5.1690, type: "kasbah",  name: T("Cascadas de Akchour", "Akchour Waterfalls", "Cascades d'Akchour") },
    { day: 3, lat: 35.1689, lng: -5.2636, type: "city",    name: T("Chefchaouen · pueblo azul", "Chefchaouen · blue town", "Chefchaouen · village bleu") },
    { day: 4, lat: 34.0731, lng: -5.5547, type: "unesco",  name: T("Volubilis · ruinas romanas", "Volubilis · Roman ruins", "Volubilis · ruines romaines") },
    { day: 4, lat: 34.0556, lng: -5.5236, type: "city",    name: T("Moulay Idriss", "Moulay Idriss", "Moulay Idriss") },
    { day: 4, lat: 33.8930, lng: -5.5473, type: "kasbah",  name: T("Meknes · Bab al Mansour", "Meknes · Bab al Mansour", "Meknès · Bab al Mansour") },
    { day: 4, lat: 34.0651, lng: -4.9760, type: "city",    name: T("Fez · Riad en la medina", "Fez · Medina riad", "Fès · Riad de la médina") },
    { day: 5, lat: 34.0635, lng: -4.9737, type: "unesco",  name: T("Fez el-Bali · medina UNESCO", "Fez el-Bali · UNESCO medina", "Fès el-Bali · médina UNESCO") },
    { day: 6, lat: 33.9273, lng: -4.9779, type: "airport", name: T("Fez · Aeropuerto · Regreso", "Fez · Airport · Return", "Fès · Aéroport · Retour") },
  ],
  days: [DAY_01, DAY_02, DAY_03, DAY_04, DAY_05, DAY_06],
  details: {
    includes: {
      es: [
        "Una noche en Asilah en riad dentro de la medina u Hotel 4★ · Media Pensión",
        "Una noche en Tetuán en riad dentro de la medina u Hotel 4★ · Media Pensión",
        "Una noche en Chefchaouen en riad dentro de la medina · Media Pensión",
        "Dos noches en Fez en riad dentro de la medina · Media Pensión",
        "Vehículo turismo 4x4 con chófer del día 1 al día 4",
        "Visita de las Grutas de Hércules",
        "Visita guiada de Tetuán",
        "Visita guiada de Chefchaouen",
        "Visita guiada y entrada a Volubilis",
        "Visita guiada de Meknes",
        "Visita guiada de Fez (1 día) · Entrada a la Madraza",
        "Transfers de aeropuerto",
        "Seguro de asistencia en viaje",
      ],
      en: [
        "One night in Asilah in a medina riad or 4★ hotel · half board",
        "One night in Tetouan in a medina riad or 4★ hotel · half board",
        "One night in Chefchaouen in a medina riad · half board",
        "Two nights in Fez in a medina riad · half board",
        "4x4 with driver from day 1 to day 4",
        "Visit to the Caves of Hercules",
        "Guided tour of Tetouan",
        "Guided tour of Chefchaouen",
        "Guided tour and entrance fee to Volubilis",
        "Guided tour of Meknes",
        "Guided tour of Fez (1 day) · Madrasa entrance fee",
        "Airport transfers",
        "Travel assistance insurance",
      ],
      fr: [
        "Une nuit à Asilah en riad de la médina ou hôtel 4★ · demi-pension",
        "Une nuit à Tétouan en riad de la médina ou hôtel 4★ · demi-pension",
        "Une nuit à Chefchaouen en riad de la médina · demi-pension",
        "Deux nuits à Fès en riad de la médina · demi-pension",
        "4x4 avec chauffeur du jour 1 au jour 4",
        "Visite des Grottes d'Hercule",
        "Visite guidée de Tétouan",
        "Visite guidée de Chefchaouen",
        "Visite guidée et entrée à Volubilis",
        "Visite guidée de Meknès",
        "Visite guidée de Fès (1 jour) · Entrée à la médersa",
        "Transferts aéroport",
        "Assistance voyage",
      ],
    },
    excludes: {
      es: ["Bebidas", "Comidas del mediodía", "Extras personales como hammam o masajes", "Vuelos internacionales", "Seguro de cancelación"],
      en: ["Drinks", "Lunches", "Personal extras (hammam, massages…)", "International flights", "Cancellation insurance"],
      fr: ["Boissons", "Déjeuners", "Extras personnels (hammam, massages…)", "Vols internationaux", "Assurance annulation"],
    },
    notes: {
      es: [
        "Opciones de vuelos: Royal Air Maroc vía Casablanca, Vueling, Air Arabia, Ryanair u otras low-cost con vuelos directos. Consultar opciones y condiciones.",
        "Los precios se calculan según la ocupación del vehículo turismo. El coste se reparte entre los ocupantes.",
        "Suplemento habitación individual: 155 €.",
        "Descuento niños (3-11 años) compartiendo con dos adultos: 160 €.",
        "Los chóferes hispanohablantes son limitados en temporada alta.",
        "Los guías locales en medinas pueden compartirse con otros viajeros.",
        "El viaje se realiza en vehículo turismo o 4x4 con chófer local.",
        "Pasaporte obligatorio con vigencia mínima de 6 meses.",
        "Seguro de cancelación opcional · 45 € por persona para viajes de máximo 9 días.",
      ],
      en: [
        "Flight options: Royal Air Maroc via Casablanca, Vueling, Air Arabia, Ryanair or other low-cost direct flights. Options on request.",
        "Rates depend on car occupancy. Transport cost is split between passengers.",
        "Single room supplement: €155.",
        "Children discount (3-11) sharing with two adults: €160.",
        "Spanish-speaking drivers are limited in high season.",
        "In high season, medina guides may be shared with other travellers.",
        "Travel by car or 4x4 with local driver.",
        "Valid passport required with at least 6 months remaining.",
        "Optional cancellation insurance · €45 per person for trips of up to 9 days.",
      ],
      fr: [
        "Options de vol : Royal Air Maroc via Casablanca, Vueling, Air Arabia, Ryanair ou autres low-cost. Options sur demande.",
        "Tarifs selon l'occupation du véhicule. Le coût est partagé entre les passagers.",
        "Supplément single : 155 €.",
        "Réduction enfants (3-11 ans) partageant avec 2 adultes : 160 €.",
        "Chauffeurs hispanophones limités en haute saison.",
        "En haute saison, les guides de médina peuvent être partagés.",
        "Voyage en voiture ou 4x4 avec chauffeur local.",
        "Passeport valable au minimum 6 mois.",
        "Assurance annulation en option · 45 € par personne pour les voyages jusqu'à 9 jours.",
      ],
    },
    terms: {
      es: [
        "Reserva: 30% del importe del viaje en el momento de la reserva.",
        "Pago final: 70% restante hasta 30 días antes de la salida.",
        "En caso de emisión inmediata de vuelos: 100% del billete al reservar.",
        "Cancelación 45 días antes de la salida: 30% de gastos.",
        "Cancelación 21 días antes de la salida: 100% de gastos.",
        "Penalización adicional de 50 € por reserva en concepto de gestión.",
        "Estas condiciones aplican solo a los servicios de tierra. El seguro de cancelación no es reembolsable.",
      ],
      en: [
        "Booking: 30% at confirmation.",
        "Final payment: 70% balance up to 30 days before departure.",
        "Immediate flight ticketing: 100% of the flight at booking.",
        "Cancellation 45 days before departure: 30% fees.",
        "Cancellation 21 days before departure: 100% fees.",
        "Fixed €50 per booking management fee.",
        "Conditions apply to land services only. Cancellation insurance is non-refundable.",
      ],
      fr: [
        "Réservation : 30 % à la confirmation.",
        "Paiement final : solde de 70 % jusqu'à 30 jours avant le départ.",
        "Émission immédiate du vol : 100 % du billet à la réservation.",
        "Annulation 45 jours avant : 30 % de frais.",
        "Annulation 21 jours avant : 100 % de frais.",
        "Pénalité fixe de 50 € par réservation pour frais de gestion.",
        "Conditions applicables aux services terrestres uniquement. L'assurance annulation n'est pas remboursable.",
      ],
    },
  },
};

export default PROGRAM_TF_56;
