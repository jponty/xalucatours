// Shared "day" building blocks for the Erg Chebbi + Atlas circuits.
// Re-used across the 7d/6d/5d programmes to keep content consistent.

export const DAY_ERFOUD_ARRIVAL = {
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
  id: "dia-2",
  image: "https://images.unsplash.com/photo-1542401886-65d6c61db217?auto=format&fit=crop&w=2000&q=85",
  accent: "#D97742",
  title: { es: "Desierto total – Erg Chebbi y bivouac", en: "Full desert – Erg Chebbi & bivouac", fr: "Désert intégral – Erg Chebbi & bivouac" },
  body: {
    es: "Recorrido por pistas del antiguo Rally Dakar visitando poblados y nómadas del desierto. Visita a las Canteras de Fósiles Marinos y picnic en un oasis auténtico. Llegada al Gran Erg Chebbi, donde cambiaremos el 4x4 por dromedarios para adentrarnos en las dunas. Puesta de sol en el Sahara y noche en Bivouac de Luxe bajo las estrellas.",
    en: "Off-road journey along former Dakar Rally tracks, visiting villages and desert nomads. Visit to the Marine Fossil Quarries and picnic in an authentic oasis. Arrival at the great Erg Chebbi where we swap the 4x4 for camels to ride into the dunes. Saharan sunset and night in a Bivouac de Luxe under the stars.",
    fr: "Parcours tout-terrain sur d'anciennes pistes du Rallye Dakar, à la rencontre de villages et de nomades du désert. Visite des carrières de fossiles marins et pique-nique dans une oasis authentique. Arrivée au grand Erg Chebbi où nous échangeons le 4x4 contre des dromadaires pour pénétrer dans les dunes. Coucher de soleil saharien et nuit en Bivouac de Luxe sous les étoiles.",
  },
  culture: [
    {
      title: { es: "Las legendarias pistas del Rally Dakar", en: "The legendary Dakar Rally tracks", fr: "Les pistes légendaires du Rallye Dakar" },
      body: { es: "Estas rutas formaron parte de las históricas etapas del Dakar en Marruecos entre 2005 y 2008.",
              en: "These trails were part of the historic Dakar stages in Morocco between 2005 and 2008.",
              fr: "Ces pistes faisaient partie des étapes historiques du Dakar au Maroc entre 2005 et 2008." },
    },
    {
      title: { es: "El rugido de las dunas", en: "The roar of the dunes", fr: "Le rugissement des dunes" },
      body: { es: "Erg Chebbi es uno de los pocos lugares del mundo donde las dunas emiten sonido al deslizarse la arena.",
              en: "Erg Chebbi is one of the few places in the world where dunes emit sound as the sand slides.",
              fr: "L'Erg Chebbi est l'un des rares endroits au monde où les dunes émettent un son en glissant." },
    },
    {
      title: { es: "Erg Chebbi y la duna más alta de Marruecos", en: "Erg Chebbi & Morocco's tallest dune", fr: "Erg Chebbi et la plus haute dune du Maroc" },
      body: { es: "La Gran Duna de Merzouga alcanza hasta 170 metros de altura.",
              en: "The Great Merzouga Dune reaches up to 170 metres in height.",
              fr: "La Grande Dune de Merzouga atteint jusqu'à 170 mètres de hauteur." },
    },
  ],
};

