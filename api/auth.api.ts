// path: src/api/auth.api.ts
import api from "@/lib/api"
import type { User } from "@/store/authStore"

export async function login(email: string, password: string) {
  // setea cookie HttpOnly en backend
  await api.post("/login", { email, password })
}

export async function me(): Promise<User> {
  const res = await api.get("/me")
  return res.data as User
}

export async function logout() {
  await api.post("/logout")
}
