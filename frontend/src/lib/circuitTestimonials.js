/* ============================================================
   Circuit testimonials — multiple traveller reviews per Home
   "Nuestros circuitos por Marruecos" tab (lib/data CIRCUITS slug).
   Consumed by <CircuitTestimonials /> as a rotating carousel.
   quote = trilingual object; author is a traveller or couple name.
============================================================ */
export const CIRCUIT_TESTIMONIALS = {
  sahara: [
    { rating: 5, author: "Laura & Marc",
      quote: {
        es: "Dormir en el Erg Chebbi y ver amanecer sobre las dunas fue lo más bonito que hemos vivido viajando.",
        en: "Sleeping at Erg Chebbi and watching sunrise over the dunes was the most beautiful thing we've ever experienced travelling.",
        fr: "Dormir à l'Erg Chebbi et voir le lever du soleil sur les dunes fut le plus beau moment de tous nos voyages.",
      } },
    { rating: 5, author: "Javier R.",
      quote: {
        es: "El silencio del desierto al sur de Mhamid no se olvida. Organización impecable de principio a fin.",
        en: "The silence of the desert south of Mhamid is unforgettable. Flawless organisation from start to finish.",
        fr: "Le silence du désert au sud de Mhamid est inoubliable. Organisation impeccable du début à la fin.",
      } },
    { rating: 5, author: "Carmen & Luis",
      quote: {
        es: "La noche en la jaima, las estrellas y el té con los nómadas… mágico y muy auténtico.",
        en: "The night in the desert camp, the stars and tea with the nomads… magical and so authentic.",
        fr: "La nuit sous la tente, les étoiles et le thé avec les nomades… magique et tellement authentique.",
      } },
  ],
  imperial: [
    { rating: 5, author: "Anne D.",
      quote: {
        es: "Fez y Marrakech con un guía que conocía cada rincón de la medina. Un lujo cultural.",
        en: "Fez and Marrakech with a guide who knew every corner of the medina. A cultural treat.",
        fr: "Fès et Marrakech avec un guide qui connaissait chaque recoin de la médina. Un luxe culturel.",
      } },
    { rating: 5, author: "Sofía & Pablo",
      quote: {
        es: "Las cuatro ciudades imperiales en una semana, sin agobios y con hoteles con encanto.",
        en: "The four imperial cities in a week, unhurried and with charming hotels.",
        fr: "Les quatre cités impériales en une semaine, sans stress et avec des hôtels de charme.",
      } },
    { rating: 5, author: "Thomas K.",
      quote: {
        es: "Perderse en los zocos acompañados por Xaluca fue toda una experiencia. Repetiremos.",
        en: "Getting lost in the souks with Xaluca was quite an experience. We'll be back.",
        fr: "Se perdre dans les souks avec Xaluca fut une vraie expérience. Nous reviendrons.",
      } },
  ],
  atlas: [
    { rating: 5, author: "Elena M.",
      quote: {
        es: "Caminamos entre aldeas bereberes y dormimos bajo cumbres nevadas. Naturaleza pura.",
        en: "We trekked through Berber villages and slept beneath snow-capped peaks. Pure nature.",
        fr: "Nous avons marché entre les villages berbères et dormi sous des sommets enneigés. La nature à l'état pur.",
      } },
    { rating: 5, author: "Marco & Giulia",
      quote: {
        es: "El trekking por el Alto Atlas superó nuestras expectativas. Guías de montaña excelentes.",
        en: "The High Atlas trek exceeded our expectations. Excellent mountain guides.",
        fr: "Le trek dans le Haut Atlas a dépassé nos attentes. D'excellents guides de montagne.",
      } },
    { rating: 5, author: "Carla S.",
      quote: {
        es: "Hospitalidad bereber, valles verdes y un ritmo perfecto. Inolvidable.",
        en: "Berber hospitality, green valleys and a perfect pace. Unforgettable.",
        fr: "Hospitalité berbère, vallées verdoyantes et un rythme parfait. Inoubliable.",
      } },
  ],
  kasbahs: [
    { rating: 5, author: "Daniel P.",
      quote: {
        es: "De Uarzazat a Aït Benhaddou, el valle del Dadès nos dejó sin palabras.",
        en: "From Ouarzazate to Aït Benhaddou, the Dadès Valley left us speechless.",
        fr: "D'Ouarzazate à Aït Benhaddou, la vallée du Dadès nous a laissés sans voix.",
      } },
    { rating: 5, author: "Hélène & Paul",
      quote: {
        es: "Las kasbahs de tierra al atardecer son de otro mundo. Ruta muy bien pensada.",
        en: "The earthen kasbahs at sunset are out of this world. A beautifully planned route.",
        fr: "Les kasbahs de terre au coucher du soleil sont hors du monde. Un itinéraire très bien pensé.",
      } },
    { rating: 5, author: "Nuria L.",
      quote: {
        es: "Un viaje cinematográfico de verdad. Cada parada merecía la pena.",
        en: "A truly cinematic journey. Every single stop was worth it.",
        fr: "Un voyage vraiment cinématographique. Chaque étape en valait la peine.",
      } },
  ],
  north: [
    { rating: 5, author: "Andrea G.",
      quote: {
        es: "Chefchaouen azul, Tánger con su calma y el Rif auténtico. El norte nos enamoró.",
        en: "Blue Chefchaouen, calm Tangier and the authentic Rif. The north won us over.",
        fr: "Chefchaouen la bleue, Tanger et son calme et le Rif authentique. Le nord nous a conquis.",
      } },
    { rating: 5, author: "Lucas & Marta",
      quote: {
        es: "Descubrir los queseros del Rif y las medinas vivas del norte fue una sorpresa preciosa.",
        en: "Discovering the Rif cheese-makers and the lively northern medinas was a lovely surprise.",
        fr: "Découvrir les fromagers du Rif et les médinas animées du nord fut une belle surprise.",
      } },
    { rating: 5, author: "Sarah W.",
      quote: {
        es: "Tetuán y Chefchaouen con guías locales encantadores. Muy recomendable.",
        en: "Tetouan and Chefchaouen with delightful local guides. Highly recommended.",
        fr: "Tétouan et Chefchaouen avec des guides locaux charmants. Vivement recommandé.",
      } },
  ],
  short: [
    { rating: 5, author: "Iván T.",
      quote: {
        es: "Cuatro noches y sentimos que habíamos vivido Marruecos entero. Perfecto para poco tiempo.",
        en: "Four nights and we felt we'd experienced all of Morocco. Perfect for a short trip.",
        fr: "Quatre nuits et nous avions l'impression d'avoir vécu tout le Maroc. Parfait quand on a peu de temps.",
      } },
    { rating: 5, author: "Clara & Hugo",
      quote: {
        es: "Una escapada redonda: Marrakech y una noche de vivac en el desierto. Volveremos a por más.",
        en: "A perfect escape: Marrakech and a night of desert bivouac. We'll be back for more.",
        fr: "Une escapade parfaite : Marrakech et une nuit de bivouac dans le désert. Nous reviendrons.",
      } },
    { rating: 5, author: "Émilie R.",
      quote: {
        es: "Ideal para un primer Marruecos. Todo organizado al detalle.",
        en: "Ideal for a first taste of Morocco. Everything organised down to the detail.",
        fr: "Idéal pour un premier Maroc. Tout était organisé dans les moindres détails.",
      } },
  ],
  adventure: [
    { rating: 5, author: "Sergio V.",
      quote: {
        es: "Expedición en 4x4 por el Antiatlas con un equipo que sabe lo que hace. Adrenalina y paisajes brutales.",
        en: "A 4x4 expedition through the Anti-Atlas with a team that knows what they're doing. Adrenaline and stunning landscapes.",
        fr: "Une expédition 4x4 dans l'Anti-Atlas avec une équipe qui sait ce qu'elle fait. Adrénaline et paysages incroyables.",
      } },
    { rating: 5, author: "Nadia & Karim",
      quote: {
        es: "Subir al Toubkal guiados por Xaluca fue el reto de nuestras vidas. Seguridad total.",
        en: "Climbing Toubkal guided by Xaluca was the challenge of our lives. Total peace of mind.",
        fr: "Gravir le Toubkal guidés par Xaluca fut le défi de notre vie. Une sécurité totale.",
      } },
    { rating: 5, author: "David H.",
      quote: {
        es: "Senderos perdidos, dunas y montaña en un mismo viaje. Para espíritus inquietos.",
        en: "Lost trails, dunes and mountains in a single trip. For restless spirits.",
        fr: "Sentiers perdus, dunes et montagne dans un seul voyage. Pour les esprits aventureux.",
      } },
  ],
};

export const getCircuitTestimonials = (slug) => CIRCUIT_TESTIMONIALS[slug] || [];

export default getCircuitTestimonials;
