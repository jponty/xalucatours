// Tangier → Marrakech · 8 nights / 9 days. The longest north-to-south
// classic crossing: from the Mediterranean and Chefchaouen blue,
// through Volubilis/Meknes/Fez, the Middle Atlas, the Erg Chebbi
// desert, Todra and Dades gorges, Aït Ben Haddou and finally
// Marrakech. Reuses 4 shared southern days from existing modules.

import {
  DAY_03_ERFOUD_ERG_BIVOUAC,
  DAY_06_TODRA_DADES,
  DAY_08_AITBENHADDOU_MARRAKECH,
} from "./fezMarrakech910";
import {
  DAY_04_AMANECER_KHAMLIA_RISSANI_RELAX,
  DAY_07_MARRAKECH_MEDINA_RETURN,
} from "./fezMarrakech67";

const T = (es, en, fr) => ({ es, en, fr });

/* ============================================================
   Program-specific days · North & Middle Atlas
============================================================ */

export const DAY_TRK_TANGER_CHEFCHAOUEN = {
  route_id: "trk89-tanger-chefchaouen",
  id: "trk89-d1",
  image: "https://images.unsplash.com/photo-1570133435536-7ececf000ef6?auto=format&fit=crop&w=2000&q=85",
  accent: "#5A7F9C",
  title: T(
    "Tánger · Cabo Espartel · Grutas de Hércules · Chefchaouen",
    "Tangier · Cape Spartel · Hercules' Caves · Chefchaouen",
    "Tanger · Cap Spartel · Grottes d'Hercule · Chefchaouen",
  ),
  chronologySummary: T(
    "Llegada a Tánger, encuentro del Atlántico y el Mediterráneo en Cabo Espartel, Grutas de Hércules y primera noche en la azul Chefchaouen.",
    "Arrival in Tangier, the Atlantic and Mediterranean meeting at Cape Spartel, Hercules’ Caves and a first night in blue Chefchaouen.",
    "Arrivée à Tanger, rencontre de l’Atlantique et de la Méditerranée au Cap Spartel, Grottes d’Hercule et première nuit à Chefchaouen.",
  ),
  body: {
    es: "Llegada a Tánger y encuentro con el chófer. Visitamos el Cabo Espartel, punto donde el Atlántico se encuentra con el Mediterráneo, y las legendarias Grutas de Hércules con su famosa abertura con forma de mapa de África. Continuación hacia Chefchaouen, «el pueblo azul» del Rif. Visita guiada por la Plaza Uta el-Hammam, la Gran Mezquita, la Kasbah del siglo XVII, la Plaza de Makhzen, la fuente Ras el-Maa, el barrio de los lavaderos y la Plaza de Sebbanin. Cena y alojamiento en riad en la Medina.",
    en: "Arrival in Tangier and meeting with the driver. We visit Cape Spartel — where the Atlantic meets the Mediterranean — and the legendary Hercules' Caves with their famous opening shaped like the map of Africa. We continue to Chefchaouen, the «blue town» of the Rif. Guided tour of Uta el-Hammam Square, the Grand Mosque, the 17th-century Kasbah, Makhzen Square, the Ras el-Maa fountain, the laundry quarter and Sebbanin Square. Dinner and overnight at a Medina riad.",
    fr: "Arrivée à Tanger et rencontre avec le chauffeur. Visite du Cap Spartel — où l'Atlantique rencontre la Méditerranée — et des légendaires Grottes d'Hercule avec leur célèbre ouverture en forme de carte d'Afrique. Continuation vers Chefchaouen, « la ville bleue » du Rif. Visite guidée de la Place Uta el-Hammam, de la Grande Mosquée, de la Kasbah du XVIIe siècle, de la Place du Makhzen, de la fontaine Ras el-Maa, du quartier des lavoirs et de la Place de Sebbanin. Dîner et nuit dans un riad de la médina.",
  },
  culture: [
    {
      title: T("Cabo Espartel · dos océanos", "Cape Spartel · two oceans", "Cap Spartel · deux océans"),
      body: T(
        "Extremo noroeste de África, donde el Atlántico y el Mediterráneo se encuentran. El faro de 1864 sigue activo y marca el paso obligado del estrecho.",
        "The north-western tip of Africa, where the Atlantic and Mediterranean meet. The 1864 lighthouse still operates and marks the mandatory passage through the strait.",
        "Pointe nord-ouest de l'Afrique, où l'Atlantique et la Méditerranée se rencontrent. Le phare de 1864 est encore en activité.",
      ),
    },
    {
      title: T("Chefchaouen · el pueblo azul", "Chefchaouen · the blue town", "Chefchaouen · la ville bleue"),
      body: T(
        "Fundada en 1471 por refugiados andalusíes y judíos sefardíes. La tradición del azul indigo se atribuye a la comunidad judía que pintaba las casas en los años 30 — y se ha conservado desde entonces.",
        "Founded in 1471 by Andalusi and Sephardi refugees. The indigo blue tradition is attributed to the Jewish community that painted the houses in the 1930s — and has been kept since.",
        "Fondée en 1471 par des réfugiés andalous et juifs séfarades. La tradition du bleu indigo est attribuée à la communauté juive qui peignait les maisons dans les années 1930.",
      ),
    },
    {
      title: T("Grutas de Hércules", "Hercules' Caves", "Grottes d'Hercule"),
      body: T(
        "Cuevas marinas que, según el mito, fueron el lugar de descanso del héroe griego antes de su 11º trabajo. Su entrada al mar dibuja el mapa invertido del continente africano.",
        "Sea caves that, according to legend, hosted Hercules's rest before his 11th labour. Their sea opening draws the inverted map of the African continent.",
        "Grottes marines qui, selon le mythe, accueillirent le repos d'Hercule avant son 11e travail. Leur ouverture maritime dessine la carte inversée du continent africain.",
      ),
    },
  ],
};

