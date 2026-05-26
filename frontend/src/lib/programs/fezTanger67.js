// Fez → Tánger · 6 nights / 7 days · Fez · Meknes · Volubilis · Chefchaouen · Tetuán · Asilah · Tánger
const T = (es, en, fr) => ({ es, en, fr });

const DAY_01 = {
  route_id: "ft67-arrival-fez",
  id: "ft67-d1",
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
  route_id: "ft67-fez-medina",
  id: "ft67-d2",
  image: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=2000&q=85",
  accent: "#C16542",
  title: T(
    "Fez · la capital cultural de Marruecos",
    "Fez · Morocco's cultural capital",
    "Fès · capitale culturelle du Maroc",
  ),
  body: {
    es: "Hoy descubriremos Fez el-Bali, la antigua medina de Fez y una de las mejor conservadas del mundo árabe. Acompañados por un guía local recorreremos sus laberínticas callejuelas medievales repletas de talleres artesanales, mezquitas, palacios, escuelas coránicas y zocos tradicionales. Fez es considerada la ciudad imperial más espiritual y cultural de Marruecos. La visita se realiza completamente a pie, ya que en esta medina declarada Patrimonio de la Humanidad por la UNESCO está prohibido el acceso de vehículos. Durante la jornada conoceremos cómo se organizan sus barrios alrededor de mezquita, fuente, hammam, horno y escuela coránica. También visitaremos las famosas tenerías tradicionales y algunos miradores panorámicos de la ciudad. Cena y alojamiento en riad dentro de la medina u hotel 4★.",
    en: "Today we discover Fez el-Bali, the ancient medina of Fez — one of the best-preserved in the Arab world. With a local guide we walk medieval alleys packed with artisan workshops, mosques, palaces, Koranic schools and traditional souks. Fez is the country's most spiritual and cultural imperial city. The visit is entirely on foot — vehicles are forbidden in this UNESCO medina. We see how neighbourhoods are organised around mosque, fountain, hammam, oven and Koranic school. We also visit the traditional tanneries and climb to a panoramic viewpoint. Dinner and overnight in a medina riad or 4★ hotel.",
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
  route_id: "ft67-meknes-volubilis-chefchaouen",
  id: "ft67-d3",
  image: "https://images.unsplash.com/photo-1597212618440-806262de4f6b?auto=format&fit=crop&w=2000&q=85",
  accent: "#5A6B4F",
  title: T(
    "Meknes · Volubilis · Moulay Idriss · Chefchaouen",
    "Meknes · Volubilis · Moulay Idriss · Chefchaouen",
    "Meknès · Volubilis · Moulay Idriss · Chefchaouen",
  ),
  body: {
    es: "Salida temprano hacia Meknes, una de las ciudades imperiales más monumentales de Marruecos. Visita guiada de la ciudad y de sus principales monumentos: Bab al Mansour, Mausoleo de Moulay Ismail, graneros y establos «Heri es Souani» y prisión subterránea «Habs Qara». Tras la visita continuaremos hacia Volubilis, el yacimiento arqueológico romano más importante de Marruecos: arco de triunfo, capitolio, Casa de Baco y antiguos mosaicos romanos. También pasaremos por Moulay Idriss, ciudad santa y centro espiritual del país. Continuación hacia Chefchaouen, el famoso «pueblo azul» de la cordillera del Rif. Cena y alojamiento en riad dentro de la medina.",
    en: "Early departure to Meknes, one of Morocco's most monumental imperial cities. Guided tour of its main monuments: Bab al Mansour, the Mausoleum of Moulay Ismail, the royal granaries and stables «Heri es Souani» and the underground prison «Habs Qara». We continue to Volubilis, Morocco's most important Roman archaeological site — triumphal arch, capitolium, House of Bacchus and ancient Roman mosaics. We also pass through Moulay Idriss, a holy city and major spiritual centre. We continue to Chefchaouen, the famous «blue town» of the Rif. Dinner and overnight in a medina riad.",
    fr: "Départ matinal vers Meknès, l'une des cités impériales les plus monumentales du Maroc. Visite guidée de ses monuments principaux : Bab al Mansour, mausolée de Moulay Ismaïl, greniers et écuries royales « Heri es Souani » et prison souterraine « Habs Qara ». Route vers Volubilis, le site archéologique romain le plus important du Maroc — arc de triomphe, capitole, maison de Bacchus et mosaïques romaines. Passage par Moulay Idriss, ville sainte et centre spirituel. Continuation vers Chefchaouen, le célèbre « village bleu » du Rif. Dîner et nuit en riad de la médina.",
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
  route_id: "ft67-chefchaouen-akchour-tetuan",
  id: "ft67-d4",
  image: "https://images.unsplash.com/photo-1597212618440-806262de4f6b?auto=format&fit=crop&w=2000&q=85",
  accent: "#5A7F9C",
  title: T(
    "Chefchaouen · Akchour · Tetuán",
    "Chefchaouen · Akchour · Tetouan",
    "Chefchaouen · Akchour · Tétouan",
  ),
  body: {
    es: "Por la mañana visita guiada de Chefchaouen. La ciudad se encuentra situada entre las montañas Tisouka y Megou, y su nombre en bereber significa «Mira los Cuernos». Durante la visita recorreremos Plaza Uta el-Hammam, la Gran Mezquita, la Kasbah del siglo XVII y sus jardines, la Plaza Makhzen, Bab el-Ansar y la Fuente Ras el-Maa. Por la tarde tiempo libre para pasear junto al riachuelo y descubrir el barrio tradicional de los lavaderos de Sebbanin. Posteriormente salida hacia Tetuán. Durante el trayecto realizaremos una parada en las Cascadas de Akchour para disfrutar del paisaje y realizar fotografías. Llegada a Tetuán. Cena y alojamiento en riad dentro de la medina u hotel 4★.",
    en: "Morning guided tour of Chefchaouen, set between the Tisouka and Megou mountains — its Berber name means «look at the horns». We walk through Uta el-Hammam square, the Grand Mosque, the 17th-century Kasbah and its gardens, Makhzen square, Bab el-Ansar and the Ras el-Maa fountain. Free time in the afternoon to stroll along the stream and discover the traditional Sebbanin laundry quarter. Then drive to Tetouan, stopping at the Akchour Waterfalls to enjoy the landscape and take photos. Arrival in Tetouan. Dinner and overnight in a medina riad or 4★ hotel.",
    fr: "Visite guidée de Chefchaouen le matin, lovée entre les montagnes Tisouka et Megou — son nom berbère signifie « regarde les cornes ». Nous parcourons la place Uta el-Hammam, la Grande Mosquée, la Kasbah du XVIIe siècle et ses jardins, la place Makhzen, Bab el-Ansar et la fontaine Ras el-Maa. Après-midi libre pour flâner le long du ruisseau et découvrir le quartier des lavoirs traditionnels de Sebbanin. Route vers Tétouan avec arrêt aux cascades d'Akchour. Arrivée à Tétouan. Dîner et nuit en riad de la médina ou hôtel 4★.",
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
  route_id: "ft67-tetuan-asilah",
  id: "ft67-d5",
  image: "https://images.unsplash.com/photo-1597212618440-806262de4f6b?auto=format&fit=crop&w=2000&q=85",
  accent: "#5A7F9C",
  title: T(
    "Tetuán · Asilah · murallas portuguesas",
    "Tetouan · Asilah · Portuguese ramparts",
    "Tétouan · Asilah · remparts portugais",
  ),
  body: {
    es: "Por la mañana visita guiada de Tetuán, conocida como «La Paloma Blanca». Su medina, declarada Patrimonio de la Humanidad por la UNESCO, conserva una fuerte influencia andalusí heredada de la época del Protectorado español. Posteriormente continuación hacia Asilah, una de las ciudades costeras más encantadoras del norte de Marruecos. La medina de Asilah está rodeada por murallas construidas por los portugueses en el siglo XV. Sus calles blancas decoradas con murales artísticos y sus puertas históricas convierten la ciudad en un destino ideal para amantes de la fotografía y la cultura. Durante el paseo libre por la medina podremos descubrir Bab Homar («Puerta Tierra»), Bab el Bahar («Puerta del Mar»), Bab Kasbah, las murallas portuguesas y el cementerio musulmán frente al océano. También existe la posibilidad de disfrutar de la puesta de sol en alguna de las playas cercanas. Alojamiento en riad dentro de la medina.",
    en: "Morning guided tour of Tetouan, known as «the White Dove». Its UNESCO medina still keeps a strong Andalusian influence inherited from the Spanish Protectorate. We then continue to Asilah, one of the most charming coastal towns in northern Morocco. The Asilah medina is surrounded by 15th-century Portuguese ramparts. Its white-washed streets adorned with artistic murals and its historic gates make Asilah an ideal destination for photography and culture lovers. On a free walk through the medina we discover Bab Homar (the «Land Gate»), Bab el Bahar (the «Sea Gate»), Bab Kasbah, the Portuguese ramparts and the Muslim cemetery overlooking the ocean. Optional: enjoy the sunset on a nearby beach. Overnight in a medina riad.",
    fr: "Visite guidée de Tétouan le matin, surnommée « la Colombe Blanche ». Sa médina UNESCO conserve une forte influence andalouse héritée du Protectorat espagnol. Route vers Asilah, l'une des plus charmantes villes côtières du nord du Maroc. Sa médina est ceinte de remparts portugais du XVe siècle. Ses ruelles blanches ornées de fresques et ses portes historiques en font une destination idéale pour les amateurs de photographie et de culture. Balade libre dans la médina pour découvrir Bab Homar (« porte de terre »), Bab el Bahar (« porte de la mer »), Bab Kasbah, les remparts portugais et le cimetière musulman face à l'océan. En option : coucher de soleil sur une plage voisine. Nuit en riad de la médina.",
  },
  culture: [
    {
      title: T("Asilah · murallas portuguesas", "Asilah · Portuguese ramparts", "Asilah · remparts portugais"),
      body: T(
        "Conquistada en 1471 por Portugal, sus murallas blancas construidas sobre el Atlántico se conservan intactas y dialogan cada agosto con su célebre festival de muralismo internacional.",
        "Captured by Portugal in 1471, its white ramparts overlooking the Atlantic remain intact and dialogue each August with the famous international mural festival.",
        "Conquise par le Portugal en 1471, ses remparts blancs surplombant l'Atlantique sont intacts et dialoguent chaque août avec son célèbre festival international de fresques.",
      ),
    },
  ],
};

const DAY_06 = {
  route_id: "ft67-asilah-tanger",
  id: "ft67-d6",
  image: "https://images.unsplash.com/photo-1597212618440-806262de4f6b?auto=format&fit=crop&w=2000&q=85",
  accent: "#3A4A5F",
  title: T(
    "Cabo Espartel · Grutas de Hércules · Tánger",
    "Cape Spartel · Caves of Hercules · Tangier",
    "Cap Spartel · Grottes d'Hercule · Tanger",
  ),
  body: {
    es: "A la hora convenida salida en dirección Tánger. Durante el recorrido visitaremos las Grutas de Hércules y Cabo Espartel, donde convergen las aguas del Atlántico y el Mediterráneo. Llegada a Tánger y tiempo libre para descubrir la ciudad a vuestro aire. Cena y alojamiento en riad u hotel 5★. Este es el último día de vehículo con chófer.",
    en: "At the agreed time, drive toward Tangier. We visit the Caves of Hercules and Cape Spartel — where the Atlantic Ocean meets the Mediterranean Sea. Arrival in Tangier and free time to explore the city at your own pace. Dinner and overnight in a riad or 5★ hotel. This is the last day of driver service.",
    fr: "À l'heure convenue, route vers Tanger. Visite des Grottes d'Hercule et du Cap Spartel, où l'Atlantique rencontre la Méditerranée. Arrivée à Tanger et temps libre pour découvrir la ville à votre rythme. Dîner et nuit en riad ou hôtel 5★. Dernier jour de service chauffeur.",
  },
  culture: [],
};

const DAY_07 = {
  route_id: "ft67-return",
  id: "ft67-d7",
  image: "https://images.unsplash.com/photo-1597212618440-806262de4f6b?auto=format&fit=crop&w=2000&q=85",
  accent: "#5C5248",
  title: T("Regreso desde Tánger", "Return from Tangier", "Retour depuis Tanger"),
  body: {
    es: "A la hora acordada, recogida en el riad u hotel y traslado al aeropuerto de Tánger para tomar el vuelo de regreso.",
    en: "At the agreed time, pick-up at the riad or hotel and transfer to Tangier airport for the return flight.",
    fr: "À l'heure convenue, prise en charge au riad ou à l'hôtel et transfert à l'aéroport de Tanger pour le vol retour.",
  },
  culture: [],
};

export const PROGRAM_FT_67 = {
  routeId: "tourFezTanger67",
  duration_key: "ft6n7d",
  duration: T("6 noches / 7 días", "6 nights / 7 days", "6 nuits / 7 jours"),
  prices: { low: 1290, mid: 1490, high: 1690, premium: 1890 },
  meta: {
    es: {
      title: "Fez – Asilah – Tánger.",
      eyebrow_prefix: "Circuito · Norte de Marruecos",
      place: "Fez · Chefchaouen · Asilah · Tánger",
      subtitle: "Seis días por el norte cultural sumando las murallas portuguesas de Asilah y la luz del Mediterráneo.",
      hero_image: "https://images.unsplash.com/photo-1570133435536-7ececf000ef6?auto=format&fit=crop&w=2400&q=85",
      airports: "Entrada Fez · Salida Tánger",
      quick_airports: "Fez / Tánger",
      quick_places: "Fez · Meknes · Volubilis · Chefchaouen · Akchour · Tetuán · Asilah · Tánger",
      highlights: "Fez el-Bali · Volubilis · Chefchaouen · Tetuán · Asilah · Cabo Espartel",
      description_title: "El norte de Marruecos en seis jornadas.",
      description: [
        "Un viaje por el norte de Marruecos visitando algunas de las Ciudades Imperiales y parte de las costas mediterránea y atlántica.",
        "Asilah aporta sus murallas portuguesas del siglo XV y sus calles blancas decoradas con murales artísticos.",
        "Mar, montaña y ciudades llenas de cultura, historia y tradición.",
      ],
    },
    en: {
      title: "Fez – Asilah – Tangier.",
      eyebrow_prefix: "Circuit · Northern Morocco",
      place: "Fez · Chefchaouen · Asilah · Tangier",
      subtitle: "Six days through the cultural north adding the Portuguese ramparts of Asilah and the Mediterranean light.",
      hero_image: "https://images.unsplash.com/photo-1570133435536-7ececf000ef6?auto=format&fit=crop&w=2400&q=85",
      airports: "In Fez · Out Tangier",
      quick_airports: "Fez / Tangier",
      quick_places: "Fez · Meknes · Volubilis · Chefchaouen · Akchour · Tetouan · Asilah · Tangier",
      highlights: "Fez el-Bali · Volubilis · Chefchaouen · Tetouan · Asilah · Cape Spartel",
      description_title: "Northern Morocco over six days.",
      description: [
        "A journey through northern Morocco visiting some of the Imperial Cities and parts of the Mediterranean and Atlantic coasts.",
        "Asilah brings its 15th-century Portuguese ramparts and its white-washed streets adorned with artistic murals.",
        "Sea, mountain and cities full of culture, history and tradition.",
      ],
    },
    fr: {
      title: "Fès – Asilah – Tanger.",
      eyebrow_prefix: "Circuit · Nord du Maroc",
      place: "Fès · Chefchaouen · Asilah · Tanger",
      subtitle: "Six jours au nord culturel avec les remparts portugais d'Asilah et la lumière de la Méditerranée.",
      hero_image: "https://images.unsplash.com/photo-1570133435536-7ececf000ef6?auto=format&fit=crop&w=2400&q=85",
      airports: "Arrivée Fès · Sortie Tanger",
      quick_airports: "Fès / Tanger",
      quick_places: "Fès · Meknès · Volubilis · Chefchaouen · Akchour · Tétouan · Asilah · Tanger",
      highlights: "Fès el-Bali · Volubilis · Chefchaouen · Tétouan · Asilah · Cap Spartel",
      description_title: "Le nord du Maroc en six jours.",
      description: [
        "Un voyage au nord du Maroc avec certaines cités impériales et une partie des côtes méditerranéenne et atlantique.",
        "Asilah apporte ses remparts portugais du XVe siècle et ses ruelles blanches ornées de fresques.",
        "Mer, montagne et villes pleines de culture, d'histoire et de tradition.",
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
    { day: 5, lat: 35.4651, lng: -6.0349, type: "city",    name: T("Asilah · murallas portuguesas", "Asilah · Portuguese ramparts", "Asilah · remparts portugais") },
    { day: 6, lat: 35.7956, lng: -5.9376, type: "city",    name: T("Cabo Espartel · Grutas de Hércules", "Cape Spartel · Caves of Hercules", "Cap Spartel · Grottes d'Hercule") },
    { day: 6, lat: 35.7595, lng: -5.8340, type: "city",    name: T("Tánger", "Tangier", "Tanger") },
    { day: 7, lat: 35.7269, lng: -5.9168, type: "airport", name: T("Tánger · Aeropuerto · Regreso", "Tangier · Airport · Return", "Tanger · Aéroport · Retour") },
  ],
  days: [DAY_01, DAY_02, DAY_03, DAY_04, DAY_05, DAY_06, DAY_07],
  details: {
    includes: {
      es: [
        "Dos noches en Fez en riad dentro de la medina · Media Pensión",
        "Una noche en Chefchaouen en riad dentro de la medina · Media Pensión",
        "Una noche en Tetuán en riad dentro de la medina u Hotel 4★ · Media Pensión",
        "Una noche en Asilah en riad dentro de la medina u Hotel 4★ · Media Pensión",
        "Una noche en Tánger en riad dentro de la medina u Hotel 5★ · Media Pensión",
        "Vehículo 4x4 o turismo con chófer del día 3 al día 6",
        "Visita guiada de Fez (1 día) · Entrada a la Madraza",
        "Visita guiada de Meknes · Entradas a Heri es Souani y Habs Qara",
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
        "One night in Asilah in a medina riad or 4★ hotel · half board",
        "One night in Tangier in a medina riad or 5★ hotel · half board",
        "4x4 or car with driver from day 3 to day 6",
        "Guided tour of Fez (1 day) · Madrasa entrance fee",
        "Guided tour of Meknes · Entrance fees to Heri es Souani and Habs Qara",
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
        "Une nuit à Asilah en riad de la médina ou hôtel 4★ · demi-pension",
        "Une nuit à Tanger en riad de la médina ou hôtel 5★ · demi-pension",
        "4x4 ou voiture avec chauffeur du jour 3 au jour 6",
        "Visite guidée de Fès (1 jour) · Entrée à la médersa",
        "Visite guidée de Meknès · Entrées à Heri es Souani et Habs Qara",
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
        "Opciones de vuelos: Royal Air Maroc vía Casablanca, Vueling, Ryanair u otras low-cost. Consultar opciones y condiciones.",
        "Los precios se calculan según la ocupación del vehículo. El coste se reparte entre los ocupantes.",
        "Suplemento habitación individual: 220 €.",
        "Descuento niños (3-11 años) compartiendo con dos adultos: 265 €.",
        "Los chóferes hispanohablantes son limitados en temporada alta.",
        "Los guías locales en medinas pueden compartirse con otros viajeros.",
        "El viaje se realiza en vehículo turismo o 4x4 con chófer local.",
        "Pasaporte obligatorio con vigencia mínima de 6 meses.",
        "Seguro de cancelación opcional · 45 € por persona para viajes de máximo 9 días.",
      ],
      en: [
        "Flight options: Royal Air Maroc via Casablanca, Vueling, Ryanair or other low-cost. Options on request.",
        "Rates depend on vehicle occupancy. Transport cost is split between passengers.",
        "Single room supplement: €220.",
        "Children discount (3-11) sharing with two adults: €265.",
        "Spanish-speaking drivers are limited in high season.",
        "In high season, medina guides may be shared with other travellers.",
        "Travel by car or 4x4 with local driver.",
        "Valid passport required with at least 6 months remaining.",
        "Optional cancellation insurance · €45 per person for trips of up to 9 days.",
      ],
      fr: [
        "Options de vol : Royal Air Maroc via Casablanca, Vueling, Ryanair ou autres low-cost. Options sur demande.",
        "Tarifs selon l'occupation du véhicule. Le coût est partagé entre les passagers.",
        "Supplément single : 220 €.",
        "Réduction enfants (3-11 ans) partageant avec 2 adultes : 265 €.",
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

export default PROGRAM_FT_67;
