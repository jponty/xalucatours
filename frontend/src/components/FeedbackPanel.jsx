import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Archive, CheckCircle2, Clock3, Download, FileAudio, Inbox,
  Loader2, Mail, MessageSquareText, Play, RefreshCw, Save, Search,
  Star, Volume2,
} from "lucide-react";
import { adminAuthHeaders } from "@/lib/adminSession";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const STATUSES = [
  ["all", "Todos"], ["new", "Nuevos"], ["reviewed", "Revisados"],
  ["resolved", "Resueltos"], ["archived", "Archivados"],
];
const STATUS_LABEL = Object.fromEntries(STATUSES);

const formatDate = (value) => {
  if (!value) return "—";
  return new Intl.DateTimeFormat("es-ES", {
    dateStyle: "medium", timeStyle: "short",
  }).format(new Date(value));
};

function SecureAudio({ feedbackId }) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => () => { if (url) URL.revokeObjectURL(url); }, [url]);

  const load = async () => {
    setLoading(true); setError("");
    try {
      const response = await fetch(`${API}/admin/feedback/${feedbackId}/audio`, {
        headers: adminAuthHeaders(),
      });
      if (!response.ok) throw new Error(String(response.status));
      const blob = await response.blob();
      setUrl((previous) => {
        if (previous) URL.revokeObjectURL(previous);
        return URL.createObjectURL(blob);
      });
    } catch {
      setError("No se pudo recuperar el audio.");
    } finally {
      setLoading(false);
    }
  };

  if (url) {
    return (
      <div className="space-y-3">
        <audio src={url} controls autoPlay className="w-full" data-testid="admin-feedback-audio" />
        <a href={url} download={`feedback-${feedbackId}.audio`} className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-[#D4A373] hover:text-white">
          <Download className="h-3.5 w-3.5" /> Descargar copia
        </a>
      </div>
    );
  }
  return (
    <div>
      <button type="button" onClick={load} disabled={loading} className="inline-flex items-center gap-2 bg-[#C16542] px-4 py-3 text-[10px] uppercase tracking-[0.2em] text-white hover:bg-[#A8533A] disabled:opacity-60">
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" fill="currentColor" />}
        Reproducir audio
      </button>
      {error && <p className="mt-2 text-xs text-red-300">{error}</p>}
    </div>
  );
}

