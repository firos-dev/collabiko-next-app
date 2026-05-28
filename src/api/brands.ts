import { apiFetch, ApiError } from './http';

export interface ApiBrand {
  id: string;
  brandName: string;
  logoUrl: string | null;
  bio: string | null;
  website: string | null;
  industry: string | null;
  user?: { id: string; firstName: string | null; lastName: string | null; email?: string; avatarUrl: string | null };
}

export interface UpdateBrandProfileInput {
  brandName?: string;
  bio?: string | null;
  website?: string | null;
  industry?: string | null;
  logoUrl?: string | null;
}

export async function getMyBrandProfile(): Promise<ApiBrand | null> {
  try {
    const res = await apiFetch<{ success: boolean; data?: ApiBrand }>('/brands/me');
    return (res as { data?: ApiBrand }).data ?? null;
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) return null;
    throw err;
  }
}

export async function updateMyBrandProfile(data: UpdateBrandProfileInput): Promise<ApiBrand> {
  const res = await apiFetch<{ success: boolean; data?: ApiBrand }>('/brands/me', {
    method: 'PUT',
    json: data,
  });
  const brand = (res as { data?: ApiBrand }).data;
  if (!brand) throw new Error('No data returned from brand profile update');
  return brand;
}
