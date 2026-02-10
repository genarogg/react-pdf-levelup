import { Check, X } from "lucide-react"

export function WhyLevelupSection() {
  return (
    <section id="por-que-levelup" className="py-4 bg-gradient-to-b from-background to-muted/20">
      <div className="container px-4 mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-balance text-foreground">¿React pdf levelup vs React PDF?</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-balance">
            Hemos simplificado la complejidad de React PDF para que tú no tengas que hacerlo.
            <br />
            Concéntrate en construir, no en pelear con los PDFs.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* React PDF (Pure) */}
          <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
            <div className="mb-6">
              <h3 className="text-2xl font-bold mb-2 text-foreground">React PDF (Estándar)</h3>
              <p className="text-muted-foreground">Potente base, pero de bajo nivel</p>
            </div>

            <ul className="space-y-4">
              {[
                "Cálculos de diseño manuales",
                "Configuración de estilos compleja",
                "Estructuras repetitivas",
                "Sin componentes de alto nivel",
                "Crear tablas es doloroso",
                "Sin sistema de temas integrado",
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
          <div className="bg-gradient-to-br from-primary/5 via-cyan-500/5 to-primary/5 border border-primary/50 rounded-2xl p-8 shadow-lg relative overflow-hidden">
            <div className="absolute top-4 right-4 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
              RECOMENDADO
            </div>

            <div className="mb-6">
              <h3 className="text-2xl font-bold mb-2 text-foreground">React PDF Levelup</h3>
              <p className="text-muted-foreground">La capa superior que necesitas</p>
            </div>

            <ul className="space-y-4">
              {[
                "Plantillas listas para usar",
                "Componentes intuitivos (Tablas, QR)",
                "Previsualización en tiempo real",
                "TypeScript nativo con IntelliSense",
                "Sistema de temas incluido",
                "Listo para producción en minutos",
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="mt-0.5 rounded-full bg-primary/10 p-1 flex-shrink-0">
                    <Check className="h-4 w-4 text-primary" />
                  </div>
                  <span className="font-medium text-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-3 bg-primary/10 border border-primary/20 rounded-full px-6 py-3 built-on-badge">
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse"></div>
            <p className="text-sm font-medium text-foreground">Construido sobre React PDF - todo el poder, nada de dolor</p>
          </div>
        </div>
      </div>
    </section>
  )
}
