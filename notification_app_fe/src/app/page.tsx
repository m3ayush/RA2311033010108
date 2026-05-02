"use client";

/**
 * All Notifications Page
 * Displays all campus notifications with type filtering,
 * read/unread status, and pagination support.
 */

import { useState, useEffect, useCallback } from "react";
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Pagination,
  Chip,
  Fade,
  Skeleton,
} from "@mui/material";
import {
  Notifications as NotificationsIcon,
  MarkEmailRead as MarkAllReadIcon,
} from "@mui/icons-material";
import NotificationCard from "@/components/NotificationCard";
import FilterBar from "@/components/FilterBar";
import {
  fetchAllNotifications,
  markNotificationRead,
  Notification,
} from "@/api/notifications";
import { useReadStatus } from "@/hooks/useReadStatus";

export default function AllNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const { markRead, isRead } = useReadStatus();

  const ITEMS_PER_PAGE = 20;

  // Fetch notifications from the backend
  const loadNotifications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await fetchAllNotifications(
        page,
        ITEMS_PER_PAGE,
        filter || undefined
      );

      setNotifications(data.notifications || []);
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Failed to load notifications";
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  }, [page, filter]);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  // Handle marking a notification as read
  const handleMarkRead = async (id: string) => {
    try {
      await markNotificationRead(id);
      markRead(id);
      // Update local state
      setNotifications((prev) =>
        prev.map((n) => (n.ID === id ? { ...n, isRead: true } : n))
      );
    } catch {
      // Silently fail — the UI will still show the correct read status
    }
  };

  // Count unread notifications
  const unreadCount = notifications.filter((n) => !isRead(n.ID)).length;

  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      {/* Page Header */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
          <NotificationsIcon sx={{ color: "#7C4DFF", fontSize: 28 }} />
          <Typography variant="h4" sx={{ color: "#E8EAED" }}>
            All Notifications
          </Typography>
          {unreadCount > 0 && (
            <Chip
              label={`${unreadCount} unread`}
              size="small"
              sx={{
                backgroundColor: "rgba(124, 77, 255, 0.15)",
                color: "#B388FF",
                fontWeight: 600,
                animation: "fadeIn 0.5s ease",
                "@keyframes fadeIn": {
                  from: { opacity: 0, transform: "scale(0.8)" },
                  to: { opacity: 1, transform: "scale(1)" },
                },
              }}
            />
          )}
        </Box>
        <Typography variant="body2" sx={{ color: "#9AA0A6" }}>
          Stay updated with all campus notifications
        </Typography>
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
          {[1, 2, 3, 4, 5].map((i) => (
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
          <NotificationsIcon sx={{ fontSize: 48, mb: 2, opacity: 0.3 }} />
          <Typography variant="h6">No notifications found</Typography>
          <Typography variant="body2">
            {filter ? `No ${filter} notifications available` : "Check back later for updates"}
          </Typography>
        </Box>
      )}

      {!loading && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          {notifications.map((notification, index) => (
            <Fade in timeout={300 + index * 50} key={notification.ID}>
              <Box>
                <NotificationCard
                  id={notification.ID}
                  type={notification.Type}
                  message={notification.Message}
                  timestamp={notification.Timestamp}
                  isRead={isRead(notification.ID)}
                  onMarkRead={handleMarkRead}
                />
              </Box>
            </Fade>
          ))}
        </Box>
      )}

      {/* Pagination */}
      {!loading && notifications.length > 0 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <Pagination
            count={5}
            page={page}
            onChange={(_, value) => setPage(value)}
            sx={{
              "& .MuiPaginationItem-root": {
                color: "#9AA0A6",
                borderColor: "rgba(124, 77, 255, 0.2)",
                "&.Mui-selected": {
                  backgroundColor: "rgba(124, 77, 255, 0.2)",
                  color: "#B388FF",
                },
              },
            }}
          />
        </Box>
      )}
    </Container>
  );
}
