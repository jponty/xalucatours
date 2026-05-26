// Atlas Escape · 3 nights / 4 days · Ouarzazate → M'Goun → N'Kob → Drâa → Ouarzazate
const T = (es, en, fr) => ({ es, en, fr });

const DAY_01 = {
  route_id: "atlas34-arrival-dades",
  id: "atlas34-d1",
  image: "https://images.unsplash.com/photo-1570133435536-7ececf000ef6?auto=format&fit=crop&w=2000&q=85",
  accent: "#5A6B4F",
  title: T(
    "Llegada a Ouarzazate · traslado al Valle del Dadès",
    "Arrival in Ouarzazate · transfer to the Dades Valley",
    "Arrivée à Ouarzazate · transfert vers la vallée du Dadès",
  ),
  body: {
    es: "Salida desde el aeropuerto de origen con destino Casablanca. Dependiendo de la época del año puede existir diferencia horaria. Conexión con el vuelo Casablanca–Ouarzazate. Llegada, trámites de pasaporte y recogida de equipajes. Traslado hacia Boumalne Dadès, localidad situada a 1.612 m de altitud en plena cordillera del Alto Atlas (aprox. 110 km). Llegada y alojamiento en el Hotel Xaluca Dadès.",
    en: "Departure from your home airport bound for Casablanca. Time difference depending on the season. Connection to Ouarzazate. Arrival, passport control and baggage collection. Transfer to Boumalne Dades, 1,612 m above sea level in the heart of the High Atlas (approx. 110 km). Check-in and overnight at Hotel Xaluca Dades.",
    fr: "Départ depuis votre aéroport d'origine pour Casablanca (décalage horaire possible selon la saison). Correspondance Casablanca–Ouarzazate. Arrivée, contrôle des passeports et récupération des bagages. Transfert vers Boumalne Dadès, à 1 612 m d'altitude au cœur du Haut Atlas (env. 110 km). Installation et nuit à l'Hôtel Xaluca Dadès.",
  },
  culture: [
    {
      title: T("Valle de los Pájaros", "Valley of the Birds", "Vallée des Oiseaux"),
      body: T(
        "Boumalne Dadès es santuario de más de 130 especies de aves migratorias — entre ellas la rara busarda mora y el bulbul norteafricano.",
        "Boumalne Dades shelters over 130 species of migratory birds — including the long-legged buzzard and the Moroccan bulbul.",
        "Boumalne Dadès accueille plus de 130 espèces d'oiseaux migrateurs.",
      ),
    },
  ],
};

const DAY_02 = {
  route_id: "atlas34-mgoun",
  id: "atlas34-d2",
  image: "https://images.unsplash.com/photo-1542401886-65d6c61db217?auto=format&fit=crop&w=2000&q=85",
  accent: "#A07042",
  title: T(
    "Ruta 4x4 por el Alto Atlas Central · M'Goun",
    "4x4 route through the Central High Atlas · M'Goun",
    "Route 4x4 dans le Haut Atlas Central · M'Goun",
  ),
  body: {
    es: "Hoy nos adentraremos en vehículo 4x4 por pistas del Alto Atlas Central acompañados por chófer local. Descubriremos paisajes espectaculares y poblados bereberes como Boutaghrar y Amskar, donde la vida mantiene todavía un ritmo tradicional. Durante la jornada recorreremos montañas, valles y cañones, además de visitar las grutas donde aún habitan familias nómadas. La ruta continúa por las Gargantas del M'Goun, uno de los entornos naturales más impresionantes de la región. La comida será en ruta, en una tradicional «Gîte d'Étape». Cena y alojamiento en el Hotel Xaluca Dadès.",
    en: "Today we head into the Central High Atlas on 4x4 tracks with a local driver. We discover spectacular landscapes and Berber villages such as Boutaghrar and Amskar, where life still keeps its traditional rhythm. Mountains, valleys and canyons unfold along the day, and we visit the caves where nomadic families still live. The route continues through the M'Goun Gorges — one of the most impressive natural settings in the region. Lunch in route at a traditional «Gîte d'Étape». Dinner and overnight at Hotel Xaluca Dades.",
    fr: "Aujourd'hui, nous nous enfonçons en 4x4 dans les pistes du Haut Atlas Central avec un chauffeur local. Nous découvrons des paysages spectaculaires et les villages berbères tels que Boutaghrar et Amskar, où la vie conserve un rythme traditionnel. La journée déroule montagnes, vallées et canyons, et nous visitons les grottes où vivent encore des familles nomades. La route continue par les Gorges du M'Goun — l'un des cadres naturels les plus impressionnants de la région. Déjeuner en route dans une « Gîte d'Étape » traditionnelle. Dîner et nuit à l'Hôtel Xaluca Dadès.",
  },
  culture: [
    {
      title: T("M'Goun · 4.071 m", "M'Goun · 4,071 m", "M'Goun · 4 071 m"),
      body: T(
        "Tercer pico más alto de Marruecos. Sus gargantas son uno de los pocos lugares donde aún se cruza el río a pie entre paredes verticales.",
        "Morocco's third-highest peak. Its gorges are one of the few places where the river is still crossed on foot between vertical walls.",
        "Troisième plus haut sommet du Maroc.",
      ),
    },
    {
      title: T("Boutaghrar y Amskar", "Boutaghrar & Amskar", "Boutaghrar et Amskar"),
      body: T(
        "Conservan la arquitectura tradicional de adobe y los oficios artesanales bereberes — agricultura, tejido y trashumancia.",
        "Preserve traditional adobe architecture and Berber craft trades — farming, weaving and transhumance.",
        "Conservent l'architecture en pisé et les métiers berbères.",
      ),
    },
  ],
};

