import { Zap, Shield, Palette, Code2 } from "lucide-react"

const features = [
  {
    icon: Code2,
    title: "Nativo de React",
    description: "Escribe PDFs usando los patrones que ya conoces. Componentes, props y JSX, sin aprender nuevas sintaxis extrañas.",
  },
  {
    icon: Shield,
    title: "TypeScript Completo",
    description: "Definiciones de tipos robustas para todos los componentes. Detecta errores mientras escribes, no en producción.",
  },
  {
    icon: Zap,
    title: "Rendimiento Optimizado",
    description: "Diseñado para la velocidad con renderizado eficiente y un tamaño de paquete mínimo. Genera documentos al instante.",
  },
  {
    icon: Palette,
    title: "Estilos Flexibles",
    description: "Estiliza tus PDFs con una API similar a CSS. Flexbox, fuentes personalizadas y diseños que se adaptan a tus necesidades.",
  },
]

export function ValueProposition() {
  return (
    <section id="features" className="border-t border-border px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">
            ¿Por qué react-pdf-levelup?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Todo lo que necesitas para crear documentos PDF profesionales con React.
          </p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group relative rounded-xl border border-border bg-card p-6 transition-colors hover:border-accent/50"
            >
              <div className="mb-4 inline-flex rounded-lg bg-accent/10 p-3">
                <feature.icon className="h-6 w-6 text-accent" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">{feature.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
