/* ============================================================
   sectionVideos.js
   ----
   Centralized cinematic video pool used by `<VideoSection />`.
   Posters use the same imagery as existing section galleries so
   the fallback is on-brand even if the video fails to load.

   Editors can swap any `src` URL here (or in the future via the
   CMS edit-mode) without touching the page components.
============================================================ */

const G_CDN = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample";

/* ---------- /viajes/marruecos ---------- */
export const MARRUECOS_VIDEOS = {
  intro: {
    src: `${G_CDN}/Sintel.mp4`,
    poster: "https://images.unsplash.com/photo-1570133435536-7ececf000ef6?auto=format&fit=crop&w=2400&q=85",
    eyebrow: { es: "De norte a sur · Marruecos integral", en: "North to south · Full Morocco", fr: "Du nord au sud · Maroc intégral" },
    title: {
      es: "Cuatro reinos, un solo viaje.",
      en: "Four kingdoms, one single journey.",
      fr: "Quatre royaumes, un seul voyage.",
    },
    caption: {
      es: "Medinas imperiales, cumbres del Atlas y silencio del Sahara cosidos en una misma travesía.",
      en: "Imperial medinas, Atlas peaks and Saharan silence stitched into one crossing.",
      fr: "Médinas impériales, sommets de l'Atlas et silence saharien cousus en une seule traversée.",
    },
  },
};

/* ---------- /viajes/escapadas (5 videos, keyed by item.id) ---------- */
export const ESCAPADAS_VIDEOS = {
  desierto: {
    src: `${G_CDN}/ForBiggerJoyrides.mp4`,
    poster: "https://images.unsplash.com/photo-1542401886-65d6c61db217?auto=format&fit=crop&w=2400&q=85",
    eyebrow: { es: "Escapada al desierto", en: "Desert escape", fr: "Escapade au désert" },
    title: {
      es: "Tres días que valen un Sahara entero.",
      en: "Three days that hold a whole Sahara.",
      fr: "Trois jours qui valent un Sahara entier.",
    },
    caption: {
      es: "Dunas, bivouac de haimas y noche bajo el cielo del Erg Chebbi.",
      en: "Dunes, tented bivouac and night under the Erg Chebbi sky.",
      fr: "Dunes, bivouac sous tente et nuit sous le ciel de l'Erg Chebbi.",
    },
  },
  "alto-atlas": {
    src: `${G_CDN}/ForBiggerMeltdowns.mp4`,
    poster: "https://images.unsplash.com/photo-1559925523-10de9e23cf90?auto=format&fit=crop&w=2400&q=85",
    eyebrow: { es: "Escapada al Alto Atlas", en: "High Atlas escape", fr: "Escapade au Haut Atlas" },
    title: {
      es: "El aire del Atlas, en unos pocos días.",
      en: "Atlas air, in just a few days.",
      fr: "L'air de l'Atlas en quelques jours.",
    },
    caption: {
      es: "Aldeas bereberes colgadas en la montaña, valles del Ourika y picos nevados al fondo.",
      en: "Berber villages clinging to the mountain, the Ourika valley and snowy peaks behind.",
      fr: "Villages berbères accrochés à la montagne, vallée de l'Ourika et sommets enneigés en fond.",
    },
  },
  fez: {
    src: `${G_CDN}/ForBiggerEscapes.mp4`,
    poster: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=2400&q=85",
    eyebrow: { es: "Escapada a Fez", en: "Fez escape", fr: "Escapade à Fès" },
    title: {
      es: "Fez en tres días: medina pura.",
      en: "Fez in three days: pure medina.",
      fr: "Fès en trois jours : médina pure.",
    },
    caption: {
      es: "Tanneries Chouara, mercados, zellige y la madrasa Bou Inania al amanecer.",
      en: "Chouara tanneries, markets, zellige and the Bou Inania madrasa at sunrise.",
      fr: "Tanneries Chouara, marchés, zellige et la médersa Bou Inania à l'aube.",
    },
  },
  marrakech: {
    src: `${G_CDN}/ForBiggerBlazes.mp4`,
    poster: "https://images.unsplash.com/photo-1597212618440-806262de4f6b?auto=format&fit=crop&w=2400&q=85",
    eyebrow: { es: "Escapada a Marrakech", en: "Marrakech escape", fr: "Escapade à Marrakech" },
    title: {
      es: "Marrakech sin prisas.",
      en: "Marrakech, unhurried.",
      fr: "Marrakech sans hâte.",
    },
    caption: {
      es: "Jardín Majorelle, Bahia, Yemaa el Fna y los patios secretos de los riads.",
      en: "Majorelle gardens, Bahia palace, Jemaa el Fna and the hidden riad courtyards.",
      fr: "Jardin Majorelle, palais Bahia, Jemaa el Fna et les patios secrets des riads.",
    },
  },
  tanger: {
    src: `${G_CDN}/ForBiggerFun.mp4`,
    poster: "https://images.unsplash.com/photo-1547234935-80c7145ec969?auto=format&fit=crop&w=2400&q=85",
    eyebrow: { es: "Escapada a Tánger y el Rif", en: "Tangier & Rif escape", fr: "Escapade à Tanger et le Rif" },
    title: {
      es: "El norte azul, en un fin de semana largo.",
      en: "The blue north, in one long weekend.",
      fr: "Le nord bleu, en un long week-end.",
    },
    caption: {
      es: "Tánger, Chefchaouen y la costa donde el Atlántico abraza al Mediterráneo.",
      en: "Tangier, Chefchaouen and the coast where Atlantic meets Mediterranean.",
      fr: "Tanger, Chefchaouen et la côte où l'Atlantique rencontre la Méditerranée.",
    },
  },
};

/* ---------- /viajes/nortedemarruecos ---------- */
export const NORTE_VIDEOS = {
  imperial: {
    src: `${G_CDN}/TearsOfSteel.mp4`,
    poster: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=2400&q=85",
    eyebrow: { es: "Ciudades imperiales", en: "Imperial cities", fr: "Cités impériales" },
    title: {
      es: "Fez, Meknès y Rabat — el alma imperial.",
      en: "Fez, Meknès and Rabat — the imperial soul.",
      fr: "Fès, Meknès et Rabat — l'âme impériale.",
    },
    caption: {
      es: "Cuatro capitales, mil años de historia, una ruta que une zocos, madrasas y palacios.",
      en: "Four capitals, a thousand years of history, one route weaving souks, madrasas and palaces.",
      fr: "Quatre capitales, mille ans d'histoire, un itinéraire qui relie souks, médersas et palais.",
    },
  },
  rif: {
    src: `${G_CDN}/ForBiggerJoyrides.mp4`,
    poster: "https://images.unsplash.com/photo-1547234935-80c7145ec969?auto=format&fit=crop&w=2400&q=85",
    eyebrow: { es: "Tánger · Chefchaouen · Rif", en: "Tangier · Chefchaouen · Rif", fr: "Tanger · Chefchaouen · Rif" },
    title: {
      es: "El norte azul.",
      en: "The blue north.",
      fr: "Le nord bleu.",
    },
    caption: {
      es: "Donde el Atlántico abraza al Mediterráneo y los pueblos pintados ascienden por la montaña.",
      en: "Where the Atlantic meets the Mediterranean and painted villages climb the mountainside.",
      fr: "Où l'Atlantique rejoint la Méditerranée et les villages peints grimpent la montagne.",
    },
  },
};
