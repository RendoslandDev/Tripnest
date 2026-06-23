const BASE_URL = import.meta.env.VITE_API_URL ?? '';

/** Simulated network latency for mock-backed services. */
export const MOCK_DELAY = 400;

/** Resolve a value after a short delay, mimicking an async request. */
export function mockResponse<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), MOCK_DELAY));
}

/** Typed GET against the real API. Used once the backend is live. */
export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`);
  if (!res.ok) {
    throw new Error(`Request to ${path} failed: ${res.status}`);
  }
  return res.json() as Promise<T>;
}
