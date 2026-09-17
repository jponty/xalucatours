import { NORTH_HUB_IMAGES } from "./northHubImages";
import { NORTE_ITINERARIES, NORTE_EDITORIAL } from "./norteItineraries";
import { NORTE_GALLERIES } from "./sectionGalleries";
import { NORTE_VIDEOS } from "./sectionVideos";
import manifest from "../../public/supabase-images.json";

const pathOf = (url) => url.split("xaluca/library/")[1].split("?")[0];
const placements = [
  ["viajes.nortedemarruecos.hero.bg", NORTH_HUB_IMAGES.hero],
  ...NORTE_ITINERARIES.flatMap((itinerary) => [
    [`overview.${itinerary.id}.image`, itinerary.overviewImage],
    [`viajes.nortedemarruecos.itinerary.${itinerary.id}.image`, itinerary.image],
  ]),
  ...NORTE_EDITORIAL.map((block) => [`viajes.nortedemarruecos.editorial.${block.id}.image`, block.image]),
  ...Object.entries(NORTE_VIDEOS).map(([key, video]) => [`video.norte-video-${key}.poster`, video.poster]),
  ...NORTE_GALLERIES.flatMap((gallery, index) => gallery.images.map((image, imageIndex) => [
    `norte-gallery-${index === 0 ? "imperial" : "rif"}.image.${imageIndex}`, image.src,
  ])),
];

test("all 21 northern-hub photo placements use distinct reviewed images", () => {
  const catalog = Object.values(NORTH_HUB_IMAGES).flat();
  expect(placements).toHaveLength(21);
  expect(catalog).toHaveLength(21);
  expect(new Set(placements.map(([, url]) => url))).toEqual(new Set(catalog));
  expect(new Set(catalog.map(pathOf)).size).toBe(21);
  // Different CMS filenames for the same provider photo must not bypass uniqueness.
  const identities = catalog.map((url) => {
    const filename = pathOf(url);
    return filename.match(/^pexels_\d+/)?.[0]
      || filename.match(/^unsplash_(.+)_[a-f\d]{8}\./)?.[1]
      || filename;
  });
  expect(new Set(identities).size).toBe(21);
});

test("overview cards do not repeat the large itinerary photos", () => {
  for (const itinerary of NORTE_ITINERARIES) {
    expect(itinerary.overviewImage).not.toBe(itinerary.image);
  }
  expect(NORTE_GALLERIES.map((gallery) => gallery.images.length)).toEqual([6, 6]);
});

test.each(placements)("build manifest and code fallback agree for %s", (slotId, url) => {
  const slot = manifest.slots.find((item) => item.slot_id === slotId);
  expect(slot).toBeDefined();
  expect(pathOf(slot.url)).toBe(pathOf(url));
  expect(slot.cleared).toBe(false);
});
