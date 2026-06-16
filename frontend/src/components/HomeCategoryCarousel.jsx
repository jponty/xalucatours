import React, { useRef, useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight, Clock, Compass, MapPin, Users, Headset } from "lucide-react";
import { useLanguage, pick } from "@/contexts/LanguageContext";
import { pathFor } from "@/lib/routes";
import EditableImage from "@/components/EditableImage";
import EditableText from "@/components/EditableText";
import XalucaLogoBadge from "@/components/XalucaLogoBadge";
import CardHighlightsMarquee from "@/components/CardHighlightsMarquee";
import { tripHeroSlot, tripHeroImage, usesTripMaster } from "@/lib/tripHero";

/* ============================================================
   HomeCategoryCarousel — title + lede + horizontal trip cards + CTA
   ------------------------------------------------------------
   Props:
     • testid          — root data-testid
     • eyebrow / title / description / ctaLabel — trilingual {es,en,fr}
     • trips           — array from /lib/homeCarousels.js
     • ctaRouteId      — route id (key from routes.js) for the "view all" link
     • tone            — "cream" | "sand" | "dark"   (background)
     • accent          — primary brand colour for accents (default terracotta)
     • compactMeta     — if true (departures), shows dates/spots instead of route
============================================================ */
const TONES = {
  cream: { bg: "#FDFBF7", ink: "#2C2621", mute: "#5C5248", card: "#FFFFFF", border: "#2C2621" },
  sand:  { bg: "#F2EBE1", ink: "#2C2621", mute: "#5C5248", card: "#FDFBF7", border: "#2C2621" },
  dark:  { bg: "#1A1513", ink: "#FDFBF7", mute: "#FDFBF7", card: "#221C18", border: "#FDFBF7" },
};

const LABELS = {
  es: { prev: "Anterior", next: "Siguiente", view: "Ver viaje", spots_left: "plazas", from: "desde" },
  en: { prev: "Previous", next: "Next", view: "View trip", spots_left: "spots", from: "from" },
  fr: { prev: "Précédent", next: "Suivant", view: "Voir le voyage", spots_left: "places", from: "dès" },
};

const ASSISTANT_LABEL = { es: "Asistente Virtual", en: "Virtual Assistant", fr: "Assistant Virtuel" };

// Open the Chatbase virtual assistant (centralised in lib/chatbase).
import { openChatbaseAssistant } from "@/lib/chatbase";

