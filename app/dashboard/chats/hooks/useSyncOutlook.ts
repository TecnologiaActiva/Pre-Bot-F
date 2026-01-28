"use client"
import { useState } from "react"
import { syncOutlook } from "@/api/chats.api"

export function useSyncOutlook() {
  const [isSyncing, setIsSyncing] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const run = async (file: File) => {
    setIsSyncing(true)
    setError(null)
    try {
      const data = await syncOutlook(file)
      setResult(data)
      return data
    } catch (e: any) {
      setError(e?.message ?? "Error sincronizando Outlook")
      throw e
    } finally {
      setIsSyncing(false)
    }
  }

  return { run, isSyncing, result, error }
}
