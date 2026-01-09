import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"

const templates = [
  {
    title: "CERTIFICATE OF ACHIEVEMENT",
    category: "certificate",
    image: "/imgTemplates/certificado.webp",
    href: "/playground/template/certificate",
  },
  {
    title: "factura simple",
    category: "factura",
    image: "/imgTemplates/factura.webp",
    href: "/playground/template/factura",
  },
   {
    title: "tablas basicas",
    category: "tablas",
    image: "/imgTemplates/tablas-basicas.webp",
    href: "/",
  },
  {
    title: "Qr example",
    category: "qr",
    image: "/imgTemplates/qr.webp",
    href: "/",
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
            asChild
          >
            <Link to="/templates">
              View All Templates
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="mt-8 sm:mt-12 grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {templates.map((template) => (
            <Link
              key={template.title}
              to={template.href}
              className="group relative overflow-hidden rounded-xl border border-border bg-card transition-all hover:border-accent/50 hover:shadow-lg hover:shadow-accent/5 block"
            >
              <div className="aspect-[16/9] sm:aspect-[4/3] bg-secondary/30 flex items-center justify-center overflow-hidden">
                <img
                  src={template.image}
                  alt={template.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-3 sm:p-4">
                <span className="text-xs font-medium text-accent">{template.category}</span>
                <h3 className="mt-1 text-base sm:text-lg font-semibold text-foreground  group-hover:text-accent lowercase">{template.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
