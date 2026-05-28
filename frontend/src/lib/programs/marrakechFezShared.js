// Shared blocks for the Marrakech↔Fez programmes (excludes/notes/terms +
// reusable "lighter" arrival & full Marrakech medina days).

const T = (es, en, fr) => ({ es, en, fr });

/* ============================================================
   Shared days · used by 78 and 89 variants
============================================================ */

export const DAY_FRM_ARRIVAL_LIGHT = {
  route_id: "frm-arrival-light",
  id: "frm-d-arrival",
  image: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=2000&q=85",
  accent: "#C16542",
  title: T(
    "Llegada a Marrakech · primera toma de contacto",
    "Arrival in Marrakech · first impressions",
    "Arrivée à Marrakech · première rencontre",
  ),
  body: {
    es: "Salida desde el aeropuerto de origen con destino Marrakech. Llegada — puede haber diferencia horaria según la época del año. Recogida en el aeropuerto y traslado al Riad en la Medina o Hotel 5★. Alojamiento. En función del horario de llegada, se recomienda una primera toma de contacto con la ciudad visitando la Plaza Djemaa el-Fna, uno de los lugares más emblemáticos de Marrakech. A estas horas, la plaza se llena de recitadores, adivinadores, malabaristas, sacamuelas, danzantes, encantadores de serpientes y muchas otras expresiones tradicionales. Al anochecer se montan paradas de comida iluminadas al aire libre, donde se pueden degustar platos típicos marroquíes en un ambiente vibrante y único.",
    en: "Departure from your home airport bound for Marrakech. Arrival — time difference depending on the season. Airport pick-up and transfer to a riad in the medina or 5★ hotel. Overnight. Depending on your arrival time, we recommend a first encounter with the city by visiting the legendary Jemaa el-Fna square, one of Marrakech's most emblematic spots. At this hour the square fills with storytellers, fortune-tellers, jugglers, dancers, snake charmers and countless traditional acts. At nightfall, illuminated open-air food stalls serve traditional Moroccan dishes in a vibrant, one-of-a-kind atmosphere.",
    fr: "Départ depuis votre aéroport d'origine pour Marrakech. Arrivée — décalage horaire possible selon la saison. Accueil et transfert au riad dans la médina ou hôtel 5★. Nuit. Selon l'heure d'arrivée, nous recommandons une première rencontre avec la ville sur la mythique place Jemaa el-Fna, l'un des lieux les plus emblématiques de Marrakech. À cette heure, la place se remplit de conteurs, devins, jongleurs, danseurs, charmeurs de serpents et bien d'autres expressions traditionnelles. À la tombée du jour, des échoppes de cuisine en plein air illuminent la place et servent des plats traditionnels dans une ambiance vibrante.",
  },
  culture: [
    {
      title: T("Djemaa el-Fna · obra maestra UNESCO", "Jemaa el-Fna · UNESCO masterpiece", "Jemaa el-Fna · chef-d'œuvre UNESCO"),
      body: T(
        "Reconocida en 2001 como obra maestra del patrimonio oral e inmaterial de la humanidad — la plaza más viva de África, distinta de día y de noche.",
        "Recognised in 2001 as a masterpiece of the oral and intangible heritage of humanity — the most alive square in Africa, utterly different by day and night.",
        "Reconnue en 2001 chef-d'œuvre du patrimoine oral et immatériel de l'humanité — la place la plus vivante d'Afrique.",
      ),
    },
  ],
};

