/* ============================================================
   TripCardActions — the canonical 5-icon CTA group shown on every
   individual trip card across the site (carousels, grids, hubs).
   Icons: Planificar · Asistente · Llamar · Cita previa · Compartir.

   IMPORTANT: always render this OUTSIDE the card's <Link>/<a> so the
   buttons never trigger the card's navigation. Pass `routeId` so the
   share link points to the specific trip (not the current page).
============================================================ */
import React from "react";
import { useNavigate } from "react-router-dom";
import { Compass, Headset, Phone, CalendarClock } from "lucide-react";
import { pick } from "@/contexts/LanguageContext";
import { pathFor } from "@/lib/routes";
import { openChatbaseAssistant } from "@/lib/chatbase";
import ShareTripButton from "@/components/ShareTripButton";

const PLAN_LABEL = { es: "Planificar mi viaje", en: "Plan my trip", fr: "Planifier mon voyage" };
const ASSISTANT_LABEL = { es: "Asistente Virtual", en: "Virtual Assistant", fr: "Assistant Virtuel" };
const CALL_LABEL = { es: "Llamar por teléfono", en: "Call us", fr: "Nous appeler" };
const APPOINTMENT_LABEL = { es: "Cita previa", en: "Book an appointment", fr: "Prendre rendez-vous" };
const CALL_TEL = "+34937268366";

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
  const s = SIZES[size] || SIZES.sm;
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

  return (
    <div
      className={`flex flex-wrap items-center gap-2 ${className}`}
      data-testid={`${testidBase}-actions`}
    >
      <button
        type="button"
        onClick={() => navigate(pathFor(lang, "planTrip"))}
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
        onClick={() => navigate(pathFor(lang, "appointment"))}
        data-testid={`${testidBase}-appointment`}
        aria-label={pick(APPOINTMENT_LABEL, lang)}
        title={pick(APPOINTMENT_LABEL, lang)}
        className={outline}
      >
        <CalendarClock className={s.icon} strokeWidth={1.7} />
      </button>
      <ShareTripButton
        testid={`${testidBase}-share`}
        shareUrl={shareUrl}
        triggerClassName={outline}
        iconClassName={s.icon}
      />
    </div>
  );
}
