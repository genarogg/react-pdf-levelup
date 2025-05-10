
const reporteData = {
  periodo: "Enero - Marzo 2024",
  departamento: "Finanzas",
  responsable: "Juan Pérez",
  costoTotal: "15,750.00",
  documentos: {
    "Certificados": {
      totalCantidad: 250,
      tipoPapel: {
        SIMPLE: 150,
        SEGURIDAD: 100
      },
      totalCosto: "5,250.00"
    },
    "Diplomas": {
      totalCantidad: 120,
      tipoPapel: {
        SIMPLE: 20,
        SEGURIDAD: 100
      },
      totalCosto: "4,200.00"
    },
    "Constancias": {
      totalCantidad: 300,
      tipoPapel: {
        SIMPLE: 200,
        SEGURIDAD: 100
      },
      totalCosto: "6,300.00"
    }
  }
};

// Componente principal
const Component = ({ data }) => {
  return (
    <LayoutPDF size="A4" padding={20} showPageNumbers={false}>
<QR value="http://localhost:5173/" size={150} colorDark="#000000" />
      <Table style={{ borderBottom: 0, borderRight: 0 }}>
        <Thead>
          <Tr>
            <Th style={{ backgroundColor: "#b6d4ff", width: "50%" }}>
              Documento
            </Th>
            <Th style={{ backgroundColor: "#b6d4ff", width: "30%" }}>
              Tipo de papel
            </Th>
            <Th style={{ backgroundColor: "#b6d4ff", width: "20%" }}>
              SubTotal
            </Th>
          </Tr>
          <Tr>
            <Th style={{ backgroundColor: "#b6d4ff", width: "40%" }}>
              Nombre
            </Th>
            <Th style={{ backgroundColor: "#b6d4ff", width: "10%" }}>
              Cantidad
            </Th>
            <Th style={{ backgroundColor: "#b6d4ff", width: "15%" }}>
              Simple
            </Th>
            <Th style={{ backgroundColor: "#b6d4ff", width: "15%" }}>
              Seguridad
            </Th>
            <Th style={{ backgroundColor: "#b6d4ff", width: "20%" }}></Th>
          </Tr>
        </Thead>

        <Tbody>
          {Object.entries(data.documentos).map(([nombreDoc, detalles]) => (
            <Tr key={nombreDoc}>
              <Td style={{ width: "40%" }}>{nombreDoc}</Td>
              <Td style={{ width: "10%", textAlign: "right" }}>
                {detalles.totalCantidad}
              </Td>
              <Td style={{ width: "15%", textAlign: "right" }}>
                {detalles.tipoPapel.SIMPLE}
              </Td>
              <Td style={{ width: "15%", textAlign: "right" }}>
                {detalles.tipoPapel.SEGURIDAD}
              </Td>
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
    </LayoutPDF>
  );
};

