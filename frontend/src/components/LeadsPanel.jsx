import React, { useEffect, useRef, useState } from "react";
import { Download, Eye, Inbox, RefreshCw, Search } from "lucide-react";
import { adminAuthHeaders } from "@/lib/adminSession";
import { contactPrefLabel } from "@/lib/contactSubmission";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";

const API = `${process.env.REACT_APP_BACKEND_URL}/api/admin/leads`;
const EMPTY = { q: "", kind: "", origin: "", status: "", date_from: "", date_to: "" };
const STATUSES = { new: "Nuevo", reviewed: "En seguimiento", resolved: "Resuelto", archived: "Archivado" };
const fieldClass = "min-w-0 w-full bg-[#211B17] border border-white/20 px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#D4A373]";
const buttonClass = "inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-white/20 text-sm hover:bg-white/10 disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#D4A373]";
const dateLabel = value => value ? new Date(value).toLocaleString("es-ES", { timeZone: "UTC", dateStyle: "medium", timeStyle: "short" }) + " UTC" : "No registrada";
const LABELS = {
  full_name: "Nombre completo", first_name: "Nombre", last_name: "Apellidos", name: "Nombre", email: "Email", phone: "Teléfono internacional",
  created_at: "Fecha de creación", source_url: "URL de origen", source_path: "Página de origen", source_route_id: "Identificador de página", source_label: "Página / punto de captación",
  capture_type: "Tipo de captación", related_trip_id: "Identificador del viaje", related_trip_title: "Viaje relacionado",
  preferred_contact: "Forma de contacto preferida", preferred_contact_email: "Email preferido de contacto", preferred_contact_phone: "Teléfono / WhatsApp preferido",
  message: "Mensaje", notes: "Preferencias y necesidades", journey_interest: "Interés", travel_dates: "Fechas del viaje", party_size: "Viajeros",
  date_mode: "Tipo de fechas", start_date: "Inicio", end_date: "Fin", flexible_month: "Mes flexible", travellers_adults: "Adultos", travellers_children: "Niños",
  accommodation: "Alojamiento", regions: "Destinos / regiones", selected_trips: "Viajes seleccionados", selected_trips_detail: "Detalle de los viajes", activities: "Experiencias",
  language: "Idioma", route_id: "Ruta del programa", program_title: "Programa", privacy_accepted: "Privacidad aceptada", consent: "Consentimiento",
  newsletter: "Solicita newsletter", subscription_sync: "Última sincronización con Resend", subscription_synced_at: "Fecha de sincronización", last_signup_at: "Última solicitud de alta",
  email_delivery: "Notificación por email", status: "Estado", lead_status: "Estado de gestión", lead_updated_at: "Última gestión", updated_at: "Última actualización",
  founder_recipient: "Fundador destinatario", team_recipient: "Miembro del equipo", contest_id: "Concurso", prize_label: "Premio", prize_id: "ID del premio",
  appointment: "Datos de la cita", appointment_status: "Estado de la cita", appointment_cancellation: "Cancelación", appointment_updated_at: "Actualización de la cita",
  feedback_text: "Comentario del viajero", trip_reference: "Viaje", rating: "Valoración", admin_notes: "Notas internas", submission_type: "Tipo de comentario",
  transcription_language: "Idioma de la transcripción", questions_and_answers: "Preguntas y respuestas", question: "Pregunta", answer: "Respuesta", timezone: "Zona horaria",
  title: "Título", url: "URL", start_time: "Inicio", end_time: "Fin", notification_id: "ID de notificación", confirmation_id: "ID de confirmación", error: "Error",
};
const visible = value => value !== null && value !== undefined && value !== "" && !(Array.isArray(value) && !value.length);
const safeLink = value => typeof value === "string" && (/^https?:\/\//i.test(value) || /^\/(?!\/)/.test(value)) ? value : null;

function DataValue({ value }) {
  if (typeof value === "boolean") return value ? "Sí" : "No";
  if (Array.isArray(value)) return <ul className="space-y-2 list-disc pl-4">{value.map((item, i) => <li key={i}><DataValue value={item} /></li>)}</ul>;
  if (typeof value === "object") return <dl className="space-y-2">{Object.entries(value).filter(([, v]) => visible(v)).map(([key, item]) => <div key={key}><dt className="text-white/50 text-xs">{LABELS[key] || key.replaceAll("_", " ")}</dt><dd>{key === "preferred_contact" ? contactPrefLabel(item, "es") : <DataValue value={item} />}</dd></div>)}</dl>;
  return <span className="whitespace-pre-wrap break-words [overflow-wrap:anywhere]">{String(value)}</span>;
}

export default function LeadsPanel() {
  const [filters, setFilters] = useState(EMPTY);
  const [page, setPage] = useState(0);
  const [data, setData] = useState({ items: [], total: 0, all_total: 0, types: {} });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refresh, setRefresh] = useState(0);
  const [selected, setSelected] = useState(null);
  const [detail, setDetail] = useState(null);
  const [detailError, setDetailError] = useState("");
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importMessage, setImportMessage] = useState("");
  const detailRequest = useRef(0);
  const params = new URLSearchParams(Object.entries(filters).filter(([, v]) => v));
  const query = params.toString();

  useEffect(() => {
    const abort = new AbortController();
    setLoading(true); setError("");
    const timer = setTimeout(async () => {
      try {
        const response = await fetch(`${API}?${query}&offset=${page * 50}&limit=50`, { headers: adminAuthHeaders(), signal: abort.signal, cache: "no-store" });
        if (!response.ok) throw new Error(response.status === 401 ? "Sesión caducada. Vuelve a iniciar sesión." : "No se pudieron cargar todos los leads. Inténtalo de nuevo.");
        const result = await response.json();
        if (!abort.signal.aborted) setData(result);
      } catch (err) {
        if (!abort.signal.aborted) { setError(err.message); setData(current => ({ ...current, items: [], total: 0 })); }
      } finally { if (!abort.signal.aborted) setLoading(false); }
    }, 250);
    return () => { clearTimeout(timer); abort.abort(); };
  }, [query, page, refresh]);

  const setFilter = (key, value) => { setFilters(current => ({ ...current, [key]: value })); setPage(0); };
  const openLead = async lead => {
    const request = ++detailRequest.current;
    setSelected(lead); setDetail(null); setDetailError("");
    try {
      const response = await fetch(`${API}/${lead.source}/${lead.record_id}`, { headers: adminAuthHeaders(), cache: "no-store" });
      if (!response.ok) throw new Error();
      const result = await response.json();
      if (request === detailRequest.current) setDetail(result);
    } catch { if (request === detailRequest.current) setDetailError("No se pudo cargar la ficha. Cierra y vuelve a intentarlo."); }
  };
  const changeStatus = async status => {
    if (!detail || saving) return;
    setSaving(true); setDetailError("");
    try {
      const response = await fetch(`${API}/${detail.source}/${detail.record_id}`, {
        method: "PATCH", headers: adminAuthHeaders({ "Content-Type": "application/json" }), body: JSON.stringify({ status }),
      });
      if (!response.ok) throw new Error();
      setDetail(await response.json()); setRefresh(value => value + 1);
    } catch { setDetailError("No se pudo guardar el estado. No se ha aplicado el cambio."); }
    finally { setSaving(false); }
  };
  const exportCsv = async () => {
    setExporting(true); setError("");
    try {
      const response = await fetch(`${API}/export?${query}`, { headers: adminAuthHeaders(), cache: "no-store" });
      if (!response.ok) throw new Error();
      const url = URL.createObjectURL(await response.blob());
      const link = document.createElement("a"); link.href = url; link.download = "xaluca-leads.csv";
      link.click(); URL.revokeObjectURL(url);
    } catch { setError("No se pudo exportar el listado completo."); }
    finally { setExporting(false); }
  };
  const importNewsletter = async () => {
    setImporting(true); setImportMessage(""); setError("");
    try {
      const response = await fetch(`${API}/import-newsletter`, { method: "POST", headers: adminAuthHeaders() });
      const result = await response.json();
      if (!response.ok) throw new Error(result.detail || "No se pudo importar la newsletter.");
      setImportMessage(`${result.processed} contactos procesados, sin duplicar los existentes ni modificar las bajas en Resend.`);
      setPage(0); setRefresh(value => value + 1);
    } catch (err) { setError(err.message); }
    finally { setImporting(false); }
  };

  return <div className="p-4 md:p-6 text-white min-w-0" data-testid="admin-leads">
    <div className="flex flex-wrap justify-between gap-4 mb-6">
      <div><p className="text-[#D4A373] uppercase text-xs tracking-[0.2em]">Centro de captación</p><h2 className="font-serif-x text-3xl mt-2 flex items-center gap-3"><Inbox className="w-6 h-6" />Todos los leads</h2>
        <p className="text-sm text-white/60 mt-2">Una única vista de las solicitudes originales, sin duplicar registros.</p></div>
      <div className="flex flex-wrap items-center gap-2"><button className={buttonClass} onClick={() => setRefresh(v => v + 1)} disabled={loading}><RefreshCw className="w-4 h-4" />Recargar</button>
        <button className={buttonClass} disabled={loading || exporting || !data.total} onClick={exportCsv}><Download className="w-4 h-4" />{exporting ? "Exportando…" : "Exportar resultados"}</button></div>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 p-4 border border-white/15 bg-white/[0.03]">
      <label className="text-xs text-white/70">Buscar nombre, email, teléfono o contenido<span className="relative block mt-2"><Search className="absolute left-3 top-3 w-4 h-4" /><input data-testid="admin-leads-search" className={`${fieldClass} pl-9`} value={filters.q} onChange={e => setFilter("q", e.target.value)} placeholder="Nombre, email, +34…" /></span></label>
      <label className="text-xs text-white/70">Tipo de captación<select className={`${fieldClass} mt-2`} value={filters.kind} onChange={e => setFilter("kind", e.target.value)}><option value="">Todos los tipos</option>{Object.entries(data.types).map(([id, label]) => <option key={id} value={id}>{label}</option>)}</select></label>
      <label className="text-xs text-white/70">Estado<select className={`${fieldClass} mt-2`} value={filters.status} onChange={e => setFilter("status", e.target.value)}><option value="">Todos los estados</option>{Object.entries(STATUSES).map(([id, label]) => <option key={id} value={id}>{label}</option>)}</select></label>
      <label className="text-xs text-white/70">Página o URL de origen<input className={`${fieldClass} mt-2`} value={filters.origin} onChange={e => setFilter("origin", e.target.value)} placeholder="/contacto, /viajes/…" /></label>
      <label className="text-xs text-white/70">Desde (UTC)<input type="date" className={`${fieldClass} mt-2 [color-scheme:dark]`} value={filters.date_from} onChange={e => setFilter("date_from", e.target.value)} /></label>
      <label className="text-xs text-white/70">Hasta (UTC)<input type="date" className={`${fieldClass} mt-2 [color-scheme:dark]`} value={filters.date_to} onChange={e => setFilter("date_to", e.target.value)} /></label>
      <button className={`${buttonClass} sm:col-span-2 xl:col-span-3 justify-self-start`} onClick={() => { setFilters(EMPTY); setPage(0); }}>Limpiar filtros</button>
    </div>
    <p className="text-xs text-white/50 mt-4">Los registros antiguos muestran solo el contexto que se guardó en su momento. La integración de citas requiere activar el webhook de Calendly. El estado de newsletter vigente se gestiona en Resend.</p>
    <details className="mt-3 text-sm border border-white/10 p-3"><summary className="cursor-pointer text-[#D4A373]">Recuperar newsletter anterior a esta actualización</summary><p className="text-white/60 my-3">Importa únicamente el segmento newsletter configurado en la API. No envía emails ni modifica altas o bajas en Resend; los contactos existentes no se duplican.</p><button className={buttonClass} disabled={importing} onClick={importNewsletter}>{importing ? "Importando…" : "Importar histórico de Resend"}</button>{importMessage && <p role="status" className="mt-3">{importMessage}</p>}</details>
    {error && <p role="alert" className="my-4 text-[#F2A18B]">{error}</p>}
    <p role="status" className="my-5 text-sm text-white/65">{loading ? "Cargando leads…" : `${data.total} resultados · ${data.all_total} registros en total`}</p>
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-3" aria-busy={loading}>
      {!loading && data.items.map(lead => <article key={lead.id} className="min-w-0 border border-white/15 bg-white/[0.02] p-4" data-testid="admin-lead-row">
        <div className="flex flex-wrap justify-between gap-2"><span className="text-xs text-[#D4A373]">{lead.type_label}</span><span className="text-xs border border-white/20 px-2 py-1">{STATUSES[lead.status] || lead.status}</span></div>
        <h3 className="font-serif-x text-xl mt-3 break-words">{lead.full_name || "Nombre no facilitado"}</h3>
        <div className="text-sm mt-2 space-y-1 [overflow-wrap:anywhere]">{lead.email && <p><a className="hover:underline" href={`mailto:${lead.email}`}>{lead.email}</a></p>}{lead.phone && <p><a className="hover:underline" href={`tel:${lead.phone}`}>{lead.phone}</a></p>}</div>
        <p className="text-xs text-white/50 mt-3">{dateLabel(lead.created_at)}</p>
        <p className="text-sm text-white/65 mt-2 break-words [overflow-wrap:anywhere]">Origen: {lead.source_url || lead.source_label || "No registrado"}</p>
        {lead.trip && <p className="text-sm text-[#D4A373] mt-2 break-words">{lead.trip}</p>}
        {lead.delivery_status === "failed" && <p className="text-sm text-[#F2A18B] mt-2">Guardado · Notificación por email pendiente</p>}
        {lead.subscription_sync === "failed" && <p className="text-sm text-[#F2A18B] mt-2">Guardado · Alta en Resend no confirmada</p>}
        <button className={`${buttonClass} mt-4 w-full sm:w-auto`} onClick={() => openLead(lead)}><Eye className="w-4 h-4" />Ver ficha</button>
      </article>)}
    </div>
    {!loading && !error && !data.items.length && <p className="py-12 text-center text-white/60">No hay leads que coincidan con estos filtros.</p>}
    <nav aria-label="Páginas de leads" className="flex flex-wrap items-center justify-between gap-3 mt-6"><button className={buttonClass} disabled={loading || !page} onClick={() => setPage(v => v - 1)}>Anterior</button><span className="text-sm">Página {page + 1} de {Math.max(1, Math.ceil(data.total / 50))}</span><button className={buttonClass} disabled={loading || (page + 1) * 50 >= data.total} onClick={() => setPage(v => v + 1)}>Siguiente</button></nav>
    <Dialog open={Boolean(selected)} onOpenChange={open => { if (!open && !saving) { ++detailRequest.current; setSelected(null); setDetail(null); } }}>
      <DialogContent className="bg-[#1A1513] text-white border-white/20 w-[calc(100%-2rem)] max-w-3xl max-h-[90dvh] overflow-y-auto" closeLabel="Cerrar ficha">
        <DialogTitle className="font-serif-x text-2xl pr-6 break-words">{selected?.full_name || "Ficha del lead"}</DialogTitle>
        <DialogDescription className="text-white/60">{selected?.type_label} · {dateLabel(selected?.created_at)}</DialogDescription>
        {detailError && <p role="alert" className="text-[#F2A18B]">{detailError}</p>}
        {!detail && !detailError && <p role="status">Cargando ficha completa…</p>}
        {detail && <>
          <label className="text-sm">Estado del lead<select data-testid="lead-status" disabled={saving} className={`${fieldClass} mt-2`} value={detail.status} onChange={e => changeStatus(e.target.value)}>{Object.entries(STATUSES).map(([id, label]) => <option key={id} value={id}>{label}</option>)}</select></label>
          <p className="text-xs text-white/50">Archivar conserva la solicitud. Cambiar este estado no suscribe ni da de baja al contacto en Resend.</p>
          {safeLink(detail.source_url) && <a href={safeLink(detail.source_url)} target="_blank" rel="noopener noreferrer" className="text-[#D4A373] underline">Abrir página de origen</a>}
          <dl className="divide-y divide-white/10 min-w-0">{Object.entries(detail.details || {}).filter(([key, value]) => visible(value) && !["id", "email_lower", "lead_status", "status"].includes(key)).map(([key, value]) => <div key={key} className="py-3 grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] gap-2"><dt className="text-xs text-[#D4A373]">{LABELS[key] || key.replaceAll("_", " ")}</dt><dd className="min-w-0 text-sm">{key === "preferred_contact" ? contactPrefLabel(value, "es") : <DataValue value={value} />}</dd></div>)}</dl>
        </>}
      </DialogContent>
    </Dialog>
  </div>;
}
