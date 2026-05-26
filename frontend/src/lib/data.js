// Master data for Xaluca Tours — trilingual content (EN/FR/ES).

/* =========================================================================
   TRAVEL CATEGORIES — the 5 large storytelling cards
   ========================================================================= */
export const TRAVEL_CATEGORIES = [
  {
    slug: "magic-south",
    routeId: "tourSouth",
    number: "01",
    accent: "#C16542",
    image: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=2000&q=85",
    title: {
      en: "The magic of Southern Morocco",
      fr: "La magie du Sud marocain",
      es: "La magia del sur de Marruecos",
    },
    summary: {
      en: "Routes combining the Sahara, the High Atlas, hidden oases and traditional villages rich in history and culture.",
      fr: "Des itinéraires alliant Sahara, Haut Atlas, oasis secrètes et villages traditionnels riches d'histoire et de culture.",
      es: "Rutas que combinan el Sáhara, el Alto Atlas, oasis ocultos y aldeas tradicionales llenas de historia y cultura.",
    },
    badges: ["popular"],
    region: { en: "Sahara · Atlas · Drâa", fr: "Sahara · Atlas · Drâa", es: "Sáhara · Atlas · Drâa" },
  },
  {
    slug: "north-to-south",
    routeId: "tourFull",
    number: "02",
    accent: "#A07042",
    image: "https://images.unsplash.com/photo-1570133435536-7ececf000ef6?auto=format&fit=crop&w=2000&q=85",
    title: {
      en: "Morocco from north to south",
      fr: "Le Maroc du nord au sud",
      es: "Marruecos de norte a sur",
    },
    summary: {
      en: "Imperial cities, Atlantic coastlines, endless desert and remote mountain villages — the full sweep of the country.",
      fr: "Cités impériales, côtes atlantiques, déserts infinis et villages de montagne reculés — la traversée complète du pays.",
      es: "Ciudades imperiales, costas atlánticas, desiertos infinitos y aldeas de montaña remotas — el recorrido completo del país.",
    },
    badges: [],
    region: { en: "Tangier → Sahara", fr: "Tanger → Sahara", es: "Tánger → Sáhara" },
  },
  {
    slug: "short-escapes",
    routeId: "tourShort",
    number: "03",
    accent: "#D97742",
    image: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=2000&q=85",
    title: {
      en: "Short escapes in Morocco",
      fr: "Escapades courtes au Maroc",
      es: "Escapadas cortas por Marruecos",
    },
    summary: {
      en: "For travellers with limited time who still want the magic of Morocco — carefully designed short itineraries.",
      fr: "Pour les voyageurs pressés qui veulent malgré tout la magie du Maroc — des itinéraires courts pensés avec soin.",
      es: "Para viajeros con poco tiempo que igualmente quieren la magia de Marruecos — itinerarios cortos diseñados con esmero.",
    },
    badges: ["popular"],
    region: { en: "Marrakech · Riads · Desert", fr: "Marrakech · Riads · Désert", es: "Marrakech · Riads · Desierto" },
  },
  {
    slug: "northern-morocco",
    routeId: "tourNorth",
    number: "04",
    accent: "#3A4A5F",
    image: "https://images.unsplash.com/photo-1547234935-80c7145ec969?auto=format&fit=crop&w=2000&q=85",
    title: {
      en: "The richness of Northern Morocco",
      fr: "La richesse du Nord marocain",
      es: "La riqueza del norte de Marruecos",
    },
    summary: {
      en: "Blue-painted towns, ancient medinas, Roman mosaics, mountain villages — a fascinating blend of textures, aromas and cultures.",
      fr: "Villes peintes en bleu, médinas anciennes, mosaïques romaines, villages de montagne — un mélange fascinant de textures, d'arômes et de cultures.",
      es: "Pueblos pintados de azul, medinas antiguas, mosaicos romanos, aldeas de montaña — una fascinante mezcla de texturas, aromas y culturas.",
    },
    badges: [],
    region: { en: "Chefchaouen · Fez · Atlantic", fr: "Chefchaouen · Fès · Atlantique", es: "Chefchaouen · Fez · Atlántico" },
  },
  {
    slug: "group-departures",
    routeId: "tourUpcoming",
    number: "05",
    accent: "#C8A24B",
    image: "https://images.unsplash.com/photo-1542401886-65d6c61db217?auto=format&fit=crop&w=2000&q=85",
    title: {
      en: "Upcoming group departures",
      fr: "Prochains départs en groupe",
      es: "Próximas salidas en grupo",
    },
    summary: {
      en: "Curated departures organised around special seasons and events — Easter, summer, New Year and long weekends.",
      fr: "Départs organisés autour des grandes saisons et événements — Pâques, été, Nouvel An et longs week-ends.",
      es: "Salidas organizadas alrededor de temporadas y eventos especiales — Semana Santa, verano, Año Nuevo y puentes." ,
    },
    badges: ["seasonal", "last"],
    region: { en: "Curated dates · Limited spots", fr: "Dates choisies · Places limitées", es: "Fechas elegidas · Plazas limitadas" },
    departures: [
      { label: { en: "Easter 2026",  fr: "Pâques 2026",      es: "Semana Santa 2026" }, dates: "28 Mar — 04 Apr", spots: 4 },
      { label: { en: "Summer 2026",  fr: "Été 2026",          es: "Verano 2026" },        dates: "12 Jul — 23 Jul", spots: 6 },
      { label: { en: "New Year 2027",fr: "Nouvel An 2027",   es: "Año Nuevo 2027" },     dates: "27 Dec — 03 Jan", spots: 2 },
    ],
  },
];

