import { LayoutPDF, Table, Thead, Tbody, Tr, Th, Td, P, H2, View } from "react-pdf-levelup"

// Datos de ejemplo para el reporte
const reporteData = {
  periodo: "Enero - Marzo 2024",
  departamento: "Finanzas",
  responsable: "Juan Pdasdasdasérez",
  costoTotal: "15,750.00",
  documentos: {
    Certificados: {
      totalCantidad: 250,
      tipoPapel: {
        SIMPLE: 150,
        SEGURIDAD: 100,
      },
      totalCosto: "5,250.00",
    },
    Diplomas: {
      totalCantidad: 120,
      tipoPapel: {
        SIMPLE: 20,
        SEGURIDAD: 100,
      },
      totalCosto: "4,200.00",
    },
    Constancias: {
      totalCantidad: 300,
      tipoPapel: {
        SIMPLE: 200,
        SEGURIDAD: 100,
      },
      totalCosto: "6,300.00",
    },
  },
}

// Componente principal
const Component = ({ data }) => {
  return (
    <LayoutPDF size="A4" showPageNumbers={false}>
      {/* Ejemplo de encabezado con estilos */}
      <View style={{ marginBottom: 20, padding: 10, backgroundColor: "#f5f5f5",s }}>
        <H2 style={{ color: "#333333", textAlign: "center" }}>Reporte Financiero</H2>
        <P style={{ fontSize: 10, textAlign: "right" }}>Periodo: {data.periodo}</P>
      </View>

      <Table style={{ borderBottom: 0, borderRight: 0,s }}>
        <Thead>
          <Tr>
            <Th style={{ backgroundColor: "#b6d4ff", width: "50%" }}>Documento</Th>
            <Th style={{ backgroundColor: "#b6d4ff", width: "30%" }}>Tipo de papel</Th>
            <Th style={{ backgroundColor: "#b6d4ff", width: "20%" }}>SubTotal</Th>
          </Tr>
          <Tr>
            <Th style={{ backgroundColor: "#b6d4ff", width: "40%" }}>Nombre</Th>
            <Th style={{ backgroundColor: "#b6d4ff", width: "10%" }}>Cantidad</Th>
            <Th style={{ backgroundColor: "#b6d4ff", width: "15%" }}>Simple</Th>
            <Th style={{ backgroundColor: "#b6d4ff", width: "15%" }}>Seguridad</Th>
            <Th style={{ backgroundColor: "#b6d4ff", width: "20%" }}></Th>
          </Tr>
        </Thead>

        <Tbody>
          {Object.entries(data.documentos).map(([nombreDoc, detalles]) => (
            <Tr key={nombreDoc}>
              <Td style={{ width: "40%" }}>{nombreDoc}</Td>
              <Td style={{ width: "10%", textAlign: "right" }}>{detalles.totalCantidad}</Td>
              <Td style={{ width: "15%", textAlign: "right" }}>{detalles.tipoPapel.SIMPLE}</Td>
              <Td style={{ width: "15%", textAlign: "right" }}>{detalles.tipoPapel.SEGURIDAD}</Td>
              <Td style={{ width: "20%", textAlign: "right" }}>{detalles.totalCosto}Bs</Td>
            </Tr>
          ))}
          <Tr>
            <Td style={{ width: "40%" }}>Total</Td>
            <Td style={{ width: "10%" }}></Td>
            <Td style={{ width: "15%" }}></Td>
            <Td style={{ width: "15%" }}></Td>
            <Td style={{ width: "20%", textAlign: "right", backgroundColor: "#b6d4ff" }}>{data.costoTotal}Bs</Td>
          </Tr>
        </Tbody>
      </Table>

      {/* Ejemplo de pie de página con estilos */}
      <View style={{ marginTop: 20, padding: 10, borderTop: "1px solid #cccccc" }}>
        <P style={{ fontSize: 8, textAlign: "center", color: "#666666" }}>
          Este es un documento generado automáticamente. Departamento: {data.departamento}
        </P>
      </View>
    </LayoutPDF>
  )
}

// Asignar el componente a la variable result para que el sistema lo reconozca
const result = Component

export default Component