const DAY_03 = {
  route_id: "atlas34-antiatlas-draa",
  id: "atlas34-d3",
  image: "https://images.unsplash.com/photo-1597212618440-806262de4f6b?auto=format&fit=crop&w=2000&q=85",
  accent: "#D97742",
  title: T(
    "Anti-Atlas · N'Kob · Valle del Drâa · Ouarzazate",
    "Anti-Atlas · N'Kob · Drâa Valley · Ouarzazate",
    "Anti-Atlas · N'Kob · Vallée du Drâa · Ouarzazate",
  ),
  body: {
    es: "Salida hacia el sur atravesando el Anti-Atlas, conocido también como «el pequeño Atlas». Durante el recorrido podremos contemplar las sorprendentes formaciones del Djebel Saghro, macizo montañoso que alcanza los 2.712 m en su punto más alto. El paisaje árido y de aspecto lunar nos conducirá hasta N'Kob, cuna de los Aït Atta, una de las tribus ancestrales más importantes del sur de Marruecos. Disfrutaremos del contraste entre el color ocre de las kasbahs de adobe y el verde intenso de los palmerales antes de adentrarnos en el Valle del Drâa, que recorreremos en dirección Ouarzazate. Alojamiento y cena en riad dentro de la medina u hotel de categoría 4★.",
    en: "We head south across the Anti-Atlas, also known as «the little Atlas». Along the way we admire the surprising formations of the Djebel Saghro, a massif that reaches 2,712 m at its highest point. The arid, lunar landscape leads us to N'Kob, cradle of the Aït Atta — one of the most important ancestral tribes of southern Morocco. We enjoy the contrast between the ochre adobe kasbahs and the intense green of the palm groves before entering the Drâa Valley, which we drive towards Ouarzazate. Dinner and overnight in a medina riad or 4★ hotel.",
    fr: "Départ vers le sud à travers l'Anti-Atlas, aussi appelé « le petit Atlas ». En chemin, nous admirons les surprenantes formations du Djebel Saghro, massif culminant à 2 712 m. Le paysage aride et lunaire nous conduit à N'Kob, berceau des Aït Atta — l'une des plus importantes tribus ancestrales du sud du Maroc. Nous savourons le contraste entre l'ocre des kasbahs en pisé et le vert intense des palmeraies avant d'entrer dans la vallée du Drâa, que nous parcourons vers Ouarzazate. Dîner et nuit en riad dans la médina ou hôtel 4★.",
  },
  culture: [
    {
      title: T("Aït Atta · los señores del desierto", "Aït Atta · lords of the desert", "Aït Atta · seigneurs du désert"),
      body: T(
        "Confederación bereber del s.XVI que controló las rutas del oro y la sal entre el Sahara y el Atlas durante siglos. Hoy su capital sigue siendo N'Kob.",
        "16th-century Berber confederation that controlled the gold and salt routes between the Sahara and the Atlas for centuries. Their capital is still N'Kob today.",
        "Confédération berbère du XVIe siècle qui contrôla pendant des siècles les routes de l'or et du sel entre le Sahara et l'Atlas.",
      ),
    },
    {
      title: T("Valle del Drâa · 200 km de oasis", "Drâa Valley · 200 km of oasis", "Vallée du Drâa · 200 km d'oasis"),
      body: T(
        "El palmeral lineal más largo de Marruecos, salpicado de kasbahs de adobe que datan de la dinastía saadí (s.XVI).",
        "Morocco's longest linear palm grove, dotted with adobe kasbahs dating from the Saadi dynasty (16th c.).",
        "La plus longue palmeraie linéaire du Maroc, parsemée de kasbahs en pisé datant des Saadiens (XVIe).",
      ),
    },
  ],
};

