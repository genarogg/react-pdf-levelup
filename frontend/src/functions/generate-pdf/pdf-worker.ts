// pdf-worker.ts
// Lógica de renderizado que corre DENTRO de cada worker del pool.
// Piscina carga este archivo (ya compilado a .js) como entry point de cada thread.
import { createElement } from "react";

export interface PDFData {
  templatePath: string; // ruta absoluta al módulo que exporta el template (default export)
  data?: unknown;
}

export default async function renderPDF({ templatePath, data }: PDFData): Promise<string> {
  if (!templatePath) throw new Error("templatePath not provided");

  // Re-ejecuta el módulo del template dentro de este worker
  // (esto también dispara cualquier registro de fuentes que ocurra
  // a nivel de módulo en ese archivo, como GetFuentes)
  const mod = await import(templatePath);
  const Template = mod.default ?? mod;
  if (!Template) throw new Error(`No default export found at "${templatePath}"`);

  const { renderToStream } = await import("@react-pdf/renderer");
  const stream = await renderToStream(createElement(Template, { data }) as any);

  const chunks: Buffer[] = [];
  for await (const chunk of stream) chunks.push(chunk as Buffer);

  return Buffer.concat(chunks).toString("base64");
}
