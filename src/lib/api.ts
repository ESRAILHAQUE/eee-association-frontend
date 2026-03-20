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

// ─── Notices ─────────────────────────────────────────────────────────────────

export type NoticeTarget = "all" | "batch_specific";

export interface Notice {
  id: string;
  title: string;
  content: string;
  targetType: NoticeTarget;
  batch: string | null;
  isPinned: boolean;
  isUrgent: boolean;
  createdAt: string;
  createdBy: { id: string; fullName: string; currentRole: string };
}

export interface CreateNoticePayload {
  title: string;
  content: string;
  targetType?: NoticeTarget;
  batch?: string;
  isPinned?: boolean;
  isUrgent?: boolean;
}

export async function fetchNotices(params?: {
  batch?: string;
  targetType?: NoticeTarget;
}): Promise<Notice[]> {
  const token = getStoredToken();
  if (!token) throw new Error("Not authenticated");
  const qs = new URLSearchParams();
  if (params?.batch) qs.set("batch", params.batch);
  if (params?.targetType) qs.set("targetType", params.targetType);
  const res = await fetch(`${API_BASE}/notices?${qs.toString()}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message ?? "Failed to fetch notices");
  return data.data as Notice[];
}

export async function createNotice(payload: CreateNoticePayload): Promise<Notice> {
  const token = getStoredToken();
  if (!token) throw new Error("Not authenticated");
  const res = await fetch(`${API_BASE}/notices`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message ?? "Failed to create notice");
  return data.data as Notice;
}

export async function deleteNotice(id: string): Promise<void> {
  const token = getStoredToken();
  if (!token) throw new Error("Not authenticated");
  const res = await fetch(`${API_BASE}/notices/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data?.message ?? "Failed to delete notice");
  }
}

// ─── Events ──────────────────────────────────────────────────────────────────

export type EventStatus = "draft" | "published" | "cancelled" | "completed";
export type EventType =
  | "workshop"
  | "seminar"
  | "competition"
  | "cultural"
  | "meeting"
  | "other";

export interface Event {
  id: string;
  title: string;
  description: string;
  eventType: EventType;
  status: EventStatus;
  venue: string;
  startAt: string;
  endAt: string;
  targetBatch: string | null;
  maxCapacity: number | null;
  createdAt: string;
  createdBy: { id: string; fullName: string; currentRole: string };
  approvedBy: { id: string; fullName: string } | null;
  _count: { rsvps: number };
}

export interface CreateEventPayload {
  title: string;
  description: string;
  eventType?: EventType;
  venue: string;
  startAt: string;
  endAt: string;
  targetBatch?: string | null;
  maxCapacity?: number | null;
}

export async function fetchEvents(params?: {
  status?: EventStatus;
  targetBatch?: string;
}): Promise<Event[]> {
  const token = getStoredToken();
  if (!token) throw new Error("Not authenticated");
  const qs = new URLSearchParams();
  if (params?.status) qs.set("status", params.status);
  if (params?.targetBatch) qs.set("targetBatch", params.targetBatch);
  const res = await fetch(`${API_BASE}/events?${qs.toString()}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message ?? "Failed to fetch events");
  return data.data as Event[];
}

export async function createEvent(payload: CreateEventPayload): Promise<Event> {
  const token = getStoredToken();
  if (!token) throw new Error("Not authenticated");
  const res = await fetch(`${API_BASE}/events`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message ?? "Failed to create event");
  return data.data as Event;
}

export async function updateEventStatus(
  id: string,
  status: EventStatus,
): Promise<Event> {
  const token = getStoredToken();
  if (!token) throw new Error("Not authenticated");
  const res = await fetch(`${API_BASE}/events/${id}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message ?? "Failed to update event status");
  return data.data as Event;
}

export async function rsvpEvent(id: string): Promise<void> {
  const token = getStoredToken();
  if (!token) throw new Error("Not authenticated");
  const res = await fetch(`${API_BASE}/events/${id}/rsvp`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data?.message ?? "Failed to RSVP");
  }
}

export async function cancelRsvpEvent(id: string): Promise<void> {
  const token = getStoredToken();
  if (!token) throw new Error("Not authenticated");
  const res = await fetch(`${API_BASE}/events/${id}/rsvp`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data?.message ?? "Failed to cancel RSVP");
  }
}

