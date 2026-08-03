import SectionNav from "@/components/SectionNav";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Home, ChevronRight, Compass, Sparkles, ArrowRight, ArrowUpRight,
  BedDouble, Users, Clock, Wand2, ShieldCheck, BadgeCheck,
  Phone, Mail, MapPin, Quote, Heart, Briefcase, Route,
} from "lucide-react";
import { useLanguage, pick } from "@/contexts/LanguageContext";
import { pathFor } from "@/lib/routes";
import { CONTACT } from "@/lib/data";
import { IMG, banner } from "@/lib/imageBank";
import { TESTIMONIALS } from "@/lib/testimonials";
import EditableImage from "@/components/EditableImage";
import HeroMonogram from "@/components/HeroMonogram";
import CardBrandOverlay from "@/components/CardBrandOverlay";
import { SlotScope } from "@/components/slotScope";

const DOC_TITLES = {
  es: "Qué hacemos · Xaluca Tours",
  en: "What we do · Xaluca Tours",
  fr: "Ce que nous faisons · Xaluca Tours",
};

const COPY = {
  breadcrumb: { es: "Inicio", en: "Home", fr: "Accueil" },
  cluster:    { es: "Sobre nosotros", en: "About us", fr: "À propos" },
  current:    { es: "Qué hacemos", en: "What we do", fr: "Ce que nous faisons" },
  hero: {
    eyebrow: { es: "Lo que hacemos por ti", en: "What we do for you", fr: "Ce que nous faisons pour vous" },
    place:   { es: "Xaluca Tours · Marruecos a medida", en: "Xaluca Tours · Made-to-measure Morocco", fr: "Xaluca Tours · Maroc sur mesure" },
    title: {
      es: "Marruecos tiene mucho que descubrir — y nosotros, mucho que organizarte.",
      en: "Morocco has plenty to discover — and we have plenty to organise for you.",
      fr: "Le Maroc a beaucoup à découvrir — et nous, beaucoup à organiser pour vous.",
    },
    subtitle: {
      es: "Diseñamos viajes en privado a medida del viajero: solos, en familia, con amigos, empresas, incentivos y temáticos. El abanico es amplio — la propuesta, exclusivamente tuya.",
      en: "We design private, tailor-made journeys for every traveller: solo, family, groups of friends, companies, incentives and themed trips. The range is wide — the proposal is yours alone.",
      fr: "Nous concevons des voyages privés sur mesure : en solo, en famille, entre amis, pour les entreprises, les incentives ou les voyages thématiques. L'éventail est large — la proposition est uniquement la vôtre.",
    },
  },
  intro: {
    overline: { es: "Nuestra forma de viajar", en: "How we travel", fr: "Notre façon de voyager" },
    title: {
      es: "Cada viaje es un traje a medida.",
      en: "Every trip is a bespoke suit.",
      fr: "Chaque voyage est un costume sur mesure.",
    },
    p1: {
      es: "Marruecos es un país que tiene mucho por descubrir y se adapta perfectamente a todos los perfiles de viajeros. Organizamos viajes personalizados en privado para viajeros que quieren descubrir Marruecos en solitario, familias con niños de todas las edades, grupos de amigos, empresas, incentivos, viajes temáticos, de motor, de relax… El abanico de opciones es amplio, por lo que nuestro equipo te hará llegar la propuesta más adaptada a tus necesidades y estará a tu disposición para facilitarte toda la información que necesites.",
      en: "Morocco has a great deal to discover and adapts perfectly to every traveller profile. We organise private, custom journeys for solo travellers, families with children of all ages, groups of friends, companies, incentives, themed trips, motoring routes, wellness escapes… The range of options is wide, so our team will craft the proposal best suited to your needs and remain at your side for any information you require.",
      fr: "Le Maroc a énormément à offrir et s'adapte parfaitement à tous les profils de voyageurs. Nous organisons des voyages privés et personnalisés pour les voyageurs en solo, les familles avec enfants de tous âges, les groupes d'amis, les entreprises, les incentives, les voyages thématiques, motorisés, de bien-être… L'éventail d'options est large, et notre équipe vous transmettra la proposition la mieux adaptée à vos besoins.",
    },
    p2: {
      es: "En las Propuestas de Circuitos encontrarás ideas que nos servirán de punto de partida y que adaptaremos a fechas y necesidades concretas. En Próximas Salidas verás circuitos con fechas cerradas y salidas en grupo: Fin de Año, Semana Santa, verano y otras épocas señaladas.",
      en: "In our Trip Proposals you'll find ideas that serve as a starting point — to be adapted to your dates and needs. In Upcoming Departures you'll see circuits with fixed dates and group departures: New Year's Eve, Easter, summer and other key seasons.",
      fr: "Dans nos Propositions de Circuits, vous trouverez des idées qui serviront de point de départ et que nous adapterons à vos dates et besoins. Dans Prochains Départs, vous verrez des circuits aux dates fixes et départs en groupe : Nouvel An, Semaine Sainte, été et autres périodes phares.",
    },
    proposalsCta: { es: "Ver propuestas de circuitos", en: "See trip proposals", fr: "Voir les propositions de circuits" },
    upcomingCta:  { es: "Ver próximas salidas",       en: "See upcoming departures", fr: "Voir les prochains départs" },
  },
  trips: {
    overline: { es: "Cómo son nuestros viajes", en: "What our trips are like", fr: "Comment sont nos voyages" },
    title: {
      es: "Tres pilares que definen un viaje Xaluca.",
      en: "Three pillars that define a Xaluca trip.",
      fr: "Trois piliers qui définissent un voyage Xaluca.",
    },
    pillars: [
      {
        id: "experiencias",
        icon: "Sparkles",
        image: IMG.dunes,
        title: { es: "Experiencias únicas", en: "Unique experiences", fr: "Expériences uniques" },
        body: {
          es: "Ofrecemos rutas por Marruecos donde aventura, cultura, diversidad, relax y exotismo se complementan de forma armónica y fluida. Cuidamos cada detalle para que regreséis a casa con una experiencia única y especial.",
          en: "We craft routes across Morocco where adventure, culture, diversity, relaxation and exoticism flow together harmoniously. We look after every detail so you return home with an experience that's truly unique.",
          fr: "Nous proposons des itinéraires marocains où aventure, culture, diversité, détente et exotisme se complètent harmonieusement. Nous soignons chaque détail pour que vous rentriez avec une expérience véritablement unique.",
        },
      },
      {
        id: "alojamientos",
        icon: "BedDouble",
        image: IMG.riadFountain,
        title: { es: "Alojamientos singulares", en: "Distinctive accommodation", fr: "Hébergements singuliers" },
        body: {
          es: "Los alojamientos que proponemos son siempre lugares que conocemos personalmente, que cumplen con las exigencias de nuestros clientes y que tienen un toque diferente: adaptado al país, a sus sistemas de construcción, decoración y costumbres.",
          en: "Every stay we propose is a place we know personally — meeting our clients' standards with a distinctive touch grounded in Morocco's architecture, craftsmanship and customs.",
          fr: "Tous les hébergements que nous proposons sont des lieux que nous connaissons personnellement, à la hauteur des exigences de nos clients, avec une touche unique ancrée dans l'architecture, l'artisanat et les coutumes du Maroc.",
        },
      },
      {
        id: "equipo",
        icon: "Users",
        image: IMG.camelCaravan,
        title: { es: "Equipo humano local", en: "Local human team", fr: "Équipe humaine locale" },
        body: {
          es: "Los conductores que os acompañarán son personas locales que compartirán, si os apetece, su forma de vivir, anécdotas y costumbres. Además, podréis ampliar la información de ciudades y medinas con guías locales para no perderos ningún detalle de su historia y cultura.",
          en: "The drivers travelling with you are locals — happy, if you're interested, to share their way of life, stories and customs. You can also expand your time in cities and medinas with local guides so no detail of history or culture goes unnoticed.",
          fr: "Les chauffeurs qui vous accompagneront sont des locaux, prêts — si vous le souhaitez — à partager leur mode de vie, leurs anecdotes et coutumes. Vous pourrez aussi enrichir votre passage en ville et en médina avec des guides locaux pour ne rien manquer de l'histoire et de la culture.",
        },
      },
    ],
  },
  reasons: {
    overline: { es: "Por qué Xaluca Tours", en: "Why Xaluca Tours", fr: "Pourquoi Xaluca Tours" },
    title: {
      es: "Cuatro razones para confiarnos tu viaje.",
      en: "Four reasons to trust us with your journey.",
      fr: "Quatre raisons de nous confier votre voyage.",
    },
    items: [
      {
        id: "disponibilidad",
        icon: "Clock",
        title: { es: "Disponibilidad 24/7", en: "24/7 availability", fr: "Disponibilité 24/7" },
        body: {
          es: "Estamos a tu disposición las 24 horas del día, 365 días al año, para darte servicio, organizar una salida inminente o atender cualquier duda durante tu viaje por Marruecos.",
          en: "We're available 24 hours a day, 365 days a year — to serve you, arrange a last-minute departure or address any question during your trip in Morocco.",
          fr: "Nous sommes à votre disposition 24 h/24 et 365 j/an pour vous servir, organiser un départ imminent ou répondre à toute question pendant votre voyage au Maroc.",
        },
      },
      {
        id: "personalizado",
        icon: "Wand2",
        title: { es: "Viajes 100% personalizados", en: "100% bespoke trips", fr: "Voyages 100% personnalisés" },
        body: {
          es: "Todos los viajes que hacemos son a medida. Personalizamos tu viaje según tu disponibilidad y las actividades que quieras realizar. Una aventura 100% adaptada a tus necesidades.",
          en: "Every trip we craft is tailor-made. We personalise it around your availability and the activities you want to do — a journey 100% built to fit you.",
          fr: "Tous nos voyages sont sur mesure. Nous les personnalisons selon vos disponibilités et les activités que vous souhaitez — une aventure 100 % adaptée à vos envies.",
        },
      },
      {
        id: "calidad",
        icon: "ShieldCheck",
        title: { es: "Máxima calidad asegurada", en: "Quality guaranteed", fr: "Qualité maximale garantie" },
        body: {
          es: "Todos los hoteles y actividades que ofrecemos son lugares donde nosotros mismos hemos estado previamente, asegurando así la máxima calidad de cada uno de nuestros servicios.",
          en: "Every hotel and activity we offer is a place we've personally tested, guaranteeing the highest quality across all of our services.",
          fr: "Tous les hôtels et activités que nous proposons sont des lieux que nous avons testés en personne, garantissant ainsi la qualité maximale de chacun de nos services.",
        },
      },
      {
        id: "garantia",
        icon: "BadgeCheck",
        title: { es: "Garantía Grup Xaluca", en: "Grup Xaluca guarantee", fr: "Garantie Grup Xaluca" },
        body: {
          es: "Disponemos de un grupo de hoteles propios en el sur de Marruecos, donde podemos ofrecerte todo lo que necesites con un servicio personalizado integral de 360 grados.",
          en: "We own a hotel group across southern Morocco, where we can offer everything you need with a fully personalised, 360-degree service.",
          fr: "Nous disposons d'un groupe d'hôtels propres dans le sud du Maroc, où nous pouvons vous offrir tout ce dont vous avez besoin avec un service intégral et personnalisé à 360 degrés.",
        },
      },
    ],
  },
  testimonials: {
    overline: { es: "Lo que dicen nuestros viajeros", en: "What our travellers say", fr: "Ce que disent nos voyageurs" },
    title: {
      es: "Tres historias, tres formas de descubrir Marruecos.",
      en: "Three stories, three ways to discover Morocco.",
      fr: "Trois histoires, trois façons de découvrir le Maroc.",
    },
    body: {
      es: "Cada viajero llega a Xaluca con un proyecto distinto. Familias, grupos de amigos y empresas confían en nosotros para que cada viaje resulte como lo imaginaron — o todavía mejor.",
      en: "Every traveller comes to Xaluca with a different project. Families, friend groups and companies trust us to make each trip exactly as they pictured — or even better.",
      fr: "Chaque voyageur arrive chez Xaluca avec un projet différent. Familles, groupes d'amis et entreprises nous font confiance pour que chaque voyage corresponde à leur vision — ou la dépasse.",
    },
    profiles: {
      "amelie-family": {
        icon: "Heart",
        label: { es: "Viaje en familia", en: "Family trip",  fr: "Voyage en famille" },
      },
      "david-4x4": {
        icon: "Users",
        label: { es: "Grupo de amigos", en: "Group of friends", fr: "Groupe d'amis" },
      },
      "carlos-bespoke": {
        icon: "Briefcase",
        label: { es: "Viaje a medida & empresas", en: "Bespoke & business", fr: "Sur mesure & entreprises" },
      },
    },
  },
  cta: {
    eyebrow: { es: "Únete a nuestra comunidad", en: "Join our community", fr: "Rejoignez notre communauté" },
    title: {
      es: "¡Únete a nuestra comunidad de intrépidos aventureros!",
      en: "Join our community of intrepid adventurers!",
      fr: "Rejoignez notre communauté d'aventuriers intrépides !",
    },
    body: {
      es: "Si quieres disfrutar de la mejor experiencia en Marruecos, contacta con Xaluca Tours y descubre la mejor forma de organizar tu viaje.",
      en: "If you want to enjoy the best Morocco experience, get in touch with Xaluca Tours and discover the best way to organise your trip.",
      fr: "Si vous souhaitez vivre la meilleure expérience marocaine, contactez Xaluca Tours et découvrez la meilleure façon d'organiser votre voyage.",
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
  Sparkles, BedDouble, Users, Clock, Wand2, ShieldCheck, BadgeCheck,
  Heart, Briefcase,
};

const FEATURED_TESTIMONIAL_IDS = ["amelie-family", "david-4x4", "carlos-bespoke"];

/* ============================================================
   Sub-components
============================================================ */
const InlineBreadcrumb = ({ lang }) => (
  <nav
    aria-label="Breadcrumb"
    data-testid="qh-breadcrumbs"
    className="inline-flex items-center gap-2 bg-[#1A1513]/55 backdrop-blur-md border border-white/10 px-3.5 py-1.5 text-[10px] md:text-[11px] tracking-[0.22em] uppercase text-[#FDFBF7]/90"
  >
    <Link to={pathFor(lang, "home")} data-testid="qh-bc-home" className="flex items-center gap-1.5 hover:text-[#D4A373] transition-colors">
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
  <section data-testid="qh-hero" className="relative min-h-[100svh] w-full overflow-hidden bg-[#1A1513]">
    <EditableImage
      slot="quehacemos.hero"
      fallback={banner("atlasMisty", 2400)}
      alt=""
      priority
      aspectRatio="auto"
      imgProps={{ loading: "eager" }}
      className="ken-burns absolute inset-0 w-full h-full object-cover"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-[#1A1513]/95 via-[#1A1513]/50 to-[#1A1513]/30 pointer-events-none" />
    <div className="absolute inset-0 berber-bg-cross opacity-40 pointer-events-none" aria-hidden="true" />
    <span className="film-grain pointer-events-none" />
    <HeroMonogram />

    <div className="relative z-10 min-h-[100svh] flex flex-col">
      <div className="pt-[112px] md:pt-[132px] px-6 md:px-12 max-w-7xl mx-auto w-full">
        <InlineBreadcrumb lang={lang} />
      </div>
      <div className="flex-1 flex items-end pt-32 md:pt-44 pb-24 md:pb-32">
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
  <section id="qh-intro" data-testid="qh-intro" className="relative bg-[#FDFBF7] py-24 md:py-32">
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
        <div className="flex flex-wrap gap-3 pt-4">
          <Link
            to={pathFor(lang, "toursLanding")}
            data-testid="qh-intro-proposals"
            className="inline-flex items-center gap-2 bg-[#C16542] hover:bg-[#A8533A] text-[#FDFBF7] px-5 py-3 text-[11px] tracking-[0.22em] uppercase transition-colors"
          >
            {pick(COPY.intro.proposalsCta, lang)}
            <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.8} />
          </Link>
          <Link
            to={pathFor(lang, "upcomingDepartures")}
            data-testid="qh-intro-upcoming"
            className="inline-flex items-center gap-2 border border-[#2C2621]/25 hover:border-[#C16542] hover:text-[#C16542] text-[#2C2621] px-5 py-3 text-[11px] tracking-[0.22em] uppercase transition-colors"
          >
            {pick(COPY.intro.upcomingCta, lang)}
            <ArrowUpRight className="w-3.5 h-3.5" strokeWidth={1.8} />
          </Link>
        </div>
      </div>
    </div>
  </section>
);

const TripPillars = ({ lang }) => (
  <SlotScope id="pillars">
    <section
      id="qh-pillars" data-testid="qh-pillars"
      className="relative bg-[#F2EBE1] py-20 md:py-28 border-t border-[#2C2621]/10"
    >
      <div className="absolute inset-0 berber-bg-diamond opacity-40 pointer-events-none" aria-hidden="true" />
      <div className="relative max-w-7xl mx-auto px-6 md:px-12">
        <div className="max-w-3xl mb-12 md:mb-16">
          <span className="overline inline-flex items-center gap-2 text-[#C16542]">
            <Sparkles className="w-3.5 h-3.5" strokeWidth={1.6} />
            {pick(COPY.trips.overline, lang)}
          </span>
          <h2 className="font-serif-x text-4xl md:text-5xl lg:text-[52px] leading-[1.05] tracking-tight mt-4 text-[#2C2621]">
            {pick(COPY.trips.title, lang)}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#2C2621]/10 border border-[#2C2621]/10">
          {COPY.trips.pillars.map((p) => {
            const Icon = ICON_MAP[p.icon] || Sparkles;
            return (
              <SlotScope key={p.id} id={p.id}>
                <article
                  data-testid={`qh-pillar-${p.id}`}
                  className="group relative bg-[#FDFBF7] flex flex-col"
                >
                  <div className="relative aspect-[5/3] overflow-hidden bg-[#1A1513]">
                    <EditableImage
                      name="image"
                      fallback={p.image}
                      alt={pick(p.title, lang)}
                      aspectRatio="5/3"
                      imgProps={{ loading: "lazy" }}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.06]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1A1513]/55 to-transparent pointer-events-none" />
                    <span className="absolute top-4 left-4 inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#1A1513]/70 backdrop-blur-sm border border-[#D4A373]/60 text-[#D4A373]">
                      <Icon className="w-5 h-5" strokeWidth={1.5} />
                    </span>
                    <CardBrandOverlay slug={`qh-pillar-${p.id}`} testid={`qh-pillar-${p.id}`} />
                  </div>
                  <div className="p-7 md:p-9 flex flex-col flex-1">
                    <h3 className="font-serif-x text-2xl md:text-[26px] leading-[1.12] text-[#2C2621]">
                      {pick(p.title, lang)}
                    </h3>
                    <p className="mt-4 text-sm leading-relaxed text-[#5C5248] flex-1">
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

const Reasons = ({ lang }) => (
  <section
    id="qh-reasons" data-testid="qh-reasons"
    className="relative bg-[#FDFBF7] py-20 md:py-28"
  >
    <div className="max-w-7xl mx-auto px-6 md:px-12">
      <div className="max-w-3xl mb-12 md:mb-16">
        <span className="overline inline-flex items-center gap-2 text-[#C16542]">
          <BadgeCheck className="w-3.5 h-3.5" strokeWidth={1.6} />
          {pick(COPY.reasons.overline, lang)}
        </span>
        <h2 className="font-serif-x text-4xl md:text-5xl lg:text-[52px] leading-[1.05] tracking-tight mt-4 text-[#2C2621]">
          {pick(COPY.reasons.title, lang)}
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        {COPY.reasons.items.map((r, i) => {
          const Icon = ICON_MAP[r.icon] || BadgeCheck;
          return (
            <article
              key={r.id}
              data-testid={`qh-reason-${r.id}`}
              className="relative bg-[#FDFBF7] border border-[#2C2621]/10 hover:border-[#C16542]/50 transition-colors p-7 md:p-8 flex flex-col"
            >
              <div className="flex items-center gap-4">
                <span className="font-serif-x text-3xl text-[#C16542]/60 tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-[#F2EBE1] text-[#C16542]">
                  <Icon className="w-5 h-5" strokeWidth={1.5} />
                </span>
              </div>
              <h3 className="font-serif-x text-xl md:text-[22px] leading-[1.15] text-[#2C2621] mt-6">
                {pick(r.title, lang)}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[#5C5248] flex-1">
                {pick(r.body, lang)}
              </p>
            </article>
          );
        })}
      </div>
    </div>
  </section>
);

const Testimonials = ({ lang }) => {
  const cards = FEATURED_TESTIMONIAL_IDS
    .map((id) => {
      const t = TESTIMONIALS.find((x) => x.id === id);
      if (!t) return null;
      const profile = COPY.testimonials.profiles[id];
      return { ...t, profile };
    })
    .filter(Boolean);

  if (cards.length === 0) return null;

  return (
    <SlotScope id="testimonials">
      <section
        data-testid="qh-testimonials"
        className="relative bg-[#F2EBE1] py-20 md:py-28 border-t border-[#2C2621]/10 overflow-hidden"
      >
        <div className="absolute inset-0 berber-bg-diamond opacity-40 pointer-events-none" aria-hidden="true" />
        <div className="relative max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end mb-12 md:mb-16">
            <div className="md:col-span-7">
              <span className="overline inline-flex items-center gap-2 text-[#C16542]">
                <Quote className="w-3.5 h-3.5" strokeWidth={1.8} />
                {pick(COPY.testimonials.overline, lang)}
              </span>
              <h2 className="font-serif-x text-4xl md:text-5xl lg:text-[52px] leading-[1.05] tracking-tight mt-4 text-[#2C2621]">
                {pick(COPY.testimonials.title, lang)}
              </h2>
            </div>
            <div className="md:col-span-5">
              <p className="text-base md:text-lg text-[#5C5248] leading-relaxed">
                {pick(COPY.testimonials.body, lang)}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {cards.map((t) => {
              const Icon = ICON_MAP[t.profile?.icon] || Quote;
              return (
                <SlotScope key={t.id} id={t.id}>
                  <article
                    data-testid={`qh-testimonial-${t.id}`}
                    className="relative bg-[#FDFBF7] border border-[#2C2621]/10 hover:border-[#C16542]/40 transition-colors p-7 md:p-9 flex flex-col"
                  >
                    <Quote
                      className="absolute top-5 right-5 w-10 h-10 text-[#C16542]/15"
                      strokeWidth={1.4}
                      aria-hidden="true"
                    />
                    <span
                      data-testid={`qh-testimonial-profile-${t.id}`}
                      className="inline-flex items-center gap-2 self-start px-3 py-1.5 bg-[#F2EBE1] text-[#C16542] text-[10px] tracking-[0.25em] uppercase"
                    >
                      <Icon className="w-3.5 h-3.5" strokeWidth={1.8} />
                      {pick(t.profile.label, lang)}
                    </span>

                    <p className="mt-6 font-serif-x text-lg md:text-xl text-[#2C2621] leading-[1.4] italic flex-1">
                      “{pick(t.quote, lang)}”
                    </p>

                    <div className="mt-7 pt-5 border-t border-[#2C2621]/10 flex items-center gap-4">
                      <div className="relative w-14 h-14 rounded-full overflow-hidden flex-shrink-0 bg-[#1A1513]">
                        <EditableImage
                          name="avatar"
                          fallback={t.avatar}
                          alt={t.name}
                          aspectRatio="1/1"
                          imgProps={{ loading: "lazy" }}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="font-serif-x text-base text-[#2C2621] leading-tight">{t.name}</p>
                        <p className="mt-1.5 flex items-center gap-1.5 text-[10px] tracking-[0.16em] uppercase text-[#C16542]/85">
                          <Route className="h-3 w-3 shrink-0" strokeWidth={1.7} />
                          <span className="truncate">
                          {pick(t.trip, lang)}
                          </span>
                        </p>
                      </div>
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
};

const FinalCta = ({ lang }) => (
  <section
    id="qh-final-cta" data-testid="qh-final-cta"
    className="relative bg-[#1A1513] py-24 md:py-32 overflow-hidden"
  >
    <EditableImage
      slot="quehacemos.final.bg"
      fallback={banner("camelCaravan", 2400)}
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

      {/* Contact info card */}
      <div className="mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-3 gap-px bg-[#FDFBF7]/10 border border-[#FDFBF7]/15 max-w-4xl mx-auto">
        <a
          href={`tel:${CONTACT.phoneRaw}`}
          data-testid="qh-contact-phone"
          className="bg-[#1A1513]/70 hover:bg-[#221A16] backdrop-blur-sm p-6 md:p-7 flex items-start gap-4 transition-colors"
        >
          <Phone className="w-5 h-5 text-[#D4A373] mt-1 flex-shrink-0" strokeWidth={1.6} />
          <div>
            <p className="text-[10px] tracking-[0.3em] uppercase text-[#FDFBF7]/55">
              {pick(COPY.cta.phoneLabel, lang)}
            </p>
            <p className="mt-1 text-base text-[#FDFBF7]">{CONTACT.phone}</p>
          </div>
        </a>
        <a
          href={`mailto:${CONTACT.email}`}
          data-testid="qh-contact-email"
          className="bg-[#1A1513]/70 hover:bg-[#221A16] backdrop-blur-sm p-6 md:p-7 flex items-start gap-4 transition-colors"
        >
          <Mail className="w-5 h-5 text-[#D4A373] mt-1 flex-shrink-0" strokeWidth={1.6} />
          <div>
            <p className="text-[10px] tracking-[0.3em] uppercase text-[#FDFBF7]/55">
              {pick(COPY.cta.emailLabel, lang)}
            </p>
            <p className="mt-1 text-base text-[#FDFBF7] break-all">{CONTACT.email}</p>
          </div>
        </a>
        <div
          data-testid="qh-contact-hours"
          className="bg-[#1A1513]/70 backdrop-blur-sm p-6 md:p-7 flex items-start gap-4"
        >
          <Clock className="w-5 h-5 text-[#D4A373] mt-1 flex-shrink-0" strokeWidth={1.6} />
          <div>
            <p className="text-[10px] tracking-[0.3em] uppercase text-[#FDFBF7]/55">
              {pick(COPY.cta.hoursLabel, lang)}
            </p>
            <p className="mt-1 text-base text-[#FDFBF7]">{pick(COPY.cta.hours, lang)}</p>
          </div>
        </div>
      </div>

      <div className="mt-10 flex flex-wrap gap-4 justify-center">
        <Link
          to={pathFor(lang, "planTrip")}
          data-testid="qh-cta-plan"
          className="inline-flex items-center gap-2 bg-[#C16542] hover:bg-[#A8533A] text-[#FDFBF7] px-7 py-3.5 text-sm tracking-[0.18em] uppercase transition-colors"
        >
          {pick(COPY.cta.planCta, lang)}
          <ArrowRight className="w-4 h-4" strokeWidth={1.6} />
        </Link>
        <Link
          to={pathFor(lang, "contact")}
          data-testid="qh-cta-contact"
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
export default function QueHacemosPage() {
  const { lang } = useLanguage();

  useEffect(() => {
    document.title = DOC_TITLES[lang] || DOC_TITLES.es;
  }, [lang]);

  return (
    <div data-testid="qh-page" className="bg-[#FDFBF7]">
      <Hero lang={lang} />
      <SectionNav
        testid="qh-nav"
        items={[
          { id: "qh-intro", label: { es: "Introducción", en: "Overview", fr: "Introduction" } },
          { id: "qh-pillars", label: { es: "Qué hacemos", en: "What we do", fr: "Ce que nous faisons" } },
          { id: "qh-reasons", label: { es: "Por qué Xaluca", en: "Why Xaluca", fr: "Pourquoi Xaluca" } },
          { id: "qh-final-cta", label: { es: "Contacto", en: "Contact", fr: "Contact" } },
        ]}
      />
      <Intro lang={lang} />
      <TripPillars lang={lang} />
      <Reasons lang={lang} />
      <Testimonials lang={lang} />
      <FinalCta lang={lang} />
    </div>
  );
}
