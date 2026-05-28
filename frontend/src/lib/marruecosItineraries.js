// Itineraries for the /viajes/marruecos gateway page.
// Each itinerary is a self-contained editorial block with a hero image,
// route stages (chips), a narrative body, a primary hub link, optional
// related-hub links and a list of program variants (different durations
// or directions) each pointing to its own programme URL.

const T = (es, en, fr) => ({ es, en, fr });

export const MARRUECOS_ITINERARIES = [
  {
    id: "gran-sur-fez-marrakech",
    slug: "gran-sur-fez-marrakech",
    eyebrow: T("Viajes por todo Marruecos", "Journeys across Morocco", "Voyages à travers le Maroc"),
    title:   T("Gran Sur · Fez – Marrakech", "Grand South · Fez – Marrakech", "Grand Sud · Fès – Marrakech"),
    duration: T("8 días / 7 noches", "8 days / 7 nights", "8 jours / 7 nuits"),
    image: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=2200&q=85",
    accent: "#C16542",
    /* Primary hub for the main CTA */
    hubLink: "tourGransurFezRak",
    /* Extra hubs surfaced as small chips below the main CTA */
    relatedHubs: [
      { label: T("Dirección inversa · Marrakech → Fez", "Reverse direction · Marrakech → Fez", "Sens inverse · Marrakech → Fès"), link: "tourGransurRakFezHub" },
    ],
    /* All concrete programmes (a button list — direct deep links) */
    variants: [
      { label: T("Fez – Marrakech · 6 noches / 7 días",  "Fez – Marrakech · 6 nights / 7 days",  "Fès – Marrakech · 6 nuits / 7 jours"),  link: "tourFezRak67" },
      { label: T("Fez – Marrakech · 7 noches / 8 días",  "Fez – Marrakech · 7 nights / 8 days",  "Fès – Marrakech · 7 nuits / 8 jours"),  link: "tourFezRak78" },
      { label: T("Fez – Marrakech · 8 noches / 9 días",  "Fez – Marrakech · 8 nights / 9 days",  "Fès – Marrakech · 8 nuits / 9 jours"),  link: "tourFezRak89" },
      { label: T("Fez – Marrakech · 9 noches / 10 días", "Fez – Marrakech · 9 nights / 10 days", "Fès – Marrakech · 9 nuits / 10 jours"), link: "tourFezRak910" },
      { label: T("Marrakech – Fez · 6 noches / 7 días",  "Marrakech – Fez · 6 nights / 7 days",  "Marrakech – Fès · 6 nuits / 7 jours"),  link: "tourMarrakechFez67" },
      { label: T("Marrakech – Fez · 7 noches / 8 días",  "Marrakech – Fez · 7 nights / 8 days",  "Marrakech – Fès · 7 nuits / 8 jours"),  link: "tourMarrakechFez78" },
      { label: T("Marrakech – Fez · 8 noches / 9 días",  "Marrakech – Fez · 8 nights / 9 days",  "Marrakech – Fès · 8 nuits / 9 jours"),  link: "tourMarrakechFez89" },
      { label: T("Marrakech – Fez · 9 noches / 10 días", "Marrakech – Fez · 9 nights / 10 days", "Marrakech – Fès · 9 nuits / 10 jours"), link: "tourMarrakechFez910" },
    ],
    stages: [
      T("Fez", "Fez", "Fès"),
      T("Ifrane", "Ifrane", "Ifrane"),
      T("Cedros gigantes", "Giant cedars", "Cèdres géants"),
      T("Erfoud", "Erfoud", "Erfoud"),
      T("Erg Chebbi", "Erg Chebbi", "Erg Chebbi"),
      T("Alto Atlas", "High Atlas", "Haut Atlas"),
      T("Marrakech", "Marrakech", "Marrakech"),
    ],
    body: {
      es: [
        "Gran Sur de Marruecos es un auténtico viaje para descubrir principalmente el sur del país. Esta ruta en 4x4 comienza en Fez, cuya Medina, envidia del mundo árabe, es un precioso laberinto donde perderse.",
        "El recorrido nos lleva por lugares tan originales como los poblados de Ifrane, conocida como «la pequeña Suiza», y sus bosques de Cedros Gigantes, hasta llegar a Erfoud, la puerta del Gran Desierto del Erg Chebbi, un auténtico espectáculo para los sentidos.",
        "Las interminables dunas y el halo mágico que desprenden estos paisajes nos permitirán vivir una noche inolvidable bajo las estrellas.",
        "Dejaremos atrás el desierto para cruzar el Alto Atlas, descubriendo paisajes espectaculares a nuestro paso. De la montaña a la ciudad, el viaje finaliza en Marrakech, llena de colores, artesanos, plazas vibrantes y aromas que quedarán para siempre en el recuerdo.",
      ],
      en: [
        "Grand South of Morocco is a journey designed mainly to uncover the south of the country. This 4x4 route begins in Fez, whose Medina — the envy of the Arab world — is a stunning labyrinth in which to lose yourself.",
        "The road takes us through places as original as the village of Ifrane, known as «little Switzerland», and its forests of giant cedars, all the way to Erfoud, the gateway to the Great Erg Chebbi Desert — a true feast for the senses.",
        "The endless dunes and the magical halo emanating from these landscapes let us live an unforgettable night under the stars.",
        "We then leave the desert behind to cross the High Atlas, discovering spectacular landscapes along the way. From mountain to city, the journey ends in Marrakech — full of colour, artisans, vibrant squares and aromas that will stay in memory forever.",
      ],
      fr: [
        "Le Grand Sud du Maroc est un véritable voyage pour découvrir principalement le sud du pays. Cette route en 4x4 commence à Fès, dont la Médina, enviée par tout le monde arabe, est un superbe labyrinthe où il fait bon se perdre.",
        "Le parcours nous emmène à travers des lieux aussi originaux que les villages d'Ifrane, surnommée « la petite Suisse », et ses forêts de cèdres géants, jusqu'à Erfoud, la porte du Grand Désert de l'Erg Chebbi, un véritable spectacle pour les sens.",
        "Les dunes infinies et l'aura magique qui s'en dégage nous permettent de vivre une nuit inoubliable sous les étoiles.",
        "Nous quittons le désert pour traverser le Haut Atlas et ses paysages spectaculaires. De la montagne à la ville, le voyage s'achève à Marrakech, pleine de couleurs, d'artisans, de places vibrantes et de parfums qui resteront à jamais gravés.",
      ],
    },
  },
  {
    id: "gran-sur-medio-atlas",
    slug: "gran-sur-medio-atlas",
    eyebrow: T("Viajes por todo Marruecos", "Journeys across Morocco", "Voyages à travers le Maroc"),
    title:   T("Gran Sur + Medio Atlas", "Grand South + Middle Atlas", "Grand Sud + Moyen Atlas"),
    duration: T("9 días / 8 noches", "9 days / 8 nights", "9 jours / 8 nuits"),
    image: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=2200&q=85",
    accent: "#5A6B4F",
    hubLink: "tourGransurFezSidiali",
    relatedHubs: [],
    variants: [
      { label: T("Fez – Sidi Ali – Marrakech · 7 noches / 8 días",  "Fez – Sidi Ali – Marrakech · 7 nights / 8 days",  "Fès – Sidi Ali – Marrakech · 7 nuits / 8 jours"),  link: "tourFezSidialiRak78" },
      { label: T("Fez – Sidi Ali – Marrakech · 8 noches / 9 días",  "Fez – Sidi Ali – Marrakech · 8 nights / 9 days",  "Fès – Sidi Ali – Marrakech · 8 nuits / 9 jours"),  link: "tourFezSidialiRak89" },
      { label: T("Fez – Sidi Ali – Marrakech · 9 noches / 10 días", "Fez – Sidi Ali – Marrakech · 9 nights / 10 days", "Fès – Sidi Ali – Marrakech · 9 nuits / 10 jours"), link: "tourFezSidialiRak910" },
      { label: T("Marrakech – Sidi Ali – Fez · 7 noches / 8 días",  "Marrakech – Sidi Ali – Fez · 7 nights / 8 days",  "Marrakech – Sidi Ali – Fès · 7 nuits / 8 jours"),  link: "tourMarrakechSidialiFez78" },
      { label: T("Marrakech – Sidi Ali – Fez · 8 noches / 9 días",  "Marrakech – Sidi Ali – Fez · 8 nights / 9 days",  "Marrakech – Sidi Ali – Fès · 8 nuits / 9 jours"),  link: "tourMarrakechSidialiFez89" },
      { label: T("Marrakech – Sidi Ali – Fez · 9 noches / 10 días", "Marrakech – Sidi Ali – Fez · 9 nights / 10 days", "Marrakech – Sidi Ali – Fès · 9 nuits / 10 jours"), link: "tourMarrakechSidialiFez910" },
    ],
    stages: [
      T("Ifrane", "Ifrane", "Ifrane"),
      T("Cedros gigantes", "Giant cedars", "Cèdres géants"),
      T("Erfoud", "Erfoud", "Erfoud"),
      T("Erg Chebbi", "Erg Chebbi", "Erg Chebbi"),
      T("Medio Atlas", "Middle Atlas", "Moyen Atlas"),
      T("Lago Aguelmame Sidi Ali", "Aguelmame Sidi Ali lake", "Lac Aguelmame Sidi Ali"),
    ],
    body: {
      es: [
        "El camino te llevará a través de lugares tan originales como los encantadores poblados de Ifrane, conocida como «la pequeña Suiza», y sus impresionantes bosques de Cedros Gigantes.",
        "La ruta continúa hasta Erfoud, la puerta de entrada al Gran Desierto del Erg Chebbi, un espectáculo que desafía los sentidos. Las interminables dunas y el aura mágica del Sahara permitirán vivir una noche inolvidable bajo las estrellas.",
        "Pero la aventura no termina aquí. El viaje continúa a través del Medio Atlas, descubriendo paisajes sorprendentes a cada paso.",
        "En esta parte de la ruta se encuentra el precioso lago Aguelmame Sidi Ali, un oasis de serenidad en medio de las montañas, ofreciendo un respiro perfecto frente a la aridez del desierto.",
      ],
      en: [
        "The road carries you through places as original as the charming villages of Ifrane, known as «little Switzerland», and its breathtaking forests of giant cedars.",
        "The route continues to Erfoud, the gateway to the great Erg Chebbi Desert — a spectacle that defies the senses. The endless dunes and magical aura of the Sahara give way to an unforgettable night under the stars.",
        "But the adventure does not end here. The journey continues through the Middle Atlas, revealing surprising landscapes at every turn.",
        "Along this stretch lies the beautiful Aguelmame Sidi Ali lake, an oasis of serenity amid the mountains — the perfect counterpoint to the aridity of the desert.",
      ],
      fr: [
        "La route vous emmène à travers des lieux aussi originaux que les charmants villages d'Ifrane, surnommée « la petite Suisse », et ses impressionnantes forêts de cèdres géants.",
        "Le parcours se poursuit jusqu'à Erfoud, porte d'entrée du grand désert de l'Erg Chebbi, un spectacle qui défie les sens. Les dunes infinies et l'aura magique du Sahara offrent une nuit inoubliable sous les étoiles.",
        "Mais l'aventure ne s'arrête pas là. Le voyage continue à travers le Moyen Atlas, dévoilant des paysages surprenants à chaque pas.",
        "Sur ce tronçon se trouve le superbe lac Aguelmame Sidi Ali, oasis de sérénité au cœur des montagnes — un contrepoint parfait à l'aridité du désert.",
      ],
    },
  },
  {
    id: "alto-atlas-desierto-fez",
    slug: "alto-atlas-desierto-fez",
    eyebrow: T("Viajes por todo Marruecos", "Journeys across Morocco", "Voyages à travers le Maroc"),
    title:   T("Alto Atlas · Desierto · Fez", "High Atlas · Desert · Fez", "Haut Atlas · Désert · Fès"),
    duration: T("9 días / 8 noches", "9 days / 8 nights", "9 jours / 8 nuits"),
    image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=2200&q=85",
    accent: "#A07042",
    hubLink: "tourGransurOuarzaFez",
    relatedHubs: [
      { label: T("Hub general · Atlas · Desierto · Fez", "General hub · Atlas · Desert · Fez", "Hub général · Atlas · Désert · Fès"), link: "tourAtlasDesiertoFezHub" },
    ],
    variants: [
      { label: T("Ouarzazate – Sidi Ali – Fez · 5 noches / 6 días", "Ouarzazate – Sidi Ali – Fez · 5 nights / 6 days", "Ouarzazate – Sidi Ali – Fès · 5 nuits / 6 jours"), link: "tourOzzSidialiFez56" },
      { label: T("Ouarzazate – Sidi Ali – Fez · 6 noches / 7 días", "Ouarzazate – Sidi Ali – Fez · 6 nights / 7 days", "Ouarzazate – Sidi Ali – Fès · 6 nuits / 7 jours"), link: "tourOzzSidialiFez67" },
      { label: T("Ouarzazate – Sidi Ali – Fez · 7 noches / 8 días", "Ouarzazate – Sidi Ali – Fez · 7 nights / 8 days", "Ouarzazate – Sidi Ali – Fès · 7 nuits / 8 jours"), link: "tourOzzSidialiFez78" },
      { label: T("Fez – Sidi Ali – Ouarzazate · 5 noches / 6 días", "Fez – Sidi Ali – Ouarzazate · 5 nights / 6 days", "Fès – Sidi Ali – Ouarzazate · 5 nuits / 6 jours"), link: "tourFezSidialiOzz56" },
      { label: T("Fez – Sidi Ali – Ouarzazate · 6 noches / 7 días", "Fez – Sidi Ali – Ouarzazate · 6 nights / 7 days", "Fès – Sidi Ali – Ouarzazate · 6 nuits / 7 jours"), link: "tourFezSidialiOzz67" },
      { label: T("Fez – Sidi Ali – Ouarzazate · 7 noches / 8 días", "Fez – Sidi Ali – Ouarzazate · 7 nights / 8 days", "Fès – Sidi Ali – Ouarzazate · 7 nuits / 8 jours"), link: "tourFezSidialiOzz78" },
    ],
    stages: [
      T("Alto Atlas", "High Atlas", "Haut Atlas"),
      T("Pueblos bereberes", "Berber villages", "Villages berbères"),
      T("Sahara", "Sahara", "Sahara"),
      T("Bivouac nómada", "Nomadic bivouac", "Bivouac nomade"),
      T("Fez · ciudad imperial", "Fez · imperial city", "Fès · cité impériale"),
    ],
    body: {
      es: [
        "Nuestro viaje comienza en las imponentes montañas del Alto Atlas, rodeados de paisajes de ensueño y pueblos bereberes llenos de tradición.",
        "Recorreremos senderos serpenteantes descubriendo la vida cotidiana de las comunidades locales y admirando las vistas panorámicas de picos nevados y valles exuberantes.",
        "La experiencia continúa adentrándonos en el Sahara, sumergiéndonos en la cultura nómada mientras atravesamos las ondulantes dunas bajo las luces del atardecer.",
        "Finalmente, llegaremos a Fez, una de las ciudades imperiales más antiguas y fascinantes de Marruecos. Nos perderemos entre sus callejones, mercados, mezquitas, madrazas y palacios, descubriendo la riqueza histórica, cultural y arquitectónica de esta ciudad única.",
      ],
      en: [
        "Our journey begins in the imposing High Atlas mountains, surrounded by dreamlike landscapes and Berber villages steeped in tradition.",
        "We follow winding trails, discovering the daily life of local communities and admiring panoramic views of snowy peaks and lush valleys.",
        "The experience then plunges into the Sahara, immersing us in nomad culture as we cross rolling dunes under the colours of sunset.",
        "Finally we reach Fez, one of Morocco's oldest and most fascinating imperial cities. We get lost in its alleys, markets, mosques, madrasas and palaces — uncovering the historical, cultural and architectural richness of this singular city.",
      ],
      fr: [
        "Notre voyage commence dans les imposantes montagnes du Haut Atlas, entourées de paysages de rêve et de villages berbères empreints de tradition.",
        "Nous suivons des sentiers sinueux, découvrant la vie quotidienne des communautés locales et admirant les vues panoramiques sur les sommets enneigés et les vallées luxuriantes.",
        "L'expérience se poursuit dans le Sahara, où nous nous immergeons dans la culture nomade en traversant les dunes ondulantes sous les lumières du couchant.",
        "Enfin, nous arrivons à Fès, l'une des plus anciennes et fascinantes cités impériales du Maroc. Nous nous perdons dans ses ruelles, ses marchés, ses mosquées, ses médersas et ses palais, découvrant la richesse historique, culturelle et architecturale de cette ville unique.",
      ],
    },
  },
  {
    id: "tanger-marrakech",
    slug: "tanger-marrakech",
    eyebrow: T("Viajes por todo Marruecos", "Journeys across Morocco", "Voyages à travers le Maroc"),
    title:   T("Tánger – Marrakech", "Tangier – Marrakech", "Tanger – Marrakech"),
    duration: T("11 días / 10 noches", "11 days / 10 nights", "11 jours / 10 nuits"),
    image: "https://images.unsplash.com/photo-1570133435536-7ececf000ef6?auto=format&fit=crop&w=2200&q=85",
    accent: "#3A4A5F",
    hubLink: "tourGransurTangerRak",
    relatedHubs: [],
    variants: [
      { label: T("Tánger – Marrakech · 8 noches / 9 días",  "Tangier – Marrakech · 8 nights / 9 days",  "Tanger – Marrakech · 8 nuits / 9 jours"),  link: "tourTangerRak89" },
      { label: T("Tánger – Marrakech · 9 noches / 10 días", "Tangier – Marrakech · 9 nights / 10 days", "Tanger – Marrakech · 9 nuits / 10 jours"), link: "tourTangerRak910" },
    ],
    stages: [
      T("Tánger", "Tangier", "Tanger"),
      T("Chefchaouen", "Chefchaouen", "Chefchaouen"),
      T("Fez", "Fez", "Fès"),
      T("Ifrane", "Ifrane", "Ifrane"),
      T("Erfoud", "Erfoud", "Erfoud"),
      T("Erg Chebbi", "Erg Chebbi", "Erg Chebbi"),
      T("Alto Atlas", "High Atlas", "Haut Atlas"),
      T("Marrakech", "Marrakech", "Marrakech"),
    ],
    body: {
      es: [
        "Esta ruta comienza en Tánger y continúa hasta Chefchaouen, conocido como «el pueblo azul».",
        "Seguiremos hacia Fez, cuya Medina es considerada una de las más fascinantes del mundo árabe, un auténtico laberinto de callejones y mercados llenos de vida.",
        "El recorrido nos llevará por lugares tan originales como Ifrane, conocida como «la pequeña Suiza», y sus bosques de Cedros Gigantes, hasta llegar a Erfoud, la puerta del Gran Desierto del Erg Chebbi.",
        "Las interminables dunas y la atmósfera mágica del Sahara permitirán vivir una noche inolvidable bajo las estrellas.",
        "Dejaremos atrás el desierto para adentrarnos en el Alto Atlas, descubriendo paisajes espectaculares, gargantas inmensas, pueblos perdidos y encuentros auténticos con las comunidades locales.",
        "De la montaña a la ciudad, el viaje finaliza en Marrakech, una ciudad llena de colores, artesanos, plazas vibrantes y aromas inolvidables que marcarán el recuerdo del viaje.",
      ],
      en: [
        "This route begins in Tangier and continues to Chefchaouen, known as «the blue town».",
        "From there we head to Fez, whose Medina is considered one of the most fascinating in the Arab world — a true labyrinth of alleys and markets brimming with life.",
        "The road takes us through places as original as Ifrane, known as «little Switzerland», and its forests of giant cedars, all the way to Erfoud, the gateway to the Great Erg Chebbi Desert.",
        "The endless dunes and the magical atmosphere of the Sahara open the way to an unforgettable night under the stars.",
        "We leave the desert behind to enter the High Atlas, discovering spectacular landscapes, vast gorges, lost villages and genuine encounters with local communities.",
        "From mountain to city, the journey ends in Marrakech — full of colour, artisans, vibrant squares and unforgettable aromas that will mark the memory of the trip.",
      ],
      fr: [
        "Cette route commence à Tanger et se poursuit jusqu'à Chefchaouen, connue comme « la ville bleue ».",
        "Nous prenons ensuite la direction de Fès, dont la Médina est considérée comme l'une des plus fascinantes du monde arabe — un véritable labyrinthe de ruelles et de marchés pleins de vie.",
        "Le parcours nous emmène à travers des lieux aussi originaux qu'Ifrane, surnommée « la petite Suisse », et ses forêts de cèdres géants, jusqu'à Erfoud, porte du Grand Désert de l'Erg Chebbi.",
        "Les dunes infinies et l'atmosphère magique du Sahara nous offrent une nuit inoubliable sous les étoiles.",
        "Nous quittons le désert pour pénétrer dans le Haut Atlas, découvrant des paysages spectaculaires, des gorges immenses, des villages perdus et des rencontres authentiques avec les communautés locales.",
        "De la montagne à la ville, le voyage s'achève à Marrakech — pleine de couleurs, d'artisans, de places vibrantes et de parfums inoubliables qui marqueront le souvenir du voyage.",
      ],
    },
  },
];
