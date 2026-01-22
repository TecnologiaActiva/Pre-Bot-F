// src/app/dashboard/hooks/useDashboard.ts
"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { getChatsDashboard, getChatsTimeseries } from "@/api/Dashboard.api"

export type DashboardGeneral = {
  total_chats: number
  clientes: number
  no_clientes: number
  potencial_venta: number
  interesado: number
  perdido: number
  sin_pipeline?: number
}

export type DashboardResponse = {
  general: DashboardGeneral
  pipeline: { estado: string; cantidad: number }[]
  score: { categoria: string; cantidad: number }[]
}

// ✅ lo que te devuelve /metrics/chats/timeseries
export type TimeseriesPoint = {
  date: string
  clientes: number
  interesado: number
  potencial_venta: number
  perdido: number
}

export function useDashboard(range: "7d" | "30d" | "90d" = "7d") {
  const [dashboardMetrics, setDashboardMetrics] = useState<DashboardResponse | null>(null)
  const [pipelineSeries, setPipelineSeries] = useState<TimeseriesPoint[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const days = useMemo(() => (range === "7d" ? 7 : range === "30d" ? 30 : 90), [range])

  const getMetricasDashboard = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      // ✅ pedir ambos en paralelo
      const [dash, series] = await Promise.all([
        getChatsDashboard(),
        getChatsTimeseries(days),
      ])

      setDashboardMetrics(dash)
      setPipelineSeries(series ?? [])
    } catch (e: any) {
      setError(e?.message ?? "Error cargando métricas")
    } finally {
      setIsLoading(false)
    }
  }, [days])

  useEffect(() => {
    getMetricasDashboard()
  }, [getMetricasDashboard])

  return { dashboardMetrics, pipelineSeries, isLoading, error, reload: getMetricasDashboard }
}
