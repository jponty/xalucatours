// Ouarzazate → Sidi Ali → Fez · 6 nights / 7 days. Extends the 5n/6d
// by splitting the long «sunrise + Khamlia + Ziz + Sidi Ali» day in
// two: a full relax day at Kasbah Xaluca after the bivouac, then the
// drive to Sidi Ali on its own. Reuses 4 shared days + 1 new day.

import { DAY_03_ERFOUD_ERG_BIVOUAC } from "./fezMarrakech910";
import { DAY_04_AMANECER_KHAMLIA_RISSANI_RELAX } from "./fezMarrakech67";
import {
  DAY_OZF_OUARZA_AITBEN_DADES,
  DAY_OZF_DADES_TODRA_ERFOUD,
  DAY_OZF_SIDIALI_IFRANE_FEZ,
  DAY_OZF_FEZ_MEDINA_RETURN,
} from "./ouarzazateSidialiFez56";

const T = (es, en, fr) => ({ es, en, fr });

export const DAY_OZF_ZIZ_SIDIALI = {
  route_id: "ozf67-ziz-sidiali",
  id: "ozf67-d5",
  image: "https://images.unsplash.com/photo-1542401886-65d6c61db217?auto=format&fit=crop&w=2000&q=85",
  accent: "#5A6B4F",
  title: T(
    "Erfoud · Valle del Ziz · Midelt · Aguelmane Sidi Ali",
    "Erfoud · Ziz Valley · Midelt · Aguelmane Sidi Ali",
    "Erfoud · Vallée du Ziz · Midelt · Aguelmane Sidi Ali",
  ),
  body: {
    es: "Mañana libre en la Kasbah Xaluca para disfrutar de las instalaciones — piscina climatizada, hammam o jacuzzi — antes de la jornada larga. Salida al mediodía hacia el norte recorriendo aproximadamente 330 km. Atravesaremos el Valle del Ziz — hogar de más de diez millones de palmeras — Midelt y la cordillera del Atlas hasta llegar al lago Aguelmane Sidi Ali, situado a 2.200 metros de altitud, en la falda de un volcán y junto al lago natural más profundo del país. Cena y alojamiento en Xaluca Spa Aguelmane Sidi Ali, antiguo refugio de caza y pesca reconvertido en hotel boutique de alta montaña.",
    en: "Free morning at Kasbah Xaluca to enjoy the facilities — heated pool, hammam or jacuzzi — before the long drive. Departure around midday heading north for some 330 km. We cross the Ziz Valley — home to more than ten million palm trees — Midelt and the Atlas range to reach the Aguelmane Sidi Ali lake, set at 2,200 m altitude on the flank of a volcano, next to Morocco's deepest natural lake. Dinner and overnight at Xaluca Spa Aguelmane Sidi Ali — a former hunting and fishing lodge reconverted into a high-altitude boutique hotel.",
    fr: "Matinée libre à la Kasbah Xaluca pour profiter des installations — piscine chauffée, hammam ou jacuzzi — avant la longue route. Départ vers midi en direction du nord, environ 330 km. Nous traversons la Vallée du Ziz — peuplée de plus de dix millions de palmiers — Midelt et la chaîne de l'Atlas jusqu'au lac Aguelmane Sidi Ali, perché à 2 200 m sur le flanc d'un volcan et bordant le lac naturel le plus profond du Maroc. Dîner et nuit au Xaluca Spa Aguelmane Sidi Ali, ancien relais de chasse et de pêche transformé en hôtel-boutique d'altitude.",
  },
};

