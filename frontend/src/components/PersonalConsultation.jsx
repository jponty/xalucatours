import React from "react";
import { Link } from "react-router-dom";
import { Phone, Calendar, ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { pathFor } from "@/lib/routes";
import { translations } from "@/lib/i18n";
import { CONTACT } from "@/lib/data";
import EditableImage from "@/components/EditableImage";
import EditableText from "@/components/EditableText";

export const PersonalConsultation = () => {
  const { t, lang } = useLanguage(); // eslint-disable-line no-unused-vars

  return (
    <section
      data-testid="consultation-section"
      className="relative bg-[#FDFBF7] py-24 md:py-32 overflow-hidden"
    >
      <div className="relative max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-16 items-center">
          <div className="md:col-span-5 relative aspect-[4/5] overflow-hidden bg-[#F2EBE1] order-2 md:order-1">
            <EditableImage
              slot="home.consult.portrait"
              fallback="https://images.unsplash.com/photo-1570133435536-7ececf000ef6?auto=format&fit=crop&w=1400&q=85"
              alt=""
              imgProps={{ loading: "lazy" }}
              aspectRatio="4/5"
              className="ken-burns absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-[#1A1513]/35 via-transparent to-transparent" />
          </div>

          <div className="md:col-span-7 order-1 md:order-2">
            <EditableText
              slot="home.consult.overline"
              defaults={translations.consult_overline}
              multiline={false}
              className="overline"
            />
            <EditableText
              as="h2"
              slot="home.consult.title"
              defaults={translations.consult_title}
              className="font-serif-x text-4xl md:text-5xl lg:text-6xl leading-[1.05] tracking-tight mt-5 text-[#2C2621] block"
            />
            <EditableText
              as="p"
              slot="home.consult.body"
              defaults={translations.consult_body}
              className="mt-6 text-base md:text-lg text-[#5C5248] leading-relaxed max-w-2xl block"
            />

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <a
                href={`tel:${CONTACT.phoneRaw}`}
                data-testid="consult-cta-call"
                className="inline-flex items-center gap-3 bg-[#C16542] hover:bg-[#A35133] text-[#FDFBF7] px-7 py-4 text-[11px] tracking-[0.25em] uppercase transition-colors"
              >
                <Phone className="w-3.5 h-3.5" strokeWidth={1.6} />
                <EditableText
                  slot="home.consult.cta_call"
                  defaults={translations.cta_book_call}
                  multiline={false}
                />
              </a>
              <Link
                to={pathFor(lang, "contact")}
                data-testid="consult-cta-visit"
                className="inline-flex items-center gap-3 border border-[#2C2621]/20 hover:border-[#2C2621] hover:bg-[#2C2621] hover:text-[#FDFBF7] text-[#2C2621] px-7 py-4 text-[11px] tracking-[0.25em] uppercase transition-all duration-300"
              >
                <Calendar className="w-3.5 h-3.5" strokeWidth={1.5} />
                <EditableText
                  slot="home.consult.cta_visit"
                  defaults={translations.cta_schedule_visit}
                  multiline={false}
                />
              </Link>
            </div>

            <div className="mt-10 pt-8 border-t border-[#2C2621]/10 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <EditableText
                  as="p"
                  slot="home.consult.office_hours_label"
                  defaults={translations.office_hours_label}
                  multiline={false}
                  className="text-[10px] tracking-[0.3em] uppercase text-[#5C5248] block"
                />
                <EditableText
                  as="p"
                  slot="home.consult.office_hours_value"
                  defaults={translations.office_hours_value}
                  multiline={false}
                  className="mt-2 text-sm text-[#2C2621] block"
                />
              </div>
              <div>
                <p className="text-[10px] tracking-[0.3em] uppercase text-[#5C5248]">
                  24/7
                </p>
                <EditableText
                  as="p"
                  slot="home.consult.24_7"
                  defaults={translations.contact_24_7}
                  multiline={false}
                  className="mt-2 text-sm text-[#2C2621] block"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ---------------- Community CTA (dark cinematic) ---------------- */
export const CommunityCTA = () => {
  const { t, lang } = useLanguage(); // eslint-disable-line no-unused-vars
  return (
    <section
      data-testid="community-cta-section"
      className="relative overflow-hidden bg-[#1A1513] text-[#FDFBF7]"
    >
      <EditableImage
        slot="home.community.bg"
        fallback="https://images.unsplash.com/photo-1489493585363-d69421e0edd3?auto=format&fit=crop&w=2000&q=85"
        alt=""
        imgProps={{ loading: "lazy" }}
        aspectRatio="21/9"
        className="ken-burns absolute inset-0 w-full h-full object-cover opacity-55"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#1A1513]/85 via-[#1A1513]/55 to-[#1A1513]/95" />
      <div className="absolute inset-0 berber-bg-cross opacity-50" aria-hidden="true" />
      <span className="film-grain" />

      <div className="relative max-w-5xl mx-auto px-6 md:px-12 py-28 md:py-40 text-center">
        <EditableText
          slot="home.community.overline"
          defaults={translations.community_overline}
          multiline={false}
          className="overline text-[#D4A373]"
        />
        <EditableText
          as="h2"
          slot="home.community.title"
          defaults={translations.community_title}
          className="font-serif-x text-4xl md:text-5xl lg:text-6xl leading-[1.05] tracking-tight mt-5 block"
        />
        <EditableText
          as="p"
          slot="home.community.body"
          defaults={translations.community_body}
          className="mt-8 text-base md:text-lg text-[#FDFBF7]/80 leading-relaxed max-w-3xl mx-auto block"
        />
        <div className="mt-12 flex flex-wrap justify-center gap-4">
          <Link
            to={pathFor(lang, "planTrip")}
            data-testid="community-cta-plan"
            className="inline-flex items-center gap-3 bg-[#C16542] hover:bg-[#A35133] text-[#FDFBF7] px-8 py-4 text-[11px] tracking-[0.25em] uppercase transition-colors"
          >
            <EditableText
              slot="home.community.cta_plan"
              defaults={translations.cta_plan}
              multiline={false}
            />
            <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.6} />
          </Link>
          <Link
            to={pathFor(lang, "contact")}
            data-testid="community-cta-specialist"
            className="inline-flex items-center gap-3 border border-[#FDFBF7]/40 hover:border-[#FDFBF7] hover:bg-[#FDFBF7] hover:text-[#1A1513] text-[#FDFBF7] px-7 py-4 text-[11px] tracking-[0.25em] uppercase transition-all duration-300"
          >
            <EditableText
              slot="home.community.cta_specialist"
              defaults={translations.cta_contact_specialist}
              multiline={false}
            />
            <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PersonalConsultation;
