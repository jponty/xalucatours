/* ============================================================
   dayTestimonials — short, day-specific traveller testimonials
   shown in the right column of every programme day, just below
   the "Asistente Virtual" / "Contactar" buttons.

   Goal: a DIFFERENT testimonial for EACH day of EACH trip, whose
   content matches the experiences / places / activities of that
   specific day, so the social proof feels natural and reinforces
   the itinerary's credibility.

   How it works:
   • A few days are hand-curated in OVERRIDES (keyed routeId → dayId).
   • Every other day is AUTO-DERIVED from the day's own title/body:
       1) we detect the day's highlight (iconic place) or theme
          (arrival, desert, mountain, gorges, city, coast, market,
           oasis, relax, return…), and pick a matching quote;
       2) we assign a traveller or couple name,
          chosen DETERMINISTICALLY from the trip+day id (stable
          across renders/sessions, varied across days).
   `author` is a plain name (same in every language) and `quote` is
   trilingual. Returns null only when no day is given.
============================================================ */

const AUTHORS = [
  "Marta & Javier", "Claudia R.", "Elena M.", "Carlos D.", "Inés & Pablo",
  "Lucía F.", "Sergio & Ana", "David G.", "Marina L.", "Andrés P.",
  "Cristina & Hugo", "Raquel S.", "Jorge M.", "Patricia & Luis", "Nuria V.",
  "Alberto C.", "Sara & Diego", "Miguel Á.", "Beatriz R.", "Daniel & Laura",
  "Óscar & Nuria", "Rocío G.", "Pablo & Marta", "Teresa N.", "Iván S.",
  "Carmen & Ramón",
];

/* Deterministic djb2 hash → non-negative int. */
const hash = (s) => {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0;
  return Math.abs(h);
};

/* ---- Iconic place quotes (checked first; ordered so a day's scenic
   highlight wins over its departure city). ---- */
