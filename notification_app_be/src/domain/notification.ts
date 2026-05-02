/**
 * Notification Domain Types
 * Defines the shape of notification data from the evaluation service.
 */

// Notification types with their priority weights
export enum NotificationType {
  Placement = "Placement",
  Result = "Result",
  Event = "Event",
}

// Weight mapping: Placement > Result > Event
export const TYPE_WEIGHTS: Record<NotificationType, number> = {
  [NotificationType.Placement]: 3,
  [NotificationType.Result]: 2,
  [NotificationType.Event]: 1,
};

// Raw notification from the API
export interface Notification {
  ID: string;
  Type: NotificationType;
  Message: string;
  Timestamp: string;
}

// Notification with computed priority score
export interface ScoredNotification extends Notification {
  priorityScore: number;
}

// API response shape
export interface NotificationResponse {
  notifications: Notification[];
}
