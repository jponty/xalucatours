import React, { useId, useState } from "react";
import { Compass, MessageCircle, Headset, Calendar, HelpCircle, Mic } from "lucide-react";
import { useLanguage, pick } from "@/contexts/LanguageContext";
import EditableText from "@/components/EditableText";
import { useSlotId } from "@/components/slotScope";
import PlannerForm from "@/components/PlannerForm";
import ContactForm from "@/components/ContactForm";
import DictationForm from "@/components/DictationForm";
import BookingSession from "@/components/BookingSession";
import ContactOptionsInfoModal from "@/components/ContactOptionsInfoModal";

/* ============================================================
   FormTabs — tabbed switcher between the detailed trip planner
   and the quick contact form. Embedded on /planifica-tu-viaje
   and /contacto. Default tab is configurable.
============================================================ */

const TABS_COPY = {
  detailed: { es: "Planificación detallada", en: "Detailed planner", fr: "Planification détaillée" },
  quick:    { es: "Contacto rápido", en: "Quick contact", fr: "Contact rapide" },
  dictation:{ es: "Dictado", en: "Dictation", fr: "Dictée" },
  assistant:{ es: "Asistente Virtual", en: "Virtual Assistant", fr: "Assistant Virtuel" },
  appointment:{ es: "Cita previa", en: "Book appointment", fr: "Prendre rendez-vous" },
  eyebrow:  { es: "Elige cómo contactarnos", en: "Choose how to reach us", fr: "Choisissez comment nous contacter" },
  help: {
    es: "¿Qué opción debo elegir?",
    en: "Which option should I choose?",
    fr: "Quelle option choisir ?",
  },
};

const ASSISTANT_PANEL = {
  title: {
    es: "Explora las opciones de nuestro Asistente Virtual",
    en: "Explore our Virtual Assistant's options",
    fr: "Explorez les options de notre Assistant Virtuel",
  },
  body: {
    es: "Identifícate y selecciona las opciones que te interesen para descubrir rutas, etapas e información práctica publicada por Xaluca Tours, con enlaces a sus fuentes. Cada elección te guía al siguiente paso. Si falta información, te ayudaremos a contactar con nuestro equipo.",
    en: "Enter your details and select the options that interest you to discover routes, stages and practical information published by Xaluca Tours, with links to their sources. Each choice guides you to the next step. If information is missing, we will help you contact our team.",
    fr: "Présentez-vous et sélectionnez les options qui vous intéressent pour découvrir les circuits, étapes et informations pratiques publiés par Xaluca Tours, avec leurs sources. Chaque choix vous guide vers l'étape suivante. Si des informations manquent, nous vous aiderons à contacter notre équipe.",
  },
  cta: {
    es: "Abrir Asistente Virtual",
    en: "Open Virtual Assistant",
    fr: "Ouvrir l'Assistant Virtuel",
  },
};

// Navigate to the site's virtual-assistant page (centralised in lib/chatbase).
import { openChatbaseAssistant } from "@/lib/chatbase";

/* Inline-CMS text helper, page-namespaced under the `formtabs` scope. */
const FT = ({ k, defaults, as = "span", className, multiline = false }) => {
  const slot = useSlotId(`formtabs.${k}`);
  return <EditableText slot={slot} defaults={defaults} as={as} className={className} multiline={multiline} />;
};

