"use client";

/**
 * Filter Bar Component
 * Provides notification type filtering with toggle chips.
 */

import { Box, Chip, Typography } from "@mui/material";
import {
  Work as PlacementIcon,
  Assessment as ResultIcon,
  Event as EventIcon,
  FilterList as FilterIcon,
} from "@mui/icons-material";

interface FilterBarProps {
  activeFilter: string | null;
  onFilterChange: (filter: string | null) => void;
}

const filters = [
  {
    value: null,
    label: "All",
    icon: <FilterIcon sx={{ fontSize: 16 }} />,
    color: "#E8EAED",
  },
  {
    value: "Placement",
    label: "Placement",
    icon: <PlacementIcon sx={{ fontSize: 16 }} />,
    color: "#7C4DFF",
  },
  {
    value: "Result",
    label: "Result",
    icon: <ResultIcon sx={{ fontSize: 16 }} />,
    color: "#FFB74D",
  },
  {
    value: "Event",
    label: "Event",
    icon: <EventIcon sx={{ fontSize: 16 }} />,
    color: "#00E5FF",
  },
];

export default function FilterBar({ activeFilter, onFilterChange }: FilterBarProps) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
      <Typography
        variant="body2"
        sx={{ color: "#9AA0A6", mr: 0.5, fontWeight: 500 }}
      >
        Filter:
      </Typography>
      {filters.map((filter) => {
        const isActive =
          filter.value === activeFilter ||
          (filter.value === null && activeFilter === null);

        return (
          <Chip
            key={filter.label}
            icon={filter.icon}
            label={filter.label}
            size="small"
            onClick={() => onFilterChange(filter.value)}
            sx={{
              backgroundColor: isActive
                ? `${filter.color}20`
                : "rgba(255, 255, 255, 0.05)",
              color: isActive ? filter.color : "#9AA0A6",
              border: `1px solid ${isActive ? `${filter.color}40` : "transparent"}`,
              cursor: "pointer",
              transition: "all 0.2s ease",
              "&:hover": {
                backgroundColor: `${filter.color}15`,
                color: filter.color,
              },
            }}
          />
        );
      })}
    </Box>
  );
}
