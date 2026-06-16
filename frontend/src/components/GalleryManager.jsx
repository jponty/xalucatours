/* ============================================================
   GalleryManager — /admin "Biblioteca de Imágenes de Viajes"
   ------------------------------------------------------------
   Lets travel managers pick a trip, see every itinerary day with
   its title + full description, and manage that day's image
   gallery: upload, replace, reorder (drag & drop), delete, set the
   featured/main image and preview — all saved instantly to the
   `day_galleries` backend so the public site updates without code
   changes or redeploys.
============================================================ */
import React, { useEffect, useMemo, useState } from "react";
import {
  Images, Search, Upload, Trash2, Star, GripVertical, Loader2, Check, MapPin, ExternalLink,
} from "lucide-react";
import TRIP_PROGRAMS from "@/lib/tripPrograms";
import { ALL_TRIPS, TRIP_REGIONS } from "@/lib/allTripsCatalog";
import { ROUTES, pathFor } from "@/lib/routes";
import { namespaceForRouteId } from "@/components/slotScope";
import { pick } from "@/contexts/LanguageContext";
import { setDayGalleryLocal, resolveGalleryUrl } from "@/lib/dayGalleryStore";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const MAX_SEED_SLIDES = 12;

const prettifyRoute = (routeId) =>
  routeId.replace(/^tour/, "").replace(/([A-Z])/g, " $1").replace(/(\d)/g, " $1").trim();

/* Build the trip registry once: routeId → name, region, days. */
const buildTrips = () => {
  const meta = {};
  ALL_TRIPS.forEach((t) => { meta[t.routeId] = t; });
  const regionLabel = {};
  TRIP_REGIONS.forEach((r) => { regionLabel[r.id] = r.label; });

  return Object.entries(TRIP_PROGRAMS)
    .map(([routeId, { program }]) => {
      const m = meta[routeId];
      return {
        routeId,
        region: m?.region || "otros",
        title: m?.title || { es: prettifyRoute(routeId), en: prettifyRoute(routeId), fr: prettifyRoute(routeId) },
        ns: namespaceForRouteId(routeId),
        days: program?.days || [],
      };
    })
    .filter((t) => ROUTES[t.routeId] && t.days.length > 0);
};

const apiKey = (ns, dayId) => `${ns}.day.${dayId}`;

