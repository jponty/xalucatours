import { supabaseMedia } from "@/lib/supabaseMedia";

/* Shared source of truth for every public team presentation. CMS overrides
   continue to live in the canonical `equipo.team.<member>.*` slots. */
export const TEAM_MEMBERS = [
  {
    id: "noemi",
    firstName: "Noemi",
    reviewTheme: "noemi",
    photo: supabaseMedia("xaluca/static/team/noemi-aparicio.png"),
    tilt: "-rotate-2",
    tapeRotate: "rotate-6",
    name: { es: "Noemi Aparicio", en: "Noemi Aparicio", fr: "Noemi Aparicio" },
    role: { es: "Directora", en: "Director", fr: "Directrice" },
    note1: {
      es: "Como directora de Xaluca Tours, Noemi Aparicio representa la cercanía, la experiencia y el cuidado que definen cada viaje. Su papel es acompañar al equipo y a los viajeros con una mirada atenta, asegurando que cada propuesta transmita la esencia del sur de Marruecos y la hospitalidad de Xaluca.",
      en: "As director of Xaluca Tours, Noemi Aparicio embodies the closeness, experience and care that define every journey. Her role is to guide the team and travellers with an attentive eye, making sure every proposal conveys the essence of southern Morocco and Xaluca's hospitality.",
      fr: "En tant que directrice de Xaluca Tours, Noemi Aparicio incarne la proximité, l'expérience et le soin qui définissent chaque voyage. Son rôle est d'accompagner l'équipe et les voyageurs avec un regard attentif, en veillant à ce que chaque proposition transmette l'essence du sud du Maroc et l'hospitalité de Xaluca.",
    },
    note2: {
      es: "Cada itinerario nace con la voluntad de escuchar, entender y crear experiencias hechas a medida, pensadas para que cada viajero se sienta acompañado desde el primer contacto hasta el regreso a casa.",
      en: "Every itinerary is born from a will to listen, understand and craft tailor-made experiences, designed so that each traveller feels accompanied from the very first contact until the return home.",
      fr: "Chaque itinéraire naît de la volonté d'écouter, de comprendre et de créer des expériences sur mesure, pensées pour que chaque voyageur se sente accompagné du premier contact jusqu'au retour à la maison.",
    },
  },
  {
    id: "elena",
    firstName: "Elena",
    reviewTheme: "elena",
    photo: supabaseMedia("xaluca/static/team/elena-xaluca.png"),
    tilt: "rotate-2",
    tapeRotate: "-rotate-6",
    name: { es: "Elena Xaluca", en: "Elena Xaluca", fr: "Elena Xaluca" },
    role: { es: "Asesora de viajes", en: "Travel advisor", fr: "Conseillère de voyages" },
    note1: {
      es: "Elena acompaña a cada viajero con paciencia y detalle, escuchando lo que buscan para transformarlo en un itinerario a su medida. Su cercanía y su energía hacen que planificar el viaje sea tan agradable como vivirlo.",
      en: "Elena guides each traveller with patience and attention to detail, listening to what they're looking for and turning it into a tailor-made itinerary. Her warmth and energy make planning the trip as enjoyable as living it.",
      fr: "Elena accompagne chaque voyageur avec patience et minutie, à l'écoute de ses envies pour les transformer en itinéraire sur mesure. Sa proximité et son énergie rendent la préparation du voyage aussi agréable que le voyage lui-même.",
    },
    note2: {
      es: "Le apasiona descubrir los rincones menos conocidos de Marruecos y compartirlos con quienes confían en ella para su próxima aventura.",
      en: "She loves discovering Morocco's lesser-known corners and sharing them with those who trust her for their next adventure.",
      fr: "Elle aime découvrir les coins les moins connus du Maroc et les partager avec ceux qui lui font confiance pour leur prochaine aventure.",
    },
  },
  {
    id: "sanaa",
    firstName: "Sanaa",
    reviewTheme: "sanaa",
    photo: supabaseMedia("xaluca/static/team/sanaa-xaluca.png"),
    tilt: "-rotate-3",
    tapeRotate: "rotate-3",
    name: { es: "Sanaa Xaluca", en: "Sanaa Xaluca", fr: "Sanaa Xaluca" },
    role: { es: "Asesora de viajes", en: "Travel advisor", fr: "Conseillère de voyages" },
    note1: {
      es: "Sanaa conoce Marruecos desde dentro y pone ese conocimiento al servicio de cada propuesta. Atenta, resolutiva y siempre disponible, cuida cada detalle para que el viaje fluya sin sorpresas.",
      en: "Sanaa knows Morocco from the inside and puts that knowledge at the service of every proposal. Attentive, resourceful and always available, she takes care of every detail so the trip flows without surprises.",
      fr: "Sanaa connaît le Maroc de l'intérieur et met ce savoir au service de chaque proposition. Attentive, efficace et toujours disponible, elle soigne chaque détail pour que le voyage se déroule sans surprises.",
    },
    note2: {
      es: "Su trato cálido y su dominio del destino convierten cada consulta en el primer paso de un viaje inolvidable.",
      en: "Her warm manner and command of the destination turn every enquiry into the first step of an unforgettable journey.",
      fr: "Son accueil chaleureux et sa maîtrise de la destination font de chaque demande le premier pas d'un voyage inoubliable.",
    },
  },
];

export default TEAM_MEMBERS;
