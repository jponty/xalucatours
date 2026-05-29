import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { MapContainer, TileLayer, CircleMarker, Tooltip, useMap } from "react-leaflet";
import { ArrowRight, MapPin, Sparkles, Route, Compass } from "lucide-react";
import { useLanguage, pick } from "@/contexts/LanguageContext";
import { ROUTES, pathFor } from "@/lib/routes";
import EditableText from "@/components/EditableText";

/* ============================================================
   ToursRegionMap — interactive geographic explorer for /viajes
   ------------------------------------------------------------
   Six Moroccan regions plotted on a light CartoDB basemap. Hover
   or click a marker (or a region chip) to reveal an editorial
   detail card with: name · description · highlighted experiences
   · related itineraries · CTA to browse that region's trips.
============================================================ */

const T = (es, en, fr) => ({ es, en, fr });

const REGIONS = [
  {
    id: "north",
    accent: "#3A4A5F",
    coords: [35.17, -5.27],
    routeId: "tourNorth",
    name: T("Norte de Marruecos", "Northern Morocco", "Nord du Maroc"),
    desc: T(
      "El Rif, el Mediterráneo y la mágica medina azul de Chefchaouen.",
      "The Rif, the Mediterranean and the magical blue medina of Chefchaouen.",
      "Le Rif, la Méditerranée et la magique médina bleue de Chefchaouen.",
    ),
    experiences: [
      T("Chefchaouen azul", "Blue Chefchaouen", "Chefchaouen bleue"),
      T("Cascadas de Akchour", "Akchour waterfalls", "Cascades d'Akchour"),
      T("Tánger cosmopolita", "Cosmopolitan Tangier", "Tanger cosmopolite"),
    ],
    itineraries: [
      { routeId: "tourCiudadesImperialesRif67", label: T("Imperiales + Rif · 6n/7d", "Imperial + Rif · 6n/7d", "Impériales + Rif · 6n/7j") },
      { routeId: "tourNorth", label: T("Ver todo el norte", "See all the north", "Voir tout le nord") },
    ],
  },
  {
    id: "imperial",
    accent: "#A07042",
    coords: [34.03, -5.0],
    routeId: "tourNorteCiudadesImperiales",
    name: T("Ciudades Imperiales", "Imperial Cities", "Cités Impériales"),
    desc: T(
      "Fez, Meknès, Rabat y Marrakech: mil años de historia y artesanía.",
      "Fez, Meknès, Rabat and Marrakech: a thousand years of history and craft.",
      "Fès, Meknès, Rabat et Marrakech : mille ans d'histoire et d'artisanat.",
    ),
    experiences: [
      T("Medina de Fez UNESCO", "Fez UNESCO medina", "Médina de Fès UNESCO"),
      T("Volubilis romano", "Roman Volubilis", "Volubilis romain"),
      T("Zocos y artesanos", "Souks & artisans", "Souks & artisans"),
    ],
    itineraries: [
      { routeId: "tourCiudadesImperiales45", label: T("Ciudades imperiales · 4n/5d", "Imperial cities · 4n/5d", "Cités impériales · 4n/5j") },
      { routeId: "tourCiudadesImperiales67", label: T("Imperiales ampliado · 6n/7d", "Extended imperial · 6n/7d", "Impériales étendu · 6n/7j") },
    ],
  },
  {
    id: "coast",
    accent: "#5A7F9C",
    coords: [31.51, -9.77],
    routeId: "tourMarrakechEssHub",
    name: T("Costa Atlántica", "Atlantic Coast", "Côte Atlantique"),
    desc: T(
      "Essaouira, la perla del Atlántico: viento, murallas y luz dorada.",
      "Essaouira, the pearl of the Atlantic: wind, ramparts and golden light.",
      "Essaouira, la perle de l'Atlantique : vent, remparts et lumière dorée.",
    ),
    experiences: [
      T("Medina de Essaouira", "Essaouira medina", "Médina d'Essaouira"),
      T("Puerto de pescadores", "Fishing harbour", "Port de pêche"),
      T("Kitesurf y playa", "Kitesurf & beach", "Kitesurf & plage"),
    ],
    itineraries: [
      { routeId: "tourMarrakechEss45", label: T("Marrakech – Essaouira · 4n/5d", "Marrakech – Essaouira · 4n/5d", "Marrakech – Essaouira · 4n/5j") },
      { routeId: "tourMarrakechEss67", label: T("Marrakech – Essaouira · 6n/7d", "Marrakech – Essaouira · 6n/7d", "Marrakech – Essaouira · 6n/7j") },
    ],
  },
  {
    id: "atlas",
    accent: "#5A6B4F",
    coords: [31.3, -7.6],
    routeId: "tourAtlasDesiertoHub",
    name: T("Atlas y valles", "Atlas & valleys", "Atlas & vallées"),
    desc: T(
      "Cumbres bereberes, gargantas del Todra y valles de mil kasbahs.",
      "Berber peaks, the Todra gorges and valleys of a thousand kasbahs.",
      "Sommets berbères, gorges du Todra et vallées aux mille kasbahs.",
    ),
    experiences: [
      T("Aldeas imazighen", "Imazighen villages", "Villages imazighen"),
      T("Gargantas del Todra", "Todra gorges", "Gorges du Todra"),
      T("Valle del Dadès", "Dadès valley", "Vallée du Dadès"),
    ],
    itineraries: [
      { routeId: "tourAtlasDesierto45", label: T("Atlas · Desierto · 4n/5d", "Atlas · Desert · 4n/5d", "Atlas · Désert · 4n/5j") },
      { routeId: "tourAtlasDesierto67", label: T("Atlas · Desierto · 6n/7d", "Atlas · Desert · 6n/7d", "Atlas · Désert · 6n/7j") },
    ],
  },
  {
    id: "sahara",
    accent: "#C16542",
    coords: [31.1, -4.0],
    routeId: "tourMarrakechErgHub",
    name: T("Desierto del Sáhara", "Sahara Desert", "Désert du Sahara"),
    desc: T(
      "Las dunas doradas del Erg Chebbi y una noche bajo las estrellas.",
      "The golden dunes of the Erg Chebbi and a night under the stars.",
      "Les dunes dorées de l'Erg Chebbi et une nuit sous les étoiles.",
    ),
    experiences: [
      T("Dunas del Erg Chebbi", "Erg Chebbi dunes", "Dunes de l'Erg Chebbi"),
      T("Noche en bivouac", "Night in a bivouac", "Nuit en bivouac"),
      T("Ruta en dromedario", "Camel ride", "Balade à dos de dromadaire"),
    ],
    itineraries: [
      { routeId: "tourMarrakechErg45", label: T("Marrakech – Erg Chebbi · 4n/5d", "Marrakech – Erg Chebbi · 4n/5d", "Marrakech – Erg Chebbi · 4n/5j") },
      { routeId: "tourMarrakechErg67", label: T("Marrakech – Erg Chebbi · 6n/7d", "Marrakech – Erg Chebbi · 6n/7d", "Marrakech – Erg Chebbi · 6n/7j") },
    ],
  },
  {
    id: "south",
    accent: "#D4A373",
    coords: [30.42, -6.9],
    routeId: "tourSouth",
    name: T("Sur de Marruecos", "Southern Morocco", "Sud du Maroc"),
    desc: T(
      "Ouarzazate, Aït Ben Haddou y el valle del Drâa: el gran sur cinematográfico.",
      "Ouarzazate, Aït Ben Haddou and the Drâa valley: the cinematic grand south.",
      "Ouarzazate, Aït Ben Haddou et la vallée du Drâa : le grand sud cinématographique.",
    ),
    experiences: [
      T("Aït Ben Haddou", "Aït Ben Haddou", "Aït Ben Haddou"),
      T("Kasbahs del Drâa", "Drâa kasbahs", "Kasbahs du Drâa"),
      T("Oasis y palmerales", "Oases & palm groves", "Oasis & palmeraies"),
    ],
    itineraries: [
      { routeId: "tourDesiertoAtlas45", label: T("Desierto · Atlas · 4n/5d", "Desert · Atlas · 4n/5d", "Désert · Atlas · 4n/5j") },
      { routeId: "tourAtlasDesiertoHub", label: T("Ver opciones del sur", "See southern options", "Voir les options du sud") },
    ],
  },
];

