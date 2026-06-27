import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, Camera, Images, ChevronDown, Compass, ArrowUpRight, Moon } from "lucide-react";
import { useLanguage, pick } from "@/contexts/LanguageContext";
import { LANDMARK_CATALOG } from "@/lib/dayLandmarkCatalog";
import { ZONES } from "@/lib/poiZones";
import { LANDMARK_KINDS } from "@/lib/dayLandmarks";
import { tripsForPoi } from "@/lib/poiTripIndex";
import { pathFor } from "@/lib/routes";
import { LandmarkCarousel } from "@/components/LandmarkCarousel";
import EditableImage from "@/components/EditableImage";
import HeroMonogram from "@/components/HeroMonogram";
import EditableText from "@/components/EditableText";
import PexelsImageSearch from "@/components/PexelsImageSearch";

/* ------------------------------------------------------------
   /galeria — central gallery of every "punto destacado".
   POIs are grouped by geographic zone and sorted alphabetically.
   Each POI is clickable and opens the SAME <LandmarkCarousel>
   drawer used on the day maps, bound to the SAME global slots →
   any text/image edit syncs across /galeria, trip pages, the day
   map and the place gallery.
------------------------------------------------------------ */

const T = {
  es: {
    eyebrow: "Galería de puntos destacados",
    title: "Todos los lugares de Marruecos, en un solo lugar",
    subtitle:
      "Explora cada punto destacado de nuestros viajes, organizado por regiones. Pulsa cualquier lugar para abrir sus historias visuales.",
    zones_nav: "Saltar a una región",
    count_one: "lugar",
    count_many: "lugares",
    open: "Ver galería del lugar",
    related: "Ver viajes que incluyen este lugar",
    related_empty: "Próximamente en nuestros itinerarios",
    nights: "noches",
  },
  en: {
    eyebrow: "Landmarks gallery",
    title: "Every place in Morocco, in one place",
    subtitle:
      "Explore every landmark from our journeys, grouped by region. Tap any place to open its visual stories.",
    zones_nav: "Jump to a region",
    count_one: "place",
    count_many: "places",
    open: "View place gallery",
    related: "See trips that include this place",
    related_empty: "Coming soon to our itineraries",
    nights: "nights",
  },
  fr: {
    eyebrow: "Galerie des points d'intérêt",
    title: "Tous les lieux du Maroc, au même endroit",
    subtitle:
      "Explorez chaque point d'intérêt de nos voyages, regroupé par région. Cliquez sur un lieu pour ouvrir ses histoires visuelles.",
    zones_nav: "Aller à une région",
    count_one: "lieu",
    count_many: "lieux",
    open: "Voir la galerie du lieu",
    related: "Voir les voyages incluant ce lieu",
    related_empty: "Bientôt dans nos itinéraires",
    nights: "nuits",
  },
};

const HERO_DEF = {
  eyebrow: { es: "Galería de puntos destacados", en: "Landmarks gallery", fr: "Galerie des points d'intérêt" },
  title: {
    es: "Todos los lugares de Marruecos, en un solo lugar",
    en: "Every place in Morocco, in one place",
    fr: "Tous les lieux du Maroc, au même endroit",
  },
  subtitle: {
    es: "Explora cada punto destacado de nuestros viajes, organizado por regiones. Pulsa cualquier lugar para abrir sus historias visuales.",
    en: "Explore every landmark from our journeys, grouped by region. Tap any place to open its visual stories.",
    fr: "Explorez chaque point d'intérêt de nos voyages, regroupé par région. Cliquez sur un lieu pour ouvrir ses histoires visuelles.",
  },
};

const HERO_FALLBACK =
  "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=2400&q=85";

/* Build the landmark object the carousel expects — identical fields to the
   ones the day map passes, so slot resolution + card copy match exactly. */
const toCarouselLandmark = (rec) => {
  const isCurated = rec.prefix.startsWith("landmark.");
  const base = {
    id: rec.id,
    kind: rec.kind,
    name: rec.name,
    blurb: rec.blurb,
    gallery: rec.gallery,
  };
  return isCurated
    ? { ...base, slotBase: rec.prefix }   // landmark.${id}
    : { ...base, poiKey: rec.id };        // poi.${poiKey}
};

const kindColor = (kind) => (LANDMARK_KINDS[kind] && LANDMARK_KINDS[kind].color) || "#C16542";

