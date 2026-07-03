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
        className={`px-3 py-1.5 text-sm cursor-pointer transition-colors ${
          selectedPath === item.path
            ? "bg-blue-600 text-white"
            : "text-gray-300 hover:bg-gray-700"
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
        className="flex items-center px-3 py-1.5 text-sm cursor-pointer text-gray-300 hover:bg-gray-700"
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
    <div className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-lg font-semibold text-white">Plantillas</h2>
      </div>
      <div className="flex gap-2 p-2 border-b border-gray-700">
        <button
          onClick={onCreateFile}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm py-1.5 px-3 rounded transition-colors"
        >
          + Nueva
        </button>
        <button
          onClick={onRefresh}
          className="bg-gray-700 hover:bg-gray-600 text-white text-sm py-1.5 px-3 rounded transition-colors"
        >
          🔄
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">
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
