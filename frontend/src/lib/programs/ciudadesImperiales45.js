// Ciudades Imperiales · 4 nights / 5 days · Casablanca → Rabat → Volubilis → Meknes → Fez
const T = (es, en, fr) => ({ es, en, fr });

const DAY_01 = {
  route_id: "ci45-casa-rabat",
  id: "ci45-d1",
  image: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=2000&q=85",
  accent: "#A07042",
  title: T("Casablanca · Mezquita Hassan II · Rabat", "Casablanca · Hassan II Mosque · Rabat", "Casablanca · mosquée Hassan II · Rabat"),
  body: {
    es: "Llegada por la mañana al aeropuerto de Casablanca. Dependiendo de la época del año puede existir diferencia horaria. Tras los trámites de pasaporte y recogida de equipajes, encuentro con el chófer que acompañará al grupo durante todo el recorrido. Comenzaremos con una visita panorámica de Casablanca, capital económica del país: restos de la muralla, Ciudad Nueva, la Corniche y visita guiada de la Mezquita Hassan II, famosa por poseer el minarete más alto del mundo. El chófer recomendará algún restaurante frente al mar para degustar pescado fresco. Tras la comida, salida hacia Rabat por autopista (aprox. 100 km). Cena y alojamiento en hotel 4★ o riad en Rabat.",
    en: "Morning arrival at Casablanca airport (time difference depending on the season). After passport control and baggage collection we meet the driver who will accompany the group throughout the route. We start with a panoramic tour of Casablanca — Morocco's economic capital: old city walls, the new city, the Corniche promenade and a guided visit to the Hassan II Mosque, famed for the world's tallest minaret. The driver will recommend a seafront restaurant for fresh fish. After lunch, transfer to Rabat by motorway (approx. 100 km). Dinner and overnight in a 4★ hotel or riad in Rabat.",
    fr: "Arrivée le matin à l'aéroport de Casablanca (décalage horaire possible selon la saison). Après les formalités, rencontre avec le chauffeur qui nous accompagnera tout au long du parcours. Visite panoramique de Casablanca — capitale économique du pays : vestiges des remparts, ville nouvelle, la Corniche et visite guidée de la mosquée Hassan II, célèbre pour son minaret, le plus haut du monde. Le chauffeur recommandera un restaurant en bord de mer pour déguster du poisson frais. L'après-midi, route vers Rabat par autoroute (env. 100 km). Dîner et nuit en hôtel 4★ ou riad à Rabat.",
  },
  culture: [
    {
      title: T("Mezquita Hassan II", "Hassan II Mosque", "Mosquée Hassan II"),
      body: T(
        "Inaugurada en 1993, posee el minarete más alto del mundo (210 m). Construida en parte sobre el Atlántico, alberga hasta 105.000 fieles.",
        "Inaugurated in 1993, it has the world's tallest minaret (210 m). Partly built over the Atlantic, it hosts up to 105,000 worshippers.",
        "Inaugurée en 1993, son minaret est le plus haut du monde (210 m). Construite en partie sur l'Atlantique, elle accueille jusqu'à 105 000 fidèles.",
      ),
    },
  ],
};

