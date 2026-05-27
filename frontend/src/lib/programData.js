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

/* ============================================================
   Erg Chebbi → Marrakech · 6 noches / 7 días
   Entrada por Errachidia, dos noches en Erfoud (Kasbah Xaluca),
   bivouac en el Erg Chebbi, dos noches en Boumalne Dades (Xaluca
   Dades), atravesando el Atlas Central hasta Aït Ben Haddou y
   Marrakech, con visita guiada a la medina en el último día.
============================================================ */

export const DAY_EM_ARRIVAL_ERFOUD = {
  route_id: "em-arrival-erfoud",
  id: "dia-1",
  image: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=2000&q=85",
  accent: "#C16542",
  title: { es: "Casablanca · Errachidia · Erfoud", en: "Casablanca · Errachidia · Erfoud", fr: "Casablanca · Errachidia · Erfoud" },
  body: {
    es: "Salida desde el aeropuerto de origen en dirección a Casablanca, con la posible diferencia horaria según la época del año. Conexión con el vuelo Casablanca – Errachidia. Llegada a Errachidia, trámites de pasaporte y recogida de equipajes. Traslado por carretera hasta Erfoud, conocida como «La Puerta del Desierto». Llegada a Kasbah Hotel Xaluca, un hotel emblemático del sur de Marruecos. Cena y alojamiento.",
    en: "Departure from your home airport towards Casablanca — mind the possible seasonal time difference. Connection with the Casablanca – Errachidia flight. Arrival in Errachidia, passport check and luggage collection. Road transfer to Erfoud, known as «The Gate of the Desert». Arrival at Kasbah Hotel Xaluca, an emblematic hotel of southern Morocco. Dinner and overnight.",
    fr: "Départ de votre aéroport d'origine vers Casablanca — attention au décalage horaire éventuel selon la saison. Correspondance avec le vol Casablanca – Errachidia. Arrivée à Errachidia, formalités de passeport et récupération des bagages. Transfert routier vers Erfoud, « la Porte du Désert ». Arrivée au Kasbah Hotel Xaluca, hôtel emblématique du sud du Maroc. Dîner et nuit.",
  },
  culture: [
    {
      title: { es: "Casablanca y el cambio horario", en: "Casablanca and the time difference", fr: "Casablanca et le décalage horaire" },
      body: {
        es: "Marruecos sigue UTC+1 gran parte del año, pero durante el Ramadán cambia temporalmente a UTC+0. Conviene verificar el huso horario antes del viaje y al llegar para coordinar conexiones.",
        en: "Morocco follows UTC+1 for most of the year, but during Ramadan it temporarily switches to UTC+0. It is wise to check local time before departure and on arrival to coordinate connections.",
        fr: "Le Maroc suit UTC+1 la majeure partie de l'année, mais passe temporairement à UTC+0 pendant le Ramadan. Il convient de vérifier l'heure locale avant le départ et à l'arrivée.",
      },
    },
    {
      title: { es: "Errachidia, puerta del Tafilalet", en: "Errachidia, gateway to the Tafilalet", fr: "Errachidia, porte du Tafilalet" },
      body: {
        es: "Principal acceso aéreo al oasis del Tafilalet y región histórica de la dinastía alauí, la actual familia real marroquí. Su aeropuerto Moulay Ali Cherif fue inicialmente una base militar francesa antes de pasar a uso civil.",
        en: "The main air gateway to the Tafilalet oasis and to the historical region of the Alawi dynasty — Morocco's current royal family. Its Moulay Ali Cherif Airport began life as a French military base before becoming civilian.",
        fr: "Principal accès aérien à l'oasis du Tafilalet et à la région historique de la dynastie alaouite, l'actuelle famille royale marocaine. Son aéroport Moulay Ali Cherif fut d'abord une base militaire française.",
      },
    },
    {
      title: { es: "Erfoud, capital mundial de los fósiles", en: "Erfoud, world capital of fossils", fr: "Erfoud, capitale mondiale des fossiles" },
      body: {
        es: "Ciudad famosa por sus fósiles devónicos de más de 360 millones de años y conocida como «la Puerta del Desierto», puerta de entrada al gran Erg Chebbi y base logística de todas las expediciones al Sahara marroquí.",
        en: "A city famous for its Devonian fossils — more than 360 million years old — and known as «the Gate of the Desert», the gateway to the great Erg Chebbi and logistics hub for every Moroccan Sahara expedition.",
        fr: "Ville célèbre pour ses fossiles dévoniens de plus de 360 millions d'années et connue comme « la Porte du Désert », porte d'entrée du grand Erg Chebbi et base logistique de toutes les expéditions au Sahara marocain.",
      },
    },
  ],
};

export const DAY_EM_AITBEN_MARRAKECH = {
  route_id: "em-aitben-marrakech",
  id: "dia-6",
  image: "https://images.unsplash.com/photo-1597212618440-806262de4f6b?auto=format&fit=crop&w=2000&q=85",
  accent: "#C16542",
  title: { es: "Aït Ben Haddou · Tizi n'Tichka · Marrakech", en: "Aït Ben Haddou · Tizi n'Tichka · Marrakech", fr: "Aït Ben Haddou · Tizi n'Tichka · Marrakech" },
  body: {
    es: "Salida hacia Marrakech atravesando el Alto Atlas. Por el camino visitaremos la Kasbah de Aït Ben Haddou, Patrimonio de la Humanidad y uno de los escenarios cinematográficos más famosos de África. Cruzaremos el Tizi n'Tichka, el puerto de carretera asfaltado más alto de Marruecos, situado a 2.260 metros. Llegada a Marrakech, recogida en el riad u hotel y primera toma de contacto con la Plaza Djemaa el-Fna, Patrimonio Cultural Inmaterial de la UNESCO, especialmente vibrante al caer la noche. Alojamiento en Riad en la Medina u Hotel 5*.",
    en: "Drive to Marrakech across the High Atlas. Along the way, visit the Aït Ben Haddou Kasbah — UNESCO World Heritage and one of the most famous film sets in Africa. We cross the Tizi n'Tichka, Morocco's highest tarmac road pass at 2,260 metres. Arrival in Marrakech, check-in at the riad or hotel and a first encounter with Djemaa el-Fna Square — UNESCO Intangible Cultural Heritage — especially vibrant at nightfall. Overnight at a Riad in the Medina or 5* Hotel.",
    fr: "Route vers Marrakech à travers le Haut Atlas. En chemin, visite de la Kasbah d'Aït Ben Haddou — Patrimoine de l'Humanité et l'un des décors de cinéma les plus célèbres d'Afrique. Franchissement du Tizi n'Tichka, le col routier asphalté le plus haut du Maroc, à 2 260 mètres. Arrivée à Marrakech, accueil au riad ou à l'hôtel et première rencontre avec la place Djemaa el-Fna — Patrimoine Culturel Immatériel de l'UNESCO — particulièrement vibrante à la nuit tombée. Nuit en Riad dans la Médina ou Hôtel 5*.",
  },
  culture: [
    {
      title: { es: "Aït Ben Haddou: ksar milenario y plató de cine", en: "Aït Ben Haddou: ancient ksar and film set", fr: "Aït Ben Haddou : ksar millénaire et plateau de cinéma" },
      body: {
        es: "Patrimonio de la Humanidad desde 1987 y uno de los mejores ejemplos de arquitectura tradicional de adobe del sur marroquí. Ha sido escenario de superproducciones como Gladiator, La Momia, Juego de Tronos o Kingdom of Heaven.",
        en: "UNESCO World Heritage since 1987 and one of the finest examples of traditional southern-Moroccan adobe architecture. It has hosted blockbusters such as Gladiator, The Mummy, Game of Thrones and Kingdom of Heaven.",
        fr: "Patrimoine de l'Humanité depuis 1987 et l'un des plus beaux exemples d'architecture traditionnelle en pisé du sud marocain. Décor de superproductions comme Gladiator, La Momie, Game of Thrones ou Kingdom of Heaven.",
      },
    },
    {
      title: { es: "Tizi n'Tichka: el paso asfaltado más alto de Marruecos", en: "Tizi n'Tichka: Morocco's highest tarmac pass", fr: "Tizi n'Tichka : le col asphalté le plus haut du Maroc" },
      body: {
        es: "Con 2.260 m de altitud, el Tizi n'Tichka conecta Marrakech con el sur. Su ascenso permite ver cómo el paisaje cambia radicalmente: del entorno lunar del lado sur a los bosques y tierras fértiles del valle del Ourika al norte.",
        en: "At 2,260 m, the Tizi n'Tichka links Marrakech with the south. The drive shows how the landscape changes dramatically — from a lunar south side to the forests and fertile fields of the Ourika valley to the north.",
        fr: "Avec 2 260 m d'altitude, le Tizi n'Tichka relie Marrakech au sud. La montée révèle un changement radical de paysage — du versant sud quasi lunaire aux forêts et terres fertiles de la vallée de l'Ourika au nord.",
      },
    },
    {
      title: { es: "Djemaa el-Fna al caer la noche", en: "Djemaa el-Fna at nightfall", fr: "Djemaa el-Fna à la nuit tombée" },
      body: {
        es: "Patrimonio Cultural Inmaterial de la UNESCO y uno de los grandes espacios culturales del Magreb. De noche se transforma en un gran escenario gastronómico y cultural con decenas de puestos de comida y espectáculos espontáneos.",
        en: "UNESCO Intangible Cultural Heritage and one of the great cultural spaces of the Maghreb. At night it transforms into a vast gastronomic and cultural stage with dozens of food stalls and impromptu shows.",
        fr: "Patrimoine Culturel Immatériel de l'UNESCO et l'un des grands espaces culturels du Maghreb. La nuit, elle se transforme en vaste scène gastronomique et culturelle avec des dizaines de stands et de spectacles improvisés.",
      },
    },
  ],
};

export const DAY_EM_MARRAKECH_VISIT = {
  route_id: "em-marrakech-visit",
  id: "dia-7",
  image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=2000&q=85",
  accent: "#A07042",
  title: { es: "Marrakech · medina, Koutoubia y zocos", en: "Marrakech · medina, Koutoubia and souks", fr: "Marrakech · médina, Koutoubia et souks" },
  body: {
    es: "Día dedicado a descubrir Marrakech con visita guiada a pie por la Medina con un guía local. Empezaremos admirando el Alminar de la Koutoubia, gemela de la Giralda de Sevilla, y seguiremos con el Palacio de la Bahía. Recorreremos los zocos tradicionales viendo en acción a tejedores de alfombras, fabricantes de babuchas y una infinita variedad de artesanos. Visita a una farmacia bereber y regreso a Djemaa el-Fna. Tiempo libre para el arte del regateo o para descubrir los rincones más recónditos de la Medina. Traslado al aeropuerto de Marrakech para coger el vuelo de regreso.",
    en: "A full day to discover Marrakech with a guided walking tour of the Medina led by a local guide. We start with the Koutoubia minaret — twin of Seville's Giralda — and continue to the Bahia Palace. We wander the traditional souks watching carpet weavers, babouche makers and a vast range of artisans at work. Visit a Berber pharmacy and return to Djemaa el-Fna. Free time for the art of bargaining or to discover the Medina's hidden corners. Transfer to Marrakech airport for the return flight.",
    fr: "Journée dédiée à la découverte de Marrakech avec visite guidée à pied de la Médina par un guide local. Nous commençons par le minaret de la Koutoubia — jumeau de la Giralda de Séville — puis le Palais de la Bahia. Nous parcourons les souks traditionnels en observant tisserands de tapis, fabricants de babouches et une infinité d'artisans. Visite d'une pharmacie berbère et retour à Djemaa el-Fna. Temps libre pour l'art du marchandage ou pour découvrir les recoins cachés de la Médina. Transfert à l'aéroport de Marrakech pour le vol de retour.",
  },
  culture: [
    {
      title: { es: "La Koutoubia: el alminar que inspiró a la Giralda", en: "Koutoubia: the minaret that inspired the Giralda", fr: "La Koutoubia : le minaret qui inspira la Giralda" },
      body: {
        es: "La Mezquita de la Koutoubia fue construida en el siglo XII por los almohades y su alminar está considerado una obra maestra de la arquitectura islámica. Su diseño sirvió de modelo para la Giralda de Sevilla y la Torre Hassan de Rabat.",
        en: "Built in the 12th century by the Almohads, the Koutoubia minaret is considered a masterpiece of Islamic architecture. Its design served as the model for Seville's Giralda and Rabat's Hassan Tower.",
        fr: "Construite au XIIᵉ siècle par les Almohades, la mosquée de la Koutoubia possède un minaret considéré comme un chef-d'œuvre de l'architecture islamique. Son dessin servit de modèle à la Giralda de Séville et à la Tour Hassan de Rabat.",
      },
    },
    {
      title: { es: "Los zocos de Marrakech", en: "The souks of Marrakech", fr: "Les souks de Marrakech" },
      body: {
        es: "Uno de los mercados artesanales más extensos y antiguos del norte de África, dividido en sectores especializados — curtidores, cesteros, tintoreros, herreros, joyeros — manteniendo viva la tradición de oficios medievales.",
        en: "One of North Africa's largest and oldest artisan markets, divided into specialised quarters — tanners, basket weavers, dyers, blacksmiths, jewellers — keeping medieval crafts alive.",
        fr: "L'un des marchés artisanaux les plus vastes et les plus anciens d'Afrique du Nord, divisé en quartiers spécialisés — tanneurs, vanniers, teinturiers, forgerons, bijoutiers — perpétuant des métiers médiévaux.",
      },
    },
    {
      title: { es: "Djemaa el-Fna", en: "Djemaa el-Fna", fr: "Djemaa el-Fna" },
      body: {
        es: "Patrimonio cultural vivo reconocido por la UNESCO por sus tradiciones orales y espectáculos populares — cuentacuentos, músicos, acróbatas, herbolarios y artistas callejeros que se renuevan cada día.",
        en: "A living cultural heritage recognised by UNESCO for its oral traditions and popular shows — storytellers, musicians, acrobats, herbalists and street artists who renew the square every day.",
        fr: "Patrimoine culturel vivant reconnu par l'UNESCO pour ses traditions orales et spectacles populaires — conteurs, musiciens, acrobates, herboristes et artistes de rue qui renouvellent la place chaque jour.",
      },
    },
  ],
};

export const PROGRAM_EM_67 = {
  routeId: "tourErgMarrakech67",
  duration_key: "em6n7d",
  duration: { es: "6 noches / 7 días", en: "6 nights / 7 days", fr: "6 nuits / 7 jours" },
  prices: { low: 1490, mid: 1790, high: 2090, premium: 2490 },
  reverse: false,
  days: [
    DAY_EM_ARRIVAL_ERFOUD,
    DAY_DESERT_BIVOUAC,
    DAY_KHAMLIA_RISSANI,
    DAY_TODRA_DADES,
    DAY_ATLAS_MGOUN,
    DAY_EM_AITBEN_MARRAKECH,
    DAY_EM_MARRAKECH_VISIT,
  ],
  details: {
    includes: {
      es: [
        "Dos noches en Erfoud en Kasbah Xaluca en media pensión",
        "Una noche en Erg Chebbi en bivouac de lujo en media pensión",
        "Dos noches en Hotel Xaluca Dades en media pensión",
        "Una noche en Marrakech en alojamiento y desayuno (Riad o Hotel 5*)",
        "Picnic en el desierto el día 2",
        "Comida en «Gîte d'Étape» el día 5",
        "Excursión en dromedario en el Erg Chebbi",
        "Vehículo 4x4 con chófer del día 2 al día 6",
        "Visita guiada por la Medina de Marrakech con guía local",
        "Visitas a la Kasbah de Aït Ben Haddou y al Palacio de la Bahía",
        "Transfers de aeropuerto en Errachidia y Marrakech",
        "Combustible",
        "Seguro de asistencia en viaje",
      ],
      en: [
        "Two nights in Erfoud at Kasbah Xaluca, half board",
        "One night in Erg Chebbi at luxury bivouac, half board",
        "Two nights at Hotel Xaluca Dades, half board",
        "One night in Marrakech, bed and breakfast (Riad or 5* Hotel)",
        "Desert picnic on day 2",
        "Lunch at a «Gîte d'Étape» on day 5",
        "Camel ride in the Erg Chebbi",
        "Private 4x4 with driver from day 2 to day 6",
        "Guided walking tour of the Marrakech Medina with local guide",
        "Visits to the Aït Ben Haddou Kasbah and the Bahia Palace",
        "Airport transfers in Errachidia and Marrakech",
        "Fuel",
        "Travel assistance insurance",
      ],
      fr: [
        "Deux nuits à Erfoud au Kasbah Xaluca en demi-pension",
        "Une nuit à l'Erg Chebbi en bivouac de luxe en demi-pension",
        "Deux nuits à l'Hôtel Xaluca Dadès en demi-pension",
        "Une nuit à Marrakech en logement et petit déjeuner (Riad ou Hôtel 5*)",
        "Pique-nique dans le désert le jour 2",
        "Déjeuner en « Gîte d'Étape » le jour 5",
        "Balade à dromadaire à l'Erg Chebbi",
        "Véhicule 4x4 avec chauffeur du jour 2 au jour 6",
        "Visite guidée de la Médina de Marrakech avec guide local",
        "Visites de la Kasbah d'Aït Ben Haddou et du Palais de la Bahia",
        "Transferts aéroport à Errachidia et Marrakech",
        "Carburant",
        "Assurance assistance voyage",
      ],
    },
    excludes: {
      es: [
        "Bebidas",
        "Comidas de mediodía salvo las indicadas",
        "Cenas en Marrakech",
        "Extras personales",
        "Vuelos internacionales",
        "Seguro de cancelación",
      ],
      en: [
        "Drinks",
        "Lunches except where stated",
        "Dinners in Marrakech",
        "Personal extras",
        "International flights",
        "Cancellation insurance",
      ],
      fr: [
        "Boissons",
        "Déjeuners sauf ceux indiqués",
        "Dîners à Marrakech",
        "Extras personnels",
        "Vols internationaux",
        "Assurance annulation",
      ],
    },
    notes: {
      es: [
        "Opciones de vuelos: Royal Air Maroc, Vueling, Air Arabia, Ryanair",
        "Suplemento habitación individual: 380 €",
        "Descuento niños: 290 € en temporada baja · 310 € en temporada alta",
        "Guías compartidos en temporada alta",
        "Chóferes de habla española limitados — consulta disponibilidad",
        "Pasaporte vigente mínimo 3 meses desde la fecha de regreso",
        "Actividades opcionales: Quads 70 € por vehículo · Spa y masajes bajo reserva",
      ],
      en: [
        "Flight options: Royal Air Maroc, Vueling, Air Arabia, Ryanair",
        "Single-room supplement: €380",
        "Child discount: €290 in low season · €310 in high season",
        "Shared guides in high season",
        "Spanish-speaking drivers limited — check availability",
        "Passport valid at least 3 months from the return date",
        "Optional activities: Quads €70 per vehicle · Spa and massages by reservation",
      ],
      fr: [
        "Options de vols : Royal Air Maroc, Vueling, Air Arabia, Ryanair",
        "Supplément chambre individuelle : 380 €",
        "Remise enfant : 290 € basse saison · 310 € haute saison",
        "Guides partagés en haute saison",
        "Chauffeurs hispanophones limités — consultez la disponibilité",
        "Passeport valable au moins 3 mois après la date de retour",
        "Activités en option : Quads 70 € par véhicule · Spa et massages sur réservation",
      ],
    },
    terms: {
      es: [
        "Ficha de inscripción obligatoria",
        "Pago: 30% en el momento de la reserva · 70% restante hasta 30 días antes del viaje",
        "Si el vuelo requiere emisión inmediata: 100% del billete + 30% de los servicios terrestres",
        "Cancelación 45 días antes: 30% de gastos",
        "Cancelación 21 días antes: 100% de gastos",
        "Penalización fija de 50 € por reserva",
        "Los seguros no son reembolsables",
      ],
      en: [
        "Compulsory booking form",
        "Payment: 30% at booking · remaining 70% up to 30 days before the trip",
        "If the flight requires immediate issuance: 100% of the ticket + 30% of land services",
        "Cancellation 45 days before: 30% of costs",
        "Cancellation 21 days before: 100% of costs",
        "Fixed €50 penalty per booking",
        "Insurances are non-refundable",
      ],
      fr: [
        "Fiche d'inscription obligatoire",
        "Paiement : 30 % à la réservation · 70 % restants jusqu'à 30 jours avant le voyage",
        "Si le vol requiert une émission immédiate : 100 % du billet + 30 % des services terrestres",
        "Annulation 45 jours avant : 30 % de frais",
        "Annulation 21 jours avant : 100 % de frais",
        "Pénalité fixe de 50 € par réservation",
        "Les assurances ne sont pas remboursables",
      ],
    },
  },
};


/* ============================================================
   Erg Chebbi → Marrakech · 7 noches / 8 días
   Misma travesía que la 6n/7d pero con día completo extra en
   Marrakech: llegada el día 6 + visita guiada a la Medina el
   día 7 + traslado al aeropuerto el día 8.
============================================================ */

export const DAY_EM78_AITBEN_MARRAKECH = {
  route_id: "em78-aitben-marrakech",
  id: "dia-6",
  image: "https://images.unsplash.com/photo-1597212618440-806262de4f6b?auto=format&fit=crop&w=2000&q=85",
  accent: "#C16542",
  title: { es: "Aït Ben Haddou · Tizi n'Tichka · Marrakech", en: "Aït Ben Haddou · Tizi n'Tichka · Marrakech", fr: "Aït Ben Haddou · Tizi n'Tichka · Marrakech" },
  body: {
    es: "Último día de 4x4 con unos 310 km por delante, recompensados por la espectacularidad del paisaje. Saldremos en dirección Marrakech. Por el camino visitaremos la Kasbah de Aït Ben Haddou, Patrimonio de la Humanidad por la UNESCO y escenario de numerosas producciones cinematográficas. Cruzaremos el Tizi n'Tichka, el puerto de carretera asfaltado más alto del país, dejando atrás el paisaje lunar para dar paso a los verdes y ocres del norte. Llegada a Marrakech por la tarde. Primera toma de contacto con la inigualable Plaza Djemaa el-Fna, que a esta hora se llena de recitadores, adivinadores, malabaristas, danzantes, encantadores de serpientes y, al anochecer, pequeñas paraditas de comida iluminadas al aire libre. Alojamiento en Riad en la Medina u Hotel 5*.",
    en: "Last day in the 4x4 with about 310 km ahead, generously rewarded by the landscape. Drive towards Marrakech. Along the way, visit the Aït Ben Haddou Kasbah — UNESCO World Heritage and the backdrop of countless film productions. We cross the Tizi n'Tichka, Morocco's highest tarmac road pass, leaving the lunar scenery behind as the greens and ochres of the north take over. Arrival in Marrakech in the afternoon. First contact with the unique Djemaa el-Fna Square, which at this hour fills with reciters, fortune-tellers, jugglers, dancers, snake charmers and, at nightfall, small lit-up food stalls in the open air. Overnight in a Riad in the Medina or 5* Hotel.",
    fr: "Dernier jour en 4x4 avec environ 310 km devant nous, largement récompensés par le paysage. Route vers Marrakech. En chemin, visite de la Kasbah d'Aït Ben Haddou — Patrimoine de l'Humanité de l'UNESCO et décor de nombreuses productions cinématographiques. Franchissement du Tizi n'Tichka, col routier asphalté le plus haut du pays — le paysage lunaire laisse place aux verts et ocres du nord. Arrivée à Marrakech dans l'après-midi. Premier contact avec l'incomparable place Djemaa el-Fna, qui à cette heure se remplit de récitants, devins, jongleurs, danseurs, charmeurs de serpents et, à la tombée de la nuit, de petites échoppes de cuisine éclairées en plein air. Nuit en Riad dans la Médina ou Hôtel 5*.",
  },
  culture: [
    {
      title: { es: "Aït Ben Haddou: ksar milenario y plató de cine", en: "Aït Ben Haddou: ancient ksar and film set", fr: "Aït Ben Haddou : ksar millénaire et plateau de cinéma" },
      body: {
        es: "Patrimonio de la Humanidad desde 1987 y uno de los mejores ejemplos de arquitectura tradicional de adobe del sur marroquí. Ha sido escenario de superproducciones como Gladiator, La Momia, Juego de Tronos o Kingdom of Heaven.",
        en: "UNESCO World Heritage since 1987 and one of the finest examples of traditional southern-Moroccan adobe architecture. It has hosted blockbusters such as Gladiator, The Mummy, Game of Thrones and Kingdom of Heaven.",
        fr: "Patrimoine de l'Humanité depuis 1987 et l'un des plus beaux exemples d'architecture traditionnelle en pisé du sud marocain. Décor de superproductions comme Gladiator, La Momie, Game of Thrones ou Kingdom of Heaven.",
      },
    },
    {
      title: { es: "Tizi n'Tichka: el paso asfaltado más alto de Marruecos", en: "Tizi n'Tichka: Morocco's highest tarmac pass", fr: "Tizi n'Tichka : le col asphalté le plus haut du Maroc" },
      body: {
        es: "Con 2.260 m de altitud, el Tizi n'Tichka es el puerto de carretera asfaltado más alto del país. Su ascenso permite ver cómo el paisaje cambia radicalmente: del entorno lunar del lado sur a los bosques y tierras fértiles del valle del Ourika al norte.",
        en: "At 2,260 m, the Tizi n'Tichka is Morocco's highest tarmac mountain pass. The drive shows how the landscape changes dramatically — from the lunar south side to the forests and fertile fields of the Ourika valley to the north.",
        fr: "Avec 2 260 m d'altitude, le Tizi n'Tichka est le col routier asphalté le plus haut du pays. La montée révèle un changement radical de paysage — du versant sud quasi lunaire aux forêts et terres fertiles de la vallée de l'Ourika au nord.",
      },
    },
    {
      title: { es: "Djemaa el-Fna al caer la noche", en: "Djemaa el-Fna at nightfall", fr: "Djemaa el-Fna à la nuit tombée" },
      body: {
        es: "Patrimonio Cultural Inmaterial de la UNESCO. Al anochecer la plaza se transforma en un gran escenario gastronómico y cultural con decenas de paraditas de comida iluminadas al aire libre y espectáculos espontáneos.",
        en: "UNESCO Intangible Cultural Heritage. At nightfall the square transforms into a vast gastronomic and cultural stage with dozens of lit-up open-air food stalls and impromptu shows.",
        fr: "Patrimoine Culturel Immatériel de l'UNESCO. À la tombée de la nuit, la place se transforme en vaste scène gastronomique et culturelle avec des dizaines d'échoppes éclairées en plein air et des spectacles improvisés.",
      },
    },
  ],
};

