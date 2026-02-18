"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CodeBlock } from "./code-block"
import { ArrowRight, ExternalLink, Globe, Server, Shield, Zap,Copy } from "lucide-react"
import { useTranslation } from "react-i18next"

const fetchCode = `
import fs from "fs";
import path from "path";

type ApiResponse = { data?: { pdf?: string } }
const ENDPOINT_API = "https://react-pdf-levelup.nimbux.cloud/api";

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
https://react-pdf-levelup.nimbux.cloud/api
// o descarga el ZIP con la API para desplegar tu propia instancia
https://genarogg.github.io/react-pdf-levelup/public/api.zip
`.trim()

export function ApiSection() {
  const cloudUrl = "https://react-pdf-levelup.nimbux.cloud/api"
  const [copiedCloud, setCopiedCloud] = useState(false)
  const { t } = useTranslation()

  const handleCopyCloud = () => {
    navigator.clipboard.writeText(cloudUrl)
    setCopiedCloud(true)
    setTimeout(() => setCopiedCloud(false), 1500)
  }

  return (
    <section id="api" className="border-t border-border px-4 py-16 sm:py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex w-fit items-center gap-2 rounded-full bg-accent/10 px-3 py-1 text-xs sm:px-4 sm:py-1.5 sm:text-sm font-medium text-accent">
            <span className="relative flex h-1.5 w-1.5 sm:h-2 sm:w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 sm:h-2 sm:w-2 bg-accent"></span>
            </span>
            {t("api.badge")}
          </div>
          <h2 className="mt-3 text-2xl sm:text-3xl font-bold tracking-tight text-foreground lg:text-4xl text-balance">
            {t("api.heading")}
          </h2>
          <p className="mt-3 sm:mt-4 text-base sm:text-lg leading-relaxed text-muted-foreground">
            {t("api.subheading")}
          </p>
        </div>

        <div className="mt-10 grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-accent" />
              <h3 className="text-sm font-semibold text-foreground">{t("api.features.anylang.title")}</h3>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{t("api.features.anylang.desc")}</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-accent" />
              <h3 className="text-sm font-semibold text-foreground">{t("api.features.instant.title")}</h3>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{t("api.features.instant.desc")}</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-2">
              <Server className="h-5 w-5 text-accent" />
              <h3 className="text-sm font-semibold text-foreground">{t("api.features.hosting.title")}</h3>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{t("api.features.hosting.desc")}</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-accent" />
              <h3 className="text-sm font-semibold text-foreground">{t("api.features.secure.title")}</h3>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{t("api.features.secure.desc")}</p>
          </div>
        </div>

        <div className="mt-10 sm:mt-16 grid gap-8 lg:grid-cols-2 lg:gap-12 lg:items-start">
          <div className="flex flex-col gap-4">
            <div className="rounded-lg border border-border bg-card p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-semibold text-foreground">{t("api.endpoints.heading")}</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {t("api.endpoints.desc")}
              </p>
              <div className="mt-4" style={{ maxWidth: "82vw" }}>
                <CodeBlock code={endpointsText} language="text" filename="Endpoints" />
              </div>
              <div className="mt-4 flex flex-col sm:flex-row sm:flex-wrap sm:justify-center gap-3">
                <Button size="default" className="w-full sm:w-auto" onClick={handleCopyCloud} aria-label="Copiar Cloud API">
                  {copiedCloud ? "Copiado" : "Copiar Endpoint Cloud"}
                  <Copy className="ml-2 h-4 w-4" />
                </Button>
                <a href="https://genarogg.github.io/react-pdf-levelup/public/api.zip" download="api.zip" className="w-full sm:w-auto">
                  <Button size="default" variant="secondary" className="w-full sm:w-auto font-semibold text-white" aria-label={t("api.endpoints.download_zip")}>
                    {t("api.endpoints.download_zip")} <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </a>
                <a href="/docs/guides/api-rest" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                  <Button size="default" variant="secondary" className="w-full font-semibold text-white">
                    {t("api.endpoints.docs")} <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </a>
              </div>
            </div>


            <div className="rounded-lg border border-border bg-card p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-semibold text-foreground">{t("api.how.heading")}</h3>
              <ol className="mt-3 space-y-2 list-decimal list-inside text-sm text-muted-foreground">
                <li>{t("api.how.i1")}</li>
                <li>{t("api.how.i2")}</li>
                <li>{t("api.how.i3")}</li>
                <li>{t("api.how.i4")}</li>
              </ol>
            </div>

            <div className="rounded-lg border border-border bg-card p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-semibold text-foreground">{t("api.fonts.heading")}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {t("api.fonts.desc")}
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
