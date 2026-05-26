import React from "react";
import {
  Sparkles, UtensilsCrossed, Flame, HandHeart, Mountain, ArrowRight,
} from "lucide-react";
import { useLanguage, pick } from "@/contexts/LanguageContext";
import { EXPERIENCES } from "@/lib/data";

const ICONS = {
  Sparkles, UtensilsCrossed, Flame, HandHeart, Mountain,
};

export const CulturalExperiences = () => {
  const { t, lang } = useLanguage();

  return (
    <section
      id="culture"
      data-testid="cultural-experiences-section"
      className="relative bg-[#F2EBE1] py-24 md:py-32 overflow-hidden"
    >
      <div className="absolute inset-0 berber-bg-diamond opacity-60 pointer-events-none" aria-hidden="true" />
      <div className="relative max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
          <div className="md:col-span-7">
            <span className="overline">{t("sec_culture_overline")}</span>
            <h2 className="font-serif-x text-4xl md:text-5xl lg:text-6xl leading-[1.05] tracking-tight mt-5 text-[#2C2621]">
              {t("sec_culture_title")}
            </h2>
          </div>
          <div className="md:col-span-5">
            <p className="text-base md:text-lg text-[#5C5248] leading-relaxed">
              {t("sec_culture_sub")}
            </p>
          </div>
        </div>

        <div className="mt-16 md:mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#2C2621]/10 border border-[#2C2621]/10">
          {EXPERIENCES.map((e) => {
            const Icon = ICONS[e.icon] || Sparkles;
            return (
              <article
                key={e.slug}
                data-testid={`experience-tile-${e.slug}`}
                className="group relative overflow-hidden bg-[#FDFBF7] hover:bg-white transition-colors duration-500 p-8 md:p-10 flex flex-col h-full min-h-[420px]"
              >
                <div className="relative h-44 overflow-hidden mb-7 bg-[#F2EBE1]">
                  <img
                    src={e.image}
                    alt={pick(e.title, lang)}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover opacity-90 transition-all duration-700 group-hover:opacity-100 group-hover:scale-105"
                  />
                </div>

                <div className="flex items-center gap-3 mb-5">
                  <span
                    className="inline-flex items-center justify-center w-10 h-10 rounded-full border"
                    style={{ borderColor: `${e.accent}55`, color: e.accent }}
                  >
                    <Icon className="w-4 h-4" strokeWidth={1.5} />
                  </span>
                  <span
                    className="text-[10px] tracking-[0.3em] uppercase"
                    style={{ color: e.accent }}
                  >
                    Encounter
                  </span>
                </div>

                <h3 className="font-serif-x text-2xl md:text-[26px] leading-[1.1] text-[#2C2621]">
                  {pick(e.title, lang)}
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-[#5C5248] flex-1">
                  {pick(e.summary, lang)}
                </p>

                <a
                  href="#contact"
                  data-testid={`experience-cta-${e.slug}`}
                  className="mt-6 inline-flex items-center gap-2 text-[10px] tracking-[0.25em] uppercase text-[#2C2621] border-b border-[#2C2621]/30 pb-1 self-start hover:border-[#C16542] hover:text-[#C16542] transition-colors"
                >
                  {t("cta_discover")}
                  <ArrowRight className="w-3 h-3" strokeWidth={1.5} />
                </a>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CulturalExperiences;
