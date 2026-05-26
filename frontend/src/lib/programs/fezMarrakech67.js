// Fez → Marrakech · 6 nights / 7 days — full programme data.
import { SHARED_SEASONS, SHARED_DETAILS } from "@/lib/programData";

const T = (es, en, fr) => ({ es, en, fr });
export { SHARED_SEASONS, SHARED_DETAILS };

const DAY_FRZ_FEZ_ARRIVAL = {
  route_id: "frz-fez-arrival",
  id: "frz-d1",
  image: "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=2000&q=85",
  accent: "#5A6B4F",
  title: T("Llegada a Fez", "Arrival in Fez", "Arrivée à Fès"),
  body: {
    es: "Salida desde el aeropuerto de origen con destino a Fez. Llegada y, dependiendo de la época del año, podrá haber diferencia horaria. Recogida en el aeropuerto y traslado al Riad en la Medina o Hotel 4★. Alojamiento y cena. Nota: dependiendo de la hora del vuelo, la visita guiada de Fez podría adelantarse a esta jornada, dejando la siguiente para disfrutar del cambio de zona.",
    en: "Departure from your home airport bound for Fez. Arrival — note the time difference depending on the season. Airport pick-up and transfer to a riad in the medina or a 4★ hotel. Dinner and overnight. If the flight arrives early, the guided medina tour may be brought forward to today.",
    fr: "Départ depuis votre aéroport d'origine pour Fès. Arrivée à Fès (décalage horaire possible selon la saison). Accueil et transfert au riad dans la médina ou hôtel 4★. Dîner et nuit. Selon l'heure du vol, la visite guidée de la médina peut être avancée à ce jour.",
  },
  culture: [
    { title: T("La medina más fascinante del mundo árabe", "The most fascinating medina in the Arab world", "La médina la plus fascinante du monde arabe"),
      body: T("La medina de Fez es Patrimonio de la Humanidad UNESCO desde 1981 — 9.000 callejones, 60.000 puertas y un tejido urbano intacto desde el siglo IX.",
              "Fez medina has been UNESCO World Heritage since 1981 — 9,000 alleys, 60,000 doors and an urban fabric untouched since the 9th century.",
              "La médina de Fès est inscrite UNESCO depuis 1981 — 9 000 ruelles, 60 000 portes et un tissu urbain intact depuis le IXe siècle.") },
    { title: T("La universidad más antigua del mundo", "The world's oldest university", "La plus ancienne université du monde"),
      body: T("La Universidad Al-Qarawiyyin, fundada en 859 d.C. por Fátima al-Fihri, está reconocida por la UNESCO y Guinness como la más antigua del mundo todavía en funcionamiento.",
              "Al-Qarawiyyin University, founded in 859 CE by Fatima al-Fihri, is recognised by UNESCO and Guinness as the oldest continuously running university in the world.",
              "L'Université Al-Qarawiyyin, fondée en 859 par Fatima al-Fihri, est reconnue par l'UNESCO et le Guinness comme la plus ancienne au monde toujours en activité.") },
  ],
};

const DAY_FRZ_FEZ_IFRANE_ERFOUD = {
  route_id: "frz-fez-ifrane-erfoud",
  id: "frz-d2",
  image: "https://images.unsplash.com/photo-1547234935-80c7145ec969?auto=format&fit=crop&w=2000&q=85",
  accent: "#7C8B5C",
  title: T("Fez – Ifrane – Valle del Ziz – Erfoud", "Fez – Ifrane – Ziz Valley – Erfoud", "Fès – Ifrane – Vallée du Ziz – Erfoud"),
  body: {
    es: "Por la mañana, visita a pie con guía local por la antigua medina de Fez — laberíntica, viva, con centros artesanales, mezquitas y palacios. A primera hora de la tarde, salida en 4x4 hacia el sur cruzando el Medio Atlas hasta Ifrane, conocida como «la pequeña Suiza». Continuación por los bosques de cedros gigantes (con suerte veremos colonias de monos salvajes) y descenso por el Valle del Ziz, hogar de más de diez millones de palmeras, hasta Erfoud, «la puerta del desierto». Alojamiento y cena en Kasbah Hotel Xaluca.",
    en: "Morning walking tour with a local guide through Fez medina — labyrinthine, alive, with artisans, mosques and palaces. Early afternoon, drive south by 4x4 across the Middle Atlas to Ifrane, known as «little Switzerland». We continue through the giant cedar forests (Barbary apes likely) and descend the Ziz Valley with its ten million date palms to Erfoud, «the gateway to the desert». Dinner and overnight at Kasbah Hotel Xaluca.",
    fr: "Matin, visite à pied de la médina de Fès avec guide local — labyrinthe vivant d'artisans, mosquées et palais. Début d'après-midi, départ en 4x4 vers le sud à travers le Moyen Atlas jusqu'à Ifrane, surnommée « la petite Suisse ». Poursuite à travers les forêts de cèdres géants (probable observation de magots) et descente par la vallée du Ziz, qui abrite plus de dix millions de palmiers, jusqu'à Erfoud. Dîner et nuit à la Kasbah Hôtel Xaluca.",
  },
  culture: [
    { title: T("Ifrane · la pequeña Suiza marroquí", "Ifrane · little Moroccan Switzerland", "Ifrane · la petite Suisse marocaine"),
      body: T("A 1.665 m de altitud, fue diseñada por arquitectos franceses en los años 30 con tejados a dos aguas — un pueblo alpino en pleno Marruecos.",
              "At 1,665 m, designed by French architects in the 1930s with pitched roofs — an Alpine village in the heart of Morocco.",
              "À 1 665 m d'altitude, conçue par des architectes français dans les années 30 avec ses toits en pente — un village alpin au cœur du Maroc.") },
    { title: T("Cedros gigantes y monos de Berbería", "Giant cedars and Barbary apes", "Cèdres géants et magots"),
      body: T("Los cedros milenarios del Medio Atlas son el último refugio del mono de Berbería, especie protegida nativa del norte de África.",
              "The Middle Atlas's ancient cedars are the last refuge of the Barbary macaque, a protected species native to North Africa.",
              "Les cèdres millénaires du Moyen Atlas sont le dernier refuge du magot, espèce protégée d'Afrique du Nord.") },
  ],
};

