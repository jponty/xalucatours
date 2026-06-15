import React from "react";
import { Info } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePricing } from "@/lib/pricingStore";
import { getFromPrice, fmtEuro, pickLang } from "@/lib/pricing";
import { getProgramTiers } from "@/lib/programPricing";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";

const BREAKDOWN_COPY = {
  es: { title: "Precio por persona", person: "persona", people: "personas", low: "Baja", high: "Alta", note: "El precio «Desde» corresponde a la temporada baja." },
  en: { title: "Price per person", person: "person", people: "people", low: "Low", high: "High", note: "The «From» price reflects the low season." },
  fr: { title: "Prix par personne", person: "personne", people: "personnes", low: "Basse", high: "Haute", note: "Le prix « Dès » correspond à la basse saison." },
};

/* ============================================================
   <FromPrice> — universal "Desde €790 por persona" label.
   Reads the lowest configured price from the centralised /admin-
   overridable pricing store, so it updates everywhere at once.
   Pass `routeId` to use that itinerary's own tariff (matching the
   PricingSection) instead of the global tiers.

   Props:
     tone   "light" (on dark imagery, default) | "dark" | "plain"
     size   "sm" (default) | "xs" | "md"
     routeId    use per-program tariff when available
     className  extra classes
     testid     data-testid override
============================================================ */
export const FromPrice = ({ tone = "light", size = "sm", layout = "inline", routeId = null, routeIds = null, className = "", testid }) => {
  const { lang } = useLanguage();
  const pricing = usePricing();
  const [open, setOpen] = React.useState(false);
  // Build the list of candidate routes (single `routeId` and/or a `routeIds`
  // array for collection cards). The "from" is the lowest real per-program
  // tariff across them, so cards mirror the trip page and /precios exactly.
  const candidates = [routeId, ...(Array.isArray(routeIds) ? routeIds : [])].filter(Boolean);
  const tierSets = candidates.map((id) => getProgramTiers(id)).filter(Boolean);
  const usableSets = tierSets.length ? tierSets : [pricing.tiers];
  const froms = usableSets.map((tiers) => getFromPrice({ tiers })).filter((n) => typeof n === "number");
  const from = froms.length ? Math.min(...froms) : null;
  if (!from) return null;

  // Pick the tier set that produced the lowest price — its per-pax rows are the
  // transparent breakdown behind the "Desde €…" headline.
  const breakdownTiers = (usableSets.find((tiers) => getFromPrice({ tiers }) === from) || usableSets[0] || [])
    .slice()
    .sort((a, b) => (a.people || 0) - (b.people || 0));
  const hasSeasons = breakdownTiers.some((t) => t.low !== t.high);

  const fromLabel = pickLang(pricing.labels.from, lang);
  const perPerson = pickLang(pricing.labels.perPerson, lang);
  const L = BREAKDOWN_COPY[lang] || BREAKDOWN_COPY.es;

  const toneCls =
    tone === "dark"
      ? "text-[#5C5248]"
      : tone === "plain"
      ? "text-current"
      : "text-[#FDFBF7]";
  const accentCls = tone === "dark" ? "text-[#C16542]" : "text-[#D4A373]";

  // ── Price node (inline or stacked) ──────────────────────────────────────
  let priceNode;
  if (layout === "stacked") {
    priceNode = (
      <span className={`flex flex-col gap-0.5 ${toneCls} ${className}`}>
        <span className="flex items-baseline gap-1.5 whitespace-nowrap">
          <span className="text-[10px] tracking-[0.18em] uppercase opacity-70">{fromLabel}</span>
          <strong className={`font-serif-x text-xl md:text-2xl leading-none not-italic ${accentCls}`}>{fmtEuro(from)}</strong>
          <Info className="w-3 h-3 opacity-50" strokeWidth={1.8} aria-hidden="true" />
        </span>
        <span className="text-[10px] tracking-[0.14em] uppercase opacity-70">{perPerson}</span>
      </span>
    );
  } else {
    const sizeCls = size === "md" ? "text-sm" : size === "xs" ? "text-[10px]" : "text-xs";
    const priceSize = size === "md" ? "text-lg" : size === "xs" ? "text-sm" : "text-base";
    priceNode = (
      <span className={`inline-flex items-baseline gap-1.5 ${sizeCls} ${toneCls} ${className}`}>
        <span className="tracking-[0.18em] uppercase opacity-80">{fromLabel}</span>
        <strong className={`font-serif-x ${priceSize} ${accentCls} not-italic`}>{fmtEuro(from)}</strong>
        <span className="tracking-[0.12em] uppercase opacity-70">{perPerson}</span>
        <Info className="w-3 h-3 opacity-50 self-center" strokeWidth={1.8} aria-hidden="true" />
      </span>
    );
  }

  if (!breakdownTiers.length) {
    return <span data-testid={testid || "from-price"}>{priceNode}</span>;
  }

  // ── Breakdown popover ───────────────────────────────────────────────────
  // A Popover (portal, so it isn't clipped by overflow-hidden cards) that
  // opens on hover (desktop) AND on tap (mobile), while never triggering the
  // parent card's navigation.
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <span
          data-testid={testid || "from-price"}
          role="button"
          tabIndex={0}
          aria-label={L.title}
          className="inline-flex cursor-pointer"
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
        >
          {priceNode}
        </span>
      </PopoverTrigger>
      <PopoverContent
        side="top"
        align="start"
        sideOffset={8}
        onOpenAutoFocus={(e) => e.preventDefault()}
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
        className="w-auto bg-[#2C2621] text-[#FDFBF7] border border-[#FDFBF7]/15 px-4 py-3 shadow-2xl rounded-md"
        data-testid={`${testid || "from-price"}-breakdown`}
      >
        <div className="min-w-[170px] text-left">
          <p className="text-[10px] tracking-[0.22em] uppercase text-[#D4A373] mb-2.5">{L.title}</p>
          <ul className="space-y-1.5">
            {breakdownTiers.map((t) => (
              <li key={t.people} className="flex items-center justify-between gap-5 text-[12px] leading-none">
                <span className="text-[#FDFBF7]/65 whitespace-nowrap">
                  {t.people} {t.people === 1 ? L.person : L.people}
                </span>
                {t.low === t.high ? (
                  <strong className="font-serif-x text-sm text-[#FDFBF7] not-italic">{fmtEuro(t.low)}</strong>
                ) : (
                  <span className="flex items-baseline gap-2.5 whitespace-nowrap">
                    <span className="text-[#FDFBF7]">
                      <strong className="font-serif-x text-sm not-italic">{fmtEuro(t.low)}</strong>
                      <span className="ml-1 text-[8px] uppercase tracking-[0.12em] text-[#D4A373]">{L.low}</span>
                    </span>
                    <span className="text-[#FDFBF7]/55">
                      <strong className="font-serif-x text-sm not-italic">{fmtEuro(t.high)}</strong>
                      <span className="ml-1 text-[8px] uppercase tracking-[0.12em] text-[#FDFBF7]/40">{L.high}</span>
                    </span>
                  </span>
                )}
              </li>
            ))}
          </ul>
          {hasSeasons && (
            <p className="mt-2.5 pt-2.5 border-t border-[#FDFBF7]/10 text-[10px] leading-snug text-[#FDFBF7]/50">{L.note}</p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default FromPrice;
