import React from "react";
import { ArrowRight, Check, Compass, MapPinned, Sparkles, Users } from "lucide-react";
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
    es: "Viaje a medida",
    en: "Tailor-made journey",
    fr: "Voyage sur mesure",
  },
  title: {
    es: "Diseñemos juntos tu viaje por Marruecos",
    en: "Let's design your journey through Morocco",
    fr: "Concevons ensemble votre voyage au Maroc",
  },
  intro: {
    es: "El planificador nos ayuda a conocer tus fechas, intereses, ritmo y presupuesto para preparar una experiencia que encaje realmente contigo.",
    en: "The planner helps us understand your dates, interests, pace and budget so we can prepare an experience that truly suits you.",
    fr: "Le planificateur nous aide à connaître vos dates, vos envies, votre rythme et votre budget afin de préparer une expérience qui vous ressemble vraiment.",
  },
  howItWorks: {
    es: "Cómo planificamos tu viaje",
    en: "How we plan your journey",
    fr: "Comment nous planifions votre voyage",
  },
  close: {
    es: "Ahora no",
    en: "Not now",
    fr: "Pas maintenant",
  },
  continue: {
    es: "Empezar a planificar",
    en: "Start planning",
    fr: "Commencer à planifier",
  },
  closeLabel: {
    es: "Cerrar",
    en: "Close",
    fr: "Fermer",
  },
  reassurance: {
    es: "Un especialista revisará personalmente tu solicitud",
    en: "A specialist will personally review your request",
    fr: "Un spécialiste étudiera personnellement votre demande",
  },
};

const STEPS = [
  {
    icon: MapPinned,
    title: {
      es: "1. Define lo esencial",
      en: "1. Define the essentials",
      fr: "1. Définissez l'essentiel",
    },
    body: {
      es: "Indica tus fechas aproximadas, duración, número de viajeros y lugares que te gustaría descubrir.",
      en: "Share your approximate dates, trip length, number of travellers and the places you would like to discover.",
      fr: "Indiquez vos dates approximatives, la durée, le nombre de voyageurs et les lieux que vous souhaitez découvrir.",
    },
  },
  {
    icon: Users,
    title: {
      es: "2. Cuéntanos cómo viajas",
      en: "2. Tell us how you travel",
      fr: "2. Dites-nous comment vous voyagez",
    },
    body: {
      es: "Comparte tus intereses, ritmo, tipo de alojamiento y cualquier necesidad especial para personalizar cada detalle.",
      en: "Share your interests, pace, accommodation preferences and any special requirements so we can tailor every detail.",
      fr: "Partagez vos envies, votre rythme, vos préférences d'hébergement et vos besoins particuliers afin de personnaliser chaque détail.",
    },
  },
  {
    icon: Sparkles,
    title: {
      es: "3. Recibe una propuesta",
      en: "3. Receive a proposal",
      fr: "3. Recevez une proposition",
    },
    body: {
      es: "Nuestro equipo estudiará tu solicitud y se pondrá en contacto contigo para crear y ajustar el itinerario.",
      en: "Our team will review your request and contact you to create and refine your itinerary.",
      fr: "Notre équipe étudiera votre demande et vous contactera pour créer et affiner votre itinéraire.",
    },
  },
];

export const PlanTripInfoModal = ({ open, onOpenChange }) => {
  const { lang } = useLanguage();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        data-testid="plan-trip-info-modal"
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
                  data-testid="plan-trip-info-cancel"
                  className="whitespace-nowrap px-4 py-3 text-[10px] uppercase tracking-[0.22em] text-[#2C2621]/60 transition-colors hover:text-[#C16542]"
                >
                  {pick(COPY.close, lang)}
                </button>
              </DialogClose>
              <DialogClose asChild>
                <Link
                  to={pathFor(lang, "planTrip")}
                  data-testid="plan-trip-info-continue"
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

export default PlanTripInfoModal;
