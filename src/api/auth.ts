import { apiFetch } from './http';

export type RegisterUserType = 'influencer' | 'brand' | 'admin';

export type RegisterRequest = {
  email: string;
  password: string;
  userType: RegisterUserType;
  fullName?: string;
  brandName?: string;
  firstName?: string;
  lastName?: string;
};

export type RegisterResponse =
  | {
      message?: string;
      token?: string;
      user?: unknown;
    }
  | unknown;

/** Register path – fixed, not from env. Base URL comes from VITE_API_BASE_URL. */
const REGISTER_PATH = '/auth/register';

export async function registerInfluencerOrBrand(payload: RegisterRequest) {
  return apiFetch<RegisterResponse>(REGISTER_PATH, {
    method: 'POST',
    json: payload,
    skipAuth: true,
  });
}

/** Google login path – fixed. Base URL from VITE_API_BASE_URL. */
const GOOGLE_AUTH_PATH = '/auth/google';

export type GoogleLoginRequest = {
  idToken: string;
  userType: RegisterUserType;
};

export type GoogleLoginResponse =
  | {
      message?: string;
      token?: string;
      user?: unknown;
    }
  | unknown;

export async function googleLogin(payload: GoogleLoginRequest) {
  return apiFetch<GoogleLoginResponse>(GOOGLE_AUTH_PATH, {
    method: 'POST',
    json: payload,
    skipAuth: true,
  });
}

/** Login path – fixed. Base URL from VITE_API_BASE_URL. */
const LOGIN_PATH = '/auth/login';

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  accessToken?: string;
  token?: string;
  user?: { userType?: string; [k: string]: unknown };
  [k: string]: unknown;
};

export async function login(payload: LoginRequest) {
  return apiFetch<LoginResponse>(LOGIN_PATH, {
    method: 'POST',
    json: payload,
    skipAuth: true,
  });
}

/** Forgot password path – sends reset email. Base URL from VITE_API_BASE_URL. */
const FORGOT_PASSWORD_PATH = '/auth/forgot-password';

export type ForgotPasswordRequest = {
  email: string;
};

export async function forgotPassword(payload: ForgotPasswordRequest) {
  return apiFetch<{ message?: string }>(FORGOT_PASSWORD_PATH, {
    method: 'POST',
    json: payload,
    skipAuth: true,
  });
}
