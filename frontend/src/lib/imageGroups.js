/* ============================================================
   Image Groups — single source of truth for every editable
   image (or set of images) on the site.

   The dedicated image-editor route (`/image-editor`) looks up
   sections here using the URL params:

     /image-editor?page=home&section=hero&image=0

   Each group exposes:
     • label        — human title shown on the editor page
     • aspectRatio  — default ratio (slots may override)
     • backRoute    — where "Cancel" returns to
     • slots[]      — ordered list of {id, fallback, label, aspectRatio?}

   Components consuming images (HeroSlider, EmotionalIntro,
   HomeCategoryCarousel, AllTripsCarousel) also read from these
   groups so the registry and the rendered carousel never drift.
============================================================ */
import {
  SOUTH_TRIPS,
  FULL_TRIPS,
  SHORT_TRIPS,
  NORTH_TRIPS,
  UPCOMING_TRIPS,
} from "./homeCarousels";

const T = (es, en, fr) => ({ es, en, fr });

/* ============================================================
   Inline slide sources (Hero + Intro)
============================================================ */
export const HOME_HERO_SLIDES = [
  {
    fallback: "https://images.unsplash.com/photo-1542401886-65d6c61db217?auto=format&fit=crop&w=2000&q=85",
    place: T("Erg Chebbi · Sáhara", "Erg Chebbi · Sahara", "Erg Chebbi · Sahara"),
  },
  {
    fallback: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=2000&q=85",
    place: T("Aït Benhaddou · Atlas", "Aït Benhaddou · Atlas", "Aït Benhaddou · Atlas"),
  },
  {
    fallback: "https://images.unsplash.com/photo-1570133435536-7ececf000ef6?auto=format&fit=crop&w=2000&q=85",
    place: T("Fez · Ciudades imperiales", "Fez · Imperial Cities", "Fès · Cités impériales"),
  },
  {
    fallback: "https://images.unsplash.com/photo-1547234935-80c7145ec969?auto=format&fit=crop&w=2000&q=85",
    place: T("Marrakech · Palmerales", "Marrakech · Palm groves", "Marrakech · Palmeraies"),
  },
];

export const HOME_INTRO_SLIDES = [
  {
    fallback: "https://images.unsplash.com/photo-1597212618440-806262de4f6b?auto=format&fit=crop&w=1400&q=85",
    caption: T("Arfoud — la puerta del desierto.", "Arfoud — the gateway to the desert.", "Arfoud — la porte du désert."),
  },
  {
    fallback: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1400&q=85",
    caption: T("Erg Chebbi — el mar de dunas.", "Erg Chebbi — the sea of dunes.", "Erg Chebbi — la mer de dunes."),
  },
  {
    fallback: "https://images.unsplash.com/photo-1570133435536-7ececf000ef6?auto=format&fit=crop&w=1400&q=85",
    caption: T("Fez — la medina más viva del país.", "Fez — the country's most alive medina.", "Fès — la médina la plus vivante du pays."),
  },
  {
    fallback: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=1400&q=85",
    caption: T("Alto Atlas — cumbres bereberes.", "High Atlas — Berber peaks.", "Haut Atlas — sommets berbères."),
  },
  {
    fallback: "https://images.unsplash.com/photo-1542401886-65d6c61db217?auto=format&fit=crop&w=1400&q=85",
    caption: T("Ait Ben Haddou — kasbahs de adobe.", "Aït Ben Haddou — adobe kasbahs.", "Aït Ben Haddou — kasbahs en pisé."),
  },
];

/* ============================================================
   Helpers
============================================================ */
const tripSlots = (trips, prefix, aspectRatio) =>
  trips.map((t) => ({
    id: `${prefix}.${t.id}`,
    fallback: t.image,
    label: t.title?.es || t.id,
    aspectRatio,
  }));

/* ============================================================
   Registry
============================================================ */
export const IMAGE_GROUPS = {
  "home/hero": {
    label: { es: "Hero principal", en: "Main hero", fr: "Hero principal" },
    aspectRatio: "16/9",
    backRoute: "/",
    slots: HOME_HERO_SLIDES.map((s, i) => ({
      id: `home.hero.${i}`,
      fallback: s.fallback,
      label: s.place.es,
      aspectRatio: "16/9",
    })),
  },
  "home/intro": {
    label: { es: "Carrusel editorial", en: "Editorial carousel", fr: "Carrousel éditorial" },
    aspectRatio: "4/5",
    backRoute: "/",
    slots: HOME_INTRO_SLIDES.map((s, i) => ({
      id: `home.intro.${i}`,
      fallback: s.fallback,
      label: s.caption.es,
      aspectRatio: "4/5",
    })),
  },
  "home/cat-south": {
    label: { es: "Sur de Marruecos", en: "Southern Morocco", fr: "Sud du Maroc" },
    aspectRatio: "4/3",
    backRoute: "/",
    slots: tripSlots(SOUTH_TRIPS, "home.cat-carousel", "4/3"),
  },
  "home/cat-full": {
    label: { es: "Marruecos integral", en: "Full Morocco", fr: "Maroc intégral" },
    aspectRatio: "4/3",
    backRoute: "/",
    slots: tripSlots(FULL_TRIPS, "home.cat-carousel", "4/3"),
  },
  "home/cat-short": {
    label: { es: "Escapadas cortas", en: "Short escapes", fr: "Escapades courtes" },
    aspectRatio: "4/3",
    backRoute: "/",
    slots: tripSlots(SHORT_TRIPS, "home.cat-carousel", "4/3"),
  },
  "home/cat-north": {
    label: { es: "Norte de Marruecos", en: "Northern Morocco", fr: "Nord du Maroc" },
    aspectRatio: "4/3",
    backRoute: "/",
    slots: tripSlots(NORTH_TRIPS, "home.cat-carousel", "4/3"),
  },
  "home/cat-upcoming": {
    label: { es: "Próximas salidas", en: "Upcoming departures", fr: "Prochains départs" },
    aspectRatio: "4/3",
    backRoute: "/",
    slots: tripSlots(UPCOMING_TRIPS, "home.cat-carousel", "4/3"),
  },
};

/* Lookup helper */
export const getImageGroup = (page, section) => {
  if (!page || !section) return null;
  return IMAGE_GROUPS[`${page}/${section}`] || null;
};

/* Get slot info by group + index (or by id) */
export const getGroupSlot = (group, imageRef) => {
  if (!group) return null;
  const idx = Number.isFinite(parseInt(imageRef, 10)) ? parseInt(imageRef, 10) : -1;
  if (idx >= 0 && idx < group.slots.length) return { ...group.slots[idx], index: idx };
  const byId = group.slots.findIndex((s) => s.id === imageRef);
  if (byId !== -1) return { ...group.slots[byId], index: byId };
  return null;
};

export const T_LABEL = T;
