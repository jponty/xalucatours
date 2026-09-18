# Dominio principal: xalucatours.com

Actualización del código: 18 de septiembre de 2026.

## Incluido en este cambio

- Origen canónico central: `https://xalucatours.com`.
- Metadatos iniciales, canonical, hreflang y Open Graph generados para las rutas.
- Sitemap, robots y recursos públicos de descubrimiento regenerados en cada build.
- Enlaces e imágenes de las plantillas HTML/texto del repositorio.
- Fallback de enlaces de confirmación por email al nuevo dominio.
- CORS permite ambos dominios, con/sin www, el frontend onrender y desarrollo local.
- La herramienta de copia de producción del administrador consulta la API, no el Static Site.
- Los leads siguen guardando la URL real de origen; no se reescriben registros históricos.

## Configuración de Render que debe acompañar al código

En **xaluca-tours-api**:

```dotenv
PUBLIC_SITE_URL=https://xalucatours.com
CORS_ORIGINS=https://xalucatours.com,https://www.xalucatours.com,https://xalucatravel.com,https://www.xalucatravel.com,https://xaluca-tours-web.onrender.com
PRODUCTION_BASE_URL=https://xaluca-tours-api.onrender.com
```

`PRODUCTION_BASE_URL` es la fuente API de la herramienta administrativa de copia;
no ejecutar esa herramienta como parte de esta migración. Si existe la variable,
su valor tiene prioridad sobre el fallback del código.

En **xaluca-tours-web**, conservar:

```dotenv
REACT_APP_BACKEND_URL=https://xaluca-tours-api.onrender.com
```

No hace falta añadir `REACT_APP_PUBLIC_SITE_URL`: la configuración SEO procede
de `frontend/src/lib/siteConfig.js`. Si ya existe para el fallback de feedback,
alinearla con `https://xalucatours.com`.

No cambiar credenciales de Resend, AssemblyAI, base de datos o almacenamiento.
El dominio de la web no cambia automáticamente el dominio remitente de email.
Las plantillas o broadcasts guardados directamente en Resend no se actualizan
por publicar este repositorio: deben revisarse antes de futuros envíos.

## Verificación tras desplegar frontend y backend

1. Confirmar que los dos servicios publicaron el mismo commit de esta actualización.
2. Comprobar HTTPS y respuesta 200 de la web y `/api/` de la API.
3. Revisar canonical, og:url, og:image y hreflang de home y una página de viaje.
4. Revisar `/sitemap.xml`, `/robots.txt` y recursos de descubrimiento.
5. Comprobar preflight CORS de contacto, planificación, newsletter y dictado desde
   el nuevo dominio; el dominio anterior debe seguir permitido y otros rechazados.
6. Consultar `/api/form-dictation/status` sin enviar ni grabar audio.
7. Hacer después un envío real controlado, autorizado por el propietario, para
   comprobar entrega del email, registro del lead y transcripción completa.
   Los tests locales usan dobles de servicios; no acreditan una entrega real.

## Pendiente fuera de este cambio

### Publicación de metadatos por ruta

Render necesita reglas específicas antes de `/* → /index.html` para servir el
HTML de cada URL sin barra final. El bloque marcado en `render.yaml` se genera
desde el registro de rutas y el blog, agrupando sus espacios de URLs públicos
(viajes, blog y páginas localizadas), sin mantener una segunda lista manual.

Al añadir rutas, ejecutar `cd frontend && npm run sync:render-routes` y versionar
el cambio de `render.yaml`. `prebuild` comprueba la sincronización. El Blueprint
de Xaluca Tours debe sincronizarse para aplicar estas reglas en Render.
No usar una reescritura general a `/*/index.html`: rompería rutas técnicas y
URLs no generadas. Se mantiene el fallback SPA fuera de los espacios públicos
agrupados y los redirects de campañas. Una URL inexistente dentro de los espacios
de viajes/blog/idiomas puede devolver 404 en vez de la Home: no se generan páginas
ni metadatos para URLs que no existen.

### Resto de la migración

- Redirección 301 por hostname de xalucatravel.com hacia xalucatours.com,
  conservando ruta y query. No añadir un redirect global `/*` en el mismo Static
  Site compartido: también afectaría al dominio nuevo y podría producir un bucle.
- Aprobar y activar por separado el mapa de rutas antiguas de la web sustituida:
  ver `README.md` y `url-map.draft.json` de esta carpeta. No redirigir sin revisar
  las equivalencias editoriales pendientes.
- Revisar Search Console, analytics, campañas, traducción externa y restricciones
  de dominio de integraciones en sus paneles; no se modifican con este commit.
- Mantener los registros de correo y los hosts de almacenamiento/CDN existentes.

Las referencias a xalucatravel.com en auditorías históricas, pruebas de
compatibilidad y allowlist CORS son intencionadas, no enlaces públicos nuevos.
