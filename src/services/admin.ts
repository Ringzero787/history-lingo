import { userDoc, userProgressCollection } from './firebase';
import firestore from '@react-native-firebase/firestore';

/** Delete all documents in a subcollection (batch delete) */
async function deleteSubcollection(uid: string, subcollection: string) {
  const ref = userDoc(uid).collection(subcollection);
  const snapshot = await ref.get();
  if (snapshot.empty) return;

  const batch = firestore().batch();
  snapshot.docs.forEach((doc) => batch.delete(doc.ref));
  await batch.commit();
}

/** Reset all progress — zeroes XP/level/streak/hearts/lessons, deletes progress + achievements subcollections */
export async function resetProgress(uid: string): Promise<void> {
  await userDoc(uid).update({
    xp: 0,
    level: 0,
    currentStreak: 0,
    longestStreak: 0,
    streakFreezes: 0,
    heartsRemaining: 5,
    heartsRegenAt: null,
    lessonsCompleted: 0,
    perfectLessons: 0,
    dailyXp: 0,
    weeklyXp: 0,
  });

  await deleteSubcollection(uid, 'progress');
  await deleteSubcollection(uid, 'achievements');
}

/** Nuclear option — delete user doc + all subcollections */
export async function resetEverything(uid: string): Promise<void> {
  await deleteSubcollection(uid, 'progress');
  await deleteSubcollection(uid, 'achievements');
  await userDoc(uid).delete();
}
