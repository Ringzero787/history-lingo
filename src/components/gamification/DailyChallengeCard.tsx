import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing, FontSizes, BorderRadius, Shadows } from '../../constants/theme';
import { useAuthStore } from '../../stores/authStore';
import { fetchTodayChallenge, hasCompletedTodayChallenge } from '../../services/dailyChallenge';
import { DailyChallenge } from '../../types';

export function DailyChallengeCard() {
  const [challenge, setChallenge] = useState<DailyChallenge | null>(null);
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    async function load() {
      try {
        const todayChallenge = await fetchTodayChallenge();
        setChallenge(todayChallenge);
        if (todayChallenge && user?.uid) {
          const done = await hasCompletedTodayChallenge(user.uid);
          setCompleted(done);
        }
      } catch (err) {
        console.error('Failed to load daily challenge:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user?.uid]);

  if (loading || !challenge) return null;

  const handlePress = () => {
    if (!completed) {
      router.push({
        pathname: '/lesson/[id]',
        params: { id: challenge.lessonId, eraId: challenge.eraId },
      });
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={completed}
      style={({ pressed }) => [
        styles.card,
        pressed && !completed && styles.pressed,
        completed && styles.completedCard,
      ]}
    >
      <View style={styles.header}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Daily Challenge</Text>
        </View>
        {completed && <Text style={styles.checkmark}>✓</Text>}
      </View>

      <Text style={styles.title} numberOfLines={1}>
        {challenge.title}
      </Text>
      <Text style={styles.description} numberOfLines={2}>
        {challenge.description}
      </Text>

      <View style={styles.footer}>
        <View style={styles.eraBadge}>
          <Text style={styles.eraText}>{challenge.eraName}</Text>
        </View>
        <Text style={styles.bonus}>+{challenge.xpBonus} Bonus XP</Text>
      </View>

      {completed && (
        <Text style={styles.completedText}>Completed!</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    gap: Spacing.sm,
    borderWidth: 2,
    borderColor: Colors.xpGold + '40',
    ...Shadows.medium,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  completedCard: {
    opacity: 0.7,
    borderColor: Colors.success + '40',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badge: {
    backgroundColor: Colors.xpGold + '20',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  badgeText: {
    color: Colors.xpGold,
    fontSize: FontSizes.xs,
    fontWeight: '800',
  },
  checkmark: {
    fontSize: 20,
    color: Colors.success,
    fontWeight: '900',
  },
  title: {
    fontSize: FontSizes.lg,
    fontWeight: '800',
    color: Colors.text,
  },
  description: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  eraBadge: {
    backgroundColor: Colors.primary + '20',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  eraText: {
    color: Colors.primary,
    fontSize: FontSizes.xs,
    fontWeight: '700',
  },
  bonus: {
    color: Colors.xpGold,
    fontSize: FontSizes.sm,
    fontWeight: '700',
  },
  completedText: {
    color: Colors.success,
    fontSize: FontSizes.sm,
    fontWeight: '700',
    textAlign: 'center',
  },
});
