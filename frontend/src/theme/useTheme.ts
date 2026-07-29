import { useCallback, useEffect, useState } from "react"

export const THEMES = [
  { id: "original", label: "Original (azul + verde)", swatch: "rgb(59 130 246)" },
  { id: "indigo", label: "Índigo enfocado", swatch: "rgb(91 110 245)" },
  { id: "amber", label: "Ámbar sobre grafito", swatch: "rgb(232 163 61)" },
  { id: "emerald", label: "Esmeralda editorial", swatch: "rgb(47 191 143)" },
  { id: "terracotta", label: "Terracota cálida", swatch: "rgb(226 100 59)" },
  { id: "slate-gold", label: "Slate & oro", swatch: "rgb(212 169 74)" },
] as const

export type ThemeId = (typeof THEMES)[number]["id"]

const STORAGE_KEY = "rpl-theme"
const DEFAULT_THEME: ThemeId = "original"

function applyTheme(theme: ThemeId) {
  if (theme === "original") {
    document.documentElement.removeAttribute("data-theme")
  } else {
    document.documentElement.setAttribute("data-theme", theme)
  }
}

export function useTheme() {
  const [theme, setThemeState] = useState<ThemeId>(() => {
    if (typeof window === "undefined") return DEFAULT_THEME
    const stored = window.localStorage.getItem(STORAGE_KEY) as ThemeId | null
    return stored && THEMES.some(t => t.id === stored) ? stored : DEFAULT_THEME
  })

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  const setTheme = useCallback((next: ThemeId) => {
    window.localStorage.setItem(STORAGE_KEY, next)
    setThemeState(next)
  }, [])

  return { theme, setTheme, themes: THEMES }
}