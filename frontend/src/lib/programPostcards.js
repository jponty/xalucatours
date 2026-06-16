/* ============================================================
   programPostcards — handwritten "travel postcards" for every
   individual trip page. Each itinerary shows 3 unique postcards
   written in first person, as if a traveller had sent them home
   during or after the journey. Trilingual (es / en / fr).

   Content is organised by destination CORRIDOR (the real route a
   trip follows) so every postcard reflects the actual places,
   landscapes, people and experiences of that specific journey.
   Each routeId is mapped to its corridor in ROUTE_FAMILY.

   Each postcard focuses on a different aspect of the trip:
     1) landscapes & nature   2) culture, people & food
     3) emotions & unexpected discoveries
============================================================ */
import IMG from "@/lib/imageBank";

const T = (es, en, fr) => ({ es, en, fr });

/* ---------- Corridor postcard sets ---------- */
const FAMILIES = {
  /* A — South: Ouarzazate, Aït Ben Haddou, Dades/Todra gorges, Erg Chebbi */
  desertAtlas: [
    {
      label: T("Postal desde Merzouga", "A postcard from Merzouga", "Une carte postale de Merzouga"),
      tagline: T("El mar de dunas", "The sea of dunes", "La mer de dunes"),
      greeting: T("Hola desde el desierto,", "Hello from the desert,", "Bonjour du désert,"),
      body: [T(
        "Subimos a un dromedario justo cuando el sol bajaba sobre Erg Chebbi y, de pronto, el mundo se quedó en silencio. Esta noche dormimos en una jaima, bajo más estrellas de las que había visto en mi vida.",
        "We climbed onto a camel just as the sun was sinking over Erg Chebbi and, suddenly, the world fell silent. Tonight we sleep in a tent, under more stars than I've ever seen.",
        "Nous sommes montés à dos de dromadaire juste au coucher du soleil sur l'Erg Chebbi et, soudain, le monde s'est tu. Ce soir nous dormons sous une tente, sous plus d'étoiles que je n'en ai jamais vu.",
      )],
      closing: T("Con arena en los zapatos,", "Still with sand in my shoes,", "Avec du sable dans les chaussures,"),
      signature: "Marta",
      postmark: "MERZOUGA",
      stamp: IMG.dunes,
      stamp_caption: T("Erg Chebbi · Sáhara", "Erg Chebbi · Sahara", "Erg Chebbi · Sahara"),
    },
    {
      label: T("Postal desde Aït Ben Haddou", "A postcard from Aït Ben Haddou", "Une carte postale d'Aït Ben Haddou"),
      tagline: T("Kasbahs de barro", "Adobe kasbahs", "Kasbahs de terre"),
      greeting: T("Querida familia,", "Dear family,", "Chère famille,"),
      body: [T(
        "Hoy recorrimos la kasbah de adobe de Aït Ben Haddou y por la tarde nos invitaron a té con menta en una casa bereber. En Khamlia escuchamos tambores gnawa hasta perder la noción del tiempo. Nunca me sentí tan bienvenida tan lejos de casa.",
        "Today we wandered the adobe kasbah of Aït Ben Haddou and in the afternoon a Berber family invited us in for mint tea. In Khamlia we listened to Gnawa drums until we lost track of time. I've never felt so welcome so far from home.",
        "Aujourd'hui nous avons parcouru la kasbah de terre d'Aït Ben Haddou et, l'après-midi, une famille berbère nous a invités à boire le thé à la menthe. À Khamlia, nous avons écouté les tambours gnawa jusqu'à en oublier l'heure. Je ne me suis jamais sentie aussi bien accueillie si loin de chez moi.",
      )],
      closing: T("Shukran por tanto,", "Shukran for everything,", "Shukran pour tout,"),
      signature: "Lucía",
      postmark: "OUARZAZATE",
      stamp: IMG.kasbahArch,
      stamp_caption: T("Aït Ben Haddou · Ouarzazate", "Aït Ben Haddou · Ouarzazate", "Aït Ben Haddou · Ouarzazate"),
    },
    {
      label: T("Postal desde las gargantas", "A postcard from the gorges", "Une carte postale des gorges"),
      tagline: T("Roca y palmeras", "Rock and palms", "Roches et palmiers"),
      greeting: T("A quien quiera escapar,", "To anyone longing to escape,", "À qui rêve de s'évader,"),
      body: [T(
        "La carretera entre las gargantas del Todra y el Dades fue una sorpresa tras otra: paredes de roca rojiza, palmerales escondidos y pueblos colgados de la montaña. Vine buscando desierto y me llevo, además, montañas que no esperaba.",
        "The road between the Todra and Dades gorges was one surprise after another: walls of red rock, hidden palm groves and villages clinging to the mountain. I came looking for desert and I'm leaving with mountains I never expected too.",
        "La route entre les gorges du Todra et du Dadès n'était que surprises : parois de roche rouge, palmeraies cachées et villages accrochés à la montagne. J'étais venu pour le désert et je repars aussi avec des montagnes inattendues.",
      )],
      closing: T("Volveré, seguro,", "I'll be back, for sure,", "Je reviendrai, c'est sûr,"),
      signature: "Diego",
      postmark: "DADES",
      stamp: IMG.atlasValley,
      stamp_caption: T("Gargantas del Dades · Atlas", "Dades Gorges · Atlas", "Gorges du Dadès · Atlas"),
    },
  ],

  /* B — Marrakech ↔ Erg Chebbi: Atlas pass, Aït Ben Haddou, dunes */
  marrakechErg: [
    {
      label: T("Postal desde el Alto Atlas", "A postcard from the High Atlas", "Une carte postale du Haut Atlas"),
      tagline: T("Del Atlas al Sáhara", "From Atlas to Sahara", "De l'Atlas au Sahara"),
      greeting: T("Hola desde la carretera,", "Hello from the road,", "Bonjour de la route,"),
      body: [T(
        "Salimos de Marrakech y cruzamos el Alto Atlas por el puerto de Tizi n'Tichka, entre curvas, nieve en las cumbres y pueblos de adobe. Dos días después montábamos en dromedario hacia las dunas de Erg Chebbi. ¡De la montaña al desierto en un solo viaje!",
        "We left Marrakech and crossed the High Atlas over the Tizi n'Tichka pass — hairpin bends, snow on the peaks and adobe villages. Two days later we were riding camels towards the dunes of Erg Chebbi. From mountains to desert in a single trip!",
        "Nous avons quitté Marrakech et franchi le Haut Atlas par le col du Tizi n'Tichka, entre virages, neige sur les sommets et villages de terre. Deux jours plus tard, nous montions à dos de dromadaire vers les dunes de l'Erg Chebbi. De la montagne au désert en un seul voyage !",
      )],
      closing: T("Del Atlas al Sáhara,", "From the Atlas to the Sahara,", "De l'Atlas au Sahara,"),
      signature: "Carlos",
      postmark: "TIZI N'TICHKA",
      stamp: IMG.atlasSnowy,
      stamp_caption: T("Tizi n'Tichka · Alto Atlas", "Tizi n'Tichka · High Atlas", "Tizi n'Tichka · Haut Atlas"),
    },
    {
      label: T("Postal desde Marrakech", "A postcard from Marrakech", "Une carte postale de Marrakech"),
      tagline: T("La ciudad roja", "The red city", "La ville rouge"),
      greeting: T("Querido diario,", "Dear diary,", "Cher journal,"),
      body: [T(
        "Marrakech es pura energía: nos perdimos por los zocos entre especias, lámparas y alfombras, y al anochecer cenamos en Jemaa el-Fna entre humo, música y cuentacuentos. Probé un tajín de cordero con ciruelas que no olvidaré.",
        "Marrakech is pure energy: we got lost in the souks among spices, lanterns and carpets, and at dusk we had dinner in Jemaa el-Fna amid smoke, music and storytellers. I tried a lamb tagine with prunes I'll never forget.",
        "Marrakech, c'est l'énergie pure : nous nous sommes perdus dans les souks parmi les épices, les lampes et les tapis, et à la nuit tombée nous avons dîné sur la Jemaa el-Fna, entre fumée, musique et conteurs. J'ai goûté un tajine d'agneau aux pruneaux inoubliable.",
      )],
      closing: T("Con el corazón acelerado,", "With my heart racing,", "Le cœur battant,"),
      signature: "Ana",
      postmark: "MARRAKECH",
      stamp: IMG.medinaPeople,
      stamp_caption: T("Jemaa el-Fna · Marrakech", "Jemaa el-Fna · Marrakech", "Jemaa el-Fna · Marrakech"),
    },
    {
      label: T("Postal desde el campamento", "A postcard from the camp", "Une carte postale du campement"),
      tagline: T("Amanecer en las dunas", "Sunrise in the dunes", "Lever de soleil sur les dunes"),
      greeting: T("Para quien sueña con el desierto,", "For anyone who dreams of the desert,", "Pour qui rêve du désert,"),
      body: [T(
        "Me desperté antes del amanecer y salí descalzo de la jaima. El desierto estaba helado y en completo silencio, hasta que el sol asomó sobre las dunas y todo se volvió oro. No pensé que un lugar tan vacío pudiera llenarte tanto por dentro.",
        "I woke before dawn and stepped barefoot out of the tent. The desert was freezing and utterly silent, until the sun rose over the dunes and everything turned to gold. I never thought a place so empty could fill you up so much inside.",
        "Je me suis réveillé avant l'aube et je suis sorti pieds nus de la tente. Le désert était glacé et totalement silencieux, jusqu'à ce que le soleil surgisse sur les dunes et que tout devienne or. Je n'imaginais pas qu'un lieu aussi vide puisse autant vous remplir.",
      )],
      closing: T("Bajo un cielo infinito,", "Under an endless sky,", "Sous un ciel infini,"),
      signature: "Javier",
      postmark: "ERG CHEBBI",
      stamp: IMG.camelDunes,
      stamp_caption: T("Amanecer en Erg Chebbi", "Sunrise at Erg Chebbi", "Aube sur l'Erg Chebbi"),
    },
  ],

  /* C — Marrakech round loop to the Sahara via the Draa valley */
  marrakechLoop: [
    {
      label: T("Postal desde el Valle del Draa", "A postcard from the Draa Valley", "Une carte postale de la vallée du Drâa"),
      tagline: T("El palmeral sin fin", "The endless palm grove", "La palmeraie sans fin"),
      greeting: T("Hola desde el sur,", "Hello from the south,", "Bonjour du sud,"),
      body: [T(
        "Bajamos desde Marrakech hacia Zagora siguiendo el Valle del Draa, el palmeral más largo de Marruecos: kilómetros de palmeras, kasbahs de barro y un cartel que decía 'Tombuctú, 52 días'. El desierto empieza mucho antes de las dunas.",
        "From Marrakech we drove south to Zagora along the Draa Valley, the longest palm grove in Morocco: miles of palms, mud kasbahs and a sign reading 'Timbuktu, 52 days'. The desert begins long before the dunes.",
        "Depuis Marrakech, nous sommes descendus vers Zagora le long de la vallée du Drâa, la plus longue palmeraie du Maroc : des kilomètres de palmiers, des kasbahs de terre et un panneau indiquant « Tombouctou, 52 jours ». Le désert commence bien avant les dunes.",
      )],
      closing: T("Rumbo a las estrellas,", "Heading for the stars,", "Cap sur les étoiles,"),
      signature: "Elena",
      postmark: "ZAGORA",
      stamp: IMG.kasbahArch,
      stamp_caption: T("Valle del Draa · Zagora", "Draa Valley · Zagora", "Vallée du Drâa · Zagora"),
    },
    {
      label: T("Postal desde Marrakech", "A postcard from Marrakech", "Une carte postale de Marrakech"),
      tagline: T("Té y zocos", "Tea and souks", "Thé et souks"),
      greeting: T("Querida abuela,", "Dear grandma,", "Chère mamie,"),
      body: [T(
        "Te escribo desde un café con vistas a la Koutoubia. Estos días hemos comido pan recién hecho en hornos de barro, compartido té con una familia nómada y regateado en los zocos entre risas. La gente aquí te recibe como si te conociera de siempre.",
        "I'm writing from a café looking out at the Koutoubia. These days we've eaten bread fresh from clay ovens, shared tea with a nomad family and haggled in the souks amid laughter. People here welcome you as if they'd always known you.",
        "Je t'écris d'un café avec vue sur la Koutoubia. Ces jours-ci nous avons mangé du pain tout juste sorti des fours en terre, partagé le thé avec une famille nomade et marchandé dans les souks en riant. Ici, les gens vous accueillent comme s'ils vous connaissaient depuis toujours.",
      )],
      closing: T("Te traigo mil historias,", "Bringing you a thousand stories,", "Je te rapporte mille histoires,"),
      signature: "Pablo",
      postmark: "MARRAKECH",
      stamp: IMG.koutoubia,
      stamp_caption: T("Koutoubia · Marrakech", "Koutoubia · Marrakech", "Koutoubia · Marrakech"),
    },
    {
      label: T("Postal desde el vivac", "A postcard from the bivouac", "Une carte postale du bivouac"),
      tagline: T("Fuego y tambores", "Fire and drums", "Feu et tambours"),
      greeting: T("Para los que no temen perderse,", "For those unafraid to get lost,", "Pour ceux qui n'ont pas peur de se perdre,"),
      body: [T(
        "Pasamos la noche en un campamento entre las dunas, alrededor del fuego, escuchando tambores y mirando estrellas fugaces. Volvemos mañana a Marrakech, pero algo de este silencio se viene conmigo. Hay viajes que terminan y otros que se quedan.",
        "We spent the night at a camp among the dunes, around the fire, listening to drums and watching shooting stars. We head back to Marrakech tomorrow, but some of this silence is coming with me. Some journeys end and others stay.",
        "Nous avons passé la nuit dans un campement au milieu des dunes, autour du feu, à écouter les tambours et à regarder les étoiles filantes. Demain nous repartons vers Marrakech, mais un peu de ce silence m'accompagne. Certains voyages se terminent, d'autres restent.",
      )],
      closing: T("Con arena en el alma,", "With sand in my soul,", "Avec du sable dans l'âme,"),
      signature: "Sara",
      postmark: "SÁHARA",
      stamp: IMG.dunes,
      stamp_caption: T("Campamento en el Sáhara", "Camp in the Sahara", "Campement dans le Sahara"),
    },
  ],

  /* D — Grand crossing Marrakech ↔ Fez through the desert & Middle Atlas */
  grandCrossing: [
    {
      label: T("Postal desde la travesía", "A postcard from the crossing", "Une carte postale de la traversée"),
      tagline: T("Un país en un viaje", "A country in one trip", "Un pays en un voyage"),
      greeting: T("Hola desde el camino,", "Hello from the road,", "Bonjour de la route,"),
      body: [T(
        "Este viaje es como recorrer varios países en uno: cruzamos el Atlas nevado, dormimos entre las dunas de Erg Chebbi y subimos hasta los bosques de cedros de Ifrane, donde nos cruzamos con monos. Marruecos cambia de paisaje cada pocas horas.",
        "This trip is like crossing several countries in one: we crossed the snowy Atlas, slept among the dunes of Erg Chebbi and climbed up to the cedar forests of Ifrane, where we met monkeys. Morocco changes landscape every few hours.",
        "Ce voyage, c'est comme traverser plusieurs pays en un : nous avons franchi l'Atlas enneigé, dormi parmi les dunes de l'Erg Chebbi et grimpé jusqu'aux forêts de cèdres d'Ifrane, où nous avons croisé des singes. Le Maroc change de paysage toutes les quelques heures.",
      )],
      closing: T("De punta a punta del país,", "From one end of the country to the other,", "D'un bout à l'autre du pays,"),
      signature: "Marcos",
      postmark: "MARRUECOS",
      stamp: IMG.atlasMisty,
      stamp_caption: T("Del Atlas al desierto", "From the Atlas to the desert", "De l'Atlas au désert"),
    },
    {
      label: T("Postal desde Fez", "A postcard from Fez", "Une carte postale de Fès"),
      tagline: T("La medina más viva", "The most alive medina", "La médina la plus vivante"),
      greeting: T("Querida familia,", "Dear family,", "Chère famille,"),
      body: [T(
        "Hoy nos perdimos por la medina de Fez, la más antigua y laberíntica del mundo: miles de callejones, artesanos del cobre y las famosas curtidurías con sus tinas de colores. Un niño nos guió hasta una terraza para verlas desde arriba. Valió cada paso.",
        "Today we got lost in the medina of Fez, the oldest and most labyrinthine in the world: thousands of alleys, copper craftsmen and the famous tanneries with their coloured vats. A boy led us up to a terrace to see them from above. Worth every step.",
        "Aujourd'hui nous nous sommes perdus dans la médina de Fès, la plus ancienne et la plus labyrinthique du monde : des milliers de ruelles, des artisans du cuivre et les célèbres tanneries aux cuves colorées. Un enfant nous a menés sur une terrasse pour les voir d'en haut. Cela valait chaque pas.",
      )],
      closing: T("Maravillada con cada rincón,", "Amazed at every corner,", "Émerveillée à chaque coin de rue,"),
      signature: "Carmen",
      postmark: "FEZ",
      stamp: IMG.marketBaskets,
      stamp_caption: T("Medina de Fez", "Medina of Fez", "Médina de Fès"),
    },
    {
      label: T("Postal desde Merzouga", "A postcard from Merzouga", "Une carte postale de Merzouga"),
      tagline: T("Un alto en el desierto", "A pause in the desert", "Une halte dans le désert"),
      greeting: T("Para quien busca aventura,", "For anyone seeking adventure,", "Pour qui cherche l'aventure,"),
      body: [T(
        "En mitad de la travesía paramos a dormir en el desierto. Después de tantos kilómetros, sentarnos en silencio sobre una duna a ver ponerse el sol fue el momento más bonito del viaje. Cruzar Marruecos de sur a norte te cambia un poco por dentro.",
        "Halfway through the crossing we stopped to sleep in the desert. After so many miles, sitting in silence on a dune to watch the sun go down was the most beautiful moment of the trip. Crossing Morocco from south to north changes you a little inside.",
        "Au milieu de la traversée, nous nous sommes arrêtés pour dormir dans le désert. Après tant de kilomètres, s'asseoir en silence sur une dune pour regarder le soleil se coucher fut le plus beau moment du voyage. Traverser le Maroc du sud au nord vous transforme un peu.",
      )],
      closing: T("Con la mochila llena de recuerdos,", "With a backpack full of memories,", "Le sac à dos rempli de souvenirs,"),
      signature: "Hugo",
      postmark: "MERZOUGA",
      stamp: IMG.camelCaravan,
      stamp_caption: T("Erg Chebbi · Merzouga", "Erg Chebbi · Merzouga", "Erg Chebbi · Merzouga"),
    },
  ],

  /* E — Imperial cities: Fez, Meknes, Volubilis, Rabat */
  imperial: [
    {
      label: T("Postal desde Volubilis", "A postcard from Volubilis", "Une carte postale de Volubilis"),
      tagline: T("Viajando en el tiempo", "Travelling through time", "Voyage dans le temps"),
      greeting: T("Hola desde el pasado,", "Hello from the past,", "Bonjour du passé,"),
      body: [T(
        "Hoy paseamos entre las ruinas romanas de Volubilis, con sus mosaicos intactos y las cigüeñas anidando sobre las columnas. Después llegamos a Meknes y sus murallas imperiales. Marruecos no es solo desierto: también es historia milenaria.",
        "Today we walked among the Roman ruins of Volubilis, with its mosaics still intact and storks nesting on the columns. Then we reached Meknes and its imperial walls. Morocco isn't only desert — it's also thousands of years of history.",
        "Aujourd'hui nous avons déambulé parmi les ruines romaines de Volubilis, aux mosaïques intactes et aux cigognes nichant sur les colonnes. Puis nous avons rejoint Meknès et ses remparts impériaux. Le Maroc n'est pas que désert : c'est aussi une histoire millénaire.",
      )],
      closing: T("Viajando en el tiempo,", "Travelling through time,", "En voyage dans le temps,"),
      signature: "Teresa",
      postmark: "MEKNES",
      stamp: IMG.kasbahGate,
      stamp_caption: T("Volubilis · Meknes", "Volubilis · Meknes", "Volubilis · Meknès"),
    },
    {
      label: T("Postal desde Fez", "A postcard from Fez", "Une carte postale de Fès"),
      tagline: T("Artesanía y té", "Crafts and tea", "Artisanat et thé"),
      greeting: T("Querido amor,", "My love,", "Mon amour,"),
      body: [T(
        "Te escribo desde un riad escondido en la medina de Fez. Hemos visto a los artesanos trabajar el cuero y la cerámica azul como hace siglos, y nos invitaron a pastela y té en una casa preciosa. La hospitalidad marroquí es algo que hay que vivir.",
        "I'm writing from a riad tucked away in the medina of Fez. We watched craftsmen work leather and blue ceramics as they have for centuries, and we were invited for pastilla and tea in a beautiful home. Moroccan hospitality is something you have to live.",
        "Je t'écris d'un riad caché dans la médina de Fès. Nous avons vu les artisans travailler le cuir et la céramique bleue comme il y a des siècles, et on nous a invités à déguster pastilla et thé dans une superbe maison. L'hospitalité marocaine se vit, tout simplement.",
      )],
      closing: T("Contando los días para contártelo,", "Counting the days to tell you all,", "J'ai hâte de tout te raconter,"),
      signature: "Nuria",
      postmark: "FEZ",
      stamp: IMG.riadFountain,
      stamp_caption: T("Riad en la medina de Fez", "Riad in the Fez medina", "Riad dans la médina de Fès"),
    },
    {
      label: T("Postal desde Rabat", "A postcard from Rabat", "Une carte postale de Rabat"),
      tagline: T("Azul frente al mar", "Blue by the sea", "Bleu face à la mer"),
      greeting: T("Para quien ama las ciudades,", "For anyone who loves cities,", "Pour qui aime les villes,"),
      body: [T(
        "Rabat nos sorprendió: jardines, la kasbah de los Oudayas pintada de azul y blanco frente al océano y un ambiente tranquilo y elegante. Esperaba caos y encontré calma. Cada ciudad imperial tiene su propio carácter.",
        "Rabat surprised us: gardens, the Kasbah of the Oudayas painted blue and white facing the ocean, and a calm, elegant atmosphere. I expected chaos and found calm. Each imperial city has its own character.",
        "Rabat nous a surpris : des jardins, la kasbah des Oudayas peinte en bleu et blanc face à l'océan et une atmosphère calme et élégante. Je m'attendais au chaos et j'ai trouvé le calme. Chaque ville impériale a son propre caractère.",
      )],
      closing: T("Enamorado de cada ciudad,", "In love with every city,", "Amoureux de chaque ville,"),
      signature: "Andrés",
      postmark: "RABAT",
      stamp: IMG.chefCourtyard,
      stamp_caption: T("Kasbah de los Oudayas · Rabat", "Kasbah of the Oudayas · Rabat", "Kasbah des Oudayas · Rabat"),
    },
  ],

  /* F — Imperial cities + Chefchaouen & the Rif */
  imperialRif: [
    {
      label: T("Postal desde Chefchaouen", "A postcard from Chefchaouen", "Une carte postale de Chefchaouen"),
      tagline: T("La ciudad azul", "The blue city", "La ville bleue"),
      greeting: T("Hola desde la ciudad azul,", "Hello from the blue city,", "Bonjour de la ville bleue,"),
      body: [T(
        "Chefchaouen es un sueño en mil tonos de azul: callejones, escaleras y puertas pintadas, gatos durmiendo al sol y las montañas del Rif al fondo. Subimos hasta la mezquita española al atardecer y la ciudad entera se volvió dorada y azul.",
        "Chefchaouen is a dream in a thousand shades of blue: alleys, steps and painted doors, cats asleep in the sun and the Rif mountains beyond. We climbed to the Spanish mosque at dusk and the whole town turned gold and blue.",
        "Chefchaouen est un rêve en mille nuances de bleu : ruelles, escaliers et portes peintes, chats endormis au soleil et montagnes du Rif en arrière-plan. Nous sommes montés à la mosquée espagnole au crépuscule et toute la ville est devenue dorée et bleue.",
      )],
      closing: T("Pintando recuerdos,", "Painting memories,", "À peindre des souvenirs,"),
      signature: "Laura",
      postmark: "CHEFCHAOUEN",
      stamp: IMG.chefBlueCity,
      stamp_caption: T("Chefchaouen · El Rif", "Chefchaouen · The Rif", "Chefchaouen · Le Rif"),
    },
    {
      label: T("Postal desde Fez", "A postcard from Fez", "Une carte postale de Fès"),
      tagline: T("Historia y sabores", "History and flavours", "Histoire et saveurs"),
      greeting: T("Querida familia,", "Dear family,", "Chère famille,"),
      body: [T(
        "Recorrimos la medina de Fez y las ruinas de Volubilis con un guía que parecía saberlo todo. Comimos un cuscús casero que nos preparó una familia y terminamos bailando en una boda a la que nos invitaron por casualidad. ¡Qué generosa es esta gente!",
        "We explored the medina of Fez and the ruins of Volubilis with a guide who seemed to know everything. We ate a homemade couscous a family cooked for us and ended up dancing at a wedding we were invited to by chance. How generous these people are!",
        "Nous avons parcouru la médina de Fès et les ruines de Volubilis avec un guide qui semblait tout savoir. Nous avons mangé un couscous maison préparé par une famille et terminé en dansant à un mariage où l'on nous avait invités par hasard. Quelle générosité !",
      )],
      closing: T("Con el estómago y el corazón llenos,", "With a full stomach and a full heart,", "Le ventre et le cœur pleins,"),
      signature: "Rosa",
      postmark: "FEZ",
      stamp: IMG.medinaPeople,
      stamp_caption: T("Medina de Fez", "Medina of Fez", "Médina de Fès"),
    },
    {
      label: T("Postal desde el Rif", "A postcard from the Rif", "Une carte postale du Rif"),
      tagline: T("Calma en azul", "Calm in blue", "Le calme en bleu"),
      greeting: T("Para quien busca calma,", "For anyone seeking calm,", "Pour qui cherche le calme,"),
      body: [T(
        "Me levanté temprano para ver Chefchaouen sin gente y fue mágico: solo el sonido de mis pasos por las calles azules y el olor a pan recién hecho. Hay lugares que parecen pintados a mano. Este es uno de ellos.",
        "I got up early to see Chefchaouen empty and it was magical: just the sound of my steps through the blue streets and the smell of fresh bread. Some places look hand-painted. This is one of them.",
        "Je me suis levé tôt pour voir Chefchaouen sans personne et ce fut magique : juste le bruit de mes pas dans les rues bleues et l'odeur du pain frais. Certains lieux semblent peints à la main. Celui-ci en fait partie.",
      )],
      closing: T("Con paz en la mirada,", "With peace in my eyes,", "La paix dans le regard,"),
      signature: "Iván",
      postmark: "CHEFCHAOUEN",
      stamp: IMG.chefAlley,
      stamp_caption: T("Callejón azul · Chefchaouen", "Blue alley · Chefchaouen", "Ruelle bleue · Chefchaouen"),
    },
  ],

  /* G — North loop: Tanger, Asilah, Chefchaouen, Fez */
  north: [
    {
      label: T("Postal desde Tánger", "A postcard from Tangier", "Une carte postale de Tanger"),
      tagline: T("Entre dos orillas", "Between two shores", "Entre deux rives"),
      greeting: T("Hola desde el norte,", "Hello from the north,", "Bonjour du nord,"),
      body: [T(
        "Desde Tánger se ven a la vez dos continentes: el estrecho y, al otro lado, España. Paseamos por la medina blanca asomada al mar y por las murallas de Asilah, con sus murales de colores. El norte de Marruecos huele a sal y a aventura.",
        "From Tangier you can see two continents at once: the strait and, on the other side, Spain. We strolled the white medina overlooking the sea and the walls of Asilah with their colourful murals. Northern Morocco smells of salt and adventure.",
        "Depuis Tanger, on aperçoit deux continents à la fois : le détroit et, de l'autre côté, l'Espagne. Nous avons flâné dans la médina blanche surplombant la mer et le long des remparts d'Asilah, ornés de fresques colorées. Le nord du Maroc sent le sel et l'aventure.",
      )],
      closing: T("Entre dos orillas,", "Between two shores,", "Entre deux rives,"),
      signature: "Clara",
      postmark: "TÁNGER",
      stamp: IMG.essaouiraPort,
      stamp_caption: T("El estrecho · Tánger", "The strait · Tangier", "Le détroit · Tanger"),
    },
    {
      label: T("Postal desde Chefchaouen", "A postcard from Chefchaouen", "Une carte postale de Chefchaouen"),
      tagline: T("Laberinto azul", "Blue labyrinth", "Labyrinthe bleu"),
      greeting: T("Querido amigo,", "Dear friend,", "Cher ami,"),
      body: [T(
        "Chefchaouen nos atrapó con su laberinto azul y su gente amable, que nos invitaba a té en cada esquina. Luego, en Fez, nos perdimos felizmente por la medina entre artesanos y aromas a especias. El norte es auténtico, tranquilo y muy hospitalario.",
        "Chefchaouen captured us with its blue labyrinth and its kind people, offering us tea on every corner. Then, in Fez, we happily got lost in the medina among craftsmen and the scent of spices. The north is authentic, peaceful and so welcoming.",
        "Chefchaouen nous a séduits avec son labyrinthe bleu et ses habitants chaleureux, qui nous offraient le thé à chaque coin de rue. Puis, à Fès, nous nous sommes joyeusement perdus dans la médina parmi les artisans et les parfums d'épices. Le nord est authentique, paisible et très accueillant.",
      )],
      closing: T("Con mil postales en la cabeza,", "With a thousand postcards in my head,", "Avec mille cartes postales en tête,"),
      signature: "Raúl",
      postmark: "CHEFCHAOUEN",
      stamp: IMG.chefStreet,
      stamp_caption: T("Chefchaouen · El Rif", "Chefchaouen · The Rif", "Chefchaouen · Le Rif"),
    },
    {
      label: T("Postal desde Asilah", "A postcard from Asilah", "Une carte postale d'Asilah"),
      tagline: T("Sabor a mar", "A taste of the sea", "Un goût de mer"),
      greeting: T("Para quien ama el mar,", "For anyone who loves the sea,", "Pour qui aime la mer,"),
      body: [T(
        "Terminamos el día viendo la puesta de sol sobre el Atlántico desde las murallas de Asilah, con música saliendo de un café cercano. No esperaba que el norte de Marruecos fuera tan luminoso y relajado. Me llevo el sonido de las olas.",
        "We ended the day watching the sunset over the Atlantic from the walls of Asilah, with music drifting from a nearby café. I didn't expect northern Morocco to be so bright and relaxed. I'm taking the sound of the waves with me.",
        "Nous avons terminé la journée à regarder le coucher de soleil sur l'Atlantique depuis les remparts d'Asilah, une musique s'échappant d'un café voisin. Je ne m'attendais pas à un nord du Maroc si lumineux et détendu. J'emporte avec moi le bruit des vagues.",
      )],
      closing: T("Con sabor a mar,", "With a taste of the sea,", "Avec un goût de mer,"),
      signature: "Marina",
      postmark: "ASILAH",
      stamp: IMG.chefCourtyard,
      stamp_caption: T("Asilah · Costa atlántica", "Asilah · Atlantic coast", "Asilah · Côte atlantique"),
    },
  ],

  /* H — Grand north-to-south: Tanger → Chefchaouen → Fez → Sahara → Marrakech */
  grandNorthSouth: [
    {
      label: T("Postal desde Marruecos", "A postcard from Morocco", "Une carte postale du Maroc"),
      tagline: T("De Tánger a Marrakech", "From Tangier to Marrakech", "De Tanger à Marrakech"),
      greeting: T("Hola desde el gran viaje,", "Hello from the grand journey,", "Bonjour du grand voyage,"),
      body: [T(
        "Empezamos en Tánger mirando el estrecho, pasamos por el azul de Chefchaouen y la medina de Fez, cruzamos el Atlas y acabamos sobre las dunas del Sáhara camino de Marrakech. Hemos recorrido el país entero, y cada día parecía un país distinto.",
        "We started in Tangier looking across the strait, passed through the blue of Chefchaouen and the medina of Fez, crossed the Atlas and ended up on the dunes of the Sahara on the way to Marrakech. We've travelled the whole country, and each day felt like a different one.",
        "Nous avons commencé à Tanger face au détroit, traversé le bleu de Chefchaouen et la médina de Fès, franchi l'Atlas et fini sur les dunes du Sahara en route vers Marrakech. Nous avons parcouru le pays entier, et chaque jour semblait être un pays différent.",
      )],
      closing: T("De Tánger a Marrakech,", "From Tangier to Marrakech,", "De Tanger à Marrakech,"),
      signature: "Gonzalo",
      postmark: "MARRUECOS",
      stamp: IMG.atlasSnowy,
      stamp_caption: T("De norte a sur", "From north to south", "Du nord au sud"),
    },
    {
      label: T("Postal desde Fez", "A postcard from Fez", "Une carte postale de Fès"),
      tagline: T("Mesa marroquí", "A Moroccan table", "Une table marocaine"),
      greeting: T("Querida familia,", "Dear family,", "Chère famille,"),
      body: [T(
        "En este viaje hemos comido como reyes: pastela, tajines, cuscús de los viernes y dulces con té a todas horas. En Fez nos guiaron por la medina y en Chefchaouen nos invitaron a casa de una familia. Cuanto más bajamos hacia el sur, más nos enamoramos.",
        "On this trip we've eaten like royalty: pastilla, tagines, Friday couscous and sweets with tea at all hours. In Fez they guided us through the medina and in Chefchaouen a family invited us home. The further south we go, the more we fall in love.",
        "Pendant ce voyage, nous avons mangé comme des rois : pastilla, tajines, couscous du vendredi et pâtisseries avec le thé à toute heure. À Fès on nous a guidés dans la médina et à Chefchaouen une famille nous a reçus chez elle. Plus nous descendons vers le sud, plus nous tombons amoureux.",
      )],
      closing: T("Con el corazón lleno,", "With a full heart,", "Le cœur plein,"),
      signature: "Patricia",
      postmark: "FEZ",
      stamp: IMG.marketBaskets,
      stamp_caption: T("Medina de Fez", "Medina of Fez", "Médina de Fès"),
    },
    {
      label: T("Postal desde el Sáhara", "A postcard from the Sahara", "Une carte postale du Sahara"),
      tagline: T("La gran despedida", "The grand farewell", "Le grand adieu"),
      greeting: T("Para los soñadores,", "For the dreamers,", "Pour les rêveurs,"),
      body: [T(
        "Tras cruzar todo Marruecos, la última gran parada fue el desierto: dromedarios, dunas infinitas y una noche bajo las estrellas que no olvidaré. Mañana llegamos a Marrakech y se acaba el viaje. Qué manera tan bonita de despedirse de un país.",
        "After crossing all of Morocco, the last great stop was the desert: camels, endless dunes and a night under the stars I'll never forget. Tomorrow we reach Marrakech and the trip ends. What a beautiful way to say goodbye to a country.",
        "Après avoir traversé tout le Maroc, la dernière grande étape fut le désert : dromadaires, dunes infinies et une nuit sous les étoiles que je n'oublierai jamais. Demain nous arrivons à Marrakech et le voyage s'achève. Quelle belle façon de dire au revoir à un pays.",
      )],
      closing: T("Con arena en los zapatos,", "Still with sand in my shoes,", "Avec du sable dans les chaussures,"),
      signature: "Álvaro",
      postmark: "SÁHARA",
      stamp: IMG.camelDunes,
      stamp_caption: T("Erg Chebbi · Sáhara", "Erg Chebbi · Sahara", "Erg Chebbi · Sahara"),
    },
  ],

  /* I — Marrakech + Essaouira (Atlantic coast) */
  essaouira: [
    {
      label: T("Postal desde Essaouira", "A postcard from Essaouira", "Une carte postale d'Essaouira"),
      tagline: T("Viento y gaviotas", "Wind and gulls", "Vent et mouettes"),
      greeting: T("Hola desde la costa,", "Hello from the coast,", "Bonjour de la côte,"),
      body: [T(
        "Essaouira es viento, gaviotas y barcas azules en el puerto. Paseamos por sus murallas frente al Atlántico, comimos pescado recién traído del mar y por el camino vimos cabras subidas a los árboles de argán. ¡Una estampa increíble!",
        "Essaouira is wind, gulls and blue boats in the port. We walked its ramparts facing the Atlantic, ate fish straight from the sea and, on the way, saw goats up in the argan trees. What an incredible sight!",
        "Essaouira, c'est le vent, les mouettes et les barques bleues du port. Nous avons longé ses remparts face à l'Atlantique, mangé du poisson tout juste pêché et, en chemin, vu des chèvres perchées dans les arganiers. Quel spectacle incroyable !",
      )],
      closing: T("Con el pelo lleno de sal,", "With salt in my hair,", "Les cheveux pleins de sel,"),
      signature: "Beatriz",
      postmark: "ESSAOUIRA",
      stamp: IMG.essaouiraPort,
      stamp_caption: T("Puerto de Essaouira", "Port of Essaouira", "Port d'Essaouira"),
    },
    {
      label: T("Postal desde Marrakech", "A postcard from Marrakech", "Une carte postale de Marrakech"),
      tagline: T("Magia al anochecer", "Magic at dusk", "Magie au crépuscule"),
      greeting: T("Querido diario,", "Dear diary,", "Cher journal,"),
      body: [T(
        "Marrakech nos recibió con sus zocos, sus jardines y la magia de Jemaa el-Fna al anochecer. Probamos tajín, pinchos a la brasa y té con menta mientras sonaba música gnawa. Esta ciudad no descansa nunca, y nosotros tampoco quisimos.",
        "Marrakech welcomed us with its souks, its gardens and the magic of Jemaa el-Fna at nightfall. We tried tagine, grilled skewers and mint tea while Gnawa music played. This city never rests, and neither did we.",
        "Marrakech nous a accueillis avec ses souks, ses jardins et la magie de la Jemaa el-Fna à la tombée de la nuit. Nous avons goûté tajine, brochettes grillées et thé à la menthe au son de la musique gnawa. Cette ville ne se repose jamais, et nous non plus.",
      )],
      closing: T("Atrapados por la medina,", "Caught by the medina,", "Captivés par la médina,"),
      signature: "Sergio",
      postmark: "MARRAKECH",
      stamp: IMG.koutoubia,
      stamp_caption: T("Jemaa el-Fna · Marrakech", "Jemaa el-Fna · Marrakech", "Jemaa el-Fna · Marrakech"),
    },
    {
      label: T("Postal desde la medina azul", "A postcard from the blue medina", "Une carte postale de la médina bleue"),
      tagline: T("Energía y calma", "Energy and calm", "Énergie et calme"),
      greeting: T("Para quien necesita aire,", "For anyone who needs fresh air,", "Pour qui a besoin d'air,"),
      body: [T(
        "Después del bullicio de Marrakech, Essaouira fue una caricia: ritmo lento, callejones de cal y añil, artistas, música y atardeceres sobre el océano. A veces el viaje perfecto combina energía y calma. Este lo tuvo todo.",
        "After the buzz of Marrakech, Essaouira was a caress: a slow pace, whitewashed indigo alleys, artists, music and sunsets over the ocean. Sometimes the perfect trip blends energy and calm. This one had it all.",
        "Après l'effervescence de Marrakech, Essaouira fut une caresse : rythme lent, ruelles à la chaux et à l'indigo, artistes, musique et couchers de soleil sur l'océan. Parfois, le voyage parfait mêle énergie et calme. Celui-ci avait tout.",
      )],
      closing: T("Respirando hondo,", "Breathing deep,", "En respirant à fond,"),
      signature: "Cristina",
      postmark: "ESSAOUIRA",
      stamp: IMG.chefStreet,
      stamp_caption: T("Essaouira · Atlántico", "Essaouira · Atlantic", "Essaouira · Atlantique"),
    },
  ],

  /* J — Short escape: Marrakech */
  escapadaMarrakech: [
    {
      label: T("Postal desde Marrakech", "A postcard from Marrakech", "Une carte postale de Marrakech"),
      tagline: T("La ciudad roja", "The red city", "La ville rouge"),
      greeting: T("Hola desde la ciudad roja,", "Hello from the red city,", "Bonjour de la ville rouge,"),
      body: [T(
        "En apenas unos días Marrakech nos ha conquistado: los muros color tierra, el azul del jardín Majorelle, las palmeras y la Koutoubia recortada contra el cielo. Una escapada corta, pero intensa como pocas.",
        "In just a few days Marrakech has won us over: the earth-coloured walls, the blue of the Majorelle Garden, the palms and the Koutoubia against the sky. A short escape, but as intense as they come.",
        "En quelques jours à peine, Marrakech nous a conquis : les murs couleur terre, le bleu du jardin Majorelle, les palmiers et la Koutoubia se découpant sur le ciel. Une escapade courte, mais d'une rare intensité.",
      )],
      closing: T("Con ganas de más,", "Wanting more,", "Avec l'envie d'y revenir,"),
      signature: "Marta",
      postmark: "MARRAKECH",
      stamp: IMG.koutoubia,
      stamp_caption: T("Koutoubia · Marrakech", "Koutoubia · Marrakech", "Koutoubia · Marrakech"),
    },
    {
      label: T("Postal desde la medina", "A postcard from the medina", "Une carte postale de la médina"),
      tagline: T("Zocos y especias", "Souks and spices", "Souks et épices"),
      greeting: T("Querida familia,", "Dear family,", "Chère famille,"),
      body: [T(
        "Nos perdimos entre los zocos, regateamos por una lámpara y cenamos en Jemaa el-Fna entre humo y música. El tajín, el pan caliente y el té con menta nos tienen enamorados. Marrakech entra por todos los sentidos.",
        "We got lost in the souks, haggled over a lantern and had dinner in Jemaa el-Fna amid smoke and music. The tagine, the warm bread and the mint tea have us hooked. Marrakech reaches you through every sense.",
        "Nous nous sommes perdus dans les souks, avons marchandé une lampe et dîné sur la Jemaa el-Fna, entre fumée et musique. Le tajine, le pain chaud et le thé à la menthe nous ont conquis. Marrakech vous saisit par tous les sens.",
      )],
      closing: T("Con especias en la maleta,", "With spices in my suitcase,", "Des épices plein la valise,"),
      signature: "Pablo",
      postmark: "MARRAKECH",
      stamp: IMG.medinaPeople,
      stamp_caption: T("Zocos de Marrakech", "Souks of Marrakech", "Souks de Marrakech"),
    },
    {
      label: T("Postal desde un riad", "A postcard from a riad", "Une carte postale d'un riad"),
      tagline: T("Calma entre mosaicos", "Calm among mosaics", "Le calme parmi les mosaïques"),
      greeting: T("Para quien quiere desconectar,", "For anyone who wants to switch off,", "Pour qui veut décrocher,"),
      body: [T(
        "Lo mejor del día era volver a nuestro riad: una fuente en el patio, té recién hecho y silencio en plena medina. En un fin de semana hemos cambiado de mundo sin alejarnos demasiado de casa. Repetiremos seguro.",
        "The best part of the day was returning to our riad: a fountain in the courtyard, fresh tea and silence in the middle of the medina. In a weekend we've changed worlds without going too far from home. We'll definitely be back.",
        "Le meilleur moment de la journée, c'était de rentrer à notre riad : une fontaine dans le patio, du thé fraîchement préparé et le silence en pleine médina. En un week-end, nous avons changé de monde sans trop nous éloigner de chez nous. Nous reviendrons, c'est certain.",
      )],
      closing: T("Descansando entre mosaicos,", "Resting among mosaics,", "Au repos parmi les mosaïques,"),
      signature: "Lucía",
      postmark: "MARRAKECH",
      stamp: IMG.riadFountain,
      stamp_caption: T("Riad · Marrakech", "Riad · Marrakech", "Riad · Marrakech"),
    },
  ],

  /* K — Short escape: Fez (& Sidi Ali / Volubilis) */
  escapadaFez: [
    {
      label: T("Postal desde Fez", "A postcard from Fez", "Une carte postale de Fès"),
      tagline: T("Pura historia", "Pure history", "Histoire vivante"),
      greeting: T("Hola desde Fez,", "Hello from Fez,", "Bonjour de Fès,"),
      body: [T(
        "Fez nos ha robado el corazón en pocos días: vistas de la medina desde las colinas, las puertas monumentales y, muy cerca, las ruinas romanas de Volubilis entre campos verdes. Una escapada llena de historia.",
        "Fez has stolen our hearts in just a few days: views of the medina from the hills, the monumental gates and, nearby, the Roman ruins of Volubilis among green fields. An escape full of history.",
        "Fès nous a volé le cœur en quelques jours : vues sur la médina depuis les collines, portes monumentales et, tout près, les ruines romaines de Volubilis au milieu des champs verts. Une escapade pleine d'histoire.",
      )],
      closing: T("Viajando en el tiempo,", "Travelling through time,", "En voyage dans le temps,"),
      signature: "Elena",
      postmark: "FEZ",
      stamp: IMG.kasbahGate,
      stamp_caption: T("Bab Bou Jeloud · Fez", "Bab Bou Jeloud · Fez", "Bab Bou Jeloud · Fès"),
    },
    {
      label: T("Postal desde la medina", "A postcard from the medina", "Une carte postale de la médina"),
      tagline: T("Cuero y cerámica", "Leather and ceramics", "Cuir et céramique"),
      greeting: T("Querido amor,", "My love,", "Mon amour,"),
      body: [T(
        "Hoy recorrimos las curtidurías y los talleres de cerámica azul de Fez, y comimos pastela y cuscús en una casa preciosa de la medina. Nos trataron como a familia. La medina más antigua del mundo es un laberinto que enamora.",
        "Today we wandered the tanneries and the blue ceramics workshops of Fez, and ate pastilla and couscous in a beautiful house in the medina. They treated us like family. The oldest medina in the world is a labyrinth you fall for.",
        "Aujourd'hui nous avons parcouru les tanneries et les ateliers de céramique bleue de Fès, et mangé pastilla et couscous dans une superbe maison de la médina. On nous a traités comme de la famille. La plus ancienne médina du monde est un labyrinthe dont on tombe amoureux.",
      )],
      closing: T("Con el corazón en Fez,", "With my heart in Fez,", "Le cœur à Fès,"),
      signature: "Nuria",
      postmark: "FEZ",
      stamp: IMG.marketBaskets,
      stamp_caption: T("Curtidurías de Fez", "Tanneries of Fez", "Tanneries de Fès"),
    },
    {
      label: T("Postal desde un riad", "A postcard from a riad", "Une carte postale d'un riad"),
      tagline: T("La llamada del atardecer", "The evening call", "L'appel du soir"),
      greeting: T("Para quien busca autenticidad,", "For anyone seeking the real thing,", "Pour qui cherche l'authentique,"),
      body: [T(
        "Al atardecer, desde la terraza del riad, escuchamos la llamada a la oración resonando por toda la medina mientras el cielo se teñía de naranja. Fue uno de esos momentos que no caben en una foto. Solo en una postal.",
        "At dusk, from the riad's terrace, we heard the call to prayer echoing across the whole medina as the sky turned orange. It was one of those moments that don't fit in a photo. Only in a postcard.",
        "Au crépuscule, depuis la terrasse du riad, nous avons entendu l'appel à la prière résonner dans toute la médina tandis que le ciel virait à l'orange. Un de ces instants qui ne tiennent pas dans une photo. Seulement dans une carte postale.",
      )],
      closing: T("Con la piel de gallina,", "With goosebumps,", "Avec la chair de poule,"),
      signature: "Diego",
      postmark: "FEZ",
      stamp: IMG.riadFountain,
      stamp_caption: T("Atardecer en Fez", "Sunset in Fez", "Coucher de soleil à Fès"),
    },
  ],

  /* L — Short escape: High Atlas mountains */
  escapadaAtlas: [
    {
      label: T("Postal desde el Alto Atlas", "A postcard from the High Atlas", "Une carte postale du Haut Atlas"),
      tagline: T("Aire de montaña", "Mountain air", "Air de montagne"),
      greeting: T("Hola desde las montañas,", "Hello from the mountains,", "Bonjour des montagnes,"),
      body: [T(
        "Subimos a los valles del Alto Atlas, entre cumbres nevadas, terrazas de cultivo y pueblos bereberes de adobe colgados de la ladera. El aire es purísimo y el silencio, total. A solo una hora de Marrakech, otro mundo.",
        "We climbed up to the valleys of the High Atlas, among snowy peaks, farming terraces and Berber adobe villages clinging to the slope. The air is pure and the silence total. Just an hour from Marrakech, another world.",
        "Nous sommes montés dans les vallées du Haut Atlas, parmi les sommets enneigés, les terrasses cultivées et les villages berbères en pisé accrochés au versant. L'air est d'une pureté totale et le silence absolu. À une heure seulement de Marrakech, un autre monde.",
      )],
      closing: T("Respirando montaña,", "Breathing the mountains,", "À respirer la montagne,"),
      signature: "Carlos",
      postmark: "IMLIL",
      stamp: IMG.atlasMisty,
      stamp_caption: T("Valle de Imlil · Alto Atlas", "Imlil Valley · High Atlas", "Vallée d'Imlil · Haut Atlas"),
    },
    {
      label: T("Postal desde un pueblo bereber", "A postcard from a Berber village", "Une carte postale d'un village berbère"),
      tagline: T("Té junto al fuego", "Tea by the fire", "Thé au coin du feu"),
      greeting: T("Querida familia,", "Dear family,", "Chère famille,"),
      body: [T(
        "Una familia bereber nos abrió las puertas de su casa y compartimos pan, aceite de oliva, miel y té junto al fuego. Caminamos entre nogales y cascadas con un guía local que conocía cada sendero. La hospitalidad de la montaña es inolvidable.",
        "A Berber family opened their home to us and we shared bread, olive oil, honey and tea by the fire. We walked among walnut trees and waterfalls with a local guide who knew every path. The hospitality of the mountains is unforgettable.",
        "Une famille berbère nous a ouvert les portes de sa maison et nous avons partagé pain, huile d'olive, miel et thé au coin du feu. Nous avons marché parmi les noyers et les cascades avec un guide local qui connaissait chaque sentier. L'hospitalité de la montagne est inoubliable.",
      )],
      closing: T("Shukran, amigos,", "Shukran, friends,", "Shukran, mes amis,"),
      signature: "Ana",
      postmark: "ATLAS",
      stamp: IMG.atlasVillage,
      stamp_caption: T("Pueblo bereber · Atlas", "Berber village · Atlas", "Village berbère · Atlas"),
    },
    {
      label: T("Postal desde la cumbre", "A postcard from the summit", "Une carte postale du sommet"),
      tagline: T("La montaña cura", "The mountains heal", "La montagne guérit"),
      greeting: T("Para quien ama la naturaleza,", "For anyone who loves nature,", "Pour qui aime la nature,"),
      body: [T(
        "Llegar arriba y ver los valles abrirse bajo nuestros pies, sin ruido y sin prisa, fue la mejor recompensa. Vinimos por un par de días y nos vamos con la cabeza despejada. Las montañas tienen algo que cura.",
        "Reaching the top and watching the valleys open up beneath our feet, with no noise and no rush, was the best reward. We came for a couple of days and we're leaving with a clear head. The mountains have something that heals.",
        "Atteindre le sommet et voir les vallées s'ouvrir sous nos pieds, sans bruit ni précipitation, fut la plus belle récompense. Nous sommes venus pour deux jours et repartons l'esprit clair. La montagne a quelque chose qui guérit.",
      )],
      closing: T("Con los pulmones llenos,", "With my lungs full,", "Les poumons pleins,"),
      signature: "Javier",
      postmark: "ATLAS",
      stamp: IMG.atlasValley,
      stamp_caption: T("Cumbres del Alto Atlas", "Peaks of the High Atlas", "Sommets du Haut Atlas"),
    },
  ],

  /* M — Short escape: the desert */
  escapadaDesierto: [
    {
      label: T("Postal desde el desierto", "A postcard from the desert", "Une carte postale du désert"),
      tagline: T("Mar de estrellas", "A sea of stars", "Une mer d'étoiles"),
      greeting: T("Hola desde las dunas,", "Hello from the dunes,", "Bonjour des dunes,"),
      body: [T(
        "Llegamos al desierto y montamos en dromedario hacia las dunas justo para el atardecer. El cielo se incendió de naranjas y rosas y luego se llenó de estrellas. Una escapada corta, pero el Sáhara se queda grabado para siempre.",
        "We reached the desert and rode camels into the dunes just in time for sunset. The sky blazed with oranges and pinks and then filled with stars. A short escape, but the Sahara stays etched in you forever.",
        "Nous sommes arrivés dans le désert et avons chevauché des dromadaires vers les dunes juste à temps pour le coucher du soleil. Le ciel s'est embrasé d'oranges et de roses, puis s'est rempli d'étoiles. Une escapade courte, mais le Sahara reste gravé à jamais.",
      )],
      closing: T("Bajo un mar de estrellas,", "Under a sea of stars,", "Sous une mer d'étoiles,"),
      signature: "Sara",
      postmark: "MERZOUGA",
      stamp: IMG.dunes,
      stamp_caption: T("Erg Chebbi · Sáhara", "Erg Chebbi · Sahara", "Erg Chebbi · Sahara"),
    },
    {
      label: T("Postal desde la jaima", "A postcard from the tent", "Une carte postale de la tente"),
      tagline: T("Tambores y tajín", "Drums and tagine", "Tambours et tajine"),
      greeting: T("Querido diario,", "Dear diary,", "Cher journal,"),
      body: [T(
        "Cenamos un tajín humeante en el campamento y, alrededor del fuego, los bereberes tocaron tambores hasta tarde. Dormimos en una jaima y nos despertó el silencio. Nunca había sentido una noche tan distinta a todo.",
        "We had a steaming tagine at the camp and, around the fire, the Berbers played drums late into the night. We slept in a tent and were woken by the silence. I'd never felt a night so unlike anything else.",
        "Nous avons dîné d'un tajine fumant au campement et, autour du feu, les Berbères ont joué du tambour jusque tard. Nous avons dormi sous une tente et le silence nous a réveillés. Je n'avais jamais ressenti une nuit aussi différente de tout.",
      )],
      closing: T("Con el ritmo del desierto,", "To the rhythm of the desert,", "Au rythme du désert,"),
      signature: "Pablo",
      postmark: "SÁHARA",
      stamp: IMG.camelDunes,
      stamp_caption: T("Campamento bereber", "Berber camp", "Campement berbère"),
    },
    {
      label: T("Postal desde el amanecer", "A postcard from sunrise", "Une carte postale de l'aube"),
      tagline: T("Sin prisa", "No rush", "Sans hâte"),
      greeting: T("Para quien quiere parar el tiempo,", "For anyone who wants to stop time,", "Pour qui veut arrêter le temps,"),
      body: [T(
        "Subí a lo alto de una duna para ver salir el sol y me quedé sin palabras: solo arena dorada hasta el horizonte y un silencio enorme. En dos días el desierto me ha enseñado a no tener prisa. Volveré con más tiempo.",
        "I climbed to the top of a dune to watch the sun rise and was left speechless: just golden sand to the horizon and a vast silence. In two days the desert has taught me not to rush. I'll come back with more time.",
        "J'ai grimpé en haut d'une dune pour voir le soleil se lever et suis resté sans voix : juste du sable doré jusqu'à l'horizon et un immense silence. En deux jours, le désert m'a appris à ne plus me presser. Je reviendrai avec plus de temps.",
      )],
      closing: T("Con arena en el alma,", "With sand in my soul,", "Avec du sable dans l'âme,"),
      signature: "Marina",
      postmark: "MERZOUGA",
      stamp: IMG.camelCaravan,
      stamp_caption: T("Amanecer en el Sáhara", "Sunrise in the Sahara", "Aube dans le Sahara"),
    },
  ],

  /* N — Short escape: Marrakech + Agafay stone desert */
  escapadaAgafay: [
    {
      label: T("Postal desde Agafay", "A postcard from Agafay", "Une carte postale d'Agafay"),
      tagline: T("Desierto de piedra", "Stone desert", "Désert de pierre"),
      greeting: T("Hola desde el desierto de piedra,", "Hello from the stone desert,", "Bonjour du désert de pierre,"),
      body: [T(
        "A media hora de Marrakech apareció el desierto de Agafay: colinas lunares de tierra, con el Atlas nevado al fondo. Cenamos en un campamento de lujo viendo ponerse el sol y el cielo se llenó de estrellas. ¡Y todo a un paso de la ciudad!",
        "Half an hour from Marrakech the Agafay desert appeared: lunar hills of earth, with the snowy Atlas behind. We dined at a luxury camp watching the sun set and the sky filled with stars. And all just a step from the city!",
        "À une demi-heure de Marrakech est apparu le désert d'Agafay : des collines lunaires de terre, avec l'Atlas enneigé en toile de fond. Nous avons dîné dans un campement de luxe en regardant le soleil se coucher, et le ciel s'est rempli d'étoiles. Et tout cela à deux pas de la ville !",
      )],
      closing: T("Entre la ciudad y el desierto,", "Between city and desert,", "Entre ville et désert,"),
      signature: "Beatriz",
      postmark: "AGAFAY",
      stamp: IMG.dunesRocky,
      stamp_caption: T("Desierto de Agafay", "Agafay desert", "Désert d'Agafay"),
    },
    {
      label: T("Postal desde Marrakech", "A postcard from Marrakech", "Une carte postale de Marrakech"),
      tagline: T("Lo mejor de dos mundos", "The best of both worlds", "Le meilleur des deux mondes"),
      greeting: T("Querida familia,", "Dear family,", "Chère famille,"),
      body: [T(
        "Combinamos la magia de Marrakech con la calma de Agafay. En la medina nos perdimos entre zocos, especias y la música de Jemaa el-Fna, y probamos un tajín espectacular. La mezcla de bullicio y desierto ha sido perfecta.",
        "We combined the magic of Marrakech with the calm of Agafay. In the medina we got lost among souks, spices and the music of Jemaa el-Fna, and tried a spectacular tagine. The mix of bustle and desert was perfect.",
        "Nous avons mêlé la magie de Marrakech au calme d'Agafay. Dans la médina, nous nous sommes perdus parmi les souks, les épices et la musique de la Jemaa el-Fna, et avons goûté un tajine spectaculaire. Ce mélange d'effervescence et de désert était parfait.",
      )],
      closing: T("Con lo mejor de los dos mundos,", "With the best of both worlds,", "Avec le meilleur des deux mondes,"),
      signature: "Sergio",
      postmark: "MARRAKECH",
      stamp: IMG.medinaPeople,
      stamp_caption: T("Jemaa el-Fna · Marrakech", "Jemaa el-Fna · Marrakech", "Jemaa el-Fna · Marrakech"),
    },
    {
      label: T("Postal desde el campamento", "A postcard from the camp", "Une carte postale du campement"),
      tagline: T("Mirando al cielo", "Gazing at the sky", "Les yeux au ciel"),
      greeting: T("Para quien busca una escapada distinta,", "For anyone after a different escape,", "Pour qui cherche une escapade différente,"),
      body: [T(
        "Por la noche, lejos de las luces, nos tumbamos a contar estrellas mientras sonaba música suave en el campamento. Cuesta creer que la ciudad estuviera tan cerca. Una escapada cortita que nos ha sabido a gran viaje.",
        "At night, far from the lights, we lay down to count stars while soft music played at the camp. It's hard to believe the city was so close. A tiny escape that felt like a great journey.",
        "La nuit, loin des lumières, nous nous sommes allongés pour compter les étoiles tandis qu'une musique douce jouait au campement. Difficile de croire que la ville était si proche. Une petite escapade qui avait le goût d'un grand voyage.",
      )],
      closing: T("Mirando al cielo,", "Gazing at the sky,", "Les yeux au ciel,"),
      signature: "Cristina",
      postmark: "AGAFAY",
      stamp: IMG.dunes,
      stamp_caption: T("Noche en Agafay", "Night in Agafay", "Nuit à Agafay"),
    },
  ],

  /* O — Enduro / motorbike adventure across Atlas tracks & desert pistes */
  enduro: [
    {
      label: T("Postal desde la pista", "A postcard from the track", "Une carte postale de la piste"),
      tagline: T("Pura adrenalina", "Pure adrenaline", "Adrénaline pure"),
      greeting: T("Hola desde la aventura,", "Hello from the adventure,", "Bonjour de l'aventure,"),
      body: [T(
        "Llevamos días sobre la moto cruzando pistas del Atlas, ríos secos, pueblos de adobe y mares de dunas. Cada curva es un paisaje nuevo y cada noche caemos rendidos y felices. Marruecos en enduro es pura adrenalina.",
        "We've spent days on the bike crossing Atlas tracks, dry riverbeds, adobe villages and seas of dunes. Every bend is a new landscape and every night we crash out, exhausted and happy. Morocco on an enduro is pure adrenaline.",
        "Cela fait des jours que nous roulons à moto sur les pistes de l'Atlas, les rivières asséchées, les villages de terre et les mers de dunes. Chaque virage est un nouveau paysage et chaque soir nous tombons de fatigue, heureux. Le Maroc en enduro, c'est de l'adrénaline pure.",
      )],
      closing: T("Con polvo y sonrisa,", "Covered in dust and smiles,", "Couverts de poussière et de sourires,"),
      signature: "Rubén",
      postmark: "ATLAS",
      stamp: IMG.dunesRocky,
      stamp_caption: T("Pistas del Atlas", "Atlas tracks", "Pistes de l'Atlas"),
    },
    {
      label: T("Postal desde un pueblo del sur", "A postcard from a southern village", "Une carte postale d'un village du sud"),
      tagline: T("Nunca solos", "Never alone", "Jamais seuls"),
      greeting: T("Querida familia,", "Dear family,", "Chère famille,"),
      body: [T(
        "En cada parada nos reciben con té y curiosidad, los niños salen a saludar y, cuando una moto falla, siempre aparece alguien dispuesto a echar una mano. Rodar por aquí es también descubrir a su gente. Nunca nos sentimos solos en la pista.",
        "At every stop they greet us with tea and curiosity, the children come out to wave and, when a bike breaks down, someone always turns up willing to help. Riding here is also discovering its people. We never feel alone on the trail.",
        "À chaque arrêt, on nous accueille avec du thé et de la curiosité, les enfants viennent saluer et, quand une moto tombe en panne, il y a toujours quelqu'un prêt à donner un coup de main. Rouler ici, c'est aussi découvrir ses habitants. Nous ne nous sentons jamais seuls sur la piste.",
      )],
      closing: T("Gracias por tanto, Marruecos,", "Thank you for so much, Morocco,", "Merci pour tout, Maroc,"),
      signature: "Dani",
      postmark: "MARRUECOS",
      stamp: IMG.atlasVillage,
      stamp_caption: T("Pueblo bereber del sur", "Southern Berber village", "Village berbère du sud"),
    },
    {
      label: T("Postal desde el vivac", "A postcard from the bivouac", "Une carte postale du bivouac"),
      tagline: T("El desierto premia", "The desert rewards", "Le désert récompense"),
      greeting: T("Para los que viven al límite,", "For those who live on the edge,", "Pour ceux qui vivent à fond,"),
      body: [T(
        "Después de un día duro de pistas, llegar al campamento entre las dunas, apagar el motor y escuchar solo el viento no tiene precio. El desierto premia a quien lo cruza. Volveré con la moto y con ganas de más.",
        "After a hard day on the trails, reaching the camp among the dunes, switching off the engine and hearing only the wind is priceless. The desert rewards those who cross it. I'll be back with my bike and hungry for more.",
        "Après une dure journée de pistes, arriver au campement parmi les dunes, couper le moteur et n'entendre que le vent n'a pas de prix. Le désert récompense ceux qui le traversent. Je reviendrai avec ma moto et l'envie d'en redemander.",
      )],
      closing: T("Acelerando recuerdos,", "Throttling up memories,", "À pleins gaz de souvenirs,"),
      signature: "Víctor",
      postmark: "SÁHARA",
      stamp: IMG.camelDunes,
      stamp_caption: T("Campamento en las dunas", "Camp in the dunes", "Campement dans les dunes"),
    },
  ],
};

