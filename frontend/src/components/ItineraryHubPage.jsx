import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Clock } from "lucide-react";
import { useLanguage, pick } from "@/contexts/LanguageContext";
import { pathFor } from "@/lib/routes";
import {
  JourneyHero,
  StickyNav,
  CommunityCta,
} from "@/components/JourneyPageSections";
import { COMMON_NIGHTS } from "@/lib/itineraryHubs";
import ContactForm from "@/components/ContactForm";

const LABELS = {
  es: {
    scroll: "Desplázate",
    cta_primary: "Ver opciones",
    cta_secondary: "Pedir asesoramiento",
    nav_intro: "Resumen",
    nav_options: "Opciones",
    nav_contact: "Contacto",
    cta_card: "Más información",
    community: {
      overline: "Únete a nuestra comunidad de viajeros",
      title: "¿Te interesa este viaje?",
      subtitle: "Asesoramiento online en tiempo real o ven a visitarnos a nuestras oficinas.",
      body: "Contacta sin compromiso con el equipo de Xaluca Tours para empezar a planificar los detalles de tu viaje.",
      phone_label: "Teléfono", email_label: "Email", hours_label: "Horario",
      hours_value: "Lun – Vie · 10h – 20h",
      cta_primary: "Contactar ahora",
    },
  },
  en: {
    scroll: "Scroll",
    cta_primary: "View options",
    cta_secondary: "Get advice",
    nav_intro: "Overview",
    nav_options: "Options",
    nav_contact: "Contact",
    cta_card: "More info",
    community: {
      overline: "Join our community of travellers",
      title: "Interested in this journey?",
      subtitle: "Real-time online advice or visit us at our offices.",
      body: "Reach out — no commitment — to the Xaluca Tours team to start planning the details of your trip.",
      phone_label: "Phone", email_label: "Email", hours_label: "Hours",
      hours_value: "Mon – Fri · 10:00 – 20:00",
      cta_primary: "Get in touch",
    },
  },
  fr: {
    scroll: "Faites défiler",
    cta_primary: "Voir les options",
    cta_secondary: "Demander conseil",
    nav_intro: "Aperçu",
    nav_options: "Options",
    nav_contact: "Contact",
    cta_card: "Plus d'infos",
    community: {
      overline: "Rejoignez notre communauté de voyageurs",
      title: "Ce voyage vous intéresse ?",
      subtitle: "Conseil en ligne en temps réel ou rendez-vous à nos bureaux.",
      body: "Contactez sans engagement l'équipe Xaluca Tours pour démarrer les détails de votre voyage.",
      phone_label: "Téléphone", email_label: "Email", hours_label: "Horaires",
      hours_value: "Lun – Ven · 10h – 20h",
      cta_primary: "Nous contacter",
    },
  },
};

const Intro = ({ intro, lang }) => (
  <section id="intro" data-testid="hub-intro"
           className="relative bg-[#FDFBF7] py-24 md:py-32 overflow-hidden">
    <div className="relative max-w-4xl mx-auto px-6 md:px-12 text-center">
      <span className="overline">{pick(intro.overline, lang)}</span>
      <h2 className="font-serif-x text-4xl md:text-5xl lg:text-6xl leading-[1.05] tracking-tight mt-5 text-[#2C2621]">
        {pick(intro.title, lang)}
      </h2>
      <div className="mt-8 space-y-5 text-[15px] md:text-base text-[#5C5248] leading-[1.85]">
        {pick(intro.body, lang).map((p, i) => (
          <p key={i} className={i === 0 ? "font-serif-x-italic text-xl md:text-2xl text-[#C16542]" : ""}>{p}</p>
        ))}
      </div>
    </div>
  </section>
);

