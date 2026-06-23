import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  Search, Library as LibraryIcon, RefreshCw, Loader2, Plus, Trash2, Save,
  ExternalLink, Check, AlertTriangle, ChevronDown, ChevronRight, MapPin, ImageOff, Sparkles,
} from "lucide-react";
import { buildLibraryIndex } from "@/lib/libraryIndex";
import { ZONES } from "@/lib/poiZones";
import { pathFor } from "@/lib/routes";
import { useLanguage, pick } from "@/contexts/LanguageContext";
import ImageLibraryPicker from "@/components/ImageLibraryPicker";

const API = process.env.REACT_APP_BACKEND_URL + "/api";

const KIND_LABEL = {
  town: "Ciudad", village: "Aldea", kasbah: "Kasbah", site: "Sitio",
  palm: "Palmeral", gorges: "Gargantas", valley: "Valle", mountain: "Montaña",
  dunes: "Dunas", viewpoint: "Mirador", market: "Mercado", music: "Música",
  fossils: "Fósiles", hotel: "Hotel", camp: "Campamento", airport: "Aeropuerto",
};
const ZONE_LABEL = Object.fromEntries(ZONES.map((z) => [z.id, z.label.es]));

/* ============================================================
   LibraryManager — "Library" admin dashboard.
   A centralised, INDEPENDENT destination media library auto-indexed
   from every itinerary. Each location keeps its own gallery (stored in
   `library_locations`) that never affects the curated itinerary
   galleries. Editors add/caption/remove images here as a secondary,
   contextual image pool reusable across the platform.
============================================================ */
export default function LibraryManager() {
  const { lang } = useLanguage();
  const index = useMemo(() => buildLibraryIndex(), []);
  const [locById, setLocById] = useState({});   // id -> backend doc {images,notes,...}
  const [drafts, setDrafts] = useState({});      // id -> {images, notes}
  const [saving, setSaving] = useState({});       // id -> 'saving'|'done'|'error'
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState(false);
  const [q, setQ] = useState("");
  const [kindFilter, setKindFilter] = useState("");
  const [zoneFilter, setZoneFilter] = useState("");
  const [expanded, setExpanded] = useState(null);
  const [picker, setPicker] = useState(null);     // { id, tab?, query? } — gallery being added to

  const fetchAll = useCallback(async () => {
    const res = await fetch(`${API}/library/locations`);
    const data = await res.json();
    const map = {};
    (data.locations || []).forEach((l) => { map[l.id] = l; });
    return map;
  }, []);

  const runSync = useCallback(async () => {
    setSyncing(true);
    try {
      await fetch(`${API}/library/locations/sync`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locations: index }),
      });
      setLocById(await fetchAll());
    } catch {
      setError(true);
    }
    setSyncing(false);
  }, [index, fetchAll]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(false);
      try {
        let map = await fetchAll();
        if (Object.keys(map).length === 0 && index.length) {
          await fetch(`${API}/library/locations/sync`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ locations: index }),
          });
          map = await fetchAll();
        }
        setLocById(map);
      } catch {
        setError(true);
      }
      setLoading(false);
    })();
  }, [index, fetchAll]);

  const imagesOf = (id) => {
    const d = drafts[id];
    if (d && d.images) return d.images;
    return (locById[id] && locById[id].images) || [];
  };
  const notesOf = (id) => {
    const d = drafts[id];
    if (d && "notes" in d) return d.notes;
    return (locById[id] && locById[id].notes) || "";
  };
  const setDraft = (id, patch) =>
    setDrafts((p) => ({ ...p, [id]: { images: imagesOf(id), notes: notesOf(id), ...p[id], ...patch } }));

  const removeImage = (id, imgId) =>
    setDraft(id, { images: imagesOf(id).filter((im) => (im.id || im.url) !== imgId) });
  const setCaption = (id, imgId, caption) =>
    setDraft(id, { images: imagesOf(id).map((im) => ((im.id || im.url) === imgId ? { ...im, caption } : im)) });

  const onAddImages = (items) => {
    if (!picker) return;
    const id = picker.id;
    const existing = new Set(imagesOf(id).map((im) => im.url));
    const additions = (items || [])
      .filter((it) => it.url && !existing.has(it.url))
      .map((it) => ({
        url: it.url,
        storage_path: it.storage_path || null,
        caption: "",
        source: it._pexelsId != null ? "pexels" : (it.id ? "library" : "upload"),
      }));
    if (additions.length) setDraft(id, { images: [...imagesOf(id), ...additions] });
    setPicker(null);
  };

  const save = async (id) => {
    setSaving((p) => ({ ...p, [id]: "saving" }));
    try {
      const res = await fetch(`${API}/library/locations/${encodeURIComponent(id)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ images: imagesOf(id), notes: notesOf(id) }),
      });
      if (!res.ok) throw new Error("save-failed");
      const doc = await res.json();
      setLocById((p) => ({ ...p, [id]: doc }));
      setDrafts((p) => { const n = { ...p }; delete n[id]; return n; });
      setSaving((p) => ({ ...p, [id]: "done" }));
      setTimeout(() => setSaving((p) => { const n = { ...p }; delete n[id]; return n; }), 1600);
    } catch {
      setSaving((p) => ({ ...p, [id]: "error" }));
      setTimeout(() => setSaving((p) => { const n = { ...p }; delete n[id]; return n; }), 2600);
    }
  };

  // ---- Filters ----
  const ql = q.trim().toLowerCase();
  const rows = useMemo(() => {
    return index.filter((p) => {
      if (kindFilter && p.kind !== kindFilter) return false;
      if (zoneFilter && p.zone !== zoneFilter) return false;
      if (!ql) return true;
      if (p.id.toLowerCase().includes(ql)) return true;
      return ["es", "en", "fr"].some((l) => (p.name[l] || "").toLowerCase().includes(ql));
    });
  }, [index, kindFilter, zoneFilter, ql]);

  const kindsPresent = useMemo(() => {
    const set = new Set(index.map((p) => p.kind).filter(Boolean));
    return Array.from(set).sort((a, b) => (KIND_LABEL[a] || a).localeCompare(KIND_LABEL[b] || b, "es"));
  }, [index]);

  const totalImages = useMemo(
    () => Object.values(locById).reduce((n, d) => n + ((d.images || []).length), 0),
    [locById]
  );

  return (
    <div data-testid="admin-library-panel" className="p-4 md:p-6 text-white">
      {/* Header */}
      <div className="flex flex-wrap items-center gap-3 mb-2">
        <h2 className="inline-flex items-center gap-2 text-lg font-serif-x">
          <LibraryIcon className="w-5 h-5 text-[#D4A373]" strokeWidth={1.7} /> Library · Medios de destinos
        </h2>
        <span data-testid="admin-library-count" className="text-[10px] tracking-[0.18em] uppercase text-white/50">
          {rows.length}/{index.length} lugares · {totalImages} imágenes
        </span>
        <button
          type="button"
          onClick={runSync}
          data-testid="admin-library-sync"
          title="Re-indexar itinerarios"
          className="ml-auto inline-flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase border border-white/15 px-3 py-2 hover:bg-white/5 disabled:opacity-40"
          disabled={syncing}
        >
          <RefreshCw className={`w-3.5 h-3.5 ${syncing ? "animate-spin" : ""}`} strokeWidth={1.8} /> Re-indexar
        </button>
      </div>
      <p className="text-[11px] text-white/40 mb-4 max-w-2xl">
        Biblioteca independiente de imágenes de destinos, indexada automáticamente desde los itinerarios.
        No afecta a las galerías curadas de los viajes — es una fuente secundaria de imágenes contextuales.
      </p>

      {/* Search + filters */}
      <div className="relative mb-3 max-w-xl">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" strokeWidth={1.8} />
        <input
          data-testid="admin-library-search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar lugar (ciudad, hotel, kasbah, mirador…)"
          className="w-full bg-[#14110F] border border-white/15 pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-white/35 focus:outline-none focus:border-[#C16542]"
        />
      </div>
      <div className="flex flex-wrap gap-1.5 mb-3">
        <FilterChip active={!kindFilter} onClick={() => setKindFilter("")} testid="lib-kind-all">Todos los tipos</FilterChip>
        {kindsPresent.map((k) => (
          <FilterChip key={k} active={kindFilter === k} onClick={() => setKindFilter(kindFilter === k ? "" : k)} testid={`lib-kind-${k}`}>
            {KIND_LABEL[k] || k}
          </FilterChip>
        ))}
      </div>
      <div className="flex flex-wrap gap-1.5 mb-5">
        <FilterChip active={!zoneFilter} onClick={() => setZoneFilter("")} testid="lib-zone-all">Todas las zonas</FilterChip>
        {ZONES.map((z) => (
          <FilterChip key={z.id} active={zoneFilter === z.id} onClick={() => setZoneFilter(zoneFilter === z.id ? "" : z.id)} testid={`lib-zone-${z.id}`}>
            {z.label.es}
          </FilterChip>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-sm text-white/60">
          <Loader2 className="w-4 h-4 animate-spin" strokeWidth={1.8} /> Indexando itinerarios…
        </div>
      ) : error ? (
        <p className="text-sm text-[#E07856]">No se pudo cargar la Library.</p>
      ) : rows.length === 0 ? (
        <p data-testid="admin-library-empty" className="text-sm text-white/55">Ningún lugar coincide con el filtro.</p>
      ) : (
        <div className="space-y-2.5 max-w-4xl">
          {rows.map((p) => {
            const imgs = imagesOf(p.id);
            const isOpen = expanded === p.id;
            const dirty = !!drafts[p.id];
            const st = saving[p.id];
            return (
              <section key={p.id} data-testid={`library-location-${p.id}`} className="border border-white/10 bg-[#14110F]">
                <button
                  type="button"
                  onClick={() => setExpanded(isOpen ? null : p.id)}
                  data-testid={`library-location-toggle-${p.id}`}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/[0.03] text-left"
                >
                  {isOpen ? <ChevronDown className="w-4 h-4 text-[#D4A373] shrink-0" /> : <ChevronRight className="w-4 h-4 text-white/45 shrink-0" />}
                  <span className="font-serif-x text-[15px] text-white truncate">{pick(p.name, lang) || p.id}</span>
                  <span className="text-[9px] tracking-[0.18em] uppercase text-[#D4A373] border border-[#D4A373]/30 px-1.5 py-0.5 shrink-0">
                    {KIND_LABEL[p.kind] || p.kind || "—"}
                  </span>
                  <span className="text-[10px] text-white/40 shrink-0 hidden sm:inline">{ZONE_LABEL[p.zone] || p.zone}</span>
                  <span className="ml-auto flex items-center gap-3 shrink-0 text-[10px] tracking-[0.14em] uppercase text-white/45">
                    <span className={imgs.length ? "text-[#D4A373]" : "text-white/30"}>{imgs.length} img</span>
                    <span>{p.trips.length} itin.</span>
                  </span>
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 pt-1 border-t border-white/8">
                    {/* Trips referencing this location */}
                    {p.trips.length > 0 && (
                      <div className="mb-4">
                        <p className="text-[9px] tracking-[0.24em] uppercase text-white/40 mb-1.5">Aparece en {p.trips.length} itinerarios</p>
                        <div className="flex flex-wrap gap-1.5">
                          {p.trips.map((t) => (
                            <a
                              key={t.routeId}
                              href={pathFor(lang, t.routeId)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-[10px] text-white/70 border border-white/12 px-2 py-1 hover:border-[#C16542] hover:text-white"
                            >
                              {pick(t.title, lang) || t.routeId}
                              <ExternalLink className="w-2.5 h-2.5" strokeWidth={2} />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Gallery */}
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <p className="text-[9px] tracking-[0.24em] uppercase text-white/40 inline-flex items-center gap-1.5">
                        <MapPin className="w-3 h-3" /> Galería · {imgs.length} imágenes
                      </p>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setPicker({ id: p.id, tab: "pexels", query: `${pick(p.name, "es") || p.id} Marruecos` })}
                          data-testid={`library-suggest-images-${p.id}`}
                          title="Buscar imágenes en Pexels por el nombre del lugar"
                          className="inline-flex items-center gap-1.5 text-[10px] tracking-[0.18em] uppercase border border-[#D4A373]/40 text-[#D4A373] px-2.5 py-1.5 hover:bg-[#D4A373]/10"
                        >
                          <Sparkles className="w-3.5 h-3.5" strokeWidth={1.8} /> Sugerir imágenes
                        </button>
                        <button
                          type="button"
                          onClick={() => setPicker({ id: p.id })}
                          data-testid={`library-add-images-${p.id}`}
                          className="inline-flex items-center gap-1.5 text-[10px] tracking-[0.18em] uppercase border border-white/15 px-2.5 py-1.5 hover:bg-white/5"
                        >
                          <Plus className="w-3.5 h-3.5" strokeWidth={2} /> Añadir imágenes
                        </button>
                      </div>
                    </div>

                    {imgs.length === 0 ? (
                      <p className="flex items-center gap-2 text-[12px] text-white/40 py-4">
                        <ImageOff className="w-4 h-4" strokeWidth={1.6} /> Sin imágenes todavía. Añade desde la biblioteca o Pexels.
                      </p>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                        {imgs.map((im) => {
                          const key = im.id || im.url;
                          return (
                            <div key={key} data-testid={`library-image-${p.id}-${key}`} className="group relative border border-white/10 bg-[#0F0D0B]">
                              <div className="aspect-[4/3] overflow-hidden bg-black/30">
                                <img src={im.url} alt={im.caption || ""} loading="lazy" className="w-full h-full object-cover" />
                              </div>
                              <button
                                type="button"
                                onClick={() => removeImage(p.id, key)}
                                data-testid={`library-remove-image-${p.id}-${key}`}
                                title="Quitar"
                                className="absolute top-1.5 right-1.5 w-7 h-7 inline-flex items-center justify-center bg-black/60 hover:bg-[#A35133] text-white opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <Trash2 className="w-3.5 h-3.5" strokeWidth={1.8} />
                              </button>
                              <input
                                value={im.caption || ""}
                                onChange={(e) => setCaption(p.id, key, e.target.value)}
                                data-testid={`library-caption-${p.id}-${key}`}
                                placeholder="Pie de foto…"
                                className="w-full bg-transparent border-t border-white/10 px-2 py-1.5 text-[11px] text-white/85 placeholder:text-white/30 focus:outline-none focus:bg-white/5"
                              />
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Notes + Save */}
                    <div className="mt-4 flex flex-col sm:flex-row sm:items-end gap-3">
                      <label className="flex-1 block">
                        <span className="block text-[9px] tracking-[0.24em] uppercase text-white/40 mb-1">Notas / metadatos</span>
                        <textarea
                          value={notesOf(p.id)}
                          onChange={(e) => setDraft(p.id, { notes: e.target.value })}
                          data-testid={`library-notes-${p.id}`}
                          rows={2}
                          className="w-full bg-[#0F0D0B] border border-white/15 px-3 py-2 text-[12px] text-white/90 focus:outline-none focus:border-[#C16542] resize-y"
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => save(p.id)}
                        disabled={!dirty || st === "saving"}
                        data-testid={`library-save-${p.id}`}
                        className={`inline-flex items-center gap-1.5 text-[10px] tracking-[0.18em] uppercase px-4 py-2.5 transition-colors ${
                          dirty ? "bg-[#C16542] hover:bg-[#A35133] text-white" : "border border-white/15 text-white/40"
                        }`}
                      >
                        {st === "saving" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> :
                         st === "done" ? <Check className="w-3.5 h-3.5" strokeWidth={2.2} /> :
                         st === "error" ? <AlertTriangle className="w-3.5 h-3.5" strokeWidth={2} /> :
                         <Save className="w-3.5 h-3.5" strokeWidth={1.8} />}
                        {st === "done" ? "Guardado" : st === "error" ? "Error" : "Guardar"}
                      </button>
                    </div>
                  </div>
                )}
              </section>
            );
          })}
        </div>
      )}

      {picker && (
        <ImageLibraryPicker
          open={!!picker}
          multiple
          initialTab={picker.tab}
          initialQuery={picker.query}
          onClose={() => setPicker(null)}
          onSelect={(item) => onAddImages([item])}
          onSelectMany={(items) => onAddImages(items)}
        />
      )}
    </div>
  );
}

const FilterChip = ({ active, onClick, children, testid }) => (
  <button
    type="button"
    onClick={onClick}
    data-testid={testid}
    className={`text-[10px] tracking-[0.16em] uppercase px-2.5 py-1.5 border transition-colors ${
      active ? "bg-[#C16542] border-transparent text-white" : "border-white/15 text-white/60 hover:bg-white/5"
    }`}
  >
    {children}
  </button>
);
