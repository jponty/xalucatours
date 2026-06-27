import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { geoNaturalEarth1, geoPath, geoGraticule10 } from "d3-geo";
import { feature } from "topojson-client";
import { useLanguage, pick } from "@/contexts/LanguageContext";
import { pathFor } from "@/lib/routes";

/* ============================================================
   WorldMapSection — Home "where we travel" map with an
   adventure / explorer (vintage nautical chart) aesthetic.
   The whole world is visible but ONLY Morocco (+ W. Sahara)
   is interactive; clicking it goes to the interactive Morocco
   regions map. Built with d3-geo (geoNaturalEarth1) so the
   globe keeps correct proportions and never looks stretched.
   Country/ocean/Morocco LABELS are HTML overlays (real px,
   fully responsive, never clipped by the SVG scaling).
============================================================ */

const MOROCCO_IDS = new Set(["504", "732"]);   // Morocco + W. Sahara
const EXCLUDE_IDS = new Set(["010", "260"]);   // Antarctica & Fr. S. Antarctic Lands

const FIT_W = 1000;
const FIT_H = 560;
const PAD = 26; // viewBox padding (so nothing touches the edges)

const COPY = {
  eyebrow: { es: "Dónde viajamos", en: "Where we travel", fr: "Où nous voyageons" },
  title: {
    es: "Marruecos, en el corazón del mundo",
    en: "Morocco, at the heart of the world",
    fr: "Le Maroc, au cœur du monde",
  },
  desc: {
    es: "Traza tu próxima expedición: haz clic en Marruecos para descubrir todas sus regiones.",
    en: "Chart your next expedition: click on Morocco to discover all its regions.",
    fr: "Tracez votre prochaine expédition : cliquez sur le Maroc pour découvrir toutes ses régions.",
  },
  label: { es: "Marruecos", en: "Morocco", fr: "Maroc" },
  cta: { es: "Descubrir Marruecos", en: "Discover Morocco", fr: "Découvrir le Maroc" },
  loading: { es: "Trazando el mapa…", en: "Charting the map…", fr: "Tracé de la carte…" },
};

const OCEANS = [
  { id: "arctic", name: { es: "Ártico", en: "Arctic", fr: "Arctique" }, coord: [-12, 74] },
  { id: "atl", name: { es: "Océano Atlántico", en: "Atlantic Ocean", fr: "Océan Atlantique" }, coord: [-40, 24] },
  { id: "pac1", name: { es: "Océano Pacífico", en: "Pacific Ocean", fr: "Océan Pacifique" }, coord: [-150, 8] },
  { id: "pac2", name: { es: "Océano Pacífico", en: "Pacific Ocean", fr: "Océan Pacifique" }, coord: [165, -14] },
  { id: "ind", name: { es: "Océano Índico", en: "Indian Ocean", fr: "Océan Indien" }, coord: [82, -28] },
];

/* Vintage compass rose (decorative) */
const CompassRose = ({ className = "" }) => (
  <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
    <circle cx="50" cy="50" r="46" fill="none" stroke="#6E2D17" strokeOpacity="0.35" strokeWidth="1.2" />
    <circle cx="50" cy="50" r="38" fill="none" stroke="#6E2D17" strokeOpacity="0.18" strokeWidth="0.8" strokeDasharray="2 3" />
    {/* diagonal (minor) points */}
    <g fill="#6E2D17" opacity="0.28">
      <polygon points="50,50 68,32 58,42" />
      <polygon points="50,50 32,32 42,42" />
      <polygon points="50,50 68,68 58,58" />
      <polygon points="50,50 32,68 42,58" />
    </g>
    {/* main (N/S/E/W) points */}
    <polygon points="50,8 54,50 50,50 46,50" fill="#6E2D17" />
    <polygon points="50,92 54,50 50,50 46,50" fill="#6E2D17" opacity="0.55" />
    <polygon points="8,50 50,54 50,50 50,46" fill="#6E2D17" opacity="0.55" />
    <polygon points="92,50 50,54 50,50 50,46" fill="#6E2D17" opacity="0.55" />
    <circle cx="50" cy="50" r="3.4" fill="#6E2D17" />
    <text x="50" y="6" textAnchor="middle" fill="#6E2D17" style={{ fontSize: 11, fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 600 }}>N</text>
  </svg>
);

