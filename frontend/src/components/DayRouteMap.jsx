import React, { useMemo, useState, useEffect } from "react";
import { MapContainer, TileLayer, CircleMarker, Tooltip, Polyline, useMap } from "react-leaflet";
import { MapPin, Navigation, Sparkles, ArrowRight, Home as HomeIcon } from "lucide-react";
import { DAY_LANDMARKS, LANDMARK_KINDS, computeLandmarkBounds } from "@/lib/dayLandmarks";
import { useLanguage, pick } from "@/contexts/LanguageContext";
import { LandmarkCarousel, LandmarkCarouselHint } from "@/components/LandmarkCarousel";
import { LANDMARK_GALLERIES } from "@/lib/landmarkGalleries";
import { resolveDayRoute } from "@/lib/dayRouteResolver";
import { CITY_PROFILES } from "@/lib/cityProfiles";

/* ============================================================
   <DayRouteMap />
   Renders ONE "Mapa del día" section per day, with three tiers:
     1) Rich landmark experience  – when DAY_LANDMARKS[route_id]
     2) Polyline waypoint map     – when resolveDayRoute returns ≥ 2 stops
     3) Editorial "estancia" card – when only a single anchor or no data
   Every day always shows a section (never returns null) so the
   itinerary feels coherent regardless of underlying data depth.
============================================================ */

const LABEL_T = {
  es: {
    route: "Mapa del día",
    landmarks_title: "Puntos de interés del día",
    progress: "Progreso del viaje",
    day_short: "Día",
    count_singular: "punto destacado",
    count_plural: "puntos destacados",
    stops_singular: "etapa",
    stops_plural: "etapas",
    approx_km: "km aprox.",
    waypoints_title: "Etapas del trayecto",
    stay_title: "Día sin desplazamientos",
    stay_body: "Esta jornada se vive sin grandes traslados — un día para reposar el viaje, dejar que el lugar te penetre y vivir el ritmo lento de Marruecos.",
    stay_in: "En",
    no_data_title: "Mapa del día",
    no_data_body: "Los detalles geográficos exactos de esta etapa se confirman al diseñar tu itinerario a medida.",
  },
  en: {
    route: "Day map",
    landmarks_title: "Day's landmarks",
    progress: "Trip progress",
    day_short: "Day",
    count_singular: "landmark",
    count_plural: "landmarks",
    stops_singular: "stop",
    stops_plural: "stops",
    approx_km: "approx. km",
    waypoints_title: "Today's stops",
    stay_title: "A stationary day",
    stay_body: "This day unfolds without long transfers — a day to let the destination sink in and live the slow rhythm of Morocco.",
    stay_in: "At",
    no_data_title: "Day map",
    no_data_body: "Exact geographic details of this leg are confirmed when we design your bespoke itinerary.",
  },
  fr: {
    route: "Carte du jour",
    landmarks_title: "Points d'intérêt du jour",
    progress: "Progression du voyage",
    day_short: "Jour",
    count_singular: "point d'intérêt",
    count_plural: "points d'intérêt",
    stops_singular: "étape",
    stops_plural: "étapes",
    approx_km: "km env.",
    waypoints_title: "Étapes du jour",
    stay_title: "Une journée sans déplacements",
    stay_body: "Une journée sans grands transferts — pour reposer le voyage et vivre le rythme lent du Maroc.",
    stay_in: "À",
    no_data_title: "Carte du jour",
    no_data_body: "Les détails géographiques exacts de cette étape sont confirmés lors de la conception de votre voyage sur mesure.",
  },
};

