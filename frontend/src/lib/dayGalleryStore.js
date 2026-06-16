/* ============================================================
   dayGalleryStore — client cache for the dynamic per-day image
   galleries managed from the /admin "Travel Image Library".

   Mirrors the image-slot store: one bulk fetch of /api/day-galleries
   hydrates every itinerary gallery, then components subscribe by key
   (`<page-namespace>.day.<dayId>`). The admin can push local updates
   so the editor preview reflects changes instantly.
============================================================ */
import { useEffect, useState } from "react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const store = {
  ready: false,
  loading: null,
  map: new Map(), // key -> [{url, alt}]
  subs: new Map(), // key -> Set<callback>
};

const notify = (key) => {
  const set = store.subs.get(key);
  if (set) set.forEach((cb) => cb(store.map.get(key) || null));
};

export const ensureDayGalleries = () => {
  if (store.ready) return Promise.resolve();
  if (store.loading) return store.loading;
  store.loading = fetch(`${API}/day-galleries`)
    .then((r) => (r.ok ? r.json() : { galleries: [] }))
    .then((data) => {
      (data.galleries || []).forEach((g) => {
        if (g.key) store.map.set(g.key, g.images || []);
      });
      store.ready = true;
      // Notify any keys that were subscribed before data arrived.
      store.subs.forEach((_set, key) => notify(key));
    })
    .catch(() => { store.ready = true; })
    .finally(() => { store.loading = null; });
  return store.loading;
};

export const getDayGallery = (key) => store.map.get(key) || null;

/* Push a fresh image list into the cache (used by the admin editor so
   the live preview updates without a refetch). */
export const setDayGalleryLocal = (key, images) => {
  if (!key) return;
  if (images && images.length) store.map.set(key, images);
  else store.map.delete(key);
  notify(key);
};

export const subscribeDayGallery = (key, cb) => {
  if (!store.subs.has(key)) store.subs.set(key, new Set());
  store.subs.get(key).add(cb);
  return () => {
    const set = store.subs.get(key);
    if (set) set.delete(cb);
  };
};

/* React hook: returns the ordered image list for a day, or null if the
   day has no dynamic gallery (caller falls back to legacy slots). */
export const useDayGallery = (key) => {
  const [images, setImages] = useState(() => getDayGallery(key));
  useEffect(() => {
    let alive = true;
    setImages(getDayGallery(key));
    const unsub = subscribeDayGallery(key, (imgs) => { if (alive) setImages(imgs); });
    ensureDayGalleries().then(() => { if (alive) setImages(getDayGallery(key)); });
    return () => { alive = false; unsub(); };
  }, [key]);
  return images && images.length ? images : null;
};

export const resolveGalleryUrl = (url) =>
  url && url.startsWith("/api/") ? `${process.env.REACT_APP_BACKEND_URL}${url}` : url;
