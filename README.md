# Catálogo de artículos sobre React Native

Proyecto grupal de Programación V, Tarea Corta 3. Aplicación React Native con Expo que consulta artículos públicos de DEV.to, muestra tarjetas con imágenes y permite filtrar por categoría y marcar favoritos durante la sesión.

## Archivos de entrega

- [Investigación grupal con portada](docs/entrega/InvestigacionReactNative.pdf).
- [Paquete del proyecto, documentación, pruebas y evidencias](docs/entrega/Entrega_React_Native.zip).

La versión integrada y validada está en el ZIP de entrega. Las instrucciones siguientes corresponden a ese paquete.

## Instalación y ejecución

Requisitos: Node.js 20.19.4 o superior, npm y conexión a Internet para consultar la API y cargar las imágenes.

1. Descargar el ZIP desde el enlace anterior y descomprimirlo.
2. Abrir una terminal en la carpeta `Entrega_React_Native`.
3. Ejecutar:

```sh
cd persona2-interfaz
npm ci
npm start
```

Expo mostrará las opciones para abrir la aplicación. Para ejecutarla en navegador:

```sh
npm run web
```

Para abrirla en un teléfono se necesita un entorno compatible con Expo SDK 54. No se requiere una clave de API para la consulta pública utilizada.

## Funcionamiento

1. `App.js` ejecuta el Hook `useCatalogItems`.
2. El Hook administra los estados de carga, datos y error.
3. `fetchCatalogItems` consulta `https://dev.to/api/articles?tag=reactnative&per_page=30`, verifica el estado HTTP y valida la respuesta JSON.
4. `HomeScreen` adapta los artículos y los presenta mediante `FlatList` e `ItemCard`.
5. Los filtros y favoritos actualizan el estado local de la interfaz.

La carga, los errores y las respuestas vacías tienen presentaciones distintas.

## Contenido del ZIP

```text
Entrega_React_Native/
  README.md
  persona2-interfaz/
    App.js
    app.json
    package.json
    package-lock.json
    src/
    tests/
  docs/
    desarrollo/
      Pruebas_Integracion.md
      evidencias/persona4/
    entrega/
      InvestigacionReactNative.pdf
```

El archivo `docs/desarrollo/Pruebas_Integracion.md` contiene la matriz de pruebas y los resultados. Las capturas y `resultados-web.json` están en `docs/desarrollo/evidencias/persona4/`, dentro del ZIP.

## Pruebas reproducibles

Desde `Entrega_React_Native/persona2-interfaz`:

```sh
npm test
npx expo install --check
npx expo-doctor
npm run export
npx playwright install chromium
npm run test:web
```

Para incluir una consulta real a DEV.to:

```sh
npm run test:web -- --live
```

Las pruebas web con respuestas controladas comprueban carga, interacciones, lista vacía, errores de red, errores HTTP, JSON inválido, estructura inesperada y presentación en una pantalla estrecha. La prueba real verifica la consulta, el primer título y la primera imagen.

## Resultados y alcance

Verificaciones del 5 de noviembre de 2026:

- 12 de 12 pruebas del servicio y adaptador aprobadas.
- 9 de 9 escenarios web aprobados, incluida la consulta real.
- 18 de 18 comprobaciones de Expo Doctor aprobadas.
- Exportación de recursos para web, Android e iOS completada.

La validación documentada se realizó en navegador. La exportación móvil no equivale a generar un APK ni a ejecutar la aplicación en un dispositivo nativo.

Los favoritos se conservan solo durante la sesión. Se consulta una página de hasta 30 artículos. No hay paginación ni botón de reintento; después de un error se puede recargar la aplicación. Las imágenes dependen de servicios externos.

## Documentación de referencia

- [Inicio del desarrollo con Expo](https://docs.expo.dev/get-started/start-developing/).
- [Efectos y limpieza en React](https://react.dev/reference/react/useEffect).
- [Pruebas en React Native](https://reactnative.dev/docs/testing-overview).
- [API de Forem](https://developers.forem.com/api/v1).
