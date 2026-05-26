import React, { useState, useRef, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, MapPin, Compass, Sparkles } from "lucide-react";
import { useLanguage, pick } from "@/contexts/LanguageContext";
import { pathFor } from "@/lib/routes";

/* ============================================================
   MoroccoInteractiveMap
   -------------------------------------------------------------
   Editorial, cinematic stylised SVG of Morocco split into three
   geographic regions (Norte · Centro · Sur). A row of 6 category
   chips re-highlights the matching regions and updates the
   adjacent narrative panel.
============================================================ */

const T = (es, en, fr) => ({ es, en, fr });

const COPY = {
  overline: T("El mapa de Xaluca", "The Xaluca map", "La carte Xaluca"),
  title: T(
    "Marruecos, dibujado a mano.",
    "Morocco, drawn by hand.",
    "Le Maroc, dessiné à la main.",
  ),
  body: T(
    "Elige una región o un tipo de viaje. El mapa se ilumina y te muestra qué experiencias ofrece cada zona.",
    "Pick a region or a kind of journey. The map lights up and reveals what each area has to offer.",
    "Choisissez une région ou un type de voyage. La carte s'illumine et révèle ce que chaque zone propose.",
  ),
  legend_regions: T("Regiones", "Regions", "Régions"),
  legend_formats: T("Formatos", "Formats", "Formats"),
  cta_discover: T("Descubrir rutas", "Discover routes", "Découvrir les itinéraires"),
  cta_default:  T("Elige una región para empezar", "Pick a region to start", "Choisissez une région pour commencer"),
};

// -------------------- Regions (geographic) --------------------
const REGIONS = {
  norte: {
    id: "norte",
    accent: "#3A4A5F",           // Mediterranean indigo
    accent_soft: "#5A7F9C",
    label: T("Norte de Marruecos", "Northern Morocco", "Nord du Maroc"),
    short:  T("Mediterráneo, Rif, ciudades imperiales del norte.",
              "Mediterranean, Rif, northern imperial cities.",
              "Méditerranée, Rif, cités impériales du nord."),
    body:   T(
      "Chefchaouen y su añil, las medinas andalusíes de Tetuán, Fez, Meknès y Volubilis, Tánger frente al Estrecho y las playas atlánticas de Asilah.",
      "Indigo Chefchaouen, the Andalusian medinas of Tetouan, Fez, Meknès and Volubilis, Tangier facing the Strait and the Atlantic beaches of Asilah.",
      "Chefchaouen et son indigo, les médinas andalouses de Tétouan, Fès, Meknès et Volubilis, Tanger face au Détroit et les plages atlantiques d'Asilah.",
    ),
    highlights: T(
      "Chefchaouen · Fez · Tánger · Tetuán · Volubilis",
      "Chefchaouen · Fez · Tangier · Tetouan · Volubilis",
      "Chefchaouen · Fès · Tanger · Tétouan · Volubilis",
    ),
    routeId: "tourNorth",
    cities: [
      { id: "tng",  cx: 270, cy: 70,  name: T("Tánger", "Tangier", "Tanger") },
      { id: "tet",  cx: 305, cy: 90,  name: T("Tetuán", "Tetouan", "Tétouan") },
      { id: "chf",  cx: 320, cy: 115, name: T("Chefchaouen", "Chefchaouen", "Chefchaouen") },
      { id: "fez",  cx: 345, cy: 175, name: T("Fez", "Fez", "Fès") },
      { id: "mek",  cx: 310, cy: 165, name: T("Meknès", "Meknes", "Meknès") },
    ],
  },
  centro: {
    id: "centro",
    accent: "#C16542",           // terracotta
    accent_soft: "#D97742",
    label: T("Marruecos al completo", "Full Morocco", "Maroc intégral"),
    short:  T("Marrakech, Atlas, costa atlántica y conexiones norte-sur.",
              "Marrakech, Atlas, Atlantic coast and north-south connections.",
              "Marrakech, Atlas, côte atlantique et connexions nord-sud."),
    body:   T(
      "Rutas que enlazan Fez con Marrakech a través del Medio Atlas, las puertas del desierto y el corazón imperial del país.",
      "Routes connecting Fez with Marrakech through the Middle Atlas, the gates of the desert and the country's imperial heart.",
      "Itinéraires reliant Fès à Marrakech à travers le Moyen Atlas, les portes du désert et le cœur impérial du pays.",
    ),
    highlights: T(
      "Marrakech · Aït Benhaddou · Ouarzazate · Essaouira · Ifrane",
      "Marrakech · Aït Benhaddou · Ouarzazate · Essaouira · Ifrane",
      "Marrakech · Aït Benhaddou · Ouarzazate · Essaouira · Ifrane",
    ),
    routeId: "tourFull",
    cities: [
      { id: "rab",  cx: 235, cy: 145, name: T("Rabat", "Rabat", "Rabat") },
      { id: "cas",  cx: 220, cy: 195, name: T("Casablanca", "Casablanca", "Casablanca") },
      { id: "ess",  cx: 185, cy: 285, name: T("Essaouira", "Essaouira", "Essaouira") },
      { id: "mrk",  cx: 270, cy: 295, name: T("Marrakech", "Marrakech", "Marrakech") },
      { id: "ouz",  cx: 330, cy: 320, name: T("Ouarzazate", "Ouarzazate", "Ouarzazate") },
    ],
  },
  sur: {
    id: "sur",
    accent: "#A07042",           // kasbah / desert ochre
    accent_soft: "#C58E5D",
    label: T("Sur de Marruecos", "Southern Morocco", "Sud du Maroc"),
    short:  T("Atlas, kasbahs, Erg Chebbi y oasis del Drâa.",
              "Atlas, kasbahs, Erg Chebbi and Drâa oases.",
              "Atlas, kasbahs, Erg Chebbi et oasis du Drâa."),
    body:   T(
      "La mítica ruta de las mil kasbahs, las dunas del Erg Chebbi, las gargantas del Todra y los oasis del Drâa — la frontera donde el Atlas se rinde al Sáhara.",
      "The mythical road of a thousand kasbahs, Erg Chebbi dunes, Todra Gorges and the Drâa oases — the border where the Atlas surrenders to the Sahara.",
      "La mythique route des mille kasbahs, les dunes de l'Erg Chebbi, les gorges du Todra et les oasis du Drâa — la frontière où l'Atlas se rend au Sahara.",
    ),
    highlights: T(
      "Merzouga · Erg Chebbi · Aït Benhaddou · Skoura · Zagora",
      "Merzouga · Erg Chebbi · Aït Benhaddou · Skoura · Zagora",
      "Merzouga · Erg Chebbi · Aït Benhaddou · Skoura · Zagora",
    ),
    routeId: "tourSouth",
    cities: [
      { id: "err",  cx: 410, cy: 320, name: T("Errachidia", "Errachidia", "Errachidia") },
      { id: "mer",  cx: 450, cy: 380, name: T("Merzouga", "Merzouga", "Merzouga") },
      { id: "zag",  cx: 345, cy: 420, name: T("Zagora", "Zagora", "Zagora") },
    ],
  },
};

