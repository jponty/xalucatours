import React, { useState, useEffect } from "react";
import { Phone, Clock, Mail } from "lucide-react";
import EditableText from "@/components/EditableText";

const CALL_LABEL = { es: "Llámanos", en: "Call us", fr: "Appelez-nous" };
const PHONE = { es: "+34 937 268 366", en: "+34 937 268 366", fr: "+34 937 268 366" };
const HOURS_LABEL = { es: "Horario de oficina", en: "Office hours", fr: "Heures de bureau" };
const HOURS = {
  es: "Lunes a viernes de 10:00 a 20:00 h",
  en: "Monday to Friday, 10:00–20:00",
  fr: "Du lundi au vendredi, 10h–20h",
};
const EMAIL_LABEL = { es: "Escríbenos", en: "Email us", fr: "Écrivez-nous" };
const EMAIL = { es: "xalucatours@xaluca.com", en: "xalucatours@xaluca.com", fr: "xalucatours@xaluca.com" };

const SPAIN_LABEL = { es: "Hora España", en: "Spain time", fr: "Heure Espagne" };
const MOROCCO_LABEL = { es: "Hora Marruecos", en: "Morocco time", fr: "Heure Maroc" };

/* Real-time HH:MM (24h) for a given IANA timezone, updated every second. */
const useZoneClock = (timeZone) => {
  const fmt = () =>
    new Intl.DateTimeFormat("es-ES", {
      timeZone,
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(new Date());
  const [time, setTime] = useState(fmt);
  useEffect(() => {
    const id = setInterval(() => setTime(fmt()), 1000);
    return () => clearInterval(id);
  }, [timeZone]);
  return time;
};

/**
 * Slim contact bar sitting above the main header, on every page.
 * Dark espresso strip to stay clearly differentiated from the cream menu.
 */
export const TopInfoBar = () => {
  const spainTime = useZoneClock("Europe/Madrid");
  const moroccoTime = useZoneClock("Africa/Casablanca");
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

        {/* Spain clock */}
        <span className="hidden md:inline-flex items-center gap-2 whitespace-nowrap" data-testid="top-info-clock-spain">
          <Clock className="w-3.5 h-3.5 text-[#D4A373]" strokeWidth={1.8} />
          <span className="text-[#D4A373] uppercase tracking-[0.2em]">
            <EditableText slot="topbar.spain_label" defaults={SPAIN_LABEL} multiline={false} />
          </span>
          <span className="text-[#FDFBF7]/30">|</span>
          <span className="tabular-nums" data-testid="top-info-clock-spain-time">{spainTime}</span>
        </span>

        {/* Divider */}
        <span className="hidden md:inline-block w-px h-3.5 bg-[#FDFBF7]/20" aria-hidden="true" />

        {/* Morocco clock */}
        <span className="hidden md:inline-flex items-center gap-2 whitespace-nowrap" data-testid="top-info-clock-morocco">
          <Clock className="w-3.5 h-3.5 text-[#D4A373]" strokeWidth={1.8} />
          <span className="text-[#D4A373] uppercase tracking-[0.2em]">
            <EditableText slot="topbar.morocco_label" defaults={MOROCCO_LABEL} multiline={false} />
          </span>
          <span className="text-[#FDFBF7]/30">|</span>
          <span className="tabular-nums" data-testid="top-info-clock-morocco-time">{moroccoTime}</span>
        </span>

        {/* Divider */}
        <span className="hidden sm:inline-block w-px h-3.5 bg-[#FDFBF7]/20" aria-hidden="true" />

        {/* Email */}
        <a
          href="mailto:xalucatours@xaluca.com"
          data-testid="top-info-email"
          className="hidden sm:inline-flex items-center gap-2 hover:text-[#D4A373] transition-colors duration-300 whitespace-nowrap"
        >
          <Mail className="w-3.5 h-3.5 text-[#D4A373]" strokeWidth={1.8} />
          <span className="text-[#D4A373] uppercase tracking-[0.2em]">
            <EditableText slot="topbar.email_label" defaults={EMAIL_LABEL} multiline={false} />
          </span>
          <span className="text-[#FDFBF7]/30">|</span>
          <EditableText slot="topbar.email" defaults={EMAIL} multiline={false} />
        </a>
      </div>
    </div>
  );
};

export default TopInfoBar;
