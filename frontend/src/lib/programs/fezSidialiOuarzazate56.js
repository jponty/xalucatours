// Fez → Sidi Ali → Ouarzazate · 5 nights / 6 days. The reverse route of
// the FZS family but ending in Ouarzazate airport instead of Marrakech.
// Reuses 4 shared days and introduces 2 program-specific days
// (Khenifra National Park + Ziz Valley · Ouarzazate return transfer).

import {
  DAY_01_ARRIVAL_FEZ,
  DAY_03_ERFOUD_ERG_BIVOUAC,
  DAY_06_TODRA_DADES,
} from "./fezMarrakech910";
import { DAY_FZS_FEZ_ATLAS_SIDIALI } from "./fezSidialiMarrakech78";

const T = (es, en, fr) => ({ es, en, fr });

/* ============================================================
   Program-specific days
============================================================ */

export const DAY_FOZ_KHENIFRA_ZIZ_ERFOUD = {
  route_id: "foz56-khenifra-ziz-erfoud",
  id: "foz56-d3",
  image: "https://images.unsplash.com/photo-1542401886-65d6c61db217?auto=format&fit=crop&w=2000&q=85",
  accent: "#7C8B5C",
  title: T(
    "Parque Nacional de Khenifra · Valle del Ziz · Erfoud",
    "Khenifra National Park · Ziz Valley · Erfoud",
    "Parc National de Khénifra · Vallée du Ziz · Erfoud",
  ),
  chronologySummary: T(
    "Exploramos los cedros del Parque Nacional de Khenifra y descendemos por el palmeral del Ziz hasta Erfoud, puerta del desierto.",
    "We explore Khenifra National Park’s cedar forests and descend through the Ziz palm grove to Erfoud, gateway to the desert.",
    "Nous explorons les cèdres du Parc National de Khénifra puis descendons par la palmeraie du Ziz jusqu’à Erfoud, porte du désert.",
  ),
  body: {
    es: "Mañana en plena naturaleza dentro del Parque Nacional de Khenifra, en pleno corazón del Medio Atlas. Podremos descubrir el ecosistema único de cedros gigantes, atalayas naturales sobre el lago y senderos por la sabana alpina. Comida en el Hotel Xaluca Spa Aguelmane Sidi Ali. Por la tarde, ruta en 4x4 hacia el sur por el Valle del Ziz — hogar de más de diez millones de palmeras — hasta llegar a Erfoud, «la Puerta del Desierto». Cena y alojamiento en Kasbah Hotel Xaluca.",
    en: "A morning immersed in nature inside the Khenifra National Park, in the heart of the Middle Atlas. We discover the unique ecosystem of giant cedars, natural watchtowers over the lake, and footpaths across the alpine savanna. Lunch at Hotel Xaluca Spa Aguelmane Sidi Ali. In the afternoon, 4x4 ride south down the Ziz Valley — home to more than ten million palm trees — to Erfoud, «the Gate of the Desert». Dinner and overnight at Kasbah Hotel Xaluca.",
    fr: "Matinée en pleine nature au sein du Parc National de Khénifra, au cœur du Moyen Atlas. Nous découvrons l'écosystème unique des cèdres géants, des miradors naturels sur le lac et des sentiers dans la savane alpine. Déjeuner à l'Hôtel Xaluca Spa Aguelmane Sidi Ali. L'après-midi, descente en 4x4 par la Vallée du Ziz — abritant plus de dix millions de palmiers — jusqu'à Erfoud, « la Porte du Désert ». Dîner et nuit à la Kasbah Hôtel Xaluca.",
  },
  culture: [
    {
      title: T("Parque Nacional de Khenifra", "Khenifra National Park", "Parc National de Khénifra"),
      body: T(
        "84.000 ha protegidas desde 2008 — el cedro del Atlas, la encina y la jara comparten el bosque con macacos magot, jabalíes y zorros del Atlas.",
        "84,000 ha protected since 2008 — Atlas cedar, holm oak and rockrose share the forest with Barbary macaques, wild boar and Atlas foxes.",
        "84 000 ha protégées depuis 2008 — le cèdre de l'Atlas, le chêne vert et le ciste partagent la forêt avec les macaques de Barbarie, sangliers et renards de l'Atlas.",
      ),
    },
    {
      title: T("Valle del Ziz · diez millones de palmeras", "Ziz Valley · ten million palms", "Vallée du Ziz · dix millions de palmiers"),
      body: T(
        "El río Ziz forma el oasis del Tafilalet — cuna histórica de la dinastía alauí.",
        "The Ziz river forms the Tafilalet oasis, historic cradle of the Alawi dynasty.",
        "La rivière Ziz forme l'oasis du Tafilalet, berceau historique de la dynastie alaouite.",
      ),
    },
    {
      title: T("Erfoud · puerta del desierto", "Erfoud · gate of the desert", "Erfoud · porte du désert"),
      body: T(
        "Capital del Tafilalet, centro del comercio de dátiles y de los famosos fósiles devónicos de 360 millones de años.",
        "Capital of the Tafilalet, centre of the date trade and the famous 360-million-year-old Devonian fossils.",
        "Capitale du Tafilalet, centre du commerce de dattes et des célèbres fossiles dévoniens de 360 millions d'années.",
      ),
    },
  ],
};

