"use client"

import type React from "react"

import { Box, Paper, Typography, useTheme } from "@mui/material"
import { TrendingUp as TrendingUpIcon, TrendingDown as TrendingDownIcon } from "@mui/icons-material"

type Props = {
  title: string
  value: number
  trend?: number // porcentaje de cambio
  icon?: React.ReactNode
  variant?: "default" | "success" | "info" | "warning" | "error"
}

const variantColors = {
  default: { light: "grey.100", dark: "grey.800" },
  success: { light: "#dcfce7", dark: "#166534" },
  info: { light: "#dbeafe", dark: "#1e40af" },
  warning: { light: "#fef3c7", dark: "#92400e" },
  error: { light: "#fee2e2", dark: "#991b1b" },
}

export default function KpiCard({ title, value, trend, icon, variant = "default" }: Props) {
  const theme = useTheme()
  const isDark = theme.palette.mode === "dark"

  const bgColor = isDark ? variantColors[variant].dark : variantColors[variant].light

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 3,
        bgcolor: bgColor,
        border: "1px solid",
        borderColor: "divider",
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: theme.shadows[4],
        },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <Box>
          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
              fontWeight: 500,
              mb: 0.5,
              textTransform: "uppercase",
              fontSize: "0.75rem",
              letterSpacing: "0.5px",
            }}
          >
            {title}
          </Typography>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: "text.primary",
              lineHeight: 1.2,
            }}
          >
            {value.toLocaleString()}
          </Typography>
          {trend !== undefined && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                mt: 1,
              }}
            >
              {trend >= 0 ? (
                <TrendingUpIcon sx={{ fontSize: 16, color: "success.main" }} />
              ) : (
                <TrendingDownIcon sx={{ fontSize: 16, color: "error.main" }} />
              )}
              <Typography
                variant="caption"
                sx={{
                  color: trend >= 0 ? "success.main" : "error.main",
                  fontWeight: 600,
                }}
              >
                {trend >= 0 ? "+" : ""}
                {trend}%
              </Typography>
              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                vs anterior
              </Typography>
            </Box>
          )}
        </Box>
        {icon && (
          <Box
            sx={{
              p: 1,
              borderRadius: 2,
              bgcolor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {icon}
          </Box>
        )}
      </Box>
    </Paper>
  )
}