const OptionsGrid = ({ options, programs, lang, ctaTarget, t }) => {
  const groupedKeys = Array.from(new Set(programs.map((p) => p.direction)));
  const getLabel = (k) => k === "a" ? pick(options.group_a, lang) : pick(options.group_b, lang);
  return (
    <section id="options" data-testid="hub-options"
             className="relative bg-[#FDFBF7] py-24 md:py-32 overflow-hidden">
      <div className="absolute inset-0 berber-bg-diamond opacity-20 pointer-events-none" aria-hidden="true" />
      <div className="relative max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end mb-14">
          <div className="md:col-span-7">
            <span className="overline">{pick(options.overline, lang)}</span>
            <h2 className="font-serif-x text-4xl md:text-5xl lg:text-[54px] leading-[1.05] tracking-tight mt-5 text-[#2C2621]">
              {pick(options.title, lang)}
            </h2>
          </div>
          <div className="md:col-span-5">
            <p className="text-base md:text-lg text-[#5C5248] leading-relaxed">{pick(options.body, lang)}</p>
          </div>
        </div>

        {groupedKeys.map((k) => {
          const items = programs.filter((p) => p.direction === k);
          return (
            <div key={k} className="mb-14 last:mb-0">
              <div className="flex items-center gap-3 mb-6">
                <span className="font-serif-x text-2xl md:text-3xl text-[#2C2621]">{getLabel(k)}</span>
                <span className="flex-1 h-px bg-[#2C2621]/15" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {items.map((p) => (
                  <Link
                    key={p.id}
                    to={ctaTarget}
                    data-testid={`hub-program-${p.id}`}
                    className="group relative block overflow-hidden h-[440px]"
                  >
                    <img src={p.image} alt="" loading="lazy"
                         className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.06]" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1A1513]/95 via-[#1A1513]/50 to-[#1A1513]/10" />
                    <span className="film-grain" />
                    <div className="absolute inset-0 p-6 md:p-7 flex flex-col justify-end text-[#FDFBF7]">
                      <span className="text-[10px] tracking-[0.3em] uppercase" style={{ color: p.accent }}>
                        {getLabel(k)}
                      </span>
                      <h3 className="font-serif-x text-2xl md:text-[28px] leading-[1.05] mt-3 inline-flex items-center gap-3">
                        <Clock className="w-5 h-5 text-[#D4A373]" strokeWidth={1.4} />
                        {pick(COMMON_NIGHTS[p.nights], lang)}
                      </h3>
                      <p className="mt-3 text-sm text-[#FDFBF7]/80 leading-relaxed line-clamp-3">
                        {pick(p.blurb, lang)}
                      </p>
                      <span className="mt-5 inline-flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase text-[#D4A373] group-hover:gap-4 transition-all duration-300">
                        {t.cta_card}<ArrowRight className="w-3 h-3" strokeWidth={1.5} />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default function ItineraryHubPage({ hub }) {
  const { lang } = useLanguage();
  const t = LABELS[lang] || LABELS.es;
  const heroTitle = pick(hub.hero.title, lang);

  useEffect(() => {
    document.title = `${heroTitle} · Xaluca Tours`;
    window.scrollTo(0, 0);
  }, [heroTitle]);

  const navItems = [
    { id: "intro",     label: t.nav_intro },
    { id: "options",   label: t.nav_options },
    { id: "community", label: t.nav_contact },
  ];

  return (
    <div data-testid={`hub-page-${hub.id}`}>
      <JourneyHero
        image={hub.hero.image}
        eyebrow={pick(hub.hero.eyebrow, lang)}
        place={pick(hub.hero.place, lang)}
        title={heroTitle}
        subtitle={pick(hub.hero.subtitle, lang)}
        primaryCta={t.cta_primary}
        primaryHref="#options"
        secondaryCta={t.cta_secondary}
        secondaryHref="#community"
        scroll={t.scroll}
        testid={`hub-hero-${hub.id}`}
      />

      <StickyNav items={navItems} testid={`hub-nav-${hub.id}`} />

      <Intro intro={hub.intro} lang={lang} />

      <OptionsGrid
        options={hub.options}
        programs={hub.programs}
        lang={lang}
        ctaTarget={pathFor(lang, "contact")}
        t={t}
      />

      <CommunityCta
        t={t.community}
        lang={lang}
        image="https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=2400&q=85"
        testid={`hub-community-${hub.id}`}
      />

      <ContactForm />
    </div>
  );
}
