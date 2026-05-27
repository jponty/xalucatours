// Fez → Marrakech · 6 nights / 7 days — condensed version of the 9n10d
// route. Reuses 4 shared days from `fezMarrakech910.js` and adds 3
// program-specific composite days (Fez+Atlas+Ziz+Erfoud in a single
// drive, sunrise+Khamlia+Rissani+relax in a single day, and the
// Marrakech medina + return on the final day).

import {
  DAY_01_ARRIVAL_FEZ,
  DAY_03_ERFOUD_ERG_BIVOUAC,
  DAY_06_TODRA_DADES,
  DAY_08_AITBENHADDOU_MARRAKECH,
} from "./fezMarrakech910";

const T = (es, en, fr) => ({ es, en, fr });

/* ============================================================
   Program-specific days
============================================================ */

export const DAY_02_FEZ_IFRANE_ZIZ_ERFOUD = {
  route_id: "frz67-fez-ifrane-ziz-erfoud",
  id: "frz67-d2",
  image: "https://images.unsplash.com/photo-1547234935-80c7145ec969?auto=format&fit=crop&w=2000&q=85",
  accent: "#7C8B5C",
  title: T(
    "Fez · Ifrane · Cedros · Valle del Ziz · Erfoud",
    "Fez · Ifrane · Cedars · Ziz Valley · Erfoud",
    "Fès · Ifrane · Cèdres · Vallée du Ziz · Erfoud",
  ),
  body: {
    es: "Por la mañana, visita a pie con guía local por la antigua Medina de Fez — una de las más auténticas y mejor conservadas del mundo árabe. Recorreremos sus laberínticas callejuelas medievales, donde, entre el bullicio de sus gentes, descubriremos centros artesanales, mezquitas y palacios. A primera hora de la tarde, salida en vehículo 4x4 con chófer en dirección sur para cruzar el Medio Atlas hasta llegar a Ifrane, conocida como «la pequeña Suiza» por su sorprendente parecido con ese país. Continuaremos atravesando los Bosques de Cedros Gigantes — si tenemos suerte, podremos alimentar a una colonia de monos salvajes que habita en lo alto de la montaña. Seguiremos la ruta pasando por el Valle del Ziz, hogar de más de diez millones de palmeras, hasta llegar a Erfoud, «la Puerta del Desierto». Cena y alojamiento en Kasbah Hotel Xaluca, un establecimiento único en Marruecos.",
    en: "In the morning, guided walking tour of the Fez Medina — one of the most authentic and best-preserved in the Arab world. We thread its labyrinthine medieval alleys, discovering artisan workshops, mosques and palaces amid the bustle of its people. Early afternoon, departure in a 4x4 with driver heading south across the Middle Atlas to Ifrane, known as «little Switzerland» for its striking resemblance to that country. We continue through the Giant Cedar Forests — with a bit of luck we may feed the colony of wild macaques that lives in the highlands. The route follows the Ziz Valley, home to more than ten million palm trees, to Erfoud, «the Gate of the Desert». Dinner and overnight at Kasbah Hotel Xaluca, a property unique in Morocco.",
    fr: "Le matin, visite guidée à pied de la médina de Fès — l'une des plus authentiques et les mieux conservées du monde arabe. Nous parcourons ses ruelles médiévales labyrinthiques, à la découverte des ateliers d'artisans, mosquées et palais, dans l'effervescence de ses habitants. En début d'après-midi, départ en 4x4 avec chauffeur vers le sud pour traverser le Moyen Atlas jusqu'à Ifrane, surnommée « la petite Suisse » pour sa ressemblance avec ce pays. Continuation à travers les Forêts de Cèdres Géants — avec un peu de chance, nous nourrirons la colonie de macaques sauvages qui habite la montagne. Poursuite par la Vallée du Ziz, où poussent plus de dix millions de palmiers, jusqu'à Erfoud, « la Porte du Désert ». Dîner et nuit à la Kasbah Hôtel Xaluca, un établissement unique au Maroc.",
  },
  culture: [
    {
      title: T("Ifrane · la pequeña Suiza marroquí", "Ifrane · the Moroccan little Switzerland", "Ifrane · la petite Suisse marocaine"),
      body: T(
        "Construida por los franceses en los años 30 a 1.665 m de altitud, sorprende con sus tejados a dos aguas, sus calles arboladas y su nieve invernal. Sede de la prestigiosa universidad Al Akhawayn.",
        "Built by the French in the 1930s at 1,665 m altitude, it surprises with its pitched roofs, tree-lined streets and winter snow. Home to the prestigious Al Akhawayn University.",
        "Construite par les Français dans les années 1930 à 1 665 m d'altitude, elle surprend par ses toits à deux pentes, ses rues arborées et sa neige hivernale. Siège de la prestigieuse université Al Akhawayn.",
      ),
    },
    {
      title: T("Cedros del Atlas y monos magot", "Atlas cedars and Barbary macaques", "Cèdres de l'Atlas et macaques de Barbarie"),
      body: T(
        "Los bosques del Medio Atlas son uno de los últimos santuarios del macaco de Berbería (Macaca sylvanus), la única especie de primate que vive de forma silvestre al norte del Sáhara.",
        "The Middle Atlas forests are one of the last sanctuaries of the Barbary macaque (Macaca sylvanus), the only primate species living wild north of the Sahara.",
        "Les forêts du Moyen Atlas constituent l'un des derniers sanctuaires du macaque de Barbarie (Macaca sylvanus), seule espèce de primate vivant à l'état sauvage au nord du Sahara.",
      ),
    },
    {
      title: T("Valle del Ziz · diez millones de palmeras", "Ziz Valley · ten million palms", "Vallée du Ziz · dix millions de palmiers"),
      body: T(
        "El río Ziz, que nace en el Alto Atlas y desemboca en el Sahara argelino, forma el oasis del Tafilalet — cuna histórica de la dinastía alauí.",
        "The Ziz river — born in the High Atlas and ending in the Algerian Sahara — forms the Tafilalet oasis, historic cradle of the Alawi dynasty.",
        "La rivière Ziz — née dans le Haut Atlas et se perdant dans le Sahara algérien — forme l'oasis du Tafilalet, berceau historique de la dynastie alaouite.",
      ),
    },
  ],
};

