import { ALL_TRIPS } from "@/lib/allTripsCatalog";
import { TRIP_PROGRAMS } from "@/lib/tripPrograms";
import { namespaceForRouteId } from "@/components/slotScope";
import { dayGallerySegment, resolveGalleryUrl } from "@/lib/dayGalleryStore";
import { tripHeroImage, tripHeroSlot } from "@/lib/tripHero";
import { FIN_DE_ANO_ITINERARY } from "@/pages/FinDeAno2026Page";

const catalogueByRoute = new Map(ALL_TRIPS.map((trip) => [trip.routeId, trip]));

// Some Home recommendations intentionally link to a route-family landing
// page rather than a concrete programme. Use the longest real programme in
// that family as the visual source so its carousel still represents the
// itinerary day by day while the card keeps linking to the family page.
const gallerySourceRoute = {
  tourGransurTangerRak: "tourTangerRak910",
};

const manifestMaps = (manifest) => ({
  slots: new Map((manifest?.slots || []).filter((slot) => slot?.slot_id).map((slot) => [slot.slot_id, slot.url || null])),
  galleries: new Map((manifest?.galleries || []).filter((gallery) => gallery?.key).map((gallery) => [gallery.key, gallery.images || []])),
});

// This is the same image resolution used by the individual programme pages:
// master hero, managed day galleries, day images and slide slots.
export const tripImages = (routeId, program, catalogue, manifest, options = {}) => {
  const { representEveryDay = false, maxImages = 8 } = options;
  const { slots, galleries } = manifestMaps(manifest);
  const namespace = namespaceForRouteId(routeId);
  const days = routeId === "tourFinDeAno2025" ? FIN_DE_ANO_ITINERARY : (program?.days || []);
  const images = [];
  const seen = new Set();
  const add = (value) => {
    const raw = typeof value === "string" ? value : value?.url;
    const url = resolveGalleryUrl(raw);
    if (!url || seen.has(url)) return;
    seen.add(url);
    images.push(url);
  };

  add(slots.get(tripHeroSlot(routeId)) || tripHeroImage(routeId) || catalogue?.image);

  const candidatesByDay = days.map((day, dayIndex) => {
    const legacyBase = `${namespace}.day.${day.id}`;
    const galleryKey = `${namespace}.${dayGallerySegment(dayIndex + 1, day.id)}`;
    const managed = galleries.get(galleryKey) || galleries.get(legacyBase);
    if (managed?.length) return managed.map((image) => image?.url).filter(Boolean);

    return [
      slots.get(`${legacyBase}.image`) || day.image,
      ...(day.gallery || []),
      ...Array.from({ length: 9 }, (_unused, index) => slots.get(`${legacyBase}.slide.${index}`)),
    ].filter(Boolean);
  });

  if (representEveryDay) {
    // First pass: reserve one distinct photograph for every itinerary day.
    // This prevents a long first-day gallery from consuming the whole card
    // carousel before later days have had a chance to appear.
    candidatesByDay.forEach((candidates) => {
      const representative = candidates.find((candidate) => {
        const url = resolveGalleryUrl(candidate);
        return url && !seen.has(url);
      }) || candidates[0];
      add(representative);
    });

    // A hero plus one image per day is the compact set required by the Home
    // cards. If a day lacks media, fill the remaining space from its real
    // gallery without introducing duplicates.
    const dayCoverageLimit = Math.max(maxImages, days.length + 1);
    candidatesByDay.flat().forEach((candidate) => {
      if (images.length < dayCoverageLimit) add(candidate);
    });
    return images.slice(0, dayCoverageLimit);
  }

  candidatesByDay.flat().forEach(add);
  return images.slice(0, maxImages);
};

export const tripImagesForRoute = (routeId, manifest, options) => {
  const sourceRouteId = gallerySourceRoute[routeId] || routeId;
  return tripImages(
  sourceRouteId,
  TRIP_PROGRAMS[sourceRouteId]?.program,
  catalogueByRoute.get(sourceRouteId),
  manifest,
  options,
  );
};
