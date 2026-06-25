/* ============================================================
   GalleryManager — /admin "Biblioteca de Imágenes de Viajes"
   ------------------------------------------------------------
   Lets travel managers pick a trip, see every itinerary day with
   its title + full description, and manage that day's image
   gallery: upload, replace, reorder (drag & drop), delete, set the
   featured/main image and preview — all saved instantly to the
   `day_galleries` backend so the public site updates without code
   changes or redeploys.

   The per-day editor itself lives in <DayGalleryEditor> and is the
   SAME component used by the inline Image Edit Mode on the public
   trip page → one shared editor, one shared `day_galleries` record.
============================================================ */
import React, { useEffect, useMemo, useState } from "react";
import { Images, Search, Loader2, MapPin, ExternalLink } from "lucide-react";
import TRIP_PROGRAMS from "@/lib/tripPrograms";
import { ALL_TRIPS, TRIP_REGIONS } from "@/lib/allTripsCatalog";
import { ROUTES, pathFor } from "@/lib/routes";
import { namespaceForRouteId } from "@/components/slotScope";
import { pick } from "@/contexts/LanguageContext";
import { setDayGalleryLocal, dayGallerySegment, buildDaySeed } from "@/lib/dayGalleryStore";
import { DayGalleryEditor } from "@/components/DayGalleryEditor";

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

/* Dynamic gallery key — INDEX-based so each day is independent even when
   two days in a programme share the same `day.id`. Mirrors the public
   DayImageGallery (lib/dayGalleryStore → dayGallerySegment). */
const apiKey = (ns, index, dayId) => `${ns}.${dayGallerySegment(index, dayId)}`;
/* Legacy id-based base for reading existing inline-CMS image slots when
   seeding a day that has no managed gallery yet. */
const legacyBaseFor = (ns, dayId) => `${ns}.day.${dayId}`;

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
  // `key` is the index-based managed-gallery key; `legacyBase` is the id-based
  // base used by the legacy inline slots AND by galleries saved BEFORE the
  // index-based key change. We recover those legacy galleries so previously
  // configured images are not lost (they migrate to the new key on next save).
  const seedFor = (key, legacyBase, day) => {
    if (galleries[key] && galleries[key].length) return galleries[key];
    if (galleries[legacyBase] && galleries[legacyBase].length) return galleries[legacyBase];
    return buildDaySeed({
      day,
      mainAlt: pick(day.title, lang),
      slotUrl: (id) => slots[id] || null,
      legacyBase,
      maxSlides: MAX_SEED_SLIDES,
    });
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
              const key = apiKey(trip.ns, i + 1, day.id);
              const legacyBase = legacyBaseFor(trip.ns, day.id);
              return (
                <DayGalleryEditor
                  key={key}
                  galleryKey={key}
                  dayNum={i + 1}
                  dayTitle={pick(day.title, lang)}
                  dayBody={pick(day.body, lang)}
                  accent={day.accent || "#C16542"}
                  initial={seedFor(key, legacyBase, day)}
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
