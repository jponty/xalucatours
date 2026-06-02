/* ============================================================
   placeGalleries.js
   ----
   Guarantees that EVERY Day-Map point of interest ("Puntos de
   interés del día") can open its "Galería del lugar" with exactly
   3 editorial cards.

   Two layers:
   1) ALIAS_PROFILE — links gazetteer ids to an existing CITY_PROFILES
      entry that already ships a 3-card gallery (no new content needed).
   2) CURATED_PLACE_CARDS — hand-written 3-card galleries for the places
      that have no CITY_PROFILES entry of their own.
   3) buildPlaceGallery() — resolves the best 3-card gallery for any
      gazetteer entry, falling back to a thematic 3-card set so the
      carousel is NEVER empty.

   Card shape: { src, title: {es,en,fr}, description: {es,en,fr} }.
   Everything stays CMS-editable downstream.
============================================================ */
import { IMG as I } from "@/lib/imageBank";
import { CITY_PROFILES } from "@/lib/cityProfiles";

const T = (es, en, fr) => ({ es, en, fr });
const G = (cards) => cards.map(([src, title, description]) => ({ src, title, description }));

/* Gazetteer id → existing CITY_PROFILES key (already has a 3-card gallery). */
export const ALIAS_PROFILE = {
  imlil: "imlil",
  toubkal: "toubkal",
  antiatlas: "antiatlas",
  mgoun: "mgoun",
  tinerhir: "tinerhir",
  merzouga: "merzouga",
  zizvalley: "ziz",
  draavalley: "draa",
  dadesgorges: "dades",
  boumalne: "dades",
  altoatlas: "atlas",
};

/* Thematic image triplets by gazetteer kind — last-resort fallback. */
const KIND_IMAGES = {
  town:      [I.medinaPeople, I.kasbahArch, I.riadFountain],
  village:   [I.atlasVillage, I.atlasValley, I.desertWoman],
  kasbah:    [I.kasbahArch, I.kasbahGate, I.riadFountain],
  site:      [I.atlasValley, I.kasbahArch, I.atlasMisty],
  palm:      [I.atlasValley, I.riadInterior, I.atlasMisty],
  gorges:    [I.atlasMisty, I.dunesRocky, I.atlasValley],
  valley:    [I.atlasValley, I.atlasMisty, I.riadFountain],
  mountain:  [I.atlasMisty, I.atlasSnowy, I.atlasValley],
  dunes:     [I.dunes, I.camelDunes, I.camelCaravan],
  viewpoint: [I.atlasMisty, I.essaouiraPort, I.dunesRocky],
  market:    [I.marketBaskets, I.medinaPeople, I.riadInterior],
  music:     [I.medinaPeople, I.riadInterior, I.desertWoman],
  fossils:   [I.dunesRocky, I.kasbahArch, I.camelDunes],
  hotel:     [I.riadFountain, I.riadInterior, I.kasbahArch],
  camp:      [I.camelCaravan, I.dunes, I.camelDunes],
};
const DEFAULT_IMAGES = [I.atlasValley, I.kasbahArch, I.dunes];

