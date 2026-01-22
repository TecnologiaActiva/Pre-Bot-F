"use client"

import { useMemo, useState, useCallback } from "react"
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Chip,
  Stack,
  CircularProgress,
  Alert,
  IconButton,
  InputAdornment,
  LinearProgress,
  Tooltip,
  Avatar,
  Fade,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Collapse,
} from "@mui/material"
import {
  Add as AddIcon,
  Visibility,
  VisibilityOff,
  Refresh as RefreshIcon,
  ContentCopy as CopyIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  AdminPanelSettings as AdminIcon,
  SupervisorAccount as ManagerIcon,
  AccountCircle as UserIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
} from "@mui/icons-material"

import { useUsers } from "./hooks/userUsers"

const ROLE_OPTIONS = [
  { id: 1, label: "Admin", icon: AdminIcon, color: "error" as const },
  { id: 2, label: "Manager", icon: ManagerIcon, color: "warning" as const },
  { id: 3, label: "User", icon: UserIcon, color: "info" as const },
]

const ROLE_MAP = Object.fromEntries(ROLE_OPTIONS.map((r) => [r.id, r]))

function getPasswordStrength(password: string): {
  score: number
  label: string
  color: "error" | "warning" | "info" | "success"
  suggestions: string[]
} {
  const suggestions: string[] = []
  let score = 0

  if (password.length >= 6) score += 1
  else suggestions.push("Mínimo 6 caracteres")

  if (password.length >= 8) score += 1

  if (/[a-z]/.test(password)) score += 1
  else suggestions.push("Agregar minúsculas")

  if (/[A-Z]/.test(password)) score += 1
  else suggestions.push("Agregar mayúsculas")

  if (/[0-9]/.test(password)) score += 1
  else suggestions.push("Agregar números")

  if (/[^a-zA-Z0-9]/.test(password)) score += 1
  else suggestions.push("Agregar símbolos (!@#$%)")

  if (score <= 2) return { score, label: "Muy débil", color: "error", suggestions }
  if (score <= 3) return { score, label: "Débil", color: "warning", suggestions }
  if (score <= 4) return { score, label: "Buena", color: "info", suggestions }
  return { score, label: "Fuerte", color: "success", suggestions }
}

