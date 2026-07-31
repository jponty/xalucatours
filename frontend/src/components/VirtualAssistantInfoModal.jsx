import React, { useEffect, useState } from "react";
import { ArrowRight, Bot, Compass, HelpCircle, Search, UserRound } from "lucide-react";
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
import {
  launchChatbaseAssistant,
  VIRTUAL_ASSISTANT_INFO_EVENT,
} from "@/lib/chatbase";

const COPY = {
  eyebrow: {
    es: "Asistente Virtual",
    en: "Virtual Assistant",
    fr: "Assistant Virtuel",
  },
  title: {
    es: "Encuentra rápidamente la información que necesitas",
    en: "Quickly find the information you need",
    fr: "Trouvez rapidement les informations dont vous avez besoin",
  },
  intro: {
    es: "Ponemos a tu disposición un asistente virtual para resolver preguntas generales, ofrecerte una primera orientación y ayudarte a localizar la información más útil para preparar tu viaje.",
    en: "Our virtual assistant can answer general questions, offer initial guidance and help you find the most useful information for planning your trip.",
    fr: "Notre assistant virtuel répond à vos questions générales, vous offre une première orientation et vous aide à trouver les informations utiles pour préparer votre voyage.",
  },
  close: {
    es: "Ahora no",
    en: "Not now",
    fr: "Pas maintenant",
  },
  continue: {
    es: "Abrir asistente",
    en: "Open assistant",
    fr: "Ouvrir l'assistant",
  },
  contact: {
    es: "Contactar con un agente",
    en: "Contact a travel agent",
    fr: "Contacter un conseiller",
  },
  personalTitle: {
    es: "¿Prefieres atención personalizada?",
    en: "Would you prefer personal assistance?",
    fr: "Vous préférez un accompagnement personnalisé ?",
  },
  personalBody: {
    es: "En cualquier momento puedes contactar directamente con un agente de viajes de Xaluca Tours para recibir asesoramiento personalizado sobre tu viaje.",
    en: "At any time, you can contact a Xaluca Tours travel agent directly for personalised advice about your trip.",
    fr: "À tout moment, vous pouvez contacter directement un conseiller Xaluca Tours pour bénéficier d'un accompagnement personnalisé.",
  },
  closeLabel: {
    es: "Cerrar",
    en: "Close",
    fr: "Fermer",
  },
};

const BENEFITS = [
  {
    icon: HelpCircle,
    title: {
      es: "Resuelve preguntas generales",
      en: "Answer general questions",
      fr: "Répondre aux questions générales",
    },
    body: {
      es: "Consulta información general sobre destinos, rutas, servicios, alojamientos y funcionamiento de los viajes.",
      en: "Ask general questions about destinations, routes, services, accommodation and how the trips work.",
      fr: "Posez vos questions générales sur les destinations, circuits, services, hébergements et le fonctionnement des voyages.",
    },
  },
  {
    icon: Compass,
    title: {
      es: "Recibe orientación inicial",
      en: "Get initial guidance",
      fr: "Recevoir une première orientation",
    },
    body: {
      es: "Explora posibilidades y aclara tus primeras dudas antes de solicitar una propuesta personalizada.",
      en: "Explore possibilities and clarify your first questions before requesting a personalised proposal.",
      fr: "Explorez les possibilités et clarifiez vos premières questions avant de demander une proposition personnalisée.",
    },
  },
  {
    icon: Search,
    title: {
      es: "Encuentra la información adecuada",
      en: "Find the right information",
      fr: "Trouver la bonne information",
    },
    body: {
      es: "Déjate guiar hacia las páginas, itinerarios y recursos del sitio que mejor respondan a lo que buscas.",
      en: "Get guided to the pages, itineraries and site resources that best match what you are looking for.",
      fr: "Soyez orienté vers les pages, itinéraires et ressources du site qui correspondent le mieux à votre recherche.",
    },
  },
];

export const VirtualAssistantInfoModal = () => {
  const { lang } = useLanguage();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const showModal = () => setOpen(true);
    window.addEventListener(VIRTUAL_ASSISTANT_INFO_EVENT, showModal);
    return () => window.removeEventListener(VIRTUAL_ASSISTANT_INFO_EVENT, showModal);
  }, []);

  const continueToAssistant = () => {
    setOpen(false);
    launchChatbaseAssistant();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        data-testid="virtual-assistant-info-modal"
        overlayClassName="z-[190]"
        closeLabel={pick(COPY.closeLabel, lang)}
        className="z-[200] w-[calc(100%-2rem)] max-w-2xl max-h-[92vh] overflow-y-auto gap-0 border border-[#2C2621]/10 bg-[#FDFBF7] p-0 text-[#2C2621] shadow-[0_30px_80px_-30px_rgba(26,21,19,0.65)] sm:rounded-none"
      >
        <div className="border-b border-[#2C2621]/10 px-6 py-7 pr-14 sm:px-10 sm:py-9 sm:pr-16">
          <div className="inline-flex items-center gap-2 text-[#C16542]">
            <Bot className="h-4 w-4" strokeWidth={1.7} aria-hidden="true" />
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
          <ul className="grid gap-6 sm:grid-cols-3 sm:gap-5">
            {BENEFITS.map(({ icon: Icon, title, body }) => (
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
          </ul>

          <div className="mt-8 flex gap-3 border border-[#C16542]/20 bg-[#C16542]/[0.06] p-5">
            <UserRound className="mt-0.5 h-5 w-5 shrink-0 text-[#C16542]" strokeWidth={1.6} aria-hidden="true" />
            <div>
              <h3 className="font-serif-x text-lg leading-tight">{pick(COPY.personalTitle, lang)}</h3>
              <p className="mt-1.5 text-[13px] leading-relaxed text-[#2C2621]/70">
                {pick(COPY.personalBody, lang)}
              </p>
            </div>
          </div>

          <div className="mt-7 flex flex-col-reverse gap-3 border-t border-[#2C2621]/10 pt-6 sm:flex-row sm:items-center sm:justify-end">
            <DialogClose asChild>
              <button
                type="button"
                data-testid="virtual-assistant-info-cancel"
                className="whitespace-nowrap px-4 py-3 text-[10px] uppercase tracking-[0.22em] text-[#2C2621]/60 transition-colors hover:text-[#C16542]"
              >
                {pick(COPY.close, lang)}
              </button>
            </DialogClose>
            <DialogClose asChild>
              <Link
                to={pathFor(lang, "contact")}
                data-testid="virtual-assistant-info-contact"
                className="inline-flex items-center justify-center whitespace-nowrap border border-[#2C2621]/20 px-5 py-3.5 text-[10px] uppercase tracking-[0.2em] text-[#2C2621] transition-colors hover:border-[#C16542] hover:text-[#C16542]"
              >
                {pick(COPY.contact, lang)}
              </Link>
            </DialogClose>
            <button
              type="button"
              onClick={continueToAssistant}
              data-testid="virtual-assistant-info-continue"
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap bg-[#C16542] px-6 py-3.5 text-[10px] uppercase tracking-[0.22em] text-[#FDFBF7] transition-colors hover:bg-[#A35133]"
            >
              {pick(COPY.continue, lang)}
              <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.7} aria-hidden="true" />
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VirtualAssistantInfoModal;