export const DAY_FOZ_OUARZAZATE_RETURN = {
  route_id: "foz56-ouarzazate-return",
  id: "foz56-d6",
  image: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=2000&q=85",
  accent: "#A07042",
  title: T(
    "Ouarzazate · regreso",
    "Ouarzazate · return",
    "Ouarzazate · retour",
  ),
  chronologySummary: T(
    "Traslado al aeropuerto de Ouarzazate, con tiempo para descubrir Atlas Studios o pasear por la histórica Kasbah de Taourirt si el vuelo lo permite.",
    "Transfer to Ouarzazate airport, with time for Atlas Studios or the historic Taourirt Kasbah if the flight schedule allows.",
    "Transfert à l’aéroport d’Ouarzazate, avec une visite d’Atlas Studios ou de la Kasbah de Taourirt si l’horaire du vol le permet.",
  ),
  body: {
    es: "Tras el desayuno, traslado al aeropuerto de Ouarzazate para tomar el vuelo de regreso. Si la hora del vuelo lo permite, parada técnica en los estudios cinematográficos de Atlas Studios o paseo por la Kasbah de Taourirt — antigua residencia del Glaoui y uno de los conjuntos arquitectónicos preislámicos mejor conservados del país.",
    en: "After breakfast, transfer to Ouarzazate airport for the return flight. If flight time allows, a brief stop at the Atlas Studios film sets or a walk through the Taourirt Kasbah — former Glaoui residence and one of the best-preserved pre-Islamic architectural ensembles in the country.",
    fr: "Après le petit-déjeuner, transfert à l'aéroport d'Ouarzazate pour le vol retour. Si l'horaire du vol le permet, halte technique aux studios cinématographiques d'Atlas Studios ou promenade à la Kasbah de Taourirt — ancienne résidence des Glaoui et l'un des ensembles architecturaux pré-islamiques les mieux conservés du pays.",
  },
  culture: [
    {
      title: T("Ouarzazate · el «Hollywood marroquí»", "Ouarzazate · the «Moroccan Hollywood»", "Ouarzazate · le « Hollywood marocain »"),
      body: T(
        "Capital del cine marroquí desde los años 80. Aquí se rodaron Gladiator, Babel, Juego de Tronos, Misión Imposible y muchas más.",
        "Capital of Moroccan cinema since the 1980s. Gladiator, Babel, Game of Thrones, Mission Impossible and many more were filmed here.",
        "Capitale du cinéma marocain depuis les années 1980. Gladiator, Babel, Game of Thrones, Mission Impossible et bien d'autres y ont été tournés.",
      ),
    },
    {
      title: T("Kasbah de Taourirt", "Taourirt Kasbah", "Kasbah de Taourirt"),
      body: T(
        "Construida en el siglo XIX por la familia Glaoui — pacha de Marrakech y aliado del Protectorado francés. 300 habitaciones, patios escalonados y techos de cedro pintado.",
        "Built in the 19th century by the Glaoui family — pasha of Marrakech and ally of the French Protectorate. 300 rooms, terraced courtyards and painted cedar ceilings.",
        "Construite au XIXe siècle par la famille Glaoui — pacha de Marrakech et allié du Protectorat français. 300 pièces, cours en gradins et plafonds de cèdre peints.",
      ),
    },
  ],
};

/* ============================================================
   Program · 5 nights / 6 days · Fez → Sidi Ali → Ouarzazate
============================================================ */

