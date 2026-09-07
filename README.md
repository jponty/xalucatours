# Xaluca Tours

React + FastAPI application with Supabase as its only operational data layer.

## Architecture

- Supabase Postgres: CMS, configuration, leads, contests and media metadata in
  the existing `mirror_*` JSONB tables.
- Supabase Storage: original media in the public `xaluca` bucket.
- FastAPI: CMS and public API.
- React/CRACO: static frontend.

MongoDB, Motor, PyMongo, Emergent Object Storage and `EMERGENT_LLM_KEY` are not
required by the operational backend.

## Local backend

Copy `backend/.env.example` to `backend/.env`, populate the Supabase credentials,
then run:

```bash
cd backend
pip install -r requirements.txt
uvicorn server:app --host 0.0.0.0 --port 8001
```

## Local frontend

```bash
cd frontend
corepack enable
yarn install
REACT_APP_BACKEND_URL=http://127.0.0.1:8001 yarn start
```

## Render

The root `render.yaml` defines:

- `xaluca-tours-api`: Python web service.
- `xaluca-tours-web`: React static site with SPA rewriting.

Create a Render Blueprint from this repository and provide every variable marked
`sync: false`. Secrets must remain in Render and must never be committed.

## Resend email delivery

Configure these variables on the `xaluca-tours-api` Render service:

```dotenv
RESEND_API_KEY=re_...
XALUCA_TOURS_NEWSLETTER=re_full_access_...
RESEND_NEWSLETTER_SEGMENT_ID=
LEADS_FROM_EMAIL=Xaluca Tours <notificaciones@YOUR_VERIFIED_DOMAIN>
LEADS_NOTIFY_EMAILS=xalucatours@xaluca.com
FOUNDER_LLUIS_EMAIL=
FOUNDER_TAYEB_EMAIL=
TEAM_NOEMI_EMAIL=
TEAM_ELENA_EMAIL=
TEAM_SANAA_EMAIL=
```

`LEADS_NOTIFY_EMAILS` accepts multiple comma-separated addresses and is the
central fallback for every public form. Founder/team addresses are optional;
when omitted, those direct-contact forms are delivered to the central list.
The central list can also be maintained from **Admin → Notificaciones**. An
empty database setting is repaired from `LEADS_NOTIFY_EMAILS` during startup.

The domain used in `LEADS_FROM_EMAIL` must be verified in Resend. After changing
these values, redeploy/restart the API service. Public form endpoints return
success only after Resend accepts every required internal and client message and
returns a message id. Final mailbox states such as `delivered` or `bounced` are
asynchronous and must be monitored in the Resend Emails/Logs dashboard (or with
Resend webhooks when delivery-state persistence is required).

The Home newsletter form creates or reactivates one global Resend Contact per
email, so repeated signups do not create duplicates. Because contact management
is not available to a send-only key, `XALUCA_TOURS_NEWSLETTER` must be a
Resend **Full access** key. `RESEND_CONTACTS_API_KEY` remains available as an
alternative variable name. Create a dedicated Newsletter Segment and place
its id in `RESEND_NEWSLETTER_SEGMENT_ID` to keep these contacts grouped for
Broadcasts. If the segment id is omitted, signups still appear under global
Contacts. Broadcasts must retain Resend's unsubscribe link; Resend then updates
the Contact's subscription status and suppresses future marketing sends.
