/* ============================================================
   TripPackingNotes — a horizontal carousel of sticky-note / post-it
   travel notes shown UNDER the route map (left column of TripRouteMap).
   Reinterprets the postcard language as a personal travel notebook:
   aged paper, washi tape, a pushpin and a handwritten font, written
   as recommendations from someone who already did the route.

   Content is route-specific (lib/tripPackingNotes). Renders nothing
   when the current trip has no notes defined.
============================================================ */
import React, { useRef, useState, useCallback } from "react";
import { Luggage, Shirt, Sun, Moon, Pin, Check, ChevronLeft, ChevronRight, Footprints, Wind, Mountain, Backpack } from "lucide-react";
import { useLanguage, pick } from "@/contexts/LanguageContext";
import EditableText from "@/components/EditableText";
import { getTripPackingNotes } from "@/lib/tripPackingNotes";

const COPY = {
  eyebrow: { es: "Notas de viaje", en: "Travel notes", fr: "Notes de voyage" },
  title: {
    es: "Prepara tu maleta",
    en: "Pack your bag",
    fr: "Préparez votre valise",
  },
  subtitle: {
    es: "Apuntes a mano de quienes ya han hecho esta ruta — qué llevar para disfrutarla sin sorpresas.",
    en: "Handwritten notes from those who already did this route — what to pack to enjoy it surprise-free.",
    fr: "Notes manuscrites de ceux qui ont déjà fait cet itinéraire — quoi emporter pour en profiter sans surprises.",
  },
  signature: { es: "— Tu equipo Xaluca", en: "— Your Xaluca team", fr: "— Votre équipe Xaluca" },
  prev: { es: "anterior", en: "previous", fr: "précédente" },
  next: { es: "siguiente", en: "next", fr: "suivante" },
};

const THEME_ICON = {
  clothing: Shirt,
  accessories: Sun,
  desert: Moon,
  city: Footprints,
  coast: Wind,
  adventure: Mountain,
  comfort: Backpack,
};

const Note = ({ note, lang, index, routeId }) => {
  const Icon = THEME_ICON[note.theme] || Luggage;
  const rotation = index % 2 === 0 ? "rotate-[-1.4deg]" : "rotate-[1.2deg]";
  const slotBase = `trip.${routeId}.packing.note.${index}`;
  return (
    <article
      data-testid={`packing-note-${index}`}
      className={`relative shrink-0 snap-center w-[82vw] sm:w-[320px] md:w-[330px] ${rotation} transition-transform duration-500 hover:rotate-0`}
    >
      {/* washi tape */}
      <span
        aria-hidden="true"
        className="postcard-tape absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-7 rotate-[-3deg] z-20"
      />
      <div
        className="relative h-full overflow-hidden border border-[#2C2621]/12 shadow-[0_24px_50px_-24px_rgba(26,21,19,0.5)] px-6 pt-9 pb-7"
        style={{ background: note.tint, boxShadow: `inset 0 0 0 1px rgba(255,255,255,0.4), 0 24px 50px -24px rgba(26,21,19,0.5)` }}
      >
        <div className="absolute inset-0 berber-bg-diamond opacity-[0.05] pointer-events-none" aria-hidden="true" />
        {/* pushpin */}
        <span
          aria-hidden="true"
          className="absolute top-3 right-3 inline-flex items-center justify-center w-7 h-7 rounded-full shadow-[0_2px_5px_rgba(26,21,19,0.35)]"
          style={{ background: note.accent }}
        >
          <Pin className="w-3.5 h-3.5 text-[#FDFBF7]" strokeWidth={2} fill="currentColor" />
        </span>

        {/* theme + tagline */}
        <span
          className="inline-flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase"
          style={{ color: note.accent }}
        >
          <Icon className="w-4 h-4" strokeWidth={1.7} />
          <EditableText
            slot={`${slotBase}.tagline`}
            defaults={note.tagline}
            as="span"
            multiline={false}
          />
        </span>

        <EditableText
          slot={`${slotBase}.title`}
          defaults={note.title}
          as="h4"
          multiline={false}
          className="font-hand text-[30px] md:text-[32px] leading-[1.05] text-[#2C2621] mt-2 pr-6"
        />

        <span className="block w-12 h-px mt-3 mb-4" style={{ background: `${note.accent}66` }} />

        <ul className="space-y-3.5">
          {note.items.map((it, i) => (
            <li key={`pn-${index}-${i}`} className="flex items-start gap-2.5">
              <Check className="w-4 h-4 mt-1 shrink-0" style={{ color: note.accent }} strokeWidth={2.2} />
              <EditableText
                slot={`${slotBase}.item.${i}`}
                defaults={it}
                as="span"
                className="font-hand text-[19px] md:text-[20px] leading-[1.35] text-[#2C2621]/90"
              />
            </li>
          ))}
        </ul>

        <p className="font-hand text-[22px] mt-5 -rotate-1" style={{ color: note.accent }}>
          {pick(COPY.signature, lang)}
        </p>
      </div>
    </article>
  );
};

