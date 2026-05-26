// Editorial gallery image sets per regional/landing page section.
// Each set contains curated images themed to the surrounding EditorialBlock.

const T = (es, en, fr) => ({ es, en, fr });
const U = (id, w = 1600) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=85`;

/* =====================================================================
   /viajes/surdemarruecos
===================================================================== */
export const SUR_GALLERIES = [
  // 1 · Patrimonio del sur · La ruta de las mil kasbahs
  {
    overline: T("Galería · Mil kasbahs", "Gallery · Thousand kasbahs", "Galerie · Mille kasbahs"),
    title:    T("Adobe, palmerales y caravanas.", "Adobe, palm groves and caravans.", "Adobe, palmeraies et caravanes."),
    body:     T(
      "Kasbahs centenarias, arquitectura de tierra, valles de los oasis del Drâa y herencia bereber a lo largo de la mítica ruta de las mil kasbahs.",
      "Centuries-old kasbahs, earthen architecture, Drâa oasis valleys and Berber heritage along the mythical route of a thousand kasbahs.",
      "Kasbahs séculaires, architecture en pisé, vallées des oasis du Drâa et héritage berbère le long de la mythique route des mille kasbahs.",
    ),
    accent: "#A07042",
    images: [
      { src: U("photo-1539020140153-e479b8c22e70"), caption: T("Aït Benhaddou al amanecer", "Aït Benhaddou at dawn", "Aït Benhaddou à l'aube") },
      { src: U("photo-1597212618440-806262de4f6b"), caption: T("Adobe del Valle del Drâa", "Drâa Valley adobe", "Pisé de la vallée du Drâa") },
      { src: U("photo-1547234935-80c7145ec969"),    caption: T("Kasbah de Taourirt · Ouarzazate", "Taourirt Kasbah · Ouarzazate", "Kasbah Taourirt · Ouarzazate") },
      { src: U("photo-1469474968028-56623f02e42e"), caption: T("Palmeral del sur", "Southern palm grove", "Palmeraie du sud") },
      { src: U("photo-1570133435536-7ececf000ef6"), caption: T("Mujer imazighen tejiendo", "Imazighen woman weaving", "Femme imazighen tissant") },
      { src: U("photo-1597212618440-806262de4f6b"), caption: T("Gargantas del Dades", "Dades Gorges", "Gorges du Dadès") },
    ],
  },
  // 2 · Puerta del desierto · Merzouga y el Erg Chebbi
  {
    overline: T("Galería · Erg Chebbi", "Gallery · Erg Chebbi", "Galerie · Erg Chebbi"),
    title:    T("La puerta del desierto.", "The gate of the desert.", "La porte du désert."),
    body:     T(
      "Las dunas de 150 m del Erg Chebbi, bivouacs de lujo, Merzouga y la luz del Sáhara que se transforma con cada hora del día.",
      "150-metre Erg Chebbi dunes, luxury bivouacs, Merzouga and Saharan light that shifts with every hour.",
      "Dunes de 150 m de l'Erg Chebbi, bivouacs de luxe, Merzouga et la lumière saharienne qui change à chaque heure.",
    ),
    accent: "#C16542",
    images: [
      { src: U("photo-1542401886-65d6c61db217"), caption: T("Camino entre dunas del Erg Chebbi", "Path through the Erg Chebbi dunes", "Sentier entre les dunes de l'Erg Chebbi") },
      { src: U("photo-1539020140153-e479b8c22e70"), caption: T("Bivouac al atardecer", "Bivouac at sunset", "Bivouac au crépuscule") },
      { src: U("photo-1570133435536-7ececf000ef6"), caption: T("Caravana de dromedarios", "Camel caravan", "Caravane de dromadaires") },
      { src: U("photo-1469474968028-56623f02e42e"), caption: T("Té a la menta en el desierto", "Mint tea in the desert", "Thé à la menthe dans le désert") },
      { src: U("photo-1570133435536-7ececf000ef6"), caption: T("Khamlia · pueblo gnaoua", "Khamlia · Gnawa village", "Khamlia · village gnaoua") },
      { src: U("photo-1570133435536-7ececf000ef6"), caption: T("Atardecer sobre el Sáhara", "Sunset over the Sahara", "Crépuscule sur le Sahara") },
    ],
  },
  // 3 · Marrakech, Atlas & Sahara
  {
    overline: T("Galería · Atlas & Sáhara", "Gallery · Atlas & Sahara", "Galerie · Atlas & Sahara"),
    title:    T("Cumbres, oasis y mares de dunas.", "Summits, oases and seas of dunes.", "Sommets, oasis et mers de dunes."),
    body:     T(
      "De la plaza Jemaa el-Fna a las cumbres del Alto Atlas, pasando por Tizi n'Tichka, las gargantas del Todra y el oasis de Skoura.",
      "From Jemaa el-Fna to the High Atlas summits via Tizi n'Tichka, the Todra Gorges and the Skoura oasis.",
      "De Jemaa el-Fna aux sommets du Haut Atlas via Tizi n'Tichka, les gorges du Todra et l'oasis de Skoura.",
    ),
    accent: "#D97742",
    images: [
      { src: U("photo-1547234935-80c7145ec969"), caption: T("Marrakech · ciudad roja", "Marrakech · the red city", "Marrakech · la ville rouge") },
      { src: U("photo-1469474968028-56623f02e42e"), caption: T("Alto Atlas · pueblos imazighen", "High Atlas · Imazighen villages", "Haut Atlas · villages imazighen") },
      { src: U("photo-1542401886-65d6c61db217"), caption: T("Gargantas del Todra", "Todra Gorges", "Gorges du Todra") },
      { src: U("photo-1542401886-65d6c61db217"), caption: T("Dunas del Sáhara", "Sahara dunes", "Dunes du Sahara") },
      { src: U("photo-1539020140153-e479b8c22e70"), caption: T("Oasis de Skoura", "Skoura oasis", "Oasis de Skoura") },
      { src: U("photo-1547234935-80c7145ec969"),    caption: T("Mercado bereber del Atlas", "Atlas Berber market", "Marché berbère de l'Atlas") },
    ],
  },
  // 4 · Marrakech & Essaouira
  {
    overline: T("Galería · Marrakech & Essaouira", "Gallery · Marrakech & Essaouira", "Galerie · Marrakech & Essaouira"),
    title:    T("Dos almas: la ciudad roja y la perla del Atlántico.", "Two souls: the red city and the Atlantic pearl.", "Deux âmes : la ville rouge et la perle de l'Atlantique."),
    body:     T(
      "Zocos, palacios y plazas vibrantes en Marrakech, contrastados con las murallas portuguesas, los gaviotas y el viento de Essaouira.",
      "Souks, palaces and vibrant squares in Marrakech, set against the Portuguese ramparts, gulls and wind of Essaouira.",
      "Souks, palais et places vibrantes à Marrakech, en contraste avec les remparts portugais, les mouettes et le vent d'Essaouira.",
    ),
    accent: "#5A7F9C",
    images: [
      { src: U("photo-1469474968028-56623f02e42e"), caption: T("Jemaa el-Fna al atardecer", "Jemaa el-Fna at sunset", "Jemaa el-Fna au coucher du soleil") },
      { src: U("photo-1597212618440-806262de4f6b"), caption: T("Essaouira · murallas portuguesas", "Essaouira · Portuguese ramparts", "Essaouira · remparts portugais") },
      { src: U("photo-1597212618440-806262de4f6b"), caption: T("Especias en el zoco de Marrakech", "Spices in the Marrakech souk", "Épices dans le souk de Marrakech") },
      { src: U("photo-1539020140153-e479b8c22e70"), caption: T("Palmeral de Marrakech", "Marrakech palm grove", "Palmeraie de Marrakech") },
      { src: U("photo-1570133435536-7ececf000ef6"), caption: T("Puerto de Essaouira", "Essaouira harbour", "Port d'Essaouira") },
      { src: U("photo-1597212618440-806262de4f6b"), caption: T("Artesanos del cuero", "Leather artisans", "Artisans du cuir") },
    ],
  },
];

/* =====================================================================
   /viajes/marruecos (Gran Sur · landing)
===================================================================== */
export const MARRUECOS_GALLERIES = [
  // Intro · Gran Sur · Una travesía total
  {
    overline: T("Galería · Marruecos integral", "Gallery · Whole Morocco", "Galerie · Maroc intégral"),
    title:    T("Una sola travesía, todos los Marruecos.", "One journey, every Morocco.", "Une seule traversée, tous les Maroc."),
    body:     T(
      "Norte imperial, Medio Atlas, dunas del Sáhara, ruta de las mil kasbahs, Alto Atlas y ciudad roja — cada paisaje y cada cultura del país en una misma ruta.",
      "Imperial north, Middle Atlas, Sahara dunes, route of a thousand kasbahs, High Atlas and the red city — every landscape and culture of the country in a single route.",
      "Nord impérial, Moyen Atlas, dunes du Sahara, route des mille kasbahs, Haut Atlas et ville rouge — tous les paysages et cultures du pays en un seul itinéraire.",
    ),
    accent: "#A07042",
    images: [
      { src: U("photo-1539020140153-e479b8c22e70"), caption: T("Fez · medina UNESCO", "Fez · UNESCO medina", "Fès · médina UNESCO") },
      { src: U("photo-1539020140153-e479b8c22e70"), caption: T("Cedros gigantes del Medio Atlas", "Giant cedars of the Middle Atlas", "Cèdres géants du Moyen Atlas") },
      { src: U("photo-1542401886-65d6c61db217"), caption: T("Erg Chebbi · mar de dunas", "Erg Chebbi · sea of dunes", "Erg Chebbi · mer de dunes") },
      { src: U("photo-1539020140153-e479b8c22e70"), caption: T("Aït Benhaddou · UNESCO", "Aït Benhaddou · UNESCO", "Aït Benhaddou · UNESCO") },
      { src: U("photo-1469474968028-56623f02e42e"), caption: T("Tizi n'Tichka · paso del Alto Atlas", "Tizi n'Tichka · High Atlas pass", "Tizi n'Tichka · col du Haut Atlas") },
      { src: U("photo-1547234935-80c7145ec969"), caption: T("Marrakech · ciudad roja", "Marrakech · the red city", "Marrakech · la ville rouge") },
    ],
  },
];

/* =====================================================================
   /viajes/nortedemarruecos
===================================================================== */
export const NORTE_GALLERIES = [
  // 1 · El alma del Norte (after first editorial block)
  {
    overline: T("Galería · Ciudades imperiales", "Gallery · Imperial cities", "Galerie · Cités impériales"),
    title:    T("Mil años de legado.", "A thousand years of legacy.", "Mille ans d'héritage."),
    body:     T(
      "Las medinas de Fez y Meknès, los mosaicos romanos de Volubilis y Rabat — el alma cultural del norte de Marruecos.",
      "The medinas of Fez and Meknes, the Roman mosaics of Volubilis and Rabat — the cultural soul of northern Morocco.",
      "Les médinas de Fès et Meknès, les mosaïques romaines de Volubilis et Rabat — l'âme culturelle du nord du Maroc.",
    ),
    accent: "#C16542",
    images: [
      { src: U("photo-1597212618440-806262de4f6b"), caption: T("Tenerías Chouara · Fez", "Chouara tanneries · Fez", "Tanneries Chouara · Fès") },
      { src: U("photo-1597212618440-806262de4f6b"), caption: T("Bab al Mansour · Meknès", "Bab al Mansour · Meknes", "Bab al Mansour · Meknès") },
      { src: U("photo-1547234935-80c7145ec969"),    caption: T("Volubilis · mosaicos romanos", "Volubilis · Roman mosaics", "Volubilis · mosaïques romaines") },
      { src: U("photo-1570133435536-7ececf000ef6"), caption: T("Rabat · Torre Hassan", "Rabat · Hassan Tower", "Rabat · Tour Hassan") },
      { src: U("photo-1570133435536-7ececf000ef6"), caption: T("Madraza Bou Inania", "Bou Inania Madrasa", "Médersa Bou Inania") },
      { src: U("photo-1539020140153-e479b8c22e70"), caption: T("Caligrafía y geometría", "Calligraphy and geometry", "Calligraphie et géométrie") },
    ],
  },
  // 2 · Mosaico del Norte (after second editorial block)
  {
    overline: T("Galería · Rif & Mediterráneo", "Gallery · Rif & Mediterranean", "Galerie · Rif & Méditerranée"),
    title:    T("Del añil del Rif al azul del Mediterráneo.", "From Rif indigo to Mediterranean blue.", "De l'indigo du Rif au bleu méditerranéen."),
    body:     T(
      "Chefchaouen, las cascadas de Akchour, la medina andalusí de Tetuán y las murallas portuguesas de Asilah.",
      "Chefchaouen, the Akchour waterfalls, the Andalusian medina of Tetouan and the Portuguese ramparts of Asilah.",
      "Chefchaouen, les cascades d'Akchour, la médina andalouse de Tétouan et les remparts portugais d'Asilah.",
    ),
    accent: "#5A7F9C",
    images: [
      { src: U("photo-1539020140153-e479b8c22e70"), caption: T("Chefchaouen · pueblo azul", "Chefchaouen · blue town", "Chefchaouen · village bleu") },
      { src: U("photo-1597212618440-806262de4f6b"), caption: T("Tetuán · medina andalusí", "Tetouan · Andalusian medina", "Tétouan · médina andalouse") },
      { src: U("photo-1570133435536-7ececf000ef6"), caption: T("Cascadas de Akchour", "Akchour waterfalls", "Cascades d'Akchour") },
      { src: U("photo-1547234935-80c7145ec969"),    caption: T("Tánger · Cabo Espartel", "Tangier · Cape Spartel", "Tanger · Cap Spartel") },
      { src: U("photo-1597212618440-806262de4f6b"), caption: T("Asilah · murallas portuguesas", "Asilah · Portuguese ramparts", "Asilah · remparts portugais") },
      { src: U("photo-1570133435536-7ececf000ef6"), caption: T("Mediterráneo del Rif", "Rif Mediterranean", "Méditerranée du Rif") },
    ],
  },
];

/* =====================================================================
   /viajes/escapadas — one gallery per escapada (5)
===================================================================== */
export const ESCAPADAS_GALLERIES = [
  // 0 · Desierto
  {
    overline: T("Galería · Escapada al desierto", "Gallery · Desert escape", "Galerie · Escapade au désert"),
    title:    T("Sáhara en tres días.", "Sahara in three days.", "Sahara en trois jours."),
    body:     T(
      "Dunas del Erg Chebbi, bivouac bajo las estrellas, Khamlia y la magia del desierto más cercano a Europa.",
      "Erg Chebbi dunes, bivouac under the stars, Khamlia and the magic of Europe's closest desert.",
      "Dunes de l'Erg Chebbi, bivouac sous les étoiles, Khamlia et la magie du désert le plus proche de l'Europe.",
    ),
    accent: "#C16542",
    images: [
      { src: U("photo-1542401886-65d6c61db217"), caption: T("Erg Chebbi · al amanecer", "Erg Chebbi · at dawn", "Erg Chebbi · à l'aube") },
      { src: U("photo-1539020140153-e479b8c22e70"), caption: T("Bivouac bajo las estrellas", "Bivouac under the stars", "Bivouac sous les étoiles") },
      { src: U("photo-1542401886-65d6c61db217"), caption: T("Caravana de dromedarios", "Camel caravan", "Caravane de dromadaires") },
      { src: U("photo-1570133435536-7ececf000ef6"), caption: T("Khamlia · ritmos gnaoua", "Khamlia · Gnawa rhythms", "Khamlia · rythmes gnaoua") },
      { src: U("photo-1469474968028-56623f02e42e"), caption: T("Té a la menta entre dunas", "Mint tea among the dunes", "Thé à la menthe au cœur des dunes") },
      { src: U("photo-1570133435536-7ececf000ef6"), caption: T("Atardecer sahariano", "Saharan sunset", "Crépuscule saharien") },
    ],
  },
  // 1 · Atlas
  {
    overline: T("Galería · Escapada al Atlas", "Gallery · Atlas escape", "Galerie · Escapade en Atlas"),
    title:    T("Cumbres y valles del Alto Atlas.", "High Atlas summits and valleys.", "Sommets et vallées du Haut Atlas."),
    body:     T(
      "Imlil, Tizi n'Tichka, gargantas y pueblos bereberes donde el tiempo parece detenerse.",
      "Imlil, Tizi n'Tichka, gorges and Berber villages where time seems to stand still.",
      "Imlil, Tizi n'Tichka, gorges et villages berbères où le temps semble suspendu.",
    ),
    accent: "#5A6B4F",
    images: [
      { src: U("photo-1469474968028-56623f02e42e"), caption: T("Alto Atlas · panorámica", "High Atlas · panoramic view", "Haut Atlas · panoramique") },
      { src: U("photo-1597212618440-806262de4f6b"), caption: T("Gargantas del Todra", "Todra Gorges", "Gorges du Todra") },
      { src: U("photo-1570133435536-7ececf000ef6"), caption: T("Pueblos bereberes", "Berber villages", "Villages berbères") },
      { src: U("photo-1547234935-80c7145ec969"),    caption: T("Mercado de montaña", "Mountain market", "Marché de montagne") },
      { src: U("photo-1539020140153-e479b8c22e70"), caption: T("Senda en el Atlas", "Atlas trail", "Sentier de l'Atlas") },
      { src: U("photo-1597212618440-806262de4f6b"), caption: T("Pan en tannour", "Bread in the tannour", "Pain au tannour") },
    ],
  },
  // 2 · Fez
  {
    overline: T("Galería · Escapada a Fez", "Gallery · Fez escape", "Galerie · Escapade à Fès"),
    title:    T("Fez el-Bali, el laberinto vivo.", "Fez el-Bali, the living labyrinth.", "Fès el-Bali, le labyrinthe vivant."),
    body:     T(
      "Medina UNESCO, tenerías Chouara, Al-Qarawiyyin y los gremios artesanales más antiguos del Magreb.",
      "UNESCO medina, Chouara tanneries, Al-Qarawiyyin and the oldest artisan guilds in the Maghreb.",
      "Médina UNESCO, tanneries Chouara, Al-Qarawiyyin et les plus anciennes corporations d'artisans du Maghreb.",
    ),
    accent: "#A07042",
    images: [
      { src: U("photo-1597212618440-806262de4f6b"), caption: T("Tenerías Chouara", "Chouara tanneries", "Tanneries Chouara") },
      { src: U("photo-1597212618440-806262de4f6b"), caption: T("Madraza Bou Inania", "Bou Inania Madrasa", "Médersa Bou Inania") },
      { src: U("photo-1570133435536-7ececf000ef6"), caption: T("Callejuelas de Fez el-Bali", "Fez el-Bali alleys", "Ruelles de Fès el-Bali") },
      { src: U("photo-1547234935-80c7145ec969"),    caption: T("Artesanos del latón", "Brass artisans", "Artisans du laiton") },
      { src: U("photo-1570133435536-7ececf000ef6"), caption: T("Vista panorámica de la medina", "Medina panoramic view", "Vue panoramique de la médina") },
      { src: U("photo-1539020140153-e479b8c22e70"), caption: T("Patio de un riad", "Riad courtyard", "Patio d'un riad") },
    ],
  },
  // 3 · Marrakech
  {
    overline: T("Galería · Escapada a Marrakech", "Gallery · Marrakech escape", "Galerie · Escapade à Marrakech"),
    title:    T("La ciudad roja sin prisas.", "The red city, unhurried.", "La ville rouge, sans hâte."),
    body:     T(
      "Jemaa el-Fna al atardecer, palacio Bahía, jardines Majorelle y los zocos más vibrantes del país.",
      "Jemaa el-Fna at sunset, Bahia Palace, Majorelle Gardens and the country's most vibrant souks.",
      "Jemaa el-Fna au coucher du soleil, palais Bahia, jardins Majorelle et les souks les plus vibrants du pays.",
    ),
    accent: "#D97742",
    images: [
      { src: U("photo-1547234935-80c7145ec969"), caption: T("Jemaa el-Fna", "Jemaa el-Fna", "Jemaa el-Fna") },
      { src: U("photo-1597212618440-806262de4f6b"), caption: T("Especias del zoco", "Souk spices", "Épices du souk") },
      { src: U("photo-1597212618440-806262de4f6b"), caption: T("Palacio Bahía", "Bahia Palace", "Palais Bahia") },
      { src: U("photo-1539020140153-e479b8c22e70"), caption: T("Jardines Majorelle", "Majorelle Gardens", "Jardins Majorelle") },
      { src: U("photo-1539020140153-e479b8c22e70"), caption: T("Koutoubia al atardecer", "Koutoubia at sunset", "Koutoubia au coucher du soleil") },
      { src: U("photo-1547234935-80c7145ec969"),    caption: T("Madraza Ben Youssef", "Ben Youssef Madrasa", "Médersa Ben Youssef") },
    ],
  },
  // 4 · Tánger
  {
    overline: T("Galería · Escapada a Tánger", "Gallery · Tangier escape", "Galerie · Escapade à Tanger"),
    title:    T("Donde el Atlántico besa el Mediterráneo.", "Where the Atlantic meets the Mediterranean.", "Où l'Atlantique embrasse la Méditerranée."),
    body:     T(
      "Cabo Espartel, las Grutas de Hércules, Tetuán «la Paloma Blanca» y el azul vibrante de Chefchaouen.",
      "Cape Spartel, the Caves of Hercules, Tetouan «the White Dove» and the vibrant blue of Chefchaouen.",
      "Cap Spartel, Grottes d'Hercule, Tétouan « la Colombe Blanche » et le bleu vibrant de Chefchaouen.",
    ),
    accent: "#5A7F9C",
    images: [
      { src: U("photo-1597212618440-806262de4f6b"), caption: T("Cabo Espartel", "Cape Spartel", "Cap Spartel") },
      { src: U("photo-1539020140153-e479b8c22e70"), caption: T("Chefchaouen · añil", "Chefchaouen · indigo", "Chefchaouen · indigo") },
      { src: U("photo-1547234935-80c7145ec969"),    caption: T("Tetuán · medina andalusí", "Tetouan · Andalusian medina", "Tétouan · médina andalouse") },
      { src: U("photo-1570133435536-7ececf000ef6"), caption: T("Costa atlántica", "Atlantic coast", "Côte atlantique") },
      { src: U("photo-1570133435536-7ececf000ef6"), caption: T("Grutas de Hércules", "Caves of Hercules", "Grottes d'Hercule") },
      { src: U("photo-1570133435536-7ececf000ef6"), caption: T("Té a la menta sobre el estrecho", "Mint tea over the strait", "Thé à la menthe sur le détroit") },
    ],
  },
];
