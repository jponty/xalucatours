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
  image: "https://images.unsplash.com/photo-1547234935-80c7145ec969?auto=format&fit=crop&w=2000&q=85",
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
  image: "https://images.unsplash.com/photo-1570133435536-7ececf000ef6?auto=format&fit=crop&w=2000&q=85",
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
  image: "https://images.unsplash.com/photo-1597212618440-806262de4f6b?auto=format&fit=crop&w=2000&q=85",
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
  image: "https://images.unsplash.com/photo-1542401886-65d6c61db217?auto=format&fit=crop&w=2000&q=85",
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
  image: "https://images.unsplash.com/photo-1597212618440-806262de4f6b?auto=format&fit=crop&w=2000&q=85",
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
  image: "https://images.unsplash.com/photo-1542401886-65d6c61db217?auto=format&fit=crop&w=2000&q=85",
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
  image: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=2000&q=85",
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

/* ============================================================
   Marrakech → Erg Chebbi (entrada Marrakech · salida Errachidia)
   4 noches · 5 días — circuit days are bespoke to this route and
   intentionally not shared with the AD/DA variants because the
   stops, hotels and cultural blocks differ.
============================================================ */

export const DAY_ME_MARRAKECH = {
  route_id: "me-marrakech",
  id: "dia-1",
  image: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=2000&q=85",
  accent: "#C16542",
  title: { es: "Marrakech · la ciudad roja", en: "Marrakech · the red city", fr: "Marrakech · la ville rouge" },
  body: {
    es: "Salida del aeropuerto de origen dirección Marrakech. Llegada (con la posible diferencia horaria según la época del año), recogida y traslado al Riad en la Medina u Hotel 5*. Por la mañana visitaremos a pie la Medina con un guía local: empezaremos admirando el alminar de la Koutoubia — gemela de la Giralda de Sevilla — y seguiremos con el Palacio de la Bahía. Nos adentraremos por las callejuelas del zoco, donde veremos en acción a tejedores de alfombras, fabricantes de babuchas y una infinita variedad de artesanía. Visitaremos una farmacia bereber y saldremos a la Plaza Djemaa el-Fna, cuyo ambiente diurno es totalmente distinto al nocturno. Por la tarde, tiempo libre para el arte del regateo o para descubrir los rincones más recónditos de la Medina. Alojamiento en Riad en la Medina u Hotel 5*.",
    en: "Departure from your home airport to Marrakech. Arrival (mind the seasonal time difference), pick-up and transfer to a Riad in the Medina or 5* Hotel. In the morning we walk the Medina with a local guide: we start at the Koutoubia minaret — twin of Seville's Giralda — and continue to the Bahia Palace. We enter the alleys of the souk, where we watch carpet weavers, babouche makers and a vast range of artisans at work. We visit a Berber pharmacy and step out into Djemaa el-Fna, whose daytime atmosphere is completely different from the night. Free afternoon for haggling or to explore the Medina's hidden corners. Overnight at a Riad in the Medina or 5* Hotel.",
    fr: "Départ de votre aéroport d'origine vers Marrakech. Arrivée (attention au décalage horaire selon la saison), accueil et transfert vers un Riad dans la Médina ou un Hôtel 5*. Le matin, nous parcourons la Médina à pied avec un guide local : minaret de la Koutoubia — jumeau de la Giralda de Séville — puis Palais de la Bahia. Nous entrons dans les ruelles du souk, où nous observons tisserands de tapis, fabricants de babouches et une infinité d'artisans. Visite d'une pharmacie berbère, puis sortie sur la place Djemaa el-Fna, dont l'ambiance diurne est totalement différente de celle de la nuit. Après-midi libre pour le marchandage ou pour découvrir les recoins cachés de la Médina. Hébergement en Riad dans la Médina ou Hôtel 5*.",
  },
  culture: [
    {
      title: { es: "La Koutoubia: el alminar que inspiró a la Giralda", en: "Koutoubia: the minaret that inspired the Giralda", fr: "La Koutoubia : le minaret qui inspira la Giralda" },
      body: {
        es: "La Mezquita de la Koutoubia fue construida en el siglo XII por los almohades y su alminar está considerado una obra maestra de la arquitectura islámica. Su diseño sirvió de modelo para la Giralda de Sevilla y la Torre Hassan de Rabat, convirtiéndolo en uno de los campanarios más influyentes del mundo medieval.",
        en: "Built in the 12th century by the Almohads, the Koutoubia Mosque's minaret is considered a masterpiece of Islamic architecture. Its design served as a model for Seville's Giralda and Rabat's Hassan Tower, making it one of the most influential minarets of the medieval world.",
        fr: "Construite au XIIᵉ siècle par les Almohades, la mosquée de la Koutoubia possède un minaret considéré comme un chef-d'œuvre de l'architecture islamique. Son dessin a servi de modèle à la Giralda de Séville et à la Tour Hassan de Rabat — l'un des minarets les plus influents du Moyen Âge.",
      },
    },
    {
      title: { es: "Los zocos: uno de los mercados más grandes del norte de África", en: "The souks: one of North Africa's largest markets", fr: "Les souks : l'un des plus grands marchés d'Afrique du Nord" },
      body: {
        es: "La Medina alberga uno de los zocos más extensos y antiguos del norte de África, dividido en sectores especializados: curtidores, cesteros, tintoreros, zapateros, herreros, joyeros… La tradición artesanal se mantiene viva gracias a gremios heredados de época medieval que transmiten los oficios de generación en generación.",
        en: "The Medina hosts one of the largest and oldest souks in North Africa, divided into specialised quarters: tanners, basket weavers, dyers, shoemakers, blacksmiths, jewellers… Artisan tradition is kept alive by medieval-era guilds that pass down each craft from generation to generation.",
        fr: "La Médina abrite l'un des souks les plus vastes et les plus anciens d'Afrique du Nord, divisé en quartiers spécialisés : tanneurs, vanniers, teinturiers, cordonniers, forgerons, bijoutiers… Une tradition artisanale maintenue vivante par des corporations héritées du Moyen Âge.",
      },
    },
    {
      title: { es: "Djemaa el-Fna: patrimonio inmaterial de la UNESCO", en: "Djemaa el-Fna: UNESCO intangible heritage", fr: "Djemaa el-Fna : patrimoine immatériel de l'UNESCO" },
      body: {
        es: "La Plaza Djemaa el-Fna fue declarada en 2001 Patrimonio Cultural Inmaterial de la Humanidad por la UNESCO por su extraordinaria vida cultural: cuentacuentos, músicos, acróbatas, herbolarios y artistas callejeros. La plaza cambia por completo del día a la noche, cuando se llena de puestos de comida y espectáculos espontáneos.",
        en: "Djemaa el-Fna Square was declared UNESCO Intangible Cultural Heritage in 2001 for its extraordinary cultural life: storytellers, musicians, acrobats, herbalists and street performers. The square completely transforms from day to night, when it fills with food stalls and impromptu shows.",
        fr: "La place Djemaa el-Fna est classée Patrimoine Culturel Immatériel de l'Humanité par l'UNESCO depuis 2001 pour son extraordinaire vie culturelle : conteurs, musiciens, acrobates, herboristes et artistes de rue. Elle se métamorphose complètement entre le jour et la nuit, où elle se remplit de stands de cuisine et de spectacles improvisés.",
      },
    },
  ],
};

