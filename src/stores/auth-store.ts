import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '@/lib/axios';

const TOKEN_KEY = 'tiendapos_token';

interface User {
  id: number;
  name: string;
  email: string;
  tienda_id?: number;
}

interface OnboardingStatus {
  paso_actual: number;
  completado: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  onboarding: OnboardingStatus | null;
  login: (email: string, password: string) => Promise<boolean>;
  setAuth: (token: string, user: User) => void;
  logout: () => void;
  clearError: () => void;
  checkOnboarding: () => Promise<boolean>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      loading: false,
      error: null,
      onboarding: null,

      setAuth: (token: string, user: User) => {
        if (typeof window !== 'undefined') {
          localStorage.setItem(TOKEN_KEY, token);
        }
        set({ token, user, loading: false });
      },

      login: async (email: string, password: string) => {
        set({ loading: true, error: null });
        try {
          const response = await api.post('/auth/login', {
            email,
            password,
            device_name: 'web',
          });

          const { token, user } = response.data.data;

          if (typeof window !== 'undefined') {
            localStorage.setItem(TOKEN_KEY, token);
          }

          set({ token, user, loading: false });
          return true;
        } catch (error: unknown) {
          const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Error al iniciar sesión';
          set({ error: message, loading: false });
          return false;
        }
      },

      logout: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem(TOKEN_KEY);
        }
        set({ user: null, token: null, error: null, onboarding: null });
      },

      clearError: () => {
        set({ error: null });
      },

      checkOnboarding: async () => {
        try {
          const response = await api.get('/onboarding/estado');
          const data = response.data.data;
          set({ onboarding: { paso_actual: data.paso_actual, completado: data.completado } });
          return data.completado;
        } catch {
          return true;
        }
      },
    }),
    {
      name: 'tiendapos_auth',
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
);
