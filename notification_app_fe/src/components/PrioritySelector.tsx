"use client";

/**
 * Priority Selector Component
 * Allows users to choose how many priority notifications to display.
 */

import { Box, Slider, Typography, Chip } from "@mui/material";
import { TrendingUp as TrendingIcon } from "@mui/icons-material";

interface PrioritySelectorProps {
  value: number;
  onChange: (value: number) => void;
}

const marks = [
  { value: 5, label: "5" },
  { value: 10, label: "10" },
  { value: 15, label: "15" },
  { value: 20, label: "20" },
];

export default function PrioritySelector({ value, onChange }: PrioritySelectorProps) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        p: 2,
        borderRadius: "0px", // Square borders
        background: "#FFF176",
        border: "2px solid #1A1A1A",
        boxShadow: "4px 4px 0px #1A1A1A",
      }}
    >
      <TrendingIcon sx={{ color: "#1A1A1A", fontSize: 24 }} />
      <Typography variant="body1" sx={{ color: "#1A1A1A", fontWeight: 800, minWidth: 60, textTransform: "uppercase" }}>
        Top
      </Typography>
      <Chip
        label={value}
        size="medium"
        sx={{
          backgroundColor: "#FFFFFF",
          color: "#1A1A1A",
          border: "2px solid #1A1A1A",
          boxShadow: "2px 2px 0px #1A1A1A",
          fontWeight: 800,
          fontSize: "1rem",
          minWidth: 40,
          borderRadius: "0px",
        }}
      />
      <Slider
        value={value}
        onChange={(_, newValue) => onChange(newValue as number)}
        min={5}
        max={20}
        step={5}
        marks={marks}
        sx={{
          flex: 1,
          color: "#1A1A1A",
          ml: 2,
          "& .MuiSlider-markLabel": {
            color: "#1A1A1A",
            fontSize: "0.8rem",
            fontWeight: 700,
          },
          "& .MuiSlider-thumb": {
            width: 24,
            height: 24,
            borderRadius: "0px",
            border: "2px solid #1A1A1A",
            backgroundColor: "#FF5A36",
            boxShadow: "2px 2px 0px #1A1A1A",
            "&:hover": {
              boxShadow: "3px 3px 0px #1A1A1A",
            },
            "&.Mui-active": {
              boxShadow: "0px 0px 0px #1A1A1A",
            },
          },
          "& .MuiSlider-track": {
            height: 8,
            border: "2px solid #1A1A1A",
            backgroundColor: "#1A1A1A",
          },
          "& .MuiSlider-rail": {
            height: 8,
            border: "2px solid #1A1A1A",
            backgroundColor: "#FFFFFF",
            opacity: 1,
          },
          "& .MuiSlider-mark": {
            width: 4,
            height: 8,
            backgroundColor: "#1A1A1A",
          },
        }}
      />
    </Box>
  );
}
