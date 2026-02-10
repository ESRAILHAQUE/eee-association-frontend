import { API_BASE } from "./constants";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  fullName: string;
  email: string;
  registrationNumber: string;
  password: string;
}

export interface AuthUser {
  id: string;
  fullName: string;
  institutionalEmail: string;
  registrationNumber?: string;
  currentRole?: string;
  isVerified?: boolean;
}

export interface LoginResponse {
  success: boolean;
  data: {
    user: AuthUser;
    accessToken: string;
    expiresIn: string;
  };
}

export interface RegisterResponse {
  success: boolean;
  data: {
    user: {
      id: string;
      fullName: string;
      institutionalEmail: string;
      isVerified: boolean;
    };
    message: string;
  };
}

export async function login(body: LoginPayload): Promise<LoginResponse> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message ?? data?.error ?? "Login failed");
  return data;
}

export async function register(
  body: RegisterPayload,
): Promise<RegisterResponse> {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok)
    throw new Error(data?.message ?? data?.error ?? "Registration failed");
  return data;
}

export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("accessToken");
}

export function setStoredToken(token: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("accessToken", token);
}

export function setStoredUser(user: AuthUser): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("user", JSON.stringify(user));
}

export function getStoredUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const s = localStorage.getItem("user");
    return s ? (JSON.parse(s) as AuthUser) : null;
  } catch {
    return null;
  }
}

const AUTH_COOKIE_NAME = "eee_auth";
const AUTH_COOKIE_MAX_AGE_DAYS = 7;

export function setAuthCookie(): void {
  if (typeof document === "undefined") return;
  document.cookie = `${AUTH_COOKIE_NAME}=1; path=/; max-age=${AUTH_COOKIE_MAX_AGE_DAYS * 86400}; samesite=lax`;
}

export function clearAuthCookie(): void {
  if (typeof document === "undefined") return;
  document.cookie = `${AUTH_COOKIE_NAME}=; path=/; max-age=0`;
}

export function clearStoredAuth(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem("accessToken");
  localStorage.removeItem("user");
  clearAuthCookie();
}

/** Profile + user from backend (when verified, profile may contain UserProfile fields) */
export interface ProfileResponse {
  success: boolean;
  data: {
    user: AuthUser;
    profile?: UserProfile | null;
    pending: boolean;
  };
}

export interface UserProfile {
  id?: string;
  registrationNumber?: string;
  rollNumber?: string | null;
  batch?: string | null;
  session?: string | null;
  department?: string | null;
  program?: string | null;
  enrollmentYear?: number | null;
  personalEmail?: string | null;
  phoneNumber?: string | null;
  address?: string | null;
  createdAt?: string;
  [key: string]: unknown;
}

export async function fetchProfile(): Promise<ProfileResponse["data"]> {
  const token = getStoredToken();
  if (!token) throw new Error("Not authenticated");
  const res = await fetch(`${API_BASE}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message ?? data?.error ?? "Failed to load profile");
  if (!data.success || !data.data) throw new Error("Invalid profile response");
  return data.data;
}
