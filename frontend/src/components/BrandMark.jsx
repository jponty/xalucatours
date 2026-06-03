import React from "react";
import { Link } from "react-router-dom";
import { useLanguage, pick } from "@/contexts/LanguageContext";
import EditableText from "@/components/EditableText";
import grupXalucaLogo from "@/assets/grup-xaluca-logo.webp";

const BRAND_FIRST = { es: "Xaluca", en: "Xaluca", fr: "Xaluca" };
const BRAND_SECOND = { es: "Tours", en: "Tours", fr: "Tours" };
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
      className={`inline-flex items-center gap-2.5 group ${className}`}
      style={{ color: ink }}
    >
      <img
        src={grupXalucaLogo}
        alt="Xaluca"
        data-testid="brand-logo"
        className="h-9 md:h-11 w-auto object-contain shrink-0 transition-transform duration-300 group-hover:scale-105"
      />
      <span className="inline-flex items-baseline gap-2">
        <EditableText
          slot="brand.first"
          defaults={BRAND_FIRST}
          multiline={false}
          className="font-serif-x text-2xl md:text-[28px] leading-none tracking-tight"
        />
        <span className="text-[#C16542] text-2xl md:text-[28px] leading-none">·</span>
        <EditableText
          slot="brand.second"
          defaults={BRAND_SECOND}
          multiline={false}
          className="font-serif-x text-2xl md:text-[28px] leading-none tracking-tight italic"
        />
      </span>
      <EditableText
        slot="brand.tagline"
        defaults={TAGLINE}
        multiline={false}
        data-testid="brand-tagline"
        className="hidden lg:inline-flex items-center gap-3 ml-3 pl-3 border-l text-[10.5px] tracking-[0.22em] uppercase whitespace-nowrap opacity-70"
        style={{ color: ink, borderColor: `${ink}33` }}
      />
    </Link>
  );
};
