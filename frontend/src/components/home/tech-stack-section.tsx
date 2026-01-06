const technologies = [
  { name: "React", description: "Build PDFs with components" },
  { name: "TypeScript", description: "Full type safety" },
  { name: "Next.js", description: "SSR & SSG support" },
  { name: "Vite", description: "Lightning fast dev" },
  { name: "Node.js", description: "Server-side rendering" },
  { name: "Bun", description: "Fast runtime support" },
]

export function TechStackSection() {
  return (
    <section className="border-t border-border px-4 py-16 sm:py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground lg:text-4xl text-balance">
            Works With Your Stack
          </h2>
          <p className="mt-3 sm:mt-4 text-base sm:text-lg text-muted-foreground">
            Seamless integration with the tools you already use.
          </p>
        </div>

        <div className="mt-10 sm:mt-16 grid grid-cols-3 gap-3 sm:gap-4 lg:grid-cols-6">
          {technologies.map((tech) => (
            <div
              key={tech.name}
              className="flex flex-col items-center rounded-xl border border-border bg-card p-3 sm:p-6 text-center transition-colors hover:border-accent/50"
            >
              <div className="mb-2 sm:mb-3 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg bg-secondary text-sm sm:text-lg font-bold text-foreground">
                {tech.name.charAt(0)}
              </div>
              <h3 className="text-xs sm:text-sm font-semibold text-foreground">{tech.name}</h3>
              <p className="hidden sm:block mt-1 text-xs text-muted-foreground">{tech.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