const PLACES = [
  {
    re: /erg\s*chebbi|merzouga|erg\s*chigaga/i,
    quotes: [{
      es: "Las dunas de Erg Chebbi y la noche en el campamento fueron lo mejor del viaje. El cielo estrellado no se puede ni describir.",
      en: "The Erg Chebbi dunes and the night at the camp were the best of the trip. The starry sky is simply indescribable.",
      fr: "Les dunes de l'Erg Chebbi et la nuit au campement furent le meilleur du voyage. Le ciel étoilé est tout simplement indescriptible.",
    }],
  },
  {
    re: /a[ïi]t\s*ben\s*haddou/i,
    quotes: [{
      es: "Aït Ben Haddou parece sacado de una película, y de hecho lo está. Subir a lo alto del ksar al atardecer fue espectacular.",
      en: "Aït Ben Haddou looks straight out of a film — and it is. Climbing to the top of the ksar at sunset was spectacular.",
      fr: "Aït Ben Haddou semble sorti d'un film — et c'est le cas. Monter en haut du ksar au coucher du soleil fut spectaculaire.",
    }],
  },
  {
    re: /chefchaouen|chaouen/i,
    quotes: [{
      es: "Chefchaouen es tan azul y tranquila como imaginábamos. Cada callejuela era una foto; nos quedamos sin batería en el móvil.",
      en: "Chefchaouen is as blue and peaceful as we imagined. Every alley was a photo; our phones ran out of battery.",
      fr: "Chefchaouen est aussi bleue et paisible que nous l'imaginions. Chaque ruelle était une photo ; nos téléphones se sont déchargés.",
    }],
  },
  {
    re: /todra|todgha/i,
    quotes: [{
      es: "Las gargantas del Todra te dejan diminuto: paredes altísimas y un riachuelo al fondo. Una maravilla de la naturaleza.",
      en: "The Todra gorges make you feel tiny: towering walls and a stream at the bottom. A wonder of nature.",
      fr: "Les gorges du Todra vous rendent minuscule : parois immenses et ruisseau au fond. Une merveille de la nature.",
    }],
  },
  {
    re: /dad[eè]s/i,
    quotes: [{
      es: "Las curvas del valle del Dades son hipnóticas. Paramos en los miradores para hacer fotos y el paisaje no defraudó.",
      en: "The Dades valley switchbacks are hypnotic. We stopped at the viewpoints for photos and the scenery didn't disappoint.",
      fr: "Les lacets de la vallée du Dadès sont hypnotiques. Arrêts aux belvédères pour les photos : le paysage n'a pas déçu.",
    }],
  },
  {
    re: /essaouira|mogador/i,
    quotes: [{
      es: "La brisa atlántica de Essaouira fue el respiro perfecto. Pescado fresco en el puerto y murallas con encanto: un día delicioso.",
      en: "The Atlantic breeze of Essaouira was the perfect break. Fresh fish at the port and charming ramparts: a delightful day.",
      fr: "La brise atlantique d'Essaouira fut la pause parfaite. Poisson frais au port et remparts pleins de charme : une journée délicieuse.",
    }],
  },
  {
    re: /volubilis|mekn[eè]s/i,
    quotes: [{
      es: "Meknes y las ruinas romanas de Volubilis fueron una sorpresa cultural enorme. Historia por todas partes.",
      en: "Meknes and the Roman ruins of Volubilis were a huge cultural surprise. History everywhere.",
      fr: "Meknès et les ruines romaines de Volubilis furent une énorme surprise culturelle. De l'histoire partout.",
    }],
  },
  {
    re: /agafay/i,
    quotes: [{
      es: "El desierto de Agafay, tan cerca de Marrakech, fue una sorpresa: cena bajo las estrellas y un silencio increíble.",
      en: "The Agafay desert, so close to Marrakech, was a surprise: dinner under the stars and incredible silence.",
      fr: "Le désert d'Agafay, si proche de Marrakech, fut une surprise : dîner sous les étoiles et un silence incroyable.",
    }],
  },
  {
    re: /m'?goun|boutaghrar|imlil|toubkal/i,
    quotes: [{
      es: "Las aldeas bereberes de la montaña, colgadas entre cumbres, nos robaron el corazón. El chófer conocía cada historia.",
      en: "The Berber mountain villages, clinging between peaks, stole our hearts. Our driver knew every story.",
      fr: "Les villages berbères de la montagne, accrochés entre les cimes, nous ont volé le cœur. Le chauffeur connaissait chaque histoire.",
    }],
  },
  {
    re: /rissani/i,
    quotes: [{
      es: "El zoco de Rissani es puro Marruecos: colores, aromas y dátiles recién cogidos. Una experiencia muy auténtica.",
      en: "The Rissani souk is pure Morocco: colours, aromas and freshly picked dates. A very authentic experience.",
      fr: "Le souk de Rissani, c'est le Maroc pur : couleurs, arômes et dattes fraîchement cueillies. Une expérience très authentique.",
    }],
  },
  {
    re: /khamlia|gnawa|gnaoua/i,
    quotes: [{
      es: "Escuchar música gnawa en Khamlia fue emocionante. Un día que combina naturaleza y cultura como pocos.",
      en: "Listening to Gnawa music in Khamlia was moving. A day that blends nature and culture like few others.",
      fr: "Écouter la musique gnawa à Khamlia fut émouvant. Une journée qui mêle nature et culture comme peu d'autres.",
    }],
  },
  {
    re: /\bziz\b|palmeral/i,
    quotes: [{
      es: "El palmeral del valle del Ziz, interminable y verde entre montañas áridas, fue una despedida preciosa del sur.",
      en: "The endless green palm grove of the Ziz valley, amid arid mountains, was a beautiful farewell to the south.",
      fr: "La palmeraie sans fin de la vallée du Ziz, verte au milieu des montagnes arides, fut un magnifique adieu au sud.",
    }],
  },
  {
    re: /ouarzazate/i,
    quotes: [{
      es: "Ouarzazate y sus estudios de cine nos sorprendieron. La organización del día y el alojamiento, impecables.",
      en: "Ouarzazate and its film studios surprised us. The day's organisation and the hotel were impeccable.",
      fr: "Ouarzazate et ses studios de cinéma nous ont surpris. L'organisation de la journée et l'hôtel, impeccables.",
    }],
  },
  {
    re: /oud[ae]yas|rabat/i,
    quotes: [{
      es: "Rabat nos encantó: la Torre Hassan y la kasbah de los Oudayas, con ese azul y blanco, son una joya tranquila.",
      en: "We loved Rabat: the Hassan Tower and the Oudayas kasbah, with that blue and white, are a peaceful gem.",
      fr: "Rabat nous a enchantés : la Tour Hassan et la kasbah des Oudayas, en bleu et blanc, sont un joyau paisible.",
    }],
  },
  {
    re: /t[áa]nger|tetu[áa]n|asilah|chaouen/i,
    quotes: [{
      es: "Tánger, entre dos mares, tiene un encanto especial. La medina y las vistas del Estrecho merecen mucho la pena.",
      en: "Tangier, between two seas, has a special charm. The medina and the views of the Strait are well worth it.",
      fr: "Tanger, entre deux mers, a un charme particulier. La médina et les vues sur le Détroit valent vraiment le détour.",
    }],
  },
  {
    re: /\bfe[zs]\b|chouara/i,
    quotes: [{
      es: "La medina de Fez es un laberinto fascinante. Ver las curtidurías de Chouara desde una terraza fue impresionante.",
      en: "The Fez medina is a fascinating maze. Seeing the Chouara tanneries from a terrace was breathtaking.",
      fr: "La médina de Fès est un labyrinthe fascinant. Voir les tanneries de Chouara depuis une terrasse fut impressionnant.",
    }],
  },
  {
    re: /marrakech|koutoubia|jema|djemaa|el-fna|el fna/i,
    quotes: [
      {
        es: "Perdernos por la medina de Marrakech con el guía fue mágico: los zocos, la Koutoubia y una Djemaa el-Fna que de noche es otra ciudad.",
        en: "Getting lost in the Marrakech medina with our guide was magical: the souks, the Koutoubia and a Djemaa el-Fna that becomes another city at night.",
        fr: "Se perdre dans la médina de Marrakech avec le guide fut magique : les souks, la Koutoubia et une Djemaa el-Fna qui devient une autre ville la nuit.",
      },
      {
        es: "Marrakech nos enamoró desde el primer paso. El regateo en el zoco y el té con menta fueron justo la experiencia que buscábamos.",
        en: "Marrakech won us over from the first step. Haggling in the souk and the mint tea were exactly the experience we were after.",
        fr: "Marrakech nous a conquis dès le premier pas. Le marchandage au souk et le thé à la menthe : exactement ce que nous cherchions.",
      },
    ],
  },
];

