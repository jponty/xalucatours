import React, { useState } from "react";
import { Plane, ArrowUpRight, MapPin } from "lucide-react";
import { useLanguage, pick } from "@/contexts/LanguageContext";
import EditableText from "@/components/EditableText";
import { FLIGHT_ORIGINS } from "@/lib/flights";

const DestinationCard = ({ origin, dest, lang }) => (
  <article
    data-testid={`flight-card-${origin.id}-${dest.id}`}
    className="group flex flex-col bg-white border border-[#2C2621]/12 hover:border-[#D4A373] transition-colors duration-300"
  >
    <div className="p-6 md:p-7 flex-1">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-serif-x text-2xl md:text-3xl leading-tight tracking-tight text-[#1A1513]">
          {pick(dest.city, lang)}
        </h3>
        <span
          data-testid={`flight-iata-${dest.id}`}
          className="shrink-0 inline-flex items-center font-mono text-[11px] tracking-[0.18em] bg-[#1A1513] text-[#FDFBF7] px-2.5 py-1"
        >
          {dest.code}
        </span>
      </div>
      <div className="mt-2 flex items-center gap-1.5 text-[11px] tracking-[0.1em] uppercase text-[#A07042]">
        <MapPin className="w-3.5 h-3.5 shrink-0" strokeWidth={1.6} />
        <span>{pick(dest.airport, lang)}</span>
      </div>
      <p className="mt-4 text-sm text-[#5C5248] leading-relaxed">{pick(dest.desc, lang)}</p>
    </div>

    <a
      href={dest.url}
      target="_blank"
      rel="noopener noreferrer"
      data-testid={`flight-link-${origin.id}-${dest.id}`}
      className="flex items-center justify-between gap-3 px-6 md:px-7 py-4 border-t border-[#2C2621]/10 text-[11px] tracking-[0.22em] uppercase text-[#C16542] hover:bg-[#C16542] hover:text-[#FDFBF7] transition-colors duration-300"
    >
      <span className="inline-flex items-center gap-2">
        <Plane className="w-3.5 h-3.5" strokeWidth={1.7} />
        {pick({ es: "Ver vuelos", en: "View flights", fr: "Voir les vols" }, lang)}
      </span>
      <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" strokeWidth={1.7} />
    </a>
  </article>
);

export default function VuelosPage() {
  const { lang } = useLanguage();
  const [activeId, setActiveId] = useState(FLIGHT_ORIGINS[0]?.id);
  const origin = FLIGHT_ORIGINS.find((o) => o.id === activeId) || FLIGHT_ORIGINS[0];

  return (
    <main data-testid="vuelos-page" className="bg-[#FDFBF7] min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden pt-32 md:pt-40 pb-10 md:pb-12">
        <div className="absolute inset-0 berber-bg-cross opacity-[0.06] pointer-events-none" aria-hidden="true" />
        <div className="relative max-w-7xl mx-auto px-6 md:px-12">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-3 text-[11px] tracking-[0.35em] uppercase text-[#A07042]">
              <span className="w-8 h-px bg-[#D4A373]" />
              <EditableText slot="vuelos.hero.eyebrow" defaults={{ es: "Vuelos", en: "Flights", fr: "Vols" }} multiline={false} />
            </span>
            <EditableText
              as="h1"
              slot="vuelos.hero.title"
              defaults={{
                es: "Conexiones aéreas entre España y Marruecos",
                en: "Flight connections between Spain and Morocco",
                fr: "Liaisons aériennes entre l'Espagne et le Maroc",
              }}
              multiline={false}
              className="font-serif-x text-4xl md:text-5xl lg:text-6xl leading-[1.04] tracking-tight text-[#1A1513] mt-6 block"
            />
            <EditableText
              as="p"
              slot="vuelos.hero.subtitle"
              defaults={{
                es: "Elige tu ciudad de salida y consulta fácilmente las rutas y aerolíneas que vuelan a tu destino marroquí. Cada enlace abre la información actualizada de horarios y compañías en FlightConnections.",
                en: "Pick your departure city and easily check the routes and airlines flying to your Moroccan destination. Each link opens up-to-date schedules and carriers on FlightConnections.",
                fr: "Choisissez votre ville de départ et consultez facilement les routes et compagnies vers votre destination marocaine. Chaque lien ouvre les horaires et compagnies à jour sur FlightConnections.",
              }}
              className="mt-6 text-base md:text-lg text-[#5C5248] leading-relaxed block"
            />
          </div>
        </div>
      </section>

      {/* Origin selector */}
      <section className="max-w-7xl mx-auto px-6 md:px-12" data-testid="vuelos-origin-selector">
        <span className="block text-[10px] tracking-[0.3em] uppercase text-[#A07042] mb-3">
          {pick({ es: "Ciudad de salida", en: "Departure city", fr: "Ville de départ" }, lang)}
        </span>
        <div className="flex flex-wrap gap-2.5">
          {FLIGHT_ORIGINS.map((o) => {
            const active = o.id === activeId;
            return (
              <button
                key={o.id}
                type="button"
                data-testid={`vuelos-origin-tab-${o.id}`}
                onClick={() => setActiveId(o.id)}
                aria-pressed={active}
                className={`inline-flex items-center gap-2 px-4 py-2.5 text-[11px] tracking-[0.14em] uppercase border transition-colors duration-200 ${
                  active
                    ? "bg-[#1A1513] border-[#1A1513] text-[#FDFBF7]"
                    : "bg-transparent border-[#2C2621]/20 text-[#5C5248] hover:border-[#D4A373] hover:text-[#1A1513]"
                }`}
              >
                {pick(o.city, lang)}
                <span className={`font-mono text-[10px] ${active ? "text-[#D4A373]" : "text-[#A07042]"}`}>{o.code}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Active origin destinations */}
      <section
        key={origin.id}
        data-testid={`flight-origin-${origin.id}`}
        className="max-w-7xl mx-auto px-6 md:px-12 pt-10 pb-20 md:pb-28"
      >
        <div className="flex items-center gap-4 mb-8">
          <h2 className="font-serif-x text-2xl md:text-3xl tracking-tight text-[#1A1513]">
            {pick({ es: "Vuelos desde", en: "Flights from", fr: "Vols depuis" }, lang)} {pick(origin.city, lang)}
          </h2>
          <span className="inline-flex items-center font-mono text-[11px] tracking-[0.18em] bg-[#D4A373]/20 text-[#A07042] px-2.5 py-1">
            {origin.code}
          </span>
          <span className="flex-1 h-px bg-gradient-to-r from-[#D4A373]/50 to-transparent" />
          <span className="text-[11px] tracking-[0.2em] uppercase text-[#A07042]">
            {origin.destinations.length} {pick({ es: "destinos", en: "destinations", fr: "destinations" }, lang)}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {origin.destinations.map((dest) => (
            <DestinationCard key={dest.id} origin={origin} dest={dest} lang={lang} />
          ))}
        </div>

        <p className="mt-10 text-xs text-[#7A6E62] leading-relaxed max-w-3xl">
          {pick({
            es: "La disponibilidad y frecuencia de vuelos puede variar según la temporada. Los enlaces muestran las rutas directas y con conexión actualizadas en FlightConnections.",
            en: "Flight availability and frequency may vary by season. The links show up-to-date direct and connecting routes on FlightConnections.",
            fr: "La disponibilité et la fréquence des vols peuvent varier selon la saison. Les liens affichent les routes directes et avec correspondance à jour sur FlightConnections.",
          }, lang)}
        </p>
      </section>
    </main>
  );
}
