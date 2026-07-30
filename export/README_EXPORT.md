# Xaluca Tours — Paquete de exportación / migración a Supabase

Generado desde el entorno **PREVIEW** (desarrollo). El entorno de **PRODUCCIÓN**
(`https://trip-curator-8.emergent.host`) es independiente; sus datos reales solo
puede entregarlos **Emergent Support** (`support@emergent.sh`). Este paquete sirve
como (a) exportación verificable de los datos de preview y (b) herramienta y
plantilla reutilizable contra producción.

## Contenido

```
export/
├── migrate_storage.py     Migración Object Storage -> Supabase (hash-aware, reanudable)
├── dump_mongo.py          Dump completo de MongoDB (BSON + JSON + índices + validadores)
├── sample_check.py        Dry-run de muestras (no sube nada)
├── docs/
│   ├── ENV_INVENTORY.md          Variables de entorno (nombres + propósito, SIN valores)
│   ├── DEPLOYMENT.md             Build/start, versiones, CORS, proxies, workers, cron, health
│   ├── EMERGENT_SERVICES.md      Servicios administrados por Emergent
│   ├── DATA_OUTSIDE_INVENTORY.md Datos fuera de Mongo + Object Storage
│   └── SOURCE_CODE.md            Repo / rama / commit
└── out/
    ├── mongodb/
    │   ├── dump/                  mongodump nativo (BSON + metadata: índices + validadores)
    │   ├── json/<coll>.json       JSON legible por colección (Extended JSON)
    │   ├── indexes.json           Índices de cada colección
    │   ├── validators.json        Validadores / opciones de colección
    │   ├── counts.json            Recuento de documentos por colección (incl. vacías)
    │   └── SUMMARY.md
    ├── storage_scan.json          Censo de existencia (EXISTS / MISSING / ERROR)
    ├── storage_manifest.jsonl     Ledger reanudable (una fila por objeto)
    ├── storage_manifest.csv       Manifiesto final CSV
    ├── storage_manifest.json      Manifiesto final JSON
    ├── conflicts.json             Hashes distintos (NO sobrescritos)
    ├── errors.json                Fallos / corruptos / verificación fallida
    └── storage_report.json        Recuentos + totales de bytes
```

## Cómo se ejecuta

```bash
cd /app
python3 export/dump_mongo.py                 # dump de MongoDB
MIG_WORKERS=16 python3 export/migrate_storage.py scan     # censo de existencia
MIG_WORKERS=8  python3 export/migrate_storage.py migrate   # migración + verificación
python3 export/migrate_storage.py finalize   # regenerar manifiestos/informe desde el ledger
```

## Garantías implementadas (según requisitos del cliente)

- **Ruta exacta**: la key dentro del bucket `xaluca` es el `storage_path` completo
  (empieza por `xaluca/`) → URL `.../public/xaluca/xaluca/library/archivo.ext`
  (doble `xaluca` intencionado: bucket + primer directorio). Sin triplicar.
- **Codificación segura**: cada segmento de ruta se codifica con `quote(part, safe="")`
  (espacios, acentos, `#`, `?`, `&`…).
- **SHA-256 origen y destino**: se calcula y compara antes/después de cada transferencia.
- **No sobrescritura**: subida con `x-upsert=false`. Si el objeto existe y el hash
  **difiere**, se registra CONFLICTO y **no** se reemplaza automáticamente. Si es
  **idéntico**, se omite (SKIPPED_IDENTICAL).
- **Verificación post-subida**: tras subir, se vuelve a descargar y se comprueba
  tamaño + SHA-256 (UPLOADED_VERIFIED / UPLOAD_VERIFY_FAILED).
- **Errores HTTP != 404**: 401/403/429/5xx se tratan como ERROR (se lanzan y
  reintentan), **nunca** como "archivo inexistente".
- **Corruptos**: un objeto ilegible en el origen (Emergent devuelve 5xx persistente)
  se marca CORRUPT_SOURCE, no como fallo de Supabase.
- **Reanudable**: `storage_manifest.jsonl` es un ledger; al reiniciar se omiten las
  filas ya finalizadas (idénticas o subidas y verificadas).
- **No destructivo**: NADA se borra ni desactiva en Emergent (MongoDB/Object Storage).

## Fases

1. **Migración inicial**: `migrate` sobre el catálogo completo de `files` activos.
2. **Snapshot incremental final**: re-ejecutar `dump_mongo.py` + `migrate` (reanudable)
   al final captura cualquier cambio ocurrido durante el proceso; el ledger evita
   reprocesar lo ya verificado.
