/* ============================================================
   Place testimonials — contextual traveller reviews per DESTINATION
   shown on /que-ver-en-Marruecos, keyed by the page's card `id`.
   Consumed by <CircuitTestimonials items={...} /> (same parchment
   carousel as the trip pages). Each entry is destination-specific so
   the content never feels generic.

   quote = trilingual object · author / origin = strings · rating 1..5
============================================================ */
export const PLACE_TESTIMONIALS = {
  /* ── Ciudades imperiales ───────────────────────────────── */
  marrakech: [
    { rating: 5, author: "Marta & Javier", origin: "Madrid",
      quote: {
        es: "Jemaa el-Fna al atardecer es puro caos hermoso. Nuestro guía nos llevó por zocos que jamás habríamos encontrado solos.",
        en: "Jemaa el-Fna at sunset is beautiful chaos. Our guide took us through souks we'd never have found alone.",
        fr: "Jemaa el-Fna au coucher du soleil, c'est un chaos magnifique. Notre guide nous a emmenés dans des souks introuvables seuls.",
      } },
    { rating: 5, author: "Cristina P.", origin: "Sevilla",
      quote: {
        es: "Los jardines Majorelle y un riad escondido tras una puerta diminuta. Marrakech te atrapa por completo.",
        en: "The Majorelle Gardens and a riad hidden behind a tiny door. Marrakech captures you completely.",
        fr: "Les jardins Majorelle et un riad caché derrière une porte minuscule. Marrakech vous envoûte totalement.",
      } },
    { rating: 5, author: "Lucía & Adrián", origin: "Valencia",
      quote: {
        es: "Cenar en una terraza con la Koutoubia iluminada de fondo fue el mejor final de viaje posible.",
        en: "Dining on a rooftop with the lit Koutoubia behind us was the best possible end to the trip.",
        fr: "Dîner sur une terrasse avec la Koutoubia illuminée en fond fut la plus belle fin de voyage possible.",
      } },
  ],
  fez: [
    { rating: 5, author: "Elena R.", origin: "Bilbao",
      quote: {
        es: "Perderse en la medina de Fez es perderse en otro siglo. Las curtidurías Chouara huelen y deslumbran a la vez.",
        en: "Getting lost in Fez's medina is getting lost in another century. The Chouara tanneries dazzle and overwhelm at once.",
        fr: "Se perdre dans la médina de Fès, c'est se perdre dans un autre siècle. Les tanneries Chouara éblouissent et étourdissent à la fois.",
      } },
    { rating: 5, author: "Pablo M.", origin: "Zaragoza",
      quote: {
        es: "Ver al-Qarawiyyin, la universidad más antigua del mundo, con alguien que conoce su historia, no tiene precio.",
        en: "Seeing al-Qarawiyyin, the world's oldest university, with someone who knows its history is priceless.",
        fr: "Voir al-Qarawiyyin, la plus ancienne université du monde, avec quelqu'un qui en connaît l'histoire, ça n'a pas de prix.",
      } },
    { rating: 5, author: "Elena D.", origin: "San Sebastián",
      quote: {
        es: "Callejuelas que no caben en ningún GPS y artesanos en cada esquina. Fez es la medina más viva que hemos pisado.",
        en: "Alleys no GPS can map and craftsmen on every corner. Fez is the most alive medina we've ever walked.",
        fr: "Des ruelles qu'aucun GPS ne cartographie et des artisans à chaque coin. Fès est la médina la plus vivante que nous ayons foulée.",
      } },
  ],
  meknes: [
    { rating: 5, author: "Sofía L.", origin: "Granada",
      quote: {
        es: "Bab Mansour al amanecer, casi sin turistas. Meknès es la ciudad imperial más tranquila y nos enamoró.",
        en: "Bab Mansour at dawn, almost without tourists. Meknès is the calmest imperial city and we fell for it.",
        fr: "Bab Mansour à l'aube, presque sans touristes. Meknès est la cité impériale la plus paisible et nous a séduits.",
      } },
    { rating: 5, author: "Nuria & Carlos", origin: "Pamplona",
      quote: {
        es: "Las cuadras reales y los graneros de Moulay Ismail son impresionantes. Una parada que mucha gente se salta por error.",
        en: "The royal stables and Moulay Ismail's granaries are stunning. A stop too many people skip by mistake.",
        fr: "Les écuries royales et les greniers de Moulay Ismaïl sont impressionnants. Une étape que trop de gens manquent à tort.",
      } },
    { rating: 5, author: "Andrea S.", origin: "Santander",
      quote: {
        es: "La pequeña Versalles marroquí, rodeada de olivares. Tranquila, elegante y muy auténtica.",
        en: "Morocco's little Versailles, surrounded by olive groves. Calm, elegant and very authentic.",
        fr: "La petite Versailles marocaine, entourée d'oliveraies. Paisible, élégante et très authentique.",
      } },
  ],
  rabat: [
    { rating: 5, author: "Daniel V.", origin: "Oviedo",
      quote: {
        es: "La Kasbah de los Udayas sobre el Atlántico es pura postal. Rabat sorprende por su calma frente al mar.",
        en: "The Udayas Kasbah over the Atlantic is a postcard. Rabat surprises with its seaside calm.",
        fr: "La Kasbah des Oudayas surplombant l'Atlantique est une carte postale. Rabat surprend par son calme face à la mer.",
      } },
    { rating: 5, author: "Marina & Hugo", origin: "A Coruña",
      quote: {
        es: "La torre Hassan y el mausoleo Mohammed V, con guía que nos contó cada detalle. Capital muy elegante.",
        en: "The Hassan Tower and Mohammed V mausoleum, with a guide who shared every detail. A very elegant capital.",
        fr: "La tour Hassan et le mausolée Mohammed V, avec un guide qui nous a tout raconté. Une capitale très élégante.",
      } },
    { rating: 5, author: "Sara K.", origin: "Vitoria",
      quote: {
        es: "Callejas azules y blancas de los Udayas, sin masificación. Rabat fue un descubrimiento inesperado.",
        en: "The blue-and-white Udayas lanes, with no crowds. Rabat was an unexpected discovery.",
        fr: "Les ruelles bleues et blanches des Oudayas, sans foule. Rabat fut une découverte inattendue.",
      } },
  ],

  /* ── Desierto del Sáhara ───────────────────────────────── */
  ergchebbi: [
    { rating: 5, author: "Laura & Marc", origin: "Barcelona",
      quote: {
        es: "Dormir en el Erg Chebbi y ver amanecer sobre las dunas fue lo más bonito que hemos vivido viajando.",
        en: "Sleeping at Erg Chebbi and watching sunrise over the dunes was the most beautiful thing we've ever experienced.",
        fr: "Dormir à l'Erg Chebbi et voir le lever du soleil sur les dunes fut le plus beau moment de tous nos voyages.",
      } },
    { rating: 5, author: "Familia Ortega", origin: "Valencia",
      quote: {
        es: "La noche en la jaima, las estrellas y el té con los nómadas… mágico y muy auténtico.",
        en: "The night in the desert camp, the stars and tea with the nomads… magical and so authentic.",
        fr: "La nuit sous la tente, les étoiles et le thé avec les nomades… magique et tellement authentique.",
      } },
    { rating: 5, author: "Iván T.", origin: "Murcia",
      quote: {
        es: "Subir una duna de 150 metros para ver salir el sol sobre Merzouga merece cada gota de sudor.",
        en: "Climbing a 150-metre dune to watch the sun rise over Merzouga is worth every drop of sweat.",
        fr: "Gravir une dune de 150 mètres pour voir le soleil se lever sur Merzouga vaut chaque goutte de sueur.",
      } },
  ],
  ouarzazate: [
    { rating: 5, author: "Carmen B.", origin: "Málaga",
      quote: {
        es: "La kasbah de Taourirt y los estudios de cine: Ouarzazate es la puerta perfecta hacia el desierto.",
        en: "Taourirt Kasbah and the film studios: Ouarzazate is the perfect gateway to the desert.",
        fr: "La kasbah de Taourirt et les studios de cinéma : Ouarzazate est la porte parfaite vers le désert.",
      } },
    { rating: 5, author: "Roberto & Ana", origin: "Valladolid",
      quote: {
        es: "El palmeral milenario de Skoura al atardecer es de otro planeta. Una parada que recordaremos siempre.",
        en: "Skoura's thousand-year-old palm grove at sunset is otherworldly. A stop we'll always remember.",
        fr: "La palmeraie millénaire de Skoura au coucher du soleil est d'un autre monde. Une étape inoubliable.",
      } },
    { rating: 5, author: "Tomás K.", origin: "Burgos",
      quote: {
        es: "Sentir que caminas por un plató de Hollywood y a la vez por un pueblo real del sur. Fascinante.",
        en: "Feeling like you're walking a Hollywood set and a real southern town at once. Fascinating.",
        fr: "Avoir l'impression de marcher sur un plateau d'Hollywood et dans un vrai village du sud. Fascinant.",
      } },
  ],
  aitbenhaddou: [
    { rating: 5, author: "Nuria L.", origin: "Granada",
      quote: {
        es: "Aït Ben Haddou al atardecer parece una película. Cruzar el río hacia la ksar de barro fue inolvidable.",
        en: "Aït Ben Haddou at sunset looks like a film. Crossing the river to the earthen ksar was unforgettable.",
        fr: "Aït Ben Haddou au coucher du soleil ressemble à un film. Traverser la rivière vers le ksar de terre fut inoubliable.",
      } },
    { rating: 5, author: "Diego & Paula", origin: "Salamanca",
      quote: {
        es: "Saber que aquí se rodó Gladiator y Juego de Tronos mientras subes sus murallas pone la piel de gallina.",
        en: "Knowing Gladiator and Game of Thrones were filmed here while climbing its walls gives you chills.",
        fr: "Savoir que Gladiator et Game of Thrones y ont été tournés en grimpant ses remparts donne des frissons.",
      } },
    { rating: 5, author: "Elena & Pablo", origin: "Cádiz",
      quote: {
        es: "La fortaleza de tierra más célebre del Atlas, Patrimonio de la Humanidad. Cada rincón es una foto.",
        en: "The Atlas's most famous earthen fortress, a UNESCO site. Every corner is a photo.",
        fr: "La forteresse de terre la plus célèbre de l'Atlas, classée UNESCO. Chaque recoin est une photo.",
      } },
  ],

  /* ── Cordillera del Atlas ──────────────────────────────── */
  altoatlas: [
    { rating: 5, author: "Marcos & Julia", origin: "Tarragona",
      quote: {
        es: "Cruzar el Tizi n'Tichka entre cumbres nevadas y aldeas bereberes fue el día más espectacular del viaje.",
        en: "Crossing the Tizi n'Tichka among snowy peaks and Berber villages was the most spectacular day of the trip.",
        fr: "Traverser le Tizi n'Tichka entre sommets enneigés et villages berbères fut la plus belle journée du voyage.",
      } },
    { rating: 5, author: "Elena M.", origin: "Bilbao",
      quote: {
        es: "Caminamos entre aldeas de adobe y dormimos bajo cumbres nevadas. Naturaleza y hospitalidad pura.",
        en: "We walked through adobe villages and slept beneath snow-capped peaks. Pure nature and hospitality.",
        fr: "Nous avons marché entre des villages en pisé et dormi sous des sommets enneigés. Nature et hospitalité pures.",
      } },
    { rating: 5, author: "Carla S.", origin: "Ourense",
      quote: {
        es: "El Alto Atlas es un Marruecos verde y silencioso que nadie espera. Té con menta en cada parada.",
        en: "The High Atlas is a green, silent Morocco nobody expects. Mint tea at every stop.",
        fr: "Le Haut Atlas est un Maroc vert et silencieux auquel personne ne s'attend. Thé à la menthe à chaque arrêt.",
      } },
  ],
  imlil: [
    { rating: 5, author: "Nadia & Carlos", origin: "Lleida",
      quote: {
        es: "Subir hacia el Toubkal desde Imlil guiados por Xaluca fue el reto de nuestras vidas. Seguridad total.",
        en: "Climbing toward Toubkal from Imlil guided by Xaluca was the challenge of our lives. Total peace of mind.",
        fr: "Monter vers le Toubkal depuis Imlil guidés par Xaluca fut le défi de notre vie. Sécurité totale.",
      } },
    { rating: 5, author: "Sergio V.", origin: "Oviedo",
      quote: {
        es: "Imlil huele a nogal y a montaña. El punto de partida perfecto para el techo del norte de África.",
        en: "Imlil smells of walnut and mountain. The perfect base for the roof of North Africa.",
        fr: "Imlil sent le noyer et la montagne. Le point de départ parfait pour le toit de l'Afrique du Nord.",
      } },
    { rating: 5, author: "David H.", origin: "Almería",
      quote: {
        es: "Aldea bereber a 1.800 m, mulas cargadas y vistas brutales. Un trekking que recomendaría a cualquiera.",
        en: "A Berber village at 1,800 m, loaded mules and stunning views. A trek I'd recommend to anyone.",
        fr: "Un village berbère à 1 800 m, des mules chargées et des vues incroyables. Un trek à recommander.",
      } },
  ],
  "dades-todra": [
    { rating: 5, author: "Daniel P.", origin: "Zaragoza",
      quote: {
        es: "Las gargantas del Todra son paredes de 300 metros sobre tu cabeza. Impresiona caminar por el cañón.",
        en: "The Todra gorges are 300-metre walls above your head. Walking the canyon is awe-inspiring.",
        fr: "Les gorges du Todra, ce sont 300 mètres de parois au-dessus de vous. Marcher dans le canyon impressionne.",
      } },
    { rating: 5, author: "Beatriz & Álvaro", origin: "Toledo",
      quote: {
        es: "La carretera de las mil kasbahs del Dadès, con sus curvas imposibles, es una de las más bonitas del mundo.",
        en: "The Dadès road of a thousand kasbahs, with its impossible bends, is one of the world's most beautiful.",
        fr: "La route des mille kasbahs du Dadès, avec ses virages impossibles, est l'une des plus belles du monde.",
      } },
    { rating: 5, author: "Lía R.", origin: "Cuenca",
      quote: {
        es: "Dormir en el valle del Dadès rodeados de rosas y rocas rojizas fue un sueño. Paisaje irreal.",
        en: "Sleeping in the Dadès valley surrounded by roses and reddish rock was a dream. Surreal scenery.",
        fr: "Dormir dans la vallée du Dadès, entourés de roses et de roches rougeâtres, fut un rêve. Paysage irréel.",
      } },
  ],

  /* ── Norte de Marruecos ────────────────────────────────── */
  tanger: [
    { rating: 5, author: "Andrea G.", origin: "Málaga",
      quote: {
        es: "Tánger, donde el Mediterráneo y el Atlántico se dan la mano. Cafés legendarios y una medina luminosa.",
        en: "Tangier, where the Mediterranean and Atlantic meet. Legendary cafés and a luminous medina.",
        fr: "Tanger, où la Méditerranée et l'Atlantique se rejoignent. Cafés légendaires et médina lumineuse.",
      } },
    { rating: 5, author: "Lucas & Marta", origin: "Vigo",
      quote: {
        es: "Las cuevas de Hércules y el cabo Espartel al atardecer. Tánger tiene una luz que no se olvida.",
        en: "The Caves of Hercules and Cape Spartel at sunset. Tangier has a light you can't forget.",
        fr: "Les grottes d'Hercule et le cap Spartel au coucher du soleil. Tanger a une lumière inoubliable.",
      } },
    { rating: 5, author: "Marc D.", origin: "Palma",
      quote: {
        es: "El zoco chico, la kasbah sobre el estrecho y la energía de la ciudad. Una puerta perfecta a Marruecos.",
        en: "The small souk, the kasbah over the strait and the city's energy. A perfect gateway to Morocco.",
        fr: "Le petit souk, la kasbah surplombant le détroit et l'énergie de la ville. Une porte parfaite vers le Maroc.",
      } },
  ],
  chefchaouen: [
    { rating: 5, author: "Sara W.", origin: "Girona",
      quote: {
        es: "Chefchaouen es tan azul como en las fotos, pero en persona huele a pan recién hecho y a montaña.",
        en: "Chefchaouen is as blue as the photos, but in person it smells of fresh bread and mountain air.",
        fr: "Chefchaouen est aussi bleue que sur les photos, mais en vrai elle sent le pain frais et la montagne.",
      } },
    { rating: 5, author: "Paula & Nacho", origin: "Alicante",
      quote: {
        es: "Subir al amanecer a la mezquita española para ver la ciudad azul desde arriba fue mágico.",
        en: "Climbing to the Spanish mosque at dawn to see the blue town from above was magical.",
        fr: "Monter à l'aube à la mosquée espagnole pour voir la ville bleue d'en haut fut magique.",
      } },
    { rating: 5, author: "Mónica R.", origin: "Logroño",
      quote: {
        es: "Cada callejón pintado de añil es una foto. La joya azul del Rif merece todas las horas que le dimos.",
        en: "Every indigo-painted alley is a photo. The blue jewel of the Rif deserves every hour we gave it.",
        fr: "Chaque ruelle peinte d'indigo est une photo. Le joyau bleu du Rif mérite chaque heure passée.",
      } },
  ],
  asilah: [
    { rating: 5, author: "Clara & Hugo", origin: "Cádiz",
      quote: {
        es: "Asilah es un pueblo blanco con murallas portuguesas y murales por todas partes. Tranquilidad junto al mar.",
        en: "Asilah is a white town with Portuguese ramparts and murals everywhere. Seaside serenity.",
        fr: "Asilah est un village blanc aux remparts portugais et aux fresques partout. Sérénité au bord de mer.",
      } },
    { rating: 5, author: "Emilia R.", origin: "Tarifa",
      quote: {
        es: "Pasear por la medina de Asilah al atardecer, con el Atlántico rompiendo contra las murallas, fue puro relax.",
        en: "Strolling Asilah's medina at dusk, the Atlantic crashing against the walls, was pure relaxation.",
        fr: "Flâner dans la médina d'Asilah au crépuscule, l'Atlantique frappant les remparts, fut un pur moment de détente.",
      } },
    { rating: 5, author: "Jorge M.", origin: "Huelva",
      quote: {
        es: "Un secreto del norte: arte callejero, calma y pescado fresco frente al océano. Volveremos seguro.",
        en: "A northern secret: street art, calm and fresh fish facing the ocean. We'll be back for sure.",
        fr: "Un secret du nord : art de rue, calme et poisson frais face à l'océan. Nous reviendrons, c'est sûr.",
      } },
  ],

  /* ── Costa atlántica ───────────────────────────────────── */
  essaouira: [
    { rating: 5, author: "Andrea & Tomás", origin: "Gijón",
      quote: {
        es: "Essaouira es viento, gaviotas y murallas frente al Atlántico. El pescado en el puerto es inolvidable.",
        en: "Essaouira is wind, gulls and ramparts facing the Atlantic. The fish at the port is unforgettable.",
        fr: "Essaouira, c'est le vent, les mouettes et des remparts face à l'Atlantique. Le poisson au port est inoubliable.",
      } },
    { rating: 5, author: "Patricia S.", origin: "Valencia",
      quote: {
        es: "La medina blanca y azul de Mogador, relajada y artística. El contrapunto perfecto al bullicio de Marrakech.",
        en: "Mogador's blue-and-white medina, relaxed and artistic. The perfect counterpoint to Marrakech's bustle.",
        fr: "La médina blanche et bleue de Mogador, détendue et artistique. Le parfait contrepoint à l'effervescence de Marrakech.",
      } },
    { rating: 5, author: "Nicolás V.", origin: "Castellón",
      quote: {
        es: "Atardecer en las murallas de Skala con las olas rompiendo abajo. Essaouira tiene un alma especial.",
        en: "Sunset on the Skala ramparts with waves breaking below. Essaouira has a special soul.",
        fr: "Coucher de soleil sur les remparts de la Skala, les vagues en contrebas. Essaouira a une âme particulière.",
      } },
  ],
  casablanca: [
    { rating: 5, author: "Rocío & Manuel", origin: "Córdoba",
      quote: {
        es: "La mezquita Hassan II sobre el océano es sobrecogedora. Casablanca es el Marruecos más moderno y vibrante.",
        en: "The Hassan II Mosque over the ocean is breathtaking. Casablanca is Morocco's most modern, vibrant face.",
        fr: "La mosquée Hassan II surplombant l'océan est saisissante. Casablanca est le Maroc le plus moderne et vivant.",
      } },
    { rating: 5, author: "Inés P.", origin: "Madrid",
      quote: {
        es: "Art déco, corniche y un minarete de 200 metros. Una llegada perfecta para empezar a entender el país.",
        en: "Art déco, the corniche and a 200-metre minaret. A perfect arrival to start understanding the country.",
        fr: "Art déco, corniche et un minaret de 200 mètres. Une arrivée parfaite pour commencer à comprendre le pays.",
      } },
    { rating: 5, author: "Gregorio T.", origin: "Jaén",
      quote: {
        es: "Entrar en la mezquita Hassan II con la marea golpeando bajo el suelo de cristal es impresionante.",
        en: "Stepping into the Hassan II Mosque as the tide pounds beneath the glass floor is stunning.",
        fr: "Entrer dans la mosquée Hassan II tandis que la marée frappe sous le sol de verre est impressionnant.",
      } },
  ],

  /* ── Joyas escondidas ──────────────────────────────────── */
  volubilis: [
    { rating: 5, author: "Alberto & Sara", origin: "León",
      quote: {
        es: "Caminar entre mosaicos romanos de Volubilis con los olivares de fondo es viajar 2.000 años atrás.",
        en: "Walking among Volubilis's Roman mosaics with olive groves behind is travelling back 2,000 years.",
        fr: "Marcher parmi les mosaïques romaines de Volubilis avec les oliveraies en fond, c'est remonter 2 000 ans.",
      } },
    { rating: 5, author: "Teresa G.", origin: "Cáceres",
      quote: {
        es: "Las columnas del Capitolio al atardecer, casi solos. Un Marruecos romano que poca gente conoce.",
        en: "The Capitol's columns at sunset, almost alone. A Roman Morocco few travellers know.",
        fr: "Les colonnes du Capitole au coucher du soleil, presque seuls. Un Maroc romain que peu connaissent.",
      } },
    { rating: 5, author: "Ana D.", origin: "Segovia",
      quote: {
        es: "Combinar Volubilis con Meknès en un mismo día fue una idea genial de nuestro asesor. Historia pura.",
        en: "Combining Volubilis and Meknès in one day was a brilliant idea from our advisor. Pure history.",
        fr: "Combiner Volubilis et Meknès le même jour fut une idée géniale de notre conseiller. Histoire pure.",
      } },
  ],
  sidiali: [
    { rating: 5, author: "Raúl & Eva", origin: "Albacete",
      quote: {
        es: "El lago de Aguelmane Sidi Ali en pleno Atlas Medio, con caballos pastando, es un secreto precioso.",
        en: "Aguelmane Sidi Ali lake in the heart of the Middle Atlas, with horses grazing, is a beautiful secret.",
        fr: "Le lac d'Aguelmane Sidi Ali au cœur du Moyen Atlas, avec des chevaux qui paissent, est un beau secret.",
      } },
    { rating: 5, author: "Marta C.", origin: "Tarragona",
      quote: {
        es: "Un alto inesperado entre cedros y agua quieta. Paramos a tomar té y no queríamos seguir.",
        en: "An unexpected stop among cedars and still water. We paused for tea and didn't want to leave.",
        fr: "Une halte inattendue entre cèdres et eau calme. Nous avons pris le thé et ne voulions plus repartir.",
      } },
    { rating: 5, author: "Esteban B.", origin: "Soria",
      quote: {
        es: "Nadie espera lagos de montaña en Marruecos. Sidi Ali nos demostró cuánto país queda por descubrir.",
        en: "Nobody expects mountain lakes in Morocco. Sidi Ali showed us how much country is left to discover.",
        fr: "Personne n'imagine des lacs de montagne au Maroc. Sidi Ali nous a montré tout ce qu'il reste à découvrir.",
      } },
  ],
};

export const getPlaceTestimonials = (id) => PLACE_TESTIMONIALS[id] || [];

export default getPlaceTestimonials;
