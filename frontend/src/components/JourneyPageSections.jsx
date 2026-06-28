import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight, ArrowLeftRight, Compass, ChevronDown, MapPin, Clock,
  Headphones, Pencil, Award, ShieldCheck, Phone, Mail, Calendar, MessageCircle,
} from "lucide-react";
import { pick } from "@/contexts/LanguageContext";
import { pathFor } from "@/lib/routes";
import { CONTACT } from "@/lib/data";
import { COMMON_NIGHTS } from "@/lib/itineraryHubs";
import EditableImage from "@/components/EditableImage";
import FromPrice from "@/components/FromPrice";
import ImageBrandBadges from "@/components/ImageBrandBadges";
import CardHighlightsMarquee from "@/components/CardHighlightsMarquee";
import HeroMonogram from "@/components/HeroMonogram";
import TripCardActions from "@/components/TripCardActions";
import { useSlotId } from "@/components/slotScope";
import { hubProgramRouteIds } from "@/lib/itineraryHubs";
import { warmTripHero as warmHero } from "@/lib/tripHero";

const PILLAR_ICONS = { Headphones, Pencil, Award, ShieldCheck };

// Collect every deep-linkable routeId for an itinerary so <FromPrice> shows
// that itinerary's real lowest tariff, consistent with the trip detail page
// and the /precios catalogue. Resolves, in order: an explicit `routeIds`
// array, its own `link` + programme `variants`, or the bookable programmes of
// its paired hub (`hubId`).
export const itineraryRouteIds = (it) => {
  if (!it) return [];
  const explicit = Array.isArray(it.routeIds) ? it.routeIds : [];
  const own = [it.link, ...((Array.isArray(it.variants) ? it.variants : []).map((v) => v.link))];
  const fromHub = it.hubId ? hubProgramRouteIds(it.hubId) : [];
  return [...explicit, ...own, ...fromHub].filter(Boolean);
};


