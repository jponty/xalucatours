import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Tent, BedDouble, HandHeart } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/lib/i18n";
import { pathFor } from "@/lib/routes";
import EditableImage from "@/components/EditableImage";
import EditableText from "@/components/EditableText";
import XalucaLogoBadge from "@/components/XalucaLogoBadge";

const CARDS = [
  {
    slug: "experiences",
    icon: Tent,
    accent: "#C16542",
    image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1600&q=85",
    k_title: "feel_c1_t",
    k_body: "feel_c1_b",
  },
  {
    slug: "accommodations",
    icon: BedDouble,
    accent: "#D4A373",
    image: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=1600&q=85",
    k_title: "feel_c2_t",
    k_body: "feel_c2_b",
  },
  {
    slug: "connection",
    icon: HandHeart,
    accent: "#A07042",
    image: "https://images.unsplash.com/photo-1597212618440-806262de4f6b?auto=format&fit=crop&w=1600&q=85",
    k_title: "feel_c3_t",
    k_body: "feel_c3_b",
  },
];

export const WhatJourneysFeelLike = () => {
  const { t, lang } = useLanguage();
  const ctaLabel = {
    es: "Descubrir viajes",
    en: "Discover journeys",
    fr: "Découvrir les voyages",
  }[lang] || "Descubrir viajes";

  return (
    <section
      id="experiences"
      data-testid="feel-section"
      className="relative bg-[#FDFBF7] py-24 md:py-32 overflow-hidden"
    >
      <div className="absolute inset-0 berber-bg-diamond opacity-40 pointer-events-none" aria-hidden="true" />

      <div className="relative max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end mb-16 md:mb-20">
          <div className="md:col-span-7">
            <EditableText
              slot="home.feel.overline"
              defaults={translations.feel_overline}
              multiline={false}
              className="overline"
            />
            <EditableText
              as="h2"
              slot="home.feel.title"
              defaults={translations.feel_title}
              className="font-serif-x text-4xl md:text-5xl lg:text-6xl leading-[1.05] tracking-tight mt-5 text-[#2C2621] block"
            />
          </div>
          <div className="md:col-span-5">
            <EditableText
              as="p"
              slot="home.feel.sub"
              defaults={translations.feel_sub}
              className="text-base md:text-lg text-[#5C5248] leading-relaxed block"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#2C2621]/10 border border-[#2C2621]/10">
          {CARDS.map((c) => {
            const Icon = c.icon;
            return (
              <article
                key={c.slug}
                data-testid={`feel-card-${c.slug}`}
                className="group relative overflow-hidden bg-[#FDFBF7] hover:bg-white transition-colors duration-500 flex flex-col"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-[#F2EBE1]">
                  <EditableImage
                    slot={`home.feel.${c.slug}`}
                    fallback={c.image}
                    alt={t(c.k_title)}
                    imgProps={{ loading: "lazy" }}
                    aspectRatio="4/3"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.05]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A1513]/55 to-transparent" />
                  <XalucaLogoBadge testid={`feel-logo-${c.slug}`} />
                  <span
                    className="absolute bottom-4 left-4 inline-flex items-center justify-center w-12 h-12 rounded-full border bg-[#1A1513]/50 backdrop-blur-sm"
                    style={{ borderColor: `${c.accent}99`, color: c.accent }}
                  >
                    <Icon className="w-5 h-5" strokeWidth={1.5} />
                  </span>
                </div>
                <div className="p-8 md:p-10 flex flex-col flex-1">
                  <EditableText
                    as="h3"
                    slot={`home.feel.${c.slug}.title`}
                    defaults={translations[c.k_title]}
                    className="font-serif-x text-2xl md:text-[26px] leading-[1.1] text-[#2C2621] block"
                  />
                  <EditableText
                    as="p"
                    slot={`home.feel.${c.slug}.body`}
                    defaults={translations[c.k_body]}
                    className="mt-4 text-sm leading-relaxed text-[#5C5248] flex-1 block"
                  />
                  <Link
                    to={pathFor(lang, "toursLanding")}
                    data-testid={`feel-cta-${c.slug}`}
                    className="mt-7 inline-flex w-fit items-center gap-3 border-b pb-2 text-[10px] font-medium uppercase tracking-[0.2em] transition-all duration-300 hover:gap-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-4"
                    style={{ borderColor: c.accent, color: c.accent }}
                    aria-label={`${ctaLabel}: ${t(c.k_title)}`}
                  >
                    {ctaLabel}
                    <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhatJourneysFeelLike;
