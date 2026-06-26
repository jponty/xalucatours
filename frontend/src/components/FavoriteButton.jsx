/* ============================================================
   FavoriteButton — toggles a trip's "favourite" state. Reads/writes
   the local FavoritesContext. Heart fills when saved. Used on trip
   pages (mechanism to mark/unmark) — same visual language as the
   site's outline CTAs.
============================================================ */
import React from "react";
import { Heart } from "lucide-react";
import { useLanguage, pick } from "@/contexts/LanguageContext";
import { useFavorites } from "@/contexts/FavoritesContext";

const COPY = {
  save: { es: "Guardar viaje", en: "Save trip", fr: "Enregistrer" },
  saved: { es: "Guardado", en: "Saved", fr: "Enregistré" },
};

export default function FavoriteButton({ routeId, className = "" }) {
  const { lang } = useLanguage();
  const { isFavorite, toggleFavorite } = useFavorites();
  if (!routeId) return null;
  const fav = isFavorite(routeId);

  return (
    <button
      type="button"
      onClick={() => toggleFavorite(routeId)}
      data-testid={`favorite-toggle-${routeId}`}
      aria-pressed={fav}
      className={`group inline-flex items-center gap-3 px-7 py-4 text-[11px] tracking-[0.25em] uppercase border transition-all duration-300 ${
        fav
          ? "border-[#C16542] bg-[#C16542]/10 text-[#C16542]"
          : "border-[#2C2621]/25 text-[#2C2621] hover:border-[#C16542] hover:text-[#C16542]"
      } ${className}`}
    >
      <Heart
        className="w-3.5 h-3.5 transition-transform group-active:scale-90"
        strokeWidth={1.6}
        fill={fav ? "#C16542" : "none"}
      />
      {pick(fav ? COPY.saved : COPY.save, lang)}
    </button>
  );
}
