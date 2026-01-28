// path: src/app/dashboard/layout.tsx
"use client"

import { useEffect, useState } from "react"
import { useAuthStore } from "@/store/authStore"
import { useRouter, usePathname } from "next/navigation"
import Sidebar from "@/components/Sidebar"
import Header from "@/components/layout/Header"
import { me as meApi } from "@/api/auth.api"

const SIDEBAR_WIDTH = 260
const SIDEBAR_COLLAPSED_WIDTH = 72

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()

  const setAuthenticated = useAuthStore((s) => s.setAuthenticated)
  const clear = useAuthStore((s) => s.clear)

  const [collapsed, setCollapsed] = useState(false)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    let alive = true

    async function ensureAuth() {
      try {
        // ✅ SIEMPRE validar cookie con /me al entrar al dashboard
        const user = await meApi()
        if (!alive) return
        setAuthenticated(user)
      } catch (e) {
        if (!alive) return
        clear()
        // ✅ usar la misma ruta que en tu interceptor
        router.replace("/auth/login") // o "/auth/login" pero que sea UNA sola
      } finally {
        if (alive) setChecking(false)
      }
    }

    ensureAuth()
    return () => {
      alive = false
    }
  }, [setAuthenticated, clear, router])

  if (checking) return null

  return (
    <div className="flex min-h-screen">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((p) => !p)} />

      <div
        className="flex-1 flex flex-col transition-all duration-300"
        style={{ marginLeft: collapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH }}
      >
        <Header />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
