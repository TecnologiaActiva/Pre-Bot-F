import api from "@/lib/api"

export async function uploadChats(file: File) {
  const formData = new FormData()
  formData.append("file", file)

  const res = await api.post("/procesar", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  })

  return res.data
}

export async function getChats() {
  const res = await api.get("/chats")
  return res.data
}

export async function getChatFull(chatId: number) {
  const res = await api.get(`/chats/${chatId}/full`)
  return res.data
}

/**
 * Nuevo: lista de adjuntos por chat.
 * Backend sugerido: GET /chats/{chat_id}/archivos
 */
export async function getChatFiles(chatId: number) {
  const res = await api.get(`/chats/${chatId}/archivos`)
  return res.data as Array<{
    id: number
    mensaje_id: number
    tipo: string
    filename: string
    path: string
    mime_type: string | null
    size: number
  }>
}

/**
 * Nuevo: URL de descarga (si tu router unificado expone /chats/archivos/{archivo_id})
 * OJO: esto depende de cómo tengas configurado api.baseURL.
 */
export function buildFileDownloadUrl(archivoId: number) {
  const baseURL = (api.defaults.baseURL || "").replace(/\/$/, "")
  return `${baseURL}/chats/archivos/${archivoId}`
}

export async function downloadArchivoBlob(archivoId: number): Promise<Blob> {
  const res = await api.get(`/chats/archivos/${archivoId}`, {
    responseType: "blob",
  })
  return res.data as Blob
}

export function createObjectUrl(blob: Blob): string {
  return URL.createObjectURL(blob)
}

export function revokeObjectUrl(url?: string | null) {
  if (url) URL.revokeObjectURL(url)
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename || "archivo"
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}