/* ---- Theme quotes (checked after places). ---- */
const THEMES = [
  {
    key: "arrival",
    re: /llegada|aeropuerto|recogida|traslado al|arrival|airport|arriv[ée]e|a[ée]roport/i,
    quotes: [
      {
        es: "La llegada fue impecable: vuelo, recogida y traslado al hotel sin una sola preocupación. Empezar así da mucha confianza.",
        en: "The arrival was flawless: flight, pick-up and transfer to the hotel without a single worry. Starting like this builds real trust.",
        fr: "L'arrivée fut impeccable : vol, accueil et transfert à l'hôtel sans le moindre souci. Commencer ainsi met en confiance.",
      },
      {
        es: "Nos recibieron con una sonrisa y todo estaba listo a nuestra llegada. El primer día ya prometía un gran viaje.",
        en: "We were welcomed with a smile and everything was ready on arrival. The first day already promised a great trip.",
        fr: "Accueil chaleureux et tout était prêt à notre arrivée. Dès le premier jour, le voyage s'annonçait formidable.",
      },
    ],
  },
  {
    key: "return",
    re: /regreso|vuelta a casa|despedida|[úu]ltimo d[íi]a|return|farewell|retour/i,
    quotes: [{
      es: "El último tramo fue una despedida perfecta. Volvimos a casa con la sensación de un viaje redondo de principio a fin.",
      en: "The final stretch was a perfect farewell. We came home feeling the trip had been perfectly rounded from start to finish.",
      fr: "La dernière étape fut un adieu parfait. Nous sommes rentrés avec le sentiment d'un voyage parfait du début à la fin.",
    }],
  },
  {
    key: "desert",
    re: /desierto|dunas|bivo?uac|campamento|dromedario|camello|s[áa]hara|sahara|erg/i,
    quotes: [
      {
        es: "Cruzar las dunas en dromedario y dormir en el campamento bajo un manto de estrellas fue la noche de nuestras vidas.",
        en: "Crossing the dunes on a camel and sleeping at the camp under a blanket of stars was the night of our lives.",
        fr: "Traverser les dunes à dromadaire et dormir au campement sous un manteau d'étoiles : la nuit de notre vie.",
      },
      {
        es: "El amanecer sobre el desierto, en silencio absoluto, fue puro sobrecogimiento. No hay foto que le haga justicia.",
        en: "Sunrise over the desert, in absolute silence, was pure awe. No photo does it justice.",
        fr: "Le lever du soleil sur le désert, en silence absolu, fut un émerveillement total. Aucune photo ne lui rend justice.",
      },
    ],
  },
  {
    key: "gorges",
    re: /gargant|gorges|desfiladero|ca[ñn][óo]n/i,
    quotes: [{
      es: "Las gargantas, con sus paredes verticales, te hacen sentir minúsculo. Un paisaje de otro planeta.",
      en: "The gorges, with their vertical walls, make you feel tiny. A landscape from another planet.",
      fr: "Les gorges, avec leurs parois verticales, vous rendent minuscule. Un paysage d'une autre planète.",
    }],
  },
  {
    key: "mountain",
    re: /atlas|tizi|puerto de monta|monta[ñn]|cumbre|valle del|cordillera/i,
    quotes: [
      {
        es: "El paso por el Alto Atlas, con sus puertos y pueblos de piedra, es de una belleza que corta la respiración.",
        en: "The drive through the High Atlas, with its passes and stone villages, is breathtakingly beautiful.",
        fr: "La traversée du Haut Atlas, avec ses cols et ses villages de pierre, est d'une beauté à couper le souffle.",
      },
      {
        es: "Cada curva del Atlas regalaba una vista mejor que la anterior. Paramos mil veces y mereció la pena.",
        en: "Every bend in the Atlas offered a better view than the last. We stopped a thousand times and it was worth it.",
        fr: "Chaque virage de l'Atlas offrait une vue meilleure que la précédente. Mille arrêts, et ça valait le coup.",
      },
    ],
  },
  {
    key: "coast",
    re: /costa|oc[ée]ano|atl[áa]ntico|playa|puerto|mar\b|coast|beach/i,
    quotes: [{
      es: "La costa atlántica fue una bocanada de aire fresco: brisa, pescado recién hecho y un ambiente relajado encantador.",
      en: "The Atlantic coast was a breath of fresh air: breeze, freshly cooked fish and a lovely relaxed atmosphere.",
      fr: "La côte atlantique fut une bouffée d'air frais : brise, poisson tout juste cuisiné et une ambiance détendue charmante.",
    }],
  },
  {
    key: "market",
    re: /mercado|zoco|souk|rissani/i,
    quotes: [{
      es: "El mercado fue una explosión de colores y aromas. Probamos especias y dátiles; una experiencia muy auténtica.",
      en: "The market was an explosion of colours and aromas. We tasted spices and dates; a very authentic experience.",
      fr: "Le marché fut une explosion de couleurs et d'arômes. Nous avons goûté épices et dattes ; une expérience très authentique.",
    }],
  },
  {
    key: "oasis",
    re: /palmeral|oasis|palmer|skoura|valle/i,
    quotes: [{
      es: "El palmeral, verde e interminable entre montañas áridas, fue una sorpresa preciosa. Un oasis de verdad.",
      en: "The palm grove, green and endless amid arid mountains, was a beautiful surprise. A true oasis.",
      fr: "La palmeraie, verte et sans fin au milieu des montagnes arides, fut une belle surprise. Un véritable oasis.",
    }],
  },
  {
    key: "relax",
    re: /relax|piscina|hammam|descanso|spa|libre/i,
    quotes: [{
      es: "Un día más tranquilo con piscina y hammam fue justo lo que necesitábamos. El hotel, una maravilla.",
      en: "A calmer day with pool and hammam was exactly what we needed. The hotel was wonderful.",
      fr: "Une journée plus tranquille avec piscine et hammam : exactement ce qu'il nous fallait. L'hôtel, une merveille.",
    }],
  },
  {
    key: "city",
    re: /medina|ciudad|kasbah|ks[ae]r|palacio|mezquita|murall/i,
    quotes: [
      {
        es: "Recorrer la medina con guía fue todo un descubrimiento: artesanos, zocos y rincones que solos jamás habríamos encontrado.",
        en: "Exploring the medina with a guide was a real discovery: artisans, souks and corners we'd never have found on our own.",
        fr: "Parcourir la médina avec un guide fut une vraie découverte : artisans, souks et recoins que nous n'aurions jamais trouvés seuls.",
      },
      {
        es: "La ciudad nos cautivó con su mezcla de historia, color y vida. Un día intenso y lleno de detalles.",
        en: "The city captivated us with its blend of history, colour and life. An intense day full of details.",
        fr: "La ville nous a captivés par son mélange d'histoire, de couleur et de vie. Une journée intense et riche en détails.",
      },
    ],
  },
];

