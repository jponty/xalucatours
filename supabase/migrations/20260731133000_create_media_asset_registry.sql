-- Canonical media registry for Bunny/Supabase integration.
--
-- URLs are deliberately not stored as the primary relationship. Application
-- code resolves an asset's storage_path through the active CDN configuration.

create table if not exists public.media_assets (
  id uuid primary key default gen_random_uuid(),
  storage_path text not null unique,
  sha256 text not null,
  source text not null default 'upload',
  external_id text,
  original_filename text,
  mime_type text,
  size_bytes bigint,
  width integer,
  height integer,
  alt_i18n jsonb,
  attribution jsonb,
  focal_point jsonb,
  created_at timestamptz not null default now(),
  migrated_at timestamptz,
  constraint media_assets_storage_path_not_blank
    check (btrim(storage_path) <> ''),
  constraint media_assets_sha256_format
    check (sha256 ~ '^[0-9a-f]{64}$'),
  constraint media_assets_source_not_blank
    check (btrim(source) <> ''),
  constraint media_assets_size_nonnegative
    check (size_bytes is null or size_bytes >= 0),
  constraint media_assets_width_positive
    check (width is null or width > 0),
  constraint media_assets_height_positive
    check (height is null or height > 0),
  constraint media_assets_external_id_not_blank
    check (external_id is null or btrim(external_id) <> '')
);

create unique index if not exists media_assets_sha256_unique
  on public.media_assets (sha256);

create unique index if not exists media_assets_external_source_unique
  on public.media_assets (source, external_id)
  where external_id is not null;

create index if not exists media_assets_source_idx
  on public.media_assets (source);

create table if not exists public.media_usages (
  id uuid primary key default gen_random_uuid(),
  asset_id uuid not null
    references public.media_assets(id) on delete restrict,
  owner_type text not null,
  owner_id text not null,
  position integer,
  metadata jsonb,
  created_at timestamptz not null default now(),
  constraint media_usages_owner_type_not_blank
    check (btrim(owner_type) <> ''),
  constraint media_usages_owner_id_not_blank
    check (btrim(owner_id) <> ''),
  constraint media_usages_position_nonnegative
    check (position is null or position >= 0)
);

create index if not exists media_usages_asset_idx
  on public.media_usages (asset_id);

create index if not exists media_usages_owner_idx
  on public.media_usages (owner_type, owner_id);

comment on table public.media_assets is
  'Canonical media metadata. storage_path is resolved through the configured CDN; full delivery URLs are not relational keys.';

comment on column public.media_assets.sha256 is
  'Lowercase hexadecimal SHA-256 of the canonical stored object; globally unique for deduplication.';

comment on column public.media_assets.external_id is
  'Stable provider identifier, such as a Pexels or Unsplash image ID.';

comment on table public.media_usages is
  'Relations between canonical media assets and CMS/domain owners such as image_slot, day_gallery, team_member or trip.';

alter table public.media_assets enable row level security;
alter table public.media_usages enable row level security;

-- Operational reads and writes are server-side through the Supabase
-- service_role. Browser clients receive no direct table privileges.
revoke all on table public.media_assets from anon, authenticated;
revoke all on table public.media_usages from anon, authenticated;
grant all on table public.media_assets to service_role;
grant all on table public.media_usages to service_role;

notify pgrst, 'reload schema';
