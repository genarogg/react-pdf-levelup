import { useState, useEffect, useCallback, useRef } from "react"
import * as ReactPdfRenderer from "@react-pdf/renderer"
import { PDFViewer } from "@react-pdf/renderer"
import * as React from "react"
import * as ReactPdfLevelupCore from "@react-pdf-levelup/core"
import * as ReactPdfLevelupQr from "@react-pdf-levelup/qr"
import * as ReactPdfLevelupChart from "@react-pdf-levelup/chart"
import ErrorDocument from "./components/ErrorDocument"
import ErrorBoundary from "./components/ErrorBoundary"
import DefaultDocument from "./components/DefaultDocument"
import CompilingIndicator from "./components/CompilingIndicator"
import {
  stripImportsAndExports,
  extractDefaultExportName,
  stripDefaultExport,
  transpileToJs,
  buildAndRunComponent,
  ALLOWED_NPM_SPECIFIERS,
  type NpmModuleRegistry,
} from "./utils/compilePlaygroundCode"

// Módulos npm reales (cargados por el bundle de la app vía `import` de
// verdad) que se ponen a disposición del código del usuario en el
// Playground. Las keys deben coincidir con ALLOWED_NPM_SPECIFIERS.
const NPM_MODULES: NpmModuleRegistry = {
  react: React,
  "@react-pdf/renderer": ReactPdfRenderer,
  "@react-pdf-levelup/core": ReactPdfLevelupCore,
  "@react-pdf-levelup/qr": ReactPdfLevelupQr,
  "@react-pdf-levelup/chart": ReactPdfLevelupChart,
}

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

      // 1) Limpiar imports y named exports, capturando aparte los imports
      //    de paquetes npm permitidos (no se pueden dejar como `import`
      //    suelto: `new Function` no soporta esa sintaxis).
      const { code: cleanedCode, npmImports, unresolvedSpecifiers } =
        stripImportsAndExports(sourceCode)

      if (unresolvedSpecifiers.length > 0) {
        setErrorComponent(
          `El paquete "${unresolvedSpecifiers[0]}" no está disponible en el Playground. Paquetes permitidos: ${ALLOWED_NPM_SPECIFIERS.join(", ")}.`
        )
        return
      }

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

      // 4) Construir el módulo y ejecutarlo, con los paquetes npm que el
      //    código haya importado conectados a los módulos reales.
      const result = buildAndRunComponent(transpiled.code, React, npmImports, NPM_MODULES)

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