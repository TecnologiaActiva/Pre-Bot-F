"use client"

import { useCallback, useEffect, useState } from "react"
import { getChatsByCategoria } from "@/api/Dashboard.api"

export type ChatItem = {
  id: number
  nombre: string
  numero: string
  score_actual: number
  creado_en?: string | null
  pipeline?: string | null
  contacto_estado: number
}

export function useChatsCategoria(categoria: string | null) {
  const [items, setItems] = useState<ChatItem[]>([])
  const [total, setTotal] = useState(0)
  const [q, setQ] = useState("")
  const [isLoadingCat, setIsLoadingCat] = useState(false)

  const load = useCallback(async () => {
    if (!categoria) return
    setIsLoadingCat(true)
    try {
      const data = await getChatsByCategoria({ categoria: categoria as any, q, limit: 50, offset: 0 })
      setItems(data.items ?? [])
      setTotal(data.total ?? 0)
    } finally {
      setIsLoadingCat(false)
    }
  }, [categoria, q])

  useEffect(() => {
    load()
  }, [load])

  return { items, total, q, setQ, isLoadingCat, reload: load }
}
