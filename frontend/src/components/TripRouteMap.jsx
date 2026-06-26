import React, { useMemo, useState } from "react";
import { MapContainer, TileLayer, Polyline, CircleMarker, Tooltip } from "react-leaflet";
import MapLogoBadge from "@/components/MapLogoBadge";
import ImageContactBubble from "@/components/ImageContactBubble";
import TripPackingNotes from "@/components/TripPackingNotes";
import { Map as MapIcon, MapPin, ArrowRight, ChevronDown, Sparkles, BookOpen, X } from "lucide-react";
import { useLanguage, pick } from "@/contexts/LanguageContext";

/* ============================================================
   TripRouteMap — single Leaflet map drawing the full programme route
   as a connected polyline with one marker per day.
   Receives `route` (array of {day, lat, lng, name, type}) directly
   on the program object — decoupled from DAY_LANDMARKS so each
   programme defines its own anchor stops.
============================================================ */

const TYPE_COLORS = {
  city:    "#C16542",
  desert:  "#D97742",
  kasbah:  "#A07042",
  market:  "#7C8B5C",
  gorge:   "#5A7F9C",
  unesco:  "#D4A373",
  airport: "#5C5248",
};

const TYPE_LABELS = {
  city:    { es: "Ciudad",      en: "City",         fr: "Ville" },
  desert:  { es: "Desierto",    en: "Desert",       fr: "Désert" },
  kasbah:  { es: "Kasbah",      en: "Kasbah",       fr: "Kasbah" },
  market:  { es: "Mercado",     en: "Market",       fr: "Marché" },
  gorge:   { es: "Garganta",    en: "Gorge",        fr: "Gorge" },
  unesco:  { es: "UNESCO",      en: "UNESCO",       fr: "UNESCO" },
  airport: { es: "Aeropuerto",  en: "Airport",      fr: "Aéroport" },
};

const LABELS = {
  es: {
    overline: "El recorrido completo",
    title: "Tu travesía en un solo mapa.",
    subtitle: "Cada parada conectada — la ruta completa del viaje, día a día, en una única imagen.",
    day_short: "Día",
    stops: "etapas",
    total_kms: "km aproximados",
    expand_hint: "Pulsa una etapa para ver el detalle",
    main_route: "Ruta del día",
    highlights: "Lo destacado",
    description: "El día, en detalle",
    close: "Cerrar",
    day_label_long: "Día",
  },
  en: {
    overline: "The whole route",
    title: "Your journey on a single map.",
    subtitle: "Every stop connected — the full route, day by day, in a single image.",
    day_short: "Day",
    stops: "stops",
    total_kms: "approximate km",
    expand_hint: "Tap a stage to read the details",
    main_route: "Day route",
    highlights: "Highlights",
    description: "The day, in detail",
    close: "Close",
    day_label_long: "Day",
  },
  fr: {
    overline: "L'itinéraire complet",
    title: "Votre traversée sur une seule carte.",
    subtitle: "Chaque étape connectée — l'itinéraire complet, jour après jour, en une seule image.",
    day_short: "Jour",
    stops: "étapes",
    total_kms: "km approximatifs",
    expand_hint: "Cliquez sur une étape pour voir le détail",
    main_route: "Itinéraire du jour",
    highlights: "Points forts",
    description: "La journée en détail",
    close: "Fermer",
    day_label_long: "Jour",
  },
};

const haversine = (a, b) => {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
};

/* Parse `trk89-tanger-chefchaouen` style route_id into a clean
   "Tánger → Chefchaouen" string for the route line. Removes the
   programme prefix (everything before the first hyphen) and any
   bare tokens shorter than 3 characters or known modifiers. */
const SKIP = new Set(["return", "discover", "loop", "stay", "extension", "atlas", "rif"]);
const prettifyRouteId = (routeId) => {
  if (!routeId || typeof routeId !== "string") return "";
  const parts = routeId.split("-").slice(1); // drop "trk89", "frz67", etc.
  const cleaned = parts
    .map((p) => p.replace(/[0-9]+/g, ""))
    .filter((p) => p.length >= 3 && !SKIP.has(p));
  if (!cleaned.length) return "";
  return cleaned
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(" → ");
};

