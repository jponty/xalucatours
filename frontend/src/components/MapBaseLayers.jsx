import React, { useEffect, useState } from "react";
import { TileLayer, useMap } from "react-leaflet";
import { createPortal } from "react-dom";
import L from "leaflet";
import { useLanguage } from "@/contexts/LanguageContext";

/* ============================================================
   MapBaseLayers — drop-in base tiles + a "Mapa / Satélite" toggle.
   ------------------------------------------------------------
   Place INSIDE a <MapContainer>, replacing the existing
   <TileLayer/> line(s). It renders the current style tiles
   ("map") and lets the user switch to satellite imagery.

   variant:
     - "light"   → CartoDB light_all (single layer)
     - "labeled" → CartoDB light_nolabels + light_only_labels
     - "dark"    → CartoDB dark_all (single layer)

   The toggle is rendered as a real Leaflet control (so it lives
   inside the map block and never scrolls away), styled to match
   the Xaluca UI and responsive on every breakpoint.
============================================================ */

const SUB = "abcd";

// Esri World Imagery (free, key-less) + place-name reference overlay.
const SAT_IMAGERY =
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
const SAT_LABELS =
  "https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}";

const LABELS = {
  es: { map: "Mapa", sat: "Satélite" },
  en: { map: "Map", sat: "Satellite" },
  fr: { map: "Carte", sat: "Satellite" },
};

const MapTiles = ({ variant }) => {
  if (variant === "labeled") {
    return (
      <>
        <TileLayer url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png" subdomains={SUB} />
        <TileLayer url="https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png" subdomains={SUB} />
      </>
    );
  }
  if (variant === "dark") {
    return <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" subdomains={SUB} />;
  }
  return <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" subdomains={SUB} />;
};

const SatelliteTiles = () => (
  <>
    <TileLayer url={SAT_IMAGERY} maxZoom={19} attribution="Tiles &copy; Esri" />
    <TileLayer url={SAT_LABELS} maxZoom={19} />
  </>
);

/* Toggle rendered into a Leaflet control container via portal so it
   keeps full React interactivity while being positioned by Leaflet. */
const ViewToggleControl = ({ satellite, setSatellite, position }) => {
  const map = useMap();
  const { lang } = useLanguage();
  const t = LABELS[lang] || LABELS.es;
  const [container, setContainer] = useState(null);

  useEffect(() => {
    const ctrl = L.control({ position });
    ctrl.onAdd = () => {
      const div = L.DomUtil.create("div", "leaflet-control xaluca-map-toggle");
      L.DomEvent.disableClickPropagation(div);
      L.DomEvent.disableScrollPropagation(div);
      setContainer(div);
      return div;
    };
    ctrl.addTo(map);
    return () => ctrl.remove();
  }, [map, position]);

  if (!container) return null;

  const seg = (active) =>
    `px-2.5 md:px-3 py-1.5 text-[9px] md:text-[10px] tracking-[0.18em] uppercase transition-colors duration-200 ${
      active ? "bg-[#C16542] text-[#FDFBF7]" : "text-[#2C2621] hover:bg-[#2C2621]/8"
    }`;

  return createPortal(
    <div
      data-testid="map-view-toggle"
      className="flex items-stretch rounded-full overflow-hidden bg-[#FDFBF7]/95 backdrop-blur-sm border border-[#2C2621]/15 shadow-[0_6px_18px_-8px_rgba(0,0,0,0.45)]"
    >
      <button
        type="button"
        data-testid="map-view-map"
        aria-pressed={!satellite}
        onClick={() => setSatellite(false)}
        className={seg(!satellite)}
      >
        {t.map}
      </button>
      <button
        type="button"
        data-testid="map-view-satellite"
        aria-pressed={satellite}
        onClick={() => setSatellite(true)}
        className={seg(satellite)}
      >
        {t.sat}
      </button>
    </div>,
    container,
  );
};

export const MapBaseLayers = ({ variant = "light", togglePosition = "bottomright" }) => {
  const [satellite, setSatellite] = useState(false);
  return (
    <>
      {satellite ? <SatelliteTiles /> : <MapTiles variant={variant} />}
      <ViewToggleControl satellite={satellite} setSatellite={setSatellite} position={togglePosition} />
    </>
  );
};

export default MapBaseLayers;
