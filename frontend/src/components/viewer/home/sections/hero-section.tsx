"use client"

import { Button } from "@/components/ui/button"
import { CodeBlock } from "./code-block"
import { ArrowRight, Copy, Check } from "lucide-react"
import { useState } from "react"
import { Link } from "react-router-dom"

const heroCode = 
`import { P, Layout, HR, Strong, H4, Em } from '@react-pdf-levelup/core'
import { QR } from '@react-pdf-levelup/qr'

const Component = ({ data }) => {
  return (
    <Layout>
      <H4>Documento de Presentación</H4>
      <P>
        Bienvenido a <Strong style={{color:"#3d65fd"}}>react-pdf-levelup</Strong>.
        Con esta librería puedes construir PDFs usando componentes de
        React de forma <Em>rápida</Em> y <Em>tipada</Em>.
      </P>
      <HR />
      <P>
        Gracias por usar <Strong>react-pdf-levelup</Strong>. 
        Explora el Playground y crea tu propio template.
      </P>
      <QR value="https://react-pdf-levelup.nimbux.cloud" size={120} />
    </Layout>
  )
}`


export function HeroSection() {
  const [copied, setCopied] = useState(false)
  const installCommand = "npm install @react-pdf-levelup/core"

  const handleCopy = () => {
    navigator.clipboard.writeText(installCommand)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section className="relative overflow-hidden px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[400px] sm:h-[600px] sm:w-[600px] rounded-full bg-accent/5 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-16 lg:items-center">
          <div className="flex flex-col gap-4 sm:gap-6">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-secondary/50 hero-badge px-3 py-1 text-xs sm:px-4 sm:py-1.5 sm:text-sm text-muted-foreground">
              <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-accent" />
              Código abierto y gratuito
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl lg:text-6xl text-balance">
              Crea PDFs hermosos con <span className="text-accent">Componentes de React</span>
            </h1>

            <p className="text-base sm:text-lg leading-relaxed text-muted-foreground max-w-xl">
              La forma moderna de crear documentos PDF usando componentes de React. Tipado seguro, alto rendimiento y
              una experiencia pensada para desarrolladores. Olvídate de pelear con librerías de bajo nivel.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
              <Link to="/playground">
                <Button size="lg" className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90">
                  Ir al Playground
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <a href="/docs">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-border bg-transparent text-foreground hover:bg-secondary"
                >
                  Ver documentación
                </Button>
              </a>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 rounded-lg border border-border bg-card p-2.5 sm:p-3 font-mono text-xs sm:text-sm">
              <span className="text-muted-foreground">$</span>
              <code className="flex-1 text-foreground truncate">{installCommand}</code>
              <button
                onClick={handleCopy}
                className="shrink-0 text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Copy install command"
              >
                {copied ? <Check className="h-4 w-4 text-accent" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="relative" style={{ maxWidth: "90vw" }} >
            <div className="absolute -inset-4 rounded-2xl bg-accent/5 blur-2xl" />
            <div className="relative" >
              <CodeBlock code={heroCode} language="tsx" filename="Template.tsx" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
