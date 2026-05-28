import { apiFetch } from './http';

export type ContactRequest = {
  name: string;
  email: string;
  message: string;
};

export type ContactResponse = { success: true; message?: string } | { success: false; message: string };

export async function submitContact(payload: ContactRequest) {
  return apiFetch<ContactResponse>('/contact', {
    method: 'POST',
    json: payload,
    skipAuth: true,
  });
}