const REGION_LIST = [REGIONS.norte, REGIONS.centro, REGIONS.sur];

// -------------------- Categories (formats) --------------------
// Each category maps to one or several regions for highlighting.
const CATEGORIES = [
  {
    id: "south",     icon: "sun",        regions: ["sur"],
    routeId: "tourSouth",
    label: T("Sur", "South", "Sud"),
    desc:  T("Atlas, desierto, kasbahs, Erg Chebbi y oasis.",
             "Atlas, desert, kasbahs, Erg Chebbi and oases.",
             "Atlas, désert, kasbahs, Erg Chebbi et oasis."),
  },
  {
    id: "full",      icon: "globe",      regions: ["norte", "centro", "sur"],
    routeId: "tourFull",
    label: T("Al completo", "Full Morocco", "Intégral"),
    desc:  T("Rutas que conectan el norte, el centro y el sur del país.",
             "Routes connecting the north, centre and south of the country.",
             "Itinéraires reliant le nord, le centre et le sud du pays."),
  },
  {
    id: "north",     icon: "compass",    regions: ["norte"],
    routeId: "tourNorth",
    label: T("Norte", "North", "Nord"),
    desc:  T("Chefchaouen, Fez, Tánger, el Rif y la costa mediterránea.",
             "Chefchaouen, Fez, Tangier, the Rif and the Mediterranean coast.",
             "Chefchaouen, Fès, Tanger, le Rif et la côte méditerranéenne."),
  },
  {
    id: "short",     icon: "wind",       regions: ["centro"],
    routeId: "tourShort",
    label: T("Escapadas", "Short escapes", "Escapades"),
    desc:  T("Zonas concretas accesibles en pocos días.",
             "Specific areas reachable in just a few days.",
             "Zones précises accessibles en quelques jours."),
  },
  {
    id: "adventure", icon: "mountain",   regions: ["centro", "sur"],
    routeId: "tourAdventure",
    label: T("Aventura", "Adventure", "Aventure"),
    desc:  T("Trekking, desierto, rutas 4x4, motos y montaña.",
             "Trekking, desert, 4x4 routes, bikes and mountain.",
             "Trekking, désert, 4x4, motos et montagne."),
  },
  {
    id: "bespoke",   icon: "sparkles",   regions: ["norte", "centro", "sur"],
    routeId: "tourBespoke",
    label: T("A medida", "Tailor-made", "Sur mesure"),
    desc:  T("Diseñamos tu viaje desde cero, cada detalle a tu ritmo.",
             "We build your journey from scratch, every detail at your pace.",
             "Nous concevons votre voyage sur mesure, à votre rythme."),
  },
];

