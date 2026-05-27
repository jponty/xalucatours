// Fez → Sidi Ali → Marrakech · 7 nights / 8 days. Grand South route
// extended with one extra night in the Middle Atlas at the Aguelmame
// Sidi Ali lake. Reuses 5 shared days and adds 2 program-specific
// days (Fez+Atlas+Sidi Ali, and Sidi Ali+Ziz+Erfoud).

import {
  DAY_01_ARRIVAL_FEZ,
  DAY_03_ERFOUD_ERG_BIVOUAC,
  DAY_06_TODRA_DADES,
  DAY_08_AITBENHADDOU_MARRAKECH,
} from "./fezMarrakech910";
import {
  DAY_04_AMANECER_KHAMLIA_RISSANI_RELAX,
  DAY_07_MARRAKECH_MEDINA_RETURN,
} from "./fezMarrakech67";

const T = (es, en, fr) => ({ es, en, fr });

/* ============================================================
   Program-specific days
============================================================ */

export const DAY_FZS_FEZ_ATLAS_SIDIALI = {
  route_id: "fzs78-fez-atlas-sidiali",
  id: "fzs78-d2",
  image: "https://images.unsplash.com/photo-1542401886-65d6c61db217?auto=format&fit=crop&w=2000&q=85",
  accent: "#5A6B4F",
  title: T(
    "Fez · Medio Atlas · cedros · Aguelmame Sidi Ali",
    "Fez · Middle Atlas · cedars · Aguelmame Sidi Ali",
    "Fès · Moyen Atlas · cèdres · Aguelmame Sidi Ali",
  ),
  body: {
    es: "Por la mañana, visita a pie con guía local por la antigua Medina de Fez — una de las más auténticas y mejor conservadas del mundo árabe. Recorreremos sus laberínticas callejuelas medievales, donde, entre el bullicio de sus gentes, descubriremos centros artesanales, mezquitas y palacios. A primera hora de la tarde, salida en vehículo 4x4 con chófer en dirección sur para cruzar el Medio Atlas hasta llegar a Ifrane, conocida como «la pequeña Suiza». Continuaremos atravesando los Bosques de Cedros Gigantes — si tenemos suerte, podremos alimentar a una colonia de monos salvajes que habita en lo alto de la montaña. Seguiremos hasta el lago Aguelmane Sidi Ali, situado a 2.200 metros de altitud sobre uno de los volcanes extintos del Atlas. Cena y alojamiento en el Hotel Xaluca Spa Aguelmane Sidi Ali, antiguo refugio de caza y pesca construido en 1935 y recientemente restaurado.",
    en: "In the morning, guided walking tour of the Fez Medina — one of the most authentic and best-preserved in the Arab world. We thread its labyrinthine medieval alleys, discovering artisan workshops, mosques and palaces amid the bustle of its people. Early afternoon, departure in a 4x4 with driver heading south across the Middle Atlas to Ifrane, known as «little Switzerland». We continue through the Giant Cedar Forests — with a bit of luck we may feed the colony of wild macaques that lives in the highlands. We then reach Aguelmane Sidi Ali lake, set at 2,200 m altitude on one of the Atlas's extinct volcanoes. Dinner and overnight at Hotel Xaluca Spa Aguelmane Sidi Ali, a former hunting and fishing lodge built in 1935 and recently restored.",
    fr: "Le matin, visite guidée à pied de la médina de Fès — l'une des plus authentiques et les mieux conservées du monde arabe. Nous parcourons ses ruelles médiévales labyrinthiques, à la découverte des ateliers d'artisans, mosquées et palais. En début d'après-midi, départ en 4x4 avec chauffeur vers le sud pour traverser le Moyen Atlas jusqu'à Ifrane, surnommée « la petite Suisse ». Continuation à travers les Forêts de Cèdres Géants — avec un peu de chance, nous nourrirons la colonie de macaques sauvages qui habite la montagne. Arrivée au lac Aguelmane Sidi Ali, perché à 2 200 m d'altitude sur l'un des volcans éteints de l'Atlas. Dîner et nuit à l'Hôtel Xaluca Spa Aguelmane Sidi Ali, ancien relais de chasse et de pêche construit en 1935 et récemment restauré.",
  },
  culture: [
    {
      title: T("Ifrane · la pequeña Suiza", "Ifrane · little Switzerland", "Ifrane · la petite Suisse"),
      body: T(
        "Construida por los franceses en los años 30 a 1.665 m, sorprende con sus tejados a dos aguas, sus calles arboladas y su nieve invernal.",
        "Built by the French in the 1930s at 1,665 m, it surprises with its pitched roofs, tree-lined streets and winter snow.",
        "Construite par les Français dans les années 1930 à 1 665 m, elle surprend par ses toits à deux pentes, ses rues arborées et sa neige hivernale.",
      ),
    },
    {
      title: T("Cedros del Atlas y monos magot", "Atlas cedars and Barbary macaques", "Cèdres de l'Atlas et macaques de Barbarie"),
      body: T(
        "Los bosques del Medio Atlas son uno de los últimos santuarios del macaco de Berbería, la única especie de primate que vive de forma silvestre al norte del Sáhara.",
        "The Middle Atlas forests are one of the last sanctuaries of the Barbary macaque, the only primate species living wild north of the Sahara.",
        "Les forêts du Moyen Atlas constituent l'un des derniers sanctuaires du macaque de Barbarie, seule espèce de primate vivant à l'état sauvage au nord du Sahara.",
      ),
    },
    {
      title: T("Lago Aguelmame Sidi Ali", "Aguelmame Sidi Ali lake", "Lac Aguelmame Sidi Ali"),
      body: T(
        "El lago natural más profundo de Marruecos (≈ 60 m), formado en el cráter de un volcán extinto. Refugio invernal de flamencos rosados y aves migratorias.",
        "Morocco's deepest natural lake (≈ 60 m), formed in an extinct volcanic crater. Winter refuge for flamingos and migratory birds.",
        "Lac naturel le plus profond du Maroc (≈ 60 m), formé dans le cratère d'un volcan éteint. Refuge hivernal de flamants roses et d'oiseaux migrateurs.",
      ),
    },
  ],
};

