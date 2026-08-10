import React, { useEffect, useMemo, useState } from "react";
import { ArrowRight, Archive, Search, SlidersHorizontal } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage, pick } from "@/contexts/LanguageContext";
import { ALL_TRIPS } from "@/lib/allTripsCatalog";
import { getProgramTiers } from "@/lib/programPricing";
import { usePricing } from "@/lib/pricingStore";
import { TRIP_PROGRAMS } from "@/lib/tripPrograms";
import { pathFor } from "@/lib/routes";
import { loadSupabaseImages } from "@/lib/supabaseImages";
import { tripImages } from "@/lib/tripImageGallery";
import TripImageCarousel from "@/components/TripImageCarousel";

const T = (es, en, fr) => ({ es, en, fr });

const COPY = {
  eyebrow: T("Archivo de viajes · Xaluca Tours", "Trip archive · Xaluca Tours", "Archives des voyages · Xaluca Tours"),
  title: T("Todos nuestros viajes, en un solo lugar.", "Every journey, in one place.", "Tous nos voyages, au même endroit."),
  intro: T(
    "Consulta el índice completo de programas disponibles, compara duración y precios por temporada y accede directamente al itinerario que quieras descubrir.",
    "Browse the complete index of available programmes, compare duration and seasonal prices, and open any itinerary directly.",
    "Consultez l’index complet des programmes, comparez leur durée et leurs tarifs saisonniers, puis ouvrez directement l’itinéraire de votre choix.",
  ),
  home: T("Inicio", "Home", "Accueil"),
  archive: T("Archivo", "Archive", "Archives"),
  search: T("Buscar por viaje, destino o región…", "Search by journey, destination or region…", "Rechercher par voyage, destination ou région…"),
  filter: T("Filtrar por colección", "Filter by collection", "Filtrer par collection"),
  all: T("Todos los viajes", "All journeys", "Tous les voyages"),
  results: T("viajes disponibles", "journeys available", "voyages disponibles"),
  trip: T("Viaje", "Journey", "Voyage"),
  images: T("Imágenes", "Images", "Images"),
  collection: T("Colección", "Collection", "Collection"),
  duration: T("Duración", "Duration", "Durée"),
  low: T("Temporada baja", "Low season", "Basse saison"),
  high: T("Temporada alta", "High season", "Haute saison"),
  from: T("Desde", "From", "Dès"),
  perPerson: T("por persona", "per person", "par personne"),
  view: T("Ver viaje", "View journey", "Voir le voyage"),
  empty: T("No hay viajes que coincidan con la búsqueda.", "No journeys match your search.", "Aucun voyage ne correspond à votre recherche."),
  reset: T("Mostrar todos", "Show all", "Tout afficher"),
  previousImage: T("Imagen anterior", "Previous image", "Image précédente"),
  nextImage: T("Imagen siguiente", "Next image", "Image suivante"),
  imageCount: T("Referencia visual del viaje", "Journey visual preview", "Aperçu visuel du voyage"),
  priceNote: T(
    "Precios desde por persona, calculados con la tarifa más favorable disponible para cada temporada. El precio final depende del número de viajeros y de la disponibilidad.",
    "From prices per person, calculated using the best available rate for each season. The final price depends on party size and availability.",
    "Prix à partir de par personne, calculés selon le meilleur tarif disponible pour chaque saison. Le prix final dépend du nombre de voyageurs et des disponibilités.",
  ),
};

const COLLECTIONS = {
  sur: T("Sur y desierto", "South & desert", "Sud et désert"),
  completo: T("Grandes rutas", "Grand tours", "Grands circuits"),
  norte: T("Norte de Marruecos", "Northern Morocco", "Nord du Maroc"),
  escapadas: T("Escapadas", "Short escapes", "Escapades"),
  aventura: T("Aventura", "Adventure", "Aventure"),
  eventos: T("Salidas especiales", "Special departures", "Départs spéciaux"),
};

