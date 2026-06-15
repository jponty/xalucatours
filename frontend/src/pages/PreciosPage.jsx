import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Check, ArrowRight, ShieldCheck, Sparkles, Search, X, ChevronDown } from "lucide-react";
import { useLanguage, pick } from "@/contexts/LanguageContext";
import { pathFor } from "@/lib/routes";
import { usePricing } from "@/lib/pricingStore";
import { getProgramTiers } from "@/lib/programPricing";
import { getFromPrice, fmtEuro, DEFAULT_PRICING } from "@/lib/pricing";
import { getTripDescription } from "@/lib/tripDescriptions";
import EditableText from "@/components/EditableText";
import { PRICING_PACKAGES } from "@/lib/preciosData";
import { ALL_TRIPS, TRIP_REGIONS, TRIP_PACES, TRIP_DURATIONS } from "@/lib/allTripsCatalog";

const L = DEFAULT_PRICING.labels;
const SEASONS = DEFAULT_PRICING.seasons;

/* A single trip row: name (links to its itinerary), meta tags, "from"
   price and a compact per-person price matrix by group size. */
const TripPriceCard = ({ trip, lang, pricing }) => {
  const [open, setOpen] = useState(true);
  const prog = getProgramTiers(trip.routeId);
  const tiers = prog || pricing.tiers || DEFAULT_PRICING.tiers;
  // "From" = lowest price across the SAME tiers shown in the table, so the
  // headline price always matches this program's real starting price (and
  // the trip page's <FromPrice>, which uses the identical calculation).
  const from = getFromPrice({ tiers });
  const region = TRIP_REGIONS.find((r) => r.id === trip.region);
  const pace = TRIP_PACES.find((p) => p.id === trip.pace);
  const longDesc = getTripDescription(trip.routeId);

  return (
    <article
      data-testid={`price-trip-${trip.routeId}`}
      className="group flex flex-col bg-white border border-[#2C2621]/12 hover:border-[#D4A373] transition-colors duration-300"
    >
      <div className="p-5 md:p-6 border-b border-[#2C2621]/10">
        <Link
          to={pathFor(lang, trip.routeId)}
          data-testid={`price-trip-link-${trip.routeId}`}
          className="font-serif-x text-xl md:text-2xl leading-tight tracking-tight text-[#1A1513] hover:text-[#C16542] transition-colors inline-flex items-start gap-1.5"
        >
          {pick(trip.title, lang)}
          <ArrowRight className="w-4 h-4 mt-1.5 shrink-0 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-[#C16542]" strokeWidth={1.7} />
        </Link>
        <div className="mt-2.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] tracking-[0.16em] uppercase text-[#A07042]">
          {region && <span>{pick(region.label, lang)}</span>}
          {pace && <><span className="text-[#D4A373]">·</span><span>{pick(pace.label, lang)}</span></>}
          <span className="text-[#D4A373]">·</span>
          <span>{trip.nights} {pick({ es: "noches", en: "nights", fr: "nuits" }, lang)}</span>
        </div>
        {trip.summary && (
          <p
            data-testid={`price-trip-desc-${trip.routeId}`}
            className="mt-3 text-sm text-[#5C5248] leading-relaxed"
          >
            {pick(trip.summary, lang)}
          </p>
        )}
        {longDesc && (
          <div className="mt-3">
            <button
              type="button"
              data-testid={`price-trip-toggle-${trip.routeId}`}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="inline-flex items-center gap-1.5 text-[10px] tracking-[0.18em] uppercase text-[#A07042] hover:text-[#1A1513] transition-colors"
            >
              {open
                ? pick({ es: "Ocultar descripción", en: "Hide description", fr: "Masquer la description" }, lang)
                : pick({ es: "Ver descripción del viaje", en: "View trip description", fr: "Voir la description du voyage" }, lang)}
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
                strokeWidth={1.8}
              />
            </button>
            {open && (
              <p
                data-testid={`price-trip-longdesc-${trip.routeId}`}
                className="mt-2.5 text-sm text-[#5C5248] leading-relaxed border-l-2 border-[#D4A373] pl-3"
              >
                {pick(longDesc, lang)}
              </p>
            )}
          </div>
        )}
        <div className="mt-3 flex items-baseline gap-2" data-testid={`price-trip-from-${trip.routeId}`}>
          <span className="text-[10px] tracking-[0.16em] uppercase text-[#7A6E62]">{pick(L.from, lang)}</span>
          <span className="font-serif-x text-2xl text-[#1A1513] leading-none">{from ? fmtEuro(from) : "—"}</span>
          <span className="text-xs text-[#7A6E62]">/ {pick(L.perPerson, lang)}</span>
        </div>
      </div>

      {/* Per-person matrix by group size */}
      <div className="px-5 md:px-6 py-4 flex-1">
        <table className="w-full text-sm" data-testid={`price-trip-table-${trip.routeId}`}>
          <thead>
            <tr className="text-[10px] tracking-[0.16em] uppercase text-[#A07042]">
              <th className="text-left font-normal pb-2">{pick(L.travellers, lang)}</th>
              <th className="text-right font-normal pb-2">{pick(SEASONS.low.label, lang)}</th>
              <th className="text-right font-normal pb-2">{pick(SEASONS.high.label, lang)}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2C2621]/8">
            {tiers.map((t) => (
              <tr key={t.people} className="text-[#2C2621]">
                <td className="py-2 text-[#5C5248]">
                  {t.people} {pick(L.people, lang)}
                </td>
                <td className="py-2 text-right tabular-nums">{t.low ? fmtEuro(t.low) : "—"}</td>
                <td className="py-2 text-right tabular-nums font-medium">{t.high ? fmtEuro(t.high) : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </article>
  );
};

/* A small pill-style filter group. */
const FilterGroup = ({ label, options, value, onChange, lang, testid }) => (
  <div data-testid={testid}>
    <span className="block text-[10px] tracking-[0.2em] uppercase text-[#A07042] mb-2.5">{label}</span>
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const active = value === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            data-testid={`${testid}-${opt.id}`}
            onClick={() => onChange(opt.id)}
            className={`px-3.5 py-1.5 text-[11px] tracking-[0.12em] uppercase border transition-colors duration-200 ${
              active
                ? "bg-[#1A1513] border-[#1A1513] text-[#FDFBF7]"
                : "bg-transparent border-[#2C2621]/20 text-[#5C5248] hover:border-[#D4A373] hover:text-[#1A1513]"
            }`}
          >
            {pick(opt.label, lang)}
          </button>
        );
      })}
    </div>
  </div>
);

