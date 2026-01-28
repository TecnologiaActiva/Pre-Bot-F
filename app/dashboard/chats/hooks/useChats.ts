// path: src/app/chats/hooks/useChats.ts
"use client"

import { useEffect, useState } from "react"
import { getChats, uploadChats, getChatFull, getChatFiles } from "@/api/chats.api"

export type Chat = {
  id: number
  name: string
  phone: string

  // opcionales para UI
  avatar?: string
  online?: boolean
  lastMessage?: string
  unreadCount?: number
  timestamp?: Date
}

export type ArchivoAdjunto = {
  id: number
  mensaje_id: number
  tipo: "image" | "audio" | "video" | "file" | string
  filename: string
  path: string
  mime_type: string | null
  size: number
}

export type Message = {
  id: number
  from_me: boolean
  autor_raw?: string | null
  text: string
  timestamp: Date
  status?: "sent" | "delivered" | "read"
  archivos?: ArchivoAdjunto[]
}

function guessFromAutor(autor: string): "user" | "other" {
  const a = (autor || "").trim().toLowerCase()
  if (!a) return "other"
  if (["yo", "tú", "tu", "me", "you"].includes(a)) return "user"
  return "other"
}

function parseFechaCarga(fecha: string | undefined): Date | undefined {
  // API: "dd/mm/YYYY" (sin hora)
  if (!fecha) return undefined
  const m = fecha.match(/^(\d{2})\/(\d{2})\/(\d{4})$/)
  if (!m) return undefined
  const dd = Number(m[1])
  const mm = Number(m[2])
  const yyyy = Number(m[3])
  const d = new Date(yyyy, mm - 1, dd, 12, 0, 0) // mediodía para evitar TZ edge
  return Number.isNaN(d.getTime()) ? undefined : d
}

export function useChats() {
  const [chats, setChats] = useState<Chat[]>([])
  const [selectedChatId, setSelectedChatId] = useState<number | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<{ total: number; done: number; current?: string }>({
    total: 0,
    done: 0,
  })

  const [searchQuery, setSearchQuery] = useState("")

  const selectedChat = chats.find((c) => c.id === selectedChatId) || null

  const loadChats = async () => {
    setIsLoading(true)
    try {
      const data = await getChats();
      console.log("DATTATTATA", data);
      // API: [{ id, nombre, numero, fecha_carga }]
      const mapped: Chat[] = (data || []).map((c: any) => ({
        id: c.id,
        name: c.nombre ?? "Sin nombre",
        telefono1: c.telefono ?? "desconocido",
        telefono2: c.telefono2 ?? "desconocido",
        online: false,
        avatar: undefined,
        unreadCount: 0,
        lastMessage: "",
        timestamp: c.fecha_carga ? new Date(c.fecha_carga) : undefined,
      }))
      setChats(mapped)
    } finally {
      setIsLoading(false)
    }
  }

  const uploadNewChat = async (file: File) => {
    const name = file.name.toLowerCase()
    if (!name.endsWith(".zip") && !name.endsWith(".rar")) {
      throw new Error("Formato no soportado. Subí .zip o .rar")
    }

    setIsLoading(true)
    try {
      await uploadChats(file)
      await loadChats()
    } finally {
      setIsLoading(false)
    }
  }

  const uploadManyChats = async (files: File[]) => {
    const only = files.filter((f) => {
      const n = f.name.toLowerCase()
      return n.endsWith(".zip") || n.endsWith(".rar")
    })

    setUploadProgress({ total: only.length, done: 0, current: "" })
    setIsLoading(true)

    try {
      // ✅ recomendado: secuencial (evita saturar el back)
      for (let i = 0; i < only.length; i++) {
        const f = only[i]
        setUploadProgress((p) => ({ ...p, current: f.name }))

        await uploadChats(f) // tu API actual
        setUploadProgress((p) => ({ ...p, done: p.done + 1 }))
      }

      await loadChats()
    } finally {
      setIsLoading(false)
      setUploadProgress((p) => ({ ...p, current: "" }))
    }
  }


  // Función que se ejecuta al seleccionar un chat de la lista.
  const selectChat = async (chatId: number) => {
    setSelectedChatId(chatId)
    setIsLoading(true)
    try {
      const [full, files] = await Promise.all([getChatFull(chatId), getChatFiles(chatId)])

      const filesByMsg = new Map<number, ArchivoAdjunto[]>()
      for (const f of files || []) {
        const arr = filesByMsg.get(f.mensaje_id) || []
        arr.push(f)
        filesByMsg.set(f.mensaje_id, arr)
      }

      const msgs: Message[] = (full?.mensajes || []).map((m: any) => {
        const date =
          m.created_at ? new Date(m.created_at) :
            m.fecha ? new Date(m.fecha) :
              new Date()

        return {
          id: m.id,
          from_me: Boolean(m.from_me),      // ✅ viene del back
          autor_raw: m.autor_raw ?? m.autor ?? null, // ✅ raw si existe
          text: m.texto ?? "",
          timestamp: date,
          archivos: filesByMsg.get(m.id) || [],
        }
      })

      setMessages(msgs)

      // Opcional: actualiza preview del chat seleccionado (último mensaje / timestamp)
      const last = msgs[msgs.length - 1]      
      if (last) {
        setChats((prev) =>
          prev.map((c) =>
            c.id === chatId
              ? {
                ...c,
                lastMessage: last.text || (last.archivos?.length ? "📎 Archivo adjunto" : ""),
                timestamp: last.timestamp,
              }
              : c,
          ),
        )
      }
    } finally {
      setIsLoading(false)
    }
  }

  const clearSelection = () => {
    setSelectedChatId(null)
    setMessages([])
  }

  useEffect(() => {
    loadChats()
  }, [])

  return {
    chats,
    selectedChatId,
    selectedChat,
    messages,
    searchQuery,
    setSearchQuery,
    isLoading,
    loadChats,
    uploadNewChat,
    selectChat,
    clearSelection,
    uploadManyChats,
    uploadProgress,
    reloadChats: loadChats
  }
}
