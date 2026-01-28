"use client"

import { useEffect, useMemo, useState } from "react"
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline"
import { darkTheme } from "@/theme/dark"
import { lightTheme } from "@/theme/light"
import { useThemeStore } from "@/store/themeStore"

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const mode = useThemeStore((s) => s.mode)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setHydrated(true)
  }, [])

  const theme = useMemo(() => {
    // hasta hidratar: theme fijo para que SSR/CSR coincidan
    const safeMode = hydrated ? mode : "light"
    return safeMode === "dark" ? darkTheme : lightTheme
  }, [mode, hydrated])

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  )
}
