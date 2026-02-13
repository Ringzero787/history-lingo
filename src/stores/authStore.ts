import { create } from 'zustand';
import { AppUser } from '../services/auth';

interface AuthState {
  user: AppUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  hasCompletedOnboarding: boolean;
  setUser: (user: AppUser | null) => void;
  setLoading: (loading: boolean) => void;
  setHasCompletedOnboarding: (completed: boolean) => void;
  reset: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  hasCompletedOnboarding: false,
  setUser: (user) =>
    set({
      user,
      isAuthenticated: !!user,
      isLoading: false,
    }),
  setLoading: (isLoading) => set({ isLoading }),
  setHasCompletedOnboarding: (hasCompletedOnboarding) => set({ hasCompletedOnboarding }),
  reset: () =>
    set({
      user: null,
      isLoading: false,
      isAuthenticated: false,
      hasCompletedOnboarding: false,
    }),
}));
