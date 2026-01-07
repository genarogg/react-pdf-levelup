const technologies = [
  {
    name: "React",
    description: "Crea PDFs usando componentes",
    icon: "https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original.svg",
  },
  {
    name: "TypeScript",
    description: "Tipado completo y seguro",
    icon: "https://raw.githubusercontent.com/devicons/devicon/master/icons/typescript/typescript-original.svg",
  },
  {
    name: "Next.js",
    description: "Soporte para SSR y SSG",
    icon: "https://raw.githubusercontent.com/devicons/devicon/master/icons/nextjs/nextjs-original.svg",
  },
  {
    name: "Vite",
    description: "Desarrollo ultrarrápido",
    icon: "https://raw.githubusercontent.com/devicons/devicon/master/icons/vitejs/vitejs-original.svg",
  },
  {
    name: "Node.js",
    description: "Renderizado del lado del servidor",
    icon: "https://raw.githubusercontent.com/devicons/devicon/master/icons/nodejs/nodejs-original.svg",
  },
  {
    name: "Bun",
    description: "Soporte para runtime rápido",
    icon: "https://raw.githubusercontent.com/devicons/devicon/master/icons/bun/bun-original.svg",
  },
]

export function TechStackSection() {
  return (
    <section id="stack" className="border-t border-border px-4 py-16 sm:py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground lg:text-4xl text-balance">
            Funciona con tu stack
          </h2>
          <p className="mt-3 sm:mt-4 text-base sm:text-lg text-muted-foreground">
            Integración perfecta con las herramientas que ya utilizas.
          </p>
        </div>

        <div className="mt-10 sm:mt-16 grid grid-cols-3 gap-3 sm:gap-4 lg:grid-cols-6">
          {technologies.map((tech) => (
            <div
              key={tech.name}
              className="flex flex-col items-center rounded-xl border border-border bg-card p-3 sm:p-6 text-center transition-colors hover:border-accent/50"
            >
              <div className="mb-2 sm:mb-3 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg bg-secondary">
                <img
                  src={tech.icon}
                  alt={tech.name}
                  className="h-5 w-5 sm:h-6 sm:w-6 object-contain"
                  loading="lazy"
                />
              </div>

              <h3 className="text-xs sm:text-sm font-semibold text-foreground">
                {tech.name}
              </h3>

              <p className="hidden sm:block mt-1 text-xs text-muted-foreground">
                {tech.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
