// Approved source: the two supplied enduro programmes (3n/4d and 4n/5d).
// Shared facts are maintained here; no public prices or inherited 4x4 package.
const T = (es, en, fr) => ({ es, en, fr });
const langs = ["es", "en", "fr"];
const list = (rows) => Object.fromEntries(langs.map(lang => [lang, rows.map(row => row[lang])]));
const DUNES = "https://images.unsplash.com/photo-1542401886-65d6c61db217?auto=format&fit=crop&w=2000&q=85";
const day = (id, route, title, body, summary) => ({
  id: `dia-${id}`, route_id: route, title, body, chronologySummary: summary,
  image: DUNES, accent: "#C16542", culture: [], sourceNotesOnly: true,
});

const arrival = day(1, "enduro-errachidia-erfoud",
  T("Barcelona – Casablanca – Errachidia – Erfoud", "Barcelona – Casablanca – Errachidia – Erfoud", "Barcelone – Casablanca – Errachidia – Erfoud"),
  T(
    "Salida de Barcelona en vuelo a Casablanca y conexión con el vuelo a Errachidia. Según la época del año, puede haber diferencia horaria. Llegada a Errachidia a las 23:59 h, recogida en el aeropuerto y traslado a Erfoud, la Puerta del Desierto. Alojamiento en Kasbah Hotel Xaluca Arfoud, catalogada como única en Marruecos por sus peculiares características.",
    "Flight from Barcelona to Casablanca and connection to Errachidia. There may be a time difference depending on the season. Arrival in Errachidia at 23:59, airport pickup and transfer to Erfoud, the Gate of the Desert. Stay at Kasbah Hotel Xaluca Arfoud, recognised as unique in Morocco for its distinctive characteristics.",
    "Vol de Barcelone à Casablanca et correspondance pour Errachidia. Selon la saison, un décalage horaire est possible. Arrivée à Errachidia à 23h59, accueil à l’aéroport et transfert à Erfoud, la Porte du Désert. Hébergement au Kasbah Hotel Xaluca Arfoud, classé comme unique au Maroc pour ses caractéristiques particulières."
  ), T("Llegada vía Casablanca y traslado a Kasbah Hotel Xaluca Arfoud.", "Arrival via Casablanca and transfer to Kasbah Hotel Xaluca Arfoud.", "Arrivée via Casablanca et transfert au Kasbah Hotel Xaluca Arfoud."));

const oasis = day(2, "enduro-erfoud-tisserdimine-ergchebbi-merzouga",
  T("Erfoud – Tisserdimine – Erg Chebbi – Merzouga", "Erfoud – Tisserdimine – Erg Chebbi – Merzouga", "Erfoud – Tisserdimine – Erg Chebbi – Merzouga"),
  T(
    "Por la mañana, traslado a Merzouga para reunirse con el guía-piloto. Primera jornada de moto para tomar contacto con las motos y el terreno. Salida hacia los oasis por pistas de pilotaje y ríos de arena hasta el Erg Chebbi. Comida picnic en Tisserdimine. Por la tarde, continuación por el mar de dunas con las instrucciones del guía para familiarizarse con este terreno. Cena y alojamiento en Kasbah Tombouctou.",
    "Morning transfer to Merzouga to meet the guide-rider. The first riding day is an introduction to the bikes and terrain. Ride towards the oases along tracks and sand rivers to Erg Chebbi. Picnic lunch in Tisserdimine. Continue through the sea of dunes in the afternoon, following the guide’s instructions to get familiar with the terrain. Dinner and stay at Kasbah Tombouctou.",
    "Le matin, transfert à Merzouga pour retrouver le guide-pilote. Première journée pour prendre contact avec les motos et le terrain. Départ vers les oasis par des pistes et des rivières de sable jusqu’à l’Erg Chebbi. Pique-nique à Tisserdimine. L’après-midi, poursuite dans la mer de dunes avec les conseils du guide pour se familiariser avec ce terrain. Dîner et nuit au Kasbah Tombouctou."
  ), T("Primer día de moto, picnic en Tisserdimine y dunas de Erg Chebbi.", "First riding day, picnic in Tisserdimine and Erg Chebbi dunes.", "Première journée à moto, pique-nique à Tisserdimine et dunes de l’Erg Chebbi."));