const TripCard = ({ trip, lang, tone, accent, ctaLabel, compactMeta }) => {
  const tx = LABELS[lang] || LABELS.es;
  const isDark = tone === TONES.dark;
  const cardAccent = trip.accent || accent;
  // Shared per-trip MASTER image: every card linking to the same trip page
  // reads `trip.${routeId}.hero` so the image stays in sync site-wide.
  // Aggregate routes (e.g. upcoming departures) keep their own per-card slot.
  const useMaster = usesTripMaster(trip.routeId);
  const imgSlot = useMaster ? tripHeroSlot(trip.routeId) : `home.cat-carousel.${trip.id}`;
  const imgFallback = (useMaster && tripHeroImage(trip.routeId)) || trip.image;
  return (
    <Link
      to={pathFor(lang, trip.routeId)}
      data-testid={`home-trip-card-${trip.id}`}
      className="snap-start shrink-0 w-[82vw] sm:w-[340px] md:w-[360px] flex flex-col group transition-shadow duration-500 hover:shadow-[0_30px_60px_-30px_rgba(26,21,19,0.4)]"
      style={{ background: tone.card, border: `1px solid ${tone.border}1A` }}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-[#1A1513]">
        <EditableImage
          slot={imgSlot}
          fallback={imgFallback}
          alt={pick(trip.title, lang)}
          imgProps={{ loading: "lazy" }}
          aspectRatio="4/3"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.06]"
        />
        {/* Dedicated bottom-half gradient — soft on top, stronger near
            the title for guaranteed readability on light imagery. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[60%]"
          style={{
            background:
              "linear-gradient(to top, rgba(20,15,12,0.86) 0%, rgba(20,15,12,0.55) 38%, rgba(20,15,12,0.18) 70%, rgba(20,15,12,0) 100%)",
          }}
        />
        <span className="film-grain pointer-events-none opacity-40" aria-hidden="true" />
        <XalucaLogoBadge testid={`home-trip-logo-${trip.id}`} />
        <span
          className="absolute top-4 left-4 inline-flex items-center gap-2 px-2.5 py-1 text-[9px] tracking-[0.3em] uppercase text-white text-on-image z-[2]"
          style={{ background: `${cardAccent}f0` }}
          data-testid={`home-trip-tag-${trip.id}`}
        >
          {pick(trip.tag, lang)}
        </span>
        <div className="absolute inset-x-0 bottom-0 p-5 z-[2]">
          <span className="block text-[10px] tracking-[0.3em] uppercase text-white/90 mb-1.5 text-on-image-strong">
            {pick(trip.duration, lang)}
          </span>
          <h3 className="font-serif-x text-white text-on-image-strong text-[20px] md:text-[22px] leading-[1.12] tracking-tight">
            {pick(trip.title, lang)}
          </h3>
        </div>
      </div>

      {/* Body */}
      <div className="p-5 md:p-6 flex-1 flex flex-col gap-4" style={{ color: tone.ink }}>
        {/* Route / dates */}
        {compactMeta && trip.dates ? (
          <div className="space-y-2">
            <p className="inline-flex items-center gap-2 text-[12px]" style={{ color: tone.mute }}>
              <Clock className="w-3.5 h-3.5 shrink-0" strokeWidth={1.6} style={{ color: cardAccent }} />
              <span>{pick(trip.dates, lang)}</span>
            </p>
            {trip.spots != null && (
              <p className="inline-flex items-center gap-2 text-[12px]" style={{ color: tone.mute }}>
                <Users className="w-3.5 h-3.5 shrink-0" strokeWidth={1.6} style={{ color: cardAccent }} />
                <span>
                  {trip.spots}/{trip.capacity} {tx.spots_left}
                </span>
              </p>
            )}
          </div>
        ) : (
          <p className="inline-flex items-start gap-2 text-[12px] leading-[1.6]" style={{ color: tone.mute }}>
            <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0" strokeWidth={1.6} style={{ color: cardAccent }} />
            <span>{pick(trip.route, lang)}</span>
          </p>
        )}

        {/* Summary */}
        <p className="text-[13.5px] leading-[1.7]" style={{ color: tone.mute }}>
          {pick(trip.summary, lang)}
        </p>

        {/* CTA */}
        <div
          className="mt-auto pt-4 flex items-center justify-between gap-3 border-t"
          style={{ borderColor: `${tone.border}14` }}
        >
          {compactMeta && trip.price ? (
            <span
              className="text-[10px] tracking-[0.28em] uppercase"
              style={{ color: cardAccent, fontWeight: 600 }}
            >
              {tx.from} {trip.price}€
            </span>
          ) : (
            <span
              className="text-[10px] tracking-[0.3em] uppercase"
              style={{ color: cardAccent, fontWeight: 600 }}
            >
              {pick(ctaLabel || { es: "Ver viaje", en: "View trip", fr: "Voir le voyage" }, lang)}
            </span>
          )}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={openChatbaseAssistant}
              data-testid={`home-trip-assistant-${trip.id}`}
              aria-label={pick(ASSISTANT_LABEL, lang)}
              title={pick(ASSISTANT_LABEL, lang)}
              className="inline-flex items-center justify-center w-8 h-8 border transition-colors duration-300 hover:bg-[#2C2621] hover:text-[#FDFBF7]"
              style={{ borderColor: `${tone.border}26`, color: tone.ink }}
            >
              <Headset className="w-3.5 h-3.5" strokeWidth={1.6} />
            </button>
            <span
              className="inline-flex items-center justify-center w-8 h-8 border transition-all duration-300 group-hover:bg-[#2C2621] group-hover:text-[#FDFBF7]"
              style={{
                borderColor: `${tone.border}26`,
                color: tone.ink,
                background: isDark ? "transparent" : "transparent",
              }}
              aria-hidden="true"
            >
              <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.6} />
            </span>
          </div>
        </div>
      </div>

      {/* Highlights ticker — mirrors the trip page "Lugares destacados" */}
      <CardHighlightsMarquee routeId={trip.routeId} testid={`home-trip-highlights-${trip.id}`} />
    </Link>
  );
};

