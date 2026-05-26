import React, { useMemo, useState } from "react";
import { MapContainer, TileLayer, Polyline, CircleMarker, Tooltip } from "react-leaflet";
import { Map as MapIcon, MapPin, ArrowRight } from "lucide-react";
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
  },
  en: {
    overline: "The whole route",
    title: "Your journey on a single map.",
    subtitle: "Every stop connected — the full route, day by day, in a single image.",
    day_short: "Day",
    stops: "stops",
    total_kms: "approximate km",
  },
  fr: {
    overline: "L'itinéraire complet",
    title: "Votre traversée sur une seule carte.",
    subtitle: "Chaque étape connectée — l'itinéraire complet, jour après jour, en une seule image.",
    day_short: "Jour",
    stops: "étapes",
    total_kms: "km approximatifs",
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

export const TripRouteMap = ({ route }) => {
  const { lang } = useLanguage();
  const t = LABELS[lang] || LABELS.es;
  const [activeDay, setActiveDay] = useState(null);

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
      className="relative bg-[#F2EBE1] py-20 md:py-28 overflow-hidden"
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
                  const isActive = activeDay === stop.day;
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
                          click: () => setActiveDay((prev) => (prev === stop.day ? null : stop.day)),
                          mouseover: () => setActiveDay(stop.day),
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
          </div>

          {/* Right rail · ordered list of days */}
          <div className="lg:col-span-4">
            <ol className="space-y-2" data-testid="trip-route-rail">
              {route.map((stop, idx) => {
                const color = TYPE_COLORS[stop.type] || "#C16542";
                const isActive = activeDay === stop.day;
                const kindLabel = TYPE_LABELS[stop.type];
                return (
                  <li key={`${stop.day}-${idx}`}>
                    <button
                      type="button"
                      onClick={() => setActiveDay((prev) => (prev === stop.day ? null : stop.day))}
                      onMouseEnter={() => setActiveDay(stop.day)}
                      data-testid={`trip-route-stop-${stop.day}`}
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
                      {idx < route.length - 1 && (
                        <ArrowRight className="w-3.5 h-3.5 mt-1 text-[#5C5248] group-hover:text-[#C16542] shrink-0 transition-colors" strokeWidth={1.6} />
                      )}
                    </button>
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
