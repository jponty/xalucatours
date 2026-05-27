// Ouarzazate → Sidi Ali → Fez · 5 nights / 6 days. Reverse direction
// of the FOZ family. Only day 3 (desert bivouac) is reused from
// shared modules; the rest are direction-specific.

import { DAY_03_ERFOUD_ERG_BIVOUAC } from "./fezMarrakech910";

const T = (es, en, fr) => ({ es, en, fr });

/* ============================================================
   Program-specific days · Ouarzazate → Fez direction
============================================================ */

export const DAY_OZF_OUARZA_AITBEN_DADES = {
  route_id: "ozf56-ouarza-aitben-dades",
  id: "ozf56-d1",
  image: "https://images.unsplash.com/photo-1551918120-9739cb430c6d?auto=format&fit=crop&w=2000&q=85",
  accent: "#A07042",
  title: T(
    "Llegada a Ouarzazate · Aït Ben Haddou · Boumalne Dadès",
    "Arrival in Ouarzazate · Aït Ben Haddou · Boumalne Dades",
    "Arrivée à Ouarzazate · Aït Ben Haddou · Boumalne Dadès",
  ),
  body: {
    es: "Llegada al aeropuerto de Ouarzazate y recogida en vehículo 4x4 con chófer. Visita a Aït Ben Haddou, ksar Patrimonio de la Humanidad por la UNESCO — escenario de películas como Gladiator o Lawrence de Arabia. Opcionalmente podemos visitar los Estudios de cine Atlas y la Kasbah de Taourirt. Continuación hacia Boumalne Dades, situada en el Valle de los Pájaros, a 1.612 metros de altitud. Cena y alojamiento en Hotel Xaluca Dades 4★.",
    en: "Arrival at Ouarzazate airport and pickup in a 4x4 with driver. Visit to Aït Ben Haddou — a UNESCO World Heritage ksar, set of films like Gladiator and Lawrence of Arabia. Optional stops at the Atlas Film Studios and the Taourirt Kasbah. Continuation to Boumalne Dades, in the Valley of Birds at 1,612 m altitude. Dinner and overnight at Hotel Xaluca Dades 4★.",
    fr: "Arrivée à l'aéroport d'Ouarzazate et accueil en 4x4 avec chauffeur. Visite d'Aït Ben Haddou — ksar classé Patrimoine de l'Humanité par l'UNESCO, décor de films comme Gladiator ou Lawrence d'Arabie. En option : Studios de cinéma Atlas et Kasbah de Taourirt. Continuation vers Boumalne Dadès, dans la Vallée des Oiseaux à 1 612 m d'altitude. Dîner et nuit à l'Hôtel Xaluca Dadès 4★.",
  },
  culture: [
    {
      title: T("Aït Ben Haddou · UNESCO desde 1987", "Aït Ben Haddou · UNESCO since 1987", "Aït Ben Haddou · UNESCO depuis 1987"),
      body: T(
        "Ksar fortificado del siglo XVII en la ruta caravanera Marrakech – Sudán. Sus muros de adobe y torres almenadas son el ejemplo más bello de arquitectura del sur marroquí.",
        "17th-century fortified ksar on the Marrakech – Sudan caravan route. Its adobe walls and crenellated towers are the finest example of southern Moroccan architecture.",
        "Ksar fortifié du XVIIe siècle sur la route caravanière Marrakech – Soudan. Ses murs en pisé et tours crénelées sont le plus bel exemple d'architecture du sud marocain.",
      ),
    },
    {
      title: T("Ouarzazate · capital del cine", "Ouarzazate · capital of cinema", "Ouarzazate · capitale du cinéma"),
      body: T(
        "Capital del cine marroquí desde los años 80. Aquí se han rodado Babel, Juego de Tronos, Misión Imposible y muchas más.",
        "Capital of Moroccan cinema since the 1980s. Babel, Game of Thrones, Mission Impossible and many more have been filmed here.",
        "Capitale du cinéma marocain depuis les années 1980. Babel, Game of Thrones, Mission Impossible et bien d'autres y ont été tournés.",
      ),
    },
  ],
};

