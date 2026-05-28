import { apiFetch, ApiError } from './http';

export interface ListInfluencersParams {
  search?: string;
  niche?: string;
  limit?: number;
  offset?: number;
}

export interface ApiInfluencer {
  id: string;
  username: string;
  bio: string | null;
  location: string | null;
  website: string | null;
  coverImageUrl: string | null;
  verified: boolean;
  totalFollowers: string | null;
  avgEngagement: string | null;
  contentRating: string | null;
  responseRate: string | null;
  responseTime: string | null;
  collaborationsCount: number;
  rating: string | null;
  reviewsCount: number;
  priceRange: string | null;
  user?: { id: string; firstName: string | null; lastName: string | null; avatarUrl: string | null; email?: string };
  platforms?: Array<{ platform: string; followers?: string; engagementRate?: string }>;
  niches?: Array<{ niche: string }>;
}

export interface ListInfluencersResponse {
  success: boolean;
  data?: { items: ApiInfluencer[]; total: number };
  message?: string;
}

export interface UpdateProfileInput {
  bio?: string | null;
  location?: string | null;
  website?: string | null;
  coverImageUrl?: string | null;
  platforms?: Array<{ platform: string; followers?: string; engagementRate?: string }>;
  niches?: Array<{ niche: string }>;
}

export async function listInfluencers(params: ListInfluencersParams = {}) {
  const searchParams = new URLSearchParams();
  if (params.search) searchParams.set('search', params.search);
  if (params.niche) searchParams.set('niche', params.niche);
  if (params.limit != null) searchParams.set('limit', String(params.limit));
  if (params.offset != null) searchParams.set('offset', String(params.offset));
  const qs = searchParams.toString();
  const res = await apiFetch<{ success: boolean; data: { items: ApiInfluencer[]; total: number } }>(
    `/influencers${qs ? `?${qs}` : ''}`
  );
  return (res as { data?: { items: ApiInfluencer[]; total: number } }).data ?? { items: [], total: 0 };
}

export async function getInfluencer(id: string) {
  const res = await apiFetch<{ success: boolean; data?: ApiInfluencer }>(`/influencers/${id}`);
  return (res as { data?: ApiInfluencer }).data ?? null;
}

export async function getMyInfluencerProfile(): Promise<ApiInfluencer | null> {
  try {
    const res = await apiFetch<{ success: boolean; data?: ApiInfluencer }>('/influencers/me');
    return (res as { data?: ApiInfluencer }).data ?? null;
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) return null;
    throw err;
  }
}

export async function updateMyInfluencerProfile(data: UpdateProfileInput): Promise<ApiInfluencer> {
  // Strip any % suffix from engagementRate before sending
  const payload: UpdateProfileInput = {
    ...data,
    platforms: data.platforms?.map((p) => ({
      ...p,
      engagementRate: p.engagementRate?.replace(/%$/, ''),
    })),
  };
  const res = await apiFetch<{ success: boolean; data?: ApiInfluencer }>('/influencers/me', {
    method: 'PUT',
    json: payload,
  });
  const influencer = (res as { data?: ApiInfluencer }).data;
  if (!influencer) throw new Error('No data returned from profile update');
  return influencer;
}
