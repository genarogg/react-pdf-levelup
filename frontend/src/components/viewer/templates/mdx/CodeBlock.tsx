import React, { useEffect, useState } from "react"
import type { HighlighterCore } from "shiki/core"

// El bundle "shiki/bundle-web" (o "bundle-full") trae DECENAS de lenguajes y
// temas precompilados, aunque solo usemos un puñado — eso infla el build en
// varios MB (se detectó al correr `vite build`, ver commit/PR). En su lugar
// usamos la API "fine-grained" de Shiki: motor JS puro (sin WASM) + solo los
// lenguajes y el tema que este viewer realmente necesita.
//
// El highlighter es costoso de construir, así que se instancia UNA sola vez
// para toda la app y se reutiliza entre todos los <CodeBlock>.
let highlighterPromise: Promise<HighlighterCore> | null = null

function getHighlighter(): Promise<HighlighterCore> {
  if (!highlighterPromise) {
    highlighterPromise = Promise.all([
      import("shiki/core"),
      import("shiki/engine/javascript"),
      import("shiki/themes/github-dark.mjs"),
      import("shiki/langs/tsx.mjs"),
      import("shiki/langs/jsx.mjs"),
      import("shiki/langs/typescript.mjs"),
      import("shiki/langs/javascript.mjs"),
      import("shiki/langs/json.mjs"),
      import("shiki/langs/bash.mjs"),
    ]).then(
      ([
        { createHighlighterCore },
        { createJavaScriptRegexEngine },
        githubDark,
        tsx,
        jsx,
        typescript,
        javascript,
        json,
        bash,
      ]) =>
        createHighlighterCore({
          themes: [githubDark],
          langs: [tsx, jsx, typescript, javascript, json, bash],
          engine: createJavaScriptRegexEngine(),
        })
    )
  }
  return highlighterPromise
}

interface CodeBlockProps {
  /** Código fuente, tal cual viene dentro del fence de markdown */
  code: string
  /** Lenguaje declarado en el fence (```tsx, ```jsx, etc). Cae a "tsx" si no se reconoce. */
  language?: string
  /** Título opcional mostrado en la barra superior del bloque (ej: nombre de archivo) */
  filename?: string
}

const SUPPORTED_LANGS = new Set(["tsx", "jsx", "typescript", "javascript", "json", "bash", "ts", "js"])

function normalizeLang(lang?: string): string {
  const clean = (lang || "").toLowerCase().trim()
  if (clean === "ts") return "typescript"
  if (clean === "js") return "javascript"
  if (SUPPORTED_LANGS.has(clean)) return clean
  return "tsx"
}

const CodeBlock: React.FC<CodeBlockProps> = ({ code, language, filename }) => {
  const [html, setHtml] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    let cancelled = false
    const lang = normalizeLang(language)

    getHighlighter().then((highlighter) => {
      if (cancelled) return
      const out = highlighter.codeToHtml(code.replace(/\n$/, ""), {
        lang,
        theme: "github-dark",
      })
      setHtml(out)
    })

    return () => {
      cancelled = true
    }
  }, [code, language])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // Sin permisos de portapapeles: no rompemos la UI por esto.
    }
  }

  return (
    <div className="relative rounded-lg border border-white/10 bg-[#0d1117] overflow-hidden my-4">
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 bg-white/[0.03]">
        <span className="text-xs font-mono text-gray-400">
          {filename || normalizeLang(language)}
        </span>
        <button
          onClick={handleCopy}
          className="text-xs text-gray-400 hover:text-white transition-colors px-2 py-1 rounded-md hover:bg-white/10"
        >
          {copied ? "¡Copiado!" : "Copiar"}
        </button>
      </div>

      {html ? (
        <div
          className="text-sm leading-relaxed overflow-x-auto [&>pre]:p-4 [&>pre]:!bg-transparent [&>pre]:m-0"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ) : (
        <pre className="p-4 text-sm text-gray-300 overflow-x-auto m-0">
          <code>{code}</code>
        </pre>
      )}
    </div>
  )
}

export default CodeBlock
