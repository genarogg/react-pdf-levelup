import { useState } from "react"
import {
  ChevronRight,
  ChevronDown,
  File,
  Folder,
  FolderOpen,
  FilePlus,
  FolderPlus,
  Pencil,
  Trash2,
  Star,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { Node } from "../api/studioApi"

interface TreeNodeProps {
  node: Node
  depth: number
  openPath: string | null
  mainFile: string | null
  onOpenFile: (path: string) => void
  onSetMain: (path: string) => void
  onCreateEntry: (parentPath: string, type: "file" | "folder") => void
  onRename: (path: string) => void
  onDelete: (path: string) => void
}

export function TreeNode({
  node,
  depth,
  openPath,
  mainFile,
  onOpenFile,
  onSetMain,
  onCreateEntry,
  onRename,
  onDelete,
}: TreeNodeProps) {
  const [expanded, setExpanded] = useState(true)
  const isFolder = node.type === "folder"
  const isOpen = node.path === openPath
  const isMain = node.path === mainFile

  return (
    <div>
      <div
        className={cn(
          "group flex items-center gap-1 px-2 py-1 rounded-md cursor-pointer text-sm",
          "hover:bg-white/5",
          isOpen && "bg-blue-500/10 text-blue-300",
          isMain && "bg-emerald-500/10"
        )}
        style={{ paddingLeft: `${depth * 14 + 8}px` }}
        onClick={() => (isFolder ? setExpanded((e) => !e) : onOpenFile(node.path))}
      >
        {isFolder ? (
          <>
            {expanded ? (
              <ChevronDown className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />
            )}
            {expanded ? (
              <FolderOpen className="w-4 h-4 text-blue-400 flex-shrink-0" />
            ) : (
              <Folder className="w-4 h-4 text-blue-400 flex-shrink-0" />
            )}
          </>
        ) : (
          <>
            <span className="w-3.5 h-3.5 flex-shrink-0" />
            <File className="w-4 h-4 text-gray-400 flex-shrink-0" />
          </>
        )}

        <span className="truncate flex-1">{node.name}</span>

        {isMain && <Star className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />}

        {/* Acciones al hover */}
        <div className="opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto flex items-center gap-1 flex-shrink-0 transition-opacity duration-75">
          {isFolder && (
            <>
              <button
                title="Nuevo archivo"
                className="p-1 rounded hover:bg-white/10 text-gray-400 hover:text-white"
                onClick={(e) => {
                  e.stopPropagation()
                  onCreateEntry(node.path, "file")
                }}
              >
                <FilePlus className="w-3.5 h-3.5" />
              </button>
              <button
                title="Nueva carpeta"
                className="p-1 rounded hover:bg-white/10 text-gray-400 hover:text-white"
                onClick={(e) => {
                  e.stopPropagation()
                  onCreateEntry(node.path, "folder")
                }}
              >
                <FolderPlus className="w-3.5 h-3.5" />
              </button>
            </>
          )}
          {!isFolder && !isMain && (
            <button
              title="Marcar como principal"
              className="p-1 rounded hover:bg-white/10 text-gray-400 hover:text-emerald-400"
              onClick={(e) => {
                e.stopPropagation()
                onSetMain(node.path)
              }}
            >
              <Star className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            title="Renombrar"
            className="p-1 rounded hover:bg-white/10 text-gray-400 hover:text-white"
            onClick={(e) => {
              e.stopPropagation()
              onRename(node.path)
            }}
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button
            title="Eliminar"
            className="p-1 rounded hover:bg-white/10 text-gray-400 hover:text-red-400"
            onClick={(e) => {
              e.stopPropagation()
              onDelete(node.path)
            }}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {isFolder && expanded && (
        <div>
          {node.children.map((child) => (
            <TreeNode
              key={child.path}
              node={child}
              depth={depth + 1}
              openPath={openPath}
              mainFile={mainFile}
              onOpenFile={onOpenFile}
              onSetMain={onSetMain}
              onCreateEntry={onCreateEntry}
              onRename={onRename}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  )
}
