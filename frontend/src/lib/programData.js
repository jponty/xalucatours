// Shared "day" building blocks for the Erg Chebbi + Atlas circuits.
// Re-used across the 7d/6d/5d programmes to keep content consistent.

export const DAY_ERFOUD_ARRIVAL = {
  route_id: "da-arrival-erfoud",
  id: "dia-1",
  image: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=2000&q=85",
  accent: "#C16542",
  title: { es: "Llegada a Errachidia – Erfoud", en: "Arrival in Errachidia – Erfoud", fr: "Arrivée à Errachidia – Erfoud" },
  body: {
    es: "Salida desde el aeropuerto de origen con conexión vía Casablanca hacia Errachidia. Llegada nocturna y traslado hacia Erfoud, conocida como «La Puerta del Desierto». Alojamiento y cena en Kasbah Hotel Xaluca, un hotel emblemático del sur de Marruecos.",
    en: "Departure from your home airport with a connection via Casablanca to Errachidia. Night arrival and transfer to Erfoud, known as «The Gate of the Desert». Accommodation and dinner at Kasbah Hotel Xaluca, an emblematic hotel of southern Morocco.",
    fr: "Départ de votre aéroport d'origine avec correspondance via Casablanca jusqu'à Errachidia. Arrivée de nuit et transfert vers Erfoud, « la porte du désert ». Hébergement et dîner au Kasbah Hotel Xaluca, hôtel emblématique du sud du Maroc.",
  },
  culture: [
    {
      title: { es: "Errachidia y su antiguo aeropuerto militar", en: "Errachidia and its former military airport", fr: "Errachidia et son ancien aéroport militaire" },
      body: { es: "El aeropuerto de Errachidia comenzó siendo una base militar francesa en los años 30 antes de convertirse en aeropuerto civil.",
              en: "Errachidia airport was a French military base in the 1930s before turning civil.",
              fr: "L'aéroport d'Errachidia fut une base militaire française dans les années 30 avant de devenir civil." },
    },
    {
      title: { es: "Erfoud, capital mundial de los fósiles", en: "Erfoud, world capital of fossils", fr: "Erfoud, capitale mondiale des fossiles" },
      body: { es: "La región alberga millones de fósiles marinos de más de 380 millones de años.",
              en: "The region holds millions of marine fossils more than 380 million years old.",
              fr: "La région abrite des millions de fossiles marins de plus de 380 millions d'années." },
    },
    {
      title: { es: "La auténtica puerta del Sahara", en: "The true gate of the Sahara", fr: "La véritable porte du Sahara" },
      body: { es: "Desde Erfoud, las dunas del Erg Chebbi se elevan hasta superar los 150 metros de altura.",
              en: "From Erfoud, the Erg Chebbi dunes rise to over 150 metres in height.",
              fr: "Depuis Erfoud, les dunes de l'Erg Chebbi s'élèvent à plus de 150 mètres de hauteur." },
    },
  ],
};

export const DAY_DESERT_BIVOUAC = {
  route_id: "desert-bivouac",
  id: "dia-2",
  image: "https://images.unsplash.com/photo-1542401886-65d6c61db217?auto=format&fit=crop&w=2000&q=85",
  accent: "#D97742",
  title: { es: "Desierto total – Erg Chebbi y bivouac", en: "Full desert – Erg Chebbi & bivouac", fr: "Désert intégral – Erg Chebbi & bivouac" },
  body: {
    es: "Hoy será un día de Desierto Total. Recorreremos una de las pistas que utilizaban en el Rally Dakar, visitando poblados y nómadas del desierto. Pararemos en las Canteras de Fósiles Marinos, con una antigüedad de 360 millones de años, y comeremos un «picnic» en un auténtico Oasis. Continuaremos hasta el Gran Erg Chebbi, el «Desierto de Dunas de finísima arena», donde cambiaremos el vehículo 4x4 por dromedarios para entrar en el corazón de las dunas y contemplar una puesta de sol inolvidable. Llegaremos con los dromedarios al Bivouac de Luxe, donde nos alojaremos en haimas como las que utilizan los nómadas. Alojamiento y cena: es espectacular dormir «bajo las estrellas».",
    en: "A day of Total Desert. We drive one of the historic Dakar Rally tracks, visiting villages and desert nomads. Stop at the Marine Fossil Quarries — 360 million years old — and picnic in an authentic oasis. We continue to the great Erg Chebbi, the «desert of fine-sand dunes», where we swap the 4x4 for camels and ride into the heart of the dunes to witness an unforgettable sunset. We arrive on camelback at the Bivouac de Luxe and sleep in nomad-style jaimas. Dinner and overnight — spectacular under the stars.",
    fr: "Une journée de Désert Total. Nous parcourons l'une des pistes historiques du Rallye Dakar, à la rencontre de villages et de nomades. Halte aux Carrières de Fossiles Marins — 360 millions d'années — et pique-nique dans une oasis authentique. Poursuite vers le grand Erg Chebbi, le « désert de dunes de sable très fin », où nous échangeons le 4x4 contre des dromadaires pour pénétrer au cœur des dunes et admirer un coucher de soleil inoubliable. Arrivée à dos de dromadaire au Bivouac de Luxe, hébergement en jaimas comme les nomades. Dîner sous les étoiles.",
  },
  culture: [
    {
      title: { es: "Las pistas históricas del Rally Dakar", en: "The historic Dakar Rally tracks", fr: "Les pistes historiques du Rallye Dakar" },
      body: { es: "Entre Erfoud y el Erg Chebbi existen varias pistas usadas por el Rally Dakar en las ediciones marroquíes (hasta 2007). Muchas cruzan hamadas y oueds secos, lo que las convierte en rutas icónicas para 4x4 y motos de aventura. A día de hoy siguen siendo utilizadas para entrenamientos y competiciones off-road.",
              en: "Between Erfoud and the Erg Chebbi several tracks were used by the Dakar Rally during the Moroccan editions (until 2007). Many cross hamadas and dry wadis, making them iconic for 4x4 and adventure motorcycling. They are still used today for off-road training and competitions.",
              fr: "Entre Erfoud et l'Erg Chebbi, plusieurs pistes ont été utilisées par le Rallye Dakar lors des éditions marocaines (jusqu'en 2007). Beaucoup traversent des hamadas et des oueds secs, ce qui en fait des routes mythiques pour 4x4 et motos d'aventure." },
    },
    {
      title: { es: "Fósiles de 360 millones de años", en: "360-million-year-old fossils", fr: "Fossiles de 360 millions d'années" },
      body: { es: "Las canteras de fósiles marinos de Erfoud y Merzouga pertenecen al período Devónico (aprox. 360-380 millones de años), cuando esta región estaba cubierta por un mar tropical poco profundo. De allí provienen ammonites, trilobites, goniatites y peces primitivos. Marruecos es uno de los mayores exportadores del mundo de fósiles devónicos auténticos.",
              en: "The Erfoud and Merzouga marine fossil quarries date from the Devonian (approx. 360-380 million years ago), when the region lay under a shallow tropical sea. Ammonites, trilobites, goniatites and primitive fish all come from here — Morocco is one of the world's largest exporters of authentic Devonian fossils.",
              fr: "Les carrières de fossiles marins d'Erfoud et Merzouga datent du Dévonien (env. 360-380 millions d'années), lorsque la région était recouverte d'une mer tropicale peu profonde. Le Maroc est l'un des plus grands exportateurs mondiaux de fossiles dévoniens authentiques." },
    },
    {
      title: { es: "Erg Chebbi: dunas de más de 150 metros", en: "Erg Chebbi: dunes over 150 metres", fr: "Erg Chebbi : dunes de plus de 150 mètres" },
      body: { es: "Uno de los dos grandes ergs del desierto marroquí, sus dunas pueden alcanzar hasta 150 metros de altura, formadas por arena extremadamente fina traída por los vientos saharianos. La duna más alta está cerca de Hassi Labied y es uno de los puntos más fotografiados del desierto.",
              en: "One of the two great ergs of the Moroccan desert, its dunes can reach 150 metres in height, shaped from extremely fine sand carried by Saharan winds. The tallest dune sits near Hassi Labied and is one of the most photographed spots in the desert.",
              fr: "L'un des deux grands ergs du désert marocain, ses dunes peuvent atteindre 150 mètres de hauteur, formées de sable extrêmement fin apporté par les vents sahariens. La plus haute se trouve près de Hassi Labied." },
    },
  ],
};

