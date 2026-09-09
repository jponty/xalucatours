import React, { useEffect, useId, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, ChevronDown, Compass } from "lucide-react";
import { pick } from "@/contexts/LanguageContext";

const COPY = {
  more: { es: "Más información", en: "More information", fr: "Plus d’informations" },
  less: { es: "Menos información", en: "Less information", fr: "Moins d’informations" },
  preview: { es: "El viaje, de un vistazo", en: "The journey at a glance", fr: "Le voyage en un coup d’œil" },
  program: { es: "Ver programa completo", en: "View full itinerary", fr: "Voir le programme complet" },
};

// Tablets (including landscape) and devices without a fine hover pointer must
// never depend on hover to discover the description or its CTA.
const DESKTOP_HOVER = "(min-width: 1025px) and (hover: hover) and (pointer: fine)";

/** Shared, in-flow extension: keep each card's existing content and controls. */
export default function ExpandableTripCard({
  children, title, titleId, href, description, destinations = [], lang,
  ctaLabel, testIdPrefix, testIds = {}, className = "",
}) {
  const [hoverEnabled, setHoverEnabled] = useState(() =>
    typeof window !== "undefined" && Boolean(window.matchMedia?.(DESKTOP_HOVER).matches)
  );
  const [hovered, setHovered] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const leaveTimer = useRef(null);
  const panelRef = useRef(null);
  const toggleRef = useRef(null);
  const panelId = `${useId()}-details`;
  const open = !hoverEnabled || hovered || expanded;
  const testId = (key) => testIds[key] || `${testIdPrefix}-${key}`;
  const L = (key) => pick(COPY[key], lang);

  useEffect(() => {
    const media = window.matchMedia?.(DESKTOP_HOVER);
    if (!media) return undefined;
    const update = () => {
      clearTimeout(leaveTimer.current);
      setHoverEnabled(media.matches);
      setHovered(false);
      // A resize must not hide the link the user is navigating with a keyboard.
      setExpanded(media.matches && Boolean(panelRef.current?.contains(document.activeElement)));
    };
    update();
    media.addEventListener?.("change", update);
    return () => {
      clearTimeout(leaveTimer.current);
      media.removeEventListener?.("change", update);
    };
  }, []);

  const close = () => {
    clearTimeout(leaveTimer.current);
    if (panelRef.current?.contains(document.activeElement)) toggleRef.current?.focus();
    setHovered(false);
    setExpanded(false);
  };
  const enter = (event) => {
    if (!hoverEnabled || event.pointerType !== "mouse" || !event.currentTarget.contains(event.target)) return;
    clearTimeout(leaveTimer.current);
    // Only the photo opens the extension. Once open, the whole card remains a
    // safe hover area so the pointer can reach the description and its link.
    if (event.target.closest?.("[data-trip-card-image]")) setHovered(true);
  };
  const leave = () => {
    if (!hoverEnabled) return;
    clearTimeout(leaveTimer.current);
    leaveTimer.current = setTimeout(() => {
      // Moving the pointer must not hide a keyboard-focused CTA.
      if (panelRef.current?.contains(document.activeElement)) setExpanded(true);
      setHovered(false);
    }, 160);
  };

  return (
    <article
      data-testid={testId("card")} data-expanded={open}
      aria-labelledby={titleId} aria-label={titleId ? undefined : title}
      onPointerOver={enter} onPointerLeave={leave}
      onKeyDown={(event) => {
        // Dialogs rendered through portals own their Escape key, even though
        // React bubbles their events through the card's component tree.
        if (event.key === "Escape" && hoverEnabled && open && event.currentTarget.contains(event.target)) {
          event.stopPropagation();
          close();
        }
      }}
      className={`group relative flex w-full min-w-0 flex-col self-start overflow-hidden border bg-[#FDFBF7] transition-[border-color,box-shadow] duration-300 motion-reduce:transition-none ${open ? "border-[#C16542]/50 shadow-[0_28px_54px_-30px_rgba(26,21,19,0.5)]" : "border-[#2C2621]/10 hover:border-[#C16542]/40"} ${className}`}
    >
      {children}
      {hoverEnabled && <button ref={toggleRef} type="button" aria-expanded={open} aria-controls={panelId}
        aria-label={`${L(open ? "less" : "more")} · ${title}`} data-testid={testId("more")}
        onClick={() => { if (open) close(); else { clearTimeout(leaveTimer.current); setExpanded(true); } }}
        className="sr-only focus-visible:not-sr-only focus-visible:flex focus-visible:min-h-11 focus-visible:w-full focus-visible:items-center focus-visible:justify-between focus-visible:gap-3 focus-visible:border-t focus-visible:px-5 focus-visible:py-3 text-left text-[10px] font-medium uppercase tracking-[0.18em] text-[#9C482C] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#C16542]">
        {L(open ? "less" : "more")}<ChevronDown aria-hidden="true" className={`h-4 w-4 shrink-0 transition-transform duration-300 motion-reduce:transition-none ${open ? "rotate-180" : ""}`} />
      </button>}
      <div ref={panelRef} id={panelId} role="region" aria-labelledby={titleId} aria-label={titleId ? undefined : title}
        aria-hidden={!open} inert={!open} data-testid={testId("details")}
        className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out motion-reduce:transition-none ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
        <div className="min-h-0 min-w-0 overflow-hidden">
          <div className="border-t border-[#C16542]/25 bg-[#F2EBE1] p-4 sm:p-5">
            <p className="flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#9C482C]"><Compass className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />{L("preview")}</p>
            <p className="mt-3 break-words text-[13px] leading-[1.75] text-[#5C5248]" data-testid={testId("description")}>{description}</p>
            {destinations.length > 0 && <ul className="mt-4 flex flex-wrap gap-1.5">{destinations.map((name) => <li key={name} className="min-w-0 max-w-full break-words border border-[#A07042]/20 bg-[#FDFBF7]/60 px-2 py-1 text-[10px] leading-relaxed text-[#74604D]">{name}</li>)}</ul>}
            <Link to={href} tabIndex={open ? undefined : -1} data-testid={testId("details-cta")}
              className="mt-5 flex min-h-11 items-center justify-between gap-3 bg-[#2C2621] px-4 py-3 text-[10px] font-medium uppercase tracking-[0.16em] text-[#FDFBF7] transition-colors hover:bg-[#C16542] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C16542]">
              <span className="min-w-0 break-words">{ctaLabel || L("program")}</span><ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