export const DAY_TRK_VOLUBILIS_MEKNES_FEZ = {
  route_id: "trk89-volubilis-meknes-fez",
  id: "trk89-d2",
  image: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=2000&q=85",
  accent: "#A07042",
  title: T(
    "Chefchaouen · Volubilis · Moulay Idriss · Meknes · Fez",
    "Chefchaouen · Volubilis · Moulay Idriss · Meknes · Fez",
    "Chefchaouen · Volubilis · Moulay Idriss · Meknès · Fès",
  ),
  chronologySummary: T(
    "Ruta por las ruinas romanas de Volubilis, la ciudad santa de Moulay Idriss y la imperial Meknes antes de continuar hasta Fez.",
    "Route through Roman Volubilis, the holy city of Moulay Idriss and imperial Meknes before continuing to Fez.",
    "Route par les ruines romaines de Volubilis, la ville sainte de Moulay Idriss et l’impériale Meknès avant de rejoindre Fès.",
  ),
  body: {
    es: "Salida hacia Meknes haciendo parada en las ruinas romanas de Volubilis — el yacimiento arqueológico más importante de Marruecos, con su Arco de Triunfo, el Capitolio y la famosa Casa de Baco. Pasaremos por Moulay Idriss, la ciudad santa más venerada del país. Llegada a Meknes, antigua capital imperial del sultán Moulay Ismaïl, donde haremos una visita guiada por su medina, la monumental puerta Bab al Mansour, sus murallas y mezquitas. Continuamos hasta Fez. Cena y alojamiento en Riad en la Medina o Hotel 4★.",
    en: "Departure for Meknes with a stop at the Roman ruins of Volubilis — Morocco's most important archaeological site, with its Triumphal Arch, the Capitol and the famous House of Bacchus. We pass through Moulay Idriss, the country's most venerated holy city. Arrival in Meknes, former imperial capital of Sultan Moulay Ismail, where we tour its medina, the monumental Bab al Mansour gate, its ramparts and mosques. We continue to Fez. Dinner and overnight at a Medina riad or 4★ hotel.",
    fr: "Départ vers Meknès avec arrêt aux ruines romaines de Volubilis — le plus important site archéologique du Maroc, avec son Arc de Triomphe, le Capitole et la célèbre Maison de Bacchus. Passage par Moulay Idriss, la ville sainte la plus vénérée du pays. Arrivée à Meknès, ancienne capitale impériale du sultan Moulay Ismaïl, avec visite guidée de sa médina, de la monumentale porte Bab al Mansour, ses remparts et mosquées. Continuation jusqu'à Fès. Dîner et nuit en riad de la médina ou hôtel 4★.",
  },
  culture: [
    {
      title: T("Volubilis · UNESCO desde 1997", "Volubilis · UNESCO since 1997", "Volubilis · UNESCO depuis 1997"),
      body: T(
        "Capital provincial de la Mauretania Tingitana en el siglo I a.C. Sus mosaicos de la Casa de Baco están considerados entre los mejores conservados del Norte de África.",
        "Provincial capital of Mauretania Tingitana in the 1st century BC. The mosaics of the House of Bacchus are considered among the best preserved in North Africa.",
        "Capitale provinciale de la Maurétanie Tingitane au Ier siècle av. J.-C. Les mosaïques de la Maison de Bacchus sont parmi les mieux conservées d'Afrique du Nord.",
      ),
    },
    {
      title: T("Moulay Idriss · ciudad santa", "Moulay Idriss · holy city", "Moulay Idriss · ville sainte"),
      body: T(
        "Lugar de peregrinación más importante de Marruecos, fundado por Moulay Idriss I, bisnieto del Profeta. Cinco peregrinaciones aquí equivalen a una a La Meca.",
        "Morocco's most important pilgrimage site, founded by Moulay Idriss I, great-grandson of the Prophet. Five pilgrimages here equal one to Mecca.",
        "Lieu de pèlerinage le plus important du Maroc, fondé par Moulay Idriss Ier, arrière-petit-fils du Prophète. Cinq pèlerinages ici équivalent à un à La Mecque.",
      ),
    },
    {
      title: T("Meknes · el Versalles marroquí", "Meknes · the Moroccan Versailles", "Meknès · le Versailles marocain"),
      body: T(
        "Capital imperial bajo Moulay Ismaïl (s. XVII), contemporáneo de Luis XIV. La monumental Bab al Mansour es considerada la puerta más bella del norte de África.",
        "Imperial capital under Moulay Ismail (17th century), contemporary of Louis XIV. The monumental Bab al Mansour is considered the most beautiful gate in North Africa.",
        "Capitale impériale sous Moulay Ismaïl (XVIIe siècle), contemporain de Louis XIV. La monumentale Bab al Mansour est considérée comme la plus belle porte d'Afrique du Nord.",
      ),
    },
  ],
};

