/* ============================================================
   EditableImageMeta.jsx
   ----
   Slide-in metadata editor for an image slot:
     - alt text (trilingual ES / EN / FR)
     - caption / title (trilingual ES / EN / FR)
     - clear-image action (DELETE)

   Designed to be embedded inside the EditableImage modal — it owns
   its own fetch/save lifecycle so the modal doesn't have to babysit
   it. Saves are scoped to the metadata fields only (selective PUT),
   so they never accidentally clobber the image url or cropping.
============================================================ */
import React, { useEffect, useState, useCallback } from "react";
import { Save, Loader2, Trash2, Check, AlertCircle, Globe } from "lucide-react";
import { adminAuthHeaders } from "@/lib/adminSession";

const API = process.env.REACT_APP_BACKEND_URL || "";
const LANGS = [
  { code: "es", label: "ES" },
  { code: "en", label: "EN" },
  { code: "fr", label: "FR" },
];

const emptyI18n = () => ({ es: "", en: "", fr: "" });

export default function EditableImageMeta({
  slot,
  hasImage,        // true if there's a saved or fallback image currently shown
  onCleared,       // () => void   parent should hide/refresh the image
  onMetaSaved,     // (meta) => void   parent can update alt rendering
}) {
  const [lang, setLang] = useState("es");
  const [alt, setAlt] = useState(emptyI18n());
  const [caption, setCaption] = useState(emptyI18n());
  const [loaded, setLoaded] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [busy, setBusy] = useState(false);
  const [clearBusy, setClearBusy] = useState(false);
  const [error, setError] = useState(null);
  const [savedFlash, setSavedFlash] = useState(false);

  // Fetch current metadata on mount / slot change
  useEffect(() => {
    if (!slot) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`${API}/api/slots/${encodeURIComponent(slot)}`);
        if (!res.ok) return;
        const data = await res.json();
        if (cancelled) return;
        setAlt({ ...emptyI18n(), ...(data?.alt_i18n || {}) });
        setCaption({ ...emptyI18n(), ...(data?.caption_i18n || {}) });
        setLoaded(true);
        setDirty(false);
      } catch (err) {
        if (!cancelled) setLoaded(true);   // proceed with empty drafts
      }
    })();
    return () => { cancelled = true; };
  }, [slot]);

  const update = (which, value) => {
    if (which === "alt")     setAlt((p) => ({ ...p, [lang]: value }));
    if (which === "caption") setCaption((p) => ({ ...p, [lang]: value }));
    setDirty(true);
    setSavedFlash(false);
  };

  const save = useCallback(async () => {
    if (!slot) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`${API}/api/slots/${encodeURIComponent(slot)}`, {
        method: "PUT",
        headers: adminAuthHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify({ alt_i18n: alt, caption_i18n: caption }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.detail || "No se pudo guardar.");
      }
      setDirty(false);
      setSavedFlash(true);
      onMetaSaved?.({ alt_i18n: alt, caption_i18n: caption });
      setTimeout(() => setSavedFlash(false), 1800);
    } catch (e) {
      setError(e?.message || "Error guardando metadatos.");
    } finally {
      setBusy(false);
    }
  }, [slot, alt, caption, onMetaSaved]);

  const clearImage = async () => {
    if (!slot) return;
    if (!window.confirm("¿Vaciar esta imagen? Se mostrará el placeholder hasta que subas otra.")) return;
    setClearBusy(true);
    setError(null);
    try {
      const res = await fetch(`${API}/api/slots/${encodeURIComponent(slot)}`, {
        method: "DELETE",
        headers: adminAuthHeaders(),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.detail || "No se pudo vaciar la imagen.");
      }
      onCleared?.();
    } catch (e) {
      setError(e?.message || "Error vaciando la imagen.");
    } finally {
      setClearBusy(false);
    }
  };

  return (
    <div
      data-testid={`edit-modal-meta-${slot}`}
      className="border border-[#2C2621]/15 bg-[#F8F2E6]/50 p-4 space-y-3"
    >
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <span className="inline-flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase text-[#5C5248]">
          <Globe className="w-3.5 h-3.5" strokeWidth={1.7} />
          Metadatos · alt y descripción
        </span>
        <div className="inline-flex items-center gap-1 bg-[#FDFBF7] border border-[#2C2621]/15 p-0.5">
          {LANGS.map((l) => (
            <button
              key={l.code}
              type="button"
              data-testid={`edit-modal-meta-lang-${l.code}-${slot}`}
              onClick={() => setLang(l.code)}
              className={`px-2.5 py-1 text-[10px] tracking-[0.2em] uppercase transition-colors ${
                lang === l.code
                  ? "bg-[#2C2621] text-[#FDFBF7]"
                  : "text-[#5C5248] hover:text-[#2C2621]"
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>

      <label className="block">
        <span className="block text-[10px] tracking-[0.28em] uppercase text-[#5C5248] mb-1">
          Texto alternativo ({lang.toUpperCase()})
        </span>
        <input
          type="text"
          data-testid={`edit-modal-meta-alt-${lang}-${slot}`}
          value={alt[lang] || ""}
          maxLength={280}
          placeholder={loaded ? "Describe lo que se ve en la imagen — SEO y accesibilidad" : "Cargando…"}
          onChange={(e) => update("alt", e.target.value)}
          className="w-full bg-[#FDFBF7] border border-[#2C2621]/20 px-3 py-2 text-[13px] text-[#2C2621] placeholder:text-[#9C8E78] focus:outline-none focus:border-[#C16542]"
        />
      </label>

      <label className="block">
        <span className="block text-[10px] tracking-[0.28em] uppercase text-[#5C5248] mb-1">
          Título / descripción ({lang.toUpperCase()})
        </span>
        <textarea
          data-testid={`edit-modal-meta-caption-${lang}-${slot}`}
          rows={2}
          value={caption[lang] || ""}
          maxLength={500}
          placeholder="Opcional · se mostrará en galerías y carruseles si el componente lo soporta"
          onChange={(e) => update("caption", e.target.value)}
          className="w-full bg-[#FDFBF7] border border-[#2C2621]/20 px-3 py-2 text-[13px] text-[#2C2621] placeholder:text-[#9C8E78] resize-y focus:outline-none focus:border-[#C16542]"
        />
      </label>

      {error && (
        <div className="flex items-start gap-2 p-2.5 bg-[#FDEEEA] border border-[#C16542]/30 text-[11px] text-[#A35133]">
          <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" strokeWidth={1.7} />
          <span>{error}</span>
        </div>
      )}

      <div className="flex items-center justify-between gap-3 flex-wrap pt-1">
        <button
          type="button"
          data-testid={`edit-modal-meta-clear-${slot}`}
          onClick={clearImage}
          disabled={!hasImage || clearBusy}
          className="inline-flex items-center gap-1.5 text-[10px] tracking-[0.22em] uppercase text-[#A35133] hover:text-[#7A2E1E] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {clearBusy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" strokeWidth={1.7} />}
          Vaciar imagen
        </button>
        <button
          type="button"
          data-testid={`edit-modal-meta-save-${slot}`}
          onClick={save}
          disabled={!dirty || busy}
          className="inline-flex items-center gap-2 bg-[#2C2621] hover:bg-[#1A1513] disabled:opacity-40 disabled:cursor-not-allowed text-[#FDFBF7] px-3.5 py-2 text-[10px] tracking-[0.25em] uppercase transition-colors"
        >
          {busy ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : savedFlash ? (
            <Check className="w-3.5 h-3.5" strokeWidth={2} />
          ) : (
            <Save className="w-3.5 h-3.5" strokeWidth={1.8} />
          )}
          {savedFlash ? "Guardado" : "Guardar metadatos"}
        </button>
      </div>
    </div>
  );
}
