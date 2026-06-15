import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowLeftRight, Clock } from "lucide-react";
import { useLanguage, pick } from "@/contexts/LanguageContext";
import { pathFor } from "@/lib/routes";
import EditableImage from "@/components/EditableImage";
import EditableText from "@/components/EditableText";
import FromPrice from "@/components/FromPrice";
import { SlotScope, useSlotId } from "@/components/slotScope";
import { tripHeroSlot, tripHeroImage, usesTripMaster } from "@/lib/tripHero";
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

/* ============================================================
   Inline-CMS text helpers (mirror of ProgramTemplate)
   <L> — global UI label shared across all hub pages. Supports
         dotted keys into LABELS (e.g. "community.title").
         Slot: `hub-ui.<k>`.
   <C> — per-page content, auto-namespaced by page path.
   <G> — global content keyed explicitly (shared data like nights).
============================================================ */
const labelDefaults = (k) => {
  const get = (obj) => k.split(".").reduce((o, part) => (o ? o[part] : undefined), obj);
  return { es: get(LABELS.es), en: get(LABELS.en), fr: get(LABELS.fr) };
};
const L = ({ k, as = "span", className, multiline = false, ...rest }) => (
  <EditableText slot={`hub-ui.${k}`} defaults={labelDefaults(k)} as={as} multiline={multiline} className={className} {...rest} />
);
const C = ({ name, defaults, as = "span", className, multiline = true, ...rest }) => {
  const slot = useSlotId(name);
  return <EditableText slot={slot} defaults={defaults || {}} as={as} multiline={multiline} className={className} {...rest} />;
};
const G = ({ k, defaults, as = "span", className, multiline = false, ...rest }) => (
  <EditableText slot={`hub-ui.${k}`} defaults={defaults || {}} as={as} multiline={multiline} className={className} {...rest} />
);

