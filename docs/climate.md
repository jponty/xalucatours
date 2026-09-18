# Clima de Marruecos

## Página y fuente editorial

- `/clima`, `/en/weather`, `/fr/climat` (`ClimatePage.jsx`). Acceso directo «Clima» en el menú lateral principal.
- `bestTimeData.js` sigue siendo la fuente única de regiones, ventanas recomendadas, estaciones y experiencias.
- Se reutiliza `parseBestMonthsEn` de «Mejor mes para mi viaje». No se atribuyen las temperaturas genéricas de `MONTHS` a regiones concretas.
- Fotografías existentes con `EditableImage`, monograma, navegación por secciones, menú, footer, SEO y widget global existentes.

## API propia

`backend/climate.py`, registrada en `server.py`:

- `GET /api/climate/current`: siete puntos fijos (Merzouga, Arfoud, Ouarzazate, Boumalne Dades, Zagora, Marrakech e Imlil como referencia del Alto Atlas).
- `GET /api/climate/normals`: cinco puntos de referencia para las regiones editoriales. No representan cada valle, cumbre o localidad de toda la región.
- No admite coordenadas ni URL de proveedor arbitrarias. No requiere login y no expone secretos ni transmite datos del viajero a proveedores.

### Tiempo actual: MET Norway

[Locationforecast](https://api.met.no/weatherapi/locationforecast/2.0/documentation) ofrece estimaciones de modelo, **no observaciones en directo de una estación**. Se muestra la hora más cercana (máximo 90 minutos de distancia), el momento de actualización del modelo y la última consulta, con zona `Africa/Casablanca` (incluidos sus cambios horarios).

Temperatura, humedad, viento y símbolo del cielo proceden de la API. El viento se convierte de m/s a km/h. La sensación térmica se calcula mediante la [aproximación Steadman/BOM sin radiación](https://www.bom.gov.au/info/thermal_stress/#atapproximation), y se explica que corresponde a la sombra. Máxima y mínima se calculan para **las próximas 24 horas**, no para el día civil. Si faltan datos, aparece «—», nunca cero inventado.

Cumple la [política de uso](https://api.met.no/doc/TermsOfService): User-Agent identificable, proxy servidor, `Expires`, `If-Modified-Since`, gzip, redirecciones, coordenadas de cuatro decimales, máximo tres solicitudes simultáneas. Se acredita MET Norway y [CC BY 4.0](https://api.met.no/doc/License) en pantalla, incluyendo las transformaciones realizadas.

### Referencias históricas: NASA POWER

[API mensual](https://power.larc.nasa.gov/docs/services/api/temporal/monthly/), serie **1991–2020**, parámetros `T2M_MAX_AVG` / `T2M_MIN_AVG`. Se promedian las medias mensuales de máximas/mínimas diarias, ponderadas por los días de cada mes (incluidos bisiestos). Se exige la serie completa para cada mes.

No se usan `T2M_MAX` / `T2M_MIN`, que conservan extremos a otros niveles de agregación: [metodología](https://power.larc.nasa.gov/docs/methodology/data/processing/). Tampoco se reutiliza el antiguo `/climate/current-month` como tiempo actual: es histórico. La página identifica el periodo, punto de referencia y limitaciones del modelo regional MERRA-2.

## Actualización, fallos y límites

- Navegador: consulta del tiempo cada 15 minutos solo con la página visible; reanudación al volver; botón Actualizar; cancela solicitudes al salir y timeout de 60 segundos.
- Servidor: caché por proveedor/punto; MET hasta `Expires` (15 minutos si no existe); NASA 7 días. Exclusión de solicitudes concurrentes al mismo punto.
- Un fallo afecta solo a su destino. Últimos datos válidos se marcan como anteriores; modelos MET de más de 24 horas, sin hora cercana, o caché demasiado antigua se ocultan. NASA admite caché anterior hasta 30 días.
- Backoff 5 minutos; 403/429 al menos una hora, respetando `Retry-After` si es mayor. Un fallo de refresh en el navegador elimina su snapshot para no mostrarlo como actual.
- La caché está en memoria por proceso; si se escalan muchas réplicas, centralizarla antes de aumentar tráfico. Los proveedores públicos no ofrecen SLA.

## Puesta en producción

No hace falta una nueva API key ni contratar una suscripción. Es necesario desplegar **backend y frontend** de esta versión. `REACT_APP_BACKEND_URL` debe seguir apuntando al backend habitual, con su CORS existente.

Opcional: `WEATHER_USER_AGENT` en backend permite actualizar la identificación pública al migrar el dominio. Por defecto: `XalucaToursClimate/1.0 (https://xalucatravel.com/contacto; xalucatours@xaluca.com)`.

Comprobar ambos endpoints, las siete ubicaciones con estado `ok`, las cinco series con 12 meses, menú/SEO, navegación por teclado y layouts de 320/390/768/1024/1440 px. Pruebas: `backend/tests/test_climate.py`, `ClimatePage.test.jsx`, `useClimate.test.jsx` y suite general de frontend.