export const DAY_KHAMLIA_MERDANI = {
  route_id: "khamlia-merdani",
  id: "dia-3",
  image: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=2000&q=85",
  accent: "#D4A373",
  title: { es: "Amanecer en el desierto – Khamlia – Merdani", en: "Sunrise in the desert – Khamlia – Merdani", fr: "Lever du soleil au désert – Khamlia – Merdani" },
  body: {
    es: "Amanecer en las dunas del Erg Chebbi. Visita al pueblo abandonado de Merdani y a las Minas de M'Fis. Parada en Khamlia para disfrutar de música Gnawa y té tradicional. Llegada a Kasbah Hotel Tombouctou y tarde libre entre dunas y hammam.",
    en: "Sunrise over the Erg Chebbi dunes. Visit to the abandoned village of Merdani and the M'Fis mines. Stop in Khamlia for Gnawa music and traditional tea. Arrival at Kasbah Hotel Tombouctou with a free afternoon between dunes and hammam.",
    fr: "Lever de soleil sur les dunes de l'Erg Chebbi. Visite du village abandonné de Merdani et des mines de M'Fis. Halte à Khamlia pour la musique Gnawa et le thé traditionnel. Arrivée au Kasbah Hotel Tombouctou avec après-midi libre entre dunes et hammam.",
  },
  culture: [
    {
      title: { es: "La leyenda de Erg Chebbi", en: "The legend of Erg Chebbi", fr: "La légende de l'Erg Chebbi" },
      body: { es: "Según la tradición bereber, las dunas surgieron como castigo divino tras negar agua a una madre y sus hijos.",
              en: "Berber tradition says the dunes rose as a divine punishment after water was denied to a mother and her children.",
              fr: "La tradition berbère raconte que les dunes sont nées d'un châtiment divin après qu'on eut refusé de l'eau à une mère et ses enfants." },
    },
    {
      title: { es: "Khamlia y la música Gnawa", en: "Khamlia and Gnawa music", fr: "Khamlia et la musique Gnawa" },
      body: { es: "Tradición musical declarada Patrimonio Cultural Inmaterial por la UNESCO.",
              en: "A musical tradition listed as UNESCO Intangible Cultural Heritage.",
              fr: "Tradition musicale inscrite au Patrimoine Culturel Immatériel de l'UNESCO." },
    },
    {
      title: { es: "El «parking de burros» de Rissani", en: "Rissani's «donkey parking»", fr: "Le « parking des ânes » de Rissani" },
      body: { es: "Uno de los mercados más auténticos del sur de Marruecos, vivo desde el siglo XIV.",
              en: "One of southern Morocco's most authentic markets, alive since the 14th century.",
              fr: "L'un des marchés les plus authentiques du sud du Maroc, vivant depuis le XIVe siècle." },
    },
  ],
};

