# Xaluca Tours — rastreo y descubrimiento para agentes

Revisión: 10 de septiembre de 2026. Dominio canónico: `https://xalucatravel.com`.

## Resultado y alcance

La primera fase se ha incorporado al commit `9ce7839c` y se ha subido a `main`. Tras el despliegue se ha comprobado en producción que `/robots.txt` responde HTTP 200 como texto y que la cabecera `Link` está presente. **No se han cambiado DNS, permisos ni credenciales.** La segunda revisión añade `/auth.md` como documento informativo; su publicación en producción queda pendiente de verificación después del despliegue.

La web sigue siendo una Static Site de Render con una API FastAPI independiente. La consulta para agentes es exclusivamente de lectura: no permite enviar solicitudes, suscribir contactos, reservar, pagar ni acceder a administración.

### Situación observada en producción antes del cambio

- `/robots.txt`: HTTP 404.
- `/sitemap.xml`: HTTP 200 pero `text/html`, con la aplicación en vez de XML.
- `/.well-known/api-catalog`: HTTP 200 pero `text/html`, no un catálogo JSON.
- API existente: `https://xaluca-tours-api.onrender.com/openapi.json` devuelve JSON; `/docs` devuelve documentación HTML; `GET /api/` devuelve `{"service":"Xaluca Tours","status":"ok"}`. El endpoint de salud no admite HEAD: usar GET para verificarlo.
- Los nameservers observados son `pdns1.registrar-servers.com` y `pdns2.registrar-servers.com`. No se observó un registro DS en la consulta realizada; esto no sustituye una auditoría completa de DNSSEC.

## Los 15 puntos del documento

| Punto | Estado en este cambio | Resultado / siguiente paso |
| --- | --- | --- |
| 1. `robots.txt` | Verificado en producción | HTTP 200 y texto real, reglas para páginas públicas, administración, API y favoritos. |
| 2. Sitemap | Implementado; pendiente de despliegue | 384 URLs canónicas ES/EN/FR, con alternativos hreflang. Se regenera antes de cada build. |
| 3. HTTP `Link` | Verificado en producción | La respuesta de `/robots.txt` contiene los tres recursos de descubrimiento configurados en `render.yaml`. |
| 4. DNS-AID y DNSSEC | Pendiente de infraestructura | No hay un servicio MCP/A2A que anunciar. Requiere confirmar un endpoint real, compatibilidad del proveedor y planificar DNSSEC. |
| 5. Negociación Markdown | Pendiente de arquitectura | Render Static Site no convierte la aplicación React según `Accept`. Los dos documentos Markdown publicados no equivalen a esta funcionalidad. |
| 6. Reglas explícitas para bots IA | Pendiente de decisión | Falta elegir la política: permitir búsqueda/respuestas, permitir entrenamiento o bloquear rastreadores IA. No se ha decidido por el propietario. |
| 7. Content Signals | Pendiente de la misma decisión | No se declaran permisos de uso nuevos sin esa elección. |
| 8. API catalog | Implementado; pendiente de despliegue | Linkset RFC 9727 hacia OpenAPI, documentación y salud de la API real. |
| 9. OAuth/OIDC discovery | No aplicable a la arquitectura actual | El login interno utiliza contraseña y token propio; no existe un authorization server OAuth/OIDC. |
| 10. OAuth protected resource | No aplicable actualmente | No se publican emisores o scopes inexistentes. |
| 11. `auth.md` para registro | Corrección de formato preparada; registro no disponible | `/auth.md` es Markdown y explica el acceso público sin credenciales. No implementa el protocolo de registro Auth.md ni se presenta como tal. |
| 12. MCP Server Card | No aplicable actualmente | WebMCP de navegador no es un servidor MCP remoto. No se anuncia un endpoint ficticio. |
| 13. Agent Skills | Implementado; pendiente de despliegue | Índice, guía pública de consulta y digest SHA-256 de sus bytes exactos. |
| 14. WebMCP | Implementado con detección de soporte | `xaluca_search_pages`: consulta títulos y URLs del mismo catálogo que `/nav`. Solo lectura. |
| 15. ARD | Implementado; pendiente de despliegue | Manifiesto JSON con recursos reales, consultas de ejemplo y CORS público limitado a ese manifiesto. |

**No se considera completada la lista de 15 requisitos.** Parte de los puntos necesita una decisión del propietario y otros no describen servicios que existan en esta web. No es correcto añadir metadatos ficticios para obtener una puntuación del comprobador.

