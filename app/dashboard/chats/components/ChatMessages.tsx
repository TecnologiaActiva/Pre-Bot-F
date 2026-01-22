// path: src/app/chats/components/ChatMessages.tsx
"use client"

import { useEffect, useMemo, useState } from "react"
import { Box, Typography, Paper, Avatar, IconButton, Tooltip, Link, CircularProgress } from "@mui/material"
import {
  DoneAll as DeliveredIcon,
  Done as SentIcon,
  ArrowBack as BackIcon,
  MoreVert as MoreIcon,
  Phone as PhoneIcon,
  AttachFile as AttachIcon,
} from "@mui/icons-material"
import type { Message, Chat, ArchivoAdjunto } from "../hooks/useChats"
import { createObjectUrl, revokeObjectUrl, downloadArchivoBlob, downloadBlob } from "@/api/chats.api"

interface Props {
  messages: Message[]
  selectedChat: Chat | null
  onBack?: () => void
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

function humanSize(bytes: number): string {
  const units = ["B", "KB", "MB", "GB"]
  let i = 0
  let v = bytes
  while (v >= 1024 && i < units.length - 1) {
    v /= 1024
    i += 1
  }
  return `${v.toFixed(i === 0 ? 0 : 1)} ${units[i]}`
}

function isImage(mime: string | null, tipo?: string) {
  return (mime || "").toLowerCase().startsWith("image/") || tipo === "image"
}
function isAudio(mime: string | null, tipo?: string) {
  return (mime || "").toLowerCase().startsWith("audio/") || tipo === "audio"
}
function isVideo(mime: string | null, tipo?: string) {
  return (mime || "").toLowerCase().startsWith("video/") || tipo === "video"
}

function AttachmentBlock({ a }: { a: ArchivoAdjunto }) {
  const [blobUrl, setBlobUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const kind = useMemo(() => {
    if (isImage(a.mime_type, a.tipo)) return "image"
    if (isAudio(a.mime_type, a.tipo)) return "audio"
    if (isVideo(a.mime_type, a.tipo)) return "video"
    return "file"
  }, [a.mime_type, a.tipo])

  useEffect(() => {
    let cancelled = false
    let currentUrl: string | null = null

    async function load() {
      if (kind === "file") return
      setLoading(true)
      try {
        const blob = await downloadArchivoBlob(a.id) // axios manda Bearer
        if (cancelled) return
        currentUrl = createObjectUrl(blob)
        setBlobUrl(currentUrl)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()

    return () => {
      cancelled = true
      if (currentUrl) revokeObjectUrl(currentUrl)
    }
  }, [a.id, kind])

  const onDownload = async () => {
    const blob = await downloadArchivoBlob(a.id)
    downloadBlob(blob, a.filename)
  }

  return (
    <Box sx={{ mt: 1, display: "flex", flexDirection: "column", gap: 1 }}>
      {loading && kind !== "file" && (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <CircularProgress size={16} />
          <Typography variant="caption" color="text.secondary">
            Cargando adjunto...
          </Typography>
        </Box>
      )}

      {kind === "image" && blobUrl && (
        <Box
          component="img"
          src={blobUrl}
          alt={a.filename}
          sx={{ width: "100%", borderRadius: 2, border: 1, borderColor: "divider" }}
        />
      )}

      {kind === "audio" && blobUrl && <audio controls src={blobUrl} style={{ width: "100%" }} />}

      {kind === "video" && blobUrl && <video controls src={blobUrl} style={{ width: "100%", borderRadius: 12 }} />}

      {kind === "file" && (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <AttachIcon fontSize="small" />
          <Link component="button" underline="hover" onClick={onDownload} sx={{ textAlign: "left" }}>
            {a.filename}
          </Link>
          <Typography variant="caption" color="text.secondary">
            {humanSize(a.size)}
          </Typography>
        </Box>
      )}

      {(kind === "image" || kind === "audio" || kind === "video") && (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Link component="button" underline="hover" onClick={onDownload} sx={{ textAlign: "left" }}>
            Descargar {a.filename}
          </Link>
          <Typography variant="caption" color="text.secondary">
            {humanSize(a.size)}
          </Typography>
        </Box>
      )}
    </Box>
  )
}

export default function ChatMessages({ messages, selectedChat, onBack }: Props) {
  if (!selectedChat) {
    return (
      <Box
        sx={{
          flex: 1,
          display: { xs: "none", md: "flex" },
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "background.default",
          color: "text.secondary",
        }}
      >
        <Typography variant="h6" fontWeight={600} color="text.primary" mb={0.5}>
          Selecciona un chat
        </Typography>
        <Typography variant="body2">Elige una conversación para ver los mensajes</Typography>
      </Box>
    )
  }

  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.default",
        overflow: "hidden",
        height: "85vh"
      }}
    >
      {/* Header */}
      <Box
        sx={{
          px: 2,
          py: 1.5,
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          bgcolor: "background.paper",
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <IconButton onClick={onBack} sx={{ display: { xs: "flex", md: "none" }, mr: 0.5 }}>
          <BackIcon />
        </IconButton>

        <Avatar sx={{ width: 40, height: 40, bgcolor: "primary.main", fontSize: 14, fontWeight: 600 }}>
          {getInitials(selectedChat.name)}
        </Avatar>

        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle1" fontWeight={600}>
            {selectedChat.name}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {selectedChat.online ? "En línea" : selectedChat.phone}
          </Typography>
        </Box>
        {/* 
        <Tooltip title="Llamar">
          <IconButton>
            <PhoneIcon fontSize="small" />
          </IconButton>
        </Tooltip> */}
        <Tooltip title="Más opciones">
          <IconButton>
            <MoreIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Messages */}
      <Box
        sx={{
          flex: 1,
          maxWidth: '100%',
          maxHeight: '100%',       // ✅ clave
          overflowY: "auto",  // ✅ scroll acá
          p: 2,
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        {messages.map((msg, index) => {
          const isUser = msg.from_me
          const showAvatar =
            !isUser && (index === 0 || messages[index - 1]?.from_me !== msg.from_me)

          return (
            <Box key={msg.id} sx={{ display: "flex", justifyContent: isUser ? "flex-end" : "flex-start", gap: 1 }}>
              {!isUser && (
                <Avatar
                  sx={{
                    width: 28,
                    height: 28,
                    bgcolor: "primary.main",
                    fontSize: 11,
                    visibility: showAvatar ? "visible" : "hidden",
                  }}
                >
                  {getInitials(selectedChat.name)}
                </Avatar>
              )}

              <Box sx={{ maxWidth: "50%" }}>
                {!isUser && msg.autor_raw && (
                  <Typography variant="caption" sx={{ display: "block", opacity: 0.8, mb: 0.5 }}>
                    {msg.autor_raw}
                  </Typography>
                )}

                <Paper
                  elevation={0}
                  sx={{
                    px: 1.5,
                    py: 1,
                    borderRadius: 2,
                    borderTopLeftRadius: !isUser ? 4 : 16,
                    borderTopRightRadius: isUser ? 4 : 16,
                    bgcolor: isUser ? "primary.main" : "background.paper",
                    color: isUser ? "primary.contrastText" : "text.primary",
                    border: isUser ? "none" : 1,
                    borderColor: "divider",
                  }}
                >
                  {msg.text && (
                    <Typography variant="body2" sx={{ wordBreak: "break-word" }}>
                      {msg.text}
                    </Typography>
                  )}

                  {!!msg.archivos?.length && (
                    <Box sx={{ mt: msg.text ? 1 : 0 }}>
                      {msg.archivos.map((a) => (
                        <AttachmentBlock key={a.id} a={a} />
                      ))}
                    </Box>
                  )}
                </Paper>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: isUser ? "flex-end" : "flex-start",
                    gap: 0.5,
                    mt: 0.25,
                    px: 0.5,
                  }}
                >
                  <Typography variant="caption" sx={{ fontSize: 10, color: "text.secondary" }}>
                    {formatTime(msg.timestamp)}
                  </Typography>
                  {isUser && msg.status && (
                    <>
                      {msg.status === "read" ? (
                        <DeliveredIcon sx={{ fontSize: 14, color: "primary.main" }} />
                      ) : msg.status === "delivered" ? (
                        <DeliveredIcon sx={{ fontSize: 14, color: "text.secondary" }} />
                      ) : (
                        <SentIcon sx={{ fontSize: 14, color: "text.secondary" }} />
                      )}
                    </>
                  )}
                </Box>
              </Box>
            </Box>
          )
        })}
      </Box>
    </Box>
  )
}
