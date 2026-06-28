import React, { useMemo } from "react";
import { MapContainer, Polyline, CircleMarker, Tooltip } from "react-leaflet";
import MapBaseLayers from "@/components/MapBaseLayers";
import { useLanguage, pick } from "@/contexts/LanguageContext";

/* ============================================================
   PlannerMiniMap — lightweight Leaflet route map for the planner
   result. Plots the recommended trip's stops as a connected
   polyline with one marker per stop. Satellite/Map toggle via
   the shared MapBaseLayers control (default satellite).
============================================================ */
const TYPE_COLORS = {
  city: "#C16542", desert: "#D97742", kasbah: "#A07042",
  market: "#7C8B5C", gorge: "#5A7F9C", unesco: "#D4A373", lake: "#3E7C8C",
};

export default function PlannerMiniMap({ nodes = [], testid = "planner-map" }) {
  const { lang } = useLanguage();
  const positions = useMemo(() => nodes.map((n) => [n.lat, n.lng]), [nodes]);
  const bounds = useMemo(() => {
    if (!nodes.length) return null;
    const lats = nodes.map((n) => n.lat), lngs = nodes.map((n) => n.lng);
    return [[Math.min(...lats), Math.min(...lngs)], [Math.max(...lats), Math.max(...lngs)]];
  }, [nodes]);

  if (nodes.length < 2) return null;

  return (
    <div
      className="relative h-[340px] md:h-[440px] overflow-hidden border border-[#2C2621]/15 bg-[#F2EBE1] shadow-sm rounded-sm"
      data-testid={testid}
    >
      <MapContainer
        bounds={bounds}
        boundsOptions={{ padding: [45, 45] }}
        scrollWheelZoom={false}
        zoomControl
        attributionControl={false}
        style={{ height: "100%", width: "100%", background: "#F2EBE1" }}
      >
        <MapBaseLayers variant="light" />
        <Polyline positions={positions} pathOptions={{ color: "#1A1513", weight: 6, opacity: 0.16 }} />
        <Polyline positions={positions} pathOptions={{ color: "#C16542", weight: 2.5, opacity: 0.9, dashArray: "1 6" }} />
        {nodes.map((n, idx) => {
          const color = TYPE_COLORS[n.type] || "#C16542";
          return (
            <React.Fragment key={`${n.day}-${idx}`}>
              <CircleMarker center={[n.lat, n.lng]} radius={16}
                pathOptions={{ color, weight: 0, fillColor: color, fillOpacity: 0.12 }} interactive={false} />
              <CircleMarker center={[n.lat, n.lng]} radius={8}
                pathOptions={{ color: "#FDFBF7", weight: 2, fillColor: color, fillOpacity: 1 }}>
                <Tooltip direction="top" offset={[0, -8]} opacity={0.95}>
                  <span className="text-[11px] tracking-[0.04em]">
                    {String(n.day).padStart(2, "0")} · {pick(n.name, lang)}
                  </span>
                </Tooltip>
              </CircleMarker>
            </React.Fragment>
          );
        })}
      </MapContainer>
    </div>
  );
}
