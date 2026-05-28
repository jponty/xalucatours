/* ============================================================
   bestTimeData.js
   ----
   Trilingual content for /cuando-viajar (Best Time to Travel
   to Morocco). Centralized so editors can adjust copy + tags
   without touching the page component.
============================================================ */

export const HERO = {
  eyebrow: { es: "Cuándo viajar · Marruecos a lo largo del año", en: "When to travel · Morocco year-round", fr: "Quand partir · le Maroc au fil de l'année" },
  title: {
    es: "Marruecos tiene su propio calendario. Te ayudamos a encontrar el tuyo.",
    en: "Morocco keeps its own calendar. We'll help you find yours.",
    fr: "Le Maroc suit son propre calendrier — nous vous aidons à trouver le vôtre.",
  },
  subtitle: {
    es: "Una guía editorial para escoger el mes, la región y el ritmo perfecto de tu viaje — desde la primavera del Atlas hasta el silencio de invierno en el Sáhara.",
    en: "An editorial guide to picking the right month, the right region and the right pace — from spring in the Atlas to winter silence over the Sahara.",
    fr: "Un guide éditorial pour choisir le bon mois, la bonne région et le bon rythme — du printemps de l'Atlas au silence hivernal du Sahara.",
  },
  hero_image: "https://images.unsplash.com/photo-1542401886-65d6c61db217?auto=format&fit=crop&w=2800&q=85",
};

export const INTRO = {
  overline: { es: "Marruecos, doce caras", en: "Morocco, twelve faces", fr: "Le Maroc, douze visages" },
  title: {
    es: "Un país en el que cada mes inventa un país distinto.",
    en: "A country that reinvents itself every month.",
    fr: "Un pays qui se réinvente chaque mois.",
  },
  body: {
    es: [
      "Marruecos no es un destino — son seis a la vez. El Sáhara y el Atlas, las medinas imperiales y los puertos atlánticos, los oasis del sur y los pueblos azules del Rif viven climas y temporadas radicalmente distintos.",
      "La primavera tiñe de almendros el Alto Atlas. El verano arde en Marrakech y el desierto pero refresca las costas del Atlántico. El otoño abre la temporada dorada del Sáhara. El invierno trae nieve a Imlil y noches estrelladas a Merzouga.",
      "Esta guía editorial te ayuda a leer el calendario marroquí estación por estación, región por región, para que escojas el mes que mejor encaje con tu viaje.",
    ],
    en: [
      "Morocco is not one destination — it is six at once. The Sahara and the Atlas, the imperial medinas and the Atlantic ports, the southern oases and the blue villages of the Rif all live radically different seasons.",
      "Spring tints the High Atlas with almond blossoms. Summer scorches Marrakech and the desert yet soothes the Atlantic coast. Autumn opens the golden season over the Sahara. Winter brings snow to Imlil and starry nights to Merzouga.",
      "This editorial guide walks you through the Moroccan calendar season by season, region by region, so you can choose the month that best matches your trip.",
    ],
    fr: [
      "Le Maroc n'est pas une seule destination — il en est six à la fois. Sahara et Atlas, médinas impériales et ports atlantiques, oasis du sud et villages bleus du Rif vivent des saisons radicalement différentes.",
      "Le printemps couvre le Haut Atlas d'amandiers en fleur. L'été embrase Marrakech et le désert tout en rafraîchissant la côte atlantique. L'automne ouvre la saison dorée du Sahara. L'hiver couvre Imlil de neige et offre à Merzouga ses nuits les plus étoilées.",
      "Ce guide éditorial vous accompagne saison après saison, région après région, pour choisir le mois qui correspond à votre voyage.",
    ],
  },
};

