import React, { useEffect, useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Home, ChevronRight, Compass, Sparkles, ArrowRight, ArrowUpRight,
  Hotel, Tent, Car, CalendarCheck, Globe2, Users, Heart, ShieldCheck,
  Phone, Mail, Clock, MapPin, Bus, Plane, PartyPopper, Package,
} from "lucide-react";
import { useLanguage, pick } from "@/contexts/LanguageContext";
import { pathFor } from "@/lib/routes";
import { CONTACT } from "@/lib/data";
import { IMG, banner } from "@/lib/imageBank";
import EditableImage from "@/components/EditableImage";
import HeroMonogram from "@/components/HeroMonogram";
import Testimonials from "@/components/Testimonials";
import { SlotScope } from "@/components/slotScope";
import { E, EImg } from "@/components/EditableSection";

const DOC_TITLES = {
  es: "Equipo · Conoce Xaluca Tours",
  en: "Team · Meet Xaluca Tours",
  fr: "Équipe · Découvrir Xaluca Tours",
};

const COPY = {
  breadcrumb: { es: "Inicio", en: "Home", fr: "Accueil" },
  cluster:    { es: "Sobre nosotros", en: "About us", fr: "À propos" },
  current:    { es: "Equipo", en: "Team", fr: "Équipe" },
  hero: {
    eyebrow: { es: "Conoce Xaluca Tours", en: "Meet Xaluca Tours", fr: "Découvrez Xaluca Tours" },
    place:   { es: "Europa · Marruecos", en: "Europe · Morocco", fr: "Europe · Maroc" },
    title: {
      es: "Más que organizar viajes — diseñamos formas distintas de descubrir Marruecos.",
      en: "More than organising trips — we design different ways to discover Morocco.",
      fr: "Plus que des voyages — nous concevons des manières différentes de découvrir le Maroc.",
    },
    subtitle: {
      es: "Un equipo multicultural entre Europa y Marruecos, con conocimiento local, experiencia en el destino y una pasión compartida por mostrar Marruecos desde una perspectiva cercana y exclusiva.",
      en: "A multicultural team between Europe and Morocco, with local knowledge, on-the-ground experience and a shared passion for showing Morocco from a close-up, exclusive perspective.",
      fr: "Une équipe multiculturelle entre l'Europe et le Maroc, riche d'une connaissance locale, d'une expérience sur le terrain et d'une passion commune pour faire découvrir le Maroc de manière proche et exclusive.",
    },
  },
  intro: {
    overline: { es: "Quiénes somos", en: "Who we are", fr: "Qui nous sommes" },
    title: {
      es: "Cada viaje, una experiencia diseñada para revelar la esencia de Marruecos.",
      en: "Every trip is an experience designed to reveal the essence of Morocco.",
      fr: "Chaque voyage est une expérience conçue pour révéler l'essence du Maroc.",
    },
    p1: {
      es: "Xaluca Tours es una agencia especializada en viajes por Marruecos, creada para ofrecer experiencias auténticas, personalizadas y cuidadosamente diseñadas para descubrir la esencia del país. Nuestro equipo combina conocimiento local, experiencia en el destino y una pasión compartida por mostrar Marruecos desde una perspectiva cercana, exclusiva y diferente.",
      en: "Xaluca Tours is an agency specialised in journeys across Morocco, created to deliver authentic, personalised and carefully designed experiences. Our team combines local knowledge, on-the-ground expertise and a shared passion for showing Morocco from a close, exclusive and distinctive angle.",
      fr: "Xaluca Tours est une agence spécialisée dans les voyages au Maroc, créée pour offrir des expériences authentiques, personnalisées et soigneusement conçues. Notre équipe allie connaissance locale, expérience sur le terrain et une passion commune pour faire découvrir le Maroc sous un angle proche, exclusif et différent.",
    },
    p2: {
      es: "Operamos desde Europa y desde Marruecos, conectando ambos lados a través de un equipo multicultural que trabaja cada día para crear viajes únicos, auténticos y memorables. Más que organizar viajes, creemos en crear experiencias que permitan descubrir Marruecos de una forma profunda, humana y transformadora.",
      en: "We operate from both Europe and Morocco, connecting both sides through a multicultural team that works every day to craft unique, authentic and memorable journeys. More than organising trips, we believe in creating experiences that reveal Morocco in a deep, human and transformative way.",
      fr: "Nous opérons depuis l'Europe et depuis le Maroc, en reliant les deux rives grâce à une équipe multiculturelle qui œuvre chaque jour à façonner des voyages uniques, authentiques et mémorables. Plus que des voyages, nous croyons à des expériences qui révèlent le Maroc de manière profonde, humaine et transformatrice.",
    },
  },
  group: {
    overline: { es: "Formamos parte de Grup Xaluca", en: "Part of Grup Xaluca", fr: "Membre du Grup Xaluca" },
    title: {
      es: "Un grupo hotelero líder en el sur de Marruecos — y nuestra ventaja operativa.",
      en: "A leading hotel group in southern Morocco — and our operational edge.",
      fr: "Un groupe hôtelier leader dans le sud du Maroc — et notre force opérationnelle.",
    },
    body: {
      es: "Esta integración nos permite ofrecer una experiencia completa, coordinada y de alta calidad en cada viaje. Diseñamos rutas a medida, experiencias privadas, viajes de incentivo, eventos corporativos y grandes producciones con un control total sobre la operativa y la calidad del servicio.",
      en: "This integration lets us deliver a complete, coordinated and high-quality experience on every trip. We design bespoke routes, private experiences, incentive trips, corporate events and large-scale productions with full control over operations and service quality.",
      fr: "Cette intégration nous permet d'offrir une expérience complète, coordonnée et de haute qualité à chaque voyage. Nous concevons des itinéraires sur mesure, des expériences privées, des voyages incentives, des événements d'entreprise et de grandes productions avec un contrôle total de l'opérationnel et de la qualité.",
    },
    pillars: [
      { id: "hotels",    icon: "Hotel",         image: IMG.riadFountain,  title: { es: "Hoteles y alojamientos propios", en: "Owned hotels & lodges",     fr: "Hôtels et hébergements propres" },
        body: { es: "Localizaciones en los destinos más emblemáticos: Erfoud, Merzouga, Ouarzazate y Marrakech.",
                en: "Locations in the most iconic destinations: Erfoud, Merzouga, Ouarzazate and Marrakech.",
                fr: "Implantations dans les destinations les plus emblématiques : Erfoud, Merzouga, Ouarzazate et Marrakech." } },
      { id: "camps",     icon: "Tent",          image: IMG.dunes,         title: { es: "Campamentos en el desierto",     en: "Desert bivouac camps",      fr: "Campements dans le désert" },
        body: { es: "Bivouacs propios en Erg Chebbi, desde experiencias premium hasta opciones de aventura.",
                en: "Our own bivouacs in Erg Chebbi, from premium experiences to adventure setups.",
                fr: "Nos propres bivouacs à l'Erg Chebbi, des expériences premium aux options aventure." } },
      { id: "transport", icon: "Car",           image: IMG.kasbahArch,    title: { es: "Transporte y logística",         en: "Transport & logistics",     fr: "Transport et logistique" },
        body: { es: "Flota 4x4, minibuses y conductores locales formados por el grupo, disponibles todo el año.",
                en: "4x4 fleet, minibuses and local drivers trained by the group, available year-round.",
                fr: "Flotte 4x4, minibus et chauffeurs locaux formés par le groupe, disponibles toute l'année." } },
      { id: "events",    icon: "CalendarCheck", image: IMG.medinaPeople,  title: { es: "División de eventos",            en: "Events division",           fr: "Division événementielle" },
        body: { es: "Equipo especializado en eventos nacionales e internacionales: convenciones, incentivos, festivales.",
                en: "Team specialised in national and international events: conventions, incentives, festivals.",
                fr: "Équipe spécialisée dans les événements nationaux et internationaux : conventions, incentives, festivals." } },
    ],
  },
  ecosystem: {
    overline: { es: "El ecosistema Xaluca", en: "The Xaluca ecosystem", fr: "L'écosystème Xaluca" },
    title: {
      es: "Todo bajo un mismo grupo. Una experiencia sin intermediarios.",
      en: "Everything under one group. An experience with no middlemen.",
      fr: "Tout au sein d'un même groupe. Une expérience sans intermédiaires.",
    },
    intro: {
      es: "Desde el primer contacto hasta el último día del viaje, Grup Xaluca opera directamente cada parte esencial de la experiencia. Esto nos permite ofrecer un mayor control de la calidad, una coordinación impecable y un conocimiento único del destino.",
      en: "From the first contact to the last day of the trip, Grup Xaluca directly operates every essential part of the experience. This gives us greater quality control, impeccable coordination and a unique knowledge of the destination.",
      fr: "Du premier contact au dernier jour du voyage, Grup Xaluca opère directement chaque partie essentielle de l'expérience. Cela nous permet un meilleur contrôle de la qualité, une coordination impeccable et une connaissance unique de la destination.",
    },
    areasTitle: { es: "Nuestras áreas de especialización", en: "Our areas of specialisation", fr: "Nos domaines de spécialisation" },
    areas: [
      { id: "hotels", icon: "Hotel",
        title: { es: "Hoteles y alojamientos", en: "Hotels & accommodation", fr: "Hôtels et hébergements" },
        body: { es: "Una colección de hoteles, riads y alojamientos con identidad propia repartidos por el sur de Marruecos.",
                en: "A collection of hotels, riads and accommodations with their own identity across southern Morocco.",
                fr: "Une collection d'hôtels, riads et hébergements à l'identité propre à travers le sud du Maroc." } },
      { id: "camps", icon: "Tent",
        title: { es: "Campamentos en el desierto", en: "Desert camps", fr: "Campements dans le désert" },
        body: { es: "Campamentos exclusivos en Erg Chebbi, diseñados para vivir el Sáhara con comodidad y autenticidad.",
                en: "Exclusive camps in Erg Chebbi, designed to experience the Sahara with comfort and authenticity.",
                fr: "Des campements exclusifs à l'Erg Chebbi, conçus pour vivre le Sahara avec confort et authenticité." } },
      { id: "transport", icon: "Bus",
        title: { es: "Transporte propio", en: "Own transport fleet", fr: "Transport en propre" },
        body: { es: "Una flota propia de vehículos 4x4, minibuses, autocares y vehículos privados para garantizar la máxima flexibilidad y seguridad.",
                en: "Our own fleet of 4x4 vehicles, minibuses, coaches and private cars to ensure maximum flexibility and safety.",
                fr: "Une flotte propre de véhicules 4x4, minibus, autocars et voitures privées pour garantir un maximum de flexibilité et de sécurité." } },
      { id: "agency-es", icon: "Plane",
        title: { es: "Agencia de viajes en España", en: "Travel agency in Spain", fr: "Agence de voyages en Espagne" },
        body: { es: "Asesoramiento personalizado, atención comercial y diseño de viajes para viajeros y grupos desde España.",
                en: "Personalised advice, sales support and trip design for travellers and groups from Spain.",
                fr: "Conseil personnalisé, service commercial et conception de voyages pour voyageurs et groupes depuis l'Espagne." } },
      { id: "agency-ma", icon: "MapPin",
        title: { es: "Agencia de viajes en Marruecos", en: "Travel agency in Morocco", fr: "Agence de voyages au Maroc" },
        body: { es: "Operación local, coordinación de rutas, reservas y asistencia permanente durante todo el viaje.",
                en: "Local operation, route coordination, bookings and permanent assistance throughout the entire trip.",
                fr: "Opération locale, coordination des itinéraires, réservations et assistance permanente pendant tout le voyage." } },
      { id: "events", icon: "PartyPopper",
        title: { es: "Eventos & Incentivos", en: "Events & Incentives", fr: "Événements & Incentives" },
        body: { es: "Diseño y producción integral de congresos, viajes de incentivo, eventos corporativos y experiencias a medida para empresas.",
                en: "End-to-end design and production of conventions, incentive trips, corporate events and tailor-made experiences for companies.",
                fr: "Conception et production intégrales de congrès, voyages incentives, événements corporatifs et expériences sur mesure pour les entreprises." } },
      { id: "logistics", icon: "Package",
        title: { es: "Logística y operaciones", en: "Logistics & operations", fr: "Logistique et opérations" },
        body: { es: "Un equipo propio especializado en coordinación, producción, montaje y gestión logística para garantizar que cada viaje y evento funcione a la perfección.",
                en: "A dedicated team specialised in coordination, production, setup and logistics management to ensure every trip and event runs flawlessly.",
                fr: "Une équipe dédiée spécialisée dans la coordination, la production, le montage et la gestion logistique pour que chaque voyage et événement se déroule parfaitement." } },
    ],
    callout: {
      es: "Una sola filosofía. Siete áreas de especialización. Un mismo compromiso con la excelencia.",
      en: "One single philosophy. Seven areas of specialisation. One shared commitment to excellence.",
      fr: "Une seule philosophie. Sept domaines de spécialisation. Un même engagement envers l'excellence.",
    },
    calloutSub: {
      es: "Más que una agencia de viajes: un grupo turístico con infraestructura propia en Marruecos.",
      en: "More than a travel agency: a tourism group with its own infrastructure in Morocco.",
      fr: "Plus qu'une agence de voyages : un groupe touristique doté de sa propre infrastructure au Maroc.",
    },
  },
  stats: {
    overline: { es: "El grupo en cifras", en: "The group in numbers", fr: "Le groupe en chiffres" },
    items: [
      { id: "years",   value: "25+",  label: { es: "Años en Marruecos",         en: "Years in Morocco",          fr: "Années au Maroc" } },
      { id: "hotels",  value: "10+",  label: { es: "Hoteles y campamentos",     en: "Hotels & camps",            fr: "Hôtels et campements" } },
      { id: "events",  value: "120+", label: { es: "Eventos corporativos/año",  en: "Corporate events/year",     fr: "Événements corporate/an" } },
      { id: "team",    value: "180+", label: { es: "Profesionales en el grupo", en: "Group professionals",       fr: "Professionnels du groupe" } },
    ],
  },
  bridge: {
    overline: { es: "Dos orillas, un mismo equipo", en: "Two shores, one team", fr: "Deux rives, une seule équipe" },
    title: {
      es: "Operamos entre Europa y Marruecos — para que nada se pierda en el camino.",
      en: "We operate between Europe and Morocco — so nothing is lost in translation.",
      fr: "Nous opérons entre l'Europe et le Maroc — pour que rien ne se perde en chemin.",
    },
    columns: [
      { id: "europe",  icon: "Globe2",   flag: "🇪🇺",
        title: { es: "Europa · Sede en Barcelona", en: "Europe · Headquartered in Barcelona", fr: "Europe · Siège à Barcelone" },
        body:  { es: "Oficina comercial y agentes de viaje multilingües (ES · EN · FR · DE · IT) que atienden a viajeros de toda Europa. Diseñan tu propuesta, gestionan reservas y te acompañan antes, durante y después del viaje.",
                 en: "Sales office and multilingual travel agents (ES · EN · FR · DE · IT) serving travellers across Europe. They design your proposal, handle bookings and stay with you before, during and after the trip.",
                 fr: "Bureau commercial et conseillers multilingues (ES · EN · FR · DE · IT) au service des voyageurs européens. Ils conçoivent votre proposition, gèrent les réservations et vous accompagnent avant, pendant et après le voyage." } },
      { id: "morocco", icon: "Compass",  flag: "🇲🇦",
        title: { es: "Marruecos · Erfoud · Merzouga · Marrakech", en: "Morocco · Erfoud · Merzouga · Marrakech", fr: "Maroc · Erfoud · Merzouga · Marrakech" },
        body:  { es: "Equipo operativo local: guías, conductores, jefes de hotel y coordinadores de eventos. La parte que hace que todo suceda en destino, con presencia permanente sobre el terreno.",
                 en: "Local operations team: guides, drivers, hotel managers and event coordinators. The crew that makes everything happen on the ground, with permanent presence in destination.",
                 fr: "Équipe opérationnelle locale : guides, chauffeurs, responsables d'hôtel et coordinateurs d'événements. Ceux qui font que tout se passe sur le terrain, avec une présence permanente." } },
    ],
  },
  values: {
    overline: { es: "Cómo trabajamos", en: "How we work", fr: "Comment nous travaillons" },
    title: {
      es: "Cuatro principios que guían cada itinerario.",
      en: "Four principles that guide every itinerary.",
      fr: "Quatre principes qui guident chaque itinéraire.",
    },
    items: [
      { id: "local",     icon: "Users",       title: { es: "Conocimiento local",         en: "Local knowledge",            fr: "Connaissance locale" },
        body: { es: "Nuestro equipo en Marruecos no es una red externa: son personas del país que viven aquí.",
                en: "Our Morocco team is not a third-party network — they're locals who live here.",
                fr: "Notre équipe au Maroc n'est pas un réseau externe : ce sont des locaux qui vivent ici." } },
      { id: "authentic", icon: "Heart",       title: { es: "Experiencias auténticas",    en: "Authentic experiences",      fr: "Expériences authentiques" },
        body: { es: "Buscamos lugares y momentos que no encontrarás en una guía estándar — la cara real del país.",
                en: "We seek places and moments you won't find in a standard guide — the country's real face.",
                fr: "Nous cherchons des lieux et instants absents des guides standard — le vrai visage du pays." } },
      { id: "control",   icon: "ShieldCheck", title: { es: "Control 360º",               en: "360° control",               fr: "Contrôle à 360°" },
        body: { es: "Infraestructura propia: hoteles, transporte y eventos bajo el mismo grupo. Cero intermediarios.",
                en: "Owned infrastructure: hotels, transport and events under the same group. Zero middlemen.",
                fr: "Infrastructure propre : hôtels, transport et événements sous le même groupe. Zéro intermédiaire." } },
      { id: "human",     icon: "Sparkles",    title: { es: "Mirada humana",              en: "A human perspective",        fr: "Un regard humain" },
        body: { es: "Cada itinerario lo construye una persona pensando en otra. Sin algoritmos, sin plantillas.",
                en: "Every itinerary is built by one person thinking about another. No algorithms, no templates.",
                fr: "Chaque itinéraire est conçu par une personne pour une autre. Pas d'algorithmes, pas de modèles." } },
    ],
  },
  cta: {
    eyebrow: { es: "Hablemos de tu viaje", en: "Let's talk about your trip", fr: "Parlons de votre voyage" },
    title: {
      es: "Detrás de cada propuesta, un equipo que ya conoce el camino.",
      en: "Behind every proposal, a team that already knows the way.",
      fr: "Derrière chaque proposition, une équipe qui connaît déjà le chemin.",
    },
    body: {
      es: "Estamos a tu disposición las 24 horas. Diseñamos tu próximo viaje a Marruecos a partir de una conversación.",
      en: "We're available 24 hours a day. We design your next Morocco trip starting from a conversation.",
      fr: "Nous sommes disponibles 24 h/24. Nous concevons votre prochain voyage au Maroc à partir d'une conversation.",
    },
    phoneLabel: { es: "Teléfono",      en: "Phone",        fr: "Téléphone" },
    emailLabel: { es: "Email",         en: "Email",        fr: "Email" },
    hoursLabel: { es: "Horario de oficina", en: "Office hours", fr: "Heures de bureau" },
    hours: {
      es: "Lunes a viernes · 10 h – 20 h",
      en: "Monday to Friday · 10 am – 8 pm",
      fr: "Lundi au vendredi · 10 h – 20 h",
    },
    planCta:    { es: "Planifica tu viaje", en: "Plan my journey", fr: "Planifier mon voyage" },
    contactCta: { es: "Escríbenos",         en: "Write to us",     fr: "Nous écrire" },
  },
  team: {
    overline: { es: "Nuestro equipo", en: "Our team", fr: "Notre équipe" },
    title: {
      es: "Las personas que hacen posible cada viaje.",
      en: "The people who make every journey possible.",
      fr: "Les personnes qui rendent chaque voyage possible.",
    },
    hint: { es: "Toca un perfil para ver sus reseñas", en: "Tap a profile to see their reviews", fr: "Touchez un profil pour voir ses avis" },
  },
  reviews: {
    eyebrow: { es: "Opiniones sobre Noemi", en: "Reviews about Noemi", fr: "Avis sur Noemi" },
    title: {
      es: "Lo que dicen los viajeros de Noemi.",
      en: "What travellers say about Noemi.",
      fr: "Ce que les voyageurs disent de Noemi.",
    },
    subtitle: {
      es: "Atención personalizada, respuestas rápidas y un conocimiento profundo de Marruecos — así viven nuestros viajeros el trato de nuestro equipo.",
      en: "Personalised attention, fast replies and a deep knowledge of Morocco — this is how our travellers experience our team's care.",
      fr: "Attention personnalisée, réponses rapides et une connaissance profonde du Maroc — voilà comment nos voyageurs vivent l'accompagnement de notre équipe.",
    },
  },
};

