// XP rewards for various actions
export const XP_REWARDS = {
  CORRECT_ANSWER: 10,
  PERFECT_LESSON_BONUS: 50,
  DAILY_STREAK_BONUS_PER_DAY: 5,
  DAILY_STREAK_BONUS_CAP: 50,
  FIRST_LESSON_OF_DAY: 20,
  WIN_MULTIPLAYER_BATTLE: 100,
  LOSE_MULTIPLAYER_BATTLE: 25,
  COMPLETE_ERA: 500,
  DAILY_CHALLENGE_BONUS: 50,
} as const;

// Level formula: level = floor(sqrt(totalXP / 100))
export function calculateLevel(totalXP: number): number {
  return Math.floor(Math.sqrt(totalXP / 100));
}

// XP needed for a specific level
export function xpForLevel(level: number): number {
  return level * level * 100;
}

// Level titles based on level ranges
export type LevelTitle = 'Novice' | 'Scholar' | 'Historian' | 'Professor' | 'Grandmaster';

export function getLevelTitle(level: number): LevelTitle {
  if (level <= 5) return 'Novice';
  if (level <= 15) return 'Scholar';
  if (level <= 30) return 'Historian';
  if (level <= 50) return 'Professor';
  return 'Grandmaster';
}

// Hearts / Lives system
export const HEARTS = {
  MAX_HEARTS: 5,
  REGEN_TIME_MINUTES: 30,
} as const;

// Streak freeze cost in XP
export const STREAK_FREEZE_COST = 200;

// Daily XP goals
export const DAILY_GOALS = [30, 50, 100] as const;
export type DailyGoal = typeof DAILY_GOALS[number];
