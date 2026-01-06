import { Zap, Shield, Palette, Code2 } from "lucide-react"

const features = [
  {
    icon: Code2,
    title: "React-First Approach",
    description: "Write PDFs using familiar React patterns. Components, props, and JSX - everything you already know.",
  },
  {
    icon: Shield,
    title: "Full TypeScript Support",
    description: "Complete type definitions for all components. Catch errors at compile time, not runtime.",
  },
  {
    icon: Zap,
    title: "Optimized Performance",
    description: "Built for speed with lazy loading, efficient rendering, and minimal bundle size.",
  },
  {
    icon: Palette,
    title: "Flexible Styling",
    description: "Style your PDFs with a CSS-like API. Flexbox layout, custom fonts, and responsive designs.",
  },
]

export function ValueProposition() {
  return (
    <section id="features" className="border-t border-border px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">
            Why react-pdf-levelup?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Everything you need to create professional PDF documents with React.
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