export const DAY_ME_ATLAS_AITBENHADDOU = {
  route_id: "me-atlas-ait-ben-haddou",
  id: "dia-2",
  image: "https://images.unsplash.com/photo-1597212618440-806262de4f6b?auto=format&fit=crop&w=2000&q=85",
  accent: "#A07042",
  title: { es: "Alto Atlas · Aït Ben Haddou · Boumalne Dades", en: "High Atlas · Aït Ben Haddou · Boumalne Dades", fr: "Haut Atlas · Aït Ben Haddou · Boumalne Dadès" },
  body: {
    es: "Hoy saldremos con un vehículo 4x4 con chófer hacia el Alto Atlas Central. Por delante tenemos unos 310 km recompensados por la espectacularidad del paisaje. Cruzaremos el Tizi n'Tichka, el puerto de carretera asfaltado más alto del país, donde dejaremos los verdes y ocres del norte para dar paso a un paisaje lunar. Visitaremos la Kasbah de Aït Ben Haddou, Patrimonio de la Humanidad y escenario de incontables películas. Pasaremos por Ouarzazate y continuaremos por el Valle de las Rosas hasta Boumalne Dades, a 1.612 m de altitud en el Alto Atlas. Alojamiento y cena en el Hotel Xaluca Dades.",
    en: "We set off in a 4x4 with driver for the Central High Atlas. About 310 km lie ahead, generously rewarded by the landscape. We cross the Tizi n'Tichka — the highest tarmac mountain pass in the country — where the greens and ochres of the north give way to a lunar scenery. We visit the Aït Ben Haddou Kasbah, UNESCO World Heritage and backdrop for countless films. We pass through Ouarzazate and continue along the Valley of the Roses to Boumalne Dades, perched at 1,612 m. Dinner and overnight at Hotel Xaluca Dades.",
    fr: "Départ en 4x4 avec chauffeur vers le Haut Atlas Central. Environ 310 km nous attendent, largement récompensés par le paysage. Nous franchissons le Tizi n'Tichka — col routier asphalté le plus haut du pays — où les verts et ocres du nord laissent place à un paysage lunaire. Visite de la Kasbah d'Aït Ben Haddou, Patrimoine de l'Humanité et décor d'innombrables films. Passage par Ouarzazate et remontée de la Vallée des Roses jusqu'à Boumalne Dadès, à 1 612 m d'altitude. Dîner et nuit à l'Hotel Xaluca Dades.",
  },
  culture: [
    {
      title: { es: "Tizi n'Tichka: el paso asfaltado más alto de Marruecos", en: "Tizi n'Tichka: Morocco's highest tarmac pass", fr: "Tizi n'Tichka : le col asphalté le plus haut du Maroc" },
      body: {
        es: "Con 2.260 m de altitud, el Tizi n'Tichka es el puerto de carretera asfaltado más alto de Marruecos. Fue construido durante el Protectorado Francés en los años 30 para conectar Marrakech con el sur. Su ascenso permite ver cómo el paisaje cambia radicalmente: de los bosques y tierras fértiles del norte a un entorno casi lunar en el lado sur del Atlas.",
        en: "At 2,260 m, Tizi n'Tichka is Morocco's highest tarmac mountain pass. It was built during the French Protectorate in the 1930s to connect Marrakech with the south. The drive shows how the landscape changes dramatically — from the green, fertile north to the near-lunar south side of the Atlas.",
        fr: "Avec 2 260 m d'altitude, le Tizi n'Tichka est le col routier asphalté le plus haut du Maroc. Construit pendant le Protectorat Français dans les années 1930 pour relier Marrakech au sud. La montée révèle un changement radical de paysage entre le nord verdoyant et le versant sud presque lunaire.",
      },
    },
    {
      title: { es: "Aït Ben Haddou: ksar milenario y plató de cine", en: "Aït Ben Haddou: ancient ksar and film set", fr: "Aït Ben Haddou : ksar millénaire et plateau de cinéma" },
      body: {
        es: "El Ksar de Aït Ben Haddou es Patrimonio de la Humanidad desde 1987 y uno de los mejores ejemplos de arquitectura tradicional de adobe del sur marroquí. Ha sido escenario de numerosas superproducciones: Gladiator, La Momia, Juego de Tronos o Kingdom of Heaven.",
        en: "The Aït Ben Haddou Ksar has been UNESCO World Heritage since 1987 and is one of the finest examples of traditional southern-Moroccan adobe architecture. It has hosted countless blockbusters: Gladiator, The Mummy, Game of Thrones and Kingdom of Heaven.",
        fr: "Le Ksar d'Aït Ben Haddou est Patrimoine de l'Humanité depuis 1987 et l'un des plus beaux exemples d'architecture traditionnelle en pisé du sud marocain. De nombreuses superproductions y ont été tournées : Gladiator, La Momie, Game of Thrones, Kingdom of Heaven.",
      },
    },
    {
      title: { es: "Valle de las Rosas y Boumalne Dades", en: "Valley of the Roses & Boumalne Dades", fr: "Vallée des Roses et Boumalne Dadès" },
      body: {
        es: "El Valle de las Rosas es famoso por la producción de rosa damascena, utilizada desde hace siglos para elaborar agua de rosas y aceites esenciales. Más adelante, Boumalne Dades marca la entrada al impresionante valle del Dadès.",
        en: "The Valley of the Roses is famous for its Damask roses, used for centuries to make rose water and essential oils. Further on, Boumalne Dades marks the entrance to the impressive Dadès Valley.",
        fr: "La Vallée des Roses est célèbre pour la rose de Damas, utilisée depuis des siècles pour l'eau de rose et les huiles essentielles. Plus loin, Boumalne Dadès marque l'entrée de l'impressionnante vallée du Dadès.",
      },
    },
  ],
};

