import { create } from 'zustand';
import { User } from '@/types';
import { getAuthToken, removeAuthToken } from '@/lib/auth';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: getAuthToken() !== null,
  setUser: (user) => set({ user, isAuthenticated: user !== null }),
  logout: () => {
    removeAuthToken();
    set({ user: null, isAuthenticated: false });
  },
}));


