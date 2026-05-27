// Fez + Aguelmame Sidi Ali · 3 nights / 4 days
// Reuses arrival + medina days from escapadaFez23 and adds the Middle Atlas
// drive to Aguelmame Sidi Ali lake before the return flight from Fez.
import { DAY_FEZ_ARRIVAL, DAY_FEZ_MEDINA } from "@/lib/programs/escapadaFez23";

const T = (es, en, fr) => ({ es, en, fr });

export const DAY_FEZ_SIDIALI = {
  route_id: "escfs34-fez-sidiali",
  id: "escfs34-d3",
  image: "https://images.unsplash.com/photo-1542401886-65d6c61db217?auto=format&fit=crop&w=2000&q=85",
  accent: "#5A6B4F",
  title: T(
    "Fez · Ifrane · cedros · Aguelmame Sidi Ali",
    "Fez · Ifrane · cedars · Aguelmame Sidi Ali",
    "Fès · Ifrane · cèdres · Aguelmame Sidi Ali",
  ),
  body: {
    es: "Salida por la mañana hacia el sur cruzando el Medio Atlas. Primera parada en Ifrane — conocida como «la pequeña Suiza» por su arquitectura alpina y sus tejados a dos aguas — y continuación por los famosos Bosques de Cedros Gigantes, hogar de una colonia de monos magot que, con suerte, podremos alimentar en plena naturaleza. La ruta atraviesa zonas montañosas hasta llegar a Aguelmame Sidi Ali, situado a 2.200 metros de altitud junto al lago natural más profundo del país, formado en el cráter de un volcán extinto. Comida en el hotel. Por la tarde, tiempo para disfrutar del entorno y de las instalaciones: paseo alrededor del lago, subida opcional al cráter del volcán cercano, visita a una familia nómada Aït Atta, piscina climatizada, spa y hammam. Cena y alojamiento en Xaluca Spa Aguelmame Sidi Ali, refugio construido en 1935 y restaurado recientemente como hotel boutique de alta montaña.",
    en: "Morning departure south, crossing the Middle Atlas. First stop at Ifrane — known as «little Switzerland» for its Alpine architecture and pitched roofs — and continuation through the famous Giant Cedar Forests, home to a colony of Barbary macaques we may be lucky enough to feed in the wild. The route crosses mountainous areas to reach Aguelmame Sidi Ali, set at 2,200 m altitude beside the country's deepest natural lake, formed in the crater of an extinct volcano. Lunch at the hotel. In the afternoon, time to enjoy the surroundings and facilities: walk around the lake, optional climb to the nearby volcanic crater, visit to an Aït Atta nomadic family, heated pool, spa and hammam. Dinner and overnight at Xaluca Spa Aguelmame Sidi Ali, a 1935 hunting lodge recently restored as a mountain boutique hotel.",
    fr: "Départ matinal vers le sud en traversant le Moyen Atlas. Premier arrêt à Ifrane — surnommée « la petite Suisse » pour son architecture alpine et ses toits en pente — et continuation par les célèbres Forêts de Cèdres Géants, foyer d'une colonie de macaques de Barbarie que nous pourrons nourrir en pleine nature. La route traverse des zones montagneuses jusqu'à Aguelmame Sidi Ali, à 2 200 m d'altitude au bord du lac naturel le plus profond du pays, formé dans le cratère d'un volcan éteint. Déjeuner à l'hôtel. L'après-midi, temps libre pour profiter du cadre et des installations : promenade autour du lac, ascension en option du cratère volcanique voisin, visite d'une famille nomade Aït Atta, piscine chauffée, spa et hammam. Dîner et nuit au Xaluca Spa Aguelmame Sidi Ali, ancien relais de chasse de 1935 restauré en hôtel-boutique de montagne.",
  },
  wellness: [
    { es: "Paseo lacustre · 4 km", en: "Lake walk · 4 km", fr: "Promenade lacustre · 4 km" },
    { es: "Cráter volcánico", en: "Volcanic crater", fr: "Cratère volcanique" },
    { es: "Piscina climatizada", en: "Heated pool", fr: "Piscine chauffée" },
    { es: "Spa & hammam (opcional)", en: "Spa & hammam (optional)", fr: "Spa & hammam (option)" },
  ],
  culture: [
    {
      title: T("Ifrane · la pequeña Suiza marroquí", "Ifrane · little Moroccan Switzerland", "Ifrane · la petite Suisse marocaine"),
      body: T(
        "A 1.665 m de altitud, diseñada por arquitectos franceses en los años 30 con tejados a dos aguas — un pueblo alpino en pleno Marruecos.",
        "At 1,665 m, designed by French architects in the 1930s with pitched roofs — an Alpine village in the heart of Morocco.",
        "À 1 665 m d'altitude, conçue par des architectes français dans les années 1930 avec ses toits en pente.",
      ),
    },
    {
      title: T("Cedros del Atlas y monos magot", "Atlas cedars and Barbary macaques", "Cèdres de l'Atlas et macaques de Barbarie"),
      body: T(
        "Los bosques del Medio Atlas son uno de los últimos santuarios del macaco de Berbería, la única especie de primate que vive de forma silvestre al norte del Sáhara.",
        "The Middle Atlas forests are one of the last sanctuaries of the Barbary macaque, the only primate species living wild north of the Sahara.",
        "Les forêts du Moyen Atlas constituent l'un des derniers sanctuaires du macaque de Barbarie.",
      ),
    },
    {
      title: T("Lago Aguelmame Sidi Ali", "Aguelmame Sidi Ali lake", "Lac Aguelmame Sidi Ali"),
      body: T(
        "El lago natural más profundo de Marruecos (≈ 60 m), formado en el cráter de un volcán extinto. Refugio invernal de flamencos rosados y aves migratorias.",
        "Morocco's deepest natural lake (≈ 60 m), formed in an extinct volcanic crater. Winter refuge for flamingos and migratory birds.",
        "Lac naturel le plus profond du Maroc (≈ 60 m), formé dans le cratère d'un volcan éteint.",
      ),
    },
  ],
};

