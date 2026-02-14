import { Button } from "@/components/ui/button"
import { ArrowRight, FileText, Receipt, Table, QrCode } from "lucide-react"
import { Link } from "react-router-dom"

const templates = [
  {
    title: "Certificate of Achievement",
    category: "Certificado",
    image: "/imgTemplates/certificado.webp",
    href: "/playground/template/certificate",
    icon: FileText,
    color: "from-blue-500/20 to-cyan-500/20",
    borderColor: "group-hover:border-blue-500/50",
  },
  // {
  //   title: "Factura Simple",
  //   category: "Factura",
  //   image: "/imgTemplates/factura.webp",
  //   href: "/playground/template/factura",
  //   icon: Receipt,
  //   color: "from-emerald-500/20 to-green-500/20",
  //   borderColor: "group-hover:border-emerald-500/50",
  // },
  {
    title: "Tablas Básicas",
    category: "Tablas",
    image: "/imgTemplates/tablas-mini.webp",
    href: "/playground/template/tablasTemplateBasico",
    icon: Table,
    color: "from-purple-500/20 to-pink-500/20",
    borderColor: "group-hover:border-purple-500/50",
  },
  {
    title: "QR Example",
    category: "QR Code",
    image: "/imgTemplates/template-qr-mini.webp",
    href: "/playground/template/QRTemplate",
    icon: QrCode,
    color: "from-orange-500/20 to-red-500/20",
    borderColor: "group-hover:border-orange-500/50",
  },
   {
    title: "Factura Avanzada",
    category: "Factura",
    image: "/imgTemplates/template-invoce-mini.webp",
    href: "/playground/template/facturaInvoice",
    icon: Receipt,
    color: "from-orange-500/20 to-red-500/20",
    borderColor: "group-hover:border-orange-500/50",
  },
]

export function TemplatesSection() {
  return (
    <section id="templates" className="border-t border-border px-4 py-16 sm:py-24 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-secondary/20">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-12">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
              </span>
              Plantillas Profesionales
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground lg:text-5xl">
              Plantillas Listas para Usar
            </h2>
            <p className="mt-2 text-base sm:text-lg text-muted-foreground max-w-2xl">
              Comienza con plantillas profesionales y personalízalas según tus necesidades.
              Formato optimizado y diseño moderno.
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

        {/* Templates Grid */}
        <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {templates.map((template, index) => {
            const Icon = template.icon
            return (
              <Link
                key={template.title}
                to={template.href}
                className={`group relative overflow-hidden rounded-2xl border-2 border-border bg-card transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${template.borderColor} block`}
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                {/* Gradient Overlay Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${template.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                
                {/* Image Container - 16/9 Aspect Ratio */}
                <div className="relative aspect-video overflow-hidden bg-secondary/30">
                  {/* Decorative Corner Badge */}
                  <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 rounded-lg bg-background/90 backdrop-blur-sm px-3 py-1.5 shadow-lg border border-border">
                    <Icon className="h-3.5 w-3.5 text-accent" />
                    <span className="text-xs font-semibold text-accent uppercase tracking-wide">
                      {template.category}
                    </span>
                  </div>

                  {/* Image */}
                  <img
                    src={template.image}
                    alt={template.title}
                    className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:rotate-1"
                  />

                  {/* Gradient Overlay on Image */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
                </div>

                {/* Content */}
                <div className="relative p-4">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-base font-bold text-foreground group-hover:text-accent transition-colors duration-300 line-clamp-1">
                      {template.title}
                    </h3>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-accent group-hover:translate-x-1 transition-all duration-300 flex-shrink-0" />
                  </div>
                  
                  {/* Progress bar effect */}
                  <div className="h-0.5 w-0 bg-gradient-to-r from-accent to-accent/50 group-hover:w-full transition-all duration-500 rounded-full mt-3" />
                </div>

                {/* Shine Effect */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              </Link>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <p className="text-sm text-muted-foreground">
            ¿No encuentras lo que buscas?{" "}
            <Link to="/templates" className="font-medium text-accent hover:underline">
              Explora más plantillas
            </Link>
          </p>
        </div>
      </div>
    </section>
  )
}