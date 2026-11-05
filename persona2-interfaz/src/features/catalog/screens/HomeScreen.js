import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import ItemCard from '../components/ItemCard';
import CategoryFilter from '../components/CategoryFilter';
import { MOCK_ITEMS, CATEGORIES } from '../data/mockData';
import { normalizeItem } from '../adapters/normalizeItem';
import { COLORS, SPACING, globalStyles } from '../../../shared/styles/theme';

/**
 * Pantalla Principal (HomeScreen) - Persona 2
 *
 * Implementa:
 * - Arquitectura modular basada en componentes funcionales.
 * - Hooks useState y useEffect para manejo de estado y ciclo de vida.
 * - Componentes principales: View, Text, FlatList, ScrollView (en CategoryFilter),
 *   Image (en ItemCard) y StyleSheet.
 * - Preparada para recibir datos desde la API REST de la Persona 3 mediante props
 *   desde un contenedor externo, sin agregar llamadas HTTP a esta pantalla.
 */
export default function HomeScreen(props = {}) {
  const { apiData = null, apiLoading = false, apiError = null } = props;
  const hasApiProps =
    Object.prototype.hasOwnProperty.call(props, 'apiData') ||
    Object.prototype.hasOwnProperty.call(props, 'apiLoading') ||
    Object.prototype.hasOwnProperty.call(props, 'apiError');

  // 1. Estados locales con useState
  const [items, setItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [favorites, setFavorites] = useState([]);
  const [isMockLoading, setIsMockLoading] = useState(true);
  const isLoading = hasApiProps ? apiLoading : isMockLoading;

  // 2. Efecto con useEffect para cargar datos de prueba o sincronizar datos de la API (Persona 3)
  useEffect(() => {
    if (hasApiProps) {
      // Mientras la API carga, apiLoading controla la vista y no se muestra una lista vacía.
      if (apiLoading) {
        return;
      }

      // Un error no debe mostrarse como una respuesta exitosa sin registros.
      if (apiError) {
        setItems([]);
        return;
      }

      if (Array.isArray(apiData)) {
        const normalized = apiData.map((item, idx) => normalizeItem(item, idx));
        setItems(normalized);
      } else {
        setItems([]);
      }

      return;
    }

    // Simulación de carga inicial con datos de prueba (Entregable Persona 2)
    const timer = setTimeout(() => {
      setItems(MOCK_ITEMS);
      setIsMockLoading(false);
    }, 500);

    // Función de limpieza del efecto
    return () => clearTimeout(timer);
  }, [hasApiProps, apiData, apiLoading, apiError]);

  // Alternar elementos marcados como favoritos
  const handleToggleFavorite = (id) => {
    setFavorites((prevFavorites) =>
      prevFavorites.includes(id)
        ? prevFavorites.filter((favId) => favId !== id)
        : [...prevFavorites, id]
    );
  };

  // Filtrado de datos según la categoría seleccionada
  const filteredItems = apiError
    ? []
    : selectedCategory === 'Todos'
      ? items
      : items.filter(
          (item) =>
            item.subtitle?.toLowerCase() === selectedCategory.toLowerCase()
        );

  // Encabezado del listado principal
  const renderHeader = () => (
    <View>
      <View style={styles.headerContainer}>
        <View>
          <Text style={styles.headerSubtitle}>PROYECTO REACT NATIVE</Text>
          <Text style={styles.headerTitle}>Catálogo de Elementos</Text>
        </View>
        <View style={styles.counterBadge}>
          <Text style={styles.counterText}>
            {filteredItems.length} reg. | ♥ {favorites.length}
          </Text>
        </View>
      </View>

      {/* Filtro horizontal implementado con ScrollView */}
      <CategoryFilter
        categories={CATEGORIES}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {apiError ? (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{apiError}</Text>
        </View>
      ) : null}
    </View>
  );

  // Vista cuando no existen coincidencias en el listado
  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>No se encontraron elementos</Text>
      <Text style={styles.emptyDescription}>
        No hay registros disponibles para la categoría "{selectedCategory}".
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      <View style={globalStyles.screenContainer}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loadingText}>Cargando interfaz y datos...</Text>
          </View>
        ) : (
          <FlatList
            data={filteredItems}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => (
              <ItemCard
                item={item}
                isFavorite={favorites.includes(item.id)}
                onToggleFavorite={handleToggleFavorite}
              />
            )}
            ListHeaderComponent={renderHeader}
            ListEmptyComponent={apiError ? null : renderEmptyList}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  headerSubtitle: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
    letterSpacing: 1,
    marginBottom: 2,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.secondary,
  },
  counterBadge: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    borderRadius: 16,
  },
  counterText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
  },
  listContent: {
    paddingBottom: SPACING.xl,
  },
  separator: {
    height: SPACING.md + 2,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  loadingText: {
    marginTop: SPACING.md,
    fontSize: 14,
    color: COLORS.textMuted,
    fontWeight: '500',
  },
  emptyContainer: {
    padding: SPACING.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.xl,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.secondary,
    marginBottom: SPACING.xs,
  },
  emptyDescription: {
    fontSize: 14,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
  errorBanner: {
    backgroundColor: '#FEE2E2',
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
    padding: SPACING.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  errorText: {
    color: '#991B1B',
    fontSize: 13,
    fontWeight: '600',
  },
});
