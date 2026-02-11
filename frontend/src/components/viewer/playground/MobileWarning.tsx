import { AlertTriangle, Monitor, Smartphone } from "lucide-react"
import { Button } from "@/components/ui/button"

interface MobileWarningProps {
  onContinue?: () => void
}

export function MobileWarning({ onContinue }: MobileWarningProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-gray-800/90 backdrop-blur-sm rounded-2xl border border-gray-700 p-8 text-center shadow-2xl">
          {/* Iconos animados */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute -top-2 -right-2 animate-pulse">
                <AlertTriangle className="h-8 w-8 text-yellow-500" />
              </div>
              <div className="bg-gray-700 rounded-full p-4">
                <Smartphone className="h-12 w-12 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Título */}
          <h1 className="text-2xl font-bold text-white mb-4">
            Playground No Disponible
          </h1>

          {/* Mensaje */}
          <div className="space-y-4 mb-8">
            <p className="text-gray-300 leading-relaxed">
              El playground de React PDF LevelUp está diseñado para ser utilizado en computadoras de escritorio o laptops.
            </p>
            
            <div className="bg-gray-700/50 rounded-lg p-4">
              <div className="flex items-center gap-3 text-left">
                <Monitor className="h-5 w-5 text-blue-400 flex-shrink-0" />
                <div>
                  <p className="text-white font-medium">Para la mejor experiencia:</p>
                  <p className="text-gray-400 text-sm">Por favor visita desde una computadora</p>
                </div>
              </div>
            </div>

            <p className="text-gray-400 text-sm">
              El editor de código y la vista previa de PDF requieren más espacio y funcionalidades que no están disponibles en dispositivos móviles.
            </p>
          </div>

          {/* Botones */}
          <div className="space-y-3">
            <Button
              onClick={() => window.location.href = '/'}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              Volver al Inicio
            </Button>
            
            {onContinue && (
              <Button
                onClick={onContinue}
                variant="outline"
                className="w-full border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
              >
                Continuar de todos modos
              </Button>
            )}
          </div>

          {/* Footer */}
          <div className="mt-6 pt-6 border-t border-gray-700">
            <p className="text-gray-500 text-xs">
              React PDF LevelUp - Herramienta de desarrollo profesional
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}