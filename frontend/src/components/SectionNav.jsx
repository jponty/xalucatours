import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLanguage, pick } from "@/contexts/LanguageContext";

/* ============================================================
   SectionNav — reusable sticky in-page navigation.
   ------------------------------------------------------------
   • Sits flush below the main (auto-hiding) header, never
     overlapping it (follows the header's show/hide).
   • Smooth "homing" scroll that recomputes the LIVE target each
     frame → reliable even on image-heavy pages where lazy media
     shifts the layout mid-scroll.
   • Active section highlighted via a fixed scan-line
     IntersectionObserver (drift-proof).
   • Horizontal scroll on mobile; the active tab auto-centres.
   Props:
     items  : [{ id, label }]  (label = string or {es,en,fr})
     testid : base test id (item = `${testid}-${id}`)
============================================================ */

const HEADER_SELECTOR = '[data-testid="site-header"]';

export default function SectionNav({ items = [], testid = "section-nav" }) {
  const { lang } = useLanguage();
  const navRef = useRef(null);
  const btnRefs = useRef({});
  const clickLockRef = useRef(0);
  const rafRef = useRef(null);
  const correctTimersRef = useRef([]);

  const [headerH, setHeaderH] = useState(116);
  const [stickyTop, setStickyTop] = useState(116);
  const [vh, setVh] = useState(typeof window !== "undefined" ? window.innerHeight : 800);
  const [active, setActive] = useState(items[0]?.id);
  const [progress, setProgress] = useState(0);

  const idsKey = useMemo(() => items.map((i) => i.id).join("|"), [items]);
  const resolveLabel = (l) => (typeof l === "string" ? l : pick(l, lang));

  // Reset active if the item set changes and current one is gone.
  useEffect(() => {
    if (!items.some((i) => i.id === active)) setActive(items[0]?.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idsKey]);

  // Measure header height + viewport (constant regardless of header transform).
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

  // Follow the header's show/hide so the nav stays flush beneath it.
  useEffect(() => {
    const TOP_OFFSET = 24;
    const THRESHOLD = 12;
    let lastY = window.scrollY;
    let ticking = false;
    const update = () => {
      const y = window.scrollY;
      const delta = y - lastY;
      if (y <= TOP_OFFSET) {
        setStickyTop(headerH);
      } else if (Math.abs(delta) > THRESHOLD) {
        setStickyTop(delta > 0 ? 0 : headerH);
        lastY = y;
      }
      // Reading progress (0–1) of the whole page.
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docH > 0 ? Math.min(1, Math.max(0, y / docH)) : 0);
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) { window.requestAnimationFrame(update); ticking = true; }
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [headerH]);

  // Active-section highlight via a fixed scan-line IntersectionObserver.
  useEffect(() => {
    const ids = idsKey ? idsKey.split("|") : [];
    const navH = navRef.current ? navRef.current.offsetHeight : 48;
    const lineY = headerH + navH + 40;
    const bottom = Math.max(0, vh - lineY - 1);
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean);
    if (!els.length) return;
    const lastId = ids[ids.length - 1];
    const io = new IntersectionObserver(
      (entries) => {
        if (Date.now() < clickLockRef.current) return;
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
        if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
          setActive(lastId);
        }
      },
      { rootMargin: `-${lineY}px 0px -${bottom}px 0px`, threshold: 0 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [headerH, vh, idsKey]);

  // Keep the active tab visible on mobile (horizontal scroll).
  useEffect(() => {
    const btn = btnRefs.current[active];
    if (btn) btn.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [active]);

  const go = useCallback((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const navH = navRef.current ? navRef.current.offsetHeight : 48;
    const goingDown = el.getBoundingClientRect().top > 0;
    const offset = (goingDown ? 0 : headerH) + navH + 16;
    const desired = () => {
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      return Math.max(0, Math.min(top, max));
    };

    setActive(id);
    clickLockRef.current = Date.now() + 1400;

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    correctTimersRef.current.forEach((t) => clearTimeout(t));
    correctTimersRef.current = [];

    const startY = window.scrollY;
    const startT = performance.now();
    const DURATION = 700;
    const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

    const step = (now) => {
      const p = Math.min(1, (now - startT) / DURATION);
      window.scrollTo(0, startY + (desired() - startY) * ease(p));
      if (p < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        rafRef.current = null;
        window.scrollTo(0, desired());
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
        correctTimersRef.current.push(setTimeout(() => {
          window.removeEventListener("wheel", onUser);
          window.removeEventListener("touchmove", onUser);
        }, 700));
      }
    };
    rafRef.current = requestAnimationFrame(step);
  }, [headerH]);

  useEffect(() => () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    correctTimersRef.current.forEach((t) => clearTimeout(t));
  }, []);

  if (!items.length) return null;

  return (
    <nav
      ref={navRef}
      data-testid={testid}
      aria-label="Secciones de la página"
      style={{ top: stickyTop }}
      className="sticky z-30 bg-[#FDFBF7]/95 backdrop-blur-md border-y border-[#2C2621]/10 shadow-[0_6px_20px_-18px_rgba(26,21,19,0.5)] transition-[top] duration-500 ease-out"
    >
      {/* Reading-progress line along the top edge of the nav */}
      <span
        data-testid={`${testid}-progress`}
        aria-hidden="true"
        className="absolute top-0 left-0 h-[2px] bg-gradient-to-r from-[#C16542] to-[#D4A373] z-40"
        style={{ width: `${progress * 100}%` }}
      />
      <div className="max-w-7xl mx-auto px-4 md:px-12">
        <ul className="flex items-center gap-1 md:gap-1.5 overflow-x-auto no-scrollbar py-2.5">
          {items.map((s) => {
            const isActive = active === s.id;
            return (
              <li key={s.id} className="shrink-0">
                <button
                  ref={(n) => { btnRefs.current[s.id] = n; }}
                  type="button"
                  data-testid={`${testid}-${s.id}`}
                  data-active={isActive}
                  onClick={() => go(s.id)}
                  aria-current={isActive ? "true" : undefined}
                  className={`relative whitespace-nowrap px-3.5 md:px-4 py-2 text-[11px] md:text-[12px] tracking-[0.18em] uppercase transition-colors duration-300 ${
                    isActive ? "text-[#C16542]" : "text-[#5C5248] hover:text-[#2C2621]"
                  }`}
                >
                  {resolveLabel(s.label)}
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
