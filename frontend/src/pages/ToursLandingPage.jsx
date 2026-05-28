import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight, Compass, Mountain, Sparkles, MapPin, Calendar,
  Phone, MessageCircle, Mail, Building2, ChevronDown, BookOpen, Crown, Users,
  Globe2, Tag, Filter, Clock,
} from "lucide-react";
import { useLanguage, pick } from "@/contexts/LanguageContext";
import { pathFor } from "@/lib/routes";
import { CONTACT } from "@/lib/data";
import { REGIONS, EXPERIENCES, TRIPS } from "@/lib/tripsData";
import ContactForm from "@/components/ContactForm";
import EditableImage from "@/components/EditableImage";

const ICONS = { Sparkles, BookOpen, Mountain, Crown, Users };

/* ============================================================
   1 — Hero
============================================================ */
const Hero = ({ t }) => (
  <section
    data-testid="viajes-hero"
    className="relative h-[100svh] min-h-[660px] w-full overflow-hidden bg-[#1A1513]"
  >
    <img
      src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=2400&q=85"
      alt=""
      loading="eager"
      className="ken-burns absolute inset-0 w-full h-full object-cover"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-[#1A1513]/95 via-[#1A1513]/55 to-[#1A1513]/35" />
    <div className="absolute inset-0 berber-bg-cross opacity-40" aria-hidden="true" />
    <span className="film-grain" />

    <div className="relative z-10 h-full flex flex-col">
      <div className="flex-1 flex items-end pb-24 md:pb-32">
        <div className="max-w-7xl mx-auto px-6 md:px-12 w-full">
          <div className="max-w-3xl">
            <div className="fade-up inline-flex items-center gap-3 text-[#D4A373]">
              <Compass className="w-3.5 h-3.5" strokeWidth={1.6} />
              <span className="text-[11px] tracking-[0.35em] uppercase font-semibold">{t.eyebrow}</span>
              <span className="w-8 h-px bg-[#D4A373]/50" />
              <span className="text-[10px] tracking-[0.3em] uppercase text-[#D4A373]/80">{t.eyebrow_place}</span>
            </div>
            <h1 className="fade-up fade-up-delay-1 font-serif-x text-[#FDFBF7] text-5xl md:text-6xl lg:text-7xl leading-[1.02] tracking-tight mt-6">
              {t.title}
            </h1>
            <p className="fade-up fade-up-delay-2 mt-8 max-w-2xl text-base md:text-lg text-[#FDFBF7]/85 leading-relaxed">
              {t.subtitle}
            </p>
            <p className="fade-up fade-up-delay-3 mt-4 max-w-2xl text-sm md:text-base text-[#FDFBF7]/65 leading-relaxed">
              {t.intro}
            </p>
            <div className="fade-up fade-up-delay-4 mt-10 flex flex-wrap items-center gap-4">
              <a href="#regions" data-testid="viajes-hero-cta-primary"
                 className="inline-flex items-center gap-3 bg-[#C16542] hover:bg-[#A35133] text-[#FDFBF7] px-8 py-4 text-[11px] tracking-[0.25em] uppercase transition-colors">
                {t.cta_primary}
                <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.6} />
              </a>
              <a href="#explorer" data-testid="viajes-hero-cta-secondary"
                 className="inline-flex items-center gap-3 border border-[#FDFBF7]/40 hover:border-[#FDFBF7] hover:bg-[#FDFBF7] hover:text-[#1A1513] text-[#FDFBF7] px-7 py-4 text-[11px] tracking-[0.25em] uppercase transition-all duration-300">
                {t.cta_secondary}
                <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
              </a>
            </div>
          </div>
        </div>
      </div>

      <a href="#intro" data-testid="viajes-scroll-indicator"
         className="absolute bottom-6 left-1/2 -translate-x-1/2 inline-flex flex-col items-center gap-2 text-[#FDFBF7]/65 hover:text-[#D4A373] transition-colors">
        <span className="text-[10px] tracking-[0.35em] uppercase">{t.scroll}</span>
        <ChevronDown className="w-4 h-4 animate-bounce" strokeWidth={1.5} />
      </a>
    </div>
  </section>
);

/* ============================================================
   2 — Editorial intro (brief)
============================================================ */
const EditorialIntro = ({ t }) => (
  <section id="intro" data-testid="viajes-intro"
           className="relative bg-[#FDFBF7] py-20 md:py-28 overflow-hidden">
    <div className="relative max-w-5xl mx-auto px-6 md:px-12 text-center">
      <span className="overline">{t.eyebrow}</span>
      <h2 className="font-serif-x text-4xl md:text-5xl lg:text-6xl leading-[1.05] tracking-tight mt-5 text-[#2C2621]">
        {t.title}
      </h2>
      <p className="mt-8 font-serif-x-italic text-xl md:text-2xl text-[#5C5248] leading-[1.5] max-w-3xl mx-auto">
        {t.body}
      </p>
    </div>
  </section>
);

