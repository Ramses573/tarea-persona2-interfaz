/**
 * Adapta los artículos de DEV al modelo que presenta ItemCard.
 * Las etiquetas se agrupan en las categorías ya utilizadas por CategoryFilter.
 */
const CATEGORY_TAGS = {
  Diseño: ['design', 'designsystems', 'ui', 'ux', 'userexperience'],
  Ciencia: ['science', 'research', 'biology', 'physics', 'chemistry'],
  Innovación: ['innovation', 'ai', 'opensource', 'startups'],
  Tecnología: ['technology', 'android', 'ios', 'mobile', 'expo', 'security'],
  Desarrollo: ['javascript', 'reactnative', 'typescript', 'webdev', 'programming'],
};

const getArticleCategory = (tags = []) => {
  const normalizedTags = new Set(
    (Array.isArray(tags) ? tags : String(tags).split(','))
      .map((tag) => String(tag).trim().toLowerCase())
      .filter(Boolean)
  );

  return (
    Object.entries(CATEGORY_TAGS).find(([, categoryTags]) =>
      categoryTags.some((tag) => normalizedTags.has(tag))
    )?.[0] || 'Desarrollo'
  );
};

export const normalizeItem = (rawItem, index = 0) => {
  const id = rawItem.id ?? index + 1;
  const firstTag = Array.isArray(rawItem.tag_list)
    ? rawItem.tag_list[0]
    : null;

  return {
    id: String(id),
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
      (rawItem.tag_list ? getArticleCategory(rawItem.tag_list) : null) ||
      'General',
    description:
      rawItem.description ||
      rawItem.body ||
      rawItem.status ||
      rawItem.email ||
      'Sin descripción disponible.',
    image:
      rawItem.image ||
      rawItem.cover_image ||
      rawItem.social_image ||
      rawItem.thumbnail ||
      rawItem.avatar ||
      `https://picsum.photos/seed/item-${id}/400/300`,
    badge:
      rawItem.badge ||
      rawItem.status ||
      firstTag?.toUpperCase() ||
      (rawItem.price ? `$${rawItem.price}` : 'Activo'),
    meta:
      rawItem.meta ||
      (rawItem.reading_time_minutes
        ? `Lectura: ${rawItem.reading_time_minutes} min`
        : null) ||
      rawItem.origin?.name ||
      (rawItem.rating?.rate
        ? `★ ${rawItem.rating.rate}`
        : `ID: ${id}`),
  };
};
