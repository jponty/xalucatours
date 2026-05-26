import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, ChevronLeft, ChevronRight, Compass } from "lucide-react";
import { useLanguage, pick } from "@/contexts/LanguageContext";
import { pathFor } from "@/lib/routes";

/* ============================================================
   AllTripsCarousel — quick-access rail with every concrete tour
   -------------------------------------------------------------
   Sits below the "Our Trips" categories section. Each card links
   directly to the program detail page.
============================================================ */

const T = (es, en, fr) => ({ es, en, fr });

const COPY = {
  overline: T("Todos los viajes", "All journeys", "Tous les voyages"),
  title:    T("Cada ruta, en detalle.", "Every route, in detail.", "Chaque itinéraire, en détail."),
  body:     T(
    "Atajo directo a la ficha de cada viaje. Filtra mentalmente por duración, región o ritmo.",
    "A direct shortcut to every tour page. Filter mentally by duration, region or pace.",
    "Un raccourci direct vers la fiche de chaque voyage. Filtrez mentalement par durée, région ou rythme.",
  ),
  cta:      T("Ver itinerario", "See itinerary", "Voir l'itinéraire"),
  prev:     T("Anterior", "Previous", "Précédent"),
  next:     T("Siguiente", "Next", "Suivant"),
};

const TAGS = {
  desert: T("Desierto", "Desert", "Désert"),
  atlas:  T("Atlas",    "Atlas",  "Atlas"),
  loop:   T("Marrakech",  "Marrakech",  "Marrakech"),
  imperial: T("Imperiales", "Imperial",  "Impériales"),
  north:    T("Norte",      "North",     "Nord"),
  full:     T("Travesía",   "Crossing",  "Traversée"),
  short:    T("Escapada",   "Short",     "Escapade"),
};

const IMG_DESERT = "https://images.unsplash.com/photo-1542401886-65d6c61db217?auto=format&fit=crop&w=1400&q=85";
const IMG_KASBAH = "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=1400&q=85";
const IMG_ATLAS  = "https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1400&q=85";
const IMG_ZELL   = "https://images.unsplash.com/photo-1570133435536-7ececf000ef6?auto=format&fit=crop&w=1400&q=85";
const IMG_MOS    = "https://images.unsplash.com/photo-1597212618440-806262de4f6b?auto=format&fit=crop&w=1400&q=85";
const IMG_ROCKY  = "https://images.unsplash.com/photo-1547234935-80c7145ec969?auto=format&fit=crop&w=1400&q=85";