const DAY_04 = {
  route_id: "atlas34-return",
  id: "atlas34-d4",
  image: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=2000&q=85",
  accent: "#5C5248",
  title: T("Regreso desde Ouarzazate", "Return from Ouarzazate", "Retour depuis Ouarzazate"),
  body: {
    es: "A la hora acordada, traslado al aeropuerto de Ouarzazate para tomar el vuelo de regreso al punto de origen.",
    en: "At the agreed time, transfer to Ouarzazate airport for the return flight.",
    fr: "À l'heure convenue, transfert à l'aéroport de Ouarzazate pour le vol retour.",
  },
  culture: [],
};

export const PROGRAM_ATLAS_34 = {
  routeId: "tourEscapadaAtlas34",
  duration_key: "atlas3n4d",
  duration: T("3 noches / 4 días", "3 nights / 4 days", "3 nuits / 4 jours"),
  prices: { low: 690, mid: 890, high: 1090, premium: 1290 },
  // Global route — anchor stops per day
  route: [
    { day: 1, lat: 30.9189, lng: -6.8934, type: "airport", name: T("Ouarzazate · Aeropuerto", "Ouarzazate · Airport", "Ouarzazate · Aéroport") },
    { day: 1, lat: 31.3582, lng: -5.9911, type: "city",    name: T("Boumalne Dadès · Hotel Xaluca", "Boumalne Dades · Hotel Xaluca", "Boumalne Dadès · Hôtel Xaluca") },
    { day: 2, lat: 31.4900, lng: -5.7950, type: "gorge",   name: T("Boutaghrar · Amskar · Gargantas del M'Goun", "Boutaghrar · Amskar · M'Goun Gorges", "Boutaghrar · Amskar · Gorges du M'Goun") },
    { day: 3, lat: 30.8770, lng: -5.8580, type: "kasbah",  name: T("N'Kob · Djebel Saghro", "N'Kob · Djebel Saghro", "N'Kob · Djebel Saghro") },
    { day: 3, lat: 30.9189, lng: -6.8934, type: "city",    name: T("Valle del Drâa · Ouarzazate", "Drâa Valley · Ouarzazate", "Vallée du Drâa · Ouarzazate") },
    { day: 4, lat: 30.9389, lng: -6.9094, type: "airport", name: T("Ouarzazate · Aeropuerto · Regreso", "Ouarzazate · Airport · Return", "Ouarzazate · Aéroport · Retour") },
  ],
  days: [DAY_01, DAY_02, DAY_03, DAY_04],
  details: {
    includes: {
      es: [
        "Dos noches en Hotel Xaluca Dadès en régimen de Media Pensión",
        "Una noche en riad en la medina u Hotel 4★ en Ouarzazate en régimen de Media Pensión",
        "Comida en ruta en una «Gîte d'Étape» durante el día 2",
        "Vehículo 4x4 con chófer durante todo el recorrido",
        "Transfers de aeropuerto",
        "Combustible de los vehículos",
        "Seguro de asistencia en viaje",
      ],
      en: [
        "Two nights at Hotel Xaluca Dades · half board",
        "One night in a medina riad or 4★ hotel in Ouarzazate · half board",
        "Mountain lunch in route at a «Gîte d'Étape» on day 2",
        "4x4 with driver throughout the route",
        "Airport transfers",
        "Fuel",
        "Travel assistance insurance",
      ],
      fr: [
        "Deux nuits à l'Hôtel Xaluca Dadès · demi-pension",
        "Une nuit en riad de la médina ou hôtel 4★ à Ouarzazate · demi-pension",
        "Déjeuner en route dans une « Gîte d'Étape » le jour 2",
        "4x4 avec chauffeur sur tout l'itinéraire",
        "Transferts aéroport",
        "Carburant",
        "Assistance voyage",
      ],
    },
    excludes: {
      es: [
        "Bebidas",
        "Comidas del mediodía no especificadas",
        "Extras personales como quads, masajes u otras actividades",
        "Vuelos internacionales",
        "Suplemento para añadir seguro de cancelación · 45 € por persona para viajes de máximo 9 días",
      ],
      en: [
        "Drinks",
        "Lunches not specified",
        "Personal extras (quads, massages, other activities)",
        "International flights",
        "Optional cancellation insurance · €45 per person for trips of up to 9 days",
      ],
      fr: [
        "Boissons",
        "Déjeuners non spécifiés",
        "Extras personnels (quads, massages, autres activités)",
        "Vols internationaux",
        "Assurance annulation en option · 45 € par personne pour les voyages jusqu'à 9 jours",
      ],
    },
    notes: {
      es: [
        "Consultar opciones de vuelos y condiciones.",
        "Los precios están calculados en función de la ocupación de los vehículos 4x4 (capacidad máxima 5 pasajeros + chófer).",
        "Precios basados en habitaciones dobles y triples.",
        "Suplemento habitación individual: 125 €.",
        "Descuento niños (3-11 años) compartiendo con dos adultos: 140 € temporada baja · 150 € temporada alta.",
        "Los chóferes hispanohablantes son limitados en temporada alta.",
        "Los guías titulados están reservados para visitas en medinas, no para las rutas.",
        "Pasaporte obligatorio con vigencia mínima de 6 meses.",
        "Consultar alojamientos y servicios en xaluca.com",
      ],
      en: [
        "Flight options and conditions on request.",
        "Rates depend on 4x4 occupancy (max 5 passengers + driver).",
        "Rates based on double and triple rooms.",
        "Single room supplement: €125.",
        "Children discount (3-11) sharing with two adults: €140 low season · €150 high season.",
        "Spanish-speaking drivers are limited in high season.",
        "Licensed guides are reserved for medina visits, not for the on-road portions.",
        "Valid passport required with at least 6 months remaining.",
        "Accommodation and services details at xaluca.com",
      ],
      fr: [
        "Options de vol et conditions sur demande.",
        "Tarifs selon l'occupation du 4x4 (5 passagers max + chauffeur).",
        "Tarifs base chambre double et triple.",
        "Supplément single : 125 €.",
        "Réduction enfants (3-11 ans) partageant avec 2 adultes : 140 € basse saison · 150 € haute saison.",
        "Chauffeurs hispanophones limités en haute saison.",
        "Guides officiels réservés aux visites des médinas, pas aux trajets.",
        "Passeport valable au moins 6 mois.",
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
        "Estas condiciones aplican sólo a los servicios de tierra. Los vuelos se rigen por las condiciones de cada compañía aérea. El seguro de cancelación no se reembolsa.",
      ],
      en: [
        "Booking: 30% at confirmation.",
        "Final payment: 70% balance up to 30 days before departure.",
        "If the chosen flight requires immediate ticketing: 100% of the flight + 30% of land services at booking.",
        "Cancellation 45 days before departure: 30% of the total.",
        "Cancellation 21 days before departure: 100% of the total.",
        "Fixed €50 per booking management fee.",
        "Conditions apply to land services only. Flights follow each airline's rules. Cancellation insurance is non-refundable.",
      ],
      fr: [
        "Réservation : 30 % à la confirmation.",
        "Paiement final : solde de 70 % jusqu'à 30 jours avant le départ.",
        "Si le vol exige une émission immédiate : 100 % du billet + 30 % des services terrestres à la réservation.",
        "Annulation 45 jours avant : 30 % du total.",
        "Annulation 21 jours avant : 100 % du total.",
        "Pénalité fixe de 50 € par réservation pour frais de gestion.",
        "Conditions applicables aux services terrestres uniquement. L'assurance annulation n'est pas remboursable.",
      ],
    },
  },
};

export default PROGRAM_ATLAS_34;
