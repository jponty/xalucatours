// Trilingual customer testimonials.
// Each entry has rich `themes[]` so pages can request very specific cards
// per content block (e.g. desert-bivouac, gnawa, fez-medina, m'goun, enduro…).
//
// Keys for themes:
//   page-level:    "general" | "marruecos" | "sur" | "norte" | "escapadas" | "aventura" | "bespoke"
//   experience:    "desert" | "dunes" | "bivouac" | "stars" | "nomads" | "camel" | "gnawa"
//                  "atlas" | "mgoun" | "trekking" | "berber-village" | "gorges"
//                  "fez" | "marrakech" | "imperial" | "medina" | "riad" | "gastronomy"
//                  "chefchaouen" | "tangier" | "essaouira" | "coast"
//                  "4x4" | "enduro" | "expedition" | "adrenaline"
//                  "family" | "honeymoon" | "wellness" | "luxury" | "short-escape"

import { testimonialProgramLabel } from "@/lib/testimonialPrograms";

const T = (es, en, fr) => ({ es, en, fr });

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
  hugo:    "https://images.unsplash.com/photo-1463453091185-61582044d556?auto=format&fit=facearea&facepad=2.6&w=240&h=240&q=85",
  isabel:  "https://images.unsplash.com/photo-1496440737103-cd596325d314?auto=format&fit=facearea&facepad=2.6&w=240&h=240&q=85",
  pierre:  "https://images.unsplash.com/photo-1542178243-bc20204b769f?auto=format&fit=facearea&facepad=2.6&w=240&h=240&q=85",
  claudia: "https://images.unsplash.com/photo-1554151228-14d9def656e4?auto=format&fit=facearea&facepad=2.6&w=240&h=240&q=85",
  ricardo: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=facearea&facepad=2.6&w=240&h=240&q=85",
  ines:    "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=facearea&facepad=2.6&w=240&h=240&q=85",
  mathieu: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=facearea&facepad=2.6&w=240&h=240&q=85",
  paula:   "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=facearea&facepad=2.6&w=240&h=240&q=85",
  nora:    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=facearea&facepad=2.6&w=240&h=240&q=85",
  oliver:  "https://images.unsplash.com/photo-1488161628813-04466f872be2?auto=format&fit=facearea&facepad=2.6&w=240&h=240&q=85",
  laure:   "https://images.unsplash.com/photo-1521252659862-eec69941b071?auto=format&fit=facearea&facepad=2.6&w=240&h=240&q=85",
};

