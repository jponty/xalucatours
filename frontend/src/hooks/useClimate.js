import { useCallback, useEffect, useRef, useState } from "react";

// Only our backend contacts the weather providers; no visitor IP or location is shared.
export default function useClimate(kind, refreshMs = 0) {
  const [state, setState] = useState({ data: null, loading: true, error: false });
  const [revision, setRevision] = useState(0);
  const lastAttempt = useRef(0);
  const refresh = useCallback(() => setRevision((n) => n + 1), []);
  useEffect(() => {
    let disposed = false;
    let inFlight = false;
    let controller;
    let timeout;
    const update = async () => {
      if (inFlight || document.visibilityState === "hidden") return;
      inFlight = true;
      lastAttempt.current = Date.now();
      controller = new AbortController();
      timeout = setTimeout(() => controller.abort(), 60000);
      setState((previous) => ({ ...previous, loading: true }));
      try {
        const base = (process.env.REACT_APP_BACKEND_URL || "").replace(/\/$/, "");
        const response = await fetch(`${base}/api/climate/${kind}`, { signal: controller.signal });
        if (!response.ok) throw new Error("Weather unavailable");
        const data = await response.json();
        if (!Array.isArray(data.locations) || !data.generated_at) throw new Error("Invalid weather response");
        if (!disposed) setState({ data, loading: false, error: false });
      } catch (_) {
        // Never leave an old client snapshot labelled as current after a failed refresh.
        if (!disposed) setState({ data: null, loading: false, error: true });
      } finally {
        clearTimeout(timeout);
        inFlight = false;
      }
    };
    const onVisible = () => {
      if (document.visibilityState === "visible" && (!lastAttempt.current ||
        Date.now() - lastAttempt.current >= (refreshMs || 60000))) update();
    };
    update();
    const interval = refreshMs ? setInterval(update, refreshMs) : null;
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      disposed = true;
      controller?.abort();
      clearTimeout(timeout);
      clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [kind, refreshMs, revision]);
  return { ...state, refresh };
}
