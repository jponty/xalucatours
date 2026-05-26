import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Calendar, MapPin, Plane, Mail, Phone } from "lucide-react";
import { useLanguage, pick } from "@/contexts/LanguageContext";
import { pathFor } from "@/lib/routes";
import ContactForm from "@/components/ContactForm";

/* ============================================================
   EscapadaIntroPage — single-section editorial intro for each
   /viajes/escapadas/* destination. Hero · quick info · description ·
   contact CTA. Designed to be enriched later with day-by-day data
   without breaking the URL.
============================================================ */

const LABELS = {
  es: {
    overline: "Escapadas por Marruecos",
    intro_title: "El destino, en una página.",
    gallery_overline: "Cuatro postales",
    gallery_title: "Rincones que reconocerás de este viaje.",
    gallery_subtitle: "Una selección visual de los lugares más memorables del destino — para que ya empieces a viajar mentalmente antes de hacerlo.",
    quick_duration: "Duración",
    quick_place: "Recorrido",
    quick_airports: "Aeropuertos",
    cta_primary: "Solicitar esta escapada",
    cta_secondary: "Hablar con un asesor",
    return_label: "Ver todas las escapadas",
    contact_overline: "¿Listo para escapar?",
    contact_title: "Diseñemos juntos tu escapada.",
    contact_body: "Cada escapada es 100% a medida. Cuéntanos cuántos días tienes, qué fechas barajas y qué te apetece descubrir — te enviaremos un programa detallado en 24-48 h.",
  },
  en: {
    overline: "Morocco short escapes",
    intro_title: "The destination, on one page.",
    gallery_overline: "Four postcards",
    gallery_title: "Scenes you'll recognise from this trip.",
    gallery_subtitle: "A visual selection of the most memorable corners of the destination — so you start travelling in your head before you set off.",
    quick_duration: "Duration",
    quick_place: "Route",
    quick_airports: "Airports",
    cta_primary: "Request this escape",
    cta_secondary: "Talk to an advisor",
    return_label: "See all escapes",
    contact_overline: "Ready to escape?",
    contact_title: "Let's design your escape together.",
    contact_body: "Every escape is fully tailor-made. Tell us how many days you have, your dates and what you'd like to discover — we will send you a detailed programme within 24-48 h.",
  },
  fr: {
    overline: "Escapades au Maroc",
    intro_title: "La destination, en une page.",
    gallery_overline: "Quatre cartes postales",
    gallery_title: "Des décors que vous reconnaîtrez du voyage.",
    gallery_subtitle: "Une sélection visuelle des lieux les plus marquants — pour commencer à voyager mentalement avant le départ.",
    quick_duration: "Durée",
    quick_place: "Parcours",
    quick_airports: "Aéroports",
    cta_primary: "Demander cette escapade",
    cta_secondary: "Parler à un conseiller",
    return_label: "Voir toutes les escapades",
    contact_overline: "Prêt à vous évader ?",
    contact_title: "Construisons votre escapade ensemble.",
    contact_body: "Chaque escapade est entièrement sur mesure. Dites-nous combien de jours, vos dates et ce que vous souhaitez découvrir — nous vous enverrons un programme détaillé sous 24-48 h.",
  },
};

const Hero = ({ data, lang, t }) => (
  <section
    data-testid="escapada-intro-hero"
    className="relative w-full h-[88vh] min-h-[640px] overflow-hidden bg-[#1A1513] text-[#FDFBF7]"
  >
    <img
      src={data.image}
      alt={pick(data.title, lang)}
      className="absolute inset-0 w-full h-full object-cover opacity-65"
    />
    <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/70" />
    <div className="relative h-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col justify-end pb-24">
      <span className="overline text-[#FDFBF7]/85">{pick(data.eyebrow, lang)}</span>
      <h1 className="font-serif-x text-5xl sm:text-6xl lg:text-[88px] leading-[0.95] tracking-tight mt-6 max-w-4xl">
        {pick(data.title, lang)}
      </h1>
      <p className="font-serif-x-italic text-xl md:text-2xl mt-6 text-[#FDFBF7]/85 max-w-3xl">
        {pick(data.place, lang)}
      </p>
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl">
        <QuickItem Icon={Calendar} label={t.quick_duration} value={pick(data.duration, lang)} />
        <QuickItem Icon={MapPin}   label={t.quick_place}    value={pick(data.place, lang)} />
        <QuickItem Icon={Plane}    label={t.quick_airports} value={pick(data.airports, lang)} />
      </div>
    </div>
  </section>
);

const QuickItem = ({ Icon, label, value }) => (
  <div className="flex items-start gap-3 border-l border-[#FDFBF7]/25 pl-4">
    <Icon className="w-4 h-4 mt-1 text-[#FDFBF7]/70 shrink-0" strokeWidth={1.6} />
    <div className="min-w-0">
      <span className="block text-[10px] tracking-[0.3em] uppercase text-[#FDFBF7]/70">{label}</span>
      <span className="block font-serif-x text-base md:text-lg leading-snug text-[#FDFBF7] mt-1">{value}</span>
    </div>
  </div>
);

const Description = ({ paragraphs, t }) => (
  <section
    data-testid="escapada-intro-description"
    className="relative bg-[#FDFBF7] py-20 md:py-28 overflow-hidden"
  >
    <div className="absolute inset-0 berber-bg-diamond opacity-15 pointer-events-none" aria-hidden="true" />
    <div className="relative max-w-4xl mx-auto px-6 md:px-12">
      <span className="overline text-[#C16542]">{t.intro_title}</span>
      <div className="mt-8 space-y-6 text-[#2C2621]">
        {paragraphs.map((p, i) => (
          <p
            key={p.slice(0, 60)}
            className={
              i === 0
                ? "font-serif-x-italic text-xl md:text-2xl leading-relaxed"
                : "text-base md:text-lg leading-relaxed text-[#5C5248]"
            }
          >
            {p}
          </p>
        ))}
      </div>
    </div>
  </section>
);

