import { create } from "zustand"

type ThemeMode = "light" | "dark"

interface ThemeState {
  mode: ThemeMode
  toggle: () => void
}

export const useThemeStore = create<ThemeState>((set) => ({
  mode: "dark",
  toggle: () =>
    set((state) => ({
      mode: state.mode === "dark" ? "light" : "dark",
    })),
}))
