import React, { useEffect } from "react";
import EditableImage from "@/components/EditableImage";
import { Link } from "react-router-dom";
import {
  ArrowRight, Compass, Heart, Users, Sparkles, Baby, Activity,
  Bike, Mountain, Snowflake, Anchor, Wind, Waves, Footprints, Mountain as Climb,
} from "lucide-react";
import { useLanguage, pick } from "@/contexts/LanguageContext";
import { pathFor } from "@/lib/routes";
import {
  JourneyHero,
  StickyNav,
  EditorialBlock,
  CommunityCta,
} from "@/components/JourneyPageSections";
import ContactForm from "@/components/ContactForm";
import Testimonials from "@/components/Testimonials";

const TRIP_ICONS = { Compass, Heart, Users, Sparkles, Baby, Activity };

/* ============================================================
   Six personalised trip types
============================================================ */
const TRIP_TYPES = [
  {
    id: "aventura",
    icon: "Compass",
    accent: "#C16542",
    image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1800&q=85",
    title: { es: "Viaje de aventura", en: "Adventure trip", fr: "Voyage d'aventure" },
    body: {
      es: "Si eres un explorador, este es tu viaje. Descubre nómadas que todavía viven en cuevas en el Alto Atlas, poblados perdidos entre las dunas del Erg Chebbi, canteras de fósiles, gargantas inmensas y mercados ancestrales. Una experiencia diseñada para quienes buscan aventura, autenticidad y paisajes extremos.",
      en: "If you're an explorer, this is your journey. Discover nomads still living in caves of the High Atlas, lost villages amid the Erg Chebbi dunes, fossil quarries, vast gorges and ancestral markets. An experience designed for those who seek adventure, authenticity and extreme landscapes.",
      fr: "Si vous êtes un explorateur, c'est votre voyage. Découvrez des nomades qui vivent encore dans les grottes du Haut Atlas, des villages perdus dans les dunes de l'Erg Chebbi, des carrières de fossiles, des gorges immenses et des marchés ancestraux. Une expérience conçue pour ceux qui recherchent aventure, authenticité et paysages extrêmes.",
    },
  },
  {
    id: "pareja",
    icon: "Heart",
    accent: "#D4A373",
    image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1800&q=85",
    title: { es: "Viaje en pareja", en: "Couples journey", fr: "Voyage en couple" },
    body: {
      es: "Una cena romántica bajo un cielo lleno de estrellas. Un hammam en pareja para relajarse, un té a la menta mientras contempláis la puesta de sol y cientos de momentos mágicos que convertirán vuestro viaje en una experiencia inolvidable.",
      en: "A romantic dinner under a sky full of stars. A couple's hammam to unwind, mint tea while watching the sunset and hundreds of magical moments that will make your trip unforgettable.",
      fr: "Un dîner romantique sous un ciel étoilé. Un hammam en couple pour se détendre, un thé à la menthe au coucher du soleil et des centaines d'instants magiques qui rendront votre voyage inoubliable.",
    },
  },
  {
    id: "grupo",
    icon: "Users",
    accent: "#3A4A5F",
    image: "https://images.unsplash.com/photo-1547234935-80c7145ec969?auto=format&fit=crop&w=1800&q=85",
    title: { es: "Viaje en grupo", en: "Group trip", fr: "Voyage en groupe" },
    body: {
      es: "¿Sois un grupo y queréis vivir una gran aventura juntos? Disponemos de rutas especialmente diseñadas para grupos, incluyendo experiencias organizadas, actividades privadas y atención personalizada para que solo tengáis que preocuparos de disfrutar del viaje. Ideal para grupos de amigos, incentivos, celebraciones o viajes organizados.",
      en: "Travelling in a group and want a great adventure together? We design dedicated group routes — organised experiences, private activities and personalised attention so all you need to do is enjoy. Ideal for friend groups, incentives, celebrations or organised trips.",
      fr: "Vous voyagez en groupe et cherchez une grande aventure ensemble ? Nous concevons des itinéraires dédiés — expériences organisées, activités privées et attention personnalisée pour que vous n'ayez qu'à profiter. Idéal pour groupes d'amis, incentives, célébrations ou voyages organisés.",
    },
  },
  {
    id: "amigos",
    icon: "Sparkles",
    accent: "#A07042",
    image: "https://images.unsplash.com/photo-1542401886-65d6c61db217?auto=format&fit=crop&w=1800&q=85",
    title: { es: "Viaje con amigos", en: "Friends trip", fr: "Voyage entre amis" },
    body: {
      es: "Una escapada diferente para descubrir el Marruecos más auténtico junto a tus amigos. Viajes dinámicos, multiaventura y llenos de experiencias para que no exista ni un solo momento de aburrimiento. Desierto, rutas 4x4, actividades, campamentos y experiencias locales combinadas en un viaje inolvidable.",
      en: "A different escape to discover the most authentic Morocco with your friends. Dynamic, multi-adventure trips packed with experiences so there isn't a single dull moment. Desert, 4x4 routes, activities, camps and local experiences blended into one unforgettable trip.",
      fr: "Une escapade différente pour découvrir le Maroc le plus authentique entre amis. Voyages dynamiques, multi-aventure et remplis d'expériences pour qu'aucun instant ne soit ennuyeux. Désert, 4x4, activités, campements et expériences locales pour un voyage inoubliable.",
    },
  },
  {
    id: "familia",
    icon: "Baby",
    accent: "#7C8B5C",
    image: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=1800&q=85",
    title: { es: "Viaje en familia", en: "Family trip", fr: "Voyage en famille" },
    body: {
      es: "Marruecos es un destino ideal para viajar en familia, incluso con niños. Es una experiencia profundamente enriquecedora para descubrir nuevas culturas, tradiciones y formas de vida. Los más pequeños podrán vivir aventuras únicas como paseos en dromedario, rutas en mula, excursiones en quad o noches en campamentos del desierto.",
      en: "Morocco is an ideal destination for family travel — even with children. It's a deeply enriching experience to discover new cultures, traditions and ways of life. The little ones get unique adventures: camel rides, mule treks, quad excursions or nights in desert camps.",
      fr: "Le Maroc est une destination idéale pour voyager en famille, même avec des enfants. Une expérience profondément enrichissante pour découvrir nouvelles cultures, traditions et modes de vie. Les plus petits vivront des aventures uniques : balades à dromadaire, randonnées à dos de mule, excursions en quad ou nuits dans des campements du désert.",
    },
  },
  {
    id: "deportivo",
    icon: "Activity",
    accent: "#5A6B4F",
    image: "https://images.unsplash.com/photo-1542401886-65d6c61db217?auto=format&fit=crop&w=1800&q=85",
    title: { es: "Viaje deportivo", en: "Sport trip", fr: "Voyage sportif" },
    body: {
      es: "Marruecos es el lugar perfecto para practicar deporte y aventura. Diseñamos viajes alrededor de las disciplinas que te apasionan: BTT, trekking, senderismo, esquí, equitación, escalada, espeleología, surf, windsurf y kitesurf.",
      en: "Morocco is the perfect place to practise sport and adventure. We craft trips around the disciplines you love: MTB, trekking, hiking, skiing, horse riding, climbing, caving, surf, windsurf and kitesurf.",
      fr: "Le Maroc est l'endroit parfait pour pratiquer sport et aventure. Nous concevons des voyages autour des disciplines qui vous passionnent : VTT, trekking, randonnée, ski, équitation, escalade, spéléologie, surf, windsurf et kitesurf.",
    },
  },
];