// Day 3 of the 5n/6d & 4n/5d programmes merges Khamlia + Rissani + market visit.
export const DAY_KHAMLIA_RISSANI = {
  route_id: "khamlia-rissani",
  id: "dia-3",
  image: "https://images.unsplash.com/photo-1604940500627-d3f44d1d21c6?auto=format&fit=crop&w=2000&q=85",
  accent: "#A07042",
  title: { es: "Amanecer en el desierto – Khamlia – Rissani", en: "Sunrise – Khamlia – Rissani", fr: "Lever du soleil – Khamlia – Rissani" },
  body: {
    es: "«Cita con el Amanecer»: recomendable madrugar para caminar hasta lo más alto de las dunas y ver la salida del sol. Desayuno beduino y salida con el coche que nos llevará a rodear el Erg hasta el pueblo abandonado de Merdani. Continuaremos hacia el poblado de origen sudanés Khamlia, donde sus habitantes nos obsequiarán con sus danzas tradicionales y un té a la menta. Más tarde iremos a Rissani para visitar su mercado (martes, jueves y domingos), único en estas latitudes, lugar donde se abastecen las tribus y nómadas del desierto — curioso ver su «parking» de burros. Finalmente, subiremos a un mirador natural para despedirnos del desierto. Comida en Des Dunes, la más auténtica pizzería bereber de Erfoud. Regreso a la Kasbah Xaluca para tomarnos el resto del día libre: piscina climatizada, jacuzzi, tenis, minigolf, opcionalmente hamman, masaje o salida en Quads por las dunas. Alojamiento y cena en Kasbah Xaluca.",
    en: "«A date with the Sunrise»: we recommend an early walk to the top of the dunes for sunrise. Bedouin breakfast and drive around the Erg to the abandoned village of Merdani. We continue to Khamlia, a village of Sudanese origin, where its inhabitants offer traditional dances and mint tea. Later we head to Rissani's market (Tues, Thurs and Sun), unique in these latitudes, where desert tribes and nomads come to stock up — curious to see the famous «donkey parking». We climb to a natural viewpoint for a final desert farewell. Lunch at Des Dunes, Erfoud's most authentic Berber pizzeria. Return to Kasbah Xaluca with the rest of the day free: heated pool, jacuzzi, tennis, minigolf, optional hammam, massage or quad ride. Dinner and overnight at Kasbah Xaluca.",
    fr: "« Rendez-vous avec l'aube » : il est recommandé de se lever tôt pour monter au sommet des dunes voir le lever de soleil. Petit déjeuner bédouin et route en contournant l'Erg jusqu'au village abandonné de Merdani. Poursuite vers Khamlia, village d'origine soudanaise, où ses habitants offrent danses traditionnelles et thé à la menthe. Plus tard, marché de Rissani (mardi, jeudi et dimanche), unique sous ces latitudes, où s'approvisionnent tribus et nomades — curieux « parking d'ânes ». Montée à un mirador naturel pour faire ses adieux au désert. Déjeuner chez Des Dunes, la pizzeria berbère la plus authentique d'Erfoud. Retour à la Kasbah Xaluca, après-midi libre : piscine chauffée, jacuzzi, tennis, mini-golf, hammam, massage ou quad en option. Dîner et nuit à la Kasbah Xaluca.",
  },
  wellness: [
    { es: "Piscina climatizada", en: "Heated pool", fr: "Piscine chauffée" },
    { es: "Hammam & Jacuzzi", en: "Hammam & Jacuzzi", fr: "Hammam & Jacuzzi" },
    { es: "Masajes", en: "Massages", fr: "Massages" },
    { es: "Quads opcionales", en: "Optional quads", fr: "Quads en option" },
    { es: "Tenis y minigolf", en: "Tennis & minigolf", fr: "Tennis & minigolf" },
  ],
  culture: [
    {
      title: { es: "Khamlia: música ancestral Gnawa en pleno desierto", en: "Khamlia: ancestral Gnawa music in the desert", fr: "Khamlia : musique ancestrale Gnawa au désert" },
      body: { es: "El pueblo fue fundado por comunidades de origen sudanés llegadas hace generaciones, y es reconocido internacionalmente por su música Gnawa, Patrimonio Cultural Inmaterial UNESCO. Grupos locales como Pigeons du Sable mantienen viva esta tradición de ritmos hipnóticos, krakebs metálicos y tambores.",
              en: "Founded by Sudanese communities generations ago, the village is internationally known for its Gnawa music, listed as UNESCO Intangible Cultural Heritage. Local groups like Pigeons du Sable keep alive this tradition of hypnotic rhythms, metallic krakebs and drums.",
              fr: "Fondé par des communautés d'origine soudanaise il y a des générations, le village est mondialement connu pour sa musique Gnawa, inscrite au Patrimoine Culturel Immatériel UNESCO." },
    },
    {
      title: { es: "Rissani: mercado único y uno de los más antiguos del sur", en: "Rissani: a unique and ancient southern market", fr: "Rissani : marché unique et ancien du sud" },
      body: { es: "El zoco de Rissani, activo especialmente los martes, jueves y domingos, es uno de los mercados más importantes del valle del Ziz. Allí acuden nómadas Aït Atta y habitantes de aldeas remotas para intercambiar productos. Una peculiaridad muy fotografiada es su «parking de burros», espacio real donde los comerciantes aparcan sus animales durante la jornada.",
              en: "The Rissani souk, busiest on Tuesdays, Thursdays and Sundays, is one of the most important markets of the Ziz valley. Aït Atta nomads and remote-village dwellers gather to trade. Its famous «donkey parking» — where merchants tie up their animals during market day — is one of the most photographed quirks.",
              fr: "Le souk de Rissani, actif surtout les mardis, jeudis et dimanches, est l'un des plus importants de la vallée du Ziz. Nomades Aït Atta et habitants des aldéas reculés s'y retrouvent. Son célèbre « parking d'ânes » est l'une des particularités les plus photographiées." },
    },
    {
      title: { es: "El Erg Chebbi: amaneceres sobre dunas de más de 100 metros", en: "Erg Chebbi: sunrises over 100-metre dunes", fr: "Erg Chebbi : lever du soleil sur des dunes de plus de 100 m" },
      body: { es: "El amanecer en el Erg Chebbi es uno de los fenómenos naturales más reconocidos de Marruecos: sus dunas superan los 100-150 metros, y la luz del alba proyecta sombras muy marcadas creando franjas de naranja, dorado y rosa que cambian cada minuto. Por eso es habitual madrugar para subir a la duna más cercana.",
              en: "Sunrise over the Erg Chebbi is one of Morocco's most recognised natural phenomena: dunes top 100-150 metres, and dawn light casts deep shadows across the fine sand creating stripes of orange, gold and pink that shift by the minute.",
              fr: "Le lever du soleil sur l'Erg Chebbi est l'un des phénomènes naturels les plus reconnus du Maroc : dunes de plus de 100-150 mètres, lumière de l'aube projetant des ombres marquées sur le sable fin." },
    },
  ],
};

export const DAY_RISSANI_RELAX = {
  route_id: "rissani-relax",
  id: "dia-4-rissani",
  image: "https://images.unsplash.com/photo-1604940500627-d3f44d1d21c6?auto=format&fit=crop&w=2000&q=85",
  accent: "#A07042",
  title: { es: "Rissani – Mercados ancestrales – Relax en Erfoud", en: "Rissani – Ancestral markets – Relax in Erfoud", fr: "Rissani – Marchés ancestraux – Relax à Erfoud" },
  body: {
    es: "Salida hacia Rissani para visitar kasbahs históricas y su famoso mercado tradicional. Comida en la pizzería bereber Des Dunes. Regreso a Kasbah Hotel Xaluca para disfrutar de tiempo libre y servicios wellness.",
    en: "Drive to Rissani to visit historic kasbahs and its famous traditional market. Lunch at the Berber Des Dunes pizzeria. Return to Kasbah Hotel Xaluca for free time and wellness services.",
    fr: "Route vers Rissani pour visiter les kasbahs historiques et son célèbre marché. Déjeuner à la pizzeria berbère Des Dunes. Retour au Kasbah Hotel Xaluca pour temps libre et services bien-être.",
  },
  wellness: [
    { es: "Piscina climatizada", en: "Heated pool", fr: "Piscine chauffée" },
    { es: "Hammam", en: "Hammam", fr: "Hammam" },
    { es: "Masajes", en: "Massages", fr: "Massages" },
    { es: "Quads opcionales", en: "Optional quads", fr: "Quads en option" },
    { es: "Excursiones privadas", en: "Private excursions", fr: "Excursions privées" },
  ],
  culture: [
    {
      title: { es: "El mercado de Rissani", en: "Rissani market", fr: "Le marché de Rissani" },
      body: { es: "Uno de los zocos más antiguos y auténticos del sur de Marruecos.",
              en: "One of the oldest and most authentic souks in southern Morocco.",
              fr: "L'un des souks les plus anciens et authentiques du sud du Maroc." },
    },
    {
      title: { es: "El «parking» de burros", en: "The donkey «parking»", fr: "Le « parking » des ânes" },
      body: { es: "Zona todavía utilizada por comerciantes y nómadas locales.",
              en: "An area still used by local merchants and nomads.",
              fr: "Un espace encore utilisé par les marchands et nomades locaux." },
    },
  ],
};

