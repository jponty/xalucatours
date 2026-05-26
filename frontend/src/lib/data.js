// Master data for Xaluca Tours — trilingual content with curated Moroccan imagery.

export const JOURNEYS = [
  {
    slug: "sahara-soul",
    duration: { en: "7 nights", fr: "7 nuits", es: "7 noches" },
    from: 2890,
    accent: "#C16542",
    region: { en: "Erg Chebbi · Merzouga", fr: "Erg Chebbi · Merzouga", es: "Erg Chebbi · Merzouga" },
    image: "https://images.unsplash.com/photo-1542401886-65d6c61db217?auto=format&fit=crop&w=1600&q=80",
    title: {
      en: "Sahara Soul",
      fr: "L'âme du Sahara",
      es: "Alma del Sáhara",
    },
    summary: {
      en: "Seven slow days crossing the Dadès Valley to the orange dunes of Erg Chebbi — camel caravan, Berber bivouac and a night so dark you can read the Milky Way.",
      fr: "Sept jours lents de la vallée du Dadès aux dunes orangées de l'Erg Chebbi — caravane chamelière, bivouac berbère et une nuit assez sombre pour lire la Voie lactée.",
      es: "Siete días lentos cruzando el valle del Dadès hasta las dunas anaranjadas de Erg Chebbi — caravana de camellos, vivac bereber y una noche oscura para leer la Vía Láctea.",
    },
  },
  {
    slug: "atlas-villages",
    duration: { en: "9 nights", fr: "9 nuits", es: "9 noches" },
    from: 3450,
    accent: "#5A6B4F",
    region: { en: "High Atlas · Aït Bouguemez", fr: "Haut Atlas · Aït Bouguemez", es: "Alto Atlas · Aït Bouguemez" },
    image: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=1600&q=80",
    title: {
      en: "Atlas Berber Villages",
      fr: "Villages berbères de l'Atlas",
      es: "Aldeas bereberes del Atlas",
    },
    summary: {
      en: "Walk the Happy Valley with a muleteer named Mohamed, share couscous with three generations of Aït Atta, and sleep in earthen kasbahs hand-built by the family that hosts you.",
      fr: "Parcourez la Vallée Heureuse aux côtés d'un muletier nommé Mohamed, partagez un couscous avec trois générations d'Aït Atta, et dormez dans des kasbahs de pisé bâties par la famille qui vous accueille.",
      es: "Recorre el Valle Feliz con un mulero llamado Mohamed, comparte cuscús con tres generaciones de Aït Atta y duerme en kasbahs de adobe construidas por la familia que te recibe.",
    },
  },
  {
    slug: "imperial-cities",
    duration: { en: "10 nights", fr: "10 nuits", es: "10 noches" },
    from: 4250,
    accent: "#A07042",
    region: { en: "Fez · Meknes · Marrakech", fr: "Fès · Meknès · Marrakech", es: "Fez · Mequinez · Marrakech" },
    image: "https://images.unsplash.com/photo-1570133435536-7ececf000ef6?auto=format&fit=crop&w=1600&q=80",
    title: {
      en: "Imperial Cities & Riad Living",
      fr: "Cités impériales & vie en riad",
      es: "Ciudades imperiales & vida en riad",
    },
    summary: {
      en: "Four imperial cities, four private riads, four masters of their craft. Tannery rooftops in Fez, calligraphy in Meknès, zellige tilework in Salé, and a souk-wandering chef in Marrakech.",
      fr: "Quatre cités impériales, quatre riads privés, quatre maîtres dans leur art. Toits des tanneries à Fès, calligraphie à Meknès, zellige à Salé, et un chef qui flâne au souk à Marrakech.",
      es: "Cuatro ciudades imperiales, cuatro riads privados, cuatro maestros de su oficio. Tejados de curtidurías en Fez, caligrafía en Mequinez, zellige en Salé y un chef de souk en Marrakech.",
    },
  },
  {
    slug: "atlantic-coast",
    duration: { en: "6 nights", fr: "6 nuits", es: "6 noches" },
    from: 2380,
    accent: "#3A4A5F",
    region: { en: "Essaouira · Sidi Kaouki · Oualidia", fr: "Essaouira · Sidi Kaouki · Oualidia", es: "Essaouira · Sidi Kaouki · Oualidia" },
    image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1600&q=80",
    title: {
      en: "Atlantic Wind & Argan",
      fr: "Vents atlantiques & arganier",
      es: "Viento atlántico & argán",
    },
    summary: {
      en: "From the gull-blue ramparts of Essaouira to oyster lagoons of Oualidia. Surf at dawn, learn to press argan with a women's cooperative, dine on grilled sardines at the harbour wall.",
      fr: "Des remparts bleu-mouette d'Essaouira aux lagunes d'huîtres d'Oualidia. Surf à l'aube, atelier d'huile d'argan avec une coopérative féminine, sardines grillées sur le port.",
      es: "De las murallas azul gaviota de Essaouira a las lagunas de ostras de Oualidia. Surf al amanecer, prensa de argán con una cooperativa femenina y sardinas a la brasa en el puerto.",
    },
  },
  {
    slug: "blue-pearl",
    duration: { en: "5 nights", fr: "5 nuits", es: "5 noches" },
    from: 1980,
    accent: "#3A4A5F",
    region: { en: "Chefchaouen · Rif Mountains", fr: "Chefchaouen · Rif", es: "Chefchaouen · Rif" },
    image: "https://images.unsplash.com/photo-1547234935-80c7145ec969?auto=format&fit=crop&w=1600&q=80",
    title: {
      en: "Blue Pearl of the Rif",
      fr: "Perle bleue du Rif",
      es: "Perla azul del Rif",
    },
    summary: {
      en: "Wake up inside an indigo dream. Five days of hill-walks above Chefchaouen, with cheese-makers, goat-herders, and the last living family of indigo dyers in the medina.",
      fr: "Réveillez-vous dans un rêve indigo. Cinq jours de randonnées au-dessus de Chefchaouen, avec fromagers, chevriers et la dernière famille de teinturiers d'indigo de la médina.",
      es: "Despierta dentro de un sueño índigo. Cinco días caminando sobre Chefchaouen, con queseros, cabreros y la última familia de tintoreros de índigo de la medina.",
    },
  },
  {
    slug: "honeymoon-magic",
    duration: { en: "8 nights", fr: "8 nuits", es: "8 noches" },
    from: 5680,
    accent: "#D97742",
    region: { en: "Marrakech · Atlas · Sahara", fr: "Marrakech · Atlas · Sahara", es: "Marrakech · Atlas · Sáhara" },
    image: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=1600&q=80",
    title: {
      en: "Honeymoon Magic",
      fr: "Magie de lune de miel",
      es: "Magia de luna de miel",
    },
    summary: {
      en: "A garden-walled riad in Marrakech, a hammam ceremony for two, a private dinner under Atlas cedars, and one final night in a candle-lit caïdal tent — for the two of you only.",
      fr: "Riad clos de jardin à Marrakech, cérémonie hammam à deux, dîner privé sous les cèdres de l'Atlas, et une dernière nuit dans une tente caïdale à la lueur des bougies — pour vous deux seulement.",
      es: "Riad con jardín privado en Marrakech, ceremonia de hamam para dos, cena íntima bajo los cedros del Atlas y una última noche en una tienda caïdal a la luz de las velas — solo para vosotros.",
    },
  },
];