const SPORTS = [
  { id: "btt",        icon: Bike,        label: { es: "BTT",         en: "MTB",          fr: "VTT" } },
  { id: "trekking",   icon: Mountain,    label: { es: "Trekking",    en: "Trekking",     fr: "Trekking" } },
  { id: "senderismo", icon: Footprints,  label: { es: "Senderismo",  en: "Hiking",       fr: "Randonnée" } },
  { id: "esqui",      icon: Snowflake,   label: { es: "Esquí",       en: "Skiing",       fr: "Ski" } },
  { id: "equitacion", icon: Compass,     label: { es: "Equitación",  en: "Horse riding", fr: "Équitation" } },
  { id: "escalada",   icon: Climb,       label: { es: "Escalada",    en: "Climbing",     fr: "Escalade" } },
  { id: "espeleo",    icon: Anchor,      label: { es: "Espeleología",en: "Caving",       fr: "Spéléologie" } },
  { id: "surf",       icon: Waves,       label: { es: "Surf",        en: "Surf",         fr: "Surf" } },
  { id: "windsurf",   icon: Wind,        label: { es: "Windsurf",    en: "Windsurf",     fr: "Windsurf" } },
  { id: "kitesurf",   icon: Wind,        label: { es: "Kitesurf",    en: "Kitesurf",     fr: "Kitesurf" } },
];

