import { useState, useEffect, useCallback, useRef } from "react"
import { PDFViewer } from "@react-pdf/renderer"
import * as React from "react"
import * as Babel from "@babel/standalone"
import * as CoreComponents from "@/components/core"
import ErrorDocument from "./components/ErrorDocument"
import ErrorBoundary from "./components/ErrorBoundary"
import DefaultDocument from "./components/DefaultDocument"
import CompilingIndicator from "./components/CompilingIndicator"

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
    setComponent(() => () => (
      <ErrorDocument errorMessage={message} />
    ))
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

      // 🔹 Limpiar imports y exports
      let modifiedCode = sourceCode
        .replace(/(^|\n)\s*import[\s\S]*?from\s+['"][^'"]+['"];?/g, "\n")
        .replace(/(^|\n)\s*import\s+['"][^'"]+['"];?/g, "\n")
        .replace(/(^|\n)\s*export\s*\{[\s\S]*?\};?/g, "\n")
        .replace(/^\s*export\s+(?=const|let|var|function|class)/gm, "")

      // Manejo robusto de export default :
      // se distingue function / class / arrow(const|let|var) / identificador
      // suelto, para no depender de un único regex genérico y evitar
      // falsos positivos con `export default X;` vs declaraciones.
      const defaultExportMatch = sourceCode.match(/export\s+default\s+([A-Z]\w*)/)
      const defaultFuncMatch = sourceCode.match(/export\s+default\s+function\s+([A-Z]\w*)/)
      const defaultClassMatch = sourceCode.match(/export\s+default\s+class\s+([A-Z]\w*)/)
      const defaultArrowMatch = sourceCode.match(/export\s+default\s+(?:const|let|var)?\s*([A-Z]\w*)\s*=/)

      if (defaultFuncMatch) {
        modifiedCode = modifiedCode.replace(/export\s+default\s+function\s+([A-Z]\w*)/, "function $1")
        modifiedCode += `\nconst result = ${defaultFuncMatch[1]};`
      } else if (defaultClassMatch) {
        modifiedCode = modifiedCode.replace(/export\s+default\s+class\s+([A-Z]\w*)/, "class $1")
        modifiedCode += `\nconst result = ${defaultClassMatch[1]};`
      } else if (defaultArrowMatch) {
        modifiedCode = modifiedCode.replace(/export\s+default\s*/, "")
        modifiedCode += `\nconst result = ${defaultArrowMatch[1]};`
      } else if (defaultExportMatch) {
        modifiedCode = modifiedCode.replace(/export\s+default\s+([A-Z]\w*);?/, "const result = $1;")
      }

      if (!modifiedCode.includes("const result")) {
        setErrorComponent("No se encontró ningún componente exportado por defecto (se requiere `export default MiComponente;`).")
        return
      }

      // 🔹 Transformar TS/TSX + JSX (antes solo era "react"; ahora se agrega
      // el preset "typescript" con isTSX/allExtensions, igual que en
      // Playground 1, para poder aceptar código .ts/.tsx pegado directo).
      let transformedCode: string
      try {
        const babelResult = Babel.transform(modifiedCode, {
          presets: [
            ["typescript", { isTSX: true, allExtensions: true }],
            "react",
          ] as any,
          filename: "preview.tsx",
        })
        transformedCode = babelResult.code || ""
      } catch (err) {
        const msg =
          err instanceof Error
            ? err.message
            : "Error de sintaxis"
        setErrorComponent(`Error de sintaxis: ${msg}`)
        return
      }

      // 🔹 Extraer CoreComponents dinámicamente
      const componentNames = Object.keys(CoreComponents).filter(
        key =>
          typeof CoreComponents[
          key as keyof typeof CoreComponents
          ] === "function" ||
          typeof CoreComponents[
          key as keyof typeof CoreComponents
          ] === "object"
      )

      // 🔹 Crear módulo seguro (SIN redeclarar result)
      // Las etiquetas base (Document, Page, Text, View, Svg, etc.) ya vienen
      // incluidas dentro de CoreComponents (`core/index.tsx` las re-exporta
      // desde "@react-pdf/renderer"), así que hay una única fuente para todo
      // el barrel y no hace falta destructurar nada aparte desde `arguments[1]`.
      const moduleCode = `
        'use strict';

        const React = arguments[0];
        const CoreComponents = arguments[1];
        const { ${componentNames.join(", ")} } = CoreComponents;

        ${transformedCode}

        if (typeof result === "undefined") {
          throw new Error("No se encontró componente válido.");
        }

        return result;
      `

      let CustomComponent: React.ComponentType

      try {
        const evalFn = new Function(moduleCode)
        CustomComponent = evalFn(React, CoreComponents)
      } catch (err) {
        const msg =
          err instanceof Error
            ? err.message
            : "Error de ejecución"
        setErrorComponent(`Error de ejecución: ${msg}`)
        return
      }

      if (!CustomComponent || typeof CustomComponent !== "function") {
        setErrorComponent(
          "El código no devolvió un componente React válido."
        )
        return
      }

      setComponent(() => CustomComponent)
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : "Error desconocido"
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
      if (timeoutRef.current)
        clearTimeout(timeoutRef.current)
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