const DAY_02 = {
  route_id: "ci45-volubilis-meknes",
  id: "ci45-d2",
  image: "https://images.unsplash.com/photo-1597212618440-806262de4f6b?auto=format&fit=crop&w=2000&q=85",
  accent: "#5A6B4F",
  title: T("Rabat · Volubilis · Moulay Idriss · Meknes", "Rabat · Volubilis · Moulay Idriss · Meknes", "Rabat · Volubilis · Moulay Idriss · Meknès"),
  body: {
    es: "Por la mañana, visita guiada de Rabat, capital administrativa de Marruecos: la Kasbah des Oudaias, la Torre Hassan, el Mausoleo de Mohammed V y el Chellah, antigua ciudad romana convertida en necrópolis. Por la tarde, salida hacia las ruinas romanas de Volubilis, el yacimiento arqueológico romano más importante de Marruecos. Descubriremos el arco de triunfo, el capitolio, la Casa de Baco y antiguos mosaicos y restos romanos. De camino a Meknes pasaremos por Moulay Idriss, ciudad santa considerada uno de los principales centros espirituales del país. Llegada a Meknes. Cena y alojamiento en hotel 4★ o riad.",
    en: "Morning guided tour of Rabat, Morocco's administrative capital: the Kasbah des Oudaias, the Hassan Tower, the Mausoleum of Mohammed V and the Chellah — an ancient Roman city turned necropolis. Afternoon drive to the Roman ruins of Volubilis, Morocco's most important Roman archaeological site: triumphal arch, capitolium, House of Bacchus and Roman mosaics and remains. On the way to Meknes we pass through Moulay Idriss, a holy city considered one of the country's main spiritual centres. Arrival in Meknes. Dinner and overnight in a 4★ hotel or riad.",
    fr: "Visite guidée de Rabat, capitale administrative du Maroc : la Kasbah des Oudayas, la Tour Hassan, le Mausolée Mohammed V et le Chellah, ancienne cité romaine devenue nécropole. L'après-midi, route vers les ruines romaines de Volubilis, le site archéologique romain le plus important du Maroc : arc de triomphe, capitole, maison de Bacchus, mosaïques et vestiges romains. En route vers Meknès, passage par Moulay Idriss, ville sainte. Arrivée à Meknès. Dîner et nuit en hôtel 4★ ou riad.",
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
    {
      title: T("Moulay Idriss · ciudad santa", "Moulay Idriss · holy city", "Moulay Idriss · ville sainte"),
      body: T(
        "Cuna del islam marroquí: fundada por Idris I en 789, primer rey de la dinastía idrisí. Cinco peregrinaciones aquí equivalen a una a La Meca.",
        "Cradle of Moroccan Islam: founded by Idris I in 789, the first Idrisid king. Five pilgrimages here equal one to Mecca.",
        "Berceau de l'islam marocain : fondée par Idris Ier en 789, premier roi idrisside. Cinq pèlerinages ici valent un à La Mecque.",
      ),
    },
  ],
};

const DAY_03 = {
  route_id: "ci45-meknes-fez",
  id: "ci45-d3",
  image: "https://images.unsplash.com/photo-1547234935-80c7145ec969?auto=format&fit=crop&w=2000&q=85",
  accent: "#D4A373",
  title: T("Meknes · Bab al Mansour · Heri es Souani · Fez", "Meknes · Bab al Mansour · Heri es Souani · Fez", "Meknès · Bab al Mansour · Heri es Souani · Fès"),
  body: {
    es: "Por la mañana, visita guiada de Meknes, una de las ciudades imperiales más elegantes de Marruecos. Su medina, más tranquila que la de Fez, forma también parte del Patrimonio Mundial UNESCO. Visitaremos Bab al Mansour — una de las puertas monumentales más bellas del país —, el Mausoleo de Moulay Ismail, los graneros y establos reales «Heri es Souani» y la prisión subterránea «Habs Qara». Meknes es conocida como «la ciudad de los cien alminares» gracias a la gran cantidad de mezquitas y monumentos religiosos que alberga. Por la tarde, continuación hacia Fez. Cena y alojamiento en riad dentro de la medina o hotel 4★.",
    en: "Morning guided tour of Meknes, one of Morocco's most elegant imperial cities. Its medina — quieter than Fez — is also UNESCO World Heritage. We visit Bab al Mansour — one of the country's most beautiful monumental gates —, the Mausoleum of Moulay Ismail, the royal granaries and stables «Heri es Souani», and the underground prison «Habs Qara». Meknes is known as «the city of a hundred minarets». Afternoon drive to Fez. Dinner and overnight in a medina riad or 4★ hotel.",
    fr: "Le matin, visite guidée de Meknès — l'une des cités impériales les plus élégantes du Maroc. Sa médina, plus tranquille que celle de Fès, est également UNESCO. Visite de Bab al Mansour — l'une des plus belles portes monumentales du pays —, du Mausolée de Moulay Ismaïl, des greniers et écuries royales « Heri es Souani » et de la prison souterraine « Habs Qara ». Meknès est surnommée « la ville aux cent minarets ». L'après-midi, route vers Fès. Dîner et nuit en riad de la médina ou hôtel 4★.",
  },
  culture: [
    {
      title: T("Moulay Ismail · el constructor", "Moulay Ismail · the builder", "Moulay Ismaïl · le bâtisseur"),
      body: T(
        "Reinó 55 años (1672-1727). Hizo de Meknes su capital y la dotó de 40 km de murallas, palacios y los establos para 12.000 caballos.",
        "Reigned for 55 years (1672-1727). Made Meknes his capital — 40 km of walls, palaces and stables for 12,000 horses.",
        "Régna 55 ans (1672-1727). Fit de Meknès sa capitale — 40 km de remparts, palais et écuries pour 12 000 chevaux.",
      ),
    },
  ],
};