export const DAY_04_AMANECER_KHAMLIA_RISSANI_RELAX = {
  route_id: "frz67-amanecer-khamlia-rissani",
  id: "frz67-d4",
  image: "https://images.unsplash.com/photo-1570133435536-7ececf000ef6?auto=format&fit=crop&w=2000&q=85",
  accent: "#A07042",
  title: T(
    "Amanecer en el desierto · Khamlia · Rissani · relax en la Kasbah",
    "Sunrise · Khamlia · Rissani · relax at the Kasbah",
    "Lever du soleil · Khamlia · Rissani · détente à la Kasbah",
  ),
  body: {
    es: "«Cita con el Amanecer»: recomendable madrugar para caminar hasta lo alto de las dunas y disfrutar de la salida del sol, una experiencia mágica. Después, desayuno beduino en el campamento. Salida en vehículo 4x4 para rodear el Erg hasta llegar al pueblo abandonado de Merdani. Continuaremos hacia el poblado de origen sudanés Khamlia, donde sus habitantes nos recibirán con danzas tradicionales y un té a la menta. Más tarde, nos dirigiremos a Rissani para visitar su mercado tradicional, uno de los más auténticos de la región — curiosamente con un «parking de burros» donde aparcan los nómadas. Finalizaremos la mañana subiendo a un mirador natural desde donde nos despediremos del desierto. Tarde libre en Kasbah Xaluca: piscina climatizada, jacuzzi, tenis, minigolf. Opcionalmente, hammam, masaje o excursión en quads por las dunas. Cena y alojamiento en Kasbah Xaluca. Nota: el mercado de Rissani se celebra los martes, jueves y domingos.",
    en: "«A date with the sunrise»: an early climb to the top of the dunes for the sunrise — a magical experience. Bedouin breakfast at the camp. We then drive around the Erg to the abandoned village of Merdani. We continue to Khamlia, a village of Sudanese origin, where its inhabitants welcome us with traditional dances and mint tea. Later, we head to Rissani's traditional market — one of the most authentic in the region, with its curious «donkey parking» where the nomads tie up their animals. We end the morning by climbing to a natural viewpoint for a farewell to the desert. Free afternoon at Kasbah Xaluca: heated pool, jacuzzi, tennis, mini-golf. Optional hammam, massage or quad ride in the dunes. Dinner and overnight at Kasbah Xaluca. Note: the Rissani market runs on Tuesdays, Thursdays and Sundays.",
    fr: "« Rendez-vous avec l'aube » : montée matinale au sommet des dunes pour le lever du soleil — une expérience magique. Petit-déjeuner bédouin au campement. Départ en 4x4 pour contourner l'Erg jusqu'au village abandonné de Merdani. Poursuite vers Khamlia, village d'origine soudanaise, dont les habitants nous accueillent avec danses traditionnelles et thé à la menthe. Plus tard, marché traditionnel de Rissani — l'un des plus authentiques de la région, avec son curieux « parking d'ânes ». Fin de matinée au sommet d'un mirador naturel pour faire ses adieux au désert. Après-midi libre à la Kasbah Xaluca : piscine chauffée, jacuzzi, tennis, mini-golf. En option : hammam, massage ou balade en quads dans les dunes. Dîner et nuit à la Kasbah Xaluca. Note : le marché de Rissani a lieu mardi, jeudi et dimanche.",
  },
  wellness: [
    { es: "Piscina climatizada", en: "Heated pool", fr: "Piscine chauffée" },
    { es: "Hammam & Jacuzzi", en: "Hammam & jacuzzi", fr: "Hammam & jacuzzi" },
    { es: "Masajes (opcional)", en: "Massages (optional)", fr: "Massages (option)" },
    { es: "Quads (opcional)", en: "Quads (optional)", fr: "Quads (option)" },
    { es: "Tenis & minigolf", en: "Tennis & mini-golf", fr: "Tennis & mini-golf" },
  ],
  culture: [
    {
      title: T("Khamlia · música Gnawa UNESCO", "Khamlia · UNESCO Gnawa music", "Khamlia · musique Gnawa UNESCO"),
      body: T(
        "Fundado por comunidades de origen sudanés, el pueblo es reconocido por su música Gnawa, Patrimonio Cultural Inmaterial UNESCO desde 2019.",
        "Founded by communities of Sudanese origin, the village is known for its Gnawa music — UNESCO Intangible Cultural Heritage since 2019.",
        "Fondé par des communautés d'origine soudanaise, le village est connu pour sa musique Gnawa — Patrimoine Culturel Immatériel UNESCO depuis 2019.",
      ),
    },
    {
      title: T("Rissani · mercado caravanero del Tafilalet", "Rissani · Tafilalet caravan market", "Rissani · marché caravanier du Tafilalet"),
      body: T(
        "Zoco activo desde el siglo XIV, donde aún se abastecen las tribus Aït Atta y los nómadas del desierto. Su «parking de burros» es uno de los rincones más fotografiados.",
        "Souk active since the 14th century, where Aït Atta tribes and desert nomads still stock up today. Its «donkey parking» is one of the most photographed quirks.",
        "Souk en activité depuis le XIVe siècle, où s'approvisionnent encore les tribus Aït Atta et les nomades du désert. Son « parking d'ânes » est l'une des particularités les plus photographiées.",
      ),
    },
    {
      title: T("Merdani · pueblo abandonado", "Merdani · abandoned village", "Merdani · village abandonné"),
      body: T(
        "Antigua aldea minera del manganeso, hoy un cementerio mineral en mitad del Erg que recuerda las extracciones del Protectorado francés.",
        "An old manganese mining hamlet, today a mineral cemetery in the middle of the Erg recalling the French Protectorate extractions.",
        "Ancien village minier de manganèse, aujourd'hui un cimetière minéral au milieu de l'Erg.",
      ),
    },
  ],
};

