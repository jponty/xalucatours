// Desert Escape · 3 nights / 4 days · Errachidia → Erfoud → Erg Chebbi → Errachidia
const T = (es, en, fr) => ({ es, en, fr });

const DAY_01 = {
  route_id: "desierto34-arrival-erfoud",
  id: "desierto34-d1",
  image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=2000&q=85",
  accent: "#C16542",
  title: T(
    "Llegada a Errachidia · traslado a Erfoud",
    "Arrival in Errachidia · transfer to Erfoud",
    "Arrivée à Errachidia · transfert à Erfoud",
  ),
  body: {
    es: "Salida desde el aeropuerto de origen con destino Casablanca, donde dependiendo de la época del año puede existir diferencia horaria. Conexión con el vuelo Casablanca–Errachidia. Llegada, trámites de pasaporte y recogida de equipajes. Traslado hacia Erfoud, conocida como «la puerta del desierto», situada aproximadamente a 70 km del aeropuerto. Cena y alojamiento en la Kasbah Hotel Xaluca, considerada una de las construcciones hoteleras más singulares de Marruecos.",
    en: "Departure from your home airport bound for Casablanca (time difference depending on the season). Connection to Errachidia. Arrival, passport control and baggage collection. Transfer to Erfoud, known as «the gate of the desert», about 70 km from the airport. Dinner and overnight at Kasbah Hotel Xaluca — one of the most singular hotel buildings in Morocco.",
    fr: "Départ depuis votre aéroport d'origine pour Casablanca (décalage horaire possible selon la saison). Correspondance Casablanca–Errachidia. Arrivée, contrôle des passeports et bagages. Transfert vers Erfoud, « porte du désert », à environ 70 km de l'aéroport. Dîner et nuit à la Kasbah Hôtel Xaluca — l'une des constructions hôtelières les plus singulières du Maroc.",
  },
  chronologySummary: T(
    "Llegada a Errachidia y traslado hacia Erfoud, la puerta del desierto, para instalarse y cenar en la singular Kasbah Hotel Xaluca.",
    "Arrival in Errachidia and transfer to Erfoud, the gateway to the desert, to settle in and dine at the distinctive Kasbah Hotel Xaluca.",
    "Arrivée à Errachidia et transfert vers Erfoud, porte du désert, pour s’installer et dîner à la singulière Kasbah Hôtel Xaluca.",
  ),
  culture: [
    {
      title: T("Kasbah Hotel Xaluca", "Kasbah Hotel Xaluca", "Kasbah Hôtel Xaluca"),
      body: T(
        "Un hotel-kasbah único en Marruecos: arquitectura de adobe contemporánea, patios árabes, hammam tradicional y vistas al horizonte sahariano.",
        "A one-of-a-kind kasbah hotel: contemporary adobe architecture, Arab patios, traditional hammam and Saharan-horizon views.",
        "Un hôtel-kasbah unique au Maroc : architecture en pisé contemporaine, patios arabes, hammam traditionnel et horizon saharien.",
      ),
    },
  ],
};

