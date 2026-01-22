import api from "@/lib/api";

export async function getChatsDashboard() {
  const res = await api.get("/metrics/chats/dashboard")
  return res.data
}

export async function getChatsTimeseries(days: number) {
  const res = await api.get("/metrics/chats/timeseries", { params: { days } })
  return res.data
}

export async function getChatsByCategoria(params: {
  categoria: "interesado" | "potencial_venta" | "perdido" | "cliente" | "no_cliente"
  q?: string
  limit?: number
  offset?: number
}) {
  const res = await api.get("/metrics/chats/list", { params })
  return res.data
}