const ROUTE_LABELS = {
  DesiertoAtlas: T("Desierto → Atlas", "Desert → Atlas", "Désert → Atlas"),
  AtlasDesierto: T("Atlas → Desierto", "Atlas → Desert", "Atlas → Désert"),
  MarrakechErg: T("Marrakech → Erg Chebbi", "Marrakech → Erg Chebbi", "Marrakech → Erg Chebbi"),
  ErgMarrakech: T("Erg Chebbi → Marrakech", "Erg Chebbi → Marrakech", "Erg Chebbi → Marrakech"),
  MarrakechLoop: T("Marrakech → Erg Chebbi → Marrakech", "Marrakech → Erg Chebbi → Marrakech", "Marrakech → Erg Chebbi → Marrakech"),
  MarrakechEss: T("Marrakech y Essaouira", "Marrakech & Essaouira", "Marrakech et Essaouira"),
  FezAtlasErr: T("Fez → Atlas → Errachidia", "Fez → Atlas → Errachidia", "Fès → Atlas → Errachidia"),
  FezRak: T("Fez → Marrakech", "Fez → Marrakech", "Fès → Marrakech"),
  FezSidialiRak: T("Fez → Sidi Ali → Marrakech", "Fez → Sidi Ali → Marrakech", "Fès → Sidi Ali → Marrakech"),
  MarrakechFez: T("Marrakech → Fez", "Marrakech → Fez", "Marrakech → Fès"),
  MarrakechSidialiFez: T("Marrakech → Sidi Ali → Fez", "Marrakech → Sidi Ali → Fez", "Marrakech → Sidi Ali → Fès"),
  FezSidialiOzz: T("Fez → Sidi Ali → Ouarzazate", "Fez → Sidi Ali → Ouarzazate", "Fès → Sidi Ali → Ouarzazate"),
  OzzSidialiFez: T("Ouarzazate → Sidi Ali → Fez", "Ouarzazate → Sidi Ali → Fez", "Ouarzazate → Sidi Ali → Fès"),
  TangerRak: T("Tánger → Marrakech", "Tangier → Marrakech", "Tanger → Marrakech"),
  CiudadesImperiales: T("Ciudades imperiales", "Imperial cities", "Villes impériales"),
  CiudadesImperialesRif: T("Ciudades imperiales y Rif", "Imperial cities & Rif", "Villes impériales et Rif"),
  TangerFez: T("Tánger → Fez", "Tangier → Fez", "Tanger → Fès"),
  FezTanger: T("Fez → Tánger", "Fez → Tangier", "Fès → Tanger"),
  EnduroAventura: T("Enduro Sáhara", "Sahara enduro", "Enduro Sahara"),
  EscapadaDesierto: T("Escapada al desierto", "Desert escape", "Escapade dans le désert"),
  EscapadaAtlas: T("Escapada al Alto Atlas", "High Atlas escape", "Escapade dans le Haut Atlas"),
  EscapadaFezSidiali: T("Fez y Sidi Ali", "Fez & Sidi Ali", "Fès et Sidi Ali"),
  EscapadaFez: T("Escapada a Fez", "Fez escape", "Escapade à Fès"),
  EscapadaMarrakech: T("Escapada a Marrakech", "Marrakech escape", "Escapade à Marrakech"),
  EscapadaRakAgafay: T("Marrakech y Agafay", "Marrakech & Agafay", "Marrakech et Agafay"),
};

// These public URLs are alternate entrances to an identical programme.
// The archive keeps one canonical row per journey, as requested.
const ROUTE_ALIASES = new Set([
  "tourEscapadaRakErgRak23",
  "tourEscapadaRakErgRak34",
  "tourEscapadaRakErgRak45",
]);

const getRouteStem = (routeId) => routeId.replace(/^tour/, "").replace(/\d+$/, "");

const getCollection = (routeId) => {
  if (routeId === "tourFinDeAno2025") return "eventos";
  const stem = getRouteStem(routeId);
  if (stem.startsWith("Escapada")) return "escapadas";
  if (stem.startsWith("Enduro")) return "aventura";
  if (/^(Ciudades|TangerFez|FezTanger)/.test(stem)) return "norte";
  if (/^(FezRak|FezSidiali|MarrakechFez|MarrakechSidiali|OzzSidiali|TangerRak)/.test(stem)) return "completo";
  return "sur";
};