export const DAY_FRM_MARRAKECH_MEDINA = {
  route_id: "frm-marrakech-medina",
  id: "frm-d-medina",
  image: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=2000&q=85",
  accent: "#D4A373",
  title: T(
    "Visita guiada por la Medina de Marrakech",
    "Guided tour of the Marrakech medina",
    "Visite guidée de la médina de Marrakech",
  ),
  body: {
    es: "Por la mañana, visita guiada a pie por la Medina de Marrakech con guía local. Comenzaremos admirando el alminar de la Koutoubia, gemela de la Giralda de Sevilla, y continuaremos con el Palacio de la Bahía, uno de los ejemplos más destacados de la arquitectura marroquí del siglo XIX. Nos adentraremos por las estrechas callejuelas del Zoco para ver a los artesanos en plena actividad — tejedores de alfombras, fabricantes de babuchas, talleres de cuero, madera y metales — descubriendo una gran variedad de artesanía tradicional de alta calidad. Visitaremos una farmacia bereber donde nos enseñarán algunos de sus remedios naturales y secretos ancestrales. Finalizaremos en la Plaza Djemaa el-Fna, que de día muestra un ambiente totalmente distinto al de la noche anterior. Tarde libre para practicar el arte del regateo o explorar a nuestro ritmo los rincones más auténticos y recónditos de la medina. Alojamiento en Riad en la Medina o Hotel 5★.",
    en: "Morning guided walking tour of the Marrakech medina with a local guide. We start admiring the Koutoubia minaret — twin sister of Seville's Giralda — and continue with the Bahia Palace, one of the finest examples of 19th-century Moroccan architecture. We enter the narrow souk alleys to see artisans at work — carpet weavers, babouche makers, leather, wood and metal workshops — discovering a wide variety of high-quality traditional crafts. Visit to a Berber pharmacy where we discover herbal remedies and ancestral «secrets». We end at Jemaa el-Fna square, with a daytime atmosphere completely different from the previous night. Free afternoon to haggle or explore the most authentic, hidden corners of the medina at your own pace. Overnight in a Medina riad or 5★ hotel.",
    fr: "Matin : visite guidée à pied de la médina de Marrakech avec guide local. Nous commençons par le minaret de la Koutoubia — sœur jumelle de la Giralda — et continuons par le palais de la Bahia, l'un des plus beaux exemples de l'architecture marocaine du XIXe siècle. Plongée dans les ruelles du souk pour voir les artisans à l'œuvre — tisserands de tapis, babouchiers, ateliers de cuir, bois et métaux — découvrant une grande variété d'artisanat traditionnel de haute qualité. Visite d'une pharmacie berbère et de ses « secrets » naturels. Nous terminons à Jemaa el-Fna, dont l'ambiance diurne contraste radicalement avec la veille. Après-midi libre pour le marchandage ou pour explorer la médina à votre rythme. Nuit en riad de la médina ou hôtel 5★.",
  },
  culture: [
    {
      title: T("Koutoubia · hermana gemela de la Giralda", "Koutoubia · twin sister of the Giralda", "Koutoubia · sœur jumelle de la Giralda"),
      body: T(
        "El alminar de 77 m fue construido por los almohades en el siglo XII, junto con la Giralda y la Torre Hassan de Rabat, por el mismo arquitecto.",
        "The 77-m minaret was built by the Almohads in the 12th century — alongside Seville's Giralda and Rabat's Hassan Tower — by the same architect.",
        "Le minaret de 77 m fut construit par les Almohades au XIIe siècle, avec la Giralda et la tour Hassan, par le même architecte.",
      ),
    },
    {
      title: T("Palacio de la Bahía · el palacio de la favorita", "Bahia Palace · the favourite's palace", "Palais de la Bahia · le palais de la favorite"),
      body: T(
        "Construido a finales del s.XIX por Si Moussa para su esposa preferida — 8.000 m² de patios, jardines y artesonados de cedro pintado a mano.",
        "Built in the late 19th century by Si Moussa for his favourite wife — 8,000 m² of patios, gardens and hand-painted cedar coffered ceilings.",
        "Bâti fin XIXe par Si Moussa pour son épouse favorite — 8 000 m² de patios, jardins et plafonds en cèdre peint à la main.",
      ),
    },
  ],
};

/* ============================================================
   Shared days · used only by 89 variant
============================================================ */

