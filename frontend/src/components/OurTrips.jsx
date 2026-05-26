import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Sun, Globe2, Mountain, Wind, MountainSnow, Scissors, CalendarDays } from "lucide-react";
import { useLanguage, pick } from "@/contexts/LanguageContext";
import { pathFor } from "@/lib/routes";

/* ============================================================
   OurTrips — editorial bento grid of trip categories
   -------------------------------------------------------------
   One featured card (Marruecos al completo) + six secondary
   cards. Designed for the home, between TravelCategories /
   StressFreeProcess.
============================================================ */

const T = (es, en, fr) => ({ es, en, fr });

const COPY = {
  eyebrow: T("Nuestros viajes", "Our journeys", "Nos voyages"),
  title:   T(
    "Elige cómo quieres descubrir Marruecos.",
    "Choose how you want to discover Morocco.",
    "Choisissez comment découvrir le Maroc.",
  ),
  intro: T(
    "Seis formas de viajar diseñadas para que escojas la que mejor encaja con tu tiempo, tus intereses y tu manera de viajar. Cada ruta está cuidada al detalle por nuestro equipo en destino.",
    "Six ways to travel, designed so you can pick the one that fits your time, your interests and your style. Every route is curated end-to-end by our in-country team.",
    "Six façons de voyager, conçues pour que vous choisissiez celle qui correspond à votre temps, vos centres d'intérêt et votre style. Chaque itinéraire est conçu sur place par notre équipe.",
  ),
  cta: T("Descubrir ruta", "Discover route", "Découvrir l'itinéraire"),
  featured: T("Destacado", "Featured", "À la une"),
};

const ICONS = {
  sun: Sun, globe: Globe2, mountain: Mountain, wind: Wind,
  "mountain-snow": MountainSnow, scissors: Scissors, "calendar-days": CalendarDays,
};

const TRIPS = [
  {
    id: "full",
    routeId: "tourFull",
    featured: true,
    accent: "#C16542",
    icon: "globe",
    image: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=2000&q=85",
    category: T("Travesía completa", "Full crossing", "Traversée complète"),
    title: T("Marruecos al completo", "Full Morocco", "Maroc intégral"),
    desc:  T(
      "Una sola ruta que enlaza el norte imperial, el Atlas, el Sáhara y la ciudad roja. Para quienes quieren entender el país en profundidad.",
      "A single route linking the imperial north, the Atlas, the Sahara and the red city. For those who want to grasp the country in depth.",
      "Un seul itinéraire reliant le nord impérial, l'Atlas, le Sahara et la ville rouge. Pour comprendre le pays en profondeur.",
    ),
    days: T("De 9 a 14 noches", "9 to 14 nights", "De 9 à 14 nuits"),
  },
  {
    id: "south",
    routeId: "tourSouth",
    accent: "#A07042",
    icon: "sun",
    image: "https://images.unsplash.com/photo-1542401886-65d6c61db217?auto=format&fit=crop&w=1600&q=85",
    category: T("Por región", "By region", "Par région"),
    title: T("Sur de Marruecos", "Southern Morocco", "Sud du Maroc"),
    desc:  T("Atlas, kasbahs, Erg Chebbi y oasis del Drâa.",
             "Atlas, kasbahs, Erg Chebbi and Drâa oases.",
             "Atlas, kasbahs, Erg Chebbi et oasis du Drâa."),
    days: T("4 – 10 noches", "4 – 10 nights", "4 – 10 nuits"),
  },
  {
    id: "north",
    routeId: "tourNorth",
    accent: "#3A4A5F",
    icon: "globe",
    image: "https://images.unsplash.com/photo-1570133435536-7ececf000ef6?auto=format&fit=crop&w=1600&q=85",
    category: T("Por región", "By region", "Par région"),
    title: T("Norte de Marruecos", "Northern Morocco", "Nord du Maroc"),
    desc:  T("Chefchaouen, Fez, Tánger y el Rif mediterráneo.",
             "Chefchaouen, Fez, Tangier and the Mediterranean Rif.",
             "Chefchaouen, Fès, Tanger et le Rif méditerranéen."),
    days: T("4 – 8 noches", "4 – 8 nights", "4 – 8 nuits"),
  },
  {
    id: "short",
    routeId: "tourShort",
    accent: "#5A7F9C",
    icon: "wind",
    image: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=1600&q=85",
    category: T("Pocos días", "Few days", "Quelques jours"),
    title: T("Escapadas cortas", "Short escapes", "Escapades courtes"),
    desc:  T("Zonas concretas — Marrakech, Fez, desierto, costa.",
             "Specific areas — Marrakech, Fez, desert, coast.",
             "Zones précises — Marrakech, Fès, désert, côte."),
    days: T("2 – 4 noches", "2 – 4 nights", "2 – 4 nuits"),
  },
  {
    id: "adventure",
    routeId: "tourAdventure",
    accent: "#5A6B4F",
    icon: "mountain-snow",
    image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1600&q=85",
    category: T("Activos", "Active", "Actifs"),
    title: T("Viajes de aventura", "Adventure travel", "Voyages d'aventure"),
    desc:  T("Trekking, 4x4, motos y rutas por montaña y desierto.",
             "Trekking, 4x4, bikes and routes across mountain and desert.",
             "Trekking, 4x4, motos et itinéraires montagne et désert."),
    days: T("5 – 12 noches", "5 – 12 nights", "5 – 12 nuits"),
  },
  {
    id: "bespoke",
    routeId: "tourBespoke",
    accent: "#D97742",
    icon: "scissors",
    image: "https://images.unsplash.com/photo-1547234935-80c7145ec969?auto=format&fit=crop&w=1600&q=85",
    category: T("Personalizado", "Custom", "Personnalisé"),
    title: T("Viajes a medida", "Tailor-made tours", "Voyages sur mesure"),
    desc:  T("Diseñamos tu ruta desde cero a partir de una conversación.",
             "We design your route from scratch starting with a conversation.",
             "Nous concevons votre itinéraire sur mesure dès l'entretien initial."),
    days: T("Personalizable", "Customisable", "Personnalisable"),
  },
];