export const DAY_EM78_MEDINA = {
  route_id: "em78-medina",
  id: "dia-7",
  image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=2000&q=85",
  accent: "#A07042",
  title: { es: "Marrakech · medina, Koutoubia y zocos", en: "Marrakech · medina, Koutoubia and souks", fr: "Marrakech · médina, Koutoubia et souks" },
  body: {
    es: "Día completo dedicado a Marrakech. Visita guiada a pie por la Medina con un guía local. Empezaremos admirando el Alminar de la Koutoubia, gemela de la Giralda de Sevilla, y seguiremos con el Palacio de la Bahía. Nos adentraremos por las callejuelas del zoco donde veremos a diferentes artesanos en acción: tejedores de alfombras, fabricantes de babuchas y una infinita variedad de artesanía de calidad. Visitaremos una farmacia bereber, donde nos enseñarán sus «secretillos». Saldremos nuevamente a la Plaza Djemaa el-Fna, cuyo ambiente diurno es totalmente distinto al nocturno. Por la tarde, tiempo libre para practicar el arte del regateo o descubrir los rincones más recónditos de la Medina por nuestra cuenta. Alojamiento en Riad en la Medina u Hotel 5*.",
    en: "A full day in Marrakech. Guided walking tour of the Medina with a local guide. We start at the Koutoubia minaret — twin of Seville's Giralda — and continue to the Bahia Palace. We dive into the alleys of the souk to watch different artisans at work: carpet weavers, babouche makers and a vast range of quality crafts. We visit a Berber pharmacy where they share their «little secrets». We return to Djemaa el-Fna Square, whose daytime atmosphere is completely different from the night. Free afternoon to practise the art of bargaining or to discover the Medina's hidden corners on your own. Overnight in a Riad in the Medina or 5* Hotel.",
    fr: "Journée complète dédiée à Marrakech. Visite guidée à pied de la Médina avec un guide local. Nous commençons par le minaret de la Koutoubia — jumeau de la Giralda de Séville — puis le Palais de la Bahia. Nous nous enfonçons dans les ruelles du souk pour observer différents artisans à l'œuvre : tisserands de tapis, fabricants de babouches et une infinité d'artisanat de qualité. Visite d'une pharmacie berbère, où l'on partage ses « petits secrets ». Retour à la place Djemaa el-Fna, dont l'ambiance diurne est totalement différente de celle de la nuit. Après-midi libre pour pratiquer l'art du marchandage ou découvrir les recoins cachés de la Médina à votre rythme. Nuit en Riad dans la Médina ou Hôtel 5*.",
  },
  culture: [
    {
      title: { es: "La Koutoubia: el alminar que inspiró a la Giralda", en: "Koutoubia: the minaret that inspired the Giralda", fr: "La Koutoubia : le minaret qui inspira la Giralda" },
      body: {
        es: "La Mezquita de la Koutoubia fue construida en el siglo XII por los almohades y su alminar está considerado una obra maestra de la arquitectura islámica. Su diseño sirvió de modelo para la Giralda de Sevilla y la Torre Hassan de Rabat.",
        en: "Built in the 12th century by the Almohads, the Koutoubia minaret is considered a masterpiece of Islamic architecture. Its design served as the model for Seville's Giralda and Rabat's Hassan Tower.",
        fr: "Construite au XIIᵉ siècle par les Almohades, la mosquée de la Koutoubia possède un minaret considéré comme un chef-d'œuvre de l'architecture islamique. Son dessin servit de modèle à la Giralda de Séville et à la Tour Hassan de Rabat.",
      },
    },
    {
      title: { es: "Los zocos y la artesanía", en: "The souks and the crafts", fr: "Les souks et l'artisanat" },
      body: {
        es: "Uno de los mercados artesanales más extensos del norte de África, dividido en sectores especializados — curtidores, cesteros, tintoreros, herreros, joyeros — manteniendo viva la tradición de oficios medievales.",
        en: "One of North Africa's largest artisan markets, divided into specialised quarters — tanners, basket weavers, dyers, blacksmiths, jewellers — keeping medieval crafts alive.",
        fr: "L'un des plus vastes marchés artisanaux d'Afrique du Nord, divisé en quartiers spécialisés — tanneurs, vanniers, teinturiers, forgerons, bijoutiers — perpétuant des métiers médiévaux.",
      },
    },
    {
      title: { es: "La farmacia bereber", en: "The Berber pharmacy", fr: "La pharmacie berbère" },
      body: {
        es: "Las farmacias bereberes mantienen una tradición ancestral de herboristería del Atlas: aceite de argán, ghassoul, nigella, azahar y decenas de plantas usadas para cuidar piel, cabello, digestiones y dolencias menores.",
        en: "Berber pharmacies maintain an ancestral Atlas herbalism tradition: argan oil, ghassoul clay, nigella, orange blossom and dozens of plants used for skin, hair, digestion and minor ailments.",
        fr: "Les pharmacies berbères perpétuent une tradition ancestrale d'herboristerie de l'Atlas : huile d'argan, ghassoul, nigelle, fleur d'oranger et des dizaines de plantes utilisées pour la peau, les cheveux, la digestion et les maux mineurs.",
      },
    },
  ],
};

export const DAY_EM78_DEPARTURE = {
  route_id: "em78-departure",
  id: "dia-8",
  image: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=2000&q=85",
  accent: "#5A6B4F",
  title: { es: "Marrakech · regreso", en: "Marrakech · return", fr: "Marrakech · retour" },
  body: {
    es: "A la hora convenida, traslado al aeropuerto de Marrakech para coger el vuelo de regreso al punto de origen, llevándonos con nosotros los aromas, los colores y la calidez de la hospitalidad marroquí.",
    en: "At the agreed time, transfer to Marrakech airport for the return flight home, carrying with us the aromas, colours and warmth of Moroccan hospitality.",
    fr: "À l'heure convenue, transfert à l'aéroport de Marrakech pour le vol de retour, emportant avec nous les arômes, les couleurs et la chaleur de l'hospitalité marocaine.",
  },
  culture: [
    {
      title: { es: "Aeropuerto Menara de Marrakech", en: "Marrakech Menara airport", fr: "Aéroport Menara de Marrakech" },
      body: {
        es: "Inaugurado en su forma moderna en 2008, el aeropuerto Menara es una de las grandes puertas de entrada de Marruecos y un referente arquitectónico por su celosía geométrica inspirada en el zellige tradicional.",
        en: "Opened in its modern form in 2008, Menara airport is one of Morocco's main gateways and an architectural landmark thanks to its geometric lattice façade inspired by traditional zellige.",
        fr: "Inauguré dans sa forme moderne en 2008, l'aéroport Menara est l'une des grandes portes d'entrée du Maroc et une référence architecturale grâce à sa façade en moucharabieh inspirée du zellige traditionnel.",
      },
    },
    {
      title: { es: "Una despedida con sabor", en: "A flavoured farewell", fr: "Un adieu plein de saveurs" },
      body: {
        es: "Antes del vuelo, conviene reservar tiempo para llevarnos a casa los últimos souvenirs gastronómicos: dátiles medjoul, té verde, especias, aceite de argán o agua de azahar son las despedidas más auténticas de Marruecos.",
        en: "Before the flight, leave time to take home the last edible souvenirs: Medjool dates, green tea, spices, argan oil or orange-blossom water are Morocco's most authentic farewells.",
        fr: "Avant le vol, prévoyez du temps pour emporter les derniers souvenirs gastronomiques : dattes medjoul, thé vert, épices, huile d'argan ou eau de fleur d'oranger — les adieux les plus authentiques du Maroc.",
      },
    },
    {
      title: { es: "Volver siempre es una buena idea", en: "Coming back is always a good idea", fr: "Revenir est toujours une bonne idée" },
      body: {
        es: "Marruecos es un país de viajes que se repiten. Cada región — el Sahara, el Atlas, las medinas, el Atlántico — pide su propio viaje. Quien lo descubre, vuelve.",
        en: "Morocco is a country of repeat journeys. Each region — Sahara, Atlas, medinas, Atlantic coast — calls for its own trip. Those who discover it, come back.",
        fr: "Le Maroc est un pays de voyages que l'on répète. Chaque région — Sahara, Atlas, médinas, côte atlantique — appelle son propre voyage. Ceux qui le découvrent reviennent.",
      },
    },
  ],
};

export const PROGRAM_EM_78 = {
  routeId: "tourErgMarrakech78",
  duration_key: "em7n8d",
  duration: { es: "7 noches / 8 días", en: "7 nights / 8 days", fr: "7 nuits / 8 jours" },
  prices: { low: 1690, mid: 1990, high: 2390, premium: 2790 },
  reverse: false,
  days: [
    DAY_EM_ARRIVAL_ERFOUD,
    DAY_DESERT_BIVOUAC,
    DAY_KHAMLIA_RISSANI,
    DAY_TODRA_DADES,
    DAY_ATLAS_MGOUN,
    DAY_EM78_AITBEN_MARRAKECH,
    DAY_EM78_MEDINA,
    DAY_EM78_DEPARTURE,
  ],
  details: {
    includes: {
      es: [
        "Dos noches en Erfoud en Kasbah Xaluca en régimen de media pensión",
        "Una noche en Erg Chebbi en bivouac de lujo en régimen de media pensión",
        "Dos noches en Boumalne Dades en Hotel Xaluca Dades 4* en régimen de media pensión",
        "Dos noches en Marrakech en Riad en la Medina u Hotel 5* en régimen de alojamiento y desayuno",
        "Comida «picnic» en el Desierto el día 2",
        "Comida en una «Gîte d'Étape» en la montaña el día 5",
        "Excursión en dromedario en el Erg Chebbi",
        "Vehículo 4x4 con chófer del día 2 al día 6 (ambos incluidos)",
        "Visita guiada por la Medina de Marrakech con guía local",
        "Visitas a la Kasbah de Aït Ben Haddou y al Palacio de la Bahía",
        "Transfers de aeropuerto en Errachidia y Marrakech",
        "Combustible de los vehículos",
        "Seguro de asistencia en viaje",
      ],
      en: [
        "Two nights in Erfoud at Kasbah Xaluca, half board",
        "One night in Erg Chebbi at a luxury bivouac, half board",
        "Two nights at Hotel Xaluca Dades 4*, half board",
        "Two nights in Marrakech in a Riad in the Medina or 5* Hotel, bed and breakfast",
        "Desert «picnic» on day 2",
        "Mountain lunch at a «Gîte d'Étape» on day 5",
        "Camel ride in the Erg Chebbi",
        "Private 4x4 with driver from day 2 to day 6 (both included)",
        "Guided walking tour of the Marrakech Medina with local guide",
        "Visits to the Aït Ben Haddou Kasbah and the Bahia Palace",
        "Airport transfers in Errachidia and Marrakech",
        "Vehicle fuel",
        "Travel assistance insurance",
      ],
      fr: [
        "Deux nuits à Erfoud au Kasbah Xaluca en demi-pension",
        "Une nuit à l'Erg Chebbi en bivouac de luxe en demi-pension",
        "Deux nuits à Boumalne Dadès à l'Hôtel Xaluca Dadès 4* en demi-pension",
        "Deux nuits à Marrakech en Riad dans la Médina ou Hôtel 5* en logement et petit déjeuner",
        "Déjeuner « pique-nique » dans le désert le jour 2",
        "Déjeuner en « Gîte d'Étape » en montagne le jour 5",
        "Balade à dromadaire à l'Erg Chebbi",
        "Véhicule 4x4 avec chauffeur du jour 2 au jour 6 (les deux inclus)",
        "Visite guidée de la Médina de Marrakech avec guide local",
        "Visites de la Kasbah d'Aït Ben Haddou et du Palais de la Bahia",
        "Transferts aéroport à Errachidia et Marrakech",
        "Carburant des véhicules",
        "Assurance assistance voyage",
      ],
    },
    excludes: {
      es: [
        "Bebidas",
        "Comidas de mediodía salvo las indicadas",
        "Cenas en Marrakech",
        "Extras personales (quads, masajes, etc.)",
        "Vuelos internacionales",
        "Suplemento opcional para añadir cancelación al seguro",
      ],
      en: [
        "Drinks",
        "Lunches except where stated",
        "Dinners in Marrakech",
        "Personal extras (quads, massages, etc.)",
        "International flights",
        "Optional supplement to add cancellation to the insurance",
      ],
      fr: [
        "Boissons",
        "Déjeuners sauf ceux indiqués",
        "Dîners à Marrakech",
        "Extras personnels (quads, massages, etc.)",
        "Vols internationaux",
        "Supplément en option pour ajouter l'annulation à l'assurance",
      ],
    },
    notes: {
      es: [
        "Opciones de vuelos: Royal Air Maroc, Vueling, Air Arabia, Ryanair",
        "Tarifas calculadas según la ocupación del 4x4; el coste se reparte entre los ocupantes",
        "Habitaciones dobles y triples · Suplemento individual 495 €",
        "Descuento niños 3-11 años compartiendo habitación con dos adultos: 300 € baja · 315 € alta",
        "En caso de alta ocupación se propondrán alojamientos alternativos con previo aviso",
        "Guías compartidos en temporada alta · chóferes de habla española limitados",
        "Pasaporte vigente mínimo 3 meses desde la fecha de regreso",
        "Quads opcionales 70 € por vehículo (circuito 1h) · Spa y masajes en recepción del hotel",
        "El mercado de Rissani se celebra martes, jueves y domingos",
      ],
      en: [
        "Flight options: Royal Air Maroc, Vueling, Air Arabia, Ryanair",
        "Rates calculated based on 4x4 occupancy; cost is split between occupants",
        "Double and triple rooms · Single supplement €495",
        "Children 3-11 sharing room with two adults: €300 low season · €315 high season",
        "During high-occupancy dates, alternative accommodation may be proposed in advance",
        "Shared guides in high season · Spanish-speaking drivers limited",
        "Passport valid at least 3 months from the return date",
        "Optional quads €70 per vehicle (1h circuit) · Spa and massages at hotel reception",
        "Rissani market runs Tuesday, Thursday and Sunday",
      ],
      fr: [
        "Options de vols : Royal Air Maroc, Vueling, Air Arabia, Ryanair",
        "Tarifs calculés selon l'occupation du 4x4 ; le coût est partagé entre les occupants",
        "Chambres doubles et triples · Supplément individuel 495 €",
        "Remise enfants 3-11 ans en chambre partagée avec deux adultes : 300 € basse · 315 € haute",
        "En cas de forte occupation, des alternatives d'hébergement seront proposées au préalable",
        "Guides partagés en haute saison · chauffeurs hispanophones limités",
        "Passeport valable au moins 3 mois après la date de retour",
        "Quads en option 70 € par véhicule (circuit 1h) · Spa et massages à la réception",
        "Le marché de Rissani a lieu mardi, jeudi et dimanche",
      ],
    },
    terms: {
      es: [
        "Ficha de inscripción obligatoria (pasaporte se puede enviar más adelante)",
        "Pago por transferencia bancaria o tarjeta Visa",
        "30% del importe total en el momento de la reserva · 70% restante hasta 30 días antes",
        "Si el vuelo requiere emisión inmediata: 100% del billete + 30% de los servicios terrestres",
        "Cancelación 45 días antes: 30% de gastos",
        "Cancelación 21 días antes: 100% de gastos",
        "Penalización fija de 50 € por reserva como gastos de gestión",
        "Las condiciones cubren los servicios terrestres; los vuelos se rigen por la política de cada aerolínea",
        "Los seguros no se reembolsan",
        "Seguro de cancelación opcional: 30 € por persona para viajes de hasta 10 días, contratable solo en la confirmación",
      ],
      en: [
        "Compulsory booking form (passport may be sent later)",
        "Payment by bank transfer or Visa card",
        "30% of total at booking · remaining 70% up to 30 days before departure",
        "If the flight requires immediate issuance: 100% of the ticket + 30% of land services",
        "Cancellation 45 days before: 30% of costs",
        "Cancellation 21 days before: 100% of costs",
        "Fixed €50 penalty per booking as administrative fee",
        "Conditions cover land services; flights are governed by each airline's policy",
        "Insurances are non-refundable",
        "Optional cancellation insurance: €30 per person for trips up to 10 days, only at confirmation time",
      ],
      fr: [
        "Fiche d'inscription obligatoire (le passeport peut être envoyé plus tard)",
        "Paiement par virement bancaire ou carte Visa",
        "30 % du total à la réservation · 70 % restants jusqu'à 30 jours avant le départ",
        "Si le vol requiert une émission immédiate : 100 % du billet + 30 % des services terrestres",
        "Annulation 45 jours avant : 30 % de frais",
        "Annulation 21 jours avant : 100 % de frais",
        "Pénalité fixe de 50 € par réservation au titre des frais de gestion",
        "Les conditions couvrent les services terrestres ; les vols suivent la politique de chaque compagnie",
        "Les assurances ne sont pas remboursables",
        "Assurance annulation en option : 30 € par personne pour les voyages jusqu'à 10 jours, à souscrire uniquement à la confirmation",
      ],
    },
  },
};

/* ============================================================
   Marrakech → Erg Chebbi → Marrakech · 2 noches / 3 días
   Escapada exprés circular: salida y regreso a Marrakech, una
   noche en Boumalne Dades + una noche en bivouac en el Erg
   Chebbi.
============================================================ */

export const DAY_MEM23_ATLAS_DADES = {
  route_id: "mem23-atlas-dades",
  id: "dia-1",
  image: "https://images.unsplash.com/photo-1597212618440-806262de4f6b?auto=format&fit=crop&w=2000&q=85",
  accent: "#C16542",
  title: { es: "Marrakech · Tizi n'Tichka · Aït Ben Haddou · Boumalne Dades", en: "Marrakech · Tizi n'Tichka · Aït Ben Haddou · Boumalne Dades", fr: "Marrakech · Tizi n'Tichka · Aït Ben Haddou · Boumalne Dadès" },
  body: {
    es: "Recogida a las 09:30 h en el lugar indicado de Marrakech y salida en un vehículo 4x4 con chófer hacia el Alto Atlas Central. Por delante tenemos unos cuantos kilómetros, recompensados por la espectacularidad de los paisajes. Cruzaremos el Tizi n'Tichka, el puerto de montaña más alto del país (2.260 m), dejando atrás los colores verdes y ocres para adentrarnos en un paisaje lunar. Por el camino visitaremos la Kasbah de Aït Ben Haddou, Patrimonio de la Humanidad por la UNESCO y escenario de innumerables producciones cinematográficas. Pasaremos por Ouarzazate y seguiremos por el Valle de las Rosas hasta llegar a Boumalne Dades, a 1.612 m de altitud en el Valle de los Pájaros. Alojamiento y cena en el Hotel Xaluca Dades 4*.",
    en: "Pick-up at 09:30 from the agreed point in Marrakech and departure in a 4x4 with driver towards the Central High Atlas. A few kilometres lie ahead, generously rewarded by the landscape. We cross the Tizi n'Tichka — Morocco's highest tarmac mountain pass at 2,260 m — leaving the greens and ochres behind to enter a lunar landscape. Along the way we visit the Aït Ben Haddou Kasbah, UNESCO World Heritage and backdrop of countless film productions. We pass through Ouarzazate and continue along the Valley of the Roses to Boumalne Dades, at 1,612 m in the Valley of the Birds. Dinner and overnight at Hotel Xaluca Dades 4*.",
    fr: "Prise en charge à 09h30 au point convenu à Marrakech et départ en 4x4 avec chauffeur vers le Haut Atlas Central. Quelques kilomètres nous attendent, largement récompensés par le paysage. Franchissement du Tizi n'Tichka, le col routier asphalté le plus haut du pays (2 260 m), où les verts et ocres laissent place à un paysage lunaire. En chemin, visite de la Kasbah d'Aït Ben Haddou, Patrimoine de l'Humanité de l'UNESCO et décor d'innombrables productions cinématographiques. Passage par Ouarzazate et remontée de la Vallée des Roses jusqu'à Boumalne Dadès, à 1 612 m d'altitude dans la Vallée des Oiseaux. Dîner et nuit à l'Hôtel Xaluca Dadès 4*.",
  },
  culture: [
    {
      title: { es: "Tizi n'Tichka: el paso asfaltado más alto de Marruecos", en: "Tizi n'Tichka: Morocco's highest tarmac pass", fr: "Tizi n'Tichka : le col asphalté le plus haut du Maroc" },
      body: {
        es: "Con 2.260 m de altitud, el Tizi n'Tichka es el puerto de carretera asfaltado más alto del país. Su ascenso permite ver cómo el paisaje cambia radicalmente: de los bosques y tierras fértiles del norte al entorno casi lunar del sur del Atlas.",
        en: "At 2,260 m, the Tizi n'Tichka is Morocco's highest tarmac mountain pass. The drive shows how the landscape changes dramatically — from the green, fertile north to the near-lunar south side of the Atlas.",
        fr: "Avec 2 260 m d'altitude, le Tizi n'Tichka est le col routier asphalté le plus haut du Maroc. La montée révèle un changement radical de paysage, du nord verdoyant au versant sud quasi lunaire.",
      },
    },
    {
      title: { es: "Aït Ben Haddou: ksar milenario y plató de cine", en: "Aït Ben Haddou: ancient ksar and film set", fr: "Aït Ben Haddou : ksar millénaire et plateau de cinéma" },
      body: {
        es: "Patrimonio de la Humanidad desde 1987 y uno de los mejores ejemplos de arquitectura tradicional de adobe del sur marroquí. Ha sido escenario de superproducciones como Gladiator, La Momia, Juego de Tronos o Kingdom of Heaven.",
        en: "UNESCO World Heritage since 1987 and one of the finest examples of traditional southern-Moroccan adobe architecture. It has hosted blockbusters like Gladiator, The Mummy, Game of Thrones and Kingdom of Heaven.",
        fr: "Patrimoine de l'Humanité depuis 1987 et l'un des plus beaux exemples d'architecture traditionnelle en pisé du sud marocain. Décor de superproductions comme Gladiator, La Momie, Game of Thrones ou Kingdom of Heaven.",
      },
    },
    {
      title: { es: "Boumalne Dades, en el Valle de los Pájaros", en: "Boumalne Dades, in the Valley of the Birds", fr: "Boumalne Dadès, dans la Vallée des Oiseaux" },
      body: {
        es: "Población situada a 1.612 m de altitud en plena Cordillera del Alto Atlas. Punto estratégico entre oasis, kasbahs y pueblos bereberes, y entrada natural al espectacular Valle del Dadès.",
        en: "Town set at 1,612 m in the heart of the High Atlas range. A strategic point between oases, kasbahs and Berber villages, and the natural gateway to the spectacular Dades Valley.",
        fr: "Bourg situé à 1 612 m d'altitude au cœur du Haut Atlas. Point stratégique entre oasis, kasbahs et villages berbères, porte d'entrée naturelle de la spectaculaire Vallée du Dadès.",
      },
    },
  ],
};

export const DAY_MEM23_TODRA_BIVOUAC = {
  route_id: "mem23-todra-bivouac",
  id: "dia-2",
  image: "https://images.unsplash.com/photo-1542401886-65d6c61db217?auto=format&fit=crop&w=2000&q=85",
  accent: "#D97742",
  title: { es: "Tinerhir · Todra · Erg Chebbi · Bivouac", en: "Tinerhir · Todra · Erg Chebbi · Bivouac", fr: "Tinerhir · Todra · Erg Chebbi · Bivouac" },
  body: {
    es: "Salida temprano en dirección a Tinerhir, pequeña y próspera población que ofrece una bella panorámica de contrastes con sus casas rosas y palmerales, punto de partida ideal para adentrarnos en las famosas Gargantas del Todra, donde podremos caminar siguiendo el curso del río. Dejaremos atrás las montañas y seguiremos hasta Erfoud, donde cogeremos pista para vivir un día de Desierto Total. Recorreremos una de las pistas del Rally Dakar visitando poblados y nómadas, parada en las Canteras de Fósiles Marinos (360 millones de años) y picnic en un auténtico oasis. Continuaremos hasta el Gran Erg Chebbi, donde cambiaremos el 4x4 por dromedarios para entrar en el corazón de las dunas y contemplar una puesta de sol inolvidable. Llegada al Bivouac, alojamiento en haimas como las de los nómadas. Cena y noche bajo las estrellas.",
    en: "Early departure towards Tinerhir, a small and prosperous town with pink houses and palm groves — the ideal starting point to enter the famous Todra Gorges, where we walk along the riverbed. Leaving the mountains behind, we continue to Erfoud, where we take the desert track for a day of Total Desert. We follow one of the Dakar Rally tracks visiting villages and nomads, stop at the Marine Fossil Quarries (360 million years old) and picnic at a real oasis. We continue to the great Erg Chebbi, where we swap the 4x4 for camels and ride into the heart of the dunes for an unforgettable sunset. Arrival at the bivouac, accommodation in nomad-style jaimas. Dinner and overnight under the stars.",
    fr: "Départ matinal vers Tinerhir, petite ville prospère aux maisons roses et palmeraies — point de départ idéal pour les célèbres Gorges du Todra, où nous marchons en suivant le cours de la rivière. En quittant les montagnes, nous continuons vers Erfoud, où nous prenons la piste pour une journée de Désert Total. Nous suivons l'une des pistes du Rallye Dakar à la rencontre de villages et nomades, halte aux Carrières de Fossiles Marins (360 millions d'années) et pique-nique dans une véritable oasis. Continuation vers le grand Erg Chebbi, où nous échangeons le 4x4 contre des dromadaires pour pénétrer au cœur des dunes et admirer un coucher de soleil inoubliable. Arrivée au bivouac, hébergement en jaimas comme celles des nomades. Dîner et nuit sous les étoiles.",
  },
  culture: [
    {
      title: { es: "Gargantas del Todra", en: "The Todra Gorges", fr: "Les Gorges du Todra" },
      body: {
        es: "Uno de los desfiladeros más espectaculares del sureste marroquí, con paredes que en su tramo más estrecho alcanzan 160 metros de altura. El río Todra esculpió estas paredes durante millones de años — meca mundial de la escalada.",
        en: "One of south-east Morocco's most spectacular canyons, with walls up to 160 metres high at their narrowest point. The Todra river sculpted these walls over millions of years and is a world-class climbing destination.",
        fr: "L'un des canyons les plus spectaculaires du sud-est marocain, avec des parois pouvant atteindre 160 mètres dans la partie la plus étroite. La rivière Todra a sculpté ces parois pendant des millions d'années — destination mondiale de l'escalade.",
      },
    },
    {
      title: { es: "Las pistas históricas del Rally Dakar", en: "The historic Dakar Rally tracks", fr: "Les pistes historiques du Rallye Dakar" },
      body: {
        es: "Entre Erfoud y el Erg Chebbi existen varias pistas usadas por el Rally Dakar en las ediciones marroquíes (hasta 2007). Cruzan hamadas y oueds secos, convirtiéndolas en rutas icónicas para 4x4 y motos de aventura.",
        en: "Between Erfoud and the Erg Chebbi, several tracks were used by the Dakar Rally during its Moroccan editions (until 2007). They cross hamadas and dry wadis, making them iconic routes for 4x4 and adventure motorbikes.",
        fr: "Entre Erfoud et l'Erg Chebbi, plusieurs pistes ont été utilisées par le Rallye Dakar lors des éditions marocaines (jusqu'en 2007). Elles traversent hamadas et oueds secs, devenues mythiques pour 4x4 et motos d'aventure.",
      },
    },
    {
      title: { es: "Erg Chebbi: dormir bajo las estrellas", en: "Erg Chebbi: sleeping under the stars", fr: "Erg Chebbi : dormir sous les étoiles" },
      body: {
        es: "Uno de los dos grandes ergs del desierto marroquí, sus dunas pueden alcanzar hasta 150 metros de altura. La pureza atmosférica y la ausencia de contaminación lumínica lo convierten en uno de los mejores cielos estrellados del norte de África.",
        en: "One of the two great ergs of the Moroccan desert, with dunes reaching up to 150 metres. The atmospheric clarity and absence of light pollution make it one of the best starry skies in North Africa.",
        fr: "L'un des deux grands ergs du désert marocain, ses dunes atteignent 150 mètres. La pureté atmosphérique et l'absence de pollution lumineuse en font l'un des plus beaux ciels étoilés d'Afrique du Nord.",
      },
    },
  ],
};