## Recursos preparados

| Ruta | Tipo de contenido previsto |
| --- | --- |
| `/robots.txt` | `text/plain; charset=utf-8` |
| `/sitemap.xml` | `application/xml; charset=utf-8` |
| `/.well-known/api-catalog` | `application/linkset+json` |
| `/.well-known/agent-skills/index.json` | `application/json` |
| `/.well-known/agent-skills/explore-xaluca-trips/SKILL.md` | `text/markdown; charset=utf-8` |
| `/.well-known/ai-catalog.json` | `application/json` |
| `/docs/agents.md` | `text/markdown; charset=utf-8` |
| `/auth.md` | `text/markdown; charset=utf-8` |

La cabecera de descubrimiento es:

```http
Link: </.well-known/api-catalog>; rel="api-catalog"; type="application/linkset+json", </sitemap.xml>; rel="sitemap"; type="application/xml", </docs/agents.md>; rel="describedby"; type="text/markdown"
```

Solo `/.well-known/ai-catalog.json` recibe `Access-Control-Allow-Origin: *`. No se han ampliado las reglas CORS de la API, ni permisos de ningún formulario.

### Fuente única y URLs canónicas

- `frontend/src/lib/routes.js` sigue siendo el registro de rutas. Los slugs de artículos proceden de `POSTS` en `blog.js`.
- `frontend/scripts/generate-discovery.cjs` carga ese registro y genera los recursos. El sitemap no contiene administración, favoritos, enlaces antiguos de Fin de Año, parámetros de tracking o anchors.
- Se incluyen las tres versiones idiomáticas de las páginas. Las 384 URLs corresponden a 128 rutas de contenido por idioma, no a 384 programas diferentes.
- No se inventan fechas `lastmod`; solo deberían añadirse si existe una fecha real de modificación por página.
- `frontend/src/lib/siteConfig.js` fija el origen público usado por sitemap, búsqueda, canonical y Open Graph. Los metadatos ya no usan localhost ni el query string de contacto como canonical.
- El generador de HTML social reutiliza el mismo registro y normaliza `/en` y `/fr` igual que el sitemap. También genera las tres páginas de favoritos ya existentes, por lo que hay 387 HTML y 384 URLs indexables.
- Los archivos derivados están ignorados en Git; se crean con `npm start` y `npm run build`. La guía Markdown sí se versiona. No editar manualmente los archivos generados.

## WebMCP y seguridad

La API WebMCP continúa en desarrollo. La implementación detecta `document.modelContext` de la propuesta actual y también `navigator.modelContext` de versiones anteriores. Registra la herramienta con `registerTool`, añade una señal de cancelación y limpia la herramienta al desmontar el layout.

`xaluca_search_pages` acepta búsqueda, idioma, límite de 1–25 resultados y offset. Valida los parámetros en tiempo de ejecución. Devuelve únicamente nombre de página, tipo, categoría y URL pública. No realiza peticiones a endpoints de escritura ni lee cookies, formularios, favoritos, sesiones o registros de clientes.

Sin soporte de WebMCP, no se registra ninguna herramienta y la navegación normal permanece igual. Las pruebas automatizadas cubren las API simuladas actual/anterior, ausencia de soporte, errores y limpieza. Además, se ha comprobado el registro y ejecución real de la herramienta en el navegador integrado: la búsqueda de `/viajes/desierto_atlas/programa_4n_5d` devuelve su título y URL pública; la búsqueda de `/admin` devuelve cero resultados. Esto no implica compatibilidad universal con todos los navegadores.

Un catálogo OpenAPI describe endpoints ya publicados; **no concede permiso para utilizarlos ni reemplaza su autenticación**. `robots.txt` tampoco es un control de acceso.

La guía pública se ha redactado con `skill-creator`, limitada a descubrimiento de viajes. Su validador Python no pudo ejecutarse porque falta PyYAML; las pruebas del proyecto verifican el frontmatter con su parser YAML, el nombre, la descripción, la ausencia de placeholders y el digest exacto.

## Decisiones pendientes antes de ampliar el alcance

### Política de IA

Elegir expresamente qué usos permite Xaluca Tours. Después se podrán añadir los grupos de user-agent correspondientes y `Content-Signal` coherentes con esa decisión. Las directivas son preferencias de rastreo/uso, no garantías de cumplimiento por terceros. Por ahora se mantiene el grupo general de rastreo de las páginas públicas, sin declarar una política nueva sobre entrenamiento.

### DNS-AID

