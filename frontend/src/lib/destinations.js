/* ============================================================
   destinations.js — data catalogue for "Qué ver en Marruecos"
   ----
   Each destination exposes:
     id              — stable, lower-case, kebab-case.
     name            — trilingual display name (ES/EN/FR).
     category        — one of CATEGORIES below.
     image           — Unsplash URL (whitelisted Morocco-only photos).
     description     — short trilingual blurb (2–3 sentences).
     relatedTrips    — { label, link } pairs that deep-link into
                       the rest of the site via routes.js IDs.
   The page renders a category-coloured grid with editable images
   (slot path auto-built via <SlotScope id="que-ver">) and SPA Links.
============================================================ */
import { IMG as BANK } from "@/lib/imageBank";

const T = (es, en, fr) => ({ es, en, fr });

/* Category palette — order = tab order; colour = accent for the chip. */
export const CATEGORIES = {
  imperial:   { color: "#A07042", label: T("Ciudad imperial", "Imperial city", "Cité impériale") },
  desierto:   { color: "#C16542", label: T("Desierto",        "Desert",        "Désert") },
  costa:      { color: "#3A4A5F", label: T("Costa",           "Coast",         "Côte") },
  naturaleza: { color: "#5A6B4F", label: T("Naturaleza",      "Nature",        "Nature") },
  montana:    { color: "#465A52", label: T("Montaña",         "Mountain",      "Montagne") },
  cultura:    { color: "#7A5944", label: T("Cultura",         "Culture",       "Culture") },
  kasbah:     { color: "#8B4D2C", label: T("Kasbah",          "Kasbah",        "Kasbah") },
  oasis:      { color: "#6E7A3E", label: T("Oasis",           "Oasis",         "Oasis") },
};

