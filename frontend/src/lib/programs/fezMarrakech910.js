// Fez → Marrakech · 9 nights / 10 days — complete trilingual programme data
// powered by the universal ProgramTemplate (variant: "frz").

const T = (es, en, fr) => ({ es, en, fr });

/* ============================================================
   Days
============================================================ */

const DAY_01_ARRIVAL_FEZ = {
  route_id: "frz910-arrival-fez",
  id: "frz910-d1",
  image: "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=2000&q=85",
  accent: "#5A6B4F",
  title: T(
    "Vuelo de origen · Llegada a Fez",
    "Outbound flight · Arrival in Fez",
    "Vol au départ · Arrivée à Fès",
  ),
  body: {
    es: "Salida desde el aeropuerto de origen con destino Fez. Llegada — dependiendo de la época del año, puede haber diferencia horaria. Recogida en el aeropuerto y traslado al Riad en la Medina o Hotel 4★. Cena y alojamiento. Nota: según la hora de llegada del vuelo, la visita guiada de Fez podría adelantarse a esta jornada, dejando la siguiente libre para adaptarse al cambio de zona.",
    en: "Departure from your home airport bound for Fez. Arrival — note the time difference depending on the season. Airport pick-up and transfer to a riad in the medina or 4★ hotel. Dinner and overnight. Note: depending on the arrival time, the guided medina tour may be brought forward to today to leave the next day free to adjust to the time change.",
    fr: "Départ depuis votre aéroport d'origine pour Fès. Arrivée (décalage horaire possible selon la saison). Accueil à l'aéroport et transfert au riad dans la médina ou hôtel 4★. Dîner et nuit. Selon l'heure du vol, la visite guidée de la médina peut être avancée à ce jour, libérant la journée suivante pour s'adapter au décalage horaire.",
  },
  culture: [
    {
      title: T("La medina más fascinante del mundo árabe", "The most fascinating medina in the Arab world", "La médina la plus fascinante du monde arabe"),
      body: T(
        "Fez es Patrimonio de la Humanidad UNESCO desde 1981 — 9.000 callejones, 60.000 puertas y un tejido urbano intacto desde el siglo IX.",
        "Fez has been UNESCO World Heritage since 1981 — 9,000 alleys, 60,000 doors and an urban fabric unchanged since the 9th century.",
        "Fès est inscrite UNESCO depuis 1981 — 9 000 ruelles, 60 000 portes et un tissu urbain intact depuis le IXe siècle.",
      ),
    },
    {
      title: T("La universidad más antigua del mundo", "The world's oldest university", "La plus ancienne université du monde"),
      body: T(
        "Al-Qarawiyyin, fundada en 859 d.C. por Fátima al-Fihri, está reconocida por UNESCO y Guinness como la universidad más antigua del mundo todavía en funcionamiento.",
        "Al-Qarawiyyin, founded in 859 CE by Fatima al-Fihri, is recognised by UNESCO and Guinness as the oldest continuously operating university in the world.",
        "Al-Qarawiyyin, fondée en 859 par Fatima al-Fihri, est reconnue par l'UNESCO et le Guinness comme la plus ancienne université au monde toujours en activité.",
      ),
    },
  ],
};

const DAY_02_FEZ_MEDIO_ATLAS_ERFOUD = {
  route_id: "frz910-fez-ziz-erfoud",
  id: "frz910-d2",
  image: "https://images.unsplash.com/photo-1547234935-80c7145ec969?auto=format&fit=crop&w=2000&q=85",
  accent: "#7C8B5C",
  title: T(
    "Fez · Medio Atlas · Valle del Ziz · Erfoud",
    "Fez · Middle Atlas · Ziz Valley · Erfoud",
    "Fès · Moyen Atlas · Vallée du Ziz · Erfoud",
  ),
  body: {
    es: "Por la mañana, visita a pie con guía local por la antigua Medina de Fez, una de las más auténticas y mejor conservadas del mundo árabe. Recorreremos sus callejuelas medievales, repletas de vida, donde descubriremos centros artesanales, mezquitas y palacios entre el bullicio de sus habitantes. A primera hora de la tarde, salida en vehículo 4x4 con chófer en dirección sur, cruzando el Medio Atlas hasta llegar a Ifrane, conocida como «la pequeña Suiza» por su sorprendente parecido. Cruzaremos los bosques de cedros gigantes — con suerte podremos dar de comer a una colonia de monos salvajes — y atravesaremos el Valle del Ziz, que alberga más de diez millones de palmeras, hasta llegar a Erfoud, «la Puerta del Desierto». Cena y alojamiento en Kasbah Hotel Xaluca, un alojamiento único en Marruecos por sus características arquitectónicas y de servicio.",
    en: "Morning walking tour with a local guide through the ancient medina of Fez, one of the most authentic and best-preserved in the Arab world. We will walk its medieval alleys, packed with life — artisan workshops, mosques and palaces in the constant buzz of its inhabitants. Early afternoon, we set off by 4x4 with driver heading south, crossing the Middle Atlas to Ifrane, known as «little Switzerland» for its striking resemblance. We cross the giant cedar forests — with some luck we can feed a colony of wild Barbary apes — and continue through the Ziz Valley with its ten million date palms to Erfoud, «the gateway to the desert». Dinner and overnight at Kasbah Hotel Xaluca, a one-of-a-kind property in Morocco for its architecture and service.",
    fr: "Le matin, visite à pied de l'ancienne médina de Fès avec guide local, l'une des plus authentiques et les mieux conservées du monde arabe. Nous parcourons ses ruelles médiévales, pleines de vie, à la rencontre des centres d'artisanat, mosquées et palais. En début d'après-midi, départ en 4x4 avec chauffeur vers le sud, traversant le Moyen Atlas jusqu'à Ifrane, surnommée « la petite Suisse ». Nous traversons les forêts de cèdres géants — avec un peu de chance, nous pourrons nourrir une colonie de magots — et descendons par la vallée du Ziz, qui abrite plus de dix millions de palmiers, jusqu'à Erfoud, « la porte du désert ». Dîner et nuit à la Kasbah Hôtel Xaluca, un lieu unique au Maroc pour son architecture et son service.",
  },
  culture: [
    {
      title: T("Ifrane · la pequeña Suiza marroquí", "Ifrane · little Moroccan Switzerland", "Ifrane · la petite Suisse marocaine"),
      body: T(
        "A 1.665 m de altitud, fue diseñada por arquitectos franceses en los años 30 con tejados a dos aguas — un pueblo alpino en pleno Marruecos.",
        "At 1,665 m, designed by French architects in the 1930s with pitched roofs — an Alpine village in the heart of Morocco.",
        "À 1 665 m d'altitude, conçue par des architectes français dans les années 30 avec ses toits en pente — un village alpin au cœur du Maroc.",
      ),
    },
    {
      title: T("Valle del Ziz · 10 millones de palmeras", "Ziz Valley · 10 million date palms", "Vallée du Ziz · 10 millions de palmiers"),
      body: T(
        "El río Ziz dibuja un oasis lineal que recorre el sur de Marruecos durante 280 km, sosteniendo uno de los palmerales más extensos del país.",
        "The Ziz river carves a linear oasis running 280 km through southern Morocco, sustaining one of the country's largest palm groves.",
        "La rivière Ziz dessine une oasis linéaire qui traverse le sud du Maroc sur 280 km, soutenant l'une des plus vastes palmeraies du pays.",
      ),
    },
  ],
};

