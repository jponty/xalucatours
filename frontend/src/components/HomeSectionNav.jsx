import React, { useCallback, useEffect, useRef, useState } from "react";
import { useLanguage, pick } from "@/contexts/LanguageContext";

/* ============================================================
   HomeSectionNav — sticky in-page navigation for the Home.
   Sits flush below the main (auto-hiding) header, provides
   smooth-scroll anchor links to the main sections, highlights
   the active section on scroll, and scrolls horizontally on
   mobile when links overflow.
============================================================ */

const SECTIONS = [
  { id: "buscador",  label: { es: "Buscador",        en: "Search",          fr: "Recherche" } },
  { id: "destinos",  label: { es: "Dónde viajamos",  en: "Where we travel", fr: "Où voyager" } },
  { id: "ruleta",    label: { es: "Ruleta Xaluca",   en: "Xaluca Wheel",    fr: "Roue Xaluca" } },
  { id: "por-que",   label: { es: "Por qué Xaluca",  en: "Why Xaluca",      fr: "Pourquoi Xaluca" } },
  { id: "viajes",    label: { es: "Nuestros viajes", en: "Our trips",       fr: "Nos voyages" } },
  { id: "opiniones", label: { es: "Opiniones",       en: "Reviews",         fr: "Avis" } },
  { id: "contacto",  label: { es: "Contacto",        en: "Contact",         fr: "Contact" } },
];

const HEADER_SELECTOR = '[data-testid="site-header"]';

