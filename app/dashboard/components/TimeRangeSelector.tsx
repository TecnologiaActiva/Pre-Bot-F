"use client"

import type React from "react"

import { ToggleButton, ToggleButtonGroup, useTheme } from "@mui/material"

const ranges = [
  { value: "7d", label: "7 días" },
  { value: "mes", label: "Mes" },
  { value: "trimestre", label: "Trimestre" },
  { value: "año", label: "Año" },
] as const

type Props = {
  value: string
  onChange: (v: string) => void
}

export default function TimeRangeSelector({ value, onChange }: Props) {
  const theme = useTheme()

  const handleChange = (_: React.MouseEvent<HTMLElement>, newValue: string | null) => {
    if (newValue !== null) {
      onChange(newValue)
    }
  }

  return (
    <ToggleButtonGroup
      value={value}
      exclusive
      onChange={handleChange}
      size="small"
      sx={{
        bgcolor: "background.paper",
        borderRadius: 2,
        border: "1px solid",
        borderColor: "divider",
        "& .MuiToggleButtonGroup-grouped": {
          border: 0,
          borderRadius: "8px !important",
          mx: 0.5,
          my: 0.5,
          px: 2,
          py: 0.75,
          textTransform: "none",
          fontWeight: 500,
          fontSize: "0.875rem",
          color: "text.secondary",
          transition: "all 0.2s ease",
          "&:hover": {
            bgcolor: theme.palette.mode === "dark" ? "grey.800" : "grey.100",
          },
          "&.Mui-selected": {
            bgcolor: "primary.main",
            color: "primary.contrastText",
            "&:hover": {
              bgcolor: "primary.dark",
            },
          },
        },
      }}
    >
      {ranges.map((r) => (
        <ToggleButton key={r.value} value={r.value} disableRipple>
          {r.label}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  )
}
