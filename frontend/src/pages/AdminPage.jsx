import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  Search, Save, ExternalLink, RefreshCw, Image as ImageIcon, Type, Layout,
  Monitor, Tablet, Smartphone, ChevronDown, ChevronRight, Filter, Globe, X,
} from "lucide-react";
import { ROUTES, pathFor } from "@/lib/routes";

const API = process.env.REACT_APP_BACKEND_URL + "/api";

const LANGS = ["es", "en", "fr"];
const DEVICES = [
  { id: "desktop", icon: Monitor,    label: "Desktop", w: "100%",  h: "100%" },
  { id: "tablet",  icon: Tablet,     label: "Tablet",  w: "820px", h: "1180px" },
  { id: "mobile",  icon: Smartphone, label: "Mobile",  w: "390px", h: "844px" },
];

/* ============================================================
   /admin · centralised content dashboard
   ----------------------------------------------------------
   - URL list pulled from lib/routes (single source of truth).
   - Slot browser pulled from /api/slots (images) and
     /api/text_slots (texts), each editable inline + saved
     immediately to the same PUT endpoints used by the in-page
     CMS. Result: every existing EditableImage / EditableText
     across the site is mass-editable from one screen.
   - Live preview iframe re-renders on save (refresh trigger).
============================================================ */
export default function AdminPage() {
  const [tab, setTab]            = useState("urls"); // urls | images | texts
  const [query, setQuery]        = useState("");
  const [selectedRoute, setRoute] = useState("home");
  const [previewLang, setLang]   = useState("es");
  const [device, setDevice]      = useState("desktop");
  const [imageSlots, setImageSlots] = useState([]);
  const [textSlots, setTextSlots]   = useState([]);
  const [loading, setLoading]    = useState(false);
  const [previewKey, bumpPreview] = useState(0);
  const [collapsed, setCollapsed] = useState({});

  useEffect(() => { document.title = "Admin · Xaluca CMS"; }, []);

  const fetchSlots = useCallback(async () => {
    setLoading(true);
    try {
      const [imgRes, txtRes] = await Promise.all([
        fetch(`${API}/slots`).then((r) => r.json()).catch(() => ({ slots: [] })),
        fetch(`${API}/text_slots`).then((r) => r.json()).catch(() => ({ slots: [] })),
      ]);
      setImageSlots(imgRes.slots || []);
      setTextSlots(txtRes.slots || []);
    } finally { setLoading(false); }
  }, []);
  useEffect(() => { fetchSlots(); }, [fetchSlots]);

  const previewSrc = useMemo(
    () => pathFor(previewLang, selectedRoute) + `?_admin=1#k=${previewKey}`,
    [previewLang, selectedRoute, previewKey]
  );
  const dev = DEVICES.find((d) => d.id === device);

  // ---- URLs grouped by namespace prefix (route key)
  const allRoutes = useMemo(() => Object.keys(ROUTES), []);
  const filteredRoutes = useMemo(
    () => allRoutes.filter((r) => r.toLowerCase().includes(query.toLowerCase())),
    [allRoutes, query]
  );
  const routeGroups = useMemo(() => {
    const groups = {};
    filteredRoutes.forEach((r) => {
      const key = r.startsWith("tour") ? "tours" : r.startsWith("legal") ? "legal" : "core";
      (groups[key] ||= []).push(r);
    });
    return groups;
  }, [filteredRoutes]);

  // ---- Image / text slot grouping by id prefix (e.g. "home.cat.magic-south.image-0")
  const groupSlots = (slots) => {
    const m = {};
    slots.forEach((s) => {
      const top = (s.slot_id || s.id || "").split(".")[0] || "other";
      (m[top] ||= []).push(s);
    });
    return m;
  };
  const filteredImages = useMemo(
    () => imageSlots.filter((s) => (s.slot_id || "").toLowerCase().includes(query.toLowerCase())),
    [imageSlots, query]
  );
  const filteredTexts = useMemo(
    () => textSlots.filter((s) =>
      (s.slot_id || s.id || "").toLowerCase().includes(query.toLowerCase()) ||
      JSON.stringify(s.values || s.value || "").toLowerCase().includes(query.toLowerCase())
    ),
    [textSlots, query]
  );
  const imageGroups = useMemo(() => groupSlots(filteredImages), [filteredImages]);
  const textGroups  = useMemo(() => groupSlots(filteredTexts),  [filteredTexts]);

  const saveImage = async (slot_id, url) => {
    await fetch(`${API}/slots/${encodeURIComponent(slot_id)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, source: "admin" }),
    });
    bumpPreview((k) => k + 1);
    fetchSlots();
  };
  const saveText = async (slot_id, values) => {
    await fetch(`${API}/text_slots/${encodeURIComponent(slot_id)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ values }),
    });
    bumpPreview((k) => k + 1);
    fetchSlots();
  };

  return (
    <div data-testid="admin-page" className="min-h-screen bg-[#0F0D0B] text-[#FDFBF7]">
      {/* Top bar */}
      <header className="sticky top-0 z-30 bg-[#14110F] border-b border-white/10 px-4 md:px-6 py-3 flex items-center gap-4">
        <div className="flex items-center gap-2 text-[11px] tracking-[0.3em] uppercase text-[#D4A373]">
          <Layout className="w-4 h-4" strokeWidth={1.6} />
          Xaluca · Admin
        </div>
        <div className="flex-1 max-w-xl ml-4 flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-2">
          <Search className="w-4 h-4 text-white/50" strokeWidth={1.8} />
          <input
            data-testid="admin-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar URL, slot, contenido…"
            className="bg-transparent outline-none flex-1 text-sm placeholder:text-white/40"
          />
          {query && <button onClick={() => setQuery("")} className="text-white/50 hover:text-white"><X className="w-3.5 h-3.5" /></button>}
        </div>
        <button
          data-testid="admin-refresh"
          onClick={fetchSlots}
          className="inline-flex items-center gap-2 text-[10px] tracking-[0.22em] uppercase border border-white/15 px-3 py-2 hover:bg-white/5"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} strokeWidth={1.8} />
          {loading ? "Loading…" : "Refresh"}
        </button>
        <a
          href={pathFor(previewLang, selectedRoute)}
          target="_blank" rel="noreferrer"
          className="inline-flex items-center gap-2 text-[10px] tracking-[0.22em] uppercase bg-[#C16542] hover:bg-[#A8533A] px-3 py-2"
        >
          <ExternalLink className="w-3.5 h-3.5" strokeWidth={1.8} /> Open page
        </a>
      </header>

      {/* Body */}
      <div className="grid grid-cols-12 gap-0 min-h-[calc(100vh-56px)]">
        {/* Left rail */}
        <aside className="col-span-12 md:col-span-3 lg:col-span-2 border-r border-white/10 bg-[#14110F]">
          <nav className="p-3 flex md:flex-col gap-1">
            {[
              { id: "urls",   label: "URLs",          icon: Globe },
              { id: "images", label: `Images (${imageSlots.length})`, icon: ImageIcon },
              { id: "texts",  label: `Texts (${textSlots.length})`,  icon: Type },
            ].map((t) => {
              const Icon = t.icon;
              const active = tab === t.id;
              return (
                <button
                  key={t.id}
                  data-testid={`admin-tab-${t.id}`}
                  onClick={() => setTab(t.id)}
                  className={`inline-flex items-center gap-2 px-3 py-2 text-[11px] tracking-[0.22em] uppercase transition-colors ${
                    active ? "bg-[#C16542] text-white" : "text-white/75 hover:bg-white/5"
                  }`}
                >
                  <Icon className="w-4 h-4" strokeWidth={1.6} /> {t.label}
                </button>
              );
            })}
          </nav>
          <div className="p-3 border-t border-white/10">
            <p className="text-[9px] tracking-[0.28em] uppercase text-white/40 mb-2 flex items-center gap-2">
              <Filter className="w-3 h-3" /> Preview lang
            </p>
            <div className="flex gap-1">
              {LANGS.map((l) => (
                <button
                  key={l}
                  data-testid={`admin-lang-${l}`}
                  onClick={() => setLang(l)}
                  className={`flex-1 py-1.5 text-[10px] tracking-[0.22em] uppercase border ${
                    previewLang === l ? "bg-[#C16542] border-transparent" : "border-white/15 text-white/70 hover:bg-white/5"
                  }`}
                >{l}</button>
              ))}
            </div>
          </div>
        </aside>

        {/* Middle: lists */}
        <section className="col-span-12 md:col-span-4 lg:col-span-4 border-r border-white/10 overflow-y-auto max-h-[calc(100vh-56px)]">
          {tab === "urls" && (
            <div data-testid="admin-url-list" className="p-4 space-y-4">
              {Object.entries(routeGroups).map(([group, routes]) => (
                <div key={group}>
                  <button
                    onClick={() => setCollapsed((c) => ({ ...c, [group]: !c[group] }))}
                    className="w-full flex items-center gap-2 text-[10px] tracking-[0.28em] uppercase text-[#D4A373] mb-2"
                  >
                    {collapsed[group] ? <ChevronRight className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    {group} · {routes.length}
                  </button>
                  {!collapsed[group] && (
                    <ul className="space-y-0.5">
                      {routes.map((r) => (
                        <li key={r}>
                          <button
                            data-testid={`admin-route-${r}`}
                            onClick={() => setRoute(r)}
                            className={`w-full text-left px-3 py-2 text-sm flex items-center justify-between ${
                              selectedRoute === r ? "bg-[#C16542]/20 text-white" : "text-white/70 hover:bg-white/5"
                            }`}
                          >
                            <span className="truncate">{r}</span>
                            <span className="text-[10px] text-white/40 ml-2 truncate">{pathFor(previewLang, r)}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}

          {tab === "images" && (
            <div data-testid="admin-image-list" className="p-4 space-y-5">
              {Object.entries(imageGroups).sort().map(([prefix, slots]) => (
                <div key={prefix}>
                  <h3 className="text-[10px] tracking-[0.28em] uppercase text-[#D4A373] mb-2">{prefix} · {slots.length}</h3>
                  <ul className="space-y-3">
                    {slots.map((s) => (
                      <ImageEditor key={s.slot_id} slot={s} onSave={saveImage} />
                    ))}
                  </ul>
                </div>
              ))}
              {filteredImages.length === 0 && (
                <p className="text-sm text-white/50">Sin imágenes guardadas todavía. Cualquier `EditableImage` editada en la web aparecerá aquí.</p>
              )}
            </div>
          )}

          {tab === "texts" && (
            <div data-testid="admin-text-list" className="p-4 space-y-5">
              {Object.entries(textGroups).sort().map(([prefix, slots]) => (
                <div key={prefix}>
                  <h3 className="text-[10px] tracking-[0.28em] uppercase text-[#D4A373] mb-2">{prefix} · {slots.length}</h3>
                  <ul className="space-y-3">
                    {slots.map((s) => (
                      <TextEditor key={s.slot_id || s.id} slot={s} onSave={saveText} />
                    ))}
                  </ul>
                </div>
              ))}
              {filteredTexts.length === 0 && (
                <p className="text-sm text-white/50">Sin textos guardados todavía. Cualquier `EditableText` editado en la web aparecerá aquí.</p>
              )}
            </div>
          )}
        </section>

        {/* Right: live preview */}
        <section className="col-span-12 md:col-span-5 lg:col-span-6 bg-[#0F0D0B] flex flex-col">
          <div className="border-b border-white/10 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-[10px] tracking-[0.28em] uppercase text-white/60">
              <Layout className="w-3.5 h-3.5" /> Live preview · {selectedRoute}
            </div>
            <div className="flex items-center gap-1 bg-white/5 p-1">
              {DEVICES.map((d) => {
                const Icon = d.icon;
                return (
                  <button
                    key={d.id}
                    data-testid={`admin-device-${d.id}`}
                    onClick={() => setDevice(d.id)}
                    aria-label={d.label}
                    className={`p-2 transition-colors ${device === d.id ? "bg-[#C16542] text-white" : "text-white/60 hover:bg-white/10"}`}
                  >
                    <Icon className="w-4 h-4" strokeWidth={1.7} />
                  </button>
                );
              })}
            </div>
          </div>
          <div className="flex-1 overflow-auto bg-[#1A1513] p-3 md:p-6 flex items-start justify-center">
            <div
              data-testid="admin-preview-frame"
              className="bg-white shadow-2xl transition-all duration-300"
              style={{ width: dev.w, maxWidth: "100%", height: dev.id === "desktop" ? "100%" : dev.h, minHeight: 600 }}
            >
              <iframe
                key={previewKey}
                title="Live preview"
                src={previewSrc}
                className="w-full h-full border-0"
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

/* ---------- Image editor row ---------- */
const ImageEditor = ({ slot, onSave }) => {
  const [url, setUrl] = useState(slot.url || "");
  const [busy, setBusy] = useState(false);
  const dirty = url !== (slot.url || "");
  const save = async () => {
    setBusy(true);
    try { await onSave(slot.slot_id, url); } finally { setBusy(false); }
  };
  return (
    <li data-testid={`admin-image-${slot.slot_id}`} className="bg-white/[0.04] border border-white/10 p-3 flex gap-3">
      <div className="w-20 h-20 flex-shrink-0 bg-black/40 overflow-hidden border border-white/10">
        {url ? <img src={url} alt={slot.alt || ""} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-white/30"><ImageIcon className="w-5 h-5" /></div>}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] tracking-[0.18em] uppercase text-white/55 truncate" title={slot.slot_id}>{slot.slot_id}</p>
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Image URL (https://…)"
          className="mt-2 w-full bg-white/5 border border-white/10 px-2 py-1.5 text-xs text-white/90 outline-none focus:border-[#D4A373]"
        />
        <div className="mt-2 flex items-center justify-between gap-2">
          <span className="text-[9px] tracking-[0.22em] uppercase text-white/40">{slot.source || "external"}</span>
          <button
            onClick={save}
            disabled={!dirty || busy}
            data-testid={`admin-save-image-${slot.slot_id}`}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] tracking-[0.2em] uppercase transition-colors ${
              dirty && !busy ? "bg-[#C16542] hover:bg-[#A8533A] text-white" : "bg-white/5 text-white/30 cursor-not-allowed"
            }`}
          >
            <Save className="w-3 h-3" strokeWidth={2} /> {busy ? "…" : "Save"}
          </button>
        </div>
      </div>
    </li>
  );
};

/* ---------- Text editor row ----------
   text_slots store either { value: "..." } (single string) or
   { values: { es, en, fr } } (i18n object). We support both. */
const TextEditor = ({ slot, onSave }) => {
  const isI18n = slot.values && typeof slot.values === "object";
  const [vals, setVals] = useState(isI18n
    ? { es: slot.values.es || "", en: slot.values.en || "", fr: slot.values.fr || "" }
    : { es: slot.value || "", en: "", fr: "" });
  const [busy, setBusy] = useState(false);
  const dirty = isI18n
    ? (vals.es !== (slot.values.es || "") || vals.en !== (slot.values.en || "") || vals.fr !== (slot.values.fr || ""))
    : vals.es !== (slot.value || "");

  const save = async () => {
    setBusy(true);
    try { await onSave(slot.slot_id || slot.id, vals); } finally { setBusy(false); }
  };

  return (
    <li data-testid={`admin-text-${slot.slot_id || slot.id}`} className="bg-white/[0.04] border border-white/10 p-3">
      <p className="text-[10px] tracking-[0.18em] uppercase text-white/55 truncate" title={slot.slot_id || slot.id}>
        {slot.slot_id || slot.id}
      </p>
      <div className="mt-2 space-y-1.5">
        {LANGS.map((l) => (
          <div key={l} className="flex items-start gap-2">
            <span className="text-[9px] tracking-[0.2em] uppercase text-[#D4A373] w-6 pt-1.5">{l}</span>
            <textarea
              value={vals[l]}
              onChange={(e) => setVals((v) => ({ ...v, [l]: e.target.value }))}
              rows={Math.max(1, Math.min(4, (vals[l] || "").length / 80 + 1))}
              className="flex-1 bg-white/5 border border-white/10 px-2 py-1.5 text-xs text-white/90 outline-none focus:border-[#D4A373] resize-y"
            />
          </div>
        ))}
      </div>
      <div className="mt-2 flex justify-end">
        <button
          onClick={save}
          disabled={!dirty || busy}
          data-testid={`admin-save-text-${slot.slot_id || slot.id}`}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] tracking-[0.2em] uppercase transition-colors ${
            dirty && !busy ? "bg-[#C16542] hover:bg-[#A8533A] text-white" : "bg-white/5 text-white/30 cursor-not-allowed"
          }`}
        >
          <Save className="w-3 h-3" strokeWidth={2} /> {busy ? "…" : "Save"}
        </button>
      </div>
    </li>
  );
};
