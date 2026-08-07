import React, { useEffect } from "react";
import { useLanguage, pick } from "@/contexts/LanguageContext";
import EditableImage from "@/components/EditableImage";
import HeroMonogram from "@/components/HeroMonogram";
import EditableText from "@/components/EditableText";
import { useSlotId } from "@/components/slotScope";
import FormTabs from "@/components/FormTabs";
import { PLANNER_COPY } from "@/components/PlannerForm";

/* ============================================================
   PlanificaTuViajePage · /planifica-tu-viaje
   ------------------------------------------------------------
   Cinematic hero + tabbed forms (detailed planner / quick contact).
   The detailed planner and quick contact form live in <FormTabs>,
   shared with /contacto. Default tab: detailed.
============================================================ */

const COPY = PLANNER_COPY;

/* Inline-CMS per-page text editor (auto-namespaced by page path). */
const ET = ({ k, defaults, as = "span", className, multiline = true, ...rest }) => {
  const slot = useSlotId(k);
  return <EditableText slot={slot} defaults={defaults || (k ? COPY[k] : {}) || {}} as={as} className={className} multiline={multiline} {...rest} />;
};

export default function PlanificaTuViajePage() {
  const { lang } = useLanguage();

  useEffect(() => { document.title = "Xaluca Tours · " + pick(COPY.title, lang); }, [lang]);

  return (
    <div data-testid="plan-trip-page" className="bg-[#FBF5EA] text-[#2C2621]">
      {/* HERO */}
      <section className="relative min-h-[68svh] overflow-hidden bg-[#1A1513]">
        <EditableImage
          slot="plan-trip.hero.bg"
          fallback="https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=2400&q=85"
          alt=""
          priority
          aspectRatio="16/9"
          className="absolute inset-0 w-full h-full object-cover opacity-90"
        />
        <span className="absolute inset-0 bg-gradient-to-t from-[#1A1513]/85 via-[#1A1513]/30 to-transparent pointer-events-none" />
        <span className="film-grain opacity-50" aria-hidden="true" />
        <HeroMonogram />
        <div className="relative min-h-[68svh] max-w-6xl mx-auto px-6 md:px-12 flex flex-col justify-end pb-16 md:pb-20">
          <ET k="eyebrow" multiline={false} className="overline text-[#D4A373]" />
          <ET k="title" as="h1" multiline={false} className="font-serif-x text-4xl md:text-5xl lg:text-6xl leading-[1.05] tracking-tight mt-5 max-w-3xl text-[#FDFBF7]" />
          <ET k="intro" as="p" className="mt-6 max-w-xl text-base md:text-lg text-[#FDFBF7]/85 leading-relaxed" />
        </div>
      </section>

      {/* TABBED FORMS — detailed planner (default) + quick contact */}
      <FormTabs defaultTab="detailed" showOptionsInfo optionsInfoInitiallyOpen />
    </div>
  );
}