/* ----- 4 SEASONS ----- */
export const SEASONS = [
  {
    id: "spring",
    accent: "#5A6B4F",
    months: { es: "Marzo · Abril · Mayo", en: "March · April · May", fr: "Mars · Avril · Mai" },
    title: { es: "Primavera. El Marruecos en flor.", en: "Spring. Morocco in bloom.", fr: "Printemps. Le Maroc en fleurs." },
    weather: {
      es: "Temperaturas de 16 a 26 °C en interior. Cielos limpios, noches frescas en el Atlas, dunas todavía templadas. Algunas lluvias breves en el norte.",
      en: "16–26 °C inland. Clear skies, cool nights in the Atlas, the dunes still mild. Short showers possible in the north.",
      fr: "16 à 26 °C à l'intérieur. Ciels dégagés, nuits fraîches dans l'Atlas, dunes encore tempérées. Quelques averses brèves au nord.",
    },
    regions: {
      es: "Alto Atlas, valle del Drâa, Erg Chebbi, Fez, Chefchaouen.",
      en: "High Atlas, Drâa Valley, Erg Chebbi, Fez, Chefchaouen.",
      fr: "Haut Atlas, vallée du Drâa, Erg Chebbi, Fès, Chefchaouen.",
    },
    activities: {
      es: "Trekking ligero por el Atlas, rutas en 4x4 por valles floridos, dormir en bivouac, recorrer medinas sin sudar.",
      en: "Light trekking in the Atlas, 4x4 drives through blooming valleys, sleep in a desert bivouac, walk the medinas without breaking a sweat.",
      fr: "Trekking léger dans l'Atlas, sorties en 4x4 dans des vallées fleuries, nuit en bivouac, balades dans les médinas sans transpirer.",
    },
    pros: {
      es: "El mejor equilibrio entre temperatura, paisajes y precio. Aún no es alta temporada, los hoteles tienen disponibilidad y los vuelos son razonables.",
      en: "The best balance of weather, landscapes and price. Not yet high season, hotels have room, flights remain reasonable.",
      fr: "Le meilleur équilibre entre climat, paysages et prix. Pas encore haute saison : disponibilité dans les hôtels, vols raisonnables.",
    },
    itinerary: {
      es: "9 días — Marrakech, Alto Atlas, Drâa, Erg Chebbi, Fez.",
      en: "9 days — Marrakech, High Atlas, Drâa, Erg Chebbi, Fez.",
      fr: "9 jours — Marrakech, Haut Atlas, Drâa, Erg Chebbi, Fès.",
    },
    image: "https://images.unsplash.com/photo-1559925523-10de9e23cf90?auto=format&fit=crop&w=2400&q=85",
  },
  {
    id: "summer",
    accent: "#C16542",
    months: { es: "Junio · Julio · Agosto", en: "June · July · August", fr: "Juin · Juillet · Août" },
    title: { es: "Verano. Atlas, Atlántico y noches sin fin.", en: "Summer. Atlas, Atlantic and endless nights.", fr: "Été. Atlas, Atlantique et nuits sans fin." },
    weather: {
      es: "Marrakech, Fez y el desierto rozan los 40 °C. La costa atlántica respira entre 22 y 27 °C. El Alto Atlas se mantiene fresco al amanecer.",
      en: "Marrakech, Fez and the desert flirt with 40 °C. The Atlantic coast stays a breezy 22–27 °C. The High Atlas stays cool at dawn.",
      fr: "Marrakech, Fès et le désert frôlent les 40 °C. La côte atlantique reste entre 22 et 27 °C. Le Haut Atlas reste frais à l'aube.",
    },
    regions: {
      es: "Essaouira, Asilah, Imlil y el Alto Atlas, Chefchaouen.",
      en: "Essaouira, Asilah, Imlil and the High Atlas, Chefchaouen.",
      fr: "Essaouira, Asilah, Imlil et le Haut Atlas, Chefchaouen.",
    },
    activities: {
      es: "Surf y vientos atlánticos, hiking en altura, festivales de música, escapadas a riads con piscina.",
      en: "Surf and Atlantic winds, altitude hikes, music festivals, riad-with-pool retreats.",
      fr: "Surf et vents atlantiques, randonnée en altitude, festivals de musique, retraites en riad avec piscine.",
    },
    pros: {
      es: "Días infinitos, atardeceres a las 21h, mejor momento para la costa y para los amantes del calor seco. El desierto, eso sí, queda casi siempre vedado.",
      en: "Endless days, 9pm sunsets, the best time for the coast and for fans of dry heat. The desert, however, is mostly off-limits.",
      fr: "Journées infinies, couchers de soleil à 21h, meilleur moment pour la côte et les amoureux de la chaleur sèche. Le désert reste néanmoins déconseillé.",
    },
    itinerary: {
      es: "7 días — Marrakech, Imlil, Essaouira y el Atlántico.",
      en: "7 days — Marrakech, Imlil, Essaouira and the Atlantic.",
      fr: "7 jours — Marrakech, Imlil, Essaouira et l'Atlantique.",
    },
    image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=2400&q=85",
  },
  {
    id: "autumn",
    accent: "#D97742",
    months: { es: "Septiembre · Octubre · Noviembre", en: "September · October · November", fr: "Septembre · Octobre · Novembre" },
    title: { es: "Otoño. La temporada dorada del Sáhara.", en: "Autumn. The Sahara's golden season.", fr: "Automne. La saison dorée du Sahara." },
    weather: {
      es: "El calor retrocede: 22–30 °C de día, noches frescas en el desierto, lluvias raras. Septiembre todavía es caluroso en el interior; noviembre ya pide chaqueta de noche.",
      en: "The heat eases: 22–30 °C by day, cool desert nights, rain is rare. September is still hot inland; by November a light jacket is welcome at night.",
      fr: "La chaleur reflue : 22–30 °C en journée, nuits fraîches dans le désert, pluies rares. Septembre reste chaud à l'intérieur ; en novembre, une veste légère est bienvenue le soir.",
    },
    regions: {
      es: "Erg Chebbi, Erg Chigaga, Dadès, Aït Ben Haddou, Marrakech.",
      en: "Erg Chebbi, Erg Chigaga, Dades, Aït Ben Haddou, Marrakech.",
      fr: "Erg Chebbi, Erg Chigaga, Dadès, Aït Ben Haddou, Marrakech.",
    },
    activities: {
      es: "Travesías en 4x4 por el Sáhara, noches bajo las estrellas, festivales (Festival de las Almendras, Festival del Dátil), trekking en el M'Goun.",
      en: "4x4 crossings through the Sahara, nights under the stars, festivals (Almond, Date), trekking in the M'Goun.",
      fr: "Traversées en 4x4 dans le Sahara, nuits sous les étoiles, festivals (Amande, Datte), trekking dans le M'Goun.",
    },
    pros: {
      es: "La luz del desierto es la mejor del año, la sensación térmica es perfecta y el cielo se vacía de turistas. La temporada ideal para fotografía y aventura.",
      en: "The desert light is the year's finest, the felt temperature is perfect and the crowds thin out. The ideal season for photography and adventure.",
      fr: "La lumière du désert est la plus belle de l'année, la température ressentie est parfaite et les foules s'estompent. La saison idéale pour la photo et l'aventure.",
    },
    itinerary: {
      es: "10 días — Marrakech, Atlas, Drâa, Erg Chebbi, ciudades imperiales.",
      en: "10 days — Marrakech, Atlas, Drâa, Erg Chebbi, imperial cities.",
      fr: "10 jours — Marrakech, Atlas, Drâa, Erg Chebbi, cités impériales.",
    },
    image: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=2400&q=85",
  },
  {
    id: "winter",
    accent: "#5A7F9C",
    months: { es: "Diciembre · Enero · Febrero", en: "December · January · February", fr: "Décembre · Janvier · Février" },
    title: { es: "Invierno. Nieve en el Atlas, fuego en el desierto.", en: "Winter. Snow on the Atlas, fire in the desert.", fr: "Hiver. Neige sur l'Atlas, feu dans le désert." },
    weather: {
      es: "Días suaves (15–22 °C) en Marrakech y el sur, noches frías en el Atlas (con nieve sobre los 2.000 m) y en el desierto (0–8 °C). El norte se vuelve más húmedo.",
      en: "Mild days (15–22 °C) in Marrakech and the south, cold nights in the Atlas (snow above 2,000 m) and in the desert (0–8 °C). The north turns wetter.",
      fr: "Jours doux (15–22 °C) à Marrakech et au sud, nuits froides dans l'Atlas (neige au-dessus de 2 000 m) et dans le désert (0–8 °C). Le nord devient plus humide.",
    },
    regions: {
      es: "Marrakech, Fez, Erg Chebbi, Oukaïmeden (esquí), Aït Ben Haddou.",
      en: "Marrakech, Fez, Erg Chebbi, Oukaimeden (ski), Aït Ben Haddou.",
      fr: "Marrakech, Fès, Erg Chebbi, Oukaïmeden (ski), Aït Ben Haddou.",
    },
    activities: {
      es: "Cenas largas en riads, hammam, esquí en Oukaïmeden, Fin de Año en el Sáhara, mercados invernales.",
      en: "Long riad dinners, hammam, skiing in Oukaimeden, New Year's Eve in the Sahara, winter markets.",
      fr: "Longs dîners en riad, hammam, ski à Oukaïmeden, réveillon dans le Sahara, marchés d'hiver.",
    },
    pros: {
      es: "Marruecos vacío de turistas, luz cinematográfica, dunas con nieve a un día de coche y noches estrelladas como en ninguna otra parte. Ideal para escapadas culturales y para el Fin de Año en el desierto.",
      en: "A Morocco emptied of tourists, cinematic light, snowy dunes one drive away and night skies like nowhere else. Perfect for cultural breaks and New Year in the desert.",
      fr: "Un Maroc débarrassé des foules, une lumière cinématographique, des dunes à proximité de la neige et des ciels étoilés uniques. Parfait pour les escapades culturelles et le Nouvel An au désert.",
    },
    itinerary: {
      es: "6 días — Marrakech, Aït Ben Haddou, Dadès, Erg Chebbi (Fin de Año).",
      en: "6 days — Marrakech, Aït Ben Haddou, Dades, Erg Chebbi (New Year's Eve).",
      fr: "6 jours — Marrakech, Aït Ben Haddou, Dadès, Erg Chebbi (Réveillon).",
    },
    image: "https://images.unsplash.com/photo-1547234935-80c7145ec969?auto=format&fit=crop&w=2400&q=85",
  },
];

