import React from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { Colors, Spacing, FontSizes, BorderRadius } from '../../constants/theme';
import { ERA_DEFINITIONS } from '../../constants/eras';

interface EraSelectorProps {
  selectedEras: string[];
  onToggleEra: (eraId: string) => void;
}

export function EraSelector({ selectedEras, onToggleEra }: EraSelectorProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pick your interests</Text>
      <Text style={styles.subtitle}>Choose the history eras you want to explore</Text>
      <View style={styles.grid}>
        {ERA_DEFINITIONS.map((era) => {
          const isSelected = selectedEras.includes(era.id);
          return (
            <Pressable
              key={era.id}
              onPress={() => onToggleEra(era.id)}
              style={({ pressed }) => [
                styles.card,
                { borderColor: isSelected ? era.color : Colors.surfaceLight },
                isSelected && { backgroundColor: era.color + '15' },
                pressed && styles.cardPressed,
              ]}
            >
              <View style={[styles.iconCircle, { backgroundColor: era.color + '30' }]}>
                <Text style={styles.iconText}>
                  {era.order === 1 ? '🏛️' :
                   era.order === 2 ? '⚔️' :
                   era.order === 3 ? '🏟️' :
                   era.order === 4 ? '🏰' :
                   era.order === 5 ? '🎨' : '🌍'}
                </Text>
              </View>
              <Text style={[styles.eraName, isSelected && { color: era.color }]}>
                {era.name}
              </Text>
              <Text style={styles.eraDescription} numberOfLines={2}>
                {era.description}
              </Text>
              {isSelected && (
                <View style={[styles.checkmark, { backgroundColor: era.color }]}>
                  <Text style={styles.checkmarkText}>✓</Text>
                </View>
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: FontSizes.xl,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    marginBottom: Spacing.lg,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  card: {
    width: '47%',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 2,
    position: 'relative',
  },
  cardPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.97 }],
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  iconText: {
    fontSize: 24,
  },
  eraName: {
    fontSize: FontSizes.md,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  eraDescription: {
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
    lineHeight: 16,
  },
  checkmark: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkText: {
    color: Colors.text,
    fontWeight: '700',
    fontSize: 14,
  },
});
