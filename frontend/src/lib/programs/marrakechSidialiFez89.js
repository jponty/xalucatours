// Marrakech → Sidi Ali → Fez · 8 nights / 9 days. Extends the 7n/8d
// variant by adding an extra night in a Fez Medina riad, splitting the
// final stretch in two: Sidi Ali → Fez (with afternoon medina visit)
// and a relaxed return day with the airport transfer.

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
import { DAY_MSF_ZIZ_SIDIALI } from "@/lib/programs/marrakechSidialiFez78";

const T = (es, en, fr) => ({ es, en, fr });

/* ============================================================
   Program-specific days · Marrakech → Sidi Ali → Fez · 8n/9d
============================================================ */

export const DAY_MSF_SIDIALI_FEZ_MEDINA = {
  route_id: "msf89-sidiali-fez-medina",
  id: "msf89-d8",
  image: "https://images.unsplash.com/photo-1547234935-80c7145ec969?auto=format&fit=crop&w=2000&q=85",
  accent: "#7C8B5C",
  title: T(
    "Sidi Ali · Ifrane · cedros · Fez · visita de la Medina",
    "Sidi Ali · Ifrane · cedars · Fez · medina tour",
    "Sidi Ali · Ifrane · cèdres · Fès · visite de la médina",
  ),
  chronologySummary: T(
    "Viajamos por Ifrane y los bosques de cedros hasta Fez, donde recorremos la medina, sus talleres artesanos y una curtiduría tradicional.",
    "We travel through Ifrane and the cedar forests to Fez, exploring the medina, its artisan workshops and a traditional tannery.",
    "Nous passons par Ifrane et les forêts de cèdres jusqu’à Fès, puis découvrons la médina, ses artisans et une tannerie traditionnelle.",
  ),
  body: {
    es: "Salida hacia Fez atravesando Ifrane — conocida como «la pequeña Suiza» por su sorprendente parecido con los paisajes y la arquitectura alpina — y los famosos Bosques de Cedros Gigantes, hogar de una colonia de monos magot que, con suerte, podremos alimentar en plena naturaleza. Llegada a Fez al mediodía y comienzo de la visita guiada a pie por la antigua Medina de Fez — Patrimonio de la Humanidad UNESCO desde 1981 — recorriendo sus laberínticas callejuelas medievales, centros artesanales, mezquitas y palacios. Visita a una curtiduría tradicional para descubrir uno de los oficios más emblemáticos de la ciudad. Cena y alojamiento en Riad en la Medina o Hotel 4★. Nota: hoy es el último día con vehículo 4x4.",
    en: "We head to Fez crossing Ifrane — known as «little Switzerland» for its striking Alpine architecture — and the famous Giant Cedar Forests, home to a colony of Barbary macaques we may be lucky enough to feed in the wild. Midday arrival in Fez and start of the guided walking tour of the ancient Fez medina — UNESCO World Heritage since 1981 — threading its labyrinthine medieval alleys, artisan workshops, mosques and palaces. Visit to a traditional tannery to discover one of the city's most emblematic trades. Dinner and overnight in a Medina riad or 4★ hotel. Note: this is the last day in 4x4.",
    fr: "Route vers Fès via Ifrane — surnommée « la petite Suisse » pour son étonnante ressemblance alpine — et les célèbres Forêts de Cèdres Géants, foyer d'une colonie de macaques de Barbarie que nous pourrons nourrir en pleine nature. Arrivée à Fès en milieu de journée et début de la visite guidée à pied de l'ancienne médina de Fès — Patrimoine de l'Humanité UNESCO depuis 1981 — à travers ses ruelles médiévales labyrinthiques, centres artisanaux, mosquées et palais. Visite d'une tannerie traditionnelle pour découvrir l'un des métiers les plus emblématiques de la ville. Dîner et nuit en riad de la médina ou hôtel 4★. Note : dernier jour en 4x4.",
  },
  culture: [
    {
      title: T("Ifrane · la pequeña Suiza marroquí", "Ifrane · little Moroccan Switzerland", "Ifrane · la petite Suisse marocaine"),
      body: T(
        "A 1.665 m de altitud, diseñada por arquitectos franceses en los años 30 con tejados a dos aguas — un pueblo alpino en pleno Marruecos.",
        "At 1,665 m, designed by French architects in the 1930s with pitched roofs — an Alpine village in the heart of Morocco.",
        "À 1 665 m d'altitude, conçue par des architectes français dans les années 1930 avec ses toits en pente.",
      ),
    },
    {
      title: T("Cedros del Atlas y monos magot", "Atlas cedars and Barbary macaques", "Cèdres de l'Atlas et macaques de Barbarie"),
      body: T(
        "Los bosques del Medio Atlas son uno de los últimos santuarios del macaco de Berbería, la única especie de primate que vive de forma silvestre al norte del Sáhara.",
        "The Middle Atlas forests are one of the last sanctuaries of the Barbary macaque, the only primate species living wild north of the Sahara.",
        "Les forêts du Moyen Atlas constituent l'un des derniers sanctuaires du macaque de Barbarie.",
      ),
    },
    {
      title: T("Chouara · la curtiduría más antigua del mundo", "Chouara · the world's oldest tannery", "Chouara · la plus ancienne tannerie au monde"),
      body: T(
        "Las tinas multicolor de Chouara funcionan ininterrumpidamente desde el siglo XI, usando las mismas técnicas y los mismos colorantes naturales (índigo, alheña, azafrán y amapola).",
        "Chouara's multicoloured vats have been running uninterruptedly since the 11th century — same techniques, same natural dyes.",
        "Les cuves multicolores de Chouara fonctionnent sans interruption depuis le XIe siècle.",
      ),
    },
  ],
};

