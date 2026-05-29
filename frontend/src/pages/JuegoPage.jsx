import React, { useEffect, useMemo, useRef, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Tooltip } from "react-leaflet";
import {
  Map as MapIcon, Building2, Castle, Sun, Mountain, Waves, Landmark, Camera,
  Sparkles, Footprints, Compass, Tent, Flag, Trophy, Check, RotateCcw,
  MapPin, TrendingUp, CheckCircle2, Award, X,
} from "lucide-react";
import { useLanguage, pick } from "@/contexts/LanguageContext";
import {
  PLACES, CATEGORIES, TOTAL_PLACES, LEVELS, REGION_ORDER, REGION_LABELS,
  resolveLevel,
} from "@/lib/juegoData";
import ContactForm from "@/components/ContactForm";

const ICONS = {
  Map: MapIcon, Building2, Castle, Sun, Mountain, Waves, Landmark, Camera,
  Sparkles, Footprints, Compass, Tent, Flag, Trophy,
};

const STORAGE_KEY = "xaluca_juego_visited_v1";

const COPY = {
  es: {
    eyebrow: "El juego de Marruecos",
    title: "¿Cuánto de Marruecos has descubierto?",
    subtitle: "Marca los lugares que has visitado o conoces, sube de nivel y desbloquea tu insignia de viajero. Tu progreso se guarda en este dispositivo.",
    explore: "Exploración total",
    visited: "Lugares visitados",
    regionsDone: "Regiones completadas",
    badge: "Insignia actual",
    nextLevel: "Próximo nivel",
    rank: "Tu rango de viajero",
    toGo: "para desbloquear",
    mapTitle: "Tu mapa de Marruecos",
    mapHelp: "Pulsa un punto del mapa para marcarlo como visitado.",
    progress: "Progreso por categoría",
    reset: "Reiniciar progreso",
    resetConfirm: "¿Seguro que quieres borrar todo tu progreso?",
    of: "de",
    unlocked: "¡Nivel desbloqueado!",
    maxed: "¡Has alcanzado el nivel máximo!",
    selectHint: "Marcado",
  },
  en: {
    eyebrow: "The Morocco game",
    title: "How much of Morocco have you discovered?",
    subtitle: "Tick off the places you've visited or know, level up and unlock your traveller badge. Your progress is saved on this device.",
    explore: "Total exploration",
    visited: "Places visited",
    regionsDone: "Regions completed",
    badge: "Current badge",
    nextLevel: "Next level",
    rank: "Your traveller rank",
    toGo: "to unlock",
    mapTitle: "Your map of Morocco",
    mapHelp: "Tap a point on the map to mark it as visited.",
    progress: "Progress by category",
    reset: "Reset progress",
    resetConfirm: "Are you sure you want to erase all your progress?",
    of: "of",
    unlocked: "Level unlocked!",
    maxed: "You've reached the top level!",
    selectHint: "Marked",
  },
  fr: {
    eyebrow: "Le jeu du Maroc",
    title: "Quelle part du Maroc avez-vous découverte ?",
    subtitle: "Cochez les lieux que vous avez visités ou connaissez, montez de niveau et débloquez votre badge de voyageur. Votre progression est enregistrée sur cet appareil.",
    explore: "Exploration totale",
    visited: "Lieux visités",
    regionsDone: "Régions complétées",
    badge: "Badge actuel",
    nextLevel: "Niveau suivant",
    rank: "Votre rang de voyageur",
    toGo: "pour débloquer",
    mapTitle: "Votre carte du Maroc",
    mapHelp: "Touchez un point de la carte pour le marquer comme visité.",
    progress: "Progression par catégorie",
    reset: "Réinitialiser",
    resetConfirm: "Voulez-vous vraiment effacer toute votre progression ?",
    of: "sur",
    unlocked: "Niveau débloqué !",
    maxed: "Vous avez atteint le niveau maximum !",
    selectHint: "Coché",
  },
};

