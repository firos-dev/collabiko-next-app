const TOKEN_KEY = 'collabiko_access_token';
const USER_TYPE_KEY = 'collabiko_user_type';
export const INTENDED_PATH_KEY = 'collabiko_intended_path';

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearAuth(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_TYPE_KEY);
}

export function setUserType(userType: 'influencer' | 'brand'): void {
  localStorage.setItem(USER_TYPE_KEY, userType);
}

export function getUserType(): 'influencer' | 'brand' | null {
  const t = localStorage.getItem(USER_TYPE_KEY);
  if (t === 'influencer' || t === 'brand') return t;
  return null;
}

export function isAuthenticated(): boolean {
  return !!getToken();
}
