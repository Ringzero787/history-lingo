import { eraLessonsCollection, erasCollection, userProgressCollection, userDoc } from './firebase';
import firestore from '@react-native-firebase/firestore';
import { Lesson, Era, EraProgress, LessonResult } from '../types';
import { XP_REWARDS, calculateLevel } from '../constants/xp';

// Fetch all eras
export async function fetchEras(): Promise<Era[]> {
  const snapshot = await erasCollection.orderBy('order', 'asc').get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Era));
}

// Fetch lessons for an era
export async function fetchLessons(eraId: string): Promise<Lesson[]> {
  const snapshot = await eraLessonsCollection(eraId).orderBy('order', 'asc').get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Lesson));
}

// Fetch a single lesson
export async function fetchLesson(eraId: string, lessonId: string): Promise<Lesson | null> {
  const doc = await eraLessonsCollection(eraId).doc(lessonId).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() } as Lesson;
}

// Fetch user progress for all eras
export async function fetchUserProgress(uid: string): Promise<EraProgress[]> {
  const snapshot = await userProgressCollection(uid).get();
  return snapshot.docs.map(doc => doc.data() as EraProgress);
}

// Fetch user progress for a specific era
export async function fetchEraProgress(uid: string, eraId: string): Promise<EraProgress | null> {
  const doc = await userProgressCollection(uid).doc(eraId).get();
  if (!doc.exists) return null;
  return doc.data() as EraProgress;
}

// Submit lesson result and update user progress
export async function submitLessonResult(uid: string, result: LessonResult): Promise<{ totalXpEarned: number; newLevel: number }> {
  const { eraId, lessonId, correctAnswers, totalQuestions, perfectLesson } = result;

  // Calculate XP
  let xpEarned = correctAnswers * XP_REWARDS.CORRECT_ANSWER;
  if (perfectLesson) {
    xpEarned += XP_REWARDS.PERFECT_LESSON_BONUS;
  }

  const userRef = userDoc(uid);
  const progressRef = userProgressCollection(uid).doc(eraId);
  const today = new Date().toISOString().split('T')[0];

  // Run as a batch to ensure atomicity
  const batch = firestore().batch();

  // Update user XP, level, and stats
  batch.update(userRef, {
    xp: firestore.FieldValue.increment(xpEarned),
    lessonsCompleted: firestore.FieldValue.increment(1),
    lastActiveDate: today,
  });

  // Update era progress
  batch.set(
    progressRef,
    {
      eraId,
      completedLessons: firestore.FieldValue.increment(1),
      unlockedLessons: firestore.FieldValue.increment(1),
      bestScore: Math.round((correctAnswers / totalQuestions) * 100),
      totalXpEarned: firestore.FieldValue.increment(xpEarned),
      lastPlayed: firestore.Timestamp.now(),
    },
    { merge: true }
  );

  await batch.commit();

  // Read back the updated user to get new level
  const updatedUser = await userRef.get();
  const userData = updatedUser.data();
  const totalXp = userData?.xp ?? 0;
  const newLevel = calculateLevel(totalXp);

  // Update level if it changed
  if (userData?.level !== newLevel) {
    await userRef.update({ level: newLevel });
  }

  return { totalXpEarned: xpEarned, newLevel };
}
