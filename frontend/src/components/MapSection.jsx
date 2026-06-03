import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import MapLogoBadge from "@/components/MapLogoBadge";
import L from "leaflet";
import { Compass } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/lib/i18n";
import { MAP_POINTS } from "@/lib/data";
import EditableText from "@/components/EditableText";

const xalucaPin = L.divIcon({
  className: "xaluca-map-pin",
  html: '<div class="pin"></div>',
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

export const MapSection = () => {
  const { t } = useLanguage();

  return (
    <section
      id="map"
      data-testid="map-section"
      className="relative bg-[#FDFBF7] py-24 md:py-32 overflow-hidden"
    >
      <div className="relative max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end mb-12 md:mb-16">
          <div className="md:col-span-7">
            <span className="overline inline-flex items-center gap-2">
              <Compass className="w-3.5 h-3.5" strokeWidth={1.6} />
              <EditableText slot="home.map.overline" defaults={translations.sec_map_overline} multiline={false} />
            </span>
            <EditableText as="h2" slot="home.map.title" defaults={translations.sec_map_title}
              className="font-serif-x text-4xl md:text-5xl lg:text-6xl leading-[1.05] tracking-tight mt-5 text-[#2C2621] block" />
          </div>
          <div className="md:col-span-5">
            <EditableText as="p" slot="home.map.sub" defaults={translations.sec_map_sub}
              className="text-base md:text-lg text-[#5C5248] leading-relaxed block" />
          </div>
        </div>

        <div
          className="relative border border-[#2C2621]/15 overflow-hidden bg-[#F2EBE1]"
          style={{ height: "560px" }}
          data-testid="leaflet-map-wrapper"
        >
          <MapContainer
            center={[31.5, -7.0]}
            zoom={6}
            scrollWheelZoom={false}
            style={{ height: "100%", width: "100%" }}
            attributionControl={false}
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
              subdomains="abcd"
            />
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png"
              subdomains="abcd"
            />
            {MAP_POINTS.map((p) => (
              <Marker key={p.id} position={p.coords} icon={xalucaPin}>
                <Popup>
                  <span className="font-serif-x text-base">{p.name}</span>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
          <MapLogoBadge />
          <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-[#2C2621]/5" />
        </div>

        <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-[11px] tracking-[0.2em] uppercase text-[#5C5248]">
          {MAP_POINTS.slice(0, 8).map((p) => (
            <span key={p.id} data-testid={`map-legend-${p.id}`} className="inline-flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C16542]" />
              {p.name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MapSection;
