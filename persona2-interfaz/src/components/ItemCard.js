import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { COLORS, SPACING, globalStyles } from '../styles/theme';

/**
 * Componente ItemCard - Persona 2
 * Diseñado para mostrar un registro individual dentro del FlatList.
 * Utiliza los componentes principales: View, Text, Image y StyleSheet.
 *
 * @param {Object} props
 * @param {Object} props.item - Objeto con los datos del elemento (id, title, subtitle, description, image, badge, meta)
 * @param {boolean} props.isFavorite - Indica si el elemento está marcado como favorito
 * @param {Function} props.onToggleFavorite - Callback al pulsar el botón de favorito
 * @param {Function} props.onPress - Callback al seleccionar la tarjeta
 */
export default function ItemCard({
  item,
  isFavorite = false,
  onToggleFavorite,
  onPress,
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={() => onPress && onPress(item)}
      style={[styles.card, globalStyles.shadow]}
    >
      {/* Imagen del elemento */}
      <View style={styles.imageWrapper}>
        <Image
          source={{ uri: item.image }}
          style={styles.image}
          resizeMode="cover"
        />
        {item.badge ? (
          <View style={styles.badgeContainer}>
            <Text style={styles.badgeText}>{item.badge}</Text>
          </View>
        ) : null}
      </View>

      {/* Contenido textual de la tarjeta */}
      <View style={styles.contentContainer}>
        <View style={styles.headerRow}>
          <Text style={styles.subtitle} numberOfLines={1}>
            {item.subtitle?.toUpperCase()}
          </Text>

          {onToggleFavorite && (
            <TouchableOpacity
              onPress={() => onToggleFavorite(item.id)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              style={styles.favoriteButton}
            >
              <Text
                style={[
                  styles.favoriteIcon,
                  isFavorite && styles.favoriteIconActive,
                ]}
              >
                {isFavorite ? '♥ Guardado' : '♡ Guardar'}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>

        <Text style={styles.description} numberOfLines={3}>
          {item.description}
        </Text>

        {/* Pie de tarjeta con metadatos */}
        <View style={styles.footerRow}>
          <View style={styles.statusDot} />
          <Text style={styles.metaText}>{item.meta || `ID: ${item.id}`}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    marginHorizontal: SPACING.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  imageWrapper: {
    position: 'relative',
    width: '100%',
    height: 165,
    backgroundColor: '#E2E8F0',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  badgeContainer: {
    position: 'absolute',
    top: SPACING.sm,
    left: SPACING.sm,
    backgroundColor: 'rgba(15, 23, 42, 0.82)',
    paddingHorizontal: SPACING.sm + 2,
    paddingVertical: SPACING.xs,
    borderRadius: 6,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  contentContainer: {
    padding: SPACING.lg,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
    letterSpacing: 0.8,
    flex: 1,
  },
  favoriteButton: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
  },
  favoriteIcon: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  favoriteIconActive: {
    color: COLORS.favorite,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.secondary,
    marginBottom: SPACING.xs + 2,
    lineHeight: 24,
  },
  description: {
    fontSize: 14,
    color: COLORS.textMuted,
    lineHeight: 20,
    marginBottom: SPACING.md,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: SPACING.sm,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.accent,
    marginRight: SPACING.sm,
  },
  metaText: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontWeight: '500',
  },
});
