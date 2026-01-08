"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CodeBlock } from "./code-block"
import { ArrowRight, ExternalLink, Globe, Server, Shield, Zap } from "lucide-react"

const fetchCode = `
import fs from "fs";
import path from "path";

type ApiResponse = { data?: { pdf?: string } }
const ENDPOINT_API = "https://react-pdf-levelup-api.nimbux.cloud/api/pdf";

const petition = async ({ template, data }: { template: string, data: any }): Promise<string> => {
  const templatePath = path.join(process.cwd(), "src", "useExample", template);
  const tsxCode = fs.readFileSync(templatePath, "utf-8");
  const templateBase64 = Buffer.from(tsxCode, "utf-8").toString("base64");

  const res = await fetch(ENDPOINT_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ template: templateBase64, data }),
  });
  if (!res.ok) throw new Error(\`API error (\${res.status}): \${await res.text()}\`);
  const json = await res.json() as ApiResponse;
  return json?.data?.pdf ?? "";
}

const savePDF = (resultBase64: string) => {
  const buffer = Buffer.from(resultBase64, "base64");
  const outputPath = path.join(process.cwd(), "example.pdf");
  fs.writeFileSync(outputPath, buffer);
}

const generateAndSavePDF = async () => {
  const data = { nombre: "Genaro Gonzalez" };
  const resultBase64 = await petition({ template: "template.tsx", data });
  savePDF(resultBase64);
}
`.trim()

const endpointsText = `
https://react-pdf-levelup-api.nimbux.cloud/api/pdf
https://genarogg.github.io/react-pdf-levelup/public/api.zip
`.trim()

export function ApiSection() {
  const cloudUrl = "https://react-pdf-levelup-api.nimbux.cloud/api/pdf"
  const zipUrl = "https://genarogg.github.io/react-pdf-levelup/public/api.zip"
  const [copiedCloud, setCopiedCloud] = useState(false)
  const [copiedZip, setCopiedZip] = useState(false)

  const handleCopyCloud = () => {
    navigator.clipboard.writeText(cloudUrl)
    setCopiedCloud(true)
    setTimeout(() => setCopiedCloud(false), 1500)
  }

  const handleCopyZip = () => {
    navigator.clipboard.writeText(zipUrl)
    setCopiedZip(true)
    setTimeout(() => setCopiedZip(false), 1500)
  }

  return (
    <section id="api" className="border-t border-border px-4 py-16 sm:py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-secondary/50 px-3 py-1 text-xs sm:px-4 sm:py-1.5 sm:text-sm text-muted-foreground">
            <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-accent" />
            Multi‑lenguaje • HTTP • Self‑hosting
          </div>
          <h2 className="mt-3 text-2xl sm:text-3xl font-bold tracking-tight text-foreground lg:text-4xl text-balance">
            API REST que lleva React PDF Level Up a cualquier lenguaje
          </h2>
          <p className="mt-3 sm:mt-4 text-base sm:text-lg leading-relaxed text-muted-foreground">
            Integra generación de PDFs con templates React desde Node, Python, PHP, C#, Java y más.
            Envía tu template TSX en base64 junto con datos en JSON y recibe el PDF en base64 listo para guardar o enviar.
          </p>
        </div>

        <div className="mt-10 grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-accent" />
              <h3 className="text-sm font-semibold text-foreground">Funciona con cualquier lenguaje</h3>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">HTTP simple: usa tu stack actual sin cambios mayores.</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-accent" />
              <h3 className="text-sm font-semibold text-foreground">Integración inmediata</h3>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">POST JSON, respuesta base64: sin SDKs adicionales.</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-2">
              <Server className="h-5 w-5 text-accent" />
              <h3 className="text-sm font-semibold text-foreground">Cloud o Self‑hosting</h3>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">Usa el endpoint gestionado o despliega el ZIP.</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-accent" />
              <h3 className="text-sm font-semibold text-foreground">Seguro y escalable</h3>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">Contratos deterministas, fácil de horizontalizar.</p>
          </div>
        </div>

        <div className="mt-10 sm:mt-16 grid gap-8 lg:grid-cols-2 lg:gap-12 lg:items-start">
          <div className="flex flex-col gap-4">
            <div className="rounded-lg border border-border bg-card p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-semibold text-foreground">Endpoints</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Empieza en la nube o despliega tu propia instancia.
              </p>
              <div className="mt-4" style={{ maxWidth: "82vw" }}>
                <CodeBlock code={endpointsText} language="text" filename="Endpoints" />
              </div>
              <div className="mt-4 flex flex-col sm:flex-row sm:flex-wrap gap-3">
                <div className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto" onClick={handleCopyCloud} aria-label="Copiar Cloud API">
                    {copiedCloud ? "Copiado" : "Usar Cloud API"}
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </div>
                <div className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    variant="secondary"
                    className="w-full sm:w-auto font-semibold text-white"
                    onClick={handleCopyZip}
                    aria-label="Copiar enlace ZIP"
                  >
                    {copiedZip ? "Copiado" : "Descargar API ZIP"}
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </div>
                <a href="/docs/guides/api-rest" target="_blank" rel="noopener noreferrer">
                  <Button size="lg" variant="secondary" className="w-full sm:w-auto font-semibold text-white">
                    Ver documentación
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </a>
              </div>
            </div>

            <div className="rounded-lg border border-border bg-card p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-semibold text-foreground">Cómo funciona</h3>
              <ol className="mt-3 space-y-2 list-decimal list-inside text-sm text-muted-foreground">
                <li>Escribe tu template React (TSX) y conviértelo a base64.</li>
                <li>Envía un POST con JSON: {`{ template, data }`} al endpoint.</li>
                <li>Recibe {`data.pdf`} en base64 y decodifica al archivo.</li>
                <li>Guarda o entrega el PDF según tu caso de uso.</li>
              </ol>
            </div>

            <div className="rounded-lg border border-border bg-card p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-semibold text-foreground">Fuentes Personalizadas</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Para asegurar el correcto renderizado en el servidor, las fuentes deben cargarse desde{" "}
                <span className="font-semibold text-accent">URLs remotas absolutas</span> (https://...).
                No utilices rutas locales.
              </p>
              <div className="mt-4" style={{ maxWidth: "82vw" }}>
                <CodeBlock
                  code={`Font.register({
  family: "Lobster",
  fonts: [
    {
      src: "https://genarogg.github.io/react-pdf-levelup/public/font/Lobster-Regular.ttf",
      fontWeight: "normal",
    },
  ],
});`}
                  language="typescript"
                  filename="FontRegistration.ts"
                />
              </div>
            </div>
          </div>

          <div className="lg:sticky lg:top-8">
            <div className="shadow-lg" style={{ maxWidth: "90vw" }}>
              <CodeBlock code={fetchCode} language="ts" filename="API-fetch.ts" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
