// Marrakech Escape · 2 nights / 3 days · Arrival → Medina guided tour → Return
const T = (es, en, fr) => ({ es, en, fr });

export const DAY_RAK_ARRIVAL = {
  route_id: "escrak-arrival",
  id: "escrak-d1",
  image: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=2000&q=85",
  accent: "#C16542",
  title: T(
    "Llegada a Marrakech · primera noche en la Medina",
    "Arrival in Marrakech · first night in the Medina",
    "Arrivée à Marrakech · première nuit dans la médina",
  ),
  body: {
    es: "Llegada a Marrakech según el vuelo y horario elegido (puede haber diferencia horaria según la época del año). Tras los trámites de pasaporte y la recogida del equipaje, encuentro con nuestro transfer y traslado al Riad en la Medina o al hotel seleccionado. Recomendamos una primera toma de contacto con la Medina visitando la mítica Plaza Djemaa el-Fna, una de las plazas más vibrantes del mundo. Al atardecer, se llena de recitadores, adivinadores, malabaristas, sacamuelas, danzantes y encantadores de serpientes; al caer la noche, los puestos de comida tradicional al aire libre se encienden e iluminan la plaza, convirtiéndola en un teatro vivo. Alojamiento en Riad en la Medina o Hotel.",
    en: "Arrival in Marrakech according to your chosen flight (time difference depending on the season). After passport control and baggage collection, meeting with our transfer and check-in at a Medina riad or selected hotel. We recommend a first encounter with the Medina by visiting the legendary Jemaa el-Fna square, one of the most vibrant squares in the world. At dusk it fills with storytellers, fortune-tellers, jugglers, snake charmers, dancers and tooth-pullers; at nightfall, the traditional food stalls light up and turn the square into a living theatre. Overnight in a Medina riad or hotel.",
    fr: "Arrivée à Marrakech selon le vol et l'horaire choisis (décalage horaire possible selon la saison). Après le contrôle des passeports et la récupération des bagages, accueil et transfert vers le riad de la médina ou l'hôtel sélectionné. Nous recommandons une première rencontre avec la médina sur la mythique place Jemaa el-Fna, l'une des places les plus vivantes au monde. À la tombée du jour, elle se remplit de conteurs, devins, jongleurs, charmeurs de serpents, danseurs et arracheurs de dents ; à la nuit tombée, les échoppes de cuisine traditionnelle s'illuminent et transforment la place en un théâtre vivant. Nuit en riad de la médina ou hôtel.",
  },
  culture: [
    {
      title: T("Djemaa el-Fna · obra maestra UNESCO", "Jemaa el-Fna · UNESCO masterpiece", "Jemaa el-Fna · chef-d'œuvre UNESCO"),
      body: T(
        "Reconocida en 2001 como obra maestra del patrimonio oral e inmaterial de la humanidad — la plaza más viva de África, distinta de día y de noche.",
        "Recognised in 2001 as a masterpiece of the oral and intangible heritage of humanity — the most alive square in Africa, utterly different by day and night.",
        "Reconnue en 2001 chef-d'œuvre du patrimoine oral et immatériel de l'humanité — la place la plus vivante d'Afrique.",
      ),
    },
  ],
};