export const DAY_MEM23_RETURN_MARRAKECH = {
  route_id: "mem23-return-marrakech",
  id: "dia-3",
  image: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=2000&q=85",
  accent: "#A07042",
  title: { es: "Amanecer · Merdani · Alnif · Regreso a Marrakech", en: "Sunrise · Merdani · Alnif · Return to Marrakech", fr: "Lever du soleil · Merdani · Alnif · Retour à Marrakech" },
  body: {
    es: "«Cita con el Amanecer». Recomendable madrugar para caminar hasta lo más alto de las dunas y contemplar la salida del sol. Desayuno beduino y regreso al coche, que nos llevará a rodear el Erg hasta el pueblo abandonado de Merdani. Emprenderemos el camino de regreso a Marrakech pasando por la localidad de Alnif y disfrutando de una gran variedad de paisajes. Será un día de traslado largo pero escénico. Llegada a Marrakech y fin de nuestros servicios.",
    en: "«A date with the Sunrise». We recommend an early walk to the top of the dunes for sunrise. Bedouin breakfast and back to the vehicle for a drive around the Erg to the abandoned village of Merdani. We set off back to Marrakech via Alnif, enjoying a wide variety of landscapes. A long but scenic transfer day. Arrival in Marrakech and end of our services.",
    fr: "« Rendez-vous avec l'aube ». Il est recommandé de se lever tôt pour monter au sommet des dunes admirer le lever du soleil. Petit déjeuner bédouin puis retour au véhicule, qui nous fait contourner l'Erg jusqu'au village abandonné de Merdani. Nous prenons le chemin du retour vers Marrakech en passant par Alnif, profitant d'une grande variété de paysages. Journée de transfert longue mais scénique. Arrivée à Marrakech et fin de nos services.",
  },
  culture: [
    {
      title: { es: "Merdani: el pueblo abandonado", en: "Merdani: the abandoned village", fr: "Merdani : le village abandonné" },
      body: {
        es: "Antiguo poblado minero hoy parcialmente abandonado, junto a las minas de M'Fis. Una parada fotográfica imprescindible para entender la vida en los confines del Sahara y la historia del kohl, el plomo y el cobre extraídos en la región.",
        en: "An old mining village, today partly abandoned, next to the M'Fis mines. A must-stop for photographers — and a window into life on the edge of the Sahara and the regional history of kohl, lead and copper mining.",
        fr: "Ancien village minier aujourd'hui partiellement abandonné, près des mines de M'Fis. Une halte photo incontournable et une fenêtre sur la vie aux confins du Sahara et l'histoire du kohl, du plomb et du cuivre extraits dans la région.",
      },
    },
    {
      title: { es: "Alnif y la ruta de los fósiles", en: "Alnif and the fossil road", fr: "Alnif et la route des fossiles" },
      body: {
        es: "Pequeña localidad bereber del Anti-Atlas conocida internacionalmente por sus yacimientos de trilobites del periodo Devónico, algunos de los más completos del mundo. Es punto de paso obligado en la travesía desde el desierto al Atlas.",
        en: "A small Berber town in the Anti-Atlas, internationally known for its Devonian trilobite deposits — among the most complete in the world. A mandatory stop on the crossing from the desert to the Atlas.",
        fr: "Petite ville berbère de l'Anti-Atlas, mondialement connue pour ses gisements de trilobites du Dévonien — parmi les plus complets au monde. Halte obligée sur la traversée du désert vers l'Atlas.",
      },
    },
    {
      title: { es: "Volver a Marrakech con el desierto a cuestas", en: "Returning to Marrakech with the desert in your bones", fr: "Revenir à Marrakech avec le désert dans les os" },
      body: {
        es: "La travesía de regreso ofrece una variedad de paisajes única: del Sahara al Anti-Atlas, valles de palmeras y, finalmente, el llano del Haouz. Una despedida en movimiento del sur de Marruecos hasta el bullicio de Djemaa el-Fna.",
        en: "The return crossing offers a unique variety of landscapes — from the Sahara to the Anti-Atlas, palm valleys, and finally the Haouz plain. A moving farewell to southern Morocco all the way back to the buzz of Djemaa el-Fna.",
        fr: "Le retour offre une variété unique de paysages — du Sahara à l'Anti-Atlas, vallées de palmiers, puis la plaine du Haouz. Un adieu en mouvement au sud du Maroc jusqu'à l'effervescence de Djemaa el-Fna.",
      },
    },
  ],
};

export const PROGRAM_MEM_23 = {
  routeId: "tourMarrakechLoop23",
  duration_key: "mem2n3d",
  duration: { es: "2 noches / 3 días", en: "2 nights / 3 days", fr: "2 nuits / 3 jours" },
  prices: { low: 590, mid: 690, high: 790, premium: 950 },
  reverse: false,
  days: [
    DAY_MEM23_ATLAS_DADES,
    DAY_MEM23_TODRA_BIVOUAC,
    DAY_MEM23_RETURN_MARRAKECH,
  ],
  details: {
    includes: {
      es: [
        "Una noche en Boumalne Dades en Hotel Xaluca Dades 4* en régimen de media pensión",
        "Una noche en Erg Chebbi en bivouac de lujo en régimen de media pensión",
        "Comida «picnic» en el desierto el día 2",
        "Excursión en dromedario en el Erg Chebbi",
        "Vehículo 4x4 con chófer todos los días del itinerario",
        "Visita a la Kasbah de Aït Ben Haddou",
        "Combustible del vehículo",
        "Seguro de asistencia en viaje",
      ],
      en: [
        "One night in Boumalne Dades at Hotel Xaluca Dades 4*, half board",
        "One night in Erg Chebbi at a luxury bivouac, half board",
        "Desert «picnic» on day 2",
        "Camel ride in the Erg Chebbi",
        "Private 4x4 with driver every day of the itinerary",
        "Visit to the Aït Ben Haddou Kasbah",
        "Vehicle fuel",
        "Travel assistance insurance",
      ],
      fr: [
        "Une nuit à Boumalne Dadès à l'Hôtel Xaluca Dadès 4* en demi-pension",
        "Une nuit à l'Erg Chebbi en bivouac de luxe en demi-pension",
        "Déjeuner « pique-nique » dans le désert le jour 2",
        "Balade à dromadaire à l'Erg Chebbi",
        "Véhicule 4x4 avec chauffeur tous les jours de l'itinéraire",
        "Visite de la Kasbah d'Aït Ben Haddou",
        "Carburant du véhicule",
        "Assurance assistance voyage",
      ],
    },
    excludes: {
      es: [
        "Bebidas",
        "Comidas de mediodía salvo la indicada",
        "Extras personales (quads, masajes, etc.)",
        "Vuelos",
        "Suplemento opcional para añadir cancelación al seguro",
      ],
      en: [
        "Drinks",
        "Lunches except the one stated",
        "Personal extras (quads, massages, etc.)",
        "Flights",
        "Optional supplement to add cancellation to the insurance",
      ],
      fr: [
        "Boissons",
        "Déjeuners sauf celui indiqué",
        "Extras personnels (quads, massages, etc.)",
        "Vols",
        "Supplément en option pour ajouter l'annulation à l'assurance",
      ],
    },
    notes: {
      es: [
        "Opciones de vuelos: Vueling, Ryanair y otras compañías de bajo coste con vuelos directos a Marrakech",
        "Tarifas calculadas según ocupación del vehículo (4x4 o minibús); el coste se reparte entre los ocupantes",
        "Precios basados en habitaciones dobles y triples · Suplemento individual 130 €",
        "Descuento niños 3-11 años compartiendo habitación con dos adultos: 140 € baja · 150 € alta",
        "Chóferes de habla española limitados, sobre todo en temporada alta — se recomienda reservar con antelación",
        "Los guías titulados están reservados para las medinas, no para las rutas",
        "Pasaporte vigente mínimo 6 meses para viajar a Marruecos",
        "Salida en quads opcional: 90 € por vehículo (circuito de 2 horas)",
        "Seguro de cancelación opcional: 45 € por persona para viajes de hasta 9 días",
      ],
      en: [
        "Flight options: Vueling, Ryanair and other low-cost carriers fly direct to Marrakech",
        "Rates calculated based on vehicle (4x4 or minibus) occupancy; the cost is split between occupants",
        "Prices based on double and triple rooms · Single supplement €130",
        "Children 3-11 sharing room with two adults: €140 low season · €150 high season",
        "Spanish-speaking drivers limited, especially in high season — book well in advance",
        "Official guides are reserved for the medinas, not for the routes",
        "Passport valid at least 6 months to travel to Morocco",
        "Optional quad ride: €90 per vehicle (2-hour circuit)",
        "Optional cancellation insurance: €45 per person for trips up to 9 days",
      ],
      fr: [
        "Options de vols : Vueling, Ryanair et autres compagnies low-cost en vol direct vers Marrakech",
        "Tarifs calculés selon l'occupation du véhicule (4x4 ou minibus) ; le coût se partage entre les occupants",
        "Tarifs basés sur chambres doubles et triples · Supplément individuel 130 €",
        "Remise enfants 3-11 ans en chambre partagée avec deux adultes : 140 € basse · 150 € haute",
        "Chauffeurs hispanophones limités, surtout en haute saison — réserver à l'avance",
        "Les guides officiels sont réservés aux médinas, pas aux itinéraires",
        "Passeport valable au moins 6 mois pour voyager au Maroc",
        "Quads en option : 90 € par véhicule (circuit de 2 heures)",
        "Assurance annulation en option : 45 € par personne pour les voyages jusqu'à 9 jours",
      ],
    },
    terms: {
      es: [
        "Ficha de inscripción obligatoria (pasaporte se puede enviar más adelante)",
        "Pago por transferencia bancaria o tarjeta Visa",
        "30% del importe total en el momento de la reserva · 70% restante hasta 30 días antes de la salida",
        "Si el vuelo elegido requiere emisión inmediata: 100% del billete + 30% de los servicios terrestres",
        "Cancelación 45 días antes: 30% de gastos",
        "Cancelación 21 días antes: 100% de gastos",
        "Penalización fija de 50 € por reserva como gastos de gestión",
        "Las condiciones cubren los servicios terrestres; los vuelos se rigen por la política de cada aerolínea",
        "El seguro de cancelación no se reembolsa en ningún caso",
      ],
      en: [
        "Compulsory booking form (passport may be sent later)",
        "Payment by bank transfer or Visa card",
        "30% of total at booking · remaining 70% up to 30 days before departure",
        "If the chosen flight requires immediate issuance: 100% of the ticket + 30% of land services",
        "Cancellation 45 days before: 30% of costs",
        "Cancellation 21 days before: 100% of costs",
        "Fixed €50 penalty per booking as administrative fee",
        "Conditions cover land services; flights are governed by each airline's policy",
        "Cancellation insurance is non-refundable under any circumstances",
      ],
      fr: [
        "Fiche d'inscription obligatoire (le passeport peut être envoyé plus tard)",
        "Paiement par virement bancaire ou carte Visa",
        "30 % du total à la réservation · 70 % restants jusqu'à 30 jours avant le départ",
        "Si le vol choisi requiert une émission immédiate : 100 % du billet + 30 % des services terrestres",
        "Annulation 45 jours avant : 30 % de frais",
        "Annulation 21 jours avant : 100 % de frais",
        "Pénalité fixe de 50 € par réservation au titre des frais de gestion",
        "Les conditions couvrent les services terrestres ; les vols suivent la politique de chaque compagnie",
        "L'assurance annulation n'est en aucun cas remboursable",
      ],
    },
  },
};


/* ============================================================
   Marrakech → Erg Chebbi → Marrakech · 3 noches / 4 días
   Misma travesía circular que el 2n3d pero con un día extra:
   tras dormir en el bivouac visitamos Khamlia, Rissani y el
   mirador del Erg, y descansamos en Kasbah Xaluca. Día 4 puro
   traslado de regreso a Marrakech.
============================================================ */

export const DAY_MEM34_KHAMLIA_KASBAH = {
  route_id: "mem34-khamlia-kasbah",
  id: "dia-3",
  image: "https://images.unsplash.com/photo-1570133435536-7ececf000ef6?auto=format&fit=crop&w=2000&q=85",
  accent: "#A07042",
  title: { es: "Amanecer · Merdani · Khamlia · Rissani · Kasbah Xaluca", en: "Sunrise · Merdani · Khamlia · Rissani · Kasbah Xaluca", fr: "Lever du soleil · Merdani · Khamlia · Rissani · Kasbah Xaluca" },
  body: {
    es: "«Cita con el Amanecer»: recomendable madrugar para caminar hasta lo más alto de las dunas y ver la salida del sol. Desayuno beduino y regreso al coche, que nos llevará a rodear el Erg hasta el pueblo abandonado de Merdani. Continuaremos hacia el poblado de origen sudanés Khamlia, donde sus habitantes nos obsequiarán con sus danzas tradicionales y un té a la menta. Más tarde iremos a Rissani para visitar su mercado, único en estas latitudes, lugar donde se abastecen las tribus y nómadas del desierto — curioso ver su «parking» de burros. Finalmente subiremos a un mirador natural para despedirnos del desierto con una bella panorámica. Llegada a Kasbah Xaluca para tomarnos el resto del día libre: piscina climatizada, jacuzzi, tenis, minigolf, hammam, masaje o, para los más intrépidos, salida en quads o visita a kasbahs cercanas (opcional). Alojamiento y cena en Kasbah Xaluca.",
    en: "«A date with the Sunrise»: we recommend an early walk to the top of the dunes for sunrise. Bedouin breakfast and back to the vehicle for a drive around the Erg to the abandoned village of Merdani. We continue to Khamlia, a village of Sudanese origin, where its inhabitants offer traditional dances and mint tea. Later we head to Rissani's market — unique in these latitudes — where desert tribes and nomads stock up; the «donkey parking» is a sight worth photographing. We climb to a natural viewpoint for a final desert farewell. Arrival at Kasbah Xaluca for a free afternoon: heated pool, jacuzzi, tennis, minigolf, hammam, massage or — for the more adventurous — optional quad biking or a visit to nearby kasbahs. Dinner and overnight at Kasbah Xaluca.",
    fr: "« Rendez-vous avec l'aube » : il est recommandé de se lever tôt pour monter au sommet des dunes voir le lever du soleil. Petit déjeuner bédouin puis retour au véhicule, qui nous fait contourner l'Erg jusqu'au village abandonné de Merdani. Poursuite vers Khamlia, village d'origine soudanaise, où ses habitants offrent danses traditionnelles et thé à la menthe. Plus tard, marché de Rissani, unique sous ces latitudes, où s'approvisionnent tribus et nomades — curieux « parking d'ânes ». Montée à un mirador naturel pour faire ses adieux au désert. Arrivée à la Kasbah Xaluca pour un après-midi libre : piscine chauffée, jacuzzi, tennis, mini-golf, hammam, massage ou — pour les plus intrépides — sortie en quads ou visite de kasbahs voisines (en option). Dîner et nuit à la Kasbah Xaluca.",
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
      title: { es: "Khamlia: música ancestral Gnawa", en: "Khamlia: ancestral Gnawa music", fr: "Khamlia : musique ancestrale Gnawa" },
      body: {
        es: "Poblado fundado por comunidades de origen sudanés, internacionalmente reconocido por su música Gnawa, Patrimonio Cultural Inmaterial de la UNESCO. Grupos locales como Pigeons du Sable mantienen viva la tradición de ritmos hipnóticos, krakebs metálicos y tambores.",
        en: "A village founded by Sudanese communities, internationally known for its Gnawa music, listed as UNESCO Intangible Cultural Heritage. Local groups such as Pigeons du Sable keep alive a tradition of hypnotic rhythms, metallic krakebs and drums.",
        fr: "Village fondé par des communautés d'origine soudanaise, mondialement connu pour sa musique Gnawa, inscrite au Patrimoine Culturel Immatériel de l'UNESCO. Des groupes locaux comme Pigeons du Sable perpétuent cette tradition de rythmes hypnotiques, krakebs métalliques et tambours.",
      },
    },
    {
      title: { es: "Rissani: mercado único del sur", en: "Rissani: a unique southern market", fr: "Rissani : un marché unique du sud" },
      body: {
        es: "El zoco de Rissani, activo especialmente los martes, jueves y domingos, es uno de los mercados más importantes del valle del Ziz. Allí acuden nómadas Aït Atta y habitantes de aldeas remotas para intercambiar productos. Su «parking de burros» es una de las particularidades más fotografiadas.",
        en: "The Rissani souk, busiest on Tuesdays, Thursdays and Sundays, is one of the most important markets of the Ziz valley. Aït Atta nomads and remote-village dwellers gather to trade — and its «donkey parking» is one of the most photographed quirks.",
        fr: "Le souk de Rissani, actif surtout les mardis, jeudis et dimanches, est l'un des plus importants de la vallée du Ziz. Nomades Aït Atta et habitants des villages reculés viennent y commercer — son « parking d'ânes » est l'une des particularités les plus photographiées.",
      },
    },
    {
      title: { es: "Kasbah Xaluca: oasis tras el desierto", en: "Kasbah Xaluca: an oasis after the desert", fr: "Kasbah Xaluca : une oasis après le désert" },
      body: {
        es: "Un hotel emblemático del sur de Marruecos, único en el país por sus peculiares características arquitectónicas y por su completo conjunto de servicios wellness: piscina climatizada, jacuzzi, hammam, masajes, tenis y minigolf. El refugio perfecto tras una noche bajo las estrellas.",
        en: "An emblematic hotel of southern Morocco, unique in the country thanks to its singular architecture and a full set of wellness services: heated pool, jacuzzi, hammam, massages, tennis and minigolf. The perfect refuge after a night under the stars.",
        fr: "Un hôtel emblématique du sud du Maroc, unique au pays par son architecture singulière et son éventail complet de services bien-être : piscine chauffée, jacuzzi, hammam, massages, tennis et mini-golf. Le refuge idéal après une nuit sous les étoiles.",
      },
    },
  ],
};

export const DAY_MEM34_RETURN_MARRAKECH = {
  route_id: "mem34-return-marrakech",
  id: "dia-4",
  image: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=2000&q=85",
  accent: "#5A6B4F",
  title: { es: "Erfoud · Alnif · Regreso a Marrakech", en: "Erfoud · Alnif · Return to Marrakech", fr: "Erfoud · Alnif · Retour à Marrakech" },
  body: {
    es: "Hoy emprenderemos nuestro camino de regreso a Marrakech, pasando por la localidad de Alnif y disfrutando de una gran variedad de paisajes que enlazan el Anti-Atlas con la llanura del Haouz. Será un día de traslado largo pero escénico. Llegada a Marrakech y fin de nuestros servicios.",
    en: "Today we make our way back to Marrakech, passing through the town of Alnif and enjoying a wide variety of landscapes that link the Anti-Atlas with the Haouz plain. A long but scenic transfer day. Arrival in Marrakech and end of our services.",
    fr: "Aujourd'hui, route du retour vers Marrakech en passant par la ville d'Alnif et en profitant d'une grande variété de paysages qui relient l'Anti-Atlas à la plaine du Haouz. Une journée de transfert longue mais scénique. Arrivée à Marrakech et fin de nos services.",
  },
  culture: [
    {
      title: { es: "Alnif y la ruta de los fósiles", en: "Alnif and the fossil road", fr: "Alnif et la route des fossiles" },
      body: {
        es: "Pequeña localidad bereber del Anti-Atlas, internacionalmente conocida por sus yacimientos de trilobites del periodo Devónico, algunos de los más completos del mundo. Punto de paso obligado en la travesía del desierto al Atlas.",
        en: "A small Berber town in the Anti-Atlas, internationally known for its Devonian trilobite deposits — among the most complete in the world. A mandatory stop on the crossing from the desert to the Atlas.",
        fr: "Petite ville berbère de l'Anti-Atlas, mondialement connue pour ses gisements de trilobites du Dévonien — parmi les plus complets au monde. Halte obligée sur la traversée du désert vers l'Atlas.",
      },
    },
    {
      title: { es: "Del Anti-Atlas al llano del Haouz", en: "From the Anti-Atlas to the Haouz plain", fr: "De l'Anti-Atlas à la plaine du Haouz" },
      body: {
        es: "El recorrido encadena tres ecosistemas en pocas horas: tierras pedregosas y oasis de palmeras del Anti-Atlas, valles fluviales con olivares y, finalmente, el gran llano agrícola del Haouz que se abre hasta los pies del Atlas.",
        en: "The route chains three ecosystems in just a few hours: stony lands and palm oases of the Anti-Atlas, river valleys with olive groves and, finally, the great agricultural Haouz plain stretching to the foot of the Atlas.",
        fr: "L'itinéraire enchaîne trois écosystèmes en quelques heures : terres pierreuses et oasis de palmiers de l'Anti-Atlas, vallées fluviales aux oliveraies et, enfin, la grande plaine agricole du Haouz jusqu'au pied de l'Atlas.",
      },
    },
    {
      title: { es: "Llegar a Marrakech con calma", en: "Arriving in Marrakech with calm", fr: "Arriver à Marrakech tranquillement" },
      body: {
        es: "La entrada a Marrakech tras varios días de pistas y dunas se vive con una intensidad especial: el bullicio de la medina, los colores de los zocos y los aromas de Djemaa el-Fna son la mejor despedida del viaje.",
        en: "Arriving in Marrakech after several days of tracks and dunes feels especially intense: the buzz of the medina, the colours of the souks and the aromas of Djemaa el-Fna are the trip's best farewell.",
        fr: "Arriver à Marrakech après plusieurs jours de pistes et de dunes se vit avec une intensité particulière : l'effervescence de la médina, les couleurs des souks et les parfums de Djemaa el-Fna sont les meilleurs adieux du voyage.",
      },
    },
  ],
};

