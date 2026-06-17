/* ============================================================
   tripPackingNotes.js
   ----
   "Travel notes" written like sticky-notes / post-its left by someone
   who already did the route — practical packing tips to prepare before
   departure. Trilingual (es/en/fr).

   Instead of one entry per trip, notes are grouped into PROFILES by the
   kind of journey (climate + regions): south desert, full crossing,
   north/cities, coast, adventure and the short escapes. A classifier
   maps every programme `routeId` to its profile, so the content is
   adapted to each itinerary while staying easy to maintain.

   To override a specific trip with bespoke notes, add an entry to
   ROUTE_OVERRIDES keyed by routeId.
============================================================ */

const T = (es, en, fr) => ({ es, en, fr });

const ACCENT = {
  clothing:    { accent: "#C16542", tint: "#FBF1DD" },
  accessories: { accent: "#A07042", tint: "#F3EEE0" },
  desert:      { accent: "#5A7F9C", tint: "#ECEFF1" },
  city:        { accent: "#7C8B5C", tint: "#EDF0E5" },
  coast:       { accent: "#5A7F9C", tint: "#E8EFF2" },
  adventure:   { accent: "#8A5A3C", tint: "#F1E7DD" },
  comfort:     { accent: "#A07042", tint: "#F3EEE0" },
};

const note = (theme, tagline, title, items) => ({ theme, ...ACCENT[theme], tagline, title, items });

const SIGN_FALLBACK = T("— Tu equipo Xaluca", "— Your Xaluca team", "— Votre équipe Xaluca");

/* ------------------------------------------------------------
   PROFILES
------------------------------------------------------------ */

// Atlas mountains (cold mornings/nights) + Sahara desert (hot days).
const SOUTH_DESERT = [
  note(
    "clothing",
    T("Por capas", "Layer up", "En couches"),
    T("Ropa para el Atlas y el desierto", "Clothing for the Atlas & the desert", "Vêtements pour l'Atlas et le désert"),
    [
      T("Viste por capas: una mañana fresca en el Alto Atlas puede ser una tarde calurosa en las dunas.",
        "Dress in layers: a cool High Atlas morning can turn into a hot afternoon on the dunes.",
        "Habillez-vous en couches : une matinée fraîche dans le Haut Atlas peut devenir un après-midi chaud sur les dunes."),
      T("Un forro polar o jersey para las noches: tanto en el Atlas como en el desierto refresca al caer el sol.",
        "A fleece or jumper for the nights: both the Atlas and the desert cool down after sunset.",
        "Une polaire ou un pull pour les nuits : l'Atlas comme le désert se rafraîchissent au coucher du soleil."),
      T("Calzado cerrado y ya usado para caminar por kasbahs, gargantas y arena.",
        "Closed, broken-in shoes for walking through kasbahs, gorges and sand.",
        "Des chaussures fermées et déjà rodées pour marcher dans les kasbahs, les gorges et le sable."),
      T("Un pañuelo grande (cheche): protege del sol, del viento y de la arena fina.",
        "A large scarf (cheche): it shields you from sun, wind and fine sand.",
        "Un grand foulard (cheche) : il protège du soleil, du vent et du sable fin."),
    ],
  ),
  note(
    "accessories",
    T("No los olvides", "Don't forget", "À ne pas oublier"),
    T("Accesorios imprescindibles", "Must-have accessories", "Accessoires indispensables"),
    [
      T("Gafas de sol y protección solar SPF 50: el sol del Sáhara aprieta de verdad.",
        "Sunglasses and SPF 50 sunscreen: the Sahara sun is no joke.",
        "Lunettes de soleil et crème SPF 50 : le soleil du Sahara tape fort."),
      T("Gorra o sombrero de ala ancha para las horas centrales del día.",
        "A cap or wide-brimmed hat for the midday hours.",
        "Une casquette ou un chapeau à large bord pour les heures les plus chaudes."),
      T("Crema labial e hidratante: el ambiente es muy seco y la piel lo nota.",
        "Lip balm and moisturiser: the air is very dry and your skin will feel it.",
        "Baume à lèvres et crème hydratante : l'air est très sec et la peau le ressent."),
      T("Botella reutilizable y gel de manos para los trayectos en 4x4.",
        "A reusable bottle and hand gel for the 4x4 legs.",
        "Une gourde réutilisable et du gel hydroalcoolique pour les trajets en 4x4."),
    ],
  ),
  note(
    "desert",
    T("Bajo las estrellas", "Under the stars", "Sous les étoiles"),
    T("Noches en el desierto y rutas", "Desert nights & travel days", "Nuits au désert et trajets"),
    [
      T("Linterna frontal y batería externa: en el bivouac no siempre hay enchufes.",
        "A head torch and a power bank: the bivouac doesn't always have plugs.",
        "Une lampe frontale et une batterie externe : le bivouac n'a pas toujours de prises."),
      T("Una bolsa pequeña para la noche en el campamento; la maleta grande se queda en el 4x4.",
        "A small bag for the night at camp; your big suitcase stays in the 4x4.",
        "Un petit sac pour la nuit au campement ; la grande valise reste dans le 4x4."),
      T("Algo de abrigo para dormir: el desierto sorprende con su frescor nocturno.",
        "Something warm for sleeping: the desert surprises with its cool nights.",
        "De quoi vous couvrir pour dormir : le désert surprend par ses nuits fraîches."),
      T("Algo de efectivo en dírhams para propinas, té y pequeñas compras por el camino.",
        "Some cash in dirhams for tips, mint tea and small purchases along the way.",
        "Un peu d'espèces en dirhams pour les pourboires, le thé et les petits achats en route."),
    ],
  ),
];

