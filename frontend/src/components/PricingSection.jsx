import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Users, Car, CalendarDays, BedSingle, Baby } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { pathFor } from "@/lib/routes";
import { usePricing } from "@/lib/pricingStore";
import { getFromPrice, fmtEuro, pickLang } from "@/lib/pricing";
import { getProgramTiers, getProgramExtras } from "@/lib/programPricing";

/* ============================================================
   <PricingSection> — dedicated, standardised pricing block for
   every itinerary page. Two seasons (High / Low) × traveller
   tiers (2/3/4 people) for the Accommodation & Excursions 4x4
   package, plus season definitions, the occupancy note and the
   "From" price. Fully data-driven from the centralised pricing
   store (config + /admin override). Trilingual.

   Props:
     id      section anchor id (default "pricing")
     testid  root data-testid (default "pricing-section")
     The CTA always links to the Contact page (/contacto).
============================================================ */
export const PricingSection = ({ id = "pricing", testid = "pricing-section", routeId = null }) => {
  const { lang } = useLanguage();
  const pricing = usePricing();
  const L = pricing.labels;
  const p = (o) => pickLang(o, lang);
  // Per-program tariff (if this itinerary has its own) overrides the global
  // tiers; otherwise fall back to the global/admin pricing.
  const tiers = getProgramTiers(routeId) || pricing.tiers;
  const from = getFromPrice({ tiers });
  // Optional per-program single supplement & child price (trilingual labels).
  const extras = getProgramExtras(routeId);
  const EX = {
    supplement: { es: "Suplemento individual", en: "Single supplement", fr: "Supplément individuel" },
    child: { es: "Niño", en: "Child", fr: "Enfant" },
    note: {
      es: "Suplemento individual y precio por niño (por persona), según temporada.",
      en: "Single supplement and child price (per person), by season.",
      fr: "Supplément individuel et prix enfant (par personne), selon la saison.",
    },
  };
  const extraCells = (obj) =>
    obj.low === obj.high ? (
      <div className="col-span-2 px-4 md:px-6 py-4 text-center border-l border-[#FDFBF7]/10 font-serif-x text-lg md:text-xl">
        {fmtEuro(obj.low)}
      </div>
    ) : (
      <>
        <div className="px-4 md:px-6 py-4 text-right md:text-center border-l border-[#FDFBF7]/10 font-serif-x text-lg md:text-xl">
          {fmtEuro(obj.low)}
        </div>
        <div className="px-4 md:px-6 py-4 text-right md:text-center border-l border-[#FDFBF7]/10 font-serif-x text-lg md:text-xl text-[#E8C9A0]">
          {fmtEuro(obj.high)}
        </div>
      </>
    );

  return (
    <section
      id={id}
      data-testid={testid}
      className="relative bg-[#1A1513] text-[#FDFBF7] py-24 md:py-32 overflow-hidden"
    >
      <div className="absolute inset-0 berber-bg-cross opacity-40" aria-hidden="true" />
      <span className="film-grain" />
      <div className="relative max-w-6xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end mb-12">
          <div className="md:col-span-7">
            <span className="overline text-[#D4A373]">{p(L.overline)}</span>
            <h2 className="font-serif-x text-4xl md:text-5xl lg:text-[54px] leading-[1.05] tracking-tight mt-5">
              {p(L.title)}
            </h2>
          </div>
          <div className="md:col-span-5">
            <p className="text-base md:text-lg text-[#FDFBF7]/75 leading-relaxed">{p(L.subtitle)}</p>
          </div>
        </div>

        {/* Package + vehicle chips */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <span className="inline-flex items-center gap-2 text-[10px] tracking-[0.25em] uppercase text-[#FDFBF7]/80 bg-[#FDFBF7]/[0.06] border border-[#FDFBF7]/15 px-3 py-2">
            <CalendarDays className="w-3.5 h-3.5 text-[#D4A373]" strokeWidth={1.6} />
            {p(pricing.package)}
          </span>
          <span className="inline-flex items-center gap-2 text-[10px] tracking-[0.25em] uppercase text-[#FDFBF7]/80 bg-[#FDFBF7]/[0.06] border border-[#FDFBF7]/15 px-3 py-2">
            <Car className="w-3.5 h-3.5 text-[#D4A373]" strokeWidth={1.6} />
            {p(pricing.vehicle)}
          </span>
        </div>

        {/* Price matrix */}
        <div data-testid="pricing-table" className="border border-[#FDFBF7]/15 overflow-hidden">
          {/* Head row */}
          <div className="grid grid-cols-3 bg-[#FDFBF7]/[0.06] text-[10px] md:text-[11px] tracking-[0.22em] uppercase text-[#FDFBF7]/60">
            <div className="px-4 md:px-6 py-4 flex items-center gap-2">
              <Users className="w-3.5 h-3.5 text-[#D4A373]" strokeWidth={1.6} />
              {p(L.travellers)}
            </div>
            <div className="px-4 md:px-6 py-4 text-right md:text-center border-l border-[#FDFBF7]/10">
              {p(pricing.seasons.low.label)}
            </div>
            <div className="px-4 md:px-6 py-4 text-right md:text-center border-l border-[#FDFBF7]/10">
              {p(pricing.seasons.high.label)}
            </div>
          </div>
          {/* Tier rows */}
          {tiers.map((tier) => (
            <div
              key={tier.people}
              data-testid={`pricing-row-${tier.people}`}
              className="grid grid-cols-3 border-t border-[#FDFBF7]/10 hover:bg-[#221A16] transition-colors"
            >
              <div className="px-4 md:px-6 py-5 flex items-baseline gap-1.5">
                <span className="font-serif-x text-2xl md:text-[26px] leading-none">{tier.people}</span>
                <span className="text-[11px] tracking-[0.18em] uppercase text-[#FDFBF7]/55">
                  {p(L.people)}*
                </span>
              </div>
              <div className="px-4 md:px-6 py-5 text-right md:text-center border-l border-[#FDFBF7]/10">
                <span className="font-serif-x text-xl md:text-2xl">{fmtEuro(tier.low)}</span>
                <span className="block text-[9px] tracking-[0.2em] uppercase text-[#FDFBF7]/45 mt-1">
                  {p(L.perPerson)}
                </span>
              </div>
              <div className="px-4 md:px-6 py-5 text-right md:text-center border-l border-[#FDFBF7]/10">
                <span className="font-serif-x text-xl md:text-2xl text-[#E8C9A0]">{fmtEuro(tier.high)}</span>
                <span className="block text-[9px] tracking-[0.2em] uppercase text-[#FDFBF7]/45 mt-1">
                  {p(L.perPerson)}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Per-program extras: single supplement & child (only when present) */}
        {extras && (
          <div data-testid="pricing-extras" className="border border-t-0 border-[#FDFBF7]/15">
            {extras.supplement && (
              <div
                data-testid="pricing-supplement"
                className="grid grid-cols-3 border-t border-[#FDFBF7]/10 hover:bg-[#221A16] transition-colors"
              >
                <div className="px-4 md:px-6 py-4 flex items-center gap-2 text-[11px] md:text-xs tracking-[0.12em] uppercase text-[#FDFBF7]/70">
                  <BedSingle className="w-3.5 h-3.5 text-[#D4A373]" strokeWidth={1.6} />
                  {p(EX.supplement)}
                </div>
                {extraCells(extras.supplement)}
              </div>
            )}
            {extras.child && (
              <div
                data-testid="pricing-child"
                className="grid grid-cols-3 border-t border-[#FDFBF7]/10 hover:bg-[#221A16] transition-colors"
              >
                <div className="px-4 md:px-6 py-4 flex items-center gap-2 text-[11px] md:text-xs tracking-[0.12em] uppercase text-[#FDFBF7]/70">
                  <Baby className="w-3.5 h-3.5 text-[#D4A373]" strokeWidth={1.6} />
                  {p(EX.child)}
                </div>
                {extraCells(extras.child)}
              </div>
            )}
            <div className="px-4 md:px-6 py-3 border-t border-[#FDFBF7]/10 text-[10px] tracking-[0.1em] text-[#FDFBF7]/45">
              {p(EX.note)}
            </div>
          </div>
        )}

        {/* Occupancy note */}
        <p className="mt-4 text-xs text-[#FDFBF7]/55 leading-relaxed">{p(pricing.note)}</p>
        <p className="mt-1 text-[10px] tracking-[0.18em] uppercase text-[#C16542]/90">
          {p(L.placeholderNotice)}
        </p>

        {/* Season definitions */}
        <div className="mt-12">
          <h3 className="text-[10px] tracking-[0.3em] uppercase text-[#D4A373] mb-5">{p(L.seasonsTitle)}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#FDFBF7]/10 border border-[#FDFBF7]/15">
            <div data-testid="pricing-season-high" className="bg-[#1A1513] p-6 md:p-7">
              <h4 className="font-serif-x text-2xl mb-4">{p(pricing.seasons.high.label)}</h4>
              <div className="flex flex-wrap gap-2">
                {(pricing.seasons.high.months[lang] || pricing.seasons.high.months.es).map((m) => (
                  <span
                    key={m}
                    className="text-[11px] tracking-[0.12em] uppercase text-[#FDFBF7]/80 bg-[#C16542]/15 border border-[#C16542]/30 px-2.5 py-1.5"
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>
            <div data-testid="pricing-season-low" className="bg-[#1A1513] p-6 md:p-7">
              <h4 className="font-serif-x text-2xl mb-4">{p(pricing.seasons.low.label)}</h4>
              <p className="text-sm text-[#FDFBF7]/70 leading-relaxed">{p(pricing.seasons.low.desc)}</p>
            </div>
          </div>
        </div>

        {/* From price + CTA */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-[#FDFBF7]/10 pt-8">
          {from && (
            <div data-testid="pricing-from">
              <span className="block text-[10px] tracking-[0.25em] uppercase text-[#FDFBF7]/55">
                {p(L.from)}
              </span>
              <p className="font-serif-x text-4xl md:text-5xl text-[#FDFBF7] mt-1">
                {fmtEuro(from)}{" "}
                <span className="text-base tracking-[0.18em] uppercase text-[#FDFBF7]/55 align-middle">
                  / {p(L.perPerson)}
                </span>
              </p>
            </div>
          )}
          <Link
            to={pathFor(lang, "contact")}
            data-testid="pricing-cta"
            className="inline-flex items-center gap-3 bg-[#C16542] hover:bg-[#A35133] text-[#FDFBF7] px-8 py-4 text-[11px] tracking-[0.25em] uppercase transition-colors"
          >
            {p(L.cta)}
            <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.6} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
