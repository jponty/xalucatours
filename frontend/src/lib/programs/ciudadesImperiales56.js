// Programa 69 · Ciudades Imperiales · Casablanca → Rabat → Chefchaouen → Meknes → Fez.
// The six-day route is distinct from the older Casablanca → Marrakech 6n/7d page.
import {
  DAY_CI_CASA_RABAT,
  DAY_CI_MEKNES_FEZ,
  DAY_CI_FEZ_MEDINA,
} from "@/lib/programs/ciudadesImperiales45";

const T = (es, en, fr) => ({ es, en, fr });

const DAY_RABAT_CHEFCHAOUEN = {
  route_id: "ci56-rabat-chefchaouen",
  id: "ci56-d2",
  image: "https://images.unsplash.com/photo-1564507004663-b6dfb3c824d5?auto=format&fit=crop&w=2000&q=85",
  accent: "#5A7F9C",
  title: T("Rabat · Akchour · Chefchaouen", "Rabat · Akchour · Chefchaouen", "Rabat · Akchour · Chefchaouen"),
  chronologySummary: T(
    "Visita guiada de Rabat y continuación por el Rif, con parada en Akchour, hasta Chefchaouen.",
    "Guided tour of Rabat, then on through the Rif via Akchour to Chefchaouen.",
    "Visite guidée de Rabat puis route par le Rif et Akchour vers Chefchaouen.",
  ),
  body: {
    es: "Por la mañana visitaremos Rabat con un guía local: la Kasbah de los Oudaias, la Torre Hassan, el Mausoleo de Mohammed V y el Chellah. Por la tarde viajaremos hacia Chefchaouen. En el camino nos desviaremos a las cascadas de Akchour para pasear y hacer fotografías. Llegada al pueblo azul, tiempo libre en la medina, cena y alojamiento en riad.",
    en: "In the morning we visit Rabat with a local guide: the Kasbah of the Oudaias, Hassan Tower, the Mausoleum of Mohammed V and Chellah. In the afternoon we travel to Chefchaouen, stopping at the Akchour waterfalls for a walk and photographs. Free time in the blue medina, dinner and overnight in a riad.",
    fr: "Le matin, visite de Rabat avec un guide local : kasbah des Oudaïas, tour Hassan, mausolée Mohammed V et Chellah. L'après-midi, route vers Chefchaouen avec un arrêt aux cascades d'Akchour. Temps libre dans la médina bleue, dîner et nuit en riad.",
  },
  culture: [],
};

const DAY_CHEFCHAOUEN_MEKNES = {
  route_id: "ci56-chefchaouen-meknes",
  id: "ci56-d3",
  image: "https://images.unsplash.com/photo-1597212618440-806262de4f6b?auto=format&fit=crop&w=2000&q=85",
  accent: "#5A6B4F",
  title: T("Chefchaouen · Volubilis · Moulay Idriss · Meknes", "Chefchaouen · Volubilis · Moulay Idriss · Meknes", "Chefchaouen · Volubilis · Moulay Idriss · Meknès"),
  chronologySummary: T(
    "Recorremos Chefchaouen con guía antes de visitar Volubilis y pasar por Moulay Idriss rumbo a Meknes.",
    "We explore Chefchaouen with a guide before visiting Volubilis and travelling via Moulay Idriss to Meknes.",
    "Visite guidée de Chefchaouen, puis Volubilis et Moulay Idriss avant Meknès.",
  ),
  body: {
    es: "Tras el desayuno, visita guiada de Chefchaouen: la Plaza Uta el-Hammam, la Kasbah y sus jardines, el Mellah, Bab el-Ansar y la fuente Ras el-Maa. Continuaremos hacia las ruinas romanas de Volubilis y, de camino a Meknes, pasaremos por la ciudad santa de Moulay Idriss. Cena y alojamiento en hotel 4★ o riad en Meknes.",
    en: "After breakfast, guided walk through Chefchaouen: Uta el-Hammam square, the Kasbah and gardens, the Mellah, Bab el-Ansar and Ras el-Maa spring. We continue to Roman Volubilis, then pass through holy Moulay Idriss on the way to Meknes. Dinner and overnight in a 4-star hotel or riad in Meknes.",
    fr: "Après le petit-déjeuner, visite guidée de Chefchaouen : place Uta el-Hammam, kasbah et jardins, Mellah, Bab el-Ansar et source Ras el-Maa. Route vers les ruines romaines de Volubilis, puis passage par Moulay Idriss avant Meknès. Dîner et nuit en hôtel 4 étoiles ou riad à Meknès.",
  },
  culture: [],
};

