// Fez Escape · 2 nights / 3 days · Arrival → Medina UNESCO → Return
const T = (es, en, fr) => ({ es, en, fr });

export const DAY_FEZ_ARRIVAL = {
  route_id: "escfez-arrival",
  id: "escfez-d1",
  image: "https://images.unsplash.com/photo-1597212618440-806262de4f6b?auto=format&fit=crop&w=2000&q=85",
  accent: "#C16542",
  title: T(
    "Llegada a Fez · primera noche en la Medina",
    "Arrival in Fez · first night in the Medina",
    "Arrivée à Fès · première nuit dans la médina",
  ),
  body: {
    es: "Llegada por la tarde-noche al aeropuerto de Fez (puede haber diferencia horaria según la época del año). Tras el control de pasaportes y la recogida del equipaje, encuentro con nuestro transfer y traslado al alojamiento — Hotel 4★ o Riad en la Medina. Cena y alojamiento. Para los más viajeros, recomendamos un primer paseo por las puertas de la Medina al caer la noche, cuando la última llamada a la oración se mezcla con los aromas a comino, azafrán y pan recién hecho.",
    en: "Late afternoon or evening arrival at Fez airport (time difference depending on the season). After passport control and baggage collection, meeting with our transfer and check-in at a 4★ hotel or a Medina riad. Dinner and overnight. For seasoned travellers, we recommend a first stroll along the Medina gates at nightfall, when the last call to prayer mingles with the aroma of cumin, saffron and freshly-baked bread.",
    fr: "Arrivée en fin d'après-midi à l'aéroport de Fès (décalage horaire possible selon la saison). Après le contrôle des passeports et la récupération des bagages, accueil et transfert vers l'hôtel 4★ ou riad de la médina. Dîner et nuit. Pour les voyageurs avertis, nous recommandons une première promenade aux portes de la médina à la tombée du jour, quand le dernier appel à la prière se mêle aux parfums de cumin, de safran et de pain tout juste sorti du four.",
  },
  chronologySummary: T(
    "Llegada a Fez y traslado a la medina, con una primera inmersión nocturna entre puertas históricas, aromas y llamadas a la oración.",
    "Arrival in Fez and transfer to the medina for a first evening immersion among historic gates, aromas and calls to prayer.",
    "Arrivée à Fès et transfert dans la médina pour une première immersion nocturne entre portes historiques, parfums et appels à la prière.",
  ),
  culture: [
    {
      title: T("Fez · capital espiritual de Marruecos", "Fez · spiritual capital of Morocco", "Fès · capitale spirituelle du Maroc"),
      body: T(
        "Fundada en 789 por Idris I, alberga la universidad más antigua del mundo en funcionamiento — la Qaraouiyine (859 d.C.) — y nueve mil callejones intactos desde el siglo IX.",
        "Founded in 789 by Idris I, Fez hosts the world's oldest continuously running university — Al-Qaraouiyine (859 AD) — and nine thousand alleys unchanged since the 9th century.",
        "Fondée en 789 par Idriss Ier, Fès abrite la plus ancienne université au monde en activité — Al-Qaraouiyine (859) — et neuf mille ruelles intactes depuis le IXe siècle.",
      ),
    },
  ],
};

