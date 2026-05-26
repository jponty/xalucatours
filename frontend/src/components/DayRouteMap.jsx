import React, { useMemo, useState, useEffect } from "react";
import { MapContainer, TileLayer, CircleMarker, Tooltip, useMap } from "react-leaflet";
import { MapPin, Navigation } from "lucide-react";
import { DAY_ROUTES, computeBounds } from "@/lib/dayRoutes";
import { useLanguage } from "@/contexts/LanguageContext";

const LABEL_T = {
  es: { route: "Mapa del día", legend_start: "Inicio", legend_stop: "Parada", legend_overnight: "Pernocta", legend_end: "Fin", stages: "Puntos de interés del día", progress: "Progreso del viaje", day_short: "Día" },
  en: { route: "Day map", legend_start: "Start", legend_stop: "Stop", legend_overnight: "Overnight", legend_end: "End", stages: "Day landmarks", progress: "Trip progress", day_short: "Day" },
  fr: { route: "Carte du jour", legend_start: "Départ", legend_stop: "Arrêt", legend_overnight: "Nuitée", legend_end: "Arrivée", stages: "Points d'intérêt du jour", progress: "Progression du voyage", day_short: "Jour" },
};

const KIND_COLOR = {
  start: "#5A6B4F",
  stop: "#C16542",
  overnight: "#3A4A5F",
  end: "#3A4A5F",
};

/* MapController flies to the active landmark when selection changes */
const MapController = ({ position, bounds }) => {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.flyTo(position, Math.max(map.getZoom(), 11), { duration: 0.9 });
    } else if (bounds) {
      map.flyToBounds(bounds, { padding: [40, 40], duration: 0.9 });
    }
  }, [position, bounds, map]);
  return null;
};