const DAY_03_ERFOUD_ERG_BIVOUAC = {
  route_id: "desert-bivouac",
  id: "frz910-d3",
  image: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=2000&q=85",
  accent: "#C16542",
  title: T(
    "Erfoud · pistas del desierto · Oasis · Erg Chebbi · Bivouac",
    "Erfoud · desert tracks · oasis · Erg Chebbi · Bivouac",
    "Erfoud · pistes du désert · oasis · Erg Chebbi · bivouac",
  ),
  body: {
    es: "Hoy viviremos un auténtico día de desierto total. Recorreremos una de las pistas utilizadas en el Rally Dakar, atravesando poblados y encontrándonos con nómadas del desierto. Haremos una parada en las Canteras de Fósiles Marinos, con más de 360 millones de años de antigüedad, y disfrutaremos de un picnic en un oasis auténtico. Continuaremos hasta el Gran Erg Chebbi, el famoso desierto de dunas de finísima arena. Cambiaremos el vehículo 4x4 por dromedarios para adentrarnos en el corazón de las dunas y contemplar una puesta de sol inolvidable. Llegada al Bivouac de Luxe (Kamkamia Luxury Desert Camp), donde nos alojaremos en haimas tradicionales como las que utilizan los nómadas. Cena y alojamiento. Dormir bajo las estrellas será, sin duda, una experiencia espectacular.",
    en: "Today we live a day of total desert. We will drive an old Dakar Rally track, crossing villages and meeting desert nomads. Stop at the marine fossil quarries (over 360 million years old) and picnic in an authentic oasis. We continue to the great Erg Chebbi, the famous desert of ultra-fine dunes. We swap 4x4 for camels and enter the heart of the dunes for an unforgettable sunset. Arrival at the Bivouac de Luxe (Kamkamia Luxury Desert Camp), traditional Berber tents like those used by nomads. Dinner and overnight — sleeping under the stars is a spectacular experience.",
    fr: "Aujourd'hui, journée désert total. Nous parcourons une ancienne piste du Rallye Dakar, à la rencontre des villages et des nomades. Arrêt aux carrières de fossiles marins (plus de 360 millions d'années) et pique-nique dans une oasis authentique. Poursuite vers le grand Erg Chebbi, désert de dunes à sable très fin. Nous échangeons le 4x4 contre des dromadaires pour rejoindre le cœur des dunes et admirer un coucher de soleil inoubliable. Arrivée au Bivouac de Luxe (Kamkamia Luxury Desert Camp), tentes berbères traditionnelles. Dîner et nuit sous les étoiles — une expérience spectaculaire.",
  },
  culture: [
    {
      title: T("Kamkamia Luxury Desert Camp", "Kamkamia Luxury Desert Camp", "Kamkamia Luxury Desert Camp"),
      body: T(
        "Haimas de lujo con baño privado y agua caliente, en pleno corazón del Erg Chebbi. Cena bereber a la luz de las velas y observación de estrellas con telescopio.",
        "Luxury tents with private bathroom and hot water, in the heart of the Erg Chebbi. Candle-lit Berber dinner and telescope stargazing.",
        "Tentes berbères de luxe avec salle de bain et eau chaude, au cœur de l'Erg Chebbi. Dîner berbère aux chandelles et observation des étoiles au télescope.",
      ),
    },
    {
      title: T("Fósiles marinos de 360 millones de años", "360-million-year-old marine fossils", "Fossiles marins de 360 millions d'années"),
      body: T(
        "El sur de Marruecos fue un mar tropical en el Devónico. Las canteras de Erfoud guardan trilobites, ammonites y ortocerátidos que se exportan a museos de todo el mundo.",
        "Southern Morocco was a tropical sea during the Devonian. Erfoud quarries hold trilobites, ammonites and orthoceratids exported to museums worldwide.",
        "Le sud du Maroc était une mer tropicale au Dévonien. Les carrières d'Erfoud conservent trilobites, ammonites et orthocères exportés dans les musées du monde entier.",
      ),
    },
  ],
};