export const CAMPS = [
  {
    slug: "erg-chigaga",
    accent: "#C16542",
    title: { en: "Erg Chigaga — Tented Camp", fr: "Erg Chigaga — Camp toilé", es: "Erg Chigaga — Campamento" },
    location: { en: "South of Mhamid · 60 km of dunes from the road", fr: "Au sud de Mhamid · 60 km de dunes depuis la route", es: "Al sur de Mhamid · 60 km de dunas desde la carretera" },
    image: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1600&q=80",
    description: {
      en: "Twelve caïdal tents lined with hand-loomed Berber rugs, copper basins for washing, and a fire-pit that is lit before sunset and tended until the last guest goes to sleep.",
      fr: "Douze tentes caïdales tapissées de tapis berbères tissés à la main, vasques en cuivre et un feu allumé avant le coucher du soleil, entretenu jusqu'au dernier invité endormi.",
      es: "Doce tiendas caïdal forradas de alfombras bereberes, palanganas de cobre y una hoguera encendida antes del ocaso, atendida hasta el último huésped dormido.",
    },
  },
  {
    slug: "agafay-stone-desert",
    accent: "#8A6B4E",
    title: { en: "Agafay Stone Desert", fr: "Désert de pierre d'Agafay", es: "Desierto de piedra de Agafay" },
    location: { en: "45 min from Marrakech · Atlas backdrop", fr: "45 min de Marrakech · Toile de fond de l'Atlas", es: "45 min de Marrakech · Atlas al fondo" },
    image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1600&q=80",
    description: {
      en: "Lunar terrain just outside the red city. Private terraces, hammered-copper tubs, dinner served between iron candelabras and the silent gleam of the High Atlas.",
      fr: "Paysage lunaire aux portes de la ville rouge. Terrasses privées, baignoires en cuivre martelé, dîner servi entre candélabres en fer et l'éclat silencieux du Haut Atlas.",
      es: "Paisaje lunar a las puertas de la ciudad roja. Terrazas privadas, bañeras de cobre, cena entre candelabros de hierro y el brillo silencioso del Alto Atlas.",
    },
  },
  {
    slug: "mhamid-bivouac",
    accent: "#D4A373",
    title: { en: "Mhamid Family Bivouac", fr: "Bivouac familial de Mhamid", es: "Vivac familiar de Mhamid" },
    location: { en: "Edge of the last oasis · Drâa Valley", fr: "Bord de la dernière oasis · Vallée du Drâa", es: "Borde del último oasis · Valle del Drâa" },
    image: "https://images.unsplash.com/photo-1530541930197-ff16ac917b0e?auto=format&fit=crop&w=1600&q=80",
    description: {
      en: "Six tents only — never more. Run by the Ait Khabbach family for three generations, this is where the dunes meet the date palms and the children of the village still come to play at dusk.",
      fr: "Six tentes seulement — jamais plus. Tenu par la famille Aït Khabbach depuis trois générations, là où les dunes rencontrent les palmiers-dattiers et où les enfants du village viennent encore jouer au crépuscule.",
      es: "Solo seis tiendas — nunca más. Regentado por la familia Aït Khabbach durante tres generaciones, donde las dunas se encuentran con las palmeras datileras y los niños del pueblo aún juegan al atardecer.",
    },
  },
];

