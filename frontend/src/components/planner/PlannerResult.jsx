import React, { useMemo, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  MapPin, Clock, Moon, Route as RouteIcon, Gauge, Check, ArrowRight, ArrowUpRight,
  Star, Plane, Sparkles, Lightbulb, AlertTriangle, Info, RotateCcw,
} from "lucide-react";
import { useLanguage, pick } from "@/contexts/LanguageContext";
import { pathFor } from "@/lib/routes";
import { optimizedSrc } from "@/lib/imageUrl";
import { priceRouteIds } from "@/lib/programNav";
import { tripImage } from "@/lib/planner/plannerTrips";
import FromPrice from "@/components/FromPrice";
import PlannerMiniMap from "@/components/planner/PlannerMiniMap";
import { PLANNER_COPY as C } from "@/lib/planner/plannerCopy";
import { DEST_BY_ID, AIRPORT_BY_ID, driveBetween } from "@/lib/planner/plannerData";
import { THEME_BY_ID } from "@/lib/planner/plannerData";
import { tripStats, tripRouteNodes, VIABILITY_META } from "@/lib/planner/plannerEngine";

const fill = (str, map) => str.replace(/\{(\w+)\}/g, (_, k) => (map[k] ?? ""));
const cityName = (id, lang) => pick(AIRPORT_BY_ID[id]?.name || DEST_BY_ID[id]?.name || { es: id, en: id, fr: id }, lang);

const TONE_ICON = { warn: AlertTriangle, tip: Lightbulb, info: Info };
const TONE_COLOR = { warn: "#C16542", tip: "#C9A227", info: "#5A7F9C" };

const Stat = ({ icon: Icon, label, value, testid }) => (
  <div className="flex flex-col" data-testid={testid}>
    <span className="inline-flex items-center gap-1.5 text-[10px] tracking-[0.22em] uppercase text-[#5C5248]">
      <Icon className="w-3 h-3" strokeWidth={1.8} /> {label}
    </span>
    <span className="font-serif-x text-xl md:text-2xl text-[#2C2621] mt-1">{value}</span>
  </div>
);

