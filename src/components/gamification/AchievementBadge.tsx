import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, FontSizes, BorderRadius } from '../../constants/theme';
import { AchievementDefinition } from '../../types';

interface AchievementBadgeProps {
  achievement: AchievementDefinition;
  unlocked: boolean;
}

export function AchievementBadge({ achievement, unlocked }: AchievementBadgeProps) {
  return (
    <View style={[styles.badge, !unlocked && styles.locked]}>
      <Text style={[styles.icon, !unlocked && styles.lockedIcon]}>
        {achievement.icon}
      </Text>
      <Text
        style={[styles.name, !unlocked && styles.lockedText]}
        numberOfLines={1}
      >
        {achievement.name}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    gap: Spacing.xs,
    width: '30%',
  },
  locked: {
    opacity: 0.4,
  },
  icon: {
    fontSize: 28,
  },
  lockedIcon: {
    opacity: 0.5,
  },
  name: {
    fontSize: FontSizes.xs,
    color: Colors.text,
    fontWeight: '600',
    textAlign: 'center',
  },
  lockedText: {
    color: Colors.textMuted,
  },
});
