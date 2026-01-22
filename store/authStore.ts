// path: src/store/authStore.ts
import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface User {
  id: number
  email: string
  rol_id: number
  team_id?: number
  nombre?: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  setAuthenticated: (user: User) => void
  clear: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      setAuthenticated: (user) =>
        set({
          user,
          isAuthenticated: true,
        }),

      clear: () =>
        set({
          user: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: "auth-storage",
      // opcional: solo persistí user/isAuthenticated
      partialize: (s) => ({ user: s.user, isAuthenticated: s.isAuthenticated }),
    },
  ),
)
