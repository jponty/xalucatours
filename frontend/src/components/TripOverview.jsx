import React, { useMemo, useState, useEffect } from "react";
import { MapContainer, TileLayer, CircleMarker, Tooltip, useMap } from "react-leaflet";
import { Compass, Thermometer, CloudSun, MapPin, Activity, Images } from "lucide-react";
import { DAY_LANDMARKS, computeLandmarkBounds } from "@/lib/dayLandmarks";
import { useLanguage, pick } from "@/contexts/LanguageContext";
import { buildRouteGalleryCells } from "@/lib/routeLandmarks";
import EditableImage from "@/components/EditableImage";

/* ----- Trilingual labels ----- */
const T = {
  es: {
    eyebrow: "Resumen visual del viaje",
    title: "El recorrido completo, de un solo vistazo.",
    body: "Todos los puntos de interés y la línea temporal del viaje — para tener la foto global antes de pedir presupuesto.",
    map_label: "Mapa general", timeline_label: "Línea temporal", climate_label: "Clima orientativo",
    day_short: "Día", stops_short: "puntos", filter_all: "Todos los días",
    climate_atlas: "Cordillera del Atlas · 1.612 m",
    climate_sahara: "Sahara · Erg Chebbi",
    climate_note: "Temperaturas medias orientativas en °C, día y noche.",
    climate_live: "Este mes · en directo",
    climate_live_subtitle: "Datos reales · Open-Meteo",
    climate_live_loading: "Cargando datos reales del clima…",
    climate_live_error: "No se han podido cargar los datos en vivo · mostrando datos orientativos.",
    day_label: "Día", night_label: "Noche",
    gallery_label: "Galería del recorrido",
  },
  en: {
    eyebrow: "Visual trip summary",
    title: "The full journey, at a glance.",
    body: "Every landmark and the trip's timeline — so you have the big picture before requesting a quote.",
    map_label: "Overview map", timeline_label: "Timeline", climate_label: "Indicative climate",
    day_short: "Day", stops_short: "stops", filter_all: "All days",
    climate_atlas: "Atlas range · 1,612 m",
    climate_sahara: "Sahara · Erg Chebbi",
    climate_note: "Average indicative temperatures in °C, day and night.",
    climate_live: "This month · live",
    climate_live_subtitle: "Real data · Open-Meteo",
    climate_live_loading: "Loading live weather data…",
    climate_live_error: "Couldn't load live data · showing indicative values.",
    day_label: "Day", night_label: "Night",
    gallery_label: "Route gallery",
  },
  fr: {
    eyebrow: "Résumé visuel du voyage",
    title: "L'itinéraire complet en un coup d'œil.",
    body: "Tous les points d'intérêt et la chronologie du voyage — pour avoir la vue d'ensemble avant de demander un devis.",
    map_label: "Carte générale", timeline_label: "Chronologie", climate_label: "Climat indicatif",
    day_short: "Jour", stops_short: "arrêts", filter_all: "Tous les jours",
    climate_atlas: "Cordillère de l'Atlas · 1 612 m",
    climate_sahara: "Sahara · Erg Chebbi",
    climate_note: "Températures moyennes indicatives en °C, jour et nuit.",
    climate_live: "Ce mois · en direct",
    climate_live_subtitle: "Données réelles · Open-Meteo",
    climate_live_loading: "Chargement des données météo en direct…",
    climate_live_error: "Impossible de charger les données en direct · valeurs indicatives affichées.",
    day_label: "Jour", night_label: "Nuit",
    gallery_label: "Galerie de l'itinéraire",
  },
};