export const PROGRAM_MEM_34 = {
  routeId: "tourMarrakechLoop34",
  duration_key: "mem3n4d",
  duration: { es: "3 noches / 4 días", en: "3 nights / 4 days", fr: "3 nuits / 4 jours" },
  prices: { low: 790, mid: 920, high: 1050, premium: 1250 },
  reverse: false,
  meta: {
    es: {
      title: "Escapa al Erg Chebbi desde Marrakech.",
      description_title: "Una inmersión auténtica en el sur de Marruecos.",
      description: [
        "Vive una experiencia completa y fascinante con esta escapada de 3 noches y 4 días desde Marrakech hacia el corazón del desierto del Erg Chebbi, un recorrido que combina montañas, valles, kasbahs históricas y la magia infinita del Sahara.",
        "Cruzarás el Alto Atlas, conocerás pueblos bereberes, caminarás por las espectaculares Gargantas del Todra y seguirás pistas legendarias del Rally Dakar hasta adentrarte en las dunas en dromedario para disfrutar de un atardecer inolvidable.",
        "Dormir bajo las estrellas en un bivouac tradicional, descubrir la música Gnawa de Khamlia, visitar mercados locales y relajarte en Kasbah Xaluca tras la aventura convierten este viaje en una inmersión auténtica y única en la esencia más profunda de Marruecos.",
      ],
    },
    en: {
      title: "Escape to the Erg Chebbi from Marrakech.",
      description_title: "An authentic immersion in southern Morocco.",
      description: [
        "Live a complete and fascinating experience with this 3-night/4-day escape from Marrakech to the heart of the Erg Chebbi desert — a journey that blends mountains, valleys, historic kasbahs and the endless magic of the Sahara.",
        "You will cross the High Atlas, meet Berber villages, walk through the spectacular Todra Gorges and follow the legendary Dakar Rally tracks before riding into the dunes on camelback for an unforgettable sunset.",
        "Sleeping under the stars in a traditional bivouac, discovering the Gnawa music of Khamlia, visiting local markets and unwinding at Kasbah Xaluca after the adventure turn this trip into an authentic, unique immersion in Morocco's deepest essence.",
      ],
    },
    fr: {
      title: "Escapade à l'Erg Chebbi depuis Marrakech.",
      description_title: "Une immersion authentique dans le sud du Maroc.",
      description: [
        "Vivez une expérience complète et fascinante avec cette escapade de 3 nuits et 4 jours depuis Marrakech vers le cœur du désert de l'Erg Chebbi — un parcours qui mêle montagnes, vallées, kasbahs historiques et la magie infinie du Sahara.",
        "Vous traverserez le Haut Atlas, rencontrerez des villages berbères, marcherez dans les spectaculaires Gorges du Todra et suivrez les pistes mythiques du Rallye Dakar avant de pénétrer dans les dunes à dos de dromadaire pour un coucher de soleil inoubliable.",
        "Dormir sous les étoiles dans un bivouac traditionnel, découvrir la musique Gnawa de Khamlia, visiter des marchés locaux et se détendre à la Kasbah Xaluca après l'aventure transforment ce voyage en une immersion authentique et unique dans l'essence la plus profonde du Maroc.",
      ],
    },
  },
  days: [
    DAY_MEM23_ATLAS_DADES,
    DAY_MEM23_TODRA_BIVOUAC,
    DAY_MEM34_KHAMLIA_KASBAH,
    DAY_MEM34_RETURN_MARRAKECH,
  ],
  details: {
    includes: {
      es: [
        "Una noche en Boumalne Dades en Hotel Xaluca Dades 4* en régimen de media pensión",
        "Una noche en Erg Chebbi en bivouac de lujo en régimen de media pensión",
        "Una noche en Erfoud en Kasbah Xaluca en régimen de media pensión",
        "Comida «picnic» en el desierto el día 2",
        "Excursión en dromedario en el Erg Chebbi",
        "Vehículo 4x4 con chófer todos los días del itinerario",
        "Visita a la Kasbah de Aït Ben Haddou",
        "Combustible del vehículo",
        "Seguro de asistencia en viaje",
      ],
      en: [
        "One night in Boumalne Dades at Hotel Xaluca Dades 4*, half board",
        "One night in Erg Chebbi at a luxury bivouac, half board",
        "One night in Erfoud at Kasbah Xaluca, half board",
        "Desert «picnic» on day 2",
        "Camel ride in the Erg Chebbi",
        "Private 4x4 with driver every day of the itinerary",
        "Visit to the Aït Ben Haddou Kasbah",
        "Vehicle fuel",
        "Travel assistance insurance",
      ],
      fr: [
        "Une nuit à Boumalne Dadès à l'Hôtel Xaluca Dadès 4* en demi-pension",
        "Une nuit à l'Erg Chebbi en bivouac de luxe en demi-pension",
        "Une nuit à Erfoud au Kasbah Xaluca en demi-pension",
        "Déjeuner « pique-nique » dans le désert le jour 2",
        "Balade à dromadaire à l'Erg Chebbi",
        "Véhicule 4x4 avec chauffeur tous les jours de l'itinéraire",
        "Visite de la Kasbah d'Aït Ben Haddou",
        "Carburant du véhicule",
        "Assurance assistance voyage",
      ],
    },
    excludes: {
      es: [
        "Bebidas",
        "Comidas de mediodía salvo la indicada",
        "Extras personales (quads, masajes, etc.)",
        "Vuelos",
        "Suplemento opcional para añadir cancelación al seguro",
      ],
      en: [
        "Drinks",
        "Lunches except the one stated",
        "Personal extras (quads, massages, etc.)",
        "Flights",
        "Optional supplement to add cancellation to the insurance",
      ],
      fr: [
        "Boissons",
        "Déjeuners sauf celui indiqué",
        "Extras personnels (quads, massages, etc.)",
        "Vols",
        "Supplément en option pour ajouter l'annulation à l'assurance",
      ],
    },
    notes: {
      es: [
        "Opciones de vuelos: Vueling, Ryanair y otras compañías de bajo coste con vuelos directos a Marrakech",
        "Tarifas calculadas según ocupación del vehículo (4x4 o minibús); el coste se reparte entre los ocupantes",
        "Precios basados en habitaciones dobles y triples · Suplemento individual 175 €",
        "Descuento niños 3-11 años compartiendo habitación con dos adultos: 190 € baja · 205 € alta",
        "Chóferes de habla española limitados, sobre todo en temporada alta — se recomienda reservar con antelación",
        "Los guías titulados están reservados para las medinas, no para las rutas",
        "Pasaporte vigente mínimo 6 meses para viajar a Marruecos",
        "Actividades opcionales: quads, visita a kasbahs cercanas, hammam y masajes — más información en xaluca.com",
        "Seguro de cancelación opcional: 45 € por persona para viajes de hasta 9 días",
      ],
      en: [
        "Flight options: Vueling, Ryanair and other low-cost carriers fly direct to Marrakech",
        "Rates calculated based on vehicle (4x4 or minibus) occupancy; the cost is split between occupants",
        "Prices based on double and triple rooms · Single supplement €175",
        "Children 3-11 sharing room with two adults: €190 low season · €205 high season",
        "Spanish-speaking drivers limited, especially in high season — book well in advance",
        "Official guides are reserved for the medinas, not for the routes",
        "Passport valid at least 6 months to travel to Morocco",
        "Optional activities: quad rides, visits to nearby kasbahs, hammam and massages — more info at xaluca.com",
        "Optional cancellation insurance: €45 per person for trips up to 9 days",
      ],
      fr: [
        "Options de vols : Vueling, Ryanair et autres compagnies low-cost en vol direct vers Marrakech",
        "Tarifs calculés selon l'occupation du véhicule (4x4 ou minibus) ; le coût se partage entre les occupants",
        "Tarifs basés sur chambres doubles et triples · Supplément individuel 175 €",
        "Remise enfants 3-11 ans en chambre partagée avec deux adultes : 190 € basse · 205 € haute",
        "Chauffeurs hispanophones limités, surtout en haute saison — réserver à l'avance",
        "Les guides officiels sont réservés aux médinas, pas aux itinéraires",
        "Passeport valable au moins 6 mois pour voyager au Maroc",
        "Activités en option : quads, visite de kasbahs voisines, hammam et massages — plus d'infos sur xaluca.com",
        "Assurance annulation en option : 45 € par personne pour les voyages jusqu'à 9 jours",
      ],
    },
    terms: {
      es: [
        "Ficha de inscripción obligatoria (pasaporte se puede enviar más adelante)",
        "Pago por transferencia bancaria o tarjeta Visa",
        "30% del importe total en el momento de la reserva · 70% restante hasta 30 días antes de la salida",
        "Si el vuelo elegido requiere emisión inmediata: 100% del billete + 30% de los servicios terrestres",
        "Cancelación 45 días antes: 30% de gastos",
        "Cancelación 21 días antes: 100% de gastos",
        "Penalización fija de 50 € por reserva como gastos de gestión",
        "Las condiciones cubren los servicios terrestres; los vuelos se rigen por la política de cada aerolínea",
        "El seguro de cancelación no se reembolsa en ningún caso",
      ],
      en: [
        "Compulsory booking form (passport may be sent later)",
        "Payment by bank transfer or Visa card",
        "30% of total at booking · remaining 70% up to 30 days before departure",
        "If the chosen flight requires immediate issuance: 100% of the ticket + 30% of land services",
        "Cancellation 45 days before: 30% of costs",
        "Cancellation 21 days before: 100% of costs",
        "Fixed €50 penalty per booking as administrative fee",
        "Conditions cover land services; flights are governed by each airline's policy",
        "Cancellation insurance is non-refundable under any circumstances",
      ],
      fr: [
        "Fiche d'inscription obligatoire (le passeport peut être envoyé plus tard)",
        "Paiement par virement bancaire ou carte Visa",
        "30 % du total à la réservation · 70 % restants jusqu'à 30 jours avant le départ",
        "Si le vol choisi requiert une émission immédiate : 100 % du billet + 30 % des services terrestres",
        "Annulation 45 jours avant : 30 % de frais",
        "Annulation 21 jours avant : 100 % de frais",
        "Pénalité fixe de 50 € par réservation au titre des frais de gestion",
        "Les conditions couvrent les services terrestres ; les vols suivent la politique de chaque compagnie",
        "L'assurance annulation n'est en aucun cas remboursable",
      ],
    },
  },
};


/* ============================================================
   Marrakech → Erg Chebbi → Marrakech · 4 noches / 5 días
   Suma un día completo de Alto Atlas Central (Boutaghrar +
   Dadès + Todra + Erfoud) entre Boumalne Dades y el bivouac.
============================================================ */

export const DAY_MEM45_ATLAS_CENTRAL = {
  route_id: "mem45-atlas-central",
  id: "dia-2",
  image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=2000&q=85",
  accent: "#7C8B5C",
  title: { es: "Alto Atlas Central · Dadès · Todra · Erfoud", en: "Central High Atlas · Dadès · Todra · Erfoud", fr: "Haut Atlas Central · Dadès · Todra · Erfoud" },
  body: {
    es: "Esta mañana nos adentraremos por pistas en lo más profundo del Alto Atlas Central, descubriendo paisajes espectaculares. Visitaremos poblados bereberes como Boutaghrar, donde parece haberse detenido el tiempo. Veremos montañas, cañones y valles, así como las grutas donde aún habitan nómadas en las montañas. Recorreremos el Valle del Dades hasta sus gargantas y llegaremos al mirador donde tomaremos un té, con parada en las «Patas de Mono». Por la tarde continuaremos hacia Tinerhir, pequeña y próspera población con sus casas rosas y palmerales, punto de partida ideal para adentrarnos en las famosas Gargantas del Todra, donde podremos caminar siguiendo el curso del río. Más tarde seguiremos hasta Erfoud, conocida como «la Puerta del Desierto». Alojamiento y cena en Kasbah Xaluca, catalogada como única en Marruecos por sus peculiares características.",
    en: "This morning we head off-road into the heart of the Central High Atlas, discovering spectacular landscapes. We visit Berber villages such as Boutaghrar, where time seems to have stopped. We see mountains, canyons and valleys, as well as caves still inhabited by nomad families. We drive the Dadès Valley to its gorges and reach the viewpoint for tea, stopping at the «Monkey Paws». In the afternoon we continue to Tinerhir, a small and prosperous town of pink houses and palm groves — the ideal starting point to enter the famous Todra Gorges, where we walk along the riverbed. We then continue to Erfoud, known as «the Gate of the Desert». Dinner and overnight at Kasbah Xaluca, listed as unique in Morocco for its singular character.",
    fr: "Ce matin, nous nous enfonçons sur pistes au cœur du Haut Atlas Central, à la découverte de paysages spectaculaires. Visite de villages berbères comme Boutaghrar, où le temps semble s'être arrêté. Montagnes, canyons, vallées et grottes encore habitées par des familles nomades. Nous parcourons la Vallée du Dadès jusqu'à ses gorges et atteignons le mirador pour un thé, avec arrêt aux « Pattes de Singe ». L'après-midi, poursuite vers Tinerhir, petite ville prospère aux maisons roses et palmeraies — point de départ idéal pour les célèbres Gorges du Todra, où nous marchons en suivant le cours de la rivière. Continuation vers Erfoud, « la Porte du Désert ». Dîner et nuit à la Kasbah Xaluca, classée unique au Maroc.",
  },
  culture: [
    {
      title: { es: "Boutaghrar y los nómadas trogloditas", en: "Boutaghrar and the troglodyte nomads", fr: "Boutaghrar et les nomades troglodytes" },
      body: {
        es: "En la zona de Boutaghrar todavía viven familias bereberes Aït Atta en grutas y casas trogloditas, una tradición de siglos. Suelen recibir con hospitalidad a los viajeros y muestran cómo mantienen modos de vida nómadas o seminomádas en pleno Alto Atlas Central.",
        en: "In Boutaghrar, Aït Atta Berber families still live in caves and troglodyte houses — a centuries-old tradition. They welcome travellers with hospitality and reveal how they preserve nomadic or semi-nomadic ways of life in the very heart of the Central High Atlas.",
        fr: "À Boutaghrar, des familles berbères Aït Atta vivent encore dans des grottes et maisons troglodytes — une tradition séculaire. Elles accueillent les voyageurs avec hospitalité au cœur du Haut Atlas Central.",
      },
    },
    {
      title: { es: "Valle del Dadès y las «Patas de Mono»", en: "Dadès Valley & the «Monkey Paws»", fr: "Vallée du Dadès et les « Pattes de Singe »" },
      body: {
        es: "Formaciones geológicas creadas por la erosión durante millones de años, con un aspecto casi extraterrestre. El cañón del Dadès es uno de los recorridos paisajísticos más espectaculares del sur de Marruecos.",
        en: "Geological formations sculpted by erosion over millions of years, with an almost otherworldly appearance. The Dadès canyon is one of southern Morocco's most spectacular drives.",
        fr: "Formations géologiques sculptées par l'érosion pendant des millions d'années, d'aspect presque extraterrestre. Le canyon du Dadès est l'un des parcours paysagers les plus spectaculaires du sud marocain.",
      },
    },
    {
      title: { es: "Gargantas del Todra", en: "The Todra Gorges", fr: "Les Gorges du Todra" },
      body: {
        es: "Uno de los desfiladeros más impresionantes de Marruecos, con paredes verticales de hasta 160 metros en su tramo más estrecho. El río Todra esculpió estas paredes durante millones de años — meca mundial de la escalada.",
        en: "One of Morocco's most impressive canyons, with vertical walls up to 160 metres high at their narrowest point. The Todra river carved these walls over millions of years — a world-class climbing destination.",
        fr: "L'un des canyons les plus impressionnants du Maroc, avec des parois verticales pouvant atteindre 160 mètres dans la partie la plus étroite. La rivière Todra a sculpté ces parois pendant des millions d'années — destination mondiale de l'escalade.",
      },
    },
  ],
};

export const PROGRAM_MEM_45 = {
  routeId: "tourMarrakechLoop45",
  duration_key: "mem4n5d",
  duration: { es: "4 noches / 5 días", en: "4 nights / 5 days", fr: "4 nuits / 5 jours" },
  prices: { low: 990, mid: 1150, high: 1350, premium: 1590 },
  reverse: false,
  meta: {
    es: {
      title: "Escapa al desierto del Erg Chebbi desde Marrakech.",
      description_title: "Marruecos en profundidad, desde Marrakech.",
      description: [
        "Descubre Marruecos en profundidad con esta escapada de 4 noches y 5 días desde Marrakech hacia el impresionante desierto del Erg Chebbi, un viaje que combina montañas majestuosas, pueblos bereberes, kasbahs históricas y la magia del Sahara en su versión más auténtica.",
        "Cruzarás el Alto Atlas por el mítico Tizi n'Tichka, explorarás valles, gargantas y pistas legendarias del Rally Dakar, convivirás con nómadas, caminarás entre cañones y palmerales, y te adentrarás en el mar de dunas a lomos de un dromedario para vivir una puesta de sol inolvidable y dormir en un bivouac bajo un cielo repleto de estrellas.",
        "Completarás la experiencia con música Gnawa en Khamlia, mercados tradicionales en Rissani y momentos de relax en Kasbah Xaluca.",
      ],
    },
    en: {
      title: "Escape to the Erg Chebbi desert from Marrakech.",
      description_title: "Morocco in depth, from Marrakech.",
      description: [
        "Discover Morocco in depth with this 4-night/5-day escape from Marrakech to the stunning Erg Chebbi desert — a journey that blends majestic mountains, Berber villages, historic kasbahs and the magic of the Sahara at its most authentic.",
        "You will cross the High Atlas through the legendary Tizi n'Tichka, explore valleys, gorges and famous Dakar Rally tracks, meet nomads, walk through canyons and palm groves, and ride into the sea of dunes on camelback for an unforgettable sunset and a night at a bivouac under a star-filled sky.",
        "The experience is rounded off with Gnawa music in Khamlia, traditional markets in Rissani and relaxing moments at Kasbah Xaluca.",
      ],
    },
    fr: {
      title: "Escapade au désert de l'Erg Chebbi depuis Marrakech.",
      description_title: "Le Maroc en profondeur, depuis Marrakech.",
      description: [
        "Découvrez le Maroc en profondeur avec cette escapade de 4 nuits et 5 jours depuis Marrakech vers l'impressionnant désert de l'Erg Chebbi — un voyage qui mêle montagnes majestueuses, villages berbères, kasbahs historiques et la magie du Sahara dans sa version la plus authentique.",
        "Vous franchirez le Haut Atlas par le mythique Tizi n'Tichka, explorerez vallées, gorges et pistes légendaires du Rallye Dakar, rencontrerez des nomades, marcherez entre canyons et palmeraies, et pénétrerez dans la mer de dunes à dos de dromadaire pour un coucher de soleil inoubliable et une nuit en bivouac sous un ciel étoilé.",
        "L'expérience se complète avec la musique Gnawa à Khamlia, les marchés traditionnels de Rissani et des moments de détente à la Kasbah Xaluca.",
      ],
    },
  },
  days: [
    DAY_MEM23_ATLAS_DADES,
    DAY_MEM45_ATLAS_CENTRAL,
    DAY_DESERT_BIVOUAC,
    DAY_MEM34_KHAMLIA_KASBAH,
    DAY_MEM34_RETURN_MARRAKECH,
  ],
  details: {
    includes: {
      es: [
        "Una noche en Boumalne Dades en Hotel Xaluca Dades 4* en régimen de media pensión",
        "Dos noches en Erfoud en Kasbah Xaluca en régimen de media pensión",
        "Una noche en Erg Chebbi en bivouac de lujo en régimen de media pensión",
        "Comida «picnic» en el desierto el día 3",
        "Excursión en dromedario en el Erg Chebbi",
        "Vehículo 4x4 con chófer todos los días del itinerario",
        "Visita a la Kasbah de Aït Ben Haddou",
        "Combustible del vehículo",
        "Seguro de asistencia en viaje",
      ],
      en: [
        "One night in Boumalne Dades at Hotel Xaluca Dades 4*, half board",
        "Two nights in Erfoud at Kasbah Xaluca, half board",
        "One night in Erg Chebbi at a luxury bivouac, half board",
        "Desert «picnic» on day 3",
        "Camel ride in the Erg Chebbi",
        "Private 4x4 with driver every day of the itinerary",
        "Visit to the Aït Ben Haddou Kasbah",
        "Vehicle fuel",
        "Travel assistance insurance",
      ],
      fr: [
        "Une nuit à Boumalne Dadès à l'Hôtel Xaluca Dadès 4* en demi-pension",
        "Deux nuits à Erfoud au Kasbah Xaluca en demi-pension",
        "Une nuit à l'Erg Chebbi en bivouac de luxe en demi-pension",
        "Déjeuner « pique-nique » dans le désert le jour 3",
        "Balade à dromadaire à l'Erg Chebbi",
        "Véhicule 4x4 avec chauffeur tous les jours de l'itinéraire",
        "Visite de la Kasbah d'Aït Ben Haddou",
        "Carburant du véhicule",
        "Assurance assistance voyage",
      ],
    },
    excludes: {
      es: [
        "Bebidas",
        "Comidas de mediodía salvo la indicada",
        "Extras personales (quads, masajes, etc.)",
        "Vuelos",
        "Suplemento opcional para añadir cancelación al seguro (incluye COVID — 20 € por persona para viajes hasta 12 días)",
      ],
      en: [
        "Drinks",
        "Lunches except the one stated",
        "Personal extras (quads, massages, etc.)",
        "Flights",
        "Optional supplement to add cancellation cover including COVID (€20 per person for trips up to 12 days)",
      ],
      fr: [
        "Boissons",
        "Déjeuners sauf celui indiqué",
        "Extras personnels (quads, massages, etc.)",
        "Vols",
        "Supplément en option pour ajouter l'annulation à l'assurance, COVID inclus (20 € par personne pour les voyages jusqu'à 12 jours)",
      ],
    },
    notes: {
      es: [
        "Opciones de vuelos: Vueling, Ryanair y otras compañías de bajo coste con vuelos directos a Marrakech",
        "Tarifas calculadas según ocupación del vehículo (4x4 o minibús); el coste se reparte entre los ocupantes",
        "Precios basados en habitaciones dobles y triples · Suplemento individual 130 €",
        "Descuento niños 3-11 años compartiendo habitación con dos adultos: 160 € baja · 190 € alta",
        "Chóferes de habla española limitados, sobre todo en temporada alta — se recomienda reservar con antelación",
        "Los guías titulados están reservados para las medinas, no para las rutas",
        "Pasaporte vigente mínimo 6 meses para viajar a Marruecos",
        "Posibilidad de bivouac de lujo, privado o no, con «Mechui» (cordero al horno tradicional) — consultar número mínimo de personas",
        "Más información sobre alojamientos y servicios en xaluca.com",
      ],
      en: [
        "Flight options: Vueling, Ryanair and other low-cost carriers fly direct to Marrakech",
        "Rates calculated based on vehicle (4x4 or minibus) occupancy; the cost is split between occupants",
        "Prices based on double and triple rooms · Single supplement €130",
        "Children 3-11 sharing room with two adults: €160 low season · €190 high season",
        "Spanish-speaking drivers limited, especially in high season — book well in advance",
        "Official guides are reserved for the medinas, not for the routes",
        "Passport valid at least 6 months to travel to Morocco",
        "Optional luxury bivouac — private or shared — with traditional «Mechui» roast lamb; ask about minimum group size",
        "More info on accommodation and services at xaluca.com",
      ],
      fr: [
        "Options de vols : Vueling, Ryanair et autres compagnies low-cost en vol direct vers Marrakech",
        "Tarifs calculés selon l'occupation du véhicule (4x4 ou minibus) ; le coût se partage entre les occupants",
        "Tarifs basés sur chambres doubles et triples · Supplément individuel 130 €",
        "Remise enfants 3-11 ans en chambre partagée avec deux adultes : 160 € basse · 190 € haute",
        "Chauffeurs hispanophones limités, surtout en haute saison — réserver à l'avance",
        "Les guides officiels sont réservés aux médinas, pas aux itinéraires",
        "Passeport valable au moins 6 mois pour voyager au Maroc",
        "Possibilité de bivouac de luxe, privé ou partagé, avec « Mechui » traditionnel — consulter le nombre minimum de personnes",
        "Plus d'infos sur les hébergements et services sur xaluca.com",
      ],
    },
    terms: {
      es: [
        "Ficha de inscripción obligatoria (pasaporte se puede enviar más adelante)",
        "Pago por transferencia bancaria o tarjeta Visa",
        "30% del importe total en el momento de la reserva · 70% restante hasta 30 días antes de la salida",
        "Si el vuelo elegido requiere emisión inmediata: 100% del billete + 30% de los servicios terrestres",
        "Cancelación 45 días antes: 30% de gastos",
        "Cancelación 21 días antes: 100% de gastos",
        "Penalización fija de 50 € por reserva como gastos de gestión",
        "Las condiciones cubren los servicios terrestres; los vuelos se rigen por la política de cada aerolínea",
        "El seguro de cancelación no se reembolsa en ningún caso",
      ],
      en: [
        "Compulsory booking form (passport may be sent later)",
        "Payment by bank transfer or Visa card",
        "30% of total at booking · remaining 70% up to 30 days before departure",
        "If the chosen flight requires immediate issuance: 100% of the ticket + 30% of land services",
        "Cancellation 45 days before: 30% of costs",
        "Cancellation 21 days before: 100% of costs",
        "Fixed €50 penalty per booking as administrative fee",
        "Conditions cover land services; flights are governed by each airline's policy",
        "Cancellation insurance is non-refundable under any circumstances",
      ],
      fr: [
        "Fiche d'inscription obligatoire (le passeport peut être envoyé plus tard)",
        "Paiement par virement bancaire ou carte Visa",
        "30 % du total à la réservation · 70 % restants jusqu'à 30 jours avant le départ",
        "Si le vol choisi requiert une émission immédiate : 100 % du billet + 30 % des services terrestres",
        "Annulation 45 jours avant : 30 % de frais",
        "Annulation 21 jours avant : 100 % de frais",
        "Pénalité fixe de 50 € par réservation au titre des frais de gestion",
        "Les conditions couvrent les services terrestres ; les vols suivent la politique de chaque compagnie",
        "L'assurance annulation n'est en aucun cas remboursable",
      ],
    },
  },
};


/* ============================================================
   Marrakech → Erg Chebbi → Marrakech · 5 noches / 6 días
   Circular con dos noches en Marrakech (llegada + visita guiada),
   3 días de circuito 4x4 hacia el Erg Chebbi y regreso largo a
   Marrakech para una última noche y traslado al aeropuerto.
============================================================ */

export const DAY_MEM56_ARRIVAL_MARRAKECH = {
  route_id: "mem56-arrival-marrakech",
  id: "dia-1",
  image: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=2000&q=85",
  accent: "#A07042",
  title: { es: "Llegada a Marrakech", en: "Arrival in Marrakech", fr: "Arrivée à Marrakech" },
  body: {
    es: "Vuelo desde el aeropuerto de origen hacia Marrakech. Llegada y traslado al Riad en la Medina u Hotel 5*. Alojamiento. Dependiendo de la hora de llegada, se recomienda una primera toma de contacto con la Medina y la famosa Plaza Djemaa el-Fna, que al caer la tarde y la noche se llena de recitadores, adivinadores, malabaristas, encantadores de serpientes y puestos de comida tradicional al aire libre.",
    en: "Flight from your home airport to Marrakech. Arrival and transfer to a Riad in the Medina or 5* Hotel. Overnight. Depending on your arrival time, we recommend a first contact with the Medina and the famous Djemaa el-Fna Square — which at dusk and after dark fills with storytellers, fortune-tellers, jugglers, snake charmers and traditional open-air food stalls.",
    fr: "Vol depuis votre aéroport d'origine vers Marrakech. Arrivée et transfert au Riad dans la Médina ou Hôtel 5*. Nuit. Selon l'heure d'arrivée, nous vous recommandons une première rencontre avec la Médina et la célèbre place Djemaa el-Fna — qui se remplit en soirée de conteurs, devins, jongleurs, charmeurs de serpents et étals de cuisine en plein air.",
  },
  culture: [
    {
      title: { es: "Djemaa el-Fna al caer la tarde", en: "Djemaa el-Fna at dusk", fr: "Djemaa el-Fna à la tombée du soir" },
      body: {
        es: "Patrimonio Cultural Inmaterial de la UNESCO desde 2008. Al anochecer la plaza se convierte en un gran escenario gastronómico y cultural con decenas de paraditas de comida iluminadas y espectáculos espontáneos.",
        en: "UNESCO Intangible Cultural Heritage since 2008. At nightfall the square becomes a vast gastronomic and cultural stage with dozens of lit-up food stalls and impromptu shows.",
        fr: "Patrimoine Culturel Immatériel de l'UNESCO depuis 2008. À la tombée de la nuit, la place devient une vaste scène gastronomique et culturelle avec des dizaines d'échoppes éclairées et des spectacles improvisés.",
      },
    },
    {
      title: { es: "Vivir en un riad de la Medina", en: "Living in a Medina riad", fr: "Vivre dans un riad de la Médina" },
      body: {
        es: "Los riads son antiguas casas-palacio organizadas en torno a un patio interior. Dormir en uno permite experimentar la vida tradicional marroquí en pleno corazón de la Medina, lejos del bullicio.",
        en: "Riads are former palatial homes organised around an inner courtyard. Spending the night in one offers an immersion into traditional Moroccan life at the heart of the Medina, away from the bustle.",
        fr: "Les riads sont d'anciennes maisons-palais organisées autour d'un patio intérieur. Y dormir permet de vivre la tradition marocaine au cœur de la Médina, loin de l'agitation.",
      },
    },
    {
      title: { es: "Aeropuerto Menara de Marrakech", en: "Marrakech Menara airport", fr: "Aéroport Menara de Marrakech" },
      body: {
        es: "Inaugurado en su forma moderna en 2008, es una de las grandes puertas de entrada de Marruecos y un referente arquitectónico por su celosía geométrica inspirada en el zellige tradicional.",
        en: "Opened in its modern form in 2008, it is one of Morocco's main gateways and an architectural landmark thanks to its geometric lattice façade inspired by traditional zellige.",
        fr: "Inauguré dans sa forme moderne en 2008, c'est l'une des grandes portes d'entrée du Maroc et une référence architecturale grâce à sa façade en moucharabieh inspirée du zellige traditionnel.",
      },
    },
  ],
};

