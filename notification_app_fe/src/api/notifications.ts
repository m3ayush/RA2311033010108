/**
 * API Client for Notifications
 * Handles all HTTP requests to the backend service.
 */

import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Notification type from the API
export interface Notification {
  ID: string;
  Type: "Placement" | "Result" | "Event";
  Message: string;
  Timestamp: string;
  isRead?: boolean;
  priorityScore?: number;
}

// API response shapes
interface AllNotificationsResponse {
  notifications: Notification[];
  total: number;
  page: number;
}

interface PriorityNotificationsResponse {
  notifications: Notification[];
  count: number;
  requestedN: number;
  filterType: string;
}

/**
 * Fetch all notifications with optional pagination and filtering.
 */
export async function fetchAllNotifications(
  page?: number,
  limit?: number,
  type?: string
): Promise<AllNotificationsResponse> {
  const params: Record<string, string | number> = {};
  if (page) params.page = page;
  if (limit) params.limit = limit;
  if (type) params.type = type;

  const response = await api.get<AllNotificationsResponse>("/notifications", {
    params,
  });
  return response.data;
}

/**
 * Fetch top N priority notifications.
 */
export async function fetchPriorityNotifications(
  n: number = 10,
  type?: string
): Promise<PriorityNotificationsResponse> {
  const params: Record<string, string | number> = { n };
  if (type) params.type = type;

  const response = await api.get<PriorityNotificationsResponse>(
    "/notifications/priority",
    { params }
  );
  return response.data;
}

/**
 * Mark a single notification as read.
 */
export async function markNotificationRead(id: string): Promise<void> {
  await api.post(`/notifications/${id}/read`);
}

/**
 * Mark multiple notifications as read.
 */
export async function markBulkRead(ids: string[]): Promise<void> {
  await api.post("/notifications/read-bulk", { ids });
}
