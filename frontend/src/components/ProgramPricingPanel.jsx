import React, { useEffect, useMemo, useState } from "react";
import { Coins, Search, Save, RotateCcw, Loader2, CheckCircle2, AlertTriangle, BedSingle, Baby } from "lucide-react";
import { PROGRAM_PRICING } from "@/lib/programPricing";
import { setProgramPricingLocal } from "@/lib/programPricingStore";
import { ROUTES } from "@/lib/routes";

const API = process.env.REACT_APP_BACKEND_URL + "/api";
const tokenHeader = () => ({ Authorization: `Bearer ${localStorage.getItem("xaluca_admin_token")}` });
const onlyDigits = (v) => String(v).replace(/[^0-9]/g, "");

const buildDraft = (rid, overrides) => {
  const src = overrides[rid] || PROGRAM_PRICING[rid] || { tiers: [] };
  return {
    tiers: (src.tiers || []).map((t) => ({ people: String(t.people), low: String(t.low), high: String(t.high) })),
    hasSupplement: !!src.supplement,
    supplement: { low: String(src.supplement?.low ?? ""), high: String(src.supplement?.high ?? "") },
    hasChild: !!src.child,
    child: { low: String(src.child?.low ?? ""), high: String(src.child?.high ?? "") },
  };
};

const NumInput = ({ value, onChange, testid }) => (
  <input
    value={value}
    onChange={(e) => onChange(onlyDigits(e.target.value))}
    data-testid={testid}
    inputMode="numeric"
    className="w-full bg-white/5 border border-white/10 px-2 py-1.5 text-sm text-white outline-none focus:border-[#D4A373] rounded"
  />
);