export const DAY_OZF_DADES_TODRA_ERFOUD = {
  route_id: "ozf56-dades-todra-erfoud",
  id: "ozf56-d2",
  image: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=2000&q=85",
  accent: "#C16542",
  title: T(
    "Valle del Dadès · Gargantas del Todra · Erfoud",
    "Dades Valley · Todra Gorges · Erfoud",
    "Vallée du Dadès · Gorges du Todra · Erfoud",
  ),
  body: {
    es: "Ruta por el Alto Atlas Central atravesando paisajes llenos de contrastes — Boutaghrar, el Valle del Dadès, las Gargantas del Dadès con su mirador panorámico, montañas, cañones, valles y grutas habitadas por nómadas. Por la tarde, llegada a Tinerhir y visita a las Gargantas del Todra con un paseo junto al río — paredes verticales que alcanzan los 160 metros de altura. Continuación hacia Erfoud, «la Puerta del Desierto». Cena y alojamiento en Kasbah Xaluca.",
    en: "Route through the High Atlas Central crossing contrast-filled landscapes — Boutaghrar, the Dades Valley, the Dades Gorges with their panoramic viewpoint, mountains, canyons, valleys and caves inhabited by nomads. In the afternoon, arrival in Tinerhir and visit to the Todra Gorges with a walk along the river — vertical walls reaching 160 m high. Continuation to Erfoud, «the Gate of the Desert». Dinner and overnight at Kasbah Xaluca.",
    fr: "Route à travers le Haut Atlas Central traversant des paysages riches en contrastes — Boutaghrar, la Vallée du Dadès, les Gorges du Dadès avec leur mirador panoramique, montagnes, canyons, vallées et grottes habitées par les nomades. L'après-midi, arrivée à Tinerhir et visite des Gorges du Todra avec une promenade le long de la rivière — parois verticales atteignant 160 m de hauteur. Continuation vers Erfoud, « la Porte du Désert ». Dîner et nuit à la Kasbah Xaluca.",
  },
};

const DAY_OZF_DUNES_KHAMLIA_SIDIALI = {
  route_id: "ozf56-dunes-khamlia-sidiali",
  id: "ozf56-d4",
  image: "https://images.unsplash.com/photo-1570133435536-7ececf000ef6?auto=format&fit=crop&w=2000&q=85",
  accent: "#7C8B5C",
  title: T(
    "Amanecer en las dunas · Khamlia · Rissani · Valle del Ziz · Sidi Ali",
    "Sunrise · Khamlia · Rissani · Ziz Valley · Sidi Ali",
    "Lever du soleil · Khamlia · Rissani · Vallée du Ziz · Sidi Ali",
  ),
  body: {
    es: "«Cita con el Amanecer»: caminata hasta las dunas para ver la salida del sol — una experiencia mágica. Desayuno beduino en el campamento. Ruta en 4x4 hacia Merdani, Khamlia (música tradicional y té a la menta), el mercado de Rissani y un mirador natural sobre el desierto. Por la tarde, ruta hacia el norte (aproximadamente 330 km) por el Valle del Ziz — más de diez millones de palmeras — y cruce de la cordillera del Atlas hasta llegar a Aguelmane Sidi Ali, a 2.200 m sobre uno de los volcanes extintos del Atlas. Cena y alojamiento en Xaluca Spa Aguelmane Sidi Ali. Nota: el mercado de Rissani se celebra martes, jueves y domingos.",
    en: "«A date with the sunrise»: a climb to the top of the dunes for the sunrise — a magical experience. Bedouin breakfast at the camp. We drive to Merdani, then to Khamlia (traditional Gnawa music and mint tea), the Rissani market and a natural viewpoint over the desert. In the afternoon, we head north (around 330 km) up the Ziz Valley — ten million palm trees — and cross the Atlas range to reach Aguelmane Sidi Ali, at 2,200 m above an extinct Atlas volcano. Dinner and overnight at Xaluca Spa Aguelmane Sidi Ali. Note: the Rissani market runs Tuesdays, Thursdays and Sundays.",
    fr: "« Rendez-vous avec l'aube » : montée au sommet des dunes pour le lever du soleil — une expérience magique. Petit-déjeuner bédouin au campement. Départ en 4x4 vers Merdani, puis Khamlia (musique Gnawa traditionnelle et thé à la menthe), le marché de Rissani et un mirador naturel sur le désert. L'après-midi, route vers le nord (environ 330 km) par la Vallée du Ziz — dix millions de palmiers — et traversée de l'Atlas jusqu'à Aguelmane Sidi Ali, à 2 200 m sur un volcan éteint de l'Atlas. Dîner et nuit au Xaluca Spa Aguelmane Sidi Ali. Note : le marché de Rissani a lieu mardi, jeudi et dimanche.",
  },
  culture: [
    {
      title: T("Khamlia · música Gnawa UNESCO", "Khamlia · UNESCO Gnawa music", "Khamlia · musique Gnawa UNESCO"),
      body: T(
        "Fundado por comunidades de origen sudanés, reconocido por su música Gnawa — Patrimonio Cultural Inmaterial UNESCO desde 2019.",
        "Founded by communities of Sudanese origin, known for its Gnawa music — UNESCO Intangible Cultural Heritage since 2019.",
        "Fondé par des communautés d'origine soudanaise, connu pour sa musique Gnawa — Patrimoine Culturel Immatériel UNESCO depuis 2019.",
      ),
    },
    {
      title: T("Valle del Ziz · diez millones de palmeras", "Ziz Valley · ten million palms", "Vallée du Ziz · dix millions de palmiers"),
      body: T(
        "El río Ziz forma el oasis del Tafilalet — cuna histórica de la dinastía alauí, aún reinante en Marruecos.",
        "The Ziz river forms the Tafilalet oasis — historic cradle of the Alawi dynasty, still reigning in Morocco.",
        "La rivière Ziz forme l'oasis du Tafilalet — berceau historique de la dynastie alaouite, qui règne encore au Maroc.",
      ),
    },
  ],
};