export const DAY_MEM56_MARRAKECH_VISIT = {
  route_id: "mem56-marrakech-visit",
  id: "dia-2",
  image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=2000&q=85",
  accent: "#A07042",
  title: { es: "Marrakech · medina, Koutoubia y zocos", en: "Marrakech · medina, Koutoubia and souks", fr: "Marrakech · médina, Koutoubia et souks" },
  body: {
    es: "Visita guiada a pie por la Medina de Marrakech con un guía local. Empezaremos admirando el Alminar de la Koutoubia, gemela de la Giralda de Sevilla, y seguiremos con el Palacio de la Bahía. Recorreremos los zocos tradicionales viendo a tejedores de alfombras, fabricantes de babuchas y una infinita variedad de artesanos. Visita a una farmacia bereber, donde nos enseñarán sus «secretillos». Por la tarde: tiempo libre, compras, paseo por la Medina y práctica del arte del regateo. Alojamiento en Riad en la Medina u Hotel 5*.",
    en: "Guided walking tour of the Marrakech Medina with a local guide. We start at the Koutoubia minaret — twin of Seville's Giralda — and continue to the Bahia Palace. We wander the traditional souks watching carpet weavers, babouche makers and a vast range of artisans at work. Visit to a Berber pharmacy where they share their «little secrets». In the afternoon: free time, shopping, a Medina stroll and the art of bargaining. Overnight in a Riad in the Medina or 5* Hotel.",
    fr: "Visite guidée à pied de la Médina de Marrakech avec un guide local. Nous commençons par le minaret de la Koutoubia — jumeau de la Giralda de Séville — puis le Palais de la Bahia. Nous parcourons les souks traditionnels en observant tisserands de tapis, fabricants de babouches et une infinité d'artisans. Visite d'une pharmacie berbère, où l'on partage ses « petits secrets ». L'après-midi : temps libre, shopping, balade dans la Médina et art du marchandage. Nuit en Riad dans la Médina ou Hôtel 5*.",
  },
  culture: [
    {
      title: { es: "La Koutoubia: el alminar que inspiró a la Giralda", en: "Koutoubia: the minaret that inspired the Giralda", fr: "La Koutoubia : le minaret qui inspira la Giralda" },
      body: {
        es: "La Mezquita de la Koutoubia fue construida en el siglo XII por los almohades y su alminar está considerado una obra maestra de la arquitectura islámica. Su diseño sirvió de modelo para la Giralda de Sevilla y la Torre Hassan de Rabat.",
        en: "Built in the 12th century by the Almohads, the Koutoubia minaret is considered a masterpiece of Islamic architecture. Its design served as the model for Seville's Giralda and Rabat's Hassan Tower.",
        fr: "Construite au XIIᵉ siècle par les Almohades, la mosquée de la Koutoubia possède un minaret considéré comme un chef-d'œuvre de l'architecture islamique. Son dessin servit de modèle à la Giralda de Séville et à la Tour Hassan de Rabat.",
      },
    },
    {
      title: { es: "Palacio de la Bahía", en: "Bahia Palace", fr: "Palais de la Bahia" },
      body: {
        es: "Construido en el siglo XIX por el gran visir Sí Moussa para su favorita, el palacio cuenta con 150 habitaciones, jardines de mosaico y delicados artesonados de cedro. Una obra maestra de la artesanía marroquí.",
        en: "Built in the 19th century by the grand vizier Si Moussa for his favourite, the palace has 150 rooms, mosaic gardens and exquisite cedar coffered ceilings. A masterpiece of Moroccan craftsmanship.",
        fr: "Édifié au XIXᵉ siècle par le grand vizir Si Moussa pour sa favorite, le palais compte 150 pièces, des jardins en mosaïque et de délicats plafonds à caissons en cèdre. Un chef-d'œuvre de l'artisanat marocain.",
      },
    },
    {
      title: { es: "Los zocos y la artesanía", en: "The souks and the crafts", fr: "Les souks et l'artisanat" },
      body: {
        es: "Uno de los mercados artesanales más extensos del norte de África, dividido en sectores especializados — curtidores, cesteros, tintoreros, herreros, joyeros — manteniendo viva la tradición de oficios medievales.",
        en: "One of North Africa's largest artisan markets, divided into specialised quarters — tanners, basket weavers, dyers, blacksmiths, jewellers — keeping medieval crafts alive.",
        fr: "L'un des plus vastes marchés artisanaux d'Afrique du Nord, divisé en quartiers spécialisés — tanneurs, vanniers, teinturiers, forgerons, bijoutiers — perpétuant des métiers médiévaux.",
      },
    },
  ],
};

export const DAY_MEM56_RETURN_MARRAKECH = {
  route_id: "mem56-return-marrakech",
  id: "dia-5",
  image: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=2000&q=85",
  accent: "#5A6B4F",
  title: { es: "Amanecer · Merdani · Alnif · regreso a Marrakech", en: "Sunrise · Merdani · Alnif · return to Marrakech", fr: "Lever du soleil · Merdani · Alnif · retour à Marrakech" },
  body: {
    es: "«Cita con el Amanecer»: recomendable madrugar para subir a las dunas y contemplar la salida del sol. Desayuno beduino, regreso al coche y recorrido alrededor del Erg hasta el pueblo abandonado de Merdani. Emprenderemos el largo camino de regreso a Marrakech (aproximadamente 550 km), pasando por la localidad de Alnif y disfrutando de los grandes contrastes paisajísticos entre el Anti-Atlas y la llanura del Haouz. Último día de utilización del 4x4. Llegada a Marrakech y alojamiento en Riad u Hotel 5*.",
    en: "«A date with the Sunrise»: we recommend an early walk up the dunes for sunrise. Bedouin breakfast, back to the vehicle and a drive around the Erg to the abandoned village of Merdani. Then a long drive back to Marrakech (approximately 550 km), passing through Alnif and enjoying the great landscape contrasts between the Anti-Atlas and the Haouz plain. Final day with the 4x4. Arrival in Marrakech and overnight at a Riad or 5* Hotel.",
    fr: "« Rendez-vous avec l'aube » : il est recommandé de se lever tôt pour monter sur les dunes admirer le lever du soleil. Petit déjeuner bédouin, retour au véhicule et tour de l'Erg jusqu'au village abandonné de Merdani. Longue route de retour vers Marrakech (environ 550 km) en passant par Alnif, avec les grands contrastes de paysages entre l'Anti-Atlas et la plaine du Haouz. Dernier jour avec le 4x4. Arrivée à Marrakech et nuit au Riad ou Hôtel 5*.",
  },
  culture: [
    {
      title: { es: "Merdani: el pueblo abandonado", en: "Merdani: the abandoned village", fr: "Merdani : le village abandonné" },
      body: {
        es: "Antiguo poblado minero hoy parcialmente abandonado, junto a las minas de M'Fis. Una parada fotográfica imprescindible para entender la vida en los confines del Sahara y la historia del kohl, el plomo y el cobre extraídos en la región.",
        en: "An old mining village, today partly abandoned, next to the M'Fis mines. A must-stop for photographers and a window into life on the edge of the Sahara and the regional history of kohl, lead and copper mining.",
        fr: "Ancien village minier aujourd'hui partiellement abandonné, près des mines de M'Fis. Une halte photo incontournable et une fenêtre sur la vie aux confins du Sahara et l'histoire du kohl, du plomb et du cuivre extraits dans la région.",
      },
    },
    {
      title: { es: "Una larga ruta llena de contrastes", en: "A long route full of contrasts", fr: "Une longue route pleine de contrastes" },
      body: {
        es: "Los 550 km de regreso encadenan tres ecosistemas: las tierras pedregosas y oasis del Anti-Atlas, los valles fluviales con palmerales y olivares y, finalmente, la gran llanura agrícola del Haouz hasta los pies del Atlas.",
        en: "The 550 km return chains three ecosystems: the stony lands and oases of the Anti-Atlas, the river valleys with palm groves and olive orchards, and finally the great agricultural Haouz plain at the feet of the Atlas.",
        fr: "Les 550 km de retour enchaînent trois écosystèmes : terres pierreuses et oasis de l'Anti-Atlas, vallées fluviales aux palmeraies et oliveraies et, enfin, la grande plaine agricole du Haouz jusqu'au pied de l'Atlas.",
      },
    },
    {
      title: { es: "Una última noche en Marrakech", en: "One last night in Marrakech", fr: "Une dernière nuit à Marrakech" },
      body: {
        es: "Tras un largo día de pistas, llegar de noche al riad o al hotel y salir a cenar a la Medina —cargados de polvo y recuerdos— es una de las experiencias más memorables del viaje.",
        en: "After a long day on the tracks, arriving at the riad or hotel by night and going out for dinner in the Medina — covered in dust and full of memories — is one of the most memorable experiences of the trip.",
        fr: "Après une longue journée de pistes, arriver de nuit au riad ou à l'hôtel et aller dîner dans la Médina — couverts de poussière et de souvenirs — est l'une des expériences les plus marquantes du voyage.",
      },
    },
  ],
};

export const PROGRAM_MEM_56 = {
  routeId: "tourMarrakechLoop56",
  duration_key: "mem5n6d",
  duration: { es: "5 noches / 6 días", en: "5 nights / 6 days", fr: "5 nuits / 6 jours" },
  prices: { low: 1290, mid: 1490, high: 1690, premium: 1990 },
  reverse: false,
  meta: {
    es: {
      title: "Marrakech · Erg Chebbi · Marrakech.",
      description_title: "Un viaje circular para conocer a fondo el sur del país.",
      description: [
        "«Marrakech – Erg Chebbi – Marrakech» es un viaje para conocer a fondo el sur del país. Esta ruta nos despierta en Marrakech, una ciudad llena de colores, salpicada de artesanos y artistas, de plazas maravillosas y de aromas que marcarán nuestro recuerdo.",
        "Desde la ciudad continuaremos en 4x4 hacia el Alto Atlas, descubriendo paisajes espectaculares, pueblos perdidos y gargantas inmensas. Más adelante llegaremos al Desierto del Erg Chebbi, un espectáculo para los sentidos, con interminables dunas y una atmósfera mágica que permite vivir una noche inolvidable bajo las estrellas.",
        "El recorrido atraviesa lugares tan auténticos como Rissani y su mercado ancestral, además de oasis, montañas y pistas del desierto.",
      ],
    },
    en: {
      title: "Marrakech · Erg Chebbi · Marrakech.",
      description_title: "A circular journey to discover southern Morocco in depth.",
      description: [
        "«Marrakech – Erg Chebbi – Marrakech» is a journey to discover the south of the country in depth. The route wakes us up in Marrakech, a city full of colour, scattered with artisans and artists, marvellous squares and aromas that will linger in our memory.",
        "From the city we continue in a 4x4 towards the High Atlas, discovering spectacular landscapes, hidden villages and immense gorges. Further on we reach the Erg Chebbi desert — a feast for the senses with endless dunes and a magical atmosphere that allows us to spend an unforgettable night under the stars.",
        "The route crosses authentic places such as Rissani and its ancestral market, as well as oases, mountains and desert tracks.",
      ],
    },
    fr: {
      title: "Marrakech · Erg Chebbi · Marrakech.",
      description_title: "Un voyage circulaire pour découvrir en profondeur le sud du pays.",
      description: [
        "« Marrakech – Erg Chebbi – Marrakech » est un voyage pour découvrir en profondeur le sud du pays. L'itinéraire nous réveille à Marrakech, ville colorée parsemée d'artisans et d'artistes, aux places merveilleuses et aux parfums qui marqueront notre mémoire.",
        "Depuis la ville, nous poursuivons en 4x4 vers le Haut Atlas, à la découverte de paysages spectaculaires, de villages perdus et de gorges immenses. Plus loin, nous atteignons le désert de l'Erg Chebbi — un spectacle pour les sens, avec ses dunes infinies et son atmosphère magique pour une nuit inoubliable sous les étoiles.",
        "Le parcours traverse des lieux authentiques comme Rissani et son marché ancestral, ainsi que des oasis, des montagnes et des pistes du désert.",
      ],
    },
  },
  days: [
    DAY_MEM56_ARRIVAL_MARRAKECH,
    DAY_MEM56_MARRAKECH_VISIT,
    DAY_MEM23_ATLAS_DADES,
    DAY_MEM23_TODRA_BIVOUAC,
    DAY_MEM56_RETURN_MARRAKECH,
    DAY_EM78_DEPARTURE,
  ],
  details: {
    includes: {
      es: [
        "Tres noches en Marrakech en Riad u Hotel 5* en régimen de alojamiento y desayuno",
        "Una noche en Boumalne Dades en Hotel Xaluca Dades 4* en régimen de media pensión",
        "Una noche en Erg Chebbi en bivouac de lujo en régimen de media pensión",
        "Comida «picnic» en el desierto el día 4",
        "Excursión en dromedario en el Erg Chebbi",
        "Vehículo 4x4 con chófer del día 3 al día 5",
        "Visita guiada por la Medina de Marrakech con guía local",
        "Visitas a la Kasbah de Aït Ben Haddou y al Palacio de la Bahía",
        "Transfers de aeropuerto en Marrakech",
        "Combustible del vehículo",
        "Seguro de asistencia en viaje",
      ],
      en: [
        "Three nights in Marrakech in a Riad or 5* Hotel, bed and breakfast",
        "One night in Boumalne Dades at Hotel Xaluca Dades 4*, half board",
        "One night in Erg Chebbi at a luxury bivouac, half board",
        "Desert «picnic» on day 4",
        "Camel ride in the Erg Chebbi",
        "Private 4x4 with driver from day 3 to day 5",
        "Guided walking tour of the Marrakech Medina with local guide",
        "Visits to the Aït Ben Haddou Kasbah and the Bahia Palace",
        "Airport transfers in Marrakech",
        "Vehicle fuel",
        "Travel assistance insurance",
      ],
      fr: [
        "Trois nuits à Marrakech en Riad ou Hôtel 5* en logement et petit déjeuner",
        "Une nuit à Boumalne Dadès à l'Hôtel Xaluca Dadès 4* en demi-pension",
        "Une nuit à l'Erg Chebbi en bivouac de luxe en demi-pension",
        "Déjeuner « pique-nique » dans le désert le jour 4",
        "Balade à dromadaire à l'Erg Chebbi",
        "Véhicule 4x4 avec chauffeur du jour 3 au jour 5",
        "Visite guidée de la Médina de Marrakech avec guide local",
        "Visites de la Kasbah d'Aït Ben Haddou et du Palais de la Bahia",
        "Transferts aéroport à Marrakech",
        "Carburant du véhicule",
        "Assurance assistance voyage",
      ],
    },
    excludes: {
      es: [
        "Bebidas",
        "Comidas de mediodía no especificadas",
        "Cenas en Marrakech",
        "Extras personales (quads, masajes, etc.)",
        "Vuelos",
        "Seguro de cancelación",
      ],
      en: [
        "Drinks",
        "Lunches not specified",
        "Dinners in Marrakech",
        "Personal extras (quads, massages, etc.)",
        "Flights",
        "Cancellation insurance",
      ],
      fr: [
        "Boissons",
        "Déjeuners non spécifiés",
        "Dîners à Marrakech",
        "Extras personnels (quads, massages, etc.)",
        "Vols",
        "Assurance annulation",
      ],
    },
    notes: {
      es: [
        "Opciones de vuelos: Royal Air Maroc, Vueling, Air Arabia, Ryanair — vuelos directos desde varias ciudades",
        "Tarifas basadas en habitaciones dobles y triples · Suplemento individual 470 €",
        "Descuento niños 3-11 años compartiendo con dos adultos: 170 € baja · 175 € alta",
        "Si los riads estuvieran completos, se ofrecerán alternativas similares con previo aviso",
        "Guías locales pueden compartirse en temporada alta",
        "Chóferes de habla española limitados — se recomienda reservar con antelación",
        "Pasaporte con un mínimo de 3 meses de validez desde la fecha de regreso",
        "Actividades opcionales: Quads 70 € por vehículo (1 hora) · Spa y masajes en recepción del hotel",
        "Seguro de cancelación opcional: 30 € por persona para viajes de hasta 10 días — debe contratarse al confirmar",
      ],
      en: [
        "Flight options: Royal Air Maroc, Vueling, Air Arabia, Ryanair — direct flights from various cities",
        "Rates based on double and triple rooms · Single supplement €470",
        "Children 3-11 sharing room with two adults: €170 low season · €175 high season",
        "If the planned riads are full, similar alternatives will be offered in advance",
        "Local guides may be shared in high season",
        "Spanish-speaking drivers limited — book in advance",
        "Passport valid for at least 3 months from the return date",
        "Optional activities: Quads €70 per vehicle (1 hour) · Spa and massages at hotel reception",
        "Optional cancellation insurance: €30 per person for trips up to 10 days — must be taken out at confirmation",
      ],
      fr: [
        "Options de vols : Royal Air Maroc, Vueling, Air Arabia, Ryanair — vols directs depuis plusieurs villes",
        "Tarifs basés sur chambres doubles et triples · Supplément individuel 470 €",
        "Remise enfants 3-11 ans en chambre partagée avec deux adultes : 170 € basse · 175 € haute",
        "Si les riads prévus sont complets, des alternatives similaires seront proposées au préalable",
        "Guides locaux susceptibles d'être partagés en haute saison",
        "Chauffeurs hispanophones limités — réserver à l'avance",
        "Passeport valable au moins 3 mois après la date de retour",
        "Activités en option : Quads 70 € par véhicule (1 heure) · Spa et massages à la réception de l'hôtel",
        "Assurance annulation en option : 30 € par personne pour les voyages jusqu'à 10 jours — à souscrire à la confirmation",
      ],
    },
    terms: {
      es: [
        "Ficha de inscripción obligatoria",
        "Pago: 30% al confirmar · 70% restante hasta 30 días antes de la salida",
        "Si el vuelo elegido requiere emisión inmediata: 100% del billete + 30% de los servicios terrestres",
        "Cancelación 45 días antes: 30% de gastos",
        "Cancelación 21 días antes: 100% de gastos",
        "Penalización fija de 50 € por reserva como gastos de gestión",
        "Los seguros no son reembolsables",
      ],
      en: [
        "Compulsory booking form",
        "Payment: 30% at confirmation · remaining 70% up to 30 days before departure",
        "If the chosen flight requires immediate issuance: 100% of the ticket + 30% of land services",
        "Cancellation 45 days before: 30% of costs",
        "Cancellation 21 days before: 100% of costs",
        "Fixed €50 penalty per booking as administrative fee",
        "Insurances are non-refundable",
      ],
      fr: [
        "Fiche d'inscription obligatoire",
        "Paiement : 30 % à la confirmation · 70 % restants jusqu'à 30 jours avant le départ",
        "Si le vol choisi requiert une émission immédiate : 100 % du billet + 30 % des services terrestres",
        "Annulation 45 jours avant : 30 % de frais",
        "Annulation 21 jours avant : 100 % de frais",
        "Pénalité fixe de 50 € par réservation au titre des frais de gestion",
        "Les assurances ne sont pas remboursables",
      ],
    },
  },
};


/* ============================================================
   Marrakech → Erg Chebbi → Marrakech · 6 noches / 7 días
   Variante con noche extra en Kasbah Xaluca tras el bivouac y
   día completo de regreso a Marrakech.
============================================================ */

export const DAY_MEM67_ERFOUD_MARRAKECH = {
  route_id: "mem67-erfoud-marrakech",
  id: "dia-6",
  image: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=2000&q=85",
  accent: "#5A6B4F",
  title: { es: "Erfoud · Alnif · regreso a Marrakech", en: "Erfoud · Alnif · return to Marrakech", fr: "Erfoud · Alnif · retour à Marrakech" },
  body: {
    es: "Día de regreso hacia Marrakech atravesando Alnif, paisajes desérticos del Anti-Atlas y zonas montañosas. Será un día de traslado largo (aproximadamente 550 km), recompensado por la enorme variedad paisajística. Último día de utilización del vehículo 4x4. Llegada a Marrakech y tiempo libre — buen momento para una última cena en la Medina o un paseo nocturno por Djemaa el-Fna. Alojamiento en Riad en la Medina u Hotel 5*.",
    en: "Day of return towards Marrakech via Alnif, desert landscapes of the Anti-Atlas and mountain stretches. A long transfer day (approximately 550 km), rewarded by the immense variety of landscapes. Final day with the 4x4. Arrival in Marrakech and free time — a good moment for a last dinner in the Medina or an evening stroll across Djemaa el-Fna. Overnight in a Riad in the Medina or 5* Hotel.",
    fr: "Journée de retour vers Marrakech en passant par Alnif, paysages désertiques de l'Anti-Atlas et zones montagneuses. Longue journée de transfert (environ 550 km), récompensée par l'immense variété de paysages. Dernier jour avec le 4x4. Arrivée à Marrakech et temps libre — bon moment pour un dernier dîner dans la Médina ou une promenade nocturne sur Djemaa el-Fna. Nuit en Riad dans la Médina ou Hôtel 5*.",
  },
  culture: [
    {
      title: { es: "Alnif y la ruta de los fósiles", en: "Alnif and the fossil road", fr: "Alnif et la route des fossiles" },
      body: {
        es: "Pequeña localidad bereber del Anti-Atlas, internacionalmente conocida por sus yacimientos de trilobites del periodo Devónico, algunos de los más completos del mundo. Punto de paso obligado en la travesía del desierto al Atlas.",
        en: "A small Berber town in the Anti-Atlas, internationally known for its Devonian trilobite deposits — among the most complete in the world. A mandatory stop on the crossing from the desert to the Atlas.",
        fr: "Petite ville berbère de l'Anti-Atlas, mondialement connue pour ses gisements de trilobites du Dévonien — parmi les plus complets au monde. Halte obligée sur la traversée du désert vers l'Atlas.",
      },
    },
    {
      title: { es: "Del Anti-Atlas al llano del Haouz", en: "From the Anti-Atlas to the Haouz plain", fr: "De l'Anti-Atlas à la plaine du Haouz" },
      body: {
        es: "El recorrido encadena tres ecosistemas en pocas horas: tierras pedregosas y oasis de palmeras del Anti-Atlas, valles fluviales con olivares y, finalmente, el gran llano agrícola del Haouz que se abre hasta los pies del Atlas.",
        en: "The route chains three ecosystems in just a few hours: stony lands and palm oases of the Anti-Atlas, river valleys with olive groves and, finally, the great agricultural Haouz plain stretching to the foot of the Atlas.",
        fr: "L'itinéraire enchaîne trois écosystèmes en quelques heures : terres pierreuses et oasis de palmiers de l'Anti-Atlas, vallées fluviales aux oliveraies et, enfin, la grande plaine agricole du Haouz jusqu'au pied de l'Atlas.",
      },
    },
    {
      title: { es: "Última noche en Marrakech", en: "Last night in Marrakech", fr: "Dernière nuit à Marrakech" },
      body: {
        es: "La llegada nocturna a Marrakech tras los días en el desierto y la montaña convierte la cena en la Medina o el paseo por Djemaa el-Fna en una despedida intensa y memorable del viaje.",
        en: "Arriving in Marrakech by night after days in the desert and the mountains turns dinner in the Medina or a stroll around Djemaa el-Fna into an intense, memorable farewell to the trip.",
        fr: "L'arrivée nocturne à Marrakech après les jours dans le désert et la montagne fait du dîner dans la Médina ou d'une promenade autour de Djemaa el-Fna un adieu intense et mémorable.",
      },
    },
  ],
};