/* ============================================================
   Editorial: experience designed from the local team
============================================================ */
const EXPERIENCE_EDITORIAL = {
  id: "experiencia",
  image: "https://images.unsplash.com/photo-1570133435536-7ececf000ef6?auto=format&fit=crop&w=2200&q=85",
  eyebrow: { es: "Experiencia personalizada", en: "Personalised experience", fr: "Expérience personnalisée" },
  title: {
    es: "Diseñado desde Marruecos, para ti.",
    en: "Designed from Morocco, for you.",
    fr: "Conçu depuis le Maroc, pour vous.",
  },
  body: {
    es: [
      "Cada viaje a medida de Xaluca Tours se diseña desde la experiencia real de nuestro equipo local en Marruecos.",
      "Conocemos cada kasbah, cada palmeral y cada familia que abre las puertas de su casa al viajero.",
      "Nuestra mirada es auténtica y profundamente humana — no replicamos itinerarios genéricos, los componemos contigo desde el primer kilómetro.",
    ],
    en: [
      "Every tailor-made Xaluca Tours journey is built on the real experience of our local team in Morocco.",
      "We know every kasbah, every palm grove and every family who opens their home to travellers.",
      "Our gaze is authentic and deeply human — we don't replicate generic itineraries, we compose them with you from the first kilometre.",
    ],
    fr: [
      "Chaque voyage sur mesure de Xaluca Tours est conçu à partir de l'expérience réelle de notre équipe locale au Maroc.",
      "Nous connaissons chaque kasbah, chaque palmeraie et chaque famille qui ouvre sa porte aux voyageurs.",
      "Notre regard est authentique et profondément humain — nous ne reproduisons pas d'itinéraires génériques, nous les composons avec vous dès le premier kilomètre.",
    ],
  },
};