export const DAY_FRM_MGOUN = {
  route_id: "frm-mgoun",
  id: "frm-d-mgoun",
  image: "https://images.unsplash.com/photo-1542401886-65d6c61db217?auto=format&fit=crop&w=2000&q=85",
  accent: "#A07042",
  title: T(
    "Alto Atlas Central · Boutaghrar · Amskar · Gargantas del M'Goun",
    "Central High Atlas · Boutaghrar · Amskar · M'Goun Gorges",
    "Haut Atlas Central · Boutaghrar · Amskar · Gorges du M'Goun",
  ),
  body: {
    es: "Salida por pistas hacia lo más profundo del Alto Atlas Central, atravesando paisajes espectaculares de gran contraste. Visita a los poblados bereberes de Boutaghrar y Amskar, donde parece haberse detenido el tiempo. En ruta observaremos montañas escarpadas, cañones, valles y grutas habitadas por nómadas en las zonas altas. Recorrido por las Gargantas del M'Goun, con la oportunidad de realizar un paseo irrepetible en este entorno único. Almuerzo en ruta en una «Gîte d'Étape» (casa de descanso tradicional). Cena y alojamiento en Hotel Xaluca Dadès.",
    en: "Drive on dirt tracks deep into the Central High Atlas, threading spectacular landscapes of great contrast. We visit Berber villages such as Boutaghrar and Amskar, where time seems to have stopped. Along the way, steep mountains, canyons, valleys and caves still inhabited by nomadic families in the high areas. Walk through the M'Goun Gorges — an unrepeatable hike in this unique landscape. Lunch in route at a «Gîte d'Étape» (traditional mountain guesthouse). Dinner and overnight at Hotel Xaluca Dades.",
    fr: "Départ par les pistes au cœur du Haut Atlas Central, à travers des paysages spectaculaires d'un grand contraste. Visite des villages berbères de Boutaghrar et Amskar où le temps semble s'être arrêté. En chemin, montagnes escarpées, canyons, vallées et grottes encore habitées par des familles nomades. Marche dans les Gorges du M'Goun — promenade inoubliable dans ce paysage unique. Déjeuner en route dans une « Gîte d'Étape » (gîte rural traditionnel). Dîner et nuit à l'Hôtel Xaluca Dadès.",
  },
  culture: [
    {
      title: T("M'Goun · 4.071 m", "M'Goun · 4,071 m", "M'Goun · 4 071 m"),
      body: T(
        "Tercer pico más alto de Marruecos. Sus gargantas son uno de los pocos lugares donde aún se cruza el río a pie entre paredes verticales.",
        "Morocco's third-highest peak. Its gorges are one of the few places where the river is still crossed on foot between vertical walls.",
        "Troisième plus haut sommet du Maroc. Ses gorges figurent parmi les rares lieux où l'on traverse la rivière à pied entre des parois verticales.",
      ),
    },
    {
      title: T("Boutaghrar y Amskar · imazighen detenidos en el tiempo", "Boutaghrar & Amskar · imazighen frozen in time", "Boutaghrar et Amskar · imazighen figés dans le temps"),
      body: T(
        "Conservan la arquitectura tradicional de adobe y los oficios artesanales bereberes — agricultura, tejido y trashumancia.",
        "Preserve traditional adobe architecture and Berber craft trades — farming, weaving and transhumance.",
        "Conservent l'architecture traditionnelle en pisé et les métiers berbères — agriculture, tissage et transhumance.",
      ),
    },
  ],
};

