import { create } from "zustand"
import { persist } from "zustand/middleware"

type Theme = "light" | "dark" | "system"

interface ThemeState {
  theme: Theme
  resolvedTheme: "light" | "dark"
}

interface ThemeActions {
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

type ThemeStore = ThemeState & ThemeActions

const getSystemTheme = (): "light" | "dark" => {
  if (typeof window !== "undefined") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
  }
  return "light"
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      // State
      theme: "system",
      resolvedTheme: getSystemTheme(),

      // Actions
      setTheme: (theme: Theme) => {
        const resolvedTheme = theme === "system" ? getSystemTheme() : theme
        set({ theme, resolvedTheme })
        
        // Apply theme to document
        if (typeof window !== "undefined") {
          const root = window.document.documentElement
          root.classList.remove("light", "dark")
          root.classList.add(resolvedTheme)
        }
      },

      toggleTheme: () => {
        const { theme } = get()
        const newTheme = theme === "light" ? "dark" : "light"
        get().setTheme(newTheme)
      },
    }),
    {
      name: "theme-storage",
      onRehydrateStorage: () => (state) => {
        if (state) {
          const resolvedTheme = state.theme === "system" ? getSystemTheme() : state.theme
          state.resolvedTheme = resolvedTheme
          
          // Apply theme to document
          if (typeof window !== "undefined") {
            const root = window.document.documentElement
            root.classList.remove("light", "dark")
            root.classList.add(resolvedTheme)
          }
        }
      },
    }
  )
)
