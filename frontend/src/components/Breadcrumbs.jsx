import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { pathFor, resolvePath } from "@/lib/routes";
import {
  HOME_LABEL,
  SECTIONS,
  lookupProgram,
  lookupHub,
  hubLabel,
  programLabel,
  sectionLabel,
  pickT,
} from "@/lib/programNav";

/* ----------------------------------------------------------------
   <Breadcrumbs />
   Self-aware: reads current URL → builds trail
     · Programa  →  Inicio › Viajes › Sur de Marruecos › <Hub> › <Programa>
     · Hub       →  Inicio › Viajes › Sur de Marruecos › <Hub>
     · Sección   →  Inicio › Viajes › Sur de Marruecos
   Renders nothing for unknown routes (no clutter on home, etc).

   Mounted globally inside <Layout/>. Keep it in document flow so a
   multi-line trail never covers a hero title on narrow screens.
---------------------------------------------------------------- */
export default function Breadcrumbs() {
  const { lang } = useLanguage();
  const location = useLocation();
  const { routeId } = resolvePath(location.pathname);

  if (!routeId || routeId === "home") return null;

  const trail = buildTrail(routeId, lang);
  if (!trail || trail.length < 2) return null;

  return (
    <nav
      aria-label="Breadcrumb"
      data-testid="breadcrumbs"
      className="relative z-30 bg-[#1A1513] pt-24 md:pt-[116px]"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-3">
        <div className="inline-flex max-w-full flex-wrap items-center gap-1.5 md:gap-2 bg-[#1A1513]/55 border border-white/10 px-3.5 md:px-4 py-1.5 md:py-2 text-[10px] md:text-[11px] tracking-[0.18em] uppercase text-[#FDFBF7]/90">
          {trail.map((node, i) => {
            const isLast = i === trail.length - 1;
            return (
              <React.Fragment key={`${node.label}-${i}`}>
                {i > 0 && (
                  <ChevronRight className="w-3 h-3 md:w-3.5 md:h-3.5 text-[#FDFBF7]/40 flex-shrink-0" strokeWidth={1.6} aria-hidden="true" />
                )}
                {node.href && !isLast ? (
                  <Link
                    to={node.href}
                    data-testid={`bc-${node.testid || i}`}
                    className="hover:text-[#D4A373] transition-colors duration-200 flex items-center gap-1.5"
                  >
                    {node.icon && <node.icon className="w-3 h-3 md:w-3.5 md:h-3.5" strokeWidth={1.6} aria-hidden="true" />}
                    <span className="truncate max-w-[28ch]">{node.label}</span>
                  </Link>
                ) : (
                  <span
                    data-testid={`bc-${node.testid || i}-current`}
                    aria-current={isLast ? "page" : undefined}
                    className="text-[#D4A373] flex items-center gap-1.5"
                  >
                    {node.icon && <node.icon className="w-3 h-3 md:w-3.5 md:h-3.5" strokeWidth={1.6} aria-hidden="true" />}
                    <span className="truncate max-w-[28ch]">{node.label}</span>
                  </span>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

/* ----------------------------------------------------------------
   buildTrail
   Returns an array of { label, href?, icon?, testid }
---------------------------------------------------------------- */
function buildTrail(routeId, lang) {
  const trail = [
    { label: pickT(HOME_LABEL, lang), href: pathFor(lang, "home"), icon: Home, testid: "home" },
  ];

  // 1) Program detail page
  const progNav = lookupProgram(routeId);
  if (progNav) {
    trail.push({ label: sectionLabel("toursLanding", lang), href: pathFor(lang, "toursLanding"), testid: "tours" });
    trail.push({ label: sectionLabel(progNav.section, lang), href: pathFor(lang, progNav.section), testid: "section" });
    if (progNav.direct) {
      // Hub-less program: section → program directly
      trail.push({ label: pickT(progNav.label, lang) || programLabel(progNav.program, lang) || routeId, testid: "program" });
      return trail;
    }
    trail.push({ label: hubLabel(progNav.hub, lang), href: pathFor(lang, progNav.hubRouteId), testid: "hub" });
    trail.push({ label: programLabel(progNav.program, lang) || routeId, testid: "program" });
    return trail;
  }

  // 2) Hub page
  const hubNav = lookupHub(routeId);
  if (hubNav) {
    trail.push({ label: sectionLabel("toursLanding", lang), href: pathFor(lang, "toursLanding"), testid: "tours" });
    trail.push({ label: sectionLabel(hubNav.section, lang), href: pathFor(lang, hubNav.section), testid: "section" });
    trail.push({ label: hubLabel(hubNav.hub, lang), testid: "hub" });
    return trail;
  }

  // 3) Section page (Sur / Norte / Escapadas / Marruecos)
  if (SECTIONS[routeId] && routeId !== "toursLanding") {
    trail.push({ label: sectionLabel("toursLanding", lang), href: pathFor(lang, "toursLanding"), testid: "tours" });
    trail.push({ label: sectionLabel(routeId, lang), testid: "section" });
    return trail;
  }

  // 4) /viajes landing
  if (routeId === "toursLanding") {
    trail.push({ label: sectionLabel("toursLanding", lang), testid: "tours" });
    return trail;
  }

  // Unknown — hide the breadcrumb (return only home → suppressed by min-2 check)
  return trail;
}
