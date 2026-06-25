/* ============================================================
   dayTestimonials — short, day-specific traveller testimonials
   shown in the right column of a programme day, just below the
   "Asistente Virtual" / "Contactar" buttons.

   Each testimonial is tied to a SPECIFIC day of a SPECIFIC trip
   (keyed by routeId → dayId) so the social proof matches exactly
   what the visitor is reading about that day.

   PILOT: only wired for tourAtlasDesierto67 for now. Returns null
   for any other trip/day, so the block simply doesn't render.
   `author` is a plain name (same in every language); `quote` and
   `origin` are trilingual.
============================================================ */

const TESTIMONIALS = {
  tourAtlasDesierto67: {
    // Día 1 · Llegada a Ouarzazate – Boumalne Dades
    "dia-1": {
      rating: 5,
      author: "Marta & Javier",
      origin: { es: "Madrid, España", en: "Madrid, Spain", fr: "Madrid, Espagne" },
      quote: {
        es: "Llegamos de noche a Ouarzazate y despertar en el Hotel Xaluca Dades, con el Alto Atlas asomando por la ventana, fue el mejor comienzo posible. El traslado, puntual y todo cuidado al detalle.",
        en: "We arrived in Ouarzazate at night and waking up at Hotel Xaluca Dades, with the High Atlas peeking through the window, was the best possible start. The transfer was on time and every detail taken care of.",
        fr: "Nous sommes arrivés de nuit à Ouarzazate et se réveiller à l'Hotel Xaluca Dades, avec le Haut Atlas par la fenêtre, fut le meilleur des débuts. Transfert ponctuel et tout soigné dans le moindre détail.",
      },
    },
    // Día 2 · Alto Atlas Central – Boutaghrar – M'Goun
    "dia-atlas-mgoun": {
      rating: 5,
      author: "Claudia R.",
      origin: { es: "Barcelona, España", en: "Barcelona, Spain", fr: "Barcelone, Espagne" },
      quote: {
        es: "El día por el Atlas Central nos dejó sin palabras: aldeas bereberes colgadas de la montaña y el macizo del M'Goun de fondo. Nuestro chófer conocía cada rincón y cada historia.",
        en: "The day through the Central Atlas left us speechless: Berber villages clinging to the mountainside and the M'Goun massif behind. Our driver knew every corner and every story.",
        fr: "La journée dans l'Atlas central nous a laissés sans voix : villages berbères accrochés à la montagne et massif du M'Goun en toile de fond. Notre chauffeur connaissait chaque recoin et chaque histoire.",
      },
    },
    // Día 3 · Valle del Dades – Gargantas del Todra – Erfoud
    "dia-dades-todra": {
      rating: 5,
      author: "Thomas & Lena",
      origin: { es: "Múnich, Alemania", en: "Munich, Germany", fr: "Munich, Allemagne" },
      quote: {
        es: "Las curvas del Dades y las paredes verticales del Todra son de otro planeta. Paramos donde quisimos para hacer fotos; nunca sentimos prisa.",
        en: "The Dades switchbacks and the vertical walls of the Todra are out of this world. We stopped wherever we liked for photos; we never felt rushed.",
        fr: "Les lacets du Dadès et les parois verticales du Todra sont d'un autre monde. Nous nous arrêtions où nous voulions pour les photos ; jamais pressés.",
      },
    },
    // Día 4 · Desierto total – Erg Chebbi y bivouac
    "dia-2": {
      rating: 5,
      author: "Elena M.",
      origin: { es: "Valencia, España", en: "Valencia, Spain", fr: "Valence, Espagne" },
      quote: {
        es: "La llegada en dromedario a las dunas de Erg Chebbi y la noche en el campamento, bajo un cielo imposible de estrellas, fue sin duda la noche de nuestras vidas.",
        en: "Riding a camel into the Erg Chebbi dunes and the night at the camp, under an impossible sky full of stars, was without doubt the night of our lives.",
        fr: "L'arrivée à dromadaire dans les dunes de l'Erg Chebbi et la nuit au campement, sous un ciel d'étoiles incroyable, fut sans aucun doute la nuit de notre vie.",
      },
    },
    // Día 5 · Amanecer en el desierto – Khamlia – Merdani
    "dia-3": {
      rating: 5,
      author: "Sophie & Antoine",
      origin: { es: "Lyon, Francia", en: "Lyon, France", fr: "Lyon, France" },
      quote: {
        es: "Ver salir el sol sobre el erg y después escuchar la música gnawa en Khamlia fue pura emoción. Un día que mezcla naturaleza y cultura a partes iguales.",
        en: "Watching the sun rise over the erg and then hearing Gnawa music in Khamlia was pure emotion. A day that blends nature and culture in equal measure.",
        fr: "Voir le soleil se lever sur l'erg puis écouter la musique gnawa à Khamlia, pure émotion. Une journée qui mêle nature et culture à parts égales.",
      },
    },
    // Día 6 · Rissani – Mercados ancestrales – Relax en Erfoud
    "dia-4-rissani": {
      rating: 5,
      author: "Carlos D.",
      origin: { es: "Sevilla, España", en: "Seville, Spain", fr: "Séville, Espagne" },
      quote: {
        es: "El zoco de Rissani es un torbellino de colores y aromas; probamos dátiles recién cogidos. Por la tarde, la piscina del hotel fue el premio perfecto.",
        en: "The Rissani souk is a whirl of colours and aromas; we tasted freshly picked dates. In the afternoon, the hotel pool was the perfect reward.",
        fr: "Le souk de Rissani est un tourbillon de couleurs et d'arômes ; nous avons goûté des dattes fraîchement cueillies. L'après-midi, la piscine de l'hôtel fut la récompense parfaite.",
      },
    },
    // Día 7 · Valle del Ziz – Errachidia – Regreso
    "dia-ziz-return": {
      rating: 5,
      author: "Inés & Pablo",
      origin: { es: "Bilbao, España", en: "Bilbao, Spain", fr: "Bilbao, Espagne" },
      quote: {
        es: "El palmeral del Ziz es una despedida preciosa. Volvimos a casa con la sensación de haber vivido un viaje redondo, bien organizado de principio a fin.",
        en: "The Ziz palm grove is a beautiful farewell. We came home feeling we'd lived a perfectly rounded trip, well organised from start to finish.",
        fr: "La palmeraie du Ziz est un adieu magnifique. Nous sommes rentrés avec le sentiment d'un voyage parfait, bien organisé du début à la fin.",
      },
    },
  },
};

export const getDayTestimonial = (routeId, dayId) => {
  const trip = TESTIMONIALS[routeId];
  if (!trip) return null;
  return trip[dayId] || null;
};

export default getDayTestimonial;
