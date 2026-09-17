# Leads centralizados · Xaluca Tours

## Arquitectura y auditoría (17/09/2026)

Se reutilizan las tablas de producción existentes; no hace falta una migración SQL ni copiar los leads a una segunda tabla.

| Captación | Registro original | Clasificación |
| --- | --- | --- |
| ContactForm (home, contacto, programas, salidas, cita previa y FormTabs) | mirror_contact_requests | Contacto rápido / Información de viaje |
| PlannerForm (contacto y planificación) | mirror_trip_planner_requests | Planificación detallada |
| ExitIntentModal | mirror_contact_requests | Antes de irte |
| FastTrackPage | mirror_contact_requests | Fast Track |
| FounderContactModal (equipo y fundadores) | mirror_contact_requests | Contacto con equipo / fundadores |
| WhatsAppContactModal, formulario de correo | mirror_contact_requests | Contacto general |
| DownloadProgramModal | mirror_program_downloads | Descarga de programa |
| ConcursoPage | mirror_contest_participants | Ruleta de la suerte |
| NewsletterSignup | mirror_contact_requests + contacto original de Resend | Newsletter |
| Calendly, tras activar webhook | mirror_contact_requests | Cita previa |
| FeedbackPage (texto o voz transcrita) | feedback | Opinión del viajero |

Auditoría de solo lectura: 21 contactos, 21 planificaciones, 2 descargas, 4 participaciones y 9 feedbacks = 57 registros. Solo 20 conservaban una URL/página de origen. No se han inventado datos históricos ni modificado registros reales durante las pruebas.

Las llamadas, enlaces mailto y aperturas directas de WhatsApp no incluyen datos enviados a la web: no se crean personas ficticias por un clic. Una conversación externa necesitaría su propia integración. Los comentarios anónimos siguen siendo anónimos.

## Vista y estados

`/admin` → **Leads** carga todas las fuentes con autenticación de administrador, búsqueda, tipo, origen, fechas UTC inclusivas, estado y paginación de 50. La exportación respeta los filtros e incluye todos los resultados y datos completos, no solo la página visible. Se neutralizan fórmulas al exportar a CSV.

La ficha conserva teléfonos internacionales y contactos preferidos distintos del email/teléfono generales, fechas, viajeros, alojamientos, experiencias, mensajes, viaje y datos de captación disponibles.

Los estados son Nuevo, En seguimiento, Resuelto y Archivado. En los documentos JSONB se guarda `lead_status`; en feedback se reutiliza `status`. Archivar conserva los datos. La antigua eliminación masiva no se ofrece en la nueva vista; los endpoints existentes se mantienen por compatibilidad.

Identidad de la vista: fuente + id original. No se fusionan consultas distintas solo porque tengan el mismo email. Contacto, planificación y descarga utilizan un UUID de formulario y una huella del contenido para reutilizar el registro al reintentar, sin pisar su estado ni fecha. La inserción usa la clave primaria existente con `ON CONFLICT DO NOTHING` vía PostgREST. Las notificaciones aceptadas no se reenvían; los reintentos de correo usan el mismo id de lead y clave de Resend.

Feedback utiliza también una identidad estable y una inserción sin sobrescritura para los reintentos del formulario. Conserva únicamente el texto revisado, nunca el archivo de voz. No añade columnas nuevas a su tabla. La deduplicación del correo de feedback depende de la ventana de idempotencia de Resend; la deduplicación del registro en base de datos es permanente para ese envío.

## Newsletter y recuperación de histórico

Las nuevas altas se guardan **antes** de contactar con Resend. Si Resend falla, el lead permanece con sincronización fallida y el usuario no recibe una falsa confirmación. Una nueva alta/reintento del mismo email reutiliza el registro newsletter; las otras consultas de esa persona son independientes.

En Leads → **Recuperar newsletter anterior a esta actualización** → **Importar histórico de Resend**. Requiere en la API:

- `XALUCA_TOURS_NEWSLETTER` (o `RESEND_CONTACTS_API_KEY`): clave Full access ya utilizada por la newsletter.
- `RESEND_NEWSLETTER_SEGMENT_ID`: el segmento exclusivo de Xaluca Tours.

La importación lee exclusivamente ese segmento, pagina todos los contactos y no modifica nada en Resend ni envía emails. Puede repetirse sin duplicar leads. No inventa el consentimiento, la página original ni datos no disponibles. El estado de baja importado es una fotografía fechada, **no autorización de envío**. Resend sigue siendo la fuente para suscripciones y bajas; los estados comerciales del CRM nunca las modifican.

No se ha ejecutado la importación real: la clave de newsletter y el segmento deben estar disponibles en el entorno donde se ejecute.

## Activar Calendly (pendiente de configuración por el propietario)

1. Desplegar esta versión de la API en Render.
2. Crear un secreto aleatorio y guardarlo **solo en la API** como `CALENDLY_WEBHOOK_SIGNING_KEY`. No usar una variable `REACT_APP_*` ni compartirlo en el chat.
3. En Calendly, crear una suscripción de webhook para la cuenta/organización de Xaluca Tours con eventos `invitee.created` y `invitee.canceled`.
4. URL de recepción: `https://xaluca-tours-api.onrender.com/api/webhooks/calendly` (o el dominio público definitivo de la API). Usar exactamente el mismo secreto como signing key. Si se configura por API, usar el campo `signing_key` de la suscripción y el token personal de Calendly; no pegar ese token en el frontend.
5. Reservar una cita de prueba desde la web, verificar que aparezca **una sola vez** en Leads → Cita previa y cancelar esa cita para comprobar su actualización. Los webhooks sin firma o fuera de la ventana de 3 minutos se rechazan.

Los embeds de `/contacto` y `/citaprevia` transmiten página y viaje mediante UTM, sin copiar parámetros personales arbitrarios. El webhook usa el identificador estable del invitado, conserva las respuestas y la información de agenda presente en el evento, y no revierte una cancelación si llega un reintento antiguo. No registra clicks como reservas confirmadas.

Las citas anteriores a la activación requieren exportación/importación desde Calendly; este webhook no las recupera retroactivamente. No se ha accedido a esa cuenta ni modificado sus reservas.

Referencias: [firma Calendly](https://developer.calendly.com/api-docs/overview/webhooks/webhook-signatures), [alta de webhook](https://developer.calendly.com/docs/api-guides/receive-data-from-scheduled-events-in-real-time-with-webhook-subscriptions), [contactos de segmento Resend](https://resend.com/docs/api-reference/segments/list-segment-contacts), [paginación Resend](https://resend.com/docs/api-reference/pagination).

## Despliegue y límites

- Publicar frontend y backend juntos. No ejecutar cambios SQL ni modificar RLS/roles.
- El puerto de desarrollo `3101` está incluido explícitamente en CORS, además del `3100` existente.
- La vista usa el adaptador Supabase actual (lectura paginada de todas las filas, filtrado en API), sin el límite anterior de 2.000 registros. Para volúmenes muy altos, convendrá mover filtros y paginación a una consulta SQL/indexada, con una auditoría de rendimiento y migración específica.
- No se ha hecho commit ni push como parte de esta tarea.
