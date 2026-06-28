import React, { useMemo, useState, useCallback } from "react";
import {
  Plane, MapPin, ArrowRight, ArrowLeft, Check, Sparkles, RotateCcw, Wand2,
  Sun, Landmark, BookOpen, Leaf, Mountain, MountainSnow, Castle, Palmtree,
  Waves, Camera, UtensilsCrossed, Compass, Footprints, Flower, Gem, Users,
  Building2, Store, Calendar, Gauge,
} from "lucide-react";
import { useLanguage, pick } from "@/contexts/LanguageContext";
import HeroMonogram from "@/components/HeroMonogram";
import PlannerResult from "@/components/planner/PlannerResult";
import { PLANNER_COPY as C } from "@/lib/planner/plannerCopy";
import { AIRPORTS, DESTINATIONS, THEMES } from "@/lib/planner/plannerData";
import { recommend, viability, buildWarnings } from "@/lib/planner/plannerEngine";

const THEME_ICONS = {
  Sun, Landmark, BookOpen, Leaf, Mountain, MountainSnow, Castle, Palmtree,
  Waves, Camera, UtensilsCrossed, Compass, Footprints, Flower, Gem, Users,
};
const TYPE_ICON = { city: Building2, desert: Sun, kasbah: Castle, gorge: Mountain, unesco: Landmark, market: Store, lake: Waves };
const REGION_ACCENT = { centro: "#C16542", norte: "#5A7F9C", costa: "#3E7C8C", atlas: "#6E8B4E", sur: "#A07042", desierto: "#D97742" };
const DAY_OPTIONS = [3, 4, 5, 6, 7, 8, 9, 10, 12, 14, 15];
const SELECTABLE = DESTINATIONS.filter((d) => d.select);
const PACE_KEYS = ["muy-relajado", "relajado", "equilibrado", "intenso"];

const initialInput = { entry: "", tripType: "linear", exit: "", days: 8, interests: [], themes: [], pace: "equilibrado" };

