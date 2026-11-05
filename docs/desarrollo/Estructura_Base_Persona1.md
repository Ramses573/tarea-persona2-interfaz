# Organización de la base

Persona 1 · 4 de noviembre de 2026

La aplicación ya tenía una interfaz funcional como código de referencia. Organizamos sus archivos por funcionalidad para que resulte fácil ubicar el catálogo y distinguirlo de los recursos que puede compartir toda la aplicación. Mover archivos no cambia por sí solo el comportamiento: también hay que mantener claras sus responsabilidades y sus dependencias.

```text
persona2-interfaz/
├── App.js
├── app.json
├── package.json
├── package-lock.json
└── src/
    ├── features/
    │   └── catalog/
    │       ├── screens/
    │       │   └── HomeScreen.js
    │       ├── components/
    │       │   ├── ItemCard.js
    │       │   └── CategoryFilter.js
    │       ├── data/
    │       │   └── mockData.js
    │       └── adapters/
    │           └── normalizeItem.js
    └── shared/
        └── styles/
            └── theme.js
```

## Responsabilidades

- `App.js`: conecta el punto de entrada de Expo con la pantalla principal. Es el lugar inicial para conectar futuras dependencias.
- `features/catalog/screens`: coordina la presentación del catálogo, sus filtros, favoritos y estados visuales.
- `features/catalog/components`: contiene las piezas visuales del catálogo. Reciben datos y funciones mediante props.
- `features/catalog/data`: guarda exclusivamente los registros y categorías de prueba.
- `features/catalog/adapters`: convierte datos externos al formato que entiende la interfaz. La función existente se separó de los mocks sin cambiar su comportamiento.
- `shared/styles`: contiene colores, espaciados y estilos que pueden usar distintas funcionalidades. No importa archivos del catálogo.

Las dependencias actuales siguen este recorrido: `App → pantalla → componentes, datos y adaptador`. Los archivos de presentación pueden usar los estilos compartidos. Los mocks y el adaptador no necesitan React ni componentes visuales.

## Cómo usamos SOLID

SOLID orienta las decisiones de diseño; una lista de carpetas no garantiza su cumplimiento. En esta base usamos funciones y composición, sin añadir jerarquías de clases.

| Principio | Aplicación en esta base |
| --- | --- |
| Responsabilidad única | Los datos de prueba, la conversión de datos y los estilos tienen archivos distintos. La pantalla conserva la coordinación visual existente. |
| Abierto/cerrado | La pantalla ya puede recibir datos mediante props y las tarjetas notifican acciones mediante callbacks. Esos puntos permiten ampliar el comportamiento sin incluir peticiones HTTP dentro de las tarjetas. |
| Sustitución de Liskov | No existe una jerarquía de herencia que debamos adaptar. Si se añaden implementaciones intercambiables, deberán respetar el mismo contrato y sus resultados esperados. |
| Segregación de interfaces | Cada componente recibe las props que utiliza. Evitamos pasar clientes HTTP o una configuración global a los componentes visuales. |
| Inversión de dependencias | Conservamos la entrada por props como punto de integración. La pantalla aún importa mocks como alternativa y el adaptador: la separación de la fuente de datos no está completa. Persona 3 podrá conectar un contenedor externo y definir el contrato necesario para su servicio. |

## Acuerdo para continuar

Una nueva funcionalidad tendrá su propia carpeta dentro de `features/`. Solo llevaremos algo a `shared/` cuando sea común a varias funcionalidades. No crearemos carpetas vacías ni capas sin una responsabilidad concreta.

La futura conexión HTTP podrá vivir en `features/catalog/services/`, creada cuando Persona 3 implemente ese trabajo. Un contenedor podrá consultar ese servicio y pasar `apiData`, `apiLoading` y `apiError` a `HomeScreen`. Esta es una orientación de integración, no una implementación de la API.

El contrato actual de la pantalla se mantiene: `apiData` acepta un arreglo o `null`, `apiLoading` es booleano y `apiError` es un mensaje o `null`. Las tarjetas esperan `id`, `title`, `subtitle`, `description`, `image`, `badge` y `meta`. El normalizador actual tiene valores de respaldo; su ajuste a una API concreta corresponde a Persona 3.

La documentación original de Persona 2 muestra las rutas anteriores. Este documento registra el cambio de ubicación; no se modificaron sus entregables Word y PDF.

## Correspondencia de rutas

| Ruta anterior dentro de `src/` | Ruta actual dentro de `src/` |
| --- | --- |
| `screens/HomeScreen.js` | `features/catalog/screens/HomeScreen.js` |
| `components/ItemCard.js` | `features/catalog/components/ItemCard.js` |
| `components/CategoryFilter.js` | `features/catalog/components/CategoryFilter.js` |
| `data/mockData.js` | `features/catalog/data/mockData.js` |
| `normalizeItem` dentro de `data/mockData.js` | `features/catalog/adapters/normalizeItem.js` |
| `styles/theme.js` | `shared/styles/theme.js` |