const SEASON_LABELS = {
  low:     { es: "Temporada baja",  en: "Low season",  fr: "Basse saison",  months: { es: "Jun · Jul · Ago", en: "Jun · Jul · Aug", fr: "Juin · Juil · Août" } },
  mid:     { es: "Temporada media", en: "Mid season",  fr: "Moyenne saison",months: { es: "Feb · May · Sep", en: "Feb · May · Sep", fr: "Fév · Mai · Sep" } },
  high:    { es: "Temporada alta",  en: "High season", fr: "Haute saison",  months: { es: "Mar · Abr · Oct · Nov", en: "Mar · Apr · Oct · Nov", fr: "Mars · Avr · Oct · Nov" } },
  premium: { es: "Fechas premium",  en: "Premium",     fr: "Dates premium", months: { es: "Sem. Santa · Navidad · NYE", en: "Easter · Christmas · NYE", fr: "Pâques · Noël · NYE" } },
};

/* Indicative climate (day/night) per season for Atlas & Sahara */
const CLIMATE = {
  low:     { atlas: { day: 28, night: 14 }, sahara: { day: 42, night: 26 } },
  mid:     { atlas: { day: 22, night: 9 },  sahara: { day: 30, night: 16 } },
  high:    { atlas: { day: 19, night: 6 },  sahara: { day: 26, night: 12 } },
  premium: { atlas: { day: 12, night: 0 },  sahara: { day: 20, night: 5 } },
};

const MONTH_NAMES = {
  es: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
  en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  fr: ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"],
};

const FitBoundsCtl = ({ bounds }) => {
  const map = useMap();
  useEffect(() => {
    if (bounds) map.flyToBounds(bounds, { padding: [50, 50], duration: 0.9 });
  }, [bounds, map]);
  return null;
};

