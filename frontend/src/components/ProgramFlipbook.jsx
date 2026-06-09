import React from "react";
import { useLocation } from "react-router-dom";
import { useLanguage, pick } from "@/contexts/LanguageContext";
import { resolvePath } from "@/lib/routes";
import { publuuSrcFor } from "@/lib/publuuCatalogues";

/* ----------------------------------------------------------------
   <ProgramFlipbook routeId="..." />  (or src="...")
   Branded "Folleto interactivo" section embedding the Publuu flipbook
   for the current trip page. Resolves the catalogue id by routeId
   (lib/publuuCatalogues.js); renders nothing when there is no id.

   Dark-Academia treatment: layered espresso gradient + deep green
   undertone + subtle Moroccan zellige (8-point star) pattern + grain
   + inner vignette — depth without hurting legibility.
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

/* Seamless Moroccan zellige — 8-point star (Rub el Hizb) lattice. */
const ARABIC_PATTERN = encodeURIComponent(
  "<svg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'>" +
  "<path d='M30 6L54 30L30 54L6 30Z M13 13H47V47H13Z " +
  "M0 -24L24 0L0 24L-24 0Z M-17 -17H17V17H-17Z " +
  "M60 -24L84 0L60 24L36 0Z M43 -17H77V17H43Z " +
  "M0 36L24 60L0 84L-24 60Z M-17 43H17V77H-17Z " +
  "M60 36L84 60L60 84L36 60Z M43 43H77V77H43Z' " +
  "fill='none' stroke='#D4A373' stroke-width='1.1'/></svg>"
);

export const ProgramFlipbook = ({ src, routeId }) => {
  const { lang } = useLanguage();
  const location = useLocation();
  const rid = routeId || resolvePath(location.pathname).routeId;
  const finalSrc = src || publuuSrcFor(rid);
  if (!finalSrc) return null;

  return (
    <section
      data-testid="program-flipbook-section"
      className="relative py-20 md:py-28 overflow-hidden"
      style={{ backgroundColor: "#14100C" }}
    >
      {/* Base espresso gradient (dark academia) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(125% 95% at 50% -10%, #2a2018 0%, #1b1510 48%, #100b08 100%)",
        }}
      />
      {/* Deep green undertone glow — bottom-right */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(70% 55% at 82% 105%, rgba(58,69,47,0.40) 0%, transparent 62%)",
        }}
      />
      {/* Warm bronze glow — top-left */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(55% 45% at 12% 0%, rgba(193,101,66,0.18) 0%, transparent 60%)",
        }}
      />
      {/* Subtle Arabic zellige pattern */}
      <div
        data-testid="program-flipbook-pattern"
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,${ARABIC_PATTERN}")`,
          backgroundSize: "58px 58px",
          opacity: 0.07,
          mixBlendMode: "screen",
        }}
      />
      {/* Film grain texture */}
      <span className="film-grain pointer-events-none" />
      {/* Inner vignette for depth */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ boxShadow: "inset 0 0 200px 50px rgba(0,0,0,0.65)" }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-12">
        <span className="inline-flex items-center gap-3 text-[10px] tracking-[0.32em] uppercase text-[#D4A373]">
          <span className="w-8 h-px bg-[#D4A373]/60" />
          {pick(COPY.eyebrow, lang)}
        </span>
        <h2 className="font-serif-x text-3xl md:text-4xl lg:text-5xl leading-[1.05] tracking-tight mt-4 text-[#F6EFE3]">
          {pick(COPY.title, lang)}
        </h2>
        <p className="mt-5 max-w-2xl text-base text-[#E8DECE]/70 leading-relaxed">
          {pick(COPY.description, lang)}
        </p>

        <div
          className="relative w-full mt-10 overflow-hidden bg-black/90 ring-1 ring-[#D4A373]/25 shadow-[0_40px_90px_-25px_rgba(0,0,0,0.85)]"
          style={{ aspectRatio: "4 / 3" }}
        >
          <iframe
            src={finalSrc}
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