const DAY_FRZ_DESERT = {
  route_id: "desert-bivouac",   // reuse landmarks/gallery already curated
  id: "frz-d3",
  image: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=2000&q=85",
  accent: "#C16542",
  title: T("Día de aventura en el desierto", "A day of desert adventure", "Journée d'aventure au désert"),
  body: {
    es: "Jornada de Desierto Total. Recorreremos una de las antiguas pistas del Rally Dakar, visitando poblados y familias nómadas. Parada en las Canteras de Fósiles Marinos (más de 360 millones de años) y picnic en un auténtico oasis. Continuación hasta el Gran Erg Chebbi, donde cambiamos el 4x4 por dromedarios para entrar en las dunas y contemplar una puesta de sol inolvidable. Llegada al Bivouac de Luxe (Kamkamia Luxury Desert Camp), haimas tradicionales bajo un cielo estrellado absoluto.",
    en: "A day of Total Desert. We drive an old Dakar Rally track, visiting nomad villages. Stop at the marine fossil quarries (over 360 million years old) and picnic in an authentic oasis. We continue to the great Erg Chebbi, swap 4x4 for camels and ride into the dunes for an unforgettable sunset. Overnight at the Bivouac de Luxe (Kamkamia Luxury Desert Camp) under an absolute starry sky.",
    fr: "Journée Désert Total. Nous parcourons une ancienne piste du Rallye Dakar, à la rencontre de villages et familles nomades. Arrêt aux carrières de fossiles marins (plus de 360 millions d'années) et pique-nique dans une oasis authentique. Poursuite vers le grand Erg Chebbi, échange du 4x4 contre des dromadaires pour rejoindre les dunes et admirer un coucher de soleil inoubliable. Nuit au Bivouac de Luxe (Kamkamia Luxury Desert Camp) sous un ciel étoilé absolu.",
  },
  culture: [
    { title: T("Kamkamia Luxury Desert Camp", "Kamkamia Luxury Desert Camp", "Kamkamia Luxury Desert Camp"),
      body: T("Haimas de lujo con baño privado y agua caliente, en pleno corazón del Erg Chebbi. Cena bereber a la luz de las velas y observación de estrellas con telescopio.",
              "Luxury tents with private bathroom and hot water, at the heart of the Erg Chebbi. Candle-lit Berber dinner and telescope stargazing.",
              "Tentes berbères de luxe avec salle de bain et eau chaude, au cœur de l'Erg Chebbi. Dîner berbère aux chandelles et observation des étoiles au télescope.") },
  ],
};

