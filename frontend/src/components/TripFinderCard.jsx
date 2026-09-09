import React, { useId } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, Heart, Sparkles } from "lucide-react";
import ExpandableTripCard from "@/components/ExpandableTripCard";
import { FromPrice } from "@/components/FromPrice";
import TripImageCarousel from "@/components/TripImageCarousel";
import { pathFor } from "@/lib/routes";
import { nodeName, tt } from "@/lib/tripFinder";
import { tripFinderPreview } from "@/lib/tripFinderPreview";
import monogramWhite from "@/assets/monograma-x-white.png";
import monogramBorder from "@/assets/monograma-x-borde.png";

const T = (es, en, fr) => ({ es, en, fr });
const COPY = {
  view: T("Ver viaje", "View trip", "Voir le voyage"),
  fav: T("Guardar en favoritos", "Save to favourites", "Enregistrer dans mes favoris"),
  favRemove: T("Quitar de favoritos", "Remove from favourites", "Retirer des favoris"),
  nights: T("noches", "nights", "nuits"),
  days: T("días", "days", "jours"),
};

export default function TripFinderCard({ trip, images, chip, lang, favorite, onToggleFavorite }) {
  const id = useId();
  const titleId = `${id}-title`;
  const title = tt(trip.name, lang);
  const href = pathFor(lang, trip.routeId);
  const L = (key) => tt(COPY[key], lang);
  const preview = tripFinderPreview(trip, lang);

  return (
    <ExpandableTripCard title={title} titleId={titleId} href={href} lang={lang} {...preview}
      testIds={Object.fromEntries(["card", "more", "details", "description", "details-cta"].map((key) => [key, `trip-finder-${key}-${trip.routeId}`]))}
    >
      <div data-trip-card-image="" className="min-w-0">
      <TripImageCarousel
        images={images} title={title} lang={lang}
        className="aspect-[4/3] bg-[#1A1513]"
        imageClassName="transition-transform duration-[900ms] group-hover:scale-105 motion-reduce:transform-none motion-reduce:transition-none"
        priorityFirst showBadge={false} showCount={false}
        testidPrefix={`trip-finder-carousel-${trip.routeId}`}
      >
        {/* Keep the image link inside the carousel so swipes reach its handler.
            The carousel controls and favourite button sit above this layer. */}
        <Link to={href} tabIndex={-1} aria-hidden="true" className="absolute inset-0 z-[3]" data-testid={`trip-finder-image-link-${trip.routeId}`} />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1513]/70 via-transparent to-transparent pointer-events-none" />
        <img src={monogramBorder} alt="" aria-hidden="true" data-testid={`trip-finder-monogram-${trip.routeId}`}
          className="pointer-events-none absolute bottom-0 right-0 z-[2] h-[118%] w-auto max-w-none select-none object-contain opacity-[0.22] drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)]" />
        {chip && <span className="pointer-events-none absolute top-3 left-3 z-[4] inline-flex max-w-[calc(100%-4.5rem)] items-center gap-1.5 bg-[#C16542] text-[#FDFBF7] px-2.5 py-1.5 text-[9px] tracking-[0.2em] uppercase shadow-md">
          <Sparkles className="w-3 h-3 shrink-0" strokeWidth={1.9} /><span className="min-w-0 break-words">{chip}</span>
        </span>}
        <button type="button" onClick={(event) => { event.preventDefault(); event.stopPropagation(); onToggleFavorite(trip.routeId); }}
          data-testid={`trip-finder-fav-${trip.routeId}`} aria-pressed={favorite} aria-label={L(favorite ? "favRemove" : "fav")} title={L(favorite ? "favRemove" : "fav")}
          className={`absolute top-3 right-3 z-10 inline-flex items-center justify-center w-9 h-9 rounded-full backdrop-blur shadow-md transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C16542] ${favorite ? "bg-[#C16542] text-[#FDFBF7]" : "bg-[#FDFBF7]/90 text-[#C16542] hover:bg-[#C16542] hover:text-[#FDFBF7]"}`}>
          <Heart className="w-4 h-4 transition-transform active:scale-90" strokeWidth={1.7} fill={favorite ? "currentColor" : "none"} />
        </button>
        <span className="pointer-events-none absolute bottom-3 right-3 z-[4] max-w-[calc(100%-4.5rem)] bg-[#1A1513]/80 backdrop-blur-sm text-[#FDFBF7] px-2.5 py-1 text-[10px] tracking-[0.18em] uppercase tabular-nums">
          {trip.days - 1} {L("nights")} · {trip.days} {L("days")}
        </span>
        <span className="pointer-events-none absolute bottom-3 left-3 z-[4] w-9 h-9 rounded-full bg-[#1A1513]/45 backdrop-blur-sm ring-1 ring-[#FDFBF7]/25 flex items-center justify-center shadow-md">
          <img src={monogramWhite} alt="Xaluca Tours" className="w-5 h-5 object-contain" loading="lazy" />
        </span>
      </TripImageCarousel>
      </div>

      <div className="relative min-w-0 p-4 sm:p-5">
        <Link to={href} aria-labelledby={titleId} data-testid={`trip-finder-main-link-${trip.routeId}`}
          className="absolute inset-0 z-[1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#C16542]" />
        <h3 id={titleId} className="break-words font-serif-x text-[#2C2621] text-xl leading-snug group-hover:text-[#C16542] transition-colors">{title}</h3>
        <p className="mt-2 inline-flex flex-wrap items-center gap-1.5 text-[12px] text-[#8A7C64] tracking-wide">
          {nodeName(trip.entry, lang)}<ArrowRight className="w-3 h-3 shrink-0" strokeWidth={1.8} />{nodeName(trip.exit, lang)}
        </p>
        <div className="mt-4 pt-4 border-t border-[#2C2621]/10 flex flex-wrap items-center justify-between gap-3">
          <div className="relative z-[2]"><FromPrice tone="dark" layout="stacked" routeId={trip.routeId} testid={`trip-finder-price-${trip.routeId}`} /></div>
          <Link to={href} className="relative z-[2] inline-flex min-h-11 items-center gap-1.5 text-[11px] tracking-[0.2em] uppercase text-[#2C2621] hover:text-[#C16542] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C16542]">
            {L("view")}<ArrowUpRight className="w-3.5 h-3.5 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={1.8} />
          </Link>
        </div>
      </div>

    </ExpandableTripCard>
  );
}