const Intro = ({ intro, lang }) => {
  const bodyAll = {
    es: pick(intro.body, "es") || [],
    en: pick(intro.body, "en") || [],
    fr: pick(intro.body, "fr") || [],
  };
  const bodyLen = (pick(intro.body, lang) || []).length;
  return (
    <section id="intro" data-testid="hub-intro"
             className="relative bg-[#FDFBF7] py-24 md:py-32 overflow-hidden">
      <div className="relative max-w-4xl mx-auto px-6 md:px-12 text-center">
        <C name="intro.overline" defaults={intro.overline} multiline={false} className="overline" />
        <C name="intro.title" as="h2" multiline={false} defaults={intro.title}
           className="font-serif-x text-4xl md:text-5xl lg:text-6xl leading-[1.05] tracking-tight mt-5 text-[#2C2621]" />
        <div className="mt-8 space-y-5 text-[15px] md:text-base text-[#5C5248] leading-[1.85]">
          {Array.from({ length: bodyLen }).map((_, i) => (
            <C
              key={i}
              name={`intro.p${i}`}
              as="p"
              defaults={{ es: bodyAll.es[i] || "", en: bodyAll.en[i] || "", fr: bodyAll.fr[i] || "" }}
              className={i === 0 ? "font-serif-x-italic text-xl md:text-2xl text-[#C16542]" : ""}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

const OptionsGrid = ({ options, programs, lang, ctaTarget, t }) => {
  const groupedKeys = Array.from(new Set(programs.map((p) => p.direction)));
  const getLabel = (k) => k === "a" ? pick(options.group_a, lang) : pick(options.group_b, lang);
  const singleDirection = groupedKeys.length === 1 && (groupedKeys[0] === undefined || !options.group_a);
  return (
    <section id="options" data-testid="hub-options"
             className="relative bg-[#FDFBF7] py-24 md:py-32 overflow-hidden">
      <div className="absolute inset-0 berber-bg-diamond opacity-20 pointer-events-none" aria-hidden="true" />
      <div className="relative max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end mb-14">
          <div className="md:col-span-7">
            <C name="options.overline" defaults={options.overline} multiline={false} className="overline" />
            <C name="options.title" as="h2" multiline={false} defaults={options.title}
               className="font-serif-x text-4xl md:text-5xl lg:text-[54px] leading-[1.05] tracking-tight mt-5 text-[#2C2621]" />
          </div>
          <div className="md:col-span-5">
            <C name="options.body" as="p" defaults={options.body} className="text-base md:text-lg text-[#5C5248] leading-relaxed" />
          </div>
        </div>

        {groupedKeys.map((k) => {
          const items = programs.filter((p) => p.direction === k);
          return (
            <div key={k ?? "single"} className="mb-14 last:mb-0">
              {!singleDirection && (
                <div className="flex items-center gap-3 mb-6">
                  <C
                    name={`options.group_${k}`}
                    multiline={false}
                    defaults={k === "a" ? options.group_a : options.group_b}
                    className="font-serif-x text-2xl md:text-3xl text-[#2C2621]"
                  />
                  <span className="flex-1 h-px bg-[#2C2621]/15" />
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {items.map((p) => {
                  // When the card deep-links to a real trip page, bind its
                  // image to that trip's shared MASTER slot so it stays in
                  // sync with the Home catalog and every other appearance.
                  const master = p.link && usesTripMaster(p.link);
                  const imgSlotProps = master
                    ? { slot: tripHeroSlot(p.link), fallback: tripHeroImage(p.link) || p.image }
                    : { name: `program.${p.id}`, fallback: p.image };
                  return (
                  <Link
                    key={p.id}
                    to={p.link ? pathFor(lang, p.link) : ctaTarget}
                    data-testid={`hub-program-${p.id}`}
                    className="group relative block overflow-hidden h-[440px]"
                  >
                    <EditableImage
                      {...imgSlotProps}
                      alt=""
                      aspectRatio="3/4"
                      imgProps={{ loading: "lazy" }}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.06]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1A1513]/95 via-[#1A1513]/50 to-[#1A1513]/10 pointer-events-none" />
                    <span className="film-grain" />
                    <div className="absolute inset-0 p-6 md:p-7 flex flex-col justify-end text-[#FDFBF7]">
                      <span className="text-[10px] tracking-[0.3em] uppercase" style={{ color: p.accent }}>
                        {singleDirection ? pick(options.overline, lang) : getLabel(k)}
                      </span>
                      <h3 className="font-serif-x text-2xl md:text-[28px] leading-[1.05] mt-3 inline-flex items-center gap-3">
                        <Clock className="w-5 h-5 text-[#D4A373]" strokeWidth={1.4} />
                        <G k={`nights.${p.nights}`} defaults={COMMON_NIGHTS[p.nights]} multiline={false} />
                      </h3>
                      <C
                        name={`program.${p.id}.blurb`}
                        as="p"
                        defaults={p.blurb}
                        className="mt-3 text-sm text-[#FDFBF7]/80 leading-relaxed line-clamp-3"
                      />
                      <span className="mt-5 inline-flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase text-[#D4A373] group-hover:gap-4 transition-all duration-300">
                        <L k="cta_card" /><ArrowRight className="w-3 h-3" strokeWidth={1.5} />
                      </span>
                      <div className="mt-4 pt-4 border-t border-[#FDFBF7]/15">
                        <FromPrice tone="light" size="sm" routeId={p.link} testid={`hub-program-from-${p.id}`} />
                      </div>
                    </div>
                  </Link>
                  );
                })}
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
      <div className="relative">
        <JourneyHero
          image={hub.hero.image}
          eyebrow={<C name="hero.eyebrow" defaults={hub.hero.eyebrow} multiline={false} />}
          place={hub.hero.place ? <C name="hero.place" defaults={hub.hero.place} multiline={false} /> : undefined}
          title={<C name="hero.title" defaults={hub.hero.title} multiline={false} />}
          subtitle={<C name="hero.subtitle" defaults={hub.hero.subtitle} />}
          primaryCta={<L k="cta_primary" />}
          primaryHref="#options"
          secondaryCta={<L k="cta_secondary" />}
          secondaryHref={pathFor(lang, "appointment")}
          scroll={<L k="scroll" />}
          testid={`hub-hero-${hub.id}`}
        />
        {hub.oppositeHub && (
          <Link
            to={pathFor(lang, hub.oppositeHub.routeId)}
            data-testid={`hub-opposite-toggle-${hub.id}`}
            className="hidden md:inline-flex absolute right-6 lg:right-10 top-28 lg:top-32 z-20 items-center gap-3 px-4 py-2.5 bg-[#FDFBF7]/12 hover:bg-[#FDFBF7] hover:text-[#1A1513] backdrop-blur-md border border-[#FDFBF7]/35 text-[#FDFBF7] text-[10.5px] tracking-[0.28em] uppercase transition-colors duration-300"
          >
            <ArrowLeftRight className="w-3.5 h-3.5" strokeWidth={1.6} />
            <C name="opposite.label" defaults={hub.oppositeHub.label} multiline={false} />
          </Link>
        )}
      </div>

      {hub.oppositeHub && (
        <div className="md:hidden bg-[#2C2621] text-[#FDFBF7]">
          <Link
            to={pathFor(lang, hub.oppositeHub.routeId)}
            data-testid={`hub-opposite-toggle-mobile-${hub.id}`}
            className="flex items-center justify-center gap-3 px-5 py-3.5 text-[10px] tracking-[0.28em] uppercase hover:bg-[#3A2E25] transition-colors"
          >
            <ArrowLeftRight className="w-3.5 h-3.5" strokeWidth={1.6} />
            <C name="opposite.label" defaults={hub.oppositeHub.label} multiline={false} />
          </Link>
        </div>
      )}

      <StickyNav items={navItems} testid={`hub-nav-${hub.id}`} />

      <Intro intro={hub.intro} lang={lang} />

      <SlotScope id={`hub.${hub.id}`}>
        <OptionsGrid
          options={hub.options}
          programs={hub.programs}
          lang={lang}
          ctaTarget={pathFor(lang, "contact")}
          t={t}
        />
      </SlotScope>

      <CommunityCta
        t={{
          overline: <L k="community.overline" />,
          title: <L k="community.title" />,
          subtitle: <L k="community.subtitle" multiline />,
          body: <L k="community.body" multiline />,
          phone_label: <L k="community.phone_label" />,
          email_label: <L k="community.email_label" />,
          hours_label: <L k="community.hours_label" />,
          hours_value: <L k="community.hours_value" />,
          cta_primary: <L k="community.cta_primary" />,
        }}
        lang={lang}
        image="https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=2400&q=85"
        testid={`hub-community-${hub.id}`}
      />

      <ContactForm />
    </div>
  );
}
