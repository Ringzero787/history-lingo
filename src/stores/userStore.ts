import { create } from 'zustand';
import { UserProfile, EraProgress } from '../types';

interface UserState {
  profile: UserProfile | null;
  eraProgress: Record<string, EraProgress>;
  isLoading: boolean;
  setProfile: (profile: UserProfile | null) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  setEraProgress: (progress: EraProgress[]) => void;
  updateEraProgress: (eraId: string, progress: Partial<EraProgress>) => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  profile: null,
  eraProgress: {},
  isLoading: false,
  setProfile: (profile) => set({ profile }),
  updateProfile: (updates) =>
    set((state) => ({
      profile: state.profile ? { ...state.profile, ...updates } : null,
    })),
  setEraProgress: (progressList) =>
    set({
      eraProgress: Object.fromEntries(progressList.map((p) => [p.eraId, p])),
    }),
  updateEraProgress: (eraId, progress) =>
    set((state) => ({
      eraProgress: {
        ...state.eraProgress,
        [eraId]: { ...state.eraProgress[eraId], ...progress } as EraProgress,
      },
    })),
  setLoading: (isLoading) => set({ isLoading }),
  reset: () => set({ profile: null, eraProgress: {}, isLoading: false }),
}));
