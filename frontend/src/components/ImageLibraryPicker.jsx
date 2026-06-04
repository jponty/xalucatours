import React, { useEffect, useState, useCallback, useRef, useMemo } from "react";
import {
  Library, Search, X, Loader2, Check, AlertCircle, UploadCloud,
  Trash2, Pencil, Replace, Tag, ChevronRight, Eye, ExternalLink, Sparkles, FolderUp, Compass,
} from "lucide-react";
import PexelsTab from "@/components/PexelsTab";
import UnsplashTab from "@/components/UnsplashTab";
import PexelsSelectionTab from "@/components/PexelsSelectionTab";

const API = process.env.REACT_APP_BACKEND_URL || "";

/* ============================================================
   <ImageLibraryPicker />
   ----
   Image-library modal with full management capabilities:
     · grid of every uploaded photo (search + tag filter chips)
     · bulk upload (drop several images at once)
     · click → reuse the photo in the current slot
     · per-thumb hover actions: replace · rename + tags · delete
============================================================ */
const TAB_STORAGE_KEY = "xaluca_image_picker_tab";
const VALID_TABS = ["library", "pexels", "unsplash", "pexels-selection"];

export default function ImageLibraryPicker({ open, onClose, onSelect }) {
  // Remember the last used tab locally so reopening the picker lands on it.
  const [tab, setTab] = useState(() => {
    try {
      const saved = localStorage.getItem(TAB_STORAGE_KEY);
      if (saved && VALID_TABS.includes(saved)) return saved;
    } catch { /* ignore */ }
    return "library";
  });
  useEffect(() => {
    try { localStorage.setItem(TAB_STORAGE_KEY, tab); } catch { /* ignore */ }
  }, [tab]);
  const [items, setItems] = useState([]);
  const [tags, setTags] = useState([]);
  const [activeTag, setActiveTag] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [q, setQ] = useState("");
  const [debounced, setDebounced] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [refreshTick, setRefreshTick] = useState(0);
  const [editing, setEditing] = useState(null); // {id, original_filename, tags, ...}
  const [confirmDelete, setConfirmDelete] = useState(null); // item to confirm
  const [usageById, setUsageById] = useState({}); // {id: count}
  const [folderProgress, setFolderProgress] = useState(null); // {done, total, tag}
  const bulkInputRef = useRef(null);
  const folderInputRef = useRef(null);
  const replaceInputRef = useRef(null);
  const replaceForIdRef = useRef(null);

  /* Callback ref: set the directory-picker attributes the moment the
     hidden input mounts (the modal is conditionally rendered, so a
     mount-only useEffect would miss it). */
  const setFolderInput = useCallback((el) => {
    folderInputRef.current = el;
    if (el) {
      el.setAttribute("webkitdirectory", "");
      el.setAttribute("directory", "");
      el.setAttribute("mozdirectory", "");
    }
  }, []);

  /* ---- Debounce search ---- */
  useEffect(() => {
    const id = setTimeout(() => setDebounced(q.trim()), 250);
    return () => clearTimeout(id);
  }, [q]);

  /* ---- Load list ---- */
  useEffect(() => {
    if (!open) return;
    const controller = new AbortController();
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({ limit: "120" });
        if (debounced) params.set("q", debounced);
        if (activeTag) params.set("tag", activeTag);
        const res = await fetch(`${API}/api/files?${params.toString()}`, { signal: controller.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setItems(data.items || []);
        setLoading(false);
      } catch (err) {
        if (err.name === "AbortError") return; // superseded by a newer search
        setError(err.message || "No se pudo cargar la biblioteca.");
        setLoading(false);
      }
    })();
    return () => controller.abort();
  }, [open, debounced, activeTag, refreshTick]);

  /* ---- Load tag chips ---- */
  useEffect(() => {
    if (!open) return;
    fetch(`${API}/api/library/tags`)
      .then((r) => r.json())
      .then((d) => setTags(d.tags || []))
      .catch(() => setTags([]));
  }, [open, refreshTick]);

  /* ---- Load usage counts for visible items in ONE batched request ----
     (one POST for all ids instead of one GET per image, which used to
     saturate the connection pool and freeze the search box). */
  useEffect(() => {
    if (!open || items.length === 0) return;
    const idsToFetch = items
      .map((it) => it.id)
      .filter((id) => id && !(id in usageById));
    if (idsToFetch.length === 0) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`${API}/api/files/usage-batch`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ids: idsToFetch }),
        });
        if (!res.ok) return;
        const data = await res.json();
        const map = data.usage || {};
        if (cancelled) return;
        setUsageById((prev) => {
          const next = { ...prev };
          for (const id of idsToFetch) next[id] = map[id] || { count: 0, slots: [] };
          return next;
        });
      } catch { /* non-critical */ }
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, items]);

  /* ---- Bulk upload (adds to the active tag group when one is filtered) ---- */
  const handleBulkUpload = useCallback(async (fileList) => {
    if (!fileList || fileList.length === 0) return;
    setUploading(true);
    setError(null);
    setUploadResult(null);
    try {
      const fd = new FormData();
      Array.from(fileList).forEach((f) => fd.append("files", f));
      if (activeTag) fd.append("tag", activeTag);   // join the group being viewed
      const res = await fetch(`${API}/api/library/upload`, { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.detail || "Error al subir los archivos.");
      setUploadResult({
        count: data.count || 0,
        skipped: (data.skipped || []).length,
        duplicates: (data.duplicates || []).length,
        tag: activeTag || null,
      });
      setRefreshTick((n) => n + 1);
      setTimeout(() => setUploadResult(null), 4500);
    } catch (err) {
      setError(err.message || "No se pudieron subir los archivos.");
    } finally {
      setUploading(false);
    }
  }, [activeTag]);

  /* ---- Folder import: upload a whole folder, group under its name ---- */
  const slugifyTag = (raw) =>
    (raw || "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9._-]/g, "")
      .slice(0, 40);

  const handleFolderUpload = useCallback(async (fileList) => {
    const IMG_RE = /\.(jpe?g|png|webp|avif)$/i;
    const all = Array.from(fileList || []).filter(
      (f) => (f.type && f.type.startsWith("image/")) || IMG_RE.test(f.name || "")
    );
    if (all.length === 0) {
      setError("La carpeta no contiene imágenes compatibles (JPG, PNG, WEBP o AVIF).");
      return;
    }
    // Folder name = first segment of the relative path of any file.
    const rel = all[0].webkitRelativePath || all[0].name || "";
    const rawFolder = rel.includes("/") ? rel.split("/")[0] : "carpeta";
    const folderTag = slugifyTag(rawFolder) || "carpeta";

    // Chunk by size budget to stay under proxy limits.
    const MAX_BATCH_BYTES = 25 * 1024 * 1024;
    const MAX_BATCH_FILES = 8;
    const batches = [];
    let cur = [];
    let curSize = 0;
    for (const f of all) {
      if (cur.length && (curSize + (f.size || 0) > MAX_BATCH_BYTES || cur.length >= MAX_BATCH_FILES)) {
        batches.push(cur);
        cur = [];
        curSize = 0;
      }
      cur.push(f);
      curSize += f.size || 0;
    }
    if (cur.length) batches.push(cur);

    setUploading(true);
    setError(null);
    setUploadResult(null);
    setFolderProgress({ done: 0, total: all.length, tag: folderTag });

    let uploaded = 0;
    let skipped = 0;
    let dups = 0;
    let done = 0;
    try {
      for (const batch of batches) {
        const fd = new FormData();
        batch.forEach((f) => fd.append("files", f));
        fd.append("tag", rawFolder);
        const res = await fetch(`${API}/api/library/upload`, { method: "POST", body: fd });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.detail || "Error al subir la carpeta.");
        uploaded += data.count || 0;
        skipped += (data.skipped || []).length;
        dups += (data.duplicates || []).length;
        done += batch.length;
        setFolderProgress({ done, total: all.length, tag: folderTag });
      }
      setUploadResult({ count: uploaded, skipped, duplicates: dups, tag: folderTag });
      setActiveTag(folderTag);          // jump straight to the new group
      setRefreshTick((n) => n + 1);
      setTimeout(() => setUploadResult(null), 6000);
    } catch (err) {
      setError(err.message || "No se pudo importar la carpeta.");
    } finally {
      setUploading(false);
      setFolderProgress(null);
    }
  }, []);

  /* ---- Delete ---- */
  const handleDelete = useCallback(async (item) => {
    if (!item?.id) return;
    try {
      const res = await fetch(`${API}/api/files/${item.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setItems((arr) => arr.filter((i) => i.id !== item.id));
      setConfirmDelete(null);
      setUsageById((prev) => { const n = { ...prev }; delete n[item.id]; return n; });
      setUploadResult({ deletedName: item.original_filename || "Imagen" });
      setTimeout(() => setUploadResult(null), 3500);
      setRefreshTick((n) => n + 1);
    } catch (err) {
      setError(err.message || "No se pudo eliminar.");
      setConfirmDelete(null);
    }
  }, []);

  /* ---- Replace (file picker dispatch) ---- */
  const askReplace = useCallback((item) => {
    if (!item?.id) return;
    replaceForIdRef.current = item.id;
    replaceInputRef.current?.click();
  }, []);

  const onReplaceFile = useCallback(async (file) => {
    const id = replaceForIdRef.current;
    replaceForIdRef.current = null;
    if (!file || !id) return;
    setUploading(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch(`${API}/api/files/${id}/replace`, { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.detail || "Error al reemplazar.");
      setRefreshTick((n) => n + 1);
    } catch (err) {
      setError(err.message || "No se pudo reemplazar.");
    } finally {
      setUploading(false);
    }
  }, []);

  /* ---- Save rename + tags ---- */
  const saveEdit = useCallback(async (payload) => {
    if (!editing?.id) return;
    try {
      const res = await fetch(`${API}/api/files/${editing.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.detail || "Error al guardar.");
      setItems((arr) => arr.map((it) => it.id === editing.id
        ? { ...it, original_filename: data.original_filename, tags: data.tags || [] }
        : it
      ));
      setEditing(null);
      setRefreshTick((n) => n + 1);
    } catch (err) {
      setError(err.message || "No se pudo guardar.");
    }
  }, [editing]);

  /* ---- ESC to close ---- */
  const handleKey = useCallback((e) => {
    if (e.key !== "Escape") return;
    if (editing) setEditing(null);
    else onClose?.();
  }, [onClose, editing]);
  useEffect(() => {
    if (!open) return;
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, handleKey]);

  /* ---- Counter line ---- */
  const counterLine = useMemo(() => {
    if (loading) return "Cargando…";
    if (activeTag) return `${items.length} foto${items.length === 1 ? "" : "s"} con #${activeTag}`;
    return `${items.length} foto${items.length === 1 ? "" : "s"} disponibles`;
  }, [loading, items.length, activeTag]);

  /* ---- ESC also closes confirm dialog ---- */
  useEffect(() => {
    if (!confirmDelete) return;
    const onKey = (e) => { if (e.key === "Escape") setConfirmDelete(null); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [confirmDelete]);

  if (!open) return null;

  return (
    <div
      data-testid="image-library-picker"
      role="dialog"
      aria-modal="true"
      aria-label="Biblioteca de imágenes"
      className="fixed inset-0 z-[120] flex items-center justify-center bg-[#1A1513]/85 backdrop-blur-sm p-4 md:p-8"
      onClick={(e) => { if (e.target === e.currentTarget) onClose?.(); }}
    >
      <div className="relative w-full max-w-6xl max-h-[92vh] bg-[#FDFBF7] shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 px-6 md:px-8 py-5 border-b border-[#2C2621]/12">
          <div className="flex items-center gap-3 min-w-0">
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#C16542]/10 text-[#C16542] flex-shrink-0">
              <Library className="w-5 h-5" strokeWidth={1.6} />
            </span>
            <div className="min-w-0">
              <h3 className="font-serif-x text-xl md:text-2xl text-[#2C2621] leading-tight">
                Biblioteca de imágenes
              </h3>
              <p className="text-[11px] tracking-[0.18em] uppercase text-[#5C5248] mt-0.5 truncate">
                {tab === "pexels"
                  ? "Pexels · Stock fotográfico gratuito"
                  : tab === "unsplash"
                  ? "Unsplash · Fotografía editorial gratuita"
                  : tab === "pexels-selection"
                  ? "Selección Pexels · galerías por destino"
                  : counterLine}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {tab === "library" && (
              <button
                type="button"
                onClick={() => bulkInputRef.current?.click()}
                disabled={uploading}
                data-testid="image-library-bulk-upload"
                className="inline-flex items-center gap-2 bg-[#C16542] hover:bg-[#A35133] text-[#FDFBF7] px-4 py-2.5 text-[10px] tracking-[0.25em] uppercase disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >                {uploading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" strokeWidth={1.8} />
                ) : (
                  <UploadCloud className="w-3.5 h-3.5" strokeWidth={1.8} />
                )}
                <span className="hidden sm:inline">{uploading ? "Subiendo…" : "Subir varias"}</span>
              </button>
            )}
            {tab === "library" && (
              <button
                type="button"
                onClick={() => folderInputRef.current?.click()}
                disabled={uploading}
                data-testid="image-library-folder-upload"
                title="Importar una carpeta completa — se agrupa con el nombre de la carpeta"
                className="inline-flex items-center gap-2 border border-[#2C2621]/25 text-[#2C2621] hover:bg-[#2C2621] hover:text-[#FDFBF7] hover:border-[#2C2621] px-4 py-2.5 text-[10px] tracking-[0.25em] uppercase disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <FolderUp className="w-3.5 h-3.5" strokeWidth={1.8} />
                <span className="hidden sm:inline">Subir carpeta</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              data-testid="image-library-close"
              aria-label="Cerrar biblioteca"
              className="inline-flex items-center justify-center w-9 h-9 rounded-full hover:bg-[#2C2621]/10 text-[#2C2621] transition-colors"
            >
              <X className="w-4 h-4" strokeWidth={1.8} />
            </button>
          </div>
        </div>

        {/* ---------- Tabs · Biblioteca local / Pexels ---------- */}
        <div className="px-6 md:px-8 pt-5 bg-[#FDFBF7] border-b border-[#2C2621]/10">
        <div
          role="tablist"
          aria-label="Fuente de imágenes"
          className="flex items-center gap-1 overflow-x-auto whitespace-nowrap -mb-px"
        >
          {[
            { id: "library",  label: "Biblioteca", Icon: Library },
            { id: "pexels",   label: "Pexels",     Icon: Sparkles },
            { id: "unsplash", label: "Unsplash",   Icon: Sparkles },
            { id: "pexels-selection", label: "Selección", Icon: Compass },
          ].map((t) => {
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={active}
                data-testid={`image-library-tab-${t.id}`}
                onClick={() => setTab(t.id)}
                className={`inline-flex items-center gap-2 px-4 py-3 text-[10px] tracking-[0.28em] uppercase border-b-2 transition-colors shrink-0 ${
                  active
                    ? "border-[#C16542] text-[#2C2621]"
                    : "border-transparent text-[#5C5248] hover:text-[#2C2621]"
                }`}
              >
                <t.Icon className="w-3.5 h-3.5" strokeWidth={1.7} />
                {t.label}
              </button>
            );
          })}
        </div>
        </div>

        {tab === "library" ? (
          <>
          {/* Search + tags */}
        <div className="px-6 md:px-8 pt-6 pb-4 border-b border-[#2C2621]/10 bg-[#F8F2E6]/40 space-y-3">
          <label className="flex items-center gap-3 bg-[#FDFBF7] border border-[#2C2621]/15 focus-within:border-[#C16542] px-4 py-2.5 transition-colors">
            <Search className="w-4 h-4 text-[#5C5248] flex-shrink-0" strokeWidth={1.6} />
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar por nombre o tag…"
              data-testid="image-library-search"
              className="flex-1 bg-transparent border-0 outline-none text-sm text-[#2C2621] placeholder-[#5C5248]/60"
            />
            {q && (
              <button type="button" onClick={() => setQ("")} className="text-[#5C5248] hover:text-[#C16542]" aria-label="Limpiar">
                <X className="w-3.5 h-3.5" strokeWidth={1.8} />
              </button>
            )}
          </label>

          {tags.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap" data-testid="image-library-tag-chips">
              <button
                type="button"
                onClick={() => setActiveTag(null)}
                data-testid="image-library-tag-all"
                className={`px-3 py-1 text-[10px] tracking-[0.2em] uppercase border transition-colors ${
                  !activeTag
                    ? "bg-[#2C2621] text-[#FDFBF7] border-[#2C2621]"
                    : "bg-transparent text-[#5C5248] border-[#2C2621]/25 hover:border-[#C16542] hover:text-[#C16542]"
                }`}
              >
                Todas
              </button>
              {tags.map((t) => (
                <button
                  key={t.name}
                  type="button"
                  onClick={() => setActiveTag(activeTag === t.name ? null : t.name)}
                  data-testid={`image-library-tag-${t.name}`}
                  className={`px-3 py-1 text-[10px] tracking-[0.2em] uppercase border transition-colors ${
                    activeTag === t.name
                      ? "bg-[#C16542] text-[#FDFBF7] border-[#C16542]"
                      : "bg-transparent text-[#5C5248] border-[#2C2621]/25 hover:border-[#C16542] hover:text-[#C16542]"
                  }`}
                >
                  #{t.name} <span className="opacity-60 ml-1">{t.count}</span>
                </button>
              ))}
            </div>
          )}
          {activeTag && (
            <p className="text-[11px] text-[#7C3B23] flex items-center gap-1.5" data-testid="image-library-active-tag-hint">
              <UploadCloud className="w-3.5 h-3.5 flex-shrink-0" strokeWidth={1.8} />
              <span>Las imágenes que subas con «Subir varias» se añadirán a <strong>#{activeTag}</strong> (las duplicadas no se vuelven a guardar).</span>
            </p>
          )}
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto px-6 md:px-8 pt-8 pb-6 bg-[#FDFBF7]">
          {folderProgress && (
            <div className="mb-4 flex items-center gap-3 p-3 bg-[#F2EBE1] border border-[#C16542]/40 text-[#7C3B23] text-sm" data-testid="image-library-folder-progress">
              <Loader2 className="w-4 h-4 flex-shrink-0 animate-spin" strokeWidth={1.8} />
              <span>
                Importando carpeta <strong>#{folderProgress.tag}</strong> — {folderProgress.done}/{folderProgress.total} foto{folderProgress.total === 1 ? "" : "s"}…
              </span>
            </div>
          )}
          {uploadResult && (
            <div className="mb-4 flex items-center gap-3 p-3 bg-[#E8EFE5] border border-[#5A6B4F]/40 text-[#3E4D34] text-sm" data-testid="image-library-banner">
              <Check className="w-4 h-4 flex-shrink-0" strokeWidth={2} />
              {uploadResult.deletedName ? (
                <span>«{uploadResult.deletedName}» eliminada de la biblioteca.</span>
              ) : uploadResult.tag ? (
                <span>
                  {uploadResult.count > 0
                    ? <>Importado a <strong>#{uploadResult.tag}</strong>: {uploadResult.count} foto{uploadResult.count === 1 ? "" : "s"}.</>
                    : <>No se añadió ninguna foto nueva a <strong>#{uploadResult.tag}</strong>.</>}
                  {uploadResult.duplicates > 0 && ` ${uploadResult.duplicates} ya existía${uploadResult.duplicates === 1 ? "" : "n"} (sin duplicar).`}
                  {uploadResult.skipped > 0 && ` ${uploadResult.skipped} omitida${uploadResult.skipped === 1 ? "" : "s"}.`}
                </span>
              ) : (
                <span>
                  {uploadResult.count} foto{uploadResult.count === 1 ? "" : "s"} subida{uploadResult.count === 1 ? "" : "s"}.
                  {uploadResult.duplicates > 0 && ` ${uploadResult.duplicates} ya existía${uploadResult.duplicates === 1 ? "" : "n"} (sin duplicar).`}
                  {uploadResult.skipped > 0 && ` ${uploadResult.skipped} omitida${uploadResult.skipped === 1 ? "" : "s"}.`}
                </span>
              )}
            </div>
          )}
          {error && (
            <div className="mb-4 flex items-center gap-3 p-3 bg-[#FBE4DC] border border-[#C16542]/40 text-[#7C3B23] text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" strokeWidth={1.8} />
              <span>{error}</span>
              <button type="button" onClick={() => setError(null)} className="ml-auto"><X className="w-3 h-3" strokeWidth={2} /></button>
            </div>
          )}

          {loading && items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-[#5C5248]">
              <Loader2 className="w-6 h-6 animate-spin" strokeWidth={1.6} />
              <span className="text-[11px] tracking-[0.25em] uppercase">Cargando biblioteca</span>
            </div>
          ) : items.length === 0 ? (
            <EmptyState
              search={debounced}
              activeTag={activeTag}
              onUpload={() => bulkInputRef.current?.click()}
            />
          ) : (
            <div
              data-testid="image-library-grid"
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4"
            >
              {items.map((it) => (
                <LibraryThumb
                  key={it.id || it.storage_path}
                  item={it}
                  usage={usageById[it.id]}
                  onSelect={onSelect}
                  onDelete={() => setConfirmDelete(it)}
                  onEdit={() => setEditing(it)}
                  onReplace={() => askReplace(it)}
                />
              ))}
            </div>
          )}
        </div>
          </>
        ) : tab === "pexels" ? (
          <div className="flex-1 overflow-y-auto px-6 md:px-8 pt-8 pb-6 bg-[#FDFBF7]">
            <PexelsTab onSelect={onSelect} onClose={onClose} />
          </div>
        ) : tab === "unsplash" ? (
          <div className="flex-1 overflow-y-auto px-6 md:px-8 pt-8 pb-6 bg-[#FDFBF7]">
            <UnsplashTab onSelect={onSelect} onClose={onClose} />
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto px-6 md:px-8 pt-8 pb-6 bg-[#FDFBF7]">
            <PexelsSelectionTab onSelect={onSelect} onClose={onClose} />
          </div>
        )}

        {/* Footer */}
        <div className="px-6 md:px-8 py-4 border-t border-[#2C2621]/10 flex items-center justify-between gap-3 text-[11px] text-[#5C5248]">
          <span className="tracking-[0.2em] uppercase hidden md:inline">
            {tab === "pexels"
              ? "Stock libre · Pexels descarga al storage al pulsar."
              : tab === "unsplash"
              ? "Fotografía editorial · Unsplash descarga al storage al pulsar."
              : tab === "pexels-selection"
              ? "Galerías por destino · Pexels descarga al storage al pulsar."
              : "Las fotos se reutilizan al pulsar — no se vuelven a subir."}
          </span>
          <button
            type="button"
            onClick={onClose}
            data-testid="image-library-cancel"
            className="text-[#2C2621] hover:text-[#C16542] tracking-[0.25em] uppercase font-semibold ml-auto"
          >
            Cancelar
          </button>
        </div>

        {/* Hidden inputs */}
        <input
          ref={bulkInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,image/avif"
          className="hidden"
          data-testid="image-library-bulk-input"
          onChange={(e) => {
            handleBulkUpload(e.target.files);
            if (e.target) e.target.value = "";
          }}
        />
        <input
          ref={setFolderInput}
          type="file"
          multiple
          className="hidden"
          data-testid="image-library-folder-input"
          onChange={(e) => {
            handleFolderUpload(e.target.files);
            if (e.target) e.target.value = "";
          }}
        />
        <input
          ref={replaceInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          className="hidden"
          data-testid="image-library-replace-input"
          onChange={(e) => {
            onReplaceFile(e.target.files?.[0]);
            if (e.target) e.target.value = "";
          }}
        />

        {/* Inline edit drawer */}
        {editing && (
          <EditDrawer
            item={editing}
            onCancel={() => setEditing(null)}
            onSave={saveEdit}
          />
        )}

        {/* Inline delete confirmation (replaces window.confirm which is
            blocked inside the preview iframe) */}
        {confirmDelete && (
          <ConfirmDeleteDialog
            item={confirmDelete}
            usage={usageById[confirmDelete.id]}
            onCancel={() => setConfirmDelete(null)}
            onConfirm={() => handleDelete(confirmDelete)}
          />
        )}
      </div>
    </div>
  );
}

/* ============================================================
   LibraryThumb
============================================================ */
function LibraryThumb({ item, usage, onSelect, onDelete, onEdit, onReplace }) {
  const fullUrl = item.url?.startsWith("http") ? item.url : `${API}${item.url}`;
  const niceName = item.original_filename || item.slot_id || item.storage_path?.split("/").pop();
  const sizeKb = item.size ? Math.max(1, Math.round(item.size / 1024)) : null;
  const tags = item.tags || [];
  const usageCount = usage?.count ?? null;

  return (
    <div
      data-testid={`image-library-item-${(item.id || item.storage_path || "x").slice(0, 24)}`}
      className="group relative flex flex-col bg-[#FDFBF7] border border-[#2C2621]/12 hover:border-[#C16542] transition-colors text-left"
    >
      <button
        type="button"
        onClick={() => onSelect?.(item)}
        className="relative aspect-square overflow-hidden bg-[#F2EBE1] focus:outline-none focus:ring-2 focus:ring-[#C16542]"
        data-testid={`image-library-pick-${(item.id || "x").slice(0, 24)}`}
      >
        <img
          src={fullUrl}
          alt={niceName}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => { e.currentTarget.style.opacity = "0.2"; }}
        />
        <div className="absolute inset-0 bg-[#1A1513]/0 group-hover:bg-[#1A1513]/35 transition-colors flex items-center justify-center">
          <span className="opacity-0 group-hover:opacity-100 transition-opacity inline-flex items-center gap-2 bg-[#C16542] text-[#FDFBF7] px-4 py-2 text-[10px] tracking-[0.25em] uppercase">
            <Check className="w-3.5 h-3.5" strokeWidth={2} />
            Usar esta
          </span>
        </div>

        {/* Usage badge — visible always, top-left */}
        {usageCount !== null && (
          <span
            data-testid={`image-library-usage-${(item.id || "x").slice(0, 24)}`}
            className={`absolute top-2 left-2 inline-flex items-center gap-1 px-2 py-1 text-[9px] tracking-[0.18em] uppercase font-semibold backdrop-blur-md ${
              usageCount > 0
                ? "bg-[#5A6B4F]/90 text-[#FDFBF7]"
                : "bg-[#1A1513]/55 text-[#FDFBF7]/80"
            }`}
            title={usageCount > 0 ? `Usada en ${usageCount} ${usageCount === 1 ? "página" : "páginas"}` : "Sin usar"}
          >
            <Eye className="w-3 h-3" strokeWidth={1.8} />
            {usageCount > 0 ? usageCount : "0"}
          </span>
        )}
      </button>

      {/* Manage actions */}
      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <ManageBtn
          onClick={(e) => { e.stopPropagation(); onReplace(); }}
          title="Reemplazar bytes"
          testid={`image-library-replace-${(item.id || "x").slice(0, 24)}`}
          Icon={Replace}
        />
        <ManageBtn
          onClick={(e) => { e.stopPropagation(); onEdit(); }}
          title="Renombrar y etiquetar"
          testid={`image-library-edit-${(item.id || "x").slice(0, 24)}`}
          Icon={Pencil}
        />
        <ManageBtn
          onClick={(e) => { e.stopPropagation(); onDelete(item); }}
          title="Eliminar"
          testid={`image-library-delete-${(item.id || "x").slice(0, 24)}`}
          Icon={Trash2}
          danger
        />
      </div>

      <div className="p-2.5 space-y-1.5">
        <div className="flex items-center justify-between gap-2 text-[11px]">
          <span className="text-[#2C2621] truncate" title={niceName}>{niceName}</span>
          {sizeKb && <span className="text-[#5C5248] flex-shrink-0">{sizeKb} KB</span>}
        </div>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {tags.slice(0, 3).map((t) => (
              <span
                key={t}
                className="inline-flex items-center text-[9px] tracking-[0.15em] uppercase text-[#5C5248] bg-[#F2EBE1] px-1.5 py-0.5"
              >
                #{t}
              </span>
            ))}
            {tags.length > 3 && (
              <span className="text-[9px] text-[#5C5248]/70">+{tags.length - 3}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function ManageBtn({ onClick, title, testid, Icon, danger }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-label={title}
      data-testid={testid}
      className={`inline-flex items-center justify-center w-7 h-7 backdrop-blur-md border transition-colors ${
        danger
          ? "bg-[#1A1513]/70 border-[#FDFBF7]/30 text-[#FDFBF7] hover:bg-[#C16542] hover:border-[#C16542]"
          : "bg-[#1A1513]/70 border-[#FDFBF7]/30 text-[#FDFBF7] hover:bg-[#FDFBF7] hover:text-[#2C2621]"
      }`}
    >
      <Icon className="w-3.5 h-3.5" strokeWidth={1.8} />
    </button>
  );
}

/* ============================================================
   Inline edit drawer (rename + tags)
============================================================ */
function EditDrawer({ item, onCancel, onSave }) {
  const [name, setName] = useState(item.original_filename || "");
  const [tagInput, setTagInput] = useState((item.tags || []).join(", "));
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e?.preventDefault?.();
    const tags = tagInput.split(",").map((s) => s.trim()).filter(Boolean);
    setBusy(true);
    try {
      await onSave({ original_filename: name, tags });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      data-testid="image-library-edit-drawer"
      className="absolute inset-0 z-10 flex items-end md:items-center justify-center bg-[#1A1513]/55 backdrop-blur-sm p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}
    >
      <form
        onSubmit={submit}
        className="w-full max-w-lg bg-[#FDFBF7] shadow-xl border border-[#2C2621]/15"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2C2621]/10">
          <h4 className="font-serif-x text-xl text-[#2C2621]">Editar imagen</h4>
          <button type="button" onClick={onCancel} className="text-[#5C5248] hover:text-[#C16542]">
            <X className="w-4 h-4" strokeWidth={1.8} />
          </button>
        </div>
        <div className="p-6 space-y-5">
          <div>
            <label className="block text-[10px] tracking-[0.25em] uppercase text-[#5C5248] mb-2">
              Nombre del archivo
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={200}
              data-testid="image-library-edit-name"
              className="w-full bg-[#FDFBF7] border border-[#2C2621]/20 focus:border-[#C16542] outline-none px-3 py-2 text-sm text-[#2C2621]"
            />
          </div>
          <div>
            <label className="flex items-center gap-2 text-[10px] tracking-[0.25em] uppercase text-[#5C5248] mb-2">
              <Tag className="w-3 h-3" strokeWidth={1.7} />
              Etiquetas (separadas por coma)
            </label>
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="duna, sahara, amanecer…"
              data-testid="image-library-edit-tags"
              className="w-full bg-[#FDFBF7] border border-[#2C2621]/20 focus:border-[#C16542] outline-none px-3 py-2 text-sm text-[#2C2621]"
            />
            <p className="text-[11px] text-[#5C5248] mt-2">
              Las etiquetas ayudan a filtrar fotos por tema (Marrakech, Atlas, riad…).
            </p>
          </div>
        </div>
        <div className="px-6 py-4 border-t border-[#2C2621]/10 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="text-[10px] tracking-[0.25em] uppercase text-[#5C5248] hover:text-[#2C2621]"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={busy}
            data-testid="image-library-edit-save"
            className="inline-flex items-center gap-2 bg-[#C16542] hover:bg-[#A35133] text-[#FDFBF7] px-5 py-2.5 text-[10px] tracking-[0.25em] uppercase disabled:opacity-50 transition-colors"
          >
            {busy ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" strokeWidth={2} />}
            Guardar
          </button>
        </div>
      </form>
    </div>
  );
}

/* ============================================================
   Inline delete confirmation
============================================================ */
function ConfirmDeleteDialog({ item, usage, onCancel, onConfirm }) {
  const [busy, setBusy] = useState(false);
  const submit = async () => {
    setBusy(true);
    try {
      await onConfirm();
    } finally {
      setBusy(false);
    }
  };

  const usageCount = usage?.count ?? null;
  const slots = usage?.slots || [];
  const isDangerous = usageCount && usageCount > 0;

  return (
    <div
      data-testid="image-library-confirm-delete"
      className="absolute inset-0 z-10 flex items-center justify-center bg-[#1A1513]/65 backdrop-blur-sm p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}
    >
      <div className="w-full max-w-lg max-h-[85vh] bg-[#FDFBF7] shadow-xl border border-[#2C2621]/15 overflow-hidden flex flex-col">
        <div className="flex items-start gap-4 p-6">
          <span className={`inline-flex items-center justify-center w-11 h-11 rounded-full flex-shrink-0 ${
            isDangerous ? "bg-[#C16542]/20 text-[#C16542]" : "bg-[#C16542]/15 text-[#C16542]"
          }`}>
            <Trash2 className="w-5 h-5" strokeWidth={1.7} />
          </span>
          <div className="min-w-0">
            <h4 className="font-serif-x text-xl text-[#2C2621] leading-tight">
              ¿Eliminar esta imagen?
            </h4>
            <p className="text-sm text-[#5C5248] mt-2 leading-relaxed">
              «<span className="text-[#2C2621] font-medium">{item.original_filename || "Imagen"}</span>» quedará oculta de la biblioteca y de las páginas que la utilicen.
            </p>
          </div>
        </div>

        {/* Used-in panel */}
        <div
          data-testid="image-library-confirm-usage"
          className={`mx-6 mb-4 border ${isDangerous ? "border-[#C16542]/40 bg-[#FBE4DC]/40" : "border-[#2C2621]/12 bg-[#F2EBE1]/40"}`}
        >
          {usageCount === null ? (
            <div className="px-4 py-3 flex items-center gap-2 text-[12px] text-[#5C5248]">
              <Loader2 className="w-3.5 h-3.5 animate-spin" strokeWidth={1.6} />
              <span>Comprobando dónde se usa esta imagen…</span>
            </div>
          ) : usageCount === 0 ? (
            <div className="px-4 py-3 flex items-center gap-2 text-[12px] text-[#5C5248]">
              <Check className="w-3.5 h-3.5 text-[#5A6B4F]" strokeWidth={2} />
              <span>No se usa en ninguna página — se puede eliminar sin afectar al sitio.</span>
            </div>
          ) : (
            <div className="flex flex-col">
              <div className="px-4 py-3 flex items-center gap-2 text-[12px] text-[#7C3B23] border-b border-[#C16542]/25 bg-[#FBE4DC]/60">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" strokeWidth={1.8} />
                <span>
                  <strong>Atención:</strong> esta imagen se usa en{" "}
                  <strong>{usageCount}</strong> {usageCount === 1 ? "página" : "páginas"}. Al eliminarla, esas páginas mostrarán un hueco vacío.
                </span>
              </div>
              <ul className="max-h-44 overflow-y-auto px-2 py-2 text-[12px] divide-y divide-[#2C2621]/8">
                {slots.slice(0, 30).map((s) => {
                  const pageHref = slotToPath(s.slot_id);
                  return (
                    <li
                      key={s.slot_id}
                      data-testid={`image-library-usage-slot-${(s.slot_id || "x").slice(0, 30)}`}
                      className="px-2 py-2 flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0">
                        <code className="text-[11px] text-[#2C2621] font-mono truncate block">{s.slot_id}</code>
                        {s.source && (
                          <span className="text-[10px] text-[#5C5248] tracking-[0.15em] uppercase">{s.source}</span>
                        )}
                      </div>
                      {pageHref && (
                        <a
                          href={pageHref}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[10px] tracking-[0.2em] uppercase text-[#C16542] hover:text-[#7C3B23] flex-shrink-0"
                        >
                          ver <ExternalLink className="w-3 h-3" strokeWidth={1.8} />
                        </a>
                      )}
                    </li>
                  );
                })}
                {slots.length > 30 && (
                  <li className="px-2 py-2 text-[11px] text-[#5C5248] italic">
                    …y {slots.length - 30} más
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>

        <div className="px-6 py-4 bg-[#F2EBE1]/40 border-t border-[#2C2621]/10 flex items-center justify-end gap-3 mt-auto">
          <button
            type="button"
            onClick={onCancel}
            disabled={busy}
            data-testid="image-library-confirm-cancel"
            className="text-[10px] tracking-[0.25em] uppercase text-[#5C5248] hover:text-[#2C2621] disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={submit}
            disabled={busy}
            data-testid="image-library-confirm-yes"
            className={`inline-flex items-center gap-2 text-[#FDFBF7] px-5 py-2.5 text-[10px] tracking-[0.25em] uppercase disabled:opacity-50 transition-colors ${
              isDangerous
                ? "bg-[#7C3B23] hover:bg-[#5A2A19]"
                : "bg-[#C16542] hover:bg-[#A35133]"
            }`}
          >
            {busy ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" strokeWidth={2} />}
            {isDangerous ? "Eliminar de todos modos" : "Eliminar"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------
   slotToPath — best-effort heuristic that maps a CMS slot_id to
   the public URL of the page that probably renders it. Slot ids
   follow the pattern `{section}.{...}` (e.g. `surdemarruecos.hero.image`,
   `findeano-2026.itinerary.day-1`). We split on `.` / `:` and try to
   match the first segment to a known route slug.
---------------------------------------------------------------- */
const SLOT_PREFIX_TO_PATH = {
  // /viajes/* sections
  surdemarruecos:             "/viajes/surdemarruecos",
  nortedemarruecos:           "/viajes/nortedemarruecos",
  marruecos:                  "/viajes/marruecos",
  escapadas:                  "/viajes/escapadas",
  aventura:                   "/viajes/aventura",
  "aventura-enduro":          "/viajes/aventura/enduro",
  // hubs sur
  "atlas-desierto":           "/viajes/sur/atlas_desierto",
  "desierto-atlas":           "/viajes/sur/desierto_atlas",
  "marrakech-erg":            "/viajes/sur/marrakech_ergchebbi",
  "marrakech-loop":           "/viajes/marrakech_ergchebbi_marrakech",
  "marrakech-essaouira":      "/viajes/sur/marrakech_essaouira",
  "errachidia-atlas-fez":     "/viajes/sur/errachidia-atlas-fez",
  // Marketing
  home:                       "/",
  contact:                    "/contacto",
  "proximas-salidas":         "/proximas_salidas",
  "findeano-2026":            "/findeano2025",
  "findeano2025":             "/findeano2025",
};
function slotToPath(slot_id) {
  if (!slot_id) return null;
  const head = slot_id.split(/[.:]/, 1)[0];
  if (SLOT_PREFIX_TO_PATH[head]) return SLOT_PREFIX_TO_PATH[head];
  if (slot_id.startsWith("/")) return slot_id;
  return null;
}

/* ============================================================
   Empty state
============================================================ */
function EmptyState({ search, activeTag, onUpload }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4 text-[#5C5248] text-center">
      <Library className="w-10 h-10 text-[#5C5248]/40" strokeWidth={1.3} />
      <p className="text-sm max-w-md">
        {search
          ? `Ninguna imagen coincide con "${search}".`
          : activeTag
          ? `No hay imágenes con la etiqueta #${activeTag}.`
          : "Tu biblioteca está vacía — sube tu primera foto para empezar."}
      </p>
      {!search && !activeTag && (
        <button
          type="button"
          onClick={onUpload}
          className="inline-flex items-center gap-2 bg-[#C16542] hover:bg-[#A35133] text-[#FDFBF7] px-5 py-2.5 text-[10px] tracking-[0.25em] uppercase transition-colors"
        >
          <UploadCloud className="w-3.5 h-3.5" strokeWidth={1.8} />
          Subir fotos
          <ChevronRight className="w-3 h-3" strokeWidth={1.8} />
        </button>
      )}
    </div>
  );
}
