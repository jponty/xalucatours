import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, Tooltip } from "react-leaflet";
import MapLogoBadge from "@/components/MapLogoBadge";
import {
  ChevronRight, ChevronLeft, Home, Sunrise, ArrowRight, Compass, MapPin,
  Sun, Snowflake, Leaf, Flower, Calendar, Sparkles, Camera,
  Mountain, Waves, Building2, Tent, Star, Clock,
} from "lucide-react";
import { useLanguage, pick } from "@/contexts/LanguageContext";
import { pathFor } from "@/lib/routes";
import {
  HERO, INTRO, SEASONS, REGIONS, TRAVEL_STYLES, MONTHS, FAQ, INTERNAL_LINKS,
} from "@/lib/bestTimeData";
import EditableImage from "@/components/EditableImage";
import FromPrice from "@/components/FromPrice";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Accordion, AccordionItem, AccordionTrigger, AccordionContent,
} from "@/components/ui/accordion";

/* ----- Leaflet region coordinates (one representative anchor each) ----- */
const REGION_COORDS = {
  sahara:    [31.13, -4.00],   // Erg Chebbi
  marrakech: [31.63, -7.99],   // Marrakech
  atlas:     [31.06, -7.92],   // Imlil / Toubkal
  north:     [35.17, -5.27],   // Chefchaouen
  coast:     [31.51, -9.77],   // Essaouira
};

/* ----- Localized strings for chrome and labels (kept inside page) ----- */
const COPY = {
  breadcrumb: { es: "Inicio", en: "Home", fr: "Accueil" },
  guides:     { es: "Guías", en: "Guides", fr: "Guides" },
  current:    { es: "Cuándo viajar", en: "When to travel", fr: "Quand partir" },
  scroll:     { es: "Desplázate", en: "Scroll", fr: "Faire défiler" },
  sections: {
    seasons:   { es: "Cuatro estaciones", en: "Four seasons",   fr: "Quatre saisons" },
    regions:   { es: "Cinco climas",      en: "Five climates",  fr: "Cinq climats" },
    styles:    { es: "Tu estilo de viaje", en: "Your travel style", fr: "Votre style de voyage" },
    timeline:  { es: "Calendario · mes a mes", en: "The Moroccan calendar, month by month", fr: "Le calendrier marocain, mois par mois" },
    map:       { es: "Mapa estacional", en: "Seasonal map", fr: "Carte saisonnière" },
    faq:       { es: "Preguntas frecuentes", en: "Frequently asked", fr: "Questions fréquentes" },
    links:     { es: "Sigue explorando",  en: "Keep exploring", fr: "Continuer l'exploration" },
  },
  yearRound: {
    eyebrow: { es: "Todo el año", en: "Year-round", fr: "Toute l'année" },
    title: {
      es: "No hay mala época: cada temporada tiene su Marruecos.",
      en: "There's no bad time: every season has its own Morocco.",
      fr: "Aucune mauvaise période : chaque saison a son Maroc.",
    },
    intro: {
      es: "Marruecos se disfruta los doce meses del año. Solo cambia el tipo de viaje que te espera.",
      en: "Morocco can be enjoyed twelve months a year. Only the kind of journey awaiting you changes.",
      fr: "Le Maroc se savoure douze mois sur douze. Seul change le type de voyage qui vous attend.",
    },
    idealFor: { es: "Ideal para", en: "Ideal for", fr: "Idéal pour" },
    cta: { es: "Ver viajes de temporada", en: "See seasonal trips", fr: "Voir les voyages de saison" },
  },
  labels: {
    weather:   { es: "Clima",      en: "Weather",      fr: "Climat" },
    regions:   { es: "Regiones",   en: "Regions",      fr: "Régions" },
    activities:{ es: "Experiencias", en: "Experiences", fr: "Expériences" },
    pros:      { es: "Por qué viajar", en: "Why travel", fr: "Pourquoi partir" },
    itinerary: { es: "Itinerario tipo", en: "Sample itinerary", fr: "Itinéraire type" },
    recommended: { es: "Itinerarios recomendados", en: "Recommended itineraries", fr: "Itinéraires recommandés" },
    best:      { es: "Mejor",      en: "Best",         fr: "Meilleur" },
    avoid:     { es: "A tener en cuenta", en: "Good to know", fr: "À noter" },
    months:    { es: "Meses ideales", en: "Ideal months", fr: "Mois idéals" },
    suggestedItinerary: { es: "Itinerario sugerido", en: "Suggested itinerary", fr: "Itinéraire suggéré" },
    highlight: { es: "Lo destacado", en: "Highlight",  fr: "À retenir" },
    temp:      { es: "Temperatura media", en: "Average temperature", fr: "Température moyenne" },
    regionSug: { es: "Regiones recomendadas", en: "Recommended regions", fr: "Régions recommandées" },
  },
  finalCta: {
    eyebrow: { es: "Diséñalo con nosotros", en: "Plan it with us", fr: "Conçu avec vous" },
    title:   {
      es: "Dinos cuándo quieres viajar — nosotros nos ocupamos del resto.",
      en: "Tell us when you'd like to travel — we'll handle the rest.",
      fr: "Dites-nous quand partir — nous nous occupons du reste.",
    },
    cta:     { es: "Planifica tu viaje", en: "Plan my journey", fr: "Planifier mon voyage" },
  },
};

