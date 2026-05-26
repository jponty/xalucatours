import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { X, ChevronDown, ArrowRight, Phone, Mail } from "lucide-react";
import { useLanguage, pick } from "@/contexts/LanguageContext";
import { MENU_TREE } from "@/lib/menu";
import { pathFor } from "@/lib/routes";
import { CONTACT } from "@/lib/data";

/**
 * Lateral slide menu.
 * Three explicit depths: L0 (root), L1 (group), L2 (leaf inside catalog).
 * Each item is either a leaf with `routeId` or a group with `children`.
 */
export const SideMenu = ({ open, onClose }) => {
  const { lang, t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => { onClose?.(); /* eslint-disable-next-line */ }, [location.pathname]);

  const toggle = (id) => setExpanded((p) => ({ ...p, [id]: !p[id] }));

  const goto = (routeId) => {
    if (!routeId) return;
    navigate(pathFor(lang, routeId));
    onClose?.();
  };

  return (
    <div
      className={`fixed inset-0 z-[60] transition-opacity duration-500 ${
        open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
      aria-hidden={!open}
    >
      <div className="absolute inset-0 bg-black/55 backdrop-blur-sm" onClick={onClose} />

      <aside
        data-testid="side-menu"
        className={`absolute left-0 top-0 h-full w-[88vw] sm:w-[420px] md:w-[480px] bg-[#1A1513] text-[#FDFBF7] berber-bg-cross transition-transform duration-500 ease-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="relative h-full flex flex-col overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 z-10 flex items-center justify-between px-7 md:px-10 py-6 bg-[#1A1513]/95 backdrop-blur-md border-b border-[#FDFBF7]/10">
            <span className="overline text-[#D4A373]">Xaluca · Tours</span>
            <button
              data-testid="side-menu-close"
              onClick={onClose}
              aria-label={t("nav_close")}
              className="text-[#FDFBF7]/70 hover:text-[#C16542] transition-colors"
            >
              <X className="w-5 h-5" strokeWidth={1.5} />
            </button>
          </div>

          {/* Nav — explicit 3-level rendering, no recursion */}
          <nav className="px-7 md:px-10 py-8 flex-1">
            <ul className="space-y-1">
              {MENU_TREE.map((l0, i) => {
                const l0Label = pick(l0.label, lang);
                const l0HasChildren = Array.isArray(l0.children) && l0.children.length > 0;
                const l0Open = !!expanded[l0.id];

                if (!l0HasChildren) {
                  return (
                    <li key={l0.id}>
                      <Link
                        to={l0.routeId ? pathFor(lang, l0.routeId) : "#"}
                        data-testid={`menu-link-${l0.id}`}
                        onClick={(e) => { e.preventDefault(); goto(l0.routeId); }}
                        className="group flex items-baseline gap-4 py-2.5 font-serif-x text-3xl md:text-4xl leading-[1.05] hover:text-[#D4A373] transition-colors"
                      >
                        <span className="text-[10px] tracking-[0.3em] opacity-50 w-6 font-sans">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="flex-1">{l0Label}</span>
                        <ArrowRight
                          className="w-3.5 h-3.5 -translate-x-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-[#D4A373]"
                          strokeWidth={1.5}
                        />
                      </Link>
                    </li>
                  );
                }

                return (
                  <li key={l0.id}>
                    <button
                      type="button"
                      data-testid={`menu-toggle-${l0.id}`}
                      onClick={() => toggle(l0.id)}
                      aria-expanded={l0Open}
                      className="w-full group flex items-baseline gap-4 py-2.5 text-left font-serif-x text-3xl md:text-4xl leading-[1.05] hover:text-[#D4A373] transition-colors"
                    >
                      <span className="text-[10px] tracking-[0.3em] opacity-50 w-6 font-sans">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="flex-1">{l0Label}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-[#D4A373] transition-transform duration-300 ${
                          l0Open ? "rotate-180" : "rotate-0"
                        }`}
                        strokeWidth={1.5}
                      />
                    </button>

                    <div
                      className={`grid transition-[grid-template-rows] duration-500 ease-out ${
                        l0Open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                      }`}
                    >
                      <div className="overflow-hidden">
                        <ul className="mt-2 mb-3 space-y-0.5 pl-5 ml-1 border-l border-[#FDFBF7]/15">
                          {l0.children.map((l1) => {
                            const l1Label = pick(l1.label, lang);
                            const l1HasChildren = Array.isArray(l1.children) && l1.children.length > 0;
                            const l1Open = !!expanded[l1.id];

                            if (!l1HasChildren) {
                              return (
                                <li key={l1.id}>
                                  <Link
                                    to={l1.routeId ? pathFor(lang, l1.routeId) : "#"}
                                    data-testid={`menu-link-${l1.id}`}
                                    onClick={(e) => { e.preventDefault(); goto(l1.routeId); }}
                                    className="group flex items-baseline gap-4 py-2 font-serif-x text-xl md:text-[22px] leading-[1.15] text-[#FDFBF7]/90 hover:text-[#D4A373] transition-colors"
                                  >
                                    <span className="flex-1">{l1Label}</span>
                                    <ArrowRight
                                      className="w-3 h-3 -translate-x-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-[#D4A373]"
                                      strokeWidth={1.5}
                                    />
                                  </Link>
                                </li>
                              );
                            }

                            return (
                              <li key={l1.id}>
                                <button
                                  type="button"
                                  data-testid={`menu-toggle-${l1.id}`}
                                  onClick={() => toggle(l1.id)}
                                  aria-expanded={l1Open}
                                  className="w-full group flex items-baseline gap-4 py-2 text-left font-serif-x text-xl md:text-[22px] leading-[1.15] text-[#FDFBF7]/90 hover:text-[#D4A373] transition-colors"
                                >
                                  <span className="flex-1">{l1Label}</span>
                                  <ChevronDown
                                    className={`w-3.5 h-3.5 text-[#D4A373] transition-transform duration-300 ${
                                      l1Open ? "rotate-180" : "rotate-0"
                                    }`}
                                    strokeWidth={1.5}
                                  />
                                </button>

                                <div
                                  className={`grid transition-[grid-template-rows] duration-500 ease-out ${
                                    l1Open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                                  }`}
                                >
                                  <div className="overflow-hidden">
                                    <ul className="mt-1 mb-2 space-y-0 pl-5 ml-1 border-l border-[#D4A373]/25">
                                      {l1.children.map((l2) => (
                                        <li key={l2.id}>
                                          <Link
                                            to={l2.routeId ? pathFor(lang, l2.routeId) : "#"}
                                            data-testid={`menu-link-${l2.id}`}
                                            onClick={(e) => { e.preventDefault(); goto(l2.routeId); }}
                                            className="group flex items-center gap-3 py-1.5 text-sm text-[#FDFBF7]/80 hover:text-[#D4A373] transition-colors"
                                          >
                                            <span className="w-1.5 h-px bg-[#D4A373]/50 group-hover:bg-[#D4A373] group-hover:w-3 transition-all duration-300" />
                                            <span className="flex-1">{pick(l2.label, lang)}</span>
                                          </Link>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Footer block */}
          <div className="px-7 md:px-10 py-8 border-t border-[#FDFBF7]/15">
            <p className="text-[10px] tracking-[0.3em] uppercase text-[#D4A373] mb-4">
              {t("footer_contact")}
            </p>
            <div className="space-y-3 text-sm text-[#FDFBF7]/85">
              <a
                href={`tel:${CONTACT.phoneRaw}`}
                data-testid="side-menu-phone"
                className="flex items-center gap-3 hover:text-[#D4A373] transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-[#D4A373]" strokeWidth={1.5} />
                {CONTACT.phone}
              </a>
              <a
                href={`mailto:${CONTACT.email}`}
                data-testid="side-menu-email"
                className="flex items-center gap-3 hover:text-[#D4A373] transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-[#D4A373]" strokeWidth={1.5} />
                {CONTACT.email}
              </a>
            </div>
            <p className="mt-6 text-xs text-[#FDFBF7]/55">{t("office_hours_value")}</p>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default SideMenu;
