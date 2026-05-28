import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { MapContainer, TileLayer, CircleMarker, Tooltip } from "react-leaflet";
import {
  Home, ChevronRight, Compass, ArrowRight, ArrowUpRight, MapPin,
  Heart, Users, Users2, User, Briefcase, Sparkles, Star,
  Tent, Mountain, Crown, Utensils, Sun, Snowflake, Leaf, CloudSun,
  Car, Shield, Hotel, Phone, Compass as CompassIcon,
} from "lucide-react";
import { useLanguage, pick } from "@/contexts/LanguageContext";
import { pathFor } from "@/lib/routes";
import { IMG, banner } from "@/lib/imageBank";
import EditableImage from "@/components/EditableImage";
import { SlotScope } from "@/components/slotScope";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";

const DOC_TITLES = {
  es: "Marruecos · Tu próxima aventura · Xaluca Tours",
  en: "Morocco · Your next adventure · Xaluca Tours",
  fr: "Maroc · Votre prochaine aventure · Xaluca Tours",
};

/* ============================================================
   Copy (identical content — only visual layer is being aligned
   to the site's design system)
============================================================ */
const COPY = {
  breadcrumb: { es: "Inicio", en: "Home", fr: "Accueil" },
  current:    { es: "Marruecos", en: "Morocco", fr: "Maroc" },
  hero: {
    eyebrow: { es: "Tu próxima aventura empieza aquí", en: "Your next adventure starts here", fr: "Votre prochaine aventure commence ici" },
    place:   { es: "Marruecos · Norte a Sur", en: "Morocco · North to South", fr: "Maroc · Du Nord au Sud" },
    title:   { es: "Marruecos.", en: "Morocco.", fr: "Maroc." },
    subtitle: {
      es: "Un país, mil viajes. Desierto, ciudades imperiales, montañas, costa y una cultura que se vive más que se visita.",
      en: "One country, a thousand journeys. Desert, imperial cities, mountains, coast and a culture you live rather than visit.",
      fr: "Un pays, mille voyages. Désert, cités impériales, montagnes, côte et une culture qui se vit plus qu'elle ne se visite.",
    },
    cta1: { es: "Diseña tu viaje", en: "Design my trip", fr: "Concevoir mon voyage" },
    cta2: { es: "Ver circuitos",   en: "Browse circuits", fr: "Voir les circuits" },
  },
  why: {
    overline: { es: "Por qué Marruecos", en: "Why Morocco", fr: "Pourquoi le Maroc" },
    title: { es: "Cuatro mundos. Un solo país.", en: "Four worlds. One single country.", fr: "Quatre mondes. Un seul pays." },
    pillars: [
      { id: "desierto",   icon: "Tent",     accent: "#D4A373",
        title: { es: "Desierto", en: "Desert", fr: "Désert" },
        body:  { es: "Las dunas naranjas del Erg Chebbi, los oasis del Drâa y los cielos más estrellados del Magreb.",
                 en: "The orange dunes of Erg Chebbi, the Drâa oases and the starriest skies of the Maghreb.",
                 fr: "Les dunes orangées de l'Erg Chebbi, les oasis du Drâa et les cieux les plus étoilés du Maghreb." } },
      { id: "imperiales", icon: "Crown",    accent: "#C16542",
        title: { es: "Ciudades imperiales", en: "Imperial cities", fr: "Cités impériales" },
        body:  { es: "Marrakech, Fez, Meknès, Rabat. Cuatro capitales históricas, cuatro medinas UNESCO.",
                 en: "Marrakech, Fez, Meknès, Rabat. Four historic capitals, four UNESCO medinas.",
                 fr: "Marrakech, Fès, Meknès, Rabat. Quatre capitales historiques, quatre médinas UNESCO." } },
      { id: "naturaleza", icon: "Mountain", accent: "#5A7F9C",
        title: { es: "Atlas y naturaleza", en: "Atlas & nature", fr: "Atlas & nature" },
        body:  { es: "El Toubkal a 4 167 m, gargantas del Dadès y el Todra, valles de almendros, palmerales infinitos.",
                 en: "Toubkal at 4,167 m, the Dadès and Todra gorges, almond valleys, endless palm groves.",
                 fr: "Toubkal à 4 167 m, gorges du Dadès et du Todra, vallées d'amandiers, palmeraies infinies." } },
      { id: "cultura",    icon: "Utensils", accent: "#3B5BA9",
        title: { es: "Cultura y hospitalidad", en: "Culture & hospitality", fr: "Culture & hospitalité" },
        body:  { es: "Té de menta, tagines en familia, música gnaoua, hammams centenarios. Marruecos no se visita: se vive.",
                 en: "Mint tea, family tagines, gnawa music, century-old hammams. Morocco is not visited — it's lived.",
                 fr: "Thé à la menthe, tajines en famille, musique gnawa, hammams centenaires. Le Maroc ne se visite pas, il se vit." } },
    ],
  },
  experiences: {
    overline: { es: "Experiencias", en: "Experiences", fr: "Expériences" },
    title: { es: "Elige cómo viajar — filtramos las experiencias para ti.",
             en: "Choose how you travel — we'll filter the experiences for you.",
             fr: "Choisissez votre façon de voyager — nous filtrons les expériences pour vous." },
    profiles: [
      { id: "all",     icon: "Sparkles",  label: { es: "Todas",   en: "All",       fr: "Toutes" } },
      { id: "pareja",  icon: "Heart",     label: { es: "Pareja",  en: "Couple",    fr: "Couple" } },
      { id: "amigos",  icon: "Users",     label: { es: "Amigos",  en: "Friends",   fr: "Amis" } },
      { id: "familia", icon: "Users2",    label: { es: "Familia", en: "Family",    fr: "Famille" } },
      { id: "solo",    icon: "User",      label: { es: "Solo",    en: "Solo",      fr: "Solo" } },
      { id: "empresa", icon: "Briefcase", label: { es: "Empresa", en: "Corporate", fr: "Entreprise" } },
    ],
    items: [
      { id: "desert-sleep", size: "feature", image: IMG.dunes,
        profiles: ["pareja","amigos","familia","solo","empresa"],
        title: { es: "Dormir en el desierto", en: "Sleep in the desert", fr: "Dormir dans le désert" },
        body:  { es: "Bivouac de lujo entre las dunas del Erg Chebbi. Cena bajo las estrellas, amanecer sobre el mar de arena.",
                 en: "Luxury bivouac among the Erg Chebbi dunes. Dinner under the stars, sunrise over the sea of sand.",
                 fr: "Bivouac de luxe parmi les dunes de l'Erg Chebbi. Dîner sous les étoiles, lever de soleil sur la mer de sable." } },
      { id: "4x4-route", size: "wide", image: IMG.kasbahArch,
        profiles: ["amigos","empresa","solo"],
        title: { es: "Ruta en 4x4", en: "4x4 route", fr: "Route en 4x4" },
        body:  { es: "Pistas off-road por el Anti-Atlas y el Drâa con conductor local experto.",
                 en: "Off-road tracks across the Anti-Atlas and Drâa with an expert local driver.",
                 fr: "Pistes off-road à travers l'Anti-Atlas et le Drâa avec un chauffeur local expert." } },
      { id: "hammam", size: "small", image: IMG.riadInterior,
        profiles: ["pareja","solo","familia"],
        title: { es: "Hammam tradicional", en: "Traditional hammam", fr: "Hammam traditionnel" },
        body:  { es: "Ritual ancestral en hammam centenario: jabón negro, exfoliación, té de menta.",
                 en: "An ancestral ritual in a century-old hammam: black soap, exfoliation, mint tea.",
                 fr: "Rituel ancestral dans un hammam centenaire : savon noir, gommage, thé à la menthe." } },
      { id: "stars-dinner", size: "wide", image: IMG.camelCaravan,
        profiles: ["pareja","empresa","familia"],
        title: { es: "Cena bajo las estrellas", en: "Dinner under the stars", fr: "Dîner sous les étoiles" },
        body:  { es: "Mesa de gala en el desierto, fuego abierto, música gnaoua acústica al cierre.",
                 en: "Gala table in the desert, open fire, closing acoustic gnawa music.",
                 fr: "Table de gala dans le désert, feu ouvert, musique gnawa acoustique en clôture." } },
      { id: "medinas", size: "small", image: IMG.medinaPeople,
        profiles: ["pareja","amigos","familia","solo"],
        title: { es: "Paseo por medinas", en: "Wander the medinas", fr: "Flâner dans les médinas" },
        body:  { es: "Pierde el rumbo en Fez, Marrakech o Chefchaouen con guía local.",
                 en: "Lose yourself in Fez, Marrakech or Chefchaouen with a local guide.",
                 fr: "Perdez-vous à Fès, Marrakech ou Chefchaouen avec un guide local." } },
      { id: "kasbahs", size: "wide", image: IMG.kasbahGate,
        profiles: ["pareja","familia","amigos"],
        title: { es: "Kasbahs y oasis", en: "Kasbahs & oases", fr: "Kasbahs & oasis" },
        body:  { es: "Aït Ben Haddou, Skoura y el valle del Drâa: la ruta de las kasbahs en estado puro.",
                 en: "Aït Ben Haddou, Skoura and the Drâa valley: the kasbah route at its purest.",
                 fr: "Aït Ben Haddou, Skoura et la vallée du Drâa : la route des kasbahs à l'état pur." } },
      { id: "atlas-trek", size: "wide", image: IMG.atlasValley,
        profiles: ["amigos","familia","solo"],
        title: { es: "Trekking suave en el Atlas", en: "Gentle Atlas trekking", fr: "Trek doux dans l'Atlas" },
        body:  { es: "Senderos bereberes entre Imlil y Ourika, mulas en los caminos, té en cada pueblo.",
                 en: "Berber trails between Imlil and Ourika, mules on the paths, tea in every village.",
                 fr: "Sentiers berbères entre Imlil et Ourika, mules sur les chemins, thé dans chaque village." } },
      { id: "coast-surf", size: "wide", image: IMG.essaouiraPort,
        profiles: ["pareja","amigos","solo"],
        title: { es: "Surf o relax en la costa", en: "Surf or relax on the coast", fr: "Surf ou détente sur la côte" },
        body:  { es: "Essaouira y Taghazout: vientos de alisios, olas largas y atardeceres atlánticos.",
                 en: "Essaouira and Taghazout: trade winds, long waves and Atlantic sunsets.",
                 fr: "Essaouira et Taghazout : alizés, vagues longues et couchers atlantiques." } },
    ],
  },
  map: {
    overline: { es: "El país en un vistazo", en: "The country at a glance", fr: "Le pays en un coup d'œil" },
    title: { es: "11 puntos imprescindibles.", en: "11 must-see points.", fr: "11 points incontournables." },
    body:  { es: "Pulsa cualquier marcador para descubrir el destino.",
             en: "Click any marker to discover the destination.",
             fr: "Cliquez sur un marqueur pour découvrir la destination." },
  },
  profiles: {
    overline: { es: "Elige tu forma de viajar", en: "Choose how you travel", fr: "Choisissez votre façon de voyager" },
    title: { es: "Cada viajero, un Marruecos distinto.", en: "Each traveller, a different Morocco.", fr: "Chaque voyageur, un Maroc différent." },
    items: [
      { id: "pareja",  icon: "Heart",     route: "tourEscapadaMarrakech", label: { es: "En pareja",    en: "As a couple",     fr: "En couple" },     body: { es: "Riads íntimos, cenas privadas y rutas con pausas pensadas.", en: "Intimate riads, private dinners and routes built for pauses.", fr: "Riads intimes, dîners privés et itinéraires pensés pour les pauses." } },
      { id: "amigos",  icon: "Users",     route: "tourSouth",             label: { es: "Con amigos",   en: "With friends",    fr: "Entre amis" },    body: { es: "4x4, bivouacs en el desierto y rutas con adrenalina.",         en: "4x4s, desert bivouacs and adrenaline-driven routes.",         fr: "4x4, bivouacs dans le désert et itinéraires d'adrénaline." } },
      { id: "familia", icon: "Users2",    route: "tourFull",              label: { es: "En familia",   en: "As a family",     fr: "En famille" },    body: { es: "Programas adaptados, hoteles familiares y guías pacientes.",   en: "Family-friendly programs, family hotels and patient guides.", fr: "Programmes adaptés, hôtels familiaux et guides patients." } },
      { id: "solo",    icon: "User",      route: "tourNorth",             label: { es: "En solitario", en: "Solo",            fr: "En solo" },       body: { es: "Pequeños grupos, encuentros locales y libertad total.",        en: "Small groups, local encounters and total freedom.",           fr: "Petits groupes, rencontres locales et liberté totale." } },
      { id: "empresa", icon: "Briefcase", route: "events",                label: { es: "Empresa & incentivos", en: "Corporate & incentives", fr: "Entreprise & incentives" }, body: { es: "Infraestructura 360º, hoteles propios, eventos llave en mano.", en: "360° infrastructure, owned hotels, turnkey events.", fr: "Infrastructure à 360°, hôtels propres, événements clé en main." } },
    ],
    cta: { es: "Ver rutas", en: "See routes", fr: "Voir les itinéraires" },
  },
  seasons: {
    overline: { es: "Cuándo viajar", en: "When to travel", fr: "Quand partir" },
    title: { es: "Cada estación, otro Marruecos.", en: "Each season, another Morocco.", fr: "Chaque saison, un autre Maroc." },
    body:  { es: "Marruecos es un destino de 365 días. La elección depende de la ruta.",
             en: "Morocco is a 365-day destination. The choice depends on the route.",
             fr: "Le Maroc se visite 365 jours par an. Le choix dépend de l'itinéraire." },
    seeFull: { es: "Guía climática completa", en: "Full climate guide", fr: "Guide climatique complet" },
    items: [
      { id: "spring", icon: "Leaf",     accent: "#7FA67A", months: { es: "Mar – May", en: "Mar – May", fr: "Mar – Mai" },
        title: { es: "Primavera", en: "Spring", fr: "Printemps" },
        body:  { es: "Ideal para rutas completas: ciudades imperiales, Atlas en flor, desierto aún fresco.",
                 en: "Ideal for full routes: imperial cities, blossoming Atlas, still-cool desert.",
                 fr: "Idéal pour les itinéraires complets : cités impériales, Atlas en fleurs, désert encore frais." } },
      { id: "summer", icon: "Sun",      accent: "#E0A062", months: { es: "Jun – Ago", en: "Jun – Aug", fr: "Juin – Août" },
        title: { es: "Verano", en: "Summer", fr: "Été" },
        body:  { es: "Costa, Atlas y norte. El sur es más exigente: programas adaptados con noches frescas.",
                 en: "Coast, Atlas and north. The south is tougher: adapted programs with cool nights.",
                 fr: "Côte, Atlas et nord. Le sud est plus exigeant : programmes adaptés avec nuits fraîches." } },
      { id: "autumn", icon: "CloudSun", accent: "#C16542", months: { es: "Sep – Nov", en: "Sep – Nov", fr: "Sep – Nov" },
        title: { es: "Otoño", en: "Autumn", fr: "Automne" },
        body:  { es: "La mejor temporada para el desierto y las ciudades imperiales. Luz cinematográfica.",
                 en: "The best season for desert and imperial cities. Cinematographic light.",
                 fr: "La meilleure saison pour le désert et les cités impériales. Lumière cinématographique." } },
      { id: "winter", icon: "Snowflake",accent: "#5A7F9C", months: { es: "Dic – Feb", en: "Dec – Feb", fr: "Déc – Fév" },
        title: { es: "Invierno", en: "Winter", fr: "Hiver" },
        body:  { es: "Sur, desierto y escapadas. El Atlas se cubre de nieve; los oasis se vuelven mágicos.",
                 en: "South, desert and short escapes. The Atlas turns white; oases become magical.",
                 fr: "Sud, désert et escapades. L'Atlas se couvre de neige ; les oasis deviennent magiques." } },
    ],
  },
  routes: {
    overline: { es: "Rutas populares", en: "Popular routes", fr: "Itinéraires populaires" },
    title: { es: "Seis maneras de empezar.", en: "Six ways to begin.", fr: "Six façons de commencer." },
    items: [
      { id: "gransur",            image: IMG.dunes,         route: "tourSouth",                  title: { es: "Gran Sur de Marruecos",      en: "Grand South of Morocco",    fr: "Grand Sud du Maroc" } },
      { id: "marrakech-desierto", image: IMG.kasbahArch,    route: "tourMarrakechErgHub",        title: { es: "Marrakech y desierto",       en: "Marrakech & desert",        fr: "Marrakech & désert" } },
      { id: "imperiales",         image: IMG.medinaPeople,  route: "tourNorteCiudadesImperiales", title: { es: "Ciudades imperiales",        en: "Imperial cities",           fr: "Cités impériales" } },
      { id: "norte",              image: IMG.chefBlueCity,  route: "tourNorth",                  title: { es: "Norte de Marruecos",         en: "Northern Morocco",          fr: "Nord du Maroc" } },
      { id: "escapadas",          image: IMG.riadFountain,  route: "tourShort",                  title: { es: "Escapadas cortas",           en: "Short escapes",             fr: "Escapades courtes" } },
      { id: "empresa",            image: IMG.kasbahGate,    route: "events",                     title: { es: "Empresa e incentivos",       en: "Corporate & incentives",    fr: "Entreprise & incentives" } },
    ],
  },
  trust: {
    overline: { es: "Por qué con Xaluca", en: "Why with Xaluca", fr: "Pourquoi avec Xaluca" },
    title: { es: "Operadores locales — no intermediarios.", en: "Local operators — not middlemen.", fr: "Opérateurs locaux — pas d'intermédiaires." },
    items: [
      { id: "local",   icon: "Compass", title: { es: "Organización local",         en: "Local organisation",         fr: "Organisation locale" } },
      { id: "fleet",   icon: "Car",     title: { es: "Logística propia",           en: "Owned logistics",            fr: "Logistique propre" } },
      { id: "hotels",  icon: "Hotel",   title: { es: "Hoteles seleccionados",      en: "Curated hotels",             fr: "Hôtels sélectionnés" } },
      { id: "groups",  icon: "Users2",  title: { es: "Grupos, familias, empresas", en: "Groups, families, companies",fr: "Groupes, familles, entreprises" } },
      { id: "support", icon: "Phone",   title: { es: "Atención personalizada",     en: "Personal support",           fr: "Suivi personnalisé" } },
    ],
  },
  cta: {
    eyebrow: { es: "Tu viaje a Marruecos, a medida", en: "Your Morocco trip, made to measure", fr: "Votre voyage au Maroc, sur mesure" },
    title:   { es: "Diseñamos tu viaje a Marruecos a medida.", en: "We design your Morocco trip from scratch.", fr: "Nous concevons votre voyage au Maroc sur mesure." },
    body:    { es: "Cuéntanos cómo quieres viajar y preparamos una propuesta adaptada a ti.",
               en: "Tell us how you want to travel and we'll prepare a proposal tailored to you.",
               fr: "Dites-nous comment vous voulez voyager et nous préparerons une proposition adaptée." },
    primary:   { es: "Pedir propuesta personalizada", en: "Request a tailored proposal", fr: "Demander une proposition personnalisée" },
    secondary: { es: "Ver circuitos", en: "Browse circuits", fr: "Voir les circuits" },
    tertiary:  { es: "Hablar con un experto", en: "Talk to an expert", fr: "Parler à un expert" },
  },
  faq: {
    overline: { es: "Preguntas frecuentes", en: "FAQ", fr: "FAQ" },
    title:    { es: "Lo que más nos preguntan.", en: "The questions we hear the most.", fr: "Les questions les plus fréquentes." },
    items: [
      { id: "safety",    q: { es: "¿Es seguro viajar a Marruecos?", en: "Is Morocco safe to travel?", fr: "Le Maroc est-il sûr ?" },
        a: { es: "Sí. Marruecos es uno de los destinos más seguros del norte de África. Aplicamos los protocolos habituales (custodia 24 h, conductor local con experiencia, contacto permanente con nuestra oficina).",
             en: "Yes. Morocco is one of the safest destinations in North Africa. We follow the usual protocols (24-hour duty, experienced local driver, permanent contact with our office).",
             fr: "Oui. Le Maroc est l'une des destinations les plus sûres d'Afrique du Nord. Nous appliquons les protocoles habituels (permanence 24 h, chauffeur local expérimenté, contact permanent avec notre bureau)." } },
      { id: "when",      q: { es: "¿Cuál es la mejor época?", en: "When is the best time?", fr: "Quelle est la meilleure période ?" },
        a: { es: "Depende de la ruta. Para el desierto, de octubre a abril. Para la costa, de junio a septiembre. Las ciudades imperiales son perfectas en primavera y otoño.",
             en: "It depends on the route. Desert: October to April. Coast: June to September. Imperial cities are perfect in spring and autumn.",
             fr: "Cela dépend de l'itinéraire. Désert : d'octobre à avril. Côte : de juin à septembre. Les cités impériales sont parfaites au printemps et en automne." } },
      { id: "duration",  q: { es: "¿Cuántos días se recomiendan?", en: "How many days do you recommend?", fr: "Combien de jours sont recommandés ?" },
        a: { es: "Un mínimo de 4 noches para una escapada y entre 8 y 10 días para un primer viaje completo (ciudades + desierto + Atlas).",
             en: "A minimum of 4 nights for a short escape and 8 to 10 days for a first complete trip (cities + desert + Atlas).",
             fr: "Au minimum 4 nuits pour une escapade et 8 à 10 jours pour un premier voyage complet (villes + désert + Atlas)." } },
      { id: "kids",      q: { es: "¿Se puede viajar con niños?", en: "Can I travel with children?", fr: "Peut-on voyager avec des enfants ?" },
        a: { es: "Sí. Adaptamos los programas a la edad: etapas más cortas, hoteles con piscina, talleres bereberes y rutas con paradas frecuentes.",
             en: "Yes. We adapt programs to age: shorter stages, hotels with pools, Berber workshops and routes with frequent stops.",
             fr: "Oui. Nous adaptons les programmes à l'âge : étapes plus courtes, hôtels avec piscine, ateliers berbères et itinéraires avec arrêts fréquents." } },
      { id: "firsttime", q: { es: "¿Qué ruta elegir si es mi primera vez?", en: "Which route is best for a first-timer?", fr: "Quel itinéraire choisir pour une première fois ?" },
        a: { es: "Recomendamos un circuito que combine Marrakech, una incursión al desierto del Erg Chebbi y Fez. Es la mejor introducción al país en 8 a 10 días.",
             en: "We recommend a circuit combining Marrakech, an excursion to the Erg Chebbi desert and Fez. It's the best introduction to the country in 8 to 10 days.",
             fr: "Nous recommandons un circuit combinant Marrakech, une excursion dans le désert de l'Erg Chebbi et Fès. C'est la meilleure introduction au pays en 8 à 10 jours." } },
      { id: "custom",    q: { es: "¿Se puede personalizar el viaje?", en: "Can the trip be customised?", fr: "Le voyage peut-il être personnalisé ?" },
        a: { es: "Sí — todos nuestros viajes son a medida. Eliges ritmo, alojamientos, actividades y fechas, y nuestro equipo construye el itinerario.",
             en: "Yes — every trip we offer is bespoke. You choose the pace, accommodation, activities and dates, and our team builds the itinerary.",
             fr: "Oui — tous nos voyages sont sur mesure. Vous choisissez le rythme, les hébergements, les activités et les dates, et notre équipe construit l'itinéraire." } },
    ],
  },
};

