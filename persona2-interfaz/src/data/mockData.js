/**
 * Datos de prueba (Mock Data) - Persona 2
 * Diseñados con una estructura versátil para mostrar en el listado (FlatList)
 * y preparados para ser reemplazados fácilmente por la respuesta de la API REST (Persona 3).
 */

export const CATEGORIES = [
  'Todos',
  'Tecnología',
  'Ciencia',
  'Diseño',
  'Desarrollo',
  'Innovación',
];

export const MOCK_ITEMS = [
  {
    id: '1',
    title: 'Arquitectura React Native',
    subtitle: 'Desarrollo',
    description:
      'Comunicación eficiente entre JavaScript y componentes nativos mediante JSI, Fabric y TurboModules.',
    image: 'https://picsum.photos/seed/rn-arch/400/300',
    badge: 'Destacado',
    meta: 'Lectura: 5 min',
  },
  {
    id: '2',
    title: 'Componentes Nucleares (Core)',
    subtitle: 'Diseño',
    description:
      'Construcción de interfaces móviles multiplataforma empleando View, Text, Image, ScrollView y FlatList.',
    image: 'https://picsum.photos/seed/rn-core/400/300',
    badge: 'UI / UX',
    meta: 'Lectura: 4 min',
  },
  {
    id: '3',
    title: 'Gestión de Estado con useState',
    subtitle: 'Tecnología',
    description:
      'Control reactivo de datos locales dentro de componentes funcionales para actualizar la interfaz en tiempo real.',
    image: 'https://picsum.photos/seed/rn-state/400/300',
    badge: 'Hooks',
    meta: 'Lectura: 6 min',
  },
  {
    id: '4',
    title: 'Ciclo de Vida con useEffect',
    subtitle: 'Desarrollo',
    description:
      'Sincronización de efectos secundarios, temporizadores y peticiones asíncronas a servicios REST.',
    image: 'https://picsum.photos/seed/rn-effect/400/300',
    badge: 'Hooks',
    meta: 'Lectura: 7 min',
  },
  {
    id: '5',
    title: 'Listas Optimizadas con FlatList',
    subtitle: 'Innovación',
    description:
      'Renderizado perezoso (lazy rendering) para grandes volúmenes de datos provenientes de APIs externas.',
    image: 'https://picsum.photos/seed/rn-list/400/300',
    badge: 'Rendimiento',
    meta: 'Lectura: 5 min',
  },
  {
    id: '6',
    title: 'Estilizado con StyleSheet y Flexbox',
    subtitle: 'Diseño',
    description:
      'Diseño adaptable a diferentes tamaños de pantalla utilizando propiedades CSS-in-JS optimizadas.',
    image: 'https://picsum.photos/seed/rn-style/400/300',
    badge: 'Estilos',
    meta: 'Lectura: 4 min',
  },
  {
    id: '7',
    title: 'Integración con Servicios REST',
    subtitle: 'Ciencia',
    description:
      'Estructura preparada para recibir objetos JSON desde fetch() o axios y representarlos visualmente.',
    image: 'https://picsum.photos/seed/rn-api/400/300',
    badge: 'API Ready',
    meta: 'Lectura: 8 min',
  },
];

/**
 * Función adaptadora opcional para la Persona 3:
 * Convierte cualquier objeto proveniente de una API pública (Rick & Morty, FakeStore,
 * DummyJSON, JSONPlaceholder, etc.) al formato esperado por el componente ItemCard.
 */
export const normalizeItem = (rawItem, index = 0) => ({
  id: String(rawItem.id ?? index + 1),
  title:
    rawItem.title ||
    rawItem.name ||
    rawItem.username ||
    `Elemento #${index + 1}`,
  subtitle:
    rawItem.subtitle ||
    rawItem.category ||
    rawItem.species ||
    rawItem.company?.name ||
    'General',
  description:
    rawItem.description ||
    rawItem.body ||
    rawItem.status ||
    rawItem.email ||
    'Sin descripción disponible.',
  image:
    rawItem.image ||
    rawItem.thumbnail ||
    rawItem.avatar ||
    `https://picsum.photos/seed/item-${rawItem.id ?? index}/400/300`,
  badge:
    rawItem.badge ||
    rawItem.status ||
    (rawItem.price ? `$${rawItem.price}` : 'Activo'),
  meta:
    rawItem.meta ||
    rawItem.origin?.name ||
    (rawItem.rating?.rate ? `★ ${rawItem.rating.rate}` : `ID: ${rawItem.id ?? index + 1}`),
});
