import React from 'react'
import { Document, Page, Text } from '@react-pdf/renderer'

export default function MyDocument() {
  return (
    <Document>
      <Page size="A4" style={{ padding: 32 }}>
        <Text>¡Hola desde react-pdf-levelup!</Text>
      </Page>
    </Document>
  )
}
