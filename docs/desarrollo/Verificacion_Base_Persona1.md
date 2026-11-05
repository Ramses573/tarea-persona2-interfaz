# Verificación del proyecto base

Persona 1 · 4 de noviembre de 2026

Esta revisión cubre la base Expo después del cambio de carpetas. No sustituye las pruebas de integración y entrega final de Persona 4.

## Entorno y resultados

Se trabajó en Windows, con Node.js 22.17.0 y npm 10.9.2, sobre la rama `jose`. El requisito mínimo de Node declarado en la aplicación es `20.19.4`, tomado de la dependencia React Native instalada.

| Comprobación | Resultado |
| --- | --- |
| `npm ci --no-fund --no-audit` | Instalación completada: 631 paquetes. |
| `npx expo install --check` | Dependencias compatibles según Expo. |
| `npx expo config --type public` | Configuración leída correctamente; reconoce Android, iOS y web. |
| `npx expo-doctor` | 18 de 18 comprobaciones aprobadas. |
| `npx expo export --platform all --output-dir dist` | Paquetes de JavaScript generados para Android, iOS y web. |
| Versión web en Chrome, con un área de 390 × 844 | Carga del catálogo y sus siete imágenes, marcado y desmarcado de favorito, filtro Ciencia y regreso a Todos comprobados. |
| Errores JavaScript durante ese recorrido | Ninguno capturado mediante el evento `pageerror` del navegador. |

El recorrido web se comprobó con Playwright sobre el resultado exportado, servido únicamente en `127.0.0.1`. Se verificaron siete registros iniciales, el cambio del contador de favoritos entre cero y uno, y un registro al seleccionar Ciencia. La captura está en [evidencias/base-web.png](evidencias/base-web.png).

El empaquetado confirma que Metro resuelve los imports después de reorganizar las carpetas. Los paquetes móviles generados no son un APK ni una aplicación iOS instalada.

## Cómo iniciar la base

Desde la raíz del repositorio:

```powershell
cd persona2-interfaz
npm ci
npm start
```

Para abrir la versión web:

```powershell
npm run web
```

Para revisar Android, se necesita un dispositivo con una versión de Expo Go compatible con SDK 54 o un entorno de desarrollo móvil adecuado. La CLI muestra las opciones y el QR al iniciar el servidor. La versión de Expo Go disponible en las tiendas puede cambiar; conviene comprobar la compatibilidad antes de usarla.

## Pendientes y límites de esta revisión

- Falta ejecutar la aplicación en un dispositivo o emulador Android. No se encontró `adb` ni el SDK de Android en la ubicación habitual del equipo.
- No se realizó una ejecución en iOS. La exportación de su paquete de JavaScript no demuestra su comportamiento en un dispositivo.
- Las siete imágenes de prueba cargaron correctamente, pero dependen de una conexión a `picsum.photos`. No se comprobó un escenario sin red.
- No se probó el consumo de API: todavía no está implementado y corresponde a Persona 3.
- La instalación emitió avisos de paquetes transitivos obsoletos. No se cambiaron versiones ni se realizó una auditoría de seguridad como parte de esta revisión.

## Documentación y cambios locales

La investigación de Persona 1 tiene una fuente Markdown y dos formatos de entrega, Word y PDF, dentro de `docs/investigacion/`. Para regenerarlos desde la raíz:

```powershell
python -m pip install -r tools/requirements-docs.txt
python tools/export_research.py
```

El generador usa Arial de Windows e incrusta esa fuente en el PDF. Sus dependencias son herramientas para documentación, no dependencias de la aplicación móvil.

La configuración de GitHub y el proyecto Expo ya existían. Se conservó el trabajo de interfaz de Persona 2, cambiando las rutas y separando `normalizeItem` de los mocks. El detalle se encuentra en [Estructura_Base_Persona1.md](Estructura_Base_Persona1.md).

La reorganización previa de los documentos originales hacia `docs/` ya estaba en el árbol de trabajo al comenzar. No se hicieron commits ni se subieron estos cambios a GitHub durante esta preparación.

Referencia para el flujo de inicio y apertura en dispositivos: [Start developing — Expo](https://docs.expo.dev/get-started/start-developing/).
