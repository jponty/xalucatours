/* ============================================================
   FavoritosPage — /favoritos
   Lists every trip the visitor saved (local, no auth). Each card
   resolves via lib/tripContext so ANY itinerary appears automatically.
============================================================ */
import React from "react";
import { Link } from "react-router-dom";
import { Heart, ArrowUpRight, Compass, X } from "lucide-react";
import { useLanguage, pick } from "@/contexts/LanguageContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { resolveTripContext } from "@/lib/tripContext";
import { pathFor } from "@/lib/routes";
import XalucaLogoBadge from "@/components/XalucaLogoBadge";

const COPY = {
  overline: { es: "Tu colección", en: "Your collection", fr: "Votre collection" },
  title: { es: "Viajes que has guardado", en: "Trips you've saved", fr: "Voyages que vous avez enregistrés" },
  subtitle: {
    es: "Tus itinerarios favoritos, reunidos en un solo lugar para que vuelvas a ellos cuando quieras.",
    en: "Your favourite itineraries, gathered in one place to revisit whenever you like.",
    fr: "Vos itinéraires favoris, réunis en un seul endroit pour y revenir quand vous le souhaitez.",
  },
  count: { es: "guardados", en: "saved", fr: "enregistrés" },
  planAll: { es: "Planificar con mis favoritos", en: "Plan with my favourites", fr: "Planifier avec mes favoris" },
  view: { es: "Ver el viaje", en: "View the trip", fr: "Voir le voyage" },
  remove: { es: "Quitar de favoritos", en: "Remove from favourites", fr: "Retirer des favoris" },
  emptyTitle: { es: "Aún no has guardado ningún viaje", en: "You haven't saved any trips yet", fr: "Vous n'avez encore enregistré aucun voyage" },
  emptyBody: {
    es: "Pulsa el corazón en cualquier viaje para guardarlo aquí y comparar tus favoritos con calma.",
    en: "Tap the heart on any trip to save it here and compare your favourites at your leisure.",
    fr: "Appuyez sur le cœur d'un voyage pour l'enregistrer ici et comparer vos favoris tranquillement.",
  },
  explore: { es: "Explorar viajes", en: "Explore trips", fr: "Explorer les voyages" },
};

const FavCard = ({ trip, lang, onRemove }) => (
  <div data-testid={`favorite-card-${trip.routeId}`} className="group relative bg-[#FDFBF7] border border-[#2C2621]/10 overflow-hidden">
    <Link to={pathFor(lang, trip.routeId)} data-testid={`favorite-card-link-${trip.routeId}`} className="block">
      <div className="relative h-60 overflow-hidden bg-[#C16542]/5">
        {trip.image && (
          <img
            src={trip.image}
            alt=""
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1513]/70 via-transparent to-transparent" />
        <XalucaLogoBadge className="top-3 left-3 w-9 h-9" />
      </div>
      <div className="p-6">
        <h3 className="font-serif-x text-xl text-[#2C2621] leading-snug">{trip.title}</h3>
        {trip.durationLabel && (
          <p className="text-sm text-[#5C5248] mt-1">{trip.durationLabel}</p>
        )}
        <span className="mt-4 inline-flex items-center gap-1.5 text-[10px] tracking-[0.2em] uppercase text-[#C16542]">
          {pick(COPY.view, lang)}
          <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" strokeWidth={1.8} />
        </span>
      </div>
    </Link>
    <button
      type="button"
      onClick={() => onRemove(trip.routeId)}
      data-testid={`favorite-remove-${trip.routeId}`}
      aria-label={pick(COPY.remove, lang)}
      title={pick(COPY.remove, lang)}
      className="absolute top-3 right-3 z-10 inline-flex items-center justify-center w-9 h-9 rounded-full bg-[#FDFBF7]/90 backdrop-blur text-[#C16542] hover:bg-[#C16542] hover:text-[#FDFBF7] shadow-md transition-colors"
    >
      <Heart className="w-4 h-4" strokeWidth={1.6} fill="currentColor" />
    </button>
  </div>
);

export default function FavoritosPage() {
  const { lang } = useLanguage();
  const { favorites, count, removeFavorite } = useFavorites();
  const trips = favorites.map((id) => resolveTripContext(id, lang)).filter(Boolean);

  return (
    <div data-testid="favorites-page" className="bg-[#F2EBE1] min-h-screen pt-28 md:pt-36 pb-24">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="max-w-2xl">
          <span className="overline inline-flex items-center gap-2 text-[#C16542]">
            <Heart className="w-3.5 h-3.5" strokeWidth={1.7} fill="#C16542" />
            {pick(COPY.overline, lang)}
          </span>
          <h1 className="font-serif-x text-4xl sm:text-5xl lg:text-6xl leading-[1.05] tracking-tight mt-4 text-[#2C2621]">
            {pick(COPY.title, lang)}
          </h1>
          <p className="text-base md:text-lg text-[#5C5248] mt-5 leading-relaxed">{pick(COPY.subtitle, lang)}</p>
          {count > 0 && (
            <div className="mt-6 flex flex-wrap items-center gap-5">
              <p data-testid="favorites-page-count" className="overline text-[#A07042]">
                {count} {pick(COPY.count, lang)}
              </p>
              <Link
                to={`${pathFor(lang, "planTrip")}?trips=${favorites.join(",")}`}
                data-testid="favorites-plan-all"
                className="inline-flex items-center gap-3 bg-[#C16542] hover:bg-[#A35133] text-[#FDFBF7] px-7 py-4 text-[11px] tracking-[0.25em] uppercase transition-colors"
              >
                <Compass className="w-3.5 h-3.5" strokeWidth={1.6} />
                {pick(COPY.planAll, lang)}
              </Link>
            </div>
          )}
        </div>

        {/* Grid / empty state */}
        {trips.length === 0 ? (
          <div
            data-testid="favorites-empty"
            className="mt-12 border border-dashed border-[#2C2621]/20 bg-[#FDFBF7] px-8 py-16 md:py-24 text-center"
          >
            <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#C16542]/10 text-[#C16542] mb-6">
              <Heart className="w-7 h-7" strokeWidth={1.4} />
            </span>
            <h2 className="font-serif-x text-2xl md:text-3xl text-[#2C2621]">{pick(COPY.emptyTitle, lang)}</h2>
            <p className="text-[#5C5248] mt-3 max-w-md mx-auto leading-relaxed">{pick(COPY.emptyBody, lang)}</p>
            <Link
              to={pathFor(lang, "toursLanding")}
              data-testid="favorites-explore-link"
              className="mt-8 inline-flex items-center gap-3 bg-[#C16542] hover:bg-[#A35133] text-[#FDFBF7] px-7 py-4 text-[11px] tracking-[0.25em] uppercase transition-colors"
            >
              <Compass className="w-3.5 h-3.5" strokeWidth={1.6} />
              {pick(COPY.explore, lang)}
            </Link>
          </div>
        ) : (
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {trips.map((trip) => (
              <FavCard key={trip.routeId} trip={trip} lang={lang} onRemove={removeFavorite} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
