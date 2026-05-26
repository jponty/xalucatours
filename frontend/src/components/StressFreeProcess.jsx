import React from "react";
import { ArrowRight, MessagesSquare, Map, Plane } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const STEPS = [
  { num: "01", icon: MessagesSquare, k_title: "proc_s1_t", k_body: "proc_s1_b" },
  { num: "02", icon: Map,            k_title: "proc_s2_t", k_body: "proc_s2_b" },
  { num: "03", icon: Plane,          k_title: "proc_s3_t", k_body: "proc_s3_b" },
];

export const StressFreeProcess = () => {
  const { t } = useLanguage();

  return (
    <section
      id="process"
      data-testid="process-section"
      className="relative bg-[#1A1513] text-[#FDFBF7] py-24 md:py-32 lg:py-40 overflow-hidden"
    >
      <div className="absolute inset-0 berber-bg-cross opacity-60 pointer-events-none" aria-hidden="true" />
      <span className="film-grain" />

      <div className="relative max-w-7xl mx-auto px-6 md:px-12">
        <div className="max-w-3xl">
          <span className="overline text-[#D4A373]">{t("proc_overline")}</span>
          <h2 className="font-serif-x text-4xl md:text-5xl lg:text-6xl leading-[1.05] tracking-tight mt-5">
            {t("proc_title")}
          </h2>
          <p className="mt-6 text-base md:text-lg text-[#FDFBF7]/75 leading-relaxed">
            {t("proc_sub")}
          </p>
        </div>

        <div className="mt-16 md:mt-20 grid grid-cols-1 md:grid-cols-3 gap-px bg-[#FDFBF7]/10 border border-[#FDFBF7]/15">
          {STEPS.map((s) => {
            const Icon = s.icon;
            return (
              <article
                key={s.num}
                data-testid={`process-step-${s.num}`}
                className="relative bg-[#1A1513] hover:bg-[#221A16] transition-colors duration-500 p-10 md:p-12 flex flex-col h-full"
              >
                <div className="flex items-center justify-between">
                  <span className="font-serif-x-italic text-6xl md:text-7xl text-[#D4A373]/50 leading-none">
                    {s.num}
                  </span>
                  <span className="inline-flex items-center justify-center w-12 h-12 rounded-full border border-[#D4A373]/40 text-[#D4A373]">
                    <Icon className="w-5 h-5" strokeWidth={1.5} />
                  </span>
                </div>
                <h3 className="font-serif-x text-2xl md:text-[28px] leading-[1.1] mt-10 text-[#FDFBF7]">
                  {t(s.k_title)}
                </h3>
                <p className="mt-5 text-sm leading-relaxed text-[#FDFBF7]/75 flex-1">
                  {t(s.k_body)}
                </p>
                <span className="mt-8 h-px w-10 bg-[#D4A373]" />
              </article>
            );
          })}
        </div>

        <div className="mt-14 md:mt-16 flex flex-wrap items-center gap-4">
          <a
            href="#contact"
            data-testid="process-cta-start"
            className="inline-flex items-center gap-3 bg-[#C16542] hover:bg-[#A35133] text-[#FDFBF7] px-8 py-4 text-[11px] tracking-[0.25em] uppercase transition-colors"
          >
            {t("cta_start_planning")}
            <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.6} />
          </a>
          <a
            href="#contact"
            data-testid="process-cta-proposal"
            className="inline-flex items-center gap-3 border border-[#FDFBF7]/30 hover:border-[#D4A373] hover:text-[#D4A373] text-[#FDFBF7] px-7 py-4 text-[11px] tracking-[0.25em] uppercase transition-all duration-300"
          >
            {t("cta_request_proposal")}
            <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
          </a>
        </div>
      </div>
    </section>
  );
};

export default StressFreeProcess;
