import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  X, ChevronDown, ArrowRight, Phone, Mail,
  Home, CalendarClock, Compass, MapPin, Sparkles,
  Sun, Globe2, Mountain, Wind, MountainSnow, Scissors,
  CalendarDays, Users, Landmark, Wand2,
} from "lucide-react";
import { useLanguage, pick } from "@/contexts/LanguageContext";
import { MENU_TREE } from "@/lib/menu";
import { pathFor } from "@/lib/routes";
import { CONTACT } from "@/lib/data";

const ICONS = {
  "home": Home, "calendar-clock": CalendarClock, "compass": Compass,
  "map-pin": MapPin, "sparkles": Sparkles, "sun": Sun, "globe-2": Globe2,
  "mountain": Mountain, "wind": Wind, "mountain-snow": MountainSnow,
  "scissors": Scissors, "calendar-days": CalendarDays, "users": Users,
  "landmark": Landmark, "mail": Mail, "wand-2": Wand2,
};
const Icon = ({ name, className = "w-4 h-4", strokeWidth = 1.5 }) => {
  const C = ICONS[name];
  return C ? <C className={className} strokeWidth={strokeWidth} /> : null;
};

/**
 * Lateral slide menu — sectioned navigation with active-page indicator.
 * Nodes can be: leaf (routeId), classic group (children), or sectioned group (groups).
 */
export const SideMenu = ({ open, onClose }) => {
  const { lang, t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState({ tours: true });

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

  const isActive = (routeId) => {
    if (!routeId) return false;
    try { return location.pathname === pathFor(lang, routeId); }
    catch { return false; }
  };

  // ---------- renderers ----------
  const renderLeaf = (item, depth = 1) => {
    const active = isActive(item.routeId);
    const sizeCls = depth === 1
      ? "py-2 text-[15px]"
      : "py-2 text-[15px]";
    return (
      <Link
        to={item.routeId ? pathFor(lang, item.routeId) : "#"}
        data-testid={`menu-link-${item.id}`}
        onClick={(e) => { e.preventDefault(); goto(item.routeId); }}
        className={`group relative flex items-center gap-3.5 ${sizeCls} transition-colors ${
          active ? "text-[#D4A373]" : "text-[#FDFBF7]/85 hover:text-[#D4A373]"
        }`}
        aria-current={active ? "page" : undefined}
      >
        {/* Active bar */}
        <span
          className={`absolute -left-4 top-1/2 -translate-y-1/2 w-2 h-px bg-[#D4A373] transition-all duration-300 ${
            active ? "opacity-100 w-3" : "opacity-0"
          }`}
          aria-hidden="true"
        />
        {item.icon && (
          <Icon
            name={item.icon}
            className={`w-3.5 h-3.5 shrink-0 transition-colors ${
              active ? "text-[#D4A373]" : "text-[#FDFBF7]/45 group-hover:text-[#D4A373]"
            }`}
            strokeWidth={1.6}
          />
        )}
        <span className="flex-1">{pick(item.label, lang)}</span>
        <ArrowRight
          className={`w-3 h-3 transition-all duration-300 text-[#D4A373] ${
            active ? "opacity-100 translate-x-0" : "-translate-x-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-0"
          }`}
          strokeWidth={1.6}
        />
      </Link>
    );
  };

  const renderClassicChildren = (l0) => (
    <ul className="mt-2 mb-3 space-y-0.5 pl-5 ml-1 border-l border-[#FDFBF7]/15">
      {l0.children.map((l1) => (
        <li key={l1.id}>{renderLeaf(l1)}</li>
      ))}
    </ul>
  );

  const renderToursGroups = (l0) => (
    <div className="mt-3 mb-2 relative">
      {/* Decorative Morocco mini-bg */}
      <div
        className="absolute inset-0 -mx-3 rounded-sm overflow-hidden pointer-events-none"
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-[#241B17]" />
        <div className="absolute inset-0 berber-bg-diamond opacity-30" />
        <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-[#C16542]/20 blur-3xl" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-[#D4A373]/12 blur-3xl" />
      </div>

      <div className="relative px-3 py-3">
        {/* Header CTA — "Ver todos los viajes" */}
        {l0.routeIdHeader && (
          <Link
            to={pathFor(lang, l0.routeIdHeader)}
            data-testid="menu-tours-all"
            onClick={(e) => { e.preventDefault(); goto(l0.routeIdHeader); }}
            className="group flex items-center justify-between gap-3 mb-5 px-3 py-2.5 bg-[#FDFBF7]/[0.04] border border-[#D4A373]/25 hover:border-[#D4A373] hover:bg-[#FDFBF7]/[0.07] transition-all"
          >
            <span className="text-[11px] tracking-[0.28em] uppercase text-[#D4A373]">
              {pick(l0.headerLabel, lang)}
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-[#D4A373] group-hover:translate-x-1 transition-transform" strokeWidth={1.6} />
          </Link>
        )}

        {l0.groups.map((g, gi) => (
          <div key={g.id} className={gi > 0 ? "mt-6" : ""}>
            {/* Section header */}
            <div className="flex items-center gap-3 mb-3">
              <Icon name={g.icon} className="w-3.5 h-3.5 text-[#D4A373]" strokeWidth={1.6} />
              <span className="text-[10px] tracking-[0.32em] uppercase text-[#D4A373]">
                {pick(g.label, lang)}
              </span>
              <span className="flex-1 h-px bg-[#D4A373]/25" />
            </div>

            {/* Items */}
            <ul className="space-y-0.5 pl-1">
              {g.items.map((item) => (
                <li key={item.id} className="relative pl-3">
                  {renderLeaf(item)}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );

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

          {/* Nav */}
          <nav className="px-7 md:px-10 py-8 flex-1">
            <ul className="space-y-1">
              {MENU_TREE.map((l0, i) => {
                const l0Label = pick(l0.label, lang);
                const hasClassic = Array.isArray(l0.children) && l0.children.length > 0;
                const hasGroups  = Array.isArray(l0.groups)   && l0.groups.length   > 0;
                const expandable = hasClassic || hasGroups;
                const l0Open = !!expanded[l0.id];
                const l0Active = isActive(l0.routeId);

                if (!expandable) {
                  return (
                    <li key={l0.id}>
                      <Link
                        to={l0.routeId ? pathFor(lang, l0.routeId) : "#"}
                        data-testid={`menu-link-${l0.id}`}
                        onClick={(e) => { e.preventDefault(); goto(l0.routeId); }}
                        aria-current={l0Active ? "page" : undefined}
                        className={`group relative flex items-baseline gap-4 py-2.5 font-serif-x text-3xl md:text-4xl leading-[1.05] transition-colors ${
                          l0Active ? "text-[#D4A373]" : "hover:text-[#D4A373]"
                        }`}
                      >
                        <span className="text-[10px] tracking-[0.3em] opacity-50 w-6 font-sans">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="flex-1">{l0Label}</span>
                        {l0Active && (
                          <span className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-px bg-[#D4A373]" aria-hidden="true" />
                        )}
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
                        {hasGroups ? renderToursGroups(l0) : renderClassicChildren(l0)}
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
