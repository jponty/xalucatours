/* ============================================================
   TripPostcards — 3 handwritten travel postcards shown on every
   individual trip page. Reuses the exact visual language of the
   /viajes postcard (aged paper, tape, postmark, stamp, hand font).
   Content is route-specific and written in first person, as if a
   traveller had sent it home. Trilingual via lib/programPostcards.
============================================================ */
import React, { useRef, useState, useCallback } from "react";
import { Send, Plane, Mail, ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage, pick } from "@/contexts/LanguageContext";
import { getTripPostcards } from "@/lib/programPostcards";
import { Img } from "@/components/Img";

const COPY = {
  eyebrow: { es: "Postales del viaje", en: "Postcards from the journey", fr: "Cartes postales du voyage" },
  title: {
    es: "Recuerdos escritos a mano",
    en: "Handwritten memories",
    fr: "Souvenirs écrits à la main",
  },
  subtitle: {
    es: "Lo que viajeros como tú nos escribieron al volver de esta ruta.",
    en: "What travellers like you wrote to us after this route.",
    fr: "Ce que des voyageurs comme vous nous ont écrit après cet itinéraire.",
  },
};

const Postcard = ({ p, lang, index }) => {
  const rotation = index % 2 === 0 ? "rotate-[-1deg]" : "rotate-[1deg]";
  return (
    <div className="relative pt-4" data-testid={`trip-postcard-${index}`}>
      {/* tape pieces */}
      <span className="postcard-tape absolute top-0 left-10 w-20 h-7 rotate-[-6deg] z-20 hidden sm:block" aria-hidden="true" />
      <span className="postcard-tape absolute top-0 right-12 w-16 h-7 rotate-[5deg] z-20 hidden sm:block" aria-hidden="true" />

      <article className={`postcard-paper relative overflow-hidden border border-[#2C2621]/15 shadow-[0_30px_60px_-25px_rgba(26,21,19,0.45)] ${rotation} transition-transform duration-500 hover:rotate-0`}>
        <div className="absolute inset-0 berber-bg-diamond opacity-[0.05] pointer-events-none" aria-hidden="true" />

        {/* header strip */}
        <div className="relative flex flex-wrap items-center justify-between gap-2 px-6 md:px-10 pt-6">
          <span className="inline-flex items-center gap-2 text-[10px] tracking-[0.35em] uppercase text-[#A07042]">
            <Send className="w-3.5 h-3.5" strokeWidth={1.6} /> {pick(p.label, lang)}
          </span>
          <span className="font-hand text-2xl md:text-3xl text-[#C16542] -rotate-2">{pick(p.tagline, lang)}</span>
        </div>

        <div className="mx-6 md:mx-10 mt-4 border-t border-dashed border-[#2C2621]/20" />

        <div className="relative grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10 px-6 md:px-10 py-8 md:py-10">
          {/* message side */}
          <div className="md:col-span-8 order-2 md:order-1">
            <p className="font-hand text-3xl md:text-4xl text-[#3A2E26] leading-tight mb-3" data-testid={`trip-postcard-greeting-${index}`}>
              {pick(p.greeting, lang)}
            </p>
            <div className="space-y-4">
              {p.body.map((para, i) => (
                <p key={`pc-${index}-${i}`} className="font-hand text-[22px] md:text-[26px] leading-[1.5] text-[#2C2621]/90">
                  {pick(para, lang)}
                </p>
              ))}
            </div>
            <p className="font-hand text-2xl md:text-3xl text-[#5A6B4F] mt-6">{pick(p.closing, lang)}</p>
            <p className="font-hand text-4xl md:text-5xl text-[#C16542] mt-1 -rotate-2" data-testid={`trip-postcard-signature-${index}`}>
              {p.signature}
            </p>
          </div>

          {/* stamp + postmark side */}
          <div className="md:col-span-4 order-1 md:order-2 md:border-l md:border-dashed md:border-[#2C2621]/20 md:pl-8 flex flex-col items-center md:items-end gap-7">
            <div className="relative">
              <div className="relative w-28 rotate-3 bg-[#FDFBF7] p-[5px] shadow-[0_3px_12px_rgba(26,21,19,0.28)]">
                <div className="relative overflow-hidden bg-[#1A1513]" style={{ aspectRatio: "7 / 8" }}>
                  <Img
                    src={p.stamp}
                    alt={pick(p.stamp_caption, lang)}
                    width={320}
                    sizes="112px"
                    className="block w-full h-full object-cover"
                  />
                </div>
                <span className="absolute inset-0 border border-dashed border-[#2C2621]/30 pointer-events-none" aria-hidden="true" />
              </div>
              {/* postmark overlapping the stamp */}
              <div className="postcard-postmark absolute -bottom-5 -left-7 w-24 h-24 rounded-full flex flex-col items-center justify-center text-center bg-[#F6EEDC]/40">
                <span className="text-[7px] tracking-[0.2em] uppercase leading-tight">Xaluca Tours</span>
                <Plane className="w-4 h-4 my-0.5" strokeWidth={1.4} />
                <span className="text-[10px] font-semibold tracking-[0.12em]">{p.postmark}</span>
              </div>
            </div>
            <p className="font-hand text-xl text-[#2C2621]/65 text-center md:text-right mt-2">{pick(p.stamp_caption, lang)}</p>
          </div>
        </div>
      </article>
    </div>
  );
};

