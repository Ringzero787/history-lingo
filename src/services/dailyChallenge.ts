import firestore from '@react-native-firebase/firestore';
import { db, userDoc } from './firebase';
import { DailyChallenge, DailyChallengeCompletion } from '../types';
import { XP_REWARDS } from '../constants/xp';

const dailyChallengesCollection = db.collection('dailyChallenges');

function getTodayString(): string {
  return new Date().toISOString().split('T')[0];
}

// Fetch today's daily challenge
export async function fetchTodayChallenge(): Promise<DailyChallenge | null> {
  const today = getTodayString();
  const doc = await dailyChallengesCollection.doc(today).get();
  if (!doc.exists) return null;
  return doc.data() as DailyChallenge;
}

// Check if user has completed today's challenge
export async function hasCompletedTodayChallenge(uid: string): Promise<boolean> {
  const today = getTodayString();
  const doc = await userDoc(uid)
    .collection('dailyChallengeCompletions')
    .doc(today)
    .get();
  return doc.exists;
}

// Record daily challenge completion and award bonus XP
export async function completeDailyChallenge(
  uid: string,
  lessonId: string,
  xpEarned: number
): Promise<void> {
  const today = getTodayString();
  const bonus = XP_REWARDS.DAILY_CHALLENGE_BONUS;

  const batch = firestore().batch();

  // Record completion
  const completionRef = userDoc(uid)
    .collection('dailyChallengeCompletions')
    .doc(today);
  batch.set(completionRef, {
    date: today,
    lessonId,
    xpEarned: xpEarned + bonus,
    completedAt: firestore.Timestamp.now(),
  } as DailyChallengeCompletion);

  // Award bonus XP
  batch.update(userDoc(uid), {
    xp: firestore.FieldValue.increment(bonus),
    dailyXp: firestore.FieldValue.increment(bonus),
    weeklyXp: firestore.FieldValue.increment(bonus),
  });

  await batch.commit();
}
