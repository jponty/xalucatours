/* ============================================================
   TripPriceDisclosure — compact price accordion for a single
   program, used inside the home "Estilos de viaje" section so
   visitors can compare tariffs without leaving the page.
   Shows: "From" price per person, applicable season, per-occupancy
   conditions, and a link to the full pricing detail.
============================================================ */
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, Tag, ArrowRight } from "lucide-react";
import { useLanguage, pick } from "@/contexts/LanguageContext";
import { pathFor } from "@/lib/routes";
import { getProgramTiers } from "@/lib/programPricing";
import { getFromPrice, fmtEuro } from "@/lib/pricing";

const COPY = {
  trigger:   { es: "Precios", en: "Prices", fr: "Tarifs" },
  from:      { es: "Desde", en: "From", fr: "Dès" },
  perPerson: { es: "/ persona", en: "/ person", fr: "/ pers." },
  occupancy: { es: "Precio por persona según ocupación", en: "Per-person price by occupancy", fr: "Prix par personne selon l'occupation" },
  person:    { es: "persona", en: "person", fr: "personne" },
  people:    { es: "personas", en: "people", fr: "personnes" },
  low:       { es: "Baja", en: "Low", fr: "Basse" },
  high:      { es: "Alta", en: "High", fr: "Haute" },
  season:    { es: "Temporada baja – alta", en: "Low – high season", fr: "Basse – haute saison" },
  oneSeason: { es: "Precio único todo el año", en: "Same price all year", fr: "Prix unique toute l'année" },
  note:      { es: "El precio «Desde» corresponde a la temporada baja.", en: "The «From» price reflects the low season.", fr: "Le prix « Dès » correspond à la basse saison." },
  detail:    { es: "Ver detalle de precios", en: "See full pricing", fr: "Voir le détail des tarifs" },
};

export default function TripPriceDisclosure({ routeId, slug }) {
  const { lang } = useLanguage();
  const [open, setOpen] = useState(false);

  const tiers = getProgramTiers(routeId);
  if (!tiers || !tiers.length) return null;
  const from = getFromPrice({ tiers });
  if (!from) return null;

  const rows = tiers.slice().sort((a, b) => (a.people || 0) - (b.people || 0));
  const hasSeasons = rows.some((t) => t.low !== t.high);
  const detailTo = `${pathFor(lang, routeId)}#pricing`;

  return (
    <div className="mt-1" data-testid={`price-disclosure-${routeId}`}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        data-testid={`price-disclosure-toggle-${routeId}`}
        className="w-full flex items-center justify-between gap-3 py-2 text-left group/price"
      >
        <span className="inline-flex items-center gap-1.5 text-[10px] tracking-[0.22em] uppercase text-[#A07042]">
          <Tag className="w-3 h-3" strokeWidth={1.7} />
          {pick(COPY.trigger, lang)}
        </span>
        <span className="inline-flex items-center gap-2 text-[12px] text-[#5C5248]">
          <span className="whitespace-nowrap">
            {pick(COPY.from, lang)}{" "}
            <strong className="font-serif-x not-italic text-[15px] text-[#C16542]">{fmtEuro(from)}</strong>
          </span>
          <ChevronDown
            className={`w-3.5 h-3.5 text-[#A07042] transition-transform duration-300 ${open ? "rotate-180" : ""}`}
            strokeWidth={1.8}
          />
        </span>
      </button>

      <div
        className={`grid transition-all duration-300 ease-out ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
      >
        <div className="overflow-hidden">
          <div className="mt-1 mb-2 border-l-2 border-[#C16542]/40 bg-[#F5EFE3]/60 pl-3 pr-3 py-3">
            {/* Season */}
            <span className="inline-block text-[9px] tracking-[0.2em] uppercase text-[#A07042] mb-2">
              {pick(hasSeasons ? COPY.season : COPY.oneSeason, lang)}
            </span>

            {/* Occupancy conditions */}
            <span className="block text-[10px] text-[#5C5248] mb-1.5">{pick(COPY.occupancy, lang)}</span>
            <ul className="space-y-1">
              {rows.map((t) => (
                <li key={t.people} className="flex items-center justify-between gap-4 text-[12px] leading-none">
                  <span className="text-[#5C5248] whitespace-nowrap">
                    {t.people} {t.people === 1 ? pick(COPY.person, lang) : pick(COPY.people, lang)}
                  </span>
                  {t.low === t.high ? (
                    <strong className="font-serif-x not-italic text-[13px] text-[#2C2621]">{fmtEuro(t.low)}</strong>
                  ) : (
                    <span className="flex items-baseline gap-2 whitespace-nowrap">
                      <span className="text-[#2C2621]">
                        <strong className="font-serif-x not-italic text-[13px]">{fmtEuro(t.low)}</strong>
                        <span className="ml-1 text-[8px] uppercase tracking-[0.1em] text-[#A07042]">{pick(COPY.low, lang)}</span>
                      </span>
                      <span className="text-[#5C5248]/70">
                        <strong className="font-serif-x not-italic text-[13px]">{fmtEuro(t.high)}</strong>
                        <span className="ml-1 text-[8px] uppercase tracking-[0.1em] text-[#5C5248]/50">{pick(COPY.high, lang)}</span>
                      </span>
                    </span>
                  )}
                </li>
              ))}
            </ul>

            {hasSeasons && (
              <p className="mt-2 text-[10px] leading-snug text-[#5C5248]/70">{pick(COPY.note, lang)}</p>
            )}

            <Link
              to={detailTo}
              data-testid={`price-disclosure-detail-${routeId}`}
              className="mt-3 inline-flex items-center gap-1.5 text-[10px] tracking-[0.2em] uppercase text-[#C16542] hover:text-[#A35133] transition-colors"
            >
              {pick(COPY.detail, lang)}
              <ArrowRight className="w-3 h-3" strokeWidth={1.7} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
