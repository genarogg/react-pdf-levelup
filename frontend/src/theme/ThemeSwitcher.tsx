import { useState } from "react"
import { Palette, Check } from "lucide-react"
import { useTheme } from "./useTheme"

export function ThemeSwitcher() {
  const { theme, setTheme, themes } = useTheme()
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-8 h-8 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors duration-200"
        aria-label="Cambiar tema de color"
      >
        <Palette className="w-4 h-4" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-10 z-50 w-56 rounded-lg border border-border bg-card p-1.5 shadow-lg">
            {themes.map(t => (
              <button
                key={t.id}
                onClick={() => {
                  setTheme(t.id)
                  setOpen(false)
                }}
                className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm text-foreground hover:bg-secondary transition-colors duration-150"
              >
                <span
                  className="w-3.5 h-3.5 rounded-full shrink-0 border border-border"
                  style={{ backgroundColor: t.swatch }}
                />
                <span className="flex-1 text-left">{t.label}</span>
                {theme === t.id && <Check className="w-3.5 h-3.5 text-accent shrink-0" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
