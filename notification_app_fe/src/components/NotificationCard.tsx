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
    color: "#D8B4E2", // Soft purple
    borderColor: "#1A1A1A",
    icon: <PlacementIcon sx={{ fontSize: 16, color: "#1A1A1A" }} />,
    label: "Placement",
  },
  Result: {
    color: "#FFF176", // Bright yellow
    borderColor: "#1A1A1A",
    icon: <ResultIcon sx={{ fontSize: 16, color: "#1A1A1A" }} />,
    label: "Result",
  },
  Event: {
    color: "#FF5A36", // Bright orange
    borderColor: "#1A1A1A",
    icon: <EventIcon sx={{ fontSize: 16, color: "#1A1A1A" }} />,
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
        backgroundColor: isRead ? "#F4F0E6" : "#FFFFFF",
        opacity: isRead ? 0.8 : 1,
        borderLeft: `8px solid ${config.color}`,
        position: "relative",
        overflow: "visible",
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
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <Chip
                icon={config.icon}
                label={config.label}
                size="small"
                sx={{
                  backgroundColor: config.color,
                  color: "#1A1A1A",
                  fontWeight: 800,
                  fontSize: "0.75rem",
                  height: 26,
                  border: "2px solid #1A1A1A",
                  boxShadow: "2px 2px 0px #1A1A1A",
                }}
              />
              {!isRead && (
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: "0px", // Brutalist square
                    backgroundColor: "#FF5252",
                    border: "2px solid #1A1A1A",
                    boxShadow: "2px 2px 0px #1A1A1A",
                  }}
                />
              )}
              {priorityScore !== undefined && (
                <Typography
                  variant="caption"
                  sx={{
                    color: "#1A1A1A",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    ml: "auto",
                    border: "1px dashed #1A1A1A",
                    px: 1,
                  }}
                >
                  Score: {priorityScore.toFixed(0)}
                </Typography>
              )}
            </Box>

            <Typography
              variant="body1"
              sx={{
                fontWeight: isRead ? 500 : 800,
                color: isRead ? "#4A4A4A" : "#1A1A1A",
                textTransform: "capitalize",
                lineHeight: 1.4,
                mt: 0.5,
              }}
            >
              {message}
            </Typography>

            <Typography
              variant="caption"
              sx={{ color: "#4A4A4A", mt: 0.5, display: "block", fontWeight: 600 }}
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
                  color: "#1A1A1A",
                  border: "2px solid #1A1A1A",
                  backgroundColor: "#69F0AE",
                  boxShadow: "2px 2px 0px #1A1A1A",
                  borderRadius: "0px", // Square button
                  "&:hover": {
                    backgroundColor: "#4ade80",
                    transform: "translate(-1px, -1px)",
                    boxShadow: "3px 3px 0px #1A1A1A",
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
                sx={{ fontSize: 24, color: "#1A1A1A", mt: 0.5, opacity: 0.5 }}
              />
            </Tooltip>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
