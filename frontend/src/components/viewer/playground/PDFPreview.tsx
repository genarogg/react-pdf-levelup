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

// Registro de paquetes disponibles para importar explícitamente en modo Studio.
// IMPORTANTE: nada de esto se inyecta automáticamente en el scope de ningún
// archivo. Cada entrada solo queda accesible en un archivo del usuario si ese
// archivo escribe su propio `import ... from "<specifier>"`. Si un archivo no
// importa "@react-pdf/renderer", por ejemplo, Document/Page/Text/etc. no van
// a existir en su scope, igual que en un proyecto real.
const STUDIO_PACKAGES: { [specifier: string]: Record<string, any> } = {
  "react": { ...(React as any), default: React },
  "@react-pdf/renderer": {
    Document, Page, Text, View, StyleSheet, Font, Image, Link,
    Svg, Defs, Rect, LinearGradient, Stop, G,
  },
  "@/components/core": { ...(CoreComponents as any) },
}

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

  // Resuelve un import a la clave que se usará en __modules.
  // - Rutas relativas ("./x", "../x"): se resuelven contra el archivo actual
  //   y se normalizan a un path de archivo dentro de `files`.
  // - Cualquier otro specifier ("react", "@react-pdf/renderer",
  //   "@/components/core", etc.): se devuelve TAL CUAL, sin modificar. Es la
  //   clave literal con la que se busca en STUDIO_PACKAGES/__modules; si el
  //   paquete no está registrado ahí, el import simplemente resolverá a
  //   undefined (como cualquier módulo no instalado).
  const resolveImportPath = (fromPath: string, importPath: string) => {
    if (!importPath.startsWith('./') && !importPath.startsWith('../')) {
      return importPath
    }

    let normalizedImport = importPath
    if (!normalizedImport.endsWith('.tsx') && !normalizedImport.endsWith('.ts') && !normalizedImport.endsWith('.jsx') && !normalizedImport.endsWith('.js')) {
      normalizedImport += '.tsx'
    }

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

  // Parsea la cláusula de un import (lo que va entre `import` y `from`):
  // soporta default (`X`), named (`{ A, B as C }`), namespace (`* as X`)
  // y combinaciones (`X, { A, B }`).
  type ParsedImport = {
    defaultName?: string
    namespaceName?: string
    named: { imported: string; local: string }[]
  }

  const parseImportClause = (clauseRaw: string): ParsedImport => {
    let clause = clauseRaw.trim()
    const named: { imported: string; local: string }[] = []
    let namespaceName: string | undefined
    let defaultName: string | undefined

    const namedMatch = clause.match(/\{([\s\S]*)\}/)
    if (namedMatch) {
      namedMatch[1]
        .split(',')
        .map(s => s.trim())
        .filter(Boolean)
        .forEach(pair => {
          const asMatch = pair.match(/^([\w$]+)\s+as\s+([\w$]+)$/)
          if (asMatch) {
            named.push({ imported: asMatch[1], local: asMatch[2] })
          } else {
            named.push({ imported: pair, local: pair })
          }
        })
      clause = clause.replace(/\{[\s\S]*\}/, '').trim()
    }

    const nsMatch = clause.match(/\*\s+as\s+([\w$]+)/)
    if (nsMatch) {
      namespaceName = nsMatch[1]
      clause = clause.replace(/\*\s+as\s+[\w$]+/, '').trim()
    }

    clause = clause.replace(/,/g, '').trim()
    if (clause) defaultName = clause

    return { defaultName, namespaceName, named }
  }

  // Genera las declaraciones locales que reemplazan un `import` una vez
  // resuelto contra __modules. Si el archivo no importa algo, esas
  // declaraciones simplemente no se generan (nada queda "flotando" en scope).
  const buildImportBindings = (resolvedPath: string, parsed: ParsedImport): string => {
    const key = JSON.stringify(resolvedPath)
    const lines: string[] = []
    if (parsed.defaultName) {
      lines.push(`const ${parsed.defaultName} = __modules[${key}]?.default;`)
    }
    if (parsed.namespaceName) {
      lines.push(`const ${parsed.namespaceName} = __modules[${key}] || {};`)
    }
    if (parsed.named.length > 0) {
      const destructure = parsed.named
        .map(({ imported, local }) => (imported === local ? imported : `${imported}: ${local}`))
        .join(', ')
      lines.push(`const { ${destructure} } = __modules[${key}] || {};`)
    }
    return lines.join('\n')
  }

  // Coincide con cualquier import ES estándar con `from`: default, named,
  // namespace o combinaciones. No soporta imports de solo efecto
  // (`import "algo"`, sin bindings) porque no aportan nada al scope.
  const IMPORT_REGEX = /import\s+(.+?)\s+from\s+['"]([^'"]+)['"];?/gs

  // Process a file and resolve all imports
  const processFile = (filePath: string, processedFiles: Set<string> = new Set()): { [key: string]: string } => {
    if (processedFiles.has(filePath)) return {}

    const fileContent = files[filePath] || ''
    if (!fileContent) {
      return {}
    }

    processedFiles.add(filePath)
    const processed: { [key: string]: string } = { [filePath]: fileContent }

    // Solo seguimos imports RELATIVOS (archivos locales del proyecto, los
    // únicos que existen dentro de `files`). Los imports de paquetes
    // ("react", "@react-pdf/renderer", "@/components/core", etc.) no se
    // resuelven aquí, se resuelven en compileCode contra STUDIO_PACKAGES.
    const localImportRegex = /import\s+.+?\s+from\s+['"](\.\.?\/[^'"]+)['"];?/gs
    let match
    while ((match = localImportRegex.exec(fileContent)) !== null) {
      const importPath = match[1]
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
        const namedExportNames: string[] = []

        // `export { A, B as C }` -> capturamos los nombres re-exportados
        // (quedan como propiedades nombradas en __modules) y quitamos la
        // sentencia; los identificadores siguen existiendo como
        // declaraciones locales normales.
        processedCode = processedCode.replace(
          /(^|\n)\s*export\s*\{([\s\S]*?)\}\s*;?/g,
          (_m, pre, inner) => {
            inner
              .split(',')
              .map((s: string) => s.trim())
              .filter(Boolean)
              .forEach((pair: string) => {
                const asMatch = pair.match(/^([\w$]+)\s+as\s+([\w$]+)$/)
                namedExportNames.push(asMatch ? asMatch[2] : pair)
              })
            return pre
          }
        )

        // `export const/let/var/function/class NAME` -> quitamos el
        // `export` (queda como declaración local normal) y registramos
        // NAME como export nombrado en __modules.
        processedCode = processedCode.replace(
          /^\s*export\s+(const|let|var|function|class)\s+([\w$]+)/gm,
          (_m, kind, name) => {
            namedExportNames.push(name)
            return `${kind} ${name}`
          }
        )

        // Resolver cada `import ... from "..."` contra __modules. No se
        // asume NADA sobre lo que hay disponible: si el archivo no importa
        // "@react-pdf/renderer" o "@/components/core", esos nombres
        // simplemente no existirán en su scope.
        let resultCode = ''
        let lastIndex = 0
        IMPORT_REGEX.lastIndex = 0
        let importMatch: RegExpExecArray | null
        while ((importMatch = IMPORT_REGEX.exec(processedCode)) !== null) {
          const [fullMatch, clause, importPath] = importMatch
          const resolvedPath = resolveImportPath(filePath, importPath)
          const parsed = parseImportClause(clause)

          resultCode += processedCode.slice(lastIndex, importMatch.index)
          resultCode += buildImportBindings(resolvedPath, parsed) + '\n'
          lastIndex = importMatch.index + fullMatch.length
        }
        resultCode += processedCode.slice(lastIndex)
        processedCode = resultCode

        // Extraer y envolver el export default (si existe)
        const defaultFuncMatch = processedCode.match(/export\s+default\s+function\s+([A-Z]\w*)/)
        const defaultClassMatch = processedCode.match(/export\s+default\s+class\s+([A-Z]\w*)/)
        const defaultArrowMatch = processedCode.match(/export\s+default\s+(?:const|let|var)?\s*([A-Z]\w*)\s*=/)
        const defaultExportMatch = processedCode.match(/export\s+default\s+([A-Z]\w*)/)

        let wrappedCode = processedCode
        let defaultName: string | null = null

        if (defaultFuncMatch) {
          wrappedCode = wrappedCode.replace(/export\s+default\s+function\s+([A-Z]\w*)/, "function $1")
          defaultName = defaultFuncMatch[1]
        } else if (defaultClassMatch) {
          wrappedCode = wrappedCode.replace(/export\s+default\s+class\s+([A-Z]\w*)/, "class $1")
          defaultName = defaultClassMatch[1]
        } else if (defaultArrowMatch) {
          wrappedCode = wrappedCode.replace(/export\s+default\s*/, "")
          defaultName = defaultArrowMatch[1]
        } else if (defaultExportMatch) {
          wrappedCode = wrappedCode.replace(/export\s+default\s+([A-Z]\w*);?/, "")
          defaultName = defaultExportMatch[1]
        }

        const moduleProps: string[] = []
        if (defaultName) moduleProps.push(`default: ${defaultName}`)
        namedExportNames.forEach(name => moduleProps.push(name))

        wrappedCode += `\n__modules[${JSON.stringify(filePath)}] = { ${moduleProps.join(', ')} };`

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

        // 🔹 Build full module code with virtual modules
        let allModuleCode = ""
        for (const [, transformed] of Object.entries(transformedModules)) {
          allModuleCode += transformed + "\n"
        }

        // Nada se inyecta en el scope global de ejecución: __modules arranca
        // pre-cargado únicamente con los PAQUETES (react, @react-pdf/renderer,
        // @/components/core), como si fueran node_modules instalados. Que un
        // archivo pueda usar Document/Page/Table/QR/etc. depende exclusivamente
        // de que ese archivo los haya importado con su propio `import`.
        const moduleCode = `
          'use strict';
          const React = arguments[0];
          const __packages = arguments[1];

          // Módulos virtuales disponibles para resolver imports.
          const __modules = { ...__packages };

          ${allModuleCode}

          // Retorna el export default del archivo marcado como principal (⭐)
          return __modules['${targetFile}']?.default;
        `

        try {
          const evalFn = new Function(moduleCode)
          CustomComponent = evalFn(React, STUDIO_PACKAGES)
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

interface ErrorBoundaryProps {
  children: React.ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  errorMessage: string
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, errorMessage: "" }
  }

  static getDerivedStateFromError(error: unknown): Partial<ErrorBoundaryState> {
    const message = error instanceof Error ? error.message : "Error desconocido"
    return { hasError: true, errorMessage: message }
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    if (
      prevProps.children !== this.props.children &&
      this.state.hasError
    ) {
      this.setState({ hasError: false, errorMessage: "" })
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
          <p style={{ color: "#7f1d1d", fontSize: 13, marginTop: 8 }}>
            {this.state.errorMessage}
          </p>
          <p style={{ color: "#6b7280", fontSize: 12, marginTop: 8 }}>
            Si el archivo seleccionado no es un documento raíz (no exporta un
            &lt;Document&gt;), selecciona el archivo principal de tu plantilla
            para ver el PDF completo.
          </p>
        </div>
      )
    }
    return this.props.children
  }
}

export default PDFPreview