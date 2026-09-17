import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BedDouble, CalendarDays, Route, Sparkles } from "lucide-react";
import { pick } from "@/contexts/LanguageContext";
import { pathFor } from "@/lib/routes";
import { setTripContext } from "@/lib/tripContext";

const COPY = {
  eyebrow: { es: "Marruecos a tu medida", en: "Morocco, made for you", fr: "Le Maroc sur mesure" },
  title: { es: "Un itinerario para inspirarte.", en: "An itinerary to inspire you.", fr: "Un itinéraire pour vous inspirer." },
  titleAccent: { es: "Un viaje a tu medida.", en: "A journey to make your own.", fr: "Un voyage à votre mesure." },
  body: {
    es: "En Xaluca Tours, los itinerarios no son cerrados. Este recorrido es un punto de partida: podemos personalizarlo y adaptarlo a tus necesidades, tus preferencias y tu forma de viajar.",
    en: "At Xaluca Tours, itineraries are not set in stone. This route is a starting point: we can personalise it around your needs, preferences and the way you like to travel.",
    fr: "Chez Xaluca Tours, les itinéraires ne sont pas figés. Ce parcours est un point de départ : nous pouvons le personnaliser selon vos besoins, vos envies et votre façon de voyager.",
  },
  optionsTitle: { es: "¿Qué podemos adaptar?", en: "What can we tailor?", fr: "Que pouvons-nous adapter ?" },
  invitation: {
    es: "Cuéntanos qué tienes en mente. Diseñamos el viaje contigo.",
    en: "Tell us what you have in mind. We will design the journey with you.",
    fr: "Parlez-nous de vos envies. Nous concevons le voyage avec vous.",
  },
  cta: { es: "Personaliza tu viaje", en: "Personalise your trip", fr: "Personnalisez votre voyage" },
};

const OPTIONS = [
  { icon: Route, label: { es: "Ruta y paradas", en: "Route and stops", fr: "Parcours et étapes" } },
  { icon: CalendarDays, label: { es: "Fechas y duración", en: "Dates and duration", fr: "Dates et durée" } },
  { icon: BedDouble, label: { es: "Alojamientos", en: "Accommodation", fr: "Hébergements" } },
  { icon: Sparkles, label: { es: "Experiencias", en: "Experiences", fr: "Expériences" } },
];

export default function TripCustomizationSection({ routeId, lang = "es" }) {
  const contactUrl = `${pathFor(lang, "contact")}${routeId ? `?trip=${encodeURIComponent(routeId)}` : ""}`;

  return (
    <section
      id="personaliza-tu-viaje"
      data-testid="trip-customization"
      aria-labelledby="trip-customization-title"
      className="scroll-mt-[172px] border-y border-[#2C2621]/10 bg-[#F7EFE2] px-5 py-12 sm:px-6 md:px-12 md:py-16"
    >
      <div className="mx-auto grid max-w-7xl overflow-hidden border border-[#2C2621]/15 bg-[#FDFBF7] shadow-[0_20px_55px_-35px_rgba(44,38,33,0.3)] lg:grid-cols-[1.3fr_1fr]">
        <div className="min-w-0 border-t-2 border-[#C16542] px-6 py-8 sm:px-9 sm:py-10 lg:border-l-2 lg:border-t-0 lg:px-10">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#A35133]">
            {pick(COPY.eyebrow, lang)}
          </p>
          <h2 id="trip-customization-title" className="mt-4 font-serif-x text-[30px] leading-[1.12] tracking-tight text-[#2C2621] sm:text-4xl">
            {pick(COPY.title, lang)}
            <span className="mt-1 block font-serif-x-italic text-[#A35133]">{pick(COPY.titleAccent, lang)}</span>
          </h2>
          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-[#5C5248] sm:text-[15px] sm:leading-[1.8]">
            {pick(COPY.body, lang)}
          </p>
          <Link
            to={contactUrl}
            onClick={() => routeId && setTripContext([routeId])}
            data-testid="trip-customization-cta"
            className="group mt-7 inline-flex min-h-12 w-full items-center justify-center gap-3 bg-[#A35133] px-5 py-4 text-center text-[11px] font-semibold uppercase tracking-[0.15em] text-white transition-colors duration-200 hover:bg-[#843F28] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#A35133] motion-reduce:transition-none sm:w-auto sm:px-7"
          >
            {pick(COPY.cta, lang)}
            <ArrowRight className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transform-none motion-reduce:transition-none" strokeWidth={1.6} aria-hidden="true" />
          </Link>
        </div>

        <div className="flex min-w-0 flex-col justify-center bg-[#2C2621] px-6 py-8 text-[#FDFBF7] sm:px-9 sm:py-10 lg:px-10">
          <h3 className="font-serif-x text-2xl leading-tight sm:text-[28px]">{pick(COPY.optionsTitle, lang)}</h3>
          <ul className="mt-6 grid grid-cols-2 gap-x-5 gap-y-6 sm:gap-x-8">
            {OPTIONS.map(({ icon: Icon, label }, index) => (
              <li key={index} className="min-w-0 border-t border-[#D4A373]/30 pt-4">
                <Icon className="mb-3 h-5 w-5 text-[#D4A373]" strokeWidth={1.5} aria-hidden="true" />
                <span className="block text-[13px] leading-relaxed sm:text-sm">{pick(label, lang)}</span>
              </li>
            ))}
          </ul>
          <p className="mt-7 max-w-sm text-xs leading-relaxed text-[#E5D9C9] sm:text-[13px]">{pick(COPY.invitation, lang)}</p>
        </div>
      </div>
    </section>
  );
}