/* ============================================================
   JourneyHero — full-bleed cinematic hero used by both gateways.
   The background image is CMS-editable via an auto-namespaced slot
   (`<page>.hero.bg`) so each page keeps its own hero image.
============================================================ */
export const JourneyHero = ({
  image,
  eyebrow,
  place,
  title,
  subtitle,
  intro,
  primaryCta,
  primaryHref = "#itineraries",
  secondaryCta,
  secondaryHref = "#editorial",
  scroll,
  testid = "journey-hero",
  slotId,
}) => {
  const autoSlot = useSlotId("hero.bg");
  const heroSlot = slotId || autoSlot;
  return (
  <section
    data-testid={testid}
    className="relative min-h-[100svh] w-full overflow-hidden bg-[#1A1513]"
  >
    <EditableImage
      slot={heroSlot}
      fallback={image}
      alt=""
      priority
      className="ken-burns absolute inset-0 w-full h-full object-cover"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-[#1A1513]/95 via-[#1A1513]/55 to-[#1A1513]/35" />
    <div className="absolute inset-0 berber-bg-cross opacity-40" aria-hidden="true" />
    <span className="film-grain" />
    <HeroMonogram />

    <div className="relative z-10 min-h-[100svh] flex flex-col">
      <div className="flex-1 flex items-end pt-32 md:pt-44 pb-24 md:pb-32">
        <div className="max-w-7xl mx-auto px-6 md:px-12 w-full">
          <div className="max-w-3xl">
            <div className="fade-up inline-flex items-center gap-3 text-[#D4A373]">
              <Compass className="w-3.5 h-3.5" strokeWidth={1.6} />
              <span className="text-[11px] tracking-[0.35em] uppercase font-semibold">{eyebrow}</span>
              {place && (
                <>
                  <span className="w-8 h-px bg-[#D4A373]/50" />
                  <span className="text-[10px] tracking-[0.3em] uppercase text-[#D4A373]/80">{place}</span>
                </>
              )}
            </div>
            <h1 className="fade-up fade-up-delay-1 font-serif-x text-[#FDFBF7] text-on-image text-5xl md:text-6xl lg:text-7xl leading-[1.02] tracking-tight mt-6">
              {title}
            </h1>
            <p className="fade-up fade-up-delay-2 mt-8 max-w-2xl text-base md:text-lg text-[#FDFBF7]/85 leading-relaxed text-on-image">
              {subtitle}
            </p>
            {intro && (
              <p className="fade-up fade-up-delay-3 mt-4 max-w-2xl text-sm md:text-base text-[#FDFBF7]/75 leading-relaxed text-on-image">
                {intro}
              </p>
            )}
            <div className="fade-up fade-up-delay-4 mt-10 flex flex-wrap items-center gap-4">
              <a
                href={primaryHref}
                data-testid={`${testid}-cta-primary`}
                className="inline-flex items-center gap-3 bg-[#C16542] hover:bg-[#A35133] text-[#FDFBF7] px-8 py-4 text-[11px] tracking-[0.25em] uppercase transition-colors"
              >
                {primaryCta}
                <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.6} />
              </a>
              {secondaryCta && (
                secondaryHref?.startsWith("/") ? (
                  <Link
                    to={secondaryHref}
                    data-testid={`${testid}-cta-secondary`}
                    className="inline-flex items-center gap-3 border border-[#FDFBF7]/40 hover:border-[#FDFBF7] hover:bg-[#FDFBF7] hover:text-[#1A1513] text-[#FDFBF7] px-7 py-4 text-[11px] tracking-[0.25em] uppercase transition-all duration-300"
                  >
                    {secondaryCta}
                    <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
                  </Link>
                ) : (
                  <a
                    href={secondaryHref}
                    data-testid={`${testid}-cta-secondary`}
                    className="inline-flex items-center gap-3 border border-[#FDFBF7]/40 hover:border-[#FDFBF7] hover:bg-[#FDFBF7] hover:text-[#1A1513] text-[#FDFBF7] px-7 py-4 text-[11px] tracking-[0.25em] uppercase transition-all duration-300"
                  >
                    {secondaryCta}
                    <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
                  </a>
                )
              )}
            </div>
          </div>
        </div>
      </div>

      <a
        href={primaryHref}
        data-testid={`${testid}-scroll`}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 inline-flex flex-col items-center gap-2 text-[#FDFBF7]/65 hover:text-[#D4A373] transition-colors"
      >
        <span className="text-[10px] tracking-[0.35em] uppercase">{scroll}</span>
        <ChevronDown className="w-4 h-4 animate-bounce" strokeWidth={1.5} />
      </a>
    </div>
  </section>
  );
};

/* ============================================================
   StickyNav — anchor chips that follow the user as they scroll
============================================================ */
export const StickyNav = ({ items, testid = "journey-sticky-nav" }) => {
  const [active, setActive] = useState(items[0]?.id);
  const [pinned, setPinned] = useState(false);

  useEffect(() => {
    const handler = () => {
      setPinned(window.scrollY > 600);
      // detect active section
      let current = items[0]?.id;
      for (const item of items) {
        const el = document.getElementById(item.id);
        if (el) {
          const top = el.getBoundingClientRect().top;
          if (top <= 140) current = item.id;
        }
      }
      setActive(current);
    };
    window.addEventListener("scroll", handler, { passive: true });
    handler();
    return () => window.removeEventListener("scroll", handler);
  }, [items]);

  return (
    <nav
      data-testid={testid}
      aria-label="Section navigation"
      className={`sticky top-0 z-30 transition-all duration-500 ${
        pinned ? "bg-[#1A1513]/90 backdrop-blur-md border-b border-[#FDFBF7]/10" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center gap-2 md:gap-4 overflow-x-auto py-3 md:py-4 no-scrollbar">
          {items.map((it) => (
            <a
              key={it.id}
              href={`#${it.id}`}
              data-testid={`${testid}-${it.id}`}
              className={`shrink-0 text-[10px] md:text-[11px] tracking-[0.25em] uppercase px-3 md:px-4 py-2 border transition-all duration-300 ${
                active === it.id
                  ? "bg-[#D4A373] text-[#1A1513] border-[#D4A373]"
                  : pinned
                  ? "border-[#FDFBF7]/25 text-[#FDFBF7]/80 hover:text-[#FDFBF7] hover:border-[#FDFBF7]/60"
                  : "border-[#FDFBF7]/0 text-[#FDFBF7]/0 pointer-events-none"
              }`}
            >
              {it.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
};

/* ============================================================
   ItineraryBlock — one of the editorial routes (alternating layout)
============================================================ */
export const ItineraryBlock = ({ itinerary, index, lang, t, ctaTarget }) => {
  const reverse = index % 2 === 1;
  const paragraphs = pick(itinerary.body, lang) || [];
  const stages = (itinerary.stages || []).map((s) => pick(s, lang));
  const imgSlot = useSlotId(`itinerary.${itinerary.id}.image`);

  return (
    <section
      id={itinerary.id}
      data-testid={`itinerary-${itinerary.id}`}
      className="relative bg-[#FDFBF7] py-24 md:py-32 overflow-hidden"
    >
      <div className="absolute inset-0 berber-bg-diamond opacity-25 pointer-events-none" aria-hidden="true" />

      <div className="relative max-w-7xl mx-auto px-6 md:px-12">
        <div className={`grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center ${reverse ? "lg:[direction:rtl]" : ""}`}>
          {/* Image */}
          <div className="lg:col-span-6 lg:[direction:ltr]">
            <div className="relative aspect-[4/5] md:aspect-[5/6] overflow-hidden bg-[#1A1513]">
              <EditableImage
                slot={imgSlot}
                fallback={itinerary.image}
                alt={pick(itinerary.title, lang)}
                aspectRatio="4/5"
                imgProps={{ loading: "lazy" }}
                className="ken-burns absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A1513]/55 via-transparent to-transparent pointer-events-none" />
              <span className="film-grain" />

              {/* Stage counter chip */}
              <div className="absolute top-5 left-5 inline-flex items-center gap-3 bg-[#FDFBF7]/95 backdrop-blur-sm px-4 py-2">
                <span
                  className="font-serif-x text-xl leading-none"
                  style={{ color: itinerary.accent }}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="text-[10px] tracking-[0.3em] uppercase text-[#2C2621]">
                  {pick(itinerary.eyebrow, lang)}
                </span>
              </div>

              {/* Duration chip */}
              <div className="absolute bottom-5 left-5 inline-flex items-center gap-2 bg-[#1A1513]/70 backdrop-blur-sm text-[#FDFBF7] px-4 py-2 text-[10px] tracking-[0.25em] uppercase">
                <Clock className="w-3 h-3" strokeWidth={1.6} />
                {pick(itinerary.duration, lang)}
              </div>

              <ImageBrandBadges testid={`itinerary-${itinerary.id}`} />
            </div>
          </div>

          {/* Text */}
          <div className="lg:col-span-6 lg:[direction:ltr]">
            <span
              className="inline-flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase"
              style={{ color: itinerary.accent }}
            >
              <span className="w-6 h-px" style={{ background: "currentColor" }} />
              {pick(itinerary.eyebrow, lang)}
            </span>
            <h2 className="font-serif-x text-4xl md:text-5xl lg:text-[54px] leading-[1.05] tracking-tight mt-5 text-[#2C2621]">
              {pick(itinerary.title, lang)}
            </h2>

            {/* Stages chips */}
            <ul className="mt-8 flex flex-wrap gap-2" data-testid={`itinerary-stages-${itinerary.id}`}>
              {stages.map((s) => (
                <li
                  key={`${itinerary.id}-stage-${s}`}
                  className="inline-flex items-center gap-2 text-[10px] tracking-[0.25em] uppercase px-3 py-1.5 border"
                  style={{ borderColor: `${itinerary.accent}55`, color: itinerary.accent }}
                >
                  <MapPin className="w-3 h-3" strokeWidth={1.6} />
                  {s}
                </li>
              ))}
            </ul>

            {/* Body paragraphs */}
            <div className="mt-8 space-y-5 text-[15px] md:text-base text-[#5C5248] leading-[1.75]">
              {paragraphs.map((p, i) => (
                <p key={`${itinerary.id}-body-${i}`} className={i === 0 ? "font-serif-x-italic text-lg md:text-xl text-[#2C2621]" : ""}>
                  {p}
                </p>
              ))}
            </div>

            <div className="mt-8">
              <FromPrice tone="dark" size="md" routeIds={itineraryRouteIds(itinerary)} testid={`itinerary-from-${itinerary.id}`} />
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <Link
                to={itinerary.link ? pathFor(lang, itinerary.link) : ctaTarget}
                data-testid={`itinerary-cta-${itinerary.id}`}
                className="inline-flex items-center gap-3 text-[#FDFBF7] px-7 py-4 text-[11px] tracking-[0.25em] uppercase transition-all duration-300 hover:opacity-90"
                style={{ background: itinerary.accent }}
              >
                {itinerary.link ? (t.cta_view || t.cta_request) : t.cta_request}
                <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.6} />
              </Link>
              <a
                href="#asesoramiento"
                data-testid={`itinerary-cta-info-${itinerary.id}`}
                className="inline-flex items-center gap-3 border border-[#2C2621]/25 hover:border-[#2C2621] hover:bg-[#2C2621] hover:text-[#FDFBF7] text-[#2C2621] px-7 py-4 text-[11px] tracking-[0.25em] uppercase transition-all duration-300"
              >
                {t.cta_info}
              </a>
            </div>

            {/* Related hub chips (alternative directions / general hubs) */}
            {Array.isArray(itinerary.relatedHubs) && itinerary.relatedHubs.length > 0 && (
              <ul
                className="mt-6 flex flex-wrap gap-2"
                data-testid={`itinerary-related-${itinerary.id}`}
              >
                {itinerary.relatedHubs.map((rh, i) => (
                  <li key={rh.link}>
                    <Link
                      to={pathFor(lang, rh.link)}
                      data-testid={`itinerary-related-link-${itinerary.id}-${i}`}
                      className="inline-flex items-center gap-2 px-3.5 py-2 text-[10px] tracking-[0.22em] uppercase border border-[#2C2621]/20 hover:border-[#2C2621] hover:bg-[#2C2621] hover:text-[#FDFBF7] text-[#2C2621] transition-all duration-300"
                    >
                      <ArrowLeftRight className="w-3 h-3" strokeWidth={1.7} />
                      {pick(rh.label, lang)}
                    </Link>
                  </li>
                ))}
              </ul>
            )}

            {/* Programme variants list (specific deep-linked itineraries) */}
            {Array.isArray(itinerary.variants) && itinerary.variants.length > 0 && (
              <div className="mt-10 pt-8 border-t border-[#2C2621]/10" data-testid={`itinerary-variants-${itinerary.id}`}>
                <span
                  className="inline-flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase"
                  style={{ color: itinerary.accent }}
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: itinerary.accent }} />
                  {t.variants_overline || "Opciones de viaje"}
                </span>
                <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {itinerary.variants.map((v, i) => (
                    <li key={v.link}>
                      <Link
                        to={pathFor(lang, v.link)}
                        data-testid={`itinerary-variant-link-${itinerary.id}-${i}`}
                        onMouseEnter={() => warmHero(v.link)}
                        onFocus={() => warmHero(v.link)}
                        className="group flex items-center justify-between gap-3 px-4 py-3 border bg-[#FDFBF7]/70 border-[#2C2621]/15 hover:bg-[#2C2621] hover:border-[#2C2621] transition-all duration-300"
                        style={{ boxShadow: `inset 3px 0 0 ${itinerary.accent}` }}
                      >
                        <span className="text-[13px] md:text-[14px] text-[#2C2621] group-hover:text-[#FDFBF7] leading-snug transition-colors">
                          {pick(v.label, lang)}
                        </span>
                        <ArrowRight
                          className="w-3.5 h-3.5 shrink-0 text-[#5C5248] group-hover:text-[#FDFBF7] transition-all duration-300 group-hover:translate-x-0.5"
                          strokeWidth={1.6}
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

/* ============================================================
   EditorialBlock — cinematic narrative essay (full bleed image + body)
============================================================ */
export const EditorialBlock = ({ block, lang }) => {
  const paragraphs = pick(block.body, lang) || [];
  const imgSlot = useSlotId(`editorial.${block.id}.image`);
  return (
    <section
      id={block.id}
      data-testid={`editorial-${block.id}`}
      className="relative bg-[#F5EFE3] text-[#2C2621] overflow-hidden"
    >
      {/* Lateral berber pattern columns — echo the footer aesthetic */}
      <div
        className="hidden md:block absolute inset-y-0 left-0 w-20 lg:w-28 pointer-events-none berber-bg-cross opacity-30"
        aria-hidden="true"
      />
      <div
        className="hidden md:block absolute inset-y-0 right-0 w-20 lg:w-28 pointer-events-none berber-bg-cross opacity-30"
        aria-hidden="true"
      />
      <div className="hidden md:block absolute inset-y-0 left-20 lg:left-28 w-px bg-gradient-to-b from-transparent via-[#A07042]/30 to-transparent pointer-events-none" aria-hidden="true" />
      <div className="hidden md:block absolute inset-y-0 right-20 lg:right-28 w-px bg-gradient-to-b from-transparent via-[#A07042]/30 to-transparent pointer-events-none" aria-hidden="true" />

      <div className="relative h-[70svh] min-h-[420px] w-full overflow-hidden">
        <EditableImage
          slot={imgSlot}
          fallback={block.image}
          alt=""
          priority
          aspectRatio="16/9"
          className="ken-burns absolute inset-0 w-full h-full object-cover"
        />
        {/* Softer base overlay — the image breathes */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1513]/55 via-[#1A1513]/10 to-transparent pointer-events-none" />
        {/* Localised reading shade behind the title only (bottom 45%) */}
        <div className="absolute inset-x-0 bottom-0 h-[45%] bg-gradient-to-t from-[#1A1513]/85 via-[#1A1513]/55 to-transparent" />
        <span className="film-grain opacity-40" />

        <ImageBrandBadges testid={`editorial-${block.id}`} monogramVariant="large-border" />

        <div className="relative h-full max-w-5xl mx-auto px-6 md:px-12 flex flex-col justify-end pb-12 md:pb-16">
          <span className="overline text-[#D4A373] drop-shadow-[0_1px_8px_rgba(26,21,19,0.65)]">
            {pick(block.eyebrow, lang)}
          </span>
          <h2 className="font-serif-x text-4xl md:text-5xl lg:text-6xl leading-[1.05] tracking-tight mt-5 max-w-3xl text-[#FDFBF7] drop-shadow-[0_2px_18px_rgba(26,21,19,0.55)]">
            {pick(block.title, lang)}
          </h2>
        </div>
      </div>

      <div className="relative py-20 md:py-28">
        <div className="absolute inset-0 berber-bg-diamond opacity-[0.08] pointer-events-none" aria-hidden="true" />
        <div className="relative max-w-3xl mx-auto px-6 md:px-12 space-y-7 text-[15px] md:text-base text-[#3D352C] leading-[1.85]">
          {paragraphs.map((p, i) => (
            <p
              key={i}
              className={i === 0 ? "font-serif-x-italic text-xl md:text-2xl text-[#A07042]" : ""}
            >
              {p}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ============================================================
   CtaBand — closing CTA band used after itinerary list
============================================================ */
export const CtaBand = ({ t, lang, testid = "journey-cta-band" }) => (
  <section
    id="asesoramiento"
    data-testid={testid}
    className="relative bg-[#F2EBE1] py-20 md:py-28 overflow-hidden"
  >
    <div className="absolute inset-0 berber-bg-diamond opacity-30 pointer-events-none" aria-hidden="true" />
    <div className="relative max-w-5xl mx-auto px-6 md:px-12 text-center">
      <span className="overline">{t.overline}</span>
      <h2 className="font-serif-x text-4xl md:text-5xl lg:text-[54px] leading-[1.05] tracking-tight mt-5 text-[#2C2621]">
        {t.title}
      </h2>
      <p className="mt-6 font-serif-x-italic text-xl md:text-2xl text-[#5C5248] max-w-3xl mx-auto leading-[1.5]">
        {t.body}
      </p>
      <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
        <Link
          to={pathFor(lang, "contact")}
          data-testid={`${testid}-contact`}
          className="inline-flex items-center gap-3 bg-[#C16542] hover:bg-[#A35133] text-[#FDFBF7] px-8 py-4 text-[11px] tracking-[0.25em] uppercase transition-colors"
        >
          {t.cta_primary}
          <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.6} />
        </Link>
        <Link
          to={pathFor(lang, "appointment")}
          data-testid={`${testid}-appointment`}
          className="inline-flex items-center gap-3 border border-[#2C2621]/25 hover:border-[#2C2621] hover:bg-[#2C2621] hover:text-[#FDFBF7] text-[#2C2621] px-7 py-4 text-[11px] tracking-[0.25em] uppercase transition-all duration-300"
        >
          {t.cta_secondary}
        </Link>
      </div>
    </div>
  </section>
);

/* ============================================================
   ItinerariesOverview — quick-jump grid of itinerary cards
============================================================ */
export const ItinerariesOverview = ({ itineraries, t, lang }) => (
  <section
    id="itineraries"
    data-testid="itineraries-overview"
    className="relative bg-[#FDFBF7] py-20 md:py-28 overflow-hidden"
  >
    <div className="relative max-w-7xl mx-auto px-6 md:px-12">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end mb-12">
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

      <div
        className={`grid gap-6 md:gap-8 grid-cols-1 sm:grid-cols-2 ${
          itineraries.length >= 4 ? "lg:grid-cols-4" : itineraries.length === 3 ? "lg:grid-cols-3" : "lg:grid-cols-2"
        }`}
      >
        {itineraries.map((it, idx) => (
          <a
            key={it.id}
            href={`#${it.id}`}
            data-testid={`overview-card-${it.id}`}
            className="group relative block overflow-hidden h-[420px] md:h-[440px]"
          >
            <EditableImage
              slot={`overview.${it.id}.image`}
              fallback={it.image}
              alt={pick(it.title, lang)}
              aspectRatio="4/5"
              imgProps={{ loading: "lazy" }}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.06]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1A1513]/95 via-[#1A1513]/50 to-[#1A1513]/10 pointer-events-none" />
            <span className="film-grain" />

            <ImageBrandBadges testid={`overview-${it.id}`} />

            <div className="absolute inset-0 p-6 md:p-7 flex flex-col justify-end text-[#FDFBF7]">
              <span
                className="text-[10px] tracking-[0.3em] uppercase"
                style={{ color: it.accent === "#3A4A5F" ? "#D4A373" : it.accent }}
              >
                {String(idx + 1).padStart(2, "0")} · {pick(it.duration, lang)}
              </span>
              <h3 className="font-serif-x text-2xl md:text-[26px] leading-[1.1] mt-3">
                {pick(it.title, lang)}
              </h3>
              <div className="mt-3">
                <FromPrice tone="light" size="sm" routeIds={itineraryRouteIds(it)} testid={`overview-from-${it.id}`} />
              </div>
              <span className="mt-4 inline-flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase text-[#D4A373] group-hover:gap-4 transition-all duration-300">
                {t.cta}
                <ArrowRight className="w-3 h-3" strokeWidth={1.5} />
              </span>
            </div>
          </a>
        ))}
      </div>
    </div>
  </section>
);


/* ============================================================
   WhyXaluca — 4 brand pillars (Atención 24/7, Personalización, Calidad, Garantía)
============================================================ */
export const WhyXaluca = ({ pillars, t, lang, testid = "why-xaluca", variant = "light" }) => {
  const isDark = variant === "dark";
  return (
    <section
      id="why-xaluca"
      data-testid={testid}
      className={`relative py-24 md:py-32 overflow-hidden ${
        isDark ? "bg-[#1A1513] text-[#FDFBF7]" : "bg-[#FDFBF7] text-[#2C2621]"
      }`}
    >
      <div className={`absolute inset-0 berber-bg-cross pointer-events-none ${isDark ? "opacity-40" : "opacity-20"}`} aria-hidden="true" />
      {isDark && <span className="film-grain" />}

      <div className="relative max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end mb-14">
          <div className="md:col-span-7">
            <span className={`overline ${isDark ? "text-[#D4A373]" : ""}`}>{t.overline}</span>
            <h2 className="font-serif-x text-4xl md:text-5xl lg:text-[54px] leading-[1.05] tracking-tight mt-5">
              {t.title}
            </h2>
          </div>
          <div className="md:col-span-5">
            <p className={`text-base md:text-lg leading-relaxed ${isDark ? "text-[#FDFBF7]/75" : "text-[#5C5248]"}`}>
              {t.body}
            </p>
          </div>
        </div>

        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px ${
          isDark ? "bg-[#FDFBF7]/10 border border-[#FDFBF7]/15" : "bg-[#2C2621]/10 border border-[#2C2621]/10"
        }`}>
          {pillars.map((p, i) => {
            const Icon = PILLAR_ICONS[p.icon] || ShieldCheck;
            return (
              <article
                key={p.id}
                data-testid={`${testid}-pillar-${p.id}`}
                className={`relative p-7 md:p-9 flex flex-col gap-5 transition-colors duration-500 ${
                  isDark ? "bg-[#1A1513] hover:bg-[#221A16]" : "bg-[#FDFBF7] hover:bg-[#F2EBE1]"
                }`}
              >
                <span className="text-[10px] tracking-[0.3em] uppercase text-[#D4A373]">
                  0{i + 1}
                </span>
                <span
                  className="inline-flex items-center justify-center w-12 h-12 rounded-full border"
                  style={{ borderColor: isDark ? "rgba(212,163,115,0.5)" : "rgba(193,101,66,0.4)", color: isDark ? "#D4A373" : "#C16542" }}
                >
                  <Icon className="w-5 h-5" strokeWidth={1.5} />
                </span>
                <h3 className="font-serif-x text-2xl md:text-[26px] leading-[1.1]">
                  {pick(p.title, lang)}
                </h3>
                <p className={`text-sm leading-relaxed ${isDark ? "text-[#FDFBF7]/75" : "text-[#5C5248]"}`}>
                  {pick(p.body, lang)}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

/* ============================================================
   CommunityCta — closing block with phone, email, hours and CTAs
============================================================ */
export const CommunityCta = ({ t, lang, testid = "community-cta", image }) => (
  <section
    id="community"
    data-testid={testid}
    className="relative bg-[#1A1513] text-[#FDFBF7] overflow-hidden py-24 md:py-32"
  >
    {image && (
      <>
        <EditableImage
          slot={`section.${testid}.bg`}
          fallback={image}
          alt=""
          aspectRatio="16/9"
          imgProps={{ loading: "lazy" }}
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1A1513]/85 via-[#1A1513]/75 to-[#1A1513]/95 pointer-events-none" />
        <ImageBrandBadges testid={testid} />
      </>
    )}
    <div className="absolute inset-0 berber-bg-cross opacity-40" aria-hidden="true" />
    <span className="film-grain" />

    <div className="relative max-w-5xl mx-auto px-6 md:px-12 text-center">
      <span className="overline text-[#D4A373]">{t.overline}</span>
      <h2 className="font-serif-x text-4xl md:text-5xl lg:text-6xl leading-[1.05] tracking-tight mt-5">
        {t.title}
      </h2>
      <p className="mt-6 font-serif-x-italic text-xl md:text-2xl text-[#D4A373]/90 max-w-3xl mx-auto leading-[1.5]">
        {t.subtitle}
      </p>
      <p className="mt-6 text-base md:text-lg text-[#FDFBF7]/80 max-w-3xl mx-auto leading-relaxed">
        {t.body}
      </p>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 text-left">
        <a href={`tel:${CONTACT.phoneRaw}`} data-testid={`${testid}-phone`}
           className="group bg-[#FDFBF7]/[0.06] backdrop-blur-md border border-[#FDFBF7]/15 hover:border-[#D4A373]/50 p-6 md:p-7 transition-all duration-500">
          <span className="overline text-[#D4A373]">{t.phone_label}</span>
          <p className="mt-3 flex items-center gap-3 font-serif-x text-xl text-[#FDFBF7] group-hover:text-[#D4A373] transition-colors">
            <Phone className="w-5 h-5 text-[#D4A373]" strokeWidth={1.5} />
            {CONTACT.phone}
          </p>
        </a>
        <a href={`mailto:${CONTACT.email}`} data-testid={`${testid}-email`}
           className="group bg-[#FDFBF7]/[0.06] backdrop-blur-md border border-[#FDFBF7]/15 hover:border-[#D4A373]/50 p-6 md:p-7 transition-all duration-500">
          <span className="overline text-[#D4A373]">{t.email_label}</span>
          <p className="mt-3 flex items-center gap-3 font-serif-x text-xl text-[#FDFBF7] group-hover:text-[#D4A373] transition-colors break-all">
            <Mail className="w-5 h-5 text-[#D4A373]" strokeWidth={1.5} />
            {CONTACT.email}
          </p>
        </a>
        <div className="bg-[#FDFBF7]/[0.06] backdrop-blur-md border border-[#FDFBF7]/15 p-6 md:p-7">
          <span className="overline text-[#D4A373]">{t.hours_label}</span>
          <p className="mt-3 flex items-center gap-3 font-serif-x text-xl text-[#FDFBF7]">
            <Calendar className="w-5 h-5 text-[#D4A373]" strokeWidth={1.5} />
            {t.hours_value}
          </p>
        </div>
      </div>

      <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
        <Link to={pathFor(lang, "contact")} data-testid={`${testid}-cta-contact`}
              className="inline-flex items-center gap-3 bg-[#C16542] hover:bg-[#A35133] text-[#FDFBF7] px-8 py-4 text-[11px] tracking-[0.25em] uppercase transition-colors">
          {t.cta_primary}
          <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.6} />
        </Link>
        <a href={`https://wa.me/${CONTACT.phoneRaw.replace("+", "")}`} target="_blank" rel="noreferrer"
           data-testid={`${testid}-cta-wa`}
           className="inline-flex items-center gap-3 border border-[#FDFBF7]/40 hover:border-[#FDFBF7] hover:bg-[#FDFBF7] hover:text-[#1A1513] text-[#FDFBF7] px-7 py-4 text-[11px] tracking-[0.25em] uppercase transition-all duration-300">
          <MessageCircle className="w-3.5 h-3.5" strokeWidth={1.6} />
          WhatsApp
        </a>
      </div>
    </div>
  </section>
);

/* ============================================================
   CatalogTeaser — "Descubre todos nuestros circuitos" link card
============================================================ */
export const HubOptionsPreview = ({ hub, lang, labels = {}, testid }) => {
  const groupedKeys = Array.from(new Set(hub.programs.map((p) => p.direction)));
  const getLabel = (k) => k === "a" ? pick(hub.options.group_a, lang) : pick(hub.options.group_b, lang);
  const cardLabel = labels.card_label || (lang === "es" ? "Próximamente" : lang === "fr" ? "Bientôt disponible" : "Coming soon");

  return (
    <section
      data-testid={testid || `hub-preview-${hub.id}`}
      className="relative bg-[#F2EBE1] py-20 md:py-24 overflow-hidden"
    >
      <div className="absolute inset-0 berber-bg-diamond opacity-25 pointer-events-none" aria-hidden="true" />
      <div className="relative max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end mb-12">
          <div className="md:col-span-7">
            <span className="overline">{pick(hub.options.overline, lang)}</span>
            <h3 className="font-serif-x text-3xl md:text-4xl lg:text-[44px] leading-[1.1] tracking-tight mt-5 text-[#2C2621]">
              {pick(hub.options.title, lang)}
            </h3>
          </div>
          <div className="md:col-span-5">
            <p className="text-base md:text-lg text-[#5C5248] leading-relaxed">{pick(hub.options.body, lang)}</p>
          </div>
        </div>

        {groupedKeys.map((k) => {
          const items = hub.programs.filter((p) => p.direction === k);
          return (
            <div key={k} className="mb-12 last:mb-0">
              <div className="flex items-center gap-3 mb-6">
                <span className="font-serif-x text-xl md:text-2xl text-[#2C2621]">{getLabel(k)}</span>
                <span className="flex-1 h-px bg-[#2C2621]/15" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {items.map((p) => {
                  const overlay = (
                    <>
                      <EditableImage
                        slot={`hub.${hub.id}.preview.${p.id}`}
                        fallback={p.image}
                        alt=""
                        aspectRatio="3/4"
                        imgProps={{ loading: "lazy" }}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.06]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#1A1513]/95 via-[#1A1513]/55 to-[#1A1513]/10 pointer-events-none" />
                      <span className="film-grain" />
                      <ImageBrandBadges testid={`hub-${hub.id}-${p.id}`} monogramPosition="top-left" />
                      <div className="absolute inset-0 p-6 md:p-7 pb-14 md:pb-16 flex flex-col justify-end text-[#FDFBF7] pointer-events-none z-[3]">
                        <span className="text-[10px] tracking-[0.3em] uppercase" style={{ color: p.accent }}>
                          {getLabel(k)}
                        </span>
                        <h4 className="font-serif-x text-2xl md:text-[26px] leading-[1.05] mt-3 inline-flex items-center gap-3">
                          <Clock className="w-5 h-5 text-[#D4A373]" strokeWidth={1.4} />
                          {pick(COMMON_NIGHTS[p.nights], lang)}
                        </h4>
                        <p className="mt-3 text-sm text-[#FDFBF7]/80 leading-relaxed line-clamp-3">
                          {pick(p.blurb, lang)}
                        </p>
                        <span className="mt-5 inline-flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase text-[#D4A373]/90 group-hover:gap-4 transition-all duration-300">
                          {p.link ? (labels.card_active || (lang === "es" ? "Ver itinerario" : lang === "fr" ? "Voir l'itinéraire" : "View itinerary")) : cardLabel}
                          {p.link && <ArrowRight className="w-3 h-3" strokeWidth={1.5} />}
                        </span>
                        {p.link && (
                          <div className="mt-4 pointer-events-auto">
                            <TripCardActions
                              lang={lang}
                              routeId={p.link}
                              testidBase={`hub-preview-${p.id}`}
                              tone="dark"
                            />
                          </div>
                        )}
                      </div>
                    </>
                  );
                  if (p.link) {
                    return (
                      <div
                        key={p.id}
                        data-testid={`hub-preview-card-${p.id}`}
                        className="group relative overflow-hidden h-[460px]"
                      >
                        <Link
                          to={pathFor(lang, p.link)}
                          data-testid={`hub-preview-link-${p.id}`}
                          aria-label={pick(COMMON_NIGHTS[p.nights], lang)}
                          className="absolute inset-0 z-[2]"
                        />
                        {overlay}
                        {/* Highlights ticker — mirrors the trip page "Lugares destacados" */}
                        <CardHighlightsMarquee routeId={p.link} variant="overlay" testid={`hub-preview-highlights-${p.id}`} />
                      </div>
                    );
                  }
                  return (
                    <article
                      key={p.id}
                      data-testid={`hub-preview-card-${p.id}`}
                      aria-disabled="true"
                      className="group relative block overflow-hidden h-[460px] cursor-not-allowed"
                    >
                      {overlay}
                    </article>
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

export const CatalogTeaser = ({ t, lang, testid = "catalog-teaser", image }) => (
  <section
    data-testid={testid}
    className="relative overflow-hidden h-[60svh] min-h-[420px] bg-[#1A1513]"
  >
    <EditableImage
      slot={`section.${testid}.bg`}
      fallback={image}
      alt=""
      aspectRatio="16/9"
      imgProps={{ loading: "lazy" }}
      className="ken-burns absolute inset-0 w-full h-full object-cover opacity-60"
    />
    <div className="absolute inset-0 bg-gradient-to-r from-[#1A1513]/95 via-[#1A1513]/60 to-[#1A1513]/30 pointer-events-none" />
    <div className="absolute inset-0 berber-bg-cross opacity-30" aria-hidden="true" />
    <span className="film-grain" />

    <ImageBrandBadges testid={testid} />

    <div className="relative h-full max-w-7xl mx-auto px-6 md:px-12 flex items-center">
      <div className="max-w-2xl text-[#FDFBF7]">
        <span className="overline text-[#D4A373]">{t.overline}</span>
        <h2 className="font-serif-x text-4xl md:text-5xl lg:text-[54px] leading-[1.05] tracking-tight mt-5">
          {t.title}
        </h2>
        <p className="mt-6 text-base md:text-lg text-[#FDFBF7]/85 leading-relaxed">{t.body}</p>
        <Link to={pathFor(lang, "toursLanding")} data-testid={`${testid}-cta`}
              className="mt-10 inline-flex items-center gap-3 bg-[#C16542] hover:bg-[#A35133] text-[#FDFBF7] px-8 py-4 text-[11px] tracking-[0.25em] uppercase transition-colors">
          {t.cta}
          <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.6} />
        </Link>
      </div>
    </div>
  </section>
);