const DAY_FRZ_SUNRISE = {
  route_id: "khamlia-rissani",  // reuse curated landmarks/gallery
  id: "frz-d4",
  image: "https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=2000&q=85",
  accent: "#D97742",
  title: T("Amanecer en el desierto y regreso a la kasbah", "Sunrise in the desert and return to the kasbah", "Lever du soleil et retour à la kasbah"),
  body: {
    es: "«Cita con el Amanecer»: madrugamos para caminar hasta lo alto de las dunas y disfrutar de la salida del sol. Desayuno beduino en el campamento. Salida en 4x4 rodeando el Erg hasta Merdani (pueblo abandonado) y al poblado de origen sudanés Khamlia, donde sus habitantes nos reciben con danzas tradicionales y té a la menta. Visita al mercado de Rissani (martes, jueves y domingos) — curioso «parking de burros». Mirador natural de despedida del desierto. Tarde libre en Kasbah Xaluca: piscina climatizada, jacuzzi, tenis, minigolf u opcionales (hammam, masajes, quads). Alojamiento y cena.",
    en: "«A date with the sunrise»: early walk to the dune top for the sunrise. Bedouin breakfast at the camp. Then 4x4 around the Erg to abandoned Merdani village and the Sudanese-origin village of Khamlia, where locals welcome us with traditional dances and mint tea. Rissani market visit (Tue/Thu/Sun) — quirky «donkey parking». Natural viewpoint to bid farewell to the desert. Free afternoon at Kasbah Xaluca: heated pool, jacuzzi, tennis, minigolf or optional hammam, massages, quad rides. Dinner and overnight.",
    fr: "« Rendez-vous avec l'aube » : montée à pied au sommet des dunes pour le lever du soleil. Petit-déjeuner bédouin au campement. Puis 4x4 autour de l'Erg jusqu'au village abandonné de Merdani et au village d'origine soudanaise de Khamlia, où les habitants nous accueillent avec danses traditionnelles et thé à la menthe. Marché de Rissani (mar/jeu/dim) — curieux « parking d'ânes ». Mirador naturel pour faire ses adieux au désert. Après-midi libre à la Kasbah Xaluca : piscine chauffée, jacuzzi, tennis, mini-golf ou hammam, massages, quads en option. Dîner et nuit.",
  },
  wellness: [
    { es: "Piscina climatizada", en: "Heated pool", fr: "Piscine chauffée" },
    { es: "Hammam & Jacuzzi", en: "Hammam & Jacuzzi", fr: "Hammam & Jacuzzi" },
    { es: "Masajes", en: "Massages", fr: "Massages" },
    { es: "Quads opcionales", en: "Optional quads", fr: "Quads en option" },
    { es: "Tenis y minigolf", en: "Tennis & minigolf", fr: "Tennis & minigolf" },
  ],
  culture: [
    { title: T("Música Gnawa · Patrimonio UNESCO", "Gnawa music · UNESCO heritage", "Musique Gnawa · patrimoine UNESCO"),
      body: T("La música Gnawa de Khamlia es Patrimonio Cultural Inmaterial UNESCO. Sus ritmos hipnóticos, krakebs metálicos y tambores hablan del legado africano del sur marroquí.",
              "Khamlia's Gnawa music is UNESCO Intangible Heritage. Its hypnotic rhythms, metal krakebs and drums speak to southern Morocco's African legacy.",
              "La musique Gnawa de Khamlia est Patrimoine Culturel Immatériel UNESCO.") },
  ],
};

const DAY_FRZ_TODRA_DADES = {
  route_id: "frz-todra-dades",
  id: "frz-d5",
  image: "https://images.unsplash.com/photo-1604940500627-d3f44d1d21c6?auto=format&fit=crop&w=2000&q=85",
  accent: "#A07042",
  title: T("Erfoud – Tinerhir – Gargantas del Todra – Valle del Dadès", "Erfoud – Tinerhir – Todra Gorges – Dades Valley", "Erfoud – Tinerhir – Gorges du Todra – Vallée du Dadès"),
  body: {
    es: "Salida por carretera asfaltada hacia Tinerhir, pequeña y próspera población con casas rosas y extensos palmerales — punto de partida ideal para las Gargantas del Todra, donde daremos un breve paseo siguiendo el curso del río. Continuación hacia Boumalne Dades, en el Valle de los Pájaros, a 1.612 m de altitud, en plena Cordillera del Alto Atlas. Por la tarde, recorrido por el Valle del Dadès hasta sus impresionantes gargantas, parada en un mirador para tomar un té con vistas, y de regreso parada en las curiosas «patas de mono». Alojamiento y cena en Hotel Xaluca Dadès.",
    en: "Drive on asphalt to Tinerhir, a small thriving town of pink houses and palm groves — gateway to the famous Todra Gorges, where we take a short walk along the river. Continue to Boumalne Dades, in the Valley of the Birds at 1,612 m in the heart of the High Atlas. Afternoon drive through the Dades Valley to its stunning gorges, tea stop at a viewpoint, and return via the «Monkey Fingers» rock formation. Dinner and overnight at Hotel Xaluca Dades.",
    fr: "Route asphaltée vers Tinerhir, petite ville prospère aux maisons roses et palmeraies — porte des célèbres Gorges du Todra, où nous marchons un peu le long de la rivière. Continuation vers Boumalne Dadès, dans la Vallée des Oiseaux à 1 612 m au cœur du Haut Atlas. L'après-midi, parcours de la vallée du Dadès jusqu'à ses gorges spectaculaires, arrêt-thé au mirador et retour par les « Doigts de Singe ». Dîner et nuit à l'Hôtel Xaluca Dadès.",
  },
  culture: [
    { title: T("Gargantas del Todra y del Dadès", "Todra & Dades Gorges", "Gorges du Todra & du Dadès"),
      body: T("Dos de los cañones más espectaculares de Marruecos, esculpidos durante millones de años. Paredes verticales del Todra de hasta 160 m y curvas serpenteantes del Dadès fotografiadas en todo el mundo.",
              "Two of Morocco's most spectacular canyons, carved over millions of years. Todra's 160 m vertical walls and Dades' winding hairpins photographed worldwide.",
              "Deux des canyons les plus spectaculaires du Maroc, sculptés pendant des millions d'années.") },
  ],
};