export default function TripPostcards({ routeId }) {
  const { lang } = useLanguage();
  const postcards = getTripPostcards(routeId);
  const scrollerRef = useRef(null);
  const [active, setActive] = useState(0);

  const goTo = useCallback(
    (i) => {
      const el = scrollerRef.current;
      if (!el) return;
      const idx = Math.max(0, Math.min((postcards?.length || 1) - 1, i));
      const slide = el.children[idx];
      if (slide) el.scrollTo({ left: slide.offsetLeft - el.offsetLeft, behavior: "smooth" });
      setActive(idx);
    },
    [postcards]
  );

  const onScroll = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    setActive(Math.round(el.scrollLeft / el.clientWidth));
  }, []);

  if (!postcards || postcards.length === 0) return null;

  const navLabel = { es: "anterior", en: "previous", fr: "précédente" };
  const nextLabel = { es: "siguiente", en: "next", fr: "suivante" };

  return (
    <section
      id="postcards"
      data-testid="trip-postcards"
      className="relative bg-[#FDFBF7] py-20 md:py-28 overflow-hidden"
    >
      <div className="absolute inset-0 berber-bg-cross opacity-[0.4] pointer-events-none" aria-hidden="true" />

      <div className="relative max-w-5xl mx-auto px-6 md:px-12 text-center mb-12 md:mb-14">
        <span className="inline-flex items-center gap-2.5 text-[11px] tracking-[0.35em] uppercase text-[#C16542] font-semibold">
          <Mail className="w-3.5 h-3.5" strokeWidth={1.6} />
          {pick(COPY.eyebrow, lang)}
        </span>
        <h2 className="font-serif-x text-4xl md:text-5xl leading-[1.05] tracking-tight mt-5 text-[#2C2621]">
          {pick(COPY.title, lang)}
        </h2>
        <p className="mt-5 text-base md:text-lg text-[#5C5248] leading-relaxed max-w-2xl mx-auto">
          {pick(COPY.subtitle, lang)}
        </p>
      </div>

      {/* Horizontal slider */}
      <div className="relative max-w-4xl mx-auto px-4 sm:px-10 md:px-14">
        {/* prev / next arrows */}
        <button
          type="button"
          onClick={() => goTo(active - 1)}
          disabled={active === 0}
          data-testid="trip-postcards-prev"
          aria-label={pick(navLabel, lang)}
          className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 z-30 items-center justify-center w-11 h-11 rounded-full bg-[#FDFBF7] border border-[#2C2621]/15 text-[#2C2621] shadow-[0_8px_24px_-10px_rgba(26,21,19,0.4)] transition-all hover:bg-[#C16542] hover:text-[#FDFBF7] hover:border-[#C16542] disabled:opacity-0 disabled:pointer-events-none"
        >
          <ChevronLeft className="w-5 h-5" strokeWidth={1.6} />
        </button>
        <button
          type="button"
          onClick={() => goTo(active + 1)}
          disabled={active === postcards.length - 1}
          data-testid="trip-postcards-next"
          aria-label={pick(nextLabel, lang)}
          className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 z-30 items-center justify-center w-11 h-11 rounded-full bg-[#FDFBF7] border border-[#2C2621]/15 text-[#2C2621] shadow-[0_8px_24px_-10px_rgba(26,21,19,0.4)] transition-all hover:bg-[#C16542] hover:text-[#FDFBF7] hover:border-[#C16542] disabled:opacity-0 disabled:pointer-events-none"
        >
          <ChevronRight className="w-5 h-5" strokeWidth={1.6} />
        </button>

        <div
          ref={scrollerRef}
          onScroll={onScroll}
          data-testid="trip-postcards-track"
          className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar"
        >
          {postcards.map((p, i) => (
            <div key={`trip-pc-${i}`} className="snap-center shrink-0 w-full px-2 pb-6">
              <Postcard p={p} lang={lang} index={i} />
            </div>
          ))}
        </div>
      </div>

      {/* dots */}
      <div className="relative flex justify-center gap-2.5 mt-6" data-testid="trip-postcards-dots">
        {postcards.map((_, i) => (
          <button
            key={`dot-${i}`}
            type="button"
            onClick={() => goTo(i)}
            data-testid={`trip-postcards-dot-${i}`}
            aria-label={`${pick(COPY.eyebrow, lang)} ${i + 1}`}
            aria-current={active === i}
            className={`h-2 rounded-full transition-all duration-300 ${
              active === i ? "w-7 bg-[#C16542]" : "w-2 bg-[#2C2621]/20 hover:bg-[#2C2621]/40"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