export const DAY_ME_TODRA_ERGCHEBBI = {
  route_id: "me-todra-erg-chebbi",
  id: "dia-3",
  image: "https://images.unsplash.com/photo-1542401886-65d6c61db217?auto=format&fit=crop&w=2000&q=85",
  accent: "#D97742",
  title: { es: "Tinerhir · Gargantas del Todra · Erg Chebbi", en: "Tinerhir · Todra Gorges · Erg Chebbi", fr: "Tinerhir · Gorges du Todra · Erg Chebbi" },
  body: {
    es: "Saldremos temprano hacia Tinerhir para visitar las famosas Gargantas del Todra. Continuamos hacia Erfoud por pistas que en su día utilizó el Rally Dakar, visitando poblados y nómadas del desierto. Parada en las Canteras de Fósiles Marinos y picnic en un auténtico oasis. Llegada al Gran Erg Chebbi: cambiamos el 4x4 por dromedarios para entrar en el corazón de las dunas y contemplar la puesta de sol. Llegada al Bivouac de Luxe; cena y alojamiento en haimas, bajo las estrellas.",
    en: "Early start towards Tinerhir to visit the famous Todra Gorges. We continue to Erfoud along tracks once used by the Dakar Rally, visiting villages and desert nomads. Stop at the Marine Fossil Quarries and picnic in a real oasis. Arrival at the great Erg Chebbi: we swap the 4x4 for camels and ride into the heart of the dunes to watch the sunset. Arrival at the Bivouac de Luxe; dinner and overnight in jaimas, under the stars.",
    fr: "Départ matinal vers Tinerhir pour visiter les célèbres Gorges du Todra. Nous poursuivons vers Erfoud par des pistes autrefois empruntées par le Rallye Dakar, à la rencontre de villages et de nomades du désert. Halte aux Carrières de Fossiles Marins et pique-nique dans une véritable oasis. Arrivée au grand Erg Chebbi : nous échangeons le 4x4 contre des dromadaires pour pénétrer au cœur des dunes et admirer le coucher de soleil. Arrivée au Bivouac de Luxe ; dîner et nuit en jaimas, sous les étoiles.",
  },
  culture: [
    {
      title: { es: "Tinerhir y las Gargantas del Todra", en: "Tinerhir & the Todra Gorges", fr: "Tinerhir et les Gorges du Todra" },
      body: {
        es: "Las Gargantas del Todra son uno de los cañones más impresionantes del sur de Marruecos. En su tramo más estrecho, las paredes alcanzan 160 metros de altura.",
        en: "The Todra Gorges are one of the most impressive canyons of southern Morocco. At their narrowest point the walls rise 160 metres high.",
        fr: "Les Gorges du Todra forment l'un des canyons les plus impressionnants du sud du Maroc. Dans leur partie la plus étroite, les parois s'élèvent à 160 m de hauteur.",
      },
    },
    {
      title: { es: "Pistas del Rally Dakar y fósiles devónicos", en: "Dakar Rally tracks & Devonian fossils", fr: "Pistes du Rallye Dakar et fossiles dévoniens" },
      body: {
        es: "La zona entre Erfoud, Taouz y el Erg Chebbi fue escenario de varias etapas del Rally Dakar antes de 2007. Sus canteras contienen fósiles de más de 360 millones de años — amonites, trilobites y peces primitivos.",
        en: "The area between Erfoud, Taouz and the Erg Chebbi was the setting for several Dakar Rally stages before 2007. The quarries hold fossils more than 360 million years old — ammonites, trilobites and primitive fish.",
        fr: "La zone entre Erfoud, Taouz et l'Erg Chebbi a accueilli plusieurs étapes du Rallye Dakar avant 2007. Les carrières recèlent des fossiles de plus de 360 millions d'années — ammonites, trilobites et poissons primitifs.",
      },
    },
    {
      title: { es: "Erg Chebbi: dunas gigantes y puesta de sol", en: "Erg Chebbi: giant dunes & sunsets", fr: "Erg Chebbi : dunes géantes et couchers de soleil" },
      body: {
        es: "El Erg Chebbi destaca por sus dunas de 100–150 m de altura y por la extraordinaria finura de su arena, formada por los vientos saharianos. Es uno de los lugares más fotografiados del Sahara marroquí.",
        en: "The Erg Chebbi is famous for dunes between 100 and 150 metres high and for the extraordinary fineness of its sand, shaped by Saharan winds. One of the most photographed spots in the Moroccan Sahara.",
        fr: "L'Erg Chebbi se distingue par ses dunes de 100 à 150 m de hauteur et par la finesse extraordinaire de son sable, façonné par les vents sahariens. L'un des lieux les plus photographiés du Sahara marocain.",
      },
    },
  ],
};

