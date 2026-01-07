"use client"

import { useState } from "react"
import { Copy, Check } from "lucide-react"

interface CodeBlockProps {
  code: string
  language: string
  filename?: string
}

export function CodeBlock({ code, language, filename }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative rounded-xl border border-border bg-card shadow-sm">
      {filename && (
        <div className="flex items-center justify-between border-b border-border bg-secondary/40 px-3 py-2 sm:px-4">
          <span className="text-xs sm:text-sm text-muted-foreground truncate font-mono">{filename}</span>
          <button
            onClick={handleCopy}
            className="shrink-0 ml-2 text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Copy code"
          >
            {copied ? <Check className="h-4 w-4 text-accent" /> : <Copy className="h-4 w-4" />}
          </button>
        </div>
      )}
      <div className="overflow-auto p-3 sm:p-4">
        <pre className="font-mono text-[13px] sm:text-sm leading-relaxed min-w-full">
          <code className="text-foreground block">
            {code.split("\n").map((line, i) => (
              <div key={i} className="flex">
                <span className="mr-4 w-8 sm:w-10 select-none text-right text-muted-foreground/50 shrink-0">
                  {i + 1}
                </span>
                <span className="whitespace-pre">{highlightSyntax(line)}</span>
              </div>
            ))}
          </code>
        </pre>
      </div>
    </div>
  )
}

function highlightSyntax(line: string) {
  const keywords = ["import", "export", "function", "return", "const", "from"]
  const components = ["Document", "Page", "Text", "View", "ItemRow", "Image", "Link", "StyleSheet", "QR", "Header", "H1", "H2", "P", "Strong", "Em", "Table", "Thead", "Tbody", "Tr", "Th", "Td"]

  // Escape HTML so that JSX tags render as text, not HTML
  const escapeHtml = (str: string) =>
    str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;")

  let result = escapeHtml(line)

  // Comments
  result = result.replace(/(\/\/.*)$/g, `<span class="text-gray-400">$1</span>`)
  result = result.replace(/\/\*.*?\*\//g, (m) => `<span class="text-gray-400">${m}</span>`)

  // Keywords
  keywords.forEach((keyword) => {
    const regex = new RegExp(`\\b${keyword}\\b`, "g")
    result = result.replace(regex, `<span class="text-fuchsia-400">${keyword}</span>`)
  })

  // Components (match &lt;Component, &lt;/Component or standalone word)
  components.forEach((component) => {
    const regex = new RegExp(`(&lt;\\/?${component}\\b|\\b${component}\\b)`, "g")
    result = result.replace(regex, (match) => `<span class="text-cyan-400">${match}</span>`)
  })

  // Strings and template pieces
  result = result.replace(/&#39;[^&#39;]*&#39;/g, (match) => `<span class="text-emerald-400">${match}</span>`)
  result = result.replace(/&quot;[^&quot;]*&quot;/g, (match) => `<span class="text-emerald-400">${match}</span>`)

  // Template braces (solo colorear las llaves, no el contenido)
  result = result.replace(/\{/g, `<span class="text-amber-400">{</span>`)
  result = result.replace(/\}/g, `<span class="text-amber-400">}</span>`)

  // Arrow functions
  result = result.replace(/=&gt;/g, `<span class="text-fuchsia-400">=&gt;</span>`)

  return <span dangerouslySetInnerHTML={{ __html: result }} />
}