const DAY_RETURN = {
  route_id: "escfs34-return",
  id: "escfs34-d4",
  image: "https://images.unsplash.com/photo-1547234935-80c7145ec969?auto=format&fit=crop&w=2000&q=85",
  accent: "#5C5248",
  title: T("Sidi Ali · regreso desde el aeropuerto de Fez", "Sidi Ali · return from Fez airport", "Sidi Ali · retour depuis l'aéroport de Fès"),
  body: {
    es: "Después del desayuno en el hotel — recomendamos madrugar para disfrutar del amanecer sobre el lago y, si el tiempo acompaña, asomarse al cráter del volcán cercano —, traslado por el Medio Atlas hasta el aeropuerto de Fez para tomar el vuelo de regreso. Nota: la jornada incluye desplazamiento por carretera de aproximadamente 2 h 30 min.",
    en: "After breakfast at the hotel — we recommend an early start to enjoy the sunrise over the lake and, weather permitting, a peek at the nearby volcanic crater —, transfer through the Middle Atlas to Fez airport for the return flight. Note: this day includes a 2 h 30 min road transfer.",
    fr: "Après le petit-déjeuner à l'hôtel — nous recommandons un lever matinal pour profiter du lever du soleil sur le lac et, si le temps le permet, jeter un œil au cratère volcanique voisin —, transfert à travers le Moyen Atlas jusqu'à l'aéroport de Fès pour le vol retour. Note : la journée inclut un transfert routier d'environ 2 h 30.",
  },
};

