/* ============================================================
   DayTravelNotes — a compact, swipeable carousel of post-it style
   "travel notes" shown UNDER each day's image gallery (left column of
   a programme day). Three independent notes per day, each one telling
   something specific about that day's places, tips, culture, food or
   photo opportunities.

   Visual language matches TripPackingNotes (aged paper, washi tape,
   pushpin, handwritten font) but every piece of copy is individually
   editable from the CMS via <EditableText>, with unique slots per
   day + per programme, so edits never leak across days or trips.

   Content defaults live in lib/dayTravelNotes. Renders nothing when
   the current trip / day has no notes defined.
============================================================ */
import React, { useRef, useState, useCallback } from "react";
import { Star, Lightbulb, Camera, Pin, ChevronLeft, ChevronRight, NotebookPen } from "lucide-react";
import { useLanguage, pick } from "@/contexts/LanguageContext";
import EditableText from "@/components/EditableText";
import { getDayTravelNotes } from "@/lib/dayTravelNotes";

const COPY = {
  eyebrow: { es: "Notas del día", en: "Notes of the day", fr: "Notes du jour" },
  prev: { es: "anterior", en: "previous", fr: "précédente" },
  next: { es: "siguiente", en: "next", fr: "suivante" },
};

// Fixed visual "kind" per note position (icon + accent + paper tint).
const KINDS = [
  { Icon: Star, accent: "#C16542", tint: "#FBF3EC" },      // highlight / don't miss
  { Icon: Lightbulb, accent: "#8A7B3F", tint: "#F7F3E6" }, // tip / curiosity
  { Icon: Camera, accent: "#5E7A6B", tint: "#ECF2EE" },    // photo / culture / flavour
];

const Note = ({ note, lang, index, slotBase }) => {
  const kind = KINDS[index % KINDS.length];
  const { Icon, accent, tint } = kind;
  const rotation = index % 2 === 0 ? "rotate-[-1.3deg]" : "rotate-[1.1deg]";
  return (
    <article
      data-testid={`day-note-${index}`}
      className={`relative shrink-0 snap-center w-[80vw] sm:w-[260px] md:w-[280px] ${rotation} transition-transform duration-500 hover:rotate-0`}
    >
      {/* washi tape */}
      <span
        aria-hidden="true"
        className="postcard-tape absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-6 rotate-[-3deg] z-20"
      />
      <div
        className="relative h-full overflow-hidden border border-[#2C2621]/12 shadow-[0_22px_46px_-24px_rgba(26,21,19,0.5)] px-5 pt-8 pb-6"
        style={{ background: tint, boxShadow: `inset 0 0 0 1px rgba(255,255,255,0.4), 0 22px 46px -24px rgba(26,21,19,0.5)` }}
      >
        <div className="absolute inset-0 berber-bg-diamond opacity-[0.05] pointer-events-none" aria-hidden="true" />
        {/* pushpin */}
        <span
          aria-hidden="true"
          className="absolute top-3 right-3 inline-flex items-center justify-center w-6 h-6 rounded-full shadow-[0_2px_5px_rgba(26,21,19,0.35)]"
          style={{ background: accent }}
        >
          <Pin className="w-3 h-3 text-[#FDFBF7]" strokeWidth={2} fill="currentColor" />
        </span>

        {/* tagline */}
        <span className="inline-flex items-center gap-2 text-[10px] tracking-[0.28em] uppercase" style={{ color: accent }}>
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
          className="font-hand text-[26px] md:text-[28px] leading-[1.05] text-[#2C2621] mt-2 pr-5"
        />

        <span className="block w-12 h-px mt-3 mb-3" style={{ background: `${accent}66` }} />

        <EditableText
          slot={`${slotBase}.body`}
          defaults={note.body}
          as="p"
          className="font-hand text-[18px] md:text-[19px] leading-[1.4] text-[#2C2621]/90"
        />
      </div>
    </article>
  );
};

export default function DayTravelNotes({ routeId, dayId, dayIndex }) {
  const { lang } = useLanguage();
  const notes = getDayTravelNotes(routeId, dayIndex);
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
    let nearest = 0;
    let best = Infinity;
    Array.from(el.children).forEach((c, i) => {
      const d = Math.abs(c.offsetLeft - el.offsetLeft - el.scrollLeft);
      if (d < best) { best = d; nearest = i; }
    });
    setActive(nearest);
  }, []);

  if (!notes || notes.length === 0) return null;

  // Unique, stable slot namespace per trip + day index (1-based).
  const slotFor = (i) => `program.${routeId}.day.${dayIndex}.note.${i}`;

  return (
    <div className="mt-7" data-testid={`day-travel-notes-${dayId}`}>
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-2">
        <span className="inline-flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase text-[#C16542] font-semibold">
          <NotebookPen className="w-3.5 h-3.5" strokeWidth={1.7} />
          {pick(COPY.eyebrow, lang)}
        </span>
        <div className="hidden sm:flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => goTo(active - 1)}
            disabled={active === 0}
            data-testid={`day-notes-prev-${dayId}`}
            aria-label={pick(COPY.prev, lang)}
            className="inline-flex items-center justify-center w-8 h-8 border border-[#2C2621]/20 text-[#2C2621] hover:bg-[#2C2621] hover:text-[#FDFBF7] hover:border-[#2C2621] transition-colors disabled:opacity-30 disabled:pointer-events-none"
          >
            <ChevronLeft className="w-3.5 h-3.5" strokeWidth={1.7} />
          </button>
          <button
            type="button"
            onClick={() => goTo(active + 1)}
            disabled={active === notes.length - 1}
            data-testid={`day-notes-next-${dayId}`}
            aria-label={pick(COPY.next, lang)}
            className="inline-flex items-center justify-center w-8 h-8 border border-[#2C2621]/20 text-[#2C2621] hover:bg-[#2C2621] hover:text-[#FDFBF7] hover:border-[#2C2621] transition-colors disabled:opacity-30 disabled:pointer-events-none"
          >
            <ChevronRight className="w-3.5 h-3.5" strokeWidth={1.7} />
          </button>
        </div>
      </div>

      {/* Sticky-note rail */}
      <div
        ref={trackRef}
        onScroll={onScroll}
        data-testid={`day-notes-track-${dayId}`}
        className="flex gap-4 md:gap-5 overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar pt-3 pb-2 -mx-1 px-1"
      >
        {notes.map((note, i) => (
          <Note key={`day-note-${i}`} note={note} lang={lang} index={i} slotBase={slotFor(i)} />
        ))}
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-2 mt-3" data-testid={`day-notes-dots-${dayId}`}>
        {notes.map((_, i) => (
          <button
            key={`dn-dot-${i}`}
            type="button"
            onClick={() => goTo(i)}
            data-testid={`day-notes-dot-${dayId}-${i}`}
            aria-label={`${pick(COPY.eyebrow, lang)} ${i + 1}`}
            aria-current={active === i}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              active === i ? "w-6 bg-[#C16542]" : "w-1.5 bg-[#2C2621]/20 hover:bg-[#2C2621]/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
