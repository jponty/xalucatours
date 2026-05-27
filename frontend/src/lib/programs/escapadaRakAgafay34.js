// Marrakech + Agafay · 3 nights / 4 days
// Reuses arrival + medina days from escapadaMarrakech23 and adds the Agafay
// desert experience (luxury camp under the stars) before the return flight.
import {
  DAY_RAK_ARRIVAL,
  DAY_RAK_MEDINA,
} from "@/lib/programs/escapadaMarrakech23";

const T = (es, en, fr) => ({ es, en, fr });

const DAY_AGAFAY = {
  route_id: "escraga34-agafay",
  id: "escraga34-d3",
  image: "https://images.unsplash.com/photo-1547234935-80c7145ec969?auto=format&fit=crop&w=2000&q=85",
  accent: "#A07042",
  title: T(
    "Marrakech · Meseta del Kik · Desierto de Agafay · bivouac",
    "Marrakech · Kik Plateau · Agafay Desert · bivouac",
    "Marrakech · Plateau du Kik · Désert d'Agafay · bivouac",
  ),
  body: {
    es: "A la hora convenida, recogida en vehículo 4x4 con chófer para salir hacia el suroeste. Cruzaremos la Meseta del Kik hasta llegar al lago de Lalla Takerkoust, un embalse turquesa rodeado de paisajes áridos que conducen al Atlas. Durante el recorrido (≈ 40 km) atravesaremos zonas de escasa vegetación, poblados bereberes y, si coincide con el día de mercado, alguno de los souks rurales más auténticos del entorno. Llegada al Desierto de Agafay — conocido como «el Desierto Marrakchi» —, situado a los pies del Atlas. Sin las dunas de arena del Sáhara, Agafay es un mar de colinas rocosas y polvo dorado, ideal para una primera experiencia desértica a una hora escasa de Marrakech. Tiempo libre para descansar o reservar actividades opcionales: quad, buggy o cuatrimotos por las pistas. Por la tarde, paseo en dromedario hacia un mirador natural para contemplar la puesta de sol sobre el Atlas — al fondo, el Toubkal (4.167 m) coronado de nieve la mayor parte del año. Llegada al campamento de lujo en haimas bereberes, donde nos espera una cena tradicional y una noche bajo un cielo cuajado de estrellas. Cena y alojamiento en bivouac de lujo en Agafay.",
    en: "At the agreed time, pick-up in a 4x4 with driver to head south-west. We cross the Kik Plateau down to the Lalla Takerkoust dam, a turquoise reservoir surrounded by arid landscapes leading to the Atlas. Along the way (≈ 40 km) we cross sparse vegetation, Berber villages and — if it coincides with the market day — one of the most authentic rural souks in the area. Arrival at the Agafay Desert — known as «the Marrakchi desert» —, set at the foot of the Atlas. Without the Sahara's sand dunes, Agafay is a sea of rocky hills and golden dust, ideal for a first desert encounter only an hour from Marrakech. Free time to rest or book optional activities: quad, buggy or ATVs along the tracks. In the afternoon, camel ride to a natural viewpoint to watch the sunset over the Atlas — in the background, snow-capped Toubkal (4,167 m). Arrival at the luxury Berber-tent camp, where a traditional dinner and a night under a sky thick with stars await us. Dinner and overnight at the luxury Agafay bivouac.",
    fr: "À l'heure convenue, prise en charge en 4x4 avec chauffeur pour partir vers le sud-ouest. Nous traversons le plateau du Kik jusqu'au lac de Lalla Takerkoust, un réservoir turquoise entouré de paysages arides qui mènent à l'Atlas. En chemin (≈ 40 km), nous traversons des zones à végétation rare, des villages berbères et — si la date coïncide — l'un des souks ruraux les plus authentiques de la région. Arrivée au désert d'Agafay — surnommé « le désert marrakchi » —, situé au pied de l'Atlas. Sans les dunes de sable du Sahara, Agafay est une mer de collines rocheuses et de poussière dorée, idéale pour une première expérience désertique à une heure à peine de Marrakech. Temps libre pour se reposer ou réserver des activités en option : quad, buggy ou ATV sur les pistes. L'après-midi, balade à dromadaire vers un mirador naturel pour contempler le coucher de soleil sur l'Atlas — en arrière-plan, le Toubkal (4 167 m) enneigé. Arrivée au camp de luxe en tentes berbères, où nous attendent un dîner traditionnel et une nuit sous un ciel chargé d'étoiles. Dîner et nuit au bivouac de luxe d'Agafay.",
  },
  wellness: [
    { es: "Paseo en dromedario · puesta de sol", en: "Camel ride · sunset", fr: "Balade à dromadaire · coucher de soleil" },
    { es: "Bivouac de lujo · haimas bereberes", en: "Luxury bivouac · Berber tents", fr: "Bivouac de luxe · tentes berbères" },
    { es: "Noche bajo las estrellas", en: "Night under the stars", fr: "Nuit sous les étoiles" },
    { es: "Quad / buggy opcionales", en: "Optional quads / buggies", fr: "Quad / buggy en option" },
  ],
  culture: [
    {
      title: T("Agafay · el desierto a una hora de Marrakech", "Agafay · the desert one hour from Marrakech", "Agafay · le désert à une heure de Marrakech"),
      body: T(
        "Un mar de colinas rocosas y polvo dorado al pie del Atlas, sin dunas pero con la misma magia silenciosa de las estepas saharianas. Perfecto cuando el tiempo aprieta.",
        "A sea of rocky hills and golden dust at the foot of the Atlas — no dunes, but the same silent magic as the Saharan steppes. Perfect when time is short.",
        "Une mer de collines rocheuses et de poussière dorée au pied de l'Atlas — sans dunes, mais avec la même magie silencieuse que les steppes sahariennes.",
      ),
    },
    {
      title: T("Lalla Takerkoust · espejo turquesa", "Lalla Takerkoust · turquoise mirror", "Lalla Takerkoust · miroir turquoise"),
      body: T(
        "Embalse construido por los franceses en 1929 al pie del Toubkal — primer gran proyecto hidroeléctrico del país, hoy oasis de aves migratorias.",
        "Dam built by the French in 1929 at the foot of Toubkal — Morocco's first major hydroelectric project, today a haven for migratory birds.",
        "Barrage construit par les Français en 1929 au pied du Toubkal — premier grand projet hydroélectrique du pays, aujourd'hui refuge d'oiseaux migrateurs.",
      ),
    },
    {
      title: T("Meseta del Kik · ventana al Atlas", "Kik Plateau · window onto the Atlas", "Plateau du Kik · fenêtre sur l'Atlas"),
      body: T(
        "Altiplano de 1.500 m que ofrece el primer panorama completo sobre las cumbres del Alto Atlas. En primavera florece en tapices de amapolas y caléndulas.",
        "1,500 m plateau offering the first full panorama of the High Atlas peaks. In spring it bursts into carpets of poppies and marigolds.",
        "Plateau à 1 500 m offrant la première vue complète sur les sommets du Haut Atlas. Au printemps, tapis de coquelicots et de soucis.",
      ),
    },
  ],
};