const ProgressBar = ({ idx, total, accent, t }) => {
  const pct = ((idx + 1) / total) * 100;
  return (
    <div className="flex items-center gap-3">
      <span className="text-[10px] tracking-[0.3em] uppercase text-[#5C5248] whitespace-nowrap">
        {t.day_short} {String(idx + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
      </span>
      <div className="flex-1 h-1 bg-[#2C2621]/10 overflow-hidden">
        <div className="h-full transition-all duration-500" style={{ width: `${pct}%`, background: accent }} />
      </div>
      <span className="text-[10px] tracking-[0.3em] uppercase whitespace-nowrap" style={{ color: accent }}>
        {Math.round(pct)}%
      </span>
    </div>
  );
};

export const DayRouteMap = ({ day, idx, total, accent = "#C16542" }) => {
  const { lang } = useLanguage();
  const t = LABEL_T[lang] || LABEL_T.es;
  const route = DAY_ROUTES[day.route_id];

  const bounds = useMemo(() => computeBounds(route), [route]);

  const [active, setActive] = useState(null); // index of selected landmark or null = fit-all

  if (!route || route.length < 2) return null;

  const activePos = active != null ? [route[active][1], route[active][2]] : null;

  const handleSelect = (i) => setActive((prev) => (prev === i ? null : i));

  return (
    <section data-testid={`day-route-map-${day.route_id}`}
             className="relative bg-[#F2EBE1] py-10 md:py-14 border-t border-[#2C2621]/10">
      <div className="absolute inset-0 berber-bg-diamond opacity-20 pointer-events-none" aria-hidden="true" />
      <div className="relative max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          {/* Map column */}
          <div className="lg:col-span-7">
            <div className="relative h-[420px] md:h-[480px] overflow-hidden border border-[#2C2621]/15 bg-[#FDFBF7] shadow-sm">
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
                <MapController position={activePos} bounds={bounds} />
                {route.map((p, i) => {
                  const kind = p[3];
                  const color = KIND_COLOR[kind] || accent;
                  const isActive = active === i;
                  const isAnchor = i === 0 || i === route.length - 1;
                  return (
                    <React.Fragment key={i}>
                      {/* Outer halo for the anchor / active points */}
                      {(isActive || isAnchor) && (
                        <CircleMarker
                          center={[p[1], p[2]]}
                          radius={isActive ? 22 : 14}
                          pathOptions={{ color, weight: 0, fillColor: color, fillOpacity: isActive ? 0.22 : 0.12 }}
                          interactive={false}
                        />
                      )}
                      <CircleMarker
                        center={[p[1], p[2]]}
                        radius={isActive ? 13 : isAnchor ? 10 : 8}
                        pathOptions={{
                          color: isActive ? "#1A1513" : "#FDFBF7",
                          weight: isActive ? 3 : 2,
                          fillColor: color,
                          fillOpacity: 1,
                        }}
                        eventHandlers={{ click: () => handleSelect(i) }}
                      >
                        <Tooltip direction="top" offset={[0, -8]} opacity={0.95}>
                          <span className="text-[11px] tracking-[0.05em]">{p[0]}</span>
                        </Tooltip>
                      </CircleMarker>
                    </React.Fragment>
                  );
                })}
              </MapContainer>
            </div>
            {/* Legend */}
            <ul className="mt-4 flex flex-wrap gap-4 text-[10px] tracking-[0.25em] uppercase text-[#5C5248]">
              {[
                { k: "start", l: t.legend_start },
                { k: "stop", l: t.legend_stop },
                { k: "overnight", l: t.legend_overnight },
              ].map((it) => (
                <li key={it.k} className="inline-flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: KIND_COLOR[it.k] }} />
                  {it.l}
                </li>
              ))}
            </ul>
          </div>

          {/* Side: progress + interactive landmark panel */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div>
              <span className="overline inline-flex items-center gap-2" style={{ color: accent }}>
                <Navigation className="w-3 h-3" strokeWidth={1.8} />
                {t.route}
              </span>
              <h4 className="font-serif-x text-2xl md:text-3xl text-[#2C2621] mt-3 leading-[1.15]">
                {route[0][0]} → {route[route.length - 1][0]}
              </h4>
            </div>

            <div>
              <span className="overline">{t.progress}</span>
              <div className="mt-3">
                <ProgressBar idx={idx} total={total} accent={accent} t={t} />
              </div>
            </div>

            <div>
              <span className="overline">{t.stages}</span>
              <ol className="mt-4 space-y-1.5" data-testid={`day-route-stages-${day.route_id}`}>
                {route.map((p, i) => {
                  const kind = p[3];
                  const color = KIND_COLOR[kind] || accent;
                  const isActive = active === i;
                  const kindLabel = kind === "start" ? t.legend_start
                    : kind === "end" ? t.legend_end
                    : kind === "overnight" ? t.legend_overnight
                    : t.legend_stop;
                  return (
                    <li key={i}>
                      <button
                        type="button"
                        onClick={() => handleSelect(i)}
                        data-testid={`day-landmark-btn-${day.route_id}-${i}`}
                        aria-pressed={isActive}
                        className={`group w-full text-left flex items-start gap-3 px-3.5 py-3 border transition-all duration-300 ${
                          isActive
                            ? "bg-[#FDFBF7] border-[#2C2621] shadow-[0_1px_0_0_#2C2621]"
                            : "bg-[#FDFBF7]/60 hover:bg-[#FDFBF7] border-[#2C2621]/15 hover:border-[#2C2621]/45"
                        }`}
                        style={isActive ? { boxShadow: `inset 3px 0 0 ${color}` } : undefined}
                      >
                        <span className="relative flex flex-col items-center pt-0.5">
                          <span
                            className={`w-3 h-3 rounded-full shrink-0 ring-2 transition-all ${
                              isActive ? "ring-[#FDFBF7] scale-125" : "ring-[#F2EBE1]"
                            }`}
                            style={{ background: color }}
                          />
                          {i < route.length - 1 && (
                            <span className="w-px flex-1 mt-1" style={{ background: `${color}50`, minHeight: "14px" }} />
                          )}
                        </span>
                        <span className="flex-1 pb-1">
                          <span className="text-[14px] md:text-[15px] text-[#2C2621] font-medium inline-flex items-center gap-2">
                            <MapPin className="w-3.5 h-3.5" style={{ color }} strokeWidth={1.6} />
                            {p[0]}
                          </span>
                          <span className="block text-[10px] tracking-[0.25em] uppercase mt-1" style={{ color }}>
                            {kindLabel}
                          </span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DayRouteMap;
