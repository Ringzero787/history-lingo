import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, FontSizes, BorderRadius } from '../../constants/theme';
import { formatNumber } from '../../utils/formatters';

interface XPBadgeProps {
  xp: number;
  size?: 'sm' | 'md' | 'lg';
  showPlus?: boolean;
}

export function XPBadge({ xp, size = 'md', showPlus = false }: XPBadgeProps) {
  return (
    <View style={[styles.badge, styles[`badge_${size}`]]}>
      <Text style={[styles.text, styles[`text_${size}`]]}>
        {showPlus && xp > 0 ? '+' : ''}{formatNumber(xp)} XP
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    backgroundColor: Colors.xpGold + '20',
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.xpGold + '40',
    alignSelf: 'flex-start',
  },
  badge_sm: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
  },
  badge_md: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  badge_lg: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
  text: {
    color: Colors.xpGold,
    fontWeight: '700',
  },
  text_sm: {
    fontSize: FontSizes.xs,
  },
  text_md: {
    fontSize: FontSizes.sm,
  },
  text_lg: {
    fontSize: FontSizes.md,
  },
});
