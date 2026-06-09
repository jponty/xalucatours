import React from "react";
import { useLanguage, pick } from "@/contexts/LanguageContext";

/* ----------------------------------------------------------------
   <ProgramFlipbook src="..." />
   Branded "Folleto interactivo" section embedding a Publuu flipbook.
   Rendered inside <ProgramTemplate/> (before the TripOverview section)
   only for programs that pass a `flipbookSrc`. Responsive 4:3 embed.
---------------------------------------------------------------- */
const COPY = {
  eyebrow: { es: "Folleto interactivo", en: "Interactive brochure", fr: "Brochure interactive" },
  title: {
    es: "Hojea el programa completo",
    en: "Browse the full programme",
    fr: "Feuilletez le programme complet",
  },
  description: {
    es: "Pasa las páginas de nuestro folleto digital para ver el itinerario día a día, los alojamientos y todos los detalles del viaje.",
    en: "Flip through our digital brochure to see the day-by-day itinerary, accommodations and every trip detail.",
    fr: "Feuilletez notre brochure numérique pour découvrir l'itinéraire jour par jour, les hébergements et tous les détails du voyage.",
  },
};

export const ProgramFlipbook = ({ src }) => {
  const { lang } = useLanguage();
  if (!src) return null;
  return (
    <section
      data-testid="program-flipbook-section"
      className="relative bg-[#1A1513] py-20 md:py-28 overflow-hidden"
    >
      <div className="relative max-w-5xl mx-auto px-6 md:px-12">
        <span className="block text-[10px] tracking-[0.32em] uppercase text-[#D4A373]">
          {pick(COPY.eyebrow, lang)}
        </span>
        <h2 className="font-serif-x text-3xl md:text-4xl lg:text-5xl leading-[1.05] tracking-tight mt-4 text-[#FDFBF7]">
          {pick(COPY.title, lang)}
        </h2>
        <p className="mt-5 max-w-2xl text-base text-[#FDFBF7]/70 leading-relaxed">
          {pick(COPY.description, lang)}
        </p>

        <div
          className="relative w-full mt-10 overflow-hidden bg-black shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)] ring-1 ring-[#FDFBF7]/10"
          style={{ aspectRatio: "4 / 3" }}
        >
          <iframe
            src={src}
            title={pick(COPY.title, lang)}
            data-testid="program-flipbook-iframe"
            loading="lazy"
            scrolling="no"
            frameBorder="0"
            allow="clipboard-write; autoplay; fullscreen"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        </div>
      </div>
    </section>
  );
};

export default ProgramFlipbook;