export const DAY_TRK_FEZ_DISCOVER = {
  route_id: "trk89-fez-discover",
  id: "trk89-d3",
  image: "https://images.unsplash.com/photo-1547234935-80c7145ec969?auto=format&fit=crop&w=2000&q=85",
  accent: "#C16542",
  title: T("Día completo en Fez", "A full day in Fez", "Journée complète à Fès"),
  chronologySummary: T(
    "Jornada guiada por Fez-el Bali entre callejuelas medievales, mezquitas, madrazas, talleres artesanos y las históricas tenerías de Chouara.",
    "Guided day through Fez-el Bali among medieval alleys, mosques, madrasas, artisan workshops and the historic Chouara tanneries.",
    "Journée guidée dans Fès-el Bali entre ruelles médiévales, mosquées, médersas, ateliers d’artisans et tanneries historiques de Chouara.",
  ),
  body: {
    es: "Día dedicado a descubrir Fez-el Bali, la antigua Medina de Fez — una de las más auténticas y mejor conservadas del mundo árabe. Acompañados de guía local, recorreremos sus laberínticas callejuelas medievales descubriendo centros artesanales, mezquitas, palacios, tenerías y miradores panorámicos. Observaremos la vida cotidiana alrededor de mezquitas, fuentes, hornos, baños y escuelas coránicas. Cena y alojamiento en Riad en la Medina o Hotel 4★.",
    en: "A full day discovering Fez-el Bali — Morocco's old medina — one of the most authentic and best-preserved in the Arab world. With a local guide we thread its labyrinthine medieval alleys, discovering artisan workshops, mosques, palaces, tanneries and panoramic viewpoints. We observe daily life around mosques, fountains, ovens, hammams and Quranic schools. Dinner and overnight at a Medina riad or 4★ hotel.",
    fr: "Journée dédiée à Fès-el Bali — la médina ancienne de Fès — l'une des plus authentiques et les mieux conservées du monde arabe. Accompagnés d'un guide local, nous parcourons ses ruelles médiévales labyrinthiques à la découverte d'ateliers d'artisans, mosquées, palais, tanneries et miradors panoramiques. Nous observons la vie quotidienne autour des mosquées, fontaines, fours, hammams et écoles coraniques. Dîner et nuit en riad de la médina ou hôtel 4★.",
  },
  culture: [
    {
      title: T("Fez-el Bali · UNESCO desde 1981", "Fez-el Bali · UNESCO since 1981", "Fès-el Bali · UNESCO depuis 1981"),
      body: T(
        "La medina más grande del mundo libre de tráfico rodado: 9.500 callejuelas, 13.000 edificios históricos y la universidad activa más antigua del mundo, Al Qarawiyyin (859 d.C.).",
        "The largest car-free medina in the world: 9,500 alleys, 13,000 historic buildings and the oldest continuously operating university in the world, Al Qarawiyyin (859 AD).",
        "La plus grande médina au monde sans voitures : 9 500 ruelles, 13 000 bâtiments historiques et la plus ancienne université en activité du monde, Al Qarawiyyin (859 ap. J.-C.).",
      ),
    },
    {
      title: T("Las tenerías de Chouara", "The Chouara tanneries", "Les tanneries de Chouara"),
      body: T(
        "Activas desde el siglo XI con el mismo proceso medieval — tinajas de piedra y tintes naturales (azafrán, índigo, henna, amapola).",
        "Active since the 11th century with the same medieval process — stone vats and natural dyes (saffron, indigo, henna, poppy).",
        "En activité depuis le XIe siècle avec le même procédé médiéval — cuves de pierre et teintures naturelles (safran, indigo, henné, coquelicot).",
      ),
    },
    {
      title: T("El zoco de Fez", "The Fez souk", "Le souk de Fès"),
      body: T(
        "Organizado en gremios por callejuelas: babucheros, joyeros, alfombreros, tintoreros — una estructura comercial medieval que ha sobrevivido intacta mil años.",
        "Organised by guild alleys: babouche makers, jewellers, carpet weavers, dyers — a medieval commercial structure that has survived intact for a thousand years.",
        "Organisé en corporations par ruelles : babouchiers, bijoutiers, tisserands, teinturiers — une structure commerciale médiévale qui a survécu intacte pendant mille ans.",
      ),
    },
  ],
};

