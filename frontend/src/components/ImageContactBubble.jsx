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

/* Official WhatsApp number (digits only for wa.me). Hardcoded for now. */
const WHATSAPP_URL = "https://wa.me/34629415221";

/* Official WhatsApp glyph (brand icon). */
const WhatsAppIcon = ({ className = "" }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.71.306 1.263.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const TITLE = { es: "¿Necesitas ayuda?", en: "Need a hand?", fr: "Besoin d'aide ?" };
const BODY = {
  es: "Habla con un agente y encuentra tu viaje ideal.",
  en: "Talk to an agent and find your ideal trip.",
  fr: "Parlez à un agent et trouvez votre voyage idéal.",
};
const CTA = { es: "Solicitar cita", en: "Book a call", fr: "Prendre rendez-vous" };
const OPEN_LABEL = { es: "Contactar con un agente", en: "Contact an agent", fr: "Contacter un agent" };
const CLOSE_LABEL = { es: "Cerrar", en: "Close", fr: "Fermer" };

export const ImageContactBubble = ({ slug, zClass = "z-[5]", align = "right", vertical = "bottom" }) => {
  const { lang } = useLanguage();
  const [open, setOpen] = useState(false);

  // Default ("right" + "bottom"): anchored bottom-right, ball on the right,
  // panel grows LEFT (existing behaviour — unchanged everywhere it's used).
  // "left": ball on the left, panel grows RIGHT toward the interior (so it
  // never overflows / gets clipped at a left edge). "vertical" places the
  // widget at the top or bottom edge. Content always stays inside the
  // (overflow-hidden) container, with the panel width clamped.
  const isLeft = align === "left";
  const isTop = vertical === "top";
  const flexCls = isLeft ? "flex-row" : "flex-row-reverse";
  const itemsCls = isTop ? "items-start" : "items-end";
  const maxWCls = isLeft ? "max-w-[calc(100%-2.5rem)]" : "max-w-[calc(100%-2rem)]";
  const hPos = isLeft ? "left-5" : "right-4";
  const vPos = isTop ? "top-5" : isLeft ? "bottom-5" : "bottom-12";

  return (
    <div
      className={`absolute ${vPos} ${hPos} ${flexCls} ${itemsCls} ${maxWCls} ${zClass} flex gap-2`}
      data-testid={`image-contact-bubble-${slug}`}
      data-open={open ? "true" : "false"}
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => e.stopPropagation()}
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
          <div className="mt-2.5 flex flex-col gap-2">
            <Link
              to={pathFor(lang, "appointment")}
              data-testid={`image-contact-cta-${slug}`}
              className="inline-flex items-center gap-1.5 bg-[#C16542] hover:bg-[#A35133] text-[#FDFBF7] px-3.5 py-2 text-[9px] tracking-[0.18em] uppercase transition-colors duration-300 rounded-full shadow-[0_6px_16px_-8px_rgba(0,0,0,0.6)]"
            >
              {pick(CTA, lang)}
              <ArrowRight className="w-3.5 h-3.5 shrink-0" strokeWidth={1.7} />
            </Link>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              data-testid={`image-contact-whatsapp-${slug}`}
              className="inline-flex items-center gap-1.5 bg-[#25D366] hover:bg-[#1EBE5A] text-[#FDFBF7] px-3.5 py-2 text-[9px] tracking-[0.18em] uppercase transition-colors duration-300 rounded-full shadow-[0_6px_16px_-8px_rgba(0,0,0,0.6)]"
            >
              <WhatsAppIcon className="w-3.5 h-3.5 shrink-0" />
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageContactBubble;