const DAY_04 = {
  route_id: "ci45-fez-medina",
  id: "ci45-d4",
  image: "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=2000&q=85",
  accent: "#C16542",
  title: T("Fez · la capital cultural de Marruecos", "Fez · Morocco's cultural capital", "Fès · capitale culturelle du Maroc"),
  body: {
    es: "Hoy descubriremos Fez el-Bali, la antigua medina de Fez y una de las más auténticas y mejor conservadas del mundo árabe. Acompañados por un guía local, recorreremos sus laberínticas callejuelas medievales repletas de talleres artesanales, mezquitas, palacios, zocos tradicionales y escuelas coránicas. Fez es considerada la ciudad imperial más espiritual y cultural del país. La visita se realiza completamente a pie, ya que en esta medina UNESCO está prohibido el acceso de vehículos. Durante la jornada veremos cómo se organizan los diferentes barrios alrededor de elementos esenciales de la vida cotidiana — mezquita, fuente, horno, hammam, escuela coránica. También visitaremos las famosas tenerías tradicionales donde todavía se curten pieles artesanalmente y subiremos a alguno de los miradores panorámicos de la ciudad. Cena y alojamiento en riad dentro de la medina o hotel 4★.",
    en: "Today we discover Fez el-Bali, the ancient medina of Fez and one of the most authentic and best-preserved in the Arab world. With a local guide we walk the medieval alleys packed with artisan workshops, mosques, palaces, traditional souks and Koranic schools. Fez is considered the country's most spiritual and cultural imperial city. The visit is entirely on foot — vehicles are not allowed in this UNESCO medina. We see how each neighbourhood is organised around the essentials of daily life — mosque, fountain, oven, hammam, Koranic school. We also visit the famous traditional tanneries where leather is still cured by hand, and climb to one of the city's panoramic viewpoints. Dinner and overnight in a medina riad or 4★ hotel.",
    fr: "Aujourd'hui, découverte de Fès el-Bali, l'ancienne médina de Fès et l'une des plus authentiques et les mieux conservées du monde arabe. Avec un guide local, nous parcourons ses ruelles médiévales pleines d'ateliers artisanaux, mosquées, palais, souks traditionnels et écoles coraniques. Fès est considérée comme la ville impériale la plus spirituelle et culturelle du pays. La visite se fait entièrement à pied — les véhicules y sont interdits. Nous voyons comment chaque quartier s'organise autour des essentiels de la vie quotidienne — mosquée, fontaine, four, hammam, école coranique. Visite des célèbres tanneries traditionnelles où le cuir est encore travaillé à la main, et montée à un mirador panoramique. Dîner et nuit en riad de la médina ou hôtel 4★.",
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
    {
      title: T("Chouara · tenería del s.XI", "Chouara · 11th-century tannery", "Chouara · tannerie du XIe siècle"),
      body: T(
        "Las tinas multicolor funcionan ininterrumpidamente desde el siglo XI con los mismos colorantes naturales: índigo, alheña, azafrán y amapola.",
        "Multicoloured vats running without interruption since the 11th century — same natural dyes: indigo, henna, saffron and poppy.",
        "Cuves multicolores en fonctionnement depuis le XIe siècle — mêmes colorants naturels : indigo, henné, safran et coquelicot.",
      ),
    },
  ],
};

