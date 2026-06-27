import React, { useEffect } from "react";
import EditableImage from "@/components/EditableImage";
import CardBrandOverlay from "@/components/CardBrandOverlay";
import { Link } from "react-router-dom";
import {
  ArrowRight, Bike, Mountain, Truck, Tent, Palmtree, Flame, Sparkles, Trophy,
  Activity, Clock, Gauge,
} from "lucide-react";
import { useLanguage, pick } from "@/contexts/LanguageContext";
import { pathFor } from "@/lib/routes";
import { AVENTURA_EXPERIENCES, AVENTURA_EDITORIAL, AVENTURA_PILLARS } from "@/lib/aventuraExperiences";
import {
  JourneyHero,
  StickyNav,
  EditorialBlock,
  WhyXaluca,
  CatalogTeaser,
  CommunityCta,
} from "@/components/JourneyPageSections";
import ContactForm from "@/components/ContactForm";
import Testimonials from "@/components/Testimonials";
import ToursRegionMap from "@/components/ToursRegionMap";

const EXP_ICONS = { Bike, Mountain, Truck, Tent, Palmtree, Flame, Sparkles, Trophy };

/* ============================================================
   Trilingual copy for /viajes/aventura
============================================================ */
const COPY = {
  es: {
    docTitle: "Viajes de aventura por Marruecos · Xaluca Tours",
    hero: {
      eyebrow: "Viajes de aventura · Sur de Marruecos",
      place: "Merzouga · Erg Chebbi",
      title: "Vive la aventura de tu vida.",
      subtitle: "Adrenalina, libertad y exploración entre dunas, oasis, montañas y pistas infinitas del Sahara.",
      intro: "Desde rutas en moto por el desierto hasta expediciones de trekking por el Alto Atlas — cada viaje está diseñado para descubrir el Marruecos más auténtico desde una perspectiva completamente diferente.",
      primaryCta: "Ver experiencias", secondaryCta: "Pedir asesoramiento", scroll: "Desplázate",
    },
    nav: {
      intro: "Aventura",
      tailor: "100% personalizado",
      merzouga: "Merzouga",
      enduro: "Enduro",
      experiences: "Experiencias",
      why: "Por qué Xaluca",
      community: "Contacto",
    },
    experiences: {
      overline: "Experiencias de aventura",
      title: "Ocho maneras de vivir el Sahara.",
      body: "Cada experiencia tiene su propio carácter, nivel y duración. Elige la tuya — o combínalas para crear tu travesía perfecta.",
      level_label: "Nivel",
      duration_label: "Duración",
      type_label: "Experiencia",
      cta: "Ver ruta",
    },
    why: {
      overline: "Razones para viajar con Xaluca Tours",
      title: "Cuatro garantías para tu aventura.",
      body: "Aventura no significa improvisación. Significa preparación, equipo experto, atención 24/7 y la garantía Grup Xaluca en cada kilómetro.",
    },
    catalog: {
      overline: "Descubre todos nuestros circuitos",
      title: "El Marruecos más auténtico te espera.",
      body: "Descubre rutas de aventura diseñadas para explorar dunas, montañas, oasis y pistas infinitas del Sahara.",
      cta: "Ver todos los circuitos",
    },
    community: {
      overline: "Únete a nuestra comunidad de intrépidos aventureros",
      title: "¿Tienes preguntas?",
      subtitle: "Descubre nuestro asesoramiento online en tiempo real o ven a visitarnos a nuestras oficinas.",
      body: "Planifica tu próxima aventura por Marruecos y resuelve todas tus dudas directamente con nuestros agentes especializados en viajes de aventura. Reserva una cita telefónica o presencial en Calle Latorre 52, Sabadell, Barcelona.",
      phone_label: "Teléfono", email_label: "Email", hours_label: "Horario",
      hours_value: "Lun – Vie · 10h – 20h",
      cta_primary: "Contactar ahora",
    },
  },
  en: {
    docTitle: "Adventure journeys in Morocco · Xaluca Tours",
    hero: {
      eyebrow: "Adventure journeys · Southern Morocco",
      place: "Merzouga · Erg Chebbi",
      title: "Live the adventure of your life.",
      subtitle: "Adrenaline, freedom and exploration between dunes, oases, mountains and the infinite tracks of the Sahara.",
      intro: "From desert motorbike rides to trekking expeditions across the High Atlas — every trip is designed to reveal the most authentic Morocco from a completely different angle.",
      primaryCta: "View experiences", secondaryCta: "Get advice", scroll: "Scroll",
    },
    nav: {
      intro: "Adventure",
      tailor: "100% tailored",
      merzouga: "Merzouga",
      enduro: "Enduro",
      experiences: "Experiences",
      why: "Why Xaluca",
      community: "Contact",
    },
    experiences: {
      overline: "Adventure experiences",
      title: "Eight ways to live the Sahara.",
      body: "Each experience has its own character, level and duration. Pick yours — or combine them to craft your perfect crossing.",
      level_label: "Level",
      duration_label: "Duration",
      type_label: "Experience",
      cta: "See route",
    },
    why: {
      overline: "Reasons to travel with Xaluca Tours",
      title: "Four guarantees for your adventure.",
      body: "Adventure does not mean improvisation. It means preparation, expert teams, 24/7 attention and the Grup Xaluca guarantee at every kilometre.",
    },
    catalog: {
      overline: "Discover all our circuits",
      title: "The most authentic Morocco awaits.",
      body: "Discover adventure routes crafted to explore dunes, mountains, oases and the infinite tracks of the Sahara.",
      cta: "See all circuits",
    },
    community: {
      overline: "Join our community of intrepid adventurers",
      title: "Any questions?",
      subtitle: "Real-time online advice or visit us at our offices.",
      body: "Plan your next Moroccan adventure and resolve every doubt with our adventure specialists. Book a phone call or visit us at Calle Latorre 52, Sabadell, Barcelona.",
      phone_label: "Phone", email_label: "Email", hours_label: "Hours",
      hours_value: "Mon – Fri · 10:00 – 20:00",
      cta_primary: "Get in touch",
    },
  },
  fr: {
    docTitle: "Voyages d'aventure au Maroc · Xaluca Tours",
    hero: {
      eyebrow: "Voyages d'aventure · Sud du Maroc",
      place: "Merzouga · Erg Chebbi",
      title: "Vivez l'aventure de votre vie.",
      subtitle: "Adrénaline, liberté et exploration entre dunes, oasis, montagnes et pistes infinies du Sahara.",
      intro: "Des balades à moto dans le désert aux expéditions de trekking dans le Haut Atlas — chaque voyage révèle le Maroc le plus authentique sous un angle radicalement différent.",
      primaryCta: "Voir les expériences", secondaryCta: "Demander conseil", scroll: "Faites défiler",
    },
    nav: {
      intro: "Aventure",
      tailor: "100% sur mesure",
      merzouga: "Merzouga",
      enduro: "Enduro",
      experiences: "Expériences",
      why: "Pourquoi Xaluca",
      community: "Contact",
    },
    experiences: {
      overline: "Expériences d'aventure",
      title: "Huit façons de vivre le Sahara.",
      body: "Chaque expérience a son caractère, son niveau et sa durée. Choisissez la vôtre — ou combinez-les pour créer votre traversée idéale.",
      level_label: "Niveau",
      duration_label: "Durée",
      type_label: "Expérience",
      cta: "Voir la route",
    },
    why: {
      overline: "Pourquoi voyager avec Xaluca Tours",
      title: "Quatre garanties pour votre aventure.",
      body: "Aventure ne rime pas avec improvisation. Préparation, équipes expertes, attention 24/7 et garantie Grup Xaluca à chaque kilomètre.",
    },
    catalog: {
      overline: "Découvrez tous nos circuits",
      title: "Le Maroc le plus authentique vous attend.",
      body: "Découvrez des itinéraires d'aventure conçus pour explorer dunes, montagnes, oasis et pistes infinies du Sahara.",
      cta: "Voir tous les circuits",
    },
    community: {
      overline: "Rejoignez notre communauté d'aventuriers intrépides",
      title: "Des questions ?",
      subtitle: "Conseil en ligne en temps réel ou rendez-vous à nos bureaux.",
      body: "Planifiez votre prochaine aventure au Maroc et levez tous vos doutes avec nos spécialistes d'aventure. Réservez un appel ou rendez-vous au Calle Latorre 52, Sabadell, Barcelone.",
      phone_label: "Téléphone", email_label: "Email", hours_label: "Horaires",
      hours_value: "Lun – Ven · 10h – 20h",
      cta_primary: "Nous contacter",
    },
  },
};