export default function FeedbackPanel() {
  const [rows, setRows] = useState([]);
  const [status, setStatus] = useState("all");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notes, setNotes] = useState("");

  const load = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const params = new URLSearchParams();
      if (status !== "all") params.set("status", status);
      const response = await fetch(`${API}/admin/feedback?${params}`, {
        headers: adminAuthHeaders(),
      });
      if (!response.ok) throw new Error(String(response.status));
      const data = await response.json();
      setRows(Array.isArray(data) ? data : []);
      setSelectedId((current) => current && data.some((item) => item.id === current) ? current : data[0]?.id || null);
    } catch {
      setError("No se pudieron cargar los feedbacks.");
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => { load(); }, [load]);
  const selected = rows.find((item) => item.id === selectedId) || null;
  useEffect(() => { setNotes(selected?.admin_notes || ""); }, [selectedId, selected?.admin_notes]);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return rows;
    return rows.filter((row) => [row.name, row.email, row.trip_reference, row.feedback_text, row.transcript]
      .filter(Boolean).some((value) => String(value).toLowerCase().includes(term)));
  }, [query, rows]);

  const patch = async (id, payload) => {
    setSaving(true); setError("");
    try {
      const response = await fetch(`${API}/admin/feedback/${id}`, {
        method: "PATCH",
        headers: adminAuthHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify(payload),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.detail || String(response.status));
      setRows((items) => items.map((item) => item.id === id ? data : item));
      return data;
    } catch {
      setError("No se pudo guardar el cambio.");
      return null;
    } finally {
      setSaving(false);
    }
  };

  const archive = async () => {
    if (!selected || !window.confirm("¿Archivar este feedback? Seguirá conservándose en Supabase.")) return;
    setSaving(true); setError("");
    try {
      const response = await fetch(`${API}/admin/feedback/${selected.id}`, {
        method: "DELETE", headers: adminAuthHeaders(),
      });
      if (!response.ok) throw new Error(String(response.status));
      if (status === "archived" || status === "all") {
        setRows((items) => items.map((item) => item.id === selected.id ? { ...item, status: "archived" } : item));
      } else {
        setRows((items) => items.filter((item) => item.id !== selected.id));
        setSelectedId(null);
      }
    } catch {
      setError("No se pudo archivar el feedback.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-full text-white" data-testid="admin-feedback-panel">
      <div className="border-b border-white/10 p-4 md:p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-[#D4A373]">Voz del cliente</p>
            <h2 className="mt-2 font-serif-x text-3xl">Feedback recibido</h2>
          </div>
          <button type="button" onClick={load} className="inline-flex items-center gap-2 border border-white/15 px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-white/70 hover:bg-white/5">
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Actualizar
          </button>
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          {STATUSES.map(([id, label]) => (
            <button key={id} type="button" onClick={() => setStatus(id)} className={`px-3 py-2 text-[10px] uppercase tracking-[0.17em] ${status === id ? "bg-[#C16542] text-white" : "bg-white/5 text-white/55 hover:bg-white/10"}`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {error && <div className="m-4 border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-200">{error}</div>}

      <div className="grid min-h-[calc(100vh-205px)] md:grid-cols-[360px_minmax(0,1fr)]">
        <div className="border-r border-white/10">
          <label className="m-4 flex items-center gap-2 border border-white/10 bg-white/5 px-3 py-2">
            <Search className="h-4 w-4 text-white/40" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar nombre, viaje o texto…" className="w-full bg-transparent text-sm outline-none placeholder:text-white/30" />
          </label>
          <div className="max-h-[calc(100vh-280px)] overflow-y-auto">
            {loading && rows.length === 0 ? (
              <div className="flex items-center justify-center py-20 text-white/45"><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Cargando…</div>
            ) : filtered.length === 0 ? (
              <div className="px-6 py-20 text-center text-white/40"><Inbox className="mx-auto mb-4 h-8 w-8" /><p>No hay feedbacks en esta vista.</p></div>
            ) : filtered.map((row) => (
              <button key={row.id} type="button" onClick={() => setSelectedId(row.id)} className={`w-full border-b border-white/8 px-4 py-4 text-left transition-colors ${selectedId === row.id ? "bg-[#C16542]/18" : "hover:bg-white/5"}`}>
                <div className="flex items-center justify-between gap-3">
                  <span className="truncate text-sm font-medium">{row.name || row.email || "Cliente anónimo"}</span>
                  {row.submission_type === "audio" ? <FileAudio className="h-4 w-4 shrink-0 text-[#D4A373]" /> : <MessageSquareText className="h-4 w-4 shrink-0 text-[#D4A373]" />}
                </div>
                <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-white/50">{row.feedback_text || row.transcript || "Audio pendiente de transcripción"}</p>
                <div className="mt-3 flex items-center justify-between text-[9px] uppercase tracking-[0.15em] text-white/30">
                  <span>{formatDate(row.created_at)}</span><span>{STATUS_LABEL[row.status] || row.status}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="max-h-[calc(100vh-205px)] overflow-y-auto p-5 md:p-8">
          {!selected ? (
            <div className="flex min-h-[420px] items-center justify-center text-center text-white/35"><div><MessageSquareText className="mx-auto mb-4 h-10 w-10" /><p>Selecciona un feedback para revisarlo.</p></div></div>
          ) : (
            <div className="mx-auto max-w-4xl space-y-6">
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-white/10 pb-6">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.22em] text-[#D4A373]">{selected.submission_type === "audio" ? "Comentario de voz" : "Comentario escrito"}</p>
                  <h3 className="mt-2 font-serif-x text-3xl">{selected.name || "Cliente anónimo"}</h3>
                  <p className="mt-2 text-xs text-white/40">Recibido el {formatDate(selected.created_at)}</p>
                </div>
                <select value={selected.status} onChange={(event) => patch(selected.id, { status: event.target.value })} disabled={saving} className="border border-white/15 bg-[#14110F] px-3 py-2 text-xs text-white outline-none">
                  {STATUSES.slice(1).map(([id, label]) => <option key={id} value={id}>{label}</option>)}
                </select>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <Info icon={Mail} label="Email" value={selected.email || "No facilitado"} />
                <Info icon={Clock3} label="Viaje o fecha" value={selected.trip_reference || "No indicado"} />
                <Info icon={Star} label="Valoración" value={selected.rating ? `${selected.rating} / 5` : "Sin valoración"} />
              </div>

              {selected.feedback_text && <ContentBlock label="Comentario" icon={MessageSquareText} text={selected.feedback_text} />}
              {selected.submission_type === "audio" && (
                <div className="border border-white/10 bg-white/[0.025] p-5 md:p-6">
                  <div className="mb-5 flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-[#D4A373]"><Volume2 className="h-4 w-4" /> Grabación original</div>
                  <SecureAudio key={selected.id} feedbackId={selected.id} />
                  {selected.transcription_status === "failed" && <p className="mt-4 text-xs text-amber-300">La grabación se conservó, pero la transcripción automática no pudo completarse.</p>}
                </div>
              )}
              {selected.transcript && <ContentBlock label="Transcripción automática" icon={FileAudio} text={selected.transcript} />}

              <div className="border border-white/10 p-5 md:p-6">
                <label className="block text-[10px] uppercase tracking-[0.22em] text-[#D4A373]">Notas internas</label>
                <textarea value={notes} onChange={(event) => setNotes(event.target.value)} rows={5} maxLength={6000} placeholder="Seguimiento, contexto o acciones realizadas…" className="mt-4 w-full resize-y border border-white/10 bg-white/5 px-4 py-3 text-sm leading-relaxed text-white outline-none placeholder:text-white/25 focus:border-[#D4A373]" />
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <button type="button" onClick={() => patch(selected.id, { admin_notes: notes })} disabled={saving} className="inline-flex items-center gap-2 bg-[#C16542] px-4 py-3 text-[10px] uppercase tracking-[0.2em] hover:bg-[#A8533A] disabled:opacity-60">
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Guardar notas
                  </button>
                  {selected.status !== "resolved" && <button type="button" onClick={() => patch(selected.id, { status: "resolved", admin_notes: notes })} disabled={saving} className="inline-flex items-center gap-2 border border-white/15 px-4 py-3 text-[10px] uppercase tracking-[0.2em] text-white/70 hover:bg-white/5"><CheckCircle2 className="h-4 w-4" /> Marcar resuelto</button>}
                  {selected.status !== "archived" && <button type="button" onClick={archive} disabled={saving} className="ml-auto inline-flex items-center gap-2 px-3 py-3 text-[10px] uppercase tracking-[0.2em] text-white/35 hover:text-red-300"><Archive className="h-4 w-4" /> Archivar</button>}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const Info = ({ icon: Icon, label, value }) => (
  <div className="border border-white/10 bg-white/[0.025] p-4">
    <div className="flex items-center gap-2 text-[9px] uppercase tracking-[0.18em] text-white/35"><Icon className="h-3.5 w-3.5" />{label}</div>
    <p className="mt-2 break-words text-sm text-white/75">{value}</p>
  </div>
);

const ContentBlock = ({ icon: Icon, label, text }) => (
  <div className="border border-white/10 bg-white/[0.025] p-5 md:p-6">
    <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-[#D4A373]"><Icon className="h-4 w-4" />{label}</div>
    <p className="mt-5 whitespace-pre-wrap text-base leading-relaxed text-white/78">{text}</p>
  </div>
);
