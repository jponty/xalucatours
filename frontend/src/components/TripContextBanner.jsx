/* ============================================================
   TripContextBanner — context confirmation banner shown on contact
   flows (planner / appointment / contact) when the visitor arrives
   with a `?trip=<routeId>` query param. It tells them which trip is
   in context, links back to the trip page to review the itinerary,
   and offers an X to discard the context.

   Resolves the trip via lib/tripContext (catalog + program registry),
   so ANY itinerary added later appears automatically — no edits here.
============================================================ */
import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Compass, ArrowUpRight, X } from "lucide-react";
import { useLanguage, pick } from "@/contexts/LanguageContext";
import { pathFor } from "@/lib/routes";
import { resolveTripContext, getTripParam } from "@/lib/tripContext";
import { optimizedSrc } from "@/lib/imageUrl";

const LABEL = { es: "Viaje en contexto", en: "Trip in context", fr: "Voyage en contexte" };
const REVIEW = { es: "Ver el itinerario", en: "View the itinerary", fr: "Voir l'itinéraire" };
const DISMISS = { es: "Quitar viaje", en: "Remove trip", fr: "Retirer le voyage" };

export default function TripContextBanner({ className = "" }) {
  const { lang } = useLanguage();
  const trip = useMemo(() => resolveTripContext(getTripParam(), lang), [lang]);
  const [dismissed, setDismissed] = useState(false);

  if (!trip || dismissed) return null;

  return (
    <div
      data-testid="trip-context-banner"
      className={`relative flex items-stretch bg-[#F8F2E6] border border-[#C16542]/25 ${className}`}
      style={{ borderLeft: "3px solid #C16542" }}
    >
      <Link
        to={pathFor(lang, trip.routeId)}
        data-testid="trip-context-link"
        className="group flex items-center gap-4 flex-1 min-w-0 px-5 py-4 md:px-6 md:py-5 hover:bg-[#F2EBE1] transition-colors"
      >
        {trip.image && (
          <img src={optimizedSrc(trip.image, 128)} alt="" loading="lazy" decoding="async" className="hidden sm:block w-16 h-16 object-cover shrink-0" />
        )}
        <div className="min-w-0">
          <span className="inline-flex items-center gap-2 text-[10px] tracking-[0.25em] uppercase text-[#C16542]">
            <Compass className="w-3.5 h-3.5" strokeWidth={1.7} />
            {pick(LABEL, lang)}
          </span>
          <p className="font-serif-x text-lg md:text-xl text-[#2C2621] leading-snug mt-1">
            <span className="align-middle">{trip.title}</span>
            {trip.durationLabel && (
              <span className="text-[#5C5248] text-sm md:text-base align-middle">{" · "}{trip.durationLabel}</span>
            )}
          </p>
          <span className="mt-1.5 inline-flex items-center gap-1 text-[10px] tracking-[0.18em] uppercase text-[#C16542] opacity-80 group-hover:opacity-100 transition-opacity">
            {pick(REVIEW, lang)}
            <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" strokeWidth={1.8} />
          </span>
        </div>
      </Link>
      <button
        type="button"
        onClick={() => setDismissed(true)}
        data-testid="trip-context-dismiss"
        aria-label={pick(DISMISS, lang)}
        title={pick(DISMISS, lang)}
        className="shrink-0 self-start m-2 inline-flex items-center justify-center w-8 h-8 rounded-full text-[#5C5248] hover:bg-[#2C2621] hover:text-[#FDFBF7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C16542] transition-colors"
      >
        <X className="w-4 h-4" strokeWidth={1.8} />
      </button>
    </div>
  );
}
