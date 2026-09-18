/* ============================================================
   TripCardActions — the canonical 5-icon CTA group shown on every
   individual trip card across the site (carousels, grids, hubs).
   Icons: Planificar · Asistente · Llamar · Cita previa · Compartir.

   IMPORTANT: always render this OUTSIDE the card's <Link>/<a> so the
   buttons never trigger the card's navigation. Pass `routeId` so the
   share link points to the specific trip (not the current page).
============================================================ */
import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { Compass, Headset, Phone, CalendarClock, Heart, Euro, X } from "lucide-react";
import { pick } from "@/contexts/LanguageContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { pathFor } from "@/lib/routes";
import { CONTACT } from "@/lib/data";
import { openChatbaseAssistant } from "@/lib/chatbase";
import ShareTripButton from "@/components/ShareTripButton";
import { usePricing } from "@/lib/pricingStore";
import { getFromPrice, fmtEuro, pickLang } from "@/lib/pricing";
import { getProgramTiers } from "@/lib/programPricing";

const PRICE_LABEL = { es: "Ver precios", en: "View prices", fr: "Voir les prix" };

const PLAN_LABEL = { es: "Planificar mi viaje", en: "Plan my trip", fr: "Planifier mon voyage" };
const ASSISTANT_LABEL = { es: "Asistente Virtual", en: "Virtual Assistant", fr: "Assistant Virtuel" };
const CALL_LABEL = { es: "Llamar por teléfono", en: "Call us", fr: "Nous appeler" };
const APPOINTMENT_LABEL = { es: "Cita previa", en: "Book an appointment", fr: "Prendre rendez-vous" };
const FAV_LABEL = { es: "Añadir a favoritos", en: "Add to favourites", fr: "Ajouter aux favoris" };
const FAV_LABEL_ON = { es: "Quitar de favoritos", en: "Remove from favourites", fr: "Retirer des favoris" };
const CALL_TEL = CONTACT.phoneRaw;

const SIZES = {
  sm: { btn: "w-9 h-9", icon: "w-4 h-4" },
  md: { btn: "w-10 h-10", icon: "w-4 h-4" },
};

export default function TripCardActions({
  lang,
  routeId,
  testidBase,
  size = "sm",
  tone = "light",
  className = "",
}) {
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [priceOpen, setPriceOpen] = useState(false);
  const s = SIZES[size] || SIZES.sm;
  const fav = routeId ? isFavorite(routeId) : false;
  const tripQs = routeId ? `?trip=${routeId}` : "";
  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}${routeId ? pathFor(lang, routeId) : window.location.pathname}`
      : "";

  const box = `inline-flex items-center justify-center ${s.btn} transition-colors duration-300`;
  const outline =
    tone === "dark"
      ? `${box} border border-[#FDFBF7]/30 text-[#FDFBF7] hover:bg-[#FDFBF7] hover:text-[#1A1513] hover:border-[#FDFBF7]`
      : `${box} border border-[#2C2621]/20 text-[#2C2621] hover:bg-[#2C2621] hover:text-[#FDFBF7] hover:border-[#2C2621]`;
  const plan = `${box} bg-[#C16542] hover:bg-[#A35133] text-[#FDFBF7]`;
  const favClass = fav ? `${box} border border-[#C16542] bg-[#C16542]/10 text-[#C16542]` : outline;

  return (
    <div
      className={`flex flex-wrap items-center gap-2 ${className}`}
      data-testid={`${testidBase}-actions`}
    >
      <button
        type="button"
        onClick={() => navigate(`${pathFor(lang, "planTrip")}${tripQs}`)}
        data-testid={`${testidBase}-plan`}
        aria-label={pick(PLAN_LABEL, lang)}
        title={pick(PLAN_LABEL, lang)}
        className={plan}
      >
        <Compass className={s.icon} strokeWidth={1.7} />
      </button>
      <button
        type="button"
        onClick={openChatbaseAssistant}
        data-testid={`${testidBase}-assistant`}
        aria-label={pick(ASSISTANT_LABEL, lang)}
        title={pick(ASSISTANT_LABEL, lang)}
        className={outline}
      >
        <Headset className={s.icon} strokeWidth={1.7} />
      </button>
      <a
        href={`tel:${CALL_TEL}`}
        data-testid={`${testidBase}-call`}
        aria-label={pick(CALL_LABEL, lang)}
        title={pick(CALL_LABEL, lang)}
        className={outline}
      >
        <Phone className={s.icon} strokeWidth={1.7} />
      </a>
      <button
        type="button"
        onClick={() => navigate(`${pathFor(lang, "appointment")}${tripQs}`)}
        data-testid={`${testidBase}-appointment`}
        aria-label={pick(APPOINTMENT_LABEL, lang)}
        title={pick(APPOINTMENT_LABEL, lang)}
        className={outline}
      >
        <CalendarClock className={s.icon} strokeWidth={1.7} />
      </button>
      <button
        type="button"
        onClick={() => setPriceOpen(true)}
        data-testid={`${testidBase}-price`}
        aria-label={pick(PRICE_LABEL, lang)}
        title={pick(PRICE_LABEL, lang)}
        aria-haspopup="dialog"
        className={outline}
      >
        <Euro className={s.icon} strokeWidth={1.7} />
      </button>
      <ShareTripButton
        testid={`${testidBase}-share`}
        shareUrl={shareUrl}
        triggerClassName={outline}
        iconClassName={s.icon}
      />
      <button
        type="button"
        onClick={() => routeId && toggleFavorite(routeId)}
        data-testid={`${testidBase}-favorite`}
        aria-label={pick(fav ? FAV_LABEL_ON : FAV_LABEL, lang)}
        title={pick(fav ? FAV_LABEL_ON : FAV_LABEL, lang)}
        aria-pressed={fav}
        className={favClass}
      >
        <Heart className={s.icon} strokeWidth={1.7} fill={fav ? "currentColor" : "none"} />
      </button>

      {priceOpen && (
        <QuickPriceDialog
          routeId={routeId}
          lang={lang}
          testidBase={testidBase}
          onClose={() => setPriceOpen(false)}
          onRequest={() => { setPriceOpen(false); navigate(`${pathFor(lang, "planTrip")}${tripQs}`); }}
          onAppointment={() => { setPriceOpen(false); navigate(`${pathFor(lang, "appointment")}${tripQs}`); }}
        />
      )}
    </div>
  );
}