export const DAY_TODRA_DADES = {
  route_id: "da-todra-dades",
  id: "dia-todra-dades",
  image: "https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=2000&q=85",
  accent: "#5A6B4F",
  title: { es: "Tinerhir – Gargantas del Todra – Valle del Dades", en: "Tinerhir – Todra Gorges – Dades Valley", fr: "Tinerhir – Gorges du Todra – Vallée du Dadès" },
  body: {
    es: "Salida hacia Tinerhir y las famosas Gargantas del Todra. Continuación hacia Boumalne Dades y alojamiento en Hotel Xaluca Dades. Visita al Valle del Dades y parada en las formaciones geológicas conocidas como «Patas de Mono».",
    en: "Drive to Tinerhir and the famous Todra Gorges. Continue to Boumalne Dades with accommodation at Hotel Xaluca Dades. Visit to the Dades Valley and stop at the «Monkey Paws» geological formations.",
    fr: "Route vers Tinerhir et les célèbres Gorges du Todra. Poursuite vers Boumalne Dadès avec hébergement à l'Hôtel Xaluca Dadès. Visite de la Vallée du Dadès et arrêt aux formations géologiques des « Pattes de Singe ».",
  },
  culture: [
    {
      title: { es: "Las «Patas de Mono»", en: "The «Monkey Paws»", fr: "Les « Pattes de Singe »" },
      body: { es: "Pliegues de roca caliza plegada hace 70 millones de años, ejemplo perfecto de pliegue en chevrón.",
              en: "Limestone folds shaped 70 million years ago, a perfect example of chevron folding.",
              fr: "Plis de calcaire vieux de 70 millions d'années, exemple parfait de pli en chevron." },
    },
    {
      title: { es: "Las Gargantas del Todra", en: "The Todra Gorges", fr: "Les Gorges du Todra" },
      body: { es: "Cañones naturales con paredes de hasta 300 metros y meca mundial de la escalada.",
              en: "Natural canyons with walls up to 300 metres high — a world-class climbing destination.",
              fr: "Canyons naturels aux parois de jusqu'à 300 mètres et destination mondiale de l'escalade." },
    },
    {
      title: { es: "El Valle de los Pájaros", en: "The Valley of the Birds", fr: "La Vallée des Oiseaux" },
      body: { es: "Refugio del Alto Atlas donde sobrevuelan águilas reales, buitres y halcones de Berbería.",
              en: "A High Atlas refuge where golden eagles, vultures and Barbary falcons soar.",
              fr: "Refuge du Haut Atlas où planent aigles royaux, vautours et faucons de Barbarie." },
    },
  ],
};

export const DAY_ATLAS_MGOUN = {
  route_id: "atlas-mgoun",
  id: "dia-atlas-mgoun",
  image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=2000&q=85",
  accent: "#7C8B5C",
  title: { es: "Alto Atlas Central – Boutaghrar – M'Goun", en: "Central High Atlas – Boutaghrar – M'Goun", fr: "Haut Atlas central – Boutaghrar – M'Goun" },
  body: {
    es: "Ruta por pistas del Alto Atlas Central descubriendo poblados como Boutaghrar y Amskar. Visita a grutas habitadas por familias nómadas. Paseo por las Gargantas del M'Goun y comida en una Gîte d'Étape tradicional. Alojamiento y cena en Hotel Xaluca Dades.",
    en: "Off-road journey through the Central High Atlas, discovering villages like Boutaghrar and Amskar. Visit caves still inhabited by nomad families. Walk through the M'Goun Gorges and lunch at a traditional Gîte d'Étape. Dinner and accommodation at Hotel Xaluca Dades.",
    fr: "Parcours tout-terrain dans le Haut Atlas central à la découverte de villages comme Boutaghrar et Amskar. Visite de grottes encore habitées par des familles nomades. Promenade dans les Gorges du M'Goun et déjeuner dans une Gîte d'Étape traditionnelle. Dîner et hébergement à l'Hôtel Xaluca Dadès.",
  },
  culture: [
    {
      title: { es: "El «pequeño Tibet marroquí»", en: "The «little Moroccan Tibet»", fr: "Le « petit Tibet marocain »" },
      body: { es: "Boutaghrar, a más de 2.400 m, conserva una forma de vida bereber prácticamente intacta.",
              en: "Boutaghrar, above 2,400 m, preserves a near-intact Berber way of life.",
              fr: "Boutaghrar, à plus de 2 400 m, conserve un mode de vie berbère quasi intact." },
    },
    {
      title: { es: "Familias trogloditas del Atlas", en: "Atlas troglodyte families", fr: "Familles troglodytes de l'Atlas" },
      body: { es: "Familias nómadas Ait Atta todavía utilizan grutas naturales como refugio en verano.",
              en: "Ait Atta nomad families still use natural caves as summer shelters.",
              fr: "Des familles nomades Ait Atta utilisent encore des grottes naturelles comme refuge l'été." },
    },
    {
      title: { es: "Las Gargantas del M'Goun", en: "The M'Goun Gorges", fr: "Les Gorges du M'Goun" },
      body: { es: "Con casi 30 km, el cañón más largo de Marruecos, conocido como «el río que se camina».",
              en: "Nearly 30 km long, Morocco's longest canyon — known as «the river you walk».",
              fr: "Près de 30 km de long, le plus grand canyon du Maroc — surnommé « la rivière qu'on parcourt à pied »." },
    },
  ],
};

