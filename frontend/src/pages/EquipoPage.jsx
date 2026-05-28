import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Home, ChevronRight, Compass, Sparkles, ArrowRight, ArrowUpRight,
  Hotel, Tent, Car, CalendarCheck, Globe2, Users, Heart, ShieldCheck,
  Phone, Mail, Clock, MapPin,
} from "lucide-react";
import { useLanguage, pick } from "@/contexts/LanguageContext";
import { pathFor } from "@/lib/routes";
import { CONTACT } from "@/lib/data";
import { IMG, banner } from "@/lib/imageBank";
import EditableImage from "@/components/EditableImage";
import { SlotScope } from "@/components/slotScope";

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
};

const ICON_MAP = {
  Hotel, Tent, Car, CalendarCheck, Globe2, Compass, Users, Heart, ShieldCheck, Sparkles,
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
      <span>{pick(COPY.breadcrumb, lang)}</span>
    </Link>
    <ChevronRight className="w-3 h-3 text-[#FDFBF7]/40" strokeWidth={1.6} />
    <span>{pick(COPY.cluster, lang)}</span>
    <ChevronRight className="w-3 h-3 text-[#FDFBF7]/40" strokeWidth={1.6} />
    <span className="text-[#D4A373]">{pick(COPY.current, lang)}</span>
  </nav>
);

