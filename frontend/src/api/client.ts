/**
 * Thin HTTP client — the ONLY place in the frontend that talks to the network.
 *
 * Rules:
 *   - No business logic here.
 *   - No caching, queuing, or retries.
 *   - No URL constants (Vite proxy resolves /api → backend).
 *   - Throw on non-2xx so callers handle errors uniformly.
 */

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

const BASE = '/api';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...init?.headers },
    ...init,
  });

  if (!res.ok) {
    throw new ApiError(res.status, `${res.status} ${res.statusText}`);
  }

  return res.json() as Promise<T>;
}

export const apiClient = {
  get:  <T>(path: string)                => request<T>(path),
  post: <T>(path: string, body: unknown) => request<T>(path, { method: 'POST', body: JSON.stringify(body) }),
};
