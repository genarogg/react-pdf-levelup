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
  Svg,
  Defs,
  Rect,
  LinearGradient,
  Stop,
  G,
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
  studio?: boolean
  files?: { [key: string]: string }
  mainFile?: string | null
}

const PDFPreview = ({ code, studio, files = {}, mainFile }: PDFPreviewProps) => {
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

  // Helper to resolve relative imports
  const resolveImportPath = (fromPath: string, importPath: string) => {
    // Normalize import path
    let normalizedImport = importPath
    if (!normalizedImport.endsWith('.tsx') && !normalizedImport.endsWith('.ts') && !normalizedImport.endsWith('.jsx') && !normalizedImport.endsWith('.js')) {
      normalizedImport += '.tsx'
    }
    // Handle relative paths
    if (normalizedImport.startsWith('./') || normalizedImport.startsWith('../')) {
      const fromDir = fromPath.split('/').slice(0, -1).join('/')
      let parts = fromDir ? fromDir.split('/') : []
      const importParts = normalizedImport.split('/')
      for (const part of importParts) {
        if (part === '..') {
          if (parts.length > 0) parts.pop()
        } else if (part !== '.' && part) {
          parts.push(part)
        }
      }
      return parts.join('/')
    }
    return normalizedImport
  }

  // Process a file and resolve all imports
  const processFile = (filePath: string, processedFiles: Set<string> = new Set()): { [key: string]: string } => {
    if (processedFiles.has(filePath)) return {}

    const fileContent = files[filePath] || ''
    if (!fileContent) {
      return {}
    }

    processedFiles.add(filePath)
    const processed: { [key: string]: string } = { [filePath]: fileContent }

    // Find all imports
    const importRegex = /import\s+(\w+)\s+from\s+['"]([^'"]+)['"];?/g
    let match
    while ((match = importRegex.exec(fileContent)) !== null) {
      const [, , importPath] = match
      const resolvedPath = resolveImportPath(filePath, importPath)
      const childProcessed = processFile(resolvedPath, processedFiles)
      Object.assign(processed, childProcessed)
    }

    return processed
  }

  const compileCode = useCallback(async (sourceCode: string, currentFiles: { [key: string]: string } = {}, currentMainFile?: string | null) => {
    const combinedKey = JSON.stringify({ sourceCode, currentFiles, currentMainFile })
    if (combinedKey === lastCompiledRef.current) return

    lastCompiledRef.current = combinedKey
    setIsCompiling(true)

    try {
      let targetFile: string = ""
      let targetCode: string

      if (studio && currentMainFile && currentFiles[currentMainFile]) {
        targetFile = currentMainFile
        targetCode = currentFiles[currentMainFile]
      } else {
        targetCode = sourceCode
      }

      if (!targetCode?.trim()) {
        setComponent(() => DefaultDocument)
        setKey(prev => prev + 1)
        return
      }

      // Process all files and collect them
      let allFiles = studio ? processFile(targetFile) : {}

      // Build a modules object with all processed files
      const modules: { [key: string]: string } = {}

      for (const [filePath, fileContent] of Object.entries({ ...allFiles, [targetFile]: targetCode })) {
        let processedCode = fileContent

        // Clean imports but keep track of what's imported
        // First, replace imports with local variable references
        // Remove other exports except default
        processedCode = processedCode
          .replace(/(^|\n)\s*export\s*\{[\s\S]*?\};?/g, "\n")
          .replace(/^\s*export\s+(?=const|let|var|function|class)/gm, "")

        // Find and replace imports
        const importRegex = /import\s+(\w+)\s+from\s+['"]([^'"]+)['"];?/g
        let modifiedCodeForRegex = processedCode
        let resultCode = ''
        let lastIndex = 0

        let importMatch
        while ((importMatch = importRegex.exec(modifiedCodeForRegex)) !== null) {
          const [fullMatch, importName, importPath] = importMatch
          const resolvedPath = resolveImportPath(filePath, importPath)
          
          // Check if it's a @react-pdf/renderer import or local
          if (importPath.startsWith('@react-pdf/')) {
            // Keep the React PDF imports, we'll handle them at the module level
            resultCode += modifiedCodeForRegex.slice(lastIndex, importMatch.index)
            lastIndex = importMatch.index + fullMatch.length
          } else {
            // Replace local imports with our virtual module reference
            resultCode += modifiedCodeForRegex.slice(lastIndex, importMatch.index)
            resultCode += `const ${importName} = __modules['${resolvedPath}']?.default;\n`
            lastIndex = importMatch.index + fullMatch.length
          }
        }
        resultCode += modifiedCodeForRegex.slice(lastIndex)
        processedCode = resultCode

        // Now extract and wrap the export default
        const defaultFuncMatch = processedCode.match(/export\s+default\s+function\s+([A-Z]\w*)/)
        const defaultClassMatch = processedCode.match(/export\s+default\s+class\s+([A-Z]\w*)/)
        const defaultArrowMatch = processedCode.match(/export\s+default\s+(?:const|let|var)?\s*([A-Z]\w*)\s*=/)
        const defaultExportMatch = processedCode.match(/export\s+default\s+([A-Z]\w*)/)

        let wrappedCode = processedCode
        if (defaultFuncMatch) {
          wrappedCode = wrappedCode.replace(/export\s+default\s+function\s+([A-Z]\w*)/, "function $1")
          wrappedCode += `\n__modules['${filePath}'] = { default: ${defaultFuncMatch[1]} };`
        } else if (defaultClassMatch) {
          wrappedCode = wrappedCode.replace(/export\s+default\s+class\s+([A-Z]\w*)/, "class $1")
          wrappedCode += `\n__modules['${filePath}'] = { default: ${defaultClassMatch[1]} };`
        } else if (defaultArrowMatch) {
          wrappedCode = wrappedCode.replace(/export\s+default\s*/, "")
          wrappedCode += `\n__modules['${filePath}'] = { default: ${defaultArrowMatch[1]} };`
        } else if (defaultExportMatch) {
          wrappedCode = wrappedCode.replace(/export\s+default\s+([A-Z]\w*);?/, "__modules['" + filePath + "'] = { default: $1 };")
        }

        modules[filePath] = wrappedCode
      }

      // Now handle both multi-file and single-file cases
      let CustomComponent: React.ComponentType

      if (studio && currentMainFile) {
        // Multi-file studio mode
        // 🔹 Transformar JSX de todos los módulos
        const transformedModules: { [key: string]: string } = {}
        try {
          for (const [filePath, fileContent] of Object.entries(modules)) {
            const babelResult = Babel.transform(fileContent, {
              presets: ["react"],
              filename: filePath,
            })
            transformedModules[filePath] = babelResult.code || ""
          }
        } catch (err) {
          const msg = err instanceof Error ? err.message : "Error de sintaxis"
          setErrorComponent(`Error de sintaxis: ${msg}`)
          return
        }

        // 🔹 Extraer CoreComponents dinámicamente
        const componentNames = Object.keys(CoreComponents).filter(
          key => typeof CoreComponents[key as keyof typeof CoreComponents] === "function" || typeof CoreComponents[key as keyof typeof CoreComponents] === "object"
        )
        const filteredNames = componentNames.filter(name => !["Font", "Document", "Page", "Text", "View", "StyleSheet", "Image", "Link"].includes(name))

        // 🔹 Build full module code with virtual modules
        let allModuleCode = ""
        for (const [, transformed] of Object.entries(transformedModules)) {
          allModuleCode += transformed + "\n"
        }

        const moduleCode = `
          'use strict';
          const React = arguments[0];
          const { Document, Page, Text, View, StyleSheet, Image, Link, Font, Svg, Defs, Rect, LinearGradient, Stop, G } = arguments[1];
          const CoreComponents = arguments[2];
          const { ${filteredNames.join(", ")} } = CoreComponents;
          
          // Initialize virtual modules
          const __modules = {};
          
          ${allModuleCode}
          
          // Return the main module's default export
          return __modules['${targetFile}']?.default;
        `

        try {
          const evalFn = new Function(moduleCode)
          CustomComponent = evalFn(
            React,
            { Document, Page, Text, View, StyleSheet, Image, Link, Font, Svg, Defs, Rect, LinearGradient, Stop, G },
            CoreComponents
          )
        } catch (err) {
          const msg = err instanceof Error ? err.message : "Error de ejecución"
          setErrorComponent(`Error de ejecución: ${msg}`)
          return
        }
      } else {
        // Single-file mode (original behavior)
        let modifiedCode = targetCode
          .replace(/(^|\n)\s*import[\s\S]*?from\s+['"][^'"]+['"];?/g, "\n")
          .replace(/(^|\n)\s*import\s+['"][^'"]+['"];?/g, "\n")
          .replace(/(^|\n)\s*export\s*\{[\s\S]*?\};?/g, "\n")
          .replace(/^\s*export\s+(?=const|let|var|function|class)/gm, "")

        const defaultExportMatch = targetCode.match(/export\s+default\s+([A-Z]\w*)/)
        const defaultFuncMatch = targetCode.match(/export\s+default\s+function\s+([A-Z]\w*)/)
        const defaultClassMatch = targetCode.match(/export\s+default\s+class\s+([A-Z]\w*)/)
        const defaultArrowMatch = targetCode.match(/export\s+default\s+(?:const|let|var)?\s*([A-Z]\w*)\s*=/)

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
          const componentMatch = modifiedCode.match(/const\s+([A-Z][a-zA-Z0-9]*)\s*=/)
          if (componentMatch) {
            modifiedCode += `\nconst result = ${componentMatch[1]};`
          } else {
            setErrorComponent("No se encontró ningún componente exportable.")
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
          const msg = err instanceof Error ? err.message : "Error de sintaxis"
          setErrorComponent(`Error de sintaxis: ${msg}`)
          return
        }

        // 🔹 Extraer CoreComponents dinámicamente
        const componentNames = Object.keys(CoreComponents).filter(
          key => typeof CoreComponents[key as keyof typeof CoreComponents] === "function" || typeof CoreComponents[key as keyof typeof CoreComponents] === "object"
        )
        const filteredNames = componentNames.filter(name => !["Font", "Document", "Page", "Text", "View", "StyleSheet", "Image", "Link"].includes(name))

        // 🔹 Crear módulo seguro (SIN redeclarar result)
        const moduleCode = `
          'use strict';
          const React = arguments[0];
          const { Document, Page, Text, View, StyleSheet, Image, Link, Font, Svg, Defs, Rect, LinearGradient, Stop, G } = arguments[1];
          const CoreComponents = arguments[2];
          const { ${filteredNames.join(", ")} } = CoreComponents;
          ${transformedCode}
          if (typeof result === "undefined") {
            throw new Error("No se encontró componente válido.");
          }
          return result;
        `

        try {
          const evalFn = new Function(moduleCode)
          CustomComponent = evalFn(
            React,
            { Document, Page, Text, View, StyleSheet, Image, Link, Font, Svg, Defs, Rect, LinearGradient, Stop, G },
            CoreComponents
          )
        } catch (err) {
          const msg = err instanceof Error ? err.message : "Error de ejecución"
          setErrorComponent(`Error de ejecución: ${msg}`)
          return
        }
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
  }, [studio, resolveImportPath, processFile])

  useEffect(() => {
    if (isFirstRenderRef.current) {
      isFirstRenderRef.current = false
      if (code?.trim()) compileCode(code, files, mainFile)
      return
    }

    if (timeoutRef.current) clearTimeout(timeoutRef.current)

    timeoutRef.current = setTimeout(() => {
      compileCode(code, files, mainFile)
    }, 300)

    return () => {
      if (timeoutRef.current)
        clearTimeout(timeoutRef.current)
    }
  }, [code, compileCode, files, mainFile])

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