export default function PlannerResult({ input, recommendation, viability, warnings }) {
  const { lang } = useLanguage();
  const ref = useRef(null);
  const top = recommendation?.top;

  useEffect(() => {
    if (top && ref.current) ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [top]); // eslint-disable-line react-hooks/exhaustive-deps

  const v = viability;
  const meta = VIABILITY_META[v?.level] || VIABILITY_META.yellow;
  const explanation = useMemo(() => {
    if (!input.interests?.length) return pick(C.exp_none, lang);
    const tpl = pick(C[`exp_${v.level}`] || C.exp_yellow, lang);
    return fill(tpl, { days: input.days, min: v.minDays, h: v.driveH, km: (v.km || 0).toLocaleString() });
  }, [input, v, lang]);

  if (!top) return null;

  const trip = top.trip;
  const stats = tripStats(trip);
  const nodes = tripRouteNodes(trip);
  const stars = Math.max(3, Math.min(5, Math.round(top.score / 20)));
  const img = tripImage(trip.routeId);
  const others = recommendation.ranked.slice(1, 6);

  const matchedLabels = [
    top.matched.entry && pick(C.r_matched_labels.entry, lang),
    top.matched.exit && pick(C.r_matched_labels.exit, lang),
    top.matched.days && pick(C.r_matched_labels.days, lang),
    ...top.matched.destinations.map((id) => pick(DEST_BY_ID[id]?.name, lang)),
    ...top.matched.themes.map((id) => pick(THEME_BY_ID[id]?.label, lang)),
    top.matched.pace && pick(C.r_matched_labels.pace, lang),
  ].filter(Boolean);

  return (
    <section ref={ref} data-testid="planner-result" className="relative bg-[#F2EBE1] py-16 md:py-24 scroll-mt-24">
      <div className="absolute inset-0 berber-bg-diamond opacity-[0.12] pointer-events-none" aria-hidden="true" />
      <div className="relative max-w-6xl mx-auto px-5 md:px-10">

        {/* Viability banner */}
        <div data-testid="planner-viability"
          className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6 bg-[#FDFBF7] border border-[#2C2621]/12 rounded-sm p-5 md:p-7 shadow-sm">
          <div className="flex items-center gap-3 shrink-0">
            <span className="w-3.5 h-3.5 rounded-full ring-4 ring-offset-2 ring-offset-[#FDFBF7]" style={{ background: meta.dot, boxShadow: `0 0 0 1px ${meta.dot}` }} />
            <div>
              <span className="block text-[10px] tracking-[0.28em] uppercase text-[#5C5248]">{pick(C.r_viability, lang)}</span>
              <span className="font-serif-x text-2xl md:text-3xl text-[#2C2621]" style={{ color: meta.dot }} data-testid="planner-viability-label">
                {pick(meta.label, lang)}
              </span>
            </div>
          </div>
          <p className="text-[14px] md:text-[15px] leading-relaxed text-[#3A332C] md:border-l md:border-[#2C2621]/12 md:pl-6" data-testid="planner-viability-explain">
            {explanation}
          </p>
        </div>

        {/* Recommended trip */}
        <div className="mt-10 md:mt-14">
          <span className="overline inline-flex items-center gap-2 text-[#C16542]">
            <Sparkles className="w-3 h-3" strokeWidth={1.8} /> {pick(C.r_eyebrow, lang)}
          </span>

          <article data-testid="planner-top-trip" className="mt-5 bg-[#FDFBF7] border border-[#2C2621]/12 rounded-sm overflow-hidden shadow-sm">
            {/* Image header */}
            <div className="relative h-[230px] md:h-[300px] overflow-hidden">
              {img && <img src={optimizedSrc(img, 1200)} alt={pick(trip.name, lang)} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />}
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A1513]/85 via-[#1A1513]/25 to-transparent" />
              <div className="absolute top-4 right-4 flex items-center gap-2">
                <span data-testid="planner-top-score" className="inline-flex items-center gap-1.5 bg-[#FDFBF7] text-[#2C2621] text-[12px] font-semibold px-3 py-1.5 rounded-full shadow">
                  <span className="text-[#C16542]">{top.score}%</span> {pick(C.r_match, lang)}
                </span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-5 md:p-7">
                <div className="flex items-center gap-1 mb-2" aria-hidden="true">
                  {Array.from({ length: stars }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-[#E8B84B] text-[#E8B84B]" />
                  ))}
                </div>
                <h3 className="font-serif-x text-2xl md:text-3xl text-[#FDFBF7] leading-tight">{pick(trip.name, lang)}</h3>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-[#FDFBF7]/90">
                  <span className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur px-2.5 py-1 rounded-full">
                    <Plane className="w-3 h-3" /> {pick(C.arrive_in, lang)} {cityName(trip.entry, lang)}
                  </span>
                  <span className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur px-2.5 py-1 rounded-full">
                    <MapPin className="w-3 h-3" /> {trip.loop ? pick(C.loop_trip, lang) : `${pick(C.depart_from, lang)} ${cityName(trip.exit, lang)}`}
                  </span>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 px-5 md:px-7 py-5 border-b border-[#2C2621]/10">
              <Stat icon={Clock} label={pick(C.r_days, lang)} value={trip.days} testid="planner-stat-days" />
              <Stat icon={Moon} label={pick(C.r_nights, lang)} value={stats.nights} testid="planner-stat-nights" />
              <Stat icon={RouteIcon} label={pick(C.r_km, lang)} value={stats.km.toLocaleString()} testid="planner-stat-km" />
              <Stat icon={Clock} label={pick(C.r_drive, lang)} value={`${stats.driveH} ${pick(C.r_hours, lang)}`} testid="planner-stat-drive" />
              <Stat icon={Gauge} label={pick(C.r_intensity, lang)} value={pick(C.pace[stats.intensity]?.label || { es: stats.intensity, en: stats.intensity, fr: stats.intensity }, lang)} testid="planner-stat-intensity" />
            </div>

            {/* Map + timeline */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-5 md:p-7">
              <div>
                <PlannerMiniMap nodes={nodes} testid="planner-map" />
                {/* matched chips */}
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {matchedLabels.map((l, i) => (
                    <span key={i} className="inline-flex items-center gap-1 text-[11px] text-[#2E7D52] bg-[#2E7D52]/10 px-2.5 py-1 rounded-full">
                      <Check className="w-3 h-3" strokeWidth={2.4} /> {l}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="block text-[10px] tracking-[0.28em] uppercase text-[#5C5248] mb-4">{pick(C.r_timeline, lang)}</span>
                <ol className="relative" data-testid="planner-timeline">
                  {trip.stops.map((id, i) => {
                    const leg = i > 0 ? driveBetween(trip.stops[i - 1], id) : null;
                    const d = DEST_BY_ID[id];
                    return (
                      <li key={`${id}-${i}`} className="relative pl-7 pb-5 last:pb-0">
                        <span className="absolute left-0 top-1 w-3.5 h-3.5 rounded-full border-2 border-[#C16542] bg-[#FDFBF7]" />
                        {i < trip.stops.length - 1 && <span className="absolute left-[6px] top-5 bottom-0 w-px bg-[#2C2621]/15" />}
                        {leg && (
                          <span className="block text-[11px] text-[#8A7E70] mb-1">
                            ↓ {leg.h} h · {leg.km} km
                          </span>
                        )}
                        <span className="block font-serif-x text-[15px] text-[#2C2621]">{pick(d?.name, lang)}</span>
                      </li>
                    );
                  })}
                </ol>
              </div>
            </div>

            {/* Included / excluded */}
            <div className="px-5 md:px-7 pb-2">
              {input.interests?.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 py-4 border-t border-[#2C2621]/10">
                  <div data-testid="planner-included">
                    <span className="block text-[10px] tracking-[0.24em] uppercase text-[#5C5248] mb-2.5">{pick(C.r_included, lang)}</span>
                    <div className="flex flex-wrap gap-1.5">
                      {top.matched.destinations.length === 0 && <span className="text-[12px] text-[#8A7E70]">—</span>}
                      {top.matched.destinations.map((id) => (
                        <span key={id} className="inline-flex items-center gap-1 text-[12px] text-[#2C2621] bg-[#C16542]/12 px-2.5 py-1 rounded-full">
                          <MapPin className="w-3 h-3 text-[#C16542]" /> {pick(DEST_BY_ID[id]?.name, lang)}
                        </span>
                      ))}
                    </div>
                  </div>
                  {top.missing.length > 0 && (
                    <div data-testid="planner-excluded">
                      <span className="block text-[10px] tracking-[0.24em] uppercase text-[#5C5248] mb-2.5">{pick(C.r_excluded, lang)}</span>
                      <div className="flex flex-wrap gap-1.5">
                        {top.missing.map((id) => (
                          <span key={id} className="inline-flex items-center gap-1 text-[12px] text-[#8A7E70] bg-[#2C2621]/6 px-2.5 py-1 rounded-full line-through decoration-[#8A7E70]/50">
                            {pick(DEST_BY_ID[id]?.name, lang)}
                          </span>
                        ))}
                      </div>
                      <span className="block text-[11px] text-[#8A7E70] mt-2 italic">{pick(C.r_excluded_hint, lang)}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* CTA row */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 px-5 md:px-7 py-5 border-t border-[#2C2621]/10 bg-[#FBF5EA]">
              <FromPrice tone="dark" size="md" routeId={trip.routeId} routeIds={priceRouteIds(trip.routeId)} testid="planner-top-from" />
              <div className="flex flex-col sm:flex-row gap-3 sm:ml-auto w-full sm:w-auto">
                <Link
                  to={`${pathFor(lang, "planTrip")}?trip=${trip.routeId}`}
                  data-testid="planner-cta-request"
                  className="inline-flex items-center justify-center gap-2 bg-[#C16542] hover:bg-[#A8523180] text-[#FDFBF7] text-[12px] tracking-[0.18em] uppercase font-semibold px-6 py-3.5 rounded-full transition-colors duration-300"
                >
                  {pick(C.cta_request, lang)} <ArrowRight className="w-3.5 h-3.5" strokeWidth={2} />
                </Link>
                <Link
                  to={pathFor(lang, trip.routeId)}
                  data-testid="planner-cta-view"
                  className="inline-flex items-center justify-center gap-2 border border-[#2C2621]/25 hover:border-[#C16542] text-[#2C2621] text-[12px] tracking-[0.18em] uppercase font-semibold px-6 py-3.5 rounded-full transition-colors duration-300"
                >
                  {pick(C.cta_view, lang)} <ArrowUpRight className="w-3.5 h-3.5" strokeWidth={2} />
                </Link>
              </div>
            </div>
          </article>
        </div>

        {/* Advisor notices */}
        {warnings.length > 0 && (
          <div className="mt-10" data-testid="planner-advisor">
            <span className="overline inline-flex items-center gap-2 text-[#C16542]">
              <Lightbulb className="w-3 h-3" strokeWidth={1.8} /> {pick(C.r_advisor, lang)}
            </span>
            <ul className="mt-4 space-y-3">
              {warnings.map((w) => {
                const Icon = TONE_ICON[w.tone] || Info;
                return (
                  <li key={w.id} data-testid={`planner-warning-${w.id}`}
                    className="flex items-start gap-3 bg-[#FDFBF7] border border-[#2C2621]/10 rounded-sm px-4 py-3.5">
                    <Icon className="w-4 h-4 mt-0.5 shrink-0" style={{ color: TONE_COLOR[w.tone] || "#5A7F9C" }} strokeWidth={1.9} />
                    <span className="text-[13px] md:text-[14px] text-[#3A332C] leading-relaxed">{pick(w.text, lang)}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {/* Compatible trips */}
        {others.length > 0 && (
          <div className="mt-12" data-testid="planner-compatible">
            <span className="overline inline-flex items-center gap-2 text-[#C16542]">
              <RouteIcon className="w-3 h-3" strokeWidth={1.8} /> {pick(C.r_compatible, lang)}
            </span>
            <ul className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-3">
              {others.map(({ trip: t, score }) => {
                const tStars = Math.max(3, Math.min(5, Math.round(score / 20)));
                return (
                  <li key={t.routeId}>
                    <Link to={pathFor(lang, t.routeId)} data-testid={`planner-compat-${t.routeId}`}
                      className="group flex items-center gap-4 bg-[#FDFBF7] border border-[#2C2621]/12 rounded-sm p-4 hover:border-[#C16542] transition-colors duration-300">
                      <div className="flex flex-col min-w-0 flex-1">
                        <div className="flex items-center gap-1 mb-1" aria-hidden="true">
                          {Array.from({ length: tStars }).map((_, i) => <Star key={i} className="w-3 h-3 fill-[#E8B84B] text-[#E8B84B]" />)}
                        </div>
                        <span className="font-serif-x text-[15px] text-[#2C2621] leading-snug truncate group-hover:text-[#C16542] transition-colors">{pick(t.name, lang)}</span>
                        <span className="text-[12px] text-[#5C5248] mt-0.5">{t.days} {pick(C.r_days, lang).toLowerCase()}</span>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="block font-serif-x text-2xl text-[#C16542] leading-none">{score}%</span>
                        <span className="text-[10px] tracking-[0.16em] uppercase text-[#5C5248]">{pick(C.r_match, lang)}</span>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-[#8A7E70] group-hover:text-[#C16542] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" strokeWidth={1.8} />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
