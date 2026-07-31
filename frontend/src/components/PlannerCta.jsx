import React, { useState } from "react";
import { Wand2, ArrowRight, Compass, MapPin, CalendarDays } from "lucide-react";
import { useLanguage, pick } from "@/contexts/LanguageContext";
import SmartPlannerInfoModal from "@/components/SmartPlannerInfoModal";

const COPY = {
  eyebrow: { es: "Planificador inteligente", en: "Smart trip planner", fr: "Planificateur intelligent" },
  title: {
    es: "¿No sabes por dónde empezar tu viaje?",
    en: "Not sure where to start your trip?",
    fr: "Vous ne savez pas par où commencer ?",
  },
  text: {
    es: "Dinos cuántos días tienes, por dónde llegas y qué te apetece ver. En segundos te recomendamos la mejor ruta —solo circuitos reales de Xaluca, nunca rutas imposibles.",
    en: "Tell us your days, your arrival point and what you'd love to see. In seconds we recommend the best route —only real Xaluca circuits, never impossible itineraries.",
    fr: "Indiquez vos jours, votre point d'arrivée et vos envies. En quelques secondes, nous recommandons le meilleur itinéraire —uniquement des circuits réels Xaluca.",
  },
  cta: { es: "Planifica tu viaje", en: "Plan your trip", fr: "Planifiez votre voyage" },
  f1: { es: "Elige tus días", en: "Pick your days", fr: "Choisissez vos jours" },
  f2: { es: "Marca tus destinos", en: "Mark your destinations", fr: "Marquez vos destinations" },
  f3: { es: "Recibe tu ruta ideal", en: "Get your ideal route", fr: "Recevez votre itinéraire" },
};

const Feature = ({ icon: Icon, label }) => (
  <span className="inline-flex items-center gap-2 text-[12px] tracking-[0.06em] text-[#FDFBF7]/75">
    <Icon className="w-4 h-4 text-[#E0A85C]" strokeWidth={1.8} /> {label}
  </span>
);

export default function PlannerCta() {
  const { lang } = useLanguage();
  const [plannerInfoOpen, setPlannerInfoOpen] = useState(false);
  return (
    <>
      <section data-testid="home-planner-cta" className="relative bg-[#1A1513] text-[#FDFBF7] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_25%,#3a2a20,transparent_55%),radial-gradient(circle_at_85%_85%,#2a3530,transparent_55%)]" />
        <div className="absolute inset-0 berber-bg-diamond opacity-[0.08]" aria-hidden="true" />
        <div className="relative max-w-6xl mx-auto px-5 md:px-10 py-16 md:py-24 flex flex-col lg:flex-row lg:items-center gap-10">
          <div className="flex-1">
            <span className="overline inline-flex items-center gap-2 text-[#E0A85C]">
              <Wand2 className="w-3.5 h-3.5" strokeWidth={1.8} /> {pick(COPY.eyebrow, lang)}
            </span>
            <h2 className="font-serif-x text-3xl md:text-4xl lg:text-5xl leading-[1.08] tracking-tight mt-4 max-w-2xl">
              {pick(COPY.title, lang)}
            </h2>
            <p className="text-base text-[#FDFBF7]/80 leading-relaxed mt-5 max-w-xl">{pick(COPY.text, lang)}</p>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3">
              <Feature icon={CalendarDays} label={pick(COPY.f1, lang)} />
              <Feature icon={MapPin} label={pick(COPY.f2, lang)} />
              <Feature icon={Compass} label={pick(COPY.f3, lang)} />
            </div>
          </div>
          <div className="shrink-0">
            <button
              type="button"
              onClick={() => setPlannerInfoOpen(true)}
              data-testid="home-planner-cta-button"
              aria-haspopup="dialog"
              className="group inline-flex items-center gap-3 bg-[#C16542] hover:bg-[#A85231] text-[#FDFBF7] text-[13px] tracking-[0.2em] uppercase font-semibold px-8 py-4 rounded-full transition-all duration-300 hover:gap-5"
            >
              {pick(COPY.cta, lang)}
              <ArrowRight className="w-4 h-4" strokeWidth={2} />
            </button>
          </div>
        </div>
      </section>
      <SmartPlannerInfoModal open={plannerInfoOpen} onOpenChange={setPlannerInfoOpen} />
    </>
  );
}