/* ============================================================
   Gallery — editorial 4-image grid with asymmetric layout.
   Tall portrait | square | square | wide landscape — varies per row
   to feel curated, not generic.
============================================================ */
const GALLERY_SPANS = [
  "md:col-span-7 md:row-span-2 aspect-[4/5]",     // tall portrait
  "md:col-span-5 aspect-[5/4]",                   // square-ish
  "md:col-span-5 aspect-[5/4]",                   // square-ish
  "md:col-span-12 aspect-[16/7]",                 // wide landscape
];

const Gallery = ({ items, lang, t, accent }) => {
  if (!items || items.length === 0) return null;
  return (
    <section
      data-testid="escapada-intro-gallery"
      className="relative bg-[#F2EBE1] py-20 md:py-28 overflow-hidden"
    >
      <div className="relative max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end mb-12">
          <div className="md:col-span-7">
            <span className="overline" style={{ color: accent }}>{t.gallery_overline}</span>
            <h2 className="font-serif-x text-4xl md:text-5xl lg:text-[54px] leading-[1.05] tracking-tight mt-5 text-[#2C2621]">
              {t.gallery_title}
            </h2>
          </div>
          <div className="md:col-span-5">
            <p className="text-base md:text-lg text-[#5C5248] leading-relaxed">{t.gallery_subtitle}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
          {items.slice(0, 4).map((it, i) => (
            <figure
              key={it.image}
              data-testid={`escapada-gallery-item-${i}`}
              className={`group relative overflow-hidden bg-[#1A1513] ${GALLERY_SPANS[i] || "md:col-span-6 aspect-[5/4]"}`}
            >
              <img
                src={it.image}
                alt={pick(it.kind, lang)}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105 opacity-95"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <figcaption className="absolute inset-x-0 bottom-0 p-5 md:p-7 text-[#FDFBF7]">
                <span
                  className="inline-block text-[10px] tracking-[0.3em] uppercase mb-2"
                  style={{ color: accent }}
                >
                  {pick(it.kind, lang)}
                </span>
                <p className="font-serif-x text-base md:text-lg leading-snug max-w-md">
                  {pick(it.caption, lang)}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
};

const ContactBand = ({ lang, t, accent = "#C16542" }) => (
  <section
    data-testid="escapada-intro-contact"
    className="relative bg-[#2C2621] text-[#FDFBF7] py-20 md:py-24 overflow-hidden"
  >
    <div className="absolute inset-0 berber-bg-diamond opacity-10 pointer-events-none" aria-hidden="true" />
    <div className="relative max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
      <div className="md:col-span-7">
        <span className="overline" style={{ color: accent }}>{t.contact_overline}</span>
        <h2 className="font-serif-x text-4xl md:text-5xl leading-[1.05] tracking-tight mt-5">
          {t.contact_title}
        </h2>
        <p className="text-base md:text-lg text-[#FDFBF7]/80 leading-relaxed mt-5 max-w-xl">
          {t.contact_body}
        </p>
      </div>
      <div className="md:col-span-5 flex flex-col gap-4">
        <Link
          to={pathFor(lang, "contact")}
          data-testid="escapada-intro-cta-primary"
          className="inline-flex items-center justify-between gap-4 px-7 py-5 text-[11px] tracking-[0.25em] uppercase transition-all duration-300 hover:opacity-90 text-[#FDFBF7]"
          style={{ background: accent }}
        >
          {t.cta_primary}
          <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.6} />
        </Link>
        <a
          href="tel:+34937268366"
          data-testid="escapada-intro-cta-phone"
          className="inline-flex items-center gap-3 text-[#FDFBF7]/85 hover:text-[#FDFBF7] transition-colors"
        >
          <Phone className="w-4 h-4" strokeWidth={1.6} /> +34 937 268 366
        </a>
        <a
          href="mailto:xalucatours@xaluca.com"
          data-testid="escapada-intro-cta-mail"
          className="inline-flex items-center gap-3 text-[#FDFBF7]/85 hover:text-[#FDFBF7] transition-colors"
        >
          <Mail className="w-4 h-4" strokeWidth={1.6} /> xalucatours@xaluca.com
        </a>
        <Link
          to={pathFor(lang, "tourShort")}
          data-testid="escapada-intro-cta-back"
          className="inline-flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase text-[#FDFBF7]/65 hover:text-[#FDFBF7] transition-colors mt-2"
        >
          ← {t.return_label}
        </Link>
      </div>
    </div>
  </section>
);

export default function EscapadaIntroPage({ data, accent }) {
  const { lang } = useLanguage();
  const t = LABELS[lang] || LABELS.es;

  useEffect(() => {
    document.title = `${pick(data.hero.title, lang)} · Xaluca Tours`;
    window.scrollTo(0, 0);
  }, [data, lang]);

  const paragraphs = data.intro[lang] || data.intro.es;

  return (
    <div data-testid={`escapada-intro-${data.routeId}`}>
      <Hero data={data.hero} lang={lang} t={t} />
      <Description paragraphs={paragraphs} t={t} />
      <Gallery items={data.gallery} lang={lang} t={t} accent={accent} />
      <ContactBand lang={lang} t={t} accent={accent} />
      <ContactForm />
    </div>
  );
}