// -------------------- SVG path data (stylised) --------------------
// viewBox 0 0 500 600 — hand-tuned, non-geographic editorial silhouette.
// Three overlapping organic shapes painted with their region accent.
const PATHS = {
  // Norte: top strip — Mediterranean coast / Rif
  norte:
    "M120 60 C 170 30, 240 35, 330 55 C 380 65, 410 85, 425 120 L 410 165 C 380 175, 330 180, 280 175 C 220 168, 175 165, 130 155 C 105 150, 90 130, 95 100 C 100 80, 110 68, 120 60 Z",
  // Centro: middle / Atlas + Atlantic coast
  centro:
    "M95 145 C 130 160, 200 175, 260 178 C 320 180, 370 175, 420 165 L 440 215 C 430 260, 395 305, 360 335 C 320 365, 250 375, 200 365 C 160 355, 130 320, 115 280 C 100 240, 90 200, 95 145 Z",
  // Sur: bottom Sahara + south-east desert wedge
  sur:
    "M115 280 C 140 320, 175 350, 220 370 C 270 385, 330 380, 380 365 C 410 355, 435 340, 455 320 L 470 360 C 475 415, 460 470, 425 510 C 385 545, 320 555, 260 540 C 210 525, 175 495, 150 460 C 125 420, 110 360, 115 280 Z",
};

