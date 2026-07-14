import React from "react"
import CodeBlock from "./CodeBlock"

/**
 * MDX compila un code fence (```tsx ... ```) a una de estas dos formas,
 * según versión/config de @mdx-js/mdx:
 *
 *   A) <pre><code className="language-tsx">texto</code></pre>
 *   B) <pre className="language-tsx">texto</pre>   (sin <code> hijo)
 *
 * getCodeInfo cubre ambos casos con una sola lógica: primero busca el
 * className en el propio <pre>, y si no está, en un <code> hijo directo.
 * El texto se extrae recursivamente por si vinieran nodos anidados.
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

function getLangFromClassName(className?: string): string | undefined {
  return /language-(\w+)/.exec(className || "")?.[1]
}

interface PreProps extends React.ComponentPropsWithoutRef<"pre"> {
  className?: string
}

function Pre(props: PreProps) {
  const { children, className } = props

  // ¿El hijo directo es un <code>? (Caso A)
  const codeChild =
    React.isValidElement(children) && children.type === "code"
      ? (children as React.ReactElement<{ className?: string; children?: React.ReactNode }>)
      : null

  const lang =
    getLangFromClassName(className) ??
    getLangFromClassName(codeChild?.props.className)

  const code = codeChild ? extractText(codeChild.props.children) : extractText(children)

  // Un <pre> de code fence siempre trae texto (o un <code> con texto)
  // como contenido. Si no hay nada de texto real, no es un bloque de
  // código: se deja el <pre> tal cual vino.
  if (!code.trim()) {
    return <pre {...props} />
  }

  return <CodeBlock code={code} language={lang} />
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