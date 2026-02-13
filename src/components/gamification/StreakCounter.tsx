import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import { Colors, Spacing, FontSizes, BorderRadius } from '../../constants/theme';

interface StreakCounterProps {
  streak: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export function StreakCounter({ streak, size = 'md', showLabel = true }: StreakCounterProps) {
  const flameAnimStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: withRepeat(
          withSequence(
            withTiming(1.1, { duration: 800 }),
            withTiming(1.0, { duration: 800 })
          ),
          -1,
          true
        ),
      },
    ],
  }));

  const flameSizes = {
    sm: 20,
    md: 32,
    lg: 48,
  };

  const textSizes = {
    sm: FontSizes.sm,
    md: FontSizes.lg,
    lg: FontSizes.xxl,
  };

  return (
    <View style={styles.container}>
      <Animated.Text
        style={[
          { fontSize: flameSizes[size] },
          streak > 0 && flameAnimStyle,
        ]}
      >
        🔥
      </Animated.Text>
      <Text style={[styles.count, { fontSize: textSizes[size] }]}>
        {streak}
      </Text>
      {showLabel && (
        <Text style={styles.label}>
          {streak === 1 ? 'day' : 'days'}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  count: {
    color: Colors.streakOrange,
    fontWeight: '800',
  },
  label: {
    color: Colors.textSecondary,
    fontSize: FontSizes.sm,
  },
});
