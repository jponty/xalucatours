import React from "react";
import { Calendar, Compass, Headset, HelpCircle, MessageCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLanguage, pick } from "@/contexts/LanguageContext";

const COPY = {
  eyebrow: {
    es: "Canales de contacto",
    en: "Contact options",
    fr: "Options de contact",
  },
  title: {
    es: "¿Qué opción debes elegir?",
    en: "Which option should you choose?",
    fr: "Quelle option choisir ?",
  },
  intro: {
    es: "Elige según el tipo de ayuda que necesitas. Todas las solicitudes llegan al equipo de Xaluca Tours, pero cada canal está pensado para un momento diferente de la planificación.",
    en: "Choose according to the help you need. Every request reaches the Xaluca Tours team, but each channel is designed for a different stage of your planning.",
    fr: "Choisissez selon l'aide dont vous avez besoin. Toutes les demandes parviennent à l'équipe Xaluca Tours, mais chaque canal correspond à une étape différente de votre projet.",
  },
  choose: {
    es: "Elegir esta opción",
    en: "Choose this option",
    fr: "Choisir cette option",
  },
  closeLabel: {
    es: "Cerrar",
    en: "Close",
    fr: "Fermer",
  },
};

const OPTIONS = [
  {
    id: "detailed",
    icon: Compass,
    title: {
      es: "Planificación detallada",
      en: "Detailed planner",
      fr: "Planification détaillée",
    },
    description: {
      es: "Un formulario completo para compartir fechas, viajeros, presupuesto, alojamientos, intereses y preferencias.",
      en: "A complete form for sharing dates, travellers, budget, accommodation, interests and preferences.",
      fr: "Un formulaire complet pour préciser dates, voyageurs, budget, hébergements, centres d'intérêt et préférences.",
    },
    bestFor: {
      es: "Elígela si quieres solicitar una propuesta de viaje personalizada y ya puedes explicar qué necesitas.",
      en: "Choose it if you want a personalised travel proposal and can already explain what you need.",
      fr: "Choisissez-la si vous souhaitez une proposition personnalisée et pouvez déjà préciser vos besoins.",
    },
  },
  {
    id: "quick",
    icon: MessageCircle,
    title: {
      es: "Contacto rápido",
      en: "Quick contact",
      fr: "Contact rapide",
    },
    description: {
      es: "Un formulario breve para dejar tus datos y escribir una consulta concreta al equipo.",
      en: "A short form to leave your details and send the team a specific question.",
      fr: "Un formulaire court pour laisser vos coordonnées et poser une question précise à l'équipe.",
    },
    bestFor: {
      es: "Elígelo para dudas generales, seguimiento de una solicitud o cuando todavía no tienes todos los detalles del viaje.",
      en: "Choose it for general questions, request follow-up or when you do not yet have all your trip details.",
      fr: "Choisissez-le pour une question générale, le suivi d'une demande ou si votre projet n'est pas encore défini.",
    },
  },
  {
    id: "assistant",
    icon: Headset,
    title: {
      es: "Asistente Virtual",
      en: "Virtual Assistant",
      fr: "Assistant Virtuel",
    },
    description: {
      es: "Orientación inmediata sobre rutas, destinos, precios y alojamientos mediante una conversación en tiempo real.",
      en: "Immediate guidance on routes, destinations, prices and accommodation through a real-time conversation.",
      fr: "Des conseils immédiats sur circuits, destinations, prix et hébergements au cours d'une conversation en temps réel.",
    },
    bestFor: {
      es: "Elígelo para explorar posibilidades o resolver preguntas rápidas antes de enviar una solicitud al equipo.",
      en: "Choose it to explore possibilities or answer quick questions before sending a request to the team.",
      fr: "Choisissez-le pour explorer les possibilités ou obtenir une réponse rapide avant d'envoyer votre demande.",
    },
  },
  {
    id: "appointment",
    icon: Calendar,
    title: {
      es: "Cita previa",
      en: "Book appointment",
      fr: "Prendre rendez-vous",
    },
    description: {
      es: "Una conversación personal con un especialista de Xaluca Tours en el día y la hora que reserves.",
      en: "A personal conversation with a Xaluca Tours specialist on the day and time you book.",
      fr: "Un échange personnel avec un spécialiste Xaluca Tours au jour et à l'heure que vous réservez.",
    },
    bestFor: {
      es: "Elígela si prefieres hablar, tienes una solicitud compleja o quieres que te guiemos desde el principio.",
      en: "Choose it if you prefer to talk, have a complex request or want guidance from the beginning.",
      fr: "Choisissez-la si vous préférez échanger de vive voix, avez une demande complexe ou souhaitez être guidé dès le début.",
    },
  },
];

export const ContactOptionsInfoModal = ({ open, onOpenChange, onSelect }) => {
  const { lang } = useLanguage();

  const selectOption = (optionId) => {
    onSelect?.(optionId);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        data-testid="contact-options-info-modal"
        overlayClassName="z-[190]"
        closeLabel={pick(COPY.closeLabel, lang)}
        className="z-[200] w-[calc(100%-2rem)] max-w-3xl max-h-[92vh] overflow-y-auto gap-0 border border-[#2C2621]/10 bg-[#FDFBF7] p-0 text-[#2C2621] shadow-[0_30px_80px_-30px_rgba(26,21,19,0.65)] sm:rounded-none"
      >
        <div className="border-b border-[#2C2621]/10 px-6 py-7 pr-14 sm:px-10 sm:py-9 sm:pr-16">
          <div className="inline-flex items-center gap-2 text-[#C16542]">
            <HelpCircle className="h-4 w-4" strokeWidth={1.7} aria-hidden="true" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.3em]">
              {pick(COPY.eyebrow, lang)}
            </span>
          </div>
          <DialogTitle className="mt-4 font-serif-x text-3xl font-normal leading-[1.05] tracking-tight text-[#2C2621] sm:text-4xl">
            {pick(COPY.title, lang)}
          </DialogTitle>
          <DialogDescription className="mt-4 max-w-2xl text-sm leading-relaxed text-[#2C2621]/70 sm:text-[15px]">
            {pick(COPY.intro, lang)}
          </DialogDescription>
        </div>

        <div className="grid gap-px bg-[#2C2621]/10 sm:grid-cols-2">
          {OPTIONS.map(({ id, icon: Icon, title, description, bestFor }) => (
            <article key={id} className="flex flex-col bg-[#FDFBF7] p-6 sm:p-7">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#C16542]/10 text-[#C16542]">
                <Icon className="h-[18px] w-[18px]" strokeWidth={1.6} aria-hidden="true" />
              </span>
              <h3 className="mt-4 font-serif-x text-xl leading-tight">{pick(title, lang)}</h3>
              <p className="mt-2 text-[13px] leading-relaxed text-[#2C2621]/65">{pick(description, lang)}</p>
              <p className="mt-3 flex-1 border-l-2 border-[#C16542]/35 pl-3 text-[12px] leading-relaxed text-[#2C2621]/80">
                {pick(bestFor, lang)}
              </p>
              <button
                type="button"
                onClick={() => selectOption(id)}
                data-testid={`contact-options-select-${id}`}
                className="mt-5 inline-flex items-center justify-center border border-[#2C2621]/20 px-4 py-3 text-[10px] uppercase tracking-[0.2em] transition-colors hover:border-[#C16542] hover:bg-[#C16542] hover:text-[#FDFBF7]"
              >
                {pick(COPY.choose, lang)}
              </button>
            </article>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContactOptionsInfoModal;
