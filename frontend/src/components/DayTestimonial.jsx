/* ============================================================
   DayTestimonial — a compact, day-specific traveller testimonial
   card rendered in the right column of a programme day, just below
   the "Asistente Virtual" / "Contactar" buttons.

   The social proof matches the exact day the visitor is reading
   (keyed by routeId → dayId in lib/dayTestimonials). Every piece of
   copy is CMS-editable via <EditableText> with unique slots per
   trip + day index, so edits never leak across days or trips.

   Renders nothing when the current trip/day has no testimonial
   defined (pilot: only tourAtlasDesierto67 for now).
============================================================ */
import React from "react";
import { Quote, Star, BadgeCheck, MapPin } from "lucide-react";
import { useLanguage, pick } from "@/contexts/LanguageContext";
import EditableText from "@/components/EditableText";
import { getDayTestimonial } from "@/lib/dayTestimonials";

const COPY = {
  eyebrow: { es: "Lo que cuentan del día", en: "What travellers say about this day", fr: "Ce que disent les voyageurs de cette journée" },
  verified: { es: "Viajero verificado", en: "Verified traveller", fr: "Voyageur vérifié" },
};

const asTri = (s) => (s && typeof s === "object" ? s : { es: s, en: s, fr: s });

/* Up to 2 initials from the author name, skipping connectors like "&". */
const initialsOf = (name) =>
  String(name || "")
    .split(/[\s&·]+/)
    .filter((w) => /[a-zA-ZÀ-ÿ]/.test(w))
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");

export default function DayTestimonial({ routeId, dayId, dayIndex, accent = "#C16542" }) {
  const { lang } = useLanguage();
  const data = getDayTestimonial(routeId, dayId);
  if (!data) return null;

  const rating = data.rating || 5;
  const slotBase = `trip.${routeId}.day.${dayIndex}.testimonial`;

  return (
    <div className="mt-6" data-testid={`day-testimonial-${dayId}`}>
      <article
        className="relative overflow-hidden bg-[#F8F2E6] border border-[#2C2621]/10 px-6 py-6 md:px-7 md:py-7"
        style={{
          borderLeft: `3px solid ${accent}`,
          boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.4), 0 22px 46px -28px rgba(26,21,19,0.45)",
        }}
      >
        <div className="absolute inset-0 berber-bg-diamond opacity-[0.05] pointer-events-none" aria-hidden="true" />
        <Quote
          className="absolute -top-3 right-3 w-16 h-16 opacity-[0.08] pointer-events-none"
          style={{ color: accent }}
          strokeWidth={1.2}
          aria-hidden="true"
        />

        {/* eyebrow */}
        <span className="relative inline-flex items-center gap-2 text-[10px] tracking-[0.28em] uppercase" style={{ color: accent }}>
          <Quote className="w-3.5 h-3.5" strokeWidth={1.8} />
          {pick(COPY.eyebrow, lang)}
        </span>

        {/* rating */}
        <div className="relative flex items-center gap-1 mt-3" aria-label={`${rating}/5`} data-testid={`day-testimonial-rating-${dayId}`}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className="w-3.5 h-3.5"
              strokeWidth={1.2}
              style={{ color: "#D4A373", fill: i < rating ? "#D4A373" : "transparent" }}
            />
          ))}
        </div>

        {/* quote */}
        <EditableText
          slot={`${slotBase}.quote`}
          defaults={data.quote}
          as="blockquote"
          className="relative mt-4 font-serif-x text-[16px] md:text-[18px] leading-[1.55] text-[#2C2621] italic"
        />

        {/* author */}
        <div className="relative mt-5 flex items-center gap-3">
          <span
            className="inline-flex items-center justify-center w-9 h-9 rounded-full text-[#FDFBF7] shrink-0 font-serif-x text-[13px]"
            style={{ background: accent }}
            aria-hidden="true"
          >
            {initialsOf(data.author)}
          </span>
          <div className="min-w-0">
            <EditableText
              slot={`${slotBase}.author`}
              defaults={asTri(data.author)}
              as="p"
              multiline={false}
              className="text-[13px] font-semibold text-[#2C2621] leading-tight"
            />
            <span className="flex items-center gap-1.5 mt-0.5 text-[11px] text-[#5C5248]">
              <MapPin className="w-3 h-3 shrink-0" style={{ color: accent }} strokeWidth={1.7} />
              <EditableText
                slot={`${slotBase}.origin`}
                defaults={asTri(data.origin)}
                as="span"
                multiline={false}
              />
            </span>
          </div>
          <span className="ml-auto inline-flex items-center gap-1 text-[10px] tracking-[0.14em] uppercase shrink-0" style={{ color: accent }}>
            <BadgeCheck className="w-3.5 h-3.5" strokeWidth={1.7} />
            <span className="hidden md:inline">{pick(COPY.verified, lang)}</span>
          </span>
        </div>
      </article>
    </div>
  );
}
