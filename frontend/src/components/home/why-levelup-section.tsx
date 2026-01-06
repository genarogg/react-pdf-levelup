import { Check, X } from "lucide-react"

export function WhyLevelupSection() {
  return (
    <section className="py-24 bg-gradient-to-b from-background to-muted/20">
      <div className="container px-4 mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-balance">Why React PDF Levelup?</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-balance">
            We've digested the complexity of React PDF so you don't have to.
            <br />
            Focus on building, not wrestling with PDFs.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* React PDF (Pure) */}
          <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
            <div className="mb-6">
              <h3 className="text-2xl font-bold mb-2">React PDF (Pure)</h3>
              <p className="text-muted-foreground">Powerful but requires significant setup</p>
            </div>

            <ul className="space-y-4">
              {[
                "Manual layout calculations",
                "Complex styling configurations",
                "Repetitive component structures",
                "Limited pre-built components",
                "Time-consuming table creation",
                "Custom theming from scratch",
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="mt-0.5 rounded-full bg-destructive/10 p-1 flex-shrink-0">
                    <X className="h-4 w-4 text-destructive" />
                  </div>
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* React PDF Levelup */}
          <div className="bg-gradient-to-br from-primary/5 via-cyan-500/5 to-primary/5 border-2 border-primary/20 rounded-2xl p-8 shadow-lg relative overflow-hidden">
            <div className="absolute top-4 right-4 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
              RECOMMENDED
            </div>

            <div className="mb-6">
              <h3 className="text-2xl font-bold mb-2">React PDF Levelup</h3>
              <p className="text-muted-foreground">Pre-digested DX for rapid development</p>
            </div>

            <ul className="space-y-4">
              {[
                "Ready-to-use templates",
                "Intuitive component API",
                "Pre-built tables, invoices & more",
                "TypeScript-first with IntelliSense",
                "Theme system out of the box",
                "Production-ready in minutes",
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="mt-0.5 rounded-full bg-primary/10 p-1 flex-shrink-0">
                    <Check className="h-4 w-4 text-primary" />
                  </div>
                  <span className="font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-3 bg-primary/10 border border-primary/20 rounded-full px-6 py-3">
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse"></div>
            <p className="text-sm font-medium">Built on top of React PDF - all the power, none of the pain</p>
          </div>
        </div>
      </div>
    </section>
  )
}