export default function HomeSectionNav() {
  const { lang } = useLanguage();
  const navRef = useRef(null);
  const listRef = useRef(null);
  const btnRefs = useRef({});
  const [headerH, setHeaderH] = useState(116);
  const [stickyTop, setStickyTop] = useState(116);
  const [active, setActive] = useState(SECTIONS[0].id);
  const [vh, setVh] = useState(typeof window !== "undefined" ? window.innerHeight : 800);
  const clickLockRef = useRef(0);
  const rafRef = useRef(null);
  const correctTimersRef = useRef([]);

  // Measure the header height (constant regardless of its show/hide transform).
  useEffect(() => {
    const measure = () => {
      const el = document.querySelector(HEADER_SELECTOR);
      if (el) setHeaderH(el.offsetHeight);
      setVh(window.innerHeight);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // Follow the header's show/hide so the sub-nav stays flush beneath it.
  useEffect(() => {
    const TOP_OFFSET = 24;
    const THRESHOLD = 12;
    let lastY = window.scrollY;
    let ticking = false;

    const update = () => {
      const y = window.scrollY;
      const delta = y - lastY;
      // Same rule as the header: hidden when scrolling down past the top area.
      if (y <= TOP_OFFSET) {
        setStickyTop(headerH);
      } else if (Math.abs(delta) > THRESHOLD) {
        setStickyTop(delta > 0 ? 0 : headerH);
        lastY = y;
      }
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [headerH]);

  // Active-section highlight via a fixed "scan line" IntersectionObserver.
  // The line sits a little below the sticky nav; whichever section crosses it
  // becomes active. This is drift-proof on an image-heavy page (layout shifts
  // just move sections across a viewport-fixed line, firing the right events).
  useEffect(() => {
    const navH = navRef.current ? navRef.current.offsetHeight : 48;
    const lineY = headerH + navH + 40;
    const bottom = Math.max(0, vh - lineY - 1);
    const els = SECTIONS.map((s) => document.getElementById(s.id)).filter(Boolean);
    if (!els.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        if (Date.now() < clickLockRef.current) return;
        for (const e of entries) {
          if (e.isIntersecting) setActive(e.target.id);
        }
        // Bottom-of-page safety: pin the last section.
        if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
          setActive(SECTIONS[SECTIONS.length - 1].id);
        }
      },
      { rootMargin: `-${lineY}px 0px -${bottom}px 0px`, threshold: 0 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [headerH, vh]);

  // Keep the active tab visible on mobile (horizontal scroll).
  useEffect(() => {
    const btn = btnRefs.current[active];
    if (btn) btn.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [active]);

  const go = useCallback((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const navH = navRef.current ? navRef.current.offsetHeight : 48;
    // Direction decides the resting offset: scrolling DOWN the header hides
    // (offset = sub-nav only); scrolling UP it reappears (header + sub-nav).
    const goingDown = el.getBoundingClientRect().top > 0;
    const offset = (goingDown ? 0 : headerH) + navH + 16;
    const desired = () => {
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      return Math.max(0, Math.min(top, max));
    };

    setActive(id);
    clickLockRef.current = Date.now() + 1400;

    // Cancel any in-flight animation / pending corrections.
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    correctTimersRef.current.forEach((t) => clearTimeout(t));
    correctTimersRef.current = [];

    // Homing smooth scroll: recompute the LIVE target every frame so that
    // lazy-loading images shifting the layout never leave us short of the
    // real section position (the previous one-shot scrollTo bug).
    const startY = window.scrollY;
    const startT = performance.now();
    const DURATION = 700;
    const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

    const step = (now) => {
      const p = Math.min(1, (now - startT) / DURATION);
      const y = startY + (desired() - startY) * ease(p);
      window.scrollTo(0, y);
      if (p < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        rafRef.current = null;
        window.scrollTo(0, desired());
        // Correction snaps: images decoding after the animation can still
        // shift the target; re-align a couple of times (skipped if the user
        // takes over the scroll).
        let userTookOver = false;
        const onUser = () => { userTookOver = true; };
        window.addEventListener("wheel", onUser, { passive: true, once: true });
        window.addEventListener("touchmove", onUser, { passive: true, once: true });
        [180, 480].forEach((d) => {
          const t = setTimeout(() => {
            if (!userTookOver && Math.abs(window.scrollY - desired()) > 2) {
              window.scrollTo({ top: desired(), behavior: "smooth" });
            }
          }, d);
          correctTimersRef.current.push(t);
        });
        const cleanup = setTimeout(() => {
          window.removeEventListener("wheel", onUser);
          window.removeEventListener("touchmove", onUser);
        }, 700);
        correctTimersRef.current.push(cleanup);
      }
    };
    rafRef.current = requestAnimationFrame(step);
  }, [headerH]);

  useEffect(() => () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    correctTimersRef.current.forEach((t) => clearTimeout(t));
  }, []);

  return (
    <nav
      ref={navRef}
      data-testid="home-section-nav"
      aria-label="Secciones de la página"
      style={{ top: stickyTop }}
      className="sticky z-30 bg-[#FDFBF7]/95 backdrop-blur-md border-y border-[#2C2621]/10 shadow-[0_6px_20px_-18px_rgba(26,21,19,0.5)] transition-[top] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-12">
        <ul
          ref={listRef}
          className="flex items-center gap-1 md:gap-1.5 overflow-x-auto no-scrollbar py-2.5"
        >
          {SECTIONS.map((s) => {
            const isActive = active === s.id;
            return (
              <li key={s.id} className="shrink-0">
                <button
                  ref={(n) => { btnRefs.current[s.id] = n; }}
                  type="button"
                  data-testid={`home-nav-${s.id}`}
                  data-active={isActive}
                  onClick={() => go(s.id)}
                  aria-current={isActive ? "true" : undefined}
                  className={`relative whitespace-nowrap px-3.5 md:px-4 py-2 text-[11px] md:text-[12px] tracking-[0.18em] uppercase transition-colors duration-300 ${
                    isActive
                      ? "text-[#C16542]"
                      : "text-[#5C5248] hover:text-[#2C2621]"
                  }`}
                >
                  {pick(s.label, lang)}
                  <span
                    className={`pointer-events-none absolute left-3.5 right-3.5 md:left-4 md:right-4 -bottom-[1px] h-[2px] bg-[#C16542] origin-left transition-transform duration-300 ${
                      isActive ? "scale-x-100" : "scale-x-0"
                    }`}
                    aria-hidden="true"
                  />
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