const GENERAL = [
  {
    es: "Una jornada espléndida, muy bien organizada y con paisajes que no olvidaremos. La repetiríamos sin pensarlo.",
    en: "A splendid day, very well organised and with landscapes we won't forget. We'd do it again without hesitation.",
    fr: "Une journée splendide, très bien organisée, avec des paysages inoubliables. Nous recommencerions sans hésiter.",
  },
  {
    es: "Todo salió a la perfección: el ritmo, los alojamientos y un equipo siempre pendiente de nosotros. Inmejorable.",
    en: "Everything went perfectly: the pace, the hotels and a team always looking after us. Couldn't be better.",
    fr: "Tout s'est déroulé à la perfection : le rythme, les hébergements et une équipe toujours attentive. Imbattable.",
  },
];

/* Build the searchable text for a day (title + body, all languages). */
const dayText = (day) => {
  const parts = [];
  const t = day.title;
  const b = day.body;
  if (t) parts.push(t.es || "", t.en || "", t.fr || "");
  if (b) parts.push((b.es || "").slice(0, 240));
  return parts.join(" ");
};

const pickQuotePool = (day) => {
  const text = dayText(day);
  for (const p of PLACES) if (p.re.test(text)) return p.quotes;
  for (const th of THEMES) if (th.re.test(text)) return th.quotes;
  return GENERAL;
};

