// Lightweight intro pages for each /viajes/escapadas/* destination.
// Editorial: hero image · eyebrow · cinematic title · regional description ·
// quick info card · contact CTA. Designed to be enriched with day-by-day
// itineraries later, without breaking the URL contract.

const T = (es, en, fr) => ({ es, en, fr });

export const ESCAPADA_DESIERTO_34 = {
  routeId: "tourEscapadaDesierto34",
  hero: {
    image: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=2400&q=85",
    eyebrow: T("Escapadas por Marruecos", "Morocco short escapes", "Escapades au Maroc"),
    title: T(
      "Escápate al desierto de Marruecos.",
      "Escape to the Moroccan desert.",
      "Évadez-vous dans le désert marocain.",
    ),
    place: T("Erfoud · Erg Chebbi · Alto Atlas", "Erfoud · Erg Chebbi · High Atlas", "Erfoud · Erg Chebbi · Haut Atlas"),
    duration: T("3 noches · 4 días", "3 nights · 4 days", "3 nuits · 4 jours"),
    airports: T("Llegada Fez · Salida Marrakech (sugerido)", "In Fez · Out Marrakech (suggested)", "Arrivée Fès · Sortie Marrakech (suggéré)"),
  },
  intro: {
    es: [
      "En el desierto marroquí, el tiempo parece haberse detenido. Las interminables dunas de arena y las antiguas kasbahs parecen estar a un mundo de distancia del ritmo acelerado de las ciudades. Desde hace siglos, viajeros de todo el mundo llegan hasta este rincón del Sáhara buscando tranquilidad, desconexión y aventura.",
      "Ya sea para vivir una experiencia única bajo las estrellas o simplemente disfrutar de la inmensidad del paisaje, el desierto de Marruecos ofrece una combinación incomparable de cultura, tradición y naturaleza.",
      "¿Quieres desconectar unos días y vivir una experiencia mágica? Te proponemos una escapada al Erg Chebbi, el desierto de dunas más cercano a Europa, situado en el sur de Marruecos.",
      "La ruta comienza en Erfoud, conocida como «la puerta del desierto», donde nos adentraremos en el Sáhara en vehículos 4x4 con chófer. Las tradiciones ancestrales de sus habitantes, sus mercados, sus colores y una noche bajo las estrellas convertirán esta experiencia en algo inolvidable.",
      "Más adelante continuaremos hacia la cordillera del Alto Atlas, atravesando valles, gargantas y pequeños poblados Imazighen donde el tiempo parece haberse detenido.",
    ],
    en: [
      "In the Moroccan desert, time seems to have stopped. The endless dunes and the ancient kasbahs feel a world away from the fast pace of the cities. For centuries, travellers from all over the world have come to this corner of the Sahara seeking quiet, disconnection and adventure.",
      "Whether for a unique night under the stars or simply to enjoy the immensity of the landscape, the Moroccan desert offers an unmatched blend of culture, tradition and nature.",
      "Want to disconnect for a few days and live a magical experience? We propose an escape to the Erg Chebbi, the closest dune desert to Europe, in southern Morocco.",
      "The route begins in Erfoud, known as «the gate of the desert», where we head into the Sahara in 4x4 with private driver. Ancestral traditions, local markets, desert colours and a night under the stars turn this experience into something unforgettable.",
      "We then continue across the High Atlas range, crossing valleys, gorges and small Imazighen villages where time seems to have stopped.",
    ],
    fr: [
      "Dans le désert marocain, le temps semble s'être arrêté. Les dunes infinies et les anciennes kasbahs paraissent à mille lieues du rythme effréné des villes. Depuis des siècles, les voyageurs du monde entier viennent dans ce coin du Sahara chercher calme, déconnexion et aventure.",
      "Que ce soit pour une nuit unique sous les étoiles ou simplement pour profiter de l'immensité du paysage, le désert marocain offre un mélange inégalé de culture, de tradition et de nature.",
      "Envie de déconnecter quelques jours et vivre une expérience magique ? Nous vous proposons une escapade à l'Erg Chebbi, le désert de dunes le plus proche de l'Europe, dans le sud du Maroc.",
      "L'itinéraire commence à Erfoud, « porte du désert », où nous pénétrons dans le Sahara en 4x4 avec chauffeur. Les traditions ancestrales, les marchés locaux, les couleurs du désert et une nuit sous les étoiles rendent l'expérience inoubliable.",
      "Nous poursuivons ensuite par la cordillère du Haut Atlas, à travers vallées, gorges et petits villages imazighen où le temps semble s'être figé.",
    ],
  },
};

