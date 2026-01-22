"use client"

import { Box } from "@mui/material"
import ChatList from "./components/ChatList"
import ChatMessages from "./components/ChatMessages"
import ChatToolbar from "./components/ChatToolbar"
import { useChats } from "./hooks/useChats"
import { useSearchParams } from "next/navigation"
import { useEffect } from "react"

export default function ChatsPage() {
  const searchParams = useSearchParams()
  const chatIdParam = searchParams.get("chatId")
  const {
    chats,
    selectedChat,
    selectedChatId,
    selectChat,
    clearSelection,
    messages,
    searchQuery,
    setSearchQuery,
    isLoading,
    uploadNewChat,
    uploadManyChats
  } = useChats()

useEffect(() => {
  if (!chatIdParam) return
  const id = Number(chatIdParam)
  if (!Number.isFinite(id)) return
  if (selectedChatId === id) return
  selectChat(id)
}, [chatIdParam, selectedChatId, selectChat])


  return (
    <Box data-page="chats" sx={{ display: "flex", flexDirection: "column" }}>
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          bgcolor: "background.default",
        }}
      >
        <ChatToolbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onUploadFiles={uploadManyChats}
          // onUploadFile={uploadNewChat}
          isLoading={isLoading}
          totalChats={chats.length}
        />

        <Box sx={{
          flex: 1,
          display: "flex",
          overflow: "hidden", 
        }}>
          <Box
            sx={{
              display: { xs: selectedChatId ? "none" : "flex", md: "flex" },
              //  width: { xs: "100%", md: 320 },
              borderRight: { md: 1 },
              borderColor: "divider",     // ✅
              overflow: "hidden",  
            }}
          >
            <ChatList
              chats={chats}
              selectedChatId={selectedChatId}
              onSelect={selectChat}
              isLoading={isLoading}
            />
          </Box>

          <Box
            sx={{ flex: 1,  overflow: "hidden", display: "flex" }}
          >
            <ChatMessages messages={messages} selectedChat={selectedChat} onBack={clearSelection} />
          </Box>
        </Box>
      </Box>
    </Box>
  )
}