const DAY_04_ERG_KHAMLIA_TOMBOUCTOU = {
  route_id: "khamlia-rissani",
  id: "frz910-d4",
  image: "https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=2000&q=85",
  accent: "#D97742",
  title: T(
    "Erg Chebbi · Merdani · Khamlia · Kasbah Tombouctou",
    "Erg Chebbi · Merdani · Khamlia · Kasbah Tombouctou",
    "Erg Chebbi · Merdani · Khamlia · Kasbah Tombouctou",
  ),
  body: {
    es: "«Cita con el Amanecer»: recomendable madrugar para subir a lo más alto de las dunas y contemplar la salida del sol, una experiencia única. Desayuno beduino y salida en vehículo para rodear el Erg Chebbi hasta el pueblo abandonado de Merdani. Continuaremos hasta las Minas de Menfis y más tarde visitaremos el poblado de origen sudanés Khamlia, donde sus habitantes nos recibirán con sus danzas tradicionales y un té a la menta. Llegada a Kasbah Hotel Tombouctou y tiempo libre para disfrutar a nuestro aire: paseo por las dunas, visita a los pueblos cercanos de Merzouga y Hassi Labyed («Pozoblanco») o disfrutar opcionalmente del reconfortante ritual del Hammam tradicional. A la hora convenida, salida hacia un mirador natural para contemplar una hermosa panorámica del desierto. Cena y alojamiento en Kasbah Tombouctou.",
    en: "«A date with the sunrise»: an early climb to the top of the dunes for the sunrise — a unique experience. Bedouin breakfast and then 4x4 around the Erg to the abandoned village of Merdani. We continue to the Menfis Mines and visit the Sudanese-origin village of Khamlia, where locals welcome us with traditional dances and mint tea. Arrival at Kasbah Hotel Tombouctou and free time: walk in the dunes, visit Merzouga and Hassi Labyed («Pozoblanco») or enjoy the optional traditional Hammam ritual. At the agreed time, drive to a natural viewpoint for a beautiful desert panorama. Dinner and overnight at Kasbah Tombouctou.",
    fr: "« Rendez-vous avec l'aube » : montée matinale au sommet des dunes pour le lever du soleil — expérience unique. Petit-déjeuner bédouin puis 4x4 autour de l'Erg jusqu'au village abandonné de Merdani. Poursuite vers les Mines de Menfis puis le village d'origine soudanaise de Khamlia, où les habitants nous accueillent avec danses traditionnelles et thé à la menthe. Arrivée à la Kasbah Hôtel Tombouctou et temps libre : balade dans les dunes, visite des villages de Merzouga et Hassi Labyed (« Pozoblanco ») ou rituel du Hammam traditionnel en option. À l'heure convenue, départ vers un mirador naturel pour une magnifique panoramique du désert. Dîner et nuit à la Kasbah Tombouctou.",
  },
  wellness: [
    { es: "Hammam tradicional", en: "Traditional hammam", fr: "Hammam traditionnel" },
    { es: "Paseo por las dunas", en: "Dune walks", fr: "Balade dans les dunes" },
    { es: "Mirador natural", en: "Natural viewpoint", fr: "Mirador naturel" },
    { es: "Quads opcionales", en: "Optional quads", fr: "Quads en option" },
  ],
  culture: [
    {
      title: T("Música Gnawa · Patrimonio UNESCO", "Gnawa music · UNESCO heritage", "Musique Gnawa · patrimoine UNESCO"),
      body: T(
        "La música Gnawa de Khamlia es Patrimonio Cultural Inmaterial UNESCO. Sus ritmos hipnóticos, krakebs metálicos y tambores hablan del legado africano del sur marroquí.",
        "Khamlia's Gnawa music is UNESCO Intangible Heritage. Its hypnotic rhythms, metal krakebs and drums speak to southern Morocco's African legacy.",
        "La musique Gnawa de Khamlia est Patrimoine Culturel Immatériel UNESCO. Ses rythmes hypnotiques évoquent l'héritage africain du sud marocain.",
      ),
    },
    {
      title: T("Merdani · pueblo abandonado", "Merdani · abandoned village", "Merdani · village abandonné"),
      body: T(
        "Antigua aldea minera del manganeso, hoy un cementerio mineral en mitad del Erg que recuerda las extracciones del protectorado francés.",
        "An old manganese mining hamlet, today a mineral cemetery in the middle of the Erg recalling French Protectorate extractions.",
        "Ancien village minier de manganèse, aujourd'hui un cimetière minéral au milieu de l'Erg.",
      ),
    },
  ],
};

