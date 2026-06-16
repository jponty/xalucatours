import React, { useState } from "react";
import { Compass, MessageCircle, Headset } from "lucide-react";
import { useLanguage, pick } from "@/contexts/LanguageContext";
import EditableText from "@/components/EditableText";
import { useSlotId } from "@/components/slotScope";
import PlannerForm from "@/components/PlannerForm";
import ContactForm from "@/components/ContactForm";

/* ============================================================
   FormTabs — tabbed switcher between the detailed trip planner
   and the quick contact form. Embedded on /planifica-tu-viaje
   and /contacto. Default tab is configurable.
============================================================ */

const TABS_COPY = {
  detailed: { es: "Planificación detallada", en: "Detailed planner", fr: "Planification détaillée" },
  quick:    { es: "Contacto rápido", en: "Quick contact", fr: "Contact rapide" },
  assistant:{ es: "Asistente Virtual", en: "Virtual Assistant", fr: "Assistant Virtuel" },
  eyebrow:  { es: "Elige cómo contactarnos", en: "Choose how to reach us", fr: "Choisissez comment nous contacter" },
};

const ASSISTANT_PANEL = {
  title: {
    es: "Habla con nuestro Asistente Virtual",
    en: "Chat with our Virtual Assistant",
    fr: "Discutez avec notre Assistant Virtuel",
  },
  body: {
    es: "Resuelve tus dudas al instante, obtén recomendaciones personalizadas y consulta rutas, precios y alojamientos. Nuestro asistente virtual te orienta en tiempo real, paso a paso, para diseñar tu viaje a Marruecos.",
    en: "Get your questions answered instantly, receive personalised recommendations and check routes, prices and accommodation. Our virtual assistant guides you in real time, step by step, to design your trip to Morocco.",
    fr: "Obtenez des réponses instantanées, des recommandations personnalisées et consultez itinéraires, prix et hébergements. Notre assistant virtuel vous guide en temps réel, étape par étape, pour concevoir votre voyage au Maroc.",
  },
  cta: {
    es: "Abrir Asistente Virtual",
    en: "Open Virtual Assistant",
    fr: "Ouvrir l'Assistant Virtuel",
  },
};

// Open the Chatbase virtual assistant without leaving the page.
const openChatbaseAssistant = () => {
  if (window.chatbase && typeof window.chatbase.open === "function") {
    window.chatbase.open();
  } else {
    window.open("https://www.chatbase.co/0g0xD-K8_amm7Ihz-vPj2/help", "_blank", "noopener,noreferrer");
  }
};

/* Inline-CMS text helper, page-namespaced under the `formtabs` scope. */
const FT = ({ k, defaults, as = "span", className, multiline = false }) => {
  const slot = useSlotId(`formtabs.${k}`);
  return <EditableText slot={slot} defaults={defaults} as={as} className={className} multiline={multiline} />;
};

export default function FormTabs({ defaultTab = "detailed" }) {
  const { lang } = useLanguage();
  const [tab, setTab] = useState(defaultTab);

  const tabs = [
    { id: "detailed", Icon: Compass,        label: TABS_COPY.detailed },
    { id: "quick",    Icon: MessageCircle,  label: TABS_COPY.quick },
    { id: "assistant",Icon: Headset,        label: TABS_COPY.assistant },
  ];

  return (
    <div data-testid="form-tabs" id="contact-forms">
      {/* Tab bar */}
      <div className="bg-[#FBF5EA] pt-16 md:pt-20 pb-1">
        <div className="max-w-5xl mx-auto px-6 md:px-12 text-center">
          <FT k="eyebrow" defaults={TABS_COPY.eyebrow} as="span"
              className="block text-[11px] tracking-[0.4em] uppercase text-[#C16542] mb-6" />
          <div role="tablist" className="flex items-stretch justify-center gap-0 flex-wrap">
            {tabs.map((t) => {
              const active = tab === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  data-testid={`form-tab-${t.id}`}
                  onClick={() => setTab(t.id)}
                  className={`inline-flex items-center gap-2.5 px-6 sm:px-9 py-4 text-[10px] sm:text-[11px] tracking-[0.28em] uppercase border-2 transition-colors ${
                    active
                      ? "bg-[#2C2621] text-[#FDFBF7] border-[#2C2621]"
                      : "bg-transparent text-[#5C5248] border-[#2C2621]/20 hover:border-[#2C2621]/50 hover:text-[#2C2621]"
                  }`}
                >
                  <t.Icon className="w-4 h-4" strokeWidth={1.7} />
                  <FT k={t.id} defaults={t.label} as="span" />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Active panel */}
      {tab === "detailed" && (
        <div className="bg-[#FBF5EA] pt-12 pb-20 md:pb-28" data-testid="form-tab-panel-detailed" role="tabpanel">
          <PlannerForm />
        </div>
      )}
      {tab === "quick" && (
        <div className="bg-[#FBF5EA] pt-12 md:pt-16" data-testid="form-tab-panel-quick" role="tabpanel">
          <ContactForm />
        </div>
      )}
      {tab === "assistant" && (
        <div className="bg-[#FBF5EA] pt-12 pb-20 md:pb-28" data-testid="form-tab-panel-assistant" role="tabpanel">
          <div className="max-w-2xl mx-auto px-6 md:px-12 text-center">
            <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#2C2621] text-[#FDFBF7] mb-7">
              <Headset className="w-7 h-7" strokeWidth={1.6} />
            </span>
            <FT k="assistant.title" defaults={ASSISTANT_PANEL.title} as="h3"
                className="font-serif-x text-2xl md:text-3xl leading-tight tracking-tight text-[#2C2621] block" />
            <FT k="assistant.body" defaults={ASSISTANT_PANEL.body} as="p" multiline
                className="mt-5 text-base text-[#5C5248] leading-relaxed block" />
            <button
              type="button"
              onClick={openChatbaseAssistant}
              data-testid="form-tab-assistant-open"
              className="mt-9 inline-flex items-center gap-2.5 px-9 py-4 text-[10px] sm:text-[11px] tracking-[0.28em] uppercase border-2 bg-[#2C2621] text-[#FDFBF7] border-[#2C2621] hover:bg-[#C16542] hover:border-[#C16542] transition-colors"
            >
              <Headset className="w-4 h-4" strokeWidth={1.7} />
              {pick(ASSISTANT_PANEL.cta, lang)}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