const DAY_RETURN = {
  route_id: "ci56-return",
  id: "ci56-d6",
  image: "https://images.unsplash.com/photo-1570133435536-7ececf000ef6?auto=format&fit=crop&w=2000&q=85",
  accent: "#5C5248",
  title: T("Regreso desde Fez", "Return from Fez", "Retour depuis Fès"),
  chronologySummary: T("Traslado al aeropuerto de Fez para el vuelo de regreso.", "Transfer to Fez airport for the return flight.", "Transfert à l'aéroport de Fès pour le vol retour."),
  body: {
    es: "A la hora convenida, recogida en el alojamiento y traslado al aeropuerto de Fez para tomar el vuelo de regreso.",
    en: "At the agreed time, pick-up from the accommodation and transfer to Fez airport for the return flight.",
    fr: "À l'heure convenue, transfert de l'hébergement à l'aéroport de Fès pour le vol retour.",
  },
  culture: [],
};

export const PROGRAM_CI_56 = {
  routeId: "tourCiudadesImperiales56",
  duration_key: "ci5n6d",
  duration: T("5 noches / 6 días", "5 nights / 6 days", "5 nuits / 6 jours"),
  meta: {
    es: {
      title: "Ciudades imperiales y Chefchaouen.", eyebrow_prefix: "Circuito · Norte de Marruecos",
      place: "Casablanca · Rabat · Chefchaouen · Meknes · Fez",
      subtitle: "Seis días de cultura entre las ciudades imperiales, las cascadas de Akchour y el pueblo azul del Rif.",
      hero_image: "https://images.unsplash.com/photo-1564507004663-b6dfb3c824d5?auto=format&fit=crop&w=2400&q=85",
      airports: "Entrada Casablanca · Salida Fez", quick_airports: "Casablanca / Fez",
      quick_places: "Casablanca · Rabat · Akchour · Chefchaouen · Volubilis · Moulay Idriss · Meknes · Fez",
      highlights: "Mezquita Hassan II · Chellah · Chefchaouen · Volubilis · Fez el-Bali",
      description_title: "Una ruta cultural con una noche en el Rif.",
      description: ["Desde Casablanca y Rabat seguimos hacia Chefchaouen, la ciudad azul del Rif.", "Después de Volubilis y Meknes, terminamos con la medina de Fez y sus oficios tradicionales."],
    },
    en: {
      title: "Imperial cities and Chefchaouen.", eyebrow_prefix: "Circuit · Northern Morocco",
      place: "Casablanca · Rabat · Chefchaouen · Meknes · Fez",
      subtitle: "Six cultural days through the imperial cities, Akchour waterfalls and the blue town of the Rif.",
      hero_image: "https://images.unsplash.com/photo-1564507004663-b6dfb3c824d5?auto=format&fit=crop&w=2400&q=85",
      airports: "In Casablanca · Out Fez", quick_airports: "Casablanca / Fez",
      quick_places: "Casablanca · Rabat · Akchour · Chefchaouen · Volubilis · Moulay Idriss · Meknes · Fez",
      highlights: "Hassan II Mosque · Chellah · Chefchaouen · Volubilis · Fez el-Bali",
      description_title: "A cultural route with a night in the Rif.",
      description: ["From Casablanca and Rabat we head to blue Chefchaouen in the Rif.", "After Volubilis and Meknes, we finish in Fez's medina and traditional workshops."],
    },
    fr: {
      title: "Cités impériales et Chefchaouen.", eyebrow_prefix: "Circuit · Nord du Maroc",
      place: "Casablanca · Rabat · Chefchaouen · Meknès · Fès",
      subtitle: "Six jours de culture entre cités impériales, cascades d'Akchour et village bleu du Rif.",
      hero_image: "https://images.unsplash.com/photo-1564507004663-b6dfb3c824d5?auto=format&fit=crop&w=2400&q=85",
      airports: "Arrivée Casablanca · Sortie Fès", quick_airports: "Casablanca / Fès",
      quick_places: "Casablanca · Rabat · Akchour · Chefchaouen · Volubilis · Moulay Idriss · Meknès · Fès",
      highlights: "Mosquée Hassan II · Chellah · Chefchaouen · Volubilis · Fès el-Bali",
      description_title: "Un circuit culturel avec une nuit dans le Rif.",
      description: ["De Casablanca et Rabat, nous rejoignons Chefchaouen, la ville bleue du Rif.", "Après Volubilis et Meknès, nous terminons dans la médina de Fès et ses ateliers traditionnels."],
    },
  },
  route: [
    { day: 1, lat: 33.5731, lng: -7.5898, type: "airport", name: T("Casablanca · llegada", "Casablanca · arrival", "Casablanca · arrivée") },
    { day: 1, lat: 34.0209, lng: -6.8416, type: "city", name: T("Rabat", "Rabat", "Rabat") },
    { day: 2, lat: 35.2330, lng: -5.1690, type: "city", name: T("Akchour", "Akchour", "Akchour") },
    { day: 2, lat: 35.1689, lng: -5.2636, type: "city", name: T("Chefchaouen", "Chefchaouen", "Chefchaouen") },
    { day: 3, lat: 34.0731, lng: -5.5547, type: "unesco", name: T("Volubilis", "Volubilis", "Volubilis") },
    { day: 3, lat: 33.8930, lng: -5.5473, type: "city", name: T("Meknes", "Meknes", "Meknès") },
    { day: 4, lat: 34.0651, lng: -4.9760, type: "city", name: T("Fez", "Fez", "Fès") },
    { day: 6, lat: 33.9273, lng: -4.9779, type: "airport", name: T("Fez · regreso", "Fez · return", "Fès · retour") },
  ],
  days: [DAY_CI_CASA_RABAT, DAY_RABAT_CHEFCHAOUEN, DAY_CHEFCHAOUEN_MEKNES, DAY_CI_MEKNES_FEZ, DAY_CI_FEZ_MEDINA, DAY_RETURN],
  details: {
    includes: {
      es: ["Una noche en Rabat en riad u hotel 4★ · media pensión", "Una noche en Chefchaouen en riad u hotel 4★ · media pensión", "Una noche en Meknes en riad u hotel 4★ · media pensión", "Dos noches en Fez en riad u hotel 4★ · media pensión", "Vehículo con chófer del día 1 al 5", "Visitas guiadas de Rabat, Chefchaouen, Volubilis, Meknes y Fez según programa", "Traslados de aeropuerto", "Seguro de asistencia en viaje y cancelación según condiciones"],
      en: ["One night in Rabat, Chefchaouen and Meknes each; two nights in Fez · half board", "Vehicle with driver from day 1 to 5", "Guided visits to Rabat, Chefchaouen, Volubilis, Meknes and Fez as described", "Airport transfers", "Travel assistance and cancellation insurance subject to terms"],
      fr: ["Une nuit à Rabat, Chefchaouen et Meknès ; deux nuits à Fès · demi-pension", "Véhicule avec chauffeur du jour 1 au 5", "Visites guidées de Rabat, Chefchaouen, Volubilis, Meknès et Fès selon le programme", "Transferts aéroport", "Assurance assistance voyage et annulation selon conditions"],
    },
    excludes: {
      es: ["Bebidas", "Comidas del mediodía", "Gastos personales", "Vuelos"],
      en: ["Drinks", "Lunches", "Personal expenses", "Flights"],
      fr: ["Boissons", "Déjeuners", "Dépenses personnelles", "Vols"],
    },
    notes: { es: ["Consulta las condiciones de alojamiento, vuelos y cancelación en el documento del programa."], en: ["See the programme document for accommodation, flight and cancellation conditions."], fr: ["Consultez le document du programme pour les conditions d'hébergement, de vol et d'annulation."] },
    terms: { es: [], en: [], fr: [] },
  },
};

export default PROGRAM_CI_56;