const COPY = {
  es: { eyebrow: "Explora por mapa", title: "Marruecos, región por región.", helper: "Pulsa una zona del mapa para descubrir sus experiencias e itinerarios.", exp: "Experiencias destacadas", itineraries: "Itinerarios relacionados", cta: "Ver viajes de", tripsOne: "itinerario disponible", tripsMany: "itinerarios disponibles" },
  en: { eyebrow: "Explore by map", title: "Morocco, region by region.", helper: "Tap a zone on the map to discover its experiences and itineraries.", exp: "Highlighted experiences", itineraries: "Related itineraries", cta: "See trips in", tripsOne: "itinerary available", tripsMany: "itineraries available" },
  fr: { eyebrow: "Explorer par carte", title: "Le Maroc, région par région.", helper: "Touchez une zone de la carte pour découvrir ses expériences et itinéraires.", exp: "Expériences phares", itineraries: "Itinéraires associés", cta: "Voir les voyages du", tripsOne: "itinéraire disponible", tripsMany: "itinéraires disponibles" },
};

/* Map a real itinerary route path to its primary region zone. Each
   `programa_*` route is assigned to a single zone by its path prefix so
   the per-region counts read straight from the live ROUTES registry. */
const zoneForPath = (p) => {
  if (!p || !p.includes("/programa_")) return null;
  if (p.startsWith("viajes/gransur/")) return "south";
  if (p.startsWith("viajes/marrakech_essaouira/")) return "coast";
  if (p.includes("ergchebbi")) return "sahara";
  if (p.includes("rak_erg_rak")) return "sahara";
  if (p.startsWith("viajes/escapadas/desierto/")) return "sahara";
  if (p.startsWith("viajes/aventura/enduro/")) return "sahara";
  if (p.startsWith("viajes/atlas_desierto/")) return "atlas";
  if (p.startsWith("viajes/desierto_atlas/")) return "sahara";
  if (p.includes("atlas")) return "atlas";
  if (p.startsWith("viajes/norte/ciudadesimperiales_rif/")) return "north";
  if (p.startsWith("viajes/norte/tanger_fez/") || p.startsWith("viajes/norte/fez_tanger/")) return "north";
  if (p.startsWith("viajes/norte/ciudades_imperiales/")) return "imperial";
  if (p.startsWith("viajes/escapadas/fez")) return "imperial";
  if (p.startsWith("viajes/escapadas/marrakech")) return "imperial";
  return null;
};

