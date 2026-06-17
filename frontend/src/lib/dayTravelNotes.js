/* ============================================================
   dayTravelNotes.js
   ----
   Per-DAY "travel notes" defaults: 3 independent notes for each day of a
   programme, specific to that day's activities, places, tips, culture,
   photo suggestions and logistics. Trilingual (es/en/fr).

   These are only the DEFAULT contents — every note is individually
   editable from the CMS (Edit Text) and stored per day + per programme,
   so edits never leak across days or trips.

   First pilot: tourAtlasDesierto67 (/viajes/atlas_desierto/programa_6n_7d).
   To enable another trip, add an entry keyed by routeId (1-based day index).
============================================================ */

const T = (es, en, fr) => ({ es, en, fr });

// Fixed visual "kinds" by note position (icon/accent live in the component).
export const DAY_NOTE_KIND_COUNT = 3;

const NOTES = {
  tourAtlasDesierto67: {
    1: [
      {
        tagline: T("No te lo pierdas", "Don't miss it", "À ne pas manquer"),
        title: T("Aït Ben Haddou", "Aït Ben Haddou", "Aït Ben Haddou"),
        body: T(
          "La kasbah de tierra más famosa de Marruecos, Patrimonio de la Humanidad y escenario de cine. Cruza el cauce del río y sube hasta el granero para las mejores vistas.",
          "Morocco's most famous earthen kasbah — a World Heritage site and film location. Cross the riverbed and climb to the granary for the best views.",
          "La kasbah de terre la plus célèbre du Maroc, classée au patrimoine mondial et décor de cinéma. Traversez le lit de la rivière et montez jusqu'au grenier pour la plus belle vue.",
        ),
      },
      {
        tagline: T("Consejo del día", "Tip of the day", "Conseil du jour"),
        title: T("El puerto de Tizi n'Tichka", "The Tizi n'Tichka pass", "Le col du Tizi n'Tichka"),
        body: T(
          "La carretera del Alto Atlas tiene muchas curvas: lleva agua y algo ligero en el estómago. Las paradas fotográficas en lo alto merecen mucho la pena.",
          "The High Atlas road is full of bends: bring water and a light snack. The photo stops at the top are well worth it.",
          "La route du Haut Atlas est très sinueuse : prévoyez de l'eau et un en-cas léger. Les arrêts photo au sommet en valent la peine.",
        ),
      },
      {
        tagline: T("Para la foto", "For the photo", "Pour la photo"),
        title: T("Luz dorada en el Dadès", "Golden light over the Dadès", "Lumière dorée sur le Dadès"),
        body: T(
          "Al llegar a Boumalne, la última luz del día tiñe de ocre todo el valle. Es el mejor momento para fotos cálidas antes de cenar.",
          "On arrival in Boumalne, the last light of the day turns the whole valley ochre — the best moment for warm photos before dinner.",
          "À l'arrivée à Boumalne, la dernière lumière du jour pare la vallée d'ocre — le meilleur moment pour des photos chaleureuses avant le dîner.",
        ),
      },
    ],
    2: [
      {
        tagline: T("Imprescindible", "A must", "Incontournable"),
        title: T("Valle de las Rosas y M'Goun", "Valley of Roses & M'Goun", "Vallée des Roses et M'Goun"),
        body: T(
          "Caminos entre nogales, casas de adobe y campos de rosas (en flor en mayo). El macizo del M'Goun es el segundo más alto de Marruecos.",
          "Paths through walnut trees, adobe houses and rose fields (in bloom in May). The M'Goun massif is the second highest in Morocco.",
          "Des chemins entre noyers, maisons en pisé et champs de roses (en fleur en mai). Le massif du M'Goun est le deuxième plus haut du Maroc.",
        ),
      },
      {
        tagline: T("Consejo del día", "Tip of the day", "Conseil du jour"),
        title: T("Calzado y ritmo", "Footwear & pace", "Chaussures et rythme"),
        body: T(
          "Habrá tramos a pie por pistas y senderos: zapatillas cómodas y ritmo tranquilo. A esta altitud conviene beber agua a menudo.",
          "There will be sections on foot along tracks and trails: comfy shoes and an easy pace. At this altitude, drink water often.",
          "Il y aura des portions à pied sur pistes et sentiers : chaussures confortables et rythme tranquille. À cette altitude, buvez souvent.",
        ),
      },
      {
        tagline: T("Cultura local", "Local culture", "Culture locale"),
        title: T("Hospitalidad bereber", "Berber hospitality", "Hospitalité berbère"),
        body: T(
          "Si te invitan a un té a la menta, acéptalo: es el gesto de bienvenida más auténtico de las aldeas del Atlas.",
          "If you're offered a mint tea, accept it: it's the most genuine welcome in the Atlas villages.",
          "Si l'on vous offre un thé à la menthe, acceptez : c'est l'accueil le plus authentique des villages de l'Atlas.",
        ),
      },
    ],
    3: [
      {
        tagline: T("No te lo pierdas", "Don't miss it", "À ne pas manquer"),
        title: T("Gargantas del Todra", "Todra Gorges", "Gorges du Todra"),
        body: T(
          "Paredes verticales de hasta 300 m donde el río Todra abre un cañón espectacular. Pasea por el fondo entre los acantilados.",
          "Vertical walls up to 300 m where the Todra river carves a spectacular canyon. Walk along the bottom between the cliffs.",
          "Des parois verticales jusqu'à 300 m où la rivière Todra creuse un canyon spectaculaire. Promenez-vous au fond entre les falaises.",
        ),
      },
      {
        tagline: T("Curiosidad", "Did you know", "Le saviez-vous"),
        title: T("Los 'dedos de mono'", "The 'monkey fingers'", "Les « doigts de singe »"),
        body: T(
          "En el valle del Dadès, las curiosas rocas erosionadas conocidas como 'dedos de mono' son una parada fotográfica clásica de la ruta.",
          "In the Dadès valley, the curious eroded rocks known as 'monkey fingers' are a classic photo stop on the route.",
          "Dans la vallée du Dadès, les curieuses roches érodées appelées « doigts de singe » sont un arrêt photo classique.",
        ),
      },
      {
        tagline: T("Para la foto", "For the photo", "Pour la photo"),
        title: T("Fósiles de Erfoud", "Erfoud fossils", "Fossiles d'Erfoud"),
        body: T(
          "Erfoud es famosa por sus fósiles marinos de 350 millones de años: verás mármol negro pulido lleno de amonites.",
          "Erfoud is famous for its 350-million-year-old marine fossils: you'll see polished black marble full of ammonites.",
          "Erfoud est réputée pour ses fossiles marins de 350 millions d'années : vous verrez du marbre noir poli rempli d'ammonites.",
        ),
      },
    ],
    4: [
      {
        tagline: T("El momento del viaje", "The trip's highlight", "Le moment fort"),
        title: T("Dunas del Erg Chebbi", "Erg Chebbi dunes", "Dunes de l'Erg Chebbi"),
        body: T(
          "Dunas de hasta 150 m. La subida en dromedario al atardecer y la noche en el campamento son el corazón de todo el viaje.",
          "Dunes up to 150 m high. The camel ride at sunset and the night at camp are the heart of the whole trip.",
          "Des dunes jusqu'à 150 m. La balade à dos de dromadaire au coucher du soleil et la nuit au campement sont le cœur du voyage.",
        ),
      },
      {
        tagline: T("Consejo del día", "Tip of the day", "Conseil du jour"),
        title: T("Prepara el bivouac", "Pack for the bivouac", "Préparez le bivouac"),
        body: T(
          "Lleva una bolsa pequeña con lo justo para la noche; la maleta grande se queda en el 4x4. No olvides linterna y algo de abrigo.",
          "Bring a small bag with just the essentials for the night; the big suitcase stays in the 4x4. Don't forget a torch and something warm.",
          "Emportez un petit sac avec l'essentiel pour la nuit ; la grande valise reste dans le 4x4. N'oubliez pas une lampe et un vêtement chaud.",
        ),
      },
      {
        tagline: T("Para la foto", "For the photo", "Pour la photo"),
        title: T("Cielo de estrellas", "A sky full of stars", "Un ciel d'étoiles"),
        body: T(
          "Sin contaminación lumínica, la Vía Láctea se ve espectacular. Activa el modo noche del móvil o la cámara y disfruta del silencio.",
          "With no light pollution, the Milky Way looks spectacular. Switch on your phone or camera night mode and enjoy the silence.",
          "Sans pollution lumineuse, la Voie lactée est spectaculaire. Activez le mode nuit de votre téléphone ou appareil et savourez le silence.",
        ),
      },
    ],
    5: [
      {
        tagline: T("Vívelo", "Live it", "Vivez-le"),
        title: T("Amanecer sobre las dunas", "Sunrise over the dunes", "Lever du soleil sur les dunes"),
        body: T(
          "Madruga para ver salir el sol sobre el Erg Chebbi: la arena pasa del rosa al naranja en cuestión de minutos.",
          "Wake up early to watch the sun rise over Erg Chebbi: the sand shifts from pink to orange in minutes.",
          "Levez-vous tôt pour voir le soleil se lever sur l'Erg Chebbi : le sable passe du rose à l'orange en quelques minutes.",
        ),
      },
      {
        tagline: T("Cultura local", "Local culture", "Culture locale"),
        title: T("Gnawa en Khamlia", "Gnawa in Khamlia", "Gnawa à Khamlia"),
        body: T(
          "El pueblo de Khamlia, de origen subsahariano, conserva la música gnawa: ritmos hipnóticos heredados de sus antepasados.",
          "The village of Khamlia, of sub-Saharan origin, keeps the gnawa music alive: hypnotic rhythms inherited from its ancestors.",
          "Le village de Khamlia, d'origine subsaharienne, perpétue la musique gnawa : des rythmes hypnotiques hérités des ancêtres.",
        ),
      },
      {
        tagline: T("Consejo del día", "Tip of the day", "Conseil du jour"),
        title: T("Hidrátate y protégete", "Hydrate & protect", "Hydratez-vous"),
        body: T(
          "Aunque sea por la mañana, el sol del desierto es intenso: lleva gorra, gafas de sol y agua siempre a mano.",
          "Even in the morning the desert sun is intense: keep a cap, sunglasses and water always within reach.",
          "Même le matin, le soleil du désert est intense : gardez casquette, lunettes et eau toujours à portée de main.",
        ),
      },
    ],
    6: [
      {
        tagline: T("No te lo pierdas", "Don't miss it", "À ne pas manquer"),
        title: T("Zoco de Rissani", "Rissani souk", "Souk de Rissani"),
        body: T(
          "Uno de los mercados más auténticos del sur y cuna de la dinastía alauí. Especias, dátiles y mucho ambiente local.",
          "One of the most authentic markets in the south and cradle of the Alaouite dynasty. Spices, dates and plenty of local buzz.",
          "L'un des marchés les plus authentiques du sud et berceau de la dynastie alaouite. Épices, dattes et ambiance locale.",
        ),
      },
      {
        tagline: T("Consejo del día", "Tip of the day", "Conseil du jour"),
        title: T("Día de mercado", "Market day", "Jour de marché"),
        body: T(
          "El zoco de Rissani está más animado los domingos, martes y jueves. Lleva efectivo en dírhams para comprar y regatear.",
          "The Rissani souk is busiest on Sundays, Tuesdays and Thursdays. Bring cash in dirhams to shop and haggle.",
          "Le souk de Rissani est le plus animé les dimanches, mardis et jeudis. Prévoyez des espèces en dirhams pour acheter et marchander.",
        ),
      },
      {
        tagline: T("Sabor local", "Local flavour", "Saveur locale"),
        title: T("Prueba la medfouna", "Try the medfouna", "Goûtez la medfouna"),
        body: T(
          "La 'pizza bereber' rellena de carne, almendras y especias, cocida bajo brasas. Un manjar típico de Rissani que hay que probar.",
          "The 'Berber pizza' stuffed with meat, almonds and spices, baked under embers. A Rissani specialty you must try.",
          "La « pizza berbère » farcie de viande, d'amandes et d'épices, cuite sous la braise. Une spécialité de Rissani à goûter absolument.",
        ),
      },
    ],
    7: [
      {
        tagline: T("Última parada", "Last stop", "Dernière étape"),
        title: T("Mirador del Valle del Ziz", "Ziz Valley viewpoint", "Belvédère de la vallée du Ziz"),
        body: T(
          "Un oasis de miles de palmeras serpenteando entre montañas áridas. La panorámica desde el mirador es de postal.",
          "An oasis of thousands of palm trees winding between arid mountains. The panorama from the viewpoint is postcard-perfect.",
          "Une oasis de milliers de palmiers serpentant entre des montagnes arides. Le panorama depuis le belvédère est une carte postale.",
        ),
      },
      {
        tagline: T("Consejo del día", "Tip of the day", "Conseil du jour"),
        title: T("El regreso", "The return", "Le retour"),
        body: T(
          "Calcula bien los tiempos hasta el aeropuerto y ten a mano la documentación y los recuerdos comprados por el camino.",
          "Plan your timing to the airport carefully and keep your documents and souvenirs bought along the way to hand.",
          "Prévoyez bien le temps jusqu'à l'aéroport et gardez à portée vos documents et les souvenirs achetés en chemin.",
        ),
      },
      {
        tagline: T("Para la foto", "For the photo", "Pour la photo"),
        title: T("Palmeral infinito", "Endless palm grove", "Palmeraie infinie"),
        body: T(
          "El contraste entre el verde del palmeral y el ocre del desierto regala algunas de las mejores fotos de todo el viaje.",
          "The contrast between the green palm grove and the ochre desert gives some of the best photos of the whole trip.",
          "Le contraste entre le vert de la palmeraie et l'ocre du désert offre quelques-unes des plus belles photos du voyage.",
        ),
      },
    ],
  },
};

export const getDayTravelNotes = (routeId, dayIndex) =>
  (NOTES[routeId] && NOTES[routeId][dayIndex]) || null;

export const isDayTravelNotesEnabled = (routeId) => Boolean(NOTES[routeId]);
