import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { geoEquirectangular, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import { useLanguage, pick } from "@/contexts/LanguageContext";
import { pathFor } from "@/lib/routes";

/* ============================================================
   WorldMapSection — elegant parchment world map for the Home.
   The whole world is visible but ONLY Morocco (+ W. Sahara) is
   interactive; clicking it navigates to the interactive Morocco
   map (regions). Built with d3-geo + a local world topojson, so
   we have full control over the Xaluca cartographic styling.
============================================================ */

const MOROCCO_IDS = new Set(["504", "732"]);      // Morocco + W. Sahara
const EXCLUDE_IDS = new Set(["010", "260"]);      // Antarctica & Fr. S. Antarctic Lands

const W = 1000;
const H = 560;

const COPY = {
  eyebrow: { es: "Dónde viajamos", en: "Where we travel", fr: "Où nous voyageons" },
  title: {
    es: "Marruecos, en el corazón del mundo",
    en: "Morocco, at the heart of the world",
    fr: "Le Maroc, au cœur du monde",
  },
  desc: {
    es: "Explora el país desde el mapa: haz clic en Marruecos para descubrir todas sus regiones.",
    en: "Explore the country from the map: click on Morocco to discover all its regions.",
    fr: "Explorez le pays depuis la carte : cliquez sur le Maroc pour découvrir toutes ses régions.",
  },
  label: { es: "Marruecos", en: "Morocco", fr: "Maroc" },
  cta: { es: "Descubrir Marruecos", en: "Discover Morocco", fr: "Découvrir le Maroc" },
};

const OCEANS = [
  { id: "arctic", name: { es: "Ártico", en: "Arctic", fr: "Arctique" }, coord: [-30, 80] },
  { id: "atl", name: { es: "Océano Atlántico", en: "Atlantic Ocean", fr: "Océan Atlantique" }, coord: [-42, 26] },
  { id: "pac1", name: { es: "Océano Pacífico", en: "Pacific Ocean", fr: "Océan Pacifique" }, coord: [-148, 6] },
  { id: "pac2", name: { es: "Océano Pacífico", en: "Pacific Ocean", fr: "Océan Pacifique" }, coord: [175, -8] },
  { id: "ind", name: { es: "Océano Índico", en: "Indian Ocean", fr: "Océan Indien" }, coord: [80, -30] },
];

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

  const { paths, moroccoPath, label, oceans } = useMemo(() => {
    if (!topo) return { paths: [], moroccoPath: "", label: null, oceans: [] };
    const fc = feature(topo, topo.objects.countries);
    const feats = fc.features.filter((f) => !EXCLUDE_IDS.has(String(f.id)));
    const projection = geoEquirectangular().fitSize([W, H], { type: "FeatureCollection", features: feats });
    const gp = geoPath(projection);

    const others = feats.filter((f) => !MOROCCO_IDS.has(String(f.id)));
    const morFeats = feats.filter((f) => MOROCCO_IDS.has(String(f.id)));

    const mor = feats.find((f) => String(f.id) === "504");
    const c = mor ? gp.centroid(mor) : null;
    const label = c && !Number.isNaN(c[0]) ? { x: c[0], y: c[1] } : null;

    const oceans = OCEANS.map((o) => {
      const p = projection(o.coord);
      return p ? { ...o, x: p[0], y: p[1] } : null;
    }).filter(Boolean);

    return {
      paths: others.map((f) => ({ id: String(f.id), d: gp(f) })),
      moroccoPath: morFeats.map((f) => gp(f)).join(" "),
      label,
      oceans,
    };
  }, [topo]);

  const goMorocco = () => navigate(pathFor(lang, "whatToSee"));

  const labelText = pick(COPY.label, lang);
  const labelW = labelText.length * 8.4 + 26;

  return (
    <section data-testid="home-world-map" className="relative bg-[#E8E0CF] py-20 md:py-28 overflow-hidden">
      <div className="absolute inset-0 berber-bg-cross opacity-[0.10] pointer-events-none" aria-hidden="true" />
      <span className="film-grain pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-6 md:px-12">
        <div className="text-center max-w-2xl mx-auto mb-10 md:mb-14">
          <span className="overline text-[#C16542]">{pick(COPY.eyebrow, lang)}</span>
          <h2 className="font-serif-x text-3xl md:text-4xl text-[#2C2621] mt-3 leading-tight">
            {pick(COPY.title, lang)}
          </h2>
          <p className="mt-4 text-sm md:text-base text-[#5C5248] leading-relaxed">{pick(COPY.desc, lang)}</p>
        </div>

        <div className="relative">
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="w-full h-auto"
            role="img"
            aria-label={pick(COPY.title, lang)}
          >
            {/* Non-interactive countries */}
            <g>
              {paths.map((p, i) => (
                <path
                  key={`country-${i}`}
                  d={p.d}
                  fill="#CFC4A6"
                  stroke="#B3A682"
                  strokeWidth={0.5}
                  vectorEffect="non-scaling-stroke"
                  className="pointer-events-none"
                />
              ))}
            </g>

            {/* Ocean labels */}
            {oceans.map((o) => (
              <text
                key={o.id}
                x={o.x}
                y={o.y}
                textAnchor="middle"
                fill="#8C7B6B"
                style={{ fontSize: 12, letterSpacing: "0.18em", fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                className="select-none pointer-events-none uppercase"
              >
                {pick(o.name, lang).toUpperCase()}
              </text>
            ))}

            {/* Morocco — the only interactive country */}
            {moroccoPath && (
              <path
                d={moroccoPath}
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
                strokeWidth={0.7}
                vectorEffect="non-scaling-stroke"
                className="cursor-pointer transition-[fill] duration-300 outline-none"
                style={{ filter: hover ? "drop-shadow(0 3px 12px rgba(110,45,23,0.55))" : "none" }}
              />
            )}

            {/* "Marruecos" label chip */}
            {label && (
              <g
                data-testid="world-map-morocco-label"
                onClick={goMorocco}
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
                className="cursor-pointer"
              >
                <rect
                  x={label.x + 10}
                  y={label.y - 14}
                  width={labelW}
                  height={28}
                  rx={2}
                  fill="#FDFBF7"
                  stroke="#6E2D17"
                  strokeOpacity={0.18}
                  strokeWidth={1}
                  style={{ filter: "drop-shadow(0 4px 12px rgba(44,38,33,0.18))" }}
                />
                <text
                  x={label.x + 10 + labelW / 2}
                  y={label.y + 5}
                  textAnchor="middle"
                  fill="#2C2621"
                  style={{ fontSize: 15, fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                  className="select-none"
                >
                  {labelText}
                </text>
              </g>
            )}
          </svg>

          {!topo && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[#5C5248] text-sm tracking-[0.2em] uppercase animate-pulse">
                {{ es: "Cargando mapa…", en: "Loading map…", fr: "Chargement…" }[lang] || "Cargando mapa…"}
              </span>
            </div>
          )}
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
