import { FileCode } from "lucide-react"
import { useStudio } from "../StudioContext"
import { StudioCodeEditor } from "./StudioCodeEditor"

export function EditorPanel() {
  const { openFile, saveOpenFile } = useStudio()

  if (!openFile) {
    return (
      <div className="flex items-center justify-center h-full bg-[#1e1e1e] text-gray-500 text-sm">
        Selecciona un archivo del explorador para editarlo.
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e]">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-800 text-sm text-gray-300">
        <FileCode className="w-4 h-4 text-gray-500" />
        <span className="truncate">{openFile.path}</span>
      </div>
      <div className="flex-1 min-h-0">
        <StudioCodeEditor
          path={openFile.path}
          language={openFile.language}
          value={openFile.content}
          onSave={saveOpenFile}
        />
      </div>
    </div>
  )
}
