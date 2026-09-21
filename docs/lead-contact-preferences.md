# Datos de contacto unificados

Los nuevos envíos de la web requieren email y teléfono con prefijo internacional. La preferencia solo selecciona el canal de respuesta del equipo:

- `['email', 'phone']`: **Email + Teléfono**, seleccionado inicialmente.
- `['email']`: **Solamente Email**, sin hacer opcional el teléfono.

Se reutilizan `LeadContactInput` en la API, `ContactPreference` en la interfaz y `contactSubmissionFields` para construir los envíos. No hay campos alternativos de email/teléfono dentro de la preferencia. Los registros anteriores conservan sus datos originales y siguen siendo legibles.

## Cobertura

Contacto rápido (incluidas solicitudes de viaje), planificación, dictado integrado/modal, exit-intent, equipo/fundadores, WhatsApp Business, Fast Track, descarga de programa, newsletter, concurso y feedback. El administrador, CSV y notificaciones internas muestran la preferencia guardada.

La preferencia no equivale a consentimiento de marketing. La suscripción a la newsletter mantiene su consentimiento independiente; no autoriza llamadas o mensajes promocionales.

## Nombre y Apellido(s) independientes (21/09/2026)

Todos los formularios propios recogen `first_name` (Nombre) y `last_name` (Apellido(s)). Contacto, planificación, dictado, asistente y Fast Track reutilizan `PersonalNameFields`; los formularios que ya tenían ambos campos conservan su estructura. Feedback también muestra ambos, manteniendo su carácter opcional.

`LeadNameInput` exige y normaliza cada campo en los nuevos envíos de contacto, planificación y asistente. Los contratos de descarga, newsletter y concurso validan igualmente cada parte. No se parte automáticamente un nombre por espacios: nombres compuestos y varios apellidos se conservan como fueron introducidos. `full_name`/`name` solo son valores derivados de visualización y compatibilidad; nunca sustituyen los campos nuevos obligatorios.

Los documentos JSONB existentes guardan ambas propiedades sin nuevas tablas. La migración `20260921141931_split_personal_names.sql`, aplicada a Xaluca Tours el 21/09/2026, añade columnas opcionales `first_name` y `last_name` a feedback y amplía su nombre de visualización a 271 caracteres. RLS y permisos permanecen intactos. Verificado que `anon` y `authenticated` no pueden leer feedback y que `service_role` conserva INSERT; la prueba de escritura se revirtió completamente, sin registros ni emails de prueba persistentes.

Leads, su ficha y CSV muestran campos independientes; las notificaciones internas y los resúmenes de confirmación también. Resend reutiliza el contacto y segmento existentes con sus propiedades `first_name`/`last_name`. Los registros antiguos conservan su nombre original y se identifican como no registrados por separado; no se han alterado ni adivinado apellidos.

Publicar API y frontend coordinadamente. Un frontend antiguo que solo envíe `full_name` recibirá 422 hasta que se actualice; no se aceptan nuevas identidades incompletas. El cambio está probado localmente; no se ha publicado durante esta tarea.

## Publicación

1. Aplicar `supabase/migrations/20260920204124_lead_contact_preferences.sql` antes de publicar la API. Añade únicamente `phone` y `preferred_contact` a `feedback`, admitiendo nulos para conservar el histórico. Ya aplicada en el proyecto de Xaluca Tours; no repetir en ese proyecto.
2. Publicar API y frontend coordinadamente: los clientes anteriores sin ambos campos recibirán un error de validación, nunca un lead incompleto ni una confirmación falsa.
3. Comprobar ambas preferencias con datos de prueba autorizados. Verificar teléfono normalizado, email, preferencia y origen en `/admin`, y el canal en la notificación interna.

## Pendiente externo: Calendly

Los formularios alojados dentro de los iframes de Calendly no se pueden cambiar desde React. En ambos tipos de cita (`cita-previa-telefonica` y `cita-previa-oficinas`), el propietario debe:

- En **Scheduling → tipo de evento → More options → Invitee form → Invitee details**, elegir el formato de dos campos **First Name, Last Name**, y guardar. No añadir una pregunta de nombre duplicada. [Instrucciones oficiales de Calendly](https://calendly.com/help/advanced-booking-form-features).
- Mantener el email obligatorio y exigir **Teléfono con prefijo internacional**.
- Añadir una pregunta obligatoria de elección única: **¿Cómo prefieres que te contactemos?**, con **Email + Teléfono** y **Solamente Email**.
- Configurar **Email + Teléfono** como predeterminado si el editor del evento lo permite; si no lo permite, Calendly no reproduce exactamente la preselección de nuestros formularios y requerirá selección explícita.
- No duplicar email ni teléfono en esa pregunta.

El webhook existente ya recoge estas respuestas y normaliza el teléfono cuando incluye prefijo. No rechaza reservas históricas o incompletas ni les inventa una preferencia. La configuración de la cuenta Calendly no se ha modificado.

El webhook también conserva `first_name`/`last_name` cuando Calendly los proporciona y los expone por separado en Leads. La prueba con evento firmado está cubierta, pero el cambio del formulario externo requiere acceso a la cuenta; sigue pendiente de confirmación del propietario.