export const PROGRAM_MEM_67 = {
  routeId: "tourMarrakechLoop67",
  duration_key: "mem6n7d",
  duration: { es: "6 noches / 7 días", en: "6 nights / 7 days", fr: "6 nuits / 7 jours" },
  prices: { low: 1490, mid: 1690, high: 1890, premium: 2190 },
  reverse: false,
  meta: {
    es: {
      title: "Marrakech · Erg Chebbi · Marrakech.",
      description_title: "Una semana para descubrir Marrakech, el Atlas y el Sahara.",
      description: [
        "«Marrakech – Erg Chebbi – Marrakech» es un viaje para conocer a fondo el sur del país. La ruta comienza en Marrakech, una ciudad llena de colores, artesanos, plazas vibrantes y aromas inolvidables.",
        "Desde allí se continúa en vehículo 4x4 atravesando el Alto Atlas, descubriendo paisajes espectaculares, aldeas remotas y gargantas impresionantes. Posteriormente se llega al Desierto del Erg Chebbi, con sus dunas infinitas y su atmósfera mágica, donde se vive la experiencia de dormir bajo las estrellas.",
        "El recorrido también atraviesa lugares tan auténticos como Rissani y su mercado ancestral, además de oasis, poblados del desierto y una noche extra de descanso en Kasbah Xaluca.",
      ],
    },
    en: {
      title: "Marrakech · Erg Chebbi · Marrakech.",
      description_title: "A week to discover Marrakech, the Atlas and the Sahara.",
      description: [
        "«Marrakech – Erg Chebbi – Marrakech» is a journey to discover southern Morocco in depth. The route begins in Marrakech — a city full of colour, artisans, vibrant squares and unforgettable aromas.",
        "From there, we continue in a 4x4 crossing the High Atlas, discovering spectacular landscapes, remote hamlets and impressive gorges. We then reach the Erg Chebbi desert, with its endless dunes and magical atmosphere, where we experience sleeping under the stars.",
        "The route also crosses authentic places such as Rissani and its ancestral market, as well as oases, desert villages and an extra rest night at Kasbah Xaluca.",
      ],
    },
    fr: {
      title: "Marrakech · Erg Chebbi · Marrakech.",
      description_title: "Une semaine pour découvrir Marrakech, l'Atlas et le Sahara.",
      description: [
        "« Marrakech – Erg Chebbi – Marrakech » est un voyage pour découvrir en profondeur le sud du pays. L'itinéraire commence à Marrakech — ville colorée, parsemée d'artisans, aux places vibrantes et aux parfums inoubliables.",
        "De là, nous poursuivons en 4x4 à travers le Haut Atlas, à la découverte de paysages spectaculaires, de villages reculés et de gorges impressionnantes. Nous atteignons ensuite le désert de l'Erg Chebbi, ses dunes infinies et son atmosphère magique, pour une nuit sous les étoiles.",
        "L'itinéraire traverse aussi des lieux authentiques comme Rissani et son marché ancestral, des oasis, des villages du désert et une nuit supplémentaire de repos à la Kasbah Xaluca.",
      ],
    },
  },
  days: [
    DAY_MEM56_ARRIVAL_MARRAKECH,
    DAY_MEM56_MARRAKECH_VISIT,
    DAY_MEM23_ATLAS_DADES,
    DAY_MEM23_TODRA_BIVOUAC,
    DAY_MEM34_KHAMLIA_KASBAH,
    DAY_MEM67_ERFOUD_MARRAKECH,
    DAY_EM78_DEPARTURE,
  ],
  details: {
    includes: {
      es: [
        "Tres noches en Marrakech en Riad u Hotel 5* en régimen de alojamiento y desayuno",
        "Una noche en Boumalne Dades en Hotel Xaluca Dades 4* en régimen de media pensión",
        "Una noche en Erg Chebbi en bivouac de lujo en régimen de media pensión",
        "Una noche en Erfoud en Kasbah Xaluca en régimen de media pensión",
        "Comida «picnic» en el desierto el día 4",
        "Excursión en dromedario en el Erg Chebbi",
        "Vehículo 4x4 con chófer del día 3 al día 6",
        "Visita guiada por la Medina de Marrakech con guía local",
        "Visitas a la Kasbah de Aït Ben Haddou y al Palacio de la Bahía",
        "Transfers de aeropuerto en Marrakech",
        "Combustible del vehículo",
        "Seguro de asistencia en viaje",
      ],
      en: [
        "Three nights in Marrakech in a Riad or 5* Hotel, bed and breakfast",
        "One night in Boumalne Dades at Hotel Xaluca Dades 4*, half board",
        "One night in Erg Chebbi at a luxury bivouac, half board",
        "One night in Erfoud at Kasbah Xaluca, half board",
        "Desert «picnic» on day 4",
        "Camel ride in the Erg Chebbi",
        "Private 4x4 with driver from day 3 to day 6",
        "Guided walking tour of the Marrakech Medina with local guide",
        "Visits to the Aït Ben Haddou Kasbah and the Bahia Palace",
        "Airport transfers in Marrakech",
        "Vehicle fuel",
        "Travel assistance insurance",
      ],
      fr: [
        "Trois nuits à Marrakech en Riad ou Hôtel 5* en logement et petit déjeuner",
        "Une nuit à Boumalne Dadès à l'Hôtel Xaluca Dadès 4* en demi-pension",
        "Une nuit à l'Erg Chebbi en bivouac de luxe en demi-pension",
        "Une nuit à Erfoud au Kasbah Xaluca en demi-pension",
        "Déjeuner « pique-nique » dans le désert le jour 4",
        "Balade à dromadaire à l'Erg Chebbi",
        "Véhicule 4x4 avec chauffeur du jour 3 au jour 6",
        "Visite guidée de la Médina de Marrakech avec guide local",
        "Visites de la Kasbah d'Aït Ben Haddou et du Palais de la Bahia",
        "Transferts aéroport à Marrakech",
        "Carburant du véhicule",
        "Assurance assistance voyage",
      ],
    },
    excludes: {
      es: [
        "Bebidas",
        "Comidas de mediodía no especificadas",
        "Cenas en Marrakech",
        "Extras personales (quads, masajes, etc.)",
        "Vuelos",
        "Seguro de cancelación",
      ],
      en: [
        "Drinks",
        "Lunches not specified",
        "Dinners in Marrakech",
        "Personal extras (quads, massages, etc.)",
        "Flights",
        "Cancellation insurance",
      ],
      fr: [
        "Boissons",
        "Déjeuners non spécifiés",
        "Dîners à Marrakech",
        "Extras personnels (quads, massages, etc.)",
        "Vols",
        "Assurance annulation",
      ],
    },
    notes: {
      es: [
        "Opciones de vuelos: Royal Air Maroc, Vueling, Air Arabia, Ryanair",
        "Habitaciones dobles y triples · Suplemento individual 515 €",
        "Descuento niños 3-11 años: 215 € baja · 225 € alta",
        "Guías locales compartidos en temporada alta",
        "Chóferes de habla española limitados — se recomienda reservar con antelación",
        "Pasaporte con un mínimo de 3 meses de validez desde la fecha de regreso",
        "Actividades opcionales: Quads 70 € por vehículo (1 hora) · Spa y masajes directamente en los hoteles",
        "Seguro de cancelación opcional: 30 € por persona para viajes de hasta 10 días — debe contratarse al confirmar",
      ],
      en: [
        "Flight options: Royal Air Maroc, Vueling, Air Arabia, Ryanair",
        "Double and triple rooms · Single supplement €515",
        "Children 3-11 discount: €215 low season · €225 high season",
        "Local guides may be shared in high season",
        "Spanish-speaking drivers limited — book in advance",
        "Passport valid for at least 3 months from the return date",
        "Optional activities: Quads €70 per vehicle (1 hour) · Spa and massages at the hotels",
        "Optional cancellation insurance: €30 per person for trips up to 10 days — must be taken out at confirmation",
      ],
      fr: [
        "Options de vols : Royal Air Maroc, Vueling, Air Arabia, Ryanair",
        "Chambres doubles et triples · Supplément individuel 515 €",
        "Remise enfants 3-11 ans : 215 € basse saison · 225 € haute saison",
        "Guides locaux susceptibles d'être partagés en haute saison",
        "Chauffeurs hispanophones limités — réserver à l'avance",
        "Passeport valable au moins 3 mois après la date de retour",
        "Activités en option : Quads 70 € par véhicule (1 heure) · Spa et massages directement dans les hôtels",
        "Assurance annulation en option : 30 € par personne pour les voyages jusqu'à 10 jours — à souscrire à la confirmation",
      ],
    },
    terms: {
      es: [
        "Ficha de inscripción obligatoria",
        "Pago: 30% al reservar · 70% restante hasta 30 días antes de la salida",
        "Si el vuelo elegido requiere emisión inmediata: 100% del billete + 30% de los servicios terrestres",
        "Cancelación 45 días antes: 30% de gastos",
        "Cancelación 21 días antes: 100% de gastos",
        "Penalización fija de 50 € por reserva como gastos de gestión",
        "Los seguros no son reembolsables",
      ],
      en: [
        "Compulsory booking form",
        "Payment: 30% at booking · remaining 70% up to 30 days before departure",
        "If the chosen flight requires immediate issuance: 100% of the ticket + 30% of land services",
        "Cancellation 45 days before: 30% of costs",
        "Cancellation 21 days before: 100% of costs",
        "Fixed €50 penalty per booking as administrative fee",
        "Insurances are non-refundable",
      ],
      fr: [
        "Fiche d'inscription obligatoire",
        "Paiement : 30 % à la réservation · 70 % restants jusqu'à 30 jours avant le départ",
        "Si le vol choisi requiert une émission immédiate : 100 % du billet + 30 % des services terrestres",
        "Annulation 45 jours avant : 30 % de frais",
        "Annulation 21 jours avant : 100 % de frais",
        "Pénalité fixe de 50 € par réservation au titre des frais de gestion",
        "Les assurances ne sont pas remboursables",
      ],
    },
  },
};


/* ============================================================
   Marrakech → Erg Chebbi → Marrakech · 7 noches / 8 días
   Versión completa: añade un día extra de Alto Atlas Central
   (Boutaghrar + Dadès + Todra → Erfoud) entre Boumalne Dades y
   el bivouac. Dos noches en Kasbah Xaluca y tres en Marrakech.
============================================================ */

export const PROGRAM_MEM_78 = {
  routeId: "tourMarrakechLoop78",
  duration_key: "mem7n8d",
  duration: { es: "7 noches / 8 días", en: "7 nights / 8 days", fr: "7 nuits / 8 jours" },
  prices: { low: 1690, mid: 1890, high: 2090, premium: 2490 },
  reverse: false,
  meta: {
    es: {
      title: "Marrakech · Erg Chebbi · Marrakech.",
      description_title: "Ocho días para conocer Marrakech, el Atlas y el Sahara.",
      description: [
        "«Marrakech – Erg Chebbi – Marrakech» es un viaje para conocer a fondo el sur del país. La ruta comienza en Marrakech, una ciudad llena de colores, artesanos, plazas y aromas inolvidables.",
        "Desde allí el recorrido continúa en vehículo 4x4 atravesando el Alto Atlas, descubriendo paisajes espectaculares, pueblos bereberes y gargantas impresionantes. Más adelante se llega al Desierto del Erg Chebbi, un lugar mágico de dunas infinitas donde se vive la experiencia única de dormir bajo las estrellas.",
        "El itinerario también atraviesa lugares tan auténticos como Rissani y su mercado ancestral, oasis escondidos y pistas del desierto, con dos noches de relax en Kasbah Xaluca antes del regreso a Marrakech.",
      ],
    },
    en: {
      title: "Marrakech · Erg Chebbi · Marrakech.",
      description_title: "Eight days to discover Marrakech, the Atlas and the Sahara.",
      description: [
        "«Marrakech – Erg Chebbi – Marrakech» is a journey to discover the south of the country in depth. The route begins in Marrakech, a city full of colour, artisans, squares and unforgettable aromas.",
        "From there the journey continues in a 4x4 across the High Atlas, discovering spectacular landscapes, Berber villages and impressive gorges. Further on we reach the Erg Chebbi desert, a magical place of endless dunes where we have the unique experience of sleeping under the stars.",
        "The itinerary also crosses authentic places such as Rissani and its ancestral market, hidden oases and desert tracks, with two relaxing nights at Kasbah Xaluca before returning to Marrakech.",
      ],
    },
    fr: {
      title: "Marrakech · Erg Chebbi · Marrakech.",
      description_title: "Huit jours pour découvrir Marrakech, l'Atlas et le Sahara.",
      description: [
        "« Marrakech – Erg Chebbi – Marrakech » est un voyage pour découvrir en profondeur le sud du pays. L'itinéraire commence à Marrakech, ville colorée, parsemée d'artisans, de places et de parfums inoubliables.",
        "De là, le voyage se poursuit en 4x4 à travers le Haut Atlas, à la découverte de paysages spectaculaires, de villages berbères et de gorges impressionnantes. Nous atteignons ensuite le désert de l'Erg Chebbi, lieu magique aux dunes infinies pour l'expérience unique de dormir sous les étoiles.",
        "L'itinéraire traverse aussi des lieux aussi authentiques que Rissani et son marché ancestral, des oasis cachées et des pistes du désert, avec deux nuits de détente à la Kasbah Xaluca avant le retour à Marrakech.",
      ],
    },
  },
  days: [
    DAY_MEM56_ARRIVAL_MARRAKECH,
    DAY_MEM56_MARRAKECH_VISIT,
    DAY_MEM23_ATLAS_DADES,
    DAY_MEM45_ATLAS_CENTRAL,
    DAY_DESERT_BIVOUAC,
    DAY_MEM34_KHAMLIA_KASBAH,
    DAY_MEM67_ERFOUD_MARRAKECH,
    DAY_EM78_DEPARTURE,
  ],
  details: {
    includes: {
      es: [
        "Tres noches en Marrakech en Riad u Hotel 5* en régimen de alojamiento y desayuno",
        "Una noche en Boumalne Dades en Hotel Xaluca Dades 4* en régimen de media pensión",
        "Dos noches en Erfoud en Kasbah Xaluca en régimen de media pensión",
        "Una noche en Erg Chebbi en bivouac de lujo en régimen de media pensión",
        "Comida «picnic» en el desierto el día 5",
        "Excursión en dromedario en el Erg Chebbi",
        "Vehículo 4x4 con chófer del día 3 al día 7",
        "Visita guiada por la Medina de Marrakech con guía local",
        "Visitas a la Kasbah de Aït Ben Haddou y al Palacio de la Bahía",
        "Transfers de aeropuerto en Marrakech",
        "Combustible del vehículo",
        "Seguro de asistencia en viaje",
      ],
      en: [
        "Three nights in Marrakech in a Riad or 5* Hotel, bed and breakfast",
        "One night in Boumalne Dades at Hotel Xaluca Dades 4*, half board",
        "Two nights in Erfoud at Kasbah Xaluca, half board",
        "One night in Erg Chebbi at a luxury bivouac, half board",
        "Desert «picnic» on day 5",
        "Camel ride in the Erg Chebbi",
        "Private 4x4 with driver from day 3 to day 7",
        "Guided walking tour of the Marrakech Medina with local guide",
        "Visits to the Aït Ben Haddou Kasbah and the Bahia Palace",
        "Airport transfers in Marrakech",
        "Vehicle fuel",
        "Travel assistance insurance",
      ],
      fr: [
        "Trois nuits à Marrakech en Riad ou Hôtel 5* en logement et petit déjeuner",
        "Une nuit à Boumalne Dadès à l'Hôtel Xaluca Dadès 4* en demi-pension",
        "Deux nuits à Erfoud au Kasbah Xaluca en demi-pension",
        "Une nuit à l'Erg Chebbi en bivouac de luxe en demi-pension",
        "Déjeuner « pique-nique » dans le désert le jour 5",
        "Balade à dromadaire à l'Erg Chebbi",
        "Véhicule 4x4 avec chauffeur du jour 3 au jour 7",
        "Visite guidée de la Médina de Marrakech avec guide local",
        "Visites de la Kasbah d'Aït Ben Haddou et du Palais de la Bahia",
        "Transferts aéroport à Marrakech",
        "Carburant du véhicule",
        "Assurance assistance voyage",
      ],
    },
    excludes: {
      es: [
        "Bebidas",
        "Comidas de mediodía no especificadas",
        "Cenas en Marrakech",
        "Extras personales (quads, masajes, etc.)",
        "Vuelos",
        "Seguro de cancelación",
      ],
      en: [
        "Drinks",
        "Lunches not specified",
        "Dinners in Marrakech",
        "Personal extras (quads, massages, etc.)",
        "Flights",
        "Cancellation insurance",
      ],
      fr: [
        "Boissons",
        "Déjeuners non spécifiés",
        "Dîners à Marrakech",
        "Extras personnels (quads, massages, etc.)",
        "Vols",
        "Assurance annulation",
      ],
    },
    notes: {
      es: [
        "Opciones de vuelos: Royal Air Maroc, Vueling, Air Arabia, Ryanair",
        "Habitaciones dobles y triples · Suplemento individual 560 €",
        "Descuento niños 3-11 años: 260 € baja · 280 € alta",
        "Guías locales compartidos en temporada alta",
        "Chóferes de habla española limitados — se recomienda reservar con antelación",
        "Pasaporte con un mínimo de 3 meses de validez desde la fecha de regreso",
        "Actividades opcionales: Quads 70 € por vehículo (1 hora) · Spa y masajes directamente en los hoteles",
        "Seguro de cancelación opcional: 30 € por persona para viajes de hasta 10 días — debe contratarse al confirmar",
      ],
      en: [
        "Flight options: Royal Air Maroc, Vueling, Air Arabia, Ryanair",
        "Double and triple rooms · Single supplement €560",
        "Children 3-11 discount: €260 low season · €280 high season",
        "Local guides may be shared in high season",
        "Spanish-speaking drivers limited — book in advance",
        "Passport valid for at least 3 months from the return date",
        "Optional activities: Quads €70 per vehicle (1 hour) · Spa and massages at the hotels",
        "Optional cancellation insurance: €30 per person for trips up to 10 days — must be taken out at confirmation",
      ],
      fr: [
        "Options de vols : Royal Air Maroc, Vueling, Air Arabia, Ryanair",
        "Chambres doubles et triples · Supplément individuel 560 €",
        "Remise enfants 3-11 ans : 260 € basse saison · 280 € haute saison",
        "Guides locaux susceptibles d'être partagés en haute saison",
        "Chauffeurs hispanophones limités — réserver à l'avance",
        "Passeport valable au moins 3 mois après la date de retour",
        "Activités en option : Quads 70 € par véhicule (1 heure) · Spa et massages directement dans les hôtels",
        "Assurance annulation en option : 30 € par personne pour les voyages jusqu'à 10 jours — à souscrire à la confirmation",
      ],
    },
    terms: {
      es: [
        "Ficha de inscripción obligatoria",
        "Pago: 30% al reservar · 70% restante hasta 30 días antes de la salida",
        "Si el vuelo elegido requiere emisión inmediata: 100% del billete + 30% de los servicios terrestres",
        "Cancelación 45 días antes: 30% de gastos",
        "Cancelación 21 días antes: 100% de gastos",
        "Penalización fija de 50 € por reserva como gastos de gestión",
        "Los seguros no son reembolsables",
      ],
      en: [
        "Compulsory booking form",
        "Payment: 30% at booking · remaining 70% up to 30 days before departure",
        "If the chosen flight requires immediate issuance: 100% of the ticket + 30% of land services",
        "Cancellation 45 days before: 30% of costs",
        "Cancellation 21 days before: 100% of costs",
        "Fixed €50 penalty per booking as administrative fee",
        "Insurances are non-refundable",
      ],
      fr: [
        "Fiche d'inscription obligatoire",
        "Paiement : 30 % à la réservation · 70 % restants jusqu'à 30 jours avant le départ",
        "Si le vol choisi requiert une émission immédiate : 100 % du billet + 30 % des services terrestres",
        "Annulation 45 jours avant : 30 % de frais",
        "Annulation 21 jours avant : 100 % de frais",
        "Pénalité fixe de 50 € par réservation au titre des frais de gestion",
        "Les assurances ne sont pas remboursables",
      ],
    },
  },
};


/* ============================================================
   Marrakech → Essaouira → Marrakech · 4 noches / 5 días
   Combinado ciudad-costa: 2 noches en Marrakech + 2 noches en
   Essaouira con traslado entre ambas ciudades.
============================================================ */

export const DAY_MES_MARRAKECH_ESSAOUIRA = {
  route_id: "mes-marrakech-essaouira",
  id: "dia-3",
  image: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=2000&q=85",
  accent: "#5A7F9C",
  title: { es: "Marrakech → Essaouira", en: "Marrakech → Essaouira", fr: "Marrakech → Essaouira" },
  body: {
    es: "Salida hacia las 09:30 h con vehículo y chófer hacia Essaouira (aproximadamente 190 km de carretera). Llegada y tiempo libre para disfrutar de la ciudad: el puerto pesquero y sus gaviotas, las galerías de arte, los estudios de pintura, el ambiente bohemio y la música callejera. Recomendable comer pescado fresco junto al puerto, pasear por la medina amurallada y descubrir el ambiente atlántico tan especial que dio nombre a la «Perla del Atlántico». Cena y noche en Riad en la Medina u Hotel 5*.",
    en: "Departure around 09:30 by vehicle and driver to Essaouira (approximately 190 km on the road). Arrival and free time to enjoy the city: the fishing port and its seagulls, art galleries, painters' studios, the bohemian vibe and street music. We recommend a fresh-fish lunch by the harbour, a stroll through the walled medina and discovering the very particular Atlantic atmosphere that earned the «Pearl of the Atlantic» its nickname. Dinner and overnight at a Riad in the Medina or 5* Hotel.",
    fr: "Départ vers 09h30 en véhicule avec chauffeur vers Essaouira (environ 190 km de route). Arrivée et temps libre pour profiter de la ville : le port de pêche et ses mouettes, les galeries d'art, les ateliers de peintres, l'ambiance bohème et la musique de rue. Nous recommandons un déjeuner de poisson frais près du port, une balade dans la médina fortifiée et la découverte de l'atmosphère atlantique si particulière qui valut son surnom de « Perle de l'Atlantique ». Dîner et nuit en Riad dans la Médina ou Hôtel 5*.",
  },
  culture: [
    {
      title: { es: "Essaouira: la Perla del Atlántico", en: "Essaouira: the Pearl of the Atlantic", fr: "Essaouira : la Perle de l'Atlantique" },
      body: {
        es: "Antiguamente conocida como Mogador, Essaouira fue rediseñada en el siglo XVIII por el arquitecto francés Théodore Cornut bajo el sultán Mohammed III. Su medina amurallada, declarada Patrimonio de la UNESCO, es un ejemplo único de urbanismo planificado norteafricano.",
        en: "Formerly known as Mogador, Essaouira was redesigned in the 18th century by French architect Théodore Cornut under Sultan Mohammed III. Its walled medina, UNESCO World Heritage, is a unique example of planned North African urbanism.",
        fr: "Anciennement Mogador, Essaouira fut redessinée au XVIIIᵉ siècle par l'architecte français Théodore Cornut sous le sultan Mohammed III. Sa médina fortifiée, Patrimoine de l'UNESCO, est un exemple unique d'urbanisme planifié nord-africain.",
      },
    },
    {
      title: { es: "El puerto pesquero", en: "The fishing port", fr: "Le port de pêche" },
      body: {
        es: "Uno de los puertos pesqueros más antiguos y activos de Marruecos. Su lonja matinal, las barcas azules y las decenas de gaviotas crean una de las postales más icónicas del país.",
        en: "One of Morocco's oldest and busiest fishing ports. The morning fish market, the blue boats and the dozens of seagulls create one of the country's most iconic postcards.",
        fr: "L'un des plus anciens et actifs ports de pêche du Maroc. La criée matinale, les barques bleues et les dizaines de mouettes composent l'une des plus emblématiques cartes postales du pays.",
      },
    },
    {
      title: { es: "Arte, música y ambiente bohemio", en: "Art, music and bohemian vibe", fr: "Art, musique et ambiance bohème" },
      body: {
        es: "Essaouira ha sido refugio de artistas y músicos desde los años 60 — Jimi Hendrix, Cat Stevens, Orson Welles. Hoy alberga galerías de arte contemporáneo y celebra cada junio el Festival Gnaoua, referente mundial de músicas del mundo.",
        en: "Essaouira has been a haven for artists and musicians since the 1960s — Jimi Hendrix, Cat Stevens, Orson Welles. Today it hosts contemporary art galleries and, every June, the world-renowned Gnaoua World Music Festival.",
        fr: "Essaouira est un refuge d'artistes et musiciens depuis les années 60 — Jimi Hendrix, Cat Stevens, Orson Welles. Elle accueille aujourd'hui des galeries d'art contemporain et, chaque juin, le célèbre Festival Gnaoua des musiques du monde.",
      },
    },
  ],
};

