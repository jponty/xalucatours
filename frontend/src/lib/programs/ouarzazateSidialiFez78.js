// Ouarzazate → Sidi Ali → Fez · 7 nights / 8 days. Extends the 6n/7d
// with a full extra day exploring the High Atlas Central and M'Goun
// gorges right after Aït Ben Haddou. 100% composed from previously
// declared shared days.

import {
  DAY_03_ERFOUD_ERG_BIVOUAC,
  DAY_07_MGOUN_ATLAS,
} from "./fezMarrakech910";
import { DAY_04_AMANECER_KHAMLIA_RISSANI_RELAX } from "./fezMarrakech67";
import {
  DAY_OZF_OUARZA_AITBEN_DADES,
  DAY_OZF_DADES_TODRA_ERFOUD,
  DAY_OZF_SIDIALI_IFRANE_FEZ,
  DAY_OZF_FEZ_MEDINA_RETURN,
} from "./ouarzazateSidialiFez56";
import { DAY_OZF_ZIZ_SIDIALI } from "./ouarzazateSidialiFez67";

const T = (es, en, fr) => ({ es, en, fr });

export const PROGRAM_OZF_78 = {
  routeId: "tourOzzSidialiFez78",
  duration_key: "ozf7n8d",
  duration: T("7 noches / 8 días", "7 nights / 8 days", "7 nuits / 8 jours"),
  prices: { low: 1790, mid: 2090, high: 2390, premium: 2790 },
  route: [
    { day: 1, lat: 31.3582, lng: -5.9911, type: "gorge",   name: T("Boumalne Dadès", "Boumalne Dades", "Boumalne Dadès") },
    { day: 2, lat: 31.4900, lng: -5.7950, type: "gorge",   name: T("Gargantas del M'Goun", "M'Goun Gorges", "Gorges du M'Goun") },
    { day: 3, lat: 31.4373, lng: -4.2330, type: "city",    name: T("Erfoud · Kasbah Xaluca", "Erfoud · Kasbah Xaluca", "Erfoud · Kasbah Xaluca") },
    { day: 4, lat: 31.1257, lng: -3.9789, type: "desert",  name: T("Erg Chebbi · Bivouac", "Erg Chebbi · Bivouac", "Erg Chebbi · Bivouac") },
    { day: 5, lat: 31.2828, lng: -4.2683, type: "market",  name: T("Rissani · Kasbah Xaluca", "Rissani · Kasbah Xaluca", "Rissani · Kasbah Xaluca") },
    { day: 6, lat: 33.0500, lng: -4.9650, type: "lake",    name: T("Aguelmane Sidi Ali", "Aguelmane Sidi Ali", "Aguelmane Sidi Ali") },
    { day: 7, lat: 34.0651, lng: -4.9760, type: "city",    name: T("Fez", "Fez", "Fès") },
    { day: 8, lat: 33.9272, lng: -4.9778, type: "airport", name: T("Fez · Aeropuerto", "Fez · Airport", "Fès · Aéroport") },
  ],
  days: [
    DAY_OZF_OUARZA_AITBEN_DADES,
    DAY_07_MGOUN_ATLAS,
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
        "Dos noches en Boumalne Dades en Hotel Xaluca Dadès 4★ en Media Pensión",
        "Dos noches en Erfoud en Kasbah Hotel Xaluca en Media Pensión",
        "Una noche en Erg Chebbi en Bivouac de Luxe en el desierto en Media Pensión",
        "Una noche en Aguelmane Sidi Ali en Hotel Xaluca Spa Aguelmane Sidi Ali en Media Pensión",
        "Una noche en Fez en Riad en la Medina o Hotel 4★ en Media Pensión",
        "Comida en una Gîte d'Étape en montaña (M'Goun) · Picnic en el desierto · Comida en Hotel Xaluca Spa Aguelmane Sidi Ali",
        "Excursión en dromedario por el Erg Chebbi",
        "Vehículo 4x4 con chófer desde el día 1 hasta el día 7 del itinerario",
        "Visita con guía local en Fez",
        "Visitas a Aït Ben Haddou y a la Madraza de Fez",
        "Transfers desde y hacia aeropuertos · Combustible · Seguro de asistencia en viaje",
      ],
      en: [
        "Two nights in Boumalne Dades at Hotel Xaluca Dades 4★ · half board",
        "Two nights in Erfoud at Kasbah Hotel Xaluca · half board",
        "One night at the Bivouac de Luxe in the Erg Chebbi · half board",
        "One night at Aguelmane Sidi Ali (Hotel Xaluca Spa) · half board",
        "One night in Fez at a Medina riad or 4★ hotel · half board",
        "Lunch at a mountain Gîte d'Étape (M'Goun) · Picnic lunch in the desert · Lunch at Hotel Xaluca Spa Aguelmane Sidi Ali",
        "Camel ride in the Erg Chebbi",
        "4x4 with driver from day 1 to day 7",
        "Local guided tour in Fez",
        "Visits to Aït Ben Haddou and the Fez Madrasa",
        "Airport transfers · Fuel · Travel assistance insurance",
      ],
      fr: [
        "Deux nuits à Boumalne Dadès à l'Hôtel Xaluca Dadès 4★ · demi-pension",
        "Deux nuits à Erfoud à la Kasbah Hôtel Xaluca · demi-pension",
        "Une nuit au Bivouac de Luxe dans l'Erg Chebbi · demi-pension",
        "Une nuit à Aguelmane Sidi Ali (Hôtel Xaluca Spa) · demi-pension",
        "Une nuit à Fès en riad de la médina ou hôtel 4★ · demi-pension",
        "Déjeuner en Gîte d'Étape en montagne (M'Goun) · Pique-nique au désert · Déjeuner à l'Hôtel Xaluca Spa Aguelmane Sidi Ali",
        "Balade à dromadaire dans l'Erg Chebbi",
        "4x4 avec chauffeur du jour 1 au jour 7",
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
        "Tarifas basadas en habitaciones dobles/triples. Suplemento individual: 400 €.",
        "Descuento niños (3-11 años) compartiendo con dos adultos: 410 € temporada baja · 430 € temporada alta.",
        "En temporada alta, los guías de medina pueden compartirse con otros viajeros.",
        "Chóferes hispanohablantes son limitados — reservar con antelación.",
        "Pasaporte vigente con un mínimo de 6 meses desde la fecha de regreso.",
        "Actividades opcionales: Quads 90 € por vehículo (2 horas).",
      ],
      en: [
        "Flight options: Royal Air Maroc, Vueling, Air Arabia, Ryanair.",
        "Rates depend on 4x4 occupancy. Cost is split between passengers.",
        "Rates based on double/triple rooms. Single supplement: €400.",
        "Children discount (3-11) sharing with two adults: €410 low season · €430 high season.",
        "In high season medina guides may be shared with other travellers.",
        "Spanish-speaking drivers are limited — book early.",
        "Valid passport required with at least 6 months remaining from the return date.",
        "Optional activities: Quads €90 per vehicle (2-hour circuit).",
      ],
      fr: [
        "Options de vols : Royal Air Maroc, Vueling, Air Arabia, Ryanair.",
        "Tarifs selon l'occupation du 4x4. Le coût est partagé entre les occupants.",
        "Tarifs base chambre double/triple. Supplément single : 400 €.",
        "Remise enfants (3-11 ans) partageant avec 2 adultes : 410 € basse · 430 € haute.",
        "En haute saison, les guides de médina peuvent être partagés.",
        "Chauffeurs hispanophones limités — réserver tôt.",
        "Passeport valable au minimum 6 mois après la date de retour.",
        "Activités en option : Quads 90 € par véhicule (2 h).",
      ],
    },
    terms: {
      es: [
        "Ficha de inscripción obligatoria. Pago por transferencia o Visa.",
        "Reserva: 30% del importe al reservar.",
        "Pago final: 70% restante hasta 30 días antes de la salida.",
        "Si el vuelo elegido requiere emisión inmediata: 100% del importe de vuelos + 30% de los servicios de tierra al reservar.",
        "Cancelación 45 días antes de la salida: 30% del importe total.",
        "Cancelación 21 días antes de la salida: 100% del importe total.",
        "Penalización fija de 50 € por reserva en concepto de gastos de gestión.",
        "El seguro de cancelación no es reembolsable.",
      ],
      en: [
        "Compulsory booking form. Payment by bank transfer or Visa.",
        "Booking: 30% at confirmation.",
        "Final payment: 70% balance up to 30 days before departure.",
        "If the chosen flight requires immediate ticketing: 100% of the flight + 30% of land services at booking.",
        "Cancellation 45 days before departure: 30% of the total.",
        "Cancellation 21 days before departure: 100% of the total.",
        "Fixed €50 per booking management fee.",
        "Cancellation insurance is non-refundable.",
      ],
      fr: [
        "Fiche d'inscription obligatoire. Paiement par virement bancaire ou Visa.",
        "Réservation : 30 % à la confirmation.",
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

export default PROGRAM_OZF_78;
