/* ============================================================
   BookingSession — reusable "Reserva tu sesión" booking block.
   ------------------------------------------------------------
   Single source of truth shared by:
     • /citaprevia  (CitaPreviaPage)
     • /planifica-tu-viaje  (FormTabs → "Cita previa" tab)

   Holds its own phone/office tab state, loads the Calendly script
   and renders the two Calendly inline widgets. All copy is CMS-
   editable through ABSOLUTE slot ids ("citaprevia.booking.*") so a
   change made in one place reflects automatically in both.
============================================================ */
import React, { useState } from "react";
import { Phone, MapPin } from "lucide-react";
import EditableText from "@/components/EditableText";
import { CalendlyEmbed, useCalendlyScript, CALENDLY_PHONE, CALENDLY_OFFICE } from "@/components/CalendlyEmbed";

export const BOOKING_COPY = {
  eyebrow: { es: "Reserva tu sesión", en: "Book your session", fr: "Réservez votre séance" },
  title: { es: "Selecciona el día y la hora", en: "Select the day and time", fr: "Choisissez le jour et l'heure" },
  body: {
    es: "Elige una sesión telefónica para el día y la hora que mejor te convenga, o reserva una visita a nuestras oficinas en Tremp para planificar tu próxima aventura cara a cara.",
    en: "Choose a phone session at a time that suits you, or book a visit to our offices in Tremp to plan your next adventure face to face.",
    fr: "Choisissez une séance téléphonique quand cela vous convient, ou réservez une visite à nos bureaux de Tremp pour planifier votre prochaine aventure en personne.",
  },
  tabPhone: { es: "Sesión telefónica", en: "Phone session", fr: "Séance téléphonique" },
  tabOffice: { es: "Visita en oficina", en: "Visit at our office", fr: "Visite au bureau" },
};

/* Absolute slot ids → identical content on every host page. */
const SLOT = (k) => `citaprevia.booking.${k}`;

export default function BookingSession({ testid = "booking-session" }) {
  const [tab, setTab] = useState("phone");
  useCalendlyScript();

  return (
    <div data-testid={testid} className="max-w-6xl mx-auto px-6 md:px-12">
      <div className="text-center max-w-3xl mx-auto mb-10">
        <EditableText slot={SLOT("eyebrow")} defaults={BOOKING_COPY.eyebrow} multiline={false} as="span"
          className="block text-[11px] tracking-[0.4em] uppercase text-[#C16542] mb-4" />
        <EditableText slot={SLOT("title")} defaults={BOOKING_COPY.title} multiline={false} as="h2"
          className="font-serif text-3xl md:text-4xl lg:text-5xl text-[#2C2621] leading-tight tracking-tight" />
        <EditableText slot={SLOT("body")} defaults={BOOKING_COPY.body} as="p"
          className="mt-5 text-[14px] md:text-base text-[#5C5248] leading-relaxed" />
      </div>

      <div role="tablist" className="flex items-stretch justify-center gap-0 mb-8">
        {[
          { id: "phone", Icon: Phone, slot: "tabPhone", label: BOOKING_COPY.tabPhone, testid: "tab-phone" },
          { id: "office", Icon: MapPin, slot: "tabOffice", label: BOOKING_COPY.tabOffice, testid: "tab-office" },
        ].map((tb) => {
          const active = tab === tb.id;
          return (
            <button
              key={tb.id}
              type="button"
              role="tab"
              aria-selected={active}
              data-testid={`booking-${tb.testid}`}
              onClick={() => setTab(tb.id)}
              className={`inline-flex items-center gap-2 px-6 sm:px-8 py-3.5 text-[10px] sm:text-[11px] tracking-[0.28em] uppercase border-2 transition-colors ${
                active
                  ? "bg-[#2C2621] text-[#FDFBF7] border-[#2C2621]"
                  : "bg-transparent text-[#5C5248] border-[#2C2621]/20 hover:border-[#2C2621]/50 hover:text-[#2C2621]"
              }`}
            >
              <tb.Icon className="w-3.5 h-3.5" strokeWidth={1.7} />
              <EditableText slot={SLOT(tb.slot)} defaults={tb.label} multiline={false} as="span" />
            </button>
          );
        })}
      </div>

      <div className="bg-[#FDFBF7] border border-[#2C2621]/10 p-3 md:p-4">
        {tab === "phone"
          ? <CalendlyEmbed url={CALENDLY_PHONE} testid="booking-calendly-phone" />
          : <CalendlyEmbed url={CALENDLY_OFFICE} testid="booking-calendly-office" />}
      </div>
    </div>
  );
}
