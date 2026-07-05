import { useSyncExternalStore } from 'react';
import { apiPost, clearTokens, setTokens } from '../api/client';
import type { LoginResponseDto } from '../api/backend';

export type Role = 'tenant' | 'landlord';
export type AuthProvider = 'email' | 'google' | 'apple';

export interface Session {
  userId: string;
  email: string;
  name: string;
  role: Role;
  provider: AuthProvider;
  isVerified: boolean;
  emailVerified: boolean;
  phoneVerified: boolean;
  tripNestId?: string;
}

// ---------------------------------------------------------------------------
// Session backed by TripNest.Core JWT auth. The access/refresh tokens live in
// api/client.ts token storage; this store keeps the user profile and notifies
// React via useSyncExternalStore. Consumers (useSession, RequireAuth) are
// unchanged from the mock era.
// ---------------------------------------------------------------------------

const KEY = 'tripnest.session';
const listeners = new Set<() => void>();

function readInitial(): Session | null {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? (JSON.parse(raw) as Session) : null;
    // Discard pre-API sessions that carry no userId — they have no tokens.
    return parsed && parsed.userId ? parsed : null;
  } catch {
    return null;
  }
}

let session: Session | null = readInitial();

function emit() {
  listeners.forEach((l) => l());
}

export function getSession(): Session | null {
  return session;
}

function persist(next: Session | null): void {
  session = next;
  try {
    if (next) localStorage.setItem(KEY, JSON.stringify(next));
    else localStorage.removeItem(KEY);
  } catch { /* ignore */ }
  emit();
}

/** UserRole wire values: 0 Tenant, 1 Landlord, 2 Agent, 3 Caretaker, 4 Admin, 5 Guest. */
function roleFromApi(role: number): Role {
  return role === 1 ? 'landlord' : 'tenant';
}

function roleToApi(role: Role): number {
  return role === 'landlord' ? 1 : 0;
}

function sessionFromLogin(dto: LoginResponseDto): Session {
  return {
    userId: dto.userId,
    email: dto.email,
    name: dto.fullName,
    role: roleFromApi(dto.role),
    provider: 'email',
    isVerified: dto.isVerified,
    emailVerified: dto.emailVerified,
    phoneVerified: dto.phoneVerified,
    tripNestId: dto.tripNestId ?? undefined,
  };
}

/** POST /api/auth/login — stores tokens and opens a session. */
export async function login(email: string, password: string): Promise<Session> {
  const dto = await apiPost<LoginResponseDto>('/api/auth/login', { email, password });
  setTokens({ accessToken: dto.accessToken, refreshToken: dto.refreshToken });
  const next = sessionFromLogin(dto);
  persist(next);
  return next;
}

export interface RegisterInput {
  fullName: string;
  email: string;
  password: string;
  phone: string;
  role: Role;
}

/** POST /api/auth/register, then log straight in. */
export async function register(input: RegisterInput): Promise<Session> {
  await apiPost<unknown>('/api/auth/register', {
    fullName: input.fullName,
    email: input.email,
    password: input.password,
    confirmPassword: input.password,
    phone: input.phone,
    role: roleToApi(input.role),
  });
  return login(input.email, input.password);
}

/** Patch the local session copy (e.g. after a profile edit). */
export function updateSession(partial: Partial<Session>): void {
  if (session) persist({ ...session, ...partial });
}

export function signOut(): void {
  clearTokens();
  persist(null);
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}

/** Subscribe a component to the current session. */
export function useSession(): Session | null {
  return useSyncExternalStore(subscribe, getSession, () => null);
}