export const DAY_RAK_MEDINA = {
  route_id: "escrak-medina",
  id: "escrak-d2",
  image: "https://images.unsplash.com/photo-1551918120-9739cb430c6d?auto=format&fit=crop&w=2000&q=85",
  accent: "#D4A373",
  title: T(
    "Visita guiada por la Medina de Marrakech",
    "Guided tour of the Marrakech medina",
    "Visite guidée de la médina de Marrakech",
  ),
  body: {
    es: "A las 09:30 h, encuentro con nuestro guía local para comenzar la visita guiada a pie por la Medina de Marrakech. Recorreremos los hitos imprescindibles: el alminar de la Koutoubia — hermana gemela de la Giralda de Sevilla — y el Palacio de la Bahía, uno de los ejemplos más destacados de la arquitectura marroquí del siglo XIX. Nos adentraremos en las estrechas callejuelas del zoco para ver a los artesanos en plena actividad — tejedores de alfombras, fabricantes de babuchas, talleres de cuero, madera y metales — y visitaremos una farmacia bereber donde nos enseñarán algunos de sus remedios naturales y secretos ancestrales. La visita finaliza nuevamente en la Plaza Djemaa el-Fna, cuyo ambiente diurno es completamente distinto al de la noche anterior. Tarde libre para practicar el arte del regateo o descubrir los rincones más auténticos de la medina a nuestro ritmo. Existe la posibilidad de ampliar la visita con un Marrakech moderno (jardines Majorelle, Gueliz). Alojamiento en Riad en la Medina o Hotel.",
    en: "At 9:30 am, meeting with our local guide to start the guided walking tour of the Marrakech medina. We cover the essentials: the Koutoubia minaret — twin sister of Seville's Giralda — and the Bahia Palace, one of the finest examples of 19th-century Moroccan architecture. We enter the narrow souk alleys to see artisans at work — carpet weavers, babouche makers, leather, wood and metal workshops — and we visit a Berber pharmacy where we discover herbal remedies and ancestral «secrets». The tour ends again at Jemaa el-Fna square, whose daytime atmosphere is completely different from the previous night. Free afternoon to haggle or explore the most authentic corners of the medina at your own pace. Optional extension with modern Marrakech (Majorelle gardens, Gueliz). Overnight in a Medina riad or hotel.",
    fr: "À 9 h 30, rencontre avec notre guide local pour la visite guidée à pied de la médina de Marrakech. Nous parcourons les incontournables : le minaret de la Koutoubia — sœur jumelle de la Giralda — et le Palais de la Bahia, l'un des plus beaux exemples de l'architecture marocaine du XIXe siècle. Plongée dans les ruelles du souk pour voir les artisans à l'œuvre — tisserands de tapis, babouchiers, ateliers de cuir, bois et métaux — et visite d'une pharmacie berbère et de ses « secrets » naturels. La visite se termine à nouveau sur Jemaa el-Fna, dont l'ambiance diurne contraste avec la nuit. Après-midi libre pour le marchandage ou pour explorer la médina à votre rythme. Extension optionnelle Marrakech moderne (jardins Majorelle, Gueliz). Nuit en riad de la médina ou hôtel.",
  },
  culture: [
    {
      title: T("Koutoubia · hermana gemela de la Giralda", "Koutoubia · twin sister of the Giralda", "Koutoubia · sœur jumelle de la Giralda"),
      body: T(
        "El alminar de 77 m fue construido por los almohades en el siglo XII, junto con la Giralda de Sevilla y la Torre Hassan de Rabat, por el mismo arquitecto.",
        "The 77-m minaret was built by the Almohads in the 12th century — alongside Seville's Giralda and Rabat's Hassan Tower — by the same architect.",
        "Le minaret de 77 m fut construit par les Almohades au XIIe siècle, avec la Giralda et la tour Hassan, par le même architecte.",
      ),
    },
    {
      title: T("Palacio de la Bahía · el palacio de la favorita", "Bahia Palace · the favourite's palace", "Palais de la Bahia · le palais de la favorite"),
      body: T(
        "Construido a finales del s.XIX por Si Moussa para su esposa preferida — 8.000 m² de patios, jardines y artesonados de cedro pintado a mano.",
        "Built in the late 19th century by Si Moussa for his favourite wife — 8,000 m² of patios, gardens and hand-painted cedar coffered ceilings.",
        "Bâti fin XIXe par Si Moussa pour son épouse favorite — 8 000 m² de patios, jardins et plafonds en cèdre peint à la main.",
      ),
    },
  ],
};

const DAY_03 = {
  route_id: "escrak23-return",
  id: "escrak23-d3",
  image: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=2000&q=85",
  accent: "#5C5248",
  title: T("Tiempo libre · regreso desde Marrakech", "Free time · return from Marrakech", "Temps libre · retour depuis Marrakech"),
  body: {
    es: "Día libre para seguir explorando la Medina y practicar el arte del regateo en los zocos. A la hora acordada, recogida en el riad u hotel y traslado al aeropuerto de Marrakech para tomar el vuelo de regreso.",
    en: "Free day to keep exploring the Medina and haggle in the souks. At the agreed time, pick-up at the riad or hotel and transfer to Marrakech airport for the return flight.",
    fr: "Journée libre pour continuer à explorer la médina et marchander dans les souks. À l'heure convenue, prise en charge au riad ou à l'hôtel et transfert à l'aéroport de Marrakech pour le vol retour.",
  },
};