export const DAY_ME_KHAMLIA_RISSANI = {
  route_id: "me-khamlia-rissani",
  id: "dia-4",
  image: "https://images.unsplash.com/photo-1547234935-80c7145ec969?auto=format&fit=crop&w=2000&q=85",
  accent: "#D4A373",
  title: { es: "Amanecer en el Erg · Khamlia · Rissani · Erfoud", en: "Erg sunrise · Khamlia · Rissani · Erfoud", fr: "Lever sur l'Erg · Khamlia · Rissani · Erfoud" },
  body: {
    es: "«Cita con el amanecer»: recomendable madrugar y caminar hasta lo más alto de las dunas para ver la salida del sol. Desayuno beduino y ruta alrededor del Erg hasta Merdani. Visitaremos Khamlia, con su espectáculo de música Gnawa, y el mercado tradicional de Rissani. Parada en el mirador natural del desierto y llegada a Kasbah Xaluca. Tiempo libre para descansar y disfrutar de las instalaciones — hammam, masajes, piscina climatizada, tenis, minigolf o excursión opcional en quad. Cena y alojamiento en Kasbah Xaluca.",
    en: "«Sunrise date»: an early walk to the top of the dunes to watch the sun rise. Bedouin breakfast and route around the Erg towards Merdani. We visit Khamlia and its Gnawa music show, then the traditional market of Rissani. Stop at the natural desert viewpoint and arrival at Kasbah Xaluca. Free time to rest and enjoy the facilities — hammam, massages, heated pool, tennis, minigolf or an optional quad excursion. Dinner and overnight at Kasbah Xaluca.",
    fr: "« Rendez-vous au lever du soleil » : montée matinale au sommet des dunes pour assister au lever du jour. Petit-déjeuner bédouin puis route autour de l'Erg vers Merdani. Visite de Khamlia et de son spectacle de musique Gnawa, puis du marché traditionnel de Rissani. Halte au mirador naturel du désert et arrivée à la Kasbah Xaluca. Temps libre pour profiter des installations — hammam, massages, piscine chauffée, tennis, minigolf ou excursion optionnelle en quad. Dîner et nuit à la Kasbah Xaluca.",
  },
  culture: [
    {
      title: { es: "Amanecer en el Erg Chebbi", en: "Sunrise over the Erg Chebbi", fr: "Lever de soleil sur l'Erg Chebbi" },
      body: {
        es: "Las dunas cambian de tonos rojizos a dorados y rosados mientras el sol asciende sobre el Sahara. Uno de los momentos más recordados por todo viajero que ha pernoctado en el desierto.",
        en: "The dunes shift from reddish to gold and pink hues as the sun rises over the Sahara — one of the most unforgettable moments of every overnight in the desert.",
        fr: "Les dunes passent du rouge au doré et au rose tandis que le soleil monte sur le Sahara. L'un des instants les plus marquants pour quiconque a passé la nuit au désert.",
      },
    },
    {
      title: { es: "Khamlia y la música Gnawa", en: "Khamlia & Gnawa music", fr: "Khamlia et la musique Gnawa" },
      body: {
        es: "El pueblo de Khamlia es conocido por su música Gnawa, declarada Patrimonio Cultural Inmaterial por la UNESCO. Las familias acogen al viajero con té y un concierto íntimo en su zaouia.",
        en: "The village of Khamlia is famed for its Gnawa music, listed as UNESCO Intangible Cultural Heritage. Families welcome travellers with tea and an intimate concert at their zaouia.",
        fr: "Le village de Khamlia est connu pour sa musique Gnawa, classée au Patrimoine Culturel Immatériel de l'UNESCO. Les familles accueillent les voyageurs avec un thé et un concert intime dans leur zaouia.",
      },
    },
    {
      title: { es: "Rissani y su mercado tradicional", en: "Rissani & its traditional market", fr: "Rissani et son marché traditionnel" },
      body: {
        es: "Uno de los zocos más antiguos del sur de Marruecos. Famoso por su auténtico «parking de burros» y por ser la cuna histórica de la dinastía alauita.",
        en: "One of the oldest souks of southern Morocco. Famous for its authentic «donkey parking» and for being the historic cradle of the Alaouite dynasty.",
        fr: "L'un des plus anciens souks du sud du Maroc. Célèbre pour son authentique « parking d'ânes » et pour être le berceau historique de la dynastie alaouite.",
      },
    },
  ],
};

export const DAY_ME_ZIZ_ERRACHIDIA = {
  route_id: "me-ziz-errachidia",
  id: "dia-5",
  image: "https://images.unsplash.com/photo-1473625247510-8ceb1760943f?auto=format&fit=crop&w=2000&q=85",
  accent: "#3A4A5F",
  title: { es: "Valle del Ziz · Errachidia · regreso", en: "Ziz Valley · Errachidia · return", fr: "Vallée du Ziz · Errachidia · retour" },
  body: {
    es: "Traslado al aeropuerto de Errachidia con parada en el mirador del Valle del Ziz, uno de los mayores oasis del norte de África. Vuelo Errachidia → Casablanca y enlace con vuelo de regreso al punto de origen.",
    en: "Transfer to Errachidia airport with a stop at the Ziz Valley viewpoint — one of North Africa's largest oases. Flight Errachidia → Casablanca and connection to your home airport.",
    fr: "Transfert à l'aéroport d'Errachidia avec halte au mirador de la vallée du Ziz, l'une des plus grandes oasis d'Afrique du Nord. Vol Errachidia → Casablanca et correspondance vers l'aéroport d'origine.",
  },
  culture: [
    {
      title: { es: "Valle del Ziz", en: "Ziz Valley", fr: "Vallée du Ziz" },
      body: {
        es: "Uno de los mayores oasis del norte de África, famoso por sus palmerales infinitos y por la producción del codiciado dátil medjoul.",
        en: "One of the largest oases in North Africa, famous for its endless palm groves and the production of the coveted Medjool date.",
        fr: "L'une des plus grandes oasis d'Afrique du Nord, célèbre pour ses palmeraies infinies et la production de la précieuse datte medjoul.",
      },
    },
    {
      title: { es: "Mirador del Valle del Ziz", en: "Ziz Valley viewpoint", fr: "Mirador de la vallée du Ziz" },
      body: {
        es: "Panorámica espectacular sobre oasis, montañas y palmerales del sur marroquí — una de las paradas obligadas antes de tomar el vuelo de regreso.",
        en: "Spectacular panorama over oases, mountains and palm groves of southern Morocco — one of the mandatory stops before catching the return flight.",
        fr: "Panorama spectaculaire sur les oasis, montagnes et palmeraies du sud marocain — l'une des haltes incontournables avant de prendre l'avion du retour.",
      },
    },
    {
      title: { es: "Aeropuerto de Errachidia", en: "Errachidia airport", fr: "Aéroport d'Errachidia" },
      body: {
        es: "Principal conexión aérea del sureste de Marruecos, con vuelos diarios vía Casablanca hacia Europa.",
        en: "The main air gateway for south-eastern Morocco, with daily flights via Casablanca to Europe.",
        fr: "Principale liaison aérienne du sud-est marocain, avec des vols quotidiens via Casablanca vers l'Europe.",
      },
    },
  ],
};

export const PROGRAM_ME_45 = {
  routeId: "tourMarrakechErg45",
  duration_key: "me4n5d",
  duration: { es: "4 noches / 5 días", en: "4 nights / 5 days", fr: "4 nuits / 5 jours" },
  prices: { low: 1190, mid: 1390, high: 1590, premium: 1890 },
  reverse: false,
  days: [
    DAY_ME_MARRAKECH,
    DAY_ME_ATLAS_AITBENHADDOU,
    DAY_ME_TODRA_ERGCHEBBI,
    DAY_ME_KHAMLIA_RISSANI,
    DAY_ME_ZIZ_ERRACHIDIA,
  ],
};

/* ============================================================
   Marrakech → Erg Chebbi · 6 noches / 7 días
   The 6N/7D version unpacks the Marrakech day into arrival + a
   dedicated medina day, adds an Atlas Central traverse via
   Boutaghrar / Dades / Todra, and gives the desert its own full
   day. Days 3 (Atlas→Boumalne), 6 (Khamlia/Rissani) and 7 (Ziz)
   are shared with PROGRAM_ME_45.
============================================================ */

