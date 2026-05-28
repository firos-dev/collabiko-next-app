import { apiFetch } from './http';

export interface ListCampaignsParams {
  search?: string;
  category?: string;
  platform?: string;
  limit?: number;
  offset?: number;
}

export interface ApiCampaign {
  id: string;
  title: string;
  description: string;
  category: string;
  niche: string | null;
  budget: string | null;
  duration: string | null;
  startDate: string | null;
  endDate: string | null;
  deadline: string | null;
  location: string | null;
  targetAudience: string | null;
  requirements: string | null;
  minFollowers: string | null;
  maxFollowers: string | null;
  engagementRequirement?: string | null;
  status: string;
  applicantsCount: number;
  deletedAt?: string | null;
  brand?: { id: string; brandName: string; logoUrl?: string | null };
  platforms?: Array<{ platform: string }>;
  deliverables?: Array<{ description: string }>;
}

export interface ApiApplication {
  id: string;
  status: string;
  coverLetter: string | null;
  proposedContent: string | null;
  deliverables: string | null;
  timeline: string | null;
  socialLinks: string | null;
  proposedPrice: string | null;
  createdAt: string;
  influencer?: {
    id: string;
    username: string;
    avatarUrl: string | null;
    totalFollowers: string | null;
    platforms: Array<{ platform: string; followers: string | null }>;
  };
  campaign?: {
    id: string;
    title: string;
    status: string;
    brand: { brandName: string; logoUrl: string | null };
  };
}

export interface UpdateCampaignPayload {
  title?: string;
  description?: string;
  niche?: string;
  platforms?: string[];
  contentType?: string;
  startDate?: string;
  endDate?: string;
  budget?: string;
  minFollowers?: string;
  maxFollowers?: string;
  targetAudience?: string;
  requirements?: string;
  deliverables?: string[];
  location?: string;
  status?: 'open' | 'closing-soon' | 'featured' | 'closed';
}

export async function listCampaigns(params: ListCampaignsParams = {}) {
  const searchParams = new URLSearchParams();
  if (params.search) searchParams.set('search', params.search);
  if (params.category) searchParams.set('category', params.category);
  if (params.platform) searchParams.set('platform', params.platform);
  if (params.limit != null) searchParams.set('limit', String(params.limit));
  if (params.offset != null) searchParams.set('offset', String(params.offset));
  const qs = searchParams.toString();
  const res = await apiFetch<{ success: boolean; data: { items: ApiCampaign[]; total: number } }>(
    `/campaigns${qs ? `?${qs}` : ''}`
  );
  return (res as { data?: { items: ApiCampaign[]; total: number } }).data ?? { items: [], total: 0 };
}

export async function getCampaign(id: string) {
  const res = await apiFetch<{ success: boolean; data?: ApiCampaign }>(`/campaigns/${id}`);
  return (res as { data?: ApiCampaign }).data ?? null;
}

export interface CreateCampaignPayload {
  title: string;
  description: string;
  niche: string;
  platforms: string[];
  contentType: string;
  startDate: string;
  endDate: string;
  budget: string;
  minFollowers?: string;
  maxFollowers?: string;
  targetAudience?: string;
  requirements?: string;
  deliverables: string[];
  location?: string;
}

export async function createCampaign(payload: CreateCampaignPayload) {
  const res = await apiFetch<{ success: boolean; data?: ApiCampaign }>('/campaigns', {
    method: 'POST',
    json: payload,
  });
  return (res as { data?: ApiCampaign }).data ?? null;
}

export interface CreateApplicationPayload {
  coverLetter: string;
  proposedContent: string;
  deliverables: string;
  timeline?: string;
  socialLinks?: string;
}

export async function applyToCampaign(campaignId: string, payload: CreateApplicationPayload) {
  const res = await apiFetch<{ success: boolean; data?: ApiApplication }>(`/campaigns/${campaignId}/applications`, {
    method: 'POST',
    json: payload,
  });
  return (res as { data?: ApiApplication }).data ?? null;
}

export async function toggleSaveCampaign(campaignId: string): Promise<{ saved: boolean }> {
  const r = await apiFetch<{ success: boolean; data?: { saved: boolean } }>(`/campaigns/${campaignId}/save`, {
    method: 'POST',
  });
  return (r as { data?: { saved: boolean } }).data ?? { saved: false };
}

export async function getSavedCampaignIds(): Promise<string[]> {
  const r = await apiFetch<{ success: boolean; data?: string[] }>('/campaigns/saved/ids');
  return (r as { data?: string[] }).data ?? [];
}

export async function getMyBrandCampaigns(params: { limit?: number; offset?: number } = {}) {
  const qs = new URLSearchParams();
  if (params.limit != null) qs.set('limit', String(params.limit));
  if (params.offset != null) qs.set('offset', String(params.offset));
  const q = qs.toString();
  const res = await apiFetch<{ success: boolean; data?: { items: ApiCampaign[]; total: number } }>(
    `/campaigns/mine${q ? `?${q}` : ''}`
  );
  return (res as { data?: { items: ApiCampaign[]; total: number } }).data ?? { items: [], total: 0 };
}

export async function updateCampaign(id: string, payload: UpdateCampaignPayload) {
  const res = await apiFetch<{ success: boolean; data?: ApiCampaign }>(`/campaigns/${id}`, {
    method: 'PATCH',
    json: payload,
  });
  return (res as { data?: ApiCampaign }).data ?? null;
}

export async function deleteCampaign(id: string): Promise<{ deleted: boolean }> {
  const res = await apiFetch<{ success: boolean; data?: { deleted: boolean } }>(`/campaigns/${id}`, {
    method: 'DELETE',
  });
  return (res as { data?: { deleted: boolean } }).data ?? { deleted: false };
}

export async function getCampaignApplications(
  campaignId: string,
  params: { limit?: number; offset?: number } = {}
) {
  const qs = new URLSearchParams();
  if (params.limit != null) qs.set('limit', String(params.limit));
  if (params.offset != null) qs.set('offset', String(params.offset));
  const q = qs.toString();
  const res = await apiFetch<{ success: boolean; data?: { items: ApiApplication[]; total: number } }>(
    `/campaigns/${campaignId}/applications${q ? `?${q}` : ''}`
  );
  return (res as { data?: { items: ApiApplication[]; total: number } }).data ?? { items: [], total: 0 };
}

export async function updateApplicationStatus(
  campaignId: string,
  appId: string,
  status: 'accepted' | 'rejected'
) {
  const res = await apiFetch<{ success: boolean; data?: ApiApplication }>(
    `/campaigns/${campaignId}/applications/${appId}`,
    { method: 'PATCH', json: { status } }
  );
  return (res as { data?: ApiApplication }).data ?? null;
}

export async function getMyApplications(params: { limit?: number; offset?: number } = {}) {
  const qs = new URLSearchParams();
  if (params.limit != null) qs.set('limit', String(params.limit));
  if (params.offset != null) qs.set('offset', String(params.offset));
  const q = qs.toString();
  const res = await apiFetch<{ success: boolean; data?: { items: ApiApplication[]; total: number } }>(
    `/campaigns/my-applications${q ? `?${q}` : ''}`
  );
  return (res as { data?: { items: ApiApplication[]; total: number } }).data ?? { items: [], total: 0 };
}
