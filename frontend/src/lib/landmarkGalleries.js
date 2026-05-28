// Per-landmark editorial story cards displayed in a carousel below the
// daily interactive map when the user selects a landmark (either on the map
// or on the side list).
//
// Each key is a landmark `id` (defined in /lib/dayLandmarks.js). Each entry
// contains 3-4 vertical story cards: { src, title, description } — all
// trilingual. Images are restricted to the curated Moroccan Unsplash
// whitelist used across the rest of the app.

const T = (es, en, fr) => ({ es, en, fr });

const IMG = {
  atlas:    "https://images.unsplash.com/photo-1597212618440-806262de4f6b?auto=format&fit=crop&w=1200&q=85",
  dunes:    "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=85",
  desert:   "https://images.unsplash.com/photo-1547234935-80c7145ec969?auto=format&fit=crop&w=1200&q=85",
  hotel:    "https://images.unsplash.com/photo-1559925523-10de9e23cf90?auto=format&fit=crop&w=1200&q=85",
  rose:     "https://images.unsplash.com/photo-1519594445471-0e5f86b3fb09?auto=format&fit=crop&w=1200&q=85",
  tracks:   "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=1200&q=85",
  village:  "https://images.unsplash.com/photo-1542401886-65d6c61db217?auto=format&fit=crop&w=1200&q=85",
  desertB:  "https://images.unsplash.com/photo-1570133435536-7ececf000ef6?auto=format&fit=crop&w=1200&q=85",
};

