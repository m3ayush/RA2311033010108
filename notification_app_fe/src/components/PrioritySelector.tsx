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
        borderRadius: "12px",
        background: "rgba(124, 77, 255, 0.06)",
        border: "1px solid rgba(124, 77, 255, 0.12)",
      }}
    >
      <TrendingIcon sx={{ color: "#7C4DFF", fontSize: 20 }} />
      <Typography variant="body2" sx={{ color: "#E8EAED", fontWeight: 500, minWidth: 60 }}>
        Top
      </Typography>
      <Chip
        label={value}
        size="small"
        sx={{
          backgroundColor: "rgba(124, 77, 255, 0.2)",
          color: "#B388FF",
          fontWeight: 700,
          fontSize: "0.9rem",
          minWidth: 40,
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
          color: "#7C4DFF",
          "& .MuiSlider-markLabel": {
            color: "#6B7280",
            fontSize: "0.7rem",
          },
          "& .MuiSlider-thumb": {
            width: 18,
            height: 18,
            "&:hover": {
              boxShadow: "0 0 12px rgba(124, 77, 255, 0.4)",
            },
          },
          "& .MuiSlider-track": {
            background: "linear-gradient(90deg, #7C4DFF, #00E5FF)",
          },
        }}
      />
    </Box>
  );
}
