import { useState, useEffect, useCallback, useRef } from "react"
import * as ReactPdfRenderer from "@react-pdf/renderer"
import { PDFViewer } from "@react-pdf/renderer"
import * as React from "react"
import * as ReactPdfLevelupCore from "@react-pdf-levelup/core"
import * as ReactPdfLevelupQr from "@react-pdf-levelup/qr"
import * as ReactPdfLevelupChart from "@react-pdf-levelup/chart"
import ErrorDocument from "@/components/playground/components/ErrorDocument"
import ErrorBoundary from "@/components/playground/components/ErrorBoundary"
import DefaultDocument from "@/components/playground/components/DefaultDocument"
import CompilingIndicator from "@/components/playground/components/CompilingIndicator"
import { buildModuleGraph } from "../compiler/moduleGraph"
import { compileWorkspace, type NpmModuleRegistry } from "../compiler/compileWorkspace"
import { useStudio } from "../StudioContext"

// Módulos npm reales (cargados por el bundle de la app vía `import` de
// verdad) que se ponen a disposición del código del usuario dentro del
// Studio. Las keys deben coincidir con ALLOWED_NPM_SPECIFIERS en
// compileWorkspace.ts.
const NPM_MODULES: NpmModuleRegistry = {
  react: React,
  "@react-pdf/renderer": ReactPdfRenderer,
  "@react-pdf-levelup/core": ReactPdfLevelupCore,
  "@react-pdf-levelup/qr": ReactPdfLevelupQr,
  "@react-pdf-levelup/chart": ReactPdfLevelupChart,
}

export function StudioPDFPreview() {
  const { mainFile, saveVersion, setCompileStatus } = useStudio()

  const [Component, setComponent] = useState<React.ComponentType>(() => DefaultDocument)
  const [isCompiling, setIsCompiling] = useState(false)

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  // Evita recompilar dos veces con la misma combinación (mainFile, saveVersion)
  // — por ejemplo si el componente se remonta sin que nada relevante cambió.
  const lastCompiledKeyRef = useRef("")
  const isFirstRunRef = useRef(true)

  const setErrorComponent = useCallback((message: string) => {
    setComponent(() => () => <ErrorDocument errorMessage={message} />)
  }, [])

  const recompile = useCallback(async () => {
    if (!mainFile) {
      setComponent(() => DefaultDocument)
      setCompileStatus("idle")
      return
    }

    setIsCompiling(true)
    setCompileStatus("compiling")

    try {
      // 1) Grafo de módulos: parte del mainFile y sigue todos sus imports
      //    relativos, recursivamente, leyendo del backend (GET /api/file).
      const graph = await buildModuleGraph(mainFile)

      // 2) Compilar el grafo completo a un único componente ejecutable.
      const result = compileWorkspace(graph, React, NPM_MODULES)

      if (!result.ok) {
        setErrorComponent(result.error)
        setCompileStatus("error")
        return
      }

      setComponent(() => result.component)
      setCompileStatus("ok")
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error desconocido al compilar el workspace"
      setErrorComponent(msg)
      setCompileStatus("error")
    } finally {
      setIsCompiling(false)
    }
  }, [mainFile, setErrorComponent, setCompileStatus])

  useEffect(() => {
    const key = `${mainFile ?? ""}:${saveVersion}`
    if (key === lastCompiledKeyRef.current) return
    lastCompiledKeyRef.current = key

    // Primera vez: recompila inmediato. Después: mismo debounce ~300ms que
    // usaba el Playground, para no recompilar en cada guardado en cascada
    // si el usuario está escribiendo rápido en varios archivos.
    if (isFirstRunRef.current) {
      isFirstRunRef.current = false
      recompile()
      return
    }

    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => {
      recompile()
    }, 300)

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [mainFile, saveVersion, recompile])

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      {isCompiling && <CompilingIndicator />}

      <ErrorBoundary>
        <PDFViewer width="100%" height="100%" showToolbar>
          <Component />
        </PDFViewer>
      </ErrorBoundary>
    </div>
  )
}
