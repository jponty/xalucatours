-- Customer feedback submitted from /feedback.
-- Voice recordings are transcribed ephemerally and are never persisted.

create table if not exists public.feedback (
  id uuid primary key default gen_random_uuid(),
  submission_type text not null
    check (submission_type in ('text', 'voice')),
  name text,
  email text,
  trip_reference text,
  rating smallint check (rating is null or rating between 1 and 5),
  feedback_text text not null,
  transcription_language text,
  status text not null default 'new'
    check (status in ('new', 'reviewed', 'resolved', 'archived')),
  admin_notes text,
  source_url text,
  consent boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  archived_at timestamptz,
  constraint feedback_has_content check (
    nullif(btrim(feedback_text), '') is not null
  ),
  constraint feedback_name_length check (name is null or char_length(name) <= 120),
  constraint feedback_email_length check (email is null or char_length(email) <= 254),
  constraint feedback_trip_reference_length check (trip_reference is null or char_length(trip_reference) <= 200),
  constraint feedback_text_length check (char_length(feedback_text) <= 12000),
  constraint feedback_admin_notes_length check (admin_notes is null or char_length(admin_notes) <= 6000)
);

create index if not exists feedback_created_at_idx
  on public.feedback (created_at desc);
create index if not exists feedback_status_idx
  on public.feedback (status, created_at desc);
comment on table public.feedback is
  'Customer comments stored as reviewed text. Voice audio is used only for ephemeral transcription and is never persisted.';

alter table public.feedback enable row level security;
revoke all on table public.feedback from anon, authenticated;
grant all on table public.feedback to service_role;

notify pgrst, 'reload schema';