// Trip cards — each links to its program detail page.
const TRIPS = [
  // SUR — Atlas + Desierto
  { id: "ad-4-5", routeId: "tourAtlasDesierto45", nights: "4n / 5d", tag: "atlas",  accent: "#A07042", image: IMG_ATLAS,
    title: T("Atlas · Desierto · 4n/5d", "Atlas · Desert · 4n/5d", "Atlas · Désert · 4n/5j"),
    desc:  T("Marrakech → Erg Chebbi por el Alto Atlas.", "Marrakech → Erg Chebbi via the High Atlas.", "Marrakech → Erg Chebbi par le Haut Atlas.") },
  { id: "ad-5-6", routeId: "tourAtlasDesierto56", nights: "5n / 6d", tag: "atlas",  accent: "#A07042", image: IMG_ATLAS,
    title: T("Atlas · Desierto · 5n/6d", "Atlas · Desert · 5n/6d", "Atlas · Désert · 5n/6j"),
    desc:  T("Una noche más en el desierto, gargantas del Todra.", "An extra desert night and Todra Gorges.", "Une nuit de plus au désert et gorges du Todra.") },
  { id: "ad-6-7", routeId: "tourAtlasDesierto67", nights: "6n / 7d", tag: "atlas",  accent: "#A07042", image: IMG_ATLAS,
    title: T("Atlas · Desierto · 6n/7d", "Atlas · Desert · 6n/7d", "Atlas · Désert · 6n/7j"),
    desc:  T("Versión amplia con valles del Drâa y Skoura.", "Extended version with Drâa Valley and Skoura.", "Version longue avec vallée du Drâa et Skoura.") },

  // SUR — Desierto + Atlas (sentido inverso)
  { id: "da-4-5", routeId: "tourDesiertoAtlas45", nights: "4n / 5d", tag: "desert", accent: "#C16542", image: IMG_DESERT,
    title: T("Desierto · Atlas · 4n/5d", "Desert · Atlas · 4n/5d", "Désert · Atlas · 4n/5j"),
    desc:  T("Sáhara primero, Atlas después: la ruta a la inversa.", "Sahara first, Atlas after — the reverse route.", "Sahara d'abord, Atlas ensuite — l'itinéraire inverse.") },
  { id: "da-5-6", routeId: "tourDesiertoAtlas56", nights: "5n / 6d", tag: "desert", accent: "#C16542", image: IMG_DESERT,
    title: T("Desierto · Atlas · 5n/6d", "Desert · Atlas · 5n/6d", "Désert · Atlas · 5n/6j"),
    desc:  T("Una noche extra en bivouac premium.", "An extra night in a premium bivouac.", "Une nuit en plus en bivouac premium.") },
  { id: "da-6-7", routeId: "tourDesiertoAtlas67", nights: "6n / 7d", tag: "desert", accent: "#C16542", image: IMG_DESERT,
    title: T("Desierto · Atlas · 6n/7d", "Desert · Atlas · 6n/7d", "Désert · Atlas · 6n/7j"),
    desc:  T("Versión completa con valles y gargantas.", "Full version with valleys and gorges.", "Version complète avec vallées et gorges.") },

  // NORTE
  { id: "ci-4-5",   routeId: "tourCiudadesImperiales45",    nights: "4n / 5d", tag: "imperial", accent: "#D97742", image: IMG_ZELL,
    title: T("Ciudades imperiales · 4n/5d", "Imperial cities · 4n/5d", "Cités impériales · 4n/5j"),
    desc:  T("Casablanca · Rabat · Meknès · Fez.", "Casablanca · Rabat · Meknès · Fez.", "Casablanca · Rabat · Meknès · Fès.") },
  { id: "cirf-6-7", routeId: "tourCiudadesImperialesRif67", nights: "6n / 7d", tag: "imperial", accent: "#D97742", image: IMG_MOS,
    title: T("Imperiales + Rif · 6n/7d", "Imperial + Rif · 6n/7d", "Impériales + Rif · 6n/7j"),
    desc:  T("Tánger · Chefchaouen · Fez · Marrakech.", "Tangier · Chefchaouen · Fez · Marrakech.", "Tanger · Chefchaouen · Fès · Marrakech.") },
  { id: "tf-4-5", routeId: "tourTangerFez45", nights: "4n / 5d", tag: "north", accent: "#5A7F9C", image: IMG_MOS,
    title: T("Tánger – Fez · 4n/5d", "Tangier – Fez · 4n/5d", "Tanger – Fès · 4n/5j"),
    desc:  T("Costa mediterránea, Rif y ciudades imperiales.", "Mediterranean coast, Rif and imperial cities.", "Côte méditerranéenne, Rif et cités impériales.") },
  { id: "tf-5-6", routeId: "tourTangerFez56", nights: "5n / 6d", tag: "north", accent: "#5A7F9C", image: IMG_KASBAH,
    title: T("Tánger – Asilah – Fez · 5n/6d", "Tangier – Asilah – Fez · 5n/6d", "Tanger – Asilah – Fès · 5n/6j"),
    desc:  T("Murallas portuguesas de Asilah + Rif.", "Asilah's Portuguese ramparts + Rif.", "Remparts portugais d'Asilah + Rif.") },
  { id: "ft-5-6", routeId: "tourFezTanger56", nights: "5n / 6d", tag: "north", accent: "#3A4A5F", image: IMG_ZELL,
    title: T("Fez – Tánger · 5n/6d", "Fez – Tangier · 5n/6d", "Fès – Tanger · 5n/6j"),
    desc:  T("De la medina más antigua al Mediterráneo.", "From the oldest medina to the Mediterranean.", "De la plus ancienne médina à la Méditerranée.") },
  { id: "ft-6-7", routeId: "tourFezTanger67", nights: "6n / 7d", tag: "north", accent: "#3A4A5F", image: IMG_ZELL,
    title: T("Fez – Asilah – Tánger · 6n/7d", "Fez – Asilah – Tangier · 6n/7d", "Fès – Asilah – Tanger · 6n/7j"),
    desc:  T("Norte cultural + costa atlántica.", "Cultural north + Atlantic coast.", "Nord culturel + côte atlantique.") },

  // FULL — Fez–Marrakech
  { id: "fr-6-7", routeId: "tourMarrakechFez67", nights: "6n / 7d", tag: "full", accent: "#C16542", image: IMG_DESERT,
    title: T("Marrakech – Fez · 6n/7d", "Marrakech – Fez · 6n/7d", "Marrakech – Fès · 6n/7j"),
    desc:  T("Travesía clásica norte-sur.", "The classic north-south crossing.", "La traversée classique nord-sud.") },
  { id: "fr-7-8", routeId: "tourMarrakechFez78", nights: "7n / 8d", tag: "full", accent: "#C16542", image: IMG_DESERT,
    title: T("Marrakech – Fez · 7n/8d", "Marrakech – Fez · 7n/8d", "Marrakech – Fès · 7n/8j"),
    desc:  T("Una noche extra en el Sáhara.", "An extra Sahara night.", "Une nuit de plus au Sahara.") },
  { id: "fr-8-9", routeId: "tourMarrakechFez89", nights: "8n / 9d", tag: "full", accent: "#C16542", image: IMG_KASBAH,
    title: T("Marrakech – Fez · 8n/9d", "Marrakech – Fez · 8n/9d", "Marrakech – Fès · 8n/9j"),
    desc:  T("Ruta extendida con Skoura y palmerales.", "Extended route with Skoura and palm groves.", "Itinéraire étendu avec Skoura et palmeraies.") },
  { id: "fr-9-10", routeId: "tourMarrakechFez910", nights: "9n / 10d", tag: "full", accent: "#C16542", image: IMG_KASBAH,
    title: T("Marrakech – Fez · 9n/10d", "Marrakech – Fez · 9n/10d", "Marrakech – Fès · 9n/10j"),
    desc:  T("Versión más amplia, sin prisas.", "The most spacious version, unhurried.", "Version la plus large, sans hâte.") },

  // ESCAPADAS
  { id: "esc-des", routeId: "tourEscapadaDesierto34", nights: "3n / 4d", tag: "short", accent: "#A07042", image: IMG_DESERT,
    title: T("Escapada · Sáhara", "Escape · Sahara", "Escapade · Sahara"),
    desc:  T("Tres días al desierto del Erg Chebbi.", "Three days into the Erg Chebbi desert.", "Trois jours dans le désert de l'Erg Chebbi.") },
  { id: "esc-atl", routeId: "tourEscapadaAtlas34", nights: "3n / 4d", tag: "short", accent: "#5A6B4F", image: IMG_ATLAS,
    title: T("Escapada · Alto Atlas", "Escape · High Atlas", "Escapade · Haut Atlas"),
    desc:  T("Trekking suave por pueblos bereberes.", "Gentle trekking through Berber villages.", "Trekking doux à travers les villages berbères.") },
  { id: "esc-fez", routeId: "tourEscapadaFez", nights: "2n / 3d", tag: "short", accent: "#C16542", image: IMG_ZELL,
    title: T("Escapada · Fez", "Escape · Fez", "Escapade · Fès"),
    desc:  T("La medina más antigua del mundo árabe.", "The oldest medina in the Arab world.", "La plus ancienne médina du monde arabe.") },
  { id: "esc-mrk", routeId: "tourEscapadaMarrakech", nights: "2n / 3d", tag: "short", accent: "#D97742", image: IMG_MOS,
    title: T("Escapada · Marrakech", "Escape · Marrakech", "Escapade · Marrakech"),
    desc:  T("Jemaa el-Fna, palacios y zocos.", "Jemaa el-Fna, palaces and souks.", "Jemaa el-Fna, palais et souks.") },
  { id: "esc-tng", routeId: "tourEscapadaTanger", nights: "2n / 3d", tag: "short", accent: "#3A4A5F", image: IMG_ROCKY,
    title: T("Escapada · Tánger", "Escape · Tangier", "Escapade · Tanger"),
    desc:  T("Cabo Espartel, Chefchaouen y Tetuán.", "Cape Spartel, Chefchaouen and Tetouan.", "Cap Spartel, Chefchaouen et Tétouan.") },
];