export const DAY_OZF_SIDIALI_IFRANE_FEZ = {
  route_id: "ozf56-sidiali-ifrane-fez",
  id: "ozf56-d5",
  image: "https://images.unsplash.com/photo-1542401886-65d6c61db217?auto=format&fit=crop&w=2000&q=85",
  accent: "#5A6B4F",
  title: T(
    "Sidi Ali · cedros · Ifrane · Fez",
    "Sidi Ali · cedars · Ifrane · Fez",
    "Sidi Ali · cèdres · Ifrane · Fès",
  ),
  body: {
    es: "Por la mañana, paseo alrededor del lago Aguelmane Sidi Ali, con la posibilidad de subir hasta el cráter del volcán cercano. Comida en el hotel. Ruta hacia el norte atravesando los Bosques de Cedros Gigantes, donde con suerte podremos alimentar a los monos magot, y la ciudad de Ifrane — la «pequeña Suiza» marroquí, sorprendentemente alpina. Cruce final del Medio Atlas hasta llegar a Fez. Cena y alojamiento en Riad en la Medina o Hotel 4★. Nota: fin del recorrido en vehículo 4x4.",
    en: "Morning walk around Aguelmane Sidi Ali lake, with the option to climb to the nearby volcanic crater. Lunch at the hotel. We then head north through the Giant Cedar Forests, where with luck we can feed the Barbary macaques, and the city of Ifrane — Morocco's «little Switzerland», surprisingly alpine. Final crossing of the Middle Atlas down to Fez. Dinner and overnight at a Medina riad or 4★ hotel. Note: end of the 4x4 portion.",
    fr: "Le matin, promenade autour du lac Aguelmane Sidi Ali, avec la possibilité de monter au cratère du volcan voisin. Déjeuner à l'hôtel. Route vers le nord à travers les Forêts de Cèdres Géants, où avec un peu de chance nous nourrirons les macaques de Barbarie, et la ville d'Ifrane — la « petite Suisse » du Maroc, étonnamment alpine. Dernière traversée du Moyen Atlas pour rejoindre Fès. Dîner et nuit en riad de la médina ou hôtel 4★. Note : fin du parcours en 4x4.",
  },
};

export const DAY_OZF_FEZ_MEDINA_RETURN = {
  route_id: "ozf56-fez-medina-return",
  id: "ozf56-d6",
  image: "https://images.unsplash.com/photo-1547234935-80c7145ec969?auto=format&fit=crop&w=2000&q=85",
  accent: "#C16542",
  title: T(
    "Medina de Fez · Madraza · regreso",
    "Fez Medina · Madrasa · return",
    "Médina de Fès · Médersa · retour",
  ),
  body: {
    es: "Visita guiada a pie por la antigua Medina de Fez — una de las más auténticas y mejor conservadas del mundo árabe. Recorreremos sus callejuelas medievales descubriendo centros artesanales, mezquitas, palacios, las famosas tenerías de Chouara y la Madraza Bou Inania. Traslado al aeropuerto de Fez para tomar el vuelo de regreso.",
    en: "Guided walking tour of the Fez Medina — one of the most authentic and best-preserved in the Arab world. We thread its medieval alleys, discovering artisan workshops, mosques, palaces, the famous Chouara tanneries and the Bou Inania Madrasa. Transfer to Fez airport for the return flight.",
    fr: "Visite guidée à pied de la médina de Fès — l'une des plus authentiques et les mieux conservées du monde arabe. Nous parcourons ses ruelles médiévales à la découverte d'ateliers d'artisans, mosquées, palais, les célèbres tanneries de Chouara et la Médersa Bou Inania. Transfert à l'aéroport de Fès pour le vol retour.",
  },
};

