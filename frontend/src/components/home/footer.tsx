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
    <footer className="mt-8  border-t border-border pt-6 sm:p-8">
      <p className="text-center text-xs sm:text-sm text-muted-foreground">
        © {new Date().getFullYear()} react-pdf-levelup. Open source under MIT License.
      </p>
    </footer>
  )
}