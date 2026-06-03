/* ============================================================
   HomeAllTripsCatalog.jsx
   ----
   Home-page section that lists every itinerary the agency runs,
   so every route is one click away from the landing page.

   Interactive filters: region · duration · pace.
   Each card is a React Router <Link> deep-linking into the
   matching trip page registered in `lib/routes.js`.
============================================================ */
import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Moon, Compass, Gauge } from "lucide-react";
import { useLanguage, pick } from "@/contexts/LanguageContext";
import EditableImage from "@/components/EditableImage";
import monogramaX from "@/assets/monograma-x-crop.png";
import FromPrice from "@/components/FromPrice";
import { SlotScope } from "@/components/slotScope";
import { pathFor } from "@/lib/routes";
import { tripHeroSlot } from "@/lib/tripHero";
import {
  ALL_TRIPS,
  TRIP_REGIONS,
  TRIP_PACES,
  TRIP_DURATIONS,
} from "@/lib/allTripsCatalog";

const COPY = {
  eyebrow: { es: "Todos los viajes", en: "Every trip we run", fr: "Tous nos voyages" },
  title:   { es: "Cada ruta, en detalle",
             en: "Every route, in detail",
             fr: "Chaque itinéraire, en détail" },
  subtitle:{ es: "Atajo directo a la ficha de cada viaje. Filtra por duración, región o ritmo para encontrar el tuyo.",
             en: "A direct shortcut to every itinerary. Filter by duration, region or pace to find yours.",
             fr: "Raccourci direct vers chaque itinéraire. Filtrez par durée, région ou intensité pour trouver le vôtre." },
  count:   { es: "viajes disponibles", en: "trips available", fr: "voyages disponibles" },
  noMatch: { es: "Ningún viaje coincide con esos filtros · prueba a relajar uno.",
             en: "No trip matches these filters · try relaxing one.",
             fr: "Aucun voyage ne correspond · essayez d'assouplir un filtre." },
  region:   { es: "Región",   en: "Region",   fr: "Région" },
  duration: { es: "Duración", en: "Duration", fr: "Durée" },
  pace:     { es: "Ritmo",    en: "Pace",     fr: "Intensité" },
  details:  { es: "Ver itinerario", en: "View itinerary", fr: "Voir l'itinéraire" },
  nights:   { es: "noches",  en: "nights",   fr: "nuits" },
};

const PACE_LABEL = {
  calmo:       { es: "Relajado",    en: "Relaxed",  fr: "Détendu" },
  equilibrado: { es: "Equilibrado", en: "Balanced", fr: "Équilibré" },
  intenso:     { es: "Intenso",     en: "Intense",  fr: "Intense" },
};

const REGION_LABEL = {
  sur:       { es: "Sur · Desierto",     en: "South · Desert",   fr: "Sud · Désert" },
  norte:     { es: "Norte · Ciudades",   en: "North · Cities",   fr: "Nord · Cités" },
  completo:  { es: "Marruecos integral", en: "Full Morocco",     fr: "Maroc intégral" },
  escapadas: { es: "Escapadas cortas",   en: "Short escapes",    fr: "Escapades courtes" },
  aventura:  { es: "Aventura",           en: "Adventure",        fr: "Aventure" },
  eventos:   { es: "Eventos",            en: "Events",           fr: "Événements" },
};

/* ---------- Filter chips ---------- */
const ChipGroup = ({ icon: Icon, label, options, value, onChange, testidBase }) => (
  <div className="flex flex-wrap items-center gap-2 md:gap-3">
    <span className="inline-flex items-center gap-1.5 text-[10px] tracking-[0.3em] uppercase text-[#5C5248] mr-1">
      {Icon && <Icon className="w-3.5 h-3.5" strokeWidth={1.6} />}
      {label}
    </span>
    {options.map((o) => {
      const active = value === o.id;
      return (
        <button
          key={o.id}
          type="button"
          data-testid={`${testidBase}-${o.id}`}
          onClick={() => onChange(o.id)}
          aria-pressed={active}
          className={`px-3 py-1.5 text-[11px] tracking-[0.2em] uppercase border transition-colors ${
            active
              ? "bg-[#2C2621] text-[#FDFBF7] border-[#2C2621]"
              : "bg-transparent text-[#5C5248] border-[#2C2621]/20 hover:text-[#2C2621] hover:border-[#2C2621]/50"
          }`}
        >
          {o.label.es && o.label.en && o.label.fr ? null : null}
          {/* label is i18n, we use pick from parent — see usage */}
          {o._renderedLabel}
        </button>
      );
    })}
  </div>
);

