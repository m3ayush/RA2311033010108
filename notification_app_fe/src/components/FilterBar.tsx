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
    color: "#1A1A1A",
  },
  {
    value: "Placement",
    label: "Placement",
    icon: <PlacementIcon sx={{ fontSize: 16 }} />,
    color: "#D8B4E2",
  },
  {
    value: "Result",
    label: "Result",
    icon: <ResultIcon sx={{ fontSize: 16 }} />,
    color: "#FFF176",
  },
  {
    value: "Event",
    label: "Event",
    icon: <EventIcon sx={{ fontSize: 16 }} />,
    color: "#FF5A36",
  },
];

export default function FilterBar({ activeFilter, onFilterChange }: FilterBarProps) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
      <Typography
        variant="body1"
        sx={{ color: "#1A1A1A", mr: 0.5, fontWeight: 700 }}
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
            size="medium"
            onClick={() => onFilterChange(filter.value)}
            sx={{
              backgroundColor: isActive ? filter.color : "#FFFFFF",
              color: isActive && filter.value === null ? "#FFFFFF" : "#1A1A1A",
              border: "2px solid #1A1A1A",
              boxShadow: isActive ? "0px 0px 0px #1A1A1A" : "2px 2px 0px #1A1A1A",
              transform: isActive ? "translate(2px, 2px)" : "none",
              fontWeight: 800,
              cursor: "pointer",
              transition: "all 0.1s ease",
              "& .MuiChip-icon": {
                color: isActive && filter.value === null ? "#FFFFFF" : "#1A1A1A",
              },
              "&:hover": {
                backgroundColor: isActive ? filter.color : "#F4F0E6",
              },
            }}
          />
        );
      })}
    </Box>
  );
}