const DAY_FRZ_TICHKA_MARRAKECH = {
  route_id: "frz-tichka-marrakech",
  id: "frz-d6",
  image: "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=2000&q=85",
  accent: "#D4A373",
  title: T("Hacia Marrakech · Aït Ben Haddou y paso del Tichka", "On to Marrakech · Aït Ben Haddou and Tichka pass", "En route vers Marrakech · Aït Ben Haddou et col du Tichka"),
  body: {
    es: "Etapa de unos 310 km que se ven ampliamente recompensados por la espectacularidad de los paisajes. Parada para visitar la kasbah de Aït Ben Haddou, Patrimonio de la Humanidad UNESCO y escenario de incontables películas. Continuación por el Tizi n'Tichka, el paso de carretera más alto de Marruecos. Dejamos atrás el paisaje árido y lunar del sur para adentrarnos en valles verdes y tonos ocres. Llegada a Marrakech por la tarde, primera toma de contacto en la incomparable Plaza Djemaa el-Fna: recitadores, adivinadores, malabaristas, danzantes, encantadores de serpientes y sacamuelas. Al anochecer, paradas de comida al aire libre con platos típicos. Alojamiento en Riad en la Medina o Hotel 5★. Este es el último día en 4x4.",
    en: "About 310 km richly rewarded by spectacular landscapes. We stop to visit the UNESCO-listed kasbah of Aït Ben Haddou, setting for countless films. We cross the Tizi n'Tichka, Morocco's highest road pass. The arid southern lunar landscape gives way to green valleys and ochre tones. Afternoon arrival in Marrakech — first stroll at the unmissable Jemaa el-Fna square: storytellers, fortune-tellers, jugglers, dancers, snake charmers. At nightfall, open-air food stalls serve traditional dishes. Overnight in a medina riad or 5★ hotel. This is the last day in 4x4.",
    fr: "Étape d'environ 310 km amplement récompensée par des paysages spectaculaires. Arrêt à la kasbah d'Aït Ben Haddou, UNESCO, décor de films innombrables. Passage du Tizi n'Tichka, le plus haut col routier du Maroc. Le paysage aride et lunaire du sud cède la place aux vallées vertes et aux tons ocres. Arrivée à Marrakech l'après-midi — première prise de contact sur la place Jemaa el-Fna : conteurs, devins, jongleurs, danseurs, charmeurs de serpents. À la tombée du jour, échoppes de cuisine en plein air. Nuit en riad de la médina ou hôtel 5★. Dernier jour en 4x4.",
  },
  culture: [
    { title: T("Aït Ben Haddou · escenario de Gladiator y Juego de Tronos", "Aït Ben Haddou · set of Gladiator and Game of Thrones", "Aït Ben Haddou · décor de Gladiator et Game of Thrones"),
      body: T("Kasbah pre-sahariana del siglo XVII, Patrimonio UNESCO desde 1987, ha sido escenario de Gladiator, Lawrence de Arabia, Babel, La Momia, Juego de Tronos y muchas más.",
              "Pre-Saharan 17th-century kasbah, UNESCO listed since 1987 — set for Gladiator, Lawrence of Arabia, Babel, The Mummy, Game of Thrones and many more.",
              "Kasbah pré-saharienne du XVIIe, UNESCO depuis 1987 — décor de Gladiator, Lawrence d'Arabie, Babel, La Momie, Game of Thrones.") },
    { title: T("Tizi n'Tichka · 2.260 m", "Tizi n'Tichka · 2,260 m", "Tizi n'Tichka · 2 260 m"),
      body: T("El paso de carretera más alto de Marruecos. Vistas vertiginosas sobre los valles del Atlas y la frontera entre dos paisajes y dos climas.",
              "Morocco's highest road pass. Dizzying views over the Atlas valleys — the frontier between two landscapes and climates.",
              "Le plus haut col routier du Maroc. Vues vertigineuses sur les vallées de l'Atlas.") },
  ],
};