export const DAY_KHAMLIA_MERDANI = {
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
  id: "dia-3",
  image: "https://images.unsplash.com/photo-1604940500627-d3f44d1d21c6?auto=format&fit=crop&w=2000&q=85",
  accent: "#A07042",
  title: { es: "Amanecer en el desierto – Khamlia – Rissani", en: "Sunrise – Khamlia – Rissani", fr: "Lever du soleil – Khamlia – Rissani" },
  body: {
    es: "Amanecer en las dunas del Erg Chebbi. Desayuno beduino y salida hacia Merdani y Khamlia. Experiencia musical Gnawa y té a la menta. Visita al mercado tradicional de Rissani y comida en Des Dunes, la auténtica pizzería bereber de Erfoud. Regreso a Kasbah Hotel Xaluca y tarde libre para piscina climatizada, hammam, jacuzzi, masajes, quads opcionales y tenis.",
    en: "Sunrise over the Erg Chebbi. Bedouin breakfast and drive to Merdani and Khamlia. Gnawa music experience and mint tea. Visit to the Rissani traditional market and lunch at Des Dunes, Erfoud's authentic Berber pizzeria. Return to Kasbah Hotel Xaluca with a free afternoon: heated pool, hammam, jacuzzi, massages, optional quads, tennis.",
    fr: "Lever de soleil sur l'Erg Chebbi. Petit déjeuner bédouin et route vers Merdani et Khamlia. Expérience musicale Gnawa et thé à la menthe. Visite du marché traditionnel de Rissani et déjeuner chez Des Dunes, la pizzeria berbère d'Erfoud. Retour au Kasbah Hotel Xaluca avec après-midi libre : piscine chauffée, hammam, jacuzzi, massages, quads en option, tennis.",
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
      title: { es: "El amanecer del Erg Chebbi", en: "Erg Chebbi at sunrise", fr: "L'aube sur l'Erg Chebbi" },
      body: { es: "Las dunas cambian de color del rojo al dorado en cuestión de minutos.",
              en: "The dunes shift from red to gold in a matter of minutes.",
              fr: "Les dunes passent du rouge au doré en quelques minutes." },
    },
    {
      title: { es: "Khamlia y la tradición Gnawa", en: "Khamlia & the Gnawa tradition", fr: "Khamlia et la tradition Gnawa" },
      body: { es: "Música ancestral subsahariana reconocida como Patrimonio Cultural Inmaterial por la UNESCO.",
              en: "Ancestral sub-Saharan music recognised as UNESCO Intangible Cultural Heritage.",
              fr: "Musique ancestrale sub-saharienne reconnue Patrimoine Culturel Immatériel de l'UNESCO." },
    },
    {
      title: { es: "Rissani y las antiguas rutas caravaneras", en: "Rissani and the caravan routes", fr: "Rissani et les routes caravanières" },
      body: { es: "Mercado vivo desde el siglo XIV, último bastión de las rutas berebers del Sahara.",
              en: "A market alive since the 14th century, last stronghold of Saharan Berber routes.",
              fr: "Marché vivant depuis le XIVe siècle, dernier bastion des routes berbères sahariennes." },
    },
  ],
};

export const DAY_RISSANI_RELAX = {
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
  id: "dia-1",
  image: "https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=2000&q=85",
  accent: "#5A6B4F",
  title: { es: "Llegada a Ouarzazate – Boumalne Dades", en: "Arrival in Ouarzazate – Boumalne Dades", fr: "Arrivée à Ouarzazate – Boumalne Dadès" },
  body: {
    es: "Llegada nocturna a Ouarzazate y traslado hacia Boumalne Dades, situado a 1.612 metros de altitud en plena Cordillera del Alto Atlas. Alojamiento en Hotel Xaluca Dades.",
    en: "Night arrival in Ouarzazate and transfer to Boumalne Dades, at 1,612 metres in the heart of the High Atlas. Accommodation at Hotel Xaluca Dades.",
    fr: "Arrivée de nuit à Ouarzazate et transfert vers Boumalne Dadès, à 1 612 mètres au cœur du Haut Atlas. Hébergement à l'Hôtel Xaluca Dadès.",
  },
  culture: [
    {
      title: { es: "Boumalne Dades y el Alto Atlas", en: "Boumalne Dades and the High Atlas", fr: "Boumalne Dadès et le Haut Atlas" },
      body: { es: "Punto histórico de conexión entre caravanas, comerciantes y pueblos bereberes.",
              en: "Historic crossroads between caravans, traders and Berber villages.",
              fr: "Carrefour historique entre caravanes, marchands et villages berbères." },
    },
    {
      title: { es: "Geología única del Atlas", en: "Atlas geology", fr: "Géologie unique de l'Atlas" },
      body: { es: "La ruta atraviesa zonas de arenisca roja y montañas plegadas estudiadas por geólogos de todo el mundo.",
              en: "The route crosses zones of red sandstone and folded mountains studied by geologists worldwide.",
              fr: "La route traverse des zones de grès rouge et de montagnes plissées étudiées par les géologues du monde entier." },
    },
    {
      title: { es: "Ouarzazate y el cine internacional", en: "Ouarzazate and international cinema", fr: "Ouarzazate et le cinéma international" },
      body: { es: "La región ha servido como escenario para Gladiator, Babel o Lawrence of Arabia.",
              en: "The region has hosted Gladiator, Babel and Lawrence of Arabia.",
              fr: "La région a accueilli Gladiator, Babel et Lawrence d'Arabie." },
    },
  ],
};

