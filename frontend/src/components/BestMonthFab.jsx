import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Sunrise, X, ArrowRight, Sparkles } from "lucide-react";
import { useLanguage, pick } from "@/contexts/LanguageContext";
import { pathFor, resolvePath } from "@/lib/routes";
import { REGIONS, MONTHS } from "@/lib/bestTimeData";

/* ------------------------------------------------------------------
   BestMonthFab
   Floating pill (bottom-right) that opens a side modal with the
   ideal travel-month extract for the current page's climate region.
   Mounted globally in <Layout>; self-hides on irrelevant routes.
------------------------------------------------------------------- */

/* Routes where the FAB should NOT show. */
const HIDDEN_ROUTES = new Set([
  null, undefined, "home", "contact", "whenToTravel", "planTrip",
  "appointment", "toursLanding", "catalog", "morocco", "events",
  "about", "whatWeDo", "whatToSee", "upcomingDepartures",
]);

/* Map routeId → climate region id from REGIONS. */
const routeToRegion = (routeId) => {
  if (!routeId) return null;
  const id = routeId.toLowerCase();

  // North (imperial cities, Tangier, Fez, Chefchaouen)
  if (
    routeId === "tourNorth" ||
    routeId.startsWith("tourNorte") ||
    routeId.startsWith("tourCiudadesImperiales") ||
    routeId.startsWith("tourTangerFez") ||
    routeId.startsWith("tourFezTanger") ||
    routeId === "tourEscapadaTanger" ||
    routeId.startsWith("tourEscapadaFez")
  ) return "north";

  // Atlantic coast (Essaouira)
  if (routeId.startsWith("tourMarrakechEss")) return "coast";

  // High Atlas (adventure, enduro, atlas escapades)
  if (
    routeId === "tourAdventure" ||
    routeId === "tourAventuraEnduroHub" ||
    routeId.startsWith("tourEnduroAventura") ||
    routeId === "tourEscapadaAtlas34" ||
    routeId === "tourAtlasDesiertoFezHub" ||
    routeId === "tourErrAtlasFezHub" ||
    routeId === "tourFezAtlasErr56"
  ) return "atlas";

  // Marrakech central (city-centric escapes)
  if (
    routeId === "tourBespoke" ||
    routeId === "tourEscapadaMarrakech" ||
    routeId === "tourEscapadaMarrakech23" ||
    routeId === "tourEscapadaRakAgafay34"
  ) return "marrakech";

  // Default — Sahara / desert (south, Erg Chebbi, gran sur, etc.)
  if (
    routeId === "tourSouth" ||
    routeId === "tourFull" ||
    routeId === "tourFinDeAno2025" ||
    routeId === "tourShort" ||
    id.includes("desierto") ||
    id.includes("ergchebbi") ||
    id.includes("erg") ||
    id.includes("marrakech") ||
    id.includes("sidiali") ||
    id.includes("gransur") ||
    id.includes("ouarza") ||
    id.includes("atlas") ||
    id.includes("escapada")
  ) return "sahara";

  return null;
};

/* Page chrome strings — kept local to keep the component self-contained. */
const COPY = {
  fab: {
    es: "Mejor mes para mi viaje",
    en: "Best month for my trip",
    fr: "Meilleur mois pour mon voyage",
  },
  eyebrow: {
    es: "Tu mejor ventana",
    en: "Your sweet spot",
    fr: "Votre meilleure fenêtre",
  },
  intro: {
    es: "Según la región principal de este viaje, este es el momento ideal para visitarla — y los meses que conviene esquivar.",
    en: "Based on the main region of this journey, here is the ideal window to visit — and the months to avoid.",
    fr: "Selon la région principale de ce voyage, voici la fenêtre idéale — et les mois à éviter.",
  },
  best:       { es: "Mejor",          en: "Best",          fr: "Meilleur" },
  avoid:      { es: "Evita",          en: "Avoid",         fr: "À éviter" },
  highlights: { es: "Dos meses destacados", en: "Two months to remember", fr: "Deux mois à retenir" },
  ctaGuide:   { es: "Ver guía completa", en: "See full guide", fr: "Voir le guide complet" },
  ctaPlan:    { es: "Planificar mi viaje", en: "Plan my trip", fr: "Planifier mon voyage" },
  close:      { es: "Cerrar", en: "Close", fr: "Fermer" },
  noRegion:   { es: "Marruecos, todo el año", en: "Morocco, year-round", fr: "Maroc, toute l'année" },
};