const DAY_FRZ_MARRAKECH_RETURN = {
  route_id: "frz-marrakech-return",
  id: "frz-d7",
  image: "https://images.unsplash.com/photo-1551918120-9739cb430c6d?auto=format&fit=crop&w=2000&q=85",
  accent: "#3A4A5F",
  title: T("Marrakech y regreso", "Marrakech and return", "Marrakech et retour"),
  body: {
    es: "Por la mañana, visita guiada a pie por la Medina de Marrakech con guía local. Comenzaremos admirando el Alminar de la Koutoubia, hermana gemela de la Giralda de Sevilla, seguido del Palacio de la Bahía. Nos adentraremos en el Zoco para ver artesanos en acción: tejedores de alfombras, fabricantes de babuchas y mil oficios tradicionales. Visita a una farmacia bereber con sus «secretillos» tradicionales. Regreso a la plaza Djemaa el-Fna, que de día muestra un ambiente muy distinto al de la noche. Tarde libre para el arte del regateo o explorar la medina por nuestra cuenta. A la hora convenida, traslado al aeropuerto de Marrakech para el vuelo de regreso.",
    en: "Morning guided walking tour of the Marrakech medina. We start at the Koutoubia minaret — twin sister of Seville's Giralda — followed by the Bahia Palace. We enter the souks to see artisans in action: carpet weavers, babouche makers and a thousand traditional trades. Visit to a Berber pharmacy and its herbal «secrets». Back to Jemaa el-Fna square, very different by day. Free afternoon for haggling or exploring the medina on your own. Transfer to Marrakech airport for the return flight at the agreed time.",
    fr: "Le matin, visite guidée à pied de la médina de Marrakech. Nous commençons par le minaret de la Koutoubia — sœur jumelle de la Giralda de Séville — suivi du palais de la Bahia. Plongée dans les souks pour voir les artisans à l'œuvre : tisserands de tapis, babouchiers et mille métiers traditionnels. Visite d'une pharmacie berbère et ses « secrets ». Retour place Jemaa el-Fna, très différente de jour. Après-midi libre pour le marchandage ou pour explorer la médina à votre rythme. Transfert à l'aéroport de Marrakech pour le vol retour à l'heure convenue.",
  },
  culture: [
    { title: T("Koutoubia · hermana gemela de la Giralda", "Koutoubia · twin sister of the Giralda", "Koutoubia · sœur jumelle de la Giralda"),
      body: T("El alminar de 77 m fue construido por los almohades en el siglo XII, junto con la Giralda de Sevilla y la Torre Hassan de Rabat, por el mismo arquitecto.",
              "The 77-m minaret was built by the Almohads in the 12th century — alongside Seville's Giralda and Rabat's Hassan Tower — by the same architect.",
              "Le minaret de 77 m fut construit par les Almohades au XIIe siècle, avec la Giralda et la tour Hassan, par le même architecte.") },
    { title: T("Djemaa el-Fna · UNESCO", "Jemaa el-Fna · UNESCO", "Jemaa el-Fna · UNESCO"),
      body: T("Reconocida en 2001 como «obra maestra del patrimonio oral e inmaterial de la humanidad» por la UNESCO. Es la plaza más viva de África.",
              "Recognised in 2001 by UNESCO as a «masterpiece of the oral and intangible heritage of humanity». The most alive square in Africa.",
              "Reconnue en 2001 par l'UNESCO comme « chef-d'œuvre du patrimoine oral et immatériel de l'humanité ».") },
  ],
};

// Add Fez→Marrakech variants used by GranSurProgramPage
const DAY_FRZ_MARRAKECH_FREE = {
  route_id: "frz-marrakech-free",
  id: "frz-d7b",
  image: "https://images.unsplash.com/photo-1551918120-9739cb430c6d?auto=format&fit=crop&w=2000&q=85",
  accent: "#3A4A5F",
  title: { es: "Descubriendo Marrakech", en: "Discovering Marrakech", fr: "À la découverte de Marrakech" },
  body: {
    es: "Por la mañana, visita guiada a pie por la Medina de Marrakech con guía local. Empezamos en el alminar de la Koutoubia, gemela de la Giralda de Sevilla, y continuamos por el Palacio de la Bahía. Nos adentramos en el Zoco para ver artesanos tejiendo alfombras, fabricando babuchas y mil oficios. Visita a una farmacia bereber con sus «secretillos» tradicionales. Volvemos a la Plaza Djemaa el-Fna, muy distinta de día. Tarde libre para el regateo o descubrir la medina a nuestro aire. Alojamiento en Riad en la Medina o Hotel 5★.",
    en: "Morning guided walking tour of Marrakech medina. We start at the Koutoubia minaret — twin of Seville's Giralda — and continue to the Bahia Palace. We enter the souks to see artisans weaving rugs, making babouches and a thousand other crafts. Visit to a Berber pharmacy with its herbal «secrets». Back to Jemaa el-Fna square, very different by day. Free afternoon to haggle or explore the medina at your own pace. Overnight in a Medina riad or 5★ hotel.",
    fr: "Matin : visite guidée à pied de la médina de Marrakech. Nous commençons par le minaret de la Koutoubia — sœur de la Giralda — puis le palais de la Bahia. Plongée dans les souks pour voir les artisans à l'œuvre. Visite d'une pharmacie berbère et ses « secrets ». Retour à Jemaa el-Fna, très différente de jour. Après-midi libre. Nuit en riad ou hôtel 5★.",
  },
  culture: [],
};

const DAY_FRZ_MARRAKECH_TRANSFER = {
  route_id: "frz-marrakech-return",
  id: "frz-d-out",
  image: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=2000&q=85",
  accent: "#5C5248",
  title: { es: "Traslado al aeropuerto y regreso", en: "Airport transfer and return", fr: "Transfert aéroport et retour" },
  body: {
    es: "A la hora convenida, traslado al aeropuerto de Marrakech para coger el vuelo de regreso.",
    en: "At the agreed time, transfer to Marrakech airport for the return flight.",
    fr: "À l'heure convenue, transfert à l'aéroport de Marrakech pour le vol retour.",
  },
  culture: [],
};

