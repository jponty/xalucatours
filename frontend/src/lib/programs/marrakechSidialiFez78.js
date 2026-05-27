// Marrakech → Sidi Ali → Fez · 7 nights / 8 days. Grand South route
// reversing the FZS78 narrative: start in Marrakech, climb the High
// Atlas, dive into the desert and rise back through the Middle Atlas
// via the Aguelmane Sidi Ali lake to Fez.
// Reuses 6 shared days from the FRM family and adds 2 program-specific
// days for the Sidi Ali leg (Erfoud→Sidi Ali, Sidi Ali→Fez+return).

import {
  DAY_FRM_ARRIVAL_LIGHT,
  DAY_FRM_MARRAKECH_MEDINA,
  SHARED_FRM_DETAILS,
} from "@/lib/programs/marrakechFezShared";
import {
  DAY_02_TICHKA_AITBENHADDOU_DADES,
  DAY_03_DADES_TODRA_ERFOUD,
  DAY_04_DESERT_BIVOUAC,
  DAY_05_SUNRISE_KHAMLIA_RISSANI,
} from "@/lib/programs/marrakechFez67";

const T = (es, en, fr) => ({ es, en, fr });

/* ============================================================
   Program-specific days · Marrakech → Sidi Ali → Fez
============================================================ */