/* =========================================================================
   MOROCCO CIRCUITS — chip slider categories
   ========================================================================= */
export const CIRCUITS = [
  { slug: "sahara",        label: { en: "Sahara Desert",       fr: "Désert du Sahara",     es: "Desierto del Sáhara" } },
  { slug: "imperial",      label: { en: "Imperial Cities",      fr: "Cités impériales",     es: "Ciudades imperiales" } },
  { slug: "atlas",         label: { en: "Atlas Mountains",      fr: "Montagnes de l'Atlas", es: "Montañas del Atlas" } },
  { slug: "kasbahs",       label: { en: "Route of the Kasbahs", fr: "Route des Kasbahs",    es: "Ruta de las Kasbahs" } },
  { slug: "north",         label: { en: "Northern Morocco",     fr: "Maroc du Nord",        es: "Marruecos del Norte" } },
  { slug: "short",         label: { en: "Short Escapes",        fr: "Escapades courtes",    es: "Escapadas cortas" } },
  { slug: "adventure",     label: { en: "Adventure Expeditions",fr: "Expéditions aventure", es: "Expediciones de aventura" } },
];

/* =========================================================================
   MAP — 12 doorways into Morocco
   ========================================================================= */
export const MAP_POINTS = [
  { id: "marrakech",   name: "Marrakech",                  coords: [31.6295, -7.9811] },
  { id: "fez",         name: "Fez",                        coords: [34.0181, -5.0078] },
  { id: "chefchaouen", name: "Chefchaouen",                coords: [35.1714, -5.2697] },
  { id: "merzouga",    name: "Merzouga · Erg Chebbi",      coords: [31.0995, -4.0128] },
  { id: "mhamid",      name: "Mhamid · Erg Chigaga",       coords: [29.8266, -5.7196] },
  { id: "essaouira",   name: "Essaouira",                  coords: [31.5085, -9.7595] },
  { id: "ait-ben",     name: "Aït Benhaddou",              coords: [31.0473, -7.1294] },
  { id: "imlil",       name: "Imlil · Toubkal",            coords: [31.1369, -7.9230] },
  { id: "ouarzazate",  name: "Ouarzazate",                 coords: [30.9189, -6.8934] },
  { id: "tangier",     name: "Tangier",                    coords: [35.7595, -5.8340] },
  { id: "meknes",      name: "Meknès",                     coords: [33.8935, -5.5473] },
  { id: "arfoud",      name: "Arfoud · Gate of the Sahara",coords: [31.4358, -4.2380] },
];

/* =========================================================================
   CONTACT INFO — phone, email, hours
   ========================================================================= */
export const CONTACT = {
  phone: "+34 937 268 366",
  phoneRaw: "+34937268366",
  email: "xalucatours@xaluca.com",
  address: {
    en: "Grup Xaluca Headquarters · Barcelona, Spain",
    fr: "Siège Grup Xaluca · Barcelone, Espagne",
    es: "Sede de Grup Xaluca · Barcelona, España",
  },
};
