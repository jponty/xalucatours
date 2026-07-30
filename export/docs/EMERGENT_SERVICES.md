# Servicios administrados por Emergent (para offboarding)

## Administrados por Emergent (plataforma)

| Servicio | Uso en la app | Cómo se accede | Para migrar |
|---|---|---|---|
| **Emergent Object Storage** | Almacena los **másters** de imágenes/archivos (4.480 objetos activos en preview). | `backend/storage.py` → `https://integrations.emergentagent.com/objstore/api/v1/storage`, sesión iniciada con `EMERGENT_LLM_KEY`. Rutas `xaluca/library/…`, `xaluca/slots/…`, `xaluca/day-galleries/…`. | Copiado a Supabase Storage por `export/migrate_storage.py`. Para PRODUCCIÓN, pedir dump a Support. |
| **Emergent LLM Key (universal)** | (a) Generación LLM (Claude/Gemini/OpenAI) para textos/imágenes; (b) init de Object Storage. | Env `EMERGENT_LLM_KEY`. | Sustituir por claves propias de OpenAI/Anthropic/Google si se migra fuera de Emergent. |
| **MongoDB administrado** | Base de datos primaria. | Env `MONGO_URL`. Preview: `mongod` local del contenedor. Producción: instancia gestionada por Emergent. | Dump con `export/dump_mongo.py`. Para PRODUCCIÓN, pedir credenciales/dump a Support. |
| **Hosting / Kubernetes + ingress** | Ejecuta backend (8001) y frontend (3000); enruta `/api`. | Plataforma Emergent. | Reproducir con los comandos de `DEPLOYMENT.md` en el nuevo hosting. |
| **Cloudflare (CDN/proxy)** | Delante del despliegue de producción. | Plataforma. | Configurar CDN equivalente en el nuevo hosting. |
| **webhook-cron** | Reconciliador de webhooks (infra, no datos de la app). | `/app/.emergent/cron/*`. | No aplica a la migración de datos. |
| **Deploy / build pipeline** | Build y publicación a `*.emergent.host`. | Plataforma. | Reemplazar por el pipeline del nuevo hosting. |

## Integraciones de terceros (propiedad del cliente, NO de Emergent)

| Servicio | Uso | Credencial |
|---|---|---|
| **Supabase** (Postgres + Storage) | Destino de la migración/espejo. | `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_DB_URL`, `SUPABASE_STORAGE_BUCKET`. |
| **Resend** | Emails de leads/concurso. | `RESEND_API_KEY`, `LEADS_FROM_EMAIL`, `LEADS_NOTIFY_EMAILS`. |
| **Pexels** | Fotos de stock. | `PEXELS_API_KEY`. |
| **Unsplash** | Fotos de stock. | `UNSPLASH_ACCESS_KEY`, `UNSPLASH_APP_NAME`. |
| **Chatbase** | Widget de chat (embed frontend). | Config en frontend; datos en la cuenta Chatbase. |
| **Senja** | Widget de reseñas (embed frontend). | Config en frontend; datos en la cuenta Senja. |

> Estas integraciones de terceros seguirán funcionando fuera de Emergent siempre que
> se conserven sus claves. Las claves administradas por Emergent
> (`EMERGENT_LLM_KEY`) y el Object Storage **no** son portables: hay que sustituirlos.