/* ============================================================
   Trilingual copy
============================================================ */
const COPY = {
  es: {
    docTitle: "Viajes a medida por Marruecos · Xaluca Tours",
    hero: {
      eyebrow: "Viajes a Marruecos · A medida",
      place: "Diseña tu viaje único",
      title: "Viajes a medida por Marruecos.",
      subtitle: "Diseña una experiencia completamente personalizada para descubrir Marruecos a tu manera.",
      intro: "Desde aventuras por el Sahara hasta escapadas culturales, viajes románticos, rutas deportivas o experiencias familiares — cada itinerario se adapta totalmente a tus necesidades, intereses y ritmo de viaje.",
      primaryCta: "Ver tipos de viaje", secondaryCta: "Crear mi viaje", scroll: "Desplázate",
    },
    nav: {
      types: "Tipos de viaje",
      sports: "Deportivo",
      process: "Cómo lo creamos",
      experience: "Experiencia Xaluca",
      community: "Contacto",
    },
    types: {
      overline: "Tipos de viajes personalizados",
      title: "No existen dos viajes iguales.",
      body: "Cada experiencia se construye de forma única junto al viajero. Elige el punto de partida — el resto lo diseñamos juntos.",
      cta: "Solicitar este viaje",
    },
    sports: {
      overline: "Disciplinas",
      title: "Diez deportes, una geografía perfecta.",
      body: "Del kitesurf en Essaouira al BTT por el Atlas, pasando por la espeleología en las cuevas del Anti-Atlas — diseñamos tu viaje alrededor de la disciplina que más te apasiona.",
    },
    process: {
      overline: "Crea tu viaje a medida",
      title: "Tres pasos para empezar tu aventura.",
      body: "Planifica tu próxima aventura por Marruecos y resuelve todas tus dudas directamente con nuestros agentes especializados.",
      steps: [
        {
          n: "01",
          tag: "Paso 1",
          title: "Planifica tu próxima aventura",
          body: "Visita nuestra sección de viajes y descubre todas las opciones disponibles. Cualquier duda podrá resolverse a través de sesiones informativas online con uno de nuestros asesores o visitándonos en nuestras oficinas de Sabadell, Barcelona.",
        },
        {
          n: "02",
          tag: "Paso 2",
          title: "Selecciona día y hora",
          body: "Las sesiones se realizan online o presencialmente en nuestras oficinas de la Calle Latorre 52 de Sabadell, Barcelona. Elige fácilmente el día y la hora que mejor se adapten a tu agenda.",
        },
        {
          n: "03",
          tag: "Paso 3",
          title: "Confirma la sesión",
          body: "Para confirmar la sesión, solo deberás añadir tu nombre completo, correo electrónico, teléfono y la fecha y hora deseadas. Del resto se encarga el equipo de Xaluca Tours.",
        },
      ],
      cta_primary: "Pedir cita previa",
      cta_secondary: "Rellenar formulario",
    },
    community: {
      overline: "Contacto",
      title: "¿Te interesan nuestros viajes?",
      subtitle: "Sin ningún compromiso — rellena el formulario, solicita una cita previa o reserva una sesión informativa.",
      body: "Si deseas disfrutar de la mejor experiencia en Marruecos, contacta con Xaluca Tours y descubre la mejor forma de organizar tu viaje.",
      phone_label: "Teléfono", email_label: "Email", hours_label: "Horario",
      hours_value: "Lun – Vie · 10h – 20h",
      cta_primary: "Crear mi viaje",
    },
  },
  en: {
    docTitle: "Tailor-made Morocco trips · Xaluca Tours",
    hero: {
      eyebrow: "Morocco travel · Tailor-made",
      place: "Design your unique journey",
      title: "Tailor-made Morocco journeys.",
      subtitle: "Design a fully personalised experience to discover Morocco your way.",
      intro: "From Saharan adventures to cultural escapes, romantic getaways, sport routes or family experiences — every itinerary adapts completely to your needs, interests and travel pace.",
      primaryCta: "View trip types", secondaryCta: "Create my trip", scroll: "Scroll",
    },
    nav: {
      types: "Trip types",
      sports: "Sport",
      process: "How we build it",
      experience: "Xaluca experience",
      community: "Contact",
    },
    types: {
      overline: "Personalised trip types",
      title: "No two trips are alike.",
      body: "Each experience is uniquely built with the traveller. Pick the starting point — we design the rest together.",
      cta: "Request this trip",
    },
    sports: {
      overline: "Disciplines",
      title: "Ten sports, one perfect geography.",
      body: "From kitesurf in Essaouira to MTB across the Atlas, by way of caving in the Anti-Atlas — we design your journey around the discipline you love most.",
    },
    process: {
      overline: "Create your tailor-made trip",
      title: "Three steps to start your adventure.",
      body: "Plan your next Moroccan adventure and resolve every question with our specialised agents.",
      steps: [
        {
          n: "01",
          tag: "Step 1",
          title: "Plan your next adventure",
          body: "Visit our trips section and explore every option. Any question can be answered through an online session with one of our advisors or by visiting our offices in Sabadell, Barcelona.",
        },
        {
          n: "02",
          tag: "Step 2",
          title: "Pick your day and time",
          body: "Sessions take place online or in person at our offices on Calle Latorre 52, Sabadell, Barcelona. Easily pick the day and time that fit your schedule.",
        },
        {
          n: "03",
          tag: "Step 3",
          title: "Confirm the session",
          body: "To confirm the session you only need to share your full name, email, phone and the desired day and time. The Xaluca Tours team takes care of the rest.",
        },
      ],
      cta_primary: "Book appointment",
      cta_secondary: "Fill the form",
    },
    community: {
      overline: "Contact",
      title: "Interested in our trips?",
      subtitle: "No commitment — fill out the form, request an appointment or book an info session.",
      body: "If you want the best Moroccan experience, get in touch with Xaluca Tours and discover the best way to organise your trip.",
      phone_label: "Phone", email_label: "Email", hours_label: "Hours",
      hours_value: "Mon – Fri · 10:00 – 20:00",
      cta_primary: "Create my trip",
    },
  },
  fr: {
    docTitle: "Voyages sur mesure au Maroc · Xaluca Tours",
    hero: {
      eyebrow: "Voyage au Maroc · Sur mesure",
      place: "Concevez votre voyage unique",
      title: "Voyages au Maroc sur mesure.",
      subtitle: "Concevez une expérience entièrement personnalisée pour découvrir le Maroc à votre façon.",
      intro: "Des aventures sahariennes aux escapades culturelles, voyages romantiques, routes sportives ou expériences en famille — chaque itinéraire s'adapte totalement à vos besoins, vos centres d'intérêt et votre rythme.",
      primaryCta: "Voir les types de voyage", secondaryCta: "Créer mon voyage", scroll: "Faites défiler",
    },
    nav: {
      types: "Types de voyage",
      sports: "Sportif",
      process: "Comment on le crée",
      experience: "Expérience Xaluca",
      community: "Contact",
    },
    types: {
      overline: "Types de voyages personnalisés",
      title: "Aucun voyage n'est identique.",
      body: "Chaque expérience est conçue uniquement avec le voyageur. Choisissez le point de départ — nous composons le reste ensemble.",
      cta: "Demander ce voyage",
    },
    sports: {
      overline: "Disciplines",
      title: "Dix sports, une géographie parfaite.",
      body: "Du kitesurf à Essaouira au VTT à travers l'Atlas, en passant par la spéléologie dans l'Anti-Atlas — nous concevons votre voyage autour de la discipline qui vous passionne.",
    },
    process: {
      overline: "Créez votre voyage sur mesure",
      title: "Trois étapes pour commencer votre aventure.",
      body: "Planifiez votre prochaine aventure au Maroc et levez tous vos doutes avec nos agents spécialisés.",
      steps: [
        {
          n: "01",
          tag: "Étape 1",
          title: "Planifiez votre prochaine aventure",
          body: "Consultez notre section voyages et explorez toutes les options. Toute question peut être résolue via une session en ligne avec l'un de nos conseillers ou en visitant nos bureaux à Sabadell, Barcelone.",
        },
        {
          n: "02",
          tag: "Étape 2",
          title: "Choisissez jour et heure",
          body: "Les sessions se déroulent en ligne ou sur place dans nos bureaux du Calle Latorre 52, Sabadell, Barcelone. Choisissez facilement le jour et l'heure qui conviennent à votre agenda.",
        },
        {
          n: "03",
          tag: "Étape 3",
          title: "Confirmez la session",
          body: "Pour confirmer, il suffit d'indiquer votre nom complet, email, téléphone et la date / heure souhaitées. L'équipe Xaluca Tours s'occupe du reste.",
        },
      ],
      cta_primary: "Prendre rendez-vous",
      cta_secondary: "Remplir le formulaire",
    },
    community: {
      overline: "Contact",
      title: "Nos voyages vous intéressent ?",
      subtitle: "Sans engagement — remplissez le formulaire, demandez un rendez-vous ou réservez une session d'information.",
      body: "Pour vivre la meilleure expérience au Maroc, contactez Xaluca Tours et découvrez la meilleure façon d'organiser votre voyage.",
      phone_label: "Téléphone", email_label: "Email", hours_label: "Horaires",
      hours_value: "Lun – Ven · 10h – 20h",
      cta_primary: "Créer mon voyage",
    },
  },
};

