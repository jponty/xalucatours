/* ============================================================
   Pricing store — bulk-loads the global pricing override from
   /api/pricing ONCE and lets every <FromPrice>/<PricingSection>
   subscribe. Mirrors the lightweight coordinator pattern used by
   <EditableText>. The admin "Precios" tab updates the same store
   so edits reflect live across the site.
============================================================ */
import { useEffect, useState } from "react";
import { DEFAULT_PRICING, mergePricing } from "@/lib/pricing";

const API = process.env.REACT_APP_BACKEND_URL;

const store = {
  ready: false,
  loading: null,
  override: null,          // raw doc from /api/pricing ({} if none)
  subscribers: new Set(),
};

const notify = () => store.subscribers.forEach((cb) => cb());

export const ensurePricing = () => {
  if (store.ready) return Promise.resolve();
  if (store.loading) return store.loading;
  store.loading = (async () => {
    try {
      const res = await fetch(`${API}/api/pricing`);
      store.override = await res.json();
    } catch {
      store.override = null;
    }
    store.ready = true;
    store.loading = null;
    notify();
  })();
  return store.loading;
};

export const getMergedPricing = () => mergePricing(store.override);

/* Used by the admin tab after a successful save (or optimistic update). */
export const setPricingOverride = (data) => {
  store.override = data;
  store.ready = true;
  notify();
};

/* Subscribe a React component to the live merged pricing. */
export const usePricing = () => {
  const [, force] = useState(0);
  useEffect(() => {
    const cb = () => force((x) => x + 1);
    store.subscribers.add(cb);
    ensurePricing();
    return () => { store.subscribers.delete(cb); };
  }, []);
  return store.ready ? getMergedPricing() : DEFAULT_PRICING;
};
