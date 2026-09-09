import React from "react";
import { Link } from "react-router-dom";
import { Calendar, Check, Compass, Home } from "lucide-react";
import { useLanguage, pick } from "@/contexts/LanguageContext";
import { pathFor } from "@/lib/routes";

const COPY = {
  title: {
    es: "¡Recibido! Te respondemos en 24–48 h.",
    en: "Received! We will reply within 24–48 hours.",
    fr: "Bien reçu ! Nous vous répondrons sous 24–48 h.",
  },
  receivedBefore: {
    es: "Hemos recibido tu solicitud correctamente. Nuestro equipo la revisará y se pondrá en contacto contigo en un plazo de ",
    en: "We have received your request successfully. Our team will review it and contact you within ",
    fr: "Nous avons bien reçu votre demande. Notre équipe l’examinera et vous contactera sous ",
  },
  receivedTime: {
    es: "24–48 horas",
    en: "24–48 hours",
    fr: "24–48 heures",
  },
  meanwhile: {
    es: "Mientras tanto, puedes descubrir todos nuestros viajes o reservar una cita previa con nuestro equipo.",
    en: "In the meantime, you can discover all our trips or book an appointment with our team.",
    fr: "En attendant, vous pouvez découvrir tous nos voyages ou prendre rendez-vous avec notre équipe.",
  },
  home: { es: "Volver al inicio", en: "Back to home", fr: "Retour à l’accueil" },
  archive: { es: "Ver todos los viajes", en: "See all trips", fr: "Voir tous les voyages" },
  appointment: { es: "Reservar cita previa", en: "Book an appointment", fr: "Prendre rendez-vous" },
};

export default function LeadSubmissionSuccess({
  tone = "light",
  titleId,
  onNavigate,
  className = "",
}) {
  const { lang } = useLanguage();
  const dark = tone === "dark";
  const mutedText = dark ? "text-white/72" : "text-[#5C5248]";

  const destinations = [
    {
      key: "home",
      route: "home",
      Icon: Home,
      className: dark
        ? "border border-white/30 text-white hover:border-white hover:bg-white/10"
        : "border border-[#2C2621]/22 text-[#2C2621] hover:border-[#2C2621] hover:bg-[#2C2621]/5",
    },
    {
      key: "archive",
      route: "archive",
      Icon: Compass,
      className: dark
        ? "bg-[#FDFBF7] text-[#2C2621] hover:bg-white"
        : "bg-[#2C2621] text-white hover:bg-[#463C34]",
    },
    {
      key: "appointment",
      route: "appointment",
      Icon: Calendar,
      className: "bg-[#C16542] text-white hover:bg-[#A95336]",
    },
  ];

  return (
    <div className={`flex flex-col items-center text-center ${className}`} role="status" aria-live="polite">
      <span
        className={`inline-flex h-14 w-14 items-center justify-center rounded-full ${
          dark
            ? "border border-[#D4A373]/45 text-[#D4A373]"
            : "bg-[#C16542] text-white shadow-lg"
        }`}
        aria-hidden="true"
      >
        <Check className="h-6 w-6" strokeWidth={1.7} />
      </span>

      <span className={`mt-7 block text-[10px] font-semibold uppercase tracking-[0.3em] ${dark ? "text-[#D4A373]" : "text-[#C16542]"}`}>
        Xaluca Tours
      </span>
      <h2
        id={titleId}
        className={`mx-auto mt-4 max-w-2xl font-serif-x text-3xl font-normal leading-[1.08] sm:text-4xl md:text-5xl ${dark ? "text-white" : "text-[#2C2621]"}`}
      >
        {pick(COPY.title, lang)}
      </h2>
      <p className={`mx-auto mt-5 max-w-2xl text-sm leading-relaxed sm:text-base ${mutedText}`}>
        {pick(COPY.receivedBefore, lang)}
        <strong className={dark ? "font-semibold text-white" : "font-semibold text-[#2C2621]"}>
          {pick(COPY.receivedTime, lang)}
        </strong>
        .
      </p>
      <p className={`mx-auto mt-3 max-w-2xl text-sm leading-relaxed sm:text-base ${mutedText}`}>
        {pick(COPY.meanwhile, lang)}
      </p>

      <div className="mt-8 grid w-full max-w-3xl grid-cols-1 gap-3 sm:grid-cols-3">
        {destinations.map(({ key, route, Icon, className: buttonClass }) => (
          <Link
            key={key}
            to={pathFor(lang, route)}
            onClick={onNavigate}
            data-testid={`lead-success-${key}`}
            className={`inline-flex min-h-12 items-center justify-center gap-2 px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.16em] transition-colors sm:px-3 ${buttonClass}`}
          >
            <Icon className="h-4 w-4 shrink-0" strokeWidth={1.6} aria-hidden="true" />
            <span>{pick(COPY[key], lang)}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
