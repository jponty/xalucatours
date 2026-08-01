-- Preserve alternate physical paths and migration provenance for canonical
-- assets without using delivery URLs as relational keys.

alter table public.media_assets
  add column if not exists metadata jsonb not null default '{}'::jsonb;

comment on column public.media_assets.metadata is
  'Migration and storage provenance, including alternate paths consolidated into this canonical asset.';

notify pgrst, 'reload schema';
