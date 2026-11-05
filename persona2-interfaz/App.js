import React from 'react';
import HomeScreen from './src/features/catalog/screens/HomeScreen';
import { useCatalogItems } from './src/features/catalog/hooks/useCatalogItems';

/**
 * Punto de entrada de la aplicación - Persona 2
 * Conecta el estado de la API REST con la pantalla principal del catálogo.
 */
export default function App() {
  const { apiData, apiLoading, apiError } = useCatalogItems();

  return (
    <HomeScreen
      apiData={apiData}
      apiLoading={apiLoading}
      apiError={apiError}
    />
  );
}
