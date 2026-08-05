/* ============================================================
   ImageContactBubble — a small circular contact widget overlaid
   on each travel-style card image. Closed: a compact Xaluca ball
   with a soft pulse. On click it opens an accessible modal with a
   short prompt + a "Solicitar cita" CTA → /citaprevia.

   Rendered as a SIBLING of the image link (not a child) so the two
   never nest <a> tags; clicking the bubble never triggers the card
   navigation. The modal is portalled to document.body so it is not
   clipped by image containers with overflow hidden.
============================================================ */
import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { X, ArrowRight } from "lucide-react";
import { useLanguage, pick } from "@/contexts/LanguageContext";
import { pathFor } from "@/lib/routes";
import monogramaX from "@/assets/monograma-x-white.png";
import { WhatsAppIcon, WHATSAPP_URL } from "@/components/WhatsAppIcon";

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
  const modalRef = useRef(null);
  const triggerRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    const previousOverflow = document.body.style.overflow;
    const previouslyFocused = document.activeElement;
    document.body.style.overflow = "hidden";

    window.requestAnimationFrame(() => {
      modalRef.current?.querySelector("button")?.focus();
    });

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
        return;
      }

      if (event.key !== "Tab" || !modalRef.current) return;
      const focusable = Array.from(
        modalRef.current.querySelectorAll('button, a[href], [tabindex]:not([tabindex="-1"])')
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus?.();
    };
  }, [open]);

  const isLeft = align === "left";
  const isTop = vertical === "top";
  const hPos = isLeft ? "left-5" : "right-4";
  const vPos = isTop ? "top-5" : isLeft ? "bottom-5" : "bottom-12";
  const modalTitleId = `image-contact-title-${slug}`;
  const modalBodyId = `image-contact-body-${slug}`;

  return (
    <>
      <div
        className={`absolute ${vPos} ${hPos} ${zClass}`}
        data-testid={`image-contact-bubble-${slug}`}
        data-open={open ? "true" : "false"}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setOpen(true)}
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-controls={`image-contact-modal-${slug}`}
          aria-label={pick(OPEN_LABEL, lang)}
          data-testid={`image-contact-toggle-${slug}`}
          className="relative shrink-0 w-12 h-12 rounded-full bg-[#C16542] hover:bg-[#A35133] inline-flex items-center justify-center text-[#FDFBF7] border border-[#FDFBF7]/40 shadow-[0_10px_24px_-8px_rgba(0,0,0,0.65)] transition-all duration-300 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FDFBF7] focus-visible:ring-offset-2 focus-visible:ring-offset-[#C16542]"
        >
          {!open && (
            <span className="absolute inset-0 rounded-full bg-[#C16542]/40 animate-ping" aria-hidden="true" />
          )}
          <img src={monogramaX} alt="Xaluca Tours" className="relative w-6 h-6 object-contain" />
        </button>
      </div>

      {open && createPortal(
        <div
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-[#1A1513]/70 backdrop-blur-sm px-5 py-8"
          data-testid={`image-contact-modal-backdrop-${slug}`}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setOpen(false);
          }}
        >
          <div
            ref={modalRef}
            id={`image-contact-modal-${slug}`}
            role="dialog"
            aria-modal="true"
            aria-labelledby={modalTitleId}
            aria-describedby={modalBodyId}
            data-testid={`image-contact-modal-${slug}`}
            className="relative w-full max-w-[360px] rounded-2xl border border-[#FDFBF7]/15 bg-[#2C2621]/95 px-5 py-5 text-[#FDFBF7] shadow-[0_24px_70px_-20px_rgba(26,21,19,0.9)] backdrop-blur-md sm:px-6 sm:py-6"
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label={pick(CLOSE_LABEL, lang)}
              data-testid={`image-contact-close-${slug}`}
              className="absolute right-3 top-3 inline-flex h-12 w-12 items-center justify-center rounded-full border border-[#FDFBF7]/70 bg-[#C16542] text-[#FDFBF7] shadow-[0_10px_24px_-8px_rgba(0,0,0,0.65)] transition-all hover:scale-105 hover:bg-[#A35133] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FDFBF7] sm:-bottom-5 sm:-right-5 sm:top-auto"
            >
              <X className="h-4 w-4" strokeWidth={1.8} />
            </button>

            <h2 id={modalTitleId} className="pr-14 font-serif-x text-xl leading-tight sm:pr-0 sm:text-2xl">
              {pick(TITLE, lang)}
            </h2>
            <p id={modalBodyId} className="mt-2 pr-12 text-xs leading-relaxed text-[#FDFBF7]/85 sm:pr-0 sm:text-sm">
              {pick(BODY, lang)}
            </p>

            <div className="mt-4 flex items-center gap-2.5">
              <Link
                to={pathFor(lang, "appointment")}
                onClick={() => setOpen(false)}
                data-testid={`image-contact-cta-${slug}`}
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full bg-[#C16542] px-5 py-2.5 text-[9px] uppercase tracking-[0.18em] text-[#FDFBF7] transition-colors hover:bg-[#A35133] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FDFBF7]"
              >
                {pick(CTA, lang)}
                <ArrowRight className="h-3.5 w-3.5 shrink-0" strokeWidth={1.7} />
              </Link>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                data-testid={`image-contact-whatsapp-${slug}`}
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#25D366] text-[#FDFBF7] transition-colors hover:bg-[#1EBE5A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FDFBF7]"
              >
                <WhatsAppIcon className="h-4 w-4 shrink-0" />
              </a>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default ImageContactBubble;
