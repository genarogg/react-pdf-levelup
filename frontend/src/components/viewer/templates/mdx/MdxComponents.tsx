import React from "react"
import CodeBlock from "./CodeBlock"

/**
 * MDX compila un code fence:
 *
 *   ```tsx
 *   const x = 1
 *   ```
 *
 * a: <pre><code className="language-tsx">const x = 1\n</code></pre>
 *
 * Interceptamos <pre> (no <code>, porque MDX también usa <code> suelto para
 * `inline code`) y extraemos el lenguaje + texto plano del <code> hijo para
 * pasárselo a nuestro CodeBlock con resaltado Shiki.
 */

function extractText(node: React.ReactNode): string {
  if (typeof node === "string") return node
  if (typeof node === "number") return String(node)
  if (Array.isArray(node)) return node.map(extractText).join("")
  if (React.isValidElement(node)) {
    const children = (node.props as { children?: React.ReactNode })?.children
    return extractText(children)
  }
  return ""
}

function Pre(props: React.ComponentPropsWithoutRef<"pre">) {
  const { children } = props

  if (React.isValidElement(children) && children.type === "code") {
    const codeProps = children.props as { className?: string; children?: React.ReactNode }
    const className = codeProps.className || ""
    const langMatch = /language-(\w+)/.exec(className)
    const code = extractText(codeProps.children)

    return <CodeBlock code={code} language={langMatch?.[1]} />
  }

  // Fallback: <pre> sin un <code> hijo directo, se deja tal cual.
  return <pre {...props} />
}

function InlineCode(props: React.ComponentPropsWithoutRef<"code">) {
  return (
    <code
      className="px-1.5 py-0.5 rounded bg-white/10 text-[0.9em] font-mono text-blue-200"
      {...props}
    />
  )
}

function H1(props: React.ComponentPropsWithoutRef<"h1">) {
  return <h1 className="text-2xl font-bold text-white mt-6 mb-3" {...props} />
}
function H2(props: React.ComponentPropsWithoutRef<"h2">) {
  return <h2 className="text-xl font-semibold text-white mt-6 mb-3" {...props} />
}
function H3(props: React.ComponentPropsWithoutRef<"h3">) {
  return <h3 className="text-lg font-semibold text-white mt-4 mb-2" {...props} />
}
function P(props: React.ComponentPropsWithoutRef<"p">) {
  return <p className="text-sm text-gray-300 leading-relaxed mb-3" {...props} />
}
function UL(props: React.ComponentPropsWithoutRef<"ul">) {
  return <ul className="list-disc list-inside text-sm text-gray-300 mb-3 space-y-1" {...props} />
}
function A(props: React.ComponentPropsWithoutRef<"a">) {
  return <a className="text-blue-400 hover:text-blue-300 underline" {...props} />
}

export const mdxComponents = {
  pre: Pre,
  code: InlineCode,
  h1: H1,
  h2: H2,
  h3: H3,
  p: P,
  ul: UL,
  a: A,
}
