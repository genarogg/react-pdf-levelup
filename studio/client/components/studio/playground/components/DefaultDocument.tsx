import { Document, Page, Text, View } from "@react-pdf/renderer"

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

export default DefaultDocument