// Imperial cities + Atlas + Sahara in one long crossing.
const FULL_CROSSING = [
  note(
    "clothing",
    T("Versátil", "Versatile", "Polyvalent"),
    T("Ropa para ciudad, montaña y desierto", "Clothes for city, mountain & desert", "Vêtements pour ville, montagne et désert"),
    [
      T("Capas versátiles: combinarás medinas, Alto Atlas y dunas en un mismo viaje.",
        "Versatile layers: you'll mix medinas, the High Atlas and dunes in a single trip.",
        "Des couches polyvalentes : vous combinerez médinas, Haut Atlas et dunes dans un même voyage."),
      T("Ropa cómoda y modesta para entrar en mezquitas y medersas (hombros y rodillas cubiertos).",
        "Comfortable, modest clothing for mosques and medersas (shoulders and knees covered).",
        "Des vêtements confortables et couvrants pour les mosquées et médersas (épaules et genoux couverts)."),
      T("Forro polar o jersey para las noches frescas del Atlas y el desierto.",
        "A fleece or jumper for the cool Atlas and desert nights.",
        "Une polaire ou un pull pour les nuits fraîches de l'Atlas et du désert."),
      T("Calzado cerrado y cómodo, ya usado: caminarás mucho por medinas y kasbahs.",
        "Comfortable, broken-in closed shoes: you'll walk a lot through medinas and kasbahs.",
        "Des chaussures fermées et confortables, déjà rodées : vous marcherez beaucoup."),
    ],
  ),
  note(
    "accessories",
    T("Para los días largos", "For the long days", "Pour les longues journées"),
    T("Accesorios del viajero", "The traveller's accessories", "Les accessoires du voyageur"),
    [
      T("Gafas de sol, protección SPF 50 y gorra: del sol urbano al del Sáhara.",
        "Sunglasses, SPF 50 and a cap: from city sun to Sahara sun.",
        "Lunettes, SPF 50 et casquette : du soleil urbain à celui du Sahara."),
      T("Pañuelo grande (cheche) para sol, viento y arena en el sur.",
        "A large scarf (cheche) for sun, wind and sand in the south.",
        "Un grand foulard (cheche) pour le soleil, le vent et le sable au sud."),
      T("Crema labial e hidratante: el sur es muy seco.",
        "Lip balm and moisturiser: the south is very dry.",
        "Baume à lèvres et crème hydratante : le sud est très sec."),
      T("Botella reutilizable y auriculares o un libro para los trayectos.",
        "A reusable bottle and headphones or a book for the drives.",
        "Une gourde réutilisable et des écouteurs ou un livre pour les trajets."),
    ],
  ),
  note(
    "desert",
    T("Noches y logística", "Nights & logistics", "Nuits et logistique"),
    T("La noche en el desierto y los trayectos", "The desert night & the transfers", "La nuit au désert et les transferts"),
    [
      T("Bolsa pequeña para la noche en el bivouac; la maleta grande viaja en el vehículo.",
        "A small bag for the night at the bivouac; your big suitcase rides in the vehicle.",
        "Un petit sac pour la nuit au bivouac ; la grande valise voyage dans le véhicule."),
      T("Linterna frontal y batería externa para el campamento.",
        "A head torch and a power bank for the camp.",
        "Une lampe frontale et une batterie externe pour le campement."),
      T("Algo de abrigo para dormir bajo las estrellas.",
        "Something warm to sleep under the stars.",
        "De quoi vous couvrir pour dormir sous les étoiles."),
      T("Efectivo en dírhams para propinas, té y compras en los zocos.",
        "Cash in dirhams for tips, tea and purchases in the souks.",
        "Des espèces en dirhams pour les pourboires, le thé et les achats dans les souks."),
    ],
  ),
];

