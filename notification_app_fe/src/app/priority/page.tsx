"use client";

/**
 * Priority Notifications Page
 * Displays the top N most important unread notifications,
 * ranked by type weight and recency.
 * Users can configure N and filter by notification type.
 */

import { useState, useEffect, useCallback } from "react";
import {
  Container,
  Typography,
  Box,
  Alert,
  Fade,
  Skeleton,
  Chip,
} from "@mui/material";
import {
  PriorityHigh as PriorityIcon,
  TrendingUp as TrendingIcon,
} from "@mui/icons-material";
import NotificationCard from "@/components/NotificationCard";
import FilterBar from "@/components/FilterBar";
import PrioritySelector from "@/components/PrioritySelector";
import {
  fetchPriorityNotifications,
  markNotificationRead,
  Notification,
} from "@/api/notifications";
import { useReadStatus } from "@/hooks/useReadStatus";

export default function PriorityNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string | null>(null);
  const [priorityN, setPriorityN] = useState(10);
  const { markRead, isRead } = useReadStatus();

  // Fetch priority notifications from the backend
  const loadPriorityNotifications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await fetchPriorityNotifications(
        priorityN,
        filter || undefined
      );

      setNotifications(data.notifications || []);
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Failed to load priority notifications";
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  }, [priorityN, filter]);

  useEffect(() => {
    loadPriorityNotifications();
  }, [loadPriorityNotifications]);

  // Handle marking a notification as read
  const handleMarkRead = async (id: string) => {
    try {
      await markNotificationRead(id);
      markRead(id);
      // Remove from priority list (since it's now read)
      setNotifications((prev) => prev.filter((n) => n.ID !== id));
    } catch {
      // Silently fail
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      {/* Page Header */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: "10px",
              background: "linear-gradient(135deg, #7C4DFF, #FF5252)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <PriorityIcon sx={{ fontSize: 20, color: "#fff" }} />
          </Box>
          <Typography variant="h4" sx={{ color: "#E8EAED" }}>
            Priority Inbox
          </Typography>
          <Chip
            icon={<TrendingIcon sx={{ fontSize: 14 }} />}
            label={`Top ${priorityN}`}
            size="small"
            sx={{
              backgroundColor: "rgba(124, 77, 255, 0.15)",
              color: "#B388FF",
              fontWeight: 600,
            }}
          />
        </Box>
        <Typography variant="body2" sx={{ color: "#9AA0A6" }}>
          Most important unread notifications ranked by priority
        </Typography>

        {/* Priority explanation */}
        <Box
          sx={{
            mt: 1.5,
            p: 1.5,
            borderRadius: "8px",
            background: "rgba(0, 229, 255, 0.04)",
            border: "1px solid rgba(0, 229, 255, 0.1)",
          }}
        >
          <Typography variant="caption" sx={{ color: "#6B7280" }}>
            📊 Priority scoring: <strong style={{ color: "#7C4DFF" }}>Placement (3x)</strong> &gt;{" "}
            <strong style={{ color: "#FFB74D" }}>Result (2x)</strong> &gt;{" "}
            <strong style={{ color: "#00E5FF" }}>Event (1x)</strong> × recency bonus
          </Typography>
        </Box>
      </Box>

      {/* Priority Selector */}
      <Box sx={{ mb: 2.5 }}>
        <PrioritySelector value={priorityN} onChange={setPriorityN} />
      </Box>

      {/* Filter Bar */}
      <Box sx={{ mb: 2.5 }}>
        <FilterBar activeFilter={filter} onFilterChange={setFilter} />
      </Box>

      {/* Error State */}
      {error && (
        <Alert
          severity="error"
          sx={{
            mb: 2,
            backgroundColor: "rgba(255, 82, 82, 0.1)",
            border: "1px solid rgba(255, 82, 82, 0.3)",
          }}
        >
          {error}
        </Alert>
      )}

      {/* Loading State */}
      {loading && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton
              key={i}
              variant="rounded"
              height={80}
              sx={{
                bgcolor: "rgba(124, 77, 255, 0.06)",
                borderRadius: "12px",
              }}
            />
          ))}
        </Box>
      )}

      {/* Notifications List */}
      {!loading && notifications.length === 0 && (
        <Box
          sx={{
            textAlign: "center",
            py: 8,
            color: "#9AA0A6",
          }}
        >
          <PriorityIcon sx={{ fontSize: 48, mb: 2, opacity: 0.3 }} />
          <Typography variant="h6">No priority notifications</Typography>
          <Typography variant="body2">
            {filter
              ? `No unread ${filter} notifications to prioritize`
              : "All caught up! No unread notifications."}
          </Typography>
        </Box>
      )}

      {!loading && notifications.length > 0 && (
        <>
          {/* Results count */}
          <Box sx={{ mb: 1.5 }}>
            <Typography variant="body2" sx={{ color: "#6B7280" }}>
              Showing {notifications.length} of top {priorityN} priority notifications
              {filter ? ` (${filter} only)` : ""}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            {notifications.map((notification, index) => (
              <Fade in timeout={300 + index * 75} key={notification.ID}>
                <Box sx={{ position: "relative" }}>
                  {/* Rank badge */}
                  <Box
                    sx={{
                      position: "absolute",
                      top: -8,
                      left: -8,
                      width: 24,
                      height: 24,
                      borderRadius: "50%",
                      background:
                        index < 3
                          ? "linear-gradient(135deg, #7C4DFF, #FF5252)"
                          : "rgba(107, 114, 128, 0.3)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      zIndex: 1,
                      border: "2px solid #121829",
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "0.65rem",
                        fontWeight: 700,
                        color: "#fff",
                      }}
                    >
                      {index + 1}
                    </Typography>
                  </Box>
                  <NotificationCard
                    id={notification.ID}
                    type={notification.Type}
                    message={notification.Message}
                    timestamp={notification.Timestamp}
                    isRead={isRead(notification.ID)}
                    priorityScore={notification.priorityScore}
                    onMarkRead={handleMarkRead}
                  />
                </Box>
              </Fade>
            ))}
          </Box>
        </>
      )}
    </Container>
  );
}
