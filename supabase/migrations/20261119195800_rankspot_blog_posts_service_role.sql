-- The API reads and writes RankSpot posts with the Supabase service role.
-- Keep anon and authenticated roles without direct table access.
grant all on table public.rankspot_blog_posts to service_role;