/* ---------------- Curated 3-card galleries ---------------- */
export const CURATED_PLACE_CARDS = {
  moulayidriss: G([
    [I.atlasVillage,
      T("La ciudad santa", "The holy town", "La ville sainte"),
      T("Moulay Idriss Zerhoun, fundada por el bisnieto del Profeta, es uno de los lugares más sagrados de Marruecos.",
        "Moulay Idriss Zerhoun, founded by the Prophet's great-grandson, is one of Morocco's holiest places.",
        "Moulay Idriss Zerhoun, fondée par l'arrière-petit-fils du Prophète, est l'un des lieux les plus sacrés du Maroc.")],
    [I.medinaPeople,
      T("Casas escalonadas", "Stepped houses", "Maisons en gradins"),
      T("Casas blancas y verdes se apilan sobre dos colinas, coronadas por el mausoleo de Idriss I.",
        "White and green houses pile over two hills, crowned by the mausoleum of Idriss I.",
        "Maisons blanches et vertes empilées sur deux collines, couronnées par le mausolée d'Idriss Iᵉʳ.")],
    [I.kasbahArch,
      T("Mirador del Zerhoun", "Zerhoun viewpoint", "Belvédère du Zerhoun"),
      T("Desde lo alto, vistas a los campos de olivos y a la cercana Volubilis romana.",
        "From the top, views over olive groves and nearby Roman Volubilis.",
        "Depuis les hauteurs, vue sur les oliveraies et la Volubilis romaine voisine.")],
  ]),
  midelt: G([
    [I.atlasValley,
      T("Entre dos Atlas", "Between two Atlas ranges", "Entre deux Atlas"),
      T("Midelt marca la frontera entre el Alto y el Medio Atlas, etapa natural camino del desierto.",
        "Midelt marks the divide between the High and Middle Atlas — a natural stage on the desert road.",
        "Midelt marque la limite entre le Haut et le Moyen Atlas, étape naturelle vers le désert.")],
    [I.atlasMisty,
      T("Tierra de manzanas", "Apple country", "Pays des pommes"),
      T("Famosa por sus manzanares y por el monasterio de Tibhirine, entre montañas áridas.",
        "Famous for its apple orchards and the Tibhirine monastery, amid arid mountains.",
        "Réputée pour ses pommeraies et le monastère de Tibhirine, au milieu de montagnes arides.")],
    [I.atlasSnowy,
      T("Puerta del Cirque", "Gateway to the Cirque", "Porte du Cirque"),
      T("Punto de partida hacia el Cirque de Jaffar y los picos nevados del Ayachi.",
        "Starting point towards the Cirque de Jaffar and the snowy Ayachi peaks.",
        "Point de départ vers le Cirque de Jaffar et les sommets enneigés de l'Ayachi.")],
  ]),
  ouzoud: G([
    [I.atlasValley,
      T("Las cascadas", "The waterfalls", "Les cascades"),
      T("Con 110 metros de caída, las cascadas de Ouzoud son las más altas del norte de África.",
        "At 110 metres, the Ouzoud waterfalls are the tallest in North Africa.",
        "Avec 110 mètres de chute, les cascades d'Ouzoud sont les plus hautes d'Afrique du Nord.")],
    [I.atlasMisty,
      T("Arcoíris y monos", "Rainbows & monkeys", "Arcs-en-ciel et singes"),
      T("Arcoíris perpetuos sobre las pozas y familias de macacos de Berbería entre los olivos.",
        "Perpetual rainbows over the pools and Barbary macaque families among the olive trees.",
        "Arcs-en-ciel perpétuels sur les vasques et familles de magots parmi les oliviers.")],
    [I.riadInterior,
      T("Molinos del oued", "Wadi mills", "Moulins de l'oued"),
      T("Antiguos molinos de aceite dan nombre al lugar: «ouzoud» significa aceituna en bereber.",
        "Old olive-oil mills give the place its name: «ouzoud» means olive in Berber.",
        "D'anciens moulins à huile donnent son nom au lieu : « ouzoud » signifie olive en berbère.")],
  ]),
  rif: G([
    [I.atlasMisty,
      T("El Rif verde", "The green Rif", "Le Rif vert"),
      T("Una cordillera de bosques de cedros y aldeas bereberes asomada al Mediterráneo.",
        "A range of cedar forests and Berber villages overlooking the Mediterranean.",
        "Une chaîne de forêts de cèdres et de villages berbères surplombant la Méditerranée.")],
    [I.chefBlueCity,
      T("Pueblos de montaña", "Mountain villages", "Villages de montagne"),
      T("Chefchaouen y sus vecinas salpican de azul y cal las laderas del Rif.",
        "Chefchaouen and its neighbours dot the Rif slopes with blue and whitewash.",
        "Chefchaouen et ses voisines parsèment les versants du Rif de bleu et de chaux.")],
    [I.atlasValley,
      T("Senderos y cascadas", "Trails & waterfalls", "Sentiers et cascades"),
      T("Rutas de senderismo entre cascadas, puentes naturales y pozas turquesas.",
        "Hiking trails among waterfalls, natural bridges and turquoise pools.",
        "Sentiers de randonnée entre cascades, ponts naturels et vasques turquoise.")],
  ]),
  boutaghrar: G([
    [I.atlasVillage,
      T("Corazón del M'Goun", "Heart of the M'Goun", "Cœur du M'Goun"),
      T("Aldea bereber a 1.900 m, punto de partida de los trekkings al macizo del M'Goun.",
        "Berber village at 1,900 m, the trailhead for treks into the M'Goun massif.",
        "Village berbère à 1 900 m, départ des treks vers le massif du M'Goun.")],
    [I.atlasValley,
      T("Valle de las Rosas", "Rose Valley", "Vallée des Roses"),
      T("Rodeado de rosales de Damasco que cada primavera tiñen el aire de aroma.",
        "Surrounded by Damask rose bushes that scent the air each spring.",
        "Entouré de rosiers de Damas qui parfument l'air chaque printemps.")],
    [I.atlasMisty,
      T("Vida troglodita", "Troglodyte life", "Vie troglodyte"),
      T("Familias que aún habitan casas de piedra y cuevas excavadas en la roca.",
        "Families still living in stone houses and caves carved into the rock.",
        "Des familles vivant encore dans des maisons de pierre et des grottes creusées dans la roche.")],
  ]),
  rosevalley: G([
    [I.atlasValley,
      T("El Valle de las Rosas", "The Rose Valley", "La Vallée des Roses"),
      T("Kilómetros de rosales de Damasco entre Kelaat M'Gouna y Boutaghrar.",
        "Miles of Damask rose bushes between Kelaat M'Gouna and Boutaghrar.",
        "Des kilomètres de rosiers de Damas entre Kelaat M'Gouna et Boutaghrar.")],
    [I.riadFountain,
      T("Agua de rosas", "Rose water", "Eau de rose"),
      T("De sus pétalos se destila el agua de rosas y los cosméticos más preciados del sur.",
        "Its petals are distilled into the south's most prized rose water and cosmetics.",
        "Ses pétales sont distillés en eau de rose et cosmétiques les plus prisés du sud.")],
    [I.atlasMisty,
      T("Fiesta de la rosa", "Rose festival", "Fête de la rose"),
      T("Cada mayo, la cosecha se celebra con música, danzas y desfiles bereberes.",
        "Each May, the harvest is celebrated with Berber music, dances and parades.",
        "Chaque mai, la récolte est célébrée par musique, danses et défilés berbères.")],
  ]),
  fossils: G([
    [I.dunesRocky,
      T("Mar de hace 360 millones de años", "A 360-million-year-old sea", "Une mer de 360 millions d'années"),
      T("Las canteras de Erfoud conservan fósiles marinos de cuando el Sahara era un océano tropical.",
        "Erfoud's quarries hold marine fossils from when the Sahara was a tropical ocean.",
        "Les carrières d'Erfoud conservent des fossiles marins du temps où le Sahara était un océan tropical.")],
    [I.kasbahArch,
      T("Ammonites y trilobites", "Ammonites & trilobites", "Ammonites et trilobites"),
      T("Ammonites, trilobites y ortoceras se tallan y pulen en mármol negro local.",
        "Ammonites, trilobites and orthoceras are carved and polished into local black marble.",
        "Ammonites, trilobites et orthocères, taillés et polis dans le marbre noir local.")],
    [I.camelDunes,
      T("Talleres del desierto", "Desert workshops", "Ateliers du désert"),
      T("Marruecos es uno de los mayores exportadores de fósiles devónicos del mundo.",
        "Morocco is one of the world's largest exporters of Devonian fossils.",
        "Le Maroc est l'un des plus grands exportateurs de fossiles dévoniens au monde.")],
  ]),
  zagora: G([
    [I.dunes,
      T("«Tombouctou, 52 días»", "«Timbuktu, 52 days»", "« Tombouctou, 52 jours »"),
      T("El célebre rótulo recuerda las antiguas caravanas que partían hacia el corazón de África.",
        "The famous sign recalls the old caravans setting off into the heart of Africa.",
        "Le célèbre panneau rappelle les anciennes caravanes partant vers le cœur de l'Afrique.")],
    [I.camelCaravan,
      T("Puerta del Drâa", "Gateway to the Draa", "Porte du Drâa"),
      T("Final del gran palmeral del Drâa y umbral del desierto de dunas de Tinfou y Chegaga.",
        "End of the great Draa palm grove and threshold of the Tinfou and Chegaga dunes.",
        "Fin de la grande palmeraie du Drâa et seuil des dunes de Tinfou et Chegaga.")],
    [I.kasbahArch,
      T("Kasbahs de adobe", "Adobe kasbahs", "Kasbahs en pisé"),
      T("Antiguas fortalezas de tierra jalonan el oasis camino del sur profundo.",
        "Ancient earthen fortresses line the oasis on the way to the deep south.",
        "D'anciennes forteresses de terre jalonnent l'oasis vers le grand sud.")],
  ]),
  cabospartel: G([
    [I.essaouiraPort,
      T("Donde se abrazan dos mares", "Where two seas meet", "Où deux mers se rejoignent"),
      T("El Cabo Espartel señala el encuentro del Atlántico y el Mediterráneo.",
        "Cape Spartel marks the meeting of the Atlantic and the Mediterranean.",
        "Le Cap Spartel marque la rencontre de l'Atlantique et de la Méditerranée.")],
    [I.atlasMisty,
      T("El faro de 1864", "The 1864 lighthouse", "Le phare de 1864"),
      T("Un faro histórico domina los acantilados en el extremo noroeste de África.",
        "A historic lighthouse crowns the cliffs at Africa's north-western tip.",
        "Un phare historique domine les falaises à la pointe nord-ouest de l'Afrique.")],
    [I.chefStreet,
      T("Bosque y acantilados", "Forest & cliffs", "Forêt et falaises"),
      T("El bosque de la Perdicaris desciende hasta playas de arena dorada.",
        "The Perdicaris forest descends to beaches of golden sand.",
        "La forêt de Perdicaris descend vers des plages de sable doré.")],
  ]),
  grutashercules: G([
    [I.essaouiraPort,
      T("La cueva del mito", "The cave of myth", "La grotte du mythe"),
      T("Según la leyenda, Hércules descansó aquí antes de su undécimo trabajo.",
        "Legend says Hercules rested here before his eleventh labour.",
        "Selon la légende, Hercule s'y reposa avant son onzième travail.")],
    [I.dunesRocky,
      T("El mapa de África", "The map of Africa", "La carte de l'Afrique"),
      T("Su abertura al mar dibuja la silueta invertida del continente africano.",
        "Its sea opening draws the inverted silhouette of the African continent.",
        "Son ouverture sur la mer dessine la silhouette inversée du continent africain.")],
    [I.atlasMisty,
      T("Olas del Atlántico", "Atlantic waves", "Vagues de l'Atlantique"),
      T("Las mareas entran y rugen en una caverna habitada desde el Neolítico.",
        "Tides roll and roar into a cavern inhabited since the Neolithic.",
        "Les marées s'engouffrent et grondent dans une caverne habitée depuis le Néolithique.")],
  ]),
  "xaluca-dades": G([
    [I.riadFountain,
      T("Hotel Xaluca Dades", "Hotel Xaluca Dades", "Hôtel Xaluca Dadès"),
      T("Hotel-kasbah a 1.612 m con piscina climatizada, hammam y vistas al Alto Atlas.",
        "Kasbah-hotel at 1,612 m with heated pool, hammam and High Atlas views.",
        "Hôtel-kasbah à 1 612 m, piscine chauffée, hammam et vue sur le Haut Atlas.")],
    [I.kasbahArch,
      T("Arquitectura de tierra", "Earthen architecture", "Architecture de terre"),
      T("Inspirado en las kasbahs del valle, fusiona adobe tradicional y confort contemporáneo.",
        "Inspired by the valley kasbahs, it blends traditional adobe with contemporary comfort.",
        "Inspiré des kasbahs de la vallée, il mêle adobe traditionnel et confort contemporain.")],
    [I.riadInterior,
      T("Bienestar en el Dadès", "Wellness in the Dades", "Bien-être au Dadès"),
      T("Spa, jardines y gastronomía bereber tras una jornada por las gargantas.",
        "Spa, gardens and Berber cuisine after a day through the gorges.",
        "Spa, jardins et cuisine berbère après une journée dans les gorges.")],
  ]),
  "kasbah-xaluca-erfoud": G([
    [I.kasbahArch,
      T("Kasbah Hotel Xaluca", "Kasbah Hotel Xaluca", "Kasbah Hôtel Xaluca"),
      T("Kasbah-hotel en Erfoud, «la Puerta del Desierto», con piscina, jardines y wellness.",
        "Kasbah-hotel in Erfoud, «the Gateway to the Desert», with pool, gardens and wellness.",
        "Kasbah-hôtel à Erfoud, « la Porte du Désert », piscine, jardins et bien-être.")],
    [I.riadFountain,
      T("Oasis de confort", "Oasis of comfort", "Oasis de confort"),
      T("Piscina, jacuzzi, tenis y minigolf entre palmeras a las puertas del Sahara.",
        "Pool, jacuzzi, tennis and minigolf among palms at the doors of the Sahara.",
        "Piscine, jacuzzi, tennis et mini-golf entre palmiers aux portes du Sahara.")],
    [I.riadInterior,
      T("Sabores del Tafilalet", "Tafilalet flavours", "Saveurs du Tafilalet"),
      T("Cocina bereber y dátiles del oasis en un patio de inspiración kasbah.",
        "Berber cuisine and oasis dates in a kasbah-inspired courtyard.",
        "Cuisine berbère et dattes de l'oasis dans un patio d'inspiration kasbah.")],
  ]),
  "kasbah-tombouctou": G([
    [I.kasbahArch,
      T("Kasbah Hotel Tombouctou", "Kasbah Hotel Tombouctou", "Kasbah Hôtel Tombouctou"),
      T("Kasbah-hotel a pie de las dunas del Erg Chebbi, con piscina y hammam frente al desierto.",
        "Kasbah-hotel at the foot of the Erg Chebbi dunes, with pool and hammam facing the desert.",
        "Kasbah-hôtel au pied des dunes de l'Erg Chebbi, piscine et hammam face au désert.")],
    [I.dunes,
      T("Frente a las dunas", "Facing the dunes", "Face aux dunes"),
      T("Las terrazas miran directamente al Erg Chebbi y a sus amaneceres dorados.",
        "Terraces look straight onto Erg Chebbi and its golden sunrises.",
        "Les terrasses donnent directement sur l'Erg Chebbi et ses levers dorés.")],
    [I.riadFountain,
      T("Refugio del desierto", "Desert refuge", "Refuge du désert"),
      T("Piscina, hammam y jardines para reponerse tras la noche en el bivouac.",
        "Pool, hammam and gardens to recover after the night in the bivouac.",
        "Piscine, hammam et jardins pour se reposer après la nuit au bivouac.")],
  ]),
  "bivouac-luxe": G([
    [I.camelCaravan,
      T("Bivouac de Luxe", "Luxury Bivouac", "Bivouac de Luxe"),
      T("Campamento en haimas en el corazón de las dunas del Erg Chebbi.",
        "Jaima camp in the heart of the Erg Chebbi dunes.",
        "Campement en jaimas au cœur des dunes de l'Erg Chebbi.")],
    [I.dunes,
      T("Cena bajo las estrellas", "Dinner under the stars", "Dîner sous les étoiles"),
      T("Música, fuego y cielo limpio para una de las noches más memorables del viaje.",
        "Music, fire and clear skies for one of the trip's most memorable nights.",
        "Musique, feu et ciel pur pour l'une des nuits les plus mémorables du voyage.")],
    [I.camelDunes,
      T("Llegada en dromedario", "Arrival by camel", "Arrivée à dos de dromadaire"),
      T("Se accede al campamento a lomos de dromedario al atardecer, como los nómadas.",
        "The camp is reached on camelback at sunset, like the nomads.",
        "On rejoint le camp à dos de dromadaire au coucher du soleil, comme les nomades.")],
  ]),
};