export const DAY_FZS_SIDIALI_ZIZ_ERFOUD = {
  route_id: "fzs78-sidiali-ziz-erfoud",
  id: "fzs78-d3",
  image: "https://images.unsplash.com/photo-1547234935-80c7145ec969?auto=format&fit=crop&w=2000&q=85",
  accent: "#7C8B5C",
  title: T(
    "Aguelmame Sidi Ali · Valle del Ziz · Erfoud",
    "Aguelmame Sidi Ali · Ziz Valley · Erfoud",
    "Aguelmame Sidi Ali · Vallée du Ziz · Erfoud",
  ),
  body: {
    es: "Despertaremos a 2.200 m junto al lago natural más profundo de Marruecos. Por la mañana podremos pasear alrededor del lago, subir al cráter del volcán cercano o visitar una familia nómada de los Aït Atta. El hotel ofrece también piscina climatizada, spa y hammam (opcional). Comida en el Xaluca Spa Aguelmane Sidi Ali. Por la tarde, salida en 4x4 hacia el sur por el Valle del Ziz — hogar de más de diez millones de palmeras — hasta llegar a Erfoud, «la Puerta del Desierto». Cena y alojamiento en Kasbah Hotel Xaluca.",
    en: "We wake up at 2,200 m next to Morocco's deepest natural lake. In the morning we can walk around the lake, climb to the nearby volcanic crater or visit a Aït Atta nomadic family. The hotel also offers heated pool, spa and hammam (optional). Lunch at Xaluca Spa Aguelmane Sidi Ali. In the afternoon, we head south by 4x4 along the Ziz Valley — home to more than ten million palms — down to Erfoud, «the Gate of the Desert». Dinner and overnight at Kasbah Hotel Xaluca.",
    fr: "Réveil à 2 200 m au bord du lac naturel le plus profond du Maroc. Le matin, possibilité de promenade autour du lac, ascension du cratère volcanique voisin ou visite d'une famille nomade Aït Atta. L'hôtel dispose également d'une piscine chauffée, d'un spa et d'un hammam (en option). Déjeuner au Xaluca Spa Aguelmane Sidi Ali. L'après-midi, descente en 4x4 vers le sud par la Vallée du Ziz — abritant plus de dix millions de palmiers — jusqu'à Erfoud, « la Porte du Désert ». Dîner et nuit à la Kasbah Hôtel Xaluca.",
  },
  wellness: [
    { es: "Paseo lacustre · 4 km", en: "Lake walk · 4 km", fr: "Promenade lacustre · 4 km" },
    { es: "Cráter volcánico", en: "Volcanic crater", fr: "Cratère volcanique" },
    { es: "Encuentro con nómadas", en: "Nomadic meeting", fr: "Rencontre nomades" },
    { es: "Piscina climatizada", en: "Heated pool", fr: "Piscine chauffée" },
    { es: "Spa & hammam (opcional)", en: "Spa & hammam (optional)", fr: "Spa & hammam (option)" },
  ],
  culture: [
    {
      title: T("Aït Atta · nómadas del Tafilalet", "Aït Atta · Tafilalet nomads", "Aït Atta · nomades du Tafilalet"),
      body: T(
        "Confederación tribal bereber que aún practica la trashumancia estacional entre el Atlas y el desierto. Su tradición oral es UNESCO.",
        "Berber tribal confederation that still practises seasonal transhumance between the Atlas and the desert. Their oral tradition is UNESCO listed.",
        "Confédération tribale berbère pratiquant encore la transhumance saisonnière entre l'Atlas et le désert. Leur tradition orale est classée UNESCO.",
      ),
    },
    {
      title: T("Valle del Ziz · diez millones de palmeras", "Ziz Valley · ten million palms", "Vallée du Ziz · dix millions de palmiers"),
      body: T(
        "El río Ziz, que nace en el Alto Atlas y desemboca en el Sahara argelino, forma el oasis del Tafilalet — cuna histórica de la dinastía alauí.",
        "The Ziz river — born in the High Atlas and ending in the Algerian Sahara — forms the Tafilalet oasis, historic cradle of the Alawi dynasty.",
        "La rivière Ziz — née dans le Haut Atlas et se perdant dans le Sahara algérien — forme l'oasis du Tafilalet, berceau historique de la dynastie alaouite.",
      ),
    },
    {
      title: T("Erfoud · puerta del desierto", "Erfoud · gate of the desert", "Erfoud · porte du désert"),
      body: T(
        "Capital del Tafilalet y centro del comercio de dátiles y fósiles devónicos de 360 millones de años, un mar primitivo petrificado bajo nuestros pies.",
        "Capital of the Tafilalet and centre of the date trade and 360-million-year-old Devonian fossils — a primeval sea petrified beneath our feet.",
        "Capitale du Tafilalet et centre du commerce de dattes et de fossiles dévoniens de 360 millions d'années — une mer primitive pétrifiée sous nos pieds.",
      ),
    },
  ],
};

