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
import { ArrowUpRight, Moon, Compass, Gauge, Search, X, ChevronDown, ChevronUp, Headset } from "lucide-react";
import { useLanguage, pick } from "@/contexts/LanguageContext";
import EditableImage from "@/components/EditableImage";
import XalucaLogoBadge from "@/components/XalucaLogoBadge";
import CardHighlightsMarquee from "@/components/CardHighlightsMarquee";
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

const ASSISTANT_LABEL = { es: "Asistente Virtual", en: "Virtual Assistant", fr: "Assistant Virtuel" };

// Open the Chatbase virtual assistant without leaving the page.
const openChatbaseAssistant = (e) => {
  e.preventDefault();
  e.stopPropagation();
  if (window.chatbase && typeof window.chatbase.open === "function") {
    window.chatbase.open();
  } else {
    window.open("https://www.chatbase.co/0g0xD-K8_amm7Ihz-vPj2/help", "_blank", "noopener,noreferrer");
  }
};

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
  searchTitle: { es: "¿Dónde quieres viajar?",
                 en: "Where do you want to travel?",
                 fr: "Où voulez-vous voyager ?" },
  searchPlaceholder: {
    es: "Escribe un destino, ciudad o experiencia · Marrakech, Fez, Merzouga, Desierto, Atlas, Chefchaouen…",
    en: "Type a destination, city or experience · Marrakech, Fez, Merzouga, Desert, Atlas, Chefchaouen…",
    fr: "Saisissez une destination, ville ou expérience · Marrakech, Fès, Merzouga, Désert, Atlas, Chefchaouen…",
  },
  clear: { es: "Borrar", en: "Clear", fr: "Effacer" },
  viewAll: { es: "Ver todos los viajes", en: "View all trips", fr: "Voir tous les voyages" },
  viewLess: { es: "Ver menos", en: "Show less", fr: "Voir moins" },
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

/* ---------- Free-text search index ----------
   Builds an accent-insensitive haystack per trip from ALL of its content
   (route id, title, summary in 3 languages, region & pace labels) plus a
   set of destination keywords per region, so a search for any city, region,
   experience or point of interest surfaces the related itineraries — not
   just title matches. */
const normalize = (s) =>
  (s || "")
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[·→↔]/g, " ");

// Destination / POI keywords associated with each marketing region. These let
// searches like "Merzouga", "Sahara", "ciudad azul" or "Volubilis" match the
// right trips even when the short summary doesn't spell them out.
const REGION_KEYWORDS = {
  sur: "sur desierto sahara merzouga erg chebbi dunas duna atlas alto atlas tizi n tichka kasbah ouarzazate ait benhaddou skoura dades todra gargantas valle del draa zagora rosas nomadas bereber",
  norte: "norte ciudades imperiales fez fes meknes mequinez rabat sale chefchaouen chaouen ciudad azul rif tetuan asilah volubilis moulay idriss tanger tetuan medina",
  completo: "marruecos integral completo norte sur desierto fez marrakech tanger sahara atlas ciudades imperiales",
  escapadas: "escapada corta escapadas fin de semana express marrakech fez agafay atlas desierto",
  aventura: "aventura moto enduro motos 4x4 off road pistas draa sahara desierto",
  eventos: "eventos fin de ano nochevieja celebracion fiesta desierto campamento estrellas",
};

const splitRouteId = (id) =>
  (id || "")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/([A-Za-z])(\d)/g, "$1 $2");

const tripHaystacks = new Map();
const haystackFor = (trip) => {
  if (tripHaystacks.has(trip.routeId)) return tripHaystacks.get(trip.routeId);
  const parts = [
    splitRouteId(trip.routeId),
    trip.title?.es, trip.title?.en, trip.title?.fr,
    trip.summary?.es, trip.summary?.en, trip.summary?.fr,
    REGION_LABEL[trip.region]?.es, REGION_LABEL[trip.region]?.en, REGION_LABEL[trip.region]?.fr,
    PACE_LABEL[trip.pace]?.es, PACE_LABEL[trip.pace]?.en, PACE_LABEL[trip.pace]?.fr,
    REGION_KEYWORDS[trip.region],
  ];
  const hay = normalize(parts.filter(Boolean).join(" "));
  tripHaystacks.set(trip.routeId, hay);
  return hay;
};

