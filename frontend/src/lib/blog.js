/* ============================================================
   Blog posts · Xaluca Tours · enfocados en el sur de Marruecos
   y experiencias del desierto. SEO-friendly: cada post incluye
   slug · tags · readingTime · keywords · excerpt + cuerpo
   estructurado en bloques (h2, p, list, quote, callout).
============================================================ */
import { IMG } from "./imageBank";

export const CATEGORIES = [
  { id: "all",         label: { es: "Todos",          en: "All",            fr: "Tous" } },
  { id: "desierto",    label: { es: "Desierto",       en: "Desert",         fr: "Désert" } },
  { id: "aventura",    label: { es: "Aventura",       en: "Adventure",      fr: "Aventure" } },
  { id: "cultura",     label: { es: "Cultura",        en: "Culture",        fr: "Culture" } },
  { id: "rutas",       label: { es: "Rutas",          en: "Routes",         fr: "Itinéraires" } },
  { id: "eventos",     label: { es: "Eventos",        en: "Events",         fr: "Événements" } },
];

/* Each `body` block is `{ type, ... }`. Supported types:
   - h2:       { type:'h2', text:{...i18n} }
   - p:        { type:'p',  text:{...i18n} }
   - list:     { type:'list', items:[{...i18n}, ...] }
   - quote:    { type:'quote', text:{...i18n}, by:{...i18n} }
   - callout:  { type:'callout', title:{...i18n}, text:{...i18n} } */