/* Live counts derived once from the real ROUTES registry. */
const TRIP_COUNTS = (() => {
  const c = { north: 0, imperial: 0, coast: 0, atlas: 0, sahara: 0, south: 0 };
  for (const r of Object.values(ROUTES)) {
    const z = zoneForPath(r && r.es);
    if (z && c[z] !== undefined) c[z] += 1;
  }
  return c;
})();

/** Smoothly recenters the map on the active region. */
const FlyTo = ({ coords }) => {
  const map = useMap();
  useEffect(() => {
    if (coords) map.flyTo(coords, 6.4, { duration: 0.8 });
  }, [coords, map]);
  return null;
};

export const ToursRegionMap = ({ defaultZone, topPadClass = "pt-4" } = {}) => {
  const { lang } = useLanguage();
  const t = COPY[lang] || COPY.es;
  const SD = (k) => ({ es: COPY.es[k], en: COPY.en[k], fr: COPY.fr[k] });
  const initialId = REGIONS.some((r) => r.id === defaultZone) ? defaultZone : REGIONS[0].id;
  const [activeId, setActiveId] = useState(initialId);
  const active = useMemo(() => REGIONS.find((r) => r.id === activeId) || REGIONS[0], [activeId]);

  return (
    <section
      data-testid="viajes-region-map"
      className={`relative bg-[#FDFBF7] pb-20 md:pb-28 ${topPadClass} overflow-hidden`}
    >
      <div className="relative max-w-7xl mx-auto px-6 md:px-12">
        {/* Heading */}
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-12">
          <span className="overline inline-flex items-center gap-2 text-[#C16542]">
            <Compass className="w-3.5 h-3.5" strokeWidth={1.8} />
            <EditableText slot="viajes.region-map.eyebrow" defaults={SD("eyebrow")} multiline={false} />
          </span>
          <EditableText
            as="h3"
            slot="viajes.region-map.title"
            defaults={SD("title")}
            multiline={false}
            className="font-serif-x text-3xl md:text-4xl leading-[1.08] tracking-tight mt-4 text-[#2C2621] block"
          />
          <EditableText
            as="p"
            slot="viajes.region-map.helper"
            defaults={SD("helper")}
            className="mt-4 text-[15px] md:text-base text-[#5C5248] leading-relaxed block"
          />
        </div>

        {/* Region chips */}
        <div className="flex flex-wrap justify-center gap-2.5 mb-8" role="tablist" aria-label="Regiones">
          {REGIONS.map((r) => {
            const isActive = r.id === active.id;
            return (
              <button
                key={r.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                data-testid={`region-map-chip-${r.id}`}
                onClick={() => setActiveId(r.id)}
                onMouseEnter={() => setActiveId(r.id)}
                className={`inline-flex items-center gap-2 px-4 py-2 text-[10px] tracking-[0.22em] uppercase border transition-all duration-300 ${
                  isActive ? "text-[#FDFBF7] border-transparent" : "bg-[#FDFBF7] text-[#5C5248] border-[#2C2621]/20 hover:border-[#2C2621]/50"
                }`}
                style={isActive ? { background: r.accent } : undefined}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: isActive ? "#FDFBF7" : r.accent }} />
                {pick(r.name, lang)}
              </button>
            );
          })}
        </div>

        {/* Map + detail card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          {/* Map */}
          <div
            data-testid="viajes-region-map-canvas"
            className="lg:col-span-7 relative border border-[#2C2621]/15 overflow-hidden bg-[#EDE5D5] rounded-2xl"
            style={{ minHeight: "440px" }}
          >
            <MapContainer
              center={active.coords}
              zoom={6}
              scrollWheelZoom={false}
              style={{ height: "100%", width: "100%", minHeight: "440px", background: "#EDE5D5" }}
              attributionControl={false}
            >
              <TileLayer url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png" subdomains="abcd" />
              <TileLayer url="https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png" subdomains="abcd" />
              <FlyTo coords={active.coords} />
              {REGIONS.map((r) => {
                const isActive = r.id === active.id;
                return (
                  <CircleMarker
                    key={r.id}
                    center={r.coords}
                    radius={isActive ? 13 : 8}
                    pathOptions={{
                      color: "#FDFBF7",
                      weight: isActive ? 3 : 2,
                      fillColor: r.accent,
                      fillOpacity: isActive ? 0.95 : 0.7,
                    }}
                    eventHandlers={{
                      click: () => setActiveId(r.id),
                      mouseover: () => setActiveId(r.id),
                    }}
                  >
                    <Tooltip direction="top" offset={[0, -6]} opacity={1} permanent={isActive}>
                      <span className="font-serif-x text-[13px]">{pick(r.name, lang)}</span>
                    </Tooltip>
                  </CircleMarker>
                );
              })}
            </MapContainer>
            <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-[#2C2621]/5 rounded-2xl" />
          </div>

          {/* Detail card */}
          <div
            key={active.id}
            data-testid={`region-map-card-${active.id}`}
            className="landmark-image-fade lg:col-span-5 bg-[#FDFBF7] border border-[#2C2621]/12 rounded-2xl p-7 md:p-9 flex flex-col"
            style={{ borderTop: `3px solid ${active.accent}` }}
          >
            <span className="inline-flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase" style={{ color: active.accent }}>
              <MapPin className="w-3.5 h-3.5" strokeWidth={1.8} />
              {pick(active.name, lang)}
            </span>
            <h4 className="font-serif-x text-2xl md:text-[28px] leading-[1.15] tracking-tight mt-3 text-[#2C2621]">
              {pick(active.name, lang)}
            </h4>
            {TRIP_COUNTS[active.id] > 0 && (
              <span
                data-testid={`region-map-count-${active.id}`}
                className="mt-3 inline-flex items-center gap-2 self-start text-[11px] tracking-[0.16em] uppercase px-3 py-1.5 rounded-full font-semibold"
                style={{ background: `${active.accent}1A`, color: active.accent }}
              >
                <Route className="w-3.5 h-3.5" strokeWidth={1.8} />
                {TRIP_COUNTS[active.id]}{" "}
                {TRIP_COUNTS[active.id] === 1 ? t.tripsOne : t.tripsMany}
              </span>
            )}
            <p className="mt-4 text-[15px] text-[#5C5248] leading-[1.75]">
              <EditableText
                as="span"
                slot={`viajes.region-map.${active.id}.desc`}
                defaults={active.desc}
              />
            </p>

            {/* Experiences */}
            <div className="mt-6">
              <p className="inline-flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase text-[#5C5248] mb-3">
                <Sparkles className="w-3 h-3" strokeWidth={1.8} style={{ color: active.accent }} />
                {t.exp}
              </p>
              <div className="flex flex-wrap gap-2">
                {active.experiences.map((e, i) => (
                  <span
                    key={i}
                    data-testid={`region-map-exp-${active.id}-${i}`}
                    className="text-[11px] px-3 py-1.5 border bg-[#F7F1E4] text-[#5C5248]"
                    style={{ borderColor: `${active.accent}44` }}
                  >
                    <EditableText
                      slot={`viajes.region-map.${active.id}.exp.${i}`}
                      defaults={e}
                      multiline={false}
                    />
                  </span>
                ))}
              </div>
            </div>

            {/* Related itineraries */}
            <div className="mt-6">
              <p className="inline-flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase text-[#5C5248] mb-3">
                <Route className="w-3 h-3" strokeWidth={1.8} style={{ color: active.accent }} />
                {t.itineraries}
              </p>
              <ul className="space-y-2">
                {active.itineraries.map((it, i) => (
                  <li key={i}>
                    <Link
                      to={pathFor(lang, it.routeId)}
                      data-testid={`region-map-itinerary-${active.id}-${i}`}
                      className="group inline-flex items-center gap-2 text-sm text-[#2C2621] hover:text-[#C16542] transition-colors"
                    >
                      <span className="w-5 h-px transition-all duration-300 group-hover:w-7" style={{ background: active.accent }} />
                      {pick(it.label, lang)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA */}
            <Link
              to={pathFor(lang, active.routeId)}
              data-testid={`region-map-cta-${active.id}`}
              className="mt-auto pt-7 inline-flex items-center gap-3 self-start text-[11px] tracking-[0.25em] uppercase font-semibold transition-colors"
              style={{ color: active.accent }}
            >
              {t.cta} {pick(active.name, lang)}
              <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.8} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ToursRegionMap;