export const DAY_FRM_DADES_TODRA_ERFOUD_LIGHT = {
  route_id: "frm-dades-todra-erfoud-light",
  id: "frm-d-dadestoderfoud-light",
  image: "https://images.unsplash.com/photo-1570133435536-7ececf000ef6?auto=format&fit=crop&w=2000&q=85",
  accent: "#7C8B5C",
  title: T(
    "Valle del Dadès · Gargantas del Todra · Erfoud",
    "Dades Valley · Todra Gorges · Erfoud",
    "Vallée du Dadès · Gorges du Todra · Erfoud",
  ),
  body: {
    es: "Por la mañana, recorreremos el Valle del Dadès hasta llegar a sus famosas gargantas, donde haremos una parada en un mirador panorámico para disfrutar de un té con vistas. Durante el recorrido, breve parada en las curiosas formaciones rocosas conocidas como «patas de mono». Continuación hacia Tinerhir, pequeña y próspera población con casas rosas entre palmerales y punto de partida ideal para visitar las Gargantas del Todra. Paseo a pie siguiendo el curso del río entre las altas paredes de estas espectaculares gargantas. Más tarde, ruta hacia Erfoud, «la Puerta del Desierto». Cena y alojamiento en Kasbah Hotel Xaluca, un alojamiento único en Marruecos por sus peculiares características arquitectónicas y de diseño.",
    en: "Morning drive up the Dades Valley to its famous gorges and tea-stop at a panoramic viewpoint. Brief stop along the way at the curious «Monkey Fingers» rock formations. Continuation to Tinerhir, a small thriving town of pink houses among palm groves and the ideal gateway to the Todra Gorges. Walk along the river between the high walls of these spectacular gorges. Later, drive to Erfoud, «the gateway to the desert». Dinner and overnight at Kasbah Hotel Xaluca, a one-of-a-kind property in Morocco for its architecture.",
    fr: "Le matin, remontée de la vallée du Dadès jusqu'à ses célèbres gorges et arrêt-thé au mirador panoramique. Arrêt aux curieuses formations rocheuses dites « Doigts de Singe ». Continuation vers Tinerhir, petite ville prospère aux maisons roses parmi les palmeraies et point d'entrée idéal des Gorges du Todra. Marche le long de la rivière entre les hautes parois de ces gorges spectaculaires. Plus tard, route vers Erfoud, « la porte du désert ». Dîner et nuit à la Kasbah Hôtel Xaluca.",
  },
  culture: [
    {
      title: T("Gargantas del Todra · 160 m de pared vertical", "Todra Gorges · 160 m vertical walls", "Gorges du Todra · 160 m de parois verticales"),
      body: T(
        "Uno de los cañones más espectaculares de África del Norte, esculpido durante millones de años por el río Todra.",
        "One of North Africa's most spectacular canyons, carved over millions of years by the Todra river.",
        "Un des canyons les plus spectaculaires d'Afrique du Nord, sculpté sur des millions d'années.",
      ),
    },
  ],
};

/* ============================================================
   Shared days · used only by 910 variant
============================================================ */

