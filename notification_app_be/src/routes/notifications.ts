/**
 * Notification Routes
 * Defines all API routes for notification endpoints.
 */

import { Router } from "express";
import {
  getAllNotifications,
  getPriorityNotifications,
  markAsRead,
  markBulkAsRead,
} from "../controllers/notificationController";
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

const router = Router();

// Log route registration
Log("backend", "info", "route", "Registering notification routes");

// GET /api/notifications — All notifications (paginated, filterable)
router.get("/", getAllNotifications);

// GET /api/notifications/priority — Top N priority notifications
router.get("/priority", getPriorityNotifications);

// POST /api/notifications/:id/read — Mark single notification as read
router.post("/:id/read", markAsRead);

// POST /api/notifications/read-bulk — Mark multiple as read
router.post("/read-bulk", markBulkAsRead);

export default router;