export const EXPERIENCES = [
  {
    slug: "zellige-atelier",
    icon: "Sparkles",
    accent: "#C16542",
    title: { en: "A morning in a zellige atelier", fr: "Une matinée dans un atelier de zellige", es: "Una mañana en un taller de zellige" },
    summary: {
      en: "Cut your own star tile by hand with a Fassi maâlem — and take it home wrapped in newspaper, still smelling of clay.",
      fr: "Découpez votre propre tesselle en étoile à la main avec un maâlem fassi — emportez-la enveloppée de papier journal, encore odorante d'argile.",
      es: "Corta a mano tu propia tesela con un maâlem fasí — y llévatela envuelta en periódico, aún oliendo a arcilla.",
    },
    image: "https://images.unsplash.com/photo-1604940500627-d3f44d1d21c6?auto=format&fit=crop&w=1200&q=80",
  },
  {
    slug: "dinner-with-fatima",
    icon: "UtensilsCrossed",
    accent: "#A07042",
    title: { en: "Dinner at Fatima's table", fr: "Dîner à la table de Fatima", es: "Cena en la mesa de Fátima" },
    summary: {
      en: "Seven courses, three generations of women, one rooftop above the medina — and a tagine recipe written for you in green ink as you leave.",
      fr: "Sept plats, trois générations de femmes, un toit au-dessus de la médina — et une recette de tajine écrite pour vous à l'encre verte au moment du départ.",
      es: "Siete platos, tres generaciones de mujeres, una azotea sobre la medina — y una receta de tajín escrita en tinta verde al despedirte.",
    },
    image: "https://images.unsplash.com/photo-1604908554027-fa44a6f3c4d5?auto=format&fit=crop&w=1200&q=80",
  },
  {
    slug: "gnawa-sunrise",
    icon: "Flame",
    accent: "#B95F38",
    title: { en: "Sunrise with Gnawa masters", fr: "Lever de soleil avec les maîtres Gnawa", es: "Amanecer con maestros Gnawa" },
    summary: {
      en: "Drums, krakeb and the slow call-and-response that has crossed deserts since the 16th century — performed for you and three guests, no one else.",
      fr: "Tambours, krakebs et l'appel-réponse lent qui traverse les déserts depuis le XVIᵉ siècle — joués pour vous et trois invités, personne d'autre.",
      es: "Tambores, krakeb y la llamada-respuesta lenta que cruza los desiertos desde el siglo XVI — interpretado solo para ti y tres invitados.",
    },
    image: "https://images.unsplash.com/photo-1564661395656-7cb45cd13d4d?auto=format&fit=crop&w=1200&q=80",
  },
  {
    slug: "argan-cooperative",
    icon: "HandHeart",
    accent: "#D4A373",
    title: { en: "Argan oil with a women's cooperative", fr: "Huile d'argan avec une coopérative féminine", es: "Aceite de argán con una cooperativa femenina" },
    summary: {
      en: "Crack nuts, stone-grind paste, decant golden oil. Twenty Amazigh women keep this forest alive — leave with a flask, a story, and a friend.",
      fr: "Casser les noix, broyer la pâte sur pierre, recueillir l'huile dorée. Vingt femmes amazighes maintiennent cette forêt en vie — repartez avec un flacon, une histoire, une amie.",
      es: "Romper nueces, moler en piedra, decantar el aceite dorado. Veinte mujeres amazigh mantienen vivo este bosque — vete con un frasco, una historia y una amiga.",
    },
    image: "https://images.unsplash.com/photo-1606755456206-b25206cde27c?auto=format&fit=crop&w=1200&q=80",
  },
  {
    slug: "atlas-trek",
    icon: "Mountain",
    accent: "#5A6B4F",
    title: { en: "Mule trek to a cedar pass", fr: "Randonnée muletière au col du cèdre", es: "Caminata con mula al puerto del cedro" },
    summary: {
      en: "Six hours from village to summit with mint-tea breaks beside hidden springs. Sleep in a stone gîte, dine on lamb that walked here today.",
      fr: "Six heures de marche du village au sommet, pauses au thé à la menthe près de sources cachées. Nuit dans un gîte en pierre, dîner d'agneau arrivé à pied le matin même.",
      es: "Seis horas del pueblo a la cumbre, con paradas de té a la menta junto a manantiales escondidos. Noche en un refugio de piedra, cordero que llegó andando hoy.",
    },
    image: "https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1200&q=80",
  },
  {
    slug: "stargazing",
    icon: "Sparkles",
    accent: "#3A4A5F",
    title: { en: "Stargazing with a Saharan astronomer", fr: "Astronomie avec un astronome saharien", es: "Estrellas con un astrónomo sahariano" },
    summary: {
      en: "An 8-inch telescope, a thermos of saffron tea and a guide who learned the constellations from his grandfather on this same dune.",
      fr: "Un télescope de 8 pouces, un thermos de thé au safran et un guide qui a appris les constellations de son grand-père sur cette même dune.",
      es: "Un telescopio de 8 pulgadas, un termo de té con azafrán y un guía que aprendió las constelaciones de su abuelo sobre esta misma duna.",
    },
    image: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?auto=format&fit=crop&w=1200&q=80",
  },
];

