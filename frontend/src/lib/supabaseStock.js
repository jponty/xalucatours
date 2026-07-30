import { loadSupabaseImages } from "@/lib/supabaseImages";

const searchable = (value) =>
  String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase();

const photographerFromName = (filename, source) => {
  const label = String(filename || "").replace(/\.[^.]+$/, "");
  const match = label.match(new RegExp(`^${source}\\s*[·-]\\s*(.+)$`, "i"));
  return match?.[1] || source;
};

const toStockPhoto = (item, source) => {
  const metadata = item[source] || {};
  const photographer =
    metadata.photographer ||
    metadata.photographer_name ||
    metadata.user_name ||
    photographerFromName(item.original_filename, source);
  return {
    id: item.id,
    thumb_url: item.url,
    grid_url: item.url,
    preview_url: item.url,
    alt: item.original_filename || item.slot_id || `${source} ${item.id}`,
    photographer,
    photographer_url:
      metadata.photographer_url || metadata.user_url || metadata.profile_url || "",
    pexels_url: metadata.pexels_url || metadata.url || "",
    unsplash_url: metadata.unsplash_url || metadata.url || "",
    location: metadata.location || null,
    _libraryItem: item,
  };
};

export const searchSupabaseStock = async (
  source,
  { query = "", page = 1, per_page = 24 } = {}
) => {
  const data = await loadSupabaseImages();
  const sourceName = searchable(source);
  const tokens = searchable(query).split(/\s+/).filter((token) => token.length > 1);

  const ranked = (data.library || [])
    .filter((item) => {
      const tags = (item.tags || []).map(searchable);
      return tags.includes(sourceName) || searchable(item.original_filename).startsWith(sourceName);
    })
    .map((item) => {
      const haystack = searchable([
        item.original_filename,
        item.slot_id,
        item.storage_path,
        item.search_text,
        ...(item.tags || []),
      ].join(" "));
      const score = tokens.reduce((total, token) => total + (haystack.includes(token) ? 1 : 0), 0);
      return { item, score };
    })
    .filter(({ score }) => tokens.length === 0 || score > 0)
    .sort((a, b) => b.score - a.score);

  const safePage = Math.max(1, Number(page) || 1);
  const pageSize = Math.max(1, Number(per_page) || 24);
  const start = (safePage - 1) * pageSize;
  const pageItems = ranked.slice(start, start + pageSize);

  return {
    page: safePage,
    per_page: pageSize,
    total_results: ranked.length,
    next_page: start + pageSize < ranked.length,
    photos: pageItems.map(({ item }) => toStockPhoto(item, sourceName)),
  };
};

export const stockPhotoAsLibraryItem = (photo) => ({
  ...(photo?._libraryItem || {}),
  id: photo?._libraryItem?.id || photo?.id,
  url: photo?._libraryItem?.url || photo?.thumb_url,
  original_filename: photo?._libraryItem?.original_filename || photo?.alt,
});