/* ============================================================
   Program · 7 nights / 8 days · Fez → Sidi Ali → Marrakech
============================================================ */

export const PROGRAM_FZS_78 = {
  routeId: "tourFezSidialiRak78",
  duration_key: "fzs7n8d",
  duration: T("7 noches / 8 días", "7 nights / 8 days", "7 nuits / 8 jours"),
  prices: { low: 1990, mid: 2290, high: 2590, premium: 2990 },
  route: [
    { day: 1, lat: 34.0651, lng: -4.9760, type: "city",    name: T("Fez · Llegada", "Fez · Arrival", "Fès · Arrivée") },
    { day: 2, lat: 33.0500, lng: -4.9650, type: "lake",    name: T("Aguelmane Sidi Ali", "Aguelmane Sidi Ali", "Aguelmane Sidi Ali") },
    { day: 3, lat: 31.4373, lng: -4.2330, type: "city",    name: T("Erfoud · Kasbah Xaluca", "Erfoud · Kasbah Xaluca", "Erfoud · Kasbah Xaluca") },
    { day: 4, lat: 31.1257, lng: -3.9789, type: "desert",  name: T("Erg Chebbi · Bivouac", "Erg Chebbi · Bivouac", "Erg Chebbi · Bivouac") },
    { day: 5, lat: 31.2828, lng: -4.2683, type: "market",  name: T("Rissani · Kasbah Xaluca", "Rissani · Kasbah Xaluca", "Rissani · Kasbah Xaluca") },
    { day: 6, lat: 31.3582, lng: -5.9911, type: "gorge",   name: T("Boumalne Dadès · Todra", "Boumalne Dades · Todra", "Boumalne Dadès · Todra") },
    { day: 7, lat: 31.0470, lng: -7.1294, type: "unesco",  name: T("Aït Ben Haddou · Marrakech", "Aït Ben Haddou · Marrakech", "Aït Ben Haddou · Marrakech") },
    { day: 8, lat: 31.6295, lng: -7.9811, type: "city",    name: T("Marrakech · Medina", "Marrakech · Medina", "Marrakech · Médina") },
  ],
  days: [
    DAY_01_ARRIVAL_FEZ,
    DAY_FZS_FEZ_ATLAS_SIDIALI,
    DAY_FZS_SIDIALI_ZIZ_ERFOUD,
    DAY_03_ERFOUD_ERG_BIVOUAC,
    DAY_04_AMANECER_KHAMLIA_RISSANI_RELAX,
    DAY_06_TODRA_DADES,
    DAY_08_AITBENHADDOU_MARRAKECH,
    DAY_07_MARRAKECH_MEDINA_RETURN,
  ],
  details: {
    includes: {
      es: [
        "Una noche en Fez en Riad en la Medina o Hotel 4★ en Media Pensión",
        "Una noche en Timahdite en Hotel Xaluca Spa Aguelmane Sidi Ali en Media Pensión",
        "Dos noches en Erfoud en Kasbah Hotel Xaluca en Media Pensión",
        "Una noche en Erg Chebbi en Bivouac de Luxe en el desierto en Media Pensión",
        "Una noche en Boumalne Dades en Hotel Xaluca Dadès en Media Pensión",
        "Una noche en Marrakech en Riad en la Medina o Hotel 5★ en Alojamiento y Desayuno",
        "Comida en Xaluca Spa Aguelmane Sidi Ali · Comida picnic en el desierto",
        "Excursión en dromedario por el Erg Chebbi",
        "Vehículo 4x4 con chófer desde el día 2 hasta el día 7 del itinerario, ambos incluidos",
        "Visita con guía local en Fez · Visita con guía local en Marrakech",
        "Visitas a Aït Ben Haddou y Palacio de la Bahía",
        "Transfers desde y hacia aeropuertos · Combustible · Seguro de asistencia en viaje",
      ],
      en: [
        "One night in Fez in a Medina riad or 4★ hotel · half board",
        "One night in Timahdite at Hotel Xaluca Spa Aguelmane Sidi Ali · half board",
        "Two nights in Erfoud at Kasbah Hotel Xaluca · half board",
        "One night at the Bivouac de Luxe in the Erg Chebbi · half board",
        "One night in Boumalne Dades at Hotel Xaluca Dades · half board",
        "One night in Marrakech in a Medina riad or 5★ hotel · bed & breakfast",
        "Lunch at Xaluca Spa Aguelmane Sidi Ali · Picnic lunch in the desert",
        "Camel ride in the Erg Chebbi",
        "4x4 with driver from day 2 to day 7 inclusive",
        "Local guided tour in Fez · Local guided tour in Marrakech",
        "Visits to Aït Ben Haddou and the Bahia Palace",
        "Airport transfers · Fuel · Travel assistance insurance",
      ],
      fr: [
        "Une nuit à Fès en riad de la médina ou hôtel 4★ · demi-pension",
        "Une nuit à Timahdite à l'Hôtel Xaluca Spa Aguelmane Sidi Ali · demi-pension",
        "Deux nuits à Erfoud à la Kasbah Hôtel Xaluca · demi-pension",
        "Une nuit au Bivouac de Luxe dans l'Erg Chebbi · demi-pension",
        "Une nuit à Boumalne Dadès à l'Hôtel Xaluca Dadès · demi-pension",
        "Une nuit à Marrakech en riad de la médina ou hôtel 5★ · petit-déjeuner",
        "Déjeuner au Xaluca Spa Aguelmane Sidi Ali · Pique-nique au désert",
        "Balade à dromadaire dans l'Erg Chebbi",
        "4x4 avec chauffeur du jour 2 au jour 7 inclus",
        "Guide local à Fès et à Marrakech",
        "Visites d'Aït Ben Haddou et du Palais de la Bahia",
        "Transferts aéroports · Carburant · Assistance voyage",
      ],
    },
    excludes: {
      es: [
        "Las bebidas",
        "Las comidas y cenas no detalladas en el programa",
        "Otros extras personales (quads, masajes, tratamientos de spa…)",
        "El vuelo (salvo que se indique lo contrario)",
        "Suplemento para añadir seguro de cancelación · 30 € por persona para viajes de máximo 10 días",
      ],
      en: [
        "Drinks",
        "Lunches and dinners not listed in the programme",
        "Personal extras (quads, massages, spa treatments…)",
        "Flights (unless otherwise stated)",
        "Optional cancellation insurance · €30 per person for trips of up to 10 days",
      ],
      fr: [
        "Boissons",
        "Déjeuners et dîners non détaillés dans le programme",
        "Extras personnels (quads, massages, spa…)",
        "Le vol (sauf mention contraire)",
        "Assurance annulation en option · 30 € par personne pour les voyages jusqu'à 10 jours",
      ],
    },
    notes: {
      es: [
        "Opciones de vuelos: Royal Air Maroc (vía Casablanca) o low-cost como Vueling, Air Arabia, Ryanair.",
        "Las tarifas se calculan según la ocupación del 4x4. El coste se divide entre los ocupantes.",
        "Tarifas basadas en habitaciones dobles/triples. Suplemento individual: 475 €.",
        "Descuento niños (3-11 años) compartiendo con dos adultos: 380 € temporada baja · 400 € temporada alta.",
        "En temporada alta, los guías de medina pueden compartirse con otros viajeros.",
        "Chóferes hispanohablantes son limitados — reservar con antelación.",
        "Los guías oficiales están reservados exclusivamente para las visitas a las medinas, no para las rutas.",
        "Es obligatorio pasaporte vigente con un mínimo de 3 meses desde la fecha de regreso (puede enviarse posteriormente si está en renovación).",
        "Quads opcionales: 70 € por vehículo (circuito de 1 hora). Spa y masajes en recepción de hotel.",
        "El mercado de Rissani se celebra los martes, jueves y domingos.",
      ],
      en: [
        "Flight options: Royal Air Maroc (via Casablanca) or low-cost (Vueling, Air Arabia, Ryanair).",
        "Rates depend on 4x4 occupancy. Cost is split between passengers.",
        "Rates based on double/triple rooms. Single room supplement: €475.",
        "Children discount (3-11) sharing with two adults: €380 low season · €400 high season.",
        "In high season medina guides may be shared with other travellers.",
        "Spanish-speaking drivers are limited — book early.",
        "Official guides are reserved exclusively for medina visits, not for the on-road portions.",
        "Valid passport required with at least 3 months remaining from the return date (may be sent later if being renewed).",
        "Optional quads: €70 per vehicle (1-hour circuit). Spa & massages at hotel reception.",
        "Rissani market runs Tuesday, Thursday and Sunday.",
      ],
      fr: [
        "Options de vol : Royal Air Maroc (via Casablanca) ou low-cost (Vueling, Air Arabia, Ryanair).",
        "Tarifs selon l'occupation du 4x4. Le coût est partagé entre les occupants.",
        "Tarifs base chambre double/triple. Supplément single : 475 €.",
        "Réduction enfants (3-11 ans) partageant avec 2 adultes : 380 € basse · 400 € haute.",
        "En haute saison, les guides de médina peuvent être partagés.",
        "Chauffeurs hispanophones limités — réserver tôt.",
        "Les guides officiels sont réservés aux visites des médinas, pas aux trajets.",
        "Passeport valable au minimum 3 mois après le retour (peut être envoyé ultérieurement s'il est en renouvellement).",
        "Quads en option : 70 € par véhicule (1 h). Spa et massages à la réception de l'hôtel.",
        "Marché de Rissani les mardi, jeudi et dimanche.",
      ],
    },
    terms: {
      es: [
        "Reserva: 30% del importe total en el momento de la confirmación.",
        "Pago final: 70% restante hasta 30 días antes de la salida.",
        "Si el vuelo elegido requiere emisión inmediata: 100% del billete + 30% de los servicios de tierra al reservar.",
        "Cancelación 45 días antes de la salida: 30% del importe total.",
        "Cancelación 21 días antes de la salida: 100% del importe total.",
        "Penalización fija de 50 € por reserva en concepto de gastos de gestión.",
        "Estas condiciones aplican sólo a los servicios de tierra. Los vuelos se rigen por las condiciones de cada compañía aérea. Los seguros no se reembolsan.",
      ],
      en: [
        "Booking: 30% at confirmation.",
        "Final payment: 70% balance up to 30 days before departure.",
        "If the chosen flight requires immediate ticketing: 100% of the flight + 30% of land services at booking.",
        "Cancellation 45 days before departure: 30% of the total.",
        "Cancellation 21 days before departure: 100% of the total.",
        "Fixed €50 per booking management fee.",
        "Conditions apply to land services only. Flights follow each airline's rules. Insurances are non-refundable.",
      ],
      fr: [
        "Réservation : 30 % à la confirmation.",
        "Paiement final : solde de 70 % jusqu'à 30 jours avant le départ.",
        "Si le vol exige une émission immédiate : 100 % du billet + 30 % des services terrestres à la réservation.",
        "Annulation 45 jours avant : 30 % du total.",
        "Annulation 21 jours avant : 100 % du total.",
        "Pénalité fixe de 50 € par réservation pour frais de gestion.",
        "Conditions applicables aux services terrestres uniquement. Les vols suivent les règles de chaque compagnie. Les assurances ne sont pas remboursables.",
      ],
    },
  },
};

export default PROGRAM_FZS_78;