export const DAY_FRM_SUNRISE_TOMBOUCTOU = {
  route_id: "frm-sunrise-tombouctou",
  id: "frm-d-sunrise-tombouctou",
  image: "https://images.unsplash.com/photo-1542401886-65d6c61db217?auto=format&fit=crop&w=2000&q=85",
  accent: "#D97742",
  title: T(
    "Amanecer en las dunas · Merdani · M'Fis · Khamlia · Kasbah Tombouctou",
    "Sunrise in the dunes · Merdani · M'Fis · Khamlia · Kasbah Tombouctou",
    "Lever du soleil dans les dunes · Merdani · M'Fis · Khamlia · Kasbah Tombouctou",
  ),
  body: {
    es: "Recomendamos madrugar para caminar hasta lo más alto de las dunas y contemplar la salida del sol — un espectáculo inolvidable en pleno desierto. Desayuno beduino en el campamento. Regreso al vehículo para rodear el Erg Chebbi y visitar el pueblo abandonado de Merdani. Más tarde, visita a las Minas de M'Fis y al poblado de origen sudanés Khamlia, donde sus habitantes nos recibirán con danzas tradicionales y un reconfortante té a la menta. Llegada a la Kasbah Tombouctou y tiempo libre para disfrutar del entorno: paseos por las dunas, caminatas a los pueblos cercanos de Merzouga y Hassi Labyed «Pozoblanco», o el reconfortante ritual del Hammam (opcional). Al atardecer, salida hacia un mirador natural para disfrutar de una bella panorámica del desierto. Cena y alojamiento en Kasbah Tombouctou.",
    en: "We recommend an early walk to the top of the dunes for the sunrise — an unforgettable desert experience. Bedouin breakfast at the camp. Back to the 4x4 to loop around the Erg Chebbi to the abandoned village of Merdani. Later, visit to the M'Fis Mines and to the Sudanese-origin village of Khamlia, where locals welcome us with traditional dances and mint tea. Arrival at Kasbah Tombouctou and free time to enjoy the surroundings: dune walks, walks to nearby Merzouga and Hassi Labyed «Pozoblanco», or the optional traditional Hammam ritual. At dusk, drive to a natural viewpoint for a beautiful desert panorama. Dinner and overnight at Kasbah Tombouctou.",
    fr: "Nous recommandons une marche matinale au sommet des dunes pour le lever du soleil — spectacle inoubliable en plein désert. Petit-déjeuner bédouin au campement. Retour en 4x4 pour contourner l'Erg Chebbi et visiter le village abandonné de Merdani. Plus tard, visite des Mines de M'Fis et du village d'origine soudanaise de Khamlia, où les habitants nous accueillent avec danses traditionnelles et thé à la menthe. Arrivée à la Kasbah Tombouctou et temps libre : balade dans les dunes, marche vers Merzouga et Hassi Labyed « Pozoblanco », ou hammam traditionnel (option). À la tombée du jour, départ vers un mirador naturel pour une belle panoramique du désert. Dîner et nuit à la Kasbah Tombouctou.",
  },
  wellness: [
    { es: "Hammam tradicional", en: "Traditional hammam", fr: "Hammam traditionnel" },
    { es: "Paseo por las dunas", en: "Dune walks", fr: "Balade dans les dunes" },
    { es: "Mirador natural", en: "Natural viewpoint", fr: "Mirador naturel" },
  ],
  culture: [
    {
      title: T("Música Gnawa · Patrimonio UNESCO", "Gnawa music · UNESCO heritage", "Musique Gnawa · patrimoine UNESCO"),
      body: T(
        "La música Gnawa de Khamlia es Patrimonio Cultural Inmaterial UNESCO. Sus ritmos hipnóticos hablan del legado africano del sur marroquí.",
        "Khamlia's Gnawa music is UNESCO Intangible Heritage. Its hypnotic rhythms speak to southern Morocco's African legacy.",
        "La musique Gnawa de Khamlia est Patrimoine Culturel Immatériel UNESCO.",
      ),
    },
  ],
};

