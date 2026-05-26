import React from "react";
import { Link } from "react-router-dom";
import { useLanguage, pick } from "@/contexts/LanguageContext";

const TAGLINE = {
  es: "Especialistas en viajes por Marruecos",
  en: "Specialists in Moroccan journeys",
  fr: "Spécialistes des voyages au Maroc",
};

export const BrandMark = ({ inverted = false, className = "" }) => {
  const { lang } = useLanguage();
  const ink = inverted ? "#FDFBF7" : "#2C2621";
  return (
    <Link
      to="/"
      data-testid="brand-mark"
      aria-label={`Xaluca Tours — ${pick(TAGLINE, lang)}`}
      className={`inline-flex items-baseline gap-2 group ${className}`}
      style={{ color: ink }}
    >
      <span className="font-serif-x text-2xl md:text-[28px] leading-none tracking-tight">
        Xaluca
      </span>
      <span className="text-[#C16542] text-2xl md:text-[28px] leading-none">·</span>
      <span className="font-serif-x text-2xl md:text-[28px] leading-none tracking-tight italic">
        Tours
      </span>
      <span
        className="hidden lg:inline-flex items-center gap-3 ml-3 pl-3 border-l text-[10.5px] tracking-[0.22em] uppercase whitespace-nowrap opacity-70"
        style={{ color: ink, borderColor: `${ink}33` }}
        data-testid="brand-tagline"
      >
        {pick(TAGLINE, lang)}
      </span>
    </Link>
  );
};