function generatePassword(length = 12): string {
  const lowercase = "abcdefghijklmnopqrstuvwxyz"
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  const numbers = "0123456789"
  const symbols = "!@#$%^&*()_+-="
  const all = lowercase + uppercase + numbers + symbols

  let password = ""
  password += lowercase[Math.floor(Math.random() * lowercase.length)]
  password += uppercase[Math.floor(Math.random() * uppercase.length)]
  password += numbers[Math.floor(Math.random() * numbers.length)]
  password += symbols[Math.floor(Math.random() * symbols.length)]

  for (let i = password.length; i < length; i++) {
    password += all[Math.floor(Math.random() * all.length)]
  }

  return password
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("")
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export default function UsersPage() {
  const { items, isLoading, error, addUser } = useUsers()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  const [open, setOpen] = useState(false)
  const [nombre, setNombre] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rolId, setRolId] = useState(3)

  const [showPassword, setShowPassword] = useState(false)
  const [copied, setCopied] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const [search, setSearch] = useState("")
  const [filterRole, setFilterRole] = useState<number | "all">("all")

  const [touched, setTouched] = useState({ nombre: false, email: false, password: false })

  const passwordStrength = useMemo(() => getPasswordStrength(password), [password])

  const errors = useMemo(() => {
    return {
      nombre: touched.nombre && nombre.trim().length < 2 ? "Mínimo 2 caracteres" : "",
      email: touched.email && !isValidEmail(email) ? "Email inválido" : "",
      password: touched.password && password.length < 6 ? "Mínimo 6 caracteres" : "",
    }
  }, [nombre, email, password, touched])

  const canSubmit = useMemo(() => {
    return (
      nombre.trim().length >= 2 &&
      isValidEmail(email) &&
      password.length >= 6 &&
      !Object.values(errors).some((e) => e)
    )
  }, [nombre, email, password, errors])

  const filteredUsers = useMemo(() => {
    return items.filter((u) => {
      const matchSearch =
        u.nombre.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
      const matchRole = filterRole === "all" || u.rol_id === filterRole
      return matchSearch && matchRole
    })
  }, [items, search, filterRole])

  const handleGeneratePassword = useCallback(() => {
    const newPass = generatePassword(12)
    setPassword(newPass)
    setTouched((t) => ({ ...t, password: true }))
    setShowPassword(true)
  }, [])

  const handleCopyPassword = useCallback(async () => {
    if (!password) return
    await navigator.clipboard.writeText(password)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [password])

  const resetForm = useCallback(() => {
    setNombre("")
    setEmail("")
    setPassword("")
    setRolId(3)
    setShowPassword(false)
    setTouched({ nombre: false, email: false, password: false })
    setCopied(false)
  }, [])

  const handleClose = useCallback(() => {
    setOpen(false)
    resetForm()
  }, [resetForm])

  const onCreate = async () => {
    if (!canSubmit) return
    setSubmitting(true)
    try {
      await addUser({ nombre, email, password, rol_id: 1 })
      handleClose()
    } finally {
      setSubmitting(false)
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .filter(Boolean)
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const renderMobileCards = () => (
    <Stack spacing={2}>
      {filteredUsers.map((u) => {
        const role = ROLE_MAP[u.rol_id]
        const RoleIcon = role?.icon || UserIcon
        return (
          <Fade in key={u.id}>
            <Card
              elevation={0}
              sx={{
                border: 1,
                borderColor: "divider",
                borderRadius: 3,
                "&:hover": { borderColor: "primary.main", bgcolor: "action.hover" },
                transition: "all 0.2s ease",
              }}
            >
              <CardContent sx={{ p: 2 }}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar
                    sx={{
                      bgcolor: u.activo ? "primary.main" : "grey.400",
                      width: 48,
                      height: 48,
                    }}
                  >
                    {getInitials(u.nombre)}
                  </Avatar>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="subtitle1" fontWeight={600} noWrap>
                      {u.nombre}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {u.email}
                    </Typography>
                    <Stack direction="row" spacing={1} mt={1}>
                      <Chip
                        size="small"
                        icon={<RoleIcon sx={{ fontSize: 16 }} />}
                        label={role?.label || `Rol ${u.rol_id}`}
                        color={role?.color || "default"}
                        variant="outlined"
                      />
                      <Chip
                        size="small"
                        label={u.activo ? "Activo" : "Inactivo"}
                        color={u.activo ? "success" : "default"}
                        variant={u.activo ? "filled" : "outlined"}
                      />
                    </Stack>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Fade>
        )
      })}
    </Stack>
  )

  const renderTable = () => (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 600 }}>Usuario</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Rol</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Estado</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {isLoading && items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} sx={{ py: 4 }}>
                <Stack direction="row" alignItems="center" justifyContent="center" gap={2}>
                  <CircularProgress size={24} />
                  <Typography variant="body2" color="text.secondary">
                    Cargando usuarios...
                  </Typography>
                </Stack>
              </TableCell>
            </TableRow>
          ) : filteredUsers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} sx={{ py: 6 }}>
                <Stack alignItems="center" spacing={1}>
                  <PersonIcon sx={{ fontSize: 48, color: "text.disabled" }} />
                  <Typography variant="body1" color="text.secondary">
                    {search || filterRole !== "all" ? "No hay resultados" : "No hay usuarios"}
                  </Typography>
                  {!search && filterRole === "all" && (
                    <Button size="small" startIcon={<AddIcon />} onClick={() => setOpen(true)}>
                      Crear primer usuario
                    </Button>
                  )}
                </Stack>
              </TableCell>
            </TableRow>
          ) : (
            filteredUsers.map((u) => {
              const role = ROLE_MAP[u.rol_id]
              const RoleIcon = role?.icon || UserIcon
              return (
                <TableRow
                  key={u.id}
                  hover
                  sx={{
                    "&:hover": { bgcolor: "action.hover" },
                    transition: "background-color 0.2s ease",
                  }}
                >
                  <TableCell>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar
                        sx={{
                          bgcolor: u.activo ? "primary.main" : "grey.400",
                          width: 36,
                          height: 36,
                          fontSize: 14,
                        }}
                      >
                        {getInitials(u.nombre)}
                      </Avatar>
                      <Typography variant="body2" fontWeight={500}>
                        {u.nombre}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {u.email}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      icon={<RoleIcon sx={{ fontSize: 16 }} />}
                      label={role?.label || `Rol ${u.rol_id}`}
                      color={role?.color || "default"}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      label={u.activo ? "Activo" : "Inactivo"}
                      color={u.activo ? "success" : "default"}
                      variant={u.activo ? "filled" : "outlined"}
                    />
                  </TableCell>
                </TableRow>
              )
            })
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )

  return (
    <Box sx={{ width: "100%", p: { xs: 2, sm: 3 } }}>
      {/* Header */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "stretch", sm: "center" }}
        spacing={2}
        mb={3}
      >
        <Box>
          <Typography variant="h5" fontWeight={700} color="text.primary">
            Usuarios
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Gestión de usuarios del sistema
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpen(true)}
          sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600, px: 3 }}
          fullWidth={isMobile}
        >
          Crear usuario
        </Button>
      </Stack>

      <Collapse in={!!error}>
        <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
          {error}
        </Alert>
      </Collapse>

      {/* Search and filters */}
      <Paper elevation={0} sx={{ border: 1, borderColor: "divider", borderRadius: 3, p: 2, mb: 2 }}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <TextField
            placeholder="Buscar por nombre o email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="small"
            fullWidth
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "text.disabled" }} />
                  </InputAdornment>
                ),
                endAdornment: search && (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setSearch("")}>
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
          />

          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Rol</InputLabel>
            <Select
              value={filterRole}
              label="Rol"
              onChange={(e) => setFilterRole(e.target.value as number | "all")}
              sx={{ borderRadius: 2 }}
            >
              <MenuItem value="all">Todos</MenuItem>
              {ROLE_OPTIONS.map((r) => (
                <MenuItem key={r.id} value={r.id}>
                  {r.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>

        {(search || filterRole !== "all") && (
          <Stack direction="row" spacing={1} mt={2} alignItems="center">
            <FilterIcon sx={{ fontSize: 18, color: "text.secondary" }} />
            <Typography variant="caption" color="text.secondary">
              {filteredUsers.length} de {items.length} usuarios
            </Typography>
            <Button
              size="small"
              onClick={() => {
                setSearch("")
                setFilterRole("all")
              }}
            >
              Limpiar filtros
            </Button>
          </Stack>
        )}
      </Paper>

      {/* Users list */}
      <Paper elevation={0} sx={{ border: 1, borderColor: "divider", borderRadius: 3, overflow: "hidden" }}>
        {isMobile ? <Box sx={{ p: 2 }}>{renderMobileCards()}</Box> : renderTable()}
      </Paper>

      {/* Create user dialog */}
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
        fullScreen={isMobile}
        PaperProps={{ sx: { borderRadius: isMobile ? 0 : 3 } }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Box>
              <Typography variant="h6" fontWeight={700}>
                Crear usuario
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Complete los datos del nuevo usuario
              </Typography>
            </Box>
            <IconButton onClick={handleClose} size="small">
              <CloseIcon />
            </IconButton>
          </Stack>
        </DialogTitle>

        <Divider />

        <DialogContent sx={{ pt: 3 }}>
          <Stack spacing={3}>
            <TextField
              label="Nombre completo"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, nombre: true }))}
              error={!!errors.nombre}
              helperText={errors.nombre || " "}
              fullWidth
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon sx={{ color: errors.nombre ? "error.main" : "text.disabled" }} />
                    </InputAdornment>
                  ),
                  endAdornment: touched.nombre && !errors.nombre && nombre && (
                    <InputAdornment position="end">
                      <CheckIcon sx={{ color: "success.main" }} />
                    </InputAdornment>
                  ),
                },
              }}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            />

            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, email: true }))}
              error={!!errors.email}
              helperText={errors.email || " "}
              fullWidth
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon sx={{ color: errors.email ? "error.main" : "text.disabled" }} />
                    </InputAdornment>
                  ),
                  endAdornment: touched.email && !errors.email && email && (
                    <InputAdornment position="end">
                      <CheckIcon sx={{ color: "success.main" }} />
                    </InputAdornment>
                  ),
                },
              }}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            />

            <Box>
              <TextField
                label="Contraseña"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                error={!!errors.password}
                helperText={errors.password || " "}
                fullWidth
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon sx={{ color: errors.password ? "error.main" : "text.disabled" }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <Stack direction="row" spacing={0.5}>
                          {password && (
                            <Tooltip title={copied ? "Copiado" : "Copiar"}>
                              <IconButton size="small" onClick={handleCopyPassword}>
                                {copied ? (
                                  <CheckIcon fontSize="small" sx={{ color: "success.main" }} />
                                ) : (
                                  <CopyIcon fontSize="small" />
                                )}
                              </IconButton>
                            </Tooltip>
                          )}
                          <Tooltip title="Generar contraseña">
                            <IconButton size="small" onClick={handleGeneratePassword}>
                              <RefreshIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <IconButton size="small" onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                          </IconButton>
                        </Stack>
                      </InputAdornment>
                    ),
                  },
                }}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              />

              {password && (
                <Fade in>
                  <Box sx={{ mt: 1 }}>
                    <Stack direction="row" alignItems="center" spacing={1} mb={0.5}>
                      <LinearProgress
                        variant="determinate"
                        value={(passwordStrength.score / 6) * 100}
                        color={passwordStrength.color}
                        sx={{ flex: 1, height: 6, borderRadius: 3, bgcolor: "action.hover" }}
                      />
                      <Chip
                        size="small"
                        label={passwordStrength.label}
                        color={passwordStrength.color}
                        variant="outlined"
                        sx={{ fontSize: 11, height: 22 }}
                      />
                    </Stack>

                    {passwordStrength.suggestions.length > 0 && (
                      <Typography variant="caption" color="text.secondary">
                        Sugerencias: {passwordStrength.suggestions.join(", ")}
                      </Typography>
                    )}
                  </Box>
                </Fade>
              )}
            </Box>

            <FormControl fullWidth disabled>
              <InputLabel>Rol</InputLabel>
              <Select
                value={1}
                label="Rol"
                sx={{ borderRadius: 2 }}
              >
                <MenuItem value={1}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <AdminIcon sx={{ fontSize: 20, color: "error.main" }} />
                    <span>Admin</span>
                  </Stack>
                </MenuItem>
              </Select>
            </FormControl>

            <Typography variant="caption" color="text.secondary">
              Rol fijado en <b>Admin</b> por ahora (solo Admin puede crear usuarios).
            </Typography>

            {/* ✅ ALERT neutro (sin "se enviará por email") */}
            <Alert severity="info" sx={{ borderRadius: 2 }}>
              Guardá la contraseña: el sistema no la muestra nuevamente.
            </Alert>
          </Stack>
        </DialogContent>

        <Divider />

        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={handleClose} color="inherit" sx={{ borderRadius: 2, textTransform: "none" }}>
            Cancelar
          </Button>
          <Button
            onClick={onCreate}
            variant="contained"
            disabled={!canSubmit || submitting}
            startIcon={submitting ? <CircularProgress size={18} color="inherit" /> : <AddIcon />}
            sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600, px: 3 }}
          >
            {submitting ? "Creando..." : "Crear usuario"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
