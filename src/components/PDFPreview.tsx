"use client"

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

interface PDFPreviewProps {
  code: string
}

const PDFPreview = ({ code }: PDFPreviewProps) => {
  const [error, setError] = useState<string | null>(null)
  const [Component, setComponent] = useState<React.ComponentType>(() => DefaultDocument)

  useEffect(() => {
    const compileCode = async () => {
      try {
        // Transformar el código JSX a JavaScript usando Babel
        const transformedCode =
          Babel.transform(code, {
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
            Footer,
            QR,
            UL,
            OL,
            LI
          } = arguments[9];
          
          let result = null;
          
          try {
            ${transformedCode}
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
        setError(err instanceof Error ? err.message : "Error desconocido")
        setComponent(() => DefaultDocument)
      }
    }

    compileCode()
  }, [code])

  return (
    <div className="pdf-viewer-container">
      {error ? (
        <div className="pdf-error">
          <h3>Error:</h3>
          <pre>{error}</pre>
        </div>
      ) : (
        <PDFViewer width="100%" height="100%">
          <Component />
        </PDFViewer>
      )}
    </div>
  )
}

export default PDFPreview

