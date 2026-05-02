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
    mode: "light",
    primary: {
      main: "#1A1A1A", // Solid black for primary interactions
      light: "#333333",
      dark: "#000000",
    },
    secondary: {
      main: "#FF5A36", // Vibrant brutalist orange
      light: "#FF8A65",
      dark: "#E64A19",
    },
    background: {
      default: "#FDFBF7", // Cream background
      paper: "#FFFFFF", // White cards
    },
    error: {
      main: "#FF5252",
    },
    warning: {
      main: "#FFF176", // Brutalist yellow
    },
    success: {
      main: "#69F0AE",
    },
    info: {
      main: "#D8B4E2", // Soft purple accent
    },
    text: {
      primary: "#1A1A1A",
      secondary: "#4A4A4A",
    },
  },
  typography: {
    fontFamily: "'Inter', 'Space Grotesk', 'Roboto', sans-serif",
    h4: {
      fontWeight: 800,
      letterSpacing: "-0.04em",
      color: "#1A1A1A",
    },
    h5: {
      fontWeight: 700,
      letterSpacing: "-0.02em",
    },
    h6: {
      fontWeight: 700,
    },
    body1: {
      fontSize: "1rem",
      fontWeight: 500,
    },
    body2: {
      fontSize: "0.9rem",
      fontWeight: 500,
    },
    button: {
      fontWeight: 700,
      letterSpacing: "0.02em",
      textTransform: "uppercase",
    },
  },
  shape: {
    borderRadius: 8, // Slightly sharp borders for brutalism
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          border: "2px solid #1A1A1A",
          boxShadow: "4px 4px 0px #1A1A1A",
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            transform: "translate(-2px, -2px)",
            boxShadow: "6px 6px 0px #1A1A1A",
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 700,
          border: "2px solid #1A1A1A",
          boxShadow: "2px 2px 0px #1A1A1A",
          borderRadius: "9999px",
          transition: "all 0.2s ease",
          "&:hover": {
            transform: "translate(-1px, -1px)",
            boxShadow: "3px 3px 0px #1A1A1A",
          },
        },
        clickable: {
          "&:active": {
            boxShadow: "0px 0px 0px #1A1A1A",
            transform: "translate(2px, 2px)",
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          border: "2px solid #1A1A1A",
          boxShadow: "3px 3px 0px #1A1A1A",
          borderRadius: 8,
          transition: "all 0.2s ease",
          "&:hover": {
            transform: "translate(-1px, -1px)",
            boxShadow: "4px 4px 0px #1A1A1A",
          },
          "&:active": {
            boxShadow: "0px 0px 0px #1A1A1A",
            transform: "translate(3px, 3px)",
          },
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