// Imperial cities, medinas, Rif, Chefchaouen — mostly urban / cultural.
const NORTH = [
  note(
    "clothing",
    T("Para las medinas", "For the medinas", "Pour les médinas"),
    T("Ropa para ciudades y medinas", "Clothes for cities & medinas", "Vêtements pour villes et médinas"),
    [
      T("Ropa cómoda y modesta para mezquitas, medersas y mausoleos (hombros y rodillas cubiertos).",
        "Comfortable, modest clothing for mosques, medersas and mausoleums (shoulders and knees covered).",
        "Des vêtements confortables et couvrants pour mosquées, médersas et mausolées (épaules et genoux couverts)."),
      T("Capas ligeras: las medinas se recorren a pie y el clima cambia entre la mañana y la tarde.",
        "Light layers: medinas are explored on foot and the weather shifts between morning and afternoon.",
        "Des couches légères : les médinas se parcourent à pied et le temps change entre le matin et l'après-midi."),
      T("Una chaqueta ligera o impermeable fino: Chefchaouen y el Rif pueden traer lluvia.",
        "A light jacket or thin raincoat: Chefchaouen and the Rif can bring rain.",
        "Une veste légère ou un imperméable fin : Chefchaouen et le Rif peuvent apporter de la pluie."),
      T("Calzado cómodo y cerrado, ya usado: caminarás mucho por calles empedradas.",
        "Comfortable, broken-in closed shoes: you'll walk a lot on cobbled streets.",
        "Des chaussures fermées et confortables, déjà rodées : vous marcherez beaucoup sur les pavés."),
    ],
  ),
  note(
    "accessories",
    T("Para callejear", "For wandering", "Pour flâner"),
    T("Para perderte por las callejuelas", "For getting lost in the alleys", "Pour vous perdre dans les ruelles"),
    [
      T("Gafas de sol, protección solar y gorra para las horas de más luz.",
        "Sunglasses, sunscreen and a cap for the brightest hours.",
        "Lunettes, crème solaire et casquette pour les heures les plus lumineuses."),
      T("Bolsa cruzada o mochila pequeña con cierre, cómoda y segura en los zocos.",
        "A crossbody bag or small backpack with a zip, comfy and secure in the souks.",
        "Un sac bandoulière ou un petit sac à dos zippé, pratique et sûr dans les souks."),
      T("Cámara o móvil con espacio de sobra: Fez y Chefchaouen son pura fotografía.",
        "A camera or phone with plenty of space: Fez and Chefchaouen are pure photography.",
        "Un appareil photo ou un téléphone avec de la place : Fès et Chefchaouen sont photogéniques."),
      T("Crema hidratante y botella reutilizable.",
        "Moisturiser and a reusable bottle.",
        "Crème hydratante et gourde réutilisable."),
    ],
  ),
  note(
    "city",
    T("Detalles", "Little details", "Les détails"),
    T("Detalles que marcan la diferencia", "Details that make a difference", "Des détails qui font la différence"),
    [
      T("Efectivo en dírhams para zocos, propinas y pequeñas compras.",
        "Cash in dirhams for souks, tips and small purchases.",
        "Des espèces en dirhams pour les souks, les pourboires et les petits achats."),
      T("Un pañuelo ligero: útil para el sol y para cubrirse en lugares sagrados.",
        "A light scarf: handy for the sun and to cover up in sacred places.",
        "Un foulard léger : utile pour le soleil et pour se couvrir dans les lieux sacrés."),
      T("Calcetines cómodos: algunas visitas se hacen descalzo.",
        "Comfortable socks: some visits are done barefoot.",
        "Des chaussettes confortables : certaines visites se font pieds nus."),
      T("Paciencia y ganas de regatear: forma parte de la experiencia de los zocos.",
        "Patience and a taste for bargaining: it's part of the souk experience.",
        "De la patience et l'envie de marchander : cela fait partie de l'expérience des souks."),
    ],
  ),
];