No cambiar nameservers ni crear registros hacia endpoints inexistentes. Primero hay que disponer del servicio que se desea anunciar, revisar la especificación vigente y comprobar si el DNS contratado permite los registros necesarios. Activar DNSSEC requiere coordinar la firma de la zona y el DS del registrador; una configuración inconsistente puede dejar el dominio sin resolución para validadores.

El encabezado `server: cloudflare` que devuelve Render no demuestra que Xaluca Tours tenga su zona en una cuenta propia de Cloudflare ni acceso a sus ajustes de Markdown o AI Crawl Control.

**Comprobación adicional:** el catálogo oficial de tipos de registro de Namecheap PremiumDNS no incluye SVCB ni HTTPS. No se debe introducir su sintaxis en un campo A, CNAME o SRV: no son equivalentes. Confirmar compatibilidad con el proveedor o planificar un DNS compatible antes de preparar registros definitivos. DNS-AID sigue siendo un Internet-Draft, no un estándar RFC publicado.

DNSSEC sí se puede gestionar desde Namecheap para dominios allí registrados que utilicen BasicDNS/PremiumDNS: **Domain List → Manage → Advanced DNS → DNSSEC**. Namecheap gestiona los valores automáticamente. Tras activarlo, verificar DS, DNSKEY y validación con un resolver independiente; no basta con que el interruptor aparezca activado. Esta opción no exige trasladar la web de Render. No se ha activado desde esta sesión.

### Markdown por negociación

Alternativas a valorar: un proxy/edge controlado por Xaluca Tours o un despliegue con renderizado de contenido en servidor. Debe devolver el contenido real de cada itinerario, `Content-Type: text/markdown`, `Vary: Accept` y HTML por defecto. Convertir únicamente el HTML inicial vacío de una SPA no cubre el contenido del viaje. No se han cambiado DNS, proxy ni hosting para habilitarlo.

La función gestionada Markdown for Agents está documentada para planes Cloudflare Pro, Business, Enterprise y clientes SSL for SaaS. No se ha confirmado que Xaluca Tours tenga una zona/configuración elegible. La búsqueda de integraciones no encontró un conector disponible para gestionar Namecheap, Render o Cloudflare; tampoco está disponible aquí el buscador de plugins de `plugin-management`. No se ha instalado ningún proveedor ni contratado ningún plan.

### Autenticación de agentes y MCP remoto

Si se quiere esta capacidad en el futuro, hace falta definir proveedor OAuth, scopes mínimos, consentimiento, revocación y los endpoints reales antes de publicar metadata. No basta con crear archivos JSON. Debe tratarse como un proyecto separado, sin exponer la contraseña del administrador a agentes.

## Despliegue y verificación

1. Tras subir la segunda revisión, comprobar su despliegue siguiendo los pasos siguientes. No confundir la corrección de formato de `/auth.md` con habilitar registro de agentes.
2. En **xaluca-tours-web**, mantener `npm run build` y directorio publicado `build`.
3. Si el servicio está gestionado por Blueprint, sincronizar `render.yaml`. Si se creó manualmente, copiar las entradas de `headers` a Settings → Headers. Hacer push por sí solo no garantiza que un servicio manual aplique la configuración YAML.
4. Desplegar el build. Los archivos físicos deben servirse antes de la reescritura SPA a `/index.html`.
5. Verificar mediante GET, no solo que exista HTTP 200:

```sh
curl -sS -D - https://xalucatravel.com/robots.txt
curl -sS -D - https://xalucatravel.com/sitemap.xml
curl -sS -D - https://xalucatravel.com/.well-known/api-catalog
curl -sS -D - https://xalucatravel.com/.well-known/agent-skills/index.json
curl -sS -D - https://xalucatravel.com/.well-known/ai-catalog.json
curl -sS -D - https://xalucatravel.com/auth.md
curl -sS -I https://xalucatravel.com/
```

6. Confirmar formatos XML/JSON/Markdown, tipos MIME, cabecera Link, digest de la guía y enlaces canónicos. Abrir también una página de viaje y un artículo para comprobar que siguen funcionando.
7. Enviar el sitemap a Search Console si procede. La publicación no garantiza indexación ni reconocimiento por todos los agentes.

Para revertir, restaurar los cambios de código y retirar únicamente las cabeceras nuevas del servicio estático. No hay migraciones de datos ni cambios DNS que deshacer.

## Pruebas locales