const TEAM = [
  {
    id: "noemi",
    firstName: "Noemi",
    reviewTheme: "noemi",
    photo:
      "https://customer-assets.emergentagent.com/job_0632360a-eb69-4f78-ae22-95f777acd98d/artifacts/q6kz7ybg_Noemi%20Aparicio.png",
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
    photo:
      "https://images.unsplash.com/photo-1636153279424-cb5d1e00f5a2?crop=entropy&cs=srgb&fm=jpg&q=85&w=800",
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
    photo:
      "https://images.unsplash.com/photo-1619520166328-6eccd4fb8e71?crop=entropy&cs=srgb&fm=jpg&q=85&w=800",
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

const ICON_MAP = {
  Hotel, Tent, Car, CalendarCheck, Globe2, Compass, Users, Heart, ShieldCheck, Sparkles,
  Bus, Plane, PartyPopper, Package, MapPin,
};

/* ============================================================
   Sub-components
============================================================ */
const InlineBreadcrumb = ({ lang }) => (
  <nav
    aria-label="Breadcrumb"
    data-testid="eq-breadcrumbs"
    className="inline-flex items-center gap-2 bg-[#1A1513]/55 backdrop-blur-md border border-white/10 px-3.5 py-1.5 text-[10px] md:text-[11px] tracking-[0.22em] uppercase text-[#FDFBF7]/90"
  >
    <Link to={pathFor(lang, "home")} data-testid="eq-bc-home" className="flex items-center gap-1.5 hover:text-[#D4A373] transition-colors">
      <Home className="w-3 h-3 md:w-3.5 md:h-3.5" strokeWidth={1.6} />
      <E name="bc.home" defaults={COPY.breadcrumb} multiline={false} />
    </Link>
    <ChevronRight className="w-3 h-3 text-[#FDFBF7]/40" strokeWidth={1.6} />
    <E name="bc.cluster" defaults={COPY.cluster} multiline={false} />
    <ChevronRight className="w-3 h-3 text-[#FDFBF7]/40" strokeWidth={1.6} />
    <E name="bc.current" defaults={COPY.current} multiline={false} className="text-[#D4A373]" />
  </nav>
);

const Hero = ({ lang }) => (
  <section data-testid="eq-hero" className="relative min-h-[100svh] w-full overflow-hidden bg-[#1A1513]">
    <EditableImage
      slot="equipo.hero"
      fallback={banner("camelCaravan", 2400)}
      alt=""
      priority
      aspectRatio="auto"
      imgProps={{ loading: "eager" }}
      className="ken-burns absolute inset-0 w-full h-full object-cover"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-[#1A1513]/95 via-[#1A1513]/55 to-[#1A1513]/30 pointer-events-none" />
    <div className="absolute inset-0 berber-bg-cross opacity-35 pointer-events-none" aria-hidden="true" />
    <span className="film-grain pointer-events-none" />
    <HeroMonogram />

    <div className="relative z-10 min-h-[100svh] flex flex-col">
      <div className="pt-[88px] md:pt-[96px] px-6 md:px-12 max-w-7xl mx-auto w-full">
        <InlineBreadcrumb lang={lang} />
      </div>
      <div className="flex-1 flex items-end pt-32 md:pt-44 pb-24 md:pb-32">
        <div className="max-w-7xl mx-auto px-6 md:px-12 w-full">
          <div className="max-w-3xl">
            <div className="fade-up inline-flex items-center gap-3 text-[#D4A373]">
              <Compass className="w-3.5 h-3.5" strokeWidth={1.6} />
              <E name="hero.eyebrow" defaults={COPY.hero.eyebrow} multiline={false} className="text-[11px] tracking-[0.35em] uppercase font-semibold" />
              <span className="w-8 h-px bg-[#D4A373]/50" />
              <E name="hero.place" defaults={COPY.hero.place} multiline={false} className="text-[10px] tracking-[0.3em] uppercase text-[#D4A373]/80" />
            </div>
            <E name="hero.title" defaults={COPY.hero.title} multiline={false} as="h1"
               className="fade-up fade-up-delay-1 font-serif-x text-[#FDFBF7] text-5xl md:text-6xl lg:text-7xl leading-[1.02] tracking-tight mt-6" />
            <E name="hero.subtitle" defaults={COPY.hero.subtitle} as="p"
               className="fade-up fade-up-delay-2 mt-8 max-w-2xl text-base md:text-lg text-[#FDFBF7]/85 leading-relaxed" />
          </div>
        </div>
      </div>
    </div>
  </section>
);

const TeamScroller = ({ lang, selectedId, onSelect }) => {
  const scrollerRef = useRef(null);
  const rafRef = useRef(null);
  const selected = TEAM.find((m) => m.id === selectedId) || TEAM[0];

  // Scroll-driven selection: pick the card whose centre is nearest the viewport centre.
  const handleScroll = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const el = scrollerRef.current;
      if (!el || el.scrollWidth <= el.clientWidth + 4) return; // no overflow → click only
      const center = el.scrollLeft + el.clientWidth / 2;
      let bestId = null;
      let bestDist = Infinity;
      el.querySelectorAll("[data-team-card]").forEach((node) => {
        const c = node.offsetLeft + node.offsetWidth / 2;
        const d = Math.abs(c - center);
        if (d < bestDist) { bestDist = d; bestId = node.getAttribute("data-team-card"); }
      });
      if (bestId && bestId !== selectedId) onSelect(bestId);
    });
  }, [selectedId, onSelect]);

  const selectCard = (id, node) => {
    onSelect(id);
    node?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  };

  return (
    <SlotScope id="team">
      <div data-testid="eq-team" className="mt-16 md:mt-24 pt-14 md:pt-16 border-t border-[#2C2621]/10">
        <div className="max-w-2xl">
          <span className="overline inline-flex items-center gap-2 text-[#C16542]">
            <Users className="w-3.5 h-3.5" strokeWidth={1.6} />
            <E name="overline" defaults={COPY.team.overline} multiline={false} />
          </span>
          <E name="title" defaults={COPY.team.title} multiline={false} as="h3"
             className="font-serif-x text-3xl md:text-4xl leading-[1.08] tracking-tight mt-4 text-[#2C2621]" />
        </div>

        {/* Selectable polaroid carousel */}
        <div
          ref={scrollerRef}
          onScroll={handleScroll}
          data-testid="eq-team-scroller"
          className="mt-10 flex gap-6 md:gap-9 overflow-x-auto snap-x snap-mandatory pb-6 -mx-6 px-6 md:mx-0 md:px-1 lg:justify-center scrollbar-thin"
        >
          {TEAM.map((m) => {
            const active = selectedId === m.id;
            return (
              <SlotScope key={m.id} id={m.id}>
                <div
                  data-team-card={m.id}
                  data-testid={`eq-team-card-${m.id}`}
                  role="button"
                  tabIndex={0}
                  aria-pressed={active}
                  aria-label={`${m.name.es} — ${pick(m.role, lang)}`}
                  onClick={(e) => selectCard(m.id, e.currentTarget)}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); selectCard(m.id, e.currentTarget); } }}
                  className={`snap-center shrink-0 cursor-pointer outline-none transition-opacity duration-500 ${active ? "opacity-100" : "opacity-55 hover:opacity-90"}`}
                >
                  <figure
                    className={`relative w-[200px] sm:w-[224px] bg-[#FDFBF7] p-3 pb-2 transition-all duration-500 ease-out will-change-transform ${
                      active
                        ? "rotate-0 scale-[1.05] shadow-[0_46px_84px_-30px_rgba(26,21,19,0.68)] ring-1 ring-[#C16542]"
                        : `${m.tilt} shadow-[0_30px_60px_-30px_rgba(26,21,19,0.5)]`
                    }`}
                  >
                    <span className={`postcard-tape absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-6 ${m.tapeRotate}`} aria-hidden="true" />
                    <div className="relative overflow-hidden bg-[#EDE4D6]">
                      <EImg
                        name="photo"
                        src={m.photo}
                        alt={`${m.name.es} · ${pick(m.role, lang)}`}
                        aspectRatio="4/5"
                        imgProps={{ loading: "lazy" }}
                        className="w-full h-full object-cover grayscale"
                      />
                    </div>
                    <figcaption className="pt-3.5 pb-2.5 text-center">
                      <E name="name" defaults={m.name} multiline={false} noTranslate as="p"
                         className="font-hand text-[26px] leading-none text-[#2C2621]" />
                      <E name="role" defaults={m.role} multiline={false} as="p"
                         className={`font-hand text-lg mt-1 ${active ? "text-[#C16542]" : "text-[#A07042]"}`} />
                    </figcaption>
                  </figure>
                </div>
              </SlotScope>
            );
          })}
        </div>
        <p className="mt-1 flex items-center justify-center gap-2 text-[10px] tracking-[0.28em] uppercase text-[#8A7C64]">
          <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.6} />
          <E name="hint" defaults={COPY.team.hint} multiline={false} />
        </p>

        {/* Selected member's handwritten note — matches the Founders section style */}
        <div key={selected.id} className="fade-up mt-10 md:mt-12 max-w-2xl mx-auto">
          <SlotScope id={selected.id}>
            <div
              data-testid={`eq-team-note-${selected.id}`}
              className="postcard-paper relative border border-[#2C2621]/10 shadow-[0_34px_66px_-38px_rgba(26,21,19,0.5)] px-7 py-9 md:px-11 md:py-12 rotate-[0.5deg]"
            >
              <span className="absolute left-4 md:left-6 top-6 bottom-6 w-px bg-[#C16542]/25" aria-hidden="true" />
              <div className="pl-4 md:pl-6">
                <E name="note_name" defaults={selected.name} multiline={false} noTranslate as="p"
                   className="font-hand text-4xl md:text-[42px] leading-none text-[#C16542]" />
                <span className="block w-16 h-px bg-[#2C2621]/20 my-5" aria-hidden="true" />
                <E name="note1" defaults={selected.note1} as="p"
                   className="font-hand text-[23px] md:text-[26px] leading-[1.55] text-[#3A322B]" />
                <E name="note2" defaults={selected.note2} as="p"
                   className="font-hand text-[23px] md:text-[26px] leading-[1.55] text-[#3A322B] mt-5" />
                <div className="mt-8 text-right">
                  <E name="signature" defaults={selected.name} multiline={false} noTranslate as="p"
                     className="font-hand text-[32px] leading-none text-[#2C2621]" />
                  <E name="sign_role" defaults={selected.role} multiline={false} as="p"
                     className="mt-2 text-[10px] tracking-[0.28em] uppercase text-[#8A7C64]" />
                </div>
              </div>
            </div>
          </SlotScope>
        </div>
      </div>
    </SlotScope>
  );
};