export const PROGRAM_FOZ_56 = {
  routeId: "tourFezSidialiOzz56",
  duration_key: "foz5n6d",
  duration: T("5 noches / 6 días", "5 nights / 6 days", "5 nuits / 6 jours"),
  prices: { low: 1390, mid: 1590, high: 1790, premium: 2090 },
  route: [
    { day: 1, lat: 34.0651, lng: -4.9760, type: "city",    name: T("Fez · Llegada", "Fez · Arrival", "Fès · Arrivée") },
    { day: 2, lat: 33.0500, lng: -4.9650, type: "lake",    name: T("Aguelmane Sidi Ali", "Aguelmane Sidi Ali", "Aguelmane Sidi Ali") },
    { day: 3, lat: 31.4373, lng: -4.2330, type: "city",    name: T("Erfoud · Kasbah Xaluca", "Erfoud · Kasbah Xaluca", "Erfoud · Kasbah Xaluca") },
    { day: 4, lat: 31.1257, lng: -3.9789, type: "desert",  name: T("Erg Chebbi · Bivouac", "Erg Chebbi · Bivouac", "Erg Chebbi · Bivouac") },
    { day: 5, lat: 31.3582, lng: -5.9911, type: "gorge",   name: T("Boumalne Dadès · Todra", "Boumalne Dades · Todra", "Boumalne Dadès · Todra") },
    { day: 6, lat: 30.9189, lng: -6.8934, type: "airport", name: T("Ouarzazate · Aeropuerto", "Ouarzazate · Airport", "Ouarzazate · Aéroport") },
  ],
  days: [
    DAY_01_ARRIVAL_FEZ,
    DAY_FZS_FEZ_ATLAS_SIDIALI,
    DAY_FOZ_KHENIFRA_ZIZ_ERFOUD,
    DAY_03_ERFOUD_ERG_BIVOUAC,
    DAY_06_TODRA_DADES,
    DAY_FOZ_OUARZAZATE_RETURN,
  ],
  details: {
    includes: {
      es: [
        "Una noche en Fez en Riad en la Medina o Hotel 4★ en Media Pensión",
        "Una noche en Aguelmane Sidi Ali en Hotel Xaluca Spa Aguelmane Sidi Ali en Media Pensión",
        "Una noche en Erfoud en Kasbah Hotel Xaluca en Media Pensión",
        "Una noche en Erg Chebbi en Bivouac de Luxe en el desierto en Media Pensión",
        "Una noche en Boumalne Dades en Hotel Xaluca Dadès en Media Pensión",
        "Comida en el Hotel Xaluca Spa Aguelmane Sidi Ali",
        "Picnic en el desierto",
        "Excursión en dromedario por el Erg Chebbi",
        "Vehículo 4x4 con chófer del día 2 al día 6 del itinerario",
        "Visita guiada a media jornada en Fez",
        "Transfers desde y hacia aeropuertos · Combustible · Seguro de asistencia en viaje",
      ],
      en: [
        "One night in Fez at a Medina riad or 4★ hotel · half board",
        "One night at Aguelmane Sidi Ali (Hotel Xaluca Spa) · half board",
        "One night in Erfoud at Kasbah Hotel Xaluca · half board",
        "One night at the Bivouac de Luxe in the Erg Chebbi · half board",
        "One night in Boumalne Dades at Hotel Xaluca Dades · half board",
        "Lunch at Hotel Xaluca Spa Aguelmane Sidi Ali",
        "Picnic lunch in the desert",
        "Camel ride in the Erg Chebbi",
        "4x4 with driver from day 2 to day 6",
        "Half-day guided tour in Fez",
        "Airport transfers · Fuel · Travel assistance insurance",
      ],
      fr: [
        "Une nuit à Fès en riad de la médina ou hôtel 4★ · demi-pension",
        "Une nuit à Aguelmane Sidi Ali (Hôtel Xaluca Spa) · demi-pension",
        "Une nuit à Erfoud à la Kasbah Hôtel Xaluca · demi-pension",
        "Une nuit au Bivouac de Luxe dans l'Erg Chebbi · demi-pension",
        "Une nuit à Boumalne Dadès à l'Hôtel Xaluca Dadès · demi-pension",
        "Déjeuner à l'Hôtel Xaluca Spa Aguelmane Sidi Ali",
        "Pique-nique au désert",
        "Balade à dromadaire dans l'Erg Chebbi",
        "4x4 avec chauffeur du jour 2 au jour 6",
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
        "Tarifas basadas en habitaciones dobles/triples. Suplemento individual: 310 €.",
        "Descuento niños (3-11 años) compartiendo con dos adultos: 315 € temporada baja · 325 € temporada alta.",
        "En temporada alta, los guías de medina pueden compartirse con otros viajeros.",
        "Chóferes hispanohablantes son limitados — reservar con antelación.",
        "Pasaporte vigente con un mínimo de 6 meses desde la fecha de regreso.",
        "Actividades opcionales: Quads 90 € por vehículo (2 horas).",
      ],
      en: [
        "Flight options: Royal Air Maroc, Vueling, Air Arabia, Ryanair.",
        "Rates depend on 4x4 occupancy. Cost is split between passengers.",
        "Rates based on double/triple rooms. Single supplement: €310.",
        "Children discount (3-11) sharing with two adults: €315 low season · €325 high season.",
        "In high season medina guides may be shared with other travellers.",
        "Spanish-speaking drivers are limited — book early.",
        "Valid passport required with at least 6 months remaining from the return date.",
        "Optional activities: Quads €90 per vehicle (2-hour circuit).",
      ],
      fr: [
        "Options de vols : Royal Air Maroc, Vueling, Air Arabia, Ryanair.",
        "Tarifs selon l'occupation du 4x4. Le coût est partagé entre les occupants.",
        "Tarifs base chambre double/triple. Supplément single : 310 €.",
        "Remise enfants (3-11 ans) partageant avec 2 adultes : 315 € basse · 325 € haute.",
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

export default PROGRAM_FOZ_56;