const Hero = ({ lang }) => (
  <section data-testid="eq-hero" className="relative h-[100svh] min-h-[640px] w-full overflow-hidden bg-[#1A1513]">
    <EditableImage
      slot="equipo.hero"
      fallback={banner("camelCaravan", 2400)}
      alt=""
      aspectRatio="auto"
      imgProps={{ loading: "eager" }}
      className="ken-burns absolute inset-0 w-full h-full object-cover"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-[#1A1513]/95 via-[#1A1513]/55 to-[#1A1513]/30 pointer-events-none" />
    <div className="absolute inset-0 berber-bg-cross opacity-35 pointer-events-none" aria-hidden="true" />
    <span className="film-grain pointer-events-none" />

    <div className="relative z-10 h-full flex flex-col">
      <div className="pt-[88px] md:pt-[96px] px-6 md:px-12 max-w-7xl mx-auto w-full">
        <InlineBreadcrumb lang={lang} />
      </div>
      <div className="flex-1 flex items-end pb-24 md:pb-32">
        <div className="max-w-7xl mx-auto px-6 md:px-12 w-full">
          <div className="max-w-3xl">
            <div className="fade-up inline-flex items-center gap-3 text-[#D4A373]">
              <Compass className="w-3.5 h-3.5" strokeWidth={1.6} />
              <span className="text-[11px] tracking-[0.35em] uppercase font-semibold">{pick(COPY.hero.eyebrow, lang)}</span>
              <span className="w-8 h-px bg-[#D4A373]/50" />
              <span className="text-[10px] tracking-[0.3em] uppercase text-[#D4A373]/80">{pick(COPY.hero.place, lang)}</span>
            </div>
            <h1 className="fade-up fade-up-delay-1 font-serif-x text-[#FDFBF7] text-5xl md:text-6xl lg:text-7xl leading-[1.02] tracking-tight mt-6">
              {pick(COPY.hero.title, lang)}
            </h1>
            <p className="fade-up fade-up-delay-2 mt-8 max-w-2xl text-base md:text-lg text-[#FDFBF7]/85 leading-relaxed">
              {pick(COPY.hero.subtitle, lang)}
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const Intro = ({ lang }) => (
  <section data-testid="eq-intro" className="relative bg-[#FDFBF7] py-24 md:py-32">
    <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 items-start">
      <div className="md:col-span-5">
        <span className="overline inline-flex items-center gap-2 text-[#C16542]">
          <Sparkles className="w-3.5 h-3.5" strokeWidth={1.6} />
          {pick(COPY.intro.overline, lang)}
        </span>
        <h2 className="font-serif-x text-4xl md:text-5xl lg:text-[52px] leading-[1.06] tracking-tight mt-5 text-[#2C2621]">
          {pick(COPY.intro.title, lang)}
        </h2>
      </div>
      <div className="md:col-span-7 md:pt-2 space-y-5">
        <p className="text-base md:text-lg text-[#5C5248] leading-relaxed">{pick(COPY.intro.p1, lang)}</p>
        <p className="text-base md:text-lg text-[#5C5248] leading-relaxed">{pick(COPY.intro.p2, lang)}</p>
      </div>
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
              {pick(COPY.group.overline, lang)}
            </span>
            <h2 className="font-serif-x text-4xl md:text-5xl lg:text-[52px] leading-[1.05] tracking-tight mt-4 text-[#2C2621]">
              {pick(COPY.group.title, lang)}
            </h2>
          </div>
          <div className="md:col-span-5">
            <p className="text-base md:text-lg text-[#5C5248] leading-relaxed">{pick(COPY.group.body, lang)}</p>
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
                    <h3 className="font-serif-x text-xl md:text-[22px] leading-[1.15] text-[#2C2621]">
                      {pick(p.title, lang)}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-[#5C5248] flex-1">
                      {pick(p.body, lang)}
                    </p>
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
        {pick(COPY.stats.overline, lang)}
      </span>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[#2C2621]/10 border border-[#2C2621]/10 mt-4">
        {COPY.stats.items.map((s) => (
          <div
            key={s.id}
            data-testid={`eq-stat-${s.id}`}
            className="bg-[#FDFBF7] p-7 md:p-9"
          >
            <p className="font-serif-x text-5xl md:text-6xl text-[#C16542] tabular-nums leading-none">{s.value}</p>
            <p className="mt-3 text-xs md:text-sm tracking-[0.22em] uppercase text-[#5C5248]">{pick(s.label, lang)}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const Bridge = ({ lang }) => (
  <section data-testid="eq-bridge" className="relative bg-[#FDFBF7] py-24 md:py-32">
    <div className="max-w-7xl mx-auto px-6 md:px-12">
      <div className="max-w-3xl mb-12 md:mb-16">
        <span className="overline inline-flex items-center gap-2 text-[#C16542]">
          <Globe2 className="w-3.5 h-3.5" strokeWidth={1.6} />
          {pick(COPY.bridge.overline, lang)}
        </span>
        <h2 className="font-serif-x text-4xl md:text-5xl lg:text-[52px] leading-[1.05] tracking-tight mt-4 text-[#2C2621]">
          {pick(COPY.bridge.title, lang)}
        </h2>
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
                <h3 className="font-serif-x text-2xl md:text-[28px] leading-[1.12] text-[#2C2621]">
                  {pick(c.title, lang)}
                </h3>
                <p className="mt-4 text-sm md:text-base leading-relaxed text-[#5C5248]">
                  {pick(c.body, lang)}
                </p>
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
          {pick(COPY.values.overline, lang)}
        </span>
        <h2 className="font-serif-x text-4xl md:text-5xl lg:text-[52px] leading-[1.05] tracking-tight mt-4 text-[#2C2621]">
          {pick(COPY.values.title, lang)}
        </h2>
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
              <h3 className="font-serif-x text-xl md:text-[22px] leading-[1.15] text-[#2C2621] mt-6">
                {pick(v.title, lang)}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[#5C5248] flex-1">
                {pick(v.body, lang)}
              </p>
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
          {pick(COPY.cta.eyebrow, lang)}
        </span>
        <h2 className="font-serif-x text-4xl md:text-5xl lg:text-6xl leading-[1.05] tracking-tight mt-5 text-[#FDFBF7]">
          {pick(COPY.cta.title, lang)}
        </h2>
        <p className="mt-6 text-base md:text-lg text-[#FDFBF7]/80 leading-relaxed">
          {pick(COPY.cta.body, lang)}
        </p>
      </div>

      <div className="mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-3 gap-px bg-[#FDFBF7]/10 border border-[#FDFBF7]/15 max-w-4xl mx-auto">
        <a
          href={`tel:${CONTACT.phoneRaw}`}
          data-testid="eq-contact-phone"
          className="bg-[#1A1513]/70 hover:bg-[#221A16] backdrop-blur-sm p-6 md:p-7 flex items-start gap-4 transition-colors"
        >
          <Phone className="w-5 h-5 text-[#D4A373] mt-1 flex-shrink-0" strokeWidth={1.6} />
          <div>
            <p className="text-[10px] tracking-[0.3em] uppercase text-[#FDFBF7]/55">{pick(COPY.cta.phoneLabel, lang)}</p>
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
            <p className="text-[10px] tracking-[0.3em] uppercase text-[#FDFBF7]/55">{pick(COPY.cta.emailLabel, lang)}</p>
            <p className="mt-1 text-base text-[#FDFBF7] break-all">{CONTACT.email}</p>
          </div>
        </a>
        <div
          data-testid="eq-contact-hours"
          className="bg-[#1A1513]/70 backdrop-blur-sm p-6 md:p-7 flex items-start gap-4"
        >
          <Clock className="w-5 h-5 text-[#D4A373] mt-1 flex-shrink-0" strokeWidth={1.6} />
          <div>
            <p className="text-[10px] tracking-[0.3em] uppercase text-[#FDFBF7]/55">{pick(COPY.cta.hoursLabel, lang)}</p>
            <p className="mt-1 text-base text-[#FDFBF7]">{pick(COPY.cta.hours, lang)}</p>
          </div>
        </div>
      </div>

      <div className="mt-10 flex flex-wrap gap-4 justify-center">
        <Link
          to={pathFor(lang, "planTrip")}
          data-testid="eq-cta-plan"
          className="inline-flex items-center gap-2 bg-[#C16542] hover:bg-[#A8533A] text-[#FDFBF7] px-7 py-3.5 text-sm tracking-[0.18em] uppercase transition-colors"
        >
          {pick(COPY.cta.planCta, lang)}
          <ArrowRight className="w-4 h-4" strokeWidth={1.6} />
        </Link>
        <Link
          to={pathFor(lang, "contact")}
          data-testid="eq-cta-contact"
          className="inline-flex items-center gap-2 border border-[#FDFBF7]/40 hover:border-[#D4A373] hover:text-[#D4A373] text-[#FDFBF7] px-7 py-3.5 text-sm tracking-[0.18em] uppercase transition-colors"
        >
          {pick(COPY.cta.contactCta, lang)}
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

  useEffect(() => {
    document.title = DOC_TITLES[lang] || DOC_TITLES.es;
  }, [lang]);

  return (
    <div data-testid="eq-page" className="bg-[#FDFBF7]">
      <Hero lang={lang} />
      <Intro lang={lang} />
      <Stats lang={lang} />
      <GroupPillars lang={lang} />
      <Bridge lang={lang} />
      <Values lang={lang} />
      <FinalCta lang={lang} />
    </div>
  );
}
