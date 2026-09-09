import React, { useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowDown, ArrowLeft, ArrowRight, BookOpen, ChevronRight, Clock, Luggage, MapPin, Search } from "lucide-react";
import { useLanguage, pick } from "@/contexts/LanguageContext";
import { pathFor } from "@/lib/routes";
import { SECTIONS } from "@/lib/programNav";
import { buildPracticalTripIndex, filterPracticalTrips } from "@/lib/practicalTravelInfo";
import { namespaceForRouteId } from "@/components/slotScope";
import EditableText from "@/components/EditableText";
import TripPackingNotes from "@/components/TripPackingNotes";
import xMonogram from "@/assets/monograma-x-borde.png";

const T = (es, en, fr) => ({ es, en, fr });
const COPY = {
  title: T("Informaciones prácticas", "Practical information", "Informations pratiques"),
  home: T("Inicio", "Home", "Accueil"),
  eyebrow: T("Tu cuaderno de viaje · Xaluca Tours", "Your travel notebook · Xaluca Tours", "Votre carnet de voyage · Xaluca Tours"),
  heading: T("El viaje empieza antes de hacer la maleta.", "Your journey starts before you pack.", "Le voyage commence avant de faire sa valise."),
  intro: T("Encuentra tu viaje y consulta sus notas de preparación. Los mismos apuntes de cada itinerario, reunidos aquí para tenerlos siempre a mano.", "Find your journey and read its preparation notes. The same notes from each itinerary, brought together here to keep them close at hand.", "Retrouvez votre voyage et consultez ses notes de préparation. Les mêmes conseils que dans chaque itinéraire, réunis ici pour les garder à portée de main."),
  start: T("Consultar las notas de mi viaje", "Find my travel notes", "Consulter les notes de mon voyage"),
  category: T("Notas de viaje", "Travel notes", "Notes de voyage"),
  categoryIntro: T("Prepara tu maleta · Recomendaciones por itinerario", "Pack your bag · Recommendations by itinerary", "Préparez votre valise · Conseils par itinéraire"),
  trips: T("programas con notas", "programmes with notes", "programmes avec des notes"),
  find: T("Encuentra tu viaje", "Find your journey", "Trouvez votre voyage"),
  search: T("Buscar viaje o destino", "Search journey or destination", "Rechercher un voyage ou une destination"),
  placeholder: T("Ej. Atlas, Fez, 5 días…", "E.g. Atlas, Fez, 5 days…", "Ex. Atlas, Fès, 5 jours…"),
  collection: T("Colección de viajes", "Journey collection", "Collection de voyages"),
  all: T("Todas las colecciones", "All collections", "Toutes les collections"),
  results: T("programas encontrados", "programmes found", "programmes trouvés"),
  selected: T("Tu viaje seleccionado", "Your selected journey", "Votre voyage sélectionné"),
  view: T("Ver el viaje completo", "View the full journey", "Voir le voyage complet"),
  previous: T("Viaje anterior", "Previous journey", "Voyage précédent"),
  next: T("Siguiente viaje", "Next journey", "Voyage suivant"),
  empty: T("No encontramos ese viaje.", "We couldn't find that journey.", "Nous n'avons pas trouvé ce voyage."),
  emptyHint: T("Prueba con otro destino o elimina los filtros para ver todos los programas.", "Try another destination or clear the filters to see every programme.", "Essayez une autre destination ou effacez les filtres pour voir tous les programmes."),
  reset: T("Mostrar todos los viajes", "Show every journey", "Afficher tous les voyages"),
};

