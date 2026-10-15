import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Compass, MapPin } from "lucide-react";
import { geoMercator, geoPath } from "d3-geo";
import { merge } from "topojson-client";
import { useLanguage, pick } from "@/contexts/LanguageContext";
import { pathFor } from "@/lib/routes";
import { MAP_ZONES, buildMoroccoTripMapIndex, tripsForMapSelection } from "@/lib/moroccoTripMap";
import { tripHeroSlot, tripTextSlot } from "@/lib/tripHero";
import EditableImage from "@/components/EditableImage";
import EditableText from "@/components/EditableText";
import "./HomeMoroccoTripMap.css";

const COPY = {
  eyebrow: { es: "Explora Marruecos", en: "Explore Morocco", fr: "Explorez le Maroc" },
  title: { es: "Cada región, un viaje por descubrir", en: "A journey in every region", fr: "Un voyage dans chaque région" },
  intro: { es: "Selecciona una región del mapa para descubrir los programas que pasan por allí.", en: "Choose a region on the map to discover trips that visit it.", fr: "Choisissez une région sur la carte pour découvrir les voyages qui y passent." },
  all: { es: "Todas las zonas", en: "All regions", fr: "Toutes les régions" },
  results: { es: "programas relacionados", en: "related programmes", fr: "programmes associés" },
  view: { es: "Ver programa completo", en: "View full programme", fr: "Voir le programme complet" },
  more: { es: "Mostrar más programas", en: "Show more programmes", fr: "Voir plus de programmes" },
  empty: { es: "No hay programas publicados para esta selección.", en: "No published programmes for this selection.", fr: "Aucun programme publié pour cette sélection." },
  map: { es: "Mapa interactivo de destinos de Marruecos", en: "Interactive map of Morocco destinations", fr: "Carte interactive des destinations du Maroc" },
};

const WIDTH = 480;
const HEIGHT = 620;
const ZONE_COLORS = ["#426270", "#7A6754", "#4F7D83", "#7A6754", "#B46B45", "#A65332"];

