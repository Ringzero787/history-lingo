import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, LayoutAnimation, Platform, UIManager } from 'react-native';
import { Colors, Spacing, FontSizes, BorderRadius } from '../../constants/theme';
import { HISTORY_CATEGORIES, HistoryCategory } from '../../constants/eras';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface EraSelectorProps {
  selectedEras: string[];
  onToggleEra: (topicId: string) => void;
  onBulkToggle: (topicIds: string[], selected: boolean) => void;
}

export function EraSelector({ selectedEras, onToggleEra, onBulkToggle }: EraSelectorProps) {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const toggleExpand = (categoryId: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedCategory((prev) => (prev === categoryId ? null : categoryId));
  };

  const getSelectedCount = (category: HistoryCategory) =>
    category.topics.filter((t) => selectedEras.includes(t.id)).length;

  const areAllSelected = (category: HistoryCategory) =>
    category.topics.every((t) => selectedEras.includes(t.id));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pick your interests</Text>
      <Text style={styles.subtitle}>Choose the history topics you want to explore</Text>
      <View style={styles.categoryList}>
        {HISTORY_CATEGORIES.map((category) => {
          const isExpanded = expandedCategory === category.id;
          const selectedCount = getSelectedCount(category);
          const allSelected = areAllSelected(category);

          return (
            <View key={category.id} style={styles.categoryWrapper}>
              {/* Category header */}
              <Pressable
                onPress={() => toggleExpand(category.id)}
                style={({ pressed }) => [
                  styles.categoryCard,
                  { borderColor: selectedCount > 0 ? category.color : Colors.surfaceLight },
                  selectedCount > 0 && { backgroundColor: category.color + '10' },
                  pressed && styles.cardPressed,
                ]}
              >
                <Text style={styles.categoryEmoji}>{category.emoji}</Text>
                <View style={styles.categoryInfo}>
                  <Text style={styles.categoryName}>{category.name}</Text>
                  <Text style={styles.categoryDescription}>{category.description}</Text>
                </View>
                {selectedCount > 0 && (
                  <View style={[styles.countBadge, { backgroundColor: category.color }]}>
                    <Text style={styles.countText}>{selectedCount}</Text>
                  </View>
                )}
                <Text style={styles.chevron}>{isExpanded ? '▲' : '▼'}</Text>
              </Pressable>

              {/* Expanded topics */}
              {isExpanded && (
                <View style={[styles.topicsContainer, { borderColor: category.color + '40' }]}>
                  {/* Select All / Deselect All */}
                  <Pressable
                    onPress={() => {
                      const topicIds = category.topics.map((t) => t.id);
                      onBulkToggle(topicIds, !allSelected);
                    }}
                    style={styles.selectAllButton}
                  >
                    <Text style={[styles.selectAllText, { color: category.color }]}>
                      {allSelected ? 'Deselect All' : 'Select All'}
                    </Text>
                  </Pressable>

                  {/* Topic chips */}
                  <View style={styles.topicGrid}>
                    {category.topics.map((topic) => {
                      const isSelected = selectedEras.includes(topic.id);
                      return (
                        <Pressable
                          key={topic.id}
                          onPress={() => onToggleEra(topic.id)}
                          style={({ pressed }) => [
                            styles.topicChip,
                            isSelected && { backgroundColor: category.color + '20', borderColor: category.color },
                            pressed && styles.chipPressed,
                          ]}
                        >
                          <Text style={styles.topicEmoji}>{topic.emoji}</Text>
                          <Text style={[styles.topicName, isSelected && { color: category.color, fontWeight: '700' }]}>
                            {topic.name}
                          </Text>
                          {isSelected && (
                            <Text style={[styles.chipCheck, { color: category.color }]}>✓</Text>
                          )}
                        </Pressable>
                      );
                    })}
                  </View>
                </View>
              )}
            </View>
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
  categoryList: {
    gap: Spacing.md,
  },
  categoryWrapper: {
    gap: 0,
  },
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 2,
    gap: Spacing.md,
  },
  cardPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  categoryEmoji: {
    fontSize: 28,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: FontSizes.md,
    fontWeight: '700',
    color: Colors.text,
  },
  categoryDescription: {
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  countBadge: {
    minWidth: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  countText: {
    color: Colors.textOnColor,
    fontWeight: '700',
    fontSize: 12,
  },
  chevron: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  topicsContainer: {
    marginTop: -2,
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderTopWidth: 0,
    borderBottomLeftRadius: BorderRadius.lg,
    borderBottomRightRadius: BorderRadius.lg,
    padding: Spacing.md,
    paddingTop: Spacing.sm,
  },
  selectAllButton: {
    alignSelf: 'flex-end',
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  selectAllText: {
    fontSize: FontSizes.sm,
    fontWeight: '700',
  },
  topicGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  topicChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceLight,
    borderRadius: BorderRadius.full,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderWidth: 1.5,
    borderColor: 'transparent',
    gap: 6,
  },
  chipPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.96 }],
  },
  topicEmoji: {
    fontSize: 16,
  },
  topicName: {
    fontSize: FontSizes.sm,
    color: Colors.text,
    fontWeight: '500',
  },
  chipCheck: {
    fontSize: 14,
    fontWeight: '700',
  },
});
