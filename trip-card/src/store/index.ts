import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AuthOfficer, LoginResponse } from '../types'

interface AuthState {
  token: string | null
  currentUser: AuthOfficer | null
  setAuth: (login: LoginResponse) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      currentUser: null,
      setAuth: ({ token, officerId, fullName, role }) =>
        set({ token, currentUser: { officerId, fullName, role } }),
      logout: () => set({ token: null, currentUser: null }),
    }),
    { name: 'tripnest-auth' }
  )
)