export const DAY_MSF_ZIZ_SIDIALI = {
  route_id: "msf78-ziz-sidiali",
  id: "msf78-d7",
  image: "https://images.unsplash.com/photo-1542401886-65d6c61db217?auto=format&fit=crop&w=2000&q=85",
  accent: "#5A6B4F",
  title: T(
    "Erfoud · Valle del Ziz · Midelt · Aguelmane Sidi Ali",
    "Erfoud · Ziz Valley · Midelt · Aguelmane Sidi Ali",
    "Erfoud · Vallée du Ziz · Midelt · Aguelmane Sidi Ali",
  ),
  body: {
    es: "Salida temprano hacia el norte para una jornada de gran belleza paisajística. Atravesaremos el impresionante Valle del Ziz, que alberga más de diez millones de palmeras — uno de los palmerales más extensos del país. Seguiremos camino por la cordillera del Atlas pasando por Midelt hasta llegar a Aguelmane Sidi Ali, situado a 2.200 metros de altitud junto al lago natural más profundo de Marruecos, formado en el cráter de un volcán extinto. Comida en el Hotel Xaluca Spa Aguelmane Sidi Ali. Por la tarde, tiempo para disfrutar del entorno y de las instalaciones del hotel: paseo alrededor del lago, subida opcional al cráter del volcán cercano, visita a una familia nómada Aït Atta, piscina climatizada, spa y hammam. Cena y alojamiento en Xaluca Spa Aguelmane Sidi Ali, antiguo refugio de caza y pesca construido en 1935 y recientemente restaurado.",
    en: "Early start heading north for a day of great scenic beauty. We cross the impressive Ziz Valley — home to more than ten million date palms — one of the largest palm groves in the country. We continue along the Atlas range via Midelt to Aguelmane Sidi Ali, set at 2,200 m altitude next to Morocco's deepest natural lake, formed in the crater of an extinct volcano. Lunch at Hotel Xaluca Spa Aguelmane Sidi Ali. In the afternoon, time to enjoy the surroundings and the hotel's facilities: a walk around the lake, optional climb to the nearby volcanic crater, visit to an Aït Atta nomadic family, heated pool, spa and hammam. Dinner and overnight at Xaluca Spa Aguelmane Sidi Ali, a former hunting and fishing lodge built in 1935 and recently restored.",
    fr: "Départ matinal vers le nord pour une étape d'une grande beauté paysagère. Nous traversons l'impressionnante Vallée du Ziz — qui abrite plus de dix millions de palmiers — l'une des plus vastes palmeraies du pays. Nous poursuivons par la chaîne de l'Atlas en passant par Midelt jusqu'à Aguelmane Sidi Ali, perché à 2 200 m d'altitude au bord du lac naturel le plus profond du Maroc, formé dans le cratère d'un volcan éteint. Déjeuner à l'Hôtel Xaluca Spa Aguelmane Sidi Ali. L'après-midi, temps libre pour profiter du cadre et des installations de l'hôtel : promenade autour du lac, ascension en option du cratère volcanique voisin, visite d'une famille nomade Aït Atta, piscine chauffée, spa et hammam. Dîner et nuit au Xaluca Spa Aguelmane Sidi Ali, ancien relais de chasse et de pêche construit en 1935 et récemment restauré.",
  },
  wellness: [
    { es: "Paseo lacustre · 4 km", en: "Lake walk · 4 km", fr: "Promenade lacustre · 4 km" },
    { es: "Cráter volcánico", en: "Volcanic crater", fr: "Cratère volcanique" },
    { es: "Encuentro con nómadas Aït Atta", en: "Aït Atta nomadic meeting", fr: "Rencontre nomades Aït Atta" },
    { es: "Piscina climatizada", en: "Heated pool", fr: "Piscine chauffée" },
    { es: "Spa & hammam (opcional)", en: "Spa & hammam (optional)", fr: "Spa & hammam (option)" },
  ],
  culture: [
    {
      title: T("Lago Aguelmane Sidi Ali", "Aguelmane Sidi Ali lake", "Lac Aguelmane Sidi Ali"),
      body: T(
        "El lago natural más profundo de Marruecos (≈ 60 m), formado en el cráter de un volcán extinto. Refugio invernal de flamencos rosados y aves migratorias.",
        "Morocco's deepest natural lake (≈ 60 m), formed in an extinct volcanic crater. Winter refuge for flamingos and migratory birds.",
        "Lac naturel le plus profond du Maroc (≈ 60 m), formé dans le cratère d'un volcan éteint. Refuge hivernal de flamants roses et d'oiseaux migrateurs.",
      ),
    },
    {
      title: T("Valle del Ziz · diez millones de palmeras", "Ziz Valley · ten million palms", "Vallée du Ziz · dix millions de palmiers"),
      body: T(
        "El río Ziz dibuja un oasis lineal que recorre el sur de Marruecos durante 280 km, sosteniendo uno de los palmerales más extensos del país.",
        "The Ziz river carves a linear oasis running 280 km through southern Morocco, sustaining one of the country's largest palm groves.",
        "La rivière Ziz dessine une oasis linéaire qui traverse le sud du Maroc sur 280 km.",
      ),
    },
    {
      title: T("Aït Atta · nómadas del Tafilalet", "Aït Atta · Tafilalet nomads", "Aït Atta · nomades du Tafilalet"),
      body: T(
        "Confederación tribal bereber que aún practica la trashumancia estacional entre el Atlas y el desierto. Su tradición oral está reconocida por la UNESCO.",
        "Berber tribal confederation that still practises seasonal transhumance between the Atlas and the desert. Their oral tradition is UNESCO listed.",
        "Confédération tribale berbère pratiquant encore la transhumance saisonnière entre l'Atlas et le désert. Leur tradition orale est classée UNESCO.",
      ),
    },
  ],
};

