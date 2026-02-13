import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

type Timestamp = FirebaseFirestoreTypes.Timestamp;

// ---------------------------------------------------------------------------
// Age groups
// ---------------------------------------------------------------------------
export type AgeGroup = "under13" | "13-17" | "18-25" | "26-40" | "40+";
export type SkillLevel = "beginner" | "intermediate" | "advanced";
export type AgeCategory = "child" | "teen" | "adult";

// ---------------------------------------------------------------------------
// User preferences
// ---------------------------------------------------------------------------
export interface UserPreferences {
  eras: string[];
  interests: string[];
}

// ---------------------------------------------------------------------------
// User profile - matches Firestore users/{uid}
// ---------------------------------------------------------------------------
export interface UserProfile {
  displayName: string;
  email: string;
  avatarUrl: string;
  age: AgeGroup;
  skillLevel: SkillLevel;
  preferences: UserPreferences;
  xp: number;
  level: number;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string; // "2026-02-12"
  streakFreezes: number;
  heartsRemaining: number;
  heartsRegenAt: Timestamp | null;
  lessonsCompleted: number;
  perfectLessons: number;
  dailyXp: number;
  weeklyXp: number;
  createdAt: Timestamp;
}

// ---------------------------------------------------------------------------
// User progress per era - matches users/{uid}/progress/{eraId}
// ---------------------------------------------------------------------------
export interface EraProgress {
  eraId: string;
  unlockedLessons: number;
  completedLessons: number;
  bestScore: number;
  totalXpEarned: number;
  lastPlayed: Timestamp;
}

// ---------------------------------------------------------------------------
// Era definition - matches eras/{eraId}
// ---------------------------------------------------------------------------
export interface Era {
  id: string;
  name: string;
  description: string;
  iconUrl: string;
  color: string;
  order: number;
  totalLessons: number;
  requiredXpToUnlock: number;
  subcategories: string[];
}

// ---------------------------------------------------------------------------
// Question types (discriminated union)
// ---------------------------------------------------------------------------
export interface MultipleChoiceQuestion {
  type: "multiple_choice";
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  imageUrl?: string;
}

export interface TimelineOrderQuestion {
  type: "timeline_order";
  prompt: string;
  events: { text: string; year: number }[];
  explanation: string;
}

export interface TrueFalseQuestion {
  type: "true_false";
  statement: string;
  correct: boolean;
  explanation: string;
}

export interface FillInBlankQuestion {
  type: "fill_blank";
  template: string;
  answer: string;
  acceptableAnswers: string[];
  explanation: string;
}

export interface WhoSaidItQuestion {
  type: "who_said_it";
  quote: string;
  options: string[];
  correctIndex: number;
  context: string;
}

export interface StoryCompletionQuestion {
  type: "story_completion";
  narrative: string;
  blanks: { answer: string; acceptableAnswers: string[] }[];
  explanation: string;
}

export type Question =
  | MultipleChoiceQuestion
  | TimelineOrderQuestion
  | TrueFalseQuestion
  | FillInBlankQuestion
  | WhoSaidItQuestion
  | StoryCompletionQuestion;

// ---------------------------------------------------------------------------
// Lesson - matches eras/{eraId}/lessons/{lessonId}
// ---------------------------------------------------------------------------
export interface Lesson {
  id: string;
  title: string;
  description: string;
  difficulty: SkillLevel;
  ageGroup: AgeCategory;
  order: number;
  xpReward: number;
  estimatedMinutes: number;
  questions: Question[];
  funFacts: string[];
  generatedBy: "gemini-2.5-flash-lite";
  generatedAt: Timestamp;
  reviewed: boolean;
}

// ---------------------------------------------------------------------------
// Leaderboard entry
// ---------------------------------------------------------------------------
export interface LeaderboardEntry {
  uid: string;
  displayName: string;
  avatarUrl: string;
  xp: number;
  level: number;
}

// ---------------------------------------------------------------------------
// Leaderboard - matches leaderboard/{period}
// ---------------------------------------------------------------------------
export type LeaderboardPeriod = "daily" | "weekly" | "alltime";

export interface Leaderboard {
  updatedAt: Timestamp;
  rankings: LeaderboardEntry[];
}

// ---------------------------------------------------------------------------
// Battle player
// ---------------------------------------------------------------------------
export interface BattlePlayer {
  uid: string;
  displayName: string;
  score: number;
  finished: boolean;
}

// ---------------------------------------------------------------------------
// Battle - matches battles/{battleId}
// ---------------------------------------------------------------------------
export type BattleStatus = "waiting" | "active" | "completed";

export interface Battle {
  players: BattlePlayer[];
  eraId: string;
  questions: Question[];
  status: BattleStatus;
  createdAt: Timestamp;
  expiresAt: Timestamp;
  winnerId: string | null;
}

// ---------------------------------------------------------------------------
// Lesson result (after completing a lesson)
// ---------------------------------------------------------------------------
export interface LessonResult {
  lessonId: string;
  eraId: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  xpEarned: number;
  perfectLesson: boolean;
  timeSpentSeconds: number;
}

// ---------------------------------------------------------------------------
// Achievements
// ---------------------------------------------------------------------------
export type AchievementCategory = 'learning' | 'streak' | 'mastery' | 'level' | 'xp';

export interface AchievementCondition {
  field: string; // field on UserProfile to check (e.g. 'lessonsCompleted')
  threshold: number;
}

export interface AchievementDefinition {
  id: string;
  name: string;
  description: string;
  icon: string; // emoji
  category: AchievementCategory;
  xpReward: number;
  condition: AchievementCondition;
}

export interface UserAchievement {
  achievementId: string;
  unlockedAt: Timestamp;
  xpRewarded: number;
}

// ---------------------------------------------------------------------------
// Daily Challenge
// ---------------------------------------------------------------------------
export interface DailyChallenge {
  date: string; // "2026-02-12"
  eraId: string;
  eraName: string;
  lessonId: string;
  title: string;
  description: string;
  xpBonus: number;
  createdAt: Timestamp;
}

export interface DailyChallengeCompletion {
  date: string;
  lessonId: string;
  xpEarned: number;
  completedAt: Timestamp;
}

// ---------------------------------------------------------------------------
// Level title helper
// ---------------------------------------------------------------------------
export type LevelTitle = "Novice" | "Scholar" | "Historian" | "Professor" | "Grandmaster";