const bivouac = T(
  "Esta noche se puede cambiar el alojamiento por un bivouac en haimas en medio del desierto. Consultar condiciones de esta opción.",
  "Tonight you can change the accommodation to a desert bivouac in traditional tents. Ask about the conditions for this option.",
  "Cette nuit, il est possible de remplacer l’hébergement par un bivouac en tentes dans le désert. Consulter les conditions de cette option."
);
const optionalVisits = T(
  "Existe la posibilidad de visitar Rissani y su mercado, donde se abastecen las tribus y nómadas del desierto y se encuentra el particular parking de burros, así como Khamlia y otros pueblos de la zona.",
  "There is an opportunity to visit Rissani and its market, where desert tribes and nomads stock up and the unusual donkey parking area can be seen, as well as Khamlia and other local villages.",
  "Possibilité de visiter Rissani et son marché, où s’approvisionnent les tribus et nomades du désert et où se trouve le singulier parking des ânes, ainsi que Khamlia et d’autres villages des environs."
);
const append = (base, extra) => T(...langs.map(lang => `${base[lang]} ${extra[lang]}`));

const rissani = day(3, "enduro-merzouga-rissani-ergchebbi-merzouga",
  T("Merzouga – Rissani – Erg Chebbi", "Merzouga – Rissani – Erg Chebbi", "Merzouga – Rissani – Erg Chebbi"),
  append(append(T(
    "Después del desayuno, salida con las motos para continuar disfrutando de la variedad de terrenos del desierto.",
    "After breakfast, set off on the bikes to enjoy more of the desert’s varied terrain.",
    "Après le petit-déjeuner, départ à moto pour profiter de la variété des terrains du désert."
  ), optionalVisits), append(T(
    "Comida en Hotel Kasbah Tombouctou. Por la tarde, regreso a las dunas para continuar experimentando el terreno como auténticos dakarianos y ver la puesta de sol. Cena y alojamiento en Hotel Kasbah Tombouctou.",
    "Lunch at Hotel Kasbah Tombouctou. Return to the dunes in the afternoon for more Dakar-style riding and to watch the sunset. Dinner and stay at Hotel Kasbah Tombouctou.",
    "Déjeuner à l’Hotel Kasbah Tombouctou. L’après-midi, retour aux dunes pour poursuivre l’expérience façon Dakar et admirer le coucher du soleil. Dîner et nuit à l’Hotel Kasbah Tombouctou."
  ), bivouac)),
  T("Terrenos del desierto, posibles visitas a Rissani o Khamlia y puesta de sol en las dunas.", "Desert terrain, possible visits to Rissani or Khamlia and sunset in the dunes.", "Terrains du désert, visites possibles de Rissani ou Khamlia et coucher de soleil dans les dunes."));

function finalRide(number, short) {
  const body = T(
    "Después del desayuno, jornada de moto dedicada principalmente a la arena. Pasaremos por oasis situados en el corazón de las dunas y navegaremos hasta Merzouga. Allí dejaremos las motos y continuaremos en vehículos 4x4 hasta Erfoud. Comida en Pizzeria Des Dunes. Resto de la tarde libre para disfrutar de la piscina, el jacuzzi y, opcionalmente, hammam o masaje. Cena y alojamiento en Kasbah Xaluca.",
    "After breakfast, a riding day devoted mainly to sand. Cross oases in the heart of the dunes and navigate to Merzouga. Leave the bikes there and continue by 4x4 to Erfoud. Lunch at Pizzeria Des Dunes. Free afternoon to enjoy the pool, jacuzzi and optional hammam or massage. Dinner and stay at Kasbah Xaluca.",
    "Après le petit-déjeuner, journée à moto consacrée principalement au sable. Passage par des oasis au cœur des dunes jusqu’à Merzouga. Nous y laisserons les motos pour continuer en 4x4 jusqu’à Erfoud. Déjeuner à Pizzeria Des Dunes. Après-midi libre : piscine, jacuzzi et, en option, hammam ou massage. Dîner et nuit au Kasbah Xaluca."
  );
  return day(number, "enduro-ergchebbi-merzouga-erfoud",
    short ? T("Merzouga – Erg Chebbi – Erfoud", "Merzouga – Erg Chebbi – Erfoud", "Merzouga – Erg Chebbi – Erfoud") : T("Erg Chebbi – Merzouga – Erfoud", "Erg Chebbi – Merzouga – Erfoud", "Erg Chebbi – Merzouga – Erfoud"),
    short ? append(body, optionalVisits) : body,
    T("Dunas y oasis en moto, regreso en 4x4 desde Merzouga y descanso en Erfoud.", "Dunes and oases by bike, 4x4 return from Merzouga and time to relax in Erfoud.", "Dunes et oasis à moto, retour en 4x4 depuis Merzouga et détente à Erfoud."));
}
const departure = (number) => day(number, "enduro-erfoud-errachidia",
  T("Erfoud – Errachidia – Casablanca – Barcelona", "Erfoud – Errachidia – Casablanca – Barcelona", "Erfoud – Errachidia – Casablanca – Barcelone"),
  T(
    "A la hora convenida, recogida en el hotel y traslado al aeropuerto de Errachidia. Vuelo de regreso Errachidia – Casablanca de las 07:15 h y conexión con el vuelo Casablanca – Barcelona. Llegada al punto de origen.",
    "Hotel pickup at the agreed time and transfer to Errachidia airport. Return flight Errachidia – Casablanca at 07:15 and connection to Barcelona. Arrival back at the point of departure.",
    "À l’heure convenue, prise en charge à l’hôtel et transfert à l’aéroport d’Errachidia. Vol retour Errachidia – Casablanca à 07h15 puis correspondance pour Barcelone. Arrivée au point de départ."
  ), T("Traslado al aeropuerto y regreso vía Casablanca.", "Airport transfer and return via Casablanca.", "Transfert à l’aéroport et retour via Casablanca."));

