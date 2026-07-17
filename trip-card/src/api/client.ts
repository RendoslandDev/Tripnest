import type {
  ApiEnvelope, Application, AuditLog, Citizen, CreateCitizenRequest,
  DashboardStats, IdCard, LoginResponse, Officer, PagedResult, RecentRegistration,
} from '../types'
import { useAuthStore } from '../store'

export const API_URL: string =
  (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:5135'

export class ApiError extends Error {
  status: number
  errors: string[]
  constructor(message: string, status: number, errors: string[] = []) {
    super(message)
    this.status = status
    this.errors = errors
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const { token, logout } = useAuthStore.getState()
  const headers = new Headers(options.headers)
  if (token) headers.set('Authorization', `Bearer ${token}`)
  if (options.body && !(options.body instanceof FormData))
    headers.set('Content-Type', 'application/json')

  let res: Response
  try {
    res = await fetch(`${API_URL}${path}`, { ...options, headers })
  } catch {
    throw new ApiError('Cannot reach the TripNest.Id API. Is the backend running?', 0)
  }

  if (res.status === 401 && token) logout()

  let envelope: ApiEnvelope<T> | null = null
  try {
    envelope = await res.json()
  } catch {
    // non-JSON body (e.g. 500 with empty body)
  }

  if (!res.ok || !envelope?.success) {
    throw new ApiError(
      envelope?.message || `Request failed (${res.status})`,
      res.status,
      envelope?.errors ?? [],
    )
  }
  return envelope.data as T
}

async function requestBlob(path: string): Promise<Blob> {
  const { token, logout } = useAuthStore.getState()
  const headers = new Headers()
  if (token) headers.set('Authorization', `Bearer ${token}`)
  const res = await fetch(`${API_URL}${path}`, { headers })
  if (res.status === 401 && token) logout()
  if (!res.ok) throw new ApiError(`Request failed (${res.status})`, res.status)
  return res.blob()
}

export const api = {
  auth: {
    login: (email: string, password: string) =>
      request<LoginResponse>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),
    changePassword: (currentPassword: string, newPassword: string) =>
      request<void>('/api/auth/change-password', {
        method: 'POST',
        body: JSON.stringify({ currentPassword, newPassword }),
      }),
    registerOfficer: (fullName: string, email: string, password: string, role: string) =>
      request<Officer>('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ fullName, email, password, role }),
      }),
  },

  citizens: {
    list: (page = 1, pageSize = 50) =>
      request<PagedResult<Citizen>>(`/api/citizens?page=${page}&pageSize=${pageSize}`),
    search: (q: string) =>
      request<Citizen[]>(`/api/citizens/search?q=${encodeURIComponent(q)}`),
    get: (id: string) => request<Citizen>(`/api/citizens/${id}`),
    create: (data: CreateCitizenRequest) =>
      request<Citizen>('/api/citizens', { method: 'POST', body: JSON.stringify(data) }),
    uploadPhoto: (id: string, photo: Blob, fileName = 'photo.jpg') => {
      const form = new FormData()
      form.append('photo', photo, fileName)
      return request<{ photoPath: string }>(`/api/citizens/${id}/photo`, {
        method: 'POST',
        body: form,
      })
    },
    photoBlob: (id: string) => requestBlob(`/api/citizens/${id}/photo`),
  },

  phoneVerification: {
    request: (phoneNumber: string) =>
      request<{ phoneNumber: string; expiresAt: string; message: string; devCode?: string | null }>(
        '/api/phoneverification/request', {
          method: 'POST',
          body: JSON.stringify({ phoneNumber }),
        }),
    confirm: (phoneNumber: string, code: string) =>
      request<{ phoneNumber: string; verified: boolean }>('/api/phoneverification/confirm', {
        method: 'POST',
        body: JSON.stringify({ phoneNumber, code }),
      }),
  },

  applications: {
    submit: (citizenId: string) =>
      request<Application>('/api/applications', {
        method: 'POST',
        body: JSON.stringify({ citizenId }),
      }),
    pending: () => request<Application[]>('/api/applications/pending'),
    list: (page = 1, pageSize = 20, status?: string) =>
      request<PagedResult<Application>>(
        `/api/applications?page=${page}&pageSize=${pageSize}${status ? `&status=${status}` : ''}`),
    review: (id: string, status: 'Approved' | 'Rejected', rejectionReason = '') =>
      request<Application>(`/api/applications/${id}/review`, {
        method: 'PATCH',
        body: JSON.stringify({ status, rejectionReason }),
      }),
  },

  idCards: {
    list: (page = 1, pageSize = 50, status?: string) =>
      request<PagedResult<IdCard>>(
        `/api/idcards?page=${page}&pageSize=${pageSize}${status ? `&status=${status}` : ''}`),
    expiring: () => request<IdCard[]>('/api/idcards/expiring'),
    get: (cardId: string) => request<IdCard>(`/api/idcards/${cardId}`),
    issue: (citizenId: string) =>
      request<IdCard>('/api/idcards/issue', {
        method: 'POST',
        body: JSON.stringify({ citizenId }),
      }),
    revoke: (cardId: string) =>
      request<void>(`/api/idcards/${cardId}/revoke`, { method: 'PATCH' }),
    renew: (cardId: string) =>
      request<IdCard>(`/api/idcards/${cardId}/renew`, { method: 'POST' }),
    downloadPdf: (cardId: string) => requestBlob(`/api/idcards/${cardId}/download`),
  },

  biometrics: {
    enroll: (citizenId: string, fingerprint: File, position = 'RightIndex') => {
      const form = new FormData()
      form.append('fingerprint', fingerprint)
      form.append('position', position)
      return request<unknown>(`/api/biometrics/citizens/${citizenId}/fingerprint`, {
        method: 'POST',
        body: form,
      })
    },
  },

  dashboard: {
    stats: () => request<DashboardStats>('/api/dashboard/stats'),
    recentRegistrations: () =>
      request<RecentRegistration[]>('/api/dashboard/recent-registrations'),
  },

  audit: {
    logs: (page = 1, pageSize = 20) =>
      request<{ logs: AuditLog[]; pagination: { page: number; pageSize: number; total: number; totalPages: number } }>(
        `/api/audit/logs?page=${page}&pageSize=${pageSize}`),
  },
}
