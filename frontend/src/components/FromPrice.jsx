import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePricing } from "@/lib/pricingStore";
import { getFromPrice, fmtEuro, pickLang } from "@/lib/pricing";

/* ============================================================
   <FromPrice> — universal "Desde €790 por persona" label.
   Reads the lowest configured price from the centralised /admin-
   overridable pricing store, so it updates everywhere at once.

   Props:
     tone   "light" (on dark imagery, default) | "dark" | "plain"
     size   "sm" (default) | "xs" | "md"
     className  extra classes
     testid     data-testid override
============================================================ */
export const FromPrice = ({ tone = "light", size = "sm", className = "", testid }) => {
  const { lang } = useLanguage();
  const pricing = usePricing();
  const from = getFromPrice(pricing);
  if (!from) return null;

  const fromLabel = pickLang(pricing.labels.from, lang);
  const perPerson = pickLang(pricing.labels.perPerson, lang);

  const toneCls =
    tone === "dark"
      ? "text-[#5C5248]"
      : tone === "plain"
      ? "text-current"
      : "text-[#FDFBF7]";
  const accentCls = tone === "dark" ? "text-[#C16542]" : "text-[#D4A373]";
  const sizeCls = size === "md" ? "text-sm" : size === "xs" ? "text-[10px]" : "text-xs";
  const priceSize = size === "md" ? "text-lg" : size === "xs" ? "text-sm" : "text-base";

  return (
    <span
      data-testid={testid || "from-price"}
      className={`inline-flex items-baseline gap-1.5 ${sizeCls} ${toneCls} ${className}`}
    >
      <span className="tracking-[0.18em] uppercase opacity-80">{fromLabel}</span>
      <strong className={`font-serif-x ${priceSize} ${accentCls} not-italic`}>{fmtEuro(from)}</strong>
      <span className="tracking-[0.12em] uppercase opacity-70">{perPerson}</span>
    </span>
  );
};

export default FromPrice;