const excludes = list([
  T("Bebidas.", "Drinks.", "Boissons."),
  T("Combustible de las motos de los participantes y del guía.", "Fuel for the participants’ and guide’s motorcycles.", "Carburant des motos des participants et du guide."),
  T("Equipación de enduro: casco, gafas, traje, botas, peto y demás equipo personal.", "Enduro equipment: helmet, goggles, suit, boots, chest protector and other personal gear.", "Équipement enduro : casque, lunettes, tenue, bottes, protection et autre matériel personnel."),
  T("Extras personales como masajes o hammam.", "Personal extras such as massages or hammam.", "Extras personnels comme les massages ou le hammam."),
  T("Piezas de la moto que puedan romperse por caídas.", "Motorcycle parts damaged in falls.", "Pièces de moto endommagées lors de chutes."),
  T("Vuelos.", "Flights.", "Vols."),
  T("Seguro de la actividad de moto de enduro. Consultar seguro especial de motor.", "Insurance for enduro motorcycling. Ask about special motor insurance.", "Assurance de l’activité moto enduro. Consulter l’assurance spéciale moteur."),
]);
const notes = list([
  T("Vuelos: Royal Air Maroc vía Casablanca; también se mencionan Vueling y Ryanair, con vuelos directos desde algunas ciudades según disponibilidad. Consultar opciones y condiciones.", "Flights: Royal Air Maroc via Casablanca; Vueling and Ryanair are also mentioned, with direct flights from some cities subject to availability. Ask about options and conditions.", "Vols : Royal Air Maroc via Casablanca ; Vueling et Ryanair sont également mentionnées, avec des vols directs depuis certaines villes selon disponibilité. Consulter les options et conditions."),
  T("El programa indica pasaporte con una vigencia mínima de 3 meses para viajar a Marruecos.", "The programme specifies a passport with at least 3 months’ validity for travel to Morocco.", "Le programme indique un passeport valable au moins 3 mois pour voyager au Maroc."),
  T("Los kilómetros diarios se adaptarán a la experiencia de los participantes.", "Daily distances will be adapted to the participants’ experience.", "Les distances quotidiennes seront adaptées à l’expérience des participants."),
  T("Es imprescindible llevar casco integral, traje, botas, peto, gafas, Camelbak y vestimenta adecuada para enduro.", "A full-face helmet, riding suit, boots, chest protector, goggles, Camelbak and suitable enduro clothing are essential.", "Casque intégral, tenue, bottes, protection, lunettes, Camelbak et vêtements adaptés à l’enduro sont indispensables."),
  T("Los hoteles se confirmarán al formalizar la reserva mediante paga y señal. Si no hay disponibilidad, se buscarán alternativas de las mismas características.", "Hotels are confirmed once the reservation deposit has been paid. If unavailable, alternatives with the same characteristics will be sought.", "Les hôtels seront confirmés après réservation et acompte. En cas d’indisponibilité, des alternatives aux mêmes caractéristiques seront recherchées."),
  T("El seguro de asistencia en viaje y cancelación no cubre la actividad de moto. Las cancelaciones están sujetas a las condiciones generales, páginas 37–41. Consultar el seguro especial de motor.", "Travel assistance and cancellation insurance does not cover motorcycling. Cancellations are subject to the general terms, pages 37–41. Ask about special motor insurance.", "L’assurance assistance voyage et annulation ne couvre pas la moto. Les annulations sont soumises aux conditions générales, pages 37–41. Consulter l’assurance spéciale moteur."),
]);
const terms = list([
  T("Cumplimentar la ficha de inscripción. Si el pasaporte debe actualizarse, podrá enviarse posteriormente.", "Complete the registration form. If the passport needs updating, it may be provided later.", "Remplir la fiche d’inscription. Si le passeport doit être renouvelé, il pourra être envoyé ultérieurement."),
  T("Pago mediante transferencia bancaria o tarjeta Visa: 30 % al reservar y 70 % restante hasta 30 días antes de la salida.", "Payment by bank transfer or Visa: 30% on booking and the remaining 70% by 30 days before departure.", "Paiement par virement bancaire ou carte Visa : 30 % à la réservation et les 70 % restants au plus tard 30 jours avant le départ."),
  T("Los vuelos que requieran emisión inmediata se abonan íntegramente al reservar, además del 30 % de los servicios de tierra.", "Flights requiring immediate ticketing must be paid in full on booking, in addition to 30% of ground services.", "Les vols nécessitant une émission immédiate sont payables intégralement à la réservation, en plus des 30 % des services terrestres."),
  T("Cancelación de servicios de tierra: 30 % a 45 días de la salida y 100 % a 21 días de la salida. Una vez confirmada la reserva se aplican además gastos de gestión; consultar las condiciones completas antes de reservar.", "Ground-service cancellation: 30% at 45 days before departure and 100% at 21 days before departure. Administration fees also apply once the booking is confirmed; consult the full conditions before booking.", "Annulation des services terrestres : 30 % à 45 jours du départ et 100 % à 21 jours du départ. Des frais de gestion s’appliquent également après confirmation ; consulter les conditions complètes avant de réserver."),
  T("Los vuelos no están incluidos. Si se adquieren a través de Xaluca Tours, se rigen por las condiciones de cada compañía aérea. Los seguros no se reembolsarán.", "Flights are not included. If purchased through Xaluca Tours, the airline’s own conditions apply. Insurance is non-refundable.", "Les vols ne sont pas inclus. S’ils sont achetés via Xaluca Tours, les conditions de chaque compagnie aérienne s’appliquent. Les assurances ne sont pas remboursables."),
]);