/**
 * Resolve the best 3-card "Galería del lugar" for a gazetteer entry.
 * Guarantees a non-empty gallery so every Day-Map POI opens its drawer.
 *
 * @param {object} entry – gazetteer entry { id, kind, name, blurb?, profileKey? }
 * @returns {Array<{src,title,description}>} always length 3
 */
export const buildPlaceGallery = (entry) => {
  if (!entry) return [];

  // 1) Own CITY_PROFILES gallery (via direct profileKey or alias link).
  const profileKey = entry.profileKey || ALIAS_PROFILE[entry.id];
  const profile = profileKey ? CITY_PROFILES[profileKey] : null;
  if (profile && Array.isArray(profile.gallery) && profile.gallery.length > 0) {
    return profile.gallery;
  }

  // 2) Curated cards for places without a profile.
  if (CURATED_PLACE_CARDS[entry.id]) return CURATED_PLACE_CARDS[entry.id];

  // 3) Last-resort thematic 3-card set (never empty). Uses the place's own
  //    name + blurb so the first card stays specific to the location.
  const imgs = KIND_IMAGES[entry.kind] || DEFAULT_IMAGES;
  const name = entry.name || T("", "", "");
  const blurb = entry.blurb || T("", "", "");
  return [
    { src: imgs[0], title: name, description: blurb },
    { src: imgs[1] || imgs[0], title: name, description: blurb },
    { src: imgs[2] || imgs[0], title: name, description: blurb },
  ];
};

export default buildPlaceGallery;