const getSeasonMinimum = (tiers, key) => {
  const values = (tiers || []).map((tier) => Number(tier?.[key])).filter((value) => Number.isFinite(value) && value > 0);
  return values.length ? Math.min(...values) : null;
};

const formatPrice = (value, lang) => value == null
  ? "—"
  : new Intl.NumberFormat(lang === "es" ? "es-ES" : lang === "fr" ? "fr-FR" : "en-GB", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(value);

const buildArchive = (pricing, imageManifest) => {
  const catalogueByRoute = new Map(ALL_TRIPS.map((trip) => [trip.routeId, trip]));
  const programmeRows = Object.entries(TRIP_PROGRAMS)
    .filter(([routeId]) => !ROUTE_ALIASES.has(routeId))
    .map(([routeId, entry]) => ({ routeId, ...entry }));

  return [
    ...programmeRows,
    {
      routeId: "tourFinDeAno2025",
      program: { duration: T("5 noches / 6 días", "5 nights / 6 days", "5 nuits / 6 jours") },
    },
  ].filter(({ routeId }) => pathFor("es", routeId) !== "/").map(({ routeId, program }) => {
    const catalogue = catalogueByRoute.get(routeId);
    const stem = getRouteStem(routeId);
    const title = catalogue?.title || ROUTE_LABELS[stem] || T(routeId, routeId, routeId);
    const tiers = getProgramTiers(routeId) || pricing.tiers;
    return {
      routeId,
      title,
      duration: program?.duration || T("Consultar", "Enquire", "Consulter"),
      collection: getCollection(routeId),
      low: getSeasonMinimum(tiers, "low"),
      high: getSeasonMinimum(tiers, "high"),
      images: tripImages(routeId, program, catalogue, imageManifest),
    };
  });
};

const PriceCell = ({ value, lang }) => (
  <div className="flex flex-col">
    <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#9A6B4D]">{pick(COPY.from, lang)}</span>
    <span className="mt-1 font-serif-x text-xl text-[#2C2621]">{formatPrice(value, lang)}</span>
    <span className="mt-0.5 text-[9px] uppercase tracking-[0.14em] text-[#81766C]">{pick(COPY.perPerson, lang)}</span>
  </div>
);

export default function ArchivoPage() {
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const pricing = usePricing();
  const [query, setQuery] = useState("");
  const [collection, setCollection] = useState("all");
  const [imageManifest, setImageManifest] = useState(null);

  useEffect(() => {
    document.title = pick(T("Archivo de viajes · Xaluca Tours", "Trip archive · Xaluca Tours", "Archives des voyages · Xaluca Tours"), lang);
  }, [lang]);

  useEffect(() => {
    let active = true;
    loadSupabaseImages()
      .then((manifest) => { if (active) setImageManifest(manifest); })
      .catch(() => { if (active) setImageManifest({ slots: [], galleries: [] }); });
    return () => { active = false; };
  }, []);

  const archive = useMemo(() => buildArchive(pricing, imageManifest), [pricing, imageManifest]);
  const visible = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase(lang);
    return archive
      .filter((trip) => collection === "all" || trip.collection === collection)
      .filter((trip) => {
        if (!needle) return true;
        return [pick(trip.title, lang), pick(COLLECTIONS[trip.collection], lang), pick(trip.duration, lang)]
          .join(" ")
          .toLocaleLowerCase(lang)
          .includes(needle);
      })
      .sort((a, b) => {
        const collectionOrder = Object.keys(COLLECTIONS).indexOf(a.collection) - Object.keys(COLLECTIONS).indexOf(b.collection);
        return collectionOrder || pick(a.title, lang).localeCompare(pick(b.title, lang), lang, { numeric: true });
      });
  }, [archive, collection, lang, query]);

  const openTrip = (routeId) => navigate(pathFor(lang, routeId));

  return (
    <main data-testid="archivo-page" className="min-h-screen bg-[#F7F0E5] text-[#2C2621]">
      <section className="border-b border-[#2C2621]/10 bg-[#FDFBF7] pb-14 pt-[180px] sm:pt-[190px] lg:pb-20 lg:pt-[205px]">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.24em] text-[#82766C]">
            <Link to={pathFor(lang, "home")} className="transition-colors hover:text-[#C16542]">{pick(COPY.home, lang)}</Link>
            <ChevronRight className="h-3 w-3" aria-hidden="true" />
            <span className="text-[#C16542]">{pick(COPY.archive, lang)}</span>
          </nav>

          <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.42fr)] lg:items-end">
            <div>
              <span className="inline-flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#C16542]">
                <Archive className="h-4 w-4" strokeWidth={1.5} />
                {pick(COPY.eyebrow, lang)}
              </span>
              <h1 className="mt-5 max-w-4xl font-serif-x text-4xl font-normal leading-[0.98] sm:text-5xl lg:text-7xl">
                {pick(COPY.title, lang)}
              </h1>
            </div>
            <p className="max-w-xl text-sm leading-7 text-[#675D54] sm:text-base">{pick(COPY.intro, lang)}</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-12 lg:py-14">
        <div className="border border-[#2C2621]/10 bg-[#FDFBF7] p-4 sm:p-5">
          <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_280px]">
            <label className="relative block">
              <span className="sr-only">{pick(COPY.search, lang)}</span>
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9A6B4D]" strokeWidth={1.6} />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={pick(COPY.search, lang)}
                data-testid="archivo-search"
                className="h-14 w-full border border-[#2C2621]/15 bg-white pl-11 pr-4 text-sm outline-none transition-colors placeholder:text-[#8A8179] focus:border-[#C16542]"
              />
            </label>
            <label className="relative block">
              <span className="sr-only">{pick(COPY.filter, lang)}</span>
              <SlidersHorizontal className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9A6B4D]" strokeWidth={1.6} />
              <select
                value={collection}
                onChange={(event) => setCollection(event.target.value)}
                data-testid="archivo-filter"
                className="h-14 w-full appearance-none border border-[#2C2621]/15 bg-white pl-11 pr-10 text-[10px] font-semibold uppercase tracking-[0.18em] outline-none transition-colors focus:border-[#C16542]"
              >
                <option value="all">{pick(COPY.all, lang)}</option>
                {Object.entries(COLLECTIONS).map(([id, label]) => <option key={id} value={id}>{pick(label, lang)}</option>)}
              </select>
              <ChevronRight className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 rotate-90 text-[#82766C]" />
            </label>
          </div>
        </div>

        <div className="mb-5 mt-8 flex flex-wrap items-end justify-between gap-4">
          <p className="font-serif-x text-2xl">
            <span className="text-[#C16542]">{visible.length}</span> {pick(COPY.results, lang)}
          </p>
          <p className="max-w-2xl text-right text-[10px] leading-5 text-[#786E65]">{pick(COPY.priceNote, lang)}</p>
        </div>

        {visible.length ? (
          <div className="overflow-hidden border border-[#2C2621]/12 bg-[#FDFBF7] shadow-[0_20px_60px_-48px_rgba(44,38,33,.55)]">
            <table className="block w-full border-collapse md:table" data-testid="archivo-table">
              <thead className="hidden bg-[#2C2621] text-[#FDFBF7] md:table-header-group">
                <tr>
                  {[COPY.trip, COPY.images, COPY.collection, COPY.duration, COPY.low, COPY.high].map((label, index) => (
                    <th key={index} scope="col" className="px-5 py-4 text-left text-[9px] font-semibold uppercase tracking-[0.22em] lg:px-6">{pick(label, lang)}</th>
                  ))}
                  <th scope="col" className="px-5 py-4 text-right text-[9px] font-semibold uppercase tracking-[0.22em] lg:px-6">
                    <span className="sr-only">{pick(COPY.view, lang)}</span>
                  </th>
                </tr>
              </thead>
              <tbody className="block divide-y divide-[#2C2621]/10 md:table-row-group">
                {visible.map((trip, index) => {
                  const href = pathFor(lang, trip.routeId);
                  return (
                    <tr
                      key={trip.routeId}
                      role="link"
                      tabIndex={0}
                      onClick={() => openTrip(trip.routeId)}
                      onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); openTrip(trip.routeId); } }}
                      data-testid={`archivo-row-${trip.routeId}`}
                      className="group grid cursor-pointer grid-cols-2 gap-x-4 gap-y-5 p-5 outline-none transition-colors hover:bg-[#F3E9DB] focus-visible:bg-[#F3E9DB] md:table-row md:p-0"
                    >
                      <td className="col-span-2 md:w-[24%] md:px-5 md:py-5 lg:px-6">
                        <div className="flex items-start gap-4">
                          <span className="mt-0.5 font-serif-x text-lg tabular-nums text-[#C16542]/60">{String(index + 1).padStart(2, "0")}</span>
                          <div>
                            <span className="font-serif-x text-xl leading-tight text-[#2C2621] transition-colors group-hover:text-[#A95436] lg:text-[22px]">{pick(trip.title, lang)}</span>
                            <span className="mt-1.5 block break-all text-[9px] tracking-[0.08em] text-[#897E75]">{href}</span>
                          </div>
                        </div>
                      </td>
                      <td className="col-span-2 md:w-[20%] md:px-3 md:py-3 lg:px-4">
                        <TripImageCarousel images={trip.images} title={pick(trip.title, lang)} lang={lang} />
                      </td>
                      <td className="col-span-2 md:w-[13%] md:px-4 md:py-5 lg:px-5">
                        <span className="mb-1.5 block text-[9px] font-semibold uppercase tracking-[0.18em] text-[#9A6B4D] md:hidden">{pick(COPY.collection, lang)}</span>
                        <span className="inline-flex border border-[#C16542]/25 bg-[#C16542]/5 px-3 py-2 text-[9px] font-semibold uppercase tracking-[0.16em] text-[#9B563C]">{pick(COLLECTIONS[trip.collection], lang)}</span>
                      </td>
                      <td className="col-span-2 md:w-[11%] md:px-4 md:py-5 lg:px-5">
                        <span className="mb-1.5 block text-[9px] font-semibold uppercase tracking-[0.18em] text-[#9A6B4D] md:hidden">{pick(COPY.duration, lang)}</span>
                        <span className="text-sm text-[#5F564E]">{pick(trip.duration, lang)}</span>
                      </td>
                      <td className="md:w-[10%] md:px-4 md:py-5 lg:px-5">
                        <span className="mb-2 block text-[9px] font-semibold uppercase tracking-[0.18em] text-[#9A6B4D] md:hidden">{pick(COPY.low, lang)}</span>
                        <PriceCell value={trip.low} lang={lang} />
                      </td>
                      <td className="md:w-[10%] md:px-4 md:py-5 lg:px-5">
                        <span className="mb-2 block text-[9px] font-semibold uppercase tracking-[0.18em] text-[#9A6B4D] md:hidden">{pick(COPY.high, lang)}</span>
                        <PriceCell value={trip.high} lang={lang} />
                      </td>
                      <td className="col-span-2 md:w-[12%] md:px-4 md:py-5 md:text-right lg:px-5">
                        <Link
                          to={href}
                          onClick={(event) => event.stopPropagation()}
                          className="inline-flex w-full items-center justify-center gap-3 bg-[#C16542] px-5 py-3.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-[#A95436] md:w-auto"
                        >
                          {pick(COPY.view, lang)}
                          <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.7} />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="border border-[#2C2621]/10 bg-[#FDFBF7] px-6 py-20 text-center">
            <Archive className="mx-auto h-8 w-8 text-[#C16542]" strokeWidth={1.3} />
            <p className="mt-5 font-serif-x text-2xl">{pick(COPY.empty, lang)}</p>
            <button type="button" onClick={() => { setQuery(""); setCollection("all"); }} className="mt-6 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#C16542] underline underline-offset-8">
              {pick(COPY.reset, lang)}
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