export const ESCAPADA_ATLAS_34 = {
  routeId: "tourEscapadaAtlas34",
  hero: {
    image: "https://images.unsplash.com/photo-1604940500627-d3f44d1d21c6?auto=format&fit=crop&w=2400&q=85",
    eyebrow: T("Escapadas por Marruecos", "Morocco short escapes", "Escapades au Maroc"),
    title: T(
      "Escápate al Alto Atlas marroquí.",
      "Escape to the Moroccan High Atlas.",
      "Évadez-vous dans le Haut Atlas marocain.",
    ),
    place: T("Boumalne Dades · Aldeas Imazighen · Valle del Drâa · Ouarzazate", "Boumalne Dades · Imazighen villages · Drâa valley · Ouarzazate", "Boumalne Dadès · Villages imazighen · Vallée du Drâa · Ouarzazate"),
    duration: T("3 noches · 4 días", "3 nights · 4 days", "3 nuits · 4 jours"),
    airports: T("Llegada/Salida Ouarzazate o Marrakech", "In/Out Ouarzazate or Marrakech", "Arrivée/Sortie Ouarzazate ou Marrakech"),
  },
  intro: {
    es: [
      "El Alto Atlas es una de las regiones más fascinantes y variadas de Marruecos. Esta gran cordillera atraviesa el país ofreciendo paisajes espectaculares, valles escondidos y numerosos pueblos bereberes llenos de autenticidad.",
      "Desde las tradicionales construcciones de adobe de Aït Ben Haddou hasta la histórica ciudad de Ouarzazate, esta región es perfecta para quienes buscan naturaleza, cultura y aventura.",
      "¿Quieres desconectar unos días y descubrir la cultura Amazigh?",
      "Te proponemos una escapada a la cordillera del Alto Atlas, en el sur de Marruecos. Nuestra ruta comienza en Boumalne Dades, desde donde recorreremos en 4x4 diferentes poblados Imazighen donde la vida sigue manteniendo sus tradiciones ancestrales.",
      "Atravesaremos valles y gargantas, visitaremos familias nómadas que habitan en cuevas en las montañas y continuaremos hacia el Anti-Atlas recorriendo el Valle del Draa antes de regresar a Ouarzazate.",
      "Una escapada auténtica que no te dejará indiferente.",
    ],
    en: [
      "The High Atlas is one of the most fascinating and varied regions in Morocco. This great range crosses the country offering spectacular landscapes, hidden valleys and authentic Berber villages.",
      "From the adobe architecture of Aït Ben Haddou to the historic city of Ouarzazate, this region is perfect for those seeking nature, culture and adventure.",
      "Want to disconnect for a few days and discover the Amazigh culture?",
      "We propose an escape to the High Atlas, in southern Morocco. Our route begins in Boumalne Dades, from where we explore by 4x4 different Imazighen villages where life still keeps its ancestral traditions.",
      "We cross valleys and gorges, visit nomadic families living in mountain caves, and continue into the Anti-Atlas down the Drâa Valley before returning to Ouarzazate.",
      "An authentic escape that will leave no traveller indifferent.",
    ],
    fr: [
      "Le Haut Atlas est l'une des régions les plus fascinantes et variées du Maroc. Cette grande cordillère traverse le pays, offrant des paysages spectaculaires, des vallées cachées et de nombreux villages berbères pleins d'authenticité.",
      "Des constructions traditionnelles en pisé d'Aït Ben Haddou à la cité historique de Ouarzazate, cette région est parfaite pour ceux qui cherchent nature, culture et aventure.",
      "Envie de déconnecter quelques jours et de découvrir la culture amazighe ?",
      "Nous vous proposons une escapade dans le Haut Atlas, dans le sud du Maroc. Notre itinéraire commence à Boumalne Dadès, d'où nous parcourons en 4x4 différents villages imazighen où la vie conserve ses traditions ancestrales.",
      "Nous traversons vallées et gorges, visitons des familles nomades qui habitent les grottes de montagne, puis poursuivons vers l'Anti-Atlas par la vallée du Drâa avant de revenir à Ouarzazate.",
      "Une escapade authentique qui ne laisse pas indifférent.",
    ],
  },
};

