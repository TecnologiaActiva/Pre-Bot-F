import api from "@/lib/api"

export type UserDTO = {
  id: number
  team_id: number
  rol_id: number
  nombre: string
  email: string
  activo: boolean
}

export type CreateUserDTO = {
  rol_id: number
  nombre: string
  email: string
  password: string
}

export async function getUsers() {
  const res = await api.get<UserDTO[]>("/users")
  return res.data
}

export async function createUser(payload: CreateUserDTO) {
  const res = await api.post<UserDTO>("/users", payload)
  return res.data
}
