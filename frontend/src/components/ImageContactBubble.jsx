/* ============================================================
   ImageContactBubble — a small circular contact widget overlaid
   on each travel-style card image. Closed: a compact Xaluca ball
   with a soft pulse. On click it expands horizontally over the
   photo to reveal a short prompt + a "Solicitar cita" CTA → /citaprevia.

   Rendered as a SIBLING of the image link (not a child) so the two
   never nest <a> tags; clicking the bubble never triggers the card
   navigation. Responsive: the panel width is clamped so it never
   covers too much of the image on mobile.
============================================================ */
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { X, ArrowRight } from "lucide-react";
import { useLanguage, pick } from "@/contexts/LanguageContext";
import { pathFor } from "@/lib/routes";
import monogramaX from "@/assets/monograma-x-white.png";

const TITLE = { es: "¿Necesitas ayuda?", en: "Need a hand?", fr: "Besoin d'aide ?" };
const BODY = {
  es: "Habla con un agente y encuentra tu viaje ideal.",
  en: "Talk to an agent and find your ideal trip.",
  fr: "Parlez à un agent et trouvez votre voyage idéal.",
};
const CTA = { es: "Solicitar cita", en: "Book a call", fr: "Prendre rendez-vous" };
const OPEN_LABEL = { es: "Contactar con un agente", en: "Contact an agent", fr: "Contacter un agent" };
const CLOSE_LABEL = { es: "Cerrar", en: "Close", fr: "Fermer" };

export const ImageContactBubble = ({ slug, zClass = "z-[5]", align = "right" }) => {
  const { lang } = useLanguage();
  const [open, setOpen] = useState(false);

  // Default ("right"): anchored bottom-right, ball on the right, panel grows
  // LEFT (existing behaviour — must stay unchanged everywhere it's used).
  // "left": anchored bottom-left, ball on the left, panel grows RIGHT toward
  // the interior so it never overflows / gets clipped by the left border.
  const isLeft = align === "left";
  const sideCls = isLeft
    ? "bottom-5 left-5 flex-row max-w-[calc(100%-2.5rem)]"
    : "bottom-12 right-4 flex-row-reverse max-w-[calc(100%-2rem)]";

  return (
    <div
      className={`absolute ${sideCls} ${zClass} flex items-end gap-2`}
      data-testid={`image-contact-bubble-${slug}`}
      data-open={open ? "true" : "false"}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Ball toggle (always visible) */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label={pick(open ? CLOSE_LABEL : OPEN_LABEL, lang)}
        data-testid={`image-contact-toggle-${slug}`}
        className="relative shrink-0 w-12 h-12 rounded-full bg-[#C16542] hover:bg-[#A35133] inline-flex items-center justify-center text-[#FDFBF7] border border-[#FDFBF7]/40 shadow-[0_10px_24px_-8px_rgba(0,0,0,0.65)] transition-colors duration-300"
      >
        {!open && (
          <span className="absolute inset-0 rounded-full bg-[#C16542]/40 animate-ping" aria-hidden="true" />
        )}
        {open ? (
          <X className="relative w-4 h-4" strokeWidth={1.9} />
        ) : (
          <img src={monogramaX} alt="Xaluca Tours" className="relative w-6 h-6 object-contain" />
        )}
      </button>

      {/* Expanding panel */}
      <div
        className={`overflow-hidden rounded-2xl bg-[#2C2621]/95 backdrop-blur-md border border-[#FDFBF7]/15 shadow-[0_16px_44px_-20px_rgba(26,21,19,0.85)] transition-all duration-500 ease-out ${
          open ? "max-w-[280px] opacity-100" : "max-w-0 opacity-0 pointer-events-none"
        }`}
      >
        <div className="w-[58vw] max-w-[240px] px-4 py-3">
          <p className="font-serif-x text-sm md:text-base text-[#FDFBF7] leading-tight">{pick(TITLE, lang)}</p>
          <p className="mt-1 text-[11px] md:text-xs text-[#FDFBF7]/85 leading-snug">{pick(BODY, lang)}</p>
          <Link
            to={pathFor(lang, "appointment")}
            data-testid={`image-contact-cta-${slug}`}
            className="mt-2.5 inline-flex items-center gap-1.5 bg-[#C16542] hover:bg-[#A35133] text-[#FDFBF7] px-3.5 py-2 text-[9px] tracking-[0.18em] uppercase transition-colors duration-300 rounded-full"
          >
            {pick(CTA, lang)}
            <ArrowRight className="w-3.5 h-3.5 shrink-0" strokeWidth={1.7} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ImageContactBubble;