export const DAY_OUARZAZATE_RETURN = {
  route_id: "da-return-ouarzazate",
  id: "dia-final",
  image: "https://images.unsplash.com/photo-1570133435536-7ececf000ef6?auto=format&fit=crop&w=2000&q=85",
  accent: "#3A4A5F",
  title: { es: "Ouarzazate – Regreso", en: "Ouarzazate – Return", fr: "Ouarzazate – Retour" },
  body: {
    es: "Salida hacia Ouarzazate para tomar el vuelo de regreso vía Casablanca.",
    en: "Drive to Ouarzazate to catch the return flight via Casablanca.",
    fr: "Route vers Ouarzazate pour le vol de retour via Casablanca.",
  },
  culture: [
    {
      title: { es: "Ouarzazate, la Hollywood de África", en: "Ouarzazate, the Hollywood of Africa", fr: "Ouarzazate, le Hollywood de l'Afrique" },
      body: { es: "Más de 200 películas y series internacionales se han rodado aquí — Gladiator, Juego de Tronos, Babel…",
              en: "Over 200 international films and series shot here — Gladiator, Game of Thrones, Babel…",
              fr: "Plus de 200 films et séries internationales tournés ici — Gladiator, Game of Thrones, Babel…" },
    },
    {
      title: { es: "Atlas Studios", en: "Atlas Studios", fr: "Atlas Studios" },
      body: { es: "Los estudios de cine más grandes de África, en activo desde 1983.",
              en: "The largest film studios in Africa, active since 1983.",
              fr: "Les plus grands studios de cinéma d'Afrique, en activité depuis 1983." },
    },
    {
      title: { es: "La central solar Noor", en: "The Noor solar plant", fr: "La centrale solaire Noor" },
      body: { es: "Más de 6.000 hectáreas de espejos: una de las mayores centrales termosolares del planeta.",
              en: "Over 6,000 hectares of mirrors: one of the largest thermo-solar plants on the planet.",
              fr: "Plus de 6 000 hectares de miroirs : l'une des plus grandes centrales thermo-solaires du monde." },
    },
  ],
};

// Shared price seasons & details apply to all 3 programmes.
export const SHARED_SEASONS = [
  { id: "low",     label: { es: "Temporada baja",  en: "Low season",  fr: "Basse saison" },
    months: { es: "Jun · Jul · Ago", en: "Jun · Jul · Aug", fr: "Juin · Juil · Août" }, level: 1 },
  { id: "mid",     label: { es: "Temporada media", en: "Mid season",  fr: "Moyenne saison" },
    months: { es: "Feb · May · Sep", en: "Feb · May · Sep", fr: "Fév · Mai · Sep" }, level: 2 },
  { id: "high",    label: { es: "Temporada alta",  en: "High season", fr: "Haute saison" },
    months: { es: "Mar · Abr · Oct · Nov", en: "Mar · Apr · Oct · Nov", fr: "Mars · Avr · Oct · Nov" }, level: 3 },
  { id: "premium", label: { es: "Fechas premium", en: "Premium dates", fr: "Dates premium" },
    months: { es: "Sem. Santa · Navidad · Nochevieja", en: "Easter · Christmas · NYE", fr: "Pâques · Noël · NYE" }, level: 4 },
];

export const SHARED_DETAILS = {
  includes: {
    es: ["Vuelos internacionales con conexión vía Casablanca", "Vehículo 4x4 con chófer-guía privado durante todo el circuito",
         "Hoteles Xaluca y bivouac tradicional", "Pensión completa según itinerario",
         "Paseo en dromedario en Erg Chebbi", "Visitas culturales con guía local", "Asistencia 24/7 desde Xaluca Tours"],
    en: ["International flights with connection via Casablanca", "Private 4x4 with driver-guide throughout the circuit",
         "Xaluca hotels and traditional bivouac", "Full board according to itinerary",
         "Camel ride in Erg Chebbi", "Cultural visits with local guide", "24/7 assistance from Xaluca Tours"],
    fr: ["Vols internationaux avec correspondance via Casablanca", "4x4 privé avec chauffeur-guide pendant tout le circuit",
         "Hôtels Xaluca et bivouac traditionnel", "Pension complète selon l'itinéraire",
         "Balade à dromadaire à l'Erg Chebbi", "Visites culturelles avec guide local", "Assistance 24/7 par Xaluca Tours"],
  },
  excludes: {
    es: ["Tasas aéreas y carburante (sujetas a variación)", "Bebidas no incluidas en menús",
         "Visados o trámites consulares si fueran necesarios", "Propinas y gastos personales",
         "Seguros opcionales de cancelación o asistencia premium"],
    en: ["Airport taxes and fuel surcharges (subject to change)", "Drinks not included in menus",
         "Visas or consular paperwork if required", "Tips and personal expenses",
         "Optional cancellation or premium assistance insurances"],
    fr: ["Taxes aéroportuaires et carburant (sujets à variation)", "Boissons non incluses dans les menus",
         "Visas ou démarches consulaires si nécessaires", "Pourboires et dépenses personnelles",
         "Assurances optionnelles annulation ou assistance premium"],
  },
  notes: {
    es: ["El programa puede adaptarse a tu disponibilidad y nivel de exigencia",
         "Las distancias en 4x4 pueden modificarse según condiciones meteorológicas",
         "Edad mínima recomendada para el paseo en dromedario: 6 años",
         "El bivouac dispone de baños privados y cama elevada",
         "El mercado de Rissani se celebra martes, jueves y domingos"],
    en: ["The programme can be adapted to your availability and pace",
         "4x4 distances may change depending on weather conditions",
         "Recommended minimum age for camel ride: 6 years",
         "The bivouac offers private bathrooms and elevated beds",
         "Rissani market runs Tuesday, Thursday and Sunday"],
    fr: ["Le programme peut s'adapter à votre disponibilité et à votre rythme",
         "Les distances en 4x4 peuvent varier selon la météo",
         "Âge minimum recommandé pour la balade à dromadaire : 6 ans",
         "Le bivouac propose des salles de bain privées et des lits surélevés",
         "Le marché de Rissani a lieu mardi, jeudi et dimanche"],
  },
  terms: {
    es: ["Reserva: 30% en el momento de la confirmación", "Pago final: 30 días antes de la salida",
         "Cancelación > 60 días: 10% del importe total", "Cancelación 30-60 días: 30% del importe total",
         "Cancelación < 30 días: 100% del importe total"],
    en: ["Booking: 30% at confirmation", "Final payment: 30 days before departure",
         "Cancellation > 60 days: 10% of the total", "Cancellation 30-60 days: 30% of the total",
         "Cancellation < 30 days: 100% of the total"],
    fr: ["Réservation : 30 % à la confirmation", "Paiement final : 30 jours avant le départ",
         "Annulation > 60 jours : 10 % du total", "Annulation 30-60 jours : 30 % du total",
         "Annulation < 30 jours : 100 % du total"],
  },
};

/* ============================================================
   Three programme variants
============================================================ */
export const PROGRAM_67 = {
  routeId: "tourDesiertoAtlas67",
  duration_key: "6n7d",
  duration: { es: "6 noches / 7 días", en: "6 nights / 7 days", fr: "6 nuits / 7 jours" },
  prices: { low: 1690, mid: 1990, high: 2290, premium: 2690 },
  days: [
    DAY_ERFOUD_ARRIVAL,
    DAY_DESERT_BIVOUAC,
    DAY_KHAMLIA_MERDANI,
    DAY_RISSANI_RELAX,
    DAY_TODRA_DADES,
    DAY_ATLAS_MGOUN,
    DAY_OUARZAZATE_RETURN,
  ],
};