const Intro = ({ lang, selectedId, onSelect }) => (
  <section data-testid="eq-intro" className="relative bg-[#FDFBF7] py-24 md:py-32">
    <div className="max-w-7xl mx-auto px-6 md:px-12">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 items-start">
        <div className="md:col-span-5">
          <span className="overline inline-flex items-center gap-2 text-[#C16542]">
            <Sparkles className="w-3.5 h-3.5" strokeWidth={1.6} />
            <E name="intro.overline" defaults={COPY.intro.overline} multiline={false} />
          </span>
          <E name="intro.title" defaults={COPY.intro.title} multiline={false} as="h2"
             className="font-serif-x text-4xl md:text-5xl lg:text-[52px] leading-[1.06] tracking-tight mt-5 text-[#2C2621]" />
        </div>
        <div className="md:col-span-7 md:pt-2 space-y-5">
          <E name="intro.p1" defaults={COPY.intro.p1} as="p" className="text-base md:text-lg text-[#5C5248] leading-relaxed" />
          <E name="intro.p2" defaults={COPY.intro.p2} as="p" className="text-base md:text-lg text-[#5C5248] leading-relaxed" />
        </div>
      </div>

      <TeamScroller lang={lang} selectedId={selectedId} onSelect={onSelect} />
    </div>
  </section>
);