/* Type colours for the polyline waypoint mode. */
const TYPE_COLORS = {
  start:     "#5A6B4F",
  stop:      "#C16542",
  overnight: "#A07042",
  end:       "#5A7F9C",
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

/* ----- Haversine for polyline distance estimate ----- */
const haversine = (a, b) => {
  const R = 6371;
  const dLat = ((b[1] - a[1]) * Math.PI) / 180;
  const dLng = ((b[2] - a[2]) * Math.PI) / 180;
  const lat1 = (a[1] * Math.PI) / 180;
  const lat2 = (b[1] * Math.PI) / 180;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
};

/* ============================================================
   Tier 1 — Rich landmark experience
============================================================ */
const LandmarkMode = ({ day, idx, total, accent, t, lang, landmarks }) => {
  const bounds = useMemo(() => computeLandmarkBounds(landmarks), [landmarks]);
  const [activeId, setActiveId] = useState(null);
  const activeLandmark = landmarks.find((l) => l.id === activeId);
  const activePos = activeLandmark ? [activeLandmark.lat, activeLandmark.lng] : null;
  const handleSelect = (id) => setActiveId((prev) => (prev === id ? null : id));
  const usedKinds = Array.from(new Set(landmarks.map((l) => l.kind)));

  return (
    <section
      data-testid={`day-route-map-${day.route_id}`}
      data-tier="landmarks"
      className="relative bg-[#F2EBE1] mt-12 md:mt-16 pt-14 md:pt-20 pb-10 md:pb-14 border-t border-[#2C2621]/10"
    >
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

/* ============================================================
   Tier 2 — Polyline waypoint experience
============================================================ */
/* Convert a waypoint tuple [name, lat, lng, kind, profileKey] into
   a synthetic landmark when a CITY_PROFILES entry exists, so we can
   feed it to LandmarkCarousel just like a hand-curated landmark. */
const waypointToLandmark = (w, idx, routeId) => {
  const profileKey = w[4];
  const profile = profileKey ? CITY_PROFILES[profileKey] : null;
  if (!profile) return null;
  return {
    id: `${routeId}-${profileKey}-${idx}`,
    kind: profile.kind,
    name: profile.name,
    blurb: profile.blurb,
    lat: w[1],
    lng: w[2],
    gallery: profile.gallery,
  };
};

const WaypointMode = ({ day, idx, total, accent, t, lang, waypoints }) => {
  const positions = useMemo(() => waypoints.map((w) => [w[1], w[2]]), [waypoints]);
  const bounds = useMemo(() => {
    const lats = waypoints.map((w) => w[1]);
    const lngs = waypoints.map((w) => w[2]);
    const pad = 0.15;
    return [
      [Math.min(...lats) - pad, Math.min(...lngs) - pad],
      [Math.max(...lats) + pad, Math.max(...lngs) + pad],
    ];
  }, [waypoints]);
  const totalKm = useMemo(() => {
    let sum = 0;
    for (let i = 1; i < waypoints.length; i++) sum += haversine(waypoints[i - 1], waypoints[i]);
    return Math.round(sum);
  }, [waypoints]);

  /* Pre-compute synthetic landmarks for each waypoint that has a profile. */
  const wpLandmarks = useMemo(
    () => waypoints.map((w, i) => waypointToLandmark(w, i, day.route_id)),
    [waypoints, day.route_id]
  );
  const [activeIdx, setActiveIdx] = useState(null);
  const activeLandmark = activeIdx != null ? wpLandmarks[activeIdx] : null;
  const activePos = activeLandmark ? [activeLandmark.lat, activeLandmark.lng] : null;
  const handleSelect = (i) => {
    if (!wpLandmarks[i]) return;
    setActiveIdx((prev) => (prev === i ? null : i));
  };

  return (
    <section
      data-testid={`day-route-map-${day.route_id}`}
      data-tier="waypoints"
      className="relative bg-[#F2EBE1] mt-12 md:mt-16 pt-14 md:pt-20 pb-10 md:pb-14 border-t border-[#2C2621]/10"
    >
      <div className="absolute inset-0 berber-bg-diamond opacity-20 pointer-events-none" aria-hidden="true" />
      <div className="relative max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
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
                {/* Soft shadow polyline */}
                <Polyline
                  positions={positions}
                  pathOptions={{ color: "#1A1513", weight: 6, opacity: 0.18 }}
                />
                {/* Main accent polyline */}
                <Polyline
                  positions={positions}
                  pathOptions={{ color: accent, weight: 2.5, opacity: 0.9, dashArray: "1 6" }}
                />
                {waypoints.map((w, i) => {
                  const color = TYPE_COLORS[w[3]] || accent;
                  const hasProfile = !!wpLandmarks[i];
                  const isActive = activeIdx === i;
                  return (
                    <React.Fragment key={`${day.route_id}-wp-${i}`}>
                      <CircleMarker
                        center={[w[1], w[2]]}
                        radius={isActive ? 24 : 18}
                        pathOptions={{
                          color,
                          weight: 0,
                          fillColor: color,
                          fillOpacity: isActive ? 0.22 : 0.10,
                        }}
                        interactive={false}
                      />
                      <CircleMarker
                        center={[w[1], w[2]]}
                        radius={isActive ? 12 : 9}
                        pathOptions={{
                          color: isActive ? "#1A1513" : "#FDFBF7",
                          weight: isActive ? 3 : 2,
                          fillColor: color,
                          fillOpacity: 1,
                        }}
                        eventHandlers={hasProfile ? { click: () => handleSelect(i) } : undefined}
                      >
                        <Tooltip direction="top" offset={[0, -10]} opacity={0.95}>
                          <span className="text-[11px] tracking-[0.05em]">{w[0]}</span>
                        </Tooltip>
                      </CircleMarker>
                    </React.Fragment>
                  );
                })}
              </MapContainer>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col gap-6">
            <div>
              <span className="overline inline-flex items-center gap-2" style={{ color: accent }}>
                <Navigation className="w-3 h-3" strokeWidth={1.8} />
                {t.route}
              </span>
              <h4 className="font-serif-x text-2xl md:text-3xl text-[#2C2621] mt-3 leading-[1.15]">
                {t.waypoints_title}
              </h4>
              <p className="mt-2 text-[12px] tracking-[0.18em] uppercase text-[#5C5248] inline-flex items-center gap-4">
                <span className="inline-flex items-center gap-2">
                  <Sparkles className="w-3 h-3" style={{ color: accent }} strokeWidth={1.6} />
                  {waypoints.length} {waypoints.length === 1 ? t.stops_singular : t.stops_plural}
                </span>
                {totalKm > 0 && <span>· {totalKm.toLocaleString()} {t.approx_km}</span>}
              </p>
            </div>

            <div>
              <span className="overline">{t.progress}</span>
              <div className="mt-3">
                <ProgressBar idx={idx} total={total} accent={accent} t={t} />
              </div>
            </div>

            <ol className="space-y-2" data-testid={`day-waypoints-${day.route_id}`}>
              {waypoints.map((w, i) => {
                const color = TYPE_COLORS[w[3]] || accent;
                const isLast = i === waypoints.length - 1;
                const lm = wpLandmarks[i];
                const isActive = activeIdx === i;
                const Row = lm ? "button" : "div";
                const rowProps = lm
                  ? {
                      type: "button",
                      onClick: () => handleSelect(i),
                      "aria-pressed": isActive,
                      "data-testid": `day-waypoint-btn-${day.route_id}-${i}`,
                    }
                  : {};
                return (
                  <li key={`${day.route_id}-row-${i}`}>
                    <Row
                      {...rowProps}
                      className={`group w-full text-left flex items-start gap-4 px-4 py-3 border transition-all duration-300 ${
                        isActive
                          ? "bg-[#FDFBF7] border-[#2C2621]"
                          : lm
                          ? "bg-[#FDFBF7]/70 hover:bg-[#FDFBF7] border-[#2C2621]/15 hover:border-[#2C2621]/45"
                          : "bg-[#FDFBF7]/70 border-[#2C2621]/15"
                      }`}
                      style={isActive ? { boxShadow: `inset 3px 0 0 ${color}` } : undefined}
                    >
                      <span
                        className="font-serif-x text-xl leading-none mt-0.5 shrink-0 tabular-nums"
                        style={{ color }}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="flex-1 min-w-0">
                        <span className="block font-serif-x text-[15px] md:text-[16px] text-[#2C2621] leading-snug inline-flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 shrink-0" style={{ color }} strokeWidth={1.6} />
                          {w[0]}
                        </span>
                        {isActive && lm && (
                          <span className="block mt-2 text-[13px] text-[#5C5248] leading-[1.6]">
                            {pick(lm.blurb, lang)}
                          </span>
                        )}
                      </span>
                      {!isLast && (
                        <ArrowRight className="w-3.5 h-3.5 mt-1 text-[#5C5248] shrink-0" strokeWidth={1.6} />
                      )}
                    </Row>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>

        {activeLandmark ? (
          <LandmarkCarousel
            landmark={activeLandmark}
            accent={accent}
            onClose={() => setActiveIdx(null)}
          />
        ) : wpLandmarks.some(Boolean) ? (
          <LandmarkCarouselHint accent={accent} />
        ) : null}
      </div>
    </section>
  );
};

/* ============================================================
   Tier 3 — Editorial "stationary day" / no-data card
============================================================ */
const StayCard = ({ day, idx, total, accent, t, lang, anchor }) => {
  // Try to upgrade the static card into an interactive single-point map
  // when the anchor has a CITY_PROFILES entry — every day must yield a
  // clickable map experience with a gallery drawer.
  const profileKey = anchor ? anchor[4] : null;
  const profile = profileKey ? CITY_PROFILES[profileKey] : null;

  if (profile && anchor) {
    const landmark = {
      id: `${day.route_id}-${profileKey}-stay`,
      kind: profile.kind,
      name: profile.name,
      blurb: profile.blurb,
      lat: anchor[1],
      lng: anchor[2],
      gallery: profile.gallery,
    };
    return (
      <StayInteractive
        day={day}
        idx={idx}
        total={total}
        accent={accent}
        t={t}
        lang={lang}
        landmark={landmark}
      />
    );
  }

  const title = anchor
    ? anchor[0]
    : (pick(day.title, lang) || "").split("·")[0]?.trim();

  return (
    <section
      data-testid={`day-route-map-${day.route_id}`}
      data-tier="stay"
      className="relative bg-[#F2EBE1] mt-12 md:mt-16 pt-14 md:pt-20 pb-14 md:pb-20 border-t border-[#2C2621]/10 overflow-hidden"
    >
      <div className="absolute inset-0 berber-bg-diamond opacity-20 pointer-events-none" aria-hidden="true" />
      <div className="relative max-w-5xl mx-auto px-6 md:px-12 text-center">
        <span
          className="inline-flex items-center gap-2 text-[10px] tracking-[0.35em] uppercase mb-5"
          style={{ color: accent }}
        >
          <Navigation className="w-3 h-3" strokeWidth={1.8} />
          {t.route}
        </span>
        <h4 className="font-serif-x text-2xl md:text-4xl text-[#2C2621] leading-[1.1] tracking-tight">
          {anchor ? t.stay_title : t.no_data_title}
        </h4>
        {title && (
          <p className="mt-5 inline-flex items-center gap-2 text-[12px] md:text-[13px] tracking-[0.25em] uppercase text-[#5C5248]">
            <HomeIcon className="w-3.5 h-3.5" style={{ color: accent }} strokeWidth={1.7} />
            {t.stay_in} {title}
          </p>
        )}
        <p className="mt-6 max-w-2xl mx-auto text-[14px] md:text-[15px] text-[#5C5248] leading-relaxed italic">
          {anchor ? t.stay_body : t.no_data_body}
        </p>
        <div className="mt-8 max-w-md mx-auto">
          <ProgressBar idx={idx} total={total} accent={accent} t={t} />
        </div>
      </div>
    </section>
  );
};

/* Interactive variant of StayCard — used when the anchor city has a profile.
   Mini-map + single side card + gallery drawer (mirrors the Tier 1 layout). */
const StayInteractive = ({ day, idx, total, accent, t, lang, landmark }) => {
  const [open, setOpen] = useState(false);
  const center = [landmark.lat, landmark.lng];
  const bounds = useMemo(() => {
    const pad = 0.45;
    return [
      [landmark.lat - pad, landmark.lng - pad],
      [landmark.lat + pad, landmark.lng + pad],
    ];
  }, [landmark.lat, landmark.lng]);
  const kindCfg = LANDMARK_KINDS[landmark.kind] || { color: accent, label: { es: "", en: "", fr: "" } };
  const color = kindCfg.color;

  return (
    <section
      data-testid={`day-route-map-${day.route_id}`}
      data-tier="stay"
      className="relative bg-[#F2EBE1] mt-12 md:mt-16 pt-14 md:pt-20 pb-10 md:pb-14 border-t border-[#2C2621]/10"
    >
      <div className="absolute inset-0 berber-bg-diamond opacity-20 pointer-events-none" aria-hidden="true" />
      <div className="relative max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
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
                <CircleMarker
                  center={center}
                  radius={open ? 28 : 22}
                  pathOptions={{ color, weight: 0, fillColor: color, fillOpacity: open ? 0.25 : 0.14 }}
                  interactive={false}
                />
                <CircleMarker
                  center={center}
                  radius={open ? 14 : 11}
                  pathOptions={{
                    color: open ? "#1A1513" : "#FDFBF7",
                    weight: open ? 3 : 2,
                    fillColor: color,
                    fillOpacity: 1,
                  }}
                  eventHandlers={{ click: () => setOpen((v) => !v) }}
                >
                  <Tooltip direction="top" offset={[0, -10]} opacity={0.95}>
                    <span className="text-[11px] tracking-[0.05em]">{pick(landmark.name, lang)}</span>
                  </Tooltip>
                </CircleMarker>
              </MapContainer>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col gap-6">
            <div>
              <span className="overline inline-flex items-center gap-2" style={{ color: accent }}>
                <Navigation className="w-3 h-3" strokeWidth={1.8} />
                {t.route}
              </span>
              <h4 className="font-serif-x text-2xl md:text-3xl text-[#2C2621] mt-3 leading-[1.15]">
                {t.stay_title}
              </h4>
              <p className="mt-2 text-[12px] tracking-[0.18em] uppercase text-[#5C5248] inline-flex items-center gap-2">
                <HomeIcon className="w-3.5 h-3.5" style={{ color: accent }} strokeWidth={1.7} />
                {t.stay_in} {pick(landmark.name, lang)}
              </p>
            </div>

            <div>
              <span className="overline">{t.progress}</span>
              <div className="mt-3">
                <ProgressBar idx={idx} total={total} accent={accent} t={t} />
              </div>
            </div>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              data-testid={`day-stay-btn-${day.route_id}`}
              aria-pressed={open}
              className={`group w-full text-left flex items-start gap-4 px-4 py-3.5 border transition-all duration-300 ${
                open
                  ? "bg-[#FDFBF7] border-[#2C2621]"
                  : "bg-[#FDFBF7]/70 hover:bg-[#FDFBF7] border-[#2C2621]/15 hover:border-[#2C2621]/45"
              }`}
              style={open ? { boxShadow: `inset 3px 0 0 ${color}` } : undefined}
            >
              <span className={`mt-1 w-3.5 h-3.5 rounded-full shrink-0 ring-2 transition-all ${
                open ? "ring-[#FDFBF7] scale-125" : "ring-[#F2EBE1]"
              }`} style={{ background: color }} />
              <span className="flex-1 min-w-0">
                <span className="block text-[10px] tracking-[0.25em] uppercase" style={{ color }}>
                  {pick(kindCfg.label, lang)}
                </span>
                <span className="block font-serif-x text-[16px] md:text-[17px] text-[#2C2621] leading-snug mt-1 inline-flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 shrink-0" style={{ color }} strokeWidth={1.6} />
                  {pick(landmark.name, lang)}
                </span>
                <span className="block mt-2 text-[13px] text-[#5C5248] leading-[1.6]">
                  {pick(landmark.blurb, lang)}
                </span>
              </span>
            </button>
          </div>
        </div>

        {open ? (
          <LandmarkCarousel
            landmark={landmark}
            accent={accent}
            onClose={() => setOpen(false)}
          />
        ) : (
          <LandmarkCarouselHint accent={accent} />
        )}
      </div>
    </section>
  );
};

/* ============================================================
   Public component — picks the right tier
============================================================ */
export const DayRouteMap = ({ day, idx, total, accent = "#C16542" }) => {
  const { lang } = useLanguage();
  const t = LABEL_T[lang] || LABEL_T.es;

  if (!day || !day.route_id) return null;

  // Tier 1 — rich landmarks
  const landmarks = DAY_LANDMARKS[day.route_id];
  if (landmarks && landmarks.length > 0) {
    return <LandmarkMode day={day} idx={idx} total={total} accent={accent} t={t} lang={lang} landmarks={landmarks} />;
  }

  // Tier 2 — polyline waypoints (curated or parsed)
  const waypoints = resolveDayRoute(day.route_id);
  if (waypoints.length >= 2) {
    return <WaypointMode day={day} idx={idx} total={total} accent={accent} t={t} lang={lang} waypoints={waypoints} />;
  }

  // Tier 3 — stationary day / no-data card
  const anchor = waypoints.length === 1 ? waypoints[0] : null;
  return <StayCard day={day} idx={idx} total={total} accent={accent} t={t} lang={lang} anchor={anchor} />;
};

export default DayRouteMap;
