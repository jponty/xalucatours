# Inventario de variables de entorno

> **Nunca** se incluyen valores/secretos en este repositorio. Solo nombres y
> propósito. Los valores de **producción** debe entregarlos Emergent Support por
> canal seguro (`support@emergent.sh`).

## backend/.env

| Variable | Secreto | Propósito |
|---|---|---|
| `MONGO_URL` | 🔴 Sí | Cadena de conexión a MongoDB (BD primaria). En preview apunta al `mongod` local; en producción a la instancia administrada por Emergent. |
| `DB_NAME` | No | Nombre de la base de datos (en preview: `test_database`). |
| `CORS_ORIGINS` | No | Orígenes permitidos para CORS (actual: `*`). |
| `EMERGENT_LLM_KEY` | 🔴 Sí | Clave universal de Emergent. Se usa para (a) generación LLM (Claude/Gemini/OpenAI) y (b) inicializar **Emergent Object Storage** (`storage.init_storage`). |
| `PEXELS_API_KEY` | 🔴 Sí | API de Pexels (fotos de stock). |
| `UNSPLASH_ACCESS_KEY` | 🔴 Sí | API de Unsplash (fotos de stock). |
| `UNSPLASH_APP_NAME` | No | Nombre de la app registrada en Unsplash (atribución). |
| `ADMIN_PASSWORD` | 🔴 Sí | Contraseña única del panel `/admin`. |
| `ADMIN_TOKEN_SECRET` | 🔴 Sí | Secreto para firmar el token de sesión de admin. |
| `DEFAULT_PROGRAM_DOWNLOAD_URL` | No | URL por defecto del PDF de programa (descargas). |
| `RESEND_API_KEY` | 🔴 Sí | API de Resend (emails de leads/concurso). |
| `LEADS_FROM_EMAIL` | No | Remitente de los emails de leads. |
| `LEADS_NOTIFY_EMAILS` | ⚠️ PII | Destinatarios internos de notificaciones de leads. |
| `SUPABASE_URL` | No | URL del proyecto Supabase (`https://<ref>.supabase.co`). |
| `SUPABASE_SERVICE_ROLE_KEY` | 🔴 Sí (crítico) | Clave `service_role` de Supabase (acceso total a Storage + Postgres). |
| `SUPABASE_DB_URL` | 🔴 Sí | Cadena de conexión Postgres de Supabase (transaction pooler). |
| `SUPABASE_STORAGE_BUCKET` | No | Nombre del bucket de Storage (`xaluca`). |

## Variables opcionales (imágenes) leídas por el backend

No siempre presentes en `.env`; tienen valores por defecto en el código:
`IMG_AVIF_QUALITY`, `IMG_WEBP_QUALITY`, `IMG_AVIF_SPEED`, `IMG_AVIF_SPEED_WARM`,
`IMG_WEBP_METHOD`, `IMG_WEBP_METHOD_WARM`, `IMG_WARM_ON_STARTUP`,
`IMG_REOPT_ON_STARTUP`, `IMG_REOPT_CONCURRENCY`, `IMG_CORRUPT_SCAN_CONCURRENCY`,
`SUPABASE_SYNC_CONCURRENCY`.

## frontend/.env

| Variable | Secreto | Propósito |
|---|---|---|
| `REACT_APP_BACKEND_URL` | No | URL base del backend (todas las llamadas usan `${REACT_APP_BACKEND_URL}/api`). |
| `WDS_SOCKET_PORT` | No | Puerto del websocket del dev server (hot reload). |
| `ENABLE_HEALTH_CHECK` | No | Flag de health-check del dev server. |

## Recomendación de seguridad

Las credenciales de Supabase se compartieron por chat durante el desarrollo. Se
recomienda **rotarlas** en Supabase (Settings → API / Database) cuando finalice la
migración.
