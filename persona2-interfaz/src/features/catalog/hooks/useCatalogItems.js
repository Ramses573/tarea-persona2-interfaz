import { useEffect, useState } from 'react';
import {
  CatalogApiError,
  fetchCatalogItems,
} from '../services/catalogApi';

const getDisplayError = (error) => {
  if (error instanceof CatalogApiError && error.type === 'http') {
    return `No se pudieron cargar los artículos (HTTP ${error.status}). Intenta más tarde.`;
  }

  if (error instanceof CatalogApiError && error.type === 'network') {
    return 'No fue posible conectar con la API. Revisa la conexión e intenta de nuevo.';
  }

  return 'La API devolvió una respuesta que no se pudo procesar.';
};

/** Administra la carga inicial y los estados de la API para el catálogo. */
export function useCatalogItems() {
  const [apiData, setApiData] = useState([]);
  const [apiLoading, setApiLoading] = useState(true);
  const [apiError, setApiError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    let isMounted = true;

    const loadItems = async () => {
      setApiLoading(true);
      setApiError(null);

      try {
        const items = await fetchCatalogItems({ signal: controller.signal });
        if (isMounted) {
          setApiData(items);
        }
      } catch (error) {
        if (!isMounted || error?.name === 'AbortError') {
          return;
        }

        setApiData([]);
        setApiError(getDisplayError(error));
      } finally {
        if (isMounted) {
          setApiLoading(false);
        }
      }
    };

    loadItems();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  return { apiData, apiLoading, apiError };
}