/* ---- localStorage-backed set of visited ids ---- */
const useVisited = () => {
  const [visited, setVisited] = useState(() => {
    try {
      return new Set(JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"));
    } catch {
      return new Set();
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...visited]));
    } catch {
      /* ignore quota errors */
    }
  }, [visited]);
  const toggle = (id) =>
    setVisited((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  const reset = () => setVisited(new Set());
  return { visited, toggle, reset };
};

/* ---- Small reusable stat card ---- */
const StatCard = ({ icon: Icon, label, value, accent, testid }) => (
  <div
    data-testid={testid}
    className="bg-[#FDFBF7] border border-[#2C2621]/12 rounded-2xl p-5 md:p-6 flex flex-col gap-2"
    style={{ borderTop: `3px solid ${accent}` }}
  >
    <span className="inline-flex items-center gap-2 text-[10px] tracking-[0.25em] uppercase text-[#5C5248]">
      <Icon className="w-3.5 h-3.5" strokeWidth={1.8} style={{ color: accent }} />
      {label}
    </span>
    <span className="font-serif-x text-3xl md:text-[34px] leading-none text-[#2C2621]">{value}</span>
  </div>
);

export default function JuegoPage() {
  const { lang } = useLanguage();
  const t = COPY[lang] || COPY.es;
  const { visited, toggle, reset } = useVisited();
  const [celebrate, setCelebrate] = useState(null);
  const prevLevelIdx = useRef(null);

  useEffect(() => {
    document.title = `${t.eyebrow} · Xaluca Tours`;
    window.scrollTo(0, 0);
  }, [t.eyebrow]);

  const visitedCount = visited.size;
  const pct = TOTAL_PLACES > 0 ? Math.round((visitedCount / TOTAL_PLACES) * 100) : 0;

  const regionsCompleted = useMemo(() => {
    let done = 0;
    for (const r of REGION_ORDER) {
      const items = PLACES.filter((p) => p.region === r);
      if (items.length > 0 && items.every((p) => visited.has(p.id))) done += 1;
    }
    return done;
  }, [visited]);

  const perCategory = useMemo(
    () =>
      CATEGORIES.map((c) => {
        const items = PLACES.filter((p) => p.cat === c.id);
        const done = items.filter((p) => visited.has(p.id)).length;
        return { ...c, total: items.length, done };
      }),
    [visited]
  );

  const { index: levelIdx, current, next } = resolveLevel(pct);
  const toNext = next ? Math.max(0, next.min - pct) : 0;
  const nextProgress = next ? Math.min(100, Math.round(((pct - current.min) / (next.min - current.min)) * 100)) : 100;

  /* Celebrate when the achieved level increases (skip the first mount). */
  useEffect(() => {
    if (prevLevelIdx.current === null) {
      prevLevelIdx.current = levelIdx;
      return;
    }
    if (levelIdx > prevLevelIdx.current) {
      setCelebrate(current);
      const id = setTimeout(() => setCelebrate(null), 4500);
      prevLevelIdx.current = levelIdx;
      return () => clearTimeout(id);
    }
    prevLevelIdx.current = levelIdx;
  }, [levelIdx, current]);

  const mapPlaces = PLACES.filter((p) => Array.isArray(p.coords));
  const CurrentBadgeIcon = ICONS[current.icon] || Trophy;

  return (
    <div data-testid="juego-page" className="bg-[#F2EBE1] min-h-screen">
      {/* ===== Hero ===== */}
      <section className="relative bg-[#1A1513] text-[#FDFBF7] pt-32 md:pt-44 pb-16 md:pb-20 overflow-hidden">
        <div className="absolute inset-0 berber-bg-cross opacity-40 pointer-events-none" aria-hidden="true" />
        <span className="film-grain pointer-events-none" />
        <div className="relative max-w-5xl mx-auto px-6 md:px-12 text-center">
          <span className="overline inline-flex items-center gap-2 text-[#E8C5A3]">
            <Compass className="w-3.5 h-3.5" strokeWidth={1.8} />
            {t.eyebrow}
          </span>
          <h1 className="font-serif-x text-4xl sm:text-5xl lg:text-6xl leading-[1.05] tracking-tight mt-5">
            {t.title}
          </h1>
          <p className="mt-6 text-base md:text-lg text-[#FDFBF7]/75 leading-relaxed max-w-2xl mx-auto">
            {t.subtitle}
          </p>

          {/* Big exploration ring */}
          <div className="mt-10 inline-flex flex-col items-center" data-testid="juego-explore-ring">
            <div className="relative w-40 h-40 md:w-48 md:h-48">
              <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                <circle cx="60" cy="60" r="52" fill="none" stroke="#FDFBF7" strokeOpacity="0.12" strokeWidth="10" />
                <circle
                  cx="60" cy="60" r="52" fill="none" stroke="#C16542" strokeWidth="10" strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 52}
                  strokeDashoffset={2 * Math.PI * 52 * (1 - pct / 100)}
                  style={{ transition: "stroke-dashoffset 0.8s ease" }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-serif-x text-4xl md:text-5xl text-[#FDFBF7]" data-testid="juego-explore-pct">{pct}%</span>
                <span className="text-[10px] tracking-[0.25em] uppercase text-[#FDFBF7]/60 mt-1">{t.explore}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Stats dashboard ===== */}
      <section className="relative -mt-10 md:-mt-12 z-10">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            <StatCard icon={TrendingUp} label={t.explore} value={`${pct}%`} accent="#C16542" testid="juego-stat-explore" />
            <StatCard icon={MapPin} label={t.visited} value={`${visitedCount}/${TOTAL_PLACES}`} accent="#5A7F9C" testid="juego-stat-visited" />
            <StatCard icon={CheckCircle2} label={t.regionsDone} value={`${regionsCompleted}/${REGION_ORDER.length}`} accent="#5A6B4F" testid="juego-stat-regions" />
            <StatCard icon={Award} label={t.badge} value={<span className="text-lg md:text-xl">{pick(current.name, lang)}</span>} accent={current.color} testid="juego-stat-badge" />
          </div>
        </div>
      </section>

      {/* ===== Visual rank / level stepper ===== */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="bg-[#FDFBF7] border border-[#2C2621]/12 rounded-3xl p-7 md:p-10" data-testid="juego-rank">
            <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
              <div>
                <span className="overline text-[#C16542]">{t.rank}</span>
                <h2 className="font-serif-x text-2xl md:text-3xl text-[#2C2621] mt-2">{pick(current.name, lang)}</h2>
                <p className="text-sm text-[#5C5248] mt-2 max-w-xl">{pick(current.blurb, lang)}</p>
              </div>
              <div className="text-right">
                {next ? (
                  <>
                    <span className="text-[10px] tracking-[0.25em] uppercase text-[#5C5248]">{t.nextLevel}</span>
                    <p className="font-serif-x text-lg text-[#2C2621]" data-testid="juego-next-level">{pick(next.name, lang)}</p>
                    <p className="text-xs text-[#C16542] mt-1">+{toNext}% {t.toGo}</p>
                  </>
                ) : (
                  <p className="text-sm text-[#B8860B] font-semibold" data-testid="juego-next-level">{t.maxed}</p>
                )}
              </div>
            </div>

            {/* Progress bar to next level */}
            <div className="h-2.5 w-full rounded-full bg-[#2C2621]/10 overflow-hidden mb-8">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${nextProgress}%`, background: current.color }}
              />
            </div>

            {/* Level steps */}
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {LEVELS.map((lv, i) => {
                const LvIcon = ICONS[lv.icon] || Trophy;
                const reached = i <= levelIdx;
                const isCurrent = i === levelIdx;
                return (
                  <div
                    key={lv.id}
                    data-testid={`juego-level-${lv.id}`}
                    className={`flex flex-col items-center text-center gap-2 p-3 rounded-2xl border transition-all duration-300 ${
                      isCurrent ? "scale-[1.03]" : ""
                    } ${reached ? "" : "opacity-45"}`}
                    style={{
                      borderColor: reached ? `${lv.color}55` : "rgba(44,38,33,0.12)",
                      background: isCurrent ? `${lv.color}14` : "transparent",
                    }}
                  >
                    <span
                      className="inline-flex items-center justify-center w-11 h-11 rounded-full border"
                      style={{
                        borderColor: reached ? lv.color : "rgba(44,38,33,0.25)",
                        background: reached ? lv.color : "transparent",
                        color: reached ? "#FDFBF7" : "#8C7B6B",
                      }}
                    >
                      <LvIcon className="w-5 h-5" strokeWidth={1.6} />
                    </span>
                    <span className="text-[10px] leading-tight tracking-wide text-[#2C2621] font-medium">
                      {pick(lv.name, lang)}
                    </span>
                    <span className="text-[9px] tracking-[0.15em] uppercase text-[#5C5248]">{lv.min}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ===== Interactive map ===== */}
      <section className="pb-12 md:pb-16">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="mb-6 text-center">
            <span className="overline inline-flex items-center gap-2 text-[#C16542]">
              <MapIcon className="w-3.5 h-3.5" strokeWidth={1.8} />
              {t.mapTitle}
            </span>
            <p className="mt-2 text-sm text-[#5C5248]">{t.mapHelp}</p>
          </div>
          <div
            data-testid="juego-map"
            className="relative border border-[#2C2621]/15 rounded-2xl overflow-hidden bg-[#EDE5D5]"
            style={{ minHeight: "480px" }}
          >
            <MapContainer
              center={[31.5, -6.5]}
              zoom={5}
              scrollWheelZoom={false}
              style={{ height: "520px", width: "100%", background: "#EDE5D5" }}
              attributionControl={false}
            >
              <TileLayer url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png" subdomains="abcd" />
              <TileLayer url="https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png" subdomains="abcd" />
              {mapPlaces.map((p) => {
                const isOn = visited.has(p.id);
                return (
                  <CircleMarker
                    key={p.id}
                    center={p.coords}
                    radius={isOn ? 9 : 6}
                    pathOptions={{
                      color: isOn ? "#FDFBF7" : "#A0432B",
                      weight: isOn ? 2.5 : 1.5,
                      fillColor: isOn ? "#C16542" : "#FDFBF7",
                      fillOpacity: isOn ? 0.95 : 0.55,
                    }}
                    eventHandlers={{ click: () => toggle(p.id) }}
                  >
                    <Tooltip direction="top" offset={[0, -6]} opacity={1}>
                      <span className="font-serif-x text-[13px]">
                        {isOn ? "✓ " : ""}{pick(p.name, lang)}
                      </span>
                    </Tooltip>
                  </CircleMarker>
                );
              })}
            </MapContainer>
          </div>
        </div>
      </section>

      {/* ===== Category selection ===== */}
      <section className="pb-12 md:pb-16">
        <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-8">
          {perCategory.map((c) => {
            const CatIcon = ICONS[c.icon] || Sparkles;
            const items = PLACES.filter((p) => p.cat === c.id);
            const catPct = c.total ? Math.round((c.done / c.total) * 100) : 0;
            return (
              <div
                key={c.id}
                data-testid={`juego-category-${c.id}`}
                className="bg-[#FDFBF7] border border-[#2C2621]/12 rounded-3xl p-6 md:p-8"
              >
                <div className="flex items-center justify-between gap-4 mb-5">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-[#C16542]/12 text-[#C16542]">
                      <CatIcon className="w-5 h-5" strokeWidth={1.7} />
                    </span>
                    <div>
                      <h3 className="font-serif-x text-xl md:text-2xl text-[#2C2621] leading-tight">{pick(c.name, lang)}</h3>
                      <span className="text-xs text-[#5C5248]">{c.done} {t.of} {c.total}</span>
                    </div>
                  </div>
                  <div className="hidden sm:flex items-center gap-3 w-40">
                    <div className="flex-1 h-1.5 rounded-full bg-[#2C2621]/10 overflow-hidden">
                      <div className="h-full rounded-full bg-[#C16542] transition-all duration-500" style={{ width: `${catPct}%` }} />
                    </div>
                    <span className="text-xs font-semibold text-[#C16542] w-9 text-right">{catPct}%</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2.5">
                  {items.map((p) => {
                    const isOn = visited.has(p.id);
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => toggle(p.id)}
                        aria-pressed={isOn}
                        data-testid={`juego-item-${p.id}`}
                        className={`group inline-flex items-center gap-2 pl-2.5 pr-3.5 py-2 rounded-full border text-sm transition-all duration-300 ${
                          isOn
                            ? "bg-[#C16542] border-[#C16542] text-[#FDFBF7] shadow-[0_8px_20px_-10px_rgba(193,101,66,0.8)]"
                            : "bg-[#FDFBF7] border-[#2C2621]/20 text-[#2C2621] hover:border-[#C16542]/60"
                        }`}
                      >
                        <span
                          className={`inline-flex items-center justify-center w-5 h-5 rounded-full border transition-colors ${
                            isOn ? "bg-[#FDFBF7] border-[#FDFBF7]" : "border-[#2C2621]/30 group-hover:border-[#C16542]"
                          }`}
                        >
                          {isOn && <Check className="w-3.5 h-3.5 text-[#C16542]" strokeWidth={3} />}
                        </span>
                        {pick(p.name, lang)}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Reset */}
          <div className="text-center pt-2">
            <button
              type="button"
              data-testid="juego-reset"
              onClick={() => {
                if (window.confirm(t.resetConfirm)) reset();
              }}
              className="inline-flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase text-[#5C5248] hover:text-[#A0432B] border border-[#2C2621]/20 hover:border-[#A0432B]/50 rounded-full px-5 py-2.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" strokeWidth={1.8} />
              {t.reset}
            </button>
          </div>
        </div>
      </section>

      <ContactForm />

      {/* ===== Level-up celebration banner ===== */}
      {celebrate && (
        <div
          data-testid="juego-celebrate"
          className="fixed inset-x-0 bottom-6 z-[120] flex justify-center px-4 pointer-events-none"
        >
          <div
            className="pointer-events-auto flex items-center gap-4 bg-[#1A1513] text-[#FDFBF7] rounded-2xl pl-4 pr-3 py-3.5 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.6)] border"
            style={{ borderColor: `${celebrate.color}99` }}
          >
            <span
              className="inline-flex items-center justify-center w-12 h-12 rounded-full shrink-0"
              style={{ background: celebrate.color }}
            >
              {React.createElement(ICONS[celebrate.icon] || Trophy, { className: "w-6 h-6 text-[#FDFBF7]", strokeWidth: 1.7 })}
            </span>
            <div className="pr-2">
              <p className="text-[10px] tracking-[0.25em] uppercase text-[#E8C5A3]">{t.unlocked}</p>
              <p className="font-serif-x text-lg leading-tight">{pick(celebrate.name, lang)}</p>
            </div>
            <button
              type="button"
              onClick={() => setCelebrate(null)}
              aria-label="close"
              className="inline-flex items-center justify-center w-8 h-8 rounded-full hover:bg-[#FDFBF7]/10 transition-colors"
            >
              <X className="w-4 h-4" strokeWidth={1.8} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