export const POSTS = [
  {
    id: "noche-en-erg-chebbi",
    slug: "noche-en-erg-chebbi",
    category: "desierto",
    cover: IMG.dunes,
    readingTime: 7,
    publishedAt: "2026-02-12",
    author: "Equipo Xaluca",
    keywords: ["erg chebbi", "dormir en el desierto marruecos", "bivouac merzouga", "noche dunas sahara"],
    cta: {
      route: "tourMarrakechErgHub",
      eyebrow: { es: "¿Listo para vivirlo?", en: "Ready to live it?", fr: "Prêt à le vivre ?" },
      title:   { es: "Marrakech → Erg Chebbi · 6 noches", en: "Marrakech → Erg Chebbi · 6 nights", fr: "Marrakech → Erg Chebbi · 6 nuits" },
      body:    { es: "Bivouac premium incluido y conductor local. Diseñado por quienes escribieron este artículo.",
                 en: "Premium bivouac and local driver included. Designed by the people who wrote this article.",
                 fr: "Bivouac premium et chauffeur local inclus. Conçu par ceux qui ont écrit cet article." },
    },
    title: {
      es: "Una noche en el Erg Chebbi: cómo se vive dormir entre las dunas más altas de Marruecos",
      en: "A night in Erg Chebbi: what it really feels like to sleep among Morocco's tallest dunes",
      fr: "Une nuit à l'Erg Chebbi : ce que vivre une nuit entre les plus hautes dunes du Maroc veut vraiment dire",
    },
    excerpt: {
      es: "150 metros de arena naranja, un cielo sin contaminación lumínica y un té de menta a las 22:00. Todo lo que necesitas saber antes de tu primera noche en el desierto.",
      en: "150 metres of orange sand, a sky without light pollution and a mint tea at 10 pm. Everything you need to know before your first night in the desert.",
      fr: "150 mètres de sable orangé, un ciel sans pollution lumineuse et un thé à la menthe à 22 h. Tout ce qu'il faut savoir avant votre première nuit dans le désert.",
    },
    body: [
      { type: "p", text: {
        es: "Llegas a Merzouga después de un día largo de carretera desde Marrakech o Fez. El asfalto termina, los neumáticos se hunden ligeramente en la pista y, de pronto, las dunas del Erg Chebbi aparecen como una pared infinita de color cobre. Es ese primer momento — antes de bajar del 4x4, antes de subir al dromedario — el que cambia tu idea de lo que es 'el desierto'.",
        en: "You arrive in Merzouga after a long day on the road from Marrakech or Fez. Tarmac ends, the tyres sink slightly into the track and suddenly the Erg Chebbi dunes appear as an endless copper wall. It's that very first moment — before you step out of the 4x4, before you climb the camel — that changes your idea of what 'the desert' is.",
        fr: "Vous arrivez à Merzouga après une longue journée de route depuis Marrakech ou Fès. Le bitume s'arrête, les pneus s'enfoncent dans la piste et soudain les dunes de l'Erg Chebbi apparaissent comme un mur infini couleur cuivre. C'est ce premier instant — avant même de descendre du 4x4, avant de monter sur le dromadaire — qui transforme votre idée du « désert »." } },

      { type: "h2", text: {
        es: "El camino al bivouac: por qué se hace al atardecer",
        en: "The way to the bivouac: why it's always at sunset",
        fr: "Le chemin du bivouac : pourquoi toujours au coucher du soleil" } },
      { type: "p", text: {
        es: "El paseo desde Merzouga al campamento se diseña a la hora dorada por dos razones. La primera, fotográfica: la luz lateral hace que las dunas parezcan dos colores a la vez — naranja en la cresta, violeta en la sombra. La segunda, climática: a las 17:30 en otoño la temperatura cae 15 °C en una hora.",
        en: "The ride from Merzouga to camp is designed for the golden hour for two reasons. First, photographically: the side light makes the dunes look like two colours at once — orange on the crest, violet in the shadow. Second, climate: at 5:30 pm in autumn the temperature drops 15 °C in one hour.",
        fr: "La balade de Merzouga au campement est conçue pour l'heure dorée pour deux raisons. Photographique d'abord : la lumière rasante fait apparaître les dunes en deux couleurs à la fois — orange en crête, violet à l'ombre. Climatique ensuite : à 17 h 30 en automne, la température chute de 15 °C en une heure." } },

      { type: "h2", text: {
        es: "Qué encontrarás en un bivouac premium",
        en: "What you'll find in a premium bivouac",
        fr: "Ce que vous trouverez dans un bivouac premium" } },
      { type: "list", items: [
        { es: "Tienda haima privada con cama king, baño completo y agua caliente.",
          en: "Private haima tent with king bed, full bathroom and hot water.",
          fr: "Tente haima privée avec lit king, salle de bain complète et eau chaude." },
        { es: "Cena con tagine de cordero a fuego lento, ensaladas marroquíes y postre de dátiles.",
          en: "Dinner with slow-cooked lamb tagine, Moroccan salads and date dessert.",
          fr: "Dîner avec tajine d'agneau mijoté, salades marocaines et dessert aux dattes." },
        { es: "Hoguera central con músicos gnaoua, té de menta y silencio absoluto a partir de las 23:30.",
          en: "Central bonfire with gnawa musicians, mint tea and absolute silence after 11:30 pm.",
          fr: "Feu de camp central avec musiciens gnawa, thé à la menthe et silence absolu après 23 h 30." },
        { es: "Amanecer en la cresta más alta — un guía local te despierta 30 minutos antes con café caliente.",
          en: "Sunrise on the highest crest — a local guide wakes you 30 minutes early with hot coffee.",
          fr: "Lever de soleil sur la plus haute crête — un guide local vous réveille 30 minutes avant avec un café chaud." },
      ]},

      { type: "quote", text: {
        es: "El silencio del Sáhara no es la ausencia de sonido. Es un sonido en sí mismo — algo que necesitas vivir una vez en la vida.",
        en: "The silence of the Sahara isn't the absence of sound. It's a sound in itself — something you need to live once in your life.",
        fr: "Le silence du Sahara n'est pas l'absence de son. C'est un son en soi — quelque chose qu'il faut vivre une fois dans sa vie.",
      }, by: { es: "Bowles", en: "Bowles", fr: "Bowles" } },

      { type: "h2", text: {
        es: "La mejor época para dormir en el Erg Chebbi",
        en: "The best season to sleep in Erg Chebbi",
        fr: "La meilleure saison pour dormir à l'Erg Chebbi" } },
      { type: "p", text: {
        es: "De octubre a abril. En noviembre las noches son frescas (8–12 °C) pero los días templan a 22–25 °C. Marzo y abril son la temporada con flores en los oasis y noches todavía agradables. Evita julio y agosto: 45 °C de día y noches de 30 °C hacen que la experiencia pierda su magia.",
        en: "October to April. November nights are crisp (8–12 °C) but days warm to 22–25 °C. March and April bring blossoms in the oases and still-pleasant nights. Avoid July and August: 45 °C days and 30 °C nights take the magic out of the experience.",
        fr: "D'octobre à avril. En novembre les nuits sont fraîches (8 à 12 °C) mais les journées montent à 22-25 °C. Mars et avril offrent les oasis en fleurs et des nuits encore agréables. Évitez juillet-août : 45 °C le jour et 30 °C la nuit éteignent la magie." } },

      { type: "callout", title: {
        es: "Consejo Xaluca", en: "Xaluca tip", fr: "Conseil Xaluca",
      }, text: {
        es: "Reserva mínimo 2 noches en el desierto. La primera la pasarás haciendo fotos. La segunda — la que de verdad recuerdas — la pasarás sin teléfono.",
        en: "Book at least 2 nights in the desert. You'll spend the first one taking photos. The second one — the one you actually remember — you'll spend without a phone.",
        fr: "Réservez au moins 2 nuits dans le désert. Vous passerez la première à prendre des photos. La deuxième — celle dont vous vous souviendrez — vous la passerez sans téléphone.",
      }},
    ],
  },

  {
    id: "ruta-kasbahs-drâa",
    slug: "ruta-kasbahs-valle-draa",
    category: "rutas",
    cover: IMG.kasbahGate,
    readingTime: 9,
    publishedAt: "2026-02-08",
    author: "Equipo Xaluca",
    keywords: ["ruta kasbahs marruecos", "valle del drâa", "ouarzazate ait ben haddou", "sur de marruecos"],
    cta: {
      route: "tourSouth",
      eyebrow: { es: "Hazla con nosotros", en: "Do it with us", fr: "Faites-la avec nous" },
      title:   { es: "Gran Sur de Marruecos · 8 noches", en: "Grand South of Morocco · 8 nights", fr: "Grand Sud du Maroc · 8 nuits" },
      body:    { es: "El recorrido completo del Drâa con paradas en Aït Ben Haddou, Tamnougalt y M'hamid.",
                 en: "The full Drâa journey with stops in Aït Ben Haddou, Tamnougalt and M'hamid.",
                 fr: "Le parcours complet du Drâa avec arrêts à Aït Ben Haddou, Tamnougalt et M'hamid." },
    },
    title: {
      es: "La Ruta de las Kasbahs: de Ouarzazate a Zagora por el Valle del Drâa",
      en: "The Kasbah Route: from Ouarzazate to Zagora through the Drâa Valley",
      fr: "La Route des Kasbahs : d'Ouarzazate à Zagora par la Vallée du Drâa",
    },
    excerpt: {
      es: "200 km de palmeral, fortalezas de barro y oasis bereberes. La ruta de tierra más cinematográfica de Marruecos contada paso a paso.",
      en: "200 km of palm grove, mud fortresses and Berber oases. Morocco's most cinematic earthen route, told step by step.",
      fr: "200 km de palmeraie, de forteresses en terre et d'oasis berbères. La route en pisé la plus cinématographique du Maroc, étape par étape.",
    },
    body: [
      { type: "p", text: {
        es: "El Valle del Drâa es donde Hollywood viene a rodar cuando necesita un planeta diferente. De Ouarzazate a Zagora, la N9 atraviesa un palmeral de 200 km salpicado por más de 60 kasbahs y ksour de tierra. No es un trayecto rápido — es la ruta que define el sur.",
        en: "The Drâa Valley is where Hollywood comes to film when it needs a different planet. From Ouarzazate to Zagora, the N9 cuts through a 200 km palm grove dotted with more than 60 earthen kasbahs and ksour. It's not a fast drive — it's the route that defines the south.",
        fr: "La Vallée du Drâa est l'endroit où Hollywood vient tourner quand il lui faut une autre planète. D'Ouarzazate à Zagora, la N9 traverse une palmeraie de 200 km, ponctuée de plus de 60 kasbahs et ksour en pisé. Ce n'est pas un trajet rapide — c'est la route qui définit le sud." } },

      { type: "h2", text: {
        es: "Etapa 1 · Ouarzazate y los estudios de Atlas",
        en: "Stage 1 · Ouarzazate and the Atlas Studios",
        fr: "Étape 1 · Ouarzazate et les studios d'Atlas" } },
      { type: "p", text: {
        es: "Ouarzazate es la puerta del sur. Visita los estudios de cine donde se rodaron Gladiator, Juego de Tronos y Lawrence de Arabia, y termina el día en la Kasbah de Taourirt, una fortaleza del XIX restaurada con UNESCO.",
        en: "Ouarzazate is the gateway to the south. Visit the film studios that hosted Gladiator, Game of Thrones and Lawrence of Arabia, then end the day at Kasbah Taourirt, a 19th-century fortress restored with UNESCO support.",
        fr: "Ouarzazate est la porte du sud. Visitez les studios où ont été tournés Gladiator, Game of Thrones et Lawrence d'Arabie, puis terminez la journée à la Kasbah de Taourirt, forteresse du XIXe restaurée avec l'UNESCO." } },

      { type: "h2", text: {
        es: "Etapa 2 · Aït Ben Haddou y el ksar Patrimonio de la Humanidad",
        en: "Stage 2 · Aït Ben Haddou and the UNESCO ksar",
        fr: "Étape 2 · Aït Ben Haddou et le ksar classé UNESCO" } },
      { type: "p", text: {
        es: "A 30 km al norte de Ouarzazate, Aït Ben Haddou es la ksar de barro más célebre del Magreb. Sube al granero superior al amanecer para fotografiar el conjunto antes de que lleguen los autobuses.",
        en: "30 km north of Ouarzazate, Aït Ben Haddou is the most famous earthen ksar in the Maghreb. Climb to the top granary at dawn to photograph the complex before the tour buses arrive.",
        fr: "À 30 km au nord d'Ouarzazate, Aït Ben Haddou est le ksar de terre le plus célèbre du Maghreb. Montez au grenier supérieur à l'aube pour photographier l'ensemble avant l'arrivée des autocars." } },

      { type: "h2", text: {
        es: "Etapa 3 · Agdz y la entrada al Drâa",
        en: "Stage 3 · Agdz and entering the Drâa",
        fr: "Étape 3 · Agdz et l'entrée dans le Drâa" } },
      { type: "p", text: {
        es: "Tras cruzar el puerto Tizi-n-Tinififft (1 660 m), Agdz aparece como una mancha verde infinita: el inicio del palmeral. Para en la cooperativa de alfombras bereberes — son las únicas hechas con lana de oveja del Atlas.",
        en: "After crossing the Tizi-n-Tinififft pass (1,660 m), Agdz appears as an endless green smudge: the start of the palm grove. Stop at the Berber rug cooperative — these are the only carpets made with Atlas sheep wool.",
        fr: "Après le col Tizi-n-Tinififft (1 660 m), Agdz apparaît comme une tache verte infinie : le début de la palmeraie. Arrêtez-vous à la coopérative de tapis berbères — ce sont les seuls tapis faits avec la laine des moutons de l'Atlas." } },

      { type: "h2", text: {
        es: "Etapa 4 · Tamnougalt y la kasbah viva",
        en: "Stage 4 · Tamnougalt and the living kasbah",
        fr: "Étape 4 · Tamnougalt et la kasbah vivante" } },
      { type: "p", text: {
        es: "Tamnougalt es la kasbah más fotogénica de todo el valle. Está habitada, lo que significa que sus pasadizos huelen a pan recién hecho y a té al amanecer. El propietario actual te enseña la habitación donde durmió Saint-Exupéry.",
        en: "Tamnougalt is the most photogenic kasbah of the entire valley. It's still inhabited, which means its corridors smell of fresh bread and tea at dawn. The current owner shows the room where Saint-Exupéry slept.",
        fr: "Tamnougalt est la kasbah la plus photogénique de toute la vallée. Elle est encore habitée, donc ses corridors sentent le pain frais et le thé à l'aube. Le propriétaire actuel vous montre la chambre où dormit Saint-Exupéry." } },

      { type: "h2", text: {
        es: "Etapa 5 · Zagora y el cartel «52 jours à Tombouctou»",
        en: "Stage 5 · Zagora and the '52 days to Timbuktu' sign",
        fr: "Étape 5 · Zagora et la pancarte « 52 jours à Tombouctou »" } },
      { type: "p", text: {
        es: "El cartel es turístico — pero la cifra es real. Las caravanas tardaban 52 días desde Zagora hasta Tombuctú cruzando el Sáhara. Si tienes 2 noches extra, organizamos una incursión a las dunas de Tinfou y M'hamid, mucho más vírgenes que Merzouga.",
        en: "The sign is touristy — but the number is real. Caravans took 52 days from Zagora to Timbuktu across the Sahara. With 2 extra nights, we organise an excursion to the Tinfou and M'hamid dunes, far more pristine than Merzouga.",
        fr: "La pancarte est touristique — mais le chiffre est réel. Les caravanes mettaient 52 jours de Zagora à Tombouctou à travers le Sahara. Avec 2 nuits supplémentaires, nous organisons une incursion aux dunes de Tinfou et M'hamid, bien plus vierges que Merzouga." } },

      { type: "callout", title: {
        es: "Cuántos días reservar", en: "How many days to book", fr: "Combien de jours réserver",
      }, text: {
        es: "Mínimo 3 días desde Marrakech para hacer el Drâa sin agobios. Lo ideal son 5 días para incluir Aït Ben Haddou con luz buena y las dunas de M'hamid.",
        en: "Minimum 3 days from Marrakech to do the Drâa without rushing. Five days is ideal to include Aït Ben Haddou in good light and the M'hamid dunes.",
        fr: "Minimum 3 jours depuis Marrakech pour faire le Drâa sans précipitation. Cinq jours est l'idéal pour inclure Aït Ben Haddou en belle lumière et les dunes de M'hamid.",
      }},
    ],
  },

  {
    id: "titan-desert-marruecos",
    slug: "titan-desert-bikepacking-marruecos",
    category: "eventos",
    cover: IMG.dunesRocky,
    readingTime: 6,
    publishedAt: "2026-02-04",
    author: "Equipo Xaluca",
    keywords: ["titan desert marruecos", "ciclismo en el desierto", "marathon des sables", "eventos deportivos marruecos"],
    cta: {
      route: "events",
      eyebrow: { es: "Soporte para tu próximo evento", en: "Logistics for your next race", fr: "Logistique pour votre prochaine course" },
      title:   { es: "Incentivos y eventos deportivos", en: "Sporting events & incentives", fr: "Événements sportifs & incentives" },
      body:    { es: "25 años dando logística a las grandes pruebas del sur. Hablamos de tu equipo, fechas y necesidades.",
                 en: "25 years of logistics for the south's biggest races. Let's talk about your team, dates and needs.",
                 fr: "25 ans de logistique pour les plus grandes courses du sud. Parlons de votre équipe, vos dates et vos besoins." },
    },
    title: {
      es: "Titan Desert, Marathon des Sables y Rally Merzouga: por qué el sur de Marruecos es la capital del deporte extremo",
      en: "Titan Desert, Marathon des Sables and Merzouga Rally: why southern Morocco is the capital of extreme sport",
      fr: "Titan Desert, Marathon des Sables et Rallye Merzouga : pourquoi le sud du Maroc est la capitale du sport extrême",
    },
    excerpt: {
      es: "Tres pruebas, una misma región. El sur del país acoge cada año a 4 000 atletas internacionales — y nosotros llevamos 25 años dándoles soporte logístico.",
      en: "Three races, one same region. Every year, southern Morocco welcomes 4,000 international athletes — and we've been their logistics backbone for 25 years.",
      fr: "Trois épreuves, une même région. Chaque année, le sud du Maroc accueille 4 000 athlètes internationaux — et nous sommes leur logistique depuis 25 ans.",
    },
    body: [
      { type: "p", text: {
        es: "Hay algo en las pistas del sur de Marruecos que las hace únicas para el deporte extremo: cambian de paisaje cada 20 km. Desierto, oasis, montañas del Atlas, gargantas, dunas… ningún otro lugar del mundo concentra tanta variedad en una misma jornada de competición.",
        en: "There's something about southern Morocco's tracks that makes them unique for extreme sport: the landscape changes every 20 km. Desert, oases, Atlas mountains, gorges, dunes… nowhere else on the planet concentrates so much variety in a single race day.",
        fr: "Les pistes du sud du Maroc ont quelque chose d'unique pour le sport extrême : le paysage change tous les 20 km. Désert, oasis, montagnes de l'Atlas, gorges, dunes… nulle part ailleurs sur la planète une telle variété en une seule étape." } },

      { type: "h2", text: {
        es: "Garmin Titan Desert · 6 días en MTB",
        en: "Garmin Titan Desert · 6 days of MTB",
        fr: "Garmin Titan Desert · 6 jours de VTT" } },
      { type: "p", text: {
        es: "600 km de mountain bike por etapas, salida desde Boumalne Dadès, paso por Erg Chebbi y final en Merzouga. La organización del Titan es del Grup Xaluca: comida, transfers, asistencia médica y hoteles base — toda la logística la cubrimos nosotros.",
        en: "600 km of stage mountain biking, starting in Boumalne Dadès, crossing Erg Chebbi and finishing in Merzouga. Grup Xaluca runs Titan's full logistics — food, transfers, medical assistance and base hotels.",
        fr: "600 km de VTT en étapes, départ à Boumalne Dadès, traversée de l'Erg Chebbi et arrivée à Merzouga. Grup Xaluca gère toute la logistique du Titan : restauration, transferts, assistance médicale et hôtels de base." } },

      { type: "h2", text: {
        es: "Marathon des Sables · 250 km a pie",
        en: "Marathon des Sables · 250 km on foot",
        fr: "Marathon des Sables · 250 km à pied" } },
      { type: "p", text: {
        es: "La carrera de ultra-fondo más dura del planeta según la BBC. Seis días en autosuficiencia con temperaturas de hasta 50 °C. Acoge a 1 200 atletas de 50 países y se celebra desde 1986.",
        en: "BBC-rated the toughest ultra-endurance race on earth. Six days self-supported, with temperatures up to 50 °C. It hosts 1,200 athletes from 50 countries and has been running since 1986.",
        fr: "Selon la BBC, la course d'ultra-endurance la plus dure de la planète. Six jours en autosuffisance, températures jusqu'à 50 °C. Elle accueille 1 200 athlètes de 50 pays et se court depuis 1986." } },

      { type: "h2", text: {
        es: "Rally Merzouga · 5 días en moto y quad",
        en: "Rally Merzouga · 5 days on bike and quad",
        fr: "Rallye Merzouga · 5 jours en moto et quad" } },
      { type: "p", text: {
        es: "Antesala oficial del Dakar. Pilotos profesionales y aficionados convergen en Erfoud cada abril para 1 500 km de pistas. Es la única carrera del mundo donde el segundo día se corre íntegro sobre dunas.",
        en: "Official Dakar warm-up. Professional and amateur riders converge in Erfoud every April for 1,500 km of tracks. It's the only race in the world where day two runs entirely on dunes.",
        fr: "Échauffement officiel du Dakar. Pilotes pros et amateurs se retrouvent à Erfoud chaque avril pour 1 500 km de pistes. C'est la seule course au monde où la deuxième journée se court entièrement sur dunes." } },

      { type: "callout", title: {
        es: "Si vienes como acompañante", en: "If you're coming as a companion", fr: "Si vous venez comme accompagnant",
      }, text: {
        es: "Organizamos paquetes para familiares y aficionados que quieren seguir las pruebas sin competir: 4x4 con conductor, alojamiento en hotel del grupo y acceso a los puntos de paso más espectaculares.",
        en: "We organise packages for family and fans who want to follow the race without competing: 4x4 with driver, accommodation in group hotels and access to the most spectacular checkpoints.",
        fr: "Nous organisons des forfaits pour les proches et les fans qui veulent suivre la course sans concourir : 4x4 avec chauffeur, hébergement dans les hôtels du groupe et accès aux points de passage les plus spectaculaires.",
      }},
    ],
  },

  {
    id: "gnaoua-musica-sur",
    slug: "musica-gnaoua-essaouira-sur",
    category: "cultura",
    cover: IMG.medinaPeople,
    readingTime: 5,
    publishedAt: "2026-01-28",
    author: "Equipo Xaluca",
    keywords: ["música gnaoua", "festival essaouira", "cultura marruecos", "patrimonio unesco gnaoua"],
    cta: {
      route: "tourMarrakechEssHub",
      eyebrow: { es: "Vívelo en directo", en: "Hear it live", fr: "Écoutez-le en direct" },
      title:   { es: "Marrakech ⇄ Essaouira · 4 noches", en: "Marrakech ⇄ Essaouira · 4 nights", fr: "Marrakech ⇄ Essaouira · 4 nuits" },
      body:    { es: "Incluye una sesión privada de gnaoua en Khamlia o en la medina de Essaouira, dependiendo de tu ruta.",
                 en: "Includes a private gnawa session in Khamlia or the Essaouira medina, depending on your route.",
                 fr: "Inclut une session privée de gnawa à Khamlia ou dans la médina d'Essaouira, selon votre itinéraire." },
    },
    title: {
      es: "Gnaoua: la música del sur de Marruecos declarada Patrimonio de la Humanidad",
      en: "Gnawa: southern Morocco's music recognised by UNESCO",
      fr: "Gnawa : la musique du sud du Maroc inscrite au patrimoine de l'humanité",
    },
    excerpt: {
      es: "Tambores, krakebs metálicos y trances que duran toda la noche. Una guía honesta sobre la música gnaoua, su origen subsahariano y dónde escucharla de verdad.",
      en: "Drums, metal krakebs and all-night trances. An honest guide to gnawa music, its sub-Saharan origin and where to actually hear it.",
      fr: "Tambours, krakebs métalliques et transes qui durent toute la nuit. Un guide honnête de la musique gnawa, de ses origines subsahariennes et des lieux pour l'écouter vraiment.",
    },
    body: [
      { type: "p", text: {
        es: "La música gnaoua nace en el sur de Marruecos como herencia de los esclavos subsaharianos traídos al Magreb entre los siglos XVI y XIX. Lo que empezó como ritual espiritual de sanación es hoy una de las músicas más respetadas del mundo árabe y desde 2019 está declarada Patrimonio Inmaterial de la Humanidad por la UNESCO.",
        en: "Gnawa music was born in southern Morocco as the legacy of sub-Saharan slaves brought to the Maghreb between the 16th and 19th centuries. What began as a spiritual healing ritual is today one of the most respected musical traditions in the Arab world — recognised by UNESCO as Intangible Cultural Heritage in 2019.",
        fr: "La musique gnawa est née dans le sud du Maroc comme héritage des esclaves subsahariens amenés au Maghreb entre les XVIe et XIXe siècles. Ce qui était à l'origine un rituel spirituel de guérison est aujourd'hui l'une des musiques les plus respectées du monde arabe — inscrite par l'UNESCO en 2019 au patrimoine immatériel." } },

      { type: "h2", text: {
        es: "Tres instrumentos, una hipnosis",
        en: "Three instruments, one hypnosis",
        fr: "Trois instruments, une hypnose" } },
      { type: "list", items: [
        { es: "Guembri · laúd de tres cuerdas con piel de camello.",
          en: "Guembri · three-string lute strung with camel skin.",
          fr: "Guembri · luth à trois cordes avec peau de chameau." },
        { es: "Krakebs · castañuelas metálicas que marcan el trance.",
          en: "Krakebs · metal castanets that drive the trance.",
          fr: "Krakebs · castagnettes métalliques qui mènent la transe." },
        { es: "Tbel · tambor grande que abre el ritual.",
          en: "Tbel · large drum that opens the ritual.",
          fr: "Tbel · grand tambour qui ouvre le rituel." },
      ]},

      { type: "h2", text: {
        es: "Dónde escuchar gnaoua en directo",
        en: "Where to hear gnawa live",
        fr: "Où écouter du gnawa en direct" } },
      { type: "p", text: {
        es: "El festival más conocido es el Festival Gnaoua d'Essaouira, en junio, con 500 000 asistentes y artistas internacionales que vienen a colaborar con maestros locales. Pero la versión más auténtica — el ritual completo de toda la noche, lila — sólo se escucha en encuentros privados que organizamos en Marrakech, Erfoud y Khamlia, un pequeño pueblo a las afueras de Merzouga habitado por descendientes directos de los esclavos del Sáhara.",
        en: "The best-known is the Festival Gnaoua d'Essaouira in June — 500,000 attendees and international artists collaborating with local masters. But the most authentic version — the full all-night ritual, lila — is only heard in private encounters we organise in Marrakech, Erfoud and Khamlia, a small village outside Merzouga inhabited by direct descendants of Saharan slaves.",
        fr: "Le plus connu est le Festival Gnaoua d'Essaouira, en juin : 500 000 spectateurs et des artistes internationaux qui collaborent avec les maîtres locaux. Mais la version la plus authentique — le rituel intégral de toute la nuit, lila — ne s'écoute que dans des rencontres privées que nous organisons à Marrakech, Erfoud et Khamlia, petit village à la sortie de Merzouga habité par les descendants directs des esclaves sahariens." } },
    ],
  },

  {
    id: "4x4-pistas-sur",
    slug: "rutas-4x4-anti-atlas-draa",
    category: "aventura",
    cover: IMG.atlasMisty,
    readingTime: 8,
    publishedAt: "2026-01-20",
    author: "Equipo Xaluca",
    keywords: ["ruta 4x4 marruecos", "anti-atlas pistas", "off-road sur de marruecos", "drâa expedición"],
    cta: {
      route: "tourSouth",
      eyebrow: { es: "Estas pistas, contigo al volante", en: "These tracks, with you on board", fr: "Ces pistes, avec vous à bord" },
      title:   { es: "Gran Sur de Marruecos · 8 noches", en: "Grand South of Morocco · 8 nights", fr: "Grand Sud du Maroc · 8 nuits" },
      body:    { es: "Flota 4x4 propia y conductores locales que llevan décadas rodando estas pistas.",
                 en: "Our own 4x4 fleet and local drivers who've spent decades on these tracks.",
                 fr: "Notre flotte 4x4 propre et chauffeurs locaux qui parcourent ces pistes depuis des décennies." },
    },
    title: {
      es: "Cinco pistas de 4x4 del sur de Marruecos que sólo conocen los locales",
      en: "Five 4x4 tracks in southern Morocco that only locals know",
      fr: "Cinq pistes 4x4 du sud du Maroc que seuls les locaux connaissent",
    },
    excerpt: {
      es: "Olvida las rutas turísticas. Estas cinco pistas atraviesan paisajes que ni siquiera Google Maps reconoce — y nuestros conductores las llevan rodando 25 años.",
      en: "Forget the tourist routes. These five tracks cross landscapes Google Maps doesn't even know — and our drivers have been doing them for 25 years.",
      fr: "Oubliez les routes touristiques. Ces cinq pistes traversent des paysages que Google Maps ignore — et nos chauffeurs les empruntent depuis 25 ans.",
    },
    body: [
      { type: "h2", text: {
        es: "1 · Erfoud → Khamlia por el lago salado",
        en: "1 · Erfoud → Khamlia via the salt lake",
        fr: "1 · Erfoud → Khamlia par le lac salé" } },
      { type: "p", text: {
        es: "80 km de pista que bordea el Dayet Srji, un lago seco que en febrero se llena y atrae flamencos rosados. Termina en Khamlia, donde se ofrece un concierto privado de gnaoua.",
        en: "80 km of track skirting Dayet Srji, a dry lake that fills up in February and attracts pink flamingos. Ends in Khamlia with a private gnawa concert.",
        fr: "80 km de piste longeant le Dayet Srji, lac asséché qui se remplit en février et attire les flamants roses. Arrivée à Khamlia avec un concert privé de gnawa." } },

      { type: "h2", text: {
        es: "2 · Garganta del Todra y meseta de Jbel Saghro",
        en: "2 · Todra gorge and Jbel Saghro plateau",
        fr: "2 · Gorges du Todra et plateau du Jbel Saghro" } },
      { type: "p", text: {
        es: "Subes por las gargantas del Todra hasta los 2 700 m, cruzas la meseta del Saghro entre nómadas bereberes y desciendes por el otro lado hacia el Drâa. Una jornada larga pero de las más espectaculares.",
        en: "You climb the Todra gorges up to 2,700 m, cross the Saghro plateau between Berber nomads and descend the other side towards the Drâa. A long day but one of the most spectacular.",
        fr: "Vous montez par les gorges du Todra jusqu'à 2 700 m, traversez le plateau du Saghro entre nomades berbères et redescendez de l'autre côté vers le Drâa. Une longue journée mais des plus spectaculaires." } },

      { type: "h2", text: {
        es: "3 · Lago Iriqui · el «mar fantasma» del Sáhara",
        en: "3 · Lake Iriqui · the Sahara's 'ghost sea'",
        fr: "3 · Lac Iriqui · la « mer fantôme » du Sahara" } },
      { type: "p", text: {
        es: "Hace 30 años el Iriqui era el lago natural más grande del sur. Hoy es una llanura blanca de sal que se cruza durante una hora sin ver nada salvo el horizonte. Surrealismo puro.",
        en: "Thirty years ago, Iriqui was the largest natural lake in the south. Today it's a white salt plain you cross for an hour with nothing but the horizon. Pure surrealism.",
        fr: "Il y a 30 ans, l'Iriqui était le plus grand lac naturel du sud. Aujourd'hui c'est une plaine blanche de sel qu'on traverse une heure sans rien voir d'autre que l'horizon. Pur surréalisme." } },

      { type: "h2", text: {
        es: "4 · Tafraoute y las rocas pintadas",
        en: "4 · Tafraoute and the painted rocks",
        fr: "4 · Tafraoute et les rochers peints" } },
      { type: "p", text: {
        es: "En el Anti-Atlas, el belga Jean Verame pintó en 1984 una colección de rocas en azul, rojo y morado. Sigue ahí. La pista llega después de 3 horas de polvo y cabras.",
        en: "In the Anti-Atlas, Belgian artist Jean Verame painted a series of rocks in blue, red and purple in 1984. Still there. The track gets you there after 3 hours of dust and goats.",
        fr: "Dans l'Anti-Atlas, l'artiste belge Jean Verame a peint en 1984 une série de rochers en bleu, rouge et violet. Toujours là. La piste y mène après 3 heures de poussière et de chèvres." } },

      { type: "h2", text: {
        es: "5 · Mhamid → Erg Chigaga (las dunas que no son Merzouga)",
        en: "5 · Mhamid → Erg Chigaga (the dunes that aren't Merzouga)",
        fr: "5 · Mhamid → Erg Chigaga (les dunes qui ne sont pas Merzouga)" } },
      { type: "p", text: {
        es: "Las dunas más grandes de Marruecos no son las del Erg Chebbi — son las del Chigaga, accesibles sólo en 4x4 desde M'hamid. 40 km de pista de arena y un bivouac sin otro ser humano en 50 km a la redonda.",
        en: "Morocco's largest dunes aren't Erg Chebbi — they're Chigaga, accessible only by 4x4 from M'hamid. 40 km of sand track and a bivouac with no other human within 50 km.",
        fr: "Les plus grandes dunes du Maroc ne sont pas l'Erg Chebbi — ce sont celles du Chigaga, accessibles uniquement en 4x4 depuis M'hamid. 40 km de piste de sable et un bivouac sans aucun autre humain dans un rayon de 50 km." } },
    ],
  },

  {
    id: "comer-sur-marruecos",
    slug: "que-comer-sur-marruecos",
    category: "cultura",
    cover: IMG.riadInterior,
    readingTime: 6,
    publishedAt: "2026-01-12",
    author: "Equipo Xaluca",
    keywords: ["gastronomía sur marruecos", "tagine cordero", "que comer marrakech", "comida bereber"],
    cta: {
      route: "tourEscapadaMarrakech",
      eyebrow: { es: "Pruébalos todos", en: "Taste them all", fr: "Goûtez-les tous" },
      title:   { es: "Escapada a Marrakech · 3 noches", en: "Marrakech short escape · 3 nights", fr: "Escapade à Marrakech · 3 nuits" },
      body:    { es: "Incluye clase privada de cocina bereber con visita al zoco junto a la cocinera anfitriona.",
                 en: "Includes a private Berber cooking class with a souk visit alongside our host cook.",
                 fr: "Inclut un cours privé de cuisine berbère avec visite du souk aux côtés de la cuisinière hôte." },
    },
    title: {
      es: "Más allá del tagine: 8 platos del sur de Marruecos que no encuentras en Marrakech",
      en: "Beyond tagine: 8 dishes from southern Morocco you won't find in Marrakech",
      fr: "Au-delà du tajine : 8 plats du sud du Maroc que vous ne trouverez pas à Marrakech",
    },
    excerpt: {
      es: "El sur tiene su propia cocina: bereber, sin prisas, con ingredientes del desierto. Estos 8 platos justifican un viaje sólo por probarlos.",
      en: "The south has its own kitchen: Berber, unhurried, with desert ingredients. These 8 dishes justify a trip on their own.",
      fr: "Le sud a sa propre cuisine : berbère, sans hâte, avec des ingrédients du désert. Ces 8 plats justifient un voyage à eux seuls.",
    },
    body: [
      { type: "list", items: [
        { es: "Médfouna · pizza bereber rellena de cordero, almendras y especias, cocinada en horno de barro bajo la arena.",
          en: "Medfouna · Berber pizza stuffed with lamb, almonds and spices, baked in an earth oven under the sand.",
          fr: "Médfouna · pizza berbère farcie d'agneau, d'amandes et d'épices, cuite au four de terre sous le sable." },
        { es: "Tanjia marrakchí · cordero cocido 12 horas en una olla de barro al rescoldo de las brasas del hammam.",
          en: "Tanjia of Marrakech · lamb slow-cooked 12 hours in an earthen pot in the embers of a hammam.",
          fr: "Tanjia marrakchie · agneau cuit 12 heures dans une jarre en terre dans les braises d'un hammam." },
        { es: "Couscous con siete verduras · sólo se sirve los viernes, plato familiar por excelencia.",
          en: "Seven-vegetable couscous · only served on Fridays, the family dish par excellence.",
          fr: "Couscous aux sept légumes · servi uniquement le vendredi, le plat familial par excellence." },
        { es: "Bisara · sopa de habas con aceite de oliva, comino y pimentón. El desayuno del sur.",
          en: "Bisara · fava bean soup with olive oil, cumin and paprika. The south's breakfast.",
          fr: "Bisara · soupe de fèves à l'huile d'olive, cumin et paprika. Le petit-déjeuner du sud." },
        { es: "Pastilla de paloma · hojaldre dulce-salado de paloma, almendra y canela. Festín en bodas bereberes.",
          en: "Pigeon pastilla · sweet-savoury filo with pigeon, almond and cinnamon. Feast at Berber weddings.",
          fr: "Pastilla de pigeon · feuilleté sucré-salé au pigeon, amande et cannelle. Festin aux mariages berbères." },
        { es: "Khlea · cordero confitado al sol durante semanas. Se conserva un año y se sirve con huevos al sartén.",
          en: "Khlea · lamb confited under the sun for weeks. Keeps for a year and is served with eggs.",
          fr: "Khlea · agneau confit au soleil pendant des semaines. Se conserve un an, servi avec des œufs." },
        { es: "Dátiles Mejhoul de Erfoud · los mejores dátiles del mundo según la FAO. Cómpralos en la cooperativa.",
          en: "Mejhoul dates from Erfoud · the world's best dates according to FAO. Buy them at the cooperative.",
          fr: "Dattes Mejhoul d'Erfoud · les meilleures dattes du monde selon la FAO. Achetez-les à la coopérative." },
        { es: "Té à la nana · más que una bebida, un ritual de hospitalidad. Tres rondas con tres sabores distintos.",
          en: "Mint tea à la nana · more than a drink, a hospitality ritual. Three rounds, three different flavours.",
          fr: "Thé à la nana · plus qu'une boisson, un rituel d'hospitalité. Trois services, trois saveurs différentes." },
      ]},
      { type: "callout", title: {
        es: "Cooking class en Erfoud", en: "Cooking class in Erfoud", fr: "Cours de cuisine à Erfoud",
      }, text: {
        es: "Para los viajeros con tiempo, organizamos una clase privada de cocina bereber con la familia anfitriona de uno de nuestros hoteles. Empiezas yendo al zoco con la cocinera para elegir los ingredientes.",
        en: "For travellers with time, we organise a private Berber cooking class with the host family at one of our hotels. You start by going to the souk with the cook to pick the ingredients.",
        fr: "Pour les voyageurs qui ont le temps, nous organisons un cours privé de cuisine berbère avec la famille hôte de l'un de nos hôtels. Vous commencez par aller au souk avec la cuisinière pour choisir les ingrédients.",
      }},
    ],
  },
];

/* Helpers */
export const getPostBySlug = (slug) => POSTS.find((p) => p.slug === slug) || null;
export const getPostsByCategory = (cat) =>
  cat === "all" ? POSTS : POSTS.filter((p) => p.category === cat);
