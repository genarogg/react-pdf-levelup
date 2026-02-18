import { CodeBlock } from "./code-block"
import { useTranslation } from "react-i18next"

const templateCode = `import { A, Col6, Container, Em, H1, H2, HR, LI, Layout, P,  Row, Strong, UL } from "@react-pdf-levelup/core";
import { QR } from "@react-pdf-levelup/qr";

const Component = ({ data }) => {
  return (
    <Layout>
      <H1>Documento de Presentación</H1>
      <P>
        Bienvenido a <Strong>react-pdf-levelup</Strong>. Con esta librería puedes construir PDFs usando componentes de
        React de forma <Em>rápida</Em> y <Em>tipada</Em>.
      </P>
      <HR />
      <Container>
        <Row>
          <Col6>
            <H2>Resumen</H2>
            <UL>
              <LI>Plantillas listas</LI>
              <LI>Componentes composables</LI>
              <LI>TypeScript</LI>
              <LI>Integración moderna</LI>
            </UL>
            <P>Más información en <A href="https://github.com/genarogg/react-pdf-levelup">GitHub</A>.</P>
          </Col6>
          <Col6>
            <H2>Acceso Rápido</H2>
            <QR value="https://react-pdf-levelup.nimbux.cloud" size={120} />
            <P>Escanea el código para ir al Playground.</P>
          </Col6>
        </Row>
      </Container>
    </Layout>
  )
}`

const frontendGen = `import { generatePDF, decodeBase64Pdf } from 'react-pdf-levelup'
import { MyTemplate } from './MyTemplate'

const pdfBase64 = await generatePDF({
  template: MyTemplate,
  data: { title: 'Mi Documento', items: ['Uno', 'Dos', 'Tres'] }
})

decodeBase64Pdf(pdfBase64, 'mi-documento.pdf')`

const backendGen = `import { generatePDF } from 'react-pdf-levelup'
import { writeFileSync } from 'fs'
import { MyTemplate } from './MyTemplate'

const pdfBase64 = await generatePDF({
  template: MyTemplate,
  data: { title: 'Reporte', items: ['A', 'B'] }
})

const buffer = Buffer.from(pdfBase64, 'base64')
writeFileSync('reporte.pdf', buffer)`

export function HowItWorks() {
  const { t } = useTranslation()
  const steps = [
    {
      step: "01",
      title: t("how.steps.s1.title"),
      description: t("how.steps.s1.desc"),
      blocks: [
        {
          code: `npm install @react-pdf-levelup/core
npm install @react-pdf-levelup/qr // opcional para códigos QR
npm install @react-pdf-levelup/chart  // opcional para gráficos`,
          language: "bash" as const,
          filename: "terminal",
        },
      ],
    },
    {
      step: "02",
      title: t("how.steps.s2.title"),
      description: t("how.steps.s2.desc"),
      blocks: [
        {
          code: templateCode,
          language: "tsx" as const,
          filename: "MyTemplate.tsx",
        },
      ],
    },
    {
      step: "03",
      title: t("how.steps.s3.title"),
      description: t("how.steps.s3.desc"),
      blocks: [
        {
          code: frontendGen,
          language: "tsx" as const,
          filename: "frontend.tsx",
        },
        {
          code: backendGen,
          language: "ts" as const,
          filename: "backend.ts",
        },
      ],
    },
  ]
  return (
    <section id="como-funciona" className="border-t border-border px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-14">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl text-balance mb-3 sm:mb-4">
            {t("how.heading")}
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground">
            {t("how.subheading")}
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
