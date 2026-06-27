import React, { useMemo, useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, Images, X } from "lucide-react";
import { useLanguage, pick } from "@/contexts/LanguageContext";
import EditableImage, { getSlotUrl, ensureSlotsLoaded } from "@/components/EditableImage";
import { EditableGroup } from "@/contexts/EditableGroupContext";
import { useEditMode } from "@/contexts/EditModeContext";
import { useSlotId } from "@/components/slotScope";
import {
  useDayGallery,
  resolveGalleryUrl,
  dayGallerySegment,
  setDayGalleryLocal,
  buildDaySeed,
} from "@/lib/dayGalleryStore";
import { DayGalleryEditor } from "@/components/DayGalleryEditor";
import ImageContactBubble from "@/components/ImageContactBubble";
import { Img } from "@/components/Img";
import grupXalucaLogo from "@/assets/grup-xaluca-logo.webp";
import monogramaX from "@/assets/monograma-x-crop.png";

/* ============================================================
   DayImageGallery — per-day visual gallery for trip itineraries.
   ------------------------------------------------------------
   1 large main image (the existing `day.<id>.image` slot, 5/6) +
   N additional square (1:1) images (`day.<id>.slide.<i>`).

   • A large viewer shows the active image.
   • A horizontal rail of square thumbnails below it.
   • Click a thumbnail → it becomes the main image.
   • Prev/next arrows cycle through ALL gallery images.
   • Active thumbnail is highlighted; swipe supported on mobile.

   Every image is a CMS slot wrapped in <EditableGroup>, so the
   gallery editor (thumbnail nav + bulk upload) lets editors add /
   replace images without code changes. To grow/shrink the gallery
   in the future, only EXTRA_COUNT needs adjusting (or make it
   CMS-driven) — the slot structure stays the same.
============================================================ */

// Total images per day = 1 main + EXTRA_COUNT additional squares.
const EXTRA_COUNT = 9;

const VER_GALERIA = { es: "Ver galería", en: "View gallery", fr: "Voir la galerie" };

const buildImages = (base, day) => {
  const extras = Array.isArray(day.gallery) ? day.gallery : [];
  const images = [
    { slot: `${base}.image`, ratio: "5/6", fallback: day.image, isMain: true },
  ];
  for (let i = 0; i < EXTRA_COUNT; i += 1) {
    images.push({
      slot: `${base}.slide.${i}`,
      ratio: "1/1",
      fallback: extras[i] || day.image,
      isMain: false,
    });
  }
  return images;
};