export const DAY_FEZ_MEDINA = {
  route_id: "escfez-medina",
  id: "escfez-d2",
  image: "https://images.unsplash.com/photo-1547234935-80c7145ec969?auto=format&fit=crop&w=2000&q=85",
  accent: "#A07042",
  title: T(
    "Visita guiada por Fez-el Bali · la antigua Medina",
    "Guided tour of Fez-el Bali · the ancient Medina",
    "Visite guidée de Fès-el Bali · l'ancienne médina",
  ),
  body: {
    es: "Hoy nos adentraremos en Fez-el Bali, considerada una de las medinas más auténticas y mejor conservadas del mundo árabe. Acompañados por un guía local, recorreremos a pie sus laberínticas callejuelas medievales — único modo posible de visitarla, ya que la UNESCO prohibió el acceso a vehículos a motor. Entre el bullicio descubriremos centros artesanales, antiguas mezquitas y palacios. Por la tarde profundizaremos en la organización tradicional de los barrios, articulada en torno a la mezquita, la fuente, el horno comunal, los baños (hammam) y la escuela coránica. Visitaremos las famosas tenerías tradicionales — las más antiguas del mundo aún en funcionamiento — y subiremos a un mirador panorámico para contemplar la ciudad iluminada por la última llamada a la oración. Cena y alojamiento en Riad en la Medina u Hotel 4★.",
    en: "Today we enter Fez-el Bali, regarded as one of the most authentic and best-preserved medinas in the Arab world. With a local guide we walk its labyrinthine medieval alleys — the only way to visit it, since UNESCO bans motor traffic inside. Amid the bustle we discover artisan workshops, ancient mosques and palaces. In the afternoon we dig deeper into the traditional fabric of the neighbourhoods, organised around the mosque, the fountain, the communal oven, the hammam and the Qur'anic school. We visit the famous traditional tanneries — the world's oldest still in operation — and climb a panoramic viewpoint to watch the city lit by the last call to prayer. Dinner and overnight in a Medina riad or 4★ hotel.",
    fr: "Aujourd'hui, plongée dans Fès-el Bali, considérée comme l'une des médinas les plus authentiques et les mieux conservées du monde arabe. Avec un guide local, nous parcourons à pied ses ruelles médiévales — seule manière de la visiter, l'UNESCO ayant interdit les véhicules à moteur. Dans l'effervescence, nous découvrons ateliers d'artisans, anciennes mosquées et palais. L'après-midi, nous explorons l'organisation traditionnelle des quartiers, articulés autour de la mosquée, la fontaine, le four communal, le hammam et l'école coranique. Nous visitons les célèbres tanneries traditionnelles — les plus anciennes au monde encore en activité — et montons à un mirador panoramique pour contempler la ville illuminée par le dernier appel à la prière. Dîner et nuit en riad de la médina ou hôtel 4★.",
  },
  chronologySummary: T(
    "Visita guiada por Fez-el Bali entre callejones medievales, talleres artesanos, madrazas y las históricas tenerías de Chouara.",
    "Guided visit through Fez-el Bali among medieval alleys, artisan workshops, madrasas and the historic Chouara tanneries.",
    "Visite guidée de Fès-el Bali entre ruelles médiévales, ateliers d’artisans, médersas et les tanneries historiques de Chouara.",
  ),
  culture: [
    {
      title: T("Patrimonio UNESCO desde 1981", "UNESCO World Heritage since 1981", "Patrimoine UNESCO depuis 1981"),
      body: T(
        "9.000 callejones, 60.000 puertas y un tejido urbano intacto desde el siglo IX — la única gran ciudad medieval del mundo arabe-musulmán que nunca fue rasada ni reconstruida.",
        "9,000 alleys, 60,000 doors and an urban fabric unchanged since the 9th century — the only major Arab-Muslim medieval city never razed nor rebuilt.",
        "9 000 ruelles, 60 000 portes et un tissu urbain intact depuis le IXe siècle.",
      ),
    },
    {
      title: T("Chouara · la curtiduría más antigua del mundo", "Chouara · the world's oldest tannery", "Chouara · la plus ancienne tannerie au monde"),
      body: T(
        "Las tinas multicolor de Chouara funcionan ininterrumpidamente desde el siglo XI, usando las mismas técnicas y los mismos colorantes naturales — índigo, alheña, azafrán y amapola.",
        "Chouara's multicoloured vats have been running uninterruptedly since the 11th century — same techniques, same natural dyes (indigo, henna, saffron and poppy).",
        "Les cuves multicolores de Chouara fonctionnent sans interruption depuis le XIe siècle.",
      ),
    },
    {
      title: T("Madraza Bou Inania · joya meriní", "Bou Inania Madrasa · Marinid jewel", "Médersa Bou Inania · joyau mérinide"),
      body: T(
        "Mandada construir en 1351 por el sultán Abu Inan Faris, es una de las únicas escuelas coránicas históricas abiertas a no musulmanes — un prodigio de estuco, zellige y cedro tallado.",
        "Commissioned in 1351 by Sultan Abu Inan Faris, it is one of the only historic Qur'anic schools open to non-Muslims — a marvel of stucco, zellige and carved cedar.",
        "Commandée en 1351 par le sultan Abu Inan Faris — un prodige de stuc, de zellige et de cèdre sculpté.",
      ),
    },
    {
      title: T("Organización de barrios · la microciudad bereber", "Neighbourhood layout · the Berber micro-city", "Organisation des quartiers · la micro-cité berbère"),
      body: T(
        "Cada barrio gira en torno a cinco pilares: mezquita, fuente, horno comunal, hammam y escuela coránica — un modelo urbano único conservado durante mil años.",
        "Every neighbourhood revolves around five pillars: mosque, fountain, communal oven, hammam and Qur'anic school — a unique urban model preserved for a thousand years.",
        "Chaque quartier s'articule autour de cinq piliers : mosquée, fontaine, four communal, hammam et école coranique.",
      ),
    },
  ],
};

