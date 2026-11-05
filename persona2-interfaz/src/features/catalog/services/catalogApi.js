const ARTICLES_ENDPOINT =
  'https://dev.to/api/articles?tag=reactnative&per_page=30';

/** Error de dominio que permite distinguir errores HTTP y de formato. */
export class CatalogApiError extends Error {
  constructor(message, type, status = null) {
    super(message);
    this.name = 'CatalogApiError';
    this.type = type;
    this.status = status;
  }
}

/**
 * Obtiene artículos públicos de DEV relacionados con React Native.
 * La conversión al modelo visual se realiza en el adaptador normalizeItem.
 */
export async function fetchCatalogItems({ signal } = {}) {
  let response;

  try {
    response = await fetch(ARTICLES_ENDPOINT, {
      method: 'GET',
      headers: {
        Accept: 'application/vnd.forem.api-v1+json',
      },
      signal,
    });
  } catch (error) {
    if (error?.name === 'AbortError') {
      throw error;
    }

    throw new CatalogApiError(
      'No se pudo conectar con el servicio de artículos.',
      'network'
    );
  }

  if (!response.ok) {
    throw new CatalogApiError(
      `El servicio respondió con el estado HTTP ${response.status}.`,
      'http',
      response.status
    );
  }

  let payload;
  try {
    payload = await response.json();
  } catch {
    throw new CatalogApiError(
      'El servicio devolvió una respuesta JSON inválida.',
      'invalid-json'
    );
  }

  if (!Array.isArray(payload)) {
    throw new CatalogApiError(
      'El servicio devolvió un formato de datos inesperado.',
      'invalid-data'
    );
  }

  // Un arreglo vacío es una respuesta válida y se muestra como lista vacía.
  return payload;
}