export const DAY_MSF_SIDIALI_IFRANE_FEZ_RETURN = {
  route_id: "msf78-sidiali-ifrane-fez-return",
  id: "msf78-d8",
  image: "https://images.unsplash.com/photo-1547234935-80c7145ec969?auto=format&fit=crop&w=2000&q=85",
  accent: "#7C8B5C",
  title: T(
    "Sidi Ali · Ifrane · cedros · Fez · regreso",
    "Sidi Ali · Ifrane · cedars · Fez · return",
    "Sidi Ali · Ifrane · cèdres · Fès · retour",
  ),
  body: {
    es: "Salida temprano hacia Fez atravesando la ciudad de Ifrane — conocida como «la pequeña Suiza» por su sorprendente parecido con los paisajes y la arquitectura alpina — y los famosos Bosques de Cedros Gigantes, hogar de una colonia de monos magot que, con suerte, podremos alimentar en plena naturaleza. Llegada a Fez al mediodía. Visita guiada a pie por la antigua Medina de Fez — Patrimonio de la Humanidad UNESCO desde 1981 — recorriendo sus callejuelas medievales, centros artesanales, mezquitas y palacios. Visita a una curtiduría tradicional, donde conoceremos de cerca el proceso de trabajo del cuero, uno de los oficios más emblemáticos de la ciudad. A la hora acordada, traslado al aeropuerto de Fez para tomar el vuelo de regreso. Nota: hoy es el último día con vehículo 4x4.",
    en: "Early start to Fez crossing Ifrane — known as «little Switzerland» for its striking Alpine architecture — and the famous Giant Cedar Forests, home to a colony of Barbary macaques that we may be lucky enough to feed in the wild. Midday arrival in Fez. Guided walking tour of the ancient Fez medina — UNESCO World Heritage since 1981 — threading its medieval alleys, artisan workshops, mosques and palaces. Visit to a traditional tannery to see the leather-working process up close — one of the city's most emblematic trades. At the agreed time, transfer to Fez airport for the return flight. Note: this is the last day in 4x4.",
    fr: "Départ matinal vers Fès via Ifrane — surnommée « la petite Suisse » pour son étonnante ressemblance alpine — et les célèbres Forêts de Cèdres Géants, foyer d'une colonie de macaques de Barbarie que nous pourrons, avec un peu de chance, nourrir en pleine nature. Arrivée à Fès en milieu de journée. Visite guidée à pied de l'ancienne médina de Fès — Patrimoine de l'Humanité UNESCO depuis 1981 — à travers ses ruelles médiévales, centres artisanaux, mosquées et palais. Visite d'une tannerie traditionnelle pour voir de près le travail du cuir, l'un des métiers les plus emblématiques de la ville. À l'heure convenue, transfert à l'aéroport de Fès pour le vol retour. Note : dernier jour en 4x4.",
  },
  culture: [
    {
      title: T("Ifrane · la pequeña Suiza marroquí", "Ifrane · little Moroccan Switzerland", "Ifrane · la petite Suisse marocaine"),
      body: T(
        "A 1.665 m de altitud, fue diseñada por arquitectos franceses en los años 30 con tejados a dos aguas — un pueblo alpino en pleno Marruecos.",
        "At 1,665 m, designed by French architects in the 1930s with pitched roofs — an Alpine village in the heart of Morocco.",
        "À 1 665 m d'altitude, conçue par des architectes français dans les années 1930 avec ses toits en pente.",
      ),
    },
    {
      title: T("Cedros del Atlas y monos magot", "Atlas cedars and Barbary macaques", "Cèdres de l'Atlas et macaques de Barbarie"),
      body: T(
        "Los bosques del Medio Atlas son uno de los últimos santuarios del macaco de Berbería, la única especie de primate que vive de forma silvestre al norte del Sáhara.",
        "The Middle Atlas forests are one of the last sanctuaries of the Barbary macaque, the only primate species living wild north of the Sahara.",
        "Les forêts du Moyen Atlas constituent l'un des derniers sanctuaires du macaque de Barbarie, seule espèce de primate vivant à l'état sauvage au nord du Sahara.",
      ),
    },
    {
      title: T("Chouara · la curtiduría más antigua del mundo", "Chouara · the world's oldest tannery", "Chouara · la plus ancienne tannerie au monde"),
      body: T(
        "Las tinas multicolor de Chouara funcionan ininterrumpidamente desde el siglo XI, usando las mismas técnicas y los mismos colorantes naturales (índigo, alheña, azafrán y amapola).",
        "Chouara's multicoloured vats have been running uninterruptedly since the 11th century — same techniques, same natural dyes (indigo, henna, saffron and poppy).",
        "Les cuves multicolores de Chouara fonctionnent sans interruption depuis le XIe siècle, avec les mêmes techniques et colorants naturels.",
      ),
    },
  ],
};

/* ============================================================
   Program · 7 nights / 8 days · Marrakech → Sidi Ali → Fez
============================================================ */

