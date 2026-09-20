# Datos de contacto unificados

Los nuevos envíos de la web requieren email y teléfono con prefijo internacional. La preferencia solo selecciona el canal de respuesta del equipo:

- `['email', 'phone']`: **Email + Teléfono**, seleccionado inicialmente.
- `['email']`: **Solamente Email**, sin hacer opcional el teléfono.

Se reutilizan `LeadContactInput` en la API, `ContactPreference` en la interfaz y `contactSubmissionFields` para construir los envíos. No hay campos alternativos de email/teléfono dentro de la preferencia. Los registros anteriores conservan sus datos originales y siguen siendo legibles.

## Cobertura

Contacto rápido (incluidas solicitudes de viaje), planificación, dictado integrado/modal, exit-intent, equipo/fundadores, WhatsApp Business, Fast Track, descarga de programa, newsletter, concurso y feedback. El administrador, CSV y notificaciones internas muestran la preferencia guardada.

La preferencia no equivale a consentimiento de marketing. La suscripción a la newsletter mantiene su consentimiento independiente; no autoriza llamadas o mensajes promocionales.

## Publicación

1. Aplicar `supabase/migrations/20260920204124_lead_contact_preferences.sql` antes de publicar la API. Añade únicamente `phone` y `preferred_contact` a `feedback`, admitiendo nulos para conservar el histórico. Ya aplicada en el proyecto de Xaluca Tours; no repetir en ese proyecto.
2. Publicar API y frontend coordinadamente: los clientes anteriores sin ambos campos recibirán un error de validación, nunca un lead incompleto ni una confirmación falsa.
3. Comprobar ambas preferencias con datos de prueba autorizados. Verificar teléfono normalizado, email, preferencia y origen en `/admin`, y el canal en la notificación interna.

## Pendiente externo: Calendly

Los formularios alojados dentro de los iframes de Calendly no se pueden cambiar desde React. En ambos tipos de cita (`cita-previa-telefonica` y `cita-previa-oficinas`), el propietario debe:

- Mantener el email obligatorio y exigir **Teléfono con prefijo internacional**.
- Añadir una pregunta obligatoria de elección única: **¿Cómo prefieres que te contactemos?**, con **Email + Teléfono** y **Solamente Email**.
- Configurar **Email + Teléfono** como predeterminado si el editor del evento lo permite; si no lo permite, Calendly no reproduce exactamente la preselección de nuestros formularios y requerirá selección explícita.
- No duplicar email ni teléfono en esa pregunta.

El webhook existente ya recoge estas respuestas y normaliza el teléfono cuando incluye prefijo. No rechaza reservas históricas o incompletas ni les inventa una preferencia. La configuración de la cuenta Calendly no se ha modificado.
