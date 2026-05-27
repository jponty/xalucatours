import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/lib/i18n";
import EditableText from "@/components/EditableText";

export const Marquee = () => {
  const { lang } = useLanguage(); // eslint-disable-line no-unused-vars
  const items = (translations.marquee_items && translations.marquee_items[lang]) || translations.marquee_items?.en || [];
  const loop = [...items, ...items];

  return (
    <section
      data-testid="marquee-section"
      className="relative bg-[#2C2621] text-[#FDFBF7] py-5 overflow-hidden border-y border-[#FDFBF7]/10"
    >
      <div className="marquee-track">
        {loop.map((text, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-6 px-8 text-[10px] md:text-[11px] tracking-[0.3em] uppercase text-[#FDFBF7]/85"
          >
            <span className="text-[#D4A373]">◆</span>
            <EditableText
              slot={`home.marquee.${i % items.length}`}
              defaults={{ es: text, en: text, fr: text }}
              multiline={false}
            />
          </span>
        ))}
      </div>
    </section>
  );
};

export default Marquee;