const ICON_MAP = {
  Tent, Mountain, Crown, Utensils, Sparkles, Heart, Users, Users2, User, Briefcase,
  Sun, Snowflake, Leaf, CloudSun, Car, Shield, Hotel, Phone, Compass: CompassIcon, Star,
};

const MAP_POINTS = [
  { id: "marrakech",   coords: [31.6295, -7.9811],  name: "Marrakech" },
  { id: "fez",         coords: [34.0331, -4.9998],  name: "Fez" },
  { id: "rabat",       coords: [34.0209, -6.8416],  name: "Rabat" },
  { id: "tanger",      coords: [35.7595, -5.8330],  name: "Tánger" },
  { id: "chefchaouen", coords: [35.1690, -5.2636],  name: "Chefchaouen" },
  { id: "ergchebbi",   coords: [31.1335, -3.9785],  name: "Erg Chebbi" },
  { id: "dades",       coords: [31.4900, -5.7300],  name: "Dadès" },
  { id: "todra",       coords: [31.5870, -5.6010],  name: "Todra" },
  { id: "ouarzazate",  coords: [30.9189, -6.8939],  name: "Ouarzazate" },
  { id: "essaouira",   coords: [31.5085, -9.7595],  name: "Essaouira" },
  { id: "dakhla",      coords: [23.7185, -15.9582], name: "Dakhla" },
];