export const DAY_ME67_ARRIVAL = {
  route_id: "me67-arrival",
  id: "dia-1",
  image: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=2000&q=85",
  accent: "#C16542",
  title: { es: "Llegada a Marrakech · Djemaa el-Fna", en: "Arrival in Marrakech · Djemaa el-Fna", fr: "Arrivée à Marrakech · Djemaa el-Fna" },
  body: {
    es: "Salida del aeropuerto de origen dirección Marrakech. Recogida en el aeropuerto y traslado al Riad en la Medina u Hotel 5*. Por la tarde haremos una primera toma de contacto con la Medina visitando la Plaza Djemaa el-Fna, una de las plazas más vivas del mundo. Por la noche se llena de músicos, narradores, artistas callejeros y puestos gastronómicos tradicionales. Cena libre y alojamiento.",
    en: "Departure from your home airport towards Marrakech. Pick-up at the airport and transfer to a Riad in the Medina or 5* Hotel. In the afternoon, a first immersion in the Medina at Djemaa el-Fna Square — one of the world's most vibrant squares. By night it fills with musicians, storytellers, street artists and traditional food stalls. Dinner on your own and overnight.",
    fr: "Départ de votre aéroport d'origine vers Marrakech. Accueil à l'aéroport et transfert vers un Riad dans la Médina ou un Hôtel 5*. L'après-midi, première immersion dans la Médina sur la place Djemaa el-Fna, l'une des plus vivantes au monde. La nuit, elle se remplit de musiciens, conteurs, artistes de rue et de stands gastronomiques traditionnels. Dîner libre et nuit sur place.",
  },
  culture: [
    {
      title: { es: "Djemaa el-Fna: Patrimonio Inmaterial de la UNESCO", en: "Djemaa el-Fna: UNESCO intangible heritage", fr: "Djemaa el-Fna : patrimoine immatériel de l'UNESCO" },
      body: {
        es: "Inscrita en 2001 como Patrimonio Cultural Inmaterial de la Humanidad por la UNESCO por su extraordinaria concentración de tradición oral, música, gastronomía y artes populares. Un lugar único en el mundo donde el patrimonio cultural se vive cada día.",
        en: "Inscribed in 2001 as UNESCO Intangible Cultural Heritage for its extraordinary concentration of oral tradition, music, gastronomy and folk arts. A truly unique place where heritage is lived every single day.",
        fr: "Inscrite en 2001 au Patrimoine Culturel Immatériel de l'Humanité par l'UNESCO pour son extraordinaire concentration de tradition orale, musique, gastronomie et arts populaires. Un lieu unique au monde où le patrimoine se vit chaque jour.",
      },
    },
    {
      title: { es: "Un cambio total entre el día y la noche", en: "Day & night — a complete transformation", fr: "Une transformation totale entre jour et nuit" },
      body: {
        es: "De día predominan encantadores de serpientes, curanderos y vendedores ambulantes. De noche la plaza se transforma en un gran escenario gastronómico y cultural con decenas de puestos de comida y espectáculos espontáneos.",
        en: "By day, snake charmers, healers and street vendors dominate the square. By night, it transforms into a vast gastronomic and cultural stage with dozens of food stalls and impromptu shows.",
        fr: "De jour, charmeurs de serpents, guérisseurs et vendeurs ambulants animent la place. De nuit, elle devient une vaste scène gastronomique et culturelle, avec des dizaines de stands et de spectacles improvisés.",
      },
    },
    {
      title: { es: "Marrakech y la diferencia horaria", en: "Marrakech & the time difference", fr: "Marrakech et le décalage horaire" },
      body: {
        es: "Marruecos cambia temporalmente a UTC+0 durante el Ramadán, lo que puede generar diferencias horarias respecto al país de origen. Conviene verificar el huso horario antes del viaje y al llegar.",
        en: "Morocco temporarily switches to UTC+0 during Ramadan, which can create a time difference with your home country. It is wise to double-check the local time before departure and on arrival.",
        fr: "Le Maroc passe temporairement à UTC+0 pendant le Ramadan, ce qui peut entraîner un décalage horaire avec votre pays d'origine. Vérifiez l'heure locale avant le départ et à l'arrivée.",
      },
    },
  ],
};

