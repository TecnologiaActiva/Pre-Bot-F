// path: src/app/auth/login/page.tsx (o donde esté tu LoginPage)
"use client"

import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Box,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  Alert,
  Snackbar,
  CircularProgress,
  Fade,
} from "@mui/material"
import {
  Visibility,
  VisibilityOff,
  EmailOutlined,
  LockOutlined,
  CheckCircleOutline,
} from "@mui/icons-material"
import { loginSchema, type LoginFormData } from "./schema"
import { useAuthStore } from "@/store/authStore"
import { useRouter } from "next/navigation"
import { login as loginApi, me as meApi } from "@/api/auth.api"

export default function LoginPage() {
  const router = useRouter()
  const setAuthenticated = useAuthStore((s) => s.setAuthenticated)

  const [showPassword, setShowPassword] = useState(false)
  const [snackbar, setSnackbar] = useState<{
    open: boolean
    message: string
    severity: "success" | "error"
  }>({
    open: false,
    message: "",
    severity: "success",
  })

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isValid, touchedFields },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: { email: "", password: "" },
  })

  const onSubmit = async (data: LoginFormData) => {
    try {
      await loginApi(data.email, data.password) // set-cookie
      const user = await meApi()                // valida cookie y trae user
      setAuthenticated(user)
      router.push("/dashboard")
    } catch {
      setSnackbar({
        open: true,
        message: "Credenciales inválidas",
        severity: "error",
      })
    }
  }

  return (
    <Box
      minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      sx={{ bgcolor: "background.default", px: { xs: 2, sm: 4 } }}
    >
      <Fade in timeout={600}>
        <Box sx={{ width: "100%", maxWidth: { xs: "100%", sm: 420, md: 460 } }}>
          <Box textAlign="center" mb={{ xs: 5, sm: 6 }}>
            <Box
              mx="auto"
              mb={3}
              width={64}
              height={64}
              borderRadius={3}
              display="flex"
              alignItems="center"
              justifyContent="center"
              sx={{ bgcolor: "primary.main", color: "primary.contrastText", boxShadow: 6 }}
            >
              <LockOutlined sx={{ fontSize: 32 }} />
            </Box>

            <Typography sx={{ fontSize: { xs: "1.9rem", sm: "2.2rem" }, fontWeight: 600 }}>
              Bienvenido
            </Typography>

            <Typography variant="body2" mt={1} sx={{ color: "text.secondary" }}>
              Ingresá tus credenciales para continuar
            </Typography>
          </Box>

          <Box sx={{ bgcolor: "background.paper", borderRadius: 4, p: { xs: 3, sm: 4 }, boxShadow: 8, border: 1, borderColor: "divider" }}>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Email"
                    type="email"
                    margin="normal"
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    disabled={isSubmitting}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailOutlined
                            sx={{
                              color: errors.email
                                ? "error.main"
                                : touchedFields.email && !errors.email
                                ? "success.main"
                                : "text.disabled",
                            }}
                          />
                        </InputAdornment>
                      ),
                      endAdornment:
                        touchedFields.email && !errors.email && field.value ? (
                          <InputAdornment position="end">
                            <CheckCircleOutline sx={{ color: "success.main", fontSize: 20 }} />
                          </InputAdornment>
                        ) : null,
                    }}
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
                  />
                )}
              />

              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Contraseña"
                    type={showPassword ? "text" : "password"}
                    margin="normal"
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    disabled={isSubmitting}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockOutlined
                            sx={{
                              color: errors.password
                                ? "error.main"
                                : touchedFields.password && !errors.password
                                ? "success.main"
                                : "text.disabled",
                            }}
                          />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowPassword((p) => !p)} edge="end" size="small">
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
                  />
                )}
              />

              <Box mt={3}>
                <Box
                  component="button"
                  type="submit"
                  disabled={isSubmitting || !isValid}
                  sx={{
                    width: "100%",
                    py: 1.6,
                    borderRadius: 3,
                    border: "none",
                    fontSize: "1rem",
                    fontWeight: 500,
                    cursor: "pointer",
                    bgcolor: isSubmitting || !isValid ? "action.disabledBackground" : "primary.main",
                    color: isSubmitting || !isValid ? "text.disabled" : "primary.contrastText",
                    "&:hover:not(:disabled)": { bgcolor: "primary.dark" },
                  }}
                >
                  {isSubmitting ? (
                    <Box display="flex" gap={1} alignItems="center" justifyContent="center">
                      <CircularProgress size={20} color="inherit" />
                      Ingresando...
                    </Box>
                  ) : (
                    "Iniciar sesión"
                  )}
                </Box>
              </Box>
            </form>
          </Box>

          <Snackbar
            open={snackbar.open}
            autoHideDuration={4000}
            onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          >
            <Alert severity={snackbar.severity} variant="filled" sx={{ borderRadius: 3 }}>
              {snackbar.message}
            </Alert>
          </Snackbar>
        </Box>
      </Fade>
    </Box>
  )
}