const DAY_05_RISSANI_RELAX = {
  route_id: "frz910-rissani-relax",
  id: "frz910-d5",
  image: "https://images.unsplash.com/photo-1604940500627-d3f44d1d21c6?auto=format&fit=crop&w=2000&q=85",
  accent: "#A07042",
  title: T(
    "Rissani · relax en Kasbah Xaluca",
    "Rissani · relax at Kasbah Xaluca",
    "Rissani · détente à la Kasbah Xaluca",
  ),
  body: {
    es: "Salida por pistas del desierto hasta llegar a Rissani, donde visitaremos alguna de sus kasbahs centenarias. Recorreremos su mercado tradicional, único en esta zona del país, donde todavía hoy se abastecen las tribus y nómadas del desierto. Resulta especialmente curioso su particular «parking» de burros. Regreso a Kasbah Hotel Xaluca y resto del día libre para relajarse después de varios días en el desierto: piscina climatizada, jacuzzi, tenis, minigolf, hammam tradicional (opcional), masaje relajante (opcional) o salida en quads por las dunas cercanas (excursión opcional). Los vehículos con chófer estarán a disposición del grupo por si se desea seguir explorando la zona o dar un paseo libre por Erfoud. Cena y alojamiento en Kasbah Xaluca. Nota: el mercado de Rissani se celebra los martes, jueves y domingos. Si no coincide con la ruta, se intentará reubicar la visita en otro momento, aunque no siempre es posible.",
    en: "We leave by desert tracks to Rissani to visit some of its centuries-old kasbahs. We walk through its traditional market — unique in this region — where desert tribes and nomads still stock up today. The curious «donkey parking» is a particular highlight. Back at Kasbah Hotel Xaluca, the rest of the day is free to relax after several days in the desert: heated pool, jacuzzi, tennis, mini-golf, optional traditional hammam, optional relaxing massage or optional quad ride in the nearby dunes. The 4x4 vehicles with driver remain available if you wish to keep exploring the area or stroll around Erfoud. Dinner and overnight at Kasbah Xaluca. Note: the Rissani market runs Tuesday, Thursday and Sunday. If it does not coincide with the route, we will try to relocate the visit, though this is not always possible.",
    fr: "Départ par les pistes du désert jusqu'à Rissani pour visiter ses kasbahs centenaires. Nous parcourons son marché traditionnel — unique dans cette région — où s'approvisionnent encore les tribus et nomades du désert. Son curieux « parking d'ânes » est particulièrement marquant. Retour à la Kasbah Hôtel Xaluca et après-midi libre : piscine chauffée, jacuzzi, tennis, mini-golf, hammam traditionnel (option), massage relaxant (option) ou balade en quads dans les dunes voisines (option). Les 4x4 avec chauffeur restent à disposition pour explorer la zone ou flâner dans Erfoud. Dîner et nuit à la Kasbah Xaluca. Note : le marché de Rissani a lieu mardi, jeudi et dimanche. Si la date ne coïncide pas avec l'itinéraire, nous essaierons de reprogrammer la visite, sans garantie.",
  },
  wellness: [
    { es: "Piscina climatizada", en: "Heated pool", fr: "Piscine chauffée" },
    { es: "Jacuzzi & spa", en: "Jacuzzi & spa", fr: "Jacuzzi & spa" },
    { es: "Hammam tradicional", en: "Traditional hammam", fr: "Hammam traditionnel" },
    { es: "Masaje relajante", en: "Relaxing massage", fr: "Massage relaxant" },
    { es: "Tenis y minigolf", en: "Tennis & minigolf", fr: "Tennis & mini-golf" },
    { es: "Quads opcionales", en: "Optional quads", fr: "Quads en option" },
  ],
  culture: [
    {
      title: T("Rissani · cuna de la dinastía alauita", "Rissani · cradle of the Alaouite dynasty", "Rissani · berceau de la dynastie alaouite"),
      body: T(
        "La antigua Sijilmasa, capital de las rutas transaharianas del oro y la sal, fundó la dinastía que aún reina en Marruecos desde el siglo XVII.",
        "Ancient Sijilmasa, capital of the trans-Saharan gold and salt trade, gave birth to the dynasty that still reigns over Morocco since the 17th century.",
        "L'ancienne Sijilmasa, capitale des routes transsahariennes de l'or et du sel, fonda la dynastie qui règne encore au Maroc depuis le XVIIe siècle.",
      ),
    },
  ],
};

const DAY_06_TODRA_DADES = {
  route_id: "frz910-todra-dades",
  id: "frz910-d6",
  image: "https://images.unsplash.com/photo-1604940500627-d3f44d1d21c6?auto=format&fit=crop&w=2000&q=85",
  accent: "#7C8B5C",
  title: T(
    "Erfoud · Gargantas del Todra · Valle del Dadès · Boumalne Dades",
    "Erfoud · Todra Gorges · Dades Valley · Boumalne Dades",
    "Erfoud · Gorges du Todra · Vallée du Dadès · Boumalne Dadès",
  ),
  body: {
    es: "Salida por carretera asfaltada hacia Tinerhir, una pequeña y próspera localidad que ofrece una hermosa panorámica de contrastes, con sus casas de color rosa entre palmerales verdes. Desde aquí nos adentraremos en las espectaculares Gargantas del Todra, donde daremos un paseo siguiendo el curso del río entre paredes de roca impresionantes. Continuación hasta Boumalne Dades, a 1.612 m de altitud en la Cordillera del Alto Atlas, conocida como el Valle de los Pájaros. Por la tarde, recorreremos el Valle del Dadès hasta llegar a sus gargantas, donde disfrutaremos de un té en un mirador panorámico. Durante el descenso, parada en las curiosas formaciones rocosas conocidas como las «patas de mono». Cena y alojamiento en Hotel Xaluca Dadès.",
    en: "Drive on asphalt to Tinerhir, a small thriving town offering a beautiful panorama of contrasts — pink houses set among green palm groves. From here we enter the spectacular Todra Gorges for a walk along the river between impressive rock walls. Continue to Boumalne Dades, 1,612 m above sea level in the High Atlas, known as the Valley of the Birds. Afternoon drive up the Dades Valley to its gorges and tea-stop at a panoramic viewpoint. On the way back, stop at the curious «Monkey Fingers» rock formations. Dinner and overnight at Hotel Xaluca Dades.",
    fr: "Route asphaltée vers Tinerhir, petite ville prospère offrant une magnifique panoramique de contrastes — maisons roses au milieu de palmeraies vertes. Nous entrons dans les spectaculaires Gorges du Todra pour une marche le long de la rivière entre des parois impressionnantes. Continuation vers Boumalne Dadès, à 1 612 m d'altitude dans le Haut Atlas, appelée la Vallée des Oiseaux. L'après-midi, parcours de la vallée du Dadès jusqu'à ses gorges et arrêt-thé au mirador panoramique. Retour avec arrêt aux formations rocheuses curieuses dites « Doigts de Singe ». Dîner et nuit à l'Hôtel Xaluca Dadès.",
  },
  culture: [
    {
      title: T("Gargantas del Todra · 160 m de pared vertical", "Todra Gorges · 160 m vertical walls", "Gorges du Todra · 160 m de parois verticales"),
      body: T(
        "Uno de los cañones más espectaculares de África del Norte, esculpido durante millones de años por el río Todra. Meca mundial de la escalada deportiva.",
        "One of North Africa's most spectacular canyons, carved over millions of years by the Todra river. A world-class sport climbing mecca.",
        "Un des canyons les plus spectaculaires d'Afrique du Nord, sculpté sur des millions d'années par la rivière Todra. Haut-lieu de l'escalade sportive.",
      ),
    },
    {
      title: T("Valle del Dadès · Valle de los Pájaros", "Dades Valley · Valley of the Birds", "Vallée du Dadès · Vallée des Oiseaux"),
      body: T(
        "El Dadès es santuario para más de 130 especies de aves migratorias — entre ellas la rara busarda mora y el bulbul norteafricano.",
        "The Dades shelters more than 130 species of migratory birds — including the rare Moroccan bulbul and the long-legged buzzard.",
        "Le Dadès accueille plus de 130 espèces d'oiseaux migrateurs — dont le bulbul d'Afrique du Nord et la buse féroce.",
      ),
    },
  ],
};