export const DayImageGallery = ({ day, dayLabel, dayNum, dayIndex }) => {
  const { lang } = useLanguage();
  const { imageEditMode } = useEditMode();
  // Page-namespaced base → legacy inline-CMS slots, independent per URL.
  const base = useSlotId(`day.${day.id}`);
  // Index-based key for the admin-managed dynamic gallery, so each day is
  // fully INDEPENDENT even when two days in a programme share the same
  // `day.id`. `dayIndex` is the day's 1-based position (from ProgramTemplate);
  // fall back to parsing `dayNum` ("01" → 1) for safety.
  const idx1 = dayIndex || parseInt(dayNum, 10) || 1;
  const galleryKey = useSlotId(dayGallerySegment(idx1, day.id));
  const alt = pick(day.title, lang);

  // Dynamic CMS gallery (managed from /admin OR inline Edit Mode). When
  // present it overrides the legacy fixed slots. images[0] is the
  // featured/main image. BACK-COMPAT: galleries saved before the index-based
  // key change were stored under the id-based key (`base`). Prefer the new
  // index key, but fall back to the legacy key so previously-configured
  // galleries are recovered without re-uploading.
  const dynamicNew = useDayGallery(galleryKey);
  const dynamicLegacy = useDayGallery(base);
  const dynamic = (dynamicNew && dynamicNew.length) ? dynamicNew : dynamicLegacy;

  // Inline gallery editor (Image Edit Mode) — opens the SAME DayGalleryEditor
  // the Admin uses, on the SAME `day_galleries/{galleryKey}` record.
  const [editorOpen, setEditorOpen] = useState(false);
  // Fullscreen lightbox (public "Ver galería") — dialog/modal viewer.
  const [lightboxOpen, setLightboxOpen] = useState(false);
  // Warm the image-slot cache so the editor seed reflects CMS overrides even
  // if the editor is opened before any EditableImage finished hydrating.
  useEffect(() => { ensureSlotsLoaded?.(); }, []);

  const seed = useMemo(() => {
    if (dynamic && dynamic.length) return dynamic;
    return buildDaySeed({ day, mainAlt: alt, slotUrl: (id) => getSlotUrl(id), legacyBase: base });
  }, [dynamic, day, alt, base]);

  const handleSaved = (key, images) => { setDayGalleryLocal(key, images); };

  const slides = useMemo(() => {
    if (dynamic && dynamic.length) {
      return dynamic.map((im, i) => ({
        id: `dyn-${i}`,
        url: resolveGalleryUrl(im.url),
        alt: im.alt || alt,
        ratio: i === 0 ? "5/6" : "1/1",
      }));
    }
    return buildImages(base, day).map((im) => ({ ...im, id: im.slot }));
  }, [dynamic, base, day, alt]);

  const [active, setActive] = useState(0);
  const touchX = useRef(null);
  const railRef = useRef(null);

  const total = slides.length;
  const go = (dir) => setActive((p) => (p + dir + total) % total);
  // Clamp active if the gallery shrank (e.g. images deleted in admin).
  const safeActive = active < total ? active : 0;
  const current = slides[safeActive] || slides[0];

  const renderImg = (slide, thumb) => {
    // In Image Edit Mode we suppress the per-image overlay/cropper and unify
    // editing on the single "Editar galería" button → DayGalleryEditor. So
    // legacy slots render as plain (non-editable) images while editing.
    if (slide.slot && !imageEditMode) {
      return (
        <EditableImage
          slot={slide.slot}
          fallback={slide.fallback}
          alt={thumb ? `${alt} · ${slide.id}` : alt}
          aspectRatio={thumb ? "1/1" : slide.ratio}
          imgProps={{ loading: "lazy" }}
          className="absolute inset-0 w-full h-full object-cover"
        />
      );
    }
    const raw = slide.url || (slide.slot ? getSlotUrl(slide.slot) : null) || slide.fallback;
    return (
      <Img
        src={resolveGalleryUrl(raw)}
        alt={slide.alt || alt}
        width={thumb ? 200 : 1024}
        className="absolute inset-0 w-full h-full object-cover"
      />
    );
  };

  // Keep the active thumbnail visible inside the rail after prev/next —
  // scrolls ONLY the rail (never the page).
  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    const el = rail.querySelector(`[data-thumb-idx="${safeActive}"]`);
    if (!el) return;
    const viewLeft = rail.scrollLeft;
    const viewRight = viewLeft + rail.clientWidth;
    const elLeft = el.offsetLeft;
    const elRight = elLeft + el.offsetWidth;
    if (elLeft < viewLeft) {
      rail.scrollTo({ left: Math.max(0, elLeft - 12), behavior: "smooth" });
    } else if (elRight > viewRight) {
      rail.scrollTo({ left: elRight - rail.clientWidth + 12, behavior: "smooth" });
    }
  }, [safeActive]);

  const onTouchStart = (e) => { touchX.current = e.touches[0]?.clientX ?? null; };
  const onTouchEnd = (e) => {
    if (touchX.current == null) return;
    const dx = (e.changedTouches[0]?.clientX ?? touchX.current) - touchX.current;
    if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
    touchX.current = null;
  };

  // Resolve a single displayable URL for the fullscreen lightbox (object-contain).
  const lightboxSrc = (slide) => {
    const raw = slide?.url || (slide?.slot ? getSlotUrl(slide.slot) : null) || slide?.fallback;
    return resolveGalleryUrl(raw);
  };

  // Lightbox: lock page scroll + keyboard nav (Esc / arrows).
  useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") setLightboxOpen(false);
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [lightboxOpen, total]);

  return (
    <EditableGroup id={base} label={`Galería · ${dayLabel} ${dayNum}`}>
      <div className="relative z-0">
        {/* ---- Main viewer ---- */}
        <div
          data-testid={`day-gallery-viewer-${day.id}`}
          className="relative aspect-[4/5] md:aspect-[5/6] overflow-hidden bg-[#1A1513]"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <div key={current.id} className="ken-burns absolute inset-0">
            {renderImg(current, false)}
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A1513]/55 via-transparent to-transparent pointer-events-none" />
          <span className="film-grain" />

          {/* Xaluca "X" monogram — bottom-right edge */}
          <img
            src={monogramaX}
            alt=""
            aria-hidden="true"
            data-testid={`day-monogram-${day.id}`}
            className="pointer-events-none select-none absolute right-0 bottom-0 h-[82%] w-auto object-contain opacity-55 drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)] z-[2]"
          />
          {/* Xaluca logo — top-right corner */}
          <div className="absolute top-4 right-4 z-[3] pointer-events-none">
            <img
              src={grupXalucaLogo}
              alt="Xaluca"
              data-testid={`day-logo-${day.id}`}
              className="w-14 h-14 md:w-16 md:h-16 object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,0.45)]"
            />
          </div>
          {/* Day label chip — top-left */}
          <div className="absolute top-5 left-5 z-[3] inline-flex items-center gap-3 bg-[#FDFBF7]/95 backdrop-blur-sm px-4 py-2 pointer-events-none">
            <span className="font-serif-x text-xl leading-none" style={{ color: day.accent }}>
              {dayLabel} {dayNum}
            </span>
          </div>

          {/* Image counter */}
          <span
            className="absolute bottom-4 right-4 z-[4] bg-[#1A1513]/70 text-[#FDFBF7] text-[10px] tracking-[0.25em] uppercase px-2.5 py-1 tabular-nums pointer-events-none"
            data-testid={`day-gallery-counter-${day.id}`}
          >
            {safeActive + 1} / {total}
          </span>

          {/* Prev / next arrows */}
          <button
            type="button"
            data-testid={`day-gallery-prev-${day.id}`}
            aria-label="Imagen anterior"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); go(-1); }}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-[20] inline-flex items-center justify-center w-10 h-10 bg-[#1A1513]/55 hover:bg-[#1A1513]/85 text-[#FDFBF7] backdrop-blur-sm transition-colors"
          >
            <ChevronLeft className="w-5 h-5" strokeWidth={1.7} />
          </button>
          <button
            type="button"
            data-testid={`day-gallery-next-${day.id}`}
            aria-label="Imagen siguiente"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); go(1); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-[20] inline-flex items-center justify-center w-10 h-10 bg-[#1A1513]/55 hover:bg-[#1A1513]/85 text-[#FDFBF7] backdrop-blur-sm transition-colors"
          >
            <ChevronRight className="w-5 h-5" strokeWidth={1.7} />
          </button>

          {/* Inline gallery edit trigger — only while Image Edit Mode is on.
              Opens the SAME editor the Admin uses (full parity). */}
          {imageEditMode && (
            <button
              type="button"
              data-testid={`day-gallery-edit-${day.id}`}
              aria-label="Editar galería del día"
              data-edit-allow="true"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setEditorOpen(true); }}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[30] inline-flex items-center gap-2 bg-[#C16542] hover:bg-[#a9512f] text-[#FDFBF7] px-5 py-3 text-[11px] tracking-[0.28em] uppercase shadow-[0_10px_30px_-10px_rgba(0,0,0,0.6)] transition-colors"
            >
              <Images className="w-4 h-4" strokeWidth={1.8} />
              Editar galería
            </button>
          )}

          {/* Quick contact bubble — bottom-left of the featured photo.
              Unique behaviour: expands LEFT→RIGHT into the image. */}
          <ImageContactBubble slug={`gallery-day-${idx1}`} align="left" zClass="z-[10]" />
        </div>

        {/* ---- Thumbnail rail ---- */}
        {/* Same width as the main viewer (both full-width children of the
            gallery wrapper); horizontal scroll keeps thumbs inside that
            width on every breakpoint. */}
        <div
          data-testid={`day-gallery-thumbs-${day.id}`}
          ref={railRef}
          className="mt-4 flex gap-2.5 overflow-x-auto no-scrollbar px-1 py-1.5 scroll-smooth w-full"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {slides.map((img, i) => {
            const on = i === safeActive;
            return (
              <button
                key={img.id}
                type="button"
                data-thumb-idx={i}
                data-testid={`day-gallery-thumb-${day.id}-${i}`}
                aria-label={`Ver imagen ${i + 1}`}
                aria-current={on}
                onClick={() => setActive(i)}
                className={`relative shrink-0 w-[72px] h-[72px] md:w-[84px] md:h-[84px] overflow-hidden bg-[#1A1513] transition-all duration-200 ${
                  on ? "ring-2 ring-offset-2 ring-offset-[#FDFBF7]" : "opacity-70 hover:opacity-100"
                }`}
                style={on ? { ["--tw-ring-color"]: day.accent } : undefined}
              >
                {renderImg(img, true)}
              </button>
            );
          })}
        </div>

        {/* ---- "Ver galería" → fullscreen lightbox ---- */}
        <div className="mt-3 flex justify-center">
          <button
            type="button"
            data-testid={`day-gallery-open-${day.id}`}
            onClick={() => setLightboxOpen(true)}
            className="inline-flex items-center gap-2 border border-[#2C2621]/25 text-[#2C2621] hover:bg-[#2C2621] hover:text-[#FDFBF7] hover:border-[#2C2621] px-5 py-2.5 text-[11px] tracking-[0.25em] uppercase transition-colors duration-300"
          >
            <Images className="w-3.5 h-3.5" strokeWidth={1.6} />
            {VER_GALERIA[lang] || VER_GALERIA.es}
          </button>
        </div>
      </div>

      {/* ---- Fullscreen gallery lightbox (dialog/modal) ---- */}
      {lightboxOpen && createPortal(
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${pick(day.title, lang)} · ${dayLabel} ${dayNum}`}
          data-testid={`day-gallery-lightbox-${day.id}`}
          className="fixed inset-0 z-[9999] flex flex-col bg-[#0B0A09]/97 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) setLightboxOpen(false); }}
        >
          {/* Top bar */}
          <div className="flex items-center justify-between gap-4 px-5 md:px-10 py-4 text-[#FDFBF7] shrink-0">
            <span className="inline-flex items-center gap-3 min-w-0">
              <span className="font-serif-x text-lg md:text-xl leading-none" style={{ color: day.accent }}>
                {dayLabel} {dayNum}
              </span>
              <span className="truncate text-[11px] tracking-[0.22em] uppercase text-[#FDFBF7]/70">
                {pick(day.title, lang)}
              </span>
            </span>
            <span className="inline-flex items-center gap-4 shrink-0">
              <span
                data-testid={`day-gallery-lightbox-counter-${day.id}`}
                className="text-[11px] tracking-[0.25em] uppercase tabular-nums text-[#FDFBF7]/80"
              >
                {safeActive + 1} / {total}
              </span>
              <button
                type="button"
                data-testid={`day-gallery-lightbox-close-${day.id}`}
                aria-label="Cerrar galería"
                onClick={() => setLightboxOpen(false)}
                className="inline-flex items-center justify-center w-10 h-10 border border-[#FDFBF7]/20 text-[#FDFBF7]/80 hover:bg-[#FDFBF7]/10 hover:text-[#FDFBF7] transition-colors"
              >
                <X className="w-5 h-5" strokeWidth={1.7} />
              </button>
            </span>
          </div>

          {/* Main image */}
          <div
            className="relative flex-1 min-h-0 flex items-center justify-center px-4 md:px-20 pb-2"
            onClick={(e) => { if (e.target === e.currentTarget) setLightboxOpen(false); }}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            <img
              key={current.id}
              src={lightboxSrc(current)}
              alt={current.alt || alt}
              data-testid={`day-gallery-lightbox-image-${day.id}`}
              className="max-h-full max-w-full object-contain shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)]"
            />
            {total > 1 && (
              <>
                <button
                  type="button"
                  data-testid={`day-gallery-lightbox-prev-${day.id}`}
                  aria-label="Imagen anterior"
                  onClick={(e) => { e.stopPropagation(); go(-1); }}
                  className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 inline-flex items-center justify-center w-11 h-11 md:w-12 md:h-12 bg-[#FDFBF7]/10 hover:bg-[#FDFBF7]/25 text-[#FDFBF7] backdrop-blur-sm transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" strokeWidth={1.7} />
                </button>
                <button
                  type="button"
                  data-testid={`day-gallery-lightbox-next-${day.id}`}
                  aria-label="Imagen siguiente"
                  onClick={(e) => { e.stopPropagation(); go(1); }}
                  className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 inline-flex items-center justify-center w-11 h-11 md:w-12 md:h-12 bg-[#FDFBF7]/10 hover:bg-[#FDFBF7]/25 text-[#FDFBF7] backdrop-blur-sm transition-colors"
                >
                  <ChevronRight className="w-6 h-6" strokeWidth={1.7} />
                </button>
              </>
            )}
          </div>

          {/* Thumbnail strip */}
          <div className="shrink-0 flex gap-2 overflow-x-auto no-scrollbar px-4 md:px-10 py-4 md:justify-center">
            {slides.map((img, i) => {
              const on = i === safeActive;
              return (
                <button
                  key={`lb-${img.id}`}
                  type="button"
                  data-testid={`day-gallery-lightbox-thumb-${day.id}-${i}`}
                  aria-label={`Ver imagen ${i + 1}`}
                  aria-current={on}
                  onClick={() => setActive(i)}
                  className={`relative shrink-0 w-[60px] h-[60px] md:w-[72px] md:h-[72px] overflow-hidden bg-[#1A1513] transition-all duration-200 ${
                    on ? "ring-2 ring-offset-2 ring-offset-[#0B0A09]" : "opacity-50 hover:opacity-90"
                  }`}
                  style={on ? { ["--tw-ring-color"]: day.accent } : undefined}
                >
                  {renderImg(img, true)}
                </button>
              );
            })}
          </div>
        </div>,
        document.body,
      )}

      {/* Inline gallery editor modal — shared DayGalleryEditor, same record. */}
      {editorOpen && createPortal(
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Editar galería del día"
          data-testid={`day-gallery-editor-modal-${day.id}`}
          className="fixed inset-0 z-[9998] flex items-center justify-center bg-[#1A1513]/85 backdrop-blur-sm p-4 md:p-8"
          onClick={(e) => { if (e.target === e.currentTarget) setEditorOpen(false); }}
        >
          <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-[#0F0D0B] border border-white/10 shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 border-b border-white/10 bg-[#0F0D0B]">
              <span className="text-[11px] tracking-[0.28em] uppercase text-white/70 inline-flex items-center gap-2">
                <Images className="w-4 h-4" strokeWidth={1.8} /> Editar galería · {dayLabel} {dayNum}
              </span>
              <button
                type="button"
                data-testid={`day-gallery-editor-close-${day.id}`}
                aria-label="Cerrar editor"
                onClick={() => setEditorOpen(false)}
                className="inline-flex items-center justify-center w-8 h-8 border border-white/15 text-white/70 hover:bg-white/10 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" strokeWidth={1.7} />
              </button>
            </div>
            <DayGalleryEditor
              galleryKey={galleryKey}
              dayNum={idx1}
              dayTitle={pick(day.title, lang)}
              dayBody={pick(day.body, lang)}
              accent={day.accent || "#C16542"}
              initial={seed}
              onSaved={handleSaved}
            />
          </div>
        </div>,
        document.body,
      )}
    </EditableGroup>
  );
};

export default DayImageGallery;