export async function deleteEvent(id: string): Promise<void> {
  const token = getStoredToken();
  if (!token) throw new Error("Not authenticated");
  const res = await fetch(`${API_BASE}/events/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data?.message ?? "Failed to delete event");
  }
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

// ─── Shared helper ────────────────────────────────────────────────────────────
async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredToken();
  if (!token) throw new Error("Not authenticated");
  const isFormData = options.body instanceof FormData;
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      ...(!isFormData ? { "Content-Type": "application/json" } : {}),
      Authorization: `Bearer ${token}`,
      ...(options.headers ?? {}),
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message ?? "Request failed");
  return (data.data ?? data) as T;
}

// ─── Notifications ────────────────────────────────────────────────────────────
export interface AppNotification { id: string; title: string; message: string; status: "unread" | "read"; createdAt: string; }
export async function fetchMyNotifications(): Promise<AppNotification[]> { return apiRequest<AppNotification[]>("/notifications/my"); }
export async function sendNotification(payload: { title: string; message: string; targetType: "all" | "batch"; batch?: string; }): Promise<void> { await apiRequest("/notifications/send", { method: "POST", body: JSON.stringify(payload) }); }
export async function markAllNotificationsRead(): Promise<void> { await apiRequest("/notifications/read-all", { method: "PATCH" }); }

// ─── Attendance ───────────────────────────────────────────────────────────────
export interface AttendanceQRData { token: string; expiresAt: string; eventId: string; }
export interface AttendanceRecord { id: string; scannedAt: string; user?: { id: string; fullName: string; registrationNumber: string; }; event?: { id: string; title: string; startAt: string; }; }
export async function generateQR(eventId: string): Promise<AttendanceQRData> { return apiRequest<AttendanceQRData>("/attendance/qr/generate", { method: "POST", body: JSON.stringify({ eventId }) }); }
export async function getEventQR(eventId: string): Promise<AttendanceQRData> { return apiRequest<AttendanceQRData>(`/attendance/qr/${eventId}`); }
export async function scanAttendance(token: string): Promise<void> { await apiRequest("/attendance/scan", { method: "POST", body: JSON.stringify({ token }) }); }
export async function fetchEventAttendance(eventId: string): Promise<AttendanceRecord[]> { return apiRequest<AttendanceRecord[]>(`/attendance/event/${eventId}`); }
export async function fetchMyAttendance(): Promise<AttendanceRecord[]> { return apiRequest<AttendanceRecord[]>("/attendance/my"); }

// ─── Certificates ─────────────────────────────────────────────────────────────
export interface CertificateItem { id: string; issuedAt: string; event: { id: string; title: string; startAt: string; }; issuedBy: { fullName: string; }; }
export async function fetchMyCertificates(): Promise<CertificateItem[]> { return apiRequest<CertificateItem[]>("/certificates/my"); }
export async function issueCertificates(eventId: string, userIds: string[]): Promise<void> { await apiRequest("/certificates/issue", { method: "POST", body: JSON.stringify({ eventId, userIds }) }); }
export async function fetchEventCertificates(eventId: string): Promise<CertificateItem[]> { return apiRequest<CertificateItem[]>(`/certificates/event/${eventId}`); }

// ─── Feedback ─────────────────────────────────────────────────────────────────
export interface FeedbackItem { id: string; title: string; content: string; isAnonymous: boolean; batch: string | null; status: string; resolution: string | null; createdAt: string; submittedBy?: { id: string; fullName: string; }; }
export async function fetchFeedbacks(): Promise<FeedbackItem[]> { return apiRequest<FeedbackItem[]>("/feedback"); }
export async function submitFeedback(payload: { title: string; content: string; isAnonymous?: boolean; }): Promise<FeedbackItem> { return apiRequest<FeedbackItem>("/feedback", { method: "POST", body: JSON.stringify(payload) }); }
export async function updateFeedback(id: string, data: { status?: string; resolution?: string; }): Promise<FeedbackItem> { return apiRequest<FeedbackItem>(`/feedback/${id}`, { method: "PATCH", body: JSON.stringify(data) }); }

// ─── Leave Requests ───────────────────────────────────────────────────────────
export interface LeaveRequest { id: string; title: string; reason: string; leaveDate: string; returnDate: string; status: string; reviewNote: string | null; createdAt: string; user?: { id: string; fullName: string; registrationNumber: string; }; reviewedBy?: { fullName: string; } | null; }
export async function fetchMyLeaveRequests(): Promise<LeaveRequest[]> { return apiRequest<LeaveRequest[]>("/leave/my"); }
export async function fetchLeaveRequests(): Promise<LeaveRequest[]> { return apiRequest<LeaveRequest[]>("/leave"); }
export async function submitLeaveRequest(payload: { title: string; reason: string; leaveDate: string; returnDate: string; }): Promise<LeaveRequest> { return apiRequest<LeaveRequest>("/leave", { method: "POST", body: JSON.stringify(payload) }); }
export async function reviewLeaveRequest(id: string, data: { status: "approved" | "rejected"; reviewNote?: string; }): Promise<LeaveRequest> { return apiRequest<LeaveRequest>(`/leave/${id}`, { method: "PATCH", body: JSON.stringify(data) }); }

// ─── Resources ────────────────────────────────────────────────────────────────
export interface ResourceItem { id: string; title: string; description: string | null; subject: string; semester: number | null; fileUrl: string; fileType: string; status: string; downloads: number; batch: string | null; createdAt: string; uploadedBy: { id: string; fullName: string; }; }
export async function fetchResources(params?: { subject?: string; semester?: number; }): Promise<ResourceItem[]> { const qs = new URLSearchParams(); if (params?.subject) qs.set("subject", params.subject); if (params?.semester) qs.set("semester", String(params.semester)); return apiRequest<ResourceItem[]>(`/resources?${qs}`); }
export async function fetchPendingResources(): Promise<ResourceItem[]> { return apiRequest<ResourceItem[]>("/resources/pending"); }
export async function uploadResource(payload: { title: string; subject: string; fileUrl: string; fileType: string; description?: string; semester?: number; }): Promise<ResourceItem> { return apiRequest<ResourceItem>("/resources", { method: "POST", body: JSON.stringify(payload) }); }
export async function updateResourceStatus(id: string, status: "approved" | "rejected"): Promise<ResourceItem> { return apiRequest<ResourceItem>(`/resources/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) }); }