const RelatedTrips = ({ poiId, lang, t }) => {
  const trips = useMemo(() => tripsForPoi(poiId), [poiId]);
  if (trips.length === 0) return null;
  const sorted = [...trips].sort(
    (a, b) => a.nights - b.nights || pick(a.title, lang).localeCompare(pick(b.title, lang), "es")
  );
  return (
    <div
      data-testid={`galeria-related-trips-${poiId}`}
      className="mt-5 pt-5 border-t border-[#2C2621]/12"
    >
      <span className="overline inline-flex items-center gap-2 text-[#C16542]">
        <Compass className="w-3.5 h-3.5" strokeWidth={1.8} />
        {t.related} · {trips.length}
      </span>
      <div className="flex flex-wrap gap-2.5 mt-3">
        {sorted.map((trip) => (
          <Link
            key={trip.routeId}
            to={pathFor(lang, trip.routeId)}
            data-testid={`galeria-trip-chip-${trip.routeId}`}
            className="group inline-flex items-center gap-2 pl-3.5 pr-3 py-2 bg-[#FDFBF7] border border-[#2C2621]/15 hover:border-[#C16542] hover:bg-[#C16542]/[0.06] transition-colors"
          >
            <span className="font-serif-x text-[14px] text-[#2C2621] group-hover:text-[#C16542] transition-colors">
              {pick(trip.title, lang)}
            </span>
            {trip.nights ? (
              <span className="inline-flex items-center gap-1 text-[10px] tracking-[0.12em] uppercase text-[#5C5248]">
                <Moon className="w-3 h-3" strokeWidth={1.7} />
                {trip.nights} {t.nights}
              </span>
            ) : null}
            <ArrowUpRight
              className="w-3.5 h-3.5 text-[#C16542] opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all"
              strokeWidth={2}
            />
          </Link>
        ))}
      </div>
    </div>
  );
};

const PoiButton = ({ rec, lang, active, onToggle }) => {
  const color = kindColor(rec.kind);
  const kindCfg = LANDMARK_KINDS[rec.kind];
  return (
    <button
      type="button"
      data-testid={`galeria-poi-${rec.uid}`}
      aria-pressed={active}
      onClick={onToggle}
      className={`group w-full text-left flex items-start gap-3 px-4 py-3.5 border transition-all duration-300 ${
        active
          ? "bg-[#FDFBF7] border-[#2C2621]"
          : "bg-[#FDFBF7]/70 hover:bg-[#FDFBF7] border-[#2C2621]/15 hover:border-[#2C2621]/45"
      }`}
      style={active ? { boxShadow: `inset 3px 0 0 ${color}` } : undefined}
    >
      <span
        className={`mt-1 w-3 h-3 rounded-full shrink-0 ring-2 transition-all ${
          active ? "ring-[#FDFBF7] scale-125" : "ring-[#F2EBE1]"
        }`}
        style={{ background: color }}
      />
      <span className="flex-1 min-w-0">
        {kindCfg && (
          <span className="block text-[9px] tracking-[0.25em] uppercase" style={{ color }}>
            {pick(kindCfg.label, lang)}
          </span>
        )}
        <span className="block font-serif-x text-[15px] md:text-[16px] text-[#2C2621] leading-snug mt-0.5 inline-flex items-center gap-2">
          <MapPin className="w-3.5 h-3.5 shrink-0" style={{ color }} strokeWidth={1.6} />
          <span className="truncate">{pick(rec.name, lang)}</span>
        </span>
      </span>
      <ChevronDown
        className={`w-4 h-4 mt-1 text-[#5C5248] shrink-0 transition-transform duration-300 ${active ? "rotate-180" : ""}`}
        strokeWidth={1.7}
      />
    </button>
  );
};

const ZoneSection = ({ zone, records, lang, t }) => {
  const [activeUid, setActiveUid] = useState(null);
  const active = records.find((r) => r.uid === activeUid) || null;

  return (
    <section
      id={`zona-${zone.id}`}
      data-testid={`galeria-zone-${zone.id}`}
      className="relative scroll-mt-28 py-12 md:py-16 border-t border-[#2C2621]/10 first:border-t-0"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex items-end justify-between gap-4 flex-wrap mb-8">
          <div>
            <span className="overline inline-flex items-center gap-2 text-[#C16542]">
              <Images className="w-3.5 h-3.5" strokeWidth={1.8} />
              {records.length} {records.length === 1 ? t.count_one : t.count_many}
            </span>
            <h2 className="font-serif-x text-3xl md:text-4xl text-[#2C2621] leading-[1.1] mt-2">
              {pick(zone.label, lang)}
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {records.map((rec) => (
            <PoiButton
              key={rec.uid}
              rec={rec}
              lang={lang}
              active={rec.uid === activeUid}
              onToggle={() => setActiveUid((p) => (p === rec.uid ? null : rec.uid))}
            />
          ))}
        </div>

        {active && (
          <>
            <LandmarkCarousel
              landmark={toCarouselLandmark(active)}
              accent={kindColor(active.kind)}
              onClose={() => setActiveUid(null)}
            />
            <RelatedTrips poiId={active.id} lang={lang} t={t} />
          </>
        )}
      </div>
    </section>
  );
};

