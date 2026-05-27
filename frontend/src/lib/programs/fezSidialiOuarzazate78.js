// Fez → Sidi Ali → Ouarzazate · 7 nights / 8 days. The deepest FOZ
// variant: extends the 6n/7d with a full extra day exploring the
// High Atlas Central and the M'Goun gorges before reaching
// Ouarzazate. 100% composed from previously declared shared days.

import {
  DAY_01_ARRIVAL_FEZ,
  DAY_03_ERFOUD_ERG_BIVOUAC,
  DAY_06_TODRA_DADES,
  DAY_07_MGOUN_ATLAS,
} from "./fezMarrakech910";
import { DAY_04_AMANECER_KHAMLIA_RISSANI_RELAX } from "./fezMarrakech67";
import { DAY_FZS_FEZ_ATLAS_SIDIALI } from "./fezSidialiMarrakech78";
import {
  DAY_FOZ_KHENIFRA_ZIZ_ERFOUD,
  DAY_FOZ_OUARZAZATE_RETURN,
} from "./fezSidialiOuarzazate56";

const T = (es, en, fr) => ({ es, en, fr });

export const PROGRAM_FOZ_78 = {
  routeId: "tourFezSidialiOzz78",
  duration_key: "foz7n8d",
  duration: T("7 noches / 8 días", "7 nights / 8 days", "7 nuits / 8 jours"),
  prices: { low: 1790, mid: 2090, high: 2390, premium: 2790 },
  route: [
    { day: 1, lat: 34.0651, lng: -4.9760, type: "city",    name: T("Fez · Llegada", "Fez · Arrival", "Fès · Arrivée") },
    { day: 2, lat: 33.0500, lng: -4.9650, type: "lake",    name: T("Aguelmane Sidi Ali", "Aguelmane Sidi Ali", "Aguelmane Sidi Ali") },
    { day: 3, lat: 31.4373, lng: -4.2330, type: "city",    name: T("Erfoud · Kasbah Xaluca", "Erfoud · Kasbah Xaluca", "Erfoud · Kasbah Xaluca") },
    { day: 4, lat: 31.1257, lng: -3.9789, type: "desert",  name: T("Erg Chebbi · Bivouac", "Erg Chebbi · Bivouac", "Erg Chebbi · Bivouac") },
    { day: 5, lat: 31.2828, lng: -4.2683, type: "market",  name: T("Rissani · Kasbah Xaluca", "Rissani · Kasbah Xaluca", "Rissani · Kasbah Xaluca") },
    { day: 6, lat: 31.3582, lng: -5.9911, type: "gorge",   name: T("Boumalne Dadès · Todra", "Boumalne Dades · Todra", "Boumalne Dadès · Todra") },
    { day: 7, lat: 31.4900, lng: -5.7950, type: "gorge",   name: T("Gargantas del M'Goun", "M'Goun Gorges", "Gorges du M'Goun") },
    { day: 8, lat: 30.9189, lng: -6.8934, type: "airport", name: T("Ouarzazate · Aeropuerto", "Ouarzazate · Airport", "Ouarzazate · Aéroport") },
  ],
  days: [
    DAY_01_ARRIVAL_FEZ,
    DAY_FZS_FEZ_ATLAS_SIDIALI,
    DAY_FOZ_KHENIFRA_ZIZ_ERFOUD,
    DAY_03_ERFOUD_ERG_BIVOUAC,
    DAY_04_AMANECER_KHAMLIA_RISSANI_RELAX,
    DAY_06_TODRA_DADES,
    DAY_07_MGOUN_ATLAS,
    DAY_FOZ_OUARZAZATE_RETURN,
  ],
  details: {
    includes: {
      es: [
        "Una noche en Fez en Riad en la Medina o Hotel 4★ en Media Pensión",
        "Una noche en Aguelmane Sidi Ali en Hotel Xaluca Lake (Spa Aguelmane Sidi Ali) en Media Pensión",
        "Dos noches en Erfoud en Hotel Kasbah Xaluca en Media Pensión",
        "Una noche en Erg Chebbi en Bivouac de Luxe en el desierto en Media Pensión",
        "Dos noches en Boumalne Dades en Hotel Xaluca Dadès en Media Pensión",
        "Comida en el Hotel Xaluca Spa Aguelmane Sidi Ali",
        "Picnic en el desierto · Almuerzo en «Gîte d'Étape» en montaña (M'Goun)",
        "Excursión en dromedario por el Erg Chebbi",
        "Vehículo 4x4 con chófer del día 2 al día 8 del itinerario",
        "Visita guiada a media jornada en Fez",
        "Transfers desde y hacia aeropuertos · Combustible · Seguro de asistencia en viaje",
      ],
      en: [
        "One night in Fez at a Medina riad or 4★ hotel · half board",
        "One night at Aguelmane Sidi Ali (Hotel Xaluca Lake) · half board",
        "Two nights in Erfoud at Hotel Kasbah Xaluca · half board",
        "One night at the Bivouac de Luxe in the Erg Chebbi · half board",
        "Two nights in Boumalne Dades at Hotel Xaluca Dades · half board",
        "Lunch at Hotel Xaluca Spa Aguelmane Sidi Ali",
        "Picnic lunch in the desert · Mountain lunch at a «Gîte d'Étape» (M'Goun)",
        "Camel ride in the Erg Chebbi",
        "4x4 with driver from day 2 to day 8",
        "Half-day guided tour in Fez",
        "Airport transfers · Fuel · Travel assistance insurance",
      ],
      fr: [
        "Une nuit à Fès en riad de la médina ou hôtel 4★ · demi-pension",
        "Une nuit à Aguelmane Sidi Ali (Hôtel Xaluca Lake) · demi-pension",
        "Deux nuits à Erfoud à l'Hôtel Kasbah Xaluca · demi-pension",
        "Une nuit au Bivouac de Luxe dans l'Erg Chebbi · demi-pension",
        "Deux nuits à Boumalne Dadès à l'Hôtel Xaluca Dadès · demi-pension",
        "Déjeuner à l'Hôtel Xaluca Spa Aguelmane Sidi Ali",
        "Pique-nique au désert · Déjeuner en « Gîte d'Étape » en montagne (M'Goun)",
        "Balade à dromadaire dans l'Erg Chebbi",
        "4x4 avec chauffeur du jour 2 au jour 8",
        "Visite guidée d'une demi-journée à Fès",
        "Transferts aéroports · Carburant · Assistance voyage",
      ],
    },
    excludes: {
      es: [
        "Las bebidas",
        "Las comidas y cenas no detalladas en el programa",
        "Otros extras personales (quads, masajes, tratamientos de spa…)",
        "El vuelo (salvo que se indique lo contrario)",
        "Suplemento opcional para seguro de cancelación · 45 € por persona para viajes de hasta 9 días",
      ],
      en: [
        "Drinks",
        "Lunches and dinners not specified in the programme",
        "Personal extras (quads, massages, spa treatments…)",
        "Flights (unless otherwise stated)",
        "Optional cancellation insurance · €45 per person for trips up to 9 days",
      ],
      fr: [
        "Boissons",
        "Déjeuners et dîners non spécifiés dans le programme",
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
        "Descuento niños (3-11 años) compartiendo con dos adultos: 460 € temporada baja · 435 € temporada alta.",
        "En temporada alta, los guías de medina pueden compartirse con otros viajeros.",
        "Chóferes hispanohablantes son limitados — reservar con antelación.",
        "Pasaporte vigente con un mínimo de 6 meses desde la fecha de regreso.",
        "Actividades opcionales: Quads 90 € por vehículo (2 horas).",
      ],
      en: [
        "Flight options: Royal Air Maroc, Vueling, Air Arabia, Ryanair.",
        "Rates depend on 4x4 occupancy. Cost is split between passengers.",
        "Rates based on double/triple rooms. Single supplement: €400.",
        "Children discount (3-11) sharing with two adults: €460 low season · €435 high season.",
        "In high season medina guides may be shared with other travellers.",
        "Spanish-speaking drivers are limited — book early.",
        "Valid passport required with at least 6 months remaining from the return date.",
        "Optional activities: Quads €90 per vehicle (2-hour circuit).",
      ],
      fr: [
        "Options de vols : Royal Air Maroc, Vueling, Air Arabia, Ryanair.",
        "Tarifs selon l'occupation du 4x4. Le coût est partagé entre les occupants.",
        "Tarifs base chambre double/triple. Supplément single : 400 €.",
        "Remise enfants (3-11 ans) partageant avec 2 adultes : 460 € basse · 435 € haute.",
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

export default PROGRAM_FOZ_78;