export const PROGRAM_56 = {
  routeId: "tourDesiertoAtlas56",
  duration_key: "5n6d",
  duration: { es: "5 noches / 6 días", en: "5 nights / 6 days", fr: "5 nuits / 6 jours" },
  prices: { low: 1490, mid: 1750, high: 1990, premium: 2390 },
  days: [
    DAY_ERFOUD_ARRIVAL,
    DAY_DESERT_BIVOUAC,
    DAY_KHAMLIA_RISSANI,
    DAY_TODRA_DADES,
    DAY_ATLAS_MGOUN,
    DAY_OUARZAZATE_RETURN,
  ],
};

export const PROGRAM_45 = {
  routeId: "tourDesiertoAtlas45",
  duration_key: "4n5d",
  duration: { es: "4 noches / 5 días", en: "4 nights / 5 days", fr: "4 nuits / 5 jours" },
  prices: { low: 1290, mid: 1490, high: 1690, premium: 1990 },
  days: [
    DAY_ERFOUD_ARRIVAL,
    DAY_DESERT_BIVOUAC,
    DAY_KHAMLIA_RISSANI,
    DAY_TODRA_DADES,
    DAY_OUARZAZATE_RETURN,
  ],
};

/* ============================================================
   ATLAS → DESIERTO direction (Ouarzazate → Errachidia)
============================================================ */

const DAY_AD_OUARZAZATE_DADES = {
  route_id: "ad-ouarzazate-dades",
  id: "dia-1",
  image: "https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=2000&q=85",
  accent: "#5A6B4F",
  title: { es: "Llegada a Ouarzazate – Boumalne Dades", en: "Arrival in Ouarzazate – Boumalne Dades", fr: "Arrivée à Ouarzazate – Boumalne Dadès" },
  body: {
    es: "Salida del aeropuerto de origen en dirección Casablanca y conexión con el vuelo Casablanca – Ouarzazate de las 23:20 h, con llegada a Ouarzazate a las 01:10 h. Recogida en el aeropuerto y traslado por asfalto (110 km) hasta Boumalne Dades, población ubicada a 1.612 m de altitud en la Cordillera del Alto Atlas. Alojamiento en el Hotel Xaluca Dades 4★. 📌 Consultar vuelos y ciudades de salida disponibles.",
    en: "Departure from your home airport toward Casablanca and onward connection with the 23:20 Casablanca – Ouarzazate flight, arriving Ouarzazate at 01:10. Airport pick-up and asphalt transfer (110 km) to Boumalne Dades, at 1,612 m in the High Atlas range. Accommodation at Hotel Xaluca Dades 4★. 📌 Flight options vary by departure city.",
    fr: "Départ depuis votre aéroport d'origine vers Casablanca et correspondance avec le vol Casablanca – Ouarzazate de 23h20, arrivée à Ouarzazate à 01h10. Accueil à l'aéroport et transfert sur asphalte (110 km) jusqu'à Boumalne Dadès, à 1 612 m d'altitude dans le Haut Atlas. Hébergement à l'Hôtel Xaluca Dadès 4★. 📌 Options de vol selon ville de départ.",
  },
  culture: [
    {
      title: { es: "Altitud y paisaje únicos", en: "Unique altitude and landscape", fr: "Altitude et paysage uniques" },
      body: { es: "Boumalne Dades se encuentra a 1.612 m de altitud, en plena zona alta del Alto Atlas: vistas panorámicas sobre valles, montañas nevadas en invierno y pueblos bereberes dispersos.",
              en: "Boumalne Dades sits at 1,612 m in the upper High Atlas: panoramic views over valleys, snowy peaks in winter and scattered Berber villages.",
              fr: "Boumalne Dadès se trouve à 1 612 m dans le Haut Atlas supérieur : vues panoramiques sur vallées, sommets enneigés en hiver et villages berbères dispersés." },
    },
    {
      title: { es: "El valle del río Dadès", en: "The Dades river valley", fr: "La vallée du Dadès" },
      body: { es: "Famoso por sus Gorges du Dadès. La carretera serpenteante que asciende por la garganta es una de las vistas más fotografiadas de Marruecos. A 9-10 km del pueblo se encuentran las «Patas de Mono» (Monkey Fingers), formación rocosa de aspecto extraterrestre.",
              en: "Famous for the Gorges du Dadès. The winding road that climbs the gorge is one of the most photographed views in Morocco. 9-10 km from town, the «Monkey Fingers» rock formation adds an otherworldly feel.",
              fr: "Célèbre pour les Gorges du Dadès. La route sinueuse qui monte est l'une des vues les plus photographiées du Maroc. À 9-10 km du village, les « Doigts de Singe » ajoutent un aspect extraterrestre." },
    },
    {
      title: { es: "Tradición de la rosa y mercado local", en: "Rose tradition and local market", fr: "Tradition de la rose et marché local" },
      body: { es: "El valle alberga los campos de rosa (Rose Valley, cerca de Boumalne) usados durante siglos para producir agua de rosas y aceites esenciales. Cada miércoles se celebra el mercado semanal, donde los pueblos cercanos bajan a vender productos agrícolas y artesanía bereber.",
              en: "The valley hosts the Rose Valley fields used for centuries to produce rose water and essential oils. Every Wednesday a weekly market gathers nearby villages selling produce and Berber craft.",
              fr: "La vallée abrite la Vallée des Roses utilisée depuis des siècles pour produire eau de rose et huiles essentielles. Chaque mercredi se tient le marché hebdomadaire des villages voisins." },
    },
  ],
};