const DAY_02 = {
  route_id: "desert-bivouac",
  id: "desierto34-d2",
  image: "https://images.unsplash.com/photo-1489493585363-d69421e0edd3?auto=format&fit=crop&w=2000&q=85",
  accent: "#D97742",
  title: T(
    "Día de desierto total · Erg Chebbi · bivouac",
    "Total desert day · Erg Chebbi · bivouac",
    "Journée désert total · Erg Chebbi · bivouac",
  ),
  body: {
    es: "Hoy viviremos una auténtica jornada de desierto. Recorreremos una de las pistas utilizadas antiguamente por el Rally Dakar, atravesando poblados y asentamientos nómadas. Visitaremos las canteras de fósiles marinos, con más de 360 millones de años de antigüedad, y disfrutaremos de un picnic en un oasis. Continuaremos hacia el Gran Erg Chebbi, un impresionante mar de dunas de arena fina y dorada. Allí cambiaremos el 4x4 por dromedarios para adentrarnos lentamente en el corazón del desierto mientras contemplamos una puesta de sol inolvidable. Llegada al campamento de lujo del desierto, donde nos alojaremos en haimas tradicionales al estilo nómada. Cena y alojamiento en bivouac de lujo bajo las estrellas.",
    en: "Today we live an authentic day of total desert. We drive an old Dakar Rally track, crossing villages and nomad settlements. Stop at the marine fossil quarries (over 360 million years old) and picnic in an oasis. We continue to the great Erg Chebbi, an impressive sea of fine, golden dunes. We swap the 4x4 for camels to enter the heart of the desert at the slow pace of a caravan, watching an unforgettable sunset. Arrival at the luxury desert camp — traditional Berber tents like those used by nomads. Dinner and overnight under the stars.",
    fr: "Aujourd'hui, journée désert total. Nous parcourons une ancienne piste du Rallye Dakar, à la rencontre des villages et nomades. Arrêt aux carrières de fossiles marins (plus de 360 millions d'années) et pique-nique dans une oasis. Poursuite vers le grand Erg Chebbi, mer impressionnante de dunes au sable fin et doré. Nous échangeons le 4x4 contre des dromadaires pour entrer au cœur du désert au pas de la caravane et admirer un coucher de soleil inoubliable. Arrivée au camp de luxe — tentes berbères traditionnelles. Dîner et nuit sous les étoiles.",
  },
  chronologySummary: T(
    "Pistas del antiguo Dakar, fósiles y picnic en un oasis antes de alcanzar Erg Chebbi en dromedario y dormir bajo las estrellas.",
    "Old Dakar tracks, fossils and an oasis picnic before reaching Erg Chebbi by camel and sleeping beneath the desert stars.",
    "Anciennes pistes du Dakar, fossiles et pique-nique dans une oasis avant de rejoindre l’Erg Chebbi à dos de dromadaire et dormir sous les étoiles.",
  ),
  culture: [
    {
      title: T("Fósiles marinos de 360 millones de años", "360-million-year-old marine fossils", "Fossiles marins de 360 millions d'années"),
      body: T(
        "El sur de Marruecos fue un mar tropical en el Devónico. Las canteras de Erfoud guardan trilobites, ammonites y ortocerátidos exportados a museos de todo el mundo.",
        "Southern Morocco was a tropical sea during the Devonian. Erfoud's quarries hold trilobites, ammonites and orthoceratids exported to museums worldwide.",
        "Le sud du Maroc était une mer tropicale au Dévonien.",
      ),
    },
    {
      title: T("Erg Chebbi · 150 m de dunas", "Erg Chebbi · 150 m dunes", "Erg Chebbi · 150 m de dunes"),
      body: T(
        "El sistema de dunas de arena más alto de Marruecos, esculpido por el viento sahariano durante miles de años.",
        "Morocco's highest dune system, sculpted by the Saharan wind over thousands of years.",
        "Le plus haut système de dunes du Maroc, sculpté par le vent saharien.",
      ),
    },
  ],
};