/* ----- 5 CLIMATE REGIONS ----- */
export const REGIONS = [
  {
    id: "sahara",
    name: { es: "Sáhara", en: "Sahara", fr: "Sahara" },
    accent: "#D97742",
    best: { es: "Oct – Abr", en: "Oct – Apr", fr: "Oct – Avr" },
    avoid: { es: "Jun – Ago", en: "Jun – Aug", fr: "Juin – Août" },
    body: {
      es: "Clima desértico extremo. De junio a agosto el termómetro supera los 45 °C — el bivouac queda cerrado y las salidas en dromedario se reducen al amanecer. De octubre a abril, en cambio, los días son perfectos (20–28 °C) y las noches estrelladas piden manta.",
      en: "Extreme desert climate. June to August can top 45 °C — bivouacs close and camel rides are dawn-only. From October to April the days are perfect (20–28 °C) and the starry nights call for a blanket.",
      fr: "Climat désertique extrême. De juin à août, plus de 45 °C — bivouac fermé, méharées limitées à l'aube. D'octobre à avril, journées parfaites (20–28 °C) et nuits étoilées qui réclament une couverture.",
    },
  },
  {
    id: "marrakech",
    name: { es: "Marrakech y centro", en: "Marrakech & centre", fr: "Marrakech et centre" },
    accent: "#C16542",
    best: { es: "Mar – Mayo · Oct – Nov", en: "Mar – May · Oct – Nov", fr: "Mars – Mai · Oct – Nov" },
    avoid: { es: "Pleno julio y agosto (42 °C+)", en: "Peak July & August (42 °C+)", fr: "Juillet et août en plein cœur (+42 °C)" },
    body: {
      es: "Clima continental semi-árido. La ciudad explota de color en primavera y se vacía agradablemente en otoño. En invierno hay noches que bajan a 5 °C, pero los días son luminosos. En verano, riad con piscina obligatorio.",
      en: "Semi-arid continental climate. The city bursts with colour in spring and empties pleasantly in autumn. Winter nights drop to 5 °C but days stay bright. In summer, riad-with-pool is non-negotiable.",
      fr: "Climat continental semi-aride. La ville explose de couleurs au printemps et se vide agréablement à l'automne. En hiver, les nuits descendent à 5 °C mais les jours sont lumineux. L'été, le riad avec piscine est indispensable.",
    },
  },
  {
    id: "atlas",
    name: { es: "Alto Atlas", en: "High Atlas", fr: "Haut Atlas" },
    accent: "#5A6B4F",
    best: { es: "Abr – Jun · Sep – Oct", en: "Apr – Jun · Sep – Oct", fr: "Avr – Juin · Sep – Oct" },
    avoid: { es: "Dic – Feb (pasos cerrados, nieve)", en: "Dec – Feb (passes closed, snow)", fr: "Déc – Fév (cols fermés, neige)" },
    body: {
      es: "Clima de montaña: agradable en primavera y otoño (15–25 °C), nevadas serias en invierno por encima de 1.800 m. Imlil y el Toubkal exigen guía en invierno. En verano la altura suaviza el calor: una escapada perfecta desde Marrakech.",
      en: "Mountain climate: pleasant in spring and autumn (15–25 °C), serious snowfall in winter above 1,800 m. Imlil and Toubkal require a guide in winter. In summer altitude tempers the heat — a perfect day-trip from Marrakech.",
      fr: "Climat de montagne : agréable au printemps et à l'automne (15–25 °C), neiges importantes en hiver au-dessus de 1 800 m. Imlil et le Toubkal exigent un guide en hiver. L'été, l'altitude tempère la chaleur — une escapade parfaite depuis Marrakech.",
    },
  },
  {
    id: "north",
    name: { es: "Norte (Rif y Tánger)", en: "North (Rif & Tangier)", fr: "Nord (Rif et Tanger)" },
    accent: "#5A7F9C",
    best: { es: "Abr – Jun · Sep – Oct", en: "Apr – Jun · Sep – Oct", fr: "Avr – Juin · Sep – Oct" },
    avoid: { es: "Nov – Feb (lluvias)", en: "Nov – Feb (rainy)", fr: "Nov – Fév (pluies)" },
    body: {
      es: "Clima mediterráneo, húmedo y verde. Chefchaouen y Tánger viven sus mejores momentos en primavera y otoño. En invierno llueve con frecuencia — algo poético si lo abordas con paraguas y café en una medina.",
      en: "Mediterranean, humid and green. Chefchaouen and Tangier shine in spring and autumn. Winter is rainy — poetic, if you embrace umbrella-and-coffee medina days.",
      fr: "Climat méditerranéen, humide et vert. Chefchaouen et Tanger sont magnifiques au printemps et à l'automne. L'hiver est pluvieux — poétique pour qui aime parapluie, café et médina.",
    },
  },
  {
    id: "coast",
    name: { es: "Costa atlántica", en: "Atlantic coast", fr: "Côte atlantique" },
    accent: "#7B9ECA",
    best: { es: "May – Sep (todo el verano)", en: "May – Sep (all summer)", fr: "Mai – Sep (tout l'été)" },
    avoid: { es: "Dic – Feb si buscas baño", en: "Dec – Feb if you want to swim", fr: "Déc – Fév pour la baignade" },
    body: {
      es: "Essaouira, Agadir y Asilah viven verano largo: 22–28 °C, brisa atlántica y olas para el surf. La temperatura del mar nunca pasa de 21 °C, así que el baño requiere espíritu vasco más que mediterráneo.",
      en: "Essaouira, Agadir and Asilah enjoy a long summer: 22–28 °C, Atlantic breeze and good surf. Sea temperature never tops 21 °C — swimming is closer to the Basque than to the Mediterranean.",
      fr: "Essaouira, Agadir et Asilah connaissent un long été : 22–28 °C, brise atlantique et houle de surf. La mer ne dépasse jamais 21 °C — la baignade tient davantage du Pays basque que de la Méditerranée.",
    },
  },
];