export const DAY_FRM_RISSANI_RELAX_ONLY = {
  route_id: "frm-rissani-relax",
  id: "frm-d-rissani-relax",
  image: "https://images.unsplash.com/photo-1597212618440-806262de4f6b?auto=format&fit=crop&w=2000&q=85",
  accent: "#A07042",
  title: T(
    "Rissani · día libre en Kasbah Xaluca",
    "Rissani · free day at Kasbah Xaluca",
    "Rissani · journée libre à la Kasbah Xaluca",
  ),
  body: {
    es: "Salida por pistas hacia Rissani para visitar algunas de sus kasbahs centenarias. Continuación con la visita al mercado tradicional de Rissani, único en la región y punto de abastecimiento para tribus y nómadas del desierto. Destaca su curioso «parking» de burros. Regreso a la Kasbah Xaluca y resto del día libre para disfrutar del hotel: piscina climatizada, jacuzzi, tenis o minigolf, hammam tradicional o masaje (opcional), excursión opcional en quads por las dunas cercanas, visita a kasbahs próximas. Por la tarde, los vehículos con chófer estarán a vuestra disposición para continuar explorando la zona o pasear libremente por Erfoud. Cena y alojamiento en Kasbah Xaluca. Nota: el mercado de Rissani se celebra martes, jueves y domingos; si no coincide con el itinerario, se intentará reubicar la visita.",
    en: "Drive by desert tracks to Rissani to visit some of its centuries-old kasbahs. We continue with a visit to the Rissani traditional market — unique in the region and a supply point for desert tribes and nomads. Its curious «donkey parking» is particularly memorable. Back to Kasbah Xaluca, with the rest of the day free to enjoy the hotel: heated pool, jacuzzi, tennis or mini-golf, optional traditional hammam or massage, optional quad rides in the nearby dunes, visits to surrounding kasbahs. In the afternoon, the 4x4 with driver remains available to keep exploring or stroll around Erfoud. Dinner and overnight at Kasbah Xaluca. Note: Rissani market runs Tuesday, Thursday and Sunday; if it doesn't coincide with the route we'll try to relocate the visit.",
    fr: "Départ par les pistes vers Rissani pour visiter ses kasbahs centenaires. Continuation par le marché traditionnel de Rissani — unique dans la région et point d'approvisionnement des tribus et nomades du désert. Son curieux « parking d'ânes » est particulièrement marquant. Retour à la Kasbah Xaluca et après-midi libre : piscine chauffée, jacuzzi, tennis ou mini-golf, hammam traditionnel ou massage (option), quads en option dans les dunes voisines, visite des kasbahs voisines. Les 4x4 avec chauffeur restent à disposition pour explorer la zone ou flâner dans Erfoud. Dîner et nuit à la Kasbah Xaluca. Note : le marché de Rissani a lieu mardi, jeudi et dimanche.",
  },
  wellness: [
    { es: "Piscina climatizada", en: "Heated pool", fr: "Piscine chauffée" },
    { es: "Jacuzzi", en: "Jacuzzi", fr: "Jacuzzi" },
    { es: "Hammam tradicional", en: "Traditional hammam", fr: "Hammam traditionnel" },
    { es: "Masaje", en: "Massage", fr: "Massage" },
    { es: "Tenis & minigolf", en: "Tennis & minigolf", fr: "Tennis & mini-golf" },
    { es: "Quads opcionales", en: "Optional quads", fr: "Quads en option" },
  ],
  culture: [
    {
      title: T("Rissani · cuna de la dinastía alauita", "Rissani · cradle of the Alaouite dynasty", "Rissani · berceau de la dynastie alaouite"),
      body: T(
        "La antigua Sijilmasa, capital de las rutas transaharianas del oro y la sal, fundó la dinastía que aún reina en Marruecos desde el siglo XVII.",
        "Ancient Sijilmasa, capital of the trans-Saharan gold and salt trade, gave birth to the dynasty still reigning over Morocco since the 17th century.",
        "L'ancienne Sijilmasa, capitale des routes transsahariennes de l'or et du sel, fonda la dynastie qui règne encore au Maroc depuis le XVIIe siècle.",
      ),
    },
  ],
};

/* ============================================================
   Shared price-policy block (excludes / notes / terms)
============================================================ */

