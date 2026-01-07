


export function Footer() {
  return (
    <footer className="mt-8  border-t border-border pt-6 sm:p-8">
      <p className="text-center text-xs sm:text-sm text-muted-foreground">
        © {new Date().getFullYear()} react-pdf-levelup. Open source under MIT License.
      </p>
    </footer>
  )
}