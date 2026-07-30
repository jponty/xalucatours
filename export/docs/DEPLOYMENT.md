# Configuración de despliegue

## Stack

- **Frontend**: React (Create React App + **CRACO**). Node **v20.20.2**, Yarn **1.22.22**.
- **Backend**: FastAPI. Python **3.11.15**.
- **Base de datos**: MongoDB (preview: `mongod` local; producción: administrado por Emergent).

## Comandos de build / start

### Frontend
```bash
yarn install
yarn build            # craco build  -> genera /app/frontend/build (estáticos)
# dev: yarn start     # craco start (puerto 3000, hot reload)
```

### Backend
```bash
pip install -r backend/requirements.txt
# preview/dev (supervisor):
uvicorn server:app --host 0.0.0.0 --port 8001 --workers 1 --reload
# producción: sin --reload, workers según recursos
uvicorn server:app --host 0.0.0.0 --port 8001 --workers 1
```

## Procesos (supervisor, preview)

| Programa | Comando |
|---|---|
| backend | `uvicorn server:app --host 0.0.0.0 --port 8001 --workers 1 --reload` |
| frontend | `yarn start` |
| mongodb | `/usr/bin/mongod --bind_ip_all` |
| code-server | (IDE del contenedor; no forma parte de la app) |
| nginx proxy | (proxy del code-server; no de la app) |
| webhook-crond | reconciliador de cron de Emergent (infra, ver abajo) |

## Enrutado / proxies

- **Kubernetes ingress**: las rutas con prefijo **`/api`** van al backend (8001); el
  resto al frontend (3000).
- **Cloudflare** delante del despliegue de producción (CDN/proxy). En preview el
  ingress fuerza `Cache-Control: no-store`; en producción Cloudflare respeta
  `immutable` + `stale-while-revalidate` de las variantes de imagen.

## CORS

- `CORS_ORIGINS="*"` (configurable por env). FastAPI `CORSMiddleware`.

## Health checks

- Backend expone `GET /` y `GET /api/` que responden de inmediato (para readiness
  probes con o sin prefijo `/api`).
- Flag `ENABLE_HEALTH_CHECK` en el frontend (dev server).
- El `startup` de FastAPI retorna al instante y difiere todo el I/O pesado a una
  tarea de background (evita timeouts de readiness en producción).

## Workers / tareas en segundo plano

**No hay** Celery / Redis / RabbitMQ / colas. El backend lanza, en el `startup`,
tareas asíncronas **detached** (no bloquean el arranque):
- `init_storage()` (Emergent Object Storage) vía `asyncio.to_thread`
- creación de índices Mongo
- carga de emails de notificación
- mantenimiento de imágenes (warm-cache / re-optimización) — **desactivado por
  defecto** (`IMG_WARM_ON_STARTUP=false`, `IMG_REOPT_ON_STARTUP=false`); se lanzan
  manualmente desde `/admin`.

## Cron / tareas programadas

**La aplicación no define cron jobs propios.** El único cron es infraestructura de
Emergent: `webhook-crond` ejecuta `watch_crons.sh` cada minuto (reconciliador de
webhooks de la plataforma). No procesa datos de la app.

## Imagen base del contenedor

`fastapi_react_mongo_shadcn_base_image_cloud_arm:release-25052026-1` (ver
`/app/.emergent/emergent.yml`). Dependencia de sistema declarada: `cron=3.0pl1-162`.