const ProgramPricingPanel = () => {
  const [overrides, setOverrides] = useState({});
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState(null);
  const [draft, setDraft] = useState(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null); // {ok, text}

  const load = async () => {
    try {
      const r = await fetch(`${API}/program-pricing`);
      const d = await r.json();
      setOverrides((d && d.programs) || {});
    } catch { setOverrides({}); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const programs = useMemo(() => {
    const list = Object.keys(PROGRAM_PRICING).map((rid) => ({
      rid,
      path: (ROUTES[rid] && ROUTES[rid].es) || rid,
      modified: Object.prototype.hasOwnProperty.call(overrides, rid),
    }));
    list.sort((a, b) => a.path.localeCompare(b.path));
    const needle = q.trim().toLowerCase();
    return needle ? list.filter((p) => p.path.toLowerCase().includes(needle) || p.rid.toLowerCase().includes(needle)) : list;
  }, [overrides, q]);

  const select = (rid) => { setSelected(rid); setDraft(buildDraft(rid, overrides)); setMsg(null); };

  const setTier = (i, key, val) =>
    setDraft((d) => ({ ...d, tiers: d.tiers.map((t, idx) => (idx === i ? { ...t, [key]: val } : t)) }));

  const save = async () => {
    if (!selected || !draft) return;
    setBusy(true); setMsg(null);
    const payload = {
      tiers: draft.tiers.map((t) => ({ people: Number(t.people) || 0, low: Number(t.low) || 0, high: Number(t.high) || 0 })).filter((t) => t.people > 0),
      supplement: draft.hasSupplement ? { low: Number(draft.supplement.low) || 0, high: Number(draft.supplement.high) || 0 } : null,
      child: draft.hasChild ? { low: Number(draft.child.low) || 0, high: Number(draft.child.high) || 0 } : null,
    };
    try {
      const r = await fetch(`${API}/program-pricing/${selected}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...tokenHeader() },
        body: JSON.stringify(payload),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.detail || "Error al guardar");
      const progs = (d && d.programs) || {};
      setOverrides(progs);
      setProgramPricingLocal(selected, progs[selected] || payload);
      setMsg({ ok: true, text: "✓ Guardado. Se refleja en toda la web." });
    } catch (e) { setMsg({ ok: false, text: e.message }); }
    finally { setBusy(false); }
  };

  const reset = async () => {
    if (!selected) return;
    setBusy(true); setMsg(null);
    try {
      const r = await fetch(`${API}/program-pricing/${selected}`, { method: "DELETE", headers: tokenHeader() });
      const d = await r.json();
      if (!r.ok) throw new Error(d.detail || "Error");
      const progs = (d && d.programs) || {};
      setOverrides(progs);
      setProgramPricingLocal(selected, null);
      setDraft(buildDraft(selected, progs));
      setMsg({ ok: true, text: "Restablecido al precio por defecto del código." });
    } catch (e) { setMsg({ ok: false, text: e.message }); }
    finally { setBusy(false); }
  };

  return (
    <div className="p-6 text-white/90" data-testid="program-pricing-panel">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 rounded-lg bg-[#C16542]/20 flex items-center justify-center">
          <Coins className="w-5 h-5 text-[#E0A458]" strokeWidth={1.6} />
        </div>
        <div>
          <h2 className="text-lg font-semibold">Precios por programa</h2>
          <p className="text-xs text-white/50">Edita la tarifa (por persona) de cada viaje: 2/3/4 pax × temporada baja/alta, suplemento individual y niño. Sin tocar código.</p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-white/60 mt-8"><Loader2 className="w-4 h-4 animate-spin" /> Cargando…</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Program list */}
          <div className="lg:col-span-5">
            <div className="relative mb-3">
              <Search className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Buscar programa (ruta o id)…"
                data-testid="program-pricing-search"
                className="w-full bg-white/5 border border-white/10 pl-9 pr-3 py-2 text-sm text-white rounded outline-none focus:border-[#D4A373]"
              />
            </div>
            <div className="text-[10px] tracking-[0.2em] uppercase text-white/40 mb-2">{programs.length} programas</div>
            <div className="border border-white/10 rounded divide-y divide-white/5 max-h-[62vh] overflow-y-auto">
              {programs.map((p) => (
                <button
                  key={p.rid}
                  data-testid={`program-pricing-item-${p.rid}`}
                  onClick={() => select(p.rid)}
                  className={`w-full text-left px-3 py-2.5 flex items-center justify-between gap-2 transition-colors ${selected === p.rid ? "bg-[#C16542] text-white" : "hover:bg-white/5"}`}
                >
                  <span className="text-xs font-mono truncate">/{p.path}</span>
                  {p.modified && <span title="Precio personalizado" className="shrink-0 w-1.5 h-1.5 rounded-full bg-[#E0A458]" data-testid={`program-pricing-mod-${p.rid}`} />}
                </button>
              ))}
            </div>
          </div>

          {/* Editor */}
          <div className="lg:col-span-7">
            {!draft ? (
              <div className="h-full flex items-center justify-center text-sm text-white/40 border border-dashed border-white/10 rounded py-16">
                Selecciona un programa para editar sus precios
              </div>
            ) : (
              <div className="border border-white/10 rounded p-5 space-y-5" data-testid="program-pricing-editor">
                <div>
                  <p className="text-[10px] tracking-[0.2em] uppercase text-[#D4A373]">Editando</p>
                  <p className="text-sm font-mono text-white/80 break-all">/{(ROUTES[selected] && ROUTES[selected].es) || selected}</p>
                </div>

                {/* Tiers */}
                <div>
                  <div className="grid grid-cols-12 gap-2 text-[9px] tracking-[0.2em] uppercase text-white/45 mb-1.5 px-1">
                    <span className="col-span-4">Viajeros</span>
                    <span className="col-span-4">Temp. baja €</span>
                    <span className="col-span-4">Temp. alta €</span>
                  </div>
                  {draft.tiers.map((t, i) => (
                    <div key={i} className="grid grid-cols-12 gap-2 items-center mb-2" data-testid={`program-pricing-tier-${i}`}>
                      <div className="col-span-4 flex items-center gap-1.5 text-sm text-white/70">
                        <span className="font-semibold text-white">{t.people}</span> pax
                      </div>
                      <div className="col-span-4"><NumInput value={t.low} onChange={(v) => setTier(i, "low", v)} testid={`program-pricing-tier-${i}-low`} /></div>
                      <div className="col-span-4"><NumInput value={t.high} onChange={(v) => setTier(i, "high", v)} testid={`program-pricing-tier-${i}-high`} /></div>
                    </div>
                  ))}
                </div>

                {/* Supplement */}
                <div className="border-t border-white/10 pt-4">
                  <label className="flex items-center gap-2 cursor-pointer select-none mb-2">
                    <input type="checkbox" checked={draft.hasSupplement} onChange={(e) => setDraft((d) => ({ ...d, hasSupplement: e.target.checked }))} data-testid="program-pricing-has-supplement" className="accent-[#C16542] w-4 h-4" />
                    <BedSingle className="w-3.5 h-3.5 text-[#D4A373]" />
                    <span className="text-sm">Suplemento individual</span>
                  </label>
                  {draft.hasSupplement && (
                    <div className="grid grid-cols-12 gap-2 pl-6">
                      <div className="col-span-4 flex items-center text-[10px] uppercase tracking-[0.15em] text-white/40">Baja / Alta</div>
                      <div className="col-span-4"><NumInput value={draft.supplement.low} onChange={(v) => setDraft((d) => ({ ...d, supplement: { ...d.supplement, low: v } }))} testid="program-pricing-supplement-low" /></div>
                      <div className="col-span-4"><NumInput value={draft.supplement.high} onChange={(v) => setDraft((d) => ({ ...d, supplement: { ...d.supplement, high: v } }))} testid="program-pricing-supplement-high" /></div>
                    </div>
                  )}
                </div>

                {/* Child */}
                <div className="border-t border-white/10 pt-4">
                  <label className="flex items-center gap-2 cursor-pointer select-none mb-2">
                    <input type="checkbox" checked={draft.hasChild} onChange={(e) => setDraft((d) => ({ ...d, hasChild: e.target.checked }))} data-testid="program-pricing-has-child" className="accent-[#C16542] w-4 h-4" />
                    <Baby className="w-3.5 h-3.5 text-[#D4A373]" />
                    <span className="text-sm">Niño</span>
                  </label>
                  {draft.hasChild && (
                    <div className="grid grid-cols-12 gap-2 pl-6">
                      <div className="col-span-4 flex items-center text-[10px] uppercase tracking-[0.15em] text-white/40">Baja / Alta</div>
                      <div className="col-span-4"><NumInput value={draft.child.low} onChange={(v) => setDraft((d) => ({ ...d, child: { ...d.child, low: v } }))} testid="program-pricing-child-low" /></div>
                      <div className="col-span-4"><NumInput value={draft.child.high} onChange={(v) => setDraft((d) => ({ ...d, child: { ...d.child, high: v } }))} testid="program-pricing-child-high" /></div>
                    </div>
                  )}
                </div>

                {msg && (
                  <div className={`flex items-center gap-2 text-sm ${msg.ok ? "text-emerald-300" : "text-red-300"}`} data-testid="program-pricing-msg">
                    {msg.ok ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />} {msg.text}
                  </div>
                )}

                <div className="flex items-center gap-3 pt-1">
                  <button onClick={save} disabled={busy} data-testid="program-pricing-save" className="inline-flex items-center gap-2 px-5 py-2.5 rounded bg-[#C16542] hover:bg-[#a9522f] text-white text-sm font-medium transition-colors disabled:opacity-50">
                    {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Guardar
                  </button>
                  {overrides[selected] && (
                    <button onClick={reset} disabled={busy} data-testid="program-pricing-reset" className="inline-flex items-center gap-2 px-4 py-2.5 rounded border border-white/15 text-white/70 hover:bg-white/5 text-sm transition-colors disabled:opacity-50">
                      <RotateCcw className="w-4 h-4" /> Restablecer por defecto
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgramPricingPanel;