// ─── Clubs ────────────────────────────────────────────────────────────────────
export interface ClubItem { id: string; name: string; description: string; logoUrl: string | null; isActive: boolean; createdAt: string; _count: { members: number; }; }
export async function fetchClubs(): Promise<ClubItem[]> { return apiRequest<ClubItem[]>("/clubs"); }
export async function fetchMyClubs(): Promise<ClubItem[]> { return apiRequest<ClubItem[]>("/clubs/my"); }
export async function joinClub(id: string): Promise<void> { await apiRequest(`/clubs/${id}/join`, { method: "POST" }); }
export async function leaveClub(id: string): Promise<void> { await apiRequest(`/clubs/${id}/leave`, { method: "DELETE" }); }
export async function createClub(payload: { name: string; description: string; }): Promise<ClubItem> { return apiRequest<ClubItem>("/clubs", { method: "POST", body: JSON.stringify(payload) }); }

// ─── Projects ─────────────────────────────────────────────────────────────────
export interface ProjectItem { id: string; title: string; abstract: string; category: string; batch: string | null; githubUrl: string | null; docUrl: string | null; likes: number; createdAt: string; user: { id: string; fullName: string; }; }
export async function fetchProjects(params?: { category?: string; batch?: string; }): Promise<ProjectItem[]> { const qs = new URLSearchParams(); if (params?.category) qs.set("category", params.category); if (params?.batch) qs.set("batch", params.batch); return apiRequest<ProjectItem[]>(`/projects?${qs}`); }
export async function submitProject(payload: { title: string; abstract: string; category: string; githubUrl?: string; docUrl?: string; }): Promise<ProjectItem> { return apiRequest<ProjectItem>("/projects", { method: "POST", body: JSON.stringify(payload) }); }
export async function likeProject(id: string): Promise<void> { await apiRequest(`/projects/${id}/like`, { method: "POST" }); }
export async function deleteProject(id: string): Promise<void> { await apiRequest(`/projects/${id}`, { method: "DELETE" }); }

