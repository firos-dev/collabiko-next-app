import { getToken } from './auth-storage';

export type ApiErrorBody = unknown;

export class ApiError extends Error {
  readonly status: number;
  readonly body: ApiErrorBody;

  constructor(message: string, status: number, body: ApiErrorBody) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.body = body;
  }
}

function getBaseUrl() {
  const base = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? '';
  return base.replace(/\/+$/, '');
}

function buildUrl(path: string) {
  if (/^https?:\/\//i.test(path)) return path;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const base = getBaseUrl();
  return base ? `${base}${cleanPath}` : cleanPath;
}

function extractErrorMessage(body: unknown) {
  if (!body) return null;
  if (typeof body === 'string') return body;
  if (typeof body !== 'object') return null;

  const maybeObj = body as Record<string, unknown>;
  if (typeof maybeObj.message === 'string') return maybeObj.message;
  if (typeof maybeObj.error === 'string') return maybeObj.error;
  return null;
}

async function readResponseBody(res: Response): Promise<unknown> {
  const contentType = res.headers.get('content-type') ?? '';
  if (contentType.includes('application/json')) {
    try {
      return await res.json();
    } catch {
      return null;
    }
  }

  try {
    const text = await res.text();
    return text || null;
  } catch {
    return null;
  }
}

export type ApiFetchOptions = Omit<RequestInit, 'body'> & {
  json?: unknown;
  /** Skip adding Authorization header (e.g. for login/register) */
  skipAuth?: boolean;
};

function getAuthHeaders(): Record<string, string> {
  const token = getToken();
  if (token) return { Authorization: `Bearer ${token}` };
  return {};
}

export async function apiFetch<T>(path: string, options: ApiFetchOptions = {}): Promise<T> {
  const { json, headers, skipAuth, ...init } = options;

  const res = await fetch(buildUrl(path), {
    ...init,
    headers: {
      ...(json !== undefined ? { 'content-type': 'application/json' } : {}),
      ...(skipAuth ? {} : getAuthHeaders()),
      ...(headers ?? {}),
    },
    body: json !== undefined ? JSON.stringify(json) : undefined,
  });

  const body = await readResponseBody(res);
  if (!res.ok) {
    const message = extractErrorMessage(body) ?? `Request failed (${res.status})`;
    throw new ApiError(message, res.status, body);
  }

  return body as T;
}
