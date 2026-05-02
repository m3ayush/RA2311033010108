"use client";

/**
 * Notification Card Component
 * Displays a single notification with type badge, read status,
 * message, timestamp, and optional priority score.
 */

import {
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  Work as PlacementIcon,
  Assessment as ResultIcon,
  Event as EventIcon,
  MarkEmailRead as ReadIcon,
  FiberNew as UnreadIcon,
} from "@mui/icons-material";

interface NotificationCardProps {
  id: string;
  type: "Placement" | "Result" | "Event";
  message: string;
  timestamp: string;
  isRead: boolean;
  priorityScore?: number;
  onMarkRead?: (id: string) => void;
}

// Color and icon mapping for notification types
const typeConfig = {
  Placement: {
    color: "#7C4DFF",
    bgColor: "rgba(124, 77, 255, 0.12)",
    icon: <PlacementIcon sx={{ fontSize: 16 }} />,
    label: "Placement",
  },
  Result: {
    color: "#FFB74D",
    bgColor: "rgba(255, 183, 77, 0.12)",
    icon: <ResultIcon sx={{ fontSize: 16 }} />,
    label: "Result",
  },
  Event: {
    color: "#00E5FF",
    bgColor: "rgba(0, 229, 255, 0.12)",
    icon: <EventIcon sx={{ fontSize: 16 }} />,
    label: "Event",
  },
};

export default function NotificationCard({
  id,
  type,
  message,
  timestamp,
  isRead,
  priorityScore,
  onMarkRead,
}: NotificationCardProps) {
  const config = typeConfig[type] || typeConfig.Event;

  // Format timestamp for display
  const formatTime = (ts: string) => {
    const date = new Date(ts);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <Card
      sx={{
        opacity: isRead ? 0.65 : 1,
        borderLeft: `3px solid ${config.color}`,
        position: "relative",
        overflow: "visible",
        "&::before": !isRead
          ? {
              content: '""',
              position: "absolute",
              top: -1,
              left: -4,
              right: -1,
              bottom: -1,
              borderRadius: "12px",
              background: `linear-gradient(135deg, ${config.color}15, transparent)`,
              pointerEvents: "none",
            }
          : undefined,
      }}
    >
      <CardContent sx={{ py: 2, px: 2.5, "&:last-child": { pb: 2 } }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 1,
          }}
        >
          {/* Left section: Type chip + Message */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.75 }}>
              <Chip
                icon={config.icon}
                label={config.label}
                size="small"
                sx={{
                  backgroundColor: config.bgColor,
                  color: config.color,
                  border: `1px solid ${config.color}30`,
                  fontSize: "0.7rem",
                  height: 24,
                }}
              />
              {!isRead && (
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    backgroundColor: config.color,
                    boxShadow: `0 0 8px ${config.color}80`,
                    animation: "pulse 2s infinite",
                    "@keyframes pulse": {
                      "0%": { opacity: 1, transform: "scale(1)" },
                      "50%": { opacity: 0.6, transform: "scale(1.2)" },
                      "100%": { opacity: 1, transform: "scale(1)" },
                    },
                  }}
                />
              )}
              {priorityScore !== undefined && (
                <Typography
                  variant="caption"
                  sx={{
                    color: "#9AA0A6",
                    fontSize: "0.65rem",
                    ml: "auto",
                  }}
                >
                  Score: {priorityScore.toFixed(0)}
                </Typography>
              )}
            </Box>

            <Typography
              variant="body1"
              sx={{
                fontWeight: isRead ? 400 : 600,
                color: isRead ? "#9AA0A6" : "#E8EAED",
                textTransform: "capitalize",
                lineHeight: 1.4,
              }}
            >
              {message}
            </Typography>

            <Typography
              variant="caption"
              sx={{ color: "#6B7280", mt: 0.5, display: "block" }}
            >
              {formatTime(timestamp)}
            </Typography>
          </Box>

          {/* Right section: Read/Unread action */}
          {!isRead && onMarkRead && (
            <Tooltip title="Mark as read" arrow>
              <IconButton
                size="small"
                onClick={() => onMarkRead(id)}
                sx={{
                  color: config.color,
                  "&:hover": {
                    backgroundColor: config.bgColor,
                  },
                }}
              >
                <ReadIcon sx={{ fontSize: 20 }} />
              </IconButton>
            </Tooltip>
          )}
          {isRead && (
            <Tooltip title="Read" arrow>
              <ReadIcon
                sx={{ fontSize: 18, color: "#4B5563", mt: 0.5 }}
              />
            </Tooltip>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
