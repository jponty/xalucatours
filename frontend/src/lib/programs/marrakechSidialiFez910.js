// Marrakech → Sidi Ali → Fez · 9 nights / 10 days. Extends the 8n/9d
// variant by adding one extra night at Hotel Xaluca Dades to explore
// the M'Goun gorges (day 4). Total 9 nights / 10 days.

import {
  DAY_FRM_ARRIVAL_LIGHT,
  DAY_FRM_MARRAKECH_MEDINA,
  DAY_FRM_MGOUN,
  DAY_FRM_DADES_TODRA_ERFOUD_LIGHT,
  SHARED_FRM_DETAILS,
} from "@/lib/programs/marrakechFezShared";
import {
  DAY_02_TICHKA_AITBENHADDOU_DADES,
  DAY_04_DESERT_BIVOUAC,
  DAY_05_SUNRISE_KHAMLIA_RISSANI,
} from "@/lib/programs/marrakechFez67";
import { DAY_MSF_ZIZ_SIDIALI } from "@/lib/programs/marrakechSidialiFez78";
import {
  DAY_MSF_SIDIALI_FEZ_MEDINA,
  DAY_MSF_FEZ_RETURN,
} from "@/lib/programs/marrakechSidialiFez89";

const T = (es, en, fr) => ({ es, en, fr });

/* ============================================================
   Program · 9 nights / 10 days · Marrakech → Sidi Ali → Fez
============================================================ */

