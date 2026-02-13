import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, FontSizes, BorderRadius, Shadows } from '../../src/constants/theme';
import { Card } from '../../src/components/ui/Card';
import { ProgressBar } from '../../src/components/ui/ProgressBar';
import { XPBadge } from '../../src/components/ui/XPBadge';
import { StreakCounter } from '../../src/components/gamification/StreakCounter';
import { XPAnimation } from '../../src/components/gamification/XPAnimation';
import { DailyChallengeCard } from '../../src/components/gamification/DailyChallengeCard';
import { useGameStore } from '../../src/stores/gameStore';
import { useUserStore } from '../../src/stores/userStore';
import { useStreak } from '../../src/hooks/useStreak';
import { getLevelTitle } from '../../src/constants/xp';
import { Button } from '../../src/components/ui/Button';

export default function HomeScreen() {
  const { xp, level, dailyXp, dailyGoal, heartsRemaining, pendingXpAnimation, clearXpAnimation } = useGameStore();
  const { profile } = useUserStore();
  const { currentStreak } = useStreak();
  const router = useRouter();

  const dailyProgress = Math.min(dailyXp / dailyGoal, 1);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>
              Hello, {profile?.displayName ?? 'Learner'}!
            </Text>
            <Text style={styles.levelTitle}>
              {getLevelTitle(level)} - Level {level}
            </Text>
          </View>
          <StreakCounter streak={currentStreak} size="md" />
        </View>

        {/* Hearts & XP */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.heartsText}>
              {'❤️'.repeat(heartsRemaining)}{'🖤'.repeat(Math.max(0, 5 - heartsRemaining))}
            </Text>
          </View>
          <XPBadge xp={xp} size="md" />
        </View>

        {/* Daily Goal */}
        <Card variant="elevated" style={styles.dailyGoalCard}>
          <View style={styles.dailyGoalHeader}>
            <Text style={styles.dailyGoalTitle}>Daily Goal</Text>
            <Text style={styles.dailyGoalProgress}>
              {dailyXp}/{dailyGoal} XP
            </Text>
          </View>
          <ProgressBar
            progress={dailyProgress}
            color={dailyProgress >= 1 ? Colors.success : Colors.primary}
            height={12}
          />
          {dailyProgress >= 1 && (
            <Text style={styles.goalComplete}>Daily goal achieved! 🎉</Text>
          )}
        </Card>

        {/* Daily Challenge */}
        <DailyChallengeCard />

        {/* Continue Learning */}
        <Card variant="elevated" style={styles.continueCard}>
          <Text style={styles.continueTitle}>Continue Learning</Text>
          <Text style={styles.continueSubtitle}>
            Pick up where you left off
          </Text>
          <Button
            title="Start Next Lesson"
            onPress={() => router.push('/(tabs)/timeline')}
            size="lg"
            fullWidth
          />
        </Card>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Pressable
            style={({ pressed }) => [styles.quickAction, pressed && styles.quickActionPressed]}
            onPress={() => router.push('/(tabs)/multiplayer')}
          >
            <Text style={styles.quickActionEmoji}>⚔️</Text>
            <Text style={styles.quickActionText}>Quick Battle</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [styles.quickAction, pressed && styles.quickActionPressed]}
            onPress={() => router.push('/(tabs)/leaderboard')}
          >
            <Text style={styles.quickActionEmoji}>🏆</Text>
            <Text style={styles.quickActionText}>Leaderboard</Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* XP Animation Overlay */}
      {pendingXpAnimation > 0 && (
        <XPAnimation amount={pendingXpAnimation} onComplete={clearXpAnimation} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    padding: Spacing.lg,
    gap: Spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: FontSizes.xl,
    fontWeight: '800',
    color: Colors.text,
  },
  levelTitle: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heartsText: {
    fontSize: 18,
    letterSpacing: 2,
  },
  dailyGoalCard: {
    gap: Spacing.sm,
  },
  dailyGoalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dailyGoalTitle: {
    fontSize: FontSizes.md,
    fontWeight: '700',
    color: Colors.text,
  },
  dailyGoalProgress: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  goalComplete: {
    fontSize: FontSizes.sm,
    color: Colors.success,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: Spacing.xs,
  },
  continueCard: {
    gap: Spacing.md,
  },
  continueTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '800',
    color: Colors.text,
  },
  continueSubtitle: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  quickActions: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  quickAction: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
    gap: Spacing.sm,
    ...Shadows.small,
  },
  quickActionPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.97 }],
  },
  quickActionEmoji: {
    fontSize: 32,
  },
  quickActionText: {
    fontSize: FontSizes.sm,
    fontWeight: '700',
    color: Colors.text,
  },
});