/* ============================================================ */
export default function AllTripsCarousel() {
  const { lang } = useLanguage();
  const railRef = useRef(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const updateArrows = () => {
    const rail = railRef.current;
    if (!rail) return;
    setCanPrev(rail.scrollLeft > 8);
    setCanNext(rail.scrollLeft + rail.clientWidth < rail.scrollWidth - 8);
  };

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    updateArrows();
    rail.addEventListener("scroll", updateArrows, { passive: true });
    window.addEventListener("resize", updateArrows);
    return () => {
      rail.removeEventListener("scroll", updateArrows);
      window.removeEventListener("resize", updateArrows);
    };
  }, []);

  const scrollBy = (dir) => {
    const rail = railRef.current;
    if (!rail) return;
    rail.scrollBy({ left: rail.clientWidth * 0.85 * (dir === "next" ? 1 : -1), behavior: "smooth" });
  };

  return (
    <section
      id="all-trips"
      data-testid="all-trips-carousel"
      className="relative bg-[#FBF5EA] text-[#2C2621] py-20 md:py-28 overflow-hidden border-t border-[#2C2621]/5"
    >
      <div className="relative max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-end mb-12 md:mb-16">
          <div className="lg:col-span-7">
            <span className="inline-flex items-center gap-3 text-[11px] tracking-[0.35em] uppercase text-[#A07042]">
              <Compass className="w-3.5 h-3.5" strokeWidth={1.6} />
              {pick(COPY.overline, lang)}
              <span className="w-10 h-px bg-[#A07042]/40" />
            </span>
            <h2 className="font-serif-x text-3xl md:text-4xl lg:text-5xl leading-[1.05] tracking-tight mt-5 text-[#2C2621]">
              {pick(COPY.title, lang)}
            </h2>
          </div>
          <div className="lg:col-span-5 lg:text-right">
            <p className="text-base text-[#5C5248] leading-relaxed lg:max-w-sm lg:ml-auto">
              {pick(COPY.body, lang)}
            </p>
            <div className="mt-6 flex items-center gap-3 lg:justify-end">
              <button
                type="button"
                onClick={() => scrollBy("prev")}
                aria-label={pick(COPY.prev, lang)}
                data-testid="all-trips-prev"
                disabled={!canPrev}
                className="inline-flex items-center justify-center w-11 h-11 border border-[#2C2621]/25 hover:border-[#2C2621] hover:bg-[#2C2621] hover:text-[#FDFBF7] transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-[#2C2621]"
              >
                <ChevronLeft className="w-4 h-4" strokeWidth={1.6} />
              </button>
              <button
                type="button"
                onClick={() => scrollBy("next")}
                aria-label={pick(COPY.next, lang)}
                data-testid="all-trips-next"
                disabled={!canNext}
                className="inline-flex items-center justify-center w-11 h-11 border border-[#2C2621]/25 hover:border-[#2C2621] hover:bg-[#2C2621] hover:text-[#FDFBF7] transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-[#2C2621]"
              >
                <ChevronRight className="w-4 h-4" strokeWidth={1.6} />
              </button>
            </div>
          </div>
        </div>

        <div
          ref={railRef}
          data-testid="all-trips-rail"
          className="flex gap-5 md:gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4 -mx-6 md:-mx-12 px-6 md:px-12 no-scrollbar"
        >
          {TRIPS.map((trip) => (
            <Link
              key={trip.id}
              to={pathFor(lang, trip.routeId)}
              data-testid={`all-trips-card-${trip.id}`}
              className="group relative shrink-0 w-[78vw] sm:w-[320px] md:w-[340px] snap-start bg-white border border-[#2C2621]/8 hover:border-[#2C2621]/30 transition-colors"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-[#1A1513]">
                <img
                  src={trip.image}
                  alt={pick(trip.title, lang)}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.06]"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-[#1A1513]/90 via-[#1A1513]/30 to-[#1A1513]/8" />
                <span className="film-grain opacity-40" aria-hidden="true" />

                <span className="absolute top-4 left-4 inline-flex items-center gap-2 px-2.5 py-1 text-[9px] tracking-[0.3em] uppercase text-[#FDFBF7] text-on-image"
                  style={{ background: `${trip.accent}f0` }}>
                  {pick(TAGS[trip.tag], lang)}
                </span>

                <div className="absolute inset-x-0 bottom-0 p-5">
                  <span className="block text-[10px] tracking-[0.3em] uppercase text-[#FDFBF7]/80 mb-2 text-on-image">
                    {trip.nights}
                  </span>
                  <h3 className="font-serif-x text-[#FDFBF7] text-on-image text-xl md:text-[22px] leading-[1.15] tracking-tight">
                    {pick(trip.title, lang)}
                  </h3>
                </div>
              </div>

              <div className="px-5 py-5">
                <p className="text-[13px] text-[#5C5248] leading-[1.7] min-h-[2.6em]">
                  {pick(trip.desc, lang)}
                </p>
                <div className="mt-4 pt-4 border-t border-[#2C2621]/10 flex items-center justify-between gap-3">
                  <span className="text-[10px] tracking-[0.3em] uppercase text-[#A07042]">
                    {pick(COPY.cta, lang)}
                  </span>
                  <ArrowUpRight
                    className="w-4 h-4 text-[#2C2621] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#C16542]"
                    strokeWidth={1.6}
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