export default function WorldMapSection() {
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const [topo, setTopo] = useState(null);
  const [hover, setHover] = useState(false);

  useEffect(() => {
    let alive = true;
    fetch("/geo/countries-110m.json")
      .then((r) => r.json())
      .then((d) => { if (alive) setTopo(d); })
      .catch(() => {});
    return () => { alive = false; };
  }, []);

  const map = useMemo(() => {
    if (!topo) return null;
    const fc = feature(topo, topo.objects.countries);
    const feats = fc.features.filter((f) => !EXCLUDE_IDS.has(String(f.id)));
    const projection = geoNaturalEarth1().fitSize([FIT_W, FIT_H], { type: "FeatureCollection", features: feats });
    const gp = geoPath(projection);

    // Tight viewBox around the actual landmass (no stretching / empty bands).
    const [[bx0, by0], [bx1, by1]] = gp.bounds({ type: "FeatureCollection", features: feats });
    const vb = { x: bx0 - PAD, y: by0 - PAD, w: (bx1 - bx0) + PAD * 2, h: (by1 - by0) + PAD * 2 };

    const others = feats.filter((f) => !MOROCCO_IDS.has(String(f.id)));
    const morFeats = feats.filter((f) => MOROCCO_IDS.has(String(f.id)));
    const mor = feats.find((f) => String(f.id) === "504");
    const c = mor ? gp.centroid(mor) : null;

    // Dashed expedition arc from Europe → Morocco.
    const a = projection([4, 47]);
    const b = projection([-7, 31.5]);
    let route = "";
    if (a && b) {
      const mx = (a[0] + b[0]) / 2;
      const my = (a[1] + b[1]) / 2 - Math.abs(a[0] - b[0]) * 0.18 - 18;
      route = `M ${a[0]} ${a[1]} Q ${mx} ${my} ${b[0]} ${b[1]}`;
    }

    const oceans = OCEANS.map((o) => {
      const p = projection(o.coord);
      return p ? { ...o, x: p[0], y: p[1] } : null;
    }).filter(Boolean);

    return {
      vb,
      graticule: gp(geoGraticule10()),
      countries: others.map((f, i) => ({ key: `c-${i}`, d: gp(f) })),
      moroccoPath: morFeats.map((f) => gp(f)).join(" "),
      morocco: c && !Number.isNaN(c[0]) ? { x: c[0], y: c[1] } : null,
      route,
      routeStart: a ? { x: a[0], y: a[1] } : null,
      oceans,
    };
  }, [topo]);

  const goMorocco = () => navigate(pathFor(lang, "whatToSee"));

  // Convert SVG/viewBox coords → container percentages (overlay alignment).
  const pct = (x, y) =>
    map ? { left: `${((x - map.vb.x) / map.vb.w) * 100}%`, top: `${((y - map.vb.y) / map.vb.h) * 100}%` } : { left: "50%", top: "50%" };

  const aspect = map ? `${map.vb.w} / ${map.vb.h}` : "16 / 9";
  const labelText = pick(COPY.label, lang);

  return (
    <section data-testid="home-world-map" className="relative bg-[#E8E0CF] py-20 md:py-28 overflow-hidden">
      <div className="absolute inset-0 berber-bg-cross opacity-[0.10] pointer-events-none" aria-hidden="true" />
      <span className="film-grain pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-6 md:px-12">
        <div className="text-center max-w-2xl mx-auto mb-10 md:mb-14">
          <span className="overline text-[#C16542]">{pick(COPY.eyebrow, lang)}</span>
          <h2 className="font-serif-x text-3xl md:text-4xl text-[#2C2621] mt-3 leading-tight">{pick(COPY.title, lang)}</h2>
          <p className="mt-4 text-sm md:text-base text-[#5C5248] leading-relaxed">{pick(COPY.desc, lang)}</p>
        </div>

        {/* Framed parchment chart */}
        <div className="relative bg-[#EDE6D4] border border-[#6E2D17]/30 p-2.5 md:p-4 shadow-[0_24px_60px_-30px_rgba(44,38,33,0.5)]">
          <div className="relative border border-[#6E2D17]/15">
            {/* corner ticks */}
            {["top-1 left-1", "top-1 right-1", "bottom-1 left-1", "bottom-1 right-1"].map((pos) => (
              <span key={pos} className={`absolute ${pos} w-3 h-3 border-[#6E2D17]/40 pointer-events-none z-[5]
                ${pos.includes("top") ? "border-t" : "border-b"} ${pos.includes("left") ? "border-l" : "border-r"}`} />
            ))}

            <div className="relative w-full overflow-hidden" style={{ aspectRatio: aspect }}>
              {map && (
                <svg
                  viewBox={`${map.vb.x} ${map.vb.y} ${map.vb.w} ${map.vb.h}`}
                  className="absolute inset-0 w-full h-full"
                  preserveAspectRatio="xMidYMid meet"
                  role="img"
                  aria-label={pick(COPY.title, lang)}
                >
                  {/* graticule — nautical chart grid */}
                  <path d={map.graticule} fill="none" stroke="#9C8A6A" strokeOpacity="0.35" strokeWidth="0.5"
                    strokeDasharray="1.5 6" vectorEffect="non-scaling-stroke" className="pointer-events-none" />

                  {/* non-interactive countries */}
                  <g>
                    {map.countries.map((p) => (
                      <path key={p.key} d={p.d} fill="#CFC4A6" stroke="#A8997410" strokeWidth="0.5"
                        vectorEffect="non-scaling-stroke" className="pointer-events-none" />
                    ))}
                    {/* thin coastlines on top for definition */}
                    {map.countries.map((p) => (
                      <path key={`s-${p.key}`} d={p.d} fill="none" stroke="#9C8A6A" strokeOpacity="0.5"
                        strokeWidth="0.5" vectorEffect="non-scaling-stroke" className="pointer-events-none" />
                    ))}
                  </g>

                  {/* expedition route */}
                  {map.route && (
                    <path d={map.route} fill="none" stroke="#6E2D17" strokeOpacity="0.55" strokeWidth="1.4"
                      strokeDasharray="1 5" strokeLinecap="round" vectorEffect="non-scaling-stroke" className="pointer-events-none" />
                  )}
                  {map.routeStart && (
                    <circle cx={map.routeStart.x} cy={map.routeStart.y} r="2.4" fill="#6E2D17"
                      vectorEffect="non-scaling-stroke" className="pointer-events-none" />
                  )}

                  {/* Morocco — the only interactive country */}
                  {map.moroccoPath && (
                    <path
                      d={map.moroccoPath}
                      data-testid="world-map-morocco"
                      role="button"
                      tabIndex={0}
                      aria-label={labelText}
                      onClick={goMorocco}
                      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); goMorocco(); } }}
                      onMouseEnter={() => setHover(true)}
                      onMouseLeave={() => setHover(false)}
                      fill={hover ? "#8A3A1E" : "#6E2D17"}
                      stroke="#FDFBF7"
                      strokeWidth="0.8"
                      vectorEffect="non-scaling-stroke"
                      className="cursor-pointer transition-[fill] duration-300 outline-none"
                      style={{ filter: hover ? "drop-shadow(0 3px 12px rgba(110,45,23,0.5))" : "none" }}
                    />
                  )}
                </svg>
              )}

              {/* ---- HTML label overlay (real px → always legible, never clipped) ---- */}
              {map && (
                <div className="absolute inset-0 pointer-events-none">
                  {/* ocean labels (hidden on small screens to avoid clutter) */}
                  {map.oceans.map((o) => (
                    <span
                      key={o.id}
                      style={pct(o.x, o.y)}
                      className="hidden md:block absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap font-serif-x uppercase tracking-[0.22em] text-[11px] lg:text-[13px] text-[#8C7B6B]/90 select-none"
                    >
                      {pick(o.name, lang)}
                    </span>
                  ))}

                  {/* Morocco label chip (always visible, clickable) */}
                  {map.morocco && (
                    <button
                      type="button"
                      data-testid="world-map-morocco-label"
                      onClick={goMorocco}
                      onMouseEnter={() => setHover(true)}
                      onMouseLeave={() => setHover(false)}
                      style={{ left: pct(map.morocco.x, map.morocco.y).left, top: pct(map.morocco.x, map.morocco.y).top }}
                      className="pointer-events-auto absolute translate-x-2 -translate-y-1/2 whitespace-nowrap bg-[#FDFBF7] border border-[#6E2D17]/25 text-[#2C2621] font-serif-x text-[12px] md:text-sm px-2.5 py-1 shadow-[0_6px_16px_-6px_rgba(44,38,33,0.35)] hover:bg-[#6E2D17] hover:text-[#FDFBF7] transition-colors duration-300 inline-flex items-center gap-1.5"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#6E2D17] inline-block" />
                      {labelText}
                    </button>
                  )}
                </div>
              )}

              {/* compass rose */}
              {map && (
                <CompassRose className="hidden sm:block absolute bottom-3 left-3 w-14 h-14 md:w-[72px] md:h-[72px] opacity-90 pointer-events-none z-[4]" />
              )}

              {!topo && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[#5C5248] text-sm tracking-[0.2em] uppercase animate-pulse">{pick(COPY.loading, lang)}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="text-center mt-10">
          <button
            type="button"
            data-testid="world-map-cta"
            onClick={goMorocco}
            className="inline-flex items-center gap-2 bg-[#C16542] hover:bg-[#A35133] text-[#FDFBF7] px-7 py-3.5 text-[11px] tracking-[0.28em] uppercase transition-colors duration-300"
          >
            {pick(COPY.cta, lang)}
          </button>
        </div>
      </div>
    </section>
  );
}
