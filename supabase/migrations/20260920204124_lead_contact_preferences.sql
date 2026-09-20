-- New forms require both contact details; historical feedback remains valid and untouched.
-- RLS and existing service-role-only privileges are unchanged.
alter table public.feedback
  add column if not exists phone text,
  add column if not exists preferred_contact text[];

comment on column public.feedback.preferred_contact is
  'Preferred reply channels; new submissions use {email,phone} or {email}. Not marketing consent.';

notify pgrst, 'reload schema';
