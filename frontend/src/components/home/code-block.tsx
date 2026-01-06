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

  console.log("Rendering CodeBlock with language:", language)

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative rounded-xl border border-border bg-card">
      {filename && (
        <div className="flex items-center justify-between border-b border-border bg-secondary/30 px-3 py-2 sm:px-4">
          <span className="text-xs sm:text-sm text-muted-foreground truncate">{filename}</span>
          <button
            onClick={handleCopy}
            className="shrink-0 ml-2 text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Copy code"
          >
            {copied ? <Check className="h-4 w-4 text-accent" /> : <Copy className="h-4 w-4" />}
          </button>
        </div>
      )}
      <div className="overflow-x-auto p-3 sm:p-4">
        <pre className="text-xs sm:text-sm leading-relaxed min-w-max">
          <code className="font-mono text-foreground block">
            {code.split("\n").map((line, i) => (
              <div key={i} className="flex">
                <span className="mr-4 w-6 sm:w-8 select-none text-right text-muted-foreground/50 shrink-0">
                  {i + 1}
                </span>
                <span className="whitespace-pre whitespace-nowrap">{highlightSyntax(line)}</span>
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
  const components = ["Document", "Page", "Text", "View", "ItemRow"]

  let result = line

  keywords.forEach((keyword) => {
    const regex = new RegExp(`\\b${keyword}\\b`, "g")
    result = result.replace(regex, `<span class="text-pink-400">${keyword}</span>`)
  })

  components.forEach((component) => {
    const regex = new RegExp(`<${component}|</${component}|\\b${component}\\b`, "g")
    result = result.replace(regex, (match) => `<span class="text-cyan-400">${match}</span>`)
  })

  result = result.replace(/'[^']*'/g, (match) => `<span class="text-green-400">${match}</span>`)
  result = result.replace(/\{[^}]*\}/g, (match) => `<span class="text-yellow-400">${match}</span>`)

  return <span dangerouslySetInnerHTML={{ __html: result }} />
}
