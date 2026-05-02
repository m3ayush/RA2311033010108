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
        background: "#FFF176", // Brutalist yellow navbar
        borderBottom: "3px solid #1A1A1A",
        color: "#1A1A1A",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between", py: 1 }}>
        {/* Logo / Title */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: "0px", // Sharp corners
              background: "#1A1A1A",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "3px 3px 0px #FF5A36", // Offset orange shadow
            }}
          >
            <NotificationsIcon sx={{ fontSize: 24, color: "#FFF176" }} />
          </Box>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 800,
              color: "#1A1A1A",
              textTransform: "uppercase",
              letterSpacing: "-0.04em",
            }}
          >
            {isMobile ? "Notifs" : "Campus Notifications"}
          </Typography>
        </Box>

        {/* Navigation Items */}
        {isMobile ? (
          <>
            <IconButton
              onClick={() => setMobileOpen(!mobileOpen)}
              sx={{
                border: "2px solid #1A1A1A",
                borderRadius: "0px",
                background: "#FFFFFF",
                boxShadow: "2px 2px 0px #1A1A1A",
                "&:hover": { background: "#f0f0f0" },
              }}
            >
              <MenuIcon sx={{ color: "#1A1A1A" }} />
            </IconButton>
            {mobileOpen && (
              <Box
                sx={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  right: 0,
                  background: "#FDFBF7",
                  borderBottom: "3px solid #1A1A1A",
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                  gap: 1.5,
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
                      color: "#1A1A1A",
                      border: "2px solid #1A1A1A",
                      backgroundColor: pathname === item.path ? "#FF5A36" : "#FFFFFF",
                      boxShadow: "3px 3px 0px #1A1A1A",
                      borderRadius: "0px", // Brutalist sharp
                      py: 1,
                      "&:hover": {
                        backgroundColor: pathname === item.path ? "#FF5A36" : "#f0f0f0",
                        transform: "translate(-1px, -1px)",
                        boxShadow: "4px 4px 0px #1A1A1A",
                      },
                    }}
                  >
                    {item.label}
                  </Button>
                ))}
              </Box>
            )}
          </>
        ) : (
          <Box sx={{ display: "flex", gap: 2 }}>
            {navItems.map((item) => (
              <Button
                key={item.path}
                startIcon={item.icon}
                onClick={() => router.push(item.path)}
                sx={{
                  color: "#1A1A1A",
                  backgroundColor: pathname === item.path ? "#FFFFFF" : "transparent",
                  border: pathname === item.path ? "2px solid #1A1A1A" : "2px solid transparent",
                  boxShadow: pathname === item.path ? "3px 3px 0px #1A1A1A" : "none",
                  borderRadius: "8px",
                  px: 2.5,
                  py: 1,
                  fontWeight: 800,
                  transition: "all 0.2s ease",
                  "&:hover": {
                    backgroundColor: pathname === item.path ? "#FFFFFF" : "rgba(26, 26, 26, 0.05)",
                    border: "2px solid #1A1A1A",
                    boxShadow: "3px 3px 0px #1A1A1A",
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
