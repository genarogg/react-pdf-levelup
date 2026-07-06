import { useState, useEffect, useCallback, useRef } from "react"
import { PDFViewer } from "@react-pdf/renderer"
import * as React from "react"
import * as CoreComponents from "@react-pdf-levelup/core"
import ErrorDocument from "./components/ErrorDocument"
import ErrorBoundary from "./components/ErrorBoundary"
import DefaultDocument from "./components/DefaultDocument"
import CompilingIndicator from "./components/CompilingIndicator"
import {
  stripImportsAndExports,
  extractDefaultExportName,
  stripDefaultExport,
  transpileToJs,
  getUsableComponentNames,
  buildAndRunComponent,
} from "./utils/compilePlaygroundCode"

interface PDFPreviewProps {
  code: string
}

const PDFPreview = ({ code }: PDFPreviewProps) => {
  const [Component, setComponent] =
    useState<React.ComponentType>(() => DefaultDocument)

  const [isCompiling, setIsCompiling] = useState(false)

  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastCompiledRef = useRef("")
  const isFirstRenderRef = useRef(true)

  const setErrorComponent = (message: string) => {
    setComponent(() => () => <ErrorDocument errorMessage={message} />)
  }

  const compileCode = useCallback(async (sourceCode: string) => {
    if (sourceCode === lastCompiledRef.current) return

    lastCompiledRef.current = sourceCode
    setIsCompiling(true)

    try {
      if (!sourceCode?.trim()) {
        setComponent(() => DefaultDocument)
        return
      }

      // 1) Limpiar imports y named exports
      const cleanedCode = stripImportsAndExports(sourceCode)

      // 2) Detectar y normalizar el export default (sobre el código ORIGINAL,
      //    porque las regexes de detección dependen de las keywords
      //    function/class/const que stripImportsAndExports podría afectar)
      const defaultExportInfo = extractDefaultExportName(sourceCode)

      if (!defaultExportInfo) {
        setErrorComponent(
          "No se encontró ningún componente exportado por defecto (se requiere `export default MiComponente;`)."
        )
        return
      }

      const modifiedCode = stripDefaultExport(cleanedCode, defaultExportInfo)

      // 3) Transpilar TS/TSX + JSX
      const transpiled = transpileToJs(modifiedCode)
      if (!transpiled.ok) {
        setErrorComponent(transpiled.error)
        return
      }

      // 4) Resolver qué nombres de CoreComponents están disponibles
      const componentNames = getUsableComponentNames(CoreComponents)

      // 5) Construir el módulo y ejecutarlo
      const result = buildAndRunComponent(
        transpiled.code,
        componentNames,
        React,
        CoreComponents
      )

      if (!result.ok) {
        setErrorComponent(result.error)
        return
      }

      setComponent(() => result.component)
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error desconocido"
      setErrorComponent(msg)
    } finally {
      setIsCompiling(false)
    }
  }, [])

  useEffect(() => {
    if (isFirstRenderRef.current) {
      isFirstRenderRef.current = false
      if (code?.trim()) compileCode(code)
      return
    }

    if (timeoutRef.current) clearTimeout(timeoutRef.current)

    timeoutRef.current = setTimeout(() => {
      compileCode(code)
    }, 300)

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [code, compileCode])

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

export default PDFPreview