/* ----- TRAVEL-STYLE MATRIX (interactive) ----- */
export const TRAVEL_STYLES = [
  {
    id: "desert",
    label: { es: "Viajes al desierto", en: "Desert trips", fr: "Voyages au désert" },
    bestMonths: [10, 11, 12, 1, 2, 3, 4],
    body: {
      es: "Octubre a abril es la ventana ideal: días templados, noches estrelladas y bivouac abiertos. Evita junio–agosto, cuando el calor del Sáhara hace inviable la noche al raso.",
      en: "October to April is the sweet spot: mild days, starry nights and open bivouacs. Skip June–August, when Saharan heat makes outdoor sleeping unbearable.",
      fr: "D'octobre à avril, la fenêtre idéale : journées douces, nuits étoilées et bivouacs ouverts. Évitez juin–août, quand la chaleur du Sahara rend la nuit à la belle étoile impossible.",
    },
    accent: "#D97742",
  },
  {
    id: "hiking",
    label: { es: "Senderismo y trekking", en: "Hiking & trekking", fr: "Randonnée et trek" },
    bestMonths: [4, 5, 6, 9, 10],
    body: {
      es: "El Alto Atlas y el M'Goun se caminan mejor en abril–junio (almendros, agua, deshielo) y en septiembre–octubre (luz dorada, refugios todavía abiertos). En invierno, sólo trekking con guía y crampones.",
      en: "The High Atlas and M'Goun walk best in April–June (almonds, snowmelt streams) and September–October (golden light, refuges still open). In winter, only with a guide and crampons.",
      fr: "Le Haut Atlas et le M'Goun se randonnent au mieux en avril–juin (amandiers, fonte des neiges) et en septembre–octobre (lumière dorée, refuges encore ouverts). En hiver, uniquement avec guide et crampons.",
    },
    accent: "#5A6B4F",
  },
  {
    id: "cities",
    label: { es: "Ciudades culturales", en: "Cultural cities", fr: "Cités culturelles" },
    bestMonths: [3, 4, 5, 10, 11, 12, 1, 2],
    body: {
      es: "Marrakech, Fez, Meknès y Rabat se disfrutan mejor en primavera y otoño (días largos, terrazas sin sudor) y también en invierno, con la medina vacía y los riads vestidos de chimenea.",
      en: "Marrakech, Fez, Meknes and Rabat shine in spring and autumn (long days, sweat-free rooftops) and in winter, with quiet medinas and riads dressed with fireplaces.",
      fr: "Marrakech, Fès, Meknès et Rabat se vivent au mieux au printemps et à l'automne (journées longues, terrasses sans transpiration) et en hiver, médinas calmes et riads à cheminée.",
    },
    accent: "#C16542",
  },
  {
    id: "beach",
    label: { es: "Playa y surf", en: "Beach & surf", fr: "Plage et surf" },
    bestMonths: [5, 6, 7, 8, 9],
    body: {
      es: "Mayo a septiembre es la ventana atlántica. Essaouira recibe el famoso «alizé» — viento perfecto para windsurf y kitesurf. Para baño tranquilo, Agadir y Asilah ofrecen aguas un poco más cálidas.",
      en: "May to September is the Atlantic window. Essaouira gets the famous «alizé» — perfect for windsurf and kite. For calmer swimming, Agadir and Asilah offer slightly warmer waters.",
      fr: "De mai à septembre, c'est la fenêtre atlantique. Essaouira reçoit le célèbre « alizé » — vent parfait pour windsurf et kite. Pour la baignade plus calme, Agadir et Asilah offrent une eau un peu plus chaude.",
    },
    accent: "#7B9ECA",
  },
  {
    id: "luxury",
    label: { es: "Viajes premium", en: "Luxury travel", fr: "Voyage haut de gamme" },
    bestMonths: [3, 4, 5, 9, 10, 11, 12],
    body: {
      es: "Las temporadas premium coinciden con la mejor luz: primavera y otoño. Diciembre añade el factor «Fin de Año en el Sáhara». Los riads más selectos sirven cenas a fuego en patios cubiertos — una experiencia distinta del resto del año.",
      en: "Premium seasons match the best light: spring and autumn. December adds the «New Year in the Sahara» factor. The finest riads serve fireside dinners in covered courtyards — an experience unlike any other.",
      fr: "Les saisons premium suivent la meilleure lumière : printemps et automne. Décembre ajoute le « Réveillon au Sahara ». Les riads les plus sélects servent des dîners au coin du feu dans des patios couverts — une expérience à part.",
    },
    accent: "#A07042",
  },
  {
    id: "photography",
    label: { es: "Fotografía", en: "Photography", fr: "Photographie" },
    bestMonths: [10, 11, 12, 1, 2, 3],
    body: {
      es: "La luz oblicua de otoño e invierno es la mejor del año. El Sáhara estira sombras enormes al amanecer, la nieve del Atlas crea contrastes irreales y las medinas se llenan de vapor por la mañana. Lleva trípode para la noche bajo estrellas.",
      en: "Autumn and winter low light is the year's finest. The Sahara stretches enormous shadows at dawn, snow on the Atlas builds surreal contrasts, the medinas steam at sunrise. Pack a tripod for the star nights.",
      fr: "La lumière rasante d'automne et d'hiver est la plus belle de l'année. Le Sahara étire des ombres immenses à l'aube, la neige de l'Atlas dessine des contrastes irréels, les médinas fument au lever du soleil. Trépied indispensable pour les nuits étoilées.",
    },
    accent: "#5A7F9C",
  },
];