export const PROGRAM_ESCAPADA_MARRAKECH_23 = {
  routeId: "tourEscapadaMarrakech23",
  duration_key: "rak2n3d",
  duration: T("2 noches / 3 días", "2 nights / 3 days", "2 nuits / 3 jours"),
  prices: { low: 390, mid: 490, high: 590, premium: 690 },
  route: [
    { day: 1, lat: 31.6069, lng: -8.0363, type: "airport", name: T("Marrakech · Aeropuerto", "Marrakech · Airport", "Marrakech · Aéroport") },
    { day: 1, lat: 31.6219, lng: -7.9831, type: "city",    name: T("Djemaa el-Fna · primera toma de contacto", "Jemaa el-Fna · first encounter", "Jemaa el-Fna · première rencontre") },
    { day: 2, lat: 31.6244, lng: -7.9926, type: "city",    name: T("Koutoubia · Palacio de la Bahía", "Koutoubia · Bahia Palace", "Koutoubia · Palais de la Bahia") },
    { day: 2, lat: 31.6219, lng: -7.9831, type: "market",  name: T("Zocos · farmacia bereber", "Souks · Berber pharmacy", "Souks · pharmacie berbère") },
    { day: 3, lat: 31.6069, lng: -8.0363, type: "airport", name: T("Marrakech · Aeropuerto · Regreso", "Marrakech · Airport · Return", "Marrakech · Aéroport · Retour") },
  ],
  days: [DAY_RAK_ARRIVAL, DAY_RAK_MEDINA, DAY_03],
  details: {
    includes: {
      es: [
        "Dos noches en Marrakech en Riad en la Medina o Hotel en régimen de Alojamiento y Desayuno",
        "Visita con guía local la primera mañana",
        "Entrada al Palacio de la Bahía",
        "Transfers aeropuerto – riad – aeropuerto",
        "Seguro de asistencia en viaje",
        "Teléfono de asistencia 24 horas",
      ],
      en: [
        "Two nights in Marrakech in a Medina riad or hotel · bed & breakfast",
        "Local guided tour on the first morning",
        "Bahia Palace admission",
        "Airport – riad – airport transfers",
        "Travel assistance insurance",
        "24/7 assistance phone",
      ],
      fr: [
        "Deux nuits à Marrakech en riad de la médina ou hôtel · petit-déjeuner",
        "Guide local le premier matin",
        "Entrée au palais de la Bahia",
        "Transferts aéroport – riad – aéroport",
        "Assistance voyage",
        "Téléphone d'assistance 24h/24",
      ],
    },
    excludes: {
      es: [
        "Las bebidas",
        "Las comidas a mediodía y cenas",
        "Entradas a monumentos no detallados",
        "El vuelo (salvo que se indique lo contrario)",
        "Suplemento opcional para seguro de cancelación · 45 € por persona para viajes de hasta 9 días",
      ],
      en: [
        "Drinks",
        "Lunches and dinners",
        "Admissions to monuments not listed",
        "Flights (unless otherwise stated)",
        "Optional cancellation insurance · €45 per person for trips up to 9 days",
      ],
      fr: [
        "Boissons",
        "Déjeuners et dîners",
        "Entrées aux monuments non détaillés",
        "Le vol (sauf mention contraire)",
        "Assurance annulation en option · 45 € par personne pour les voyages jusqu'à 9 jours",
      ],
    },
    notes: {
      es: [
        "Opciones de vuelos: Royal Air Maroc vía Casablanca, Vueling o Ryanair con vuelos directos desde varias ciudades principales.",
        "Tarifas basadas en habitaciones dobles. Suplemento individual: 180 €.",
        "Descuento niños (3-11 años) compartiendo habitación con dos adultos: 15 €.",
        "En temporada alta, los guías locales podrían compartirse con otros viajeros.",
        "El nombre del riad se confirma tras la reserva.",
        "Pasaporte obligatorio con vigencia mínima de 6 meses.",
      ],
      en: [
        "Flight options: Royal Air Maroc via Casablanca, Vueling or Ryanair with direct flights from several cities.",
        "Rates based on double rooms. Single supplement: €180.",
        "Children discount (3-11) sharing room with two adults: €15.",
        "In high season local guides may be shared with other travellers.",
        "Riad name is confirmed after booking.",
        "Valid passport required with at least 6 months remaining.",
      ],
      fr: [
        "Options de vol : Royal Air Maroc via Casablanca, Vueling ou Ryanair.",
        "Tarifs base chambre double. Supplément single : 180 €.",
        "Réduction enfants (3-11 ans) partageant avec deux adultes : 15 €.",
        "En haute saison, les guides peuvent être partagés.",
        "Le nom du riad est confirmé après la réservation.",
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

export default PROGRAM_ESCAPADA_MARRAKECH_23;