export const DAY_07_MARRAKECH_MEDINA_RETURN = {
  route_id: "frz67-marrakech-medina-return",
  id: "frz67-d7",
  image: "https://images.unsplash.com/photo-1551918120-9739cb430c6d?auto=format&fit=crop&w=2000&q=85",
  accent: "#C16542",
  title: T(
    "Marrakech · Koutoubia · Palacio Bahía · zocos · regreso",
    "Marrakech · Koutoubia · Bahia Palace · souks · return",
    "Marrakech · Koutoubia · Palais Bahia · souks · retour",
  ),
  body: {
    es: "Por la mañana, visita guiada a pie por la Medina de Marrakech con un guía local. Comenzaremos admirando el Alminar de la Koutoubia, considerado la «hermana gemela» de la Giralda de Sevilla. Visitaremos el Palacio de la Bahía, uno de los mejores ejemplos de la arquitectura marroquí. Nos adentraremos en las estrechas callejuelas del Zoco, donde veremos a los artesanos en plena actividad: tejedores de alfombras, fabricantes de babuchas y una infinita variedad de artesanía tradicional. Pasaremos también por una farmacia bereber, donde nos desvelarán algunos de sus remedios y secretos naturales. Tarde libre para explorar la Medina a nuestro ritmo, poner en práctica el arte del regateo o disfrutar de un último té en alguna terraza panorámica. A la hora convenida, traslado al aeropuerto de Marrakech para tomar el vuelo de regreso.",
    en: "In the morning, guided walking tour of the Marrakech Medina with a local guide. We start admiring the Koutoubia minaret — considered the «twin sister» of Seville's Giralda. We visit the Bahia Palace, one of the finest examples of Moroccan architecture. We enter the narrow alleys of the souk to see artisans at work: carpet weavers, babouche makers and an endless variety of quality traditional crafts. We also stop at a Berber pharmacy and its herbal «secrets». Free afternoon to explore the medina at your own pace, master the art of haggling or enjoy a last mint tea on a panoramic terrace. At the agreed time, transfer to Marrakech airport for the return flight.",
    fr: "Le matin, visite guidée à pied de la Médina de Marrakech avec un guide local. Nous commençons par admirer le minaret de la Koutoubia — sœur jumelle de la Giralda de Séville. Visite du Palais de la Bahia, l'un des plus beaux exemples de l'architecture marocaine. Plongée dans les ruelles du souk pour voir les artisans à l'œuvre : tisserands de tapis, babouchiers et une infinité d'artisanat traditionnel. Halte dans une pharmacie berbère et ses « secrets » à base de plantes. Après-midi libre pour explorer la médina à votre rythme, pratiquer l'art du marchandage ou savourer un dernier thé sur une terrasse panoramique. À l'heure convenue, transfert à l'aéroport de Marrakech pour le vol retour.",
  },
  culture: [
    {
      title: T("Koutoubia · hermana gemela de la Giralda", "Koutoubia · twin of the Giralda", "Koutoubia · sœur jumelle de la Giralda"),
      body: T(
        "El alminar de 77 m fue construido por los almohades en el siglo XII, junto con la Giralda de Sevilla y la Torre Hassan de Rabat — por el mismo arquitecto.",
        "The 77 m minaret was built by the Almohads in the 12th century alongside Seville's Giralda and Rabat's Hassan Tower — by the same architect.",
        "Le minaret de 77 m fut construit par les Almohades au XIIe siècle, avec la Giralda et la Tour Hassan, par le même architecte.",
      ),
    },
    {
      title: T("Palacio de la Bahía · 8.000 m² de poesía", "Bahia Palace · 8,000 m² of poetry", "Palais de la Bahia · 8 000 m² de poésie"),
      body: T(
        "Construido en el siglo XIX para el Gran Visir Ba Ahmed. Sus patios de mármol, zellige y techos de cedro tallado son uno de los puntos cumbre de la arquitectura marroquí.",
        "Built in the 19th century for Grand Vizier Ba Ahmed. Its marble courtyards, zellige tilework and carved cedar ceilings are a high point of Moroccan architecture.",
        "Construit au XIXe siècle pour le Grand Vizir Ba Ahmed. Ses cours de marbre, son zellige et ses plafonds de cèdre sculpté sont l'un des sommets de l'architecture marocaine.",
      ),
    },
    {
      title: T("Los zocos de Marrakech", "The souks of Marrakech", "Les souks de Marrakech"),
      body: T(
        "Uno de los mercados artesanales más extensos del norte de África, dividido en sectores especializados — tintoreros, herreros, joyeros, babucheros, tejedores — manteniendo viva la tradición de oficios medievales.",
        "One of North Africa's largest artisan markets, divided into specialised quarters — dyers, blacksmiths, jewellers, babouche makers, weavers — keeping medieval crafts alive.",
        "L'un des plus vastes marchés artisanaux d'Afrique du Nord, divisé en quartiers spécialisés — teinturiers, forgerons, bijoutiers, babouchiers, tisserands.",
      ),
    },
  ],
};

