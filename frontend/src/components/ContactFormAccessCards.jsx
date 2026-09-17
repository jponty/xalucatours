import React from "react";
import { ArrowRight, Compass, MessageCircle } from "lucide-react";
import { E } from "@/components/EditableSection";

const OPTIONS = [
  {
    id: "quick",
    Icon: MessageCircle,
    title: { es: "Contacto rápido", en: "Quick contact", fr: "Contact rapide" },
    body: {
      es: "Para realizar una consulta rápida o hablar directamente con nuestro equipo.",
      en: "For a quick question or to speak directly with our team.",
      fr: "Pour poser une question rapide ou échanger directement avec notre équipe.",
    },
    cta: { es: "Contacto rápido", en: "Quick contact", fr: "Contact rapide" },
  },
  {
    id: "detailed",
    Icon: Compass,
    title: { es: "Planificación detallada", en: "Detailed planning", fr: "Planification détaillée" },
    body: {
      es: "Cuéntanos tu viaje, fechas, preferencias y necesidades para que podamos preparar una propuesta más personalizada.",
      en: "Tell us about your trip, dates, preferences and needs so we can prepare a more personalised proposal.",
      fr: "Parlez-nous de votre voyage, de vos dates, de vos préférences et de vos besoins pour une proposition plus personnalisée.",
    },
    cta: { es: "Planificar mi viaje", en: "Plan my trip", fr: "Planifier mon voyage" },
  },
];

export default function ContactFormAccessCards({ onSelectForm }) {
  return (
    <div data-testid="contact-form-access" className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
      {OPTIONS.map(({ id, Icon, title, body, cta }) => (
        <article
          key={id}
          data-testid={`contact-access-${id}`}
          aria-labelledby={`contact-access-${id}-title`}
          className={`flex min-w-0 flex-col border p-6 ${id === "detailed"
            ? "border-[#C16542]/30 bg-[#F7F0E6]"
            : "border-[#2C2621]/15 bg-white"}`}
        >
          <span className={`mb-5 flex h-10 w-10 items-center justify-center ${id === "detailed"
            ? "bg-[#C16542] text-white"
            : "bg-[#2C2621] text-[#FDFBF7]"}`} aria-hidden="true">
            <Icon className="h-5 w-5" strokeWidth={1.6} />
          </span>
          <h3 id={`contact-access-${id}-title`} className="font-serif-x text-2xl leading-tight text-[#2C2621]">
            <E name={`contact.access.${id}.title`} defaults={title} multiline={false} />
          </h3>
          <E name={`contact.access.${id}.body`} defaults={body} as="p"
            className="mb-6 mt-3 flex-1 text-sm leading-relaxed text-[#5C5248]" />
          <button
            type="button"
            data-testid={`contact-access-${id}-cta`}
            aria-controls="contact-forms"
            onClick={() => onSelectForm(id)}
            className={`inline-flex min-h-12 w-full min-w-0 items-center justify-between gap-3 border px-4 py-3 text-left text-[10px] font-semibold uppercase leading-relaxed tracking-[0.16em] transition-colors motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C16542] focus-visible:ring-offset-2 ${id === "detailed"
              ? "border-[#C16542] bg-[#C16542] text-white hover:border-[#A35133] hover:bg-[#A35133]"
              : "border-[#2C2621] text-[#2C2621] hover:bg-[#2C2621] hover:text-[#FDFBF7]"}`}
          >
            <E name={`contact.access.${id}.cta`} defaults={cta} multiline={false} className="min-w-0 break-words" />
            <ArrowRight className="h-4 w-4 shrink-0" strokeWidth={1.7} aria-hidden="true" />
          </button>
        </article>
      ))}
    </div>
  );
}
