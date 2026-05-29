import React from "react";
import { ArrowRight, MapPin, Clock } from "lucide-react";
import { useLanguage, pick } from "@/contexts/LanguageContext";
import { JOURNEYS } from "@/lib/data";
import FromPrice from "@/components/FromPrice";
import { BerberDiamondDivider } from "./BerberDivider";

export const FeaturedJourneys = () => {
  const { t, lang } = useLanguage();

  return (
    <section
      id="journeys"
      data-testid="featured-journeys-section"
      className="relative bg-[#FDFBF7] py-24 md:py-32 overflow-hidden"
    >
      <div className="absolute inset-0 berber-bg-diamond opacity-50 pointer-events-none" aria-hidden="true" />
      <div className="relative max-w-7xl mx-auto px-6 md:px-12">
        <div className="max-w-3xl">
          <span className="overline">{t("sec_journeys_overline")}</span>
          <h2 className="font-serif-x text-4xl md:text-5xl lg:text-6xl leading-[1.05] tracking-tight mt-5 text-[#2C2621]">
            {t("sec_journeys_title")}
          </h2>
          <p className="mt-6 text-base md:text-lg text-[#5C5248] leading-relaxed max-w-2xl">
            {t("sec_journeys_sub")}
          </p>
        </div>

        <BerberDiamondDivider className="mt-12 mb-12 md:mb-16" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {JOURNEYS.map((j) => (
            <article
              key={j.slug}
              data-testid={`journey-card-${j.slug}`}
              className="group relative bg-white border border-[#2C2621]/10 hover:border-[#2C2621]/30 transition-colors duration-300 flex flex-col overflow-hidden"
            >
              <div className="relative aspect-[16/11] overflow-hidden bg-[#F2EBE1]">
                <img
                  src={j.image}
                  alt={pick(j.title, lang)}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.06]"
                />
                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#1A1513]/70 to-transparent" />
                <span
                  className="absolute top-4 left-4 inline-flex items-center gap-2 bg-[#FDFBF7]/95 backdrop-blur-sm px-3 py-1.5 text-[10px] tracking-[0.25em] uppercase"
                  style={{ color: j.accent }}
                >
                  <Clock className="w-3 h-3" strokeWidth={1.6} />
                  {pick(j.duration, lang)}
                </span>
              </div>

              <div className="p-7 md:p-8 flex flex-col flex-1">
                <span className="inline-flex items-center gap-2 text-[10px] tracking-[0.25em] uppercase text-[#5C5248]">
                  <MapPin className="w-3 h-3" strokeWidth={1.6} />
                  {pick(j.region, lang)}
                </span>
                <h3 className="font-serif-x text-2xl md:text-[28px] leading-[1.08] mt-3 text-[#2C2621]">
                  {pick(j.title, lang)}
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-[#5C5248] flex-1">
                  {pick(j.summary, lang)}
                </p>

                <div className="mt-6 pt-5 border-t border-[#2C2621]/10 flex items-center justify-between">
                  <FromPrice tone="dark" size="md" testid={`journey-from-${j.slug}`} />
                  <a
                    href="#contact"
                    data-testid={`journey-cta-${j.slug}`}
                    className="inline-flex items-center gap-2 text-[10px] tracking-[0.25em] uppercase border-b pb-1 text-[#2C2621] hover:text-[#C16542] transition-colors"
                    style={{ borderColor: `${j.accent}66` }}
                  >
                    {t("cta_explore")}
                    <ArrowRight className="w-3 h-3" strokeWidth={1.5} />
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedJourneys;