/* ============================================================
   Program · 6 nights / 7 days · Fez → Marrakech
============================================================ */

export const PROGRAM_FRZ_67 = {
  routeId: "tourFezRak67",
  duration_key: "frz6n7d",
  duration: T("6 noches / 7 días", "6 nights / 7 days", "6 nuits / 7 jours"),
  prices: { low: 1690, mid: 1990, high: 2290, premium: 2690 },
  route: [
    { day: 1, lat: 34.0651, lng: -4.9760, type: "city",   name: T("Fez · Llegada", "Fez · Arrival", "Fès · Arrivée") },
    { day: 2, lat: 31.4373, lng: -4.2330, type: "city",   name: T("Erfoud · Kasbah Xaluca", "Erfoud · Kasbah Xaluca", "Erfoud · Kasbah Xaluca") },
    { day: 3, lat: 31.1257, lng: -3.9789, type: "desert", name: T("Erg Chebbi · Bivouac", "Erg Chebbi · Bivouac", "Erg Chebbi · Bivouac") },
    { day: 4, lat: 31.2828, lng: -4.2683, type: "market", name: T("Rissani · Kasbah Xaluca", "Rissani · Kasbah Xaluca", "Rissani · Kasbah Xaluca") },
    { day: 5, lat: 31.3582, lng: -5.9911, type: "gorge",  name: T("Boumalne Dadès · Todra", "Boumalne Dades · Todra", "Boumalne Dadès · Todra") },
    { day: 6, lat: 31.0470, lng: -7.1294, type: "unesco", name: T("Aït Ben Haddou · Marrakech", "Aït Ben Haddou · Marrakech", "Aït Ben Haddou · Marrakech") },
    { day: 7, lat: 31.6295, lng: -7.9811, type: "city",   name: T("Marrakech · Medina", "Marrakech · Medina", "Marrakech · Médina") },
  ],
  days: [
    DAY_01_ARRIVAL_FEZ,
    DAY_02_FEZ_IFRANE_ZIZ_ERFOUD,
    DAY_03_ERFOUD_ERG_BIVOUAC,
    DAY_04_AMANECER_KHAMLIA_RISSANI_RELAX,
    DAY_06_TODRA_DADES,
    DAY_08_AITBENHADDOU_MARRAKECH,
    DAY_07_MARRAKECH_MEDINA_RETURN,
  ],
  details: {
    includes: {
      es: [
        "Una noche en Fez en Riad en la Medina o Hotel 4★ en Media Pensión",
        "Dos noches en Erfoud en Kasbah Hotel Xaluca en Media Pensión",
        "Una noche en Erg Chebbi en Bivouac de Luxe en el desierto en Media Pensión",
        "Una noche en Boumalne Dades en Hotel Xaluca Dadès en Media Pensión",
        "Una noche en Marrakech en Riad en la Medina o Hotel 5★ en Alojamiento y Desayuno",
        "Comida tipo picnic en el desierto",
        "Excursión en dromedario por el Erg Chebbi",
        "Vehículo 4x4 con chófer desde el día 2 hasta el día 6 del itinerario, ambos incluidos",
        "Visita con guía local en Fez · Visita con guía local en Marrakech",
        "Visitas a Aït Ben Haddou y Palacio de la Bahía",
        "Transfers desde y hacia aeropuertos · Combustible · Seguro de asistencia en viaje",
      ],
      en: [
        "One night in Fez in a Medina riad or 4★ hotel · half board",
        "Two nights in Erfoud at Kasbah Hotel Xaluca · half board",
        "One night at the Bivouac de Luxe in the Erg Chebbi · half board",
        "One night in Boumalne Dades at Hotel Xaluca Dades · half board",
        "One night in Marrakech in a Medina riad or 5★ hotel · bed & breakfast",
        "Picnic lunch in the desert",
        "Camel ride in the Erg Chebbi",
        "4x4 with driver from day 2 to day 6 inclusive",
        "Local guided tour in Fez · Local guided tour in Marrakech",
        "Visits to Aït Ben Haddou and the Bahia Palace",
        "Airport transfers · Fuel · Travel assistance insurance",
      ],
      fr: [
        "Une nuit à Fès en riad de la médina ou hôtel 4★ · demi-pension",
        "Deux nuits à Erfoud à la Kasbah Hôtel Xaluca · demi-pension",
        "Une nuit au Bivouac de Luxe dans l'Erg Chebbi · demi-pension",
        "Une nuit à Boumalne Dadès à l'Hôtel Xaluca Dadès · demi-pension",
        "Une nuit à Marrakech en riad de la médina ou hôtel 5★ · petit-déjeuner",
        "Pique-nique le midi au désert",
        "Balade à dromadaire dans l'Erg Chebbi",
        "4x4 avec chauffeur du jour 2 au jour 6 inclus",
        "Guide local à Fès et à Marrakech",
        "Visites d'Aït Ben Haddou et du Palais de la Bahia",
        "Transferts aéroports · Carburant · Assistance voyage",
      ],
    },
    excludes: {
      es: [
        "Las bebidas",
        "Las comidas a mediodía (excepto el picnic en el desierto)",
        "Las cenas no incluidas en el paquete",
        "Otros extras personales (quads, masajes, tratamientos de spa…)",
        "El vuelo (salvo que se indique lo contrario)",
        "Suplemento opcional para seguro de cancelación · 45 € por persona para viajes de hasta 9 días",
      ],
      en: [
        "Drinks",
        "Lunches (except the desert picnic)",
        "Dinners not included in the package",
        "Personal extras (quads, massages, spa treatments…)",
        "Flights (unless otherwise stated)",
        "Optional cancellation insurance · €45 per person for trips up to 9 days",
      ],
      fr: [
        "Boissons",
        "Déjeuners (sauf le pique-nique au désert)",
        "Dîners non inclus dans le forfait",
        "Extras personnels (quads, massages, spa…)",
        "Le vol (sauf mention contraire)",
        "Assurance annulation en option · 45 € par personne pour les voyages jusqu'à 9 jours",
      ],
    },
    notes: {
      es: [
        "Opciones de vuelos: Royal Air Maroc (vía Casablanca) o low-cost como Vueling, Air Arabia, Ryanair.",
        "Las tarifas se calculan según la ocupación del 4x4. El coste se divide entre los ocupantes.",
        "Tarifas basadas en habitaciones dobles/triples. Suplemento individual: 375 €.",
        "Descuento niños (3-11 años) compartiendo con dos adultos: consultar.",
        "En temporada alta, los guías de medina pueden compartirse con otros viajeros.",
        "Chóferes hispanohablantes son limitados — reservar con antelación.",
        "Los guías oficiales están reservados exclusivamente para las visitas a las medinas, no para las rutas.",
        "Es obligatorio pasaporte vigente con un mínimo de 3 meses desde la fecha de regreso.",
        "Quads opcionales: 70 € por vehículo (circuito de 1 hora). Spa y masajes en recepción de hotel.",
        "El mercado de Rissani se celebra los martes, jueves y domingos.",
      ],
      en: [
        "Flight options: Royal Air Maroc (via Casablanca) or low-cost (Vueling, Air Arabia, Ryanair).",
        "Rates depend on 4x4 occupancy. Cost is split between passengers.",
        "Rates based on double/triple rooms. Single room supplement: €375.",
        "Children discount (3-11) sharing with two adults: on request.",
        "In high season medina guides may be shared with other travellers.",
        "Spanish-speaking drivers are limited — book early.",
        "Official guides are reserved exclusively for medina visits, not for the on-road portions.",
        "Valid passport required with at least 3 months remaining from the return date.",
        "Optional quads: €70 per vehicle (1-hour circuit). Spa & massages at hotel reception.",
        "Rissani market runs Tuesday, Thursday and Sunday.",
      ],
      fr: [
        "Options de vol : Royal Air Maroc (via Casablanca) ou low-cost (Vueling, Air Arabia, Ryanair).",
        "Tarifs selon l'occupation du 4x4. Le coût est partagé entre les occupants.",
        "Tarifs base chambre double/triple. Supplément single : 375 €.",
        "Réduction enfants (3-11 ans) partageant avec 2 adultes : sur demande.",
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
  },
};

export default PROGRAM_FRZ_67;