const DAY_AD_TODRA_ERFOUD = {
  route_id: "ad-todra-erfoud",
  id: "dia-todra-erfoud",
  image: "https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=2000&q=85",
  accent: "#7C8B5C",
  title: { es: "Alto Atlas Central – Gargantas del Todra – Erfoud", en: "Central High Atlas – Todra Gorges – Erfoud", fr: "Haut Atlas Central – Gorges du Todra – Erfoud" },
  body: {
    es: "Por la mañana nos adentraremos por pistas en lo más profundo del Alto Atlas Central. Visitaremos poblados bereberes como Boutaghrar, donde parece haberse detenido el tiempo, y descubriremos montañas, cañones, valles y las grutas donde aún habitan nómadas en las montañas. Comida en el Hotel Xaluca Dades. Continuaremos hacia Tinerhir, con sus casas rosas y palmerales, para adentrarnos en las famosas Gargantas del Todra siguiendo el curso del río. Más tarde seguiremos a Erfoud, «la Puerta del Desierto». Alojamiento y cena en Kasbah Hotel Xaluca, catalogada como única en Marruecos por sus peculiares características.",
    en: "In the morning we head off-road into the heart of the Central High Atlas. We visit Berber villages such as Boutaghrar where time seems to have stopped, and discover mountains, canyons, valleys and caves still inhabited by nomad families. Lunch at Hotel Xaluca Dades. We continue to Tinerhir, with its pink houses and palm groves, to enter the famous Todra Gorges along the riverbed. Then on to Erfoud, «the Gateway to the Desert». Dinner and accommodation at Kasbah Hotel Xaluca, listed as unique in Morocco for its singular character.",
    fr: "Le matin, nous nous enfonçons sur pistes dans le cœur du Haut Atlas Central. Visite de villages berbères comme Boutaghrar où le temps semble s'être arrêté, et découverte des montagnes, canyons, vallées et grottes encore habitées par des familles nomades. Déjeuner à l'Hôtel Xaluca Dadès. Poursuite vers Tinerhir, ses maisons roses et sa palmeraie, pour pénétrer dans les célèbres Gorges du Todra. Continuation vers Erfoud, « la Porte du Désert ». Dîner et hébergement à la Kasbah Hôtel Xaluca, classée unique au Maroc.",
  },
  culture: [
    {
      title: { es: "Boutaghrar y el Valle de las Rosas", en: "Boutaghrar and the Rose Valley", fr: "Boutaghrar et la Vallée des Roses" },
      body: { es: "En la zona de Boutaghrar todavía viven familias bereberes en grutas y casas trogloditas, una tradición de siglos en el Valle de las Rosas. Suelen recibir con hospitalidad a los viajeros y muestran cómo mantienen modos de vida nómadas o seminomádas en pleno Alto Atlas Central.",
              en: "In Boutaghrar, Berber families still live in caves and troglodyte houses — a centuries-old tradition in the Rose Valley. They welcome travellers with hospitality and reveal how they preserve nomadic or semi-nomadic ways of life in the very heart of the Central High Atlas.",
              fr: "À Boutaghrar, des familles berbères vivent encore dans des grottes et maisons troglodytes — une tradition séculaire de la Vallée des Roses. Elles accueillent les voyageurs avec hospitalité." },
    },
    {
      title: { es: "Gargantas del Todra", en: "Todra Gorges", fr: "Gorges du Todra" },
      body: { es: "Paredes verticales de hasta 160 metros en su tramo más estrecho, uno de los cañones más espectaculares de Marruecos. El río Todra, hoy cauce poco profundo, esculpió estas paredes durante millones de años y es uno de los lugares favoritos de escaladores de todo el mundo.",
              en: "Vertical walls up to 160 metres at the narrowest point, one of Morocco's most spectacular canyons. The Todra river, today a shallow stream, sculpted these walls over millions of years and is a global favourite for climbers.",
              fr: "Parois verticales pouvant atteindre 160 mètres au plus étroit, l'un des canyons les plus spectaculaires du Maroc. La rivière Todra, aujourd'hui peu profonde, a sculpté ces parois pendant des millions d'années." },
    },
    {
      title: { es: "Erfoud: Puerta del Desierto y capital de los fósiles", en: "Erfoud: Gateway to the Desert & fossil capital", fr: "Erfoud : Porte du Désert et capitale des fossiles" },
      body: { es: "Conocida como «la Puerta del Desierto», es famosa también por su riqueza geológica: en sus alrededores hay yacimientos de fósiles de más de 350 millones de años, especialmente trilobites y ammonites. Muchas piezas que se ven en museos y tiendas de todo Marruecos provienen de esta región.",
              en: "Known as «the Gateway to the Desert», it is also famous for its geology: surrounding deposits hold fossils more than 350 million years old, especially trilobites and ammonites. Many pieces found in Moroccan museums and shops come from here.",
              fr: "Connue comme « la Porte du Désert », elle est aussi célèbre pour sa richesse géologique : gisements de fossiles de plus de 350 millions d'années, notamment trilobites et ammonites." },
    },
  ],
};

const DAY_AD_DADES_TODRA_ERFOUD = {
  route_id: "ad-dades-todra-erfoud",
  id: "dia-dades-todra",
  image: "https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=2000&q=85",
  accent: "#5A6B4F",
  title: { es: "Valle del Dades – Gargantas del Todra – Erfoud", en: "Dades Valley – Todra Gorges – Erfoud", fr: "Vallée du Dadès – Gorges du Todra – Erfoud" },
  body: {
    es: "Recorrido por el Valle del Dades hasta sus famosas gargantas y el mirador panorámico. Parada en las formaciones geológicas conocidas como «Patas de Mono». Continuación hacia Tinerhir y las Gargantas del Todra. Llegada a Erfoud y alojamiento en Kasbah Hotel Xaluca.",
    en: "Drive through the Dades Valley to its famous gorges and panoramic viewpoint. Stop at the geological formations known as the «Monkey Paws». Continue to Tinerhir and the Todra Gorges. Arrival in Erfoud, accommodation at Kasbah Hotel Xaluca.",
    fr: "Parcours dans la Vallée du Dadès jusqu'à ses célèbres gorges et au mirador panoramique. Arrêt aux formations géologiques dites des « Pattes de Singe ». Poursuite vers Tinerhir et les Gorges du Todra. Arrivée à Erfoud, hébergement au Kasbah Hotel Xaluca.",
  },
  culture: [
    {
      title: { es: "El mirador del Dadès", en: "Dades viewpoint", fr: "Mirador du Dadès" },
      body: { es: "Uno de los paisajes más fotografiados de Marruecos.",
              en: "One of the most photographed landscapes in Morocco.",
              fr: "L'un des paysages les plus photographiés du Maroc." },
    },
    {
      title: { es: "Las «Patas de Mono»", en: "The «Monkey Paws»", fr: "Les « Pattes de Singe »" },
      body: { es: "Formaciones rocosas creadas por erosión diferencial durante millones de años.",
              en: "Rock formations sculpted by differential erosion over millions of years.",
              fr: "Formations rocheuses sculptées par érosion différentielle pendant des millions d'années." },
    },
    {
      title: { es: "Las Gargantas del Todra", en: "Todra Gorges", fr: "Gorges du Todra" },
      body: { es: "Cañones naturales con paredes de hasta 160 metros.",
              en: "Natural canyons with walls up to 160 metres.",
              fr: "Canyons naturels aux parois de jusqu'à 160 mètres." },
    },
  ],
};

