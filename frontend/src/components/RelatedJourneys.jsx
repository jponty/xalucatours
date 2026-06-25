import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Img from "@/components/Img";
import { useLanguage, pick } from "@/contexts/LanguageContext";
import { pathFor } from "@/lib/routes";
import { relatedJourneys, hubLabel, sectionLabel, pickT } from "@/lib/programNav";

/* ----------------------------------------------------------------
   <RelatedJourneys routeId={...} />
   "También te puede interesar" — cross-sell band that nudges a
   short-escape visitor toward longer, higher-value itineraries.
   Renders nothing when the routeId has no curated cross-sell.
   Mounted at the bottom of escapada pages (ProgramTemplate +
   EscapadaIntroPage), below HubPeerNav and above the contact form.
---------------------------------------------------------------- */
const COPY = {
  overline: { es: "También te puede interesar", en: "You may also like", fr: "Vous aimerez aussi" },
  title: { es: "Del escape al gran viaje.", en: "From a short escape to the grand journey.", fr: "De l'escapade au grand voyage." },
  body: {
    es: "Si tu escapada te ha sabido a poco, estos itinerarios más largos llevan la experiencia mucho más lejos.",
    en: "If your short escape left you wanting more, these longer journeys take the experience much further.",
    fr: "Si votre escapade vous a laissé sur votre faim, ces itinéraires plus longs vont bien plus loin.",
  },
  cta: { es: "Ver itinerario", en: "View itinerary", fr: "Voir l'itinéraire" },
};

export default function RelatedJourneys({ routeId }) {
  const { lang } = useLanguage();
  const items = relatedJourneys(routeId);
  if (!items || items.length === 0) return null;

  return (
    <section
      data-testid="related-journeys"
      className="relative bg-[#1A1513] text-[#FDFBF7] py-20 md:py-28 overflow-hidden"
    >
      <div className="absolute inset-0 berber-bg-diamond opacity-10 pointer-events-none" aria-hidden="true" />
      <div className="relative max-w-7xl mx-auto px-6 md:px-12">
        <div className="max-w-3xl mb-12 md:mb-16">
          <span className="overline text-[#D4A373]">{pickT(COPY.overline, lang)}</span>
          <h2 className="font-serif-x text-3xl md:text-4xl lg:text-5xl leading-[1.05] tracking-tight mt-4">
            {pickT(COPY.title, lang)}
          </h2>
          <p className="text-base md:text-lg text-[#FDFBF7]/70 leading-relaxed mt-5">
            {pickT(COPY.body, lang)}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {items.map(({ hubRouteId, section, hub }) => (
            <Link
              key={hubRouteId}
              to={pathFor(lang, hubRouteId)}
              data-testid={`related-journey-${hubRouteId}`}
              className="group relative overflow-hidden border border-white/10 hover:border-[#D4A373]/45 transition-colors duration-500"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Img
                  src={hub?.hero?.image}
                  alt={hubLabel(hub, lang)}
                  width={1280}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.06]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1513] via-[#1A1513]/45 to-transparent pointer-events-none" />
                <span className="film-grain" />
                <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                  <span className="overline text-[#D4A373]">{sectionLabel(section, lang)}</span>
                  <h3 className="font-serif-x text-2xl md:text-3xl leading-tight tracking-tight mt-2 max-w-md">
                    {hubLabel(hub, lang)}
                  </h3>
                  <p className="text-sm md:text-[15px] text-[#FDFBF7]/75 leading-relaxed mt-3 max-w-md line-clamp-2">
                    {pick(hub?.hero?.subtitle, lang)}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase font-semibold text-[#FDFBF7] group-hover:gap-4 transition-all duration-300">
                    {pickT(COPY.cta, lang)}
                    <ArrowRight className="w-3 h-3" strokeWidth={1.8} />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
