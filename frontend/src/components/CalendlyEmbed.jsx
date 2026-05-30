/* ============================================================
   CalendlyEmbed — shared Calendly inline-widget helpers used by
   /contacto and /citaprevia. The widget bootstrap script is loaded
   once (idempotent); each embed explicitly re-inits so swapping
   tabs never leaves an empty iframe.
============================================================ */
import React, { useEffect } from "react";

export const CALENDLY_PHONE = "https://calendly.com/xalucatours/cita-previa-telefonica";
export const CALENDLY_OFFICE = "https://calendly.com/xalucatours/cita-previa-oficinas";

const CALENDLY_SRC = "https://assets.calendly.com/assets/external/widget.js";

/* Inject the Calendly bootstrap script a single time. */
export const useCalendlyScript = () => {
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (document.querySelector(`script[src="${CALENDLY_SRC}"]`)) return;
    const s = document.createElement("script");
    s.src = CALENDLY_SRC;
    s.async = true;
    document.body.appendChild(s);
  }, []);
};

/* A single inline Calendly widget. Polls briefly for window.Calendly
   while the script downloads, then fires initInlineWidget once. */
export const CalendlyEmbed = ({ url, testid, height = 720 }) => {
  const ref = React.useRef(null);
  useEffect(() => {
    let cancelled = false;
    let attempts = 0;
    const tryInit = () => {
      if (cancelled || !ref.current) return;
      const C = typeof window !== "undefined" ? window.Calendly : null;
      if (C && typeof C.initInlineWidget === "function") {
        ref.current.replaceChildren();
        C.initInlineWidget({ url, parentElement: ref.current });
        return;
      }
      if (attempts++ < 40) setTimeout(tryInit, 150);
    };
    tryInit();
    return () => { cancelled = true; };
  }, [url]);
  return <div ref={ref} data-testid={testid} style={{ minWidth: 320, height }} />;
};

export default CalendlyEmbed;