const DAY_AD_ZIZ_RETURN = {
  route_id: "ad-ziz-return",
  id: "dia-ziz-return",
  image: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=2000&q=85",
  accent: "#A07042",
  title: { es: "Valle del Ziz – Errachidia – Regreso", en: "Ziz Valley – Errachidia – Return", fr: "Vallée du Ziz – Errachidia – Retour" },
  body: {
    es: "Traslado al aeropuerto de Errachidia para coger el vuelo de regreso al punto de origen. Por el camino, pararemos en el mirador del Valle del Ziz, con más de diez millones de palmeras en su interior. Salida del vuelo de Errachidia a las 07:15 h en dirección Casablanca, donde se llega a las 08:30 h. Enlace con el vuelo al punto de origen.",
    en: "Transfer to Errachidia airport for the return flight home. Along the way, stop at the Ziz Valley viewpoint, home to more than ten million palm trees. Flight departs Errachidia at 07:15 toward Casablanca, arriving at 08:30 to connect with your onward flight.",
    fr: "Transfert à l'aéroport d'Errachidia pour le vol de retour. En chemin, halte au mirador de la Vallée du Ziz, qui abrite plus de dix millions de palmiers. Départ du vol d'Errachidia à 07h15 en direction de Casablanca, arrivée à 08h30 pour la correspondance vers la ville d'origine.",
  },
  culture: [
    {
      title: { es: "Valle del Ziz: uno de los mayores palmerales del norte de África", en: "Ziz Valley: one of North Africa's largest palm groves", fr: "Vallée du Ziz : l'une des plus grandes palmeraies d'Afrique du Nord" },
      body: { es: "Se extiende desde Errachidia hasta las puertas del Sahara y alberga uno de los palmerales más extensos del norte de África, perteneciente al histórico oasis del Tafilalet, conocido por tener más de un millón de palmeras datileras. Es una de las zonas productoras de dátiles más importantes de Marruecos, especialmente la variedad medjoul.",
              en: "Stretching from Errachidia to the gates of the Sahara, it hosts one of North Africa's largest palm groves, part of the historic Tafilalet oasis with more than one million date palms. It is one of Morocco's main date-producing regions, especially of the prized Medjool variety.",
              fr: "S'étendant d'Errachidia jusqu'aux portes du Sahara, elle abrite l'une des plus grandes palmeraies d'Afrique du Nord, héritière de l'oasis historique du Tafilalet, avec plus d'un million de palmiers dattiers. L'une des principales régions productrices de dattes du Maroc, notamment la variété medjoul." },
    },
    {
      title: { es: "Aeropuerto de Errachidia: escala clave entre Atlas y Sahara", en: "Errachidia airport: key gateway between Atlas and Sahara", fr: "Aéroport d'Errachidia : escale clé entre Atlas et Sahara" },
      body: { es: "El Aeropuerto Moulay Ali Cherif de Errachidia (ERH) fue construido inicialmente como aeropuerto militar y más tarde adaptado para vuelos civiles. Hoy es el principal punto aéreo para enlazar el sur-este marroquí con Casablanca, lo que permite conectar con vuelos internacionales sin necesidad de largos traslados por carretera.",
              en: "Moulay Ali Cherif Airport (ERH) was originally built as a military airport and later adapted for civil flights. Today it is the main air hub linking south-eastern Morocco with Casablanca, allowing connections to international flights without long road transfers.",
              fr: "L'aéroport Moulay Ali Cherif (ERH) fut d'abord militaire puis adapté aux vols civils. Aujourd'hui principal point aérien reliant le sud-est marocain à Casablanca." },
    },
    {
      title: { es: "Una de las carreteras panorámicas más bellas del sur", en: "One of the most scenic roads in southern Morocco", fr: "L'une des plus belles routes panoramiques du sud" },
      body: { es: "La carretera entre el Erg Chebbi/Erfoud y Errachidia ofrece vistas directas al gran valle fértil del Ziz, donde las aldeas tradicionales se alternan con kasbahs de adobe, canales de riego (khettaras) y terrazas agrícolas. Está considerada una de las más fotogénicas del sur del país por el contraste entre el verde del valle y lo árido de las montañas que lo rodean.",
              en: "The road between Erg Chebbi/Erfoud and Errachidia offers sweeping views over the great fertile Ziz valley, where traditional hamlets alternate with adobe kasbahs, khettara irrigation channels and agricultural terraces. It is considered one of southern Morocco's most photogenic roads — contrast between the valley's green and the arid mountains.",
              fr: "La route entre l'Erg Chebbi/Erfoud et Errachidia offre des vues directes sur la grande vallée fertile du Ziz : hameaux traditionnels, kasbahs en adobe, khettaras et terrasses agricoles." },
    },
  ],
};

export const PROGRAM_AD_45 = {
  routeId: "tourAtlasDesierto45",
  duration_key: "ad4n5d",
  duration: { es: "4 noches / 5 días", en: "4 nights / 5 days", fr: "4 nuits / 5 jours" },
  prices: { low: 1290, mid: 1490, high: 1690, premium: 1990 },
  reverse: true, // Atlas -> Desert direction
  days: [
    DAY_AD_OUARZAZATE_DADES,
    DAY_AD_TODRA_ERFOUD,
    DAY_DESERT_BIVOUAC,
    DAY_KHAMLIA_RISSANI,
    DAY_AD_ZIZ_RETURN,
  ],
};

export const PROGRAM_AD_56 = {
  routeId: "tourAtlasDesierto56",
  duration_key: "ad5n6d",
  duration: { es: "5 noches / 6 días", en: "5 nights / 6 days", fr: "5 nuits / 6 jours" },
  prices: { low: 1490, mid: 1750, high: 1990, premium: 2390 },
  reverse: true,
  days: [
    DAY_AD_OUARZAZATE_DADES,
    DAY_ATLAS_MGOUN,
    DAY_AD_DADES_TODRA_ERFOUD,
    DAY_DESERT_BIVOUAC,
    DAY_KHAMLIA_RISSANI,
    DAY_AD_ZIZ_RETURN,
  ],
};

export const PROGRAM_AD_67 = {
  routeId: "tourAtlasDesierto67",
  duration_key: "ad6n7d",
  duration: { es: "6 noches / 7 días", en: "6 nights / 7 days", fr: "6 nuits / 7 jours" },
  prices: { low: 1690, mid: 1990, high: 2290, premium: 2690 },
  reverse: true,
  days: [
    DAY_AD_OUARZAZATE_DADES,
    DAY_ATLAS_MGOUN,
    DAY_AD_DADES_TODRA_ERFOUD,
    DAY_DESERT_BIVOUAC,
    DAY_KHAMLIA_MERDANI,
    DAY_RISSANI_RELAX,
    DAY_AD_ZIZ_RETURN,
  ],
};