export default function HomeMoroccoTripMap() {
  const { lang } = useLanguage();
  const [topology, setTopology] = useState(null);
  const [selection, setSelection] = useState(null);
  const [visibleCount, setVisibleCount] = useState(6);
  const trips = useMemo(() => buildMoroccoTripMapIndex(), []);

  useEffect(() => {
    let active = true;
    fetch("/geo/countries-110m.json")
      .then((response) => { if (!response.ok) throw new Error("Map unavailable"); return response.json(); })
      .then((data) => { if (active) setTopology(data); })
      .catch(() => {});
    return () => { active = false; };
  }, []);

  const geo = useMemo(() => {
    if (!topology?.objects?.countries) return null;
    const parts = topology.objects.countries.geometries.filter((item) => ["504", "732"].includes(String(item.id)));
    if (!parts.length) return null;
    const shape = merge(topology, parts);
    const projection = geoMercator().fitExtent([[48, 30], [WIDTH - 48, HEIGHT - 30]], shape);
    return { outline: geoPath(projection)(shape), projection };
  }, [topology]);

  const available = selection ? tripsForMapSelection(trips, selection) : trips;
  const selectedLabel = pick(MAP_ZONES.find((zone) => zone.id === selection?.id)?.label, lang);
  const choose = (next) => { setSelection(next); setVisibleCount(6); };

  return (
    <section id="mapa-viajes" data-testid="home-morocco-trip-map" className="morocco-trip-map-section py-20 md:py-28 scroll-mt-[172px]">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="max-w-3xl mb-10 md:mb-14">
          <span className="overline inline-flex items-center gap-2 text-[#C16542]"><Compass size={15} />{pick(COPY.eyebrow, lang)}</span>
          <h2 className="font-serif-x text-4xl md:text-5xl text-[#2C2621] leading-tight mt-4">{pick(COPY.title, lang)}</h2>
          <p className="mt-5 text-[#5C5248] text-base md:text-lg leading-relaxed">{pick(COPY.intro, lang)}</p>
        </div>

        <div className="morocco-trip-map-layout">
          <div className="morocco-trip-map-frame">
            <div className="morocco-trip-map-art">
              {geo ? <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="img" aria-label={pick(COPY.map, lang)} data-testid="morocco-silhouette">
                <defs><clipPath id="morocco-trip-map-clip"><path d={geo.outline} /></clipPath></defs>
                <path d={geo.outline} fill="#D9BE9C" stroke="#9F785C" strokeWidth="1.4" />
                <g clipPath="url(#morocco-trip-map-clip)" aria-hidden="true">
                  {MAP_ZONES.map((zone, index) => {
                    const point = geo.projection(zone.center);
                    return point && <circle key={zone.id} cx={point[0]} cy={point[1]} r={zone.id === "sahara" ? 100 : 67}
                      data-testid={`map-zone-area-${zone.id}`} onClick={() => choose({ type: "zone", id: zone.id })}
                      className="morocco-trip-map-zone-area" fill={ZONE_COLORS[index]}
                      opacity={selection?.type === "zone" && selection.id === zone.id ? 0.52 : 0.28} />;
                  })}
                </g>
                <path d={geo.outline} fill="none" stroke="#8E6C54" strokeWidth="1.4" pointerEvents="none" />
                {MAP_ZONES.map((zone) => {
                  const point = geo.projection(zone.center);
                  return point && <g key={zone.id} data-testid={`map-zone-${zone.id}`} role="button" tabIndex={0}
                    aria-label={pick(zone.label, lang)} aria-pressed={selection?.type === "zone" && selection.id === zone.id}
                    onClick={() => choose({ type: "zone", id: zone.id })}
                    onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); choose({ type: "zone", id: zone.id }); } }}
                    className="morocco-trip-map-zone">
                    <title>{pick(zone.label, lang)}</title>
                    <circle cx={point[0]} cy={point[1]} r="23" className="morocco-trip-map-zone-hit" />
                    <circle cx={point[0]} cy={point[1]} r="7" className="morocco-trip-map-zone-dot" />
                  </g>;
                })}
              </svg> : <div className="morocco-trip-map-loading" aria-hidden="true" />}
            </div>
            <div className="morocco-trip-map-legend">
              <button type="button" onClick={() => choose(null)} className={!selection ? "is-active" : ""} aria-pressed={!selection}>{pick(COPY.all, lang)}</button>
              {MAP_ZONES.map((zone) => <button key={zone.id} type="button" onClick={() => choose({ type: "zone", id: zone.id })}
                className={selection?.type === "zone" && selection.id === zone.id ? "is-active" : ""}
                aria-pressed={selection?.type === "zone" && selection.id === zone.id}>{pick(zone.label, lang)}</button>)}
            </div>
          </div>

          <div className="morocco-trip-map-results" aria-live="polite">
            <div className="morocco-trip-map-results-heading">
              <div><span className="overline text-[#C16542]">{selectedLabel || pick(COPY.all, lang)}</span>
                <h3 className="font-serif-x text-3xl text-[#2C2621] mt-2">{available.length} {pick(COPY.results, lang)}</h3></div>
              <MapPin size={22} strokeWidth={1.4} className="text-[#C16542]" aria-hidden="true" />
            </div>
            {available.length ? <div className="morocco-trip-map-cards">
              {available.slice(0, visibleCount).map((trip) => <article className="morocco-trip-map-card" key={trip.routeId}>
                <Link to={pathFor(lang, trip.routeId)} className="morocco-trip-map-card-image" aria-label={`${pick(COPY.view, lang)}: ${pick(trip.title, lang)}`}>
                  <EditableImage slot={tripHeroSlot(trip.routeId)} fallback={trip.image} alt={pick(trip.title, lang)} imgProps={{ loading: "lazy" }} className="w-full h-full object-cover" />
                </Link>
                <div className="morocco-trip-map-card-body">
                  <EditableText as="span" slot={tripTextSlot(trip.routeId, "duration")} defaults={trip.duration} multiline={false} className="overline text-[#C16542] block" />
                  <EditableText as="h4" slot={tripTextSlot(trip.routeId, "title")} defaults={trip.title} multiline={false} className="font-serif-x text-xl text-[#2C2621] leading-tight mt-2 block" />
                  <EditableText as="p" slot={tripTextSlot(trip.routeId, "summary")} defaults={trip.summary} className="text-sm text-[#5C5248] leading-relaxed mt-2 block" />
                  <Link to={pathFor(lang, trip.routeId)} className="morocco-trip-map-card-link">{pick(COPY.view, lang)} <ArrowUpRight size={15} /></Link>
                </div>
              </article>)}
            </div> : <p className="text-[#5C5248] py-10">{pick(COPY.empty, lang)}</p>}
            {available.length > visibleCount && <button type="button" className="morocco-trip-map-more" onClick={() => setVisibleCount((count) => count + 6)}>{pick(COPY.more, lang)}</button>}
          </div>
        </div>
      </div>
    </section>
  );
}