export const ESCAPADA_FEZ = {
  routeId: "tourEscapadaFez",
  hero: {
    image: "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=2400&q=85",
    eyebrow: T("Escapadas por Marruecos", "Morocco short escapes", "Escapades au Maroc"),
    title: T(
      "Escápate a la ciudad de Fez.",
      "Escape to the city of Fez.",
      "Évadez-vous à Fès.",
    ),
    place: T("Fez · Meknés · Volubilis (opcional)", "Fez · Meknes · Volubilis (optional)", "Fès · Meknès · Volubilis (option)"),
    duration: T("Personalizado · 2-4 noches", "Tailor-made · 2-4 nights", "Sur mesure · 2-4 nuits"),
    airports: T("Llegada/Salida Fez", "In/Out Fez", "Arrivée/Sortie Fès"),
  },
  intro: {
    es: [
      "Fez es una de las ciudades con más historia y riqueza cultural de Marruecos. Su Medina, declarada Patrimonio de la Humanidad por la UNESCO, está considerada una de las ciudades medievales mejor conservadas del mundo.",
      "Fundada en el siglo IX por la dinastía Idrisí, Fez se convirtió rápidamente en uno de los principales centros culturales, religiosos y comerciales del norte de África.",
      "Hoy en día, la ciudad sigue destacando por sus mezquitas, madrasas, zocos tradicionales y por albergar la curtiduría más grande del mundo, donde todavía se utilizan métodos artesanales para trabajar el cuero.",
      "Fez es, sin duda, la más auténtica de las Ciudades Imperiales y está considerada la capital cultural y espiritual del país.",
      "Además de descubrir su impresionante Medina, esta escapada también permite conocer Meknés, una ciudad imperial más tranquila pero igualmente fascinante, reconocida también como Patrimonio Mundial por la UNESCO.",
    ],
    en: [
      "Fez is one of the most historic and culturally rich cities in Morocco. Its UNESCO-listed Medina is considered one of the best-preserved medieval cities in the world.",
      "Founded in the 9th century by the Idrisid dynasty, Fez quickly became one of the main cultural, religious and commercial centres of North Africa.",
      "Today, the city is still famous for its mosques, madrasas, traditional souks and for hosting the largest tannery in the world, where leather is still tanned using artisan methods.",
      "Fez is, without doubt, the most authentic of the Imperial Cities and is considered the cultural and spiritual capital of the country.",
      "Beyond its impressive medina, this escape also allows you to visit Meknes — a quieter imperial city, equally fascinating, and also UNESCO World Heritage.",
    ],
    fr: [
      "Fès est l'une des villes les plus historiques et culturellement riches du Maroc. Sa médina, classée UNESCO, est considérée comme l'une des cités médiévales les mieux conservées au monde.",
      "Fondée au IXe siècle par la dynastie idrisside, Fès est rapidement devenue l'un des principaux centres culturels, religieux et commerciaux d'Afrique du Nord.",
      "Aujourd'hui, la ville continue de se distinguer par ses mosquées, médersas, souks traditionnels et abrite la plus grande tannerie du monde, où le cuir est encore travaillé selon des méthodes artisanales.",
      "Fès est sans doute la plus authentique des villes impériales et la capitale culturelle et spirituelle du pays.",
      "Au-delà de sa médina impressionnante, cette escapade permet aussi de découvrir Meknès — cité impériale plus tranquille mais tout aussi fascinante, également classée UNESCO.",
    ],
  },
};

export const ESCAPADA_MARRAKECH = {
  routeId: "tourEscapadaMarrakech",
  hero: {
    image: "https://images.unsplash.com/photo-1551918120-9739cb430c6d?auto=format&fit=crop&w=2400&q=85",
    eyebrow: T("Escapadas por Marruecos", "Morocco short escapes", "Escapades au Maroc"),
    title: T(
      "Escápate a la ciudad de Marrakech.",
      "Escape to the city of Marrakech.",
      "Évadez-vous à Marrakech.",
    ),
    place: T("Marrakech · Agafay · pies del Atlas", "Marrakech · Agafay · foothills of the Atlas", "Marrakech · Agafay · pieds de l'Atlas"),
    duration: T("Personalizado · 2-4 noches", "Tailor-made · 2-4 nights", "Sur mesure · 2-4 nuits"),
    airports: T("Llegada/Salida Marrakech", "In/Out Marrakech", "Arrivée/Sortie Marrakech"),
  },
  intro: {
    es: [
      "Si buscas una ciudad llena de vida, cultura y contrastes, Marrakech debería estar entre tus próximos destinos. Sus mercados laberínticos, palacios, jardines y su ambiente único convierten a la llamada «Ciudad Roja» en uno de los lugares más fascinantes de Marruecos.",
      "Te proponemos una escapada que combina Marrakech con Agafay, la zona desértica más cercana a la ciudad.",
      "Por un lado, descubrirás Marrakech y su famosa Plaza Jemaa el-Fna, sus zocos tradicionales, palacios históricos, jardines y talleres de artesanía.",
      "Por otro lado, vivirás la experiencia de Agafay, conocido como el «Desierto Marrakchi», situado a los pies del Atlas. Aunque no cuenta con grandes dunas de arena, ofrece un entorno árido y espectacular ideal para disfrutar de una noche bajo las estrellas y desconectar del bullicio de la ciudad.",
    ],
    en: [
      "If you are after a city full of life, culture and contrasts, Marrakech should be on your radar. Its labyrinthine markets, palaces, gardens and unique atmosphere make the «Red City» one of the most fascinating places in Morocco.",
      "We propose an escape that combines Marrakech with Agafay, the desert area closest to the city.",
      "On one hand, you will discover Marrakech and its famous Jemaa el-Fna square, traditional souks, historic palaces, gardens and craft workshops.",
      "On the other, you will live the Agafay experience — the «Marrakech desert» at the foothills of the Atlas. Although it does not feature large sand dunes, it offers an arid and spectacular setting ideal for a night under the stars away from the city buzz.",
    ],
    fr: [
      "Si vous cherchez une ville pleine de vie, de culture et de contrastes, Marrakech doit figurer dans votre liste. Ses marchés labyrinthiques, palais, jardins et son ambiance unique font de la « Ville Rouge » l'un des lieux les plus fascinants du Maroc.",
      "Nous vous proposons une escapade combinant Marrakech avec Agafay, la zone désertique la plus proche de la ville.",
      "D'un côté, vous découvrirez Marrakech et sa fameuse place Jemaa el-Fna, ses souks traditionnels, palais historiques, jardins et ateliers d'artisanat.",
      "De l'autre, vous vivrez l'expérience d'Agafay — le « désert marrakchi » aux pieds de l'Atlas. Sans grandes dunes de sable, il offre un cadre aride et spectaculaire pour une nuit sous les étoiles loin de l'effervescence de la ville.",
    ],
  },
};

