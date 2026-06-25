import React from "react";
import { Link } from "react-router-dom";
import { Award, Sparkles, ShieldCheck, MapPinned, ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { pathFor } from "@/lib/routes";
import { translations } from "@/lib/i18n";
import EditableText from "@/components/EditableText";

const CARDS = [
  { num: "01", icon: Award,       k_title: "why_c1_title", k_body: "why_c1_body", route: "toursLanding", cta: { es: "Descubrir viajes", en: "Discover trips", fr: "Découvrir les voyages" } },
  { num: "02", icon: Sparkles,    k_title: "why_c2_title", k_body: "why_c2_body", route: "planTrip",     cta: { es: "Planificar viaje", en: "Plan trip", fr: "Planifier le voyage" } },
  { num: "03", icon: ShieldCheck, k_title: "why_c3_title", k_body: "why_c3_body", route: "appointment",  cta: { es: "Solicitar cita", en: "Book a call", fr: "Prendre rendez-vous" } },
  { num: "04", icon: MapPinned,   k_title: "why_c4_title", k_body: "why_c4_body", route: "contact",      cta: { es: "Hablar con agente", en: "Talk to an agent", fr: "Parler à un agent" } },
];

export const WhyXaluca = () => {
  const { lang } = useLanguage();

  return (
    <section
      id="why"
      data-testid="why-xaluca-section"
      className="relative bg-[#F2EBE1] py-24 md:py-32 overflow-hidden"
    >
      <div className="absolute inset-0 berber-bg-diamond opacity-50 pointer-events-none" aria-hidden="true" />

      <div className="relative max-w-7xl mx-auto px-6 md:px-12">
        <div className="max-w-3xl">
          <EditableText
            slot="home.why.overline"
            defaults={translations.why_overline}
            multiline={false}
            className="overline"
          />
          <EditableText
            as="h2"
            slot="home.why.title"
            defaults={translations.why_title}
            className="font-serif-x text-4xl md:text-5xl lg:text-6xl leading-[1.05] tracking-tight mt-5 text-[#2C2621] block"
          />
        </div>

        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {CARDS.map((c) => {
            const Icon = c.icon;
            return (
              <article
                key={c.num}
                data-testid={`why-card-${c.num}`}
                className="group relative bg-[#FDFBF7]/70 backdrop-blur-md border border-[#2C2621]/10 hover:border-[#C16542]/40 hover:bg-[#FDFBF7]/95 transition-all duration-500 p-8 md:p-10 flex flex-col h-full overflow-hidden"
              >
                <div className="absolute -top-3 -right-3 berber-bg-cross w-24 h-24 opacity-30" aria-hidden="true" />

                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center justify-center w-12 h-12 rounded-full border border-[#C16542]/40 text-[#C16542]">
                    <Icon className="w-5 h-5" strokeWidth={1.5} />
                  </span>
                  <span className="font-serif-x-italic text-3xl text-[#D4A373]/80">{c.num}</span>
                </div>

                <EditableText
                  as="h3"
                  slot={`home.why.${c.num}.title`}
                  defaults={translations[c.k_title]}
                  className="font-serif-x text-xl md:text-2xl leading-[1.1] mt-8 text-[#2C2621] block"
                />
                <EditableText
                  as="p"
                  slot={`home.why.${c.num}.body`}
                  defaults={translations[c.k_body]}
                  className="mt-4 text-sm leading-relaxed text-[#5C5248] flex-1 block"
                />

                <span className="mt-6 h-px w-10 bg-[#C16542] group-hover:w-20 transition-all duration-500" />

                <Link
                  to={pathFor(lang, c.route)}
                  data-testid={`why-card-cta-${c.num}`}
                  className="mt-5 inline-flex items-center gap-2 text-[11px] tracking-[0.22em] uppercase text-[#C16542] hover:text-[#2C2621] hover:gap-3 transition-all duration-300"
                >
                  <EditableText
                    slot={`home.why.${c.num}.cta`}
                    defaults={c.cta}
                    as="span"
                    multiline={false}
                    className="inline"
                  />
                  <ArrowRight className="w-4 h-4 shrink-0" strokeWidth={1.7} />
                </Link>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyXaluca;
