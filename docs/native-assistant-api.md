# Asistente nativo: API y límites

El asistente es un flujo guiado de botones, sin preguntas libres ni dictado. Recupera fragmentos literales de `backend/assistant_knowledge.json`, generado desde contenido del proyecto. No usa un modelo generativo, no busca en Internet y no acepta fuentes ni enlaces del visitante. Las respuestas usan textos de interfaz fijos por idioma y tarjetas con extractos y enlaces internos. El corpus publicado es una instantánea: los cambios de contenido requieren regenerarlo y volver a publicar la API.

## Identificación y CRM

- `GET /api/assistant/status` devuelve únicamente `{ "available": true|false }`.
- `POST /api/assistant/session` requiere nombre completo, email válido, teléfono internacional, `privacy_consent: true`, idioma `es|en|fr` y `submission_id` UUID. `preferred_contact` admite `['email', 'phone']` (predeterminado) o `['email']`; el teléfono sigue siendo obligatorio.
- Los metadatos de origen usan el contrato `LeadCapture` existente. La API impone `capture_type: 'assistant'` y crea el registro idempotente en `contact_requests`, visible como **Asistente virtual** en el administrador. No hay tablas ni migraciones nuevas.
- Identificarse no envía una consulta humana, un email de confirmación, una notificación interna ni una suscripción comercial. La nota guardada lo indica expresamente. La derivación a Contacto necesita una solicitud explícita adicional en el flujo habitual.
- La respuesta contiene `token` y `expires_at` (fecha ISO). El token contiene únicamente UUID del lead y caducidad; no incluye nombre, email, teléfono ni conversación. La firma está separada criptográficamente de la administración.

Esta identificación registra los datos declarados; **no verifica la titularidad** del email o teléfono. No permite acceder a los datos del lead ni a otras funciones privadas.

## Selecciones guiadas y fuentes

`POST /api/assistant/guide` requiere `Authorization: Bearer <token>` y un objeto JSON estricto:

```json
{
  "language": "es",
  "topic": "trips",
  "duration": 3,
  "program_id": "es:tourEnduroAventura34:overview:1",
  "section": "itinerary",
  "page": 1
}
```

- `language` es obligatorio: `es|en|fr`. Los demás campos son opcionales.
- `topic`: `trips|practical|contact|human`. Sin tema se muestran estas cuatro opciones.
- `duration`: número entero de noches; omitido o `null` muestra las duraciones publicadas, con su etiqueta literal de noches/días. `0` significa «Ver todos / Sin preferencia». No admite cadenas numéricas, booleanos ni decimales.
- `program_id`: ID del documento `overview:1` del mismo idioma. Solo se admiten programas presentes en el corpus; nunca IDs recibidos como URLs ni variantes inventadas. Omitido o `null` muestra la lista de programas de esa duración, de ocho en ocho.
- `section`: `overview|itinerary|includes|excludes|practical`. Un programa bajo `trips` muestra únicamente secciones con fuentes. Bajo `practical` muestra directamente sus documentos `notes` y `packing`; no admite otras secciones.
- `page`: entero positivo, predeterminado `1`. Las páginas fuera de rango y las combinaciones incompatibles se rechazan. No se acepta `section` sin programa, programa sin duración ni filtros de programa para `contact|human`.

El índice se deriva de los documentos de resumen localizados del corpus: 66 programas por idioma, incluidas únicamente las dos variantes Enduro realmente publicadas (3 y 4 noches). No se añade oferta comercial mediante reglas o etiquetas.

La respuesta es:

```text
{
  title, description?,
  options: [{ id, label, selection }],
  sources: [{ id, title, path, excerpt }],
  selection,
  pagination?: { page, pages, previous: selection|null, next: selection|null },
  handoff
}
```

Cada `selection` de opción o paginación es una solicitud completa para reenviar sin mezclarla con selecciones anteriores. La selección normalizada siempre incluye idioma y página y omite los campos nulos. El servidor no guarda historial; la interfaz gestiona Volver y Reiniciar localmente.

Las páginas de contenido incluyen hasta tres extractos, cada uno literal y de un máximo de 700 caracteres. Los documentos largos se dividen en límites de frase o línea cuando es posible, sin reescribir ni eliminar contenido: la paginación permite recorrer todas sus partes. Un mismo ID de fuente puede aparecer varias veces; las claves de renderizado deben incluir página/índice además del ID. Los enlaces son únicamente rutas internas validadas del corpus. Cada idioma consulta solamente documentos en ese idioma.

`contact` devuelve las fuentes literales de contacto. `human` devuelve exclusivamente un texto fijo de derivación (`handoff: true`) y ninguna fuente, sin enviar consultas ni notificaciones. Las consultas de fechas, precios o peticiones personales se dirigen al botón permanente de contacto de la interfaz; no existe entrada libre para ellas.

`POST /api/assistant/messages` está retirado: responde siempre `410` con código `guided_only`, sin leer, validar, persistir ni procesar su cuerpo. Los campos `message`, `question`, audio, contexto libre y cualquier campo adicional tampoco están admitidos por `/guide`.

## Configuración y seguridad

Configurar `ASSISTANT_TOKEN_SECRET` en el servidor con un secreto aleatorio robusto. Si está vacío, se deriva una clave específica de `ADMIN_TOKEN_SECRET`. Si ambos faltan, o si el corpus no es válido, el asistente queda deshabilitado y no recoge datos. Ninguna clave debe ponerse en variables públicas `REACT_APP_*`.

Los tokens duran dos horas y se validan sin consultas al CRM en cada selección. Eliminar un lead no revoca de inmediato un token ya emitido: caduca a las dos horas; rotar la clave invalida todos los tokens. No se guarda historial de conversación, selecciones ni audio, y no se registran cuerpos ni secretos. Los errores de validación se reducen a códigos, sin devolver datos personales rechazados. Todas las respuestas del asistente llevan `Cache-Control: no-store`.

Por proceso API: 10 intentos de identificación/hora/IP, 300 globales; 120 selecciones/hora/IP, 80/hora/sesión, 6.000 globales. Las claves en memoria se derivan con una sal aleatoria por proceso, con un máximo de 4.096 entradas. No se confía directamente en `X-Forwarded-For`: configurar correctamente la confianza del proxy ASGI al desplegar. Antes de aumentar workers, añadir un limitador compartido o en el borde; los contadores locales se reinician con el proceso.

Los cuerpos JSON de identificación y guía se limitan a 16 KiB y tienen tiempo máximo de lectura. Los fallos usan `{ detail: { code } }`: `invalid_request`/`invalid_selection` (422), `invalid_content_type` (415), `request_too_large` (413), `request_timeout` (408), `session_expired` (401), `guided_only` (410), `rate_limit` (429, con `Retry-After`) y `unavailable` (503). La interfaz debe ofrecer Contacto en cualquier fallo, y pedir identificación de nuevo tras un 401.

Las pruebas usan dobles de base de datos, sin escrituras de producción. La integración reutiliza el adaptador Supabase y su inserción atómica existente; no amplía permisos públicos ni expone claves de servicio.
