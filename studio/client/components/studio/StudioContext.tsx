import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import * as studioApi from "./api/studioApi"
import type { Node } from "./api/studioApi"

export interface OpenFile {
  path: string
  content: string
  language: string
}

export type CompileStatus = "idle" | "compiling" | "ok" | "error"

// Contrato tal cual lo pide la spec (§5.8): estado + acciones combinados en
// un único value de contexto. `openFile` cumple doble rol (dato Y acción,
// igual que en la interfaz original) resuelto acá con un state interno de
// nombre distinto para evitar la colisión de identificadores en JS.
export interface StudioContextValue {
  tree: Node[]
  mainFile: string | null
  openFile: OpenFile | null
  dirty: boolean
  compileStatus: CompileStatus
  // No está en la interfaz original de la spec, pero es la señal de "algo
  // se guardó" que la nota bajo StudioActions exige para que
  // StudioPDFPreview invalide su grafo cacheado aunque lo guardado no haya
  // sido el mainFile.
  saveVersion: number

  refreshTree: () => Promise<void>
  openFileByPath: (path: string) => Promise<void>
  saveOpenFile: (content: string) => Promise<void>
  setMain: (path: string) => Promise<void>
  createEntry: (path: string, type: "file" | "folder") => Promise<void>
  rename: (path: string, newPath: string) => Promise<void>
  remove: (path: string) => Promise<void>
  setCompileStatus: (status: CompileStatus) => void
}

const StudioContext = createContext<StudioContextValue | null>(null)

export function useStudio(): StudioContextValue {
  const ctx = useContext(StudioContext)
  if (!ctx) throw new Error("useStudio debe usarse dentro de <StudioProvider>")
  return ctx
}

export function StudioProvider({ children }: { children: React.ReactNode }) {
  const [tree, setTree] = useState<Node[]>([])
  const [mainFile, setMainFileState] = useState<string | null>(null)
  const [openFile, setOpenFile] = useState<OpenFile | null>(null)
  const [dirty, setDirty] = useState(false)
  const [compileStatus, setCompileStatus] = useState<CompileStatus>("idle")
  const [saveVersion, setSaveVersion] = useState(0)

  const refreshTree = useCallback(async () => {
    const { mainFile: currentMain, tree: currentTree } = await studioApi.fetchTree()
    setTree(currentTree)
    setMainFileState(currentMain)
  }, [])

  const openFileByPath = useCallback(async (path: string) => {
    const file = await studioApi.fetchFile(path)
    if (!file) return
    setOpenFile(file)
    setDirty(false)
  }, [])

  const saveOpenFile = useCallback(
    async (content: string) => {
      if (!openFile) return
      await studioApi.saveFile(openFile.path, content)
      setOpenFile((prev) => (prev ? { ...prev, content } : prev))
      setDirty(false)
      // Cualquier archivo pudo ser importado por el mainFile actual (o
      // transitivamente); StudioPDFPreview debe reconstruir su grafo y
      // recompilar sin importar cuál archivo se guardó.
      setSaveVersion((v) => v + 1)
    },
    [openFile]
  )

  const setMain = useCallback(async (path: string) => {
    const result = await studioApi.setMainFile(path)
    setMainFileState(result.mainFile)
  }, [])

  const createEntry = useCallback(
    async (path: string, type: "file" | "folder") => {
      await studioApi.createEntry(path, type)
      await refreshTree()
    },
    [refreshTree]
  )

  const rename = useCallback(
    async (path: string, newPath: string) => {
      const result = await studioApi.renameEntry(path, newPath)
      await refreshTree()
      setOpenFile((prev) => (prev && prev.path === path ? { ...prev, path: result.path } : prev))
      setMainFileState((prev) => (prev === path ? result.path : prev))
    },
    [refreshTree]
  )

  const remove = useCallback(
    async (path: string) => {
      await studioApi.deleteEntry(path)
      await refreshTree()
      setOpenFile((prev) => (prev && prev.path === path ? null : prev))
      setMainFileState((prev) => (prev === path ? null : prev))
    },
    [refreshTree]
  )

  // Montaje inicial: refrescar árbol + abrir el mainFile actual (§5.9.1).
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const { mainFile: currentMain, tree: currentTree } = await studioApi.fetchTree()
      if (cancelled) return
      setTree(currentTree)
      setMainFileState(currentMain)
      if (currentMain) {
        const file = await studioApi.fetchFile(currentMain)
        if (!cancelled && file) setOpenFile(file)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const value = useMemo<StudioContextValue>(
    () => ({
      tree,
      mainFile,
      openFile,
      dirty,
      compileStatus,
      saveVersion,
      refreshTree,
      openFileByPath,
      saveOpenFile,
      setMain,
      createEntry,
      rename,
      remove,
      setCompileStatus,
    }),
    [
      tree,
      mainFile,
      openFile,
      dirty,
      compileStatus,
      saveVersion,
      refreshTree,
      openFileByPath,
      saveOpenFile,
      setMain,
      createEntry,
      rename,
      remove,
    ]
  )

  return <StudioContext.Provider value={value}>{children}</StudioContext.Provider>
}
