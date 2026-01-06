import { Button } from "@/components/ui/button"
import { ArrowRight, FileText, Receipt, BookOpen, Mail } from "lucide-react"

const templates = [
  {
    icon: Receipt,
    title: "Invoice",
    description: "Professional invoice template with itemized billing, tax calculations, and company branding.",
    category: "Business",
  },
  {
    icon: FileText,
    title: "Resume / CV",
    description: "Clean, modern resume template optimized for ATS systems and professional presentation.",
    category: "Personal",
  },
  {
    icon: BookOpen,
    title: "Report",
    description: "Multi-page report template with headers, footers, table of contents, and charts.",
    category: "Business",
  },
  {
    icon: Mail,
    title: "Letter",
    description: "Formal letter template with proper formatting, letterhead, and signature sections.",
    category: "Personal",
  },
]

export function TemplatesSection() {
  return (
    <section id="templates" className="border-t border-border px-4 py-16 sm:py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground lg:text-4xl">
              Ready-to-Use Templates
            </h2>
            <p className="mt-2 text-base sm:text-lg text-muted-foreground">
              Start with professional templates and customize them to your needs.
            </p>
          </div>
          <Button
            variant="outline"
            className="w-full sm:w-auto border-border bg-transparent text-foreground hover:bg-secondary"
          >
            View All Templates
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <div className="mt-8 sm:mt-12 grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {templates.map((template) => (
            <div
              key={template.title}
              className="group relative overflow-hidden rounded-xl border border-border bg-card transition-all hover:border-accent/50 hover:shadow-lg hover:shadow-accent/5"
            >
              <div className="aspect-[16/9] sm:aspect-[4/3] bg-secondary/30 flex items-center justify-center">
                <template.icon className="h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground/30 group-hover:text-accent/50 transition-colors" />
              </div>
              <div className="p-3 sm:p-4">
                <span className="text-xs font-medium text-accent">{template.category}</span>
                <h3 className="mt-1 text-base sm:text-lg font-semibold text-foreground">{template.title}</h3>
                <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-muted-foreground line-clamp-2">
                  {template.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
