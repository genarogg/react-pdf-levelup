// generatePDFonWorkerWorker.ts
//
// Archivo único y autocontenido para generar PDFs vía un pool de worker
// threads (Piscina). Piscina usa ESTE MISMO archivo compilado como entry
// point de cada worker (filename: __filename), así que corre con dos
// roles distintos según el hilo que lo cargue:
//
//  - Hilo principal (isMainThread === true): arma el pool UNA sola vez
//    y expone la API pública `generatePDFonWorker` / `closePDFPool`.
//  - Cada worker del pool (isMainThread === false): Piscina vuelve a
//    cargar este archivo y usa el export nombrado `__pdfWorkerHandler`
//    (ver `name` en las opciones de Piscina, más abajo) como la función
//    que ejecuta por cada tarea.
//
// El guard `isMainThread` en la creación del pool es lo que evita que
// cada worker, al recargar este mismo archivo, intente crear SU PROPIO
// pool y dispare workers hijos sin fin.
//
// Paridad uno a uno con `generarPDF` (no-worker): mismos `data`/`output`,
// mismo default ("base64"), mismo tipo de retorno (`string | Buffer`).
// Única diferencia: recibe `templatePath` (ruta de archivo) en vez de
// `template` (componente), porque un worker thread no puede recibir una
// función/componente a través del boundary de postMessage.

import { isMainThread } from "node:worker_threads";
import { createElement } from "react";
import Piscina from "piscina";
import { fileURLToPath, pathToFileURL } from "node:url";
/** Mismos valores que el `output` de `generarPDF` en su rama backend. */
type BackendOutput = "base64" | "buffer";

export interface PDFWorkerData {
    templatePath: string; // ruta absoluta al módulo que exporta el template (default export)
    data?: any;
    output?: BackendOutput;
}

/**
 * Renderiza un template a PDF y devuelve el Buffer crudo. Corre DENTRO de
 * cada worker: reimporta el módulo del template en ese hilo, lo que
 * también dispara -- una sola vez por worker, gracias al cache de
 * módulos ESM por hilo -- cualquier registro de fuentes a nivel de
 * módulo (como GetFuentes) que ocurra en ese archivo.
 *
 * Nota: siempre devuelve Buffer, nunca decide el `output`. La conversión
 * a base64 ocurre después, en `generatePDFonWorker` (hilo principal), una vez
 * recibido el resultado -- así se transfiere el binario compacto entre
 * threads en vez de un string base64 (~33% más pesado).
 */
async function renderInWorker({ templatePath, data }: PDFWorkerData): Promise<Buffer> {
    if (!templatePath) {
        throw new Error("templatePath not provided");
    }

    let mod: any;
    try {
        // pathToFileURL es necesario para que funcione en Windows: el loader
        // ESM de Node no acepta rutas absolutas tipo "A:\...\archivo.js" en
        // import() -- la letra de unidad seguida de ":" se interpreta como
        // el scheme de la URL. Hay que convertirla siempre a "file://...".
        const templateUrl = pathToFileURL(templatePath).href;
        mod = await import(templateUrl);
    } catch (error) {
        throw new Error(
            `No se pudo importar el template en "${templatePath}": ` +
                (error instanceof Error ? error.message : "Unknown error")
        );
    }

    const Template = mod?.default ?? mod;
    if (!Template || typeof Template !== "function") {
        throw new Error(`No se encontró un export default válido en "${templatePath}"`);
    }

    const { renderToStream } = await import("@react-pdf/renderer");
    const stream = await renderToStream(createElement(Template, { data }) as any);

    const chunks: Uint8Array[] = [];
    for await (const chunk of stream) {
        chunks.push(new Uint8Array(chunk as Buffer));
    }

    return Buffer.concat(chunks);
}

// Piscina, cuando carga este archivo como worker, busca este export default
// EN TEORÍA -- pero el barrel público (lib/mod/server/index.ts) reimporta
// este default y lo re-exporta como named export `__pdfWorkerHandler`. Por
// eso el `dist/index.js` final NO tiene `.default`, y hay que decirle a
// Piscina explícitamente qué named export usar (ver `name` más abajo).
export default renderInWorker;

/* ─────────────────────────────────────────────────────────
 * HILO PRINCIPAL — pool + API pública
 * ───────────────────────────────────────────────────────── */

const __filename = fileURLToPath(import.meta.url);

// Solo se crea si isMainThread es true. Si esto corriera también dentro
// de cada worker (porque Piscina reimporta este mismo archivo), cada
// worker terminaría armando su propio pool recursivamente.
const pool = isMainThread
    ? new Piscina({
          filename: __filename,
          // El barrel público (lib/mod/server/index.ts) re-exporta el
          // default de este archivo como named export `__pdfWorkerHandler`,
          // así que en dist/index.js no hay `.default`. Sin este `name`,
          // Piscina busca `.default`, no lo encuentra, y tira "No handler
          // function exported from ...dist/index.js".
          // Si el barrel renombra ese export, este string hay que
          // actualizarlo también.
          name: "__pdfWorkerHandler",
          // Sin maxThreads/minThreads: Piscina autodetecta según
          // os.availableParallelism() (maxThreads = parallelism * 1.5).
          // idleTimeout explícito: por defecto es 0, así que cualquier
          // worker por encima de minThreads se destruye apenas queda
          // libre y la próxima ráfaga vuelve a pagar el arranque en frío
          // (carga de @react-pdf/renderer). Con esto se mantienen
          // "tibios" 30s antes de matarlos.
          idleTimeout: 30_000,
      })
    : undefined;

/**
 * Igual que `generatePDFonWorker` (no-worker) en su rama backend, pero recibe
 * `templatePath` en vez de `template`.
 *
 * Backend (default output: "base64"): "base64" | "buffer"
 *
 * @example
 * const base64 = await generatePDFonWorker({ templatePath: "/abs/path/Invoice.js", data });
 *
 * @example Forzando buffer
 * const buffer = await generatePDFonWorker({ templatePath: "/abs/path/Invoice.js", data, output: "buffer" });
 */
export async function generatePDFonWorker({
    templatePath,
    data,
    output = "base64",
}: PDFWorkerData): Promise<string | Buffer> {
    if (!pool) {
        throw new Error("generatePDFonWorker solo puede invocarse desde el hilo principal.");
    }

    const buffer: Buffer = await pool.run({ templatePath, data });

    if (output === "buffer") {
        return buffer;
    }

    // output === "base64" (default)
    return buffer.toString("base64");
}

// Cierre ordenado del pool (esperar a que terminen las tareas en curso).
// Llamar, por ejemplo, en el hook onClose de Fastify al apagar el server.
export async function closePDFPool(): Promise<void> {
    await pool?.close();
}

export type { BackendOutput };