const SEASON_ICONS = { spring: Flower, summer: Sun, autumn: Leaf, winter: Snowflake };
const SEASON_NAMES = {
  spring: { es: "Primavera", en: "Spring", fr: "Printemps" },
  summer: { es: "Verano", en: "Summer", fr: "Été" },
  autumn: { es: "Otoño", en: "Autumn", fr: "Automne" },
  winter: { es: "Invierno", en: "Winter", fr: "Hiver" },
};
// Recommended region/route per season → connects discovery to real itineraries.
const SEASON_ROUTE = {
  spring: "tourSouth",
  summer: "tourMarrakechEssHub",
  autumn: "tourFull",
  winter: "tourMarrakechErgHub",
};
const STYLE_ICONS  = {
  desert: Tent, hiking: Mountain, cities: Building2,
  beach: Waves, luxury: Star, photography: Camera,
};

/* ----- Helper: month grid pill ----- */
const MonthBar = ({ activeMonths, accent }) => {
  const labels = ["E", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
  return (
    <div className="grid grid-cols-12 gap-1.5">
      {labels.map((l, i) => {
        const active = activeMonths.includes(i + 1);
        return (
          <div
            key={`${l}-${i}`}
            className={`text-center text-[10px] tracking-[0.18em] uppercase py-2 border transition-all ${
              active
                ? "border-transparent text-[#FDFBF7]"
                : "border-[#2C2621]/15 text-[#2C2621]/35"
            }`}
            style={active ? { backgroundColor: accent } : {}}
            aria-label={`Mes ${i + 1} ${active ? "óptimo" : "no óptimo"}`}
          >
            {l}
          </div>
        );
      })}
    </div>
  );
};

/* ----- Recommended itineraries · horizontal card carousel ----- */
const SeasonRecommendedCarousel = ({ season, lang, label }) => {
  const scrollRef = useRef(null);
  const items = season.recommended || [];

  const scrollBy = (dir) => {
    const el = scrollRef.current;
    if (!el) return;
    const card = el.querySelector("[data-reco-card]");
    const delta = card ? card.offsetWidth + 20 : 320;
    el.scrollBy({ left: dir * delta, behavior: "smooth" });
  };

  return (
    <div className="mt-7 pt-6 border-t border-[#2C2621]/10" data-testid={`season-recommended-${season.id}`}>
      <div className="flex items-center justify-between gap-4 mb-4">
        <p className="text-[10px] tracking-[0.3em] uppercase text-[#5C5248]">{label}</p>
        {items.length > 1 && (
          <div className="hidden md:flex items-center gap-2">
            <button
              type="button"
              onClick={() => scrollBy(-1)}
              data-testid={`season-recommended-prev-${season.id}`}
              aria-label="Anterior"
              className="w-9 h-9 inline-flex items-center justify-center border border-[#2C2621]/20 text-[#2C2621] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
            >
              <ChevronLeft className="w-4 h-4" strokeWidth={1.8} />
            </button>
            <button
              type="button"
              onClick={() => scrollBy(1)}
              data-testid={`season-recommended-next-${season.id}`}
              aria-label="Siguiente"
              className="w-9 h-9 inline-flex items-center justify-center border border-[#2C2621]/20 text-[#2C2621] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
            >
              <ChevronRight className="w-4 h-4" strokeWidth={1.8} />
            </button>
          </div>
        )}
      </div>

      <div
        ref={scrollRef}
        className="flex gap-5 overflow-x-auto pb-3 -mx-1 px-1 snap-x snap-mandatory scrollbar-thin"
        style={{ scrollbarWidth: "thin" }}
      >
        {items.map((it, i) => (
          <article
            key={`${it.route}-${i}`}
            data-reco-card
            data-testid={`season-recommended-${season.id}-${i}`}
            className="group/reco relative shrink-0 w-[260px] sm:w-[280px] snap-start flex flex-col bg-[#FDFBF7] border border-[#2C2621]/12 hover:border-[var(--accent)] transition-colors duration-300"
          >
            <div className="relative overflow-hidden aspect-[4/3]">
              <EditableImage
                slot={`when-travel.season.${season.id}.reco.${i}`}
                fallback={it.image}
                alt={pick(it.label, lang)}
                aspectRatio="4 / 3"
                className="w-full h-full"
                imgProps={{ className: "w-full h-full object-cover transition-transform duration-[1200ms] group-hover/reco:scale-105" }}
              />
              <span
                className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 text-[9px] tracking-[0.22em] uppercase text-[#FDFBF7] pointer-events-none"
                style={{ backgroundColor: `${season.accent}E6` }}
              >
                <MapPin className="w-3 h-3" strokeWidth={1.8} />
                {pick(it.region, lang)}
              </span>
            </div>

            <div className="flex flex-col flex-1 p-4">
              <h4 className="font-serif-x text-lg md:text-xl leading-snug text-[#2C2621] mb-1.5">
                {pick(it.label, lang)}
              </h4>
              <p className="text-[13px] leading-relaxed text-[#5C5248] mb-3 flex-1">
                {pick(it.desc, lang)}
              </p>

              <div className="flex items-center gap-2 text-[11px] tracking-[0.12em] uppercase text-[#5C5248] mb-3">
                <Clock className="w-3.5 h-3.5 shrink-0" strokeWidth={1.8} style={{ color: season.accent }} />
                {pick(it.duration, lang)}
              </div>

              <div className="flex items-center justify-between gap-3 pt-3 border-t border-[#2C2621]/10">
                <FromPrice tone="dark" size="sm" />
                <Link
                  to={pathFor(lang, it.route)}
                  data-testid={`season-recommended-cta-${season.id}-${i}`}
                  aria-label={pick(it.label, lang)}
                  className="inline-flex items-center justify-center w-9 h-9 shrink-0 text-[#FDFBF7] transition-transform duration-300 group-hover/reco:translate-x-0.5"
                  style={{ backgroundColor: season.accent }}
                >
                  <ArrowRight className="w-4 h-4" strokeWidth={1.8} />
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};


/* ============================================================
   Page
============================================================ */
export default function WhenToTravelPage() {
  const { lang } = useLanguage();
  const location = useLocation();
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [activeStyle, setActiveStyle] = useState(TRAVEL_STYLES[0].id);

  /* trilingual <title> — `titles` is a local literal; deps only on inputs */
  useEffect(() => {
    const titles = {
      es: "Cuándo viajar a Marruecos · Guía editorial · Xaluca Tours",
      en: "When to travel to Morocco · Editorial guide · Xaluca Tours",
      fr: "Quand partir au Maroc · Guide éditorial · Xaluca Tours",
    };
    document.title = titles[lang] || titles.es;
  }, [lang, location.pathname]);

  /* scroll to top on mount */
  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" }); }, []);

  /* `MONTHS` is a module-level const, intentionally NOT a dependency */
  const monthFocus = useMemo(
    () => (selectedMonth ? MONTHS.find((m) => m.id === selectedMonth) : null),
    [selectedMonth]
  );

  return (
    <div className="bg-[#FDFBF7] text-[#2C2621]" data-testid="when-to-travel-page">

      {/* ======================== HERO ======================== */}
      <section className="relative h-[88vh] min-h-[640px] w-full overflow-hidden">
        <EditableImage
          slot="when-travel.hero.bg"
          fallback={HERO.hero_image}
          alt="Marruecos a través del año"
          priority
          aspectRatio="16/9"
          className="absolute inset-0 w-full h-full object-cover scale-[1.04]"
          imgProps={{ style: { animation: "slow-zoom 18s ease-out forwards" } }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1A1513]/55 via-[#1A1513]/15 to-[#1A1513]/85 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(26,21,19,0.35)_100%)]" />

        {/* Breadcrumb chip */}
        <nav
          aria-label="Breadcrumb"
          className="absolute top-0 left-0 right-0 z-30 pointer-events-none"
          data-testid="when-breadcrumbs"
        >
          <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 pt-[88px] md:pt-[96px]">
            <div className="pointer-events-auto inline-flex flex-wrap items-center gap-1.5 md:gap-2 bg-[#1A1513]/55 backdrop-blur-md border border-white/10 px-3.5 md:px-4 py-1.5 md:py-2 text-[10px] md:text-[11px] tracking-[0.18em] uppercase text-[#FDFBF7]/90">
              <Link
                to={pathFor(lang, "home")}
                className="hover:text-[#D4A373] transition-colors duration-200 flex items-center gap-1.5"
                data-testid="bc-when-home"
              >
                <Home className="w-3 h-3 md:w-3.5 md:h-3.5" strokeWidth={1.6} />
                {pick(COPY.breadcrumb, lang)}
              </Link>
              <ChevronRight className="w-3 h-3 md:w-3.5 md:h-3.5 text-[#FDFBF7]/40" strokeWidth={1.6} />
              <span className="text-[#FDFBF7]/70">{pick(COPY.guides, lang)}</span>
              <ChevronRight className="w-3 h-3 md:w-3.5 md:h-3.5 text-[#FDFBF7]/40" strokeWidth={1.6} />
              <span className="text-[#D4A373] flex items-center gap-1.5" data-testid="bc-when-current">
                <Sunrise className="w-3 h-3 md:w-3.5 md:h-3.5" strokeWidth={1.6} />
                {pick(COPY.current, lang)}
              </span>
            </div>
          </div>
        </nav>

        <div className="relative z-10 h-full flex items-end pt-32 md:pt-44 pb-24 md:pb-32">
          <div className="max-w-7xl mx-auto px-6 md:px-12 w-full">
            <div className="max-w-4xl">
              <span
                className="inline-block text-[11px] md:text-[12px] tracking-[0.4em] uppercase text-[#D4A373] mb-6"
                data-testid="when-hero-eyebrow"
              >
                {pick(HERO.eyebrow, lang)}
              </span>
              <h1
                className="font-serif-x text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-[1.02] tracking-tight text-[#FDFBF7] mb-8"
                data-testid="when-hero-title"
              >
                {pick(HERO.title, lang)}
              </h1>
              <p className="text-base md:text-xl text-[#FDFBF7]/85 leading-relaxed max-w-3xl font-light">
                {pick(HERO.subtitle, lang)}
              </p>
            </div>
          </div>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[10px] tracking-[0.4em] uppercase text-[#FDFBF7]/60 flex flex-col items-center gap-3">
          {pick(COPY.scroll, lang)}
          <span className="w-px h-10 bg-[#FDFBF7]/40 animate-pulse" />
        </div>
      </section>

      {/* ======================== INTRO ======================== */}
      <section className="py-24 md:py-32 border-b border-[#2C2621]/10" data-testid="when-intro">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16">
          <div className="md:col-span-5">
            <span className="inline-block text-[10px] tracking-[0.35em] uppercase text-[#C16542] mb-6">
              {pick(INTRO.overline, lang)}
            </span>
            <h2 className="font-serif-x text-3xl md:text-4xl lg:text-5xl leading-[1.05] tracking-tight">
              {pick(INTRO.title, lang)}
            </h2>
          </div>
          <div className="md:col-span-7 space-y-5 text-base md:text-lg text-[#5C5248] leading-relaxed">
            {(INTRO.body[lang] || INTRO.body.es).map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      {/* ================= YEAR-ROUND · IDEAL PARA ================= */}
      <section
        className="py-20 md:py-28 bg-[#F2EBE1]/55 border-b border-[#2C2621]/10"
        data-testid="when-year-round"
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="max-w-3xl mb-12 md:mb-14">
            <span className="inline-flex items-center gap-2 text-[10px] tracking-[0.35em] uppercase text-[#C16542] mb-4">
              <Calendar className="w-3.5 h-3.5" strokeWidth={1.8} />
              {pick(COPY.yearRound.eyebrow, lang)}
            </span>
            <h2 className="font-serif-x text-3xl md:text-4xl lg:text-5xl leading-[1.06] tracking-tight">
              {pick(COPY.yearRound.title, lang)}
            </h2>
            <p className="mt-5 text-base md:text-lg text-[#5C5248] leading-relaxed">
              {pick(COPY.yearRound.intro, lang)}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {SEASONS.map((season) => {
              const SeasonIcon = SEASON_ICONS[season.id] || Sun;
              return (
                <div
                  key={season.id}
                  data-testid={`year-round-${season.id}`}
                  className="bg-[#FDFBF7] border border-[#2C2621]/12 rounded-2xl p-6 flex flex-col"
                  style={{ borderTop: `3px solid ${season.accent}` }}
                >
                  <span
                    className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-5"
                    style={{ background: `${season.accent}1A`, color: season.accent }}
                  >
                    <SeasonIcon className="w-6 h-6" strokeWidth={1.6} />
                  </span>
                  <h3 className="font-serif-x text-xl text-[#2C2621] leading-tight">
                    {pick(SEASON_NAMES[season.id], lang)}
                  </h3>
                  <span className="text-[11px] tracking-[0.15em] uppercase text-[#5C5248] mt-1">
                    {pick(season.months, lang)}
                  </span>
                  <p className="mt-4 text-sm text-[#5C5248] leading-relaxed">
                    <span className="font-semibold" style={{ color: season.accent }}>
                      {pick(COPY.yearRound.idealFor, lang)}:
                    </span>{" "}
                    {pick(season.idealFor, lang)}
                  </p>
                  <Link
                    to={pathFor(lang, SEASON_ROUTE[season.id])}
                    data-testid={`year-round-cta-${season.id}`}
                    className="group/cta mt-auto pt-4 border-t border-[#2C2621]/10 inline-flex items-center gap-2 text-[11px] tracking-[0.18em] uppercase font-semibold transition-colors"
                    style={{ color: season.accent }}
                  >
                    {pick(COPY.yearRound.cta, lang)}
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover/cta:translate-x-1" strokeWidth={1.8} />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ======================== 4 SEASONS ======================== */}
      <section className="py-24 md:py-32" data-testid="when-seasons">
        <div className="max-w-7xl mx-auto px-6 md:px-12 mb-16">
          <span className="inline-block text-[10px] tracking-[0.35em] uppercase text-[#C16542] mb-4">
            {pick(COPY.sections.seasons, lang)}
          </span>
          <h2 className="font-serif-x text-3xl md:text-5xl leading-[1.05] tracking-tight max-w-4xl">
            {lang === "es"
              ? "Cada estación tiene su propia gramática del viaje."
              : lang === "fr"
              ? "Chaque saison a sa propre grammaire du voyage."
              : "Every season writes its own travel grammar."}
          </h2>
        </div>

        <div className="space-y-0">
          {SEASONS.map((season, idx) => {
            const SeasonIcon = SEASON_ICONS[season.id] || Sun;
            const isReverse = idx % 2 === 1;
            return (
              <article
                key={season.id}
                data-testid={`season-${season.id}`}
                className="relative border-t border-[#2C2621]/10 first:border-t-0"
                style={{ "--accent": season.accent }}
              >
                <div className={`max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center ${
                  isReverse ? "md:[&>div:first-child]:order-2" : ""
                }`}>
                  <div className="md:col-span-6">
                    <div className="relative overflow-hidden">
                      <EditableImage
                        slot={`when-travel.season.${season.id}.image`}
                        fallback={season.image}
                        alt={pick(season.title, lang)}
                        aspectRatio="4/5"
                        imgProps={{ loading: "lazy" }}
                        className="w-full h-[420px] md:h-[560px] object-cover transition-transform duration-[1200ms] hover:scale-105"
                      />
                      <span
                        className="absolute top-5 left-5 inline-flex items-center gap-2 px-3 py-1.5 text-[10px] tracking-[0.3em] uppercase text-[#FDFBF7] backdrop-blur-md"
                        style={{ backgroundColor: `${season.accent}DD` }}
                      >
                        <SeasonIcon className="w-3.5 h-3.5" strokeWidth={1.6} />
                        {pick(season.months, lang)}
                      </span>
                    </div>
                  </div>

                  <div className="md:col-span-6 md:px-4">
                    <h3
                      className="font-serif-x text-3xl md:text-4xl lg:text-5xl leading-[1.05] tracking-tight mb-8"
                      style={{ color: season.accent }}
                    >
                      {pick(season.title, lang)}
                    </h3>

                    <dl className="space-y-5 text-[15px] md:text-[16px] leading-relaxed">
                      <div>
                        <dt className="text-[10px] tracking-[0.3em] uppercase text-[#5C5248] mb-2">{pick(COPY.labels.weather, lang)}</dt>
                        <dd className="text-[#2C2621]">{pick(season.weather, lang)}</dd>
                      </div>
                      <div>
                        <dt className="text-[10px] tracking-[0.3em] uppercase text-[#5C5248] mb-2">{pick(COPY.labels.regions, lang)}</dt>
                        <dd className="text-[#2C2621]">{pick(season.regions, lang)}</dd>
                      </div>
                      <div>
                        <dt className="text-[10px] tracking-[0.3em] uppercase text-[#5C5248] mb-2">{pick(COPY.labels.activities, lang)}</dt>
                        <dd className="text-[#2C2621]">{pick(season.activities, lang)}</dd>
                      </div>
                      <div>
                        <dt className="text-[10px] tracking-[0.3em] uppercase text-[#5C5248] mb-2">{pick(COPY.labels.pros, lang)}</dt>
                        <dd className="text-[#2C2621] italic">{pick(season.pros, lang)}</dd>
                      </div>
                      <div className="pt-4 border-t border-[#2C2621]/10">
                        <dt className="text-[10px] tracking-[0.3em] uppercase text-[#5C5248] mb-2">{pick(COPY.labels.itinerary, lang)}</dt>
                        <dd className="font-serif-x text-lg md:text-xl text-[#2C2621]">{pick(season.itinerary, lang)}</dd>
                      </div>
                    </dl>

                    {Array.isArray(season.recommended) && season.recommended.length > 0 && (
                      <SeasonRecommendedCarousel
                        season={season}
                        lang={lang}
                        label={pick(COPY.labels.recommended, lang)}
                      />
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* ======================== 5 CLIMATE REGIONS ======================== */}
      <section className="py-24 md:py-32 bg-[#F2EBE1]/55 border-y border-[#2C2621]/10" data-testid="when-regions">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="mb-16 max-w-3xl">
            <span className="inline-block text-[10px] tracking-[0.35em] uppercase text-[#C16542] mb-4">
              {pick(COPY.sections.regions, lang)}
            </span>
            <h2 className="font-serif-x text-3xl md:text-5xl leading-[1.05] tracking-tight">
              {lang === "es"
                ? "Cinco Marruecos, cinco climas — uno por viaje."
                : lang === "fr"
                ? "Cinq Marocs, cinq climats — un par voyage."
                : "Five Moroccos, five climates — one per journey."}
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {REGIONS.map((r) => (
              <article
                key={r.id}
                data-testid={`region-${r.id}`}
                className="relative bg-[#FDFBF7] border border-[#2C2621]/10 p-7 md:p-9 group hover:border-[#2C2621]/30 transition-colors"
              >
                <div className="flex items-start justify-between gap-5 mb-5">
                  <h3 className="font-serif-x text-2xl md:text-3xl leading-[1.1] tracking-tight">
                    {pick(r.name, lang)}
                  </h3>
                  <span
                    className="w-10 h-10 flex-shrink-0 rounded-full"
                    style={{ backgroundColor: r.accent, boxShadow: `0 0 0 6px ${r.accent}22` }}
                  />
                </div>
                <p className="text-[15px] md:text-base text-[#5C5248] leading-relaxed mb-6">
                  {pick(r.body, lang)}
                </p>
                <div className="grid grid-cols-2 gap-4 pt-5 border-t border-[#2C2621]/10">
                  <div>
                    <span className="text-[10px] tracking-[0.3em] uppercase text-[#5C5248] block mb-1.5">{pick(COPY.labels.best, lang)}</span>
                    <span className="text-sm font-medium text-[#2C2621]" style={{ color: r.accent }}>
                      {pick(r.best, lang)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] tracking-[0.3em] uppercase text-[#5C5248] block mb-1.5">{pick(COPY.labels.avoid, lang)}</span>
                    <span className="text-sm text-[#2C2621]/70">{pick(r.avoid, lang)}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Region × Month visual strip */}
          <div className="mt-16 bg-[#FDFBF7] border border-[#2C2621]/10 p-6 md:p-10" data-testid="region-month-strip">
            <span className="inline-block text-[10px] tracking-[0.35em] uppercase text-[#C16542] mb-2">
              {pick(COPY.sections.map, lang)}
            </span>
            <p className="text-[15px] md:text-base text-[#5C5248] mb-8 max-w-2xl">
              {lang === "es"
                ? "Lee de un vistazo qué región brilla cada mes del año."
                : lang === "fr"
                ? "Repérez d'un coup d'œil quelle région brille chaque mois."
                : "Read at a glance which region shines each month."}
            </p>
            <div className="space-y-3">
              {REGIONS.map((r) => {
                const bestMonths = parseBestMonths(pick(r.best, "en"));
                return (
                  <div key={r.id} className="grid grid-cols-[140px_1fr] md:grid-cols-[200px_1fr] items-center gap-4">
                    <span className="text-[11px] md:text-[12px] tracking-[0.18em] uppercase text-[#2C2621]">
                      {pick(r.name, lang)}
                    </span>
                    <MonthBar activeMonths={bestMonths} accent={r.accent} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ======================== TRAVEL STYLE MATRIX ======================== */}
      <section className="py-24 md:py-32" data-testid="when-styles">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="mb-12 max-w-3xl">
            <span className="inline-block text-[10px] tracking-[0.35em] uppercase text-[#C16542] mb-4">
              {pick(COPY.sections.styles, lang)}
            </span>
            <h2 className="font-serif-x text-3xl md:text-5xl leading-[1.05] tracking-tight">
              {lang === "es"
                ? "Dime cómo viajas y te diré cuándo."
                : lang === "fr"
                ? "Dites-moi comment vous voyagez, je vous dirai quand."
                : "Tell me how you travel and I'll tell you when."}
            </h2>
          </div>

          <Tabs value={activeStyle} onValueChange={setActiveStyle} className="w-full">
            <TabsList
              className="flex flex-wrap gap-2 h-auto bg-transparent p-0 mb-10 justify-start"
              data-testid="style-tabs"
            >
              {TRAVEL_STYLES.map((s) => {
                const Icon = STYLE_ICONS[s.id] || Sparkles;
                return (
                  <TabsTrigger
                    key={s.id}
                    value={s.id}
                    data-testid={`style-tab-${s.id}`}
                    className="rounded-none border border-[#2C2621]/20 px-4 md:px-5 py-2.5 md:py-3 text-[11px] tracking-[0.22em] uppercase data-[state=active]:bg-[#2C2621] data-[state=active]:text-[#FDFBF7] data-[state=active]:border-[#2C2621] data-[state=active]:shadow-none transition-colors flex items-center gap-2"
                  >
                    <Icon className="w-3.5 h-3.5" strokeWidth={1.6} />
                    {pick(s.label, lang)}
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {TRAVEL_STYLES.map((s) => (
              <TabsContent
                key={s.id}
                value={s.id}
                data-testid={`style-content-${s.id}`}
                className="mt-0"
              >
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-start">
                  <div className="md:col-span-7">
                    <p className="text-lg md:text-xl text-[#2C2621] leading-relaxed font-light">
                      {pick(s.body, lang)}
                    </p>
                  </div>
                  <div className="md:col-span-5 space-y-6">
                    <div>
                      <span className="text-[10px] tracking-[0.3em] uppercase text-[#5C5248] block mb-3">
                        {pick(COPY.labels.months, lang)}
                      </span>
                      <MonthBar activeMonths={s.bestMonths} accent={s.accent} />
                    </div>
                    <SuggestedJourney styleId={s.id} lang={lang} accent={s.accent} />
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* ======================== MONTHLY TIMELINE ======================== */}
      <section className="py-24 md:py-32 bg-[#1A1513] text-[#FDFBF7]" data-testid="when-timeline">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="mb-14 max-w-3xl">
            <span className="inline-block text-[10px] tracking-[0.35em] uppercase text-[#D4A373] mb-4">
              {pick(COPY.sections.timeline, lang)}
            </span>
            <h2 className="font-serif-x text-3xl md:text-5xl leading-[1.05] tracking-tight">
              {lang === "es"
                ? "Doce meses, doce Marruecos."
                : lang === "fr"
                ? "Douze mois, douze Marocs."
                : "Twelve months, twelve Moroccos."}
            </h2>
          </div>

          {/* Grid 4×3 → 2 on tablet → 1 on phone */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {MONTHS.map((m) => {
              const isActive = selectedMonth === m.id;
              return (
                <button
                  type="button"
                  key={m.id}
                  data-testid={`month-card-${m.id}`}
                  onClick={() => setSelectedMonth(isActive ? null : m.id)}
                  className={`group relative text-left p-5 md:p-6 border transition-all duration-300 ${
                    isActive
                      ? "border-[#D4A373] bg-[#D4A373]/10 -translate-y-1"
                      : "border-[#FDFBF7]/15 hover:border-[#D4A373]/60 hover:bg-[#FDFBF7]/5"
                  }`}
                  aria-expanded={isActive}
                  aria-controls={`month-panel`}
                >
                  <div className="flex items-baseline justify-between mb-3">
                    <span className="font-serif-x text-2xl md:text-3xl">{pick(m.name, lang)}</span>
                    <span className="text-[10px] tracking-[0.2em] uppercase text-[#D4A373]/80">{m.temp}</span>
                  </div>
                  <p className="text-[11px] tracking-[0.18em] uppercase text-[#FDFBF7]/55 leading-relaxed">
                    {pick(m.region, lang)}
                  </p>
                  <span
                    className={`absolute bottom-0 left-0 h-px bg-[#D4A373] transition-all duration-500 ${
                      isActive ? "w-full" : "w-0 group-hover:w-1/3"
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* Expanded month panel */}
          {monthFocus && (
            <div
              id="month-panel"
              data-testid="month-detail-panel"
              className="mt-8 border border-[#D4A373]/40 bg-[#D4A373]/5 p-8 md:p-12 grid grid-cols-1 md:grid-cols-12 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500"
            >
              <div className="md:col-span-3">
                <span className="block text-[11px] tracking-[0.3em] uppercase text-[#D4A373] mb-2">
                  {pick(COPY.current, lang)}
                </span>
                <h3 className="font-serif-x text-4xl md:text-5xl text-[#FDFBF7]">{pick(monthFocus.name, lang)}</h3>
                <span className="block text-sm text-[#FDFBF7]/60 mt-3">{monthFocus.temp}</span>
              </div>
              <div className="md:col-span-9 space-y-4">
                <div>
                  <span className="text-[10px] tracking-[0.3em] uppercase text-[#FDFBF7]/55 block mb-2">{pick(COPY.labels.regionSug, lang)}</span>
                  <p className="text-[15px] md:text-base text-[#FDFBF7]/95">{pick(monthFocus.region, lang)}</p>
                </div>
                <div>
                  <span className="text-[10px] tracking-[0.3em] uppercase text-[#FDFBF7]/55 block mb-2">{pick(COPY.labels.highlight, lang)}</span>
                  <p className="text-base md:text-lg italic text-[#D4A373] font-serif-x">{pick(monthFocus.highlight, lang)}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ======================== LEAFLET REGIONAL MAP ======================== */}
      <section className="py-24 md:py-32" data-testid="when-map">
        <div className="max-w-7xl mx-auto px-6 md:px-12 mb-12 grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
          <div className="md:col-span-7">
            <span className="overline inline-flex items-center gap-2 text-[10px] tracking-[0.35em] uppercase text-[#C16542] mb-4">
              <Compass className="w-3.5 h-3.5" strokeWidth={1.6} />
              {pick(COPY.sections.map, lang)}
            </span>
            <h2 className="font-serif-x text-3xl md:text-5xl leading-[1.05] tracking-tight">
              {lang === "es"
                ? "Cada color, una estación. Cada punto, un país distinto."
                : lang === "fr"
                ? "Chaque couleur, une saison. Chaque point, un pays différent."
                : "Each colour, a season. Each pin, a different country."}
            </h2>
          </div>
          <div className="md:col-span-5">
            <p className="text-base md:text-lg text-[#5C5248] leading-relaxed">
              {lang === "es"
                ? "Pulsa sobre una región para descubrir su mejor ventana del año."
                : lang === "fr"
                ? "Cliquez sur une région pour découvrir sa meilleure fenêtre de l'année."
                : "Click a region to discover its sweet spot in the year."}
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="relative border border-[#2C2621]/15 overflow-hidden bg-[#F2EBE1]" style={{ height: 560 }}>
            <MapContainer
              center={[31.5, -7.0]}
              zoom={6}
              scrollWheelZoom={false}
              style={{ height: "100%", width: "100%" }}
              attributionControl={false}
            >
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
                subdomains="abcd"
              />
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png"
                subdomains="abcd"
              />
              {REGIONS.map((r) => {
                const coords = REGION_COORDS[r.id];
                if (!coords) return null;
                return (
                  <CircleMarker
                    key={r.id}
                    center={coords}
                    radius={14}
                    pathOptions={{
                      color: r.accent,
                      fillColor: r.accent,
                      fillOpacity: 0.65,
                      weight: 2,
                    }}
                  >
                    <Tooltip direction="top" offset={[0, -10]} opacity={1} permanent={false}>
                      <span className="font-serif-x text-sm">{pick(r.name, lang)}</span>
                    </Tooltip>
                    <Popup>
                      <div className="space-y-1">
                        <div className="font-serif-x text-base text-[#2C2621]">{pick(r.name, lang)}</div>
                        <div className="text-[11px] uppercase tracking-[0.2em]" style={{ color: r.accent }}>
                          {pick(COPY.labels.best, lang)}: {pick(r.best, lang)}
                        </div>
                        <div className="text-[11px] text-[#5C5248]">
                          {pick(COPY.labels.avoid, lang)}: {pick(r.avoid, lang)}
                        </div>
                      </div>
                    </Popup>
                  </CircleMarker>
                );
              })}
            </MapContainer>
            <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-[#2C2621]/5" />
          </div>

          {/* Map legend */}
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-[11px] tracking-[0.2em] uppercase text-[#5C5248]">
            {REGIONS.map((r) => (
              <span
                key={`legend-${r.id}`}
                data-testid={`map-legend-${r.id}`}
                className="inline-flex items-center gap-2"
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: r.accent }} />
                {pick(r.name, lang)} · {pick(r.best, lang)}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ======================== FAQ ======================== */}
      <section className="py-24 md:py-32 bg-[#F2EBE1]/55 border-y border-[#2C2621]/10" data-testid="when-faq">
        <div className="max-w-4xl mx-auto px-6 md:px-12">
          <div className="mb-12 text-center">
            <span className="inline-block text-[10px] tracking-[0.35em] uppercase text-[#C16542] mb-4">
              {pick(COPY.sections.faq, lang)}
            </span>
            <h2 className="font-serif-x text-3xl md:text-5xl leading-[1.05] tracking-tight">
              {lang === "es"
                ? "Lo que más nos preguntan."
                : lang === "fr"
                ? "Vos questions les plus fréquentes."
                : "What we get asked the most."}
            </h2>
          </div>

          <Accordion type="single" collapsible className="w-full">
            {FAQ.map((item, idx) => (
              <AccordionItem
                key={`faq-${idx}`}
                value={`faq-${idx}`}
                className="border-b border-[#2C2621]/15"
                data-testid={`faq-item-${idx}`}
              >
                <AccordionTrigger className="text-left font-serif-x text-lg md:text-xl text-[#2C2621] py-6 hover:no-underline hover:text-[#C16542]">
                  {pick(item.q, lang)}
                </AccordionTrigger>
                <AccordionContent className="text-[15px] md:text-base text-[#5C5248] leading-relaxed pb-6">
                  {pick(item.a, lang)}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* ======================== INTERNAL LINKS ======================== */}
      <section className="py-24 md:py-32" data-testid="when-links">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="mb-12 max-w-3xl">
            <span className="inline-block text-[10px] tracking-[0.35em] uppercase text-[#C16542] mb-4">
              {pick(COPY.sections.links, lang)}
            </span>
            <h2 className="font-serif-x text-3xl md:text-5xl leading-[1.05] tracking-tight">
              {lang === "es"
                ? "Itinerarios para cada estación."
                : lang === "fr"
                ? "Des itinéraires pour chaque saison."
                : "Itineraries for every season."}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {INTERNAL_LINKS.map((l) => (
              <Link
                key={l.routeId}
                to={pathFor(lang, l.routeId)}
                data-testid={`when-internal-link-${l.routeId}`}
                className="group block border border-[#2C2621]/15 p-7 md:p-8 hover:border-[#2C2621] hover:bg-[#2C2621] hover:text-[#FDFBF7] transition-colors"
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="font-serif-x text-xl md:text-2xl leading-tight">{pick(l.label, lang)}</span>
                  <ArrowRight className="w-4 h-4 -translate-x-1 group-hover:translate-x-0 transition-transform" strokeWidth={1.6} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ======================== FINAL CTA ======================== */}
      <section className="py-24 md:py-32 bg-[#2C2621] text-[#FDFBF7]" data-testid="when-final-cta">
        <div className="max-w-5xl mx-auto px-6 md:px-12 text-center">
          <span className="inline-block text-[10px] tracking-[0.35em] uppercase text-[#D4A373] mb-6">
            {pick(COPY.finalCta.eyebrow, lang)}
          </span>
          <h2 className="font-serif-x text-3xl md:text-5xl lg:text-6xl leading-[1.05] tracking-tight mb-10">
            {pick(COPY.finalCta.title, lang)}
          </h2>
          <Link
            to={pathFor(lang, "planTrip")}
            data-testid="when-plantrip-cta"
            className="inline-flex items-center gap-3 bg-[#C16542] hover:bg-[#A35133] text-[#FDFBF7] px-8 py-4 text-[11px] tracking-[0.3em] uppercase transition-colors"
          >
            {pick(COPY.finalCta.cta, lang)}
            <ArrowRight className="w-4 h-4" strokeWidth={1.6} />
          </Link>
        </div>
      </section>

      {/* Slow-zoom keyframe */}
      <style>{`
        @keyframes slow-zoom {
          from { transform: scale(1.04); }
          to   { transform: scale(1.12); }
        }
      `}</style>
    </div>
  );
}

/* ============================================================
   Helpers
============================================================ */
function SuggestedJourney({ styleId, lang, accent }) {
  // Map travel style → recommended internal route + label
  const map = {
    desert:      { routeId: "tourErgChebbiMarrakechHub", label: { es: "Travesía Erg Chebbi ↔ Marrakech", en: "Erg Chebbi ↔ Marrakech crossing", fr: "Traversée Erg Chebbi ↔ Marrakech" } },
    hiking:      { routeId: "tourAdventure",             label: { es: "Aventura · Atlas & desierto",    en: "Adventure · Atlas & desert",        fr: "Aventure · Atlas & désert" } },
    cities:      { routeId: "tourNorteCiudadesImperiales", label: { es: "Ciudades imperiales",            en: "Imperial cities",                   fr: "Cités impériales" } },
    beach:       { routeId: "tourMarrakechEssHub",       label: { es: "Marrakech · Essaouira",          en: "Marrakech · Essaouira",             fr: "Marrakech · Essaouira" } },
    luxury:      { routeId: "tourBespoke",               label: { es: "Viaje a medida premium",         en: "Premium tailor-made trip",          fr: "Voyage haut de gamme sur mesure" } },
    photography: { routeId: "tourFull",                   label: { es: "Marruecos · de norte a sur",     en: "Morocco · north to south",          fr: "Maroc · du nord au sud" } },
  };
  const r = map[styleId];
  if (!r) return null;
  return (
    <Link
      to={pathFor(lang, r.routeId)}
      data-testid={`style-suggested-${styleId}`}
      className="group block border border-[#2C2621]/15 p-5 hover:border-[#2C2621] transition-colors"
    >
      <span className="block text-[10px] tracking-[0.3em] uppercase text-[#5C5248] mb-2">
        {lang === "es" ? "Itinerario sugerido" : lang === "fr" ? "Itinéraire suggéré" : "Suggested itinerary"}
      </span>
      <div className="flex items-center justify-between gap-3">
        <span className="font-serif-x text-lg leading-tight" style={{ color: accent }}>
          {pick(r.label, lang)}
        </span>
        <ArrowRight className="w-4 h-4 text-[#2C2621] -translate-x-1 group-hover:translate-x-0 transition-transform" strokeWidth={1.6} />
      </div>
    </Link>
  );
}

/* Parse "Oct – Apr" style date strings into a list of month numbers (1-12).
   Works on the English "best" field for stable parsing. */
function parseBestMonths(bestEn) {
  if (!bestEn) return [];
  const monthMap = {
    jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6,
    jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12,
  };
  const months = new Set();
  // Match ranges like "Oct – Apr" or "Apr – Jun"
  const norm = bestEn.toLowerCase().replace(/–|—/g, "-");
  const segments = norm.split(/·|,/);
  segments.forEach((seg) => {
    const range = seg.match(/([a-z]{3})\s*-\s*([a-z]{3})/);
    if (range) {
      const a = monthMap[range[1]];
      const b = monthMap[range[2]];
      if (a && b) {
        // Wrap-around range (e.g., Oct→Apr)
        let i = a;
        for (let k = 0; k < 12; k++) {
          months.add(i);
          if (i === b) break;
          i = i === 12 ? 1 : i + 1;
        }
      }
    } else {
      const single = seg.match(/([a-z]{3})/);
      if (single && monthMap[single[1]]) months.add(monthMap[single[1]]);
    }
  });
  return Array.from(months).sort((a, b) => a - b);
}