/* ============================================================
   Program · 5 nights / 6 days · Ouarzazate → Sidi Ali → Fez
============================================================ */

export const PROGRAM_OZF_56 = {
  routeId: "tourOzzSidialiFez56",
  duration_key: "ozf5n6d",
  duration: T("5 noches / 6 días", "5 nights / 6 days", "5 nuits / 6 jours"),
  prices: { low: 1390, mid: 1590, high: 1790, premium: 2090 },
  route: [
    { day: 1, lat: 31.3582, lng: -5.9911, type: "gorge",   name: T("Boumalne Dadès", "Boumalne Dades", "Boumalne Dadès") },
    { day: 2, lat: 31.4373, lng: -4.2330, type: "city",    name: T("Erfoud · Kasbah Xaluca", "Erfoud · Kasbah Xaluca", "Erfoud · Kasbah Xaluca") },
    { day: 3, lat: 31.1257, lng: -3.9789, type: "desert",  name: T("Erg Chebbi · Bivouac", "Erg Chebbi · Bivouac", "Erg Chebbi · Bivouac") },
    { day: 4, lat: 33.0500, lng: -4.9650, type: "lake",    name: T("Aguelmane Sidi Ali", "Aguelmane Sidi Ali", "Aguelmane Sidi Ali") },
    { day: 5, lat: 34.0651, lng: -4.9760, type: "city",    name: T("Fez", "Fez", "Fès") },
    { day: 6, lat: 33.9272, lng: -4.9778, type: "airport", name: T("Fez · Aeropuerto", "Fez · Airport", "Fès · Aéroport") },
  ],
  days: [
    DAY_OZF_OUARZA_AITBEN_DADES,
    DAY_OZF_DADES_TODRA_ERFOUD,
    DAY_03_ERFOUD_ERG_BIVOUAC,
    DAY_OZF_DUNES_KHAMLIA_SIDIALI,
    DAY_OZF_SIDIALI_IFRANE_FEZ,
    DAY_OZF_FEZ_MEDINA_RETURN,
  ],
  details: {
    includes: {
      es: [
        "Una noche en Boumalne Dades en Hotel Xaluca Dadès 4★ en Media Pensión",
        "Una noche en Erfoud en Kasbah Hotel Xaluca en Media Pensión",
        "Una noche en Erg Chebbi en Bivouac de Luxe en el desierto en Media Pensión",
        "Una noche en Aguelmane Sidi Ali en Hotel Xaluca Spa Aguelmane Sidi Ali en Media Pensión",
        "Una noche en Fez en Riad en la Medina o Hotel 4★ en Media Pensión",
        "Comida en Hotel Xaluca Spa Aguelmane Sidi Ali",
        "Picnic en el desierto",
        "Excursión en dromedario por el Erg Chebbi",
        "Vehículo 4x4 con chófer del día 1 al día 5 del itinerario",
        "Visita con guía local en Fez",
        "Visita a Aït Ben Haddou y a la Madraza de Fez",
        "Transfers desde y hacia aeropuertos · Combustible · Seguro de asistencia en viaje",
      ],
      en: [
        "One night in Boumalne Dades at Hotel Xaluca Dades 4★ · half board",
        "One night in Erfoud at Kasbah Hotel Xaluca · half board",
        "One night at the Bivouac de Luxe in the Erg Chebbi · half board",
        "One night at Aguelmane Sidi Ali (Hotel Xaluca Spa) · half board",
        "One night in Fez at a Medina riad or 4★ hotel · half board",
        "Lunch at Hotel Xaluca Spa Aguelmane Sidi Ali",
        "Picnic lunch in the desert",
        "Camel ride in the Erg Chebbi",
        "4x4 with driver from day 1 to day 5",
        "Local guided tour in Fez",
        "Visit to Aït Ben Haddou and the Fez Madrasa",
        "Airport transfers · Fuel · Travel assistance insurance",
      ],
      fr: [
        "Une nuit à Boumalne Dadès à l'Hôtel Xaluca Dadès 4★ · demi-pension",
        "Une nuit à Erfoud à la Kasbah Hôtel Xaluca · demi-pension",
        "Une nuit au Bivouac de Luxe dans l'Erg Chebbi · demi-pension",
        "Une nuit à Aguelmane Sidi Ali (Hôtel Xaluca Spa) · demi-pension",
        "Une nuit à Fès en riad de la médina ou hôtel 4★ · demi-pension",
        "Déjeuner à l'Hôtel Xaluca Spa Aguelmane Sidi Ali",
        "Pique-nique au désert",
        "Balade à dromadaire dans l'Erg Chebbi",
        "4x4 avec chauffeur du jour 1 au jour 5",
        "Guide local à Fès",
        "Visite d'Aït Ben Haddou et de la Médersa de Fès",
        "Transferts aéroports · Carburant · Assistance voyage",
      ],
    },
    excludes: {
      es: [
        "Las bebidas",
        "Las comidas a mediodía excepto las detalladas",
        "Otros extras personales (quads, masajes, tratamientos de spa…)",
        "El vuelo (salvo que se indique lo contrario)",
        "Suplemento opcional para seguro de cancelación · 45 € por persona para viajes de hasta 9 días",
      ],
      en: [
        "Drinks",
        "Lunches except those listed",
        "Personal extras (quads, massages, spa treatments…)",
        "Flights (unless otherwise stated)",
        "Optional cancellation insurance · €45 per person for trips up to 9 days",
      ],
      fr: [
        "Boissons",
        "Déjeuners sauf ceux indiqués",
        "Extras personnels (quads, massages, spa…)",
        "Le vol (sauf mention contraire)",
        "Assurance annulation en option · 45 € par personne pour les voyages jusqu'à 9 jours",
      ],
    },
    notes: {
      es: [
        "Opciones de vuelos: Royal Air Maroc, Vueling, Air Arabia, Ryanair.",
        "Las tarifas se calculan según la ocupación del 4x4. El coste se divide entre los ocupantes.",
        "Tarifas basadas en habitaciones dobles/triples. Suplemento individual: 310 €.",
        "Descuento niños (3-11 años) compartiendo con dos adultos: 335 € temporada baja · 350 € temporada alta.",
        "En temporada alta, los guías de medina pueden compartirse con otros viajeros.",
        "Chóferes hispanohablantes son limitados — reservar con antelación.",
        "Pasaporte vigente con un mínimo de 6 meses desde la fecha de regreso.",
        "Actividades opcionales: Quads 90 € por vehículo (2 horas).",
      ],
      en: [
        "Flight options: Royal Air Maroc, Vueling, Air Arabia, Ryanair.",
        "Rates depend on 4x4 occupancy. Cost is split between passengers.",
        "Rates based on double/triple rooms. Single supplement: €310.",
        "Children discount (3-11) sharing with two adults: €335 low season · €350 high season.",
        "In high season medina guides may be shared with other travellers.",
        "Spanish-speaking drivers are limited — book early.",
        "Valid passport required with at least 6 months remaining from the return date.",
        "Optional activities: Quads €90 per vehicle (2-hour circuit).",
      ],
      fr: [
        "Options de vols : Royal Air Maroc, Vueling, Air Arabia, Ryanair.",
        "Tarifs selon l'occupation du 4x4. Le coût est partagé entre les occupants.",
        "Tarifs base chambre double/triple. Supplément single : 310 €.",
        "Remise enfants (3-11 ans) partageant avec 2 adultes : 335 € basse · 350 € haute.",
        "En haute saison, les guides de médina peuvent être partagés.",
        "Chauffeurs hispanophones limités — réserver tôt.",
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
        "El seguro de cancelación no es reembolsable.",
      ],
      en: [
        "Compulsory booking form. Payment by bank transfer or Visa.",
        "Booking: 30% of the total at confirmation.",
        "Final payment: 70% balance up to 30 days before departure.",
        "If the chosen flight requires immediate ticketing: 100% of the flight + 30% of land services at booking.",
        "Cancellation 45 days before departure: 30% of the total.",
        "Cancellation 21 days before departure: 100% of the total.",
        "Fixed €50 per booking management fee.",
        "Cancellation insurance is non-refundable.",
      ],
      fr: [
        "Fiche d'inscription obligatoire. Paiement par virement bancaire ou Visa.",
        "Réservation : 30 % du total à la confirmation.",
        "Paiement final : solde de 70 % jusqu'à 30 jours avant le départ.",
        "Si le vol exige une émission immédiate : 100 % du vol + 30 % des services terrestres à la réservation.",
        "Annulation 45 jours avant : 30 % du total.",
        "Annulation 21 jours avant : 100 % du total.",
        "Pénalité fixe de 50 € par réservation pour frais de gestion.",
        "L'assurance annulation n'est pas remboursable.",
      ],
    },
  },
};

export default PROGRAM_OZF_56;