export default function PracticalInfoPage() {
  const { lang } = useLanguage();
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState("");
  const [section, setSection] = useState("all");
  const contentRef = useRef(null);
  const trips = useMemo(buildPracticalTripIndex, []);
  const sections = useMemo(() => Object.keys(SECTIONS).filter((key) => trips.some((trip) => trip.section === key)), [trips]);
  const visible = useMemo(() => filterPracticalTrips(trips, { query, section, lang }), [trips, query, section, lang]);
  const selected = visible.find((trip) => trip.routeId === params.get("viaje")) || visible[0];
  const selectedIndex = visible.indexOf(selected);
  const copy = (key) => pick(COPY[key], lang);

  const selectTrip = (trip) => {
    if (!trip) return;
    const next = new URLSearchParams(params);
    next.set("viaje", trip.routeId);
    setParams(next, { preventScrollReset: true });
    // Move to the selected notes on mobile without hiding the trip selector
    // behind a modal. Keyboard users land at the same content heading.
    requestAnimationFrame(() => {
      contentRef.current?.focus({ preventScroll: true });
      if (window.matchMedia("(max-width: 1023px)").matches) {
        contentRef.current?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
      }
    });
  };

  return (
    <div data-testid="practical-info-page" className="bg-[#F7F0E6] text-[#2C2621]">
      <section className="relative overflow-hidden bg-[#1A1513] pb-14 pt-40 text-[#FDFBF7] md:pb-20 md:pt-48">
        <div className="pointer-events-none absolute inset-0 berber-bg-cross opacity-50" aria-hidden="true" />
        <img src={xMonogram} alt="" aria-hidden="true" className="pointer-events-none absolute bottom-0 right-0 h-[90%] max-w-none opacity-[0.12]" />
        <div className="relative mx-auto max-w-7xl px-6 md:px-12">
          <nav aria-label="Breadcrumb" className="mb-9 flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-[#FDFBF7]/65">
            <Link to={pathFor(lang, "home")} className="hover:text-[#D4A373]">{copy("home")}</Link>
            <ChevronRight className="h-3 w-3" aria-hidden="true" />
            <span aria-current="page" className="text-[#D4A373]">{copy("title")}</span>
          </nav>
          <div className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#D4A373]">
            <BookOpen className="h-4 w-4 shrink-0" aria-hidden="true" />{copy("eyebrow")}
          </div>
          <h1 className="mt-5 font-serif-x text-4xl leading-tight sm:text-5xl lg:text-6xl">{copy("title")}</h1>
          <p className="mt-5 max-w-2xl font-serif-x text-2xl leading-snug text-[#D4A373] md:text-3xl">{copy("heading")}</p>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-[#FDFBF7]/75 md:text-base">{copy("intro")}</p>
          <a href="#travel-notes" className="mt-8 inline-flex min-h-12 items-center gap-3 border border-[#D4A373]/45 px-5 py-3 text-[10px] uppercase tracking-[0.16em] transition-colors hover:bg-[#D4A373] hover:text-[#1A1513]">
            {copy("start")}<ArrowDown className="h-4 w-4 shrink-0" aria-hidden="true" />
          </a>
        </div>
      </section>

      <section id="travel-notes" className="mx-auto max-w-7xl scroll-mt-32 px-6 py-10 md:px-12 md:py-14" aria-label={copy("category")}>
        {/* The hub currently has one category; future categories can be added
            alongside it without introducing unverified practical advice. */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-[#2C2621]/15 pb-6">
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center border border-[#C16542]/30 text-[#C16542]"><Luggage className="h-6 w-6" strokeWidth={1.4} aria-hidden="true" /></span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em]">01 · {copy("category")}</p>
              <p className="mt-1 text-xs leading-relaxed text-[#675D54]">{copy("categoryIntro")}</p>
            </div>
          </div>
          <p className="text-xs text-[#675D54]"><span className="mr-2 font-serif-x text-3xl text-[#C16542]">{trips.length}</span>{copy("trips")}</p>
        </div>

        <div className="grid min-w-0 items-start gap-7 lg:grid-cols-[290px_minmax(0,1fr)]">
          <aside id="trip-finder" className="min-w-0 scroll-mt-32 border border-[#2C2621]/10 bg-[#FDFBF7] lg:sticky lg:top-32" aria-label={copy("find")}>
            <div className="space-y-4 border-b border-[#2C2621]/10 p-5">
              <h2 className="font-serif-x text-2xl">{copy("find")}</h2>
              <label className="block text-xs text-[#675D54]">
                {copy("search")}
                <span className="relative mt-2 block">
                  <Search className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-[#C16542]" aria-hidden="true" />
                  <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={copy("placeholder")} data-testid="info-search"
                    className="min-h-11 w-full border border-[#2C2621]/20 bg-transparent py-2 pl-9 pr-3 text-sm text-[#2C2621] focus:border-[#C16542] focus:outline-none focus:ring-1 focus:ring-[#C16542]" />
                </span>
              </label>
              <label className="block text-xs text-[#675D54]">
                {copy("collection")}
                <select value={section} onChange={(event) => setSection(event.target.value)} data-testid="info-collection"
                  className="mt-2 min-h-11 w-full border border-[#2C2621]/20 bg-[#FDFBF7] px-3 text-sm text-[#2C2621] focus:ring-1 focus:ring-[#C16542]">
                  <option value="all">{copy("all")}</option>
                  {sections.map((key) => <option key={key} value={key}>{pick(SECTIONS[key].label, lang)}</option>)}
                </select>
              </label>
              <p role="status" className="text-[11px] text-[#82766C]">{visible.length} {copy("results")}</p>
            </div>
            <nav aria-label={copy("categoryIntro")} className="max-h-64 overflow-y-auto overscroll-contain lg:max-h-[48vh]" data-testid="info-trip-index">
              <ul className="divide-y divide-[#2C2621]/10">
                {visible.map((trip) => (
                  <li key={trip.routeId}>
                    <button type="button" onClick={() => selectTrip(trip)} aria-current={trip === selected ? "true" : undefined} aria-controls="info-selected-trip"
                      data-testid={`info-select-${trip.routeId}`}
                      className={`w-full border-l-2 px-4 py-4 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#C16542] ${trip === selected ? "border-[#C16542] bg-[#F7F0E6]" : "border-transparent hover:bg-[#F7F0E6]/60"}`}>
                      <span className="block text-sm leading-relaxed">{pick(trip.title, lang)}</span>
                      <span className="mt-1 block text-[10px] capitalize leading-relaxed text-[#82766C]">{trip.reference}</span>
                      <span className="mt-2 flex items-center justify-between gap-2 text-[11px] text-[#9A6B4D]">{pick(trip.duration, lang)}<ArrowRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" /></span>
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          <div className="min-w-0">
            {selected ? (
              <section id="info-selected-trip" aria-labelledby="info-trip-title" data-testid="info-selected-trip" className="min-w-0">
                <a href="#trip-finder" className="mb-4 inline-flex min-h-11 items-center gap-2 text-xs text-[#C16542] lg:hidden"><ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />{copy("find")}</a>
                <div className="border border-[#2C2621]/10 bg-[#FDFBF7] p-6 md:p-8">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#C16542]">{copy("selected")} · {pick(SECTIONS[selected.section].label, lang)}</p>
                  <h2 ref={contentRef} tabIndex={-1} id="info-trip-title" className="mt-4 scroll-mt-40 font-serif-x text-3xl leading-tight focus:outline-none md:text-4xl">
                    <EditableText slot={`${namespaceForRouteId(selected.routeId)}.program.hero.title`} defaults={selected.title} multiline={false} />
                  </h2>
                  <p className="mt-4 flex items-center gap-2 text-sm text-[#C16542]"><Clock className="h-4 w-4 shrink-0" aria-hidden="true" />
                    <EditableText slot={`${namespaceForRouteId(selected.routeId)}.program.hero.duration`} defaults={selected.duration} multiline={false} />
                  </p>
                  {pick(selected.places, lang) && <p className="mt-3 flex items-start gap-2 text-xs leading-6 text-[#675D54]"><MapPin className="mt-1 h-4 w-4 shrink-0" aria-hidden="true" />{pick(selected.places, lang)}</p>}
                  <Link to={pathFor(lang, selected.routeId)} className="mt-5 inline-flex min-h-11 items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#C16542] hover:text-[#2C2621]">
                    {copy("view")}<ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>

                {/* Reuse the original cards AND their absolute trip CMS slots.
                    A changed note is therefore identical here and on its trip. */}
                <TripPackingNotes key={selected.routeId} routeId={selected.routeId} layout="grid" />

                <div className="mt-8 flex items-center justify-between gap-3 border-t border-[#2C2621]/15 pt-5">
                  <button type="button" disabled={selectedIndex === 0} onClick={() => selectTrip(visible[selectedIndex - 1])} className="inline-flex min-h-11 items-center gap-2 text-xs hover:text-[#C16542] disabled:opacity-30"><ArrowLeft className="h-4 w-4 shrink-0" aria-hidden="true" />{copy("previous")}</button>
                  <span className="shrink-0 text-[11px] text-[#82766C]">{selectedIndex + 1} / {visible.length}</span>
                  <button type="button" disabled={selectedIndex === visible.length - 1} onClick={() => selectTrip(visible[selectedIndex + 1])} className="inline-flex min-h-11 items-center gap-2 text-xs hover:text-[#C16542] disabled:opacity-30">{copy("next")}<ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" /></button>
                </div>
              </section>
            ) : (
              <div className="border border-[#2C2621]/10 bg-[#FDFBF7] p-8 text-center sm:p-14">
                <Search className="mx-auto h-8 w-8 text-[#C16542]" aria-hidden="true" />
                <h2 className="mt-5 font-serif-x text-3xl">{copy("empty")}</h2>
                <p className="mt-3 text-sm leading-7 text-[#675D54]">{copy("emptyHint")}</p>
                <button type="button" onClick={() => { setQuery(""); setSection("all"); }} className="mt-6 min-h-12 bg-[#C16542] px-5 py-3 text-sm text-white hover:bg-[#A35133]">{copy("reset")}</button>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
