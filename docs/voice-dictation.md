# Dictado en formularios y solicitud de viaje por voz

## Activación

1. Crear una API key en la cuenta de AssemblyAI destinada a Xaluca Tours y
   comprobar que tiene servicio/crédito disponible. La transcripción tiene el
   consumo facturado por AssemblyAI; no es un servicio gratuito del navegador.
2. En Render → **xaluca-tours-api** (Web Service) → Environment, añadir
   `ASSEMBLYAI_API_KEY`. No configurarla en la Static Site ni con un prefijo
   `REACT_APP_`. Guardar y desplegar el backend con este código.
3. Opcional: `ASSEMBLYAI_DICTATION_HOURLY_LIMIT=120` limita los intentos globales
   por hora y proceso. Se aplican también 12 intentos/hora por IP y un máximo de
   2 peticiones/sesiones simultáneas. Los límites son en memoria: se reinician al
   reiniciar el proceso. Antes de escalar a varios workers/instancias, usar un
   limitador compartido y ajustar el presupuesto en AssemblyAI.
4. Para probar localmente, añadir la misma variable a `backend/.env` (ignorado
   por Git) y reiniciar únicamente el backend de Xaluca Tours.
5. Desplegar también los cambios de frontend, incluido el fichero estático
   `/audio/voice-recorder.worklet.js`. No necesita nuevas dependencias.
6. `GET /api/form-dictation/status` devuelve `available: true` cuando hay clave
   configurada; esto NO verifica el saldo ni la validez de la clave. Una
   grabación real es necesaria para comprobar el proveedor extremo a extremo.

## Alcance y comportamiento

- Pestaña **Dictado** compartida por `/contacto` y `/planifica-tu-viaje`:
  1. Un único relato del viaje, con diez sugerencias no obligatorias; sin
     campos independientes de fechas, viajeros, presupuesto o actividades.
  2. Nombre, email, teléfono opcional, canales preferidos con sus datos
     independientes y consentimiento obligatorio. El texto se puede revisar
     volviendo al primer paso, sin perder los datos del segundo.
- Esta nueva pestaña usa transcripción progresiva: el mismo textarea muestra
  los resultados parciales y sus revisiones, sin duplicar frases. Se deja en
  solo lectura mientras graba/finaliza y se habilita para editar al terminar.
  Cancelar restaura el texto anterior a esa grabación; un fallo de conexión
  conserva el texto ya recibido para poder editarlo manualmente.
- Se envía a `POST /api/contact-requests`, con `capture_type: dictation`.
  Aparece como **Dictado** en Leads, reutiliza idempotencia, estado y los
  emails/resúmenes existentes. Conserva el viaje seleccionado y guarda el
  consentimiento junto con la fecha de creación. No suscribe a marketing.
- `ContactForm`: exclusivamente «Cuéntanos tu viaje soñado» (mensaje).
- `PlannerForm`: exclusivamente «Comentarios o ideas».
- Se hereda en todas las páginas que usan estos componentes compartidos,
  incluida la home, `/contacto`, `/planifica-tu-viaje`, hubs y programas.
- Nombre, viajeros, mes orientativo, emails, prefijos/teléfonos, fechas,
  selectores y contadores conservan sus controles sin botón ni aviso de dictado.
- Botón accesible con micrófono, grabar/detener/cancelar, indicador de tiempo
  y límite de **120 segundos**. Funciona en HTTPS y localhost; requiere
  `getUserMedia`, Web Audio y AudioWorklet. En navegadores no compatibles,
  micrófono denegado o servicio sin configurar, escribir sigue funcionando.
- Una grabación a la vez por formulario. Se bloquea el envío mientras se
  graba/transcribe, pero se puede seguir editando el texto. Al cambiar de
  modalidad o desmontar el formulario se detiene el micrófono y se aborta la
  petición pendiente. Cancelar ignora cualquier respuesta tardía.
- La transcripción se añade al valor MÁS RECIENTE del campo. No reemplaza
  texto, no reformula el mensaje y no envía el formulario. Si no cabe por el
  `maxLength` existente, se muestra completa para acortarla antes de añadirla;
  nunca se trunca silenciosamente.

## Flujo y privacidad

### Pestaña Dictado: transcripción progresiva

