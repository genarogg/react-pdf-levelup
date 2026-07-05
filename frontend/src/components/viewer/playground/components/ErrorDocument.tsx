import { Document, Page, Text, View } from "@react-pdf/renderer"

interface ErrorDocumentProps {
  errorMessage: string
}

const ErrorDocument = ({ errorMessage }: ErrorDocumentProps) => (
  <Document>
    <Page
      size="A4"
      style={{
        padding: 40,
        backgroundColor: "#f8fafc",
        display: "flex",
        // justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View
        style={{
          width: "100%",
          maxWidth: 420,
          padding: 24,
          borderRadius: 8,
          backgroundColor: "#ffffff",
          border: "1px solid #fecaca",
        }}
      >
        {/* Header */}
        <Text
          style={{
            fontSize: 18,
            fontWeight: 700,
            marginBottom: 12,
            color: "#b91c1c",
          }}
        >
          ⚠ Error al compilar el documento
        </Text>

        {/* Mensaje principal */}
        <Text
          style={{
            fontSize: 12,
            color: "#374151",
            marginBottom: 12,
            lineHeight: 1.6,
          }}
        >
          Se produjo un problema al procesar tu código.
        </Text>

        {/* Caja del error */}
        <View
          style={{
            padding: 12,
            backgroundColor: "#fef2f2",
            borderRadius: 6,
            border: "1px solid #fee2e2",
          }}
        >
          <Text
            style={{
              fontSize: 10,
              color: "#7f1d1d",
            }}
          >
            {errorMessage}
          </Text>
        </View>

        {/* Footer */}
        <Text
          style={{
            fontSize: 9,
            color: "#6b7280",
            marginTop: 14,
          }}
        >
          Verifica la sintaxis y revisa la consola para más detalles.
        </Text>
      </View>
    </Page>
  </Document>
)

export default ErrorDocument