export const DAY_ME67_MEDINA = {
  route_id: "me67-medina",
  id: "dia-2",
  image: "https://images.unsplash.com/photo-1597212618440-806262de4f6b?auto=format&fit=crop&w=2000&q=85",
  accent: "#A07042",
  title: { es: "Marrakech · medina, Koutoubia y zocos", en: "Marrakech · medina, Koutoubia and souks", fr: "Marrakech · médina, Koutoubia et souks" },
  body: {
    es: "Día completo para descubrir Marrakech. Visita guiada a pie por la Medina con un guía local. Visitaremos el Alminar de la Koutoubia, gemela de la Giralda de Sevilla, y el Palacio de la Bahía. Recorreremos los zocos tradicionales viendo en acción a tejedores de alfombras, fabricantes de babuchas, tintoreros y joyeros. Visita a una farmacia bereber y regreso a Djemaa el-Fna. Tarde libre para descubrir la Medina a nuestro aire o hacer compras. Alojamiento en Riad en la Medina u Hotel 5*.",
    en: "A full day to discover Marrakech. Guided walking tour of the Medina with a local guide. We visit the Koutoubia minaret — twin of Seville's Giralda — and the Bahia Palace. We wander the traditional souks watching carpet weavers, babouche makers, dyers and jewellers at work. We visit a Berber pharmacy and return to Djemaa el-Fna. Free afternoon to explore the Medina at your own pace or shop. Overnight in a Riad in the Medina or 5* Hotel.",
    fr: "Journée complète pour découvrir Marrakech. Visite guidée à pied de la Médina avec un guide local. Nous visitons le minaret de la Koutoubia — jumeau de la Giralda de Séville — et le Palais de la Bahia. Nous parcourons les souks traditionnels en observant tisserands de tapis, fabricants de babouches, teinturiers et bijoutiers. Visite d'une pharmacie berbère et retour à Djemaa el-Fna. Après-midi libre pour explorer la Médina à votre rythme ou faire des achats. Nuit en Riad dans la Médina ou Hôtel 5*.",
  },
  culture: [
    {
      title: { es: "La Koutoubia", en: "The Koutoubia", fr: "La Koutoubia" },
      body: {
        es: "La gran obra maestra de la arquitectura almohade y referencia arquitectónica del occidente islámico. Su alminar inspiró tanto la Giralda de Sevilla como la Torre Hassan de Rabat.",
        en: "The great masterpiece of Almohad architecture and a benchmark of the Islamic West. Its minaret inspired both Seville's Giralda and Rabat's Hassan Tower.",
        fr: "Le grand chef-d'œuvre de l'architecture almohade et une référence de l'occident islamique. Son minaret a inspiré aussi bien la Giralda de Séville que la Tour Hassan de Rabat.",
      },
    },
    {
      title: { es: "Los zocos de Marrakech", en: "The souks of Marrakech", fr: "Les souks de Marrakech" },
      body: {
        es: "Uno de los mercados artesanales más grandes y auténticos del norte de África. Cada gremio ocupa un sector — curtidores, cesteros, tintoreros, herreros, joyeros — manteniendo viva la tradición de oficios medievales.",
        en: "One of the largest and most authentic artisan markets in North Africa. Each guild occupies its own quarter — tanners, basket weavers, dyers, blacksmiths, jewellers — keeping medieval crafts alive.",
        fr: "L'un des plus grands marchés artisanaux et des plus authentiques d'Afrique du Nord. Chaque corporation occupe son quartier — tanneurs, vanniers, teinturiers, forgerons, bijoutiers — perpétuant des métiers médiévaux.",
      },
    },
    {
      title: { es: "Djemaa el-Fna", en: "Djemaa el-Fna", fr: "Djemaa el-Fna" },
      body: {
        es: "Un patrimonio cultural vivo que cambia completamente entre el día y la noche. La UNESCO la incluyó en 2001 como Patrimonio Cultural Inmaterial de la Humanidad.",
        en: "A living cultural heritage that transforms completely between day and night. UNESCO listed it in 2001 as Intangible Cultural Heritage.",
        fr: "Un patrimoine culturel vivant qui se transforme complètement entre jour et nuit. L'UNESCO l'a inscrite en 2001 au Patrimoine Culturel Immatériel.",
      },
    },
  ],
};

export const DAY_ME67_BOUTAGHRAR_TODRA = {
  route_id: "me67-boutaghrar-todra",
  id: "dia-4",
  image: "https://images.unsplash.com/photo-1570133435536-7ececf000ef6?auto=format&fit=crop&w=2000&q=85",
  accent: "#D97742",
  title: { es: "Boutaghrar · Valle del Dadès · Todra · Erfoud", en: "Boutaghrar · Dadès Valley · Todra · Erfoud", fr: "Boutaghrar · Vallée du Dadès · Todra · Erfoud" },
  body: {
    es: "Ruta por pistas del Alto Atlas Central. Visitaremos poblados bereberes como Boutaghrar y descubriremos grutas donde aún habitan familias nómadas. Recorreremos el Valle del Dadès con parada en su famoso mirador y en las espectaculares «Patas de Mono». Continuamos hacia Tinerhir para visitar las Gargantas del Todra y bajaremos hasta Erfoud, la puerta del desierto. Cena y alojamiento en Kasbah Xaluca.",
    en: "Day on the tracks of the Central High Atlas. We visit Berber villages like Boutaghrar and discover caves still inhabited by nomadic families. We drive the Dadès Valley with stops at its famous viewpoint and at the spectacular «Monkey Paws». We continue to Tinerhir to visit the Todra Gorges and descend to Erfoud, the gate of the desert. Dinner and overnight at Kasbah Xaluca.",
    fr: "Journée sur les pistes du Haut Atlas Central. Nous visitons des villages berbères comme Boutaghrar et découvrons des grottes encore habitées par des familles nomades. Nous parcourons la Vallée du Dadès avec des arrêts au célèbre belvédère et aux spectaculaires « Pattes de Singe ». Nous continuons vers Tinerhir pour visiter les Gorges du Todra, puis nous descendons à Erfoud, porte du désert. Dîner et nuit à la Kasbah Xaluca.",
  },
  culture: [
    {
      title: { es: "Boutaghrar", en: "Boutaghrar", fr: "Boutaghrar" },
      body: {
        es: "Zona famosa por conservar tradiciones bereberes ancestrales y por la presencia de comunidades nómadas Aït Atta que aún viven en grutas naturales de las montañas.",
        en: "An area famed for preserving ancestral Berber traditions and for the Aït Atta nomadic communities still living in natural mountain caves.",
        fr: "Zone célèbre pour la conservation de traditions berbères ancestrales et pour les communautés nomades Aït Atta qui vivent encore dans des grottes naturelles de la montagne.",
      },
    },
    {
      title: { es: "Valle del Dadès y las «Patas de Mono»", en: "Dadès Valley & the «Monkey Paws»", fr: "Vallée du Dadès et les « Pattes de Singe »" },
      body: {
        es: "Formaciones geológicas creadas por la erosión natural durante millones de años. El cañón del Dadès es uno de los recorridos paisajísticos más espectaculares del sur de Marruecos.",
        en: "Geological formations carved by natural erosion over millions of years. The Dadès canyon is one of southern Morocco's most spectacular drives.",
        fr: "Formations géologiques façonnées par l'érosion naturelle au fil de millions d'années. Le canyon du Dadès est l'un des parcours paysagers les plus spectaculaires du sud marocain.",
      },
    },
    {
      title: { es: "Tinerhir y Todra", en: "Tinerhir & Todra", fr: "Tinerhir et le Todra" },
      body: {
        es: "Uno de los desfiladeros más espectaculares del sureste marroquí, con paredes que en su tramo más estrecho alcanzan los 160 metros de altura.",
        en: "One of south-east Morocco's most spectacular canyons, where walls reach 160 metres at their narrowest stretch.",
        fr: "L'un des canyons les plus spectaculaires du sud-est marocain, dont les parois atteignent 160 m dans la partie la plus étroite.",
      },
    },
  ],
};

