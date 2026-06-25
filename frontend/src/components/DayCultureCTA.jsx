/* ============================================================
   DayCultureCTA — a call-to-action card that fills the empty cell
   of the "Bloques culturales destacados" 2-column grid when the
   number of cultural blocks is ODD, balancing the composition.

   Shows the Xaluca monogram as a circular avatar, a short prompt to
   talk to a specialist, and a "Solicitar cita previa" button linking
   to /citaprevia (localised per language). All copy is CMS-editable
   via global slots so one edit applies everywhere.
============================================================ */
import React from "react";
import { Link } from "react-router-dom";
import { CalendarCheck } from "lucide-react";
import { useLanguage, pick } from "@/contexts/LanguageContext";
import { pathFor } from "@/lib/routes";
import EditableText from "@/components/EditableText";
import monogramaX from "@/assets/monograma-x-white.png";

const COPY = {
  eyebrow: { es: "Xaluca Tours · Especialistas", en: "Xaluca Tours · Specialists", fr: "Xaluca Tours · Spécialistes" },
};

const TITLE = {
  es: "¿Tienes alguna duda sobre este viaje?",
  en: "Have any questions about this trip?",
  fr: "Une question sur ce voyage ?",
};
const BODY = {
  es: "Agenda una cita con uno de nuestros especialistas y te ayudaremos a planificar tu viaje de forma personalizada, sin compromiso.",
  en: "Book a call with one of our specialists and we'll help you plan your trip in a personalised way, with no obligation.",
  fr: "Prenez rendez-vous avec l'un de nos spécialistes : nous vous aiderons à planifier votre voyage sur mesure, sans engagement.",
};
const BUTTON = { es: "Solicitar cita previa", en: "Book an appointment", fr: "Prendre rendez-vous" };

export default function DayCultureCTA({ accent = "#C16542" }) {
  const { lang } = useLanguage();
  return (
    <div
      className="relative overflow-hidden bg-[#2C2621] text-[#FDFBF7] border-l-2 p-5 flex flex-col"
      style={{ borderColor: accent }}
      data-testid="day-culture-cta"
    >
      <div className="absolute inset-0 berber-bg-diamond opacity-[0.06] pointer-events-none" aria-hidden="true" />

      <div className="relative flex items-center gap-3">
        <span
          className="inline-flex items-center justify-center w-12 h-12 rounded-full shrink-0 overflow-hidden border-2 border-[#FDFBF7]/30"
          style={{ background: accent }}
        >
          <img src={monogramaX} alt="Xaluca Tours" className="w-7 h-7 object-contain" />
        </span>
        <span className="text-[10px] tracking-[0.24em] uppercase text-[#FDFBF7]/60 leading-snug">
          {pick(COPY.eyebrow, lang)}
        </span>
      </div>

      <EditableText
        slot="program.culture_cta.title"
        defaults={TITLE}
        as="p"
        multiline={false}
        className="relative mt-4 font-serif-x text-base md:text-lg leading-snug"
      />
      <EditableText
        slot="program.culture_cta.body"
        defaults={BODY}
        as="p"
        className="relative mt-2 text-sm text-[#FDFBF7]/70 leading-relaxed"
      />

      <Link
        to={pathFor(lang, "appointment")}
        data-testid="day-culture-cta-button"
        className="relative mt-5 inline-flex items-center gap-2 self-start px-5 py-3 text-[10px] tracking-[0.22em] uppercase transition-all duration-300 hover:opacity-90"
        style={{ background: accent, color: "#FDFBF7" }}
      >
        <CalendarCheck className="w-4 h-4" strokeWidth={1.7} />
        <EditableText slot="program.culture_cta.button" defaults={BUTTON} as="span" multiline={false} />
      </Link>
    </div>
  );
}