/* Parse "Oct – Apr" English string into 1-12 month indexes (wrap-around aware). */
const parseBestMonthsEn = (bestEn) => {
  if (!bestEn) return [];
  const monthMap = {
    jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6,
    jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12,
  };
  const months = new Set();
  const norm = bestEn.toLowerCase().replace(/–|—/g, "-");
  norm.split(/·|,/).forEach((seg) => {
    const range = seg.match(/([a-z]{3})\s*-\s*([a-z]{3})/);
    if (range) {
      const a = monthMap[range[1]], b = monthMap[range[2]];
      if (a && b) {
        let i = a;
        for (let k = 0; k < 12; k++) {
          months.add(i);
          if (i === b) break;
          i = i === 12 ? 1 : i + 1;
        }
      }
    } else {
      const single = seg.match(/([a-z]{3})/);
      if (single && monthMap[single[1]]) months.add(monthMap[single[1]]);
    }
  });
  return Array.from(months).sort((a, b) => a - b);
};

/* Mini 12-month bar visualisation. */
const MonthBar = ({ activeMonths, accent }) => {
  const labels = ["E", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
  return (
    <div className="grid grid-cols-12 gap-1">
      {labels.map((l, i) => {
        const active = activeMonths.includes(i + 1);
        return (
          <div
            key={i}
            className={`text-center text-[10px] tracking-[0.15em] uppercase py-1.5 border transition-colors ${
              active
                ? "border-transparent text-[#FDFBF7]"
                : "border-[#2C2621]/15 text-[#2C2621]/30"
            }`}
            style={active ? { backgroundColor: accent } : {}}
          >
            {l}
          </div>
        );
      })}
    </div>
  );
};

/* ============================================================ */

export default function BestMonthFab() {
  const { lang } = useLanguage();
  const location = useLocation();
  const { routeId } = resolvePath(location.pathname);
  const [open, setOpen] = useState(false);

  /* Close on route change. */
  useEffect(() => { setOpen(false); }, [location.pathname]);

  /* Lock body scroll while modal is open. */
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = prev; };
    }
  }, [open]);

  const regionId = useMemo(() => routeToRegion(routeId), [routeId]);
  const region = useMemo(
    () => REGIONS.find((r) => r.id === regionId),
    [regionId]
  );

  const bestMonths = useMemo(
    () => (region ? parseBestMonthsEn(pick(region.best, "en")) : []),
    [region]
  );

  /* Pick 2 highlight months from MONTHS (first two of the best window). */
  const highlightMonths = useMemo(
    () => bestMonths.slice(0, 2).map((id) => MONTHS.find((m) => m.id === id)).filter(Boolean),
    [bestMonths]
  );

  /* Hide entirely on irrelevant routes or when no region inferred. */
  if (HIDDEN_ROUTES.has(routeId) || !region) return null;

  return (
    <>
      {/* Floating pill button */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        data-testid="best-month-fab"
        aria-expanded={open}
        aria-controls="best-month-panel"
        className="fixed bottom-24 right-6 z-30 inline-flex items-center gap-2.5 bg-[#1A1513]/92 backdrop-blur-md text-[#FDFBF7] pl-3 pr-4 py-2.5 border border-[#FDFBF7]/15 hover:bg-[#C16542] hover:border-[#C16542] transition-colors shadow-[0_10px_30px_-15px_rgba(26,21,19,0.6)] group"
      >
        <span
          className="w-7 h-7 -ml-1 flex items-center justify-center rounded-full"
          style={{ backgroundColor: region.accent }}
        >
          <Sunrise className="w-3.5 h-3.5" strokeWidth={1.7} />
        </span>
        <span className="text-[11px] tracking-[0.22em] uppercase font-medium">
          {pick(COPY.fab, lang)}
        </span>
      </button>

      {/* Overlay + side modal */}
      <div
        className={`fixed inset-0 z-[55] transition-opacity duration-400 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden={!open}
        data-testid="best-month-panel-root"
      >
        <div
          className="absolute inset-0 bg-[#1A1513]/55 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />

        <aside
          id="best-month-panel"
          role="dialog"
          aria-labelledby="best-month-title"
          data-testid="best-month-panel"
          className={`absolute right-0 top-0 h-full w-[92vw] sm:w-[460px] md:w-[520px] bg-[#FDFBF7] text-[#2C2621] shadow-[-16px_0_40px_-12px_rgba(26,21,19,0.25)] transition-transform duration-500 ease-out ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="h-full flex flex-col overflow-y-auto">
            {/* Header */}
            <div
              className="sticky top-0 z-10 flex items-center justify-between px-7 md:px-9 py-5 bg-[#FDFBF7]/95 backdrop-blur-md border-b border-[#2C2621]/10"
            >
              <span className="inline-flex items-center gap-2 text-[10px] tracking-[0.32em] uppercase" style={{ color: region.accent }}>
                <Sparkles className="w-3.5 h-3.5" strokeWidth={1.6} />
                {pick(COPY.eyebrow, lang)}
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                data-testid="best-month-close"
                aria-label={pick(COPY.close, lang)}
                className="text-[#5C5248] hover:text-[#C16542] transition-colors"
              >
                <X className="w-5 h-5" strokeWidth={1.5} />
              </button>
            </div>

            {/* Body */}
            <div className="px-7 md:px-9 py-8 space-y-8">
              {/* Region title block */}
              <div>
                <h2
                  id="best-month-title"
                  className="font-serif-x text-3xl md:text-4xl leading-[1.05] tracking-tight mb-3"
                  style={{ color: region.accent }}
                  data-testid="best-month-region-name"
                >
                  {pick(region.name, lang)}
                </h2>
                <p className="text-[14px] md:text-[15px] text-[#5C5248] leading-relaxed">
                  {pick(COPY.intro, lang)}
                </p>
              </div>

              {/* Month bar */}
              <div>
                <MonthBar activeMonths={bestMonths} accent={region.accent} />
                <div className="mt-4 grid grid-cols-2 gap-4 text-[12px]">
                  <div>
                    <span className="block text-[10px] tracking-[0.3em] uppercase text-[#5C5248] mb-1">
                      {pick(COPY.best, lang)}
                    </span>
                    <span className="font-medium" style={{ color: region.accent }}>
                      {pick(region.best, lang)}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[10px] tracking-[0.3em] uppercase text-[#5C5248] mb-1">
                      {pick(COPY.avoid, lang)}
                    </span>
                    <span className="text-[#2C2621]/70">{pick(region.avoid, lang)}</span>
                  </div>
                </div>
              </div>

              {/* Climate body */}
              <p className="text-[15px] text-[#2C2621] leading-relaxed italic border-l-2 pl-4" style={{ borderColor: region.accent }}>
                {pick(region.body, lang)}
              </p>

              {/* Highlight months */}
              {highlightMonths.length > 0 && (
                <div>
                  <span className="block text-[10px] tracking-[0.3em] uppercase text-[#5C5248] mb-3">
                    {pick(COPY.highlights, lang)}
                  </span>
                  <div className="grid grid-cols-1 gap-3">
                    {highlightMonths.map((m) => (
                      <div
                        key={m.id}
                        data-testid={`best-month-card-${m.id}`}
                        className="border border-[#2C2621]/10 p-4 bg-[#F2EBE1]/40"
                      >
                        <div className="flex items-baseline justify-between mb-1">
                          <span className="font-serif-x text-xl text-[#2C2621]">{pick(m.name, lang)}</span>
                          <span className="text-[10px] tracking-[0.2em] uppercase text-[#5C5248]">{m.temp}</span>
                        </div>
                        <p className="text-[13px] text-[#5C5248] italic leading-relaxed">
                          {pick(m.highlight, lang)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sticky CTAs */}
            <div className="mt-auto sticky bottom-0 bg-[#FDFBF7] border-t border-[#2C2621]/10 px-7 md:px-9 py-5 space-y-2.5">
              <Link
                to={pathFor(lang, "planTrip")}
                onClick={() => setOpen(false)}
                data-testid="best-month-cta-plan"
                className="w-full inline-flex items-center justify-between gap-3 bg-[#C16542] hover:bg-[#A35133] text-[#FDFBF7] px-5 py-3.5 text-[11px] tracking-[0.28em] uppercase transition-colors"
              >
                {pick(COPY.ctaPlan, lang)}
                <ArrowRight className="w-4 h-4" strokeWidth={1.6} />
              </Link>
              <Link
                to={pathFor(lang, "whenToTravel")}
                onClick={() => setOpen(false)}
                data-testid="best-month-cta-guide"
                className="w-full inline-flex items-center justify-between gap-3 border border-[#2C2621]/25 hover:border-[#2C2621] hover:bg-[#2C2621] hover:text-[#FDFBF7] text-[#2C2621] px-5 py-3.5 text-[11px] tracking-[0.28em] uppercase transition-colors"
              >
                {pick(COPY.ctaGuide, lang)}
                <ArrowRight className="w-4 h-4" strokeWidth={1.6} />
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
