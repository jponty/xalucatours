// Marrakech → Fez · 8 nights / 9 days
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
  DAY_06_ZIZ_IFRANE_FEZ,
  DAY_07_FEZ_MEDINA_RETURN,
} from "@/lib/programs/marrakechFez67";

const T = (es, en, fr) => ({ es, en, fr });

export const PROGRAM_FRM_89 = {
  routeId: "tourMarrakechFez89",
  duration_key: "frm8n9d",
  duration: T("8 noches / 9 días", "8 nights / 9 days", "8 nuits / 9 jours"),
  prices: { low: 2390, mid: 2690, high: 2990, premium: 3390 },
  route: [
    { day: 1, lat: 31.6295, lng: -7.9811, type: "city",    name: T("Marrakech · Llegada", "Marrakech · Arrival", "Marrakech · Arrivée") },
    { day: 2, lat: 31.6219, lng: -7.9831, type: "city",    name: T("Marrakech · Medina", "Marrakech · Medina", "Marrakech · Médina") },
    { day: 3, lat: 31.3582, lng: -5.9911, type: "kasbah",  name: T("Aït Ben Haddou · Boumalne Dades", "Aït Ben Haddou · Boumalne Dades", "Aït Ben Haddou · Boumalne Dadès") },
    { day: 4, lat: 31.4900, lng: -5.7950, type: "gorge",   name: T("Boutaghrar · Amskar · M'Goun", "Boutaghrar · Amskar · M'Goun", "Boutaghrar · Amskar · M'Goun") },
    { day: 5, lat: 31.4373, lng: -4.2330, type: "city",    name: T("Dades · Todra · Erfoud", "Dades · Todra · Erfoud", "Dadès · Todra · Erfoud") },
    { day: 6, lat: 31.1257, lng: -3.9789, type: "desert",  name: T("Erg Chebbi · Bivouac", "Erg Chebbi · Bivouac", "Erg Chebbi · Bivouac") },
    { day: 7, lat: 31.2828, lng: -4.2683, type: "market",  name: T("Khamlia · Rissani · Kasbah Xaluca", "Khamlia · Rissani · Kasbah Xaluca", "Khamlia · Rissani · Kasbah Xaluca") },
    { day: 8, lat: 33.5228, lng: -5.1106, type: "gorge",   name: T("Valle del Ziz · Ifrane · Cedros", "Ziz Valley · Ifrane · Cedars", "Vallée du Ziz · Ifrane · Cèdres") },
    { day: 9, lat: 33.9273, lng: -4.9779, type: "airport", name: T("Fez · Medina · Aeropuerto", "Fez · Medina · Airport", "Fès · Médina · Aéroport") },
  ],
  days: [
    DAY_FRM_ARRIVAL_LIGHT,
    DAY_FRM_MARRAKECH_MEDINA,
    DAY_02_TICHKA_AITBENHADDOU_DADES,
    DAY_FRM_MGOUN,
    DAY_FRM_DADES_TODRA_ERFOUD_LIGHT,
    DAY_04_DESERT_BIVOUAC,
    DAY_05_SUNRISE_KHAMLIA_RISSANI,
    DAY_06_ZIZ_IFRANE_FEZ,
    DAY_07_FEZ_MEDINA_RETURN,
  ],
  details: {
    includes: {
      es: [
        "Dos noches en Marrakech en Riad en la Medina u Hotel 5★ · Alojamiento y Desayuno",
        "Dos noches en Boumalne Dades en Hotel Xaluca Dadès · Media Pensión",
        "Dos noches en Erfoud en Kasbah Hotel Xaluca · Media Pensión",
        "Una noche en Erg Chebbi en Bivouac de Luxe · Media Pensión",
        "Una noche en Fez en Riad en la Medina u Hotel 4★ · Media Pensión",
        "Comida a mediodía en «Gîte d'Étape» en la montaña (día 4 del itinerario)",
        "Comida a mediodía tipo picnic en el desierto (día 6 del itinerario)",
        "Excursión en dromedario",
        "Vehículo 4x4 con chófer desde el día 3 hasta el día 8 del itinerario, ambos incluidos",
        "Visita con guía local en Marrakech · Visita con guía local en Fez",
        "Visitas a Aït Ben Haddou y Palacio de la Bahía",
        "Transfers aeropuertos · Combustible · Seguro de asistencia en viaje",
      ],
      en: [
        "Two nights in Marrakech in a Medina riad or 5★ hotel · bed & breakfast",
        "Two nights in Boumalne Dades at Hotel Xaluca Dades · half board",
        "Two nights in Erfoud at Kasbah Hotel Xaluca · half board",
        "One night at the Bivouac de Luxe · half board",
        "One night in Fez in a Medina riad or 4★ hotel · half board",
        "Mountain lunch at a «Gîte d'Étape» (day 4)",
        "Picnic lunch in the desert (day 6)",
        "Camel ride",
        "4x4 with driver from day 3 to day 8 inclusive",
        "Local guided tour in Marrakech · Local guided tour in Fez",
        "Visits to Aït Ben Haddou and the Bahia Palace",
        "Airport transfers · Fuel · Travel assistance insurance",
      ],
      fr: [
        "Deux nuits à Marrakech en riad de la médina ou hôtel 5★ · petit-déjeuner",
        "Deux nuits à Boumalne Dadès à l'Hôtel Xaluca Dadès · demi-pension",
        "Deux nuits à Erfoud à la Kasbah Hôtel Xaluca · demi-pension",
        "Une nuit au Bivouac de Luxe · demi-pension",
        "Une nuit à Fès en riad de la médina ou hôtel 4★ · demi-pension",
        "Déjeuner en « Gîte d'Étape » dans la montagne (jour 4)",
        "Pique-nique au désert (jour 6)",
        "Balade à dromadaire",
        "4x4 avec chauffeur du jour 3 au jour 8 inclus",
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

export default PROGRAM_FRM_89;
