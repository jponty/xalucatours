import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import * as SliderPrimitive from "@radix-ui/react-slider";
import {
  MapPin, Plane, CalendarDays, Clock, ChevronDown, ArrowUpRight, ArrowRight, Compass, Sparkles, Heart, Wallet, RotateCcw, SearchX,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { usePricing } from "@/lib/pricingStore";
import { fmtEuro } from "@/lib/pricing";
import { pathFor } from "@/lib/routes";
import { FromPrice } from "@/components/FromPrice";
import EditableText from "@/components/EditableText";
import SmartPlannerInfoModal from "@/components/SmartPlannerInfoModal";
import TripImageCarousel from "@/components/TripImageCarousel";
import { loadSupabaseImages } from "@/lib/supabaseImages";
import { tripImagesForRoute } from "@/lib/tripImageGallery";
import monogramWhite from "@/assets/monograma-x-white.png";
import monogramBorder from "@/assets/monograma-x-borde.png";
import {
  ORIGIN_OPTIONS, buildMonthOptions, monthName, FLEXIBLE_LABEL, DURATION_BUCKETS,
  topTrips, tt, nodeName, priceBounds,
} from "@/lib/tripFinder";

const T = (es, en, fr) => ({ es, en, fr });
const UI = {
  eyebrow:  T("Buscador de viajes", "Trip finder", "Recherche de voyages"),
  title:    T("Encuentra tu viaje ideal por Marruecos", "Find your ideal trip to Morocco", "Trouvez votre voyage idéal au Maroc"),
  subtitle: T(
    "Cuéntanos desde dónde viajas, cuándo y cuántos días — te mostramos al instante los itinerarios que mejor encajan.",
    "Tell us where you fly from, when and for how long — we instantly surface the itineraries that fit best.",
    "Dites-nous d'où vous partez, quand et combien de jours — nous affichons aussitôt les itinéraires les plus adaptés.",
  ),
  origin:   T("Ciudad de origen", "Origin city", "Ville de départ"),
  otherCity: T("Escribe tu ciudad", "Type your city", "Saisissez votre ville"),
  destination: T("Destino", "Destination", "Destination"),
  morocco:  T("Marruecos", "Morocco", "Maroc"),
  date:     T("Fecha del viaje", "Travel date", "Date du voyage"),
  duration: T("Duración aproximada", "Approx. duration", "Durée approximative"),
  anyDuration: T("Cualquier duración", "Any duration", "Toute durée"),
  results:  T("viajes recomendados", "recommended trips", "voyages recommandés"),
  result:   T("viaje recomendado", "recommended trip", "voyage recommandé"),
  viewTrip: T("Ver viaje", "View trip", "Voir le voyage"),
  fav: T("Guardar en favoritos", "Save to favourites", "Enregistrer dans mes favoris"),
  favRemove: T("Quitar de favoritos", "Remove from favourites", "Retirer des favoris"),
  nights:   T("noches", "nights", "nuits"),
  days:     T("días", "days", "jours"),
  reasonSeason:   T("Ideal en", "Great in", "Idéal en"),
  reasonDuration: T("Duración ideal", "Perfect length", "Durée idéale"),
  reasonOrigin:   T("Recomendado", "Recommended", "Recommandé"),
  plannerLead: T(
    "¿Prefieres que lo diseñemos contigo, día a día?",
    "Prefer us to design it with you, day by day?",
    "Vous préférez qu'on le conçoive avec vous, jour par jour ?",
  ),
  plannerCta: T("Planificador inteligente", "Smart planner", "Planificateur intelligent"),
  allTrips: T("Ver todos los viajes", "View all trips", "Voir tous les voyages"),
  priceRange: T("Rango de precio · por persona", "Price range · per person", "Fourchette de prix · par personne"),
  resetRange: T("Restablecer", "Reset", "Réinitialiser"),
  emptyTitle: T("Ningún viaje en este rango", "No trips in this range", "Aucun voyage dans cette fourchette"),
  emptyBody: T(
    "Prueba a ampliar el rango de precio o ajusta los demás filtros.",
    "Try widening the price range or adjusting the other filters.",
    "Essayez d'élargir la fourchette de prix ou d'ajuster les autres filtres.",
  ),
  emptyReset: T("Restablecer rango completo", "Reset full range", "Réinitialiser toute la fourchette"),
};

const FieldLabel = ({ Icon, children }) => (
  <span className="flex items-center gap-2 text-[10px] tracking-[0.28em] uppercase text-[#8A7C64] mb-2">
    <Icon className="w-3.5 h-3.5" strokeWidth={1.7} />
    {children}
  </span>
);

const selectClass =
  "w-full appearance-none bg-[#FDFBF7] border border-[#2C2621]/15 text-[#2C2621] text-sm md:text-[15px] pl-4 pr-10 py-3.5 leading-tight focus:outline-none focus:border-[#C16542] hover:border-[#2C2621]/30 transition-colors cursor-pointer rounded-none";

const Field = ({ children }) => <div className="flex flex-col">{children}</div>;

const SelectShell = ({ children, ...rest }) => (
  <div className="relative">
    <select className={selectClass} {...rest}>
      {children}
    </select>
    <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9C8E78]" strokeWidth={1.8} />
  </div>
);

