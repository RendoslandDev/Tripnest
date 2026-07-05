const BASE_URL = import.meta.env.VITE_API_URL ?? '';

/** Simulated network latency for mock-backed services. */
export const MOCK_DELAY = 400;

/** Resolve a value after a short delay, mimicking an async request. */
export function mockResponse<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), MOCK_DELAY));
}

// ---------------------------------------------------------------------------
// Real client for TripNest.Core. Every endpoint answers with the envelope
// { message, statusCode, data, success }; request() unwraps it, attaches the
// JWT, and retries once through /api/auth/refresh-token on a 401.
// ---------------------------------------------------------------------------

export interface ApiEnvelope<T> {
  message: string;
  statusCode: number;
  data: T | null;
  success: boolean;
}

export class ApiError extends Error {
  readonly status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

// --- token storage ---------------------------------------------------------

const TOKEN_KEY = 'tripnest.tokens';

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export function getTokens(): Tokens | null {
  try {
    const raw = localStorage.getItem(TOKEN_KEY);
    return raw ? (JSON.parse(raw) as Tokens) : null;
  } catch {
    return null;
  }
}

export function setTokens(tokens: Tokens): void {
  try { localStorage.setItem(TOKEN_KEY, JSON.stringify(tokens)); } catch { /* ignore */ }
}

export function clearTokens(): void {
  try { localStorage.removeItem(TOKEN_KEY); } catch { /* ignore */ }
}

// --- request core ----------------------------------------------------------

type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

async function rawRequest(method: Method, path: string, body?: unknown): Promise<Response> {
  const headers: Record<string, string> = {};
  const tokens = getTokens();
  if (tokens?.accessToken) headers.Authorization = `Bearer ${tokens.accessToken}`;

  let payload: BodyInit | undefined;
  if (body instanceof FormData) {
    payload = body;
  } else if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
    payload = JSON.stringify(body);
  }

  return fetch(`${BASE_URL}${path}`, { method, headers, body: payload });
}

let refreshing: Promise<boolean> | null = null;

/** Swap the refresh token for a new access token. Shared across callers. */
async function tryRefresh(): Promise<boolean> {
  if (!refreshing) {
    refreshing = (async () => {
      const tokens = getTokens();
      if (!tokens?.refreshToken) return false;
      try {
        const res = await fetch(`${BASE_URL}/api/auth/refresh-token`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken: tokens.refreshToken }),
        });
        if (!res.ok) return false;
        const envelope = (await res.json()) as ApiEnvelope<{ accessToken?: string; refreshToken?: string }>;
        const data = envelope.data;
        if (!envelope.success || !data?.accessToken) return false;
        setTokens({ accessToken: data.accessToken, refreshToken: data.refreshToken ?? tokens.refreshToken });
        return true;
      } catch {
        return false;
      } finally {
        refreshing = null;
      }
    })();
  }
  return refreshing;
}

async function request<T>(method: Method, path: string, body?: unknown): Promise<T> {
  let res = await rawRequest(method, path, body);

  if (res.status === 401 && !path.startsWith('/api/auth/')) {
    if (await tryRefresh()) res = await rawRequest(method, path, body);
  }

  let envelope: ApiEnvelope<T> | null = null;
  try {
    envelope = (await res.json()) as ApiEnvelope<T>;
  } catch {
    // non-JSON body (unexpected); fall through to the status check
  }

  if (!res.ok || (envelope && !envelope.success)) {
    throw new ApiError(envelope?.message ?? `Request to ${path} failed`, envelope?.statusCode ?? res.status);
  }
  return (envelope?.data ?? null) as T;
}

export function apiGet<T>(path: string): Promise<T> {
  return request<T>('GET', path);
}

export function apiPost<T>(path: string, body?: unknown): Promise<T> {
  return request<T>('POST', path, body);
}

export function apiPut<T>(path: string, body?: unknown): Promise<T> {
  return request<T>('PUT', path, body);
}

export function apiPatch<T>(path: string, body?: unknown): Promise<T> {
  return request<T>('PATCH', path, body);
}

export function apiDelete<T>(path: string): Promise<T> {
  return request<T>('DELETE', path);
}

/** POST multipart/form-data (photos, walkthrough videos). */
export function apiUpload<T>(path: string, form: FormData): Promise<T> {
  return request<T>('POST', path, form);
}

/** Absolute URL for a backend-served asset path (e.g. /uploads/properties/x.jpg). */
export function assetUrl(path: string): string {
  return /^https?:\/\//.test(path) ? path : `${BASE_URL}${path}`;
}

/** Fetch an authenticated binary (PDF) endpoint and hand it to the browser as a download. */
export async function apiDownload(path: string, filename: string): Promise<void> {
  const tokens = getTokens();
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: tokens?.accessToken ? { Authorization: `Bearer ${tokens.accessToken}` } : undefined,
  });
  if (!res.ok) throw new ApiError(`Download from ${path} failed`, res.status);
  const url = URL.createObjectURL(await res.blob());
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
