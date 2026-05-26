import React from "react";
import { ArrowRight, Calendar } from "lucide-react";
import { useLanguage, pick } from "@/contexts/LanguageContext";
import { JOURNAL } from "@/lib/data";

const formatDate = (isoDate, lang) => {
  try {
    const d = new Date(isoDate);
    return d.toLocaleDateString(
      lang === "fr" ? "fr-FR" : lang === "es" ? "es-ES" : "en-GB",
      { day: "numeric", month: "long", year: "numeric" }
    );
  } catch (_) {
    return isoDate;
  }
};

export const JournalSection = () => {
  const { t, lang } = useLanguage();

  return (
    <section
      id="journal"
      data-testid="journal-section"
      className="relative bg-[#FDFBF7] py-24 md:py-32 overflow-hidden"
    >
      <div className="relative max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end mb-16 md:mb-20">
          <div className="md:col-span-7">
            <span className="overline">{t("sec_journal_overline")}</span>
            <h2 className="font-serif-x text-4xl md:text-5xl lg:text-6xl leading-[1.05] tracking-tight mt-5 text-[#2C2621]">
              {t("sec_journal_title")}
            </h2>
          </div>
          <div className="md:col-span-5">
            <p className="text-base md:text-lg text-[#5C5248] leading-relaxed">
              {t("sec_journal_sub")}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
          {JOURNAL.map((post) => (
            <article
              key={post.slug}
              data-testid={`journal-card-${post.slug}`}
              className="group flex flex-col"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-[#F2EBE1] mb-7">
                <img
                  src={post.image}
                  alt={pick(post.title, lang)}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.06]"
                />
                <span
                  className="absolute bottom-4 left-4 inline-flex items-center gap-2 bg-[#FDFBF7]/95 backdrop-blur-sm px-3 py-1.5 text-[10px] tracking-[0.25em] uppercase"
                  style={{ color: post.accent }}
                >
                  <Calendar className="w-3 h-3" strokeWidth={1.6} />
                  {formatDate(post.date, lang)}
                </span>
              </div>

              <span className="text-[10px] tracking-[0.3em] uppercase text-[#5C5248]">
                {pick(post.readTime, lang)}
              </span>
              <h3 className="font-serif-x text-2xl md:text-[26px] leading-[1.1] mt-3 text-[#2C2621] group-hover:text-[#C16542] transition-colors">
                {pick(post.title, lang)}
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-[#5C5248]">
                {pick(post.excerpt, lang)}
              </p>
              <a
                href="#contact"
                data-testid={`journal-read-${post.slug}`}
                className="mt-5 inline-flex items-center gap-2 text-[10px] tracking-[0.25em] uppercase text-[#2C2621] border-b border-[#2C2621]/30 pb-1 self-start hover:border-[#C16542] hover:text-[#C16542] transition-colors"
              >
                {t("read_more")}
                <ArrowRight className="w-3 h-3" strokeWidth={1.5} />
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default JournalSection;
