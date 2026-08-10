import React from "react";
import { ArrowRight, MapPin } from "lucide-react";
import { pick } from "@/contexts/LanguageContext";
import { useSlotId } from "@/components/slotScope";
import { getSlotUrl } from "@/components/EditableImage";
import { Img } from "@/components/Img";
import {
  dayGallerySegment,
  resolveGalleryUrl,
  useDayGallery,
} from "@/lib/dayGalleryStore";

const COPY = {
  es: {
    eyebrow: "Cronología del viaje",
    title: "Siete días, de un solo vistazo.",
    body: "Del Atlas al corazón del Sáhara: recorre visualmente cada etapa antes de descubrir el programa completo.",
    day: "Día",
    explore: "Ver esta jornada",
  },
  en: {
    eyebrow: "Journey timeline",
    title: "Seven days, at a glance.",
    body: "From the Atlas to the heart of the Sahara: preview every stage before exploring the full programme.",
    day: "Day",
    explore: "View this day",
  },
  fr: {
    eyebrow: "Chronologie du voyage",
    title: "Sept jours, en un seul regard.",
    body: "De l’Atlas au cœur du Sahara : parcourez chaque étape avant de découvrir le programme complet.",
    day: "Jour",
    explore: "Voir cette journée",
  },
};

const jumpToDay = (event, id) => {
  event.preventDefault();
  const target = document.getElementById(id);
  if (!target) return;
  const header = document.querySelector('[data-testid="site-header"]');
  const programNav = document.querySelector('[data-testid="program-nav"]');
  const dayNav = document.querySelector('[data-testid="program-day-timeline"]');
  const offset = (header?.offsetHeight || 0) + (programNav?.offsetHeight || 0) + (dayNav?.offsetHeight || 0) + 20;
  const top = target.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top, behavior: "smooth" });
};

const ChronologyDayCard = ({ day, index, lang, t }) => {
  // Use the same page-scoped keys and precedence as DayImageGallery. This
  // keeps the chronology tied to the actual gallery curated for this exact
  // day instead of relying on a generic programme image.
  const legacyBase = useSlotId(`day.${day.id}`);
  const indexedKey = useSlotId(dayGallerySegment(index + 1, day.id));
  const indexedGallery = useDayGallery(indexedKey);
  const legacyGallery = useDayGallery(legacyBase);
  const managedGallery = indexedGallery?.length ? indexedGallery : legacyGallery;
  const selectedImage = resolveGalleryUrl(managedGallery?.[0]?.url)
    || getSlotUrl(`${legacyBase}.image`)
    || (Array.isArray(day.gallery) ? day.gallery[0] : null)
    || day.image;
  const dayNumber = String(index + 1).padStart(2, "0");
  const title = pick(day.title, lang);
  const summary = pick(day.chronologySummary || day.body, lang);

  return (
    <article
      data-testid={`journey-chronology-day-${index + 1}`}
      className="group relative min-w-[78vw] snap-center pt-10 sm:min-w-[320px] md:min-w-0"
    >
      <span
        aria-hidden="true"
        className="absolute left-5 top-2 z-10 flex h-5 w-5 items-center justify-center rounded-full border-4 border-[#201A17] shadow-[0_0_0_1px_rgba(212,163,115,0.65)] md:left-1/2 md:-translate-x-1/2"
        style={{ backgroundColor: day.accent || "#D4A373" }}
      />

      <a
        href={`#${day.id}`}
        onClick={(event) => jumpToDay(event, day.id)}
        className="flex h-full min-h-[360px] flex-col overflow-hidden border border-[#FDFBF7]/10 bg-[#2A221E] transition duration-300 hover:-translate-y-1 hover:border-[#D4A373]/60 hover:shadow-[0_24px_45px_-30px_rgba(0,0,0,0.9)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4A373]"
        aria-label={`${t.day} ${index + 1}: ${title}`}
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-[#161210]">
          <Img
            src={selectedImage}
            alt={title}
            width={640}
            sizes="(min-width: 768px) 190px, 78vw"
            priority={index === 0}
            data-testid={`journey-chronology-image-${index + 1}`}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#2A221E] via-transparent to-black/10" />
          <span className="absolute bottom-3 left-3 inline-flex items-center gap-2 bg-[#FDFBF7] px-3 py-2 text-[9px] uppercase tracking-[0.25em] text-[#2C2621]">
            <MapPin className="h-3 w-3 text-[#C16542]" strokeWidth={1.8} />
            {t.day} {dayNumber}
          </span>
        </div>

        <div className="flex flex-1 flex-col p-4 xl:p-5">
          <h3 className="font-serif-x text-[21px] leading-[1.12] text-[#FDFBF7] md:text-lg xl:text-[21px]">
            {title}
          </h3>
          <p className="mt-3 min-h-[80px] text-xs leading-5 text-[#FDFBF7]/60 xl:text-[13px]">
            {summary}
          </p>
          <span className="mt-auto flex items-center gap-2 border-t border-[#FDFBF7]/10 pt-4 text-[9px] uppercase tracking-[0.23em] text-[#D4A373]">
            {t.explore}
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" strokeWidth={1.5} />
          </span>
        </div>
      </a>
    </article>
  );
};

export default function JourneyChronology({ days, lang = "es" }) {
  const t = COPY[lang] || COPY.es;
  if (!Array.isArray(days) || days.length === 0) return null;

  return (
    <section
      id="journey-chronology"
      data-testid="journey-chronology"
      className="relative overflow-hidden bg-[#201A17] py-20 md:py-28"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: "radial-gradient(circle at center, #D4A373 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />

      <div className="relative mx-auto max-w-[1480px] px-5 md:px-10 xl:px-12">
        <div className="mb-12 grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(360px,0.55fr)] lg:items-end md:mb-16">
          <div>
            <p className="flex items-center gap-3 text-[10px] uppercase tracking-[0.32em] text-[#D4A373]">
              <span className="h-px w-8 bg-current" />
              {t.eyebrow}
            </p>
            <h2 className="mt-5 max-w-3xl font-serif-x text-4xl leading-[1.04] text-[#FDFBF7] md:text-5xl lg:text-[58px]">
              {t.title}
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-7 text-[#FDFBF7]/70 md:text-base">
            {t.body}
          </p>
        </div>

        <div className="relative">
          <div aria-hidden="true" className="absolute left-6 right-6 top-[18px] hidden h-px bg-[#D4A373]/35 md:block" />
          <div
            className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-5 md:grid md:grid-cols-7 md:gap-3 md:overflow-visible md:pb-0 xl:gap-4"
            data-testid="journey-chronology-track"
          >
            {days.map((day, index) => (
              <ChronologyDayCard
                key={`${day.id}-${index}`}
                day={day}
                index={index}
                lang={lang}
                t={t}
              />
            ))}
          </div>
        </div>

        <p className="mt-5 text-center text-[9px] uppercase tracking-[0.25em] text-[#FDFBF7]/40 md:hidden">
          Desliza para recorrer los 7 días
        </p>
      </div>
    </section>
  );
}
