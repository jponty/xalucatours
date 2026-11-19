const API = (process.env.REACT_APP_BACKEND_URL || "").replace(/\/$/, "");

export const normaliseRankspotPost = (row) => ({
  id: `rankspot-${row.source_id}`,
  slug: row.slug,
  category: row.category || "",
  categoryLabel: row.category || "",
  cover: row.cover_image_url || "/og-image.jpg",
  readingTime: Math.max(1, Math.ceil((row.content_html || row.description || "").replace(/<[^>]+>/g, " ").split(/\s+/).length / 200)),
  publishedAt: row.published_at,
  updatedAt: row.updated_at,
  author: "Xaluca Tours",
  keywords: row.keywords || [],
  title: { es: row.title, en: row.title, fr: row.title },
  excerpt: { es: row.description || "", en: row.description || "", fr: row.description || "" },
  contentHtml: row.content_html || "",
  body: [],
});

export async function fetchRankspotPosts() {
  const response = await fetch(`${API}/api/blog/posts`);
  if (!response.ok) throw new Error("Could not load blog posts");
  return (await response.json()).map(normaliseRankspotPost);
}

export async function fetchRankspotPost(slug) {
  const response = await fetch(`${API}/api/blog/posts/${encodeURIComponent(slug)}`);
  if (response.status === 404) return null;
  if (!response.ok) throw new Error("Could not load article");
  return normaliseRankspotPost(await response.json());
}