// -------------------- Component --------------------
export default function MoroccoInteractiveMap() {
  const { lang } = useLanguage();
  const [hoverRegion, setHoverRegion] = useState(null);
  const [activeRegion, setActiveRegion] = useState("centro");
  const [activeCategory, setActiveCategory] = useState(null);

  // Pick category effect: highlight all its regions, then set first as active.
  const highlightedSet = useMemo(() => {
    if (hoverRegion) return new Set([hoverRegion]);
    if (activeCategory) {
      const cat = CATEGORIES.find((c) => c.id === activeCategory);
      return new Set(cat ? cat.regions : []);
    }
    return new Set(activeRegion ? [activeRegion] : []);
  }, [hoverRegion, activeCategory, activeRegion]);

  const activeData = REGIONS[activeRegion] || REGIONS.centro;
  const activeCat = CATEGORIES.find((c) => c.id === activeCategory);

  const onRegionClick = (id) => {
    setActiveRegion(id);
    setActiveCategory(null);
  };
  const onCategoryClick = (id) => {
    setActiveCategory((prev) => (prev === id ? null : id));
    const cat = CATEGORIES.find((c) => c.id === id);
    if (cat && cat.regions[0]) setActiveRegion(cat.regions[0]);
  };

  return (
    <section
      id="morocco-map"
      data-testid="morocco-map"
      className="relative bg-[#F5EFE3] text-[#2C2621] py-20 md:py-28 overflow-hidden border-t border-[#2C2621]/5"
    >
      {/* Lateral berber columns — echo footer aesthetic */}
      <div className="hidden md:block absolute inset-y-0 left-0 w-20 lg:w-28 pointer-events-none berber-bg-cross opacity-30" aria-hidden="true" />
      <div className="hidden md:block absolute inset-y-0 right-0 w-20 lg:w-28 pointer-events-none berber-bg-cross opacity-30" aria-hidden="true" />
      <div className="hidden md:block absolute inset-y-0 left-20 lg:left-28 w-px bg-gradient-to-b from-transparent via-[#A07042]/30 to-transparent pointer-events-none" aria-hidden="true" />
      <div className="hidden md:block absolute inset-y-0 right-20 lg:right-28 w-px bg-gradient-to-b from-transparent via-[#A07042]/30 to-transparent pointer-events-none" aria-hidden="true" />

      <div className="relative max-w-7xl mx-auto px-6 md:px-12">
        {/* Heading */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-end mb-12 md:mb-16">
          <div className="lg:col-span-7">
            <span className="inline-flex items-center gap-3 text-[11px] tracking-[0.35em] uppercase text-[#A07042]">
              <Compass className="w-3.5 h-3.5" strokeWidth={1.6} />
              {pick(COPY.overline, lang)}
              <span className="w-10 h-px bg-[#A07042]/40" />
            </span>
            <h2 className="font-serif-x text-4xl md:text-5xl lg:text-6xl leading-[1.05] tracking-tight mt-5 text-[#2C2621]">
              {pick(COPY.title, lang)}
            </h2>
          </div>
          <div className="lg:col-span-5">
            <p className="text-base md:text-lg text-[#5C5248] leading-relaxed">
              {pick(COPY.body, lang)}
            </p>
          </div>
        </div>

        {/* Map + side panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          {/* SVG map */}
          <div className="lg:col-span-7 relative">
            <div className="relative aspect-[5/6] w-full">
              {/* Subtle parchment background card */}
              <div className="absolute inset-0 bg-[#FBF5EA] border border-[#2C2621]/8 shadow-[0_30px_80px_-40px_rgba(44,38,33,0.35)]" />
              <div className="absolute inset-0 berber-bg-diamond opacity-[0.08] pointer-events-none" aria-hidden="true" />
              <span className="film-grain opacity-30" />

              <svg
                viewBox="0 0 500 600"
                className="relative w-full h-full"
                role="img"
                aria-label="Morocco regions map"
                data-testid="morocco-map-svg"
              >
                <defs>
                  {REGION_LIST.map((r) => (
                    <linearGradient key={r.id} id={`grad-${r.id}`} x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%"  stopColor={r.accent_soft} stopOpacity="0.92" />
                      <stop offset="100%" stopColor={r.accent}      stopOpacity="0.95" />
                    </linearGradient>
                  ))}
                  <filter id="region-glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="8" />
                  </filter>
                </defs>

                {/* Decorative compass + scale */}
                <g opacity="0.35">
                  <circle cx="450" cy="540" r="26" fill="none" stroke="#A07042" strokeWidth="0.8" />
                  <path d="M 450 514 L 454 540 L 450 566 L 446 540 Z" fill="#A07042" />
                  <text x="450" y="510" fontSize="10" textAnchor="middle" fill="#A07042" fontFamily="serif">N</text>
                </g>

                {/* Regions */}
                {REGION_LIST.map((r) => {
                  const highlighted = highlightedSet.has(r.id);
                  const dim = highlightedSet.size > 0 && !highlighted;
                  return (
                    <g
                      key={r.id}
                      data-testid={`map-region-${r.id}`}
                      onMouseEnter={() => setHoverRegion(r.id)}
                      onMouseLeave={() => setHoverRegion(null)}
                      onClick={() => onRegionClick(r.id)}
                      style={{ cursor: "pointer" }}
                    >
                      {/* Glow halo when highlighted */}
                      {highlighted && (
                        <path
                          d={PATHS[r.id]}
                          fill={r.accent}
                          opacity="0.55"
                          filter="url(#region-glow)"
                        />
                      )}
                      <path
                        d={PATHS[r.id]}
                        fill={`url(#grad-${r.id})`}
                        opacity={dim ? 0.32 : highlighted ? 1 : 0.78}
                        stroke={r.accent}
                        strokeWidth={highlighted ? 1.6 : 0.8}
                        style={{ transition: "all 480ms cubic-bezier(0.22,1,0.36,1)" }}
                      />
                    </g>
                  );
                })}

                {/* Cities — render for active/highlighted regions */}
                {REGION_LIST.flatMap((r) => {
                  const show = highlightedSet.has(r.id) || (highlightedSet.size === 0 && r.id === activeRegion);
                  return r.cities.map((c) => (
                    <g key={c.id} style={{ opacity: show ? 1 : 0.18, transition: "opacity 360ms ease" }}>
                      <circle cx={c.cx} cy={c.cy} r="3.2" fill="#FBF5EA" stroke={r.accent} strokeWidth="1.4" />
                      <text
                        x={c.cx + 7}
                        y={c.cy + 3}
                        fontSize="10"
                        fill="#2C2621"
                        fontFamily="serif"
                      >
                        {pick(c.name, lang)}
                      </text>
                    </g>
                  ));
                })}
              </svg>

              {/* Caption corner */}
              <div className="absolute top-5 left-5 text-[10px] tracking-[0.3em] uppercase text-[#A07042]">
                XXVI · Marruecos
              </div>
              <div className="absolute bottom-5 left-5 text-[10px] tracking-[0.3em] uppercase text-[#5C5248]/70">
                Atlas · Sáhara · Mediterráneo
              </div>
            </div>
          </div>

          {/* Side panel */}
          <div className="lg:col-span-5">
            <div
              key={`${activeRegion}-${activeCategory ?? ""}`}
              className="relative bg-[#FBF5EA] border border-[#2C2621]/10 p-7 md:p-9 animate-[fade-in_500ms_ease-out]"
              style={{ borderTopColor: activeData.accent, borderTopWidth: 3 }}
              data-testid="map-panel"
            >
              <span className="inline-flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase" style={{ color: activeData.accent }}>
                <MapPin className="w-3 h-3" strokeWidth={1.6} />
                {pick(activeData.label, lang)}
              </span>

              <h3 className="font-serif-x text-2xl md:text-3xl leading-[1.1] tracking-tight mt-4 text-[#2C2621]">
                {pick(activeCat ? activeCat.label : activeData.label, lang)}
              </h3>

              <p className="font-serif-x-italic text-lg md:text-xl text-[#5C5248] mt-4 leading-[1.4]">
                {pick(activeCat ? activeCat.desc : activeData.short, lang)}
              </p>

              <p className="text-sm md:text-[15px] text-[#3D352C] mt-5 leading-[1.85]">
                {pick(activeData.body, lang)}
              </p>

              <div className="mt-6 pt-5 border-t border-[#2C2621]/12">
                <span className="block text-[10px] tracking-[0.3em] uppercase text-[#A07042] mb-2">
                  {pick(T("Lugares destacados", "Highlights", "Lieux emblématiques"), lang)}
                </span>
                <span className="text-[13px] text-[#3D352C]">{pick(activeData.highlights, lang)}</span>
              </div>

              <Link
                to={pathFor(lang, (activeCat && activeCat.routeId) || activeData.routeId)}
                data-testid="map-panel-cta"
                className="mt-7 inline-flex items-center gap-3 text-[#FDFBF7] px-7 py-4 text-[11px] tracking-[0.25em] uppercase transition-all duration-300 hover:opacity-90"
                style={{ background: activeData.accent }}
              >
                {pick(COPY.cta_discover, lang)}
                <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.6} />
              </Link>
            </div>

            {/* Region selector pills */}
            <div className="mt-8">
              <span className="block text-[10px] tracking-[0.3em] uppercase text-[#A07042] mb-3 inline-flex items-center gap-2">
                <Compass className="w-3 h-3" strokeWidth={1.6} />
                {pick(COPY.legend_regions, lang)}
              </span>
              <div className="flex flex-wrap gap-2">
                {REGION_LIST.map((r) => {
                  const isActive = activeRegion === r.id && !activeCategory;
                  return (
                    <button
                      key={r.id}
                      type="button"
                      data-testid={`map-region-pill-${r.id}`}
                      onClick={() => onRegionClick(r.id)}
                      onMouseEnter={() => setHoverRegion(r.id)}
                      onMouseLeave={() => setHoverRegion(null)}
                      className={`inline-flex items-center gap-2 text-[11px] tracking-[0.22em] uppercase px-4 py-2.5 border transition-all duration-300 ${
                        isActive
                          ? "text-[#FDFBF7] border-transparent"
                          : "text-[#3D352C] border-[#2C2621]/20 hover:border-[#2C2621]/60 bg-[#FBF5EA]"
                      }`}
                      style={isActive ? { background: r.accent, borderColor: r.accent } : undefined}
                    >
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: r.accent }} />
                      {pick(r.label, lang)}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Format selector */}
            <div className="mt-7">
              <span className="block text-[10px] tracking-[0.3em] uppercase text-[#A07042] mb-3 inline-flex items-center gap-2">
                <Sparkles className="w-3 h-3" strokeWidth={1.6} />
                {pick(COPY.legend_formats, lang)}
              </span>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((c) => {
                  const isActive = activeCategory === c.id;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      data-testid={`map-cat-${c.id}`}
                      onClick={() => onCategoryClick(c.id)}
                      className={`inline-flex items-center gap-2 text-[11px] tracking-[0.22em] uppercase px-4 py-2.5 border transition-all duration-300 ${
                        isActive
                          ? "bg-[#2C2621] text-[#FDFBF7] border-[#2C2621]"
                          : "text-[#3D352C] border-[#2C2621]/20 hover:border-[#2C2621]/60 bg-[#FBF5EA]"
                      }`}
                    >
                      {pick(c.label, lang)}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
