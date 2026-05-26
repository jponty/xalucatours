// Trilingual customer testimonials.
// Tagged with `themes` so we can filter by destination/page:
//   "general" → homepage
//   "sur" | "norte" | "atlas" | "desert" | "marruecos" | "escapadas" | "aventura" | "bespoke"
//
// Each entry: { id, name, location, themes[], avatar?, quote{es,en,fr}, trip{es,en,fr}, date }

const T = (es, en, fr) => ({ es, en, fr });

// Curated avatar set — neutral portraits, no faces from the Moroccan whitelist
// to avoid mismatching real people. Replace via image_selector if needed.
const AVATAR = {
  laia:    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=facearea&facepad=2.6&w=240&h=240&q=85",
  carlos:  "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=facearea&facepad=2.6&w=240&h=240&q=85",
  sophie:  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=facearea&facepad=2.6&w=240&h=240&q=85",
  thomas:  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=2.6&w=240&h=240&q=85",
  marta:   "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=facearea&facepad=2.6&w=240&h=240&q=85",
  julien:  "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=facearea&facepad=2.6&w=240&h=240&q=85",
  emma:    "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=facearea&facepad=2.6&w=240&h=240&q=85",
  david:   "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&facepad=2.6&w=240&h=240&q=85",
  amelie:  "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?auto=format&fit=facearea&facepad=2.6&w=240&h=240&q=85",
};