export const HomeCategoryCarousel = ({
  testid = "home-category-carousel",
  eyebrow,
  title,
  description,
  ctaLabel,
  ctaRouteId = "home",
  trips = [],
  tone = "cream",
  accent = "#C16542",
  compactMeta = false,
  cardCtaLabel,
  slotPrefix,           // if provided (e.g. "home.south"), the eyebrow / title /
                        // description / cta become EditableText slots
}) => {
  const { lang } = useLanguage();
  const tx = LABELS[lang] || LABELS.es;
  const palette = TONES[tone] || TONES.cream;
  const isDark = tone === "dark";

  const trackRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const updateProgress = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const p = max <= 0 ? 0 : el.scrollLeft / max;
    setProgress(p);
    setAtStart(el.scrollLeft <= 2);
    setAtEnd(el.scrollLeft >= max - 2);
  }, []);

  useEffect(() => {
    updateProgress();
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
    return () => {
      el.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, [updateProgress, trips.length]);

  const scrollBy = (dir) => {
    if (!trackRef.current) return;
    const card = trackRef.current.querySelector("[data-testid^='home-trip-card-']");
    const step = card ? card.getBoundingClientRect().width + 20 : 360;
    trackRef.current.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  if (trips.length === 0) return null;

  return (
    <section
      data-testid={testid}
      className="relative py-20 md:py-28"
      style={{ background: palette.bg, color: palette.ink }}
    >
      <div className="relative max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-7 md:gap-12 mb-10 md:mb-14">
          <div className="max-w-2xl">
            {eyebrow && (
              <span
                className="inline-flex items-center gap-3 text-[10px] tracking-[0.32em] uppercase"
                style={{ color: accent, fontWeight: 600 }}
              >
                <Compass className="w-3.5 h-3.5" strokeWidth={1.6} />
                {slotPrefix ? (
                  <EditableText
                    slot={`${slotPrefix}.eyebrow`}
                    defaults={eyebrow}
                    multiline={false}
                  />
                ) : (
                  pick(eyebrow, lang)
                )}
                <span className="w-8 h-px" style={{ background: accent, opacity: 0.55 }} />
              </span>
            )}
            {slotPrefix ? (
              <EditableText
                as="h2"
                slot={`${slotPrefix}.title`}
                defaults={title}
                className="font-serif-x text-3xl md:text-4xl lg:text-[44px] leading-[1.08] tracking-tight mt-5 block"
                style={{ color: palette.ink }}
              />
            ) : (
              <h2
                className="font-serif-x text-3xl md:text-4xl lg:text-[44px] leading-[1.08] tracking-tight mt-5"
                style={{ color: palette.ink }}
              >
                {pick(title, lang)}
              </h2>
            )}
            {description && (
              slotPrefix ? (
                <EditableText
                  as="p"
                  slot={`${slotPrefix}.description`}
                  defaults={description}
                  className="mt-5 text-[15px] md:text-base leading-[1.8] max-w-xl block"
                  style={{ color: palette.mute, opacity: isDark ? 0.75 : 1 }}
                />
              ) : (
                <p
                  className="mt-5 text-[15px] md:text-base leading-[1.8] max-w-xl"
                  style={{ color: palette.mute, opacity: isDark ? 0.75 : 1 }}
                >
                  {pick(description, lang)}
                </p>
              )
            )}
          </div>

          {/* Desktop arrows + CTA */}
          <div className="flex items-center gap-2 md:gap-3 self-start md:self-end">
            <button
              type="button"
              onClick={() => scrollBy(-1)}
              disabled={atStart}
              aria-label={tx.prev}
              data-testid={`${testid}-prev`}
              data-edit-allow="true"
              className="hidden md:inline-flex items-center justify-center w-11 h-11 border transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#2C2621] hover:text-[#FDFBF7] hover:border-[#2C2621]"
              style={{ borderColor: `${palette.border}33`, color: palette.ink }}
            >
              <ChevronLeft className="w-4 h-4" strokeWidth={1.6} />
            </button>
            <button
              type="button"
              onClick={() => scrollBy(1)}
              disabled={atEnd}
              aria-label={tx.next}
              data-testid={`${testid}-next`}
              data-edit-allow="true"
              className="hidden md:inline-flex items-center justify-center w-11 h-11 border transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#2C2621] hover:text-[#FDFBF7] hover:border-[#2C2621]"
              style={{ borderColor: `${palette.border}33`, color: palette.ink }}
            >
              <ChevronRight className="w-4 h-4" strokeWidth={1.6} />
            </button>
            <Link
              to={pathFor(lang, ctaRouteId)}
              data-testid={`${testid}-cta`}
              className="ml-2 md:ml-4 inline-flex items-center gap-3 px-6 py-3.5 text-[11px] tracking-[0.25em] uppercase transition-colors duration-300"
              style={{
                background: accent,
                color: "#FDFBF7",
              }}
            >
              {pick(ctaLabel || { es: "Ver todos", en: "View all", fr: "Tout voir" }, lang)}
              <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.7} />
            </Link>
          </div>
        </div>

        {/* Track */}
        <div
          ref={trackRef}
          data-testid={`${testid}-track`}
          className="flex gap-5 md:gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth landmark-track -mx-6 md:mx-0 px-6 md:px-0 pb-2"
        >
          {trips.map((trip) => (
            <TripCard
              key={trip.id}
              trip={trip}
              lang={lang}
              tone={palette}
              accent={accent}
              ctaLabel={cardCtaLabel}
              compactMeta={compactMeta}
            />
          ))}
        </div>

        {/* Progress bar */}
        <div
          className="mt-7 h-px relative overflow-hidden"
          style={{ background: `${palette.border}1F` }}
        >
          <span
            data-testid={`${testid}-progress`}
            className="absolute inset-y-0 left-0 transition-[width] duration-200"
            style={{
              width: `${Math.max(15, progress * 100)}%`,
              background: accent,
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default HomeCategoryCarousel;