/* ------------------------------------------------------------
   DayDetail — expandable dropdown panel rendered below the active
   stage button. Shows day title, parsed route, key highlights from
   the day's culture array, and the full day description.
------------------------------------------------------------ */
const DayDetail = ({ id, day, dayNumber, color, lang, t, onClose }) => {
  const culture = Array.isArray(day.culture) ? day.culture : [];
  const description = day.body ? pick(day.body, lang) : null;
  const dayTitle = day.title ? pick(day.title, lang) : null;
  const routeStr = prettifyRouteId(day.route_id);

  return (
    <div
      id={id}
      role="region"
      data-testid={`trip-route-detail-${dayNumber}`}
      className="relative animate-slide-down bg-[#FDFBF7] border border-t-0 border-[#2C2621] -mt-px px-5 py-5 md:py-6"
      style={{ boxShadow: `inset 3px 0 0 ${color}` }}
    >
      {/* Close pill */}
      <button
        type="button"
        onClick={onClose}
        data-testid={`trip-route-detail-close-${dayNumber}`}
        aria-label={t.close}
        className="absolute top-3 right-3 inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#F2EBE1] hover:bg-[#2C2621] text-[#5C5248] hover:text-[#FDFBF7] transition-colors"
      >
        <X className="w-3.5 h-3.5" strokeWidth={1.8} />
      </button>

      {/* Day title block */}
      <span
        className="inline-flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase"
        style={{ color }}
      >
        <span className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
        {t.day_label_long} {String(dayNumber).padStart(2, "0")}
      </span>
      {dayTitle && (
        <h5 className="font-serif-x text-[18px] md:text-[20px] text-[#2C2621] leading-[1.2] mt-2 pr-7">
          {dayTitle}
        </h5>
      )}

      {/* Parsed day route */}
      {routeStr && (
        <p className="mt-4 inline-flex items-center gap-2 text-[11px] tracking-[0.18em] uppercase text-[#5C5248]">
          <ArrowRight className="w-3 h-3" style={{ color }} strokeWidth={1.8} />
          <span className="text-[#2C2621]">{t.main_route}:</span>
          <span>{routeStr}</span>
        </p>
      )}

      {/* Highlights from culture[] */}
      {culture.length > 0 && (
        <div className="mt-5">
          <span className="block text-[10px] tracking-[0.3em] uppercase mb-3 inline-flex items-center gap-2" style={{ color }}>
            <Sparkles className="w-3 h-3" strokeWidth={1.8} />
            {t.highlights}
          </span>
          <ul className="space-y-3">
            {culture.slice(0, 3).map((c, i) => (
              <li key={`${id}-h-${i}`} className="flex items-start gap-3">
                <span
                  className="font-serif-x text-[12px] leading-[1] tabular-nums mt-1 shrink-0"
                  style={{ color }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block font-serif-x text-[14px] md:text-[15px] text-[#2C2621] leading-snug">
                    {pick(c.title, lang)}
                  </span>
                  {c.body && (
                    <span className="block text-[12px] md:text-[13px] text-[#5C5248] leading-[1.55] mt-1">
                      {pick(c.body, lang)}
                    </span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Full description */}
      {description && (
        <div className="mt-5 pt-5 border-t border-[#2C2621]/10">
          <span className="block text-[10px] tracking-[0.3em] uppercase mb-3 inline-flex items-center gap-2" style={{ color }}>
            <BookOpen className="w-3 h-3" strokeWidth={1.8} />
            {t.description}
          </span>
          <p className="text-[13px] md:text-[14px] text-[#2C2621] leading-[1.65]">
            {description}
          </p>
        </div>
      )}
    </div>
  );
};

export const TripRouteMap = ({ route, days = [], routeId }) => {
  const { lang } = useLanguage();
  const t = LABELS[lang] || LABELS.es;
  // First stage open by default on every load/refresh (state resets per
  // session — no persistence). Normal accordion behaviour afterwards.
  const [activeNode, setActiveNode] = useState(() =>
    Array.isArray(days) && days.length > 0 ? 0 : null
  );

  /* Index program days by day-number for O(1) lookup when expanding. */
  const dayByNumber = useMemo(() => {
    const map = {};
    days.forEach((d, i) => {
      const dayNum = d.day_number || i + 1;
      map[dayNum] = d;
    });
    return map;
  }, [days]);

  const positions = useMemo(() => route.map((r) => [r.lat, r.lng]), [route]);
  const bounds = useMemo(() => {
    if (!route.length) return null;
    const lats = route.map((r) => r.lat);
    const lngs = route.map((r) => r.lng);
    return [[Math.min(...lats), Math.min(...lngs)], [Math.max(...lats), Math.max(...lngs)]];
  }, [route]);

  const totalKm = useMemo(() => {
    let sum = 0;
    for (let i = 1; i < route.length; i++) sum += haversine(route[i - 1], route[i]);
    return Math.round(sum);
  }, [route]);

  if (!route || route.length < 2) return null;

  return (
    <section
      id="route-map"
      data-testid="trip-route-map"
      className="relative z-0 bg-[#F2EBE1] py-20 md:py-28 overflow-hidden"
    >
      <div className="absolute inset-0 berber-bg-diamond opacity-20 pointer-events-none" aria-hidden="true" />
      <div className="relative max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end mb-10 md:mb-14">
          <div className="md:col-span-7">
            <span className="overline inline-flex items-center gap-2 text-[#C16542]">
              <MapIcon className="w-3 h-3" strokeWidth={1.8} />
              {t.overline}
            </span>
            <h2 className="font-serif-x text-4xl md:text-5xl lg:text-[54px] leading-[1.05] tracking-tight mt-5 text-[#2C2621]">
              {t.title}
            </h2>
          </div>
          <div className="md:col-span-5">
            <p className="text-base md:text-lg text-[#5C5248] leading-relaxed">{t.subtitle}</p>
            <div className="mt-5 flex flex-wrap gap-x-8 gap-y-3 text-[#2C2621]">
              <div>
                <span className="block text-[10px] tracking-[0.3em] uppercase text-[#5C5248]">{t.stops}</span>
                <span className="font-serif-x text-2xl">{route.length}</span>
              </div>
              <div>
                <span className="block text-[10px] tracking-[0.3em] uppercase text-[#5C5248]">{t.total_kms}</span>
                <span className="font-serif-x text-2xl">{totalKm.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Map + day rail */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
          <div className="lg:col-span-8">
            <div className="relative h-[500px] md:h-[580px] overflow-hidden border border-[#2C2621]/15 bg-[#FDFBF7] shadow-sm">
              <MapContainer
                bounds={bounds}
                boundsOptions={{ padding: [40, 40] }}
                scrollWheelZoom={false}
                zoomControl
                attributionControl={false}
                style={{ height: "100%", width: "100%", background: "#F2EBE1" }}
              >
                <TileLayer
                  url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                  subdomains={["a", "b", "c", "d"]}
                />
                {/* Soft shadow polyline */}
                <Polyline
                  positions={positions}
                  pathOptions={{ color: "#1A1513", weight: 6, opacity: 0.18 }}
                />
                {/* Main polyline */}
                <Polyline
                  positions={positions}
                  pathOptions={{ color: "#C16542", weight: 2.5, opacity: 0.9, dashArray: "1 6" }}
                />
                {route.map((stop, idx) => {
                  const color = TYPE_COLORS[stop.type] || "#C16542";
                  const isActive = activeNode === idx;
                  return (
                    <React.Fragment key={`${stop.day}-${idx}`}>
                      <CircleMarker
                        center={[stop.lat, stop.lng]}
                        radius={isActive ? 28 : 18}
                        pathOptions={{ color, weight: 0, fillColor: color, fillOpacity: isActive ? 0.22 : 0.10 }}
                        interactive={false}
                      />
                      <CircleMarker
                        center={[stop.lat, stop.lng]}
                        radius={isActive ? 12 : 9}
                        pathOptions={{
                          color: isActive ? "#1A1513" : "#FDFBF7",
                          weight: isActive ? 3 : 2,
                          fillColor: color,
                          fillOpacity: 1,
                        }}
                        eventHandlers={{
                          click: () => setActiveNode((prev) => (prev === idx ? null : idx)),
                        }}
                      >
                        <Tooltip direction="top" offset={[0, -10]} opacity={0.95} permanent={false}>
                          <span className="text-[11px] tracking-[0.05em]">
                            {t.day_short} {String(stop.day).padStart(2, "0")} · {pick(stop.name, lang)}
                          </span>
                        </Tooltip>
                      </CircleMarker>
                    </React.Fragment>
                  );
                })}
              </MapContainer>
              <MapLogoBadge />
              <ImageContactBubble slug={routeId || "trip-route"} align="right" zClass="z-[1000]" />
            </div>
            {/* Legend */}
            <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-[10px] tracking-[0.25em] uppercase text-[#5C5248]">
              {Array.from(new Set(route.map((r) => r.type))).map((tp) => (
                <li key={tp} className="inline-flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: TYPE_COLORS[tp] || "#C16542" }} />
                  {pick(TYPE_LABELS[tp] || { es: tp, en: tp, fr: tp }, lang)}
                </li>
              ))}
            </ul>

            {/* Travel notes (sticky-note carousel) — route-specific; renders
                nothing when this trip has no packing notes defined. */}
            <TripPackingNotes routeId={routeId} />
          </div>

          {/* Right rail · ordered list of days with expandable details */}
          <div className="lg:col-span-4">
            <p className="text-[10px] tracking-[0.3em] uppercase text-[#5C5248] mb-3 inline-flex items-center gap-2" data-testid="trip-route-hint">
              <ChevronDown className="w-3 h-3" strokeWidth={1.8} />
              {t.expand_hint}
            </p>
            <ol className="space-y-2" data-testid="trip-route-rail">
              {route.map((stop, idx) => {
                const color = TYPE_COLORS[stop.type] || "#C16542";
                const isActive = activeNode === idx;
                const kindLabel = TYPE_LABELS[stop.type];
                const dayData = dayByNumber[stop.day] || days[idx];
                const hasDetails = !!dayData;
                return (
                  <li key={`${stop.day}-${idx}`}>
                    <button
                      type="button"
                      onClick={() => setActiveNode((prev) => (prev === idx ? null : idx))}
                      data-testid={`trip-route-stop-${stop.day}-${idx}`}
                      aria-expanded={isActive}
                      aria-controls={`trip-route-detail-${stop.day}-${idx}`}
                      className={`group w-full text-left flex items-start gap-4 px-4 py-3 border transition-all duration-300 ${
                        isActive
                          ? "bg-[#FDFBF7] border-[#2C2621]"
                          : "bg-[#FDFBF7]/70 hover:bg-[#FDFBF7] border-[#2C2621]/15 hover:border-[#2C2621]/45"
                      }`}
                      style={isActive ? { boxShadow: `inset 3px 0 0 ${color}` } : undefined}
                    >
                      <span
                        className="font-serif-x text-xl leading-none mt-0.5 shrink-0 tabular-nums"
                        style={{ color }}
                      >
                        {String(stop.day).padStart(2, "0")}
                      </span>
                      <span className="flex-1 min-w-0">
                        {kindLabel && (
                          <span className="block text-[10px] tracking-[0.25em] uppercase" style={{ color }}>
                            {pick(kindLabel, lang)}
                          </span>
                        )}
                        <span className="block font-serif-x text-[15px] md:text-[16px] text-[#2C2621] leading-snug mt-1 inline-flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 shrink-0" style={{ color }} strokeWidth={1.6} />
                          {pick(stop.name, lang)}
                        </span>
                      </span>
                      {hasDetails ? (
                        <ChevronDown
                          className={`w-4 h-4 mt-1 shrink-0 transition-transform duration-300 ${
                            isActive ? "rotate-180 text-[#2C2621]" : "text-[#5C5248] group-hover:text-[#C16542]"
                          }`}
                          strokeWidth={1.6}
                        />
                      ) : idx < route.length - 1 ? (
                        <ArrowRight className="w-3.5 h-3.5 mt-1 text-[#5C5248] group-hover:text-[#C16542] shrink-0 transition-colors" strokeWidth={1.6} />
                      ) : null}
                    </button>

                    {isActive && dayData && (
                      <DayDetail
                        id={`trip-route-detail-${stop.day}-${idx}`}
                        day={dayData}
                        dayNumber={stop.day}
                        color={color}
                        lang={lang}
                        t={t}
                        onClose={() => setActiveNode(null)}
                      />
                    )}
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TripRouteMap;
