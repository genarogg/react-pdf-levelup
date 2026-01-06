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
    <section className="border-t border-border px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl text-balance mb-3 sm:mb-4">
            How It Works
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground">
            Get from zero to PDF in under 5 minutes
          </p>
        </div>

        <div className="space-y-8 sm:space-y-10 lg:space-y-12">
          {steps.map((item) => (
            <div key={item.step} className="flex gap-3 sm:gap-4 lg:gap-6">
              <div className="flex-shrink-0">
                <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-cyan-500 text-base sm:text-lg font-bold text-white">
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
                <div className="overflow-x-auto">
                  <CodeBlock code={item.code} language={item.language} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
