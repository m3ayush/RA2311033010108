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
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Page Header */}
      <Box sx={{ mb: 4, pb: 2, borderBottom: "4px solid #1A1A1A" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
          <NotificationsIcon sx={{ color: "#1A1A1A", fontSize: 36 }} />
          <Typography variant="h4" sx={{ color: "#1A1A1A", textTransform: "uppercase" }}>
            All Notifications
          </Typography>
          {unreadCount > 0 && (
            <Chip
              label={`${unreadCount} UNREAD`}
              size="small"
              sx={{
                backgroundColor: "#FF5A36",
                color: "#1A1A1A",
                fontWeight: 800,
                border: "2px solid #1A1A1A",
                boxShadow: "2px 2px 0px #1A1A1A",
                borderRadius: "0px",
                animation: "fadeIn 0.5s ease",
                "@keyframes fadeIn": {
                  from: { opacity: 0, transform: "scale(0.8)" },
                  to: { opacity: 1, transform: "scale(1)" },
                },
              }}
            />
          )}
        </Box>
        <Typography variant="body1" sx={{ color: "#4A4A4A", fontWeight: 600 }}>
          Stay updated with all campus notifications
        </Typography>
      </Box>

      {/* Filter Bar */}
      <Box sx={{ mb: 3 }}>
        <FilterBar activeFilter={filter} onFilterChange={setFilter} />
      </Box>

      {/* Error State */}
      {error && (
        <Alert
          severity="error"
          sx={{
            mb: 3,
            backgroundColor: "#FF5252",
            color: "#1A1A1A",
            border: "2px solid #1A1A1A",
            boxShadow: "4px 4px 0px #1A1A1A",
            borderRadius: "0px",
            fontWeight: 700,
            "& .MuiAlert-icon": { color: "#1A1A1A" },
          }}
        >
          {error}
        </Alert>
      )}

      {/* Loading State */}
      {loading && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton
              key={i}
              variant="rectangular"
              height={100}
              sx={{
                bgcolor: "#E0E0E0",
                borderRadius: "0px",
                border: "2px solid #1A1A1A",
                boxShadow: "4px 4px 0px #1A1A1A",
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
            py: 10,
            color: "#1A1A1A",
            border: "2px dashed #1A1A1A",
            backgroundColor: "#FFFFFF",
            boxShadow: "4px 4px 0px #1A1A1A",
          }}
        >
          <NotificationsIcon sx={{ fontSize: 64, mb: 2, opacity: 0.8 }} />
          <Typography variant="h5" sx={{ fontWeight: 800, textTransform: "uppercase" }}>
            No notifications found
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 600, mt: 1 }}>
            {filter ? `No ${filter} notifications available` : "Check back later for updates"}
          </Typography>
        </Box>
      )}

      {!loading && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
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
        <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
          <Pagination
            count={5}
            page={page}
            onChange={(_, value) => setPage(value)}
            shape="rounded"
            size="large"
            sx={{
              "& .MuiPaginationItem-root": {
                color: "#1A1A1A",
                border: "2px solid #1A1A1A",
                backgroundColor: "#FFFFFF",
                fontWeight: 800,
                borderRadius: "0px", // Brutalist squares
                boxShadow: "2px 2px 0px #1A1A1A",
                mx: 0.5,
                "&:hover": {
                  backgroundColor: "#F4F0E6",
                  transform: "translate(-1px, -1px)",
                  boxShadow: "3px 3px 0px #1A1A1A",
                },
                "&.Mui-selected": {
                  backgroundColor: "#D8B4E2", // Soft purple for active page
                  color: "#1A1A1A",
                  "&:hover": {
                    backgroundColor: "#C9A0D3",
                  },
                },
              },
            }}
          />
        </Box>
      )}
    </Container>
  );
}
