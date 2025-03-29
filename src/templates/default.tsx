import { LayoutPDF, P, H2, View } from "react-pdf-levelup"
import React from 'react'
// Datos de ejemplo para el reporte


// Componente principal
const Component = ({ data }:any) => {
  return (
    <LayoutPDF size="A4" showPageNumbers={false}>
      {/* Ejemplo de encabezado con estilos */}
      <View style={{ marginBottom: 20, padding: 10, backgroundColor: "#f5f5f5"}}>
        <H2 style={{ color: "#333333", textAlign: "center" }}>Reporte Financiero</H2>
        <P style={{ fontSize: 10, textAlign: "right" }}>Periodo: {data.periodo}</P>
      </View>

      {/* Ejemplo de pie de página con estilos */}
      <View style={{ marginTop: 20, padding: 10, borderTop: "1px solid #cccccc" }}>
        <P style={{ fontSize: 8, textAlign: "center", color: "#666666" }}>
          Este es un documento generado automáticamente. Departamento: {data.departamento}
        </P>
      </View>
    </LayoutPDF>
  )
}



export default Component

