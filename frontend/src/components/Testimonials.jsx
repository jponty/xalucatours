import React, { useState, useEffect } from "react";
import { Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage, pick } from "@/contexts/LanguageContext";
import { TESTIMONIALS } from "@/lib/data";

export const Testimonials = () => {
  const { t, lang } = useLanguage();
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIdx((p) => (p + 1) % TESTIMONIALS.length), 8000);
    return () => clearInterval(id);
  }, []);

  const current = TESTIMONIALS[idx];

  return (
    <section
      data-testid="testimonials-section"
      className="relative bg-[#FDFBF7] py-24 md:py-32 overflow-hidden"
    >
      <div className="absolute inset-0 berber-bg-diamond opacity-40 pointer-events-none" aria-hidden="true" />
      <div className="relative max-w-5xl mx-auto px-6 md:px-12 text-center">
        <span className="overline">{t("sec_testimonials_overline")}</span>
        <h2 className="font-serif-x text-4xl md:text-5xl lg:text-6xl leading-[1.05] tracking-tight mt-5 text-[#2C2621]">
          {t("sec_testimonials_title")}
        </h2>

        <div className="mt-14 md:mt-20 relative min-h-[320px]">
          <Quote
            className="w-12 h-12 mx-auto text-[#C16542]/40"
            strokeWidth={1.2}
            aria-hidden="true"
          />
          <blockquote
            key={current.id}
            data-testid={`testimonial-${current.id}`}
            className="fade-up mt-8"
          >
            <p className="font-serif-x font-serif-x-italic text-2xl md:text-3xl lg:text-[34px] leading-[1.25] text-[#2C2621] max-w-3xl mx-auto">
              "{pick(current.quote, lang)}"
            </p>
            <footer className="mt-10">
              <p className="font-serif-x text-xl text-[#2C2621]">{current.name}</p>
              <p className="mt-2 text-[10px] tracking-[0.3em] uppercase text-[#5C5248]">
                {pick(current.place, lang)}
              </p>
            </footer>
          </blockquote>
        </div>

        <div className="mt-12 flex items-center justify-center gap-6">
          <button
            onClick={() => setIdx((p) => (p - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)}
            data-testid="testimonial-prev"
            aria-label="Previous"
            className="text-[#2C2621]/60 hover:text-[#C16542] transition-colors"
          >
            <ChevronLeft className="w-5 h-5" strokeWidth={1.5} />
          </button>
          <div className="flex items-center gap-2">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                data-testid={`testimonial-dot-${i}`}
                aria-label={`Go to ${i + 1}`}
                className={`h-px transition-all duration-500 ${
                  i === idx ? "w-10 bg-[#C16542]" : "w-5 bg-[#2C2621]/25"
                }`}
              />
            ))}
          </div>
          <button
            onClick={() => setIdx((p) => (p + 1) % TESTIMONIALS.length)}
            data-testid="testimonial-next"
            aria-label="Next"
            className="text-[#2C2621]/60 hover:text-[#C16542] transition-colors"
          >
            <ChevronRight className="w-5 h-5" strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