const matchesQuery = (trip, query) => {
  const tokens = normalize(query).split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return true;
  const hay = haystackFor(trip);
  return tokens.every((tok) => hay.includes(tok));
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
          {/* Xaluca logo — anchored to the bottom-left edge of the image */}
          <XalucaLogoBadge className="bottom-3 left-3 w-11 h-11" testid={`home-all-trips-logo-${trip.routeId}`} />
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
            <FromPrice tone="dark" size="md" routeId={trip.routeId} testid={`home-all-trips-from-${trip.routeId}`} />
          </div>
          <div className="mt-5 pt-4 border-t border-[#2C2621]/10 flex items-center justify-between gap-3">
            <span className="inline-flex items-center gap-2 text-[10px] tracking-[0.28em] uppercase text-[#2C2621] group-hover:text-[#C16542] transition-colors">
              {pick(COPY.details, lang)}
              <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={1.8} />
            </span>
            <button
              type="button"
              onClick={openChatbaseAssistant}
              data-testid={`home-all-trips-assistant-${trip.routeId}`}
              aria-label={pick(ASSISTANT_LABEL, lang)}
              title={pick(ASSISTANT_LABEL, lang)}
              className="shrink-0 inline-flex items-center justify-center w-9 h-9 border border-[#2C2621]/20 text-[#2C2621] hover:bg-[#2C2621] hover:text-[#FDFBF7] hover:border-[#2C2621] transition-colors duration-300"
            >
              <Headset className="w-4 h-4" strokeWidth={1.7} />
            </button>
          </div>
        </div>
        {/* Highlights ticker — mirrors the trip page "Lugares destacados" */}
        <CardHighlightsMarquee routeId={trip.routeId} testid={`home-all-trips-highlights-${trip.routeId}`} />
      </Link>
    </SlotScope>
  );
};

/* ---------- Section ---------- */
const HomeAllTripsCatalog = ({ initialLimit = null }) => {
  const { lang } = useLanguage();
  const [query, setQuery]       = useState("");
  const [region, setRegion]     = useState("all");
  const [duration, setDuration] = useState("any");
  const [pace, setPace]         = useState("any");
  const [showAll, setShowAll]   = useState(false);

  const filtered = useMemo(() => {
    return ALL_TRIPS.filter((t) => {
      if (region !== "all" && t.region !== region) return false;
      if (duration !== "any" && t.durationBucket !== duration) return false;
      if (pace !== "any" && t.pace !== pace) return false;
      if (!matchesQuery(t, query)) return false;
      return true;
    });
  }, [region, duration, pace, query]);

  // When a search or filter is active, always show every match (even beyond the
  // initial selection). Otherwise, on pages that pass `initialLimit`, show only
  // the first N until the user expands with "Ver todos los viajes".
  const hasActiveFilter =
    query.trim() !== "" || region !== "all" || duration !== "any" || pace !== "any";
  const isCollapsed =
    initialLimit != null && !showAll && !hasActiveFilter && filtered.length > initialLimit;
  const visible = isCollapsed ? filtered.slice(0, initialLimit) : filtered;

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

          {/* Search by destination */}
          <div className="mb-8" data-testid="all-trips-search">
            <label
              htmlFor="all-trips-search-input"
              className="block font-serif text-2xl md:text-3xl text-[#2C2621] mb-4"
            >
              {pick(COPY.searchTitle, lang)}
            </label>
            <div className="relative max-w-3xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#C16542]" strokeWidth={1.7} />
              <input
                id="all-trips-search-input"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={pick(COPY.searchPlaceholder, lang)}
                data-testid="all-trips-search-input"
                className="w-full bg-[#FFFFFF] border border-[#2C2621]/20 focus:border-[#C16542] pl-12 pr-11 py-4 text-[15px] text-[#2C2621] placeholder-[#5C5248]/60 outline-none transition-colors"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  data-testid="all-trips-search-clear"
                  aria-label={pick(COPY.clear, lang)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5C5248] hover:text-[#C16542] transition-colors"
                >
                  <X className="w-5 h-5" strokeWidth={1.8} />
                </button>
              )}
            </div>
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
              {visible.map((trip) => (
                <TripCard key={trip.routeId} trip={trip} lang={lang} />
              ))}
            </div>
          )}

          {/* Expand / collapse control (only when an initial limit applies) */}
          {initialLimit != null && !hasActiveFilter && filtered.length > initialLimit && (
            <div className="mt-10 flex justify-center">
              <button
                type="button"
                onClick={() => setShowAll((v) => !v)}
                data-testid="all-trips-view-all"
                className="inline-flex items-center gap-3 border border-[#2C2621]/30 hover:border-[#C16542] hover:text-[#C16542] text-[#2C2621] px-8 py-4 text-[11px] tracking-[0.25em] uppercase transition-colors"
              >
                {showAll
                  ? pick(COPY.viewLess, lang)
                  : `${pick(COPY.viewAll, lang)} · ${filtered.length}`}
                {showAll
                  ? <ChevronUp className="w-4 h-4" strokeWidth={1.7} />
                  : <ChevronDown className="w-4 h-4" strokeWidth={1.7} />}
              </button>
            </div>
          )}
        </div>
      </section>
    </SlotScope>
  );
};

export default HomeAllTripsCatalog;