export const ESCAPADA_TANGER = {
  routeId: "tourEscapadaTanger",
  hero: {
    image: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=2400&q=85",
    eyebrow: T("Escapadas por Marruecos", "Morocco short escapes", "Escapades au Maroc"),
    title: T(
      "Escápate a la ciudad de Tánger.",
      "Escape to the city of Tangier.",
      "Évadez-vous à Tanger.",
    ),
    place: T("Tánger · Asilah · Tetuán · Chefchaouen", "Tangier · Asilah · Tetouan · Chefchaouen", "Tanger · Asilah · Tétouan · Chefchaouen"),
    duration: T("Personalizado · 2-4 noches", "Tailor-made · 2-4 nights", "Sur mesure · 2-4 nuits"),
    airports: T("Llegada/Salida Tánger", "In/Out Tangier", "Arrivée/Sortie Tanger"),
  },
  intro: {
    es: [
      "Tánger es una ciudad histórica situada en el norte de Marruecos, donde se unen el Atlántico y el Mediterráneo. Su mezcla cultural, su ambiente artístico y su cercanía con Europa la convierten en uno de los destinos más especiales del país.",
      "La ciudad destaca por sus playas, mercados, cafeterías históricas y su rica herencia cultural reflejada en su arquitectura y estilo de vida.",
      "Para quienes desean realizar una primera toma de contacto con Marruecos, proponemos esta escapada por el norte del país visitando algunos de sus pueblos y ciudades más emblemáticos.",
      "La ruta incluye lugares como Asilah, en la costa atlántica; Tetuán, junto al Mediterráneo; y el famoso pueblo azul de Chefchaouen, uno de los destinos más fotografiados de Marruecos.",
    ],
    en: [
      "Tangier is a historic city in northern Morocco, where the Atlantic meets the Mediterranean. Its cultural mix, artistic flair and proximity to Europe make it one of the most special destinations in the country.",
      "The city stands out for its beaches, markets, historic cafés and a rich cultural heritage reflected in its architecture and lifestyle.",
      "For those wanting a first encounter with Morocco, we propose this escape through the north, visiting some of its most emblematic towns and cities.",
      "The route includes places such as Asilah on the Atlantic coast; Tetouan by the Mediterranean; and the famous blue town of Chefchaouen, one of Morocco's most photographed destinations.",
    ],
    fr: [
      "Tanger est une ville historique du nord du Maroc, où l'Atlantique rencontre la Méditerranée. Son mélange culturel, son ambiance artistique et sa proximité avec l'Europe en font l'une des destinations les plus spéciales du pays.",
      "La ville se distingue par ses plages, marchés, cafés historiques et un riche héritage culturel reflété dans son architecture et son style de vie.",
      "Pour ceux qui souhaitent une première rencontre avec le Maroc, nous proposons cette escapade dans le nord, visitant quelques-uns de ses villages et villes les plus emblématiques.",
      "L'itinéraire inclut des lieux comme Asilah sur la côte atlantique, Tétouan en bord de Méditerranée et le célèbre village bleu de Chefchaouen, l'une des destinations les plus photographiées du Maroc.",
    ],
  },
};