/* Compact, summarised price dialog — opens in place over the card (no
   navigation). Reuses the centralised pricing store. */
function QuickPriceDialog({ routeId, lang, testidBase, onClose, onRequest, onAppointment }) {
  const pricing = usePricing();
  const tiers = getProgramTiers(routeId) || pricing.tiers;
  const from = getFromPrice({ tiers });
  const L = pricing.labels;
  const p = (o) => pickLang(o, lang);
  const apptLabel = { es: "Reservar cita previa", en: "Book an appointment", fr: "Prendre rendez-vous" };

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [onClose]);

  return createPortal(
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      data-testid={`${testidBase}-price-dialog`}
    >
      <div className="absolute inset-0 bg-[#1A1513]/70 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-md max-h-[90vh] overflow-y-auto bg-[#FDFBF7] text-[#2C2621] p-6 md:p-7 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          data-testid={`${testidBase}-price-close`}
          className="absolute top-3 right-3 inline-flex items-center justify-center w-8 h-8 text-[#2C2621]/60 hover:text-[#2C2621] hover:bg-[#2C2621]/5 transition-colors"
        >
          <X className="w-4 h-4" strokeWidth={1.8} />
        </button>

        <span className="block text-[10px] tracking-[0.32em] uppercase text-[#A07042] mb-1">
          {p(L.overline)}
        </span>
        <h3 className="font-serif-x text-2xl leading-tight pr-8">{p(L.title)}</h3>

        {from != null && (
          <p className="mt-3 text-sm text-[#5C5248]" data-testid={`${testidBase}-price-from`}>
            {p(L.from)} <span className="font-serif-x text-2xl text-[#C16542] align-middle">{fmtEuro(from)}</span>{" "}
            <span className="text-[12px]">{p(L.perPerson)}</span>
          </p>
        )}

        <div className="mt-5 border border-[#2C2621]/12">
          <div className="grid grid-cols-3 bg-[#2C2621] text-[#FDFBF7] text-[10px] tracking-[0.18em] uppercase">
            <span className="px-3 py-2">{p(L.travellers)}</span>
            <span className="px-3 py-2 text-right">{p(pricing.seasons.low.label)}</span>
            <span className="px-3 py-2 text-right">{p(pricing.seasons.high.label)}</span>
          </div>
          {tiers.map((t) => (
            <div key={t.people} className="grid grid-cols-3 text-[13px] border-t border-[#2C2621]/10">
              <span className="px-3 py-2.5">{t.people} {p(L.people)}</span>
              <span className="px-3 py-2.5 text-right">{fmtEuro(t.low)}</span>
              <span className="px-3 py-2.5 text-right font-medium text-[#C16542]">{fmtEuro(t.high)}</span>
            </div>
          ))}
        </div>

        <p className="mt-3 text-[11px] text-[#5C5248]/80 leading-relaxed">{p(L.placeholderNotice)}</p>

        <div className="mt-5 flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={onRequest}
            data-testid={`${testidBase}-price-cta`}
            className="flex-1 inline-flex items-center justify-center bg-[#C16542] hover:bg-[#A35133] text-[#FDFBF7] px-5 py-3 text-[11px] tracking-[0.22em] uppercase transition-colors"
          >
            {p(L.cta)}
          </button>
          <button
            type="button"
            onClick={onAppointment}
            data-testid={`${testidBase}-price-cta-appointment`}
            className="flex-1 inline-flex items-center justify-center gap-2 border border-[#2C2621]/25 hover:border-[#2C2621] hover:bg-[#2C2621] hover:text-[#FDFBF7] text-[#2C2621] px-5 py-3 text-[11px] tracking-[0.22em] uppercase transition-all duration-300"
          >
            <CalendarClock className="w-3.5 h-3.5 shrink-0" strokeWidth={1.6} />
            {pick(apptLabel, lang)}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