export const DAY_ME67_DESIERTO_TOTAL = {
  route_id: "me67-desierto-total",
  id: "dia-5",
  image: "https://images.unsplash.com/photo-1542401886-65d6c61db217?auto=format&fit=crop&w=2000&q=85",
  accent: "#D4A373",
  title: { es: "Desierto total · Erg Chebbi", en: "Total desert day · Erg Chebbi", fr: "Journée désert · Erg Chebbi" },
  body: {
    es: "Día completo de inmersión en el desierto. Saldremos desde Erfoud por pistas utilizadas antiguamente por el Rally Dakar. Visitaremos poblados y nómadas del desierto, y haremos parada en las canteras de fósiles marinos. Picnic en un oasis. Llegada al Gran Erg Chebbi, donde cambiaremos el vehículo 4x4 por dromedarios para entrar en el corazón de las dunas y contemplar la puesta de sol. Llegada al Bivouac de Luxe. Cena y alojamiento en haimas de lujo, bajo las estrellas.",
    en: "A full day of desert immersion. We set off from Erfoud along tracks once used by the Dakar Rally. We visit villages and desert nomads, with a stop at the marine fossil quarries. Picnic in an oasis. Arrival at the great Erg Chebbi, where we swap the 4x4 for camels and ride into the heart of the dunes to watch the sunset. Arrival at the Bivouac de Luxe. Dinner and overnight in luxury jaimas, under the stars.",
    fr: "Journée complète d'immersion au désert. Départ d'Erfoud par des pistes autrefois empruntées par le Rallye Dakar. Visite de villages et de nomades du désert, avec un arrêt aux carrières de fossiles marins. Pique-nique dans une oasis. Arrivée au grand Erg Chebbi : nous échangeons le 4x4 contre des dromadaires pour pénétrer au cœur des dunes et admirer le coucher de soleil. Arrivée au Bivouac de Luxe. Dîner et nuit en jaimas de luxe, sous les étoiles.",
  },
  culture: [
    {
      title: { es: "Las pistas del Rally Dakar", en: "The Dakar Rally tracks", fr: "Les pistes du Rallye Dakar" },
      body: {
        es: "La región fue utilizada durante años en etapas oficiales del Rally Dakar antes de su traslado a Sudamérica en 2008. Sus dunas y pistas pedregosas siguen siendo escenario de otros raids internacionales.",
        en: "The region hosted Dakar Rally stages for years before the race moved to South America in 2008. Its dunes and stony tracks still feature in other international raids.",
        fr: "La région a accueilli pendant des années des étapes du Rallye Dakar avant son déménagement en Amérique du Sud en 2008. Ses dunes et pistes pierreuses sont toujours empruntées par d'autres raids internationaux.",
      },
    },
    {
      title: { es: "Fósiles marinos del Devónico", en: "Devonian marine fossils", fr: "Fossiles marins du Dévonien" },
      body: {
        es: "Hace más de 360 millones de años esta región estaba cubierta por un mar tropical. Hoy las canteras de Erfoud abastecen al mundo de fósiles de amonites, ortoceras y trilobites perfectamente conservados.",
        en: "Over 360 million years ago this region lay under a tropical sea. Today, Erfoud's quarries supply the world with perfectly preserved fossils of ammonites, orthoceras and trilobites.",
        fr: "Il y a plus de 360 millions d'années, cette région se trouvait sous une mer tropicale. Aujourd'hui, les carrières d'Erfoud fournissent au monde entier des fossiles d'ammonites, d'orthocères et de trilobites parfaitement conservés.",
      },
    },
    {
      title: { es: "Erg Chebbi", en: "Erg Chebbi", fr: "Erg Chebbi" },
      body: {
        es: "Dunas gigantes de arena fina con una de las puestas de sol más famosas del Sahara marroquí. Sus crestas alcanzan 150 metros de altura y cambian de tonalidad varias veces al día.",
        en: "Giant fine-sand dunes hosting one of the most famous sunsets in the Moroccan Sahara. Their crests reach 150 metres and change colour several times throughout the day.",
        fr: "Dunes géantes de sable fin offrant l'un des couchers de soleil les plus célèbres du Sahara marocain. Leurs crêtes atteignent 150 m et changent de tonalité plusieurs fois par jour.",
      },
    },
  ],
};

export const PROGRAM_ME_67 = {
  routeId: "tourMarrakechErg67",
  duration_key: "me6n7d",
  duration: { es: "6 noches / 7 días", en: "6 nights / 7 days", fr: "6 nuits / 7 jours" },
  prices: { low: 1490, mid: 1790, high: 2090, premium: 2490 },
  reverse: false,
  days: [
    DAY_ME67_ARRIVAL,
    DAY_ME67_MEDINA,
    DAY_ME_ATLAS_AITBENHADDOU,
    DAY_ME67_BOUTAGHRAR_TODRA,
    DAY_ME67_DESIERTO_TOTAL,
    DAY_ME_KHAMLIA_RISSANI,
    DAY_ME_ZIZ_ERRACHIDIA,
  ],
};

/* ============================================================
   Marrakech → Erg Chebbi · 7 noches / 8 días
   The 7N/8D version stretches the Atlas Central exploration into
   two days (Boutaghrar/Amskar/M'Goun then Dadès/Todra/Erfoud) and
   keeps the desert day, Khamlia/Rissani and Ziz blocks shared
   with PROGRAM_ME_67.
============================================================ */

