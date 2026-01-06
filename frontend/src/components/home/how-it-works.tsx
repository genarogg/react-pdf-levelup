import { CodeBlock } from "./code-block"

const steps = [
  {
    step: "01",
    title: "Instala la librería",
    description: "Agrega react-pdf-levelup a tu proyecto con npm o yarn.",
    blocks: [
      {
        code: `npm install react-pdf-levelup
yarn add react-pdf-levelup`,
        language: "bash" as const,
        filename: "terminal",
      },
    ],
  },
  {
    step: "02",
    title: "Crea tu template en el Playground",
    description:
      "Abre /playground y define un componente de React que represente tu PDF. Usa las primitivas de @react-pdf/renderer.",
    blocks: [
      {
        code: `import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page: { flexDirection: 'column', padding: 30 },
  section: { margin: 10, padding: 10 },
  title: { fontSize: 20, marginBottom: 6 }
})

export const MyTemplate = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.title}>{data.title}</Text>
        {data.items?.map((item, i) => (
          <Text key={i}>• {item}</Text>
        ))}
      </View>
    </Page>
  </Document>
)`,
        language: "tsx" as const,
        filename: "MyTemplate.tsx",
      },
    ],
  },
  {
    step: "03",
    title: "Genera tu PDF (frontend o backend)",
    description:
      "Usa la librería para generar el PDF donde lo necesites. En navegador puedes previsualizar y descargar; en servidor guardas el archivo.",
    blocks: [
      {
        code: `import { generatePDF, decodeBase64Pdf } from 'react-pdf-levelup'
import { MyTemplate } from './MyTemplate'

const pdfBase64 = await generatePDF({
  template: MyTemplate,
  data: { title: 'Mi Documento', items: ['Uno', 'Dos', 'Tres'] }
})

decodeBase64Pdf(pdfBase64, 'mi-documento.pdf')`,
        language: "tsx" as const,
        filename: "frontend.tsx",
      },
      {
        code: `import { generatePDF } from 'react-pdf-levelup'
import { writeFileSync } from 'fs'
import { MyTemplate } from './MyTemplate'

const pdfBase64 = await generatePDF({
  template: MyTemplate,
  data: { title: 'Reporte', items: ['A', 'B'] }
})

const buffer = Buffer.from(pdfBase64, 'base64')
writeFileSync('reporte.pdf', buffer)`,
        language: "ts" as const,
        filename: "backend.ts",
      },
    ],
  },
]

export function HowItWorks() {
  return (
    <section className="border-t border-border px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl text-balance mb-3 sm:mb-4">
            Cómo Funciona
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground">
            De cero a PDF en menos de 5 minutos
          </p>
        </div>

        <div className="space-y-8 sm:space-y-10 lg:space-y-12">
          {steps.map((item) => (
            <div key={item.step} className="flex gap-3 sm:gap-4 lg:gap-6">
              <div className="flex-shrink-0">
                <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-emerald-500 text-base sm:text-lg font-bold text-white">
                  {item.step}
                </div>
              </div>

              <div className="flex-1 pt-0.5 sm:pt-1 min-w-0">
                <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-foreground mb-1.5 sm:mb-2">
                  {item.title}  
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4 leading-relaxed">
                  {item.description}
                </p>
                <div className="overflow-x-auto space-y-4">
                  {item.blocks?.map((b, idx) => (
                    <CodeBlock key={idx} code={b.code} language={b.language} filename={b.filename} />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