/* ----- 12 MONTHS ----- */
export const MONTHS = [
  { id: 1,  name: { es: "Enero", en: "January", fr: "Janvier" },     temp: "8 / 19 °C", region: { es: "Marrakech · Erg Chebbi · Atlas con nieve", en: "Marrakech · Erg Chebbi · Snowy Atlas", fr: "Marrakech · Erg Chebbi · Atlas enneigé" }, highlight: { es: "Almendros en flor del Anti Atlas a finales de mes.", en: "Anti-Atlas almond blossom in the last days.", fr: "Floraison des amandiers de l'Anti-Atlas en fin de mois." } },
  { id: 2,  name: { es: "Febrero", en: "February", fr: "Février" },  temp: "9 / 20 °C", region: { es: "Tafraoute · Festival del Almendro", en: "Tafraoute · Almond Festival", fr: "Tafraoute · Fête de l'amandier" }, highlight: { es: "Festival del Almendro en Tafraoute.", en: "Almond Festival in Tafraoute.", fr: "Fête de l'amandier à Tafraoute." } },
  { id: 3,  name: { es: "Marzo", en: "March", fr: "Mars" },          temp: "11 / 23 °C", region: { es: "Alto Atlas · Drâa · Erg Chebbi", en: "High Atlas · Drâa · Erg Chebbi", fr: "Haut Atlas · Drâa · Erg Chebbi" }, highlight: { es: "Empieza la temporada alta: luz suave, oasis en flor.", en: "High season begins: soft light, blooming oases.", fr: "Début de la haute saison : lumière douce, oasis en fleurs." } },
  { id: 4,  name: { es: "Abril", en: "April", fr: "Avril" },         temp: "13 / 26 °C", region: { es: "Marrakech · Atlas · Fez", en: "Marrakech · Atlas · Fez", fr: "Marrakech · Atlas · Fès" }, highlight: { es: "Ramadán algunos años — confirma fechas si viajas para visitar medinas.", en: "Ramadan some years — check dates if you plan to visit medinas.", fr: "Ramadan certaines années — vérifier les dates si vous visitez les médinas." } },
  { id: 5,  name: { es: "Mayo", en: "May", fr: "Mai" },              temp: "16 / 29 °C", region: { es: "Atlántico · Essaouira · Atlas", en: "Atlantic · Essaouira · Atlas", fr: "Atlantique · Essaouira · Atlas" }, highlight: { es: "Festival Gnaoua de Essaouira (música ancestral).", en: "Gnaoua Festival in Essaouira (ancestral music).", fr: "Festival Gnaoua d'Essaouira (musique ancestrale)." } },
  { id: 6,  name: { es: "Junio", en: "June", fr: "Juin" },           temp: "19 / 33 °C", region: { es: "Costa · Alto Atlas · Chefchaouen", en: "Coast · High Atlas · Chefchaouen", fr: "Côte · Haut Atlas · Chefchaouen" }, highlight: { es: "El desierto entra en su veda. La costa, en cambio, explota.", en: "The desert closes its window. The coast bursts to life.", fr: "Le désert ferme sa fenêtre. La côte, elle, explose." } },
  { id: 7,  name: { es: "Julio", en: "July", fr: "Juillet" },        temp: "21 / 38 °C", region: { es: "Imlil · Essaouira · Asilah", en: "Imlil · Essaouira · Asilah", fr: "Imlil · Essaouira · Asilah" }, highlight: { es: "Festival de Cultura Andalusí en Asilah.", en: "Andalusian Culture Festival in Asilah.", fr: "Festival de culture andalouse à Asilah." } },
  { id: 8,  name: { es: "Agosto", en: "August", fr: "Août" },        temp: "22 / 38 °C", region: { es: "Atlas · Atlántico · ciudades imperiales por la noche", en: "Atlas · Atlantic · imperial cities by night", fr: "Atlas · Atlantique · cités impériales le soir" }, highlight: { es: "Imilchil Marriage Moussem — encuentro bereber del Atlas.", en: "Imilchil Marriage Moussem — Berber gathering in the Atlas.", fr: "Moussem des fiançailles d'Imilchil — rencontre berbère de l'Atlas." } },
  { id: 9,  name: { es: "Septiembre", en: "September", fr: "Septembre" }, temp: "19 / 33 °C", region: { es: "Erg Chebbi · Drâa · Marrakech", en: "Erg Chebbi · Drâa · Marrakech", fr: "Erg Chebbi · Drâa · Marrakech" }, highlight: { es: "Reapertura del desierto. La luz vuelve a ser dorada.", en: "The desert reopens. Light turns golden again.", fr: "Réouverture du désert. La lumière redevient dorée." } },
  { id: 10, name: { es: "Octubre", en: "October", fr: "Octobre" },   temp: "16 / 28 °C", region: { es: "Erg Chebbi · Atlas · Fez", en: "Erg Chebbi · Atlas · Fez", fr: "Erg Chebbi · Atlas · Fès" }, highlight: { es: "La mejor luz del año — pico de fotógrafos y cineastas.", en: "The year's finest light — photographers and filmmakers peak.", fr: "La plus belle lumière de l'année — pic pour photographes et cinéastes." } },
  { id: 11, name: { es: "Noviembre", en: "November", fr: "Novembre" }, temp: "12 / 23 °C", region: { es: "Sáhara · Erfoud · Festival del Dátil", en: "Sahara · Erfoud · Date Festival", fr: "Sahara · Erfoud · Fête de la datte" }, highlight: { es: "Festival del Dátil en Erfoud (3er fin de semana).", en: "Date Festival in Erfoud (3rd weekend).", fr: "Fête de la datte à Erfoud (3ᵉ week-end)." } },
  { id: 12, name: { es: "Diciembre", en: "December", fr: "Décembre" }, temp: "9 / 19 °C", region: { es: "Marrakech · Erg Chebbi · Oukaïmeden (esquí)", en: "Marrakech · Erg Chebbi · Oukaimeden (ski)", fr: "Marrakech · Erg Chebbi · Oukaïmeden (ski)" }, highlight: { es: "Fin de Año en el desierto · gran cita Xaluca Tours.", en: "New Year in the desert · Xaluca Tours' big departure.", fr: "Réveillon dans le désert · le grand départ Xaluca Tours." } },
];