const DAY_FRZ_MGOUN = {
  route_id: "atlas-mgoun",
  id: "frz-d6b",
  image: "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=2000&q=85",
  accent: "#7C8B5C",
  title: { es: "Alto Atlas Central · Boutaghrar, Amskar y Gargantas del M'Goun", en: "Central High Atlas · Boutaghrar, Amskar & M'Goun Gorges", fr: "Haut Atlas Central · Boutaghrar, Amskar et Gorges du M'Goun" },
  body: {
    es: "Adentrándonos por pistas en lo más profundo del Alto Atlas Central, descubrimos paisajes espectaculares. Visitamos poblados bereberes como Boutaghrar y Amskar, donde parece haberse detenido el tiempo. Veremos montañas, cañones, valles y grutas donde aún habitan nómadas. Recorreremos las Gargantas del M'Goun para un paseo irrepetible. Comida en ruta en una «Gîte d'Étape». Alojamiento y cena en Hotel Xaluca Dadès.",
    en: "Heading deep into the Central High Atlas on dirt tracks, we discover spectacular landscapes. We visit Berber villages such as Boutaghrar and Amskar, where time seems to have stopped. Mountains, canyons, valleys and caves still inhabited by nomads. Walk through the M'Goun Gorges for an unrepeatable experience. Lunch on the route at a «Gîte d'Étape». Dinner and overnight at Hotel Xaluca Dadès.",
    fr: "Pistes au cœur du Haut Atlas Central. Visite des villages berbères de Boutaghrar et Amskar. Montagnes, canyons, vallées et grottes habitées par des nomades. Promenade dans les Gorges du M'Goun. Déjeuner en route dans une « Gîte d'Étape ». Dîner et nuit à l'Hôtel Xaluca Dadès.",
  },
  culture: [],
};

export const PROGRAM_FRZ_78 = {
  ...PROGRAM_FRZ_67,
  routeId: "tourFezRak78",
  duration_key: "7n8d",
  duration: { es: "7 noches / 8 días", en: "7 nights / 8 days", fr: "7 nuits / 8 jours" },
  hero_overline: { es: "Circuito Gran Sur · Fez → Marrakech", en: "Grand South circuit · Fez → Marrakech", fr: "Circuit Grand Sud · Fès → Marrakech" },
  prices: { low: 2090, mid: 2390, high: 2690, premium: 3090 },
  days: [
    DAY_FRZ_FEZ_ARRIVAL,
    DAY_FRZ_FEZ_IFRANE_ERFOUD,
    DAY_FRZ_DESERT,
    DAY_FRZ_SUNRISE,
    DAY_FRZ_TODRA_DADES,
    DAY_FRZ_TICHKA_MARRAKECH,
    DAY_FRZ_MARRAKECH_FREE,
    DAY_FRZ_MARRAKECH_TRANSFER,
  ],
};

