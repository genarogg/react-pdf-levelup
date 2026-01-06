import { useState, useEffect, useCallback, useRef } from "react"
import { PDFViewer, Document, Page, Text, View, StyleSheet, Font, Image, Link } from "@react-pdf/renderer"
import * as React from "react"
import * as Babel from "@babel/standalone"
import * as CoreComponents from "../core"

// Componente de ejemplo predeterminado
const DefaultDocument = () => (
  <Document>
    <Page size="A4" style={{ padding: 30, backgroundColor: "#ffffff" }}>
      <View style={{ padding: 10 }}>
        <Text style={{ fontSize: 20, marginBottom: 10 }}>Esperando código...</Text>
        <Text>Escribe tu código para generar el PDF.</Text>
      </View>
    </Page>
  </Document>
)

// Componente para mostrar errores
const ErrorDocument = ({ errorMessage }: { errorMessage: string }) => (
  <Document>
    <Page size="A4" style={{ padding: 30, backgroundColor: "#ffffff" }}>
      <View style={{ padding: 10, border: "1px solid #ff0000", backgroundColor: "#fff5f5" }}>
        <Text style={{ fontSize: 20, marginBottom: 10, color: "#ff0000" }}>
          Error en el código
        </Text>
        <Text style={{ fontSize: 12, marginBottom: 10, color: "#333" }}>
          {errorMessage}
        </Text>
        <Text style={{ fontSize: 10, color: "#666" }}>
          Revisa la consola para más detalles.
        </Text>
      </View>
    </Page>
  </Document>
)

interface PDFPreviewProps {
  code: string
}

