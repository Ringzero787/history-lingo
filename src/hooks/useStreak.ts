import { useEffect, useCallback } from 'react';
import { useAuthStore } from '../stores/authStore';
import { useGameStore } from '../stores/gameStore';
import { checkAndUpdateStreak, purchaseStreakFreeze, calculateStreakBonus } from '../services/gamification';

export function useStreak() {
  const { user } = useAuthStore();
  const {
    currentStreak,
    longestStreak,
    streakFreezes,
    setStreak,
    setLongestStreak,
    triggerStreakBroken,
  } = useGameStore();

  // Check streak on mount
  useEffect(() => {
    if (!user) return;

    checkAndUpdateStreak(user.uid)
      .then(({ currentStreak: streak, streakBroken }) => {
        setStreak(streak);
        if (streakBroken) {
          triggerStreakBroken();
        }
      })
      .catch(console.error);
  }, [user]);

  // Purchase a streak freeze
  const buyStreakFreeze = useCallback(async () => {
    if (!user) return false;
    const success = await purchaseStreakFreeze(user.uid);
    if (success) {
      useGameStore.getState().setStreakFreezes(streakFreezes + 1);
      useGameStore.getState().addXp(-200);
    }
    return success;
  }, [user, streakFreezes]);

  // Get streak bonus XP
  const streakBonus = calculateStreakBonus(currentStreak);

  return {
    currentStreak,
    longestStreak,
    streakFreezes,
    streakBonus,
    buyStreakFreeze,
  };
}
