import React from "react";
import { Link } from "react-router-dom";
import { Check, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { useLanguage, pick } from "@/contexts/LanguageContext";
import { pathFor } from "@/lib/routes";
import { usePricing } from "@/lib/pricingStore";
import { getProgramTiers } from "@/lib/programPricing";
import { getFromPrice, mergePricing, fmtEuro, DEFAULT_PRICING } from "@/lib/pricing";
import EditableText from "@/components/EditableText";
import { PRICING_PACKAGES } from "@/lib/preciosData";

const L = DEFAULT_PRICING.labels;

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
      const f = getFromPrice(prog ? mergePricing(prog) : pricing);
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
