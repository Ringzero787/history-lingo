import { useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';
import { useUserStore } from '../stores/userStore';
import { useGameStore } from '../stores/gameStore';
import { onAuthStateChanged } from '../services/auth';
import { userDoc, userProgressCollection } from '../services/firebase';

export function useAuth() {
  const { setUser, setLoading, setHasCompletedOnboarding } = useAuthStore();
  const { setProfile, setEraProgress } = useUserStore();
  const { syncFromProfile } = useGameStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);

        // Fetch user profile from Firestore
        try {
          const profileDoc = await userDoc(firebaseUser.uid).get();
          if (profileDoc.exists) {
            const profileData = profileDoc.data() as any;
            setProfile(profileData);
            setHasCompletedOnboarding(true);

            // Sync game state from profile
            syncFromProfile({
              xp: profileData.xp ?? 0,
              level: profileData.level ?? 0,
              currentStreak: profileData.currentStreak ?? 0,
              longestStreak: profileData.longestStreak ?? 0,
              streakFreezes: profileData.streakFreezes ?? 0,
              heartsRemaining: profileData.heartsRemaining ?? 5,
              heartsRegenAt: profileData.heartsRegenAt?.toDate() ?? null,
            });

            // Fetch era progress
            const progressSnapshot = await userProgressCollection(firebaseUser.uid).get();
            const progressList = progressSnapshot.docs.map((doc) => doc.data() as any);
            setEraProgress(progressList);
          } else {
            // User exists in Auth but hasn't completed onboarding
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