const DAY_07_MGOUN_ATLAS = {
  route_id: "frz910-mgoun-atlas",
  id: "frz910-d7",
  image: "https://images.unsplash.com/photo-1542401886-65d6c61db217?auto=format&fit=crop&w=2000&q=85",
  accent: "#A07042",
  title: T(
    "Alto Atlas Central · Boutaghrar · Amskar · Gargantas del M'Goun · Dadès",
    "Central High Atlas · Boutaghrar · Amskar · M'Goun Gorges · Dades",
    "Haut Atlas Central · Boutaghrar · Amskar · Gorges du M'Goun · Dadès",
  ),
  body: {
    es: "Hoy nos adentraremos por pistas de montaña en lo más profundo del Alto Atlas Central, atravesando paisajes espectaculares. Visitaremos poblados bereberes como Boutaghrar y Amskar, donde el tiempo parece haberse detenido. En el camino descubriremos montañas, cañones, valles y grutas en las que aún viven familias nómadas. Recorreremos las impresionantes Gargantas del M'Goun, disfrutando de un paseo inolvidable por uno de los parajes más remotos del sur de Marruecos. El almuerzo será en ruta, en una «Gîte d'Étape», alojamiento rural tradicional de montaña. Cena y alojamiento en Hotel Xaluca Dadès.",
    en: "Today we head deep into the Central High Atlas on mountain tracks, threading spectacular landscapes. We visit Berber villages such as Boutaghrar and Amskar where time seems to have stopped. Along the way we discover mountains, canyons, valleys and caves still inhabited by nomadic families. We walk the impressive M'Goun Gorges — an unforgettable stroll through one of the most remote landscapes of southern Morocco. Lunch in route at a «Gîte d'Étape», traditional mountain guesthouse. Dinner and overnight at Hotel Xaluca Dades.",
    fr: "Aujourd'hui, nous nous enfonçons par les pistes de montagne au cœur du Haut Atlas Central, à travers des paysages spectaculaires. Nous visitons les villages berbères de Boutaghrar et Amskar où le temps semble s'être arrêté. En chemin, nous découvrons montagnes, canyons, vallées et grottes encore habitées par des familles nomades. Nous parcourons les impressionnantes Gorges du M'Goun — une marche inoubliable dans l'un des paysages les plus reculés du sud du Maroc. Déjeuner en route dans une « Gîte d'Étape », gîte rural de montagne. Dîner et nuit à l'Hôtel Xaluca Dadès.",
  },
  culture: [
    {
      title: T("M'Goun · 4.071 m", "M'Goun · 4,071 m", "M'Goun · 4 071 m"),
      body: T(
        "El tercer pico más alto de Marruecos. Sus gargantas son uno de los pocos lugares donde aún se cruza el río a pie entre paredes verticales.",
        "Morocco's third-highest peak. Its gorges are one of the few places where the river is still crossed on foot between vertical walls.",
        "Le troisième plus haut sommet du Maroc. Ses gorges figurent parmi les rares lieux où l'on traverse la rivière à pied entre des parois verticales.",
      ),
    },
    {
      title: T("Aldeas imazighen detenidas en el tiempo", "Imazighen villages frozen in time", "Villages imazighen figés dans le temps"),
      body: T(
        "Boutaghrar y Amskar conservan la arquitectura tradicional de adobe y los oficios artesanales bereberes — agricultura, tejido y trashumancia.",
        "Boutaghrar and Amskar preserve traditional adobe architecture and Berber craft trades — farming, weaving and transhumance.",
        "Boutaghrar et Amskar conservent l'architecture traditionnelle en pisé et les métiers berbères — agriculture, tissage et transhumance.",
      ),
    },
  ],
};

