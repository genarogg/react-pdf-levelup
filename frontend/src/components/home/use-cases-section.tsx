import { Building2, GraduationCap, Briefcase, Code2 } from "lucide-react"

const useCases = [
  {
    icon: Building2,
    title: "Enterprise",
    description: "Generate reports, contracts, and documentation at scale with consistent branding.",
    examples: ["Financial Reports", "Legal Documents", "HR Contracts"],
  },
  {
    icon: GraduationCap,
    title: "Education",
    description: "Create certificates, transcripts, and educational materials programmatically.",
    examples: ["Certificates", "Report Cards", "Course Materials"],
  },
  {
    icon: Briefcase,
    title: "E-Commerce",
    description: "Automate invoice generation, shipping labels, and order confirmations.",
    examples: ["Invoices", "Receipts", "Shipping Labels"],
  },
  {
    icon: Code2,
    title: "SaaS Applications",
    description: "Add PDF export functionality to your web application with minimal effort.",
    examples: ["Data Exports", "User Reports", "Analytics Dashboards"],
  },
]

export function UseCasesSection() {
  return (
    <section className="border-t border-border px-4 py-16 sm:py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground lg:text-4xl text-balance">
            Built for Every Use Case
          </h2>
          <p className="mt-3 sm:mt-4 text-base sm:text-lg text-muted-foreground">
            From startups to enterprises, react-pdf-levelup powers PDF generation across industries.
          </p>
        </div>

        <div className="mt-10 sm:mt-16 grid gap-4 sm:gap-8 sm:grid-cols-2">
          {useCases.map((useCase) => (
            <div key={useCase.title} className="rounded-xl border border-border bg-card p-4 sm:p-6">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="shrink-0 rounded-lg bg-accent/10 p-2 sm:p-3">
                  <useCase.icon className="h-5 w-5 sm:h-6 sm:w-6 text-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-semibold text-foreground">{useCase.title}</h3>
                  <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {useCase.description}
                  </p>
                  <div className="mt-3 sm:mt-4 flex flex-wrap gap-1.5 sm:gap-2">
                    {useCase.examples.map((example) => (
                      <span
                        key={example}
                        className="rounded-full bg-secondary px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs text-muted-foreground"
                      >
                        {example}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
