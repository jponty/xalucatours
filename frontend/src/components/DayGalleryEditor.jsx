/* ============================================================
   DayGalleryEditor — reusable per-day gallery editor.
   ------------------------------------------------------------
   Shared by BOTH the Admin "Galerías" tab (GalleryManager) and the
   inline Image Edit Mode modal on the public trip page. It always
   reads/writes the SAME `day_galleries/{galleryKey}` record, so a
   change made anywhere is the single source of truth and stays in
   sync everywhere (admin ↔ live page).

   Full parity: upload (file), pick from Image Library, reorder
   (drag & drop), set featured/main image and delete — every action
   is persisted instantly via the day-galleries backend.
============================================================ */
import React, { useEffect, useRef, useState } from "react";
import { Upload, Trash2, Star, GripVertical, Loader2, Check, Library } from "lucide-react";
import { toast } from "sonner";
import { Img } from "@/components/Img";
import { resolveGalleryUrl } from "@/lib/dayGalleryStore";
import ImageLibraryPicker from "@/components/ImageLibraryPicker";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export const DayGalleryEditor = ({ galleryKey, dayNum, dayTitle, dayBody, accent = "#C16542", initial, onSaved }) => {
  const [images, setImages] = useState(initial || []);
  const [busy, setBusy] = useState(false);
  const [savedTick, setSavedTick] = useState(false);
  const [dragIdx, setDragIdx] = useState(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const imagesRef = useRef(images);
  useEffect(() => { imagesRef.current = images; }, [images]);

  const flash = () => {
    setSavedTick(true);
    setTimeout(() => setSavedTick(false), 1800);
    // Visible reassurance that the change is live on the website. A fixed id
    // collapses rapid saves (drag-reorder, set-main) into a single toast.
    toast.success("Cambios publicados", {
      id: "day-gallery-saved",
      description: "La galería se actualizó en la web al instante.",
    });
  };

  const persist = async (next) => {
    setImages(next);
    setBusy(true);
    try {
      const r = await fetch(`${API}/day-galleries/${encodeURIComponent(galleryKey)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ images: next }),
      });
      const data = await r.json();
      const imgs = data.images || next;
      setImages(imgs);
      onSaved?.(galleryKey, imgs);
      flash();
    } finally {
      setBusy(false);
    }
  };

  // Add an image chosen from the shared Image Library (Pexels / Unsplash /
  // local library / selections). The asset is already hosted on our storage.
  const onPickFromLibrary = (libItem) => {
    if (!libItem?.url) return;
    const next = [...imagesRef.current, { url: libItem.url, alt: libItem.original_filename || null }];
    imagesRef.current = next;
    persist(next);
    setPickerOpen(false);
  };

  // Add SEVERAL images chosen from the local library in one action — they are
  // appended (in pick order) and persisted with a single save.
  const onPickManyFromLibrary = (libItems) => {
    const valid = (libItems || []).filter((it) => it?.url);
    if (!valid.length) return;
    const next = [
      ...imagesRef.current,
      ...valid.map((it) => ({ url: it.url, alt: it.original_filename || null })),
    ];
    imagesRef.current = next;
    persist(next);
    setPickerOpen(false);
  };

  const onUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    e.target.value = "";
    if (!files.length) return;
    setBusy(true);
    try {
      // Persist the current (possibly seeded-but-unsaved) list FIRST so the
      // uploaded files ADD to what's shown instead of replacing the seed on a
      // brand-new day. Idempotent when the gallery is already persisted.
      let latest = imagesRef.current;
      if (latest.length) {
        const r0 = await fetch(`${API}/day-galleries/${encodeURIComponent(galleryKey)}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ images: latest }),
        });
        if (r0.ok) {
          const d0 = await r0.json();
          latest = d0.images || latest;
          setImages(latest);
          imagesRef.current = latest;
        }
      }
      for (const f of files) {
        const fd = new FormData();
        fd.append("file", f);
        const r = await fetch(`${API}/day-galleries/${encodeURIComponent(galleryKey)}/upload`, { method: "POST", body: fd });
        if (r.ok) {
          const data = await r.json();
          latest = data.images || latest;
          setImages(latest);
          imagesRef.current = latest;
        }
      }
      onSaved?.(galleryKey, latest);
      flash();
    } finally {
      setBusy(false);
    }
  };

  const removeAt = (i) => persist(images.filter((_, idx) => idx !== i));
  const setMain = (i) => {
    if (i === 0) return;
    const next = [...images];
    const [it] = next.splice(i, 1);
    next.unshift(it);
    persist(next);
  };
  const reorder = (from, to) => {
    if (from === to || from == null) return;
    const next = [...images];
    const [it] = next.splice(from, 1);
    next.splice(to, 0, it);
    persist(next);
  };

  const main = images[0];

  return (
    <section data-testid={`gallery-day-${galleryKey}`} className="border border-white/10 bg-white/[0.03]">
      <header className="flex items-center gap-3 px-4 py-3 border-b border-white/10">
        <span className="font-serif-x text-lg" style={{ color: accent }}>Día {dayNum}</span>
        <span className="text-sm text-white/85 truncate">{dayTitle}</span>
        <span className="ml-auto flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase text-white/40">
          {busy ? (
            <span className="inline-flex items-center gap-1.5 text-white/60">
              <Loader2 className="w-3.5 h-3.5 animate-spin" /> Guardando…
            </span>
          ) : savedTick ? (
            <span
              data-testid={`gallery-published-${galleryKey}`}
              className="inline-flex items-center gap-1.5 bg-emerald-500/15 text-emerald-300 px-2 py-0.5 rounded-full"
            >
              <Check className="w-3.5 h-3.5" /> Publicado
            </span>
          ) : null}
          <span>{images.length} img</span>
        </span>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 p-4">
        {/* Itinerary description */}
        <div className="order-2 lg:order-1">
          <p className="text-[9px] tracking-[0.28em] uppercase text-white/35 mb-2">Itinerario</p>
          <p className="text-[13px] leading-relaxed text-white/70 whitespace-pre-line max-h-56 overflow-y-auto pr-2">{dayBody}</p>
        </div>

        {/* Gallery editor + preview */}
        <div className="order-1 lg:order-2">
          {/* Main preview */}
          <div className="relative aspect-[5/6] max-h-72 overflow-hidden bg-black/40 border border-white/10 mb-3 mx-auto" style={{ maxWidth: 240 }}>
            {main ? (
              <Img src={resolveGalleryUrl(main.url)} alt="" width={480} sizes="240px" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white/30 text-xs">Sin imagen principal</div>
            )}
            <span className="absolute top-2 left-2 text-[8px] tracking-[0.2em] uppercase bg-black/70 text-[#D4A373] px-2 py-0.5">Principal</span>
          </div>

          {/* Thumbnails (drag to reorder) */}
          <div className="flex flex-wrap gap-2">
            {images.map((im, i) => (
              <div
                key={`${im.url}-${i}`}
                data-testid={`gallery-thumb-${galleryKey}-${i}`}
                draggable
                onDragStart={() => setDragIdx(i)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => { reorder(dragIdx, i); setDragIdx(null); }}
                onDragEnd={() => setDragIdx(null)}
                className={`relative w-[68px] h-[68px] group bg-black/40 border ${i === 0 ? "border-[#D4A373]" : "border-white/10"} ${dragIdx === i ? "opacity-40" : ""}`}
              >
                <Img src={resolveGalleryUrl(im.url)} alt="" width={160} sizes="68px" className="w-full h-full object-cover" />
                <span className="absolute top-0.5 left-0.5 text-white/70 bg-black/50 p-0.5 cursor-grab">
                  <GripVertical className="w-3 h-3" />
                </span>
                <div className="absolute inset-x-0 bottom-0 flex opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    title="Fijar como principal"
                    data-testid={`gallery-setmain-${galleryKey}-${i}`}
                    onClick={() => setMain(i)}
                    className="flex-1 bg-black/70 hover:bg-[#C16542] py-1 flex items-center justify-center"
                  >
                    <Star className={`w-3 h-3 ${i === 0 ? "fill-[#D4A373] text-[#D4A373]" : "text-white"}`} />
                  </button>
                  <button
                    type="button"
                    title="Eliminar"
                    data-testid={`gallery-delete-${galleryKey}-${i}`}
                    onClick={() => removeAt(i)}
                    className="flex-1 bg-black/70 hover:bg-red-600 py-1 flex items-center justify-center"
                  >
                    <Trash2 className="w-3 h-3 text-white" />
                  </button>
                </div>
              </div>
            ))}

            {/* Upload tile */}
            <label
              data-testid={`gallery-upload-${galleryKey}`}
              className="w-[68px] h-[68px] flex flex-col items-center justify-center gap-1 border border-dashed border-white/25 text-white/50 hover:text-white hover:border-[#D4A373] cursor-pointer text-[9px]"
            >
              <Upload className="w-4 h-4" />
              Subir
              <input type="file" accept="image/*" multiple className="hidden" onChange={onUpload} disabled={busy} />
            </label>

            {/* Image Library tile */}
            <button
              type="button"
              data-testid={`gallery-library-${galleryKey}`}
              onClick={() => setPickerOpen(true)}
              disabled={busy}
              className="w-[68px] h-[68px] flex flex-col items-center justify-center gap-1 border border-dashed border-white/25 text-white/50 hover:text-white hover:border-[#D4A373] cursor-pointer text-[9px] disabled:opacity-50"
            >
              <Library className="w-4 h-4" />
              Biblioteca
            </button>
          </div>
          <p className="mt-2 text-[10px] text-white/35">Arrastra para reordenar · ⭐ principal · 🗑 eliminar · cambios publicados al instante.</p>
        </div>
      </div>

      <ImageLibraryPicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={onPickFromLibrary}
        multiple
        onSelectMany={onPickManyFromLibrary}
      />
    </section>
  );
};

export default DayGalleryEditor;