export function createEnduroProgram(nights) {
  const short = nights === 3;
  const rideDays = short ? 2 : 3;
  const duration = T(`${nights} noches / ${nights + 1} días`, `${nights} nights / ${nights + 1} days`, `${nights} nuits / ${nights + 1} jours`);
  const riding = T(`${rideDays} días de moto de enduro con guía`, `${rideDays} days of guided enduro riding`, `${rideDays} jours de moto enduro avec guide`);
  const includes = list([
    T("2 noches en Kasbah Hotel Xaluca Arfoud en Media Pensión.", "2 nights at Kasbah Hotel Xaluca Arfoud on half board.", "2 nuits au Kasbah Hotel Xaluca Arfoud en demi-pension."),
    T(`${nights - 2} ${short ? "noche" : "noches"} en Kasbah Tombouctou, Merzouga, en Media Pensión.`, `${nights - 2} ${short ? "night" : "nights"} at Kasbah Tombouctou, Merzouga, on half board.`, `${nights - 2} ${short ? "nuit" : "nuits"} au Kasbah Tombouctou, Merzouga, en demi-pension.`),
    T(`Comidas de los días ${short ? "2 y 3" : "2, 3 y 4"}: un picnic y el resto en el hotel, según el apartado de servicios. El itinerario sitúa la última comida en Pizzeria Des Dunes.`, `Lunches on days ${short ? "2 and 3" : "2, 3 and 4"}: one picnic and the rest at the hotel, according to the services section. The itinerary places the final lunch at Pizzeria Des Dunes.`, `Déjeuners des jours ${short ? "2 et 3" : "2, 3 et 4"} : un pique-nique et les autres à l’hôtel, selon la rubrique services. L’itinéraire prévoit le dernier déjeuner à Pizzeria Des Dunes.`),
    T(`Guía acompañante en moto y alquiler de KTM 450 EXC o Yamaha 500 cc los días ${short ? "2 y 3" : "2, 3 y 4"}.`, `Accompanying motorcycle guide and KTM 450 EXC or Yamaha 500 cc rental on days ${short ? "2 and 3" : "2, 3 and 4"}.`, `Guide accompagnateur à moto et location de KTM 450 EXC ou Yamaha 500 cc les jours ${short ? "2 et 3" : "2, 3 et 4"}.`),
    T("Traslados aeropuerto de Errachidia – Erfoud – aeropuerto de Errachidia.", "Transfers Errachidia airport – Erfoud – Errachidia airport.", "Transferts aéroport d’Errachidia – Erfoud – aéroport d’Errachidia."),
    T("Traslado de equipaje entre hoteles.", "Luggage transfers between hotels.", "Transfert des bagages entre les hôtels."),
    T("Seguro de asistencia en viaje y cancelación, sujeto a condiciones. No incluye la actividad de moto; consultar seguro especial de motor.", "Travel assistance and cancellation insurance, subject to conditions. Motorcycling is not covered; ask about special motor insurance.", "Assurance assistance voyage et annulation, sous conditions. La moto n’est pas couverte ; consulter l’assurance spéciale moteur."),
  ]);
  const description = list([
    T("Si te gusta la aventura, el mundo del motor, la adrenalina y los paisajes abiertos e infinitos, este programa propone una ruta por el sur de Marruecos sobre una moto de enduro como los auténticos pilotos dakarianos.", "If you enjoy adventure, motors, adrenaline and wide open landscapes, this programme offers an enduro journey through southern Morocco in the spirit of the Dakar riders.", "Si vous aimez l’aventure, la moto, l’adrénaline et les paysages infinis, ce programme propose une route en enduro dans le sud du Maroc, dans l’esprit des pilotes du Dakar."),
    T(`${rideDays} jornadas de moto con guía entre Erfoud, Tisserdimine, Erg Chebbi y Merzouga. Alojamiento en Kasbah Hotel Xaluca Arfoud y Kasbah Tombouctou, con opción de bivouac la noche del día ${short ? 2 : 3}.`, `${rideDays} guided riding days between Erfoud, Tisserdimine, Erg Chebbi and Merzouga. Stay at Kasbah Hotel Xaluca Arfoud and Kasbah Tombouctou, with an optional bivouac on night ${short ? 2 : 3}.`, `${rideDays} journées à moto avec guide entre Erfoud, Tisserdimine, Erg Chebbi et Merzouga. Hébergement au Kasbah Hotel Xaluca Arfoud et au Kasbah Tombouctou, avec bivouac en option la nuit du jour ${short ? 2 : 3}.`),
  ]);
  const meta = Object.fromEntries(langs.map(lang => [lang, {
    title: T("Motos de Enduro en el Sur de Marruecos", "Enduro motorcycles in Southern Morocco", "Motos Enduro dans le Sud du Maroc")[lang],
    eyebrow_prefix: T("Viaje de aventura · Enduro · Sur de Marruecos", "Adventure trip · Enduro · Southern Morocco", "Voyage d’aventure · Enduro · Sud du Maroc")[lang],
    subtitle: `${duration[lang]} · ${riding[lang]}.`,
    place: "Erfoud · Tisserdimine · Erg Chebbi · Merzouga",
    hero_image: DUNES,
    airports: T("Entrada Errachidia · Salida Errachidia", "In Errachidia · Out Errachidia", "Arrivée Errachidia · Départ Errachidia")[lang],
    quick_airports: "Errachidia / Errachidia",
    quick_places: "Erfoud · Tisserdimine · Erg Chebbi · Merzouga · Rissani · Khamlia",
    highlights: "Tisserdimine · Erg Chebbi · Merzouga",
    riding_summary: riding[lang],
    description_title: T("Sigue las huellas de los pilotos dakarianos.", "Follow the tracks of the Dakar riders.", "Suivez les traces des pilotes du Dakar.")[lang],
    description: description[lang],
  }]));
  return {
    routeId: short ? "tourEnduroAventura34" : "tourEnduroAventura45",
    duration_key: `enduro${nights}n${nights + 1}d`, duration, ridingDays: rideDays,
    hidePrices: true, routeFromDayIds: true, contentVersion: "approved-2026-09", meta,
    details: { includes, excludes, notes, terms },
    days: [arrival, short ? { ...oasis, body: append(oasis.body, bivouac) } : oasis,
      ...(short ? [] : [rissani]), finalRide(short ? 3 : 4, short), departure(nights + 1)],
  };
}
