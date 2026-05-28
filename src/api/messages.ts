import { apiFetch } from './http';

export interface SendMessagePayload {
  recipientId: string;
  subject?: string;
  body: string;
  campaignId?: string;
}

export async function sendMessage(payload: SendMessagePayload) {
  return apiFetch<unknown>('/messages', {
    method: 'POST',
    json: payload,
  });
}
