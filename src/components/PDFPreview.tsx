import { useState, useEffect } from "react"
import { PDFViewer, Document, Page, Text, View, StyleSheet, Font, Image, Link } from "@react-pdf/renderer"
import * as React from "react"
import * as Babel from "@babel/standalone"

// Importar todos los componentes personalizados
import * as CoreComponents from "./core"

// Componente de ejemplo predeterminado para mostrar cuando hay errores
const DefaultDocument = () => (
  <Document>
    <Page size="A4" style={{ padding: 30, backgroundColor: "#ffffff" }}>
      <View style={{ padding: 10 }}>
        <Text style={{ fontSize: 20, marginBottom: 10 }}>Error en el código</Text>
        <Text>Por favor, corrige los errores en el editor.</Text>
      </View>
    </Page>
  </Document>
)

// Componente para mostrar errores específicos
const ErrorDocument = ({ errorMessage }: { errorMessage: string }) => (
  <Document>
    <Page size="A4" style={{ padding: 30, backgroundColor: "#ffffff" }}>
      <View style={{ padding: 10, border: "1px solid #ff0000" }}>
        <Text style={{ fontSize: 20, marginBottom: 10, color: "#ff0000" }}>Error en el código</Text>
        <Text style={{ fontSize: 12, marginBottom: 10 }}>{errorMessage}</Text>
        <Text style={{ fontSize: 10 }}>Revisa la consola para más detalles.</Text>
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

  useEffect(() => {
    const compileCode = async () => {
      try {
        // Verificar si el código está vacío
        if (!code || code.trim() === "") {
          setError("El código está vacío. Por favor, escribe algún código para generar un PDF.")
          setComponent(() => DefaultDocument)
          return
        }

        // Buscar variables no definidas comunes en el código
        const commonUndefinedVars = ["m", "s", "t", "i", "x", "y", "z", "e", "data"]
        let modifiedCode = code

        // Verificar si hay referencias a variables potencialmente no definidas
        for (const varName of commonUndefinedVars) {
          // Buscar patrones como "varName.property" o "varName[" que no estén definidos
          const regex = new RegExp(`(?<!\\w|\\.)\\b${varName}\\b(?!\s*=|\\s*\\()(?=\\.|\\[|\\s*\\})`, "g")
          if (regex.test(code)) {
            // Agregar una declaración de variable al principio del código
            modifiedCode = `// Variable agregada automáticamente para prevenir errores
const ${varName} = {};\n${modifiedCode}`
          }
        }

        // Verificar si hay un componente exportable
        if (
          !code.includes("const result =") &&
          !code.includes("const Component =") &&
          !code.includes("const InvoiceTemplate =") &&
          !code.includes("const ReporteFinanciero =") &&
          !code.includes("const CertificadoTemplate =")
        ) {
          // Agregar un componente predeterminado si no se encuentra ninguno
          modifiedCode += `\n
// Componente predeterminado agregado automáticamente
const Component = () => {
  return (
    <LayoutPDF size="A4" showPageNumbers={false}>
      <View style={{ padding: 20 }}>
        <P style={{ fontSize: 16, color: "#ff0000" }}>
          No se encontró ningún componente exportable en tu código.
        </P>
        <P style={{ fontSize: 12 }}>
          Asegúrate de definir un componente y asignarlo a la variable 'result'.
        </P>
      </View>
    </LayoutPDF>
  );
};

// Asignación automática a result
const result = Component;`
        }

        // Buscar posibles reasignaciones a constantes y convertirlas en let
        const constRegex = /const\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=/g
        const constMatches = [...modifiedCode.matchAll(constRegex)]
        const constNames = constMatches.map((match) => match[1])

        // Buscar posibles reasignaciones
        for (const constName of constNames) {
          const reassignRegex = new RegExp(`(?<!\\w|\\.)\\b${constName}\\s*=\\s*`, "g")
          if (reassignRegex.test(modifiedCode)) {
            // Convertir const a let para esta variable
            modifiedCode = modifiedCode.replace(new RegExp(`const\\s+${constName}\\s*=`, "g"), `let ${constName} =`)
          }
        }

        // Transformar el código JSX a JavaScript usando Babel
        const transformedCode =
          Babel.transform(modifiedCode, {
            presets: ["react"],
            filename: "preview.jsx",
          }).code || ""

        // Crear un módulo temporal para evaluar el código
        const moduleCode = `
  // React y componentes básicos de React PDF
  const React = arguments[0];
  const Document = arguments[1];
  const Page = arguments[2];
  const Text = arguments[3];
  const View = arguments[4];
  const StyleSheet = arguments[5];
  const Image = arguments[6];
  const Link = arguments[7];
  const Font = arguments[8];
  
  // Componentes personalizados
  const {
    Div,
    LayoutPDF,
    Img,
    Left,
    Right,
    Center,
    P,
    A,
    H1,
    H2,
    H3,
    H4,
    H5,
    H6,
    Strong,
    Em,
    U,
    Small,
    Blockquote,
    Mark,
    Span,
    BR,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Container,
    Row,
    Col1,
    Col2,
    Col3,
    Col4,
    Col5,
    Col6,
    Col7,
    Col8,
    Col9,
    Col10,
    Col11,
    Col12,
    Header,
  ImgBg,
    QR,
    UL,
    OL,
    LI
  } = arguments[9];
  
  // Función auxiliar para procesar estilos
  const processStyles = (styles) => {
    if (typeof styles === 'string') {
      try {
        // Intentar convertir cadenas de estilo a objetos
        return JSON.parse(styles.replace(/'/g, '"'));
      } catch (e) {
        console.warn('Error al procesar estilo:', e);
        return {};
      }
    }
    return styles;
  };
  
  let result = null;
  
  try {
    ${transformedCode}
    
    // Si existe un componente llamado Component, asignarlo automáticamente a result
    if (typeof Component !== 'undefined') {
      if (typeof reporteData !== 'undefined') {
        result = () => React.createElement(Component, { data: reporteData });
      } else {
        result = Component;
      }
    }
    // Si existe un componente con otro nombre (como InvoiceTemplate, ReporteFinanciero, etc.)
    // intentar asignarlo a result
    else if (typeof InvoiceTemplate !== 'undefined') {
      result = InvoiceTemplate;
    }
    else if (typeof ReporteFinanciero !== 'undefined') {
      result = ReporteFinanciero;
    }
    else if (typeof CertificadoTemplate !== 'undefined') {
      result = CertificadoTemplate;
    }
    
    // Si no se encontró ningún componente, lanzar un error
    if (!result) {
      throw new Error("No se encontró ningún componente exportable. Asegúrate de definir un componente llamado 'Component' o asignar tu componente a la variable 'result'.");
    }
  } catch (err) {
    console.error("Error en el código del usuario:", err);
    throw err;
  }
  
  return result;
`

        // Evaluar el código transformado
        const evalFunction = new Function(moduleCode)

        // Ejecutar la función con las dependencias necesarias
        const CustomComponent = evalFunction(
          React,
          Document,
          Page,
          Text,
          View,
          StyleSheet,
          Image,
          Link,
          Font,
          CoreComponents,
        )

        if (CustomComponent && typeof CustomComponent === "function") {
          setComponent(() => CustomComponent)
          setError(null)
        } else {
          throw new Error(
            "El código no devolvió un componente válido. Asegúrate de asignar tu componente a la variable 'result'.",
          )
        }
      } catch (err) {
        console.error("Error al compilar el código:", err)
        const errorMessage = err instanceof Error ? err.message : "Error desconocido"
        setError(errorMessage)
        // Crear un componente de error personalizado con el mensaje específico
        setComponent(() => () => <ErrorDocument errorMessage={errorMessage} />)
      }
    }

    compileCode()
  }, [code])

  // Envolver el PDFViewer en un ErrorBoundary para capturar errores de renderizado
  return (
    <div className="pdf-viewer-container">
      {error ? (
        <div className="pdf-error">
          <h3>Error:</h3>
          <pre>{error}</pre>
        </div>
      ) : (
        <ErrorBoundary
          fallback={
            <div className="pdf-error">
              <h3>Error al renderizar el PDF:</h3>
              <p>
                Se produjo un error durante el renderizado del PDF. Esto puede deberse a referencias a variables no
                definidas o props inválidas.
              </p>
            </div>
          }
        >
          <PDFViewer width="100%" height="100%">
            <Component />
          </PDFViewer>
        </ErrorBoundary>
      )}
    </div>
  )
}

// Componente ErrorBoundary para capturar errores de renderizado
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

  render() {
    if (this.state.hasError) {
      return this.props.fallback
    }
    return this.props.children
  }
}

export default PDFPreview