// ─── Mentorship ───────────────────────────────────────────────────────────────
export interface MentorProfileItem { id: string; expertise: string[]; bio: string; isActive: boolean; user: { id: string; fullName: string; }; }
export interface MentorSessionItem { id: string; topic: string; scheduledAt: string; status: string; feedback: string | null; createdAt: string; mentor: { id: string; user: { fullName: string; }; }; mentee: { id: string; fullName: string; }; }
export async function fetchMentors(): Promise<MentorProfileItem[]> { return apiRequest<MentorProfileItem[]>("/mentorship/mentors"); }
export async function registerAsMentor(payload: { expertise: string[]; bio: string; }): Promise<MentorProfileItem> { return apiRequest<MentorProfileItem>("/mentorship/register", { method: "POST", body: JSON.stringify(payload) }); }
export async function requestMentorSession(payload: { mentorId: string; topic: string; scheduledAt: string; }): Promise<MentorSessionItem> { return apiRequest<MentorSessionItem>("/mentorship/sessions", { method: "POST", body: JSON.stringify(payload) }); }
export async function fetchMySessions(): Promise<MentorSessionItem[]> { return apiRequest<MentorSessionItem[]>("/mentorship/sessions/my"); }

// ─── Forum ────────────────────────────────────────────────────────────────────
export interface ForumCategory { id: string; name: string; }
export interface ForumPostItem { id: string; title: string; content: string; status: string; createdAt: string; category: ForumCategory; author: { id: string; fullName: string; }; _count: { comments: number; votes: number; }; }
export interface ForumCommentItem { id: string; content: string; createdAt: string; author: { id: string; fullName: string; }; }
export async function fetchForumCategories(): Promise<ForumCategory[]> { return apiRequest<ForumCategory[]>("/forum/categories"); }
export async function fetchForumPosts(categoryId?: string): Promise<ForumPostItem[]> { const qs = categoryId ? `?categoryId=${categoryId}` : ""; return apiRequest<ForumPostItem[]>(`/forum/posts${qs}`); }
export async function createForumPost(payload: { title: string; content: string; categoryId: string; }): Promise<ForumPostItem> { return apiRequest<ForumPostItem>("/forum/posts", { method: "POST", body: JSON.stringify(payload) }); }
export async function fetchPostComments(postId: string): Promise<ForumCommentItem[]> { return apiRequest<ForumCommentItem[]>(`/forum/posts/${postId}/comments`); }
export async function addComment(postId: string, content: string): Promise<ForumCommentItem> { return apiRequest<ForumCommentItem>(`/forum/posts/${postId}/comments`, { method: "POST", body: JSON.stringify({ content }) }); }
export async function votePost(postId: string, vote: 1 | -1): Promise<void> { await apiRequest(`/forum/posts/${postId}/vote`, { method: "POST", body: JSON.stringify({ vote }) }); }
export async function updatePostStatus(postId: string, status: string): Promise<void> { await apiRequest(`/forum/posts/${postId}/status`, { method: "PATCH", body: JSON.stringify({ status }) }); }

// ─── Documents ────────────────────────────────────────────────────────────────
export interface DocumentItem { id: string; title: string; description: string | null; fileUrl: string; fileType: string; category: string; accessLevel: string; createdAt: string; uploadedBy: { fullName: string; }; }
export async function fetchDocuments(category?: string): Promise<DocumentItem[]> { const qs = category ? `?category=${category}` : ""; return apiRequest<DocumentItem[]>(`/documents${qs}`); }
export async function uploadDocument(payload: { title: string; fileUrl: string; fileType: string; category: string; description?: string; accessLevel?: string; }): Promise<DocumentItem> { return apiRequest<DocumentItem>("/documents", { method: "POST", body: JSON.stringify(payload) }); }
export async function deleteDocument(id: string): Promise<void> { await apiRequest(`/documents/${id}`, { method: "DELETE" }); }

