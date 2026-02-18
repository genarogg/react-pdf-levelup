import { Building2, GraduationCap, Briefcase, Code2 } from "lucide-react"
import { useTranslation } from "react-i18next"

const caseDefs = [
  { key: "business", icon: Building2 },
  { key: "education", icon: GraduationCap },
  { key: "ecommerce", icon: Briefcase },
  { key: "saas", icon: Code2 },
]

export function UseCasesSection() {
  const { t } = useTranslation()
  return (
    <section id="casos-uso" className="border-t border-border px-4 py-16 sm:py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground lg:text-4xl text-balance">
            {t("use.heading")}
          </h2>
          <p className="mt-3 sm:mt-4 text-base sm:text-lg text-muted-foreground">
            {t("use.subheading")}
          </p>
        </div>

        <div className="mt-10 sm:mt-16 grid gap-4 sm:gap-8 sm:grid-cols-2">
          {caseDefs.map(({ key, icon: Icon }) => {
            const examples = t(`use.cases.${key}.examples`, { returnObjects: true }) as string[]
            return (
            <div
              key={key}
              className="rounded-xl border border-border bg-card p-4 sm:p-6"
            >
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="shrink-0 rounded-lg bg-accent/10 p-2 sm:p-3">
                  <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-semibold text-foreground">
                    {t(`use.cases.${key}.title`)}
                  </h3>
                  <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {t(`use.cases.${key}.desc`)}
                  </p>
                  <div className="mt-3 sm:mt-4 flex flex-wrap gap-1.5 sm:gap-2">
                    {examples.map((example) => (
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
          )})}
        </div>
      </div>
    </section>
  )
}
