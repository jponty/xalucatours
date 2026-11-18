import { getPostBySlug, POSTS } from "./blog";

test("the Marrakech-to-Sahara article is indexed with a unique slug and Pexels cover", () => {
  const slug = "viajes-desierto-sahara-desde-marrakech";
  const post = getPostBySlug(slug);
  expect(post).toBeTruthy();
  expect(POSTS.filter((entry) => entry.slug === slug)).toHaveLength(1);
  expect(post.category).toBe("desierto");
  expect(post.cover).toContain("pexels_");
  expect(post.cta.route).toBe("tourMarrakechErgHub");
});
