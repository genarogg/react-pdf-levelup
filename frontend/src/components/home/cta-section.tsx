import { Button } from "@/components/ui/button"
import { ArrowRight, Github } from "lucide-react"

export function CtaSection() {
  return (
    <section className="border-t border-border px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-2xl border border-border bg-card px-6 py-16 sm:px-12 sm:py-24">
          <div className="absolute inset-0 -z-10">
            <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-accent/5 blur-3xl" />
            <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-accent/5 blur-3xl" />
          </div>

          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">
              Ready to Level Up Your PDF Game?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Join thousands of developers building beautiful PDFs with React. Start your project today.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-border bg-transparent text-foreground hover:bg-secondary"
              >
                <Github className="mr-2 h-4 w-4" />
                Star on GitHub
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