/* Directory section: every trip grouped by marketing region, with
   search + region/duration/pace filters. */
const TripDirectory = ({ lang, pricing }) => {
  const [region, setRegion] = useState("all");
  const [duration, setDuration] = useState("any");
  const [pace, setPace] = useState("any");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ALL_TRIPS.filter((t) => {
      if (region !== "all" && t.region !== region) return false;
      if (duration !== "any" && t.durationBucket !== duration) return false;
      if (pace !== "any" && t.pace !== pace) return false;
      if (q) {
        const title = (pick(t.title, lang) || "").toLowerCase();
        const summary = (pick(t.summary, lang) || "").toLowerCase();
        if (!title.includes(q) && !summary.includes(q)) return false;
      }
      return true;
    });
  }, [region, duration, pace, query, lang]);

  const groups = useMemo(
    () =>
      TRIP_REGIONS.filter((r) => r.id !== "all")
        .map((reg) => ({ region: reg, trips: filtered.filter((t) => t.region === reg.id) }))
        .filter((g) => g.trips.length > 0),
    [filtered]
  );

  const hasFilters = region !== "all" || duration !== "any" || pace !== "any" || query.trim() !== "";
  const clearAll = () => { setRegion("all"); setDuration("any"); setPace("any"); setQuery(""); };

  return (
    <section className="max-w-7xl mx-auto px-6 md:px-12 py-12 md:py-16" data-testid="precios-directory">
      <div className="max-w-3xl">
        <span className="inline-flex items-center gap-3 text-[11px] tracking-[0.35em] uppercase text-[#A07042]">
          <span className="w-8 h-px bg-[#D4A373]" />
          <EditableText slot="precios.directory.eyebrow" defaults={{ es: "Tarifas detalladas", en: "Detailed rates", fr: "Tarifs détaillés" }} multiline={false} />
        </span>
        <EditableText
          as="h2"
          slot="precios.directory.title"
          defaults={{ es: "Todos nuestros viajes y sus precios", en: "All our trips and their prices", fr: "Tous nos voyages et leurs tarifs" }}
          multiline={false}
          className="font-serif-x text-3xl md:text-4xl lg:text-5xl leading-[1.06] tracking-tight text-[#1A1513] mt-5 block"
        />
        <EditableText
          as="p"
          slot="precios.directory.subtitle"
          defaults={{
            es: "Precio por persona según el número de viajeros y la temporada. Filtra por zona, duración o ritmo, y pulsa cualquier viaje para ver su itinerario completo.",
            en: "Price per person based on group size and season. Filter by area, duration or pace, and click any trip to see its full itinerary.",
            fr: "Prix par personne selon le nombre de voyageurs et la saison. Filtrez par zone, durée ou intensité, et cliquez sur un voyage pour voir l'itinéraire complet.",
          }}
          className="mt-5 text-base md:text-lg text-[#5C5248] leading-relaxed block"
        />
      </div>

      {/* Search + filters */}
      <div className="mt-10 bg-white border border-[#2C2621]/12 p-6 md:p-8" data-testid="precios-filters">
        <div className="relative max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A07042]" strokeWidth={1.7} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            data-testid="precios-search-input"
            placeholder={pick({ es: "Buscar viaje, ciudad, región…", en: "Search trip, city, region…", fr: "Rechercher un voyage, une ville…" }, lang)}
            className="w-full bg-[#FDFBF7] border border-[#2C2621]/15 focus:border-[#D4A373] outline-none pl-10 pr-4 py-3 text-sm text-[#1A1513] placeholder:text-[#A0968A] transition-colors"
          />
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-3">
          <FilterGroup label={pick({ es: "Zona", en: "Area", fr: "Zone" }, lang)} options={TRIP_REGIONS} value={region} onChange={setRegion} lang={lang} testid="precios-filter-region" />
          <FilterGroup label={pick({ es: "Duración", en: "Duration", fr: "Durée" }, lang)} options={TRIP_DURATIONS} value={duration} onChange={setDuration} lang={lang} testid="precios-filter-duration" />
          <FilterGroup label={pick({ es: "Ritmo", en: "Pace", fr: "Intensité" }, lang)} options={TRIP_PACES} value={pace} onChange={setPace} lang={lang} testid="precios-filter-pace" />
        </div>

        <div className="mt-6 flex items-center justify-between gap-4 border-t border-[#2C2621]/10 pt-5">
          <span className="text-xs text-[#7A6E62]" data-testid="precios-results-count">
            {filtered.length} {pick({ es: "viajes encontrados", en: "trips found", fr: "voyages trouvés" }, lang)}
          </span>
          {hasFilters && (
            <button
              type="button"
              onClick={clearAll}
              data-testid="precios-clear-filters"
              className="inline-flex items-center gap-1.5 text-[11px] tracking-[0.12em] uppercase text-[#C16542] hover:text-[#A35133] transition-colors"
            >
              <X className="w-3.5 h-3.5" strokeWidth={2} />
              {pick({ es: "Limpiar filtros", en: "Clear filters", fr: "Effacer les filtres" }, lang)}
            </button>
          )}
        </div>
      </div>

      {groups.length === 0 ? (
        <div className="mt-12 text-center py-16 border border-dashed border-[#2C2621]/20" data-testid="precios-no-results">
          <p className="font-serif-x text-2xl text-[#1A1513]">
            {pick({ es: "Ningún viaje coincide con tu búsqueda", en: "No trips match your search", fr: "Aucun voyage ne correspond" }, lang)}
          </p>
          <button type="button" onClick={clearAll} className="mt-4 text-[11px] tracking-[0.14em] uppercase text-[#C16542] hover:text-[#A35133] transition-colors">
            {pick({ es: "Ver todos los viajes", en: "See all trips", fr: "Voir tous les voyages" }, lang)}
          </button>
        </div>
      ) : (
        <div className="mt-12 space-y-14">
          {groups.map(({ region: reg, trips }) => (
            <div key={reg.id} data-testid={`precios-group-${reg.id}`}>
              <div className="flex items-center gap-4 mb-6">
                <h3 className="font-serif-x text-2xl md:text-3xl tracking-tight text-[#1A1513]">
                  {pick(reg.label, lang)}
                </h3>
                <span className="flex-1 h-px bg-gradient-to-r from-[#D4A373]/50 to-transparent" />
                <span className="text-[11px] tracking-[0.2em] uppercase text-[#A07042]">
                  {trips.length} {pick({ es: "viajes", en: "trips", fr: "voyages" }, lang)}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {trips.map((trip) => (
                  <TripPriceCard key={trip.routeId} trip={trip} lang={lang} pricing={pricing} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="mt-12 text-xs text-[#7A6E62] leading-relaxed max-w-3xl">
        {pick(DEFAULT_PRICING.note, lang)}
      </p>
    </section>
  );
};

const PackageCard = ({ pkg, price, lang }) => {
  const slug = pkg.slug;
  return (
    <article
      data-testid={`pricing-card-${slug}`}
      className={`relative flex flex-col bg-white border transition-all duration-300 ${
        pkg.recommended
          ? "border-[#C16542] shadow-[0_30px_70px_-30px_rgba(193,101,66,0.45)]"
          : "border-[#2C2621]/12 hover:border-[#D4A373] hover:shadow-[0_24px_60px_-32px_rgba(44,38,33,0.4)]"
      }`}
    >
      {pkg.recommended && (
        <div
          data-testid={`pricing-badge-${slug}`}
          className="absolute -top-px right-6 -translate-y-1/2 inline-flex items-center gap-1.5 bg-[#C16542] text-[#FDFBF7] px-3.5 py-1.5 text-[10px] tracking-[0.22em] uppercase"
        >
          <Sparkles className="w-3 h-3" strokeWidth={2} />
          <EditableText slot="precios.badge_recommended" defaults={{ es: "Experiencia Xaluca", en: "Xaluca experience", fr: "Expérience Xaluca" }} multiline={false} />
        </div>
      )}

      <div className="p-7 md:p-9">
        <span className="font-serif-x text-2xl text-[#D4A373]">{pkg.number}</span>
        <EditableText
          as="h2"
          slot={`precios.pkg.${slug}.title`}
          defaults={pkg.title}
          multiline={false}
          className="font-serif-x text-2xl md:text-3xl leading-tight tracking-tight text-[#1A1513] mt-2 block"
        />
        <EditableText
          as="p"
          slot={`precios.pkg.${slug}.meta`}
          defaults={pkg.meta}
          multiline={false}
          className="mt-2 text-[11px] tracking-[0.18em] uppercase text-[#A07042] block"
        />
        <EditableText
          as="p"
          slot={`precios.pkg.${slug}.desc`}
          defaults={pkg.description}
          className="mt-4 text-sm text-[#5C5248] leading-relaxed block"
        />

        {/* Price */}
        <div className="mt-6 flex items-baseline gap-2" data-testid={`pricing-price-${slug}`}>
          <span className="text-[11px] tracking-[0.18em] uppercase text-[#7A6E62]">{pick(L.from, lang)}</span>
          <span className="font-serif-x text-4xl text-[#1A1513] leading-none">{price ? fmtEuro(price) : "—"}</span>
          <span className="text-sm text-[#7A6E62]">/ {pick(L.perPerson, lang)}</span>
        </div>
      </div>

      {/* Inclusions */}
      <div className="px-7 md:px-9 pt-5 pb-7 border-t border-[#2C2621]/10 flex-1">
        <span className="text-[10px] tracking-[0.3em] uppercase text-[#A07042]">
          <EditableText slot="precios.included_label" defaults={{ es: "Qué incluye", en: "What's included", fr: "Ce qui est inclus" }} multiline={false} />
        </span>
        <ul className="mt-4 space-y-2.5">
          {pkg.inclusions.map((inc, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-[#2C2621]">
              <Check className="w-4 h-4 mt-0.5 shrink-0 text-[#C16542]" strokeWidth={2.2} />
              <EditableText slot={`precios.pkg.${slug}.inc.${i + 1}`} defaults={inc} className="leading-snug block" />
            </li>
          ))}
        </ul>
      </div>

      {/* CTAs */}
      <div className="px-7 md:px-9 pb-7 flex flex-col sm:flex-row gap-3">
        <Link
          to={pathFor(lang, "planTrip")}
          data-testid={`pricing-cta-plan-${slug}`}
          className="flex-1 inline-flex items-center justify-center gap-2.5 bg-[#C16542] hover:bg-[#A35133] text-[#FDFBF7] px-5 py-3.5 text-[11px] tracking-[0.2em] uppercase transition-colors"
        >
          <EditableText slot="precios.cta_primary" defaults={{ es: "Solicitar este viaje", en: "Request this trip", fr: "Demander ce voyage" }} multiline={false} />
          <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.7} />
        </Link>
        <Link
          to={pathFor(lang, "contact")}
          data-testid={`pricing-cta-contact-${slug}`}
          className="inline-flex items-center justify-center gap-2.5 border border-[#2C2621]/25 hover:border-[#1A1513] hover:bg-[#1A1513] hover:text-[#FDFBF7] text-[#1A1513] px-5 py-3.5 text-[11px] tracking-[0.2em] uppercase transition-all duration-300"
        >
          <EditableText slot="precios.cta_secondary" defaults={{ es: "Contactar", en: "Contact", fr: "Contact" }} multiline={false} />
        </Link>
      </div>
    </article>
  );
};

export default function PreciosPage() {
  const { lang } = useLanguage();
  const pricing = usePricing();

  const fromFor = (trips) => {
    let min = Infinity;
    (trips || []).forEach((tr) => {
      const prog = getProgramTiers(tr.routeId);
      // Skip hub/landing routes that carry no specific tariff, so the
      // package "from" reflects only real, priced programs (and never the
      // global placeholder price).
      if (!prog) return;
      const f = getFromPrice({ tiers: prog });
      if (f) min = Math.min(min, f);
    });
    return Number.isFinite(min) ? min : getFromPrice(pricing);
  };

  return (
    <main data-testid="precios-page" className="bg-[#FDFBF7] min-h-screen">
      {/* Hero / intro */}
      <section className="relative overflow-hidden pt-32 md:pt-40 pb-12 md:pb-16">
        <div className="absolute inset-0 berber-bg-cross opacity-[0.06] pointer-events-none" aria-hidden="true" />
        <div className="relative max-w-7xl mx-auto px-6 md:px-12">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-3 text-[11px] tracking-[0.35em] uppercase text-[#A07042]">
              <span className="w-8 h-px bg-[#D4A373]" />
              <EditableText slot="precios.hero.eyebrow" defaults={{ es: "Precios", en: "Pricing", fr: "Tarifs" }} multiline={false} />
            </span>
            <EditableText
              as="h1"
              slot="precios.hero.title"
              defaults={{ es: "Elige tu forma de viajar por Marruecos", en: "Choose your way to travel through Morocco", fr: "Choisissez votre façon de voyager au Maroc" }}
              multiline={false}
              className="font-serif-x text-4xl md:text-5xl lg:text-6xl leading-[1.04] tracking-tight text-[#1A1513] mt-6 block"
            />
            <EditableText
              as="p"
              slot="precios.hero.subtitle"
              defaults={{
                es: "Cuatro maneras de descubrir el país, cada una con todo lo necesario incluido. Compara, elige la que mejor encaje contigo y diseñamos tu viaje a medida sin compromiso.",
                en: "Four ways to discover the country, each with everything you need included. Compare, pick your favourite and we'll tailor your trip — no commitment.",
                fr: "Quatre façons de découvrir le pays, tout inclus. Comparez, choisissez et nous concevons votre voyage sur mesure, sans engagement.",
              }}
              className="mt-6 text-base md:text-lg text-[#5C5248] leading-relaxed block"
            />
          </div>
        </div>
      </section>

      {/* Packages — 2x2 comparison */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-7">
          {PRICING_PACKAGES.map((pkg) => (
            <PackageCard key={pkg.slug} pkg={pkg} price={fromFor(pkg.trips)} lang={lang} />
          ))}
        </div>
      </section>

      {/* Exhaustive directory — every trip grouped by region with price matrix */}
      <TripDirectory lang={lang} pricing={pricing} />

      {/* Reassurance / trust note */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-12 md:py-16">
        <div className="bg-[#1A1513] text-[#FDFBF7] p-8 md:p-12 relative overflow-hidden">
          <div className="absolute inset-0 berber-bg-cross opacity-10 pointer-events-none" aria-hidden="true" />
          <div className="relative grid md:grid-cols-[auto,1fr] gap-6 md:gap-10 items-start">
            <ShieldCheck className="w-9 h-9 text-[#D4A373]" strokeWidth={1.4} />
            <div>
              <EditableText
                as="h2"
                slot="precios.trust.title"
                defaults={{ es: "Precios orientativos, sin sorpresas", en: "Indicative prices, no surprises", fr: "Prix indicatifs, sans surprises" }}
                multiline={false}
                className="font-serif-x text-2xl md:text-3xl tracking-tight block"
              />
              <EditableText
                as="p"
                slot="precios.trust.body"
                defaults={{
                  es: "Las tarifas son por persona en base a ocupación doble y varían según la temporada y el número de viajeros. Todos nuestros viajes son privados y a medida: ajustamos alojamientos, ritmo y experiencias a tu gusto. Pídenos un presupuesto detallado sin compromiso.",
                  en: "Rates are per person based on double occupancy and vary by season and group size. All our trips are private and tailor-made: we adapt accommodation, pace and experiences to you. Ask us for a detailed quote — no commitment.",
                  fr: "Les tarifs sont par personne en occupation double et varient selon la saison et le nombre de voyageurs. Tous nos voyages sont privés et sur mesure. Demandez un devis détaillé, sans engagement.",
                }}
                className="mt-3 text-sm md:text-base text-[#FDFBF7]/75 leading-relaxed max-w-3xl block"
              />
              <div className="mt-7 flex flex-wrap gap-4">
                <Link
                  to={pathFor(lang, "planTrip")}
                  data-testid="precios-trust-cta-plan"
                  className="inline-flex items-center gap-2.5 bg-[#C16542] hover:bg-[#A35133] text-[#FDFBF7] px-7 py-3.5 text-[11px] tracking-[0.22em] uppercase transition-colors"
                >
                  <EditableText slot="precios.cta_primary" defaults={{ es: "Solicitar este viaje", en: "Request this trip", fr: "Demander ce voyage" }} multiline={false} />
                  <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.7} />
                </Link>
                <Link
                  to={pathFor(lang, "contact")}
                  data-testid="precios-trust-cta-contact"
                  className="inline-flex items-center gap-2.5 border border-[#FDFBF7]/35 hover:border-[#FDFBF7] hover:bg-[#FDFBF7] hover:text-[#1A1513] text-[#FDFBF7] px-7 py-3.5 text-[11px] tracking-[0.22em] uppercase transition-all duration-300"
                >
                  <EditableText slot="precios.cta_secondary" defaults={{ es: "Contactar", en: "Contact", fr: "Contact" }} multiline={false} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