const GroupPillars = ({ lang }) => (
  <SlotScope id="group">
    <section data-testid="eq-group" className="relative bg-[#F2EBE1] py-20 md:py-28 border-t border-[#2C2621]/10 overflow-hidden">
      <div className="absolute inset-0 berber-bg-diamond opacity-40 pointer-events-none" aria-hidden="true" />
      <div className="relative max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end mb-12 md:mb-16">
          <div className="md:col-span-7">
            <span className="overline inline-flex items-center gap-2 text-[#C16542]">
              <Hotel className="w-3.5 h-3.5" strokeWidth={1.6} />
              <E name="overline" defaults={COPY.group.overline} multiline={false} />
            </span>
            <E name="title" defaults={COPY.group.title} multiline={false} as="h2"
               className="font-serif-x text-4xl md:text-5xl lg:text-[52px] leading-[1.05] tracking-tight mt-4 text-[#2C2621]" />
          </div>
          <div className="md:col-span-5">
            <E name="body" defaults={COPY.group.body} as="p" className="text-base md:text-lg text-[#5C5248] leading-relaxed" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-[#2C2621]/10 border border-[#2C2621]/10">
          {COPY.group.pillars.map((p) => {
            const Icon = ICON_MAP[p.icon] || Hotel;
            return (
              <SlotScope key={p.id} id={p.id}>
                <article
                  data-testid={`eq-group-${p.id}`}
                  className="group relative bg-[#FDFBF7] flex flex-col"
                >
                  <div className="relative aspect-[5/3] overflow-hidden bg-[#1A1513]">
                    <EditableImage
                      name="image"
                      fallback={p.image}
                      alt={pick(p.title, lang)}
                      aspectRatio="5/3"
                      imgProps={{ loading: "lazy" }}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.05]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1A1513]/45 to-transparent pointer-events-none" />
                    <span className="absolute bottom-3 left-3 inline-flex items-center justify-center w-11 h-11 bg-[#1A1513]/70 backdrop-blur-sm border border-[#D4A373]/60 text-[#D4A373]">
                      <Icon className="w-5 h-5" strokeWidth={1.5} />
                    </span>
                  </div>
                  <div className="p-6 md:p-7 flex flex-col flex-1">
                    <E name="title" defaults={p.title} multiline={false} as="h3"
                       className="font-serif-x text-xl md:text-[22px] leading-[1.15] text-[#2C2621]" />
                    <E name="body" defaults={p.body} as="p"
                       className="mt-3 text-sm leading-relaxed text-[#5C5248] flex-1" />
                  </div>
                </article>
              </SlotScope>
            );
          })}
        </div>
      </div>
    </section>
  </SlotScope>
);