const FEATURED = TRIPS.find((t) => t.featured);
const REST     = TRIPS.filter((t) => !t.featured);

/* ============================================================
   Card components
============================================================ */
const FeaturedCard = ({ trip, lang }) => {
  const I = ICONS[trip.icon];
  return (
    <Link
      to={pathFor(lang, trip.routeId)}
      data-testid={`our-trips-featured-${trip.id}`}
      className="group relative col-span-12 lg:col-span-7 lg:row-span-2 overflow-hidden bg-[#1A1513] block aspect-[4/5] lg:aspect-auto lg:min-h-[640px]"
    >
      <img
        src={trip.image}
        alt={pick(trip.title, lang)}
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.05]"
      />
      <span className="absolute inset-0 bg-gradient-to-t from-[#1A1513]/85 via-[#1A1513]/30 to-transparent" />
      <span className="film-grain opacity-40" aria-hidden="true" />

      <span
        className="absolute top-7 left-7 inline-flex items-center gap-2 px-3 py-1.5 text-[10px] tracking-[0.3em] uppercase text-[#1A1513]"
        style={{ background: trip.accent }}
      >
        {pick(COPY.featured, lang)}
      </span>

      <div className="absolute inset-x-0 bottom-0 p-8 md:p-10 lg:p-12">
        <span className="inline-flex items-center gap-3 text-[10px] tracking-[0.3em] uppercase text-[#FDFBF7]/75">
          {I && <I className="w-3.5 h-3.5" strokeWidth={1.6} style={{ color: trip.accent }} />}
          {pick(trip.category, lang)}
        </span>
        <h3 className="font-serif-x text-[#FDFBF7] text-4xl md:text-5xl lg:text-6xl leading-[1.05] tracking-tight mt-5 max-w-xl">
          {pick(trip.title, lang)}
        </h3>
        <p className="text-[#FDFBF7]/80 text-base md:text-lg leading-relaxed mt-5 max-w-md">
          {pick(trip.desc, lang)}
        </p>
        <div className="flex items-end justify-between gap-6 mt-8">
          <span className="text-[11px] tracking-[0.25em] uppercase text-[#FDFBF7]/55">
            {pick(trip.days, lang)}
          </span>
          <span
            className="inline-flex items-center gap-3 text-[11px] tracking-[0.25em] uppercase text-[#FDFBF7] pb-1 border-b border-[#FDFBF7]/40 group-hover:border-[#D4A373] group-hover:text-[#D4A373] transition-colors"
          >
            {pick(COPY.cta, lang)}
            <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={1.6} />
          </span>
        </div>
      </div>
    </Link>
  );
};

