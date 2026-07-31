import React from "react";
import { ArrowRight, CalendarClock, Check, MessageCircle, Route } from "lucide-react";
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
    es: "Planificación personalizada",
    en: "Personal travel planning",
    fr: "Planification personnalisée",
  },
  title: {
    es: "Tu viaje empieza con una conversación",
    en: "Your journey starts with a conversation",
    fr: "Votre voyage commence par une conversation",
  },
  intro: {
    es: "La cita previa es una sesión informativa, sin compromiso, para conocerte y convertir tus ideas en un viaje por Marruecos diseñado a tu medida.",
    en: "Your appointment is a no-obligation information session where we get to know you and turn your ideas into a tailor-made journey through Morocco.",
    fr: "Le rendez-vous est une séance d'information sans engagement pour vous connaître et transformer vos idées en un voyage au Maroc conçu sur mesure.",
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
    es: "Solicitar cita",
    en: "Book an appointment",
    fr: "Prendre rendez-vous",
  },
  closeLabel: {
    es: "Cerrar",
    en: "Close",
    fr: "Fermer",
  },
};

const STEPS = [
  {
    icon: MessageCircle,
    title: {
      es: "1. Cuéntanos tu idea",
      en: "1. Tell us your idea",
      fr: "1. Parlez-nous de votre projet",
    },
    body: {
      es: "Elige el día y la hora que mejor te vengan y comparte tus fechas, intereses y forma de viajar.",
      en: "Choose the day and time that suit you and share your dates, interests and travel style.",
      fr: "Choisissez le jour et l'heure qui vous conviennent et partagez vos dates, vos envies et votre façon de voyager.",
    },
  },
  {
    icon: CalendarClock,
    title: {
      es: "2. Hablamos contigo",
      en: "2. We talk with you",
      fr: "2. Nous échangeons avec vous",
    },
    body: {
      es: "Un especialista de Xaluca Tours te contactará para resolver dudas y entender qué experiencia buscas.",
      en: "A Xaluca Tours specialist will contact you to answer questions and understand the experience you are looking for.",
      fr: "Un spécialiste de Xaluca Tours vous contactera pour répondre à vos questions et comprendre l'expérience que vous recherchez.",
    },
  },
  {
    icon: Route,
    title: {
      es: "3. Diseñamos tu viaje",
      en: "3. We design your journey",
      fr: "3. Nous concevons votre voyage",
    },
    body: {
      es: "Con lo que nos cuentes, prepararemos una propuesta personalizada que podrás revisar junto a nuestro equipo.",
      en: "Based on your conversation, we will prepare a personalised proposal that you can review with our team.",
      fr: "À partir de votre échange, nous préparerons une proposition personnalisée que vous pourrez revoir avec notre équipe.",
    },
  },
];

export const AppointmentInfoModal = ({ open, onOpenChange }) => {
  const { lang } = useLanguage();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        data-testid="appointment-info-modal"
        overlayClassName="z-[190]"
        closeLabel={pick(COPY.closeLabel, lang)}
        className="z-[200] w-[calc(100%-2rem)] max-w-2xl max-h-[92vh] overflow-y-auto gap-0 border border-[#2C2621]/10 bg-[#FDFBF7] p-0 text-[#2C2621] shadow-[0_30px_80px_-30px_rgba(26,21,19,0.65)] sm:rounded-none"
      >
        <div className="border-b border-[#2C2621]/10 px-6 py-7 pr-14 sm:px-10 sm:py-9 sm:pr-16">
          <div className="inline-flex items-center gap-2 text-[#C16542]">
            <CalendarClock className="h-4 w-4" strokeWidth={1.7} aria-hidden="true" />
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
              <li key={title.es} className="relative">
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
              <Check className="h-4 w-4 text-[#C16542]" strokeWidth={1.8} aria-hidden="true" />
              <span>
                {pick(
                  {
                    es: "Sesión informativa y sin compromiso",
                    en: "A no-obligation information session",
                    fr: "Une séance d'information sans engagement",
                  },
                  lang
                )}
              </span>
            </div>
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center">
              <DialogClose asChild>
                <button
                  type="button"
                  data-testid="appointment-info-cancel"
                  className="px-4 py-3 text-[10px] uppercase tracking-[0.22em] text-[#2C2621]/60 transition-colors hover:text-[#C16542]"
                >
                  {pick(COPY.close, lang)}
                </button>
              </DialogClose>
              <DialogClose asChild>
                <Link
                  to={pathFor(lang, "appointment")}
                  data-testid="appointment-info-continue"
                  className="inline-flex items-center justify-center gap-2 bg-[#C16542] px-6 py-3.5 text-[10px] uppercase tracking-[0.22em] text-[#FDFBF7] transition-colors hover:bg-[#A35133]"
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

export default AppointmentInfoModal;