/* ============================================================
   3 — Regions: 3 cinematic cards
============================================================ */
const RegionsSection = ({ t, lang }) => (
  <section id="regions" data-testid="viajes-regions"
           className="relative bg-[#FDFBF7] py-24 md:py-32 overflow-hidden">
    <div className="relative max-w-7xl mx-auto px-6 md:px-12">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end mb-14 md:mb-16">
        <div className="md:col-span-7">
          <span className="overline inline-flex items-center gap-2">
            <Globe2 className="w-3.5 h-3.5" strokeWidth={1.6} />
            {t.overline}
          </span>
          <h2 className="font-serif-x text-4xl md:text-5xl lg:text-6xl leading-[1.05] tracking-tight mt-5 text-[#2C2621]">
            {t.title}
          </h2>
        </div>
        <div className="md:col-span-5">
          <p className="text-base md:text-lg text-[#5C5248] leading-relaxed">{t.body}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {REGIONS.map((r) => (
          <Link key={r.id} to={pathFor(lang, r.routeId)} data-testid={`region-card-${r.id}`}
                className="group relative block overflow-hidden h-[60vh] min-h-[420px] max-h-[560px]">
            <EditableImage
              slot={`viajes.region.${r.id}`}
              fallback={r.image}
              alt={pick(r.label, lang)}
              aspectRatio="3/4"
              imgProps={{ loading: "lazy" }}
              className="ken-burns absolute inset-0 w-full h-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.06]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1A1513]/95 via-[#1A1513]/45 to-[#1A1513]/15 pointer-events-none" />
            <span className="film-grain" />

            <div className="absolute inset-0 p-7 md:p-9 flex flex-col justify-end text-[#FDFBF7]">
              <span className="inline-flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase"
                    style={{ color: r.accent === "#3A4A5F" ? "#D4A373" : r.accent }}>
                <span className="w-6 h-px" style={{ background: "currentColor" }} />
                {pick(r.tagline, lang)}
              </span>
              <h3 className="font-serif-x text-3xl md:text-[34px] leading-[1.05] mt-3">
                {pick(r.label, lang)}
              </h3>
              <p className="mt-4 text-sm text-[#FDFBF7]/85 leading-relaxed max-w-md">
                {pick(r.body, lang)}
              </p>
              <span className="mt-6 inline-flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase text-[#D4A373] group-hover:gap-4 transition-all duration-300">
                {t.cta}
                <ArrowRight className="w-3 h-3" strokeWidth={1.5} />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  </section>
);

/* ============================================================
   4 — Experiences: 5 cards
============================================================ */
const ExperiencesSection = ({ t, lang }) => (
  <section id="experiences" data-testid="viajes-experiences"
           className="relative bg-[#1A1513] text-[#FDFBF7] py-24 md:py-32 overflow-hidden">
    <div className="absolute inset-0 berber-bg-cross opacity-50 pointer-events-none" aria-hidden="true" />
    <span className="film-grain" />

    <div className="relative max-w-7xl mx-auto px-6 md:px-12">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end mb-14 md:mb-16">
        <div className="md:col-span-7">
          <span className="overline text-[#D4A373] inline-flex items-center gap-2">
            <Tag className="w-3.5 h-3.5" strokeWidth={1.6} />
            {t.overline}
          </span>
          <h2 className="font-serif-x text-4xl md:text-5xl lg:text-6xl leading-[1.05] tracking-tight mt-5">
            {t.title}
          </h2>
        </div>
        <div className="md:col-span-5">
          <p className="text-base md:text-lg text-[#FDFBF7]/75 leading-relaxed">{t.body}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[#FDFBF7]/10 border border-[#FDFBF7]/15">
        {EXPERIENCES.map((e) => {
          const Icon = ICONS[e.icon] || Sparkles;
          return (
            <article key={e.id} data-testid={`experience-card-${e.id}`}
                     className="group relative overflow-hidden bg-[#1A1513] hover:bg-[#221A16] transition-colors duration-500 flex flex-col">
              <div className="relative aspect-[5/3] overflow-hidden">
                <EditableImage
                  slot={`viajes.experience.${e.id}`}
                  fallback={e.image}
                  alt={pick(e.label, lang)}
                  aspectRatio="5/3"
                  imgProps={{ loading: "lazy" }}
                  className="absolute inset-0 w-full h-full object-cover opacity-70 transition-all duration-[1200ms] ease-out group-hover:opacity-100 group-hover:scale-[1.05]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1513] via-[#1A1513]/40 to-transparent pointer-events-none" />
                <span className="absolute bottom-4 left-4 inline-flex items-center justify-center w-12 h-12 rounded-full border bg-[#1A1513]/70 backdrop-blur-sm"
                      style={{ borderColor: `${e.accent}99`, color: e.accent }}>
                  <Icon className="w-5 h-5" strokeWidth={1.5} />
                </span>
              </div>
              <div className="p-7 md:p-9 flex flex-col flex-1">
                <h3 className="font-serif-x text-2xl md:text-[26px] leading-[1.1]">
                  {pick(e.label, lang)}
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-[#FDFBF7]/75 flex-1">
                  {pick(e.blurb, lang)}
                </p>
                <a href="#explorer"
                   data-testid={`experience-explore-${e.id}`}
                   className="mt-6 inline-flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase border-b pb-1 self-start group-hover:gap-3 transition-all duration-300"
                   style={{ borderColor: `${e.accent}66`, color: e.accent }}>
                  {t.cta}
                  <ArrowRight className="w-3 h-3" strokeWidth={1.5} />
                </a>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  </section>
);

/* ============================================================
   5 — Interactive Trip Explorer (filter by region + experience)
============================================================ */
const TripExplorer = ({ t, lang }) => {
  const [region, setRegion] = useState("all-filter");
  const [experience, setExperience] = useState("all-filter");

  const filtered = useMemo(() => {
    return TRIPS.filter((trip) => {
      const matchesRegion = region === "all-filter" || trip.region === region;
      const matchesExp = experience === "all-filter" || trip.experiences.includes(experience);
      return matchesRegion && matchesExp;
    });
  }, [region, experience]);

  return (
    <section id="explorer" data-testid="viajes-explorer"
             className="relative bg-[#F2EBE1] py-24 md:py-32 overflow-hidden">
      <div className="absolute inset-0 berber-bg-diamond opacity-40 pointer-events-none" aria-hidden="true" />

      <div className="relative max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end mb-12">
          <div className="md:col-span-7">
            <span className="overline inline-flex items-center gap-2">
              <Filter className="w-3.5 h-3.5" strokeWidth={1.6} />
              {t.overline}
            </span>
            <h2 className="font-serif-x text-4xl md:text-5xl lg:text-6xl leading-[1.05] tracking-tight mt-5 text-[#2C2621]">
              {t.title}
            </h2>
          </div>
          <div className="md:col-span-5">
            <p className="text-base md:text-lg text-[#5C5248] leading-relaxed">{t.body}</p>
          </div>
        </div>

        {/* Filter row — region */}
        <div className="mt-2">
          <p className="text-[10px] tracking-[0.3em] uppercase text-[#5C5248] mb-3">{t.label_region}</p>
          <div role="tablist" aria-label="Region filter" className="flex flex-wrap gap-2">
            <FilterChip data-testid="region-chip-all"
                        active={region === "all-filter"}
                        onClick={() => setRegion("all-filter")}>
              {t.all}
            </FilterChip>
            {REGIONS.map((r) => (
              <FilterChip key={r.id} data-testid={`region-chip-${r.id}`}
                          active={region === r.id} accent={r.accent}
                          onClick={() => setRegion(r.id)}>
                {pick(r.label, lang)}
              </FilterChip>
            ))}
          </div>
        </div>

        {/* Filter row — experience */}
        <div className="mt-7">
          <p className="text-[10px] tracking-[0.3em] uppercase text-[#5C5248] mb-3">{t.label_experience}</p>
          <div role="tablist" aria-label="Experience filter" className="flex flex-wrap gap-2">
            <FilterChip data-testid="experience-chip-all"
                        active={experience === "all-filter"}
                        onClick={() => setExperience("all-filter")}>
              {t.all}
            </FilterChip>
            {EXPERIENCES.map((e) => (
              <FilterChip key={e.id} data-testid={`experience-chip-${e.id}`}
                          active={experience === e.id} accent={e.accent}
                          onClick={() => setExperience(e.id)}>
                {pick(e.label, lang)}
              </FilterChip>
            ))}
          </div>
        </div>

        {/* Result count */}
        <div className="mt-8 flex items-center justify-between flex-wrap gap-3">
          <p data-testid="explorer-result-count"
             className="text-sm text-[#5C5248]">
            <span className="font-serif-x text-2xl text-[#2C2621] mr-2">{filtered.length}</span>
            {filtered.length === 1 ? t.result_singular : t.result_plural}
          </p>
          {(region !== "all-filter" || experience !== "all-filter") && (
            <button
              data-testid="explorer-clear"
              onClick={() => { setRegion("all-filter"); setExperience("all-filter"); }}
              className="text-[10px] tracking-[0.3em] uppercase text-[#C16542] hover:text-[#2C2621] transition-colors border-b border-[#C16542]/40 pb-1"
            >
              {t.clear}
            </button>
          )}
        </div>

        {/* Trip grid */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {filtered.length === 0 ? (
            <div data-testid="explorer-empty"
                 className="col-span-full bg-[#FDFBF7] border border-[#2C2621]/10 p-12 text-center">
              <p className="font-serif-x text-2xl text-[#2C2621]">{t.empty_title}</p>
              <p className="mt-3 text-sm text-[#5C5248]">{t.empty_body}</p>
            </div>
          ) : filtered.map((trip) => {
            const exps = trip.experiences.map((eid) => EXPERIENCES.find((e) => e.id === eid)).filter(Boolean);
            const reg = REGIONS.find((r) => r.id === trip.region);
            return (
              <article key={trip.id} data-testid={`trip-card-${trip.id}`}
                       className="group relative bg-[#FDFBF7] border border-[#2C2621]/10 hover:border-[#2C2621]/30 transition-colors duration-300 flex flex-col overflow-hidden">
                <div className="relative aspect-[4/3] overflow-hidden bg-[#1A1513]">
                  <EditableImage
                    slot={`viajes.trip.${trip.id}`}
                    fallback={trip.image}
                    alt={pick(trip.title, lang)}
                    aspectRatio="4/3"
                    imgProps={{ loading: "lazy" }}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.06]"
                  />
                  <span className="absolute top-3 left-3 inline-flex items-center gap-2 bg-[#FDFBF7]/95 backdrop-blur-sm px-3 py-1.5 text-[10px] tracking-[0.25em] uppercase"
                        style={{ color: reg?.accent || "#5C5248" }}>
                    <MapPin className="w-3 h-3" strokeWidth={1.6} />
                    {pick(reg?.label, lang)}
                  </span>
                  <span className="absolute top-3 right-3 inline-flex items-center gap-2 bg-[#1A1513]/65 backdrop-blur-sm text-[#FDFBF7] px-3 py-1.5 text-[10px] tracking-[0.25em] uppercase">
                    <Clock className="w-3 h-3" strokeWidth={1.6} />
                    {pick(trip.duration, lang)}
                  </span>
                </div>
                <div className="p-6 md:p-7 flex flex-col flex-1">
                  <h3 className="font-serif-x text-xl md:text-[22px] leading-[1.15] text-[#2C2621]">
                    {pick(trip.title, lang)}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#5C5248] flex-1">
                    {pick(trip.summary, lang)}
                  </p>

                  {/* Experience badges */}
                  <div className="mt-5 flex flex-wrap gap-1.5">
                    {exps.map((e) => (
                      <span key={e.id} className="text-[9px] tracking-[0.2em] uppercase px-2 py-1 border"
                            style={{ borderColor: `${e.accent}55`, color: e.accent }}>
                        {pick(e.label, lang)}
                      </span>
                    ))}
                  </div>

                  <div className="mt-5 pt-4 border-t border-[#2C2621]/10 flex items-end justify-between gap-3">
                    <div>
                      <p className="text-[10px] tracking-[0.25em] uppercase text-[#5C5248]">{t.from_label}</p>
                      <p className="font-serif-x text-xl text-[#2C2621] mt-0.5">€{trip.from.toLocaleString()}</p>
                    </div>
                    <Link to={pathFor(lang, "contact")}
                          data-testid={`trip-cta-${trip.id}`}
                          className="inline-flex items-center gap-2 text-[10px] tracking-[0.25em] uppercase text-[#C16542] hover:gap-3 transition-all duration-300 border-b border-[#C16542]/40 pb-1">
                      {t.cta_card}
                      <ArrowRight className="w-3 h-3" strokeWidth={1.5} />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const FilterChip = ({ active, accent, onClick, children, ...rest }) => (
  <button
    {...rest}
    onClick={onClick}
    role="tab"
    aria-selected={active}
    className={`px-4 md:px-5 py-2 text-[10px] tracking-[0.25em] uppercase transition-all duration-300 ${
      active
        ? "bg-[#2C2621] text-[#FDFBF7] border border-[#2C2621]"
        : "border border-[#2C2621]/20 text-[#5C5248] hover:text-[#2C2621]"
    }`}
    style={active && accent ? { background: accent, borderColor: accent } : undefined}
  >
    {children}
  </button>
);

/* ============================================================
   6 — Próximas Salidas (kept from previous design)
============================================================ */
const ProximasSalidas = ({ t, lang }) => {
  const DEPARTURES = [
    { season: { es: "Semana Santa 2026", en: "Easter 2026",   fr: "Pâques 2026" }, dates: "28 Mar — 04 Abr",
      title:  { es: "Sáhara & Alto Atlas", en: "Sahara & High Atlas", fr: "Sahara & Haut Atlas" },
      spots: 4, accent: "#C16542", image: "https://images.unsplash.com/photo-1542401886-65d6c61db217?auto=format&fit=crop&w=1600&q=85" },
    { season: { es: "Verano 2026", en: "Summer 2026", fr: "Été 2026" }, dates: "12 Jul — 23 Jul",
      title:  { es: "Norte de Marruecos & costas", en: "Northern Morocco & coasts", fr: "Nord du Maroc & côtes" },
      spots: 6, accent: "#3A4A5F", image: "https://images.unsplash.com/photo-1547234935-80c7145ec969?auto=format&fit=crop&w=1600&q=85" },
    { season: { es: "Otoño 2026", en: "Autumn 2026", fr: "Automne 2026" }, dates: "10 Oct — 21 Oct",
      title:  { es: "Marruecos al completo", en: "Full Morocco", fr: "Maroc intégral" },
      spots: 8, accent: "#A07042", image: "https://images.unsplash.com/photo-1570133435536-7ececf000ef6?auto=format&fit=crop&w=1600&q=85" },
    { season: { es: "Fin de año 2026", en: "New Year 2026", fr: "Nouvel An 2026" }, dates: "27 Dic — 03 Ene",
      title:  { es: "Bivouac Erg Chigaga", en: "Erg Chigaga bivouac", fr: "Bivouac Erg Chigaga" },
      spots: 2, accent: "#D97742", image: "https://images.unsplash.com/photo-1547234935-80c7145ec969?auto=format&fit=crop&w=1600&q=85" },
  ];

  return (
    <section id="proximas" data-testid="viajes-proximas"
             className="relative bg-[#FDFBF7] py-24 md:py-32 overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-end mb-14">
          <div className="md:col-span-7">
            <span className="overline">{t.overline}</span>
            <h2 className="font-serif-x text-4xl md:text-5xl lg:text-6xl leading-[1.05] tracking-tight mt-5 text-[#2C2621]">
              {t.title}
            </h2>
          </div>
          <div className="md:col-span-5">
            <p className="text-base md:text-lg text-[#5C5248] leading-relaxed">{t.body}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {DEPARTURES.map((d, i) => (
            <article key={i} data-testid={`proxima-card-${i}`}
                     className="group relative bg-[#F2EBE1] border border-[#2C2621]/10 hover:border-[#2C2621]/30 transition-colors duration-300 flex flex-col overflow-hidden">
              <div className="relative aspect-[5/4] overflow-hidden bg-[#1A1513]">
                <EditableImage
                  slot={`viajes.proxima.${d.id || i}`}
                  fallback={d.image}
                  alt={pick(d.title, lang)}
                  aspectRatio="5/4"
                  imgProps={{ loading: "lazy" }}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.06]"
                />
                <span className="absolute top-4 left-4 inline-flex items-center gap-2 bg-[#FDFBF7]/95 backdrop-blur-sm px-3 py-1.5 text-[10px] tracking-[0.25em] uppercase"
                      style={{ color: d.accent }}>
                  <Calendar className="w-3 h-3" strokeWidth={1.6} />
                  {pick(d.season, lang)}
                </span>
                {d.spots <= 2 && (
                  <span className="absolute top-4 right-4 bg-[#C16542] text-[#FDFBF7] px-3 py-1.5 text-[9px] tracking-[0.25em] uppercase">
                    {t.last_spots}
                  </span>
                )}
              </div>
              <div className="p-6 md:p-7 flex flex-col flex-1">
                <p className="font-serif-x-italic text-base text-[#5C5248]">{d.dates}</p>
                <h3 className="font-serif-x text-xl md:text-[22px] leading-[1.15] mt-2 text-[#2C2621]">
                  {pick(d.title, lang)}
                </h3>
                <div className="mt-auto pt-5 border-t border-[#2C2621]/10 flex items-center justify-between">
                  <span className="text-[10px] tracking-[0.25em] uppercase text-[#5C5248]">
                    {d.spots} {t.spots}
                  </span>
                  <Link to={pathFor(lang, "contact")} data-testid={`proxima-cta-${i}`}
                        className="inline-flex items-center gap-2 text-[10px] tracking-[0.25em] uppercase text-[#C16542] hover:gap-3 transition-all duration-300">
                    {t.reserve}
                    <ArrowRight className="w-3 h-3" strokeWidth={1.5} />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ============================================================
   7 — Asesoramiento
============================================================ */
const Asesoramiento = ({ t, lang }) => {
  const OPTIONS = [
    { icon: Phone,         k: "phone",   accent: "#C16542", href: `tel:${CONTACT.phoneRaw}` },
    { icon: Calendar,      k: "visit",   accent: "#D4A373", href: pathFor(lang, "appointment") },
    { icon: MessageCircle, k: "spec",    accent: "#3A4A5F", href: pathFor(lang, "contact") },
  ];

  return (
    <section id="asesoramiento" data-testid="viajes-asesoramiento"
             className="relative bg-[#1A1513] text-[#FDFBF7] py-24 md:py-32 overflow-hidden">
      <EditableImage
        slot="viajes.asesoramiento.bg"
        fallback="https://images.unsplash.com/photo-1489493585363-d69421e0edd3?auto=format&fit=crop&w=2000&q=85"
        alt=""
        aspectRatio="21/9"
        imgProps={{ loading: "lazy" }}
        className="absolute inset-0 w-full h-full object-cover opacity-25"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#1A1513]/90 via-[#1A1513]/75 to-[#1A1513]/95 pointer-events-none" />
      <div className="absolute inset-0 berber-bg-cross opacity-40" aria-hidden="true" />
      <span className="film-grain" />

      <div className="relative max-w-7xl mx-auto px-6 md:px-12">
        <div className="max-w-3xl text-center mx-auto">
          <span className="overline text-[#D4A373]">{t.overline}</span>
          <h2 className="font-serif-x text-4xl md:text-5xl lg:text-6xl leading-[1.05] tracking-tight mt-5">
            {t.title}
          </h2>
          <p className="mt-5 font-serif-x-italic text-xl md:text-2xl text-[#D4A373]/90">{t.subtitle}</p>
          <p className="mt-6 text-base md:text-lg text-[#FDFBF7]/75 leading-relaxed">{t.body}</p>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {OPTIONS.map((o, i) => {
            const Icon = o.icon;
            const isExternal = o.href.startsWith("tel:") || o.href.startsWith("mailto:") || o.href.startsWith("http");
            const Wrapper = isExternal ? "a" : Link;
            const props = isExternal ? { href: o.href } : { to: o.href };
            return (
              <Wrapper key={i} {...props} data-testid={`asesoramiento-card-${i}`}
                       className="group relative bg-[#FDFBF7]/[0.05] backdrop-blur-md border border-[#FDFBF7]/15 hover:border-[#D4A373]/50 transition-all duration-500 p-8 md:p-10 flex flex-col overflow-hidden">
                <div className="absolute -top-3 -right-3 berber-bg-cross w-24 h-24 opacity-25" aria-hidden="true" />
                <span className="inline-flex items-center justify-center w-12 h-12 rounded-full border"
                      style={{ borderColor: `${o.accent}88`, color: o.accent }}>
                  <Icon className="w-5 h-5" strokeWidth={1.5} />
                </span>
                <h3 className="font-serif-x text-2xl md:text-[26px] leading-[1.1] mt-8 text-[#FDFBF7]">
                  {t[`${o.k}_t`]}
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-[#FDFBF7]/70 flex-1">{t[`${o.k}_b`]}</p>
                <span className="mt-8 inline-flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase border-b pb-1 self-start group-hover:gap-3 transition-all duration-300"
                      style={{ borderColor: `${o.accent}66`, color: o.accent }}>
                  {t[`${o.k}_cta`]}
                  <ArrowRight className="w-3 h-3" strokeWidth={1.5} />
                </span>
              </Wrapper>
            );
          })}
        </div>
      </div>
    </section>
  );
};

/* ============================================================
   8 — Contact intro
============================================================ */
const ContactIntro = ({ t }) => (
  <section data-testid="viajes-contact-intro" className="relative bg-[#FDFBF7] py-24 md:py-32 overflow-hidden">
    <div className="relative max-w-7xl mx-auto px-6 md:px-12">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-16 items-center">
        <div className="md:col-span-7">
          <span className="overline">{t.overline}</span>
          <h2 className="font-serif-x text-4xl md:text-5xl lg:text-6xl leading-[1.05] tracking-tight mt-5 text-[#2C2621]">
            {t.title}
          </h2>
          <p className="mt-6 text-base md:text-lg text-[#5C5248] leading-relaxed max-w-2xl">{t.body}</p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a href="#contact" data-testid="viajes-contact-cta-form"
               className="inline-flex items-center gap-3 bg-[#C16542] hover:bg-[#A35133] text-[#FDFBF7] px-7 py-4 text-[11px] tracking-[0.25em] uppercase transition-colors">
              {t.cta_form}<ArrowRight className="w-3.5 h-3.5" strokeWidth={1.6} />
            </a>
            <a href={`https://wa.me/${CONTACT.phoneRaw.replace("+", "")}`} target="_blank" rel="noreferrer"
               data-testid="viajes-contact-cta-wa"
               className="inline-flex items-center gap-3 border border-[#2C2621]/25 hover:border-[#2C2621] hover:bg-[#2C2621] hover:text-[#FDFBF7] text-[#2C2621] px-7 py-4 text-[11px] tracking-[0.25em] uppercase transition-all duration-300">
              <MessageCircle className="w-3.5 h-3.5" strokeWidth={1.6} />WhatsApp
            </a>
          </div>
        </div>
        <div className="md:col-span-5 space-y-4">
          {[
            { label: t.phone_label, icon: Phone, value: CONTACT.phone, href: `tel:${CONTACT.phoneRaw}` },
            { label: t.email_label, icon: Mail,  value: CONTACT.email, href: `mailto:${CONTACT.email}` },
            { label: t.hours_label, icon: Building2, value: t.hours_value },
          ].map((c, i) => (
            <div key={i} className="bg-[#F2EBE1] border border-[#2C2621]/10 p-6 md:p-7">
              <span className="overline">{c.label}</span>
              {c.href ? (
                <a href={c.href} className="mt-3 flex items-center gap-3 font-serif-x text-xl text-[#2C2621] hover:text-[#C16542] transition-colors break-all">
                  <c.icon className="w-5 h-5 text-[#C16542]" strokeWidth={1.5} />{c.value}
                </a>
              ) : (
                <p className="mt-3 flex items-center gap-3 text-sm text-[#2C2621]">
                  <c.icon className="w-4 h-4 text-[#C16542]" strokeWidth={1.5} />{c.value}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

/* ============================================================
   Trilingual copy
============================================================ */
const COPY = {
  es: {
    docTitle: "Viajes por Marruecos · Xaluca Tours",
    hero: {
      eyebrow: "Xaluca Tours · Viajes", eyebrow_place: "Erg Chebbi · Sáhara",
      title: "Viajes por Marruecos",
      subtitle: "Descubre rutas únicas, escapadas exclusivas y aventuras inolvidables por el corazón de Marruecos.",
      intro: "Explora todos nuestros viajes por región o por estilo de experiencia. Circuitos organizados, salidas en grupo y viajes a medida durante todo el año.",
      cta_primary: "Explorar por región", cta_secondary: "Buscar mi viaje", scroll: "Desplázate",
    },
    intro: {
      eyebrow: "Una aventura, un país",
      title: "Marruecos, explorado a tu manera.",
      body: "Tres regiones, cinco estilos de experiencia y decenas de itinerarios — para que encuentres exactamente el viaje que estás imaginando.",
    },
    regions: {
      overline: "Por región", title: "Tres maneras de entrar en Marruecos.",
      body: "Cada región tiene su carácter, su luz y su ritmo. Elige por dónde quieres empezar — o recorre el país entero.",
      cta: "Descubrir rutas",
    },
    experiences: {
      overline: "Por experiencia", title: "Cinco estilos de viaje.",
      body: "Del silencio del desierto a las cumbres del Atlas, de los talleres de artesanos a las salidas en grupo. Encuentra tu manera de viajar.",
      cta: "Ver viajes",
    },
    explorer: {
      overline: "Encuentra tu viaje", title: "Filtra y descubre.",
      body: "Combina región y experiencia para ver exactamente los viajes que encajan contigo.",
      label_region: "Región", label_experience: "Experiencia", all: "Todos",
      result_singular: "viaje encontrado", result_plural: "viajes encontrados", clear: "Limpiar filtros",
      empty_title: "No hay viajes con estos filtros.",
      empty_body: "Prueba otra combinación o solicita un viaje a medida — lo diseñaremos exactamente como lo imaginas.",
      from_label: "Desde", cta_card: "Más info",
    },
    proximas: {
      overline: "Próximas salidas", title: "Próximas salidas a Marruecos.",
      body: "Circuitos organizados con fechas cerradas y salidas en grupo durante Semana Santa, verano, fin de año y otras ocasiones especiales.",
      last_spots: "Últimas plazas", spots: "plazas", reserve: "Reservar",
    },
    asesoramiento: {
      overline: "Asesoramiento personalizado",
      title: "¿Tienes preguntas sobre tu viaje?",
      subtitle: "Asesoramiento online en tiempo real o visítanos en nuestras oficinas.",
      body: "Planifica tu próxima aventura por Marruecos y resuelve todas tus dudas con nuestros especialistas.",
      phone_t: "Reservar cita telefónica", phone_b: "Habla con un especialista por teléfono.", phone_cta: "Llamar ahora",
      visit_t: "Pedir cita previa", visit_b: "Acércate a nuestras oficinas y planifica tu viaje en persona.", visit_cta: "Pedir cita",
      spec_t: "Contactar con un especialista", spec_b: "Asesoramiento online en tiempo real con nuestro equipo.", spec_cta: "Escribir ahora",
    },
    contact: {
      overline: "Contacto", title: "¿Te interesan nuestros viajes por Marruecos?",
      body: "Sin compromiso, rellena el formulario o solicita una cita previa y nuestro equipo te ayudará a organizar tu próxima aventura.",
      cta_form: "Rellenar formulario",
      phone_label: "Teléfono", email_label: "Email", hours_label: "Horario",
      hours_value: "De lunes a viernes · 10h – 20h",
    },
  },
  en: {
    docTitle: "Morocco journeys · Xaluca Tours",
    hero: {
      eyebrow: "Xaluca Tours · Journeys", eyebrow_place: "Erg Chebbi · Sahara",
      title: "Morocco journeys",
      subtitle: "Discover unique routes, exclusive escapes and unforgettable adventures across the heart of Morocco.",
      intro: "Explore every trip by region or by travel style. Curated departures, group trips and tailor-made journeys all year round.",
      cta_primary: "Browse by region", cta_secondary: "Find my trip", scroll: "Scroll",
    },
    intro: {
      eyebrow: "An adventure, a country",
      title: "Morocco, explored your way.",
      body: "Three regions, five experience styles and dozens of itineraries — so you find exactly the journey you're imagining.",
    },
    regions: {
      overline: "By region", title: "Three ways into Morocco.",
      body: "Each region has its own character, light and rhythm. Choose where to start — or cross the whole country.",
      cta: "Discover routes",
    },
    experiences: {
      overline: "By experience", title: "Five travel styles.",
      body: "From desert silence to Atlas summits, from artisan workshops to group departures. Find the way you love to travel.",
      cta: "View trips",
    },
    explorer: {
      overline: "Find your trip", title: "Filter and discover.",
      body: "Combine region and experience to see exactly the trips that fit you.",
      label_region: "Region", label_experience: "Experience", all: "All",
      result_singular: "trip found", result_plural: "trips found", clear: "Clear filters",
      empty_title: "No trips with these filters.",
      empty_body: "Try another combination — or request a tailor-made trip and we'll design exactly what you imagine.",
      from_label: "From", cta_card: "Learn more",
    },
    proximas: {
      overline: "Upcoming departures", title: "Upcoming Morocco departures.",
      body: "Curated group departures with fixed dates throughout Easter, summer, New Year and other special occasions.",
      last_spots: "Last spots", spots: "spots", reserve: "Book",
    },
    asesoramiento: {
      overline: "Personal consultation",
      title: "Questions about your trip?",
      subtitle: "Real-time online advice or visit us at our offices.",
      body: "Plan your next Moroccan adventure and clear every doubt with our specialists.",
      phone_t: "Book a phone call", phone_b: "Speak with a specialist by phone.", phone_cta: "Call now",
      visit_t: "Book an in-person visit", visit_b: "Come to our offices and plan in person.", visit_cta: "Book a visit",
      spec_t: "Talk to a specialist", spec_b: "Real-time online advice from our expert team.", spec_cta: "Write now",
    },
    contact: {
      overline: "Contact", title: "Interested in our Morocco journeys?",
      body: "No commitment — fill out the form or request an appointment, and our team will help plan your next adventure.",
      cta_form: "Open the form",
      phone_label: "Phone", email_label: "Email", hours_label: "Hours",
      hours_value: "Monday — Friday · 10:00 – 20:00",
    },
  },
  fr: {
    docTitle: "Voyages au Maroc · Xaluca Tours",
    hero: {
      eyebrow: "Xaluca Tours · Voyages", eyebrow_place: "Erg Chebbi · Sahara",
      title: "Voyages au Maroc",
      subtitle: "Découvrez des itinéraires uniques, des escapades exclusives et des aventures inoubliables au cœur du Maroc.",
      intro: "Parcourez tous nos voyages par région ou par style. Départs organisés, groupes et voyages sur mesure toute l'année.",
      cta_primary: "Par région", cta_secondary: "Trouver mon voyage", scroll: "Faites défiler",
    },
    intro: {
      eyebrow: "Une aventure, un pays",
      title: "Le Maroc, à votre façon.",
      body: "Trois régions, cinq styles d'expérience et des dizaines d'itinéraires — pour trouver exactement le voyage que vous imaginez.",
    },
    regions: {
      overline: "Par région", title: "Trois portes d'entrée au Maroc.",
      body: "Chaque région a son caractère, sa lumière et son rythme. Choisissez où commencer — ou traversez tout le pays.",
      cta: "Découvrir les itinéraires",
    },
    experiences: {
      overline: "Par expérience", title: "Cinq styles de voyage.",
      body: "Du silence du désert aux sommets de l'Atlas, des ateliers d'artisans aux départs en groupe. Trouvez votre façon de voyager.",
      cta: "Voir les voyages",
    },
    explorer: {
      overline: "Trouvez votre voyage", title: "Filtrez et découvrez.",
      body: "Combinez région et expérience pour voir exactement les voyages qui vous correspondent.",
      label_region: "Région", label_experience: "Expérience", all: "Tous",
      result_singular: "voyage trouvé", result_plural: "voyages trouvés", clear: "Effacer les filtres",
      empty_title: "Aucun voyage avec ces filtres.",
      empty_body: "Essayez une autre combinaison ou demandez un voyage sur mesure — nous le concevrons exactement comme vous l'imaginez.",
      from_label: "Dès", cta_card: "En savoir plus",
    },
    proximas: {
      overline: "Prochains départs", title: "Prochains départs au Maroc.",
      body: "Départs en groupe à dates fixes pendant Pâques, l'été, le Nouvel An et d'autres occasions spéciales.",
      last_spots: "Dernières places", spots: "places", reserve: "Réserver",
    },
    asesoramiento: {
      overline: "Conseil personnalisé",
      title: "Des questions sur votre voyage ?",
      subtitle: "Conseil en ligne en temps réel ou rendez-vous à nos bureaux.",
      body: "Planifiez votre prochaine aventure au Maroc et levez tous vos doutes avec nos spécialistes.",
      phone_t: "Réserver un appel", phone_b: "Parlez à un spécialiste au téléphone.", phone_cta: "Appeler",
      visit_t: "Prendre rendez-vous", visit_b: "Venez à nos bureaux et planifiez en personne.", visit_cta: "Prendre rendez-vous",
      spec_t: "Contacter un spécialiste", spec_b: "Conseil en ligne en temps réel.", spec_cta: "Écrire",
    },
    contact: {
      overline: "Contact", title: "Nos voyages au Maroc vous intéressent ?",
      body: "Sans engagement — remplissez le formulaire ou demandez un rendez-vous, notre équipe organisera votre prochaine aventure.",
      cta_form: "Ouvrir le formulaire",
      phone_label: "Téléphone", email_label: "Email", hours_label: "Horaires",
      hours_value: "Lundi — Vendredi · 10h – 20h",
    },
  },
};

/* ============================================================
   Page
============================================================ */
export default function ToursLandingPage() {
  const { lang } = useLanguage();
  const t = COPY[lang] || COPY.es;

  useEffect(() => {
    document.title = t.docTitle;
    window.scrollTo(0, 0);
  }, [t.docTitle]);

  return (
    <div data-testid="tours-landing-page">
      <Hero t={t.hero} />
      <EditorialIntro t={t.intro} />
      <RegionsSection t={t.regions} lang={lang} />
      <ExperiencesSection t={t.experiences} lang={lang} />
      <TripExplorer t={t.explorer} lang={lang} />
      <ProximasSalidas t={t.proximas} lang={lang} />
      <Asesoramiento t={t.asesoramiento} lang={lang} />
      <ContactIntro t={t.contact} />
      <ContactForm />
    </div>
  );
}
