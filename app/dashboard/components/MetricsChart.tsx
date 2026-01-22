"use client"

import { useMemo } from "react"
import { Box, Paper, Typography, useTheme, Chip, Stack } from "@mui/material"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts"

type MetricsChartProps = {
  range: string
  pipeline: Array<{
    date: string
    clientes: number
    interesado: number
    potencial_venta: number
    perdido: number
  }>
}

const metrics = [
  { key: "clientes", label: "Clientes", color: "#22c55e" },
  { key: "interesado", label: "Interesados", color: "#3b82f6" },
  { key: "potencial_venta", label: "Potencial venta", color: "#eab308" },
  { key: "perdido", label: "Perdidos", color: "#ef4444" },
] as const

type TooltipProps = {
  active?: boolean
  payload?: any[]
  label?: string
}

function CustomTooltip({ active, payload, label }: TooltipProps) {
  const theme = useTheme()
  if (!active || !payload?.length) return null

  return (
    <Paper
      elevation={8}
      sx={{
        p: 2,
        borderRadius: 2,
        bgcolor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
        minWidth: 180,
      }}
    >
      <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
        {label}
      </Typography>

      {payload.map((entry: any) => {
        const key = entry.dataKey as string
        const meta = metrics.find((m) => m.key === key)
        return (
          <Box
            key={key}
            sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2, py: 0.5 }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: entry.color ?? meta?.color }} />
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                {meta?.label ?? key}
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {entry.value}
            </Typography>
          </Box>
        )
      })}
    </Paper>
  )
}

export default function MetricsChart({ range, pipeline }: MetricsChartProps) {
  const theme = useTheme()
  const isDark = theme.palette.mode === "dark"

  const chartData = useMemo(() => {
    const formatDay = (date: string) =>
      new Date(date).toLocaleDateString("es-AR", { weekday: "short" })

    return (pipeline ?? []).map((item) => ({
      date: formatDay(item.date),
      clientes: item.clientes ?? 0,
      interesado: item.interesado ?? 0,
      potencial_venta: item.potencial_venta ?? 0,
      perdido: item.perdido ?? 0,
    }))
  }, [pipeline])

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 3,
        bgcolor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "flex-start", sm: "center" },
          justifyContent: "space-between",
          mb: 3,
          gap: 2,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Evolución ({range})
        </Typography>

        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          {metrics.map((m) => (
            <Chip
              key={m.key}
              label={m.label}
              size="small"
              sx={{
                bgcolor: `${m.color}20`,
                color: m.color,
                fontWeight: 500,
                fontSize: "0.75rem",
                "& .MuiChip-label": { px: 1.5 },
              }}
              icon={
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    bgcolor: m.color,
                    ml: 1,
                  }}
                />
              }
            />
          ))}
        </Stack>
      </Box>

      <Box sx={{ height: 320, width: "100%" }}>
        <ResponsiveContainer>
          <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#374151" : "#e5e7eb"} vertical={false} />
            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: theme.palette.text.secondary, fontSize: 12 }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: theme.palette.text.secondary, fontSize: 12 }} dx={-10} />
            <Tooltip content={<CustomTooltip />} />
            {metrics.map((m) => (
              <Line
                key={m.key}
                type="monotone"
                dataKey={m.key}
                stroke={m.color}
                strokeWidth={2.5}
                dot={{ fill: m.color, strokeWidth: 0, r: 4 }}
                activeDot={{ r: 6, strokeWidth: 2, stroke: isDark ? "#1f2937" : "#fff" }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  )
}
