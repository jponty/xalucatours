/* ============================================================
   styleTestimonials — short traveller testimonials shown under the
   image of each travel-style block in the home "Estilos de viaje ·
   Cinco formas de descubrir Marruecos" section.

   Keyed by the travel-style slug (see lib/data.js TRAVEL_CATEGORIES).
   Every entry references a real Xaluca Tours programme by routeId.
============================================================ */

export const STYLE_TESTIMONIALS = {
  "magic-south": {
    rating: 5,
    author: "Marta & Javier",
    routeId: "tourAtlasDesierto67",
    quote: {
      es: "El sur de Marruecos nos dejó sin palabras: la ruta de las kasbahs, el Alto Atlas y una noche en las dunas de Erg Chebbi que jamás olvidaremos. Todo perfectamente organizado.",
      en: "Southern Morocco left us speechless: the kasbahs route, the High Atlas and a night on the Erg Chebbi dunes we'll never forget. Everything perfectly organised.",
      fr: "Le Sud du Maroc nous a laissés sans voix : la route des kasbahs, le Haut Atlas et une nuit sur les dunes de l'Erg Chebbi inoubliable. Tout parfaitement organisé.",
    },
  },
  "north-to-south": {
    rating: 5,
    author: "Elena M.",
    routeId: "tourFezRak910",
    quote: {
      es: "Recorrer Marruecos de norte a sur en un solo viaje fue increíble: medinas imperiales, el Atlas y el desierto enlazados sin un solo contratiempo. Una gran travesía.",
      en: "Crossing Morocco from north to south in a single trip was incredible: imperial medinas, the Atlas and the desert linked without a single hitch. A grand journey.",
      fr: "Traverser le Maroc du nord au sud en un seul voyage fut incroyable : médinas impériales, l'Atlas et le désert reliés sans le moindre accroc. Une grande traversée.",
    },
  },
  "short-escapes": {
    rating: 5,
    author: "Carlos D.",
    routeId: "tourEscapadaDesierto34",
    quote: {
      es: "En solo cuatro días vivimos un Marruecos auténtico — desierto, montaña y medina sin prisas. La escapada perfecta para desconectar de verdad.",
      en: "In just four days we experienced an authentic Morocco — desert, mountain and medina without rushing. The perfect escape to truly disconnect.",
      fr: "En seulement quatre jours, nous avons vécu un Maroc authentique — désert, montagne et médina sans nous presser. L'escapade parfaite pour vraiment déconnecter.",
    },
  },
  "northern-morocco": {
    rating: 5,
    author: "Lucía F.",
    routeId: "tourCiudadesImperialesRif78",
    quote: {
      es: "El norte nos enamoró: las ciudades imperiales, la perla azul de Chefchaouen y el Rif. Una cara de Marruecos culta, viva y mediterránea que no esperábamos.",
      en: "The north won us over: the imperial cities, the blue pearl of Chefchaouen and the Rif. A cultured, lively, Mediterranean side of Morocco we didn't expect.",
      fr: "Le nord nous a séduits : les cités impériales, la perle bleue de Chefchaouen et le Rif. Une facette cultivée, vivante et méditerranéenne du Maroc inattendue.",
    },
  },
};

export const getStyleTestimonial = (slug) => STYLE_TESTIMONIALS[slug] || null;
