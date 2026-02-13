import { create } from 'zustand';
import { DailyGoal, DAILY_GOALS } from '../constants/xp';

interface GameState {
  // XP
  xp: number;
  level: number;
  dailyXp: number;
  dailyGoal: DailyGoal;

  // Streaks
  currentStreak: number;
  longestStreak: number;
  streakFreezes: number;

  // Hearts
  heartsRemaining: number;
  heartsRegenAt: Date | null;

  // UI state
  showLevelUpModal: boolean;
  pendingXpAnimation: number;
  showStreakBrokenModal: boolean;

  // Actions
  setXp: (xp: number) => void;
  addXp: (amount: number) => void;
  setLevel: (level: number) => void;
  setDailyXp: (xp: number) => void;
  addDailyXp: (amount: number) => void;
  setDailyGoal: (goal: DailyGoal) => void;
  setStreak: (streak: number) => void;
  setLongestStreak: (streak: number) => void;
  setStreakFreezes: (count: number) => void;
  setHearts: (hearts: number) => void;
  deductHeart: () => void;
  setHeartsRegenAt: (date: Date | null) => void;
  triggerLevelUp: () => void;
  dismissLevelUp: () => void;
  triggerXpAnimation: (amount: number) => void;
  clearXpAnimation: () => void;
  triggerStreakBroken: () => void;
  dismissStreakBroken: () => void;
  syncFromProfile: (data: {
    xp: number;
    level: number;
    currentStreak: number;
    longestStreak: number;
    streakFreezes: number;
    heartsRemaining: number;
    heartsRegenAt: Date | null;
  }) => void;
  reset: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  xp: 0,
  level: 0,
  dailyXp: 0,
  dailyGoal: DAILY_GOALS[1], // Default 50 XP

  currentStreak: 0,
  longestStreak: 0,
  streakFreezes: 0,

  heartsRemaining: 5,
  heartsRegenAt: null,

  showLevelUpModal: false,
  pendingXpAnimation: 0,
  showStreakBrokenModal: false,

  setXp: (xp) => set({ xp }),
  addXp: (amount) =>
    set((state) => ({ xp: state.xp + amount })),
  setLevel: (level) => set({ level }),
  setDailyXp: (dailyXp) => set({ dailyXp }),
  addDailyXp: (amount) =>
    set((state) => ({ dailyXp: state.dailyXp + amount })),
  setDailyGoal: (dailyGoal) => set({ dailyGoal }),
  setStreak: (currentStreak) => set({ currentStreak }),
  setLongestStreak: (longestStreak) => set({ longestStreak }),
  setStreakFreezes: (streakFreezes) => set({ streakFreezes }),
  setHearts: (heartsRemaining) => set({ heartsRemaining }),
  deductHeart: () =>
    set((state) => ({
      heartsRemaining: Math.max(0, state.heartsRemaining - 1),
    })),
  setHeartsRegenAt: (heartsRegenAt) => set({ heartsRegenAt }),
  triggerLevelUp: () => set({ showLevelUpModal: true }),
  dismissLevelUp: () => set({ showLevelUpModal: false }),
  triggerXpAnimation: (amount) => set({ pendingXpAnimation: amount }),
  clearXpAnimation: () => set({ pendingXpAnimation: 0 }),
  triggerStreakBroken: () => set({ showStreakBrokenModal: true }),
  dismissStreakBroken: () => set({ showStreakBrokenModal: false }),
  syncFromProfile: (data) =>
    set({
      xp: data.xp,
      level: data.level,
      currentStreak: data.currentStreak,
      longestStreak: data.longestStreak,
      streakFreezes: data.streakFreezes,
      heartsRemaining: data.heartsRemaining,
      heartsRegenAt: data.heartsRegenAt,
    }),
  reset: () =>
    set({
      xp: 0,
      level: 0,
      dailyXp: 0,
      dailyGoal: DAILY_GOALS[1],
      currentStreak: 0,
      longestStreak: 0,
      streakFreezes: 0,
      heartsRemaining: 5,
      heartsRegenAt: null,
      showLevelUpModal: false,
      pendingXpAnimation: 0,
      showStreakBrokenModal: false,
    }),
}));
