import { Check } from "lucide-react"
import { useTranslation } from "react-i18next"

const itemKeys = ["core", "flex", "fonts", "tables", "charts", "forms"] as const

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
  const { t } = useTranslation()
  return (
    <section id="hoja-de-ruta" className="border-t border-border px-4 py-16 sm:py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground lg:text-4xl text-balance">
            {t("roadmap.heading")}
          </h2>
          <p className="mt-3 sm:mt-4 text-base sm:text-lg text-muted-foreground">
            {t("roadmap.subheading")}
          </p>
        </div>

        <div className="mt-10 sm:mt-16 grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {itemKeys.map((key) => (
            <div
              key={key}
              className={`rounded-xl border p-4 sm:p-6 transition-colors ${getStatusStyles("completed")}`}
            >
              <div className="flex items-start gap-3 sm:gap-4">
                <div className={`shrink-0 rounded-lg p-1.5 sm:p-2 ${getIconStyles("completed")}`}>
                  <Check className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-semibold text-foreground">{t(`roadmap.items.${key}.title`)}</h3>
                  <p className="mt-1 text-xs sm:text-sm text-muted-foreground">{t(`roadmap.items.${key}.desc`)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
