"use client"

import { use, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Typography,
  Avatar,
  Divider,
  Tooltip,
  useMediaQuery,
  useTheme,
  Fade,
  Menu,
  MenuItem,
} from "@mui/material"
import {
  DashboardOutlined,
  ChatBubbleOutline,
  BarChartOutlined,
  PeopleOutline,
  Menu as MenuIcon,
  MenuOpen,
  LogoutOutlined,
  SettingsOutlined,
  SmartToyOutlined,
  ChevronLeft,
  MoreVert,
} from "@mui/icons-material"
import { useAuthStore } from "@/store/authStore"

const DRAWER_WIDTH = 250
const DRAWER_WIDTH_COLLAPSED = 60

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: <DashboardOutlined /> },
  { label: "Chats", href: "/dashboard/chats", icon: <ChatBubbleOutline /> },
  // { label: "Métricas", href: "/dashboard/metrics", icon: <BarChartOutlined /> },
  { label: "Usuarios", href: "/dashboard/users", icon: <PeopleOutline /> },
]
interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {

  const user = useAuthStore((s) => s.user)
  console.log(user)
  const theme = useTheme()
  const pathname = usePathname()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))

  const [mobileOpen, setMobileOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const drawerWidth =
    collapsed && !isMobile ? DRAWER_WIDTH_COLLAPSED : DRAWER_WIDTH

  const isActive = (href: string) =>
    href === "/dashboard"
      ? pathname === href
      : pathname.startsWith(href)

  const toggleDrawer = () => {
    isMobile ? setMobileOpen((p) => !p) : setCollapsed((p) => !p)
  }


  const ROLE_LABEL: Record<number, string> = {
    1: "Admin",
    2: "Manager",
    3: "User",
  }

  const roleName = user?.rol_id ? ROLE_LABEL[user.rol_id] ?? `Rol ${user.rol_id}` : "-"

  /* ---------------- Drawer Content ---------------- */

  const DrawerContent = (
    <Box
      display="flex"
      flexDirection="column"
      height="100%"
      sx={{ bgcolor: "background.paper" }}
    >
      {/* Header */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        px={2}
        height={64}
        borderBottom={1}
        borderColor="divider"
      >
        {!collapsed && (
          <Fade in>
            <Box display="flex" alignItems="center" gap={1.5}>
              <Box
                width={36}
                height={36}
                borderRadius={2}
                display="flex"
                alignItems="center"
                justifyContent="center"
                sx={{
                  bgcolor: "primary.main",
                  color: "primary.contrastText",
                }}
              >
                <SmartToyOutlined fontSize="small" />
              </Box>
              <Typography fontWeight={600}>Pre-Bot</Typography>
            </Box>
          </Fade>
        )}

        {!isMobile && !collapsed && (
          <Tooltip title="Colapsar">
            <IconButton size="small" onClick={onToggle}>
              <ChevronLeft />
            </IconButton>
          </Tooltip>
        )}
      </Box>

      {/* Navigation */}
      <Box flex={1} px={1.5} py={2}>
        <List disablePadding>
          {navItems.map((item) => {
            const active = isActive(item.href)

            return (
              <ListItem key={item.href} disablePadding sx={{ mb: 0.5 }}>
                <Tooltip
                  title={collapsed && !isMobile ? item.label : ""}
                  placement="right"
                >
                  <ListItemButton
                    component={Link}
                    href={item.href}
                    onClick={() => isMobile && setMobileOpen(false)}
                    sx={{
                      borderRadius: 2,
                      minHeight: 46,
                      justifyContent:
                        collapsed && !isMobile ? "center" : "flex-start",
                      px: collapsed && !isMobile ? 2 : 2.5,
                      bgcolor: active ? "primary.main" : "transparent",
                      color: active
                        ? "primary.contrastText"
                        : "text.primary",
                      "&:hover": {
                        bgcolor: active
                          ? "primary.dark"
                          : "action.hover",
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: collapsed && !isMobile ? 0 : 36,
                        color: active
                          ? "primary.contrastText"
                          : "text.secondary",
                        justifyContent: "center",
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>

                    {!collapsed && (
                      <ListItemText
                        primary={item.label}
                        primaryTypographyProps={{
                          fontSize: 14,
                          fontWeight: active ? 600 : 400,
                        }}
                      />
                    )}
                  </ListItemButton>
                </Tooltip>
              </ListItem>
            )
          })}
        </List>
      </Box>

      {/* User Section */}
      <Box px={2} py={1.5} borderTop={1} borderColor="divider">
        <Box
          display="flex"
          alignItems="center"
          gap={1.5}
          onClick={(e) => setAnchorEl(e.currentTarget)}
          sx={{
            cursor: "pointer",
            p: 1,
            borderRadius: 2,
            "&:hover": { bgcolor: "action.hover" },
            justifyContent:
              collapsed && !isMobile ? "center" : "flex-start",
          }}
        >
          <Avatar sx={{ width: 34, height: 34 }}>JD</Avatar>

          {!collapsed && (
            <>
              <Box flex={1} minWidth={0}>
                <Typography fontSize={14} fontWeight={500} noWrap>
                  {user?.nombre}
                </Typography>
                <Typography fontSize={12} color="text.secondary" noWrap>
                  Rol: {roleName}
                </Typography>

                <Typography fontSize={14} fontWeight={500} noWrap>
                  {user?.email}
                </Typography>
              </Box>
              <MoreVert fontSize="small" />
            </>
          )}
        </Box>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          transformOrigin={{ vertical: "bottom", horizontal: "right" }}
          PaperProps={{
            sx: { borderRadius: 2, minWidth: 180 },
          }}
        >
          <MenuItem>
            <SettingsOutlined fontSize="small" />
            <Typography ml={1}>Configuración</Typography>
          </MenuItem>
          <Divider />
          <MenuItem sx={{ color: "error.main" }}>
            <LogoutOutlined fontSize="small" />
            <Typography ml={1}>Cerrar sesión</Typography>
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  )

  /* ---------------- Layout ---------------- */

  return (
    <>
      {/* Mobile Top Bar */}
      {isMobile && (
        <Box
          position="fixed"
          top={0}
          left={0}
          right={0}
          height={64}
          display="flex"
          alignItems="center"
          px={2}
          zIndex={1200}
          bgcolor="background.paper"
          borderBottom={1}
          borderColor="divider"
        >
          <IconButton onClick={onToggle}>
            <MenuIcon />
          </IconButton>
          <Typography ml={2} fontWeight={600}>
            Pre-Bot
          </Typography>
        </Box>
      )}

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={toggleDrawer}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            width: DRAWER_WIDTH,
            border: "none",
          },
        }}
      >
        {DrawerContent}
      </Drawer>

      {/* Desktop Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", md: "block" },
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            borderRight: 1,
            borderColor: "divider",
            transition: theme.transitions.create("width", {
              duration: theme.transitions.duration.standard,
            }),
            overflowX: "hidden",
          },
        }}
        open
      >
        {DrawerContent}
      </Drawer>

      {/* Expand Button */}
      {collapsed && !isMobile && (
        <Tooltip title="Expandir">
          <IconButton
            onClick={onToggle}
            sx={{
              position: "fixed",
              left: DRAWER_WIDTH_COLLAPSED - 12,
              top: 20,
              zIndex: 1300,
              bgcolor: "background.paper",
              border: 1,
              borderColor: "divider",
            }}
            size="small"
          >
            <MenuOpen sx={{ transform: "rotate(180deg)" }} />
          </IconButton>
        </Tooltip>
      )}
    </>
  )
}
