/* ============================================================
   TravelHelpWidget — a light, eye-catching "ball" contact prompt
   placed above the travel-style navigation cards on the home.
   A circular Xaluca avatar (with a soft pulsing ring) invites the
   visitor to talk to an agent, with a quick "Solicitar cita" CTA
   linking to /citaprevia (localised per language).
   All copy is CMS-editable.
============================================================ */
import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useLanguage, pick } from "@/contexts/LanguageContext";
import { pathFor } from "@/lib/routes";
import EditableText from "@/components/EditableText";
import monogramaX from "@/assets/monograma-x-white.png";

const TITLE = { es: "¿Necesitas ayuda?", en: "Need a hand?", fr: "Besoin d'aide ?" };
const BODY = {
  es: "Habla con un agente y encuentra tu viaje ideal.",
  en: "Talk to an agent and find your ideal trip.",
  fr: "Parlez à un agent et trouvez votre voyage idéal.",
};
const CTA = { es: "Solicitar cita", en: "Book a call", fr: "Prendre rendez-vous" };
const ONLINE = { es: "Agentes disponibles", en: "Agents available", fr: "Agents disponibles" };

export const TravelHelpWidget = () => {
  const { lang } = useLanguage();
  return (
    <div className="mb-14 md:mb-16 flex justify-center" data-testid="travel-help-widget">
      <div className="group relative w-full max-w-2xl flex items-center gap-4 md:gap-5 bg-[#FDFBF7] border border-[#2C2621]/10 rounded-full pl-3 pr-4 py-3 md:pr-5 shadow-[0_18px_50px_-30px_rgba(26,21,19,0.55)] hover:shadow-[0_24px_60px_-26px_rgba(193,101,66,0.5)] transition-shadow duration-500">
        {/* Ball avatar with pulsing ring + live dot */}
        <div className="relative shrink-0">
          <span className="absolute inset-0 rounded-full bg-[#C16542]/25 animate-ping" aria-hidden="true" />
          <span className="relative inline-flex items-center justify-center w-16 h-16 md:w-[72px] md:h-[72px] rounded-full bg-[#C16542] shadow-[0_8px_22px_-6px_rgba(193,101,66,0.7)]">
            <img src={monogramaX} alt="Xaluca Tours" className="w-9 h-9 md:w-10 md:h-10 object-contain" />
          </span>
          <span className="absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full bg-[#5A6B4F] border-2 border-[#FDFBF7]" aria-hidden="true" />
        </div>

        {/* Text */}
        <div className="min-w-0 flex-1">
          <span className="inline-flex items-center gap-1.5 text-[9px] tracking-[0.22em] uppercase text-[#5A6B4F]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#5A6B4F]" aria-hidden="true" />
            {pick(ONLINE, lang)}
          </span>
          <EditableText
            slot="home.cat.help.title"
            defaults={TITLE}
            as="p"
            multiline={false}
            className="font-serif-x text-base md:text-lg text-[#2C2621] leading-tight"
          />
          <EditableText
            slot="home.cat.help.body"
            defaults={BODY}
            as="p"
            multiline={false}
            className="hidden sm:block text-[12px] md:text-sm text-[#5C5248] leading-snug"
          />
        </div>

        {/* CTA → /citaprevia (localised) */}
        <Link
          to={pathFor(lang, "appointment")}
          data-testid="travel-help-widget-cta"
          className="shrink-0 inline-flex items-center gap-2 rounded-full bg-[#2C2621] hover:bg-[#C16542] text-[#FDFBF7] px-4 sm:px-5 py-3 text-[10px] tracking-[0.2em] uppercase transition-colors duration-300"
        >
          <EditableText slot="home.cat.help.cta" defaults={CTA} as="span" multiline={false} className="hidden sm:inline" />
          <ArrowRight className="w-4 h-4 shrink-0" strokeWidth={1.7} />
        </Link>
      </div>
    </div>
  );
};

export default TravelHelpWidget;