export const DAY_MSF_FEZ_RETURN = {
  route_id: "msf89-fez-return",
  id: "msf89-d9",
  image: "https://images.unsplash.com/photo-1597212618440-806262de4f6b?auto=format&fit=crop&w=2000&q=85",
  accent: "#5C5248",
  title: T(
    "Fez · regreso",
    "Fez · return",
    "Fès · retour",
  ),
  chronologySummary: T(
    "Últimas horas para pasear por Fez o completar la visita de la medina antes del traslado al aeropuerto y el vuelo de regreso.",
    "Final hours to stroll through Fez or complete the medina visit before the airport transfer and return flight.",
    "Dernières heures pour flâner à Fès ou compléter la visite de la médina avant le transfert à l’aéroport et le vol retour.",
  ),
  body: {
    es: "A la hora acordada, traslado al aeropuerto de Fez para tomar el vuelo de regreso. Nota: cuando los vuelos salen por la tarde, la mañana puede dedicarse a un paseo libre por la medina o a completar la visita guiada iniciada el día anterior; en ocasiones la visita de Fez se realiza íntegramente esta jornada.",
    en: "At the agreed time, transfer to Fez airport for the return flight. Note: when flights depart in the afternoon, the morning may be spent on a free stroll through the medina or completing the guided tour started the previous day; sometimes the Fez tour is held entirely on this day.",
    fr: "À l'heure convenue, transfert à l'aéroport de Fès pour le vol retour. Note : lorsque les vols partent l'après-midi, la matinée peut être consacrée à une balade libre dans la médina ou à compléter la visite guidée commencée la veille ; il arrive que la visite de Fès se fasse entièrement ce jour-là.",
  },
  culture: [
    {
      title: T("Fez · Patrimonio UNESCO desde 1981", "Fez · UNESCO World Heritage since 1981", "Fès · Patrimoine UNESCO depuis 1981"),
      body: T(
        "9.000 callejones, 60.000 puertas y un tejido urbano intacto desde el siglo IX — la medina más fascinante del mundo árabe.",
        "9,000 alleys, 60,000 doors and an urban fabric unchanged since the 9th century — the most fascinating medina in the Arab world.",
        "9 000 ruelles, 60 000 portes et un tissu urbain intact depuis le IXe siècle.",
      ),
    },
  ],
};

/* ============================================================
   Program · 8 nights / 9 days · Marrakech → Sidi Ali → Fez
============================================================ */