const DAY_AD_TODRA_ERFOUD = {
  id: "dia-todra-erfoud",
  image: "https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=2000&q=85",
  accent: "#7C8B5C",
  title: { es: "Alto Atlas Central – Gargantas del Todra – Erfoud", en: "Central High Atlas – Todra Gorges – Erfoud", fr: "Haut Atlas Central – Gorges du Todra – Erfoud" },
  body: {
    es: "Ruta por pistas del Alto Atlas Central atravesando poblados bereberes como Boutaghrar. Visita a gargantas, montañas y grutas donde todavía viven familias nómadas. Parada en Tinerhir y recorrido por las famosas Gargantas del Todra. Continuación hacia Erfoud y alojamiento en Kasbah Hotel Xaluca.",
    en: "Off-road journey across the Central High Atlas, through Berber villages such as Boutaghrar. Visit to gorges, mountains and caves still inhabited by nomad families. Stop in Tinerhir and walk through the famous Todra Gorges. Continue to Erfoud, accommodation at Kasbah Hotel Xaluca.",
    fr: "Parcours tout-terrain à travers le Haut Atlas central, via des villages berbères comme Boutaghrar. Visite des gorges, montagnes et grottes encore habitées par des familles nomades. Halte à Tinerhir et promenade dans les célèbres Gorges du Todra. Poursuite vers Erfoud, hébergement au Kasbah Hotel Xaluca.",
  },
  culture: [
    {
      title: { es: "Boutaghrar y la vida bereber tradicional", en: "Boutaghrar and traditional Berber life", fr: "Boutaghrar et la vie berbère traditionnelle" },
      body: { es: "Familias bereberes mantienen modos de vida ancestrales en pleno Alto Atlas.",
              en: "Berber families still uphold ancestral ways of life in the heart of the High Atlas.",
              fr: "Des familles berbères perpétuent des modes de vie ancestraux au cœur du Haut Atlas." },
    },
    {
      title: { es: "Gargantas del Todra", en: "Todra Gorges", fr: "Gorges du Todra" },
      body: { es: "Cañones naturales con paredes verticales de hasta 160 metros.",
              en: "Natural canyons with vertical walls up to 160 metres.",
              fr: "Canyons naturels aux parois verticales de jusqu'à 160 mètres." },
    },
    {
      title: { es: "Erfoud y los fósiles del Devónico", en: "Erfoud and Devonian fossils", fr: "Erfoud et les fossiles du Dévonien" },
      body: { es: "Famosa por sus fósiles marinos de más de 350 millones de años.",
              en: "Famous for marine fossils more than 350 million years old.",
              fr: "Célèbre pour ses fossiles marins de plus de 350 millions d'années." },
    },
  ],
};

const DAY_AD_DADES_TODRA_ERFOUD = {
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
  id: "dia-ziz-return",
  image: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=2000&q=85",
  accent: "#A07042",
  title: { es: "Valle del Ziz – Errachidia – Regreso", en: "Ziz Valley – Errachidia – Return", fr: "Vallée du Ziz – Errachidia – Retour" },
  body: {
    es: "Traslado hacia Errachidia atravesando el espectacular Valle del Ziz. Parada en el mirador del valle, rodeado por uno de los mayores palmerales del norte de África. Vuelo de regreso vía Casablanca.",
    en: "Transfer to Errachidia across the spectacular Ziz Valley. Stop at the valley viewpoint, surrounded by one of the largest palm groves in North Africa. Return flight via Casablanca.",
    fr: "Transfert vers Errachidia à travers la spectaculaire Vallée du Ziz. Arrêt au mirador, entouré de l'une des plus grandes palmeraies d'Afrique du Nord. Vol de retour via Casablanca.",
  },
  culture: [
    {
      title: { es: "El Valle del Ziz", en: "The Ziz Valley", fr: "La Vallée du Ziz" },
      body: { es: "Oasis histórico con millones de palmeras datileras del oasis del Tafilalet.",
              en: "Historic oasis with millions of date palms from the Tafilalet.",
              fr: "Oasis historique abritant des millions de palmiers dattiers du Tafilalet." },
    },
    {
      title: { es: "Las khettaras del Valle del Ziz", en: "The Ziz khettaras", fr: "Les khettaras de la vallée du Ziz" },
      body: { es: "Antiguos canales subterráneos utilizados desde la Edad Media para irrigar el oasis.",
              en: "Ancient underground channels used since the Middle Ages to irrigate the oasis.",
              fr: "Anciens canaux souterrains utilisés depuis le Moyen Âge pour irriguer l'oasis." },
    },
    {
      title: { es: "Aeropuerto de Errachidia", en: "Errachidia airport", fr: "Aéroport d'Errachidia" },
      body: { es: "Principal conexión aérea del sureste marroquí.",
              en: "The main air gateway of south-eastern Morocco.",
              fr: "Principale porte aérienne du sud-est marocain." },
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