// Tangier / Atlantic coast / Essaouira — sea breeze, ports, medinas.
const COAST = [
  note(
    "clothing",
    T("Frente al mar", "By the sea", "Face à la mer"),
    T("Ropa para la costa y el viento", "Clothes for the coast & the wind", "Vêtements pour la côte et le vent"),
    [
      T("Capas y un cortavientos: la brisa atlántica refresca, sobre todo al atardecer.",
        "Layers and a windbreaker: the Atlantic breeze cools down, especially at sunset.",
        "Des couches et un coupe-vent : la brise atlantique rafraîchit, surtout au coucher du soleil."),
      T("Ropa cómoda para pasear por medinas, puertos y murallas.",
        "Comfortable clothing to stroll through medinas, ports and ramparts.",
        "Des vêtements confortables pour flâner dans les médinas, les ports et les remparts."),
      T("Calzado cómodo y cerrado para el casco antiguo y los paseos junto al mar.",
        "Comfortable, closed shoes for the old town and seaside walks.",
        "Des chaussures fermées et confortables pour la vieille ville et les balades en bord de mer."),
      T("Algo de abrigo ligero para las noches.",
        "Something light and warm for the evenings.",
        "Un vêtement chaud et léger pour les soirées."),
    ],
  ),
  note(
    "accessories",
    T("No los olvides", "Don't forget", "À ne pas oublier"),
    T("Accesorios imprescindibles", "Must-have accessories", "Accessoires indispensables"),
    [
      T("Gafas de sol, protección solar y gorra: el sol de costa engaña.",
        "Sunglasses, sunscreen and a cap: the coastal sun is deceptive.",
        "Lunettes, crème solaire et casquette : le soleil de la côte est trompeur."),
      T("Un pañuelo para el viento y la arena de la playa.",
        "A scarf for the wind and the beach sand.",
        "Un foulard pour le vent et le sable de la plage."),
      T("Crema hidratante y botella reutilizable.",
        "Moisturiser and a reusable bottle.",
        "Crème hydratante et gourde réutilisable."),
      T("Bolsa pequeña y segura para los zocos del puerto.",
        "A small, secure bag for the port souks.",
        "Un petit sac sécurisé pour les souks du port."),
    ],
  ),
  note(
    "comfort",
    T("Sabor a mar", "A taste of the sea", "Un goût de mer"),
    T("Para disfrutar del litoral", "To enjoy the coastline", "Pour profiter du littoral"),
    [
      T("Efectivo en dírhams para té, pescado fresco y compras.",
        "Cash in dirhams for tea, fresh fish and shopping.",
        "Des espèces en dirhams pour le thé, le poisson frais et les achats."),
      T("Cámara: Tánger, Asilah y la costa son muy fotogénicas.",
        "A camera: Tangier, Asilah and the coast are very photogenic.",
        "Un appareil photo : Tanger, Asilah et la côte sont très photogéniques."),
      T("Un buen apetito: el pescado y el marisco son los protagonistas.",
        "A good appetite: fish and seafood take centre stage.",
        "Un bon appétit : le poisson et les fruits de mer sont à l'honneur."),
    ],
  ),
];