export const TESTIMONIALS = [
  {
    id: "t1",
    name: "Élise & Thomas",
    place: { en: "Paris, France", fr: "Paris, France", es: "París, Francia" },
    quote: {
      en: "We expected a holiday and came home with friends. Every door Yassine opened for us led somewhere we couldn't have imagined.",
      fr: "Nous attendions des vacances, nous sommes rentrés avec des amis. Chaque porte que Yassine nous a ouverte menait quelque part d'inimaginable.",
      es: "Esperábamos unas vacaciones y volvimos con amigos. Cada puerta que Yassine nos abrió conducía a un lugar inimaginable.",
    },
  },
  {
    id: "t2",
    name: "The Marshall family",
    place: { en: "Oakland, USA", fr: "Oakland, États-Unis", es: "Oakland, EE. UU." },
    quote: {
      en: "Three kids under twelve, ten days, zero meltdowns. The team built us a journey that respected our pace without ever feeling like a tour.",
      fr: "Trois enfants de moins de douze ans, dix jours, zéro crise. L'équipe a conçu un voyage à notre rythme, sans jamais ressembler à un circuit.",
      es: "Tres niños menores de doce, diez días, cero rabietas. El equipo diseñó un viaje a nuestro ritmo, sin parecer nunca un tour.",
    },
  },
  {
    id: "t3",
    name: "Carolina Reyes",
    place: { en: "Madrid, Spain", fr: "Madrid, Espagne", es: "Madrid, España" },
    quote: {
      en: "I have travelled professionally for fifteen years. Xaluca is the only agency that has ever asked me what kind of silence I wanted.",
      fr: "Je voyage à titre professionnel depuis quinze ans. Xaluca est la seule agence qui m'ait jamais demandé quel type de silence je souhaitais.",
      es: "Llevo viajando profesionalmente quince años. Xaluca es la única agencia que me ha preguntado qué tipo de silencio quería.",
    },
  },
  {
    id: "t4",
    name: "Henrik & Astrid",
    place: { en: "Oslo, Norway", fr: "Oslo, Norvège", es: "Oslo, Noruega" },
    quote: {
      en: "The bivouac under the stars — there is no review long enough. Just go.",
      fr: "Le bivouac sous les étoiles — aucun avis n'est assez long. Partez, simplement.",
      es: "El vivac bajo las estrellas — ninguna reseña es suficiente. Solo vete.",
    },
  },
];

