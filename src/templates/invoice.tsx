import React from 'react'
import {
  LayoutPDF,
  View,
  Row,
  Col6,
  H2,
  P,
  Right,
  QR,
  H3,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Strong,
  Center,
  Text,

  Col4,
} from "react-pdf-levelup"

// Plantilla de Factura
const InvoiceTemplate = () => {
  // Datos de ejemplo
  const invoiceData = {
    number: "F-2024-001",
    date: new Date().toLocaleDateString(),
    client: {
      name: "Empresa XYZ S.A.",
      address: "Av. Principal #123, La Paz",
      nit: "1234567890",
      phone: "+591 77777777",
    },
    items: [
      { description: "Servicio de consultoría", quantity: 1, unitPrice: "5,000.00", total: "5,000.00" },
      { description: "Desarrollo de software", quantity: 40, unitPrice: "100.00", total: "4,000.00" },
      { description: "Soporte técnico", quantity: 10, unitPrice: "80.00", total: "800.00" },
    ],
    subtotal: "9,800.00",
    tax: "1,274.00",
    total: "11,074.00",
  }

  return (
    <LayoutPDF size="A4" showPageNumbers={false}>
      {/* Encabezado */}
      <View style={{ marginBottom: 20, borderBottom: "1px solid #ccc", padding: 10 }}>
        <Row>
          <Col6>
            <H2>FACTURA</H2>
            <P>Nº: {invoiceData.number}</P>
            <P>Fecha: {invoiceData.date}</P>
          </Col6>
          <Col6>
            <Right>
              <QR value={`https://verificar-factura.com/${invoiceData.number}`} size={100} />
            </Right>
          </Col6>
        </Row>
      </View>

      {/* Información del Cliente */}
      <View style={{ marginBottom: 15, padding: 10, backgroundColor: "#f9f9f9" }}>
        <H3>Información del Cliente</H3>
        <Row>
          <Col6>
            <P>
              <Strong>Nombre:</Strong> {invoiceData.client.name}
            </P>
            <P>
              <Strong>Dirección:</Strong> {invoiceData.client.address}
            </P>
          </Col6>
          <Col6>
            <P>
              <Strong>NIT/CI:</Strong> {invoiceData.client.nit}
            </P>
            <P>
              <Strong>Teléfono:</Strong> {invoiceData.client.phone}
            </P>
          </Col6>
        </Row>
      </View>

      {/* Tabla de Items */}
      <Table>
        <Thead>
          <Tr>
            <Th style={{ backgroundColor: "#b6d4ff", width: "50%" }}>Descripción</Th>
            <Th style={{ backgroundColor: "#b6d4ff", width: "15%" }}>Cantidad</Th>
            <Th style={{ backgroundColor: "#b6d4ff", width: "15%" }}>Precio Unit.</Th>
            <Th style={{ backgroundColor: "#b6d4ff", width: "20%" }}>Total</Th>
          </Tr>
        </Thead>
        <Tbody>
          {invoiceData.items.map((item, index) => (
            <Tr key={index}>
              <Td style={{ width: "50%" }}>{item.description}</Td>
              <Td style={{ width: "15%", textAlign: "center" }}>{item.quantity}</Td>
              <Td style={{ width: "15%", textAlign: "right" }}>{item.unitPrice}</Td>
              <Td style={{ width: "20%", textAlign: "right" }}>{item.total} Bs</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      {/* Totales */}
      <View style={{ marginTop: 20, borderTop: "1px solid #ccc", padding: 10 }}>
        <Row>
      
          <Col4>
            <Table>
              <Tbody>
                <Tr>
                  <Td style={{ width: "50%" }}>
                    <Strong>Subtotal:</Strong>
                  </Td>
                  <Td style={{ width: "50%", textAlign: "right" }}>{invoiceData.subtotal} Bs</Td>
                </Tr>
                <Tr>
                  <Td style={{ width: "50%" }}>
                    <Strong>IVA (13%):</Strong>
                  </Td>
                  <Td style={{ width: "50%", textAlign: "right" }}>{invoiceData.tax} Bs</Td>
                </Tr>
                <Tr>
                  <Td style={{ width: "50%", backgroundColor: "#f0f0f0" }}>
                    <Strong>TOTAL:</Strong>
                  </Td>
                  <Td style={{ width: "50%", textAlign: "right", backgroundColor: "#f0f0f0" }}>
                    <Strong>{invoiceData.total} Bs</Strong>
                  </Td>
                </Tr>
              </Tbody>
            </Table>
          </Col4>
        </Row>
      </View>

      {/* Firmas */}
      <View style={{ marginTop: 50, borderTop: "1px dashed #ccc", paddingTop: 10 }}>
        <Row>
          <Col6>
            <Center>
              <View style={{ width: 150, borderTop: "1px solid #000", marginTop: 40 }}>
                <Text style={{ textAlign: "center", fontSize: 10 }}>Firma Autorizada</Text>
              </View>
            </Center>
          </Col6>
          <Col6>
            <Center>
              <View style={{ width: 150, borderTop: "1px solid #000", marginTop: 40 }}>
                <Text style={{ textAlign: "center", fontSize: 10 }}>Firma Cliente</Text>
              </View>
            </Center>
          </Col6>
        </Row>
      </View>
    </LayoutPDF>
  )
}

export default InvoiceTemplate