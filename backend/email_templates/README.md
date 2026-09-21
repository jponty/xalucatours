# Xaluca Tours · Broadcasts en Resend

## Viaje destacado en confirmaciones de clientes

`featured-trip.json` es la única configuración del bloque: activación (`enabled`),
imagen JPEG/PNG HTTPS y textos, CTA y ruta por idioma (es/en/fr). Actualmente
promociona **Fin de Año 2026**, con destino `/findeano2026` (y sus traducciones).
Para cambiarlo, editar ese archivo y desplegar el backend; no hay que editar cada
email ni crear una plantilla en Resend. `enabled: false` oculta el bloque.

El render compartido está en `backend/featured_trip_email.py`. Lo usan las
confirmaciones de contacto (incluidos dictado, exit-intent, WhatsApp, Fast Track,
equipo y fundadores), planificación, descargas, concurso y el seguimiento de
feedback. No se aplica a notificaciones internas, newsletters, autenticación ni
mensajes gestionados externamente por Calendly. No crea nuevos envíos donde no
existían ni modifica preferencias o suscripciones de los clientes.

Mantener el mensaje de confirmación como contenido principal. Revisar la base
de consentimiento comercial antes de publicar promociones en estos emails.

Previsualizar **sin enviar correos** desde la raíz del repositorio:

```sh
.venv/bin/python backend/email_templates/preview_confirmations.py
```

Genera HTML y texto en un directorio temporal. Comprobar también Gmail, Outlook
y Apple Mail con un envío de prueba autorizado antes de publicar: una vista en
el navegador no reproduce todos sus motores de renderizado.

## Broadcasts

Fuente maestra de email para comunicar viajes, rutas, salidas, novedades y propuestas de Xaluca Tours.

## Archivos

- \`xaluca-travel-broadcast.html\`: versión HTML responsive para importar en Resend.
- \`xaluca-travel-broadcast.txt\`: alternativa de texto plano.
- \`validate_broadcast_template.py\`: comprobación local de enlaces, personalización, baja y estructura esencial.

## Cómo reutilizar el diseño

1. Duplica el Broadcast maestro en Resend antes de editarlo.
2. Cambia el nombre interno y el asunto de la campaña.
3. Busca los comentarios \`EDITAR\` del HTML y sustituye:
   - preheader;
   - imagen principal;
   - categoría, titular e introducción;
   - CTA y enlace;
   - fechas, duración y precio;
   - historia y tres puntos destacados;
   - dos propuestas relacionadas;
   - CTA final.
4. Conserva \`{{{contact.first_name|viajero}}}\` para personalizar el saludo.
5. Conserva siempre \`{{{RESEND_UNSUBSCRIBE_URL}}}\` para que Resend gestione la baja.
6. Envía una prueba a Gmail, Apple Mail y Outlook antes de programar la campaña.

Todas las imágenes y enlaces deben utilizar URL HTTPS públicas. No uses \`localhost\`, direcciones IP locales ni rutas relativas.

## Importación inicial en Resend

La API key actual del backend tiene permiso **solo para enviar emails**, por lo que no puede crear ni modificar Broadcasts. Esto es correcto para producción y no conviene ampliar sus permisos.

Para instalar el diseño desde el dashboard:

1. Abre **Resend → Broadcasts → Create Broadcast**.
2. Selecciona el segmento de destinatarios que corresponda.
3. Importa o pega el contenido de \`xaluca-travel-broadcast.html\` en el editor HTML.
4. Usa como nombre interno: \`TEMPLATE · Xaluca Tours · Viajes\`.
5. Guarda el Broadcast como **Draft**; no pulses Send.
6. Para cada campaña, duplica este borrador y modifica únicamente el contenido marcado.

Si se desea automatizar la creación en el futuro, debe utilizarse una API key administrativa independiente y de corta duración. Nunca sustituyas la clave de envío del backend por una clave con permisos completos.

## Validación

Desde \`backend/\`:

\`\`\`bash
python3 email_templates/validate_broadcast_template.py
\`\`\`

El validador impide dar por válido un template sin enlace de baja, sin personalización, con URLs locales o sin los principales bloques de contenido.