/* ---------- Card ---------- */
const TripCard = ({ trip, lang }) => {
  const href = pathFor(lang, trip.routeId);
  // Shares the trip's MASTER image slot with the page Hero and all listings.
  const slot = tripHeroSlot(trip.routeId);
  return (
    <SlotScope id={trip.routeId}>
      <Link
        to={href}
        data-testid={`home-all-trips-card-${trip.routeId}`}
        className="group flex flex-col bg-[#FDFBF7] border border-[#2C2621]/10 hover:border-[#C16542]/60 transition-all duration-300 overflow-hidden hover:-translate-y-1 hover:shadow-[0_18px_40px_-20px_rgba(44,38,33,0.35)]"
      >
        <div className="relative w-full aspect-[4/3] overflow-hidden bg-[#1A1513]">
          <EditableImage
            slot={slot}
            fallback={trip.image}
            alt={pick(trip.title, lang)}
            aspectRatio="4/3"
            imgProps={{ loading: "lazy" }}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]"
          />
          {/* Xaluca "&" monogram — anchored to the bottom-right edge */}
          <img
            src={monogramaX}
            alt=""
            aria-hidden="true"
            data-testid={`home-all-trips-monogram-${trip.routeId}`}
            className="pointer-events-none select-none absolute right-0 bottom-0 h-[78%] w-auto object-contain opacity-55 drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)]"
          />
          {/* Region badge */}
          <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 bg-[#FDFBF7]/95 backdrop-blur-sm px-2.5 py-1 text-[9px] tracking-[0.28em] uppercase text-[#2C2621]">
            {pick(REGION_LABEL[trip.region] || { es: trip.region }, lang)}
          </span>
          {/* Pace badge */}
          <span className="absolute top-3 right-3 inline-flex items-center gap-1.5 bg-[#2C2621]/90 backdrop-blur-sm px-2.5 py-1 text-[9px] tracking-[0.28em] uppercase text-[#FDFBF7]">
            {pick(PACE_LABEL[trip.pace] || { es: trip.pace }, lang)}
          </span>
        </div>
        <div className="flex flex-col flex-1 p-5">
          <div className="flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase text-[#C16542] mb-2">
            <Moon className="w-3 h-3" strokeWidth={1.7} />
            {trip.nights} {pick(COPY.nights, lang)}
          </div>
          <h3 className="font-serif text-xl md:text-[22px] text-[#2C2621] leading-tight mb-2">
            {pick(trip.title, lang)}
          </h3>
          <p className="text-[13px] text-[#5C5248] leading-relaxed flex-1">
            {pick(trip.summary, lang)}
          </p>
          <div className="mt-5">
            <FromPrice tone="dark" size="md" testid={`home-all-trips-from-${trip.routeId}`} />
          </div>
          <div className="mt-5 pt-4 border-t border-[#2C2621]/10">
            <span className="inline-flex items-center gap-2 text-[10px] tracking-[0.28em] uppercase text-[#2C2621] group-hover:text-[#C16542] transition-colors">
              {pick(COPY.details, lang)}
              <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={1.8} />
            </span>
          </div>
        </div>
      </Link>
    </SlotScope>
  );
};

/* ---------- Section ---------- */
const HomeAllTripsCatalog = () => {
  const { lang } = useLanguage();
  const [region, setRegion]     = useState("all");
  const [duration, setDuration] = useState("any");
  const [pace, setPace]         = useState("any");

  const filtered = useMemo(() => {
    return ALL_TRIPS.filter((t) => {
      if (region !== "all" && t.region !== region) return false;
      if (duration !== "any" && t.durationBucket !== duration) return false;
      if (pace !== "any" && t.pace !== pace) return false;
      return true;
    });
  }, [region, duration, pace]);

  // Inject the i18n-resolved label into each option for ChipGroup
  const r = TRIP_REGIONS.map((o)   => ({ ...o, _renderedLabel: pick(o.label, lang) }));
  const d = TRIP_DURATIONS.map((o) => ({ ...o, _renderedLabel: pick(o.label, lang) }));
  const p = TRIP_PACES.map((o)     => ({ ...o, _renderedLabel: pick(o.label, lang) }));

  return (
    <SlotScope id="home.all-trips">
      <section
        data-testid="home-all-trips"
        className="w-full bg-[#FDFBF7] py-16 md:py-24 border-y border-[#2C2621]/10"
      >
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          {/* Header */}
          <div className="max-w-3xl mb-10">
            <span className="block text-[11px] tracking-[0.4em] uppercase text-[#C16542] mb-4">
              {pick(COPY.eyebrow, lang)}
            </span>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-[#2C2621] leading-tight">
              {pick(COPY.title, lang)}
            </h2>
            <p className="mt-4 text-[14px] md:text-[15px] text-[#5C5248] leading-relaxed max-w-2xl">
              {pick(COPY.subtitle, lang)}
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-col gap-3 mb-8 pb-6 border-b border-[#2C2621]/10">
            <ChipGroup icon={Compass} label={pick(COPY.region, lang)}
              options={r} value={region} onChange={setRegion} testidBase="all-trips-filter-region" />
            <ChipGroup icon={Moon}    label={pick(COPY.duration, lang)}
              options={d} value={duration} onChange={setDuration} testidBase="all-trips-filter-duration" />
            <ChipGroup icon={Gauge}   label={pick(COPY.pace, lang)}
              options={p} value={pace} onChange={setPace} testidBase="all-trips-filter-pace" />
          </div>

          {/* Result count */}
          <div
            data-testid="home-all-trips-count"
            className="text-[10px] tracking-[0.3em] uppercase text-[#5C5248] mb-6"
          >
            {filtered.length} · {pick(COPY.count, lang)}
          </div>

          {/* Grid */}
          {filtered.length === 0 ? (
            <div
              data-testid="home-all-trips-empty"
              className="py-12 text-center text-[13px] text-[#5C5248] italic"
            >
              {pick(COPY.noMatch, lang)}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-7">
              {filtered.map((trip) => (
                <TripCard key={trip.routeId} trip={trip} lang={lang} />
              ))}
            </div>
          )}
        </div>
      </section>
    </SlotScope>
  );
};

export default HomeAllTripsCatalog;
