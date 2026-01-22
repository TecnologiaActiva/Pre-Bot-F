// path: src/app/chats/components/ChatListItem.tsx
"use client"

import { Box, Typography, Avatar, Badge, ListItemButton } from "@mui/material"
import type { Chat } from "../hooks/useChats"

interface Props {
  chat: Chat
  selected: boolean
  onSelect: () => void
}

function formatTime(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffHours = diffMs / (1000 * 60 * 60)
  const diffDays = diffMs / (1000 * 60 * 60 * 24)

  if (diffHours < 24) {
    return date.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })
  } else if (diffDays < 7) {
    return date.toLocaleDateString("es-AR", { weekday: "short" })
  } else {
    return date.toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit" })
  }
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

export default function ChatListItem({ chat, selected, onSelect }: Props) {
  const unreadCount = chat.unreadCount ?? 0
  const lastMessage = chat.lastMessage?.trim() || chat.phone || ""
  const ts = chat.timestamp

  return (
    <ListItemButton
      selected={selected}
      onClick={onSelect}
      sx={{
        px: 2,
        py: 1.5,
        gap: 1,
        borderLeft: 1,
        width: '100%' ,
        borderColor: selected ? "primary.main" : "transparent",
        bgcolor: selected ? "action.selected" : "transparent",
        transition: "all 0.15s ease",
        "&:hover": { bgcolor: selected ? "action.selected" : "action.hover" },
      }}
    >
      <Badge
        overlap="circular"
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        variant="dot"
        invisible={!chat.online}
        sx={{
          "& .MuiBadge-badge": {
            bgcolor: "success.main",
            boxShadow: (theme) => `0 0 0 2px ${theme.palette.background.paper}`,
          },
        }}
      >
        <Avatar
          src={chat.avatar}
          sx={{
            width: 48,
            height: 48,
            bgcolor: "primary.main",
            fontSize: 16,
            fontWeight: 600,
          }}
        >
          {getInitials(chat.name)}
        </Avatar>
      </Badge>

      <Box sx={{ flex: 1 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.25, maxWidth: '40vh' }}>
          <Typography
            variant="subtitle2"
            fontWeight={unreadCount > 0 ? 700 : 600}
            noWrap
            sx={{ color: "text.primary"}}
          >
            {chat.name}
          </Typography>

          {ts && (
            <Typography
              variant="caption"
              sx={{
                color: unreadCount > 0 ? "primary.main" : "text.secondary",
                fontWeight: unreadCount > 0 ? 300 : 400,
                flexShrink: 0,
                ml: 1,
              }}
            >
              {formatTime(ts)}
            </Typography>
          )}
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography
            variant="body2"
            noWrap
            sx={{
              color: unreadCount > 0 ? "text.primary" : "text.secondary",
              fontWeight: unreadCount > 0 ? 500 : 400,
              flex: 1,
             maxWidth: '30vh'
            }}
          >
            {lastMessage}
          </Typography>

          {unreadCount > 0 && (
            <Box
              sx={{
                ml: 1,
                minWidth: 20,
                height: 20,
                borderRadius: "10px",
                bgcolor: "primary.main",
                color: "primary.contrastText",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 11,
                fontWeight: 700,
                px: 0.75,
              }}
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </Box>
          )}
        </Box>
      </Box>
    </ListItemButton>
  )
}