export const PROGRAM_MSF_910 = {
  routeId: "tourMarrakechSidialiFez910",
  duration_key: "msf9n10d",
  duration: T("9 noches / 10 días", "9 nights / 10 days", "9 nuits / 10 jours"),
  prices: { low: 2490, mid: 2790, high: 3090, premium: 3490 },
  route: [
    { day: 1,  lat: 31.6295, lng: -7.9811, type: "city",    name: T("Marrakech · Llegada", "Marrakech · Arrival", "Marrakech · Arrivée") },
    { day: 2,  lat: 31.6219, lng: -7.9831, type: "city",    name: T("Marrakech · Medina", "Marrakech · Medina", "Marrakech · Médina") },
    { day: 3,  lat: 31.3582, lng: -5.9911, type: "kasbah",  name: T("Aït Ben Haddou · Boumalne Dades", "Aït Ben Haddou · Boumalne Dades", "Aït Ben Haddou · Boumalne Dadès") },
    { day: 4,  lat: 31.5500, lng: -6.1200, type: "gorge",   name: T("Boutaghrar · M'Goun", "Boutaghrar · M'Goun", "Boutaghrar · M'Goun") },
    { day: 5,  lat: 31.4373, lng: -4.2330, type: "city",    name: T("Todra · Erfoud · Kasbah Xaluca", "Todra · Erfoud · Kasbah Xaluca", "Todra · Erfoud · Kasbah Xaluca") },
    { day: 6,  lat: 31.1257, lng: -3.9789, type: "desert",  name: T("Erg Chebbi · Bivouac", "Erg Chebbi · Bivouac", "Erg Chebbi · Bivouac") },
    { day: 7,  lat: 31.2828, lng: -4.2683, type: "market",  name: T("Khamlia · Rissani · Kasbah Xaluca", "Khamlia · Rissani · Kasbah Xaluca", "Khamlia · Rissani · Kasbah Xaluca") },
    { day: 8,  lat: 33.0500, lng: -4.9650, type: "lake",    name: T("Aguelmane Sidi Ali", "Aguelmane Sidi Ali", "Aguelmane Sidi Ali") },
    { day: 9,  lat: 34.0651, lng: -4.9760, type: "city",    name: T("Fez · Medina", "Fez · Medina", "Fès · Médina") },
    { day: 10, lat: 33.9273, lng: -4.9779, type: "airport", name: T("Fez · Aeropuerto", "Fez · Airport", "Fès · Aéroport") },
  ],
  days: [
    DAY_FRM_ARRIVAL_LIGHT,
    DAY_FRM_MARRAKECH_MEDINA,
    DAY_02_TICHKA_AITBENHADDOU_DADES,
    DAY_FRM_MGOUN,
    DAY_FRM_DADES_TODRA_ERFOUD_LIGHT,
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
        "Dos noches en Boumalne Dades en Hotel Xaluca Dadès 4★ en Media Pensión",
        "Dos noches en Erfoud en Kasbah Hotel Xaluca en Media Pensión",
        "Una noche en Erg Chebbi en Bivouac de Luxe en el desierto en Media Pensión",
        "Una noche en Timahdite en Hotel Xaluca Spa Aguelmane Sidi Ali en Media Pensión",
        "Una noche en Fez en Riad en la Medina u Hotel 4★ en Alojamiento y Desayuno",
        "Comida en Gîte d'Étape de montaña (día 4) · Picnic en el desierto (día 6) · Comida en Hotel Xaluca Spa Aguelmane Sidi Ali (día 8)",
        "Excursión en dromedario por el Erg Chebbi",
        "Vehículo 4x4 con chófer desde el día 3 hasta el día 9 del itinerario, ambos incluidos",
        "Visita con guía local en Marrakech · Visita con guía local en Fez",
        "Visitas a Aït Ben Haddou y Palacio de la Bahía",
        "Transfers desde y hacia aeropuertos · Combustible · Seguro de asistencia en viaje",
      ],
      en: [
        "Two nights in Marrakech in a Medina riad or 5★ hotel · bed & breakfast",
        "Two nights in Boumalne Dades at Hotel Xaluca Dades 4★ · half board",
        "Two nights in Erfoud at Kasbah Hotel Xaluca · half board",
        "One night at the Bivouac de Luxe in the Erg Chebbi · half board",
        "One night in Timahdite at Hotel Xaluca Spa Aguelmane Sidi Ali · half board",
        "One night in Fez in a Medina riad or 4★ hotel · bed & breakfast",
        "Lunch at a mountain Gîte d'Étape (day 4) · Picnic lunch in the desert (day 6) · Lunch at Hotel Xaluca Spa Aguelmane Sidi Ali (day 8)",
        "Camel ride in the Erg Chebbi",
        "4x4 with driver from day 3 to day 9 inclusive",
        "Local guided tour in Marrakech · Local guided tour in Fez",
        "Visits to Aït Ben Haddou and the Bahia Palace",
        "Airport transfers · Fuel · Travel assistance insurance",
      ],
      fr: [
        "Deux nuits à Marrakech en riad de la médina ou hôtel 5★ · petit-déjeuner",
        "Deux nuits à Boumalne Dadès à l'Hôtel Xaluca Dadès 4★ · demi-pension",
        "Deux nuits à Erfoud à la Kasbah Hôtel Xaluca · demi-pension",
        "Une nuit au Bivouac de Luxe dans l'Erg Chebbi · demi-pension",
        "Une nuit à Timahdite à l'Hôtel Xaluca Spa Aguelmane Sidi Ali · demi-pension",
        "Une nuit à Fès en riad de la médina ou hôtel 4★ · petit-déjeuner",
        "Déjeuner en Gîte d'Étape de montagne (jour 4) · Pique-nique au désert (jour 6) · Déjeuner à l'Hôtel Xaluca Spa Aguelmane Sidi Ali (jour 8)",
        "Balade à dromadaire dans l'Erg Chebbi",
        "4x4 avec chauffeur du jour 3 au jour 9 inclus",
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
        "Tarifas basadas en habitaciones dobles y triples. Suplemento individual: 635 €.",
        "Descuento niños (3-11 años) compartiendo con dos adultos: 440 € temporada baja · 455 € temporada alta.",
        "En temporada alta, los guías de medina pueden compartirse con otros viajeros.",
        "Chóferes hispanohablantes son limitados — reservar con antelación.",
        "Los guías oficiales están reservados exclusivamente para las visitas a las medinas, no para las rutas.",
        "Es obligatorio pasaporte vigente con un mínimo de 3 meses desde la fecha de regreso (puede enviarse posteriormente si está en renovación).",
        "Actividades opcionales: quads 70 € por vehículo (circuito de 1 hora). Spa y masajes en recepción del hotel.",
        "El mercado de Rissani se celebra los martes, jueves y domingos.",
        "Cuando los vuelos salen por la tarde, la visita guiada de Fez puede reubicarse al día 10.",
      ],
      en: [
        "Flight options: Royal Air Maroc, Vueling, Air Arabia, Ryanair.",
        "Rates depend on 4x4 occupancy. Cost is split between passengers.",
        "Rates based on double and triple rooms. Single room supplement: €635.",
        "Children discount (3-11) sharing with two adults: €440 low season · €455 high season.",
        "In high season medina guides may be shared with other travellers.",
        "Spanish-speaking drivers are limited — book early.",
        "Official guides are reserved exclusively for medina visits, not for the on-road portions.",
        "Valid passport required with at least 3 months remaining from the return date (may be sent later if being renewed).",
        "Optional activities: quads €70 per vehicle (1-hour circuit). Spa & massages at hotel reception.",
        "Rissani market runs Tuesday, Thursday and Sunday.",
        "When flights depart in the afternoon, the Fez guided tour may be relocated to day 10.",
      ],
      fr: [
        "Options de vol : Royal Air Maroc, Vueling, Air Arabia, Ryanair.",
        "Tarifs selon l'occupation du 4x4. Le coût est partagé entre les occupants.",
        "Tarifs base chambre double et triple. Supplément single : 635 €.",
        "Réduction enfants (3-11 ans) partageant avec 2 adultes : 440 € basse · 455 € haute.",
        "En haute saison, les guides de médina peuvent être partagés.",
        "Chauffeurs hispanophones limités — réserver tôt.",
        "Les guides officiels sont réservés aux visites des médinas, pas aux trajets.",
        "Passeport valable au minimum 3 mois après le retour (peut être envoyé ultérieurement s'il est en renouvellement).",
        "Activités en option : quads 70 € par véhicule (1 h). Spa et massages à la réception de l'hôtel.",
        "Marché de Rissani les mardi, jeudi et dimanche.",
        "Quand les vols partent l'après-midi, la visite guidée de Fès peut être déplacée au jour 10.",
      ],
    },
    terms: SHARED_FRM_DETAILS.terms,
  },
};

export default PROGRAM_MSF_910;