export const PROGRAM_MSF_89 = {
  routeId: "tourMarrakechSidialiFez89",
  duration_key: "msf8n9d",
  duration: T("8 noches / 9 días", "8 nights / 9 days", "8 nuits / 9 jours"),
  prices: { low: 2290, mid: 2590, high: 2890, premium: 3290 },
  route: [
    { day: 1, lat: 31.6295, lng: -7.9811, type: "city",    name: T("Marrakech · Llegada", "Marrakech · Arrival", "Marrakech · Arrivée") },
    { day: 2, lat: 31.6219, lng: -7.9831, type: "city",    name: T("Marrakech · Medina", "Marrakech · Medina", "Marrakech · Médina") },
    { day: 3, lat: 31.3582, lng: -5.9911, type: "kasbah",  name: T("Aït Ben Haddou · Boumalne Dades", "Aït Ben Haddou · Boumalne Dades", "Aït Ben Haddou · Boumalne Dadès") },
    { day: 4, lat: 31.4373, lng: -4.2330, type: "city",    name: T("Todra · Erfoud · Kasbah Xaluca", "Todra · Erfoud · Kasbah Xaluca", "Todra · Erfoud · Kasbah Xaluca") },
    { day: 5, lat: 31.1257, lng: -3.9789, type: "desert",  name: T("Erg Chebbi · Bivouac", "Erg Chebbi · Bivouac", "Erg Chebbi · Bivouac") },
    { day: 6, lat: 31.2828, lng: -4.2683, type: "market",  name: T("Khamlia · Rissani · Kasbah Xaluca", "Khamlia · Rissani · Kasbah Xaluca", "Khamlia · Rissani · Kasbah Xaluca") },
    { day: 7, lat: 33.0500, lng: -4.9650, type: "lake",    name: T("Aguelmane Sidi Ali", "Aguelmane Sidi Ali", "Aguelmane Sidi Ali") },
    { day: 8, lat: 34.0651, lng: -4.9760, type: "city",    name: T("Fez · Medina", "Fez · Medina", "Fès · Médina") },
    { day: 9, lat: 33.9273, lng: -4.9779, type: "airport", name: T("Fez · Aeropuerto", "Fez · Airport", "Fès · Aéroport") },
  ],
  days: [
    DAY_FRM_ARRIVAL_LIGHT,
    DAY_FRM_MARRAKECH_MEDINA,
    DAY_02_TICHKA_AITBENHADDOU_DADES,
    DAY_03_DADES_TODRA_ERFOUD,
    DAY_04_DESERT_BIVOUAC,
    DAY_05_SUNRISE_KHAMLIA_RISSANI,
    DAY_MSF_ZIZ_SIDIALI,
    DAY_MSF_SIDIALI_FEZ_MEDINA,
    DAY_MSF_FEZ_RETURN,
  ],
  details: {
    includes: {
      es: [
        "Dos noches en Marrakech en Riad en la Medina u Hotel 5★ en Alojamiento y Desayuno",
        "Una noche en Boumalne Dades en Hotel Xaluca Dadès 4★ en Media Pensión",
        "Dos noches en Erfoud en Kasbah Hotel Xaluca en Media Pensión",
        "Una noche en Erg Chebbi en Bivouac de Luxe en el desierto en Media Pensión",
        "Una noche en Timahdite en Hotel Xaluca Spa Aguelmane Sidi Ali en Media Pensión",
        "Una noche en Fez en Riad en la Medina u Hotel 4★ en Media Pensión",
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
        "One night in Fez in a Medina riad or 4★ hotel · half board",
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
        "Une nuit à Fès en riad de la médina ou hôtel 4★ · demi-pension",
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
        "Tarifas basadas en habitaciones dobles y triples. Suplemento individual: 585 €.",
        "Descuento niños (3-11 años) compartiendo con dos adultos: 390 € temporada baja · 405 € temporada alta.",
        "En temporada alta, los guías de medina pueden compartirse con otros viajeros.",
        "Chóferes hispanohablantes son limitados — reservar con antelación.",
        "Los guías oficiales están reservados exclusivamente para las visitas a las medinas, no para las rutas.",
        "Es obligatorio pasaporte vigente con un mínimo de 3 meses desde la fecha de regreso (puede enviarse posteriormente si está en renovación).",
        "Actividades opcionales: quads 70 € por vehículo (circuito de 1 hora). Spa y masajes en recepción del hotel.",
        "El mercado de Rissani se celebra los martes, jueves y domingos.",
        "Cuando los vuelos salen por la tarde, la visita guiada de Fez puede reubicarse al día 9.",
      ],
      en: [
        "Flight options: Royal Air Maroc, Vueling, Air Arabia, Ryanair.",
        "Rates depend on 4x4 occupancy. Cost is split between passengers.",
        "Rates based on double and triple rooms. Single room supplement: €585.",
        "Children discount (3-11) sharing with two adults: €390 low season · €405 high season.",
        "In high season medina guides may be shared with other travellers.",
        "Spanish-speaking drivers are limited — book early.",
        "Official guides are reserved exclusively for medina visits, not for the on-road portions.",
        "Valid passport required with at least 3 months remaining from the return date (may be sent later if being renewed).",
        "Optional activities: quads €70 per vehicle (1-hour circuit). Spa & massages at hotel reception.",
        "Rissani market runs Tuesday, Thursday and Sunday.",
        "When flights depart in the afternoon, the Fez guided tour may be relocated to day 9.",
      ],
      fr: [
        "Options de vol : Royal Air Maroc, Vueling, Air Arabia, Ryanair.",
        "Tarifs selon l'occupation du 4x4. Le coût est partagé entre les occupants.",
        "Tarifs base chambre double et triple. Supplément single : 585 €.",
        "Réduction enfants (3-11 ans) partageant avec 2 adultes : 390 € basse · 405 € haute.",
        "En haute saison, les guides de médina peuvent être partagés.",
        "Chauffeurs hispanophones limités — réserver tôt.",
        "Les guides officiels sont réservés aux visites des médinas, pas aux trajets.",
        "Passeport valable au minimum 3 mois après le retour (peut être envoyé ultérieurement s'il est en renouvellement).",
        "Activités en option : quads 70 € par véhicule (1 h). Spa et massages à la réception de l'hôtel.",
        "Marché de Rissani les mardi, jeudi et dimanche.",
        "Quand les vols partent l'après-midi, la visite guidée de Fès peut être déplacée au jour 9.",
      ],
    },
    terms: SHARED_FRM_DETAILS.terms,
  },
};

export default PROGRAM_MSF_89;
