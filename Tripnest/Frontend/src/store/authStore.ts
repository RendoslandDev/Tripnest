import { useSyncExternalStore } from 'react';

export type Role = 'tenant' | 'landlord';
export type AuthProvider = 'email' | 'google' | 'apple';

export interface Session {
  email: string;
  name: string;
  role: Role;
  provider: AuthProvider;
}

// ---------------------------------------------------------------------------
// Minimal client-side session. Persists to localStorage and notifies React via
// useSyncExternalStore. Swap signIn/signOut for real auth calls when the
// backend is live — consumers (useSession, RequireAuth) won't change.
// ---------------------------------------------------------------------------

const KEY = 'tripnest.session';
const listeners = new Set<() => void>();

function readInitial(): Session | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Session) : null;
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

export function signIn(next: Session): void {
  session = next;
  try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* ignore */ }
  emit();
}

export function signOut(): void {
  session = null;
  try { localStorage.removeItem(KEY); } catch { /* ignore */ }
  emit();
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}

/** Subscribe a component to the current session. */
export function useSession(): Session | null {
  return useSyncExternalStore(subscribe, getSession, () => null);
}

/** Derive a display name from an email local part, e.g. "kofi.mensah" → "Kofi Mensah". */
export function nameFromEmail(email: string): string {
  const local = email.split('@')[0]?.replace(/[._-]+/g, ' ') ?? '';
  const name = local
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(' ');
  return name || 'Guest';
}
