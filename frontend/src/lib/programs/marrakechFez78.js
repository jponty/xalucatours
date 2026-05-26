// Marrakech → Fez · 7 nights / 8 days
import {
  DAY_FRM_ARRIVAL_LIGHT,
  DAY_FRM_MARRAKECH_MEDINA,
  SHARED_FRM_DETAILS,
} from "@/lib/programs/marrakechFezShared";
import {
  DAY_02_TICHKA_AITBENHADDOU_DADES,
  DAY_03_DADES_TODRA_ERFOUD,
  DAY_04_DESERT_BIVOUAC,
  DAY_05_SUNRISE_KHAMLIA_RISSANI,
  DAY_06_ZIZ_IFRANE_FEZ,
  DAY_07_FEZ_MEDINA_RETURN,
} from "@/lib/programs/marrakechFez67";

const T = (es, en, fr) => ({ es, en, fr });

export const PROGRAM_FRM_78 = {
  routeId: "tourMarrakechFez78",
  duration_key: "frm7n8d",
  duration: T("7 noches / 8 días", "7 nights / 8 days", "7 nuits / 8 jours"),
  prices: { low: 2090, mid: 2390, high: 2690, premium: 3090 },
  route: [
    { day: 1, lat: 31.6295, lng: -7.9811, type: "city",    name: T("Marrakech · Llegada", "Marrakech · Arrival", "Marrakech · Arrivée") },
    { day: 2, lat: 31.6219, lng: -7.9831, type: "city",    name: T("Marrakech · Medina", "Marrakech · Medina", "Marrakech · Médina") },
    { day: 3, lat: 31.3582, lng: -5.9911, type: "kasbah",  name: T("Aït Ben Haddou · Boumalne Dades", "Aït Ben Haddou · Boumalne Dades", "Aït Ben Haddou · Boumalne Dadès") },
    { day: 4, lat: 31.4373, lng: -4.2330, type: "city",    name: T("Todra · Erfoud · Kasbah Xaluca", "Todra · Erfoud · Kasbah Xaluca", "Todra · Erfoud · Kasbah Xaluca") },
    { day: 5, lat: 31.1257, lng: -3.9789, type: "desert",  name: T("Erg Chebbi · Bivouac", "Erg Chebbi · Bivouac", "Erg Chebbi · Bivouac") },
    { day: 6, lat: 31.2828, lng: -4.2683, type: "market",  name: T("Khamlia · Rissani · Kasbah Xaluca", "Khamlia · Rissani · Kasbah Xaluca", "Khamlia · Rissani · Kasbah Xaluca") },
    { day: 7, lat: 33.5228, lng: -5.1106, type: "gorge",   name: T("Valle del Ziz · Ifrane · Cedros", "Ziz Valley · Ifrane · Cedars", "Vallée du Ziz · Ifrane · Cèdres") },
    { day: 8, lat: 33.9273, lng: -4.9779, type: "airport", name: T("Fez · Medina · Aeropuerto", "Fez · Medina · Airport", "Fès · Médina · Aéroport") },
  ],
  days: [
    DAY_FRM_ARRIVAL_LIGHT,
    DAY_FRM_MARRAKECH_MEDINA,
    DAY_02_TICHKA_AITBENHADDOU_DADES,
    DAY_03_DADES_TODRA_ERFOUD,
    DAY_04_DESERT_BIVOUAC,
    DAY_05_SUNRISE_KHAMLIA_RISSANI,
    DAY_06_ZIZ_IFRANE_FEZ,
    DAY_07_FEZ_MEDINA_RETURN,
  ],
  details: {
    includes: {
      es: [
        "Dos noches en Marrakech en Riad en la Medina u Hotel 5★ · Alojamiento y Desayuno",
        "Una noche en Boumalne Dades en Hotel Xaluca Dadès · Media Pensión",
        "Dos noches en Erfoud en Kasbah Hotel Xaluca · Media Pensión",
        "Una noche en Erg Chebbi en Bivouac de Luxe en el Desierto · Media Pensión",
        "Una noche en Fez en Riad en la Medina u Hotel 4★ · Media Pensión",
        "Comida a mediodía tipo picnic en el desierto",
        "Excursión en dromedario",
        "Vehículo 4x4 con chófer desde el día 3 hasta el día 7 del itinerario, ambos incluidos",
        "Visita con guía local en Marrakech · Visita con guía local en Fez",
        "Visitas a Aït Ben Haddou y Palacio de la Bahía",
        "Transfers aeropuertos · Combustible · Seguro de asistencia en viaje",
      ],
      en: [
        "Two nights in Marrakech in a Medina riad or 5★ hotel · bed & breakfast",
        "One night in Boumalne Dades at Hotel Xaluca Dades · half board",
        "Two nights in Erfoud at Kasbah Hotel Xaluca · half board",
        "One night at the Bivouac de Luxe in the Erg Chebbi · half board",
        "One night in Fez in a Medina riad or 4★ hotel · half board",
        "Picnic lunch in the desert",
        "Camel ride",
        "4x4 with driver from day 3 to day 7 inclusive",
        "Local guided tour in Marrakech · Local guided tour in Fez",
        "Visits to Aït Ben Haddou and the Bahia Palace",
        "Airport transfers · Fuel · Travel assistance insurance",
      ],
      fr: [
        "Deux nuits à Marrakech en riad de la médina ou hôtel 5★ · petit-déjeuner",
        "Une nuit à Boumalne Dadès à l'Hôtel Xaluca Dadès · demi-pension",
        "Deux nuits à Erfoud à la Kasbah Hôtel Xaluca · demi-pension",
        "Une nuit au Bivouac de Luxe dans l'Erg Chebbi · demi-pension",
        "Une nuit à Fès en riad de la médina ou hôtel 4★ · demi-pension",
        "Pique-nique au désert",
        "Balade à dromadaire",
        "4x4 avec chauffeur du jour 3 au jour 7 inclus",
        "Guide local à Marrakech · Guide local à Fès",
        "Visites d'Aït Ben Haddou et du palais de la Bahia",
        "Transferts aéroports · Carburant · Assistance voyage",
      ],
    },
    excludes: SHARED_FRM_DETAILS.excludes,
    notes: SHARED_FRM_DETAILS.notes,
    terms: SHARED_FRM_DETAILS.terms,
  },
};

export default PROGRAM_FRM_78;
