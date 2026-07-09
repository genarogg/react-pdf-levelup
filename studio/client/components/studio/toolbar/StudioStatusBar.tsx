import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react"
import { useStudio } from "../StudioContext"

const STATUS_CONFIG = {
  idle: { icon: null, label: "Sin archivo principal", className: "text-gray-500" },
  compiling: { icon: Loader2, label: "Compilando…", className: "text-blue-400 animate-pulse" },
  ok: { icon: CheckCircle2, label: "Compilado", className: "text-emerald-400" },
  error: { icon: AlertCircle, label: "Error de compilación", className: "text-red-400" },
} as const

export function StudioStatusBar() {
  const { compileStatus, mainFile } = useStudio()
  const status = STATUS_CONFIG[compileStatus]
  const Icon = status.icon

  return (
    <div className="fixed bottom-6 left-6 z-50">
      <div className="flex items-center gap-3 px-3.5 py-2 bg-gradient-to-r from-gray-800/90 to-gray-900/90 rounded-lg shadow-lg backdrop-blur-sm border border-gray-700/50">
        <div className={`flex items-center gap-1.5 text-xs font-medium h-[32px] ${status.className}`}>
          {Icon && <Icon className="w-3.5 h-3.5" />}
          <span>{status.label}</span>
        </div>

        {mainFile && (
          <span className="text-xs text-gray-500 truncate max-w-[180px]" title={mainFile}>
            {mainFile}
          </span>
        )}
      </div>
    </div>
  )
}
