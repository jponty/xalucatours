# Xaluca Tours · Broadcasts en Resend

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