export const PROGRAM_FRZ_89 = {
  ...PROGRAM_FRZ_67,
  routeId: "tourFezRak89",
  duration_key: "8n9d",
  duration: { es: "8 noches / 9 días", en: "8 nights / 9 days", fr: "8 nuits / 9 jours" },
  hero_overline: { es: "Circuito Gran Sur · Fez → Marrakech", en: "Grand South circuit · Fez → Marrakech", fr: "Circuit Grand Sud · Fès → Marrakech" },
  prices: { low: 2290, mid: 2590, high: 2890, premium: 3290 },
  days: [
    DAY_FRZ_FEZ_ARRIVAL,
    DAY_FRZ_FEZ_IFRANE_ERFOUD,
    DAY_FRZ_DESERT,
    DAY_FRZ_SUNRISE,
    DAY_FRZ_TODRA_DADES,
    DAY_FRZ_MGOUN,
    DAY_FRZ_TICHKA_MARRAKECH,
    DAY_FRZ_MARRAKECH_FREE,
    DAY_FRZ_MARRAKECH_TRANSFER,
  ],
};
  routeId: "tourFezRak67",
  duration_key: "6n7d",
  duration: { es: "6 noches / 7 días", en: "6 nights / 7 days", fr: "6 nuits / 7 jours" },
  hero_image: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=2400&q=85",
  hero_overline: T("Circuito Gran Sur · Fez → Marrakech", "Grand South circuit · Fez → Marrakech", "Circuit Grand Sud · Fès → Marrakech"),
  hero_title: T(
    "Circuito desde Fez hasta Marrakech descubriendo el Gran Sur de Marruecos.",
    "A circuit from Fez to Marrakech discovering the Grand South of Morocco.",
    "Circuit de Fès à Marrakech à la découverte du Grand Sud du Maroc.",
  ),
  description: {
    es: [
      "Gran Sur de Marruecos es un viaje auténtico para descubrir principalmente el sur del país. Esta ruta en 4x4 comienza en Fez, cuya medina, envidia del mundo árabe, es un precioso laberinto donde perderse y sumergirse en su historia y cultura.",
      "El recorrido nos llevará por lugares tan originales como Ifrane, conocida como «la pequeña Suiza», y sus impresionantes bosques de cedros gigantes.",
      "Seguiremos hasta Erfoud, la puerta del majestuoso Gran Desierto del Erg Chebbi, un espectáculo para los sentidos. Allí, las interminables dunas y ese halo mágico que envuelven estos parajes nos permitirán vivir una noche inolvidable bajo las estrellas.",
      "Dejaremos atrás el desierto para cruzar el Alto Atlas, descubriendo paisajes impresionantes. De la montaña a la ciudad, llegaremos a Marrakech: colores, artesanos, plazas maravillosas y aromas que quedarán para siempre en el recuerdo.",
    ],
    en: [
      "The Grand South of Morocco is an authentic journey to discover the south of the country. This 4x4 route begins in Fez, whose medina — the envy of the Arab world — is a beautiful labyrinth in which to lose oneself.",
      "We will pass through original places such as Ifrane, known as «little Switzerland», and its impressive giant cedar forests.",
      "We will reach Erfoud, gateway to the majestic Erg Chebbi desert — a spectacle for the senses. Endless dunes and a magical halo wrap these landscapes, letting us live an unforgettable night under the stars.",
      "Leaving the desert behind, we cross the High Atlas — stunning landscapes all the way. From mountains to city, we arrive in Marrakech: colour, artisans, wonderful squares and aromas that linger forever.",
    ],
    fr: [
      "Le Grand Sud du Maroc est un voyage authentique pour découvrir le sud du pays. Ce circuit en 4x4 commence à Fès, dont la médina — envie du monde arabe — est un magnifique labyrinthe.",
      "L'itinéraire passe par des lieux uniques comme Ifrane, surnommée « la petite Suisse », et ses impressionnantes forêts de cèdres géants.",
      "Nous rejoignons Erfoud, porte du majestueux désert de l'Erg Chebbi — un spectacle pour les sens. Dunes infinies et halo magique pour une nuit inoubliable sous les étoiles.",
      "Nous quittons le désert pour traverser le Haut Atlas — paysages impressionnants. De la montagne à la ville, nous arrivons à Marrakech : couleurs, artisans, places merveilleuses et parfums inoubliables.",
    ],
  },
  places: {
    es: "Fez · Ifrane · Erfoud · Erg Chebbi · Merdani · Rissani · Tinerhir · Boumalne Dades · Ouarzazate · Marrakech",
    en: "Fez · Ifrane · Erfoud · Erg Chebbi · Merdani · Rissani · Tinerhir · Boumalne Dades · Ouarzazate · Marrakech",
    fr: "Fès · Ifrane · Erfoud · Erg Chebbi · Merdani · Rissani · Tinerhir · Boumalne Dadès · Ouarzazate · Marrakech",
  },
  airport: { es: "Fez / Marrakech", en: "Fez / Marrakech", fr: "Fès / Marrakech" },
  prices: { low: 1890, mid: 2190, high: 2490, premium: 2890 },
  details: {
    includes: {
      es: [
        "Una noche en Fez en Riad en la Medina o Hotel 4★ en régimen de Media Pensión",
        "Dos noches en Erfoud en Kasbah Hotel Xaluca en régimen de Media Pensión",
        "Una noche en Erg Chebbi en Bivouac de Luxe en el Desierto en régimen de Media Pensión",
        "Una noche en Boumalne Dades en Hotel Xaluca Dades en régimen de Media Pensión",
        "Una noche en Marrakech en Riad en la Medina o Hotel 5★ en régimen de Alojamiento y Desayuno",
        "Comida a mediodía tipo picnic en el desierto",
        "Excursión en dromedario",
        "Vehículo 4x4 con chófer desde el día 2 hasta el día 6 del itinerario, ambos incluidos",
        "Visita con guía local en Fez · Visita con guía local en Marrakech",
        "Visitas a Aït Ben Haddou y Palacio de la Bahía",
        "Transfers desde y hacia aeropuertos · Combustible · Seguro de asistencia en viaje",
      ],
      en: [
        "One night in Fez in a Medina riad or 4★ hotel · half board",
        "Two nights in Erfoud at Kasbah Hotel Xaluca · half board",
        "One night in Erg Chebbi at the Bivouac de Luxe · half board",
        "One night in Boumalne Dades at Hotel Xaluca Dades · half board",
        "One night in Marrakech in a Medina riad or 5★ hotel · bed & breakfast",
        "Picnic lunch in the desert · Camel ride",
        "4x4 with driver from day 2 to day 6 inclusive",
        "Local guided tour in Fez · Local guided tour in Marrakech",
        "Visits to Aït Ben Haddou and Bahia Palace",
        "Airport transfers · Fuel · Travel assistance insurance",
      ],
      fr: [
        "Une nuit à Fès en riad de la médina ou hôtel 4★ · demi-pension",
        "Deux nuits à Erfoud à la Kasbah Hôtel Xaluca · demi-pension",
        "Une nuit à l'Erg Chebbi au Bivouac de Luxe · demi-pension",
        "Une nuit à Boumalne Dadès à l'Hôtel Xaluca Dadès · demi-pension",
        "Une nuit à Marrakech en riad de la médina ou hôtel 5★ · petit-déjeuner inclus",
        "Pique-nique le midi au désert · Balade à dromadaire",
        "4x4 avec chauffeur du jour 2 au jour 6 inclus",
        "Guide local à Fès et à Marrakech",
        "Visites d'Aït Ben Haddou et du Palais de la Bahia",
        "Transferts aéroports · Carburant · Assistance voyage",
      ],
    },
    excludes: {
      es: [
        "Las bebidas",
        "Las comidas a mediodía y cenas no detalladas en el apartado «Incluye»",
        "Otros extras personales como excursiones en quads, masajes, tratamientos de spa…",
        "El vuelo (salvo que se indique lo contrario)",
        "Suplemento para añadir seguro de cancelación · 45 € por persona para viajes de hasta 9 días",
      ],
      en: [
        "Drinks",
        "Lunches and dinners not listed in «Includes»",
        "Personal extras such as quad rides, massages or spa treatments",
        "Flights (unless otherwise stated)",
        "Optional cancellation insurance · €45 per person for trips up to 9 days",
      ],
      fr: [
        "Boissons",
        "Déjeuners et dîners non listés dans « Inclus »",
        "Extras personnels (quads, massages, soins…)",
        "Le vol (sauf mention contraire)",
        "Assurance annulation en option · 45 € par personne pour les voyages jusqu'à 9 jours",
      ],
    },
    notes: {
      es: [
        "Opciones de vuelos: Royal Air Maroc (vía Casablanca) o low-cost como Vueling, Air Arabia, Ryanair.",
        "Las tarifas se calculan según la ocupación del 4x4. El coste se divide entre los ocupantes.",
        "Tarifas basadas en habitaciones dobles/triples. Suplemento individual: 375 €.",
        "Descuento niños (3-11 años) compartiendo con dos adultos: 300 € baja · 315 € alta.",
        "Si los riads previstos están completos, se proponen alternativas equivalentes.",
        "En temporada alta, los guías de medina pueden compartirse con otros viajeros.",
        "Chóferes hispanohablantes son limitados — reservar con antelación.",
        "Es obligatorio pasaporte vigente con un mínimo de 3 meses desde la fecha de regreso.",
        "Quads opcionales: 70 € por vehículo (circuito de 1 hora). Spa y masajes en recepción.",
        "El mercado de Rissani se celebra los martes, jueves y domingos.",
      ],
      en: [
        "Flight options: Royal Air Maroc (via Casablanca) or low-cost (Vueling, Air Arabia, Ryanair).",
        "Rates depend on 4x4 occupancy. Cost is split between passengers.",
        "Rates based on double/triple rooms. Single room supplement: €375.",
        "Children discount (3-11) sharing with two adults: €300 low · €315 high season.",
        "Equivalent alternative riads will be offered if those budgeted are full.",
        "High-season medina guides may be shared with other travellers.",
        "Spanish-speaking drivers are limited — book early.",
        "Valid passport required with at least 3 months remaining from return date.",
        "Optional quads: €70 per vehicle (1-hour ride). Spa & massages at hotel reception.",
        "Rissani market runs Tuesday, Thursday and Sunday.",
      ],
      fr: [
        "Options de vol : Royal Air Maroc (via Casablanca) ou low-cost (Vueling, Air Arabia, Ryanair).",
        "Tarifs selon l'occupation du 4x4. Le coût est partagé entre les occupants.",
        "Tarifs base chambre double/triple. Supplément single : 375 €.",
        "Réduction enfants (3-11 ans) partageant avec 2 adultes : 300 € basse · 315 € haute.",
        "Riads équivalents proposés si complets.",
        "En haute saison, guides de médina partagés possibles.",
        "Chauffeurs hispanophones limités — réserver tôt.",
        "Passeport valable au minimum 3 mois après le retour.",
        "Quads en option : 70 € par véhicule (1h). Spa & massages à la réception.",
        "Marché de Rissani les mardi, jeudi, dimanche.",
      ],
    },
    terms: {
      es: [
        "Reserva: 30% del importe total en el momento de la confirmación.",
        "Pago final: 70% restante hasta 30 días antes de la salida.",
        "Si el vuelo elegido requiere emisión inmediata: 100% del billete + 30% de los servicios de tierra al reservar.",
        "Cancelación 45 días antes: 30% del importe total.",
        "Cancelación 21 días antes: 100% del importe total.",
        "Penalización fija de 50 € por reserva en concepto de gastos de gestión.",
        "Estas condiciones aplican sólo a los servicios de tierra. Los vuelos se rigen por las condiciones de cada compañía aérea. Los seguros no se reembolsan.",
      ],
      en: [
        "Booking: 30% at confirmation.",
        "Final payment: 70% balance up to 30 days before departure.",
        "If the chosen flight needs immediate ticketing: 100% of the flight + 30% of land services at booking.",
        "Cancellation 45 days before departure: 30% of total.",
        "Cancellation 21 days before departure: 100% of total.",
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
  days: [
    DAY_FRZ_FEZ_ARRIVAL,
    DAY_FRZ_FEZ_IFRANE_ERFOUD,
    DAY_FRZ_DESERT,
    DAY_FRZ_SUNRISE,
    DAY_FRZ_TODRA_DADES,
    DAY_FRZ_TICHKA_MARRAKECH,
    DAY_FRZ_MARRAKECH_RETURN,
  ],
};