export const DESTINATIONS = [
  {
    id: "marrakech",
    name: T("Marrakech", "Marrakech", "Marrakech"),
    category: "imperial",
    image: BANK.koutoubia,
    description: T(
      "La ciudad roja: zoco de Jemaa el-Fna, riads escondidos, el alminar de la Koutoubia y la danza de aromas a cuero, especias y menta.",
      "The red city: Jemaa el-Fna souk, hidden riads, the Koutoubia minaret and a dance of leather, spice and mint.",
      "La ville rouge : souk de Jemaa el-Fna, riads cachés, minaret de la Koutoubia et un ballet d'arômes de cuir, d'épices et de menthe.",
    ),
    relatedTrips: [
      { label: T("Escapadas desde Marrakech",       "Short escapes from Marrakech", "Escapades depuis Marrakech"), link: "tourEscapadaMarrakech" },
      { label: T("Marrakech ↔ Erg Chebbi · loop",   "Marrakech ↔ Erg Chebbi · loop", "Marrakech ↔ Erg Chebbi · boucle"), link: "tourMarrakechLoopHub" },
      { label: T("Gran Sur · Marrakech → Fez",      "Grand South · Marrakech → Fez", "Grand Sud · Marrakech → Fès"),     link: "tourGransurRakFezHub" },
    ],
  },
  {
    id: "fez",
    name: T("Fez", "Fez", "Fès"),
    category: "imperial",
    image: BANK.medinaPeople,
    description: T(
      "La capital espiritual: la medina más laberíntica del mundo árabe, las curtidurías Chouara y la universidad al-Qarawiyyin, la más antigua del planeta.",
      "Morocco's spiritual capital: the Arab world's most labyrinthine medina, the Chouara tanneries and al-Qarawiyyin, the oldest university on earth.",
      "La capitale spirituelle : la médina la plus labyrinthique du monde arabe, les tanneries Chouara et al-Qarawiyyin, la plus ancienne université du monde.",
    ),
    relatedTrips: [
      { label: T("Ciudades Imperiales",          "Imperial Cities",                 "Cités Impériales"),                   link: "tourNorteCiudadesImperiales" },
      { label: T("Fez → Tánger",                 "Fez → Tangier",                   "Fès → Tanger"),                       link: "tourFezTanger56" },
      { label: T("Gran Sur · Fez → Marrakech",   "Grand South · Fez → Marrakech",   "Grand Sud · Fès → Marrakech"),        link: "tourGransurFezRak" },
      { label: T("Rutas con Medio Atlas",        "Routes via Middle Atlas",         "Routes par le Moyen Atlas"),          link: "tourGransurFezSidiali" },
    ],
  },
  {
    id: "rabat",
    name: T("Rabat", "Rabat", "Rabat"),
    category: "imperial",
    image: BANK.kasbahGate,
    description: T(
      "La capital costera: la Kasbah de los Udayas sobre el Atlántico, la Torre Hassan inacabada y el mausoleo de Mohamed V.",
      "The coastal capital: the Udayas Kasbah above the Atlantic, the unfinished Hassan Tower and the mausoleum of Mohamed V.",
      "La capitale côtière : la kasbah des Oudayas sur l'Atlantique, la tour Hassan inachevée et le mausolée de Mohammed V.",
    ),
    relatedTrips: [
      { label: T("Ciudades Imperiales", "Imperial Cities", "Cités Impériales"), link: "tourNorteCiudadesImperiales" },
    ],
  },
  {
    id: "tanger",
    name: T("Tánger", "Tangier", "Tanger"),
    category: "costa",
    image: BANK.essaouiraPort,
    description: T(
      "Puerta de África donde el Mediterráneo se hace Atlántico: kasbah, Petit Socco, Café Hafa y la luz que enamoró a Matisse y Bowles.",
      "Africa's gateway where the Mediterranean meets the Atlantic: kasbah, Petit Socco, Café Hafa and the light that enchanted Matisse and Bowles.",
      "Porte de l'Afrique où la Méditerranée devient Atlantique : kasbah, Petit Socco, Café Hafa et la lumière qui enchanta Matisse et Bowles.",
    ),
    relatedTrips: [
      { label: T("Tánger → Fez",      "Tangier → Fez",      "Tanger → Fès"),        link: "tourTangerFez56" },
      { label: T("Tánger → Marrakech","Tangier → Marrakech","Tanger → Marrakech"),  link: "tourGransurTangerRak" },
      { label: T("Escapadas en Tánger","Short escapes in Tangier","Escapades à Tanger"), link: "tourEscapadaTanger" },
    ],
  },
  {
    id: "chefchaouen",
    name: T("Chefchaouen", "Chefchaouen", "Chefchaouen"),
    category: "cultura",
    image: BANK.chefBlueCity,
    description: T(
      "La perla azul del Rif: callejones índigo, telares andalusíes y un anfiteatro de montañas que se incendia al atardecer.",
      "The blue pearl of the Rif: indigo alleys, Andalusian looms and a mountain amphitheatre that catches fire at sunset.",
      "La perle bleue du Rif : ruelles indigo, métiers à tisser andalous et un amphithéâtre montagneux qui s'embrase au coucher du soleil.",
    ),
    relatedTrips: [
      { label: T("Viajes del Norte de Marruecos", "Northern Morocco journeys", "Voyages du nord du Maroc"), link: "tourNorth" },
      { label: T("Ciudades Imperiales + Rif",     "Imperial Cities + Rif",     "Cités Impériales + Rif"),   link: "tourCiudadesImperialesRif67" },
    ],
  },
  {
    id: "ouarzazate",
    name: T("Ouarzazate", "Ouarzazate", "Ouarzazate"),
    category: "kasbah",
    image: BANK.kasbahArch,
    description: T(
      "La Hollywood del desierto: Atlas Studios, la kasbah Taourirt y la puerta sur a las gargantas y oasis del Drâa.",
      "The desert's Hollywood: Atlas Studios, the Taourirt kasbah and the southern gateway to the gorges and Drâa oases.",
      "Le Hollywood du désert : Atlas Studios, la kasbah Taourirt et la porte sud des gorges et des oasis du Drâa.",
    ),
    relatedTrips: [
      { label: T("Sur · Atlas – Desierto",        "South · Atlas – Desert",        "Sud · Atlas – Désert"),         link: "tourAtlasDesiertoHub" },
      { label: T("Alto Atlas · Desierto · Fez",   "High Atlas · Desert · Fez",     "Haut Atlas · Désert · Fès"),    link: "tourGransurOuarzaFez" },
    ],
  },
  {
    id: "aitben",
    name: T("Aït Ben Haddou", "Aït Ben Haddou", "Aït Ben Haddou"),
    category: "kasbah",
    image: BANK.kasbahArch,
    description: T(
      "El ksar más fotografiado del Sahara, Patrimonio de la Humanidad: torres de adobe rojo sobre el río Ounila, decorado natural de mil películas.",
      "The most photographed ksar of the Sahara, a UNESCO site: red adobe towers above the Ounila river, the natural set of a thousand films.",
      "Le ksar le plus photographié du Sahara, classé UNESCO : tours en pisé rouge au-dessus de l'oued Ounila, décor naturel de mille films.",
    ),
    relatedTrips: [
      { label: T("Rutas del Gran Sur",   "Grand South routes",   "Routes du Grand Sud"),   link: "tourSouth" },
      { label: T("Atlas – Desierto",     "Atlas – Desert",       "Atlas – Désert"),        link: "tourAtlasDesiertoHub" },
    ],
  },
  {
    id: "ergchebbi",
    name: T("Erg Chebbi", "Erg Chebbi", "Erg Chebbi"),
    category: "desierto",
    image: BANK.dunes,
    description: T(
      "Las dunas más altas de Marruecos: 28 km de mar dorado donde nacen los amaneceres, las caravanas y los bivouacs bajo las estrellas.",
      "Morocco's tallest dunes: 28 km of golden sea where sunrises, caravans and starlit bivouacs are born.",
      "Les plus hautes dunes du Maroc : 28 km de mer dorée où naissent les aubes, les caravanes et les bivouacs sous les étoiles.",
    ),
    relatedTrips: [
      { label: T("Marrakech ↔ Erg Chebbi",   "Marrakech ↔ Erg Chebbi",   "Marrakech ↔ Erg Chebbi"),     link: "tourMarrakechErgHub" },
      { label: T("Gran Sur · Fez → Marrakech","Grand South · Fez → Marrakech","Grand Sud · Fès → Marrakech"), link: "tourGransurFezRak" },
      { label: T("Atlas – Desierto",         "Atlas – Desert",           "Atlas – Désert"),             link: "tourAtlasDesiertoHub" },
    ],
  },
  {
    id: "dades",
    name: T("Gargantas del Dades", "Dades Gorges", "Gorges du Dadès"),
    category: "naturaleza",
    image: BANK.dunesRocky,
    description: T(
      "La «ruta de las mil kasbahs»: paredes ocres, dedos de Monos y carreteras serpenteantes que parecen pintadas a mano.",
      "The «road of a thousand kasbahs»: ochre walls, Monkey Fingers rock and hand-painted serpentine roads.",
      "La « route des mille kasbahs » : parois ocres, doigts de singe et lacets sinueux qui semblent peints à la main.",
    ),
    relatedTrips: [
      { label: T("Atlas – Desierto",            "Atlas – Desert",            "Atlas – Désert"),            link: "tourAtlasDesiertoHub" },
      { label: T("Gran Sur · Ouarzazate – Fez", "Grand South · Ouarzazate – Fez", "Grand Sud · Ouarzazate – Fès"), link: "tourGransurOuarzaFez" },
    ],
  },
  {
    id: "todra",
    name: T("Gargantas del Todra", "Todra Gorges", "Gorges du Todra"),
    category: "naturaleza",
    image: BANK.atlasMisty,
    description: T(
      "Paredes calizas de 300 m que se cierran sobre un río cristalino: el cañón más espectacular del sur, paraíso de escaladores y bereberes.",
      "300-metre limestone walls closing over a crystal stream: the south's most spectacular canyon, paradise for climbers and Berbers.",
      "Des parois calcaires de 300 m surplombant un ruisseau cristallin : le canyon le plus spectaculaire du sud, paradis des grimpeurs et des Berbères.",
    ),
    relatedTrips: [
      { label: T("Atlas – Desierto",     "Atlas – Desert",     "Atlas – Désert"),     link: "tourAtlasDesiertoHub" },
    ],
  },
  {
    id: "volubilis",
    name: T("Volubilis", "Volubilis", "Volubilis"),
    category: "cultura",
    image: BANK.atlasValley,
    description: T(
      "Las ruinas romanas mejor conservadas del norte de África: mosaicos intactos del s. III a 35 km de Meknes, frente al monte Zerhoun.",
      "North Africa's best-preserved Roman ruins: intact 3rd-century mosaics 35 km from Meknes, facing Mount Zerhoun.",
      "Les ruines romaines les mieux conservées d'Afrique du Nord : des mosaïques intactes du IIIᵉ siècle à 35 km de Meknès, face au mont Zerhoun.",
    ),
    relatedTrips: [
      { label: T("Ciudades Imperiales", "Imperial Cities", "Cités Impériales"), link: "tourNorteCiudadesImperiales" },
    ],
  },
  {
    id: "meknes",
    name: T("Meknès", "Meknes", "Meknès"),
    category: "imperial",
    image: BANK.kasbahGate,
    description: T(
      "El «Versalles marroquí» de Moulay Ismaíl: Bab Mansour, las caballerizas reales y la medina UNESCO menos turística de las cuatro imperiales.",
      "Moulay Ismail's «Moroccan Versailles»: Bab Mansour, royal stables and the least touristy UNESCO medina of the four imperial cities.",
      "Le « Versailles marocain » de Moulay Ismaïl : Bab Mansour, les écuries royales et la médina UNESCO la moins touristique des quatre cités impériales.",
    ),
    relatedTrips: [
      { label: T("Ciudades Imperiales", "Imperial Cities", "Cités Impériales"), link: "tourNorteCiudadesImperiales" },
    ],
  },
  {
    id: "asilah",
    name: T("Asilah", "Asilah", "Asilah"),
    category: "costa",
    image: BANK.chefStreet,
    description: T(
      "Pueblo blanco atlántico de murales repintados cada verano, murallas portuguesas y playas de viento para los kitesurfistas.",
      "Atlantic white-washed village with murals repainted every summer, Portuguese ramparts and windswept beaches for kitesurfers.",
      "Village blanc atlantique aux fresques repeintes chaque été, remparts portugais et plages venteuses pour les kitesurfeurs.",
    ),
    relatedTrips: [
      { label: T("Viajes del Norte", "Northern Morocco journeys", "Voyages du nord"), link: "tourNorth" },
    ],
  },
  {
    id: "tetuan",
    name: T("Tetuán", "Tetouan", "Tétouan"),
    category: "imperial",
    image: BANK.medinaPeople,
    description: T(
      "La medina UNESCO andalusí: barrio judío de Mellah, zocos de cueros y plata, y el muralismo colonial español como telón.",
      "The Andalusian UNESCO medina: the Mellah Jewish quarter, leather and silver souks, with Spanish colonial murals as a backdrop.",
      "La médina UNESCO andalouse : le Mellah juif, les souks du cuir et de l'argent et les fresques coloniales espagnoles en arrière-plan.",
    ),
    relatedTrips: [
      { label: T("Viajes del Norte",     "Northern Morocco journeys", "Voyages du nord"),                 link: "tourNorth" },
      { label: T("Ciudades Imperiales + Rif", "Imperial Cities + Rif",     "Cités Impériales + Rif"),    link: "tourCiudadesImperialesRif67" },
    ],
  },
  {
    id: "agadir",
    name: T("Agadir", "Agadir", "Agadir"),
    category: "costa",
    image: BANK.essaouiraPort,
    description: T(
      "El Atlántico que reconstruyó tras el terremoto del 60: 10 km de playa rubia, surf, marisco fresco y la puerta al Anti-Atlas.",
      "The Atlantic city rebuilt after the '60 quake: 10 km of blond beach, surf, fresh seafood and the gateway to the Anti-Atlas.",
      "L'Atlantique reconstruit après le séisme de 60 : 10 km de plage blonde, surf, fruits de mer frais et porte de l'Anti-Atlas.",
    ),
    relatedTrips: [
      { label: T("Rutas del Gran Sur",     "Grand South routes",     "Routes du Grand Sud"),    link: "tourSouth" },
    ],
  },
  {
    id: "dakhla",
    name: T("Dakhla", "Dakhla", "Dakhla"),
    category: "costa",
    image: BANK.essaouiraPort,
    description: T(
      "Una lengua de tierra entre el Atlántico y la laguna: capital mundial del kitesurf, dunas blancas y mariscos a 25 °C todo el año.",
      "A spit of land between Atlantic and lagoon: world capital of kitesurfing, white dunes and seafood at 25 °C all year round.",
      "Une langue de terre entre Atlantique et lagune : capitale mondiale du kitesurf, dunes blanches et fruits de mer à 25 °C toute l'année.",
    ),
    relatedTrips: [
      { label: T("Sur atlántico",  "Atlantic south", "Sud atlantique"), link: "tourSouth" },
    ],
  },
  {
    id: "tafraoute",
    name: T("Tafraoute", "Tafraoute", "Tafraoute"),
    category: "montana",
    image: BANK.atlasMisty,
    description: T(
      "Corazón del Anti-Atlas bereber: rocas pintadas de azul por el artista Verame, palmerales y senderos entre las almendras en flor.",
      "Heart of the Berber Anti-Atlas: rocks painted blue by the artist Verame, palm groves and trails through almond blossom.",
      "Cœur de l'Anti-Atlas berbère : rochers peints en bleu par l'artiste Verame, palmeraies et sentiers parmi les amandiers en fleur.",
    ),
    relatedTrips: [
      { label: T("Rutas del Sur",  "Southern routes", "Routes du sud"),  link: "tourSouth" },
    ],
  },
  {
    id: "legzira",
    name: T("Legzira", "Legzira", "Legzira"),
    category: "costa",
    image: BANK.essaouiraPort,
    description: T(
      "Acantilados rojos y arcos naturales esculpidos por las olas: una de las playas más fotogénicas del Atlántico marroquí.",
      "Red cliffs and natural arches carved by the waves: one of the most photogenic beaches on Morocco's Atlantic.",
      "Falaises rouges et arches naturelles sculptées par les vagues : l'une des plages les plus photogéniques de l'Atlantique marocain.",
    ),
    relatedTrips: [
      { label: T("Rutas del Sur atlántico", "Atlantic south routes", "Routes du sud atlantique"), link: "tourSouth" },
    ],
  },
  {
    id: "ouzoud",
    name: T("Cascadas de Ouzoud", "Ouzoud waterfalls", "Cascades d'Ouzoud"),
    category: "naturaleza",
    image: BANK.atlasMisty,
    description: T(
      "Tres saltos de 110 m envueltos en arco iris perpetuo y monos macacos saltando entre olivos: la escapada verde del Atlas.",
      "Three 110-metre falls wrapped in perpetual rainbow and Barbary macaques leaping between olive trees: the Atlas's green escape.",
      "Trois chutes de 110 m enveloppées d'un arc-en-ciel permanent et des macaques de Barbarie sautant entre les oliviers : l'escapade verte de l'Atlas.",
    ),
    relatedTrips: [
      { label: T("Escapadas en Marrakech",  "Short escapes from Marrakech", "Escapades à Marrakech"), link: "tourEscapadaMarrakech" },
      { label: T("Escapadas al Alto Atlas", "High Atlas escapes",           "Escapades au Haut Atlas"), link: "tourEscapadaAtlas34" },
    ],
  },
  {
    id: "ifrane",
    name: T("Ifrane", "Ifrane", "Ifrane"),
    category: "montana",
    image: BANK.atlasVillage,
    description: T(
      "«La pequeña Suiza marroquí»: chalets a 1.650 m, bosques de cedros gigantes con macacos y nieve cada invierno.",
      "«Morocco's little Switzerland»: chalets at 1,650 m, giant-cedar forests with macaques and snow each winter.",
      "« La petite Suisse marocaine » : chalets à 1 650 m, forêts de cèdres géants avec macaques et neige chaque hiver.",
    ),
    relatedTrips: [
      { label: T("Rutas con Medio Atlas",  "Middle Atlas routes",  "Routes du Moyen Atlas"),    link: "tourGransurFezSidiali" },
      { label: T("Fez – Sidi Ali · escapada", "Fez – Sidi Ali short escape", "Fès – Sidi Ali · escapade"), link: "tourEscapadaFezSidiali34" },
    ],
  },
  {
    id: "draa",
    name: T("Valle del Drâa", "Drâa Valley", "Vallée du Drâa"),
    category: "oasis",
    image: BANK.atlasValley,
    description: T(
      "El palmeral más largo del mundo: 200 km de oasis entre Ouarzazate y Zagora, ksures de adobe y la antigua ruta caravanera a Tombuctú.",
      "The world's longest palm grove: 200 km of oases between Ouarzazate and Zagora, adobe ksars and the old caravan route to Timbuktu.",
      "La plus longue palmeraie du monde : 200 km d'oasis entre Ouarzazate et Zagora, ksours en pisé et ancienne route caravanière de Tombouctou.",
    ),
    relatedTrips: [
      { label: T("Rutas del Gran Sur",    "Grand South routes",    "Routes du Grand Sud"),    link: "tourSouth" },
      { label: T("Atlas – Desierto",      "Atlas – Desert",        "Atlas – Désert"),         link: "tourAtlasDesiertoHub" },
    ],
  },
  {
    id: "rissani",
    name: T("Rissani", "Rissani", "Rissani"),
    category: "cultura",
    image: BANK.marketBaskets,
    description: T(
      "El zoco más vivo del sur: capital nómada del antiguo reino Sijilmasa, mercados de domingo de dátiles, alfombras y caravanas.",
      "The south's liveliest souk: nomadic capital of the old Sijilmasa kingdom, Sunday markets of dates, carpets and caravans.",
      "Le souk le plus vivant du sud : capitale nomade de l'ancien royaume Sijilmasa, marchés du dimanche aux dattes, tapis et caravanes.",
    ),
    relatedTrips: [
      { label: T("Rutas de desierto",     "Desert routes",          "Routes du désert"),          link: "tourMarrakechErgHub" },
      { label: T("Gran Sur",              "Grand South",            "Grand Sud"),                 link: "tourSouth" },
    ],
  },
  {
    id: "tamegroute",
    name: T("Tamegroute", "Tamegroute", "Tamegroute"),
    category: "cultura",
    image: BANK.marketBaskets,
    description: T(
      "Aldea sufí del Drâa: biblioteca coránica del s. XVII con manuscritos en piel de gacela y ceramistas que cuecen su verde único.",
      "Sufi village in the Drâa: 17th-century Koranic library with gazelle-skin manuscripts and potters firing their unique green glaze.",
      "Village soufi du Drâa : bibliothèque coranique du XVIIᵉ avec manuscrits en peau de gazelle et potiers cuisant leur vert unique.",
    ),
    relatedTrips: [
      { label: T("Atlas – Desierto",     "Atlas – Desert",     "Atlas – Désert"),     link: "tourAtlasDesiertoHub" },
    ],
  },
  {
    id: "essaouira",
    name: T("Essaouira", "Essaouira", "Essaouira"),
    category: "costa",
    image: BANK.essaouiraPort,
    description: T(
      "El antiguo Mogador portugués: murallas batidas por los alisios, gaviotas, gnawa y los mejores erizos del Atlántico.",
      "The old Portuguese Mogador: ramparts battered by trade winds, gulls, gnawa music and the best sea urchins on the Atlantic.",
      "L'ancien Mogador portugais : remparts battus par les alizés, mouettes, musique gnawa et les meilleurs oursins de l'Atlantique.",
    ),
    relatedTrips: [
      { label: T("Marrakech – Essaouira", "Marrakech – Essaouira", "Marrakech – Essaouira"), link: "tourMarrakechEssHub" },
    ],
  },
];
