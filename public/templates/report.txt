// Plantilla de Reporte Financiero
const ReporteFinanciero = () => {
  // Datos de ejemplo
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

  // Componentes simulados para el ejemplo
  const Header = ({ isFundesurg }) => (
    <View style={{ marginBottom: 20, borderBottom: '1px solid #ccc', paddingBottom: 10 }}>
      <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#003366' }}>
        {isFundesurg === "true" ? "FUNDESURG" : "ORGANIZACIÓN"}
      </Text>
      <Text style={{ fontSize: 10 }}>Fecha: {new Date().toLocaleDateString()}</Text>
    </View>
  );

  const Title = ({ text }) => (
    <View style={{ marginBottom: 15, backgroundColor: '#f0f0f0', padding: 8 }}>
      <Text style={{ fontSize: 14, fontWeight: 'bold', textAlign: 'center' }}>{text}</Text>
    </View>
  );

  const Detalles = ({ data }) => (
    <View style={{ marginBottom: 20 }}>
      <Text style={{ fontSize: 12, marginBottom: 5 }}>
        <Strong>Periodo:</Strong> {data.periodo}
      </Text>
      <Text style={{ fontSize: 12, marginBottom: 5 }}>
        <Strong>Departamento:</Strong> {data.departamento}
      </Text>
      <Text style={{ fontSize: 12, marginBottom: 5 }}>
        <Strong>Responsable:</Strong> {data.responsable}
      </Text>
    </View>
  );

  return (
    <LayoutPDF size="A4" padding={20} showPageNumbers={false}>
      <Header isFundesurg="true"></Header>

      <Title text="REPORTE FINANCIERO"></Title>

      <Detalles data={reporteData}></Detalles>

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
          {Object.entries(reporteData.documentos).map(([nombreDoc, detalles]) => (
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
            <Td style={{ width: "20%", textAlign: "right", backgroundColor: "#b6d4ff" }}>{reporteData.costoTotal}Bs</Td>
          </Tr>
        </Tbody>
      </Table>
    </LayoutPDF>
  );
};

// Asignar el componente a result
result = ReporteFinanciero;

