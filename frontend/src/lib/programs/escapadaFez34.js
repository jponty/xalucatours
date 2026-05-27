// Fez Escape · 3 nights / 4 days · Fez + Meknès + Volubilis + Moulay Idriss
// Reuses arrival + medina days from escapadaFez23 and adds a full Imperial
// city excursion before the return flight.
import { DAY_FEZ_ARRIVAL, DAY_FEZ_MEDINA } from "@/lib/programs/escapadaFez23";

const T = (es, en, fr) => ({ es, en, fr });

export const DAY_MEKNES = {
  route_id: "esc-meknes",
  id: "esc-meknes-d",
  image: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=2000&q=85",
  accent: "#5A6B4F",
  title: T(
    "Meknès · Volubilis · Moulay Idriss · regreso a Fez",
    "Meknès · Volubilis · Moulay Idriss · back to Fez",
    "Meknès · Volubilis · Moulay Idriss · retour à Fès",
  ),
  body: {
    es: "Salida por la mañana hacia Meknès, una de las cuatro Ciudades Imperiales de Marruecos. Visita guiada con guía local de su Medina, más pequeña y tranquila que la de Fez pero de enorme importancia histórica: fundada por una tribu bereber en el siglo X, fue capital del país bajo el sultán Moulay Ismaïl en el siglo XVII y forma parte del Patrimonio Mundial UNESCO. La ciudad está rodeada por más de 40 km de murallas; destaca especialmente la monumental puerta Bab el-Mansour — una de las más bellas y mejor conservadas de Marruecos. Meknès es conocida como «la ciudad de los cien alminares» por la densidad de mezquitas y monumentos religiosos. Al finalizar la visita, salida hacia las ruinas romanas de Volubilis, el mayor yacimiento arqueológico romano de Marruecos, donde admiraremos el Arco de Triunfo de Caracalla, el Capitolio y los espectaculares mosaicos de la Casa de Baco. Continuación hacia Moulay Idriss, ciudad santa fundada por Idris I — el mismo que más tarde fundaría Fez — donde convirtió al Islam a la población bereber local. Sus casas blancas escalonadas alrededor del mausoleo crean uno de los lugares espirituales más especiales del país. Regreso a Fez. Cena y alojamiento en Riad en la Medina u Hotel 4★.",
    en: "Morning departure to Meknès, one of Morocco's four Imperial Cities. Guided walking tour of its Medina with a local guide — smaller and quieter than Fez but historically immense: founded by a Berber tribe in the 10th century, it was the country's capital under Sultan Moulay Ismaïl in the 17th century and is UNESCO listed. The city is wrapped in over 40 km of ramparts; the monumental Bab el-Mansour gate stands out as one of the most beautiful and best preserved in Morocco. Meknès is known as «the city of a hundred minarets». After the visit, we head to the Roman ruins of Volubilis, the largest Roman site in Morocco, where we admire the Triumphal Arch of Caracalla, the Capitol and the spectacular mosaics of the House of Bacchus. Continuation to Moulay Idriss, holy city founded by Idris I — the same who would later found Fez — where he converted the local Berber population to Islam. Its white houses cascading around the mausoleum make this one of the most spiritual sites in the country. Return to Fez. Dinner and overnight in a Medina riad or 4★ hotel.",
    fr: "Départ matinal vers Meknès, l'une des quatre Cités Impériales du Maroc. Visite guidée à pied de sa médina avec un guide local — plus petite et plus tranquille que celle de Fès mais d'une importance historique immense : fondée par une tribu berbère au Xe siècle, elle fut la capitale du pays sous le sultan Moulay Ismaïl au XVIIe siècle et est inscrite au Patrimoine UNESCO. La ville est ceinte par plus de 40 km de remparts ; la monumentale porte Bab el-Mansour est l'une des plus belles et mieux conservées du Maroc. Meknès est surnommée « la ville aux cent minarets ». Au terme de la visite, route vers les ruines romaines de Volubilis, le plus grand site romain du Maroc, où nous admirons l'arc de triomphe de Caracalla, le Capitole et les spectaculaires mosaïques de la Maison de Bacchus. Continuation vers Moulay Idriss, ville sainte fondée par Idriss Ier — celui-là même qui fondera plus tard Fès — où il convertit la population berbère locale à l'islam. Ses maisons blanches étagées autour du mausolée font de ce lieu l'un des sites spirituels les plus marquants du pays. Retour à Fès. Dîner et nuit en riad de la médina ou hôtel 4★.",
  },
  culture: [
    {
      title: T("Bab el-Mansour · puerta imperial", "Bab el-Mansour · imperial gate", "Bab el-Mansour · porte impériale"),
      body: T(
        "Construida en 1732 con columnas saqueadas a Volubilis, sus zellige y bajorrelieves la consagran como la puerta monumental más bella de Marruecos.",
        "Built in 1732 with columns looted from Volubilis, its zellige and bas-reliefs make it Morocco's most beautiful monumental gate.",
        "Construite en 1732 avec des colonnes pillées à Volubilis, ses zellige et bas-reliefs en font la plus belle porte monumentale du Maroc.",
      ),
    },
    {
      title: T("Volubilis · Roma en África", "Volubilis · Rome in Africa", "Volubilis · Rome en Afrique"),
      body: T(
        "Capital de la Mauretania Tingitana entre el siglo I y el III. Patrimonio UNESCO desde 1997 — sus mosaicos in situ figuran entre los mejor conservados del Imperio.",
        "Capital of Mauretania Tingitana from the 1st to the 3rd century. UNESCO World Heritage since 1997 — its in-situ mosaics are among the best preserved in the Empire.",
        "Capitale de la Maurétanie Tingitane entre le Ier et le IIIe siècle. Patrimoine UNESCO depuis 1997.",
      ),
    },
    {
      title: T("Moulay Idriss · cuna sagrada", "Moulay Idriss · sacred cradle", "Moulay Idriss · berceau sacré"),
      body: T(
        "Idris I huyó de Bagdad en 788 y se refugió en este pueblo blanco — desde donde fundó la dinastía idrisí y, un año después, la ciudad de Fez.",
        "Idris I fled Baghdad in 788 and took refuge in this whitewashed town — from where he founded the Idrisid dynasty and, a year later, the city of Fez.",
        "Idriss Ier fuit Bagdad en 788 et se réfugia dans ce village blanc — d'où il fonda la dynastie idrisside et, un an plus tard, la ville de Fès.",
      ),
    },
  ],
};

