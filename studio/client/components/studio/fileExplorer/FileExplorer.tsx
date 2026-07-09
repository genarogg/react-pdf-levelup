import { useState } from "react"
import { FilePlus, FolderPlus, RefreshCw } from "lucide-react"
import { useStudio } from "../StudioContext"
import { TreeNode } from "./TreeNode"

export function FileExplorer() {
  const {
    tree,
    mainFile,
    openFile,
    refreshTree,
    openFileByPath,
    setMain,
    createEntry,
    rename,
    remove,
  } = useStudio()

  const [pendingNewEntry, setPendingNewEntry] = useState<{
    parentPath: string
    type: "file" | "folder"
  } | null>(null)
  const [pendingName, setPendingName] = useState("")

  const handleCreateEntry = (parentPath: string, type: "file" | "folder") => {
    setPendingNewEntry({ parentPath, type })
    setPendingName("")
  }

  const confirmCreateEntry = async () => {
    if (!pendingNewEntry || !pendingName.trim()) {
      setPendingNewEntry(null)
      return
    }
    const base = pendingNewEntry.parentPath ? `${pendingNewEntry.parentPath}/` : ""
    await createEntry(`${base}${pendingName.trim()}`, pendingNewEntry.type)
    setPendingNewEntry(null)
    setPendingName("")
  }

  const handleRename = async (path: string) => {
    const currentName = path.split("/").pop() ?? path
    const nextName = window.prompt("Nuevo nombre:", currentName)
    if (!nextName || nextName === currentName) return
    const parentParts = path.split("/").slice(0, -1)
    const newPath = [...parentParts, nextName].join("/")
    await rename(path, newPath)
  }

  const handleDelete = async (path: string) => {
    const ok = window.confirm(`¿Eliminar "${path}"? Esta acción no se puede deshacer.`)
    if (!ok) return
    await remove(path)
  }

  return (
    <div className="flex flex-col h-full bg-[#0d1117] border-r border-gray-800 text-gray-200">
      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-800">
        <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
          Explorador
        </span>
        <div className="flex items-center gap-1">
          <button
            title="Nuevo archivo en la raíz"
            className="p-1 rounded hover:bg-white/10 text-gray-400 hover:text-white"
            onClick={() => handleCreateEntry("", "file")}
          >
            <FilePlus className="w-4 h-4" />
          </button>
          <button
            title="Nueva carpeta en la raíz"
            className="p-1 rounded hover:bg-white/10 text-gray-400 hover:text-white"
            onClick={() => handleCreateEntry("", "folder")}
          >
            <FolderPlus className="w-4 h-4" />
          </button>
          <button
            title="Refrescar árbol"
            className="p-1 rounded hover:bg-white/10 text-gray-400 hover:text-white"
            onClick={() => refreshTree()}
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {pendingNewEntry && (
        <div className="px-3 py-2 border-b border-gray-800 bg-white/5">
          <input
            autoFocus
            value={pendingName}
            onChange={(e) => setPendingName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") confirmCreateEntry()
              if (e.key === "Escape") setPendingNewEntry(null)
            }}
            onBlur={confirmCreateEntry}
            placeholder={pendingNewEntry.type === "file" ? "nombre.tsx" : "nombre-carpeta"}
            className="w-full text-sm bg-black/40 border border-gray-700 rounded px-2 py-1 text-white outline-none focus:border-blue-500"
          />
        </div>
      )}

      <div className="flex-1 overflow-y-auto py-2">
        {tree.length === 0 ? (
          <p className="text-xs text-gray-500 px-3">El workspace está vacío.</p>
        ) : (
          tree.map((node) => (
            <TreeNode
              key={node.path}
              node={node}
              depth={0}
              openPath={openFile?.path ?? null}
              mainFile={mainFile}
              onOpenFile={openFileByPath}
              onSetMain={setMain}
              onCreateEntry={handleCreateEntry}
              onRename={handleRename}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>
    </div>
  )
}