// Enduro / 4x4 adventure routes.
const ADVENTURE = [
  note(
    "adventure",
    T("Equipación", "Gear up", "Équipement"),
    T("Equipación para la aventura", "Gear for the adventure", "Équipement pour l'aventure"),
    [
      T("Ropa técnica transpirable y de secado rápido para las rutas.",
        "Breathable, quick-dry technical clothing for the routes.",
        "Des vêtements techniques respirants et à séchage rapide pour les pistes."),
      T("Capas para el contraste térmico entre montaña y desierto.",
        "Layers for the temperature swing between mountain and desert.",
        "Des couches pour l'écart thermique entre montagne et désert."),
      T("Guantes, buff y protección para el polvo y el viento en pista.",
        "Gloves, a buff and protection against dust and wind on the trail.",
        "Gants, tour de cou et protection contre la poussière et le vent."),
      T("Botas o calzado robusto y ya rodado.",
        "Boots or sturdy, broken-in footwear.",
        "Des bottes ou des chaussures robustes et déjà rodées."),
    ],
  ),
  note(
    "accessories",
    T("Protección", "Protection", "Protection"),
    T("Protección y seguridad", "Protection & safety", "Protection et sécurité"),
    [
      T("Gafas de sol envolventes y protección solar SPF 50.",
        "Wraparound sunglasses and SPF 50 sunscreen.",
        "Des lunettes enveloppantes et une crème SPF 50."),
      T("Protecciones según la actividad: consúltanos qué material aporta la agencia.",
        "Protective gear for the activity: ask us what kit the agency provides.",
        "Des protections selon l'activité : demandez-nous quel matériel l'agence fournit."),
      T("Crema labial, hidratante y gel de manos.",
        "Lip balm, moisturiser and hand gel.",
        "Baume à lèvres, crème hydratante et gel pour les mains."),
      T("Sistema de hidratación o botella de buena capacidad.",
        "A hydration pack or a high-capacity bottle.",
        "Une poche à eau ou une gourde de bonne capacité."),
    ],
  ),
  note(
    "desert",
    T("En ruta", "On the trail", "En route"),
    T("Para el campamento y los trayectos", "For the camp & the transfers", "Pour le campement et les trajets"),
    [
      T("Linterna frontal, batería externa y una bolsa estanca para el polvo.",
        "A head torch, a power bank and a dust-proof dry bag.",
        "Une lampe frontale, une batterie externe et un sac étanche contre la poussière."),
      T("Bolsa pequeña para la noche; el equipaje grande viaja en el vehículo de apoyo.",
        "A small bag for the night; the big luggage rides in the support vehicle.",
        "Un petit sac pour la nuit ; les gros bagages voyagent dans le véhicule d'assistance."),
      T("Algo de abrigo para las noches en el desierto.",
        "Something warm for the desert nights.",
        "De quoi vous couvrir pour les nuits au désert."),
      T("Efectivo en dírhams para los extras del camino.",
        "Cash in dirhams for extras along the way.",
        "Des espèces en dirhams pour les extras en chemin."),
    ],
  ),
];

// Short desert escape (2–4 nights).
const SHORT_DESERT = [
  note(
    "clothing",
    T("Lo justo", "Just enough", "L'essentiel"),
    T("Lo justo para el desierto", "Just enough for the desert", "L'essentiel pour le désert"),
    [
      T("Capas ligeras + un jersey o forro polar para la noche en las dunas.",
        "Light layers + a jumper or fleece for the night on the dunes.",
        "Des couches légères + un pull ou une polaire pour la nuit sur les dunes."),
      T("Ropa cómoda y calzado cerrado, fácil de sacudir la arena.",
        "Comfortable clothing and closed shoes that are easy to shake the sand off.",
        "Des vêtements confortables et des chaussures fermées, faciles à débarrasser du sable."),
      T("Un pañuelo grande (cheche) para sol, viento y arena.",
        "A large scarf (cheche) for sun, wind and sand.",
        "Un grand foulard (cheche) pour le soleil, le vent et le sable."),
    ],
  ),
  note(
    "accessories",
    T("No olvides", "Don't forget", "À ne pas oublier"),
    T("No los olvides", "Don't forget these", "À ne pas oublier"),
    [
      T("Gafas de sol, protección SPF 50 y gorra.",
        "Sunglasses, SPF 50 and a cap.",
        "Lunettes de soleil, SPF 50 et casquette."),
      T("Crema labial e hidratante (ambiente muy seco).",
        "Lip balm and moisturiser (very dry air).",
        "Baume à lèvres et crème hydratante (air très sec)."),
      T("Botella reutilizable y batería externa.",
        "A reusable bottle and a power bank.",
        "Une gourde réutilisable et une batterie externe."),
    ],
  ),
  note(
    "desert",
    T("Bajo las estrellas", "Under the stars", "Sous les étoiles"),
    T("Para tu noche bajo las estrellas", "For your night under the stars", "Pour votre nuit sous les étoiles"),
    [
      T("Bolsa pequeña para 1 noche; deja la maleta en el vehículo.",
        "A small bag for 1 night; leave your suitcase in the vehicle.",
        "Un petit sac pour 1 nuit ; laissez la valise dans le véhicule."),
      T("Linterna frontal y algo de abrigo para dormir.",
        "A head torch and something warm to sleep in.",
        "Une lampe frontale et de quoi vous couvrir pour dormir."),
      T("Algo de efectivo en dírhams para propinas y té.",
        "Some cash in dirhams for tips and tea.",
        "Un peu d'espèces en dirhams pour les pourboires et le thé."),
    ],
  ),
];

