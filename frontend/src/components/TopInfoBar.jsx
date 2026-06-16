import React from "react";
import { Link } from "react-router-dom";
import { Phone, Clock, Mail, MessageCircle } from "lucide-react";
import EditableText from "@/components/EditableText";
import { useLanguage } from "@/contexts/LanguageContext";
import { pathFor } from "@/lib/routes";

const CALL_LABEL = { es: "Llámanos", en: "Call us", fr: "Appelez-nous" };
const PHONE = { es: "+34 937 268 366", en: "+34 937 268 366", fr: "+34 937 268 366" };
const ASSISTANT_LABEL = { es: "Asistente Virtual", en: "Virtual Assistant", fr: "Assistant Virtuel" };
const HOURS_LABEL = { es: "Horario de oficina", en: "Office hours", fr: "Heures de bureau" };
const HOURS = {
  es: "Lunes a viernes de 10:00 a 20:00 h",
  en: "Monday to Friday, 10:00–20:00",
  fr: "Du lundi au vendredi, 10h–20h",
};
const EMAIL_LABEL = { es: "Escríbenos", en: "Email us", fr: "Écrivez-nous" };
const EMAIL = { es: "xalucatours@xaluca.com", en: "xalucatours@xaluca.com", fr: "xalucatours@xaluca.com" };

/**
 * Slim contact bar sitting above the main header, on every page.
 * Dark espresso strip to stay clearly differentiated from the cream menu.
 */
export const TopInfoBar = () => {
  const { lang } = useLanguage();

  // Open the Chatbase virtual assistant (same behaviour as the Contact page).
  const openAssistant = () => {
    if (window.chatbase && typeof window.chatbase.open === "function") {
      window.chatbase.open();
    } else {
      window.open("https://www.chatbase.co/0g0xD-K8_amm7Ihz-vPj2/help", "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="bg-[#2C2621] text-[#FDFBF7]/90 border-b border-black/20" data-testid="top-info-bar">
      <div className="max-w-7xl mx-auto px-5 md:px-12 h-8 md:h-9 flex items-center justify-center md:justify-end gap-4 md:gap-7 text-[10px] md:text-[11px] tracking-[0.1em]">
        {/* Phone */}
        <a
          href="tel:+34937268366"
          data-testid="top-info-phone"
          className="inline-flex items-center gap-2 hover:text-[#D4A373] transition-colors duration-300 whitespace-nowrap"
        >
          <Phone className="w-3.5 h-3.5 text-[#D4A373]" strokeWidth={1.8} />
          <span className="hidden sm:inline text-[#D4A373] uppercase tracking-[0.2em]">
            <EditableText slot="topbar.call_label" defaults={CALL_LABEL} multiline={false} />
          </span>
          <span className="hidden sm:inline text-[#FDFBF7]/30">|</span>
          <EditableText slot="topbar.phone" defaults={PHONE} multiline={false} />
        </a>

        {/* Virtual assistant — mobile only — opens the Chatbase chat */}
        <span className="sm:hidden inline-block w-px h-3.5 bg-[#FDFBF7]/20" aria-hidden="true" />
        <button
          type="button"
          onClick={openAssistant}
          data-testid="top-info-assistant"
          className="sm:hidden inline-flex items-center gap-2 hover:text-[#D4A373] transition-colors duration-300 whitespace-nowrap"
        >
          <MessageCircle className="w-3.5 h-3.5 text-[#D4A373]" strokeWidth={1.8} />
          <EditableText slot="topbar.assistant_label" defaults={ASSISTANT_LABEL} multiline={false} />
        </button>

        {/* Divider */}
        <span className="hidden sm:inline-block w-px h-3.5 bg-[#FDFBF7]/20" aria-hidden="true" />

        {/* Office hours */}
        <span className="hidden sm:inline-flex items-center gap-2 whitespace-nowrap" data-testid="top-info-hours">
          <Clock className="w-3.5 h-3.5 text-[#D4A373]" strokeWidth={1.8} />
          <span className="text-[#D4A373] uppercase tracking-[0.2em]">
            <EditableText slot="topbar.hours_label" defaults={HOURS_LABEL} multiline={false} />
          </span>
          <span className="text-[#FDFBF7]/30">|</span>
          <EditableText slot="topbar.hours" defaults={HOURS} multiline={false} />
        </span>

        {/* Divider */}
        <span className="hidden sm:inline-block w-px h-3.5 bg-[#FDFBF7]/20" aria-hidden="true" />

        {/* Email → links to the Contact page (no mailto) */}
        <Link
          to={pathFor(lang, "contact")}
          data-testid="top-info-email"
          className="hidden sm:inline-flex items-center gap-2 hover:text-[#D4A373] transition-colors duration-300 whitespace-nowrap"
        >
          <Mail className="w-3.5 h-3.5 text-[#D4A373]" strokeWidth={1.8} />
          <span className="text-[#D4A373] uppercase tracking-[0.2em]">
            <EditableText slot="topbar.email_label" defaults={EMAIL_LABEL} multiline={false} />
          </span>
          <span className="text-[#FDFBF7]/30">|</span>
          <EditableText slot="topbar.email" defaults={EMAIL} multiline={false} />
        </Link>
      </div>
    </div>
  );
};

export default TopInfoBar;
