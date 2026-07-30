# Código fuente

## Estado en el contenedor de PREVIEW

- **Rama**: `main`
- **Commit HEAD (preview)**: `a7a96724a1652c6330ba47ceb8abba2d8bc99b6b`
- **Remote git**: *no configurado* en el contenedor de preview (la plataforma
  Emergent hace commits automáticos locales tras cada paso).

## Repositorio

- Repositorio de GitHub del cliente: **`jponty/xalucatours`** (si está conectado vía
  la función **"Save to GitHub"** del chat de Emergent).
- Para exportar el código actual: usar **"Save to GitHub"** en la interfaz de chat.

## ⚠️ Commit exacto desplegado en PRODUCCIÓN

El commit que corresponde exactamente al despliegue de producción
(`https://trip-curator-8.emergent.host`) **debe confirmarlo Emergent Support**. El
contenedor de preview no expone qué commit está sirviendo producción. El HEAD de
preview de arriba es el estado de desarrollo, que puede ir por delante o por detrás
de producción.

## Estructura del proyecto

```
/app
├── backend/
│   ├── server.py            API FastAPI (CMS slots, leads, files, concurso, integraciones, Resend)
│   ├── storage.py           Cliente de Emergent Object Storage
│   ├── supabase_mirror.py   Espejo bajo demanda Mongo+Storage -> Supabase (desde /admin)
│   ├── requirements.txt      141 dependencias (pip freeze)
│   └── .env                  Secretos (NO en repo)
├── frontend/                React (CRA + CRACO), shadcn/ui, Tailwind
│   ├── src/{components,lib,pages}/
│   ├── package.json          scripts: craco start/build/test
│   └── .env
├── export/                  Este paquete de exportación/migración
└── .emergent/               Config de plataforma (emergent.yml, cron)
```

## Metadatos de plataforma (referencia para Support)

- `job_id` (preview, en `/app/.emergent/emergent.yml`):
  `0632360a-eb69-4f78-ae22-95f777acd98d`
- Imagen base:
  `fastapi_react_mongo_shadcn_base_image_cloud_arm:release-25052026-1`
