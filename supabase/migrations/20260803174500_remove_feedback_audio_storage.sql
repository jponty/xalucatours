-- Privacy hardening for feedback voice messages.
-- Preserve existing transcripts as canonical text, then remove every column
-- and relationship that could retain an audio file or duplicate transcript.

begin;

update public.feedback
set
  feedback_text = coalesce(
    nullif(btrim(feedback_text), ''),
    nullif(btrim(transcript), '')
  ),
  submission_type = case
    when submission_type = 'audio' then 'voice'
    else submission_type
  end;

drop index if exists public.feedback_audio_asset_idx;

alter table public.feedback
  drop constraint if exists feedback_submission_type_check,
  drop constraint if exists feedback_transcription_status_check,
  drop constraint if exists feedback_has_content,
  drop constraint if exists feedback_transcript_length,
  drop constraint if exists feedback_text_length,
  drop column if exists audio_asset_id,
  drop column if exists audio_duration_seconds,
  drop column if exists transcript,
  drop column if exists transcription_status,
  drop column if exists transcription_model;

alter table public.feedback
  alter column feedback_text set not null,
  add constraint feedback_submission_type_check
    check (submission_type in ('text', 'voice')),
  add constraint feedback_has_content
    check (nullif(btrim(feedback_text), '') is not null),
  add constraint feedback_text_length
    check (char_length(feedback_text) <= 12000);

comment on table public.feedback is
  'Customer comments stored as reviewed text. Voice audio is used only for ephemeral transcription and is never persisted.';

commit;

notify pgrst, 'reload schema';
