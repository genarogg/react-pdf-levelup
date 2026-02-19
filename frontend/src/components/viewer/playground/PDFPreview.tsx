import { useState, useEffect, useCallback, useRef } from "react"
import {
  PDFViewer,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  Image,
  Link,
} from "@react-pdf/renderer"
import * as React from "react"
import * as Babel from "@babel/standalone"
import * as CoreComponents from "@/components/core"
import ErrorDocument from "./ErrorDocument"

const DefaultDocument = () => (
  <Document>
    <Page size="A4" style={{ padding: 30, backgroundColor: "#ffffff" }}>
      <View style={{ padding: 10 }}>
        <Text style={{ fontSize: 20, marginBottom: 10 }}>
          Esperando código...
        </Text>
        <Text>Escribe tu código para generar el PDF.</Text>
      </View>
    </Page>
  </Document>
)

interface PDFPreviewProps {
  code: string
}

const PDFPreview = ({ code }: PDFPreviewProps) => {
  const [Component, setComponent] =
    useState<React.ComponentType>(() => DefaultDocument)

  const [isCompiling, setIsCompiling] = useState(false)
  const [key, setKey] = useState(0)

  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastCompiledRef = useRef("")
  const isFirstRenderRef = useRef(true)

  const setErrorComponent = (message: string) => {
    setComponent(() => () => (
      <ErrorDocument errorMessage={message} />
    ))
    setKey(prev => prev + 1)
  }

  const compileCode = useCallback(async (sourceCode: string) => {
    if (sourceCode === lastCompiledRef.current) return

    lastCompiledRef.current = sourceCode
    setIsCompiling(true)

    try {
      if (!sourceCode?.trim()) {
        setComponent(() => DefaultDocument)
        setKey(prev => prev + 1)
        return
      }

      // 🔹 Limpiar imports y exports
      let modifiedCode = sourceCode
        .replace(/(^|\n)\s*import[\s\S]*?from\s+['"][^'"]+['"];?/g, "\n")
        .replace(/(^|\n)\s*import\s+['"][^'"]+['"];?/g, "\n")
        .replace(/(^|\n)\s*export\s*\{[\s\S]*?\};?/g, "\n")
        .replace(/^\s*export\s+(?=const|let|var|function|class)/gm, "")
        .replace(
          /(^|\n)\s*export\s+default\s+([^;]+);?/g,
          "\nconst result = $2;"
        )

      const defaultFuncMatch =
        sourceCode.match(/export\s+default\s+function\s+([A-Z]\w*)/)
      if (defaultFuncMatch) {
        modifiedCode =
          modifiedCode.replace(
            /export\s+default\s+function\s+([A-Z]\w*)/,
            "function $1"
          ) + `\nconst result = ${defaultFuncMatch[1]};`
      }

      const defaultClassMatch =
        sourceCode.match(/export\s+default\s+class\s+([A-Z]\w*)/)
      if (defaultClassMatch) {
        modifiedCode =
          modifiedCode.replace(
            /export\s+default\s+class\s+([A-Z]\w*)/,
            "class $1"
          ) + `\nconst result = ${defaultClassMatch[1]};`
      }

      if (!modifiedCode.includes("const result")) {
        const componentMatch =
          modifiedCode.match(/const\s+([A-Z][a-zA-Z0-9]*)\s*=/)
        if (componentMatch) {
          modifiedCode += `\nconst result = ${componentMatch[1]};`
        } else {
          setErrorComponent(
            "No se encontró ningún componente exportable."
          )
          return
        }
      }

      // 🔹 Transformar JSX
      let transformedCode: string
      try {
        const babelResult = Babel.transform(modifiedCode, {
          presets: ["react"],
          filename: "preview.jsx",
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

      const filteredNames = componentNames.filter(
        name =>
          ![
            "Font",
            "Document",
            "Page",
            "Text",
            "View",
            "StyleSheet",
            "Image",
            "Link",
          ].includes(name)
      )

      // 🔹 Crear módulo seguro (SIN redeclarar result)
      const moduleCode = `
        'use strict';

        const React = arguments[0];
        const { Document, Page, Text, View, StyleSheet, Image, Link, Font } = arguments[1];
        const CoreComponents = arguments[2];
        const { ${filteredNames.join(", ")} } = CoreComponents;

        ${transformedCode}

        if (typeof result === "undefined") {
          throw new Error("No se encontró componente válido.");
        }

        return result;
      `

      let CustomComponent: React.ComponentType

      try {
        const evalFn = new Function(moduleCode)
        CustomComponent = evalFn(
          React,
          { Document, Page, Text, View, StyleSheet, Image, Link, Font },
          CoreComponents
        )
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
      setKey(prev => prev + 1)
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
    <div style={{ width: "100%", height: "100%" }}>
      {isCompiling && (
        <div
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            background: "#fff",
            padding: "5px 10px",
            borderRadius: 4,
            fontSize: 12,
            boxShadow:
              "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          Compilando...
        </div>
      )}

      <ErrorBoundary key={key}>
        <PDFViewer
          key={key}
          width="100%"
          height="100%"
          showToolbar
        >
          <Component />
        </PDFViewer>
      </ErrorBoundary>
    </div>
  )
}

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: any) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidUpdate(prevProps: any) {
    if (
      prevProps.children !== this.props.children &&
      this.state.hasError
    ) {
      this.setState({ hasError: false })
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            padding: 40,
            textAlign: "center",
            background: "#fff5f5",
          }}
        >
          <h3 style={{ color: "#ff0000" }}>
            Error al renderizar el PDF
          </h3>
        </div>
      )
    }
    return this.props.children
  }
}

export default PDFPreview