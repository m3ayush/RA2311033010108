"use client";

/**
 * Material UI Theme Provider
 * Wraps the app with a custom MUI theme featuring a dark mode
 * with vibrant accent colors.
 */

import { createTheme, ThemeProvider, CssBaseline } from "@mui/material";
import { ReactNode } from "react";

// Custom dark theme with vibrant accents
const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#7C4DFF", // Deep purple accent
      light: "#B388FF",
      dark: "#651FFF",
    },
    secondary: {
      main: "#00E5FF", // Cyan accent
      light: "#18FFFF",
      dark: "#00B8D4",
    },
    background: {
      default: "#0A0E1A",
      paper: "#121829",
    },
    error: {
      main: "#FF5252",
    },
    warning: {
      main: "#FFB74D",
    },
    success: {
      main: "#69F0AE",
    },
    text: {
      primary: "#E8EAED",
      secondary: "#9AA0A6",
    },
  },
  typography: {
    fontFamily: "'Inter', 'Roboto', sans-serif",
    h4: {
      fontWeight: 700,
      letterSpacing: "-0.02em",
    },
    h5: {
      fontWeight: 600,
      letterSpacing: "-0.01em",
    },
    h6: {
      fontWeight: 600,
    },
    body1: {
      fontSize: "0.95rem",
    },
    body2: {
      fontSize: "0.85rem",
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          border: "1px solid rgba(124, 77, 255, 0.12)",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            borderColor: "rgba(124, 77, 255, 0.3)",
            transform: "translateY(-2px)",
            boxShadow: "0 8px 32px rgba(124, 77, 255, 0.15)",
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          letterSpacing: "0.02em",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
          borderRadius: 8,
        },
      },
    },
  },
});

interface ThemeRegistryProps {
  children: ReactNode;
}

export default function ThemeRegistry({ children }: ThemeRegistryProps) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
