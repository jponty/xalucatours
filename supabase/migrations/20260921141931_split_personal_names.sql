-- New submissions retain independent name parts. Do not guess or backfill
-- surnames from the historical display name: compound names are ambiguous.
begin;
set local lock_timeout = '5s';

alter table public.feedback
  add column if not exists first_name text,
  add column if not exists last_name text;

alter table public.feedback
  drop constraint if exists feedback_name_length,
  drop constraint if exists feedback_first_name_length,
  drop constraint if exists feedback_last_name_length;

alter table public.feedback
  add constraint feedback_name_length
    check (name is null or char_length(name) <= 271),
  add constraint feedback_first_name_length
    check (first_name is null or (char_length(btrim(first_name)) > 0 and char_length(first_name) <= 120)),
  add constraint feedback_last_name_length
    check (last_name is null or (char_length(btrim(last_name)) > 0 and char_length(last_name) <= 150));

comment on column public.feedback.first_name is 'Optional given name, independently supplied by the visitor.';
comment on column public.feedback.last_name is 'Optional surname(s), independently supplied by the visitor.';
comment on column public.feedback.name is 'Derived display name for new submissions; original unsplit value for historical records.';

-- Lead collections already persist first_name/last_name in their existing
-- JSONB data. No new tables, record duplication, grants or RLS changes.
notify pgrst, 'reload schema';
commit;