export const PROGRAM_MSF_78 = {
  routeId: "tourMarrakechSidialiFez78",
  duration_key: "msf7n8d",
  duration: T("7 noches / 8 días", "7 nights / 8 days", "7 nuits / 8 jours"),
  prices: { low: 2090, mid: 2390, high: 2690, premium: 3090 },
  route: [
    { day: 1, lat: 31.6295, lng: -7.9811, type: "city",    name: T("Marrakech · Llegada", "Marrakech · Arrival", "Marrakech · Arrivée") },
    { day: 2, lat: 31.6219, lng: -7.9831, type: "city",    name: T("Marrakech · Medina", "Marrakech · Medina", "Marrakech · Médina") },
    { day: 3, lat: 31.3582, lng: -5.9911, type: "kasbah",  name: T("Aït Ben Haddou · Boumalne Dades", "Aït Ben Haddou · Boumalne Dades", "Aït Ben Haddou · Boumalne Dadès") },
    { day: 4, lat: 31.4373, lng: -4.2330, type: "city",    name: T("Todra · Erfoud · Kasbah Xaluca", "Todra · Erfoud · Kasbah Xaluca", "Todra · Erfoud · Kasbah Xaluca") },
    { day: 5, lat: 31.1257, lng: -3.9789, type: "desert",  name: T("Erg Chebbi · Bivouac", "Erg Chebbi · Bivouac", "Erg Chebbi · Bivouac") },
    { day: 6, lat: 31.2828, lng: -4.2683, type: "market",  name: T("Khamlia · Rissani · Kasbah Xaluca", "Khamlia · Rissani · Kasbah Xaluca", "Khamlia · Rissani · Kasbah Xaluca") },
    { day: 7, lat: 33.0500, lng: -4.9650, type: "lake",    name: T("Aguelmane Sidi Ali", "Aguelmane Sidi Ali", "Aguelmane Sidi Ali") },
    { day: 8, lat: 33.9273, lng: -4.9779, type: "airport", name: T("Fez · Medina · Aeropuerto", "Fez · Medina · Airport", "Fès · Médina · Aéroport") },
  ],
  days: [
    DAY_FRM_ARRIVAL_LIGHT,
    DAY_FRM_MARRAKECH_MEDINA,
    DAY_02_TICHKA_AITBENHADDOU_DADES,
    DAY_03_DADES_TODRA_ERFOUD,
    DAY_04_DESERT_BIVOUAC,
    DAY_05_SUNRISE_KHAMLIA_RISSANI,
    DAY_MSF_ZIZ_SIDIALI,
    DAY_MSF_SIDIALI_IFRANE_FEZ_RETURN,
  ],
  details: {
    includes: {
      es: [
        "Dos noches en Marrakech en Riad en la Medina u Hotel 5★ en Alojamiento y Desayuno",
        "Una noche en Boumalne Dades en Hotel Xaluca Dadès 4★ en Media Pensión",
        "Dos noches en Erfoud en Kasbah Hotel Xaluca en Media Pensión",
        "Una noche en Erg Chebbi en Bivouac de Luxe en el desierto en Media Pensión",
        "Una noche en Timahdite en Hotel Xaluca Spa Aguelmane Sidi Ali en Media Pensión",
        "Picnic en el desierto · Comida en Hotel Xaluca Spa Aguelmane Sidi Ali",
        "Excursión en dromedario por el Erg Chebbi",
        "Vehículo 4x4 con chófer desde el día 3 hasta el día 8 del itinerario, ambos incluidos",
        "Visita con guía local en Marrakech · Visita con guía local en Fez",
        "Visitas a Aït Ben Haddou y Palacio de la Bahía",
        "Transfers desde y hacia aeropuertos · Combustible · Seguro de asistencia en viaje",
      ],
      en: [
        "Two nights in Marrakech in a Medina riad or 5★ hotel · bed & breakfast",
        "One night in Boumalne Dades at Hotel Xaluca Dades 4★ · half board",
        "Two nights in Erfoud at Kasbah Hotel Xaluca · half board",
        "One night at the Bivouac de Luxe in the Erg Chebbi · half board",
        "One night in Timahdite at Hotel Xaluca Spa Aguelmane Sidi Ali · half board",
        "Picnic lunch in the desert · Lunch at Hotel Xaluca Spa Aguelmane Sidi Ali",
        "Camel ride in the Erg Chebbi",
        "4x4 with driver from day 3 to day 8 inclusive",
        "Local guided tour in Marrakech · Local guided tour in Fez",
        "Visits to Aït Ben Haddou and the Bahia Palace",
        "Airport transfers · Fuel · Travel assistance insurance",
      ],
      fr: [
        "Deux nuits à Marrakech en riad de la médina ou hôtel 5★ · petit-déjeuner",
        "Une nuit à Boumalne Dadès à l'Hôtel Xaluca Dadès 4★ · demi-pension",
        "Deux nuits à Erfoud à la Kasbah Hôtel Xaluca · demi-pension",
        "Une nuit au Bivouac de Luxe dans l'Erg Chebbi · demi-pension",
        "Une nuit à Timahdite à l'Hôtel Xaluca Spa Aguelmane Sidi Ali · demi-pension",
        "Pique-nique au désert · Déjeuner à l'Hôtel Xaluca Spa Aguelmane Sidi Ali",
        "Balade à dromadaire dans l'Erg Chebbi",
        "4x4 avec chauffeur du jour 3 au jour 8 inclus",
        "Guide local à Marrakech · Guide local à Fès",
        "Visites d'Aït Ben Haddou et du palais de la Bahia",
        "Transferts aéroports · Carburant · Assistance voyage",
      ],
    },
    excludes: SHARED_FRM_DETAILS.excludes,
    notes: {
      es: [
        "Opciones de vuelos: Royal Air Maroc, Vueling, Air Arabia, Ryanair.",
        "Las tarifas se calculan según la ocupación del 4x4. El coste se divide entre los ocupantes.",
        "Tarifas basadas en habitaciones dobles y triples. Suplemento individual: 550 €.",
        "Descuento niños (3-11 años) compartiendo con dos adultos: 335 € temporada baja · 355 € temporada alta.",
        "En temporada alta, los guías de medina pueden compartirse con otros viajeros.",
        "Chóferes hispanohablantes son limitados — reservar con antelación.",
        "Los guías oficiales están reservados exclusivamente para las visitas a las medinas, no para las rutas.",
        "Es obligatorio pasaporte vigente con un mínimo de 3 meses desde la fecha de regreso (puede enviarse posteriormente si está en renovación).",
        "Actividades opcionales: quads 70 € por vehículo (circuito de 1 hora). Spa y masajes en recepción del hotel.",
        "El mercado de Rissani se celebra los martes, jueves y domingos.",
      ],
      en: [
        "Flight options: Royal Air Maroc, Vueling, Air Arabia, Ryanair.",
        "Rates depend on 4x4 occupancy. Cost is split between passengers.",
        "Rates based on double and triple rooms. Single room supplement: €550.",
        "Children discount (3-11) sharing with two adults: €335 low season · €355 high season.",
        "In high season medina guides may be shared with other travellers.",
        "Spanish-speaking drivers are limited — book early.",
        "Official guides are reserved exclusively for medina visits, not for the on-road portions.",
        "Valid passport required with at least 3 months remaining from the return date (may be sent later if being renewed).",
        "Optional activities: quads €70 per vehicle (1-hour circuit). Spa & massages at hotel reception.",
        "Rissani market runs Tuesday, Thursday and Sunday.",
      ],
      fr: [
        "Options de vol : Royal Air Maroc, Vueling, Air Arabia, Ryanair.",
        "Tarifs selon l'occupation du 4x4. Le coût est partagé entre les occupants.",
        "Tarifs base chambre double et triple. Supplément single : 550 €.",
        "Réduction enfants (3-11 ans) partageant avec 2 adultes : 335 € basse · 355 € haute.",
        "En haute saison, les guides de médina peuvent être partagés.",
        "Chauffeurs hispanophones limités — réserver tôt.",
        "Les guides officiels sont réservés aux visites des médinas, pas aux trajets.",
        "Passeport valable au minimum 3 mois après le retour (peut être envoyé ultérieurement s'il est en renouvellement).",
        "Activités en option : quads 70 € par véhicule (1 h). Spa et massages à la réception de l'hôtel.",
        "Marché de Rissani les mardi, jeudi et dimanche.",
      ],
    },
    terms: SHARED_FRM_DETAILS.terms,
  },
};

export default PROGRAM_MSF_78;
