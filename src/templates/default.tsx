// Este es un ejemplo de un componente para generar un reporte financiero en PDF
// En una aplicación real, importarías los componentes así:
// import React from "react";
import React from 'react'
import { LayoutPDF, Table, Thead, Tbody, Tr, Th, Td } from "react-pdf-levelup"


// Componente principal
const Component = ({ data }:any) => {
  return (
    <LayoutPDF size="A4" showPageNumbers={false}>
      <Table style={{ borderBottom: 0, borderRight: 0 }}>
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
         
          <Tr>
            <Td style={{ width: "40%" }}>Total</Td>
            <Td style={{ width: "10%" }}></Td>
            <Td style={{ width: "15%" }}></Td>
            <Td style={{ width: "15%" }}></Td>
            <Td style={{ width: "20%", textAlign: "right", backgroundColor: "#b6d4ff" }}>{data.costoTotal}Bs</Td>
          </Tr>
        </Tbody>
      </Table>
    </LayoutPDF>
  )
}

export default Component

