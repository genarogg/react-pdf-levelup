import { Check } from "lucide-react"
import { CodeBlock } from "./code-block"

const features = [
  {
    title: "Tipado completo con TypeScript",
    description: "IntelliSense, autocompletado y seguridad en tiempo de compilación para todos los componentes y props.",
  },
  {
    title: "Funciona con Frameworks Modernos",
    description: "Integración perfecta con Vite, Next.js, Remix y Create React App.",
  },
  {
    title: "Componentes Componibles",
    description: "Construye diseños complejos combinando bloques de construcción simples y reutilizables.",
  },
  {
    title: "Temas y Personalización Fáciles",
    description: "Sobrescribe colores, fuentes y espaciado con un objeto de tema simple o sintaxis tipo CSS.",
  },
  {
    title: "Diseñado para Escalar",
    description: "Genera miles de PDFs eficientemente con renderizado y caché optimizados.",
  },
]

const exampleCode = `import { Document, Page, Text, View } from '@react-pdf/renderer';
import { InvoiceHeader, InvoiceTable, InvoiceTotal } from './components';

export const InvoicePDF = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <InvoiceHeader 
        client={data.client} 
        date={data.date} 
      />
      
      <View style={styles.content}>
        <Text style={styles.title}>Factura #{data.number}</Text>
        <InvoiceTable items={data.items} />
      </View>

      <InvoiceTotal 
        subtotal={data.subtotal} 
        tax={data.tax} 
        total={data.total} 
      />
    </Page>
  </Document>
);`

export function DeveloperFeatures() {
  return (
    <section id="caracteristicas" className="py-24 px-4 bg-muted/30">
      <div className="container max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left side - Features */}
          <div>
            <h2 className="text-4xl font-bold mb-4 text-balance text-foreground">Creado para Desarrolladores</h2>
            <p className="text-muted-foreground mb-12 text-pretty leading-relaxed">
              Nos obsesionamos con los pequeños detalles para que puedas concentrarte en programar. Cada decisión de la librería está pensada en la experiencia del desarrollador.
            </p>

            <div className="space-y-8">
              {features.map((feature, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-6 h-6 rounded-full bg-cyan-500/10 flex items-center justify-center">
                      <Check className="w-4 h-4 text-cyan-500" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1 text-foreground">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right side - Code example */}
          <div className="lg:sticky lg:top-8">
            <div className="shadow-lg" style={{maxWidth: "90vw"}}>
                <CodeBlock 
                  code={exampleCode} 
                  language="tsx" 
                  filename="Invoice.tsx" 
                />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
