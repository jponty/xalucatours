import React, { useState } from "react";
import { Compass, MessageCircle } from "lucide-react";
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
  eyebrow:  { es: "Elige cómo contactarnos", en: "Choose how to reach us", fr: "Choisissez comment nous contacter" },
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
      {tab === "detailed" ? (
        <div className="bg-[#FBF5EA] pt-12 pb-20 md:pb-28" data-testid="form-tab-panel-detailed" role="tabpanel">
          <PlannerForm />
        </div>
      ) : (
        <div data-testid="form-tab-panel-quick" role="tabpanel">
          <ContactForm />
        </div>
      )}
    </div>
  );
}
