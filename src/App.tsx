"use client"

import { useState } from "react"
import CodeEditor from "./components/CodeEditor"
import PDFPreview from "./components/PDFPreview"
//@ts-ignore
import "./App.css"

function App() {
  // Código de ejemplo con los componentes personalizados
  const [code, setCode] = useState<string>(`
// Ejemplo de uso de los componentes personalizados
// No uses declaraciones import aquí, las dependencias ya están disponibles

// Estilos para el PDF
const styles = StyleSheet.create({
  section: {
    margin: 10,
    padding: 10,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  text: {
    fontSize: 12,
    marginBottom: 10,
  },
  highlight: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 5,
  },
  qrSection: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    flexDirection: 'column',
  }
});

// Componente PDF con los componentes personalizados
const MyDocument = () => (
  <Document>
    <Page size="A4" style={{ padding: 30, backgroundColor: '#ffffff' }}>
      <View style={{ padding: 10 }}>
        <Text style={styles.title}>Mi Documento PDF con QR Personalizado</Text>
        
        <View style={{ flexDirection: 'row' }}>
          <View style={{ width: '50%', padding: 10 }}>
            <Text style={styles.text}>Este es un ejemplo de documento PDF creado con React PDF.</Text>
            <Text style={styles.text}>Puedes usar componentes personalizados para crear tus documentos.</Text>
          </View>
          <View style={{ width: '50%', padding: 10, backgroundColor: '#f0f0f0' }}>
            <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 5 }}>Características</Text>
            <Text style={styles.text}>• Sistema de grid responsive</Text>
            <Text style={styles.text}>• Componentes de texto semánticos</Text>
            <Text style={styles.text}>• Tablas y listas</Text>
            <Text style={styles.text}>• Códigos QR personalizables con logo</Text>
          </View>
        </View>
        
        <View style={styles.qrSection}>
          <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 10 }}>QR Básico</Text>
          <QR 
            value="https://example.com" 
            size={120} 
            colorDark="#000000"
            colorLight="#ffffff"
          />
          <Text style={{ fontSize: 10, marginTop: 5 }}>https://example.com</Text>
        </View>
        
        <View style={styles.qrSection}>
          <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 10 }}>QR con Logo</Text>
          <QR 
            value="https://example.com/con-logo" 
            size={150} 
            colorDark="#1976D2"
            colorLight="#F5F5F5"
            margin={4}
            errorCorrectionLevel="H"
            logo="https://cdn.iconscout.com/icon/free/png-256/free-react-1-282599.png"
            logoWidth={40}
            logoHeight={40}
          />
          <Text style={{ fontSize: 10, marginTop: 5 }}>QR con logo de React</Text>
        </View>
      </View>
    </Page>
  </Document>
);

// Asignar el componente a result (NO usar return)
result = MyDocument;
`)

  return (
    <div className="app-container">
      <header>
        <h1>Editor de PDF con React</h1>
      </header>
      <main>
        <div className="editor-container">
          <CodeEditor value={code} onChange={setCode as any} />
        </div>
        <div className="preview-container">
          <PDFPreview code={code} />
        </div>
      </main>
    </div>
  )
}

export default App

