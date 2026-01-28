"use client"
import { useRef } from "react"
import { Button } from "@mui/material"
import type { SxProps, Theme } from "@mui/material/styles"
import { Upload as UploadIcon } from "@mui/icons-material"
import { useSyncOutlook } from "../hooks/useSyncOutlook"

export function SyncOutlookButton({
  onDone,
  sx,
}: {
  onDone?: () => void
  sx?: SxProps<Theme>
}) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const { run, isSyncing } = useSyncOutlook()

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept=".csv,.xlsx,.xls"
        hidden
        onChange={async (e) => {
          const file = e.target.files?.[0]
          if (!file) return
          await run(file)
          onDone?.()
          e.target.value = ""
        }}
      />

      <Button
        variant="contained"
        startIcon={<UploadIcon />}
        onClick={() => inputRef.current?.click()}
        disabled={isSyncing}
        sx={{
          textTransform: "none",
          fontWeight: 600,
          borderRadius: 2,
          px: 2.5,
          ...sx,
        }}
      >
        {isSyncing ? "Sincronizando..." : "Sinc Contac Outlook"}
      </Button>
    </>
  )
}
