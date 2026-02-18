import { Zap, Shield, Palette, Code2 } from "lucide-react"
import { useTranslation } from "react-i18next"

const features = [
  { icon: Code2, key: "react" },
  { icon: Shield, key: "typescript" },
  { icon: Zap, key: "performance" },
  { icon: Palette, key: "styling" },
]

export function ValueProposition() {
  const { t } = useTranslation()
  return (
    <section id="features" className="border-t border-border px-4 py-16 sm:py-24 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-secondary/20">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">
            {t("value.heading")}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {t("value.subheading")}
          </p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.key}
              className="group relative rounded-xl border border-border bg-card p-6 transition-colors hover:border-accent/50"
            >
              <div className="mb-4 inline-flex rounded-lg bg-accent/10 p-3">
                <feature.icon className="h-6 w-6 text-accent" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">
                {t(`value.features.${feature.key}.title`)}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {t(`value.features.${feature.key}.desc`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
