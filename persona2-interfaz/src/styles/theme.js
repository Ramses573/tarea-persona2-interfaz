import { StyleSheet, Platform } from 'react-native';

/**
 * Paleta de colores, espaciados y estilos globales - Persona 2
 */
export const COLORS = {
  primary: '#2563EB',      // Azul principal
  primaryLight: '#DBEAFE', // Fondo azul suave para etiquetas
  secondary: '#0F172A',    // Texto oscuro principal
  textMuted: '#64748B',    // Texto secundario / subtítulos
  background: '#F8FAFC',   // Fondo general de la aplicación
  surface: '#FFFFFF',      // Fondo de tarjetas y encabezados
  border: '#E2E8F0',       // Bordes sutiles
  accent: '#10B981',       // Verde para indicadores de estado
  favorite: '#EF4444',     // Rojo para marcador de favoritos
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
};

export const globalStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: Platform.OS === 'android' ? 32 : 0,
  },
  screenContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 3,
  },
});
