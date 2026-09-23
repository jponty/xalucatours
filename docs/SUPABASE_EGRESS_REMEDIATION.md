# Supabase egress: remediation and rollout

## Changes prepared locally (2026-09-23)

No production data, schema, policies, storage objects or infrastructure settings
were changed. These fixes take effect only after backend and frontend deployment.

- Text, image-slot and remote-image registries require authenticated admin access.
  Anonymous visits/crawlers no longer enqueue registrations in the browser. Old
  clients attempting POST registration get 401 before any database access.
- Registry listing endpoints are admin-only too; the Textos panel sends its
  existing admin token. Public CMS content remains readable as before.
- Admin registrations are deduplicated and batched (100 entries per browser
  request). Logging in on an already mounted page triggers registration; logging
  out before a queued batch is sent cancels it. Failed requests do not loop.
- Primary-key bulk updates fetch only the requested keys, preserve first_seen
  and other existing fields, and upsert JSON arrays instead of scanning the entire
  registry once per slot. Server batches limit both key count and encoded URL size.
- Point reads/updates/deletes now filter by primary key or known scalar string
  fields in PostgREST. Additional unsupported filters still run in the compatibility
  matcher, without prematurely limiting candidates. Unsorted cursors honor read
  limits. Exact supported counts use HEAD/count=exact (no document response body).
- Unchanged document updates do not issue unnecessary writes.
- Per-process logs aggregate requests, response body bytes and errors per table
  and HTTP method, emitted on activity at least 60 seconds after the previous window.
  They contain no query parameters, credentials or document contents. These are
  decoded HTTP body bytes, not Supabase's billing meter; retry responses count too.

## Verification

Offline regression tests model a registry containing 14,487 documents. Updating
20 existing slots previously required 300 page GETs and 20 POSTs, transferring
145,739,220 JSON response bytes in this fixture. The optimized path uses one
filtered GET plus one batch POST and returns 10,060 bytes: a 99.993% reduction for
this operation. This is a controlled benchmark, not a measured monthly saving.

Tests cover insert-only fields, repeated IDs, non-upsert misses, no-op writes,
special characters/long URL IDs, partial filters, pagination, projection, sorting,
counts, authorization, browser batching and retry behavior.

Live **read-only** checks against the existing Xaluca Tours project also validated
primary-key reads, JSON string field filtering, quoted IN filters and HEAD counts.

## Publication and follow-up

1. Deploy the backend first to stop legacy anonymous registration immediately;
   deploy the frontend from the same revision so public browsers stop POSTing and
   the admin uses authenticated registry requests.
2. As an anonymous visitor, open several pages and verify that there are no POSTs
   to text_slots/register, image_slots/register or image_urls/register. The two
   /registry GETs and all three registration POSTs must reject unauthenticated
   callers. Public text/image reads and all lead forms must remain available.
3. Log in to admin; navigate/edit text and images, open Textos and Galerías, and
   verify batched registrations and persistence. Previously registered content
   remains in the database; new code defaults are discovered on admin navigation,
   not by public visits. Visit newly added pages as admin to index their defaults.
4. Compare Supabase's **daily PostgREST egress** and request counts with the same
   traffic window before deployment. Billing-cycle cumulative egress cannot fall;
   compare new daily increments over 24–48 hours instead.
5. Inspect Render logs for `supabase_transfer table=mirror_text_slot_registry`
   and `mirror_image_slot_registry`. Large repeated full-registry downloads from
   anonymous registration should disappear. Also check 499/502 and request latency.

## Remaining optimization candidates

Complex array/regex queries, broad sorted lists, and Python aggregates still use
the compatibility adapter and may read all candidates. Public content-manifest
and URL-map requests can be considered for single-flight caching after observing
their remaining traffic. Do not replace these semantics or cache personalized
lead responses indiscriminately. Use the new table-level metrics to prioritize
further SQL/pagination/index/cache work; no speculative schema migration, bot
blocklist, or CDN/storage migration is included in this patch.

Existing unrelated frontend suite failure: renderRoutes.test.js assumes that
/findeano2025 is the first redirect, but current render.yaml starts with retired
Enduro redirects. The mismatch already exists in HEAD; this patch does not alter
routes. Production compilation succeeds.