export default function PlannerPage() {
  const { lang } = useLanguage();
  const [step, setStep] = useState(0);
  const [input, setInput] = useState(initialInput);
  const [custom, setCustom] = useState(false);
  const [result, setResult] = useState(null);

  const set = (patch) => setInput((p) => ({ ...p, ...patch }));
  const toggle = (key, id) => setInput((p) => ({
    ...p, [key]: p[key].includes(id) ? p[key].filter((x) => x !== id) : [...p[key], id],
  }));

  const valid = useMemo(() => [
    !!input.entry,
    input.tripType === "same" ? !!input.entry : !!input.exit,
    !!input.days && input.days >= 2,
    input.interests.length >= 1,
    true,
    !!input.pace,
  ], [input]);

  const build = useCallback(() => {
    const payload = { ...input, exit: input.tripType === "same" ? input.entry : input.exit };
    const rec = recommend(payload);
    setResult({ recommendation: rec, viability: viability(payload), warnings: buildWarnings(payload, rec), input: payload });
  }, [input]);

  const reset = () => { setInput(initialInput); setCustom(false); setResult(null); setStep(0); window.scrollTo({ top: 0, behavior: "smooth" }); };

  const goNext = () => { if (step < 5) setStep(step + 1); else build(); };

  const cityGrid = (selectedId, onPick, testidPrefix) => (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      {AIRPORTS.map((a) => {
        const active = selectedId === a.id;
        return (
          <button key={a.id} type="button" onClick={() => onPick(a.id)} data-testid={`${testidPrefix}-${a.id}`}
            className={`group flex items-center gap-3 px-4 py-3.5 rounded-sm border text-left transition-all duration-300 ${active ? "border-[#C16542] bg-[#C16542]/8 shadow-sm" : "border-[#2C2621]/15 bg-[#FDFBF7] hover:border-[#C16542]/50"}`}>
            <Plane className={`w-4 h-4 shrink-0 transition-colors ${active ? "text-[#C16542]" : "text-[#8A7E70]"}`} strokeWidth={1.8} />
            <span className={`text-[14px] font-medium ${active ? "text-[#2C2621]" : "text-[#3A332C]"}`}>{pick(a.name, lang)}</span>
            {active && <Check className="w-4 h-4 ml-auto text-[#C16542]" strokeWidth={2.4} />}
          </button>
        );
      })}
    </div>
  );

  const STEPS = [
    // 1 · arrival
    <div key="s0">{cityGrid(input.entry, (id) => set({ entry: id }), "planner-entry")}</div>,
    // 2 · departure
    <div key="s1" className="space-y-6">
      <div className="inline-flex rounded-full border border-[#2C2621]/15 p-1 bg-[#FDFBF7]">
        {[["same", C.same_city], ["linear", C.other_city]].map(([k, label]) => (
          <button key={k} type="button" onClick={() => set({ tripType: k, exit: k === "same" ? input.entry : input.exit })}
            data-testid={`planner-triptype-${k}`}
            className={`px-5 py-2 rounded-full text-[12px] tracking-[0.12em] uppercase font-semibold transition-all duration-300 ${input.tripType === k ? "bg-[#C16542] text-[#FDFBF7]" : "text-[#5C5248] hover:text-[#2C2621]"}`}>
            {pick(label, lang)}
          </button>
        ))}
      </div>
      {input.tripType === "linear" && cityGrid(input.exit, (id) => set({ exit: id }), "planner-exit")}
      {input.tripType === "same" && input.entry && (
        <p className="text-[14px] text-[#5C5248] inline-flex items-center gap-2">
          <MapPin className="w-4 h-4 text-[#C16542]" /> {pick(C.same_city, lang)}: <strong className="text-[#2C2621]">{pick(AIRPORTS.find((a) => a.id === input.entry)?.name || {}, lang)}</strong>
        </p>
      )}
    </div>,
    // 3 · days
    <div key="s2" className="space-y-5">
      <div className="flex flex-wrap gap-2.5">
        {DAY_OPTIONS.map((d) => {
          const active = !custom && input.days === d;
          return (
            <button key={d} type="button" onClick={() => { setCustom(false); set({ days: d }); }} data-testid={`planner-days-${d}`}
              className={`w-14 h-14 rounded-full border flex items-center justify-center font-serif-x text-lg transition-all duration-300 ${active ? "border-[#C16542] bg-[#C16542] text-[#FDFBF7] shadow-sm" : "border-[#2C2621]/15 bg-[#FDFBF7] text-[#2C2621] hover:border-[#C16542]/50"}`}>
              {d}{d === 15 ? "+" : ""}
            </button>
          );
        })}
        <button type="button" onClick={() => setCustom(true)} data-testid="planner-days-custom"
          className={`h-14 px-5 rounded-full border inline-flex items-center gap-2 text-[12px] tracking-[0.12em] uppercase font-semibold transition-all duration-300 ${custom ? "border-[#C16542] bg-[#C16542]/8 text-[#2C2621]" : "border-[#2C2621]/15 bg-[#FDFBF7] text-[#5C5248] hover:border-[#C16542]/50"}`}>
          <Calendar className="w-4 h-4" /> {pick(C.custom, lang)}
        </button>
      </div>
      {custom && (
        <div className="flex items-center gap-3">
          <input type="number" min={2} max={30} value={input.days} data-testid="planner-days-input"
            onChange={(e) => set({ days: Math.max(2, Math.min(30, Number(e.target.value) || 2)) })}
            className="w-28 px-4 py-3 rounded-sm border border-[#2C2621]/20 bg-[#FDFBF7] text-[#2C2621] font-serif-x text-xl focus:outline-none focus:border-[#C16542]" />
          <span className="text-[14px] text-[#5C5248]">{pick(C.days_unit, lang)}</span>
        </div>
      )}
    </div>,
    // 4 · destinations
    <div key="s3">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {SELECTABLE.map((d) => {
          const Icon = TYPE_ICON[d.type] || MapPin;
          const active = input.interests.includes(d.id);
          const accent = REGION_ACCENT[d.region] || "#C16542";
          return (
            <button key={d.id} type="button" onClick={() => toggle("interests", d.id)} data-testid={`planner-dest-${d.id}`}
              className={`group relative overflow-hidden flex flex-col items-start gap-2 p-4 rounded-sm border text-left transition-all duration-300 ${active ? "border-transparent text-[#FDFBF7] shadow-md" : "border-[#2C2621]/12 bg-[#FDFBF7] hover:-translate-y-0.5 hover:shadow-sm"}`}
              style={active ? { background: `linear-gradient(135deg, ${accent}, #1A1513)` } : {}}>
              <span className="inline-flex items-center justify-center w-9 h-9 rounded-full" style={{ background: active ? "rgba(255,255,255,0.18)" : `${accent}14` }}>
                <Icon className="w-4 h-4" style={{ color: active ? "#FDFBF7" : accent }} strokeWidth={1.8} />
              </span>
              <span className={`text-[13px] font-medium leading-snug ${active ? "text-[#FDFBF7]" : "text-[#2C2621]"}`}>{pick(d.name, lang)}</span>
              {active && <Check className="absolute top-3 right-3 w-4 h-4 text-[#FDFBF7]" strokeWidth={2.6} />}
            </button>
          );
        })}
      </div>
      <p className="mt-4 text-[12px] text-[#8A7E70]" data-testid="planner-dest-count">
        {input.interests.length} {pick(C.selected, lang)}
      </p>
    </div>,
    // 5 · themes
    <div key="s4" className="flex flex-wrap gap-2.5">
      {THEMES.map((t) => {
        const Icon = THEME_ICONS[t.icon] || Sparkles;
        const active = input.themes.includes(t.id);
        return (
          <button key={t.id} type="button" onClick={() => toggle("themes", t.id)} data-testid={`planner-theme-${t.id}`}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full border text-[13px] font-medium transition-all duration-300 ${active ? "border-[#C16542] bg-[#C16542] text-[#FDFBF7] shadow-sm" : "border-[#2C2621]/15 bg-[#FDFBF7] text-[#3A332C] hover:border-[#C16542]/50"}`}>
            <Icon className="w-4 h-4" strokeWidth={1.8} /> {pick(t.label, lang)}
          </button>
        );
      })}
    </div>,
    // 6 · pace
    <div key="s5" className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {PACE_KEYS.map((p) => {
        const active = input.pace === p;
        return (
          <button key={p} type="button" onClick={() => set({ pace: p })} data-testid={`planner-pace-${p}`}
            className={`flex items-start gap-3 p-4 rounded-sm border text-left transition-all duration-300 ${active ? "border-[#C16542] bg-[#C16542]/8 shadow-sm" : "border-[#2C2621]/15 bg-[#FDFBF7] hover:border-[#C16542]/50"}`}>
            <span className={`mt-0.5 w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center ${active ? "border-[#C16542]" : "border-[#8A7E70]"}`}>
              {active && <span className="w-2 h-2 rounded-full bg-[#C16542]" />}
            </span>
            <span>
              <span className="block font-serif-x text-[16px] text-[#2C2621]">{pick(C.pace[p].label, lang)}</span>
              <span className="block text-[12px] text-[#5C5248] mt-0.5 leading-snug">{pick(C.pace[p].desc, lang)}</span>
            </span>
          </button>
        );
      })}
    </div>,
  ];

  return (
    <main data-testid="planner-page" className="bg-[#FDFBF7]">
      {/* Hero */}
      <section className="relative min-h-[58svh] w-full overflow-hidden bg-[#1A1513] text-[#FDFBF7]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,#3a2a20,transparent_60%),radial-gradient(circle_at_80%_80%,#2a3530,transparent_55%)]" />
        <div className="absolute inset-0 berber-bg-diamond opacity-[0.10]" aria-hidden="true" />
        <HeroMonogram />
        <div className="relative z-10 min-h-[58svh] max-w-6xl mx-auto px-5 md:px-10 flex flex-col justify-end pt-28 pb-14 md:pb-20">
          <span className="overline inline-flex items-center gap-2 text-[#E0A85C]">
            <Wand2 className="w-3.5 h-3.5" strokeWidth={1.8} /> {pick(C.eyebrow, lang)}
          </span>
          <h1 className="font-serif-x text-4xl sm:text-5xl lg:text-6xl leading-[1.04] tracking-tight mt-5 max-w-3xl">{pick(C.title, lang)}</h1>
          <p className="text-base md:text-lg text-[#FDFBF7]/80 leading-relaxed mt-5 max-w-2xl">{pick(C.subtitle, lang)}</p>
        </div>
      </section>

      {/* Wizard */}
      <section className="relative py-12 md:py-20">
        <div className="max-w-3xl mx-auto px-5 md:px-8">
          <div className="bg-[#FDFBF7] border border-[#2C2621]/12 rounded-md shadow-[0_20px_60px_-30px_rgba(26,21,19,0.4)] overflow-hidden">
            {/* Progress */}
            <div className="px-5 md:px-8 pt-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] tracking-[0.24em] uppercase text-[#5C5248]">
                  {pick(C.step, lang)} {step + 1} {pick(C.of, lang)} 6 · <span className="text-[#C16542]">{pick(C.step_labels[step], lang)}</span>
                </span>
                <div className="hidden sm:flex items-center gap-1.5">
                  {C.step_labels.map((_, i) => (
                    <button key={i} type="button" disabled={i > step && !valid.slice(0, i).every(Boolean)}
                      onClick={() => i <= step && setStep(i)} data-testid={`planner-stepdot-${i}`}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${i === step ? "w-6 bg-[#C16542]" : i < step ? "bg-[#C16542]/50" : "bg-[#2C2621]/15"}`} />
                  ))}
                </div>
              </div>
              <div className="h-1 bg-[#2C2621]/10 rounded-full overflow-hidden">
                <div className="h-full bg-[#C16542] transition-all duration-500" style={{ width: `${((step + 1) / 6) * 100}%` }} />
              </div>
            </div>

            {/* Step content */}
            <div className="px-5 md:px-8 py-7" key={step}>
              <h2 className="font-serif-x text-2xl md:text-[28px] text-[#2C2621] leading-tight">{pick(C[`s${step + 1}_title`], lang)}</h2>
              <p className="text-[14px] text-[#5C5248] mt-2 mb-6">{pick(C[`s${step + 1}_help`], lang)}</p>
              <div className="animate-[fadeIn_.4s_ease]">{STEPS[step]}</div>
              {!valid[step] && step === 3 && (
                <p className="mt-4 text-[12px] text-[#C16542]" data-testid="planner-validation">{pick(C.pick_dest, lang)}</p>
              )}
            </div>

            {/* Nav */}
            <div className="flex items-center justify-between gap-4 px-5 md:px-8 py-5 border-t border-[#2C2621]/10 bg-[#FBF5EA]">
              <button type="button" onClick={() => (step === 0 ? reset() : setStep(step - 1))} data-testid="planner-back"
                className="inline-flex items-center gap-2 text-[12px] tracking-[0.16em] uppercase font-semibold text-[#5C5248] hover:text-[#2C2621] transition-colors">
                {step === 0 ? <RotateCcw className="w-3.5 h-3.5" /> : <ArrowLeft className="w-3.5 h-3.5" />}
                {step === 0 ? pick(C.restart, lang) : pick(C.back, lang)}
              </button>
              <button type="button" onClick={goNext} disabled={!valid[step]} data-testid="planner-next"
                className={`inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-[12px] tracking-[0.18em] uppercase font-semibold transition-all duration-300 ${valid[step] ? "bg-[#C16542] text-[#FDFBF7] hover:bg-[#A85231]" : "bg-[#2C2621]/12 text-[#8A7E70] cursor-not-allowed"}`}>
                {step === 5 ? <><Sparkles className="w-4 h-4" /> {pick(C.build, lang)}</> : <>{pick(C.next, lang)} <ArrowRight className="w-3.5 h-3.5" /></>}
              </button>
            </div>
          </div>
        </div>
      </section>

      {result && (
        <PlannerResult input={result.input} recommendation={result.recommendation} viability={result.viability} warnings={result.warnings} />
      )}
    </main>
  );
}
