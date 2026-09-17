# Dictado en Contacto rápido y Planificación detallada

## Activación

1. Crear una API key en la cuenta de AssemblyAI destinada a Xaluca Tours y
   comprobar que tiene servicio/crédito disponible. La transcripción tiene el
   consumo facturado por AssemblyAI; no es un servicio gratuito del navegador.
2. En Render → **xaluca-tours-api** (Web Service) → Environment, añadir
   `ASSEMBLYAI_API_KEY`. No configurarla en la Static Site ni con un prefijo
   `REACT_APP_`. Guardar y desplegar el backend con este código.
3. Opcional: `ASSEMBLYAI_DICTATION_HOURLY_LIMIT=120` limita los intentos globales
   por hora y proceso. Se aplican también 12 intentos/hora por IP y un máximo de
   2 peticiones simultáneas. Los límites son en memoria: se reinician al
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
