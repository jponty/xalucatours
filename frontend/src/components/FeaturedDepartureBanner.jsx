import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CalendarDays, Sparkles } from "lucide-react";
import { useLanguage, pick } from "@/contexts/LanguageContext";
import { pathFor } from "@/lib/routes";
import { UPCOMING_DEPARTURES } from "@/lib/upcomingDepartures";
import EditableImage from "@/components/EditableImage";
import HeroMonogram from "@/components/HeroMonogram";
import XalucaLogoBadge from "@/components/XalucaLogoBadge";

const COPY = {
  eyebrow: { es: "Viaje destacado", en: "Featured journey", fr: "Voyage à la une" },
  title: {
    es: "Fin de Año en Marruecos",
    en: "New Year's Eve in Morocco",
    fr: "Réveillon au Maroc",
  },
  description: {
    es: "Despide el año entre las dunas del Sáhara y los paisajes del Atlas. Descubre una salida especial para empezar 2027 de una forma inolvidable.",
    en: "See out the year among the Sahara dunes and Atlas landscapes. Discover a special departure for an unforgettable start to 2027.",
    fr: "Terminez l'année entre les dunes du Sahara et les paysages de l'Atlas. Découvrez un départ spécial pour commencer 2027 autrement.",
  },
  cta: { es: "Ver viaje", en: "View trip", fr: "Voir le voyage" },
};

export default function FeaturedDepartureBanner() {
  const { lang } = useLanguage();
  const departure = UPCOMING_DEPARTURES.find((trip) => trip.id === "nye-2026");
  if (!departure?.tripRouteId) return null;

  return (
    <section
      aria-labelledby="home-featured-departure-title"
      data-testid="home-featured-departure"
      className="border-b border-[#2C2621]/10 bg-[#F7EFE2] px-4 pt-6 sm:px-6 md:px-12 md:pt-8"
    >
      <div className="mx-auto grid max-w-7xl overflow-hidden border border-[#D4A373]/30 bg-[#2C2621] text-[#FDFBF7] shadow-[0_16px_40px_-24px_rgba(44,38,33,0.4)] md:grid-cols-[minmax(0,0.85fr)_minmax(0,2fr)] lg:grid-cols-[minmax(0,1fr)_minmax(0,2.5fr)]">
        <div className="relative min-h-[160px] overflow-hidden md:min-h-[250px]" data-testid="home-featured-departure-photo">
          {/* Share the trip's editable hero slot so its photograph stays in sync. */}
          <EditableImage
            slot="findeano.hero.bg"
            fallback="https://images.unsplash.com/photo-1542401886-65d6c61db217?auto=format&fit=crop&w=1200&q=85"
            alt=""
            sizes="(min-width: 768px) 30vw, 100vw"
            aspectRatio="16/9"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#1A1513]/65 via-transparent to-transparent" aria-hidden="true" />
          <HeroMonogram testid="home-featured-departure-monogram" />
          <XalucaLogoBadge
            testid="home-featured-departure-logo"
            className="top-4 right-4 h-12 w-12 md:h-14 md:w-14"
          />
          <span className="absolute bottom-4 left-5 border-l-2 border-[#D4A373] pl-3 text-[10px] font-semibold uppercase tracking-[0.18em] sm:left-6">
            {pick(departure.badge, lang)}
          </span>
        </div>

        <div className="grid min-w-0 items-center gap-6 p-6 sm:p-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-8">
          <div className="min-w-0">
            <span className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#D4A373]">
              <Sparkles className="h-3.5 w-3.5 shrink-0" strokeWidth={1.5} aria-hidden="true" />
              {pick(COPY.eyebrow, lang)}
            </span>
            <h2 id="home-featured-departure-title" className="mt-3 font-serif-x text-[30px] leading-[1.12] tracking-tight sm:text-[34px] lg:text-[38px]">
              {pick(COPY.title, lang)}
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#FDFBF7]/80">
              {pick(COPY.description, lang)}
            </p>
            <p className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-[#D4A373]">
              <CalendarDays className="mt-0.5 h-3.5 w-3.5 shrink-0" strokeWidth={1.5} aria-hidden="true" />
              <span>{pick(departure.dates, lang)}</span>
            </p>
          </div>

          <Link
            to={pathFor(lang, departure.tripRouteId)}
            data-testid="home-featured-departure-cta"
            className="xaluca-button group inline-flex min-h-12 w-full items-center justify-center gap-3 border border-[#D4A373] bg-[#D4A373] px-6 py-4 text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-[#2C2621] transition-colors duration-200 hover:border-[#E4BC91] hover:bg-[#E4BC91] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FDFBF7] motion-reduce:transition-none sm:w-fit lg:justify-self-end"
          >
            {pick(COPY.cta, lang)}
            <ArrowRight className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transform-none motion-reduce:transition-none" strokeWidth={1.6} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