export const DAY_TRK_FEZ_ATLAS_ERFOUD = {
  route_id: "trk89-fez-atlas-erfoud",
  id: "trk89-d4",
  image: "https://images.unsplash.com/photo-1542401886-65d6c61db217?auto=format&fit=crop&w=2000&q=85",
  accent: "#7C8B5C",
  title: T(
    "Fez · Medio Atlas · cedros · Valle del Ziz · Erfoud",
    "Fez · Middle Atlas · cedars · Ziz Valley · Erfoud",
    "Fès · Moyen Atlas · cèdres · Vallée du Ziz · Erfoud",
  ),
  chronologySummary: T(
    "Cruce del Medio Atlas por Ifrane y los bosques de cedros, descenso entre los palmerales del valle del Ziz y llegada a Erfoud.",
    "Cross the Middle Atlas through Ifrane and cedar forests, descend among the Ziz Valley palm groves and arrive in Erfoud.",
    "Traversée du Moyen Atlas par Ifrane et les forêts de cèdres, descente entre les palmeraies de la vallée du Ziz et arrivée à Erfoud.",
  ),
  body: {
    es: "Por la mañana salida en vehículo 4x4 con chófer en dirección sur para cruzar el Medio Atlas hasta Ifrane, conocida como «la pequeña Suiza». Continuaremos atravesando los Bosques de Cedros Gigantes — con suerte, podremos alimentar a la colonia de monos magot que habita en lo alto de la montaña. La ruta sigue por el Valle del Ziz, hogar de más de diez millones de palmeras, hasta llegar a Erfoud, «la Puerta del Desierto». Cena y alojamiento en Kasbah Hotel Xaluca, un establecimiento único en Marruecos.",
    en: "Morning departure in a 4x4 with driver heading south across the Middle Atlas to Ifrane, known as «little Switzerland». We continue through the Giant Cedar Forests — with luck we may feed the colony of Barbary macaques living in the highlands. The route follows the Ziz Valley, home to more than ten million palm trees, to Erfoud, «the Gate of the Desert». Dinner and overnight at Kasbah Hotel Xaluca, a property unique in Morocco.",
    fr: "Le matin, départ en 4x4 avec chauffeur vers le sud pour traverser le Moyen Atlas jusqu'à Ifrane, surnommée « la petite Suisse ». Continuation à travers les Forêts de Cèdres Géants — avec un peu de chance, nous nourrirons la colonie de macaques de Barbarie qui habite la montagne. La route suit la Vallée du Ziz, peuplée de plus de dix millions de palmiers, jusqu'à Erfoud, « la Porte du Désert ». Dîner et nuit à la Kasbah Hôtel Xaluca, un établissement unique au Maroc.",
  },
};

