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