const RAW_TESTIMONIALS = [
  /* ============ DESERT · DUNES · BIVOUAC · STARS · NOMADS ============ */
  {
    id: "laia-bivouac",
    name: "Laia & Marc",
    themes: ["general", "sur", "marruecos", "desert", "dunes", "bivouac", "stars"],
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
    id: "marta-haima",
    name: "Marta Ruiz",
    themes: ["escapadas", "desert", "bivouac", "short-escape", "wellness"],
    avatar: AVATAR.marta,
    date: "2025-12",
    trip: T("Escapada al desierto · 3 días", "Desert escape · 3 days", "Escapade au désert · 3 jours"),
    quote: T(
      "Tres días me cambiaron el chip del año entero. La haima de Xaluca tiene cama de verdad, baño privado y un silencio que no se olvida.",
      "Three days reset my whole year. Xaluca's jaima has a real bed, private bathroom and a silence you don't forget.",
      "Trois jours ont remis mon année à zéro. La tente Xaluca a un vrai lit, salle de bain privée et un silence inoubliable.",
    ),
  },
  {
    id: "ricardo-stars",
    name: "Ricardo & Ana",
    themes: ["desert", "stars", "honeymoon", "general", "marruecos"],
    avatar: AVATAR.ricardo,
    date: "2025-10",
    trip: T("Luna de miel en el Sahara · 5 días", "Sahara honeymoon · 5 days", "Lune de miel au Sahara · 5 jours"),
    quote: T(
      "Pedimos algo especial para nuestra luna de miel. Nos despertaron con sábanas blancas, pétalos de rosa y un cielo sin contaminación lumínica. Inolvidable.",
      "We asked for something special for our honeymoon. They woke us up with white linen, rose petals and a sky with zero light pollution. Unforgettable.",
      "Nous voulions quelque chose de spécial pour notre lune de miel. Réveil avec draps blancs, pétales de roses et un ciel sans pollution lumineuse. Inoubliable.",
    ),
  },
  {
    id: "ines-camel",
    name: "Inés Vega",
    themes: ["desert", "camel", "dunes", "escapadas", "short-escape"],
    avatar: AVATAR.ines,
    date: "2025-09",
    trip: T("Erg Chebbi en dromedario · 4 días", "Erg Chebbi by camel · 4 days", "Erg Chebbi à dos de dromadaire · 4 jours"),
    quote: T(
      "El paso lento del dromedario te impone otro tiempo. Llegamos al campamento justo con el último naranja del horizonte. Magia pura.",
      "The camel's slow pace forces another rhythm on you. We reached camp just with the last orange of the horizon. Pure magic.",
      "Le pas lent du dromadaire impose un autre rythme. Nous sommes arrivés au campement juste avec le dernier orange de l'horizon. Magie pure.",
    ),
  },
  {
    id: "hugo-gnawa",
    name: "Hugo Salinas",
    themes: ["desert", "nomads", "gnawa", "general", "marruecos"],
    avatar: AVATAR.hugo,
    date: "2025-08",
    trip: T("Sahara y cultura amazigh · 6 días", "Sahara & Amazigh culture · 6 days", "Sahara et culture amazighe · 6 jours"),
    quote: T(
      "La noche de música Gnawa en Khamlia me dejó sin palabras. Los krakebs, los tambores, el trance… Xaluca conoce a estas familias desde hace años, y se nota.",
      "The Gnawa music night in Khamlia left me speechless. The krakebs, the drums, the trance… Xaluca has known these families for years, and it shows.",
      "La soirée de musique Gnawa à Khamlia m'a laissé sans voix. Les krakebs, les tambours, la transe… Xaluca connaît ces familles depuis des années.",
    ),
  },

  /* ============ ATLAS · M'GOUN · TREKKING · BERBER VILLAGES · GORGES ============ */
  {
    id: "thomas-mgoun",
    name: "Thomas Becker",
    themes: ["aventura", "atlas", "mgoun", "trekking", "expedition", "general"],
    avatar: AVATAR.thomas,
    date: "2025-08",
    trip: T("Trekking M'Goun · 6 días", "M'Goun trekking · 6 days", "Trekking M'Goun · 6 jours"),
    quote: T(
      "El equipo entiende la montaña. Muleros, cocinero y guía formaban una familia. Subí al M'Goun (4.071 m) sintiéndome cuidado en cada paso.",
      "The team understands the mountains. Muleteers, cook and guide felt like family. I climbed M'Goun (4,071 m) feeling cared for every step of the way.",
      "L'équipe connaît la montagne. Muletiers, cuisinier et guide formaient une famille. J'ai gravi le M'Goun (4 071 m) en me sentant épaulé à chaque pas.",
    ),
  },
  {
    id: "claudia-berber",
    name: "Claudia & Stefan",
    themes: ["atlas", "berber-village", "trekking", "general", "marruecos"],
    avatar: AVATAR.claudia,
    date: "2025-05",
    trip: T("Pueblos bereberes del Alto Atlas · 4 días", "High Atlas Berber villages · 4 days", "Villages berbères du Haut Atlas · 4 jours"),
    quote: T(
      "Dormimos en una casa familiar a 2.100 m. Cocinamos couscous con la abuela y aprendimos a tejer un nudo bereber con sus nietas. Eso no se compra.",
      "We slept in a family home at 2,100 m. Cooked couscous with the grandmother and learned a Berber knot with her granddaughters. That cannot be bought.",
      "Nous avons dormi dans une maison familiale à 2 100 m. Cuisiné le couscous avec la grand-mère, appris un nœud berbère avec ses petites-filles. Ça ne s'achète pas.",
    ),
  },
  {
    id: "emma-todra",
    name: "Emma & Luca",
    themes: ["sur", "atlas", "gorges", "marruecos"],
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
    id: "oliver-atlas-escape",
    name: "Oliver & Anya",
    themes: ["escapadas", "atlas", "short-escape", "berber-village"],
    avatar: AVATAR.oliver,
    date: "2025-04",
    trip: T("Escapada al Alto Atlas · 3 días", "High Atlas escape · 3 days", "Escapade au Haut Atlas · 3 jours"),
    quote: T(
      "Necesitábamos desconectar un fin de semana largo. El Atlas en mayo, con flores silvestres por todas partes, fue mejor que un retiro de spa.",
      "We needed a long-weekend reset. The Atlas in May, wildflowers everywhere, beat any spa retreat.",
      "Il nous fallait déconnecter un long week-end. L'Atlas en mai, fleurs sauvages partout, mieux qu'une retraite spa.",
    ),
  },

  /* ============ IMPERIAL CITIES · FEZ · MEDINA · RIAD · GASTRONOMY ============ */
  {
    id: "sophie-fez",
    name: "Sophie & Antoine",
    themes: ["norte", "marruecos", "imperial", "fez", "medina", "general"],
    avatar: AVATAR.sophie,
    date: "2025-09",
    trip: T("Ciudades imperiales · 5 días", "Imperial cities · 5 days", "Villes impériales · 5 jours"),
    quote: T(
      "Recorrer la medina de Fez con un guía que vive en ella es otra experiencia. Detalles cuidados al milímetro: riads con encanto, traslados puntuales y consejos que no salen en ninguna guía.",
      "Walking Fez's medina with a guide who actually lives in it is another experience. Every detail was perfect: charming riads, on-time transfers and tips you won't find in any guidebook.",
      "Parcourir la médina de Fès avec un guide qui y vit est une autre expérience. Détails parfaits : riads de charme, transferts ponctuels et conseils introuvables ailleurs.",
    ),
  },
  {
    id: "isabel-riad",
    name: "Isabel & Diogo",
    themes: ["norte", "fez", "riad", "imperial", "gastronomy", "marruecos"],
    avatar: AVATAR.isabel,
    date: "2025-06",
    trip: T("Fez · Meknes · Volubilis · 5 días", "Fez · Meknes · Volubilis · 5 days", "Fès · Meknès · Volubilis · 5 jours"),
    quote: T(
      "El riad de Fez era una joya escondida. La cena de seven-vegetable couscous en la terraza, mientras sonaba el adhan, es uno de esos momentos que se quedan.",
      "The riad in Fez was a hidden jewel. The seven-vegetable couscous dinner on the rooftop while the adhan was calling is one of those moments that stay.",
      "Le riad de Fès était un joyau caché. Le dîner couscous aux sept légumes sur la terrasse pendant que l'adhan résonnait : un moment qui reste.",
    ),
  },
  {
    id: "julien-chef",
    name: "Julien Moreau",
    themes: ["norte", "marruecos", "chefchaouen", "tangier", "imperial"],
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
    id: "nora-marrakech",
    name: "Nora Jansen",
    themes: ["sur", "marrakech", "imperial", "riad", "gastronomy", "marruecos"],
    avatar: AVATAR.nora,
    date: "2025-03",
    trip: T("Marrakech & Atlas · 6 días", "Marrakech & Atlas · 6 days", "Marrakech & Atlas · 6 jours"),
    quote: T(
      "El riad en la medina de Marrakech era un oasis. Después del bullicio de Jemaa el-Fna, abrir esa puerta era como entrar en otro mundo.",
      "The riad in the Marrakech medina was an oasis. After the Jemaa el-Fna buzz, opening that door felt like stepping into another world.",
      "Le riad dans la médina de Marrakech était une oasis. Après l'agitation de Jemaa el-Fna, franchir cette porte était comme entrer dans un autre monde.",
    ),
  },
  {
    id: "mathieu-fez-escape",
    name: "Mathieu Lambert",
    themes: ["escapadas", "fez", "medina", "short-escape", "imperial"],
    avatar: AVATAR.mathieu,
    date: "2025-02",
    trip: T("Escapada a Fez · 3 días", "Fez escape · 3 days", "Escapade à Fès · 3 jours"),
    quote: T(
      "Tres días en Fez son suficientes para enamorarse. Sin desplazamientos largos, sólo medina, riad y vida real marroquí.",
      "Three days in Fez are enough to fall in love. No long drives, just medina, riad and real Moroccan life.",
      "Trois jours à Fès suffisent à tomber amoureux. Pas de longs trajets, juste médina, riad et vraie vie marocaine.",
    ),
  },

  /* ============ COAST · ESSAOUIRA · TANGIER ============ */
  {
    id: "paula-essaouira",
    name: "Paula & Ben",
    themes: ["sur", "marruecos", "essaouira", "coast", "gastronomy"],
    avatar: AVATAR.paula,
    date: "2025-05",
    trip: T("Marrakech & Essaouira · 5 días", "Marrakech & Essaouira · 5 days", "Marrakech & Essaouira · 5 jours"),
    quote: T(
      "Después del calor de Marrakech, el viento atlántico de Essaouira fue una bendición. Pescado fresco en el puerto y atardeceres dorados — un final perfecto.",
      "After Marrakech's heat, Essaouira's Atlantic wind was a blessing. Fresh fish at the harbour and golden sunsets — a perfect finale.",
      "Après la chaleur de Marrakech, le vent atlantique d'Essaouira était une bénédiction. Poisson frais au port et couchers de soleil dorés — final parfait.",
    ),
  },
  {
    id: "laure-tanger",
    name: "Laure Vidal",
    themes: ["escapadas", "norte", "tangier", "coast", "short-escape"],
    avatar: AVATAR.laure,
    date: "2025-01",
    trip: T("Escapada a Tánger · 3 días", "Tangier escape · 3 days", "Escapade à Tanger · 3 jours"),
    quote: T(
      "Tánger me sorprendió: arte, cafés literarios, vistas a Europa desde el Cabo Espartel. Xaluca eligió un riad con terraza sobre la kasbah, perfecto.",
      "Tangier surprised me: art, literary cafés, views to Europe from Cape Spartel. Xaluca picked a riad with a terrace over the kasbah — perfect.",
      "Tanger m'a surprise : art, cafés littéraires, vues sur l'Europe depuis le cap Spartel. Xaluca a choisi un riad avec terrasse sur la kasbah, parfait.",
    ),
  },

  /* ============ ADVENTURE · 4x4 · ENDURO · EXPEDITION · ADRENALINE ============ */
  {
    id: "david-4x4",
    name: "David Lewis",
    themes: ["aventura", "4x4", "expedition", "atlas", "desert", "adrenaline"],
    avatar: AVATAR.david,
    date: "2025-06",
    trip: T("Atlas + Sahara en 4x4 · 8 días", "Atlas + Sahara 4x4 · 8 days", "Atlas + Sahara en 4x4 · 8 jours"),
    quote: T(
      "Un viaje exigente, planificado al detalle. Pistas reales del Dakar, rutas off-road sin otro vehículo a la vista. Adrenalina pura sin renunciar a un buen vino al final del día.",
      "A demanding trip planned to the last detail. Real Dakar tracks, off-road routes with no other car in sight. Pure adrenaline without giving up a good wine at sundown.",
      "Un voyage exigeant, planifié au détail près. Vraies pistes du Dakar, off-road sans aucun autre véhicule. Adrénaline pure sans renoncer à un bon vin le soir.",
    ),
  },
  {
    id: "pierre-enduro",
    name: "Pierre Lacombe",
    themes: ["aventura", "enduro", "expedition", "adrenaline", "atlas"],
    avatar: AVATAR.pierre,
    date: "2025-10",
    trip: T("Raid enduro · Atlas y Sahara · 7 días", "Enduro raid · Atlas & Sahara · 7 days", "Raid enduro · Atlas & Sahara · 7 jours"),
    quote: T(
      "Las motos KTM en perfecto estado, mecánico de apoyo durante todo el raid y rutas escogidas por alguien que ha competido en el Dakar. Otro nivel.",
      "KTMs in pristine shape, support mechanic for the entire raid and routes picked by someone who's actually raced the Dakar. Another level.",
      "Des KTM en parfait état, mécanicien de soutien tout au long du raid et des itinéraires choisis par quelqu'un qui a couru le Dakar. Un autre niveau.",
    ),
  },

  /* ============ BESPOKE · FAMILY · LUXURY · WELLNESS ============ */
  {
    id: "carlos-bespoke",
    name: "Carlos Ferrer",
    themes: ["bespoke", "marruecos", "luxury", "general"],
    avatar: AVATAR.carlos,
    date: "2025-10",
    trip: T("Viaje a medida · 10 días", "Tailor-made · 10 days", "Sur mesure · 10 jours"),
    quote: T(
      "Pedí un viaje sin clichés y me lo entregaron a la perfección. Cambiamos el itinerario sobre la marcha dos veces — sin un solo problema. Atención impecable antes, durante y después.",
      "I asked for a no-cliché trip and they delivered it perfectly. Changed the itinerary on the fly twice — without a single issue. Impeccable care before, during and after.",
      "J'ai demandé un voyage hors clichés, livraison parfaite. Modifié l'itinéraire deux fois en cours de route — sans le moindre souci. Service impeccable.",
    ),
  },
  {
    id: "amelie-family",
    name: "Amélie & Thomas",
    themes: ["bespoke", "family", "marruecos", "general"],
    avatar: AVATAR.amelie,
    date: "2025-04",
    trip: T("Viaje en familia a medida · 9 días", "Family tailor-made · 9 days", "Famille sur mesure · 9 jours"),
    quote: T(
      "Viajar con dos niños pequeños por Marruecos parecía imposible. Xaluca lo hizo cómodo, divertido y absolutamente seguro. Habitaciones comunicadas, paradas en el momento justo, guía con paciencia infinita.",
      "Travelling Morocco with two small kids felt impossible. Xaluca made it comfortable, fun and completely safe. Connecting rooms, perfectly-timed stops, a guide with infinite patience.",
      "Voyager au Maroc avec deux jeunes enfants paraissait impossible. Xaluca l'a rendu confortable, amusant et totalement sûr. Chambres communicantes, pauses au bon moment, guide d'une patience infinie.",
    ),
  },
  {
    id: "noemi-laura",
    name: "Laura G.",
    themes: ["noemi", "fast-track-planning"],
    avatar: AVATAR.isabel,
    date: "2025-11",
    trip: T("Viaje a medida · Sur de Marruecos", "Tailor-made · Southern Morocco", "Sur mesure · Sud du Maroc"),
    quote: T(
      "Noemi entendió exactamente lo que buscábamos desde el primer mensaje. Nos propuso un itinerario hecho a nuestra medida, sin plantillas. Sentimos que el viaje era de verdad nuestro.",
      "Noemi understood exactly what we were looking for from the very first message. She proposed an itinerary tailored to us, with no templates. It truly felt like our own trip.",
      "Noemi a compris exactement ce que nous cherchions dès le premier message. Elle nous a proposé un itinéraire sur mesure, sans modèles. Nous avons senti que le voyage était vraiment le nôtre.",
    ),
  },
  {
    id: "noemi-david",
    name: "David M.",
    themes: ["noemi", "fast-track-planning"],
    avatar: AVATAR.david,
    date: "2025-10",
    trip: T("Marrakech y desierto · 6 días", "Marrakech & desert · 6 days", "Marrakech & désert · 6 jours"),
    quote: T(
      "Respondía a cada duda en cuestión de minutos, incluso los fines de semana. Esa rapidez y cercanía nos dieron una tranquilidad enorme al organizar el viaje.",
      "She answered every question within minutes, even on weekends. That speed and closeness gave us huge peace of mind while planning the trip.",
      "Elle répondait à chaque question en quelques minutes, même le week-end. Cette rapidité et cette proximité nous ont énormément rassurés lors de l'organisation.",
    ),
  },
  {
    id: "noemi-sophie",
    name: "Sophie L.",
    themes: ["noemi", "fast-track-planning"],
    avatar: AVATAR.sophie,
    date: "2025-09",
    trip: T("Ciudades imperiales · 5 días", "Imperial cities · 5 days", "Villes impériales · 5 jours"),
    quote: T(
      "Profesionalidad de principio a fin. Todo estaba previsto al detalle: traslados, hoteles, horarios… No tuvimos que preocuparnos absolutamente por nada.",
      "Professional from start to finish. Everything was planned to the detail: transfers, hotels, timings… We didn't have to worry about a single thing.",
      "Professionnalisme du début à la fin. Tout était prévu dans le détail : transferts, hôtels, horaires… Nous n'avons eu à nous soucier de rien.",
    ),
  },
  {
    id: "noemi-thomas",
    name: "Thomas B.",
    themes: ["noemi"],
    avatar: AVATAR.thomas,
    date: "2025-08",
    trip: T("Atlas y Sahara · 7 días", "Atlas & Sahara · 7 days", "Atlas & Sahara · 7 jours"),
    quote: T(
      "Se nota que Noemi conoce Marruecos de verdad. Sus recomendaciones —dónde parar, qué evitar, a qué hora llegar— marcaron la diferencia entre un buen viaje y uno inolvidable.",
      "You can tell Noemi truly knows Morocco. Her recommendations —where to stop, what to avoid, when to arrive— made the difference between a good trip and an unforgettable one.",
      "On sent que Noemi connaît vraiment le Maroc. Ses recommandations —où s'arrêter, quoi éviter, à quelle heure arriver— ont fait la différence entre un bon voyage et un voyage inoubliable.",
    ),
  },
  {
    id: "noemi-marta",
    name: "Marta R.",
    themes: ["noemi"],
    avatar: AVATAR.marta,
    date: "2025-07",
    trip: T("Escapada al desierto · 4 días", "Desert escape · 4 days", "Escapade au désert · 4 jours"),
    quote: T(
      "Más que una agente de viajes, fue como tener una amiga en Marruecos. Cercana, atenta y siempre pendiente de que estuviéramos bien en cada momento.",
      "More than a travel agent, she was like having a friend in Morocco. Warm, attentive and always making sure we were well at every moment.",
      "Plus qu'une agente de voyages, c'était comme avoir une amie au Maroc. Proche, attentive et toujours soucieuse de notre bien-être à chaque instant.",
    ),
  },
  {
    id: "noemi-ricardo",
    name: "Ricardo & Ana",
    themes: ["noemi"],
    avatar: AVATAR.ricardo,
    date: "2025-06",
    trip: T("Luna de miel · 8 días", "Honeymoon · 8 days", "Lune de miel · 8 jours"),
    quote: T(
      "Volveríamos a confiar en Noemi sin dudarlo. Nos acompañó desde el primer contacto hasta la vuelta a casa, con una dedicación y un cuidado excepcionales.",
      "We would trust Noemi again without hesitation. She accompanied us from the first contact to our return home, with exceptional dedication and care.",
      "Nous ferions de nouveau confiance à Noemi sans hésiter. Elle nous a accompagnés du premier contact jusqu'au retour à la maison, avec un dévouement et un soin exceptionnels.",
    ),
  },

  /* ---- Elena Xaluca · Asesora de viajes ---- */
  {
    id: "elena-carla", name: "Carla P.", themes: ["elena"], avatar: AVATAR.emma, date: "2025-11",
    trip: T("Viaje a medida · Marruecos", "Tailor-made · Morocco", "Sur mesure · Maroc"),
    quote: T(
      "Elena captó enseguida lo que queríamos y nos preparó un viaje totalmente a nuestra medida. Nada genérico, todo pensado para nosotros.",
      "Elena immediately grasped what we wanted and put together a trip entirely tailored to us. Nothing generic, everything thought out for us.",
      "Elena a tout de suite compris ce que nous voulions et nous a préparé un voyage entièrement sur mesure. Rien de générique, tout pensé pour nous.",
    ),
  },
  {
    id: "elena-marc", name: "Marc D.", themes: ["elena"], avatar: AVATAR.mathieu, date: "2025-10",
    trip: T("Escapada al desierto · 4 días", "Desert escape · 4 days", "Escapade au désert · 4 jours"),
    quote: T(
      "Cada mensaje tenía respuesta casi al momento. Nos sentimos acompañados en todo el proceso, sin una sola espera.",
      "Every message got an almost instant reply. We felt supported throughout the whole process, without a single wait.",
      "Chaque message recevait une réponse presque immédiate. Nous nous sommes sentis accompagnés tout au long, sans la moindre attente.",
    ),
  },
  {
    id: "elena-andrea", name: "Andrea S.", themes: ["elena"], avatar: AVATAR.nora, date: "2025-09",
    trip: T("Ciudades imperiales · 5 días", "Imperial cities · 5 days", "Villes impériales · 5 jours"),
    quote: T(
      "Organización impecable. Vuelos, hoteles y traslados encajaban a la perfección; se notaba una gran profesional detrás.",
      "Impeccable organisation. Flights, hotels and transfers fit together perfectly; you could tell there was a great professional behind it.",
      "Organisation impeccable. Vols, hôtels et transferts s'emboîtaient parfaitement ; on sentait une grande professionnelle derrière.",
    ),
  },
  {
    id: "elena-lucia", name: "Lucía F.", themes: ["elena"], avatar: AVATAR.claudia, date: "2025-08",
    trip: T("Atlas y Sahara · 7 días", "Atlas & Sahara · 7 days", "Atlas & Sahara · 7 jours"),
    quote: T(
      "Elena nos descubrió rincones de Marruecos que no aparecían en ninguna guía. Su conocimiento marcó la diferencia.",
      "Elena showed us corners of Morocco that weren't in any guidebook. Her knowledge made all the difference.",
      "Elena nous a fait découvrir des coins du Maroc absents de tout guide. Sa connaissance a fait toute la différence.",
    ),
  },
  {
    id: "elena-pauline", name: "Pauline R.", themes: ["elena"], avatar: AVATAR.laure, date: "2025-07",
    trip: T("Marrakech y desierto · 6 días", "Marrakech & desert · 6 days", "Marrakech & désert · 6 jours"),
    quote: T(
      "Amable, cercana y siempre con una sonrisa. Nos trató como a amigos desde el primer momento.",
      "Kind, close and always smiling. She treated us like friends from the very first moment.",
      "Aimable, proche et toujours souriante. Elle nous a traités comme des amis dès le premier instant.",
    ),
  },

  /* ---- Sanaa Xaluca · Asesora de viajes ---- */
  {
    id: "sanaa-javier", name: "Javier M.", themes: ["sanaa"], avatar: AVATAR.carlos, date: "2025-11",
    trip: T("Viaje a medida · Sur de Marruecos", "Tailor-made · Southern Morocco", "Sur mesure · Sud du Maroc"),
    quote: T(
      "Sanaa entiende Marruecos como nadie. Nos guió con recomendaciones locales que hicieron el viaje auténtico y especial.",
      "Sanaa understands Morocco like no one else. She guided us with local tips that made the trip authentic and special.",
      "Sanaa comprend le Maroc comme personne. Elle nous a guidés avec des conseils locaux qui ont rendu le voyage authentique et spécial.",
    ),
  },
  {
    id: "sanaa-sarah", name: "Sarah K.", themes: ["sanaa"], avatar: AVATAR.paula, date: "2025-10",
    trip: T("Ciudades imperiales · 5 días", "Imperial cities · 5 days", "Villes impériales · 5 jours"),
    quote: T(
      "Respondía a cualquier hora y resolvía todo al instante. Una tranquilidad enorme antes y durante el viaje.",
      "She replied at any hour and solved everything instantly. Huge peace of mind before and during the trip.",
      "Elle répondait à toute heure et réglait tout instantanément. Une grande tranquillité avant et pendant le voyage.",
    ),
  },
  {
    id: "sanaa-marta", name: "Marta L.", themes: ["sanaa"], avatar: AVATAR.laia, date: "2025-09",
    trip: T("Escapada al desierto · 4 días", "Desert escape · 4 days", "Escapade au désert · 4 jours"),
    quote: T(
      "Todo estuvo perfectamente coordinado sobre el terreno. Profesionalidad y calma en cada detalle.",
      "Everything was perfectly coordinated on the ground. Professionalism and calm in every detail.",
      "Tout était parfaitement coordonné sur le terrain. Professionnalisme et sérénité dans chaque détail.",
    ),
  },
  {
    id: "sanaa-thomas", name: "Thomas V.", themes: ["sanaa"], avatar: AVATAR.oliver, date: "2025-08",
    trip: T("Atlas y Sahara · 7 días", "Atlas & Sahara · 7 days", "Atlas & Sahara · 7 jours"),
    quote: T(
      "Nos escuchó de verdad y adaptó el itinerario a nuestro ritmo. Sentimos que el viaje era único.",
      "She truly listened and adapted the itinerary to our pace. We felt the trip was one of a kind.",
      "Elle nous a vraiment écoutés et a adapté l'itinéraire à notre rythme. Nous avons senti que le voyage était unique.",
    ),
  },
  {
    id: "sanaa-elena", name: "Elena G.", themes: ["sanaa"], avatar: AVATAR.ines, date: "2025-07",
    trip: T("Marrakech y desierto · 6 días", "Marrakech & desert · 6 days", "Marrakech & désert · 6 jours"),
    quote: T(
      "El trato de Sanaa fue cálido y humano. Su hospitalidad marroquí se nota desde el primer contacto.",
      "Sanaa's care was warm and human. Her Moroccan hospitality shows from the very first contact.",
      "L'accueil de Sanaa était chaleureux et humain. Son hospitalité marocaine se ressent dès le premier contact.",
    ),
  },
];