const PDFPreview = ({ code }: PDFPreviewProps) => {
  const [error, setError] = useState<string | null>(null)
  const [Component, setComponent] = useState<React.ComponentType>(() => DefaultDocument)
  const [isCompiling, setIsCompiling] = useState(false)
  const [key, setKey] = useState(0)
  
  const compilationTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastCompiledCodeRef = useRef<string>("")
  const isFirstRenderRef = useRef(true)

  const compileCode = useCallback(async (sourceCode: string) => {
    // Evitar compilaciones duplicadas
    if (sourceCode === lastCompiledCodeRef.current) {
      return
    }

    lastCompiledCodeRef.current = sourceCode
    setIsCompiling(true)
    
    // Limpiar error previo al empezar nueva compilación
    setError(null)
    
    try {
      // Verificar si el código está vacío
      if (!sourceCode || sourceCode.trim() === "") {
        setError(null)
        setComponent(() => DefaultDocument)
        setKey(prev => prev + 1)
        return
      }

      let modifiedCode = sourceCode

      // Verificar si hay un componente exportable
      const hasExport = 
        modifiedCode.includes("const result =") ||
        modifiedCode.includes("export default") ||
        modifiedCode.includes("const Component =") ||
        modifiedCode.includes("const InvoiceTemplate =") ||
        modifiedCode.includes("const ReporteFinanciero =") ||
        modifiedCode.includes("const CertificadoTemplate =")

      if (!hasExport) {
        // Buscar cualquier componente definido
        const componentMatch = modifiedCode.match(/const\s+([A-Z][a-zA-Z0-9]*)\s*=/)
        if (componentMatch) {
          modifiedCode += `\nconst result = ${componentMatch[1]};`
        } else {
          const errorMsg = "No se encontró ningún componente exportable. Define un componente que retorne JSX."
          setError(errorMsg)
          setComponent(() => () => <ErrorDocument errorMessage={errorMsg} />)
          setKey(prev => prev + 1)
          return
        }
      }

      // Transformar el código JSX a JavaScript usando Babel
      let transformedCode: string
      try {
        const babelResult = Babel.transform(modifiedCode, {
          presets: ["react"],
          filename: "preview.jsx",
        })
        
        if (!babelResult || !babelResult.code) {
          throw new Error("Babel no pudo transformar el código")
        }
        
        transformedCode = babelResult.code
      } catch (babelError) {
        const errorMsg = babelError instanceof Error ? babelError.message : "Error de sintaxis en el código"
        console.error("Error de Babel:", babelError)
        setError(`Error de sintaxis: ${errorMsg}`)
        setComponent(() => () => <ErrorDocument errorMessage={`Error de sintaxis: ${errorMsg}`} />)
        setKey(prev => prev + 1)
        return
      }

      // Extraer dinámicamente todos los nombres de componentes de CoreComponents
      const componentNames = Object.keys(CoreComponents).filter(key => 
        typeof CoreComponents[key as keyof typeof CoreComponents] === 'function' || 
        typeof CoreComponents[key as keyof typeof CoreComponents] === 'object'
      )
      
      // Filtrar 'Font' de los componentes si existe para evitar conflictos
      const filteredComponentNames = componentNames.filter(name => 
        name !== 'Font' && name !== 'Document' && name !== 'Page' && 
        name !== 'Text' && name !== 'View' && name !== 'StyleSheet' && 
        name !== 'Image' && name !== 'Link'
      )
      
      const safeComponentDestructuring = filteredComponentNames.join(', ')
      
      // Crear el módulo con imports dinámicos
      const moduleCode = `
  'use strict';
  
  // React y componentes básicos de React PDF
  const React = arguments[0];
  const { Document, Page, Text, View, StyleSheet, Image, Link, Font } = arguments[1];
  
  // Componentes personalizados - destructuración dinámica (sin conflictos)
  const CoreComponents = arguments[2];
  const { ${safeComponentDestructuring} } = CoreComponents;
  
  let result = null;
  
  try {
    ${transformedCode}
    
    // Intentar encontrar el componente exportado
    if (typeof result === 'undefined' || result === null) {
      // Buscar componentes comunes
      const possibleComponents = [
        'Component', 'InvoiceTemplate', 'ReporteFinanciero', 
        'CertificadoTemplate', 'MyDocument', 'PDFDocument'
      ];
      
      for (const name of possibleComponents) {
        try {
          if (typeof eval(name) !== 'undefined') {
            result = eval(name);
            break;
          }
        } catch (e) {
          // Ignorar errores de eval para variables no definidas
          continue;
        }
      }
    }
    
    // Si aún no hay resultado, intentar buscar el último componente definido
    if (!result) {
      throw new Error("No se encontró ningún componente exportable. Asegúrate de asignar tu componente a 'result' o usar un nombre común como 'Component'.");
    }
  } catch (err) {
    console.error("Error al ejecutar el código del usuario:", err);
    throw err;
  }
  
  return result;
`

      // Evaluar el código transformado
      let CustomComponent: React.ComponentType
      
      try {
        const evalFunction = new Function(moduleCode)
        CustomComponent = evalFunction(
          React,
          { Document, Page, Text, View, StyleSheet, Image, Link, Font },
          CoreComponents,
        )
      } catch (evalError) {
        const errorMsg = evalError instanceof Error ? evalError.message : "Error al ejecutar el código"
        console.error("Error de evaluación:", evalError)
        setError(`Error de ejecución: ${errorMsg}`)
        setComponent(() => () => <ErrorDocument errorMessage={`Error de ejecución: ${errorMsg}`} />)
        setKey(prev => prev + 1)
        return
      }

      // Validar que sea un componente válido
      if (!CustomComponent || typeof CustomComponent !== "function") {
        setError("El código no devolvió un componente React válido")
        setComponent(() => () => <ErrorDocument errorMessage="El código no devolvió un componente React válido" />)
        setKey(prev => prev + 1)
        return
      }

      // Todo salió bien, actualizar el componente
      setComponent(() => CustomComponent)
      setError(null)
      setKey(prev => prev + 1)
      
    } catch (err) {
      console.error("Error general al compilar el código:", err)
      const errorMessage = err instanceof Error ? err.message : "Error desconocido al compilar"
      setError(errorMessage)
      setComponent(() => () => <ErrorDocument errorMessage={errorMessage} />)
      setKey(prev => prev + 1)
    } finally {
      setIsCompiling(false)
    }
  }, [])

  useEffect(() => {
    // En el primer render, compilar inmediatamente
    if (isFirstRenderRef.current) {
      isFirstRenderRef.current = false
      if (code && code.trim() !== "") {
        compileCode(code)
      }
      return
    }

    // Limpiar timeout anterior si existe
    if (compilationTimeoutRef.current) {
      clearTimeout(compilationTimeoutRef.current)
    }

    // Debounce: esperar 300ms antes de compilar
    compilationTimeoutRef.current = setTimeout(() => {
      compileCode(code)
    }, 300)

    // Cleanup
    return () => {
      if (compilationTimeoutRef.current) {
        clearTimeout(compilationTimeoutRef.current)
      }
    }
  }, [code, compileCode])

  // Cleanup al desmontar
  useEffect(() => {
    return () => {
      lastCompiledCodeRef.current = ""
    }
  }, [])

  return (
    <div className="pdf-viewer-container" style={{ width: "100%", height: "100%" }}>
      {/* Indicador de compilación */}
      {isCompiling && (
        <div style={{ 
          position: "absolute", 
          top: 10, 
          right: 10, 
          background: "#fff", 
          padding: "5px 10px", 
          borderRadius: 4,
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          zIndex: 1000,
          fontSize: 12
        }}>
          Compilando...
        </div>
      )}
      
      {/* Banner de error */}
      {error && !isCompiling && (
        <div style={{
          position: "absolute",
          top: 10,
          left: 10,
          right: 10,
          background: "#fff5f5",
          border: "1px solid #ff0000",
          padding: 10,
          borderRadius: 4,
          zIndex: 1000,
          maxHeight: 100,
          overflow: "auto"
        }}>
          <strong style={{ color: "#ff0000" }}>Error:</strong>
          <pre style={{ margin: "5px 0 0 0", fontSize: 11, whiteSpace: "pre-wrap" }}>
            {error}
          </pre>
        </div>
      )}
      
      {/* Visor de PDF con ErrorBoundary */}
      <ErrorBoundary
        key={key}
        fallback={
          <div style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#fff5f5",
            padding: 20
          }}>
            <div style={{ textAlign: "center" }}>
              <h3 style={{ color: "#ff0000" }}>Error al renderizar el PDF</h3>
              <p>Se produjo un error durante el renderizado. Revisa la consola para más detalles.</p>
            </div>
          </div>
        }
      >
        <PDFViewer 
          key={key}
          width="100%" 
          height="100%" 
          showToolbar={true}
        >
          <Component />
        </PDFViewer>
      </ErrorBoundary>
    </div>
  )
}

// ErrorBoundary para capturar errores de renderizado
class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode; fallback: React.ReactNode }) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error capturado por ErrorBoundary:", error, errorInfo)
  }

  componentDidUpdate(prevProps: { children: React.ReactNode; fallback: React.ReactNode }) {
    // Reset error state si los children cambian
    if (prevProps.children !== this.props.children && this.state.hasError) {
      this.setState({ hasError: false, error: null })
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback
    }
    return this.props.children
  }
}

export default PDFPreview