const DAY_03 = {
  route_id: "khamlia-rissani",
  id: "desierto34-d3",
  image: "https://images.unsplash.com/photo-1597212618440-806262de4f6b?auto=format&fit=crop&w=2000&q=85",
  accent: "#A07042",
  title: T(
    "Amanecer en las dunas · Khamlia · Rissani · relax",
    "Sunrise in the dunes · Khamlia · Rissani · relax",
    "Lever du soleil dans les dunes · Khamlia · Rissani · détente",
  ),
  body: {
    es: "Recomendamos madrugar para subir a lo alto de las dunas y contemplar el amanecer sobre el Sáhara. Desayuno beduino y salida para rodear el Erg Chebbi hasta llegar al poblado abandonado de Merdani. Continuación hacia Khamlia, pueblo de origen sudanés conocido por su música Gnawa — sus habitantes nos recibirán con danzas tradicionales y té a la menta. Más tarde visitaremos Rissani, uno de los mercados más auténticos del sur de Marruecos, donde todavía se abastecen las tribus y nómadas del desierto; resulta especialmente curioso su tradicional «parking» de burros. Posteriormente subiremos a un mirador natural para despedirnos del desierto con una espectacular panorámica. Comida en la auténtica «Pizzeria Des Dunes» de Erfoud. Regreso a la Kasbah Hotel Xaluca y tarde libre para relajarse: piscina climatizada, jacuzzi, tenis, minigolf o, opcionalmente, hammam, masajes y excursiones en quad por las dunas cercanas al hotel. Cena y alojamiento en la Kasbah Hotel Xaluca.",
    en: "We recommend an early walk to the top of the dunes for the sunrise over the Sahara. Bedouin breakfast and 4x4 loop around the Erg Chebbi to the abandoned village of Merdani. Continuation to Khamlia, a Sudanese-origin hamlet known for its Gnawa music — locals welcome us with traditional dances and mint tea. Later, Rissani: one of southern Morocco's most authentic markets where desert tribes and nomads still stock up, with its curious «donkey parking». Then drive up to a natural viewpoint to farewell the desert with a spectacular panorama. Lunch at the authentic «Pizzeria Des Dunes» in Erfoud. Back to Kasbah Hotel Xaluca, free afternoon: heated pool, jacuzzi, tennis, mini-golf, optional hammam, massages and optional quad rides in the nearby dunes. Dinner and overnight at Kasbah Hotel Xaluca.",
    fr: "Nous recommandons une marche matinale au sommet des dunes pour le lever du soleil sur le Sahara. Petit-déjeuner bédouin et départ en 4x4 pour contourner l'Erg Chebbi jusqu'au village abandonné de Merdani. Continuation vers Khamlia, hameau d'origine soudanaise connu pour sa musique Gnawa — accueil avec danses et thé à la menthe. Plus tard, Rissani : l'un des marchés les plus authentiques du sud où s'approvisionnent encore les tribus et nomades du désert — son « parking d'ânes » est particulièrement marquant. Montée à un mirador naturel pour saluer le désert. Déjeuner à l'authentique « Pizzeria Des Dunes » d'Erfoud. Retour à la Kasbah Hôtel Xaluca, après-midi libre : piscine chauffée, jacuzzi, tennis, mini-golf, hammam, massages et quads en option. Dîner et nuit à la Kasbah Hôtel Xaluca.",
  },
  chronologySummary: T(
    "Amanecer en las dunas, música Gnawa en Khamlia y mercado de Rissani antes de regresar a Erfoud para una tarde de descanso.",
    "Sunrise in the dunes, Gnawa music in Khamlia and Rissani market before returning to Erfoud for a relaxing afternoon.",
    "Lever du soleil sur les dunes, musique Gnawa à Khamlia et marché de Rissani avant de revenir à Erfoud pour un après-midi de détente.",
  ),
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
      title: T("Música Gnawa · Patrimonio UNESCO", "Gnawa music · UNESCO heritage", "Musique Gnawa · patrimoine UNESCO"),
      body: T(
        "La música Gnawa de Khamlia es Patrimonio Cultural Inmaterial UNESCO. Sus ritmos hipnóticos, krakebs metálicos y tambores hablan del legado africano del sur marroquí.",
        "Khamlia's Gnawa music is UNESCO Intangible Heritage. Its hypnotic rhythms, metal krakebs and drums speak to southern Morocco's African legacy.",
        "La musique Gnawa de Khamlia est Patrimoine Culturel Immatériel UNESCO.",
      ),
    },
  ],
};

const DAY_04 = {
  route_id: "desierto34-ziz-return",
  id: "desierto34-d4",
  image: "https://images.unsplash.com/photo-1547234935-80c7145ec969?auto=format&fit=crop&w=2000&q=85",
  accent: "#5C5248",
  title: T(
    "Valle del Ziz · regreso desde Errachidia",
    "Ziz Valley · return from Errachidia",
    "Vallée du Ziz · retour depuis Errachidia",
  ),
  body: {
    es: "Traslado al aeropuerto de Errachidia para tomar el vuelo de regreso. Durante el trayecto realizaremos una parada en el mirador del Valle del Ziz, uno de los oasis más impresionantes de Marruecos, con millones de palmeras extendiéndose a lo largo del valle. Vuelo Errachidia–Casablanca y conexión con el vuelo de regreso al punto de origen.",
    en: "Transfer to Errachidia airport for the return flight. On the way we stop at the Ziz Valley viewpoint — one of Morocco's most impressive oases, with millions of palm trees stretching along the valley. Flight Errachidia–Casablanca and connection to the return flight.",
    fr: "Transfert à l'aéroport d'Errachidia pour le vol retour. En chemin, arrêt au mirador de la vallée du Ziz — l'une des plus impressionnantes oasis du Maroc, avec des millions de palmiers s'étendant le long de la vallée. Vol Errachidia–Casablanca et correspondance retour.",
  },
  chronologySummary: T(
    "Despedida del sur con una panorámica sobre el inmenso palmeral del Valle del Ziz antes del traslado al aeropuerto de Errachidia.",
    "Farewell to the south with a panorama over the vast Ziz Valley palm grove before transferring to Errachidia airport.",
    "Adieux au sud avec une vue panoramique sur l’immense palmeraie de la vallée du Ziz avant le transfert à l’aéroport d’Errachidia.",
  ),
  culture: [
    {
      title: T("Valle del Ziz · 280 km de oasis", "Ziz Valley · 280 km of oasis", "Vallée du Ziz · 280 km d'oasis"),
      body: T(
        "El río Ziz dibuja un oasis lineal que recorre el sur de Marruecos durante 280 km, sosteniendo más de diez millones de palmeras.",
        "The Ziz river carves a linear oasis running 280 km through southern Morocco, sustaining more than 10 million date palms.",
        "La rivière Ziz dessine une oasis linéaire de 280 km au sud du Maroc, soutenant plus de 10 millions de palmiers.",
      ),
    },
  ],
};

