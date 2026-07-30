/* ============================================================
   Per-program pricing store — bulk-loads admin overrides from
   /api/program-pricing ONCE, feeds them into lib/programPricing so
   getProgramTiers / getProgramExtras return the admin-edited values,
   and lets subscribers re-render. usePricing() (pricingStore) also
   subscribes here, so every <FromPrice>/<PricingSection> reflects
   edits live. The admin "Precios prog." tab updates it on save.
============================================================ */
import { setProgramOverride } from "@/lib/programPricing";

const API = process.env.REACT_APP_BACKEND_URL;

const store = { ready: false, loading: null, programs: {}, subscribers: new Set() };
const notify = () => store.subscribers.forEach((cb) => cb());

export const ensureProgramPricing = () => {
  if (store.ready) return Promise.resolve();
  if (store.loading) return store.loading;
  store.loading = (async () => {
    try {
      const res = await fetch(`${API}/api/program-pricing`);
      const doc = await res.json();
      store.programs = (doc && doc.programs) || {};
    } catch {
      store.programs = {};
    }
    setProgramOverride(store.programs);
    store.ready = true;
    store.loading = null;
    notify();
  })();
  return store.loading;
};

export const getProgramOverrides = () => store.programs;

/* Called by the admin tab after a successful save/reset (optimistic live update).
   Pass data=null to drop an override (route reverts to the compiled default). */
export const setProgramPricingLocal = (routeId, data) => {
  const next = { ...store.programs };
  if (data == null) delete next[routeId];
  else next[routeId] = data;
  store.programs = next;
  setProgramOverride(next);
  store.ready = true;
  notify();
};

export const addProgramSubscriber = (cb) => store.subscribers.add(cb);
export const removeProgramSubscriber = (cb) => store.subscribers.delete(cb);