export const LANDMARK_GALLERIES = {
  /* ---------- Day 1 — Ouarzazate → Boumalne Dades ---------- */
  "skoura-palmeraie": [
    {
      src: IMG.village,
      title: T("Kasbah Amerhidil", "Amerhidil kasbah", "Kasbah Amerhidil"),
      description: T(
        "La kasbah más fotografiada del oasis: 300 años de adobe rojo entre palmeras datileras.",
        "The most photographed kasbah of the oasis: 300 years of red adobe among date palms.",
        "La kasbah la plus photographiée de l'oasis : 300 ans de pisé rouge parmi les dattiers."
      ),
    },
    {
      src: IMG.atlas,
      title: T("Atlas al fondo", "Atlas in the distance", "Atlas en arrière-plan"),
      description: T(
        "Desde el palmeral, las cumbres nevadas del Alto Atlas dibujan un horizonte de postal.",
        "From the palm grove, the snowy peaks of the High Atlas draw a postcard horizon.",
        "Depuis la palmeraie, les sommets enneigés du Haut Atlas dessinent un horizon de carte postale."
      ),
    },
    {
      src: IMG.rose,
      title: T("Acequias seculares", "Centuries-old channels", "Canaux séculaires"),
      description: T(
        "Las séguias reparten el agua con un sistema diseñado en el siglo XVII y vivo hasta hoy.",
        "Old séguias share the water with a 17th-century system still working today.",
        "Les séguias répartissent l'eau avec un système du XVIIe siècle toujours en service."
      ),
    },
  ],
  "valle-rosas": [
    {
      src: IMG.rose,
      title: T("Rosa damascena en flor", "Damask rose in bloom", "Rose de Damas en fleur"),
      description: T(
        "Cada abril, los valles se cubren de rosas para producir el aceite esencial más preciado de Marruecos.",
        "Every April the valleys bloom with roses to produce Morocco's most prized essential oil.",
        "Chaque avril, les vallées fleurissent pour produire la plus précieuse huile essentielle du Maroc."
      ),
    },
    {
      src: IMG.village,
      title: T("Aldeas de adobe", "Adobe villages", "Villages en pisé"),
      description: T(
        "Pueblos bereberes encajados entre las paredes del cañón, con casas de adobe pintadas a mano.",
        "Berber villages nested into the canyon walls, with hand-painted adobe houses.",
        "Villages berbères nichés dans les parois du canyon, aux maisons en pisé peintes à la main."
      ),
    },
    {
      src: IMG.atlas,
      title: T("M'Goun en el horizonte", "M'Goun on the horizon", "M'Goun à l'horizon"),
      description: T(
        "La silueta del macizo del M'Goun (4.071 m) cierra el valle por el norte, segunda cima del país.",
        "The M'Goun massif (4,071 m), Morocco's second highest peak, closes the valley to the north.",
        "Le massif du M'Goun (4 071 m) ferme la vallée au nord — second sommet du Maroc."
      ),
    },
  ],
  "boumalne-mercado": [
    {
      src: IMG.village,
      title: T("Souk del miércoles", "Wednesday souk", "Souk du mercredi"),
      description: T(
        "Cada miércoles los pueblos del valle bajan al mercado: una explosión de colores, voces y olores.",
        "Every Wednesday valley villages descend to the market: an explosion of colour, voices and scents.",
        "Chaque mercredi, les villages de la vallée descendent au marché : couleurs, voix et parfums."
      ),
    },
    {
      src: IMG.tracks,
      title: T("Artesanía bereber", "Berber craft", "Artisanat berbère"),
      description: T(
        "Alfombras tejidas a mano, ollas de cobre y joyería tribal de plata — herencia de los Aït Atta.",
        "Hand-woven rugs, copper pots and tribal silver jewellery — Aït Atta heritage.",
        "Tapis tissés main, marmites en cuivre et bijoux tribaux en argent — héritage Aït Atta."
      ),
    },
    {
      src: IMG.rose,
      title: T("Especias del Drâa", "Drâa spices", "Épices du Drâa"),
      description: T(
        "Cúrcuma, comino, ras el hanout y pimentón de Taliouine en sacos de yute abiertos.",
        "Turmeric, cumin, ras el hanout and Taliouine paprika piled in open jute sacks.",
        "Curcuma, cumin, ras el hanout et paprika de Taliouine dans des sacs en jute ouverts."
      ),
    },
  ],
  "monkey-fingers": [
    {
      src: IMG.atlas,
      title: T("Geología imposible", "Impossible geology", "Géologie impossible"),
      description: T(
        "Erosión cárstica que ha esculpido columnas verticales tan estrechas que parecen dedos.",
        "Karst erosion has sculpted vertical columns so narrow they look like fingers.",
        "Une érosion karstique qui a sculpté des colonnes si fines qu'on dirait des doigts."
      ),
    },
    {
      src: IMG.tracks,
      title: T("Mirador panorámico", "Panoramic viewpoint", "Mirador panoramique"),
      description: T(
        "A 9 km de Boumalne, el mejor punto para entender la escala monumental del cañón del Dadès.",
        "9 km from Boumalne, the best spot to grasp the monumental scale of the Dades canyon.",
        "À 9 km de Boumalne, le meilleur point pour saisir l'échelle monumentale du canyon du Dadès."
      ),
    },
    {
      src: IMG.desertB,
      title: T("Atardecer dorado", "Golden sunset", "Coucher de soleil doré"),
      description: T(
        "A la última luz del día, las rocas se encienden con un naranja casi fosforescente.",
        "At the last light of day, the rocks glow with an almost phosphorescent orange.",
        "Dans la dernière lumière, les rochers s'embrasent d'un orange presque phosphorescent."
      ),
    },
  ],
  "gorges-dades": [
    {
      src: IMG.atlas,
      title: T("La carretera de las curvas", "The serpentine road", "La route en lacets"),
      description: T(
        "20 curvas en menos de 2 km — uno de los tramos más fotografiados de toda África del Norte.",
        "20 hairpins in under 2 km — one of North Africa's most photographed road sections.",
        "20 virages en moins de 2 km — l'un des tronçons les plus photographiés d'Afrique du Nord."
      ),
    },
    {
      src: IMG.tracks,
      title: T("Río Dadès", "Dades river", "Rivière Dadès"),
      description: T(
        "Más de 350 km de cauce que ha excavado paredes calizas de hasta 500 m de altura.",
        "350+ km of riverbed carving limestone walls up to 500 m high.",
        "Plus de 350 km de cours d'eau creusant des parois calcaires de 500 m de haut."
      ),
    },
    {
      src: IMG.village,
      title: T("Aldeas troglodíticas", "Troglodyte villages", "Villages troglodytes"),
      description: T(
        "Casas excavadas en la roca aprovechando cuevas naturales: una arquitectura del clima extremo.",
        "Houses carved into the rock using natural caves: architecture born of extreme climate.",
        "Maisons creusées dans la roche, dans des grottes naturelles : architecture du climat extrême."
      ),
    },
    {
      src: IMG.desertB,
      title: T("Cinematografía natural", "Natural cinema", "Cinéma naturel"),
      description: T(
        "Escenario habitual de rodajes — desde Gladiator hasta documentales de National Geographic.",
        "A regular film location — from Gladiator to National Geographic documentaries.",
        "Plateau de tournage régulier — de Gladiator aux documentaires National Geographic."
      ),
    },
  ],
  "xaluca-dades": [
    {
      src: IMG.hotel,
      title: T("Hotel Xaluca Dades 4★", "Hotel Xaluca Dades 4★", "Hôtel Xaluca Dadès 4★"),
      description: T(
        "Arquitectura kasbah contemporánea a 1.612 m de altitud, con habitaciones de adobe y madera de cedro.",
        "Contemporary kasbah architecture at 1,612 m, with adobe and cedar-wood rooms.",
        "Architecture kasbah contemporaine à 1 612 m, chambres en pisé et bois de cèdre."
      ),
    },
    {
      src: IMG.atlas,
      title: T("Vistas al Alto Atlas", "High Atlas views", "Vue sur le Haut Atlas"),
      description: T(
        "Desde la terraza, la cordillera se despliega 270° — y los cielos nocturnos son Bortle 2.",
        "From the terrace the range unfolds 270° — and night skies rate Bortle 2.",
        "Depuis la terrasse, la cordillère se déploie sur 270° — ciel nocturne classé Bortle 2."
      ),
    },
    {
      src: IMG.rose,
      title: T("Wellness en altura", "Wellness at altitude", "Bien-être en altitude"),
      description: T(
        "Hammam tradicional, piscina climatizada y rituales de aceite de argán y rosa damascena.",
        "Traditional hammam, heated pool and rituals with argan and damask-rose oil.",
        "Hammam traditionnel, piscine chauffée et rituels à l'huile d'argan et de rose de Damas."
      ),
    },
  ],

  /* ---------- Day 2 — Boumalne Dades → Erfoud ---------- */
  "boutaghrar": [
    {
      src: IMG.village,
      title: T("Casas trogloditas", "Troglodyte houses", "Maisons troglodytes"),
      description: T(
        "Familias bereberes que aún viven en grutas naturales, manteniendo un modo de vida milenario.",
        "Berber families still living in natural caves, sustaining a millennia-old way of life.",
        "Familles berbères vivant encore dans des grottes naturelles, mode de vie millénaire."
      ),
    },
    {
      src: IMG.atlas,
      title: T("Valle escondido", "Hidden valley", "Vallée cachée"),
      description: T(
        "Un valle apenas señalado en los mapas, a más de 1.800 m, accesible solo en 4x4.",
        "A valley barely marked on maps, above 1,800 m, reachable only by 4x4.",
        "Vallée à peine indiquée sur les cartes, au-dessus de 1 800 m, accessible en 4x4."
      ),
    },
    {
      src: IMG.rose,
      title: T("Rosales centenarios", "Centennial rose bushes", "Rosiers centenaires"),
      description: T(
        "Algunos rosales del valle superan los 100 años — su producción se destila en Kelaat M'Gouna.",
        "Some valley rose bushes are over 100 years old — their petals distilled in Kelaat M'Gouna.",
        "Certains rosiers dépassent les 100 ans — leurs pétales sont distillés à Kelaat M'Gouna."
      ),
    },
  ],
  "tinerhir-palm": [
    {
      src: IMG.rose,
      title: T("Casas rosas", "Pink houses", "Maisons roses"),
      description: T(
        "Toda la ciudad está pintada en tonos rosa salmón, una tradición visual única en Marruecos.",
        "The whole town is painted in salmon-pink tones — a visual tradition unique in Morocco.",
        "Toute la ville est peinte en rose saumon — une tradition visuelle unique au Maroc."
      ),
    },
    {
      src: IMG.village,
      title: T("48.000 palmeras", "48,000 palms", "48 000 palmiers"),
      description: T(
        "El palmeral de Tinerhir cuenta con cerca de 48.000 palmeras datileras en 35 km de oasis.",
        "Tinerhir's palm grove counts around 48,000 date palms over 35 km of oasis.",
        "La palmeraie de Tinerhir compte près de 48 000 palmiers dattiers sur 35 km d'oasis."
      ),
    },
    {
      src: IMG.atlas,
      title: T("Antesala del Todra", "Gateway to Todra", "Antichambre du Todra"),
      description: T(
        "Desde aquí, una carretera de 15 km sube hasta las gargantas verticales más estrechas del país.",
        "From here, a 15 km road climbs up to the country's narrowest vertical gorges.",
        "D'ici, une route de 15 km monte vers les gorges verticales les plus étroites du pays."
      ),
    },
  ],
  "gorges-todra": [
    {
      src: IMG.atlas,
      title: T("Paredes de 160 m", "160 m walls", "Parois de 160 m"),
      description: T(
        "En su punto más estrecho, las paredes superan los 160 m de altura con solo 10 m de separación.",
        "At its narrowest, walls rise above 160 m with only 10 m between them.",
        "Au plus étroit, les parois s'élèvent à 160 m avec seulement 10 m d'écart."
      ),
    },
    {
      src: IMG.tracks,
      title: T("Paraíso de la escalada", "Climbers' paradise", "Paradis des grimpeurs"),
      description: T(
        "Más de 400 vías equipadas — uno de los destinos de escalada deportiva más prestigiosos del mundo.",
        "Over 400 bolted routes — one of the world's most prestigious sport-climbing destinations.",
        "Plus de 400 voies équipées — l'une des destinations d'escalade les plus prestigieuses au monde."
      ),
    },
    {
      src: IMG.desertB,
      title: T("Luz que cambia", "Shifting light", "Lumière changeante"),
      description: T(
        "El sol solo entra a fondo del cañón durante una hora al día — el resto es penumbra dorada.",
        "The sun only reaches the canyon floor for one hour a day — the rest is golden dusk.",
        "Le soleil n'atteint le fond du canyon qu'une heure par jour — le reste est pénombre dorée."
      ),
    },
  ],
  "erfoud-fossils": [
    {
      src: IMG.tracks,
      title: T("Devónico marroquí", "Moroccan Devonian", "Dévonien marocain"),
      description: T(
        "Hace 360 millones de años, el sur de Marruecos era un mar tropical poco profundo.",
        "360 million years ago, southern Morocco was a shallow tropical sea.",
        "Il y a 360 millions d'années, le sud du Maroc était une mer tropicale peu profonde."
      ),
    },
    {
      src: IMG.desert,
      title: T("Trilobites y ammonites", "Trilobites and ammonites", "Trilobites et ammonites"),
      description: T(
        "Las canteras de Erfoud exportan fósiles a museos de medio mundo desde principios del siglo XX.",
        "Erfoud's quarries have exported fossils to museums worldwide since the early 20th century.",
        "Les carrières d'Erfoud exportent des fossiles aux musées du monde depuis le début du XXe siècle."
      ),
    },
    {
      src: IMG.desertB,
      title: T("Mármol fósil", "Fossil marble", "Marbre fossile"),
      description: T(
        "El «mármol negro de Erfoud» —caliza con ortocerátidos— recubre mesas, encimeras y mezquitas.",
        "Erfoud's «black marble» — limestone full of orthoceras — adorns tables, counters and mosques.",
        "Le « marbre noir d'Erfoud » — calcaire à orthocères — orne tables, comptoirs et mosquées."
      ),
    },
  ],
  "kasbah-xaluca": [
    {
      src: IMG.hotel,
      title: T("Kasbah Hotel Xaluca", "Kasbah Hotel Xaluca", "Kasbah Hôtel Xaluca"),
      description: T(
        "Considerada arquitectura única en Marruecos — referencia del Ministerio de Turismo desde 2002.",
        "Listed as architecturally unique in Morocco — a Ministry of Tourism reference since 2002.",
        "Reconnue architecturalement unique au Maroc — référence du Ministère du Tourisme depuis 2002."
      ),
    },
    {
      src: IMG.village,
      title: T("Detalle artesanal", "Artisanal detail", "Détail artisanal"),
      description: T(
        "Cada muro, cada cúpula, cada cornisa ha sido modelada a mano por maestros bereberes locales.",
        "Every wall, dome and cornice has been hand-shaped by local Berber master builders.",
        "Chaque mur, coupole et corniche a été façonné main par les maîtres berbères locaux."
      ),
    },
    {
      src: IMG.dunes,
      title: T("Puerta del Sahara", "Gate of the Sahara", "Porte du Sahara"),
      description: T(
        "A solo 50 km del Erg Chebbi, el hotel marca el último confort antes del bivouac en el desierto.",
        "Only 50 km from the Erg Chebbi, the hotel is the last comfort before the desert bivouac.",
        "À 50 km de l'Erg Chebbi, l'hôtel marque le dernier confort avant le bivouac du désert."
      ),
    },
  ],

  /* ---------- Day 3 — Erfoud → Erg Chebbi (Total Desert) ---------- */
  "dakar-tracks": [
    {
      src: IMG.tracks,
      title: T("Rally Dakar histórico", "Historic Dakar Rally", "Rallye Dakar historique"),
      description: T(
        "Estas pistas formaron parte de las ediciones marroquíes del Rally hasta su traslado a Sudamérica en 2008.",
        "These tracks were part of the Moroccan editions of the Rally until it moved to South America in 2008.",
        "Ces pistes ont accueilli le Rallye jusqu'à son déplacement en Amérique du Sud en 2008."
      ),
    },
    {
      src: IMG.desertB,
      title: T("Hamada lunar", "Lunar hamada", "Hamada lunaire"),
      description: T(
        "La hamada es una meseta pedregosa, sin dunas — el desierto más antiguo y duro del Sahara.",
        "The hamada is a stony plateau without dunes — the Sahara's oldest, harshest desert.",
        "La hamada est un plateau pierreux sans dunes — le désert le plus ancien et le plus dur du Sahara."
      ),
    },
    {
      src: IMG.desert,
      title: T("Horizonte saliente", "Standout horizon", "Horizon prononcé"),
      description: T(
        "Sin vegetación ni referencias, el horizonte parece tocarse con la mano — el ojo se pierde.",
        "Without vegetation or landmarks, the horizon feels touchable — the eye gets lost.",
        "Sans végétation ni repères, l'horizon semble à portée de main — l'œil se perd."
      ),
    },
  ],
  "canteras-fosiles": [
    {
      src: IMG.desert,
      title: T("Mar fósil del Devónico", "Devonian fossil sea", "Mer fossile du Dévonien"),
      description: T(
        "Lo que hoy es desierto fue, hace 360 millones de años, un arrecife coralino tropical.",
        "What today is desert was, 360 million years ago, a tropical coral reef.",
        "Ce qui est aujourd'hui désert fut, il y a 360 millions d'années, un récif corallien tropical."
      ),
    },
    {
      src: IMG.tracks,
      title: T("Talleres de pulido", "Polishing workshops", "Ateliers de polissage"),
      description: T(
        "Familias enteras extraen, cortan y pulen los fósiles — un oficio que pasa de padres a hijos.",
        "Whole families extract, cut and polish the fossils — a craft passed down generations.",
        "Des familles entières extraient, taillent et polissent — un métier transmis de génération en génération."
      ),
    },
    {
      src: IMG.desertB,
      title: T("Trilobite ojo a ojo", "Trilobite eye to eye", "Trilobite face à face"),
      description: T(
        "Algunos trilobites tenían ojos compuestos como los de los insectos — primeros sistemas visuales complejos.",
        "Some trilobites had compound eyes like insects — the first complex visual systems.",
        "Certains trilobites avaient des yeux composés comme les insectes — premiers systèmes visuels complexes."
      ),
    },
  ],
  "oasis-picnic": [
    {
      src: IMG.rose,
      title: T("Almuerzo a la sombra", "Lunch in the shade", "Déjeuner à l'ombre"),
      description: T(
        "Tajín caliente, ensalada bereber, pan recién horneado y té a la menta bajo el palmeral.",
        "Hot tagine, Berber salad, fresh-baked bread and mint tea under the palm grove.",
        "Tajine chaud, salade berbère, pain frais et thé à la menthe sous la palmeraie."
      ),
    },
    {
      src: IMG.village,
      title: T("Huertas tradicionales", "Traditional gardens", "Jardins traditionnels"),
      description: T(
        "Bajo las palmeras, los oasis cultivan en tres alturas: dátiles, granados/higueras y hortalizas.",
        "Beneath the palms, oases farm in three layers: dates, figs/pomegranates and vegetables.",
        "Sous les palmiers, les oasis cultivent à trois étages : dattes, figues/grenades et légumes."
      ),
    },
    {
      src: IMG.atlas,
      title: T("Pausa antes del Erg", "Pause before the Erg", "Pause avant l'Erg"),
      description: T(
        "Última sombra fresca antes de entrar en el corazón ardiente del Erg Chebbi.",
        "The last cool shade before entering the burning heart of the Erg Chebbi.",
        "Dernière ombre fraîche avant le cœur brûlant de l'Erg Chebbi."
      ),
    },
  ],
  "hassi-labied": [
    {
      src: IMG.village,
      title: T("Pueblo a los pies del Erg", "Village at the foot of the Erg", "Village au pied de l'Erg"),
      description: T(
        "Hassi Labied significa «pozo blanco» — sus habitantes son nómadas Aït Khebbach asentados.",
        "Hassi Labied means «white well» — its people are settled Aït Khebbach nomads.",
        "Hassi Labied signifie « puits blanc » — ses habitants sont des nomades Aït Khebbach sédentarisés."
      ),
    },
    {
      src: IMG.dunes,
      title: T("Del 4x4 al dromedario", "From 4x4 to camel", "Du 4x4 au dromadaire"),
      description: T(
        "Aquí cambiamos el motor por el paso del dromedario — la única forma respetuosa de entrar al Erg.",
        "Here we swap engine for camel — the only respectful way to enter the Erg.",
        "Ici, on échange le moteur contre le pas du dromadaire — la seule façon respectueuse d'entrer dans l'Erg."
      ),
    },
    {
      src: IMG.desert,
      title: T("Atardecer dorado", "Golden sunset", "Coucher de soleil doré"),
      description: T(
        "El borde del pueblo es el mejor mirador para ver las dunas teñirse de naranja al anochecer.",
        "The edge of the village is the best vantage to watch the dunes turn orange at dusk.",
        "Le bord du village est le meilleur point pour voir les dunes virer à l'orange au crépuscule."
      ),
    },
  ],
  "erg-chebbi-duna": [
    {
      src: IMG.dunes,
      title: T("150 metros de arena", "150 metres of sand", "150 mètres de sable"),
      description: T(
        "La duna principal del Erg Chebbi alcanza 150 m — equivalente a un edificio de 50 plantas.",
        "The main Erg Chebbi dune reaches 150 m — the height of a 50-storey building.",
        "La grande dune de l'Erg Chebbi atteint 150 m — la hauteur d'un immeuble de 50 étages."
      ),
    },
    {
      src: IMG.desert,
      title: T("Arena que viaja", "Travelling sand", "Sable voyageur"),
      description: T(
        "Análisis de minerales muestran que parte de esta arena proviene del Atlas, a 500 km al norte.",
        "Mineral analyses show part of this sand comes from the Atlas, 500 km to the north.",
        "Les analyses minérales montrent qu'une partie du sable vient de l'Atlas, à 500 km au nord."
      ),
    },
    {
      src: IMG.desertB,
      title: T("Caravana al bivouac", "Caravan to the bivouac", "Caravane vers le bivouac"),
      description: T(
        "El paso pausado del dromedario impone otro tiempo — el del desierto, sin reloj.",
        "The camel's slow pace imposes another time — desert time, without a clock.",
        "Le pas lent du dromadaire impose un autre temps — celui du désert, sans horloge."
      ),
    },
    {
      src: IMG.tracks,
      title: T("Crestas vivas", "Living ridges", "Crêtes vivantes"),
      description: T(
        "El viento sahariano redibuja las crestas cada noche — el mismo paisaje no se ve dos veces.",
        "Saharan winds redraw the ridges every night — the same landscape is never seen twice.",
        "Les vents sahariens redessinent les crêtes chaque nuit — jamais le même paysage deux fois."
      ),
    },
  ],
  "bivouac-luxe": [
    {
      src: IMG.desert,
      title: T("Bivouac de Luxe", "Bivouac de Luxe", "Bivouac de Luxe"),
      description: T(
        "Haimas bereberes con cama king, baño privado y alfombras tejidas a mano — confort entre dunas.",
        "Berber jaimas with king beds, private bath and hand-woven rugs — comfort among the dunes.",
        "Tentes berbères, lit king-size, salle de bain privée et tapis tissés main — confort entre les dunes."
      ),
    },
    {
      src: IMG.hotel,
      title: T("Cena bereber", "Berber dinner", "Dîner berbère"),
      description: T(
        "Tajín de cordero a las brasas, kefta de hierbas frescas y postres de dátiles del oasis.",
        "Lamb tagine cooked on embers, fresh-herb kefta and date-based desserts from the oasis.",
        "Tajine d'agneau braisé, kefta aux herbes fraîches et desserts aux dattes de l'oasis."
      ),
    },
    {
      src: IMG.dunes,
      title: T("Cielo Bortle 1", "Bortle 1 sky", "Ciel Bortle 1"),
      description: T(
        "Sin contaminación lumínica en 100 km — uno de los cielos nocturnos más oscuros del planeta.",
        "No light pollution for 100 km — one of the darkest night skies on Earth.",
        "Aucune pollution lumineuse à 100 km — l'un des ciels nocturnes les plus sombres de la planète."
      ),
    },
  ],

  /* ---------- Day 4 — Sunrise + Khamlia + Rissani + Erfoud ---------- */
  "sunrise-dune": [
    {
      src: IMG.dunes,
      title: T("Amanecer en el Erg", "Sunrise on the Erg", "Lever du soleil sur l'Erg"),
      description: T(
        "El sol asoma por las dunas más bajas creando un degradado natural de rosas, naranjas y violetas.",
        "The sun rises over the lowest dunes creating a natural gradient of pinks, oranges and violets.",
        "Le soleil se lève sur les dunes basses, créant un dégradé naturel de roses, oranges et violets."
      ),
    },
    {
      src: IMG.desert,
      title: T("Sombras largas", "Long shadows", "Longues ombres"),
      description: T(
        "La luz rasante de la primera hora alarga las sombras y dibuja cada cresta como con tinta.",
        "First-hour light stretches shadows and outlines every ridge as if drawn in ink.",
        "La lumière rasante des premières heures allonge les ombres comme dessinées à l'encre."
      ),
    },
    {
      src: IMG.desertB,
      title: T("Silencio absoluto", "Absolute silence", "Silence absolu"),
      description: T(
        "El desierto al amanecer es el lugar más silencioso del viaje — ni viento, ni pájaros, ni motor.",
        "The desert at dawn is the trip's quietest moment — no wind, no birds, no engine.",
        "Le désert à l'aube est le moment le plus silencieux du voyage — ni vent, ni oiseaux, ni moteur."
      ),
    },
  ],
  "merdani": [
    {
      src: IMG.village,
      title: T("Pueblo abandonado", "Abandoned village", "Village abandonné"),
      description: T(
        "Ksar minero abandonado en los años 70 cuando se agotó la veta de plomo y antimonio.",
        "Mining ksar abandoned in the 1970s when its lead and antimony vein ran out.",
        "Ksar minier abandonné dans les années 1970 quand le filon de plomb et d'antimoine s'est épuisé."
      ),
    },
    {
      src: IMG.desert,
      title: T("Adobe que regresa", "Adobe returning", "Pisé qui revient"),
      description: T(
        "Sin tejados, las casas se funden lentamente con la tierra — arquitectura que vuelve al desierto.",
        "Without roofs, the houses slowly melt back into the earth — architecture returning to the desert.",
        "Sans toits, les maisons se fondent peu à peu dans la terre — architecture qui retourne au désert."
      ),
    },
    {
      src: IMG.tracks,
      title: T("Memoria del Sáhara", "Memory of the Sahara", "Mémoire du Sahara"),
      description: T(
        "Merdani es una metáfora viva: lo que el desierto da, el desierto se lo lleva con el tiempo.",
        "Merdani is a living metaphor: what the desert gives, the desert reclaims in time.",
        "Merdani est une métaphore vivante : ce que le désert donne, le désert le reprend avec le temps."
      ),
    },
  ],
  "khamlia-gnawa": [
    {
      src: IMG.village,
      title: T("Pueblo Gnawa", "Gnawa village", "Village Gnawa"),
      description: T(
        "Descendientes de esclavos sudaneses traídos por las caravanas transaharianas siglos atrás.",
        "Descendants of Sudanese slaves brought by trans-Saharan caravans centuries ago.",
        "Descendants d'esclaves soudanais amenés par les caravanes transsahariennes."
      ),
    },
    {
      src: IMG.tracks,
      title: T("Patrimonio UNESCO", "UNESCO heritage", "Patrimoine UNESCO"),
      description: T(
        "La música Gnawa fue inscrita como Patrimonio Cultural Inmaterial de la UNESCO en 2019.",
        "Gnawa music was inscribed as UNESCO Intangible Cultural Heritage in 2019.",
        "La musique Gnawa a été inscrite au Patrimoine Culturel Immatériel UNESCO en 2019."
      ),
    },
    {
      src: IMG.desertB,
      title: T("Krakebs y trance", "Krakebs and trance", "Krakebs et transe"),
      description: T(
        "Los krakebs de hierro y el sintir crean ritmos repetitivos que inducen un estado de trance.",
        "Iron krakebs and the sintir create repetitive rhythms that induce a trance state.",
        "Les krakebs en fer et le sintir créent des rythmes répétitifs induisant un état de transe."
      ),
    },
  ],
  "rissani-mercado": [
    {
      src: IMG.rose,
      title: T("Souk milenario", "Millenary souk", "Souk millénaire"),
      description: T(
        "Rissani fue capital del primer reino alauita (s. XVII), antes de trasladarse a Meknes y Fez.",
        "Rissani was capital of the first Alaouite kingdom (17th c.), before moving to Meknes and Fez.",
        "Rissani fut capitale du premier royaume alaouite (XVIIe s.), avant Meknès et Fès."
      ),
    },
    {
      src: IMG.village,
      title: T("Parking de burros", "Donkey parking", "Parking d'ânes"),
      description: T(
        "Los comerciantes llegan en burro desde aldeas a 30 km — el «parking» llega a 200 animales.",
        "Traders arrive by donkey from villages 30 km away — the «parking» holds up to 200 animals.",
        "Les marchands arrivent à dos d'âne depuis des villages à 30 km — le « parking » accueille 200 bêtes."
      ),
    },
    {
      src: IMG.tracks,
      title: T("Madfouna y khlea", "Madfouna and khlea", "Madfouna et khlea"),
      description: T(
        "La «pizza bereber» (madfouna) y la carne curada al sol (khlea) son las especialidades locales.",
        "«Berber pizza» (madfouna) and sun-cured meat (khlea) are the local specialties.",
        "La « pizza berbère » (madfouna) et la viande séchée au soleil (khlea) sont les spécialités locales."
      ),
    },
  ],
  "mirador-desierto": [
    {
      src: IMG.dunes,
      title: T("Última panorámica", "Final panorama", "Dernier panorama"),
      description: T(
        "Mirador natural a 1.000 m sobre el nivel del mar — el Erg Chebbi entero se ve de una sola vista.",
        "Natural viewpoint at 1,000 m — the entire Erg Chebbi visible at a glance.",
        "Mirador naturel à 1 000 m — l'Erg Chebbi entier visible d'un seul coup d'œil."
      ),
    },
    {
      src: IMG.desertB,
      title: T("Despedida cinematográfica", "Cinematic farewell", "Adieu cinématographique"),
      description: T(
        "El último adiós al desierto — y, casi siempre, el último encuadre del viaje en el sur.",
        "The final goodbye to the desert — and almost always the last framing of the southern leg.",
        "Le dernier adieu au désert — et presque toujours le dernier cadrage du sud."
      ),
    },
    {
      src: IMG.desert,
      title: T("Horizonte sin límites", "Limitless horizon", "Horizon sans limites"),
      description: T(
        "Desde aquí, en días despejados, se distingue la frontera con Argelia a 40 km al sur.",
        "On clear days you can spot the Algerian border 40 km south.",
        "Par temps clair, la frontière algérienne s'aperçoit à 40 km au sud."
      ),
    },
  ],
  "des-dunes": [
    {
      src: IMG.hotel,
      title: T("Pizzería Des Dunes", "Des Dunes pizzeria", "Pizzeria Des Dunes"),
      description: T(
        "Una institución en Erfoud — la pizza más auténticamente bereber del Tafilalet.",
        "An Erfoud institution — the most authentically Berber pizza of the Tafilalet.",
        "Une institution à Erfoud — la pizza la plus authentiquement berbère du Tafilalet."
      ),
    },
    {
      src: IMG.village,
      title: T("Horno tradicional", "Traditional oven", "Four traditionnel"),
      description: T(
        "Horno de leña con base de adobe y bóveda de barro — cocina a más de 350 °C.",
        "Wood-fired oven with adobe base and clay dome — cooking above 350 °C.",
        "Four à bois, base en pisé et voûte en argile — cuisson au-dessus de 350 °C."
      ),
    },
    {
      src: IMG.rose,
      title: T("Mesa con vista", "Table with a view", "Table avec vue"),
      description: T(
        "Terraza con vistas a la kasbah — el último almuerzo antes del regreso a Errachidia.",
        "Terrace overlooking the kasbah — the last lunch before returning to Errachidia.",
        "Terrasse face à la kasbah — le dernier déjeuner avant le retour à Errachidia."
      ),
    },
  ],

  /* ---------- Day 5 — Erfoud → Errachidia (Return) ---------- */
  "valle-ziz": [
    {
      src: IMG.rose,
      title: T("Un millón de palmeras", "A million palms", "Un million de palmiers"),
      description: T(
        "El palmeral del Tafilalet, alimentado por el río Ziz, es uno de los mayores del norte de África.",
        "The Tafilalet palm grove, fed by the Ziz river, is one of North Africa's largest.",
        "La palmeraie du Tafilalet, alimentée par le Ziz, est l'une des plus grandes d'Afrique du Nord."
      ),
    },
    {
      src: IMG.atlas,
      title: T("Verde entre desiertos", "Green between deserts", "Vert entre déserts"),
      description: T(
        "Una franja verde de 30 km que cruza un paisaje absolutamente árido — vista aérea inolvidable.",
        "A 30 km green strip cutting through an utterly arid landscape — unforgettable from above.",
        "Une bande verte de 30 km dans un paysage totalement aride — inoubliable vue du ciel."
      ),
    },
    {
      src: IMG.village,
      title: T("Kasbahs ribereñas", "Riverside kasbahs", "Kasbahs au bord du fleuve"),
      description: T(
        "Decenas de kasbahs y ksars se alinean a lo largo del río — caravanserrallos del comercio del oro.",
        "Dozens of kasbahs and ksars line the river — caravanserais of the gold trade.",
        "Des dizaines de kasbahs et ksars longent le fleuve — caravansérails du commerce de l'or."
      ),
    },
  ],
  "mirador-ziz": [
    {
      src: IMG.atlas,
      title: T("Mirador del Ziz", "Ziz viewpoint", "Mirador du Ziz"),
      description: T(
        "El balcón más célebre del sur — vista de pájaro sobre todo el oasis al amanecer.",
        "The south's most famous balcony — a bird's-eye view over the whole oasis at dawn.",
        "Le balcon le plus célèbre du sud — vue plongeante sur toute l'oasis à l'aube."
      ),
    },
    {
      src: IMG.tracks,
      title: T("Terrazas agrícolas", "Agricultural terraces", "Terrasses agricoles"),
      description: T(
        "Bajo las palmeras, mosaico geométrico de huertas con tomates, alfalfa y cereales.",
        "Beneath the palms, a geometric mosaic of vegetable plots, alfalfa and grain.",
        "Sous les palmiers, mosaïque géométrique de potagers, luzerne et céréales."
      ),
    },
    {
      src: IMG.desertB,
      title: T("Atardecer dorado", "Golden sunset", "Coucher de soleil doré"),
      description: T(
        "Al atardecer, las palmeras proyectan sombras kilométricas sobre la arena rosada.",
        "At sunset, palms cast kilometre-long shadows over the pink sand.",
        "Au coucher du soleil, les palmiers projettent des ombres kilométriques sur le sable rose."
      ),
    },
  ],
  "khettaras": [
    {
      src: IMG.desertB,
      title: T("Acueductos invisibles", "Invisible aqueducts", "Aqueducs invisibles"),
      description: T(
        "Túneles subterráneos de hasta 10 km que transportan agua del Atlas hasta el oasis.",
        "Underground tunnels up to 10 km long carrying Atlas water to the oasis.",
        "Tunnels souterrains jusqu'à 10 km transportant l'eau de l'Atlas vers l'oasis."
      ),
    },
    {
      src: IMG.tracks,
      title: T("Ingeniería medieval", "Medieval engineering", "Ingénierie médiévale"),
      description: T(
        "Sistema importado de Persia en el siglo XI — sigue funcionando 900 años después.",
        "A system imported from Persia in the 11th century — still functioning 900 years on.",
        "Système importé de Perse au XIe siècle — toujours en service 900 ans plus tard."
      ),
    },
    {
      src: IMG.village,
      title: T("Pozos de ventilación", "Ventilation shafts", "Puits d'aération"),
      description: T(
        "Pequeños hoyos verticales a lo largo del recorrido permiten el mantenimiento y la oxigenación.",
        "Small vertical shafts along the route allow maintenance and oxygenation.",
        "De petits puits verticaux le long du tracé permettent l'entretien et l'aération."
      ),
    },
  ],
  "errachidia-airport": [
    {
      src: IMG.tracks,
      title: T("Carretera panorámica", "Scenic road", "Route panoramique"),
      description: T(
        "El tramo final cruza la Hamada del Guir — un paisaje lunar que despide el sur marroquí.",
        "The final stretch crosses the Hamada du Guir — a lunar landscape closing the southern leg.",
        "Le dernier tronçon traverse la Hamada du Guir — paysage lunaire qui clôt le sud marocain."
      ),
    },
    {
      src: IMG.atlas,
      title: T("Aeropuerto Moulay Ali Cherif", "Moulay Ali Cherif airport", "Aéroport Moulay Ali Cherif"),
      description: T(
        "Aeropuerto regional con vuelos directos a Casablanca operados por Royal Air Maroc.",
        "Regional airport with direct flights to Casablanca operated by Royal Air Maroc.",
        "Aéroport régional avec vols directs vers Casablanca opérés par Royal Air Maroc."
      ),
    },
    {
      src: IMG.desertB,
      title: T("Conexión internacional", "International connection", "Liaison internationale"),
      description: T(
        "Desde Casablanca, conexiones diarias con Madrid, París, Bruselas y los principales hubs europeos.",
        "From Casablanca, daily connections to Madrid, Paris, Brussels and major European hubs.",
        "Depuis Casablanca, vols quotidiens vers Madrid, Paris, Bruxelles et les grands hubs européens."
      ),
    },
  ],
};