export const DAY_ME78_BOUTAGHRAR_MGOUN = {
  route_id: "me78-boutaghrar-mgoun",
  id: "dia-4",
  image: "https://images.unsplash.com/photo-1597212618440-806262de4f6b?auto=format&fit=crop&w=2000&q=85",
  accent: "#A07042",
  title: { es: "Boutaghrar · Amskar · Gargantas del M'Goun", en: "Boutaghrar · Amskar · M'Goun Gorges", fr: "Boutaghrar · Amskar · Gorges du M'Goun" },
  body: {
    es: "Día completo por las pistas del Alto Atlas Central. Visitaremos poblados bereberes como Boutaghrar y Amskar y descubriremos grutas donde todavía viven familias nómadas. Recorreremos las espectaculares Gargantas del M'Goun, esculpidas durante millones de años por el río que les da nombre. Comida en ruta en una «Gite d'Etape» — refugio tradicional para senderistas y conductores. Regreso al Hotel Xaluca Dades para cena y alojamiento.",
    en: "Full day on the tracks of the Central High Atlas. We visit Berber villages such as Boutaghrar and Amskar and discover caves still inhabited by nomadic families. We drive the spectacular M'Goun Gorges, carved over millions of years by the river that gives them their name. Lunch en route at a «Gite d'Etape» — a traditional refuge for hikers and drivers. Return to Hotel Xaluca Dades for dinner and overnight.",
    fr: "Journée complète sur les pistes du Haut Atlas Central. Nous visitons des villages berbères comme Boutaghrar et Amskar et découvrons des grottes encore habitées par des familles nomades. Nous parcourons les spectaculaires Gorges du M'Goun, sculptées par la rivière du même nom au fil de millions d'années. Déjeuner en route dans une « Gite d'Étape » — refuge traditionnel des randonneurs et chauffeurs. Retour à l'Hotel Xaluca Dades pour le dîner et la nuit.",
  },
  culture: [
    {
      title: { es: "Boutaghrar y Amskar", en: "Boutaghrar & Amskar", fr: "Boutaghrar et Amskar" },
      body: {
        es: "Aldeas bereberes donde aún se conservan sistemas agrícolas tradicionales — terrazas de regadío, almacenes comunales (agadirs) — y las formas de vida nómadas ancestrales del pueblo Aït Atta.",
        en: "Berber villages where traditional farming systems still endure — irrigation terraces, communal granaries (agadirs) — alongside the ancestral nomadic lifestyle of the Aït Atta people.",
        fr: "Villages berbères où subsistent encore des systèmes agricoles traditionnels — terrasses d'irrigation, greniers communautaires (agadirs) — et le mode de vie nomade ancestral du peuple Aït Atta.",
      },
    },
    {
      title: { es: "Gargantas del M'Goun", en: "M'Goun Gorges", fr: "Gorges du M'Goun" },
      body: {
        es: "Impresionante cañón esculpido durante millones de años por el río M'Goun. Atraviesa la cordillera del mismo nombre, segunda cumbre más alta de Marruecos con 4.071 m.",
        en: "An impressive canyon carved over millions of years by the M'Goun river. It cuts through the eponymous range — Morocco's second-highest peak at 4,071 m.",
        fr: "Un canyon impressionnant sculpté par la rivière M'Goun au fil de millions d'années. Il traverse la chaîne du même nom — second sommet du Maroc à 4 071 m.",
      },
    },
    {
      title: { es: "Alto Atlas Central", en: "Central High Atlas", fr: "Haut Atlas Central" },
      body: {
        es: "Una de las regiones geológicas más antiguas y complejas de Marruecos: pliegues precámbricos, conglomerados rojos y mesetas calcáreas que descubrimos en cada tramo de pista.",
        en: "One of Morocco's oldest and most complex geological regions: Precambrian folds, red conglomerates and limestone plateaus revealed at every turn of the track.",
        fr: "L'une des régions géologiques les plus anciennes et complexes du Maroc : plis précambriens, conglomérats rouges et plateaux calcaires révélés à chaque tronçon de piste.",
      },
    },
  ],
};

export const DAY_ME78_DADES_TODRA = {
  route_id: "me78-dades-todra",
  id: "dia-5",
  image: "https://images.unsplash.com/photo-1570133435536-7ececf000ef6?auto=format&fit=crop&w=2000&q=85",
  accent: "#D97742",
  title: { es: "Valle del Dadès · Todra · Erfoud", en: "Dadès Valley · Todra · Erfoud", fr: "Vallée du Dadès · Todra · Erfoud" },
  body: {
    es: "Recorreremos el Valle del Dadès con parada en su famoso mirador y en las espectaculares «Patas de Mono». Continuaremos hacia Tinerhir para visitar las imponentes Gargantas del Todra, antes de bajar hasta Erfoud, conocida como la «Puerta del Desierto». Cena y alojamiento en Kasbah Xaluca.",
    en: "We drive the Dadès Valley with stops at its famous viewpoint and at the spectacular «Monkey Paws». We continue to Tinerhir to visit the imposing Todra Gorges, before descending to Erfoud — known as the «Gate of the Desert». Dinner and overnight at Kasbah Xaluca.",
    fr: "Nous parcourons la Vallée du Dadès avec des arrêts au célèbre belvédère et aux spectaculaires « Pattes de Singe ». Nous continuons vers Tinerhir pour visiter les imposantes Gorges du Todra, puis nous descendons à Erfoud — la « Porte du Désert ». Dîner et nuit à la Kasbah Xaluca.",
  },
  culture: [
    {
      title: { es: "Valle del Dadès", en: "Dadès Valley", fr: "Vallée du Dadès" },
      body: {
        es: "Famoso por su carretera en zig-zag y por las formaciones rocosas erosionadas conocidas como «Patas de Mono», esculpidas por la lluvia y el viento durante milenios.",
        en: "Famous for its zig-zag road and for the eroded rock formations known as «Monkey Paws», shaped by rain and wind over millennia.",
        fr: "Célèbre pour sa route en zigzag et pour les formations rocheuses érodées dites « Pattes de Singe », sculptées par la pluie et le vent au fil des millénaires.",
      },
    },
    {
      title: { es: "Tinerhir y Todra", en: "Tinerhir & Todra", fr: "Tinerhir et le Todra" },
      body: {
        es: "Oasis y desfiladero espectacular con paredes de roca caliza que en su tramo más estrecho alcanzan 160 metros de altura.",
        en: "Oasis and spectacular canyon with limestone walls rising up to 160 metres at their narrowest point.",
        fr: "Oasis et canyon spectaculaire dont les parois calcaires atteignent 160 m de hauteur dans la partie la plus étroite.",
      },
    },
    {
      title: { es: "Erfoud · puerta del desierto", en: "Erfoud · gate of the desert", fr: "Erfoud · porte du désert" },
      body: {
        es: "Conocida internacionalmente por sus fósiles devónicos — amonites, ortoceras, trilobites — y como base logística para las expediciones al Erg Chebbi.",
        en: "Internationally known for its Devonian fossils — ammonites, orthoceras, trilobites — and as the logistics hub for expeditions into the Erg Chebbi.",
        fr: "Connue internationalement pour ses fossiles dévoniens — ammonites, orthocères, trilobites — et comme base logistique des expéditions vers l'Erg Chebbi.",
      },
    },
  ],
};

export const PROGRAM_ME_78 = {
  routeId: "tourMarrakechErg78",
  duration_key: "me7n8d",
  duration: { es: "7 noches / 8 días", en: "7 nights / 8 days", fr: "7 nuits / 8 jours" },
  prices: { low: 1690, mid: 1990, high: 2390, premium: 2790 },
  reverse: false,
  days: [
    DAY_ME67_ARRIVAL,
    DAY_ME67_MEDINA,
    DAY_ME_ATLAS_AITBENHADDOU,
    DAY_ME78_BOUTAGHRAR_MGOUN,
    DAY_ME78_DADES_TODRA,
    DAY_ME67_DESIERTO_TOTAL,
    DAY_ME_KHAMLIA_RISSANI,
    DAY_ME_ZIZ_ERRACHIDIA,
  ],
};