- Generación automática de sitemap, XML válido, cobertura del registro completo, deduplicación y hreflang.
- API catalog, ARD, tipos MIME y correspondencia de cabeceras entre Render y desarrollo.
- SHA-256 y formato de la skill.
- Consulta WebMCP por idioma, paginación, validación de parámetros y exclusión de páginas personales/restringidas.
- Canonical/Open Graph con el origen público y sin query/hash.
- Suite completa tras la segunda revisión: **20 suites y 235 pruebas superadas**.
- Build de producción correcto; permanecen avisos anteriores sobre tamaño del bundle, utilidades ambiguas de Tailwind y plugin de ESLint del build. No equivalen a una nueva validación de lint sin avisos.
- Verificación de los **384 canonical** en los HTML generados y de los **7 archivos de descubrimiento** copiados al build.
- Los siete recursos responden en `127.0.0.1:3100` con HTTP 200, su tipo MIME y cabecera Link esperados.
- Home y página específica de Marrakech → Fez comprobadas en navegador; consulta WebMCP ejecutada sin enviar formularios.
- Segunda revisión: `/auth.md` devuelve HTTP 200 y `text/markdown` en el servidor local, está incluido en el build y contiene el estado real de acceso. Su respuesta en producción está pendiente de verificación.

## Referencias utilizadas

- [Reglas robots, RFC 9309](https://www.rfc-editor.org/rfc/rfc9309) y [protocolo Sitemap](https://www.sitemaps.org/protocol.html).
- [Catálogo API, RFC 9727](https://www.rfc-editor.org/rfc/rfc9727).
- [Render: archivos y rewrites](https://render.com/docs/redirects-rewrites), [cabeceras de Static Sites](https://render.com/docs/static-site-headers) y [Blueprint](https://render.com/docs/blueprint-spec).
- [WebMCP, propuesta vigente](https://webmachinelearning.github.io/webmcp/) y [programa preliminar de Chrome](https://developer.chrome.com/blog/webmcp-epp).
- [Markdown for Agents de Cloudflare](https://developers.cloudflare.com/fundamentals/reference/markdown-for-agents/).
- Guías aportadas en el documento y aplicadas: [robots](https://isitagentready.com/.well-known/agent-skills/robots-txt/SKILL.md), [sitemap](https://isitagentready.com/.well-known/agent-skills/sitemap/SKILL.md), [Link](https://isitagentready.com/.well-known/agent-skills/link-headers/SKILL.md), [API catalog](https://isitagentready.com/.well-known/agent-skills/api-catalog/SKILL.md), [Agent Skills](https://isitagentready.com/.well-known/agent-skills/agent-skills/SKILL.md), [WebMCP](https://isitagentready.com/.well-known/agent-skills/webmcp/SKILL.md) y [ARD](https://isitagentready.com/.well-known/agent-skills/ard/SKILL.md).
- Segunda revisión: [guía Auth.md](https://isitagentready.com/.well-known/agent-skills/auth-md/SKILL.md) y [protocolo Auth.md](https://workos.com/auth-md); se aplica la representación Markdown sin inventar registro. La guía [Content Signals](https://isitagentready.com/.well-known/agent-skills/content-signals/SKILL.md) requiere la elección de política consultada al propietario. Las guías [DNS-AID](https://isitagentready.com/.well-known/agent-skills/dns-aid/SKILL.md), [Markdown](https://isitagentready.com/.well-known/agent-skills/markdown-negotiation/SKILL.md), [OAuth discovery](https://isitagentready.com/.well-known/agent-skills/oauth-discovery/SKILL.md), [protected resource](https://isitagentready.com/.well-known/agent-skills/oauth-protected-resource/SKILL.md) y [MCP card](https://isitagentready.com/.well-known/agent-skills/mcp-server-card/SKILL.md) determinan los prerrequisitos pendientes; no se han implementado esos servicios.
- [Namecheap PremiumDNS: tipos de registro](https://www.namecheap.com/support/knowledgebase/article.aspx/9654/2231/what-is-premiumdns/) y [activar DNSSEC](https://www.namecheap.com/support/knowledgebase/article.aspx/9723/2232/managing-dnssec-for-domains-pointed-to-premium-or-basicdns/).
- [DNS-AID, borrador vigente](https://datatracker.ietf.org/doc/draft-mozleywilliams-dnsop-dnsaid/), [OAuth authorization-server metadata](https://www.rfc-editor.org/rfc/rfc8414) y [OAuth protected-resource metadata](https://www.rfc-editor.org/rfc/rfc9728).
