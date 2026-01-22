// path: src/app/dashboard/page.tsx
"use client"

import { useMemo, useState } from "react"
import {
  Box,
  Typography,
  useTheme,
  useMediaQuery,
  Skeleton,
  Paper,
  Drawer,
  TextField,
  List,
  ListItemButton,
  ListItemText,
} from "@mui/material"

import {
  Chat as ChatIcon,
  People as PeopleIcon,
  ThumbUp as ThumbUpIcon,
  HelpOutline as HelpIcon,
  ThumbDown as ThumbDownIcon,
} from "@mui/icons-material"

import KpiCard from "./components/KpiCard"
import TimeRangeSelector from "./components/TimeRangeSelector"
import MetricsChart from "./components/MetricsChart"
import { useRouter } from "next/navigation"


import { useDashboard } from "@/hooks/useDashboard"
import { useChatsCategoria } from "./hooks/useChatsCategoria"

type Range = "7d" | "30d" | "90d"

export default function DashboardPage() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  const [range, setRange] = useState<Range>("7d")
  const [open, setOpen] = useState(false)
  const [categoria, setCategoria] = useState<string | null>(null)

  const { dashboardMetrics, pipelineSeries, isLoading, error } = useDashboard(range)
  const { items, total, q, setQ, isLoading: isLoadingCat } = useChatsCategoria(categoria)
  const router = useRouter()

  const g = dashboardMetrics?.general

  const openList = (cat: string) => {
    setCategoria(cat)
    setOpen(true)
  }

  const kpiData = useMemo(
    () => [
      {
        title: "Total chats",
        value: g?.total_chats ?? 0,
        icon: <ChatIcon />,
        variant: "default" as const,
      },
      {
        title: "Clientes",
        value: g?.clientes ?? 0,
        icon: <PeopleIcon />,
        variant: "success" as const,
      },
      {
        title: "Interesados",
        value: g?.interesado ?? 0,
        icon: <ThumbUpIcon />,
        variant: "info" as const,
      },
      {
        title: "Potencial venta",
        value: g?.potencial_venta ?? 0,
        icon: <HelpIcon />,
        variant: "warning" as const,
      },
      {
        title: "Perdidos",
        value: g?.perdido ?? 0,
        icon: <ThumbDownIcon />,
        variant: "error" as const,
      },
    ],
    [g],
  )

  return (
    <Box sx={{ width: "100%" }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: { xs: "flex-start", md: "center" },
          justifyContent: "space-between",
          gap: 2,
          mb: 4,
        }}
      >
        <Box>
          <Typography variant={isMobile ? "h5" : "h4"} fontWeight={700} color="text.primary">
            Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Resumen general de actividad
          </Typography>
          {!!error && (
            <Typography variant="caption" color="error">
              {error}
            </Typography>
          )}
        </Box>

        <TimeRangeSelector value={range} onChange={setRange} />
      </Box>

      {/* KPIs */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
            lg: "repeat(5, 1fr)",
          },
          gap: 2.5,
          mb: 4,
        }}
      >
        {isLoading && !dashboardMetrics
          ? Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} variant="rounded" height={110} sx={{ borderRadius: 3 }} />
          ))
          : kpiData.map((kpi) => {
            const clickable =
              kpi.title === "Interesados" || kpi.title === "Potencial venta" || kpi.title === "Perdidos"

            const cat =
              kpi.title === "Interesados"
                ? "interesado"
                : kpi.title === "Potencial venta"
                  ? "potencial_venta"
                  : kpi.title === "Perdidos"
                    ? "perdido"
                    : null

            return (
              <Box
                key={kpi.title}
                onClick={clickable && cat ? () => openList(cat) : undefined}
                sx={{ cursor: clickable ? "pointer" : "default" }}
              >
                <KpiCard title={kpi.title} value={kpi.value} icon={kpi.icon} variant={kpi.variant} />
              </Box>
            )
          })}
      </Box>

      {/* Drawer detalle */}
      <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
        <Box sx={{ width: 420, p: 2, display: "flex", flexDirection: "column", gap: 2, height: "100%" }}>
          <Typography fontWeight={700}>
            {categoria} ({total})
          </Typography>

          <TextField
            size="small"
            placeholder="Buscar por nombre o número..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />

          <Box sx={{ flex: 1, overflowY: "auto" }}>
            <List disablePadding>
              {items.map((c) => (
                <ListItemButton
                  key={c.id}
                  onClick={() => {
                    setOpen(false) // cerrar drawer
                    router.push(`dashboard/chats?chatId=${c.id}`)
                  }}
                >
                  <ListItemText
                    primary={`${c.nombre} (${c.numero})`}
                    secondary={`Score: ${c.score_actual} • ${c.pipeline ?? "-"}`}
                  />
                </ListItemButton>
              ))}
            </List>

            {isLoadingCat && <Typography variant="caption">Cargando...</Typography>}
            {!isLoadingCat && items.length === 0 && <Typography variant="body2">Sin resultados</Typography>}
          </Box>
        </Box>
      </Drawer>

      {/* Chart */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 3 },
          borderRadius: 3,
          border: 1,
          borderColor: "divider",
          minHeight: isMobile ? 280 : 420,
        }}
      >
        <Box mb={2}>
          <Typography fontWeight={600} color="text.primary">
            Distribución
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Pipeline y score
          </Typography>
        </Box>

        {isLoading && !dashboardMetrics ? (
          <Skeleton variant="rounded" height={isMobile ? 200 : 320} sx={{ borderRadius: 2 }} />
        ) : (
          <MetricsChart range={range} pipeline={pipelineSeries ?? []} />
        )}
      </Paper>
    </Box>
  )
}
