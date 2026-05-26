import React, { useMemo, useState, useEffect } from "react";
import { MapContainer, TileLayer, CircleMarker, Tooltip, useMap } from "react-leaflet";
import { MapPin, Navigation, Sparkles } from "lucide-react";
import { DAY_LANDMARKS, LANDMARK_KINDS, computeLandmarkBounds } from "@/lib/dayLandmarks";
import { useLanguage, pick } from "@/contexts/LanguageContext";
import { LandmarkCarousel, LandmarkCarouselHint } from "@/components/LandmarkCarousel";
import { LANDMARK_GALLERIES } from "@/lib/landmarkGalleries";

const LABEL_T = {
  es: { route: "Mapa del día", landmarks_title: "Puntos de interés del día", progress: "Progreso del viaje", day_short: "Día", count_singular: "punto destacado", count_plural: "puntos destacados" },
  en: { route: "Day map", landmarks_title: "Day's landmarks", progress: "Trip progress", day_short: "Day", count_singular: "landmark", count_plural: "landmarks" },
  fr: { route: "Carte du jour", landmarks_title: "Points d'intérêt du jour", progress: "Progression du voyage", day_short: "Jour", count_singular: "point d'intérêt", count_plural: "points d'intérêt" },
};

/* MapController flies to the active landmark when selection changes */
const MapController = ({ position, bounds }) => {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.flyTo(position, Math.max(map.getZoom(), 11), { duration: 0.9 });
    } else if (bounds) {
      map.flyToBounds(bounds, { padding: [50, 50], duration: 0.9 });
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
  const landmarks = DAY_LANDMARKS[day.route_id];

  const bounds = useMemo(() => computeLandmarkBounds(landmarks), [landmarks]);
  const [activeId, setActiveId] = useState(null);

  if (!landmarks || landmarks.length === 0) return null;

  const activeLandmark = landmarks.find((l) => l.id === activeId);
  const activePos = activeLandmark ? [activeLandmark.lat, activeLandmark.lng] : null;
  const handleSelect = (id) => setActiveId((prev) => (prev === id ? null : id));

  // Unique kinds used in this day, for the dynamic legend
  const usedKinds = Array.from(new Set(landmarks.map((l) => l.kind)));

  return (
    <section data-testid={`day-route-map-${day.route_id}`}
             className="relative bg-[#F2EBE1] mt-12 md:mt-16 pt-14 md:pt-20 pb-10 md:pb-14 border-t border-[#2C2621]/10">
      <div className="absolute inset-0 berber-bg-diamond opacity-20 pointer-events-none" aria-hidden="true" />
      <div className="relative max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          {/* Map column */}
          <div className="lg:col-span-7">
            <div className="relative h-[460px] md:h-[520px] overflow-hidden border border-[#2C2621]/15 bg-[#FDFBF7] shadow-sm">
              <MapContainer
                bounds={bounds}
                boundsOptions={{ padding: [50, 50] }}
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
                {landmarks.map((l) => {
                  const kindCfg = LANDMARK_KINDS[l.kind] || { color: accent };
                  const color = kindCfg.color;
                  const isActive = activeId === l.id;
                  return (
                    <React.Fragment key={l.id}>
                      {/* Soft halo on every landmark + strong halo when active */}
                      <CircleMarker
                        center={[l.lat, l.lng]}
                        radius={isActive ? 26 : 16}
                        pathOptions={{ color, weight: 0, fillColor: color, fillOpacity: isActive ? 0.25 : 0.12 }}
                        interactive={false}
                      />
                      <CircleMarker
                        center={[l.lat, l.lng]}
                        radius={isActive ? 13 : 10}
                        pathOptions={{
                          color: isActive ? "#1A1513" : "#FDFBF7",
                          weight: isActive ? 3 : 2,
                          fillColor: color,
                          fillOpacity: 1,
                        }}
                        eventHandlers={{ click: () => handleSelect(l.id) }}
                      >
                        <Tooltip direction="top" offset={[0, -10]} opacity={0.95}>
                          <span className="text-[11px] tracking-[0.05em]">{pick(l.name, lang)}</span>
                        </Tooltip>
                      </CircleMarker>
                    </React.Fragment>
                  );
                })}
              </MapContainer>
            </div>
            {/* Dynamic legend with the kinds present in this day */}
            <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-[10px] tracking-[0.25em] uppercase text-[#5C5248]">
              {usedKinds.map((k) => {
                const cfg = LANDMARK_KINDS[k];
                return cfg ? (
                  <li key={k} className="inline-flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: cfg.color }} />
                    {pick(cfg.label, lang)}
                  </li>
                ) : null;
              })}
            </ul>
          </div>

          {/* Side: progress + landmark panel */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div>
              <span className="overline inline-flex items-center gap-2" style={{ color: accent }}>
                <Navigation className="w-3 h-3" strokeWidth={1.8} />
                {t.route}
              </span>
              <h4 className="font-serif-x text-2xl md:text-3xl text-[#2C2621] mt-3 leading-[1.15]">
                {t.landmarks_title}
              </h4>
              <p className="mt-2 text-[12px] tracking-[0.18em] uppercase text-[#5C5248] inline-flex items-center gap-2">
                <Sparkles className="w-3 h-3" style={{ color: accent }} strokeWidth={1.6} />
                {landmarks.length} {landmarks.length === 1 ? t.count_singular : t.count_plural}
              </p>
            </div>

            <div>
              <span className="overline">{t.progress}</span>
              <div className="mt-3">
                <ProgressBar idx={idx} total={total} accent={accent} t={t} />
              </div>
            </div>

            <ol className="space-y-2" data-testid={`day-landmarks-${day.route_id}`}>
              {landmarks.map((l) => {
                const kindCfg = LANDMARK_KINDS[l.kind] || { color: accent, label: { es: "", en: "", fr: "" } };
                const color = kindCfg.color;
                const isActive = activeId === l.id;
                return (
                  <li key={l.id}>
                    <button
                      type="button"
                      onClick={() => handleSelect(l.id)}
                      data-testid={`day-landmark-btn-${day.route_id}-${l.id}`}
                      aria-pressed={isActive}
                      className={`group w-full text-left flex items-start gap-4 px-4 py-3.5 border transition-all duration-300 ${
                        isActive
                          ? "bg-[#FDFBF7] border-[#2C2621]"
                          : "bg-[#FDFBF7]/70 hover:bg-[#FDFBF7] border-[#2C2621]/15 hover:border-[#2C2621]/45"
                      }`}
                      style={isActive ? { boxShadow: `inset 3px 0 0 ${color}` } : undefined}
                    >
                      <span className={`mt-1 w-3.5 h-3.5 rounded-full shrink-0 ring-2 transition-all ${
                        isActive ? "ring-[#FDFBF7] scale-125" : "ring-[#F2EBE1]"
                      }`} style={{ background: color }} />
                      <span className="flex-1 min-w-0">
                        <span className="block text-[10px] tracking-[0.25em] uppercase" style={{ color }}>
                          {pick(kindCfg.label, lang)}
                        </span>
                        <span className="block font-serif-x text-[16px] md:text-[17px] text-[#2C2621] leading-snug mt-1 inline-flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 shrink-0" style={{ color }} strokeWidth={1.6} />
                          {pick(l.name, lang)}
                        </span>
                        {isActive && (
                          <span className="block mt-2 text-[13px] text-[#5C5248] leading-[1.6]">
                            {pick(l.blurb, lang)}
                          </span>
                        )}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>

        {/* Per-landmark image carousel — appears below the map when a
            landmark is selected (synchronized with map + side list). */}
        {activeLandmark && LANDMARK_GALLERIES[activeLandmark.id] ? (
          <LandmarkCarousel
            landmark={activeLandmark}
            accent={accent}
            onClose={() => setActiveId(null)}
          />
        ) : (
          <LandmarkCarouselHint accent={accent} />
        )}
      </div>
    </section>
  );
};

export default DayRouteMap;
