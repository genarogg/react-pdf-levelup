import { useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { FileText, Github, Menu, X } from "lucide-react"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 sm:h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-accent" />
          <span className="text-base sm:text-lg font-semibold text-foreground">
            <span className="hidden xs:inline">react-pdf-levelup</span>
            <span className="xs:hidden">pdf-levelup</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 lg:gap-8 md:flex">
          <Link to="#features" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Features
          </Link>
          <Link to="#templates" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Templates
          </Link>
          <Link to="#docs" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Docs
          </Link>
          <Link to="#faq" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            FAQ
          </Link>
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <a href="https://github.com" target="_blank" rel="noopener noreferrer">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
              <Github className="h-5 w-5" />
              <span className="sr-only">GitHub</span>
            </Button>
          </a>
          <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
            Get Started
          </Button>
        </div>

        <button
          className="flex items-center justify-center h-10 w-10 -mr-2 md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-border md:hidden animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col gap-1 px-4 py-4">
            <Link
              to="#features"
              className="rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Features
            </Link>
            <Link
              to="#templates"
              className="rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Templates
            </Link>
            <Link
              to="#docs"
              className="rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Docs
            </Link>
            <Link
              to="#faq"
              className="rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              FAQ
            </Link>
            <div className="flex items-center gap-3 pt-4 mt-2 border-t border-border">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="flex-shrink-0">
                <Button variant="outline" size="sm" className="border-border bg-transparent">
                  <Github className="h-4 w-4 mr-2" />
                  GitHub
                </Button>
              </a>
              <Button size="sm" className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
                Get Started
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}