// Short Atlas / mountain escape.
const SHORT_ATLAS = [
  note(
    "clothing",
    T("En la montaña", "In the mountains", "En montagne"),
    T("Ropa para la montaña", "Clothes for the mountains", "Vêtements pour la montagne"),
    [
      T("Capas y un forro polar: en el Alto Atlas refresca, sobre todo de noche.",
        "Layers and a fleece: the High Atlas gets cool, especially at night.",
        "Des couches et une polaire : le Haut Atlas se rafraîchit, surtout la nuit."),
      T("Pantalón cómodo y transpirable para las caminatas suaves.",
        "Comfortable, breathable trousers for the gentle hikes.",
        "Un pantalon confortable et respirant pour les randonnées douces."),
      T("Calzado de trekking o zapatillas cerradas, ya usadas.",
        "Trekking shoes or broken-in closed trainers.",
        "Des chaussures de trekking ou des baskets fermées, déjà rodées."),
    ],
  ),
  note(
    "accessories",
    T("Para las rutas", "For the hikes", "Pour les randonnées"),
    T("Para las rutas", "For the trails", "Pour les sentiers"),
    [
      T("Gafas de sol, protección solar y gorra.",
        "Sunglasses, sunscreen and a cap.",
        "Lunettes de soleil, crème solaire et casquette."),
      T("Botella reutilizable y un pequeño snack para el camino.",
        "A reusable bottle and a small snack for the trail.",
        "Une gourde réutilisable et un en-cas pour le chemin."),
      T("Crema hidratante para el ambiente seco de montaña.",
        "Moisturiser for the dry mountain air.",
        "Crème hydratante pour l'air sec de la montagne."),
    ],
  ),
  note(
    "comfort",
    T("Útil", "Handy", "Pratique"),
    T("Detalles útiles", "Handy details", "Détails pratiques"),
    [
      T("Una chaqueta ligera por si cambia el tiempo en altura.",
        "A light jacket in case the weather changes at altitude.",
        "Une veste légère au cas où le temps change en altitude."),
      T("Efectivo en dírhams para los pueblos bereberes.",
        "Cash in dirhams for the Berber villages.",
        "Des espèces en dirhams pour les villages berbères."),
      T("Cámara: los valles del Atlas son espectaculares.",
        "A camera: the Atlas valleys are spectacular.",
        "Un appareil photo : les vallées de l'Atlas sont spectaculaires."),
    ],
  ),
];