/* ----- FAQ ----- */
export const FAQ = [
  {
    q: { es: "¿Cuándo hace demasiado calor en Marruecos?", en: "When is it too hot in Morocco?", fr: "Quand fait-il trop chaud au Maroc ?" },
    a: {
      es: "De mediados de junio a finales de agosto, Marrakech, Fez y el desierto superan los 40 °C. Si viajas esos meses, busca la costa atlántica (Essaouira, Asilah) o las alturas del Alto Atlas — son entre 10 y 15 °C más frescos.",
      en: "From mid-June through end of August, Marrakech, Fez and the desert top 40 °C. Travelling then? Aim for the Atlantic coast (Essaouira, Asilah) or the High Atlas heights — 10–15 °C cooler.",
      fr: "De mi-juin à fin août, Marrakech, Fès et le désert dépassent 40 °C. Si vous partez à ces mois-là, visez la côte atlantique (Essaouira, Asilah) ou les hauteurs du Haut Atlas — 10 à 15 °C plus frais.",
    },
  },
  {
    q: { es: "¿Cuándo es el mejor momento para ir al Sáhara?", en: "When is the best time for the Sahara?", fr: "Quand partir au Sahara ?" },
    a: {
      es: "De octubre a abril. Los días son templados (20–28 °C), las noches frescas (5–12 °C) y los bivouac están abiertos. Octubre y noviembre ofrecen la mejor luz; diciembre y enero, las noches más estrelladas.",
      en: "October to April. Mild days (20–28 °C), fresh nights (5–12 °C) and bivouacs are open. October and November give the best light; December and January, the starriest nights.",
      fr: "D'octobre à avril. Journées douces (20–28 °C), nuits fraîches (5–12 °C) et bivouacs ouverts. Octobre et novembre offrent la plus belle lumière ; décembre et janvier, les nuits les plus étoilées.",
    },
  },
  {
    q: { es: "¿Cuándo es más barato viajar a Marruecos?", en: "When is travel cheapest?", fr: "Quand le voyage est-il le moins cher ?" },
    a: {
      es: "Enero–febrero y junio–agosto (excluyendo el desierto). En esas ventanas los hoteles bajan precios y los vuelos cuestan hasta un 40 % menos que en la temporada alta de marzo–mayo o septiembre–noviembre.",
      en: "January–February and June–August (skipping the desert). Hotels lower prices and flights run up to 40% cheaper than the March–May or September–November peak.",
      fr: "Janvier–février et juin–août (hors désert). Les hôtels baissent leurs tarifs et les vols sont jusqu'à 40 % moins chers que pendant les pics mars–mai ou septembre–novembre.",
    },
  },
  {
    q: { es: "¿Qué mes es ideal para Marrakech?", en: "Which month is ideal for Marrakech?", fr: "Quel mois est idéal pour Marrakech ?" },
    a: {
      es: "Abril, mayo y octubre. Días entre 24 y 28 °C, noches templadas y terrazas perfectas. Si buscas Marrakech sin multitud y con luz cinematográfica, prueba diciembre o febrero.",
      en: "April, May and October. Days 24–28 °C, mild nights and perfect rooftops. For an empty city with cinematic light, try December or February.",
      fr: "Avril, mai et octobre. Jours à 24–28 °C, nuits douces, terrasses parfaites. Pour une ville vide à la lumière cinématographique, essayez décembre ou février.",
    },
  },
  {
    q: { es: "¿Cuánto dura una excursión típica al desierto?", en: "How long is a typical desert trip?", fr: "Combien de temps dure une virée au désert ?" },
    a: {
      es: "Desde 3 noches / 4 días (Marrakech ↔ Erg Chebbi exprés) hasta 9 noches / 10 días si combinas Atlas, Drâa, Erg Chebbi y Fez. Lo ideal: 5–6 noches, una en bivouac.",
      en: "From 3 nights / 4 days (Marrakech ↔ Erg Chebbi express) up to 9 nights / 10 days combining Atlas, Drâa, Erg Chebbi and Fez. Sweet spot: 5–6 nights with one in a bivouac.",
      fr: "De 3 nuits / 4 jours (Marrakech ↔ Erg Chebbi express) à 9 nuits / 10 jours combinant Atlas, Drâa, Erg Chebbi et Fès. Idéal : 5–6 nuits dont une en bivouac.",
    },
  },
];

/* ----- INTERNAL LINKS ----- */
export const INTERNAL_LINKS = [
  { routeId: "tourSouth",       label: { es: "Sur de Marruecos",      en: "Southern Morocco",    fr: "Sud du Maroc" } },
  { routeId: "tourNorth",       label: { es: "Norte de Marruecos",    en: "Northern Morocco",    fr: "Nord du Maroc" } },
  { routeId: "tourShort",       label: { es: "Escapadas cortas",      en: "Short escapes",       fr: "Escapades courtes" } },
  { routeId: "tourFull",        label: { es: "Marruecos · norte a sur", en: "Morocco · north to south", fr: "Maroc · nord au sud" } },
  { routeId: "tourAdventure",   label: { es: "Aventura · Enduro",     en: "Adventure · Enduro",  fr: "Aventure · Enduro" } },
  { routeId: "tourFinDeAno2025", label:{ es: "Fin de Año en el Sáhara", en: "New Year in the Sahara", fr: "Réveillon au Sahara" } },
];
