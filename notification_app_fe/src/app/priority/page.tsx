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
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Page Header */}
      <Box sx={{ mb: 4, pb: 2, borderBottom: "4px solid #1A1A1A" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: "0px", // Brutalist square
              background: "#FF5A36",
              border: "2px solid #1A1A1A",
              boxShadow: "4px 4px 0px #1A1A1A",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <PriorityIcon sx={{ fontSize: 28, color: "#1A1A1A" }} />
          </Box>
          <Typography variant="h4" sx={{ color: "#1A1A1A", textTransform: "uppercase" }}>
            Priority Inbox
          </Typography>
          <Chip
            icon={<TrendingIcon sx={{ fontSize: 16, color: "#1A1A1A !important" }} />}
            label={`TOP ${priorityN}`}
            size="medium"
            sx={{
              backgroundColor: "#D8B4E2",
              color: "#1A1A1A",
              fontWeight: 800,
              border: "2px solid #1A1A1A",
              boxShadow: "2px 2px 0px #1A1A1A",
              borderRadius: "0px",
            }}
          />
        </Box>
        <Typography variant="body1" sx={{ color: "#4A4A4A", fontWeight: 600 }}>
          Most important unread notifications ranked by priority
        </Typography>
      </Box>

      {/* Priority Selector */}
      <Box sx={{ mb: 3 }}>
        <PrioritySelector value={priorityN} onChange={setPriorityN} />
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
          {Array.from({ length: 5 }).map((_, i) => (
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
          <PriorityIcon sx={{ fontSize: 64, mb: 2, opacity: 0.8 }} />
          <Typography variant="h5" sx={{ fontWeight: 800, textTransform: "uppercase" }}>
            No priority notifications
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 600, mt: 1 }}>
            {filter
              ? `No unread ${filter} notifications to prioritize`
              : "All caught up! No unread notifications."}
          </Typography>
        </Box>
      )}

      {!loading && notifications.length > 0 && (
        <>
          {/* Results count */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="body1" sx={{ color: "#1A1A1A", fontWeight: 700, textTransform: "uppercase" }}>
              Showing {notifications.length} of top {priorityN}
              {filter ? ` (${filter} only)` : ""}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {notifications.map((notification, index) => (
              <Fade in timeout={300 + index * 75} key={notification.ID}>
                <Box sx={{ position: "relative" }}>
                  {/* Rank badge */}
                  <Box
                    sx={{
                      position: "absolute",
                      top: -12,
                      left: -12,
                      width: 32,
                      height: 32,
                      borderRadius: "0px", // Square brutalist badge
                      background:
                        index < 3
                          ? "#FFF176" // Yellow for top 3
                          : "#E0E0E0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      zIndex: 1,
                      border: "2px solid #1A1A1A",
                      boxShadow: "2px 2px 0px #1A1A1A",
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "1rem",
                        fontWeight: 800,
                        color: "#1A1A1A",
                      }}
                    >
                      #{index + 1}
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
