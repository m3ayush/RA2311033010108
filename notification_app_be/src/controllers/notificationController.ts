/**
 * Notification Controller
 * Handles HTTP request/response logic for notification endpoints.
 */

import { Request, Response } from "express";
import { fetchNotifications } from "../services/notificationService";
import { getTopNPriority } from "../services/priorityInbox";
import { NotificationType } from "../domain/notification";
import { createLogger } from "logging-middleware";
import { config } from "../config";

const Log = createLogger({
  email: config.email,
  name: config.name,
  rollNo: config.rollNo,
  accessCode: config.accessCode,
  clientID: config.clientID,
  clientSecret: config.clientSecret,
  baseUrl: config.baseUrl,
});

// In-memory set of read notification IDs
const readNotificationIds = new Set<string>();

/**
 * GET /api/notifications
 * Fetch all notifications with optional pagination and type filter.
 */
export async function getAllNotifications(req: Request, res: Response): Promise<void> {
  try {
    const page = req.query.page ? parseInt(req.query.page as string, 10) : undefined;
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined;
    const type = req.query.type as NotificationType | undefined;

    await Log(
      "backend",
      "info",
      "controller",
      `GET /api/notifications — page=${page}, limit=${limit}, type=${type}`
    );

    const notifications = await fetchNotifications(page, limit, type);

    // Mark read status on each notification
    const withReadStatus = notifications.map((n) => ({
      ...n,
      isRead: readNotificationIds.has(n.ID),
    }));

    res.json({
      notifications: withReadStatus,
      total: notifications.length,
      page: page || 1,
    });
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : "Unknown error";
    await Log("backend", "error", "controller", `Failed to get notifications: ${errMsg}`);
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
}

/**
 * GET /api/notifications/priority
 * Get top N priority unread notifications.
 * Query params: n (count), type (filter)
 */
export async function getPriorityNotifications(req: Request, res: Response): Promise<void> {
  try {
    const n = req.query.n ? parseInt(req.query.n as string, 10) : 10;
    const type = req.query.type as NotificationType | undefined;

    await Log(
      "backend",
      "info",
      "controller",
      `GET /api/notifications/priority — n=${n}, type=${type}`
    );

    // Validate n
    if (n < 1 || n > 100) {
      await Log("backend", "warn", "controller", `Invalid n value: ${n}. Must be 1-100.`);
      res.status(400).json({ error: "n must be between 1 and 100" });
      return;
    }

    // Validate type if provided
    if (type && !Object.values(NotificationType).includes(type)) {
      await Log("backend", "warn", "controller", `Invalid notification type: ${type}`);
      res.status(400).json({ error: "Invalid notification type. Use: Event, Result, or Placement" });
      return;
    }

    // Fetch all notifications to compute priority
    const allNotifications = await fetchNotifications();

    // Get top N priority notifications
    const priorityNotifications = getTopNPriority(
      allNotifications,
      n,
      readNotificationIds,
      type
    );

    res.json({
      notifications: priorityNotifications,
      count: priorityNotifications.length,
      requestedN: n,
      filterType: type || "all",
    });
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : "Unknown error";
    await Log("backend", "error", "controller", `Failed to get priority notifications: ${errMsg}`);
    res.status(500).json({ error: "Failed to fetch priority notifications" });
  }
}

/**
 * POST /api/notifications/:id/read
 * Mark a notification as read.
 */
export async function markAsRead(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ error: "Notification ID is required" });
      return;
    }

    readNotificationIds.add(id);

    await Log(
      "backend",
      "info",
      "controller",
      `Notification marked as read: ${id}`
    );

    res.json({ message: "Notification marked as read", id });
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : "Unknown error";
    await Log("backend", "error", "controller", `Failed to mark notification as read: ${errMsg}`);
    res.status(500).json({ error: "Failed to mark notification as read" });
  }
}

/**
 * POST /api/notifications/read-bulk
 * Mark multiple notifications as read.
 */
export async function markBulkAsRead(req: Request, res: Response): Promise<void> {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      res.status(400).json({ error: "ids must be a non-empty array" });
      return;
    }

    ids.forEach((id: string) => readNotificationIds.add(id));

    await Log(
      "backend",
      "info",
      "controller",
      `Bulk marked ${ids.length} notifications as read`
    );

    res.json({ message: `${ids.length} notifications marked as read` });
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : "Unknown error";
    await Log("backend", "error", "controller", `Failed to bulk mark as read: ${errMsg}`);
    res.status(500).json({ error: "Failed to mark notifications as read" });
  }
}