const Stats = ({ lang }) => (
  <section data-testid="eq-stats" className="relative bg-[#FDFBF7] py-16 md:py-20 border-b border-[#2C2621]/10">
    <div className="max-w-7xl mx-auto px-6 md:px-12">
      <span className="overline inline-flex items-center gap-2 text-[#C16542] mb-8">
        <CalendarCheck className="w-3.5 h-3.5" strokeWidth={1.6} />
        <E name="stats.overline" defaults={COPY.stats.overline} multiline={false} />
      </span>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[#2C2621]/10 border border-[#2C2621]/10 mt-4">
        {COPY.stats.items.map((s) => (
          <div
            key={s.id}
            data-testid={`eq-stat-${s.id}`}
            className="bg-[#FDFBF7] p-7 md:p-9"
          >
            <E name={`stats.${s.id}.value`} defaults={{ es: s.value, en: s.value, fr: s.value }} multiline={false} as="p"
               className="font-serif-x text-5xl md:text-6xl text-[#C16542] tabular-nums leading-none" />
            <E name={`stats.${s.id}.label`} defaults={s.label} multiline={false} as="p"
               className="mt-3 text-xs md:text-sm tracking-[0.22em] uppercase text-[#5C5248]" />
          </div>
        ))}
      </div>
    </div>
  </section>
);

const XalucaEcosystem = ({ lang }) => (
  <SlotScope id="ecosystem">
    <section data-testid="eq-ecosystem" className="relative bg-[#FDFBF7] py-20 md:py-28 border-t border-[#2C2621]/10">
      <div className="relative max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="max-w-3xl">
          <span className="overline inline-flex items-center gap-2 text-[#C16542]">
            <Globe2 className="w-3.5 h-3.5" strokeWidth={1.6} />
            <E name="overline" defaults={COPY.ecosystem.overline} multiline={false} />
          </span>
          <E name="title" defaults={COPY.ecosystem.title} multiline={false} as="h2"
             className="font-serif-x text-4xl md:text-5xl lg:text-[52px] leading-[1.05] tracking-tight mt-4 text-[#2C2621]" />
          <E name="intro" defaults={COPY.ecosystem.intro} as="p"
             className="mt-6 text-base md:text-lg text-[#5C5248] leading-relaxed" />
        </div>

        {/* Areas */}
        <div className="mt-14 md:mt-16">
          <E name="areasTitle" defaults={COPY.ecosystem.areasTitle} multiline={false} as="h3"
             className="overline text-[#A07042] mb-7" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[#2C2621]/10 border border-[#2C2621]/10">
            {COPY.ecosystem.areas.map((a, i) => {
              const Icon = ICON_MAP[a.icon] || Sparkles;
              return (
                <article
                  key={a.id}
                  data-testid={`eq-ecosystem-${a.id}`}
                  className="group bg-[#FDFBF7] p-7 md:p-8 hover:bg-[#F2EBE1] transition-colors flex flex-col"
                >
                  <div className="flex items-center gap-4">
                    <span className="font-serif-x text-3xl text-[#C16542]/50 tabular-nums">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="inline-flex items-center justify-center w-12 h-12 bg-[#F2EBE1] text-[#C16542] group-hover:bg-[#C16542] group-hover:text-[#FDFBF7] transition-colors">
                      <Icon className="w-5 h-5" strokeWidth={1.5} />
                    </span>
                  </div>
                  <E name={`${a.id}.title`} defaults={a.title} multiline={false} as="h4"
                     className="font-serif-x text-xl md:text-[22px] leading-[1.15] text-[#2C2621] mt-6" />
                  <E name={`${a.id}.body`} defaults={a.body} as="p"
                     className="mt-3 text-sm leading-relaxed text-[#5C5248] flex-1" />
                </article>
              );
            })}
            {/* Fill the trailing empty grid cells so the block reads as a clean panel */}
            <div className="hidden lg:block bg-[#FDFBF7]" aria-hidden="true" />
            <div className="hidden lg:block bg-[#FDFBF7]" aria-hidden="true" />
          </div>
        </div>

        {/* Closing callout */}
        <div
          data-testid="eq-ecosystem-callout"
          className="relative mt-12 md:mt-16 overflow-hidden bg-[#1A1513] px-8 py-12 md:px-16 md:py-16 text-center"
        >
          <div className="absolute inset-0 berber-bg-cross opacity-[0.07] pointer-events-none" aria-hidden="true" />
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#D4A373]/60 to-transparent" aria-hidden="true" />
          <div className="relative max-w-4xl mx-auto">
            <span className="inline-flex items-center justify-center w-12 h-12 rounded-full border border-[#D4A373]/50 text-[#D4A373] mb-6">
              <Sparkles className="w-5 h-5" strokeWidth={1.5} />
            </span>
            <E name="callout" defaults={COPY.ecosystem.callout} multiline={false} as="p"
               className="font-serif-x text-2xl md:text-4xl lg:text-[44px] leading-[1.15] tracking-tight text-[#FDFBF7]" />
            <E name="calloutSub" defaults={COPY.ecosystem.calloutSub} as="p"
               className="mt-6 text-sm md:text-base text-[#D4A373] leading-relaxed max-w-2xl mx-auto" />
          </div>
        </div>
      </div>
    </section>
  </SlotScope>
);

const Bridge = ({ lang }) => (
  <section data-testid="eq-bridge" className="relative bg-[#FDFBF7] py-24 md:py-32">
    <div className="max-w-7xl mx-auto px-6 md:px-12">
      <div className="max-w-3xl mb-12 md:mb-16">
        <span className="overline inline-flex items-center gap-2 text-[#C16542]">
          <Globe2 className="w-3.5 h-3.5" strokeWidth={1.6} />
          <E name="bridge.overline" defaults={COPY.bridge.overline} multiline={false} />
        </span>
        <E name="bridge.title" defaults={COPY.bridge.title} multiline={false} as="h2"
           className="font-serif-x text-4xl md:text-5xl lg:text-[52px] leading-[1.05] tracking-tight mt-4 text-[#2C2621]" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#2C2621]/10 border border-[#2C2621]/10">
        {COPY.bridge.columns.map((c) => {
          const Icon = ICON_MAP[c.icon] || Globe2;
          return (
            <article
              key={c.id}
              data-testid={`eq-bridge-${c.id}`}
              className="bg-[#FDFBF7] p-8 md:p-10 flex gap-5"
            >
              <div className="flex flex-col items-center gap-3 flex-shrink-0">
                <span className="text-3xl leading-none" aria-hidden="true">{c.flag}</span>
                <span className="inline-flex items-center justify-center w-11 h-11 bg-[#F2EBE1] text-[#C16542]">
                  <Icon className="w-5 h-5" strokeWidth={1.6} />
                </span>
              </div>
              <div>
                <E name={`bridge.${c.id}.title`} defaults={c.title} multiline={false} as="h3"
                   className="font-serif-x text-2xl md:text-[28px] leading-[1.12] text-[#2C2621]" />
                <E name={`bridge.${c.id}.body`} defaults={c.body} as="p"
                   className="mt-4 text-sm md:text-base leading-relaxed text-[#5C5248]" />
              </div>
            </article>
          );
        })}
      </div>
    </div>
  </section>
);

const Values = ({ lang }) => (
  <section data-testid="eq-values" className="relative bg-[#F2EBE1] py-20 md:py-28 border-t border-[#2C2621]/10 overflow-hidden">
    <div className="absolute inset-0 berber-bg-diamond opacity-40 pointer-events-none" aria-hidden="true" />
    <div className="relative max-w-7xl mx-auto px-6 md:px-12">
      <div className="max-w-3xl mb-12 md:mb-16">
        <span className="overline inline-flex items-center gap-2 text-[#C16542]">
          <Sparkles className="w-3.5 h-3.5" strokeWidth={1.6} />
          <E name="values.overline" defaults={COPY.values.overline} multiline={false} />
        </span>
        <E name="values.title" defaults={COPY.values.title} multiline={false} as="h2"
           className="font-serif-x text-4xl md:text-5xl lg:text-[52px] leading-[1.05] tracking-tight mt-4 text-[#2C2621]" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[#2C2621]/10 border border-[#2C2621]/10">
        {COPY.values.items.map((v, i) => {
          const Icon = ICON_MAP[v.icon] || Sparkles;
          return (
            <article
              key={v.id}
              data-testid={`eq-value-${v.id}`}
              className="bg-[#FDFBF7] p-7 md:p-8 hover:bg-[#F2EBE1] transition-colors flex flex-col"
            >
              <div className="flex items-center gap-4">
                <span className="font-serif-x text-3xl text-[#C16542]/60 tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="inline-flex items-center justify-center w-11 h-11 bg-[#F2EBE1] text-[#C16542]">
                  <Icon className="w-5 h-5" strokeWidth={1.5} />
                </span>
              </div>
              <E name={`values.${v.id}.title`} defaults={v.title} multiline={false} as="h3"
                 className="font-serif-x text-xl md:text-[22px] leading-[1.15] text-[#2C2621] mt-6" />
              <E name={`values.${v.id}.body`} defaults={v.body} as="p"
                 className="mt-3 text-sm leading-relaxed text-[#5C5248] flex-1" />
            </article>
          );
        })}
      </div>
    </div>
  </section>
);

const FinalCta = ({ lang }) => (
  <section data-testid="eq-final-cta" className="relative bg-[#1A1513] py-24 md:py-32 overflow-hidden">
    <EditableImage
      slot="equipo.final.bg"
      fallback={banner("medinaPeople", 2400)}
      alt=""
      aspectRatio="auto"
      imgProps={{ loading: "lazy" }}
      className="absolute inset-0 w-full h-full object-cover opacity-25"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-[#1A1513] via-[#1A1513]/85 to-[#1A1513]/65 pointer-events-none" />
    <div className="absolute inset-0 berber-bg-diamond opacity-20 pointer-events-none" aria-hidden="true" />

    <div className="relative max-w-5xl mx-auto px-6 md:px-12">
      <div className="text-center max-w-3xl mx-auto">
        <span className="overline inline-flex items-center gap-2 text-[#D4A373]">
          <Sparkles className="w-3.5 h-3.5" strokeWidth={1.6} />
          <E name="cta.eyebrow" defaults={COPY.cta.eyebrow} multiline={false} />
        </span>
        <E name="cta.title" defaults={COPY.cta.title} multiline={false} as="h2"
           className="font-serif-x text-4xl md:text-5xl lg:text-6xl leading-[1.05] tracking-tight mt-5 text-[#FDFBF7]" />
        <E name="cta.body" defaults={COPY.cta.body} as="p"
           className="mt-6 text-base md:text-lg text-[#FDFBF7]/80 leading-relaxed" />
      </div>

      <div className="mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-3 gap-px bg-[#FDFBF7]/10 border border-[#FDFBF7]/15 max-w-4xl mx-auto">
        <a
          href={`tel:${CONTACT.phoneRaw}`}
          data-testid="eq-contact-phone"
          className="bg-[#1A1513]/70 hover:bg-[#221A16] backdrop-blur-sm p-6 md:p-7 flex items-start gap-4 transition-colors"
        >
          <Phone className="w-5 h-5 text-[#D4A373] mt-1 flex-shrink-0" strokeWidth={1.6} />
          <div>
            <E name="cta.phoneLabel" defaults={COPY.cta.phoneLabel} multiline={false} as="p" className="text-[10px] tracking-[0.3em] uppercase text-[#FDFBF7]/55" />
            <p className="mt-1 text-base text-[#FDFBF7]">{CONTACT.phone}</p>
          </div>
        </a>
        <a
          href={`mailto:${CONTACT.email}`}
          data-testid="eq-contact-email"
          className="bg-[#1A1513]/70 hover:bg-[#221A16] backdrop-blur-sm p-6 md:p-7 flex items-start gap-4 transition-colors"
        >
          <Mail className="w-5 h-5 text-[#D4A373] mt-1 flex-shrink-0" strokeWidth={1.6} />
          <div>
            <E name="cta.emailLabel" defaults={COPY.cta.emailLabel} multiline={false} as="p" className="text-[10px] tracking-[0.3em] uppercase text-[#FDFBF7]/55" />
            <p className="mt-1 text-base text-[#FDFBF7] break-all">{CONTACT.email}</p>
          </div>
        </a>
        <div
          data-testid="eq-contact-hours"
          className="bg-[#1A1513]/70 backdrop-blur-sm p-6 md:p-7 flex items-start gap-4"
        >
          <Clock className="w-5 h-5 text-[#D4A373] mt-1 flex-shrink-0" strokeWidth={1.6} />
          <div>
            <E name="cta.hoursLabel" defaults={COPY.cta.hoursLabel} multiline={false} as="p" className="text-[10px] tracking-[0.3em] uppercase text-[#FDFBF7]/55" />
            <E name="cta.hours" defaults={COPY.cta.hours} multiline={false} as="p" className="mt-1 text-base text-[#FDFBF7]" />
          </div>
        </div>
      </div>

      <div className="mt-10 flex flex-wrap gap-4 justify-center">
        <Link
          to={pathFor(lang, "planTrip")}
          data-testid="eq-cta-plan"
          className="inline-flex items-center gap-2 bg-[#C16542] hover:bg-[#A8533A] text-[#FDFBF7] px-7 py-3.5 text-sm tracking-[0.18em] uppercase transition-colors"
        >
          <E name="cta.planCta" defaults={COPY.cta.planCta} multiline={false} />
          <ArrowRight className="w-4 h-4" strokeWidth={1.6} />
        </Link>
        <Link
          to={pathFor(lang, "contact")}
          data-testid="eq-cta-contact"
          className="inline-flex items-center gap-2 border border-[#FDFBF7]/40 hover:border-[#D4A373] hover:text-[#D4A373] text-[#FDFBF7] px-7 py-3.5 text-sm tracking-[0.18em] uppercase transition-colors"
        >
          <E name="cta.contactCta" defaults={COPY.cta.contactCta} multiline={false} />
          <MapPin className="w-4 h-4" strokeWidth={1.6} />
        </Link>
      </div>
    </div>
  </section>
);

/* ============================================================
   Page
============================================================ */
export default function EquipoPage() {
  const { lang } = useLanguage();
  const [selectedId, setSelectedId] = useState(TEAM[0].id);
  const selectedMember = TEAM.find((m) => m.id === selectedId) || TEAM[0];
  const fn = selectedMember.firstName;
  const reviewEyebrow = {
    es: `Opiniones sobre ${fn}`, en: `Reviews about ${fn}`, fr: `Avis sur ${fn}`,
  };
  const reviewTitle = {
    es: `Lo que dicen los viajeros de ${fn}.`,
    en: `What travellers say about ${fn}.`,
    fr: `Ce que les voyageurs disent de ${fn}.`,
  };

  useEffect(() => {
    document.title = DOC_TITLES[lang] || DOC_TITLES.es;
  }, [lang]);

  return (
    <div data-testid="eq-page" className="bg-[#FDFBF7]">
      <Hero lang={lang} />
      <Intro lang={lang} selectedId={selectedId} onSelect={setSelectedId} />
      <Testimonials
        key={selectedId}
        testid="eq-team-reviews"
        themes={[selectedMember.reviewTheme]}
        pad={false}
        limit={6}
        tone="sand"
        eyebrow={reviewEyebrow}
        title={reviewTitle}
        subtitle={COPY.reviews.subtitle}
      />
      <Stats lang={lang} />
      <GroupPillars lang={lang} />
      <XalucaEcosystem lang={lang} />
      <Bridge lang={lang} />
      <Values lang={lang} />
      <FinalCta lang={lang} />
    </div>
  );
}
