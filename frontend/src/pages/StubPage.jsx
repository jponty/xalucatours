import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Img } from "@/components/Img";
import { useLanguage } from "@/contexts/LanguageContext";
import { pathFor } from "@/lib/routes";
import { STUB_CONTENT } from "@/lib/stubContent";
import ContactForm from "@/components/ContactForm";

/**
 * Generic placeholder page for routes that don't yet have unique content.
 * Renders a cinematic hero + trilingual intro + CTA back to enquiry form,
 * keeping the brand identity coherent across all menu destinations.
 */
export default function StubPage({ routeId }) {
  const { lang, t } = useLanguage();

  const data = STUB_CONTENT[routeId] || STUB_CONTENT.appointment;
  const overline = data.overline?.[lang] || data.overline?.es;
  const title = data.title?.[lang] || data.title?.es;
  const body = data.body?.[lang] || data.body?.es;

  useEffect(() => {
    document.title = `${title} · Xaluca Tours`;
    window.scrollTo(0, 0);
  }, [title]);

  return (
    <div data-testid={`stub-page-${routeId}`}>
      <section className="relative bg-[#1A1513] text-[#FDFBF7] overflow-hidden pt-32 md:pt-40 pb-24 md:pb-32">
        <Img
          src={data.image}
          alt=""
          priority
          width={1920}
          className="ken-burns absolute inset-0 w-full h-full object-cover opacity-45"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1513]/95 via-[#1A1513]/65 to-[#1A1513]/40" />
        <div className="absolute inset-0 berber-bg-cross opacity-40" aria-hidden="true" />
        <span className="film-grain" />

        <div className="relative max-w-7xl mx-auto px-6 md:px-12">
          <div className="max-w-3xl">
            <span className="overline text-[#D4A373]">{overline}</span>
            <h1 className="font-serif-x text-5xl md:text-6xl lg:text-7xl leading-[1.02] tracking-tight mt-6">
              {title}
            </h1>
            <p className="mt-8 text-base md:text-lg text-[#FDFBF7]/85 leading-relaxed max-w-2xl">
              {body}
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                to={pathFor(lang, "planTrip")}
                data-testid="stub-cta-contact"
                className="inline-flex items-center gap-3 bg-[#C16542] hover:bg-[#A35133] text-[#FDFBF7] px-8 py-4 text-[11px] tracking-[0.25em] uppercase transition-colors"
              >
                {t("cta_plan")}
                <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.6} />
              </Link>
              <Link
                to={pathFor(lang, "home")}
                data-testid="stub-cta-home"
                className="inline-flex items-center gap-3 border border-[#FDFBF7]/30 hover:border-[#FDFBF7] hover:bg-[#FDFBF7] hover:text-[#1A1513] text-[#FDFBF7] px-7 py-4 text-[11px] tracking-[0.25em] uppercase transition-all duration-300"
              >
                {t("nav_intro") || "Home"}
                <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Enquiry form so every page has a clear conversion path */}
      <ContactForm />
    </div>
  );
}