// ─── Users ────────────────────────────────────────────────────────────────────
export interface UserListItem { id: string; fullName: string; registrationNumber: string; institutionalEmail: string; currentRole: string; isVerified: boolean; isBlock: boolean; lastLoginAt: string | null; profile?: { batch: string | null; rollNumber: string | null; }; }
export async function fetchUsers(params?: { role?: string; batch?: string; search?: string; }): Promise<UserListItem[]> { const qs = new URLSearchParams(); if (params?.role) qs.set("role", params.role); if (params?.batch) qs.set("batch", params.batch); if (params?.search) qs.set("search", params.search); return apiRequest<UserListItem[]>(`/users?${qs}`); }
export async function updateUserRole(userId: string, role: string): Promise<void> { await apiRequest(`/users/${userId}/role`, { method: "PATCH", body: JSON.stringify({ role }) }); }
export async function toggleUserBlock(userId: string, isBlock: boolean): Promise<void> { await apiRequest(`/users/${userId}/block`, { method: "PATCH", body: JSON.stringify({ isBlock }) }); }
export async function verifyUser(userId: string): Promise<void> { await apiRequest(`/users/${userId}/verify`, { method: "PATCH" }); }

// ─── Fees / Payments ──────────────────────────────────────────────────────────
export interface FeeRecord { id: string; semesterNumber: number; feeAmount: string; paidAmount: string; dueAmount: string; paymentStatus: "paid" | "partial" | "unpaid"; paymentMethod: string | null; transactionReference: string | null; paymentDate: string | null; user?: { id: string; fullName: string; registrationNumber: string; profile?: { batch: string | null; rollNumber: string | null; } | null; }; }
export interface FeeStats { totalCount: number; paid: number; pending: number; partial: number; totalFeeAmount: string; totalPaid: string; totalDue: string; }
export async function fetchMyFees(): Promise<FeeRecord[]> { return apiRequest<FeeRecord[]>("/fees/my"); }
export async function fetchFees(params?: { batch?: string; status?: string }): Promise<FeeRecord[]> { const qs = new URLSearchParams(); if (params?.batch) qs.set("batch", params.batch); if (params?.status) qs.set("status", params.status); return apiRequest<FeeRecord[]>(`/fees?${qs}`); }
export async function fetchFeeStats(params?: { batch?: string }): Promise<FeeStats> { const qs = params?.batch ? `?batch=${params.batch}` : ""; return apiRequest<FeeStats>(`/fees/stats${qs}`); }
export async function createFeeRecord(payload: { userId: string; semesterNumber: number; feeAmount: number }): Promise<FeeRecord> { return apiRequest<FeeRecord>("/fees", { method: "POST", body: JSON.stringify(payload) }); }
export async function recordFeePayment(id: string, payload: { paidAmount: number; paymentMethod?: string; transactionReference?: string }): Promise<FeeRecord> { return apiRequest<FeeRecord>(`/fees/${id}/payment`, { method: "PATCH", body: JSON.stringify(payload) }); }

// ─── Analytics ────────────────────────────────────────────────────────────────
export interface AnalyticsOverview { users: { total: number; verified: number; unverified: number; recentSignups: number; byRole: Record<string, number>; }; events: { total: number; published: number; draft: number; }; notices: { total: number }; attendance: { total: number }; feedback: { total: number }; leaveRequests: { total: number }; clubs: { total: number }; projects: { total: number }; resources: { total: number }; fees: { totalExpected: string | number; totalCollected: string | number; totalDue: string | number; }; }
export async function fetchAnalyticsOverview(): Promise<AnalyticsOverview> { return apiRequest<AnalyticsOverview>("/analytics/overview"); }

// ─── Logs ─────────────────────────────────────────────────────────────────────
export interface LoginLog { id: string; loggedAt: string; ip: string | null; userAgent: string | null; user: { id: string; fullName: string; registrationNumber: string; currentRole: string; }; }
export async function fetchLoginLogs(params?: { userId?: string; limit?: number }): Promise<LoginLog[]> { const qs = new URLSearchParams(); if (params?.userId) qs.set("userId", params.userId); if (params?.limit) qs.set("limit", String(params.limit)); return apiRequest<LoginLog[]>(`/logs/logins?${qs}`); }

// ─── Newsletter ───────────────────────────────────────────────────────────────
export interface NewsletterItem { id: string; title: string; content: string; createdAt: string; createdBy: { id: string; fullName: string; }; }
export async function fetchNewsletters(): Promise<NewsletterItem[]> { return apiRequest<NewsletterItem[]>("/newsletter"); }
export async function sendNewsletter(payload: { subject: string; body: string }): Promise<NewsletterItem> { return apiRequest<NewsletterItem>("/newsletter/send", { method: "POST", body: JSON.stringify(payload) }); }