export default function FormTabs({ defaultTab = "detailed", activeTab, onTabChange, showOptionsInfo = false, optionsInfoInitiallyOpen = false }) {
  const { lang } = useLanguage();
  const tabsId = useId();
  const [internalTab, setInternalTab] = useState(defaultTab);
  const tab = activeTab ?? internalTab;
  const setTab = (nextTab) => {
    setInternalTab(nextTab);
    onTabChange?.(nextTab);
  };
  const [optionsInfoOpen, setOptionsInfoOpen] = useState(showOptionsInfo && optionsInfoInitiallyOpen);

  const tabs = [
    { id: "detailed", Icon: Compass,        label: TABS_COPY.detailed },
    { id: "quick",    Icon: MessageCircle,  label: TABS_COPY.quick },
    { id: "dictation",Icon: Mic,            label: TABS_COPY.dictation },
    { id: "assistant",Icon: Headset,        label: TABS_COPY.assistant },
    { id: "appointment", Icon: Calendar,    label: TABS_COPY.appointment },
  ];

  return (
    <div data-testid="form-tabs" id="contact-forms">
      {/* Tab bar */}
      <div className="bg-[#FBF5EA] pt-16 md:pt-20 pb-1">
        <div className="max-w-6xl mx-auto px-6 md:px-12 text-center">
          <FT k="eyebrow" defaults={TABS_COPY.eyebrow} as="span"
              className="block text-[11px] tracking-[0.4em] uppercase text-[#C16542] mb-6" />
          <div role="tablist" aria-label={pick(TABS_COPY.eyebrow, lang)} className="grid grid-cols-2 lg:grid-cols-5">
            {tabs.map((t) => {
              const active = tab === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  id={`${tabsId}-${t.id}`}
                  aria-controls={`${tabsId}-panel-${t.id}`}
                  aria-selected={active}
                  tabIndex={active ? 0 : -1}
                  data-testid={`form-tab-${t.id}`}
                  onClick={() => setTab(t.id)}
                  onKeyDown={event => {
                    const index = tabs.findIndex(item => item.id === t.id);
                    const next = event.key === "ArrowRight" ? (index + 1) % tabs.length : event.key === "ArrowLeft" ? (index + tabs.length - 1) % tabs.length : event.key === "Home" ? 0 : event.key === "End" ? tabs.length - 1 : null;
                    if (next === null) return;
                    event.preventDefault(); setTab(tabs[next].id);
                    document.getElementById(`${tabsId}-${tabs[next].id}`)?.focus();
                  }}
                  className={`inline-flex min-w-0 items-center justify-center gap-2 px-2 sm:px-4 py-4 text-[10px] sm:text-[11px] leading-relaxed tracking-[0.12em] uppercase border-2 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C16542] ${
                    active
                      ? "bg-[#2C2621] text-[#FDFBF7] border-[#2C2621]"
                      : "bg-transparent text-[#5C5248] border-[#2C2621]/20 hover:border-[#2C2621]/50 hover:text-[#2C2621]"
                  }`}
                >
                  <t.Icon className="w-4 h-4 shrink-0" strokeWidth={1.7} />
                  <FT k={t.id} defaults={t.label} as="span" />
                </button>
              );
            })}
          </div>
          {showOptionsInfo && (
            <button
              type="button"
              onClick={() => setOptionsInfoOpen(true)}
              data-testid="contact-options-info-button"
              aria-haspopup="dialog"
              className="mt-6 inline-flex items-center gap-2 border-b border-[#C16542]/45 pb-1 text-[10px] uppercase tracking-[0.22em] text-[#5C5248] transition-colors hover:border-[#C16542] hover:text-[#C16542]"
            >
              <HelpCircle className="h-4 w-4" strokeWidth={1.6} aria-hidden="true" />
              {pick(TABS_COPY.help, lang)}
            </button>
          )}
        </div>
      </div>

      {/* Active panel */}
      {tab === "detailed" && (
        <div id={`${tabsId}-panel-detailed`} aria-labelledby={`${tabsId}-detailed`} className="bg-[#FBF5EA] pt-12 pb-20 md:pb-28" data-testid="form-tab-panel-detailed" role="tabpanel">
          <PlannerForm />
        </div>
      )}
      {tab === "quick" && (
        <div id={`${tabsId}-panel-quick`} aria-labelledby={`${tabsId}-quick`} className="bg-[#FBF5EA] pt-12 md:pt-16" data-testid="form-tab-panel-quick" role="tabpanel">
          <ContactForm />
        </div>
      )}
      {tab === "dictation" && (
        <div id={`${tabsId}-panel-dictation`} aria-labelledby={`${tabsId}-dictation`} className="bg-[#FBF5EA] pt-10 pb-20 md:pt-12 md:pb-28" data-testid="form-tab-panel-dictation" role="tabpanel">
          <DictationForm />
        </div>
      )}
      {tab === "assistant" && (
        <div id={`${tabsId}-panel-assistant`} aria-labelledby={`${tabsId}-assistant`} className="bg-[#FBF5EA] pt-12 pb-20 md:pb-28" data-testid="form-tab-panel-assistant" role="tabpanel">
          <div className="max-w-2xl mx-auto px-6 md:px-12 text-center">
            <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#2C2621] text-[#FDFBF7] mb-7">
              <Headset className="w-7 h-7" strokeWidth={1.6} />
            </span>
            <FT k="assistant.guided.title" defaults={ASSISTANT_PANEL.title} as="h3"
                className="font-serif-x text-2xl md:text-3xl leading-tight tracking-tight text-[#2C2621] block" />
            <FT k="assistant.guided.body" defaults={ASSISTANT_PANEL.body} as="p" multiline
                className="mt-5 text-base text-[#5C5248] leading-relaxed block" />
            <button
              type="button"
              onClick={openChatbaseAssistant}
              data-testid="form-tab-assistant-open"
              className="xaluca-button mt-9 inline-flex items-center gap-2.5 px-9 py-4 text-[10px] sm:text-[11px] tracking-[0.28em] uppercase border-2 bg-[#2C2621] text-[#FDFBF7] border-[#2C2621] hover:bg-[#C16542] hover:border-[#C16542] transition-colors"
            >
              <Headset className="w-4 h-4" strokeWidth={1.7} />
              {pick(ASSISTANT_PANEL.cta, lang)}
            </button>
          </div>
        </div>
      )}
      {tab === "appointment" && (
        <div id={`${tabsId}-panel-appointment`} aria-labelledby={`${tabsId}-appointment`} className="bg-[#FBF5EA] pt-12 pb-20 md:pb-28" data-testid="form-tab-panel-appointment" role="tabpanel">
          <BookingSession testid="form-tab-booking-session" />
        </div>
      )}
      {showOptionsInfo && (
        <ContactOptionsInfoModal
          open={optionsInfoOpen}
          onOpenChange={setOptionsInfoOpen}
          onSelect={setTab}
        />
      )}
    </div>
  );
}
