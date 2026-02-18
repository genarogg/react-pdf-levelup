import { Check } from "lucide-react"
import { CodeBlock } from "./code-block"
import { useTranslation } from "react-i18next"

const featureKeys = ["ts", "frameworks", "composable", "plugins", "theming", "scale"] as const

const exampleCode = 
`const Component = ({ data }) => {
  return (
    <Layout>
      <H1>Tabla</H1>
      <Table cellHeight={24}>
        <Thead >
          <Tr style={{ backgroundColor: "#2563eb"}} >
            <Th width="40%">Producto</Th>
            <Th width="20%">Cant</Th>
            <Th width="20%">Precio</Th>
            <Th width="20%">Total</Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td width="40%">Item A</Td>
            <Td width="20%">2</Td>
            <Td width="20%">$5.00</Td>
            <Td width="20%">$10.00</Td>
          </Tr>
        </Tbody>
      </Table>
    </Layout>
  )
}`

export function DeveloperFeatures() {
  const { t } = useTranslation()
  return (
    <section id="caracteristicas" className="py-24 px-4 ">
      <div className="container max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left side - Features */}
          <div>
            <h2 className="text-4xl font-bold mb-4 text-balance text-foreground">{t("dev.heading")}</h2>
            <p className="text-muted-foreground mb-12 text-pretty leading-relaxed">
              {t("dev.subheading")}
            </p>

            <div className="space-y-8">
              {featureKeys.map((key, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-6 h-6 rounded-full bg-cyan-500/10 flex items-center justify-center">
                      <Check className="w-4 h-4 text-cyan-500" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1 text-foreground">{t(`dev.features.${key}.title`)}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{t(`dev.features.${key}.desc`)}</p>
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