// Every review is assigned to a real, currently available programme.
// The canonical programme title and duration come from the same registry as
// the programme pages, so testimonials cannot drift into invented journeys.
const TESTIMONIAL_ROUTES = {
  "laia-bivouac": "tourAtlasDesierto67",
  "marta-haima": "tourEscapadaDesierto34",
  "ricardo-stars": "tourMarrakechLoop45",
  "ines-camel": "tourMarrakechErg45",
  "hugo-gnawa": "tourDesiertoAtlas56",
  "thomas-mgoun": "tourEnduroAventura67",
  "claudia-berber": "tourEscapadaAtlas34",
  "emma-todra": "tourAtlasDesierto56",
  "oliver-atlas-escape": "tourAtlasDesierto45",
  "sophie-fez": "tourCiudadesImperiales45",
  "isabel-riad": "tourCiudadesImperiales67",
  "julien-chef": "tourTangerFez56",
  "nora-marrakech": "tourMarrakechEss67",
  "mathieu-fez-escape": "tourEscapadaFez23",
  "paula-essaouira": "tourMarrakechEss45",
  "laure-tanger": "tourTangerFez45",
  "david-4x4": "tourFezRak89",
  "pierre-enduro": "tourEnduroAventura45",
  "carlos-bespoke": "tourMarrakechFez910",
  "amelie-family": "tourCiudadesImperialesRif78",
  "noemi-laura": "tourOzzSidialiFez78",
  "noemi-david": "tourMarrakechErg56",
  "noemi-sophie": "tourFezTanger67",
  "noemi-thomas": "tourFezSidialiRak89",
  "noemi-marta": "tourEscapadaFezSidiali34",
  "noemi-ricardo": "tourMarrakechSidialiFez89",
  "elena-carla": "tourTangerRak910",
  "elena-marc": "tourEscapadaRakAgafay34",
  "elena-andrea": "tourCiudadesImperialesRif67",
  "elena-lucia": "tourFezAtlasErr56",
  "elena-pauline": "tourMarrakechLoop34",
  "sanaa-javier": "tourFezSidialiOzz78",
  "sanaa-sarah": "tourFezTanger56",
  "sanaa-marta": "tourEscapadaFez34",
  "sanaa-thomas": "tourMarrakechFez78",
  "sanaa-elena": "tourMarrakechLoop56",
};

export const TESTIMONIALS = RAW_TESTIMONIALS.map((testimonial) => {
  const routeId = TESTIMONIAL_ROUTES[testimonial.id];
  return {
    ...testimonial,
    routeId,
    trip: testimonialProgramLabel(routeId, testimonial.trip),
  };
});

// Helper — return testimonials matching any of the given themes.
// By default pads with generals if there aren't enough; pass { pad: false }
// to return only exact theme matches (used for per-person review panels).
export const getTestimonialsForThemes = (themes = [], limit = 3, { pad = true } = {}) => {
  const set = new Set(themes);
  const matches = TESTIMONIALS.filter((t) => t.themes.some((th) => set.has(th)));
  if (!pad) return matches.slice(0, limit);
  const merged = matches.length >= limit
    ? matches
    : [
        ...matches,
        ...TESTIMONIALS.filter(
          (t) => !matches.includes(t) && t.themes.includes("general"),
        ),
      ];
  return merged.slice(0, limit);
};