const SmallCard = ({ trip, lang }) => {
  const I = ICONS[trip.icon];
  return (
    <Link
      to={pathFor(lang, trip.routeId)}
      data-testid={`our-trips-card-${trip.id}`}
      className="group relative overflow-hidden bg-[#FBF5EA] border border-[#2C2621]/8 hover:border-[#2C2621]/25 transition-colors block"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-[#1A1513]">
        <img
          src={trip.image}
          alt={pick(trip.title, lang)}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.06]"
        />
        <span className="absolute inset-0 bg-gradient-to-t from-[#1A1513]/60 via-transparent to-transparent" />
        {/* Tag */}
        <span className="absolute top-4 left-4 inline-flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase text-[#FDFBF7]">
          {I && (
            <span
              className="inline-flex items-center justify-center w-6 h-6 rounded-full"
              style={{ background: `${trip.accent}` }}
            >
              <I className="w-3 h-3 text-[#1A1513]" strokeWidth={1.8} />
            </span>
          )}
          {pick(trip.category, lang)}
        </span>
      </div>

      <div className="p-6 md:p-7">
        <h3 className="font-serif-x text-2xl md:text-[26px] leading-[1.1] tracking-tight text-[#2C2621]">
          {pick(trip.title, lang)}
        </h3>
        <p className="mt-3 text-[14px] text-[#5C5248] leading-[1.7] line-clamp-2">
          {pick(trip.desc, lang)}
        </p>
        <div className="mt-5 pt-4 border-t border-[#2C2621]/10 flex items-center justify-between gap-4">
          <span className="text-[10px] tracking-[0.25em] uppercase text-[#A07042]">
            {pick(trip.days, lang)}
          </span>
          <span
            className="inline-flex items-center gap-2 text-[10px] tracking-[0.25em] uppercase text-[#2C2621] group-hover:text-[#C16542] transition-colors"
          >
            {pick(COPY.cta, lang)}
            <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={1.6} />
          </span>
        </div>
      </div>
    </Link>
  );
};

/* ============================================================
   Main section
============================================================ */
export default function OurTrips() {
  const { lang } = useLanguage();

  return (
    <section
      id="our-trips"
      data-testid="our-trips"
      className="relative bg-[#F5EFE3] text-[#2C2621] py-24 md:py-32 overflow-hidden border-t border-[#2C2621]/5"
    >
      <div className="relative max-w-7xl mx-auto px-6 md:px-12">
        {/* Heading */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-end mb-14 md:mb-20">
          <div className="lg:col-span-7">
            <span className="inline-flex items-center gap-3 text-[11px] tracking-[0.35em] uppercase text-[#A07042]">
              {pick(COPY.eyebrow, lang)}
              <span className="w-10 h-px bg-[#A07042]/40" />
            </span>
            <h2 className="font-serif-x text-4xl md:text-5xl lg:text-6xl leading-[1.05] tracking-tight mt-5 text-[#2C2621]">
              {pick(COPY.title, lang)}
            </h2>
          </div>
          <div className="lg:col-span-5">
            <p className="text-base md:text-lg text-[#5C5248] leading-[1.75]">
              {pick(COPY.intro, lang)}
            </p>
          </div>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-12 gap-5 md:gap-6">
          {FEATURED && <FeaturedCard trip={FEATURED} lang={lang} />}

          <div className="col-span-12 lg:col-span-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-5 md:gap-6">
            {REST.slice(0, 2).map((t) => (
              <SmallCard key={t.id} trip={t} lang={lang} />
            ))}
          </div>

          {REST.slice(2).map((t) => (
            <div key={t.id} className="col-span-12 md:col-span-6 lg:col-span-4">
              <SmallCard trip={t} lang={lang} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
