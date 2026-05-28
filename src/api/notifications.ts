import { apiFetch } from './http';

export interface ApiNotification {
  id: string;
  type: string;
  title: string;
  message: string;
  readAt: string | null;
  createdAt: string;
}

export interface ListNotificationsParams {
  type?: string;
  unreadOnly?: boolean;
  limit?: number;
  offset?: number;
}

export async function listNotifications(params: ListNotificationsParams = {}) {
  const searchParams = new URLSearchParams();
  if (params.type) searchParams.set('type', params.type);
  if (params.unreadOnly) searchParams.set('unreadOnly', 'true');
  if (params.limit != null) searchParams.set('limit', String(params.limit));
  if (params.offset != null) searchParams.set('offset', String(params.offset));
  const qs = searchParams.toString();
  const res = await apiFetch<{
    success: boolean;
    data?: { items: ApiNotification[]; total: number; unreadCount?: number };
  }>(`/notifications${qs ? `?${qs}` : ''}`);
  const data = (res as { data?: { items: ApiNotification[]; total: number; unreadCount?: number } }).data;
  return data ?? { items: [], total: 0, unreadCount: 0 };
}

export async function markNotificationRead(id: string) {
  return apiFetch<ApiNotification>(`/notifications/${id}/read`, {
    method: 'PATCH',
  });
}

export async function markAllNotificationsRead() {
  return apiFetch<{ marked: number }>('/notifications/read-all', {
    method: 'POST',
  });
}

export async function deleteNotification(id: string) {
  return apiFetch<void>(`/notifications/${id}`, {
    method: 'DELETE',
  });
}