/* ============================================================
   Sections
============================================================ */
const TripTypesGrid = ({ t, lang }) => (
  <section
    id="types"
    data-testid="bespoke-types"
    className="relative bg-[#FDFBF7] py-24 md:py-32 overflow-hidden"
  >
    <div className="absolute inset-0 berber-bg-diamond opacity-20 pointer-events-none" aria-hidden="true" />
    <div className="relative max-w-7xl mx-auto px-6 md:px-12">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end mb-14">
        <div className="md:col-span-7">
          <span className="overline">{t.overline}</span>
          <h2 className="font-serif-x text-4xl md:text-5xl lg:text-[54px] leading-[1.05] tracking-tight mt-5 text-[#2C2621]">
            {t.title}
          </h2>
        </div>
        <div className="md:col-span-5">
          <p className="text-base md:text-lg text-[#5C5248] leading-relaxed">{t.body}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[#2C2621]/10 border border-[#2C2621]/10">
        {TRIP_TYPES.map((tt) => {
          const Icon = TRIP_ICONS[tt.icon] || Compass;
          return (
            <article
              key={tt.id}
              data-testid={`bespoke-type-${tt.id}`}
              className="group relative bg-[#FDFBF7] hover:bg-[#F2EBE1] transition-colors duration-500 flex flex-col overflow-hidden"
            >
              <div className="relative aspect-[5/4] overflow-hidden bg-[#1A1513]">
                <EditableImage
                  slot={`bespoke.type.${tt.id}.image`}
                  fallback={tt.image}
                  alt={pick(tt.title, lang)}
                  aspectRatio="5/4"
                  imgProps={{ loading: "lazy" }}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.06]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1513]/85 via-[#1A1513]/30 to-transparent pointer-events-none" />
                <span
                  className="absolute top-4 left-4 inline-flex items-center justify-center w-12 h-12 rounded-full border bg-[#FDFBF7]/95 backdrop-blur-sm"
                  style={{ borderColor: `${tt.accent}66`, color: tt.accent }}
                >
                  <Icon className="w-5 h-5" strokeWidth={1.5} />
                </span>
              </div>
              <div className="p-6 md:p-7 flex flex-col flex-1">
                <h3 className="font-serif-x text-2xl md:text-[26px] leading-[1.1] text-[#2C2621]">
                  {pick(tt.title, lang)}
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-[#5C5248] flex-1">
                  {pick(tt.body, lang)}
                </p>
                <Link
                  to={pathFor(lang, "contact")}
                  data-testid={`bespoke-type-cta-${tt.id}`}
                  className="mt-6 inline-flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase border-b pb-1 self-start group-hover:gap-3 transition-all duration-300"
                  style={{ borderColor: `${tt.accent}66`, color: tt.accent }}
                >
                  {t.cta}
                  <ArrowRight className="w-3 h-3" strokeWidth={1.5} />
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  </section>
);

const SportsGrid = ({ t, lang }) => (
  <section
    id="sports"
    data-testid="bespoke-sports"
    className="relative bg-[#1A1513] text-[#FDFBF7] py-24 md:py-32 overflow-hidden"
  >
    <div className="absolute inset-0 berber-bg-cross opacity-40" aria-hidden="true" />
    <span className="film-grain" />
    <div className="relative max-w-7xl mx-auto px-6 md:px-12">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end mb-14">
        <div className="md:col-span-7">
          <span className="overline text-[#D4A373]">{t.overline}</span>
          <h2 className="font-serif-x text-4xl md:text-5xl lg:text-[54px] leading-[1.05] tracking-tight mt-5">
            {t.title}
          </h2>
        </div>
        <div className="md:col-span-5">
          <p className="text-base md:text-lg text-[#FDFBF7]/75 leading-relaxed">{t.body}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-px bg-[#FDFBF7]/10 border border-[#FDFBF7]/15">
        {SPORTS.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.id}
              data-testid={`bespoke-sport-${s.id}`}
              className="bg-[#1A1513] hover:bg-[#221A16] transition-colors duration-300 p-5 md:p-7 flex flex-col items-center gap-3 text-center"
            >
              <span className="inline-flex items-center justify-center w-12 h-12 rounded-full border border-[#D4A373]/60 text-[#D4A373]">
                <Icon className="w-5 h-5" strokeWidth={1.5} />
              </span>
              <span className="font-serif-x text-base md:text-lg text-[#FDFBF7]">
                {pick(s.label, lang)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  </section>
);

const ProcessTimeline = ({ t, lang }) => (
  <section
    id="process"
    data-testid="bespoke-process"
    className="relative bg-[#F2EBE1] py-24 md:py-32 overflow-hidden"
  >
    <div className="absolute inset-0 berber-bg-diamond opacity-35" aria-hidden="true" />
    <div className="relative max-w-7xl mx-auto px-6 md:px-12">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end mb-14">
        <div className="md:col-span-7">
          <span className="overline">{t.overline}</span>
          <h2 className="font-serif-x text-4xl md:text-5xl lg:text-[54px] leading-[1.05] tracking-tight mt-5 text-[#2C2621]">
            {t.title}
          </h2>
        </div>
        <div className="md:col-span-5">
          <p className="text-base md:text-lg text-[#5C5248] leading-relaxed">{t.body}</p>
        </div>
      </div>

      <ol className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#2C2621]/10 border border-[#2C2621]/10">
        {t.steps.map((s, i) => (
          <li
            key={s.n}
            data-testid={`bespoke-step-${i + 1}`}
            className="relative bg-[#FDFBF7] p-7 md:p-9 flex flex-col gap-5"
          >
            <span className="font-serif-x text-6xl md:text-7xl leading-none text-[#C16542]/85">
              {s.n}
            </span>
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#5C5248]">
              {s.tag}
            </span>
            <h3 className="font-serif-x text-2xl md:text-[26px] leading-[1.1] text-[#2C2621]">
              {s.title}
            </h3>
            <p className="text-sm leading-relaxed text-[#5C5248]">{s.body}</p>
          </li>
        ))}
      </ol>

      <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
        <Link
          to={pathFor(lang, "appointment")}
          data-testid="bespoke-process-cta-primary"
          className="inline-flex items-center gap-3 bg-[#C16542] hover:bg-[#A35133] text-[#FDFBF7] px-8 py-4 text-[11px] tracking-[0.25em] uppercase transition-colors"
        >
          {t.cta_primary}
          <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.6} />
        </Link>
        <Link
          to={pathFor(lang, "contact")}
          data-testid="bespoke-process-cta-secondary"
          className="inline-flex items-center gap-3 border border-[#2C2621]/25 hover:border-[#2C2621] hover:bg-[#2C2621] hover:text-[#FDFBF7] text-[#2C2621] px-7 py-4 text-[11px] tracking-[0.25em] uppercase transition-all duration-300"
        >
          {t.cta_secondary}
        </Link>
      </div>
    </div>
  </section>
);

/* ============================================================
   Page
============================================================ */
export default function ViajesAMedidaPage() {
  const { lang } = useLanguage();
  const t = COPY[lang] || COPY.es;

  useEffect(() => {
    document.title = t.docTitle;
    window.scrollTo(0, 0);
  }, [t.docTitle]);

  const navItems = [
    { id: "types",      label: t.nav.types },
    { id: "sports",     label: t.nav.sports },
    { id: "process",    label: t.nav.process },
    { id: "experiencia",label: t.nav.experience },
    { id: "community",  label: t.nav.community },
  ];

  return (
    <div data-testid="bespoke-page">
      <JourneyHero
        image="https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=2400&q=85"
        eyebrow={t.hero.eyebrow}
        place={t.hero.place}
        title={t.hero.title}
        subtitle={t.hero.subtitle}
        intro={t.hero.intro}
        primaryCta={t.hero.primaryCta}
        primaryHref="#types"
        secondaryCta={t.hero.secondaryCta}
        secondaryHref="#process"
        scroll={t.hero.scroll}
        testid="bespoke-hero"
      />

      <StickyNav items={navItems} testid="bespoke-nav" />

      <TripTypesGrid t={t.types} lang={lang} />

      <SportsGrid t={t.sports} lang={lang} />

      <ProcessTimeline t={t.process} lang={lang} />

      <EditorialBlock block={EXPERIENCE_EDITORIAL} lang={lang} />

      <Testimonials
        themes={["bespoke", "marruecos"]}
        limit={3}
        tone="sand"
        testid="bespoke-testimonials"
      />

      <CommunityCta
        t={t.community}
        lang={lang}
        image="https://images.unsplash.com/photo-1542401886-65d6c61db217?auto=format&fit=crop&w=2400&q=85"
        testid="bespoke-community"
      />

      <ContactForm />
    </div>
  );
}
