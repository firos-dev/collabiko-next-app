// client/src/routing.ts

export type AccessLevel = 'public' | 'guest-only' | 'brand-only' | 'influencer-only';

/**
 * Maps exact URL paths to their required access level.
 * Prefix routes (e.g. /influencer-profile/*) are handled separately in getAccess().
 */
export const ROUTE_ACCESS: Record<string, AccessLevel> = {
  '/': 'public',
  '/blog': 'public',
  '/about': 'public',
  '/testimonials': 'public',
  '/auth': 'guest-only',
  '/login': 'guest-only',
  '/register': 'guest-only',
  '/forgot-password': 'guest-only',
  '/brand-dashboard': 'brand-only',
  '/search-influencers': 'brand-only',
  '/create-campaign': 'brand-only',
  '/brand-notifications': 'brand-only',
  '/brand-home': 'brand-only',
  '/brand-profile': 'brand-only',
  '/influencer-profile': 'brand-only',
  '/influencer-dashboard': 'influencer-only',
  '/influencer-notifications': 'influencer-only',
};

/**
 * Returns the access level for a given path.
 * Handles the /influencer-profile prefix route before the exact-key lookup.
 */
export function getAccess(path: string): AccessLevel {
  if (path.startsWith('/influencer-profile')) return 'brand-only';
  return ROUTE_ACCESS[path] ?? 'public';
}

/**
 * Returns the default dashboard path for a given user type.
 * Returns '/auth' for null (broken/unauthenticated state).
 */
export function dashboardForUserType(userType: 'brand' | 'influencer' | null): string {
  if (userType === 'brand') return '/brand-dashboard';
  if (userType === 'influencer') return '/influencer-dashboard';
  return '/auth';
}
