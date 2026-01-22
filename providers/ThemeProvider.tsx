"use client"

import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline"
import { darkTheme } from "@/theme/dark"
import { lightTheme } from "@/theme/light"
import { useThemeStore } from "@/store/themeStore"

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const mode = useThemeStore((s) => s.mode)

  const theme = mode === "dark" ? darkTheme : lightTheme

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  )
}