export const TESTIMONIALS = [
  {
    id: "laia-sur",
    name: "Laia & Marc",
    location: "Barcelona, ES",
    themes: ["general", "sur", "marruecos", "desert"],
    avatar: AVATAR.laia,
    date: "2025-11",
    trip: T("Atlas + Erg Chebbi · 7 días", "Atlas + Erg Chebbi · 7 days", "Atlas + Erg Chebbi · 7 jours"),
    quote: T(
      "Xaluca convirtió cada día en una postal. Dormir bajo las estrellas del Erg Chebbi, después de un té con los nómadas, ha sido lo más auténtico que hemos vivido nunca.",
      "Xaluca turned every day into a postcard. Sleeping under the Erg Chebbi stars after tea with nomads has been the most authentic thing we've ever lived.",
      "Xaluca a transformé chaque journée en carte postale. Dormir sous les étoiles de l'Erg Chebbi après un thé chez les nomades a été le moment le plus authentique de notre vie.",
    ),
  },
  {
    id: "carlos-bespoke",
    name: "Carlos Ferrer",
    location: "Valencia, ES",
    themes: ["general", "bespoke", "marruecos"],
    avatar: AVATAR.carlos,
    date: "2025-10",
    trip: T("Viaje a medida · 10 días", "Tailor-made · 10 days", "Sur mesure · 10 jours"),
    quote: T(
      "Pedí un viaje sin clichés y me lo entregaron a la perfección. Atención impecable antes, durante y después. Volveré.",
      "I asked for a no-cliché trip and they delivered it perfectly. Impeccable care before, during and after. I'll be back.",
      "J'ai demandé un voyage hors clichés et ils l'ont livré à la perfection. Service impeccable avant, pendant et après. Je reviendrai.",
    ),
  },
  {
    id: "sophie-fez",
    name: "Sophie & Antoine",
    location: "Lyon, FR",
    themes: ["general", "norte", "marruecos"],
    avatar: AVATAR.sophie,
    date: "2025-09",
    trip: T("Ciudades imperiales · 5 días", "Imperial cities · 5 days", "Villes impériales · 5 jours"),
    quote: T(
      "La medina de Fez con un guía local que vive en ella es otra experiencia. Detalles cuidados al milímetro: hoteles con encanto, traslados puntuales y consejos que no salen en ninguna guía.",
      "Walking Fez's medina with a guide who actually lives in it is another experience. Every detail was perfect: charming hotels, on-time transfers and tips you won't find in any guidebook.",
      "Parcourir la médina de Fès avec un guide qui y vit est une autre expérience. Détails parfaits : hôtels de charme, transferts ponctuels et conseils introuvables ailleurs.",
    ),
  },
  {
    id: "thomas-aventura",
    name: "Thomas Becker",
    location: "Berlin, DE",
    themes: ["aventura", "atlas", "general"],
    avatar: AVATAR.thomas,
    date: "2025-08",
    trip: T("Trekking M'Goun · 6 días", "M'Goun trekking · 6 days", "Trekking M'Goun · 6 jours"),
    quote: T(
      "El equipo entiende la montaña. Muleros, cocinero y guía formaban una familia. Subí al M'Goun sintiéndome cuidado en cada paso.",
      "The team understands the mountains. Muleteers, cook and guide felt like family. I climbed M'Goun feeling cared for every step of the way.",
      "L'équipe connaît la montagne. Muletiers, cuisinier et guide formaient une famille. J'ai gravi le M'Goun en me sentant épaulé à chaque pas.",
    ),
  },
  {
    id: "marta-escapadas",
    name: "Marta Ruiz",
    location: "Madrid, ES",
    themes: ["escapadas", "general", "desert"],
    avatar: AVATAR.marta,
    date: "2025-12",
    trip: T("Escapada al desierto · 3 días", "Desert escape · 3 days", "Escapade au désert · 3 jours"),
    quote: T(
      "Tres días me cambiaron el chip del año entero. El bivouac de Xaluca es otro nivel: cama de verdad, baño privado y un silencio que no se olvida.",
      "Three days reset my whole year. Xaluca's bivouac is on another level: real bed, private bathroom and a silence you don't forget.",
      "Trois jours ont remis mon année à zéro. Le bivouac de Xaluca est d'un autre niveau : vrai lit, salle de bain privée et un silence inoubliable.",
    ),
  },
  {
    id: "julien-norte",
    name: "Julien Moreau",
    location: "Paris, FR",
    themes: ["norte", "marruecos", "general"],
    avatar: AVATAR.julien,
    date: "2025-07",
    trip: T("Tánger · Chefchaouen · Fez · 6 días", "Tangier · Chefchaouen · Fez · 6 days", "Tanger · Chefchaouen · Fès · 6 jours"),
    quote: T(
      "Chefchaouen al amanecer, sin turistas, vale el viaje entero. Xaluca sabe a qué hora estar en cada sitio.",
      "Chefchaouen at sunrise, without tourists, is worth the entire trip. Xaluca knows exactly when to be where.",
      "Chefchaouen au lever du soleil, sans touristes, vaut tout le voyage. Xaluca sait précisément où être et à quelle heure.",
    ),
  },
  {
    id: "emma-sur",
    name: "Emma & Luca",
    location: "Milano, IT",
    themes: ["sur", "atlas", "desert", "marruecos"],
    avatar: AVATAR.emma,
    date: "2025-10",
    trip: T("Gargantas del Dadès y Todra · 5 días", "Dades & Todra Gorges · 5 days", "Gorges du Dadès et Todra · 5 jours"),
    quote: T(
      "Las gargantas del Todra desde un 4x4 con un chófer bereber que conoce cada curva… inolvidable. Cada hotel parecía elegido para nosotros.",
      "Driving the Todra Gorges in a 4x4 with a Berber driver who knows every bend… unforgettable. Each hotel felt hand-picked for us.",
      "Traverser les Gorges du Todra en 4x4 avec un chauffeur berbère qui connaît chaque virage… inoubliable. Chaque hôtel semblait choisi pour nous.",
    ),
  },
  {
    id: "david-aventura",
    name: "David Lewis",
    location: "London, UK",
    themes: ["aventura", "atlas", "general"],
    avatar: AVATAR.david,
    date: "2025-06",
    trip: T("Atlas + Sahara en 4x4 · 8 días", "Atlas + Sahara 4x4 · 8 days", "Atlas + Sahara en 4x4 · 8 jours"),
    quote: T(
      "Un viaje exigente, planificado al detalle. Nunca tuvimos que preocuparnos por nada salvo de disfrutar el paisaje.",
      "A demanding trip planned down to the last detail. We never had to worry about anything except enjoying the landscape.",
      "Un voyage exigeant, planifié dans les moindres détails. Nous n'avons eu à nous soucier que du paysage.",
    ),
  },
  {
    id: "amelie-bespoke",
    name: "Amélie & Famille",
    location: "Bordeaux, FR",
    themes: ["bespoke", "general", "marruecos", "escapadas"],
    avatar: AVATAR.amelie,
    date: "2025-04",
    trip: T("Viaje en familia a medida · 9 días", "Family tailor-made · 9 days", "Famille sur mesure · 9 jours"),
    quote: T(
      "Viajar con dos niños pequeños por Marruecos parecía imposible. Xaluca lo hizo cómodo, divertido y absolutamente seguro.",
      "Travelling Morocco with two small kids felt impossible. Xaluca made it comfortable, fun and completely safe.",
      "Voyager au Maroc avec deux jeunes enfants paraissait impossible. Xaluca l'a rendu confortable, amusant et totalement sûr.",
    ),
  },
];

// Helper — return testimonials matching any of the given themes.
// Always returns at least 3 entries (falls back to "general" + extras).
export const getTestimonialsForThemes = (themes = [], limit = 3) => {
  const set = new Set(themes);
  const matches = TESTIMONIALS.filter((t) => t.themes.some((th) => set.has(th)));
  const merged = matches.length >= limit
    ? matches
    : [...matches, ...TESTIMONIALS.filter((t) => !matches.includes(t) && t.themes.includes("general"))];
  return merged.slice(0, limit);
};