export const SHARED_FRM_DETAILS = {
  excludes: {
    es: [
      "Las bebidas",
      "Las comidas a mediodía, excepto las específicamente detalladas en el itinerario",
      "Las cenas no incluidas en «El precio incluye»",
      "Otros extras personales como excursiones en quads, masajes o tratamientos de spa",
      "El vuelo (salvo que se indique lo contrario)",
      "Suplemento para añadir seguro de cancelación · 30 € por persona para viajes de hasta 10 días",
    ],
    en: [
      "Drinks",
      "Lunches, except those specifically listed in the itinerary",
      "Dinners not included in «What's included»",
      "Personal extras (quads, massages, spa treatments…)",
      "Flights (unless otherwise stated)",
      "Optional cancellation insurance · €30 per person for trips of up to 10 days",
    ],
    fr: [
      "Boissons",
      "Déjeuners (sauf ceux indiqués dans l'itinéraire)",
      "Dîners non inclus dans « Ce qui est inclus »",
      "Extras personnels (quads, massages, soins de spa…)",
      "Le vol (sauf mention contraire)",
      "Assurance annulation en option · 30 € par personne pour les voyages jusqu'à 10 jours",
    ],
  },
  notes: {
    es: [
      "Opciones de vuelos: Royal Air Maroc (vía Casablanca) o low-cost como Vueling, Air Arabia, Ryanair.",
      "Las tarifas se calculan según la ocupación del 4x4. El coste se divide entre los ocupantes.",
      "Tarifas basadas en habitaciones dobles y triples. Suplemento individual: consultar según programa.",
      "Descuento niños (3-11 años) compartiendo con dos adultos: consultar según programa.",
      "Si los riads previstos están completos, se proponen alternativas equivalentes (las posibles variaciones de precio se informan previamente).",
      "En temporada alta, los guías de medina pueden compartirse con otros viajeros.",
      "Chóferes hispanohablantes son limitados — reservar con antelación.",
      "Los guías oficiales están reservados exclusivamente para las visitas a las medinas, no para las rutas.",
      "Es obligatorio pasaporte vigente con un mínimo de 3 meses desde la fecha de regreso.",
      "Quads opcionales: 70 € por vehículo (circuito de 1 hora). Spa y masajes en recepción del hotel.",
      "El mercado de Rissani se celebra los martes, jueves y domingos.",
    ],
    en: [
      "Flight options: Royal Air Maroc (via Casablanca) or low-cost (Vueling, Air Arabia, Ryanair).",
      "Rates depend on 4x4 occupancy. Cost is split between passengers.",
      "Rates based on double and triple rooms. Single room supplement: depends on programme.",
      "Children discount (3-11) sharing with two adults: depends on programme.",
      "Equivalent alternative riads will be offered if those budgeted are full (any price variation is communicated beforehand).",
      "In high season, medina guides may be shared with other travellers.",
      "Spanish-speaking drivers are limited — book early.",
      "Official guides are reserved exclusively for medina visits, not for the on-road portions.",
      "Valid passport required with at least 3 months remaining from the return date.",
      "Optional quads: €70 per vehicle (1-hour circuit). Spa & massages at hotel reception.",
      "Rissani market runs Tuesday, Thursday and Sunday.",
    ],
    fr: [
      "Options de vol : Royal Air Maroc (via Casablanca) ou low-cost (Vueling, Air Arabia, Ryanair).",
      "Tarifs selon l'occupation du 4x4. Le coût est partagé entre les occupants.",
      "Tarifs base chambre double et triple. Supplément single : selon programme.",
      "Réduction enfants (3-11 ans) partageant avec 2 adultes : selon programme.",
      "Riads équivalents proposés si complets (variations de prix communiquées en amont).",
      "En haute saison, les guides de médina peuvent être partagés.",
      "Chauffeurs hispanophones limités — réserver tôt.",
      "Les guides officiels sont réservés aux visites des médinas, pas aux trajets.",
      "Passeport valable au minimum 3 mois après le retour.",
      "Quads en option : 70 € par véhicule (1 h). Spa et massages à la réception de l'hôtel.",
      "Marché de Rissani les mardi, jeudi et dimanche.",
    ],
  },
  terms: {
    es: [
      "Reserva: 30% del importe total en el momento de la confirmación.",
      "Pago final: 70% restante hasta 30 días antes de la salida.",
      "Si el vuelo elegido requiere emisión inmediata: 100% del billete + 30% de los servicios de tierra al reservar.",
      "Cancelación 45 días antes de la salida: 30% del importe total.",
      "Cancelación 21 días antes de la salida: 100% del importe total.",
      "Penalización fija de 50 € por reserva en concepto de gastos de gestión.",
      "Estas condiciones aplican sólo a los servicios de tierra. Los vuelos se rigen por las condiciones de cada compañía aérea. Los seguros no se reembolsan.",
    ],
    en: [
      "Booking: 30% at confirmation.",
      "Final payment: 70% balance up to 30 days before departure.",
      "If the chosen flight requires immediate ticketing: 100% of the flight + 30% of land services at booking.",
      "Cancellation 45 days before departure: 30% of the total.",
      "Cancellation 21 days before departure: 100% of the total.",
      "Fixed €50 per booking management fee.",
      "Conditions apply to land services only. Flights follow each airline's rules. Insurances are non-refundable.",
    ],
    fr: [
      "Réservation : 30 % à la confirmation.",
      "Paiement final : solde de 70 % jusqu'à 30 jours avant le départ.",
      "Si le vol exige une émission immédiate : 100 % du billet + 30 % des services terrestres à la réservation.",
      "Annulation 45 jours avant : 30 % du total.",
      "Annulation 21 jours avant : 100 % du total.",
      "Pénalité fixe de 50 € par réservation pour frais de gestion.",
      "Conditions applicables aux services terrestres uniquement. Les vols suivent les règles de chaque compagnie. Les assurances ne sont pas remboursables.",
    ],
  },
};
