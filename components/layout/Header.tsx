"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Tooltip,
  useMediaQuery,
  useTheme,
  Chip,
} from "@mui/material"
import {
  Menu as MenuIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  CalendarToday as CalendarIcon,
  AccessTime as TimeIcon,
} from "@mui/icons-material"
import { ThemeToggle } from "@/components/ui/ThemeToggle"
import { useAuthStore } from "@/store/authStore"
import { logout as logoutApi } from "@/api/auth.api"

interface HeaderProps {
  onMenuClick?: () => void
}

export default function Header({ onMenuClick }: HeaderProps) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const router = useRouter()
  const clear = useAuthStore((s) => s.clear) // 👈 antes: logout
  const user = useAuthStore((s) => s.user)

  const [now, setNow] = useState(new Date())
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60_000)
    return () => clearInterval(interval)
  }, [])

  const fecha = now.toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })

  const hora = now.toLocaleTimeString("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
  })

  const initials =
    user?.email?.substring(0, 2).toUpperCase() ?? "US"

  const handleLogout = async () => {
    try {
      await logoutApi()
    } finally {
      setAnchorEl(null)        // 👈 cerrar menú
      clear()                  // 👈 limpiar store
      router.push("/auth/login")
    }
  }
  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: "background.paper",
        borderBottom: 1,
        borderColor: "divider",
        backdropFilter: "blur(8px)",
      }}
    >
      <Toolbar
        sx={{
          minHeight: { xs: 56, sm: 64 },
          px: { xs: 1.5, sm: 3 },
          gap: 1,
        }}
      >
        {/* Mobile menu */}
        {isMobile && onMenuClick && (
          <IconButton
            onClick={onMenuClick}
            aria-label="Abrir menú"
          >
            <MenuIcon />
          </IconButton>
        )}

        {/* Saludo */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            variant={isMobile ? "body1" : "h6"}
            fontWeight={600}
            noWrap
          >
            {isMobile ? "Hola" : "Bienvenido"}
            {!isMobile && user?.email && (
              <Box
                component="span"
                sx={{ color: "primary.main", ml: 1 }}
              >
                {user.nombre}
              </Box>
            )}
          </Typography>

          {!isMobile && (
            <Box sx={{ display: "flex", gap: 1.5 }}>
              <Box sx={{ display: "flex", gap: 0.5 }}>
                <CalendarIcon fontSize="inherit" />
                <Typography variant="caption">{fecha}</Typography>
              </Box>
              <Box sx={{ display: "flex", gap: 0.5 }}>
                <TimeIcon fontSize="inherit" />
                <Typography variant="caption">{hora}</Typography>
              </Box>
            </Box>
          )}
        </Box>

        {/* Hora mobile */}
        {isMobile && (
          <Chip
            size="small"
            icon={<TimeIcon />}
            label={hora}
          />
        )}

        {/* Acciones */}
        <Box sx={{ display: "flex", gap: 1 }}>
          <ThemeToggle />

          <Tooltip title="Cuenta">
            <IconButton
              onClick={(e) => setAnchorEl(e.currentTarget)}
            >
              <Avatar
                sx={{
                  bgcolor: "primary.main",
                  width: 34,
                  height: 34,
                  fontWeight: 600,
                }}
              >
                {initials}
              </Avatar>
            </IconButton>
          </Tooltip>

          {/* Menu usuario */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <Box sx={{ px: 2, py: 1 }}>
              <Typography fontWeight={600} noWrap>
                {user?.email?.split("@")[0]}
              </Typography>
              <Typography variant="caption" color="text.secondary" noWrap>
                {user?.email}
              </Typography>
            </Box>

            <Divider />

            <MenuItem onClick={() => router.push("/profile")}>
              <ListItemIcon>
                <PersonIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Perfil" />
            </MenuItem>

            <MenuItem onClick={() => router.push("/settings")}>
              <ListItemIcon>
                <SettingsIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Configuración" />
            </MenuItem>

            <Divider />

            <MenuItem
              onClick={handleLogout}
              sx={{ color: "error.main" }}
            >
              <ListItemIcon>
                <LogoutIcon fontSize="small" color="error" />
              </ListItemIcon>
              <ListItemText primary="Cerrar sesión" />
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  )
}
