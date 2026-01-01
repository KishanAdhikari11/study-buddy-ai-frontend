import { create } from 'zustand';

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isHydrated: boolean; 
  login: (token: string, user: User) => void;
  logout: () => void;
  checkAuth: () => void; 
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  isHydrated: false,

login: (token, user) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(user));
  }
  set({ 
    isAuthenticated: true, 
    user, 
    isHydrated: true 
  });
},

  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    set({ isAuthenticated: false, user: null });
    window.location.href = '/'; 
  },

  checkAuth: () => {
    if (typeof window === 'undefined') return;
    const token = localStorage.getItem('authToken');
    const userJson = localStorage.getItem('user');
    
    if (token && userJson) {
      try {
        set({ isAuthenticated: true, user: JSON.parse(userJson), isHydrated: true });
      } catch {
        localStorage.clear();
        set({ isHydrated: true });
      }
    } else {
      set({ isHydrated: true });
    }
  }
}));