/* ============================================================
   RouteImageGallery — full-journey gallery at the bottom of the
   Visual Trip Summary. It REUSES the existing "Galería del lugar"
   images for every day and place, in real itinerary order (by day →
   by place → by card). Each tile references the same CMS slot as the
   place carousel, so editing an image there is reflected here
   automatically (no new images, no duplicate records).
============================================================ */
const RouteImageGallery = ({ days, t }) => {
  const { lang } = useLanguage();
  const cells = useMemo(
    () => buildRouteGalleryCells(days, lang),
    [days, lang],
  );

  if (cells.length === 0) return null;

  return (
    <div className="mt-14 md:mt-16" data-testid="trip-overview-route-gallery">
      <span className="overline inline-flex items-center gap-2 text-[#C16542]">
        <Images className="w-3 h-3" strokeWidth={1.8} />{t.gallery_label}
      </span>
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
        {cells.map((c, i) => (
          <div
            key={`${c.slot}-${i}`}
            data-testid={`route-gallery-tile-${i}`}
            data-route-gallery-slot={c.slot}
            className="relative aspect-square overflow-hidden bg-[#1A1513]"
          >
            <EditableImage
              slot={c.slot}
              fallback={c.src}
              alt={pick(c.caption, lang)}
              aspectRatio="1/1"
              imgProps={{ loading: "lazy" }}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

/* ============================================================
   TripOverview — single map with all days' landmarks + timeline
============================================================ */
export const TripOverview = ({ days }) => {
  const { lang } = useLanguage();
  const t = T[lang] || T.es;
  const [activeDay, setActiveDay] = useState(null); // null = show all
  const [activeSeason, setActiveSeason] = useState("high");
  const [liveData, setLiveData] = useState(null);
  const [liveState, setLiveState] = useState("idle"); // idle | loading | ok | error

  // Fetch real monthly climate from our backend (which proxies Open-Meteo)
  useEffect(() => {
    let cancelled = false;
    setLiveState("loading");
    const api = process.env.REACT_APP_BACKEND_URL;
    fetch(`${api}/api/climate/current-month`)
      .then((r) => r.json())
      .then((payload) => {
        if (cancelled) return;
        const z = payload && payload.zones;
        if (z && z.atlas && z.sahara) {
          setLiveData({
            atlas: { day: z.atlas.day, night: z.atlas.night },
            sahara: { day: z.sahara.day, night: z.sahara.night },
          });
          setLiveState("ok");
          setActiveSeason("live");
        } else {
          setLiveState("error");
        }
      })
      .catch(() => { if (!cancelled) setLiveState("error"); });
    return () => { cancelled = true; };
  }, []);

  const currentMonthName = (MONTH_NAMES[lang] || MONTH_NAMES.es)[new Date().getMonth()];
  const showingLive = activeSeason === "live" && liveData;
  const climateData = showingLive ? liveData : CLIMATE[activeSeason];

  // Flatten landmarks per day with day metadata
  const dayBlocks = useMemo(() => days.map((d, i) => {
    const list = DAY_LANDMARKS[d.route_id] || [];
    return {
      idx: i,
      id: d.id,
      route_id: d.route_id,
      accent: d.accent,
      title: d.title,
      landmarks: list,
    };
  }), [days]);

  const allLandmarks = useMemo(
    () => dayBlocks.flatMap((d) => d.landmarks.map((l) => ({ ...l, dayIdx: d.idx, accent: d.accent }))),
    [dayBlocks]
  );
  const visibleLandmarks = activeDay == null ? allLandmarks : allLandmarks.filter((l) => l.dayIdx === activeDay);

  const bounds = useMemo(() => computeLandmarkBounds(visibleLandmarks), [visibleLandmarks]);

  return (
    <section id="overview" data-testid="trip-overview"
             className="relative bg-[#F2EBE1] py-24 md:py-32 overflow-hidden border-t border-[#2C2621]/10">
      <div className="absolute inset-0 berber-bg-diamond opacity-20 pointer-events-none" aria-hidden="true" />
      <div className="relative max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end mb-12">
          <div className="md:col-span-7">
            <span className="overline inline-flex items-center gap-2 text-[#C16542]">
              <Compass className="w-3 h-3" strokeWidth={1.8} />{t.eyebrow}
            </span>
            <h2 className="font-serif-x text-4xl md:text-5xl lg:text-[54px] leading-[1.05] tracking-tight mt-5 text-[#2C2621]">
              {t.title}
            </h2>
          </div>
          <div className="md:col-span-5">
            <p className="text-base md:text-lg text-[#5C5248] leading-relaxed">{t.body}</p>
          </div>
        </div>

        {/* Map + day filters */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 mb-14">
          <div className="lg:col-span-8">
            <div className="flex items-center justify-between mb-4">
              <span className="overline">{t.map_label}</span>
              <button
                type="button"
                onClick={() => setActiveDay(null)}
                data-testid="trip-overview-filter-all"
                className={`text-[10px] tracking-[0.3em] uppercase transition-colors ${
                  activeDay == null ? "text-[#C16542]" : "text-[#5C5248] hover:text-[#2C2621]"
                }`}
              >
                {t.filter_all}
              </button>
            </div>
            <div className="relative h-[460px] md:h-[560px] overflow-hidden border border-[#2C2621]/15 bg-[#FDFBF7]">
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
                <FitBoundsCtl bounds={bounds} />
                {visibleLandmarks.map((l, i) => (
                  <React.Fragment key={`${l.dayIdx}-${l.id}-${i}`}>
                    <CircleMarker
                      center={[l.lat, l.lng]}
                      radius={14}
                      pathOptions={{ color: l.accent, weight: 0, fillColor: l.accent, fillOpacity: 0.18 }}
                      interactive={false}
                    />
                    <CircleMarker
                      center={[l.lat, l.lng]}
                      radius={8}
                      pathOptions={{ color: "#FDFBF7", weight: 2, fillColor: l.accent, fillOpacity: 1 }}
                      eventHandlers={{ click: () => setActiveDay(l.dayIdx) }}
                    >
                      <Tooltip direction="top" offset={[0, -8]} opacity={0.95}>
                        <span className="text-[11px]">
                          <span className="font-semibold">{t.day_short} {String(l.dayIdx + 1).padStart(2, "0")}</span>
                          {" · "}{pick(l.name, lang)}
                        </span>
                      </Tooltip>
                    </CircleMarker>
                  </React.Fragment>
                ))}
              </MapContainer>
            </div>
          </div>

          {/* Right: day chip filters */}
          <div className="lg:col-span-4">
            <span className="overline">{t.timeline_label}</span>
            <ol className="mt-4 space-y-2" data-testid="trip-overview-days">
              {dayBlocks.map((d) => {
                const isActive = activeDay === d.idx;
                return (
                  <li key={d.idx}>
                    <button
                      type="button"
                      onClick={() => setActiveDay((prev) => (prev === d.idx ? null : d.idx))}
                      data-testid={`trip-overview-day-${d.idx + 1}`}
                      className={`group w-full text-left flex items-center gap-4 px-4 py-3.5 border transition-all duration-300 ${
                        isActive
                          ? "bg-[#FDFBF7] border-[#2C2621]"
                          : "bg-[#FDFBF7]/70 hover:bg-[#FDFBF7] border-[#2C2621]/15 hover:border-[#2C2621]/45"
                      }`}
                      style={isActive ? { boxShadow: `inset 3px 0 0 ${d.accent}` } : undefined}
                    >
                      <span className="font-serif-x text-2xl text-[#2C2621] tabular-nums min-w-[42px]">
                        {String(d.idx + 1).padStart(2, "0")}
                      </span>
                      <span className="flex-1 min-w-0">
                        <span className="block text-[10px] tracking-[0.3em] uppercase" style={{ color: d.accent }}>
                          {t.day_short} {String(d.idx + 1).padStart(2, "0")} · {d.landmarks.length} {t.stops_short}
                        </span>
                        <span className="block font-serif-x text-[15px] md:text-base text-[#2C2621] leading-snug mt-1 line-clamp-2">
                          {pick(d.title, lang)}
                        </span>
                      </span>
                      <MapPin className="w-4 h-4 shrink-0" style={{ color: d.accent }} strokeWidth={1.6} />
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>

        {/* Horizontal day-by-day strip */}
        <div className="mb-14" data-testid="trip-overview-strip">
          <span className="overline">{t.timeline_label}</span>
          <div className="relative mt-6">
            <div className="absolute left-0 right-0 top-[14px] h-px bg-[#2C2621]/15" />
            <ol className="relative grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-px">
              {dayBlocks.map((d) => {
                const isActive = activeDay === d.idx;
                return (
                  <li key={d.idx} className="relative pt-0 pl-4 lg:pl-0">
                    <button
                      type="button"
                      onClick={() => setActiveDay((prev) => (prev === d.idx ? null : d.idx))}
                      onMouseEnter={() => setActiveDay(d.idx)}
                      data-testid={`trip-overview-timeline-${d.idx + 1}`}
                      className="block w-full text-left group"
                    >
                      <span
                        className={`relative z-10 mx-auto block w-7 h-7 rounded-full transition-all duration-300 ${
                          isActive ? "scale-125 ring-4 ring-[#F2EBE1]" : "ring-2 ring-[#F2EBE1]"
                        }`}
                        style={{ background: d.accent }}
                      />
                      <span className="block text-center mt-4">
                        <span className="text-[10px] tracking-[0.3em] uppercase" style={{ color: d.accent }}>
                          {t.day_short} {String(d.idx + 1).padStart(2, "0")}
                        </span>
                        <span className="block font-serif-x text-sm md:text-[15px] text-[#2C2621] leading-snug mt-2 px-2 line-clamp-2">
                          {pick(d.title, lang)}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>

        {/* Climate */}
        <div data-testid="trip-overview-climate" className="border border-[#2C2621]/15 bg-[#FDFBF7]">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6 md:p-8">
            <div className="md:col-span-4">
              <span className="overline inline-flex items-center gap-2 text-[#C16542]">
                <CloudSun className="w-3 h-3" strokeWidth={1.8} />{t.climate_label}
              </span>
              <p className="mt-3 text-[14px] text-[#5C5248] leading-relaxed">{t.climate_note}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {/* Live (this month) chip — first */}
                <button
                  type="button"
                  onClick={() => liveState === "ok" && setActiveSeason("live")}
                  disabled={liveState !== "ok"}
                  data-testid="climate-season-live"
                  className={`text-[10px] tracking-[0.3em] uppercase px-3 py-2 border transition-all duration-300 inline-flex items-center gap-2 ${
                    activeSeason === "live"
                      ? "bg-[#C16542] text-[#FDFBF7] border-[#C16542]"
                      : liveState === "ok"
                      ? "text-[#C16542] border-[#C16542]/40 hover:border-[#C16542]"
                      : "text-[#5C5248]/50 border-[#2C2621]/10 cursor-not-allowed"
                  }`}
                >
                  <Activity className={`w-3 h-3 ${liveState === "loading" ? "animate-pulse" : ""}`} strokeWidth={1.8} />
                  {t.climate_live}
                </button>
                {Object.keys(SEASON_LABELS).map((s) => {
                  const isActive = activeSeason === s;
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setActiveSeason(s)}
                      data-testid={`climate-season-${s}`}
                      className={`text-[10px] tracking-[0.3em] uppercase px-3 py-2 border transition-all duration-300 ${
                        isActive
                          ? "bg-[#2C2621] text-[#FDFBF7] border-[#2C2621]"
                          : "text-[#2C2621] border-[#2C2621]/20 hover:border-[#2C2621]"
                      }`}
                    >
                      {pick(SEASON_LABELS[s], lang)}
                    </button>
                  );
                })}
              </div>
              <p className="mt-3 text-[10px] tracking-[0.25em] uppercase text-[#5C5248]">
                {showingLive
                  ? `${currentMonthName} · ${t.climate_live_subtitle}`
                  : pick(SEASON_LABELS[activeSeason].months, lang)}
              </p>
              {liveState === "loading" && (
                <p className="mt-2 text-[11px] text-[#5C5248] italic">{t.climate_live_loading}</p>
              )}
              {liveState === "error" && (
                <p className="mt-2 text-[11px] text-[#C16542]/80 italic">{t.climate_live_error}</p>
              )}
            </div>

            <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { id: "atlas",  label: t.climate_atlas,  data: climateData.atlas,  color: "#5A6B4F" },
                { id: "sahara", label: t.climate_sahara, data: climateData.sahara, color: "#D97742" },
              ].map((z) => (
                <div key={z.id} data-testid={`climate-zone-${z.id}`}
                     className="border border-[#2C2621]/10 p-5 md:p-6 bg-[#FDFBF7] relative">
                  {showingLive && (
                    <span className="absolute top-3 right-3 inline-flex items-center gap-1.5 text-[9px] tracking-[0.3em] uppercase text-[#C16542]">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="absolute inline-flex h-full w-full rounded-full bg-[#C16542] opacity-60 animate-ping" />
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#C16542]" />
                      </span>
                      Live
                    </span>
                  )}
                  <div className="flex items-center gap-3">
                    <Thermometer className="w-4 h-4" style={{ color: z.color }} strokeWidth={1.7} />
                    <span className="font-serif-x text-[16px] md:text-[17px] text-[#2C2621]">{z.label}</span>
                  </div>
                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <div className="bg-[#F2EBE1] px-4 py-3">
                      <span className="text-[9px] tracking-[0.3em] uppercase text-[#5C5248]">{t.day_label}</span>
                      <p className="font-serif-x text-3xl md:text-4xl text-[#2C2621] mt-1 tabular-nums">
                        {z.data.day}<span className="text-base text-[#5C5248] ml-0.5">°C</span>
                      </p>
                    </div>
                    <div className="bg-[#2C2621] text-[#FDFBF7] px-4 py-3">
                      <span className="text-[9px] tracking-[0.3em] uppercase text-[#D4A373]">{t.night_label}</span>
                      <p className="font-serif-x text-3xl md:text-4xl mt-1 tabular-nums">
                        {z.data.night}<span className="text-base text-[#FDFBF7]/55 ml-0.5">°C</span>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Full-journey gallery — reuses Galería del lugar images in route order */}
        <RouteImageGallery days={days} t={t} />
      </div>
    </section>
  );
};

export default TripOverview;
