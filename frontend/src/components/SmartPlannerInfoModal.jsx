import React from "react";
import { ArrowRight, CalendarDays, Check, Compass, MapPin, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLanguage, pick } from "@/contexts/LanguageContext";
import { pathFor } from "@/lib/routes";

const COPY = {
  eyebrow: {
    es: "Planificador inteligente",
    en: "Smart trip planner",
    fr: "Planificateur intelligent",
  },
  title: {
    es: "Encuentra la ruta Xaluca que mejor encaja contigo",
    en: "Find the Xaluca route that suits you best",
    fr: "Trouvez l'itinéraire Xaluca qui vous correspond",
  },
  intro: {
    es: "Indica cuánto tiempo tienes, por dónde llegas y qué lugares te atraen. El planificador analizará las rutas reales de Xaluca Tours y te recomendará las opciones más compatibles.",
    en: "Tell us how much time you have, where you arrive and which places interest you. The planner analyses real Xaluca Tours routes and recommends the most compatible options.",
    fr: "Indiquez le temps dont vous disposez, votre point d'arrivée et les lieux qui vous attirent. Le planificateur analyse les véritables circuits Xaluca Tours et recommande les options les plus adaptées.",
  },
  howItWorks: {
    es: "Cómo funciona",
    en: "How it works",
    fr: "Comment ça marche",
  },
  close: {
    es: "Ahora no",
    en: "Not now",
    fr: "Pas maintenant",
  },
  continue: {
    es: "Abrir planificador",
    en: "Open planner",
    fr: "Ouvrir le planificateur",
  },
  closeLabel: {
    es: "Cerrar",
    en: "Close",
    fr: "Fermer",
  },
  reassurance: {
    es: "Solo recomienda circuitos reales y viables de Xaluca Tours",
    en: "Only real, viable Xaluca Tours routes are recommended",
    fr: "Seuls les circuits réels et réalisables de Xaluca Tours sont proposés",
  },
};

const STEPS = [
  {
    icon: CalendarDays,
    title: {
      es: "1. Indica tus días",
      en: "1. Choose your days",
      fr: "1. Indiquez vos jours",
    },
    body: {
      es: "Selecciona la duración del viaje y tus aeropuertos o ciudades de llegada y salida.",
      en: "Select your trip length and your arrival and departure airports or cities.",
      fr: "Sélectionnez la durée du voyage ainsi que vos aéroports ou villes d'arrivée et de départ.",
    },
  },
  {
    icon: MapPin,
    title: {
      es: "2. Marca tus preferencias",
      en: "2. Mark your preferences",
      fr: "2. Indiquez vos préférences",
    },
    body: {
      es: "Elige los destinos, paisajes y experiencias de Marruecos que no quieres perderte.",
      en: "Choose the Moroccan destinations, landscapes and experiences you do not want to miss.",
      fr: "Choisissez les destinations, paysages et expériences du Maroc que vous ne voulez pas manquer.",
    },
  },
  {
    icon: Sparkles,
    title: {
      es: "3. Descubre tu mejor ruta",
      en: "3. Discover your best route",
      fr: "3. Découvrez votre meilleur circuit",
    },
    body: {
      es: "Recibe una recomendación con compatibilidad, recorrido, tiempos y alternativas para comparar.",
      en: "Get a recommendation with compatibility, route, timings and alternatives to compare.",
      fr: "Recevez une recommandation avec compatibilité, parcours, durées et alternatives à comparer.",
    },
  },
];

export const SmartPlannerInfoModal = ({ open, onOpenChange }) => {
  const { lang } = useLanguage();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        data-testid="smart-planner-info-modal"
        overlayClassName="z-[190]"
        closeLabel={pick(COPY.closeLabel, lang)}
        className="z-[200] w-[calc(100%-2rem)] max-w-2xl max-h-[92vh] overflow-y-auto gap-0 border border-[#2C2621]/10 bg-[#FDFBF7] p-0 text-[#2C2621] shadow-[0_30px_80px_-30px_rgba(26,21,19,0.65)] sm:rounded-none"
      >
        <div className="border-b border-[#2C2621]/10 px-6 py-7 pr-14 sm:px-10 sm:py-9 sm:pr-16">
          <div className="inline-flex items-center gap-2 text-[#C16542]">
            <Compass className="h-4 w-4" strokeWidth={1.7} aria-hidden="true" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.3em]">
              {pick(COPY.eyebrow, lang)}
            </span>
          </div>
          <DialogTitle className="mt-4 font-serif-x text-3xl font-normal leading-[1.05] tracking-tight text-[#2C2621] sm:text-4xl">
            {pick(COPY.title, lang)}
          </DialogTitle>
          <DialogDescription className="mt-4 max-w-xl text-sm leading-relaxed text-[#2C2621]/70 sm:text-[15px]">
            {pick(COPY.intro, lang)}
          </DialogDescription>
        </div>

        <div className="px-6 py-7 sm:px-10 sm:py-9">
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#2C2621]/55">
            {pick(COPY.howItWorks, lang)}
          </p>
          <ol className="mt-6 grid gap-6 sm:grid-cols-3 sm:gap-5">
            {STEPS.map(({ icon: Icon, title, body }) => (
              <li key={title.es}>
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#C16542]/10 text-[#C16542]">
                  <Icon className="h-[18px] w-[18px]" strokeWidth={1.6} aria-hidden="true" />
                </span>
                <h3 className="mt-3 font-serif-x text-lg leading-tight text-[#2C2621]">
                  {pick(title, lang)}
                </h3>
                <p className="mt-2 text-[13px] leading-relaxed text-[#2C2621]/65">
                  {pick(body, lang)}
                </p>
              </li>
            ))}
          </ol>

          <div className="mt-8 flex flex-col gap-3 border-t border-[#2C2621]/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-[12px] text-[#2C2621]/60">
              <Check className="h-4 w-4 shrink-0 text-[#C16542]" strokeWidth={1.8} aria-hidden="true" />
              <span>{pick(COPY.reassurance, lang)}</span>
            </div>
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center">
              <DialogClose asChild>
                <button
                  type="button"
                  data-testid="smart-planner-info-cancel"
                  className="whitespace-nowrap px-4 py-3 text-[10px] uppercase tracking-[0.22em] text-[#2C2621]/60 transition-colors hover:text-[#C16542]"
                >
                  {pick(COPY.close, lang)}
                </button>
              </DialogClose>
              <DialogClose asChild>
                <Link
                  to={pathFor(lang, "planner")}
                  data-testid="smart-planner-info-continue"
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap bg-[#C16542] px-6 py-3.5 text-[10px] uppercase tracking-[0.22em] text-[#FDFBF7] transition-colors hover:bg-[#A35133]"
                >
                  {pick(COPY.continue, lang)}
                  <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.7} aria-hidden="true" />
                </Link>
              </DialogClose>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SmartPlannerInfoModal;