/* ============================================================
   Program · 8 nights / 9 days · Tangier → Marrakech
============================================================ */

export const PROGRAM_TRK_89 = {
  routeId: "tourTangerRak89",
  duration_key: "trk8n9d",
  duration: T("8 noches / 9 días", "8 nights / 9 days", "8 nuits / 9 jours"),
  prices: { low: 2090, mid: 2390, high: 2690, premium: 3090 },
  route: [
    { day: 1, lat: 35.1689, lng: -5.2636, type: "city",    name: T("Chefchaouen", "Chefchaouen", "Chefchaouen") },
    { day: 2, lat: 34.0651, lng: -4.9760, type: "city",    name: T("Volubilis · Meknes · Fez", "Volubilis · Meknes · Fez", "Volubilis · Meknès · Fès") },
    { day: 3, lat: 34.0651, lng: -4.9760, type: "city",    name: T("Fez · Medina UNESCO", "Fez · UNESCO Medina", "Fès · Médina UNESCO") },
    { day: 4, lat: 31.4373, lng: -4.2330, type: "city",    name: T("Erfoud · Kasbah Xaluca", "Erfoud · Kasbah Xaluca", "Erfoud · Kasbah Xaluca") },
    { day: 5, lat: 31.1257, lng: -3.9789, type: "desert",  name: T("Erg Chebbi · Bivouac", "Erg Chebbi · Bivouac", "Erg Chebbi · Bivouac") },
    { day: 6, lat: 31.2828, lng: -4.2683, type: "market",  name: T("Rissani · Kasbah Xaluca", "Rissani · Kasbah Xaluca", "Rissani · Kasbah Xaluca") },
    { day: 7, lat: 31.3582, lng: -5.9911, type: "gorge",   name: T("Boumalne Dadès · Todra", "Boumalne Dades · Todra", "Boumalne Dadès · Todra") },
    { day: 8, lat: 31.0470, lng: -7.1294, type: "unesco",  name: T("Aït Ben Haddou · Marrakech", "Aït Ben Haddou · Marrakech", "Aït Ben Haddou · Marrakech") },
    { day: 9, lat: 31.6295, lng: -7.9811, type: "city",    name: T("Marrakech · Medina", "Marrakech · Medina", "Marrakech · Médina") },
  ],
  days: [
    DAY_TRK_TANGER_CHEFCHAOUEN,
    DAY_TRK_VOLUBILIS_MEKNES_FEZ,
    DAY_TRK_FEZ_DISCOVER,
    DAY_TRK_FEZ_ATLAS_ERFOUD,
    DAY_03_ERFOUD_ERG_BIVOUAC,
    DAY_04_AMANECER_KHAMLIA_RISSANI_RELAX,
    DAY_06_TODRA_DADES,
    DAY_08_AITBENHADDOU_MARRAKECH,
    DAY_07_MARRAKECH_MEDINA_RETURN,
  ],
  details: {
    includes: {
      es: [
        "Una noche en Chefchaouen en Riad en la Medina en Media Pensión",
        "Dos noches en Fez en Riad en la Medina o Hotel 4★ en Media Pensión",
        "Dos noches en Erfoud en Kasbah Hotel Xaluca en Media Pensión",
        "Una noche en Erg Chebbi en Bivouac de Luxe en el desierto en Media Pensión",
        "Una noche en Boumalne Dades en Hotel Xaluca Dadès en Media Pensión",
        "Una noche en Marrakech en Riad en la Medina o Hotel 5★ en Alojamiento y Desayuno",
        "Comida tipo picnic en el desierto",
        "Excursión en dromedario por el Erg Chebbi",
        "Vehículo 4x4 con chófer del día 1 al día 8 del itinerario",
        "Visita guiada a las Grutas de Hércules y Cabo Espartel",
        "Visita con guías locales en Chefchaouen, Meknes, Fez y Marrakech",
        "Entrada a las ruinas romanas de Volubilis",
        "Entrada al Palacio de la Bahía y la Madraza",
        "Visita a la Kasbah de Aït Ben Haddou",
        "Transfers desde y hacia aeropuertos · Combustible · Seguro de asistencia en viaje",
      ],
      en: [
        "One night in Chefchaouen at a Medina riad · half board",
        "Two nights in Fez at a Medina riad or 4★ hotel · half board",
        "Two nights in Erfoud at Kasbah Hotel Xaluca · half board",
        "One night at the Bivouac de Luxe in the Erg Chebbi · half board",
        "One night in Boumalne Dades at Hotel Xaluca Dades · half board",
        "One night in Marrakech at a Medina riad or 5★ hotel · bed & breakfast",
        "Picnic lunch in the desert",
        "Camel ride in the Erg Chebbi",
        "4x4 with driver from day 1 to day 8",
        "Guided visit to the Hercules' Caves and Cape Spartel",
        "Local guided tours in Chefchaouen, Meknes, Fez and Marrakech",
        "Entrance to the Roman ruins of Volubilis",
        "Entrance to the Bahia Palace and the Madrasa",
        "Visit to the Aït Ben Haddou Kasbah",
        "Airport transfers · Fuel · Travel assistance insurance",
      ],
      fr: [
        "Une nuit à Chefchaouen en riad de la médina · demi-pension",
        "Deux nuits à Fès en riad de la médina ou hôtel 4★ · demi-pension",
        "Deux nuits à Erfoud à la Kasbah Hôtel Xaluca · demi-pension",
        "Une nuit au Bivouac de Luxe dans l'Erg Chebbi · demi-pension",
        "Une nuit à Boumalne Dadès à l'Hôtel Xaluca Dadès · demi-pension",
        "Une nuit à Marrakech en riad de la médina ou hôtel 5★ · petit-déjeuner",
        "Pique-nique au désert",
        "Balade à dromadaire dans l'Erg Chebbi",
        "4x4 avec chauffeur du jour 1 au jour 8",
        "Visite guidée des Grottes d'Hercule et du Cap Spartel",
        "Guides locaux à Chefchaouen, Meknès, Fès et Marrakech",
        "Entrée aux ruines romaines de Volubilis",
        "Entrée au Palais de la Bahia et à la Médersa",
        "Visite de la Kasbah d'Aït Ben Haddou",
        "Transferts aéroports · Carburant · Assistance voyage",
      ],
    },
    excludes: {
      es: [
        "Las bebidas",
        "Las comidas a mediodía no especificadas",
        "Las cenas en Marrakech",
        "Otros extras personales (quads, masajes, tratamientos de spa…)",
        "El vuelo (salvo que se indique lo contrario)",
        "Suplemento opcional para seguro de cancelación · 45 € por persona para viajes de hasta 9 días",
      ],
      en: [
        "Drinks",
        "Lunches not specified",
        "Dinners in Marrakech",
        "Personal extras (quads, massages, spa treatments…)",
        "Flights (unless otherwise stated)",
        "Optional cancellation insurance · €45 per person for trips up to 9 days",
      ],
      fr: [
        "Boissons",
        "Déjeuners non spécifiés",
        "Dîners à Marrakech",
        "Extras personnels (quads, massages, spa…)",
        "Le vol (sauf mention contraire)",
        "Assurance annulation en option · 45 € par personne pour les voyages jusqu'à 9 jours",
      ],
    },
    notes: {
      es: [
        "Opciones de vuelos: Royal Air Maroc, Vueling, Air Arabia, Ryanair.",
        "Las tarifas se calculan según la ocupación del 4x4. El coste se divide entre los ocupantes.",
        "Tarifas basadas en habitaciones dobles/triples. Suplemento individual: 405 €.",
        "Descuento niños (3-11 años) compartiendo con dos adultos: 360 € temporada baja · 375 € temporada alta.",
        "En temporada alta, los guías de medina pueden compartirse con otros viajeros.",
        "Chóferes hispanohablantes son limitados — reservar con antelación.",
        "Los guías oficiales están reservados exclusivamente para las visitas a las medinas, no para las rutas.",
        "Es obligatorio pasaporte vigente con un mínimo de 6 meses desde la fecha de regreso.",
        "Actividades opcionales: Quads 90 € por vehículo (2 horas).",
      ],
      en: [
        "Flight options: Royal Air Maroc, Vueling, Air Arabia, Ryanair.",
        "Rates depend on 4x4 occupancy. Cost is split between passengers.",
        "Rates based on double/triple rooms. Single room supplement: €405.",
        "Children discount (3-11) sharing with two adults: €360 low season · €375 high season.",
        "In high season medina guides may be shared with other travellers.",
        "Spanish-speaking drivers are limited — book early.",
        "Official guides are reserved exclusively for medina visits, not for the on-road portions.",
        "Valid passport required with at least 6 months remaining from the return date.",
        "Optional activities: Quads €90 per vehicle (2-hour circuit).",
      ],
      fr: [
        "Options de vols : Royal Air Maroc, Vueling, Air Arabia, Ryanair.",
        "Tarifs selon l'occupation du 4x4. Le coût est partagé entre les occupants.",
        "Tarifs base chambre double/triple. Supplément single : 405 €.",
        "Remise enfants (3-11 ans) partageant avec 2 adultes : 360 € basse · 375 € haute.",
        "En haute saison, les guides de médina peuvent être partagés.",
        "Chauffeurs hispanophones limités — réserver tôt.",
        "Les guides officiels sont réservés aux visites des médinas, pas aux trajets.",
        "Passeport valable au minimum 6 mois après la date de retour.",
        "Activités en option : Quads 90 € par véhicule (2 h).",
      ],
    },
    terms: {
      es: [
        "Ficha de inscripción obligatoria. Pago por transferencia o Visa.",
        "Reserva: 30% del importe total al confirmar.",
        "Pago final: 70% restante hasta 30 días antes de la salida.",
        "Si el vuelo elegido requiere emisión inmediata: 100% del importe de vuelos + 30% de los servicios de tierra al reservar.",
        "Cancelación 45 días antes de la salida: 30% del importe total.",
        "Cancelación 21 días antes de la salida: 100% del importe total.",
        "Penalización fija de 50 € por reserva en concepto de gastos de gestión.",
        "Los vuelos y el seguro de cancelación no son reembolsables.",
      ],
      en: [
        "Compulsory booking form. Payment by bank transfer or Visa.",
        "Booking: 30% of the total at confirmation.",
        "Final payment: 70% balance up to 30 days before departure.",
        "If the chosen flight requires immediate ticketing: 100% of the flight + 30% of land services at booking.",
        "Cancellation 45 days before departure: 30% of the total.",
        "Cancellation 21 days before departure: 100% of the total.",
        "Fixed €50 per booking management fee.",
        "Flights and cancellation insurance are non-refundable.",
      ],
      fr: [
        "Fiche d'inscription obligatoire. Paiement par virement bancaire ou Visa.",
        "Réservation : 30 % du total à la confirmation.",
        "Paiement final : solde de 70 % jusqu'à 30 jours avant le départ.",
        "Si le vol exige une émission immédiate : 100 % du vol + 30 % des services terrestres à la réservation.",
        "Annulation 45 jours avant : 30 % du total.",
        "Annulation 21 jours avant : 100 % du total.",
        "Pénalité fixe de 50 € par réservation pour frais de gestion.",
        "Les vols et l'assurance annulation ne sont pas remboursables.",
      ],
    },
  },
};

export default PROGRAM_TRK_89;