/* ============================================================
   Intro band — "Viajes de aventura por el sur de Marruecos"
============================================================ */
const AdventureIntro = ({ lang }) => {
  const COPY_INTRO = {
    es: {
      eyebrow: "Viajes de aventura por el sur de Marruecos",
      title: "Para los que dejan atrás el ruido.",
      body: [
        "¿Buscas alejarte del ajetreo y el ritmo acelerado de la ciudad?",
        "Desde Xaluca Tours te proponemos diferentes experiencias de aventura diseñadas para hacer latir el corazón más fuerte que nunca.",
        "Desde rutas en moto por el desierto hasta expediciones de trekking por las montañas del Atlas, cada viaje está pensado para descubrir el Marruecos más auténtico desde una perspectiva completamente diferente.",
        "Vive la aventura de tu vida y descubre experiencias únicas entre dunas, oasis, montañas y pistas infinitas del Sahara.",
      ],
    },
    en: {
      eyebrow: "Adventure journeys in southern Morocco",
      title: "For those who leave the noise behind.",
      body: [
        "Looking to step away from the rush and the city's relentless pace?",
        "At Xaluca Tours we offer adventure experiences designed to make your heart beat harder than ever.",
        "From desert motorbike routes to trekking expeditions in the Atlas mountains, every trip is built to reveal the most authentic Morocco from a completely fresh angle.",
        "Live the adventure of your life and discover unique experiences among dunes, oases, mountains and the infinite tracks of the Sahara.",
      ],
    },
    fr: {
      eyebrow: "Voyages d'aventure dans le sud du Maroc",
      title: "Pour ceux qui laissent le bruit derrière eux.",
      body: [
        "Envie de s'éloigner de l'agitation et du rythme effréné de la ville ?",
        "Chez Xaluca Tours, nous proposons des expériences d'aventure conçues pour faire battre votre cœur plus fort que jamais.",
        "Des balades à moto dans le désert aux expéditions de trekking dans l'Atlas, chaque voyage révèle le Maroc le plus authentique sous un angle complètement neuf.",
        "Vivez l'aventure de votre vie et découvrez des expériences uniques entre dunes, oasis, montagnes et pistes infinies du Sahara.",
      ],
    },
  };
  const t = COPY_INTRO[lang] || COPY_INTRO.es;
  return (
    <section
      id="intro"
      data-testid="aventura-intro"
      className="relative bg-[#FDFBF7] py-24 md:py-32 overflow-hidden"
    >
      <div className="absolute inset-0 berber-bg-diamond opacity-25 pointer-events-none" aria-hidden="true" />
      <div className="relative max-w-4xl mx-auto px-6 md:px-12 text-center">
        <span className="overline">{t.eyebrow}</span>
        <h2 className="font-serif-x text-4xl md:text-5xl lg:text-6xl leading-[1.05] tracking-tight mt-5 text-[#2C2621]">
          {t.title}
        </h2>
        <div className="mt-8 space-y-5 text-[15px] md:text-base text-[#5C5248] leading-[1.85]">
          {t.body.map((p, i) => (
            <p key={i} className={i === 0 ? "font-serif-x-italic text-xl md:text-2xl text-[#C16542]" : ""}>
              {p}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ============================================================
   ExperiencesGrid — 8 immersive adventure cards
============================================================ */
const ExperiencesGrid = ({ t, lang }) => (
  <section
    id="experiences"
    data-testid="aventura-experiences"
    className="relative bg-[#1A1513] text-[#FDFBF7] py-24 md:py-32 overflow-hidden"
  >
    <div className="absolute inset-0 berber-bg-cross opacity-40 pointer-events-none" aria-hidden="true" />
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[#FDFBF7]/10 border border-[#FDFBF7]/15">
        {AVENTURA_EXPERIENCES.map((e) => {
          const Icon = EXP_ICONS[e.icon] || Sparkles;
          return (
            <article
              key={e.id}
              data-testid={`aventura-exp-${e.id}`}
              className="group relative bg-[#1A1513] hover:bg-[#221A16] transition-colors duration-500 flex flex-col overflow-hidden"
            >
              <div className="relative aspect-[5/4] overflow-hidden">
                <EditableImage
                  slot={`aventura.exp.${e.id}.image`}
                  fallback={e.image}
                  alt={pick(e.title, lang)}
                  aspectRatio="5/4"
                  imgProps={{ loading: "lazy" }}
                  className="absolute inset-0 w-full h-full object-cover opacity-70 transition-all duration-[1400ms] ease-out group-hover:opacity-100 group-hover:scale-[1.06]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1513] via-[#1A1513]/45 to-transparent pointer-events-none" />
                <span
                  className="absolute top-4 left-4 inline-flex items-center justify-center w-12 h-12 rounded-full border bg-[#1A1513]/70 backdrop-blur-sm"
                  style={{ borderColor: `${e.accent}99`, color: e.accent }}
                >
                  <Icon className="w-5 h-5" strokeWidth={1.5} />
                </span>
                <CardBrandOverlay slug={`aventura-exp-${e.id}`} testid={`aventura-exp-${e.id}`} />
              </div>

              <div className="p-6 md:p-7 flex flex-col flex-1">
                <h3 className="font-serif-x text-xl md:text-[22px] leading-[1.15]">
                  {pick(e.title, lang)}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[#FDFBF7]/75 flex-1">
                  {pick(e.blurb, lang)}
                </p>

                {/* Spec rows */}
                <dl className="mt-5 space-y-2 text-[10px] tracking-[0.2em] uppercase text-[#FDFBF7]/75">
                  <div className="flex items-start gap-2">
                    <Gauge className="w-3 h-3 mt-0.5 shrink-0" strokeWidth={1.6} style={{ color: e.accent }} />
                    <span><b className="text-[#FDFBF7]/55 font-normal">{t.level_label} · </b>{pick(e.level, lang)}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Clock className="w-3 h-3 mt-0.5 shrink-0" strokeWidth={1.6} style={{ color: e.accent }} />
                    <span><b className="text-[#FDFBF7]/55 font-normal">{t.duration_label} · </b>{pick(e.duration, lang)}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Activity className="w-3 h-3 mt-0.5 shrink-0" strokeWidth={1.6} style={{ color: e.accent }} />
                    <span><b className="text-[#FDFBF7]/55 font-normal">{t.type_label} · </b>{pick(e.type, lang)}</span>
                  </div>
                </dl>

                <Link
                  to={e.id === "enduro-desierto" ? pathFor(lang, "tourAventuraEnduroHub") : pathFor(lang, "contact")}
                  data-testid={`aventura-exp-cta-${e.id}`}
                  className="mt-6 inline-flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase border-b pb-1 self-start group-hover:gap-3 transition-all duration-300"
                  style={{ borderColor: `${e.accent}66`, color: e.accent }}
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

export default function AventuraPage() {
  const { lang } = useLanguage();
  const t = COPY[lang] || COPY.es;

  useEffect(() => {
    document.title = t.docTitle;
    window.scrollTo(0, 0);
  }, [t.docTitle]);

  const navItems = [
    { id: "intro",           label: t.nav.intro },
    { id: "tu-aventura",     label: t.nav.tailor },
    { id: "merzouga",        label: t.nav.merzouga },
    { id: "enduro-marruecos",label: t.nav.enduro },
    { id: "experiences",     label: t.nav.experiences },
    { id: "why-xaluca",      label: t.nav.why },
    { id: "community",       label: t.nav.community },
  ];

  return (
    <div data-testid="aventura-page">
      <JourneyHero
        image="https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=2400&q=85"
        eyebrow={t.hero.eyebrow}
        place={t.hero.place}
        title={t.hero.title}
        subtitle={t.hero.subtitle}
        intro={t.hero.intro}
        primaryCta={t.hero.primaryCta}
        primaryHref="#experiences"
        secondaryCta={t.hero.secondaryCta}
        secondaryHref={pathFor(lang, "appointment")}
        scroll={t.hero.scroll}
        testid="aventura-hero"
      />

      <StickyNav items={navItems} testid="aventura-nav" />

      {/* 1. Intro band */}
      <AdventureIntro lang={lang} />

      {/* 2. "Tu aventura 100% personalizada" editorial */}
      <EditorialBlock block={AVENTURA_EDITORIAL[2]} lang={lang} />

      {/* 3. Merzouga editorial */}
      <EditorialBlock block={AVENTURA_EDITORIAL[0]} lang={lang} />

      {/* 3.5 Testimonials · Merzouga / 4x4 expedition */}
      <Testimonials
        variant="compact"
        themes={["4x4", "expedition", "desert", "dunes", "adrenaline"]}
        limit={2}
        tone="cream"
        eyebrow={{ es: "Pistas del Dakar, hamada y dunas", en: "Dakar tracks, hamada and dunes", fr: "Pistes du Dakar, hamada et dunes" }}
        testid="aventura-testi-4x4"
      />

      {/* 4. Enduro editorial */}
      <EditorialBlock block={AVENTURA_EDITORIAL[1]} lang={lang} />

      {/* 4.1 Enduro CTA → hub */}
      <section data-testid="aventura-enduro-cta" className="bg-[#F2EBE1] py-14 md:py-20">
        <div className="max-w-5xl mx-auto px-6 md:px-12 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <span className="overline">{{ es: "Opciones de enduro por Marruecos", en: "Enduro options across Morocco", fr: "Options d'enduro au Maroc" }[lang]}</span>
            <h3 className="font-serif-x text-2xl md:text-3xl text-[#2C2621] mt-3 leading-[1.15]">
              {{
                es: "Elige tu travesía sobre la moto.",
                en: "Choose your motorbike crossing.",
                fr: "Choisissez votre traversée à moto.",
              }[lang]}
            </h3>
          </div>
          <Link
            to={pathFor(lang, "tourAventuraEnduroHub")}
            data-testid="aventura-enduro-cta-link"
            className="inline-flex items-center gap-3 bg-[#2C2621] hover:bg-[#1A1513] text-[#FDFBF7] px-7 py-3.5 text-[11px] tracking-[0.25em] uppercase transition-colors duration-300"
          >
            {{ es: "Ver opciones de enduro", en: "View enduro options", fr: "Voir les options d'enduro" }[lang]}
            <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.6} />
          </Link>
        </div>
      </section>

      {/* 4.5 Testimonials · Enduro / motorbike raids */}
      <Testimonials
        variant="compact"
        themes={["enduro", "adrenaline", "expedition"]}
        limit={2}
        tone="sage"
        eyebrow={{ es: "Raids enduro en el Sur Marroquí", en: "Enduro raids in the Moroccan South", fr: "Raids enduro dans le Sud marocain" }}
        testid="aventura-testi-enduro"
      />

      {/* 5. Experiences grid (8 cards) */}
      <ExperiencesGrid t={t.experiences} lang={lang} />

      {/* 5.5 Testimonials · M'Goun & trekking */}
      <Testimonials
        variant="compact"
        themes={["mgoun", "trekking", "atlas", "berber-village"]}
        limit={2}
        tone="sand"
        eyebrow={{ es: "Cumbres y noches en aldeas bereberes", en: "Summits and nights in Berber villages", fr: "Sommets et nuits en villages berbères" }}
        testid="aventura-testi-trekking"
      />

      {/* 6. Why Xaluca pillars (dark variant on adventure page) */}
      <WhyXaluca pillars={AVENTURA_PILLARS} t={t.why} lang={lang} testid="aventura-why" />

      {/* 6.5 Testimonials — Adventure-themed */}
      <Testimonials
        themes={["aventura", "atlas"]}
        limit={3}
        tone="sage"
        testid="aventura-testimonials"
      />

      {/* 7. Catalog teaser */}
      <CatalogTeaser
        t={t.catalog}
        lang={lang}
        image="https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=2400&q=85"
        testid="aventura-catalog"
      />

      {/* 8. Community CTA */}
      <CommunityCta
        t={t.community}
        lang={lang}
        image="https://images.unsplash.com/photo-1542401886-65d6c61db217?auto=format&fit=crop&w=2400&q=85"
        testid="aventura-community"
      />

      <ToursRegionMap defaultZone="sahara" topPadClass="pt-20 md:pt-28" />

      <ContactForm />
    </div>
  );
}
