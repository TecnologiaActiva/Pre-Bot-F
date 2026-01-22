import { IconButton } from "@mui/material"
import DarkModeIcon from "@mui/icons-material/DarkMode"
import LightModeIcon from "@mui/icons-material/LightMode"
import { useThemeStore } from "@/store/themeStore"

export function ThemeToggle() {
  const { mode, toggle } = useThemeStore()

  return (
    <IconButton onClick={toggle} color="inherit">
      {mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
    </IconButton>
  )
}
