import { useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';
import { useUserStore } from '../stores/userStore';
import { useGameStore } from '../stores/gameStore';
import { onAuthStateChanged, DEMO_MODE, DEMO_USER } from '../services/auth';
import { userDoc, userProgressCollection } from '../services/firebase';

export function useAuth() {
  const { setUser, setLoading, setHasCompletedOnboarding } = useAuthStore();
  const { setProfile, setEraProgress } = useUserStore();
  const { syncFromProfile } = useGameStore();

  useEffect(() => {
    if (DEMO_MODE) {
      // Demo mode: skip Firebase Auth, use hardcoded user
      (async () => {
        setUser(DEMO_USER);

        try {
          const profileDoc = await userDoc(DEMO_USER.uid).get();
          if (profileDoc.exists) {
            const profileData = profileDoc.data() as any;
            setProfile(profileData);
            setHasCompletedOnboarding(true);

            syncFromProfile({
              xp: profileData.xp ?? 0,
              level: profileData.level ?? 0,
              currentStreak: profileData.currentStreak ?? 0,
              longestStreak: profileData.longestStreak ?? 0,
              streakFreezes: profileData.streakFreezes ?? 0,
              heartsRemaining: profileData.heartsRemaining ?? 5,
              heartsRegenAt: profileData.heartsRegenAt?.toDate() ?? null,
            });

            const progressSnapshot = await userProgressCollection(DEMO_USER.uid).get();
            const progressList = progressSnapshot.docs.map((doc) => doc.data() as any);
            setEraProgress(progressList);
          } else {
            setHasCompletedOnboarding(false);
          }
        } catch (error) {
          console.error('Error fetching demo user profile:', error);
          setHasCompletedOnboarding(false);
        }

        setLoading(false);
      })();

      return; // No unsubscribe needed
    }

    // Real Firebase Auth flow
    const unsubscribe = onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email ?? '',
          displayName: firebaseUser.displayName,
        });

        try {
          const profileDoc = await userDoc(firebaseUser.uid).get();
          if (profileDoc.exists) {
            const profileData = profileDoc.data() as any;
            setProfile(profileData);
            setHasCompletedOnboarding(true);

            syncFromProfile({
              xp: profileData.xp ?? 0,
              level: profileData.level ?? 0,
              currentStreak: profileData.currentStreak ?? 0,
              longestStreak: profileData.longestStreak ?? 0,
              streakFreezes: profileData.streakFreezes ?? 0,
              heartsRemaining: profileData.heartsRemaining ?? 5,
              heartsRegenAt: profileData.heartsRegenAt?.toDate() ?? null,
            });

            const progressSnapshot = await userProgressCollection(firebaseUser.uid).get();
            const progressList = progressSnapshot.docs.map((doc) => doc.data() as any);
            setEraProgress(progressList);
          } else {
            setHasCompletedOnboarding(false);
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      } else {
        setUser(null);
        setProfile(null);
        setEraProgress([]);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);
}