const DAY_03 = {
  route_id: "escfez23-return",
  id: "escfez23-d3",
  image: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=2000&q=85",
  accent: "#5C5248",
  title: T("Tiempo libre · regreso desde Fez", "Free time · return from Fez", "Temps libre · retour depuis Fès"),
  body: {
    es: "Desayuno en el riad y tiempo libre para seguir descubriendo la Medina por cuenta propia — un último paseo para perderse entre zocos, comprar especias o un tagine de barro, o simplemente contemplar a los artesanos. A la hora acordada, traslado al aeropuerto de Fez para tomar el vuelo de regreso.",
    en: "Breakfast at the riad and free time to keep exploring the Medina on your own — one last walk to wander among the souks, buy spices or a clay tagine, or simply watch the artisans at work. At the agreed time, transfer to Fez airport for the return flight.",
    fr: "Petit-déjeuner au riad et temps libre pour continuer à explorer la médina à votre rythme — une dernière promenade pour se perdre dans les souks, acheter des épices ou un tajine en terre cuite, ou observer les artisans. À l'heure convenue, transfert à l'aéroport de Fès pour le vol retour.",
  },
  chronologySummary: T(
    "Tiempo libre para una última mirada a los zocos y artesanos de la medina antes del traslado al aeropuerto de Fez para el regreso.",
    "Free time for one last look at the medina’s souks and artisans before transferring to Fez airport for the journey home.",
    "Temps libre pour un dernier regard sur les souks et artisans de la médina avant le transfert à l’aéroport de Fès pour le retour.",
  ),
};

