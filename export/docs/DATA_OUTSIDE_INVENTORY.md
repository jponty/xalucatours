# Datos fuera de MongoDB y Object Storage

Confirmación explícita de dónde vive cada tipo de dato, para no dejar nada sin migrar.

## Datos primarios (SÍ se migran)

| Origen | Contenido | Migración |
|---|---|---|
| **MongoDB** (19 colecciones) | Todo el contenido/CMS, leads, formularios, concurso, registros de slots. | `export/dump_mongo.py` + espejo `mirror_*` en Supabase Postgres. |
| **Emergent Object Storage** | Másters de imágenes/archivos (4.480 activos). | `export/migrate_storage.py` → bucket `xaluca` en Supabase Storage. |

## Datos derivados / regenerables (NO son primarios)

| Origen | Contenido | Nota |
|---|---|---|
| `backend/img_cache/` | ~28.600 variantes AVIF/WebP responsive (~1,8 GB). | **Cache derivada**, regenerada bajo demanda desde los másters. No es dato primario; no requiere migración (se regenera). |

## Logs (operativos, no dato de negocio)

- `/var/log/supervisor/backend.*.log`, `frontend.*.log`, `mongodb.*.log`
- `/var/log/webhook-cron.log`

No contienen dato de negocio persistente más allá de lo que ya está en MongoDB.

## Otros (confirmación)

| Categoría | ¿Existe? | Detalle |
|---|---|---|
| Colas (Celery/Redis/RabbitMQ) | ❌ No | La app no usa colas ni brokers. |
| Cachés persistentes (Redis/Memcached) | ❌ No | Solo la cache de imágenes en disco (`img_cache`, derivada). |
| Formularios | ✅ En MongoDB | `contact_requests`, `trip_planner_requests`, `contest_participants`. |
| Variables/estado de app | ✅ En MongoDB | `app_settings`, `config`, `system_state`. |
| Analítica server-side | ❌ No | No hay analítica propia en backend. Chatbase/Senja son embeds de terceros (datos en sus cuentas). |
| Backups | ⚠️ Plataforma | La app no gestiona backups. Los backups de producción, si existen, los gestiona Emergent → preguntar a Support. |
| Funciones serverless | ❌ No | No hay. |
| Cron jobs de la app | ❌ No | El único cron es el reconciliador de Emergent (infra). |
| Bases de datos adicionales | ❌ No | Solo la MongoDB primaria (+ Supabase como destino). |
| Bookkeeping interno | ✅ En MongoDB | `supabase_sync_state`, `supabase_synced_objects` (estado del espejo). |

## Secretos

Solo en `backend/.env` y `frontend/.env` (ver `ENV_INVENTORY.md`). No hay secretos
embebidos en el código ni en el repositorio.
