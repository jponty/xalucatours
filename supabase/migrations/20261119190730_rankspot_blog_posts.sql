-- RankSpot articles are written only by the authenticated backend webhook.
create table if not exists public.rankspot_blog_posts (
  source_id text primary key,
  slug text not null unique,
  title text not null,
  description text,
  content_html text not null,
  cover_image_url text,
  category text,
  keywords text[] not null default '{}',
  created_at timestamptz not null,
  updated_at timestamptz not null,
  published_at timestamptz not null,
  received_at timestamptz not null default now(),
  constraint rankspot_slug_format check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$')
);

create index if not exists rankspot_blog_posts_published_idx
  on public.rankspot_blog_posts (published_at desc);

alter table public.rankspot_blog_posts enable row level security;
revoke all on public.rankspot_blog_posts from anon, authenticated;
-- The service-role backend reads published content and is the only writer.
