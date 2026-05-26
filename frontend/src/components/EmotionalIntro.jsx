import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";

export const EmotionalIntro = () => {
  const { t } = useLanguage();

  return (
    <section
      id="story"
      data-testid="emotional-intro-section"
      className="relative bg-[#FDFBF7] py-24 md:py-32 overflow-hidden"
    >
      <div className="relative max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-16 items-center">
          <div className="md:col-span-6 lg:col-span-7 order-2 md:order-1">
            <span className="overline">{t("intro_overline")}</span>
            <h2 className="font-serif-x text-4xl md:text-5xl lg:text-6xl leading-[1.05] tracking-tight mt-5 text-[#2C2621]">
              {t("intro_title")}
            </h2>

            <div className="mt-10 space-y-6 text-base md:text-lg leading-relaxed text-[#5C5248] max-w-2xl">
              <p className="font-serif-x-italic text-xl md:text-2xl text-[#2C2621] leading-[1.4]">
                {t("intro_p1")}
              </p>
              <p>{t("intro_p2")}</p>
              <p>{t("intro_p3")}</p>
              <p className="font-serif-x text-2xl md:text-3xl text-[#C16542] leading-[1.2]">
                {t("intro_p4")}
              </p>
            </div>

            <p className="mt-10 text-[10px] tracking-[0.3em] uppercase text-[#5C5248]">
              {t("intro_signature")}
            </p>
          </div>

          <div className="md:col-span-6 lg:col-span-5 order-1 md:order-2">
            <div className="relative aspect-[4/5] overflow-hidden bg-[#F2EBE1]">
              <img
                src="https://images.unsplash.com/photo-1597212720159-d4e91f47cbe2?auto=format&fit=crop&w=1400&q=85"
                alt=""
                loading="lazy"
                className="ken-burns absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-[#1A1513]/35 via-transparent to-transparent" />
              <span className="film-grain" />
              <span className="absolute bottom-6 left-6 right-6 text-[#FDFBF7] font-serif-x-italic text-lg md:text-xl leading-[1.3]">
                Arfoud — the Gateway to the Desert.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EmotionalIntro;
