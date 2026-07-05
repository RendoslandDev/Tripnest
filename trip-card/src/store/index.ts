import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, Citizen, IDCard, AuditLog, CardStatus } from '../types'
import { USERS, CITIZENS, ID_CARDS, AUDIT_LOGS } from '../data/mockData'

interface AuthState {
  currentUser: User | null
  login: (email: string, password: string) => boolean
  logout: () => void
}

interface DataState {
  citizens: Citizen[]
  cards: IDCard[]
  auditLogs: AuditLog[]
  addCitizen: (citizen: Citizen) => void
  addCard: (card: IDCard) => void
  updateCardStatus: (cardId: string, status: CardStatus) => void
  addAuditLog: (log: Omit<AuditLog, 'id'>) => void
  nextCardId: () => string
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      currentUser: null,
      login: (email, password) => {
        const user = USERS.find(u => u.email === email && u.password === password)
        if (user) { set({ currentUser: user }); return true }
        return false
      },
      logout: () => set({ currentUser: null }),
    }),
    { name: 'tripnest-auth' }
  )
)

export const useDataStore = create<DataState>()(
  persist(
    (set, get) => ({
      citizens: CITIZENS,
      cards: ID_CARDS,
      auditLogs: AUDIT_LOGS,

      addCitizen: (citizen) => set(s => ({ citizens: [...s.citizens, citizen] })),

      addCard: (card) => set(s => ({ cards: [...s.cards, card] })),

      updateCardStatus: (cardId, status) =>
        set(s => ({ cards: s.cards.map(c => c.cardId === cardId ? { ...c, status } : c) })),

      addAuditLog: (log) =>
        set(s => ({
          auditLogs: [{ ...log, id: `a${Date.now()}` }, ...s.auditLogs]
        })),

      nextCardId: () => {
        const cards = get().cards
        const max = cards.reduce((m, c) => {
          const n = parseInt(c.cardId.split('-')[2] || '0')
          return n > m ? n : m
        }, 0)
        return `GHA-2026-${String(max + 1).padStart(6, '0')}`
      },
    }),
    { name: 'tripnest-data' }
  )
)
