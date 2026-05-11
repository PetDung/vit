"use client"

import React, { createContext, useContext } from "react"
import { usePathname } from "next/navigation"
import { type ThemeConfig, getThemeFromPath } from "@/lib/theme-config"

const ThemeContext = createContext<ThemeConfig | null>(null)

export function useThemeConfig(): ThemeConfig {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error("useThemeConfig must be used within ThemeProvider")
  return ctx
}

export function ThemeProvider({
  theme,
  children,
}: {
  theme: ThemeConfig
  children: React.ReactNode
}) {
  return (
    <ThemeContext.Provider value={theme}>
      <div className={`theme-${theme.id}`}>{children}</div>
    </ThemeContext.Provider>
  )
}

/**
 * Auto-detect theme from pathname
 */
export function AutoThemeProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const theme = getThemeFromPath(pathname)

  return (
    <ThemeProvider theme={theme}>
      {children}
    </ThemeProvider>
  )
}