const DAY_05 = {
  route_id: "ci45-return",
  id: "ci45-d5",
  image: "https://images.unsplash.com/photo-1604940500627-d3f44d1d21c6?auto=format&fit=crop&w=2000&q=85",
  accent: "#5C5248",
  title: T("Regreso desde Fez", "Return from Fez", "Retour depuis Fès"),
  body: {
    es: "A la hora convenida, recogida en el riad y traslado al aeropuerto de Fez para tomar el vuelo de regreso.",
    en: "At the agreed time, pick-up at the riad and transfer to Fez airport for the return flight.",
    fr: "À l'heure convenue, prise en charge au riad et transfert à l'aéroport de Fès pour le vol retour.",
  },
  culture: [],
};

export const PROGRAM_CI_45 = {
  routeId: "tourCiudadesImperiales45",
  duration_key: "ci4n5d",
  duration: T("4 noches / 5 días", "4 nights / 5 days", "4 nuits / 5 jours"),
  prices: { low: 990, mid: 1190, high: 1390, premium: 1590 },
  meta: {
    es: {
      title: "Ciudades imperiales.",
      eyebrow_prefix: "Circuito · Ciudades imperiales de Marruecos",
      place: "Casablanca · Rabat · Meknes · Fez",
      subtitle: "Cuatro días recorriendo el legado árabe, bereber y andalusí de las grandes capitales históricas del norte.",
      hero_image: "https://images.unsplash.com/photo-1570133435536-7ececf000ef6?auto=format&fit=crop&w=2400&q=85",
      airports: "Entrada Casablanca · Salida Fez",
      quick_airports: "Casablanca / Fez",
      quick_places: "Casablanca · Rabat · Volubilis · Moulay Idriss · Meknes · Fez",
      highlights: "Hassan II · Chellah · Volubilis · Meknes · Fez el-Bali",
      description_title: "Cuatro capitales, mil años de historia.",
      description: [
        "Marruecos posee un rico legado histórico y arquitectónico que podemos apreciar especialmente en sus llamadas «Ciudades Imperiales».",
        "Este circuito recorre algunos de los tesoros más emblemáticos del norte del país: medinas Patrimonio de la Humanidad, mosaicos romanos, palacios y mausoleos.",
        "Una inmersión cultural ideal para quienes disponen de pocos días pero quieren conocer el Marruecos más auténtico y monumental.",
      ],
    },
    en: {
      title: "Imperial cities.",
      eyebrow_prefix: "Circuit · Imperial cities of Morocco",
      place: "Casablanca · Rabat · Meknes · Fez",
      subtitle: "Four days through the Arab, Berber and Andalusian legacy of Morocco's great historic capitals.",
      hero_image: "https://images.unsplash.com/photo-1570133435536-7ececf000ef6?auto=format&fit=crop&w=2400&q=85",
      airports: "In Casablanca · Out Fez",
      quick_airports: "Casablanca / Fez",
      quick_places: "Casablanca · Rabat · Volubilis · Moulay Idriss · Meknes · Fez",
      highlights: "Hassan II · Chellah · Volubilis · Meknes · Fez el-Bali",
      description_title: "Four capitals, a thousand years of history.",
      description: [
        "Morocco holds a rich historic and architectural legacy especially visible in its «Imperial Cities».",
        "This circuit explores some of the most emblematic treasures of the country's north: UNESCO medinas, Roman mosaics, palaces and mausoleums.",
        "A cultural immersion ideal for those with limited days who still want to discover the most authentic and monumental Morocco.",
      ],
    },
    fr: {
      title: "Cités impériales.",
      eyebrow_prefix: "Circuit · Cités impériales du Maroc",
      place: "Casablanca · Rabat · Meknès · Fès",
      subtitle: "Quatre jours à travers l'héritage arabe, berbère et andalou des grandes capitales historiques du Maroc.",
      hero_image: "https://images.unsplash.com/photo-1570133435536-7ececf000ef6?auto=format&fit=crop&w=2400&q=85",
      airports: "Arrivée Casablanca · Sortie Fès",
      quick_airports: "Casablanca / Fès",
      quick_places: "Casablanca · Rabat · Volubilis · Moulay Idriss · Meknès · Fès",
      highlights: "Hassan II · Chellah · Volubilis · Meknès · Fès el-Bali",
      description_title: "Quatre capitales, mille ans d'histoire.",
      description: [
        "Le Maroc conserve un riche héritage historique et architectural particulièrement visible dans ses « cités impériales ».",
        "Ce circuit traverse les trésors les plus emblématiques du nord du pays : médinas UNESCO, mosaïques romaines, palais et mausolées.",
        "Une immersion culturelle idéale pour ceux qui disposent de peu de jours mais souhaitent découvrir le Maroc le plus authentique et monumental.",
      ],
    },
  },
  route: [
    { day: 1, lat: 33.5731, lng: -7.5898, type: "city",    name: T("Casablanca · Hassan II", "Casablanca · Hassan II", "Casablanca · Hassan II") },
    { day: 1, lat: 34.0209, lng: -6.8416, type: "city",    name: T("Rabat", "Rabat", "Rabat") },
    { day: 2, lat: 34.0731, lng: -5.5547, type: "unesco",  name: T("Volubilis · ruinas romanas", "Volubilis · Roman ruins", "Volubilis · ruines romaines") },
    { day: 2, lat: 33.8930, lng: -5.5473, type: "city",    name: T("Moulay Idriss · Meknes", "Moulay Idriss · Meknes", "Moulay Idriss · Meknès") },
    { day: 3, lat: 33.9716, lng: -5.5481, type: "kasbah",  name: T("Meknes · Bab al Mansour", "Meknes · Bab al Mansour", "Meknès · Bab al Mansour") },
    { day: 3, lat: 34.0651, lng: -4.9760, type: "city",    name: T("Fez · Riad en la medina", "Fez · Medina riad", "Fès · Riad de la médina") },
    { day: 4, lat: 34.0635, lng: -4.9737, type: "unesco",  name: T("Fez el-Bali · medina UNESCO", "Fez el-Bali · UNESCO medina", "Fès el-Bali · médina UNESCO") },
    { day: 5, lat: 33.9273, lng: -4.9779, type: "airport", name: T("Fez · Aeropuerto · Regreso", "Fez · Airport · Return", "Fès · Aéroport · Retour") },
  ],
  days: [DAY_01, DAY_02, DAY_03, DAY_04, DAY_05],
  details: {
    includes: {
      es: [
        "Una noche en Rabat en riad u Hotel 4★ · Media Pensión",
        "Una noche en Meknes en riad u Hotel 4★ · Media Pensión",
        "Dos noches en Fez en riad dentro de la medina u Hotel 4★ · Media Pensión",
        "Vehículo con chófer durante todo el itinerario",
        "Visita de la Mezquita Hassan II en Casablanca",
        "Visita guiada de Rabat · Entrada al Chellah",
        "Visita guiada y entrada a Volubilis",
        "Visita guiada de Meknes · Entradas a Heri es Souani y Habs Qara",
        "Visita guiada de Fez · Entrada a la Madraza",
        "Transfers de aeropuerto",
        "Seguro de asistencia en viaje",
      ],
      en: [
        "One night in Rabat in a riad or 4★ hotel · half board",
        "One night in Meknes in a riad or 4★ hotel · half board",
        "Two nights in Fez in a medina riad or 4★ hotel · half board",
        "Vehicle with driver throughout the route",
        "Visit to the Hassan II Mosque in Casablanca",
        "Guided tour of Rabat · Chellah entrance fee",
        "Guided tour and entrance fee to Volubilis",
        "Guided tour of Meknes · Entrance fees to Heri es Souani and Habs Qara",
        "Guided tour of Fez · Madrasa entrance fee",
        "Airport transfers",
        "Travel assistance insurance",
      ],
      fr: [
        "Une nuit à Rabat en riad ou hôtel 4★ · demi-pension",
        "Une nuit à Meknès en riad ou hôtel 4★ · demi-pension",
        "Deux nuits à Fès en riad de la médina ou hôtel 4★ · demi-pension",
        "Véhicule avec chauffeur tout au long de l'itinéraire",
        "Visite de la mosquée Hassan II à Casablanca",
        "Visite guidée de Rabat · Entrée du Chellah",
        "Visite guidée et entrée à Volubilis",
        "Visite guidée de Meknès · Entrées à Heri es Souani et Habs Qara",
        "Visite guidée de Fès · Entrée à la médersa",
        "Transferts aéroport",
        "Assistance voyage",
      ],
    },
    excludes: {
      es: [
        "Bebidas",
        "Comidas del mediodía",
        "Visitas o guías no especificados",
        "Extras personales como hammam o masajes",
        "Vuelos internacionales",
        "Suplemento para añadir seguro de cancelación · 45 € por persona para viajes de máximo 9 días",
      ],
      en: [
        "Drinks",
        "Lunches",
        "Visits or guides not specified",
        "Personal extras (hammam, massages…)",
        "International flights",
        "Optional cancellation insurance · €45 per person for trips of up to 9 days",
      ],
      fr: [
        "Boissons",
        "Déjeuners",
        "Visites ou guides non spécifiés",
        "Extras personnels (hammam, massages…)",
        "Vols internationaux",
        "Assurance annulation en option · 45 € par personne pour les voyages jusqu'à 9 jours",
      ],
    },
    notes: {
      es: [
        "Opciones de vuelos: Royal Air Maroc vía Casablanca, Vueling, Ryanair u otras low-cost. Consultar opciones y condiciones.",
        "Los precios se calculan según la ocupación del vehículo turismo o 4x4. El coste se reparte entre los ocupantes.",
        "Suplemento habitación individual: 175 €.",
        "Descuento niños (3-11 años) compartiendo con dos adultos: 165 €.",
        "En temporada alta, algunos guías locales en medinas pueden compartirse con otros viajeros.",
        "Los chóferes hispanohablantes son limitados en temporada alta.",
        "El viaje se realiza en vehículo turismo o 4x4 con chófer local.",
        "Pasaporte obligatorio con vigencia mínima de 6 meses.",
      ],
      en: [
        "Flight options: Royal Air Maroc via Casablanca, Vueling, Ryanair or other low-cost. Options on request.",
        "Rates depend on vehicle/4x4 occupancy. Cost is split between passengers.",
        "Single room supplement: €175.",
        "Children discount (3-11) sharing with two adults: €165.",
        "In high season, medina guides may be shared with other travellers.",
        "Spanish-speaking drivers are limited in high season.",
        "Travel by car or 4x4 with local driver.",
        "Valid passport required with at least 6 months remaining.",
      ],
      fr: [
        "Options de vol : Royal Air Maroc via Casablanca, Vueling, Ryanair ou autres low-cost. Options sur demande.",
        "Tarifs selon l'occupation du véhicule/4x4. Le coût est partagé.",
        "Supplément single : 175 €.",
        "Réduction enfants (3-11 ans) partageant avec 2 adultes : 165 €.",
        "En haute saison, les guides de médina peuvent être partagés.",
        "Chauffeurs hispanophones limités en haute saison.",
        "Voyage en voiture ou 4x4 avec chauffeur local.",
        "Passeport valable au minimum 6 mois.",
      ],
    },
    terms: {
      es: [
        "Reserva: 30% del importe del viaje en el momento de la reserva.",
        "Pago final: 70% restante hasta 30 días antes de la salida.",
        "En caso de emisión inmediata de vuelos: 100% del billete al reservar.",
        "Cancelación 45 días antes de la salida: 30% de gastos.",
        "Cancelación 21 días antes de la salida: 100% de gastos.",
        "Penalización adicional de 50 € por reserva en concepto de gastos de gestión.",
        "Estas condiciones aplican sólo a los servicios de tierra. El seguro de cancelación no es reembolsable.",
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

export default PROGRAM_CI_45;
