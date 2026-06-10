import React from "react";
import { Plane, ArrowUpRight, MapPin } from "lucide-react";
import { useLanguage, pick } from "@/contexts/LanguageContext";
import EditableText from "@/components/EditableText";
import { FLIGHT_ORIGINS, UPCOMING_ORIGINS } from "@/lib/flights";

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
        <MapPin className="w-3.5 h-3.5" strokeWidth={1.6} />
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

  return (
    <main data-testid="vuelos-page" className="bg-[#FDFBF7] min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden pt-32 md:pt-40 pb-12 md:pb-16">
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
                es: "Consulta fácilmente las rutas y aerolíneas que vuelan a tu destino marroquí. Cada enlace abre la información actualizada de horarios y compañías en FlightConnections.",
                en: "Easily check the routes and airlines flying to your Moroccan destination. Each link opens up-to-date schedules and carriers on FlightConnections.",
                fr: "Consultez facilement les routes et compagnies qui desservent votre destination marocaine. Chaque lien ouvre les horaires et compagnies à jour sur FlightConnections.",
              }}
              className="mt-6 text-base md:text-lg text-[#5C5248] leading-relaxed block"
            />
          </div>
        </div>
      </section>

      {/* Origins */}
      {FLIGHT_ORIGINS.map((origin) => (
        <section
          key={origin.id}
          data-testid={`flight-origin-${origin.id}`}
          className="max-w-7xl mx-auto px-6 md:px-12 pb-12 md:pb-16"
        >
          <div className="flex items-center gap-4 mb-8">
            <h2 className="font-serif-x text-2xl md:text-3xl tracking-tight text-[#1A1513]">
              {pick({ es: "Vuelos desde", en: "Flights from", fr: "Vols depuis" }, lang)}{" "}
              {pick(origin.city, lang)}
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
        </section>
      ))}

      {/* Upcoming origins */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 pb-20 md:pb-28" data-testid="vuelos-upcoming">
        <div className="bg-[#1A1513] text-[#FDFBF7] berber-bg-cross p-8 md:p-12">
          <span className="text-[11px] tracking-[0.3em] uppercase text-[#D4A373]">
            <EditableText slot="vuelos.upcoming.eyebrow" defaults={{ es: "Próximamente", en: "Coming soon", fr: "Bientôt" }} multiline={false} />
          </span>
          <EditableText
            as="h2"
            slot="vuelos.upcoming.title"
            defaults={{
              es: "Más ciudades de salida en camino",
              en: "More departure cities on the way",
              fr: "D'autres villes de départ bientôt",
            }}
            multiline={false}
            className="font-serif-x text-2xl md:text-3xl tracking-tight mt-4 block"
          />
          <EditableText
            as="p"
            slot="vuelos.upcoming.body"
            defaults={{
              es: "Estamos ampliando las conexiones desde toda España. Muy pronto añadiremos nuevas ciudades de salida y más destinos marroquíes.",
              en: "We're expanding connections from across Spain. New departure cities and more Moroccan destinations are coming soon.",
              fr: "Nous étendons les liaisons depuis toute l'Espagne. De nouvelles villes de départ et destinations marocaines arrivent bientôt.",
            }}
            className="mt-3 text-[#FDFBF7]/70 leading-relaxed max-w-2xl block"
          />
          <div className="mt-6 flex flex-wrap gap-2.5">
            {UPCOMING_ORIGINS.map((c) => (
              <span
                key={c}
                className="inline-flex items-center gap-2 border border-[#FDFBF7]/20 text-[#FDFBF7]/85 px-3.5 py-1.5 text-[11px] tracking-[0.14em] uppercase"
              >
                <Plane className="w-3 h-3 text-[#D4A373]" strokeWidth={1.7} />
                {c}
              </span>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
