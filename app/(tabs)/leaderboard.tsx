import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, FontSizes, BorderRadius } from '../../src/constants/theme';
import { LeaderboardRow } from '../../src/components/gamification/LeaderboardRow';
import { leaderboardCollection } from '../../src/services/firebase';
import { useAuthStore } from '../../src/stores/authStore';
import { LeaderboardEntry, LeaderboardPeriod } from '../../src/types';

const PERIODS: { value: LeaderboardPeriod; label: string }[] = [
  { value: 'daily', label: 'Today' },
  { value: 'weekly', label: 'This Week' },
  { value: 'alltime', label: 'All Time' },
];

export default function LeaderboardScreen() {
  const [period, setPeriod] = useState<LeaderboardPeriod>('weekly');
  const [rankings, setRankings] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    setLoading(true);
    const unsubscribe = leaderboardCollection.doc(period).onSnapshot(
      (doc) => {
        if (doc.exists) {
          const data = doc.data();
          setRankings(data?.rankings ?? []);
        } else {
          setRankings([]);
        }
        setLoading(false);
      },
      (error) => {
        console.error('Leaderboard error:', error);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [period]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Text style={styles.title}>Leaderboard</Text>

      {/* Period Tabs */}
      <View style={styles.tabs}>
        {PERIODS.map((p) => (
          <Pressable
            key={p.value}
            onPress={() => setPeriod(p.value)}
            style={[
              styles.tab,
              period === p.value && styles.activeTab,
            ]}
          >
            <Text style={[styles.tabText, period === p.value && styles.activeTabText]}>
              {p.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {loading ? (
          <Text style={styles.loadingText}>Loading rankings...</Text>
        ) : rankings.length > 0 ? (
          rankings.map((entry, index) => (
            <LeaderboardRow
              key={entry.uid}
              entry={entry}
              rank={index + 1}
              isCurrentUser={entry.uid === user?.uid}
            />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🏆</Text>
            <Text style={styles.emptyText}>No rankings yet</Text>
            <Text style={styles.emptySubtext}>Complete lessons to appear on the leaderboard!</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  title: {
    fontSize: FontSizes.xxl,
    fontWeight: '900',
    color: Colors.text,
    padding: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  tab: {
    flex: 1,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    backgroundColor: Colors.surface,
  },
  activeTab: {
    backgroundColor: Colors.primary,
  },
  tabText: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  activeTabText: {
    color: Colors.text,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingTop: 0,
  },
  loadingText: {
    color: Colors.textSecondary,
    fontSize: FontSizes.md,
    textAlign: 'center',
    padding: Spacing.xl,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: Spacing.md,
  },
  emptyText: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  emptySubtext: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});
