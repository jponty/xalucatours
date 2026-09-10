import React, { createContext, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { pathFor } from "@/lib/routes";
import { setTripContext } from "@/lib/tripContext";
import { ChronologyButton } from "./JourneyChronology";
import "./TripFloatingActions.css";

const DockContext = createContext(null);

export function TripFloatingProvider({ children }) {
  const [hosts, setHosts] = useState(null);
  const value = useMemo(() => ({ hosts, setHosts }), [hosts]);
  return <DockContext.Provider value={value}>{children}</DockContext.Provider>;
}

// Existing audio / CMS controls join the same normal-flow stack on trip pages.
// They keep their current positioning on pages without a trip dock.
export function TripFloatingSlot({ name, children }) {
  const context = useContext(DockContext);
  const host = context?.hosts?.[name];
  return host ? createPortal(children, host) : children;
}

const COPY = {
  es: { title: "¿Te interesa este viaje?", cta: "Contacta con nosotros" },
  en: { title: "Interested in this trip?", cta: "Contact us" },
  fr: { title: "Ce voyage vous intéresse ?", cta: "Contactez-nous" },
};

export default function TripFloatingActions({ routeId, lang = "es", hasChronology, heroSelector = '[data-testid="program-hero"]' }) {
  const context = useContext(DockContext);
  const setHosts = context?.setHosts;
  const [pastHero, setPastHero] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const dockRef = useRef(null);
  const audioRef = useRef(null);
  const editorRef = useRef(null);
  const auxiliaryRef = useRef(null);
  const t = COPY[lang] || COPY.es;

  useEffect(() => {
    setPastHero(false);
    const hero = document.querySelector(heroSelector);
    let didScroll = false;
    let frame;
    const update = () => {
      // The end of the actual hero is the threshold; it is not a fixed pixel
      // offset and remains correct when content, orientation or fonts change.
      setPastHero(didScroll && !!hero && hero.getBoundingClientRect().bottom <= 0);
    };
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };
    const onScroll = () => { didScroll = true; schedule(); };
    const resize = new ResizeObserver(schedule);
    if (hero) resize.observe(hero);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      resize.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", schedule);
    };
  }, [routeId, heroSelector]);

  useEffect(() => {
    const update = () => {
      // Both the site's custom dialogs / menu and Radix lock body scrolling.
      // Yield the whole dock (including audio) to them and to form keyboards.
      const focusedField = document.activeElement?.matches("input, textarea, select, [contenteditable='true']");
      setBlocked(Boolean(focusedField || document.body.hasAttribute("data-scroll-locked")
        || [document.body, document.documentElement].some((el) => ["hidden", "clip"].includes(el.style.overflow))));
    };
    const observer = new MutationObserver(update);
    [document.body, document.documentElement].forEach((el) => observer.observe(el, { attributes: true, attributeFilter: ["style", "data-scroll-locked"] }));
    document.addEventListener("focusin", update);
    document.addEventListener("focusout", update);
    update();
    return () => {
      observer.disconnect();
      document.removeEventListener("focusin", update);
      document.removeEventListener("focusout", update);
    };
  }, []);

  useLayoutEffect(() => {
    setHosts?.({ audio: audioRef.current, editor: editorRef.current, auxiliary: auxiliaryRef.current });
    const root = document.documentElement;
    const header = document.querySelector('[data-testid="site-header"]');
    const measure = () => {
      const height = Math.ceil(dockRef.current?.getBoundingClientRect().height || 0);
      root.style.setProperty("--trip-floating-clearance", `${height}px`);
      root.style.setProperty("--trip-floating-header-height", `${header?.offsetHeight || 0}px`);
    };
    const observer = new ResizeObserver(measure);
    if (dockRef.current) observer.observe(dockRef.current);
    if (header) observer.observe(header);
    measure();
    return () => {
      observer.disconnect();
      setHosts?.(null);
      root.style.removeProperty("--trip-floating-clearance");
      root.style.removeProperty("--trip-floating-header-height");
    };
  }, [setHosts]);

  return createPortal(
    <div ref={dockRef} className="trip-floating-dock" data-testid="trip-floating-dock"
      data-blocked={blocked} aria-hidden={blocked || undefined} inert={blocked ? true : undefined}>
      <div className="trip-floating-stack">
        <div className="trip-floating-extras">
          <div ref={editorRef} className="trip-floating-slot" />
          <div ref={audioRef} className="trip-floating-slot" />
          <div ref={auxiliaryRef} className="trip-floating-slot" />
        </div>
        {hasChronology && <ChronologyButton lang={lang} compact />}
        <div className="trip-contact-reveal" data-visible={pastHero} aria-hidden={!pastHero}
          inert={!pastHero ? true : undefined} data-testid="trip-contact-reveal">
          <div className="trip-contact-clip">
            <aside className="trip-contact-card" aria-label={t.title} data-testid="trip-contact-card">
              <p>{t.title}</p>
              <Link to={`${pathFor(lang, "contact")}${routeId ? `?trip=${encodeURIComponent(routeId)}` : ""}`}
                onClick={() => routeId && setTripContext([routeId])}
                tabIndex={pastHero ? 0 : -1} data-testid="trip-contact-cta">
                {t.cta}<ArrowRight size={16} aria-hidden="true" />
              </Link>
            </aside>
          </div>
        </div>
      </div>
    </div>, document.body
  );
}