export const PROGRAM_OZF_67 = {
  routeId: "tourOzzSidialiFez67",
  duration_key: "ozf6n7d",
  duration: T("6 noches / 7 días", "6 nights / 7 days", "6 nuits / 7 jours"),
  prices: { low: 1590, mid: 1790, high: 1990, premium: 2290 },
  route: [
    { day: 1, lat: 31.3582, lng: -5.9911, type: "gorge",   name: T("Boumalne Dadès", "Boumalne Dades", "Boumalne Dadès") },
    { day: 2, lat: 31.4373, lng: -4.2330, type: "city",    name: T("Erfoud · Kasbah Xaluca", "Erfoud · Kasbah Xaluca", "Erfoud · Kasbah Xaluca") },
    { day: 3, lat: 31.1257, lng: -3.9789, type: "desert",  name: T("Erg Chebbi · Bivouac", "Erg Chebbi · Bivouac", "Erg Chebbi · Bivouac") },
    { day: 4, lat: 31.2828, lng: -4.2683, type: "market",  name: T("Rissani · Kasbah Xaluca", "Rissani · Kasbah Xaluca", "Rissani · Kasbah Xaluca") },
    { day: 5, lat: 33.0500, lng: -4.9650, type: "lake",    name: T("Aguelmane Sidi Ali", "Aguelmane Sidi Ali", "Aguelmane Sidi Ali") },
    { day: 6, lat: 34.0651, lng: -4.9760, type: "city",    name: T("Fez", "Fez", "Fès") },
    { day: 7, lat: 33.9272, lng: -4.9778, type: "airport", name: T("Fez · Aeropuerto", "Fez · Airport", "Fès · Aéroport") },
  ],
  days: [
    DAY_OZF_OUARZA_AITBEN_DADES,
    DAY_OZF_DADES_TODRA_ERFOUD,
    DAY_03_ERFOUD_ERG_BIVOUAC,
    DAY_04_AMANECER_KHAMLIA_RISSANI_RELAX,
    DAY_OZF_ZIZ_SIDIALI,
    DAY_OZF_SIDIALI_IFRANE_FEZ,
    DAY_OZF_FEZ_MEDINA_RETURN,
  ],
  details: {
    includes: {
      es: [
        "Una noche en Boumalne Dades en Hotel Xaluca Dadès 4★ en Media Pensión",
        "Dos noches en Erfoud en Kasbah Hotel Xaluca en Media Pensión",
        "Una noche en Erg Chebbi en Bivouac de Luxe en el desierto en Media Pensión",
        "Una noche en Aguelmane Sidi Ali en Hotel Xaluca Spa Aguelmane Sidi Ali en Media Pensión",
        "Una noche en Fez en Riad en la Medina o Hotel 4★ en Media Pensión",
        "Picnic en el desierto · Comida en Hotel Xaluca Spa Aguelmane Sidi Ali",
        "Excursión en dromedario por el Erg Chebbi",
        "Vehículo 4x4 con chófer del día 1 al día 6 del itinerario",
        "Visita con guía local en Fez",
        "Visitas a Aït Ben Haddou y a la Madraza de Fez",
        "Transfers desde y hacia aeropuertos · Combustible · Seguro de asistencia en viaje",
      ],
      en: [
        "One night in Boumalne Dades at Hotel Xaluca Dades 4★ · half board",
        "Two nights in Erfoud at Kasbah Hotel Xaluca · half board",
        "One night at the Bivouac de Luxe in the Erg Chebbi · half board",
        "One night at Aguelmane Sidi Ali (Hotel Xaluca Spa) · half board",
        "One night in Fez at a Medina riad or 4★ hotel · half board",
        "Picnic lunch in the desert · Lunch at Hotel Xaluca Spa Aguelmane Sidi Ali",
        "Camel ride in the Erg Chebbi",
        "4x4 with driver from day 1 to day 6",
        "Local guided tour in Fez",
        "Visits to Aït Ben Haddou and the Fez Madrasa",
        "Airport transfers · Fuel · Travel assistance insurance",
      ],
      fr: [
        "Une nuit à Boumalne Dadès à l'Hôtel Xaluca Dadès 4★ · demi-pension",
        "Deux nuits à Erfoud à la Kasbah Hôtel Xaluca · demi-pension",
        "Une nuit au Bivouac de Luxe dans l'Erg Chebbi · demi-pension",
        "Une nuit à Aguelmane Sidi Ali (Hôtel Xaluca Spa) · demi-pension",
        "Une nuit à Fès en riad de la médina ou hôtel 4★ · demi-pension",
        "Pique-nique au désert · Déjeuner à l'Hôtel Xaluca Spa Aguelmane Sidi Ali",
        "Balade à dromadaire dans l'Erg Chebbi",
        "4x4 avec chauffeur du jour 1 au jour 6",
        "Guide local à Fès",
        "Visites d'Aït Ben Haddou et de la Médersa de Fès",
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
        "Tarifas basadas en habitaciones dobles/triples. Suplemento individual: 355 €.",
        "Descuento niños (3-11 años) compartiendo con dos adultos: 360 € temporada baja · 375 € temporada alta.",
        "En temporada alta, los guías de medina pueden compartirse con otros viajeros.",
        "Chóferes hispanohablantes son limitados — reservar con antelación.",
        "Pasaporte vigente con un mínimo de 6 meses desde la fecha de regreso.",
        "Actividades opcionales: Quads 90 € por vehículo (2 horas).",
      ],
      en: [
        "Flight options: Royal Air Maroc, Vueling, Air Arabia, Ryanair.",
        "Rates depend on 4x4 occupancy. Cost is split between passengers.",
        "Rates based on double/triple rooms. Single supplement: €355.",
        "Children discount (3-11) sharing with two adults: €360 low season · €375 high season.",
        "In high season medina guides may be shared with other travellers.",
        "Spanish-speaking drivers are limited — book early.",
        "Valid passport required with at least 6 months remaining from the return date.",
        "Optional activities: Quads €90 per vehicle (2-hour circuit).",
      ],
      fr: [
        "Options de vols : Royal Air Maroc, Vueling, Air Arabia, Ryanair.",
        "Tarifs selon l'occupation du 4x4. Le coût est partagé entre les occupants.",
        "Tarifs base chambre double/triple. Supplément single : 355 €.",
        "Remise enfants (3-11 ans) partageant avec 2 adultes : 360 € basse · 375 € haute.",
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

export default PROGRAM_OZF_67;