El backend genera un token de un solo uso en
`POST /api/form-dictation/stream-token`, usando
`https://streaming.eu.assemblyai.com/v3/token`. Solo ese token temporal llega
al navegador; nunca la API key. Caduca para su canje en 60 segundos y limita
la conexión a 135 segundos (120 de grabación como máximo y margen para
finalizar). La cuota compartida reserva cada sesión hasta que hayan expirado
el canje y la duración máxima, sin confiar en avisos de cierre del cliente.

El navegador conecta a `wss://streaming.eu.assemblyai.com/v3/ws`, modelo
`universal-3-5-pro`, PCM16 mono y frecuencia real del AudioContext. Envía
audio únicamente tras `Begin` y solicita `Terminate` al terminar. No graba
archivos persistentes. Una CSP externa, si se configura, debe permitir ese
destino WebSocket en `connect-src`.

Esta modalidad requiere acceso a Streaming en la misma cuenta de AssemblyAI
y crédito disponible. La API key existente sirve; no necesita otra variable.
Las pruebas automáticas simulan el proveedor: se debe completar una prueba
con voz y permisos reales tras desplegar frontend y backend. No se ha
activado el micrófono del usuario ni enviado grabaciones durante el desarrollo.

Referencias: [tokens temporales](https://www.assemblyai.com/docs/streaming/api-spec/generate-streaming-token),
[protocolo WebSocket](https://www.assemblyai.com/docs/streaming/api-spec/streaming-websocket),
[procesamiento europeo](https://www.assemblyai.com/docs/streaming/endpoints-and-data-zones).

### Contacto rápido y Planificación detallada: transcripción al detener

El navegador captura PCM mono de 16 bits y genera WAV en memoria. Al detener,
envía un cuerpo binario `audio/wav` a `POST /api/form-dictation?language=es`
(también `en` y `fr`). El servidor valida bytes, cabecera, formato, canales,
frecuencia y duración real antes de reenviar el fichero por multipart a
`https://sync.eu.assemblyai.com/transcribe`.

La API key sólo se lee en el servidor. El proveedor recibe `Authorization`
con la clave sin `Bearer`, `X-AAI-Model: universal-3-5-pro` y el parámetro HTTP
`language_code` (singular), sin reescritura LLM ni timestamps. Se permite
como máximo un reintento por fallo transitorio, respetando `Retry-After`;
no se repite automáticamente cuando pide esperar más de tres segundos.

El backend no crea ficheros temporales, no guarda audio ni transcripciones en
la base de datos y no los incluye en logs. Devuelve únicamente el texto con
`Cache-Control: no-store`. El usuario ve antes de grabar que el audio se
enviará para transcribirlo; la interfaz no menciona la marca del proveedor.
Sólo el texto final que revise y envíe se incorpora a la
solicitud, usando el flujo de leads habitual. No se crean leads al dictar.

La cancelación aborta la petición del navegador; si AssemblyAI ya ha recibido
el audio no garantiza que se cancele su procesamiento ni el consumo. Revisar
en la cuenta de AssemblyAI sus controles de retención/uso de datos y la
información de privacidad del sitio antes de activar producción. No se ha
cambiado ninguna preferencia contractual o de retención del proveedor.

## Comprobación manual al disponer de la clave

- Chrome/Firefox/Safari, iOS Safari y Android Chrome: permitir y denegar
  micrófono, grabar/detener, cancelar, salir de la página y cambiar de pestaña
  del formulario.
- Dictar en ES/EN/FR; comprobar edición, texto previo y una segunda grabación.
- Grabar hasta 2 min; comprobar que el micrófono se libera al llegar al límite.
- Revisar el payload final sin enviar leads de prueba a clientes reales.
- Simular caída del servicio, límite de peticiones y audio sin voz.

Referencias verificadas: [Sync STT](https://www.assemblyai.com/docs/sync-stt/getting-started/transcribe-a-short-audio-file),
[formato WAV](https://www.assemblyai.com/docs/sync-stt/audio-requirements),
[idioma HTTP](https://www.assemblyai.com/docs/sync-stt/language-selection),
[endpoint europeo](https://www.assemblyai.com/docs/sync-stt/endpoints-and-data-zones),
[errores](https://www.assemblyai.com/docs/sync-stt/error-handling),
[controles de datos](https://www.assemblyai.com/docs/data-controls).
