import { userDoc } from './firebase';
import firestore from '@react-native-firebase/firestore';
import { XP_REWARDS, STREAK_FREEZE_COST, HEARTS } from '../constants/xp';

// Check and update streak for today
export async function checkAndUpdateStreak(uid: string): Promise<{
  currentStreak: number;
  isNewDay: boolean;
  streakBroken: boolean;
}> {
  const ref = userDoc(uid);
  const doc = await ref.get();
  const data = doc.data();

  if (!data) {
    return { currentStreak: 0, isNewDay: false, streakBroken: false };
  }

  const today = new Date().toISOString().split('T')[0];
  const lastActive = data.lastActiveDate;

  // Already active today
  if (lastActive === today) {
    return { currentStreak: data.currentStreak, isNewDay: false, streakBroken: false };
  }

  // Check if yesterday
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  if (lastActive === yesterdayStr) {
    // Continue streak
    const newStreak = data.currentStreak + 1;
    const longestStreak = Math.max(newStreak, data.longestStreak);
    await ref.update({
      currentStreak: newStreak,
      longestStreak,
      lastActiveDate: today,
    });
    return { currentStreak: newStreak, isNewDay: true, streakBroken: false };
  }

  // Streak broken - check for freeze
  if (data.streakFreezes > 0) {
    await ref.update({
      streakFreezes: firestore.FieldValue.increment(-1),
      lastActiveDate: today,
    });
    return { currentStreak: data.currentStreak, isNewDay: true, streakBroken: false };
  }

  // Streak reset
  await ref.update({
    currentStreak: 1,
    lastActiveDate: today,
  });
  return { currentStreak: 1, isNewDay: true, streakBroken: true };
}

// Purchase a streak freeze using XP
export async function purchaseStreakFreeze(uid: string): Promise<boolean> {
  const ref = userDoc(uid);
  const doc = await ref.get();
  const data = doc.data();

  if (!data || data.xp < STREAK_FREEZE_COST) {
    return false;
  }

  await ref.update({
    xp: firestore.FieldValue.increment(-STREAK_FREEZE_COST),
    streakFreezes: firestore.FieldValue.increment(1),
  });

  return true;
}

// Calculate daily streak bonus
export function calculateStreakBonus(streakDays: number): number {
  return Math.min(
    streakDays * XP_REWARDS.DAILY_STREAK_BONUS_PER_DAY,
    XP_REWARDS.DAILY_STREAK_BONUS_CAP
  );
}

// Deduct a heart (on wrong answer)
export async function deductHeart(uid: string): Promise<{ heartsRemaining: number }> {
  const ref = userDoc(uid);
  const doc = await ref.get();
  const data = doc.data();

  if (!data) return { heartsRemaining: 0 };

  const hearts = data.heartsRemaining;
  if (hearts <= 0) return { heartsRemaining: 0 };

  const newHearts = hearts - 1;
  const update: Record<string, any> = {
    heartsRemaining: newHearts,
  };

  // If hearts just hit 0, set regen timer
  if (newHearts === 0) {
    const regenTime = new Date();
    regenTime.setMinutes(regenTime.getMinutes() + HEARTS.REGEN_TIME_MINUTES);
    update.heartsRegenAt = firestore.Timestamp.fromDate(regenTime);
  }

  await ref.update(update);
  return { heartsRemaining: newHearts };
}

// Check if hearts have regenerated
export async function checkHeartRegen(uid: string): Promise<number> {
  const ref = userDoc(uid);
  const doc = await ref.get();
  const data = doc.data();

  if (!data) return 0;

  if (data.heartsRemaining >= HEARTS.MAX_HEARTS) {
    return data.heartsRemaining;
  }

  if (data.heartsRegenAt && data.heartsRegenAt.toDate() <= new Date()) {
    await ref.update({
      heartsRemaining: HEARTS.MAX_HEARTS,
      heartsRegenAt: null,
    });
    return HEARTS.MAX_HEARTS;
  }

  return data.heartsRemaining;
}
