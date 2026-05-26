// Fez → Tánger · 5 nights / 6 days · Fez · Meknes · Volubilis · Chefchaouen · Tetuán · Tánger
const T = (es, en, fr) => ({ es, en, fr });

const DAY_01 = {
  route_id: "ft56-arrival-fez",
  id: "ft56-d1",
  image: "https://images.unsplash.com/photo-1597212618440-806262de4f6b?auto=format&fit=crop&w=2000&q=85",
  accent: "#C16542",
  title: T("Llegada a Fez", "Arrival in Fez", "Arrivée à Fès"),
  body: {
    es: "Llegada por la tarde-noche al aeropuerto de Fez. Dependiendo de la época del año puede existir diferencia horaria. Tras el control de pasaportes y recogida de equipajes, encuentro con el transfer que realizará el traslado hasta el hotel o riad. Cena y alojamiento en riad dentro de la medina u hotel 4★.",
    en: "Late afternoon / evening arrival at Fez airport (time difference depending on the season). After passport control and luggage pickup, we meet the transfer driver for the ride to the hotel or riad. Dinner and overnight in a medina riad or 4★ hotel.",
    fr: "Arrivée en fin d'après-midi / soirée à l'aéroport de Fès (décalage horaire possible selon la saison). Après les formalités, rencontre avec le transfert qui nous conduit à l'hôtel ou au riad. Dîner et nuit en riad de la médina ou hôtel 4★.",
  },
  culture: [],
};

