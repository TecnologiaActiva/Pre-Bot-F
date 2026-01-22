"use client"

import { useCallback, useEffect, useState } from "react"
import { createUser, getUsers, type CreateUserDTO, type UserDTO } from "@/api/Users.api"

export function useUsers() {
  const [items, setItems] = useState<UserDTO[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await getUsers()
      setItems(data)
    } catch (e: any) {
      setError(e?.response?.data?.detail ?? e?.message ?? "Error cargando usuarios")
    } finally {
      setIsLoading(false)
    }
  }, [])

  const addUser = useCallback(async (payload: CreateUserDTO) => {
    setIsLoading(true)
    setError(null)
    try {
      await createUser(payload)
      await load()
    } catch (e: any) {
      setError(e?.response?.data?.detail ?? e?.message ?? "Error creando usuario")
      throw e
    } finally {
      setIsLoading(false)
    }
  }, [load])

  useEffect(() => {
    load()
  }, [load])

  return { items, isLoading, error, reload: load, addUser }
}
