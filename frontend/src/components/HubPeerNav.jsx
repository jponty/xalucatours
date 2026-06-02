import React from "react";
import EditableImage from "@/components/EditableImage";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useLanguage, pick } from "@/contexts/LanguageContext";
import { pathFor } from "@/lib/routes";
import { tripHeroSlot, tripHeroImage } from "@/lib/tripHero";
import {
  lookupProgram,
  hubLabel,
  peerPrograms,
  pickT,
} from "@/lib/programNav";

const COPY = {
  back:  { es: "Volver al hub", en: "Back to the hub", fr: "Retour au hub" },
  other: { es: "Otros programas de este hub", en: "Other programs in this hub", fr: "Autres programmes de ce hub" },
  cta:   { es: "Ver programa", en: "View program", fr: "Voir le programme" },
  empty: { es: "Esta opción es exclusiva de este hub.", en: "This option is exclusive to this hub.", fr: "Cette option est exclusive à ce hub." },
};

/* ----------------------------------------------------------------
   <HubPeerNav routeId={...} />
   Renders only when the routeId belongs to a wired hub.
   Mounted at the bottom of <ProgramTemplate /> (above the contact
   form). Provides:
     · "Volver al hub" CTA
     · A grid of peer programs (same hub, excluding current)
---------------------------------------------------------------- */
export default function HubPeerNav({ routeId }) {
  const { lang } = useLanguage();
  const nav = lookupProgram(routeId);
  if (!nav) return null;

  const { hub, hubRouteId } = nav;
  const peers = peerPrograms(hub, routeId);
  const hubHref = pathFor(lang, hubRouteId);
  const hubName = hubLabel(hub, lang);

  return (
    <section
      data-testid="hub-peer-nav"
      className="relative bg-[#F2EBE1] py-20 md:py-28 overflow-hidden"
    >
      <div className="absolute inset-0 berber-bg-diamond opacity-15 pointer-events-none" aria-hidden="true" />
      <div className="relative max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-12 md:mb-14">
          <div>
            <span className="overline">{pickT(COPY.other, lang)}</span>
            <h2 className="font-serif-x text-3xl md:text-4xl lg:text-5xl leading-[1.05] tracking-tight mt-4 text-[#2C2621] max-w-3xl">
              {hubName}
            </h2>
          </div>
          <Link
            to={hubHref}
            data-testid="hub-peer-nav-back"
            className="group inline-flex items-center gap-2.5 text-[10px] md:text-[11px] tracking-[0.25em] uppercase font-semibold text-[#2C2621] border-b border-[#2C2621]/30 pb-1.5 self-start md:self-auto hover:border-[#C16542] hover:text-[#C16542] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" strokeWidth={1.8} />
            {pickT(COPY.back, lang)}
          </Link>
        </div>

        {peers.length === 0 ? (
          <p className="text-[#5C5248] text-base">{pickT(COPY.empty, lang)}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {peers.map((p) => (
              <Link
                key={p.id}
                to={pathFor(lang, p.link)}
                data-testid={`hub-peer-program-${p.id}`}
                className="group relative flex flex-col bg-[#FDFBF7] border border-[#2C2621]/10 hover:border-[#2C2621]/30 overflow-hidden transition-all duration-500"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <EditableImage
                    slot={tripHeroSlot(p.link)}
                    fallback={tripHeroImage(p.link) || p.image}
                    alt={pick(p.blurb, lang) || ""}
                    aspectRatio="4/3"
                    imgProps={{ loading: "lazy" }}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.06]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A1513]/80 via-[#1A1513]/15 to-transparent pointer-events-none" />
                  <span className="film-grain" />
                  <div
                    className="absolute top-4 left-4 inline-flex items-center gap-2 bg-[#FDFBF7]/95 px-3 py-1.5 text-[11px] tracking-[0.18em] uppercase font-semibold"
                    style={{ color: p.accent || "#C16542" }}
                  >
                    {nightsToLabel(p.nights, lang)}
                  </div>
                </div>
                <div className="flex-1 p-5 md:p-6 flex flex-col">
                  <p className="text-[14px] text-[#5C5248] leading-[1.65] flex-1">
                    {pick(p.blurb, lang)}
                  </p>
                  <span
                    className="mt-5 inline-flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase font-semibold group-hover:gap-4 transition-all duration-300"
                    style={{ color: p.accent || "#C16542" }}
                  >
                    {pickT(COPY.cta, lang)}
                    <ArrowRight className="w-3 h-3" strokeWidth={1.8} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

const NIGHTS_LABEL = {
  "2n3d": { es: "2N · 3D", en: "2N · 3D", fr: "2N · 3J" },
  "3n4d": { es: "3N · 4D", en: "3N · 4D", fr: "3N · 4J" },
  "4n5d": { es: "4N · 5D", en: "4N · 5D", fr: "4N · 5J" },
  "5n6d": { es: "5N · 6D", en: "5N · 6D", fr: "5N · 6J" },
  "6n7d": { es: "6N · 7D", en: "6N · 7D", fr: "6N · 7J" },
  "7n8d": { es: "7N · 8D", en: "7N · 8D", fr: "7N · 8J" },
  "8n9d": { es: "8N · 9D", en: "8N · 9D", fr: "8N · 9J" },
  "9n10d":{ es: "9N · 10D", en: "9N · 10D", fr: "9N · 10J" },
};
const nightsToLabel = (n, lang) => pickT(NIGHTS_LABEL[n], lang) || (n || "").toUpperCase();