const DAY_02 = {
  route_id: "ft56-fez-medina",
  id: "ft56-d2",
  image: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=2000&q=85",
  accent: "#C16542",
  title: T(
    "Fez · la capital cultural de Marruecos",
    "Fez · Morocco's cultural capital",
    "Fès · capitale culturelle du Maroc",
  ),
  body: {
    es: "Hoy descubriremos Fez el-Bali, la antigua medina de Fez y una de las mejor conservadas del mundo árabe. Acompañados por un guía local recorreremos sus laberínticas callejuelas medievales repletas de talleres artesanales, mezquitas, palacios, escuelas coránicas y zocos tradicionales. Fez es considerada la ciudad imperial más espiritual y cultural de Marruecos. La visita se realiza completamente a pie, ya que en esta medina declarada Patrimonio de la Humanidad por la UNESCO está prohibido el acceso de vehículos. Durante la jornada conoceremos cómo se organizan sus barrios alrededor de mezquita, fuente, hammam, horno y escuela coránica. También visitaremos las famosas tenerías tradicionales y algunos miradores panorámicos de la ciudad. Cena y alojamiento en riad dentro de la medina u hotel 4★.",
    en: "Today we discover Fez el-Bali, the ancient medina of Fez — one of the best-preserved in the Arab world. With a local guide we walk the medieval alleys packed with artisan workshops, mosques, palaces, Koranic schools and traditional souks. Fez is considered the country's most spiritual and cultural imperial city. The visit is entirely on foot — vehicles are forbidden in this UNESCO medina. We see how each neighbourhood is organised around mosque, fountain, hammam, oven and Koranic school. We also visit the famous traditional tanneries and climb to one of the city's panoramic viewpoints. Dinner and overnight in a medina riad or 4★ hotel.",
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

const DAY_03 = {
  route_id: "ft56-meknes-volubilis-chefchaouen",
  id: "ft56-d3",
  image: "https://images.unsplash.com/photo-1597212618440-806262de4f6b?auto=format&fit=crop&w=2000&q=85",
  accent: "#5A6B4F",
  title: T(
    "Meknes · Volubilis · Moulay Idriss · Chefchaouen",
    "Meknes · Volubilis · Moulay Idriss · Chefchaouen",
    "Meknès · Volubilis · Moulay Idriss · Chefchaouen",
  ),
  body: {
    es: "Salida temprano hacia Meknes, una de las ciudades imperiales más monumentales de Marruecos. Visita guiada de la ciudad y de sus monumentos más emblemáticos: Bab al Mansour, Mausoleo de Moulay Ismail, medina histórica y murallas imperiales. Tras la visita continuaremos hacia Volubilis, el yacimiento arqueológico romano más importante de Marruecos. Entre sus principales monumentos destacan el arco de triunfo, el capitolio, la Casa de Baco y antiguos mosaicos romanos. También pasaremos por Moulay Idriss, ciudad santa y centro espiritual del país. Continuación hacia Chefchaouen, el famoso «pueblo azul» situado en la cordillera del Rif. Cena y alojamiento en riad dentro de la medina.",
    en: "Early departure to Meknes, one of Morocco's most monumental imperial cities. Guided tour of its most emblematic monuments: Bab al Mansour, the Mausoleum of Moulay Ismail, the historic medina and imperial walls. We then continue to Volubilis, Morocco's most important Roman archaeological site — triumphal arch, capitolium, House of Bacchus and Roman mosaics. We pass through Moulay Idriss, a holy city and major spiritual centre. We continue to Chefchaouen, the famous «blue town» of the Rif mountains. Dinner and overnight in a medina riad.",
    fr: "Départ matinal vers Meknès, l'une des cités impériales les plus monumentales du Maroc. Visite guidée de ses monuments les plus emblématiques : Bab al Mansour, mausolée de Moulay Ismaïl, médina historique et remparts impériaux. Route vers Volubilis, le site archéologique romain le plus important du Maroc — arc de triomphe, capitole, maison de Bacchus et mosaïques romaines. Passage par Moulay Idriss, ville sainte et centre spirituel du pays. Continuation vers Chefchaouen, le célèbre « village bleu » du Rif. Dîner et nuit en riad de la médina.",
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

const DAY_04 = {
  route_id: "ft56-chefchaouen-akchour-tetuan",
  id: "ft56-d4",
  image: "https://images.unsplash.com/photo-1597212618440-806262de4f6b?auto=format&fit=crop&w=2000&q=85",
  accent: "#5A7F9C",
  title: T(
    "Chefchaouen · Akchour · Tetuán",
    "Chefchaouen · Akchour · Tetouan",
    "Chefchaouen · Akchour · Tétouan",
  ),
  body: {
    es: "Por la mañana visita guiada de Chefchaouen. La ciudad se encuentra situada entre las montañas Tisouka y Megou, y su nombre en bereber significa «Mira los Cuernos». Durante la visita recorreremos Plaza Uta el-Hammam, la Gran Mezquita, la Kasbah del siglo XVII y sus jardines, la Plaza Makhzen, Bab el-Ansar y la Fuente Ras el-Maa. Por la tarde, tiempo libre para pasear junto al riachuelo y descubrir el barrio tradicional de los lavaderos de Sebbanin. Posteriormente salida hacia Tetuán. Durante el trayecto realizaremos una parada en las Cascadas de Akchour para disfrutar del paisaje y realizar fotografías. Llegada a Tetuán. Cena y alojamiento en riad dentro de la medina u hotel 4★.",
    en: "Morning guided tour of Chefchaouen, set between the Tisouka and Megou mountains — its Berber name means «look at the horns». We walk through Uta el-Hammam square, the Grand Mosque, the 17th-century Kasbah and its gardens, Makhzen square, Bab el-Ansar and the Ras el-Maa fountain. Free time in the afternoon to stroll along the stream and discover the traditional Sebbanin laundry quarter. Then drive to Tetouan, stopping at the Akchour Waterfalls to enjoy the landscape and take photos. Arrival in Tetouan. Dinner and overnight in a medina riad or 4★ hotel.",
    fr: "Visite guidée de Chefchaouen le matin. La ville est nichée entre les montagnes Tisouka et Megou — son nom berbère signifie « regarde les cornes ». Nous parcourons la place Uta el-Hammam, la Grande Mosquée, la Kasbah du XVIIe siècle et ses jardins, la place Makhzen, Bab el-Ansar et la fontaine Ras el-Maa. Après-midi libre pour flâner le long du ruisseau et découvrir le quartier des lavoirs traditionnels de Sebbanin. Route vers Tétouan avec arrêt aux cascades d'Akchour. Arrivée à Tétouan. Dîner et nuit en riad de la médina ou hôtel 4★.",
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

const DAY_05 = {
  route_id: "ft56-tetuan-tanger",
  id: "ft56-d5",
  image: "https://images.unsplash.com/photo-1597212618440-806262de4f6b?auto=format&fit=crop&w=2000&q=85",
  accent: "#3A4A5F",
  title: T(
    "Tetuán · Cabo Espartel · Tánger",
    "Tetouan · Cape Spartel · Tangier",
    "Tétouan · Cap Spartel · Tanger",
  ),
  body: {
    es: "Por la mañana visita guiada de Tetuán, conocida como «La Paloma Blanca». Su medina, declarada Patrimonio de la Humanidad por la UNESCO, conserva una importante influencia andalusí heredada de la época del Protectorado español. Continuación hacia Tánger. Durante la ruta visitaremos las Grutas de Hércules y Cabo Espartel, donde convergen el océano Atlántico y el mar Mediterráneo. Llegada a Tánger y tiempo libre para descubrir la ciudad. Cena y alojamiento en riad u hotel 5★. Este es el último día de vehículo con chófer.",
    en: "Morning guided tour of Tetouan, known as «the White Dove». Its UNESCO medina keeps a strong Andalusian influence inherited from the Spanish Protectorate. We then drive to Tangier, stopping at the Caves of Hercules and Cape Spartel — where the Atlantic Ocean meets the Mediterranean Sea. Arrival in Tangier and free time to explore. Dinner and overnight in a riad or 5★ hotel. This is the last day of driver service.",
    fr: "Visite guidée de Tétouan le matin, surnommée « la Colombe Blanche ». Sa médina UNESCO conserve une forte influence andalouse héritée du Protectorat espagnol. Route vers Tanger avec visite des Grottes d'Hercule et du Cap Spartel, où l'Atlantique rencontre la Méditerranée. Arrivée à Tanger et temps libre. Dîner et nuit en riad ou hôtel 5★. Dernier jour de service chauffeur.",
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

const DAY_06 = {
  route_id: "ft56-return",
  id: "ft56-d6",
  image: "https://images.unsplash.com/photo-1570133435536-7ececf000ef6?auto=format&fit=crop&w=2000&q=85",
  accent: "#5C5248",
  title: T("Regreso desde Tánger", "Return from Tangier", "Retour depuis Tanger"),
  body: {
    es: "A la hora acordada, recogida en el riad u hotel y traslado al aeropuerto de Tánger para tomar el vuelo de regreso.",
    en: "At the agreed time, pick-up at the riad or hotel and transfer to Tangier airport for the return flight.",
    fr: "À l'heure convenue, prise en charge au riad ou à l'hôtel et transfert à l'aéroport de Tanger pour le vol retour.",
  },
  culture: [],
};

export const PROGRAM_FT_56 = {
  routeId: "tourFezTanger56",
  duration_key: "ft5n6d",
  duration: T("5 noches / 6 días", "5 nights / 6 days", "5 nuits / 6 jours"),
  prices: { low: 1090, mid: 1290, high: 1490, premium: 1690 },
  meta: {
    es: {
      title: "Fez – Tánger.",
      eyebrow_prefix: "Circuito · Norte de Marruecos",
      place: "Fez · Chefchaouen · Tetuán · Tánger",
      subtitle: "Cinco días desde la medina más antigua del mundo árabe hasta el Mediterráneo, atravesando el Rif y las costas del norte.",
      hero_image: "https://images.unsplash.com/photo-1570133435536-7ececf000ef6?auto=format&fit=crop&w=2400&q=85",
      airports: "Entrada Fez · Salida Tánger",
      quick_airports: "Fez / Tánger",
      quick_places: "Fez · Meknes · Volubilis · Chefchaouen · Akchour · Tetuán · Tánger",
      highlights: "Fez el-Bali · Volubilis · Chefchaouen · Tetuán · Cabo Espartel",
      description_title: "De Fez al Mediterráneo.",
      description: [
        "Un viaje por el norte de Marruecos visitando algunas de las Ciudades Imperiales y parte de las costas mediterránea y atlántica.",
        "El famoso «pueblo azul» del Rif, los mosaicos romanos de Volubilis y la medina andalusí de Tetuán completan la ruta.",
        "Mar, montaña y ciudades llenas de cultura e historia en pocos días.",
      ],
    },
    en: {
      title: "Fez – Tangier.",
      eyebrow_prefix: "Circuit · Northern Morocco",
      place: "Fez · Chefchaouen · Tetouan · Tangier",
      subtitle: "Five days from the oldest medina in the Arab world to the Mediterranean, across the Rif and the northern coasts.",
      hero_image: "https://images.unsplash.com/photo-1570133435536-7ececf000ef6?auto=format&fit=crop&w=2400&q=85",
      airports: "In Fez · Out Tangier",
      quick_airports: "Fez / Tangier",
      quick_places: "Fez · Meknes · Volubilis · Chefchaouen · Akchour · Tetouan · Tangier",
      highlights: "Fez el-Bali · Volubilis · Chefchaouen · Tetouan · Cape Spartel",
      description_title: "From Fez to the Mediterranean.",
      description: [
        "A journey through northern Morocco visiting some of the Imperial Cities and parts of the Mediterranean and Atlantic coasts.",
        "The famous «blue town» of the Rif, the Roman mosaics of Volubilis and the Andalusian medina of Tetouan complete the route.",
        "Sea, mountain and cities full of culture and history in just a few days.",
      ],
    },
    fr: {
      title: "Fès – Tanger.",
      eyebrow_prefix: "Circuit · Nord du Maroc",
      place: "Fès · Chefchaouen · Tétouan · Tanger",
      subtitle: "Cinq jours de la plus ancienne médina du monde arabe à la Méditerranée, à travers le Rif et les côtes du nord.",
      hero_image: "https://images.unsplash.com/photo-1570133435536-7ececf000ef6?auto=format&fit=crop&w=2400&q=85",
      airports: "Arrivée Fès · Sortie Tanger",
      quick_airports: "Fès / Tanger",
      quick_places: "Fès · Meknès · Volubilis · Chefchaouen · Akchour · Tétouan · Tanger",
      highlights: "Fès el-Bali · Volubilis · Chefchaouen · Tétouan · Cap Spartel",
      description_title: "De Fès à la Méditerranée.",
      description: [
        "Un voyage au nord du Maroc avec certaines cités impériales et une partie des côtes méditerranéenne et atlantique.",
        "Le célèbre « village bleu » du Rif, les mosaïques romaines de Volubilis et la médina andalouse de Tétouan complètent l'itinéraire.",
        "Mer, montagne et villes pleines de culture et d'histoire en quelques jours.",
      ],
    },
  },
  route: [
    { day: 1, lat: 34.0651, lng: -4.9760, type: "airport", name: T("Fez · Aeropuerto · Llegada", "Fez · Airport · Arrival", "Fès · Aéroport · Arrivée") },
    { day: 2, lat: 34.0635, lng: -4.9737, type: "unesco",  name: T("Fez el-Bali · medina UNESCO", "Fez el-Bali · UNESCO medina", "Fès el-Bali · médina UNESCO") },
    { day: 3, lat: 33.8930, lng: -5.5473, type: "kasbah",  name: T("Meknes · Bab al Mansour", "Meknes · Bab al Mansour", "Meknès · Bab al Mansour") },
    { day: 3, lat: 34.0731, lng: -5.5547, type: "unesco",  name: T("Volubilis · ruinas romanas", "Volubilis · Roman ruins", "Volubilis · ruines romaines") },
    { day: 3, lat: 34.0556, lng: -5.5236, type: "city",    name: T("Moulay Idriss", "Moulay Idriss", "Moulay Idriss") },
    { day: 3, lat: 35.1689, lng: -5.2636, type: "city",    name: T("Chefchaouen · pueblo azul", "Chefchaouen · blue town", "Chefchaouen · village bleu") },
    { day: 4, lat: 35.2330, lng: -5.1690, type: "kasbah",  name: T("Cascadas de Akchour", "Akchour Waterfalls", "Cascades d'Akchour") },
    { day: 4, lat: 35.5728, lng: -5.3725, type: "unesco",  name: T("Tetuán · medina UNESCO", "Tetouan · UNESCO medina", "Tétouan · médina UNESCO") },
    { day: 5, lat: 35.7956, lng: -5.9376, type: "city",    name: T("Cabo Espartel · Grutas de Hércules", "Cape Spartel · Caves of Hercules", "Cap Spartel · Grottes d'Hercule") },
    { day: 5, lat: 35.7595, lng: -5.8340, type: "city",    name: T("Tánger", "Tangier", "Tanger") },
    { day: 6, lat: 35.7269, lng: -5.9168, type: "airport", name: T("Tánger · Aeropuerto · Regreso", "Tangier · Airport · Return", "Tanger · Aéroport · Retour") },
  ],
  days: [DAY_01, DAY_02, DAY_03, DAY_04, DAY_05, DAY_06],
  details: {
    includes: {
      es: [
        "Dos noches en Fez en riad dentro de la medina · Media Pensión",
        "Una noche en Chefchaouen en riad dentro de la medina · Media Pensión",
        "Una noche en Tetuán en riad dentro de la medina u Hotel 4★ · Media Pensión",
        "Una noche en Tánger en riad dentro de la medina u Hotel 5★ · Media Pensión",
        "Vehículo turismo con chófer del día 3 al día 5",
        "Visita guiada de Fez (1 día) · Entrada a la Madraza",
        "Visita guiada de Meknes",
        "Visita guiada y entrada a Volubilis",
        "Visita guiada de Chefchaouen",
        "Visita guiada de Tetuán",
        "Visita de las Grutas de Hércules",
        "Transfers de aeropuerto",
        "Seguro de asistencia en viaje",
      ],
      en: [
        "Two nights in Fez in a medina riad · half board",
        "One night in Chefchaouen in a medina riad · half board",
        "One night in Tetouan in a medina riad or 4★ hotel · half board",
        "One night in Tangier in a medina riad or 5★ hotel · half board",
        "Car with driver from day 3 to day 5",
        "Guided tour of Fez (1 day) · Madrasa entrance fee",
        "Guided tour of Meknes",
        "Guided tour and entrance fee to Volubilis",
        "Guided tour of Chefchaouen",
        "Guided tour of Tetouan",
        "Visit to the Caves of Hercules",
        "Airport transfers",
        "Travel assistance insurance",
      ],
      fr: [
        "Deux nuits à Fès en riad de la médina · demi-pension",
        "Une nuit à Chefchaouen en riad de la médina · demi-pension",
        "Une nuit à Tétouan en riad de la médina ou hôtel 4★ · demi-pension",
        "Une nuit à Tanger en riad de la médina ou hôtel 5★ · demi-pension",
        "Voiture avec chauffeur du jour 3 au jour 5",
        "Visite guidée de Fès (1 jour) · Entrée à la médersa",
        "Visite guidée de Meknès",
        "Visite guidée et entrée à Volubilis",
        "Visite guidée de Chefchaouen",
        "Visite guidée de Tétouan",
        "Visite des Grottes d'Hercule",
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
        "Opciones de vuelos: Royal Air Maroc vía Casablanca, Vueling, Ryanair u otras low-cost con vuelos directos. Consultar opciones y condiciones.",
        "Los precios se calculan según la ocupación del vehículo turismo 4x4. El coste se reparte entre los ocupantes.",
        "Suplemento habitación individual: 175 €.",
        "Descuento niños (3-11 años) compartiendo con dos adultos: 235 €.",
        "Los chóferes hispanohablantes son limitados en temporada alta.",
        "Los guías locales en medinas pueden compartirse con otros viajeros.",
        "El viaje se realiza en vehículo turismo 4x4 con chófer local.",
        "Pasaporte obligatorio con vigencia mínima de 6 meses.",
        "Seguro de cancelación opcional · 45 € por persona para viajes de hasta 10 días.",
      ],
      en: [
        "Flight options: Royal Air Maroc via Casablanca, Vueling, Ryanair or other low-cost direct flights. Options on request.",
        "Rates depend on 4x4 occupancy. Transport cost is split between passengers.",
        "Single room supplement: €175.",
        "Children discount (3-11) sharing with two adults: €235.",
        "Spanish-speaking drivers are limited in high season.",
        "In high season, medina guides may be shared with other travellers.",
        "Travel by 4x4 with local driver.",
        "Valid passport required with at least 6 months remaining.",
        "Optional cancellation insurance · €45 per person for trips of up to 10 days.",
      ],
      fr: [
        "Options de vol : Royal Air Maroc via Casablanca, Vueling, Ryanair ou autres low-cost. Options sur demande.",
        "Tarifs selon l'occupation du 4x4. Le coût est partagé entre les passagers.",
        "Supplément single : 175 €.",
        "Réduction enfants (3-11 ans) partageant avec 2 adultes : 235 €.",
        "Chauffeurs hispanophones limités en haute saison.",
        "En haute saison, les guides de médina peuvent être partagés.",
        "Voyage en 4x4 avec chauffeur local.",
        "Passeport valable au minimum 6 mois.",
        "Assurance annulation en option · 45 € par personne pour les voyages jusqu'à 10 jours.",
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

export default PROGRAM_FT_56;
