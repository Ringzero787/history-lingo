import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors, Spacing, FontSizes, BorderRadius } from '../../src/constants/theme';
import { Card } from '../../src/components/ui/Card';
import { Button } from '../../src/components/ui/Button';
import { XPBadge } from '../../src/components/ui/XPBadge';
import { StreakCounter } from '../../src/components/gamification/StreakCounter';
import { useAuthStore } from '../../src/stores/authStore';
import { useUserStore } from '../../src/stores/userStore';
import { useGameStore } from '../../src/stores/gameStore';
import { signOut } from '../../src/services/auth';
import { getLevelTitle, xpForLevel } from '../../src/constants/xp';
import { ProgressBar } from '../../src/components/ui/ProgressBar';

export default function ProfileScreen() {
  const { user } = useAuthStore();
  const { profile } = useUserStore();
  const { xp, level, currentStreak, longestStreak, heartsRemaining } = useGameStore();
  const router = useRouter();

  const title = getLevelTitle(level);
  const nextLevelXp = xpForLevel(level + 1);
  const currentLevelXp = xpForLevel(level);
  const levelProgress = nextLevelXp > currentLevelXp
    ? (xp - currentLevelXp) / (nextLevelXp - currentLevelXp)
    : 0;

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await signOut();
          useAuthStore.getState().reset();
          useUserStore.getState().reset();
          useGameStore.getState().reset();
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {(profile?.displayName ?? 'L').charAt(0).toUpperCase()}
            </Text>
          </View>
          <Text style={styles.displayName}>{profile?.displayName ?? 'Learner'}</Text>
          <Text style={styles.email}>{user?.email}</Text>
          <View style={styles.titleBadge}>
            <Text style={styles.titleText}>{title}</Text>
          </View>
        </View>

        {/* Level Progress */}
        <Card variant="elevated" style={styles.levelCard}>
          <View style={styles.levelHeader}>
            <Text style={styles.levelLabel}>Level {level}</Text>
            <Text style={styles.levelXp}>{xp} / {nextLevelXp} XP</Text>
          </View>
          <ProgressBar progress={levelProgress} color={Colors.xpGold} height={10} />
        </Card>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <Card style={styles.statCard}>
            <XPBadge xp={xp} size="lg" />
            <Text style={styles.statLabel}>Total XP</Text>
          </Card>
          <Card style={styles.statCard}>
            <StreakCounter streak={currentStreak} size="lg" showLabel={false} />
            <Text style={styles.statLabel}>Current Streak</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={styles.statValue}>{longestStreak}</Text>
            <Text style={styles.statLabel}>Best Streak</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={styles.statValue}>{profile?.lessonsCompleted ?? 0}</Text>
            <Text style={styles.statLabel}>Lessons Done</Text>
          </Card>
        </View>

        {/* Sign Out */}
        <Button
          title="Sign Out"
          onPress={handleSignOut}
          variant="outline"
          size="lg"
          fullWidth
        />
      </ScrollView>
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
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.lg,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: FontSizes.hero,
    fontWeight: '900',
    color: Colors.text,
  },
  displayName: {
    fontSize: FontSizes.xl,
    fontWeight: '800',
    color: Colors.text,
  },
  email: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  titleBadge: {
    backgroundColor: Colors.primary + '20',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  titleText: {
    color: Colors.primary,
    fontWeight: '700',
    fontSize: FontSizes.sm,
  },
  levelCard: {
    gap: Spacing.sm,
  },
  levelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  levelLabel: {
    fontSize: FontSizes.md,
    fontWeight: '700',
    color: Colors.text,
  },
  levelXp: {
    fontSize: FontSizes.sm,
    color: Colors.xpGold,
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  statCard: {
    width: '47%',
    alignItems: 'center',
    gap: Spacing.sm,
    padding: Spacing.lg,
  },
  statValue: {
    fontSize: FontSizes.xxl,
    fontWeight: '900',
    color: Colors.text,
  },
  statLabel: {
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
});
