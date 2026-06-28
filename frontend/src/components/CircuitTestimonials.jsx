/* ============================================================
   CircuitTestimonials — rotating traveller-review carousel shown
   in the right panel of the home "Nuestros circuitos por Marruecos"
   tabbed section, filling the whitespace below each circuit blurb.

   Same visual language as the trip-page testimonials (DayTestimonial):
   parchment card, accent left border, quote, stars, author. Adds a
   compact carousel (auto-rotate + dots) and refreshes its content
   whenever the active circuit (slug) changes.
============================================================ */
import React, { useEffect, useState } from "react";
import { Quote, Star, BadgeCheck, MapPin } from "lucide-react";
import { useLanguage, pick } from "@/contexts/LanguageContext";
import { getCircuitTestimonials } from "@/lib/circuitTestimonials";

const COPY = {
  eyebrow: { es: "Lo que cuentan los viajeros", en: "What travellers say", fr: "Ce que disent les voyageurs" },
  verified: { es: "Viajero verificado", en: "Verified traveller", fr: "Voyageur vérifié" },
};

const asTri = (s) => (s && typeof s === "object" ? s : { es: s, en: s, fr: s });

const initialsOf = (name) =>
  String(name || "")
    .split(/[\s&·]+/)
    .filter((w) => /[a-zA-ZÀ-ÿ]/.test(w))
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");

const ROTATE_MS = 6500;

export default function CircuitTestimonials({ slug, accent = "#C16542" }) {
  const { lang } = useLanguage();
  const items = getCircuitTestimonials(slug);
  const count = items.length;
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);

  // Refresh to the first review whenever the active circuit changes.
  useEffect(() => { setIdx(0); }, [slug]);

  // Auto-rotate (pauses on hover).
  useEffect(() => {
    if (count <= 1 || paused) return;
    const id = setInterval(() => setIdx((i) => (i + 1) % count), ROTATE_MS);
    return () => clearInterval(id);
  }, [count, paused, slug]);

  if (!count) return null;

  const data = items[Math.min(idx, count - 1)];
  const rating = data.rating || 5;

  return (
    <div
      className="mt-6"
      data-testid={`circuit-testimonial-${slug}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <article
        className="relative overflow-hidden bg-[#F8F2E6] border border-[#2C2621]/10 px-5 py-5 md:px-6 md:py-6"
        style={{
          borderLeft: `3px solid ${accent}`,
          boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.4), 0 22px 46px -28px rgba(26,21,19,0.45)",
        }}
      >
        <div className="absolute inset-0 berber-bg-diamond opacity-[0.05] pointer-events-none" aria-hidden="true" />
        <Quote
          className="absolute -top-3 right-3 w-14 h-14 opacity-[0.08] pointer-events-none"
          style={{ color: accent }}
          strokeWidth={1.2}
          aria-hidden="true"
        />

        {/* eyebrow + dots */}
        <div className="relative flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-2 text-[10px] tracking-[0.26em] uppercase" style={{ color: accent }}>
            <Quote className="w-3.5 h-3.5" strokeWidth={1.8} />
            {pick(COPY.eyebrow, lang)}
          </span>
          {count > 1 && (
            <div className="flex items-center gap-1.5 shrink-0" role="tablist" aria-label="testimonials">
              {items.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Ver testimonio ${i + 1}`}
                  aria-current={i === idx}
                  data-testid={`circuit-testimonial-dot-${slug}-${i}`}
                  onClick={() => setIdx(i)}
                  className="w-1.5 h-1.5 rounded-full transition-all duration-300"
                  style={{ backgroundColor: i === idx ? accent : "rgba(44,38,33,0.2)", transform: i === idx ? "scale(1.35)" : "none" }}
                />
              ))}
            </div>
          )}
        </div>

        {/* animated body (re-enters on each change) */}
        <div key={`${slug}-${idx}`} className="landmark-carousel-enter">
          {/* rating */}
          <div className="relative flex items-center gap-1 mt-3" aria-label={`${rating}/5`} data-testid={`circuit-testimonial-rating-${slug}`}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="w-3.5 h-3.5" strokeWidth={1.2}
                style={{ color: "#D4A373", fill: i < rating ? "#D4A373" : "transparent" }} />
            ))}
          </div>

          {/* quote */}
          <blockquote className="relative mt-3 font-serif-x text-[15px] md:text-[17px] leading-[1.5] text-[#2C2621] italic" data-testid={`circuit-testimonial-quote-${slug}`}>
            {`“${pick(asTri(data.quote), lang)}”`}
          </blockquote>

          {/* author */}
          <div className="relative mt-4 flex items-center gap-3">
            <span
              className="inline-flex items-center justify-center w-9 h-9 rounded-full text-[#FDFBF7] shrink-0 font-serif-x text-[13px]"
              style={{ background: accent }}
              aria-hidden="true"
            >
              {initialsOf(data.author)}
            </span>
            <div className="min-w-0">
              <p className="text-[13px] font-semibold text-[#2C2621] leading-tight truncate">{data.author}</p>
              <span className="flex items-center gap-1.5 mt-0.5 text-[11px] text-[#5C5248]">
                <MapPin className="w-3 h-3 shrink-0" style={{ color: accent }} strokeWidth={1.7} />
                {pick(asTri(data.origin), lang)}
              </span>
            </div>
            <span className="ml-auto inline-flex items-center gap-1 text-[10px] tracking-[0.14em] uppercase shrink-0" style={{ color: accent }}>
              <BadgeCheck className="w-3.5 h-3.5" strokeWidth={1.7} />
              <span className="hidden lg:inline">{pick(COPY.verified, lang)}</span>
            </span>
          </div>
        </div>
      </article>
    </div>
  );
}