export const PROGRAM_ESCAPADA_FEZ_23 = {
  routeId: "tourEscapadaFez23",
  duration_key: "fez2n3d",
  duration: T("2 noches / 3 días", "2 nights / 3 days", "2 nuits / 3 jours"),
  prices: { low: 390, mid: 490, high: 590, premium: 690 },
  route: [
    { day: 1, lat: 33.9273, lng: -4.9779, type: "airport", name: T("Fez · Aeropuerto", "Fez · Airport", "Fès · Aéroport") },
    { day: 1, lat: 34.0651, lng: -4.9760, type: "city",    name: T("Fez · Riad en la Medina", "Fez · Medina riad", "Fès · Riad dans la médina") },
    { day: 2, lat: 34.0633, lng: -4.9737, type: "city",    name: T("Fez-el Bali · Medina UNESCO", "Fez-el Bali · UNESCO Medina", "Fès-el Bali · médina UNESCO") },
    { day: 2, lat: 34.0644, lng: -4.9720, type: "market",  name: T("Tenerías de Chouara · mirador panorámico", "Chouara tanneries · panoramic viewpoint", "Tanneries de Chouara · mirador panoramique") },
    { day: 3, lat: 33.9273, lng: -4.9779, type: "airport", name: T("Fez · Aeropuerto · Regreso", "Fez · Airport · Return", "Fès · Aéroport · Retour") },
  ],
  days: [DAY_FEZ_ARRIVAL, DAY_FEZ_MEDINA, DAY_03],
  details: {
    includes: {
      es: [
        "Dos noches en Fez en Riad en la Medina u Hotel 4★ en régimen de Media Pensión",
        "Visita con guía local en Fez",
        "Entrada a la Madraza",
        "Transfers desde y hacia el aeropuerto de Fez",
        "Seguro de asistencia en viaje",
      ],
      en: [
        "Two nights in Fez in a Medina riad or 4★ hotel · half board",
        "Local guided tour in Fez",
        "Madrasa admission",
        "Airport transfers from and to Fez airport",
        "Travel assistance insurance",
      ],
      fr: [
        "Deux nuits à Fès en riad de la médina ou hôtel 4★ · demi-pension",
        "Guide local à Fès",
        "Entrée à la Médersa",
        "Transferts depuis et vers l'aéroport de Fès",
        "Assistance voyage",
      ],
    },
    excludes: {
      es: [
        "Las bebidas",
        "Las comidas a mediodía no detalladas",
        "Visitas o guías no especificados",
        "Otros extras personales (masajes, hammam, etc.)",
        "El vuelo (salvo que se indique lo contrario)",
        "Suplemento opcional para seguro de cancelación · 45 € por persona para viajes de hasta 9 días",
      ],
      en: [
        "Drinks",
        "Lunches not listed",
        "Tours or guides not specified",
        "Personal extras (massages, hammam, etc.)",
        "Flights (unless otherwise stated)",
        "Optional cancellation insurance · €45 per person for trips up to 9 days",
      ],
      fr: [
        "Boissons",
        "Déjeuners non détaillés",
        "Visites ou guides non spécifiés",
        "Extras personnels (massages, hammam, etc.)",
        "Le vol (sauf mention contraire)",
        "Assurance annulation en option · 45 € par personne pour les voyages jusqu'à 9 jours",
      ],
    },
    notes: {
      es: [
        "Opciones de vuelos: Royal Air Maroc vía Casablanca o low-cost como Ryanair o Air Arabia con vuelos directos desde varias ciudades europeas.",
        "Tarifas basadas en habitaciones dobles. Suplemento individual: 65 €.",
        "Descuento niños (3-11 años) compartiendo habitación con dos adultos: 85 €.",
        "En temporada alta, los guías locales podrían compartirse con otros viajeros.",
        "El nombre del riad se confirma tras la reserva.",
        "No se recomienda realizar la visita guiada el viernes (día de oración) — la medina pierde parte de su actividad habitual.",
        "Dependiendo de los vuelos, se pueden añadir excursiones opcionales.",
        "Pasaporte obligatorio con vigencia mínima de 6 meses desde la entrada a Marruecos.",
      ],
      en: [
        "Flight options: Royal Air Maroc via Casablanca, or low-cost airlines such as Ryanair or Air Arabia with direct flights from several European cities.",
        "Rates based on double rooms. Single supplement: €65.",
        "Children discount (3-11) sharing room with two adults: €85.",
        "In high season, local guides may be shared with other travellers.",
        "Riad name is confirmed after booking.",
        "We do not recommend the guided visit on Fridays (prayer day) — the medina loses part of its usual buzz.",
        "Depending on flight times, optional excursions may be added.",
        "Valid passport required with at least 6 months remaining from entry into Morocco.",
      ],
      fr: [
        "Options de vol : Royal Air Maroc via Casablanca, ou compagnies low-cost (Ryanair, Air Arabia) avec vols directs depuis plusieurs villes européennes.",
        "Tarifs base chambre double. Supplément single : 65 €.",
        "Réduction enfants (3-11 ans) partageant avec deux adultes : 85 €.",
        "En haute saison, les guides locaux peuvent être partagés.",
        "Le nom du riad est confirmé après la réservation.",
        "Nous déconseillons la visite guidée le vendredi (jour de prière).",
        "Selon les horaires de vols, des excursions optionnelles peuvent être ajoutées.",
        "Passeport valable au moins 6 mois à l'entrée au Maroc.",
      ],
    },
    terms: {
      es: [
        "Ficha de inscripción obligatoria. Pago por transferencia o Visa.",
        "Reserva: 30% del importe total al confirmar.",
        "Pago final: 70% restante hasta 30 días antes de la salida.",
        "Si el vuelo elegido requiere emisión inmediata: 100% del vuelo + 30% de los servicios de tierra al reservar.",
        "Cancelación 45 días antes de la salida: 30% del importe total.",
        "Cancelación 21 días antes de la salida: 100% del importe total.",
        "Penalización fija de 50 € por reserva en concepto de gastos de gestión.",
        "Estas condiciones aplican sólo a los servicios de tierra. Los vuelos se rigen por las condiciones de cada compañía aérea. El seguro de cancelación no se reembolsa.",
      ],
      en: [
        "Compulsory booking form. Payment by bank transfer or Visa.",
        "Booking: 30% at confirmation.",
        "Final payment: 70% balance up to 30 days before departure.",
        "If the chosen flight requires immediate ticketing: 100% of the flight + 30% of land services at booking.",
        "Cancellation 45 days before departure: 30% of the total.",
        "Cancellation 21 days before departure: 100% of the total.",
        "Fixed €50 per booking management fee.",
        "Conditions apply to land services only. Flights follow each airline's rules. Cancellation insurance is non-refundable.",
      ],
      fr: [
        "Fiche d'inscription obligatoire. Paiement par virement ou Visa.",
        "Réservation : 30 % à la confirmation.",
        "Paiement final : solde de 70 % jusqu'à 30 jours avant le départ.",
        "Si le vol exige une émission immédiate : 100 % du vol + 30 % des services terrestres à la réservation.",
        "Annulation 45 jours avant : 30 % du total.",
        "Annulation 21 jours avant : 100 % du total.",
        "Pénalité fixe de 50 € par réservation pour frais de gestion.",
        "Conditions applicables aux services terrestres uniquement. L'assurance annulation n'est pas remboursable.",
      ],
    },
  },
};

export default PROGRAM_ESCAPADA_FEZ_23;
