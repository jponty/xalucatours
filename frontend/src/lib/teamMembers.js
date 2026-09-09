import { supabaseMedia } from "@/lib/supabaseMedia";
import elenaPhoto from "@/assets/team/elena-xaluca.jpg";
import sanaaPhoto from "@/assets/team/sanaa-xaluca.jpg";
import magdaPhoto from "@/assets/team/magda-xaluca.jpg";

const ADVISOR_ROLE = {
  es: "Asesora de viajes · Especialista en Marruecos",
  en: "Travel advisor · Morocco specialist",
  fr: "Conseillère de voyages · Spécialiste du Maroc",
};

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
      es: "Como directora de Xaluca Tours, Noemi Aparicio representa la cercanía, la experiencia y el cuidado que definen cada viaje. Su papel es acompañar al equipo y a los viajeros con una mirada atenta, asegurando que cada propuesta transmita la esencia de Marruecos y la hospitalidad de Xaluca.",
      en: "As director of Xaluca Tours, Noemi Aparicio embodies the closeness, experience and care that define every journey. Her role is to guide the team and travellers with an attentive eye, making sure every proposal conveys the essence of Morocco and Xaluca's hospitality.",
      fr: "En tant que directrice de Xaluca Tours, Noemi Aparicio incarne la proximité, l'expérience et le soin qui définissent chaque voyage. Son rôle est d'accompagner l'équipe et les voyageurs avec un regard attentif, en veillant à ce que chaque proposition transmette l'essence du Maroc et l'hospitalité de Xaluca.",
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
    photo: elenaPhoto,
    tilt: "rotate-2",
    tapeRotate: "-rotate-6",
    name: { es: "Elena Xaluca", en: "Elena Xaluca", fr: "Elena Xaluca" },
    role: ADVISOR_ROLE,
    note1: {
      es: "Elena acompaña a cada viajero desde las primeras ideas hasta convertirlas en un viaje pensado a su medida. Escucha, aconseja y ayuda a encontrar el itinerario, los alojamientos y las experiencias que mejor encajan con la forma de viajar de cada persona.",
      en: "Elena supports every traveller from their first ideas through to a journey designed around them. She listens, advises and helps find the itinerary, accommodation and experiences that best suit each person's way of travelling.",
      fr: "Elena accompagne chaque voyageur dès ses premières idées pour les transformer en un voyage sur mesure. Elle écoute, conseille et aide à trouver l'itinéraire, les hébergements et les expériences qui correspondent le mieux à la façon de voyager de chacun.",
    },
    note2: {
      es: "Su conocimiento de Marruecos y su interés por descubrir lugares especiales le permiten aportar recomendaciones cercanas y prácticas, haciendo que preparar el viaje sea también parte de la experiencia.",
      en: "Her knowledge of Morocco and her curiosity for special places allow her to offer friendly, practical recommendations, making planning the trip part of the experience too.",
      fr: "Sa connaissance du Maroc et son envie de découvrir des lieux singuliers lui permettent de proposer des recommandations chaleureuses et pratiques, pour que la préparation du voyage fasse elle aussi partie de l'expérience.",
    },
  },
  {
    id: "sanaa",
    firstName: "Sanaa",
    reviewTheme: "sanaa",
    photo: sanaaPhoto,
    tilt: "-rotate-3",
    tapeRotate: "rotate-3",
    name: { es: "Sanaa Xaluca", en: "Sanaa Xaluca", fr: "Sanaa Xaluca" },
    role: ADVISOR_ROLE,
    note1: {
      es: "Sanaa conoce Marruecos desde dentro y transforma ese conocimiento del destino en recomendaciones útiles para cada viajero. Atenta, resolutiva y cercana, ayuda a diseñar cada recorrido teniendo en cuenta las distancias, los tiempos, los alojamientos y las experiencias que mejor encajan en cada viaje.",
      en: "Sanaa knows Morocco from the inside and turns that local knowledge into useful recommendations for every traveller. Attentive, resourceful and approachable, she helps design each itinerary with distances, timings, accommodation and the most suitable experiences in mind.",
      fr: "Sanaa connaît le Maroc de l'intérieur et transforme cette connaissance du pays en recommandations utiles pour chaque voyageur. Attentive, réactive et chaleureuse, elle aide à concevoir chaque parcours en tenant compte des distances, des horaires, des hébergements et des expériences les mieux adaptés à chaque voyage.",
    },
    note2: {
      es: "Su conocimiento del país y su trato cálido hacen que cada consulta encuentre una respuesta clara y que el viajero se sienta acompañado antes, durante y después de su aventura por Marruecos.",
      en: "Her knowledge of the country and warm manner ensure every enquiry receives a clear answer and every traveller feels supported before, during and after their Moroccan adventure.",
      fr: "Sa connaissance du pays et son accueil chaleureux permettent à chaque question de trouver une réponse claire et à chaque voyageur de se sentir accompagné avant, pendant et après son aventure au Maroc.",
    },
  },
  {
    id: "magda",
    firstName: "Magda",
    reviewTheme: "magda",
    photo: magdaPhoto,
    tilt: "rotate-2",
    tapeRotate: "-rotate-3",
    name: { es: "Magda Xaluca", en: "Magda Xaluca", fr: "Magda Xaluca" },
    role: ADVISOR_ROLE,
    note1: {
      es: "Magda ayuda a convertir cada idea de viaje en una propuesta clara, equilibrada y adaptada a cada viajero. Desde una primera escapada a Marruecos hasta un recorrido más completo por el país, acompaña en la elección de rutas, alojamientos y experiencias para que cada etapa tenga sentido dentro del viaje.",
      en: "Magda helps turn every travel idea into a clear, balanced proposal tailored to each traveller. From a first short break in Morocco to a more extensive journey across the country, she guides the choice of routes, accommodation and experiences so every stage fits naturally into the trip.",
      fr: "Magda aide à transformer chaque idée de voyage en une proposition claire, équilibrée et adaptée à chaque voyageur. D'une première escapade au Maroc à un parcours plus complet à travers le pays, elle accompagne le choix des itinéraires, des hébergements et des expériences pour que chaque étape trouve sa place dans le voyage.",
    },
    note2: {
      es: "Cercana y atenta a los pequeños detalles, su objetivo es que organizar Marruecos resulte fácil y que el viajero llegue al destino con la tranquilidad de saber que todo está preparado y que tiene al equipo de Xaluca a su lado.",
      en: "Approachable and attentive to the little details, her aim is to make planning Morocco easy and help travellers arrive with the peace of mind that everything is ready and the Xaluca team is by their side.",
      fr: "Chaleureuse et attentive aux petits détails, elle souhaite rendre l'organisation du séjour au Maroc simple, pour que chaque voyageur arrive sereinement, en sachant que tout est prêt et que l'équipe Xaluca est à ses côtés.",
    },
  },
];

export default TEAM_MEMBERS;