export default function GaleriaPage() {
  const { lang } = useLanguage();
  const t = T[lang] || T.es;

  useEffect(() => {
    const titles = { es: "Galería de puntos destacados · Xaluca Tours", en: "Landmarks gallery · Xaluca Tours", fr: "Galerie des points d'intérêt · Xaluca Tours" };
    document.title = titles[lang] || titles.es;
  }, [lang]);

  // Group catalog by zone, only keep records with a non-empty gallery
  // (every clickable POI must open a drawer), sort alphabetically by name.
  const grouped = useMemo(() => {
    const map = {};
    ZONES.forEach((z) => (map[z.id] = []));
    LANDMARK_CATALOG.forEach((rec) => {
      if (!rec.gallery || rec.gallery.length === 0) return;
      const zid = map[rec.zone] ? rec.zone : "otros";
      map[zid].push(rec);
    });
    Object.values(map).forEach((list) =>
      list.sort((a, b) => pick(a.name, lang).localeCompare(pick(b.name, lang), "es"))
    );
    return map;
  }, [lang]);

  const activeZones = ZONES.filter((z) => (grouped[z.id] || []).length > 0);

  return (
    <main data-testid="galeria-page" className="bg-[#FDFBF7]">
      {/* Hero */}
      <section data-testid="galeria-hero" className="relative bg-[#1A1513] overflow-hidden">
        <EditableImage
          slot="galeria.hero.bg"
          fallback={HERO_FALLBACK}
          alt={pick(HERO_DEF.title, lang)}
          aspectRatio="21/9"
          priority
          className="ken-burns absolute inset-0 w-full h-full object-cover opacity-45"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1513] via-[#1A1513]/55 to-[#1A1513]/40 pointer-events-none" />
        <span className="film-grain pointer-events-none" />
        <HeroMonogram />
        <div className="relative max-w-7xl mx-auto px-6 md:px-12 pt-[120px] md:pt-[150px] pb-16 md:pb-24">
          <EditableText
            slot="galeria.hero.eyebrow"
            defaults={HERO_DEF.eyebrow}
            as="span"
            multiline={false}
            className="inline-flex items-center gap-2 text-[10px] md:text-[11px] tracking-[0.32em] uppercase text-[#D4A373]"
          />
          <EditableText
            slot="galeria.hero.title"
            defaults={HERO_DEF.title}
            as="h1"
            className="font-serif-x text-4xl sm:text-5xl lg:text-6xl text-[#FDFBF7] leading-[1.05] mt-5 max-w-4xl"
          />
          <EditableText
            slot="galeria.hero.subtitle"
            defaults={HERO_DEF.subtitle}
            as="p"
            className="mt-6 text-base md:text-lg text-[#FDFBF7]/80 leading-relaxed max-w-2xl"
          />
          <p className="mt-6 inline-flex items-center gap-2 text-[11px] tracking-[0.22em] uppercase text-[#FDFBF7]/55">
            <Camera className="w-3.5 h-3.5" strokeWidth={1.7} />
            {LANDMARK_CATALOG.filter((r) => r.gallery && r.gallery.length).length} {t.count_many}
          </p>
        </div>
      </section>

      {/* Zone quick-nav — pins to the very top. The site header (z-40) auto-
          hides on scroll-down, so this nav becomes the fixed region anchor as
          you browse the zones, and tucks cleanly under the header on scroll-up. */}
      <nav
        data-testid="galeria-zone-nav"
        className="sticky top-0 z-30 bg-[#FDFBF7]/95 backdrop-blur-md border-b border-[#2C2621]/10 shadow-[0_8px_24px_-18px_rgba(26,21,19,0.4)]"
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-3 flex items-center gap-3 overflow-x-auto no-scrollbar">
          <span className="text-[10px] tracking-[0.22em] uppercase text-[#5C5248] shrink-0 hidden md:inline">
            {t.zones_nav}
          </span>
          {activeZones.map((z) => (
            <a
              key={z.id}
              href={`#zona-${z.id}`}
              data-testid={`galeria-zone-link-${z.id}`}
              className="shrink-0 px-3 py-1.5 text-[11px] tracking-[0.12em] uppercase text-[#2C2621] border border-[#2C2621]/15 hover:border-[#C16542] hover:text-[#C16542] transition-colors whitespace-nowrap"
            >
              {pick(z.label, lang)} · {(grouped[z.id] || []).length}
            </a>
          ))}
        </div>
      </nav>

      {/* Zones */}
      <div className="relative">
        <div className="absolute inset-0 berber-bg-diamond opacity-[0.15] pointer-events-none" aria-hidden="true" />
        <div className="relative">
          {activeZones.map((z) => (
            <ZoneSection key={z.id} zone={z} records={grouped[z.id]} lang={lang} t={t} />
          ))}
        </div>
      </div>

      {/* Image search — find images of any place in Morocco (Pexels) */}
      <PexelsImageSearch lang={lang} />
    </main>
  );
}
