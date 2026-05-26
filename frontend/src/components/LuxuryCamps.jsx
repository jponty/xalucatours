import React from "react";
import { ArrowRight, Tent, MapPin } from "lucide-react";
import { useLanguage, pick } from "@/contexts/LanguageContext";
import { CAMPS } from "@/lib/data";

export const LuxuryCamps = () => {
  const { t, lang } = useLanguage();

  return (
    <section
      id="camps"
      data-testid="luxury-camps-section"
      className="relative bg-[#1A1513] text-[#FDFBF7] py-24 md:py-32 lg:py-40 overflow-hidden"
    >
      <div className="absolute inset-0 berber-bg-cross opacity-70 pointer-events-none" aria-hidden="true" />
      <span className="film-grain" />

      <div className="relative max-w-7xl mx-auto px-6 md:px-12">
        <div className="max-w-3xl">
          <span className="overline text-[#D4A373]">{t("sec_camps_overline")}</span>
          <h2 className="font-serif-x text-4xl md:text-5xl lg:text-6xl leading-[1.05] tracking-tight mt-5">
            {t("sec_camps_title")}
          </h2>
          <p className="mt-6 text-base md:text-lg text-[#FDFBF7]/75 leading-relaxed max-w-2xl">
            {t("sec_camps_sub")}
          </p>
        </div>

        <div className="mt-16 md:mt-20 space-y-20 md:space-y-28">
          {CAMPS.map((c, idx) => {
            const reverse = idx % 2 === 1;
            return (
              <article
                key={c.slug}
                data-testid={`camp-block-${c.slug}`}
                className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center"
              >
                <div className={`md:col-span-7 group relative overflow-hidden h-[60vh] min-h-[420px] max-h-[680px] ${reverse ? "md:order-2" : ""}`}>
                  <img
                    src={c.image}
                    alt={pick(c.title, lang)}
                    loading="lazy"
                    className="ken-burns absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#1A1513]/85 via-[#1A1513]/25 to-transparent" />
                  <span className="film-grain" />
                  <span
                    className="absolute top-6 left-6 inline-flex items-center gap-2 bg-[#1A1513]/70 backdrop-blur-sm px-3 py-1.5 text-[10px] tracking-[0.3em] uppercase text-[#D4A373] border border-[#D4A373]/30"
                  >
                    <Tent className="w-3 h-3" strokeWidth={1.6} />
                    Camp {String(idx + 1).padStart(2, "0")}
                  </span>
                </div>

                <div className={`md:col-span-5 ${reverse ? "md:order-1" : ""}`}>
                  <span
                    className="inline-flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase"
                    style={{ color: c.accent }}
                  >
                    <span className="w-8 h-px" style={{ background: c.accent }} />
                    {pick(c.location, lang)}
                  </span>
                  <h3 className="font-serif-x text-3xl md:text-4xl lg:text-5xl leading-[1.05] mt-5 tracking-tight">
                    {pick(c.title, lang)}
                  </h3>
                  <p className="mt-6 text-base text-[#FDFBF7]/75 leading-relaxed">
                    {pick(c.description, lang)}
                  </p>
                  <div className="mt-8 flex items-center gap-3 text-[#D4A373]">
                    <MapPin className="w-3.5 h-3.5" strokeWidth={1.5} />
                    <a
                      href="#contact"
                      data-testid={`camp-cta-${c.slug}`}
                      className="inline-flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase border-b border-[#D4A373]/40 pb-1 hover:border-[#FDFBF7] hover:text-[#FDFBF7] transition-colors"
                    >
                      {t("cta_discover")}
                      <ArrowRight className="w-3 h-3" strokeWidth={1.5} />
                    </a>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default LuxuryCamps;
