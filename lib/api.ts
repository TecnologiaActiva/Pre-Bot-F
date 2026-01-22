import { useAuthStore } from "@/store/authStore"
import axios from "axios"

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000",
  withCredentials: true,
})

let redirecting = false

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      // evita redirecciones múltiples
      if (!redirecting) {
        redirecting = true
        try {
          useAuthStore.setState({ user: null, isAuthenticated: false } as any)
        } catch {}

        if (typeof window !== "undefined") {
          window.location.href = "/login"
        }
      }
    }
    return Promise.reject(error)
  }
)

export default api