const DAY_08_AITBENHADDOU_MARRAKECH = {
  route_id: "frz910-aitbenhaddou-marrakech",
  id: "frz910-d8",
  image: "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=2000&q=85",
  accent: "#D4A373",
  title: T(
    "Dadès · Aït Ben Haddou · Tizi n'Tichka · Marrakech",
    "Dades · Aït Ben Haddou · Tizi n'Tichka · Marrakech",
    "Dadès · Aït Ben Haddou · Tizi n'Tichka · Marrakech",
  ),
  body: {
    es: "Etapa de unos 310 km, ampliamente recompensados por la espectacularidad de los paisajes. Salida hacia Marrakech. En ruta, visitaremos la emblemática Kasbah de Aït Ben Haddou, Patrimonio de la Humanidad UNESCO y escenario de numerosas producciones cinematográficas. Cruzaremos el Tizi n'Tichka, el puerto de montaña más alto de Marruecos, donde dejaremos atrás el paisaje lunar del sur para adentrarnos en los colores verdes y ocres del norte. Llegada a Marrakech por la tarde — recomendamos aprovechar esta primera toma de contacto para visitar la mítica Plaza Djemaa el-Fna, que a estas horas se llena de recitadores, adivinadores, encantadores de serpientes, danzantes, sacamuelas, malabaristas y mucho más. Al caer la noche, la plaza se transforma en un gran mercado gastronómico al aire libre, con puestos de comida tradicional iluminados bajo las estrellas. Cena y alojamiento en Riad en la Medina o Hotel 5★. Nota: este es el último día del recorrido en vehículo 4x4.",
    en: "A 310 km stage, generously rewarded by the spectacular landscapes. We set off towards Marrakech. On the way we visit the iconic Aït Ben Haddou kasbah — UNESCO World Heritage and set for many films. We cross the Tizi n'Tichka, Morocco's highest road pass, where the southern lunar landscape gives way to the green and ochre tones of the north. Arrival in Marrakech in the afternoon — make the most of this first encounter with the legendary Jemaa el-Fna square, which at this hour fills with storytellers, fortune-tellers, snake charmers, dancers, jugglers and more. At nightfall the square becomes an open-air food market, with traditional stalls lit beneath the stars. Dinner and overnight in a Medina riad or 5★ hotel. Note: this is the last day in 4x4.",
    fr: "Étape de 310 km, largement récompensée par la beauté des paysages. Départ vers Marrakech. En route, visite de l'emblématique kasbah d'Aït Ben Haddou — UNESCO et décor de nombreuses productions cinématographiques. Passage du Tizi n'Tichka, le plus haut col routier du Maroc, où le paysage lunaire du sud cède la place aux tons verts et ocres du nord. Arrivée à Marrakech l'après-midi — nous recommandons de profiter de cette première rencontre avec la mythique place Jemaa el-Fna, qui se remplit à cette heure de conteurs, devins, charmeurs de serpents, danseurs, jongleurs et bien plus. À la tombée du jour, la place se transforme en un grand marché gastronomique en plein air. Dîner et nuit en riad de la médina ou hôtel 5★. Note : dernier jour en 4x4.",
  },
  culture: [
    {
      title: T("Aït Ben Haddou · escenario de Gladiator y Juego de Tronos", "Aït Ben Haddou · set of Gladiator and Game of Thrones", "Aït Ben Haddou · décor de Gladiator et Game of Thrones"),
      body: T(
        "Kasbah pre-sahariana del siglo XVII, Patrimonio UNESCO desde 1987 — escenario de Gladiator, Lawrence de Arabia, Babel, La Momia, Juego de Tronos y muchas más.",
        "Pre-Saharan 17th-century kasbah, UNESCO since 1987 — set for Gladiator, Lawrence of Arabia, Babel, The Mummy, Game of Thrones and many more.",
        "Kasbah pré-saharienne du XVIIe, UNESCO depuis 1987 — décor de Gladiator, Lawrence d'Arabie, Babel, La Momie, Game of Thrones.",
      ),
    },
    {
      title: T("Tizi n'Tichka · 2.260 m", "Tizi n'Tichka · 2,260 m", "Tizi n'Tichka · 2 260 m"),
      body: T(
        "El paso de carretera más alto de Marruecos. Vistas vertiginosas sobre los valles del Atlas y la frontera entre dos paisajes y dos climas.",
        "Morocco's highest road pass. Dizzying views over the Atlas valleys — the frontier between two landscapes and two climates.",
        "Le plus haut col routier du Maroc. Vues vertigineuses sur les vallées de l'Atlas — frontière entre deux paysages et deux climats.",
      ),
    },
  ],
};

const DAY_09_MARRAKECH_MEDINA = {
  route_id: "frz910-marrakech-medina",
  id: "frz910-d9",
  image: "https://images.unsplash.com/photo-1551918120-9739cb430c6d?auto=format&fit=crop&w=2000&q=85",
  accent: "#C16542",
  title: T(
    "Marrakech · visita guiada por la Medina",
    "Marrakech · guided medina tour",
    "Marrakech · visite guidée de la médina",
  ),
  body: {
    es: "Por la mañana, visita guiada a pie por la Medina de Marrakech, acompañados de un guía local. Comenzaremos admirando el Alminar de la Koutoubia, considerado la «hermana gemela» de la Giralda de Sevilla. Visitaremos el Palacio de la Bahía, uno de los mejores ejemplos de la arquitectura marroquí. Nos adentraremos en las estrechas callejuelas del Zoco, donde podremos ver a los artesanos en plena actividad: tejedores de alfombras, fabricantes de babuchas y una infinita variedad de artesanía tradicional de calidad. Visitaremos una farmacia bereber, donde nos desvelarán algunos de sus remedios y secretos naturales. Regresaremos a la Plaza Djemaa el-Fna, donde el ambiente diurno ofrece una experiencia muy distinta a la noche anterior. Tarde libre para explorar la Medina a nuestro ritmo o poner en práctica el arte del regateo. Cena y alojamiento en Riad en la Medina o Hotel 5★.",
    en: "Morning guided walking tour of the Marrakech medina with a local guide. We start admiring the Koutoubia minaret — considered the «twin sister» of Seville's Giralda. We visit the Bahia Palace, one of the finest examples of Moroccan architecture. We enter the narrow alleys of the souk to see artisans at work: carpet weavers, babouche makers and an endless variety of quality traditional crafts. Visit to a Berber pharmacy and its herbal «secrets». We return to Jemaa el-Fna square, where the daytime atmosphere is very different from the previous night. Free afternoon to explore the medina at your own pace or master the art of haggling. Dinner and overnight in a Medina riad or 5★ hotel.",
    fr: "Le matin, visite guidée à pied de la médina de Marrakech avec guide local. Nous commençons par admirer le minaret de la Koutoubia — sœur jumelle de la Giralda de Séville. Visite du palais de la Bahia, l'un des plus beaux exemples de l'architecture marocaine. Plongée dans les ruelles du souk pour voir les artisans à l'œuvre : tisserands de tapis, babouchiers et une infinité d'artisanat traditionnel de qualité. Visite d'une pharmacie berbère et de ses « secrets » à base de plantes. Retour à la place Jemaa el-Fna, dont l'ambiance diurne diffère radicalement de la veille. Après-midi libre pour explorer la médina à votre rythme ou pratiquer l'art du marchandage. Dîner et nuit en riad de la médina ou hôtel 5★.",
  },
  culture: [
    {
      title: T("Koutoubia · hermana gemela de la Giralda", "Koutoubia · twin sister of the Giralda", "Koutoubia · sœur jumelle de la Giralda"),
      body: T(
        "El alminar de 77 m fue construido por los almohades en el siglo XII, junto con la Giralda de Sevilla y la Torre Hassan de Rabat, por el mismo arquitecto.",
        "The 77-m minaret was built by the Almohads in the 12th century — alongside Seville's Giralda and Rabat's Hassan Tower — by the same architect.",
        "Le minaret de 77 m fut construit par les Almohades au XIIe siècle, avec la Giralda et la tour Hassan, par le même architecte.",
      ),
    },
    {
      title: T("Djemaa el-Fna · obra maestra UNESCO", "Jemaa el-Fna · UNESCO masterpiece", "Jemaa el-Fna · chef-d'œuvre UNESCO"),
      body: T(
        "Reconocida en 2001 como obra maestra del patrimonio oral e inmaterial de la humanidad. La plaza más viva de África.",
        "Recognised in 2001 as a masterpiece of the oral and intangible heritage of humanity. The most alive square in Africa.",
        "Reconnue en 2001 chef-d'œuvre du patrimoine oral et immatériel de l'humanité. La place la plus vivante d'Afrique.",
      ),
    },
  ],
};