/* ---- Hand-curated overrides (origins ALWAYS Spanish). ---- */
const OVERRIDES = {
  tourAtlasDesierto67: {
    "dia-1": {
      rating: 5, author: "Marta & Javier",      quote: {
        es: "Llegamos de noche a Ouarzazate y despertar en el Hotel Xaluca Dades, con el Alto Atlas asomando por la ventana, fue el mejor comienzo posible. El traslado, puntual y todo cuidado al detalle.",
        en: "We arrived in Ouarzazate at night and waking up at Hotel Xaluca Dades, with the High Atlas peeking through the window, was the best possible start. The transfer was on time and every detail taken care of.",
        fr: "Nous sommes arrivés de nuit à Ouarzazate et se réveiller à l'Hotel Xaluca Dades, avec le Haut Atlas par la fenêtre, fut le meilleur des débuts. Transfert ponctuel et tout soigné dans le moindre détail.",
      },
    },
    "dia-atlas-mgoun": {
      rating: 5, author: "Claudia R.",      quote: {
        es: "El día por el Atlas Central nos dejó sin palabras: aldeas bereberes colgadas de la montaña y el macizo del M'Goun de fondo. Nuestro chófer conocía cada rincón y cada historia.",
        en: "The day through the Central Atlas left us speechless: Berber villages clinging to the mountainside and the M'Goun massif behind. Our driver knew every corner and every story.",
        fr: "La journée dans l'Atlas central nous a laissés sans voix : villages berbères accrochés à la montagne et massif du M'Goun en toile de fond. Notre chauffeur connaissait chaque recoin et chaque histoire.",
      },
    },
    "dia-dades-todra": {
      rating: 5, author: "Óscar & Nuria",      quote: {
        es: "Las curvas del Dades y las paredes verticales del Todra son de otro planeta. Paramos donde quisimos para hacer fotos; nunca sentimos prisa.",
        en: "The Dades switchbacks and the vertical walls of the Todra are out of this world. We stopped wherever we liked for photos; we never felt rushed.",
        fr: "Les lacets du Dadès et les parois verticales du Todra sont d'un autre monde. Nous nous arrêtions où nous voulions pour les photos ; jamais pressés.",
      },
    },
    "dia-2": {
      rating: 5, author: "Elena M.",      quote: {
        es: "La llegada en dromedario a las dunas de Erg Chebbi y la noche en el campamento, bajo un cielo imposible de estrellas, fue sin duda la noche de nuestras vidas.",
        en: "Riding a camel into the Erg Chebbi dunes and the night at the camp, under an impossible sky full of stars, was without doubt the night of our lives.",
        fr: "L'arrivée à dromadaire dans les dunes de l'Erg Chebbi et la nuit au campement, sous un ciel d'étoiles incroyable, fut sans aucun doute la nuit de notre vie.",
      },
    },
    "dia-3": {
      rating: 5, author: "Raquel & Hugo",      quote: {
        es: "Ver salir el sol sobre el erg y después escuchar la música gnawa en Khamlia fue pura emoción. Un día que mezcla naturaleza y cultura a partes iguales.",
        en: "Watching the sun rise over the erg and then hearing Gnawa music in Khamlia was pure emotion. A day that blends nature and culture in equal measure.",
        fr: "Voir le soleil se lever sur l'erg puis écouter la musique gnawa à Khamlia, pure émotion. Une journée qui mêle nature et culture à parts égales.",
      },
    },
    "dia-4-rissani": {
      rating: 5, author: "Carlos D.",      quote: {
        es: "El zoco de Rissani es un torbellino de colores y aromas; probamos dátiles recién cogidos. Por la tarde, la piscina del hotel fue el premio perfecto.",
        en: "The Rissani souk is a whirl of colours and aromas; we tasted freshly picked dates. In the afternoon, the hotel pool was the perfect reward.",
        fr: "Le souk de Rissani est un tourbillon de couleurs et d'arômes ; nous avons goûté des dattes fraîchement cueillies. L'après-midi, la piscine de l'hôtel fut la récompense parfaite.",
      },
    },
    "dia-ziz-return": {
      rating: 5, author: "Inés & Pablo",      quote: {
        es: "El palmeral del Ziz es una despedida preciosa. Volvimos a casa con la sensación de haber vivido un viaje redondo, bien organizado de principio a fin.",
        en: "The Ziz palm grove is a beautiful farewell. We came home feeling we'd lived a perfectly rounded trip, well organised from start to finish.",
        fr: "La palmeraie du Ziz est un adieu magnifique. Nous sommes rentrés avec le sentiment d'un voyage parfait, bien organisé du début à la fin.",
      },
    },
  },
};

/* Auto-derive a stable, day-specific testimonial.
   The quote is keyed to the day's content (place/theme). Authors are spaced
   by day position so each programme gets varied, deterministic travellers. */
const autoTestimonial = (routeId, day, dayIndex = 1) => {
  const seed = `${routeId}|${day.id || ""}`;
  const pool = pickQuotePool(day);
  const quote = pool[hash(seed + "#q") % pool.length];
  const di = (dayIndex | 0) || 1;
  const author = AUTHORS[(hash(routeId + "#a") + di * 11) % AUTHORS.length];
  return { rating: 5, author, quote };
};

/**
 * getDayTestimonial(routeId, day) — returns a testimonial for the given
 * programme day. `day` is the day object (needs id/title/body). Curated
 * overrides win; otherwise one is auto-derived. Returns null only when no
 * day is provided.
 */
export const getDayTestimonial = (routeId, day, dayIndex) => {
  if (!day) return null;
  const override = OVERRIDES[routeId] && OVERRIDES[routeId][day.id];
  if (override) return override;
  return autoTestimonial(routeId, day, dayIndex);
};

export default getDayTestimonial;
