import { CodeBlock } from "./code-block"

const steps = [
  {
    step: "01",
    title: "Install the library",
    description: "Add react-pdf-levelup to your project with npm or yarn.",
    code: `npm install react-pdf-levelup
# or
yarn add react-pdf-levelup`,
    language: "bash" as const,
  },
  {
    step: "02",
    title: "Import a template",
    description: "Choose from pre-built templates or create your own components.",
    code: `import { Invoice, PDFViewer } from 'react-pdf-levelup';
// Or import individual components
import { Page, Header, Table } from 'react-pdf-levelup';`,
    language: "tsx" as const,
  },
  {
    step: "03",
    title: "Generate your PDF",
    description: "Pass your data and download or display your PDF instantly.",
    code: `<PDFViewer>
  <Invoice
    client={clientData}
    items={lineItems}
    onRender={(blob) => console.log('PDF ready!')}
  />
</PDFViewer>`,
    language: "tsx" as const,
  },
]

export function HowItWorks() {
  return (
    <section className="border-t border-border px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance mb-4">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground">Get from zero to PDF in under 5 minutes</p>
        </div>

        <div className="space-y-12">
          {steps.map((item) => (
            <div key={item.step} className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cyan-500 text-lg font-bold text-white">
                  {item.step}
                </div>
              </div>

              <div className="flex-1 pt-1">
                <h3 className="text-xl font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-muted-foreground mb-4 leading-relaxed">{item.description}</p>
                <CodeBlock code={item.code} language={item.language} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
