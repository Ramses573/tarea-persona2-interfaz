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