export const PROGRAM_ESCAPADA_FEZ_SIDIALI_34 = {
  routeId: "tourEscapadaFezSidiali34",
  duration_key: "fs3n4d",
  duration: T("3 noches / 4 días", "3 nights / 4 days", "3 nuits / 4 jours"),
  prices: { low: 690, mid: 790, high: 890, premium: 990 },
  route: [
    { day: 1, lat: 33.9273, lng: -4.9779, type: "airport", name: T("Fez · Aeropuerto", "Fez · Airport", "Fès · Aéroport") },
    { day: 1, lat: 34.0651, lng: -4.9760, type: "city",    name: T("Fez · Riad en la Medina", "Fez · Medina riad", "Fès · Riad dans la médina") },
    { day: 2, lat: 34.0633, lng: -4.9737, type: "city",    name: T("Fez-el Bali · Medina UNESCO", "Fez-el Bali · UNESCO Medina", "Fès-el Bali · médina UNESCO") },
    { day: 3, lat: 33.5333, lng: -5.1100, type: "city",    name: T("Ifrane · «la pequeña Suiza»", "Ifrane · «little Switzerland»", "Ifrane · « la petite Suisse »") },
    { day: 3, lat: 33.0500, lng: -4.9650, type: "lake",    name: T("Aguelmame Sidi Ali", "Aguelmame Sidi Ali", "Aguelmame Sidi Ali") },
    { day: 4, lat: 33.9273, lng: -4.9779, type: "airport", name: T("Fez · Aeropuerto · Regreso", "Fez · Airport · Return", "Fès · Aéroport · Retour") },
  ],
  days: [DAY_FEZ_ARRIVAL, DAY_FEZ_MEDINA, DAY_FEZ_SIDIALI, DAY_RETURN],
  details: {
    includes: {
      es: [
        "Dos noches en Fez en Riad en la Medina u Hotel 4★ en régimen de Media Pensión",
        "Una noche en Aguelmame Sidi Ali en Hotel Xaluca Spa Aguelmame Sidi Ali en régimen de Media Pensión",
        "Comida en Hotel Xaluca Spa Aguelmame Sidi Ali (día 3)",
        "Visita guiada de Fez (día 2)",
        "Entrada a la Madraza",
        "Vehículo turismo o minibús con chófer los días 3 y 4",
        "Transfers desde y hacia el aeropuerto de Fez",
        "Seguro de asistencia en viaje",
      ],
      en: [
        "Two nights in Fez in a Medina riad or 4★ hotel · half board",
        "One night at Hotel Xaluca Spa Aguelmame Sidi Ali · half board",
        "Lunch at Hotel Xaluca Spa Aguelmame Sidi Ali (day 3)",
        "Guided tour of Fez (day 2)",
        "Madrasa admission",
        "Car or minibus with driver on days 3 and 4",
        "Airport transfers from and to Fez airport",
        "Travel assistance insurance",
      ],
      fr: [
        "Deux nuits à Fès en riad de la médina ou hôtel 4★ · demi-pension",
        "Une nuit à l'Hôtel Xaluca Spa Aguelmame Sidi Ali · demi-pension",
        "Déjeuner à l'Hôtel Xaluca Spa Aguelmame Sidi Ali (jour 3)",
        "Visite guidée de Fès (jour 2)",
        "Entrée à la Médersa",
        "Voiture ou minibus avec chauffeur les jours 3 et 4",
        "Transferts depuis et vers l'aéroport de Fès",
        "Assistance voyage",
      ],
    },
    excludes: {
      es: [
        "Las bebidas",
        "Las comidas a mediodía no especificadas",
        "Visitas o guías no detalladas",
        "Otros extras personales (masajes, hammam, etc.)",
        "El vuelo (salvo que se indique lo contrario)",
        "Suplemento opcional para seguro de cancelación · 45 € por persona para viajes de hasta 9 días",
      ],
      en: [
        "Drinks",
        "Lunches not specified",
        "Tours or guides not detailed",
        "Personal extras (massages, hammam, etc.)",
        "Flights (unless otherwise stated)",
        "Optional cancellation insurance · €45 per person for trips up to 9 days",
      ],
      fr: [
        "Boissons",
        "Déjeuners non spécifiés",
        "Visites ou guides non détaillés",
        "Extras personnels (massages, hammam, etc.)",
        "Le vol (sauf mention contraire)",
        "Assurance annulation en option · 45 € par personne pour les voyages jusqu'à 9 jours",
      ],
    },
    notes: {
      es: [
        "Opciones de vuelos: Royal Air Maroc, Ryanair o Air Arabia.",
        "Las tarifas dependen de la ocupación del vehículo. Viaje en vehículo turismo o minibús con chófer.",
        "Tarifas basadas en habitaciones dobles y triples. Suplemento individual: 125 €.",
        "Descuento niños (3-11 años) compartiendo habitación con dos adultos: 165 € temporada baja · 165 € temporada alta.",
        "Los chóferes hispanohablantes son limitados — reservar con antelación.",
        "Los guías oficiales se utilizan únicamente en las Medinas, no para las rutas.",
        "El nombre del riad se confirma tras la reserva.",
        "Actividades opcionales: quads 90 € por vehículo (circuito de dos horas).",
        "Pasaporte obligatorio con vigencia mínima de 6 meses.",
      ],
      en: [
        "Flight options: Royal Air Maroc, Ryanair or Air Arabia.",
        "Rates depend on vehicle occupancy. Travel in car or minibus with driver.",
        "Rates based on double and triple rooms. Single supplement: €125.",
        "Children discount (3-11) sharing room with two adults: €165 low season · €165 high season.",
        "Spanish-speaking drivers are limited — book early.",
        "Official guides are reserved for medina visits only.",
        "Riad name is confirmed after booking.",
        "Optional quads: €90 per vehicle (2-hour circuit).",
        "Valid passport required with at least 6 months remaining.",
      ],
      fr: [
        "Options de vol : Royal Air Maroc, Ryanair ou Air Arabia.",
        "Tarifs selon l'occupation du véhicule. Voyage en voiture ou minibus avec chauffeur.",
        "Tarifs base chambre double et triple. Supplément single : 125 €.",
        "Réduction enfants (3-11 ans) partageant avec deux adultes : 165 € basse · 165 € haute.",
        "Chauffeurs hispanophones limités — réserver tôt.",
        "Les guides officiels sont réservés aux visites des médinas.",
        "Le nom du riad est confirmé après la réservation.",
        "Quads en option : 90 € par véhicule (circuit de 2 h).",
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

export default PROGRAM_ESCAPADA_FEZ_SIDIALI_34;