export const JOURNAL = [
  {
    slug: "tagine-rules",
    accent: "#C16542",
    date: "2026-01-14",
    readTime: { en: "6 min read", fr: "6 min de lecture", es: "6 min de lectura" },
    image: "https://images.unsplash.com/photo-1541329013060-fd1a7df0d8b8?auto=format&fit=crop&w=1400&q=80",
    title: { en: "Seven rules for a tagine that sings", fr: "Sept règles pour un tajine qui chante", es: "Siete reglas para un tajín que canta" },
    excerpt: {
      en: "Fatima Bouayad spent four hours teaching us what her grandmother spent forty years perfecting. The first rule? Never lift the lid.",
      fr: "Fatima Bouayad nous a passé quatre heures à enseigner ce que sa grand-mère a peaufiné en quarante ans. Première règle : ne soulevez jamais le couvercle.",
      es: "Fátima Bouayad pasó cuatro horas enseñándonos lo que su abuela perfeccionó en cuarenta años. ¿Primera regla? No levantar nunca la tapa.",
    },
  },
  {
    slug: "blue-of-chefchaouen",
    accent: "#3A4A5F",
    date: "2025-12-02",
    readTime: { en: "8 min read", fr: "8 min de lecture", es: "8 min de lectura" },
    image: "https://images.unsplash.com/photo-1547234935-80c7145ec969?auto=format&fit=crop&w=1400&q=80",
    title: { en: "The seventy-two blues of Chefchaouen", fr: "Les soixante-douze bleus de Chefchaouen", es: "Los setenta y dos azules de Chefchaouen" },
    excerpt: {
      en: "A meditation on indigo, repellent mosquitoes, Jewish refugees, and why no two walls in the blue pearl are quite the same colour.",
      fr: "Méditation sur l'indigo, les moustiques répulsifs, les réfugiés juifs, et pourquoi aucun mur de la perle bleue n'est exactement de la même couleur.",
      es: "Una meditación sobre el índigo, los mosquitos repelidos, los refugiados judíos y por qué dos muros de la perla azul nunca son del mismo color.",
    },
  },
  {
    slug: "sahara-silence",
    accent: "#D4A373",
    date: "2025-11-08",
    readTime: { en: "5 min read", fr: "5 min de lecture", es: "5 min de lectura" },
    image: "https://images.unsplash.com/photo-1542401886-65d6c61db217?auto=format&fit=crop&w=1400&q=80",
    title: { en: "A field guide to Saharan silence", fr: "Guide de terrain du silence saharien", es: "Guía de campo del silencio sahariano" },
    excerpt: {
      en: "The first time you sit on a high dune and listen, you hear nothing. The third night, you hear everything — sand ticking, blood pumping, your own breath.",
      fr: "La première fois que vous écoutez du haut d'une dune, vous n'entendez rien. La troisième nuit, vous entendez tout — le sable, votre sang, votre souffle.",
      es: "La primera vez que escuchas en lo alto de una duna, no oyes nada. La tercera noche, lo oyes todo — la arena, tu sangre, tu propia respiración.",
    },
  },
];

// Map points (lat, lng)
export const MAP_POINTS = [
  { id: "marrakech",   name: "Marrakech",       coords: [31.6295, -7.9811] },
  { id: "fez",         name: "Fez",             coords: [34.0181, -5.0078] },
  { id: "chefchaouen", name: "Chefchaouen",     coords: [35.1714, -5.2697] },
  { id: "merzouga",    name: "Merzouga · Erg Chebbi", coords: [31.0995, -4.0128] },
  { id: "mhamid",      name: "Mhamid · Erg Chigaga",  coords: [29.8266, -5.7196] },
  { id: "essaouira",   name: "Essaouira",       coords: [31.5085, -9.7595] },
  { id: "ait-ben",     name: "Aït Benhaddou",   coords: [31.0473, -7.1294] },
  { id: "imlil",       name: "Imlil · Toubkal", coords: [31.1369, -7.9230] },
  { id: "ouarzazate",  name: "Ouarzazate",      coords: [30.9189, -6.8934] },
  { id: "tangier",     name: "Tangier",         coords: [35.7595, -5.8340] },
  { id: "meknes",      name: "Meknès",          coords: [33.8935, -5.5473] },
  { id: "ait-bougu",   name: "Aït Bouguemez",   coords: [31.6700, -6.3300] },
];