export default function TripPackingNotes({ routeId }) {
  const { lang } = useLanguage();
  const notes = getTripPackingNotes(routeId);
  const trackRef = useRef(null);
  const [active, setActive] = useState(0);

  const goTo = useCallback(
    (i) => {
      const el = trackRef.current;
      if (!el) return;
      const idx = Math.max(0, Math.min((notes?.length || 1) - 1, i));
      const slide = el.children[idx];
      if (slide) el.scrollTo({ left: slide.offsetLeft - el.offsetLeft, behavior: "smooth" });
      setActive(idx);
    },
    [notes]
  );

  const onScroll = useCallback(() => {
    const el = trackRef.current;
    if (!el || !el.children.length) return;
    // Find the slide whose left edge is closest to the scroll position.
    let nearest = 0;
    let best = Infinity;
    Array.from(el.children).forEach((c, i) => {
      const d = Math.abs(c.offsetLeft - el.offsetLeft - el.scrollLeft);
      if (d < best) { best = d; nearest = i; }
    });
    setActive(nearest);
  }, []);

  if (!notes || notes.length === 0) return null;

  return (
    <div className="mt-8 md:mt-10" data-testid="trip-packing-notes">
      {/* Header */}
      <div className="flex items-end justify-between gap-4 mb-5">
        <div>
          <span className="inline-flex items-center gap-2 text-[10px] tracking-[0.32em] uppercase text-[#C16542] font-semibold">
            <Luggage className="w-3.5 h-3.5" strokeWidth={1.7} />
            {pick(COPY.eyebrow, lang)}
          </span>
          <h3 className="font-serif-x text-2xl md:text-[28px] leading-tight tracking-tight mt-2 text-[#2C2621]">
            {pick(COPY.title, lang)}
          </h3>
          <p className="mt-2 text-[13px] md:text-sm text-[#5C5248] leading-relaxed max-w-md">
            {pick(COPY.subtitle, lang)}
          </p>
        </div>
        {/* arrows (desktop) */}
        <div className="hidden sm:flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => goTo(active - 1)}
            disabled={active === 0}
            data-testid="packing-notes-prev"
            aria-label={pick(COPY.prev, lang)}
            className="inline-flex items-center justify-center w-10 h-10 border border-[#2C2621]/20 text-[#2C2621] hover:bg-[#2C2621] hover:text-[#FDFBF7] hover:border-[#2C2621] transition-colors disabled:opacity-30 disabled:pointer-events-none"
          >
            <ChevronLeft className="w-4 h-4" strokeWidth={1.7} />
          </button>
          <button
            type="button"
            onClick={() => goTo(active + 1)}
            disabled={active === notes.length - 1}
            data-testid="packing-notes-next"
            aria-label={pick(COPY.next, lang)}
            className="inline-flex items-center justify-center w-10 h-10 border border-[#2C2621]/20 text-[#2C2621] hover:bg-[#2C2621] hover:text-[#FDFBF7] hover:border-[#2C2621] transition-colors disabled:opacity-30 disabled:pointer-events-none"
          >
            <ChevronRight className="w-4 h-4" strokeWidth={1.7} />
          </button>
        </div>
      </div>

      {/* Sticky-note rail */}
      <div
        ref={trackRef}
        onScroll={onScroll}
        data-testid="packing-notes-track"
        className="flex gap-5 md:gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar pt-4 pb-3 -mx-1 px-1"
      >
        {notes.map((note, i) => (
          <Note key={`packing-${i}`} note={note} lang={lang} index={i} routeId={routeId} />
        ))}
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-2.5 mt-4" data-testid="packing-notes-dots">
        {notes.map((_, i) => (
          <button
            key={`pn-dot-${i}`}
            type="button"
            onClick={() => goTo(i)}
            data-testid={`packing-notes-dot-${i}`}
            aria-label={`${pick(COPY.eyebrow, lang)} ${i + 1}`}
            aria-current={active === i}
            className={`h-2 rounded-full transition-all duration-300 ${
              active === i ? "w-7 bg-[#C16542]" : "w-2 bg-[#2C2621]/20 hover:bg-[#2C2621]/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
