"use client"

import React from "react"
import QuickHelp from "./QuickHelp"
import ColorPicker from "./ColorPicker"
import downloadTemplate from "./funciones/dowloadTemplate"
import { Download, Save, FilePlus } from "lucide-react"

interface ToolBarProps {
  code: string
  onSave?: () => void
  onNew?: () => void
}

const ToolBar: React.FC<ToolBarProps> = ({ code, onSave, onNew }) => {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center justify-center gap-3 px-3.5 py-2 bg-gradient-to-r from-gray-800/80 to-gray-900/80   rounded-lg shadow-lg backdrop-blur-sm">
        {onNew && (
          <button
            onClick={onNew}
            className="flex items-center justify-center gap-1.5 px-2.5 py-1.5 text-sm font-medium text-gray-300 hover:text-white     rounded-md transition-colors"
            title="Nueva plantilla"
          >
            <FilePlus className="w-4 h-4" />
          </button>
        )}
        {onSave && (
          <button
            onClick={onSave}
            className="flex items-center justify-center gap-1.5 px-2.5 py-1.5 text-sm font-medium text-gray-300 hover:text-white     rounded-md transition-colors"
            title="Guardar plantilla"
          >
            <Save className="w-4 h-4" />
          </button>
        )}
        <QuickHelp inline />
        <ColorPicker />
        <button
          onClick={() => downloadTemplate(code)}
          className="flex items-center justify-center gap-1.5 px-2.5 py-1.5 text-sm font-medium text-gray-300 hover:text-white     rounded-md transition-colors"
          title="Descargar template"
        >
          <Download className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

export default ToolBar
