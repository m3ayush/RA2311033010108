/**
 * Notification Service
 * Handles fetching notifications from the evaluation service API.
 */

import axios from "axios";
import { config } from "../config";
import { getToken } from "../auth/tokenManager";
import { Notification, NotificationResponse, NotificationType } from "../domain/notification";
import { createLogger } from "logging-middleware";

const Log = createLogger({
  email: config.email,
  name: config.name,
  rollNo: config.rollNo,
  accessCode: config.accessCode,
  clientID: config.clientID,
  clientSecret: config.clientSecret,
  baseUrl: config.baseUrl,
});

/**
 * Fetch notifications from the evaluation service.
 * Supports pagination and type filtering.
 */
export async function fetchNotifications(
  page?: number,
  limit?: number,
  type?: NotificationType
): Promise<Notification[]> {
  try {
    const token = await getToken();
    const url = `${config.baseUrl}/evaluation-service/notifications`;

    // Build query parameters
    const params: Record<string, string | number> = {};
    if (page) params.page = page;
    if (limit) params.limit = limit;
    if (type) params.notification_type = type;

    await Log(
      "backend",
      "info",
      "service",
      `Fetching notifications: page=${page || "all"}, limit=${limit || "default"}, type=${type || "all"}`
    );

    const response = await axios.get<NotificationResponse>(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params,
    });

    const notifications = response.data.notifications || [];

    await Log(
      "backend",
      "info",
      "service",
      `Fetched ${notifications.length} notifications successfully`
    );

    return notifications;
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : "Unknown error";
    await Log(
      "backend",
      "error",
      "service",
      `Failed to fetch notifications: ${errMsg}`
    );
    throw new Error(`Failed to fetch notifications: ${errMsg}`);
  }
}
