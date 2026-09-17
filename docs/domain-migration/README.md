# Migración a xalucatours.com — mapa preliminar de URLs

Fecha: 15 de septiembre de 2026. Base del proyecto: commit `46d45c31`.

**Borrador de auditoría. No se ha activado ninguna redirección ni cambiado DNS, rutas, canonical o contenido de la aplicación.**

## Fuentes y alcance

- [Sitemap de la web antigua](https://xalucatours.com/sitemap.xml), consultado por HTTP.
- Lista de 150 URLs aportada por el usuario: coincide exactamente con el sitemap antiguo en esta revisión, sin duplicados.
- [Sitemap del proyecto actual](https://xalucatravel.com/sitemap.xml): 384 URLs públicas, 128 en español. Las 128 rutas españolas del generador local están en el sitemap publicado.
- Registro `frontend/src/lib/routes.js`, componentes `routeComponents.js`, artículos de `blog.js`, resolución en `App.js` y reglas de `render.yaml`.
- Se han consultado las 62 URLs antiguas sin path exacto más /info: 63 respuestas HTTP 200. Se han revisado títulos, encabezados y descripciones; el cuerpo de /info y /mapa también se ha inspeccionado.
- No es una auditoría completa del contenido de los 150 documentos ni de todas las imágenes/descargas. Los títulos SEO antiguos presentan errores en varias páginas de viaje, por lo que los candidatos deben contrastarse con sus programas completos.

El [inventario JSON](./url-map.draft.json) contiene una entrada por cada una de las 150 URLs, su estado, destino candidato, URL de revisión en xalucatravel.com y motivo. [Copia de la lista original](./legacy-sitemap-2026-09-15.txt).

## Resultado

| Estado | URLs | Tratamiento previsto |
|---|---:|---|
| Mismo path y componente, sin conflicto semántico detectado | 86 | Conservar path y servir 200 al sustituir Tilda por Render. La coincidencia de ruta no acredita identidad de contenido. |
| Nuevas propuestas de 301 | 21 | 19 cambios de slug de programas, una diferencia de mayúsculas y una consolidación editorial. Pendientes de aprobación. |
| 301 ya configurado en el proyecto | 1 | /findeano2025 → /findeano2026. No extender a sus subpáginas. |
| Sin equivalente acreditado | 40 | Decisión editorial: recuperar, consolidar con equivalencia real o retirar. |
| Colisión de intención | 1 | /info existe en ambas webs, pero cumple funciones distintas. |
| Ruta registrada sin página específica asignada | 1 | Errachidia → Atlas → Fez, 5 noches / 6 días: el router muestra una plantilla provisional. |
| **Total** | **150** | **88 paths exactos = 86 con componente + /info + una ruta incompleta.** |

## No confundir los dos movimientos

1. **Sustitución de la web antigua de xalucatours.com**: las URLs que conserven path no necesitan redirigirse a sí mismas. Se servirá la nueva página en ese mismo dominio y path. Para los slugs antiguos distintos, aplicar únicamente los 301 aprobados.
2. **Traslado desde xalucatravel.com a xalucatours.com**: redirección por dominio, conservando rutas y parámetros necesarios, con excepciones expresas si cambian páginas como /info. Debe atender también www y HTTP. No es un cambio DNS que por sí solo produzca redirecciones HTTP.

La URL final de los candidatos de la tabla es `https://xalucatours.com` + destino. Para revisarlos antes del cambio, usar los enlaces de la columna Destino, que apuntan al proyecto publicado en xalucatravel.com.

## 301 candidatos y regla existente

| Origen antiguo (path) | Destino en el proyecto actual | Estado |
|---|---|---|
| `/que-ver-en-marruecos` | [/que-ver-en-Marruecos](https://xalucatravel.com/que-ver-en-Marruecos) | Propuesta, no aplicada |
| `/mejorepoca` | [/cuando-viajar](https://xalucatravel.com/cuando-viajar) | Propuesta, no aplicada |
| `/viajes/norte/ciudadesimperiales/programa_4n_5d` | [/viajes/norte/ciudades_imperiales/programa_4n_5d](https://xalucatravel.com/viajes/norte/ciudades_imperiales/programa_4n_5d) | Propuesta, no aplicada |
| `/viajes/norte/ciudadesimperiales/programa_6n_7d` | [/viajes/norte/ciudades_imperiales/programa_6n_7d](https://xalucatravel.com/viajes/norte/ciudades_imperiales/programa_6n_7d) | Propuesta, no aplicada |
| `/viajes/escapadas/fez_sidiali/programa_3n4d` | [/viajes/escapadas/fez_sidiali/programa_3n_4d](https://xalucatravel.com/viajes/escapadas/fez_sidiali/programa_3n_4d) | Propuesta, no aplicada |
| `/viajes/escapadas/fez_sidiali/programa_4n5d` | [/viajes/escapadas/fez_sidiali/programa_4n_5d](https://xalucatravel.com/viajes/escapadas/fez_sidiali/programa_4n_5d) | Propuesta, no aplicada |
| `/fez_sidiali_marrakech/programa_7n_8d` | [/viajes/gransur/fez_sidiali_marrakech/programa_7n_8d](https://xalucatravel.com/viajes/gransur/fez_sidiali_marrakech/programa_7n_8d) | Propuesta, no aplicada |
| `/fez_sidiali_marrakech/programa_8n_9d` | [/viajes/gransur/fez_sidiali_marrakech/programa_8n_9d](https://xalucatravel.com/viajes/gransur/fez_sidiali_marrakech/programa_8n_9d) | Propuesta, no aplicada |
| `/fez_sidiali_marrakech/programa_9n_10d` | [/viajes/gransur/fez_sidiali_marrakech/programa_9n_10d](https://xalucatravel.com/viajes/gransur/fez_sidiali_marrakech/programa_9n_10d) | Propuesta, no aplicada |
| `/fez_sidiali_ozz/programa_5n_6d` | [/viajes/gransur/fez_sidiali_ozz/programa_5n_6d](https://xalucatravel.com/viajes/gransur/fez_sidiali_ozz/programa_5n_6d) | Propuesta, no aplicada |
| `/fez_sidiali_ozz/programa_6n_7d` | [/viajes/gransur/fez_sidiali_ozz/programa_6n_7d](https://xalucatravel.com/viajes/gransur/fez_sidiali_ozz/programa_6n_7d) | Propuesta, no aplicada |
| `/fez_sidiali_ouarzazate/programa_7n_8d` | [/viajes/gransur/fez_sidiali_ouarzazate/programa_7n_8d](https://xalucatravel.com/viajes/gransur/fez_sidiali_ouarzazate/programa_7n_8d) | Propuesta, no aplicada |
| `/ozz_sidiali_fez/programa_5n_6d` | [/viajes/gransur/ozz_sidiali_fez/programa_5n_6d](https://xalucatravel.com/viajes/gransur/ozz_sidiali_fez/programa_5n_6d) | Propuesta, no aplicada |
| `/ozz_sidiali_fez/programa_6n_7d` | [/viajes/gransur/ozz_sidiali_fez/programa_6n_7d](https://xalucatravel.com/viajes/gransur/ozz_sidiali_fez/programa_6n_7d) | Propuesta, no aplicada |
| `/ozz_sidiali_fez/programa_7n8d` | [/viajes/gransur/ozz_sidiali_fez/programa_7n_8d](https://xalucatravel.com/viajes/gransur/ozz_sidiali_fez/programa_7n_8d) | Propuesta, no aplicada |
| `/marrakech_sidiali_fez/programa_7n_8d` | [/viajes/gransur/marrakech_sidiali_fez/programa_7n_8d](https://xalucatravel.com/viajes/gransur/marrakech_sidiali_fez/programa_7n_8d) | Propuesta, no aplicada |
| `/marrakech_sidiali_fez/programa_8n_9d` | [/viajes/gransur/marrakech_sidiali_fez/programa_8n_9d](https://xalucatravel.com/viajes/gransur/marrakech_sidiali_fez/programa_8n_9d) | Propuesta, no aplicada |
| `/marrakech_sidiali_fez/programa_9n_10d` | [/viajes/gransur/marrakech_sidiali_fez/programa_9n_10d](https://xalucatravel.com/viajes/gransur/marrakech_sidiali_fez/programa_9n_10d) | Propuesta, no aplicada |
| `/marrakech_ergchebbi_marrakech/programa_2n_3d` | [/viajes/marrakech_ergchebbi_marrakech/programa_2n_3d](https://xalucatravel.com/viajes/marrakech_ergchebbi_marrakech/programa_2n_3d) | Propuesta, no aplicada |
| `/marrakech_ergchebbi_marrakech/programa_3n_4d` | [/viajes/marrakech_ergchebbi_marrakech/programa_3n_4d](https://xalucatravel.com/viajes/marrakech_ergchebbi_marrakech/programa_3n_4d) | Propuesta, no aplicada |
| `/marrakech_ergchebbi_marrakech/programa_4n_5d` | [/viajes/marrakech_ergchebbi_marrakech/programa_4n_5d](https://xalucatravel.com/viajes/marrakech_ergchebbi_marrakech/programa_4n_5d) | Propuesta, no aplicada |
| `/findeano2025` | [/findeano2026](https://xalucatravel.com/findeano2026) | Ya configurado en el proyecto |

Los grupos Fez/Sidi Ali/Ouarzazate y Ouarzazate/Sidi Ali/Fez contienen metadatos antiguos que mencionan Marrakech o duraciones inconsistentes. Los candidatos se apoyan en la familia de URL y los encabezados, pero antes de activarlos hay que comparar los días del itinerario. No generar reglas basadas únicamente en similitud textual.

## Decisión prioritaria: /info

- La antigua [xalucatours.com/info](https://xalucatours.com/info) contiene un formulario de solicitud de viaje.
- La actual [xalucatravel.com/info](https://xalucatravel.com/info) contiene recomendaciones para preparar la maleta, agrupadas por itinerario.
- Una igualdad literal de URL no significa equivalencia de intención.
- **No aplicar** una regla global `/info → /planifica-tu-viaje`: eliminaría el acceso al hub actual si permanece en /info.
- Decidir entre conservar el hub en /info incorporando una vía clara de solicitud, o reservar /info para el formulario antiguo y trasladar el hub a un nuevo slug aprobado.
- En la segunda opción, los enlaces antiguos de xalucatravel.com/info necesitarían una excepción por hostname hacia el nuevo hub. Las URLs antiguas de xalucatours.com/info conservarían la intención de solicitud.
- No se ha elegido ninguna opción ni creado ninguna ruta nueva.

## URLs pendientes de decisión editorial

| Path antiguo | Tratamiento recomendado antes de migrar |
|---|---|
| `/gracias` | Antigua confirmación de solicitud. El proyecto usa un modal tras éxito real; no crear una URL que confirme un envío solo por visitarla. Revisar conversiones y campañas. |
| `/razones` | Razones para viajar a Marruecos, no razones para elegir Xaluca. Valorar conservar /razones o integrar el contenido en /marruecos antes de redirigir. |
| `/webinar/agencias/es` | Contenido B2B sin página equivalente acreditada. Decidir recuperar la página o archivar el webinar; conservar el idioma portugués en /pt. |
| `/webinar/agencias/pt` | Contenido B2B sin página equivalente acreditada. Decidir recuperar la página o archivar el webinar; conservar el idioma portugués en /pt. |
| `/legal` | No hay ruta /legal en el registro actual. Recuperar/revisar el contenido legal en una página accesible; no redirigir a la home. |
| `/traildescedres` | Contenido del Trail des Cèdres 2025. No equiparar automáticamente a Enduro ni a Titan Desert. Decidir conservar archivo/evento. |
| `/mapa` | La página incluye una guía territorial del sur y un recurso de mapa; no equivale a /nav. Evaluar recuperación del contenido y del mapa. |
| `/findeano2025/dia1` | Material de la edición 2025 (días, cuaderno o audioguía). Conservar como archivo si sigue siendo útil; no atribuirlo automáticamente al programa 2026. |
| `/findeano2025/dia2` | Material de la edición 2025 (días, cuaderno o audioguía). Conservar como archivo si sigue siendo útil; no atribuirlo automáticamente al programa 2026. |
| `/findeano2025/dia3` | Material de la edición 2025 (días, cuaderno o audioguía). Conservar como archivo si sigue siendo útil; no atribuirlo automáticamente al programa 2026. |
| `/findeano2025/dia4` | Material de la edición 2025 (días, cuaderno o audioguía). Conservar como archivo si sigue siendo útil; no atribuirlo automáticamente al programa 2026. |
| `/findeano2025/dia5` | Material de la edición 2025 (días, cuaderno o audioguía). Conservar como archivo si sigue siendo útil; no atribuirlo automáticamente al programa 2026. |
| `/findeano2025/dia6` | Material de la edición 2025 (días, cuaderno o audioguía). Conservar como archivo si sigue siendo útil; no atribuirlo automáticamente al programa 2026. |
| `/findeano2025/dia6/vueloregular` | Material de la edición 2025 (días, cuaderno o audioguía). Conservar como archivo si sigue siendo útil; no atribuirlo automáticamente al programa 2026. |
| `/findeano2025/cuaderno` | Material de la edición 2025 (días, cuaderno o audioguía). Conservar como archivo si sigue siendo útil; no atribuirlo automáticamente al programa 2026. |
| `/findeano2025/audioguia` | Material de la edición 2025 (días, cuaderno o audioguía). Conservar como archivo si sigue siendo útil; no atribuirlo automáticamente al programa 2026. |
| `/puente_pilar_marruecos` | Campaña/salida con fechas propias. Revisar archivo, continuidad del evento o recuperación; /proximas_salidas no es equivalente automático a un programa detallado. |
| `/puente_purisima_marruecos` | Campaña/salida con fechas propias. Revisar archivo, continuidad del evento o recuperación; /proximas_salidas no es equivalente automático a un programa detallado. |
| `/findeano2023` | Campaña de Fin de Año antigua. Valorar archivo o consolidación en una página de evento vigente; no cambiar años sin aprobar la equivalencia. |
| `/findeano2022-2` | Campaña de Fin de Año antigua. Valorar archivo o consolidación en una página de evento vigente; no cambiar años sin aprobar la equivalencia. |
| `/verano` | Campaña/salida con fechas propias. Revisar archivo, continuidad del evento o recuperación; /proximas_salidas no es equivalente automático a un programa detallado. |
| `/page43278690.html` | Campaña/salida con fechas propias. Revisar archivo, continuidad del evento o recuperación; /proximas_salidas no es equivalente automático a un programa detallado. |
| `/page43287443.html` | Campaña/salida con fechas propias. Revisar archivo, continuidad del evento o recuperación; /proximas_salidas no es equivalente automático a un programa detallado. |
| `/page43287461.html` | Campaña/salida con fechas propias. Revisar archivo, continuidad del evento o recuperación; /proximas_salidas no es equivalente automático a un programa detallado. |
| `/viajes-verano-marruecos-25-31-agosto-2024` | Campaña/salida con fechas propias. Revisar archivo, continuidad del evento o recuperación; /proximas_salidas no es equivalente automático a un programa detallado. |
| `/findeano` | Campaña de Fin de Año antigua. Valorar archivo o consolidación en una página de evento vigente; no cambiar años sin aprobar la equivalencia. |
| `/senegal` | Salida antigua a Senegal, sin producto equivalente en el catálogo actual de Marruecos. No redirigir a un viaje de otro país; decidir archivo o 410 si se retira definitivamente. |
| `/page67653597.html` | Contenido del Trail des Cèdres 2025. No equiparar automáticamente a Enduro ni a Titan Desert. Decidir conservar archivo/evento. |
| `/verano2026` | Campaña/salida con fechas propias. Revisar archivo, continuidad del evento o recuperación; /proximas_salidas no es equivalente automático a un programa detallado. |
| `/viajes-verano-marruecos-10-19-agosto-2026` | Campaña/salida con fechas propias. Revisar archivo, continuidad del evento o recuperación; /proximas_salidas no es equivalente automático a un programa detallado. |
| `/viajes-verano-marruecos-1-9-agosto-2026` | Campaña/salida con fechas propias. Revisar archivo, continuidad del evento o recuperación; /proximas_salidas no es equivalente automático a un programa detallado. |
| `/viajes-verano-marruecos-20-28-agosto-2026` | Campaña/salida con fechas propias. Revisar archivo, continuidad del evento o recuperación; /proximas_salidas no es equivalente automático a un programa detallado. |
| `/semanasanta` | Campaña/salida con fechas propias. Revisar archivo, continuidad del evento o recuperación; /proximas_salidas no es equivalente automático a un programa detallado. |
| `/blog/ramadan` | Artículo antiguo no presente entre los seis artículos actuales. Priorizar recuperar la URL/contenido; una categoría de blog o artículo de tema próximo no prueba equivalencia. |
| `/blog/gastronomia` | Artículo antiguo no presente entre los seis artículos actuales. Priorizar recuperar la URL/contenido; una categoría de blog o artículo de tema próximo no prueba equivalencia. /blog/que-comer-sur-marruecos es candidato relacionado, pero de alcance más limitado: comparar o ampliar antes de aprobar un 301. |
| `/blog/lenguasdemarruecos` | Artículo antiguo no presente entre los seis artículos actuales. Priorizar recuperar la URL/contenido; una categoría de blog o artículo de tema próximo no prueba equivalencia. |
| `/blog/marrakech` | Artículo antiguo no presente entre los seis artículos actuales. Priorizar recuperar la URL/contenido; una categoría de blog o artículo de tema próximo no prueba equivalencia. |
| `/viajaramarruecos` | Índice editorial/informativo antiguo. /blog puede ser candidato solo tras verificar la conservación de los artículos y de su intención. |
| `/blog/vivelaculturaylatradicinenlospueblosescondidosdelsurdemarruecos` | Artículo antiguo no presente entre los seis artículos actuales. Priorizar recuperar la URL/contenido; una categoría de blog o artículo de tema próximo no prueba equivalencia. |
| `/agencias` | Contenido B2B sin página equivalente acreditada. Decidir recuperar la página o archivar el webinar; conservar el idioma portugués en /pt. |

### Prioridades de conservación

1. **/legal**: recuperar el contenido legal aprobado en una página accesible y revisar los enlaces de consentimiento. No sustituir por la home. El inventario de rutas actual no contiene /legal.
2. **/agencias** y **/webinar/agencias/es**, **/webinar/agencias/pt**: decidir continuidad B2B y archivo de webinars. El proyecto no tiene portugués; no enviar automáticamente una URL portuguesa a una página española.
3. **Artículos antiguos**: recuperar los cinco artículos existentes antes de considerar su retirada. El nuevo blog contiene seis artículos con otros slugs, no son copias migradas del blog antiguo.
4. **/mapa**, **/razones** y **/viajaramarruecos**: evaluar contenido útil para conservar o integrar. /mapa no es un índice de navegación y /razones habla del destino Marruecos, no solo de la marca Xaluca.
5. **Campañas y cuadernos**: clasificar por continuidad, archivo o retirada definitiva. No cambiar el año de las subpáginas para aparentar que pertenecen a la edición 2026. Revisar enlaces existentes enviados a viajeros.

Si una página se retira definitivamente y no hay sustituto equivalente, valorar **410**; para una URL inexistente, **404**. No hay ninguna retirada aprobada ni implementada en este inventario. Si el contenido mantiene utilidad o tráfico, priorizar su conservación o una consolidación genuina.

## Hallazgos técnicos antes del cambio

- **Programa incompleto:** `/viajes/errachidia-atlas-fez/programa_5n_6d` existe en `routes.js` como `tourErrAtlasFez56` y en el sitemap, pero no está en `ROUTE_COMPONENTS`; `App.js` cae en `StubPage`. Completar o asignar el programa correcto antes del cambio. El itinerario inverso Fez → Errachidia no es un sustituto automático.
- `App.js` envía las rutas desconocidas a la home mediante React `Navigate`. No es un 301 de servidor y puede ocultar URLs perdidas.
- `BlogPage.jsx` muestra un texto 404 para slugs inexistentes, pero eso no establece un HTTP 404. El rewrite SPA de Render puede seguir devolviendo HTTP 200.
- Preparar un tratamiento real de 404/410 en la capa que responda HTTP. No considerar una respuesta 200 suficiente para afirmar que una página existe: contrastar ruta, componente y contenido.
- `render.yaml` ya contiene /findeano2025 → /findeano2026; actualmente la web antigua de Tilda sigue sirviendo /findeano2025 con 200. La regla se encuentra en el proyecto nuevo, no en el hosting antiguo.
- Las reglas estáticas de Render se comparan por path y los archivos físicos tienen prioridad. Para el cambio de dominio se necesita una solución que distinga hostname, evitando bucles y que los HTML pre-generados impidan redirecciones esperadas.
- Mantener el slug canónico actual `/que-ver-en-Marruecos` si se adopta el candidato de esta tabla; no cambiar además a minúsculas sin actualizar registro, enlaces y canonical.
- No usar redirecciones comodín por familia hasta revisar las excepciones y los casos con contenido ya existente.

## Comprobaciones de publicación (pendientes)

1. Aprobar destinos propuestos, resolver las 41 decisiones editoriales (40 sin equivalente + /info) y completar el programa Errachidia → Atlas → Fez.
2. Completar inventario con Search Console, enlaces entrantes, campañas, PDFs, imágenes, audios y logs: un sitemap no enumera necesariamente todas las URLs usadas.
3. Inventariar en.xalucatours.com y fr.xalucatours.com de Linguise por separado y mapear sus slugs a /en y /fr; no basta con anteponer un prefijo.
4. Conservar snapshot de DNS y copia recuperable de Tilda antes de sustituir el hosting. La discrepancia de zona DNS detectada en la auditoría previa sigue pendiente de aclaración.
5. Resolver previamente CORS para el nuevo origen y actualizar canonical, hreflang, sitemap, OG y enlaces de emails. No se han modificado aquí.
6. Probar cada 301 por HTTP sin JavaScript: código 301, Location final, destino 200 con contenido correcto, sin bucles ni cadenas. Verificar trailing slash, query strings y enlaces con fragmentos.
7. Probar 404/410 reales, enlaces legales, formulario de contacto, newsletter y enlaces de emails. No enviar mensajes de prueba sin autorización.
8. Actualizar Search Console y conservar redirecciones al menos un año; mantener el dominio antiguo renovado y HTTPS operativo.
9. No retirar la web antigua ni activar reglas masivas hasta completar la revisión editorial y técnica.

## Referencias

- [Guía de Google: mapa de equivalencias, redirecciones permanentes y URLs sin sustituto](https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes).
- [Render: coincidencia por path y prioridad de recursos físicos](https://render.com/docs/redirects-rewrites).

La recomendación es conservar contenido útil y redirigir solo a equivalentes reales, no enviar todas las páginas ausentes a la home.
