import firestore from '@react-native-firebase/firestore';
import { userDoc } from './firebase';
import { ACHIEVEMENTS } from '../constants/achievements';
import { AchievementDefinition, UserAchievement, UserProfile } from '../types';

// Fetch all achievements a user has earned
export async function fetchUserAchievements(uid: string): Promise<UserAchievement[]> {
  const snapshot = await userDoc(uid).collection('achievements').get();
  return snapshot.docs.map((doc) => doc.data() as UserAchievement);
}

// Check all achievement conditions against current user stats
// Returns newly unlocked achievements (if any)
export async function checkAchievements(
  uid: string,
  stats: Partial<UserProfile> & { level?: number; xp?: number }
): Promise<AchievementDefinition[]> {
  // Get already earned achievements
  const earned = await fetchUserAchievements(uid);
  const earnedIds = new Set(earned.map((a) => a.achievementId));

  const newlyUnlocked: AchievementDefinition[] = [];

  for (const achievement of ACHIEVEMENTS) {
    if (earnedIds.has(achievement.id)) continue;

    const { field, threshold } = achievement.condition;
    const value = (stats as any)[field];
    if (typeof value === 'number' && value >= threshold) {
      newlyUnlocked.push(achievement);
    }
  }

  // Award all newly unlocked achievements in a batch
  if (newlyUnlocked.length > 0) {
    const batch = firestore().batch();
    const userRef = userDoc(uid);
    let totalXpReward = 0;

    for (const achievement of newlyUnlocked) {
      const achRef = userRef.collection('achievements').doc(achievement.id);
      batch.set(achRef, {
        achievementId: achievement.id,
        unlockedAt: firestore.Timestamp.now(),
        xpRewarded: achievement.xpReward,
      });
      totalXpReward += achievement.xpReward;
    }

    // Award bonus XP
    if (totalXpReward > 0) {
      batch.update(userRef, {
        xp: firestore.FieldValue.increment(totalXpReward),
        dailyXp: firestore.FieldValue.increment(totalXpReward),
        weeklyXp: firestore.FieldValue.increment(totalXpReward),
      });
    }

    await batch.commit();
  }

  return newlyUnlocked;
}