export const DAY_MES_ESSAOUIRA_FREE = {
  route_id: "mes-essaouira-free",
  id: "dia-4",
  image: "https://images.unsplash.com/photo-1542401886-65d6c61db217?auto=format&fit=crop&w=2000&q=85",
  accent: "#3A4A5F",
  title: { es: "Día libre en Essaouira", en: "Free day in Essaouira", fr: "Journée libre à Essaouira" },
  body: {
    es: "Jornada libre para disfrutar de la ciudad a tu ritmo: pasear por la playa, relajarse frente al Atlántico, descubrir las galerías, recorrer las murallas (skala), perderse en la medina o tomar un té en una terraza con vistas al océano. Para quienes buscan algo más activo, Essaouira es uno de los mejores destinos del mundo para surf, kitesurf y windsurf gracias a los famosos alisios. Cena y noche en Riad en la Medina u Hotel 5*.",
    en: "A free day to enjoy the city at your own pace: walk on the beach, relax facing the Atlantic, discover the galleries, walk the ramparts (skala), get lost in the medina or have tea on a terrace overlooking the ocean. For those after something more active, Essaouira is one of the world's best destinations for surfing, kitesurfing and windsurfing thanks to the famous trade winds. Dinner and overnight at a Riad in the Medina or 5* Hotel.",
    fr: "Journée libre pour profiter de la ville à votre rythme : balade sur la plage, détente face à l'Atlantique, découverte des galeries, parcours des remparts (skala), flânerie dans la médina ou thé sur une terrasse face à l'océan. Pour les plus actifs, Essaouira est l'une des meilleures destinations mondiales pour le surf, kitesurf et windsurf grâce aux célèbres alizés. Dîner et nuit en Riad dans la Médina ou Hôtel 5*.",
  },
  wellness: [
    { es: "Playa y paseo marítimo", en: "Beach & seafront", fr: "Plage et front de mer" },
    { es: "Surf · Kitesurf · Windsurf", en: "Surf · Kitesurf · Windsurf", fr: "Surf · Kitesurf · Windsurf" },
    { es: "Skala de la Kasbah", en: "Skala of the Kasbah", fr: "Skala de la Kasbah" },
    { es: "Galerías de arte", en: "Art galleries", fr: "Galeries d'art" },
    { es: "Lonja del puerto", en: "Fish market", fr: "Criée du port" },
  ],
  culture: [
    {
      title: { es: "Capital mundial del kitesurf", en: "World capital of kitesurfing", fr: "Capitale mondiale du kitesurf" },
      body: {
        es: "La playa de Essaouira es famosa por los vientos alisios que soplan de marzo a octubre, convirtiéndola en una de las mejores escuelas mundiales de kitesurf y windsurf, con eventos PWA y campeonatos europeos cada temporada.",
        en: "Essaouira's beach is famous for the trade winds blowing from March to October, making it one of the world's top kitesurf and windsurf schools, hosting PWA events and European championships every season.",
        fr: "La plage d'Essaouira est célèbre pour les alizés qui soufflent de mars à octobre, ce qui en fait l'une des meilleures écoles mondiales de kitesurf et windsurf, accueillant chaque saison événements PWA et championnats européens.",
      },
    },
    {
      title: { es: "Skala y murallas portuguesas", en: "Skala and Portuguese ramparts", fr: "Skala et remparts portugais" },
      body: {
        es: "Las murallas y cañones de bronce de la Skala de la Kasbah son uno de los símbolos de Essaouira. Sirvieron de escenario para clásicos del cine como Otelo de Orson Welles (1952) y, más recientemente, Juego de Tronos (Astapor).",
        en: "The ramparts and bronze cannons of the Skala of the Kasbah are one of Essaouira's symbols. They have been the setting for film classics like Orson Welles's Othello (1952) and, more recently, Game of Thrones (Astapor).",
        fr: "Les remparts et canons de bronze de la Skala de la Kasbah sont l'un des symboles d'Essaouira. Ils ont servi de décor à des classiques du cinéma comme Othello d'Orson Welles (1952) et, plus récemment, à Game of Thrones (Astapor).",
      },
    },
    {
      title: { es: "Las puertas azules de la medina", en: "The blue doors of the medina", fr: "Les portes bleues de la médina" },
      body: {
        es: "El característico azul de las puertas y postigos de la medina, junto a la blancura de la cal, dan a Essaouira un aspecto único en el panorama marroquí, más cercano a las islas del Egeo que al desierto.",
        en: "The distinctive blue of the medina's doors and shutters, against the whitewashed walls, gives Essaouira a unique look in the Moroccan landscape — closer to the Aegean islands than to the desert.",
        fr: "Le bleu caractéristique des portes et volets de la médina, sur la blancheur de la chaux, donne à Essaouira un aspect unique dans le paysage marocain — plus proche des îles de la mer Égée que du désert.",
      },
    },
  ],
};

export const PROGRAM_MES_45 = {
  routeId: "tourMarrakechEss45",
  duration_key: "mes4n5d",
  duration: { es: "4 noches / 5 días", en: "4 nights / 5 days", fr: "4 nuits / 5 jours" },
  prices: { low: 890, mid: 1090, high: 1290, premium: 1490 },
  reverse: false,
  meta: {
    es: {
      title: "Marrakech – Essaouira – Marrakech.",
      description_title: "Un combinado entre dos imprescindibles de Marruecos.",
      description: [
        "Te presentamos un combinado entre dos lugares imprescindibles de Marruecos. Por un lado, la vibrante Marrakech, con su famosa Plaza Djemaa el-Fna, sus zocos llenos de vida, palacios, jardines y talleres artesanales.",
        "Por otro lado, Essaouira, conocida como la «Perla del Atlántico» — una encantadora ciudad costera de pescadores ideal para relajarse y pasear, declarada Patrimonio de la Humanidad por la UNESCO.",
      ],
    },
    en: {
      title: "Marrakech – Essaouira – Marrakech.",
      description_title: "A pairing of two Moroccan essentials.",
      description: [
        "A pairing of two essential places in Morocco. On one hand the vibrant Marrakech, with its famous Djemaa el-Fna square, its lively souks, palaces, gardens and artisan workshops.",
        "On the other hand Essaouira, known as the «Pearl of the Atlantic» — a charming coastal fishing town ideal for strolling and unwinding, listed as UNESCO World Heritage.",
      ],
    },
    fr: {
      title: "Marrakech – Essaouira – Marrakech.",
      description_title: "Un combiné de deux incontournables du Maroc.",
      description: [
        "Un combiné de deux lieux incontournables du Maroc. D'un côté la vibrante Marrakech, avec sa célèbre place Djemaa el-Fna, ses souks animés, palais, jardins et ateliers d'artisans.",
        "De l'autre Essaouira, « la Perle de l'Atlantique » — charmante ville côtière de pêcheurs idéale pour flâner et se détendre, classée Patrimoine de l'Humanité de l'UNESCO.",
      ],
    },
  },
  days: [
    DAY_MEM56_ARRIVAL_MARRAKECH,
    DAY_MEM56_MARRAKECH_VISIT,
    DAY_MES_MARRAKECH_ESSAOUIRA,
    DAY_MES_ESSAOUIRA_FREE,
    DAY_EM78_DEPARTURE,
  ],
  details: {
    includes: {
      es: [
        "Dos noches en Marrakech en Riad o Hotel 4* / 5* en régimen de alojamiento y desayuno",
        "Dos noches en Essaouira en Riad o Hotel 5* en régimen de media pensión",
        "Visita guiada por la Medina de Marrakech con guía local",
        "Visita al Palacio de la Bahía",
        "Transfer aeropuerto Marrakech → alojamiento",
        "Transfer Marrakech → Essaouira con vehículo y chófer",
        "Transfer Essaouira → aeropuerto de Marrakech",
        "Seguro de asistencia en viaje",
        "Teléfono de asistencia 24 horas",
      ],
      en: [
        "Two nights in Marrakech in a Riad or 4* / 5* Hotel, bed and breakfast",
        "Two nights in Essaouira in a Riad or 5* Hotel, half board",
        "Guided walking tour of the Marrakech Medina with local guide",
        "Visit to the Bahia Palace",
        "Marrakech airport → accommodation transfer",
        "Marrakech → Essaouira transfer with vehicle and driver",
        "Essaouira → Marrakech airport transfer",
        "Travel assistance insurance",
        "24-hour assistance phone",
      ],
      fr: [
        "Deux nuits à Marrakech en Riad ou Hôtel 4* / 5* en logement et petit déjeuner",
        "Deux nuits à Essaouira en Riad ou Hôtel 5* en demi-pension",
        "Visite guidée de la Médina de Marrakech avec guide local",
        "Visite du Palais de la Bahia",
        "Transfert aéroport Marrakech → hébergement",
        "Transfert Marrakech → Essaouira avec véhicule et chauffeur",
        "Transfert Essaouira → aéroport de Marrakech",
        "Assurance assistance voyage",
        "Téléphone d'assistance 24 h",
      ],
    },
    excludes: {
      es: [
        "Bebidas",
        "Comidas de mediodía",
        "Cenas no especificadas",
        "Entradas no detalladas",
        "Vuelos",
        "Seguro de cancelación",
      ],
      en: [
        "Drinks",
        "Lunches",
        "Dinners not specified",
        "Entrance fees not detailed",
        "Flights",
        "Cancellation insurance",
      ],
      fr: [
        "Boissons",
        "Déjeuners",
        "Dîners non spécifiés",
        "Entrées non détaillées",
        "Vols",
        "Assurance annulation",
      ],
    },
    notes: {
      es: [
        "Opciones de vuelos: Royal Air Maroc, Vueling, Ryanair — vuelos directos desde varias ciudades",
        "Suplemento habitación individual: 260 € baja · 275 € alta",
        "Descuento niños 3-11 años en habitación compartida con dos adultos: 110 € baja · 125 € alta",
        "Los guías locales pueden compartirse en temporada alta",
        "Pasaporte obligatorio con vigencia mínima de 6 meses",
        "El nombre del riad o el hotel se confirma tras la reserva",
        "Posibilidad de consultar hoteles concretos incluidos en el programa",
        "Seguro de cancelación opcional: 45 € por persona para viajes de hasta 9 días — debe contratarse al confirmar",
      ],
      en: [
        "Flight options: Royal Air Maroc, Vueling, Ryanair — direct flights from various cities",
        "Single room supplement: €260 low season · €275 high season",
        "Children 3-11 discount sharing room with two adults: €110 low season · €125 high season",
        "Local guides may be shared in high season",
        "Passport valid for at least 6 months required",
        "Riad or hotel name is confirmed after booking",
        "Specific included hotels can be requested",
        "Optional cancellation insurance: €45 per person for trips up to 9 days — must be taken out at confirmation",
      ],
      fr: [
        "Options de vols : Royal Air Maroc, Vueling, Ryanair — vols directs depuis plusieurs villes",
        "Supplément chambre individuelle : 260 € basse · 275 € haute",
        "Remise enfants 3-11 ans en chambre partagée avec deux adultes : 110 € basse · 125 € haute",
        "Guides locaux susceptibles d'être partagés en haute saison",
        "Passeport valable au moins 6 mois obligatoire",
        "Le nom du riad ou de l'hôtel est confirmé après la réservation",
        "Les hôtels spécifiques inclus peuvent être consultés",
        "Assurance annulation en option : 45 € par personne pour les voyages jusqu'à 9 jours — à souscrire à la confirmation",
      ],
    },
    terms: {
      es: [
        "30% del importe total al confirmar la reserva",
        "70% restante hasta 30 días antes de la salida",
        "Si el vuelo requiere emisión inmediata: 100% del billete + 30% de los servicios terrestres",
        "Cancelación 45 días antes: 30% de gastos · 21 días antes: 100% de gastos",
        "Penalización fija de 50 € por reserva como gastos de gestión",
        "Las condiciones cubren los servicios terrestres; los vuelos se rigen por la política de cada aerolínea",
        "Los seguros no son reembolsables",
      ],
      en: [
        "30% of total at booking confirmation",
        "Remaining 70% up to 30 days before departure",
        "If the flight requires immediate issuance: 100% of the ticket + 30% of land services",
        "Cancellation 45 days before: 30% of costs · 21 days before: 100% of costs",
        "Fixed €50 penalty per booking as administrative fee",
        "Conditions cover land services; flights are governed by each airline's policy",
        "Insurances are non-refundable",
      ],
      fr: [
        "30 % du total à la confirmation de la réservation",
        "70 % restants jusqu'à 30 jours avant le départ",
        "Si le vol requiert une émission immédiate : 100 % du billet + 30 % des services terrestres",
        "Annulation 45 jours avant : 30 % de frais · 21 jours avant : 100 % de frais",
        "Pénalité fixe de 50 € par réservation au titre des frais de gestion",
        "Les conditions couvrent les services terrestres ; les vols suivent la politique de chaque compagnie",
        "Les assurances ne sont pas remboursables",
      ],
    },
  },
};


/* ============================================================
   Marrakech → Essaouira → Marrakech · 6 noches / 7 días
   Versión extendida con un día libre adicional en Marrakech y
   un segundo día libre en Essaouira (3 noches en cada ciudad).
============================================================ */

export const DAY_MES67_FREE_MARRAKECH = {
  route_id: "mes67-free-marrakech",
  id: "dia-3",
  image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=2000&q=85",
  accent: "#A07042",
  title: { es: "Día libre en Marrakech", en: "Free day in Marrakech", fr: "Journée libre à Marrakech" },
  body: {
    es: "Jornada libre para descubrir Marrakech a tu ritmo: practicar el arte del regateo en los zocos, perderse por la Medina y descubrir rincones menos turísticos como el barrio de los curtidores, los jardines Majorelle o el Museo Yves Saint Laurent. También existe la posibilidad de contratar excursiones facultativas a media jornada o día completo — Valle de Ourika, Cascadas de Ouzoud, Tres Valles del Atlas o, con pernoctación, una incursión al desierto de Agafay. Alojamiento en Riad en la Medina u Hotel 4* / 5*.",
    en: "A free day to discover Marrakech at your own pace: practise the art of haggling in the souks, get lost in the Medina and explore less touristy corners such as the tanners' quarter, the Majorelle Gardens or the Yves Saint Laurent Museum. You can also book optional half- or full-day excursions — Ourika Valley, Ouzoud Waterfalls, Atlas Three Valleys or, with an overnight, an Agafay desert escape. Overnight in a Riad in the Medina or 4* / 5* Hotel.",
    fr: "Journée libre pour découvrir Marrakech à votre rythme : pratiquer l'art du marchandage dans les souks, vous perdre dans la Médina et explorer des coins moins touristiques comme le quartier des tanneurs, les Jardins Majorelle ou le Musée Yves Saint Laurent. Possibilité de réserver des excursions facultatives en demi-journée ou journée complète — Vallée de l'Ourika, Cascades d'Ouzoud, Trois Vallées de l'Atlas ou, avec nuitée, escapade au désert d'Agafay. Nuit en Riad dans la Médina ou Hôtel 4* / 5*.",
  },
  culture: [
    {
      title: { es: "Jardines Majorelle e Yves Saint Laurent", en: "Majorelle Gardens & Yves Saint Laurent", fr: "Jardins Majorelle et Yves Saint Laurent" },
      body: {
        es: "Creados por el pintor francés Jacques Majorelle en los años 20 y restaurados por Pierre Bergé e Yves Saint Laurent en 1980, los jardines combinan más de 300 especies vegetales con el icónico azul cobalto «bleu Majorelle». A pocos pasos, el Museo Yves Saint Laurent reúne 50 años de moda.",
        en: "Created by French painter Jacques Majorelle in the 1920s and restored by Pierre Bergé and Yves Saint Laurent in 1980, the gardens combine over 300 plant species with the iconic cobalt blue «bleu Majorelle». A few steps away, the Yves Saint Laurent Museum spans 50 years of fashion.",
        fr: "Créés par le peintre français Jacques Majorelle dans les années 1920 et restaurés par Pierre Bergé et Yves Saint Laurent en 1980, les jardins associent plus de 300 espèces végétales à l'iconique bleu cobalt « bleu Majorelle ». À quelques pas, le Musée Yves Saint Laurent retrace 50 ans de mode.",
      },
    },
    {
      title: { es: "Excursión al Valle de Ourika", en: "Excursion to the Ourika Valley", fr: "Excursion à la Vallée de l'Ourika" },
      body: {
        es: "Una de las escapadas favoritas desde Marrakech, a apenas 60 km al sur. El valle del río Ourika permite descubrir aldeas bereberes, cascadas, mercados locales y los primeros picos del Alto Atlas en menos de un día.",
        en: "One of the favourite escapes from Marrakech, just 60 km south. The Ourika river valley showcases Berber villages, waterfalls, local markets and the first peaks of the High Atlas in less than a day.",
        fr: "L'une des escapades préférées depuis Marrakech, à seulement 60 km au sud. La vallée de l'Ourika permet de découvrir villages berbères, cascades, marchés locaux et les premiers sommets du Haut Atlas en moins d'une journée.",
      },
    },
    {
      title: { es: "Cascadas de Ouzoud", en: "Ouzoud Waterfalls", fr: "Cascades d'Ouzoud" },
      body: {
        es: "Las cataratas más altas del norte de África, con 110 metros de caída en tres niveles. Excursión de día completo desde Marrakech (150 km), ideal para combinar naturaleza, monos magot en libertad y baño bajo la cascada.",
        en: "The highest waterfalls in North Africa, with a 110-metre drop in three tiers. A full-day trip from Marrakech (150 km), ideal to combine nature, free-roaming Barbary macaques and a swim at the foot of the falls.",
        fr: "Les chutes les plus hautes d'Afrique du Nord, avec 110 mètres de dénivelé sur trois niveaux. Excursion à la journée depuis Marrakech (150 km), idéale pour combiner nature, macaques en liberté et baignade au pied de la cascade.",
      },
    },
  ],
};

export const DAY_MES67_ESSAOUIRA_FREE_2 = {
  route_id: "mes67-essaouira-free-2",
  id: "dia-6",
  image: "https://images.unsplash.com/photo-1542401886-65d6c61db217?auto=format&fit=crop&w=2000&q=85",
  accent: "#3A4A5F",
  title: { es: "Segundo día libre en Essaouira", en: "Second free day in Essaouira", fr: "Deuxième journée libre à Essaouira" },
  body: {
    es: "Nueva jornada libre para seguir disfrutando del ambiente costero a tu aire: playa, paseos por el puerto y la medina, sesiones de surf o kitesurf, relax frente al Atlántico o una visita a las pequeñas islas Purpurarias en barca privada. Buen momento también para una clase de cocina marroquí o un té con dulces en una azotea con vistas al océano. Cena y noche en Riad en la Medina u Hotel 5*.",
    en: "Another free day to enjoy the coastal vibe your way: beach, walks around the harbour and medina, surf or kitesurf sessions, relaxing facing the Atlantic, or a private boat trip to the small Purpuraires Islands. A great moment too for a Moroccan cooking class or tea and pastries on a rooftop overlooking the ocean. Dinner and overnight at a Riad in the Medina or 5* Hotel.",
    fr: "Nouvelle journée libre pour profiter de l'ambiance côtière à votre façon : plage, balades autour du port et de la médina, sessions de surf ou kitesurf, détente face à l'Atlantique ou excursion privée en barque vers les petites îles Purpuraires. C'est aussi le bon moment pour un cours de cuisine marocaine ou un thé pâtisseries sur un toit-terrasse face à l'océan. Dîner et nuit en Riad dans la Médina ou Hôtel 5*.",
  },
  wellness: [
    { es: "Excursión a las islas Purpurarias", en: "Purpuraires Islands trip", fr: "Excursion aux îles Purpuraires" },
    { es: "Clases de cocina marroquí", en: "Moroccan cooking class", fr: "Cours de cuisine marocaine" },
    { es: "Surf · Kitesurf · Windsurf", en: "Surf · Kitesurf · Windsurf", fr: "Surf · Kitesurf · Windsurf" },
    { es: "Hammam y masajes", en: "Hammam & massages", fr: "Hammam & massages" },
    { es: "Tarde de azotea con vistas", en: "Rooftop afternoon", fr: "Après-midi sur les toits" },
  ],
  culture: [
    {
      title: { es: "Las islas Purpurarias", en: "The Purpuraires Islands", fr: "Les îles Purpuraires" },
      body: {
        es: "Frente a Essaouira, este pequeño archipiélago fue famoso en la Antigüedad por la producción del codiciado tinte púrpura — extraído de moluscos por los fenicios. Hoy es reserva natural protegida y refugio de la única colonia de halcones Eleonora del Magreb.",
        en: "Off Essaouira, this small archipelago was famous in Antiquity for producing the prized purple dye — extracted from molluscs by the Phoenicians. Today it is a protected nature reserve and home to the Maghreb's only Eleonora's falcon colony.",
        fr: "Face à Essaouira, ce petit archipel était célèbre dans l'Antiquité pour la production du précieux pourpre, extrait de mollusques par les Phéniciens. Aujourd'hui réserve naturelle protégée, il abrite la seule colonie de faucons d'Éléonore du Maghreb.",
      },
    },
    {
      title: { es: "Festival Gnaoua y músicas del mundo", en: "Gnaoua & World Music Festival", fr: "Festival Gnaoua et musiques du monde" },
      body: {
        es: "Cada año en junio, Essaouira acoge uno de los grandes festivales gratuitos del Magreb, con conciertos al aire libre que mezclan la espiritual música Gnawa con artistas de jazz, blues, electrónica y world music de todo el planeta.",
        en: "Every June, Essaouira hosts one of the Maghreb's great free festivals, with open-air concerts blending the spiritual Gnawa music with jazz, blues, electronic and world music artists from around the planet.",
        fr: "Chaque année en juin, Essaouira accueille l'un des grands festivals gratuits du Maghreb, avec des concerts en plein air mêlant la musique spirituelle Gnawa à des artistes de jazz, blues, électronique et musiques du monde.",
      },
    },
    {
      title: { es: "Cocina atlántica de Essaouira", en: "Essaouira's Atlantic cuisine", fr: "Cuisine atlantique d'Essaouira" },
      body: {
        es: "La gastronomía local destaca por la frescura del pescado: sardinas a la brasa, tagine de pescado al azafrán, ostras del banco de Oualidia y argán como producto estrella. Las parrillas del puerto son una experiencia única.",
        en: "Local cuisine stands out for fresh fish: grilled sardines, saffron fish tagine, Oualidia oysters and argan oil as a star ingredient. The harbour's grills are a one-of-a-kind experience.",
        fr: "La cuisine locale brille par la fraîcheur du poisson : sardines grillées, tagine de poisson au safran, huîtres de Oualidia et huile d'argan comme produit star. Les grillades du port sont une expérience unique.",
      },
    },
  ],
};

export const PROGRAM_MES_67 = {
  routeId: "tourMarrakechEss67",
  duration_key: "mes6n7d",
  duration: { es: "6 noches / 7 días", en: "6 nights / 7 days", fr: "6 nuits / 7 jours" },
  prices: { low: 1190, mid: 1390, high: 1590, premium: 1890 },
  reverse: false,
  meta: {
    es: {
      title: "Marrakech – Essaouira – Marrakech.",
      description_title: "Un combinado profundo entre dos imprescindibles.",
      description: [
        "Te presentamos un combinado entre dos lugares imprescindibles de Marruecos. Por un lado, la vibrante Marrakech, con su famosa Plaza Djemaa el-Fna, sus zocos llenos de vida, palacios, jardines y talleres artesanales.",
        "Por otro lado, Essaouira, conocida como la «Perla del Atlántico» — una encantadora ciudad costera de pescadores ideal para relajarse y pasear, también declarada Patrimonio de la Humanidad por la UNESCO.",
      ],
    },
    en: {
      title: "Marrakech – Essaouira – Marrakech.",
      description_title: "A deeper pairing of two essentials.",
      description: [
        "A pairing of two essential places in Morocco. On one hand the vibrant Marrakech, with its famous Djemaa el-Fna square, its lively souks, palaces, gardens and artisan workshops.",
        "On the other hand Essaouira, known as the «Pearl of the Atlantic» — a charming coastal fishing town ideal for strolling and unwinding, also a UNESCO World Heritage site.",
      ],
    },
    fr: {
      title: "Marrakech – Essaouira – Marrakech.",
      description_title: "Un combiné plus profond de deux incontournables.",
      description: [
        "Un combiné de deux lieux incontournables du Maroc. D'un côté la vibrante Marrakech, avec sa célèbre place Djemaa el-Fna, ses souks animés, palais, jardins et ateliers d'artisans.",
        "De l'autre Essaouira, « la Perle de l'Atlantique » — charmante ville côtière de pêcheurs idéale pour flâner et se détendre, également classée Patrimoine de l'Humanité de l'UNESCO.",
      ],
    },
  },
  days: [
    DAY_MEM56_ARRIVAL_MARRAKECH,
    DAY_MEM56_MARRAKECH_VISIT,
    DAY_MES67_FREE_MARRAKECH,
    DAY_MES_MARRAKECH_ESSAOUIRA,
    DAY_MES_ESSAOUIRA_FREE,
    DAY_MES67_ESSAOUIRA_FREE_2,
    DAY_EM78_DEPARTURE,
  ],
  details: {
    includes: {
      es: [
        "Tres noches en Marrakech en Riad o Hotel 4* / 5* en régimen de alojamiento y desayuno",
        "Tres noches en Essaouira en Riad o Hotel 5* en régimen de media pensión",
        "Visita guiada por la Medina de Marrakech con guía local",
        "Visita al Palacio de la Bahía",
        "Transfer aeropuerto Marrakech → alojamiento",
        "Transfer Marrakech → Essaouira con vehículo y chófer",
        "Transfer Essaouira → aeropuerto de Marrakech",
        "Seguro de asistencia en viaje",
        "Teléfono de asistencia 24 horas",
      ],
      en: [
        "Three nights in Marrakech in a Riad or 4* / 5* Hotel, bed and breakfast",
        "Three nights in Essaouira in a Riad or 5* Hotel, half board",
        "Guided walking tour of the Marrakech Medina with local guide",
        "Visit to the Bahia Palace",
        "Marrakech airport → accommodation transfer",
        "Marrakech → Essaouira transfer with vehicle and driver",
        "Essaouira → Marrakech airport transfer",
        "Travel assistance insurance",
        "24-hour assistance phone",
      ],
      fr: [
        "Trois nuits à Marrakech en Riad ou Hôtel 4* / 5* en logement et petit déjeuner",
        "Trois nuits à Essaouira en Riad ou Hôtel 5* en demi-pension",
        "Visite guidée de la Médina de Marrakech avec guide local",
        "Visite du Palais de la Bahia",
        "Transfert aéroport Marrakech → hébergement",
        "Transfert Marrakech → Essaouira avec véhicule et chauffeur",
        "Transfert Essaouira → aéroport de Marrakech",
        "Assurance assistance voyage",
        "Téléphone d'assistance 24 h",
      ],
    },
    excludes: {
      es: [
        "Bebidas",
        "Comidas de mediodía",
        "Cenas no especificadas",
        "Entradas no detalladas",
        "Vuelos",
        "Seguro de cancelación",
      ],
      en: [
        "Drinks",
        "Lunches",
        "Dinners not specified",
        "Entrance fees not detailed",
        "Flights",
        "Cancellation insurance",
      ],
      fr: [
        "Boissons",
        "Déjeuners",
        "Dîners non spécifiés",
        "Entrées non détaillées",
        "Vols",
        "Assurance annulation",
      ],
    },
    notes: {
      es: [
        "Opciones de vuelos: Royal Air Maroc, Vueling, Air Arabia, Ryanair",
        "Suplemento habitación individual: 390 € baja · 410 € alta",
        "Descuento niños 3-11 años en habitación compartida con dos adultos: 165 € baja · 185 € alta",
        "Los guías locales pueden compartirse en temporada alta",
        "Pasaporte obligatorio con vigencia mínima de 6 meses",
        "El nombre del riad o el hotel se confirma tras la reserva",
        "Posibilidad de consultar hoteles concretos incluidos en el programa",
        "Seguro de cancelación opcional: 45 € por persona para viajes de hasta 9 días — debe contratarse al confirmar",
      ],
      en: [
        "Flight options: Royal Air Maroc, Vueling, Air Arabia, Ryanair",
        "Single room supplement: €390 low season · €410 high season",
        "Children 3-11 discount sharing room with two adults: €165 low season · €185 high season",
        "Local guides may be shared in high season",
        "Passport valid for at least 6 months required",
        "Riad or hotel name is confirmed after booking",
        "Specific included hotels can be requested",
        "Optional cancellation insurance: €45 per person for trips up to 9 days — must be taken out at confirmation",
      ],
      fr: [
        "Options de vols : Royal Air Maroc, Vueling, Air Arabia, Ryanair",
        "Supplément chambre individuelle : 390 € basse · 410 € haute",
        "Remise enfants 3-11 ans en chambre partagée avec deux adultes : 165 € basse · 185 € haute",
        "Guides locaux susceptibles d'être partagés en haute saison",
        "Passeport valable au moins 6 mois obligatoire",
        "Le nom du riad ou de l'hôtel est confirmé après la réservation",
        "Les hôtels spécifiques inclus peuvent être consultés",
        "Assurance annulation en option : 45 € par personne pour les voyages jusqu'à 9 jours — à souscrire à la confirmation",
      ],
    },
    terms: {
      es: [
        "30% del importe total al confirmar la reserva",
        "70% restante hasta 30 días antes de la salida",
        "Si el vuelo requiere emisión inmediata: 100% del billete + 30% de los servicios terrestres",
        "Cancelación 45 días antes: 30% de gastos",
        "Cancelación 21 días antes: 100% de gastos",
        "Penalización fija de 50 € por reserva como gastos de gestión",
        "Las condiciones cubren los servicios terrestres; los vuelos se rigen por la política de cada aerolínea",
        "Los seguros de cancelación no son reembolsables",
      ],
      en: [
        "30% of total at booking confirmation",
        "Remaining 70% up to 30 days before departure",
        "If the flight requires immediate issuance: 100% of the ticket + 30% of land services",
        "Cancellation 45 days before: 30% of costs",
        "Cancellation 21 days before: 100% of costs",
        "Fixed €50 penalty per booking as administrative fee",
        "Conditions cover land services; flights are governed by each airline's policy",
        "Cancellation insurances are non-refundable",
      ],
      fr: [
        "30 % du total à la confirmation de la réservation",
        "70 % restants jusqu'à 30 jours avant le départ",
        "Si le vol requiert une émission immédiate : 100 % du billet + 30 % des services terrestres",
        "Annulation 45 jours avant : 30 % de frais",
        "Annulation 21 jours avant : 100 % de frais",
        "Pénalité fixe de 50 € par réservation au titre des frais de gestion",
        "Les conditions couvrent les services terrestres ; les vols suivent la politique de chaque compagnie",
        "Les assurances annulation ne sont pas remboursables",
      ],
    },
  },
};