export default function GalleryManager({ lang = "es" }) {
  const trips = useMemo(buildTrips, []);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(trips[0]?.routeId || null);
  const [galleries, setGalleries] = useState({}); // key -> [{url,alt}]
  const [slots, setSlots] = useState({});         // slotId -> url
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let alive = true;
    Promise.all([
      fetch(`${API}/day-galleries`).then((r) => (r.ok ? r.json() : { galleries: [] })).catch(() => ({ galleries: [] })),
      fetch(`${API}/slots`).then((r) => (r.ok ? r.json() : { slots: [] })).catch(() => ({ slots: [] })),
    ]).then(([g, s]) => {
      if (!alive) return;
      const gm = {};
      (g.galleries || []).forEach((x) => { if (x.key) gm[x.key] = x.images || []; });
      const sm = {};
      (s.slots || []).forEach((x) => { if (x.slot_id && x.url && !x.cleared) sm[x.slot_id] = x.url; });
      setGalleries(gm);
      setSlots(sm);
      setLoaded(true);
    });
    return () => { alive = false; };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return trips;
    return trips.filter((t) => pick(t.title, lang).toLowerCase().includes(q) || t.routeId.toLowerCase().includes(q));
  }, [trips, query, lang]);

  const grouped = useMemo(() => {
    const by = {};
    filtered.forEach((t) => { (by[t.region] ||= []).push(t); });
    return by;
  }, [filtered]);

  const trip = trips.find((t) => t.routeId === selected) || null;
  const regionName = (id) => {
    const r = TRIP_REGIONS.find((x) => x.id === id);
    return r ? pick(r.label, lang) : id;
  };

  // Seed a day's images from current dynamic doc, else from CMS slots/fallback.
  const seedFor = (key, day) => {
    if (galleries[key] && galleries[key].length) return galleries[key];
    const out = [];
    const main = slots[`${key}.image`] || day.image;
    if (main) out.push({ url: main, alt: pick(day.title, lang) });
    for (let i = 0; i < MAX_SEED_SLIDES; i += 1) {
      const u = slots[`${key}.slide.${i}`];
      if (u) out.push({ url: u, alt: null });
    }
    return out;
  };

  const onSaved = (key, images) => {
    setGalleries((g) => ({ ...g, [key]: images }));
    setDayGalleryLocal(key, images);
  };

  return (
    <div data-testid="admin-gallery-manager" className="h-full flex flex-col md:flex-row">
      {/* Trip selector */}
      <div className="md:w-72 lg:w-80 shrink-0 border-r border-white/10 flex flex-col max-h-[calc(100vh-56px)]">
        <div className="p-4 border-b border-white/10">
          <h2 className="text-[11px] tracking-[0.28em] uppercase text-white/70 flex items-center gap-2 mb-3">
            <Images className="w-4 h-4" /> Biblioteca de viajes
          </h2>
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              data-testid="gallery-trip-search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar viaje…"
              className="w-full bg-white/5 border border-white/10 pl-8 pr-2 py-2 text-xs text-white/90 outline-none focus:border-[#D4A373]"
            />
          </div>
        </div>
        <div className="overflow-y-auto p-2 space-y-3">
          {Object.entries(grouped).map(([region, list]) => (
            <div key={region}>
              <p className="px-2 py-1 text-[9px] tracking-[0.28em] uppercase text-white/35">{regionName(region)}</p>
              <ul className="space-y-0.5">
                {list.map((t) => {
                  const path = pathFor(lang, t.routeId);
                  return (
                  <li key={t.routeId}>
                    <div
                      className={`px-2.5 py-2 ${selected === t.routeId ? "bg-[#C16542]/25" : "hover:bg-white/5"}`}
                    >
                      <button
                        data-testid={`gallery-trip-${t.routeId}`}
                        onClick={() => setSelected(t.routeId)}
                        className={`w-full text-left text-xs flex items-center justify-between gap-2 ${
                          selected === t.routeId ? "text-white" : "text-white/70"
                        }`}
                      >
                        <span className="truncate">{pick(t.title, lang)}</span>
                        <span className="text-[9px] text-white/35 shrink-0">{t.days.length}d</span>
                      </button>
                      <div className="mt-1 flex items-center gap-1.5">
                        <span
                          className="truncate text-[10px] text-white/40 font-mono"
                          title={path}
                          data-testid={`gallery-trip-url-${t.routeId}`}
                        >
                          {path}
                        </span>
                        <a
                          href={path}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          title="Abrir página en una pestaña nueva"
                          aria-label="Abrir página en una pestaña nueva"
                          data-testid={`gallery-trip-open-${t.routeId}`}
                          className="shrink-0 text-white/40 hover:text-[#D4A373] transition-colors"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  </li>
                  );
                })}
              </ul>
            </div>
          ))}
          {filtered.length === 0 && <p className="px-3 py-6 text-xs text-white/40">Sin resultados.</p>}
        </div>
      </div>

      {/* Days + gallery editors */}
      <div className="flex-1 overflow-y-auto max-h-[calc(100vh-56px)] bg-[#0F0D0B]">
        {!loaded ? (
          <div className="h-full flex items-center justify-center text-white/40 gap-2 py-20">
            <Loader2 className="w-4 h-4 animate-spin" /> Cargando…
          </div>
        ) : !trip ? (
          <div className="py-20 text-center text-white/40">Selecciona un viaje.</div>
        ) : (
          <div className="p-5 md:p-8 space-y-8">
            <div className="flex items-center gap-2 text-[10px] tracking-[0.28em] uppercase text-white/50">
              <MapPin className="w-3.5 h-3.5" /> {pick(trip.title, lang)} · {trip.days.length} días
            </div>
            {trip.days.map((day, i) => {
              const key = apiKey(trip.ns, day.id);
              return (
                <DayGalleryEditor
                  key={key}
                  galleryKey={key}
                  dayNum={i + 1}
                  dayTitle={pick(day.title, lang)}
                  dayBody={pick(day.body, lang)}
                  accent={day.accent || "#C16542"}
                  initial={seedFor(key, day)}
                  onSaved={onSaved}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------- Per-day editor ---------- */
const DayGalleryEditor = ({ galleryKey, dayNum, dayTitle, dayBody, accent, initial, onSaved }) => {
  const [images, setImages] = useState(initial || []);
  const [busy, setBusy] = useState(false);
  const [savedTick, setSavedTick] = useState(false);
  const [dragIdx, setDragIdx] = useState(null);

  const flash = () => { setSavedTick(true); setTimeout(() => setSavedTick(false), 1400); };

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
      onSaved(galleryKey, imgs);
      flash();
    } finally {
      setBusy(false);
    }
  };

  const onUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    e.target.value = "";
    if (!files.length) return;
    setBusy(true);
    try {
      let latest = images;
      for (const f of files) {
        const fd = new FormData();
        fd.append("file", f);
        const r = await fetch(`${API}/day-galleries/${encodeURIComponent(galleryKey)}/upload`, { method: "POST", body: fd });
        if (r.ok) {
          const data = await r.json();
          latest = data.images || latest;
          setImages(latest);
        }
      }
      onSaved(galleryKey, latest);
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
          {busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : savedTick ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : null}
          {images.length} img
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
              <img src={resolveGalleryUrl(main.url)} alt="" className="w-full h-full object-cover" />
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
                <img src={resolveGalleryUrl(im.url)} alt="" className="w-full h-full object-cover" />
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
          </div>
          <p className="mt-2 text-[10px] text-white/35">Arrastra para reordenar · ⭐ principal · 🗑 eliminar · cambios publicados al instante.</p>
        </div>
      </div>
    </section>
  );
};