/* ============================================================
   Sub-components — aligned with the rest of the site (cuadrado,
   #FDFBF7/#F2EBE1/#1A1513 alterno, berber overlays, botones
   rectangulares con tracking)
============================================================ */
const InlineBreadcrumb = ({ lang }) => (
  <nav
    aria-label="Breadcrumb"
    data-testid="mar-breadcrumbs"
    className="inline-flex items-center gap-2 bg-[#1A1513]/55 backdrop-blur-md border border-white/10 px-3.5 py-1.5 text-[10px] md:text-[11px] tracking-[0.22em] uppercase text-[#FDFBF7]/90"
  >
    <Link to={pathFor(lang, "home")} data-testid="mar-bc-home" className="flex items-center gap-1.5 hover:text-[#D4A373] transition-colors">
      <Home className="w-3 h-3 md:w-3.5 md:h-3.5" strokeWidth={1.6} />
      <span>{pick(COPY.breadcrumb, lang)}</span>
    </Link>
    <ChevronRight className="w-3 h-3 text-[#FDFBF7]/40" strokeWidth={1.6} />
    <span className="text-[#D4A373]">{pick(COPY.current, lang)}</span>
  </nav>
);

const Hero = ({ lang }) => (
  <section data-testid="mar-hero" className="relative h-[100svh] min-h-[680px] w-full overflow-hidden bg-[#1A1513]">
    {/* Aurorism layers — mantienen el carácter premium pedido */}
    <span className="aurora-blob a1" aria-hidden="true" />
    <span className="aurora-blob a2" aria-hidden="true" />
    <span className="aurora-blob a3" aria-hidden="true" />
    <EditableImage
      slot="marruecos-landing.hero"
      fallback={banner("dunes", 2400)}
      alt=""
      aspectRatio="auto"
      imgProps={{ loading: "eager" }}
      className="ken-burns absolute inset-0 w-full h-full object-cover opacity-35"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-[#1A1513]/95 via-[#1A1513]/55 to-[#1A1513]/30 pointer-events-none" />
    <div className="absolute inset-0 berber-bg-cross opacity-30 pointer-events-none" aria-hidden="true" />
    <span className="film-grain pointer-events-none" />

    <div className="relative z-10 h-full flex flex-col">
      <div className="pt-[88px] md:pt-[96px] px-6 md:px-12 max-w-7xl mx-auto w-full">
        <InlineBreadcrumb lang={lang} />
      </div>
      <div className="flex-1 flex items-end pb-24 md:pb-32">
        <div className="max-w-7xl mx-auto px-6 md:px-12 w-full">
          <div className="max-w-4xl">
            <div className="fade-up inline-flex items-center gap-3 text-[#D4A373]">
              <Compass className="w-3.5 h-3.5" strokeWidth={1.6} />
              <span className="text-[11px] tracking-[0.35em] uppercase font-semibold">{pick(COPY.hero.eyebrow, lang)}</span>
              <span className="w-8 h-px bg-[#D4A373]/50" />
              <span className="text-[10px] tracking-[0.3em] uppercase text-[#D4A373]/80">{pick(COPY.hero.place, lang)}</span>
            </div>
            <h1
              className="fade-up fade-up-delay-1 font-serif-x text-[#FDFBF7] text-[18vw] md:text-[14vw] lg:text-[12vw] leading-[0.94] tracking-[-0.03em] mt-6"
              style={{ fontFeatureSettings: '"liga"' }}
            >
              {pick(COPY.hero.title, lang)}
            </h1>
            <p className="fade-up fade-up-delay-2 mt-8 max-w-2xl text-base md:text-lg text-[#FDFBF7]/85 leading-relaxed">
              {pick(COPY.hero.subtitle, lang)}
            </p>
            <div className="fade-up fade-up-delay-3 mt-10 flex flex-wrap gap-3">
              <Link
                to={pathFor(lang, "planTrip")}
                data-testid="mar-hero-plan"
                className="inline-flex items-center gap-2 bg-[#C16542] hover:bg-[#A8533A] text-[#FDFBF7] px-7 py-3.5 text-sm tracking-[0.18em] uppercase transition-colors"
              >
                {pick(COPY.hero.cta1, lang)}
                <ArrowRight className="w-4 h-4" strokeWidth={1.6} />
              </Link>
              <Link
                to={pathFor(lang, "toursLanding")}
                data-testid="mar-hero-tours"
                className="inline-flex items-center gap-2 border border-[#FDFBF7]/40 hover:border-[#D4A373] hover:text-[#D4A373] text-[#FDFBF7] px-7 py-3.5 text-sm tracking-[0.18em] uppercase transition-colors backdrop-blur-sm"
              >
                {pick(COPY.hero.cta2, lang)}
                <ArrowUpRight className="w-4 h-4" strokeWidth={1.6} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const Why = ({ lang }) => (
  <section data-testid="mar-why" className="relative bg-[#FDFBF7] py-24 md:py-32">
    <div className="max-w-7xl mx-auto px-6 md:px-12">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end mb-14">
        <div className="md:col-span-7">
          <span className="overline inline-flex items-center gap-2 text-[#C16542]">
            <Star className="w-3.5 h-3.5" strokeWidth={1.6} />
            {pick(COPY.why.overline, lang)}
          </span>
          <h2 className="font-serif-x text-4xl md:text-5xl lg:text-[52px] leading-[1.05] tracking-tight mt-4 text-[#2C2621]">
            {pick(COPY.why.title, lang)}
          </h2>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-[#2C2621]/10 border border-[#2C2621]/10">
        {COPY.why.pillars.map((p) => {
          const Icon = ICON_MAP[p.icon] || Star;
          return (
            <article
              key={p.id}
              data-testid={`mar-why-${p.id}`}
              className="bg-[#FDFBF7] p-7 md:p-8 hover:bg-[#F2EBE1] transition-colors"
            >
              <span
                className="inline-flex items-center justify-center w-11 h-11"
                style={{ backgroundColor: `${p.accent}22`, color: p.accent }}
              >
                <Icon className="w-5 h-5" strokeWidth={1.6} />
              </span>
              <h3 className="font-serif-x text-2xl md:text-[26px] leading-[1.15] text-[#2C2621] mt-6">
                {pick(p.title, lang)}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[#5C5248]">
                {pick(p.body, lang)}
              </p>
            </article>
          );
        })}
      </div>
    </div>
  </section>
);

const ExperienceCard = ({ item, lang }) => {
  const spanClass =
    item.size === "feature" ? "lg:col-span-2 lg:row-span-2 aspect-[4/5] lg:aspect-auto"
    : item.size === "wide"  ? "aspect-[4/3]"
    :                          "aspect-square";
  return (
    <SlotScope id={item.id}>
      <article
        data-testid={`mar-exp-${item.id}`}
        data-profiles={item.profiles.join(",")}
        className={`group relative overflow-hidden border border-[#2C2621]/10 hover:border-[#2C2621]/30 transition-all duration-500 ${spanClass}`}
      >
        <EditableImage
          name="image"
          fallback={item.image}
          alt={pick(item.title, lang)}
          aspectRatio="auto"
          imgProps={{ loading: "lazy" }}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.05]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1513]/85 via-[#1A1513]/25 to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
          <h3 className={`font-serif-x text-[#FDFBF7] ${item.size === "feature" ? "text-3xl md:text-[40px]" : "text-xl md:text-2xl"} leading-[1.1]`}>
            {pick(item.title, lang)}
          </h3>
          <p className="mt-2 text-sm text-[#FDFBF7]/75 leading-relaxed max-w-prose opacity-0 max-h-0 group-hover:opacity-100 group-hover:max-h-40 transition-all duration-500 overflow-hidden">
            {pick(item.body, lang)}
          </p>
        </div>
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {item.profiles.slice(0, 3).map((p) => (
            <span
              key={p}
              className="text-[9px] tracking-[0.22em] uppercase px-2 py-1 bg-[#FDFBF7]/95 text-[#C16542]"
            >
              {p}
            </span>
          ))}
        </div>
      </article>
    </SlotScope>
  );
};

const Experiences = ({ lang }) => {
  const [active, setActive] = useState("all");
  const filtered = useMemo(
    () => active === "all" ? COPY.experiences.items : COPY.experiences.items.filter((e) => e.profiles.includes(active)),
    [active]
  );
  return (
    <SlotScope id="experiences">
      <section data-testid="mar-experiences" className="relative bg-[#F2EBE1] py-24 md:py-32 border-t border-[#2C2621]/10 overflow-hidden">
        <div className="absolute inset-0 berber-bg-diamond opacity-40 pointer-events-none" aria-hidden="true" />
        <div className="relative max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end mb-10 md:mb-14">
            <div className="md:col-span-7">
              <span className="overline inline-flex items-center gap-2 text-[#C16542]">
                <Sparkles className="w-3.5 h-3.5" strokeWidth={1.6} />
                {pick(COPY.experiences.overline, lang)}
              </span>
              <h2 className="font-serif-x text-4xl md:text-5xl lg:text-[52px] leading-[1.05] tracking-tight mt-4 text-[#2C2621]">
                {pick(COPY.experiences.title, lang)}
              </h2>
            </div>
          </div>

          <div data-testid="mar-profile-chips" role="tablist" className="flex flex-wrap gap-2 mb-8 md:mb-10">
            {COPY.experiences.profiles.map((p) => {
              const Icon = ICON_MAP[p.icon] || Sparkles;
              const isActive = active === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  data-testid={`mar-chip-${p.id}`}
                  onClick={() => setActive(p.id)}
                  aria-pressed={isActive}
                  className={`inline-flex items-center gap-2 px-4 py-2 text-[11px] tracking-[0.2em] uppercase border transition-all duration-200 ${
                    isActive
                      ? "bg-[#C16542] border-transparent text-[#FDFBF7]"
                      : "bg-[#FDFBF7] border-[#2C2621]/20 text-[#2C2621] hover:border-[#C16542] hover:text-[#C16542]"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" strokeWidth={1.8} />
                  {pick(p.label, lang)}
                </button>
              );
            })}
          </div>

          <div data-testid="mar-bento" className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
            {filtered.map((item) => (
              <ExperienceCard key={item.id} item={item} lang={lang} />
            ))}
          </div>
        </div>
      </section>
    </SlotScope>
  );
};

const InteractiveMap = ({ lang }) => (
  <section data-testid="mar-map" className="relative bg-[#1A1513] py-24 md:py-28 overflow-hidden">
    <div className="absolute inset-0 berber-bg-cross opacity-10 pointer-events-none" aria-hidden="true" />
    <div className="relative max-w-7xl mx-auto px-6 md:px-12">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end mb-10">
        <div className="md:col-span-7">
          <span className="overline inline-flex items-center gap-2 text-[#D4A373]">
            <MapPin className="w-3.5 h-3.5" strokeWidth={1.6} />
            {pick(COPY.map.overline, lang)}
          </span>
          <h2 className="font-serif-x text-4xl md:text-5xl lg:text-[52px] leading-[1.05] tracking-tight mt-4 text-[#FDFBF7]">
            {pick(COPY.map.title, lang)}
          </h2>
        </div>
        <div className="md:col-span-5">
          <p className="text-base text-[#FDFBF7]/75 leading-relaxed">{pick(COPY.map.body, lang)}</p>
        </div>
      </div>
      <div className="overflow-hidden border border-[#FDFBF7]/15 h-[420px] md:h-[520px]">
        <MapContainer
          center={[31.0, -7.5]}
          zoom={5}
          scrollWheelZoom={false}
          style={{ height: "100%", width: "100%", background: "#1A1513" }}
          attributionControl={false}
        >
          <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
          {MAP_POINTS.map((m) => (
            <CircleMarker
              key={m.id}
              center={m.coords}
              radius={7}
              pathOptions={{ color: "#D4A373", fillColor: "#D4A373", fillOpacity: 0.75, weight: 2 }}
            >
              <Tooltip direction="top" offset={[0, -6]} opacity={1} className="qvm-tooltip">
                <span className="font-serif-x text-sm text-[#2C2621]">{m.name}</span>
              </Tooltip>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>
    </div>
  </section>
);

const Profiles = ({ lang }) => (
  <SlotScope id="profiles">
    <section data-testid="mar-profiles" className="relative bg-[#FDFBF7] py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end mb-12 md:mb-16">
          <div className="md:col-span-7">
            <span className="overline inline-flex items-center gap-2 text-[#C16542]">
              <Users className="w-3.5 h-3.5" strokeWidth={1.6} />
              {pick(COPY.profiles.overline, lang)}
            </span>
            <h2 className="font-serif-x text-4xl md:text-5xl lg:text-[52px] leading-[1.05] tracking-tight mt-4 text-[#2C2621]">
              {pick(COPY.profiles.title, lang)}
            </h2>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-px bg-[#2C2621]/10 border border-[#2C2621]/10">
          {COPY.profiles.items.map((p) => {
            const Icon = ICON_MAP[p.icon] || Users;
            return (
              <Link
                key={p.id}
                to={pathFor(lang, p.route)}
                data-testid={`mar-profile-${p.id}`}
                className="group relative bg-[#FDFBF7] hover:bg-[#F2EBE1] p-6 md:p-7 transition-colors duration-300 flex flex-col"
              >
                <span className="inline-flex items-center justify-center w-11 h-11 bg-[#F2EBE1] text-[#C16542]">
                  <Icon className="w-5 h-5" strokeWidth={1.6} />
                </span>
                <h3 className="font-serif-x text-xl md:text-[22px] leading-[1.15] text-[#2C2621] mt-5">
                  {pick(p.label, lang)}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[#5C5248] flex-1">
                  {pick(p.body, lang)}
                </p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-[10px] tracking-[0.25em] uppercase text-[#C16542] group-hover:gap-2.5 transition-all">
                  {pick(COPY.profiles.cta, lang)}
                  <ArrowUpRight className="w-3 h-3" strokeWidth={1.8} />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  </SlotScope>
);

const Seasons = ({ lang }) => (
  <section data-testid="mar-seasons" className="relative bg-[#F2EBE1] py-24 md:py-32 border-t border-[#2C2621]/10 overflow-hidden">
    <div className="absolute inset-0 berber-bg-diamond opacity-40 pointer-events-none" aria-hidden="true" />
    <div className="relative max-w-7xl mx-auto px-6 md:px-12">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end mb-12 md:mb-16">
        <div className="md:col-span-7">
          <span className="overline inline-flex items-center gap-2 text-[#C16542]">
            <CloudSun className="w-3.5 h-3.5" strokeWidth={1.6} />
            {pick(COPY.seasons.overline, lang)}
          </span>
          <h2 className="font-serif-x text-4xl md:text-5xl lg:text-[52px] leading-[1.05] tracking-tight mt-4 text-[#2C2621]">
            {pick(COPY.seasons.title, lang)}
          </h2>
        </div>
        <div className="md:col-span-5">
          <p className="text-base text-[#5C5248] leading-relaxed">{pick(COPY.seasons.body, lang)}</p>
          <Link
            to={pathFor(lang, "whenToTravel")}
            data-testid="mar-seasons-cta"
            className="mt-4 inline-flex items-center gap-1.5 text-[10px] tracking-[0.25em] uppercase text-[#C16542] hover:text-[#A8533A] border-b border-[#C16542]/40 pb-0.5 transition-colors"
          >
            {pick(COPY.seasons.seeFull, lang)}
            <ArrowUpRight className="w-3 h-3" strokeWidth={1.8} />
          </Link>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[#2C2621]/10 border border-[#2C2621]/10">
        {COPY.seasons.items.map((s) => {
          const Icon = ICON_MAP[s.icon] || Sun;
          return (
            <article
              key={s.id}
              data-testid={`mar-season-${s.id}`}
              className="bg-[#FDFBF7] p-6 md:p-7 transition-colors hover:bg-[#F2EBE1]"
              style={{ borderTop: `3px solid ${s.accent}` }}
            >
              <span
                className="inline-flex items-center justify-center w-11 h-11"
                style={{ backgroundColor: `${s.accent}22`, color: s.accent }}
              >
                <Icon className="w-5 h-5" strokeWidth={1.6} />
              </span>
              <p className="mt-5 text-[10px] tracking-[0.3em] uppercase text-[#5C5248]">
                {pick(s.months, lang)}
              </p>
              <h3 className="font-serif-x text-2xl text-[#2C2621] mt-1">{pick(s.title, lang)}</h3>
              <p className="mt-3 text-sm leading-relaxed text-[#5C5248]">{pick(s.body, lang)}</p>
            </article>
          );
        })}
      </div>
    </div>
  </section>
);

const PopularRoutes = ({ lang }) => (
  <SlotScope id="routes">
    <section data-testid="mar-routes" className="relative bg-[#FDFBF7] py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end mb-12 md:mb-16">
          <div className="md:col-span-7">
            <span className="overline inline-flex items-center gap-2 text-[#C16542]">
              <Compass className="w-3.5 h-3.5" strokeWidth={1.6} />
              {pick(COPY.routes.overline, lang)}
            </span>
            <h2 className="font-serif-x text-4xl md:text-5xl lg:text-[52px] leading-[1.05] tracking-tight mt-4 text-[#2C2621]">
              {pick(COPY.routes.title, lang)}
            </h2>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {COPY.routes.items.map((r) => (
            <SlotScope key={r.id} id={r.id}>
              <Link
                to={pathFor(lang, r.route)}
                data-testid={`mar-route-${r.id}`}
                className="group relative overflow-hidden border border-[#2C2621]/10 hover:border-[#2C2621]/30 aspect-[4/3] transition-colors"
              >
                <EditableImage
                  name="image"
                  fallback={r.image}
                  alt={pick(r.title, lang)}
                  aspectRatio="auto"
                  imgProps={{ loading: "lazy" }}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.05]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1513]/85 via-[#1A1513]/25 to-transparent pointer-events-none" />
                <div className="absolute inset-x-0 bottom-0 p-6 flex items-end justify-between gap-3">
                  <h3 className="font-serif-x text-2xl md:text-[28px] leading-[1.1] text-[#FDFBF7] max-w-[80%]">
                    {pick(r.title, lang)}
                  </h3>
                  <span className="inline-flex items-center justify-center w-9 h-9 bg-[#FDFBF7]/95 text-[#C16542] group-hover:bg-[#C16542] group-hover:text-[#FDFBF7] transition-all">
                    <ArrowUpRight className="w-4 h-4" strokeWidth={1.8} />
                  </span>
                </div>
              </Link>
            </SlotScope>
          ))}
        </div>
      </div>
    </section>
  </SlotScope>
);

const Trust = ({ lang }) => (
  <section data-testid="mar-trust" className="relative bg-[#F2EBE1] py-24 md:py-28 border-t border-[#2C2621]/10 overflow-hidden">
    <div className="absolute inset-0 berber-bg-diamond opacity-40 pointer-events-none" aria-hidden="true" />
    <div className="relative max-w-7xl mx-auto px-6 md:px-12">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end mb-12 md:mb-16">
        <div className="md:col-span-7">
          <span className="overline inline-flex items-center gap-2 text-[#C16542]">
            <Shield className="w-3.5 h-3.5" strokeWidth={1.6} />
            {pick(COPY.trust.overline, lang)}
          </span>
          <h2 className="font-serif-x text-4xl md:text-5xl lg:text-[52px] leading-[1.05] tracking-tight mt-4 text-[#2C2621]">
            {pick(COPY.trust.title, lang)}
          </h2>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-px bg-[#2C2621]/10 border border-[#2C2621]/10">
        {COPY.trust.items.map((t) => {
          const Icon = ICON_MAP[t.icon] || Shield;
          return (
            <article
              key={t.id}
              data-testid={`mar-trust-${t.id}`}
              className="bg-[#FDFBF7] p-6 md:p-7 flex flex-col items-start hover:bg-[#F2EBE1] transition-colors"
            >
              <span className="inline-flex items-center justify-center w-11 h-11 bg-[#3B5BA9]/15 text-[#3B5BA9]">
                <Icon className="w-5 h-5" strokeWidth={1.6} />
              </span>
              <h3 className="font-serif-x text-lg md:text-xl leading-[1.2] text-[#2C2621] mt-5">
                {pick(t.title, lang)}
              </h3>
            </article>
          );
        })}
      </div>
    </div>
  </section>
);

const FinalCta = ({ lang }) => (
  <section data-testid="mar-final-cta" className="relative bg-[#1A1513] py-24 md:py-32 overflow-hidden">
    <EditableImage
      slot="marruecos-landing.final.bg"
      fallback={banner("dunes", 2400)}
      alt=""
      aspectRatio="auto"
      imgProps={{ loading: "lazy" }}
      className="absolute inset-0 w-full h-full object-cover opacity-25"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-[#1A1513] via-[#1A1513]/85 to-[#1A1513]/65 pointer-events-none" />
    <div className="absolute inset-0 berber-bg-diamond opacity-20 pointer-events-none" aria-hidden="true" />

    <div className="relative max-w-4xl mx-auto px-6 md:px-12 text-center">
      <span className="overline inline-flex items-center gap-2 text-[#D4A373]">
        <Sparkles className="w-3.5 h-3.5" strokeWidth={1.6} />
        {pick(COPY.cta.eyebrow, lang)}
      </span>
      <h2 className="font-serif-x text-4xl md:text-5xl lg:text-6xl leading-[1.05] tracking-tight mt-5 text-[#FDFBF7]">
        {pick(COPY.cta.title, lang)}
      </h2>
      <p className="mt-6 text-base md:text-lg text-[#FDFBF7]/80 leading-relaxed max-w-2xl mx-auto">
        {pick(COPY.cta.body, lang)}
      </p>
      <div className="mt-10 flex flex-wrap gap-4 justify-center">
        <Link
          to={pathFor(lang, "planTrip")}
          data-testid="mar-cta-primary"
          className="inline-flex items-center gap-2 bg-[#C16542] hover:bg-[#A8533A] text-[#FDFBF7] px-7 py-3.5 text-sm tracking-[0.18em] uppercase transition-colors"
        >
          {pick(COPY.cta.primary, lang)}
          <ArrowRight className="w-4 h-4" strokeWidth={1.6} />
        </Link>
        <Link
          to={pathFor(lang, "toursLanding")}
          data-testid="mar-cta-secondary"
          className="inline-flex items-center gap-2 border border-[#FDFBF7]/40 hover:border-[#D4A373] hover:text-[#D4A373] text-[#FDFBF7] px-7 py-3.5 text-sm tracking-[0.18em] uppercase transition-colors"
        >
          {pick(COPY.cta.secondary, lang)}
          <ArrowUpRight className="w-4 h-4" strokeWidth={1.6} />
        </Link>
        <Link
          to={pathFor(lang, "contact")}
          data-testid="mar-cta-tertiary"
          className="inline-flex items-center gap-2 text-[#FDFBF7]/80 hover:text-[#FDFBF7] px-5 py-3.5 text-sm tracking-[0.18em] uppercase transition-colors"
        >
          {pick(COPY.cta.tertiary, lang)}
          <Phone className="w-4 h-4" strokeWidth={1.6} />
        </Link>
      </div>
    </div>
  </section>
);

const FaqSection = ({ lang }) => (
  <section data-testid="mar-faq" className="relative bg-[#FDFBF7] py-24 md:py-32 border-t border-[#2C2621]/10">
    <div className="max-w-4xl mx-auto px-6 md:px-12">
      <div className="mb-12 md:mb-14">
        <span className="overline inline-flex items-center gap-2 text-[#C16542]">
          <Star className="w-3.5 h-3.5" strokeWidth={1.6} />
          {pick(COPY.faq.overline, lang)}
        </span>
        <h2 className="font-serif-x text-4xl md:text-5xl lg:text-[52px] leading-[1.05] tracking-tight mt-4 text-[#2C2621]">
          {pick(COPY.faq.title, lang)}
        </h2>
      </div>
      <Accordion type="single" collapsible className="w-full">
        {COPY.faq.items.map((item) => (
          <AccordionItem
            key={item.id}
            value={item.id}
            data-testid={`mar-faq-${item.id}`}
            className="border-[#2C2621]/10"
          >
            <AccordionTrigger className="text-left py-5 font-serif-x text-lg md:text-xl text-[#2C2621] hover:no-underline">
              {pick(item.q, lang)}
            </AccordionTrigger>
            <AccordionContent className="text-sm md:text-base text-[#5C5248] leading-relaxed pb-5">
              {pick(item.a, lang)}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  </section>
);

/* ============================================================
   Page
============================================================ */
export default function MoroccoLandingPage() {
  const { lang } = useLanguage();

  useEffect(() => {
    document.title = DOC_TITLES[lang] || DOC_TITLES.es;
  }, [lang]);

  return (
    <div data-testid="mar-page" className="bg-[#FDFBF7]">
      <Hero lang={lang} />
      <Why lang={lang} />
      <Experiences lang={lang} />
      <InteractiveMap lang={lang} />
      <Profiles lang={lang} />
      <Seasons lang={lang} />
      <PopularRoutes lang={lang} />
      <Trust lang={lang} />
      <FinalCta lang={lang} />
      <FaqSection lang={lang} />
    </div>
  );
}
