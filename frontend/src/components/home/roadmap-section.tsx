import { Check, Clock, Sparkles } from "lucide-react"

const roadmapItems = [
  {
    status: "completed",
    title: "Componentes Core",
    description: "Layout, Header, texto (H1–H6, P, Strong, Em), listas, QR y columnas (Container, Row, Col1–Col12)",
    icon: Check,
  },
  {
    status: "completed",
    title: "Diseño Flexbox",
    description: "Soporte completo de flexbox para diseños complejos",
    icon: Check,
  },
  {
    status: "completed",
    title: "Fuentes Personalizadas",
    description: "Registro y uso de familias de fuentes con distintos pesos",
    icon: Check,
  },
  {
    status: "in-progress",
    title: "Tablas",
    description: "Thead, Tbody, Tr, Th y Td con paginación automática",
    icon: Clock,
  },
  {
    status: "planned",
    title: "Gráficos y Diagramas",
    description: "Componentes para visualización de datos integrados",
    icon: Sparkles,
  },
  {
    status: "planned",
    title: "Campos de Formulario",
    description: "Inputs PDF interactivos y elementos de formulario",
    icon: Sparkles,
  },
]

function getStatusStyles(status: string) {
  switch (status) {
    case "completed":
      return "border-accent/50 bg-accent/5"
    case "in-progress":
      return "border-yellow-500/50 bg-yellow-500/5"
    default:
      return "border-border bg-card"
  }
}

function getIconStyles(status: string) {
  switch (status) {
    case "completed":
      return "bg-accent/10 text-accent"
    case "in-progress":
      return "bg-yellow-500/10 text-yellow-500"
    default:
      return "bg-secondary text-muted-foreground"
  }
}

export function RoadmapSection() {
  return (
    <section id="hoja-de-ruta" className="border-t border-border px-4 py-16 sm:py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground lg:text-4xl text-balance">
            Hoja de Ruta
          </h2>
          <p className="mt-3 sm:mt-4 text-base sm:text-lg text-muted-foreground">
            Lo que hemos construido y lo que viene después.
          </p>
        </div>

        <div className="mt-10 sm:mt-16 grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {roadmapItems.map((item) => (
            <div
              key={item.title}
              className={`rounded-xl border p-4 sm:p-6 transition-colors ${getStatusStyles(item.status)}`}
            >
              <div className="flex items-start gap-3 sm:gap-4">
                <div className={`shrink-0 rounded-lg p-1.5 sm:p-2 ${getIconStyles(item.status)}`}>
                  <item.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-semibold text-foreground">{item.title}</h3>
                  <p className="mt-1 text-xs sm:text-sm text-muted-foreground">{item.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
