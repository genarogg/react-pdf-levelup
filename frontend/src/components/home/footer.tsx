import { Link } from "react-router-dom"
import { FileText, Github, Twitter } from "lucide-react"

const footerLinks = {
  product: [
    { label: "Features", href: "#features" },
    { label: "Templates", href: "#templates" },
    { label: "Pricing", href: "#" },
    { label: "Changelog", href: "#" },
  ],
  resources: [
    { label: "Documentation", href: "#docs" },
    { label: "API Reference", href: "#" },
    { label: "Examples", href: "#" },
    { label: "Blog", href: "#" },
  ],
  company: [
    { label: "About", href: "#" },
    { label: "GitHub", href: "#" },
    { label: "Twitter", href: "#" },
    { label: "Discord", href: "#" },
  ],
}

export function Footer() {
  return (
    <footer className="border-t border-border px-4 py-10 sm:py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-4">
          {/* Brand section */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2">
              <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-accent" />
              <span className="text-base sm:text-lg font-semibold text-foreground">react-pdf-levelup</span>
            </Link>
            <p className="mt-3 sm:mt-4 text-sm text-muted-foreground max-w-xs">
              The modern way to create PDF documents using React components.
            </p>
            <div className="mt-4 flex gap-4">
              <a href="#" className="text-muted-foreground transition-colors hover:text-foreground">
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </a>
              <a href="#" className="text-muted-foreground transition-colors hover:text-foreground">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </a>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 sm:gap-8 lg:col-span-3">
            <div>
              <h3 className="text-xs sm:text-sm font-semibold text-foreground">Product</h3>
              <ul className="mt-3 sm:mt-4 space-y-2 sm:space-y-3">
                {footerLinks.product.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-xs sm:text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xs sm:text-sm font-semibold text-foreground">Resources</h3>
              <ul className="mt-3 sm:mt-4 space-y-2 sm:space-y-3">
                {footerLinks.resources.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-xs sm:text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xs sm:text-sm font-semibold text-foreground">Company</h3>
              <ul className="mt-3 sm:mt-4 space-y-2 sm:space-y-3">
                {footerLinks.company.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-xs sm:text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 sm:mt-12 border-t border-border pt-6 sm:pt-8">
          <p className="text-center text-xs sm:text-sm text-muted-foreground">
            © {new Date().getFullYear()} react-pdf-levelup. Open source under MIT License.
          </p>
        </div>
      </div>
    </footer>
  )
}