"use client";

/**
 * Navigation Bar Component
 * Provides navigation between All Notifications and Priority Notifications pages.
 * Features a sleek glassmorphic design with active tab highlighting.
 */

import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  useMediaQuery,
  useTheme,
  IconButton,
} from "@mui/material";
import {
  Notifications as NotificationsIcon,
  PriorityHigh as PriorityIcon,
  Menu as MenuIcon,
} from "@mui/icons-material";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { label: "All Notifications", path: "/", icon: <NotificationsIcon /> },
    { label: "Priority Inbox", path: "/priority", icon: <PriorityIcon /> },
  ];

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        background: "rgba(18, 24, 41, 0.85)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(124, 77, 255, 0.15)",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {/* Logo / Title */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: "10px",
              background: "linear-gradient(135deg, #7C4DFF, #00E5FF)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <NotificationsIcon sx={{ fontSize: 20, color: "#fff" }} />
          </Box>
          <Typography
            variant="h6"
            sx={{
              background: "linear-gradient(90deg, #B388FF, #00E5FF)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontWeight: 700,
            }}
          >
            {isMobile ? "Notifs" : "Campus Notifications"}
          </Typography>
        </Box>

        {/* Navigation Items */}
        {isMobile ? (
          <>
            <IconButton
              color="inherit"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              <MenuIcon />
            </IconButton>
            {mobileOpen && (
              <Box
                sx={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  right: 0,
                  background: "rgba(18, 24, 41, 0.95)",
                  backdropFilter: "blur(20px)",
                  borderBottom: "1px solid rgba(124, 77, 255, 0.15)",
                  p: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: 0.5,
                  zIndex: 1000,
                }}
              >
                {navItems.map((item) => (
                  <Button
                    key={item.path}
                    startIcon={item.icon}
                    onClick={() => {
                      router.push(item.path);
                      setMobileOpen(false);
                    }}
                    sx={{
                      justifyContent: "flex-start",
                      color: pathname === item.path ? "#7C4DFF" : "#9AA0A6",
                      backgroundColor:
                        pathname === item.path
                          ? "rgba(124, 77, 255, 0.1)"
                          : "transparent",
                    }}
                  >
                    {item.label}
                  </Button>
                ))}
              </Box>
            )}
          </>
        ) : (
          <Box sx={{ display: "flex", gap: 1 }}>
            {navItems.map((item) => (
              <Button
                key={item.path}
                startIcon={item.icon}
                onClick={() => router.push(item.path)}
                sx={{
                  color: pathname === item.path ? "#E8EAED" : "#9AA0A6",
                  backgroundColor:
                    pathname === item.path
                      ? "rgba(124, 77, 255, 0.15)"
                      : "transparent",
                  borderRadius: "8px",
                  px: 2,
                  transition: "all 0.2s ease",
                  "&:hover": {
                    backgroundColor: "rgba(124, 77, 255, 0.1)",
                    color: "#E8EAED",
                  },
                }}
              >
                {item.label}
              </Button>
            ))}
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}
