import { useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';
import { useUserStore } from '../stores/userStore';
import { useGameStore } from '../stores/gameStore';
import { onAuthStateChanged, DEMO_MODE, signInAnonymously } from '../services/auth';
import { userDoc, userProgressCollection } from '../services/firebase';

async function syncProfileToStores(
  uid: string,
  setProfile: any,
  setHasCompletedOnboarding: any,
  syncFromProfile: any,
  setEraProgress: any,
) {
  const doc = await userDoc(uid).get();
  if (doc.exists) {
    const data = doc.data() as any;
    setProfile(data);
    setHasCompletedOnboarding(true);

    syncFromProfile({
      xp: data.xp ?? 0,
      level: data.level ?? 0,
      currentStreak: data.currentStreak ?? 0,
      longestStreak: data.longestStreak ?? 0,
      streakFreezes: data.streakFreezes ?? 0,
      heartsRemaining: data.heartsRemaining ?? 5,
      heartsRegenAt: data.heartsRegenAt?.toDate() ?? null,
    });

    const progressSnapshot = await userProgressCollection(uid).get();
    const progressList = progressSnapshot.docs.map((d) => d.data() as any);
    setEraProgress(progressList);
  } else {
    setHasCompletedOnboarding(false);
  }
}

export function useAuth() {
  const { setUser, setLoading, setHasCompletedOnboarding } = useAuthStore();
  const { setProfile, setEraProgress } = useUserStore();
  const { syncFromProfile } = useGameStore();

  useEffect(() => {
    if (DEMO_MODE) {
      // Demo mode: sign in anonymously to get a real auth token for Firestore
      (async () => {
        try {
          const demoUser = await signInAnonymously();
          setUser(demoUser);
          await syncProfileToStores(demoUser.uid, setProfile, setHasCompletedOnboarding, syncFromProfile, setEraProgress);
        } catch (error) {
          console.error('Demo sign-in error:', error);
          setHasCompletedOnboarding(false);
        }
        setLoading(false);
      })();

      return;
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
          await syncProfileToStores(firebaseUser.uid, setProfile, setHasCompletedOnboarding, syncFromProfile, setEraProgress);
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
