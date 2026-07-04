import { useState } from "react"

type FileTreeItem = {
  name: string
  path: string
  type: "file" | "directory"
  children?: FileTreeItem[]
}

type StudioSidebarProps = {
  tree: FileTreeItem[]
  selectedPath: string | null
  onSelectFile: (path: string) => void
  onCreateFile: () => void
  onRefresh: () => void
}

function FileTree({ item, selectedPath, onSelectFile, level = 0 }: {
  item: FileTreeItem
  selectedPath: string | null
  onSelectFile: (path: string) => void
  level?: number
}) {
  const [isExpanded, setIsExpanded] = useState(true)

  if (item.type === "file") {
    return (
      <div
        onClick={() => onSelectFile(item.path)}
        className={`px-3 py-1.5 text-sm cursor-pointer transition-all duration-300 rounded-md mx-2 my-1 ${
          selectedPath === item.path
            ? "bg-blue-500/20 text-white"
            : "text-gray-300 hover:bg-white/5 hover:text-white"
        }`}
        style={{ paddingLeft: `${level * 12 + 12}px` }}
      >
        📄 {item.name}
      </div>
    )
  }

  return (
    <div>
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center px-3 py-1.5 text-sm cursor-pointer text-gray-300 hover:text-white transition-all duration-300 rounded-md mx-2 my-1 hover:bg-white/5"
        style={{ paddingLeft: `${level * 12 + 12}px` }}
      >
        {isExpanded ? "📂" : "📁"} {item.name}
      </div>
      {isExpanded && item.children?.map((child) => (
        <FileTree
          key={child.path}
          item={child}
          selectedPath={selectedPath}
          onSelectFile={onSelectFile}
          level={level + 1}
        />
      ))}
    </div>
  )
}

export default function StudioSidebar({ tree, selectedPath, onSelectFile, onCreateFile, onRefresh }: StudioSidebarProps) {
  return (
    <div className="w-64 bg-black/80 backdrop-blur-xl border-r border-white/10 flex flex-col">
      {/* Gradiente decorativo superior */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
      
      <div className="p-4 border-b border-white/10">
        <h2 className="text-lg font-semibold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">Plantillas</h2>
      </div>
      
      <div className="flex gap-2 p-2 border-b border-white/10">
        <button
          onClick={onCreateFile}
          className="flex-1 bg-blue-500/15 hover:bg-blue-500/25 text-gray-300 hover:text-white text-sm py-1.5 px-3 rounded-md transition-all duration-300"
        >
          + Nueva
        </button>
        <button
          onClick={onRefresh}
          className="bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white text-sm py-1.5 px-3 rounded-md transition-all duration-300"
        >
          🔄
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto py-2">
        {tree.length === 0 ? (
          <div className="p-4 text-center text-gray-500 text-sm">
            No hay plantillas aún
          </div>
        ) : (
          tree.map((item) => (
            <FileTree
              key={item.path}
              item={item}
              selectedPath={selectedPath}
              onSelectFile={onSelectFile}
            />
          ))
        )}
      </div>
    </div>
  )
}
