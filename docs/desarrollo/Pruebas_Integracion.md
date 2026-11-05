# Pruebas de integración y validación

Fecha de las verificaciones: 5 de noviembre de 2026.

## Entorno y alcance

Windows, Node.js 24.19.0, npm 11.17.0, Expo SDK 54, React 19.1.0, React Native 0.81.5 y Playwright 1.62.1. Navegador Google Chrome en modo sin ventana; área de 390 × 844 píxeles y un caso adicional de 320 × 844. Se probó la exportación web servida únicamente en `127.0.0.1`.

Las pruebas automatizadas se ejecutaron sobre la integración de `main` (`4282a2d`) y `ale` (`6521cc3`), con la corrección del encabezado para pantallas pequeñas. No se ejecutó la aplicación en Android/iOS nativos. La exportación de sus paquetes no demuestra una ejecución en dispositivo.

## Comprobaciones del proyecto

| Comprobación | Resultado |
| --- | --- |
| Instalación inicial con `npm ci` | Correcta, 631 paquetes antes de añadir las herramientas de prueba. |
| `npx expo install --check` con acceso a red | Dependencias compatibles. |
| `npx expo config --type public` | Configuración válida para Android, iOS y web. |
| `npx expo-doctor` | 18 de 18 comprobaciones aprobadas. |
| `npm run export` después de la corrección | Exportación correcta de web, Android e iOS. |
| `npm test` | 12 pruebas aprobadas, 0 fallos. |
| `npm run test:web -- --live` | 9 escenarios aprobados, 0 errores JavaScript no capturados. |

Los primeros intentos de exportación y navegador encontraron restricciones del entorno de ejecución, no errores del proyecto: carpeta temporal de Hermes sin permiso de escritura y bloqueo de red del navegador. Se utilizó una carpeta temporal permitida y se ejecutó el navegador con acceso autorizado. Los resultados finales corresponden a las ejecuciones completadas.

## Casos del servicio y adaptador

| ID | Entrada o acción | Resultado verificado |
| --- | --- | --- |
| S01 | GET con `AbortSignal` | URL, método, encabezado y señal correctos; devuelve los artículos. |
| S02 | Respuesta `[]` | Se acepta como éxito sin registros. |
| S03 | HTTP 404 | Error HTTP con estado 404. |
| S04 | HTTP 429 | Error HTTP con estado 429. |
| S05 | HTTP 500 | Error HTTP con estado 500, sin intentar procesar la página de error. |
| S06 | Rechazo de red | Error de tipo `network`. |
| S07 | Cancelación | Conserva `AbortError` para la limpieza del Hook. |
| S08 | JSON inválido | Error de tipo `invalid-json`. |
| S09 | Objeto en vez de arreglo | Error de tipo `invalid-data`. |
| S10 | Respuesta `null` | Error de tipo `invalid-data`. |
| S11 | Artículo DEV con etiquetas | Modelo de tarjeta, imagen, categoría y tiempo de lectura correctos. |
| S12 | Campos opcionales ausentes | Valores de respaldo de título, descripción, categoría e imagen. |

Estas pruebas sustituyen `fetch` de forma controlada; no consumen la API real ni simulan un dispositivo nativo. No constituyen una validación exhaustiva de cada campo o registro de terceros.

## Casos de interfaz

| ID | Escenario | Resultado | Evidencia |
| --- | --- | --- | --- |
| W01 | Solicitud pendiente durante más de 500 ms | Indicador visible, sin mocks ni mensaje de lista vacía; luego muestra datos. | `01-carga-en-progreso.png` |
| W02 | Dos artículos controlados | Imágenes y textos visibles; favoritos 0 → 1 → 0; filtro 2 → 1 → 2. | `02-interacciones.png` |
| W03 | HTTP 200 con `[]` | Contador cero y mensaje de lista vacía. | `03-vacia.png` |
| W04 | HTTP 500 | Mensaje de error; no muestra el mensaje de lista vacía. | `04-http.png` |
| W05 | Petición de API interrumpida | Mensaje de conexión; la app local permanece accesible. | `05-red.png` |
| W06 | Texto no JSON | Mensaje de respuesta no procesable. | `06-json.png` |
| W07 | JSON con estructura inesperada | Mensaje de respuesta no procesable. | `07-estructura.png` |
| W08 | Ancho de 320 píxeles | Contador completamente dentro de la pantalla. | `08-ancho-320.png` |
| W09 | API real de DEV.to | HTTP 200; 30 registros; primer título e imagen cargados. | `09-api-real.png` |

Todas las capturas y `resultados-web.json` están en `evidencias/persona4/`. W01 a W08 usan respuestas controladas. W09 realiza la consulta real; el contenido y el número de artículos pueden cambiar en futuras ejecuciones.

## Incidencia detectada y corregida

**I01: contador fuera de pantalla.** Antes del cambio, en una ventana de 320 píxeles, el contador comenzaba en x=297.625 y medía 61.09375 píxeles: su extremo derecho superaba el ancho disponible. El encabezado tenía una fila sin salto de línea. Se añadió `flexWrap`, separación entre elementos y una base flexible para el bloque del título. El caso W08 falló antes del cambio y aprobó después.

## Prueba manual pendiente en móvil

1. Registrar modelo del teléfono o emulador, sistema operativo y versión del entorno Expo utilizado.
2. Ejecutar `npm start` y abrir el proyecto con un entorno compatible con SDK 54.
3. Comprobar carga inicial, textos, imágenes, desplazamiento y contador con la API real.
4. Filtrar una categoría, volver a Todos y marcar/desmarcar un favorito.
5. Comprobar que el encabezado y la última tarjeta no quedan bajo las barras del sistema.
6. Probar la pérdida de acceso a la API y recargar tras restaurar la conexión.
7. Guardar capturas o video y registrar resultados; no marcar este recorrido como aprobado hasta ejecutarlo.

## Límites conocidos

- Los favoritos son temporales y se reinician al recargar.
- Se consulta una página de hasta 30 artículos; no hay paginación.
- El error se recupera recargando; no hay botón de reintento ni tiempo máximo explícito de solicitud.
- Las imágenes dependen de servicios externos. W09 verifica la primera imagen, no todas las imágenes remotas.
- No se realizó auditoría de seguridad, prueba de rendimiento ni evaluación completa de accesibilidad.
- La validación web no sustituye la validación Android/iOS.

## Reproducción

Los comandos completos se encuentran en el README. Para ejecutar un solo escenario: `npm run test:web -- --only=08-ancho-320`. Para el escenario real: `npm run test:web -- --live --only=09-api-real`. Cada ejecución actualiza el JSON con los casos ejecutados, por lo que para regenerar la evidencia completa debe ejecutarse la suite con `--live` y sin `--only`.