export const PROGRAM_DESIERTO_34 = {
  routeId: "tourEscapadaDesierto34",
  duration_key: "des3n4d",
  duration: T("3 noches / 4 días", "3 nights / 4 days", "3 nuits / 4 jours"),
  prices: { low: 790, mid: 990, high: 1190, premium: 1390 },
  route: [
    { day: 1, lat: 31.9479, lng: -4.4078, type: "airport", name: T("Errachidia · Aeropuerto", "Errachidia · Airport", "Errachidia · Aéroport") },
    { day: 1, lat: 31.4373, lng: -4.2330, type: "city",    name: T("Erfoud · Kasbah Xaluca", "Erfoud · Kasbah Xaluca", "Erfoud · Kasbah Xaluca") },
    { day: 2, lat: 31.1257, lng: -3.9789, type: "desert",  name: T("Erg Chebbi · Bivouac", "Erg Chebbi · Bivouac", "Erg Chebbi · Bivouac") },
    { day: 3, lat: 31.1010, lng: -4.0030, type: "market",  name: T("Khamlia · Rissani · Kasbah Xaluca", "Khamlia · Rissani · Kasbah Xaluca", "Khamlia · Rissani · Kasbah Xaluca") },
    { day: 4, lat: 32.0850, lng: -4.3500, type: "gorge",   name: T("Valle del Ziz", "Ziz Valley", "Vallée du Ziz") },
    { day: 4, lat: 31.9479, lng: -4.4078, type: "airport", name: T("Errachidia · Regreso", "Errachidia · Return", "Errachidia · Retour") },
  ],
  days: [DAY_01, DAY_02, DAY_03, DAY_04],
  details: {
    includes: {
      es: [
        "Dos noches en Erfoud en Kasbah Hotel Xaluca · Media Pensión",
        "Una noche en bivouac de lujo en Erg Chebbi · Media Pensión",
        "Picnic en el desierto durante el día 2",
        "Comida en «Pizzeria Des Dunes» de Erfoud durante el día 3",
        "Excursión en dromedario",
        "Vehículo 4x4 con chófer durante todo el recorrido",
        "Transfers de aeropuerto",
        "Combustible del vehículo",
        "Seguro de asistencia en viaje",
      ],
      en: [
        "Two nights in Erfoud at Kasbah Hotel Xaluca · half board",
        "One night in luxury bivouac in the Erg Chebbi · half board",
        "Picnic in the desert on day 2",
        "Lunch at «Pizzeria Des Dunes» in Erfoud on day 3",
        "Camel ride",
        "4x4 with driver throughout the route",
        "Airport transfers",
        "Fuel",
        "Travel assistance insurance",
      ],
      fr: [
        "Deux nuits à Erfoud à la Kasbah Hôtel Xaluca · demi-pension",
        "Une nuit en bivouac de luxe dans l'Erg Chebbi · demi-pension",
        "Pique-nique au désert le jour 2",
        "Déjeuner à la « Pizzeria Des Dunes » d'Erfoud le jour 3",
        "Balade à dromadaire",
        "4x4 avec chauffeur sur tout l'itinéraire",
        "Transferts aéroport",
        "Carburant",
        "Assistance voyage",
      ],
    },
    excludes: {
      es: [
        "Bebidas",
        "Comidas del mediodía de los días 1 y 4",
        "Extras personales como quads, spa o masajes",
        "Vuelos internacionales",
        "Suplemento para añadir seguro de cancelación · 30 € por persona para viajes de hasta 10 días",
      ],
      en: [
        "Drinks",
        "Lunches on days 1 and 4",
        "Personal extras (quads, spa, massages)",
        "International flights",
        "Optional cancellation insurance · €30 per person for trips of up to 10 days",
      ],
      fr: [
        "Boissons",
        "Déjeuners des jours 1 et 4",
        "Extras personnels (quads, spa, massages)",
        "Vols internationaux",
        "Assurance annulation en option · 30 € par personne pour les voyages jusqu'à 10 jours",
      ],
    },
    notes: {
      es: [
        "Opciones de vuelos: Royal Air Maroc vía Casablanca o low-cost (Vueling, Air Arabia, Ryanair).",
        "Los precios se calculan según la ocupación de los vehículos 4x4. El coste se reparte entre los ocupantes.",
        "Tarifas basadas en habitaciones dobles y triples.",
        "Suplemento habitación individual: 175 €.",
        "Descuento niños (3-11 años) compartiendo con dos adultos: 185 € temporada baja · 195 € temporada alta.",
        "Los chóferes hispanohablantes son limitados — especialmente en temporada alta.",
        "Pasaporte obligatorio con vigencia mínima de 3 meses desde la fecha de regreso.",
        "Excursión opcional en quad: 70 € por vehículo (circuito de 1 hora).",
        "Spa, hammam y masajes disponibles bajo reserva en el hotel.",
        "Para más información sobre alojamientos y servicios: xaluca.com",
      ],
      en: [
        "Flight options: Royal Air Maroc via Casablanca or low-cost (Vueling, Air Arabia, Ryanair).",
        "Rates depend on 4x4 occupancy. Cost is split between passengers.",
        "Rates based on double and triple rooms.",
        "Single room supplement: €175.",
        "Children discount (3-11) sharing with two adults: €185 low season · €195 high season.",
        "Spanish-speaking drivers are limited — especially in high season.",
        "Valid passport required with at least 3 months remaining from the return date.",
        "Optional quads: €70 per vehicle (1-hour circuit).",
        "Spa, hammam and massages available on request at the hotel.",
        "Accommodation and services details at xaluca.com",
      ],
      fr: [
        "Options de vol : Royal Air Maroc via Casablanca ou low-cost (Vueling, Air Arabia, Ryanair).",
        "Tarifs selon l'occupation du 4x4. Le coût est partagé entre les occupants.",
        "Tarifs base chambre double et triple.",
        "Supplément single : 175 €.",
        "Réduction enfants (3-11 ans) partageant avec 2 adultes : 185 € basse saison · 195 € haute saison.",
        "Chauffeurs hispanophones limités — surtout en haute saison.",
        "Passeport valable au moins 3 mois après le retour.",
        "Quads en option : 70 € par véhicule (1 h).",
        "Spa, hammam et massages disponibles à l'hôtel.",
        "Hébergements et services sur xaluca.com",
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
        "Estas condiciones aplican sólo a los servicios de tierra. Los vuelos se rigen por las condiciones de cada compañía aérea. Los seguros no son reembolsables.",
      ],
      en: [
        "Booking: 30% at confirmation.",
        "Final payment: 70% balance up to 30 days before departure.",
        "If the chosen flight requires immediate ticketing: 100% of the flight + 30% of land services at booking.",
        "Cancellation 45 days before departure: 30% of the total.",
        "Cancellation 21 days before departure: 100% of the total.",
        "Fixed €50 per booking management fee.",
        "Conditions apply to land services only. Insurances are non-refundable.",
      ],
      fr: [
        "Réservation : 30 % à la confirmation.",
        "Paiement final : solde de 70 % jusqu'à 30 jours avant le départ.",
        "Si le vol exige une émission immédiate : 100 % du billet + 30 % des services terrestres à la réservation.",
        "Annulation 45 jours avant : 30 % du total.",
        "Annulation 21 jours avant : 100 % du total.",
        "Pénalité fixe de 50 € par réservation pour frais de gestion.",
        "Conditions applicables aux services terrestres uniquement. Les assurances ne sont pas remboursables.",
      ],
    },
  },
};

export default PROGRAM_DESIERTO_34;