/* Generic fallback (used only if a routeId is not mapped). */
FAMILIES.morocco = FAMILIES.marrakechErg;

/* ---------- Route → corridor mapping ---------- */
export const ROUTE_FAMILY = {
  // A — South desert + Atlas gorges
  tourAtlasDesierto45: "desertAtlas",
  tourAtlasDesierto56: "desertAtlas",
  tourAtlasDesierto67: "desertAtlas",
  tourDesiertoAtlas45: "desertAtlas",
  tourDesiertoAtlas56: "desertAtlas",
  tourDesiertoAtlas67: "desertAtlas",
  // B — Marrakech ↔ Erg Chebbi
  tourMarrakechErg45: "marrakechErg",
  tourMarrakechErg56: "marrakechErg",
  tourMarrakechErg67: "marrakechErg",
  tourMarrakechErg78: "marrakechErg",
  tourErgMarrakech45: "marrakechErg",
  tourErgMarrakech56: "marrakechErg",
  tourErgMarrakech67: "marrakechErg",
  tourErgMarrakech78: "marrakechErg",
  // C — Marrakech round loop to the Sahara
  tourMarrakechLoop23: "marrakechLoop",
  tourMarrakechLoop34: "marrakechLoop",
  tourMarrakechLoop45: "marrakechLoop",
  tourMarrakechLoop56: "marrakechLoop",
  tourMarrakechLoop67: "marrakechLoop",
  tourMarrakechLoop78: "marrakechLoop",
  // D — Grand crossing Marrakech ↔ Fez
  tourMarrakechFez67: "grandCrossing",
  tourMarrakechFez78: "grandCrossing",
  tourMarrakechFez89: "grandCrossing",
  tourMarrakechFez910: "grandCrossing",
  tourFezRak67: "grandCrossing",
  tourFezRak78: "grandCrossing",
  tourFezRak89: "grandCrossing",
  tourFezRak910: "grandCrossing",
  tourMarrakechSidialiFez78: "grandCrossing",
  tourMarrakechSidialiFez89: "grandCrossing",
  tourMarrakechSidialiFez910: "grandCrossing",
  tourFezSidialiRak78: "grandCrossing",
  tourFezSidialiRak89: "grandCrossing",
  tourFezSidialiRak910: "grandCrossing",
  tourFezSidialiOzz56: "grandCrossing",
  tourFezSidialiOzz67: "grandCrossing",
  tourFezSidialiOzz78: "grandCrossing",
  tourOzzSidialiFez56: "grandCrossing",
  tourOzzSidialiFez67: "grandCrossing",
  tourOzzSidialiFez78: "grandCrossing",
  tourFezAtlasErr56: "grandCrossing",
  // E — Imperial cities
  tourCiudadesImperiales45: "imperial",
  tourCiudadesImperiales67: "imperial",
  // F — Imperial + Rif (Chefchaouen)
  tourCiudadesImperialesRif67: "imperialRif",
  tourCiudadesImperialesRif78: "imperialRif",
  // G — North loop
  tourTangerFez45: "north",
  tourTangerFez56: "north",
  tourFezTanger56: "north",
  tourFezTanger67: "north",
  // H — Grand north → south
  tourTangerRak89: "grandNorthSouth",
  tourTangerRak910: "grandNorthSouth",
  // I — Marrakech + Essaouira
  tourMarrakechEss45: "essaouira",
  tourMarrakechEss67: "essaouira",
  // J — Short escape Marrakech
  tourEscapadaMarrakech23: "escapadaMarrakech",
  // K — Short escape Fez
  tourEscapadaFez23: "escapadaFez",
  tourEscapadaFez34: "escapadaFez",
  tourEscapadaFezSidiali34: "escapadaFez",
  tourEscapadaFezSidiali45: "escapadaFez",
  // L — Short escape Atlas
  tourEscapadaAtlas34: "escapadaAtlas",
  // M — Short escape desert
  tourEscapadaDesierto34: "escapadaDesierto",
  // N — Short escape Agafay
  tourEscapadaRakAgafay34: "escapadaAgafay",
  // O — Enduro adventure
  tourEnduroAventura45: "enduro",
  tourEnduroAventura67: "enduro",
};

/* Returns the 3 postcards for a given routeId (falls back to a
   generic Morocco set if the route is not mapped). */
export function getTripPostcards(routeId) {
  const family = (routeId && ROUTE_FAMILY[routeId]) || "morocco";
  return FAMILIES[family] || FAMILIES.morocco;
}

export default getTripPostcards;