// Short city break (Fez / Marrakech).
const SHORT_CITY = [
  note(
    "clothing",
    T("Para la medina", "For the medina", "Pour la médina"),
    T("Ropa para la medina", "Clothes for the medina", "Vêtements pour la médina"),
    [
      T("Ropa cómoda y modesta para entrar en mezquitas y medersas.",
        "Comfortable, modest clothing for mosques and medersas.",
        "Des vêtements confortables et couvrants pour les mosquées et médersas."),
      T("Capas ligeras: las medinas se recorren a pie.",
        "Light layers: medinas are explored on foot.",
        "Des couches légères : les médinas se parcourent à pied."),
      T("Calzado cómodo y cerrado para las calles empedradas.",
        "Comfortable, closed shoes for the cobbled streets.",
        "Des chaussures fermées et confortables pour les ruelles pavées."),
    ],
  ),
  note(
    "accessories",
    T("Para callejear", "For wandering", "Pour flâner"),
    T("Para callejear", "For wandering the streets", "Pour flâner dans les ruelles"),
    [
      T("Gafas de sol, protección solar y gorra.",
        "Sunglasses, sunscreen and a cap.",
        "Lunettes de soleil, crème solaire et casquette."),
      T("Bolsa cruzada pequeña y segura para los zocos.",
        "A small, secure crossbody bag for the souks.",
        "Un petit sac bandoulière sécurisé pour les souks."),
      T("Botella reutilizable y crema hidratante.",
        "A reusable bottle and moisturiser.",
        "Une gourde réutilisable et de la crème hydratante."),
    ],
  ),
  note(
    "city",
    T("Detalles", "Little details", "Les détails"),
    T("Detalles que ayudan", "Helpful details", "Détails utiles"),
    [
      T("Efectivo en dírhams para zocos y propinas.",
        "Cash in dirhams for souks and tips.",
        "Des espèces en dirhams pour les souks et les pourboires."),
      T("Cámara o móvil con espacio: cada rincón es una foto.",
        "A camera or phone with space: every corner is a photo.",
        "Un appareil ou un téléphone avec de la place : chaque coin est une photo."),
      T("Ganas de regatear y de perderte (con calma) por la medina.",
        "A taste for bargaining and for getting (calmly) lost in the medina.",
        "L'envie de marchander et de vous perdre (calmement) dans la médina."),
    ],
  ),
];

const PROFILES = {
  SOUTH_DESERT, FULL_CROSSING, NORTH, COAST, ADVENTURE,
  SHORT_DESERT, SHORT_ATLAS, SHORT_CITY,
};

/* ------------------------------------------------------------
   Bespoke per-route overrides (optional). Keyed by routeId.
------------------------------------------------------------ */
const ROUTE_OVERRIDES = {};

/* ------------------------------------------------------------
   Classify a programme routeId into a packing profile.
------------------------------------------------------------ */
const classify = (routeId) => {
  const id = (routeId || "").toLowerCase();
  if (!id) return null;

  if (id.includes("enduro") || id.includes("aventura")) return "ADVENTURE";

  if (id.includes("escapada")) {
    if (id.includes("atlas")) return "SHORT_ATLAS";
    if (id.includes("desierto") || id.includes("erg") || id.includes("agafay") || id.includes("sidiali"))
      return "SHORT_DESERT";
    return "SHORT_CITY"; // fez, marrakech
  }

  // Long north→south crossings (cities + Atlas + desert).
  const hasFez = id.includes("fez");
  const hasRak = id.includes("marrakech") || id.includes("rak");
  const hasDesertLeg = id.includes("sidiali") || id.includes("ozz") || id.includes("err") || id.includes("atlas");
  if ((hasFez && hasRak) || (hasFez && hasDesertLeg) || (id.includes("tanger") && hasRak)) {
    return "FULL_CROSSING";
  }

  if (id.includes("tanger")) return "NORTH"; // tanger-fez, fez-tanger
  if (id.includes("ciudadesimperiales") || id.includes("rif")) return "NORTH";
  if (id.includes("ess")) return "COAST"; // marrakech + Essaouira

  // South desert loops & combos.
  if (
    id.includes("atlasdesierto") || id.includes("desiertoatlas") ||
    id.includes("marrakecherg") || id.includes("ergmarrakech") ||
    id.includes("marrakechloop")
  ) {
    return "SOUTH_DESERT";
  }

  return "SOUTH_DESERT"; // sensible default for any unmatched southern route
};

export const getTripPackingNotes = (routeId) => {
  if (ROUTE_OVERRIDES[routeId]) return ROUTE_OVERRIDES[routeId];
  const profile = classify(routeId);
  return profile ? PROFILES[profile] : null;
};

export { SIGN_FALLBACK };
