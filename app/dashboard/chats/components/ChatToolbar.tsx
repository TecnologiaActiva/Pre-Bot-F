"use client"

import { useRef } from "react"
import {
  Box,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  Tooltip,
  CircularProgress,
  Chip,
} from "@mui/material"
import {
  Search as SearchIcon,
  Close as CloseIcon,
  FilterList as FilterIcon,
  AddCircleOutline as AddIcon,
} from "@mui/icons-material"
import { SyncOutlookButton } from "./SyncOutlookButton"



interface Props {
  searchQuery: string
  onSearchChange: (query: string) => void
  onUploadFiles: (files: File[]) => void
  onSyncOutlook?: () => void
  isLoading: boolean
  totalChats: number
}

export default function ChatToolbar({
  searchQuery,
  onSearchChange,
  onUploadFiles,
  onSyncOutlook,
  isLoading,
  totalChats,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  return (
    <Box
      sx={{
        p: 2,
        display: "flex",
        gap: 2,
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-between",
        bgcolor: "background.paper",
        borderBottom: 1,
        borderColor: "divider",
      }}
    >
      <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
        <input
          ref={fileInputRef}
          type="file"
          hidden
          accept=".zip,.rar"
          multiple                                // ✅
          onChange={(e) => {
            const files = Array.from(e.target.files || [])
            if (files.length) {
              onUploadFiles(files)                // ✅
              e.currentTarget.value = ""
            }
          }}
        />


        <SyncOutlookButton
          onDone={onSyncOutlook}
          sx={{}}
        />

        <Button
          variant="contained"
          startIcon={isLoading ? <CircularProgress size={18} color="inherit" /> : <AddIcon />}
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading}
          sx={{ textTransform: "none", fontWeight: 600, borderRadius: 2, px: 2.5 }}
        >
          {isLoading ? "Procesando..." : "Cargar chats"}
        </Button>

        <Chip
          label={`${totalChats} chats`}
          size="small"
          variant="outlined"
          sx={{ fontWeight: 500 }}
        />
      </Box>
{/* 
      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
        <Tooltip title="Filtros">
          <IconButton
            sx={{
              border: 1,
              borderColor: "divider",
              borderRadius: 2,
              "&:hover": { bgcolor: "action.hover" },
            }}
          >
            <FilterIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box> */}


{/* 
      <Button
        variant="contained"
        startIcon={
          isLoading ? <CircularProgress size={18} color="inherit" /> : <AddIcon />
        }
        onClick={() => fileInputRef.current?.click()}
        disabled={isLoading}
        sx={{ textTransform: "none", fontWeight: 600, borderRadius: 2, px: 2.5 }}
      >
        {isLoading ? "Procesando..." : "Cargar chats"}
      </Button> */}



      {/* <Chip label={`${totalChats} chats`} size="small" variant="outlined" sx={{ fontWeight: 500 }} /> */}


      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
        {/* <TextField
          size="small"
          placeholder="Buscar mensaje o contacto..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          sx={{
            minWidth: { xs: "100%", sm: 300 },
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              bgcolor: "background.default",
              "&:hover": { bgcolor: "action.hover" },
              "&.Mui-focused": { bgcolor: "background.paper" },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "text.secondary", fontSize: 20 }} />
              </InputAdornment>
            ),
            endAdornment:
              searchQuery && (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => onSearchChange("")}>
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
          }}
        /> */}

        {/* <Tooltip title="Filtros">
          <IconButton
            sx={{
              border: 1,
              borderColor: "divider",
              borderRadius: 2,
              "&:hover": { bgcolor: "action.hover" },
            }}
          >
            <FilterIcon fontSize="small" />
          </IconButton>
        </Tooltip> */}
      </Box>
    </Box>
  )
}