const DAY_RETURN = {
  route_id: "escfez34-return",
  id: "escfez34-d4",
  image: "https://images.unsplash.com/photo-1547234935-80c7145ec969?auto=format&fit=crop&w=2000&q=85",
  accent: "#5C5248",
  title: T("Tiempo libre · regreso desde Fez", "Free time · return from Fez", "Temps libre · retour depuis Fès"),
  body: {
    es: "Desayuno en el riad y tiempo libre para seguir descubriendo la Medina por cuenta propia — un último paseo para perderse entre zocos, comprar especias o un tagine de barro, o simplemente contemplar a los artesanos. A la hora acordada, traslado al aeropuerto de Fez para tomar el vuelo de regreso.",
    en: "Breakfast at the riad and free time to keep exploring the Medina on your own — one last walk to wander among the souks, buy spices or a clay tagine, or simply watch the artisans at work. At the agreed time, transfer to Fez airport for the return flight.",
    fr: "Petit-déjeuner au riad et temps libre pour continuer à explorer la médina à votre rythme. À l'heure convenue, transfert à l'aéroport de Fès pour le vol retour.",
  },
};

export const PROGRAM_ESCAPADA_FEZ_34 = {
  routeId: "tourEscapadaFez34",
  duration_key: "fez3n4d",
  duration: T("3 noches / 4 días", "3 nights / 4 days", "3 nuits / 4 jours"),
  prices: { low: 590, mid: 690, high: 790, premium: 890 },
  route: [
    { day: 1, lat: 33.9273, lng: -4.9779, type: "airport", name: T("Fez · Aeropuerto", "Fez · Airport", "Fès · Aéroport") },
    { day: 1, lat: 34.0651, lng: -4.9760, type: "city",    name: T("Fez · Riad en la Medina", "Fez · Medina riad", "Fès · Riad dans la médina") },
    { day: 2, lat: 34.0633, lng: -4.9737, type: "city",    name: T("Fez-el Bali · Medina UNESCO", "Fez-el Bali · UNESCO Medina", "Fès-el Bali · médina UNESCO") },
    { day: 3, lat: 33.8956, lng: -5.5473, type: "city",    name: T("Meknès · Medina UNESCO", "Meknès · UNESCO Medina", "Meknès · médina UNESCO") },
    { day: 3, lat: 34.0742, lng: -5.5550, type: "unesco",  name: T("Volubilis · ruinas romanas", "Volubilis · Roman ruins", "Volubilis · ruines romaines") },
    { day: 3, lat: 34.0553, lng: -5.5223, type: "kasbah",  name: T("Moulay Idriss · ciudad santa", "Moulay Idriss · holy city", "Moulay Idriss · ville sainte") },
    { day: 4, lat: 33.9273, lng: -4.9779, type: "airport", name: T("Fez · Aeropuerto · Regreso", "Fez · Airport · Return", "Fès · Aéroport · Retour") },
  ],
  days: [DAY_FEZ_ARRIVAL, DAY_FEZ_MEDINA, DAY_MEKNES, DAY_RETURN],
  details: {
    includes: {
      es: [
        "Tres noches en Fez en Riad en la Medina u Hotel 4★ en régimen de Media Pensión",
        "Visita con guía local en Fez (1 día)",
        "Entrada a la Madraza",
        "Vehículo turismo con chófer para la excursión a Meknès",
        "Visita con guía local en Meknès (medio día)",
        "Visita de Volubilis con entrada y guía",
        "Transfers desde y hacia el aeropuerto de Fez",
        "Seguro de asistencia en viaje",
      ],
      en: [
        "Three nights in Fez in a Medina riad or 4★ hotel · half board",
        "Local guided tour in Fez (1 day)",
        "Madrasa admission",
        "Car with driver for the Meknès excursion",
        "Local guided tour in Meknès (half day)",
        "Volubilis admission and licensed guide",
        "Airport transfers from and to Fez airport",
        "Travel assistance insurance",
      ],
      fr: [
        "Trois nuits à Fès en riad de la médina ou hôtel 4★ · demi-pension",
        "Guide local à Fès (1 jour)",
        "Entrée à la Médersa",
        "Voiture avec chauffeur pour l'excursion à Meknès",
        "Guide local à Meknès (demi-journée)",
        "Volubilis : entrée et guide diplômé",
        "Transferts depuis et vers l'aéroport de Fès",
        "Assistance voyage",
      ],
    },
    excludes: {
      es: [
        "Las bebidas",
        "Las comidas a mediodía no detalladas",
        "Visitas o guías no especificados",
        "Otros extras personales (masajes, hammam, etc.)",
        "El vuelo (salvo que se indique lo contrario)",
        "Suplemento opcional para seguro de cancelación · 45 € por persona para viajes de hasta 9 días",
      ],
      en: [
        "Drinks",
        "Lunches not listed",
        "Tours or guides not specified",
        "Personal extras (massages, hammam, etc.)",
        "Flights (unless otherwise stated)",
        "Optional cancellation insurance · €45 per person for trips up to 9 days",
      ],
      fr: [
        "Boissons",
        "Déjeuners non détaillés",
        "Visites ou guides non spécifiés",
        "Extras personnels (massages, hammam, etc.)",
        "Le vol (sauf mention contraire)",
        "Assurance annulation en option · 45 € par personne pour les voyages jusqu'à 9 jours",
      ],
    },
    notes: {
      es: [
        "Opciones de vuelos: Royal Air Maroc vía Casablanca o low-cost como Ryanair o Air Arabia con vuelos directos desde distintas ciudades.",
        "Tarifas basadas en habitaciones dobles. Suplemento individual: 95 €.",
        "Descuento niños (3-11 años) compartiendo habitación con dos adultos: 130 €.",
        "En temporada alta, los guías locales podrían compartirse con otros viajeros.",
        "El nombre del riad se confirma tras la reserva.",
        "No se recomienda realizar la visita guiada de Fez en viernes (día de oración) — la medina pierde parte de su actividad habitual.",
        "Dependiendo de los vuelos, se pueden añadir excursiones opcionales.",
        "Pasaporte obligatorio con vigencia mínima de 6 meses desde la entrada a Marruecos.",
      ],
      en: [
        "Flight options: Royal Air Maroc via Casablanca, or low-cost airlines (Ryanair, Air Arabia) with direct flights from several cities.",
        "Rates based on double rooms. Single supplement: €95.",
        "Children discount (3-11) sharing room with two adults: €130.",
        "In high season local guides may be shared with other travellers.",
        "Riad name is confirmed after booking.",
        "We do not recommend the Fez guided tour on Fridays (prayer day).",
        "Depending on flight times, optional excursions may be added.",
        "Valid passport required with at least 6 months remaining.",
      ],
      fr: [
        "Options de vol : Royal Air Maroc via Casablanca, ou low-cost (Ryanair, Air Arabia).",
        "Tarifs base chambre double. Supplément single : 95 €.",
        "Réduction enfants (3-11 ans) partageant avec deux adultes : 130 €.",
        "En haute saison, les guides peuvent être partagés.",
        "Le nom du riad est confirmé après la réservation.",
        "Nous déconseillons la visite guidée de Fès le vendredi.",
        "Selon les horaires de vols, des excursions optionnelles peuvent être ajoutées.",
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

export default PROGRAM_ESCAPADA_FEZ_34;