const DAY_10_MARRAKECH_RETURN = {
  route_id: "frz910-marrakech-return",
  id: "frz910-d10",
  image: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=2000&q=85",
  accent: "#5C5248",
  title: T(
    "Marrakech · regreso",
    "Marrakech · return flight",
    "Marrakech · vol retour",
  ),
  body: {
    es: "A la hora convenida, traslado al aeropuerto de Marrakech para tomar el vuelo de regreso.",
    en: "At the agreed time, transfer to Marrakech airport for the return flight.",
    fr: "À l'heure convenue, transfert à l'aéroport de Marrakech pour le vol retour.",
  },
  culture: [],
};

/* ============================================================
   Programme · 9 nights / 10 days · Fez → Marrakech
============================================================ */

export const PROGRAM_FRZ_910 = {
  routeId: "tourFezRak910",
  duration_key: "frz9n10d",
  duration: T("9 noches / 10 días", "9 nights / 10 days", "9 nuits / 10 jours"),
  prices: { low: 2490, mid: 2790, high: 3090, premium: 3490 },
  days: [
    DAY_01_ARRIVAL_FEZ,
    DAY_02_FEZ_MEDIO_ATLAS_ERFOUD,
    DAY_03_ERFOUD_ERG_BIVOUAC,
    DAY_04_ERG_KHAMLIA_TOMBOUCTOU,
    DAY_05_RISSANI_RELAX,
    DAY_06_TODRA_DADES,
    DAY_07_MGOUN_ATLAS,
    DAY_08_AITBENHADDOU_MARRAKECH,
    DAY_09_MARRAKECH_MEDINA,
    DAY_10_MARRAKECH_RETURN,
  ],
  details: {
    includes: {
      es: [
        "Una noche en Fez en Riad en la Medina o Hotel 4★ en Media Pensión",
        "Dos noches en Erfoud en Kasbah Hotel Xaluca en Media Pensión",
        "Una noche en Erg Chebbi en Bivouac de Luxe en el desierto en Media Pensión",
        "Una noche en Kasbah Hotel Tombouctou en Media Pensión",
        "Dos noches en Boumalne Dades en Hotel Xaluca Dadès en Media Pensión",
        "Dos noches en Marrakech en Riad en la Medina o Hotel 5★ en Alojamiento y Desayuno",
        "Comida tipo picnic en el desierto · Almuerzo en «Gîte d'Étape» en M'Goun",
        "Excursión en dromedario por el Erg Chebbi",
        "Vehículo 4x4 con chófer desde el día 2 hasta el día 8 del itinerario, ambos incluidos",
        "Visita con guía local en Fez · Visita con guía local en Marrakech",
        "Visitas a Aït Ben Haddou y Palacio de la Bahía",
        "Transfers desde y hacia aeropuertos · Combustible · Seguro de asistencia en viaje",
      ],
      en: [
        "One night in Fez in a Medina riad or 4★ hotel · half board",
        "Two nights in Erfoud at Kasbah Hotel Xaluca · half board",
        "One night at the Bivouac de Luxe in the Erg Chebbi · half board",
        "One night at Kasbah Hotel Tombouctou · half board",
        "Two nights in Boumalne Dades at Hotel Xaluca Dades · half board",
        "Two nights in Marrakech in a Medina riad or 5★ hotel · bed & breakfast",
        "Picnic lunch in the desert · Mountain lunch at a «Gîte d'Étape» in the M'Goun",
        "Camel ride in the Erg Chebbi",
        "4x4 with driver from day 2 to day 8 inclusive",
        "Local guided tour in Fez · Local guided tour in Marrakech",
        "Visits to Aït Ben Haddou and the Bahia Palace",
        "Airport transfers · Fuel · Travel assistance insurance",
      ],
      fr: [
        "Une nuit à Fès en riad de la médina ou hôtel 4★ · demi-pension",
        "Deux nuits à Erfoud à la Kasbah Hôtel Xaluca · demi-pension",
        "Une nuit au Bivouac de Luxe dans l'Erg Chebbi · demi-pension",
        "Une nuit à la Kasbah Hôtel Tombouctou · demi-pension",
        "Deux nuits à Boumalne Dadès à l'Hôtel Xaluca Dadès · demi-pension",
        "Deux nuits à Marrakech en riad de la médina ou hôtel 5★ · petit-déjeuner",
        "Pique-nique le midi au désert · Déjeuner en « Gîte d'Étape » dans le M'Goun",
        "Balade à dromadaire dans l'Erg Chebbi",
        "4x4 avec chauffeur du jour 2 au jour 8 inclus",
        "Guide local à Fès et à Marrakech",
        "Visites d'Aït Ben Haddou et du palais de la Bahia",
        "Transferts aéroports · Carburant · Assistance voyage",
      ],
    },
    excludes: {
      es: [
        "Las bebidas",
        "Las comidas a mediodía (excepto las dos detalladas)",
        "Las cenas no incluidas en el paquete",
        "Otros extras personales (quads, masajes, tratamientos de spa…)",
        "El vuelo (salvo que se indique lo contrario)",
        "Suplemento para añadir seguro de cancelación · 30 € por persona para viajes de máximo 10 días",
      ],
      en: [
        "Drinks",
        "Lunches (except the two listed above)",
        "Dinners not included in the package",
        "Personal extras (quads, massages, spa treatments…)",
        "Flights (unless otherwise stated)",
        "Optional cancellation insurance · €30 per person for trips of up to 10 days",
      ],
      fr: [
        "Boissons",
        "Déjeuners (sauf les deux indiqués ci-dessus)",
        "Dîners non inclus dans le forfait",
        "Extras personnels (quads, massages, spa…)",
        "Le vol (sauf mention contraire)",
        "Assurance annulation en option · 30 € par personne pour les voyages jusqu'à 10 jours",
      ],
    },
    notes: {
      es: [
        "Opciones de vuelos: Royal Air Maroc (vía Casablanca) o low-cost como Vueling, Air Arabia, Ryanair.",
        "Las tarifas se calculan según la ocupación del 4x4. El coste se divide entre los ocupantes.",
        "Tarifas basadas en habitaciones dobles/triples. Suplemento individual: consultar.",
        "Descuento niños (3-11 años) compartiendo con dos adultos: consultar.",
        "Si los riads previstos están completos, se proponen alternativas equivalentes (posibles variaciones de precio se informan previamente).",
        "En temporada alta, los guías de medina pueden compartirse con otros viajeros.",
        "Chóferes hispanohablantes son limitados — reservar con antelación.",
        "Los guías oficiales están reservados exclusivamente para las visitas a las medinas, no para las rutas.",
        "Es obligatorio pasaporte vigente con un mínimo de 3 meses desde la fecha de regreso.",
        "Quads opcionales: 70 € por vehículo (circuito de 1 hora). Spa y masajes en recepción de hotel.",
        "El mercado de Rissani se celebra los martes, jueves y domingos.",
      ],
      en: [
        "Flight options: Royal Air Maroc (via Casablanca) or low-cost (Vueling, Air Arabia, Ryanair).",
        "Rates depend on 4x4 occupancy. Cost is split between passengers.",
        "Rates based on double/triple rooms. Single room supplement: on request.",
        "Children discount (3-11) sharing with two adults: on request.",
        "Equivalent alternative riads will be offered if those budgeted are full (any price variation is communicated beforehand).",
        "In high season medina guides may be shared with other travellers.",
        "Spanish-speaking drivers are limited — book early.",
        "Official guides are reserved exclusively for medina visits, not for the on-road portions.",
        "Valid passport required with at least 3 months remaining from the return date.",
        "Optional quads: €70 per vehicle (1-hour circuit). Spa & massages at hotel reception.",
        "Rissani market runs Tuesday, Thursday and Sunday.",
      ],
      fr: [
        "Options de vol : Royal Air Maroc (via Casablanca) ou low-cost (Vueling, Air Arabia, Ryanair).",
        "Tarifs selon l'occupation du 4x4. Le coût est partagé entre les occupants.",
        "Tarifs base chambre double/triple. Supplément single : sur demande.",
        "Réduction enfants (3-11 ans) partageant avec 2 adultes : sur demande.",
        "Riads équivalents proposés si complets (les éventuelles variations de prix sont communiquées en amont).",
        "En haute saison, les guides de médina peuvent être partagés.",
        "Chauffeurs hispanophones limités — réserver tôt.",
        "Les guides officiels sont réservés aux visites des médinas, pas aux trajets.",
        "Passeport valable au minimum 3 mois après le retour.",
        "Quads en option : 70 € par véhicule (1 h). Spa et massages à la réception de l'hôtel.",
        "Marché de Rissani les mardi, jeudi et dimanche.",
      ],
    },
    terms: {
      es: [
        "Reserva: 30% del importe total en el momento de la confirmación.",
        "Pago final: 70% restante hasta 30 días antes de la salida.",
        "Si el vuelo elegido requiere emisión inmediata: 100% del billete + 30% de los servicios de tierra al reservar.",
        "Cancelación 45 días antes de la salida: 30% del importe total.",
        "Cancelación 21 días antes de la salida: 100% del importe total.",
        "Penalización fija de 50 € por reserva en concepto de gastos de gestión.",
        "Estas condiciones aplican sólo a los servicios de tierra. Los vuelos se rigen por las condiciones de cada compañía aérea. Los seguros no se reembolsan.",
      ],
      en: [
        "Booking: 30% at confirmation.",
        "Final payment: 70% balance up to 30 days before departure.",
        "If the chosen flight requires immediate ticketing: 100% of the flight + 30% of land services at booking.",
        "Cancellation 45 days before departure: 30% of the total.",
        "Cancellation 21 days before departure: 100% of the total.",
        "Fixed €50 per booking management fee.",
        "Conditions apply to land services only. Flights follow each airline's rules. Insurances are non-refundable.",
      ],
      fr: [
        "Réservation : 30 % à la confirmation.",
        "Paiement final : solde de 70 % jusqu'à 30 jours avant le départ.",
        "Si le vol exige une émission immédiate : 100 % du billet + 30 % des services terrestres à la réservation.",
        "Annulation 45 jours avant : 30 % du total.",
        "Annulation 21 jours avant : 100 % du total.",
        "Pénalité fixe de 50 € par réservation pour frais de gestion.",
        "Conditions applicables aux services terrestres uniquement. Les vols suivent les règles de chaque compagnie. Les assurances ne sont pas remboursables.",
      ],
    },
  },
};

export default PROGRAM_FRZ_910;
