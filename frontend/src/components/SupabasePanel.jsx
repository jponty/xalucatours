import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Cloud, Database, Image as ImageIcon, RefreshCw, UploadCloud,
  CheckCircle2, AlertTriangle, ShieldAlert, Loader2, Server,
} from "lucide-react";

const API = process.env.REACT_APP_BACKEND_URL + "/api";
const tokenHeader = () => ({ Authorization: `Bearer ${localStorage.getItem("xaluca_admin_token")}` });
const jsonHeader = () => ({ "Content-Type": "application/json", ...tokenHeader() });

const Bar = ({ value, total, testid }) => {
  const pct = total > 0 ? Math.min(100, Math.round((value / total) * 100)) : 0;
  return (
    <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden" data-testid={testid}>
      <div
        className="h-full bg-gradient-to-r from-[#C16542] to-[#E0A458] transition-[width] duration-500"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
};

const Stat = ({ label, value, testid }) => (
  <div className="rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3">
    <p className="text-[9px] tracking-[0.28em] uppercase text-white/40">{label}</p>
    <p className="text-xl font-semibold text-white/90 mt-1" data-testid={testid}>{value}</p>
  </div>
);

const SupabasePanel = () => {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [includePersonal, setIncludePersonal] = useState(false);
  const [force, setForce] = useState(false);
  const [what, setWhat] = useState("all");
  const [busy, setBusy] = useState(false);
  const pollRef = useRef(null);

  const loadStatus = useCallback(async () => {
    try {
      const r = await fetch(`${API}/admin/supabase/status`, { headers: tokenHeader() });
      const d = await r.json();
      if (!r.ok) throw new Error(d.detail || "No se pudo cargar el estado de Supabase.");
      setStatus(d);
      return d;
    } catch (e) { setError(e.message); return null; }
    finally { setLoading(false); }
  }, []);

  const pollJob = useCallback(async () => {
    try {
      const r = await fetch(`${API}/admin/supabase/sync/status`, { headers: tokenHeader() });
      const job = await r.json();
      setStatus((s) => (s ? { ...s, job } : s));
      if (!job.running) {
        if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null; }
        loadStatus();
      }
    } catch { /* keep polling */ }
  }, [loadStatus]);

  useEffect(() => {
    loadStatus().then((d) => {
      if (d?.job?.running && !pollRef.current) pollRef.current = setInterval(pollJob, 2000);
    });
    return () => { if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null; } };
  }, [loadStatus, pollJob]);

  const startSync = async () => {
    setBusy(true); setError("");
    try {
      const r = await fetch(`${API}/admin/supabase/sync`, {
        method: "POST",
        headers: jsonHeader(),
        body: JSON.stringify({ include_personal_data: includePersonal, force, what }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.detail || "No se pudo iniciar la sincronización.");
      if (!pollRef.current) pollRef.current = setInterval(pollJob, 2000);
      pollJob();
    } catch (e) { setError(e.message); }
    finally { setBusy(false); }
  };

  const job = status?.job || {};
  const running = !!job.running;
  const dbEntries = job.db ? Object.entries(job.db) : [];
  const st = job.storage || {};

  const phaseLabel = {
    starting: "Iniciando…",
    db: "Copiando base de datos…",
    storage: "Subiendo imágenes…",
    done: "Completado",
    error: "Error",
  }[job.phase] || (running ? "En curso…" : "");

  return (
    <div className="p-6 max-w-4xl mx-auto text-white/90" data-testid="supabase-panel">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-9 h-9 rounded-lg bg-[#C16542]/20 flex items-center justify-center">
          <Cloud className="w-5 h-5 text-[#E0A458]" strokeWidth={1.6} />
        </div>
        <div>
          <h2 className="text-lg font-semibold">Clonar a Supabase</h2>
          <p className="text-xs text-white/50">Copia unidireccional de MongoDB + Emergent Storage. El sistema principal no se toca.</p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-white/60 mt-8" data-testid="supabase-loading">
          <Loader2 className="w-4 h-4 animate-spin" /> Cargando estado…
        </div>
      ) : !status?.configured ? (
        <div className="mt-6 rounded-lg border border-amber-500/30 bg-amber-500/10 p-4 flex gap-3" data-testid="supabase-not-configured">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
          <div className="text-sm text-amber-100/90">
            Supabase no está configurado en el backend. Faltan las variables <code>SUPABASE_URL</code>,{" "}
            <code>SUPABASE_SERVICE_ROLE_KEY</code> y <code>SUPABASE_DB_URL</code> en <code>backend/.env</code>.
          </div>
        </div>
      ) : (
        <>
          {/* Connection info */}
          <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-3">
            <Stat label="Proyecto" value={<span className="text-xs break-all">{(status.project_url || "").replace(/^https?:\/\//, "")}</span>} testid="supabase-project" />
            <Stat label="Bucket" value={<span className="text-sm">{status.bucket}</span>} testid="supabase-bucket" />
            <Stat label="Imágenes en Emergent" value={status.total_files ?? "—"} testid="supabase-total-files" />
            <Stat label="Ya subidas a Supabase" value={status.synced_objects ?? 0} testid="supabase-synced-count" />
          </div>

          {/* Options */}
          <div className="mt-6 rounded-lg border border-white/10 bg-white/[0.02] p-4 space-y-4">
            <div>
              <p className="text-[9px] tracking-[0.28em] uppercase text-white/40 mb-2">Qué sincronizar</p>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: "all", label: "Todo", icon: Cloud },
                  { id: "db", label: "Solo base de datos", icon: Database },
                  { id: "storage", label: "Solo imágenes", icon: ImageIcon },
                ].map((o) => {
                  const Icon = o.icon;
                  const active = what === o.id;
                  return (
                    <button
                      key={o.id}
                      data-testid={`supabase-what-${o.id}`}
                      disabled={running}
                      onClick={() => setWhat(o.id)}
                      className={`inline-flex items-center gap-2 px-3 py-2 rounded-md text-xs transition-colors disabled:opacity-40 ${
                        active ? "bg-[#C16542] text-white" : "bg-white/5 text-white/70 hover:bg-white/10"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" /> {o.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <label className="flex items-start gap-3 cursor-pointer select-none" data-testid="supabase-include-personal-label">
              <input
                type="checkbox"
                data-testid="supabase-include-personal"
                checked={includePersonal}
                disabled={running}
                onChange={(e) => setIncludePersonal(e.target.checked)}
                className="mt-0.5 accent-[#C16542] w-4 h-4"
              />
              <span className="text-sm text-white/80">
                Incluir <b>datos personales</b> (participantes del concurso y leads de contacto)
                <span className="block text-xs text-white/40 mt-0.5 inline-flex items-center gap-1">
                  <ShieldAlert className="w-3 h-3" /> Nombre, email y teléfono. Déjalo desmarcado para copiar solo contenido del sitio.
                </span>
              </span>
            </label>

            <label className="flex items-start gap-3 cursor-pointer select-none" data-testid="supabase-force-label">
              <input
                type="checkbox"
                data-testid="supabase-force"
                checked={force}
                disabled={running}
                onChange={(e) => setForce(e.target.checked)}
                className="mt-0.5 accent-[#C16542] w-4 h-4"
              />
              <span className="text-sm text-white/80">
                Forzar re-subida de imágenes
                <span className="block text-xs text-white/40 mt-0.5">Por defecto solo sube las imágenes nuevas (más rápido). Márcalo para volver a subir todas.</span>
              </span>
            </label>

            <button
              data-testid="supabase-sync-button"
              onClick={startSync}
              disabled={running || busy}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-[#C16542] hover:bg-[#a9522f] text-white text-sm font-medium transition-colors disabled:opacity-50"
            >
              {running || busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
              {running ? "Sincronizando…" : "Sincronizar a Supabase"}
            </button>
          </div>

          {error && (
            <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200" data-testid="supabase-error">
              {error}
            </div>
          )}

          {/* Progress */}
          {(running || job.phase) && !job.never_run && (
            <div className="mt-6 rounded-lg border border-white/10 bg-white/[0.02] p-4" data-testid="supabase-progress">
              <div className="flex items-center gap-2 mb-4">
                {job.phase === "done" ? <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  : job.phase === "error" ? <AlertTriangle className="w-4 h-4 text-red-400" />
                  : <Loader2 className="w-4 h-4 animate-spin text-[#E0A458]" />}
                <span className="text-sm font-medium" data-testid="supabase-phase">{phaseLabel}</span>
              </div>

              {job.error && (
                <div className="mb-4 text-sm text-red-300" data-testid="supabase-job-error">{job.error}</div>
              )}

              {dbEntries.length > 0 && (
                <div className="mb-5">
                  <p className="text-[9px] tracking-[0.28em] uppercase text-white/40 mb-2 flex items-center gap-1">
                    <Database className="w-3 h-3" /> Base de datos
                  </p>
                  <div className="space-y-2">
                    {dbEntries.map(([coll, p]) => (
                      <div key={coll} className="flex items-center gap-3" data-testid={`supabase-db-${coll}`}>
                        <span className="text-xs text-white/60 w-44 shrink-0 truncate">mirror_{coll}</span>
                        <Bar value={p.done} total={p.total} testid={`supabase-db-bar-${coll}`} />
                        <span className="text-[11px] text-white/50 w-20 text-right tabular-nums">{p.done}/{p.total}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {(st.total > 0 || job.phase === "storage") && (
                <div>
                  <p className="text-[9px] tracking-[0.28em] uppercase text-white/40 mb-2 flex items-center gap-1">
                    <ImageIcon className="w-3 h-3" /> Imágenes (Supabase Storage)
                  </p>
                  <Bar value={st.done || 0} total={st.total || 0} testid="supabase-storage-bar" />
                  <div className="flex flex-wrap gap-x-5 gap-y-1 mt-2 text-[11px] text-white/55 tabular-nums">
                    <span data-testid="supabase-storage-done">{st.done || 0}/{st.total || 0} procesadas</span>
                    <span className="text-emerald-300/80">{st.uploaded || 0} subidas</span>
                    <span className="text-white/40">{st.skipped || 0} ya existían</span>
                    {st.errors ? <span className="text-red-300/80" data-testid="supabase-storage-errors">{st.errors} errores</span> : null}
                  </div>
                  {st.last_error && (
                    <p className="text-[11px] text-red-300/70 mt-1 break-all">Último error: {st.last_error}</p>
                  )}
                </div>
              )}

              {job.phase === "done" && (
                <div className="mt-4 flex items-center gap-2 text-sm text-emerald-300" data-testid="supabase-done">
                  <CheckCircle2 className="w-4 h-4" /> Copia completada. Supabase ya contiene la información sincronizada.
                </div>
              )}
            </div>
          )}

          <button
            onClick={loadStatus}
            className="mt-4 inline-flex items-center gap-2 text-xs text-white/50 hover:text-white/80 transition-colors"
            data-testid="supabase-refresh"
          >
            <RefreshCw className="w-3 h-3" /> Actualizar estado
          </button>
        </>
      )}
    </div>
  );
};

export default SupabasePanel;
