// path: src/app/chats/components/ChatList.tsx
"use client"

import { useMemo, useState } from "react"
import { Box, List, Typography, Skeleton, TextField, InputAdornment } from "@mui/material"
import type { Chat } from "../hooks/useChats"
import ChatListItem from "./ChatListItem"
import { InboxOutlined as EmptyIcon, Search as SearchIcon } from "@mui/icons-material"

interface Props {
  chats: Chat[]
  selectedChatId: number | null
  onSelect: (id: number) => void
  isLoading?: boolean
}

export default function ChatList({ chats, selectedChatId, onSelect, isLoading }: Props) {
  const [q, setQ] = useState("")

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase()
    if (!query) return chats

    const isValid = (v?: string) =>
      v && v.trim() !== "" && v.toLowerCase() !== "desconocido"

    return chats.filter((c) => {
      const name = (c.name || "").toLowerCase()

      const t1 = isValid(c.telefono1) ? c.telefono1.toLowerCase() : ""
      const t2 = isValid(c.telefono2) ? c.telefono2.toLowerCase() : ""

      return (
        name.includes(query) ||
        t1.includes(query) ||
        t2.includes(query)
      )
    })
  }, [chats, q])

  return (
    <Box
      sx={{
        borderRight: { md: 1 },
        borderColor: "divider",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.paper",
        height: "85vh",
        width: "50vh",
        minHeight: 0,
      }}
    >
      {/* Header */}
      <Box sx={{ px: 2, py: 1.5, borderBottom: 1, borderColor: "divider", flexShrink: 0 }}>
        <Typography variant="subtitle2" color="text.secondary">
          Conversaciones
        </Typography>
      </Box>

      {/* ✅ Buscador (debajo del header) */}
      <Box sx={{ px: 2, py: 1.25, borderBottom: 1, borderColor: "divider", flexShrink: 0 }}>
        <TextField
          size="small"
          fullWidth
          placeholder="Buscar por nombre o número..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* List */}
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
        }}
      >
        {isLoading ? (
          <Box sx={{ p: 2 }}>
            {[1, 2, 3, 4].map((i) => (
              <Box key={i} sx={{ display: "flex", gap: 1.5, mb: 2 }}>
                <Skeleton variant="circular" width={48} height={48} />
                <Box sx={{ flex: 1 }}>
                  <Skeleton width="60%" height={20} />
                  <Skeleton width="80%" height={16} />
                </Box>
              </Box>
            ))}
          </Box>
        ) : filtered.length === 0 ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              py: 6,
              px: 2,
              color: "text.secondary",
            }}
          >
            <EmptyIcon sx={{ fontSize: 48, mb: 1, opacity: 0.5 }} />
            <Typography variant="body2">No se encontraron chats</Typography>
          </Box>
        ) : (
          <List disablePadding>
            {filtered.map((chat) => (
              <ChatListItem
                key={chat.id}
                chat={chat}
                selected={chat.id === selectedChatId}
                onSelect={() => onSelect(chat.id)}
              />
            ))}
          </List>
        )}
      </Box>
    </Box>
  )
}
