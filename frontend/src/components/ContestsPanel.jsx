import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Gift, Trophy, Download, Plus, Trash2, RefreshCw, Save, CalendarDays,
  Users, BarChart3, Star, Power, AlertTriangle, CheckCircle2, ChevronDown, ChevronRight,
} from "lucide-react";

const API = process.env.REACT_APP_BACKEND_URL + "/api";
const tokenHeader = () => ({ Authorization: `Bearer ${localStorage.getItem("xaluca_admin_token")}` });
const jsonHeader = () => ({ "Content-Type": "application/json", ...tokenHeader() });

/* ISO string <-> <input type="datetime-local"> value (kept naive, backend treats as UTC). */
const toLocalInput = (iso) => (typeof iso === "string" && iso ? iso.slice(0, 16) : "");
const fmtDate = (iso) => {
  if (!iso) return "—";
  try { return new Date(iso).toLocaleString("es-ES", { dateStyle: "short", timeStyle: "short" }); }
  catch { return iso; }
};

const blankPrize = () => ({
  label: { es: "", en: "", fr: "" },
  short: { es: "", en: "", fr: "" },
  weight: 1,
  enabled: true,
  color: "#C16542",
  max_wins: null,
  is_grand: false,
  awarded: 0,
});

const ContestsPanel = () => {
  const [contests, setContests] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [contest, setContest] = useState(null);
  const [stats, setStats] = useState(null);
  const [participants, setParticipants] = useState([]);

  const [form, setForm] = useState(null);       // config: active/dates/cap/one-per-email
  const [prizes, setPrizes] = useState([]);      // editable prize list
  const [expanded, setExpanded] = useState({});  // per-prize translation expander

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [savedMsg, setSavedMsg] = useState("");
  const [showParticipants, setShowParticipants] = useState(true);

  const loadList = useCallback(async () => {
    try {
      const r = await fetch(`${API}/admin/contests`, { headers: tokenHeader() });
      const d = await r.json();
      if (!r.ok) throw new Error(d.detail || "No se pudieron cargar los concursos.");
      setContests(d.contests || []);
      setSelectedId((prev) => prev || (d.contests?.[0]?.id ?? ""));
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }, []);

  const loadDetail = useCallback(async (id) => {
    if (!id) return;
    setError("");
    try {
      const [cr, sr, pr] = await Promise.all([
        fetch(`${API}/admin/contests/${id}`, { headers: tokenHeader() }),
        fetch(`${API}/admin/contests/${id}/stats`, { headers: tokenHeader() }),
        fetch(`${API}/admin/contests/${id}/participants`, { headers: tokenHeader() }),
      ]);
      const c = await cr.json();
      if (!cr.ok) throw new Error(c.detail || "No se pudo cargar el concurso.");
      const s = sr.ok ? await sr.json() : null;
      const p = pr.ok ? await pr.json() : { participants: [] };
      setContest(c);
      setStats(s);
      setParticipants(p.participants || []);
      setPrizes((c.prizes || []).map((x) => ({ ...x, label: { ...x.label }, short: { ...x.short } })));
      setForm({
        active: !!c.active,
        starts_at: c.starts_at || "",
        ends_at: c.ends_at || "",
        one_entry_per_email: c.one_entry_per_email !== false,
        max_prizes_total: c.max_prizes_total || "",
      });
    } catch (e) { setError(e.message); }
  }, []);

  useEffect(() => { loadList(); }, [loadList]);
  useEffect(() => { loadDetail(selectedId); }, [selectedId, loadDetail]);

  const totalWeight = useMemo(
    () => prizes.filter((p) => p.enabled).reduce((n, p) => n + (Number(p.weight) || 0), 0),
    [prizes],
  );
  const prob = (p) => (p.enabled && totalWeight > 0 ? ((Number(p.weight) || 0) / totalWeight) * 100 : 0);

  const setPrize = (idx, patch) =>
    setPrizes((arr) => arr.map((p, i) => (i === idx ? { ...p, ...patch } : p)));
  const setPrizeLang = (idx, field, lang, val) =>
    setPrizes((arr) => arr.map((p, i) => (i === idx ? { ...p, [field]: { ...p[field], [lang]: val } } : p)));

  const addPrize = () => { setPrizes((arr) => [...arr, blankPrize()]); };
  const removePrize = (idx) => { setPrizes((arr) => arr.filter((_, i) => i !== idx)); };

  const save = async () => {
    if (!selectedId) return;
    setSaving(true); setError(""); setSavedMsg("");
    try {
      const payload = {
        active: !!form.active,
        starts_at: form.starts_at || "",
        ends_at: form.ends_at || "",
        one_entry_per_email: !!form.one_entry_per_email,
        max_prizes_total: form.max_prizes_total === "" ? 0 : Number(form.max_prizes_total),
        prizes: prizes.map((p) => ({
          id: p.id,
          label: p.label,
          short: p.short && (p.short.es || p.short.en || p.short.fr) ? p.short : p.label,
          weight: Number(p.weight) || 0,
          enabled: !!p.enabled,
          color: p.color || "#C16542",
          max_wins: p.max_wins === "" || p.max_wins == null ? null : Number(p.max_wins),
          is_grand: !!p.is_grand,
        })),
      };
      const r = await fetch(`${API}/admin/contests/${selectedId}`, {
        method: "PUT", headers: jsonHeader(), body: JSON.stringify(payload),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.detail || "No se pudo guardar.");
      setSavedMsg("Cambios guardados correctamente.");
      await Promise.all([loadDetail(selectedId), loadList()]);
      setTimeout(() => setSavedMsg(""), 4000);
    } catch (e) { setError(e.message); }
    finally { setSaving(false); }
  };

  const exportCsv = async () => {
    if (!selectedId) return;
    try {
      const r = await fetch(`${API}/admin/contests/${selectedId}/participants.csv`, { headers: tokenHeader() });
      if (!r.ok) throw new Error("No se pudo exportar el CSV.");
      const blob = await r.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `participantes_${(contest?.slug || selectedId)}.csv`;
      document.body.appendChild(a); a.click(); a.remove();
      URL.revokeObjectURL(url);
    } catch (e) { setError(e.message); }
  };

  const totalAwarded = useMemo(
    () => (stats?.per_prize || []).reduce((n, p) => n + (p.awarded || 0), 0),
    [stats],
  );
  const maxDay = useMemo(
    () => Math.max(1, ...((stats?.by_day || []).map((d) => d.count))),
    [stats],
  );

  const label = (l) => (l && (l.es || l.en || l.fr)) || "—";

  if (loading) {
    return (
      <div className="p-10 text-white/60 flex items-center gap-3" data-testid="contests-loading">
        <RefreshCw className="w-4 h-4 animate-spin" /> Cargando concursos…
      </div>
    );
  }

  if (!contest || !form) {
    return (
      <div className="p-10 text-white/60" data-testid="contests-empty">
        {error ? error : "No hay ningún concurso configurado."}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 md:px-10 py-8 text-white" data-testid="contests-panel">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <Gift className="w-6 h-6 text-[#D4A373]" strokeWidth={1.6} />
        <div>
          <h2 className="text-2xl font-serif-x leading-none">Concursos · Ruleta de la Suerte</h2>
          <p className="text-[11px] tracking-[0.2em] uppercase text-white/40 mt-1">{label(contest.name)}</p>
        </div>
        {contests.length > 1 && (
          <select
            data-testid="contest-select"
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            className="ml-auto bg-white/5 border border-white/15 text-sm px-3 py-2 text-white"
          >
            {contests.map((c) => (
              <option key={c.id} value={c.id} className="bg-[#14110F]">{label(c.name)}</option>
            ))}
          </select>
        )}
        <button
          type="button"
          data-testid="contests-refresh-btn"
          onClick={() => loadDetail(selectedId)}
          className={`${contests.length > 1 ? "" : "ml-auto"} inline-flex items-center gap-1.5 text-[10px] tracking-[0.2em] uppercase text-white/55 hover:text-white transition-colors`}
        >
          <RefreshCw className="w-3.5 h-3.5" strokeWidth={1.8} /> Actualizar
        </button>
      </div>

      {error && (
        <div className="mb-5 flex items-start gap-3 bg-red-500/10 border border-red-500/40 px-4 py-3" data-testid="contests-error">
          <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" strokeWidth={1.8} />
          <p className="text-xs text-red-300 leading-relaxed">{error}</p>
        </div>
      )}
      {savedMsg && (
        <div className="mb-5 flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/40 px-4 py-3" data-testid="contests-saved">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" strokeWidth={1.8} />
          <p className="text-xs text-emerald-300">{savedMsg}</p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4" data-testid="contests-stats">
        <div className="bg-white/[0.03] border border-white/10 px-4 py-3">
          <div className="text-[10px] tracking-[0.2em] uppercase text-white/45 flex items-center gap-1.5"><Users className="w-3 h-3" /> Participantes</div>
          <div className="mt-1 text-2xl font-serif-x" data-testid="contests-total-participants">{stats?.total_participants ?? participants.length}</div>
        </div>
        <div className="bg-white/[0.03] border border-white/10 px-4 py-3">
          <div className="text-[10px] tracking-[0.2em] uppercase text-white/45 flex items-center gap-1.5"><Trophy className="w-3 h-3" /> Premios entregados</div>
          <div className="mt-1 text-2xl font-serif-x">{totalAwarded}</div>
        </div>
        <div className="bg-white/[0.03] border border-white/10 px-4 py-3">
          <div className="text-[10px] tracking-[0.2em] uppercase text-white/45 flex items-center gap-1.5"><Gift className="w-3 h-3" /> Premios activos</div>
          <div className="mt-1 text-2xl font-serif-x">{prizes.filter((p) => p.enabled).length}/{prizes.length}</div>
        </div>
        <div className="bg-white/[0.03] border border-white/10 px-4 py-3">
          <div className="text-[10px] tracking-[0.2em] uppercase text-white/45 flex items-center gap-1.5"><Power className="w-3 h-3" /> Estado</div>
          <div className={`mt-1 text-sm font-medium ${contest.active ? "text-emerald-400" : "text-white/50"}`} data-testid="contests-status">
            {contest.active ? "Activo" : "Inactivo"}
          </div>
        </div>
      </div>

      {/* Participations by day + export */}
      <div className="bg-white/[0.03] border border-white/10 px-4 py-4 mb-8">
        <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
          <div className="text-[10px] tracking-[0.22em] uppercase text-white/50 flex items-center gap-1.5"><BarChart3 className="w-3.5 h-3.5" /> Participaciones por día</div>
          <button
            type="button"
            data-testid="contests-export-csv"
            onClick={exportCsv}
            className="inline-flex items-center gap-2 bg-[#3E7C59] hover:bg-[#326449] text-white px-4 py-2 text-[10px] tracking-[0.2em] uppercase transition-colors"
          >
            <Download className="w-3.5 h-3.5" strokeWidth={1.8} /> Exportar CSV
          </button>
        </div>
        {stats?.by_day?.length ? (
          <div className="flex items-end gap-1.5 h-24" data-testid="contests-by-day">
            {stats.by_day.map((d) => (
              <div key={d.date} className="flex-1 min-w-[6px] flex flex-col items-center justify-end group" title={`${d.date}: ${d.count}`}>
                <span className="text-[9px] text-white/50 mb-1">{d.count}</span>
                <div className="w-full bg-[#C16542] group-hover:bg-[#D4A373] transition-colors" style={{ height: `${(d.count / maxDay) * 100}%` }} />
                <span className="text-[8px] text-white/30 mt-1 rotate-0 truncate w-full text-center">{d.date.slice(5)}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-white/40">Aún no hay participaciones registradas.</p>
        )}
      </div>

      {/* Configuration */}
      <h3 className="text-lg font-serif-x mb-3 flex items-center gap-2"><CalendarDays className="w-4 h-4 text-[#D4A373]" /> Configuración</h3>
      <div className="bg-white/[0.03] border border-white/10 px-4 py-4 mb-8 grid grid-cols-1 sm:grid-cols-2 gap-4" data-testid="contest-config">
        <label className="flex items-center gap-3 cursor-pointer select-none">
          <input type="checkbox" data-testid="contest-active-toggle" checked={form.active}
            onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))}
            className="w-4 h-4 accent-[#C16542]" />
          <span className="text-sm">Concurso activo {contest.open === false && contest.active ? <span className="text-amber-400/80 text-[11px]">(cerrado: {contest.closed_reason})</span> : null}</span>
        </label>
        <label className="flex items-center gap-3 cursor-pointer select-none">
          <input type="checkbox" data-testid="contest-oneperemail-toggle" checked={form.one_entry_per_email}
            onChange={(e) => setForm((f) => ({ ...f, one_entry_per_email: e.target.checked }))}
            className="w-4 h-4 accent-[#C16542]" />
          <span className="text-sm">1 participación por email</span>
        </label>
        <div>
          <label className="block text-[10px] tracking-[0.2em] uppercase text-white/45 mb-1">Fecha inicio</label>
          <input type="datetime-local" data-testid="contest-starts-at" value={toLocalInput(form.starts_at)}
            onChange={(e) => setForm((f) => ({ ...f, starts_at: e.target.value }))}
            className="w-full bg-white/5 border border-white/15 px-3 py-2 text-sm text-white" />
          {form.starts_at && (
            <button type="button" onClick={() => setForm((f) => ({ ...f, starts_at: "" }))} className="mt-1 text-[10px] text-white/40 hover:text-white/70 uppercase tracking-wide">Borrar fecha</button>
          )}
        </div>
        <div>
          <label className="block text-[10px] tracking-[0.2em] uppercase text-white/45 mb-1">Fecha fin</label>
          <input type="datetime-local" data-testid="contest-ends-at" value={toLocalInput(form.ends_at)}
            onChange={(e) => setForm((f) => ({ ...f, ends_at: e.target.value }))}
            className="w-full bg-white/5 border border-white/15 px-3 py-2 text-sm text-white" />
          {form.ends_at && (
            <button type="button" onClick={() => setForm((f) => ({ ...f, ends_at: "" }))} className="mt-1 text-[10px] text-white/40 hover:text-white/70 uppercase tracking-wide">Borrar fecha</button>
          )}
        </div>
        <div>
          <label className="block text-[10px] tracking-[0.2em] uppercase text-white/45 mb-1">Límite total de premios (0 = sin límite)</label>
          <input type="number" min="0" data-testid="contest-cap" value={form.max_prizes_total}
            onChange={(e) => setForm((f) => ({ ...f, max_prizes_total: e.target.value }))}
            placeholder="Sin límite"
            className="w-full bg-white/5 border border-white/15 px-3 py-2 text-sm text-white" />
        </div>
      </div>

      {/* Prizes */}
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <h3 className="text-lg font-serif-x flex items-center gap-2"><Trophy className="w-4 h-4 text-[#D4A373]" /> Premios y probabilidades</h3>
        <span className="text-[11px] text-white/40">· suma de pesos activos: {totalWeight.toFixed(2)}</span>
        <button type="button" data-testid="contest-add-prize" onClick={addPrize}
          className="ml-auto inline-flex items-center gap-1.5 bg-white/5 hover:bg-white/10 border border-white/15 px-3 py-2 text-[10px] tracking-[0.2em] uppercase transition-colors">
          <Plus className="w-3.5 h-3.5" /> Añadir premio
        </button>
      </div>

      <div className="space-y-2 mb-8" data-testid="contest-prizes">
        {prizes.map((p, idx) => {
          const isOpen = expanded[idx];
          return (
            <div key={p.id || `new-${idx}`} className="bg-white/[0.03] border border-white/10 px-3 py-3" data-testid={`contest-prize-${idx}`}>
              <div className="flex items-center gap-3 flex-wrap">
                <input type="checkbox" checked={!!p.enabled} data-testid={`contest-prize-enabled-${idx}`}
                  onChange={(e) => setPrize(idx, { enabled: e.target.checked })}
                  className="w-4 h-4 accent-[#C16542] shrink-0" title="Activar / desactivar" />
                <input type="color" value={p.color || "#C16542"}
                  onChange={(e) => setPrize(idx, { color: e.target.value })}
                  className="w-7 h-7 bg-transparent border border-white/15 cursor-pointer shrink-0" title="Color" />
                <input type="text" value={p.label?.es || ""} placeholder="Nombre del premio (ES)"
                  data-testid={`contest-prize-label-${idx}`}
                  onChange={(e) => setPrizeLang(idx, "label", "es", e.target.value)}
                  className={`flex-1 min-w-[180px] bg-white/5 border border-white/15 px-3 py-2 text-sm text-white ${p.enabled ? "" : "opacity-50"}`} />
                <div className="text-right shrink-0 w-16">
                  <div className="text-sm font-medium text-[#D4A373]" data-testid={`contest-prize-prob-${idx}`}>{prob(p).toFixed(1)}%</div>
                  <div className="text-[9px] text-white/35 uppercase tracking-wide">prob.</div>
                </div>
                {p.is_grand && <Star className="w-4 h-4 text-[#B8862F] shrink-0" title="Gran premio" fill="#B8862F" />}
                <button type="button" data-testid={`contest-prize-delete-${idx}`} onClick={() => removePrize(idx)}
                  className="text-white/40 hover:text-red-400 transition-colors shrink-0" title="Eliminar premio">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-4 mt-2 flex-wrap pl-7">
                <label className="flex items-center gap-2 text-[11px] text-white/55">
                  Peso
                  <input type="number" step="0.1" min="0" value={p.weight}
                    data-testid={`contest-prize-weight-${idx}`}
                    onChange={(e) => setPrize(idx, { weight: e.target.value })}
                    className="w-20 bg-white/5 border border-white/15 px-2 py-1 text-sm text-white" />
                </label>
                <label className="flex items-center gap-2 text-[11px] text-white/55">
                  Máx. entregas
                  <input type="number" min="0" value={p.max_wins ?? ""} placeholder="∞"
                    onChange={(e) => setPrize(idx, { max_wins: e.target.value === "" ? null : e.target.value })}
                    className="w-20 bg-white/5 border border-white/15 px-2 py-1 text-sm text-white" />
                </label>
                <label className="flex items-center gap-2 text-[11px] text-white/55">
                  <input type="checkbox" checked={!!p.is_grand} className="w-3.5 h-3.5 accent-[#B8862F]"
                    onChange={(e) => setPrize(idx, { is_grand: e.target.checked })} />
                  Gran premio
                </label>
                <span className="text-[11px] text-white/40">Entregados: <span className="text-white/70">{p.awarded || 0}</span></span>
                <button type="button" onClick={() => setExpanded((s) => ({ ...s, [idx]: !s[idx] }))}
                  className="inline-flex items-center gap-1 text-[10px] tracking-[0.18em] uppercase text-white/45 hover:text-white transition-colors">
                  {isOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />} Traducciones / etiqueta corta
                </button>
              </div>

              {isOpen && (
                <div className="mt-3 pl-7 grid grid-cols-1 md:grid-cols-2 gap-3 border-t border-white/10 pt-3">
                  {["en", "fr"].map((lg) => (
                    <div key={lg}>
                      <label className="block text-[10px] tracking-[0.2em] uppercase text-white/40 mb-1">Nombre ({lg})</label>
                      <input type="text" value={p.label?.[lg] || ""}
                        onChange={(e) => setPrizeLang(idx, "label", lg, e.target.value)}
                        className="w-full bg-white/5 border border-white/15 px-3 py-1.5 text-sm text-white" />
                    </div>
                  ))}
                  {["es", "en", "fr"].map((lg) => (
                    <div key={`short-${lg}`}>
                      <label className="block text-[10px] tracking-[0.2em] uppercase text-white/40 mb-1">Etiqueta corta ({lg}) · en la ruleta</label>
                      <input type="text" value={p.short?.[lg] || ""}
                        onChange={(e) => setPrizeLang(idx, "short", lg, e.target.value)}
                        className="w-full bg-white/5 border border-white/15 px-3 py-1.5 text-sm text-white" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Save bar */}
      <div className="sticky bottom-0 -mx-6 md:-mx-10 px-6 md:px-10 py-4 bg-[#0F0D0B]/95 border-t border-white/10 backdrop-blur flex items-center gap-3">
        <button type="button" data-testid="contest-save-btn" onClick={save} disabled={saving}
          className="inline-flex items-center gap-2 bg-[#C16542] hover:bg-[#a8512f] text-white px-6 py-3 text-[11px] tracking-[0.25em] uppercase transition-colors disabled:opacity-50">
          {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? "Guardando…" : "Guardar cambios"}
        </button>
        {savedMsg && <span className="text-xs text-emerald-400">{savedMsg}</span>}
      </div>

      {/* Participants */}
      <div className="mt-8">
        <button type="button" onClick={() => setShowParticipants((v) => !v)}
          className="flex items-center gap-2 text-lg font-serif-x mb-3">
          {showParticipants ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          <Users className="w-4 h-4 text-[#D4A373]" /> Participantes ({participants.length})
        </button>
        {showParticipants && (
          participants.length ? (
            <div className="overflow-x-auto border border-white/10" data-testid="contest-participants">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-white/[0.04] text-[10px] tracking-[0.2em] uppercase text-white/50">
                    <th className="text-left px-3 py-2 font-normal">Fecha</th>
                    <th className="text-left px-3 py-2 font-normal">Nombre</th>
                    <th className="text-left px-3 py-2 font-normal">Email</th>
                    <th className="text-left px-3 py-2 font-normal">Idioma</th>
                    <th className="text-left px-3 py-2 font-normal">Premio</th>
                  </tr>
                </thead>
                <tbody>
                  {participants.map((r) => (
                    <tr key={r.id} className="border-t border-white/[0.06] hover:bg-white/[0.02]">
                      <td className="px-3 py-2 text-white/60 whitespace-nowrap">{fmtDate(r.created_at)}</td>
                      <td className="px-3 py-2 text-white/85 whitespace-nowrap">{[r.first_name, r.last_name].filter(Boolean).join(" ")}</td>
                      <td className="px-3 py-2 text-white/70">{r.email}</td>
                      <td className="px-3 py-2 text-white/50 uppercase">{r.language}</td>
                      <td className="px-3 py-2 text-[#D4A373]">{typeof r.prize_label === "object" ? (r.prize_label?.es || "—") : (r.prize_label || "—")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-xs text-white/40">Aún no hay participantes.</p>
          )
        )}
      </div>
    </div>
  );
};

export default ContestsPanel;
