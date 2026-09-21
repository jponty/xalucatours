// Read compatibility only. Editors always save to the current programme key.
// The short Enduro trip shares these stages with the approved five-day trip;
// never inherit the retired seven-day route's Saghro/Dadès/Zagora galleries.
const SHORT = "viajes.aventura.enduro.programa_3n_4d";
const LONG = "viajes.aventura.enduro.programa_4n_5d";
const ENDURO_DAY_SOURCES = { 1: 1, 2: 2, 3: 4, 4: 5 };

export const galleryReadKeys = (key) => {
  if (!key) return [];
  const keys = [key];
  const indexed = key.match(/^(.*)\.day\.(\d+)\.(.+)$/);
  if (indexed) {
    const [, namespace, index, dayId] = indexed;
    keys.push(`${namespace}.day.${dayId}`);
    const sourceDay = namespace === SHORT && ENDURO_DAY_SOURCES[index];
    if (sourceDay) keys.push(`${LONG}.day.${sourceDay}.dia-${sourceDay}`, `${LONG}.day.dia-${sourceDay}`);
  }
  return keys;
};

export const resolveManagedGallery = (key, lookup) => {
  for (const candidate of galleryReadKeys(key)) {
    const images = lookup(candidate);
    // An explicitly saved empty gallery must not resurrect inherited photos.
    if (Array.isArray(images)) return { key: candidate, images };
  }
  return null;
};

export const imageSlotReadKeys = (slot) => slot === "trip.tourEnduroAventura34.hero"
  ? [slot, "trip.tourEnduroAventura67.hero"]
  : [slot];

export const resolveImageSlot = (slot, lookup) => {
  for (const candidate of imageSlotReadKeys(slot)) {
    const value = lookup(candidate);
    if (value !== undefined) return value;
  }
  return undefined;
};