/* ============================================================
   Fez → Atlas → Errachidia · 5 noches / 6 días
   De la medina medieval de Fez al desierto, atravesando los
   cedros del Medio Atlas y el lago Aguelmame Sidi Ali.
============================================================ */

export const DAY_FAE_ARRIVAL_FEZ = {
  route_id: "fae-arrival-fez",
  id: "dia-1",
  image: "https://images.unsplash.com/photo-1597212618440-806262de4f6b?auto=format&fit=crop&w=2000&q=85",
  accent: "#5A7F9C",
  title: { es: "Llegada a Fez", en: "Arrival in Fez", fr: "Arrivée à Fès" },
  body: {
    es: "Vuelo desde el aeropuerto de origen hacia Fez. Recepción en el aeropuerto y traslado al Riad en la Medina o Hotel 4*. Cena y alojamiento. Dependiendo de la hora de llegada, la visita guiada de Fez puede adelantarse a este mismo día — un primer paseo nocturno por la Medina, la mejor manera de adentrarse en una de las ciudades imperiales más fascinantes del Magreb.",
    en: "Flight from your home airport to Fez. Reception at the airport and transfer to a Riad in the Medina or 4* Hotel. Dinner and overnight. Depending on your arrival time, the guided tour of Fez can be brought forward to this day — a first evening walk through the Medina, the best way to step into one of the Maghreb's most fascinating imperial cities.",
    fr: "Vol depuis votre aéroport d'origine vers Fès. Accueil à l'aéroport et transfert au Riad dans la Médina ou Hôtel 4*. Dîner et nuit. Selon l'heure d'arrivée, la visite guidée de Fès peut être avancée à cette journée — une première balade nocturne dans la Médina, idéale pour entrer dans l'une des villes impériales les plus fascinantes du Maghreb.",
  },
  culture: [
    {
      title: { es: "Fez el-Bali: la medina más antigua del mundo", en: "Fez el-Bali: the world's oldest medina", fr: "Fès el-Bali : la plus ancienne médina au monde" },
      body: {
        es: "Fundada en el siglo IX, Fez el-Bali es la medina amurallada más antigua del mundo en activo. Patrimonio de la UNESCO, alberga más de 9.000 callejones, decenas de mezquitas y la Universidad Al Quaraouiyine, la más antigua del planeta aún en funcionamiento (859 d.C.).",
        en: "Founded in the 9th century, Fez el-Bali is the world's oldest active walled medina. UNESCO World Heritage, it shelters more than 9,000 alleys, dozens of mosques and Al Quaraouiyine University — the oldest continuously operating university in the world (859 AD).",
        fr: "Fondée au IXᵉ siècle, Fès el-Bali est la plus ancienne médina fortifiée au monde encore en activité. Patrimoine de l'UNESCO, elle abrite plus de 9 000 ruelles, des dizaines de mosquées et l'université Al Quaraouiyine, la plus ancienne université en activité au monde (859 ap. J.-C.).",
      },
    },
    {
      title: { es: "Aeropuerto Fès-Saïs", en: "Fès-Saïs Airport", fr: "Aéroport Fès-Saïs" },
      body: {
        es: "El aeropuerto internacional Fès-Saïs (FEZ), a unos 15 km del centro, conecta con Casablanca, Marrakech, París, Madrid, Bruselas y otras capitales europeas. Una puerta de entrada cómoda para iniciar el viaje en el norte del país.",
        en: "Fès-Saïs International Airport (FEZ), about 15 km from the centre, connects to Casablanca, Marrakech, Paris, Madrid, Brussels and other European capitals — a convenient entry point to start your journey from northern Morocco.",
        fr: "L'aéroport international Fès-Saïs (FEZ), à environ 15 km du centre, relie Casablanca, Marrakech, Paris, Madrid, Bruxelles et d'autres capitales européennes — une porte d'entrée pratique pour commencer le voyage par le nord du Maroc.",
      },
    },
    {
      title: { es: "Dormir en un riad de Fez", en: "Sleeping at a Fez riad", fr: "Dormir dans un riad de Fès" },
      body: {
        es: "Los riads de Fez son antiguas casas-palacio centenarias organizadas en torno a un patio interior con fuentes y zellige. Hoy convertidos en hoteles boutique, ofrecen una experiencia íntima y muy diferente a los hoteles convencionales.",
        en: "Fez riads are centuries-old palatial houses arranged around an inner courtyard with fountains and zellige tilework. Today turned into boutique hotels, they offer an intimate experience far removed from conventional hotels.",
        fr: "Les riads de Fès sont d'anciennes maisons-palais centenaires organisées autour d'un patio intérieur orné de fontaines et de zellige. Aujourd'hui convertis en hôtels-boutiques, ils offrent une expérience intime, loin des hôtels conventionnels.",
      },
    },
  ],
};

export const DAY_FAE_FEZ_SIDIALI = {
  route_id: "fae-fez-sidiali",
  id: "dia-2",
  image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=2000&q=85",
  accent: "#7C8B5C",
  title: { es: "Fez · Medio Atlas · Aguelmame Sidi Ali", en: "Fez · Middle Atlas · Aguelmame Sidi Ali", fr: "Fès · Moyen Atlas · Aguelmame Sidi Ali" },
  body: {
    es: "Por la mañana visita guiada a pie por la Medina de Fez: zocos, centros artesanales, mezquitas y palacios históricos. Visitaremos el barrio de los curtidores Chouara, la Madrasa Bou Inania, la Fuente Nejjarine y la puerta azul de Bab Boujloud. Por la tarde salida en vehículo 4x4 con chófer atravesando el Medio Atlas: paso por Ifrane, la «pequeña Suiza» marroquí, bosques de cedros gigantes donde con suerte avistaremos monos magot en libertad. Llegada a Aguelmame Sidi Ali, a 2.200 m de altitud, junto al lago natural más profundo de Marruecos. Cena y noche en Xaluca Lake Sidi Ali, antiguo refugio de caza y pesca reconvertido en hotel boutique de montaña.",
    en: "Morning guided walking tour of the Fez Medina: souks, artisan workshops, mosques and historic palaces. We visit the Chouara tanners' quarter, the Bou Inania Madrasa, the Nejjarine fountain and the blue gate of Bab Boujloud. In the afternoon departure by 4x4 with driver across the Middle Atlas: passing through Ifrane, Morocco's «little Switzerland», and the giant cedar forests where we may spot free-roaming Barbary macaques. Arrival at Aguelmame Sidi Ali, at 2,200 m altitude, beside Morocco's deepest natural lake. Dinner and overnight at Xaluca Lake Sidi Ali — a former hunting and fishing lodge turned mountain boutique hotel.",
    fr: "Le matin, visite guidée à pied de la Médina de Fès : souks, ateliers d'artisans, mosquées et palais historiques. Visite du quartier des tanneurs Chouara, de la Madrasa Bou Inania, de la fontaine Nejjarine et de la porte bleue Bab Boujloud. L'après-midi, départ en 4x4 avec chauffeur à travers le Moyen Atlas : passage par Ifrane, la « petite Suisse » marocaine, et les forêts de cèdres géants où, avec un peu de chance, nous apercevrons des macaques de Barbarie en liberté. Arrivée à Aguelmame Sidi Ali, à 2 200 m d'altitude, au bord du lac naturel le plus profond du Maroc. Dîner et nuit au Xaluca Lake Sidi Ali, ancien refuge de chasse et de pêche reconverti en hôtel-boutique de montagne.",
  },
  culture: [
    {
      title: { es: "Curtidores de Chouara", en: "Chouara tanners", fr: "Tanneurs de Chouara" },
      body: {
        es: "Las célebres tinas de colores del barrio Chouara llevan funcionando desde el siglo XI con técnicas medievales casi inalteradas. Las pieles se tratan con cal, sal, excrementos de paloma y tintes naturales antes de exportarse en todo el mundo.",
        en: "The famous coloured vats of the Chouara quarter have been in use since the 11th century with almost unchanged medieval techniques. Hides are treated with lime, salt, pigeon droppings and natural dyes before being exported worldwide.",
        fr: "Les célèbres cuves colorées du quartier Chouara fonctionnent depuis le XIᵉ siècle avec des techniques médiévales quasi inchangées. Les peaux sont traitées à la chaux, au sel, aux fientes de pigeon et aux teintures naturelles avant d'être exportées dans le monde entier.",
      },
    },
    {
      title: { es: "Ifrane, la pequeña Suiza marroquí", en: "Ifrane, the Moroccan little Switzerland", fr: "Ifrane, la petite Suisse marocaine" },
      body: {
        es: "Construida por los franceses en los años 30 a 1.665 m de altitud, Ifrane sorprende con sus tejados a dos aguas, sus calles arboladas y su nieve invernal. Alberga la prestigiosa universidad Al Akhawayn y es base para visitar los bosques de cedros del Atlas.",
        en: "Built by the French in the 1930s at 1,665 m altitude, Ifrane surprises with its pitched roofs, tree-lined streets and winter snow. It hosts the prestigious Al Akhawayn University and serves as a base for visiting the Atlas cedar forests.",
        fr: "Construite par les Français dans les années 1930 à 1 665 m d'altitude, Ifrane surprend avec ses toits à deux pentes, ses rues arborées et sa neige hivernale. Elle accueille la prestigieuse université Al Akhawayn et sert de base aux forêts de cèdres de l'Atlas.",
      },
    },
    {
      title: { es: "Aguelmame Sidi Ali y los cedros del Atlas", en: "Aguelmame Sidi Ali and the Atlas cedars", fr: "Aguelmame Sidi Ali et les cèdres de l'Atlas" },
      body: {
        es: "El lago Sidi Ali, formado en un cráter volcánico a 2.080 m, es el más profundo de Marruecos. Lo rodea un bosque endémico de cedros del Atlas (Cedrus atlantica) habitado por los famosos monos magot, una de las pocas poblaciones silvestres del mundo.",
        en: "Sidi Ali lake, formed in a volcanic crater at 2,080 m, is the deepest in Morocco. It is surrounded by an endemic forest of Atlas cedars (Cedrus atlantica) inhabited by the famous Barbary macaques — one of the world's few wild populations.",
        fr: "Le lac Sidi Ali, formé dans un cratère volcanique à 2 080 m, est le plus profond du Maroc. Il est entouré d'une forêt endémique de cèdres de l'Atlas (Cedrus atlantica) habitée par les célèbres macaques de Barbarie — l'une des rares populations sauvages au monde.",
      },
    },
  ],
};

export const DAY_FAE_SIDIALI_ERFOUD = {
  route_id: "fae-sidiali-erfoud",
  id: "dia-3",
  image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=2000&q=85",
  accent: "#A07042",
  title: { es: "Aguelmame Sidi Ali · Valle del Ziz · Erfoud", en: "Aguelmame Sidi Ali · Ziz Valley · Erfoud", fr: "Aguelmame Sidi Ali · Vallée du Ziz · Erfoud" },
  body: {
    es: "Mañana libre para disfrutar del entorno natural: caminata por las orillas del lago, observación de aves migratorias, paseos por el Parque Nacional de Khenifra o simplemente desconectar entre las montañas. Comida incluida en el hotel. Por la tarde retomamos el 4x4 hacia el sur, atravesando los pasos del Alto Atlas y descendiendo por el espectacular Valle del Ziz, una cinta verde de más de diez millones de palmeras encajada entre paredes rocosas. Llegada a Erfoud, «la Puerta del Desierto». Cena y noche en Kasbah Xaluca, hotel emblemático del sur de Marruecos.",
    en: "Free morning to enjoy the natural surroundings: lakeside walks, migratory bird watching, hikes in the Khenifra National Park or simply unwinding among the mountains. Lunch included at the hotel. In the afternoon we hit the 4x4 again heading south, crossing the High Atlas passes and descending into the spectacular Ziz Valley — a green ribbon of more than ten million palm trees set between rock walls. Arrival in Erfoud, «the Gate of the Desert». Dinner and overnight at Kasbah Xaluca, an emblematic hotel of southern Morocco.",
    fr: "Matinée libre pour profiter du cadre naturel : balades au bord du lac, observation des oiseaux migrateurs, randonnées dans le Parc National de Khénifra ou simplement détente en montagne. Déjeuner inclus à l'hôtel. L'après-midi, nous repartons en 4x4 vers le sud, franchissons les cols du Haut Atlas et descendons la spectaculaire Vallée du Ziz — ruban vert de plus de dix millions de palmiers serré entre les parois rocheuses. Arrivée à Erfoud, « la Porte du Désert ». Dîner et nuit à la Kasbah Xaluca, hôtel emblématique du sud du Maroc.",
  },
  culture: [
    {
      title: { es: "Parque Nacional de Khenifra", en: "Khenifra National Park", fr: "Parc National de Khénifra" },
      body: {
        es: "Creado en 2008, este parque del Medio Atlas protege 84.000 hectáreas de cedros, robles y encinares. Es refugio de monos magot, ciervos rojos, jabalíes y más de 80 especies de aves — incluida el águila real.",
        en: "Created in 2008, this Middle Atlas park protects 84,000 hectares of cedars, oaks and holm oaks. It shelters Barbary macaques, red deer, wild boar and over 80 bird species — including the golden eagle.",
        fr: "Créé en 2008, ce parc du Moyen Atlas protège 84 000 hectares de cèdres, chênes et yeuses. Il abrite macaques, cerfs rouges, sangliers et plus de 80 espèces d'oiseaux — dont l'aigle royal.",
      },
    },
    {
      title: { es: "Valle del Ziz: el río que dio vida al Tafilalet", en: "Ziz Valley: the river that brought life to Tafilalet", fr: "Vallée du Ziz : la rivière qui donna vie au Tafilalet" },
      body: {
        es: "El río Ziz, que nace en el Alto Atlas y desemboca en el Sahara argelino, atraviesa uno de los paisajes más fotogénicos de Marruecos. Sus diez millones de palmeras forman el oasis del Tafilalet, cuna histórica de la dinastía alauí.",
        en: "The Ziz river, born in the High Atlas and ending in the Algerian Sahara, crosses one of Morocco's most photogenic landscapes. Its ten million palm trees form the Tafilalet oasis — historic cradle of the Alawi dynasty.",
        fr: "La rivière Ziz, née dans le Haut Atlas et se perdant dans le Sahara algérien, traverse l'un des paysages les plus photogéniques du Maroc. Ses dix millions de palmiers forment l'oasis du Tafilalet — berceau historique de la dynastie alaouite.",
      },
    },
    {
      title: { es: "Erfoud, capital mundial de los fósiles", en: "Erfoud, world capital of fossils", fr: "Erfoud, capitale mondiale des fossiles" },
      body: {
        es: "Ciudad famosa por sus fósiles devónicos de más de 360 millones de años. Es base logística de todas las expediciones al Erg Chebbi y se conoce como «la Puerta del Desierto».",
        en: "A city famous for its Devonian fossils — more than 360 million years old. The logistics base for all Erg Chebbi expeditions, known as «the Gate of the Desert».",
        fr: "Ville célèbre pour ses fossiles dévoniens de plus de 360 millions d'années. Base logistique de toutes les expéditions à l'Erg Chebbi, connue comme « la Porte du Désert ».",
      },
    },
  ],
};

export const PROGRAM_FAE_56 = {
  routeId: "tourFezAtlasErr56",
  duration_key: "fae5n6d",
  duration: { es: "5 noches / 6 días", en: "5 nights / 6 days", fr: "5 nuits / 6 jours" },
  prices: { low: 1290, mid: 1490, high: 1690, premium: 1990 },
  reverse: false,
  meta: {
    es: {
      title: "Fez – Alto Atlas – Errachidia.",
      description_title: "Cultura, montaña, lago y desierto.",
      description: [
        "Explora la fascinante historia de Fez, considerada una de las medinas mejor conservadas del mundo, con sus callejuelas medievales, zocos y mezquitas históricas.",
        "El viaje continúa hacia el entorno natural de Aguelmame Sidi Ali, donde se encuentra un antiguo refugio de caza y pesca reconvertido en hotel boutique de montaña.",
        "Una experiencia que combina cultura, naturaleza, desierto, oasis, montañas del Atlas y tradiciones bereberes.",
      ],
    },
    en: {
      title: "Fez – High Atlas – Errachidia.",
      description_title: "Culture, mountain, lake and desert.",
      description: [
        "Explore the fascinating history of Fez, considered one of the best-preserved medinas in the world, with its medieval alleys, souks and historic mosques.",
        "The journey continues to the natural setting of Aguelmame Sidi Ali, home to a former hunting and fishing lodge turned mountain boutique hotel.",
        "An experience blending culture, nature, desert, oasis, Atlas mountains and Berber traditions.",
      ],
    },
    fr: {
      title: "Fès – Haut Atlas – Errachidia.",
      description_title: "Culture, montagne, lac et désert.",
      description: [
        "Explorez l'histoire fascinante de Fès, considérée comme l'une des médinas les mieux préservées au monde, avec ses ruelles médiévales, ses souks et ses mosquées historiques.",
        "Le voyage se poursuit vers le cadre naturel d'Aguelmame Sidi Ali, où un ancien refuge de chasse et de pêche reconverti en hôtel-boutique de montagne vous attend.",
        "Une expérience qui mêle culture, nature, désert, oasis, montagnes de l'Atlas et traditions berbères.",
      ],
    },
  },
  days: [
    DAY_FAE_ARRIVAL_FEZ,
    DAY_FAE_FEZ_SIDIALI,
    DAY_FAE_SIDIALI_ERFOUD,
    DAY_DESERT_BIVOUAC,
    DAY_KHAMLIA_RISSANI,
    DAY_ME_ZIZ_ERRACHIDIA,
  ],
  details: {
    includes: {
      es: [
        "Una noche en Fez en Riad u Hotel 4* en régimen de media pensión",
        "Una noche en Xaluca Lake Sidi Ali en régimen de media pensión",
        "Dos noches en Kasbah Xaluca en régimen de media pensión",
        "Una noche en Erg Chebbi en bivouac en régimen de media pensión",
        "Comida en Xaluca Lake Sidi Ali el día 3",
        "Comida «picnic» en el desierto el día 4",
        "Excursión en dromedario en el Erg Chebbi",
        "Vehículo 4x4 con chófer del día 2 al día 6",
        "Visita guiada de Fez (½ día) con guía local",
        "Transfers de aeropuerto en Fez y Errachidia",
        "Combustible del vehículo",
        "Seguro de asistencia en viaje",
      ],
      en: [
        "One night in Fez in a Riad or 4* Hotel, half board",
        "One night at Xaluca Lake Sidi Ali, half board",
        "Two nights at Kasbah Xaluca, half board",
        "One night in Erg Chebbi at a bivouac, half board",
        "Lunch at Xaluca Lake Sidi Ali on day 3",
        "Desert «picnic» on day 4",
        "Camel ride in the Erg Chebbi",
        "Private 4x4 with driver from day 2 to day 6",
        "Half-day guided tour of Fez with local guide",
        "Airport transfers in Fez and Errachidia",
        "Vehicle fuel",
        "Travel assistance insurance",
      ],
      fr: [
        "Une nuit à Fès en Riad ou Hôtel 4* en demi-pension",
        "Une nuit au Xaluca Lake Sidi Ali en demi-pension",
        "Deux nuits à la Kasbah Xaluca en demi-pension",
        "Une nuit à l'Erg Chebbi en bivouac en demi-pension",
        "Déjeuner au Xaluca Lake Sidi Ali le jour 3",
        "Déjeuner « pique-nique » dans le désert le jour 4",
        "Balade à dromadaire à l'Erg Chebbi",
        "Véhicule 4x4 avec chauffeur du jour 2 au jour 6",
        "Visite guidée d'une demi-journée de Fès avec guide local",
        "Transferts aéroport à Fès et Errachidia",
        "Carburant du véhicule",
        "Assurance assistance voyage",
      ],
    },
    excludes: {
      es: [
        "Bebidas",
        "Comidas de mediodía excepto las dos detalladas",
        "Cenas no especificadas",
        "Extras personales (quads, masajes, etc.)",
        "Vuelos",
        "Seguro de cancelación",
      ],
      en: [
        "Drinks",
        "Lunches except the two stated",
        "Dinners not specified",
        "Personal extras (quads, massages, etc.)",
        "Flights",
        "Cancellation insurance",
      ],
      fr: [
        "Boissons",
        "Déjeuners sauf les deux indiqués",
        "Dîners non spécifiés",
        "Extras personnels (quads, massages, etc.)",
        "Vols",
        "Assurance annulation",
      ],
    },
    notes: {
      es: [
        "Opciones de vuelos: Royal Air Maroc, Vueling, Air Arabia, Ryanair",
        "Precios calculados según ocupación del 4x4 — el coste se reparte entre los ocupantes",
        "Habitaciones dobles y triples · Suplemento individual 310 €",
        "Descuento niños 3-11 años: 315 € baja · 325 € alta",
        "Guías locales compartidos en temporada alta",
        "Chóferes de habla española limitados — se recomienda reservar con antelación",
        "Guías oficiales únicamente para visitas en medinas, no para las rutas",
        "Pasaporte obligatorio con mínimo 6 meses de validez",
        "Actividades opcionales: Quads 90 € por vehículo (circuito de 2 horas)",
        "Seguro de cancelación opcional: 45 € por persona para viajes de hasta 9 días — debe contratarse al confirmar",
      ],
      en: [
        "Flight options: Royal Air Maroc, Vueling, Air Arabia, Ryanair",
        "Prices calculated based on 4x4 occupancy — the cost is split between occupants",
        "Double and triple rooms · Single supplement €310",
        "Children 3-11 discount: €315 low season · €325 high season",
        "Local guides may be shared in high season",
        "Spanish-speaking drivers limited — book in advance",
        "Official guides only for medina visits, not for routes",
        "Passport valid at least 6 months required",
        "Optional activities: Quads €90 per vehicle (2-hour circuit)",
        "Optional cancellation insurance: €45 per person for trips up to 9 days — must be taken out at confirmation",
      ],
      fr: [
        "Options de vols : Royal Air Maroc, Vueling, Air Arabia, Ryanair",
        "Tarifs calculés selon l'occupation du 4x4 — le coût se partage entre les occupants",
        "Chambres doubles et triples · Supplément individuel 310 €",
        "Remise enfants 3-11 ans : 315 € basse · 325 € haute",
        "Guides locaux susceptibles d'être partagés en haute saison",
        "Chauffeurs hispanophones limités — réserver à l'avance",
        "Guides officiels uniquement pour les médinas, pas pour les itinéraires",
        "Passeport valable au moins 6 mois obligatoire",
        "Activités en option : Quads 90 € par véhicule (circuit de 2 heures)",
        "Assurance annulation en option : 45 € par personne pour les voyages jusqu'à 9 jours — à souscrire à la confirmation",
      ],
    },
    terms: {
      es: [
        "30% del importe total al confirmar la reserva",
        "70% restante hasta 30 días antes de la salida",
        "Si el vuelo requiere emisión inmediata: 100% de los vuelos + 30% de los servicios terrestres",
        "Cancelación 45 días antes: 30% de gastos",
        "Cancelación 21 días antes: 100% de gastos",
        "Penalización fija de 50 € por reserva como gastos de gestión",
        "Los seguros de cancelación no son reembolsables",
      ],
      en: [
        "30% of total at booking confirmation",
        "Remaining 70% up to 30 days before departure",
        "If the flight requires immediate issuance: 100% of flights + 30% of land services",
        "Cancellation 45 days before: 30% of costs",
        "Cancellation 21 days before: 100% of costs",
        "Fixed €50 penalty per booking as administrative fee",
        "Cancellation insurances are non-refundable",
      ],
      fr: [
        "30 % du total à la confirmation",
        "70 % restants jusqu'à 30 jours avant le départ",
        "Si le vol requiert une émission immédiate : 100 % des vols + 30 % des services terrestres",
        "Annulation 45 jours avant : 30 % de frais",
        "Annulation 21 jours avant : 100 % de frais",
        "Pénalité fixe de 50 € par réservation au titre des frais de gestion",
        "Les assurances annulation ne sont pas remboursables",
      ],
    },
  },
};