const PriceRangeSlider = ({ min, max, step, value, onValueChange }) => (
  <SliderPrimitive.Root
    className="relative flex w-full touch-none select-none items-center h-6"
    min={min}
    max={max}
    step={step}
    value={value}
    onValueChange={onValueChange}
    minStepsBetweenThumbs={1}
    data-testid="trip-finder-price-slider"
    aria-label="price range"
  >
    <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-[#2C2621]/15">
      <SliderPrimitive.Range className="absolute h-full bg-[#C16542]" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb
      data-testid="trip-finder-price-thumb-min"
      className="block h-5 w-5 rounded-full border-2 border-[#C16542] bg-[#FDFBF7] shadow-md transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#C16542]/40 cursor-grab active:cursor-grabbing"
    />
    <SliderPrimitive.Thumb
      data-testid="trip-finder-price-thumb-max"
      className="block h-5 w-5 rounded-full border-2 border-[#C16542] bg-[#FDFBF7] shadow-md transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#C16542]/40 cursor-grab active:cursor-grabbing"
    />
  </SliderPrimitive.Root>
);

export const TripFinder = () => {
  const { lang } = useLanguage();
  const { isFavorite, toggleFavorite } = useFavorites();
  const pricing = usePricing();
  const L = (o) => tt(o, lang);
  const monthOptions = useMemo(() => buildMonthOptions(lang), [lang]);

  const [originId, setOriginId] = useState("bcn");
  const [customCity, setCustomCity] = useState("");
  const [monthValue, setMonthValue] = useState("flexible");
  const [durationId, setDurationId] = useState("");
  const [plannerInfoOpen, setPlannerInfoOpen] = useState(false);
  const [imageManifest, setImageManifest] = useState(null);

  useEffect(() => {
    let active = true;
    loadSupabaseImages()
      .then((manifest) => { if (active) setImageManifest(manifest); })
      .catch(() => { if (active) setImageManifest({ slots: [], galleries: [] }); });
    return () => { active = false; };
  }, []);

  // Real catalogue price bounds — recomputed whenever pricing changes.
  const bounds = useMemo(() => priceBounds(pricing), [pricing]);
  // Current commercial tariffs are configured in €5 increments. Keep those
  // exact values reachable instead of snapping them to artificial tens.
  const step = useMemo(() => (bounds.max - bounds.min > 2000 ? 25 : 5), [bounds]);
  // `range === null` means "full range" (auto-follows bounds); an array means
  // the user has narrowed it. Clamp to the current bounds defensively.
  const [range, setRange] = useState(null);
  const value = useMemo(() => {
    if (!range) return [bounds.min, bounds.max];
    return [Math.max(bounds.min, range[0]), Math.min(bounds.max, range[1])];
  }, [range, bounds]);
  const [pmin, pmax] = value;
  const isFiltered = range !== null && (pmin > bounds.min || pmax < bounds.max);

  const ranked = useMemo(
    () => topTrips({ originId, monthValue, durationId, priceMin: pmin, priceMax: pmax, pricing }, 6),
    [originId, monthValue, durationId, pmin, pmax, pricing],
  );
  const rankedWithImages = useMemo(
    () => ranked.map((result) => ({
      ...result,
      // Home result cards keep a compact carousel, but always reserve at
      // least one real image for every day of the recommended itinerary.
      images: tripImagesForRoute(result.trip.routeId, imageManifest, {
        representEveryDay: true,
        maxImages: 12,
      }),
    })),
    [ranked, imageManifest],
  );

  const chipFor = (reasons) => {
    if (reasons.includes("season") && monthValue !== "flexible") {
      return `${L(UI.reasonSeason)} ${monthName(monthValue, lang).toLowerCase()}`;
    }
    if (reasons.includes("duration")) return L(UI.reasonDuration);
    if (reasons.includes("origin")) return L(UI.reasonOrigin);
    return null;
  };

  return (
    <section
      data-testid="trip-finder"
      className="relative bg-[#F8F2E6] overflow-hidden"
    >
      <div className="absolute inset-0 berber-bg-cross opacity-[0.06] pointer-events-none" aria-hidden="true" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#D4A373]/50 to-transparent" aria-hidden="true" />

      <div className="relative max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24">
        {/* Header */}
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-3 text-[#C16542]">
            <Compass className="w-4 h-4" strokeWidth={1.7} />
            <EditableText
              slot="home.finder.eyebrow"
              defaults={UI.eyebrow}
              multiline={false}
              className="text-[11px] tracking-[0.35em] uppercase font-semibold"
            />
          </span>
          <EditableText
            as="h2"
            slot="home.finder.title"
            defaults={UI.title}
            multiline={false}
            className="font-serif-x text-[#2C2621] text-4xl md:text-5xl leading-[1.05] tracking-tight mt-5"
          />
          <EditableText
            as="p"
            slot="home.finder.subtitle"
            defaults={UI.subtitle}
            className="mt-5 text-base text-[#5C5248] leading-relaxed"
          />
        </div>

        {/* Search controls */}
        <div
          data-testid="trip-finder-controls"
          className="mt-9 bg-[#FDFBF7]/80 backdrop-blur-sm border border-[#2C2621]/10 p-5 md:p-7 shadow-[0_30px_60px_-34px_rgba(26,21,19,0.45)]"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            {/* Origin */}
            <Field>
              <FieldLabel Icon={Plane}>{L(UI.origin)}</FieldLabel>
              <SelectShell
                data-testid="trip-finder-origin"
                value={originId}
                onChange={(e) => setOriginId(e.target.value)}
                aria-label={L(UI.origin)}
              >
                {ORIGIN_OPTIONS.map((o) => (
                  <option key={o.id} value={o.id}>{L(o.name)}</option>
                ))}
              </SelectShell>
              {originId === "otra" && (
                <input
                  type="text"
                  data-testid="trip-finder-custom-city"
                  value={customCity}
                  onChange={(e) => setCustomCity(e.target.value)}
                  placeholder={L(UI.otherCity)}
                  className="mt-3 w-full bg-[#FDFBF7] border border-[#2C2621]/15 text-[#2C2621] text-sm md:text-[15px] px-4 py-3.5 focus:outline-none focus:border-[#C16542] transition-colors rounded-none"
                />
              )}
            </Field>

            {/* Destination (fixed) */}
            <Field>
              <FieldLabel Icon={MapPin}>{L(UI.destination)}</FieldLabel>
              <div
                data-testid="trip-finder-destino"
                className="w-full bg-[#F2EBE1] border border-[#2C2621]/15 text-[#2C2621] text-sm md:text-[15px] px-4 py-3.5 flex items-center gap-2"
              >
                <MapPin className="w-4 h-4 text-[#C16542]" strokeWidth={1.8} />
                <span className="font-medium">{L(UI.morocco)}</span>
              </div>
            </Field>

            {/* Travel date */}
            <Field>
              <FieldLabel Icon={CalendarDays}>{L(UI.date)}</FieldLabel>
              <SelectShell
                data-testid="trip-finder-month"
                value={monthValue}
                onChange={(e) => setMonthValue(e.target.value)}
                aria-label={L(UI.date)}
              >
                <option value="flexible">{L(FLEXIBLE_LABEL)}</option>
                {monthOptions.map((m) => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </SelectShell>
            </Field>

            {/* Duration */}
            <Field>
              <FieldLabel Icon={Clock}>{L(UI.duration)}</FieldLabel>
              <SelectShell
                data-testid="trip-finder-duration"
                value={durationId}
                onChange={(e) => setDurationId(e.target.value)}
                aria-label={L(UI.duration)}
              >
                <option value="">{L(UI.anyDuration)}</option>
                {DURATION_BUCKETS.map((b) => (
                  <option key={b.id} value={b.id}>{L(b.label)}</option>
                ))}
              </SelectShell>
            </Field>
          </div>

          {/* Price range — real catalogue bounds, no hardcoded categories */}
          <div className="mt-6 pt-6 border-t border-[#2C2621]/10">
            <div className="flex items-center justify-between gap-3 mb-3">
              <FieldLabel Icon={Wallet}>{L(UI.priceRange)}</FieldLabel>
              {isFiltered && (
                <button
                  type="button"
                  data-testid="trip-finder-price-reset"
                  onClick={() => setRange(null)}
                  className="inline-flex items-center gap-1.5 text-[10px] tracking-[0.22em] uppercase text-[#C16542] hover:text-[#2C2621] transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" strokeWidth={1.8} />
                  {L(UI.resetRange)}
                </button>
              )}
            </div>
            <div className="flex items-center gap-4 md:gap-6">
              <span
                data-testid="trip-finder-price-min"
                className="shrink-0 min-w-[64px] text-sm md:text-[15px] font-medium text-[#2C2621] tabular-nums"
              >
                {fmtEuro(pmin)}
              </span>
              <PriceRangeSlider
                min={bounds.min}
                max={bounds.max}
                step={step}
                value={value}
                onValueChange={(v) => setRange(v)}
              />
              <span
                data-testid="trip-finder-price-max"
                className="shrink-0 min-w-[64px] text-right text-sm md:text-[15px] font-medium text-[#2C2621] tabular-nums"
              >
                {fmtEuro(pmax)}
              </span>
            </div>
          </div>
        </div>

        {/* Results count */}
        <p
          data-testid="trip-finder-count"
          className="mt-8 mb-5 inline-flex items-center gap-2 text-[11px] tracking-[0.28em] uppercase text-[#8A7C64]"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#C16542]" strokeWidth={1.7} />
          {ranked.length} {L(ranked.length === 1 ? UI.result : UI.results)}
        </p>

        {/* Results grid */}
        <div
          data-testid="trip-finder-results"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {rankedWithImages.map(({ trip, reasons, images }) => {
            const chip = chipFor(reasons);
            const nights = trip.days - 1;
            const fav = isFavorite(trip.routeId);
            return (
              <Link
                key={trip.routeId}
                to={pathFor(lang, trip.routeId)}
                data-testid={`trip-finder-card-${trip.routeId}`}
                className="group block bg-[#FDFBF7] border border-[#2C2621]/10 overflow-hidden hover:border-[#C16542]/40 hover:shadow-[0_28px_54px_-30px_rgba(26,21,19,0.5)] transition-all duration-300"
              >
                <TripImageCarousel
                  images={images}
                  title={tt(trip.name, lang)}
                  lang={lang}
                  className="aspect-[4/3] bg-[#1A1513]"
                  imageClassName="transition-transform duration-[900ms] group-hover:scale-105"
                  priorityFirst
                  showBadge={false}
                  showCount={false}
                  testidPrefix={`trip-finder-carousel-${trip.routeId}`}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A1513]/70 via-transparent to-transparent pointer-events-none" />
                  <img
                    src={monogramBorder}
                    alt=""
                    aria-hidden="true"
                    data-testid={`trip-finder-monogram-${trip.routeId}`}
                    className="pointer-events-none absolute bottom-0 right-0 z-[2] h-[118%] w-auto max-w-none select-none object-contain opacity-[0.22] drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)]"
                  />
                  {chip && (
                    <span className="absolute top-3 left-3 z-[4] inline-flex items-center gap-1.5 bg-[#C16542] text-[#FDFBF7] px-2.5 py-1.5 text-[9px] tracking-[0.2em] uppercase shadow-md">
                      <Sparkles className="w-3 h-3" strokeWidth={1.9} />{chip}
                    </span>
                  )}
                  {/* Save to favourites — toggles without navigating */}
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleFavorite(trip.routeId); }}
                    data-testid={`trip-finder-fav-${trip.routeId}`}
                    aria-pressed={fav}
                    aria-label={L(fav ? UI.favRemove : UI.fav)}
                    title={L(fav ? UI.favRemove : UI.fav)}
                    className={`absolute top-3 right-3 z-10 inline-flex items-center justify-center w-9 h-9 rounded-full backdrop-blur shadow-md transition-colors ${
                      fav ? "bg-[#C16542] text-[#FDFBF7]" : "bg-[#FDFBF7]/90 text-[#C16542] hover:bg-[#C16542] hover:text-[#FDFBF7]"
                    }`}
                  >
                    <Heart className="w-4 h-4 transition-transform active:scale-90" strokeWidth={1.7} fill={fav ? "currentColor" : "none"} />
                  </button>
                  <span className="absolute bottom-3 right-3 z-[4] bg-[#1A1513]/80 backdrop-blur-sm text-[#FDFBF7] px-2.5 py-1 text-[10px] tracking-[0.18em] uppercase tabular-nums">
                    {nights} {L(UI.nights)} · {trip.days} {L(UI.days)}
                  </span>
                  <span className="absolute bottom-3 left-3 z-[4] w-9 h-9 rounded-full bg-[#1A1513]/45 backdrop-blur-sm ring-1 ring-[#FDFBF7]/25 flex items-center justify-center shadow-md">
                    <img src={monogramWhite} alt="Xaluca Tours" className="w-5 h-5 object-contain" loading="lazy" />
                  </span>
                </TripImageCarousel>
                <div className="p-5">
                  <h3 className="font-serif-x text-[#2C2621] text-xl leading-snug group-hover:text-[#C16542] transition-colors">
                    {tt(trip.name, lang)}
                  </h3>
                  <p className="mt-2 inline-flex items-center gap-1.5 text-[12px] text-[#8A7C64] tracking-wide">
                    {nodeName(trip.entry, lang)}
                    <ArrowRight className="w-3 h-3" strokeWidth={1.8} />
                    {nodeName(trip.exit, lang)}
                  </p>
                  <div className="mt-4 pt-4 border-t border-[#2C2621]/10 flex items-center justify-between gap-3">
                    <FromPrice tone="dark" layout="stacked" routeId={trip.routeId} testid={`trip-finder-price-${trip.routeId}`} />
                    <span className="inline-flex items-center gap-1.5 text-[11px] tracking-[0.2em] uppercase text-[#2C2621] group-hover:text-[#C16542] transition-colors">
                      {L(UI.viewTrip)}
                      <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={1.8} />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Empty state — shown when no trips fall in the current filters/range */}
        {ranked.length === 0 && (
          <div
            data-testid="trip-finder-empty"
            className="bg-[#FDFBF7] border border-dashed border-[#2C2621]/20 px-6 py-14 text-center"
          >
            <span className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#F2EBE1] text-[#C16542] mb-5">
              <SearchX className="w-6 h-6" strokeWidth={1.6} />
            </span>
            <h3 className="font-serif-x text-2xl text-[#2C2621]">{L(UI.emptyTitle)}</h3>
            <p className="mt-3 text-sm text-[#5C5248] max-w-md mx-auto leading-relaxed">{L(UI.emptyBody)}</p>
            <button
              type="button"
              data-testid="trip-finder-empty-reset"
              onClick={() => setRange(null)}
              className="mt-6 inline-flex items-center gap-2 bg-[#2C2621] hover:bg-[#C16542] text-[#FDFBF7] px-6 py-3.5 text-[11px] tracking-[0.22em] uppercase transition-colors"
            >
              <RotateCcw className="w-4 h-4" strokeWidth={1.8} />
              {L(UI.emptyReset)}
            </button>
          </div>
        )}
        {/* Footer CTAs */}
        <div className="mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-5 justify-between border-t border-[#2C2621]/10 pt-8">
          <p className="text-sm text-[#5C5248]">{L(UI.plannerLead)}</p>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
            <Link
              to={pathFor(lang, "toursLanding")}
              data-testid="trip-finder-all-trips-cta"
              className="inline-flex items-center justify-center gap-2.5 border border-[#2C2621]/25 hover:border-[#C16542] text-[#2C2621] hover:text-[#C16542] px-6 py-3.5 text-[11px] tracking-[0.22em] uppercase transition-colors whitespace-nowrap"
            >
              {L(UI.allTrips)}
              <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.7} />
            </Link>
            <button
              type="button"
              onClick={() => setPlannerInfoOpen(true)}
              data-testid="trip-finder-planner-cta"
              aria-haspopup="dialog"
              className="inline-flex items-center justify-center gap-2.5 bg-[#2C2621] hover:bg-[#C16542] text-[#FDFBF7] px-6 py-3.5 text-[11px] tracking-[0.22em] uppercase transition-colors whitespace-nowrap"
            >
              <Compass className="w-4 h-4" strokeWidth={1.7} />
              {L(UI.plannerCta)}
              <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.7} />
            </button>
          </div>
        </div>
      </div>
      <SmartPlannerInfoModal open={plannerInfoOpen} onOpenChange={setPlannerInfoOpen} />
    </section>
  );
};

export default TripFinder;
