import { Check, X } from "lucide-react"

const comparisonData = [
  { feature: "React Components", levelup: true, pdfkit: false, jspdf: false },
  { feature: "TypeScript Support", levelup: true, pdfkit: "Partial", jspdf: "Partial" },
  { feature: "Flexbox Layout", levelup: true, pdfkit: false, jspdf: false },
  { feature: "SSR Compatible", levelup: true, pdfkit: true, jspdf: false },
  { feature: "Custom Fonts", levelup: true, pdfkit: true, jspdf: true },
  { feature: "Image Support", levelup: true, pdfkit: true, jspdf: true },
  { feature: "Learning Curve", levelup: "Low", pdfkit: "High", jspdf: "Medium" },
  { feature: "Bundle Size", levelup: "~45kb", pdfkit: "~200kb", jspdf: "~80kb" },
]

function renderCell(value: boolean | string) {
  if (value === true) return <Check className="h-4 w-4 sm:h-5 sm:w-5 text-accent" />
  if (value === false) return <X className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground/50" />
  return <span className="text-xs sm:text-sm text-muted-foreground">{value}</span>
}

function MobileComparisonCard({ row }: { row: (typeof comparisonData)[0] }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <h3 className="font-medium text-foreground mb-3">{row.feature}</h3>
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="flex flex-col items-center gap-1">
          <span className="text-[10px] uppercase tracking-wider text-accent font-medium">levelup</span>
          {renderCell(row.levelup)}
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">PDFKit</span>
          {renderCell(row.pdfkit)}
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">jsPDF</span>
          {renderCell(row.jspdf)}
        </div>
      </div>
    </div>
  )
}

export function ComparisonSection() {
  return (
    <section className="border-t border-border px-4 py-16 sm:py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground lg:text-4xl text-balance">
            How We Compare
          </h2>
          <p className="mt-3 sm:mt-4 text-base sm:text-lg text-muted-foreground">
            See how react-pdf-levelup stacks up against other PDF libraries.
          </p>
        </div>

        <div className="mt-10 sm:mt-16 flex flex-col gap-3 md:hidden">
          {comparisonData.map((row) => (
            <MobileComparisonCard key={row.feature} row={row} />
          ))}
        </div>

        <div className="mt-16 overflow-x-auto hidden md:block">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-border">
                <th className="py-4 text-left text-sm font-medium text-muted-foreground">Feature</th>
                <th className="px-4 lg:px-6 py-4 text-center text-sm font-semibold text-accent">react-pdf-levelup</th>
                <th className="px-4 lg:px-6 py-4 text-center text-sm font-medium text-muted-foreground">PDFKit</th>
                <th className="px-4 lg:px-6 py-4 text-center text-sm font-medium text-muted-foreground">jsPDF</th>
              </tr>
            </thead>
            <tbody>
              {comparisonData.map((row) => (
                <tr key={row.feature} className="border-b border-border/50">
                  <td className="py-4 text-sm text-foreground">{row.feature}</td>
                  <td className="px-4 lg:px-6 py-4">
                    <div className="flex justify-center items-center">{renderCell(row.levelup)}</div>
                  </td>
                  <td className="px-4 lg:px-6 py-4">
                    <div className="flex justify-center items-center">{renderCell(row.pdfkit)}</div>
                  </td>
                  <td className="px-4 lg:px-6 py-4">
                    <div className="flex justify-center items-center">{renderCell(row.jspdf)}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