const DAY_RETURN = {
  route_id: "escraga34-return",
  id: "escraga34-d4",
  image: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=2000&q=85",
  accent: "#5C5248",
  title: T("Agafay · regreso a Marrakech", "Agafay · return to Marrakech", "Agafay · retour à Marrakech"),
  body: {
    es: "Después del desayuno en el campamento — recomendamos madrugar para asistir al amanecer sobre las colinas de Agafay —, recogida y traslado directo al aeropuerto de Marrakech para tomar el vuelo de regreso.",
    en: "After breakfast at the camp — we recommend rising early to catch the sunrise over the Agafay hills —, pick-up and direct transfer to Marrakech airport for the return flight.",
    fr: "Après le petit-déjeuner au campement — nous recommandons un lever matinal pour le lever du soleil sur les collines d'Agafay —, prise en charge et transfert direct à l'aéroport de Marrakech pour le vol retour.",
  },
};

export const PROGRAM_ESCAPADA_RAK_AGAFAY_34 = {
  routeId: "tourEscapadaRakAgafay34",
  duration_key: "raga3n4d",
  duration: T("3 noches / 4 días", "3 nights / 4 days", "3 nuits / 4 jours"),
  prices: { low: 690, mid: 790, high: 890, premium: 990 },
  route: [
    { day: 1, lat: 31.6069, lng: -8.0363, type: "airport", name: T("Marrakech · Aeropuerto", "Marrakech · Airport", "Marrakech · Aéroport") },
    { day: 1, lat: 31.6219, lng: -7.9831, type: "city",    name: T("Djemaa el-Fna · primera toma de contacto", "Jemaa el-Fna · first encounter", "Jemaa el-Fna · première rencontre") },
    { day: 2, lat: 31.6244, lng: -7.9926, type: "city",    name: T("Koutoubia · Palacio de la Bahía", "Koutoubia · Bahia Palace", "Koutoubia · Palais de la Bahia") },
    { day: 3, lat: 31.3573, lng: -8.1338, type: "lake",    name: T("Meseta del Kik · Lalla Takerkoust", "Kik Plateau · Lalla Takerkoust", "Plateau du Kik · Lalla Takerkoust") },
    { day: 3, lat: 31.4500, lng: -8.1200, type: "desert",  name: T("Agafay · bivouac de lujo", "Agafay · luxury bivouac", "Agafay · bivouac de luxe") },
    { day: 4, lat: 31.6069, lng: -8.0363, type: "airport", name: T("Marrakech · Aeropuerto · Regreso", "Marrakech · Airport · Return", "Marrakech · Aéroport · Retour") },
  ],
  days: [DAY_RAK_ARRIVAL, DAY_RAK_MEDINA, DAY_AGAFAY, DAY_RETURN],
  details: {
    includes: {
      es: [
        "Dos noches en Marrakech en Riad en la Medina u Hotel 5★ en régimen de Alojamiento y Desayuno",
        "Una noche en Agafay en campamento de lujo en régimen de Media Pensión",
        "Visita con guía local en Marrakech",
        "Entrada al Palacio de la Bahía",
        "Excursión en dromedario en Agafay",
        "Transfer aeropuerto Marrakech – Riad u Hotel",
        "Vehículo con chófer Marrakech – Agafay",
        "Transfer Agafay – aeropuerto Marrakech",
        "Combustible de los vehículos",
        "Seguro de asistencia en viaje",
      ],
      en: [
        "Two nights in Marrakech in a Medina riad or 5★ hotel · bed & breakfast",
        "One night in Agafay at a luxury camp · half board",
        "Local guided tour in Marrakech",
        "Bahia Palace admission",
        "Camel ride in Agafay",
        "Marrakech airport – riad/hotel transfer",
        "Car with driver Marrakech – Agafay",
        "Agafay – Marrakech airport transfer",
        "Fuel",
        "Travel assistance insurance",
      ],
      fr: [
        "Deux nuits à Marrakech en riad de la médina ou hôtel 5★ · petit-déjeuner",
        "Une nuit à Agafay en camp de luxe · demi-pension",
        "Guide local à Marrakech",
        "Entrée au palais de la Bahia",
        "Balade à dromadaire à Agafay",
        "Transfert aéroport Marrakech – riad/hôtel",
        "Voiture avec chauffeur Marrakech – Agafay",
        "Transfert Agafay – aéroport Marrakech",
        "Carburant",
        "Assistance voyage",
      ],
    },
    excludes: {
      es: [
        "Las bebidas",
        "Las comidas a mediodía y cenas en Marrakech",
        "Entradas no especificadas",
        "Otros extras personales (quads, masajes, tratamientos…)",
        "El vuelo (salvo que se indique lo contrario)",
        "Suplemento opcional para seguro de cancelación · 45 € por persona para viajes de hasta 9 días",
      ],
      en: [
        "Drinks",
        "Lunches and dinners in Marrakech",
        "Admissions not specified",
        "Personal extras (quads, massages, treatments…)",
        "Flights (unless otherwise stated)",
        "Optional cancellation insurance · €45 per person for trips up to 9 days",
      ],
      fr: [
        "Boissons",
        "Déjeuners et dîners à Marrakech",
        "Entrées non spécifiées",
        "Extras personnels (quads, massages, soins…)",
        "Le vol (sauf mention contraire)",
        "Assurance annulation en option · 45 € par personne pour les voyages jusqu'à 9 jours",
      ],
    },
    notes: {
      es: [
        "Opciones de vuelos: Royal Air Maroc vía Casablanca, Vueling o Ryanair.",
        "Tarifas basadas en habitaciones dobles. Suplemento individual: 440 €.",
        "Descuento niños (3-11 años) compartiendo habitación con dos adultos: 35 €.",
        "En temporada alta los guías locales podrían compartirse con otros viajeros.",
        "El nombre del riad y del campamento se confirma tras la reserva.",
        "Dependiendo del horario de llegada del vuelo, la visita guiada de Marrakech podría adelantarse al día 1, dejando el día 2 libre.",
        "Actividades opcionales en Agafay (quad, buggy, masajes) bajo petición previa.",
        "Pasaporte obligatorio con vigencia mínima de 6 meses.",
      ],
      en: [
        "Flight options: Royal Air Maroc via Casablanca, Vueling or Ryanair.",
        "Rates based on double rooms. Single supplement: €440.",
        "Children discount (3-11) sharing room with two adults: €35.",
        "In high season local guides may be shared with other travellers.",
        "Riad and camp names are confirmed after booking.",
        "Depending on the arrival flight time, the Marrakech guided tour may be brought forward to day 1, leaving day 2 free.",
        "Optional Agafay activities (quad, buggy, massages) on prior request.",
        "Valid passport required with at least 6 months remaining.",
      ],
      fr: [
        "Options de vol : Royal Air Maroc via Casablanca, Vueling ou Ryanair.",
        "Tarifs base chambre double. Supplément single : 440 €.",
        "Réduction enfants (3-11 ans) partageant avec deux adultes : 35 €.",
        "En haute saison, les guides peuvent être partagés.",
        "Les noms du riad et du campement sont confirmés après la réservation.",
        "Selon l'heure d'arrivée du vol, la visite guidée de Marrakech peut être avancée au jour 1.",
        "Activités optionnelles à Agafay (quad, buggy, massages) sur demande préalable.",
        "Passeport valable au moins 6 mois.",
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
        "Conditions apply to land services only. Cancellation insurance is non-refundable.",
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

export default PROGRAM_ESCAPADA_RAK_AGAFAY_34;
